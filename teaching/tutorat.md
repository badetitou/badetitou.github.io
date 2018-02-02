---
layout: page
title: "Tutorat"
categories: teaching
---

## Ressources

Vous trouverez ci-dessous des ressources pour vous aider !!!

## Sujet

Vous trouverez ci-dessous les sujets que nous avons traité en TP.

{% for post in site.categories.preel %}
<div>
    <a href="{{ post.url | prepend: site.baseurl }}">
        <h3 class="post-title">            {{ post.title }}
        </h3>
        {% if post.subtitle %}
        <h4 class="post-subtitle">
            {{ post.subtitle }}
        </h4>
        {% endif %}
    </a>
</div>
<hr>
{% endfor %}
