---
layout: post
title: 우아한테크세미나 - 우아한 스프링 배치 기록
date:   2019-09-26 10:10:00
categories: Java
comments: true 
---

우아한 스프링 배치 테크 세미나 소식에 고민 1도 없이 신청서를 작성 해서 신청 했는데 운좋게 참석 할 수 있어서 다녀 왔다.  
개발 하면서 매우 도움을 많이 받았던 블로그의 주인인 jojoldu 님 께서 발표를 해주셨고 기본편 & 활용편으로 나누어 진행 되었다.  

잊어버리기 전에 빨리 기록을 남긴다.

### 전반전 : 기본편

- 배치 어플리케이션이란?

    - 컴퓨터에서 사람과 상호 작용 없이 이어지는 프로그램(위키 참조)
    - 웹 어플리케이션 과는 지향점이 틀림.
        - 배치 : 후속 작업, 절대적인 속도, QA가 어려움
        - 웹   : 실시간 작업, 상대적인 속도, QA가 쉬움

- Spring Batch vs Quartz

    - Quartz 는 배치 어플리케이션이 아닌 스케쥴링 프레임워크이다.
    - Quartz 는 SpringBatch를 대체제가 아닌 보완제이다.
  
- Spring Batch 의 활용

    - 배치 어플리케이션은 일정 주기로 실행을 하거나 실시간으로 처리하지 못할때 사용(대용량 처리...)
    - Job / Step / Tasklet 은 개별적으로 처리 되는 로직이 아니라 ChunkOrientedTasklet 클래스에서 구현되어 동작한다.

- JobParameter

    - @JobParameter 는 null 로 실행 한다. 실 구동시에는 파라미터가 셋팅 된다.
    - @JobParameter LocalDate 활용 팁
        - JobParameter 에 사용 할수 있는 타입에는 Double, Long, Date, String 으로 한정 되어있다. 
        - JobParameter 에는 LocalDate, LocalDateTime을 사용 할 수 없기 때문에 String을 받아서 형변환을 해야 한다.
        - 매번 형변환을 작성 해야 하기 때문에 클래스는 별도로 빼서 get 해서 사용 할 수 있도록 구성 하면 효율적이다.
    - @JobScope 는 Late Binding 이기 때문에 동적으로 Bean을 할당 할 수 있다.

### 후반전 : 활용편.

- 관리 도구들

    - cron
    - Spring MVC + API Call
    - Spring Batch Admin(Deprecated 됨)
    - Quartz + Admin
    - CI Tools(Jenkins / Teamcity..)
    
- 우형에서는 배치 어플리케이션을 관리 하기 위해 Jenkins 를 활용 하고 있다고 한다.

- Jenkins를 이용한 배치 관리 장점

    - Integration (slack, email 등)
    - 실행 이력, 로그관리 , Dash Board
    - 다양한 실행 방법 (Rest API, 스케쥴링, 수동실행)
    - 계정별 권한 부여 가능
    - 파이프라인
    - Web UI + script 사용
    - 다양한 Jenkins Plugin 활용

- Jenkins 에서 커멘드를 등록 하여 배치를 실행

- 배치 실행 tip

    - 실행 커멘드를 작성할 때 공통적으로 사용 되는 설정은 Jenkins Global Properties 를 활용 하여 설정 할 수 있다.
    - Properties 내에서도 설정 된 옵션을 호출 할 수 있기 때문에 옵션별로 등록 하고 최종적으로 사용 하는 설정을 등록 하여 활용 한다.

- 무중단 배포 tip

    - 웹 어플리케이션의 경우 서비스의 유지를 위해 무중단 배포를 하지만 배치는 그렇지 않았다. 하지만 우형에서는 배치 어플리케이션도 무중단 서비스를
        하기 위해 아래의 방법으로 활용 하고 있다.
    - 배포를 위한 Jenkins 와 배치를 수행하는 Jenkins 를 분리하여 구성한다.
    - 기존에 실행 되고 있는 jar를 어떻게 하면 종료 없이 교체 할 수 있을까?
        - 리눅스 계열에서 readlink 함수를 활용한다. (윈도우는???)
> readLink 란? 심볼릭 링크가 연결 되어있는 원본의 파일명을 얻는다.
    
        - 실제로 배치를 실행 할때는 App.jar를 실행 하지만 readlink 함수를 사용 하여 v1.jar 에 링크 되어있기 때문에
          실행 중인 배치에 영향을 미치지 않고 교체를 할 수 있다.
 
