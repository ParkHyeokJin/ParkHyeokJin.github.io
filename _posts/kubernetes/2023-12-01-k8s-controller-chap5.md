---
layout: post
title: 쿠버네티스-WorkLoads 개념(ReplicaSet)
date:   2023-12-02 10:00:00
categories: k8s
category : k8s
comments: true 
---

## ReplicaSet

---
ReplicaSet 설정 한 Pod 의 목표 숫자 만큼 Template 에 설정 된 Pod 를 생성 하고 축소 합니다.

ReplicaSet 은 아래와 같은 기능을 제공 합니다.

* Auto Healing
  * Pod 에 문제가 발생 했을 경우 복구를 합니다.
* Auto Scaling
  * Pod 를 추가 할 수 있습니다.
* Software Update
  * Pod 의 버전을 관리 할 수 있습니다.

---
### ReplicaSet 생성

- Pod Replica(.spec.replicas)
  - 설정된 갯수 만큼 Pod 를 생성하고 관리 합니다. 해당 숫자를 변경 하여 scale out/in 할 수 있습니다.

- Pod Template(.spec.template)
  - ReplicaSet 에서 사용 될 Pod의 템플릿을 설정 합니다.

- Pod Selector(.spec.selector)
  - Pod 에 설정된 Label 을 식별 하여 Pod를 그룹 관리 할 수 있습니다.

```text
 * 예시 : php-redis 를 replicas 에 설정된 숫자(3) 만큼 pod를 생성 한다.

apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # modify replicas according to your case
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
```