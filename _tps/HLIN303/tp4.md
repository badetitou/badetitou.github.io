---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Compilation séparée et bibliothèque"
subtitle: "TP4 - Correction"
date:   2019-10-21 9:00:00 +100
categories: HLIN303
---

## TP4 - Compilation séparée et bibliothèque

### Exercice 18 (TD)

Listez les avantages et inconvénients de la liaison statique et dynamique.

#### Solution 18

### Exercice 19 (TP)

En reprenant l’exercice 13, on souhaite construire une bibliothèque statique (.a) contenant les fonctions pair
et impair à l’aide de la commande ar.

1. Créer les fichiers objets pair.o et impair.o. Puis éditer leurs liens avec le fichier spair.c après compilation
en construisant l’exécutable spair2.
2. Créer une bibliothèque statique libpair.a contenant les deux fichiers objets pair.o et impair.o. Vérifier
le contenu de libpair.a.
3. Compiler spair.c et éditer ses liens avec votre bibliothèque dans un exécutable spair3. Tester spair3.

#### Solution 19

1. ``gcc -c pair.c; gcc -c impair.c; gcc -o spair2 spair.c pair.o impair.o``
2. ``ar rs libpair.a pair.o impair.o;ar t libpair.a``
3. ``gcc -static spair.c -o spair3 -lpair -L.;spair3 45``

### Exercice 20 (TP)

En reprenant l’exercice 13, on souhaite construire une bibliothèque dynamique (.so) contenant les fonctions
pair et impair à l’aide de la commande .

- Créer la bibliothèque dynamique libpair.so contenant les fichiers objets pair.o et impair.o.
- Compiler spair.c dans un exécutable spair4 puis tester ses liens dynamiques.

#### Solution 20

- Position Independant Code

```no
gcc -fPIC -c pair.c impair.c
gcc -shared -Wl,-soname,libpair.so.1 -o libpair.so.1 pair.o impair.o
LD_LIBRARY_PATH=‘pwd‘:$LD_LIBRARY_PATH ; export LD_LIBRARY_PATH
```

```no
gcc -o spair4 spair.c -lpair
ldd spair4
```

### Exercice 21 (TP bibliothèque sd)

Vous trouverez sur le site [http://www.lirmm.fr/~meynard/](http://www.lirmm.fr/~meynard/) des fichiers d’en-tête et des sources C définisssant
des conteneurs de types génériques :

- liste générique : listeg
- association ou dictionnaire : assog
- ensemble : ensg
- arbre binaire ! arbin g
- types de base (entier, chaine, flottant, car) : types_base

L’objectif du TP est de construire une bibliothèque statique et une bibliothèque générique contenant les
objets définis, puis de l’utiliser en écrivant une application simple : calcul de toutes les parties d’un ensemble
fini d’entier.

#### Solution 21

- static

```no
gcc -c listeg.c types_base.c ensg.c assog.c arbing.c
ar -rs libsd.a listeg.o types_base.o ensg.o assog.o arbing.o
gcc -o main -static main.c -lsd -L.
main 12 45 4 89
```

- dynamic - Position Independant Code

```no
gcc -fPIC -c listeg.c types_base.c ensg.c assog.c arbing.c
gcc -shared -Wl,-soname,libsd.so.1 -o libsd.so.1 listeg.o types_base.o ensg.o
assog.o arbing.o
LD_LIBRARY_PATH=‘pwd‘:$LD_LIBRARY_PATH ; export LD_LIBRARY_PATH
gcc -o dmain -fPIC dmain.c -lsd
dmain 45 4
```
