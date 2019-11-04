---
author: Benoît "badetitou" Verhaeghe
layout: tp
title:  "Filtres et Entrées/Sorties formattées"
subtitle: "TP6 - Correction"
date:   2019-10-21 9:00:00 +100
categories: HLIN303
---

## TP4 - Filtres et Entrées/Sorties formattées

### Exercice 26 (TD/TP)

On souhaite écrire un filtre montail qui ne rejette que les n dernières lignes d’un fichier.

1. Quelle structure de données nécessite ce programme ? Décrivez précisément cette structure de données !
2. Ecrire un algorithme
3. Ecrire le programme C correspondant.
4. l’option -c43 de tail permet de lire les 43 derniers caractères. Implémenter cette option.

#### Solution 26

- Il faut programmer une file d’attente (FIFO) avec éjection automatique de taille n afin de
conserver les lignes lues. On crèe une structure comprenant un tableau de n+1 chaînes, sa taille, son
indice de tête et de queue. On ajoute en queue, on retire en tête. Le tableau est circulaire, tete et queue
sont toujours incrémenté modulo la taille du tableau. La fifo est vide lorsque tete==queue, elle est pleine
lorsque queue”+1”=tete.

- 2

```no
fic=ouvrir(argv[2])
Fifo fifo[atoi(argv[1][1...])
Tq !FinDeFichier
ajouter(fifo,lireLigne(fic))
fermer(fic)
afficher fifo
```

- programme montail.c

```c
#include <stdio.h>/* printf */

#include <stdlib.h>

#include <string.h>/* strlen, strcpy */

#include <sys/types.h>

#include <sys/stat.h>

#include <fcntl.h>/* open */

#include <unistd.h>/* read */


typedef struct{
    char ** tch;
    int taille;
    int tete; /* ptr de tete */
    int queue; /* ptr de queue */
} fifo_ch; /* fifo de chaînes */

fifo_ch* fifo_ch_creer(unsigned int taille){
    if ( < 1) /* au moins une case */
        return tailleNULL;
    fifo_ch* r=malloc(sizeof(fifo_ch));
    r->taille=taille+1; /* tjrs une case vide entre queue et tete */
    r->tch=malloc(r->taille*sizeof(char*));
    r->tete=r->queue=0; /* fifo vide */
    return r;
}

fifo_ch * fifo_ch_ajouter(fifo_ch *f, char* s){
    char* new=malloc(strlen(s)+1);
    strcpy(new,s); /* copie dynamique de s */
    if((f->queue)%f->taille==f->tete){ /* fifo pleine */
        free(f->tch[f->tete]);
        /* désallouer la chaîne en tête */
        f->tete=(f->tete+1)%f->taille;
        /* avancer la tete */
    }
    f->tch[f->queue]=new;
    f->queue=(f->queue+1)%f->taille;
    /* avancer la queue sur case vide */
    return f;
}

void fifo_ch_afficher(fifo_ch *f){
    for(int i=f->tete;i!=f->queue;i=(i+1)%f->taille){
        printf("%s",f->tch[i]);
    }
}

int main(int argc, char *argv[], char *env[]) {
    if(argc!=3){
        printf("Syntaxe incorrecte : %s -8 fichier\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[2], "r");
    if (f==NULL){
        printf("Impossible d’ouvrir le fichier : %s \n",argv[2]);
        return 2;
    }
    int nb=atoi(argv[1]+1); /* +1 pour éviter le - */
    if(nb<1){
        printf("Impossible d’afficher %d lignes !\n",nb);
        return 3;
    }
    fifo_ch* fifo=fifo_ch_creer(nb);
    #define TAILLE 2048
    char ligne[TAILLE]; /* espérons que cela suffise ! */
    while(fgets(ligne,TAILLE,f)!=NULL){
        fifo_ch_ajouter(fifo,ligne);
    }
    fifo_ch_afficher(fifo);
    fclose(f);
}

```

### Exercice 27 (TD)

Etudiez le programme suivant : programme testaffichint.c

```c
#include <stdio.h>/* printf */

int main(int argc, char *argv[], char *env[]) {
    int i=12345;
    printf("%4.0d\n",i);
    fwrite(&i,sizeof(int),1,stdout);
}
```

L’affichage obtenu est le suivant :

```no
$testaffichint
12345
90 $
```

1. Quelle différence esiste-t-il entre ces deux affichages ?
2. Précisez la valeur de 90__. Quel est le “boutisme” (endianness) de cette machine ?
3. Quels avantages et inconvénients de ces types de codage dans les fichiers en matière de sauvegarde de
données ?

#### Solution 27

1. Le premier affichage est formatté pour la lecture par l’être humain, le second est une recopie
binaire de l’entier tel qu’il est stocké en machine.
2. 48 ∗ 256 + 57 = 12345 or 48 est le code ASCII du 0 et 57 celui du 9. Les deux octets de poids forts à 0
ne sont pas affichés (espace). Cette machine est little-endian ou petit-boutiste ou mot de poids faible en
tête.
3. Les avantages du binaire sont la concision (taille) et la vitesse de sauvegarde/chargement. L’avantage du
formattage est la lisibilité !

### Exercice 28 (TD/TP fichiers .csv)

En examinant certains fichiers de configuration situés dans le répertoire /etc, tels que passwd, fstab, group,
on voit que ces fichiers textes sont composés d’articles d’une ligne, chaque article étant composé de champs
séparés par un caractère (:). On souhaite écrire une commande monselect correspondant de manière simplifiée
à l’instruction SELECT de SQL. Les champs étant numérotés de 1 à n, l’exemple suivant affichera chaque ligne
du fichier passwd dont le deuxième champ est égal à “dupont” :
monselect /etc/passwd : 2 dupont

