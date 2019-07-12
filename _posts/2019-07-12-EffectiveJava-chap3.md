---
layout: post
title: 생성자를 관리 하는 여러가지 방법
date: 2019-07-12 11:00:00
categories: Java
comments: true
---

> Effective Java E/3 학습을 하며 정리 하는 글입니다.

## 생성자를 관리 하는 여러가지 방법

### private 생성자나 열거 타입으로 싱글턴임을 보증하라.
인스턴스를 오직 하나만 생성 할 경우 싱글턴 을 많이 사용 한다.
여러가지 싱글턴 생성 방식을 살펴보자.

> 예1) public static final 방식의 싱글턴

```java
public class SingletonClass {
	public static final SingletonClass INSTANCE = new SingletonClass();
	private SingletonClass() {}	
}
```

> 예2) 정적 팩터리 방식의 싱글턴

```java
public class SingletonClass {
	private static final SingletonClass INSTANCE = new SingletonClass();
	private SingletonClass() {}	
	public SingletonClass getInstance(){ return INSTANCE; }
}
```

예1과 예2 모두 새로운 인스턴스가 생성 되는 것을 방지 할 수 있다.
하지만 직렬화 해야 하는 경우 추가 방법이 필요하다.

> 예3) 열거 타입 방식의 싱글턴 - 바람직한 방법  

```java
public enum SingletonClass{
	INSTANCE;
	public void build() {}
}
```

- 장점
    - 간결하게 단하나의 인스턴스만 생성 된다.
    - 직렬화 할 수 있다.
    
- 단점
    - 이외의 클래스를 상속 해야 하는 상황에서는 사용이 불가능 하다.

### private 생성자로 인스턴스화를 막아보자

단순한 정적 메서드와 정적 필드만 담은 클래스, 예를들어 유틸성 클래스등의 인스턴스를 막기 위해서는
private 생성자로 막을 수 있다.

> Utils.java  

```java
public class Utils {
	public static int toInt(Object v) {
		return Integer.parseInt(v.toString());
	}
}
```

위와 같은 Utils 클래스가 있을 경우 컴파일러는 매개변수가 없는 기본 생성자를 생성 한다.

```java
public class App{
    public static void main(String[] args) {
        Utils util = new Utils();  //인스턴스 생성
        util.toInt(1);
    }
}
```

위와 같이 새로이 인스턴스를 생성 할 수 있다.  
이 같은 인스턴스 생성을 방지 하기 위해서는 아래와 같이 private 생성자를 생성 하면 방지 할 수 있다.

```java
public class Utils {
	private Utils() {}      //인스턴스화 방지
	public static int toInt(Object v) {
		return Integer.parseInt(v.toString());
	}
}
```

명시적 생성자가 private 이면 클래스 외부에서는 접근 할 수 없기 때문에 인스턴스화를 방지 할 수 있다.

### 의존성 객체 주입 방식

많은 클래스가 하나 이상의 자원에 의존한다. 
아래 예제에서 처럼 이런 클래스를 정적 유틸리티 클래스로 구현 한 모습을 드물지 않게 볼 수 있다. 

```java
public class LanguageChecker {
	private static List<String> language = Arrays.asList("java","C","C++","korlin");
	
	public boolean isLanguage(String s) {
		return language.contains(s);
	}
}
```

예제에서 처럼 클래스가 생성 되었을 경우 변경이 필요한 경우 이거나 다른 유형의 언어들을 사용해야 하는경우
문제가 발생한다.

이런 경우 생성자에서 필요한 자원을 넘겨 받는 의존성 객체 주입 방식을 사용 하게 되면
매우 유연하게 사용 할 수 있다.

```java
public class LanguageChecker {
	private final List<String> language;
	
	//의존성 주입
	public LanguageChecker(List<String> language) {
		this.language = language;
	}
	
	public boolean isLanguage(String s) {
		return language.contains(s);
	}
}
```

