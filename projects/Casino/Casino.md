---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Documentation du projet Casino"
date:   2018-12-13 11:27:00 +100
categories: casino _ignore
---

# Documentation du projet Casino

## Introduction

Le projet Casino a pour objectif d'automatiser la migration du front-end d'application quelque soit sont langage d'implémentation et
    le langage vers lequel l'application va être migré.
Le front-end correspond aux widgets présent dans l'interface,
    leurs fonctionnements (*ex.* ce qui ce passe quand on clique sur un bouton)
    et leurs relations avec le back-end (requêtes à un serveur si besoin).

## Pré-requis

Bien que Casino a pour objectif de fonctionner quelque soit le langage d'implémentation,
    il y a des contraintes qui doivent être respectées ou qui peuvent faciliter la migration.

### Contraintes fortes

Casino effectue la migration du front-end en deux temps:

1. La transformation de l'application de base vers un méta-modèle d'interface graphique
2. Le passage du méta-modèle d'interface graphique vers l'application cible

Afin d'effectuer la migration, il est nécessaire d'avoir un parseur du langage source vers le modèle d'interface graphique et
    un exporteur vers le langage cible depuis Casino.
Le méta-modèle d'interface graphique est déjà implémenté dans Casino.

Il existe déjà des importeurs pour Java (GWT et Swing) et Spec, et des exporteurs vers Angular, Spec et Seaside.

Si le langage source ou cible est différent, il sera nécessaire de créer l'importeur ou exporteur correspondant.
Nous précisons que Casino est implémenté en [Pharo](http://pharo.org) en utilisant [Moose](http://www.moosetechnology.org/).
Moose est une plateforme qui permet l'analyse d'application quelqu'elle soit.
Cela facilite grandement la création d'un nouvel importeur ou exporteur.

### Contraintes facilitantes

Afin d'être compatible avec le plus de langage source et cible possible,
    Casino définit un ensemble de widget et attributs (applicable à ces widgets) commun.
Il est possible qu'un widget existe dans l'un des deux langages mais pas dans l'autre,
    dans ce cas, il faudra soit recréer le widget dans le langage cible,
    soit le recréer par une combinaison de widgets dans la phase d'importation.
Si un widget existe dans le langage source et cible mais n'existe pas dans Casino,
    il suffira d'ajouter une classe dans le projet Casino qui permettra de faire le lien entre le widget source et le widget cible,
    cette action ne requiert aucune connaissance en Pharo ou Moose.

Voici un schema montrant l'ensemble des widgets et attributs disponible le 13 décembre 2018 : [schema](https://www.lucidchart.com/documents/view/e9fa7fef-f06f-4307-b5e8-bbb702164e75) (onglet : *"Model V7.5 - W3C full"*)

## Stratégie de migration

Voici un schema présentant les étapes de migration implémentées par Casino.

![Processus de migration](../img/migrationProcessFR.png){: .center-image }

## Résultats courant

Voici des exemples des résultats obtenus pour la migration d'application GWT vers Angular

|                         Application Source (GWT)                         |                             Application Cible (Angular)                              |
| :----------------------------------------------------------------------: | :----------------------------------------------------------------------------------: |
|     [![Home GWT](../img/cmp/gwt/home.png)](../img/cmp/gwt/home.png)      |     [![Home Angular](../img/cmp/angular/home.png)](../img/cmp/angular/home.png)      |
| [![Libelle GWT](../img/cmp/gwt/libelle.png)](../img/cmp/gwt/libelle.png) | [![Libelle Angular](../img/cmp/angular/libelle.png)](../img/cmp/angular/libelle.png) |
|     [![Nav2 GWT](../img/cmp/gwt/nav2.png)](../img/cmp/gwt/nav2.png)      |     [![Nav2 Angular](../img/cmp/angular/nav2.png)](../img/cmp/angular/nav2.png)      |

## Liens utiles

Le core du projet (avec l'importeur GWT et l'exporteur GWT) est disponible sur [github](https://github.com/badetitou/BL-ToolKit).
On retrouve aussi

* [Importeur Swing](https://github.com/badetitou/Casino-Swing-Importer)
* [Importeur Spec](https://github.com/badetitou/Casino-Spec-Importer)
* [Exporteur Spec](https://github.com/badetitou/Casino-Spec-Exporter)
* [Exporteur Seaside](https://github.com/badetitou/BL-Model-Seaside-Exporter)

Afin de charger le projet, vous devez utiliser une image [Pharo 7 (avec Famix/Moose)](https://github.com/pharo-project/pharo) et utiliser [Iceberg](https://github.com/pharo-vcs/iceberg).

## Contact

N'hésitez pas à me [contacter](mailto:badetitou@gmail.com) pour plus d'informations.
