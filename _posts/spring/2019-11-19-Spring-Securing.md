---
layout: post
title: 스프링 보안은 어떻게?? 로그인 만들어보기 (Spring Security)
date:   2019-11-19 10:00:00
categories: Spring
category : Spring
comments: true 
---

### 스프링 시큐리티??

스프링 시큐리티는 어플리케이션의 보안을 위해 권한(Authorization)과 인증(Authentication) 에 대한 기능을 제공 합니다.  
권한(Authorization)은 URL을 사용할 수 있는 권한을 말하며 인증(Authentication) 은 어플리케이션에 로그인 할 수 있는 기능을 말합니다.  

허용되지 않은 페이지에 사용자가 접근 할 경우 스프링 시큐리티는 페이지 호출 전에 인증이 되어있는 지를 체크 하고 페이지에 접근 할 수 있는 권한이 있는지
체크를 하여 페이지의 접근을 허용하거나 차단하는 하는 기능을 수행 합니다.

간단한 어플리케이션을 작성하여 스프링 시큐리티에 대해서 동작을 살펴 보겠습니다.

### 환경 구성

1. 기본 환경

    - Spring-boot 2.2.1.RELEASE
    - JDK 1.8 이상
    - Maven
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo.git>

2. 기능 목표
    
    - 스프링 시큐리티를 이용한 로그인, 로그아웃, 회원 가입 기능 구현
    
3. Maven

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.10</version>
            <scope>provided</scope>
        </dependency>
   
        <!-- 스프링 시큐리티를 사용하기 위한  dependency-->
        <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
    </dependencies>
    ```
   
### 회원 로그인 기능 구현

1) 컨트롤러 작성

- Member
    
    회원 관리 엔티티와 레파지토리를 아래와 같이 작성 합니다.

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
        }
    }
    
    public interface MemberRepository extends JpaRepository<Member, Long>{
        
        @Query("select m from Member m where email = :email and password = :password")
        Member findMember(String email, String password);
    
        Member findByEmail(String email);
    }
    ```

- MemberController

    어플리케이션은 메인페이지, 로그인, 회원가입, 로그인 후 페이지 총 4개의 URL을 구현합니다.

    ```java
    @Slf4j
    @Controller
    public class MemberConroller {
        
        @Autowired
        private MemberService member;
        
        @GetMapping("/")
        public String index() {
            return "/index";
        }
        
        @GetMapping("/hello")
        public String hello() {
            return "/hello";
        }
        
        @GetMapping("/login")
        public String login() {
            return "/login";
        }
        
        @GetMapping("/signUp")
        public String signUp() {
            return "/signUp";
        }
        
        @PostMapping("/create")
        public String create(Member member) {
            member.setDate(LocalDate.now());
            this.member.save(member);
            return "redirect:/login";
        }
    }
    ```

- MemberConfig

    스프링 시큐리티를 사용 하기 위해서는 @EnableWebSecurity 어노테이션을 작성 하고 WebSecurityConfigurerAdapter 클래스를 상속 받아 필요한 설정을 해야 합니다.
    MemberConfig http 호출을 중간에서 가로채서 권한여부를 체크 하게 되며 권한이 있는 경우 URL로 접근을 하고 없는 경우는 login처리를 하거나 설정된 페이지로  
    보내는 등의 보안 기능을 수행 합니다. 

    ```java
    @Configuration
    @EnableWebSecurity
    public class MemberConfig extends WebSecurityConfigurerAdapter {
        @Autowired
        private CustomAuthenticationProvider authProvider;
        
        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.authenticationProvider(authProvider);
        }
        
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests()
                    .antMatchers("/admin/**").hasRole("ADMIN")	//Admin 권한이 있는 경우 접근 허용
                    .antMatchers("/user/**").hasRole("USER")	//User 권한이 있는 경우 접근 허용
                    .antMatchers("/", "/home", "/signUp", "/signIn").permitAll() //해당 URL은 전체 접근 허용
                    .anyRequest().authenticated()	//이외의 URL은 인증 절차를 수행하기 위해 login 페이지로 이동
                    .and().csrf().disable()
                .formLogin()            //로그인 수행
                    .loginPage("/login")
                    .permitAll()
                    .and()
                .logout()               //로그아웃 수행
                    .permitAll();
        }
    
        @Bean
        public PasswordEncoder passwordEncoder() {
            return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }
    }
    ```

이제 권한과 인증을 처리 하기 위해 UserDetailsService(권한) 와 AuthenticationProvider(인증) 인터페이스를 구현 해야 합니다.

- MemberService(권한)

    권한 체크를 하기 위해서 UserDetailsService 인터페이스를 구현한 MemberService 클래스를 작성합니다.
    MemberService 는 DB에서 입력된 email로 회원 정보를 조회 하여 해당 회원의 ID, Pass, 권한 등을 리턴합니다.
    
    ```java
    @Slf4j
    @Service
    public class MemberService implements UserDetailsService{
        @Autowired
        private MemberRepository memberRepository;
        
        @Autowired
        private PasswordEncoder passwordEncoder;
        
        @Override
        public UserDetails loadUserByUsername(String inputEmail) throws UsernameNotFoundException {
            //회원 이름으로 회원을 조회 한다.
            Member member = memberRepository.findByEmail(inputEmail);	
    
            //회원정보 권한에 따라서 권한을 부여한다.
            List<GrantedAuthority> auth = new ArrayList<GrantedAuthority>();
            if(("admin@email.com").equals(inputEmail)) {
                auth.add(new SimpleGrantedAuthority("ADMIN"));
            }else {
                auth.add(new SimpleGrantedAuthority("USER"));
            }
            return new User(member.getEmail(), member.getPassword(), auth);
        }
        
        //회원을 저장한다. 
        public Member save(Member member) {
            //비밀번호 암호화
            member.setPassword(passwordEncoder.encode(member.getPassword()));
            return memberRepository.save(member);
        }
    }
    ```

