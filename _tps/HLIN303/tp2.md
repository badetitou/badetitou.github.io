---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Types de données, compilation séparée"
subtitle: "TP2 - Correction"
date:   2019-10-03 12:00:00 +100
categories: HLIN303
---

## TP2 - Types de données, compilation séparée

### Exercice 10 (TD/TP)

Soit une chaîne de caractères C contenant un nombre entier positif en représentation décimale. On veut écrire une fonction convertissant cette chaîne en un entier.

1. Ecrire un algorithme itératif de conversion.
2. Ecrire la fonction C correspondante.

### Solution 10 - algorithme itératif de conversion

```no
Données : chaîne s
Résultat : entier
cumul=0
    Tq s[i]>= '0' et s[i]<= '9'
        cumul=cumul*10 + conversion(s[i])
        i++
    finTq
ret cumul
```

### Solution 10 - programme atoi.c

```c
#include <stdio.h>


int monatoi(char *s){
    int cumul=0, i=0;
    if (s==NULL) 
        return 0;
    while(s[i]!='\0' && s[i]>='0' && s[i]<='9'){
        cumul=cumul*10+s[i]-'0';
        i++;
    }
    return cumul;
}

int main(int argc, char *argv[], char* env[]){
    if (argc!=2){
        fprintf(stderr,"Erreur de Syntaxe : %s 123\n", argv[0]);
        return 1;
    }
    printf("%s --> %d\n", argv[1],monatoi(argv[1]));
    return 0;
}
```

**La fonction atoi existe dans la bibliothèque standard !**

### Exercice 11 (TD/TP)

On veut réaliser la conversion inverse de l'exercice précédent. Soit un nombre entier positif que l'on veut convertir en une chaîne de caractères C contenant sa représentation décimale.

1. Ecrire un algorithme de conversion.
2. Ecrire la fonction C correspondante.

#### Solution 11 - algorithme de conversion

Soit mod l'opérateur modulo et div la division entière :

```no
chaine itoa(int i){
    si i<10
        retourne carToChaine('0'+i)
    sinon
        retourne itoa(i div 10) concat carToChaine('0'+(i mod 10))
}
```

#### Solution 11 - programme itoa.c

```c
#include <stdio.h>

#include <string.h>

/** convertit un entier en chaîne de char le représentant en base 10
*@param i une entier positif
*@param s un ptr sur un tableau de char suffisament grand
*@return NULL si i est négatif, s sinon
*/
char* itoa(int i, char *s){ /* s : un ptr sur une zone suffisament grande */
    if (i<0){
        return NULL;
    }
    else if (i<10){
        s[0]=i+'0';
        s[1]='\0';
    }else{
        char unite=i%10+'0';
        int l=strlen(itoa(i/10,s));
        s[l]=unite;
        s[l+1]='\0';
    }
    return s;
}

int main(int argc, char *argv[], char *env[]) {
    char s[256];
    for(int i=0;i<3000;i+=485){
        printf("L'entier %i est convertie en la chaine %s !\n", i,itoa(i,s));
    }
    return 0; /* OK */
}
```

**La fonction sprintf existe dans la bibliothèque standard et permet de réaliser cette conversion !**

### Exercice 12 (TD)

Ces algorithmes de conversion (entier vers chaîne, chaîne vers flottant, . . .) sont-ils fréquemment employés ?

Précisez à quelles occasions.

#### Solution 12

Dès qu'il y a une entrée/sortie d'un nombre vers un média lisible par l'homme, il y a conversion du format lisible (chaîne) vers un format binaire (Complément à 2, virgule flottante, ...).

### Exercice 13 (TD/TP)

Soit la définition des fonctions suivantes :

- fonction pair

```c
int pair(unsigned int i){
    if (i==0)
        return 1;
    else
        return impair(i-1);
}
```

- fonction impair

```c
int impair(unsigned int i){
    if (i==0)
        return 0;
    else
        return pair(i-1);
}
```

1. Créer un fichier pair.c (resp. impair.c) qui contienne la définition de la fonction pair (resp. impair).
2. Créer un fichier pair.h (resp. impair.h) qui contienne la déclaration (prototype) de la fonction pair (resp. impair). 
3. Créer un programme principal spair.c qui réalise l'algorithme suivant :

```no
lire l'entier positif n passé à la ligne de commande
si pair(n) alors
    afficher : n est pair !
sinon
    afficher : n est impair !
```

Bien entendu, il faut réfléchir au différentes inclusions à réaliser dans les différents fichiers puis compiler les 3 sources .c et lier avec le nom spair et enfin tester ce programme.

- Ecrire un fichier ppair.c contenant les trois fonctions pair(), impair() et main(). Compiler et lier cet unique fichier en un exécutable ppair. Tester ppair.

### Solution 13 - 1 

- pair.h

```c
int pair(unsigned int i);
```

- pair.c

```c
#include "impair.h"


int pair(int i){
    if (i==0)
        return 1;
    else
        return impair(i-1);
}
```

- impair.h

```c
int impair(unsigned int i);
```

- impair.c

```c
#include "pair.h"


int impair(unsigned int i){
    if (i==0)
        return 0;
    else
        return pair(i-1);
}
```

- spair.c

```c
#include <stdio.h>

#include <stdlib.h>

#include "pair.h"

int main(int argc, char *argv[], char *env[]) {
    if (argc!=2){
        printf("Syntaxe : %s fichier\n",argv[0]);
        return 1; /* syntaxe */
    }
    int n=atoi(argv[1]);
    if (pair(n))
        printf("%i est pair !\n",n);
    else
        printf("%i est impair !\n",n);
    return 0; /* OK */
}
```

Compilation : `gcc -o spair spair.c pair.c impair.c; spair 22`

### Solution 13 - 2

```c
#include <stdio.h>

#include <stdlib.h>

int impair(unsigned int i);

int pair(int i){
    if (i==0)
        return 1;
    else
        return impair(i-1);
}

int impair(unsigned int i){
    if (i==0)
        return 0;
    else
        return pair(i-1);
}

int main(int argc, char *argv[], char *env[]) {
    if (argc!=2){
        printf("Syntaxe : %s fichier\n",argv[0]);
        return 1; /* syntaxe */
    }
    int n=atoi(argv[1]);
    if (pair(n))
        printf("%i est pair !\n",n);
    else
        printf("%i est impair !\n",n);
    return 0; /* OK */
}
```

Compilation : `gcc -o ppair ppair.c; ppair 25`
