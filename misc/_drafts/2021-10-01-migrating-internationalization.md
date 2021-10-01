---
author: Benoît "badetitou" Verhaeghe
layout: post
title: "Migrating internationalization file"
date:   2021-10-01 12:00:00 +200
categories: Pharo Model
---

During my Ph.D. [migration project]({{ "/projects/Casino" | absolute_url }}), I consider the migration of several GUI aspects: 

- visual
- behavioral
- business

These elements are the main ones.
When *perfectly* considered, you can migrate the front-end of any application.
But, you are missing some other stuff :smile:
For example, how do you migrate i18N files?

In this post, I'll present how to build a simple migration tool to migrate I18N files from `.properties` (used by Java) to `.json` format (used by Angular).

## I18N files

First, let's see our source and target.

As a source, I have several `.properties` files, including I18N for a Java project.
Each file has a set of *key/value* and comments.
For example, the `EditerMessages_fr.properties` is as follow:

```properties
##########
#    Page : Edit
##########

pageTitle=Editer
classerDemande=Demande
classerDiffusion=Diffusion
classerPar=Classer Par
```

And it's Arabic version `EditerMessages_ar.properties`

```properties
#########
#    Page : Editer
#########

pageTitle=تحرير
classerDemande=طلب
classerDiffusion=بث
classerPar=تصنيف حسب
```

As a target, I need **only one JSON file** per language.
Thus, the file for the french translation look like this:

```json
{
    "EditerMessages" : {
        "classerDemande" : "Demande",
        "classerDiffusion" : "Diffusion",
        "classerPar" : "Classer Par",
        "pageTitle" : "Editer"
    }
}
```

And the Arabic version:

```json
{
    "EditerMessages" : {
        "classerDemande" : "طلب",
        "classerDiffusion" : "بث",
        "classerPar" : "تصنيف حسب",
        "pageTitle" : "تحرير"
    },
}
```

To perform the transformation from the `.properties` file to `json`, we will use MDE.
The approach is divided into three main steps:

1. Designing a meta-model representing internationalization
2. Creating an importer of properties files
3. Creating a JSON exporter

## Internationalization Meta-model

I18N files are simple.
They consist of a set of *key/values*.
Each value is associated with a language.
And each file can be associated with a namespace.

For example, in the introduction example, the namespace of all entries is *"EditerMessages"*.

I designed a meta-model to represent all those concepts:

![meta-model](/misc/img-2021-10-01-internationalization/I18N-metamodel.png)

Once the meta-model is designed, we must create an importer that takes `.properties` files as input and produces a model.

## Properties Importer

To produce a model, I first look for a `.properties` parser without much success.
Thus, I decided to create my own parser.
Given a correctly formated file, the parser provides me the I18N entries.
Then, by iterating on this collection, I build an I18N model.

### I18N parser

To implement the parser, I used the [PetitParser2 project](https://github.com/kursjan/petitparser2).
This project aims to ease the creation of new parsers.

First, I downloaded the last version of [Moose](https://modularmoose.org/moose-wiki/Beginners/InstallMoose), and I installed PetitParser using the command provided in the repository Readme:

```st
Metacello new
    baseline: 'PetitParser2';
    repository: 'github://kursjan/petitparser2';
    load.
```

In my Moose Image, I created a new parser.
To do so, I extended the `PP2CompositeNode` class.

```st
PP2CompositeNode << #CS18NPropertiesParser
    slots: { };
    package: 'Casino-18N-Model-PropertyImporter'
```

Then, I defined the parsing rules.
Using PetitParser2, each rule correspond to a method.

First, `start` is the entry point.

```st
start
    ^ pairs end
```

`pairs` parses the entries of the `.properties` files.

```st
pairs

    ^ comment optional starLazy, pair , ((newline / comment) star , pair ==> [ :token | token second ]) star , (newline/comment) star ==> [ :token | 
      ((OrderedCollection with: token second)
           addAll: token third;
           yourself) asArray ]
```

The first part of this method (before `==>`) corresponds to the rule parsed.
The second part (after `==>`), to the production.

The first part try to parse one or several`comment`.
Then, it parses one `pair`.
Followed by list of `comment`, `newline`, and `pair`.

![](https://mermaid.ink/svg/eyJjb2RlIjoiZmxvd2NoYXJ0IExSXG4gICAgQ29tbWVudCAtLT4gUFtcIlBhaXJcIl1cbiAgICBQIC0tPiBDW1wiQ29tbWVudC9OZXcgTGluZVwiXVxuICAgIHN1YmdyYXBoIHN0YXJcbiAgICBDIC0tPiBQYWlyXG4gICAgZW5kXG4gICAgUGFpciAtLT4gRU5EXG4gICIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

> This parser is clearly not perfect, and would require some improvment.
> Nevertheless, it does work for our context.

The second part produces a collection (*i.e.* a list) of the `pair`.

### Building the I18N model

Now that we can parse one file, we can build a I18N model.
To do so, we will first parse every `.properties` file.
For each file, we extract the `language` and the `namespace` based on the file name.
Thus, `EditerMessages_fr.properties` is the file for the `fr` language and the `EditerMessages` namespace.
Then, for each entry of this file, we instanciates an entry in our model inside the namescpace and with the correct language attached.

```st
importString: aString
    (parser parse: aString) do: [ :keyValue | 
        (self model allWithType: CS18NEntry) asOrderedCollection
            detect: [ :entry | 
                "search for existing key in the file"
                entry key name = keyValue key ]
            ifOne: [ :entry |
                "If an entry already exists (in another language for instance)"
                entry addValue: ((self createInModel: CS18NValue)
                    name: keyValue value;
                    language: currentLanguage;
                    yourself) ]
            ifNone: [
                "If no entry exist"
                (self createInModel: CS18NEntry)
                    namespace: currentNamespace;
                    key: ((self createInModel: CS18NKey)
                        name: keyValue key;
                        yourself);
                    addValue: ((self createInModel: CS18NValue)
                        name: keyValue value;
                        language: currentLanguage;
                        yourself);
                    yourself ] ]
```

After performing the import, we get a model with, for each namespace, several entries.
Each entry have a key, and several values.
Each value is attached with the language.

## JSON exporter

## Ressource

The meta-model, importer, and exporter are freely available in [GitHub](https://github.com/badetitou/Casino-I18N).
