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

## Install VSCode and the Pharo Language Server extension

To perform the analysis, we will use the insider version of VSCode.
Currently, only this version supports the [NoteBook feature](https://code.visualstudio.com/api/extension-guides/notebook) we will use.

So, as a first step, install the last [VSCode insider version](https://code.visualstudio.com/insiders/).

We will also need a Moose image and a Pharo VM.
For this blog post, we will use a Moose8 image based on Pharo 8.

- Download the last [Moose 8 image for VSCode](https://github.com/badetitou/Pharo-LanguageServer/releases/download/continuous/Moose64-8.0-PLS.zip) and extract it.
- Download the [corresponding Pharo VM](https://files.pharo.org/get-files/80/) and extract it.

Once you have download VSCode, Moose 8, and the Pharo VM, we will install the extension in VSCode.

- Launch VSCode

In the extension panel, install [`Pharo Language Server`](https://marketplace.visualstudio.com/items?itemName=badetitou.pharo-language-server).

