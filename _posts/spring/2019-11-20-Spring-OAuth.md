---
layout: post
title: 스프링 보안은 어떻게2?? OAuth2를 이용한 소셜 로그인
date:   2019-11-19 10:00:00
categories: Spring
category : Spring
comments: true 
---

### OAuth2 ??

OAuth2 란 Open Authorization , Open Authentication 를 뜻하는 것으로 Third party 에게 자원을 공유하거나 인증을 처리 해주는 표준 프로토콜 입니다.  
OAUth2에는 크게 토큰을 발급 할수 있는 서버 기능과 토큰을 이용한 인증 기능을 하는 기능으로 나뉘게 됩니다.
이번 시간에는 앞서 스프링 시큐리티에서 로그인 기능을 구현 하였기 때문에 해당 소스를 이용하여 OAuth2의 소셜 인증 기능을 살펴 보겠습니다.

### 환경 구성

1. 기본 환경

    - Spring-boot 2.2.1.RELEASE
    - JDK 1.8 이상
    - Maven
    - 사용 가능한 IDE
    - H2 Database
    - 예제 소스 : <https://github.com/ParkHyeokJin/SpringRepo/tree/master/Spring-Security>
    - 완료 소스 : <https://github.com/ParkHyeokJin/SpringRepo/tree/master/Spring-Security-OAuth2>

2. 기능 목표
    
    - 스프링 OAuth2 인증 기능을 이용하여 소셜 인증 기능 구현
    
3. Maven

    ```xml
    <dependencies>
        <!--스프링 OAuth2 의존성 추가-->
        <dependency>
        	<groupId>org.springframework.security.oauth.boot</groupId>
        	<artifactId>spring-security-oauth2-autoconfigure</artifactId>
        	<version>2.0.0.RELEASE</version>
        </dependency>       
    </dependencies>
    ```
   
### 소셜 인증 기능 구현

1) 페이스북 인증 토큰 발급

Oauth2 인증을 사용하기 위해서는 소셜에 어플리케이션을 등록 하고 엑세스 토큰을 발급 받아야 합니다.  
과정은 구글, 페이스북, 카카오, 네이버 등등 인증 key를 발급 하는 사이트는 비슷합니다.

- 페이스북 개발자 사이트에 내앱 생성 <https://developers.facebook.com/tools>
    
    - 상단 메뉴 -> 내앱 -> 생성
    
    ![개발자 사이트 등록1](/img/spring/oauth-1.PNG){: width=100%, height=100% }
    
- 엑세스 토큰 보기

    - 내앱 메뉴 -> 설정 -> 기본 설정
    
    ![개발자 사이트 등록2](/img/spring/oauth-6.PNG){: width=100%, height=100% }
        
2) application.yml 작성

기존 소스에서는 application.properties 파일을 이용해서 스프링부트 설정을 진행 하였으나 리소스 관리의 편리함을위해
yml 파일로 변경 하도록 하겠습니다.

```yaml
server:
  port: 8080
  
spring:
  jpa:
    hibernate:
      ddl-auto: none
    generate-ddl: false
    show-sql: true
  datasource:
    url: jdbc:h2:tcp://localhost/~/test
    username: sa
    password: 1234
    driverClassName: org.h2.Driver
  
facebook:
  client:
    clientId: <앱 id>
    clientSecret: <앱 시크릿코드>
    accessTokenUri: https://graph.facebook.com/oauth/access_token
    userAuthorizationUri: https://www.facebook.com/dialog/oauth
    tokenName: oauth_token
    authenticationScheme: query
    clientAuthenticationScheme: form
  resource:
    userInfoUri: https://graph.facebook.com/me
```

앱 ID와 앱 시크릿코드는 페이스북에서 생성된 자신의 어플리케이션 설정에서 확인 하여 기입 하시면 됩니다.

3) OAuth2 기능 활성화

