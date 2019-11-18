---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Apéritifs"
subtitle: "Python - TP1"
date:   2019-11-19 10:00:00 +100
categories: HLIN303 future
---

## Apéritifs

### 1 - Ecrivez un script Python qui affiche "Bonjour !"

La première étape est d'écrire un "Hello world".
Saisissez pour cela le code suivant (je suis tellement magnanime) sous votre éditeur préféré (fichier bonjour.py) :

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

print("Bonjour !")
```

La ligne `# -*- coding: utf-8 -*-` n'est pas obligatoire, mais elle peut permettre que certains caractères accentués
soient affichés correctement.

**A partir du terminal** n'oubliez pas tout d'abord de lui donner le droit d'exécution : `chmod +x bonjour.py` 

puis pour l'exécuter :

- si vous avez rajouté le répertoire courant (.) dans la variable système `PATH` : ligne `export PATH=$PATH:.` a placer en fin du fichier `~/.bashrc` vous pouvez directement exécuter le script par son nom : `bonjour.py`
- sinon (mais quel déshonneur) indiquez à bash où il se trouve : `./bonjour.py`

### 2 - Modifiez le script pour qu'il vérifie qu'un paramètre lui a bien été passé

Pour contrôler la présence de paramètres, testez le nombre d'éléments d'une liste (mais laquelle ?) par la fonction
len().
Si aucun paramètre n'a été donné au script, affichez un message d'erreur.

**Affichez le premier paramètre du script :**

Maintenant, passez un paramètre au script `bonjour.py` (par exemple votre prénom) pour qu'il soit affiché.

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys
if len(sys.argv) == 1 :
    print("Vous devez donner un paramètre au script")
else :
    print(sys.argv[1])
```

### 3 - Affichez tous les paramètres du script

Pour faire afficher une liste quelconque de paramètres, mettez en place une boucle automatique par :

```py
for parametre in sys.argv :
    # instructions à exécuter ...
```

(la variable paramètre étant instanciée par chaque élément de la liste sys.argv).

#### 3 - solution

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys
for parametre in sys.argv :
    print(parametre)
```

### 4 - Affichez tous les paramètres du script sauf le premier

Rappelez-vous que l'on peut saucissonner une liste !

#### 4 - solution

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys
for parametre in sys.argv[1:] : # utilisation d'un slice
    
    print(parametre)
```

### 5 - Ecrivez un script qui calcule en itératif la factorielle de n

Quelques consignes :

- n doit être donné en paramètre ;
- n doit être transtypé en entier (les paramètres sont des chaînes de caractères) ;
- il est important de se rappeler que 0 ! vaut 1.

#### 5 - solution

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys
n = int(sys.argv[1]) # la fonction int() transtype le paramètre en entier

r = 1
while n > 1 :
    r = r * n # ou r *= n

    n = n - 1 # ou n -= 1

print("Résultat =", r)
```

### 6 - Ecrivez un script qui affiche les nombres premiers contenus dans les n premiers entiers positifs

Quelques consignes :

- n doit être donné en paramètre ;
- il est important de se souvenir que le premier nombre premier est 2 ;
- ce script peut-être réalisé en deux étapes
  - lors de la première étape, les nombres premiers retrouvés ne sont pas réutilisés pour déterminer les suivants
  - lors de la seconde étape, ils sont stockés dans une liste pour être réutilisés ! c'est alors le contenu de cette liste qui doit être finalement affiché.

```py
#!/usr/bin/env python3

# -*- coding: utf-8 -*-

import sys
n = int(sys.argv[1])
listeNP = [2]
candidat = 3
while candidat <= n :
    booleenNP = True # on considère que le candidat est premier

    for i in listeNP :
        if candidat % i == 0 : # calcul du modulo (reste de la division entière)

            booleenNP = False
            break # Pour arrêter la boucle la plus proche (*)

        if booleenNP == True :
            listeNP.append(candidat)
        candidat = candidat + 1
print(listeNP)
```
