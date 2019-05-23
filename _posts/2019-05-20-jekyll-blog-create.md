---
layout: post
title: jekyll 을 이용한 blog 만들기
date:   2019-05-20 09:00:00
categories: others
---

# jekyll을 이용하여 나만의 git blog 만들기
jekyll 을 이용해서 나만의 블로그를 만들어 포스팅을 해보자.
이 포스트에서는 퀵 셋팅을 할 수 있도록 내가 셋팅 했던 순서를 정리 했다.  


## jekyll이 뭐지?   <small>[jekyll 공식사이트 이동하기](https://jekyllrb-ko.github.io)</small>
jekyll은 아주 심플하고 블로그 지향 적인 사이트 생성기이다. 텍스트(마크다운) 파일로 컨텐츠를 작성하고 폴더로 관리한다.  
그다름 Liquid 기능이 추가된 html 템플릿들을 함께 합쳐서 어떤 서버에서도 올바르게 작동하는 정적 사이트를 만들 수 있다. 
 

## jekyll 설치
jekyll 공식 홈페이지에서는 윈도우즈에서는 공식적으로 지원되지 않는 플랫폼이라고는 하지만
동작에 있어 문제가 되지는 않는듯 하다.  


1) Ruby Installer  
Jekyll 을 이용하기 위해서는 RubyInstaller 를 이용하여 내 컴퓨터에 Ruby를 설치 해야 한다.   
	+ 설치 링크 : [Ruby Installer](https://rubyinstaller.org/downloads/)  
	+ 설치 방법  
		* 설치 링크에서 해당 파일을 다운 받아서 설치 한다.  
		* 윈도우 환경 변수 PATH를 등록한다.  
	+ 설치 확인 방법  
 		* 명령프롬프트에서 `ruby -v` and `gem -v` 로 확인 할 수 있다.

2) jekyll 테마를 다운 받는다.
jekyll 테마 사이트에서는 이쁘고 많은 종류의 사이트 테마를 MIT 라이센스로 제공 되고 있다.  
	+ jekyll 테마 사이트 : [jekyll 테마 사이트](http://jekyllthemes.org/)
	
3) jekyll & bundler 설치  
	+ jekyll 테마 사이트에서 다운받은 테마의 폴더로 이동한다.  
	+ CMD(명령프롬프트) 창을 열고 아래 명령어를 입력 한다.    
	`gem install jekyll bundler`

4) 웹 사이트로 구동 하기.  
	+ CMD(명령프롬프트) 창을 열고 아래 명령어를 입력 한다.  
	`bundle exec jekyll serve`  
	+ 브라우저로 http://localhost:4000 에 접속

## 디렉토리 구조
매우 간단한 방법으로 나만의 jekyll 사이트가 생성 된 것을 보았다.
하지만 jekyll 은 아래 디랙토리 구조로 구성 되어있으며 해당 구조를 반드시 지켜야 한다.
~~~
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
~~~

각 파일과 디렉토리가 하는 일의 개요는 다음과 같다.  
  
| 파일/디렉토리 | 설명 |
|:---|:---|
|	_config.yml	|	환경설정 정보를 보관한다. 명령어를 실행할 때 여러가지 옵션들을 추가할 수도 있지만, 그렇게 따로 외우는 것보다 이 파일에 정의해두는게 더 편리하다.	|
|	_drafts	|	초안이란 아직 게시하지 않은 포스트를 말한다. 파일명 형식에 날짜가 없다: `title.MARKUP`. 사용 방법은 초안 활용하기를 참고하라.	|
|	_includes	|	재사용하기 위한 파일을 담는 디렉토리로서, 필요에 따라 포스트나 레이아웃에 쉽게 삽입할 수 있다. &#123;% include file.ext %&#125; 와 같이 Liquid 태그를 사용하면 _includes/file.ext 파일에 담긴 코드가 삽입된다.	|
|	_layouts	|	포스트를 포장할 때 사용하는 템플릿이다. 각 포스트 별로 레이아웃을 선택하는 기준은 YAML 머리말이며, 자세한 내용은 다음 섹션에서 설명한다.  &#123; &#123; content &#125;&#125; 와 같이 Liquid 태그를 사용하면 페이지에 컨텐츠가 주입된다.	|
|	_posts	|	한마디로 말하면, 당신의 컨텐츠다. 중요한 것은 파일들의 명명규칙인데, 반드시 이 형식을 따라야 한다 :`YEAR-MONTH-DAY-title.MARKUP`. 고유주소는 포스트 별로 각각 정의할 수 있지만, 날짜와 마크업 언어 종류는 오로지 파일명에 의해 결정된다.	|
|	_data	|	사이트에 사용할 데이터를 적절한 포맷으로 정리하여 보관하는 디렉토리. Jekyll 엔진은 이 디렉토리에 있는 (확장자와 포맷이 .yml또는 .yaml, .json, .csv 인) 모든 데이터 파일을 자동으로 읽어들여 `site.data` 로 사용할 수 있도록 만든다. 만약 이 디렉토리에 members.yml 라는 파일이 있다면, site.data.members 라고 입력하여 그 컨텐츠를 사용할 수 있다.	|
|	_sass	|	Sass 조각파일들로, 프로젝트의 main.scss 에 임포트할 수 있으며 임포트 후에는 다시 하나의 스타일시트(main.scss)로 가공되어 사이트에 사용되는 스타일들을 정의한다.	|
|	_site	|	Jekyll 이 변환 작업을 마친 뒤 생성된 사이트가 저장되는 (디폴트) 경로이다. 대부분의 경우, 이 경로를 .gitignore 에 추가하는 것은 괜찮은 생각이다.	|
|	.jekyll-metadata	|	Jekyll 은 이 파일을 참고하여, 마지막으로 빌드한 이후에 한번도 수정되지 않은 파일은 어떤 것인지, 다음 빌드 때 어떤 파일을 다시 생성해야 하는지 판단할 수 있다. 생성된 사이트에 이 파일이 복사되지는 않는다. 대부분의 경우, 이 파일을 .gitignore 에 추가하는 것은 괜찮은 생각이다.	|
|	index.html 또는 index.md 및 다른 HTML, 마크다운, Textile 파일	|	Jekyll 은 YAML 머리말 섹션을 가진 모든 파일을 찾아 변환 작업을 수행한다. 위에서 언급하지 않은 다른 디렉토리나 사이트의 루트 디렉토리에 있는 모든 .html, .markdown, .md, .textile 이 여기에 해당한다.	|
|	다른 파일/폴더	|	css 나 images 폴더, favicon.ico 파일같이 앞서 언급하지 않은 다른 모든 디렉토리와 파일들은 있는 그대로 생성된 사이트에 복사한다. 다른 사람들이 만든 사이트는 어떤식으로 생겼는지 궁금하다면, Jekyll 을 사용하는 사이트들이 이미 많이 있으니 살펴보도록 한다.	|
  