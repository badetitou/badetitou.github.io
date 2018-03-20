---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "SmartTest - strategies"
date:   2018-02-27 22:31:00 +200
last_modified_at: 2018-02-27 22:31:00 +200
categories: research smalltalk
---

WIP

## Introduction

There are two *major* strategies you can select with SmartTest.

- static
- dynamic

## Static

The static strategy uses the senders message to identify the tests linked to a method.
When you ask to compute tests for a method.
The static finder will compute the senders of this method, then those senders, *etc*.

If you the senders include methods already explored
The finder remove those methods of the next research.

Because it could be too long to look for all the senders,
  SmartTest implements filters.
The filters restraine the scope of research.
There are described here (WIP).

{% include image.html
            img="img\SmartTest\Finder\Strategies - Finder Sender.png"
            title="Static Finder"
%}

## Dynamic

(WIP)