단일 사인온 기능을 이용할 경우에는  @EnableOAuth2Sso 어노테이션을 이용하면 되지만 우리는 일반 인증 외에
페이스북 인증을 추가 하기 위해서 @EnableOAuth2Sso 어노테이션은 주석 처리를 하고 @EnableOAuth2Client 어노테이션을 활성화 하여 설정 하겠습니다.

- MemberConfig

    ```java
    @Configuration
    @EnableWebSecurity
    @EnableOAuth2Client
    //@EnableOAuth2Sso
    public class MemberConfig extends WebSecurityConfigurerAdapter {
       
        @Autowired
        OAuth2ClientContext oauth2ClientContext;
   
        //......
    }
    ```

- facebook 리소스 빈 추가

    ```java
    @Bean
    @ConfigurationProperties("facebook.client")
    public AuthorizationCodeResourceDetails facebook() {
        return new AuthorizationCodeResourceDetails();
    }

    @Bean
    @ConfigurationProperties("facebook.resource")
    public ResourceServerProperties facebookResource() {
        return new ResourceServerProperties();
    }
    
    @Bean
    public FilterRegistrationBean<OAuth2ClientContextFilter> oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
        FilterRegistrationBean<OAuth2ClientContextFilter> registration = new FilterRegistrationBean<OAuth2ClientContextFilter>();
        registration.setFilter(filter);
        registration.setOrder(-100);
        return registration;
    }
    ```

- Filter 추가

    ```java
    private Filter ssoFilter() {
            OAuth2ClientAuthenticationProcessingFilter facebookFilter = new OAuth2ClientAuthenticationProcessingFilter(
                    "/login/facebook");
            OAuth2RestTemplate facebookTemplate = new OAuth2RestTemplate(facebook(), oauth2ClientContext);
            facebookFilter.setRestTemplate(facebookTemplate);
            UserInfoTokenServices tokenServices = new UserInfoTokenServices(facebookResource().getUserInfoUri(),
                    facebook().getClientId());
            tokenServices.setRestTemplate(facebookTemplate);
            facebookFilter.setTokenServices(tokenServices);
            return facebookFilter;
        }
    ```
  
- 스프링 시큐리티 설정 변경

    스프링 시큐리티 설정에 addFilterBefore 옵션을 이용해서 ssoFilter() 를 등록 합니다.

    ```java
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                // .csrf().csrfTokenRepository(new CookieCsrfTokenRepository())
                .authorizeRequests().antMatchers("/admin/**").hasRole("ADMIN") // Admin 권한이 있는 경우 접근 허용
                .antMatchers("/user/**").hasRole("USER") // User 권한이 있는 경우 접근 허용
                .antMatchers("/", "/home", "/signUp", "/signIn").permitAll() // 해당 URL은 전체 접근 허용
                .anyRequest().authenticated() // 이외의 URL은 인증 절차를 수행하기 위해 login 페이지로 이동
                .and()
                    .addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class).csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
                    
        http.formLogin().loginPage("/login").permitAll();
        
        http
            .logout()
            .logoutUrl("/logout")
            .logoutSuccessUrl("/").deleteCookies("JSESSIONID").invalidateHttpSession(true)
            .permitAll();
    }
    ```

4) 로그인 버튼 추가

- login.html

    ```html
    <form th:action="@{/login/facebook}" method="get">
            <input type="submit" value="facebook" />
    </form>
    ```

5) 어플리 케이션 테스트

- index 페이지에서 hello 페이지로 접근을 하려 하지만 스프링 시큐리티에 의해 로그인 페이지로 이동

    ![index 페이지](/img/spring/oauth-7.PNG){: width=100%, height=100% }

- 페이스북 로그인 버튼 클릭 -> 페이스북 로그인 페이지로 이동

    ![페이스북 로그인](/img/spring/oauth-8.PNG){: width=100%, height=100% }
    
    ![페이스북 로그인완료](/img/spring/oauth-9.PNG){: width=100%, height=100% }
    
