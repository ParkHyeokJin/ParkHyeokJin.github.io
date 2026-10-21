---
layout: post
title: JDK 25 (LTS) 살펴보기 - 21에서 달라진 것들
date:   2026-10-21 00:00:00
categories: Java
category : Java
comments: true
---

### 들어가며

JDK 25가 **2025년 9월 16일**에 GA 되었고, JDK 21 이후 다음 **LTS** 입니다. (대부분의 벤더가 LTS로 제공합니다.) 이번 릴리스에는 JEP가 18개 들어갔습니다.

이번 글에서는 18개를 전부 훑기보다, **실무에서 체감할 만한 변화** 위주로 정리해 봅니다. 앞서 정리한 [JAVA 21 - VirtualThread 기능 살펴보기]({{ site.baseurl }}/java/2024/01/02/java21-VirtualThread.html) 와 이어서 읽으시면 좋습니다.

> **📌 표기와 시점에 대해**
> 이 글의 내용은 [OpenJDK JDK 25 프로젝트 페이지](https://openjdk.org/projects/jdk/25/) 와 각 JEP 문서를 기준으로 정리했습니다. 정식(Final), 프리뷰, 인큐베이터, 실험 기능을 구분해서 적었습니다.
>
> 코드 예제는 JEP 문서의 예제를 단순화한 것이고, **직접 실행해서 확인하지는 않았습니다.** 성능 수치는 JEP 에 인용된 벤치마크 결과입니다.

---

### 1. 한눈에 보기

| JEP | 제목 | 상태 | 분류 |
|---|---|---|---|
| 513 | Flexible Constructor Bodies | 정식 | 언어 |
| 512 | Compact Source Files and Instance Main Methods | 정식 | 언어 |
| 511 | Module Import Declarations | 정식 | 언어 |
| 507 | Primitive Types in Patterns, instanceof, and switch | 프리뷰 (3rd) | 언어 |
| 506 | Scoped Values | 정식 | 동시성 |
| 505 | Structured Concurrency | 프리뷰 (5th) | 동시성 |
| 519 | Compact Object Headers | 정식 | 성능/런타임 |
| 521 | Generational Shenandoah | 정식 | 성능/런타임 |
| 514 | Ahead-of-Time Command-Line Ergonomics | 정식 | 성능/런타임 |
| 515 | Ahead-of-Time Method Profiling | 정식 | 성능/런타임 |
| 509 | JFR CPU-Time Profiling | 실험 | 관측성 |
| 518 | JFR Cooperative Sampling | 정식 | 관측성 |
| 520 | JFR Method Timing & Tracing | 정식 | 관측성 |
| 510 | Key Derivation Function API | 정식 | 보안 |
| 470 | PEM Encodings of Cryptographic Objects | 프리뷰 | 보안 |
| 502 | Stable Values | 프리뷰 | 라이브러리 |
| 508 | Vector API | 인큐베이터 (10th) | 라이브러리 |
| 503 | Remove the 32-bit x86 Port | 정식 | 제거 |

**바로 쓸 수 있는 것은 "정식"**이고, 프리뷰와 인큐베이터는 `--enable-preview` 등 별도 옵션이 필요합니다.

---

### 2. 언어 변화

#### 2-1. Flexible Constructor Bodies (JEP 513)

생성자에서 `super(...)` 또는 `this(...)` 가 **반드시 첫 줄이어야 한다는 규칙이 사라졌습니다.** 그 앞(prologue)에 검증이나 인자 가공 코드를 넣을 수 있습니다.

```java
// Before: 부모 생성자가 먼저 실행된 뒤에야 검증
Employee(String name, int age, String officeID) {
    super(name, age);
    if (age < 18 || age > 67)
        throw new IllegalArgumentException("age");
    this.officeID = officeID;
}

// After: 검증이 먼저 실행되어 빠르게 실패
Employee(String name, int age, String officeID) {
    if (age < 18 || age > 67)
        throw new IllegalArgumentException("age");
    this.officeID = officeID;
    super(name, age);
}
```

단, prologue 에서는 **아직 만들어지는 중인 인스턴스를 사용할 수 없습니다.**

- `this`, 인스턴스 필드 읽기, 인스턴스 메서드 호출은 컴파일 에러입니다.
- 예외로, **초기화식이 없는 같은 클래스의 필드에 대한 단순 대입**(`this.officeID = ...`)은 허용됩니다.
- prologue 에서는 `return` 을 쓸 수 없고, 예외 throw 는 가능합니다.

#### 2-2. Compact Source Files and Instance Main Methods (JEP 512)

입문용으로 "Hello World" 를 짧게 쓰기 위한 기능이 정식이 되었습니다.

```java
void main() {
    IO.println("Hello, World!");
}
```

- 클래스 선언 없이 메서드와 필드를 최상위에 둘 수 있습니다. (컴파일러가 이름 없는 클래스를 만듭니다.)
- `main` 은 `public static` 이 아니어도 되고 `String[]` 인자도 필요 없습니다.
- `java.lang.IO` 클래스가 추가되어 `print`, `println`, `readln` 을 import 없이 쓸 수 있습니다.
- 컴팩트 소스 파일은 `import module java.base;` 가 자동으로 적용됩니다.

JDK 24 프리뷰와 달라진 점은 다음과 같습니다.

- 이름이 "simple" 에서 **"compact"** 로 바뀌었습니다.
- `IO` 가 `java.io` 에서 **`java.lang`** 으로 이동했습니다.
- 정적 메서드가 자동 import 되지 않으므로 `IO.println(...)` 처럼 **`IO.` 를 붙여야** 합니다.

실무 서비스 코드보다는 **스크립트, 학습, 간단한 도구**에 어울립니다.

#### 2-3. Module Import Declarations (JEP 511)

모듈이 export 하는 모든 패키지를 한 줄로 가져옵니다.

```java
import module java.base;
```

#### 2-4. Primitive Types in Patterns (JEP 507, 프리뷰)

`int` 같은 원시 타입도 패턴, `instanceof`, `switch` 에서 다룰 수 있게 하는 기능의 3번째 프리뷰입니다. 아직 프리뷰라서 자세한 사용법은 다루지 않습니다.

---

### 3. 동시성

#### 3-1. Scoped Values (JEP 506)

21에서 Virtual Thread 를 정리하면서 `ThreadLocal` 이 부담스러웠다면, 이번에 정식이 된 **Scoped Values** 가 대안입니다.

`ThreadLocal` 의 문제는 JEP 에서 세 가지로 정리합니다.

| 문제 | 설명 |
|---|---|
| 제약 없는 변경 | `get` 이 가능한 코드는 언제든 `set` 도 할 수 있어 데이터 흐름을 추적하기 어렵습니다. |
| 끝나지 않는 수명 | 스레드가 끝나거나 `remove` 를 호출하기 전까지 값이 남습니다. 풀링된 스레드에서 `remove` 를 빼먹으면 값이 새어 나갑니다. |
| 비싼 상속 | 자식 스레드는 상속받는 모든 값을 복사해야 합니다. |

Scoped Values 는 값을 **특정 실행 범위 안에서만 불변으로** 공유합니다.

```java
private static final ScopedValue<FrameworkContext> CONTEXT = ScopedValue.newInstance();

void serve(Request req, Response resp) {
    var ctx = createContext(req);
    ScopedValue.where(CONTEXT, ctx).run(() -> app.handle(req, resp));
}

public PersistedObject readKey(String key) {
    var ctx = CONTEXT.get();   // run() 안에서 호출되는 모든 메서드에서 읽을 수 있음
    // ...
}
```

- 바인딩은 `run` / `call` 이 끝나면 사라집니다. (`set` 이 없습니다.)
- 호출된 쪽에서 같은 값을 **다시 바인딩**할 수 있고, 그 범위를 벗어나면 원래 값으로 돌아옵니다.
- `StructuredTaskScope` 로 만든 자식 스레드는 값을 **복사 없이** 상속합니다. `ForkJoinPool` 은 상속을 지원하지 않습니다.
- 이전 프리뷰와 달라진 API 변경은 `ScopedValue.orElse` 가 더 이상 `null` 을 받지 않는다는 점 하나입니다.

#### 3-2. Structured Concurrency (JEP 505, 프리뷰)

5번째 프리뷰입니다. 프리뷰 기능이라 `--enable-preview` 가 필요하고, 이번 글에서는 Scoped Values 와 함께 쓰이는 짝으로만 언급합니다.

---

### 4. 성능 / 런타임

#### 4-1. Compact Object Headers (JEP 519)

객체 헤더 레이아웃을 줄여서 **힙 사용량을 낮추는** 기능이 실험 단계를 졸업해 **product 기능**이 되었습니다.

- 켜는 옵션: `-XX:+UseCompactObjectHeaders`
  JDK 24 까지 필요했던 `-XX:+UnlockExperimentalVMOptions` 는 더 이상 필요하지 않습니다.
- **기본값은 꺼져 있습니다.** (기본 레이아웃으로 만드는 것은 이 JEP 의 목표가 아닙니다.)

JEP 에 인용된 측정 결과입니다.

| 측정 | 결과 |
|---|---|
| SPECjbb2015 (한 설정) | 힙 22% 감소, CPU 시간 8% 감소 |
| SPECjbb2015 (G1, Parallel) | GC 횟수 15% 감소 |
| 병렬 JSON 파서 벤치마크 | 10% 빠름 |

테스트는 Oracle 이 JDK 전체 테스트를 돌렸고, Amazon 이 수백 개의 프로덕션 서비스(주로 JDK 21, 17 백포트)에서 사용했다고 JEP 에 적혀 있습니다.

> 위 수치는 JEP 에 인용된 **특정 벤치마크 결과**입니다. 우리 서비스에서는 직접 측정이 필요합니다.

#### 4-2. Generational Shenandoah (JEP 521)

Shenandoah GC 의 세대(generational) 모드가 JDK 24 의 실험 단계를 지나 **product 기능**이 되었습니다.

```
-XX:+UseShenandoahGC -XX:ShenandoahGCMode=generational
```

- Shenandoah 의 **기본 모드는 여전히 단일 세대**입니다. (기본값 변경은 목표가 아닙니다.)
- JEP 에는 사용한 벤치마크 이름(DaCapo, SPECjbb2015, SPECjvm2008, Heapothesys)만 있고 **구체적인 수치는 없습니다.**

#### 4-3. AOT 캐시 간소화와 메서드 프로파일링 (JEP 514, 515)

JDK 24 의 AOT 클래스 로딩/링킹(JEP 483) 위에 두 가지가 더해졌습니다.

**JEP 514 - 캐시 생성이 한 번에**

```bash
# JDK 24: 두 단계
java -XX:AOTMode=record -XX:AOTConfiguration=app.aotconf -cp app.jar com.example.App ...
java -XX:AOTMode=create -XX:AOTConfiguration=app.aotconf -XX:AOTCache=app.aot

# JDK 25: 한 단계
java -XX:AOTCacheOutput=app.aot -cp app.jar com.example.App ...

# 운영 실행 (동일)
java -XX:AOTCache=app.aot -cp app.jar com.example.App ...
```

- 한 단계 방식은 캐시 생성 단계가 별도 힙을 쓰므로 **메모리가 약 2배** 필요합니다. 부족한 환경에서는 두 단계 방식을 쓰라고 JEP 가 안내합니다.
- 학습 실행과 캐시 생성을 다른 머신에서 하고 싶을 때도 두 단계 방식이 유용합니다.

**JEP 515 - 메서드 프로파일을 캐시에**

학습 실행에서 수집한 메서드 실행 프로파일을 AOT 캐시에 저장해서, 시작 직후부터 JIT 가 핫 메서드를 더 빨리 컴파일하게 합니다.

- JEP 의 측정 예: Stream API 를 쓰는 짧은 프로그램에서 **90ms → 73ms (19% 개선)**, 캐시는 약 250KB(약 2.5%) 증가.
- **JEP 가 보고한 사례는 이 하나뿐**이라서 일반화는 조심해야 합니다.
- 애플리케이션 코드 변경은 필요 없고, 학습 실행이 운영 동작을 잘 대표한다는 가정이 필요합니다.

---

### 5. 관측성 (JFR)

| JEP | 내용 |
|---|---|
| 518 Cooperative Sampling | 스레드 스택을 아무 지점에서나 파싱하던 방식 대신, **안전한 지점(safepoint)에서 스택을 재구성**하도록 바꿨습니다. 휴리스틱 때문에 JVM 이 비정상 종료될 수 있던 위험을 줄입니다. (별도 옵션 없음) |
| 509 CPU-Time Profiling (실험) | **Linux 전용.** 경과 시간이 아니라 **CPU 시간 기준**으로 샘플링합니다. 네이티브 코드에서 쓴 CPU 시간은 호출한 Java 메서드에 귀속됩니다. |
| 520 Method Timing & Tracing | 바이트코드 계측으로 **지정한 메서드의 호출 횟수와 실행 시간**을 정확히 측정합니다. 소스 변경과 외부 에이전트가 필요 없습니다. |

**CPU 시간 프로파일링 켜기 (JEP 509)**

```bash
java -XX:StartFlightRecording=jdk.CPUTimeSample#enabled=true,filename=profile.jfr ...
```

**메서드 타이밍 / 트레이싱 (JEP 520)**

```bash
# 정적 초기화 블록 실행 시간
java '-XX:StartFlightRecording:method-timing=::<clinit>,filename=clinit.jfr' ...

# HashMap.resize 호출 추적
java -XX:StartFlightRecording:jdk.MethodTrace#filter=java.util.HashMap::resize,filename=recording.jfr ...

# 실행 중인 프로세스에서 특정 어노테이션이 붙은 메서드 측정
jcmd <pid> JFR.start method-timing=@jakarta.ws.rs.GET
```

- 결과는 `jfr view method-timing` 또는 `jfr view MethodTrace` 로 볼 수 있습니다.
- JFR 은 보통 1% 미만의 오버헤드를 목표로 하지만, **메서드 타이밍/트레이싱은 이를 보장하지 않습니다.** 많은 메서드를 지정하면 성능이 크게 떨어질 수 있어서, 그런 경우에는 샘플링이 낫다고 JEP 가 설명합니다.
- 메서드 인자와 비정적 필드 값은 기록되지 않습니다.

---

### 6. 보안 / 라이브러리 / 제거

- **JEP 510 Key Derivation Function API (정식)**: 키 파생 함수(KDF)를 위한 표준 API 가 추가되었습니다.
- **JEP 470 PEM Encodings of Cryptographic Objects (프리뷰)**: PEM 형식 키/인증서 인코딩, 디코딩 API 입니다.
- **JEP 502 Stable Values (프리뷰)**: 지연 초기화되는 불변 값을 다루는 API 입니다.
- **JEP 508 Vector API (10번째 인큐베이터)**: 아직 인큐베이터입니다.
- **JEP 503 Remove the 32-bit x86 Port**: 32비트 x86 포트가 **제거**되었습니다.

---

### 7. 21에서 25로 올라갈 때 체크할 것

- 32비트 x86 환경을 쓴다면 JDK 25 는 대상이 아닙니다. (JEP 503)
- Compact Object Headers, Generational Shenandoah, AOT 캐시는 **모두 옵션을 켜야** 동작합니다. 업그레이드만으로 바뀌지 않습니다.
- 사용 중인 프레임워크(Spring Boot 등), 빌드 도구, 컨테이너 베이스 이미지가 JDK 25 를 지원하는지는 각 프로젝트의 릴리스 노트에서 확인해야 합니다. 이 글에서는 확인하지 못했습니다.
- 21 에서 25 사이에 제거되거나 동작이 바뀐 API 는 이 글에서 다루지 않았습니다. 업그레이드 전에 각 릴리스의 변경 목록(release notes)을 확인하세요.

---

### 정리

JDK 25 는 21 이후의 LTS 이고, 이번에 살펴본 변화는 크게 두 갈래입니다.

- **코드를 거의 바꾸지 않고 옵션으로 효과를 보는 쪽**: Compact Object Headers (`-XX:+UseCompactObjectHeaders`), AOT 캐시 (`-XX:AOTCacheOutput`), Generational Shenandoah. 모두 기본값은 꺼져 있어서 **켜야 동작**합니다.
- **코드 작성 방식이 바뀌는 쪽**: Scoped Values 는 `ThreadLocal` 을 대체할 수 있는 정식 API 가 되었고, Flexible Constructor Bodies 는 생성자 검증 코드를 `super(...)` 앞에 둘 수 있게 해 줍니다.

여기에 JFR 의 Method Timing & Tracing 이 더해져서, 어떤 메서드가 느린지를 소스 변경 없이 측정하기가 쉬워졌습니다.

다만 이 글의 성능 수치는 모두 JEP 에 인용된 **특정 벤치마크 사례**입니다. 실제 서비스에서의 효과는 직접 측정해 보셔야 합니다.

---

### 참고

- [JDK 25 프로젝트 페이지](https://openjdk.org/projects/jdk/25/)
- [JEP 519: Compact Object Headers](https://openjdk.org/jeps/519)
- [JEP 513: Flexible Constructor Bodies](https://openjdk.org/jeps/513)
- [JEP 512: Compact Source Files and Instance Main Methods](https://openjdk.org/jeps/512)
- [JEP 506: Scoped Values](https://openjdk.org/jeps/506)
- [JEP 514: Ahead-of-Time Command-Line Ergonomics](https://openjdk.org/jeps/514)
- [JEP 515: Ahead-of-Time Method Profiling](https://openjdk.org/jeps/515)
- [JEP 521: Generational Shenandoah](https://openjdk.org/jeps/521)
- [JEP 509: JFR CPU-Time Profiling](https://openjdk.org/jeps/509)
- [JEP 518: JFR Cooperative Sampling](https://openjdk.org/jeps/518)
- [JEP 520: JFR Method Timing & Tracing](https://openjdk.org/jeps/520)
