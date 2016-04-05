/**
 * Created by badetitou on 04/04/16.
 */

var nbStation=2;
var nbPort = 0;

function addStation(m_routeAdresse, m_routeMasque, m_routePasserelle, m_ethport, m_ip4port) {
    nbStation++;
    var object = '';
    m_id = "station" + nbStation;
    m_name= "Station " + nbStation;
    object += "<div class=\"station  ui-draggable ui-draggable-handle\" id=\"" + m_id + "\" style=\"bottom: 250px; left: 230px;\">";
        object += "<div class=\"nom\">" + m_name + "</div>";
        object += "<div class=\"cadre_titre\" onClick=\"table_toggle($('#" + m_id + "_table'));\">Table de routage</div>";
        object += "<div class=\"tableroutage\" id=\"" + m_id + "_table\">";
        for (var i = 0;i<nbPort;++i)
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
                object += "<div class=\"ethport\" style=\"background-color: green;\">"+m_ethport +"</div>";
                object += "<div class=\"ip4port\" style=\"background-color: limegreen;\">"+m_ip4port+"</div>";
            object += "</div>";
        object += "</div>";    
    object += "</div>";
    $("body").append(object);
    elements.push($('#' + m_id));
    connexions.push({'objet1': $('#station3_interface1'), 'objet2': $('#station2_interface1')});
    main();
}

function add_route_position() {
    ++nbPort;
    var object = document.createElement('div');
    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_station_route_address_nb_"+nbPort;
    var input_route_address = document.createElement('input');
    var label_route_address = document.createElement('label');
    input_route_address.className = "mdl-textfield__input";
    input_route_address.id = "ask_station_route_address_"+nbPort;
    input_route_address.type = "text";
    label_route_address.className = "mdl-textfield__label";
    label_route_address.for = "ask_station_route_address_"+nbPort;
    label_route_address.innerHTML = "Route Adresse";
    object.appendChild(input_route_address);
    object.appendChild(label_route_address);
    componentHandler.upgradeElement(object);
    $(".add_route_position").before(object);

    var object = document.createElement('div');
    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_station_route_masque_nb_"+nbPort;
    var input_route_masque = document.createElement('input');
    var label_route_masque = document.createElement('label');
    input_route_masque.className = "mdl-textfield__input";
    input_route_masque.id = "ask_station_route_masque_"+nbPort;
    input_route_masque.type = "text";
    label_route_masque.className = "mdl-textfield__label";
    label_route_masque.for = "ask_station_route_masque_"+nbPort;
    label_route_masque.innerHTML = "Route Masque";
    object.appendChild(input_route_masque);
    object.appendChild(label_route_masque);
    componentHandler.upgradeElement(object);
    $(".add_route_position").before(object);

    var object = document.createElement('div');
    object.className = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label";
    object.id = "ask_station_route_passerelle_nb_"+nbPort;
    var input_route_passerelle = document.createElement('input');
    var label_route_passerelle = document.createElement('label');
    input_route_passerelle.className = "mdl-textfield__input";
    input_route_passerelle.id = "ask_station_route_passerelle_"+nbPort;
    input_route_passerelle.type = "text";
    label_route_passerelle.className = "mdl-textfield__label";
    label_route_passerelle.for = "ask_station_route_passerelle_"+nbPort;
    label_route_passerelle.innerHTML = "Route Passerelle";
    object.appendChild(input_route_passerelle);
    object.appendChild(label_route_passerelle);
    componentHandler.upgradeElement(object);
    $(".add_route_position").before(object);
}

function remove_route_position(){
    for (var i = nbPort; i > 0; i--){
        $("#ask_station_route_passerelle_nb_"+i).remove();
        $("#ask_station_route_address_nb_"+i).remove();
        $("#ask_station_route_masque_nb_"+i).remove();
    }
}