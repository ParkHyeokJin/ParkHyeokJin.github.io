---
layout: post
title: 스프링으로 예약 작업 만들기(Spring Scheduling)
date:   2019-11-18 10:00:00
categories: Spring
category : Spring
comments: true 
---

이번에는 스프링을 이용해서 예약 작업을 만드는 방법에 대해서 정리 해보겠습니다.

예약 작업은 특정 시간이나 반복되는 시간에 업무를 처리하는 어플리케이션입니다.  
스프링에서는 예약 작업 기능을 제공함으로서 예약 작업을 편리하게 만들 수 있습니다.  

### 환경 구성

1. 기본 환경

    - Spring-boot 2.2.1.RELEASE
    - JDK 1.8 이상
    - Maven
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo.git>

2. 기능 목표

3. Maven

    ```xml
    <dependencies>
   		<dependency>
   			<groupId>org.springframework.boot</groupId>
   			<artifactId>spring-boot-starter</artifactId>
   		</dependency>
        <dependency>
           <groupId>org.projectlombok</groupId>
           <artifactId>lombok</artifactId>
           <version>1.18.10</version>
           <scope>provided</scope>
       </dependency>
    </dependencies> 
    ```
   
### 스프링 예약 작업 만들기

스프링에서 제공하는 예약 작업에는 아래와 같은 기능이 있습니다.

- cron() : cron 으로 시간을 설정하여 설정된 시간에 수행
- fixedDelay() : 작업 완료 된 시간에서 해당 지정 시간이 지난 뒤 수행
- fixedRate() : 메소드의 시작시간에서 측정하여 지정 시간이 지난 뒤 수행

예제를 통하여 각각 기능을 테스트 해보겠습니다.

- ScheduledTasks 클래스

```java
@Slf4j
@Component
public class ScheduledTasks {
	@Scheduled(fixedRate = 3000)
	public void fixedRate() {
		log.info("fidex Rate Test");
	}
	
	@Scheduled(fixedDelay = 5000)
	public void fixedDelay() {
		log.info("fidex Delay Test");
	}
	
	@Scheduled(cron = "*/10 * * * * *")
	public void cron() {
		log.info("cron Test");
	}
}
```

@Scheduled 어노테이션을 작성 하고 각각의 예약 작업에 맞는 옵션을 지정 합니다.

- 스프링 어플리케이션 실행 클래스

```java
@SpringBootApplication
@EnableScheduling
public class SpringSchedulerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringSchedulerApplication.class, args);
	}
}
```

@EnableScheduling 어노테이션을 작성 하여 예약 작업이 수행 되도록 합니다.

```text
2019-11-20 12:55:08.323  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : fidex Rate Test
2019-11-20 12:55:08.323  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : fidex Delay Test
2019-11-20 12:55:10.002  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : cron Test
2019-11-20 12:55:18.303  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : fidex Rate Test
2019-11-20 12:55:18.363  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : fidex Delay Test
2019-11-20 12:55:20.002  INFO 6276 --- [   scheduling-1] scheduler.ScheduledTasks                 : cron Test
```

각각의 예약 작업이 어떻게 수행 되는지 확인 할 수 있습니다.


> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler