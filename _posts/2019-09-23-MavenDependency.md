---
layout: post
title: Maven package 시 참조된 라이브러리 배포하기
date: 2019-09-22 10:00:00
categories: DevOps
comments: true
---

Maven을 이용한 프로젝트 배포시 War의 경우는 자동으로 WEB-INF/lib 에 Dependency 라이브러리들이 복사가 되지만
Jar Package 할 경우에는 Class & Resoueces 만 패키징 된다.
이 경우 Dependency Lib 를 관리 하는데 두가지 방법이 있다.

### 1. 특정 디렉토리에 Dependency Lib 파일 복사

Maven Dependency Plugin에 아래 명령어를 추가 하면 지정된 디렉토리에 Dependency Lib 가 복사 된다.

- _pom.xml_

```xml
<project>
   <build>
    <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-dependency-plugin</artifactId>
          <version>2.3</version>
          <executions>
              <execution>
             <id>copy-dependencies</id>
              <phase>package</phase>
              <goals>
               <goal>copy-dependencies</goal>
              </goals>
            </execution>
          </executions>
         <configuration>
             <outputDirectory>../../${lib.dir}</outputDirectory> <!-- 복사 될 경로 -->
             <overWriteIfNewer>true</overWriteIfNewer>
          </configuration>
        </plugin>
      </plugins>
    </build>
</project>
```

작성이 완료 되었으면 mvn package 한다.

```text
mvn package
```

패키지 수행 후 ../../${lib.dir} 경로에 Dependency Lib 가  복사된 것을 확인 할 수 있다.

### 2. Package 파일 내부에 Dependency Lib 포함 하기

생성하는 jar에 dependency 파일을 모두 포함해서 1개의 jar 파일을 생성하는 방법도 있다.  

- _pom.xml_

```xml
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <!-- NOTE: We don't need a groupId specification because the group is
             org.apache.maven.plugins ...which is assumed by default.
         -->
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.1.1</version>
        <configuration>
          <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
          </descriptorRefs>
        </configuration>
        [...]
</project>
```

또한 어셈블리를 작성한 src.xml을 참조 하도록 지정 할 수 있다.

```xml
<project>
  [...]
  <build>
    [...]
    <plugins>
      <plugin>
        <artifactId>maven-assembly-plugin</artifactId>
        <version>3.1.1</version>
        <configuration>
          <descriptors>
            <descriptor>src/assembly/src.xml</descriptor>
          </descriptors>
        </configuration>
        [...]
</project>
```

어셈블리 작성이 완료 되었으면 mvn package 한다.

```text
mvn package
```

아래와 같은 유형으로 결과물을 얻을 수 있다.

```text
target/sample-1.0-SNAPSHOT-jar-with-dependencies.jar
```


