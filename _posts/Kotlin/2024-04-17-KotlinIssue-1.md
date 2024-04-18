---
layout: post
title: Kotlin deserialize error (cannot deserialize from Object value (no delegate- or property-based Creator)) 오류 분석
date: 2024-04-17 08:00:00
categories: kotlin
category : kotlin
comments: true
---

Kotlin 을 활용 하여 개발하는 도중 ObjectMapper 로 JsonString을 deserialize 할때 아래와 같은 오류가 발생 했다.

~~~text
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: Cannot construct instance of `com.kc.noti.dist.RedisTest$Hello` (no Creators, like default constructor, exist): cannot deserialize from Object value (no delegate- or property-based Creator)
 at [Source: (String)"{"name" : "Kotlin", "value" : "Hello"}"; line: 1, column: 2]
	at com.fasterxml.jackson.databind.exc.InvalidDefinitionException.from(InvalidDefinitionException.java:67)
	at com.fasterxml.jackson.databind.DeserializationContext.reportBadDefinition(DeserializationContext.java:1915)
	at com.fasterxml.jackson.databind.DatabindContext.reportBadDefinition(DatabindContext.java:414)
	at com.fasterxml.jackson.databind.DeserializationContext.handleMissingInstantiator(DeserializationContext.java:1360)
	at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.deserializeFromObjectUsingNonDefault(BeanDeserializerBase.java:1434)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:352)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:185)
	at com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.readRootValue(DefaultDeserializationContext.java:323)
	at com.fasterxml.jackson.databind.ObjectMapper._readMapAndClose(ObjectMapper.java:4825)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3772)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3740)
	at com.kc.noti.dist.RedisTest.objectMapperParseErrorTest(RedisTest.kt:60)
	at java.base/java.lang.reflect.Method.invoke(Method.java:568)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
~~~

위와 같은 오류는 Java에서는 발생 하지 않은 오류인데 기본 생성자가 없어서 발생 하는 오류이다.

> Java의 경우 Lombok을 활용하여 @NoArgsConstructor 어노테이션 활용


## 테스트 소스

~~~kotlin
@Test
fun objectMapperParseErrorTest(){
    val testJsonStr = "{\"name\" : \"Kotlin\", \"value\" : \"Hello\"}"
    val objectMapper = ObjectMapper()

    val readValue = objectMapper.readValue(testJsonStr, Hello::class.java)
        logger.info {
            "readValue : $readValue"
        }
    }

    private data class Hello (
        var name : String,
        var value : String
    )
}
~~~

Kotlin 의 Data class 는 자바의 Record 처럼 DTO 에 최적화된 클래스 이다.

자동으로 생성자를 생성 하고 Get/Set을 생성 해준다. (Lombok 의 @Data 어노테이션 처럼.)

하지만 Kotlin 의 Data class 는 기본 생성자(빈생성자) 는 생성 해주지 않는다. 생성 할 수는 있지만 지저분(?)해진다.

그렇기 때문에 ObjectMapper 를 사용 하거나 Jpa 를 사용 하는 경우 deserialize 시 오류가 발생 하게 된다.

아래와 같은 방법을 활용 하여 해결 하여 기록 해둔다.

### 1. KotlinModule 을 활용

ObjectMapper.registerModule 에 KotlinModule 을 주입 하여 Bean 으로 생성 하여 공통 적으로 활용.

* Dependency 추가
~~~groovy
implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
~~~

~~~kotlin
@Bean
fun objectMapper() : ObjectMapper{
    return ObjectMapper().registerModule(KotlinModule.Builder().build())
}
~~~

### 2. Kotlin Extension 활용

~~~kotlin
@Test
fun objectMapperParseErrorTest(){
    val testJsonStr = "{\"name\" : \"Kotlin\", \"value\" : \"Hello\"}"

    var converHelloObject = testJsonStr.parseJsonStringTo<Hello>()

    private data class Hello (
        var name : String,
        var value : String
    )
}

inline fun <reified T> String.parseJsonStringTo(): T = jacksonObjectMapper().readValue<T>(this)
~~~


### Jpa 에서의 대처 방안(allopen, noarg)

JPA를 사용 할때 Class 를 @Entity 로 활용 하는데 위와 비슷한 문제들이 발생한다.

Java 에서 @Entity 를 사용 하는 경우 기본 생성자를 생성 해줘야 하는데 Kotlin 을 사용 하면 또 문제가 발생 한다.

그런 경우 noarg plugin 을 추가 하여 해결 할 수 있다.

allopen 을 추가 하는 이유는 코틀린은 기본적으로 클래스와 프로퍼티, 함수는 final 로 상속이 불가능 하다. 상속 하기 위해서는 open 키워드를 사용 해야하는데

매번 open을 전부 붙여 줄수 없기 때문에 allopen 플러그인을 추가하게 되면 이러한 작업을 대신 해준다.

* Gradle.build 에 Plugin 추가

~~~groovy
plugins{
    kotlin("plugin.allopen") version "1.9.23"
    kotlin("plugin.noarg") version "1.9.23"
}

allOpen {
    annotation("javax.persistence.Entity")
    annotation("javax.persistence.MappedSuperclass")
    annotation("javax.persistence.Embeddable")
}

noArg {
    annotation("javax.persistence.Entity")
    annotation("javax.persistence.MappedSuperclass")
    annotation("javax.persistence.Embeddable")
}
~~~