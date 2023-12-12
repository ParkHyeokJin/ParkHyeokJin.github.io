---
layout: post
title: 쿠버네티스-Service 기초 개념(ClusterIP, NodePort, LoadBalancer)
date:   2023-11-28 10:00:00
categories: k8s
category : k8s
comments: true 
---

## 쿠버네티스-Service (ClusterIP, NodePort, LoadBalancer)

---

K8s 에서 Service는 Pod를 서비스로 노출 하기 위한 기능 입니다.  
Pod 는 K8s 클러스터 내에서 사용 할 수 있는 자신의 IP를 가지고 있지만 Pod는 K8s 환경에서 언제든지 삭제되고 재생성 될 수 있기때문에 IP가 언제든 바뀔수 있습니다.  
Service 는 사용자가 삭제 하기 전까진 설정된 아이피를 가지고 있고 해당된 Pod와 연결이 되기 때문에 서비스를 노출 하기 위해서는 서비스를 설정 해야합니다.

---
### ClusterIP
cluster 내에서 접근할때 사용되는 IP 입니다. 외부에서는 접근이 불가 하지만 Pod 끼리 통신은 가능한 아이피입니다.
* 용도 : 인가된 사용자(운영자) 페이지, 내부 대쉬 보드, Pod의 상태 디버깅 에 사용.

```text
예시) {ClusterIP}:9000 으로 접속 하면 Pod:8080 으로 접속 한다.

apiVersion: v1
kind: Pod
metadata:
  name: pod-1
  labels:
     app: pod
spec:
  nodeSelector:
    kubernetes.io/hostname: k8s-node1
  containers:
  - name: container
    image: test/app
    ports:
    - containerPort: 8080
    
---

apiVersion: v1
kind: Service
metadata:
  name: svc-1
spec:
  selector:
    app: pod
  ports:
  - port: 9000
    targetPort: 8080
```

---
### NodePort

노드에 유일한 포트를 생성 하여 노드포트 -> 서비스 포트 -> Pod포트 로 접근 하도록 설정합니다.
* 모든 노드에 해당 포트가 생성 됨.
* 포트 범위 (30000 ~ 32767)
* 용도 : 내부 통신 이나 임시로 외부로 시연 하는 경우 활용.

```text
예시) {NodeIP}:30000 으로 접속 하면 K8s 내부 에서 Service:9000 으로 Service 에서 Pod:8080 으로 접속 한다.

apiVersion: v1
kind: Pod
metadata:
  name: pod-1
  labels:
     app: pod
spec:
  nodeSelector:
    kubernetes.io/hostname: k8s-node1
  containers:
  - name: container
    image: test/app
    ports:
    - containerPort: 8080
    
---

apiVersion: v1
kind: Service
metadata:
  name: svc-1
spec:
  selector:
    app: pod
  ports:
  - port: 9000
    targetPort: 8080
    nodePort: 30000
  type: NodePort
  externalTrafficPolicy: Local
  
```

---
### LoadBalancer

LoadBalancer 는 NodePort를 외부로 상용 서비스 하기 위한 설정 입니다. 
LoadBalancer 는 외부 플러그인을 추가적으로 노출 시켜서 사용 해야 합니다. (AWS, Azure, GCP, OpenStack....)

```text
예시) {NodeIP}:30000 으로 접속 하면 K8s 내부 에서 Service:9000 으로 Service 에서 Pod:8080 으로 접속 한다.

apiVersion: v1
kind: Pod
metadata:
  name: pod-1
  labels:
     app: pod
spec:
  nodeSelector:
    kubernetes.io/hostname: k8s-node1
  containers:
  - name: container
    image: test/app
    ports:
    - containerPort: 8080
    
---

apiVersion: v1
kind: Service
metadata:
  name: svc-1
spec:
  selector:
    app: pod
  ports:
  - port: 9000
    targetPort: 8080
  type: LoadBalancer
  
```