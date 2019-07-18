---
layout: post
title: Java 문자열을 연결하는 방법(StringJoining.class and String.join())
date: 2019-07-18 10:00:00
categories: Java
comments: true
---

### StringJoining.class and String.join()

여러 문자열 리터럴 또는 객체를 연결 하는 것은 프로그래밍에서 일반적인 요구 사항이다.
오랫동안 JDK API에서는 여러 문자열 리터럴 또는 객체를 연결 하는 방법이 없었기 때문에
별도로 개발을 해야 했다.  
아래와 같은 요건이 주어졌을 경우를 생각해보자.

- 요건 1 : {"hello", "java", "World"}의 문자열 배열이 있다. 이 문자열 배열을 " " 공백으로 연결 하고자 한다.
  
> 예1) Joning.class

```java
public class Joning{
    String[] str = {"hello", "java", "World"};
    @Test
    public void vanillaJava() {
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < str.length; i++) {
            sb.append(str[i]).append(" ");
        }
        assertEquals("hello java World", sb.toString());
    }
}
```
    
문자열 배열을 루프를 돌면서 연결 하였다. 하지만 위 코드는 오류가 난다.  
"hello java World" 를 기대 하였지만 마지막에 " " 구분자가 더해져서 오류가 발생 하였다.  
그래서 아래와 같이 마지막 인덱스에서는 구분자를 더하지 않도록 조건을 주었다.  
    
```java
public class Joning{
    String[] str = {"hello", "java", "World"};
    @Test
    public void vanillaJava() {
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < str.length; i++) {
            if(i == str.length-1) {
                sb.append(str[i]); 
                break;
            }
            sb.append(str[i]).append(" ");
        }
        assertEquals("hello java World", sb.toString());
    }
}
```
    
위는 간단한 배열을 조인하는 방법이지만 String을 연결 하는 과정에서 String, StringBuilder, StringBuffer등
어떤것을 사용 하느냐에 따라 성능 메모리등 고려해야 하는 부분들이 존재 하며
위 버그 처럼 문제점이 발생 할 소지가 높다.  
이런 문제점을 JAVA8에서는 StringJonier.class 와 String.Join() API를 이용해서 해결 할 수 있어졌다.
    
### StringJoiner  
주어진 요건은 위 요건1과 동일한 조건이다. StringJonier.class를 활용한 소스를 보자.

    ```java
    public class Joning{
        String[] str = {"hello", "java", "World"};
        @Test
        public void java8Joiner() {
            StringJoiner joiner = new StringJoiner(" ");
            for(int i = 0; i < str.length; i++) {
                joiner.add(str[i]);
            }
            assertEquals("hello java World", joiner.toString());
        }
    }
    ```    

간단한 방법으로 테스트가 통과했다. 마지막 인덱스를 고려 해야 할 필요도 없고 메모리를 고려 할 필요도 없다.  
    
- StringJoiner Constructor
    
```java
   public StringJoiner(CharSequence delimiter){}
   public StringJoiner(CharSequence delimiter,
                       CharSequence prefix,
                       CharSequence suffix){}
```
    
- add() Method
    
```java
public StringJoiner add(CharSequence newElement) {
        prepareBuilder().append(newElement);
        return this;
    }
 ```
     
> add 메서드는 Builder 로 구성되어있어 아래와 같이 연결해서 사용이 가능하다.
    
```java
 new StringJoiner(" ").add("hello").add("java").add("World");
```
    
### String.Join()

JAVA8에서는 String 클래스에서 Join 메서드를 제공 하고 있다.
    
    ```java
    public class Joning{
        String[] str = {"hello", "java", "World"};
        @Test
        public void java8StringJoin() {
                     assertEquals("hello java World", String.join(" ", str));
        }
    }
    ```
    
한줄을 이용해서 동일한 결과를 얻을 수 있다.  
String.Join() 메서드는 아래와 같이 내부적으로 StringJoiner() 클래스를 구성하고 잇다.
    
- String.Join()
    
    ```java
    public static String join(CharSequence delimiter, CharSequence... elements) {
            Objects.requireNonNull(delimiter);
            Objects.requireNonNull(elements);
            // Number of elements not likely worth Arrays.stream overhead.
            StringJoiner joiner = new StringJoiner(delimiter);
            for (CharSequence cs: elements) {
                joiner.add(cs);
            }
            return joiner.toString();
        }
    ```
    
### 결론
이외에도 Stream Collectors 클래스의 joining()을 이용해서 연결을 할 수 도 있지만
메서드 내부에서는 StringJonier 클래스 를 이용해서 구현 되어있기 때문에
StringJonier 클래스를 공부 해서 알고 있는 것이 좋을 것 같다.
    

    