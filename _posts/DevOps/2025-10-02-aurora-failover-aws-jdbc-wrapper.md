---
layout: post
title: Aurora 클러스터 Failover 대응 - AWS JDBC Wrapper 적용기
date: 2025-10-02 09:00:00
categories: DevOps
category: DevOps
comments: true
---

# 개요

AWS Aurora 환경에서 동작하는 애플리케이션의 DB Failover 처리를 위해 AWS JDBC Wrapper를 적용하고, 각 옵션별 동작 원리를 분석한 내용을 공유합니다.

# AWS JDBC Wrapper란?

AWS JDBC Wrapper는 Amazon Aurora 클러스터 환경에서 장애 발생 시 자동으로 Writer/Reader 노드를 전환하여 애플리케이션의 가용성을 높이는 JDBC 드라이버 래퍼입니다.

## 주요 기능

- **Failover Plugin**: 장애 시 Writer → Reader 자동 전환
- **EFM2 (Enhanced Failure Monitoring)**: DB 노드 상태를 백그라운드 스레드로 감시
- **클러스터 토폴로지 자동 갱신**: Aurora 클러스터 구성 변경 자동 감지

# 적용 방법

## 1. Gradle 의존성 추가

```gradle
implementation("software.amazon.jdbc:aws-advanced-jdbc-wrapper:2.6.0")
implementation("com.mysql:mysql-connector-j:9.3.0")
```

## 2. DataSource 설정

```yaml
my-db:
  datasource:
    writer:
      driver-class-name: software.amazon.jdbc.Driver
      connection-timeout: 3000
      socket-timeout: 30000
      max-lifetime: 3500000
      leak-detection-threshold: 3000
      data-source-properties:
        cachePrepStmts: true
        prepStmtCacheSize: 250
        prepStmtCacheSqlLimit: 2048
        useServerPreparedStatement: true
        useLocalSessionState: true
        cacheResultSetMetadata: true
        maintainTimeStats: false
        wrapperPlugins: failover, efm2
        failoverTimeoutMs: 30000
        failoverClusterTopologyRefreshRateMs: 2000
        failureDetectionEnabled: true
        failureDetectionTime: 5000
        failureDetectionCount: 3
      exception-override-class-name: software.amazon.jdbc.util.HikariCPSQLException
```

## 3. JDBC URL 설정

```
jdbc:aws-wrapper:mysql://<cluster-endpoint>/<DB명>?clusterInstanceHostPattern=?.myDb.ap-northeast-2.rds.amazonaws.com
```

⭐️⭐️⭐️⭐️ **중요**: `clusterInstanceHostPattern`은 Aurora 클러스터 환경에서 필수 설정입니다. 이 패턴을 통해 클러스터 내 인스턴스를 식별하고 라우팅합니다.

## 4. JVM 옵션 추가

```bash
-Dnetworkaddress.cache.ttl=60 -Dnetworkaddress.cache.negative.ttl=10
```

DNS 캐시 TTL을 짧게 설정하여 Failover 시 신속한 DNS 갱신을 보장합니다.

# 주요 옵션 상세 설명

| 옵션 | 설명 | 기본 동작 / 구동 방식 |
|------|------|---------------------|
| `wrapperPlugins` | JDBC Wrapper에서 활성화할 플러그인 지정 | failover: 장애 시 Writer → Reader 자동 전환<br>efm2: Enhanced Failure Monitoring |
| `failoverTimeoutMs` | Failover 전체 프로세스 최대 허용 시간(ms) | 30초 초과 시 Failover 실패 처리 |
| `failoverClusterTopologyRefreshRateMs` | 클러스터 토폴로지 갱신 주기(ms) | 2초마다 Aurora 클러스터 노드 정보 갱신 |
| `failureDetectionEnabled` | EFM2 감시 기능 활성화 여부 | true면 Ping 기반 헬스 체크 스레드 실행 |
| `failureDetectionTime` | Ping 요청 타임아웃(ms) | 5초 내 DB 응답 없으면 1회 실패로 간주 |
| `failureDetectionCount` | 연속 실패 기준 | 3회 연속 Ping 실패 시 노드 비정상 판단 |
| `exception-override-class-name` | Failover 발생 시 예외 래핑 클래스 | HikariCP 친화적 예외로 변환 |

# Failover 동작 시나리오