- 파이프 라인

    - 동일한 Job을 파라메터만 다르게 하여 수행 할 때 활용.
    - 여러개의 Job을 순차적으로(or 연속적으로) 실행 하게 할 때 활용.
        - 순차적인 Job 을 구성할 때 Step을 이용하기 전에 파이프라인을 고려하라!!

- 멱등성

    - 멱등성이란 ? 연산을 여러번 수행 해도 결과가 동일한 성질
    - 멱등성이 깨지는 경우
        - 제어할수 없는 코드를 짤경우!!
        - 대표적으로 메소드 내에 선언 되어있는 LocalDate()!! 배치를 수행하기 위한 파라미터로 현재 시간을 사용 할때
          메소드 내에 선언하여 사용 할 경우 멱등성이 깨진다.
          - 왜?? 현업에서 어제일자를 수행 하거나 지정일을 수행해달라고 요구할 경우 소스를 변경해야한다......

    - Jenkins Date 활용 Tip!!!!
        - Jenkins 의 Date Parameter Plugin 을 활용 하면 간단하다.
        
- 테스트 코드

    - ConditionalOnProperty 와 @TestPropertySource 를 사용
    - 우아한 형제들의 테스트 코드는 1200개가 넘는다......
    - 매번 빌드 할때 속도가 엄청나게 오래 걸려서 분석을 해보니 ConditionalOnProperty 를 사용할경우 스프링 컨텍스트가 자꾸 재실행됨.
    - @MockBean, @SpyBean , @TestPropertySource, @ConditionalOnProperty 들은 environment가 바뀌면서 컨텍스트가 재실행됨.
    - 해결 Tip
        - 시작 될때 모든 Config를 로딩 하여 applicationContext 에서 JobName으로 찾아서 실행.
        - 참고 소스
        
        ```java
        public class JobTestUtils {
            @Autowired private ApplicationContext applicationContext;
            @Autowired private JobRepository jobRepository;
            @Autowired private JobLauncher jobLauncher;
            
            public JobLauncherTestUtils getJobTester(String jobName) {
                Job bean = applicationContext.getBean(jobName, Job.class);
                JobLauncherTestUtils jobLauncherTestUtils = new JobLauncherTestUtils();
                jobLauncherTestUtils.setJobLauncher(jobLauncher);
                jobLauncherTestUtils.setJobReposiroty(jobRepository);
                jobLauncherTestUtils.setJob(bean);
                return jobLauncherTestUtils;
            }
        }
        ```
        
- JPA + Spring Batch 사용할 때 이슈들

    - JPA N + 1 이슈
    
        - LazyLoading 으로 비효율적인 쿼리가 실행
        - 하위 엔티티가 1개일 경우 Job Fetch 를 사용 하여 해결
        - 하위 엔티티가 1개 이상일 경우에는 Job Fetch 를 사용 하면 MultiBagFetchException 이 발생 됨.
        - Default_batch_fetch_size 를 설정하여 해결 할수 있지만 JpaPagingItemReader에서는 옵션 사용 불가(버그 PR 올리셔서 답변 대기중)
     
    - JPA Persist Writer
    
        - 모든 item에 대해 merge 를 수행 할때 처음 데이터가 생성 될경우에도 불필요한 update 쿼리가 수행 됨.
            - 우형에서는 JPA Persist Writer 를 그대로 복사하여 수정해서 사용 중.
            - 스프링 배치 4.2 버전에서 업데이트 될 예정.

### 마무리

- 스프링 배치에 대한 책이 없었는데 The Definitive Guide to Spring Batch 라는 책이 출간됨.
- 네이버 개발자 분과 함께 도서를 번역중이시라고 홍보를......

### 후기

- 업무에서 스프링 배치를 사용하지 않고 있다. 오래전에 개발된 Quartz + Admin Web 으로 배치 정산을 수행 중이다.
  스프링배치는 토이프로젝트에서 공부하면서 사용했고 예제 소스를 분석 한게 다였다.
  
  이번 테크 세미나를 통해서 스프링배치 + 젠킨스의 활용에 대한 구성 및 여러가지 팁들을 얻을 수 있어 좋았고 
  젠킨스를 활용하여 이렇게도 구성이 가능하구나!!! 라는 생각이 들어 매우 유익한 시간이였다.


            
        
            
        
    
    


    
    
