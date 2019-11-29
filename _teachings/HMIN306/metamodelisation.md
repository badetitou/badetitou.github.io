---
author: Benoît "badetitou" Verhaeghe
layout: reveal
title: "Métamodélisation"
subtitle: "Comment qu'on représente des trucs"
date:   2019-10-03 12:00:00 +100
categories: HMIN306
reveal_transition: fade
---

<!-- Hello -->
<section>

<section data-markdown>
<st>
# Métamodélisation

## Benoît Verhaeghe

Ph.D. student @ Inria Lille - RMod<!-- .element: class="fragment" -->

R&D Engineer @ Berger-Levrault<!-- .element: class="fragment" -->

---

benoit.verhaeghe@berger-levrault.com

</st>
</section>

<section data-markdown>

# Note

- Ces transparents sont très largement inspirés des cours de Eric Cariou, Pierre Alain Muller, Jean-Marc Jezequel, Mireille Blay-Fornarino, Benoît Combemale, Stéphane Ducasse, Anne Etien, ...

</section>
</section>

<!-- Introduction -->
<section>
    <section data-markdown>
# Introduction
    </section>

    <section data-markdown>
## Définition

> Software maintenance is the modification of a software product after delivery to correct faults, to improve performance or other attributes.

ISO/IEC 14764:2006 Software Engineering — Software Life Cycle Processes — Maintenance

    </section>

    <section data-markdown>
## Définition

> Legacy software: A system which continues to be used because of the cost of replacing or redesigning it and often despite its poor competitiveness and compatibility with modern equivalents. The implication is that the system is large, monolithic and difficult to modify. 

mondofacto.com/facts/dictionary

    </section>

    <section data-markdown>
## Disponibilité sur le long terme

- Cycle de vie de l’Airbus A300
  - Le programme a commencé en 1972, la production a été arrêtée en 2007
    - 2007-1972 = **35 années**
  - Le support durera jusqu’en 2050
    - 2050-1972 = **78 années** !!

    </section>
    <section data-markdown>

## Complexité des logiciels

![Complexité des logiciels](/teachings/img/HMIN306/metamodelisation/complexite.png)

    </section>
    <section data-markdown>

## Complexité des logiciels

```
1 000 000 lignes de code
* 2 = 2 000 000 secondes
/ 3600 = 560 heures
/ 8 = 70 jours
/ 20 = 3,5 mois
```

    </section>

    <section data-markdown>

## Complexité des logiciels

![Complexité courbes](/teachings/img/HMIN306/metamodelisation/complexiteCourbes.jpg)

    </section>
    
    <section data-markdown>
<st>
#### Problème d’intégration d’outils

- Réingénierie vs. forward ingénierie
  - Les outils de forward ingénierie sont choisis délibérément<!-- .element: style="font-size: smaller;" -->
  - Les outils de réingénierie doivent intégrer ce qui existe déjà<!-- .element: style="font-size: smaller;" -->
- L’intégration d’outils est plus difficile en réingénierie
- Les outils doivent travailler ensemble :
  - Données partagées ⇒ entrepôt de données
  - Activités synchronisées⇒ API
  - Différents vendeurs ⇒ interopérabilité des standards
</st>
    </section>

    <section data-markdown>

## Solution alternative

Une autre solution qui permette :

- Prendre du recul
- Conforme à la réalité
- D'aller plus vite
- Dans le but de :
  - Comprendre le logiciel
  - Identifier les problèmes
  - Proposer des solutions / évolutions

    </section>

    <section data-markdown>

## Principe

Le code n’est pas seulement du texte.

Il peut être abstrait et considéré comme un modèle

    </section>

    <section data-markdown>

## Les choses et leurs représentation

- Les choses
  - Réelles, virtuelles
  - Rares, chères, fragiles, dangereuses, inaccessibles, lointaines, trop nombreuses…
- Les concepts pour penser les choses
  - Plus facile, moins cher, moins dangereux

    </section>

    <section data-markdown>

## Besoin de modèle

- Abstraction
- Réutilisation
- Meilleur compréhension
- Rapidité de développement
- Modularité
- Interopérabilité
- Indépendance vis-à-vis des outils

    </section>

    <section data-markdown>
<st>
## Besoin de modèle

- Un modèle est une description, une spécification partielle d'un système
  - Abstraction de ce qui est intéressant pour un contexte et dans un but donné<!-- .element: style="font-size: smaller;" -->
  - Vue subjective et simplifiée d'un système<!-- .element: style="font-size: smaller;" -->
- But d'un modèle
  - Faciliter la compréhension d'un système<!-- .element: style="font-size: smaller;" -->
  - Simuler le fonctionnement d'un système<!-- .element: style="font-size: smaller;" -->
- Exemples
  - Modèle économique<!-- .element: style="font-size: smaller;" -->
  - Modèle démographique<!-- .element: style="font-size: smaller;" -->
  - Modèle météorologique<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

    <section data-markdown>

> Le développement comme la rétro ingénierie utilisent des modèles.

    </section>

    <section data-markdown>
<st>
## Principes de l’IDM

