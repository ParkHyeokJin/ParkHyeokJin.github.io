---
layout: post
title: Jenkins Pipeline에서 Spring Batch 안전하게 종료시키기
date: 2025-08-04 09:00:00
categories: Spring
category: Spring
comments: true
---

# 개요

Jenkins Pipeline과 Spring Batch를 활용한 배치 서비스 구성 중 발견된 배치 종료 관련 이슈와 해결 방법을 공유합니다.

# 문제 상황

## 유즈 케이스

Jenkins Pipeline을 활용하여 배치를 수행하는 환경에서 다음과 같은 요구사항이 있었습니다:

- 배치 수행 중 오류 발생 시 → **비정상 종료** (Exit Code ≠ 0)
- Jenkins Pipeline 자동 중단
- 후속 작업 실행 방지

## 발생한 문제

```
기대: 배치 오류 발생 → 비정상 종료(ExitCode ≠ 0) → Jenkins Pipeline 중단
실제: 배치 오류 발생 → 정상 종료(ExitCode = 0) → Jenkins Pipeline 계속 실행 ❌
```

**실제 사례**: 아카이빙 배치에서 복사 실패 후에도 삭제 작업이 수행되어 데이터 손실 발생

# 원인 분석

## AbstractJob.class 분석

### 실행 흐름

```java
public final void execute(JobExecution execution) {
    try {
        // 1. Job 상태를 STARTED로 업데이트
        execution.setStartTime(LocalDateTime.now());
        this.updateStatus(execution, BatchStatus.STARTED);

        // 2. beforeJob 리스너 실행
        this.listener.beforeJob(execution);

        // 3. 실제 Job 실행
        this.doExecute(execution);

    } catch (JobInterruptedException e) {
        // 4. 예외 발생 시 Job 상태를 STOPPED로 업데이트
        execution.setExitStatus(this.getDefaultExitStatusForFailure(e, execution));
        execution.setStatus(BatchStatus.max(BatchStatus.STOPPED, e.getStatus()));
        execution.addFailureException(e);

    } finally {
        // 5. afterJob 리스너 실행
        this.listener.afterJob(execution);

        // 6. Job 결과를 DB에 업데이트
        this.jobRepository.update(execution);

        // 7. 애플리케이션은 정상 종료 (Exit Code = 0)
    }
}
```

### 핵심 문제점

```java
// Job 실패 기록 후에도...
execution.setStatus(BatchStatus.FAILED);
this.jobRepository.update(execution);

// 애플리케이션은 정상 종료됨
System.exit(0); // ← 이게 문제!
```

## AbstractStep.class 분석

### 실행 흐름

```java
public final void execute(StepExecution stepExecution) {
    try {
        // 1. Step 상태를 STARTED로 업데이트
        this.getCompositeListener().beforeStep(stepExecution);
        this.open(stepExecution.getExecutionContext());

        // 2. 실제 Step 실행
        this.doExecute(stepExecution);

    } catch (Throwable e) {
        // 3. 예외 발생 시 Step 상태 업데이트
        stepExecution.upgradeStatus(determineBatchStatus(e));
        exitStatus = exitStatus.and(this.getDefaultExitStatusForFailure(e));
        stepExecution.addFailureException(e);

    } finally {
        // 4. afterStep 리스너 실행
        exitStatus = exitStatus.and(this.getCompositeListener().afterStep(stepExecution));

        // 5. Step 결과를 DB에 업데이트
        this.getJobRepository().updateExecutionContext(stepExecution);
    }
}
```

## 분석 결론

> **Spring Batch Core는 배치 실행 결과를 DB에 기록하지만, 애플리케이션 종료 코드(Exit Code)에는 관여하지 않는다.**

즉, Job이 실패해도 `System.exit(0)`으로 정상 종료되어 Jenkins는 배치가 성공한 것으로 인식합니다.

# 해결 방법

## 1. JobListener를 활용한 Exit Code 제어

### BatchJobListener 구현

```java
@Slf4j
@Component
public class BatchJobListener implements JobExecutionListener {

    private boolean succeed = false;

    @Override
    public void beforeJob(JobExecution jobExecution) {
        String jobName = jobExecution.getJobInstance().getJobName();
        log.info("[JOB] Batch Job Started: {}", jobName);
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        String jobName = jobExecution.getJobInstance().getJobName();
        String parameters = this.printParameters(jobExecution.getJobParameters().getParameters());
        BatchStatus status = jobExecution.getStatus();

        // Job 실행 결과를 succeed 플래그에 저장
        this.succeed = (status == BatchStatus.COMPLETED);

        log.info("[JOB] Batch Job Finished - Name: {}, Parameters: {}, Status: {}",
                 jobName, parameters, status);
    }

    public boolean isSucceed() {
        return succeed;
    }

    private String printParameters(Map<String, JobParameter<?>> parameters) {
        return parameters.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue().getValue())
                .collect(Collectors.joining(", "));
    }
}
```

