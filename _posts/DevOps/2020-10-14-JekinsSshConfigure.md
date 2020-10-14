---
layout: post
title: 젠킨스 서버 SSH Key 생성 & 등록
date:   2020-10-14 10:10:00
categories: DevOps
category : DevOps
comments: true 
---

젠킨스 SSH 연결을 위한 SSH Key 생성 및 설정에 대한 기록 입니다.

### Jenkins Plugins

Jenkins 관리 > 플러그인 관리 > 설치 가능

- Publish Over SSH
- Git
- Github
- Github API
- Maven Integration

### SSH Key 생성 하

배포 서버에서 타겟서버로 배포 하기 위해서는 배포서버(Jenkins Server) 의 SSH KEY 가 필요합니다.

```shell script
$ cd ~/.ssh
$ pwd
/home/deploy/.ssh
$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/deploy/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/deploy/.ssh/id_rsa.
Your public key has been saved in /home/deploy/.ssh/id_rsa.pub.
...
# 생성된 key 확인
$ ls
authorized_keys  id_rsa  id_rsa.pub
```


### 타겟서버 Key 등록 하기

배포서버에서 생성된 id_rsa.pub(Public Key) 의 내용을 복사하여 타겟 서버의 ~/.ssh/authorized_keys 파일을 vim 으로 열어 key 내용을 붙여 넣습니다.

```shell script
$ vim ~/.ssh/authorized_keys
```

### Jenkins SSH Key 등록하기

Jenkins 관리 > 시스템 설정 > Publish over SSH

![jenkins SSH Configure](/img/jenkins/jenkinsSSHInput.png){: width="90%" height="90%"}

이후 SSH Server 설정에 정보를 입력하고 Test Configuration 을 하면 접속 성공을 확인 할 수 있다.