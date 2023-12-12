---
layout: post
title: 쿠버네티스-Helm 기초 문법
date:   2023-12-11 10:00:00
categories: k8s
category : k8s
comments: true 
---

## Helm 기초 문법(Function, pipeline, method)

### Function

```text
apiVersion: v1
kind: ConfigMap
metadata:
    name: function-and-pipeline
data:
  Function_Argument:
    quote: &#123;&#123; quote .Values.func.enabled &#125;&#125;     # quote(arg1)           R: "true" 
    include: &#123;&#123; include "mychart.name" . &#125;&#125;     # include(arg1, arg2)   R: mychart

  Function_Quote:
    function_case1: &#123;&#123; .Values.func.enabled &#125;&#125;                          # R: true
    function_case2: &#123;&#123; quote .Values.func.enabled &#125;&#125;                    # R: "true"
    function_case3: "&#123;&#123; .Values.func.enabled &#125;&#125;"                        # R: "true"

  Pipeline:
    upper: &#123;&#123; .Values.pipe.log | upper &#125;&#125;                                  # R: INFO
    upper.repeat: &#123;&#123; .Values.pipe.log | upper | repeat 2 &#125;&#125;                # R: INFOINFO
    upper.repeat.quote: &#123;&#123; .Values.pipe.log | upper | repeat 2 | quote &#125;&#125;  # R: "INFOINFO"

  print:
    print:  &#123;&#123; print "Hard Cording" &#125;&#125;                                     # R: Hard Cording"
    printf: &#123;&#123; printf "%s-%s" .Values.print.a .Values.print.b &#125;&#125;           # R: 1-2

  ternary:
    case1: &#123;&#123; .Values.ternary.case1 | ternary "1" "2" &#125;&#125;                   # R: 1
    case2: &#123;&#123; .Values.ternary.case2 | ternary "1" "2" &#125;&#125;                   # R: 2

  indent:
    indent: &#123;&#123; .Values.data | toYaml | indent 4 &#125;&#125;                         # R: -a -b -c (배열 출력)
    nindent1: &#123;&#123; .Values.data | toYaml | nindent 4 &#125;&#125;                      # R: -a -b -c (배열 출력)
    nindent2: &#123;&#123;- .Values.data | toYaml | nindent 4 &#125;&#125;                     # R: -a -b -c (배열 출력)

  default: # Number:0, String: "", List: [], Object: &#123;&#125;, Boolean: false, Null       C: 값이 없을때 기본값 설정
    nil:     &#123;&#123; .Values.default.nil     | default "default" &#125;&#125;
    list:    &#123;&#123; .Values.default.list    | default (list "default1" "default2") | toYaml | nindent 6&#125;&#125;
    object:  &#123;&#123; .Values.default.object  | default "default:1" | toYaml | nindent 6 &#125;&#125;
    number:  &#123;&#123; .Values.default.number  | default 1 &#125;&#125;
    string:  &#123;&#123; .Values.default.string  | default "default" &#125;&#125;
    boolean: &#123;&#123; .Values.default.boolean | default true &#125;&#125;

  trim:
    trim:       &#123;&#123; trim "  hello " &#125;&#125;
    trimPrefix: &#123;&#123; trimPrefix "-" "-hello" &#125;&#125;
    trimSuffix: &#123;&#123; trimSuffix "-" "hello-" &#125;&#125;

  random:
    randAlphaNum: &#123;&#123; randAlphaNum 5 &#125;&#125;   # 0-9a-zA-Z
    randAlpha:    &#123;&#123; randAlpha 5 &#125;&#125;      # a-zA-Z
    randNumeric:  &#123;&#123; randNumeric 5 &#125;&#125;    # 0-9
    randAscii:    &#123;&#123; randAscii 5 &#125;&#125;      # ASCII characters

    trunc:    &#123;&#123; trunc 5 "hello world" &#125;&#125;
    replace:  &#123;&#123; "hello world" | replace " " "-" &#125;&#125;
    contains: &#123;&#123; contains "cat" "catch" &#125;&#125;                  # R: true
    b64enc:   &#123;&#123; b64enc "hello" &#125;&#125;
```

### if

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-if
data:
  dev:
    env: &#123;&#123; .Values.dev.env &#125;&#125;
    &#123;&#123;- if eq .Values.dev.env "dev" &#125;&#125;
    log: debug
    &#123;&#123;- else if .Values.dev.log &#125;&#125;
    log: &#123;&#123; .Values.dev.log &#125;&#125;
    &#123;&#123;- else &#125;&#125;
    log: error
    &#123;&#123; end &#125;&#125;
    
  prod:
    env: &#123;&#123; .Values.prod.env &#125;&#125;
    &#123;&#123; if eq .Values.prod.env "dev" &#125;&#125;
    log: debug
    &#123;&#123; else if .Values.prod.log &#125;&#125;
    log: &#123;&#123; .Values.prod.log &#125;&#125;
    &#123;&#123; else &#125;&#125;
    log: error
    &#123;&#123; end &#125;&#125;
```

### with

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-with
data:
  dev:
  &#123;&#123;- with .Values.dev &#125;&#125;
    env: &#123;&#123; .env &#125;&#125;
    log: &#123;&#123; .log &#125;&#125;
  &#123;&#123;- end &#125;&#125;

  qa:
  &#123;&#123;- with .Values.qa &#125;&#125;
    env: &#123;&#123; .env &#125;&#125;
    log: &#123;&#123; .log &#125;&#125;
  &#123;&#123;- end &#125;&#125;
  
  prod:
  &#123;&#123;- with .Values.prod &#125;&#125;
    env: &#123;&#123; .env &#125;&#125;
    log: &#123;&#123; .log &#125;&#125;
  &#123;&#123;- end &#125;&#125;
```

### range

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-range
data:
  yaml:
  &#123;&#123;- .Values.data | toYaml | nindent 2 &#125;&#125;

  range:
  &#123;&#123;- range .Values.data &#125;&#125;
  - &#123;&#123; . &#125;&#125;
  &#123;&#123;- end &#125;&#125;

  range-quote:
  &#123;&#123;- range .Values.data &#125;&#125;
  - &#123;&#123; . | quote &#125;&#125;
  &#123;&#123;- end &#125;&#125;

  range-upper-quote:
  &#123;&#123;- range .Values.data &#125;&#125;
  - &#123;&#123; . | upper | quote &#125;&#125;
  &#123;&#123;- end &#125;&#125;
```