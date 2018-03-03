---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Cheat sheet Pandoc Md to pdf"
date:   2018-02-09 16:42:10 +200
categories: misc pandoc
---

## What is this page ?

I'd like to create a cheat sheet for my main uses with pandoc when I write a doc and want to convert it into a pdf.

## Write tips

- Write comment: `[//]: # My comment`
- Add bibliography: `@name`
- Defining specification for image `![Text Caption](figures/linkImage.png){#tagReference width=500 height=350}`
- Two figures with caption

```
\begin{figure}
    \centering
    \begin{minipage}{0.45\textwidth}
        \centering
        \includegraphics[width=0.9\textwidth]{ScreenShot/HubApp.png} % first figure itself
        \caption{\label{bacASable} Page d'accueil bac à sable}
    \end{minipage}\hfill
    \begin{minipage}{0.45\textwidth}
        \centering
        \includegraphics[width=0.9\textwidth]{ScreenShot/Code.png} % second figure itself
        \caption{\label{code} Page d'accueil code JAVA}
    \end{minipage}
\end{figure}
```
