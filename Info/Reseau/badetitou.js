/**
 * Created by badetitou on 04/04/16.
 */

var nbRouteur=0;
var nbStation=2;
var nbRoutage = 1;
var nbPort = 1;

/*
 *             STATION
 */

function addStation(m_routeAdresse, m_routeMasque, m_routePasserelle, m_ethport, m_ip4port) {
    nbStation++;
    var object = '';
    m_id = "station" + nbStation;
    m_name= "Station " + nbStation;
    object += "<div class=\"station  ui-draggable ui-draggable-handle\" id=\"" + m_id + "\" style=\"bottom: 250px; left: 230px;\">";
        object += "<div class=\"nom\">" + m_name + "</div>";
        object += "<div class=\"cadre_titre\" onClick=\"table_toggle($('#" + m_id + "_table'));\">Table de routage</div>";
        object += "<div class=\"tableroutage\" id=\"" + m_id + "_table\">";
        for (var i = 0; i<nbRoutage; ++i)
        {
            object += "<div class=\"route\">";
                object += "<div class=\"route_adresse\">" + m_routeAdresse[i] + "</div>";
                object += "<div class=\"route_masque\">" + m_routeMasque[i] + "</div>";
                object += "<div class=\"route_passerelle\">" + m_routePasserelle[i] + "</div>";
            object += "</div>";
        }
        object += "</div>";
        object += "<div class=\"cadre_titre\" onClick=\"table_toggle($('#" + m_id + "_arp'));\">Cache ARP</div>";
        object += "<div class=\"cachearp\" id=\"" + m_id + "_arp\"></div>";
        object += "<div class=\"cadre_titre\" onClick=\"table_toggle($('#" + m_id +"_paquets'));\">Paquets reçus</div>";
        object += "<div class=\"paquets fantome\" id=\"" + m_id + "_paquets\"></div>";
        object += "<div class=\"ports\" id=\"" + m_id + "_interfaces\">";
            object += "<div class=\"port\" id=\"" + m_id + "_interface1\">";
                object += "<div class=\"ethport\">"+m_ethport +"</div>";
                object += "<div class=\"ip4port\">"+m_ip4port+"</div>";
            object += "</div>";
        object += "</div>";    
    object += "</div>";
    $("body").append(object);
    elements.push($('#' + m_id));
    connexions.push({'objet1': $('#station3_interface1'), 'objet2': $('#station2_interface1')});
    main();
}

/*
 *                  ROUTEUR
 */

function addRouteur(m_routeAdresse, m_routeMasque, m_routePasserelle, m_ethport, m_ip4port) {
    nbRouteur++;
    var routeur = '';
    var m_id = 'routeur' + nbRouteur;
    var m_name ='Routeur' + nbRouteur;
    routeur += '<div class="routeur" id="'+m_id+'" style="top: 0px; left: 400px;">';
    routeur += '<div class="nom">Routeur ' + nbRouteur + '</div>';
    routeur += '<div class="cadre_titre" onClick="table_toggle($(\''+m_id+'_table\'));">Table de routage</div>';
    routeur += '<div class="tableroutage" id="'+m_id+'_table">';
    for (var i = 0; i<nbRoutage; ++i)
    {
        routeur += "<div class=\"route\">";
        routeur += "<div class=\"route_adresse\">" + m_routeAdresse[i] + "</div>";
        routeur += "<div class=\"route_masque\">" + m_routeMasque[i] + "</div>";
        routeur += "<div class=\"route_passerelle\">" + m_routePasserelle[i] + "</div>";
        routeur += "</div>";
    }
    routeur += '</div>';
    routeur += '<div class="cadre_titre" onClick="table_toggle($(\'#'+m_id+'_arp\'));">Cache ARP</div>';
    routeur += '<div class="cachearp" id="'+m_id+'_arp"></div>';
    routeur += '<div class="cadre_titre" onClick="table_toggle($(\'#'+m_id+'_paquets\'));">Paquets reçus</div>';
    routeur += '<div class="paquets fantome" id="'+m_id+'_paquets"></div>';

    routeur += "<div class=\"ports\" id=\"" + m_id + "_ports\">";
    for (var i=1;i<=nbPort;++i) {
        routeur += "<div class=\"port\" id=\"" + m_id + "_port" + i + "\">";
        routeur += "<div class=\"ethport\">" + m_ethport[i] + "</div>";
        routeur += "<div class=\"ip4port\">" + m_ip4port[i] + "</div>";
        routeur += '<div class="nomint">port' + i + '</div>';
        routeur += "</div>";
    }
    routeur += "</div>";

    $("body").append(routeur);
    elements.push($('#' + m_id));
    main();
}

