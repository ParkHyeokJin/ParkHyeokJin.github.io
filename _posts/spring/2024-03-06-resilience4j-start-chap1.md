---
layout: post
title: SpringCloud-CircuitBreaker(resilience4j)
date:   2024-02-26 10:00:00
categories: Spring
category : Spring
comments: true 
---

### Resilience4j 란?

Resilience4j는 자바 언어로 개발된 내결함성 라이브러리입니다. 이 라이브러리는 분산 시스템에서 장애를 처리하고 시스템의 내결함성을 향상시키는 데 사용됩니다.  
Resilience4j는 일련의 내결함성 패턴을 구현하고, 이러한 패턴을 사용하여 애플리케이션을 더 견고하고 신뢰할 수 있도록 지원합니다.

1. __주요 기능 리스트__
   1. __Circuit Breaker__ : Circuit Breaker 패턴은 서비스 호출을 모니터링하고, 호출 실패 또는 지정된 실패률을 초과할 때 호출을 차단합니다. 이는 서비스의 과부하를 방지하고 시스템 전체의 가용성을 높입니다.

   2. __Retry__ : Retry 패턴은 재시도를 통해 임시적인 장애를 극복하는 데 사용됩니다. 서비스 호출이 실패하면, 일정 횟수만큼 다시 시도하여 성공할 때까지 시스템의 가용성을 유지합니다.

   3. __Rate Limiter__ : Rate Limiter 패턴은 서비스 호출의 빈도를 제한하여 과도한 부하를 방지합니다. 이를 통해 시스템이 처리할 수 있는 양의 요청을 관리하고, 서비스의 가용성을 보호합니다.

   4. __Bulkhead__ : Bulkhead 패턴은 서비스 호출을 격리하여 하나의 서비스 호출이 다른 호출에 영향을 주지 않도록 합니다. 이는 서비스 간의 의존성을 관리하고 시스템의 견고성을 향상시킵니다.


2. __Dependency__
```groovy
repositories {
    mavenCentral()
}

dependencies {
  implementation "io.github.resilience4j:resilience4j-circuitbreaker:${resilience4jVersion}"
  implementation "io.github.resilience4j:resilience4j-ratelimiter:${resilience4jVersion}"
  implementation "io.github.resilience4j:resilience4j-retry:${resilience4jVersion}"
  implementation "io.github.resilience4j:resilience4j-bulkhead:${resilience4jVersion}"
  implementation "io.github.resilience4j:resilience4j-cache:${resilience4jVersion}"
  implementation "io.github.resilience4j:resilience4j-timelimiter:${resilience4jVersion}"
}

//Add all
dependencies {
   implementation "io.github.resilience4j:resilience4j-all:${resilience4jVersion}"
}
```

### CircuitBreaker

써킷브레이커는 CLOSED, OPEN, HALF_OPEN의 세 가지 일반 상태와 DISABLED 및 FORCED_OPEN의 두 가지 특수 상태를 갖는 유한 상태 머신을 통해 구현 됩니다.

