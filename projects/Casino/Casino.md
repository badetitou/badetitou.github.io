---
author: Benoît "badetitou" Verhaeghe
layout: project
title:  "Documentation"
date:   2018-12-13 11:27:00 +100
categories: casino _ignore
---

## Introduction

The aims of Casino is to migrate semi-automatically the front-end of applications regardless of its implementing language.
The front-end corresponds to the widgets, theirs behaviors and how the interact with the backend.

## Migration Strategy

Here is a diagram showing the migration steps implemented by Casino.

{% include image.html
            img="../img/migrationProcess.png"
            title="Migration process"
%}

## GUI Meta-model

### Full Widgets meta-model

![Full widgets metamodel](../img/Metamodels-Widgets-full.svg)

[Download the metamodel](../img/Metamodels-Widgets-full.svg)

## Current results

Here are some examples of the results obtained for GWT application migration to Angular:

|          Source Application (GWT)          |            Target Application (Angular)            |
| :----------------------------------------: | :------------------------------------------------: |
|   ![Home GWT](../img/cmp/gwt/home.png)    |    ![Home Angular](../img/cmp/angular/home.png)    |
| ![Libelle GWT](../img/cmp/gwt/libelle.png) | ![Libelle Angular](../img/cmp/angular/libelle.png) |
|     ![Nav GWT](../img/cmp/gwt/nav.png)     |     ![Nav Angular](../img/cmp/angular/nav.png)     |
|    ![Nav2 GWT](../img/cmp/gwt/nav2.png)    |    ![Nav2 Angular](../img/cmp/angular/nav2.png)    |
|  ![Onglet GWT](../img/cmp/gwt/onglet.png)  |  ![Onglet Angular](../img/cmp/angular/onglet.png)  |
|  ![uiDesk GWT](../img/cmp/gwt/uiDesk.png)  |  ![uiDesk Angular](../img/cmp/angular/uiDesk.png)  |

## Links

The core of the project (with the importer GWT and the exporter Angular) is available on [github](https://github.com/badetitou/Casino).
There are also:

|                                Importer                                 |                            Exporter                             |
| :---------------------------------------------------------------------: | :-------------------------------------------------------------: |
|       [Swing](https://github.com/badetitou/Casino-Swing-Importer)       |    [Spec](https://github.com/badetitou/Casino-Spec-Exporter)    |
|        [Spec](https://github.com/badetitou/Casino-Spec-Importer)        |   [Spec2](https://github.com/badetitou/Casino-Spec2-Exporter)   |
|        [HTML](https://github.com/badetitou/Casino-HTML-Importer)        | [Seaside](https://github.com/badetitou/Casino-Seaside-Exporter) |
|       [GWT/GXT](https://github.com/badetitou/Casino-GWT-Importer)       | [Aurelia](https://github.com/badetitou/Casino-Aurelia-Exporter) |
| [Silverlight](https://github.com/badetitou/Casino-Silverlight-Importer) |                                                                 |


Some importer or exporter are still in beta version. But you can help us! :smile:

To use Casino, we must use a [Moose 8 image](https://moosetechnology.github.io/moose-wiki/Beginners/InstallMoose.html).

## Contact

[contact me](mailto:badetitou@gmail.com)
