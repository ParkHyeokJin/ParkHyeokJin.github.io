---
layout: post
title: 스프링 RestAPI 로 웹 서비스 만들기
date:   2019-11-13 10:00:00
categories: Spring
category : Spring
comments: true 
---

스프링 RestAPI를 통하여 회원 가입, 확인, 삭제 기능을 웹서비스를 만들어서 스프링 RestAPI 에 대한 사용 방법을 배워 보겠습니다.

### 스프링부트 웹서비스 만들기(RestAPI)

1. 기본 환경

    - Spring-boot 2.2.1.RELEASE
    - JDK 1.8 이상
    - Maven
    - 사용 가능한 IDE
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo.git>

2. 기능 정의

    - 회원 등록 기능(PUT)
    - 회원 확인 기능(GET)
    - 회원 삭제 기능(DELETE)
    
3. pom.xml

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.jayway.jsonpath</groupId>
            <artifactId>json-path</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

4. RestAPI 회원 정보 기능 구현

    1) 회원 엔티티 생성
    
    - /src/main/member/Member.java
        
        ```java
        @Data
        @NoArgsConstructor
        @Entity
        public class Member {
            
            @Id @GeneratedValue
            private long seq;
            
            @NotEmpty
            private String email;
            @NotEmpty
            private String password;
            
            private String name;
            
            @Column(name = "RegDate")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            private LocalDate date;
            
            public Member(@NotEmpty String email, @NotEmpty String password, String name) {
                this.email = email;
                this.password = password;
                this.name = name;
                this.date = LocalDate.now();
            }
        }
        ```
       
    2) 회원 레파지토리 생성
    
    - /src/main/member/memberRepository.java
        
        ```java
        public interface MemberRepository extends JpaRepository<Member, Long>{
            @Query("select m from Member m where email = :email and password = :password")
            Member findMember(String email, String password);
        }
        ```

    3) 회원 컨트롤러 생성
    
    - @RestController 어노테이션을 통해서 http 요청을 처리합니다.
    - @RequestParam 어노테이션을 통해서 http 요청 변수를 매핑 합니다.
    
    - /src/main/member/memberController.java
        
        ```java
        @Slf4j
        @RestController
        public class MemberController {
        	
        	private MemberRepository memberRepository;
        	
        	public MemberController(MemberRepository memberRepository) {
        		this.memberRepository = memberRepository;
        	}
        
        	@RequestMapping("/GET")
        	private String login(@RequestParam(value="email") String email, 
                                 @RequestParam(value="password") String password) throws JsonProcessingException {
        		ObjectMapper mapper = new ObjectMapper();
        		Map<String, String> map = new HashMap<>();
        		
        		Member member = memberRepository.findMember(email, password);
        		map.put("email", email);
        		if(member == null) {
        			map.put("result", "로그인 정보가 없습니다.");
        		}else {
        			map.put("result", member.getName() + " 님 반갑습니다.");
        		}
        		return mapper.writeValueAsString(map);
        	}
        	
        	@RequestMapping("/PUT")
        	private Member create(@RequestParam(value="email") String email, 
                                  @RequestParam(value="password") String password, 
                                  @RequestParam(value="name") String name) {
        		Member member = new Member(email, password, name);
        		member.setDate(LocalDate.now());
        		memberRepository.save(member);
        		return member;
        	}
        	
        	@RequestMapping("/DELETE")
        	private String delete(@RequestParam(value="email") String email, 
                                  @RequestParam(value="password") String password) throws JsonProcessingException {
        		ObjectMapper mapper = new ObjectMapper();
        		Map<String, String> map = new HashMap<>();
        		
        		Member member = memberRepository.findMember(email, password);
        		map.put("email", email);
        		
        		if(member == null) {
        			map.put("result", "회원 정보가 없습니다.");
        		}else {
        			memberRepository.delete(member);
        			map.put("result", "정상적으로 삭제되었습니다.");
        		}
        		return mapper.writeValueAsString(map);
        	}
        	
        }
        ```  

    5) 스프링 부트 실행

    - 기능 테스트
    
        - 회원 등록
        
            > http://localhost:8080/PUT?email=123@email.com&password=456&name=홍길동
        
            ![회원 가입](/img/spring/member1.PNG){: width=100%, height=100% }

        - 회원 확인
        
            > http://localhost:8080/GET?email=123@email.com&password=456
        
            ![회원 확인](/img/spring/member2.PNG){: width=100%, height=100% }

        - 회원 삭제
        
            > http://localhost:8080/DELETE?email=123@email.com&password=456
        
            ![회원 삭제](/img/spring/member3.PNG){: width=100%, height=100% }
    

> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd