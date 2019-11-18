---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Entrées/Sorties"
subtitle: "TP5 - Correction"
date:   2019-10-21 9:00:00 +100
categories: HLIN303
---

## TP5 - Entrées/Sorties

### Exercice 22 (TD)

Quelle différence entre l'utilisation d'appels systèmes man 2 (open, read, close) ou bien des fonctions de bibliothèque
man 3 (fopen, fprint, ...) ?

#### Solution 22 

Les appels systèmes sont plus rapides car plus proches de la machine physique. Cependant, ils
sont moins portables et moins optimisés (tampon ou bufferisation), ce qui est moins efficace pour les autres
utilisateurs !

### Exercice 23 (TD/TP)

On souhaite compter les caractères d'un fichier passé en argument à la ligne de commande en utilisant des
appels systèmes (wc -c).

1. Ecrire un algorithme
2. Ecrire le programme C correspondant.

#### Solution 23 

- algorithme

```no
f=ouvrir(argv[1])
i=0
TantQue EOF!=lireCar(f)
i++
fermer f
afficher i
```

- programme monwc.c

```c
#include <stdio.h>/* printf */

/* #include <stdlib.h> */
/* #include <string.h> */
#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>/* open */

#include <unistd.h>/* read */


int main(int argc, char *argv[], char *env[]) {
    if(argc!=2){
        printf("Syntaxe incorrecte : %s fichier\n",argv[0]);
        return 1;
    }
    int f=open(argv[1],O_RDONLY);
    if (f==-1){
        printf("Impossible d'ouvrir le fichier : %s \n",argv[1]);
        return 2;
    }
    char c;
    int i=0;
    while(read(f,&c,1))
        i++;
    close(f);
    printf("%d\n",i);
}
```

### Exercice 24 (TD/TP)

On souhaite refaire l'exercice précédent en utilisant des fonctions de bibliothèque. Que faut-il faire ? Faites-le.

#### Solution 24

On peut conserver l'algorithme ! Il faut remplacer les appels systèmes par des appels aux fonctions
de bibliothèque.

- programme monwc2.c

```c
#include <stdio.h>/* printf */

/* #include <stdlib.h> */
/* #include <string.h> */
#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>/* open */

#include <unistd.h>/* read */


int main(int argc, char *argv[], char *env[]) {
    if(argc!=2){
        printf("Syntaxe incorrecte : %s fichier\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[1], "r");
    if (f==NULL){
        printf("Impossible d'ouvrir le fichier : %s \n",argv[1]);
        return 2;
    }
    char c;
    int i=0;
    while(fread(&c,1,1,f))
        i++;
    fclose(f);
    printf("%d\n",i);
}
```

### Exercice 25 (TD/TP)

Un filtre est un programme qui lit des données sur l'entrée standard et qui rejette dans sa sortie standard les
données modifiées. On souhaite écrire un filtre monhead qui ne rejette que les n premières lignes d'un fichier.
Par exemple :

`head -3 monfic.txt`

Cette commande permet d'afficher les 3 premières lignes du fichier monfic.txt.

1. Qu'est-ce qu'une ligne ? Faut-il utiliser appel système ou fonction de bibliothèque ?
2. Ecrire un algorithme
3. Ecrire le programme C correspondant.
4. l'option -c43 de head permet de lire les 43 premiers caractères. Implémenter cette option.

#### Solution 25

- Une ligne de fichier Unix est composé de tous les caractères précédant un retour ligne (\n, 0xA, Line Feed). Il faut utiliser la fonction de bibli. fgets qui permet de lire un fichier ligne par ligne (sinon avec des appels syst. il faut la réécrire).
- programme

```no
fic=ouvrir(argv[2])
i=1
Tq i<=atoi(argv[1][1...] et !FinDeFichier
afficher(lireLigne(fic))
i++
fermer(fic)
```

- programme monhead.c

```c
#include <stdio.h>/* printf */

#include <stdlib.h>

#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>/* open */

#include <unistd.h>/* read */


int main(int argc, char *argv[], char *env[]) {
    if(argc!=3){
        printf("Syntaxe incorrecte : %s -8 fichier\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[2], "r");
    if (f==NULL){
        printf("Impossible d'ouvrir le fichier : %s \n",argv[2]);
        return 2;
    }
    #define TAILLE 2048
    char ligne[TAILLE]; /* espérons que cela suffise ! */
    int nb=atoi(argv[1]+1); /* +1 pour éviter le - */
    int FDF=0; /* Fin De Fichier */
    for(int i=1;i<=nb && !FDF;i++){
        if(fgets(ligne,TAILLE,f))
            printf("%s",ligne);
        else
    FDF=1;
    }
    fclose(f);
}
```

- programme monhead2.c

```c
#include <stdio.h>/* printf */

#include <stdlib.h>

#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>/* open */

#include <unistd.h>/* read */


int main(int argc, char *argv[], char *env[]) {
    if(argc!=3){
        printf("Syntaxe incorrecte : %s -[8|c123] fichier\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[2], "r");
    if (f==NULL){
        printf("Impossible d'ouvrir le fichier : %s \n",argv[2]);
        return 2;
    }
    int nb; /* nb de lignes ou de car */
    int CAR=0; /* bool CAR ou LIGNES */
    if(argv[1][1]=='c'){ /* si n caractères */
        CAR=1;
        nb=atoi(argv[1]+2); /* +2 pour éviter le -c */
    }else{
        nb=atoi(argv[1]+1); /* +1 pour éviter le - */
    }
    if(CAR){
        char tampon[nb+1];
        int n=fread(tampon,1,nb,f); /* lire les nb car d'un coup */
        tampon[n]='\0';
        printf("%s",tampon);
    }else{
        #define TAILLE 2048
        
        char ligne[TAILLE]; /* espérons que cela suffise ! */
        int FDF=0; /* Fin De Fichier */
        for(int i=1;i<=nb && !FDF;i++){
            if(fgets(ligne,TAILLE,f))
                printf("%s",ligne);
            else
                FDF=1;
        }
    }
    fclose(f);
}
```
