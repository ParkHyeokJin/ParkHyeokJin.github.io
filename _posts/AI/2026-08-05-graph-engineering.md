---
layout: post
title: Prompt에서 Graph까지 — AI 에이전트 설계의 새로운 이름, Graph Engineering
date:   2026-08-04 10:00:00
categories: AI
category : AI
comments: true
---

### 들어가며 — 또 새로운 Engineering이 나왔다

요즘 AI Agent 관련 글을 보다 보면 이런 이야기가 반복됩니다.

> "Prompt Engineering은 끝났다."
> "이제는 Context Engineering 시대다."
> "아니, 진짜는 Loop Engineering이다."

그리고 최근에는 **Graph Engineering**으로 넘어가고 있다는 이야기가 들립니다.

도대체 Graph Engineering이 무엇일까요? 새로운 기술일까요? 새로운 프레임워크일까요?

결론부터 말하면 **둘 다 아닙니다.**

> Graph Engineering은 최근 주목받기 시작한 이름이지만, 그 아래에 있는 Workflow·상태 머신·Routing·병렬 처리·재시도 패턴은 오래전부터 사용돼 왔습니다.
> Anthropic은 이미 2024년 [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) 글에서 prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer 같은 구조를 구분해 소개했습니다.
> **이름은 새로울 수 있지만, 구조는 새롭지 않습니다.** 흩어져 있던 개념들을 하나의 설계 언어로 묶어 부르기 시작한 것에 가깝습니다.

한 가지 범위를 먼저 분명히 하겠습니다. 이 글에서 말하는 Graph Engineering은 Knowledge Graph(지식 그래프) 구축이 아니라, **Agentic System의 실행 흐름을 그래프로 설계하는 최근의 용례**를 뜻합니다.

그리고 흔히 Prompt → Context → Loop → Graph 순으로 "새로운 시대가 열렸다"고 말하지만, 실제로는 앞 단계가 사라진 것이 아닙니다. 이들은 앞 개념을 대체하는 세대 구분도, 서로 완전히 분리된 기술 계층도 아닙니다. **AI 시스템을 서로 다른 범위에서 바라보는 설계 관점**에 가깝습니다.

| 설계 관점 | 주로 다루는 질문 |
|------|------------|
| **Prompt** | 개별 모델 호출에 어떤 지시를 줄 것인가 |
| **Context** | 이번 호출에 어떤 정보를 보여줄 것인가 |
| **Loop** | 완료 조건까지 어떻게 반복할 것인가 |
| **Graph** | 실행 단위들의 상태·분기·의존 관계를 어떻게 명시할 것인가 |
| **Harness** | 모델이 어떤 Loop·도구·컨텍스트·권한 환경에서 Agent로 작동하는가 |
| **Runtime** | 정의된 실행을 어떻게 스케줄링·저장·복구·관측할 것인가 |

이 글의 핵심 문장을 미리 적어두겠습니다.

> **💡 Prompt는 AI에게 무엇을 할지 알려주고, Loop는 작업이 언제까지 반복될지를 정의하며,
> Graph는 에이전트·도구·사람이 어떤 관계와 흐름으로 협업할지를 설계한다.**

이 글에서는 유행어로서의 Graph Engineering이 아니라, 복잡한 Agent 시스템을 설계하기 위해 **무엇을 그래프로 표현해야 하는지**를 살펴봅니다.

> 이 글은 [2026년 AI 에이전트의 핵심, 하네스 엔지니어링](/ai/2026/05/15/harness-engineering.html)의 후속편 격입니다.
> "그래서 Graph가 내가 이미 만들고 있는 Harness + Workflow랑 뭐가 다른데?" — 아마 가장 궁금하실 이 질문은 본문 중반에 별도 장으로 정리합니다.

<br>

### Prompt에서 Loop까지 — AI가 한 번의 답변을 넘어 반복하기 시작했다

Prompt Engineering 시절의 구조는 단순했습니다.

```
Human → LLM → Answer
```

한 번 호출하고 끝났습니다. 좋은 질문을 만드는 것이 곧 좋은 결과를 만드는 길이었죠.

하지만 Agent는 다릅니다.

![AI Agent Loop - Observe, Think, Tool, Evaluate, Repeat](/img/ai/agent-loop.png){: width="35%"}

