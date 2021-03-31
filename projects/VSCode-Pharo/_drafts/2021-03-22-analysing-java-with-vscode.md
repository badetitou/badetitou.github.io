---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Analysing Java with VSCode"
subtitle: "How to use VSCode and Pharo to analyse Java projects"
date:   2021-03-22 12:00:00 +200
categories: pharo vscode
---

[VSCode](https://code.visualstudio.com/) is an incredible editor tool.
Thanks to its extension, one can develop using plenty of programming languages.
However, what about analyzing one to understand a software system better?

In this blog post, I will present you how to use VSCode with [Moose](http://moosetechnology.github.io/) to analyze Java code.
As an example, I will reproduce the blog post of [Christopher Fuhrman](https://fuhrmanator.github.io/2019/07/29/AnalyzingJavaWithMoose.html).

> Even if we can perform some analysis from VSCode, using the Moose tool natively gives a better user experience.
> Still, I believe it might interest people using only the VSCode tool.

- [Install VSCode and the Pharo Language Server extension](#install-vscode-and-the-pharo-language-server-extension)
  - [Download and install the required tools](#download-and-install-the-required-tools)
  - [Configure VSCode](#configure-vscode)
- [Set up the analysis of a new project](#set-up-the-analysis-of-a-new-project)
  - [Clone the Java project you want to analyze](#clone-the-java-project-you-want-to-analyze)
  - [Parse the Java code to make FAMIX model](#parse-the-java-code-to-make-famix-model)
  - [Load the model](#load-the-model)
- [Analysis](#analysis)
  - [Visualize a Java package in PlantUML](#visualize-a-java-package-in-plantuml)
  - [Perform a Moose analysis using Pharo](#perform-a-moose-analysis-using-pharo)
  - [Visualisation with Roassal](#visualisation-with-roassal)
- [Ressource](#ressource)

## Install VSCode and the Pharo Language Server extension

### Download and install the required tools

To perform the analysis, we will use the insider version of VSCode.
Currently, only this version supports the [NoteBook feature](https://code.visualstudio.com/api/extension-guides/notebook) we will use.

So, as a first step, install the last [VSCode insider version](https://code.visualstudio.com/insiders/).

We will also need a Moose image and a Pharo VM.
For this blog post, we will use a Moose8 image based on Pharo 8.

- Download the last [Moose 8 image for VSCode](https://github.com/badetitou/Pharo-LanguageServer/releases/download/continuous/Moose64-8.0-PLS.zip) and extract it.
- Download the [corresponding Pharo VM](https://files.pharo.org/get-files/80/) and extract it.

Once you have download VSCode, Moose 8, and the Pharo VM, we will install the extension in VSCode.

- [Download the extension](../../../files/pharo-language-server-0.0.11.vsix)
- Open VSCode insider
- Open the folder in which the extension file is present
- Right-click on the file and execute `Install Extension`

![Install extension](/img/posts/analysing-java/install-extension.png){: .img-fill }

- Close VSCode

From now on, you **must** start VSCode insider with the following parameters (`--enable-proposed-api badetitou.pharo-language-server`).
It allows VSCode to use the Notebook API.

```sh
code-insiders --enable-proposed-api badetitou.pharo-language-server
```

### Configure VSCode

We now need to configure the Pharo Language Server extension.
To do so:

- go in the VSCode settings (`Ctrl + ,`).
- Search Pharo settings
- Set the field `Path To Image` with the path to the image you have downloaded
- Set the field `Path To VM` with the path to the VM you have downloaded
- Restart VSCode (to be sure the configuration is well saved)

> If you use Windows, you might remove all space characters in the path.

Once the configuration is done, you can create a new file named `oo-analysis.moosebook`.
It should open as a VSCode notebook and a Pharo image (you can reduce the Pharo image, but **do not close it**).

## Set up the analysis of a new project

### Clone the Java project you want to analyze

First, we are going to download the GitHub project we want to analyze.
To do so, create a new `code cell` in VSCode with the following code:

```st
javaProjectFileRef := MooseEasyUtility cloneGitHubRepo: 'https://github.com/bethrobson/Head-First-Design-Patterns'.
```

This piece of code will download the project under our Pharo image folder.
To execute the cell, press the run arrow next to the cell.
In case of success, a little tick appears and the path to the clone project has output of the cell.

![Cell executed after clone](/img/posts/analysing-java/clone.png){: .img-fill }

### Parse the Java code to make FAMIX model

As in the original blog post of Christopher, now we will parse the Java project and create a FAMIX model.
To parse the Java project, we use VerveineJ v1.x.x (v1.x.x works with Moose 8, whereas v2.x.x is under modification to work with the future Moose 9).

Contrary to the original blog post, we will download VerveineJ v1.0.2 (and not v1.0.1).
It includes nice fixes.

- Create a new code cell with the following piece of code to download the last VerveineJ version and extract it

  ```st
  client := ZnClient new.
    client
        signalProgress: false;
        url: 'https://github.com/moosetechnology/VerveineJ/archive/v1.0.2.zip';
        downloadTo: FileLocator imageDirectory.
    client isSuccess
        ifTrue: [ ZipArchive new
                readFrom: (FileLocator imageDirectory / 'v1.0.2.zip') asFileReference pathString ;
                extractAllTo: FileLocator imageDirectory.

            "Since permissions are not preserved with ZipArchive#extractAllTo:"
            "This line is not required in Windows system"
            LibC runCommand: 'chmod u+x ', (FileLocator imageDirectory / 'VerveineJ-1.0.1/verveinej.sh') asFileReference pathString ]
        ifFalse: [ Error signal: 'Download failed.' ]
  ```

- Then, we will ask `MooseEasyFamixMaker` to parse the Java project using [VerveineJ](https://modularmoose.org/moose-wiki/Developers/Parsers/VerveineJ), and create a `.mse` file for us. Again, in another cell, execute the following snippet of code.

  ```st
  wizard := MooseEasyFamixMaker
     generateMSETo: 'tmp/HFDP.mse' asFileReference
     parsing: 'tmp/MooseEasyRepos/bethrobson__Head-First-Design-Patterns' asFileReference
     with: (FileLocator imageDirectory / 'VerveineJ-1.0.2/verveinej.bat') asFileReference.
  wizard generateMSE.
  ```

> `.mse` is a file format used by Moosetechnology to represent its model and meta-model

### Load the model

The last step is to load the model in the Moose image (the one we are controlling using VSCode).
In a new cell, execute:

```st
mseFileRef := 'tmp/HFDP.mse' asFileReference. "Generated by FamixMaker"
mseStream := mseFileRef readStream.
mseStream
 ifNotNil: [ 
  mooseModel := MooseModel importFromMSEStream: mseStream. 
  mooseModel rootFolder:
      'tmp/MooseEasyRepos/bethrobson__Head-First-Design-Patterns'.
  mseStream close. ]
 ifNil: [ self error: 
    'Could not load MSE file into Moose: ' , mseFileRef asString ].
mseStream.
mooseModel install
```

The output of the cell should be `a MooseModel #HFDP(30946)`.

Congrats! You have set up everything. Now it is time to analyze the project :rocket:

## Analysis

### Visualize a Java package in PlantUML

To visualize Java packages using PlantUML.
We first install the PlantUML connector of Pharo (`PlantUMLPharoGizmo`).

To do so, simply create a new code cell with the installation script and execute it.

```st
"Install PlantUMLPharo"
version := 'master'.
Metacello new
  repository: 'github://fuhrmanator/PlantUMLPharoGizmo:' , version, '/src';
  baseline: 'PUGizmo';
  load.
```

Then, you can visualize the classes of a package by executing a Pharo Script.

```st
attribute := true.
method := false.
inheritance := true.
aggregation := true.
createCheckBox := false.

preference := 'set namespaceSeparator ::' , String cr
  , 'hide empty members' , String cr , 'scale 1' , String cr
  , 'left to right direction' , String cr.

items := mooseModel allModelClasses select: [:each | each mooseName beginsWith: 'headfirst::designpatterns::combining::decorator' ].


pUMLSource := PUGizmo
  plantUMLSourceForMooseJavaClasses: items
  withPreference: preference
  withRelationships:
   {attribute.
   method.
   inheritance.
   aggregation.
   createCheckBox}.

plantKey := pUMLSource asPlantUMLKey.
serverUrl := 'https://www.plantuml.com/plantuml/img/', plantKey.  
imageMorph := (ZnEasy getPng: serverUrl asUrl).
```

In the above example, as in the original blog post, we focus on the package: `headfirst::designpatterns::combining::decorator` and we show the classes attributes, inheritances, and aggregation.
Executing the code gives the following image as the output of the VSCode cell.

![Output after cell execution](/img/posts/analysing-java/package-analysis.png){: .img-fill }

### Perform a Moose analysis using Pharo

It is also possible to execute some classic Pharo code.
We can request the list of classes that implement more than one interface.

```st
"Query all classes that have more than two direct FAMIX superclasses"
classesImplementingMoreThanOneInterface := mooseModel allModelClasses 
 select: [ :each | 
  each directSuperclasses size > 2 ].
String streamContents: [ :stream | classesImplementingMoreThanOneInterface do: [:class | stream << class name ] separatedBy: [stream << ', ' ] ]
```

![Output after cell execution](/img/posts/analysing-java/more-than-one-interface.png){: .img-fill }

### Visualisation with Roassal

Finally, one can use [Roassal2](https://github.com/ObjectProfile/Roassal2) (or Roassal3 in Pharo 9) to create custom visualization.

It is possible to use pre-built visualization coming from Moose, such as the System Nesting map:

```st
view := RTView new.
FAMIXSystemNestingMap new
  viewNamespaces: (mooseModel allNamespaces select: [ :each | each allClasses anySatisfy: [ :c | c isStub not ] ])
  highlighting: {}
  onRaw: view.
view
```

![Output after cell execution nexting map](/img/posts/analysing-java/nesting-map.png){: .img-fill }

Or every other Roassal visualization!

## Ressource

- [`.moosebook` file created for this blog post](/files/posts/analysing-java/oo-analysis.moosebook)
