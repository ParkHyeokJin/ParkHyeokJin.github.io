---
layout: post
title: 단 65줄로 AI 코딩의 고질병을 고친 CLAUDE.md (Karpathy & Forrest Chang)
date:   2026-06-01 08:00:00
categories: AI
category : AI
comments: true
---

### 들어가며

2025년을 지나 2026년으로 넘어오면서, 코드를 직접 타이핑하는 시대에서 **AI 에이전트에게 코드를 맡기는 시대**로 빠르게 이동하고 있습니다.
그런데 막상 Claude Code, Cursor 같은 코딩 에이전트를 본격적으로 써보면 누구나 비슷한 짜증을 경험합니다.

> "왜 묻지도 않고 마음대로 가정해서 짜지?"
> "한 줄 고쳐달랬더니 옆에 있는 멀쩡한 코드까지 다 바꿔놨네?"
> "이렇게 복잡하게 안 짜도 되는데 왜 이렇게 추상화를 떡칠했지?"

이 막연한 답답함을 정확하게 짚어낸 사람이 바로 **안드레 카파시(Andrej Karpathy)** 였고,
그 지적을 **단 65줄짜리 `CLAUDE.md` 파일**로 박제해 GitHub에서 10만 스타 이상의 폭발적 인기를 끈 사람이 개발자 **포레스트 창(Forrest Chang)** 입니다.

이번 글에서는 이 파일이 무엇을 해결했는지, 그리고 우리 프로젝트에 어떻게 적용하면 되는지 정리해 보겠습니다.

<br>

### 발단 : 카파시의 한마디

안드레 카파시는 **OpenAI 창립 멤버**이자 **전 테슬라 AI 디렉터**, 그리고 2025년 초 *"vibe coding"* 이라는 용어를 만들어낸 인물입니다.

2026년 1월 26일, 그는 X(트위터)에 자신의 코딩 워크플로우가 20여 년 만에 가장 크게 바뀌었다고 적었습니다.
**불과 두 달 만에 직접 손으로 짜는 코드가 80%에서 20%로 줄고, AI 에이전트가 짜는 코드가 80%가 되었다**는 것입니다.

그러면서 그는 LLM 에이전트들이 코드를 짤 때 보이는 고질적인 문제들을 이렇게 지적했습니다.

> "They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."
>
> (그들은 자신의 혼란을 다스리지 못하고, 명확히 묻지 않으며, 모순을 드러내지 않고, 트레이드오프를 제시하지 않으며, 반박해야 할 때 반박하지 않는다.)

<br>

### AI 코딩의 4가지 고질병

카파시의 지적은 다음 **4가지 실패 패턴**으로 요약됩니다.

1. **검증되지 않은 침묵의 가정 (Silent assumptions)**
   - 모호한 요구사항을 멋대로 해석해 놓고 묻지 않습니다.

2. **코드와 추상화의 비대화 (Hypertrophy of abstractions)**
   - 50줄이면 될 일을 200줄로, 필요 없는 "유연성"과 추상화 레이어를 덕지덕지 붙입니다.

3. **요청하지 않은 부수적 변경 (Collateral changes)**
   - 시킨 것만 고치면 되는데, 주변의 멀쩡한 코드까지 건드립니다.

4. **검증 가능한 성공 기준의 부재 (No verifiable success criteria)**
   - "동작하게 만들어"는 목표가 아닙니다. 무엇이 "완료"인지 정의되지 않은 채 굴러갑니다.

<br>

### 해결책 : 65줄짜리 CLAUDE.md

카파시가 글을 올린 **바로 다음 날**, 포레스트 창(본명 Jiayuan Zhang)이 이 불만들을 그대로 받아
`CLAUDE.md` 라는 텍스트 파일로 변환했습니다. (`github.com/forrestchang/andrej-karpathy-skills`)

> #### CLAUDE.md 가 뭔가요?
> `CLAUDE.md`는 Claude Code가 **세션 시작 시 항상 먼저 읽는 프로젝트 단위 지침 파일**입니다.
> 쉽게 말해 "프로젝트에 박아두는 시스템 프롬프트"로, 당신이 한 글자 치기 전에 에이전트가 어떻게 행동해야 하는지를 정의합니다.

재미있는 점은 이 파일이 **사실상 AI가 스스로 만든 결과물**이라는 것입니다.
처음엔 Claude Code로 카파시의 글을 약 800줄짜리 스킬 파일들로 부풀린 뒤, 그 스킬들로 자기 자신을 리뷰하게 시켜
**약 65~70줄의 군더더기 없는 지침으로 압축**해냈습니다. 4가지 고질병에 정확히 대응하는 **4가지 원칙**이 핵심입니다.

<br>

#### 1. Think Before Coding (코딩 전에 생각하라)

> "State your assumptions explicitly. If uncertain, ask."

가정을 명시적으로 드러내라. 불확실하면 멈추고 물어라. 요청을 두 가지로 해석할 수 있다면 둘 다 제시하라. 반박해야 할 때는 반박하라.
→ **침묵의 가정** 문제를 해결합니다.

#### 2. Simplicity First (단순함이 먼저다)

> "Minimum code that solves the problem. Nothing speculative."

문제를 푸는 최소한의 코드만 작성하라. 요청하지 않은 기능, 성급한 추상화, 불필요한 예외 처리는 금지. 200줄을 짰는데 50줄이면 됐다면 다시 짜라.
→ **추상화 비대화** 문제를 해결합니다.

#### 3. Surgical Changes (외과적 변경)

> "Touch only what you must. Clean up only your own mess."

