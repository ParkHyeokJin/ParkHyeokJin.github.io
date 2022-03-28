---
layout: post
title: Github에 commmit 을 했는데 잔디가 없다!? 
date:   2022-03-24 10:00:00
categories: others
category : others
comments: true 
---

## Github 에 잔디가 없을때 대처 방법
--------

생각지도 않았습니다. 잔디가 생기지 않고 있을 줄은 ..  

커밋을 했는데 잔디가 생기지 않는 경우를 위해 정리 합니다.  

#### user.email 확인

github에 잔디가 생기지 않는 경우는 github email 과 commit 한 email 정보가 틀린 경우 발생 할 수 있습니다.  

user.email 확인 방법은 아래와 같습니다. (프로젝트 폴더 내에서 실행 하세요.)

> git config --list

출력된 설정 정보 중에서 user.email 정보가 github에 등록된 email과 정보가 맞는지 확인을 합니다.  

이메일이 다른경우 이메일 변경을 해주어야 합니다.  

> git config user.email "email@gmail.com"

모든 프로젝트에 적용할 경우 아래와 같이 --global 옵션을 추가 합니다.  

> git config --global user.email "email@gmail.com"


#### commit 정보 수정하기

1) 프로젝트 시작부터 모든 커밋이 잘못 되어 있는 경우

> git rebase -i --root 

2) 프로젝트 중간부터 커밋이 잘 못 되어 있는 경우

프로젝트가 중간부터 커밋이 잘 못 되어있는 경우에는 시작부분을 지정하여 커밋을 수정 하면 됩니다

아래와 같은 명령어를 통해서 시작 지점을 찾거나 IDE 에서 github 로그에서 hash 값을 찾아도 됩니다.

> git log --pretty=format:"%h = %an , %ar : %s" --graph

![img.png](=업무폴더=/source/ParkHyeokJin.github.io/img/github/git-rebase-img4.png)

커밋이 잘못 된 부분의 바로 앞단계 커밋 해시 값을 찾은 다음에 아래 명령어를 통해서 수정 하면 됩니다.

> git rebase -i -p 해시코드

```text
pick 267635c first commit
pick 966ac2a source 경로 변경
pick 6bd3c3d add debug logger
pick 95e35d5 add debug logger
pick c1a88ee add debug logger
....
```

커밋된 내역들이 출력 되며 pick -> edit 로 수정하여 저장(:wq!) 합니다

```text
edit 267635c first commit
edit 966ac2a source 경로 변경
edit 6bd3c3d add debug logger
edit 95e35d5 add debug logger
edit c1a88ee add debug logger
....
```

위 처럼 수정 하면 됩니다. 수정이 완료 된 후 저장하고 나오면 아래와 같은 출력을 볼 수 있습니다.

![git rebase img1](=업무폴더=/source/ParkHyeokJin.github.io/img/github/git-rebase-img1.png)

이제부터 커밋한 내용에 대해 커밋 이메일을 설정 해주어야 합니다.

> git commit --amend --author="name <email@gmail.com>"

위 명령어를 통해서 커밋 네임과 이메일을 설정을 하게 되면 아래와 같은 메시지를 볼 수 있습니다. 

![git rebase img2](=업무폴더=/source/ParkHyeokJin.github.io/img/github/git-rebase-img2.png)

해당 부분에서는 별다른 수정 사항 없이 저장(:p) 하고 나오면 됩니다.

다음 rebase 처리를 위해서 아래 명령어를 통하여 다음 커밋으로 이동합니다.

> git rebase --continue

이 과정을 edit 로 변경하고자 하는 commit 갯수 만큼 반복 해야 합니다. 아래 메시지가 보일때까지...  

> Successfully rebased and updated refs/heads/master.

이제 설정하고자 했던 모든 커밋에 rebase를 완료 하였으니 커밋을 합니다.

> git push origin +master

![git rebase img3](=업무폴더=/source/ParkHyeokJin.github.io/img/github/git-rebase-img3.png)


> #ubuntu #서버세팅 #locale #utf-8