## 정상 동작 시

1. **토폴로지 갱신**: 2초마다 클러스터 노드 정보 갱신 (`failoverClusterTopologyRefreshRateMs`)
2. **연결 풀 관리**: HikariCP 풀에서 기존 커넥션 재사용

## 장애 발생 시

### 치명적 오류 (Connection Closed)
```
SqlState.CONNECTION_NOT_OPEN (08003)
SqlState.CONNECTION_FAILURE (08006)
SqlState.COMMUNICATION_ERROR (08S01)
```
→ **즉시 Failover 시도**

### 일반 오류 (복구 가능)
```
커넥션 오류가 아닌 경우
```
→ **회복 시도**: 5초 주기로 재시도, 3번 연속 실패 시 Failover 수행

## Failover 수행 과정

```java
private void invalidInvocationOnClosedConnection() throws SQLException {
    if (!this.closedExplicitly.get()) {
        // 커넥션이 명시적으로 닫히지 않은 경우 → 복구 시도
        this.isClosed = false;
        this.closedReason = null;
        this.pickNewConnection();
        throw new FailoverSuccessSQLException();
    } else {
        // 커넥션이 명시적으로 닫힌 경우 → 즉시 Failover
        throw new SQLException(reason, SqlState.CONNECTION_NOT_OPEN.getState());
    }
}
```

# 테스트 결과

## Writer DB 장애 발생 시

```log
2025-10-22 08:56:37.416  INFO [auth-api] s.a.j.p.f.FailoverConnectionPlugin : Starting writer failover procedure.
2025-10-22 08:56:37.658 ERROR [auth-api] s.a.j.p.f.FailoverConnectionPlugin : The active SQL connection has changed due to a connection failure.
2025-10-22 08:56:37.659  WARN [auth-api] com.zaxxer.hikari.pool.PoolBase : HikariPool-1 - Failed to validate connection
```

| 조건 | 발생 이벤트 | 동작 결과 | 비고 |
|------|------------|----------|------|
| Writer DB 노드 장애 발생 | FailoverConnectionPlugin이 writer failover 절차 수행 | 기존 커넥션 제거, 새 커넥션으로 대체, reader/writer 노드 전환 | HikariCP WARN은 일반 경고, 무시 가능 |

## 주요 발견 사항

### ✅ Failover 성공 케이스
- DB 쿼리 인입 시 Writer DB 노드 이슈 발생 → **Failover 정상 수행**
- 기존 커넥션 제거 및 새 커넥션 생성
- Writer/Reader 노드 전환 완료

### ⚠️ 제한 사항
- **DB 접근이 없으면 Failover 미수행**: HikariCP Pool 기반이므로 실제 쿼리 실행 시점에만 상태 체크
- **EFM2 감시 기능의 한계**: Ping 기반 선제적 감시지만, 커넥션 풀 환경에서는 실효성 제한적

# HikariCP와의 통합 고려사항

## 권장 설정

```yaml
max-lifetime: 3500000  # DB idle timeout보다 짧게 설정 (DB: 3600s)
connection-timeout: 3000
socket-timeout: 30000
leak-detection-threshold: 3000
```

## 주의사항

1. **maxLifetime 설정**: DB의 `wait_timeout`보다 짧게 설정하여 커넥션 끊김 방지
2. **exception-override-class-name**: HikariCP 친화적 예외 처리를 위해 반드시 설정
3. **DNS 캐시 TTL**: JVM 옵션으로 DNS 캐시 시간 단축 필요

# 결론

AWS JDBC Wrapper를 적용하면 Aurora 클러스터 환경에서 자동 Failover를 통해 애플리케이션 가용성을 크게 향상시킬 수 있습니다.

## 핵심 포인트

✅ **실시간 토폴로지 갱신**: 2초마다 클러스터 구성 변경 감지
✅ **자동 노드 전환**: Writer 장애 시 자동으로 Reader로 전환
✅ **HikariCP 통합**: 커넥션 풀과 자연스러운 통합

⚠️ **주의**: 쿼리 실행 시점에만 Failover 수행되므로, 헬스체크 쿼리 등을 통한 주기적인 연결 확인 권장

## 참고 자료

- [AWS JDBC Driver GitHub](https://github.com/awslabs/aws-advanced-jdbc-wrapper)
- [AWS RDS Aurora Failover 가이드](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html)