- CustomAuthenticationProvider(인증)

    인증 처리를 하기 위해서는 AuthenticationException 인터페이스를 구현 해야 합니다. AuthenticationException 인터페이스를 구현한  
    CustomAuthenticationProvider 클래스는 권한에서 조회된 비밀번호와 유저가 입력한 비밀번호를 비교하여 인증처리를 합니다.
    
    ```java
    @Slf4j
    @Component
    public class CustomAuthenticationProvider implements AuthenticationProvider{
    
        @Autowired
        private MemberService memberService;
        
        @Autowired
        private PasswordEncoder passwordEncoder;
        
        @Override
        public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            
            String username = authentication.getName();
            String password = (String) authentication.getCredentials();
            
            UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication; 
            
            UserDetails user = memberService.loadUserByUsername(authToken.getName());
            
            //입력 받은 비밀번호와 DB에 저장된 비밀번호를 비교하여 인증 처리를 한다.
            if(!passwordEncoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("password error");
            }
            
            return new UsernamePasswordAuthenticationToken(username, password, user.getAuthorities());
        }
    
        @Override
        public boolean supports(Class<?> authentication) {
            return authentication.equals(UsernamePasswordAuthenticationToken.class);
        }
    }
    ```

2) 뷰 페이지 작성.

- index.html

    ```html
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="https://www.thymeleaf.org" xmlns:sec="https://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
    <meta charset="utf-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <head th:replace="layouts/header"></head>
    <body>
        <h1>Hello, world!</h1>
        Click <a th:href="@{/hello}">here</a> to see a greeting.
    </body>
    </html>
    ```

- Login.html

    ```html
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="https://www.thymeleaf.org"
          xmlns:sec="https://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
        <head>
            <title>Spring Security Example </title>
        </head>
        <body>
            <div th:if="${param.error}">
                Invalid username and password.
            </div>
            <div th:if="${param.logout}">
                You have been logged out.
            </div>
            <form th:action="@{/login}" method="post">
                <div><label> User Name : <input type="text" name="username"/> </label></div>
                <div><label> Password: <input type="password" name="password"/> </label></div>
                <div><input type="submit" value="Sign In"/></div>
            </form>
            <form th:action="@{/signUp}" method="get">
                <input type="submit" value="Sign Up"/>
            </form>
        </body>
    </html>
    ```

- signUp.html

    ```html
    <!doctype html>
    <html xmlns:th="http://www.thymeleaf.org">
    <meta name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <head th:replace="layouts/header"></head>
    <body>
        <form action="/create" method="post">
        <input type="hidden" name="${parameterName}" value="${token}" />
            <div class="container">
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label> <input
                        type="email" class="form-control" id="exampleInputEmail1"
                        name="email" aria-describedby="emailHelp" placeholder="Enter email">
                    <small id="emailHelp" class="form-text text-muted">We'll
                        never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label> <input
                        type="password" class="form-control" id="exampleInputPassword1"
                        name="password" placeholder="Password">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Name</label> <input type="text"
                        class="form-control" id="exampleInputPassword1" name="name"
                        placeholder="name">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </body>
    </html>
    ```

- hello.html

    ```html
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="https://www.thymeleaf.org"
          xmlns:sec="https://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
        <head>
            <title>Hello World!</title>
        </head>
        <body>
            <h1 th:inline="text">Hello [[${#httpServletRequest.remoteUser}]]!</h1>
            <form th:action="@{/logout}" method="post">
                <input type="submit" value="Sign Out"/>
            </form>
        </body>
    </html>
    ```

3) 동작 원리

    1) 어플리케이션에 처음 접속 하는 경우 /index 페이지가 호출 됩니다. /index 페이지 내의 here 링크를 클릭하여 /hello 로 접속을 시도 합니다.
    2) /hello URL로 접근을 시도 하였으나 스프링 시큐리티는 허용되지 않은 URL이기 때문에 권한을 체크하고 인증을 하기 위해 /login URL로 보냅니다.
    3) /login URL에서 정상적으로 로그인이 된 경우 처음 접속 하고자 했던 /hello URL로 redirect 하게 되며 인증이 되었기 때문에 해당 페이지에 접근할 권한이 주어져서 
       /hello URL 로 정상 적으로 접근이 가능합니다.
   
### 마무리

간단한 어플리케이션을 통해 페이지 인증과 권한에 대해서 테스트를 해보았으며 스프링 시큐리티가 어떻게 동작을 하는지 맛보기를 해보았습니다. 
어떻게 스프링 시큐리티가 동작 하는지 이해가 되었기 때문에 세부적인 부분에 대해서 더 깊숙이 들어 갈 수 있을 것입니다.
   
> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security