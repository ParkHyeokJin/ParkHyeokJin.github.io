---
layout: post
title: Log4j 취약점 이슈! (CVE-2021-44228, NVD)
date:   2021-12-12 10:00:00
categories: others
category : others
comments: true 
---

## Log4j 보안 취약점 이슈! (CVE-2021-44228, NVD)
--------

Apache Log4j 에서 발생한 보안 이슈에 대해서 정리 합니다.

아파치 제단의 Log4j의 취약점 보고([CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228), [NVD](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)) 를 통해서 악성 코드 감염 및 원격 접속 등의 피해가 발생 할 수 있다는 보고가
나왔습니다.  

해당 이슈를 통해서 전세계 적으로 라이브러리 패치를 진행 하였으며 전사 프로젝트도 점검을 하였습니다.  
  
  
#### Log4j 2 진행상황(출처 : 나무위키)

- 2021.11.24 알리바바 클라우드 보안팀에서 최초로 발견 (Apache 공지)
- 2021.11.30 Log4j팀, Restrict LDAP access via JNDI pull request 추가 (12/5 Merged)
- 2021.11.30 Log4j팀, no longer formats lookups in messages by default pull request 추가 (12/5 Merged)
- 2021.12.09 log4j 2 보안 이슈 PR과 취약성 재현 스샷이 한 트윗에 올라오면서 이슈가 퍼지기 시작
- 2021.12.10 마인크래프트 기술 책임자가 관련 이슈 수정하였다며 트윗으로 알리면서 본격 이슈화
- 2021.12.10 Log4j 2.15.0 버전 릴리즈 로 보안 취약성 패치
- 2021.12.12 Disable JNDI by default 추가
- 2021.12.12 Log4j 2.15.1 버전 릴리즈 후보 (JNDI 기본값 Disable)
  
  
#### 보도 자료(출처 : 나무위키)

- 연합뉴스 - ["컴퓨터 역사상 최악 취약점 발견" 전세계 보안업계 화들짝(종합)](https://www.yna.co.kr/view/AKR20211211035951009?section=popup/print)
- 뉴스1 - ["컴퓨터 역사상 최악의 취약점 발견" 보도에 국정원 "선제적 조치 취해"](https://news.naver.com/main/tool/print.naver?oid=421&aid=0005778626)
- 지디넷코리아 - ['로그4j' 치명적 보안 허점…인터넷 서버 대부분 위험](https://news.naver.com/main/tool/print.naver?oid=092&aid=0002241848)
  
  
#### 대응 방안
  
- Log4j 2.15.00 이상 사용 권고.
    - Springboot 의 경우 logback을 Default 로 사용하고 있으며 2.6.2 버전 이후 log4j 2.15.00 버전 의존성 참조 됨
    - 스케닝 도구 : [Huntress log4jShell Testing application](https://labrador.iotcube.com/)
    
- 대응 사례 (참고)
    - 2021.12.10 [AWS, Apache Log4j2 Issue](https://aws.amazon.com/ko/security/security-bulletins/AWS-2021-005/) (영문)
    - 2021.12.11 [Cloudflare Security의 Log4j 2 취약점 대응](https://blog.cloudflare.com/how-cloudflare-security-responded-to-log4j2-vulnerability/) (영문)
      
  
> #Log4j #CVE-2021-44228 #보안취약점 #NVD #Springboot #스프링부트