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
    quote: {{ quote .Values.func.enabled }}     # quote(arg1)           R: "true" 
    include: {{ include "mychart.name" . }}     # include(arg1, arg2)   R: mychart

  Function_Quote:
    function_case1: {{ .Values.func.enabled }}                          # R: true
    function_case2: {{ quote .Values.func.enabled }}                    # R: "true"
    function_case3: "{{ .Values.func.enabled }}"                        # R: "true"

  Pipeline:
    upper: {{ .Values.pipe.log | upper }}                                  # R: INFO
    upper.repeat: {{ .Values.pipe.log | upper | repeat 2 }}                # R: INFOINFO
    upper.repeat.quote: {{ .Values.pipe.log | upper | repeat 2 | quote }}  # R: "INFOINFO"

  print:
    print:  {{ print "Hard Cording" }}                                     # R: Hard Cording"
    printf: {{ printf "%s-%s" .Values.print.a .Values.print.b }}           # R: 1-2

  ternary:
    case1: {{ .Values.ternary.case1 | ternary "1" "2" }}                   # R: 1
    case2: {{ .Values.ternary.case2 | ternary "1" "2" }}                   # R: 2

  indent:
    indent: {{ .Values.data | toYaml | indent 4 }}                         # R: -a -b -c (배열 출력)
    nindent1: {{ .Values.data | toYaml | nindent 4 }}                      # R: -a -b -c (배열 출력)
    nindent2: {{- .Values.data | toYaml | nindent 4 }}                     # R: -a -b -c (배열 출력)

  default: # Number:0, String: "", List: [], Object: {}, Boolean: false, Null       C: 값이 없을때 기본값 설정
    nil:     {{ .Values.default.nil     | default "default" }}
    list:    {{ .Values.default.list    | default (list "default1" "default2") | toYaml | nindent 6}}
    object:  {{ .Values.default.object  | default "default:1" | toYaml | nindent 6 }}
    number:  {{ .Values.default.number  | default 1 }}
    string:  {{ .Values.default.string  | default "default" }}
    boolean: {{ .Values.default.boolean | default true }}

  trim:
    trim:       {{ trim "  hello " }}
    trimPrefix: {{ trimPrefix "-" "-hello" }}
    trimSuffix: {{ trimSuffix "-" "hello-" }}

  random:
    randAlphaNum: {{ randAlphaNum 5 }}   # 0-9a-zA-Z
    randAlpha:    {{ randAlpha 5 }}      # a-zA-Z
    randNumeric:  {{ randNumeric 5 }}    # 0-9
    randAscii:    {{ randAscii 5 }}      # ASCII characters

    trunc:    {{ trunc 5 "hello world" }}
    replace:  {{ "hello world" | replace " " "-" }}
    contains: {{ contains "cat" "catch" }}                  # R: true
    b64enc:   {{ b64enc "hello" }}
```

### if

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-if
data:
  dev:
    env: {{ .Values.dev.env }}
    {{- if eq .Values.dev.env "dev" }}
    log: debug
    {{- else if .Values.dev.log }}
    log: {{ .Values.dev.log }}
    {{- else }}
    log: error
    {{ end }}
    
  prod:
    env: {{ .Values.prod.env }}
    {{ if eq .Values.prod.env "dev" }}
    log: debug
    {{ else if .Values.prod.log }}
    log: {{ .Values.prod.log }}
    {{ else }}
    log: error
    {{ end }}
```

### with

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-with
data:
  dev:
  {{- with .Values.dev }}
    env: {{ .env }}
    log: {{ .log }}
  {{- end }}

  qa:
  {{- with .Values.qa }}
    env: {{ .env }}
    log: {{ .log }}
  {{- end }}
  
  prod:
  {{- with .Values.prod }}
    env: {{ .env }}
    log: {{ .log }}
  {{- end }}
```

### range

```text
apiVersion: v1
kind: ConfigMap
metadata:
  name: flow-range
data:
  yaml:
  {{- .Values.data | toYaml | nindent 2 }}

  range:
  {{- range .Values.data }}
  - {{ . }}
  {{- end }}

  range-quote:
  {{- range .Values.data }}
  - {{ . | quote }}
  {{- end }}

  range-upper-quote:
  {{- range .Values.data }}
  - {{ . | upper | quote }}
  {{- end }}
```