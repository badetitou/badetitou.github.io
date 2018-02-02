---
author: Benoît "badetitou" Verhaeghe
layout: post
title:  "Jeu de carte"
date:   2018-02-01 12:00:00 +200
last_modified_at: 2018-02-01 12:00:00 +200
categories: teaching preel
---

# Jeu de carte

L'objectif de cet exercice est de manipuler les objets.
Pour cela nous allons construire un jeu de carte avec ces derniers.

## Règles

### 1er version

Pour commencer nous allons créer un jeu simple.
Deux **Joueurs** vont s'affronter.
Ils auront chacun d'eux un _nombre de point de vie_, une _main_ et un _deck_.
La _main_ et le _deck_ sont en réalité des **Cartes**.
Chaque **Carte** peut être d'un type qui est, soit **Carte Montre**, soit **Carte Magique**.
Les **Cartes** infligent dans une première version des _dégats_ directement au point de vie du
  **Joueur** adverse.
Les **Joueurs** pourront poser des cartes Montres sur leur **Terrain**.
Chaque joueur possédant son propre _terrain_.

Un tour se déroulera alors de la manière suivante:
- Un **Joueur** pioche
- Effectue une action (poser un monstre sur le terrain, ou utiliser une carte magique)
- Attaque avec ses monstres
- Fini son tour

Il vous reste plus qu'à programmer le combat entre deux **Joueurs** :+1:

### 2ème version

Maintenant que l'on sait faire combattre deux **Joueurs**, on va pouvoir commencer la création de **Tournoi**.
Un tournoi va se faire confronter des **Joueurs** (dit _participants_).
Un tournoi va donc faire s’exécuter plusieurs **Match** entre deux **Joueurs**.
A la fin de chaque match il y aura un _gagnant_.

Let's go !!!

## Aide
