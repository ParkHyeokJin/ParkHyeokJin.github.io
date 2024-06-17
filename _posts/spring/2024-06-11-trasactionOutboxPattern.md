---
layout: post
title: 트랜젝션 아웃박스 패턴(Transaction outbox Pattern)
date:   2024-06-11 10:00:00
categories: Spring
category : Spring
comments: true 
---

### 트랜젝션 아웃박스 패턴

트랜젝션 아웃박스 패턴은 MSA 이벤트 기반 아키텍처에서 이벤트 발행 시 발생되는 이슈를 보완하기 위한 패턴입니다. 예를 들어, 주문 이벤트가 발생하여 DB에는 저장되었지만 이벤트 큐(MessageQueue)에 발행하다가 오류(네트워크 오류 등등)가 발생하면 어떻게 될까요? DB에는 주문이 들어갔지만 이벤트 큐 컨슈머는 발행된 이벤트가 없기 때문에 다음 절차를 진행하지 않을 것입니다. 이런 트랜젝션 오류에 대비하여 아웃박스라는 하나의 테이블을 메인 이벤트 테이블과 하나의 트랜젝션으로 묶어 처리하는 방식을 트랜젝션 아웃박스 패턴이라고 합니다.

---

## 테스트 환경
---

- **Springboot 3.3**
- **H2 database**
- **Jdk17**
- **Mockito**
- **SpringDataJpa**
- **Github repo:** (https://github.com/ParkHyeokJin/kafkaServerExam/tree/main/kafka-TransactionalOutboxPattern)

---

## 구현
---

> **요건: 고객의 주문을 접수 받아서 주문 처리 이벤트를 발생시킨다.**

주문 서비스를 개발 중입니다. 주문이 접수되면 Order 테이블에 주문을 저장하고 해당 이벤트를 MQ로 전달하여 주문 이벤트 컨슈머가 처리할 수 있는 간단한 요건입니다. 간단히 `createOrder()` 메서드를 구성하여 MQ에 데이터를 전달하도록 아래와 같이 구성하였습니다.

### OrderService.java

```java
public boolean createOrder(Order order) {
        // 주문 생성
        orderRepository.save(order);

        // 이벤트 발행
        kafkaProducer.send(topic, order);

        return true;
        }
```

하지만 문제가 발생했습니다. Order 테이블에는 정상적으로 insert 되어있는데 네트워크 이슈로 Kafka에 이벤트 발행이 실패했습니다. 고객에게 주문이 접수되었는데 이벤트 발행이 되지 않아 처리가 안되었던 것입니다. 트랜젝션 아웃박스 패턴을 이용하여 개선해보겠습니다.


### OrderService.java

```java
    @Transactional
    public boolean createOrder(Order order) {
        // 주문 생성
        orderRepository.save(order);

        // Outbox 이벤트 생성 및 저장
        OutboxEvent outboxEvent = new OutboxEvent("Order", String.valueOf(order.getId()), "OrderCreated", convertOrderToPayload(order), OutboxEvent.EventStatus.NEW);
        outboxEventRepository.save(outboxEvent);

        // OutboxEventCreated 이벤트 발행
        eventPublisher.publishEvent(new OutboxEventCreated(this, outboxEvent));

        return true;
    }
```
  
개선된 메서드는 주문이 접수 되면 아래와 같이 동작 하게 됩니다.    


1) **Order 테이블에 데이터를 기록한다.**  
2) **OutboxEvent 테이블에 주문 이벤트를 기록한다.**  
3) **OutboxEventCreated 를 호출하여 이벤트를 발행시킨다.**  
4) **OutboxEventListener 이 이벤트를 수신하여 MQ 혹은 이벤트를 처리한다.**  

## 장애 처리
---

createOrder 테이블은 하나의 @Transactional 로 묶여 있습니다. 이 하나의 트렌젝션을 활용 해서 장애를 예방 하는 것이 `트렌젝션 아웃박스` 패턴 의 방식 입니다. 메서드 실행시 오류가 발생하는 경우 트렌젝션 롤백을 수행하는 것을 활용하여 주문 생성과 이벤트 발행을 하나의 트렌젝션으로 묶어 처리 할 수 있다는 것이 장점 입니다.

- Order 테이블 입력 오류시 롤백
- Order 테이블 OK, OutboxEvent 입력 오류시 둘다 롤백
- Order 테이블 OK, OutboxEvent OK, 이벤트 발행 실패시 둘다 롤백

## 활용처

트렌젝션 아웃박스 패턴은 두번의 DB 트렌젝션이 발생 하고 1번의 이벤트 처리가 발생 되기 때문에 건당 처리가 적어도 5~6ms 정도의 시간이 소요 됩니다. 1~2ms 에 민감한 대용량 아키텍처 에서 다양한 부분에 적용을 하기엔 성능적 문제가 있기 때문에 실시간 처리 보다 _**정확한 이벤트 처리**_ 가 필요한 곳에 사용 하는 것이 좋을 것으로 판단 됩니다.

- **회원 가입/탈퇴** 
- **주문 접수/취소**
- **결제 요청/승인**

## 의문사항 정리
---

1. **만약 이벤트 발행 까지 성공 했지만 이벤트 처리가 오류가 발생 한다면?**

   - 이 경우에도 걱정이 없습니다. OutboxEvent 테이블에 이벤트가 저장 되어있기 때문에 해당 이벤트를 다시 수행 하는 로직(Scheduled 등) 을 추가하여 재처리가 가능 하기 때문에 정상적으로 처리된 이벤트는 반드시 한번은 처리 할 수 있는 구조로 되어있습니다.

2. **Order 테이블 에서 이벤트 처리를 해도 되는데 왜 굳이 별도의 테이블을 만들어???**

   - Order 테이블에서 바로 이벤트를 발생 시키는 경우에는 이벤트 처리에 대한 Status 가 Order 테이블에 추가되어야 하고 이벤트 처리 상태가 계속 변해야 하기 때문에 거기서 오는 오류사항들이 발생 할 수 있습니다. 그리고 Order 테이블에는 저장이 되었지만  
   이벤트 발행을 실패 했다면? 재처리 할 수 있는 필드와 로직이 추가 되어야 할 것입니다. 이런 문제점들을 해결 하기 위해 하나의 이벤트큐 처럼 OutboxEvent 테이블을 별도로 설계 하여 이벤트를 발행 하고 처리된 이벤트는 삭제(& Stat 변경)을 통해  
   주문 테이블과의 정합성을 보장 할 수 있습니다.  









