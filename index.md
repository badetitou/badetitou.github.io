---
layout: page
description: "Software Engineer"
---

## Recent posts

{% for post in site.categories.research %}
- [{{ post.title }}]({{ post.url}})
{% endfor %}
