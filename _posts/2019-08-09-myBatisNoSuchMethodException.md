---
layout: post
title: Mybatis org.apache.ibatis.reflection.ReflectionException
date:   2019-08-09 10:00:00
categories: Exception
comments: true 
---

### [MyBatis] org.apache.ibatis.reflection.ReflectionException

- Exception 기록을 위한 채널입니다.

>error:org.mybatis.spring.MyBatisSystemException: nested exception is org.apache.ibatis.reflection.ReflectionException: Error instantiating class 클래스명 with invalid types () or values (). Cause: java.lang.NoSuchMethodException: 클래스명<init>()
 
### 해결
MyBatis 연동 도중 위와 같은 Exception 발생 해당 오류는 Default Constructor 가 없어 발생 하는 오류로 확인.

```java
public class TestBean{
    private long seq;
    private String value;

    public TestBean(){}; //Default Constructor 추가
    
    public TestBean(long seq, String value){
        this.seq = seq;
        this.value = value;
    }
}
```

- lombok 사용 시

```java
@NoArgsConstructor  //Default Constructor 추가
@AllArgsConstructor
public class TestBean{
    private long seq;
    private String value;
}
```
