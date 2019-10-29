---
layout: post
title: 정렬 알고리즘 기초(선택정렬, 버블정렬, 칵테일정렬, 삽입정렬)
date:   2019-08-13 10:00:00
categories: Algorithm
category : Algorithm
comments: true 
---

### 1. 선택정렬 알고리즘(Selection Sort)

- 선택 정렬 알고리즘은 제자리 정렬 알고리즘의 하나로, 선택한 수를 가장 작은 수와 자리를 교체 하는 방법으로 정렬을 한다.  
  선택 정렬 알고리즘은 다음의 순서로 이루어진다.    
    예) 3,5,1,2,4,8,6,9,7 배열을 오름차순으로 정렬 하려고 할 경우  
    1) 3 5 1 2 4 8 6 9 7  
       &nbsp;&nbsp;&nbsp;&nbsp;3─1─────┤  3을 선택 하여 마지막 배열 까지 중 3보다 가장 작은 수 1을 찾아 자리를 교체 한다.  
    2) 1 5 3 2 4 8 6 9 7  
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5─2────┤  5를 선택하여 마지막 배열 까지 중 5보다 가장 작은 수 2를 찾아 자리를 교체 한다.  
    3) 1 2 3 5 4 8 6 9 7  
       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3─────┤  3을 선택하여 마지막 배열 까지 중 3보다 가장 작은 수 (없음)을 찾아 자리를 교체 한다.  
    4) 반복 하여 수행....  

- 시간 복잡도  
    1) 10개의 배열이 주어 졌을 경우  
       10 + 9 + 8 + 7 ........ + 1 의 반복 수를 가짐.  
       => 10 * (10 + 1) / 2 = 55번의 반복을 해야함.  
       => N * (N + 1) / 2  
       => O(N * N) => O(N²)  
    2) 1만개의 배열을 정렬 해야 할 경우 1억번의 반복이 필요하기 때문에 매우 느린 정렬이다.  
    

- 선택정렬 알고리즘 애니메이션  
![SelectionSort](/img/algorithm/selectionSort.gif)


- 선택 정렬 알고리즘 자바 소스
```java
public class SelectionSort {
	public static void main(String[] args) {
		int[] numbers = {3,5,1,2,4,8,6,9,7};
		sort(numbers);
	}
	private static void sort(int[] numbers) {
		int min, tmp;
		for (int i = 0; i < numbers.length - 1; i++) {
			min = i;
			for(int j = i + 1; j < numbers.length; j++) {
				if(numbers[min] > numbers[j]) {
					min = j;
				}
			}
			tmp = numbers[min];
			numbers[min] = numbers[i];
			numbers[i] = tmp;
		}
		
		//출력
		System.out.println(Arrays.toString(numbers));
	}
}
```

### 2. 버블 정렬 알고리즘(Bubble Sort)

- 거품 정렬은 두 인접한 원소를 비교하여 정렬 하는 방식이다.  
  두 인접한 원소를 비교 하여 교체 하는 방식으로 진행 되기 때문에 정렬하고자 하는 방향의 마지막 수 부터 정렬이 된다.  
  정렬 알고리즘중 가장 비효율적인 정렬 방법이지만 이미 정렬 되어있는 자료를 확인 할 경우에는 빠를 수 있다.  
  다음의 순서로 이루어진다.  
    예) 3,5,1,2,4,8,6,9,7 배열을 오름차순으로 정렬 하려고 할 경우  
    1) 1번 반복<br/>
    <b>3 5</b> 1 2 4 8 6 9 7  ====>  3과 5를 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 <b>5 1</b> 2 4 8 6 9 7  ====>  5와 1을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 <b>5 2</b> 4 8 6 9 7  ====>  5와 2을 비교 하여 작은수를 앞으로 보낸다.<br/> 
    3 1 2 <b>5 4</b> 8 6 9 7  ====>  5와 4을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 2 4 <b>5 8</b> 6 9 7  ====>  5와 8을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 2 4 5 <b>8 6</b> 9 7  ====>  8와 6을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 2 4 5 6 <b>8 9</b> 7  ====>  8와 9을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 2 4 5 6 8 <b>9 7</b>  ====>  9와 7을 비교 하여 작은수를 앞으로 보낸다.<br/>
    3 1 2 4 5 6 8 7 9
    
    2) 2번 반복시에는 마지막숫자(9) 는 정렬이 되어있기 때문에 (배열최대길이 - 반복수) 까지만 반복한다.

