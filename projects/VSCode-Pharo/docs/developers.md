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

- [Language Server Protocol](#language-server-protocol)
- [Pharo Language Server Installation](#pharo-language-server-installation)
- [Pharo Language Server Structure](#pharo-language-server-structure)
  - [Package architecture](#package-architecture)
  - [Server class architecture](#server-class-architecture)
  - [Starting the server](#starting-the-server)
    - [Extract request](#extract-request)
    - [Handle request](#handle-request)
  - [Method of the protocol](#method-of-the-protocol)
- [Extending the Abstract Language Server to implement a new one](#extending-the-abstract-language-server-to-implement-a-new-one)

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

In this subsection we give some technical description of the starting method of the server.

The server is started by calling the method `PLSAbstractServer>>start`

```st
PLSAbstractServer >> start
    self debugMode ifFalse: [ PLSUIManager withPLSServer: self ].
    self initializeStreams.
    lastId := 0.
    process := [ 
        [ serverLoop ] whileTrue: [ 
            | request |
            request := self extractRequestFrom: clientInStream.
            ('Request: ' , request) recordDebug.
            self handleRequest: request toClient: clientOutStream ] ]
            forkAt: Processor lowIOPriority
            named: 'JRPC TCP connection'
```

First, if the debug mode is not activated, we update the `UIManager` of pharo to use ours instead.
For now, it only enables opening popup in the IDEs instead of the Pharo image.

Then, we initialize the stream that will be used for the communication.

```st
initializeStreams
    | tcpServer |
    withStdIO ifTrue: [ 
        clientInStream := Stdio stdin.
        clientOutStream := Stdio stdout.
        ^ self ].
    tcpServer := Socket newTCP.
    tcpServer listenOn: self port backlogSize: 10.
    Stdio stdout nextPutAll: tcpServer port asString asByteArray.
    Stdio stdout flush.
    serverLoop := true.
    (tcpServer waitForAcceptFor: 60) ifNotNil: [ :clientSocket | 
        clientInStream := SocketStream on: clientSocket.
        clientOutStream := clientInStream.
        self
            logMessage: 'Client connected to Server using socket'
            ofType: PLSMessageType info ]
```

To do so, we first check if the server ask us to be connected using STDIO or, by default, with socket.
For instance, STDIO is used with Eclipse IDE and socket with VSCode.

To configure a socket, we first create a socket with Pharo with an available port.
Then, we send to the client IDE the port thanks to STDIO.
When connected, we set the `clientInStream` and `clientOutStream` with the same socket (since it can be used safely to get and send data).

Once the streams are set, we can perform the main loop that:

1. extract the request from the *in stream* (`extractRequestFrom:`)
2. process and send the response to the *out stream* (`handleRequest:toClient:`)

```st
 [ serverLoop ] whileTrue: [ 
            | request |
            request := self extractRequestFrom: clientInStream.
            ('Request: ' , request) recordDebug.
            self handleRequest: request toClient: clientOutStream ]
```

#### Extract request

The extraction of the request is done in two steps.
It is implemented in the method `extractRequestFrom:`.

```st
extractRequestFrom: stream

    | length startingPoint endPoint result |
    "data is the current buffer state"
    length := -1.
    [ length = -1 and: [ serverLoop ] ] whileTrue: [ 
        [ data ifEmpty: [ data := (stream next: 25) asString ] ]
            on: ConnectionTimedOut
            do: [ self log: 'timeout but still work' ].
        length := self extractLengthOf: data ].
    startingPoint := data indexOf: ${.
    endPoint := data findCloseBracesFor: startingPoint.
    result := String new: length.
    "three options"
    "startingPoint and endPoint are found"
    (startingPoint ~= 0 and: [ endPoint ~= 0 ]) ifTrue: [ 
        result := data copyFrom: startingPoint to: endPoint.
        data := data copyFrom: endPoint + 1 to: data size.
        ^ result ].
    startingPoint = 0
        ifTrue: [ "none were found" 
            self getDatafromPosition: 1 fromSocket: stream in: result ]
        ifFalse: [ "only startingPoint is found"
            (data copyFrom: startingPoint to: data size) withIndexDo: [ 
                :each 
                :index | result at: index put: each ].
            self
                getDatafromPosition: data size - startingPoint + 2
                fromSocket: stream
                in: result ].
    data := ''.
    ^ result
```

1. We extract the length of the complete request. This work is done by `extractLengthOf:` once we receive first data.
2. Then, based on the known length of incoming data, we extract the full request.

#### Handle request

Handling a request is also done in several steps.
It is implemented in the method `handleRequest:toClient:`.

{% mermaid %}
flowchart TD
    parseJSON(Check that the JSON is Correct)
    parseJSON --> B{Is it?}
    B ---->|No| E(Return Error)
    B -->|Yes| Dispatch(Dispatch to the method with the correct pragma)
    Dispatch --> Convert(Convert returned object to JSON)
    Convert --> Send(Send answer)
{% endmermaid %}

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
