---
layout: post
title: 도커에 MYSQL 설치 하는 방법(Docker)
date:   2021-05-13 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

도커를 이용하여 MySql 환경을 구성 하는 방법을 정리해봅니다. 도커에 대해서 기본지식이 있는 상태에서 테스트가 가능합니다.  
도커 설치 방법에 대해서는 아래 포스팅을 참고 하시기 바랍니다.

---

### 도커에 MySql 이미지 설치 하기

* MySql 이미지 다운로드(https://hub.docker.com/_/mysql/?tab=tags&page=1&ordering=last_updated)

> $ Docker pull mysql:8.0.25

* MySql 이미지 확인

> $ Docker images

![docker images](/img/docker/docker-mysql-img.png){: width="90%" height="90%"}

* Docker MySql 컨테이너 생성 및 실행

  * Docker 에 DB 를 설치 하는 경우 컨테이너 삭제시 내부에 저장된 데이터도 삭제 되므로 저장소는 외부 서버 디렉토리를
마운트 해서 사용 해야 합니다.
  
> $ docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password --name docker-mysql -v /Users/Docker/datadir:/var/lib/mysql mysql:8.0.17

* 도커 실행 할때 docker-compose 파일 활용 하는 방법
  * 도커를 실행 할 경우에는 위 처럼 명령어를 통해서 실행 할 수 있지만 매번 입력 하는 경우 잊어버리기 쉽습니다.
    docker-compose.yml 파일을 생성 하는 경우 파일 내용을 통해서 어떠한 설정으로 동작 하는지 유지 할 수 있기 때문에
    추천 하는 방법입니다.
    
  * docker-compose.yml 작성방법

```docker 
  version: "3.9"                # optional since v1.27.0
  services:
    db:                         # 서비스 명
       image: mysql:8.0.25         # 사용할 이미지
       container_name: docker-mysql # 컨테이너 이름 설정
    ports:
       - "3306:3306"               # 접근 포트 설정 (컨테이너 외부:컨테이너 내부)
    environment:                # -e 옵션
       MYSQL_ROOT_PASSWORD: password  # MYSQL 패스워드 설정 옵션
    command:                    # 명령어 실행
       - --character-set-server=utf8mb4
       - --collation-server=utf8mb4_unicode_ci
    volumes:
       - /Users/Docker/datadir:/var/lib/mysql # -v 옵션 (다렉토리 마운트 설정)
```

* Docker Compose 실행

docker-compose.yml 파일 작성이 완료 되었으면 해당 파일이 있는 경로에서 아래 명령어를 통해 실행 할 수 있습니다.

> docker-compose up -d

도커 실행 확인 하는 방법

> docker ps

![docker ps images](/img/docker/docker-ps.png){: width="90%" height="90%"}

* mySql 접속 하는 방법

도커 컨테이너가 정상적으로 기동이 되었을 경우 컨테이너 아이디를 통하여 mySql 에 접속 할 수 있습니다.

컨테이너 아이디는 docker ps 로 확인 가능 합니다. (위 스샷 참조)

> 예) docker exec -it {CONTAINER ID} /bin/bash  
> 실사용) docker exec -it ae72dec1524a /bin/bash

컨테이너에 접속이 되면 mySql 명령어를 통하여 DB에 접속 합니다.

> mysql -u root -p

![docker mysql conn images](/img/docker/docker-mysql.png){: width="90%" height="90%"}

