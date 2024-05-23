---
layout: post
title: SpringCloud - Service mesh
date:   2024-05-22 10:00:00
categories: Spring
category : Spring
comments: true 
---

## MSA 서비스 관리의 필요성 증가

프로젝트를 진행 하면서 다양한 서비스들을 만들게 되고 MSA 환경으로 작은 단위의 서비스가 분산 되는 형태로 구성 되다 보니  
점점 관리의 필요성이 생깁니다.

하나의 서비스를 만들더라도 인증서버, 수신서버, 처리서버, 외부통신서버 등등 분산이 되게 되고 각각의 서비스의 상태 관리  
자원관리 로깅, 미터링, 정산 등등 다양한 기능들이 필요합니다.

점점 증가하는 마이크로 서비스들의 통신을 관리 하고 모니터링 하기 위해 서비스 메시가 필요합니다.

## Service Mesh

서비스 메시란? 어플리케이션 서비스간에 모든 통신을 처리하는 소프트웨어 계층을 말합니다.  
어플리케이션에 사이드카로 연결 되어 어플리케이션 관리, 라우팅, 장애, 인증/인가, 모니터링 등 기능을 제공 합니다.

* 서비스 메시

  ![Service Mesh](https://github.com/ParkHyeokJin/CodingTestRepo/assets/19565772/93aaf7c2-f73c-415b-a056-eb72c3ec281a){: width="50%" height="50%"}


* 주요 기능
   * 서비스 검색 : 엔드포인트를 동적으로 관리 하고 추적
   * 로드 벨런싱 : 다양한 알고리즘을 사용하여 여러 서비스 인스턴스에 분산 처리
   * 트래픽 관리 : 요청 트래픽을 컨트롤 하고 관리
   * 보안 : 서비스 인증 및 권한을 관리
   * 모니터링 및 추적 : 서비스간 통신을 모니터링 하고 추적 하여 성능 분석 및 오류 분석


* 다양한 서비스 메시 기술

  ![Service Mesh Stack](https://github.com/ParkHyeokJin/CodingTestRepo/assets/19565772/7448f5d9-12a1-4833-a076-4e5ebda6b03b){: width="50%" height="50%"}

## SpringCloud Project

프로젝트에서 서비스 메시를 구성하기 위해 다양한 기술들을 비교 하였고 후보군으로 envoy 와 SpringCloud-Gateway 비교 하였고 최종적으로는 SpringCloud Stack으로 선정.

* 비교

| 특징      | 	Envoy	                                           | Spring Cloud Gateway               |
|---------|---------------------------------------------------|------------------------------------|
| 언어      | 	C++                                              | 	Java                              |
| 성능      | 	매우 높음                                            | 	적당함                               |
| 설정 및 구성 | 	YAML, 동적 API                                     | 	YAML, Java 코드                     |
| 주요 통합   | 	Istio, 서비스 메쉬                                    | 	Spring Boot, Spring Cloud         |
| 로드 밸런싱  | 	고급 기능                                            | 	기본 기능 (Spring Cloud LoadBalancer) |
| 확장성     | 	필터, 플러그인                                         | 	커스텀 필터, 프레디케이트                    |
| 관찰 가능성  | 	고급 모니터링 및 로깅                                     | 	기본 모니터링 (Spring Boot Actuator)    |
| 사용 사례   | 	대규모 마이크로서비스, 고성능 요구                              | 	Spring 애플리케이션, 간단한 API Gateway    |
| 지원 프로토콜 | http/1.1 , http/2, websocket, gRpc, tcp, udp .... | http/1.1, http/2, gRpc, websocket  |
| LB      | L3, L4, L7                                        | ㅣL4, L7                            |
  

* SpringCloud Architecture

![SpringCloud Architecture](https://github.com/ParkHyeokJin/CodingTestRepo/assets/19565772/e070ec12-cd00-46ef-a818-04333437d990){: width="50%" height="50%"}

* 스프링 클라우드 기술 스택 매핑
  
| 역할                      | 프로젝트                                     |
|-------------------------|------------------------------------------|
| configuration| SpringCloud-Config & Bus                                         |
| Service discovery       | SpringCloud-Eureka                       |
| load Balancing, Routing | SpringCloud-Gateway                      |
| Resiliency              | SpringCloud-CircuitBreaker               |
| Security , AuthN/AuthZ  | SpringCloud-Security, SpringCloud-vault  |
| Instrumentation              | Spring-Actuator                          |

## 샘플 프로젝트

### 목표

스프링 클라우드 기능을 최소 단위로 테스트 해보고 업데이트 하기 위함.  
샘플 프로젝트에서는 Gateway, Eureka 를 사용하여 라우팅하고 필터링을 테스트 해보기 위한 구성으로 되어있음.

### 환경

* SpringBoot 3.2.5
   * spring-cloud-starter-gateway
   * spring-cloud-starter-netflix-eureka-server
   * spring-cloud-starter-netflix-eureka-client
   * spring-cloud-circuitbreaker-resilience4j
* Java 17+
* Gradle 8.7+
* Github : https://github.com/ParkHyeokJin/spring-cloud-sample

### 기능 구성 목표

* 아키텍처

![](https://github.com/ParkHyeokJin/spring-cloud-sample/assets/19565772/6c47f69e-08cb-46b0-a0f2-517e555ab2ac){: width="50%" height="50%"}



