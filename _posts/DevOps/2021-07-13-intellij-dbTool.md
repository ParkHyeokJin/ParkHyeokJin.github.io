---
layout: post
title: 인텔리제이 Database 기능 사용하기(DataGrip)
date:   2021-06-29 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

JetBrains 의 제품중에서는 Database Tool 인 DataGrip 이라는 유료 제품이 있습니다.    
Database 관리를 하기에 최적화된 툴이지만 유료이기 때문에 접근하기에 어렵습니다.  
하지만 인텔리제이에서도 기본적인 Database 를 사용 할 수 있는 기능을 제공 하고 있습니다.  
인텔리제이에서 Database 에 접속 하여 사용 하는 방법을 정리 해보겠습니다.  

---

### 인텔리제이 프로젝트 생성

Database 를 관리 하기 위한 프로젝트를 생성합니다.  
프로젝트는 empty project 로 생성하여 이름을 정합니다.(전 스키마명을 프로젝트명으로 생성 하였습니다.)

- 인텔리제이 > file > new > project

![newProject](/img/intellij/newProject.png){: width="90%" height="90%"}

프로젝트 생성 후 오른쪽 상단에 Database 를 선택 합니다.

![db-1](/img/intellij/db-1.jpg){: width="90%" height="90%"}

Database 추가를 위해 상단의 + 를 선택 합니다.

![db-2](/img/intellij/db-2.jpg){: width="90%" height="90%"}

+ 버튼을 선택 하면 아래 사진과 같이 DataSource 를 선택 할 수 있습니다.(전 테스트용으로 mySql 을 선택 하였습니다.)

![db-3](/img/intellij/db-3.png){: width="60%" height="60%"}

양식에 맞추어 DB 정보를 입력 합니다.

![db-5](/img/intellij/db-5.png){: width="90%" height="90%"}

Test Connection 을 선택 하여 정상 접속 되는 것을 확인 합니다.

![db-7](/img/intellij/db-7.png){: width="90%" height="90%"}

DB 명 옆에 표시 되어있는 1 of 4 버튼을 클릭하면 해당 DB 의 스키마 리스트를 확인 할 수 있습니다.

![db-6](/img/intellij/db-6.png){: width="90%" height="90%"}

DB 접속 후 아래와 같이 스키마 생성, 테이블 생성, 조회를 수행 할 수 있으며 쿼리 작성시 자동 완성 기능도 매우 훌륭 하게 사용 할 수 있습니다.

![db-8](/img/intellij/db-8.png){: width="90%" height="90%"}