/*
 *              Dialog dynamic
 */
//Add route position

function add_route_position(dialog) {
    ++nbRoutage;
    var object = document.createElement('div');
    var error_route = document.createElement('span');
    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_"+dialog+"_route_address_nb_"+nbRoutage;
    var input_route_address = document.createElement('input');
    var label_route_address = document.createElement('label');
    input_route_address.className = "mdl-textfield__input";
    input_route_address.id = "ask_"+dialog+"_route_address_nb_"+nbRoutage;
    input_route_address.type = "text";
    input_route_address.pattern = "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}";
    label_route_address.className = "mdl-textfield__label";
    label_route_address.for = "ask_"+dialog+"_route_address_nb_"+nbRoutage;
    label_route_address.innerHTML = "Route Adresse";
    error_route.className = "mdl-textfield__error";
    error_route.innerHTML = "Not IPV4 address";

    object.appendChild(input_route_address);
    object.appendChild(label_route_address);
    object.appendChild(error_route);
    componentHandler.upgradeElement(object);
    $(".add_route_position.dialog_"+dialog).before(object);

    var object = document.createElement('div');
    var error_route = document.createElement('span');
    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_"+dialog+"_route_masque_nb_"+nbRoutage;
    var input_route_masque = document.createElement('input');
    var label_route_masque = document.createElement('label');
    input_route_masque.className = "mdl-textfield__input";
    input_route_masque.id = "ask_"+dialog+"_route_masque_nb_"+nbRoutage;
    input_route_masque.type = "text";
    input_route_masque.pattern = "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}";
    label_route_masque.className = "mdl-textfield__label";
    label_route_masque.for = "ask_"+dialog+"_route_masque_nb_"+nbRoutage;
    label_route_masque.innerHTML = "Route Masque";
    error_route.className = "mdl-textfield__error";
    error_route.innerHTML = "Not IPV4 address";
    object.appendChild(input_route_masque);
    object.appendChild(label_route_masque);
    object.appendChild(error_route);
    componentHandler.upgradeElement(object);
    $(".add_route_position.dialog_"+dialog).before(object);

    var object = document.createElement('div');
    var error_route = document.createElement('span');

    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_"+dialog+"_route_passerelle_nb_"+nbRoutage;
    var input_route_passerelle = document.createElement('input');
    var label_route_passerelle = document.createElement('label');
    input_route_passerelle.className = "mdl-textfield__input";
    input_route_passerelle.id = "ask_" + dialog+"_route_passerelle_nb_"+nbRoutage;
    input_route_passerelle.type = "text";
    input_route_passerelle.pattern = "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}";

    label_route_passerelle.className = "mdl-textfield__label";
    label_route_passerelle.for = "ask_"+dialog+"_route_passerelle_nb_"+nbRoutage;
    label_route_passerelle.innerHTML = "Route Passerelle";

    error_route.className = "mdl-textfield__error";
    error_route.innerHTML = "Not IPV4 address";
    object.appendChild(input_route_passerelle);
    object.appendChild(label_route_passerelle);
    object.appendChild(error_route);
    componentHandler.upgradeElement(object);
    $(".add_route_position.dialog_"+dialog).before(object);
}

function remove_route_position(dialog){
    if (typeof dialog === 'undefined' || dialog === null){
        window.alert("Error. Reload the webpage");
    } else {
        for (var i = nbRoutage; i > 0; i--) {
            $("#ask_" + dialog + "_route_passerelle_nb_" + i).remove();
            $("#ask_" + dialog + "_route_address_nb_" + i).remove();
            $("#ask_" + dialog + "_route_masque_nb_" + i).remove();
        }
    }
}

// Add port position

function add_port_position(dialog) {
    ++nbPort;
}
