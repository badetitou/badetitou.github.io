---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Testing and releasing Pharo with GitHub actions"
subtitle: "How to use GitHub to test my project?"
date:   2020-11-30 18:00:00 +200
categories: pharo
---

## Introduction

Hi :wave:, Travis is becoming a pay to use service.
So why not moving to GitHub actions to test your Pharo project?

Here I'm presenting everything you need to know to test your project with GitHub Actions.

We'll also see how to release your project (also continuously :sparkles:).

## Testing with Smalltalk CI

### The simplest case

To test a Pharo project, we will create a GitHub action.
This action will on each commit on the `main` branch test your project.

To do so it:

1. checkouts your project
2. runs Smalltalk CI on your project

To create the GitHub action, you need first to create a file at `<git root>/.github/workflows/test.yml`.
Since the action is to test to project, I decided to name it "test.yml" but any other name work.

In the file write:

{% raw %}

```yml
name: CI

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the development branch
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hpi-swa/setup-smalltalkCI@v1
        id: smalltalkci
        with:
          smalltalk-version: Pharo64-8.0
      - run: smalltalkci -s ${{ steps.smalltalkci.outputs.smalltalk-version }}
        shell: bash
        timeout-minutes: 15

```

{% endraw %}

The first lines indicate when the action is triggered.
In this simple case, it is triggered on each push on the branch `main`.

Then, the jobs part described the steps of the CI.
It runs on a ubuntu image.
There are three steps,
    (1) it checkouts the last version of the project for the current branch,
    (2) it prepares the smalltalkCI tool, and
    (3) it runs smalltalkCI on your project for the Pharo64-8.0 image.

### A more complex case

In this section, we see another example with usage of matrix.
Indeed, you might want to test your project over several pharo version.
To do so, we will use GitHub actions matrix.

{% raw %}

```yml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        smalltalk: [ Pharo64-8.0, Pharo64-9.0 ]
    name: ${{ matrix.smalltalk }}
    steps:
      - uses: actions/checkout@v2
      - uses: hpi-swa/setup-smalltalkCI@v1
        with:
          smalltalk-version: ${{ matrix.smalltalk }}
      - run: smalltalkci -s ${{ matrix.smalltalk }}
        shell: bash
        timeout-minutes: 15

```

{% endraw %}

The name and the trigger part do not change.
In the build part, we add a matrix strategy.
In this strategy, we set the name of the Pharo versions compatible with our project.
Then, in the steps, we indicate to SmallTalk CI to use the current smalltalk name of the matrix.

### Testing Pull Request

It is also possible to test on each Pull Request instead of commit to the main branch.
To do so, change the trigger part by

```yml
on:
  pull_request:
    types: [assigned, opened, synchronize, reopened]
```

Many other trigger options exist, you should check them on the [GitHub action page](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows).

