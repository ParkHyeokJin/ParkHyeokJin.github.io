---
layout: post
title: Java7의 10가지 새로운 기능
date:   2014-01-11 10:00:00
categories: others
comments: true 
---

Java7의 10가지 새로운 기능
-------------------------

### 2011년 JDK 7 (Java SE 7, JDK 7, JRE 7) 발표
JDK 1.0에서 JDK 6까지 2년마다 업데이트가 되었지만 JDK 7은 5년만에 업데이트 되었습니다.  
JDK 7의코드 네임은 Dolphin입니다.

제품명은 아래와 같습니다.
- Java™ Platform Standard Edition 7 (Java™ SE 7)
- Java™ SE Development Kit 7 (JDK™ 7)
- Java™ SE Runtime Environment 7 (JRE™ 7)

JDK 7이 나오기까지 Sun 사는 오라클에 인수되는 등 Java는 여러가지 부침을 겪었습니다. 
업데이트가 너무 늦어지자 오라클은 일부 명세를 모아서 업데이트를 하기로 결정하게 됩니다. 결국 JDK 1.7에는 많이들 기대했던 Lambda와 Jigsaw와 같은 기능이 들어가지 못합니다.  
오라클 Java그룹 부사장인 “조지스 사브”는 JDK 6 이후 7이 나오는 기간이 너무 길었던 것이 Java의 역사에서 가장 실망스러웠던 일이었다고 밝히기도 하였습니다.  

> JDK 6 이후에 무척 어려운 기간이 있었습니다. Java 7과 그 이후로 넘어갈 때까지 상당히 오랜 시간이 걸렸습니다. 당시 경제가 어려웠던 탓도 있지만 JDK 코드 베이스를 가져와 OpenJDK를 구성하는 데 많은 시간과 노력이 투입되었습니다. 다음 주요 릴리즈가 나올 때까지 너무 오랜 시간이 걸렸다는 측면에서 실망스러운 일이었지만, 결국 그것도 지금의 OpenJDK 커뮤니티가 형성되고 Java 7과 8이 나오게 된 과정의 일부였습니다.  
-- Java 20주년 "Java의 성공과 실패, 그리고 미래" : 오라클 Java 그룹 부사장 조지스 사브 인터뷰 발췌

### 변화된 기능
1) Type Interface
 * Java7 이전에는 제너릭 타입 파라미터를 선언과 생성에 중복으로 사용 해야 했지만 생성자 영역 타입 파라미터는 <>로 대체가 가능해 졌다.  
 
 oldJava  
 
 ~~~
	Map<String, List<String>> employeeRecords = new HashMap<String, List<String>>();
	List<Integer> primes = new ArrayList<Integer>();
 ~~~
 
 Java7
 
 ~~~
 	Map<String, List<String>> employeeRecords = new HashMap<>();
	List<Integer> primes = new ArrayList<>();
 ~~~
 
2) String in Switch
Switch내에 문자 사용이 가능해 졌다.  

 oldJava  
    int, enum만 switch에 사용 가능
    
 Java7
 
 ~~~
 	switch (day) {
		case "NEW":
			System.out.println("Order is in NEW state");
			break;
		case "CANCELED":
			System.out.println("Order is Cancelled");
			break;
		case "REPLACE":
			System.out.println("Order is replaced successfully");
			break;
		case "FILLED":
			System.out.println("Order is filled");
			break;
		default:
		System.out.println("Invalid"); 
	}
~~~

3) Automatic Resource Management
* Java7 이전에는 DB Connecteion, File stream 등을 open했을 때 오류 발생시에도 정상적인 종료를 위해 finally 블럭안에서 close 처리를 해야한다
* Java7 이후에는 AutoClosable, Closeable 인터페이스를 구현한 객체에 대하여 try 내에서 close를 해준다

oldJava 

~~~
	BufferedReader br = null;
	try{
		br = new BufferedReader(new InputStreamReader(new FileInputStream("file.xml")));
		br.read();
		...
	} catch(IOException e){
		...
	} finally {
		br.close();
	}
~~~

Java7

~~~
	try(BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream("file.xml")))){
		br.read();
		...
	} catch(IOException e){
		...
	}
~~~

