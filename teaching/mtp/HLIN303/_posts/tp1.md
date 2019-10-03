---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Introduction, source, objet, compilation"
subtitle: "TP1 - Correction"
date:   2019-10-03 12:00:00 +100
categories: teaching mtp hlin303
---

## TP1 - Introduction, source, objet, compilation

### Exercice 1 (TD)

Quelle différence existe-t-il entre un interpréteur et un compilateur ? Citez deux exemples pour chacun d’entre
eux.

#### Solution 1

Un interpréteur (ou interprète) lit les instructions du fichier source ligne par ligne, les analyse puis
les exécute tandis qu’un compilateur traduit le fichier source en fichier objet. Interprète (bash, java) ; compilateur
(gcc, javac).

### Exercice 2 (TD)

Quelles similitudes et quelles différences existe-t-il entre un fichier d’en-tête (toto.h) et une bibliothèque ? Quand
les utilise-t-on dans le processus de compilation ? Citez deux exemples pour chacun d’entre eux.

#### Solution 2

Les fichiers d’en-têtes sont nécessaires afin de déclarer les fonctions de bibliothèques utilisés par les
programmes.

1. Un fichier d’en-tête est un fichier source contenant des déclarations et/ou définitions de fonctions, de
variables, de définitions de type. Il doit être inclus (`#include`) par le préprocesseur avant compilation.
2. Une bibliothèque est un fichier binaire archivant différents fichiers objets (.o) compilés. Une bibliothèque
est utilisée par l’éditeur de liens à la fin du processus de compilation pour construire la fichier binaire
exécutable.
3. exemples : stdio.h est le fichier d’en-tête de la librairie standard (libc.a) concernant les entrées-sorties ;
math.h est le fichier d’en-tête correspondant à la bibliothèque libm.a.

### Exercice 3 (TD)

Quelle différence entre l’inclusion d’un fichier d’entête standard tel que stdio.h, stdlib.h, ctype.h et un
fichier d’entête personnel monprog.h ?

#### Solution 3

Les fichiers d’entêtes standards sont inclus entre chevrons tandis que les fichiers d’entête personnels
sont inclus entre guillemets. Le préprocesseur va chercher ces fichiers dans des répertoires différents :

- les entêtes standards sont généralement cherchés dans l’arborescence `/usr/include` ;
- les entête personnels sont dans le réperoire courant ou dans le répertoire spécifié par l’option `-I`.
Le contenu des fichiers d’entêtes standards ou personnels est le même.

### Exercice 4 (TD)

Comment les paramètres de la ligne de commande sont-ils passés à un programme C ? Comment l’environnement
du processus (variables d’environnement telles que PATH, HOME, ...) est-il atteignable par un programme C ?

#### Solution 4

Le prototype de la fonction principale (main) d’un programme C est le suivant :
`int main(int argc, char *argv[], char *env[]) { body... }`

- **argc** (argument count) nombre d’arguments (paramètres), c’est-à-dire le nombre de mots sur la ligne de
commande. Par exemple, `monprog toto` a un argc à 2 ;
- **argv** (argument values) tableau des mots de la ligne de commande y compris le nom de la commande. Par
exemple, `monprog toto` donne le tableau ci-dessous
- **env** tableau des variables d’environnement ou chaque case contient une chaîne de la forme nom=valeur et
dont la dernière case contient un pointeur nul.

| argv[0] | monprog |
| argv[1] | toto |

### Exercice 5 (TD/TP)

On souhaite écrire un programme affichant le nombre de paramètres passés à la ligne de commande, ces paramètres, ainsi que les variables d’environnement.

1. Ecrire l’algorithme de ce programme.
2. Ecrire le programme C correspondant.

#### Solution 5 - Algorithme

```no
afficher argc
    pour (i=0; i<argc; i++)
        afficher argv[i]
    fpour
    i=0
    tq (env[i] != NULL)
        afficher env[i]
        i=i+1
    ftq
```

#### Solution 5 - programme argenv.c

```c
#include <stdio.h>


int main(int argc, char *argv[], char *env[]) {
    printf("Nombre d’arguments : %i\n\nListe des arguments :\n",argc);
        for (int i=0;i<argc;i++){
            printf("%s\n",argv[i]);
        }
    printf("\nListe des variables d’environnement :\n");
    int i=0;
    while(env[i]!=NULL){
        printf("%s\n",env[i]);
        i++;
    }
}
```

### Exercice 6 (TP)

A l’aide du programme précédent, testez les possibilités du compilateur gcc en produisant :

- le fichier prétraité ;
- le fichier assembleur ;
- le fichier objet ;

Observez ces différents fichiers.

#### Solution 6

- `gcc argenv.c -E`
- `gcc argenv.c -S`
- `gcc argenv.c -c`

### Exercice 7 (TD/TP)

