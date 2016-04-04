/**
 * Created by badetitou on 04/04/16.
 */

function addStation(m_id, m_name, m_routeAdresse, m_routeMasque, m_routePasserelle, m_ethport, m_ip4port) {
    var object = '';
    object += "<div class=\"station  ui-draggable ui-draggable-handle\" id=\"" + m_id + "\" style=\"bottom: 250px; left: 230px;\">";
        object += "<div class=\"nom\">" + m_name + "</div>";
        object += "<div class=\"cadre_titre\" onClick=\"table_toggle($('#" + m_id + "_table'));\">Table de routage</div>";
        object += "<div class=\"tableroutage\" id=\"" + m_id + "_table\">";
            object += "<div class=\"route\">";
                object += "<div class=\"route_adresse\">" + m_routeAdresse + "</div>";
                object += "<div class=\"route_masque\">" + m_routeMasque + "</div>";
                object += "<div class=\"route_passerelle\">"+ m_routePasserelle + "</div>";
            object += "</div>";
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