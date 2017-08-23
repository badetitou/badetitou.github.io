---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "SmartTest - Tutorial"
date:   2017-08-21 14:58:00 +200
categories: research smalltalk
---

## What is SmartTest ?

SmartTest is a plugin developed in [Pharo](http://pharo.org/). It is an Add-On for Quality Assistant by [Yuriy Tymchuk](http://yuriy.tymch.uk/) and provides new rules and critiques.

The goal of SmartTest is to provide to the developers the list of tests they should run after they modify their code.
With this plugin installed, developers will save time and will develop in a better way (hopefully).

## Installation

### In an old image

I supposed you already install Pharo. If not, please [install it](http://pharo.org/download).

To install SmartTest. The easiest way is to use the catalog browser.

{% include image.html
            img="/img/CORA/install_smartTest.png"
%}

### With Continuous Integration (jenkins)

If you'd like to use a preconfigured image with SmartTest and optimize for your work.
You can use the integration with Jenkins I've made.
You only have to add these lines into your configuration.

```
./pharo $PROJECT_NAME.image eval --save "
  Metacello new  
    configuration: #SmartTest;
    githubUser: 'badetitou' project: 'SmartTest' commitish: '$VERSION' path: '.';
    onWarningLog;
    load".

./pharo $PROJECT_NAME.image eval --save "
	SmTTestCoverageTestFinderStrategy prepareInJenkinsForPackagesNamed: #('SmartTest')
  ".
```

You have to change the last line by replacing `#('SmartTest')` by list of packages corresponding to your project.
You should change `$VERSION` by `master` if you want to work only with the stable version of SmartTest. Or by `development` for the development version of SmartTest.

### Help us

I'm also working on test usage habit. If you'd like to use SmartTest and in the same time help us (because it's awesome ;) ).


{% include image.html
            img="/img/CORA/install_tua.png"
%}

## Utilisation

Once you install SmartTest, it is auto-activated (it can take a few seconds, but you will not notice them).

Each time you select a method or a class. Two rules can be activated.

### Should write tests

{% include image.html
            img="/img/CORA/shouldWriteTest.png"
            title="shouldWrtieTest"
%}

This critique indicates that the plugin didn't find any test related to the method you've selected.
Normally, it means you didn't write a test for this method.
So it advises you to create a test (because yes... It's essential !!!).

If you click on the fix button.
The plugin offer you to create it quickly (from a template).

### Should run tests

{% include image.html
            img="/img/CORA/shouldRunTest.png"
            title="shouldRunTest"
%}

This critique indicates that the plugin has found test(s) related to the method you've selected.
This critique offer you two new actions
- By clicking on the #testNotRun icon, the plugin will execute the tests related to the method.
If there are errors or fails, the button will turn red or yellow (but the debugger will not be displayed !!!).
- By clicking on the #smallWindow icon, the plugin will open a new window with the test it's found.

{% include image.html
            img="/img/CORA/AutoTestSelection.png"
            title="AutoTestSelection"
%}

This window displays the list of tests SmartTest has found.
You're able to run each run by clicking on the #testNotRun icon.
The tests will be run in debug mode (errors will be displayed).
By clicking on the "Run all test" button, you will run all the tests displays in debug mode.

## Options

Many options are available to custom your experience with SmartTest.
You should read this part to use SmartTest at the maximum of its possibilities.
You can extend each option and so create your own experience.

### Testing strategy

{% include image.html
            img="/img/CORA/testing.png"
            title="Testing strategy"
%}

SmartTest provides four strategies for testing.

- *Never* will only display the button as describe previously.
- *Always* will execute all the test SmartTest finds as soon as it finds the tests.
If you change a method A then select a method B before end the research of relative tests, SmartTest will continue to search and run the tests as soon as it finds them.
- *Every 5 Minutes* will collect the tests SmartTest find during a duration of 5 minutes.
Then SmartTest will run the tests and, if a test fails, SmartTest will display a window with the test suite it ran.
- *Each modification* will run the tests SmartTest find each time you modify your code.
This is the default strategy.
As for always strategy, if you change a method A and select a method B before the end of the research of relative tests, then SmartTest will continue to search and run the tests as soon as it finds them.

You're able to extend *CORATestingStrategy* if you'd like to create your own testing strategy.

### Finder

{% include image.html
            img="/img/CORA/finder.png"
            title="finder"
%}

The finder contains the implementation of how SmartTest will find test relative to a method.
The default will work as follow, for
- a method, it will use the current change impact strategy (see Change Impact strategy).
- a class, it will search the method that use the variables of the class.
- a test method, it will provide the test method
- a setup, it will provide all the tests concerning by this setup
- a teardown, it will provide all the tests concerning by this teardown

You're able to extend *CIPackagesFilter* if you'd like to create your own strategy to filter tests.

### Filter

{% include image.html
            img="/img/CORA/filter.png"
            title="filter"
%}

Because we're using ChangeImpact.
You can also define filter for the finder strategy to optimize our tool.
Currently we are filtering test relative to the method package.
That include all the class in our package, the package with the same base name ("SmartTest-Patate" and "SmartTest-Frite-Poulet" are two packages with the same base name "SmartTest").
And the package that call our method class ("MyClass>>#hello" is in the package A. In the package B, there is at least a method that calls "MyClass". So, the methods inside the package B are **not** rejected).

(working on schema)

You're able to extend *CIPackagesFilter* if you'd like to create your own strategy to filter tests.

### Change Impact strategy

{% include image.html
            img="/img/CORA/change_impact_strategy.png"
            title="change_impact_strategy"
%}


Currently, SmartTest uses Change Impact by [Julien Delplanque](https://juliendelplanque.be/) to explore the code.
The implementation of SmartTest is simple.
We simply research the senders of the method you select and the senders of the senders ...
Each time, it verify that the senders are not filtered by the filter.

You're able to extend *CIStrategy* if you'd like to create your own strategy to find tests.

### Runner

{% include image.html
            img="/img/CORA/runner.png"
            title="runner"
%}


The runner is the part of SmartTest which run the tests provided by the finder.
By default the SmartRunner is used.
- If you click on "run button" of the critique, it will run the found tests and change its color depending of the result (green, yellow or red).
- On the "Run All Button" or on the method button, the test will be run in debug mode (so if they fail, or raise an error, the debugger will open).

The Debug one will open the debugger if an error appears (don't depend of the button you click on).
The notice one works as the debug one but it **never** opens the debugger.


## Uninstall

To uninstall SmartTest, it's a bit hard currently. You have to follow this instruction:

- (Disable TUA in the settings)
- (Unload TUA)
- Unload CORA
- Run this command in a playground `ReRuleManager cleanUp`
- ReLoad Kernel
- Reload SUnit-Core
- Reload QualityAssistant
- Reload Nautilus

## Links

The projects is present on [github](https://github.com/badetitou/CORA).
So you can report issues (or features you want to see implemented).
And you can do pull request too.

### Development version

```st
Metacello new
  githubUser: 'badetitou' project: 'SmartTest' commitish: 'development' path: '.';
  configuration: 'SmartTest';
  load.
```

You can also use iceberg to clone the project.