꼭 건드려야 하는 것만 건드려라. 기존 스타일을 존중하고, 관련 없는 코드는 리팩터링하지 마라. 내 변경 때문에 고아가 된 import와 함수만 정리하라.
→ **요청하지 않은 부수적 변경** 문제를 해결합니다.

#### 4. Goal-Driven Execution (목표 주도 실행)

> "Define success criteria. Loop until verified."

요청을 검증 가능한 목표로 바꿔라. "버그 고쳐줘"가 아니라 "버그를 재현하는 테스트를 작성하고, 그 테스트를 통과시켜라"로 바꾸는 것입니다.
→ **검증 기준의 부재** 문제를 해결합니다.

카파시의 인사이트가 그대로 담긴 원칙입니다.

> "LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go."
>
> (LLM은 구체적인 목표를 만족할 때까지 반복하는 데 탁월하다... 무엇을 하라고 시키지 말고, 성공 기준을 주고 알아서 굴러가게 하라.)

<br>

### 적용 방법

방법은 두 가지입니다.

**① 프로젝트 단위로 적용 (해당 프로젝트 루트에서)**

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

**② Claude Code 플러그인으로 전체 프로젝트에 적용**

```bash
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

저장소에는 Cursor용 룰(`.cursor/rules/karpathy-guidelines.mdc`)도 함께 포함되어 있어,
Cursor에서 프로젝트를 열어도 동일한 지침이 적용됩니다.

<br>

### 왜 이렇게까지 인기를 끌었나

카파시는 *"LLM 에이전트의 역량이 2025년 12월 무렵 어떤 일관성의 임계점을 넘으면서 소프트웨어 엔지니어링에 상전이(phase shift)를 일으켰다"* 고 표현했습니다.
바로 그 시점에 **수많은 개발자가 처음으로 AI 코딩 에이전트를 쓰기 시작했고**, 카파시가 묘사한 그 답답함을 똑같이 겪고 있었습니다.

그 결과 이 저장소는 GitHub 역사상 가장 빠르게 성장한 저장소 중 하나가 되었습니다.
포레스트 창의 개인 계정에서 약 **9만 1천 스타**, 조직 미러(`multica-ai/andrej-karpathy-skills`)까지 합치면 **22만 스타 이상**을 기록했습니다.

> 이 분야에서 가장 많은 별을 받은 개발자 리소스가
> 프레임워크도, 플러그인도, 모델도 아닌 **마크다운 파일 속 네 문장**이라는 점은 시사하는 바가 큽니다.

다만, 카파시 본인이 이 저장소를 **공식 보증한 것은 아닙니다.** 그의 1월 26일 관찰에서 파생되었기에 그의 이름이 붙어 있을 뿐이며,
작성자는 어디까지나 포레스트 창입니다. (카파시는 자신의 채널에서 이 작업을 공유했고, 이름을 빼달라고 요청하지도 않았습니다.)

<br>

### ⚠️ 보안 주의사항

마지막으로 한 가지 꼭 짚고 넘어가야 할 부분이 있습니다.
Adversa AI, LayerX 등 보안 연구자들은 **`CLAUDE.md` 파일이 무기화될 수 있다**고 경고했습니다.
복제한 저장소에 심어진 악성 `CLAUDE.md`가 SSH 키, API 자격증명 같은 비밀 정보를 빼내는 파이프라인을 생성하도록 에이전트에게 지시할 수 있다는 것입니다.

따라서 이 지침 파일은 반드시 **공식 저장소**(`forrestchang/andrej-karpathy-skills` 또는 `multica-ai/andrej-karpathy-skills`)에서만 받고,
출처가 불분명한 포크나 복사본, 서드파티 미러는 신뢰하지 않는 것이 안전합니다.

<br>

### 마치며

결국 핵심 메시지는 단순합니다.
**AI에게 "알아서 잘 해줘"라고 던지지 말고, 사람이 협업 상대에게 요구하듯 명확한 행동 규칙을 주라**는 것입니다.

- 가정하지 말고 물어라 (Think Before Coding)
- 최소한으로 짜라 (Simplicity First)
- 시킨 것만 건드려라 (Surgical Changes)
- 성공 기준을 정의하라 (Goal-Driven Execution)

이 4가지는 사실 AI에게만 해당하는 이야기가 아니라, **좋은 시니어 개발자라면 당연히 지키는 협업 원칙**이기도 합니다.
AI 코딩 시대에 우리가 에이전트에게 무엇을 요구해야 하는지를 65줄로 정리해 준 좋은 사례라고 생각합니다.

> 💡 **관련 자료**: 같은 카파시의 아이디어에서 출발한 또 다른 프로젝트로,
> LLM에 매번 질문하거나 RAG를 돌리는 대신 지식을 서로 연결된 마크다운 위키로 누적·관리하는
> *"LLM Wiki"* 패턴 기반의 [obsidian-wiki](https://github.com/ar9av/obsidian-wiki) 도 함께 살펴보면 좋습니다.

<br>

#### 참고 자료
- [Andrej Karpathy's CLAUDE.md: The 65-Line File With 100K GitHub Stars](https://miraflow.ai/blog/karpathy-claude-md-100k-github-stars-ai-coding-2026)
- [Karpathy-Inspired CLAUDE.md Passes 220,000 Combined GitHub Stars (TechTimes)](https://www.techtimes.com/articles/316798/20260518/karpathy-inspired-claudemd-passes-220000-combined-github-stars-four-rules-that-stop-ai-breaking.htm)
- [andrej-karpathy-skills/CLAUDE.md (원문)](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)
- [Andrej Karpathy's CLAUDE.md Rules (AI Builder Club)](https://www.aibuilderclub.com/blog/karpathy-claude-md-rules)