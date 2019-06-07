---
author: Benoît "badetitou" Verhaeghe
layout: project
title:  "Casino - GWT to Angular"
date:   2019-06-07 12:00:00 +100
categories: casino _ignore
---

## How to use Casino for the GWT to Angular project

### Summary

- Download Moose
- Download Casino
- Import GWT
- Export Angular

### Download Moose

To download Moose, the first step is to download the last version of Pharo Launcher.
It is downloadable at [https://pharo.org](https://pharo.org).

Once the Pharo Launcher is downloaded, we have to create an image from the latest build of Moose 7.0.

![Install Moose](../img/mooseInstall){: .center-image }
 
Select the image, and press the green arrow to run Pharo.

## Download Casino

To use Casino for the migration, we must download two projects.

The importer (in this tutorial it's the GWT importer)
The exporter (in this tutorial it's the Angular exporter)
The importers and exporters are hosted on [Github](https://github.com/search?q=user:badetitou+Casino).

### Iceberg
  
To download project in Pharo, the easiest way is to use Iceberg. This project proposes us a User Interface to download projects and their dependencies.

To download the GWT importer:

- Open Iceberg with Ctrl+O+I or on the menu with Tools>Iceberg :
- Add a repository
- Enter the project localization
- Install the default baseline

Now, the project Casino and the GWT importer should be loaded in the Image. You can save your image with `Ctrl+Shift+S`.

To access the code of the importer, we can use the Browser of Pharo. To do so, go on `Tools>System Browser` or press `Ctrl+O+B`.

Then, browse the repositories to Casino-Model-CoreWeb-Importer

## Import GWT
  
To migrate your application you have to migrate:

- The User Interface
- The Behavioral Code
- The Business Code

### User Interface

In Silverlight, the user interface is fully written in a xml file. To import a user interface into a Casino UI model, the importer visits its xml file. To do so, it parses the file with the XMLParser of Pharo, then it extends the XMLNodeVisitor. For each node, the visitor creates one or multiple entities in the UI model.

There are two major kinds of nodes:

Document which represents a Page in the UI model.
Element which represents a Widget in the UI model.
The element node may have attributes. Those attributes are transposed as Attribute or Action in the UI model by the silverlight importer.

To detect which widget corresponds to which node in the xml, the importer implements a factory. For each kind of xml tag, there is one corresponding entity in the UI meta-model. The binding between is done through the name of the xml tag for easy cases.

For example: a BLUIButton corresponds to a tag <Button>.

We can find the same strategy for the binding of the attributes.

### Behavioral Code

WIP -- The behavioral code is not currently handled.

### Business Code

WIP -- The business code is not currently handled.

### Run

To run the import, you can execute these lines on a playground (`Ctrl+Shift+W`):

```smalltalk
SmalltalkImage current garbageCollect.

"Generate BlApp"
gwtMooseModel := MooseModel importFromMSEStream:  'D:\Developpement\mse\verveineJ5\KitchenGWT.mse' asFileReference readStream.
gwtMooseModel rootFolder: 'D:\Developpement\mse\verveineJ5'.

"Generate Bl Model"
gwtModel := MooseModel new name: 'Showroom';
    metamodel:
        (MooseModel
            metamodelComposedOf:
                {CSNLayoutMetamodelGenerator metamodel}); yourself.
CSNMooseModelCreatorAngular runOn: gwtModel fromSourceModel: gwtMooseModel and:  'D:\Developpement\mse\KitchenGWT\BLCoreIncubatorGwt\src\fr\bl\application.module.xml'.

CSNModelExporterAngularBLSpecific export: gwtModel.
```
