---
layout: post
title: Kotlin 스터디 1일차
date: 2019-06-29 13:00:00
categories: kotlin
category : kotlin
comments: true
---

### Hello World
1. 스터디 환경
    - IDE : IntelliJ
    - OS  : Windows10
    - JVM : JDK1.8
2. 프로젝트 생성
    - File -> new Project -> Kotlin/JVM
3. Hello World
    - src -> new File -> Kotlin file / class

- _app.kt_

~~~kotlin
package org.kotlinlang.play         // 1
fun main() {                        // 2
    println("Hello, World!")        // 3
}
~~~

~~~kotlin
package org.kotlinlang.play         // 1
fun main(args: Array<String>) {     // 2
    println("Hello, World!")        // 3
}
~~~

_Kotlin 1.3 이전 버전에서는 args: Array<String> 매개 변수가 필요합니다._


### Functions

- _Functions_Exam.kt_

~~~kotlin
fun printMessage(message: String): Unit {                               // 1
    println(message)
}

fun printMessageWithPrefix(message: String, prefix: String = "Info") {  // 2
    println("[$prefix] $message")
}

fun sum(x: Int, y: Int): Int {                                          // 3
    return x + y
}

fun multiply(x: Int, y: Int) = x * y                                    // 4

fun main() {
    printMessage("Hello")                                               // 5                    
    printMessageWithPrefix("Hello", "Log")                              // 6
    printMessageWithPrefix("Hello")                                     // 7
    printMessageWithPrefix(prefix = "Log", message = "Hello")           // 8
    println(sum(1, 2))                                                  // 9
}
~~~

1) String 형식의 매개 변수를 하용 하는 간단한 함수  
2) 선택적 매개 변수 prefix: String = "Info"를 사용하는 함수 입니다.  
3) 정수를 반환하는 함수.  
4) 정수를 반환하는 단일 표현식 함수 입니다.(리턴 형식 유추)  
5) hello 인수가 있는 첫 번째 함수를 호출합니다.  
6) 두 개의 매개 변수를 사용하여 함수를 호출합니다.  
7) 두 번째 함수를 생각 하고 함수를 호출 합니다. 이때 prefix 값은 기본 값인 Info를 이용하게 됨.   
8) 명명된 인수를 사용 하여 함수를 호출 하고 인수의 순서를 변경합니다.  
9) 함수의 결과를 출력 합니다.  