### ExitCodeGenerator 구현

```java
@Component
@RequiredArgsConstructor
public class CustomExitCodeGenerator implements ExitCodeGenerator {

    private final BatchJobListener batchJobListener;

    @Override
    public int getExitCode() {
        // 배치 성공 시 0, 실패 시 1 반환
        return batchJobListener.isSucceed() ? 0 : 1;
    }
}
```

### Main Application 수정

```java
@SpringBootApplication
public class BatchApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context =
            SpringApplication.run(BatchApplication.class, args);

        // ExitCodeGenerator가 반환한 코드로 애플리케이션 종료
        int exitCode = SpringApplication.exit(context);
        System.exit(exitCode);
    }
}
```

## 2. StepListener를 활용한 세밀한 제어 (선택사항)

Step 단위로 더 세밀한 제어가 필요한 경우:

```java
@Slf4j
@Component
public class CustomStepExecutionListener implements StepExecutionListener {

    @Override
    public void beforeStep(StepExecution stepExecution) {
        log.info("[STEP] Step Started: {}", stepExecution.getStepName());
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        String stepName = stepExecution.getStepName();
        BatchStatus status = stepExecution.getStatus();

        log.info("[STEP] Step Finished - Name: {}, Status: {}", stepName, status);

        // Step 실패 시 Job도 실패 처리
        if (status == BatchStatus.FAILED) {
            return ExitStatus.FAILED;
        }

        return stepExecution.getExitStatus();
    }
}
```

# 동작 원리

## Before (문제 상황)

```
┌─────────────────────┐
│   Spring Batch      │
│   Job 실패 발생     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  DB에 FAILED 기록   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  System.exit(0)     │  ← 정상 종료!
│  Exit Code = 0      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Jenkins Pipeline   │
│  계속 진행... ❌    │
└─────────────────────┘
```

## After (해결 후)

```
┌─────────────────────┐
│   Spring Batch      │
│   Job 실패 발생     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  DB에 FAILED 기록   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  JobListener        │
│  succeed = false    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ExitCodeGenerator   │
│  return 1           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  System.exit(1)     │  ← 비정상 종료!
│  Exit Code = 1      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Jenkins Pipeline   │
│  중단됨 ✅          │
└─────────────────────┘
```

# 테스트 결과

## 1. 정상 종료 테스트

### DB 상태 확인

```sql
SELECT JOB_INSTANCE_ID, JOB_NAME, STATUS, EXIT_CODE
FROM BATCH_JOB_EXECUTION
WHERE JOB_INSTANCE_ID = 123;
```

| JOB_INSTANCE_ID | JOB_NAME | STATUS | EXIT_CODE |
|-----------------|----------|---------|-----------|
| 123 | archivingJob | COMPLETED | COMPLETED |

### Exit Code 확인

```bash
$ echo $?
0
```

## 2. 실패 종료 테스트

### DB 상태 확인

```sql
SELECT JOB_INSTANCE_ID, JOB_NAME, STATUS, EXIT_CODE
FROM BATCH_JOB_EXECUTION
WHERE JOB_INSTANCE_ID = 124;
```

| JOB_INSTANCE_ID | JOB_NAME | STATUS | EXIT_CODE |
|-----------------|----------|---------|-----------|
| 124 | archivingJob | FAILED | FAILED |

### Exit Code 확인

```bash
$ echo $?
1
```

### Jenkins Console Output

```
[Pipeline] sh
+ java -jar batch-application.jar
[JOB] Batch Job Started: archivingJob
[ERROR] Failed to copy files: Connection timeout
[JOB] Batch Job Finished - Status: FAILED
ERROR: Build step failed with exit code 1
Finished: FAILURE
```

## 3. Jenkins Pipeline 통합

```groovy
pipeline {
    agent any

    stages {
        stage('Run Batch') {
            steps {
                script {
                    def exitCode = sh(
                        script: 'java -jar batch-application.jar',
                        returnStatus: true
                    )

                    if (exitCode != 0) {
                        error("Batch job failed with exit code: ${exitCode}")
                    }
                }
            }
        }

        stage('Post Processing') {
            steps {
                echo 'This stage will not run if batch failed'
            }
        }
    }

    post {
        failure {
            // Slack, Email 등 알림 전송
            mail to: 'team@example.com',
                 subject: "Batch Job Failed: ${env.JOB_NAME}",
                 body: "Batch execution failed. Check Jenkins console output."
        }
    }
}
```

