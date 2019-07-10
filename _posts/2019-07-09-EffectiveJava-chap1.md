---
layout: post
title: static factory method
date: 2019-07-09 13:00:00
categories: Java
comments: true
---

> Effective Java E/3 학습을 하며 정리 하는 글입니다.

### 생성자 대신 정적 팩터리 메서드를 고려하라.

Effective Java 에서는 생성자 대신 정적 팩터리 메서드를 <u>고려</u> 하라고 설명한다.  
정적 팩터리 메서드가 무엇인지 알아보자.

일반적으로 클라이언트가 클래스의 인스턴스를 생성 하기 위해서는 아래와 같은 방법으로 얻을 수 있다.
```java
SomeClass sc = new SomeClass();
....
```

하지만 클래스는 생성자와 별도로 정적 팩터리 메서드(static factory method)를 제공 할 수 있다.  
아래 코드는 Boolean 기본 타입의 박싱 클래스(boxed class)인 Boolean에서 발췌한 간단한 예다.
```java
public static final Boolean TRUE = new Boolean(true);
public static final Boolean FALSE = new Boolean(false);

public static Boolean valueOf(boolean b){
    return b ? Boolean.TRUE : Boolean.FALSE;
}
```

생성자를 숨기고 좀더 명확한 이름의 valueOf를 통하여 인스턴스를 얻을 수 있다.

아래 클래스를 예로 들어 좀 더 이해해보자.
```java
public class MoonbucksCoffee {
    private int price;
    private int milliliter;
    
    public MoonbucksCoffee(int price, int milliliter) {
        this.price = price;
        this.milliliter = milliliter;
    }
}
```

```java
    MoonbucksCoffee americano = new MoonbucksCoffee(4000, 350);
    MoonbucksCoffee latte = new MoonbucksCoffee(4500, 350);
    MoonbucksCoffee cappuccino = new MoonbucksCoffee(5000, 350);
```

생성자를 통해 인스턴스를 생성하는 경우는 매번 새로 생성을 해야 하며
매개변수인 4000과 350이 무엇을 의미하는지 명확 하게 들어난다고 볼 수 없다.

이번에는 정적 팩터리 메서드를 활용 하여 생성해보자
```java
public class MoonbucksCoffee {
    private static MoonbucksCoffee americano = new MoonbucksCoffee(4000, 350);
    private static MoonbucksCoffee latte = new MoonbucksCoffee(4500, 350);
    private static MoonbucksCoffee cappuccino = new MoonbucksCoffee(5000, 350);
    
    private int price;
    private int milliliter;
    
    private MoonbucksCoffee(int price, int milliliter) {
        this.price = price;
        this.milliliter = milliliter;
    }
    
    public static MoonbucksCoffee americano() {
        return americano;
    }
    
    public static MoonbucksCoffee latte() {
        return latte;
    }
    
    public static MoonbucksCoffee cappuccino() {
        return cappuccino;
    }
}
```

```java
    MoonbucksCoffee americano = MoonbucksCoffee.americano();
    MoonbucksCoffee latte = MoonbucksCoffee.latte();
    MoonbucksCoffee cappuccino = MoonbucksCoffee.cappuccino();
```

생성자를 은닉하고 좀 더 명확한 의미의 인스턴스를 생성할 수 있다.
인스턴스를 미리 만들어 놓아 매번 호출 할때 마다 새로운 인스턴스를 생성할 필요도 없다.

```java
    public static MoonbucksCoffee discountCoffee(Coffee coffee) {
        if(coffee == Coffee.AMERICANO) {
            return new MoonbucksCoffee("americano",2000, 350);
        }else if(coffee == Coffee.CAPPUCCINO) {
            return new MoonbucksCoffee("latte", 3000, 350);
        }else if(coffee == Coffee.LATTE) {
            return new MoonbucksCoffee("cappuccino", 3500, 350);
        }else {
            throw new IllegalArgumentException();
        }
	}
```

이 처럼 반환하는 타입을 유연하게 할인을 적용 해서 하위 타입으로 반환 할 수도 있다.

Effective Java 에서는 아래와 같이 장단점을 소개 하고 있다.
- 장점
    - 이름을 가질 수 있다.
    - 호출 될 때마다 인스턴스를 새로 생성 하지 않아도 된다.
    - 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다.
    - 입력 매개 변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다.
    - 정적 팩터리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재 하지 않아도 된다.

- 단점
    - 상속을 하려면 public이나 protected 생성자가 필요하니 정적 팩터리 메서드만 제공 하면 하위 클래스를 만들 수 없다.
    - 정적 팩터리 메서드는 프로그래머가 찾기 어렵다.

정적 팩터리 메서드는 여러 곳에서 활용 되고 있다.
- from
- of
- valueOf
- instance or getInstance
- create or newinstance
- getType
- newType
- type