Agent는 **반복합니다.** 관찰하고, 판단하고, 도구를 쓰고, 결과를 평가한 뒤 다시 반복합니다.
이 반복 — 종료 조건, 재시도 한도, 자기 교정 — 을 설계하는 것이 **Loop Engineering**입니다. 여기까지는 대부분 이해하고 계실 겁니다.

다만 다음 장으로 넘어가기 전에, 자주 뭉뚱그려지는 개념 두 쌍을 구분해 두겠습니다.

> **📌 Workflow vs Agent (Anthropic의 구분)**
> - **Workflow**: 사전에 정의한 코드 경로를 따라 LLM과 도구를 오케스트레이션하는 시스템
> - **Agent**: LLM이 자신의 진행 과정과 도구 사용을 **동적으로** 결정하는 시스템
>
> **📌 Graph ≠ Multi-Agent**
> Graph는 실행 흐름을 표현하는 **구조**입니다. Node가 Agent일 수도 있지만, 일반 함수나 도구일 수도 있습니다.
> 어떤 Graph는 대부분 결정론적 Workflow이고, 특정 Node에서만 Agent가 자율적으로 움직입니다.

즉 "Workflow냐 Agent냐"와 "Loop냐 Graph냐"는 **서로 다른 분류 축**입니다. 이 구분이 뒤에서 계속 중요해집니다.

<br>

### 경계 없는 하나의 Loop가 모든 책임을 떠안는 순간

실제 업무는 이렇게 흘러갑니다.

```
리서치 → 기획 → 개발 → 리뷰 → 테스트 → 배포
```

이 모든 것을 **Loop 하나**가 수행하면 어떤 일이 생길까요.

| 문제 | 증상 |
|------|------|
| **Prompt 비대화** | 하나의 지시문에 여러 역할과 예외 처리가 계속 누적된다 |
| **Context 간섭** | 앞 단계의 정보가 뒤 단계의 판단을 방해한다 (context interference) |
| **비용 증가** | 긴 히스토리와 반복 호출이 누적된다 |
| **관측성 저하** | 어느 단계의 어떤 판단에서 오류가 생겼는지 분리하기 어렵다 |
| **책임 혼재** | 생성·검증·실행의 책임이 한 Agent에 몰린다 |

백엔드 개발자라면 익숙한 그림일 겁니다. 처음엔 작았던 클래스가 요구사항이 붙을 때마다 메서드가 늘어나더니, 어느새 모든 걸 다 하는 **God Object**가 되어 있는 상황과 똑같습니다.

물론 Loop 자체가 문제는 아닙니다. 내부를 함수와 모듈로 잘 나누고 Context를 관리하면 단일 Loop도 충분히 건전할 수 있습니다. 문제는 **경계 없이** 하나의 Loop가 너무 많은 책임을 가지는 순간입니다.

그리고 책임만 섞이는 것이 아닙니다. **실패 처리도 하나의 "다시 시도해"로 뭉쳐지기 쉽습니다.** 테스트 실패의 원인은 코드 버그일 수도, 모호한 요구사항일 수도, 외부 API 장애·깨진 테스트 환경·부족한 권한일 수도 있습니다. 서로 다른 원인을 같은 Retry로 처리하면 — 외부 서버가 죽었는데도 Agent는 계속 코드를 고치고, 스펙이 잘못됐는데도 같은 테스트를 반복 실행합니다. 이 실패 유형들을 어떻게 서로 다른 실행 경로로 바꾸는지는, Graph의 문법을 정의한 뒤에 다시 살펴보겠습니다.

객체지향에서 이런 문제의 처방이 **단일 책임 원칙(SRP)** 이었듯이, Agent 시스템에도 같은 처방이 필요합니다. 그 처방의 이름이 Graph Engineering입니다.

<br>

### Loop는 끝나지 않았다 — Graph 안의 순환 구조가 된다

여기가 이 글의 핵심입니다.

많은 사람들이 "Loop를 버리고 Graph를 쓴다"고 생각합니다. 그런데 **아닙니다.**

먼저 Graph를 아주 거칠게 정의하면 이렇습니다 — **실행 단위(Node)를 흐름(Edge)으로 연결한 것.** (엄밀한 정의는 다음 장에서 다룹니다.)

이 관점에서 보면 Loop는 사라지는 것이 아니라, Graph 안에서 두 가지 모습으로 살아남습니다.

1. **순환 경로(Cyclic Path)** — Edge가 앞선 Node로 되돌아가는 구조. 예를 들어 "테스트 실패 → 다시 코드 수정"이 여기에 해당합니다.
2. **Subgraph 캡슐화** — 자체 반복을 수행하는 Agent Loop 전체를 하나의 Node로 감싸는 구조. Node 바깥에서 보면 하나의 실행 단위지만, 안에서는 작은 Loop가 돌고 있습니다.

그림으로 보면 이렇습니다. 일부 Node는 결정론적 함수이고, 일부 Node만 자율적인 Agent Loop를 가집니다.

![Graph 안의 Loop - Research Agent Subgraph, Planner Function, Code Agent와 Test의 순환 경로, Docs Update, Human Approval](/img/ai/loop-in-graph.png){: width="28%"}

그래서 이렇게 기억하면 됩니다.

> **💡 Loop는 Graph의 반대말이 아니다. Loop는 Graph가 가질 수 있는 모양 중 하나다.**
>
> - Graph가 Loop를 **대체**하는 것이 아니다.
> - Loop는 Graph 내부의 **순환 경로**, 또는 Node로 캡슐화된 **Subgraph**다.
> - 복잡한 Agentic System은 결정론적 Workflow, 동적으로 판단하는 Agent, 반복 경로, 사람의 개입을 **하나의 실행 그래프로 조합**한 것이다.

비유하자면 이것은 하나의 거대한 메서드를 **작은 함수들과 명시적인 상태 전이로 분해**하는 것에 가깝습니다. MSA와 닮은 점은 책임 경계를 나눈다는 것뿐이고, 배포 단위까지 분리한다는 뜻은 아닙니다. Graph의 Node들은 같은 프로세스 안에서 실행될 수 있습니다.

<br>

### Graph의 문법 — Node, Edge, State

이제 정확한 정의를 살펴보겠습니다. Graph Theory에서 Graph는 Node(정점)와 Edge(간선)로 구성됩니다. Agentic System에서는 여기에 State가 더해져, 흔히 **Stateful Workflow Graph**라고 부르는 형태가 됩니다.

| 요소 | Graph Theory | AI 시스템에서는 |
|------|-------------|----------------|
| **Node** | 정점 | LLM Agent, 일반 모델 호출, Python 함수, API 호출, 테스트 명령, 검색 도구, 사람의 승인, 조건 검사 |
| **Edge** | 간선 | 순차 실행, 조건 분기, 병렬 실행, 앞 Node로 되돌아가는 순환 경로(Loop) |
| **State** | — | Graph가 실행되는 동안 Node 사이에 전달되는 구조화된 작업 상태 |

주목할 점은 **Node가 Agent에 한정되지 않는다**는 것입니다. Graph Engineering을 "멀티 에이전트를 만드는 기술"로 이해하면 범위를 너무 좁게 잡은 것입니다. Node는 **이질적인 실행 단위 전부**입니다.

State는 예를 들면 이런 필드들로 구성됩니다.

```
request          # 원래 요청
plan             # 수립된 계획
research_results # 조사 결과
code_changes     # 변경된 코드
test_result      # 테스트 결과
review_status    # 리뷰 상태
retry_count      # 재시도 횟수
```

여기서 Context와 State를 구분해 두면 좋습니다.

> **📌 Context vs State**
> Context가 모델에게 **현재 보여주는 정보**라면, State는 Workflow가 **현재 어디까지 진행됐고 무엇을 생성했는지**를 기록하는 실행 데이터입니다.
> 둘은 겹치지만 같은 개념이 아닙니다. 각 Node는 State에서 자신에게 필요한 부분만 꺼내 자신의 Context를 구성합니다. 이것이 앞 장의 "Context 간섭" 문제를 푸는 열쇠입니다.

개념이 눈에 보이도록 코드로 표현하면 이렇습니다. (LangGraph는 이 방법론의 구현체 중 **하나**일 뿐입니다.)

```python
from langgraph.graph import StateGraph

class WorkState(TypedDict):
    request: str
    plan: str
    code_changes: list
    test_result: str
    retry_count: int

builder = StateGraph(WorkState)
builder.add_node("plan", plan_step)          # 일반 함수
builder.add_node("code", code_agent)         # LLM Agent (내부에 자체 Loop)
builder.add_node("test", run_tests)          # 테스트 명령
builder.add_node("approve", human_approval)  # 사람의 승인

builder.add_edge("plan", "code")
builder.add_edge("code", "test")
builder.add_conditional_edges("test", check_result, {
    "retry": "code",      # 실패 → 앞 Node로 되돌아가는 순환 경로 (Loop)
    "done": "approve",    # 통과 → 다음 단계
})

graph = builder.compile()
```

코드에서 보이듯 Node의 종류는 제각각이고(함수·Agent·명령·사람), Loop는 `conditional_edges`가 만드는 **순환 경로**로 자연스럽게 표현됩니다.

<br>

### Retry를 넘어 — 실패를 경로로 모델링하기

이제 앞에서 미뤄둔 질문으로 돌아가겠습니다. Loop는 기본적으로 하나의 가정을 가지고 있습니다.

```
Code → Test → Fail → Retry → Code
```

**"실패하면 다시 시도한다."** 간단한 작업이라면 이걸로 충분합니다.

물론 잘 설계된 Agent Loop는 실패 원인을 스스로 진단해서 다르게 대응할 수도 있습니다. 진짜 문제는 그 분기 정책이 **모델의 판단 안에** 머문다는 것입니다. Prompt 속 문장과 모델의 확률적 판단에 묻혀 있으면, 어떤 조건에서 어떤 행동이 허용되는지 외부에서 검토할 수도, 테스트할 수도, 통제할 수도 없습니다.

> **💡 Loop에도 분기는 있다. Graph의 차이는 분기를 발명하는 데 있지 않다.
> 분기 조건과 다음 경로를 시스템의 '명시적인 계약'으로 끌어내는 데 있다.**

Graph에서는 실패가 하나의 종료 상태가 아니라, **다음 경로를 결정하는 사건**이 됩니다. State에 기록되고, 원인에 따라 서로 다른 길로 라우팅됩니다.

![실패 라우팅 - Failure Classifier가 Bug, Spec, External, Environment/Permission으로 분기하고 각 경로가 조건부로 Test에 재합류](/img/ai/failure-routing.png){: width="50%" height="60%"}

- **코드 버그**라면 → Code Agent가 다시 수정합니다.
- **요구사항이 모호**하다면 → 사람에게 확인을 요청합니다. (확인 결과 작업 자체가 취소될 수도 있습니다)
- **외부 시스템 장애**라면 → 기다렸다가(backoff) 다시 시도합니다.
- **환경·권한 문제**라면 → 환경을 복구하거나 운영자에게 Escalation합니다.
- 분류되지 않는 **unknown**은 → 사람의 triage로 보냅니다.

중요한 점은 두 가지입니다. 모든 실패가 같은 Retry로 돌아가지 않고 **원인마다 다른 경로를 선택한다**는 것, 그리고 그 경로들이 무조건 재합류하는 것이 아니라 **중단·취소·Escalation으로 끝날 수도 있다**는 것입니다.

> **📌 Failure Classifier는 마법 상자가 아닙니다**
> 실패 분류가 반드시 또 하나의 Agent일 필요는 없습니다. 예외 타입이나 HTTP 상태 코드, 테스트 종료 코드처럼 명확한 신호는 **결정론적 함수**가 분류하고, 로그의 의미를 해석해야 하는 모호한 실패만 **LLM 분류기**에 맡기는 하이브리드가 실무적입니다.
> 어느 쪽이든 분류 결과는 `bug | spec | external | environment | unknown`처럼 **구조화된 값으로 State에 기록**합니다.
> 그리고 Graph가 분류를 정확하게 만들어주는 것은 아닙니다. **분류가 틀렸을 때 어디서 틀렸고 어떤 경로가 선택됐는지를 '보이게' 만들어줄 뿐입니다.**

한 가지 오해를 정리하고 넘어가겠습니다. 이것은 Workflow가 표현하지 못하던 것을 Graph가 새로 표현하게 됐다는 이야기가 **아닙니다.** 조건 분기와 병렬 처리를 포함하는 Workflow는 오래전부터 존재했습니다. Graph가 새로 주는 것은 분기 능력 자체가 아니라, Prompt 안에 묻혀 있던 제어 정책을 **Node와 Edge라는 공통 언어로 전면에 드러내는 방식**입니다. 이 관점은 다음 장에서 "Workflow Engineering 2.0"이라는 별칭으로 다시 정리하겠습니다.

솔직한 고백을 하나 하자면, 저도 처음에는 Graph의 가치를 **병렬 처리**에서 찾으려고 했습니다. 그런데 파고들수록, 적어도 실패 처리에서 Graph의 핵심 가치는 병렬화보다 **Routing**에 있었습니다. 같은 "실패"라는 사건도 원인과 상태에 따라 다음 실행 단위가 달라져야 했기 때문입니다. 병렬은 Graph가 표현할 수 있는 실행 관계 중 하나일 뿐입니다.

> **💡 단순한 Retry Loop는 "실패하면 다시 한다"를 표현한다.
> 실패 라우팅을 명시한 Graph는 "왜 실패했는가에 따라 어디로 갈 것인가"를 구조로 드러낸다.**

<br>

### Harness와 Graph는 무엇이 다른가

이전 글을 읽으신 독자라면 여기서 이런 의문이 들 수 있습니다.

> "Harness도 Workflow를 다루는데, Graph가 왜 새로운 개념이지?
> 내가 이미 만들고 있는 Harness + Workflow 시스템이랑 뭐가 다른데?"

사실 저 역시 처음에는 같은 의문이 있었습니다. 결론부터 말하면 — **절반은 맞고 절반은 다릅니다.** Graph Engineering이 새로운 실행 장치를 발명한 것은 아니지만, 지금까지 Harness 안에 암묵적으로 섞여 있던 "실행 단위들의 관계와 상태 전이"를 **독립된 설계 대상으로 끌어냈습니다.**

둘은 경쟁하는 개념이 아닙니다. **관심사가 다릅니다.**

> **💡 Harness는 "Node 하나가 어떻게 일하는가"를 설명하고,
> Graph는 "Node들이 어떻게 연결되는가"를 설명한다.**
>
> Graph는 Agent를 **정의하지 않습니다. 연결합니다.**
> Agent를 정의하는 것은 Harness입니다.

예를 들어 Research Agent 하나를 보면 —

- 이 Agent가 어떤 Tool을 쓸 수 있고, 어떤 Prompt와 Memory를 가지며, 어떤 Permission 안에서 움직이는지는 **Harness**가 정의합니다.
- `Research → Planning → Coding → Review`라는 흐름, 그리고 각 단계 사이의 분기와 상태 전달은 **Graph**가 정의합니다.

관심사를 표로 정리하면 이렇습니다. (서두의 표에서 언급한 Runtime까지 함께 놓아야 그림이 완성됩니다.)

| 구분 | Harness Engineering | Graph Engineering | Runtime Engineering |
|------|--------------------|--------------------|---------------------|
| **주된 범위** | 하나의 Agent 실행 경계 | 실행 단위들의 관계와 상태 전이 | 정의된 실행 구조의 실제 운영 |
| **핵심 질문** | Agent가 어떻게 모델을 호출하고 행동하는가 | 다음에 무엇을 실행하며 어떻게 분기·합류하는가 | 어떻게 스케줄링·저장·복구·관측하는가 |
| **대표 요소** | Prompt, Context, Tool, 권한, Agent Loop, 메모리 | Node, Edge, State schema, Routing, 분기, 합류, 순환 | Queue, Checkpoint 저장소, 재개, timeout, 관측, 비용 통제 |
| **실패 처리** | Tool 오류를 모델에 돌려주기, 호출 재시도, 자기 교정 | 실패 유형별 전이와 fallback 경로의 **선언** | 재시도의 **실행**, 중단 지점 복구, 중복 실행 방지 |

이 관계를 하나의 대표적인 구성으로 그리면 이렇습니다.

```
        Runtime            ← 그 설계를 실제 운영 (실행·복구·관측·통제)
           ▲
    Graph (Workflow)       ← 여러 Agent와 작업을 연결
           ▲
    Agent / Harness        ← 하나의 Agent를 잘 실행
           ▲
   Prompt + Context        ← 모델 한 번을 잘 호출
           ▲
          LLM
```

