---
layout: post
title: Builder Pattern
date: 2019-07-10 13:00:00
categories: Java
comments: true
---

> Effective Java E/3 학습을 하며 정리 하는 글입니다.

### 생성자에 매개변수가 많다면 빌더를 고려하라.

생성자에 매개 변수가 많을 경우 어떻게 하는가?
아래와 같이 점층적 생성자를 통해 생성 할 수 있다.

```java
public class MoonbucksCoffee {
	private String size;    //필수
	private int shot;       //필수
	private int water;      //필수
	private boolean syrup;  //선택
	private boolean milk;   //선택
	private boolean caramel;//선택
	
	public MoonbucksCoffee(String size, int shot, int water) {
		this.size = size;
		this.shot = shot;
		this.water = water;
	}
	public MoonbucksCoffee(String size, int shot, int water, boolean syrup, boolean milk) {
		this.size = size;
		this.shot = shot;
		this.water = water;
		this.syrup = syrup;
		this.milk = milk;
	}
	public MoonbucksCoffee(String size, int shot, int water, boolean syrup, boolean milk, boolean caramel) {
		this.size = size;
		this.shot = shot;
		this.water = water;
		this.syrup = syrup;
		this.milk = milk;
		this.caramel = caramel;
	}
}
```

보통 이런 형태의 점층적 생성자의 경우 인스턴스를 만드려면 원하는 매개변수를 가지는 생성자를
선택해서 만들어야 한다. 그리고 필요 없는 매개 변수 까지도 지정 해야 한다.

```java
MoonbucksCoffee coffee = new MoonbucksCoffee("tall", 2, 200, false, false, true);
```
> tall 사이즈의 커피에 2샷을 넣고 물200 미리에 카라멜 시럽을 추가 하고 싶은 경우

매개변수 각각이 무엇을 의미하는지도 모르고 필요한 매개변수는 4개인데 부득이하게 syrup과 milk 매개변수도 넘겨야한다.

이런 경우를 대비하기 위해 우리는 <u>자바 빈즈 패턴</u>을 활용 했다.

```java
public class MoonbucksCoffee {
    private String size;    //필수
    private int shot;       //필수
    private int water;      //필수
    private boolean syrup;  //선택
    private boolean milk;   //선택
    private boolean caramel;//선택
    
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public int getShot() {
		return shot;
	}
	public void setShot(int shot) {
		this.shot = shot;
	}
	public int getWater() {
		return water;
	}
	public void setWater(int water) {
		this.water = water;
	}
	public boolean isSyrup() {
		return syrup;
	}
	public void setSyrup(boolean syrup) {
		this.syrup = syrup;
	}
	public boolean isMilk() {
		return milk;
	}
	public void setMilk(boolean milk) {
		this.milk = milk;
	}
	public boolean isCaramel() {
		return caramel;
	}
	public void setCaramel(boolean caramel) {
		this.caramel = caramel;
	}	
}
```

```java
MoonbucksCoffee coffee = new MoonbucksCoffee();
coffee.setSize("tall");
coffee.setShot(2);
coffee.setWater(200);
coffee.setCaramel(true);
```

가독성도 높아 지고 불필요한 매개변수를 넣을 필요도 없다. 하지만 자바빈즈 패턴은 아래와 같은 단점을 지니고 있다.
- 객체 하나를 만들려면 여러개의 메서드가 호출 되야한다.
- 객체가 완전히 생성되기 전까지 일관성이 무너져있는 상태이다.
- 스레드 안전성을 가지려면 별도의 안전장치가 필요하다.
- 불변 아이템으로 만들 수 없다.

이러한 단점을 보완하기 위해 빌더 패턴을 살펴 보자.

```java
public class MoonbucksCoffee {
    private String size;    //필수
    private int shot;       //필수
    private int water;      //필수
    private boolean syrup;  //선택
    private boolean milk;   //선택
    private boolean caramel;//선택
	
	public static class Builder{
        private String size;    //필수
	    private int shot;       //필수
	    private int water;      //필수
	    
	    private boolean syrup;  //선택
	    private boolean milk;   //선택
	    private boolean caramel;//선택
	    
		public Builder(String size, int shot, int water) {
			this.size = size;
			this.shot = shot;
			this.water = water;
		}

		public Builder setSyrup(boolean syrup) {
			this.syrup = syrup;
			return this;
		}

		public Builder setMilk(boolean milk) {
			this.milk = milk;
			return this;
		}

		public Builder setCaramel(boolean caramel) {
			this.caramel = caramel;
			return this;
		}
	    
		public MoonbucksCoffee makeCoffee() {
			return new MoonbucksCoffee(this); 
		}
	}

	public MoonbucksCoffee(Builder builder) {
		size = builder.size;
		shot = builder.shot;
		water = builder.water;
		syrup = builder.syrup;
		milk = builder.milk;
		caramel = builder.caramel;
	}
}
```
```java
MoonbucksCoffee americano = new MoonbucksCoffee.Builder("tall", 2, 200)
                            .setSyrup(false).setMilk(false).setCaramel(true)
                            .makeCoffee();
```

MoonbucksCoffee 클래스는 불변 객체 이며 setter 메서드들이 자신을 반환하기 때문에
연쇄적으로 호출 하여 메서드 체이닝이 가능하다.

필수 매개변수와 선택적 매개변수가 구분이 가능하고 소스가 한눈에 어떤 매개변수로
생성 되었는지 알 수 있다.

이처럼 빌더 패턴은 유연하고 넘기는 매개변수에 따라 다른 객체를 생성 할 수 있다.
하지만 빌더를 만들어야 하기 때문에 소스가 길어지기 때문에 생성자에 넘기는 매개변수가 많은 경우가
아니라면 비효율적일 수 있다.

하지만 매개변수가 많을경우 빌더 패턴은 매우 유용하다.
 
