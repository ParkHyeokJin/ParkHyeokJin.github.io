---
layout: post
title: DDD를 위한 헥사고날 아키텍처 이해하기 1
date:   2023-11-09 10:00:00
categories: Spring
category : Spring
comments: true 
---

### DDD를 위한 헥사고날 아키텍처 이해하기 1

도메인 주도 개발(DDD) 를 위한 헥사고날 아키텍처를 이해하기 위한 첫번째 기록입니다.

개발 아키텍처에는 모놀리식 아키텍처 와 마이크로 서비스 아키텍처 두가지를 가지고 목표와 비즈니스 요건에 따라 다르게 설계를 하고 있습니다.
모놀리식 아키텍처(Monolithic Architecture) 에서는 어플리케이션이 거대한 하나의 아키텍처를 가지고 구성 되어 있는 구조 이기 때문에 개발이 편하고 테스트가 쉬운 장점이 있지만
팀이 같이 개발을 하거나 확장성이 유연하지 않는 단점이 있고 

MSA(Micro service architecture) 에서는 어플리케이션을 서비스 별로 분리 개발을 하기 때문에 분할 하여 개발이 가능 하고
유연 하게 확장을 할 수 있으며 분리 배포가 가능한 장점이 있으나 개발이 복잡 해지고 프로 세스가 분리 되어 있기 때문에 관리 및 전체 테스트가 힘든 단점이 있습니다.

하지만 대량의 시스템 처리와 유연한 확장을 위해서 MSA(Micro service architecture) 방식이 보편화 되고 있습니다.

그래서 이번에는 MSA(Micro service architecture)를 구현하는 개념으로 도메인 주도 개발(DDD) 방법중 헥사고날 아키텍처에 대해서 기록 해보려 합니다. 

### 헥사고날 아키텍처

![Architecture_img](/img/spring/1920px-Hexagonal_Architecture.png){: width="80%" height="80%"}

육각형 모양의 헥사고날 아키텍처는 포트 어뎁터 아키텍처라고도 합니다.
코어를 중심으로 육각형 모양의 각 변 마다 도메인을 배치 하여 구성 하며 각 도메인별 연결은 노출된 인풋 포트와 아웃풋 포트 를 통해서 연결 되는 방식 입니다.
헥사고날 아키텍처의 핵심은 비즈니스 로직이 표현 로직이나 데이터 접근 로직에 더이상 의존 되지 않도록 하는 것이 가장 중요 합니다.

### 어뎁터 패턴

헥사고날 아키텍처는 포트 & 어뎁터를 통한 구성을 하기 때문에 디자인 패턴 중 어뎁터 패턴에 대해서 이해를 하고 있어야 합니다.
어뎁터 패턴에 대해서 간단히 기록 하고 다음시간에 포트를 구성하여 헥사고날 아키텍처에 대해서 더 알아 보겠습니다.


1. 테스트 환경
    - Spring-boot 3.1.5
    - JDK 11
    - gradle
    - Intellij
    - 예제 소스 : <https://github.com/ParkHyeokJin/AdapterPatternDemo>

2. 요건
    - 패스워드 인증 기능이 있는데 토큰 인증 방식이 추가 되었을때 기존의 기능에는 영향 없이 추가 하려면?

#### Member

```java
@Data
@Builder
public class Member {
   private String id;
   private String password;
}
```

### AuthService

```java
public interface AuthService {
   boolean isAuth(Member member);
}
```

### AuthServiceImpl

```java
public class AuthServiceImpl implements AuthService{
    private static final String password = "1234";

    @Override
    public boolean isAuth(Member member) {
        return password.equals(member.getPassword());
    }
}
```

### AuthServiceTest

```java
public class AuthServiceTest {
    @Test
    @DisplayName("패스워드_인증_테스트")
    void PWD_AUTH_TEST() {
        AuthService authService = new AuthServiceImpl();
        Assertions.assertTrue(authService.isAuth(Member.builder()
                .id("TEST")
                .password("1234")
                .build())
        );
    }
}
```

구성 되어 있는 인증 처리는 isAuth 에서 전달된 Member 객체의 패스워드를 비교하여 결과를 전달 하도록 구성 되어 있습니다.
이때 Token을 받아서 처리 할 수 있는 isAuth를 추가 하려면 어떻게 해야 AuthService 인터페이스를 활용 하여 구성 할 수 있을까요?
토큰 인증 서비스는 아래와 같이 구성 되어 있습니다.

```java
public class TokenServiceImpl {
   private static final String Token = "Bearer 1234";

   public boolean isAuth(String token) {
      return Token.equals(token);
   }
}
```

이와 같이 인터페이스와 클래스가 호환되지 않는 경우 어뎁터 클래스를 생성 하여 연결 해줄 수 있습니다.

```java
@Data
@Builder
public class Member {
   private String id;
   private String password;
   private String token; // add
}

public class AuthServiceAdapter implements AuthService {

    @Override
    public boolean isAuth(Member member) {
        TokenServiceImpl tokenService = new TokenServiceImpl();
        return tokenService.isAuth(member.getToken());
    }
}
```

최종적으로 테스트 케이스는 아래와 같습니다.

```java
public class AuthServiceTest {

    @Test
    @DisplayName("패스워드_인증_테스트")
    void PWD_AUTH_TEST(){
        AuthService authService = new AuthServiceImpl();
        Assertions.assertTrue(authService.isAuth(Member.builder()
                .id("TEST")
                .password("1234")
                .build())
        );
    }

    @Test
    @DisplayName("토큰_인증_테스트")
    void TOKEN_AUTH_TEST(){
        AuthService authService = new AuthServiceAdapter();
        Assertions.assertTrue(
                authService.isAuth(Member.builder()
                .token("Bearer 1234")
                .build())
        );
    }
}
```

기존에 구현되어있는 AuthService에 변경 없이 토큰 인증 기능이 Adapter를 통해서 구성 되었으며 테스트가 성공적으로 이루어 집니다.
어뎁터 패턴 이름에서 처럼 어뎁터 클래스를 만들어서 기존 서비스와 호환 되도록 구성하는 것이 핵심입니다.
다음 기록에서는 헥사고날 아키텍처에서 이 어뎁터를 어떻게 이용해서 설계 하였는지에 대해서 테스트 해보도록 하겠습니다.



