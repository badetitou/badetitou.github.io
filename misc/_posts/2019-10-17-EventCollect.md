---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Collect users' data"
subtitle: "I present how to collect data from users in Pharo"
date:   2019-10-17 12:00:00 +200
categories: pharo data
---

## Introduction

Few years ago, I wanted to collect data from Pharo users (see [Tests Usage Analyser](/projects/TUA/TUA)).
I was like, _Hmm, how can I do that? Do we already have such tool? :thinking:_.
And **YES**!
We can use ``GTEventCollector``.
You probably have used it already through the privacy settings.

In this post, I'll explain how to set up your own data collector and how to use it.
Then, we'll see how to extract the data.

## Add a new Event Collector

### Preparation

The first step to collect data is to create a new instance of `GTEventCollector`.
It is this instance that will be used to send new data.
We can also use the subclass `GTEventCollector`.

Let's create a new instance:

```st
eventCollector := GTEventCollector new.
```

Creating a collector is not enough.
It needs to be configured to be completely operational.
In particular, we need to register it in the GTRecorder.
This object has the responsibility to send the data to the server that will gather the data.

```st
eventCollector := GTEventCollector new
    register.
```

Once the event collector is created, we can customize it for our records.
We can change multiple properties: `#url:`, `#category:`, `#occupent:`.

1. `#url:` is the server website. The default one is: _http://gc.dcc.uchile.cl.:8080/gt/events_. We may want to change it for security or privacy purpose.
2. `#category:` is used to group your data in a specific directory in the server. It is useful to analyse only the data of your application. In my case, I used the category `#testsUsageAnalyserEvents`.
3. `#occupent:` is an instance of any object. When it is removed by the GC, the recorder unregisters the collector. So, using an occupent is a good idea to keep only one instance of the recorder instead of creating a new one each time. In my case, I use an instance of [Announcer](https://github.com/pharo-open-documentation/pharo-wiki/blob/master/PharoProjects/Announcer.md), so the collector exists until the 'Announce' instance is removed from the memory.

At the end, we have the following code to create a collector:

```st
eventCollector := GTEventCollector new
    occupant: TUAAnnouncer uniqueInstance;
    category: #testsUsageAnalyserEvents;
    register;
    yourself
```

### Collect data

Once the event collector is created, we can use it to record data and send them to a server.
First, we need to learn how to create a data format.
It is simple since, by default, the recorder uses [Ston](https://github.com/pharo-open-documentation/pharo-wiki/blob/master/ExternalProjects/Export/JSON.md) as a format to send the data.
So we can use nearly everything.

To collect new data, we can use both `#add: anEvent` and `#addIfAvailable: anEvent`.
However, we should use the `#addIfAvailable:` because it will check users have accepted to send their data.
Unless you don't care about privacy :smiling_imp:?

So, let's add a simple data:

```st
eventCollector addIfAvailable: 42
```

In my previous work, I wanted to record more complex data.
A good way to do it is to use dictionary.
In the following, I present an example using dictionary created from an Announcement.

First, I created a method in TUAAnnouncement (it is a subclass of Announcement for my project) that adds my data to a dictionary.

```st
TUAAnnouncement>>#dataForTestUsageAnalyser
    ^ super dataForTestUsageAnalyser
        at: #class put: self class name;
        at: #entity put: entity; "this is the content of my announcement"
        at: #dataVersion put: 4 "this is the version of my data, so I can select the data from a specific version";
        yourself
```

The method is also understood by Object itself (to avoid bugs).

```st
Object>>#dataForTestUsageAnalyser

  ^ Dictionary new
```

Finally, when I want to record an announcement, I use a method `#recordAnnouncement:` that takes an announcement and records some entries in the dictionary and adds them to the collector.

```st
recordAnnouncement: anAnnouncement
    (anAnnouncement respondsTo: #dataForTestUsageAnalyser) ifTrue: [
        [eventCollector addIfAvailable:
            (anAnnouncement dataForTestUsageAnalyser "get a dictionary from the announcement"
                at: #type put: anAnnouncement type; "some meta data I used"
                at: #timestamps put: DateAndTime now; "Useful to determine the creation date of an entry"
                yourself) ]
                    on: Error
                    do: [ :error | "blabla" ] ] ]
```

## Extract the data

Once the data has been collected, we need to download them from the server.
By default, all the data can be downloaded at [http://gc.dcc.uchile.cl/](http://gc.dcc.uchile.cl/).
If everything goes well, we can now see your category in ``gt/events/<myCategory>``.
In my case, we have data in `gt/events/testsUsageAnalyserEvents`
The data are sort by month.

To analyse the data, the first step is to open a Pharo image.
Then, we can use `GTEventTool` to unpack our data in the Pharo memory and analyse it.

The tool comes with methods to download and extract the data.

```st
GTEventTool default ensureLocalDirectory "download the data and extract them (from the archive)".
```

When the data is downloaded, we can load it in Pharo.

```st
GTEventTool default unpackAll. "unpack all the data"
GTEventTool default unpackAll: './gt/events/testsUsageAnalyserEvents' asFileReference. "unpack the data in testsUsageAnalyserEvents"
```

However, we already have a lot of data (~1Go).
If you want to go faster, I've created some helpers.

The method ``unpackDirectory:`` will do the first step of unpacking and can be executed on only one directory.

```st
unpackDirectory: aStringPath
    ^ GTEventUnpacking default unpackDirectory: aStringPath asFileReference
```

The method ``unpackedCollectionOfGTEvent:`` will take a collection of GTEvent, which is the return of `unpackDirectory:` and convert each entry into the real data.

```st
unpackedCollectionOfGTEvent: aCollectionOfGTEvent
    ^ aCollectionOfGTEvent flatCollect: #safeUnpackedData.
```

We can now analyze the data.