즉 Graph가 Harness 위에 군림하는 것이 아니라, **완성된 Agent(=Harness가 정의한)가 Graph의 Node 안에 들어가는** 구성이 가장 일반적입니다.

> **📌 다만, 고정된 포함 관계는 아닙니다**
> 완성된 Agent를 Node로 쓰면 Harness가 Node 내부에 들어가지만, 반대 방향도 실존합니다.
> 하나의 Agent 내부 동작 자체를 Graph로 구현할 수도 있고, Claude Code 같은 하네스는 자기 안에서 subagent들을 fan-out하는 — 사실상 Graph를 품는 — 구성도 가집니다.
> 또한 "LangGraph도 Memory와 Checkpoint가 있는데?"라는 반론이 나올 수 있는데, 이는 **제품 하나가 Graph API와 Harness·Runtime 기능을 함께 제공하는 것**이지, 세 관심사가 같은 개념이라는 뜻은 아닙니다.

이런 의미에서 저는 Graph Engineering을 비공식적으로 **'Workflow Engineering 2.0'** 이라고 부르고 싶습니다. 공식적인 세대 구분이라는 뜻은 아닙니다. 새로운 Runtime을 만든 것이 아니라, 기존 Workflow와 Agent Loop를 **Node·Edge·State라는 공통 언어로 명시하고, 역할 경계와 상태 전이를 검토 가능한 구조로 만들었다**는 뜻입니다.

> **💡 Graph Engineering이 Workflow를 발명한 것은 아니다.
> Agent 시대의 Workflow를 Graph라는 오래된 추상 모델로 다시 전면화한 것이다.**

이 장을 한 문장으로 정리하면 이렇습니다.

> Harness와 Graph의 차이는 "누가 누구 안에 들어가느냐"가 아닙니다.
> **Harness는 실행 단위의 행동 조건을, Graph는 실행 단위 사이의 관계와 상태 전이를 설계합니다.**
> 그리고 Runtime이 그 설계를 실제로 실행하고 지속시킵니다.

<br>

### 사례로 보는 재설계 — Loop 하나에서 Graph로

이제 상위 Graph가 **완성된 Agent를 Node로 사용하는** 구성을 실제 사례로 따라가 보겠습니다. 각 Agent는 자신의 Harness(도구·권한·Context)를 가지고, Graph는 이 Agent들과 결정론적 함수·테스트 명령·사람의 승인을 연결합니다.

> **요구사항**: "결제 API 응답에 `settlement_date` 필드를 추가해줘.
> 영향받는 코드를 찾아서 수정하고, 테스트 통과시키고, API 문서도 갱신해줘."

**Before — Loop 하나로 처리하면:**

```
[하나의 Agent Loop]
"너는 시니어 개발자야. 영향 범위를 조사하고, 코드를 수정하고,
 테스트를 돌리고, 실패하면 고치고, 문서를 갱신하고, ..."
```

- 영향 범위 조사에서 수집한 수십 개 파일 내용이 코드 수정 단계의 Context에 그대로 남아 판단을 방해합니다.
- 테스트가 3번 실패하면, 3번의 실패 로그와 시도가 모두 히스토리에 쌓인 채 문서 갱신까지 끌려갑니다.
- 결과물이 이상할 때, 조사·수정·문서화 중 **어디서** 잘못됐는지 로그를 처음부터 다시 읽어야 합니다.

**After — Graph로 재설계하면:**

```
[영향 범위 탐색 Agent]     → State에 changed_files 후보 기록
          ↓
   [계획 수립 함수]         → State에 plan 기록 (결정론적)
          ↓
     [Code Agent] ←────┐   → plan과 해당 파일만 Context로 받음
          ↓            │
    [테스트 실행]        │    → State에 test_result, last_failure_type 기록
          ↓            │
  [검증 및 실패 라우팅] ─ Bug ┘ → 그 외 원인은 앞 장의 실패 라우팅 경로로
          │                   (요구사항 확인·환경 복구·외부 장애 대기)
         통과
          ↓
    [문서 갱신 Agent]        → 확정된 code_changes만 Context로 받음
          ↓
     [사람의 승인]           → 배포 전 최종 게이트
```

