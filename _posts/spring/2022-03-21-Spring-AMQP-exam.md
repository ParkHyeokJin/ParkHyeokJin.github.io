---
layout: post
title: Spring AMQP 를 활용한 메시징 서비스 구축(with rabbitMQ)
date:   2022-03-21 10:00:00
categories: Spring
category : Spring
comments: true 
---

### AMQP(Advanced Message Queuing Protocol)

AMQP(Advanced Message Queuing Protocol, 어드밴스트 메시지 큐잉 프로토콜) 은 메시지 지향 미들웨어를 위한 개방형 표준 응용 계층 프로토콜입니다.  
메시지 전달의 전달 보증, 신뢰성, 라우팅을 위한 기능 입니다.

무중단 서비스, 서비스의 scale-out, MSA 등을 위해서는 MQ를 사용 하는 시스템 구조가 유용합니다.    
MQ 에는 여러 가지 서비스가 있으나 사내에서 사용한 RabbitMQ, Kafka 서비스가 대표적이며 
이번 섹션에서는 간단한 예제를 통해서 Spring for RabbitMQ 을 활용 한 이벤트 기반의 RabbitMQ 메시징 서비스를 정리 해보도록 하겠습니다.     

### 환경 구성

1. 기본 환경

    - Spring-boot 2.6
    - JDK 1.8 이상
    - gradle
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRabbitMQExam.git>
    - Docker (RabbitMQ 설치용)

2. Dependency
    
    - org.springframework.boot:spring-boot-starter-amqp

3. 목표

    - Spring AMQP 서비스를 사용하여 Producer, Consumer 를 구성하여 간단한 메시지 서비스를 만들어 본다.

#### 개발 환경 구성

RabbitMQ 설치는 docker hub(https://hub.docker.com/_/rabbitmq) 에서 간단히 설치 할 수 있습니다.  

> docker pull rabbitmq

rabbit 이미지가 설치 된 후에는 아래와 같이 명령어를 통해서 rabbitMQ 를 실행 합니다.

> sudo docker run -it -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672  -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=1234 rabbitmq:3.9-management

- 5672 port : rabbitMQ 큐잉 서비스 통신 port
- 15672 port : rabbitMQ admin web 서비스 port

docker run 이 완료 되었으면 브라우저를 통해 local rabbitMQ 서비스에 접속 하여 서비스 기동 상태를 체크 합니다.

> http://localhost:15672

![img.png](/img/spring/rabbitmq-img2.png)

rabbitmq 기동시 설정한 id/pw 로 로그인을 하게 되면 아래와 같이 rabbitMQ를 관리 할 수 있는 사이트에 접속 됩니다.

![img.png](/img/spring/rabbitmq-img3.png)

rabbitmq 관리 사이트에서 큐 생성, 분배 설정 등 설정 및 기능을 이용 할 수 있으며 HTTP API 를 통해 여러가지 기능을 http 콜을 통해 이용 할 수 있습니다.

#### Spring AMQP 프로젝트 구성

RabbitMQ 의 구조는 간단히 아래와 같습니다.  

![rabbitMQ](/img/spring/rabbitmq-img1.png)

- Producer : 메시지 생산자
- Broker   : 메시지 브로커
- exchange : 메시지 라우터 
- Consumer : 메시지 소비자

간단한 AMQP 시스템을 만들기 위해 Spring AMQP 라이브러리를 이용하여 프로젝트를 구성 하였으며 자세한 소스는 github 에서 확인 할 수 있습니다.

#### rabbitMQ 설정

- application.properties 

```properties
#rabbitmq 접속 url
spring.rabbitmq.host=localhost
#rabbitmq 접속 port
spring.rabbitmq.port=5672
#rabbitmq username
spring.rabbitmq.username=admin
#rabbitmq pwd
spring.rabbitmq.password=test111
#rabbitmq 에서 가져올 메시지 수 해당 설정에 따라 메시지를 가져와서 메모리에 담아 처리한다.
spring.rabbitmq.listener.simple.prefetch=1
#rabbitmq consumer 수
spring.rabbitmq.listener.simple.concurrency=1
#rabbitmq consumer 최대 수
spring.rabbitmq.listener.simple.max-concurrency=1
```

- producer.java

```java
@RestController
public class Producer {

    private static final String QUEUE_NAME = "order.queue";

    @Autowired
    RabbitTemplate rabbitTemplate;
    
    @GetMapping("/send")
    public String sendMsg(@RequestParam String msg){
        rabbitTemplate.convertAndSend(QUEUE_NAME, msg);
        return "OK";
    }
}
```

RabbitTemplate Bean을 주입 받아 convertAndSend 를 통하여 메시지를 발행 합니다.     
라우팅 키(exchange) 등 여러 발송 기능이 있으니 테스트 후 살펴 보시기 바랍니다.   

- consumer.java

```java
@Slf4j
@Service
public class Consumer {
    private static final String QUEUE_NAME = "order.queue";

    @RabbitListener(queues = QUEUE_NAME)
    public void consumer(Message message){
        log.info("Rabbitmq consumer msg : {}", message.toString());
    }
}
```

@RabbitListener 어노테이션을 통해서 설정된 queues 에 메시지 이벤트가 발생 되면 message 를 수신 하여 처리 하게 됩니다.

#### 메시지 처리 test

브라우저에서 http api 를 호출 합니다. 

> http://localhost:8080/send?msg=김밥

해당 메시지를 수신한 controller 에서 MQ 에 메시지를 담게 되고 @RabbitListener 에서 이벤트를 감지하여  
메시지를 수신하여 로그를 출력 한 결과를 볼 수 있습니다.

![img.png](/img/spring/rabbitmq-img4.png)




> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security