- 시간 복잡도
    1) 10개의 배열이 주어 졌을 경우
       10 + 9 + 8 + 7 ........ + 1 의 반복 수를 가짐.  
       => 10 * (10 + 1) / 2 = 55번의 반복을 해야함.  
       => N * (N + 1) / 2  
       => O(N * N) => O(N²)  
    2) 선택정렬과 시간 복잡도는 동일하나 내부 처리가 많기 때문에 처리속도가 더 느리다.

- 버블 정렬 애니매이션  
![Bubble Sort](/img/algorithm/bubbleSort.gif)

- 버블 정렬 알고리즘 자바 소스
```java
public class BubbleSort {
	public static void main(String[] args) {
		int[] numbers = {3,5,1,2,4,8,6,9,7};
		sort(numbers);
	}
	private static void sort(int[] numbers) {
		int i, j;
		int tmp = 0;
		for (i = 0; i < numbers.length; i++) {
			for(j = 0; j < numbers.length - 1 - i; j++) {
				if(numbers[j] > numbers[j + 1]) {
					tmp = numbers[j];
					numbers[j] = numbers[j + 1];
					numbers[j + 1] = tmp;
				}
			}
		}	
		System.out.println(Arrays.toString(numbers));
	}
}
```

### 3. 칵테일 정렬 알고리즘(Cocktail Sort)

- 칵테일 셰이커 정렬(cocktail shaker sort)은 양방향 거품 정렬(bidirectional bubble sort)또는 셰이커 정렬(shaker sort) 등으로도 불리는 거품 정렬의 변형이다.  
  거품 정렬과는 달리 매 라운드마다 리스트의 순서를 바꾼다.
  
- 시간 복잡도 : O(n²)
  
- 칵테일 정렬 애니매이션  
![Cocktail Sort](/img/algorithm/cocktailSort.gif)

- 칵테일 정렬 알고리즘 자바 소스

```java
public class CocktailSort {
	public static void main(String[] args) {
		int[] numbers = { 3, 5, 1, 2, 4, 8, 6, 9, 7 };
		sort(numbers);
	}
	private static void sort(int[] numbers) {
		boolean swapped = true;
		int i = 0;
		int j = numbers.length - 1;
		while (i < j && swapped) {
			swapped = false;
			for (int k = i; k < j; k++) {
				if (numbers[k] > numbers[k + 1]) {
					int temp = numbers[k];
					numbers[k] = numbers[k + 1];
					numbers[k + 1] = temp;
					swapped = true;
				}
			}
			j--;
			if (swapped) {
				swapped = false;
				for (int k = j; k > i; k--) {
					if (numbers[k] < numbers[k - 1]) {
						int temp = numbers[k];
						numbers[k] = numbers[k - 1];
						numbers[k - 1] = temp;
						swapped = true;
					}
				}
			}
			i++;
		}
		System.out.println(Arrays.toString(numbers));
	}
}
```

### 4. 삽입 정렬 알고리즘(Insertion sort)