![써킷브레이커 이미지](https://files.readme.io/39cdd54-state_machine.jpg)

써킷브레이커는 슬라이딩 윈도우 기반으로 동작하며 아래 두가지 기능을 선택하여 사용 할 수 있습니다.

1. __카운트 기반 슬라이딩__

   카운트 기반 슬라이딩 윈도우는 지정된 카운트 개수의 요청을 체크 하여 해당 체크한 결과에 따라 동작 하는 방식 입니다.  
카운트 기반 슬라이딩 윈도우 기법은 원형 배열 구조로 구현 되어 있으며 윈도우 카운트 값이 10이라면 10개의 값을 체크 하고 갱신 합니다.  
새로운 요청이 들어오면 전체 값을 갱신 하며 오래된 측정 값은 제거 합니다. 스냅샷을 검색 하는 시간은 O(1) 으로 일정 하며 메모리 소비는 O(n)입니다.  


2. __시간 기반 슬라이딩 윈도우__

   시간 기반 슬라이딩 윈도우는 지정된 시간 만큼 요청을 버킷에 기록 해 두고 체크한 결과에 따라 동작 하는 방식 입니다.
만약 10초로 설정을 했다면 10개의 버킷 배열이 생성이 되고 각 버킷 별로 부분 집합을 수집 하게 됩니다.  
요청이 들어오면 점진적으로 전체 버킷을 업데이트 하게되며 오래된 부분 집계 부터 제거 하며 부분 집계 에는 실패한 호출 수, 느린 호출 수 및 총 호출 수를 계산 하기 위해
3개의 정수로 구성 되어 있으며 전체 시간은 Long 타입으로 저장 됩니다. 검색 하는 시간은 O(1) 이고 메모리 소비는 O(n) 입니다.  


3. __실패율 체크 및 느린 동작 체크__

   실패율이 50% 이상 도달 하게 되면 써킷 브레이커의 상태는 COSED 에서 OPEN 상태로 변경 되게 됩니다.  
모든 예외(Exception) 는 실패로 간주 되게 되며 예외 설정을 통해서 지정하거나 무시 하게 할 수 있습니다.
<br />  
   느린 동작의 또한 50% 이상 도달 하게 되면 써킷 브레이커의 상태는 CLOSED 에서 OPEN 상태로 변경 되게 됩니다.  
예를 들어 10개의 요청중 5초이상 지연된 요청이 5개 이상이 되면 써킷 브레이커의 상태가 변경 됩니다.
<br />  
   실패율과 느린동작이 동작 하게 되려면 최소 동작 개수 만큼 기록 되어야 하며 예를 들어 최소 동작 개수 가 10개로 설정 되었다면  
10개의 요청이 기록 되어야 평가하여 동작 하게 됩니다. 9개만 기록 된 경우에는 동작 하지 않습니다.  


4. __동작 방식__

   써킷 브레이커는 상태가 OPEN 인 경우 CallNotPermittedException 을 포함한 요청을 차단 합니다.  
OPEN 상태로 변경 되고 대기 시간이 지난 후에 HALF_OPEN 상태로 변경 되어 최소 동작 개수 만큼 기록 하여 체크 한 다음  
정상인 경우 CLOSED 상태로 변경 되게 되며 아닌 경우 OPEN 상태로 변경 됩니다.  
<br />
   써킷 브레이커는 DISABLE(항상 허용), FORCED_OPEN(항상 차단) 두개지 옵션을 더 제공 합니다.  
이 상태 일 경우에는 써킷 브레이커가 별도의 매트릭을 수집 하지 않으며 해당 상태를 변경 하기 위해서는 설정을 변경 하거나  
별도의 트리거를 통해서 설정 변경을 해야 합니다.  

   써킷 브레이커는 원자성이 보장된 요청은 Thread-safe 하며 특정 시점에 하나의 스레드만 윈도우에 기록 하도록 합니다.  


### CircuitBreaker Examples

1. __CircuitBreakerRegistry__  

   Resilience4j 는 스레드 안전성을 보장 하는 ConcurrentHashMap 을 기반 으로 CircuitBreaker 인스턴스를  
관리 할 수 있는 CircuitBreakerRegistry를 제공합니다. 

```java
@Configuration
public class Resilience4jRegistryConfig {
  private static final Logger LOG = LoggerFactory.getLogger(Resilience4jRegistryConfig.class);

  @Bean
  public CircuitBreakerRegistry circuitBreakerRegistry(CircuitBreakerConfig circuitBreakerConfig){
      // Create a CircuitBreakerRegistry with a custom global configuration
      return CircuitBreakerRegistry.of(circuitBreakerConfig);
  }

  @Bean
  @Primary
  public CircuitBreakerRegistry circuitBreakerRegistryEvents(CircuitBreakerConfig circuitBreakerConfig){
      // Create a CircuitBreakerRegistry And add Events Configuration
      CircuitBreakerRegistry circuitBreakerRegistry = CircuitBreakerRegistry.of(circuitBreakerConfig);
      circuitBreakerRegistry.getEventPublisher()
              .onEntryAdded(entryAddedEvent -> {
                CircuitBreaker addedCircuitBreaker = entryAddedEvent.getAddedEntry();
                LOG.info("CircuitBreaker {} added", addedCircuitBreaker.getName());
              })
              .onEntryRemoved(entryRemovedEvent -> {
                CircuitBreaker removedCircuitBreaker = entryRemovedEvent.getRemovedEntry();
                LOG.info("CircuitBreaker {} removed", removedCircuitBreaker.getName());
              });
      return circuitBreakerRegistry;
  }
}
```

2. __CircuitBreakerConfig__

| Config property | Default Value | Description                                                                                                                      |
|-----------------|---------------|----------------------------------------------------------------------------------------------------------------------------------|
|failureRateThreshold| 50            | 실패율 임계치(%)                                                                                                                       |
|slowCallRateThreshold| 100           | 지연율 임계치(%)                                                                                                                       |
|slowCallDurationThreshold| 60000 ms      | 지연 판단 시간(ms)                                                                                                                     |
|permittedNumberOfCallsInHalfOpenState| 10            | HALF_OPEN 상태일때 체크 하는 요청 개수                                                                                                       |
|maxWaitDurationInHalfOpenState| 0 ms          | HALF_OPEN 상태에서 요청을 대기하는 최대 시간. <br/> 0ms 는 HALF_OPEN 에서 요청 개수가 들어올때까지 무한정 대기하는 옵션을 말함.                                           |
|slidingWindowType| COUNT_BASED   | 슬라이딩 윈도우 타입 <br/>[COUNT_BASED, TIME_BASED]                                                                                       |
|slidingWindowSize| 100           | 슬라이딩 윈도우 사이즈                                                                                                                     |
|minimumNumberOfCalls| 100           | 서킷브레이커가 체크 할 최소 요청 갯수.  <br/>최소 요청 갯수에 도달하지 않은 경우에는 서킷브레이커가 작동 하지 않음.                                                            |
|waitDurationInOpenState| 60000 ms      | OPEN 상태에서 HALF_OPEN으로 변경되기전 대기시간.  <br/>해당 시간이 지난후 HALF_OPEN 을 하여 체크 한뒤 결과에 따라 CLOSED & OPEN 상태로 변경 한다.                          |
|automaticTransitionFromOpenToHalfOpenEnabled| false         | false : OPEN 에서 HALF_OPEN으로 변경 되었을 경우 호출이 들어온 스레드만 상태가 변경됨. 모든 스레드가 상태를 체크 하지 않아도 됨. <br/>true : 모든 스레드가 상태 모니터링을 하여 상태 변경시 적용됨. |
|recordExceptions| empty         | 실패로 기록 되는 예외                                                                                                                     |
|ignoreExceptions| empty         | 실패에 무시 되는 예외                                                                                                                     |
|recordFailurePredicate|  throwable -> true             | 예외가 실패로 기록 되어야 할지 커스텀 옵션. 체크 하여 true 를 반환 하는 경우 실패 카운팅.                                                                          |
|ignoreExceptionPredicate|  throwable -> false             | 예외가 무시 될지 아닐지 커스텀 옵션. true : 예외 무시, false : 실패 카운팅.                                                                              |



* Create a Resilience4jConfig

```java
@Configuration
public class Resilience4jConfig {

    private static final Logger LOG = LoggerFactory.getLogger(Resilience4jConfig.class);

    @Bean
    public CircuitBreakerConfig circuitBreakerConfig(){
        return CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .slowCallRateThreshold(50)
                .waitDurationInOpenState(Duration.ofMillis(1000))
                .slowCallDurationThreshold(Duration.ofSeconds(2))
                .permittedNumberOfCallsInHalfOpenState(3)
                .minimumNumberOfCalls(10)
                .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.TIME_BASED)
                .slidingWindowSize(5)
                .recordException(e -> INTERNAL_SERVER_ERROR.equals(getResponse().getStatus()))
                .recordExceptions(IOException.class, TimeoutException.class)
                .ignoreExceptions(BusinessException.class, OtherBusinessException.class)
                .build();
    }

    @Bean
    public CircuitBreaker circuitBreakerWithDefaultConfig(CircuitBreakerRegistry circuitBreakerRegistry){
        // Get or create a CircuitBreaker from the CircuitBreakerRegistry
        // with the global default configuration
        return circuitBreakerRegistry.circuitBreaker("defaultCircuitBreaker");
    }

    @Bean
    public CircuitBreaker circuitBreakerWithCustomConfig(CircuitBreakerConfig circuitBreakerConfig, CircuitBreakerRegistry circuitBreakerRegistry){
        // Get or create a CircuitBreaker from the CircuitBreakerRegistry
        // with a custom configuration
        return circuitBreakerRegistry
                .circuitBreaker("customCircuitBreaker", circuitBreakerConfig);
    }

    @Bean
    public CircuitBreaker circuitBreakerAddEvents(CircuitBreakerRegistry circuitBreakerRegistry){
        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker("circuitBreakerAddEvents");
        circuitBreaker.getEventPublisher()
                .onSuccess(event -> LOG.info(event.toString()))
                .onError(event -> LOG.info(event.toString()))
                .onIgnoredError(event -> LOG.info(event.toString()))
                .onReset(event -> LOG.info(event.toString()))
                .onStateTransition(event -> LOG.info(event.toString()));

        // to all events, you can do:
        circuitBreaker.getEventPublisher()
                .onEvent(event -> LOG.info(event.toString()));

        return circuitBreaker;
    }
}
```

### SpringBoot 2 & 3 에서의 사용

1. __Dependency__

```groovy
dependencies {
   implementation('org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j')
   //implementation('org.springframework.cloud:spring-cloud-starter-circuitbreaker-reactor-resilience4j') //reactive
}
```

2. __application.yaml__

```yaml
# Ex1. default config
resilience4j.circuitbreaker:
   instances:
      backendA:
         registerHealthIndicator: true
         slidingWindowSize: 100
      backendB:
         registerHealthIndicator: true
         slidingWindowSize: 10
         permittedNumberOfCallsInHalfOpenState: 3
         slidingWindowType: TIME_BASED
         minimumNumberOfCalls: 20
         waitDurationInOpenState: 50s
         failureRateThreshold: 50
         eventConsumerBufferSize: 10
         recordFailurePredicate: io.github.robwin.exception.RecordFailurePredicate

# Ex2. custom config
resilience4j.circuitbreaker:
   configs:
      default:
         slidingWindowSize: 100
         permittedNumberOfCallsInHalfOpenState: 10
         waitDurationInOpenState: 10000
         failureRateThreshold: 60
         eventConsumerBufferSize: 10
         registerHealthIndicator: true
      someShared:
         slidingWindowSize: 50
         permittedNumberOfCallsInHalfOpenState: 10
   instances:
      backendA:
         baseConfig: default
         waitDurationInOpenState: 5000
      backendB:
         baseConfig: someShared
```

```java
@Service
public class HelloCircuit {
    @CircuitBreaker(name="backendA", fallbackMethod = "fallback")
    public String hello(){
       int randomInt = new Random().nextInt(10);
       if(randomInt <= 8) {
          throw new RuntimeException("failed");
       }
       return "hello CircuitBreaker!!!";
    }

   private String fallback(Throwable t) {
      return "fallback invoked! exception type : " + t.getClass();
   }
}
```