On souhaite réaliser le calcul de la moyenne d’une suite de 5 nombres flottants saisis au clavier.

1. Ecrire l’algorithme de ce programme.
2. Ecrire le programme C correspondant.

#### Solution 7 - Algorithme

```no
afficher "saisir 5 nombres"
m=0
pour (i=0 à 4)
    m=m+lireFlottant()
fpour
afficher m/5
```

#### Solution 7 - programme moyenne.c

```c
#include <stdio.h>


int main(int argc, char *argv[], char *env[]) {
    printf("Saisir 5 nombres S.V.P. :\n");
    float f;
    float m=0;
    for (int i=0;i<5;i++){
        printf("%d : ",i+1);
        scanf("%f",&f);
        m+=f;
    }
    printf("\nMoyenne des 5 nombres : %f\n",m/5);
}
```

### Exercice 8 (TD/TP)

En utilisant la fonction `atoi` qui convertit une chaîne en entier, réaliser le calcul de la moyenne de la suite des
paramètres passés à la ligne de commande : `moy 5 8 12 3`.

1. Ecrire l’algorithme de ce programme.
2. Ecrire le programme C correspondant.

#### Solution 8 - Algorithme

```no
m=0
Pour i=1 à argc-1
    m=m+atoi(argv[i])
fpour
afficher m/(argc-1)
```

#### Solution 8 - programme moy.c

```c
#include <stdio.h>

#include <stdlib.h>


int main(int argc, char *argv[], char *env[]) {
    float m=0;
    for (int i=1;i<argc-1;i++){
        m+=atoi(argv[i]);
    }
    printf("\nMoyenne des %d nombres : %.2f\n",argc-1,m/(argc-1));
}
```

### Exercice 9 (TD/TP strsplit)

Dans certains fichiers structurés, les articles sont représentés sur une ligne dont les champs sont séparés par un caractère séparateur (fichiers .csv).
On souhaite écrire une fonction qui découpe une chaîne de caractères correspondant à une ligne csv en un tableau de chaînes dynamiques.
Par exemple, l’appel `strsplit("/bin:/usr/bin:/usr/local/bin",’:’)` doit générer le tableau suivant :

<pre>
0 --> /bin
1 --> /usr/bin
2 --> /usr/local/bin
3 NULL
</pre>

1. Ecrire l’algorithme de ce programme.
2. Ecrire le programme C correspondant.

#### Solution 9 - Algorithme

```no
char **strsplit(const char *s, const char sep)
    nbsep=0
    pour i=0;s[i]!=’\0’;i++
        if s[i]==sep
            nbsep++
        res=malloc(nbsep+2)
        n=0
        i=0
    Répéter
        int l=0 // lng de la sous-chaîne
        TantQue s[i]!=’\0’ et s[i]!=sep
            l++
            i++
        res[n]=malloc(l+1)
        res[n][l]=’\0’
        strncpy(res[n],s+i-l,l)
        n++
        APRESSEP=FAUX;
        Si s[i]==sep
            i++
            APRESSEP=VRAI
    Tq s[i]!=’\0’
    Si (APRESSEP){ /* sep suivi de fin de chaîne */
        res[n]=malloc(1);
        res[n][0]=’\0’;
        n++;
    res[n]=NULL
    return res
```

#### Solution 9 -  strsplit.c

```c
#include <stdio.h>

#include <stdlib.h>

#include <string.h>


char **strsplit(const char *s, const char sep){
    if(s==NULL)
        return NULL;
    int nbsep=0; /* nb de séparateurs */
    for(int i=0;s[i]!='\0';i++){
        if (s[i]==sep)
            nbsep++;
    }
    //printf("nbsep = %d\n",nbsep);
    char **res=malloc((nbsep+2)*sizeof(char*)); /* allocation du résultat */
    int n=0;
    int i=0;
    int APRESSEP=0; /* faux */
    do{
        int l=0; // lng de la sous-chaîne
        while(s[i]!='\0' && s[i]!=sep){
            l++;
            i++;
        }
        res[n]=malloc(l+1);
        strncpy(res[n], s+i-l, l);
        res[n][l]='\0';
        n++;
        APRESSEP=0;
        if(s[i]==sep){
            i++;
            APRESSEP=1;
        }
    }while(s[i]!='\0');
    if(APRESSEP){ /* sep suivi de fin de chaîne */
        //printf("n=%d ; i=%d\n",n,i);
        res[n]=malloc(1);
        res[n][0]='\0';
        n++;
    }
    res[n]=NULL;
    return res;
}


int main(int argc, char *argv[], char *env[]) {
    if(argc!=3){
        printf("Syntaxe incorrecte : %s abc:12:yyyy :\n",argv[0]);
        return 1;
    }
    char **r=strsplit(argv[1],argv[2][0]);
    while(*r != NULL){
        printf("%s\n",*r);
        r++;
    }
    return 0;
}
```
