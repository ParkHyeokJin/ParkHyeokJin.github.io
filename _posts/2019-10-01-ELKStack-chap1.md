---
layout: post
title: ELK STACK(Elastic Search, Kibana, Logstash) 이란 ?
date:   2019-09-26 10:10:00
categories: others
comments: true 
---

ELK 란?

ELK 란 Elastic Search, Kibana, Logstash 를 말한다.

ELK Stack 이란?

ELK 기능에 Beats가 더해져서 Stack 이라고 말한다.

- Beats : 데이터 수집기로 로그 파일, 네트워크 데이터, 이벤트 로그, 감사데이터 등등을 수집하여 Elastaic Search 나 Logstash로 전송 한다.

### Elastic Search 란?

분산 검색 엔진으로 Logstash 로 부터 수집된 데이터를 저장하고 관리 한다.

- Elastic Search 의 활용
    - 애플리케이션 검색
    - 웹사이트 검색
    - 엔터프라이즈 검색
    - 로깅과 로그 분석
    - 인프라 메트릭과 컨테이너 모니터링
    - 애플리케이션 성능 모니터링
    - 위치 기반 정보 데이터 분석 및 시각화
    - 보안 분석
    - 비즈니스 분석

- Elastic Search 와 관계형 데이터베이스의 개념 비교

    | Elastic Search | Relational DB |
    |---|---|
    | index | Database |
    | Type | Table |
    | Document | Row |
    | Field | Column |
    | Mapping | Schema |

- Elastic Search 에서는 Rest API 를 사용 하여 데이터 처리를 하게 되며 해당 명령어는 다음과 같다.

    | Elastic Search | Relational DB | CRUD |
    |---|---|---|
    |GET|Select|Read|
    |PUT|Update|Update|
    |POST|Insert|Create|
    |DELETE|Delete|Delete|

### Logstash 란?

Logstash 는 다양한 곳에서 데이터를 수집 하는 데이터 수집기 이다. 수집된 데이터는 Elasticsearch 로 전송 된다.

### Kibana 란?
Kibana는 수집된 데이터를 시각화 하는 도구 이다. 실시간 히스토그램, 선 그래프, 파이 차트, 지도 등을 제공하며   
사용자가 자신의 데이터를 기반으로 사용자 정의한 동적 인포그래픽을 만들 수 있는 Canvas,   
위치 기반 정보 데이터를 시각화하기 위한 Elastic Maps 같은 고급 애플리케이션도 포함되어있다.

