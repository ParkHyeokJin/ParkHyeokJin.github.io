---
layout: post
title: Sonarqube Jenkins 연동
date:   2021-06-29 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

사내에서 코드 품질 관리를 하기 위해 Sonarqube 를 사용 하기로 결정 되어 POC 진행 하면서 내용을 정리 합니다.

이번에는 Jenkins 를 활용 하여 github -> sonarqube scan -> build 처리 하는 방법에 대해서

정리 해보겠습니다.

---

### Jenkins plugins 설치

Jenkins 에서 Sonarqube 를 사용 하기 위에서 플러그인을 설치 해야 합니다.

> Jenkins > Jenkins 관리 > 플러그인 관리

![jenkins_plugins](/img/sonarqube/install-plugins.png){: width="90%" height="90%"}


Jenkins 플러그인 설치 후 Global Tool Configuration 메뉴에서 Sonarqube Scanner 을 설정 합니다.

> Jenkins > Jenkins 관리 > Global Tool Configuration

![jenkins_config](/img/sonarqube/set-jenkinsConfig.png){: width="90%" height="90%"}

Jenkins 환경 설정 메뉴에서 SonarQube 서버 설정을 합니다.

> Jenkins > Jenkins 관리 > 환경 설정

![jenkins_config](/img/sonarqube/set-jenkinsConfig2.png){: width="90%" height="90%"}

서버 설정시 자격 증명은 _Secret text_ 로 선택 하여 Sonarqube 에서 발급 받은 Token 정보를 입력합니다.

![jenkins_config](/img/sonarqube/jenkins-credentials-provider.png){: width="90%" height="90%"}

### Sonarqube 프로젝트 생성

플러그인 설치 및 환경 정보 설정이 완료 되고 프로젝트 구성을 할 수 있는 준비가 되었습니다.

> Jenkins > 프로젝트 생성 > Free Style Project > Build

Sonarqube 플러그인 설치 후 프로젝트 생성을 생성을 하면 Build 항목에 Execute Sonarqube Scanner Step 이 생성 됩니다.

![jenkins_build](/img/sonarqube/buildStep.png){: width="90%" height="90%"}

Analysis properties 영역에 아래 정보들을 입력 합니다.

* 작성 예시

```text
# unique project identifier (required)
sonar.projectKey=my:project

# project metadata (used to be required, optional since SonarQube 6.1)
sonar.projectName=My project
sonar.projectVersion=1.0

# path to source directories (required)
sonar.sources=srcDir1,srcDir2

# path to test source directories (optional)
sonar.tests=testDir1,testDir2

# path to Java project compiled classes (optional)
sonar.java.binaries=bin

# comma-separated list of paths to libraries (optional)
sonar.java.libraries=path/to/library.jar,path/to/classes/dir

# Additional parameters
sonar.my.property=value
```

프로젝트 생성을 하고 빌드 수행시 아래와 같이 Sonarqube 스캔 결과를 볼수 있습니다.

![jenkins_projectView](/img/sonarqube/JenkinsProjectView.png){: width="90%" height="90%"}

### Jenkins Pipeline 활용

Jenkisn pipeline 프로젝트에서는 Deploy 전에 Sonarqube Scan 을 수행 하여 처리를 할 수 있습니다.
Sonarqube 결과를 체크 하여 Deploy 수행 여부를 결정 할 수도 있으나 현재 수행 하고 있는 프로젝트에서는
Develop merge 이전에 sonarqube 를 수행 하여 review 후 최종 반영이라 해당 부분은 제외 하였습니다.

```text
...
stage('sonarqube scan'){
    steps {
        withSonarQubeEnv(credentialsId: 'SonarQube_Token') {
            sh './gradlew sonarqube -Dsonar.projectKey=:myproject -Dsonar.host.url=my:url -Dsonar.login=my:key'
        }
    }
}
...
```
