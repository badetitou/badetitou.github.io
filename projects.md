---
layout: page
title: "Projects"
---

## My projects

<div class="row">

{% for project in site.data.projects %}

<div class="col s12 m6">
    <div class="card darken-1">
        <div class="card-content">
            <div class="card-title my-card__title">
                {{ project.title }}
            </div>
            {{ project.description }}



            <div class="card-action">
                {% if project.githubLink %}
                <a href="{{ project.githubLink }}">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="fab fa-github fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                {% endif %}
                {% if project.docLink %}
                <a href="{{ project.docLink }}">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="fas fa-book-open fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                {% endif %}
                {% if project.webLink %}
                <a href="{{ project.webLink }}">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="fas fa-link fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                {% endif %}                
                {% if project.androidLink %}
                <a href="{{ project.androidLink }}">
                    <span class="fa-stack fa-lg">
                        <i class="fa fa-circle fa-stack-2x"></i>
                        <i class="fab fa-android fa-stack-1x fa-inverse"></i>
                    </span>
                </a>
                {% endif %}
            </div>
        </div>
    </div>
</div>

{% endfor %}

</div>
<div class="col s12 l12 m12">
	<h2 id="Contributing">Contributing</h2>
</div>
<div class="row">

{% include card.html
    title="Moose"
    description='Moose is a platform for software and data analysis.
It enables humane assessment (method for solving real problems without reading code), agile visualization and moldable development for Pharo.'
    githubLink='https://github.com/moosetechnology/Moose'
    docLink='http://moosetechnology.org/'
    imgSrc='/img/projectsLogo/moose-icon.png'
%}

{% include card.html
    title="FAST"
    description='FAST (Famix AST) is a metamodel to respresent AST in Famix.'
    githubLink='https://github.com/moosetechnology/FAST'
     docLink='https://moosetechnology.github.io/moose-wiki/'
%}

{% include card.html
    title="FAST-Java"
    description='FAST-Java allows us to query an AST model of JAVA in the Moose Platform.
It comes with a metamodel, a metamodel generator and a parser to create the model from a String.'
    githubLink='https://github.com/moosetechnology/FAST-Java'
    docLink='https://moosetechnology.github.io/moose-wiki/'
%}

{% include card.html
    title="FAST-Pharo"
    description='FAST-Pharo allows us to query an AST model of Pharo in the Moose Platform.
It comes with a metamodel and a metamodel generator'
    githubLink='https://github.com/moosetechnology/FAST-Pharo'
    docLink='https://moosetechnology.github.io/moose-wiki/'
%}

</div>