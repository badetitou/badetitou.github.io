---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Download musics from Google Play Music"
subtitle: "Or how to use Pharo to control Python and VLC library"
date:   2020-06-19 12:00:00 +200
categories: pharo ffi
---

## Introduction

[Google Play Music (GPM)](https://play.google.com/music/) is a service proposed by Google to listen musics online (like Spotify, Deezer, ...).
Having a premium subscription, I can listen a lot of music by using the online service, but when I have no internet connection... I cannot :-( .
So I wanted to download the music ^^.

> This might be illegal, so, I used this situation to explain the process to use Pharo to download musics from GPM
> but you **must not** use this for real.

## Approach

My idea is simple: if I can listen to musics from my computer, it means my computer has to download the music.
I know that musics coming from GPM are in the mp3 format.
So the process to download the music is simple:

1. Access my GPM library
2. For each music download the corresponding mp3 file.
3. Set the metadata of each music

### Access my GPM library

There is no official API for GPM service, however, a the [gmusicapi](https://unofficial-google-music-api.readthedocs.io/en/latest/) python project has been developed to create an unofficial API.
This API allows us to access every element of our GPM library.

I'm not that good in Python, but I know it is possible to control python over Pharo.
So I decided to use the [pybridge](https://github.com/aranega/pybridge) project of [Vincent Aranega](https://github.com/aranega).

PyBridge allows us to use python language in Pharo.
So, I'll use it to load and use the unofficial GPM API.

#### Set up PyBridge

PyBridge is currently a work in progress and consequently asks a bit of a SetUp.
One needs to download the server project and the Pharo client project.

For the [Pharo client project](https://github.com/aranega/pybridge), it is super easy.
I only need to download the project from GitHub and install the baseline:

```st
Metacello new
    baseline: 'PyBridge';
    repository: 'github://aranega/pybridge/src';
    load
```

For the [Server project](https://github.com/aranega/pybridge), the project is inside the `python` branch of the git repository.
It requires [`pipenv`](https://pypi.org/project/pipenv/) to simply setup python virtual environments.
So clone it in another folder and create a virtualenv by doing a simple:

```sh
$ pipenv install
```

Then, install the `gmusicapi` and run the server by executing the following commands:

```sh
$ pipenv shell
(pybridge) $ pip install gmusicapi
(pybridge) $ python server.py
```

Congratulations! You have correctly set up `PyBridge` to use the `gmusicapi` library!

### Log in GPM

Before using the library, I need to log in inside GPM.
To do so, I will use `gmusicapi`.
The usage of the python library in Pharo is pretty forward as PyBridge exposes python objects in a Smalltalk fashion.

```st
| mobileClient api |

"Access to the API class"
mobileClient := PyBridge load: #'gmusicapi::Mobileclient'.
"Create a new instance"
api := mobileClient new.
"Create authentification key"
api perform_oauth. "This step must be done only once by GPM account to get a oauth key."

"Login using oauth key"
api oauth_login: 'XXXXX' "XXXXX is my private key ^-^"
```

Nice! I have now a full access to the GPM API using PyBridge and Pharo.

## Download mp3 files

GPM does not allow the users to download music.
However, it is possible to ask for the audio stream in a mp3 format.
I will use this to download the files ^-^.

In the following, I will present an example to download the album [*Hypnotize* of *System Of A Down*](https://en.wikipedia.org/wiki/Hypnotize_(album)).
The album is in my GPM library so I can retrieve it in "my songs".

To download the musics, I will access to all my musics libraries, select the music that belongs to the album, and then download the musics.

```st
"access to all my songs"
library := api get_all_songs. "get_all_songs is part of the python library".

0 to: (library size - 1) do: [:index | "take care with index in python"
    | music |
    music := (library at: index)
    ((music at: #album) literalValue beginsWith: 'Hypnotize') "is the music at index part of the album?"
        ifTrue: [
            | fileRef |
            fileRef := ('/home/user/music' asFileReference / ((music at: #title), '.mp3')).
            fileRef binaryWriteStreamDo: [:mp3WriteStream |
                (ZnEasy get: (api get_stream_url: (music at: #id))) writeOn: mp3WriteStream. "download the file"
            ].
        ]
]

```

I have now download all the music of the album.
To summary:

1. Pharo asks for all songs to Python
2. Then Pharo iterates on the Pyhton Map to select the correct musics.
3. It asks to Python the URL stream for a Music
4. And it uses Zinc to download the music and creates the mp3 file.

## Set the metadata

Our strategy works pretty well but the metadata of the mp3 files are not set.
It can not be a problem but it is preferable when using a music manager (such as Clementine, Music Bee, Itunes, ...).
So, I will use VLC to set the metadata of our file.
It is possible to use VLC through Pharo using the [Pharo-LibVLC project](https://github.com/badetitou/Pharo-LibVLC).

### Set Up Pharo LibVLC

Installing the FFI binding of VLC for Pharo is easy.
You need to: (1) install [VLC](https://www.videolan.org/), and (2) install Pharo-LibVLC.

```st
Metacello new
  baseline: 'VLC';
  repository: 'github://badetitou/Pharo-LibVLC';
  load.
```

Then, it is possible to use VLC in Pharo after initializing it.

```st
vlc := VLCLibrary uniqueInstance createVLCInstance
```

### Set the metadata

Inside the previous script, I insert the code to set metadata using VLC.
First, I create a reference to the mp3 file for VLC, then I set the metadata using VLC API.

```st
...
| media |
media := vlc createMediaFromPath: fileRef fullName. "create mp3 reference for VLC"
media setMeta: VLCMetaT libvlc_meta_Album with: (music at: #album) literalValue asString.
media setMeta: VLCMetaT libvlc_meta_Title with: (music at: #title) literalValue asString.
media saveMeta.
media release.
...
```

In the example, I only set "album" and "title" attribute but it is possible to set [more metadata](https://unofficial-google-music-api.readthedocs.io/en/latest/reference/mobileclient.html#songs).

## Conclusion

I have used Zinc, VLC, and Python with a Python library to download musics for Google Play Music service.
It shows how easy it is to use Pharo with other programming languages
    and I hope it will help you to create many super cool projects.

> **I REMIND YOU THAT THIS WORK MIGHT NOT LEGAL SO CONSIDER IT ONLY AS AN EXAMPLE!**
