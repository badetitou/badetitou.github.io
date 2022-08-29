---
author: Benoît "badetitou" Verhaeghe
layout: project
title:  "VSCode - Pharo"
date:   2021-01-07 11:00:00 +200
categories: vscode pharo _ignore
description: "A VSCode extension for the Pharo programming language"
---

[VSCode Pharo](https://marketplace.visualstudio.com/items?itemName=badetitou.pharo-language-server) is an extension that enables the support of the Pharo programming language in [Visual Studio Code](https://code.visualstudio.com/).

### Documentations

<div class="masonry masonry-2">

    <div class="text-center">
        <a class="m-button" href="docs/users" target="_blank">
            User documentation
            <i class="fas fa-user"></i>
        </a>
    </div>

    <div class="text-center">
        <a class="m-button" href="docs/developers" target="_blank">
            Developers documentation
            <i class="fas fa-code"></i>
        </a>
    </div>
</div>

### Posts

<div class="masonry masonry-2">

{% for post in site.posts %}
 {% if post.tags contains "vscode-pharo" %}
  <div class="card">
    <div class="card-content post-preview">
      {% if post.external_url %}
        <a href="{{ post.external_url }}">
          <div>
            <div style="display: inline-grid;">
              <h2 class="card-title">{{ post.title }}</h2>
              {% if post.subtitle %}
              <h3 class="card-subtitle">{{ post.subtitle }}</h3>
              {% else %}
              <h3 class="card-subtitle">{{ post.excerpt | strip_html | truncatewords: 15 }}</h3>
              {% endif %}
            </div>
            <i class="fas fa-external-link-alt" style="float: right;" aria-hidden="true"></i>
          </div>
        </a>
        <p class="post-meta">Posted by
          {% if post.author %}
          {{ post.author }}
          {% else %}
          {{ site.author }}
          {% endif %}
          on
          {{ post.date | date: '%B %d, %Y' }}</p>
      {% else %}
        <a href="{{ post.url | prepend: site.baseurl | replace: '//', '/' }}">
          <h2 class="card-title">{{ post.title }}</h2>
          {% if post.subtitle %}
          <h3 class="card-subtitle">{{ post.subtitle }}</h3>
          {% else %}
          <h3 class="card-subtitle">{{ post.excerpt | strip_html | truncatewords: 15 }}</h3>
          {% endif %}
        </a>
        <p class="post-meta">Posted by
          {% if post.author %}
          {{ post.author }}
          {% else %}
          {{ site.author }}
          {% endif %}
          on
          {{ post.date | date: '%B %d, %Y' }} &middot; {% include read_time.html content=post.content %}</p>
      {% endif %}
    </div>
  </div>
   {% endif %}
{% endfor %}

</div>