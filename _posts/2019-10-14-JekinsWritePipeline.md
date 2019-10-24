---
layout: post
title: 젠킨스 파이프라인 작성방법(기초)
date:   2019-10-14 10:10:00
categories: DevOps
comments: true 
---

### 젠킨스 파이프라인

젠킨스 파이프라인은 연속된 작업을 연결 해놓은 젠킨스의 자동화 된 프로세스를 표현 하는 말입니다.  
이전 [Jenkins + Git + Maven 환경 구성 해서 작업 생성 해보기](https://parkhyeokjin.github.io/java/2019/10/01/JekinsFastProject.html) 에서 젠킨스 환경을 구성 해서
젠킨스 파이프라인을 통해서 빌드 하는 환경을 맛보기 해보았습니다.  
젠킨스 파이프라인은 Groovy 문법을 사용 하기 때문에 디테일한 부분은 따로 공부를 하고!!  
이번 포스팅에서는 젠킨스에서 제공 하는 기능을 이용하여 기본적인 배포 파이프라인을 작성 하는 방법을 알아보겠습니다.    

1. 새로운 작업 생성 하기.

    - New Item -> 젠킨스 파이프라인 클릭!
    
    ![jenkins index Page](/img/jenkins/jenkins-5.GIF){: width="80%" height="70%"}
    
    - pipeline 탭 클릭!!
    
    ![jenkins index Page](/img/jenkins/jenkins-11.GIF){: width="80%" height="70%"}
    
    - 오른쪽 상단에 try Sample pipeLine 을 클릭 하면 helloWorld 기본 github 연동 pipeline 샘플을 자동으로 작성 해주지만  
      우린 아래 기본 구성 스크립트로 작성 해보도록 하겠습니다.
    
    - _Jenkinsfile_ 기본 구성
     
        ```groovy
        node {  
            stage('Build') { 
                // 
            }
            stage('Test') { 
                // 
            }
            stage('Deploy') { 
                // 
            }
        }
        ```
    
    - 위 Jenkinsfile 은  Build, Test, Deploy 3개의 stage로 구성되어있는 pipeline 스크립트입니다.      
    단계를 더 추가하고자 할경우에는 stage를 복사하여 적절한 stage name을 정해 주면 됩니다.   

2. Pipeline Syntax
    
    - 젠킨스에서는 파이프라인을 작성 할 수 있도록 스크립트 툴을 제공 합니다. 아래 Pipeline Syntax를 클릭 합니다.  
    
    ![jenkins index Page](/img/jenkins/jenkins-12.GIF){: width="80%" height="70%"}
    
    - 젠킨스 스크립트 작성 툴
    
    ![jenkins index Page](/img/jenkins/jenkins-13.png){: width="80%" height="70%"}

3. Build Step 작성 하기

    - Github 에서 프로젝트를 checkout 받을 수 있도록 스크립트를 생성 해보겠습니다.
    
    - Steps -> Sample Step -> checkout: Check out from version control 선택
    
        ![jenkins index Page](/img/jenkins/jenkins-14.png){: width="100%" height="100%"}
   
        - SCM : Git 선택
        - Repository URL : Github URL 입력 
   
    - Generate Pipeline Script 클릭 하면 아래와 같이 스크립트가 생성 된다.
    
    ![jenkins index Page](/img/jenkins/jenkins-15.png){: width="100%" height="100%"}
    
    - 복사 하여 기본 구성에 붙여 놓고 실행 해보겠습니다.
    
        ```groovy
        node {  
            stage('Build') { 
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/ParkHyeokJin/JenkinsProject']]])
            }
            stage('Test') { 
                // 
            }
            stage('Deploy') { 
                // 
            }
        }
        ```
     
    - 정상 실행 !!
    
    ![jenkins index Page](/img/jenkins/jenkins-16.png){: width="100%" height="100%"}
    
4. 마무리

    위와 같은 방법을 이용 하여 SCM 체크 아웃 -> 컴파일 -> 테스트 -> 배포 스탭을 하나씩 만들어 가면서 나만의 빌드를 만들 수 있습니다.      
    다음 포스팅에서는 Groovy 의 기본적인 문법에 대하여 알아보도록 하겠습니다.
      