---
layout: post
title: Spring new instance 에 @Autowired 하려면?
date:   2022-03-27 10:00:00
categories: Spring
category : Spring
comments: true 
---

### 스프링 new instance 에 @Autowired 하는 방법

스프링 기반의 개발 하다 보면 new instance, static class 를 사용하게 되는 경우가 있습니다.    
new 로 생성 되는 인스턴스의 경우에는 스프링 IoC에서 관리 되는 Bean을 주입 받지 못 하고 @Autowired 로  
주입된 bean 이 null 인 것을 확인 할 수 있습니다.  

@Autowired 어노테이션이 스프링 컨테이너(ApplicationContext) 에서 bean을 찾아서 주입 해주는 것을 이해 하면  
어떻게 해결을 해야 할지 방법이 떠오릅니다.

### 환경 구성

1. 기본 환경

    - Spring-boot 2.6
    - JDK 1.8 이상
    - gradle
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo/tree/master/SpringNewInstanceExam>

2. Dependency
    
    - org.springframework.boot:spring-boot-starter
    - testImplementation group: 'junit', name: 'junit', version: '4.13.2'
    - testImplementation group: 'org.assertj', name: 'assertj-core', version: '3.22.0'

3. 목표

    - 메뉴를 처리하는 Thread 에서 메뉴 처리 bean 을 주입받아서 정상적으로 처리한다.

#### ApplicationContextProvider

ApplicationContext 에 등록 되어있는 Bean을 가져오기 위해 provider 클래스를 생성합니다.  

```java
@Component
public class ApplicationContextProvider implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ApplicationContextProvider.applicationContext = applicationContext;
    }

    public static ApplicationContext getApplicationContext(){
        return applicationContext;
    }
}
```

ApplicationContextProvider 클래스는 ApplicationContext에 등록 등록 되어있는   
ean을 getApplicationContext().getBean("Bean name") 메서드를 호출하여 가져 올수 있도록 구성 되어있습니다.  

#### Test Class

```java
public interface Order {
   void addOrder(String menu);
   void processOrder();
   void endOrder();
}

@Slf4j
@Controller
public class OrderController implements Order{

    @Override
    public void addOrder(String menu) {
        log.info("in Order : [{}]", menu);
    }

    @Override
    public void processOrder() {
        log.info("Processing Order");
    }

    @Override
    public void endOrder() {
        log.info("end Order");
    }
}
```

```java
public class OrderThread implements Runnable{

    /*
    @Autowired
    OrderController orderController;    //null 주입받지 못함.
     */
    
    private final String menu;
    private final Order order;

    public OrderThread(String menu) {
        this.order = (Order) ApplicationContextProvider.getApplicationContext().getBean("orderController");
        this.menu = menu;
    }

    @Override
    public void run() {
        order.addOrder(menu);
        order.processOrder();
        order.endOrder();
    }
}
```

```java
@SpringBootTest
public class OrderThreadTest {
    @Test
    void OrderTEST(){
        new Thread(new OrderThread("김밥")).start();
    }
}
```

#### 테스트 결과

테스트 수행 결과 OrderController Bean 을 정상적으로 주입 받아서 controlelr 에 있는 메서드를 정상적으로 처리 한 것을 확인 할 수 있습니다.

![SpringNewinstanceExam-img1](/img/spring/SpringNewinstanceExam-img1.png)

> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security