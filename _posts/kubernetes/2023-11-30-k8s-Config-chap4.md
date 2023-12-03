---
layout: post
title: 쿠버네티스-Volume 기초 개념(EmptyDir, HostPath, PVC/PV)
date:   2023-11-29 10:00:00
categories: k8s
category : k8s
comments: true 
---

## 쿠버네티스-ConfigMap, Secret (Env, Mount)

어플리케이션을 구성 하는 경우 필요한 환경 변수(ex. dev, prod..) 등을 Container 로 전달 하기 위한 옵션 입니다.  

전달 받는 방법은 Env 와 Mount 방법이 있으며 각 성격은 아래와 같습니다.

> Env : Pod 생성 옵션에서 환경변수(key:value)를 입력하여 해당 Type 으로 전달 받을 수 있는 방법  
> Mount : 메모리 혹은 파일로 해당 설정 파일을 작성 하고 해당 파일을 마운트 하여 전달 받을 수 있는 방법

### configMap 

Key:value 타입으로 일반적인 상수들을 설정  

### secret 
Key:value 타입으로 설정 하지만 Base64 인코딩된 문자열을 사용 하므로 DB 접속 정보등 사용시 활용이 가능.

> secret은 Pod가 생성될때 인메모리 파일시스템(tmpfs)영역에 올려놓고 있다가 Pod가 삭제되면 지우기 때문에 보안에 유리 할 수 있음.

### Env(Literal)

Pod 생성시 옵션으로 Key:value 를 전달 하는 방법으로 ConfigMap, Secret 을 사용 할 수 있습니다.

```text

* ConfigMap 설정. 세팅값 : {ssh:false, user:dev}
apiVersion: v1
kind: ConfigMap
metadata:
  name: cm-dev
data:
  ssh: 'false'
  user: dev
  
--

* Secret 설정. 세팅값 : {key:MTIzNA==}
apiVersion: v1
kind: Secret
metadata:
  name: sec-dev
data:
  key: MTIzNA==      //base64 encoded 문자열로 입력
  
--

apiVersion: v1
kind: Pod
metadata:
  name: pod-1
spec:
  containers:
  - name: container
    image: test/init
    envFrom:
    - configMapRef:                 //configMap 설정
        name: cm-dev
    - secretRef:                    //secret 설정
        name: sec-dev

```

### Env(File)

실제 생성된 파일의 설정 값을 Pod내의 환경 변수로 전달받는다.

```text
* Master Node 에 파일을 생성 하고 해당 값을 configmap에 등록한다.
echo "Content" >> file-c.txt
kubectl create configmap cm-file --from-file=./file-c.txt

* Master Node 에 파일을 생성 하고 해당 값을 secret에 등록한다.
echo "Content" >> file-s.txt
kubectl create secret generic sec-file --from-file=./file-s.txt


* Pod 생성
apiVersion: v1
kind: Pod
metadata:
  name: pod-file
spec:
  containers:
  - name: container
    image: kubetm/init
    env:
    - name: file-c
      valueFrom:
        configMapKeyRef:        //ConfigMap 볼륨 설정
          name: cm-file
          key: file-c.txt
    - name: file-s
      valueFrom:
        secretKeyRef:           //secret 볼륨 설정
          name: sec-file
          key: file-s.txt

```


### Volume Mount(File)

configMap 과 secret을 Pod내의 디렉토리에 파일로 마운드 하는 방법

```text
* Master Node 에 파일을 생성 하고 해당 값을 configmap에 등록한다.
echo "Content" >> file-c.txt
kubectl create configmap cm-file --from-file=./file-c.txt

* Master Node 에 파일을 생성 하고 해당 값을 secret에 등록한다.
echo "Content" >> file-s.txt
kubectl create secret generic sec-file --from-file=./file-s.txt

* Pod 생성
apiVersion: v1
kind: Pod
metadata:
  name: pod-mount
spec:
  containers:
  - name: container
    image: kubetm/init
    volumeMounts:
    - name: file-volume
      mountPath: /mount
  volumes:
  - name: file-volume
    configMap:
      name: cm-file
    configMap:
      name: sec-file
```