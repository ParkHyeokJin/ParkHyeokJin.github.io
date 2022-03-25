---
layout: post
title: 스프링 배치 여러 곳에 write 를 하려면? (CompositeItemWriter)
date:   2022-03-20 10:00:00
categories: Spring
category : Spring
comments: true 
---

### 스프링 배치 여러 곳에 write 를 하려면?

대부분의 배치서비스는 테이블 데이터를 읽어서(reader) 값을 확인 & 계산(processor) 한뒤 insert & update(writer) 하는 구성으로 되어있습니다.  
하지만 1:1 구성으로 하나의 테이블 데이터를 읽어서 배치 처리를 하는 경우는 간단 하지만  
하나의 테이블을 읽어서 여러 테이블에 처리를 해야 하는 경우에는 어떻게 처리를 할 것인가에 대해서 고민이 필요합니다.  
process 에서 처리를 할 수는 있지만 스프링 배치의 Chunk 지향 처리 및 역할의 차이에서 writer 에서 처리를 하는 것이 좋습니다.  

어려가지 방법을 통하여 사용 할 수 있지만 이 번에는 CompositeItemWriter 를 통해서 여러 테이블을 처리하는 방법에 대해서 정리 해보겠습니다.

### 환경 구성

1. 기본 환경

    - Spring-boot 2.6
    - JDK 1.8 이상
    - gradle
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringBatch-Exam>

2. 기능 목표
    
    - A 테이블의 데이터를 조회 하여 B 테이블에 마킹을 하고 C 테이블에 결과를 입력한다.
    - B와 C테이블 어느 곳이든 쿼리가 실패하면 해당 트렌젝션은 실패 해야한다.
   
### CompositeItemWriter

- CompositeitemWriter 소스는 아래와 같습니다.  
  setDelegates() 메소드를 통하여 ItemWriter 를 등록 하게 되며 등록된 ItemWriter는 순차적으로 실행 되게 됩니다.

```java
public class CompositeItemWriter<T> implements ItemStreamWriter<T>, InitializingBean {

	private List<ItemWriter<? super T>> delegates;

	private boolean ignoreItemStream = false;

	/**
	 * Establishes the policy whether to call the open, close, or update methods for the
	 * item writer delegates associated with the CompositeItemWriter.
	 * 
	 * @param ignoreItemStream if false the delegates' open, close, or update methods will
	 * be called when the corresponding methods on the CompositeItemWriter are called. If
	 * true the delegates' open, close, nor update methods will not be called (default is false).
	 */
	public void setIgnoreItemStream(boolean ignoreItemStream) {
		this.ignoreItemStream = ignoreItemStream;
	}

    @Override
	public void write(List<? extends T> item) throws Exception {
		for (ItemWriter<? super T> writer : delegates) {
			writer.write(item);
		}
	}

    @Override
	public void afterPropertiesSet() throws Exception {
		Assert.notNull(delegates, "The 'delegates' may not be null");
		Assert.notEmpty(delegates, "The 'delegates' may not be empty");
	}

	/**
	 * The list of item writers to use as delegates. Items are written to each of the
	 * delegates.
	 *
	 * @param delegates the list of delegates to use.  The delegates list must not be null nor be empty.
	 */
	public void setDelegates(List<ItemWriter<? super T>> delegates) {
		this.delegates = delegates;
	}

    @Override
	public void close() throws ItemStreamException {
		for (ItemWriter<? super T> writer : delegates) {
			if (!ignoreItemStream && (writer instanceof ItemStream)) {
				((ItemStream) writer).close();
			}
		}
	}

    @Override
	public void open(ExecutionContext executionContext) throws ItemStreamException {
		for (ItemWriter<? super T> writer : delegates) {
			if (!ignoreItemStream && (writer instanceof ItemStream)) {
				((ItemStream) writer).open(executionContext);
			}
		}
	}

    @Override
	public void update(ExecutionContext executionContext) throws ItemStreamException {
		for (ItemWriter<? super T> writer : delegates) {
			if (!ignoreItemStream && (writer instanceof ItemStream)) {
				((ItemStream) writer).update(executionContext);
			}
		}
	}
}
```

#### 예제 소스

```java
@Slf4j
@Configuration
public class BatchCompositeItemWriterConfiguration {
    public static final int CHUNK_SIZE = 10;

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Bean
    public Job batchCompositeExamJob(){
        return jobBuilderFactory.get("batchCompositeExamJob")
                .start(batchCompositeExamStep())
                .build();
    }

    @Bean
    public Step batchCompositeExamStep() {
        return stepBuilderFactory.get("batchCompositeExamStep")
                .<Menu, Menu> chunk(CHUNK_SIZE)
                .reader(batchCompositeItemReader())
                .processor(batchCompositeItemProcessor())
                .writer(batchCompositeWriterExam1())
                .build();
    }

    /*
     * 두군대의 저장소에 update 처리를 하는 CompositeItemWriter 메서드 
     */
    @Bean
    public CompositeItemWriter<Menu> batchCompositeWriterExam1(){
        CompositeItemWriter<Menu> compositeItemWriter = new CompositeItemWriter<>();
        compositeItemWriter.setDelegates(Arrays.asList(batchCompositeUpdate1(), updateItems()));
        return compositeItemWriter;
    }

    /*
     * 1번 아이템 Writer 
     */
    @Bean
    public ItemWriter<Menu> batchCompositeUpdate1() {
        return items -> {
            for (Menu item : items) {
                log.info("item : {}", item.getItem());
            }
        };
    }

    /*
     * 2번 아이템 Writer
     */
    @Bean
    public JpaItemWriter<Menu> updateItems() {
        JpaItemWriter<Menu> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }

    @Bean
    public ItemProcessor<Menu, Menu> batchCompositeItemProcessor() {
        return menu -> {
            menu.success();
            return menu;
        };
    }
    
    @Bean
    public JpaPagingItemReader<Menu> batchCompositeItemReader() {
        return new JpaPagingItemReaderBuilder<Menu>()
                .queryString("SELECT m FROM Menu m WHERE status is false ")
                .pageSize(CHUNK_SIZE)
                .entityManagerFactory(entityManagerFactory)
                .name("batchCompositeItemReader")
                .build();
    }
}
```

#### 테스트 코드

```java
@RunWith(SpringRunner.class)
@SpringBatchTest
@SpringBootTest(classes = {BatchCompositeItemWriterConfiguration.class, BatchTestConfig.class})
class SpringBatchCompositeItemWriterExamTests {

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
    @DisplayName("메뉴를 조회 하여 두군대의 writer 를 사용 하는 방법")
    public void 메뉴를_조회_하여_두군대의_writer를_사용_하는_방법() throws Exception {
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
    }
}
```

#### 테스트 결과

![스프링 배치 결과](/img/spring/CompositeWriterResult.png){: width=100%, height=100% }


> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security