4) Fork/Join Framework
* Fork/Join Framework는 멀티프로세서의 성능을 이용할 수 있는 ExecutorService 인터페이스의 구현체이다
* 반복적으로 작은 조각으로 작업을 나누어 수행 할 수 있게 설계 되었다
* 어플리케이션의 성능을 향상 시키기 위해 가능한 모든 프로세서를 이용하기 위한 것
* ExecutorServcie를 구현함으로써 Fork/Join Framework는 Thread Pool안의 Worker Thread에게 작업들을 분배한다
* Fork/Join Framework는 Produce-Consumer 알고리즘과는 매우 다른 work-stealing 알고리즘을 이용한다
* 작업이 없는 Worker Thread는 아직 바쁜 다른 Thread의 작업을 가져올 수 있다
* Fork/Join Framework의 핵심은 AbstractExecutorService 클래스를 구현한 ForkJoinPool 클래스다
* ForkJoinPool은 핵심적인 work-stealing 알고리즘을 구현하고있다
* ForkJoinTask 프로세스들을 실행 할 수 있다

5) Underscore in Numeric literal
* 숫자형(정수,실수)에 _(underscore) 문자열을 사용하여 가독성을 향상 시킬 수 있다

사용가능

~~~
	int billion = 1_000_000_000; // 10^9
	long creditCardNumber = 1234_4567_8901_2345L; //16 digit number
	long ssn = 777_99_8888L;
	double pi = 3.1415_9265;
	float pif = 3.14_15_92_65f;
~~~

사용불가능

~~~
	double pi = 3._1415_9265; // 소수점 뒤에 _ 붙일 경우
	long creditcardNum = 1234_4567_8901_2345_L; // 숫자 끝에 _ 붙일 경우
	long ssn = _777_99_8888L; // 숫자 시작에 _ 붙일 경우
~~~

6) Catching Multiple Exception Type in Single Catch Block  
* catch 블럭에서 여러개의 Exception 처리가 가능하다.  

oldJava

~~~
try {
	//...... 
} catch(ClassNotFoundException ex) {
	ex.printStackTrace(); 
} catch(SQLException ex) {
	ex.printStackTrace(); 
}
~~~

newJava

~~~
try {
	//......
} catch (ClassNotFoundException | SQLException ex) {
	ex.printStackTrace();
}
~~~

7) Binary Literals with Prefix “0b”
* 숫자형에 0B 또는 0b를 앞에 붙임으로써 이진법 표현이 가능하다
* 8진법은 0
* 16진법은 0X 또는 0x

~~~
  int mask = 0b01010000101;
  int binary = 0B0101_0000_1010_0010_1101_0000_1010_0010;    // _를 이용한 가독성 향상!
~~~

8) Java NIO 2.0  
* 기본파일시스템에 접근도 가능하고 다양한 파일I/O 기능도 제공
* 파일을 이동
* 파일 복사
* 파일 삭제
* 파일속성이 Hidden인지 체크도 가능
* 심볼릭링크나 하드링크도 생성 가능
* 와일드카드를 사용한 파일검색도 가능
* 디렉토리의 변경사항을 감시하는 기능 등등..

9) G1 Garbage Collector
* G1(Garbage First)
* 새로운 Garbage Collector가 추가
* G1 GC는 Garbage가 가장 많은 영역의 정리를 수행한다
* 메모리 집중적인 어플리케이션에 더 큰 Through put을 제공

10) More Precise Rethrowing of Exception
* JDK7 이전 버젼에서는 catch 구문내에서 선언한 예외 유형만 밖으로 던질 수 있었지만 JDK7에서는 catch 구문에서 선언한 예외도 밖으로 던질 수 있다

oldJava (catch 구문내에서 선언한 예외 유형만 밖으로 던질 수 있다)

~~~
public void obscure() throws Exception {
	try {
		new FileInputStream("abc.txt").read();
		new SimpleDateFormat("ddMMyyyy").parse("12-03-2014");
	} catch (Exception ex) {
		System.out.println("Caught exception: " + ex.getMessage());
		throw ex;
	}
}  
~~~

Java7 (catch 구문에서 선언한 예외 유형만 밖으로 던질 수 있다)

~~~
public void precise() throws ParseException, IOException {
	try {
		new FileInputStream("abc.txt").read();
		new SimpleDateFormat("ddMMyyyy").parse("12-03-2014");
	} catch (Exception ex) {
		System.out.println("Caught exception: " + ex.getMessage());
		throw ex;
	}
}
~~~
