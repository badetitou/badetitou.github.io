---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Integrate Software Enginnering into the everyday world"
date: 2022-09-15 00:00:00 +200
tags: misc moose 
---

*I have been a member of the Berger-Levrault research team for 5 years.
And, one of our main challenges in to integrate our innovation into the day-to-day world of the company.
There are several ways to integrate innovation: as code external library, providing schema, teaching how to use new tools, and so on.
In this blog post, I will present you how we integrate Software Enginneering work in everyday developers tools.*

---

Software Engineering is about helping people developing great software system.
In Software Engineering Research, we built tools that help [migrating your application](https://www.research-bl.com/2022/05/16/casino-a-tool-to-migrate-applications/), or improve your [software architecture](https://www.research-bl.com/2022/01/27/backend-monolithic-app-to-microservices-architecture-migration-1st-part/).

However, these kind of innovation are not meant to be used everyday.
For instance, once the application is migrated, people do to reuse (for the same application) the migration tool.

Other innovation are about designing [new visualizations](https://www.research-bl.com/2022/08/09/visualize-your-codebase-with-moose/), or providing *diagnostics* about the code.
These kinds of innovation are better when updated automatically with the code.
Indeed, when using a map, people expect the map to be update.
The same applies for software maps or code critics.
Another constraints for developers is that using these innovations must be as easy and integrated with their current tools as possible.

At Berger-Levrault, we use [Moose](https://modularmoose.org/) to analyse software systems.
Moose allows us to create visualization and diagnostics about the code.
Today, we will present how one can produce a basic UML vizualisation of its code and integrate it into the GitLab wiki.
Then, we present how to integrate Moose advanced diagnostics to the well known [SonarQube tool](https://www.sonarqube.org/).

## Perform analysis in a CI

The first step to perform analysis when developers are working on the code is to use the CI to perform our analysis.
The main process is the following: developers edit code, push the code to a git repository, the CI install the code dependency, our tool analyze the code, new results are send to developers tools.

{% mermaid %}
flowchart TD
    E("Developers edit code") --> EPush("Developers push code")
    EPush --> CIInstall("CI installs the code dependency (maven)")
    CIInstall --> moose("We perform code analysis")
    moose-- Send results -->GitLabWiki(GitLabWiki) & Sonar(SonarQube)
{% endmermaid %}

Considering the GitLab Ci, two preliminary steps are required to perform the analysis.
The figure below present the gitlab ci file (`.gitlab-ci.yml`)

```yml
stages:
  - install
  - parse

# Install the dependencies
install:
  stage: install
  image:     
    name: kaiwinter/docker-java8-maven
  script:
# '../maven/settings - critics.xml' set the maven repository to './repo'
    - mvn clean install --settings '../maven/settings - critics.xml' -Dmaven.test.skip=true
  artifacts:
    paths:
      - repo

parse:
  stage: parse
  image:     
    name: badetitou/verveinej:v2.0.4
    entrypoint: [""]
  needs:
    - job: install
      artifacts: true
  script:
    - /VerveineJ-2.0.4/verveinej.sh -format json -o output.json -alllocals -anchor assoc -autocp ./repo .
  artifacts:
    paths:
      - output.json
```

The step `install` consist in using maven (in case of java code) to install de project dependency.
This step is optional but helps getting better result in future analysis.

The step `parse` uses [VerveineJ](https://modularmoose.org/moose-wiki/Developers/Parsers/VerveineJ), a tool that parses Java code and produce a model of the code that can be used for analysis.

Once we performed this preliminary steps, we have to ask to the CI to run the analysis and sending the results to the target platform.

## Integrate visualisation to GitLab wiki

To integrate schema to GitLab wiki, there are two options: use native markdown schema, or export visualization as png and integrate the png file to markdown.

In this blog post, we focus in native markdown schema using [MermaidJS](https://mermaid-js.github.io/).
To use mermaid with Moose, we use the [MermaidPharo](https://github.com/badetitou/MermaidPharo/) project.

The configuration of the CI to integrate visualisation to GitLab wiki is done in three steps:

1. we add a configuration file named `.smalltalk.ston`. This file configure the CI to install the project MermaidPharo

    ```txt
    SmalltalkCISpec {
        #loading : [
            SCIMetacelloLoadSpec {
                #baseline : 'MermaidPharo',
                #repository : 'github://badetitou/MermaidPharo:main',
                #directory : 'src',
                #platforms : [ #pharo ],
                #onConflict : #useIncoming,
                #load : [ 'moose' ],
                #onUpgrade : #useIncoming
            }
        ],
        #testing: {
        #failOnZeroTests : false
        }
    }
    ```

2. add a [Pharo](https://pharo.org) script in the file `ci/executeCode.st` that will perform the analysis.

   ```st
    "=== Load MooseModel ==="
    model := FamixJavaModel new.
    './output.json' asFileReference readStreamDo: [ : stream | model importFromJSONStream: stream ].
    model rootFolder: '.'.

    diagram := Famix2Mermaid new
        model: model;
        generateClassDiagram.

    visitor := MeWritterVisitor new.
    visitor endOfLine: String crlf.

    "Export the diagram in the markdown file './wiki-export/mermaid.md'"
    './wiki-export/mermaid.md' asFileReference ensureCreateFile; writeStreamDo: [ :stream |
        stream << '```mermaid'; << String crlf.
        diagram exportWith: visitor to: stream.
        stream << String crlf; << String crlf; << '```'; << String crlf.
    ].

    Stdio stderr << '=== End Pharo ===' << String crlf.
    Smalltalk snapshot: false andQuit: true
   ```

3. Finnaly, we update the `.gitlab-ci.yml` to file execute the Moose analysis, and update the GitLab wiki project

    ```yml
    analyze:
      stage: analyze
      image: hpiswa/smalltalkci
      variables:
        ORIGIN_IMAGE_NAME: BLMoose
      needs:
        - job: parse
        artifacts: true
      script:
        # Set up a Moose Image for the analysis 
        - apt-get install -y wget unzip
        - 'wget -O artifacts.zip --header "PRIVATE-TOKEN: $GILAB_TOKEN" "https://my.private.gitlab.com/api/v4/projects/219/jobs/artifacts/main/download?job=Moose64-10.0"'
        - unzip artifacts.zip

        # Install Moose using .smalltalk.ston
        - smalltalkci -s "Moose64-10" --image "$ORIGIN_IMAGE_NAME/$ORIGIN_IMAGE_NAME.image"

        # Execute analysis code
        - /root/smalltalkCI-master/_cache/vms/Moose64-10/pharo --headless BLMoose/BLMoose.image st ./ci/executeCode.st

        # Set up and update the Wiki
        - export WIKI_URL="${CI_SERVER_PROTOCOL}://username:${USER_TOKEN}@${CI_SERVER_HOST}:${CI_SERVER_PORT}/${CI_PROJECT_PATH}.wiki.git"

        # Disable ssl check that might fail
        - git config --global http.sslverify "false"
        - rm -rf "/tmp/${CI_PROJECT_NAME}.wiki"
        - git clone "${WIKI_URL}" /tmp/${CI_PROJECT_NAME}.wiki
        - rm -rf "/tmp/${CI_PROJECT_NAME}.wiki/wiki-export"
        - rm -rf "/tmp/${CI_PROJECT_NAME}.wiki/wiki-export"
        - mv -f wiki-export /tmp/${CI_PROJECT_NAME}.wiki
        - cd /tmp/${CI_PROJECT_NAME}.wiki

        # set committer info
        - git config user.name "$GITLAB_USER_NAME"
        - git config user.email "$GITLAB_USER_EMAIL"

        # commit the file
        - git add -A
        - git commit -m "Auto-updated file in CI"

        # push the change back to the master branch of the wiki
        - git push origin "HEAD:main"
    ```

## Push advanced diagnostics to SonarQube

Another possible integration is with SonarQube.
Again, to perform the SonarQube integration, we have to modified `.smalltalk.ston`, `ci/executeCode.st`, and `.gitlab-ci.yml`.
We also have to create a `reports/rules/rules.ston` file that contains the rules executes by Moose.

1. For the `.smalltalk.ston`, this time, we load the [FamixCritics to SonarQube project](https://github.com/badetitou/Famix-Critic-SonarQube-Exporter)

    ```ston
    SmalltalkCISpec {
        #loading : [
            SCIMetacelloLoadSpec {
                #baseline : 'FamixCriticSonarQubeExporter',
                #repository : 'github://badetitou/Famix-Critic-SonarQube-Exporter:main',
                #directory : 'src',
                #platforms : [ #pharo ],
                #onConflict : #useIncoming,
                #onUpgrade : #useIncoming
            }
        ],
        #testing: {
        #failOnZeroTests : false
        }
    }
    ```

2. For the `reports/rules/rules.ston`, it includes the rules that Moose will execute when analysing the code. Creating this file is made easy by the Critics browser of Moose. The example below present one rule that checks that Java attributes do not begins with `_`.

    ```ston
    FamixCBContext {
        #contextBlock : '[ :collection | \r\t  collection select: [ :el | el isKindOf: FamixJavaAttribute ] ]',
        #summary : '',
        #name : 'FamixJavaAttribute'
    }FamixCBCondition {
        #query : '[ :entity | entity name beginsWith: \'_\' ]',
        #summary : '# Attribute name cannot begin with _\r\rAn attribute should not begin with `_`',
        #name : 'Attribute name cannot begin with _'
    }OrderedCollection [
        0,
        1
    ]
    ```

3. For the `ci/executeCode.st`, we ask Moose to load the previously defined rules, we execute them, and we generate the SonarQube compatible file from the results

    ```st
    "=== Load MooseModel ==="
    model := FamixJavaModel new.
    './output.json' asFileReference readStreamDo: [ : stream | model importFromJSONStream: stream ].
    model rootFolder: '.'.

    "Run rules"
    criticBrowser := MiCriticBrowser on: MiCriticBrowser newModel.
    './reports/rules/rules.ston' asFileReference readStreamDo: [ :stream | criticBrowser importRulesFromStream: stream ].
    criticBrowser model setEntities: model.
    criticBrowser model run.
    violations := criticBrowser model getAllViolations.
    
    "Export critics to file './reports/sonarGenericIssue.json' asFileReference"
    targetRef := './reports/sonarGenericIssue.json' asFileReference.
    FmxCBSQExporter new
        violations: violations;
        targetFileReference: targetRef;
        export.
    ```

4. Finnaly, we update the `.gitlab-ci.yml` to execute the analysis and send the results to SonarQube

    ```yml
    analyze:
        stage: analyze
        image: hpiswa/smalltalkci
        variables:
            ORIGIN_IMAGE_NAME: BLMoose
        needs:
            - job: parse
            artifacts: true
        script:
            # Set up a Moose Image for the analysis 
            - apt-get install -y wget unzip
            - 'wget -O artifacts.zip --header "PRIVATE-TOKEN: $GILAB_TOKEN" "https://my.private.gitlab.com/api/v4/projects/219/jobs/artifacts/main/download?job=Moose64-10.0"'
            - unzip artifacts.zip

            # Install Moose using .smalltalk.ston
            - smalltalkci -s "Moose64-10" --image "$ORIGIN_IMAGE_NAME/$ORIGIN_IMAGE_NAME.image"

            # Execute analysis code
            - /root/smalltalkCI-master/_cache/vms/Moose64-10/pharo --headless BLMoose/BLMoose.image st ./ci/executeCode.st
        artifacts:
          paths:
            - reports/sonarGenericIssue.json
            expire_in: 1 week
        
    sonar:
        stage: sonar
        image: kaiwinter/docker-java8-maven
        needs:
            - job: analyze
            artifacts: true
        variables:
            MAVEN_CLI_OPTS: '--batch-mode -Xmx10g -XX:MaxPermSize=10g'
            SONAR_URL: 'https://my.private.gitlab.com'
        script:
            - mvn clean install sonar:sonar -Dsonar.projectKey=$PROJECT_KEY -Dsonar.host.url=$SONAR_URL -Dsonar.login=$MOOSE_SONAR_TOKEN -Dsonar.externalIssuesReportPaths=../reports/sonarGenericIssue.json --settings '../maven/settings - critics.xml' -Dmaven.test.skip=true
    ```

Critics are then available using the sonarqube interface.

![Moose issue in SonarQube](/misc/img/2022-09-15-integrate-software-enginnering-into-the-everyday-world/Moose-issue-in-sonarqube.png){: .img-fill }
