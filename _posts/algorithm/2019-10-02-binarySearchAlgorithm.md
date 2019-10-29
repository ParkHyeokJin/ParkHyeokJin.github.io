---
layout: post
title: 이진 검색 알고리즘(Binary Search Algorithm)
date:   2019-10-01 10:10:00
categories: Algorithm
category : Algorithm
comments: true 
---

### 1. 이진 검색 알고리즘(Binary Search Algorithm)

- 이진 검색 알고리즘은 이미 정렬 되어 있는 배열에서 특정한 값의 위치를 찾는 알고리즘 이다.  
  
- 탐색 방법  

    예) int[] arr = new int[] {9, 7, 2, 1, 5, 8, 3, 6, 4}
    탐색 조건 : 3번 숫자 찾기
    
    1) 배열을 오름 차순으로 정렬한다.
    
    2) 정렬된 배열의 중간 값을 찾아 3 과 비교 한다.
    
    - 배열중간값 == 3 이면 종료.
    - 배열중간값 > 3 이면 3은 배열의 왼쪽에 있다는 것이 되기때문에 배열의 0번 ~ 중간까지에서 다시 탐색
    - 배열중간값 < 3 이면 3은 배열의 오른쪽에 있다는 것이 되기때문에 배열의 중간 ~ 배열의끝으로 다시 탐색
    - 탐색 범위 left > right 일 경우 탐색 실패(값이 없음)
        
    3) 반복
    
- 자바소스

```java
public class BSearch {
	static int[] arr = new int[] {9, 7, 2, 1, 5, 8, 3, 6, 4};
	
	public static void main(String[] args) {
		int[] findNum = new int[] {10, 2, 4, 11, 9};

		BSearch bSearch = new BSearch();
		//정렬
		Arrays.sort(arr);
		//탐색
		for (int i : findNum) {
			System.out.println(bSearch.find(0, arr.length - 1, i));
		}
	}
	
    //재귀함수
	private int find(int left, int right, int num) {
		int index = (left + right) / 2;
		if(left > right) {
			return 0 ;
		}
		if(arr[index] == num) {
			return 1;
		}
		if(arr[index] > num) {
			return find(left, index - 1, num);
		}else {
			return find(index + 1, right, num);
		}
	}
}
```
