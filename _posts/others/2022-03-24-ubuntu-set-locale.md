---
layout: post
title: ubuntu 서버 locale 설치 및 셋팅
date:   2022-03-23 10:00:00
categories: others
category : others
comments: true 
---

## ubuntu 서버 locale 설치 및 셋팅
--------

서버 인스턴스 생성 후 locale 셋팅을 하다보니 자꾸 까먹어서.....기록 해두기 위한 포스팅 입니다.

ubuntu 기본 locale 은 en-US.UTF-8 로 설정 되어있어 ko_KR.UTF-8 로 변경 하기 위함입니다.

#### locale 확인

> locale

#### ko language pack 설치

> sudo apt-get install language-pack-ko

#### ko_KR.UTF-8 설치

> sudo locale-gen ko_KR.UTF-8

#### 로케일 설정

> sudo dpkg-reconfigure locales

#### 서버 LANG 설정

> sudo update-locale LANG=ko_KR.UTF-8 LC_MESSAGES=POSIX

재접속 하여 locale 확인 하면 설정 완료.

```text
LANG=ko_KR.UTF-8
```

혹시 안되면 아래 파일을 직접 수정하여 변경.

```text
sudo vi /etc/default/locale

LANG=ko_KR.UTF-8
LC_MESSAGE=POSIX
```

> #ubuntu #서버세팅 #locale #utf-8