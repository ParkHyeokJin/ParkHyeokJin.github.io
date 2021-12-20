---
layout: post
title: CVE-2021-45105 Log4j 2 DoS 취약점,  CVE-2021-42550 Logback RCE 취약점
date:   2021-12-16 10:00:00
categories: others
category : others
comments: true 
---

## CVE-2021-45105 Log4j 2 DoS 취약점,  CVE-2021-42550 Logback RCE 취약점
--------

Log4j 보안 취약 관련 하여 log4j < 2.16.x 버전으로 업그레이드를 하였으나 또 다른 취약점이 발생 하여 제거 하기로 하였습니다.

사실 프로젝트에서 Logback 을 default logger 로 사용 하고 있기 때문에 하지 않아도 되나.. 혹시 모를 누군가의 사용을 방지 하기 위해 제거 하기로..

취약점은 아래와 같습니다.

1. CVE-2021-45105 Log4j DoS 취약점  
   Apache Log4j2 버전 2.0-alpha1 ~ 2.16.0은 공격자가 제공한 재귀 조회 패턴으로 스택오버플로우 발생하여 프로세스가 종료될 수 있습니다. (DoS)
  
    - 대상
        - Log4j >=2.0-beta9, <= 2.16.0 버전


2. CVE-2021-42550 Logback RCE 취약점
   - Logback < 1.2.9 에서 설정 파일에 접근 및 쓰기권한을 가진 공격자가 JMSAppender를 통해 JNDI lookup을 실행이 가능하여 원격코드실행이 가능하게 됩니다.  
     (*** 다행이 logback 은 log4j 와 다른 취약점 레벨을 가지고 있습니다.)

   - 대상 
      - Logback < 1.2.9 버전  
        ※ 단, 로그백 원격코드실행 취약점이 발현되기 위해서는 아래 조건이 모두 충족되어야 함
        
   - 공격자는 사전에 로그백 설정 파일(logback.xml)에 접근 및 쓰기 권한이 있어야 함
   - 공격자가 변조한 설정 파일(logback.xml)이 시스템에 적용되어야 함(변조된 설정 파일 배치 후 시스템 재기동 or Scan="true"로 설정 필요)
   - 1.2.9 이전 버전 사용

##### 조치 방법  

- Java 8 (or later)
   - 2.17.0 버전 이상으로 업데이트
- Java 7 : Apache 보안업데이트가 완료될 경우 게시 예정  
   - 현재 CVE-2021-45105 에 대해 2.12.x 브랜치에서 2.12.3 릴리즈 진행중으로 릴리즈 전까지 아래 완화방법 적용 필요

##### 완화방법

- 로깅 설정의 PatternLayout에서 ${ctx:loginId} 또는 $${ctx:loginId} 컨텍스트 조회를 스레드 컨텍스트 맵 패턴(%X, %mdc 또는 %MDC)으로 교체
- 다른 방법으로 로깅 설정에서 ${ctx:loginId} 또는 $${ctx:loginId}를 제거


> #Log4j #CVE-2021-45105 #보안취약점 #NVD #Springboot #스프링부트 #CVE-2021-42550