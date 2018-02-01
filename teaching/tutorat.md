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
<div class="post-preview">
    <a href="{{ post.url | prepend: site.baseurl }}">
        <h2 class="post-title">            {{ post.title }}
        </h2>
        {% if post.subtitle %}
        <h3 class="post-subtitle">
            {{ post.subtitle }}
        </h3>
        {% endif %}
    </a>
    <p class="post-meta">Posted by {% if post.author %}{{ post.author }}{% else %}{{ site.title }}{% endif %} on {{ post.date | date: "%B %-d, %Y" }}</p>
</div>
<hr>
{% endfor %}
