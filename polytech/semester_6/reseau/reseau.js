//
// Network elements simulation
//

const GLIDE_DELAY=5000;

const SWITCH_ENTRY_AGE=60;
const SWITCH_CRON_DELAY=1000;

const ARP_ENTRY_AGE=60;
const ROUTER_CRON_DELAY=1000;

const IP4_RETRY_DELAY=2*GLIDE_DELAY+1000;
const IP4_RETRY_MAX=4;

const ROUTE_HIGHLIGHT_DELAY=5000;

const ETHERNET_BROADCAST='ff:ff:ff:ff:ff:ff';

//
// Global variables
//

var elements;
var connexions;
var transit=new Object();

// 
// Router simulation functions
//

function cachearp_find_address(cache,ip4addr){
var result=undefined;
cache.find('.resolution').each(function(i,obj){
  var eth=$(obj).children('.arp_ethernet').html().trim();
  var ip=$(obj).children('.arp_ip').html().trim();
  var age=$(obj).children('.arp_age').html().trim();
  if(ip==ip4addr){ result={ethernet: eth, ip: ip, age: age}; }
  });
return result;
}

function cachearp_add_entry(cache,ethaddr,ip4addr){
var ethcolor=find_address_color('ethport',ethaddr);
var ip4color=find_address_color('ip4port',ip4addr);
var text_ethaddr="<div class='arp_ethernet' style='background-color: "+ethcolor+";'>"+ethaddr+'</div>';
var text_ip4addr="<div class='arp_ip' style='background-color: "+ip4color+";'>"+ip4addr+'</div>';
var text_age="<div class='arp_age'>"+ARP_ENTRY_AGE+'</div>';
var text="<div class='resolution'>"+text_ethaddr+text_ip4addr+text_age+'</div>';
cache.append(text);
}

function cachearp_update_entry(cache,ethaddr,ip4addr){
var ethcolor=find_address_color('ethport',ethaddr);
cache.find('.resolution').each(function(i,obj){
  var ip=$(obj).children('.arp_ip').html().trim();
  var eth=$(obj).children('.arp_ethernet');
  var age=$(obj).children('.arp_age');
  if(ip==ip4addr){ eth.html(ethaddr); eth.css('background-color',ethcolor); age.html(ARP_ENTRY_AGE); }
  });
}

function cachearp_update(cache){
cache.find('.resolution').each(function(i,obj){
  var div=$(obj).children('.arp_age');
  var age=parseInt(div.html());
  if(age<=1){ $(obj).remove(); }
  else{ div.html(age-1); }
  });
}

function router_cron(self){
var cache=self.children('.cachearp');
cachearp_update(cache);
setTimeout(function(){ router_cron(self); },ROUTER_CRON_DELAY);
}

function router_check_ethernet(port,address){
var iface=port.children('.ethport');
var myaddr=iface.html().trim();
return (address.trim()==ETHERNET_BROADCAST || address.trim()==myaddr.trim());
}

function router_check_ip4(self,packet){
var div=packet.children("input[name='ip4cible']");
var ip4=div.val().trim();
var ports=self.children('.ports');
var result=false;
ports.find('.port').each(function(i,obj){
  var myip4=$(obj).children('.ip4port').html().trim();
  if(myip4==ip4) result=true; 
  });
return result;
}

function router_find_ip4_gateway(self,tgtip4){
var resgw=undefined;
var resmask=[0,0,0,0];
var div;
var table=self.children('.tableroutage');
table.find('.route').each(function(i,obj){
  var net=ip4addr_to_array($(obj).children('.route_adresse').html());
  var mask=ip4addr_to_array($(obj).children('.route_masque').html());
  var gateway=ip4addr_to_array($(obj).children('.route_passerelle').html());
  var anet=array_and(tgtip4,mask);
  if(array_compare(anet,net)==0){
    if(array_compare(mask,resmask)>=0)
      { resgw=gateway; resmask=mask; div=$(obj); }
    }
  });
if(resgw!==undefined){
  div.css('font-weight','bold');
  setTimeout(function(){ div.css('font-weight','normal'); },ROUTE_HIGHLIGHT_DELAY);
  }
return {gateway: resgw, mask: resmask};
}

function router_find_ip4_port(self,gateway,mask){
var result=undefined;
var refnet=array_and(gateway,mask);
var ports=self.children('.ports');
ports.find('.port').each(function(i,obj){
  var ip=ip4addr_to_array($(obj).children('.ip4port').html());
  var net=array_and(ip,mask);
  if(array_compare(net,refnet)==0){ result=$(obj); }
  });
return result;
}

function router_route_ip4_retry(self,packet,port,ipdest,retry){
retry++;
if(retry>IP4_RETRY_MAX){ packet.remove(); return; }
arp_create_request(port,array_to_ip4addr(ipdest));
setTimeout(function(){ router_route_ip4_packet(self,packet,retry); },IP4_RETRY_DELAY);
}

function router_route_ip4_packet(self,packet,retry){
if(retry===undefined) retry=0;
var arp=self.children('.cachearp');
var div=packet.children("input[name='ip4cible']");
var tgtip4=ip4addr_to_array(div.val());
var out=router_find_ip4_gateway(self,tgtip4);
if(out['gateway']===undefined){ packet.remove(); return; }
var ipdest,mask;
if(array_compare(out['gateway'],[0,0,0,0])==0)
  { ipdest=tgtip4; mask=out['mask']; }
else{ 
  gout=router_find_ip4_gateway(self,out['gateway']);
  ipdest=out['gateway']; mask=gout['mask'];
  }
var port=router_find_ip4_port(self,ipdest,mask);
var entry=cachearp_find_address(arp,array_to_ip4addr(ipdest));
if(entry===undefined){
  router_route_ip4_retry(self,packet,port,ipdest,retry);
  }
else{
  var ethtgt=entry['ethernet'];
  var ethsrc=port.children('.ethport').html().trim();
  var new_packet=transform_ip4_packet(packet,ethtgt,ethsrc);
  send_packet(new_packet,port);
  packet.remove();
  }
}

function router_decode_packet(self,port,packet){
var content=packet.children("input[name='contenu']").val();
var bytes=bytes_to_hexa(content);
switch(bytes[0]+bytes[1]){
  case '0806': 
    arp_decode(self,port,packet);
    break;
  }
}

function router_enqueue_packet(queue,packet,laddr,paddr){
var new_packet=packet.clone();
new_packet.removeUniqueId();
new_packet.attr('class','paquet_file');
queue.append(new_packet);
}

function packet_is_ip4(packet){
var content=packet.children("input[name='contenu']").val();
var bytes=bytes_to_hexa(content);
return (bytes[12]+bytes[13]=='0800');
}

function router_behaviour(self,port,ethtarget,packet){
var queue=self.children('.paquets');
if(!router_check_ethernet(port,ethtarget)){
  packet.remove();
  return;
  }
if(packet_is_ip4(packet)){
  if(!router_check_ip4(self,packet)){
    router_route_ip4_packet(self,packet);
    return;
    }
  }
router_decode_packet(self,port,packet);
router_enqueue_packet(queue,packet);
packet.remove();
}

// 
// Switch simulation functions
//

function memport_find_address(memory,address){
var result=undefined;
memory.find('.association').each(function(i,obj){
  var memaddr=$(obj).children('.assoc_adresse').html().trim();
  var port=$(obj).children('.assoc_port').html().trim();
  var age=$(obj).children('.assoc_age').html().trim();
  if(memaddr==address){ result={address: address, port: port, age: age}; }
  });
return result;
}

function memport_add_address(memory,address,color,port){
var text_addr="<div class='assoc_adresse' style='background-color: "+color+";'>"+address+'</div>';
var text_port="<div class='assoc_port'>"+port+'</div>';
var text_age="<div class='assoc_age'>"+SWITCH_ENTRY_AGE+'</div>';
var text="<div class='association'>"+text_addr+text_port+text_age+'</div>';
memory.append(text);
}

function memport_update_entry(memory,address,port){
memory.find('.association').each(function(i,obj){
  var memaddr=$(obj).children('.assoc_adresse').html().trim();
  var divport=$(obj).children('.assoc_port');
  var divage=$(obj).children('.assoc_age');
  if(memaddr==address){ divport.html(port); divage.html(SWITCH_ENTRY_AGE); }
  });
}

function memport_update(memory){
memory.find('.association').each(function(i,obj){
  var div=$(obj).children('.assoc_age');
  var age=parseInt(div.html());
  if(age<=1){ $(obj).remove(); }
  else{ div.html(age-1); }
  });
}

