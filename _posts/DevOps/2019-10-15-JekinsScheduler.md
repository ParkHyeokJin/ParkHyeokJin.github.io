---
layout: post
title: 젠킨스 스케쥴을 이용하여 업무시간을 단축 하기
date:   2019-10-15 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

저는 현재 개발운영파트(?)에 소속 되어있다 보니 개발도 하고 운영도 하고 있습니다.  
매일 아침 출근 해서 처음 하는 일이 각 운영 서버에 접속 해서 간밤에 별일이 없었는지 서버별로  
체크를 하는 반복적인 작업을 하는 것으로 하루 일과를 시작합니다.  

서버 로그를 감지하는 솔루션이 있지만 운영팀의 숙명(?)인지 아직 사람 눈으로 매번 체크를 해야 합니다.(~~부장님이 시켜서..~~)  
매번 동일한 작업을 각 서버에 접속해서 반복적으로 하다보니 시간이 아깝기 시작합니다.

그래서 젠킨스 잡으로 만들어서 매번 서버에서 쉘을 실행 시키고 나는 결과만 모니터링 해서
이상한(?) 로그가 있는지 체크 하기로 합니다.

### 젠킨스 스케쥴 만들기

목표 : 매번 서버에 접속해서 로그를 점검 하는 업무를 젠킨스에게 대신 해달라고 하자.

1. 각 서버에 쉘 스크립트 를 만들자.

    - 로그를 점검해야 하는 쉘 스크립트를 일단 각 서버별로 작성 합니다.

2. 젠킨스에 서버 접속 정보 설정 하기.
    
    - Jenkins -> Jenkins 관리 -> 시스템 설정 -> Publish over SSH 
    
    ![jenkins SSH Server Create](/img/jenkins/jenkins-18.png){: width="90%" height="90%"}
    
    - SSH Servers 클릭 후 서버 등록
 
3. 젠킨스 item 생성

    - DailyJob pipeline item 생성 
        
    ![jenkins Create Items](/img/jenkins/jenkins-17.png){: width="90%" height="90%"}
    
    - Build Triggers 등록
        
        - 젠킨스에서는 다양한 빌드 유발 방법을 지원 하지만 반복 적인 작업으로 생성 해야 하기 때문에 Build periodically 를 선택 합니다.  
          출근하기 전인 매일 아침 8시 30분에 자동으로 빌드 하도록 설정 하였습니다.  
          (시간 설정은 crontab 시간 설정 형태로 등록 하면 됩니다.)
              
    ![jenkins Create Items](/img/jenkins/jenkins-19.png){: width="90%" height="90%"}
    
    - pipeline 스크립트 생성
    
        ```groovy
        node {
           Stage('1번 서버 점검'){
               echo '1번 서버 점검 결과'
           }
           Stage('2번 서버 점검'){
               echo '2번 서버 점검 결과'
           }
           Stage('3번 서버 점검'){
               echo '3번 서버 점검 결과'
           }
        }
        ```    
        
    - 빌드 테스트
    
    ![jenkins Create Items](/img/jenkins/jenkins-20.png){: width="100%" height="100%"}
    

### 마무리

이처럼 젠킨스를 배포 작업 외에도 반복 적인 작업, 예약된 작업 등 여러 방안에서 items 를 만들 수 있습니다.  
반복적으로 불필요한 업무 시간을 낭비 하고 있다면 젠킨스를 이용해서 업무 시간을 단축 해보시기 바랍니다.    