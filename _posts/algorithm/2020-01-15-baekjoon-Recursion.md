---
layout: post
title: 알고리즘 풀이 - 백준 알고리즘(팩토리얼, 피보나치의 수)
date:   2020-01-15 10:00:00
categories: Algorithm
category : Algorithm
comments: true 
---

2020년 첫 알고리즘 풀이. 백준 알고리즘 문제의 재귀 카테고리에 있는 4가지 유형의 문제입니다.  
재귀 알고리즘은 매우 기초적이지만 자주 헤깔릴 수 있는 알고리즘으로 아래 4가지 유형의 문제 풀이를 보고 되뇌여 보겠습니다.

### 문제1 - 팩토리얼

문제 링크 : <https://www.acmicpc.net/problem/10872>

![팩토리얼](/img/algorithm/baekjoon_10872.png){: width="100%" height="100%"}

- 풀이

    - 팩토리얼 알고리즘은 주어진 정수의 모든 원소를 곱한 값을 출력하는 문제입니다.

        - 주어진 정수 N 을 -1 을 하면서 모든 값을 곱하여 누적 합니다.

- 소스

    ```java
    public class Baekjoon_10872 {
        private static int result = 1;
        public static void main(String[] args) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            try {
                int num = Integer.parseInt(reader.readLine());
                factorial(num);
                System.out.println(result);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        public static void factorial(int num) {
            if(num == 0) return;
            result = result * num;
            num--;
            factorial(num);
        }
    }
    ```

### 문제2 - 피보나치의 수

문제 링크 : <https://www.acmicpc.net/problem/10870>

![피보나치의수](/img/algorithm/baekjoon_10870.png){: width="100%" height="100%"}

- 풀이

    - 피보나치의 수는 0과 1로 시작 하며, 그다음 부터는 앞 두 수의 합을 계속 누적 해가는 알고리즘 입니다.
        
- 소스

    ```java
    public class Baekjoon_10870 {
    	public static void main(String[] args) {
    		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
    		try {
    			int n = Integer.parseInt(reader.readLine());
    			System.out.println(fibonacci(n));
    		} catch (Exception e) {
    			e.printStackTrace();
    		}
    	}
    
    	public static int fibonacci(int n) {
    		if (n == 0)
    			return 0;
    		if (n == 1)
    			return 1;
    		return fibonacci(n - 1) + fibonacci(n - 2);
    	}
    }
    ```