- 페이스북 로그인 완료 후 redirect 되어 hello 페이지로 접근 완료.

    ![페이스북 로그인완료](/img/spring/oauth-10.PNG){: width=100%, height=100% }

6) 인증 정보 확인

페이스북 서버로 부터 인증정보를 확인 하기 위해서는 /user 엔드포인트를 작성 합니다.

- MemberController

    ```java
    @Slf4j
    @Controller
    public class MemberConroller {
        @RequestMapping("/user")
        @ResponseBody
        public Principal user(Principal principal) {
           return principal;
        }
    }
    ```   

인증 정보를 확인 하기 위해서 로그인 완료 후 http://localhost:8080/user URL을 호출 합니다.

![페이스북 인증정보 확인](/img/spring/oauth-11.PNG){: width=100%, height=100% }

### ssoFilter 리팩토링

페이스북 외 구글 깃헙 등 인증 서비스를 하는 사이트가 추가됨에 있어 편리하게 추가 할 수 있도록 리팩토링 해보자.

yml 파일을 매핑 하기 위해 ClientResources 클래스를 생성 합니다. NestedConfigurationProperty 어노테이션은 ConfigurationProperties 객체의 필드를
중첩된 유형 인 것 처럼 처리해야 한다는 걸 나타내는 어노테이션 입니다.

```java
public class ClientResources {
	@NestedConfigurationProperty
	private AuthorizationCodeResourceDetails client = new AuthorizationCodeResourceDetails();

	@NestedConfigurationProperty
	private ResourceServerProperties resource = new ResourceServerProperties();

	public AuthorizationCodeResourceDetails getClient() {
		return client;
	}

	public ResourceServerProperties getResource() {
		return resource;
	}
}
```

@ConfigurationProperties 어노테이션을 사용 하여 이전에 만들었던 ClientResources() 객체를 생성 합니다. 이는 yml 파일에서 해당하는 config 설정을 매핑 시켜 줍니다.

- MemberConfig

```java

@Bean
@ConfigurationProperties("github")
public ClientResources github() {
    return new ClientResources();
}

@Bean
@ConfigurationProperties("facebook")
public ClientResources facebook() {
    return new ClientResources();
}
```

ssoFilter 래퍼 메서드를 생성 하여 여러 ssoFilter 를 생성 할 수 있도록 리팩토링 합니다.

```java

private Filter ssoFilter() {
    CompositeFilter filter = new CompositeFilter();
    List<Filter> filters = new ArrayList<>();
    filters.add(ssoFilter(facebook(), "/login/facebook"));
    filters.add(ssoFilter(github(), "/login/github"));
    filter.setFilters(filters);
    return filter;
}

private Filter ssoFilter(ClientResources client, String path) {
    OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(path);
    OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), oauth2ClientContext);
    filter.setRestTemplate(template);
    UserInfoTokenServices tokenServices = new UserInfoTokenServices(
      client.getResource().getUserInfoUri(), client.getClient().getClientId());
    tokenServices.setRestTemplate(template);
    filter.setTokenServices(tokenServices);
    return filter;
}
``` 

이렇게 이 팩토링 된 메서드는 다른 인증 서비스를 추가 할때 filters 에 추가 하면 되도록 편리 하게 활용 할 수 있습니다. 


### 마무리

간단한 어플리케이션 수정을 통해서 페이스북 인증을 통해서 나의 어플리케이션에 인증을 하는 기능을 OAuth2를 이용하여 살펴 보았습니다.  
간단한 어플리케이션을 작성 하여 동작을 먼저 살펴보고 자세히 공부를 하면 어려운 OAuth2 기능도 빠르게 배울 수 있을 것 같습니다.
  
> #JPA #JPQL #hibernate #Spring #SpringBoot #Developer #JAVA #BackEnd #FrontEnd #Batch #SpringBatch
> #Scheduler #Spring Security