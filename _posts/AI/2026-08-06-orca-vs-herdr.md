---
layout: post
title: Orca vs herdr, AI Agent 시대의 새로운 IDE(ADE)
date:   2026-08-05 10:00:00
categories: AI
category : AI
comments: true
---

### 들어가며

요즘 여가 시간이 조금 생겨 이것저것 신문물(?)을 따라가 보고 있습니다.

최근 AI Agent 개발이 본격화되면서, IDE(Integrated Development Environment)에서 한 단계 더 나아간 **ADE(Agentic Development Environment)** 라는 개념이 등장하고 있습니다. 코드를 편집하는 환경이 아니라 **여러 AI Agent를 실행하고 운영하는 환경**입니다.

그중 최근 제가 직접 비교해 본 두 도구가 **Orca**와 **herdr**입니다. 며칠 동안 사용해 보면서 느낀 점을 간단하게 정리해 보았습니다.

> **📌 표기와 시점에 대해**
> 이 글의 Orca는 Stably AI의 [stablyai/orca](https://github.com/stablyai/orca)를, herdr는 [herdr.dev](https://herdr.dev)를 가리킵니다. (공식 표기는 대문자 ORCA가 아닌 Orca, 소문자 herdr입니다.)
> 내용은 **2026년 8월 기준**이며, 두 제품 모두 빠르게 업데이트되고 있어 세부 기능은 달라질 수 있습니다.

<br>

### 한눈에 비교

|구분|Orca|herdr|
|---|---|---|
|철학|AI 개발팀 운영|AI 실행 환경|
|무게 중심|Orchestration|Runtime|
|UI|GUI (데스크톱 앱)|Terminal(TUI)|
|강점|worktree 병렬 실행, diff 리뷰, 작업 조율|세션 영속성, 원격 attach, 상태 인지|
|추천|GUI에서 작업 분배·리뷰까지 하고 싶은 개발자|터미널/SSH 중심 개발자|

미리 말해두면, 이 표는 **강조점의 차이**이지 배타적인 분류는 아닙니다. Orca도 SSH 원격 worktree를 지원하고, herdr도 CLI·Socket API로 에이전트 자동화를 지원합니다. 기능 영역은 생각보다 많이 겹칩니다.

<br>

### Orca — AI 개발팀처럼 운영하는 ADE

Orca는 GUI 데스크톱 앱 형태의 ADE입니다. Claude Code, Codex, Gemini CLI 등 여러 CLI 에이전트를 **각각 격리된 git worktree에서 병렬로 실행**하고, 결과 diff를 비교·주석·머지까지 한 화면에서 처리합니다.

- GUI 기반이라 기존 IDE 사용자는 적응하기 쉽습니다 (파일 탐색, 내장 소스 제어)
- worktree 단위로 에이전트를 격리해 서로 간섭 없이 병렬 작업
- diff 리뷰와 주석, 승인 후 머지까지 이어지는 워크플로우

가장 인상 깊었던 부분은 **Orchestration 기능**입니다.

Orca에서는 `orchestration` 스킬을 통해 coordinator 역할의 에이전트가 하나의 작업을 나누어 worker 에이전트들에게 dispatch하고, Task DAG와 decision gate로 전체 흐름을 조율할 수 있습니다. 역할 구성은 고정된 것이 아니라 사용자가 설계하는데, 예를 들어 로그인 기능 하나를 이렇게 구성할 수 있습니다.

```
Planner → Coder → Tester → Reviewer
```

각 에이전트가 서로 다른 역할을 수행하고, coordinator가 결과를 모아 하나의 작업으로 완성하는 구조입니다.

개인적으로는 기존 Prompt Engineering에서 한 단계 발전한, [이전 글에서 다룬 Graph Engineering](/ai/2026/08/04/graph-engineering.html)을 제품으로 구현해 놓은 것에 가깝다는 느낌을 받았습니다.

<br>

### herdr — 에이전트를 위한 터미널 멀티플렉서

반대로 herdr는 조금 다른 철학을 가지고 있습니다. tmux 같은 터미널 멀티플렉서를 사용해 본 분이라면 훨씬 익숙하게 느껴질 것 같습니다.

herdr는 GUI보다는 **Terminal 기반 Runtime**에 집중합니다. 백그라운드 세션 서버와 TUI 클라이언트가 분리된 구조로, 여러 AI Agent를 하나의 세션 안 **독립된 pane**에서 실행하고 다음을 안정적으로 지원합니다.

- SSH 원격 사용 (서버에서 직접 실행하거나 `herdr --remote`로 로컬에서 attach)
- detach / attach — 터미널을 닫아도 서버가 살아 있는 동안 에이전트는 계속 실행
- named session 단위의 영속적 세션 관리
- tmux에는 없는 **에이전트 상태 인지** — 각 에이전트의 working / blocked / idle 상태를 자동 감지해 사이드바에 표시

즉, AI에게 일을 "분배"하는 것보다는 **AI가 오래 안정적으로 일할 수 있는 환경을 제공**하는 데 초점이 맞춰져 있습니다. (herdr에도 Socket API 기반 자동화가 있지만, 중심 인터페이스는 어디까지나 터미널과 세션입니다.)

<br>

### 가장 큰 차이

두 제품을 비교하면서 가장 크게 느낀 차이는 **무게 중심**이었습니다.

#### Orca는 "오케스트레이션"

```
          Coordinator
               │
     ┌─────────┼─────────┐
 Planner     Coder     Tester
               │
           Reviewer → Merge
```

AI를 하나의 개발팀처럼 운영합니다.

#### herdr는 "멀티플렉싱"

```
Session
   ├─ Agent A (pane 1)
   ├─ Agent B (pane 2)
   ├─ Agent C (pane 3)
   └─ Agent D (pane 4)
```

AI를 여러 개 실행하고 안정적으로 유지하는 것이 목적입니다.

비유하자면 Orca가 **회사(조직 운영)** 라면, herdr는 **사무실(작업 환경)** 에 가깝습니다.

<br>

### 그래서 어떤 걸 선택하면 될까?

제 기준의 추천은 이렇습니다.

#### Orca
- GUI에서 작업 생성부터 diff 검토까지 통합해서 하고 싶은 경우
- 역할 분담과 협업이 필요한 프로젝트
- 여러 Agent를 하나의 워크플로우로 조율하고 싶은 경우

#### herdr
- 기존 터미널 중심의 개발 흐름을 유지하고 싶은 경우
- SSH 접속이 많은 개발자
- Linux 서버에서 AI Agent를 장시간 실행하는 환경 (Windows 지원은 아직 beta입니다)
- 여러 Agent를 독립적으로 운영하고 싶은 경우

다만 이 선택이 꼭 **양자택일은 아닙니다.** Orca가 일을 분배하고(오케스트레이션), herdr가 원격 서버에서 그 에이전트들을 안정적으로 유지하는(멀티플렉싱) 조합도 충분히 가능합니다. 두 제품은 경쟁 관계라기보다 서로 다른 레이어를 담당하는 쪽에 가깝습니다.

<br>

### 마치며

많은 사람들이 Orca와 herdr를 경쟁 제품처럼 비교하지만, 실제로 써 보면 핵심 사용 경험의 우선순위가 다릅니다. Orca는 "AI 개발팀"을 만드는 도구에, herdr는 "AI 작업환경"을 만드는 도구에 가깝습니다.

IDE가 **코드를 편집하는 환경**이었다면, ADE는 **Agent를 운영하는 환경**입니다. Orca와 herdr는 그 환경을 서로 다른 레이어에서 구현한 사례라고 생각합니다.

특히 Orca의 오케스트레이션 기능을 써 보면서, AI 모델 자체의 성능 경쟁을 넘어 **"여러 Agent를 얼마나 효율적으로 협업시키는가"** 가 앞으로의 생산성을 결정하겠다는 생각이 들었습니다. 이전 글에서 다룬 Graph Engineering, Workflow Engineering 같은 설계 관점이 Prompt Engineering만큼 중요한 키워드가 되지 않을까 기대하고 있습니다.

> **한 줄 요약**
> Orca는 AI 개발팀을 운영하는 오케스트레이션 도구이고, herdr는 AI Agent가 오래 일할 수 있게 하는 런타임 도구다.
> **둘은 경쟁이 아니라, ADE라는 같은 방향을 서로 다른 레이어에서 구현하고 있다.**

<br>

#### 참고 자료

- [Orca 공식 사이트](https://www.onorca.dev/) / [GitHub (stablyai/orca)](https://github.com/stablyai/orca)
- [Orca Docs — Orchestration](https://www.onorca.dev/docs/cli/orchestration) — coordinator/worker, Task DAG, decision gate
- [herdr 공식 사이트](https://herdr.dev) / [Docs — Persistence and remote access](https://herdr.dev/docs/persistence-remote/)
- [herdr Docs — Socket API](https://herdr.dev/docs/socket-api/)
- (이전 글) [Prompt에서 Graph까지 — AI 에이전트 설계의 새로운 이름, Graph Engineering](/ai/2026/08/04/graph-engineering.html)