function switch_cron(element){
var memory=element.children('.memcom');
memport_update(memory);
setTimeout(function(){ switch_cron(element); },SWITCH_CRON_DELAY);
}

function switch_send(packet,ports,outport,inport){
ports.find('.port').each(function(i,obj){
  var name=$(obj).children('.nomint').html().trim();
  if((outport===undefined && name!=inport) || (outport==name)){
    var new_packet=packet.clone();
    new_packet.removeUniqueId();
    new_packet.uniqueId();
    $('body').append(new_packet);
    send_packet(new_packet,$(obj));
    }
  });
}

function switch_behaviour(self,port,srcaddr,tgtaddr,packet){
var div=port.children('.nomint');
var portname=div.html().trim();
var memory=self.children('.memcom');
var ports=self.children('.ports');
entry=memport_find_address(memory,srcaddr);
if(entry===undefined){
  var srccol=packet.children("input[name='ethsrccoul']");
  var color=srccol.val();
  memport_add_address(memory,srcaddr,color,portname);
  draw_lines(self.attr('id'),'black',1);
  }
else memport_update_entry(memory,srcaddr,portname);
entry=memport_find_address(memory,tgtaddr);
var outport=undefined;
if(entry!==undefined){ outport=entry['port']; }
switch_send(packet,ports,outport,portname);
packet.remove();
}

// 
// Generic simulation functions
//

function packet_in(target,packet){
var tgtport=packet.children("input[name='ethcible']");
var tgtaddr=tgtport.val();
var srcport=packet.children("input[name='ethsource']");
var srcaddr=srcport.val();
var element=target.parent().parent();
var types=element.attr('class').split(' ');
if(types.indexOf('commutateur')>=0){
  switch_behaviour(element,target,srcaddr,tgtaddr,packet);
  }
if(types.indexOf('station')>=0 || types.indexOf('routeur')>=0){
  router_behaviour(element,target,tgtaddr,packet);
  }
}

function packet_in_animate(packet){
var packetid=packet.attr('id');
var portid=transit[packetid];
delete transit[packetid]; 
packet_in($('#'+portid),packet);
}

//
// Some utilities
//

function find_div_by_address(type,address){
var result=undefined;
$('.'+type).each(function(i,obj){
  var parent=$(obj).parent();
  if($(obj).html().trim()==address.trim()){ result=$(obj); }
  });
return result;
}

function find_div_by_eth(address){ return find_div_by_address('ethport',address); }

function find_div_by_ipv4(address){ return find_div_by_address('ip4port',address); }

function get_target(portid){
var len=connexions.length;
for(i=0;i<len;i++){
  var id1=connexions[i]['objet1'].attr('id');
  var id2=connexions[i]['objet2'].attr('id');
  if(id1===portid) return connexions[i]['objet2'];
  if(id2===portid) return connexions[i]['objet1'];
  }
return undefined;
}

function addresses_exchange_eth_form(form){
var srcaddr=form.children("input[name='source']");
var tgtaddr=form.children("input[name='cible']");
var tmpaddr=srcaddr.val();
var tmpcol=srcaddr.css('background-color');
srcaddr.val(tgtaddr.val());
srcaddr.css('background-color',tgtaddr.css('background-color'));
tgtaddr.val(tmpaddr);
tgtaddr.css('background-color',tmpcol);
}

function addresses_exchange_ip4_form(form){
var ethsrcaddr=form.children("input[name='ethsource']");
var ethtgtaddr=form.children("input[name='ethcible']");
var ip4srcaddr=form.children("input[name='ipsource']");
var ip4tgtaddr=form.children("input[name='ipcible']");
var tmpaddr=ethsrcaddr.val();
var tmpcol=ethsrcaddr.css('background-color');
ethsrcaddr.val(ethtgtaddr.val());
ethsrcaddr.css('background-color',ethtgtaddr.css('background-color'));
ethtgtaddr.val(tmpaddr);
ethtgtaddr.css('background-color',tmpcol);
var tmpaddr=ip4srcaddr.val();
var tmpcol=ip4srcaddr.css('background-color');
ip4srcaddr.val(ip4tgtaddr.val());
ip4srcaddr.css('background-color',ip4tgtaddr.css('background-color'));
ip4tgtaddr.val(tmpaddr);
ip4tgtaddr.css('background-color',tmpcol);
}

