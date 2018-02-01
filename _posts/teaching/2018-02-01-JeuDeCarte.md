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