- IDM : Ingénierie Dirigée par les Modèles<!-- .element: style="font-size: smaller;" -->
- Séparation des préoccupations<!-- .element: style="font-size: smaller;" -->
  - 2 principales préoccupations<!-- .element: style="font-size: smaller;" -->
    - Métier : le cœur de l'application, sa logique<!-- .element: style="font-size: smaller;" -->
    - Plate-forme de mise en œuvre<!-- .element: style="font-size: smaller;" -->
  - Mais plusieurs autres préoccupations possibles<!-- .element: style="font-size: smaller;" -->
    - Sécurité<!-- .element: style="font-size: smaller;" -->
    - Interface utilisateur<!-- .element: style="font-size: smaller;" -->
    - Qualité de service<!-- .element: style="font-size: smaller;" -->
    - ...<!-- .element: style="font-size: smaller;" -->
  - Chaque préoccupation est modélisée par un ... modèle<!-- .element: style="font-size: smaller;" -->
  - Intégration des préoccupations<!-- .element: style="font-size: smaller;" -->
    - Par transformation/fusion/tissage de modèles<!-- .element: style="font-size: smaller;" -->
    - Conception orientée aspect<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

    <section data-markdown>
<st>
## Remarques

- La modélisation n'est pas une discipline récente en génie logiciel
- Les processus de développement logiciel non plus
  - RUP, Merise ...<!-- .element: style="font-size: smaller;" -->
- C'est l'usage de ces modèles qui change
- Le but de l’IDM est
  - De passer d'une vision plutôt **contemplative** des modèles<!-- .element: style="font-size: smaller;" -->
    - but de documentation, spécification, communication<!-- .element: style="font-size: smaller;" -->
  - A une vision réellement **productive**<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

    <section data-markdown>

## Comprendre un logiciel

- Concepts manipulés
- Problèmes potentiels

    </section>

    <section data-markdown>
<st>

## Problèmes architecturaux


- Documentation insuffisante = non-existante ou pas à jour.<!-- .element: style="font-size: smaller;" -->
- Nivellation (layering) impropre = trop ou pas assez de niveaux<!-- .element: style="font-size: smaller;" -->
- Cycle dans les packages = difficulté pour établir un ordre de chargement<!-- .element: style="font-size: smaller;" -->
- Manque de modularité = fort couplage<!-- .element: style="font-size: smaller;" -->
- Duplication de code = copier, coller et édition de code<!-- .element: style="font-size: smaller;" -->
- Duplication de fonctionnalités = fonctionnalités similaires par différentes équipes<!-- .element: style="font-size: smaller;" -->

</st>
    </section>

    <section data-markdown>

## Opportunités de refactoring

- Mauvaise utilisation de l’héritage = réutilisation de code vs polymorphisme
- Manque d’héritage = duplication, case statements
- God classes = séparation des préoccupations

    </section>

</section>

<section>

    <section data-markdown>

# Modèle

    </section>

    <section data-markdown>

## Modèle

- Différence entre spécification et description
  - Spécification d'un système à construire
  - Description d'un système existant
- Relation entre un système et un modèle
  - ReprésentationDe (notée μ)

![Représente](/teachings/img/HMIN306/metamodelisation/represente.png)

    </section>

    <section data-markdown>

## Modèle

- Un modèle représente un système modélisé
  - De manière générale, pas que dans un contexte de génie logiciel ou d'informatique
  - Un modèle peut aussi avoir le rôle de système modélisé dans une autre relation de représentation

![Modèle XML de la carte de la France administrative qui est un modèle de la France « réelle »](/teachings/img/HMIN306/metamodelisation/representeXML.png)

    </section>

    <section data-markdown>

## Modèles - contextes - vues

- Une France, mais plusieurs modèles de la France chacun représentant un point de vue du même système complexe

    </section>

    <section data-markdown data-background="/teachings/img/HMIN306/metamodelisation/londonFirst.png">
        <st>    
1932<!-- .element: style="position:fixed;top:10%;left:10%;color:blue" -->
        </st>
    </section>
    <section data-markdown data-background="/teachings/img/HMIN306/metamodelisation/londonSecond.png">
        <st>  
1933<!-- .element: style="position:fixed;top:10%;left:10%;color:blue" -->
        </st>
    </section>
    <section data-markdown>
<st>
## Modèles

- Un modèle est écrit dans un langage qui peut être
  - Non ou peu formalisé, la langue naturelle<!-- .element: style="font-size: smaller;" -->
    - Le français, un dessin ...<!-- .element: style="font-size: smaller;" -->
  - Formel et bien défini, non ambigu<!-- .element: style="font-size: smaller;" -->
    - Syntaxe, grammaire, sémantique<!-- .element: style="font-size: smaller;" -->
    - On parle de méta-modèle pour ce type de langage de modèle<!-- .element: style="font-size: smaller;" -->
- Pour les modèles définis dans un langage bien précis
  - Relation de conformité<!-- .element: style="font-size: smaller;" -->
    - Un modèle est conforme à son méta-modèle<!-- .element: style="font-size: smaller;" -->
    - Relation EstConformeA (notée χ)<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

