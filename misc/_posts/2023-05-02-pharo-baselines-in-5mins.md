---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Pharo baselines in 5min"
date: 2023-05-02 00:00:00 +200
tags: misc pharo
---

I am working with Pharo for 7 years now.
And all my project starts the same way: create a test, create a class, create a Baseline, and commit and push.
Even if most of these tasks are easy for everyone.
Dealing with baseline seems to be the hardest for people.
Probably because we do not do it in our day-to-day development.

I have created a simple, and efficient, way to deal with baseline.
This solution does **not** enable all the features baselines can offer, but it allows one to create a simple baseline, make its project available for everyone, and not require one to dig into documentation all the time.

So, let's have a look at how to create a baseline in 5min.

## Create a baseline in 5min

First, create a package with as name: `BaselineOf` + the name of your project (better, the name of the git repository).
Considering a project named *"Cointreau"*, I create a package `BaselineOfCointreau`.

Then, inside this package, I create a class with the same name.
The class must be a subclass of `BaselineOf`

> It is not mandatory to have the same name, but again, here I present a simple solution.

```st
BaselineOf << #BaselineOfCointreau
    slots: {};
    package: 'BaselineOfCointreau'
```

In the Baseline class, we will create 4 methods: `baseline:`, `definePackages: spec`, `defineDependencies: spec`, `defineGroups: spec`.

The first method is always the same, so you can copy-paste it.

```st
baseline: spec
    <baseline>
    spec
    for: #common
    do: [ 
        self defineDependencies: spec.
        self definePackages: spec.
        self defineGroups: spec ]
```

The second method is the one in which you declare the packages of your project and their dependencies.
These packages are the ones you push to your git repository.

In our example, there are three packages: `Cointreau`, `Cointreau-Tests`, and `Cointreau-Bottle`.
The `Cointreau-Tests` package requires the `Cointreau` package to be loaded first.
The `Cointreau-Bottle` package requires something named `BottleFactory`.
We will declare it in the `defineDependencies:` method.

```st
definePackages: spec
    spec
        package: 'Cointreau';
        package: 'Cointreau-Tests' with: [ spec requires: #( 'Cointreau' ) ];
        package: 'Cointreau-Bottle' with: [ spec requires: #( 'BottleFactory' ) ]
```

The `defineDependencies:` method allows one to declare dependencies to other baselines.

In our example, the `Cointreau-Bottle` package needs that the project `BottleFactory` to be loaded.
The project is hosted in GitHub, under the user *badetitou*.
The project has several branches, and we decided to select branch `v2`.
The Pharo code is under the directory `src`.

```st
defineDependencies: spec
    spec
        baseline: 'BottleFactory'
        with: [ spec
            repository: 'github://badetitou/BottleFactory:v2/src' ].
```

The final method is `defineGroups: spec`.
Groups are already an advanced feature if it is your first baseline.
It allows one to load only part of a project.
By default, a group named `default` exists and loads all packages.
For our example, we will create a group named `core` that will not load `Cointreau-Bottle`.

> You can also let the method empty if you do not want to create group at first.
> However, I believe already having this method is good to have a complete setup.

```st
defineGroups: spec
    
    spec group: 'core'
        with: #( 'Cointreau' 'Cointreau-Tests' )
```

**Congrats!** You have created your first baseline.

## Load the baseline

Once you have created a baseline, you might want to use it to load your project in Pharo.
Based on this template, you can load any of your projects if the same Pharo code.

The GitHub user is the name of the organization or GitHub user.
The project is the name of the project in GitHub.
The commitish is the branch or the tag/release you want to load.
The path is the location in the repository that contains your Pharo code.
Finally, the baseline is the name of your Baseline (without the prefix `BaselineOf`).

```st
Metacello new
    githubUser: 'badetitou' project: 'Cointreau' commitish: 'main' path: 'src';
    baseline: 'Cointreau';
    load
```

## More documentation

You will find more complete documentation in the [Pharo Open Documentation](https://github.com/pharo-open-documentation/pharo-wiki/blob/master/General/Baselines.md).
