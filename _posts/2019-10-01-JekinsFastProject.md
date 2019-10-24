---
layout: post
title: Jenkins + Git + Maven 환경 구성 해서 작업 생성 해보기
date:   2019-10-01 10:10:00
categories: DevOps
comments: true 
---

Jenkins 신규 프로젝트 서버를 신규 구축 할 일이 생겨서 간단하게 설치 부터 기초 파이프라인 실행 까지의 작업을 정리해보았습니다.

## 1. Jenkins, Git, Maven 설치 하기 

- 설치 환경 필수 정보

    - 256 MB of RAM, although more than 512MB is recommended
    - 10 GB of drive space (for Jenkins and your Docker image)
    - Java 8(jre or jdk)

- 설치 링크

    - Jenkins : <http://mirrors.jenkins.io/war-stable/latest/jenkins.war>
    - Maven   : <https://maven.apache.org/download.cgi>
    - Git     : <https://www.git-scm.com/download/win>

- Jenkins 설치   

    - Jenkins 는 간단하게 war를 실행하면 필수 정보들을 설치 한 뒤 실행을 할 수 있도록 구성 되어있다.
        - Jenkins war 실행 하기
        
            ```text
            java -jar jenkins.war --httpPort=8080
            ```
        
        - Jenkins 접속은 http://localhost:8080으로 접속 아래 페이지로 접속이 되면 정상적으로 접속 된 것이다.
        
        ![jenkins Root Page](/img/jenkins/jenkins-1.GIF){: width="50%" height="60%"}
        
        - 위 표시된 경로의 파일을 열어보면 패스워드가 있으니 입력하자.
        
        - 입력 후 admin 계정 생성 및 기본 설정들을 간단히 하자.
        
        - 각종 플러그인 설치(플러그인은 언제든지 설치 할 수 있으니 그냥 넘어가도 된다)
        
        ![jenkins Plugins Page](/img/jenkins/jenkins-2.PNG){: width="50%" height="60%"}
        
        - Jenkins 초기 화면
        
        ![jenkins index Page](/img/jenkins/jenkins-3.PNG){: width="70%" height="70%"}
        
        - Jenkins 플러그인 추가 설치
        
            - 경로 : Jenkins 관리 -> 플러그인 관리
            - 설치 목록 : Blue Ocean, Maven Integration plugin, Git

        - Jenkins Global Tool Configuration 설정
        
            - 경로 : Jenkins 관리 -> Global Tool Configuration
            - 설정 목록 : JDK, Git, Maven
            - 설정 방법
                - Name : 나중에 Jenkins 작업을 할때 해당 이름으로 변수를 사용 하게 된다.
                - Install automatically : 체크 해놓으면 빌드할때 자동으로 설치 한다.
            
            ![jenkins config Page](/img/jenkins/jenkins-4.GIF){: width="100%" height="100%"}
            
### 2. 젠킨스 작업 생성

>_초기화면_

![jenkins index Page](/img/jenkins/jenkins-3.PNG){: width="70%" height="70%"}

- 새작업 클릭

    ![jenkins index Page](/img/jenkins/jenkins-5.GIF){: width="70%" height="70%"}

    - 프로젝트 NAME을 입력한다.
    
    - Pipeline 을 선택 한 뒤 OK를 눌러 설정으로 넘어간다.
    
    ![jenkins index Page](/img/jenkins/jenkins-6.GIF){: width="70%" height="70%"}
        
    - 상단의 Pipeline 탭을 선택 한다.
    
    - 왼쪽 편의 셀렉트 박스를 선택 하면 기본 Script를 생성하는 항목이 있다. 우리는 Github + Maven 을 선택하자.
      아래와 같이 기본 스크립트가 자동 생성된다.      
    
    ![jenkins Script Page](/img/jenkins/jenkins-7.GIF){: width="90%" height="90%"}
    
    - 위 스크립트는 Github 에서 프로젝트를 가져 와서 Maven 빌드를 하는 기본 스크립드로 구성 되어있다.
    
    - Preparation Stage 에 git 경로를 나의 프로젝트 경로로 변경하자.
    
        - 참고 : 미리 작성 해둔 Maven 프로젝트가 없으면 해당 예제 프로젝트를 사용하자.
        
            - Github : <https://github.com/ParkHyeokJin/JenkinsProject>

    - 저장을 하면 나의 첫 번째 젠킨스 프로젝트가 생성 되게 된다.
    
    ![jenkins Project Index Page](/img/jenkins/jenkins-8.GIF){: width="90%" height="90%"}

    - Build Now 를 클릭 하자.
    
    - Build Success!!!
    
    ![jenkins Build Success Page](/img/jenkins/jenkins-9.GIF){: width="90%" height="90%"}

    - Stage view : 각 작업들의 소요 시간 로그 성공여부 등을 확인 할 수 있다.
    
        - Script 에 설정된 Stage 에 따라 Preparation , Build, Result 로 작업이 구분 되어있다.
        
    - 왼쪽 메뉴의 Open Blue Ocean 을 클릭 해보자.
    
    ![jenkins Build Success Page](/img/jenkins/jenkins-10.GIF){: width="90%" height="90%"}
    
    - Blue Ocean 은 Pipeline 을 작성 할 수 있고 작업의 결과를 시각적으로 확인 할 수 있는 플러그인이다.
    
### 마무리

매우 간단한 Jenkins + Github + maven 프로젝트를 빌드 하는 과정을 진행 해보았다.

Pipeline 을 작성하는 방법에는 여러 가지 방법이 있기 때문에 자세한건 다음 포스팅에서 정리 해보도록 하겠다.
