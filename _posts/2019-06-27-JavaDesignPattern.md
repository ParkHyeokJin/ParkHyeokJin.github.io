---
layout: post
title: 자바 디자인 패턴의 종류
date: 2019-06-18 10:00:00
categories: Java
comments: true
---


### 디자인 패턴이란?
디자인 패턴이란 프로그래밍 할때 문제를 해결하고자 코드의 구조들을 일정한 형태로 만들어
재이용 하기 편리하게 만든 일정한 패턴이다.<br />
이 용어를 소프트웨어 개발 영역에서 구체적으로 처음 제시한 곳은, GoF(Gang of Four)라 불리는 네명의 컴퓨터 과학 연구자들이 쓴 서적 'Design Patterns : Elements of Reusable Object-Oriented Software'
(재이용이 가능한 객체지향 소프트웨어의 요소 - 디자인패턴)이다.
<br />
GoF는 컴퓨터 소프트웨어 공학 분야의 연구자인 에릭 감마, 리차드 헬름, 랄프 존슨, 존 블리시디스 네명을 지칭한다.
<br />

### 디자인 패턴의 종류?
1. 생성패턴(Creational Patterns)
- 추상 팩토리 패턴(Abstract factory Pattern) : 동일한 주제의 다른 팩토리를 묶어 준다.
- 빌더 패턴(Builder Pattern) : 생성(construction)과 표기(representation)를 분리해 복잡한 객체를 생성한다
- 팩토리 메서드 패턴(Factory Method Pattern) : 생성할 객체의 클래스를 국한하지 않고 객체를 생성한다.
- 프로토타입 패턴(Prototype Pattern) : 기존 객체를 복제함으로써 객체를 생성한다.
- 싱글턴 패턴(Singleton Pattern) : 한 클래스에 한 객체만 존재하도록 제한한다.  
<br />
<br />
2. 구조패턴
- 어댑터 패턴(Adapter Pattern) : 인터페이스가 호환되지 않는 클래스들을 함께 이용할 수 있도록, 타 클래스의 인터페이스를 기존 인터페이스에 덧씌운다.
- 브리지 패턴(Bridge Pattern) : 추상화와 구현을 분리해 둘을 각각 따로 발전시킬 수 있다.
- 합성 패턴(Composite Pattern) : 0개, 1개 혹은 그 이상의 객체를 묶어 하나의 객체로 이용할 수 있다.
- 데코레이터 패턴(Decorator Pattern) : 기존 객체의 매서드에 새로운 행동을 추가하거나 오버라이드 할 수 있다.
- 파사드 패턴(facade Pattern) : 많은 분량의 코드에 접근할 수 있는 단순한 인터페이스를 제공한다.
- 플라이웨이트 패턴(Flyweight Pattern) : 다수의 유사한 객체를 생성·조작하는 비용을 절감할 수 있다.
- 프록시 패턴(Proxy Pattern) : 접근 조절, 비용 절감, 복잡도 감소를 위해 접근이 힘든 객체에 대한 대역을 제공한다.
<br />  
<br />
3. 행위패턴
- 책임연쇄 패턴(Chain of responsibility): 책임들이 연결되어 있어 내가 책임을 못 질 것 같으면 다음 책임자에게 자동으로 넘어가는 구조
- 커맨드 패턴(Command Pattern) : 위의 명령어를 각각 구현하는 것보다는 위 그림처럼 하나의 추상 클래스에 메서드를 하나 만들고 각 명령이 들어오면 그에 맞는 서브 클래스가 선택되어 실행하는 것
- 해석자 패턴 (Interpreter Pattern) : 문법 규칙을 클래스화한 구조를 갖는SQL 언어나 통신 프로토콜 같은 것을 개발할 때 사용
- 반복자 패턴 (Iterator Pattern) : 반복이 필요한 자료구조를 모두 동일한 인터페이스를 통해 접근할 수 있도록 메서드를 이용해 자료구조를 활용할 수 있도록 해준다.
- 옵저버 패턴: 어떤 클래스에 변화가 일어났을 때, 이를 감지하여 다른 클래스에 통보해주는 것
- 전략 패턴 (Strategy Pattern) : 알고리즘 군을 정의하고 각각 하나의 클래스로 캡슐화한 다음, 필요할 때 서로 교환해서 사용할 수 있게 해준다.
- 템플릿 메서드 패턴 (Template method pattern): §상위 클래스에서는 추상적으로 표현하고 그 구체적인 내용은 하위 클래스에서 결정되는 디자인 패턴
- 방문자 패턴 (visitor Pattern) : 각 클래스의 데이터 구조로부터 처리 기능을 분리하여 별도의 visitor 클래스로 만들어놓고 해당 클래스의 메서드가 각 클래스를 돌아다니며 특정 작업을 수행하도록 하는 것
- 중재자 패턴 (Mediator Pattern) : 클래스간의 복잡한 상호작용을 캡슐화하여 한 클래스에 위임해서 처리 하는 디자인 패턴
- 상태 패턴 (State Pattern) : 동일한 동작을 객체의 상태에 따라 다르게 처리해야 할 때 사용하는 디자인 패턴
- 기념품 패턴 (Memento Pattern) : Ctrl + z 와 같은 undo 기능 개발할 때 유용한 디자인패턴. 클래스 설계 관점에서 객체의 정보를 저장

_각 디자인 패턴의 자세한 구조에 대해서는 하나씩 링크를 붙여 나가기로 하겠다_