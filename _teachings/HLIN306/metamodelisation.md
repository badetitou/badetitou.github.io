---
author: Benoît "badetitou" Verhaeghe
layout: reveal
title: "Métamodélisation"
subtitle: "Comment qu'on représente des trucs"
date:   2019-10-03 12:00:00 +100
categories: HLIN306
---

<!-- Hello -->
<section>

<section data-markdown>

# Métamodélisation

## Benoît Verhaeghe

Ph.D. student @ Inria Lille - RMod

R&D Engineer @ Berger-Levrault

---

benoit.verhaeghe@berger-levrault.com

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

![Complexité des logiciels](/teachings/img/HLIN306/metamodelisation/complexite.png)

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

![Complexité courbes](/teachings/img/HLIN306/metamodelisation/complexiteCourbes.jpg)

    </section>
    
    <section data-markdown>

#### Problème d’intégration d’outils

- Réingénierie vs. forward ingénierie
  - Les outils de forward ingénierie sont choisis délibérément
  - Les outils de réingénierie doivent intégrer ce qui existe déjà.
- L’intégration d’outils est plus difficile en réingénierie
- Les outils doivent travailler ensemble :
- Données partagées ⇒ entrepôt de données
- Activités synchronisées⇒ API
- Différents vendeurs ⇒ interopérabilité des standards

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

## Besoin de modèle

- Un modèle est une description, une spécification partielle d'un système
  - Abstraction de ce qui est intéressant pour un contexte et dans un but donné
  - Vue subjective et simplifiée d'un système
- But d'un modèle
  - Faciliter la compréhension d'un système
  - Simuler le fonctionnement d'un système
- Exemples
  - Modèle économique
  - Modèle démographique
  - Modèle météorologique

    </section>

    <section data-markdown>

> Le développement comme la rétro ingénierie utilisent des modèles.

    </section>

    <section data-markdown>

## Principes de l’IDM

- IDM : Ingénierie Dirigée par les Modèles
- Séparation des préoccupations
  - 2 principales préoccupations
    - Métier : le cœur de l'application, sa logique
    - Plate-forme de mise en œuvre 
  - Mais plusieurs autres préoccupations possibles
    - Sécurité
    - Interface utilisateur
    - Qualité de service
    - ...
  - Chaque préoccupation est modélisée par un ... modèle
  - Intégration des préoccupations
    - Par transformation/fusion/tissage de modèles
    - Conception orientée aspect

    </section>

    <section data-markdown>

## Remarques

- La modélisation n'est pas une discipline récente en génie logiciel
- Les processus de développement logiciel non plus
  - RUP, Merise ...
- C'est l'usage de ces modèles qui change
- Le but de l’IDM est
  - De passer d'une vision plutôt **contemplative** des modèles
    - but de documentation, spécification, communication
  - A une vision réellement **productive**

    </section>

</section>

<section>

    <section data-markdown>

# Modèle

    </section>

</section>

<section>

    <section data-markdown>

# Méta-Modèle

    </section>

</section>


<section>

    <section data-markdown>

# Reverse Engineering

    </section>

</section>

<section>

    <section data-markdown>

# A vous de jouer

    </section>

</section>