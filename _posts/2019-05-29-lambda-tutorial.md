---
layout: post
title: 자바 람다식 튜토리얼
date:   2019-05-29 10:00:00
categories: others
comments: true 
---

자바 람다식 소개
----------------

이 포스팅에서는 Java Lambda Express 에 대해 소개 합니다.
Lambda 기능은 Java8에서 소개 되었는데 Functional Programming 을 하기 위한 첫번째 단계로 볼 수 있습니다.
클래스 없이 함수를 만들 수 있고 매개변수로 전달도 가능 하며 필요에 따라 언제든지 실행 할 수 있습니다.
Java Lambda expressions 는 전달할 수 있는 익명 함수(Anonymous Class)의 간결한 표현입니다.

* 속성  
	+ Anonymous class : 명시적 이름이 없기 때문에 익명으로 호출 할 수 있다.
	+ 간결 : Anonymous Class 의 경우에도 언급했듯이, 익명 클래스에 비해 작성 코드를 줄일 수 있다.
	+ 기능 : Lambda는 매개 변수 목록을 허용하고 본문을 가지며 예외도 throw 할 수 있다.
	+ 전달 : Lambda는 일반 매개 변수 처럼 다른 함수로 전달 될 수 있다.
	
### 자바 람다식 작성 하는 방법

간단한 기능을 수행 하는 코드를 작성하여 Lambda Expressions 을 이용하면 얼마나 간결하게 소스 코드를 줄일 수 있는지 비교합니다.  
비교를 위해 학생 ID, NAME을 매개 변수로 포함하는 간단한 POJO 클래스를 만듭니다.

_Student.java_

~~~java
public class Student{
	private Long id;
	private String name;
	// standard setters and getters
}
~~~

POJO 응용 프로그램에서 정의한 객체를 비교하는 것은 매우 일반적인 프로그래밍 방법입니다.  
두개의 Student 클래스 객체를 비교하려면 Comparator를 다음과 같이 만들 수 있습니다.

_Comparator Anonymous Class_

~~~java
Comparator<Student> byId = new Comparator<Student>(){
	@Override
	public int compare(Student s1, Student s2){
		return s1.getId().compareTo(s2.getId());
	}
}
~~~

위 코드는 Anonymous Class로 간단한 Comparator를 구현 한 것이지만 Lambda를 이용했을때 동일한 코드가
어떻게 변화하는지 비교 할 수 있습니다.

_Lambda_

~~~java
Comparator<Student> byId = (s1, s2) -> s1.getId().compareTo(s2.getId());
~~~

위 람다식은 -> 기호의 오른쪽에 단일 코드 블록으로 구성되어 있어 <b>블록 람다식</b> 이라고도 할 수 있습니다.
다음 코드는 더욱 간결한 소스 코드로 변환 한 예제 입니다.

_Concise implementation of Lambda_

~~~java
Comparator<Student> byId = Comparator.comparing(Student::getId);
~~~

### Lambda Expressions VS Anonymous Class

람다식을 사용하여 작성한 코드는 람다식과 완전히 동일한 익명 클래스를 사용하여 작성 할 수 있습니다.

예) Runnable을 입력으로 사용하는 클래스와 메소드로 비교 해보겠습니다.
_Runnable with Anonymous Class_

~~~java
Runnable runnable = new Runnable(){
	@Override
	public void run(){
		System.out.println("Anonymous class implementation.");
	}
};
runnable.run();
~~~

_Lambda Runnable_

~~~java
Runnable runnable = () -> System.out.println("Lambda Expression.");
runnable.run();
~~~

예2) Comparator Interface 를 이용 하여 비교 해보 겠습니다.

_Comparator Anonymous Class_
~~~java
List<Node> nodes = new ArrayList<Node>();

// Sort with inner Class
Collections.sort(nodes, new Comparator<node>(){
	public int compare(Node n1, Node n2){
		return n1.getValue().compareTo(n2.getValue());
	}
}
~~~

_Lambda Expression_
~~~java
Collections.sort(nodes, (Node n1, Node n2) -> n1.getValue().compareTo(n2.getValue()));
~~~

~~~java
Collections.sort(nodes, (n1, n2) -> n1.getValue().compareTo(n2.getValue()));
~~~
_매개 변수 유형 추론

### Functional Interface 작성 방법
Functional Interface는 단 하나의 Abstract Method 를 가질 수 있습니다.

* Print.java
~~~java
@FunctionalInterface
public Interface Print{
	public abstract void print();
}
~~~

* PrintTest.java
~~~java
public static void main(String[] args){
	Print p = () -> System.out.println("print test!!");
	p.print();
}
~~~

### Java.util.stream 패키지에서의 Lambda
stream 에서의  Lambda식 활용

~~~java
public void main(String args[]){
	List<String> myList =
	        Arrays.asList("area", "block", "building", "city", "country");
	 
	myList.stream()
	        .filter(s -> s.startsWith("c"))
	        .map(String::toUpperCase)
	        .sorted()
	        .forEach(System.out::println);
}
~~~

이 처럼 많은 부분에서 Lambda 식은 활용 될 수 있다. 아직 실제 서비스에서의 사용에는 Stream, Enum 정도에서 사용을 하고 있다.
가독성 부분에서 의견이 분분 한 것 같지만 매우 편한 방법임은 확실 한 것 같다.