1. Ecrire un algorithme
2. Ecrire le programme C correspondant.

#### Solution 28

1. Ecrire un algorithme

```no
fic=ouvrir(argv[1])
Tq l=lireLigne(fic)!=FinDeFichier
    tch=strsplit(l,argv[2])
    Si tch[atoi(argv[3])]==argv[4]
        afficher l
fermer(fic)
```

1. programme monselect.c

```c
#include <stdio.h>

#include <stdlib.h>

#include <string.h>/* strlen, strcpy */

#include <sys/types.h>

#include <sys/stat.h>


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
        int l=0;
        // lng de la sous-chaîne
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
    } while(s[i]!='\0');
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
    if(argc!=5){
        printf("Syntaxe incorrecte : %s fichier : 2 \"a chercher\"\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[1], "r");
    if (f==NULL){
        printf("Impossible d'ouvrir le fichier : %s \n",argv[1]);
        return 2;
    }
    int nb=atoi(argv[3])-1; /* de 0 à n */
    if(nb<0){
        printf("Impossible d'afficher le champ %d !\n",nb+1);
        return 3;
    }
    char sep=argv[2][0]; // printf("|%s|",argv[4]);
    #define TAILLE 2048
    char ligne[TAILLE]; /* espérons que cela suffise ! */
    while(fgets(ligne,TAILLE,f)!=NULL){
        int l=strlen(ligne);
        if (ligne[l-1]=='\n')
            ligne[l-1]='\0'; /* suppression du retour du dernier champ */
        char**tch=strsplit(ligne,sep);
        // printf("champ : |%s| de taille %d\n" ,tch[nb],strlen(tch[nb]));
        if(!strcmp(tch[nb],argv[4]))
            printf("%s\n",ligne);
    }
    fclose(f);
}

```

### Exercice 29 (TP sauvegarde binaire)

Soit un tableau d’étudiants que l’on veut sauver (écrire) dans un fichier au format binaire. Suivent les définitions
de type et de ce tableau :

```c
typedef struct {
    int code;
    /* code étudiant 20091234 */
    char nom[20]; /* "dupont" */
    char dnais[8]; /* 19901231 */
} etudiant;
etudiant tabetu[100]={ {20091234,"dupont","19891231"},
    {20091235,"martin","19891130"},
    20{0,"",""}
}; /* tableau des étudiants */
```

Le tableau est compacté vers les indices faibles et le premier article (struct)ayant un code nul indique la fin des
étudiants.

1. Ecrire un programme C permettant de sauver le tableau dans un fichier binaire passé en argument et ne contenant que les étudiants présents.
2. Visualiser le fichier sauvé en hexadécimal (hexl ou od -cx) et donner une interprétation.
3. Ecrire un programme C permettant de lire le fichier sauvé afin de le stocker dans un tableau puis afficher
le résultat.

#### Solution 29

- programme sauveretudiants.c

```c
#include <stdio.h>/* printf */

#include <stdlib.h>

#include <string.h>/* strlen, strcpy */

#include <sys/types.h>

#include <sys/stat.h>


typedef struct {
    int code; /* code étudiant 20091234 */
    char nom[20]; /* "dupont" */
    char dnais[8]; /* 19901231 */
} etudiant;

etudiant tabetu[100]={ {20091234,"dupont","19891231"},
{20091235,"martin","19891130"},
{0,"",""}
}; /* tableau des étudiants */

int main(int argc, char *argv[], char *env[]) {
    if(argc!=2){
        printf("Syntaxe incorrecte : %s fichier\n",argv[0]);
        return 1;
    }
    for(int i=0;tabetu[i].code!=0;i++){
        printf("%d|%-20.20s|%-8.8s\n",tabetu[i].code,tabetu[i].nom,tabetu[i].dnais);
    }
    FILE *f=fopen(argv[1], "w");
    for(int i=0;tabetu[i].code!=0;i++){
        fwrite(tabetu+i,sizeof(etudiant),1,f);
    }
    fclose(f);
    return 0;
}
```

- Tableau binaire

```no
00000000:6291 3201 6475 706f 6e74 0000 0000 b.2.dupont......
00000010:0000 0000 0000 0000 3139 3839 3132 ........19891231
00000020:6391 3201 6d61 7274 696e 0000 0000 c.2.martin......
00000030:0000 0000 0000 0000 3139 3839 3131 ........19891130
```

l’entier sur 4 octets en C2, puis le nom sur 20 octets,

- programme chargeretudiants.c

```c
#include <stdio.h>/* printf */

#include <stdlib.h>

#include <string.h>/* strlen, strcpy */

#include <sys/types.h>

#include <sys/stat.h>


typedef struct {
    int code; /* code étudiant 20091234 */
    char nom[20]; /* "dupont" */
    char dnais[8]; /* 19901231 */
} etudiant;

etudiant tabetu[100]; /* tableau des étudiants */

int main(int argc, char *argv[], char *env[]) {
    if(argc!=2){
        printf("Syntaxe incorrecte : %s fichier\n",argv[0]);
        return 1;
    }
    FILE *f=fopen(argv[1], "r");
    //while(EOF!=fread(tabetu+i,sizeof(etudiant),1,f);
    int i;
    for(i=0;fread(tabetu+i,sizeof(etudiant),1,f);i++){
    }
    fclose(f);
    tabetu[i].code=0; /* fin */
    for(int i=0;tabetu[i].code!=0;i++){
        printf("%d|%-20.20s|%-8.8s\n",tabetu[i].code,tabetu[i].nom,tabetu[i].dnais);
    }
    return 0;
}
```

Après avoir modifié à la main le fichier sauvé, on obtient :

```no
20091234|meynard        |19891231
20091235|tototututututut|19891130
```
