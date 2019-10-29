---
layout: post
title: 정렬 알고리즘 기초5 - 계수 정렬(Counting Sort)
date:   2019-08-20 10:10:00
categories: Algorithm
category : Algorithm
comments: true 
---

### 1. 계수 정렬 알고리즘(Counting Sort)

- 현재까지 개발이 된 정렬 알고리즘은 O(n log n) 의 속도를 가지고 있는 퀵정렬, 힙정렬, 병합 정렬이 가장 빠르다.  
  하지만 어떠한 __특정한 조건__ 이 된다면 O(n) 의 속도를 보이는 정렬이 바로 계수정렬이다.  
  어떠한 조건에 의해 정렬이 되는지 알아보자.  
  
- 정렬 방법  
    - 이전의 정렬 방법들은 전부 위치를 교환 해서 정렬 하는 방법이었으나 계수정렬은 크기를 기준으로 갯수를 세어 정렬 하는 방법입니다.  

- 정렬 조건  
    - 전체 데이터의 범위가 한정되어있으며 반복적인 배열을 정렬 하는데 효과적  
 
- 정렬 순서  
    예1) 
    - 데이터의 범위 : 6  
    - 데이터 : 1,2,4,3,2,5,6,2,2,1,4,5,1,2,3,1,1,2,2,2,2,1,4,5,1,2
      
    1) 계수정렬은 크기를 기준으로 갯수를 세어 정렬 하는 방법!
    - 첫번째 부터 접근 하여 자신의 위치에 갯수를 더해준다.
    
    | 1 | 2 | 3 | 4 | 5 | 6 |
    |---|---|---|---|---|---|
    | 7 | 10 | 2 | 3 | 3 | 1 |
    
    2) 위에 갯수가 정리 되어있는 배열을 순서대로 반복적으로 출력한다.  
    1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,4,4,4,5,5,5,6  
    
- 시간 복잡도 : O(n)  

- 계수 정렬 알고리즘 자바 소스
```java
public class CountingSort {
	public static void main(String[] args) {
		int[] arr = new int[] {1,2,4,3,2,5,6,2,2,1,4,5,1,2,3,1,1,2,2,2,2,1,4,5,1,2};
		Sort(arr, 7);
	}

	private static void Sort(int[] arr, int size) {
		int[] count = new int[size];
		//Counting
		for (int i = 0; i < arr.length; i++) {
			count[arr[i]] += 1;
		}
		
		//정렬(출력)
		for (int i = 0; i < count.length; i++) {
			for (int j = 0; j < count[i]; j++) {
				System.out.print(i);
			}
		}
	}
}
```
