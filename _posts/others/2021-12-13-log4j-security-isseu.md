---
layout: post
title: Log4j 새로운 보안 취약점 발견! 2.15.x 버전이 우회 되었습니다. (CVE-2021-45046)
date:   2021-12-13 10:00:00
categories: others
category : others
comments: true 
---

## log4j 2.15.x 버전이 우회되는 취약점이 발생 했습니다. (CVE-2021-45046)
--------

이전 포스팅에서 log4j 보안 이슈에 대해서 정리 했는데. 어제 저녁 12/14일 2.15.x 버전이 우회 되어 신규 취약점이 발견 되었습니다.  
[CVE-2021-45046](https://nvd.nist.gov/vuln/detail/CVE-2021-45046) 해당 취약점을 확인 하시고  
2.16.x [Log4j 2.16.x 링크](https://logging.apache.org/log4j/2.x/changes-report.html#a2.16.0) 버전으로 업그레이드를 다시 진행 하셔야 합니다.

## 조치 방법

- 2.16.0 이상 (Java8 이상) 버전 업데이트
    - Java8 이후 버전
        - org.apache.logging.log4j:log4j-core 2.16.0
        - org.apache.logging.log4j:log4j-api 2.16.0

- 업데이트가 어려운 경우 아래 방법으로 완화가 가능합니다.
    - 2.10~2.14 버전의 경우
        - log4j2.formatMsgNoLookups의 값을 true로 설정
    - 2.10.0 이전 버전의 경우 (2.0-beta9 ~ 2.10.0)
        - JndiLookup 클래스를 경로에서 제거
        - zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class


> #Log4j #CVE-2021-44228 #보안취약점 #NVD #Springboot #스프링부트