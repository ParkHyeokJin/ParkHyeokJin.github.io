---
layout: post
title: Java11의 새로운 기능
date:   2019-05-31 10:00:00
categories: others
comments: true 
---

Java11의 새로운 기능
-------------------------

### JAVA11 발표 및 라이센스 변경
오라클은 6개월마다 새로운 버전을 제공 한다고 발표를 했습니다. 그리고 라이센스 및 지원 모델을 변경 했습니다.

Java11 은 더이상 상업용도로 무료가 아닙니다. 개발에서 사용 하는 것은 가능 하지만 상업적으로 사용 하려면
라이센스를 구매 해야 합니다.

2019년 1월 부터 Java8 지원을 중단 하고 추가 지원을 받으려면 비용을 지불 해야 합니다.
사용은 가능 하지만 패치 / 보안 업데이트는 제공 되지 않습니다.


### 변화된 기능

1) Running Java File with single command
- javac를 이용하여 컴파일을 하지 않고 Java 명령어로 클래스를 실행 할 수있도록 지원 합니다.

2) Java String Methods
- isBlank() : isBlank 메소드는 boolean 을 반환하며 공백을 체크 합니다.  
공백만있는 문자열과 빈문자열은 공백으로 처리됨

~~~
System.out.println(" ".isBlank()); //true
System.out.println("PARK".isBlank()); //false
System.out.println("".isBlank()); //true;
~~~

- lines() : 이 메소드는 문자열  배열을 콜랙션 배열로 반환합니다.

~~~
String str = "PARK\nPARK\nPARK"
System.out.println(str.lines().collect(Collectors.toList())); //[PARK, PARK, PARK]
~~~

- strip(), stripLeading(), stripTrailing()
: 이 메소드는 유니코드를 지원하지 않았던 trim()의 개선 버전입니다. strip()은 모든 종류의 공백을 제거합니다.

~~~
System.out.println(" PARK ".strip()); //PARK
System.out.println(" PARK ".stripLeading()); //PARK_
System.out.println(" PARK ".stripTrailing()); //_PARK
//_ : 공백을 표현함.
~~~

- repeat(int)
: repeat 메소드는 단순하게 지정된 숫자 만큼 문자열을 반복해서 더합니다.

~~~
System.out.println("P".repeat(10)); //PPPPPPPPPP
~~~

3) Local-Variable Syntax for Lambda Parameters
- var : 변수의 유형을 추론 할 수 있습니다.

~~~
var list = new ArrayList<String>();
~~~

람다식에서 변수 선언

~~~
(var s1, var s2) -> s1 + s2
~~~

기능 제한 사항

~~~
(var s1, s2) -> s1 + s2 //건너 뛰는것은 허용 하지 않음.
(var s1, String y) -> s1 + y //유형을 섞어 쓰는것은 허용 하지 않음.

var s1 -> s1 //var를 람다에 이용하려면 괄호가 필요함.
~~~

4) Nested Based Access Control
: 중첩 클래스 제어 기능 제공

before Java11

~~~
public class Main{
	public void myPublic(){
	
	}
	
	private void myPrivate(){
	
	}
	
	class Nested{
		public void nestedPublic(){
			myPrivate();
		}
	}
}
~~~

_Java11 이전 버전에서는 위 방법을 통해서 주클래스의 private 메소드에 엑세스를 할 수 있었습니다._
  
Java11

~~~
Method method = ob.getClass().getDeclaredMethod("myPrivate");
method.invoke(ob);
~~~

_Java11은 Reflection 기능을 제공 함으로서 위와 같이 클래스에 엑세스를 할 수 있습니다.(java.lang.class)_

5) Dynamic Class-File Constants
- Java 클래스 파일은 새로운 상수 풀 형식인 CONSTANT_Dynamic을 지원 하여 성능을 향상 시킵니다.

6) Epsilon(A No-Op Garbage Collector)
- 메모리를 할당하고 해제하는 JVM GC와는 달리 Epsilon은 메모리만 할당하며 오버헤드가 없고 수동으로 제한을 할 수 있는 새로운 GC입니다.

7) Remove the Java EE and CORBA Modules
- 제거된 패키지 : java.xml.ws, java.xml.bind, java.activation, java.xml.ws.annotation, java.corba, java.transaction, java.se.ee, jdk.xml.ws,jdk.xml.bind
 
8) Flight Recorder
- 자바 응용프로그램에서 진단 및 프로파일링 데이터를 수집하는데 사용 되는 도구입니다.
  상업용 에드온이였지만 JDK가 유료가 되면서 오픈소스로 되었습니다.
  
9) HTTP Client
- Java11은 Http Client API를 표준화 합니다.
  새로운 API는 HTTP/1.1과 HTTP/2를 지원 합니다. 클라이언트가 요청을 보내고 응답을 받는 전반적인 성능을 향상시킵니다. 또한 WebSocket을 기본적으로 지원 합니다.
  
10) Reading/Writing Strings to and from the Files
- Java11에서는 String의 IO를 사용 하도록 편리한 메소드를 제공합니다.  
	- readString()  
	- writeString()  
	
~~~
Path path = Files.writeString(Files.createTempFile("test", ".txt"), "This was posted on PARK");
String s = Files.readString(path);
System.out.println(s); //This was posted on PARK
~~~

11) ChaCha20 and Poly1305 Cryptographic Algorithms
- Java11은 ChaCha20 및 ChaCha20-Poly1305 Chiper 구현을 제공합니다. 이 알고리즘은 SunJCE 프로바이더로 구현됩니다.

12) Improve Aarch64 Intrinsics
- 기존 문자열 및 배열 내장 함수를 개선 하고 Aarch64 프로세서에서 Java.lang.Math sin, cos 및 log 함수에 대한 새로운 내장 함수를 구현합니다.

13) ZGC: A Scalable Low-Latency Garbage Collector (Experimental)
- Java11은 낮은 대기시간의 GC를 도입 했습니다. _실험적인 기능_

14) Deprecate the Nashorn JavaScript Engine
- Nashorn JavaScript Engine 과 API는 더이상 사용 되지 않으므로 후속 릴리스에서 제거 됩니다.
