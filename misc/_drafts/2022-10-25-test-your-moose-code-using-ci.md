---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Test your Moose code using CIs"
date: 2022-10-25 00:00:00 +200
tags: misc moose 
---

You have to test your code!

I mean, *really*.

But sometimes, testing is hard, because you do not know how to start (often because it was hard to start with TDD or better XtremTDD :smile:).

One challenging situation is the creation of mock to _represent_ real cases and use them as test resources.
This situation is common when dealing with code modelization and meta-modelization.

Writing manually a model to test features on it is hard.
Today, I'll present you how to use GitHub Actions as well as GitLab CI to create tests for the Moose platform based on real resources.

---

First of all, let's describe a simple process when working on modelization and meta-modelization.

{% mermaid %}
flowchart LR
    SourceCode(Source Code) --> Parse --> modelfile(Model File) --> Import --> model(Model in Memory) --> Use
{% endmermaid %}

When performing a software system analysis using MDE, everything starts with parsing the source code of the application to produce a model.
This model can then be stored in a file.
Then, we import the file into our analysis environment, and we use the concrete model.

All these steps are performed before using a model.
*However*, when we create tests for the `Use` step, we do not perform all the steps before.
We create a mock model.
Even if this situation is comfortable, it is error-prone and makes easy un-synchronization between tools to manipulate a model, and tools that create a model.

One solution is thus not to create a mock model, but to create mock source code files.

## Proposed approach

Using mock source code file, we can reproduce the process for each test (or better, a group of tests :wink:)

```mermaid
flowchart LR
    SourceCode(Mock Source Code) --> Parse(Parse with Docker) --> modelfile(Model File) --> Import(Import with script) --> model(Model in Memory) --> Test
```

In the following, I describe the implementation/set-up of the approach for Pharo and Moose.
It consists of the following steps:

- Create mock ressources
- Create a bridge from your Pharo image to your resources using PharoBridge
- Create a GitLab Ci or a GitHub Action
- Test :heart:

## Create mock ressources

The first step is to create mock resources.
To do so, the easiest way is to include them in your git repository.

You should have:

```raw
> ci // Code executed by the CI
> src // Source code files
> tests // Tests ressources
```

Inside the `tests` folder, it is possible to add several sub-folders for different test resources.

## Create a Pharo Bridge

To easily use the folder of the test resource repository from Pharo, we will use the Pharo Bridge project.

The project can be added to your Pharo Baseline with the following piece of code:

```st
spec
    baseline: 'GitBridge'
    with: [ spec repository: 'github://jecisc/GitBridge:v1.x.x/src' ].
```

Then, to connect our Pharo project to the test resources, we create a class in one of our packages, a subclass of `GitBridge``.

A full example would be:

```st
Class {
    #name : #MyBridge,
    #superclass : #GitBridge,
    #category : #'MyPackage-Bridge'
}

{ #category : #initialization }
MyBridge class >> initialize [

    SessionManager default registerSystemClassNamed: self name
]

{ #category : #'accessing' }
MyBridge class >> testsResources [
    ^ self root / 'tests'
]
```

The method `testsResources` can then be used to access the local folder with the test resources.

**Be careful**, this setup only works locally for now.
To use it with GitHub and GitLab, we first have to set up our CI files.

## Set up CI files

To set up our CI files, we first create in the `ci` folder of our repository a `pretesting.st` file that will execute Pharo code.

```st
(IceRepositoryCreator new
    location: '.' asFileReference;
    subdirectory: 'src';
    createRepository) register
```

This code will be run by the CI and register the Pharo project inside the Iceberg tool of Pharo.
This registration is then used by GitBridge to retrieve the location of the test resources folder.

Then, we have to update the `.smalltalk.ston` file (used by every Smalltalk ci process) and add a reference to our `pretesting.st` file.

```st
SmalltalkCISpec {
  #preTesting : SCICustomScript {
    #path : 'ci/pretesting.st'
  }
  ...
}
```

### Set up GitLab CI

The last step for GitLab is the creation of the `.gitlab-ci.yml` file.

This CI can include several steps.
We now present the steps dedicated to testing the Java model, but the same steps apply to other programming languages.

First, we have to parse the tests-resources using the [docker version of VerveineJ](https://hub.docker.com/r/badetitou/verveinej)

```yml
stages:
  - parse
  - tests

parse:
  stage: parse
  image:     
    name: badetitou/verveinej:v3.0.0
    entrypoint: [""]
  needs:
    - job: install
      artifacts: true
  script:
    - /VerveineJ-3.0.0/verveinej.sh -Xmx8g -Xms8g -- -format json -o output.json -alllocals -anchor assoc -autocp ./tests/lib ./tests/src 
  artifacts:
    paths:
      - output.json
```

The `parse` stage uses the `v3` of VerveineJ, parses the code, and produces an `output.json`` file including the produced model.

Then, we add the common `tests` stage of Smalltalk ci.

```yml
tests:
  stage: tests
  image: hpiswa/smalltalkci
  needs:
    - job: parse
      artifacts: true
  script:
    - smalltalkci -s "Moose64-10"
```

This stage creates a new `Moose64-10` image and performs the CI based on the `.smalltalk.ston` configuration file.

### Setup GitHub CI

The last step for GitLab is the creation of the `.github/workflows/test.yml` file.

In addition to a common smalltalk-ci workflow, we have to configure differently the checkout step, and add a step that parses the code.

For the checkout step, GitBridge (and more specifically Iceberg) needs the history of commits.
Thus, we need to configure the checkout actions to fetch the all history.

```yml
- uses: actions/checkout@v3
  with:
    fetch-depth: '0'
```

Then, we can add a step that runs VerveineJ using its docker version.

```yml
- uses: addnab/docker-run-action@v3
  with:
    registry: hub.docker.io
    image:  badetitou/verveinej:v3.0.0
    options: -v ${{ github.workspace }}:/src
    run: |
      cd tests
      /VerveineJ-3.0.0/verveinej.sh  -format json -o output.json -alllocals -anchor assoc .
      cd ..
```

Note that, before running VerveineJ, we move (*cd*) to the tests location to better deal with sourceAnchor of Moose.

## Test

