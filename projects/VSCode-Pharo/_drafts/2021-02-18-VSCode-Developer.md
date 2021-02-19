---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Dev - Pharo Language Server"
subtitle: "Description of the Language Server Protocol for Pharo"
date:   2021-02-17 12:00:00 +200
categories: pharo vscode
---

I have recently developed a [VSCode](https://code.visualstudio.com/) extension for Pharo.
It uses the Language Server Protocol and the Debug Adapter Protocol
Here, I will present the Pharo implementation and how to extend it.

## Language Server Protocol (LSP)

I first worked on the implementation of LSP in Pharo.
LSP protocol is based on the JSON-RPC protocol.
Hopefully, this protocol is [already implemented](https://github.com/juliendelplanque/JRPC) in Pharo thanks to the incredible work of [Julien Delplanque](https://juliendelplanque.be/).

The LSP implementation is done in a main package `PharoLanguageServer`.
Then, the package is subdivided into 5 sub-packages: Uncategorized (core), Structure, Structure-Capabilities, Structure-Completion, and Structure-Signature.

- The structure package includes the [basic json structures](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#basic-json-structures) of the LSP specification.
Those structures are used by all the LSP requests.
- The structure capabilities package includes the structures used to declare the capabilities of LSP client and server.
All the structure are not implemented. Only the ones supported by the Pharo Language Server.
- The structure completion package includes the structures used for the text completion feature.
It includes completion item, tag, and text format (snippet or plain text).
- The structure signature package is equivalent to the completion package but for the signature helper feature.