A final version of the file can be found [here](https://github.com/moosetechnology/Moose/blob/development/.github/workflows/test.yml).

## Releasing

Using GitHub action to test your project is nice, but we can do more.
We will automatically release our project using GitHub Action.
To so, we create two other actions: one for common release, one for continuous release.

### Release

To create a release action, we first create a new file, for example `<git root>/.github/workflows/release.yml`.
This action is triggered on release creation and will test the project and release an image with the project loaded.

{% raw %}

```yml
name: Release

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PROJECT_NAME: ${{ matrix.smalltalk }}-Moose
    strategy:
      matrix:
        smalltalk: [ Pharo64-9.0, Pharo64-8.0 ]
    name: ${{ matrix.smalltalk }}
    steps:
      - uses: actions/checkout@v2
      - uses: hpi-swa/setup-smalltalkCI@v1
        with:
          smalltalk-version: ${{ matrix.smalltalk }}
      - run: smalltalkci -s ${{ matrix.smalltalk }}
        shell: bash
        timeout-minutes: 15

      - name: Package
        run: |
          mv /home/runner/.smalltalkCI/_builds/* .
          mv TravisCI.image $PROJECT_NAME.image
          mv TravisCI.changes $PROJECT_NAME.changes
          zip -r $PROJECT_NAME.zip $PROJECT_NAME.image $PROJECT_NAME.changes *.sources pharo.version
          ls

      - name: Get release
        id: get_release
        uses: bruceadams/get-release@v1.2.2
        env:
          GITHUB_TOKEN: ${{ github.token }}

      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.get_release.outputs.upload_url }} # This pulls from the CREATE RELEASE step above, referencing it's ID to get its outputs object, which include a `upload_url`. See this blog post for more info: https://jasonet.co/posts/new-features-of-github-actions/#passing-data-to-future-steps 
          asset_path: ./${{ env.PROJECT_NAME }}.zip
          asset_name: ${{ env.PROJECT_NAME }}.zip
          asset_content_type: application/zip
```

{% endraw %}

The above example is the one used by the [Moose Project](https://moosetechnology.github.io/moose-wiki/).
First, we define an environment variable name `<current matrix name>-Moose`.
Additionally to the testing steps, we add three steps:
*Package* takes the source file after testing the project (*i.e.* .image, .changes, .sources, and pharo.version) and zip them into one zip file with the current matrix name.
 _Get release_ allows us to access to release GitHub API.
Thus, we can access the upload URL of the release.
Then, _Upload Release Asset_ upload the zip file created in the *package* step.

When developers release their code, the action downloads an image for each specified Pharo version, tests it, packages it, and uploads it in the GitHub release.
Then, users can directly download the release version of the project, with project code loaded in the image.

### Continuous release

For the continuous release, we add a schedule to trigger the GitHub actions.
Thus, if the Pharo image evolves, our build will evolve with it.

Note that we have also changed the way to update the release.
Indeed, the *Update Release* automatically creates a release and upload the last version of the zip file.

{% raw %}

```yml
# This is a basic workflow to help you get started with Actions

name: Continuous

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the development branch
on:
  push:
    branches:
      - development
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  '0 0 * * *'

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PROJECT_NAME: ${{ matrix.smalltalk }}-Moose
    strategy:
      matrix:
        smalltalk: [ Pharo64-9.0, Pharo64-8.0 ]
    name: ${{ matrix.smalltalk }}
    steps:
      - uses: actions/checkout@v2
      - uses: hpi-swa/setup-smalltalkCI@v1
        with:
          smalltalk-version: ${{ matrix.smalltalk }}
      - run: smalltalkci -s ${{ matrix.smalltalk }}
        shell: bash
        timeout-minutes: 15

      - name: package
        run: |
          mv /home/runner/.smalltalkCI/_builds/* .
          mv TravisCI.image $PROJECT_NAME.image
          mv TravisCI.changes $PROJECT_NAME.changes
          zip -r $PROJECT_NAME.zip $PROJECT_NAME.image $PROJECT_NAME.changes *.sources pharo.version
          ls

      - name: Update Release
        uses: johnwbyrd/update-release@v1.0.0
        with:
          release: 'continuous'
          token: ${{ secrets.GITHUB_TOKEN }}
          files: ${{ env.PROJECT_NAME }}.zip
```

{% endraw %}

### Add releases to Pharo Launcher

Finally, I want to share with you a little script to add the GitHub Release into the [Pharo Launcher](https://pharo.org).
To do so

1. Open the Pharo Launcher
2. Open a Playground (Ctrl + O, Ctrl + W)
3. Execute the following piece of code

```st
| sources |
sources := {
    PhLTemplateSource new
        type: #HttpListing;
        name: 'Moose';
        url: 'https://github.com/moosetechnology/Moose/releases';
        filterPattern: 'href="([^"]*/Pharo[0-9][^"]*.zip)"';
        templateNameFormat: '{6} ({5})' }.
PhLUserTemplateSources sourcesFile writeStreamDo: [ :s |
    (STON writer on: s)
        newLine: String lf;
        prettyPrint: true;
        nextPut: sources ]
```

This piece of code creates a local source file for the Pharo Launcher template.
In the source file, it indicates to use an `HttpListing` from the release page of GitHub.
Then, with filter pattern, it creates a beautiful list inside the Pharo Launcher.

To adapt the piece of code for your project, you need to change the name: and url: method parameters.

![Pharo Launcher with linkg to GitHub actions](/misc/img-2020-11-30-GithubActions/pharo-launcher.png)

## Resources

The three files: *test*, *release*, and *continuous* can be found in the [Moose project repository](https://github.com/moosetechnology/Moose/tree/development/.github/workflows) 

## Thanks

I'd like to thanks the authors of [smalltalkCI](https://github.com/hpi-swa/smalltalkCI) for their incredible work!
