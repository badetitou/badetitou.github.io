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

</section>
