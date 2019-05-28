---
layout: post
title: Java11
date:   2016-01-11 10:00:00
categories: others
comments: true 
---

Java11
-------------------------

### JDK11 발표
JDK11은 2018년 9월 25일 발표됨.

### 변화된 기능
1) Nest-Based Access Control

2) Dynamic Class-File Constants

3) Improve Aarch64 Intrinsics

4) Epsilon: A No-Op Garbage Collector

5) Remove the Java EE and CORBA Modules

6) HTTP Client (Standard)

7) Local-Variable Syntax for Lambda Parameters
람다 식의 형식 매개 변수를 선언할때 `var` 를 사용 할 수 있다.

> (var x, var y) -> x.process(y)
> (x, y) -> x.process(y)

암시적으로 형식화 된 람다 식은 var 모든 형식 매개 변수 또는 모든 



8) Key Agreement with Curve25519 and Curve448

9) Unicode 10

10) Flight Recorder

11) ChaCha20 and Poly1305 Cryptographic Algorithms

12) Launch Single-File Source-Code Programs

13) Low-Overhead Heap Profiling

14) Transport Layer Security (TLS) 1.3

15) ZGC: A Scalable Low-Latency Garbage Collector(Experimental)

jdk 11에서 등장한 가비지 콜렉터입니다. ZGC라고도 불리는 이 가비지 콜렉터는 아래의 몇 가지 목표를 가지고 개발되었습니다.

* GC 일시 중지 시간은 10ms를 초과하지 않는다.
* 작은 크기(수백 메가) ~ 매우 큰 크기(수 테라) 범위의 힙을 처리한다.
* G1에 비해 애플리케이션 처리량이 15%이상 감소하지 않는다.
* 향후 GC 최적화를 위한 기반 마련.
* 처음에는 Linux / x64을 지원 (향후 추가 플랫폼 지원 가능).

아시다시피, JVM으로 구동되는 애플리케이션의 경우, GC가 동작할 때 애플리케이션이 멈추는 현상(Stop-The-World)은 성능에서 큰 영향을 끼쳐왔습니다. 이러한 정지시간을 줄이거나 없앰으로써 애플리케이션의 성능향상에 기여할 수 있습니다.

ZGC의 주요 원리는 Load barrier와 Colored object pointer를 함께 사용하는 것입니다. 이를 통해 Java의 애플리케이션 스레드가 동작하는 중간에, ZGC가 객체 재배치 같은 작업을 수행할 수 있게 해줍니다.

16) Deprecate the Nashorn JavaScript Engine

17) Deprecate the Pack200 Tools and API