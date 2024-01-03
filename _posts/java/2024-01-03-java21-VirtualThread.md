---
layout: post
title: JAVA 21 - VirtualThread 기능 살펴보기
date:   2024-01-02 10:10:00
categories: Java
category : Java
comments: true 
---

# Virtual Thread (Java 21)

Java 21에 추가된 Virtual Thread 는 처리량이 높은 동시 어플리케이션을 작성 할 수 있는 경량 스레드 이다.

기존에 사용 하던 Thread 는 OS Thread 를 랩핑 해서 사용 하는 형태로 OS의 총 스레드 개수에 따라 최대 Thread 의 생성 갯수가 정해지며
생성 비용이 높다.

신규로 추가된 Virtual Thread 도 기존의 Thread를 상속 받아 구현된 클래스 지만 특정한 OS Thread를 1:1로 사용 하는 방식이 아닌
OS Thread 를 Pool 방식으로 사용 하는 형태 라고 보면 된다.

단. Synchronized 를 호출하게 되면 특정한 OS Thread를 점유하여 사용 하므로 유의 해야한다.

|Thread|Virtual| Thread |
|---|---|---|
|Stack 사이즈|	~2MB| 	~10KB |
|생성시간|	~1ms| 	~1µs  |
|컨텍스트 스위칭|	~100µs| 	~10µs |

기존의 Springboot webFlux 를 사용 하면 reactive 기반의 개발이 가능 하였으나 webFlux 를 활용하기 위해서는 많은 공부가 필요했다.. 

하지만 자바의 Virtual Thread 를 사용 하면 기존 방식과 달라지는 부분이 많이 없기 때문에 손쉽게 활용 할 수 있다.

### VirtualThread 생성 및 SpringBoot 설정방법

```java
    public void createVirtualThread(){
        // Virtual Thread 생성 방법 1
        Thread thread = Thread.ofVirtual().start(() -> System.out.println("Hello"));
        thread.join();
    
        // Virtual Thread 생성 방법 2
        Thread.Builder builder = Thread.ofVirtual().name("MyThread");
        Runnable task = () -> {
            System.out.println("Running thread");
        };
        Thread t = builder.start(task);
        System.out.println("Thread t name: " + t.getName());
        t.join();
    
        // Virtual Thread 생성 방법 3
        Thread.Builder builder = Thread.ofVirtual().name("worker-", 0);
        Runnable task = () -> {
            System.out.println("Thread ID: " + Thread.currentThread().threadId());
        };

        // name "worker-0"
        Thread t1 = builder.start(task);
        t1.join();
        System.out.println(t1.getName() + " terminated");

        // name "worker-1"
        Thread t2 = builder.start(task);
        t2.join();
        System.out.println(t2.getName() + " terminated");
    
        // Virtual Thread 생성 방법 4(ExecutorService 활용)
        try(ExecutorService myExecutor = Executors.newVirtualThreadPerTaskExecutor()){
            Future<?> future = myExecutor.submit(() -> System.out.println("Running thread"));
            future.get();
            System.out.println("Task completed");
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
```

SpringBoot 3.1 버전대를 사용하는 경우 아래 빈 등록을 통해서 Virtual Thread 를 사용 할 수 있다.

```java
    @Bean
    public TomcatProtocolHandlerCustomizer<?> tomcatProtocolHandlerCustomizer(){
        return protocolHandler -> {
            protocolHandler.setExecutors(Executors.newVirtualThreadPerTaskExecutor());
        };
    }

    @Bean(TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME)
    public AsyncTaskExecutor asyncTaskExecutor(){
        return new TaskExecutorAdapter(Executors.newVirtualThreadPerTaskExecutor());
    }
```
        
SpringBoot 3.2 버전 부터는 application.yaml 에서 설정이 가능 하다.

```yaml
# application.yaml
spring:
  threads:
    virtual:
      enabled: true
```

### MultiThread Server - Client

* EchoServer

```java
public class EchoServer {
    public static void main(String[] args) throws IOException {
        try (ServerSocket serverSocket = new ServerSocket(9090)) {
            while (true) {
                Socket clientSocket = serverSocket.accept();
                // Accept incoming connections
                // Start a service thread
                Thread.ofVirtual().start(() -> {
                    try (
                            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                    ) {
                        String inputLine;
                        while ((inputLine = in.readLine()) != null) {
                            System.out.println(inputLine);
                            out.println(inputLine);
                        }

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }
        } catch (IOException e) {
            System.out.println("Exception caught when trying to listen on port 9090 or listening for a connection");
            System.out.println(e.getMessage());
        }
    }
}
```

* EchoClient   
 
```java
public class EchoClient {
    public static void main(String[] args) throws IOException {
        try (
            Socket echoSocket = new Socket("localhost", 9090);
            PrintWriter out =new PrintWriter(echoSocket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(new InputStreamReader(echoSocket.getInputStream()));
        ) {
            BufferedReader stdIn = new BufferedReader(new InputStreamReader(System.in));
            String userInput;
            while ((userInput = stdIn.readLine()) != null) {
                out.println(userInput);
                System.out.println("echo: " + in.readLine());
                if (userInput.equals("bye")) break;
            }
        } catch (UnknownHostException e) {
            System.err.println("Don't know about host localhost");
            System.exit(1);
        } catch (IOException e) {
            System.err.println("Couldn't get I/O for the connection to localhost ");
            System.exit(1);
        }
    }
}
```