function table_toggle(table){
table.toggle();
}

function dec2hex(byte){
var result=parseInt(byte).toString(16);
if(result.length==1){ result='0'+result; }
return result;
}

function hex2hex(hex){
if(hex.length==1){ return '0'+hex; } else { return hex; }
}

function bytes_to_array(bytes){
return bytes.trim().split(/ +/).map(function(byte){ return parseInt('0x'+byte); });
}

function array_to_bytes(array){
return array.map(function(byte){ return dec2hex(byte); }).join(' ');
}

function bytes_to_hexa(bytes){
return bytes.trim().split(/ +/).map(function(byte){ return hex2hex(byte); });
}

function hexa_to_bytes(hexa){
return hexa.join(' ');
}

function ip4addr_to_hexa(address){
return address.split('.').map(function(byte){ return dec2hex(byte); }).join(' ');
}

function ethaddr_to_hexa(address){
return address.split(':').map(function(byte){ return hex2hex(byte); }).join(' ');
}

function array_to_ip4addr(array){
return array.map(function(byte){ return byte.toString(); }).join('.');
}

function hexa_to_ip4addr(array){
return array.map(function(byte){ return parseInt('0x'+byte); }).join('.');
}

function ip4addr_to_array(address){
return bytes_to_array(ip4addr_to_hexa(address));
}

function array_to_ethaddr(array){
return array.map(function(byte){ return byte.toString(); }).join(':');
}

function hexa_to_ethaddr(array){
return array.join(':');
}

function ethaddr_to_array(address){
return bytes_to_array(ethaddr_to_hexa(address));
}

function array_compare(a1,a2){
var l1=a1.length;
var l2=a2.length;
for(var i=0;i<l1 && i<l2;i++) if(a1[i]!=a2[i]) return a1[i]-a2[i];
return l1-l2;
}

function array_and(a1,a2){
var result=[];
for(var i=0;i<a1.length;i++){ result[i]=(a1[i]&a2[i]); }
return result;
}

function find_address_color(type,address){
var port=find_div_by_address(type,address);
var color="white";
if(port!==undefined) color=port.css('background-color');
return color;
}

function match_color(type,object){
var address=$(object).val();
address=address.toLowerCase();
$(object).val(address);
$(object).css('background-color',find_address_color(type,address));
}

function match_eth_color(object){ match_color('ethport',object); }

function match_ip4_color(object){ match_color('ip4port',object); }

//
// Ethernet packets generation
//

function create_eth_packet(srcaddr,srccolor,tgtaddr,tgtcolor,packet,detail){
var text_source='<div class="ethadr" style="background-color: '+srccolor+';">'+(detail?srcaddr:'&nbsp;')+'</div>';
var text_target='<div class="ethadr" style="background-color: '+tgtcolor+';">'+(detail?tgtaddr:'&nbsp;')+'</div>';
var title=tgtaddr.replace(/:/g,' ')+' '+srcaddr.replace(/:/g,' ')+' '+packet;
var data;
data='<input type="hidden" name="ethcible" value="'+tgtaddr+'" />';
data += '<input type="hidden" name="ethsource" value="'+srcaddr+'" />';
data += '<input type="hidden" name="contenu" value="'+packet+'" />';
data += '<input type="hidden" name="ethsrccoul" value="'+srccolor+'" />';
data += '<input type="hidden" name="detail" value="'+detail+'" />';
var separator=detail?'<div class="separateur"></div>':'';
var ethaddr=text_target+separator+text_source;
var packet=$('<div class="paquet" title="'+title+'">'+ethaddr+data+'</div>');
packet.uniqueId();
$('body').append(packet);
return packet;
}

function create_eth_packet_from_form(form){
var source=form.children("input[name='source']");
var source_value=source.val();
var source_color=source.css('background-color');
var target=form.children("input[name='cible']");
var target_value=target.val();
var target_color=target.css('background-color');
var content=form.children("input[name='contenu']").val();
var detail=form.find("input[name='detail']").is(':checked');
return create_eth_packet(source_value,source_color,target_value,target_color,content,detail);
}

//
// IP4 packets generation
//

function ip4_checksum(data){
var values=bytes_to_array(data);
var sum=0;
for(var i=0;i<values.length;i++){ sum += values[i]; }
while((sum>>16)!=0) sum=(sum>>16)+sum&0xffff;
sum=(~sum)&0xffff;
var s1=dec2hex(sum/256);
var s2=dec2hex(sum%256);
return s1+' '+s2;
}

