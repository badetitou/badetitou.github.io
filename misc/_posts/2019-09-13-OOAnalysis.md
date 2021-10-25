---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Analyze OO project"
subtitle: "I present a tool that does a quick analysis of Java projects With Moose"
header-img: "misc/img-2019-09-13-OOAnalysis/background.jpg"
date:   2019-09-13 12:00:00 +200
tags: moose pharo
---

When I discover a new project I always do the same analysis.
So I decided to create a little project with my scripts to gather important information.
In this post, I present how to use my scripts with a java project.

## Preparation

In this post, we will extract information from the [Traccar project](https://github.com/traccar/traccar-web).
Traccar is a Java application that used the GWT framework to create a Riche Internet Application.
You can download Traccar.

Once the application is downloaded, we generate a _.mse_ file thanks to [VerveineJ](https://github.com/moosetechnology/VerveineJ).
Please refer to the [VerveineJ documentation](https://moosetechnology.github.io/moose-wiki/projects/parsers/VerveineJ.html) for more details.

The analysis is done with [Moose](https://moosetechnology.github.io/moose-wiki/).
First of all, we need to [download a Moose 8 image](https://moosetechnology.github.io/moose-wiki/Beginners/InstallMoose.html).

Finally, we load the _.mse_ file in Moose.

```st
"Import the model in moose"
model := FAMIXMooseModel importFromMSEStream: './path/to/file.mse' asFileReference readStream.
model rootFolder: '/path/to/rootfolder'.
"Add the model in the Moose Panel and compute some metrics"
model install.
```

## Installation

My scripts are available on github.
You can easily install them by executing the following line in a playground:

```st
Metacello new
    githubUser: 'badetitou' project: 'OOAnalysis' commitish: 'master' path: '.';
    baseline: 'OOAnalysis';
    load
```

## The analysis

Once the tool is installed, open the System Browser and check the class `OOCriticsVisu` with the protocol `software visualization`.
You can execute the methods from the browser by clicking on the methods icon.
Each method will execute a common analysis on the loaded model.

In the following section, I describe the analysis.

### Queries

#### Main methods

`#mainMethods` searches the main methods inside the Java project.
In the case of Traccar there is none since the project is run by the GWT framework.
In other projects, you can find several mains.
It may be interesting to understand why.
Probably some are used for testing.

#### God classes by lines

`#godClassesByLines` returns the classes with more than 150 lines of code.
In Traccar, it founds 36 classes.

```st
model allModelClasses select: [ :each | each numberOfLinesOfCode > 150 ]
```

First, it asks the model all the model classes (the classes that are part of Traccar, excluding the classes from its dependencies).
Then, it select classes with a number of line of code superior to 150.

#### God classes by methods

`#godClassesByMethods` returns the classes with more than 50 methods.
In Traccar, there are 4 god classes with more than 50 methods.

```st
model allModelClasses select: [ :each | each numberOfMethods > 50 ]
```

First, it asks the model all the model classes (the classes that are part of Traccar, excluding the classes from its dependencies).
Then, it selects classes with a number of methods superior to 50.

### Visualizations

#### Class diagram

`#classDiagram` shows the class diagram of the project.
It uses Roassal to create the visualization.

```st
| b |
b := RTMondrian new.
b nodes: model allClasses.
b edges connectFrom: #superclass.
b layout tree.
b build.
^ b view
```

First, it creates a mondrian.
Then, it defines the nodes of the visualization, in our case, it is all the classes of the model.
It connects the nodes by asking for the `#superclass`.
Finally, it defines the layout as a tree.

#### Packages hierarchy with complexity

`#packagesHierarchyWithComplexity` shows the package hierarchy and their complexity.
The width corresponds to the number of classes.
The height corresponds to the number of methods.
The color corresponds to the number of lines of code.
In Traccar, the most important packages seems to be _org::traccar::web::client::view_ and _org::traccar::web::server::model_.

```st
b := RTMondrian new.
b shape rectangle
    width: [ :p | p numberOfClasses ];
    height: [ :p | p numberOfMethods ];
    linearFillColor: #numberOfLinesOfCode within: model allModelNamespaces entities;
    borderColor: Color lightGray.
^ b
    nodes: model allModelNamespaces;
    edgesFrom: #parentScope;
    treeLayout;
    build;
    view
```

First, it defines how an element should be displayed.
Then , it adds the namespaces (packages) as nodes and connect them with the `#parentScope` keyword.
Finally, it defines the layout as a tree.
