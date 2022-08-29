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
    participant VSCode as VSCode (Client IDE)
    participant Pharo as Pharo (Language Server)
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

In short, the client (IDE) opens the server.
Then, it creates a connection with the client, for instance using a socket.
Finally, client and server exchanges information following the protocol.

## Pharo Language Server Installation

Installing the Pharo Language server is made easy thanks to a Pharo baseline.
After downloading a [Pharo 10](https://pharo.org) image, you can install the project using the following script:

```st
Metacello new
  githubUser: 'badetitou' project: 'Pharo-LanguageServer' commitish: 'v3' path: 'src';
  baseline: 'PharoLanguageServer';
  load
```

To do so, after launching a Pharo image, open a playground with <kbd>Ctrl+O+W</kbd>, copy and paste the above code snippet, and execute it.

## Pharo Language Server Structure

In the following, we describe the strcuture and the main classes of the Pharo Language Server project.
We only describe the Pharo code and not the one that can be present in the client extension (used in the IDEs).

### Package architecture

The all project is included inside the package `PharoLanguageServer`.
The package is then split into tags.

- *Uncategorized* contains the core of the server
- *Document* and *TonelUtils* contain the pharo code representation for the Pharo implementation of the Language Server Protocol (*i.e.* if you want to code in Pharo from VSCode)
- *Handler* contains some override of JRPC Pharo implementation to ease its usage by the Pharo Language Server Protocol
- *Structure-* contains all the structure send and received by the server. Structures are grouped depending on the protocol they are related to (*e.g.* `PLSDocumentSymbol` is linked to retriving symbols using the protocol)

### Server class architecture

The two main classes of interest are `PLSAbstractServer` and `PLSServer`.
`PLSAbstractServer` contains all the logic of a server implementing the Language Server Protocol.
`PLSServer` is the class implementing the Language Server Protocol in the case of using it for the Pharo programming language.

Each class follow the same coding convention/architecture for the method protocols.

- *starting* contains the main method `start` used when starting the server and the required method to resolved message that are sent and received.
- *lsp-* contains the methods to implement the protocol
- *pls-* contains extension of the protocol (*e.g.* configuring the debug mode thought the protocol, or accessing to new specific features).

### Starting the server

### Method of the protocol

Every method of the protocol is implemented as a method in the server.
Thoses methods are categorised in protocol following the Language Server Protocol specification.
For example, the method relative to [Language Server Protocol Hover](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_hover) are inside the protocol *lsp - hover*.

The Pharo method uses as pragma the requested remote method by the protocol.
For example, for hover, it is the method `textDocument/hover`, so the implementation uses the pragma as follow.

```st
textDocumentHoverWithPosition: position textDocument: textDocument
    <jrpc: #'textDocument/hover'>
    self subclassResponsibility
```

The pharo method also implement at least as many arguments as the client can send.
In the hover example, the specification declares that the sent object is the `HoverParams`:

```ts
interface TextDocumentPositionParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The position inside the text document.
     */
    position: Position;
}


export interface HoverParams extends TextDocumentPositionParams, WorkDoneProgressParams {
}
```

> the current version of the server ignore the `WorkDoneProgressParams` for now

So the method must at least accept attributes with the name: `textDocument` and `position`.
If the pharo method has more available arguments, they will be filled with nil.
If the incoming data have arguments in an incorrect order, the server will sort them first.
If the incoming data have an unknow argument, it will be ignore.

The return of the Pharo method **must be** a PLS structure that implement the method `asJRPCJSON`.
This method will convert the pharo object to be transmitted to the client.

For example, for the `PLSServer` (see snippet of code below).
The dictionary and `PLSHover` implement `asJRPCJSON`.

```st
textDocumentHoverWithPosition: position textDocument: textDocument
    <jrpc: #'textDocument/hover'>
    | hover document |
    document := (self context textItem: (textDocument at: #uri)). 
    hover := PLSHover new
        context: self context;
        source: document;
        position: position;
        yourself.
    ^ { #contents -> hover contents } asDictionary
```

## Extending the Abstract Language Server to implement a new one
