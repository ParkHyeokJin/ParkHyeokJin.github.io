---
layout: post
title: 젠킨스 서버 vue.js node.js 설정
date:   2020-10-14 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

젠킨스 node.js 설정을 위한 기록입니다.

배포 서버에 npm or node 를 설치 하지 않고 jenkins plugin 을 통해서 사용하는 방법입니다.

### Jenkins Plugins

Jenkins 관리 > 플러그인 관리 > 설치 가능

- NodeJS Plugin

### NodeJS 설정하기

Jenkins 관리 > Global Tool Configuration > NodeJS

아래 이미지를 참고 하여 해당되는 NodeJS 버전을 선택 하여 설정합니다.

![jenkins NodeJs Configure1](/img/jenkins/nodejs-img1.png){: width="100%" height="100%"}

### 새로운 Item 만들기

NodeJs 테스트를 위해 Freestyle project 를 생성합니다.

![jenkins NodeJs Configure2](/img/jenkins/nodejs-img2.png){: width="100%" height="100%"}


간단한 테스트를 위해 node, npm 버전을 체크 해보겠습니다.

![jenkins NodeJs Configure3](/img/jenkins/nodejs-img3.png){: width="100%" height="100%"}
![jenkins NodeJs Configure4](/img/jenkins/nodejs-img4.png){: width="100%" height="100%"}


설정 완료 후 Build Now 를 하면 아래와 같이 정상적으로 명령이 수행 되는것을 확인 할 수 있다.

![jenkins NodeJs Configure5](/img/jenkins/nodejs-img5.png){: width="100%" height="100%"}