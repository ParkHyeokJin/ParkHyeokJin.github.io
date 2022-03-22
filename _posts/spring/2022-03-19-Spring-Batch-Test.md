---
layout: post
title: 스프링 배치 테스트 코드 작성 방법~!
date:   2022-03-19 10:00:00
categories: Spring
category : Spring
comments: true 
---

### 스프링 배치에서 테스트 코드를 작성 하려면 어떻게 해야 할까?

대부분의 배치 서비스들은 데이터를 읽어서(itemReader) 가공(itemProcess) 하여 처리(itemWriter) 하는 로직으로 구성 되어있습니다.  
배치 서비스를 개발 하다 보면 실제로 배치를 수행 해보고 DB를 확인 하여 정상적인지 확인 하는 방법으로 검증 하였습니다.

로컬 테스트시에도 배치 대상 데이터를 임의로 생성 하고 배치를 돌려서 결과가 맞는지 계산 하는 방법으로 반복적으로 테스트를 수행 하였습니다.  
배치 서비스 테스트 코드를 작성 해두면 이러한 방법을 테스트 코드를 통하여 수월하게 해결 할 수 있습니다.

배치 서비스 테스트 코드는 단위 테스트(reader, process, writer)를 개별적으로 테스트 하는 방법과  
통합테스트 (배치 수행 결과 확인) 으로 나누어 작성 하였고 이번에는 통합 테스트 위주로 테스트 코드를 작성 하는 방법을 정리 해보겠습니다.


### 환경 구성

1. 기본 환경

    - Spring-boot 2.x, Spring-Batch 4.1.x
    - JDK 1.8 이상
    - gradle
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringBatch-Exam>

2. 기능 목표
    
    - 배치 서비스를 작성 하고 테스트 코드를 통하여 검증한다.
   
### 통합 테스트

스프링 배치 서비스의 통합테스트를 하기 전에 스프링 배치의 버전에 따라 어노테이션이 다르게 적용 됩니다.  
스프링 배치 4.1 이상에서는 @SpringBatchTest 어노테이션이 추가되어 조금더 간편히 작성 할 수 있습니다.  
우선 @SpringBatchTest 어노테이션을 추가 하여 테스트 코드를 살펴보고 하위 버전에서의 변경점을 살펴 보겠습니다.  

```java
@RunWith(SpringRunner.class)
@SpringBatchTest   // (1)
@SpringBootTest(classes = {BatchTestConfiguration.class, BatchTestConfig.class})   // (2)
class SpringBatchExamApplicationTests {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private MenuRepository menuRepository;

    @BeforeEach
    void beforeEach() throws Exception{}

    @AfterEach
    void afterEach() throws Exception{
        menuRepository.deleteAll();
    }

    @Test
    @DisplayName("메뉴가_완료되어_status가_변경되는_배치_테스트")
    public void 메뉴가_완료되어_status가_변경되는_배치_테스트() throws Exception {
        //given
        menuRepository.save(Menu.builder().item("김밥").price(1000).build());
        menuRepository.save(Menu.builder().item("떡볶이").price(3000).build());
        menuRepository.save(Menu.builder().item("라면").price(1500).build());

        //when
        JobExecution jobExecution = jobLauncherTestUtils.launchJob();

        //then
        assertThat(jobExecution.getExitStatus().getExitCode()).isEqualTo(BatchStatus.COMPLETED.toString());

        List<Menu> menuList = menuRepository.findByStatusTrue();
        assertThat(menuList.size()).isEqualTo(3);

        int totalPrice = menuList.stream().mapToInt(Menu::getPrice).sum();
        assertThat(totalPrice).isEqualTo(5500);
    }
}
```

(1) @SpringBatchTest 어노테이션이 바로 스프링 배치 4.1 이상에서 추가된 부분입니다.  
(2) @SpringBootTest(class={..})  
   - 테스트 수행시 사용될 클래스를 설정 합니다.
   - BatchTestConfiguration.class : 배치 job 입니다.
   - BatchTestConfig.class : 배치 테스트를 하기위한 설정 파일 입니다.

```java
@Configuration
@EnableBatchProcessing         //(1)
@EnableAutoConfiguration
@EntityScan("com.example.springbatchexam.domain")   //(2)
@EnableJpaRepositories("com.example.springbatchexam.repository")  //(2)
@EnableTransactionManagement          //(2)
public class BatchTestConfig {
}
```

다음은 BatchTestConfig.class 구성입니다. 배치 테스트를 수행 하기 위한 설정으로 구성 되어 있으며 내용은 아래와 같습니다.

(1) 스프링배치를 사용 하기 위한 어노테이션  
(2) jpa 테스트 수행시 @EntityScan, @EnableJpaRepositories 어노테이션이 없으면 jpa 관련 bean을 찾지 못하는 오류가 발생 하여 추가함.  

이제 위 작성 된 테스트 코드를 수행 하면 아래와 같이 결과를 도출 할 수 있습니다.

![스프링 배치 결과](/img/spring/springBatchTestCode-img1.png){: width=100%, height=100% }


#### Spring Batch 4.1 이하 버전

스프링 배치 4.1 이하 버전에서는 @SpringBatchTest 어노테이션이 제공 되지 않으므로 BatchTestConfig.class 를 아래와 같이 구성 하시면 됩니다.
해당 어노테이션을 추가 하면 jobLauncherTestUtils Bean을 등록 해주기 때문에 필요가 없었지만 해당 어노테이션이 없는 하위 버전은 bean 을 등록해줘야 합니다.  

```java
@Configuration
@EnableBatchProcessing         //(1)
@EnableAutoConfiguration
@EntityScan("com.example.springbatchexam.domain")   //(2)
@EnableJpaRepositories("com.example.springbatchexam.repository")  //(2)
@EnableTransactionManagement          //(2)
public class BatchTestConfig {
    @Bean
    public JobLauncherTestUtils jobLauncherTestUtils(){
        return new JobLauncherTestUtils();
    }
}
```
  
> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security