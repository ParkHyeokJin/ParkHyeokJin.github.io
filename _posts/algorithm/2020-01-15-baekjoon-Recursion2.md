---
layout: post
title: 알고리즘 풀이 - 백준 알고리즘(별찍기)
date:   2020-01-15 10:00:00
categories: Algorithm
category : Algorithm
comments: true 
---

2020년 첫 알고리즘 풀이. 백준 알고리즘 문제의 재귀 카테고리에 있는 4가지 유형의 문제입니다.  
재귀 알고리즘은 매우 기초적이지만 자주 헤깔릴 수 있는 알고리즘으로 아래 4가지 유형의 문제 풀이를 보고 되뇌여 보겠습니다.

### 문제3 - 별찍기

문제 링크 : <https://www.acmicpc.net/problem/2447>

![별찍기](/img/algorithm/baekjoon_2447.png){: width="100%" height="100%"}

- 풀이

    - 별찍기 문제는 주어진 별 그림을 보고 패턴을 분석 하여 결과를 출력 하는 문제 입니다.
    
        - 위 문제의 별그림을 3제곱의 수로 쪼개면 아래와 같이 반복 되는 패턴을 확인 할 수 있습니다.
        
        ![별찍기](/img/algorithm/baekjoon_2447-1.png){: width="15%" height="15%"}
        
        ![별찍기](/img/algorithm/baekjoon_2447-2.png){: width="10%" height="10%"}
        
        - 3제곱의 사각형에 항상 가운데 별자리는 비어있습니다.
        
        - tmp[][] 배열을 생성 한 뒤 재귀 호출 을 하여 주어진 n == 1 일 경우에만 해당 위치(x, y) 에 '*' 마킹을 합니다.
        
        - 주어진 위치가 x=1, y=1 인 경우에는 마킹 하지 않고 넘어갑니다. (공백 위치)
    
        - ※ 디버깅 모드로 스택이 쌓여 가는 것을 확인 하면서 테스트 하면 이해하는데 도움이 될 것 입니다.
        

- 소스

    ```java
    public class Baekjoon_2447 {
    
        private static String[][] tmp;
        
        public static void main(String[] args) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            try {
                int n = Integer.parseInt(reader.readLine());
                tmp = new String[n][n];
                star(n, 0, 0);
                print();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        public static void star(int n, int x, int y) {
            if(n == 1) {
                tmp[x][y] = "*"; 
                return;
            }
            int idx = n / 3;
            for(int i = 0; i < 3; i++) {
                for(int j = 0; j < 3; j++) {
                    if(i == 1 && j == 1) continue;
                    star(idx, x + (idx * i), y + (idx * j));
                }
            }
        }
  
        private static void print() {
          StringBuilder sb = new StringBuilder();
          for(int i = 0; i < tmp.length; i++) {
              for(int j = 0; j < tmp[i].length; j++) {
                  sb.append((tmp[i][j] == null ? " " : "*"));
              }
              sb.append("\n");
          }
          System.out.println(sb.toString());
        }
    }
    ```