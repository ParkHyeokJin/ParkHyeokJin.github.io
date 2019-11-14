---
layout: post
title: 스프링 + JPA 웹사이트 만들기(로그인편)
date:   2019-11-13 10:00:00
categories: JPA
category : JPA
comments: true 
---

이번에는 앞서 공부 했던 JPA 와 스프링부트를 이용해서 웹사이트 로그인 부분을 만들어 보도록 하겠습니다.  
매우 기본 적인 기능으로 로그인과 회원 가입 기능을 JPA 를 이용해서 사용 해보도록 하겠습니다.

### 스프링부트 + JPA 웹사이트 로그인 만들기

1. 기본 환경

    - 기본 환경은 앞선 포스팅 참조 : <https://parkhyeokjin.github.io/jpa/2019/11/08/JPA-chap11.html>

2. 기능 정의

    - 로그인 기능
    - 회원가입 기능
    - 로그인 성공 실패 기능

3. 로그인 페이지 생성

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
        }
        ```

    3) 회원 컨트롤러 생성
    
    - /src/main/member/memberController.java
        
        ```java
        @Slf4j
        @Controller
        public class MemberConroller {
        	
        	private MemberRepository member;
        	
        	public MemberConroller(MemberRepository member) {
        		this.member = member;
        	}

           @RequestMapping("/")
        	public String login() {
        		return "login";
        	}
        }
        ```

    4) 로그인 html 생성
    
    - 로그인 페이지는 부트스트랩에서 가져 왔습니다.
        
    - /src/main/resources/templates/login.html
        
        ```html
        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>login</title>
            <link rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous">
            <!-- Custom styles for this template -->
            <link href="/css/login/signin.css" rel="stylesheet">
        </head>
        <body class="text-center">
            <form class="form-signin" action="signIn" method="post">
                <img class="mb-4" src="/docs/4.3/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
                <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label for="inputEmail" class="sr-only">Email address</label> 
                <input type="email" id="inputEmail" name="inputEmail" class="form-control" placeholder="Email address" required autofocus> 
                <label for="inputPassword" class="sr-only">Password</label> 
                <input type="password" id="inputPassword" name="inputPassword" class="form-control" placeholder="Password" required>
                <div class="checkbox mb-3">
                    <label> <input type="checkbox" value="remember-me">
                        Remember me
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <div class="checkbox mb-3">
                    <label><a href="signUp">sign up</a></label>
                </div>
                <p class="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
            </form>
        </body>
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossorigin="anonymous"></script>
        <script
            src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
            crossorigin="anonymous"></script>
        <script
            src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>
        
        <style>
        .bd-placeholder-img {
            font-size: 1.125rem;
            text-anchor: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        @media ( min-width : 768px) {
            .bd-placeholder-img-lg {
                font-size: 3.5rem;
            }
        }
        </style>
        </html>
        ```

    5) 스프링 부트 실행
    
    - 로그인 페이지가 나오면 성공 입니다.
    
        ![로그인 페이지](/img/jpa/JPA-CHAP11-1.PNG){: width=100%, height=100% }

4. 기능 구현

    1) 로그인 기능 구현
    
    - MemberController 에 로그인 체크 기능 추가
        
        ```java
        @PostMapping("/signIn")
        public String signIn(String inputEmail, String inputPassword) {
            log.info("id : {} , pw : {}", inputEmail, inputPassword);
            Member member = this.member.findMember(inputEmail, inputPassword);
            if(member != null) {
                return "loginOK";
            }
            return "loginFail";
        }
        ```
          
    - MemberRepository 에 조회 기능 추가
        
        ```java
        @Query("select m from Member m where email = :email and password = :password")
        Member findMember(String email, String password);
        ```
          
    - 로그인 성공, 실패 페이지 생성
        
        - /src/main/resources/templates/loginOK.html 
        
            ```html
            <!doctype html>
            <html xmlns:th="http://www.thymeleaf.org">
            <meta charset="utf-8">
            <meta name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <head th:replace="layouts/header"></head>
            <body>
                <h1>로그인 성공</h1>
            </body>
            </html>          
            ```
          
        - /src/main/resources/templates/loginFail.html
            
            ```html
            <!doctype html>
            <html xmlns:th="http://www.thymeleaf.org">
            <meta charset="utf-8">
            <meta name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <head th:replace="layouts/header"></head>
            <body>
                <h1>로그인 실패</h1>
            </body>
            </html>   
            ```
          
        - 기능 테스트
        
            - 로그인
            
                ![로그인](/img/jpa/JPA-CHAP11-2.PNG){: width=100%, height=100% }
                <br />
                ![로그인실패](/img/jpa/JPA-CHAP11-3.PNG){: width=100%, height=100% }
          
    2) 회원 가입 페이지 생성
    
    - MemberController 에 회원가입 페이지 매핑
        
        ```java
        @RequestMapping("/signUp")
        public String signUp() {
            return "signup";
        }
        ```
        
    - /src/main/resources/templates/signup.html
        
        ```html
        <!doctype html>
        <html xmlns:th="http://www.thymeleaf.org">
        <meta name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <head th:replace="layouts/header"></head>
        <body>
            <form action="/signUp/create" method="post">
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

    - MemberController 에 회원 가입 DB 저장 기능 추가
        
        ```java
        @RequestMapping("/signUp/create")
        public String create(Member member) {
            member.setDate(LocalDate.now());
            this.member.save(member);
            return "login";
        }
        ```

    - 기능 테스트
    
        - 회원 가입
        
            ![회원 가입](/img/jpa/JPA-CHAP11-4.PNG){: width=100%, height=100% }

        - DB 확인
        
            ![회원 가입](/img/jpa/JPA-CHAP11-5.PNG){: width=100%, height=100% }

        - 로그인
        
            ![회원 가입](/img/jpa/JPA-CHAP11-6.PNG){: width=100%, height=100% }
    

> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd