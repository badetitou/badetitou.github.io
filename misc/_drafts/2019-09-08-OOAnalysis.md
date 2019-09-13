---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Analyze OO project"
date:   2019-09-08 18:16:00 +200
categories: moose pharo
---

When I discover a new project I always do the same analysis.
So I decided to create a little project with my scripts to gather important information.
In this post, I present how to use my scripts with a java project.

## Preparation

In this post, we will extract information from the Traccar project.
Traccar is a Java application that used the GWT framework to create a Riche Internet Application.
You can download Traccar [re](https://github.com/).

Once the application is downloaded, we generate an _.mse_ file thanks to (VerveineJ)[https://github.com/moosetechnology/VerveineJ].
Please refer to the [VerveineJ documentation](moose-wiki ref) for more details.

The analysis are done with [Moose](github moose wiki).
First of all, we need to [download a Moose 8 image](tuto begin moose wiki).

Finally, we load the _.mse_ file in Moose.

```st
"Import the model in moose"
model := FAMIXMooseModel importFromMSEStream: './path/to/file.mse' asFileReference readStream.
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

Once the tool is installed, open the System Browser and check the class `OOAnalysis`.
You can execute from the browser the methods by clicking on the methods icon.
Each method will execute a common analyse on the loaded model.

In the following, I describe the analysis.

