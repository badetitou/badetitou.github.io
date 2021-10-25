---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Dev - Pharo Language Server"
subtitle: "Description of the Language Server Protocol for Pharo"
date:   2021-03-03 12:00:00 +200
categories: pharo vscode vscode-pharo
---

I have recently developed a [VSCode](https://code.visualstudio.com/) extension for Pharo.
It uses the Language Server Protocol and the Debug Adapter Protocol.
You can download it from [GitHub](https://github.com/badetitou/Pharo-LanguageServer)!
Here, I will present the Pharo implementation for the LSP part and how to extend it.

I first worked on the implementation of LSP in Pharo.
LSP protocol is based on the JSON-RPC protocol.
Hopefully, this protocol is [already implemented](https://github.com/juliendelplanque/JRPC) in Pharo thanks to the incredible work of [Julien Delplanque](https://juliendelplanque.be/).

- [Project Package Architecture](#project-package-architecture)
- [Project startup](#project-startup)
- [Main loop](#main-loop)
  - [Receiving request](#receiving-request)
  - [Handling request](#handling-request)
    - [Example of code completion](#example-of-code-completion)
  - [How to extend and improve the project](#how-to-extend-and-improve-the-project)

## Project Package Architecture

The LSP implementation is done in a main package `PharoLanguageServer`.
Then, the package is subdivided into 5 sub-packages: Uncategorized (core), Structure, Structure-Capabilities, Structure-Completion, and Structure-Signature.

- The core package includes the server and the dispatched methods
- The structure package includes the [basic JSON structures](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#basic-json-structures) of the LSP specification.
Those structures are used by all the LSP requests.
- The structure capabilities package includes the structures used to declare the capabilities of LSP client and server.
All the structures are not implemented. Only the ones supported by the Pharo Language Server.
- The structure completion package includes the structures used for the text completion feature.
It includes completion item, tag, and text format (snippet or plain text).
- The structure signature package is equivalent to the completion package but for the signature helper feature.

## Project startup

Here, we will present how the project startup

{% mermaid %}
sequenceDiagram
    activate VSCode
    VSCode->>Pharo: Start Pharo
    activate Pharo
    VSCode->>Pharo: Can you hear me?
    Pharo-->>VSCode: Yes!
    VSCode->>+Pharo: Initialized?
    Pharo->>-VSCode: Initialized!
    VSCode->>+Pharo: Capabilities?
    Pharo->>-VSCode: Capabilities!
    loop
        VSCode->>+Pharo: What about completion?
        Pharo->>-VSCode: Complete this text with this snippet
    end
    VSCode->>Pharo: I'm done
    Pharo->>VSCode: OK bye!
    deactivate VSCode
    deactivate Pharo
{% endmermaid %}

When a `.st` file is opened VSCode launch that vscode-pharo extension, which, in turn, starts the server by executing the following piece of code.

```st
| server |

Transcript crShow: 'Run with vscode'.

server := PLSServer new
    "In the dev version"
    debugMode: true;
    yourself.

server start.
```

When started:

1. The `PLSServer` looks for its methods with the pragma `jrpc` to define the method that will be accessible by the extension.
For instance, the following method is called when the client executes the method `initialize`.
```st
onInitializeTrace: trace processId: processId clientInfo: clientInfo rootPath: rootPath workspaceFolders: workspaceFolders capabilities: capabilities rootUri: rootUri
    <jrpc: #initialize>
    ^ PLSInitializeResult new
```
1. It creates a TCP socket that listens to port 4000 (default value).
2. The VSCode client connects to the server TCP port
3. Client and server exchange their capabilities

## Main loop

Once the VSCode client and the Pharo server are connected, the main loop of the protocol begins.
Here, I will detail how information is handled by the server part.
For information about the client, you should have a look at the VSCode documentation.

### Receiving request

The server is always in listening mode, waiting for a request from the client.
When it receives data, it first `#extractRequestFrom` the socket.

The extraction consists of waiting data from the client.
A request consists of a header and content.

The header is first extracted by Pharo.

```
Content-Length: ...\r\n
\r\n
```

The server retrieves the value of the content-length.
It allows us to create a String buffer with the correct size.
Then, it extracts into the buffer the content.

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "textDocument/didOpen",
    "params": {
        ...
    }
}
```

The content consists of the JSON-RPC protocol version, an idea used to identify the request, the method called, and the params for the methods.
Handling the request, and dispatching to the correct method in the server is made by incredible [JRPC implementation of Julien](https://github.com/juliendelplanque/JRPC).

### Handling request

When extracted, the request is dispatched to the method with the pragma corresponding to the jrpc called method with the parameter.

![Example communication](https://microsoft.github.io/language-server-protocol/overviews/lsp/img/language-server-sequence.png).

The method analysis the parameter, performs some Pharo code, and then answers with the expected LSP structure.

#### Example of code completion

To answer a completion request, the following implementation is used:

```st
textDocumentCompletionWithContext: context position: position textDocument: textDocument
    <jrpc: #'textDocument/completion'>
    | completionList completionTool |
    completionTool := PLSCompletion new
        source: ((self context textItem: (textDocument at: #uri)) at: #text);
        position: position;
        yourself.
    completionList := PLSCompletionList new.
    completionList completionItems: completionTool entries asArray.
    ^ completionList
```

First, we create a `PLSCompletion` that has access to the source code, and the position in which a completion is required.
Then, we create a `PLSCompletionList`, a [structure defined in the LSP](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_completion).
Finally, we set the list of completion items with the entries given by our completion tool.

```st
PLSCompletion>>#entries
    completionContext := CompletionContext
        engine: PLSCompletionEngine new
        class: nil
        source: self source
        position: self position.
    ^ self completionContext entries
        collectWithIndex: [ :entry :index |
            PLSCompletionItem new
                label: entry contents;
                insertTextFormat: PLSInsertTextFormat snippet;
                insertText: entry contents toPLSSnippet ;
                kind: entry asPLSCompletionItemKind;
                data: index;
                yourself ]
```

The completion tool uses the existing Pharo tool `CompletionContext` for the completion.
We created a specific engine named `PLSCompletionEngine` that extends the default `CompletionEngine` of Pharo, and defines the context as scripting.

### How to extend and improve the project

There is still a lot of work to do to improve the Pharo Language Server.
Using the existing architecture, it is easy to improve the code.
Please consider adding your next super feature or creates issues so we can prioritize our work.

The next blog post will detail how to extend the Debug Adapter Protocol Pharo implementation, and another will present user story with the extension :rocket:
