---
layout: post
title: 젠킨스 스케쥴을 순차적으로 실행 해보자
date:   2021-03-08 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

젠킨스 + 스프링 배치를 사용한지도 꽤 되었습니다. 기존에 사용 하고 있던 Cron 기반의 반복 처리 되고 있는

배치 서비스들이 전부 젠킨스 + 스프링배치에 녹아 들어 왔습니다.

편하게 사용을 하다보니 배치의 경계가 조금 무뎌지고 일 배치 뿐만 아니라

조금 더 빈번 하게 동작 해야하는 배치 서비스도 젠킨스 + 스프링배치를 통해서 구성 하기 시작 했습니다.

---

### Build periodically


반복적으로 실행 되는 배치의 경우에는 젠킨스 빌드 유발(Build periodically) 을 통해서

기존 Cron 에 설정 된 시간에 반복 실행 하는 것으로 동작을 시켰습니다.

하지만 조금 더 빈번하게 순차적이면서 반복적으로 계속 수행이 되어야 하는 배치도 있을 것입니다.

스프링의 경우 FixedRate와 FixedDelay 를 사용 하여 우선 실행 된 계획의 실행 후 일정 딜레이를 두고

반복 실행 시키도록 설정을 하였는데 젠킨스에도 비슷 한 기능이 있어 활용 해보았습니다.

---

### 젠킨스 반복 스케쥴 만들기


목표 : 주기적으로 실행 되는 빈번한 반복 배치 의 실행을 안정적으로 일정 시간 텀을 두고 실행 시키자 

배치를 반복적으로 실행 하도록 설정을 해보겠습니다.

1) FreeStyle Project 를 우선 생성

2) Build 탭 배치 작업 작성 하기

Execute shell 에 echo 'hello retry batch' 를 출력 하도록 작성 하였습니다.

![jenkins Retry Image00](/img/jenkins/jenkins-retry-00.png){: width="90%" height="90%"}

배치 수행을 반복 적으로 하기 위해서 빌드 후 조치(Build other project) 를 통해서 반복 설정을 하였습니다.
  이때 본 작업을 계속 수행 해야 하기 때문에 TEST_PROJECT 를 입력 하고 항목에 맞는 트리거를 선택 합니다.

![jenkins Retry Image01](/img/jenkins/jenkins-retry-01.png){: width="90%" height="90%"}

빌드 후 조치(Build other project) 에는 3가지 옵션이 존재 합니다. 적절한 옵션을 선택 합니다.
     
     a. Trigger only if build is stable
     
     b. Trigger even if the build is unstable
     
     c. Trigger even if the build fails


3) 배치 반복 테스트

![jenkins Retry Image02](/img/jenkins/jenkins-retry-02.png){: width="90%" height="90%"}

결과를 통하여 프로젝트가 정상적으로 종료 된 후 일정 시간을 두고 다음작업이 실행이 되며 해당 작업은 "프로젝트 중지" 를 하기 전까지
계속 반복 되는 것을 볼 수 있습니다.(default 5초 간격)

4) 반복 수행 되는 시간 조절 하기(Quiet period)

Quiet period 옵션을 통하여 실행 간 시간을 조절 할 수 있습니다.

![jenkins Retry Image03](/img/jenkins/jenkins-retry-03.png){: width="90%" height="90%"}

60초로 설정을 하고 다시 실행 해보겠습니다.

![jenkins Retry Image04](/img/jenkins/jenkins-retry-04.png){: width="90%" height="90%"}

실행이 되기 까지 60초를 대기 한뒤 본작업이 수행 되는것을 볼 수 있습니다.

---

### 마무리

젠킨스를 활용 하여 스프링의 FixedRate & FixedDelay 와 동일한 기능을 구현 할 수 있습니다.

배치 서비스를 구성 하고 관리 시스템을 구성 하기 전에 해당 기능을 통하여 간단하게 구현 해보시기 바랍니다.
