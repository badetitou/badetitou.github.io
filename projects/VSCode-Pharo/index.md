---
author: Benoît "badetitou" Verhaeghe
layout: project
title:  "VSCode - Pharo"
date:   2021-01-07 11:00:00 +200
categories: vscode pharo _ignore
---

VSCode Pharo is an extension that enables the support of the Pharo programming language in [Visual Studio Code](https://code.visualstudio.com/).

> This page is announcing the creation of the extension, it might not be up-to-date. Please see the [GitHub repository](https://github.com/badetitou/vscode-pharo) for more information.

Here, we are detailing how to set-up VSCode to use the extension, then we present the main features of the extension, and future features.

## Installation

Five steps are required to install the plugins.

1. Install [VSCode](https://code.visualstudio.com/)
2. Install the [Pharo extension](https://marketplace.visualstudio.com/items?itemName=badetitou.pharo-language-server)
3. Download a [Pharo Language Server image](https://github.com/badetitou/Pharo-LanguageServer/releases) or [install the server](https://github.com/badetitou/Pharo-LanguageServer#installation) in a pre-existing image 
4. Download a [VM](https://files.pharo.org/vm/pharo-spur64-headless/) (headless or not) for the image
5. Set up the Pharo extension property
   1. `pharo.pathToVM`: is the path to the VM executable
   2. `pharo.pathToImage`: is the absolute path to the image

## Features

We present here the existing features

### Generic feature

{: .browser-default}
- Code highlighting

![Highlighting](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/highlighting.png){: .center-image}

### Supported Language Server feature

{: .browser-default}
- Code formatting

![Format gif](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/format.gif){: .center-image}

{: .browser-default}
- Hover

When moving a cursor over a class, it shows the comment of the class.
The hover popup supports markdown. So it can be use to print nice comment from Pharo 9.

![Hover](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/hover.png){: .center-image}

{: .browser-default}
- Auto-completion

We used the completion engine of Pharo to compute the entries.
Not that for keywords with several symbols, it is possible to use the `<Tab>` key to move from one argument to another.

![Auto-Completion](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/Auto-completion.gif){: .center-image}

### Additional feature

The additional feature can be access using the command palette of VSCode

{: .browser-default}
- Save the Pharo image
- Execute and show the result

![Inspect gif](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/inspectResult.gif){: .center-image}

{: .browser-default}
- Execute and print the result

![Print gif](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/printResult.gif){: .center-image}

{: .browser-default}
- Keep variable state

![Keep Variable state gif](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/keep-variable-state.gif){: .center-image}

{: .browser-default}
- Show the current server version

![Show version gif](https://raw.githubusercontent.com/badetitou/vscode-pharo/main/docs/img/pharo-version.gif){: .center-image}

{: .browser-default}
- Saving a tonel file in VSCode, save the corresponding methods/class in the Pharo image

## Future

Three major features are coming (*and will require time*).

1. Synchronization
   1. From Pharo to VSCode
   2. From VSCode to Pharo
2. Debug Adapter Protocol
3. Notebook ([VSCode preview](https://code.visualstudio.com/api/extension-guides/notebook))

### Synchronization

We plan to add commands to VSCode to allow synchronization between Pharo and VSCode.
The idea is to be able to install a set of classes from the VSCode editor inside the opened Pharo Image. A typical use case is then:

1. Clone from git a Pharo project
2. Open the project in VSCode
3. Synchronize the project with the image
4. Developing :rocket:

Another possibility will be to synchronize a project already present in the image with a ongoing VSCode session. A typical use case is then:

1. Open VSCode
2. Install a project using Metacello with a VSCode command
3. Synchronize the interesting projects inside the VSCode editor
4. Developing :rocket:

### Debug Adapter Protocol

[Debug Adapter Protocol (DAP)](https://microsoft.github.io/debug-adapter-protocol/) is a generic protocol that can be used to control debugger.
We plan to add support of the DAP over our extension.
With this extension, it will be possible to debug Pharo application using [several editors (VSCode, Emacs, Vim, Eclipse, ...)](https://microsoft.github.io/debug-adapter-protocol/implementors/tools/).

### Notebook

VSCode is currently testing a [Notebook](https://code.visualstudio.com/api/extension-guides/notebook) feature (as [Jupyter](https://jupyter.org/)).
We already have most of the required material to implement a Pharo Notebook using the VSCode API.
This will be our priority as soon as the stable VSCode notebook API will be released. 
