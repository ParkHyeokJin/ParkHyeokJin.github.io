---
layout: post
title: Java8의 8가지 새로운 기능
date:   2016-01-11 10:00:00
categories: Java
comments: true 
---

Java8의 8가지 새로운 기능
-------------------------

### 2014년 JDK 8 (Java SE 8, JDK 8, JRE 8) 발표
2014년 JDK 8 Lambda 추가
2011년 JDK 1.7이 나온 이후로 3년이 업데이트에 3년이 걸렸습니다. 하지만 1.7에서 구현하지 못했던 많은 변화들이 1.8에 담기게 됩니다.

### 변화된 기능

1) Lambda Expression
- 기본 구분

~~~
(argtype arg...) -> { return some expression.. probably using these arguments }
~~~

- Thread 사용 변화

~~~
Runnable oldRunner = new Runnable(){
    public void run(){
        System.out.println("I am running");
    }
};

Runnable java8Runner = () ->{
    System.out.println("I am running");
};
~~~

- Lambdas 사용 할 경우 형식 유추 가능(by scala)
 : Comparator 메소드가 구면 될 때 a, b 유형(이 경우 String, Comparator 인터페이스에서 유추)이 유추됨.

~~~
Comparator c = (a, b) -> Integer.compare(a.length(), b.length());
~~~

2) Generic Type changes and improvements
Java8은 제네릭 메소드 호출에서 명시적 유형 인수의 필요성을 크게 줄이는 추론 지원에 대한 개선 사항을 제공한다.

~~~
jmrClass.method();
//형식 정보를 무시하는 것만으로도 호출 할 수 있습니다.
jmrClass.method();
//이 형식은 메서드 시그니처에 의해 추론 될 수 있으며 뷰 소스 와 같이 중첩 된 호출에 유용 합니다.
myCollection.sort().removeUseless().beautify();
~~~

3) Stream Collection Types(java.util.stream)

~~~
List guys = list.getStream.collect(Collectors.toList())
~~~

또한 다음과 같이 병렬로 구현 될 수있다.

~~~
List guys = list.getStream.parallel().collect(Collectors.toList()
~~~

콜렉션을 단일 항목으로 축소하는 또 다른 좋은 예는 reduce algorithem을 호출하는 것입니다.

~~~
int sum = numberList.stream().reduce(0, (x, y) -> x+y);
// or
int sum = numberList.stream().reduce(0, Integer::sum);
~~~

4) Functional Interfaces(java.util.function)  
* 대표적인 Functional Interfaces  
	+ java.util.function.function   
	+ java.util.function.consumer  
	+ java.util.function.predicate  
	+ java.util.function.supplier  

5) Nashorm - The Node.js on JVM  
JVM에서 javascript를 실행 할 수 있게 해주는 javascript 엔진.

6) Date/Time changes(java.time)  
날짜 / 시간 API는 java.time 패키지로 이동되고 Joda 시간 형식이 뒤 따른다. 또 하나의 장점은 Threadsafe와 불변 클래스가 대부분입니다.

* 현재 시간 구하기

~~~
LocalDateTime timePoint = LocalDateTime.now(); // 현재의 날짜와 시간
~~~

* 원하는 시간으로 time 객체 생성하기

~~~
// 2012년 12월 12일의 시간에 대한 정보를 가지는 LocalDate객체를 만드는 방법  
LocalDate ld1 = LocalDate.of(2012, Month.DECEMBER, 12); // 2012-12-12 from values

// 17시 18분에 대한 LocalTime객체를 구한다.
LocalTime lt1 = LocalTime.of(17, 18); // 17:18 (17시 18분)the train I took home today

// 10시 15분 30초라는 문자열에 대한 LocalTime객체를 구한다.
LocalTime lt2 = LocalTime.parse("10:15:30"); // From a String
~~~

* 현재 날짜와 시간 정보를 getter메소드를 이용하여 구하는 방법

~~~
LocalDate theDate = timePoint.toLocalDate();
Month month = timePoint.getMonth();
int day = timePoint.getDayOfMonth();
int hour = timePoint.getHour();
int minute = timePoint.getMinute();
int second = timePoint.getSecond();
// 달을 숫자로 출력한다 1월도 1부터 시작하는 것을 알 수 있습니다. 
System.out.println(month.getValue() + "/" + day + "  " + hour + ":" + minute + ":" + second);
~~~

7) Type Annotations
이제 주석을 사용하여 제네릭 형식 자체를 장식 할 수 있습니다.

* 심플 타입

~~~
@NotNull String str1 = ...
@Email String str2 = ...
@NotNull @NotBlank String str3 = ...
~~~

* 중첩으로 사용 가능

~~~
Map.@NonNull Entry = ...
~~~

* 형태 주석을 가지는 생성자 

~~~
new @Interned MyObject()
new @NonEmpty @Readonly List<String>(myNonEmptyStringSet)
~~~

* 중첩 된(NonStatic) 클래스 생성자와도 함께 사용 가능

~~~
myObject.new @Readonly NestedClass ()
~~~

* 유형 캐스트

~~~
myString = (@NonNull String) myObject; 
query = (@Untainted String) str;
~~~

* 계승

~~~
class UnmodifiableList<T> implements @Readonly List<T> { ... }
~~~

* 제너릭 형식을 사용 하여 사용 가능

~~~
List<@Email String> emails = ...
List<@ReadOnly @Localized Message> messages = ...
Graph<@Directional Node> directedGraph = ...
~~~

* Exception

~~~
void monitorTemperature() throws @Critical TemperatureException { ... }
void authenticate() throws @Fatal @Logged AccessDeniedException { ... }
~~~

* instanceof

~~~
boolean isNonNull = myString instanceof @NonNull String;
boolean isNonBlankEmail = myString instanceof @NotBlank @Email String;
~~~

* Java8 메소드 및 생성자

~~~
@Vernal Date::getDay
List<@English String>::size
Arrays::<@NonNegative Integer>sort
~~~


8) Other - (nice to have) Changes

- Reflection api의 TypeName, GenericString 추가로 약간의 성능 향상
- String.join() 추가로 자체 생성 유틸리티 클래스가 대신 만들어짐

~~~
 // public static String join(CharSequence delimiter, CharSequence... elements);
 String abc = String.join(" ", "Java", "8");  => "Java 8"
~~~