# Spring ExitCodeGenerator 인터페이스

Spring Boot에서 제공하는 `ExitCodeGenerator` 인터페이스를 활용하면 애플리케이션 종료 코드를 우아하게 제어할 수 있습니다.

## 주요 메서드

```java
public interface ExitCodeGenerator {
    /**
     * Returns the exit code that should be returned from the application.
     * @return the exit code
     */
    int getExitCode();
}
```

## 사용 방법

```java
// 1. ExitCodeGenerator 구현
@Component
public class CustomExitCodeGenerator implements ExitCodeGenerator {
    @Override
    public int getExitCode() {
        return 1; // 비정상 종료
    }
}

// 2. SpringApplication.exit() 활용
int exitCode = SpringApplication.exit(context);
System.exit(exitCode);
```

## 공식 문서

[Spring Boot API - ExitCodeGenerator](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/ExitCodeGenerator.html)

# 추가 개선 방안

## 1. 재시도 정책과 연계

```java
@Override
public void afterJob(JobExecution jobExecution) {
    BatchStatus status = jobExecution.getStatus();

    if (status == BatchStatus.FAILED) {
        // 재시도 가능한 오류인지 확인
        List<Throwable> exceptions = jobExecution.getAllFailureExceptions();
        boolean isRetryable = exceptions.stream()
            .anyMatch(e -> e instanceof RetryableException);

        if (isRetryable) {
            log.warn("Job failed with retryable exception. Jenkins can retry.");
            // Exit code 2 = 재시도 가능
            this.exitCode = 2;
        } else {
            log.error("Job failed with non-retryable exception.");
            // Exit code 1 = 재시도 불가
            this.exitCode = 1;
        }
    }
}
```

## 2. Jenkins Plugin 연계

### Exit Code별 처리

```groovy
stage('Run Batch') {
    steps {
        script {
            def exitCode = sh(
                script: 'java -jar batch.jar',
                returnStatus: true
            )

            if (exitCode == 2) {
                // 재시도 가능한 오류
                retry(3) {
                    sh 'java -jar batch.jar'
                }
            } else if (exitCode == 1) {
                // 치명적 오류 - 즉시 중단
                error("Critical error occurred")
            }
        }
    }
}
```

## 3. 모니터링 연계

```java
@Override
public void afterJob(JobExecution jobExecution) {
    BatchStatus status = jobExecution.getStatus();

    // Metrics 수집
    if (status == BatchStatus.COMPLETED) {
        metricsService.recordSuccess(jobExecution);
    } else {
        metricsService.recordFailure(jobExecution);

        // 알림 전송
        alertService.sendAlert(
            "Batch job failed: " + jobExecution.getJobInstance().getJobName(),
            jobExecution.getAllFailureExceptions()
        );
    }

    this.succeed = (status == BatchStatus.COMPLETED);
}
```

# 정리

## 핵심 요약

✅ **문제**: Spring Batch는 Job 실패 시에도 Exit Code 0으로 정상 종료
✅ **해결**: JobExecutionListener + ExitCodeGenerator로 Exit Code 제어
✅ **효과**: Jenkins가 배치 실패를 정확히 감지하여 Pipeline 자동 중단

## 구현 체크리스트

- [ ] `JobExecutionListener` 구현
- [ ] `ExitCodeGenerator` 구현 및 Bean 등록
- [ ] `main()` 메서드에 `SpringApplication.exit()` 적용
- [ ] Jenkins Pipeline에서 Exit Code 확인 로직 추가
- [ ] 배치 실패 시 알림 설정 (선택)
- [ ] 재시도 정책 설정 (선택)

## 기대 효과

1. **정확한 장애 감지**: Jenkins가 배치 실패를 즉시 인식
2. **자동화된 Fallback**: 실패 시 후속 작업 자동 중단
3. **모니터링 개선**: Exit Code 기반 알림 및 메트릭 수집 가능
4. **안전한 운영**: 데이터 손실 방지 (복사 실패 시 삭제 방지)

## 참고 자료

- [Spring Batch Reference Documentation](https://docs.spring.io/spring-batch/docs/current/reference/html/)
- [Spring Boot ExitCodeGenerator](https://docs.spring.io/spring-boot/api/java/org/springframework/boot/ExitCodeGenerator.html)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)

---

복잡한 배치 Pipeline을 Jenkins와 함께 구성하고 있다면, 이 내용이 유용할 것입니다. 배치 안정성과 모니터링 품질을 크게 향상시킬 수 있습니다.