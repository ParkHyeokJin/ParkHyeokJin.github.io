---
layout: post
title: 스프링 배치 어플리케이션 만들기(Spring Batch)
date:   2019-11-17 10:00:00
categories: Spring
category : Spring
comments: true 
---

오늘은 매우 쉽고 간단한 스프링 배치 어플리케이션을 만들어 보겠습니다. 배치는 매우 중요한 서비스 입니다.    
실시간으로 처리 하지 못하는 대량의 업무를 배치로 처리를 하고 있기 때문에 배치 개발을 알아 두는 것은 필수입니다.

### 환경 구성

1. 기본 환경

    - Spring-boot 2.2.1.RELEASE
    - JDK 1.8 이상
    - Maven
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo.git>

2. 기능 목표

    - 회원 성적.txt 파일을 읽어서 성적 평균을 구한뒤 DB에 기록 하는 배치 기능 개발
    
3. Maven

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-batch</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.batch</groupId>
            <artifactId>spring-batch-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.10</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
    ```

### 배치 어플리케이션 ( txt -> db )

회원 정보를 저장할 엔티티를 생성 합니다.

```java
@Getter
@Entity
@Table(name = "PERSON")
public class Person {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private String name;
    private String studentId;
    private int korean;
    private int english;
    private int Math;
    private double avg;
    //Constructor, getter, setter....
}
```

배치 어플리케이션을 생성 하기 위해서 스프링에서 제공하는 factory 를 아래와 같이 작성 합니다.

```java
@Slf4j
@Configuration
@EnableBatchProcessing
public class BatchConfiguration {
    @Autowired
    public JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;
    
    //........   
}
``` 

배치 업무는 reader -> process -> writer 순서로 처리되게 됩니다. 배치 처리를 위해서 reader() 와 writer()를 작성 합니다.

```java
//BatchConfiguration.java
@Bean
public FlatFileItemReader<Person> reader() {
    return new FlatFileItemReaderBuilder<Person>()
        .name("PersonReader")
        .resource(new ClassPathResource("sample.txt"))
        .delimited()
        .names(new String[] {"name", "studentId", "korean", "english", "math"})
        .fieldSetMapper(new FieldSetMapper<Person>() {
            @Override
            public Person mapFieldSet(FieldSet fieldSet) throws BindException {
                String name = fieldSet.readString(0);
                String studentId = fieldSet.readString(1);
                int korean = fieldSet.readInt(2);
                int english = fieldSet.readInt(3);
                int math = fieldSet.readInt(4);
                return new Person(name, studentId, korean, english, math, 0);
            }
        })
        .build();
}

@Bean
public JdbcBatchItemWriter<Person> writer(DataSource dataSource) {
    return new JdbcBatchItemWriterBuilder<Person>()
        .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
        .sql("INSERT INTO PERSON (name, student_Id, korean, english, math, avg) VALUES (:name, :studentId, :korean, :english, :math, :avg)")
        .dataSource(dataSource)
        .build();
}
```

writer() 는 ORM을 사용하지 않는 경우에는 JdbcBatchItemWriter를 이용하여 처리를 하게 되는데 JdbcBatchItemWriter은 JDBC의 배치 기능을 이용해서  
처리되는 쿼리를 일괄 처리를 하기 때문에 주고받는 횟수가 최소화 되어 성능이 향상 됩니다.

writer()에 ORM을 사용하는 경우에는 JpaItemWriter 를 이용하면 됩니다.


```java
private final EntityManagerFactory entityManagerFactory;
    
@Bean
public JpaItemWriter<Person> jpaWriter(DataSource dataSource){
    JpaItemWriter<Person> jpaItemWriter = new JpaItemWriter<Person>();
    jpaItemWriter.setEntityManagerFactory(entityManagerFactory);
    return jpaItemWriter;
}
```

성적 평균을 구하는 process 단계를 만들기 위해 IteamProcessor 인터페이스를 구현합니다.

```java
public class PersonAvgProcess implements ItemProcessor<Person, Person>{
	@Override
	public Person process(final Person person) throws Exception {
		final int korean = person.getKorean();
		final int english = person.getEnglish();
		final int math = person.getMath();
		
		final double avg = (korean + english + math) / 3;
		person.setAvg(avg);
		return person;
	}
}
```

배치 업무를 배치 팩토리에 등록하기 위한 메소드를 구현합니다.

```java
//BatchConfiguration.java
@Bean
public Job job(JobCompletionNotificationListener listener, Step step) {
    return jobBuilderFactory.get("myJob")
        .incrementer(new RunIdIncrementer())
        .listener(listener)
        .flow(step)
        .end()
        .build();
}

@Bean
public Step step(JdbcBatchItemWriter<Person> writer) throws Exception {
    return stepBuilderFactory.get("step")
        .<Person, Person> chunk(10)     //데이터 처리 단위
        .reader(reader())               //데이터 읽기
        .processor(new PersonAvgProcess())  //프로세스 중간 처리
        .writer(writer)                 //데이터 기록
        .build();
}
```

스프링 어플리케이션을 실행 합니다.

```java
@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```
    
- 결과

    ![batch 결과](/img/spring/BatchResult.PNG){: width=100%, height=100% }
    
    




> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch