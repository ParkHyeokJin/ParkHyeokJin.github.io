---
layout: post
title: 정렬 알고리즘 기초(선택정렬, 삽입정렬, 버블정렬, 칵테일정렬)
date:   2019-08-13 10:00:00
categories: Algorithm
comments: true 
---

### 1. 선택정렬 알고리즘(Selection Sort)

- 선택 정렬 알고리즘은 제자리 정렬 알고리즘의 하나로, 다음의 순서로 이루어진다.

    - 주어진 리스트중 최소값을 찾는다.
    - 그 값을 맨 처음 값과 위치를 교체 한다.
    - 맨 처음 위치를 뺀 나머지 값을 동일 한 방법으로 교체 한다.

- 시간 복잡도 : O(n²)

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
  정렬 알고리즘중 가장 비효율적인 정렬 방법이지만 이미 정렬 되어있는 자료를 확인 할 경우에는 빠를 수 있다.  
  다음의 순서로 이루어진다.  
    (예 : 오름차순)
    - 첫번째 자리 수와 두번째 자리수를 비교하여 위치를 교체 한다.
    - 두번째 자리수와 세번째 자리수를 비교하여 위치를 교체 한다.
    - 동일한 방법으로 반복한다.
    - 큰 수가 제일 끝으로 가기 때문에 마지막부터 정렬 된다.
  

- 시간 복잡도 : O(n²)

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
			for(j = 0; j < numbers.length - 1; j++) {
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

- 삽입 정렬(insertion sort)은 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다.
  배열이 길어질수록 효율이 낮아지지만 구현이 간단하다.
  선택 정렬이나 거품 정렬과 같은 같은 O(n2) 알고리즘에 비교하여 빠르며, 안정 정렬이고 in-place 알고리즘이다.
  
- 시간복잡도 : O(n²)
  
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