무엇이 달라졌는지 보면:

- **Context 분리**: Code Agent는 계획과 대상 파일만 봅니다. 조사 단계의 부산물은 State에 남아 있을 뿐 Context를 오염시키지 않습니다.
- **명시적 실패 정책**: "어떤 실패가 어디로 가는가"가 Prompt 속 문장이 아니라 **Edge의 조건**으로 존재합니다. 재시도 한도 역시 `code_fix_attempts`, `external_retry_attempts`처럼 원인별로 다른 정책을 가질 수 있습니다. (코드 수정 재시도와 외부 API 장애 대기는 한도와 backoff가 달라야 하니까요)
- **관측 지점**: 각 Node의 입력(State)과 출력이 기록되므로, 문제가 생기면 해당 Node만 들여다보면 됩니다.
- **문서 갱신은 병렬이 아니라 순차**: 코드가 확정되기 전에 문서를 쓰면 낡은 문서가 됩니다. 병렬화는 "독립적인 작업"에만 해당합니다. (예: 서로 다른 관점의 코드 리뷰를 병렬로 돌리는 경우)

여기서 짚어둘 것이 있습니다. Prompt와 Workflow는 **대체 관계가 아닙니다.**

> 개별 호출의 품질은 여전히 Prompt와 Context가 좌우합니다.
> 시스템 전체의 안정성은 Routing·검증·상태 관리·종료 조건이 **함께** 좌우합니다.
> 같은 모델을 쓰더라도 이 구조에 따라 시스템의 품질은 크게 달라집니다.

그래서 Graph Engineering의 본질은 AI를 **더 똑똑하게** 만드는 것이 아니라, 이질적인 실행 단위들이 **더 잘 협업하게** 만드는 것입니다. Prompt를 잘 쓰는 기술이 아니라, **실행 단위들의 관계를 설계하는 기술**입니다.

<br>

### Graph가 주는 것과 요구하는 것

Graph로 재설계하면 앞 장에서 본 이득들이 생깁니다. 하지만 공짜가 아닙니다. 각 이득에는 새로운 설계 비용이 따라옵니다.

| 얻는 것 | 함께 생기는 비용 |
|--------|----------------|
| **역할 분리** — 각 Node는 자기 일만 한다 | Node 간 입출력 계약(전달 형식) 설계 필요 |
| **병렬 처리** — 독립 작업의 동시 실행 | 결과 취합(join)과 충돌 해결 규칙 필요 |
| **상태 관리** — Context 간섭 차단 | State schema 설계와 동시성 관리 필요 |
| **실패 경로의 명시화** — 원인별 fallback·승인·중단 경로 선언 | 실패 분류 체계, 오분류·unknown 처리 정책 필요 |
| **중단 지점 복구** — Checkpoint부터 재개 | Checkpoint 저장소, 재실행 정책, 재실행되는 Node의 멱등성 필요 |
| **독립 교체** — Node별 모델·도구 교체 | Node 단위가 아닌 end-to-end 품질 평가가 복잡해짐 |

한 가지 주의할 점이 있습니다. Checkpoint 저장과 관측은 Graph **구조** 자체의 속성이 아니라, 주로 그것을 실행하는 **Runtime의 기능**입니다. Retry는 범위에 따라 나뉩니다 — "실패하면 어느 Node로 돌아갈 것인가"는 **Graph가 선언**하고, 재실행·backoff·Checkpoint 복구를 실제로 수행하는 것은 **Runtime**이며, Agent 내부에서 Tool 호출을 다시 시도하는 것은 **Harness**의 책임입니다. 「Harness와 Graph는 무엇이 다른가」 장에서 세 관심사를 구분해 둔 것이 여기서 힘을 발휘합니다.

그래서 저는 이 문장이 Graph Engineering을 가장 정직하게 설명한다고 생각합니다.

> **💡 Graph Engineering은 복잡성을 제거하지 않는다.
> 대신 암묵적이던 복잡성을 Node, Edge, State라는 형태로 '보이게' 만든다.**

Loop 하나 안에 Prompt 문장으로 숨어 있던 역할 경계, 종료 조건, 실패 처리 규칙이 — Graph에서는 구조로 드러납니다. 복잡성의 총량은 비슷할지 몰라도, **보이는 복잡성은 설계하고 테스트하고 개선할 수 있습니다.**

