---
layout: post
title: Jekyll 초안 활용 하기(drafts)
date:   2019-10-20 13:00:00
categories: others
category : others
comments: true 
---

## Jekyll 초안 활용 하기(drafts)

Jekyll 을 이용한 블로그의 디렉토리 구조는 아래와 같다.

```text
.
├── _config.yml
├── _data
|   └── members.yml
├── _drafts
|   ├── begin-with-the-crazy-ideas.md
|   └── on-simplicity-in-technology.md
├── _includes
|   ├── footer.html
|   └── header.html
├── _layouts
|   ├── default.html
|   └── post.html
├── _posts
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _sass
|   ├── _base.scss
|   └── _layout.scss
├── _site
├── .jekyll-metadata
└── index.htm 
```

포스트 초안은 _drafts 폴더에서 관리하며 완성된 포스트는 _posts 로 이동 되어 블로그에 게시 되게 된다.

이 포스트 초안은 기본 옵션 으로는 블로그에 게시가 되지 않지만 미리보기 옵션을 통해서 확인 할 수 있다.

```text
jekyll serve --drafts
```

jekyll 서버를 실행 시킬 때 --drafts 명령어를 주어 실행 하게 되면 초안을 포함하여 미리보기를 할 수 있으며
초안은 날짜 정보가 없기 때문에 항상 최신 포스트로 표시 된다.

 