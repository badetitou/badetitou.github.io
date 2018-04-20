---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "SmartTest - strategies"
date:   2018-02-27 22:31:00 +200
last_modified_at: 2018-03-20 18:31:00 +200
categories: research smalltalk
---

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
The filters restrain the scope of research.
There are described here (WIP).

{% include image.html
            img="img\SmartTest\Finder\Strategies - Finder Sender.png"
            title="Static Finder"
%}

## Dynamic

The dynamic strategy is faster and more precise but, it needs a cache to be really used.

There are two dynamic approaches

### Test Coverage

Test Coverage uses the strategy used by the Test Runner of Pharo.
The idea is too install a proxy on a method and to set a flag to true
  if the method is executed during a test.

The strategy for SmartTest is the same.
Before the beginning of the test execution, it adds
  proxy on method that would possibly be executed (yes, this is static).
Then the test is run.
If a method with a proxy is executed, SmartTest sets the flag to true and
  and the relation between the executed method and the test into the cache.

At the end of the execution, the strategy remove the proxy.

With this strategy, we can fill the cache relative to a project.
Then when the developers work and modify a method, we just have to look into the
  cache the relation between their work and the tests to run.

### Reflectivity

As explained above, Test Coverage still have some static part to
  fill the cache.
This is why we also implement a version using Reflectivity.
Reflectivity lets us install proxy on every method of the Pharo image.

So, before the beginning of a test execution, the finder install a proxy at the
  beginning of the test execution.
The proxy will, when the test is executed,

- Add a relation between the test and itself
- Add a proxy before all call in the AST of the method

This second proxy will,

- Add a relation between the future executed method and the test
- Add the same proxy before all call in the AST of the method

Before installing a proxy, the finder checks that it doesn't have done the
  research before.
There is also a mechanism to avoid infinite loop with method like `#new`