function create_ip4_header(ip4srcaddr,ip4tgtaddr,ttl,proto,ipdata){
var len=bytes_to_hexa(ipdata).length+20;
var l1=dec2hex(len/256);
var l2=dec2hex(len%256);
var hex_ttl=dec2hex(ttl);
var hex_proto=dec2hex(proto);
var packet='45 00 '+l1+' '+l2+' 00 00 00 00 '+hex_ttl+' '+hex_proto;
var src=ip4addr_to_hexa(ip4srcaddr);
var tgt=ip4addr_to_hexa(ip4tgtaddr);
var checksum=ip4_checksum(packet+' '+src+' '+tgt);
packet=packet+' '+checksum+' '+src+' '+tgt;
return packet;
}

function create_ip4_packet(
           ethsrcaddr,ethsrccolor,ethtgtaddr,ethtgtcolor,
           ip4srcaddr,ip4srccolor,ip4tgtaddr,ip4tgtcolor,
           ttl,proto,ipdata,detail){
var text_ethsource='<div class="ethadr" style="background-color: '+ethsrccolor+';">'+(detail?ethsrcaddr:'&nbsp;')+'</div>';
var text_ethtarget='<div class="ethadr" style="background-color: '+ethtgtcolor+';">'+(detail?ethtgtaddr:'&nbsp;')+'</div>';
var text_ip4source='<div class="ip4adr" style="background-color: '+ip4srccolor+';">'+(detail?ip4srcaddr:'&nbsp;')+'</div>';
var text_ip4target='<div class="ip4adr" style="background-color: '+ip4tgtcolor+';">'+(detail?ip4tgtaddr:'&nbsp;')+'</div>';
var bytes=ethtgtaddr.replace(/:/g,' ')+' '+ethsrcaddr.replace(/:/g,' ');
bytes=bytes+' 08 00 '+create_ip4_header(ip4srcaddr,ip4tgtaddr,ttl,proto,ipdata)+' '+ipdata;
var data;
data='<input type="hidden" name="ethcible" value="'+ethtgtaddr+'" />';
data += '<input type="hidden" name="ethsource" value="'+ethsrcaddr+'" />';
data += '<input type="hidden" name="ip4source" value="'+ip4srcaddr+'" />';
data += '<input type="hidden" name="ip4cible" value="'+ip4tgtaddr+'" />';
data += '<input type="hidden" name="contenu" value="'+bytes+'" />';
data += '<input type="hidden" name="ethsrccoul" value="'+ethsrccolor+'" />';
data += '<input type="hidden" name="ip4srccoul" value="'+ip4srccolor+'" />';
data += '<input type="hidden" name="detail" value="'+(detail?'true':'false')+'" />';
var sep=detail?'<div class="separateur"></div>':'';
var addresses=text_ethtarget+sep+text_ethsource+'<div class="ip4">'+text_ip4source+sep+text_ip4target+'</div>';
var packet=$('<div class="paquet" title="'+bytes+'">'+addresses+data+'</div>');
packet.uniqueId();
$('body').append(packet);
return packet;
}

function transform_ip4_packet(packet,ethtgtaddr,ethsrcaddr){
var ethsrccolor=find_address_color('ethport',ethsrcaddr);
var ethtgtcolor=find_address_color('ethport',ethtgtaddr);
var ip4srcaddr=packet.children("input[name='ip4source']").val();
var ip4tgtaddr=packet.children("input[name='ip4cible']").val();
var ip4srccolor=find_address_color('ip4port',ip4srcaddr);
var ip4tgtcolor=find_address_color('ip4port',ip4tgtaddr);
var detail=(packet.children("input[name='detail']").val()=='true');
var data=bytes_to_array(packet.children("input[name='contenu']").val());
var ttl=data[22]-1;
if(ttl<=0) return undefined;
var proto=data[23];
var ipdata=data.slice(34);
return(
  create_ip4_packet(
    ethsrcaddr,ethsrccolor,ethtgtaddr,ethtgtcolor,
    ip4srcaddr,ip4srccolor,ip4tgtaddr,ip4tgtcolor,
    ttl,proto,array_to_bytes(ipdata),detail));
}

