---
author: Benoît "badetitou" Verhaeghe
layout: page
title:  "Visualisation de RCA"
date:   2018-11-27 12:00:00 +200
categories: teaching mtp _ignore
---

# Visualisation de RCA

L'objectif de ce TP est d'analyser l'application RCA en utilisant **Moose** et **Mondrian** comme vu en cours.
Pour cela, vous avez à votre disposition le code source de l'application RCA,
  un fichier _.mse_ généré à partir de l'application,
  accès à un parseur d'Interface Graphique Swing pour Moose,
  un méta-modèle d'UI et Java pour Moose.

## Ressources

## Pour commencer

1. Charger le _.mse_ dans Moose (si vous avez pris l'image depuis les Ressources, il est possible que cela soit déjà fait).
2. Créer un nouveau paquetage nommé "Analyse-RCA" et une classe à l'intérieur dans laquelle vous pourrez enregistrer votre code.

## Recherche possible

Notre objectif est de trouver des éléments que l'on pourrait améliorer dans l'application RCA.
Pour cela, nous pouvons effectuer des requêtes sur le modèle pour essayer de trouver des problèmes dans le code.
Voici une liste d'idée à explorer.

### Pour s'échauffer

* Diagramme de classes
* God classes et lazy classes
* Code mort (Toutes les méthodes qui ne sont pas invoqué ?)
* La complexité cyclomatique des méthodes (il y a déjà un outil qui fait le calcul dans Moose)
* Méthodes dépréciées

### Faire des analyses plus avancé

* Hiérarchie de paquetage avec pour chaque paquetage
  * Nombre de classes en largeur
  * Nombre de méthodes en hauteur
* Hiérarchie de paquetage avec les classes à l'intérieur des paquetages dans la visualisation
  * La taille de chaque classe correspondra à son nombre de ligne de code.
* Calcul de l'adherence entre le project RCA et les autres framework

Quelques question pour cette dernière partie:

* Quel sont les classes les plus importantes (en terme de ligne de code ? de complexité ?) ?
* Est ce que l'on si attend ?
* Que pensez-vous de l'adhérence entre _cern::colt_ et RCA ?
* Si demain (imaginons) les développeurs décident d'abandonner colt, pouvez-vous leurs indiquer où le framework est utilisé, et la complexité de supprimer colt pour chacun des endroits détectés ?
