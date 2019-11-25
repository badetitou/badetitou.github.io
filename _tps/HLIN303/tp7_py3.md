---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Comptages de fichiers dans une arborescence de répertoires"
subtitle: "Python - TP3"
date:   2019-11-25 10:00:00 +100
categories: HLIN303
---

## Comptages de fichiers dans une arborescence de répertoires

### Sujet

Ecrivez un script nommé comptages.py , qui lancé avec comme paramètre un nom de répertoire, compte les fichiers
(qui se trouvent dans l'arborescence définie par ce répertoire) suivant leurs extensions.
Ce script comportera une fonction récursive (càd qui s'appelle elle-même) qui sera appelée sur chaque répertoire de
l'arborescence.

#### Corrections

```py
#!/usr/bin/env python3

import os, sys, collections

counter = collections.Counter()

def parcours (repertoire) :
    print("Je suis dans "+repertoire)
    liste = os.listdir(repertoire)
    for fichier in liste :
        if os.path.isdir(repertoire + '/' + fichier) :
            parcours(repertoire + '/' + fichier)
        else :
            counter[os.path.splitext(fichier)[1]] += 1

parcours (sys.argv[1])

for el in counter.most_common():
    print(el) 

```