function create_ip4_packet_from_form(form){
var ethsource=form.children("input[name='ethsource']");
var ethsource_value=ethsource.val();
var ethsource_color=ethsource.css('background-color');
var ethtarget=form.children("input[name='ethcible']");
var ethtarget_value=ethtarget.val();
var ethtarget_color=ethtarget.css('background-color');
var ip4source=form.children("input[name='ipsource']");
var ip4source_value=ip4source.val();
var ip4source_color=ip4source.css('background-color');
var ip4target=form.children("input[name='ipcible']");
var ip4target_value=ip4target.val();
var ip4target_color=ip4target.css('background-color');
var ttl=form.children("input[name='vie']").val();
var proto=form.children("input[name='protocole']").val();
var content=form.children("input[name='contenu']").val();
var detail=form.find("input[name='detail']").is(':checked');
return(
  create_ip4_packet(
    ethsource_value,ethsource_color,ethtarget_value,ethtarget_color,
    ip4source_value,ip4source_color,ip4target_value,ip4target_color,
    ttl,proto,content,detail));
}

//
// ARP packet handling
//

function arp_create_request(port,ip4addr){
var ethsrcaddr=port.children('.ethport').html();
var ethsrccolor=find_address_color('ethport',ethsrcaddr);
var ethtgtaddr=ETHERNET_BROADCAST;
var ethtgtcolor=find_address_color('ethport',ethtgtaddr);
var ip4srcaddr=port.children('.ip4port').html();
var arp='08 06 00 01 08 00 06 04 00 01 ';
arp=arp+ethaddr_to_hexa(ethsrcaddr)+' '+ip4addr_to_hexa(ip4srcaddr)+' ';
arp=arp+'00 00 00 00 00 00 '+ip4addr_to_hexa(ip4addr);
packet=create_eth_packet(ethsrcaddr,ethsrccolor,ethtgtaddr,ethtgtcolor,arp,false);
send_packet(packet,port);
}

function arp_return_answer(port,request){
var content=request.children("input[name='contenu']").val();
var bytes=bytes_to_hexa(content);
var ethsrcaddr=port.children('.ethport').html();
var ethsrccolor=find_address_color('ethport',ethsrcaddr);
var array_ethtgtaddr=bytes.slice(10,16);
var ethtgtaddr=hexa_to_ethaddr(array_ethtgtaddr);
var ethtgtcolor=find_address_color('ethport',ethtgtaddr);
var ip4srcaddr=port.children('.ip4port').html();
var array_ip4tgtaddr=bytes.slice(16,20);
var arp='08 06 00 01 08 00 06 04 00 02 ';
arp=arp+ethaddr_to_hexa(ethsrcaddr)+' '+ip4addr_to_hexa(ip4srcaddr)+' ';
arp=arp+hexa_to_bytes(array_ethtgtaddr)+' '+hexa_to_bytes(array_ip4tgtaddr);
packet=create_eth_packet(ethsrcaddr,ethsrccolor,ethtgtaddr,ethtgtcolor,arp,false);
send_packet(packet,port);
}

function arp_decode_answer(cache,packet){
var content=packet.children("input[name='contenu']").val();
var bytes=bytes_to_hexa(content);
var array_ethsrcaddr=bytes.slice(10,16);
var ethsrcaddr=hexa_to_ethaddr(array_ethsrcaddr);
var array_ip4srcaddr=bytes.slice(16,20);
var ip4srcaddr=hexa_to_ip4addr(array_ip4srcaddr);
if(cachearp_find_address(cache,ip4srcaddr)!==undefined)
  { cachearp_update_entry(cache,ethsrcaddr,ip4srcaddr); }
else
  { cachearp_add_entry(cache,ethsrcaddr,ip4srcaddr); }
}

function arp_decode(element,port,packet){
var content=packet.children("input[name='contenu']").val();
var bytes=bytes_to_hexa(content);
switch(bytes[8]+bytes[9]){
  case '0001':
    var ip4tgtaddr=hexa_to_ip4addr(bytes.slice(26,30));
    var myip4=port.children('.ip4port').html();
    if(ip4tgtaddr==myip4){ arp_return_answer(port,packet); }
    break;
  case '0002':
    var cache=element.children('.cachearp'); 
    arp_decode_answer(cache,packet);
    break;
  }
}

//
// Graphical functions
//

