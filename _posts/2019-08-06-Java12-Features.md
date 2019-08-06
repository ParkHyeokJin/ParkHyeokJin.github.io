---
layout: post
title: JDK 12 features
date:   2019-08-06 10:00:00
categories: Java
comments: true 
---

JDK 12 features (Switch Expressions)
-------------------------

### JEP 325 : Switch Expressions (Preview)

자바의 오래된 스위치 식은 여러 가지 문제점을 가지고 있습니다. 장황한 break 문, 시각적인 노이즈 발생, 디버깅의 어려운점을 예로 들 수 있습니다.  
JDK 12 에서는 이러한 전통적인 스위치 식을 개선하여 개발자의 코딩을 향상 시킵니다.  
어떤 부분이 향상 되었는지 알아보도록 하겠습니다. 

1. 다중 레이블 지원  
    JDK 12 에서는 단일 스위치 레이블에서 여러개의 쉼표로 구분이 된 레이블을 지원 합니다.  
    이 스위치 식은 간결 합니다. 실행 하고자 하는 명령어를 -> 오른쪽에 정의 합니다. 
    
    - old jdk
    ```java
    public class SwitchJEP325Exam {
        enum DAY{MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
        public static void main(String[] args) {
            DAY day = DAY.SATURDAY;
            switch (day) {
            case MONDAY:
            case FRIDAY:
            case SUNDAY:
                System.out.println("Weekend");
                break;
            case TUESDAY:
                System.out.println("Week");
                break;
            case THURSDAY:
            case SATURDAY:
                System.out.println("Weekend");
                break;
            case WEDNESDAY:
                System.out.println("Week");
                break;
            }
        }
    }
    ```
    
    - JDK 12 Switch
    ```java
    public class SwitchJEP325Exam {
        enum DAY{MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
        public static void main(String[] args){
            DAY day = DAY.SATURDAY;
            //new
            switch (day) {
                case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> System.out.println("Week");
                case SATURDAY, SUNDAY -> System.out.println("Weekend");
            }
        }
    }
    ```

2. 스위치 식의 값의 반환  
    기존의 JDK 에서는 스위치 식을 사용 하여 특정한 값을 반환 할때 공통 대상 변수에 지정하여 값을 반환 해야 했습니다.  
    하지만 JDK 12에서는 이러한 불편사항을 개선 하였습니다.
    
    - old jdk
    ```java
    public class SwitchJEP325Exam {
        enum DAY{MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
        public static void main(String[] args) {
            SwitchJEP325Exam exam = new SwitchJEP325Exam();
            System.out.println(exam.getDay(DAY.SATURDAY));
        }
        public int getDay(DAY day){
            //old
            int numLetters;
            switch (day) {
                case MONDAY:
                case FRIDAY:
                case SUNDAY:
                    numLetters = 6;
                    break;
                case TUESDAY:
                    numLetters = 7;
                    break;
                case THURSDAY:
                case SATURDAY:
                    numLetters = 8;
                    break;
                case WEDNESDAY:
                    numLetters = 9;
                    break;
                default:
                    throw new IllegalStateException("Wat: " + day);
            }
            return numLetters;
        }
    }
    ```
    
    - JDK 12 Switch
    ```java
    public class SwitchJEP325Exam {
        enum DAY{MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
        public static void main(String[] args) {
            SwitchJEP325Exam exam = new SwitchJEP325Exam();
            System.out.println(exam.getDay(DAY.SATURDAY));
        }
        public int getDay(DAY day){
            //new
            int numLetters = switch (day) {
                case MONDAY, FRIDAY, SUNDAY -> 6;
                case TUESDAY                -> 7;
                case THURSDAY, SATURDAY     -> 8;
                case WEDNESDAY              -> 9;
            };
            return numLetters;
        }
    }
    ```

3. 로컬 변수 및 break  
    스위치 식의 분기에 로컬 변수를 정의 할 수 있습니다. {} 블록은 break 반환 할 값을 지정하는 명령문을 포함해야 합니다.
    
    ```java
    public class SwitchJEP325Exam {
        enum DAY{MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY };
        public static void main(String[] args) {
            SwitchJEP325Exam exam = new SwitchJEP325Exam();
            System.out.println(exam.getDay(DAY.SATURDAY));
        }
        public int getDay(DAY day){
            //new
            int numLetters = switch (day) {
                case MONDAY, FRIDAY, SUNDAY -> 6;
                case TUESDAY                -> 7;
                case THURSDAY, SATURDAY     -> {
                        int month = 6;
                        break month > 6 ? 10 : 8;
                    }
                case WEDNESDAY              -> 9;
            };
            return numLetters;
        }
    }
    ```



