---
layout: post
title: TDD Example(Bowling Game)
date:   2019-06-18 10:00:00
categories: Java
category : Java
comments: true
---

_이글은 백명석님의 강의를 학습하면서 정리 된 자료 입니다._

### 개요
볼링 게임 점수 계산을 하는 프로그램을 TDD로 작성 해보자.  
볼링 게임 예제 소스 : (https://github.com/ParkHyeokJin/BowlingGame-Example.git)

### 규칙
- 볼링 게임은 10개의 프레임으로 구성된다.
- 각프레임은 대개 2 룰을 갖는다(10개의 핀을 쓰러뜨리기 위해 2번의 기회를 갖는다)
- Spare: 10 + next first roll 에서 쓰러 뜨린 핀수.
- Strike : 10 + next two rolls 에서 쓰러 뜨린 핀수.
- 10th 프레임은 특별. spare 처리하면 3번 던질 수 있음.

### 목적
- Game이라는 클래스를 생성하는 것

| Game |  
|:---:|
|+ roll(pins : int) | 
|+ score() : int |  

- Game.class 
    - roll과 score 라는 2개의 메소드를 갖는다.
    - roll메소드는 ball을 roll할 때마다 호출 된다. 인자로는 쓰러뜨린 핀수를 갖는다
    - score 메소드는 게임이 끝난 후에만 호출 되어 게임의 점수를 반환한다.

### TDD 시작!
1. 준비
    - 아무것도 없는 nothing 이라는 테스트를 만들어서 정상적으로 실행 되는지 일단 확인!<br />
~~~java
public class BowlingTest{
    @Test
    public void nothing(){   
    }
}
~~~
    - 테스트 코드를 작성하기 위해 설정이 제대로 되었는지 일단 확인 하고 시작한다. 항상 동작하는 코드를 우선 작성함으로써
      작업시작을 알린다.
    - TDD를 하기 위해서는 Failing unit test가 있기 전에 production code 를 작성 하면 안된다.
      기존에 개발을 하는 형대로 진행을 한다면 Game Class를 먼저 만들고 시작 하겠지만
      TDD에서는 유닛 테스트를 먼저 작성 해야한다.
    - TDD 사이클 : RED -> Green -> Blue
        - red phase: next most interesting case but still really simple
        - green phase: make it pass
        - blue phase: Refactoring
1. Create Game  
    - add Failing Test
~~~java
@Test
public void canCreate(){
        Game game = new Game();
}
~~~
    - make it pass
        - IDE의 Hot fix를 이용 하여 Game 클래스 생성
            - itellij : opt + enter
            - Eclipse : Ctrl + 1  
2. canRoll  
    - add Failing Test
        - 스코어를 바로 계산하기 보다는 이를 위한 과정으로 canRoll을 먼저 추가
        - 넘어진 pin수가 0인 것에 대한 failing test를 먼저 추가
~~~java
@Test
public void canRoll() {
    Game game = new Game();
    game.roll(0);
}
~~~
    - make it pass
        - create Method roll(int i);
~~~java
public void roll(int i) {
    }
~~~
    - Refactoring
        - 테스트에 있는 중복(Game game = new Game()) 제거
            - intellij : Ctrl + Alt + F
            - Eclipse : Alt + Shift + T -> Field 선택
        - 불필요한 코드 제거 (canCreate() 메소드는 불필요함)
3. GutterGame  
    - add Failing test  
        - score를 바로 호출하고 싶지만, 게임이 끝나야만 score함수를 호출할 수 있다.
        - 게임을 끝내는 가장 간단한 방법은 gutter game이다.
~~~java
@Test
public void gutterGame() {
    for(int i = 0; i < 20; i++)
        game.roll(0);
    assertThat(game.score(), is(0));
}
~~~
4. allOnes
    - add Failing test
        - next most simple and interesting test case
~~~java
@Test
public void allOnes() {
    for(int i = 0; i < 20; i++)
        game.roll(1);
        assertThat(game.score(), is(20));
}
~~~
    - make it pass
~~~java
private Integer score = 0;
public void roll(int pins) {
    score += pins;
}
public Integer score() {
    return score;
}
~~~
    - Refactoring
        - extract variable : gutterGame()에서 rolls, pins를 추출
            - intellij : Ctrl + Alt + V
            - Eclipse : Alt + Shift + L
~~~java
@Test
public void gutterGame() {
    int rolls = 20;
    int pins = 0;
    for(int i = 0; i < rolls; i++) {
        game.roll(pins);
    }
    assertThat(game.score(), is(0));
}
~~~
        - extract method - rollMany()
            - intellij : Ctrl + Alt + M
            - eclipse : alt + Shift + M
~~~java
@Test
public void gutterGame() {
    int rolls = 20;
    int pins = 0;
    rollMany(rolls, pins);
    assertThat(game.score(), is(0));
}
private void rollMany(int rolls, int pins) {
    for(int i = 0; i < rolls; i++)
        game.roll(pins);
}
~~~
        - inline variables
            - intellij : Ctrl + Alt + N
            - eclipse : Alt + Shift + I
~~~java
@Test
public void gutterGame() {
    rollMany(20, 0);
    assertThat(game.score(), is(0));
}
~~~
5. oneSpare
    - add Failing Test
        - gutter, allOne이 있으니 allTwo를 생각해 볼 수 있으나 이건 잘 동작할 것이다.
        - 뻔히 동작할 것을 알 수 있는 테스트는 작성할 필요가 없다.
        - allThree, allFour도 잘 동작할 것이다. 그런데 allFive는 그렇지 않다. spare가 있기 때문에.
        - spare에 대한 테스트를 작성할 차례이다. 가장 간단한 spare는 어떤 경우가 있을까 ? one spare + gutter.
~~~java
@Test
public void oneSpare() {
    game.roll(5);
    game.roll(5); // spare
    game.roll(3);
    rollMany(17, 0);
    assertThat(game.score(), is(16));
}
~~~
    - make it pass
        - 어떻게 해야 할지 모르겠다....
~~~java
public void roll(int pins) {
    if(pins + lastPins == 10)
    ...
}
~~~
        - 위와 같이 하려다 보니 이상하다. 플래그 변수, 정적 변수를 사용해야 하고…
        - 이처럼 끔찍한 일을 해야 하는 경우가 생길때마 잠시 물러나야 한다.
        - 뭔가 디자인이 잘 못된 것이다.
        - 디자인 원칙이 위배된 것이 있다.
        - 첫번째 원칙: 스코어를 계산하는 것을 의미하는 이름을 갖는 함수가 무엇인가 ?
        - score 함수이다. 근데 실제로 score를 계산하는 함수는 roll 함수이다.
        - 잘못된 책임 할당(misplaced responsibility)이 디자인 원칙, 잘못된 디자인 냄새이다.
        - roll에선 각 roll을 저장하고, score에서 계산을 해야 한다.
        - 어쩌지. Refactoring. 근데 failing test가 있다. @Ignore 처리…
    - Refactoring
        - 이제 테스트가 수행되니 리팩토링하자.
        - Roll을 배열에 저장하자.
        - 이에 잘못된 책임 할당이 해소되었다.
~~~java
public class Game {
    private int[] rolls = new int[21];
    private int currentRoll = 0;
    public void roll(int pins) {
        rolls[currentRoll++] = pins;
    }
    public Integer score() {
        int score = 0;
        for(int i = 0; i < rolls.length; i++)
            score += rolls[i];
        return score;
    }
}
~~~
        - frame을 도입하여 읽기 쉽게한다.
~~~java
public Integer score() {
    int score = 0;
    int i = 0;
    for(int frame = 0; frame < 10; frame++) {
        score += rolls[i] + rolls[i + 1];
        i += 2;
    }
    return score;
}
~~~
6. oneSpare
    - add Failing test
        - @Ignore 제거
    - make it pass
~~~java
if(rolls[i] + rolls[i + 1] == 10) { // spare
    score += 10 + rolls[i + 2];
    i += 2;
}
else {
    score += rolls[i] + rolls[i + 1];
    i += 2;
}
~~~
    - Refactoring
        - Rename i -> firstFrame
        - extract method isSpare()
            - intellij : Ctrl + Alt + M
            - eclipse : alt + Shift + M
~~~java
private boolean isSpare(int firstRollInFrame) {
    return rolls[firstRollInFrame] + rolls[firstRollInFrame + 1] == 10;
}
~~~
        - 불필요한 주석 제거 : // spare
        - extract Method for rollSpare
~~~java
@Test
public void oneSpare() {
    rollSpare();
    game.roll(3);
    rollMany(17, 0);
    assertThat(game.score(), is(16));
}
private void rollSpare() {
    game.roll(5);
    game.roll(5);
}
~~~
7. oneStrike
    - add Failing test
~~~java
@Test
public void oneStrike() {
    game.roll(10);
    game.roll(5);
    game.roll(3);
    rollMany(16, 0);
    assertThat(game.score(), is(26));
}
~~~
    - make it pass
~~~java
if(rolls[firstFrame] == 10) { // strike
    score += 10 + rolls[firstFrame + 1] + rolls[firstFrame + 2];
    firstFrame += 1;
}
else if(isSpare(firstFrame)) {
...
~~~
    - Refactoring
        - extract method isStrike()
            - intellij : Ctrl + Alt + M
            - eclipse : alt + Shift + M
~~~java
private boolean isStrike(int roll) {
        return roll == 10;
    }
~~~
        - 불필요한 주석 제거 : // strike
        - extract method for readabiliy(nextTwoBallsForStrike, nextBallForSpare, nextBallsInFrame)
~~~java
if(isStrike(firstFrame)) {
    score += 10 + nextTwoBallsForStrike(firstFrame);
    firstFrame += 1;
}
else if(isSpare(firstFrame)) {
    score += 10 + nextBallForSpare(firstFrame);
    firstFrame += 2;
}
else {
    score += nextBallsInFrame(firstFrame);
    firstFrame += 2;
}
~~~
        - extract method for readabiliy(rollStrike)
~~~java
@Test
public void oneStrike() {
    rollStrike();
    game.roll(5);
    game.roll(3);
    rollMany(16, 0);
    assertThat(game.score(), is(26));
}
private void rollStrike() {
    game.roll(10);
}
~~~
8. perfactGame
    - perfactGame
~~~java
@Test
public void perfectGame() {
    rollMany(12, 10);
    assertThat(game.score(), is(300));
}
~~~