function send_packet(packet,port){
var portid=port.attr('id');
target=get_target(portid);
if(target===undefined) return;
var targetid=target.attr('id');
var sx=port.offset().left+(port.width()-packet.width())/2;
var sy=port.offset().top+(port.height()-packet.height())/2;
var tx=target.offset().left+(target.width()-packet.width())/2;
var ty=target.offset().top+(target.height()-packet.height())/2;
transit[packet.attr('id')]=targetid;
packet.animate(
  {left: sx, top: sy},
  0,
  function(){
    packet.animate(
      {left: tx, top: ty},
      GLIDE_DELAY,
      function(){packet_in_animate($(this));}
      );
      }
  );
}

function send_packet_from_source(packet){
var input=packet.find('input[name=ethsource]');
var srcaddr=input.val();
var div=find_div_by_eth(srcaddr);
if(div===undefined) return;
var port=div.parent();
send_packet(packet,port);
}

function draw_line(object1,object2,color,thickness){
var p1=object1.offset();
var p2=object2.offset();
var xlen=p2.left-p1.left;
var ylen=p2.top-p1.top;
var x1,x2,y1,y2;
if(Math.abs(xlen)>Math.abs(ylen)){
  if(xlen<0){
    x1=p2.left+object2.width();
    y1=p2.top+object2.height()/2;
    x2=p1.left;
    y2=p1.top+object1.height()/2;
    }
  else{
    x1=p1.left+object1.width();
    y1=p1.top+object1.height()/2;
    x2=p2.left;
    y2=p2.top+object2.height()/2;
    } 
  }
else{
  if(ylen<0){
    x1=p2.left+object2.width()/2;
    y1=p2.top+object2.height();
    x2=p1.left+object1.width()/2;
    y2=p1.top;
    }
  else{
    x1=p1.left+object1.width()/2;
    y1=p1.top+object1.height();
    x2=p2.left+object2.width()/2;
    y2=p2.top;
    }
  }
var length=Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
var cx=((x1+x2)/2)-(length/2);
var cy=((y1+y2)/2)-(thickness/2);
var angle=Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
var id1=object1.attr('id');
var id2=object2.attr('id');
var htmlLine='<div id="'+id1+'_'+id2+'" '+
                  'style="padding: 0px; '+
                         'margin: 0px; height: ' + thickness + 'px; '+
                         'background-color: ' + color + '; '+
                         'line-height: 1px; '+
                         'position:absolute; '+
                         'left: ' + cx + 'px; '+
                         'top: ' + cy + 'px; '+
                         'width: ' + length + 'px; '+
                         '-moz-transform: rotate(' + angle + 'deg); '+
                         '-webkit-transform: rotate(' + angle + 'deg); '+
                         '-o-transform: rotate(' + angle + 'deg); '+
                         '-ms-transform: rotate(' + angle + 'deg); '+
                         'transform: rotate(' + angle + 'deg);"'+
               '/>';
$('div[id='+id1+'_'+id2+']').remove();
$('div[id='+id2+'_'+id1+']').remove();
$('body').append(htmlLine);
}

function draw_lines(updated,color,thickness){
var len=connexions.length;
for(i=0;i<len;i++){
  if(updated!==false){
    var id1=connexions[i]['objet1'].attr('id');
    var id2=connexions[i]['objet2'].attr('id');
    var parts1=id1.split('_');
    var parts2=id2.split('_');
    if(parts1[0]==updated || parts2[0]==updated)
      draw_line(connexions[i]['objet1'],connexions[i]['objet2'],color,thickness);
    } 
  else { draw_line(connexions[i]['objet1'],connexions[i]['objet2'],color,thickness); }
  }
}

//
// Main procedure
//

function main(){
redraw=function(event, ui) {
  draw_lines(ui.helper.attr('id'),'black',1);
  ui.helper.css('height','');
  ui.helper.css('width','');
  };
for(i=0; i<elements.length; i++){
  elements[i].draggable({drag: redraw, stop: redraw, cancel: ".fantome"});
  var classes=elements[i].attr('class').split(/ +/);
  if(classes.indexOf('commutateur')>=0){ switch_cron(elements[i]); }
  if(classes.indexOf('routeur')>=0 || classes.indexOf('station')>=0){ router_cron(elements[i]); }
  }
draw_lines(false,'black',1);
};

