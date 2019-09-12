---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Cheat sheet Pandoc Md to pdf"
subtitle: "I present some commands I use with pandoc to create pdf file"
date: 2018-02-09 16:42:10 +200
last_modified_at: 2019-09-12 16:42:10 +200
categories: misc pandoc
---

## Write tips

- Write comment: `[//]: # My comment`
- Add bibliography: `@name`
- Defining specification for image `![Text Caption](figures/linkImage.png){#tagReference width=500 height=350}`
- Linked image `[ ![title](link/image)](link/image)`
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
