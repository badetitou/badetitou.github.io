---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "GitProjectHealth"
subtitle: "What is the health of your git repositories?"
date:  2022-06-02 08:00:00 +200
---

A software system project is often composed of several little projects that all together are one system.
It is the case for classic frontend/backend apps, and even more when you build [micro-services](https://en.wikipedia.org/wiki/Microservices) or [micro-frontends](https://micro-frontends.org/).
Considering you, as a company, decided to use git as a versioning system, and you have one git project per project of your final software system.
Since you probably sell several apps, you end up with thousands of projects, split all over your git management system (GitHub, GitLab, Bitbucket, and so on...).
As with any system, you need to maintain it to 

- Which git project often fails?
- Are there any projects not tested at all?
- How to ease the onboarding of future employee?
- Is there a useless group (created maybe by an intern, but not used anymore)
- ...

To analyze all your git projects, I built a new tool named: [*GitProjectHealth*](https://github.com/moosetechnology/GitProjectHealth).
This tool creates a map of your Git management systems and thus helps you query it thanks to the power of [Moose](https://modularmoose.org).

## Installation

## Usages

## Example

## Conclusion