- 삽입 정렬(insertion sort)은 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여,  
  자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다. 배열이 길어질수록 효율이 낮아지지만 구현이 간단하다.  
  선택 정렬이나 거품 정렬과 같은 O(n2) 알고리즘에 비교하여 빠르며, 안정 정렬이고 in-place 알고리즘이다.  
  다음의 순서로 이루어진다.  
    예1) 3,5,1,2,4,8,6,9,7 배열을 오름차순으로 정렬 하려고 할 경우  
    1) 3 <b>5</b> 1 2 4 8 6 9 7 ==> 5 를 선택 하여 5의 앞 원소 {3} 과 비교 하여 자신보다 작은 수의 뒤에 삽입한다.(처리횟수 : 0번)  
    2) 3 5 <b>1</b> 2 4 8 6 9 7 ==> 1 을 선택 하여 1의 앞 원소 {3, 5} 와 비교 하여 자신보다 작은 수의 뒤에 삽입한다.(처리횟수 : 2번)  
    3) 1 3 5 <b>2</b> 4 8 6 9 7 ==> 2 를 선택 하여 2의 앞 원소 {1, 3, 5} 와 비교 하여 자신보다 작은 수의 뒤에 삽입한다.(처리횟수 : 2번)  
    4) 1 2 3 5 <b>4</b> 8 6 9 7 ==> 4 를 선택 하여 4의 앞 원소 {1, 2, 3, 5} 와 비교 하여 자신보다 작은 수의 뒤에 삽입한다.(처리횟수 : 1번)  
    5) 1 2 3 4 5 <b>8</b> 6 9 7 ==> 8 를 선택 하여 8의 앞 원소 {1, 2, 3, 4, 5} 와 비교 하여 자신보다 작은 수의 뒤에 삽입한다.(처리횟수 : 0번)  
    6) 반복 하여 처리한다.  
    
    예2) 2, 3, 4, 5, 6, 7, 8, 9, 1 처럼 정렬이 거의 완료 된 배열을 정렬하려고 할 경우  
    1) <b>2</b>, 3, 4, 5, 6, 7, 8, 9, 1  ==> 처리 횟수 없음.  
    2) 2, <b>3</b>, 4, 5, 6, 7, 8, 9, 1 ==> 처리 횟수 없음.  
    3) 2, 3, <b>4</b>, 5, 6, 7, 8, 9, 1 ==> 처리 횟수 없음.  
    4) 2, 3, 4, <b>5</b>, 6, 7, 8, 9, 1 ==> 처리 횟수 없음.  
    5) 2, 3, 4, 5, <b>6</b>, 7, 8, 9, 1 ==> 처리 횟수 없음.  
    6) 2, 3, 4, 5, 6, <b>7</b>, 8, 9, 1 ==> 처리 횟수 없음.  
    7) 2, 3, 4, 5, 6, 7, <b>8</b>, 9, 1 ==> 처리 횟수 없음.  
    8) 2, 3, 4, 5, 6, 7, 8, <b>9</b>, 1 ==> 처리 횟수 없음.  
    9) 1, 2, 3, 4, 5, 6, 7, 8, 9  ==> 1을 맨 앞으로 삽입 하므로 정렬 완료  
        
- 시간복잡도
    1) 10개의 배열이 주어 졌을 경우  
        10 + 9 + 8 + 7 ........ + 1 의 반복 수를 가짐.  
       => 10 * (10 + 1) / 2 = 55번의 반복을 해야함.  
       => N * (N + 1) / 2  
       => O(N * N) => O(N²)
       
    2) 선택정렬이나 버블 정렬과 시간복잡도는 동일 하지만 예2) 에서의 경우 처럼 정렬이 어느정도 진행 되어있는 경우는  
       가장 빠른 속도를 보이기때문에 O(N²) 의 시간복잡도를 가지고 있는 정렬 알고리즘 중 가장 빠르고 효율적이다.
  
- 삽입 정렬 애니메이션  
![Insertion sort](/img/algorithm/insertionSort.gif)

- 삽입 정렬 알고리즘 자바 소스

```java
public class InsertionSort {
	public static void main(String[] args) {
		int[] numbers = { 3, 5, 1, 2, 4, 8, 6, 9, 7 };
		sort(numbers);
	}
	private static void sort(int[] numbers) {
		for (int index = 1; index < numbers.length; index++) {
			int temp = numbers[index];
			int aux = index - 1;
			while ((aux >= 0) && (numbers[aux] > temp)) {
				numbers[aux + 1] = numbers[aux];
				aux--;
			}
			numbers[aux + 1] = temp;
		}
		System.out.println(Arrays.toString(numbers));
	}
}
```


