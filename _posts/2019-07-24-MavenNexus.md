---
layout: post
title: 프로젝트에 Maven, Nexus 연동하기(CI/CD)
date: 2019-07-24 11:00:00
categories: Java
comments: true
---

프로젝트를 전달 받았는데 프로젝트관리도구도 없고...배포도 수작업으로 말아서 하고 있고
라이브러리도 /project/libs 폴더에 버전별로 마구잡이로 들어있었다.

맙소사.....

버전관리는 SVN으로 관리 하고는 있다. 하지만 Commit history를 제대로 기입 해놓지 않았다.....
일단 이클립스에 셋팅을 위해 SVN에서 소스를 받았다. 오류가 마구 발생한다. 
컴파일 버전은 몇 버전이지..
일단 라이브러리 폴더에서 라이브러리들을 참조 한다. 아....라이브러리가 버전별로 있는데 뭘 참조해야 하지..
일단 최신버전으로 참조 해본다. 오류가 하나씩 사라진다..테스트 해본다 동작이 정상인건가...

최근에 개발된 프로젝트가 아닌 경우 프로젝트 관리 도구, 버전 관리 도구, 배포도구 등
적용이 되어 있지 않아 이런 경우가 많다. (나만 그런건지.....)

일단 프로젝트를 갑자기 마구 변경 할 수 는 없다. 위험성도 있고 배포도 쉽지 않기 때문에 차근 차근 적용 해보기로 한다.


### 프로젝트관리도구 적용하기(Maven)

일단 프로젝트관리도구를 적용 해서 컴파일 버전이나 의존성 관리 부터 하자.

- 프로젝트 Maven Project 로 Convert 하기

    > 프로젝트 우클릭 -> Configure -> Convert to Maven Project
    
    ![ProjectConvert](/img/nexus/projectConvert.png){: width="50%" height="60%"}
    <br />
    
    ![ProjectCreate](/img/nexus/projectCreate.png){: width="50%" height="60%"}
    
    > POM.xml
    
    ![Pom](/img/nexus/pom.png)
    <br />
    
    프로젝트가 Maven Project 로 Convert 되면서 의존성 관리를 할 수 있는 POM.xml 이 생성 되었다.
    
    ```xml
    <dependencies>
        <dependency>
            <artifactId>junit</artifactId>
            <groupId>junit</groupId>
            <version>4.12</version>
        </dependency>
      </dependencies>
    ```
    
    테스트를 하기 위해서 Junit 의존성을 추가 한다.  
    망분리 덕분에 Maven 레파지토리에 접속이 되지 않는다....  

### Nexus 3.x 설치

망분리로 외부 네트워크가 되지 않아 외부에서 라이브러리를 가져 올 수 없다.  
SVN 서버에 Maven Repository 를 관리 할 수 있도록 Nexus를 설치 해서 의존성 관리를 하기로 하였다.

- 넥서스 설치

    Nexus는 무료로 Maven Repository를 사용 할 수 있는 툴이다.  
    다운로드는 <https://www.sonatype.com/download-oss-sonatype> 에서 받을 수 있다.
    
    ![NexusDown](/img/nexus/nexusDwn.png){: width="80%" height="80%"}
    <br />
    
    윈도우 버전을 다운 받아서 설치 하기로 하였다.
    
    ![NexusFolder](/img/nexus/nexusFolder.PNG)
    <br />

    - nexus 3.x
        - Nexus Repository Manager 어플리케이션 폴더
    - sonatype-work
        - Data-store로 저장소, 설정, 캐시 등의 모든 데이터가 이 폴더 하위에 저장

    넥서스를 다운 받아서 압출을 풀면 해당 폴더들이 생긴다.  
    명령프롬프트 창을 열어서 \nexus-3.17.0-01-win64\nexus-3.17.0-01\bin 로 이동 한다. bin 폴더 에는 Nexus.exe 파일이 있다.
    
    - 넥서스 실행
        - linux : ./nexus run
        - windows : nexus.exe /run

    ![NexusOK](/img/nexus/nexusOK.PNG)
    <br />
 
    > 실행 완료!!
 
 - 사용자 인터페이스 접속 (http://localhost:8081)
 
    실행 완료 후 http://localhost:8081 로 접속 하게 되면 넥서스 사용자 인터페이스에 접속 할 수 있다.
 
 - 로그인
 
    로그인 아이디는 admin 이며 패스워드는 /%NEXUS%/sonatype-work/nexus3/admin.password 파일을 보면 확인 할 수 있다.  
    최초 로그인을 하게 되면 비밀번호 변경 및 간단한 셋팅 후 로그인이 된다.
  
 - upload
 
    외부에서 라이브러리를 가져올 수 없기 때문에 넥서스 서버에 업로드 하기로 한다.
    
    <img src="/img/nexus/nexusUpload.PNG" alt="nexusUpload" title="nexusUpload">
    <br />
 
    넥서스 사용자 인터페이스에서 upload 를 클릭 하여 해당 라이브러리를 upload 한다.
 
 - Search
    
    라이브러리 업로드를 하면 Search -> maven 에서 확인 할 수 있다.
    
    <img src="/img/nexus/nexusUpload.PNG" alt="nexusUpload" title="nexusUpload">
    <br />
    
  - 넥서스 프록시 설정
    
    프로젝트에서 공통 설정을 하기 위해서 pom.xml 에 넥서스 프록시 설정을 하기로 한다.
    
    ```xml
    <repositories>
         <repository>
             <id>public</id>
             <url>http://localhost:8081/nexus/content/groups/public/</url>
             <releases>
                 <enabled>true</enabled>
             </releases>
             <snapshots>
                 <enabled>true</enabled>
             </snapshots>
         </repository>
    </repositories>
    ```
    
정상적으로 junit 의존성을 참조 할 수 있게 되었다.  
넥서스의 자세한 정보는 넥서스 도큐먼트 <https://help.sonatype.com/repomanager3> 에서 확인 하자.

이제 프로젝트 의존성 관리는 되었고 젠킨스 도커 등등 할일이....태산......이다..
