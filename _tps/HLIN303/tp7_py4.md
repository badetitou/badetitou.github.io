---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Reporting sur la commande last"
subtitle: "Python - TP4"
date:   2019-12-02 10:00:00 +100
categories: HLIN303
---

## Reporting sur la commande last

### Sujet

En utilisant la commande last (ou en utilisant un fichier simulant le résultat de cette commande sur un poste de travail très fréquenté), écrire un script python qui liste les jours de connexion des utilisateurs qui ont fréquenté cette machine (en sachant que vous désirez surveiller les (mauvaises) fréquentations de celle-ci).

Réalisez ce programme en quatre étapes (qui se complèteront progressivement) :

- Pour information, exécutez dans le script la commande last et affichez son résultat dans le terminal
- Récupérez maintenant le résultat de cette commande dans votre script. Mettez en place progressivement l’expression
régulière qui extrait :
  - le login
  - le nom du mois et le numéro du jour dans le mois (la date)
  - le nombre d’heures
  - le nombre de minutes
- et affichez ces informations
- Affichez :
  - le nombre de connexions par login (via un dictionnaire)
  - le nombre de connexions et le temps de connexions (en minutes) par login (via un dictionnaire de listes)
  - puis par login et par date (via un dictionnaires de dictionnaires de listes)
  - Suivant des paramètres indiquant un nombre maximal de connexions et/ou un temps de connexion cumulé maximal, affichez des alertes !

#### Correction

```py
#!/usr/bin/env python3

import os, sys, collections, re


f = open(sys.argv[1], 'r')
nbConnection = collections.Counter()
connectEtTemps = dict()
loginAndDate = dict()


for line in f:
    username = re.search("^\S* ",line)
    if username:
        print("username: ", username.group())
        username = username.group()[:-1]
    date = re.search(" [A-Z][a-z][a-z] ([0-9]| )[0-9]",line)
    if date:
        print("date: ", date.group())
        date = date.group()[1:]
    nbHeure = re.search("\([0-9][0-9]",line)
    if nbHeure:
        nbHeure = nbHeure.group()[1:]
        print("nbHeure: ", nbHeure)
    nbMinute = re.search("[0-9][0-9]\)",line)
    if nbMinute:
        nbMinute = nbMinute.group()[:-1]
        print("nbMinute: ", nbMinute)

    # le nombre de connexions par login (via un dictionnaire)

    nbConnection[username] += 1
    if username not in connectEtTemps.keys():
        connectEtTemps[username] = list()

    # le nombre de connexions et le temps de connexions (en minutes) par login (via un dictionnaire de listes)

    if nbHeure and nbMinute:
        connectEtTemps[username].append(int(nbHeure)*60 + int(nbMinute))

    # puis par login et par date (via un dictionnaires de dictionnaires de listes)

    if username not in loginAndDate.keys():
        loginAndDate[username] = dict()
    if date not in loginAndDate[username].keys():
        loginAndDate[username][date] = list()
    if nbHeure and nbMinute:
        loginAndDate[username][date].append(int(nbHeure)*60 + int(nbMinute))


# print("nbConnections: ", nbConnection)

# print("connectEtTemps: ", connectEtTemps)

# print("loginAndDate: ", loginAndDate)


# affichage avancé pour login and date


for k, v in loginAndDate.items():
    print(k, " s'est connecté les: ", end = '')
    for k2,v2 in v.items():
        print(k2, " durant", sum(v2), "min ; ", end = '')
    print()
```