<br>

### 모든 작업을 명시적 Graph로 만들 필요는 없다

마지막으로, 가장 중요한 균형 감각입니다.

"언제 Graph를 쓸까"는 기술적 가능성의 문제가 아니라 **복잡도와 비용을 감수할 가치가 있는가**의 문제입니다. Anthropic도 agentic system은 일반적으로 지연시간과 비용을 지불하고 성능을 얻는 구조라고 설명하며, **단순한 해법으로 충분하다면 그것을 쓰라**고 권합니다.

**명시적 Graph를 고려할 조건:**

- 역할과 책임이 실제로 분리된다
- 분기마다 처리 방식이 다르다
- 병렬화로 얻는 이득이 크다
- 중간 승인이나 장시간 대기가 있다
- 실패 지점부터 복구해야 한다
- 실행 과정을 감사(audit)하거나 재현해야 한다
- Node별로 모델·도구·권한을 다르게 써야 한다

**Loop 하나에 머무를 조건:**

- 모든 단계가 같은 Context에 강하게 의존한다
- 단계가 짧고 선형적이다
- 분기와 실패 유형이 단순하다
- 병렬화할 작업이 없다
- 추가 오케스트레이션 비용이 작업의 가치보다 크다

메일 작성, 블로그 초안, 간단한 QA 같은 작업은 Loop 하나면 충분합니다.

> **💡 모든 Agent를 명시적 Graph로 구현할 필요는 없다.
> 제대로 설계된 Loop 하나가, 어설픈 Multi-Agent Graph보다 낫다.**

(어떤 Loop든 이론적으로는 이미 그래프입니다. 쟁점은 "그래프냐 아니냐"가 아니라, 그것을 **명시적으로 그래프로 모델링할 가치가 있느냐**입니다.)

#### 다음 이야기 — Runtime Engineering

앞에서 Harness와 Graph를 서로 다른 설계 관심사로 구분했습니다. 하네스가 **작업장**이라면, 그래프는 그 작업장에서 **일이 흘러가는 지도**입니다.

하지만 Node와 Edge를 정의하는 것만으로 시스템이 운영되지는 않습니다. 이 지도를 실제로 스케줄링하고, 상태를 저장하고, 실패 지점에서 재개하고, 비용과 실행 경로를 관측하는 실행 기반이 남아 있습니다 — **Runtime Engineering**입니다. 이건 다음 글에서 다뤄보겠습니다.

#### 마치며

처음의 문장으로 돌아가겠습니다.

> **Prompt는 AI에게 무엇을 할지 알려주고, Loop는 작업이 언제까지 반복될지를 정의하며,
> Graph는 에이전트·도구·사람이 어떤 관계와 흐름으로 협업할지를 설계한다.**

그리고 이 글에서 단 하나만 기억하신다면, 이 문장이면 충분합니다.

> **한 줄 요약**
> Graph Engineering은 Agent를 많이 만드는 기술이 아니다.
> **복잡한 작업의 책임(Responsibility)과 흐름(Flow)을 명시적으로 설계하는 기술이다.**

앞으로는 "어떤 Prompt를 쓸까"만큼 — 어쩌면 그보다 더 — **"어떤 Graph를 설계할까"** 가 중요한 질문이 될 가능성이 높습니다. 다만 그 질문의 답이 언제나 "더 큰 Graph"는 아니라는 것까지가, 이 글에서 드리고 싶었던 이야기입니다.

<br>

#### 참고 자료

- [Building effective agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents) — Workflow 패턴 분류와 단순성 우선 원칙
- [LangGraph 공식 문서](https://langchain-ai.github.io/langgraph/) — Node·Edge·State의 구현 개념
- 갓대희, 「Graph Engineering 팩트체크」 — 용어의 유행 경위, Loop와 Graph의 포함 관계
- 퀀텀점프클럽(QJC) 정상록, 「그래프 엔지니어링이란? 2026년 AI 에이전트 오케스트레이션의 새 계층과 도입 판단 기준」 (2026.07.27) — 도입 판단 기준과 실무적 Trade-off
- (이전 글) [2026년 AI 에이전트의 핵심, 하네스 엔지니어링](/ai/2026/05/15/harness-engineering.html)
