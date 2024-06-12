---
layout: post
title: 쿠버네티스- Kube-Scheduler 개념
date:   2023-12-17 10:00:00
categories: k8s
category : k8s
comments: true 
---

## Kube-Scheduler

---
Kube-scheduler 은 Kubelet 이 파드를 실행 할 수 있도록 파드가 노드에 적합 한지 확인 해서 할당 하는 것 입니다.  
Kube-scheduler 는 파드가 실행 될 수 있는 최적의 노드에 파드를 배치 합니다.  


### Node label

---

노드에 레이블을 추가 해서 파드를 특정 노드 또는 노드 그룹에 스케쥴링 되도록 지정 할 수 있습니다. 이 기능을 통해서 특정 격리/보안/규제 속성을  
만족 하는 노드에서만 실행 하도록 합니다.

* 노드 라벨링
> kubectl label nodes k8s-node1 zone=antarctica-east1  
  kubectl label nodes k8s-node2 zone=antarctica-west1

#### Node Affinity - anti-affinity

---

노드 어피니티는 개념적으로 nodeSelector 와 비슷하며, 노드의 레이블을 기반으로 파드가 스케줄링될 수 있는 노드를 제한할 수 있다. 노드 어피니티에는 다음의 두 종류가 있다.

- requiredDuringSchedulingIgnoredDuringExecution: 규칙이 만족되지 않으면 스케줄러가 파드를 스케줄링할 수 없다. 이 기능은 nodeSelector와 유사하지만, 좀 더 표현적인 문법을 제공한다.
- preferredDuringSchedulingIgnoredDuringExecution: 스케줄러는 조건을 만족하는 노드를 찾으려고 노력한다. 해당되는 노드가 없더라도, 스케줄러는 여전히 파드를 스케줄링한다.

> 참고: 앞의 두 유형에서, IgnoredDuringExecution는 쿠버네티스가 파드를 스케줄링한 뒤에 노드 레이블이 변경되어도 파드는 계속 해당 노드에서 실행됨을 의미한다.

* required
  * 규칙이 만족 되지 않으면 파드가 생성 되지 않습니다. 이기능은 nodeSelector과 유사하지만 좀 더 표현적인 문법을 제공합니다.

```go
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: zone
            operator: In
            values:
            - antarctica-east1
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:2.0
```

* preferred
  * 조건을 만족 하는 노드를 찾으려고 노력하지만 해당 노드가 없더라도 파드를 생성 합니다.

```go
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: another-node-label-key
            operator: In
            values:
            - another-node-label-value
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:2.0
```

