---
author: Benoît "badetitou" Verhaeghe
layout: project
title:  "Pharo Language Server Developers documentation"
date:   2022-08-29 10:00:00 +200
categories: vscode pharo _ignore
description: "Pharo Language Server documentation"
---

The project [Pharo Language Server](https://github.com/badetitou/Pharo-LanguageServer) is an implementation of the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) proposed by Microsoft and implemented by several IDE such as emacs, eclipse, Intellij Idea, VSCode...
The project GitHub repository includes:

1. An abstract layer that can be extended to create a new dedicated language server (for example: for the Java Programming Language)
2. A Pharo Language Server implementation that works well with the [pharo-vscode](https://marketplace.visualstudio.com/items?itemName=badetitou.pharo-language-server) plugin.
3. A [Debug Adapted protocol](https://microsoft.github.io/debug-adapter-protocol/) implementation for Pharo (that needs another documentation page and is not discussed here).

In this documentation page, we present quickly the protocol, how one can download and install the Pharo Language Server project, its structure, and how to extends it.

## Language Server Protocol

The language server protocol consists of enabling communication between several IDE and language servers.
Thus, the IDE is a *client* and the language server is a *server*.
An IDE can interact with serveral servers at the same time.

The bellow sequence diagram present the start of the project

{% mermaid %}
sequenceDiagram
    activate VSCode
    VSCode->>Pharo: Start Pharo
    activate Pharo
    VSCode->>Pharo: What is the port of Language Server Protocol?
    Pharo-->>VSCode: It's 40520!
    activate Pharo
    VSCode->>+Pharo: Initialized?
    Pharo->>-VSCode: Initialized!
    VSCode->>+Pharo: This is my capabilities. What are yours?
    Pharo->>-VSCode: Capabilities!
    loop Client ask for feature | Example:
        VSCode->>+Pharo: What about completion?
        Pharo->>-VSCode: Complete this text with this snippet
    end
    VSCode->>Pharo: I'm done
    Pharo->>VSCode: OK bye!
    deactivate VSCode
    deactivate Pharo
{% endmermaid %}

## Pharo Language Server Installation

## Pharo Language Server Structure

## Extending the Abstract Language Server to implement a new one
