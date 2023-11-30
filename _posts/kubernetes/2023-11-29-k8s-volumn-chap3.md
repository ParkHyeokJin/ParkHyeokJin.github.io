---
layout: post
title: 쿠버네티스-Volume 기초 개념(EmptyDir, HostPath, PVC/PV)
date:   2023-11-29 10:00:00
categories: k8s
category : k8s
comments: true 
---

## 쿠버네티스-Volume (EmptyDir, HostPath, PVC/PV)

K8s 에서 Volume 은 각 파드에 스토리지를 연결하여 전략적으로 구성 하는 기능 입니다.

### EmptyDir

Pod 내에 서만 사용 할 수 있는 볼륨 영역 입니다. 해당 볼륨은 Pod 내에서 사용 할 수 있고 Pod 내의 컨테이너 간에는 공유가 가능 합니다.  
다만 Pod가 삭제 되면 함께 삭제 되는 영역 이므로 주의 해야 합니다.


```text

예시) emptry-dir 를 생성 하여 container1 과 container2 에 각각 /mount1,2 디렉토리로 마운트를 하여 해당 볼륨을 사용하도록 구성 

apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-1
spec:
  containers:
  - name: container1
    image: test/init
    volumeMounts:
    - name: empty-dir
      mountPath: /mount1
  - name: container2
    image: test/init
    volumeMounts:
    - name: empty-dir
      mountPath: /mount2
  volumes:
  - name : empty-dir
    emptyDir: {}
```

### HostPath
HosPath 볼륨은 단일 노드에서만 공유 되는 영역 입니다. Node Path 로 생성 되기 때문에 Pod 가 삭제 되어도  
유지 할 수 있지만 다른 노드에는 공유 할 수 없습니다.

> 활용 : 각 노드 별로 설정 되어야하는 시스템 정보 혹은 환경 변수 설정시 활용

```text

예시) node 에 /node_v 볼륨을 생성 하여 container 의 /mount1 디렉토리로 마운트 하여 사용

apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-3
spec:
  nodeSelector:
    kubernetes.io/hostname: k8s-node1
  containers:
  - name: container
    image: test/init
    volumeMounts:
    - name: host-path
      mountPath: /mount1
  volumes:
  - name : host-path
    hostPath:
      path: /node-v
      type: DirectoryOrCreate
```


### PVC(Persistent Volume Claim) / PV(Persistent Volume)

Pvc 와 Pv 는 외부 스토리지(Aws, Azure, nfs) 등을 사용 하여 K8s(Admin) 이 미리 외부 스토리지를 연결 및 구성을 하고 

구성된 외부 스토리지 볼륨 내에서 할당 받아 사용 하는 볼륨 입니다. 그래서 Pvc는 유저 영역 Pv는 Admin 영역으로 나누어 관리 됩니다.

외부 스토리지를 사용 하기 때문에 노드별 공유가 가능 하고 데이터베이스 저장소 등에 활용이 가능합니다.

```text

* PV

예시) 2G의 외부 스토리지를 생성 하여 PV 구성을 함.

apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-01
spec:
  capacity:
    storage: 2G
  accessModes:
  - ReadWriteOnce
  local:
    path: /node-v
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - {key: kubernetes.io/hostname, operator: In, values: [k8s-node1]}

---

* PVC

예시) 구성된 PV 볼륨 내에서 1G의 스토리지를 사용 하도록 구성 함.

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-01
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1G
  storageClassName: ""

---

* POD

예시) 생성된 PVC 볼륨(pvc-01)을 POD 에 설정 하여 /mount1 디렉토리로 마운트 함.

apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-1
spec:
  containers:
  - name: container
    image: test/init
    volumeMounts:
    - name: pvc-pv
      mountPath: /mount1
  volumes:
  - name : pvc-pv
    persistentVolumeClaim:
      claimName: pvc-01

```