---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Quizz capitales"
subtitle: "Python - TP2"
date:   2019-11-19 10:00:00 +100
categories: HLIN303 future
---

## Quizz capitales

### Ecrivez un script Python qui crée un quizz sur les capitales

Voici les spécifications du script :

- le nombre de questions doit être donné en paramètre au script
- le fichier nommé *capitales.csv* des pays/capitales est à récupérer sur le Moodle
en voici un fragment :

```no
Afghanistan (l'),Kaboul
Afrique du Sud (l'),Prétoria
Albanie (l'),Tirana
```

- les noms des pays et des capitales doivent être initialement recopiés dans deux listes (pour ne pas être obligé de relire constamment le fichier)
- chaque pays doit être choisi aléatoirement :
pour cela utilisez la fonction *randint()* du module *random* :
`random.randint(m, n)` renvoie un entier compris entre m et n
- le score de l'internaute doit être affiché :
  - en nombre de bonnes réponses
  - en pourcentage de bonnes réponses
- et si vous avez le temps, améliorez le script pour :
  - qu'une question ne soit pas reposée lors d'une même session de test
  - que l'on puisse aussi choisir de trouver les noms de pays à partir de leurs capitales : dans ce cas-là, un menu demanderait à l'utilisateur la modalité du jeu.

#### Solution

```py
#!/usr/bin/env python3

# -*- coding : utf-8 -*-

import sys, os, re, random
os.system("clear")
if len(sys.argv) > 1 and sys.argv[1].isdigit() :
    nbQuestions = int(sys.argv[1])
    fd = open("capitales.csv", "r")
    pays = []
    capitales = []
    for ligne in fd : # on peut utiliser split() ou une regexp

        data = ligne.split(",")
        if len(data) == 2 :
            pays.append(data[0])
            capitales.append(data[1][:-1])
        # resultat = re.search("^([^(]+).*,([^(]+)", ligne)

        # if resultat :

        # pays.append(resultat.group(1))

        # capitales.append(resultat.group(2)[:-1])


    score = 0
    numQuestion = 0
    while numQuestion < nbQuestions :
        numPays = random.randint(0, len(pays)-1)
        reponse = input("\nCapitale de "+pays[numPays]+" ? ")
        if reponse == capitales[numPays] :
            print("Bonne réponse ("+capitales[numPays]+")")
            score += 1
        else :
            print("La bonne réponse était", capitales[numPays])
    numQuestion += 1
    del pays[numPays];
    del capitales[numPays];

    print("\nVotre score est", score, "soit", score/nbQuestions*100, "%")
else :
    print("Mauvais usage du script : un nombre de questions doit être donné en parametre !")
```
