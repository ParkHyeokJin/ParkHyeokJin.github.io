---
layout: post
title: 알고리즘 풀이 - 동적계획법(백준-1003 피보나치 함수)
date:   2020-01-20 10:00:00
categories: Algorithm
category : Algorithm
comments: true 
---

이전 포스팅에 이어서 백준 알고리즘의 동적계획법 카테고리에 있는 알고리즘 문제를 풀고 있습니다.  
이번 문제도 동일하게 동적계획법을 통해서 해결 할 수 있습니다.  

### 문제 - 피보나치 함수 (백준 알고리즘 - 1003)

문제 링크 : <https://www.acmicpc.net/problem/1003>

![피보나치 함수](/img/algorithm/baekjoon_1003.png){: width="100%" height="100%"}

- 풀이

    - 피보나치 함수 처리 메소드에서 <b>동적 계획법</b>을 추가 하여 검색 효율 증가 시켜야지 시간 초과를 해결 할 수 있습니다.
    
        - 2개의 배열을 생성 합니다.
            - int[] cntArr : 0과 1의 갯수를 누적 카운팅 하는 배열
            - int[][] memo : 이미 계산된 0과 1의 갯수를 메모리에 저장 하는 배열(동적계획법)
            
        - memo[][] 배열은 N(0<=N<=40)개의 배열로 생성 한다.
        - cntArr[] 배열은 0과 1을 저장 하기 위해 2개의 배열을 생성한다.
        - fibonacci(int n) 을 계산 하여 결과가 return 되는 경우 memo[n] 번째에 0과 1의 갯수를 저장한다.
        - fibonacci(int n) 재귀 할 경우 memo[n] 번째에 이미 계산된 결과가 있으면 더이상 재귀를 하지 않고 이미 계산된 값을  
          memo[] 배열에 누적 카운팅 한다.

- 풀이 소스

```java
public class Baekjoon_1003 {
	private static int[] cntArr;
   	private static int[][] memo;

	public static void main(String[] args) {
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		StringBuilder sb = new StringBuilder();
		try {
			int t = Integer.parseInt(reader.readLine());
			memo = new int[40+1][2];
			for(int i = 0; i < t; i++) {
				int n = Integer.parseInt(reader.readLine());
				cntArr = new int[2];
				fibonacci(n);
				sb.append(cntArr[0] + " " + cntArr[1] + "\n");
			}
			System.out.println(sb.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static int fibonacci(int n) {
		if(memo[n][0] > 0 || memo[n][1] > 0 ){
			cntArr[0] += memo[n][0];
			cntArr[1] += memo[n][1];
			return n;
		}
		if (n == 0) {
			cntArr[0]++;
			return 0;
		}else if (n == 1) {
			cntArr[1]++;
			return 1;
		}else {
			int num = fibonacci(n - 1) + fibonacci(n - 2);
			memo[n][0] = cntArr[0];
			memo[n][1] = cntArr[1];
			return num;
		}
	}
}
```
    

    
    