</section>

<section>

    <section data-markdown>

# Méta-Modèle

    </section>
    
    <section data-markdown>

## Méta-Modèle

- Un modèle est conforme à son méta-modèle

![Modèle conforme](/teachings/img/HMIN306/metamodelisation/conforme.png)
    </section>

    <section data-markdown>
<st>
## Méta-Modèle

- Cette relation de conformité est essentielle
  - Base de l’IDM pour développer les outils capables de manipuler des modèles<!-- .element: style="font-size: smaller;" -->
  - Un méta-modèle est une entité de première classe<!-- .element: style="font-size: smaller;" -->
- Mais pas nouvelle
  - Un texte écrit est conforme à une orthographe et une grammaire<!-- .element: style="font-size: smaller;" -->
  - Un programme Java est conforme à la syntaxe et la grammaire du langage Java<!-- .element: style="font-size: smaller;" -->
  - Un fichier XML est conforme à sa DTD<!-- .element: style="font-size: smaller;" -->
  - Une carte doit être conforme à une légende<!-- .element: style="font-size: smaller;" -->
  - Un modèle UML est conforme au méta-modèle UML<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

    <section data-markdown>
<st>
## Spécification de méta-modèle

- But : définir un type de modèle avec tous ses types d'éléments et leurs contraintes
- Plusieurs approches possibles
  - Définir un métamodèle nouveau à partir de « rien », sans base de départ<!-- .element: style="font-size: smaller;" -->
  - Modifier : ajout, suppression, modification d'éléments et des contraintes sur leurs relations<!-- .element: style="font-size: smaller;" -->
  - Spécialiser un métamodèle existant en rajoutant des éléments et des contraintes (sans en enlever)<!-- .element: style="font-size: smaller;" -->
  - Correspond par exemple au mécanisme de profil UML<!-- .element: style="font-size: smaller;" -->
</st>
    </section>

    <section data-markdown>

### Exemple : bases de données relationnelles

Employé :

| NoEmp | Nom | Année | NoDep |
| --- | --- | --- | --- |
| 2067 | Dupont | 1965 | 06 |
| 0456 | Martin | 1981 | 03 |

Département :

| NoDep | Intitulé | Taille |
| --- | --- | --- |
| 03 | Comptabilité | 6 |
| 06 | Informatique | 10 |

    </section>

    <section data-markdown>
<st>
### Méta-modèle de BDR

![Modèle conforme](/teachings/img/HMIN306/metamodelisation/metaBDR.png)<!-- .element: style="height: -webkit-fill-available;" -->
</st>
    </section>
    
    <section data-markdown>

### Méta-metamodèle

![Modèle conforme](/teachings/img/HMIN306/metamodelisation/metameta.png)

    </section>

</section>

<section>

    <section data-markdown>

# Reverse Engineering

    </section>

    <section data-markdown>

## Moose

![Modèle conforme](/teachings/img/HMIN306/metamodelisation/mooseProcess.png)

    </section>

    <section data-markdown>

## Etape préparatoire

- Définir le méta-modèle
  - Dans notre cas:
    - Etendre le métamodèle FAMIX

    </section>

    <section data-markdown>

![Famix metamodel](/teachings/img/HMIN306/metamodelisation/famixMetamodel.png)

    </section>

    <section data-markdown>
<st>

## AppSI : SI du laboratoire CRIStAL

- Développer un SI autour d'une base de données
- Environnement hétérogène
  - plusieurs applications<!-- .element: style="font-size: smaller;" -->
  - plusieurs langage de programmation<!-- .element: style="font-size: smaller;" -->
- La base de données est le référentiel
  - Choix / puissance de PostgreSQL<!-- .element: style="font-size: smaller;" -->
  - Règles de gestion dans la base<!-- .element: style="font-size: smaller;" -->
  - Génération d'une partie des applications (moins de code à écrire, délai de livraison plus court)<!-- .element: style="font-size: smaller;" -->

</st>
    </section>

    <section data-markdown>

## AppSI en images

    </section>

    <section data-markdown>

## AppSI en chiffres

- Dump de 8400 lignes environ
- Nombre de tables : 165
- Nombre de vues : 63
- Nombre de colonnes : 1151
- Nombre de triggers : 21
- Nombre de fonctions : 93

    </section>

    <section data-markdown>

## Exemple d’extension

![Famix SQL metamodel](/teachings/img/HMIN306/metamodelisation/sqlExtension.png)

    </section>

    <section data-markdown>

## Exemple de visualisation

![Famix SQL metamodel](/teachings/img/HMIN306/metamodelisation/exampleVisu.png)

    </section>

    <section data-markdown>

## DB Critics

- Exemple de règles :
  - Upper case in a column name or a table name
  - Foreign key referencing a non primary column
  - Table without primary key
  - Stub entities
  - Unused function
  - Unused primary key
  - View using another view
  - View using only one table
  - High and low number of columns in a table
  - ...

    </section>

</section>

<section>

    <section data-markdown>

# A vous de jouer

    </section>

</section>