---
layout: page
title: "Research"
description: ""
---

You can find here the post I did relative to my work in research area.

{% for post in site.categories.research %}
- [{{ post.title }}]({{ post.url}})
{% endfor %}
