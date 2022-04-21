---
layout: post
title: MockWebServer를 활용한 webClient Test
date:   2022-04-20 10:00:00
categories: Spring
category : Spring
comments: true 
---

### MockWebServer 를 활용 하여 RestAPI 테스트 하기

RestAPI 를 통한 어플리케이션 개발시 목적지 API 의 기능이 다 완성 되지 않았거나 미계약 등등의 사유로  
API 스팩만 전달 받고 개발을 진행 할 경우가 있었습니다. 이런 경우 MockWebServer를 활용 하여
선개발을 진행 할 수 있습니다. 간단한 테스트 클래스를 작성하여 테스트 하는 방법을 알아 보겠습니다.  


### 환경 구성

1. 기본 환경

    - Spring-boot 2.6
    - JDK 1.8 이상
    - gradle
    - 사용 가능한 IDE

2. Dependency
    
```properties
    implementation 'org.springframework.boot:spring-boot-starter'
    compileOnly 'org.projectlombok:lombok'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'

    testImplementation 'com.squareup.okhttp3:okhttp:4.0.1'
    testImplementation 'com.squareup.okhttp3:mockwebserver:4.0.1'

    testImplementation group: 'junit', name: 'junit', version: '4.13.2'
    testImplementation group: 'org.assertj', name: 'assertj-core', version: '3.22.0'
```


3. 목표

    - WebMockServer 를 설정 하고 webClient 호출을 통하여 API 통신을 하는 Test Case 를 작성 한다.

#### MockWebServerApplicationTests

```java
@ExtendWith(MockitoExtension.class)
class MockWebServerTestApplicationTests {

   private MockWebServer mockWebServer;
   private ApiService apiService;

   // mock server 생성
   void startServer(ClientHttpConnector connector) {
      this.mockWebServer = new MockWebServer();
      apiService = new ApiService(WebClient
              .builder()
              .baseUrl(this.mockWebServer.url("/").toString())
              .clientConnector(connector).build()
      );
   }

   @AfterEach
   void shutdown() throws IOException {
      if (mockWebServer != null) {
         this.mockWebServer.shutdown();
      }
   }

   @Test
   void postTest(){
      startServer(new ReactorClientHttpConnector());  // 커넥터 주입

      JsonObject object = new JsonObject();

      //given
      //테스트 결과를 받을 Response 데이터를 MockWebServer 에 주입 한다.
      //반복 주입 하여 retry, 실패 등의 테스트가 가능하다.
      object.addProperty("value", "TEST");
      mockWebServer.enqueue(new MockResponse().setHeader("Content-type", MediaType.APPLICATION_JSON).setResponseCode(200).setBody(new Gson().toJson(object)));

      //when
      String response = apiService.postApi("TEST").block();

      //then
      assertThat(response).isNotNull();
   }
}
```

### ApiService

```java
class ApiService{
    private final WebClient webClient;

    public ApiService(WebClient webClient){
        this.webClient = webClient;
    }

    public Mono<String> postApi(String reqBody){
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("/").build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(reqBody)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                ;
    }
}
```

#### 테스트 결과

테스트 수행 결과 local Mock server 가 기동 되어 API 호출을 하고 입력 해둔 Mock Response 결과를 정상적으로 받아서 테스트 할 수 있다.

![MockWebServerTest1.png](/img/spring/MockWebServerTest1.png)

> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security