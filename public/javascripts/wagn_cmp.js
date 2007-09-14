var Prototype={Version:"1.5.0",BrowserFeatures:{XPath:!!document.evaluate},ScriptFragment:"(?:<script.*?>)((\n|\r|.)*?)(?:</script>)",emptyFunction:function(){
},K:function(x){
return x;
}};
var Class={create:function(){
return function(){
this.initialize.apply(this,arguments);
};
}};
var Abstract=new Object();
Object.extend=function(_2,_3){
for(var _4 in _3){
_2[_4]=_3[_4];
}
return _2;
};
Object.extend(Object,{inspect:function(_5){
try{
if(_5===undefined){
return "undefined";
}
if(_5===null){
return "null";
}
return _5.inspect?_5.inspect():_5.toString();
}
catch(e){
if(e instanceof RangeError){
return "...";
}
throw e;
}
},keys:function(_6){
var _7=[];
for(var _8 in _6){
_7.push(_8);
}
return _7;
},values:function(_9){
var _a=[];
for(var _b in _9){
_a.push(_9[_b]);
}
return _a;
},clone:function(_c){
return Object.extend({},_c);
}});
Function.prototype.bind=function(){
var _d=this,_e=$A(arguments),_f=_e.shift();
return function(){
return _d.apply(_f,_e.concat($A(arguments)));
};
};
Function.prototype.bindAsEventListener=function(_10){
var _11=this,_12=$A(arguments),_10=_12.shift();
return function(_13){
return _11.apply(_10,[(_13||window.event)].concat(_12).concat($A(arguments)));
};
};
Object.extend(Number.prototype,{toColorPart:function(){
var _14=this.toString(16);
if(this<16){
return "0"+_14;
}
return _14;
},succ:function(){
return this+1;
},times:function(_15){
$R(0,this,true).each(_15);
return this;
}});
var Try={these:function(){
var _16;
for(var i=0,_18=arguments.length;i<_18;i++){
var _19=arguments[i];
try{
_16=_19();
break;
}
catch(e){
}
}
return _16;
}};
var PeriodicalExecuter=Class.create();
PeriodicalExecuter.prototype={initialize:function(_1a,_1b){
this.callback=_1a;
this.frequency=_1b;
this.currentlyExecuting=false;
this.registerCallback();
},registerCallback:function(){
this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},stop:function(){
if(!this.timer){
return;
}
clearInterval(this.timer);
this.timer=null;
},onTimerEvent:function(){
if(!this.currentlyExecuting){
try{
this.currentlyExecuting=true;
this.callback(this);
}
finally{
this.currentlyExecuting=false;
}
}
}};
String.interpret=function(_1c){
return _1c==null?"":String(_1c);
};
Object.extend(String.prototype,{gsub:function(_1d,_1e){
var _1f="",_20=this,_21;
_1e=arguments.callee.prepareReplacement(_1e);
while(_20.length>0){
if(_21=_20.match(_1d)){
_1f+=_20.slice(0,_21.index);
_1f+=String.interpret(_1e(_21));
_20=_20.slice(_21.index+_21[0].length);
}else{
_1f+=_20,_20="";
}
}
return _1f;
},sub:function(_22,_23,_24){
_23=this.gsub.prepareReplacement(_23);
_24=_24===undefined?1:_24;
return this.gsub(_22,function(_25){
if(--_24<0){
return _25[0];
}
return _23(_25);
});
},scan:function(_26,_27){
this.gsub(_26,_27);
return this;
},truncate:function(_28,_29){
_28=_28||30;
_29=_29===undefined?"...":_29;
return this.length>_28?this.slice(0,_28-_29.length)+_29:this;
},strip:function(){
return this.replace(/^\s+/,"").replace(/\s+$/,"");
},stripTags:function(){
return this.replace(/<\/?[^>]+>/gi,"");
},stripScripts:function(){
return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"");
},extractScripts:function(){
var _2a=new RegExp(Prototype.ScriptFragment,"img");
var _2b=new RegExp(Prototype.ScriptFragment,"im");
return (this.match(_2a)||[]).map(function(_2c){
return (_2c.match(_2b)||["",""])[1];
});
},evalScripts:function(){
return this.extractScripts().map(function(_2d){
return eval(_2d);
});
},escapeHTML:function(){
var div=document.createElement("div");
var _2f=document.createTextNode(this);
div.appendChild(_2f);
return div.innerHTML;
},unescapeHTML:function(){
var div=document.createElement("div");
div.innerHTML=this.stripTags();
return div.childNodes[0]?(div.childNodes.length>1?$A(div.childNodes).inject("",function(_31,_32){
return _31+_32.nodeValue;
}):div.childNodes[0].nodeValue):"";
},toQueryParams:function(_33){
var _34=this.strip().match(/([^?#]*)(#.*)?$/);
if(!_34){
return {};
}
return _34[1].split(_33||"&").inject({},function(_35,_36){
if((_36=_36.split("="))[0]){
var _37=decodeURIComponent(_36[0]);
var _38=_36[1]?decodeURIComponent(_36[1]):undefined;
if(_35[_37]!==undefined){
if(_35[_37].constructor!=Array){
_35[_37]=[_35[_37]];
}
if(_38){
_35[_37].push(_38);
}
}else{
_35[_37]=_38;
}
}
return _35;
});
},toArray:function(){
return this.split("");
},succ:function(){
return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1);
},camelize:function(){
var _39=this.split("-"),len=_39.length;
if(len==1){
return _39[0];
}
var _3b=this.charAt(0)=="-"?_39[0].charAt(0).toUpperCase()+_39[0].substring(1):_39[0];
for(var i=1;i<len;i++){
_3b+=_39[i].charAt(0).toUpperCase()+_39[i].substring(1);
}
return _3b;
},capitalize:function(){
return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();
},underscore:function(){
return this.gsub(/::/,"/").gsub(/([A-Z]+)([A-Z][a-z])/,"#{1}_#{2}").gsub(/([a-z\d])([A-Z])/,"#{1}_#{2}").gsub(/-/,"_").toLowerCase();
},dasherize:function(){
return this.gsub(/_/,"-");
},inspect:function(_3d){
var _3e=this.replace(/\\/g,"\\\\");
if(_3d){
return "\""+_3e.replace(/"/g,"\\\"")+"\"";
}else{
return "'"+_3e.replace(/'/g,"\\'")+"'";
}
}});
String.prototype.gsub.prepareReplacement=function(_3f){
if(typeof _3f=="function"){
return _3f;
}
var _40=new Template(_3f);
return function(_41){
return _40.evaluate(_41);
};
};
String.prototype.parseQuery=String.prototype.toQueryParams;
var Template=Class.create();
Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;
Template.prototype={initialize:function(_42,_43){
this.template=_42.toString();
this.pattern=_43||Template.Pattern;
},evaluate:function(_44){
return this.template.gsub(this.pattern,function(_45){
var _46=_45[1];
if(_46=="\\"){
return _45[2];
}
return _46+String.interpret(_44[_45[3]]);
});
}};
var $break=new Object();
var $continue=new Object();
var Enumerable={each:function(_47){
var _48=0;
try{
this._each(function(_49){
try{
_47(_49,_48++);
}
catch(e){
if(e!=$continue){
throw e;
}
}
});
}
catch(e){
if(e!=$break){
throw e;
}
}
return this;
},eachSlice:function(_4a,_4b){
var _4c=-_4a,_4d=[],_4e=this.toArray();
while((_4c+=_4a)<_4e.length){
_4d.push(_4e.slice(_4c,_4c+_4a));
}
return _4d.map(_4b);
},all:function(_4f){
var _50=true;
this.each(function(_51,_52){
_50=_50&&!!(_4f||Prototype.K)(_51,_52);
if(!_50){
throw $break;
}
});
return _50;
},any:function(_53){
var _54=false;
this.each(function(_55,_56){
if(_54=!!(_53||Prototype.K)(_55,_56)){
throw $break;
}
});
return _54;
},collect:function(_57){
var _58=[];
this.each(function(_59,_5a){
_58.push((_57||Prototype.K)(_59,_5a));
});
return _58;
},detect:function(_5b){
var _5c;
this.each(function(_5d,_5e){
if(_5b(_5d,_5e)){
_5c=_5d;
throw $break;
}
});
return _5c;
},findAll:function(_5f){
var _60=[];
this.each(function(_61,_62){
if(_5f(_61,_62)){
_60.push(_61);
}
});
return _60;
},grep:function(_63,_64){
var _65=[];
this.each(function(_66,_67){
var _68=_66.toString();
if(_68.match(_63)){
_65.push((_64||Prototype.K)(_66,_67));
}
});
return _65;
},include:function(_69){
var _6a=false;
this.each(function(_6b){
if(_6b==_69){
_6a=true;
throw $break;
}
});
return _6a;
},inGroupsOf:function(_6c,_6d){
_6d=_6d===undefined?null:_6d;
return this.eachSlice(_6c,function(_6e){
while(_6e.length<_6c){
_6e.push(_6d);
}
return _6e;
});
},inject:function(_6f,_70){
this.each(function(_71,_72){
_6f=_70(_6f,_71,_72);
});
return _6f;
},invoke:function(_73){
var _74=$A(arguments).slice(1);
return this.map(function(_75){
return _75[_73].apply(_75,_74);
});
},max:function(_76){
var _77;
this.each(function(_78,_79){
_78=(_76||Prototype.K)(_78,_79);
if(_77==undefined||_78>=_77){
_77=_78;
}
});
return _77;
},min:function(_7a){
var _7b;
this.each(function(_7c,_7d){
_7c=(_7a||Prototype.K)(_7c,_7d);
if(_7b==undefined||_7c<_7b){
_7b=_7c;
}
});
return _7b;
},partition:function(_7e){
var _7f=[],_80=[];
this.each(function(_81,_82){
((_7e||Prototype.K)(_81,_82)?_7f:_80).push(_81);
});
return [_7f,_80];
},pluck:function(_83){
var _84=[];
this.each(function(_85,_86){
_84.push(_85[_83]);
});
return _84;
},reject:function(_87){
var _88=[];
this.each(function(_89,_8a){
if(!_87(_89,_8a)){
_88.push(_89);
}
});
return _88;
},sortBy:function(_8b){
return this.map(function(_8c,_8d){
return {value:_8c,criteria:_8b(_8c,_8d)};
}).sort(function(_8e,_8f){
var a=_8e.criteria,b=_8f.criteria;
return a<b?-1:a>b?1:0;
}).pluck("value");
},toArray:function(){
return this.map();
},zip:function(){
var _92=Prototype.K,_93=$A(arguments);
if(typeof _93.last()=="function"){
_92=_93.pop();
}
var _94=[this].concat(_93).map($A);
return this.map(function(_95,_96){
return _92(_94.pluck(_96));
});
},size:function(){
return this.toArray().length;
},inspect:function(){
return "#<Enumerable:"+this.toArray().inspect()+">";
}};
Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray});
var $A=Array.from=function(_97){
if(!_97){
return [];
}
if(_97.toArray){
return _97.toArray();
}else{
var _98=[];
for(var i=0,_9a=_97.length;i<_9a;i++){
_98.push(_97[i]);
}
return _98;
}
};
Object.extend(Array.prototype,Enumerable);
if(!Array.prototype._reverse){
Array.prototype._reverse=Array.prototype.reverse;
}
Object.extend(Array.prototype,{_each:function(_9b){
for(var i=0,_9d=this.length;i<_9d;i++){
_9b(this[i]);
}
},clear:function(){
this.length=0;
return this;
},first:function(){
return this[0];
},last:function(){
return this[this.length-1];
},compact:function(){
return this.select(function(_9e){
return _9e!=null;
});
},flatten:function(){
return this.inject([],function(_9f,_a0){
return _9f.concat(_a0&&_a0.constructor==Array?_a0.flatten():[_a0]);
});
},without:function(){
var _a1=$A(arguments);
return this.select(function(_a2){
return !_a1.include(_a2);
});
},indexOf:function(_a3){
for(var i=0,_a5=this.length;i<_a5;i++){
if(this[i]==_a3){
return i;
}
}
return -1;
},reverse:function(_a6){
return (_a6!==false?this:this.toArray())._reverse();
},reduce:function(){
return this.length>1?this:this[0];
},uniq:function(){
return this.inject([],function(_a7,_a8){
return _a7.include(_a8)?_a7:_a7.concat([_a8]);
});
},clone:function(){
return [].concat(this);
},size:function(){
return this.length;
},inspect:function(){
return "["+this.map(Object.inspect).join(", ")+"]";
}});
Array.prototype.toArray=Array.prototype.clone;
function $w(_a9){
_a9=_a9.strip();
return _a9?_a9.split(/\s+/):[];
}
if(window.opera){
Array.prototype.concat=function(){
var _aa=[];
for(var i=0,_ac=this.length;i<_ac;i++){
_aa.push(this[i]);
}
for(var i=0,_ac=arguments.length;i<_ac;i++){
if(arguments[i].constructor==Array){
for(var j=0,_ae=arguments[i].length;j<_ae;j++){
_aa.push(arguments[i][j]);
}
}else{
_aa.push(arguments[i]);
}
}
return _aa;
};
}
var Hash=function(obj){
Object.extend(this,obj||{});
};
Object.extend(Hash,{toQueryString:function(obj){
var _b1=[];
this.prototype._each.call(obj,function(_b2){
if(!_b2.key){
return;
}
if(_b2.value&&_b2.value.constructor==Array){
var _b3=_b2.value.compact();
if(_b3.length<2){
_b2.value=_b3.reduce();
}else{
key=encodeURIComponent(_b2.key);
_b3.each(function(_b4){
_b4=_b4!=undefined?encodeURIComponent(_b4):"";
_b1.push(key+"="+encodeURIComponent(_b4));
});
return;
}
}
if(_b2.value==undefined){
_b2[1]="";
}
_b1.push(_b2.map(encodeURIComponent).join("="));
});
return _b1.join("&");
}});
Object.extend(Hash.prototype,Enumerable);
Object.extend(Hash.prototype,{_each:function(_b5){
for(var key in this){
var _b7=this[key];
if(_b7&&_b7==Hash.prototype[key]){
continue;
}
var _b8=[key,_b7];
_b8.key=key;
_b8.value=_b7;
_b5(_b8);
}
},keys:function(){
return this.pluck("key");
},values:function(){
return this.pluck("value");
},merge:function(_b9){
return $H(_b9).inject(this,function(_ba,_bb){
_ba[_bb.key]=_bb.value;
return _ba;
});
},remove:function(){
var _bc;
for(var i=0,_be=arguments.length;i<_be;i++){
var _bf=this[arguments[i]];
if(_bf!==undefined){
if(_bc===undefined){
_bc=_bf;
}else{
if(_bc.constructor!=Array){
_bc=[_bc];
}
_bc.push(_bf);
}
}
delete this[arguments[i]];
}
return _bc;
},toQueryString:function(){
return Hash.toQueryString(this);
},inspect:function(){
return "#<Hash:{"+this.map(function(_c0){
return _c0.map(Object.inspect).join(": ");
}).join(", ")+"}>";
}});
function $H(_c1){
if(_c1&&_c1.constructor==Hash){
return _c1;
}
return new Hash(_c1);
}
ObjectRange=Class.create();
Object.extend(ObjectRange.prototype,Enumerable);
Object.extend(ObjectRange.prototype,{initialize:function(_c2,end,_c4){
this.start=_c2;
this.end=end;
this.exclusive=_c4;
},_each:function(_c5){
var _c6=this.start;
while(this.include(_c6)){
_c5(_c6);
_c6=_c6.succ();
}
},include:function(_c7){
if(_c7<this.start){
return false;
}
if(this.exclusive){
return _c7<this.end;
}
return _c7<=this.end;
}});
var $R=function(_c8,end,_ca){
return new ObjectRange(_c8,end,_ca);
};
var Ajax={getTransport:function(){
return Try.these(function(){
return new XMLHttpRequest();
},function(){
return new ActiveXObject("Msxml2.XMLHTTP");
},function(){
return new ActiveXObject("Microsoft.XMLHTTP");
})||false;
},activeRequestCount:0};
Ajax.Responders={responders:[],_each:function(_cb){
this.responders._each(_cb);
},register:function(_cc){
if(!this.include(_cc)){
this.responders.push(_cc);
}
},unregister:function(_cd){
this.responders=this.responders.without(_cd);
},dispatch:function(_ce,_cf,_d0,_d1){
this.each(function(_d2){
if(typeof _d2[_ce]=="function"){
try{
_d2[_ce].apply(_d2,[_cf,_d0,_d1]);
}
catch(e){
}
}
});
}};
Object.extend(Ajax.Responders,Enumerable);
Ajax.Responders.register({onCreate:function(){
Ajax.activeRequestCount++;
},onComplete:function(){
Ajax.activeRequestCount--;
}});
Ajax.Base=function(){
};
Ajax.Base.prototype={setOptions:function(_d3){
this.options={method:"post",asynchronous:true,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:""};
Object.extend(this.options,_d3||{});
this.options.method=this.options.method.toLowerCase();
if(typeof this.options.parameters=="string"){
this.options.parameters=this.options.parameters.toQueryParams();
}
}};
Ajax.Request=Class.create();
Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Ajax.Request.prototype=Object.extend(new Ajax.Base(),{_complete:false,initialize:function(url,_d5){
this.transport=Ajax.getTransport();
this.setOptions(_d5);
this.request(url);
},request:function(url){
this.url=url;
this.method=this.options.method;
var _d7=this.options.parameters;
if(!["get","post"].include(this.method)){
_d7["_method"]=this.method;
this.method="post";
}
_d7=Hash.toQueryString(_d7);
if(_d7&&/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
_d7+="&_=";
}
if(this.method=="get"&&_d7){
this.url+=(this.url.indexOf("?")>-1?"&":"?")+_d7;
}
try{
Ajax.Responders.dispatch("onCreate",this,this.transport);
this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);
if(this.options.asynchronous){
setTimeout(function(){
this.respondToReadyState(1);
}.bind(this),10);
}
this.transport.onreadystatechange=this.onStateChange.bind(this);
this.setRequestHeaders();
var _d8=this.method=="post"?(this.options.postBody||_d7):null;
this.transport.send(_d8);
if(!this.options.asynchronous&&this.transport.overrideMimeType){
this.onStateChange();
}
}
catch(e){
this.dispatchException(e);
}
},onStateChange:function(){
var _d9=this.transport.readyState;
if(_d9>1&&!((_d9==4)&&this._complete)){
this.respondToReadyState(this.transport.readyState);
}
},setRequestHeaders:function(){
var _da={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,"Accept":"text/javascript, text/html, application/xml, text/xml, */*"};
if(this.method=="post"){
_da["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){
_da["Connection"]="close";
}
}
if(typeof this.options.requestHeaders=="object"){
var _db=this.options.requestHeaders;
if(typeof _db.push=="function"){
for(var i=0,_dd=_db.length;i<_dd;i+=2){
_da[_db[i]]=_db[i+1];
}
}else{
$H(_db).each(function(_de){
_da[_de.key]=_de.value;
});
}
}
for(var _df in _da){
this.transport.setRequestHeader(_df,_da[_df]);
}
},success:function(){
return !this.transport.status||(this.transport.status>=200&&this.transport.status<300);
},respondToReadyState:function(_e0){
var _e1=Ajax.Request.Events[_e0];
var _e2=this.transport,_e3=this.evalJSON();
if(_e1=="Complete"){
try{
this._complete=true;
(this.options["on"+this.transport.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(_e2,_e3);
}
catch(e){
this.dispatchException(e);
}
if((this.getHeader("Content-type")||"text/javascript").strip().match(/^(text|application)\/(x-)?(java|ecma)script(;.*)?$/i)){
this.evalResponse();
}
}
try{
(this.options["on"+_e1]||Prototype.emptyFunction)(_e2,_e3);
Ajax.Responders.dispatch("on"+_e1,this,_e2,_e3);
}
catch(e){
this.dispatchException(e);
}
if(_e1=="Complete"){
this.transport.onreadystatechange=Prototype.emptyFunction;
}
},getHeader:function(_e4){
try{
return this.transport.getResponseHeader(_e4);
}
catch(e){
return null;
}
},evalJSON:function(){
try{
var _e5=this.getHeader("X-JSON");
return _e5?eval("("+_e5+")"):null;
}
catch(e){
return null;
}
},evalResponse:function(){
try{
return eval(this.transport.responseText);
}
catch(e){
this.dispatchException(e);
}
},dispatchException:function(_e6){
(this.options.onException||Prototype.emptyFunction)(this,_e6);
Ajax.Responders.dispatch("onException",this,_e6);
}});
Ajax.Updater=Class.create();
Object.extend(Object.extend(Ajax.Updater.prototype,Ajax.Request.prototype),{initialize:function(_e7,url,_e9){
this.container={success:(_e7.success||_e7),failure:(_e7.failure||(_e7.success?null:_e7))};
this.transport=Ajax.getTransport();
this.setOptions(_e9);
var _ea=this.options.onComplete||Prototype.emptyFunction;
this.options.onComplete=(function(_eb,_ec){
this.updateContent();
_ea(_eb,_ec);
}).bind(this);
this.request(url);
},updateContent:function(){
var _ed=this.container[this.success()?"success":"failure"];
var _ee=this.transport.responseText;
if(!this.options.evalScripts){
_ee=_ee.stripScripts();
}
if(_ed=$(_ed)){
if(this.options.insertion){
new this.options.insertion(_ed,_ee);
}else{
_ed.update(_ee);
}
}
if(this.success()){
if(this.onComplete){
setTimeout(this.onComplete.bind(this),10);
}
}
}});
Ajax.PeriodicalUpdater=Class.create();
Ajax.PeriodicalUpdater.prototype=Object.extend(new Ajax.Base(),{initialize:function(_ef,url,_f1){
this.setOptions(_f1);
this.onComplete=this.options.onComplete;
this.frequency=(this.options.frequency||2);
this.decay=(this.options.decay||1);
this.updater={};
this.container=_ef;
this.url=url;
this.start();
},start:function(){
this.options.onComplete=this.updateComplete.bind(this);
this.onTimerEvent();
},stop:function(){
this.updater.options.onComplete=undefined;
clearTimeout(this.timer);
(this.onComplete||Prototype.emptyFunction).apply(this,arguments);
},updateComplete:function(_f2){
if(this.options.decay){
this.decay=(_f2.responseText==this.lastText?this.decay*this.options.decay:1);
this.lastText=_f2.responseText;
}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.decay*this.frequency*1000);
},onTimerEvent:function(){
this.updater=new Ajax.Updater(this.container,this.url,this.options);
}});
function $(_f3){
if(arguments.length>1){
for(var i=0,_f5=[],_f6=arguments.length;i<_f6;i++){
_f5.push($(arguments[i]));
}
return _f5;
}
if(typeof _f3=="string"){
_f3=document.getElementById(_f3);
}
return Element.extend(_f3);
}
if(Prototype.BrowserFeatures.XPath){
document._getElementsByXPath=function(_f7,_f8){
var _f9=[];
var _fa=document.evaluate(_f7,$(_f8)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
for(var i=0,_fc=_fa.snapshotLength;i<_fc;i++){
_f9.push(_fa.snapshotItem(i));
}
return _f9;
};
}
document.getElementsByClassName=function(_fd,_fe){
if(Prototype.BrowserFeatures.XPath){
var q=".//*[contains(concat(' ', @class, ' '), ' "+_fd+" ')]";
return document._getElementsByXPath(q,_fe);
}else{
var _100=($(_fe)||document.body).getElementsByTagName("*");
var _101=[],_102;
for(var i=0,_104=_100.length;i<_104;i++){
_102=_100[i];
if(Element.hasClassName(_102,_fd)){
_101.push(Element.extend(_102));
}
}
return _101;
}
};
if(!window.Element){
var Element=new Object();
}
Element.extend=function(_105){
if(!_105||_nativeExtensions||_105.nodeType==3){
return _105;
}
if(!_105._extended&&_105.tagName&&_105!=window){
var _106=Object.clone(Element.Methods),_107=Element.extend.cache;
if(_105.tagName=="FORM"){
Object.extend(_106,Form.Methods);
}
if(["INPUT","TEXTAREA","SELECT"].include(_105.tagName)){
Object.extend(_106,Form.Element.Methods);
}
Object.extend(_106,Element.Methods.Simulated);
for(var _108 in _106){
var _109=_106[_108];
if(typeof _109=="function"&&!(_108 in _105)){
_105[_108]=_107.findOrStore(_109);
}
}
}
_105._extended=true;
return _105;
};
Element.extend.cache={findOrStore:function(_10a){
return this[_10a]=this[_10a]||function(){
return _10a.apply(null,[this].concat($A(arguments)));
};
}};
Element.Methods={visible:function(_10b){
return $(_10b).style.display!="none";
},toggle:function(_10c){
_10c=$(_10c);
Element[Element.visible(_10c)?"hide":"show"](_10c);
return _10c;
},hide:function(_10d){
$(_10d).style.display="none";
return _10d;
},show:function(_10e){
$(_10e).style.display="";
return _10e;
},remove:function(_10f){
_10f=$(_10f);
_10f.parentNode.removeChild(_10f);
return _10f;
},update:function(_110,html){
html=typeof html=="undefined"?"":html.toString();
$(_110).innerHTML=html.stripScripts();
setTimeout(function(){
html.evalScripts();
},10);
return _110;
},replace:function(_112,html){
_112=$(_112);
html=typeof html=="undefined"?"":html.toString();
if(_112.outerHTML){
_112.outerHTML=html.stripScripts();
}else{
var _114=_112.ownerDocument.createRange();
_114.selectNodeContents(_112);
_112.parentNode.replaceChild(_114.createContextualFragment(html.stripScripts()),_112);
}
setTimeout(function(){
html.evalScripts();
},10);
return _112;
},inspect:function(_115){
_115=$(_115);
var _116="<"+_115.tagName.toLowerCase();
$H({"id":"id","className":"class"}).each(function(pair){
var _118=pair.first(),_119=pair.last();
var _11a=(_115[_118]||"").toString();
if(_11a){
_116+=" "+_119+"="+_11a.inspect(true);
}
});
return _116+">";
},recursivelyCollect:function(_11b,_11c){
_11b=$(_11b);
var _11d=[];
while(_11b=_11b[_11c]){
if(_11b.nodeType==1){
_11d.push(Element.extend(_11b));
}
}
return _11d;
},ancestors:function(_11e){
return $(_11e).recursivelyCollect("parentNode");
},descendants:function(_11f){
return $A($(_11f).getElementsByTagName("*"));
},immediateDescendants:function(_120){
if(!(_120=$(_120).firstChild)){
return [];
}
while(_120&&_120.nodeType!=1){
_120=_120.nextSibling;
}
if(_120){
return [_120].concat($(_120).nextSiblings());
}
return [];
},previousSiblings:function(_121){
return $(_121).recursivelyCollect("previousSibling");
},nextSiblings:function(_122){
return $(_122).recursivelyCollect("nextSibling");
},siblings:function(_123){
_123=$(_123);
return _123.previousSiblings().reverse().concat(_123.nextSiblings());
},match:function(_124,_125){
if(typeof _125=="string"){
_125=new Selector(_125);
}
return _125.match($(_124));
},up:function(_126,_127,_128){
return Selector.findElement($(_126).ancestors(),_127,_128);
},down:function(_129,_12a,_12b){
return Selector.findElement($(_129).descendants(),_12a,_12b);
},previous:function(_12c,_12d,_12e){
return Selector.findElement($(_12c).previousSiblings(),_12d,_12e);
},next:function(_12f,_130,_131){
return Selector.findElement($(_12f).nextSiblings(),_130,_131);
},getElementsBySelector:function(){
var args=$A(arguments),_133=$(args.shift());
return Selector.findChildElements(_133,args);
},getElementsByClassName:function(_134,_135){
return document.getElementsByClassName(_135,_134);
},readAttribute:function(_136,name){
_136=$(_136);
if(document.all&&!window.opera){
var t=Element._attributeTranslations;
if(t.values[name]){
return t.values[name](_136,name);
}
if(t.names[name]){
name=t.names[name];
}
var _139=_136.attributes[name];
if(_139){
return _139.nodeValue;
}
}
return _136.getAttribute(name);
},getHeight:function(_13a){
return $(_13a).getDimensions().height;
},getWidth:function(_13b){
return $(_13b).getDimensions().width;
},classNames:function(_13c){
return new Element.ClassNames(_13c);
},hasClassName:function(_13d,_13e){
if(!(_13d=$(_13d))){
return;
}
var _13f=_13d.className;
if(_13f.length==0){
return false;
}
if(_13f==_13e||_13f.match(new RegExp("(^|\\s)"+_13e+"(\\s|$)"))){
return true;
}
return false;
},addClassName:function(_140,_141){
if(!(_140=$(_140))){
return;
}
Element.classNames(_140).add(_141);
return _140;
},removeClassName:function(_142,_143){
if(!(_142=$(_142))){
return;
}
Element.classNames(_142).remove(_143);
return _142;
},toggleClassName:function(_144,_145){
if(!(_144=$(_144))){
return;
}
Element.classNames(_144)[_144.hasClassName(_145)?"remove":"add"](_145);
return _144;
},observe:function(){
Event.observe.apply(Event,arguments);
return $A(arguments).first();
},stopObserving:function(){
Event.stopObserving.apply(Event,arguments);
return $A(arguments).first();
},cleanWhitespace:function(_146){
_146=$(_146);
var node=_146.firstChild;
while(node){
var _148=node.nextSibling;
if(node.nodeType==3&&!/\S/.test(node.nodeValue)){
_146.removeChild(node);
}
node=_148;
}
return _146;
},empty:function(_149){
return $(_149).innerHTML.match(/^\s*$/);
},descendantOf:function(_14a,_14b){
_14a=$(_14a),_14b=$(_14b);
while(_14a=_14a.parentNode){
if(_14a==_14b){
return true;
}
}
return false;
},scrollTo:function(_14c){
_14c=$(_14c);
var pos=Position.cumulativeOffset(_14c);
window.scrollTo(pos[0],pos[1]);
return _14c;
},getStyle:function(_14e,_14f){
_14e=$(_14e);
if(["float","cssFloat"].include(_14f)){
_14f=(typeof _14e.style.styleFloat!="undefined"?"styleFloat":"cssFloat");
}
_14f=_14f.camelize();
var _150=_14e.style[_14f];
if(!_150){
if(document.defaultView&&document.defaultView.getComputedStyle){
var css=document.defaultView.getComputedStyle(_14e,null);
_150=css?css[_14f]:null;
}else{
if(_14e.currentStyle){
_150=_14e.currentStyle[_14f];
}
}
}
if((_150=="auto")&&["width","height"].include(_14f)&&(_14e.getStyle("display")!="none")){
_150=_14e["offset"+_14f.capitalize()]+"px";
}
if(window.opera&&["left","top","right","bottom"].include(_14f)){
if(Element.getStyle(_14e,"position")=="static"){
_150="auto";
}
}
if(_14f=="opacity"){
if(_150){
return parseFloat(_150);
}
if(_150=(_14e.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){
if(_150[1]){
return parseFloat(_150[1])/100;
}
}
return 1;
}
return _150=="auto"?null:_150;
},setStyle:function(_152,_153){
_152=$(_152);
for(var name in _153){
var _155=_153[name];
if(name=="opacity"){
if(_155==1){
_155=(/Gecko/.test(navigator.userAgent)&&!/Konqueror|Safari|KHTML/.test(navigator.userAgent))?0.999999:1;
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"");
}
}else{
if(_155==""){
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"");
}
}else{
if(_155<0.00001){
_155=0;
}
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_152.style.filter=_152.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"")+"alpha(opacity="+_155*100+")";
}
}
}
}else{
if(["float","cssFloat"].include(name)){
name=(typeof _152.style.styleFloat!="undefined")?"styleFloat":"cssFloat";
}
}
_152.style[name.camelize()]=_155;
}
return _152;
},getDimensions:function(_156){
_156=$(_156);
var _157=$(_156).getStyle("display");
if(_157!="none"&&_157!=null){
return {width:_156.offsetWidth,height:_156.offsetHeight};
}
var els=_156.style;
var _159=els.visibility;
var _15a=els.position;
var _15b=els.display;
els.visibility="hidden";
els.position="absolute";
els.display="block";
var _15c=_156.clientWidth;
var _15d=_156.clientHeight;
els.display=_15b;
els.position=_15a;
els.visibility=_159;
return {width:_15c,height:_15d};
},makePositioned:function(_15e){
_15e=$(_15e);
var pos=Element.getStyle(_15e,"position");
if(pos=="static"||!pos){
_15e._madePositioned=true;
_15e.style.position="relative";
if(window.opera){
_15e.style.top=0;
_15e.style.left=0;
}
}
return _15e;
},undoPositioned:function(_160){
_160=$(_160);
if(_160._madePositioned){
_160._madePositioned=undefined;
_160.style.position=_160.style.top=_160.style.left=_160.style.bottom=_160.style.right="";
}
return _160;
},makeClipping:function(_161){
_161=$(_161);
if(_161._overflow){
return _161;
}
_161._overflow=_161.style.overflow||"auto";
if((Element.getStyle(_161,"overflow")||"visible")!="hidden"){
_161.style.overflow="hidden";
}
return _161;
},undoClipping:function(_162){
_162=$(_162);
if(!_162._overflow){
return _162;
}
_162.style.overflow=_162._overflow=="auto"?"":_162._overflow;
_162._overflow=null;
return _162;
}};
Object.extend(Element.Methods,{childOf:Element.Methods.descendantOf});
Element._attributeTranslations={};
Element._attributeTranslations.names={colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",datetime:"dateTime",accesskey:"accessKey",tabindex:"tabIndex",enctype:"encType",maxlength:"maxLength",readonly:"readOnly",longdesc:"longDesc"};
Element._attributeTranslations.values={_getAttr:function(_163,_164){
return _163.getAttribute(_164,2);
},_flag:function(_165,_166){
return $(_165).hasAttribute(_166)?_166:null;
},style:function(_167){
return _167.style.cssText.toLowerCase();
},title:function(_168){
var node=_168.getAttributeNode("title");
return node.specified?node.nodeValue:null;
}};
Object.extend(Element._attributeTranslations.values,{href:Element._attributeTranslations.values._getAttr,src:Element._attributeTranslations.values._getAttr,disabled:Element._attributeTranslations.values._flag,checked:Element._attributeTranslations.values._flag,readonly:Element._attributeTranslations.values._flag,multiple:Element._attributeTranslations.values._flag});
Element.Methods.Simulated={hasAttribute:function(_16a,_16b){
var t=Element._attributeTranslations;
_16b=t.names[_16b]||_16b;
return $(_16a).getAttributeNode(_16b).specified;
}};
if(document.all&&!window.opera){
Element.Methods.update=function(_16d,html){
_16d=$(_16d);
html=typeof html=="undefined"?"":html.toString();
var _16f=_16d.tagName.toUpperCase();
if(["THEAD","TBODY","TR","TD"].include(_16f)){
var div=document.createElement("div");
switch(_16f){
case "THEAD":
case "TBODY":
div.innerHTML="<table><tbody>"+html.stripScripts()+"</tbody></table>";
depth=2;
break;
case "TR":
div.innerHTML="<table><tbody><tr>"+html.stripScripts()+"</tr></tbody></table>";
depth=3;
break;
case "TD":
div.innerHTML="<table><tbody><tr><td>"+html.stripScripts()+"</td></tr></tbody></table>";
depth=4;
}
$A(_16d.childNodes).each(function(node){
_16d.removeChild(node);
});
depth.times(function(){
div=div.firstChild;
});
$A(div.childNodes).each(function(node){
_16d.appendChild(node);
});
}else{
_16d.innerHTML=html.stripScripts();
}
setTimeout(function(){
html.evalScripts();
},10);
return _16d;
};
}
Object.extend(Element,Element.Methods);
var _nativeExtensions=false;
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
["","Form","Input","TextArea","Select"].each(function(tag){
var _174="HTML"+tag+"Element";
if(window[_174]){
return;
}
var _175=window[_174]={};
_175.prototype=document.createElement(tag?tag.toLowerCase():"div").__proto__;
});
}
Element.addMethods=function(_176){
Object.extend(Element.Methods,_176||{});
function copy(_177,_178,_179){
_179=_179||false;
var _17a=Element.extend.cache;
for(var _17b in _177){
var _17c=_177[_17b];
if(!_179||!(_17b in _178)){
_178[_17b]=_17a.findOrStore(_17c);
}
}
}
if(typeof HTMLElement!="undefined"){
copy(Element.Methods,HTMLElement.prototype);
copy(Element.Methods.Simulated,HTMLElement.prototype,true);
copy(Form.Methods,HTMLFormElement.prototype);
[HTMLInputElement,HTMLTextAreaElement,HTMLSelectElement].each(function(_17d){
copy(Form.Element.Methods,_17d.prototype);
});
_nativeExtensions=true;
}
};
var Toggle=new Object();
Toggle.display=Element.toggle;
Abstract.Insertion=function(_17e){
this.adjacency=_17e;
};
Abstract.Insertion.prototype={initialize:function(_17f,_180){
this.element=$(_17f);
this.content=_180.stripScripts();
if(this.adjacency&&this.element.insertAdjacentHTML){
try{
this.element.insertAdjacentHTML(this.adjacency,this.content);
}
catch(e){
var _181=this.element.tagName.toUpperCase();
if(["TBODY","TR"].include(_181)){
this.insertContent(this.contentFromAnonymousTable());
}else{
throw e;
}
}
}else{
this.range=this.element.ownerDocument.createRange();
if(this.initializeRange){
this.initializeRange();
}
this.insertContent([this.range.createContextualFragment(this.content)]);
}
setTimeout(function(){
_180.evalScripts();
},10);
},contentFromAnonymousTable:function(){
var div=document.createElement("div");
div.innerHTML="<table><tbody>"+this.content+"</tbody></table>";
return $A(div.childNodes[0].childNodes[0].childNodes);
}};
var Insertion=new Object();
Insertion.Before=Class.create();
Insertion.Before.prototype=Object.extend(new Abstract.Insertion("beforeBegin"),{initializeRange:function(){
this.range.setStartBefore(this.element);
},insertContent:function(_183){
_183.each((function(_184){
this.element.parentNode.insertBefore(_184,this.element);
}).bind(this));
}});
Insertion.Top=Class.create();
Insertion.Top.prototype=Object.extend(new Abstract.Insertion("afterBegin"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(true);
},insertContent:function(_185){
_185.reverse(false).each((function(_186){
this.element.insertBefore(_186,this.element.firstChild);
}).bind(this));
}});
Insertion.Bottom=Class.create();
Insertion.Bottom.prototype=Object.extend(new Abstract.Insertion("beforeEnd"),{initializeRange:function(){
this.range.selectNodeContents(this.element);
this.range.collapse(this.element);
},insertContent:function(_187){
_187.each((function(_188){
this.element.appendChild(_188);
}).bind(this));
}});
Insertion.After=Class.create();
Insertion.After.prototype=Object.extend(new Abstract.Insertion("afterEnd"),{initializeRange:function(){
this.range.setStartAfter(this.element);
},insertContent:function(_189){
_189.each((function(_18a){
this.element.parentNode.insertBefore(_18a,this.element.nextSibling);
}).bind(this));
}});
Element.ClassNames=Class.create();
Element.ClassNames.prototype={initialize:function(_18b){
this.element=$(_18b);
},_each:function(_18c){
this.element.className.split(/\s+/).select(function(name){
return name.length>0;
})._each(_18c);
},set:function(_18e){
this.element.className=_18e;
},add:function(_18f){
if(this.include(_18f)){
return;
}
this.set($A(this).concat(_18f).join(" "));
},remove:function(_190){
if(!this.include(_190)){
return;
}
this.set($A(this).without(_190).join(" "));
},toString:function(){
return $A(this).join(" ");
}};
Object.extend(Element.ClassNames.prototype,Enumerable);
var Selector=Class.create();
Selector.prototype={initialize:function(_191){
this.params={classNames:[]};
this.expression=_191.toString().strip();
this.parseExpression();
this.compileMatcher();
},parseExpression:function(){
function abort(_192){
throw "Parse error in selector: "+_192;
}
if(this.expression==""){
abort("empty expression");
}
var _193=this.params,expr=this.expression,_195,_196,_197,rest;
while(_195=expr.match(/^(.*)\[([a-z0-9_:-]+?)(?:([~\|!]?=)(?:"([^"]*)"|([^\]\s]*)))?\]$/i)){
_193.attributes=_193.attributes||[];
_193.attributes.push({name:_195[2],operator:_195[3],value:_195[4]||_195[5]||""});
expr=_195[1];
}
if(expr=="*"){
return this.params.wildcard=true;
}
while(_195=expr.match(/^([^a-z0-9_-])?([a-z0-9_-]+)(.*)/i)){
_196=_195[1],_197=_195[2],rest=_195[3];
switch(_196){
case "#":
_193.id=_197;
break;
case ".":
_193.classNames.push(_197);
break;
case "":
case undefined:
_193.tagName=_197.toUpperCase();
break;
default:
abort(expr.inspect());
}
expr=rest;
}
if(expr.length>0){
abort(expr.inspect());
}
},buildMatchExpression:function(){
var _199=this.params,_19a=[],_19b;
if(_199.wildcard){
_19a.push("true");
}
if(_19b=_199.id){
_19a.push("element.readAttribute(\"id\") == "+_19b.inspect());
}
if(_19b=_199.tagName){
_19a.push("element.tagName.toUpperCase() == "+_19b.inspect());
}
if((_19b=_199.classNames).length>0){
for(var i=0,_19d=_19b.length;i<_19d;i++){
_19a.push("element.hasClassName("+_19b[i].inspect()+")");
}
}
if(_19b=_199.attributes){
_19b.each(function(_19e){
var _19f="element.readAttribute("+_19e.name.inspect()+")";
var _1a0=function(_1a1){
return _19f+" && "+_19f+".split("+_1a1.inspect()+")";
};
switch(_19e.operator){
case "=":
_19a.push(_19f+" == "+_19e.value.inspect());
break;
case "~=":
_19a.push(_1a0(" ")+".include("+_19e.value.inspect()+")");
break;
case "|=":
_19a.push(_1a0("-")+".first().toUpperCase() == "+_19e.value.toUpperCase().inspect());
break;
case "!=":
_19a.push(_19f+" != "+_19e.value.inspect());
break;
case "":
case undefined:
_19a.push("element.hasAttribute("+_19e.name.inspect()+")");
break;
default:
throw "Unknown operator "+_19e.operator+" in selector";
}
});
}
return _19a.join(" && ");
},compileMatcher:function(){
this.match=new Function("element","if (!element.tagName) return false;       element = $(element);       return "+this.buildMatchExpression());
},findElements:function(_1a2){
var _1a3;
if(_1a3=$(this.params.id)){
if(this.match(_1a3)){
if(!_1a2||Element.childOf(_1a3,_1a2)){
return [_1a3];
}
}
}
_1a2=(_1a2||document).getElementsByTagName(this.params.tagName||"*");
var _1a4=[];
for(var i=0,_1a6=_1a2.length;i<_1a6;i++){
if(this.match(_1a3=_1a2[i])){
_1a4.push(Element.extend(_1a3));
}
}
return _1a4;
},toString:function(){
return this.expression;
}};
Object.extend(Selector,{matchElements:function(_1a7,_1a8){
var _1a9=new Selector(_1a8);
return _1a7.select(_1a9.match.bind(_1a9)).map(Element.extend);
},findElement:function(_1aa,_1ab,_1ac){
if(typeof _1ab=="number"){
_1ac=_1ab,_1ab=false;
}
return Selector.matchElements(_1aa,_1ab||"*")[_1ac||0];
},findChildElements:function(_1ad,_1ae){
return _1ae.map(function(_1af){
return _1af.match(/[^\s"]+(?:"[^"]*"[^\s"]+)*/g).inject([null],function(_1b0,expr){
var _1b2=new Selector(expr);
return _1b0.inject([],function(_1b3,_1b4){
return _1b3.concat(_1b2.findElements(_1b4||_1ad));
});
});
}).flatten();
}});
function $$(){
return Selector.findChildElements(document,$A(arguments));
}
var Form={reset:function(form){
$(form).reset();
return form;
},serializeElements:function(_1b6,_1b7){
var data=_1b6.inject({},function(_1b9,_1ba){
if(!_1ba.disabled&&_1ba.name){
var key=_1ba.name,_1bc=$(_1ba).getValue();
if(_1bc!=undefined){
if(_1b9[key]){
if(_1b9[key].constructor!=Array){
_1b9[key]=[_1b9[key]];
}
_1b9[key].push(_1bc);
}else{
_1b9[key]=_1bc;
}
}
}
return _1b9;
});
return _1b7?data:Hash.toQueryString(data);
}};
Form.Methods={serialize:function(form,_1be){
return Form.serializeElements(Form.getElements(form),_1be);
},getElements:function(form){
return $A($(form).getElementsByTagName("*")).inject([],function(_1c0,_1c1){
if(Form.Element.Serializers[_1c1.tagName.toLowerCase()]){
_1c0.push(Element.extend(_1c1));
}
return _1c0;
});
},getInputs:function(form,_1c3,name){
form=$(form);
var _1c5=form.getElementsByTagName("input");
if(!_1c3&&!name){
return $A(_1c5).map(Element.extend);
}
for(var i=0,_1c7=[],_1c8=_1c5.length;i<_1c8;i++){
var _1c9=_1c5[i];
if((_1c3&&_1c9.type!=_1c3)||(name&&_1c9.name!=name)){
continue;
}
_1c7.push(Element.extend(_1c9));
}
return _1c7;
},disable:function(form){
form=$(form);
form.getElements().each(function(_1cb){
_1cb.blur();
_1cb.disabled="true";
});
return form;
},enable:function(form){
form=$(form);
form.getElements().each(function(_1cd){
_1cd.disabled="";
});
return form;
},findFirstElement:function(form){
return $(form).getElements().find(function(_1cf){
return _1cf.type!="hidden"&&!_1cf.disabled&&["input","select","textarea"].include(_1cf.tagName.toLowerCase());
});
},focusFirstElement:function(form){
form=$(form);
form.findFirstElement().activate();
return form;
}};
Object.extend(Form,Form.Methods);
Form.Element={focus:function(_1d1){
$(_1d1).focus();
return _1d1;
},select:function(_1d2){
$(_1d2).select();
return _1d2;
}};
Form.Element.Methods={serialize:function(_1d3){
_1d3=$(_1d3);
if(!_1d3.disabled&&_1d3.name){
var _1d4=_1d3.getValue();
if(_1d4!=undefined){
var pair={};
pair[_1d3.name]=_1d4;
return Hash.toQueryString(pair);
}
}
return "";
},getValue:function(_1d6){
_1d6=$(_1d6);
var _1d7=_1d6.tagName.toLowerCase();
return Form.Element.Serializers[_1d7](_1d6);
},clear:function(_1d8){
$(_1d8).value="";
return _1d8;
},present:function(_1d9){
return $(_1d9).value!="";
},activate:function(_1da){
_1da=$(_1da);
_1da.focus();
if(_1da.select&&(_1da.tagName.toLowerCase()!="input"||!["button","reset","submit"].include(_1da.type))){
_1da.select();
}
return _1da;
},disable:function(_1db){
_1db=$(_1db);
_1db.disabled=true;
return _1db;
},enable:function(_1dc){
_1dc=$(_1dc);
_1dc.blur();
_1dc.disabled=false;
return _1dc;
}};
Object.extend(Form.Element,Form.Element.Methods);
var Field=Form.Element;
var $F=Form.Element.getValue;
Form.Element.Serializers={input:function(_1dd){
switch(_1dd.type.toLowerCase()){
case "checkbox":
case "radio":
return Form.Element.Serializers.inputSelector(_1dd);
default:
return Form.Element.Serializers.textarea(_1dd);
}
},inputSelector:function(_1de){
return _1de.checked?_1de.value:null;
},textarea:function(_1df){
return _1df.value;
},select:function(_1e0){
return this[_1e0.type=="select-one"?"selectOne":"selectMany"](_1e0);
},selectOne:function(_1e1){
var _1e2=_1e1.selectedIndex;
return _1e2>=0?this.optionValue(_1e1.options[_1e2]):null;
},selectMany:function(_1e3){
var _1e4,_1e5=_1e3.length;
if(!_1e5){
return null;
}
for(var i=0,_1e4=[];i<_1e5;i++){
var opt=_1e3.options[i];
if(opt.selected){
_1e4.push(this.optionValue(opt));
}
}
return _1e4;
},optionValue:function(opt){
return Element.extend(opt).hasAttribute("value")?opt.value:opt.text;
}};
Abstract.TimedObserver=function(){
};
Abstract.TimedObserver.prototype={initialize:function(_1e9,_1ea,_1eb){
this.frequency=_1ea;
this.element=$(_1e9);
this.callback=_1eb;
this.lastValue=this.getValue();
this.registerCallback();
},registerCallback:function(){
setInterval(this.onTimerEvent.bind(this),this.frequency*1000);
},onTimerEvent:function(){
var _1ec=this.getValue();
var _1ed=("string"==typeof this.lastValue&&"string"==typeof _1ec?this.lastValue!=_1ec:String(this.lastValue)!=String(_1ec));
if(_1ed){
this.callback(this.element,_1ec);
this.lastValue=_1ec;
}
}};
Form.Element.Observer=Class.create();
Form.Element.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.Observer=Class.create();
Form.Observer.prototype=Object.extend(new Abstract.TimedObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
Abstract.EventObserver=function(){
};
Abstract.EventObserver.prototype={initialize:function(_1ee,_1ef){
this.element=$(_1ee);
this.callback=_1ef;
this.lastValue=this.getValue();
if(this.element.tagName.toLowerCase()=="form"){
this.registerFormCallbacks();
}else{
this.registerCallback(this.element);
}
},onElementEvent:function(){
var _1f0=this.getValue();
if(this.lastValue!=_1f0){
this.callback(this.element,_1f0);
this.lastValue=_1f0;
}
},registerFormCallbacks:function(){
Form.getElements(this.element).each(this.registerCallback.bind(this));
},registerCallback:function(_1f1){
if(_1f1.type){
switch(_1f1.type.toLowerCase()){
case "checkbox":
case "radio":
Event.observe(_1f1,"click",this.onElementEvent.bind(this));
break;
default:
Event.observe(_1f1,"change",this.onElementEvent.bind(this));
break;
}
}
}};
Form.Element.EventObserver=Class.create();
Form.Element.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.Element.getValue(this.element);
}});
Form.EventObserver=Class.create();
Form.EventObserver.prototype=Object.extend(new Abstract.EventObserver(),{getValue:function(){
return Form.serialize(this.element);
}});
if(!window.Event){
var Event=new Object();
}
Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,element:function(_1f2){
return _1f2.target||_1f2.srcElement;
},isLeftClick:function(_1f3){
return (((_1f3.which)&&(_1f3.which==1))||((_1f3.button)&&(_1f3.button==1)));
},pointerX:function(_1f4){
return _1f4.pageX||(_1f4.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
},pointerY:function(_1f5){
return _1f5.pageY||(_1f5.clientY+(document.documentElement.scrollTop||document.body.scrollTop));
},stop:function(_1f6){
if(_1f6.preventDefault){
_1f6.preventDefault();
_1f6.stopPropagation();
}else{
_1f6.returnValue=false;
_1f6.cancelBubble=true;
}
},findElement:function(_1f7,_1f8){
var _1f9=Event.element(_1f7);
while(_1f9.parentNode&&(!_1f9.tagName||(_1f9.tagName.toUpperCase()!=_1f8.toUpperCase()))){
_1f9=_1f9.parentNode;
}
return _1f9;
},observers:false,_observeAndCache:function(_1fa,name,_1fc,_1fd){
if(!this.observers){
this.observers=[];
}
if(_1fa.addEventListener){
this.observers.push([_1fa,name,_1fc,_1fd]);
_1fa.addEventListener(name,_1fc,_1fd);
}else{
if(_1fa.attachEvent){
this.observers.push([_1fa,name,_1fc,_1fd]);
_1fa.attachEvent("on"+name,_1fc);
}
}
},unloadCache:function(){
if(!Event.observers){
return;
}
for(var i=0,_1ff=Event.observers.length;i<_1ff;i++){
Event.stopObserving.apply(this,Event.observers[i]);
Event.observers[i][0]=null;
}
Event.observers=false;
},observe:function(_200,name,_202,_203){
_200=$(_200);
_203=_203||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_200.attachEvent)){
name="keydown";
}
Event._observeAndCache(_200,name,_202,_203);
},stopObserving:function(_204,name,_206,_207){
_204=$(_204);
_207=_207||false;
if(name=="keypress"&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||_204.detachEvent)){
name="keydown";
}
if(_204.removeEventListener){
_204.removeEventListener(name,_206,_207);
}else{
if(_204.detachEvent){
try{
_204.detachEvent("on"+name,_206);
}
catch(e){
}
}
}
}});
if(navigator.appVersion.match(/\bMSIE\b/)){
Event.observe(window,"unload",Event.unloadCache,false);
}
var Position={includeScrollOffsets:false,prepare:function(){
this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
},realOffset:function(_208){
var _209=0,_20a=0;
do{
_209+=_208.scrollTop||0;
_20a+=_208.scrollLeft||0;
_208=_208.parentNode;
}while(_208);
return [_20a,_209];
},cumulativeOffset:function(_20b){
var _20c=0,_20d=0;
do{
_20c+=_20b.offsetTop||0;
_20d+=_20b.offsetLeft||0;
_20b=_20b.offsetParent;
}while(_20b);
return [_20d,_20c];
},positionedOffset:function(_20e){
var _20f=0,_210=0;
do{
_20f+=_20e.offsetTop||0;
_210+=_20e.offsetLeft||0;
_20e=_20e.offsetParent;
if(_20e){
if(_20e.tagName=="BODY"){
break;
}
var p=Element.getStyle(_20e,"position");
if(p=="relative"||p=="absolute"){
break;
}
}
}while(_20e);
return [_210,_20f];
},offsetParent:function(_212){
if(_212.offsetParent){
return _212.offsetParent;
}
if(_212==document.body){
return _212;
}
while((_212=_212.parentNode)&&_212!=document.body){
if(Element.getStyle(_212,"position")!="static"){
return _212;
}
}
return document.body;
},within:function(_213,x,y){
if(this.includeScrollOffsets){
return this.withinIncludingScrolloffsets(_213,x,y);
}
this.xcomp=x;
this.ycomp=y;
this.offset=this.cumulativeOffset(_213);
return (y>=this.offset[1]&&y<this.offset[1]+_213.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+_213.offsetWidth);
},withinIncludingScrolloffsets:function(_216,x,y){
var _219=this.realOffset(_216);
this.xcomp=x+_219[0]-this.deltaX;
this.ycomp=y+_219[1]-this.deltaY;
this.offset=this.cumulativeOffset(_216);
return (this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+_216.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+_216.offsetWidth);
},overlap:function(mode,_21b){
if(!mode){
return 0;
}
if(mode=="vertical"){
return ((this.offset[1]+_21b.offsetHeight)-this.ycomp)/_21b.offsetHeight;
}
if(mode=="horizontal"){
return ((this.offset[0]+_21b.offsetWidth)-this.xcomp)/_21b.offsetWidth;
}
},page:function(_21c){
var _21d=0,_21e=0;
var _21f=_21c;
do{
_21d+=_21f.offsetTop||0;
_21e+=_21f.offsetLeft||0;
if(_21f.offsetParent==document.body){
if(Element.getStyle(_21f,"position")=="absolute"){
break;
}
}
}while(_21f=_21f.offsetParent);
_21f=_21c;
do{
if(!window.opera||_21f.tagName=="BODY"){
_21d-=_21f.scrollTop||0;
_21e-=_21f.scrollLeft||0;
}
}while(_21f=_21f.parentNode);
return [_21e,_21d];
},clone:function(_220,_221){
var _222=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});
_220=$(_220);
var p=Position.page(_220);
_221=$(_221);
var _224=[0,0];
var _225=null;
if(Element.getStyle(_221,"position")=="absolute"){
_225=Position.offsetParent(_221);
_224=Position.page(_225);
}
if(_225==document.body){
_224[0]-=document.body.offsetLeft;
_224[1]-=document.body.offsetTop;
}
if(_222.setLeft){
_221.style.left=(p[0]-_224[0]+_222.offsetLeft)+"px";
}
if(_222.setTop){
_221.style.top=(p[1]-_224[1]+_222.offsetTop)+"px";
}
if(_222.setWidth){
_221.style.width=_220.offsetWidth+"px";
}
if(_222.setHeight){
_221.style.height=_220.offsetHeight+"px";
}
},absolutize:function(_226){
_226=$(_226);
if(_226.style.position=="absolute"){
return;
}
Position.prepare();
var _227=Position.positionedOffset(_226);
var top=_227[1];
var left=_227[0];
var _22a=_226.clientWidth;
var _22b=_226.clientHeight;
_226._originalLeft=left-parseFloat(_226.style.left||0);
_226._originalTop=top-parseFloat(_226.style.top||0);
_226._originalWidth=_226.style.width;
_226._originalHeight=_226.style.height;
_226.style.position="absolute";
_226.style.top=top+"px";
_226.style.left=left+"px";
_226.style.width=_22a+"px";
_226.style.height=_22b+"px";
},relativize:function(_22c){
_22c=$(_22c);
if(_22c.style.position=="relative"){
return;
}
Position.prepare();
_22c.style.position="relative";
var top=parseFloat(_22c.style.top||0)-(_22c._originalTop||0);
var left=parseFloat(_22c.style.left||0)-(_22c._originalLeft||0);
_22c.style.top=top+"px";
_22c.style.left=left+"px";
_22c.style.height=_22c._originalHeight;
_22c.style.width=_22c._originalWidth;
}};
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
Position.cumulativeOffset=function(_22f){
var _230=0,_231=0;
do{
_230+=_22f.offsetTop||0;
_231+=_22f.offsetLeft||0;
if(_22f.offsetParent==document.body){
if(Element.getStyle(_22f,"position")=="absolute"){
break;
}
}
_22f=_22f.offsetParent;
}while(_22f);
return [_231,_230];
};
}
Element.addMethods();
String.prototype.parseColor=function(){
var _232="#";
if(this.slice(0,4)=="rgb("){
var cols=this.slice(4,this.length-1).split(",");
var i=0;
do{
_232+=parseInt(cols[i]).toColorPart();
}while(++i<3);
}else{
if(this.slice(0,1)=="#"){
if(this.length==4){
for(var i=1;i<4;i++){
_232+=(this.charAt(i)+this.charAt(i)).toLowerCase();
}
}
if(this.length==7){
_232=this.toLowerCase();
}
}
}
return (_232.length==7?_232:(arguments[0]||this));
};
Element.collectTextNodes=function(_235){
return $A($(_235).childNodes).collect(function(node){
return (node.nodeType==3?node.nodeValue:(node.hasChildNodes()?Element.collectTextNodes(node):""));
}).flatten().join("");
};
Element.collectTextNodesIgnoreClass=function(_237,_238){
return $A($(_237).childNodes).collect(function(node){
return (node.nodeType==3?node.nodeValue:((node.hasChildNodes()&&!Element.hasClassName(node,_238))?Element.collectTextNodesIgnoreClass(node,_238):""));
}).flatten().join("");
};
Element.setContentZoom=function(_23a,_23b){
_23a=$(_23a);
_23a.setStyle({fontSize:(_23b/100)+"em"});
if(navigator.appVersion.indexOf("AppleWebKit")>0){
window.scrollBy(0,0);
}
return _23a;
};
Element.getOpacity=function(_23c){
_23c=$(_23c);
var _23d;
if(_23d=_23c.getStyle("opacity")){
return parseFloat(_23d);
}
if(_23d=(_23c.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){
if(_23d[1]){
return parseFloat(_23d[1])/100;
}
}
return 1;
};
Element.setOpacity=function(_23e,_23f){
_23e=$(_23e);
if(_23f==1){
_23e.setStyle({opacity:(/Gecko/.test(navigator.userAgent)&&!/Konqueror|Safari|KHTML/.test(navigator.userAgent))?0.999999:1});
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_23e.setStyle({filter:Element.getStyle(_23e,"filter").replace(/alpha\([^\)]*\)/gi,"")});
}
}else{
if(_23f<0.00001){
_23f=0;
}
_23e.setStyle({opacity:_23f});
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_23e.setStyle({filter:_23e.getStyle("filter").replace(/alpha\([^\)]*\)/gi,"")+"alpha(opacity="+_23f*100+")"});
}
}
return _23e;
};
Element.getInlineOpacity=function(_240){
return $(_240).style.opacity||"";
};
Element.forceRerendering=function(_241){
try{
_241=$(_241);
var n=document.createTextNode(" ");
_241.appendChild(n);
_241.removeChild(n);
}
catch(e){
}
};
Array.prototype.call=function(){
var args=arguments;
this.each(function(f){
f.apply(this,args);
});
};
var Effect={_elementDoesNotExistError:{name:"ElementDoesNotExistError",message:"The specified DOM element does not exist, but is required for this effect to operate"},tagifyText:function(_245){
if(typeof Builder=="undefined"){
throw ("Effect.tagifyText requires including script.aculo.us' builder.js library");
}
var _246="position:relative";
if(/MSIE/.test(navigator.userAgent)&&!window.opera){
_246+=";zoom:1";
}
_245=$(_245);
$A(_245.childNodes).each(function(_247){
if(_247.nodeType==3){
_247.nodeValue.toArray().each(function(_248){
_245.insertBefore(Builder.node("span",{style:_246},_248==" "?String.fromCharCode(160):_248),_247);
});
Element.remove(_247);
}
});
},multiple:function(_249,_24a){
var _24b;
if(((typeof _249=="object")||(typeof _249=="function"))&&(_249.length)){
_24b=_249;
}else{
_24b=$(_249).childNodes;
}
var _24c=Object.extend({speed:0.1,delay:0},arguments[2]||{});
var _24d=_24c.delay;
$A(_24b).each(function(_24e,_24f){
new _24a(_24e,Object.extend(_24c,{delay:_24f*_24c.speed+_24d}));
});
},PAIRS:{"slide":["SlideDown","SlideUp"],"blind":["BlindDown","BlindUp"],"appear":["Appear","Fade"]},toggle:function(_250,_251){
_250=$(_250);
_251=(_251||"appear").toLowerCase();
var _252=Object.extend({queue:{position:"end",scope:(_250.id||"global"),limit:1}},arguments[2]||{});
Effect[_250.visible()?Effect.PAIRS[_251][1]:Effect.PAIRS[_251][0]](_250,_252);
}};
var Effect2=Effect;
Effect.Transitions={linear:Prototype.K,sinoidal:function(pos){
return (-Math.cos(pos*Math.PI)/2)+0.5;
},reverse:function(pos){
return 1-pos;
},flicker:function(pos){
return ((-Math.cos(pos*Math.PI)/4)+0.75)+Math.random()/4;
},wobble:function(pos){
return (-Math.cos(pos*Math.PI*(9*pos))/2)+0.5;
},pulse:function(pos,_258){
_258=_258||5;
return (Math.round((pos%(1/_258))*_258)==0?((pos*_258*2)-Math.floor(pos*_258*2)):1-((pos*_258*2)-Math.floor(pos*_258*2)));
},none:function(pos){
return 0;
},full:function(pos){
return 1;
}};
Effect.ScopedQueue=Class.create();
Object.extend(Object.extend(Effect.ScopedQueue.prototype,Enumerable),{initialize:function(){
this.effects=[];
this.interval=null;
},_each:function(_25b){
this.effects._each(_25b);
},add:function(_25c){
var _25d=new Date().getTime();
var _25e=(typeof _25c.options.queue=="string")?_25c.options.queue:_25c.options.queue.position;
switch(_25e){
case "front":
this.effects.findAll(function(e){
return e.state=="idle";
}).each(function(e){
e.startOn+=_25c.finishOn;
e.finishOn+=_25c.finishOn;
});
break;
case "with-last":
_25d=this.effects.pluck("startOn").max()||_25d;
break;
case "end":
_25d=this.effects.pluck("finishOn").max()||_25d;
break;
}
_25c.startOn+=_25d;
_25c.finishOn+=_25d;
if(!_25c.options.queue.limit||(this.effects.length<_25c.options.queue.limit)){
this.effects.push(_25c);
}
if(!this.interval){
this.interval=setInterval(this.loop.bind(this),40);
}
},remove:function(_261){
this.effects=this.effects.reject(function(e){
return e==_261;
});
if(this.effects.length==0){
clearInterval(this.interval);
this.interval=null;
}
},loop:function(){
var _263=new Date().getTime();
this.effects.invoke("loop",_263);
}});
Effect.Queues={instances:$H(),get:function(_264){
if(typeof _264!="string"){
return _264;
}
if(!this.instances[_264]){
this.instances[_264]=new Effect.ScopedQueue();
}
return this.instances[_264];
}};
Effect.Queue=Effect.Queues.get("global");
Effect.DefaultOptions={transition:Effect.Transitions.sinoidal,duration:1,fps:25,sync:false,from:0,to:1,delay:0,queue:"parallel"};
Effect.Base=function(){
};
Effect.Base.prototype={position:null,start:function(_265){
this.options=Object.extend(Object.extend({},Effect.DefaultOptions),_265||{});
this.currentFrame=0;
this.state="idle";
this.startOn=this.options.delay*1000;
this.finishOn=this.startOn+(this.options.duration*1000);
this.event("beforeStart");
if(!this.options.sync){
Effect.Queues.get(typeof this.options.queue=="string"?"global":this.options.queue.scope).add(this);
}
},loop:function(_266){
if(_266>=this.startOn){
if(_266>=this.finishOn){
this.render(1);
this.cancel();
this.event("beforeFinish");
if(this.finish){
this.finish();
}
this.event("afterFinish");
return;
}
var pos=(_266-this.startOn)/(this.finishOn-this.startOn);
var _268=Math.round(pos*this.options.fps*this.options.duration);
if(_268>this.currentFrame){
this.render(pos);
this.currentFrame=_268;
}
}
},render:function(pos){
if(this.state=="idle"){
this.state="running";
this.event("beforeSetup");
if(this.setup){
this.setup();
}
this.event("afterSetup");
}
if(this.state=="running"){
if(this.options.transition){
pos=this.options.transition(pos);
}
pos*=(this.options.to-this.options.from);
pos+=this.options.from;
this.position=pos;
this.event("beforeUpdate");
if(this.update){
this.update(pos);
}
this.event("afterUpdate");
}
},cancel:function(){
if(!this.options.sync){
Effect.Queues.get(typeof this.options.queue=="string"?"global":this.options.queue.scope).remove(this);
}
this.state="finished";
},event:function(_26a){
if(this.options[_26a+"Internal"]){
this.options[_26a+"Internal"](this);
}
if(this.options[_26a]){
this.options[_26a](this);
}
},inspect:function(){
return "#<Effect:"+$H(this).inspect()+",options:"+$H(this.options).inspect()+">";
}};
Effect.Parallel=Class.create();
Object.extend(Object.extend(Effect.Parallel.prototype,Effect.Base.prototype),{initialize:function(_26b){
this.effects=_26b||[];
this.start(arguments[1]);
},update:function(_26c){
this.effects.invoke("render",_26c);
},finish:function(_26d){
this.effects.each(function(_26e){
_26e.render(1);
_26e.cancel();
_26e.event("beforeFinish");
if(_26e.finish){
_26e.finish(_26d);
}
_26e.event("afterFinish");
});
}});
Effect.Event=Class.create();
Object.extend(Object.extend(Effect.Event.prototype,Effect.Base.prototype),{initialize:function(){
var _26f=Object.extend({duration:0},arguments[0]||{});
this.start(_26f);
},update:Prototype.emptyFunction});
Effect.Opacity=Class.create();
Object.extend(Object.extend(Effect.Opacity.prototype,Effect.Base.prototype),{initialize:function(_270){
this.element=$(_270);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
if(/MSIE/.test(navigator.userAgent)&&!window.opera&&(!this.element.currentStyle.hasLayout)){
this.element.setStyle({zoom:1});
}
var _271=Object.extend({from:this.element.getOpacity()||0,to:1},arguments[1]||{});
this.start(_271);
},update:function(_272){
this.element.setOpacity(_272);
}});
Effect.Move=Class.create();
Object.extend(Object.extend(Effect.Move.prototype,Effect.Base.prototype),{initialize:function(_273){
this.element=$(_273);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _274=Object.extend({x:0,y:0,mode:"relative"},arguments[1]||{});
this.start(_274);
},setup:function(){
this.element.makePositioned();
this.originalLeft=parseFloat(this.element.getStyle("left")||"0");
this.originalTop=parseFloat(this.element.getStyle("top")||"0");
if(this.options.mode=="absolute"){
this.options.x=this.options.x-this.originalLeft;
this.options.y=this.options.y-this.originalTop;
}
},update:function(_275){
this.element.setStyle({left:Math.round(this.options.x*_275+this.originalLeft)+"px",top:Math.round(this.options.y*_275+this.originalTop)+"px"});
}});
Effect.MoveBy=function(_276,_277,_278){
return new Effect.Move(_276,Object.extend({x:_278,y:_277},arguments[3]||{}));
};
Effect.Scale=Class.create();
Object.extend(Object.extend(Effect.Scale.prototype,Effect.Base.prototype),{initialize:function(_279,_27a){
this.element=$(_279);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _27b=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:"box",scaleFrom:100,scaleTo:_27a},arguments[2]||{});
this.start(_27b);
},setup:function(){
this.restoreAfterFinish=this.options.restoreAfterFinish||false;
this.elementPositioning=this.element.getStyle("position");
this.originalStyle={};
["top","left","width","height","fontSize"].each(function(k){
this.originalStyle[k]=this.element.style[k];
}.bind(this));
this.originalTop=this.element.offsetTop;
this.originalLeft=this.element.offsetLeft;
var _27d=this.element.getStyle("font-size")||"100%";
["em","px","%","pt"].each(function(_27e){
if(_27d.indexOf(_27e)>0){
this.fontSize=parseFloat(_27d);
this.fontSizeType=_27e;
}
}.bind(this));
this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;
this.dims=null;
if(this.options.scaleMode=="box"){
this.dims=[this.element.offsetHeight,this.element.offsetWidth];
}
if(/^content/.test(this.options.scaleMode)){
this.dims=[this.element.scrollHeight,this.element.scrollWidth];
}
if(!this.dims){
this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth];
}
},update:function(_27f){
var _280=(this.options.scaleFrom/100)+(this.factor*_27f);
if(this.options.scaleContent&&this.fontSize){
this.element.setStyle({fontSize:this.fontSize*_280+this.fontSizeType});
}
this.setDimensions(this.dims[0]*_280,this.dims[1]*_280);
},finish:function(_281){
if(this.restoreAfterFinish){
this.element.setStyle(this.originalStyle);
}
},setDimensions:function(_282,_283){
var d={};
if(this.options.scaleX){
d.width=Math.round(_283)+"px";
}
if(this.options.scaleY){
d.height=Math.round(_282)+"px";
}
if(this.options.scaleFromCenter){
var topd=(_282-this.dims[0])/2;
var _286=(_283-this.dims[1])/2;
if(this.elementPositioning=="absolute"){
if(this.options.scaleY){
d.top=this.originalTop-topd+"px";
}
if(this.options.scaleX){
d.left=this.originalLeft-_286+"px";
}
}else{
if(this.options.scaleY){
d.top=-topd+"px";
}
if(this.options.scaleX){
d.left=-_286+"px";
}
}
}
this.element.setStyle(d);
}});
Effect.Highlight=Class.create();
Object.extend(Object.extend(Effect.Highlight.prototype,Effect.Base.prototype),{initialize:function(_287){
this.element=$(_287);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _288=Object.extend({startcolor:"#ffff99"},arguments[1]||{});
this.start(_288);
},setup:function(){
if(this.element.getStyle("display")=="none"){
this.cancel();
return;
}
this.oldStyle={backgroundImage:this.element.getStyle("background-image")};
this.element.setStyle({backgroundImage:"none"});
if(!this.options.endcolor){
this.options.endcolor=this.element.getStyle("background-color").parseColor("#ffffff");
}
if(!this.options.restorecolor){
this.options.restorecolor=this.element.getStyle("background-color");
}
this._base=$R(0,2).map(function(i){
return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16);
}.bind(this));
this._delta=$R(0,2).map(function(i){
return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i];
}.bind(this));
},update:function(_28b){
this.element.setStyle({backgroundColor:$R(0,2).inject("#",function(m,v,i){
return m+(Math.round(this._base[i]+(this._delta[i]*_28b)).toColorPart());
}.bind(this))});
},finish:function(){
this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}));
}});
Effect.ScrollTo=Class.create();
Object.extend(Object.extend(Effect.ScrollTo.prototype,Effect.Base.prototype),{initialize:function(_28f){
this.element=$(_28f);
this.start(arguments[1]||{});
},setup:function(){
Position.prepare();
var _290=Position.cumulativeOffset(this.element);
if(this.options.offset){
_290[1]+=this.options.offset;
}
var max=window.innerHeight?window.height-window.innerHeight:document.body.scrollHeight-(document.documentElement.clientHeight?document.documentElement.clientHeight:document.body.clientHeight);
this.scrollStart=Position.deltaY;
this.delta=(_290[1]>max?max:_290[1])-this.scrollStart;
},update:function(_292){
Position.prepare();
window.scrollTo(Position.deltaX,this.scrollStart+(_292*this.delta));
}});
Effect.Fade=function(_293){
_293=$(_293);
var _294=_293.getInlineOpacity();
var _295=Object.extend({from:_293.getOpacity()||1,to:0,afterFinishInternal:function(_296){
if(_296.options.to!=0){
return;
}
_296.element.hide().setStyle({opacity:_294});
}},arguments[1]||{});
return new Effect.Opacity(_293,_295);
};
Effect.Appear=function(_297){
_297=$(_297);
var _298=Object.extend({from:(_297.getStyle("display")=="none"?0:_297.getOpacity()||0),to:1,afterFinishInternal:function(_299){
_299.element.forceRerendering();
},beforeSetup:function(_29a){
_29a.element.setOpacity(_29a.options.from).show();
}},arguments[1]||{});
return new Effect.Opacity(_297,_298);
};
Effect.Puff=function(_29b){
_29b=$(_29b);
var _29c={opacity:_29b.getInlineOpacity(),position:_29b.getStyle("position"),top:_29b.style.top,left:_29b.style.left,width:_29b.style.width,height:_29b.style.height};
return new Effect.Parallel([new Effect.Scale(_29b,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(_29b,{sync:true,to:0})],Object.extend({duration:1,beforeSetupInternal:function(_29d){
Position.absolutize(_29d.effects[0].element);
},afterFinishInternal:function(_29e){
_29e.effects[0].element.hide().setStyle(_29c);
}},arguments[1]||{}));
};
Effect.BlindUp=function(_29f){
_29f=$(_29f);
_29f.makeClipping();
return new Effect.Scale(_29f,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(_2a0){
_2a0.element.hide().undoClipping();
}},arguments[1]||{}));
};
Effect.BlindDown=function(_2a1){
_2a1=$(_2a1);
var _2a2=_2a1.getDimensions();
return new Effect.Scale(_2a1,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:_2a2.height,originalWidth:_2a2.width},restoreAfterFinish:true,afterSetup:function(_2a3){
_2a3.element.makeClipping().setStyle({height:"0px"}).show();
},afterFinishInternal:function(_2a4){
_2a4.element.undoClipping();
}},arguments[1]||{}));
};
Effect.SwitchOff=function(_2a5){
_2a5=$(_2a5);
var _2a6=_2a5.getInlineOpacity();
return new Effect.Appear(_2a5,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(_2a7){
new Effect.Scale(_2a7.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(_2a8){
_2a8.element.makePositioned().makeClipping();
},afterFinishInternal:function(_2a9){
_2a9.element.hide().undoClipping().undoPositioned().setStyle({opacity:_2a6});
}});
}},arguments[1]||{}));
};
Effect.DropOut=function(_2aa){
_2aa=$(_2aa);
var _2ab={top:_2aa.getStyle("top"),left:_2aa.getStyle("left"),opacity:_2aa.getInlineOpacity()};
return new Effect.Parallel([new Effect.Move(_2aa,{x:0,y:100,sync:true}),new Effect.Opacity(_2aa,{sync:true,to:0})],Object.extend({duration:0.5,beforeSetup:function(_2ac){
_2ac.effects[0].element.makePositioned();
},afterFinishInternal:function(_2ad){
_2ad.effects[0].element.hide().undoPositioned().setStyle(_2ab);
}},arguments[1]||{}));
};
Effect.Shake=function(_2ae){
_2ae=$(_2ae);
var _2af={top:_2ae.getStyle("top"),left:_2ae.getStyle("left")};
return new Effect.Move(_2ae,{x:20,y:0,duration:0.05,afterFinishInternal:function(_2b0){
new Effect.Move(_2b0.element,{x:-40,y:0,duration:0.1,afterFinishInternal:function(_2b1){
new Effect.Move(_2b1.element,{x:40,y:0,duration:0.1,afterFinishInternal:function(_2b2){
new Effect.Move(_2b2.element,{x:-40,y:0,duration:0.1,afterFinishInternal:function(_2b3){
new Effect.Move(_2b3.element,{x:40,y:0,duration:0.1,afterFinishInternal:function(_2b4){
new Effect.Move(_2b4.element,{x:-20,y:0,duration:0.05,afterFinishInternal:function(_2b5){
_2b5.element.undoPositioned().setStyle(_2af);
}});
}});
}});
}});
}});
}});
};
Effect.SlideDown=function(_2b6){
_2b6=$(_2b6).cleanWhitespace();
var _2b7=_2b6.down().getStyle("bottom");
var _2b8=_2b6.getDimensions();
return new Effect.Scale(_2b6,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:_2b8.height,originalWidth:_2b8.width},restoreAfterFinish:true,afterSetup:function(_2b9){
_2b9.element.makePositioned();
_2b9.element.down().makePositioned();
if(window.opera){
_2b9.element.setStyle({top:""});
}
_2b9.element.makeClipping().setStyle({height:"0px"}).show();
},afterUpdateInternal:function(_2ba){
_2ba.element.down().setStyle({bottom:(_2ba.dims[0]-_2ba.element.clientHeight)+"px"});
},afterFinishInternal:function(_2bb){
_2bb.element.undoClipping().undoPositioned();
_2bb.element.down().undoPositioned().setStyle({bottom:_2b7});
}},arguments[1]||{}));
};
Effect.SlideUp=function(_2bc){
_2bc=$(_2bc).cleanWhitespace();
var _2bd=_2bc.down().getStyle("bottom");
return new Effect.Scale(_2bc,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:"box",scaleFrom:100,restoreAfterFinish:true,beforeStartInternal:function(_2be){
_2be.element.makePositioned();
_2be.element.down().makePositioned();
if(window.opera){
_2be.element.setStyle({top:""});
}
_2be.element.makeClipping().show();
},afterUpdateInternal:function(_2bf){
_2bf.element.down().setStyle({bottom:(_2bf.dims[0]-_2bf.element.clientHeight)+"px"});
},afterFinishInternal:function(_2c0){
_2c0.element.hide().undoClipping().undoPositioned().setStyle({bottom:_2bd});
_2c0.element.down().undoPositioned();
}},arguments[1]||{}));
};
Effect.Squish=function(_2c1){
return new Effect.Scale(_2c1,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(_2c2){
_2c2.element.makeClipping();
},afterFinishInternal:function(_2c3){
_2c3.element.hide().undoClipping();
}});
};
Effect.Grow=function(_2c4){
_2c4=$(_2c4);
var _2c5=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});
var _2c6={top:_2c4.style.top,left:_2c4.style.left,height:_2c4.style.height,width:_2c4.style.width,opacity:_2c4.getInlineOpacity()};
var dims=_2c4.getDimensions();
var _2c8,_2c9;
var _2ca,_2cb;
switch(_2c5.direction){
case "top-left":
_2c8=_2c9=_2ca=_2cb=0;
break;
case "top-right":
_2c8=dims.width;
_2c9=_2cb=0;
_2ca=-dims.width;
break;
case "bottom-left":
_2c8=_2ca=0;
_2c9=dims.height;
_2cb=-dims.height;
break;
case "bottom-right":
_2c8=dims.width;
_2c9=dims.height;
_2ca=-dims.width;
_2cb=-dims.height;
break;
case "center":
_2c8=dims.width/2;
_2c9=dims.height/2;
_2ca=-dims.width/2;
_2cb=-dims.height/2;
break;
}
return new Effect.Move(_2c4,{x:_2c8,y:_2c9,duration:0.01,beforeSetup:function(_2cc){
_2cc.element.hide().makeClipping().makePositioned();
},afterFinishInternal:function(_2cd){
new Effect.Parallel([new Effect.Opacity(_2cd.element,{sync:true,to:1,from:0,transition:_2c5.opacityTransition}),new Effect.Move(_2cd.element,{x:_2ca,y:_2cb,sync:true,transition:_2c5.moveTransition}),new Effect.Scale(_2cd.element,100,{scaleMode:{originalHeight:dims.height,originalWidth:dims.width},sync:true,scaleFrom:window.opera?1:0,transition:_2c5.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(_2ce){
_2ce.effects[0].element.setStyle({height:"0px"}).show();
},afterFinishInternal:function(_2cf){
_2cf.effects[0].element.undoClipping().undoPositioned().setStyle(_2c6);
}},_2c5));
}});
};
Effect.Shrink=function(_2d0){
_2d0=$(_2d0);
var _2d1=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});
var _2d2={top:_2d0.style.top,left:_2d0.style.left,height:_2d0.style.height,width:_2d0.style.width,opacity:_2d0.getInlineOpacity()};
var dims=_2d0.getDimensions();
var _2d4,_2d5;
switch(_2d1.direction){
case "top-left":
_2d4=_2d5=0;
break;
case "top-right":
_2d4=dims.width;
_2d5=0;
break;
case "bottom-left":
_2d4=0;
_2d5=dims.height;
break;
case "bottom-right":
_2d4=dims.width;
_2d5=dims.height;
break;
case "center":
_2d4=dims.width/2;
_2d5=dims.height/2;
break;
}
return new Effect.Parallel([new Effect.Opacity(_2d0,{sync:true,to:0,from:1,transition:_2d1.opacityTransition}),new Effect.Scale(_2d0,window.opera?1:0,{sync:true,transition:_2d1.scaleTransition,restoreAfterFinish:true}),new Effect.Move(_2d0,{x:_2d4,y:_2d5,sync:true,transition:_2d1.moveTransition})],Object.extend({beforeStartInternal:function(_2d6){
_2d6.effects[0].element.makePositioned().makeClipping();
},afterFinishInternal:function(_2d7){
_2d7.effects[0].element.hide().undoClipping().undoPositioned().setStyle(_2d2);
}},_2d1));
};
Effect.Pulsate=function(_2d8){
_2d8=$(_2d8);
var _2d9=arguments[1]||{};
var _2da=_2d8.getInlineOpacity();
var _2db=_2d9.transition||Effect.Transitions.sinoidal;
var _2dc=function(pos){
return _2db(1-Effect.Transitions.pulse(pos,_2d9.pulses));
};
_2dc.bind(_2db);
return new Effect.Opacity(_2d8,Object.extend(Object.extend({duration:2,from:0,afterFinishInternal:function(_2de){
_2de.element.setStyle({opacity:_2da});
}},_2d9),{transition:_2dc}));
};
Effect.Fold=function(_2df){
_2df=$(_2df);
var _2e0={top:_2df.style.top,left:_2df.style.left,width:_2df.style.width,height:_2df.style.height};
_2df.makeClipping();
return new Effect.Scale(_2df,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(_2e1){
new Effect.Scale(_2df,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(_2e2){
_2e2.element.hide().undoClipping().setStyle(_2e0);
}});
}},arguments[1]||{}));
};
Effect.Morph=Class.create();
Object.extend(Object.extend(Effect.Morph.prototype,Effect.Base.prototype),{initialize:function(_2e3){
this.element=$(_2e3);
if(!this.element){
throw (Effect._elementDoesNotExistError);
}
var _2e4=Object.extend({style:""},arguments[1]||{});
this.start(_2e4);
},setup:function(){
function parseColor(_2e5){
if(!_2e5||["rgba(0, 0, 0, 0)","transparent"].include(_2e5)){
_2e5="#ffffff";
}
_2e5=_2e5.parseColor();
return $R(0,2).map(function(i){
return parseInt(_2e5.slice(i*2+1,i*2+3),16);
});
}
this.transforms=this.options.style.parseStyle().map(function(_2e7){
var _2e8=this.element.getStyle(_2e7[0]);
return $H({style:_2e7[0],originalValue:_2e7[1].unit=="color"?parseColor(_2e8):parseFloat(_2e8||0),targetValue:_2e7[1].unit=="color"?parseColor(_2e7[1].value):_2e7[1].value,unit:_2e7[1].unit});
}.bind(this)).reject(function(_2e9){
return ((_2e9.originalValue==_2e9.targetValue)||(_2e9.unit!="color"&&(isNaN(_2e9.originalValue)||isNaN(_2e9.targetValue))));
});
},update:function(_2ea){
var _2eb=$H(),_2ec=null;
this.transforms.each(function(_2ed){
_2ec=_2ed.unit=="color"?$R(0,2).inject("#",function(m,v,i){
return m+(Math.round(_2ed.originalValue[i]+(_2ed.targetValue[i]-_2ed.originalValue[i])*_2ea)).toColorPart();
}):_2ed.originalValue+Math.round(((_2ed.targetValue-_2ed.originalValue)*_2ea)*1000)/1000+_2ed.unit;
_2eb[_2ed.style]=_2ec;
});
this.element.setStyle(_2eb);
}});
Effect.Transform=Class.create();
Object.extend(Effect.Transform.prototype,{initialize:function(_2f1){
this.tracks=[];
this.options=arguments[1]||{};
this.addTracks(_2f1);
},addTracks:function(_2f2){
_2f2.each(function(_2f3){
var data=$H(_2f3).values().first();
this.tracks.push($H({ids:$H(_2f3).keys().first(),effect:Effect.Morph,options:{style:data}}));
}.bind(this));
return this;
},play:function(){
return new Effect.Parallel(this.tracks.map(function(_2f5){
var _2f6=[$(_2f5.ids)||$$(_2f5.ids)].flatten();
return _2f6.map(function(e){
return new _2f5.effect(e,Object.extend({sync:true},_2f5.options));
});
}).flatten(),this.options);
}});
Element.CSS_PROPERTIES=["azimuth","backgroundAttachment","backgroundColor","backgroundImage","backgroundPosition","backgroundRepeat","borderBottomColor","borderBottomStyle","borderBottomWidth","borderCollapse","borderLeftColor","borderLeftStyle","borderLeftWidth","borderRightColor","borderRightStyle","borderRightWidth","borderSpacing","borderTopColor","borderTopStyle","borderTopWidth","bottom","captionSide","clear","clip","color","content","counterIncrement","counterReset","cssFloat","cueAfter","cueBefore","cursor","direction","display","elevation","emptyCells","fontFamily","fontSize","fontSizeAdjust","fontStretch","fontStyle","fontVariant","fontWeight","height","left","letterSpacing","lineHeight","listStyleImage","listStylePosition","listStyleType","marginBottom","marginLeft","marginRight","marginTop","markerOffset","marks","maxHeight","maxWidth","minHeight","minWidth","opacity","orphans","outlineColor","outlineOffset","outlineStyle","outlineWidth","overflowX","overflowY","paddingBottom","paddingLeft","paddingRight","paddingTop","page","pageBreakAfter","pageBreakBefore","pageBreakInside","pauseAfter","pauseBefore","pitch","pitchRange","position","quotes","richness","right","size","speakHeader","speakNumeral","speakPunctuation","speechRate","stress","tableLayout","textAlign","textDecoration","textIndent","textShadow","textTransform","top","unicodeBidi","verticalAlign","visibility","voiceFamily","volume","whiteSpace","widows","width","wordSpacing","zIndex"];
Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.prototype.parseStyle=function(){
var _2f8=Element.extend(document.createElement("div"));
_2f8.innerHTML="<div style=\""+this+"\"></div>";
var _2f9=_2f8.down().style,_2fa=$H();
Element.CSS_PROPERTIES.each(function(_2fb){
if(_2f9[_2fb]){
_2fa[_2fb]=_2f9[_2fb];
}
});
var _2fc=$H();
_2fa.each(function(pair){
var _2fe=pair[0],_2ff=pair[1],unit=null;
if(_2ff.parseColor("#zzzzzz")!="#zzzzzz"){
_2ff=_2ff.parseColor();
unit="color";
}else{
if(Element.CSS_LENGTH.test(_2ff)){
var _301=_2ff.match(/^([\+\-]?[0-9\.]+)(.*)$/),_2ff=parseFloat(_301[1]),unit=(_301.length==3)?_301[2]:null;
}
}
_2fc[_2fe.underscore().dasherize()]=$H({value:_2ff,unit:unit});
}.bind(this));
return _2fc;
};
Element.morph=function(_302,_303){
new Effect.Morph(_302,Object.extend({style:_303},arguments[2]||{}));
return _302;
};
["setOpacity","getOpacity","getInlineOpacity","forceRerendering","setContentZoom","collectTextNodes","collectTextNodesIgnoreClass","morph"].each(function(f){
Element.Methods[f]=Element[f];
});
Element.Methods.visualEffect=function(_305,_306,_307){
s=_306.gsub(/_/,"-").camelize();
effect_class=s.charAt(0).toUpperCase()+s.substring(1);
new Effect[effect_class](_305,_307);
return $(_305);
};
Element.addMethods();
if(typeof Effect=="undefined"){
throw ("controls.js requires including script.aculo.us' effects.js library");
}
var Autocompleter={};
Autocompleter.Base=function(){
};
Autocompleter.Base.prototype={baseInitialize:function(_308,_309,_30a){
this.element=$(_308);
this.update=$(_309);
this.hasFocus=false;
this.changed=false;
this.active=false;
this.index=0;
this.entryCount=0;
if(this.setOptions){
this.setOptions(_30a);
}else{
this.options=_30a||{};
}
this.options.paramName=this.options.paramName||this.element.name;
this.options.tokens=this.options.tokens||[];
this.options.frequency=this.options.frequency||0.4;
this.options.minChars=this.options.minChars||1;
this.options.onShow=this.options.onShow||function(_30b,_30c){
if(!_30c.style.position||_30c.style.position=="absolute"){
_30c.style.position="absolute";
Position.clone(_30b,_30c,{setHeight:false,offsetTop:_30b.offsetHeight});
}
Effect.Appear(_30c,{duration:0.15});
};
this.options.onHide=this.options.onHide||function(_30d,_30e){
new Effect.Fade(_30e,{duration:0.15});
};
if(typeof (this.options.tokens)=="string"){
this.options.tokens=new Array(this.options.tokens);
}
this.observer=null;
this.element.setAttribute("autocomplete","off");
Element.hide(this.update);
Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this));
Event.observe(this.element,"keypress",this.onKeyPress.bindAsEventListener(this));
},show:function(){
if(Element.getStyle(this.update,"display")=="none"){
this.options.onShow(this.element,this.update);
}
if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(Element.getStyle(this.update,"position")=="absolute")){
new Insertion.After(this.update,"<iframe id=\""+this.update.id+"_iefix\" "+"style=\"display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);\" "+"src=\"javascript:false;\" frameborder=\"0\" scrolling=\"no\"></iframe>");
this.iefix=$(this.update.id+"_iefix");
}
if(this.iefix){
setTimeout(this.fixIEOverlapping.bind(this),50);
}
},fixIEOverlapping:function(){
Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});
this.iefix.style.zIndex=1;
this.update.style.zIndex=2;
Element.show(this.iefix);
},hide:function(){
this.stopIndicator();
if(Element.getStyle(this.update,"display")!="none"){
this.options.onHide(this.element,this.update);
}
if(this.iefix){
Element.hide(this.iefix);
}
},startIndicator:function(){
if(this.options.indicator){
Element.show(this.options.indicator);
}
},stopIndicator:function(){
if(this.options.indicator){
Element.hide(this.options.indicator);
}
},onKeyPress:function(_30f){
if(this.active){
switch(_30f.keyCode){
case Event.KEY_TAB:
case Event.KEY_RETURN:
this.selectEntry();
Event.stop(_30f);
case Event.KEY_ESC:
this.hide();
this.active=false;
Event.stop(_30f);
return;
case Event.KEY_LEFT:
case Event.KEY_RIGHT:
return;
case Event.KEY_UP:
this.markPrevious();
this.render();
if(navigator.appVersion.indexOf("AppleWebKit")>0){
Event.stop(_30f);
}
return;
case Event.KEY_DOWN:
this.markNext();
this.render();
if(navigator.appVersion.indexOf("AppleWebKit")>0){
Event.stop(_30f);
}
return;
}
}else{
if(_30f.keyCode==Event.KEY_TAB||_30f.keyCode==Event.KEY_RETURN||(navigator.appVersion.indexOf("AppleWebKit")>0&&_30f.keyCode==0)){
return;
}
}
this.changed=true;
this.hasFocus=true;
if(this.observer){
clearTimeout(this.observer);
}
this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);
},activate:function(){
this.changed=false;
this.hasFocus=true;
this.getUpdatedChoices();
},onHover:function(_310){
var _311=Event.findElement(_310,"LI");
if(this.index!=_311.autocompleteIndex){
this.index=_311.autocompleteIndex;
this.render();
}
Event.stop(_310);
},onClick:function(_312){
var _313=Event.findElement(_312,"LI");
this.index=_313.autocompleteIndex;
this.selectEntry();
this.hide();
},onBlur:function(_314){
setTimeout(this.hide.bind(this),250);
this.hasFocus=false;
this.active=false;
},render:function(){
if(this.entryCount>0){
for(var i=0;i<this.entryCount;i++){
this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");
}
if(this.hasFocus){
this.show();
this.active=true;
}
}else{
this.active=false;
this.hide();
}
},markPrevious:function(){
if(this.index>0){
this.index--;
}else{
this.index=this.entryCount-1;
}
this.getEntry(this.index).scrollIntoView(true);
},markNext:function(){
if(this.index<this.entryCount-1){
this.index++;
}else{
this.index=0;
}
this.getEntry(this.index).scrollIntoView(false);
},getEntry:function(_316){
return this.update.firstChild.childNodes[_316];
},getCurrentEntry:function(){
return this.getEntry(this.index);
},selectEntry:function(){
this.active=false;
this.updateElement(this.getCurrentEntry());
},updateElement:function(_317){
if(this.options.updateElement){
this.options.updateElement(_317);
return;
}
var _318="";
if(this.options.select){
var _319=document.getElementsByClassName(this.options.select,_317)||[];
if(_319.length>0){
_318=Element.collectTextNodes(_319[0],this.options.select);
}
}else{
_318=Element.collectTextNodesIgnoreClass(_317,"informal");
}
var _31a=this.findLastToken();
if(_31a!=-1){
var _31b=this.element.value.substr(0,_31a+1);
var _31c=this.element.value.substr(_31a+1).match(/^\s+/);
if(_31c){
_31b+=_31c[0];
}
this.element.value=_31b+_318;
}else{
this.element.value=_318;
}
this.element.focus();
if(this.options.afterUpdateElement){
this.options.afterUpdateElement(this.element,_317);
}
},updateChoices:function(_31d){
if(!this.changed&&this.hasFocus){
this.update.innerHTML=_31d;
Element.cleanWhitespace(this.update);
Element.cleanWhitespace(this.update.down());
if(this.update.firstChild&&this.update.down().childNodes){
this.entryCount=this.update.down().childNodes.length;
for(var i=0;i<this.entryCount;i++){
var _31f=this.getEntry(i);
_31f.autocompleteIndex=i;
this.addObservers(_31f);
}
}else{
this.entryCount=0;
}
this.stopIndicator();
this.index=0;
if(this.entryCount==1&&this.options.autoSelect){
this.selectEntry();
this.hide();
}else{
this.render();
}
}
},addObservers:function(_320){
Event.observe(_320,"mouseover",this.onHover.bindAsEventListener(this));
Event.observe(_320,"click",this.onClick.bindAsEventListener(this));
},onObserverEvent:function(){
this.changed=false;
if(this.getToken().length>=this.options.minChars){
this.startIndicator();
this.getUpdatedChoices();
}else{
this.active=false;
this.hide();
}
},getToken:function(){
var _321=this.findLastToken();
if(_321!=-1){
var ret=this.element.value.substr(_321+1).replace(/^\s+/,"").replace(/\s+$/,"");
}else{
var ret=this.element.value;
}
return /\n/.test(ret)?"":ret;
},findLastToken:function(){
var _323=-1;
for(var i=0;i<this.options.tokens.length;i++){
var _325=this.element.value.lastIndexOf(this.options.tokens[i]);
if(_325>_323){
_323=_325;
}
}
return _323;
}};
Ajax.Autocompleter=Class.create();
Object.extend(Object.extend(Ajax.Autocompleter.prototype,Autocompleter.Base.prototype),{initialize:function(_326,_327,url,_329){
this.baseInitialize(_326,_327,_329);
this.options.asynchronous=true;
this.options.onComplete=this.onComplete.bind(this);
this.options.defaultParams=this.options.parameters||null;
this.url=url;
},getUpdatedChoices:function(){
entry=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());
this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;
if(this.options.defaultParams){
this.options.parameters+="&"+this.options.defaultParams;
}
new Ajax.Request(this.url,this.options);
},onComplete:function(_32a){
this.updateChoices(_32a.responseText);
}});
Autocompleter.Local=Class.create();
Autocompleter.Local.prototype=Object.extend(new Autocompleter.Base(),{initialize:function(_32b,_32c,_32d,_32e){
this.baseInitialize(_32b,_32c,_32e);
this.options.array=_32d;
},getUpdatedChoices:function(){
this.updateChoices(this.options.selector(this));
},setOptions:function(_32f){
this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(_330){
var ret=[];
var _332=[];
var _333=_330.getToken();
var _334=0;
for(var i=0;i<_330.options.array.length&&ret.length<_330.options.choices;i++){
var elem=_330.options.array[i];
var _337=_330.options.ignoreCase?elem.toLowerCase().indexOf(_333.toLowerCase()):elem.indexOf(_333);
while(_337!=-1){
if(_337==0&&elem.length!=_333.length){
ret.push("<li><strong>"+elem.substr(0,_333.length)+"</strong>"+elem.substr(_333.length)+"</li>");
break;
}else{
if(_333.length>=_330.options.partialChars&&_330.options.partialSearch&&_337!=-1){
if(_330.options.fullSearch||/\s/.test(elem.substr(_337-1,1))){
_332.push("<li>"+elem.substr(0,_337)+"<strong>"+elem.substr(_337,_333.length)+"</strong>"+elem.substr(_337+_333.length)+"</li>");
break;
}
}
}
_337=_330.options.ignoreCase?elem.toLowerCase().indexOf(_333.toLowerCase(),_337+1):elem.indexOf(_333,_337+1);
}
}
if(_332.length){
ret=ret.concat(_332.slice(0,_330.options.choices-ret.length));
}
return "<ul>"+ret.join("")+"</ul>";
}},_32f||{});
}});
Field.scrollFreeActivate=function(_338){
setTimeout(function(){
Field.activate(_338);
},1);
};
Ajax.InPlaceEditor=Class.create();
Ajax.InPlaceEditor.defaultHighlightColor="#FFFF99";
Ajax.InPlaceEditor.prototype={initialize:function(_339,url,_33b){
this.url=url;
this.element=$(_339);
this.options=Object.extend({paramName:"value",okButton:true,okText:"ok",cancelLink:true,cancelText:"cancel",savingText:"Saving...",clickToEditText:"Click to edit",okText:"ok",rows:1,onComplete:function(_33c,_33d){
new Effect.Highlight(_33d,{startcolor:this.options.highlightcolor});
},onFailure:function(_33e){
alert("Error communicating with the server: "+_33e.responseText.stripTags());
},callback:function(form){
return Form.serialize(form);
},handleLineBreaks:true,loadingText:"Loading...",savingClassName:"inplaceeditor-saving",loadingClassName:"inplaceeditor-loading",formClassName:"inplaceeditor-form",highlightcolor:Ajax.InPlaceEditor.defaultHighlightColor,highlightendcolor:"#FFFFFF",externalControl:null,submitOnBlur:false,ajaxOptions:{},evalScripts:false},_33b||{});
if(!this.options.formId&&this.element.id){
this.options.formId=this.element.id+"-inplaceeditor";
if($(this.options.formId)){
this.options.formId=null;
}
}
if(this.options.externalControl){
this.options.externalControl=$(this.options.externalControl);
}
this.originalBackground=Element.getStyle(this.element,"background-color");
if(!this.originalBackground){
this.originalBackground="transparent";
}
this.element.title=this.options.clickToEditText;
this.onclickListener=this.enterEditMode.bindAsEventListener(this);
this.mouseoverListener=this.enterHover.bindAsEventListener(this);
this.mouseoutListener=this.leaveHover.bindAsEventListener(this);
Event.observe(this.element,"click",this.onclickListener);
Event.observe(this.element,"mouseover",this.mouseoverListener);
Event.observe(this.element,"mouseout",this.mouseoutListener);
if(this.options.externalControl){
Event.observe(this.options.externalControl,"click",this.onclickListener);
Event.observe(this.options.externalControl,"mouseover",this.mouseoverListener);
Event.observe(this.options.externalControl,"mouseout",this.mouseoutListener);
}
},enterEditMode:function(evt){
if(this.saving){
return;
}
if(this.editing){
return;
}
this.editing=true;
this.onEnterEditMode();
if(this.options.externalControl){
Element.hide(this.options.externalControl);
}
Element.hide(this.element);
this.createForm();
this.element.parentNode.insertBefore(this.form,this.element);
if(!this.options.loadTextURL){
Field.scrollFreeActivate(this.editField);
}
if(evt){
Event.stop(evt);
}
return false;
},createForm:function(){
this.form=document.createElement("form");
this.form.id=this.options.formId;
Element.addClassName(this.form,this.options.formClassName);
this.form.onsubmit=this.onSubmit.bind(this);
this.createEditField();
if(this.options.textarea){
var br=document.createElement("br");
this.form.appendChild(br);
}
if(this.options.okButton){
okButton=document.createElement("input");
okButton.type="submit";
okButton.value=this.options.okText;
okButton.className="editor_ok_button";
this.form.appendChild(okButton);
}
if(this.options.cancelLink){
cancelLink=document.createElement("a");
cancelLink.href="#";
cancelLink.appendChild(document.createTextNode(this.options.cancelText));
cancelLink.onclick=this.onclickCancel.bind(this);
cancelLink.className="editor_cancel";
this.form.appendChild(cancelLink);
}
},hasHTMLLineBreaks:function(_342){
if(!this.options.handleLineBreaks){
return false;
}
return _342.match(/<br/i)||_342.match(/<p>/i);
},convertHTMLLineBreaks:function(_343){
return _343.replace(/<br>/gi,"\n").replace(/<br\/>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<p>/gi,"");
},createEditField:function(){
var text;
if(this.options.loadTextURL){
text=this.options.loadingText;
}else{
text=this.getText();
}
var obj=this;
if(this.options.rows==1&&!this.hasHTMLLineBreaks(text)){
this.options.textarea=false;
var _346=document.createElement("input");
_346.obj=this;
_346.type="text";
_346.name=this.options.paramName;
_346.value=text;
_346.style.backgroundColor=this.options.highlightcolor;
_346.className="editor_field";
var size=this.options.size||this.options.cols||0;
if(size!=0){
_346.size=size;
}
if(this.options.submitOnBlur){
_346.onblur=this.onSubmit.bind(this);
}
this.editField=_346;
}else{
this.options.textarea=true;
var _348=document.createElement("textarea");
_348.obj=this;
_348.name=this.options.paramName;
_348.value=this.convertHTMLLineBreaks(text);
_348.rows=this.options.rows;
_348.cols=this.options.cols||40;
_348.className="editor_field";
if(this.options.submitOnBlur){
_348.onblur=this.onSubmit.bind(this);
}
this.editField=_348;
}
if(this.options.loadTextURL){
this.loadExternalText();
}
this.form.appendChild(this.editField);
},getText:function(){
return this.element.innerHTML;
},loadExternalText:function(){
Element.addClassName(this.form,this.options.loadingClassName);
this.editField.disabled=true;
new Ajax.Request(this.options.loadTextURL,Object.extend({asynchronous:true,onComplete:this.onLoadedExternalText.bind(this)},this.options.ajaxOptions));
},onLoadedExternalText:function(_349){
Element.removeClassName(this.form,this.options.loadingClassName);
this.editField.disabled=false;
this.editField.value=_349.responseText.stripTags();
Field.scrollFreeActivate(this.editField);
},onclickCancel:function(){
this.onComplete();
this.leaveEditMode();
return false;
},onFailure:function(_34a){
this.options.onFailure(_34a);
if(this.oldInnerHTML){
this.element.innerHTML=this.oldInnerHTML;
this.oldInnerHTML=null;
}
return false;
},onSubmit:function(){
var form=this.form;
var _34c=this.editField.value;
this.onLoading();
if(this.options.evalScripts){
new Ajax.Request(this.url,Object.extend({parameters:this.options.callback(form,_34c),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this),asynchronous:true,evalScripts:true},this.options.ajaxOptions));
}else{
new Ajax.Updater({success:this.element,failure:null},this.url,Object.extend({parameters:this.options.callback(form,_34c),onComplete:this.onComplete.bind(this),onFailure:this.onFailure.bind(this)},this.options.ajaxOptions));
}
if(arguments.length>1){
Event.stop(arguments[0]);
}
return false;
},onLoading:function(){
this.saving=true;
this.removeForm();
this.leaveHover();
this.showSaving();
},showSaving:function(){
this.oldInnerHTML=this.element.innerHTML;
this.element.innerHTML=this.options.savingText;
Element.addClassName(this.element,this.options.savingClassName);
this.element.style.backgroundColor=this.originalBackground;
Element.show(this.element);
},removeForm:function(){
if(this.form){
if(this.form.parentNode){
Element.remove(this.form);
}
this.form=null;
}
},enterHover:function(){
if(this.saving){
return;
}
this.element.style.backgroundColor=this.options.highlightcolor;
if(this.effect){
this.effect.cancel();
}
Element.addClassName(this.element,this.options.hoverClassName);
},leaveHover:function(){
if(this.options.backgroundColor){
this.element.style.backgroundColor=this.oldBackground;
}
Element.removeClassName(this.element,this.options.hoverClassName);
if(this.saving){
return;
}
this.effect=new Effect.Highlight(this.element,{startcolor:this.options.highlightcolor,endcolor:this.options.highlightendcolor,restorecolor:this.originalBackground});
},leaveEditMode:function(){
Element.removeClassName(this.element,this.options.savingClassName);
this.removeForm();
this.leaveHover();
this.element.style.backgroundColor=this.originalBackground;
Element.show(this.element);
if(this.options.externalControl){
Element.show(this.options.externalControl);
}
this.editing=false;
this.saving=false;
this.oldInnerHTML=null;
this.onLeaveEditMode();
},onComplete:function(_34d){
this.leaveEditMode();
this.options.onComplete.bind(this)(_34d,this.element);
},onEnterEditMode:function(){
},onLeaveEditMode:function(){
},dispose:function(){
if(this.oldInnerHTML){
this.element.innerHTML=this.oldInnerHTML;
}
this.leaveEditMode();
Event.stopObserving(this.element,"click",this.onclickListener);
Event.stopObserving(this.element,"mouseover",this.mouseoverListener);
Event.stopObserving(this.element,"mouseout",this.mouseoutListener);
if(this.options.externalControl){
Event.stopObserving(this.options.externalControl,"click",this.onclickListener);
Event.stopObserving(this.options.externalControl,"mouseover",this.mouseoverListener);
Event.stopObserving(this.options.externalControl,"mouseout",this.mouseoutListener);
}
}};
Ajax.InPlaceCollectionEditor=Class.create();
Object.extend(Ajax.InPlaceCollectionEditor.prototype,Ajax.InPlaceEditor.prototype);
Object.extend(Ajax.InPlaceCollectionEditor.prototype,{createEditField:function(){
if(!this.cached_selectTag){
var _34e=document.createElement("select");
var _34f=this.options.collection||[];
var _350;
_34f.each(function(e,i){
_350=document.createElement("option");
_350.value=(e instanceof Array)?e[0]:e;
if((typeof this.options.value=="undefined")&&((e instanceof Array)?this.element.innerHTML==e[1]:e==_350.value)){
_350.selected=true;
}
if(this.options.value==_350.value){
_350.selected=true;
}
_350.appendChild(document.createTextNode((e instanceof Array)?e[1]:e));
_34e.appendChild(_350);
}.bind(this));
this.cached_selectTag=_34e;
}
this.editField=this.cached_selectTag;
if(this.options.loadTextURL){
this.loadExternalText();
}
this.form.appendChild(this.editField);
this.options.callback=function(form,_354){
return "value="+encodeURIComponent(_354);
};
}});
Form.Element.DelayedObserver=Class.create();
Form.Element.DelayedObserver.prototype={initialize:function(_355,_356,_357){
this.delay=_356||0.5;
this.element=$(_355);
this.callback=_357;
this.timer=null;
this.lastValue=$F(this.element);
Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this));
},delayedListener:function(_358){
if(this.lastValue==$F(this.element)){
return;
}
if(this.timer){
clearTimeout(this.timer);
}
this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);
this.lastValue=$F(this.element);
},onTimerEvent:function(){
this.timer=null;
this.callback(this.element,$F(this.element));
}};
Wagn=new Object();
function warn(_359){
if(typeof (console)!="undefined"){
console.log(_359);
}
}
Wagn.CardTable=$H({});
Object.extend(Wagn.CardTable,{get:function(key){
return this[key];
}});
Wagn.Dummy=Class.create();
Wagn.Dummy.prototype={initialize:function(num){
this.number=num;
}};
var Cookie={set:function(name,_35d,_35e){
var _35f="";
if(_35e!=undefined){
var d=new Date();
d.setTime(d.getTime()+(86400000*parseFloat(_35e)));
_35f="; expires="+d.toGMTString();
}
return (document.cookie=escape(name)+"="+escape(_35d||"")+_35f);
},get:function(name){
var _362=document.cookie.match(new RegExp("(^|;)\\s*"+escape(name)+"=([^;\\s]*)"));
return (_362?unescape(_362[2]):null);
},erase:function(name){
var _364=Cookie.get(name)||true;
Cookie.set(name,"",-1);
return _364;
},accept:function(){
if(typeof navigator.cookieEnabled=="boolean"){
return navigator.cookieEnabled;
}
Cookie.set("_test","1");
return (Cookie.erase("_test")==="1");
}};
Wagn.Messenger={element:function(){
return $("alerts");
},alert:function(_365){
this.element().innerHTML="<span style=\"color:red; font-weight: bold\">"+_365+"</span>";
new Effect.Highlight(this.element(),{startcolor:"#ffff00",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},note:function(_366){
this.element().innerHTML=_366;
new Effect.Highlight(this.element(),{startcolor:"#ffff00",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},log:function(_367){
this.element().innerHTML=_367;
new Effect.Highlight(this.element(),{startcolor:"#dddddd",endcolor:"#ffffaa",restorecolor:"#ffffaa",duration:1});
},flash:function(){
flash=$("notice").innerHTML+$("error").innerHTML;
if(flash!=""){
this.alert(flash);
}
}};
function openInNewWindow(){
var _368=window.open(this.getAttribute("href"),"_blank");
_368.focus();
return false;
}
function getNewWindowLinks(){
if(document.getElementById&&document.createElement&&document.appendChild){
var link;
var _36a=document.getElementsByTagName("a");
for(var i=0;i<_36a.length;i++){
link=_36a[i];
if(/\bexternal\b/.exec(link.className)){
link.onclick=openInNewWindow;
}
}
objWarningText=null;
}
}
var tt_db=(document.compatMode&&document.compatMode!="BackCompat")?document.documentElement:document.body?document.body:null,tt_n=navigator.userAgent.toLowerCase();
var tt_op=!!(window.opera&&document.getElementById),tt_op6=tt_op&&!document.defaultView,tt_ie=tt_n.indexOf("msie")!=-1&&document.all&&tt_db&&!tt_op,tt_n4=(document.layers&&typeof document.classes!="undefined"),tt_n6=(!tt_op&&document.defaultView&&typeof document.defaultView.getComputedStyle!="undefined"),tt_w3c=!tt_ie&&!tt_n6&&!tt_op&&document.getElementById;
tt_n="";
var DEBUGGING=false;
function copy_with_classes(_36c){
copy=document.createElement("span");
copy.innerHTML=_36c.innerHTML;
Element.classNames(_36c).each(function(_36d){
Element.addClassName(copy,_36d);
});
copy.hide();
_36c.parentNode.insertBefore(copy,_36c);
return copy;
}
Object.extend(Wagn,{user:function(){
return $("user");
},card:function(){
return Wagn.Card;
},lister:function(){
return Wagn._lister;
},messenger:function(){
return Wagn.Messenger;
},cardTable:function(){
return Wagn.CardTable;
},title_mouseover:function(_36e){
document.getElementsByClassName(_36e).each(function(elem){
Element.addClassName(elem,"card-highlight");
Element.removeClassName(elem,"card");
});
},title_mouseout:function(_370){
document.getElementsByClassName(_370).each(function(elem){
Element.removeClassName(elem,"card-highlight");
Element.addClassName(elem,"card");
});
},grow_line:function(_372){
var _373=_372.getDimensions();
new Effect.BlindDown(_372,{duration:0.5,scaleFrom:100,scaleMode:{originalHeight:_373.height*2,originalWidth:_373.width}});
},line_to_paragraph:function(_374){
var _375=_374.getDimensions();
copy=copy_with_classes(_374);
copy.removeClassName("line");
copy.addClassName("paragraph");
var _376=copy.getDimensions();
copy.viewHeight=_376.height;
copy.remove();
var _377=100*_375.height/_376.height;
var _378=_376;
new Effect.BlindDown(_374,{duration:0.5,scaleFrom:_377,scaleMode:{originalHeight:_378.height,originalWidth:_378.width},afterSetup:function(_379){
_379.element.makeClipping();
_379.element.setStyle({height:"0px"});
_379.element.show();
_379.element.removeClassName("line");
_379.element.addClassName("paragraph");
}});
},paragraph_to_line:function(_37a){
var _37b=_37a.getDimensions();
copy=copy_with_classes(_37a);
copy.removeClassName("paragraph");
copy.addClassName("line");
var _37c=copy.getDimensions();
copy.remove();
var _37d=100*_37c.height/_37b.height;
return new Effect.Scale(_37a,_37d,{duration:0.5,scaleContent:false,scaleX:false,scaleFrom:100,scaleMode:{originalHeight:_37b.height,originalWidth:_37b.width},restoreAfterFinish:true,afterSetup:function(_37e){
_37e.element.makeClipping();
_37e.element.setStyle({height:"0px"});
_37e.element.show();
},afterFinishInternal:function(_37f){
_37f.element.undoClipping();
_37f.element.removeClassName("paragraph");
_37f.element.addClassName("line");
}});
}});
Wagn.highlight=function(_380,id){
document.getElementsByClassName(_380).each(function(elem){
Element.removeClassName(elem.id,"current");
});
Element.addClassName(_380+"-"+id,"current");
};
Wagn.runQueue=function(_383){
if(typeof (_383)=="undefined"){
return true;
}
result=true;
while(fn=_383.shift()){
if(!fn.call()){
result=false;
}
}
return result;
};
Wagn.onLoadQueue=$A([]);
Wagn.onSaveQueue=$H({});
Wagn.onCancelQueue=$H({});
Wagn.editors=$H({});
onload=function(){
Wagn.Messenger.flash();
Wagn.runQueue(Wagn.onLoadQueue);
setupCardViewStuff();
getNewWindowLinks();
setupDoubleClickToEdit();
if(typeof (init_lister)!="undefined"){
Wagn._lister=init_lister();
Wagn._lister.update();
}
};
setupCardViewStuff=function(){
getNewWindowLinks();
setupDoubleClickToEdit();
};
setupDoubleClickToEdit=function(_384){
Element.getElementsByClassName(document,"createOnClick").each(function(el){
el.onclick=function(_386){
element=Event.element(_386);
span=getTransclusionSpan(element);
slot_id=getSlotId(element);
position=span.hasAttribute("position")?span.attributes["position"].value:false;
context=slot_id+(position?":"+position:"");
card_name=span.attributes["cardname"].value;
console.log("create  "+card_name);
new Ajax.Request("/transclusion/create?context="+context,{asynchronous:true,evalScripts:true,parameters:"card[name]="+encodeURIComponent(card_name)});
Event.stop(_386);
};
});
Element.getElementsByClassName(document,"editOnDoubleClick").each(function(el){
el.ondblclick=function(_388){
element=Event.element(_388);
span=getTransclusionSpan(element);
slot_id=getSlotId(element);
position=span.hasAttribute("position")?span.attributes["position"].value:false;
context=slot_id+(position?":"+position:"");
card_id=span.attributes["cardid"].value;
new Ajax.Request("/transclusion/edit/"+card_id+"?context="+context,{asynchronous:true,evalScripts:true});
Event.stop(_388);
};
});
};
getSlotId=function(_389){
if(Element.hasClassName(_389,"card-slot")){
return _389.attributes["id"].value;
}else{
if(_389.parentNode){
return getSlotId(_389.parentNode);
}else{
warn("Failed to get Slot Id");
return false;
}
}
};
getTransclusionSpan=function(_38a){
if(_38a.hasAttribute("cardId")){
return _38a;
}else{
if(_38a.parentNode){
return getTransclusionSpan(_38a.parentNode);
}else{
warn("Failed to get Transclusion Span");
return false;
}
}
};
getTranscludingCardId=function(_38b){
if(_38b.hasAttribute("cardId")){
return _38b.attributes["cardId"].value;
}else{
if(_38b.parentNode){
return this.getTranscludingCardId(_38b.parentNode);
}else{
warn("Failed to get Transcluding Card Id");
return false;
}
}
};
Subclass=function(_38c,_38d){
if(!_38c){
throw ("Can't create a subclass without a name");
}
var _38e=_38c.split(".");
var _38f=window;
for(var i=0;i<_38e.length;i++){
if(!_38f[_38e[i]]){
_38f[_38e[i]]=function(){
};
}
_38f=_38f[_38e[i]];
}
if(_38d){
var _391=eval("new "+_38d+"()");
_38f.prototype=_391;
_38f.prototype.baseclass=_391;
}
_38f.prototype.classname=_38c;
return _38f.prototype;
};
proto=new Subclass("Wikiwyg");
Wikiwyg.VERSION="0.13";
Wikiwyg.ua=navigator.userAgent.toLowerCase();
Wikiwyg.is_ie=(Wikiwyg.ua.indexOf("msie")!=-1&&Wikiwyg.ua.indexOf("opera")==-1&&Wikiwyg.ua.indexOf("webtv")==-1);
Wikiwyg.is_gecko=(Wikiwyg.ua.indexOf("gecko")!=-1&&Wikiwyg.ua.indexOf("safari")==-1&&Wikiwyg.ua.indexOf("konqueror")==-1);
Wikiwyg.is_safari=(Wikiwyg.ua.indexOf("safari")!=-1);
Wikiwyg.is_opera=(Wikiwyg.ua.indexOf("opera")!=-1);
Wikiwyg.is_konqueror=(Wikiwyg.ua.indexOf("konqueror")!=-1);
Wikiwyg.browserIsSupported=(Wikiwyg.is_gecko||Wikiwyg.is_ie);
proto.createWikiwygArea=function(div,_393){
this.set_config(_393);
this.initializeObject(div,_393);
};
proto.default_config={javascriptLocation:"lib/",doubleClickToEdit:false,toolbarClass:"Wikiwyg.Toolbar",firstMode:null,modeClasses:["Wikiwyg.Wysiwyg","Wikiwyg.Wikitext","Wikiwyg.Preview"]};
proto.initializeObject=function(div,_395){
if(!Wikiwyg.browserIsSupported){
return;
}
if(this.enabled){
return;
}
this.enabled=true;
this.div=div;
this.divHeight=this.div.offsetHeight;
if(!_395){
_395={};
}
this.set_config(_395);
this.mode_objects={};
for(var i=0;i<this.config.modeClasses.length;i++){
var _397=this.config.modeClasses[i];
var _398=eval("new "+_397+"()");
_398.wikiwyg=this;
_398.set_config(_395[_398.classtype]);
_398.initializeObject();
this.mode_objects[_397]=_398;
}
var _399=this.config.firstMode?this.config.firstMode:this.config.modeClasses[0];
this.setFirstModeByName(_399);
if(this.config.toolbarClass){
var _397=this.config.toolbarClass;
this.toolbarObject=eval("new "+_397+"()");
this.toolbarObject.wikiwyg=this;
this.toolbarObject.set_config(_395.toolbar);
this.toolbarObject.initializeObject();
this.placeToolbar(this.toolbarObject.div);
}
for(var i=0;i<this.config.modeClasses.length;i++){
var _39a=this.config.modeClasses[i];
var _398=this.modeByName(_39a);
this.insert_div_before(_398.div);
}
if(this.config.doubleClickToEdit){
var self=this;
this.div.ondblclick=function(){
self.editMode();
};
}
};
proto.set_config=function(_39c){
var _39d={};
var keys=[];
for(var key in this.default_config){
keys.push(key);
}
if(_39c!=null){
for(var key in _39c){
keys.push(key);
}
}
for(var ii=0;ii<keys.length;ii++){
var key=keys[ii];
if(_39c!=null&&_39c[key]!=null){
_39d[key]=_39c[key];
}else{
if(this.default_config[key]!=null){
_39d[key]=this.default_config[key];
}else{
if(this[key]!=null){
_39d[key]=this[key];
}
}
}
}
this.config=_39d;
};
proto.insert_div_before=function(div){
div.style.display="none";
if(!div.iframe_hack){
this.div.parentNode.insertBefore(div,this.div);
}
};
proto.saveChanges=function(){
alert("Wikiwyg.prototype.saveChanges not subclassed");
};
proto.editMode=function(){
this.current_mode=this.first_mode;
this.current_mode.fromHtml(this.div.innerHTML);
this.toolbarObject.resetModeSelector();
this.current_mode.enableThis();
};
proto.displayMode=function(){
for(var i=0;i<this.config.modeClasses.length;i++){
var _3a3=this.config.modeClasses[i];
var _3a4=this.modeByName(_3a3);
_3a4.disableThis();
}
this.toolbarObject.disableThis();
this.div.style.display="block";
this.divHeight=this.div.offsetHeight;
};
proto.switchMode=function(_3a5){
var _3a6=this.modeByName(_3a5);
var _3a7=this.current_mode;
var self=this;
_3a6.enableStarted();
_3a7.disableStarted();
_3a7.toHtml(function(html){
self.previous_mode=_3a7;
_3a6.fromHtml(html);
_3a7.disableThis();
_3a6.enableThis();
_3a6.enableFinished();
_3a7.disableFinished();
self.current_mode=_3a6;
});
};
proto.modeByName=function(_3aa){
return this.mode_objects[_3aa];
};
proto.cancelEdit=function(){
this.displayMode();
};
proto.fromHtml=function(html){
this.div.innerHTML=html;
};
proto.placeToolbar=function(div){
this.insert_div_before(div);
};
proto.setFirstModeByName=function(_3ad){
if(!this.modeByName(_3ad)){
die("No mode named "+_3ad);
}
this.first_mode=this.modeByName(_3ad);
};
Wikiwyg.unique_id_base=0;
Wikiwyg.createUniqueId=function(){
return "wikiwyg_"+Wikiwyg.unique_id_base++;
};
Wikiwyg.liveUpdate=function(_3ae,url,_3b0,_3b1){
if(_3ae=="GET"){
return Ajax.get(url+"?"+_3b0,_3b1);
}
if(_3ae=="POST"){
return Ajax.post(url,_3b0,_3b1);
}
throw ("Bad method: "+_3ae+" passed to Wikiwyg.liveUpdate");
};
Wikiwyg.htmlUnescape=function(_3b2){
return _3b2.replace(/&(.*?);/g,function(_3b3,s){
return s.match(/^amp$/i)?"&":s.match(/^quot$/i)?"\"":s.match(/^gt$/i)?">":s.match(/^lt$/i)?"<":s.match(/^#(\d+)$/)?String.fromCharCode(s.replace(/#/,"")):s.match(/^#x([0-9a-f]+)$/i)?String.fromCharCode(s.replace(/#/,"0")):s;
});
};
Wikiwyg.showById=function(id){
document.getElementById(id).style.visibility="inherit";
};
Wikiwyg.hideById=function(id){
document.getElementById(id).style.visibility="hidden";
};
Wikiwyg.changeLinksMatching=function(_3b7,_3b8,func){
var _3ba=document.getElementsByTagName("a");
for(var i=0;i<_3ba.length;i++){
var link=_3ba[i];
var _3bd=link.getAttribute(_3b7);
if(_3bd&&_3bd.match(_3b8)){
link.setAttribute("href","#");
link.onclick=func;
}
}
};
Wikiwyg.createElementWithAttrs=function(_3be,_3bf,doc){
if(doc==null){
doc=document;
}
return Wikiwyg.create_element_with_attrs(_3be,_3bf,doc);
};
Wikiwyg.create_element_with_attrs=function(_3c1,_3c2,doc){
var elem=doc.createElement(_3c1);
for(name in _3c2){
elem.setAttribute(name,_3c2[name]);
}
return elem;
};
die=function(e){
throw (e);
};
String.prototype.times=function(n){
return n?this+this.times(n-1):"";
};
String.prototype.ucFirst=function(){
return this.substr(0,1).toUpperCase()+this.substr(1,this.length);
};
proto=new Subclass("Wikiwyg.Base");
proto.set_config=function(_3c7){
for(var key in this.config){
if(_3c7!=null&&_3c7[key]!=null){
this.merge_config(key,_3c7[key]);
}else{
if(this[key]!=null){
this.merge_config(key,this[key]);
}else{
if(this.wikiwyg.config[key]!=null){
this.merge_config(key,this.wikiwyg.config[key]);
}
}
}
}
};
proto.merge_config=function(key,_3ca){
if(_3ca instanceof Array){
this.config[key]=_3ca;
}else{
if(typeof _3ca.test=="function"){
this.config[key]=_3ca;
}else{
if(_3ca instanceof Object){
if(!this.config[key]){
this.config[key]={};
}
for(var _3cb in _3ca){
this.config[key][_3cb]=_3ca[_3cb];
}
}else{
this.config[key]=_3ca;
}
}
}
};
proto=new Subclass("Wikiwyg.Mode","Wikiwyg.Base");
proto.enableThis=function(){
this.div.style.display="block";
this.display_unsupported_toolbar_buttons("none");
this.wikiwyg.toolbarObject.enableThis();
this.wikiwyg.div.style.display="none";
};
proto.display_unsupported_toolbar_buttons=function(_3cc){
if(!this.config){
return;
}
var _3cd=this.config.disabledToolbarButtons;
if(!_3cd||_3cd.length<1){
return;
}
var _3ce=this.wikiwyg.toolbarObject.div;
var _3cf=_3ce.childNodes;
for(var i in _3cd){
var _3d1=_3cd[i];
for(var i in _3cf){
var _3d2=_3cf[i];
var src=_3d2.src;
if(!src){
continue;
}
if(src.match(_3d1)){
_3d2.style.display=_3cc;
break;
}
}
}
};
proto.enableStarted=function(){
};
proto.enableFinished=function(){
};
proto.disableStarted=function(){
};
proto.disableFinished=function(){
};
proto.disableThis=function(){
this.display_unsupported_toolbar_buttons("inline");
this.div.style.display="none";
};
proto.process_command=function(_3d4){
if(this["do_"+_3d4]){
this["do_"+_3d4](_3d4);
}
};
proto.enable_keybindings=function(){
if(!this.key_press_function){
this.key_press_function=this.get_key_press_function();
this.get_keybinding_area().addEventListener("keypress",this.key_press_function,true);
}
};
proto.get_key_press_function=function(){
var self=this;
return function(e){
if(!e.ctrlKey){
return;
}
var key=String.fromCharCode(e.charCode).toLowerCase();
var _3d8="";
switch(key){
case "b":
_3d8="bold";
break;
case "i":
_3d8="italic";
break;
case "u":
_3d8="underline";
break;
case "d":
_3d8="strike";
break;
case "l":
_3d8="link";
break;
}
if(_3d8){
e.preventDefault();
e.stopPropagation();
self.process_command(_3d8);
}
};
};
proto.get_edit_height=function(){
var _3d9=parseInt(this.wikiwyg.divHeight*this.config.editHeightAdjustment);
var min=this.config.editHeightMinimum;
return _3d9<min?min:_3d9;
};
proto.setHeightOf=function(elem){
elem.height=this.get_edit_height()+"px";
};
proto.sanitize_dom=function(dom){
this.element_transforms(dom,{del:{name:"strike",attr:{}},strong:{name:"span",attr:{style:"font-weight: bold;"}},em:{name:"span",attr:{style:"font-style: italic;"}}});
};
proto.element_transforms=function(dom,_3de){
for(var orig in _3de){
var _3e0=dom.getElementsByTagName(orig);
if(_3e0.length==0){
continue;
}
for(var i=0;i<_3e0.length;i++){
var elem=_3e0[i];
var _3e3=_3de[orig];
var _3e4=Wikiwyg.createElementWithAttrs(_3e3.name,_3e3.attr);
_3e4.innerHTML=elem.innerHTML;
elem.parentNode.replaceChild(_3e4,elem);
}
}
};
if(Wikiwyg.is_ie){
Wikiwyg.create_element_with_attrs=function(_3e5,_3e6,doc){
var str="";
for(name in _3e6){
str+=" "+name+"=\""+_3e6[name]+"\"";
}
return doc.createElement("<"+_3e5+str+">");
};
die=function(e){
alert(e);
throw (e);
};
proto=Wikiwyg.Mode.prototype;
proto.enable_keybindings=function(){
};
proto.sanitize_dom=function(dom){
this.element_transforms(dom,{del:{name:"strike",attr:{}}});
};
}
proto=new Subclass("Wikiwyg.Toolbar","Wikiwyg.Base");
proto.classtype="toolbar";
proto.config={divId:null,imagesLocation:"images/",imagesExtension:".gif",selectorWidth:"100px",controlLayout:["save","cancel","mode_selector","/","h1","h2","h3","h4","p","pre","|","bold","italic","underline","strike","|","link","hr","|","ordered","unordered","|","indent","outdent","|","table","|","help"],styleSelector:["label","p","h1","h2","h3","h4","h5","h6","pre"],controlLabels:{save:"Save",cancel:"Cancel",bold:"Bold (Ctrl+b)",italic:"Italic (Ctrl+i)",underline:"Underline (Ctrl+u)",strike:"Strike Through (Ctrl+d)",hr:"Horizontal Rule",ordered:"Numbered List",unordered:"Bulleted List",indent:"More Indented",outdent:"Less Indented",help:"About Wikiwyg",label:"[Style]",p:"Normal Text",pre:"Preformatted",h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",h4:"Heading 4",h5:"Heading 5",h6:"Heading 6",link:"Create Link",unlink:"Remove Linkedness",table:"Create Table"}};
proto.initializeObject=function(){
if(this.config.divId){
this.div=document.getElementById(this.config.divId);
}else{
this.div=Wikiwyg.createElementWithAttrs("div",{"class":"wikiwyg_toolbar",id:"wikiwyg_toolbar"});
}
var _3eb=this.config;
for(var i=0;i<_3eb.controlLayout.length;i++){
var _3ed=_3eb.controlLayout[i];
var _3ee=_3eb.controlLabels[_3ed];
if(_3ed=="save"){
this.addControlItem(_3ee,"saveChanges");
}else{
if(_3ed=="cancel"){
this.addControlItem(_3ee,"cancelEdit");
}else{
if(_3ed=="mode_selector"){
this.addModeSelector();
}else{
if(_3ed=="selector"){
this.add_styles();
}else{
if(_3ed=="help"){
this.add_help_button(_3ed,_3ee);
}else{
if(_3ed=="|"){
this.add_separator();
}else{
if(_3ed=="/"){
this.add_break();
}else{
this.add_button(_3ed,_3ee);
}
}
}
}
}
}
}
}
};
proto.enableThis=function(){
this.div.style.display="block";
};
proto.disableThis=function(){
this.div.style.display="none";
};
proto.make_button=function(type,_3f0){
var base=this.config.imagesLocation;
var ext=this.config.imagesExtension;
return Wikiwyg.createElementWithAttrs("img",{"class":"wikiwyg_button",onmouseup:"this.style.border='1px outset';",onmouseover:"this.style.border='1px outset';",onmouseout:"this.style.borderColor=this.style.backgroundColor;"+"this.style.borderStyle='solid';",onmousedown:"this.style.border='1px inset';",alt:_3f0,title:_3f0,src:base+type+ext});
};
proto.add_button=function(type,_3f4){
var img=this.make_button(type,_3f4);
var self=this;
img.onclick=function(){
self.wikiwyg.current_mode.process_command(type);
};
this.div.appendChild(img);
};
proto.add_help_button=function(type,_3f8){
var img=this.make_button(type,_3f8);
var a=Wikiwyg.createElementWithAttrs("a",{target:"wikiwyg_button",href:"http://www.wikiwyg.net/about/"});
a.appendChild(img);
this.div.appendChild(a);
};
proto.add_separator=function(){
var base=this.config.imagesLocation;
var ext=this.config.imagesExtension;
this.div.appendChild(Wikiwyg.createElementWithAttrs("img",{"class":"wikiwyg_separator",alt:" | ",title:"",src:base+"separator"+ext}));
};
proto.addControlItem=function(text,_3fe){
var span=Wikiwyg.createElementWithAttrs("span",{"class":"wikiwyg_control_link"});
var link=Wikiwyg.createElementWithAttrs("a",{href:"#"});
link.appendChild(document.createTextNode(text));
span.appendChild(link);
var self=this;
link.onclick=function(){
eval("self.wikiwyg."+_3fe+"()");
return false;
};
this.div.appendChild(span);
};
proto.resetModeSelector=function(){
if(this.firstModeRadio){
var temp=this.firstModeRadio.onclick;
this.firstModeRadio.onclick=null;
this.firstModeRadio.click();
this.firstModeRadio.onclick=temp;
}
};
proto.addModeSelector=function(){
var span=document.createElement("span");
var _404=Wikiwyg.createUniqueId();
for(var i=0;i<this.wikiwyg.config.modeClasses.length;i++){
var _406=this.wikiwyg.config.modeClasses[i];
var _407=this.wikiwyg.mode_objects[_406];
var _408=Wikiwyg.createUniqueId();
var _409=i==0?"checked":"";
var _40a=Wikiwyg.createElementWithAttrs("input",{type:"radio",name:_404,id:_408,value:_407.classname,"checked":_409});
if(!this.firstModeRadio){
this.firstModeRadio=_40a;
}
var self=this;
_40a.onclick=function(){
self.wikiwyg.switchMode(this.value);
};
var _40c=Wikiwyg.createElementWithAttrs("label",{"for":_408});
_40c.appendChild(document.createTextNode(_407.modeDescription));
span.appendChild(_40a);
span.appendChild(_40c);
}
this.div.appendChild(span);
};
proto.add_break=function(){
this.div.appendChild(document.createElement("br"));
};
proto.add_styles=function(){
var _40d=this.config.styleSelector;
var _40e=this.config.controlLabels;
this.styleSelect=document.createElement("select");
this.styleSelect.className="wikiwyg_selector";
if(this.config.selectorWidth){
this.styleSelect.style.width=this.config.selectorWidth;
}
for(var i=0;i<_40d.length;i++){
value=_40d[i];
var _410=Wikiwyg.createElementWithAttrs("option",{"value":value});
_410.appendChild(document.createTextNode(_40e[value]||value));
this.styleSelect.appendChild(_410);
}
var self=this;
this.styleSelect.onchange=function(){
self.set_style(this.value);
};
this.div.appendChild(this.styleSelect);
};
proto.set_style=function(_412){
var idx=this.styleSelect.selectedIndex;
if(idx!=0){
this.wikiwyg.current_mode.process_command(_412);
}
this.styleSelect.selectedIndex=0;
};
proto=new Subclass("Wikiwyg.Wysiwyg","Wikiwyg.Mode");
proto.classtype="wysiwyg";
proto.modeDescription="Wysiwyg";
proto.config={useParentStyles:true,useStyleMedia:"wikiwyg",iframeId:null,iframeObject:null,disabledToolbarButtons:[],editHeightMinimum:150,editHeightAdjustment:1.3,clearRegex:null};
proto.initializeObject=function(){
this.edit_iframe=this.get_edit_iframe();
this.div=this.edit_iframe;
this.set_design_mode_early();
};
proto.set_design_mode_early=function(){
};
proto.fromHtml=function(html){
var dom=document.createElement("div");
dom.innerHTML=html;
this.sanitize_dom(dom);
this.set_inner_html(dom.innerHTML);
};
proto.toHtml=function(func){
func(this.get_inner_html());
};
proto.fix_up_relative_imgs=function(){
var base=location.href.replace(/(.*?:\/\/.*?\/).*/,"$1");
var imgs=this.get_edit_document().getElementsByTagName("img");
for(var ii=0;ii<imgs.length;++ii){
imgs[ii].src=imgs[ii].src.replace(/^\//,base);
}
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.edit_iframe.style.border="1px black solid";
this.edit_iframe.width="100%";
this.setHeightOf(this.edit_iframe);
this.fix_up_relative_imgs();
this.get_edit_document().designMode="on";
this.apply_stylesheets();
this.enable_keybindings();
this.clear_inner_html();
};
proto.clear_inner_html=function(){
var _41a=this.get_inner_html();
var _41b=this.config.clearRegex;
if(_41b&&_41a.match(_41b)){
this.set_inner_html("");
}
};
proto.get_keybinding_area=function(){
return this.get_edit_document();
};
proto.get_edit_iframe=function(){
var _41c;
if(this.config.iframeId){
_41c=document.getElementById(this.config.iframeId);
_41c.iframe_hack=true;
}else{
if(this.config.iframeObject){
_41c=this.config.iframeObject;
_41c.iframe_hack=true;
}else{
_41c=document.createElement("iframe");
}
}
return _41c;
};
proto.get_edit_window=function(){
return this.edit_iframe.contentWindow;
};
proto.get_edit_document=function(){
return this.get_edit_window().document;
};
proto.get_inner_html=function(){
return this.get_edit_document().body.innerHTML;
};
proto.set_inner_html=function(html){
this.get_edit_document().body.innerHTML=html;
};
proto.apply_stylesheets=function(){
var _41e=document.styleSheets;
var head=this.get_edit_document().getElementsByTagName("head")[0];
for(var i=0;i<_41e.length;i++){
var _421=_41e[i];
if(_421.href==location.href){
this.apply_inline_stylesheet(_421,head);
}else{
if(this.should_link_stylesheet(_421)){
this.apply_linked_stylesheet(_421,head);
}
}
}
};
proto.apply_inline_stylesheet=function(_422,head){
var _424="";
for(var i=0;i<_422.cssRules.length;i++){
if(_422.cssRules[i].type==3){
_424+=Ajax.get(_422.cssRules[i].href);
}else{
_424+=_422.cssRules[i].cssText+"\n";
}
}
if(_424.length>0){
_424+="\nbody { padding: 5px; }\n";
this.append_inline_style_element(_424,head);
}
};
proto.append_inline_style_element=function(_426,head){
var _428=document.createElement("style");
_428.setAttribute("type","text/css");
if(_428.styleSheet){
_428.styleSheet.cssText=_426;
}else{
var _429=document.createTextNode(_426);
_428.appendChild(_429);
head.appendChild(_428);
}
};
proto.should_link_stylesheet=function(_42a,head){
return false;
var _42c=_42a.media;
var _42d=this.config;
var _42e=_42c.mediaText?_42c.mediaText:_42c;
var _42f=((!_42e||_42e=="screen")&&_42d.useParentStyles);
var _430=(_42e&&(_42e==_42d.useStyleMedia));
if(!_42f&&!_430){
return false;
}else{
return true;
}
};
proto.apply_linked_stylesheet=function(_431,head){
var link=Wikiwyg.createElementWithAttrs("link",{href:_431.href,type:_431.type,media:"screen",rel:"STYLESHEET"},this.get_edit_document());
head.appendChild(link);
};
proto.process_command=function(_434){
if(this["do_"+_434]){
this["do_"+_434](_434);
}
if(!Wikiwyg.is_ie){
this.get_edit_window().focus();
}
};
proto.exec_command=function(_435,_436){
this.get_edit_document().execCommand(_435,false,_436);
};
proto.format_command=function(_437){
this.exec_command("formatblock","<"+_437+">");
};
proto.do_bold=proto.exec_command;
proto.do_italic=proto.exec_command;
proto.do_underline=proto.exec_command;
proto.do_strike=function(){
this.exec_command("strikethrough");
};
proto.do_hr=function(){
this.exec_command("inserthorizontalrule");
};
proto.do_ordered=function(){
this.exec_command("insertorderedlist");
};
proto.do_unordered=function(){
this.exec_command("insertunorderedlist");
};
proto.do_indent=proto.exec_command;
proto.do_outdent=proto.exec_command;
proto.do_h1=proto.format_command;
proto.do_h2=proto.format_command;
proto.do_h3=proto.format_command;
proto.do_h4=proto.format_command;
proto.do_h5=proto.format_command;
proto.do_h6=proto.format_command;
proto.do_pre=proto.format_command;
proto.do_p=proto.format_command;
proto.do_table=function(){
var html="<table><tbody>"+"<tr><td>A</td>"+"<td>B</td>"+"<td>C</td></tr>"+"<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"+"<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>"+"</tbody></table>";
this.insert_html(html);
};
proto.insert_html=function(html){
this.get_edit_window().focus();
this.exec_command("inserthtml",html);
};
proto.do_unlink=proto.exec_command;
proto.do_link=function(){
var _43a=this.get_link_selection_text();
if(!_43a){
return;
}
var url;
var _43c=_43a.match(/(.*?)\b((?:http|https|ftp|irc|file):\/\/\S+)(.*)/);
if(_43c){
if(_43c[1]||_43c[3]){
return null;
}
url=_43c[2];
}else{
url=escape(_43a);
}
this.exec_command("createlink",url);
};
proto.do_www=function(){
var _43d=this.get_link_selection_text();
if(_43d!=null){
var url=prompt("Please enter a link","Type in your link here");
this.exec_command("createlink",url);
}
};
proto.get_selection_text=function(){
return this.get_edit_window().getSelection().toString();
};
proto.get_link_selection_text=function(){
var _43f=this.get_selection_text();
if(!_43f){
alert("Please select the text you would like to turn into a link.");
return;
}
return _43f;
};
if(Wikiwyg.is_ie){
proto.set_design_mode_early=function(_440){
this.get_edit_document().designMode="on";
};
proto.get_edit_window=function(){
return this.edit_iframe;
};
proto.get_edit_document=function(){
return this.edit_iframe.contentWindow.document;
};
proto.get_selection_text=function(){
var _441=this.get_edit_document().selection;
if(_441!=null){
return _441.createRange().htmlText;
}
return "";
};
proto.insert_html=function(html){
var doc=this.get_edit_document();
var _444=this.get_edit_document().selection.createRange();
if(_444.boundingTop==2&&_444.boundingLeft==2){
return;
}
_444.pasteHTML(html);
_444.collapse(false);
_444.select();
};
proto.enable_keybindings=function(){
};
}
proto=new Subclass("Wikiwyg.Wikitext","Wikiwyg.Mode");
klass=Wikiwyg.Wikitext;
proto.classtype="wikitext";
proto.modeDescription="Wikitext";
proto.config={textareaId:null,supportCamelCaseLinks:false,javascriptLocation:null,clearRegex:null,editHeightMinimum:10,editHeightAdjustment:1.3,markupRules:{link:["bound_phrase","[","]"],bold:["bound_phrase","*","*"],code:["bound_phrase","`","`"],italic:["bound_phrase","/","/"],underline:["bound_phrase","_","_"],strike:["bound_phrase","-","-"],p:["start_lines",""],pre:["start_lines","    "],h1:["start_line","= "],h2:["start_line","== "],h3:["start_line","=== "],h4:["start_line","==== "],h5:["start_line","===== "],h6:["start_line","====== "],ordered:["start_lines","#"],unordered:["start_lines","*"],indent:["start_lines",">"],hr:["line_alone","----"],table:["line_alone","| A | B | C |\n|   |   |   |\n|   |   |   |"],www:["bound_phrase","[","]"]}};
proto.initializeObject=function(){
this.initialize_object();
};
proto.initialize_object=function(){
this.div=document.createElement("div");
if(this.config.textareaId){
this.textarea=document.getElementById(this.config.textareaId);
}else{
this.textarea=document.createElement("textarea");
}
this.textarea.setAttribute("id","wikiwyg_wikitext_textarea");
this.div.appendChild(this.textarea);
this.area=this.textarea;
this.clear_inner_text();
};
proto.clear_inner_text=function(){
if(Wikiwyg.is_safari){
return;
}
var self=this;
this.area.onclick=function(){
var _446=self.area.value;
var _447=self.config.clearRegex;
if(_447&&_446.match(_447)){
self.area.value="";
}
};
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.textarea.style.width="100%";
this.setHeightOfEditor();
this.enable_keybindings();
};
proto.setHeightOfEditor=function(){
var _448=this.config;
var _449=_448.editHeightAdjustment;
var area=this.textarea;
if(Wikiwyg.is_safari){
return area.setAttribute("rows",25);
}
var text=this.getTextArea();
var rows=text.split(/\n/).length;
var _44d=parseInt(rows*_449);
if(_44d<_448.editHeightMinimum){
_44d=_448.editHeightMinimum;
}
area.setAttribute("rows",_44d);
};
proto.toWikitext=function(){
return this.getTextArea();
};
proto.toHtml=function(func){
var _44f=this.canonicalText();
this.convertWikitextToHtml(_44f,func);
};
proto.canonicalText=function(){
var _450=this.getTextArea();
if(_450[_450.length-1]!="\n"){
_450+="\n";
}
return _450;
};
proto.fromHtml=function(html){
this.setTextArea("Loading...");
var self=this;
this.convertHtmlToWikitext(html,function(_453){
self.setTextArea(_453);
});
};
proto.getTextArea=function(){
return this.textarea.value;
};
proto.setTextArea=function(text){
this.textarea.value=text;
};
proto.convertWikitextToHtml=function(_455,func){
alert("Wikitext changes cannot be converted to HTML\nWikiwyg.Wikitext.convertWikitextToHtml is not implemented here");
func(this.copyhtml);
};
proto.convertHtmlToWikitext=function(html,func){
func(this.convert_html_to_wikitext(html));
};
proto.get_keybinding_area=function(){
return this.textarea;
};
Wikiwyg.Wikitext.phrase_end_re=/[\s\.\:\;\,\!\?\(\)]/;
proto.find_left=function(t,_45a,_45b){
var _45c=t.substr(_45a-1,1);
var _45d=t.substr(_45a-2,1);
if(_45a==0){
return _45a;
}
if(_45c.match(_45b)){
if((_45c!=".")||(_45d.match(/\s/))){
return _45a;
}
}
return this.find_left(t,_45a-1,_45b);
};
proto.find_right=function(t,_45f,_460){
var _461=t.substr(_45f,1);
var _462=t.substr(_45f+1,1);
if(_45f>=t.length){
return _45f;
}
if(_461.match(_460)){
if((_461!=".")||(_462.match(/\s/))){
return _45f;
}
}
return this.find_right(t,_45f+1,_460);
};
proto.get_lines=function(){
t=this.area;
var _463=t.selectionStart;
var _464=t.selectionEnd;
if(_463==null){
_463=_464;
if(_463==null){
return false;
}
_463=_464=t.value.substr(0,_463).replace(/\r/g,"").length;
}
var _465=t.value.replace(/\r/g,"");
selection=_465.substr(_463,_464-_463);
_463=this.find_right(_465,_463,/[^\r\n]/);
_464=this.find_left(_465,_464,/[^\r\n]/);
this.selection_start=this.find_left(_465,_463,/[\r\n]/);
this.selection_end=this.find_right(_465,_464,/[\r\n]/);
t.setSelectionRange(_463,_464);
t.focus();
this.start=_465.substr(0,this.selection_start);
this.sel=_465.substr(this.selection_start,this.selection_end-this.selection_start);
this.finish=_465.substr(this.selection_end,_465.length);
return true;
};
proto.alarm_on=function(){
var area=this.area;
var _467=area.style.background;
area.style.background="#f88";
function alarm_off(){
area.style.background=_467;
}
window.setTimeout(alarm_off,250);
area.focus();
};
proto.get_words=function(){
function is_insane(_468){
return _468.match(/\r?\n(\r?\n|\*+ |\#+ |\=+ )/);
}
t=this.area;
var _469=t.selectionStart;
var _46a=t.selectionEnd;
if(_469==null){
_469=_46a;
if(_469==null){
return false;
}
_469=_46a=t.value.substr(0,_469).replace(/\r/g,"").length;
}
var _46b=t.value.replace(/\r/g,"");
selection=_46b.substr(_469,_46a-_469);
_469=this.find_right(_46b,_469,/(\S|\r?\n)/);
if(_469>_46a){
_469=_46a;
}
_46a=this.find_left(_46b,_46a,/(\S|\r?\n)/);
if(_46a<_469){
_46a=_469;
}
if(is_insane(selection)){
this.alarm_on();
return false;
}
this.selection_start=this.find_left(_46b,_469,Wikiwyg.Wikitext.phrase_end_re);
this.selection_end=this.find_right(_46b,_46a,Wikiwyg.Wikitext.phrase_end_re);
t.setSelectionRange(this.selection_start,this.selection_end);
t.focus();
this.start=_46b.substr(0,this.selection_start);
this.sel=_46b.substr(this.selection_start,this.selection_end-this.selection_start);
this.finish=_46b.substr(this.selection_end,_46b.length);
return true;
};
proto.markup_is_on=function(_46c,_46d){
return (this.sel.match(_46c)&&this.sel.match(_46d));
};
proto.clean_selection=function(_46e,_46f){
this.sel=this.sel.replace(_46e,"");
this.sel=this.sel.replace(_46f,"");
};
proto.toggle_same_format=function(_470,_471){
_470=this.clean_regexp(_470);
_471=this.clean_regexp(_471);
var _472=new RegExp("^"+_470);
var _473=new RegExp(_471+"$");
if(this.markup_is_on(_472,_473)){
this.clean_selection(_472,_473);
return true;
}
return false;
};
proto.clean_regexp=function(_474){
_474=_474.replace(/([\^\$\*\+\.\?\[\]\{\}])/g,"\\$1");
return _474;
};
proto.insert_text_at_cursor=function(text){
var t=this.area;
var _477=t.selectionStart;
var _478=t.selectionEnd;
if(_477==null){
_477=_478;
if(_477==null){
return false;
}
}
var _479=t.value.substr(0,_477);
var _47a=t.value.substr(_478,t.value.length);
t.value=_479+text+_47a;
};
proto.set_text_and_selection=function(text,_47c,end){
this.area.value=text;
this.area.setSelectionRange(_47c,end);
};
proto.add_markup_words=function(_47e,_47f,_480){
if(this.toggle_same_format(_47e,_47f)){
this.selection_end=this.selection_end-(_47e.length+_47f.length);
_47e="";
_47f="";
}
if(this.sel.length==0){
if(_480){
this.sel=_480;
}
var text=this.start+_47e+this.sel+_47f+this.finish;
var _482=this.selection_start+_47e.length;
var end=this.selection_end+_47e.length+this.sel.length;
this.set_text_and_selection(text,_482,end);
}else{
var text=this.start+_47e+this.sel+_47f+this.finish;
var _482=this.selection_start;
var end=this.selection_end+_47e.length+_47f.length;
this.set_text_and_selection(text,_482,end);
}
this.area.focus();
};
proto.add_markup_lines=function(_484){
var _485=new RegExp("^"+this.clean_regexp(_484),"gm");
var _486=/^(\^+|\=+|\*+|#+|>+|    )/gm;
var _487;
if(!_484.length){
this.sel=this.sel.replace(_486,"");
this.sel=this.sel.replace(/^\ +/gm,"");
}else{
if((_484=="    ")&&this.sel.match(/^\S/m)){
this.sel=this.sel.replace(/^/gm,_484);
}else{
if((!_484.match(/[\=\^]/))&&this.sel.match(_485)){
this.sel=this.sel.replace(_485,"");
if(_484!="    "){
this.sel=this.sel.replace(/^ */gm,"");
}
}else{
if(_487=this.sel.match(_486)){
if(_484=="    "){
this.sel=this.sel.replace(/^/gm,_484);
}else{
if(_484.match(/[\=\^]/)){
this.sel=this.sel.replace(_486,_484);
}else{
this.sel=this.sel.replace(_486,function(_488){
return _484.times(_488.length);
});
}
}
}else{
if(this.sel.length>0){
this.sel=this.sel.replace(/^(.*\S+)/gm,_484+" $1");
}else{
this.sel=_484+" ";
}
}
}
}
}
var text=this.start+this.sel+this.finish;
var _48a=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_48a,end);
this.area.focus();
};
proto.bound_markup_lines=function(_48c){
var _48d=_48c[1];
var _48e=_48c[2];
var _48f=new RegExp("^"+this.clean_regexp(_48d),"gm");
var _490=new RegExp(this.clean_regexp(_48e)+"$","gm");
var _491=/^(\^+|\=+|\*+|#+|>+) */gm;
var _492=/( +(\^+|\=+))?$/gm;
var _493;
if(this.sel.match(_48f)){
this.sel=this.sel.replace(_48f,"");
this.sel=this.sel.replace(_490,"");
}else{
if(_493=this.sel.match(_491)){
this.sel=this.sel.replace(_491,_48d);
this.sel=this.sel.replace(_492,_48e);
}else{
if(this.sel.length>0){
this.sel=this.sel.replace(/^(.*\S+)/gm,_48d+"$1"+_48e);
}else{
this.sel=_48d+_48e;
}
}
}
var text=this.start+this.sel+this.finish;
var _495=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_495,end);
this.area.focus();
};
proto.markup_bound_line=function(_497){
var _498=this.area.scrollTop;
if(this.get_lines()){
this.bound_markup_lines(_497);
}
this.area.scrollTop=_498;
};
proto.markup_start_line=function(_499){
var _49a=_499[1];
_49a=_49a.replace(/ +/,"");
var _49b=this.area.scrollTop;
if(this.get_lines()){
this.add_markup_lines(_49a);
}
this.area.scrollTop=_49b;
};
proto.markup_start_lines=function(_49c){
var _49d=_49c[1];
var _49e=this.area.scrollTop;
if(this.get_lines()){
this.add_markup_lines(_49d);
}
this.area.scrollTop=_49e;
};
proto.markup_bound_phrase=function(_49f){
var _4a0=_49f[1];
var _4a1=_49f[2];
var _4a2=this.area.scrollTop;
if(_4a1=="undefined"){
_4a1=_4a0;
}
if(this.get_words()){
this.add_markup_words(_4a0,_4a1,null);
}
this.area.scrollTop=_4a2;
};
klass.make_do=function(_4a3){
return function(){
var _4a4=this.config.markupRules[_4a3];
var _4a5=_4a4[0];
if(!this["markup_"+_4a5]){
die("No handler for markup: \""+_4a5+"\"");
}
this["markup_"+_4a5](_4a4);
};
};
proto.do_link=klass.make_do("link");
proto.do_bold=klass.make_do("bold");
proto.do_code=klass.make_do("code");
proto.do_italic=klass.make_do("italic");
proto.do_underline=klass.make_do("underline");
proto.do_strike=klass.make_do("strike");
proto.do_p=klass.make_do("p");
proto.do_pre=klass.make_do("pre");
proto.do_h1=klass.make_do("h1");
proto.do_h2=klass.make_do("h2");
proto.do_h3=klass.make_do("h3");
proto.do_h4=klass.make_do("h4");
proto.do_h5=klass.make_do("h5");
proto.do_h6=klass.make_do("h6");
proto.do_ordered=klass.make_do("ordered");
proto.do_unordered=klass.make_do("unordered");
proto.do_hr=klass.make_do("hr");
proto.do_table=klass.make_do("table");
proto.do_www=function(){
var url=prompt("Please enter a link","Type in your link here");
var old=this.config.markupRules.www[1];
this.config.markupRules.www[1]+=url+" ";
var _4a8=this.config.markupRules["www"];
var _4a9=_4a8[0];
if(!this["markup_"+_4a9]){
die("No handler for markup: \""+_4a9+"\"");
}
this["markup_"+_4a9](_4a8);
this.config.markupRules.www[1]=old;
};
proto.selection_mangle=function(_4aa){
var _4ab=this.area.scrollTop;
if(!this.get_lines()){
this.area.scrollTop=_4ab;
return;
}
if(_4aa(this)){
var text=this.start+this.sel+this.finish;
var _4ad=this.selection_start;
var end=this.selection_start+this.sel.length;
this.set_text_and_selection(text,_4ad,end);
}
this.area.focus();
};
proto.do_indent=function(){
this.selection_mangle(function(that){
if(that.sel==""){
return false;
}
that.sel=that.sel.replace(/^(([\*\-\#])+(?=\s))/gm,"$2$1");
that.sel=that.sel.replace(/^([\>\=])/gm,"$1$1");
that.sel=that.sel.replace(/^([^\>\*\-\#\=\r\n])/gm,"> $1");
that.sel=that.sel.replace(/^\={7,}/gm,"======");
return true;
});
};
proto.do_outdent=function(){
this.selection_mangle(function(that){
if(that.sel==""){
return false;
}
that.sel=that.sel.replace(/^([\>\*\-\#\=] ?)/gm,"");
return true;
});
};
proto.do_unlink=function(){
this.selection_mangle(function(that){
that.sel=that.kill_linkedness(that.sel);
return true;
});
};
proto.kill_linkedness=function(str){
while(str.match(/\[.*\]/)){
str=str.replace(/\[(.*?)\]/,"$1");
}
str=str.replace(/^(.*)\]/,"] $1");
str=str.replace(/\[(.*)$/,"$1 [");
return str;
};
proto.markup_line_alone=function(_4b3){
var t=this.area;
var _4b5=t.scrollTop;
var _4b6=t.selectionStart;
var _4b7=t.selectionEnd;
if(_4b6==null){
_4b6=_4b7;
}
var text=t.value;
this.selection_start=this.find_right(text,_4b6,/\r?\n/);
this.selection_end=this.selection_start;
t.setSelectionRange(this.selection_start,this.selection_start);
t.focus();
var _4b9=_4b3[1];
this.start=t.value.substr(0,this.selection_start);
this.finish=t.value.substr(this.selection_end,t.value.length);
var text=this.start+"\n"+_4b9+this.finish;
var _4ba=this.selection_start+_4b9.length+1;
var end=this.selection_end+_4b9.length+1;
this.set_text_and_selection(text,_4ba,end);
t.scrollTop=_4b5;
};
proto.convert_html_to_wikitext=function(html){
this.copyhtml=html;
var dom=document.createElement("div");
dom.innerHTML=html;
this.output=[];
this.list_type=[];
this.indent_level=0;
this.no_collapse_text=false;
this.normalizeDomWhitespace(dom);
this.normalizeDomStructure(dom);
this.walk(dom);
this.assert_new_line();
return this.join_output(this.output);
};
proto.normalizeDomStructure=function(dom){
this.normalize_styled_blocks(dom,"p");
this.normalize_styled_lists(dom,"ol");
this.normalize_styled_lists(dom,"ul");
this.normalize_styled_blocks(dom,"li");
this.normalize_span_whitespace(dom,"span");
};
proto.normalize_span_whitespace=function(dom,tag){
var grep=function(_4c2){
return Boolean(_4c2.getAttribute("style"));
};
var _4c3=this.array_elements_by_tag_name(dom,tag,grep);
for(var i=0;i<_4c3.length;i++){
var _4c5=_4c3[i];
var node=_4c5.firstChild;
while(node){
if(node.nodeType==3){
node.nodeValue=node.nodeValue.replace(/^\n+/,"");
break;
}
node=node.nextSibling;
}
var node=_4c5.lastChild;
while(node){
if(node.nodeType==3){
node.nodeValue=node.nodeValue.replace(/\n+$/,"");
break;
}
node=node.previousSibling;
}
}
};
proto.normalize_styled_blocks=function(dom,tag){
var _4c9=this.array_elements_by_tag_name(dom,tag);
for(var i=0;i<_4c9.length;i++){
var _4cb=_4c9[i];
var _4cc=_4cb.getAttribute("style");
if(!_4cc){
continue;
}
_4cb.removeAttribute("style");
_4cb.innerHTML="<span style=\""+_4cc+"\">"+_4cb.innerHTML+"</span>";
}
};
proto.normalize_styled_lists=function(dom,tag){
var _4cf=this.array_elements_by_tag_name(dom,tag);
for(var i=0;i<_4cf.length;i++){
var _4d1=_4cf[i];
var _4d2=_4d1.getAttribute("style");
if(!_4d2){
continue;
}
_4d1.removeAttribute("style");
var _4d3=_4d1.getElementsByTagName("li");
for(var j=0;j<_4d3.length;j++){
_4d3[j].innerHTML="<span style=\""+_4d2+"\">"+_4d3[j].innerHTML+"</span>";
}
}
};
proto.array_elements_by_tag_name=function(dom,tag,grep){
var _4d8=dom.getElementsByTagName(tag);
var _4d9=[];
for(var i=0;i<_4d8.length;i++){
if(grep&&!grep(_4d8[i])){
continue;
}
_4d9.push(_4d8[i]);
}
return _4d9;
};
proto.normalizeDomWhitespace=function(dom){
var tags=["span","strong","em","strike","del","tt"];
for(var ii=0;ii<tags.length;ii++){
var _4de=dom.getElementsByTagName(tags[ii]);
for(var i=0;i<_4de.length;i++){
this.normalizePhraseWhitespace(_4de[i]);
}
}
this.normalizeNewlines(dom,["br","blockquote"],"nextSibling");
this.normalizeNewlines(dom,["p","div","blockquote"],"firstChild");
};
proto.normalizeNewlines=function(dom,tags,_4e2){
for(var ii=0;ii<tags.length;ii++){
var _4e4=dom.getElementsByTagName(tags[ii]);
for(var jj=0;jj<_4e4.length;jj++){
var _4e6=_4e4[jj][_4e2];
if(_4e6&&_4e6.nodeType=="3"){
_4e6.nodeValue=_4e6.nodeValue.replace(/^\n/,"");
}
}
}
};
proto.normalizePhraseWhitespace=function(_4e7){
if(this.elementHasComment(_4e7)){
return;
}
var _4e8=this.getFirstTextNode(_4e7);
var _4e9=this.getPreviousTextNode(_4e7);
var _4ea=this.getLastTextNode(_4e7);
var _4eb=this.getNextTextNode(_4e7);
if(this.destroyPhraseMarkup(_4e7)){
return;
}
if(_4e8&&_4e8.nodeValue.match(/^ /)){
_4e8.nodeValue=_4e8.nodeValue.replace(/^ +/,"");
if(_4e9&&!_4e9.nodeValue.match(/ $/)){
_4e9.nodeValue=_4e9.nodeValue+" ";
}
}
if(_4ea&&_4ea.nodeValue.match(/ $/)){
_4ea.nodeValue=_4ea.nodeValue.replace(/ $/,"");
if(_4eb&&!_4eb.nodeValue.match(/^ /)){
_4eb.nodeValue=" "+_4eb.nodeValue;
}
}
};
proto.elementHasComment=function(_4ec){
var node=_4ec.lastChild;
return node&&(node.nodeType==8);
};
proto.destroyPhraseMarkup=function(_4ee){
if(this.start_is_no_good(_4ee)||this.end_is_no_good(_4ee)){
return this.destroyElement(_4ee);
}
return false;
};
proto.start_is_no_good=function(_4ef){
var _4f0=this.getFirstTextNode(_4ef);
var _4f1=this.getPreviousTextNode(_4ef);
if(!_4f0){
return true;
}
if(_4f0.nodeValue.match(/^ /)){
return false;
}
if(!_4f1||_4f1.nodeValue=="\n"){
return false;
}
return !_4f1.nodeValue.match(/[ "]$/);
};
proto.end_is_no_good=function(_4f2){
var _4f3=this.getLastTextNode(_4f2);
var _4f4=this.getNextTextNode(_4f2);
for(var n=_4f2;n&&n.nodeType!=3;n=n.lastChild){
if(n.nodeType==8){
return false;
}
}
if(!_4f3){
return true;
}
if(_4f3.nodeValue.match(/ $/)){
return false;
}
if(!_4f4||_4f4.nodeValue=="\n"){
return false;
}
return !_4f4.nodeValue.match(/^[ ."\n]/);
};
proto.destroyElement=function(_4f6){
var span=document.createElement("font");
span.innerHTML=_4f6.innerHTML;
_4f6.parentNode.replaceChild(span,_4f6);
return true;
};
proto.getFirstTextNode=function(_4f8){
for(node=_4f8;node&&node.nodeType!=3;node=node.firstChild){
}
return node;
};
proto.getLastTextNode=function(_4f9){
for(node=_4f9;node&&node.nodeType!=3;node=node.lastChild){
}
return node;
};
proto.getPreviousTextNode=function(_4fa){
var node=_4fa.previousSibling;
if(node&&node.nodeType!=3){
node=null;
}
return node;
};
proto.getNextTextNode=function(_4fc){
var node=_4fc.nextSibling;
if(node&&node.nodeType!=3){
node=null;
}
return node;
};
proto.appendOutput=function(_4fe){
this.output.push(_4fe);
};
proto.join_output=function(_4ff){
var list=this.remove_stops(_4ff);
list=this.cleanup_output(list);
return list.join("");
};
proto.cleanup_output=function(list){
return list;
};
proto.remove_stops=function(list){
var _503=[];
for(var i=0;i<list.length;i++){
if(typeof (list[i])!="string"){
continue;
}
_503.push(list[i]);
}
return _503;
};
proto.walk=function(_505){
if(!_505){
return;
}
for(var part=_505.firstChild;part;part=part.nextSibling){
if(part.nodeType==1){
this.dispatch_formatter(part);
}else{
if(part.nodeType==3){
if(part.nodeValue.match(/[^\n]/)&&!part.nodeValue.match(/^\n[\ \t]*$/)){
if(this.no_collapse_text){
this.appendOutput(part.nodeValue);
}else{
this.appendOutput(this.collapse(part.nodeValue));
}
}
}
}
}
this.no_collapse_text=false;
};
proto.dispatch_formatter=function(_507){
var _508="format_"+_507.nodeName.toLowerCase();
if(!this[_508]){
_508="handle_undefined";
}
this[_508](_507);
};
proto.skip=function(){
};
proto.pass=function(_509){
this.walk(_509);
};
proto.handle_undefined=function(_50a){
this.appendOutput("<"+_50a.nodeName+">");
this.walk(_50a);
this.appendOutput("</"+_50a.nodeName+">");
};
proto.handle_undefined=proto.skip;
proto.format_abbr=proto.pass;
proto.format_acronym=proto.pass;
proto.format_address=proto.pass;
proto.format_applet=proto.skip;
proto.format_area=proto.skip;
proto.format_basefont=proto.skip;
proto.format_base=proto.skip;
proto.format_bgsound=proto.skip;
proto.format_big=proto.pass;
proto.format_blink=proto.pass;
proto.format_body=proto.pass;
proto.format_br=proto.skip;
proto.format_button=proto.skip;
proto.format_caption=proto.pass;
proto.format_center=proto.pass;
proto.format_cite=proto.pass;
proto.format_col=proto.pass;
proto.format_colgroup=proto.pass;
proto.format_dd=proto.pass;
proto.format_dfn=proto.pass;
proto.format_dl=proto.pass;
proto.format_dt=proto.pass;
proto.format_embed=proto.skip;
proto.format_field=proto.skip;
proto.format_fieldset=proto.skip;
proto.format_font=proto.pass;
proto.format_form=proto.skip;
proto.format_frame=proto.skip;
proto.format_frameset=proto.skip;
proto.format_head=proto.skip;
proto.format_html=proto.pass;
proto.format_iframe=proto.pass;
proto.format_input=proto.skip;
proto.format_ins=proto.pass;
proto.format_isindex=proto.skip;
proto.format_label=proto.skip;
proto.format_legend=proto.skip;
proto.format_link=proto.skip;
proto.format_map=proto.skip;
proto.format_marquee=proto.skip;
proto.format_meta=proto.skip;
proto.format_multicol=proto.pass;
proto.format_nobr=proto.skip;
proto.format_noembed=proto.skip;
proto.format_noframes=proto.skip;
proto.format_nolayer=proto.skip;
proto.format_noscript=proto.skip;
proto.format_nowrap=proto.skip;
proto.format_object=proto.skip;
proto.format_optgroup=proto.skip;
proto.format_option=proto.skip;
proto.format_param=proto.skip;
proto.format_select=proto.skip;
proto.format_small=proto.pass;
proto.format_spacer=proto.skip;
proto.format_style=proto.skip;
proto.format_sub=proto.pass;
proto.format_submit=proto.skip;
proto.format_sup=proto.pass;
proto.format_tbody=proto.pass;
proto.format_textarea=proto.skip;
proto.format_tfoot=proto.pass;
proto.format_thead=proto.pass;
proto.format_wiki=proto.pass;
proto.format_www=proto.skip;
proto.format_img=function(_50b){
var uri=_50b.getAttribute("src");
if(uri){
this.assert_space_or_newline();
this.appendOutput(uri);
}
};
proto.format_blockquote=function(_50d){
var _50e=parseInt(_50d.style.marginLeft);
var _50f=0;
if(_50e){
_50f+=parseInt(_50e/40);
}
if(_50d.tagName.toLowerCase()=="blockquote"){
_50f+=1;
}
if(!this.indent_level){
this.first_indent_line=true;
}
this.indent_level+=_50f;
this.output=defang_last_string(this.output);
this.assert_new_line();
this.walk(_50d);
this.indent_level-=_50f;
if(!this.indent_level){
this.assert_blank_line();
}else{
this.assert_new_line();
}
function defang_last_string(_510){
function non_string(a){
return typeof (a)!="string";
}
var rev=_510.slice().reverse();
var _513=takeWhile(non_string,rev);
var _514=dropWhile(non_string,rev);
if(_514.length){
_514[0].replace(/^>+/,"");
}
return _513.concat(_514).reverse();
}
};
proto.format_div=function(_515){
if(this.is_opaque(_515)){
this.handle_opaque_block(_515);
return;
}
if(this.is_indented(_515)){
this.format_blockquote(_515);
return;
}
this.walk(_515);
};
proto.format_span=function(_516){
if(this.is_opaque(_516)){
this.handle_opaque_phrase(_516);
return;
}
var _517=_516.getAttribute("style");
if(!_517){
this.pass(_516);
return;
}
if(!this.element_has_text_content(_516)&&!this.element_has_only_image_content(_516)){
return;
}
var _518=["line-through","bold","italic","underline"];
for(var i=0;i<_518.length;i++){
this.check_style_and_maybe_mark_up(_517,_518[i],1);
}
this.no_following_whitespace();
this.walk(_516);
for(var i=_518.length;i>=0;i--){
this.check_style_and_maybe_mark_up(_517,_518[i],2);
}
};
proto.element_has_text_content=function(_51a){
return _51a.innerHTML.replace(/<.*?>/g,"").replace(/&nbsp;/g,"").match(/\S/);
};
proto.element_has_only_image_content=function(_51b){
return _51b.childNodes.length==1&&_51b.firstChild.nodeType==1&&_51b.firstChild.tagName.toLowerCase()=="img";
};
proto.check_style_and_maybe_mark_up=function(_51c,_51d,_51e){
var _51f=_51d;
if(_51f=="line-through"){
_51f="strike";
}
if(this.check_style_for_attribute(_51c,_51d)){
this.appendOutput(this.config.markupRules[_51f][_51e]);
}
};
proto.check_style_for_attribute=function(_520,_521){
var _522=this.squish_style_object_into_string(_520);
return _522.match("\\b"+_521+"\\b");
};
proto.squish_style_object_into_string=function(_523){
if((_523.constructor+"").match("String")){
return _523;
}
var _524=[["font","weight"],["font","style"],["text","decoration"]];
var _525="";
for(var i=0;i<_524.length;i++){
var pair=_524[i];
var css=pair[0]+"-"+pair[1];
var js=pair[0]+pair[1].ucFirst();
_525+=css+": "+_523[js]+"; ";
}
return _525;
};
proto.basic_formatter=function(_52a,_52b){
var _52c=this.config.markupRules[_52b];
var _52d=_52c[0];
this["handle_"+_52d](_52a,_52c);
};
klass.make_empty_formatter=function(_52e){
return function(_52f){
this.basic_formatter(_52f,_52e);
};
};
klass.make_formatter=function(_530){
return function(_531){
if(this.element_has_text_content(_531)){
this.basic_formatter(_531,_530);
}
};
};
proto.format_b=klass.make_formatter("bold");
proto.format_strong=proto.format_b;
proto.format_code=klass.make_formatter("code");
proto.format_kbd=proto.format_code;
proto.format_samp=proto.format_code;
proto.format_tt=proto.format_code;
proto.format_var=proto.format_code;
proto.format_i=klass.make_formatter("italic");
proto.format_em=proto.format_i;
proto.format_u=klass.make_formatter("underline");
proto.format_strike=klass.make_formatter("strike");
proto.format_del=proto.format_strike;
proto.format_s=proto.format_strike;
proto.format_hr=klass.make_empty_formatter("hr");
proto.format_h1=klass.make_formatter("h1");
proto.format_h2=klass.make_formatter("h2");
proto.format_h3=klass.make_formatter("h3");
proto.format_h4=klass.make_formatter("h4");
proto.format_h5=klass.make_formatter("h5");
proto.format_h6=klass.make_formatter("h6");
proto.format_pre=klass.make_formatter("pre");
proto.format_p=function(_532){
if(this.is_indented(_532)){
this.format_blockquote(_532);
return;
}
this.assert_blank_line();
this.walk(_532);
this.assert_blank_line();
};
proto.format_a=function(_533){
var _534=Wikiwyg.htmlUnescape(_533.innerHTML);
_534=_534.replace(/<[^>]*?>/g," ");
_534=_534.replace(/\s+/g," ");
_534=_534.replace(/^\s+/,"");
_534=_534.replace(/\s+$/,"");
var href=_533.getAttribute("href");
if(!href){
href="";
}
this.make_wikitext_link(_534,href,_533);
};
proto.format_table=function(_536){
this.assert_blank_line();
this.walk(_536);
this.assert_blank_line();
};
proto.format_tr=function(_537){
this.walk(_537);
this.appendOutput("|");
this.insert_new_line();
};
proto.format_td=function(_538){
this.appendOutput("| ");
this.no_following_whitespace();
this.walk(_538);
this.chomp();
this.appendOutput(" ");
};
proto.format_th=proto.format_td;
function takeWhile(f,a){
for(var i=0;i<a.length;++i){
if(!f(a[i])){
break;
}
}
return a.slice(0,i);
}
function dropWhile(f,a){
for(var i=0;i<a.length;++i){
if(!f(a[i])){
break;
}
}
return a.slice(i);
}
proto.previous_line=function(){
function newline(s){
return s["match"]&&s.match(/\n/);
}
function non_newline(s){
return !newline(s);
}
return this.join_output(takeWhile(non_newline,dropWhile(newline,this.output.slice().reverse())).reverse());
};
proto.make_list=function(_541,_542){
if(!this.previous_was_newline_or_start()){
this.insert_new_line();
}
this.list_type.push(_542);
this.walk(_541);
this.list_type.pop();
if(this.list_type.length==0){
this.assert_blank_line();
}
};
proto.format_ol=function(_543){
this.make_list(_543,"ordered");
};
proto.format_ul=function(_544){
this.make_list(_544,"unordered");
};
proto.format_li=function(_545){
var _546=this.list_type.length;
if(!_546){
die("Wikiwyg list error");
}
var type=this.list_type[_546-1];
var _548=this.config.markupRules[type];
this.appendOutput(_548[1].times(_546)+" ");
if(Wikiwyg.is_ie&&_545.firstChild&&_545.firstChild.nextSibling&&_545.firstChild.nextSibling.nodeName.match(/^[uo]l$/i)){
try{
_545.firstChild.nodeValue=_545.firstChild.nodeValue.replace(/ $/,"");
}
catch(e){
}
}
this.walk(_545);
this.chomp();
this.insert_new_line();
};
proto.chomp=function(){
var _549;
while(this.output.length){
_549=this.output.pop();
if(typeof (_549)!="string"){
this.appendOutput(_549);
return;
}
if(!_549.match(/^\n+>+ $/)&&_549.match(/\S/)){
break;
}
}
if(_549){
_549=_549.replace(/[\r\n\s]+$/,"");
this.appendOutput(_549);
}
};
proto.collapse=function(_54a){
return _54a.replace(/[ \u00a0\r\n]+/g," ");
};
proto.trim=function(_54b){
return _54b.replace(/^\s+/,"");
};
proto.insert_new_line=function(){
var fang="";
var _54d=this.config.markupRules.indent[1];
var _54e="\n";
if(this.indent_level>0){
fang=_54d.times(this.indent_level);
if(fang.length){
fang+=" ";
}
}
if(fang.length&&this.first_indent_line){
this.first_indent_line=false;
_54e=_54e+_54e;
}
if(this.output.length){
this.appendOutput(_54e+fang);
}else{
if(fang.length){
this.appendOutput(fang);
}
}
};
proto.previous_was_newline_or_start=function(){
for(var ii=this.output.length-1;ii>=0;ii--){
var _550=this.output[ii];
if(typeof (_550)!="string"){
continue;
}
return _550.match(/\n$/);
}
return true;
};
proto.assert_new_line=function(){
this.chomp();
this.insert_new_line();
};
proto.assert_blank_line=function(){
if(!this.should_whitespace()){
return;
}
this.chomp();
this.insert_new_line();
this.insert_new_line();
};
proto.assert_space_or_newline=function(){
if(!this.output.length||!this.should_whitespace()){
return;
}
if(!this.previous_output().match(/(\s+|[\(])$/)){
this.appendOutput(" ");
}
};
proto.no_following_whitespace=function(){
this.appendOutput({whitespace:"stop"});
};
proto.should_whitespace=function(){
return !this.previous_output().whitespace;
};
proto.previous_output=function(_551){
if(!_551){
_551=1;
}
var _552=this.output.length;
return _552&&_551<=_552?this.output[_552-_551]:"";
};
proto.handle_bound_phrase=function(_553,_554){
if(!this.element_has_text_content(_553)){
return;
}
if(_553.innerHTML.match(/^\s*<br\s*\/?\s*>/)){
this.appendOutput("\n");
_553.innerHTML=_553.innerHTML.replace(/^\s*<br\s*\/?\s*>/,"");
}
this.appendOutput(_554[1]);
this.no_following_whitespace();
this.walk(_553);
this.appendOutput(_554[2]);
};
proto.handle_bound_line=function(_555,_556){
this.assert_blank_line();
this.appendOutput(_556[1]);
this.walk(_555);
this.appendOutput(_556[2]);
this.assert_blank_line();
};
proto.handle_start_line=function(_557,_558){
this.assert_blank_line();
this.appendOutput(_558[1]);
this.walk(_557);
this.assert_blank_line();
};
proto.handle_start_lines=function(_559,_55a){
var text=_559.firstChild.nodeValue;
if(!text){
return;
}
this.assert_blank_line();
text=text.replace(/^/mg,_55a[1]);
this.appendOutput(text);
this.assert_blank_line();
};
proto.handle_line_alone=function(_55c,_55d){
this.assert_blank_line();
this.appendOutput(_55d[1]);
this.assert_blank_line();
};
proto.COMMENT_NODE_TYPE=8;
proto.get_wiki_comment=function(_55e){
for(var node=_55e.firstChild;node;node=node.nextSibling){
if(node.nodeType==this.COMMENT_NODE_TYPE&&node.data.match(/^\s*wiki/)){
return node;
}
}
return null;
};
proto.is_indented=function(_560){
var _561=parseInt(_560.style.marginLeft);
return _561>0;
};
proto.is_opaque=function(_562){
var _563=this.get_wiki_comment(_562);
if(!_563){
return false;
}
var text=_563.data;
if(text.match(/^\s*wiki:/)){
return true;
}
return false;
};
proto.handle_opaque_phrase=function(_565){
var _566=this.get_wiki_comment(_565);
if(_566){
var text=_566.data;
text=text.replace(/^ wiki:\s+/,"").replace(/-=/g,"-").replace(/==/g,"=").replace(/\s$/,"").replace(/\{(\w+):\s*\}/,"{$1}");
this.appendOutput(Wikiwyg.htmlUnescape(text));
this.smart_trailing_space(_565);
}
};
proto.smart_trailing_space=function(_568){
var next=_568.nextSibling;
if(!next){
}else{
if(next.nodeType==1){
if(next.nodeName=="BR"){
var nn=next.nextSibling;
if(!(nn&&nn.nodeType==1&&nn.nodeName=="SPAN")){
this.appendOutput("\n");
}
}else{
this.appendOutput(" ");
}
}else{
if(next.nodeType==3){
if(!next.nodeValue.match(/^\s/)){
this.no_following_whitespace();
}
}
}
}
};
proto.handle_opaque_block=function(_56b){
var _56c=this.get_wiki_comment(_56b);
if(!_56c){
return;
}
var text=_56c.data;
text=text.replace(/^\s*wiki:\s+/,"");
this.appendOutput(text);
};
proto.make_wikitext_link=function(_56e,href,_570){
var _571=this.config.markupRules.link[1];
var _572=this.config.markupRules.link[2];
if(this.looks_like_a_url(href)){
_571=this.config.markupRules.www[1];
_572=this.config.markupRules.www[2];
}
this.assert_space_or_newline();
if(!href){
this.appendOutput(_56e);
}else{
if(href==_56e){
this.appendOutput(href);
}else{
if(this.href_is_wiki_link(href)){
if(this.camel_case_link(_56e)){
this.appendOutput(_56e);
}else{
this.appendOutput(_571+_56e+_572);
}
}else{
this.appendOutput(_571+href+" "+_56e+_572);
}
}
}
};
proto.camel_case_link=function(_573){
if(!this.config.supportCamelCaseLinks){
return false;
}
return _573.match(/[a-z][A-Z]/);
};
proto.href_is_wiki_link=function(href){
if(!this.looks_like_a_url(href)){
return true;
}
if(!href.match(/\?/)){
return false;
}
if(href.match(/\/static\/\d+\.\d+\.\d+\.\d+\//)){
href=location.href;
}
var _575=href.split("?")[0];
var _576=location.href.split("?")[0];
if(_576==location.href){
_576=location.href.replace(new RegExp(location.hash),"");
}
return _575==_576;
};
proto.looks_like_a_url=function(_577){
return _577.match(/^(http|https|ftp|irc|mailto|file):/);
};
if(Wikiwyg.is_ie){
proto.setHeightOf=function(){
this.textarea.style.height="200px";
};
proto.initializeObject=function(){
this.initialize_object();
this.area.addBehavior(this.config.javascriptLocation+"Selection.htc");
};
}
proto=new Subclass("Wikiwyg.Preview","Wikiwyg.Mode");
proto.classtype="preview";
proto.modeDescription="Preview";
proto.config={divId:null};
proto.initializeObject=function(){
if(this.config.divId){
this.div=document.getElementById(this.config.divId);
}else{
this.div=document.createElement("div");
}
this.div.style.backgroundColor="lightyellow";
};
proto.fromHtml=function(html){
this.div.innerHTML=html;
};
proto.toHtml=function(func){
func(this.div.innerHTML);
};
proto.disableStarted=function(){
this.wikiwyg.divHeight=this.div.offsetHeight;
};
function addEvent(name,func){
if(window.addEventListener){
name=name.replace(/^on/,"");
window.addEventListener(name,func,false);
}else{
if(window.attachEvent){
window.attachEvent(name,func);
}
}
}
function grepElementsByTag(tag,func){
var _57e=document.getElementsByTagName(tag);
var list=[];
for(var i=0;i<_57e.length;i++){
var _581=_57e[i];
if(func(_581)){
list.push(_581);
}
}
return list;
}
function getStyle(oElm,_583){
var _584="";
if(document.defaultView&&document.defaultView.getComputedStyle){
_584=document.defaultView.getComputedStyle(oElm,"").getPropertyValue(_583);
}else{
if(oElm.currentStyle){
_583=_583.replace(/\-(\w)/g,function(_585,p1){
return p1.toUpperCase();
});
_584=oElm.currentStyle[_583];
}
}
return _584;
}
Cookie={};
Cookie.get=function(name){
var _588=document.cookie.indexOf(name+"=");
if(_588==-1){
return null;
}
var _589=document.cookie.indexOf("=",_588)+1;
var _58a=document.cookie.indexOf(";",_589);
if(_58a==-1){
_58a=document.cookie.length;
}
var val=document.cookie.substring(_589,_58a);
return val==null?null:unescape(document.cookie.substring(_589,_58a));
};
Cookie.set=function(name,val,_58e){
if(typeof (_58e)=="undefined"){
_58e=new Date(new Date().getTime()+25*365*24*60*60*1000);
}
var str=name+"="+escape(val)+"; expires="+_58e.toGMTString();
document.cookie=str;
};
Cookie.del=function(name){
Cookie.set(name,"",new Date(new Date().getTime()-1));
};
if(typeof Wait=="undefined"){
Wait={};
}
Wait.VERSION=0.01;
Wait.EXPORT=["wait"];
Wait.EXPORT_TAGS={":all":Wait.EXPORT};
Wait.interval=100;
Wait.wait=function(arg1,arg2,arg3,arg4){
if(typeof arg1=="function"&&typeof arg2=="function"&&typeof arg3=="function"){
return Wait._wait3(arg1,arg2,arg3,arg4);
}
if(typeof arg1=="function"&&typeof arg2=="function"){
return Wait._wait2(arg1,arg2,arg3);
}
};
Wait._wait2=function(test,_596,max){
Wait._wait3(test,_596,function(){
},max);
};
Wait._wait3=function(test,_599,_59a,max){
var func=function(){
var _59d=Wait.interval;
var _59e=0;
var _59f;
var _5a0=function(){
if(test()){
_599();
clearInterval(_59f);
}
_59e+=_59d;
if(typeof max=="number"){
if(_59e>=max){
if(typeof _59a=="function"){
_59a();
}
clearInterval(_59f);
}
}
};
_59f=setInterval(_5a0,_59d);
};
func();
};
window.wait=Wait.wait;
if(!this.Ajax){
Ajax={};
}
Ajax.get=function(url,_5a2){
var req=new XMLHttpRequest();
req.open("GET",url,Boolean(_5a2));
return Ajax._send(req,null,_5a2);
};
Ajax.post=function(url,data,_5a6){
var req=new XMLHttpRequest();
req.open("POST",url,Boolean(_5a6));
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
return Ajax._send(req,data,_5a6);
};
Ajax._send=function(req,data,_5aa){
if(_5aa){
req.onreadystatechange=function(){
if(req.readyState==4){
if(req.status==200){
_5aa(req.responseText);
}
}
};
}
req.send(data);
if(!_5aa){
if(req.status!=200){
throw ("Request for \""+url+"\" failed with status: "+req.status);
}
return req.responseText;
}
};
if(window.ActiveXObject&&!window.XMLHttpRequest){
window.XMLHttpRequest=function(){
return new ActiveXObject((navigator.userAgent.toLowerCase().indexOf("msie 5")!=-1)?"Microsoft.XMLHTTP":"Msxml2.XMLHTTP");
};
}
if(window.opera&&!window.XMLHttpRequest){
window.XMLHttpRequest=function(){
this.readyState=0;
this.status=0;
this.statusText="";
this._headers=[];
this._aborted=false;
this._async=true;
this.abort=function(){
this._aborted=true;
};
this.getAllResponseHeaders=function(){
return this.getAllResponseHeader("*");
};
this.getAllResponseHeader=function(_5ab){
var ret="";
for(var i=0;i<this._headers.length;i++){
if(_5ab=="*"||this._headers[i].h==_5ab){
ret+=this._headers[i].h+": "+this._headers[i].v+"\n";
}
}
return ret;
};
this.setRequestHeader=function(_5ae,_5af){
this._headers[this._headers.length]={h:_5ae,v:_5af};
};
this.open=function(_5b0,url,_5b2,user,_5b4){
this.method=_5b0;
this.url=url;
this._async=true;
this._aborted=false;
if(arguments.length>=3){
this._async=_5b2;
}
if(arguments.length>3){
opera.postError("XMLHttpRequest.open() - user/password not supported");
}
this._headers=[];
this.readyState=1;
if(this.onreadystatechange){
this.onreadystatechange();
}
};
this.send=function(data){
if(!navigator.javaEnabled()){
alert("XMLHttpRequest.send() - Java must be installed and enabled.");
return;
}
if(this._async){
setTimeout(this._sendasync,0,this,data);
}else{
this._sendsync(data);
}
};
this._sendasync=function(req,data){
if(!req._aborted){
req._sendsync(data);
}
};
this._sendsync=function(data){
this.readyState=2;
if(this.onreadystatechange){
this.onreadystatechange();
}
var url=new java.net.URL(new java.net.URL(window.location.href),this.url);
var conn=url.openConnection();
for(var i=0;i<this._headers.length;i++){
conn.setRequestProperty(this._headers[i].h,this._headers[i].v);
}
this._headers=[];
if(this.method=="POST"){
conn.setDoOutput(true);
var wr=new java.io.OutputStreamWriter(conn.getOutputStream());
wr.write(data);
wr.flush();
wr.close();
}
var _5bd=false;
var _5be=false;
var _5bf=false;
var _5c0=false;
var _5c1=false;
var _5c2=false;
for(var i=0;;i++){
var _5c3=conn.getHeaderFieldKey(i);
var _5c4=conn.getHeaderField(i);
if(_5c3==null&&_5c4==null){
break;
}
if(_5c3!=null){
this._headers[this._headers.length]={h:_5c3,v:_5c4};
switch(_5c3.toLowerCase()){
case "content-encoding":
_5bd=true;
break;
case "content-length":
_5be=true;
break;
case "content-type":
_5bf=true;
break;
case "date":
_5c0=true;
break;
case "expires":
_5c1=true;
break;
case "last-modified":
_5c2=true;
break;
}
}
}
var val;
val=conn.getContentEncoding();
if(val!=null&&!_5bd){
this._headers[this._headers.length]={h:"Content-encoding",v:val};
}
val=conn.getContentLength();
if(val!=-1&&!_5be){
this._headers[this._headers.length]={h:"Content-length",v:val};
}
val=conn.getContentType();
if(val!=null&&!_5bf){
this._headers[this._headers.length]={h:"Content-type",v:val};
}
val=conn.getDate();
if(val!=0&&!_5c0){
this._headers[this._headers.length]={h:"Date",v:(new Date(val)).toUTCString()};
}
val=conn.getExpiration();
if(val!=0&&!_5c1){
this._headers[this._headers.length]={h:"Expires",v:(new Date(val)).toUTCString()};
}
val=conn.getLastModified();
if(val!=0&&!_5c2){
this._headers[this._headers.length]={h:"Last-modified",v:(new Date(val)).toUTCString()};
}
var _5c6="";
var _5c7=conn.getInputStream();
if(_5c7){
var _5c8=new java.io.BufferedReader(new java.io.InputStreamReader(_5c7));
var line;
while((line=_5c8.readLine())!=null){
if(this.readyState==2){
this.readyState=3;
if(this.onreadystatechange){
this.onreadystatechange();
}
}
_5c6+=line+"\n";
}
_5c8.close();
this.status=200;
this.statusText="OK";
this.responseText=_5c6;
this.readyState=4;
if(this.onreadystatechange){
this.onreadystatechange();
}
if(this.onload){
this.onload();
}
}else{
this.status=404;
this.statusText="Not Found";
this.responseText="";
this.readyState=4;
if(this.onreadystatechange){
this.onreadystatechange();
}
if(this.onerror){
this.onerror();
}
}
};
};
}
if(!window.ActiveXObject&&window.XMLHttpRequest){
window.ActiveXObject=function(type){
switch(type.toLowerCase()){
case "microsoft.xmlhttp":
case "msxml2.xmlhttp":
return new XMLHttpRequest();
}
return null;
};
}
var JSON=function(){
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},s={"boolean":function(x){
return String(x);
},number:function(x){
return isFinite(x)?String(x):"null";
},string:function(x){
if(/["\\\x00-\x1f]/.test(x)){
x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
});
}
return "\""+x+"\"";
},object:function(x){
if(x){
var a=[],b,f,i,l,v;
if(x instanceof Array){
a[0]="[";
l=x.length;
for(i=0;i<l;i+=1){
v=x[i];
f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
if(b){
a[a.length]=",";
}
a[a.length]=v;
b=true;
}
}
}
a[a.length]="]";
}else{
if(x instanceof Object){
a[0]="{";
for(i in x){
v=x[i];
f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
if(b){
a[a.length]=",";
}
a.push(s.string(i),":",v);
b=true;
}
}
}
a[a.length]="}";
}else{
return;
}
}
return a.join("");
}
return "null";
}};
return {copyright:"(c)2005 JSON.org",license:"http://www.crockford.com/JSON/license.html",stringify:function(v){
var f=s[typeof v];
if(f){
v=f(v);
if(typeof v=="string"){
return v;
}
}
return null;
},parse:function(text){
try{
return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g,"")))&&eval("("+text+")");
}
catch(e){
return false;
}
}};
}();
proto=new Subclass("Wikiwyg.HTML","Wikiwyg.Mode");
proto.classtype="html";
proto.modeDescription="HTML";
proto.config={textareaId:null};
proto.initializeObject=function(){
this.div=document.createElement("div");
if(this.config.textareaId){
this.textarea=document.getElementById(this.config.textareaId);
}else{
this.textarea=document.createElement("textarea");
}
this.div.appendChild(this.textarea);
};
proto.enableThis=function(){
Wikiwyg.Mode.prototype.enableThis.call(this);
this.textarea.style.width="100%";
this.textarea.style.height="200px";
};
proto.fromHtml=function(html){
this.textarea.value=this.sanitize_html(html);
};
proto.toHtml=function(func){
func(this.textarea.value);
};
proto.sanitize_html=function(html){
return html;
};
proto.process_command=function(_5e0){
};
function XXX(msg){
if(!confirm(msg)){
throw ("terminated...");
}
return msg;
}
function JJJ(obj){
XXX(JSON.stringify(obj));
return obj;
}
var klass=Debug=function(){
};
klass.sort_object_keys=function(o){
var a=[];
for(p in o){
a.push(p);
}
return a.sort();
};
klass.dump_keys=function(o){
var a=klass.sort_object_keys(o);
var str="";
for(p in a){
str+=a[p]+"\t";
}
XXX(str);
};
klass.dump_object_into_screen=function(o){
var a=klass.sort_object_keys(o);
var str="";
for(p in a){
var i=a[p];
try{
str+=a[p]+": "+o[i]+"\n";
}
catch(e){
}
}
document.write("<xmp>"+str+"</xmp>");
};
proto=new Subclass("Wagn.Wikiwyg","Wikiwyg");
Object.extend(Wagn.Wikiwyg.prototype,{setup:function(_5ec,_5ed,_5ee){
var conf=this.initial_config();
this._slot_id=_5ec;
this._card_name=_5ee;
this._raw_id=this._slot_id+"-raw-content";
this._card_id=_5ed;
if(!conf.wysiwyg){
conf.wysiwyg={};
}
conf.wysiwyg.iframeId=_5ec+"-iframe";
this.iframeID=_5ec+"-iframe";
this.createWikiwygArea($(this._raw_id),conf);
Wagn.Wikiwyg.wikiwyg_divs.push(this);
this._autosave_interval=20*1000;
return this;
},getContent:function(){
var self=this;
this.clean_spans();
this.current_mode.toHtml(function(html){
self.fromHtml(html);
});
return this.div.innerHTML;
},start_timer:function(){
this._interval=0;
this._timer_running=true;
var self=this;
setTimeout("Wagn.wikiwygs['"+this._slot_id+"'].run_timer();",this._autosave_interval);
},stop_timer:function(){
this._timer_running=false;
},run_timer:function(){
if(this._timer_running){
this.on_interval();
setTimeout("Wagn.wikiwygs['"+this._slot_id+"'].run_timer();",this._autosave_interval);
}
},on_interval:function(){
if(!this._timer_running){
return;
}
this._interval+=1;
original_content=$(this._raw_id).innerHTML;
new_content=Wagn.LinkEditor.editable_to_raw(this.getContent(),$(this._raw_id));
if(this._card_id&&new_content!=original_content){
Wagn.Messenger.log("saving draft of "+this._card_name+"...");
new Ajax.Request("/card/save_draft/"+this._card_id,{method:"post",parameters:"card[content]="+encodeURIComponent(new_content)});
}
},get_draft:function(){
return this.wikiwyg.innerSave("draft");
},clean_spans:function(){
dom=this.current_mode.get_edit_document();
$A(dom.getElementsByTagName("span")).reverse().each(function(elem){
warn("  SPAN "+elem);
var _5f4=(elem.style["fontWeight"]=="bold");
var em=(elem.style["fontStyle"]=="italic");
if(em||_5f4){
var _5f6="";
if(em&&_5f4){
_5f6=Wikiwyg.createElementWithAttrs("strong",{});
_5f6.innerHTML="<em>"+elem.innerHTML+"</em>";
}else{
_5f6=Wikiwyg.createElementWithAttrs((em?"em":"strong"),{});
_5f6.innerHTML=elem.innerHTML;
}
elem.parentNode.replaceChild(_5f6,elem);
}
});
},initial_config:function(){
var conf={imagesLocation:"../../images/wikiwyg/",doubleClickToEdit:false,modeClasses:["Wikiwyg.Wysiwyg"],controlLayout:["selector","bold","italic","ordered","unordered","indent","outdent"],styleSelector:["label","h1","h2","p"],controlLabels:Object.extend(Wikiwyg.Toolbar.prototype.config,{spotlight:"Spotlight",highlight:"Highlight",h1:"Header",h2:"Subheader"})};
if(!Wikiwyg.is_ie){
conf.controlLayout.push("link");
}
if($("edit_html").innerHTML.match(/true/)){
conf.modeClasses.push("Wikiwyg.HTML");
conf.controlLayout.push("mode_selector");
}
return conf;
}});
Object.extend(Wagn.Wikiwyg,{wikiwyg_divs:[],addEventToWindow:function(_5f8,name,func){
if(_5f8.addEventListener){
name=name.replace(/^on/,"");
_5f8.addEventListener(name,func,false);
}else{
if(_5f8.attachEvent){
_5f8.attachEvent(name,func);
}
}
},getClipboardHTML:function(){
var _5fb=document.getElementById("___WWHiddenFrame");
if(!_5fb){
_5fb=document.createElement("iframe");
_5fb.id="___WWHiddenFrame";
document.body.appendChild(_5fb);
_5fb.contentDocument.designMode="on";
}
pdoc=_5fb.contentDocument;
pdoc.innerHTML="";
pdoc.execCommand("paste",false,null);
var _5fc=pdoc.innerHTML;
pdoc.innerHTML="";
return _5fc;
}});
Object.extend(Wikiwyg.Wysiwyg.prototype,{get_selection:function(){
return this.edit_iframe.contentWindow.getSelection();
},superEnableThis:Wikiwyg.Wysiwyg.prototype.enableThis,enableThis:function(){
this.superEnableThis();
},do_link:function(){
l=new Wagn.LinkEditor(this);
l.edit();
return;
},do_bold:function(){
this.exec_command("bold");
},do_italic:function(){
this.exec_command("italic");
},do_spotlight:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("bold");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_highlight:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("italic");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_indent:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("indent");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_outdent:function(){
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",false);
}
this.exec_command("outdent");
if(!Wikiwyg.is_ie){
this.exec_command("styleWithCSS",true);
}
},do_norm:function(){
this.exec_command("removeformat");
},fromHtml:function(html){
var dom=document.createElement("div");
dom.innerHTML=html;
this.sanitize_dom(dom);
this.set_inner_html(dom.innerHTML);
},pasteWithFilter:function(){
html=Wagn.Wikiwyg.getClipboardHTML();
},createKeyPressHandler:function(){
var self=this;
return function(e){
var _601=false;
if(e.ctrlKey&&!e.shiftKey&&!e.altKey){
switch(e.which){
case 86:
case 118:
_601=true;
self.pasteWithFilter();
break;
}
}
if(_601){
e.preventDefault();
e.stopPropagation();
}
};
}});
Wikiwyg.Wysiwyg.prototype.config["editHeightAdjustment"]=1.1;
Object.extend(Wikiwyg.Mode.prototype,{get_edit_height:function(){
var _602=this.wikiwyg.divHeight;
if(_602=="0"){
_602=this.wikiwyg.div.parentNode.parentNode.viewHeight-40;
}
var _603=parseInt(_602*this.config.editHeightAdjustment);
var min=this.config.editHeightMinimum;
h=_603<min?min:_603;
max=window.innerHeight-100;
h=h>max?max:h;
return h;
}});
Wagn.Lister=Class.create();
Object.extend(Wagn.Lister.prototype,{initialize:function(_605,args){
per_card=true;
this._arguments=$H(args);
this.user_id=this.make_accessor("user_id");
this.page=this.make_accessor("page");
this.cardtype=this.make_accessor("cardtype",{reset_paging:true});
this.keyword=this.make_accessor("keyword",{reset_paging:true});
this.sort_by=this.make_accessor("sort_by",{reset_paging:true});
this.sortdir=this.make_accessor("sortdir",{reset_paging:true});
this.hide_duplicates=this.make_cookie_accessor("hide_duplicates","");
this.pagesize=this.make_cookie_accessor("pagesize","25");
this.div_id=_605;
Object.extend(this._arguments,{query:this.query(),pagesize:this.pagesize(),cardtype:this.cardtype(),keyword:this.keyword(),sort_by:this.sort_by(),sortdir:this.sortdir()});
Wagn.highlight("sortdir",this.sortdir());
Wagn.highlight("sort_by",this.sort_by());
Wagn.highlight("pagesize",this.pagesize());
Wagn.highlight("hide_duplicates",this.hide_duplicates());
},open_all:function(){
$A(document.getElementsByClassName("open-link",$(this.div_id))).each(function(a){
a.onclick();
});
},close_all:function(){
$A(document.getElementsByClassName("line-link",$(this.div_id))).each(function(a){
a.onclick();
});
},cards_per_page:function(){
if(arguments[0]){
Cookie.set("cards_per_page");
}
return Cookie.get("cards_per_page");
},_cards:function(){
return this._card_slots().collect(function(slot){
return slot.card();
});
},_card_slots:function(){
return document.getElementsByClassName("card-slot",$(this.div_id));
},card_id:function(){
return (typeof (Wagn.main_card)=="undefined"?"":Wagn.main_card.id);
},display_type:function(){
if(arguments[0]!=null){
this._display_type=arguments[0];
}
return (this._display_type?this._display_type:"connection_list");
},query:function(){
field="query";
if(arguments[0]!=null){
this.page("1");
this._arguments[field]=arguments[0];
return this;
}else{
if(this._arguments.keys().include(field)){
return this._arguments[field];
}else{
return null;
}
}
},make_cookie_accessor:function(_60a,_60b){
var self=this;
var _60d=arguments[1]?this.card_id():"";
var _60b=_60b;
return function(){
if(arguments[0]!=null){
Cookie.set(_60d+_60a,arguments[0]);
self._arguments[_60a]=arguments[0];
return self;
}else{
if(self._arguments.keys().include(_60a)){
return self._arguments[_60a];
}else{
if(val=Cookie.get(_60d+_60a)){
return val;
}else{
return _60b;
}
}
}
};
},make_accessor:function(_60e){
options=Object.extend($H({reset_paging:false}),arguments[1]);
var self=this;
var _610=options["reset_paging"];
return function(){
if(arguments[0]!=null){
self._arguments[_60e]=arguments[0];
if(_610){
self.page("1");
}
return self;
}else{
return self._arguments[_60e];
}
};
},update:function(){
$("paging-links-copy").innerHTML="<img src=\"/images/wait.gif\">";
$(this.div_id).innerHTML="";
card_part=(this.card_id()=="")?"":"/"+this.card_id();
new Ajax.Updater(this.div_id,"/block/"+this.display_type()+card_part+".html",this._ajax_parameters(this._arguments));
this.set_button();
},new_connection:function(){
new Ajax.Updater("connections-workspace","/connection/new/"+this.card_id()+"?query=plussed_cards");
},set_button:function(){
if(!($("related-button"))){
return false;
}
button="&nbsp;";
query=this.query();
if(($("button-permission"))&&($("button-permission").innerHTML=="true")){
if((query=="plus_cards")||(query=="plussed_cards")){
button="<input type=\"button\" id=\"new-connection-button\" value=\"join it to another card\" onClick=\"Wagn.lister().new_connection ()\">";
}else{
if(query=="cardtype_cards"){
cardtype=Wagn.main_card.codename;
button="<input type=\"button\" value=\"create new one\" onClick=\"document.location.href='/card/new?card[type]="+cardtype+"'\">";
}
}
}
$("related-button").innerHTML=button;
},after_update:function(){
$("paging-links-copy").innerHTML=$("paging-links").innerHTML;
setupDoubleClickToEdit();
},_ajax_parameters:function(){
param_hash=arguments[0]?arguments[0]:{};
param_list=$A([]);
$H(param_hash).each(function(pair){
if(pair.value&&pair.value!=""){
param_list.push(pair.key+"="+encodeURIComponent(pair.value));
}
});
return {asynchronous:false,evalScripts:true,method:"get",onComplete:function(_612){
Wagn.lister().after_update();
},parameters:param_list.join("&")};
}});
var scwDateNow=new Date(Date.parse(new Date().toDateString()));
var scwBaseYear=scwDateNow.getFullYear()-10;
var scwDropDownYears=20;
var scwLanguage;
function scwSetDefaultLanguage(){
try{
scwSetLanguage();
}
catch(exception){
scwToday="Today:";
scwDrag="click here to drag";
scwArrMonthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
scwArrWeekInits=["S","M","T","W","T","F","S"];
scwInvalidDateMsg="The entered date is invalid.\n";
scwOutOfRangeMsg="The entered date is out of range.";
scwDoesNotExistMsg="The entered date does not exist.";
scwInvalidAlert=["Invalid date (",") ignored."];
scwDateDisablingError=["Error "," is not a Date object."];
scwRangeDisablingError=["Error "," should consist of two elements."];
}
}
var scwWeekStart=1;
var scwWeekNumberDisplay=false;
var scwWeekNumberBaseDay=4;
var scwShowInvalidDateMsg=true,scwShowOutOfRangeMsg=true,scwShowDoesNotExistMsg=true,scwShowInvalidAlert=true,scwShowDateDisablingError=true,scwShowRangeDisablingError=true;
var scwArrDelimiters=["/","-",".",","," "];
var scwDateDisplayFormat="YYYY-MM-DD";
var scwDateOutputFormat="YYYY-MM-DD";
var scwDateInputSequence="YMD";
var scwZindex=1;
var scwBlnStrict=false;
var scwEnabledDay=[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true];
var scwDisabledDates=new Array();
var scwActiveToday=true;
var scwOutOfMonthDisable=false;
var scwOutOfMonthHide=false;
var scwOutOfRangeDisable=true;
var scwAllowDrag=false;
var scwClickToHide=false;
document.writeln("<style type=\"text/css\">"+".scw           {padding:1px;vertical-align:middle;}"+"iframe.scw     {position:absolute;z-index:"+scwZindex+";top:0px;left:0px;visibility:hidden;"+"width:1px;height:1px;}"+"table.scw      {padding:0px;visibility:hidden;"+"position:absolute;cursor:default;"+"width:200px;top:0px;left:0px;"+"z-index:"+(scwZindex+1)+";text-align:center;}"+"</style>");
document.writeln("<style type=\"text/css\">"+"/* IMPORTANT:  The SCW calendar script requires all "+"               the classes defined here."+"*/"+"table.scw      {padding:       1px;"+"vertical-align:middle;"+"border:        ridge 2px;"+"font-size:     10pt;"+"font-family:   Arial,Helvetica,Sans-Serif;"+"font-weight:   bold;}"+"td.scwDrag,"+"td.scwHead                 {padding:       0px 0px;"+"text-align:    center;}"+"td.scwDrag                 {font-size:     8pt;}"+"select.scwHead             {margin:        3px 1px;"+"text-align:    center;}"+"input.scwHead              {height:        22px;"+"width:         22px;"+"vertical-align:middle;"+"text-align:    center;"+"margin:        2px 1px;"+"font-weight:   bold;"+"font-size:     10pt;"+"font-family:   fixedSys;}"+"td.scwWeekNumberHead,"+"td.scwWeek                 {padding:       0px;"+"text-align:    center;"+"font-weight:   bold;}"+"td.scwFoot,"+"td.scwFootHover,"+"td.scwFoot:hover,"+"td.scwFootDisabled         {padding:       0px;"+"text-align:    center;"+"font-weight:   normal;}"+"table.scwCells             {text-align:    right;"+"font-size:     8pt;"+"width:         96%;}"+"td.scwCells,"+"td.scwCellsHover,"+"td.scwCells:hover,"+"td.scwCellsDisabled,"+"td.scwCellsExMonth,"+"td.scwCellsExMonthHover,"+"td.scwCellsExMonth:hover,"+"td.scwCellsExMonthDisabled,"+"td.scwCellsWeekend,"+"td.scwCellsWeekendHover,"+"td.scwCellsWeekend:hover,"+"td.scwCellsWeekendDisabled,"+"td.scwInputDate,"+"td.scwInputDateHover,"+"td.scwInputDate:hover,"+"td.scwInputDateDisabled,"+"td.scwWeekNo,"+"td.scwWeeks                {padding:           3px;"+"width:             16px;"+"height:            16px;"+"font-weight:       bold;"+"vertical-align:    middle;}"+"/* Blend the colours into your page here...    */"+"/* Calendar background */"+"table.scw                  {background-color:  #6666CC;}"+"/* Drag Handle */"+"td.scwDrag                 {background-color:  #9999CC;"+"color:             #CCCCFF;}"+"/* Week number heading */"+"td.scwWeekNumberHead       {color:             #6666CC;}"+"/* Week day headings */"+"td.scwWeek                 {color:             #CCCCCC;}"+"/* Week numbers */"+"td.scwWeekNo               {background-color:  #776677;"+"color:             #CCCCCC;}"+"/* Enabled Days */"+"/* Week Day */"+"td.scwCells                {background-color:  #CCCCCC;"+"color:             #000000;}"+"/* Day matching the input date */"+"td.scwInputDate            {background-color:  #CC9999;"+"color:             #FF0000;}"+"/* Weekend Day */"+"td.scwCellsWeekend         {background-color:  #CCCCCC;"+"color:             #CC6666;}"+"/* Day outside the current month */"+"td.scwCellsExMonth         {background-color:  #CCCCCC;"+"color:             #666666;}"+"/* Today selector */"+"td.scwFoot                 {background-color:  #6666CC;"+"color:             #FFFFFF;}"+"/* MouseOver/Hover formatting "+"       If you want to \"turn off\" any of the formatting "+"       then just set to the same as the standard format"+"       above."+" "+"       Note: The reason that the following are"+"       implemented using both a class and a :hover"+"       pseudoclass is because Opera handles the rendering"+"       involved in the class swap very poorly and IE6 "+"       (and below) only implements pseudoclasses on the"+"       anchor tag."+"*/"+"/* Active cells */"+"td.scwCells:hover,"+"td.scwCellsHover           {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Day matching the input date */"+"td.scwInputDate:hover,"+"td.scwInputDateHover       {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Weekend cells */"+"td.scwCellsWeekend:hover,"+"td.scwCellsWeekendHover    {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Day outside the current month */"+"td.scwCellsExMonth:hover,"+"td.scwCellsExMonthHover    {background-color:  #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"color:             #000000;}"+"/* Today selector */"+"td.scwFoot:hover,"+"td.scwFootHover            {color:             #FFFF00;"+"cursor:            pointer;"+"cursor:            hand;"+"font-weight:       bold;}"+"/* Disabled cells */"+"/* Week Day */"+"/* Day matching the input date */"+"td.scwInputDateDisabled    {background-color:  #999999;"+"color:             #000000;}"+"td.scwCellsDisabled        {background-color:  #999999;"+"color:             #000000;}"+"/* Weekend Day */"+"td.scwCellsWeekendDisabled {background-color:  #999999;"+"color:             #CC6666;}"+"/* Day outside the current month */"+"td.scwCellsExMonthDisabled {background-color:  #999999;"+"color:             #666666;}"+"td.scwFootDisabled         {background-color:  #6666CC;"+"color:             #FFFFFF;}"+"</style>");
var scwTargetEle,scwTriggerEle,scwMonthSum=0,scwBlnFullInputDate=false,scwPassEnabledDay=new Array(),scwSeedDate=new Date(),scwParmActiveToday=true,scwWeekStart=scwWeekStart%7,scwToday,scwDrag,scwArrMonthNames,scwArrWeekInits,scwInvalidDateMsg,scwOutOfRangeMsg,scwDoesNotExistMsg,scwInvalidAlert,scwDateDisablingError,scwRangeDisablingError;
Date.prototype.scwFormat=function(_613){
var _614=0,_615="",_616="";
for(var i=0;i<=_613.length;i++){
if(i<_613.length&&_613.charAt(i)==_615){
_614++;
}else{
switch(_615){
case "y":
case "Y":
_616+=(this.getFullYear()%Math.pow(10,_614)).toString().scwPadLeft(_614);
break;
case "m":
case "M":
_616+=(_614<3)?(this.getMonth()+1).toString().scwPadLeft(_614):scwArrMonthNames[this.getMonth()];
break;
case "d":
case "D":
_616+=this.getDate().toString().scwPadLeft(_614);
break;
default:
while(_614-->0){
_616+=_615;
}
}
if(i<_613.length){
_615=_613.charAt(i);
_614=1;
}
}
}
return _616;
};
String.prototype.scwPadLeft=function(_618){
var _619="";
for(var i=0;i<(_618-this.length);i++){
_619+="0";
}
return (_619+this);
};
Function.prototype.runsAfterSCW=function(){
var func=this,args=new Array(arguments.length);
for(var i=0;i<args.length;++i){
args[i]=arguments[i];
}
return function(){
for(var i=0;i<arguments.length;++i){
args[args.length]=arguments[i];
}
return (args.shift()==scwTriggerEle)?func.apply(this,args):null;
};
};
function scwID(id){
return document.getElementById(id);
}
var scwNextActionReturn,scwNextAction;
function showCal(_620,_621){
scwShow(_620,_621);
}
function scwShow(_622,_623){
scwTriggerEle=_623;
scwParmActiveToday=true;
for(var i=0;i<7;i++){
scwPassEnabledDay[(i+7-scwWeekStart)%7]=true;
for(var j=2;j<arguments.length;j++){
if(arguments[j]==i){
scwPassEnabledDay[(i+7-scwWeekStart)%7]=false;
if(scwDateNow.getDay()==i){
scwParmActiveToday=false;
}
}
}
}
scwSeedDate=scwDateNow;
if(typeof _622.value=="undefined"){
var _626=_622.childNodes;
for(var i=0;i<_626.length;i++){
if(_626[i].nodeType==3){
var _627=_626[i].nodeValue.replace(/^\s+/,"").replace(/\s+$/,"");
if(_627.length>0){
scwTriggerEle.scwTextNode=_626[i];
scwTriggerEle.scwLength=_626[i].nodeValue.length;
break;
}
}
}
}else{
var _627=_622.value.replace(/^\s+/,"").replace(/\s+$/,"");
}
scwSetDefaultLanguage();
scwID("scwDragText").innerHTML=scwDrag;
scwID("scwMonths").options.length=0;
for(var i=0;i<scwArrMonthNames.length;i++){
scwID("scwMonths").options[i]=new Option(scwArrMonthNames[i],scwArrMonthNames[i]);
}
scwID("scwYears").options.length=0;
for(var i=0;i<scwDropDownYears;i++){
scwID("scwYears").options[i]=new Option((scwBaseYear+i),(scwBaseYear+i));
}
for(var i=0;i<scwArrWeekInits.length;i++){
scwID("scwWeekInit"+i).innerHTML=scwArrWeekInits[(i+scwWeekStart)%scwArrWeekInits.length];
}
if(scwID("scwFoot")){
scwID("scwFoot").innerHTML=scwToday+" "+scwDateNow.scwFormat(scwDateDisplayFormat);
}
if(_627.length==0){
scwBlnFullInputDate=false;
if((new Date(scwBaseYear+scwDropDownYears,0,0))<scwSeedDate||(new Date(scwBaseYear,0,1))>scwSeedDate){
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears/2),5,1);
}
}else{
function scwInputFormat(){
var _628=new Array(),_629=_627.split(new RegExp("[\\"+scwArrDelimiters.join("\\")+"]+","g"));
if(_629[0]!=null){
if(_629[0].length==0){
_629.splice(0,1);
}
if(_629[_629.length-1].length==0){
_629.splice(_629.length-1,1);
}
}
scwBlnFullInputDate=false;
switch(_629.length){
case 1:
_628[0]=parseInt(_629[0],10);
_628[1]="6";
_628[2]=1;
break;
case 2:
_628[0]=parseInt(_629[scwDateInputSequence.replace(/D/i,"").search(/Y/i)],10);
_628[1]=_629[scwDateInputSequence.replace(/D/i,"").search(/M/i)];
_628[2]=1;
break;
case 3:
_628[0]=parseInt(_629[scwDateInputSequence.search(/Y/i)],10);
_628[1]=_629[scwDateInputSequence.search(/M/i)];
_628[2]=parseInt(_629[scwDateInputSequence.search(/D/i)],10);
scwBlnFullInputDate=true;
break;
default:
_628[0]=0;
_628[1]=0;
_628[2]=0;
}
var _62a=/^(0?[1-9]|[1-2]\d|3[0-1])$/,_62b=new RegExp("^(0?[1-9]|1[0-2]|"+scwArrMonthNames.join("|")+")$","i"),_62c=/^(\d{1,2}|\d{4})$/;
if(_62c.exec(_628[0])==null||_62b.exec(_628[1])==null||_62a.exec(_628[2])==null){
if(scwShowInvalidDateMsg){
alert(scwInvalidDateMsg+scwInvalidAlert[0]+_627+scwInvalidAlert[1]);
}
scwBlnFullInputDate=false;
_628[0]=scwBaseYear+Math.floor(scwDropDownYears/2);
_628[1]="6";
_628[2]=1;
}
return _628;
}
scwArrSeedDate=scwInputFormat();
if(scwArrSeedDate[0]<100){
scwArrSeedDate[0]+=(scwArrSeedDate[0]>50)?1900:2000;
}
if(scwArrSeedDate[1].search(/\d+/)!=0){
month=scwArrMonthNames.join("|").toUpperCase().search(scwArrSeedDate[1].substr(0,3).toUpperCase());
scwArrSeedDate[1]=Math.floor(month/4)+1;
}
scwSeedDate=new Date(scwArrSeedDate[0],scwArrSeedDate[1]-1,scwArrSeedDate[2]);
}
if(isNaN(scwSeedDate)){
if(scwShowInvalidDateMsg){
alert(scwInvalidDateMsg+scwInvalidAlert[0]+_627+scwInvalidAlert[1]);
}
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears/2),5,1);
scwBlnFullInputDate=false;
}else{
if((new Date(scwBaseYear,0,1))>scwSeedDate){
if(scwBlnStrict&&scwShowOutOfRangeMsg){
alert(scwOutOfRangeMsg);
}
scwSeedDate=new Date(scwBaseYear,0,1);
scwBlnFullInputDate=false;
}else{
if((new Date(scwBaseYear+scwDropDownYears,0,0))<scwSeedDate){
if(scwBlnStrict&&scwShowOutOfRangeMsg){
alert(scwOutOfRangeMsg);
}
scwSeedDate=new Date(scwBaseYear+Math.floor(scwDropDownYears)-1,11,1);
scwBlnFullInputDate=false;
}else{
if(scwBlnStrict&&scwBlnFullInputDate&&(scwSeedDate.getDate()!=scwArrSeedDate[2]||(scwSeedDate.getMonth()+1)!=scwArrSeedDate[1]||scwSeedDate.getFullYear()!=scwArrSeedDate[0])){
if(scwShowDoesNotExistMsg){
alert(scwDoesNotExistMsg);
}
scwSeedDate=new Date(scwSeedDate.getFullYear(),scwSeedDate.getMonth()-1,1);
scwBlnFullInputDate=false;
}
}
}
}
for(var i=0;i<scwDisabledDates.length;i++){
if(!((typeof scwDisabledDates[i]=="object")&&(scwDisabledDates[i].constructor==Date))){
if((typeof scwDisabledDates[i]=="object")&&(scwDisabledDates[i].constructor==Array)){
var _62d=true;
if(scwDisabledDates[i].length!=2){
if(scwShowRangeDisablingError){
alert(scwRangeDisablingError[0]+scwDisabledDates[i]+scwRangeDisablingError[1]);
}
_62d=false;
}else{
for(var j=0;j<scwDisabledDates[i].length;j++){
if(!((typeof scwDisabledDates[i][j]=="object")&&(scwDisabledDates[i][j].constructor==Date))){
if(scwShowRangeDisablingError){
alert(scwDateDisablingError[0]+scwDisabledDates[i][j]+scwDateDisablingError[1]);
}
_62d=false;
}
}
}
if(_62d&&(scwDisabledDates[i][0]>scwDisabledDates[i][1])){
scwDisabledDates[i].reverse();
}
}else{
if(scwShowRangeDisablingError){
alert(scwDateDisablingError[0]+scwDisabledDates[i]+scwDateDisablingError[1]);
}
}
}
}
scwMonthSum=12*(scwSeedDate.getFullYear()-scwBaseYear)+scwSeedDate.getMonth();
scwID("scwYears").options.selectedIndex=Math.floor(scwMonthSum/12);
scwID("scwMonths").options.selectedIndex=(scwMonthSum%12);
if(window.opera){
scwID("scwMonths").style.display="none";
scwID("scwMonths").style.display="block";
scwID("scwYears").style.display="none";
scwID("scwYears").style.display="block";
}
scwID("scwDrag").style.display=(scwAllowDrag)?((scwID("scwIFrame"))?"block":"table-row"):"none";
scwShowMonth(0);
scwTargetEle=_622;
var _62e=parseInt(_622.offsetTop,10)+parseInt(_622.offsetHeight,10),_62f=parseInt(_622.offsetLeft,10);
if(!window.opera){
while(_622.tagName!="BODY"&&_622.tagName!="HTML"){
_62e-=parseInt(_622.scrollTop,10);
_62f-=parseInt(_622.scrollLeft,10);
_622=_622.parentNode;
}
_622=scwTargetEle;
}
do{
_622=_622.offsetParent;
_62e+=parseInt(_622.offsetTop,10);
_62f+=parseInt(_622.offsetLeft,10);
}while(_622.tagName!="BODY"&&_622.tagName!="HTML");
scwID("scw").style.top=_62e+"px";
scwID("scw").style.left=_62f+"px";
if(scwID("scwIframe")){
scwID("scwIframe").style.top=_62e+"px";
scwID("scwIframe").style.left=_62f+"px";
scwID("scwIframe").style.width=(scwID("scw").offsetWidth-2)+"px";
scwID("scwIframe").style.height=(scwID("scw").offsetHeight-2)+"px";
scwID("scwIframe").style.visibility="visible";
}
scwID("scw").style.visibility="visible";
scwID("scwYears").options.selectedIndex=scwID("scwYears").options.selectedIndex;
scwID("scwMonths").options.selectedIndex=scwID("scwMonths").options.selectedIndex;
var el=(_623.parentNode)?_623.parentNode:_623;
if(typeof event=="undefined"){
el.addEventListener("click",scwStopPropagation,false);
}else{
if(el.attachEvent){
el.attachEvent("onclick",scwStopPropagation);
}else{
event.cancelBubble=true;
}
}
}
function scwHide(){
scwID("scw").style.visibility="hidden";
if(scwID("scwIframe")){
scwID("scwIframe").style.visibility="hidden";
}
if(typeof scwNextAction!="undefined"&&scwNextAction!=null){
scwNextActionReturn=scwNextAction();
scwNextAction=null;
}
}
function scwCancel(_631){
if(scwClickToHide){
scwHide();
}
scwStopPropagation(_631);
}
function scwStopPropagation(_632){
if(_632.stopPropagation){
_632.stopPropagation();
}else{
_632.cancelBubble=true;
}
}
function scwBeginDrag(_633){
var _634=scwID("scw");
var _635=_633.clientX,_636=_633.clientY,_637=_634;
do{
_635-=parseInt(_637.offsetLeft,10);
_636-=parseInt(_637.offsetTop,10);
_637=_637.offsetParent;
}while(_637.tagName!="BODY"&&_637.tagName!="HTML");
if(document.addEventListener){
document.addEventListener("mousemove",moveHandler,true);
document.addEventListener("mouseup",upHandler,true);
}else{
_634.attachEvent("onmousemove",moveHandler);
_634.attachEvent("onmouseup",upHandler);
_634.setCapture();
}
scwStopPropagation(_633);
function moveHandler(_638){
if(!_638){
_638=window.event;
}
_634.style.left=(_638.clientX-_635)+"px";
_634.style.top=(_638.clientY-_636)+"px";
if(scwID("scwIframe")){
scwID("scwIframe").style.left=(_638.clientX-_635)+"px";
scwID("scwIframe").style.top=(_638.clientY-_636)+"px";
}
scwStopPropagation(_638);
}
function upHandler(_639){
if(!_639){
_639=window.event;
}
if(document.removeEventListener){
document.removeEventListener("mousemove",moveHandler,true);
document.removeEventListener("mouseup",upHandler,true);
}else{
_634.detachEvent("onmouseup",upHandler);
_634.detachEvent("onmousemove",moveHandler);
_634.releaseCapture();
}
scwStopPropagation(_639);
}
}
function scwShowMonth(_63a){
var _63b=new Date(Date.parse(new Date().toDateString())),_63c=new Date();
_63b.setHours(12);
scwSelYears=scwID("scwYears");
scwSelMonths=scwID("scwMonths");
if(scwSelYears.options.selectedIndex>-1){
scwMonthSum=12*(scwSelYears.options.selectedIndex)+_63a;
if(scwSelMonths.options.selectedIndex>-1){
scwMonthSum+=scwSelMonths.options.selectedIndex;
}
}else{
if(scwSelMonths.options.selectedIndex>-1){
scwMonthSum+=scwSelMonths.options.selectedIndex;
}
}
_63b.setFullYear(scwBaseYear+Math.floor(scwMonthSum/12),(scwMonthSum%12),1);
scwID("scwWeek_").style.display=(scwWeekNumberDisplay)?((scwID("scwIFrame"))?"block":"table-cell"):"none";
if((12*parseInt((_63b.getFullYear()-scwBaseYear),10))+parseInt(_63b.getMonth(),10)<(12*scwDropDownYears)&&(12*parseInt((_63b.getFullYear()-scwBaseYear),10))+parseInt(_63b.getMonth(),10)>-1){
scwSelYears.options.selectedIndex=Math.floor(scwMonthSum/12);
scwSelMonths.options.selectedIndex=(scwMonthSum%12);
scwCurMonth=_63b.getMonth();
_63b.setDate((((_63b.getDay()-scwWeekStart)<0)?-6:1)+scwWeekStart-_63b.getDay());
var _63d=new Date(_63b.getFullYear(),_63b.getMonth(),_63b.getDate()).valueOf();
_63c=new Date(_63b);
var _63e=scwID("scwFoot");
function scwFootOutput(){
scwSetOutput(scwDateNow);
}
if(scwDisabledDates.length==0){
if(scwActiveToday&&scwParmActiveToday){
_63e.onclick=scwFootOutput;
_63e.className="scwFoot";
if(scwID("scwIFrame")){
_63e.onmouseover=scwChangeClass;
_63e.onmouseout=scwChangeClass;
}
}else{
_63e.onclick=null;
_63e.className="scwFootDisabled";
if(scwID("scwIFrame")){
_63e.onmouseover=null;
_63e.onmouseout=null;
}
if(document.addEventListener){
_63e.addEventListener("click",scwStopPropagation,false);
}else{
_63e.attachEvent("onclick",scwStopPropagation);
}
}
}else{
for(var k=0;k<scwDisabledDates.length;k++){
if(!scwActiveToday||!scwParmActiveToday||((typeof scwDisabledDates[k]=="object")&&(((scwDisabledDates[k].constructor==Date)&&scwDateNow.valueOf()==scwDisabledDates[k].valueOf())||((scwDisabledDates[k].constructor==Array)&&scwDateNow.valueOf()>=scwDisabledDates[k][0].valueOf()&&scwDateNow.valueOf()<=scwDisabledDates[k][1].valueOf())))){
_63e.onclick=null;
_63e.className="scwFootDisabled";
if(scwID("scwIFrame")){
_63e.onmouseover=null;
_63e.onmouseout=null;
}
if(document.addEventListener){
_63e.addEventListener("click",scwStopPropagation,false);
}else{
_63e.attachEvent("onclick",scwStopPropagation);
}
break;
}else{
_63e.onclick=scwFootOutput;
_63e.className="scwFoot";
if(scwID("scwIFrame")){
_63e.onmouseover=scwChangeClass;
_63e.onmouseout=scwChangeClass;
}
}
}
}
function scwSetOutput(_640){
if(typeof scwTargetEle.value=="undefined"){
scwTriggerEle.scwTextNode.replaceData(0,scwTriggerEle.scwLength,_640.scwFormat(scwDateOutputFormat));
}else{
scwTargetEle.value=_640.scwFormat(scwDateOutputFormat);
}
scwHide();
}
function scwCellOutput(_641){
var _642=scwEventTrigger(_641),_643=new Date(_63c);
if(_642.nodeType==3){
_642=_642.parentNode;
}
_643.setDate(_63c.getDate()+parseInt(_642.id.substr(8),10));
scwSetOutput(_643);
}
function scwChangeClass(_644){
var _645=scwEventTrigger(_644);
if(_645.nodeType==3){
_645=_645.parentNode;
}
switch(_645.className){
case "scwCells":
_645.className="scwCellsHover";
break;
case "scwCellsHover":
_645.className="scwCells";
break;
case "scwCellsExMonth":
_645.className="scwCellsExMonthHover";
break;
case "scwCellsExMonthHover":
_645.className="scwCellsExMonth";
break;
case "scwCellsWeekend":
_645.className="scwCellsWeekendHover";
break;
case "scwCellsWeekendHover":
_645.className="scwCellsWeekend";
break;
case "scwFoot":
_645.className="scwFootHover";
break;
case "scwFootHover":
_645.className="scwFoot";
break;
case "scwInputDate":
_645.className="scwInputDateHover";
break;
case "scwInputDateHover":
_645.className="scwInputDate";
}
return true;
}
function scwEventTrigger(_646){
if(!_646){
_646=event;
}
return _646.target||_646.srcElement;
}
function scwWeekNumber(_647){
var _648=new Date(_647);
_648.setDate(_648.getDate()-_648.getDay()+scwWeekNumberBaseDay+((_647.getDay()>scwWeekNumberBaseDay)?7:0));
var _649=new Date(_648.getFullYear(),0,1);
_649.setDate(_649.getDate()-_649.getDay()+scwWeekNumberBaseDay);
if(_649<new Date(_648.getFullYear(),0,1)){
_649.setDate(_649.getDate()+7);
}
var _64a=new Date(_649-scwWeekNumberBaseDay+_647.getDay());
if(_64a>_649){
_64a.setDate(_64a.getDate()-7);
}
var _64b="0"+(Math.round((_648-_649)/604800000,0)+1);
return _64b.substring(_64b.length-2,_64b.length);
}
var _64c=scwID("scwCells");
for(i=0;i<_64c.childNodes.length;i++){
var _64d=_64c.childNodes[i];
if(_64d.nodeType==1&&_64d.tagName=="TR"){
if(scwWeekNumberDisplay){
_64d.childNodes[0].innerHTML=scwWeekNumber(_63b);
_64d.childNodes[0].style.display=(scwID("scwIFrame"))?"block":"table-cell";
}else{
_64d.childNodes[0].style.display="none";
}
for(j=1;j<_64d.childNodes.length;j++){
var _64e=_64d.childNodes[j];
if(_64e.nodeType==1&&_64e.tagName=="TD"){
_64d.childNodes[j].innerHTML=_63b.getDate();
var _64f=_64d.childNodes[j],_650=((scwOutOfRangeDisable&&(_63b<(new Date(scwBaseYear,0,1,_63b.getHours()))||_63b>(new Date(scwBaseYear+scwDropDownYears,0,0,_63b.getHours()))))||(scwOutOfMonthDisable&&(_63b<(new Date(_63b.getFullYear(),scwCurMonth,1,_63b.getHours()))||_63b>(new Date(_63b.getFullYear(),scwCurMonth+1,0,_63b.getHours())))))?true:false;
_64f.style.visibility=(scwOutOfMonthHide&&(_63b<(new Date(_63b.getFullYear(),scwCurMonth,1,_63b.getHours()))||_63b>(new Date(_63b.getFullYear(),scwCurMonth+1,0,_63b.getHours()))))?"hidden":"";
for(var k=0;k<scwDisabledDates.length;k++){
if((typeof scwDisabledDates[k]=="object")&&(scwDisabledDates[k].constructor==Date)&&_63d==scwDisabledDates[k].valueOf()){
_650=true;
}else{
if((typeof scwDisabledDates[k]=="object")&&(scwDisabledDates[k].constructor==Array)&&_63d>=scwDisabledDates[k][0].valueOf()&&_63d<=scwDisabledDates[k][1].valueOf()){
_650=true;
}
}
}
if(_650||!scwEnabledDay[j-1+(7*((i*_64c.childNodes.length)/6))]||!scwPassEnabledDay[(j-1+(7*(i*_64c.childNodes.length/6)))%7]){
_64d.childNodes[j].onclick=null;
if(scwID("scwIFrame")){
_64d.childNodes[j].onmouseover=null;
_64d.childNodes[j].onmouseout=null;
}
_64f.className=(_63b.getMonth()!=scwCurMonth)?"scwCellsExMonthDisabled":(scwBlnFullInputDate&&_63b.toDateString()==scwSeedDate.toDateString())?"scwInputDateDisabled":(_63b.getDay()%6==0)?"scwCellsWeekendDisabled":"scwCellsDisabled";
}else{
_64d.childNodes[j].onclick=scwCellOutput;
if(scwID("scwIFrame")){
_64d.childNodes[j].onmouseover=scwChangeClass;
_64d.childNodes[j].onmouseout=scwChangeClass;
}
_64f.className=(_63b.getMonth()!=scwCurMonth)?"scwCellsExMonth":(scwBlnFullInputDate&&_63b.toDateString()==scwSeedDate.toDateString())?"scwInputDate":(_63b.getDay()%6==0)?"scwCellsWeekend":"scwCells";
}
_63b.setDate(_63b.getDate()+1);
_63d=new Date(_63b.getFullYear(),_63b.getMonth(),_63b.getDate()).valueOf();
}
}
}
}
}
scwID("scw").style.visibility="hidden";
scwID("scw").style.visibility="visible";
}
document.write("<!--[if IE]>"+"<iframe class='scw' src='/scwblank.html' "+"id='scwIframe' name='scwIframe' "+"frameborder='0'>"+"</iframe>"+"<![endif]-->"+"<table id='scw' class='scw'>"+"<tr class='scw'>"+"<td class='scw'>"+"<table class='scwHead' id='scwHead' width='100%' "+"cellspacing='0' cellpadding='0'>"+"<tr id='scwDrag' style='display:none;'>"+"<td colspan='4' class='scwDrag' "+"onmousedown='scwBeginDrag(event);'>"+"<div id='scwDragText'></div>"+"</td>"+"</tr>"+"<tr class='scwHead' >"+"<td class='scwHead'>"+"<input class='scwHead' id='scwHeadLeft' type='button' value='<' "+"onclick='scwShowMonth(-1);'  /></td>"+"<td class='scwHead'>"+"<select id='scwMonths' class='scwHead' "+"onchange='scwShowMonth(0);'>"+"</select>"+"</td>"+"<td class='scwHead'>"+"<select id='scwYears' class='scwHead' "+"onchange='scwShowMonth(0);'>"+"</select>"+"</td>"+"<td class='scwHead'>"+"<input class='scwHead' id='scwHeadRight' type='button' value='>' "+"onclick='scwShowMonth(1);' /></td>"+"</tr>"+"</table>"+"</td>"+"</tr>"+"<tr class='scw'>"+"<td class='scw'>"+"<table class='scwCells' align='center'>"+"<thead>"+"<tr><td class='scwWeekNumberHead' id='scwWeek_' ></td>");
for(i=0;i<7;i++){
document.write("<td class='scwWeek' id='scwWeekInit"+i+"'></td>");
}
document.write("</tr>"+"</thead>"+"<tbody id='scwCells' "+"onClick='scwStopPropagation(event);'>");
for(i=0;i<6;i++){
document.write("<tr>"+"<td class='scwWeekNo' id='scwWeek_"+i+"'></td>");
for(j=0;j<7;j++){
document.write("<td class='scwCells' id='scwCell_"+(j+(i*7))+"'></td>");
}
document.write("</tr>");
}
document.write("</tbody>");
if((new Date(scwBaseYear+scwDropDownYears,11,32))>scwDateNow&&(new Date(scwBaseYear,0,0))<scwDateNow){
document.write("<tfoot class='scwFoot'>"+"<tr class='scwFoot'>"+"<td class='scwFoot' id='scwFoot' colspan='8'>"+"</td>"+"</tr>"+"</tfoot>");
}
document.write("</table>"+"</td>"+"</tr>"+"</table>");
if(document.addEventListener){
scwID("scw").addEventListener("click",scwCancel,false);
scwID("scwHeadLeft").addEventListener("click",scwStopPropagation,false);
scwID("scwMonths").addEventListener("click",scwStopPropagation,false);
scwID("scwMonths").addEventListener("change",scwStopPropagation,false);
scwID("scwYears").addEventListener("click",scwStopPropagation,false);
scwID("scwYears").addEventListener("change",scwStopPropagation,false);
scwID("scwHeadRight").addEventListener("click",scwStopPropagation,false);
}else{
scwID("scw").attachEvent("onclick",scwCancel);
scwID("scwHeadLeft").attachEvent("onclick",scwStopPropagation);
scwID("scwMonths").attachEvent("onclick",scwStopPropagation);
scwID("scwMonths").attachEvent("onchange",scwStopPropagation);
scwID("scwYears").attachEvent("onclick",scwStopPropagation);
scwID("scwYears").attachEvent("onchange",scwStopPropagation);
scwID("scwHeadRight").attachEvent("onclick",scwStopPropagation);
}
if(document.addEventListener){
document.addEventListener("click",scwHide,false);
}else{
document.attachEvent("onclick",scwHide);
}
Wagn.Link=Class.create();
Object.extend(Wagn.Link,{new_from_link:function(link){
return Object.extend(link,{is_bound:function(){
return this.attributes["bound"]&&this.attributes["bound"].value=="true";
},links_to:function(){
return this.attributes["href"].value;
},reads_as:function(){
return this.innerHTML;
},update_bound:function(){
if(this.is_bound()){
this.attributes["href"].value=this.reads_as().linkify();
}
}});
},new_from_text:function(text){
link=Builder.node("a",{bound:true,href:text.linkify()},[text]);
return this.new_from_link(link);
}});
Object.extend(String.prototype,{linkify:function(){
return this.gsub(/\s/,"_").gsub(/\%20/,"_");
},unlinkify:function(){
return this.gsub(/_/," ").gsub(/\/wiki\//,"");
}});
Wagn.LinkEditor=Class.create();
Object.extend(Wagn.LinkEditor,{raw_to_editable:function(_653){
generate_anchor=function(_654){
reads_as=_654[1];
links_to=(_654[2]?_654[2]:reads_as).linkify();
bound=reads_as.linkify()==links_to?true:false;
t="<a bound=\"#{bound}\" href=\"#{links_to}\">#{reads_as}</a>";
return new Template(t).evaluate({bound:bound,reads_as:reads_as,links_to:links_to});
};
_653=_653.gsub(/\[\[([^\]]+)\]\]/,generate_anchor);
_653=_653.gsub(/\[([^\]]+)\]\[([^\]]+)\]/,generate_anchor);
return _653;
},editable_to_raw:function(_655,_656){
_656.innerHTML=_655;
$A(_656.getElementsByTagName("a")).each(function(e){
if(e.attributes["href"]){
link=Wagn.Link.new_from_link(e);
link.update_bound();
if(e.innerHTML==""){
Element.replace(e,"");
}else{
if(link.is_bound()){
Element.replace(e,"[["+e.innerHTML+"]]");
}else{
Element.replace(e,"["+e.innerHTML+"]["+e.attributes["href"].value+"]");
}
}
}
});
return _656.innerHTML;
}});
Object.extend(Wagn.LinkEditor.prototype,{initialize:function(_658){
this.wysiwyg=_658;
this.selection=this.get_selection();
Wagn.linkEditor=this;
},get_selection:function(){
if(Wikiwyg.is_ie){
return this.wysiwyg.get_edit_document().selection;
}else{
return this.wysiwyg.get_edit_window().getSelection();
}
},get_selection_text:function(){
return this.get_selection().toString();
},get_selection_ancestor:function(){
return this.get_selection().getRangeAt(0).commonAncestorContainer;
},edit:function(){
node=this.get_selection_ancestor();
if(link=this.inside_link_node(node)){
this.link=Wagn.Link.new_from_link(link);
this.new_link=false;
}else{
if(this.node_contains_link(node)){
alert("Oops, can't link this text because there's a link inside it");
return false;
}else{
this.link=Wagn.Link.new_from_text(this.get_selection_text());
this.new_link=true;
}
}
this.open_popup();
},inside_link_node:function(node){
if(node&&node.tagName=="A"){
return node;
}else{
if(node.parentNode){
return this.inside_link_node(node.parentNode);
}else{
return false;
}
}
},node_contains_link:function(node){
if(node.getElementsByTagName&&$A(node.getElementsByTagName("a")).length>0){
return true;
}else{
return false;
}
},replace_selection_with:function(node){
r=this.get_selection().getRangeAt(0);
r.deleteContents();
r.insertNode(node);
},save:function(_65c,_65d){
if(_65c.linkify()==_65d.linkify()){
this.link.setAttribute("bound",true);
}else{
this.link.setAttribute("bound",false);
}
this.link.attributes["href"].value=_65d.linkify();
this.link.innerHTML=_65c;
if(this.new_link){
this.replace_selection_with(link);
}
Windows.close("linkwin");
},unlink:function(_65e){
if(!this.new_link){
Element.replace(this.link,_65e);
}
Windows.close("linkwin");
},cancel:function(){
Windows.close("linkwin");
},update_bounded:function(){
if(this.link.is_bound()){
}
},open_popup:function(){
if(Wagn.linkwin){
Wagn.linkwin.setLocation(30+window.scrollY,30);
}else{
Wagn.linkwin=new Window("linkwin",{className:"mac_os_x",title:"Link Editor",top:30+window.scrollY,left:30,width:550,height:108,showEffectOptions:{duration:0.2},hideEffectOptions:{duration:0.2}});
}
$("linkwin_content").innerHTML="<div id=\"link-editor\">"+"<div><label>reads&nbsp;as:&nbsp;</label><input type=\"text\" size=\"30\" id=\"reads_as\" /></div>"+"<div><label>links&nbsp;to:&nbsp;</label><input type=\"text\" size=\"45\" id=\"links_to\" /></div>"+"<div class=\"buttons\">"+"<input type=\"button\" onclick=\"Wagn.linkEditor.save($F('reads_as'), $F('links_to'))\" value=\"Update Link\"/>"+"<input type=\"button\" onclick=\"Wagn.linkEditor.unlink($F('reads_as'))\" value=\"Delete Link\"/>"+"<input type=\"button\" onclick=\"Wagn.linkEditor.cancel()\" value=\"Cancel\"/>"+"</div></div>";
Wagn.Link.new_from_link(this.link).update_bound();
$("reads_as").value=this.link.reads_as();
$("links_to").value=this.link.links_to().unlinkify();
Wagn.linkwin.show();
}});
var Builder={NODEMAP:{AREA:"map",CAPTION:"table",COL:"table",COLGROUP:"table",LEGEND:"fieldset",OPTGROUP:"select",OPTION:"select",PARAM:"object",TBODY:"table",TD:"table",TFOOT:"table",TH:"table",THEAD:"table",TR:"table"},node:function(_65f){
_65f=_65f.toUpperCase();
var _660=this.NODEMAP[_65f]||"div";
var _661=document.createElement(_660);
try{
_661.innerHTML="<"+_65f+"></"+_65f+">";
}
catch(e){
}
var _662=_661.firstChild||null;
if(_662&&(_662.tagName!=_65f)){
_662=_662.getElementsByTagName(_65f)[0];
}
if(!_662){
_662=document.createElement(_65f);
}
if(!_662){
return;
}
if(arguments[1]){
if(this._isStringOrNumber(arguments[1])||(arguments[1] instanceof Array)){
this._children(_662,arguments[1]);
}else{
var _663=this._attributes(arguments[1]);
if(_663.length){
try{
_661.innerHTML="<"+_65f+" "+_663+"></"+_65f+">";
}
catch(e){
}
_662=_661.firstChild||null;
if(!_662){
_662=document.createElement(_65f);
for(attr in arguments[1]){
_662[attr=="class"?"className":attr]=arguments[1][attr];
}
}
if(_662.tagName!=_65f){
_662=_661.getElementsByTagName(_65f)[0];
}
}
}
}
if(arguments[2]){
this._children(_662,arguments[2]);
}
return _662;
},_text:function(text){
return document.createTextNode(text);
},ATTR_MAP:{"className":"class","htmlFor":"for"},_attributes:function(_665){
var _666=[];
for(attribute in _665){
_666.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+"=\""+_665[attribute].toString().escapeHTML()+"\"");
}
return _666.join(" ");
},_children:function(_667,_668){
if(typeof _668=="object"){
_668.flatten().each(function(e){
if(typeof e=="object"){
_667.appendChild(e);
}else{
if(Builder._isStringOrNumber(e)){
_667.appendChild(Builder._text(e));
}
}
});
}else{
if(Builder._isStringOrNumber(_668)){
_667.appendChild(Builder._text(_668));
}
}
},_isStringOrNumber:function(_66a){
return (typeof _66a=="string"||typeof _66a=="number");
},build:function(html){
var _66c=this.node("div");
$(_66c).update(html.strip());
return _66c.down();
},dump:function(_66d){
if(typeof _66d!="object"&&typeof _66d!="function"){
_66d=window;
}
var tags=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY "+"BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET "+"FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX "+"KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P "+"PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD "+"TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
tags.each(function(tag){
_66d[tag]=function(){
return Builder.node.apply(Builder,[tag].concat($A(arguments)));
};
});
}};
var Window=Class.create();
Window.prototype={initialize:function(id){
this.hasEffectLib=String.prototype.parseColor!=null;
this.options=Object.extend({className:"dialog",minWidth:100,minHeight:20,resizable:true,closable:true,minimizable:true,maximizable:true,draggable:true,userData:null,showEffect:(this.hasEffectLib?Effect.Appear:Element.show),hideEffect:(this.hasEffectLib?Effect.Fade:Element.hide),showEffectOptions:{},hideEffectOptions:{},effectOptions:null,parent:document.getElementsByTagName("body").item(0),title:"&nbsp;",url:null,onload:Prototype.emptyFunction,width:200,height:300,opacity:1},arguments[1]||{});
if(this.options.effectOptions){
Object.extend(this.options.hideEffectOptions,this.options.effectOptions);
Object.extend(this.options.showEffectOptions,this.options.effectOptions);
}
if(this.options.hideEffect==Element.hide){
this.options.hideEffect=function(){
Element.hide(this.element);
if(this.destroyOnClose){
this.destroy();
}
}.bind(this);
}
this.element=this._createWindow(id);
this.eventMouseDown=this._initDrag.bindAsEventListener(this);
this.eventMouseUp=this._endDrag.bindAsEventListener(this);
this.eventMouseMove=this._updateDrag.bindAsEventListener(this);
this.eventKeyPress=this._keyPress.bindAsEventListener(this);
this.eventOnLoad=this._getWindowBorderSize.bindAsEventListener(this);
this.topbar=$(this.element.id+"_top");
this.bottombar=$(this.element.id+"_bottom");
Event.observe(this.topbar,"mousedown",this.eventMouseDown);
Event.observe(this.bottombar,"mousedown",this.eventMouseDown);
Event.observe(window,"load",this.eventOnLoad);
if(this.options.draggable){
this.bottombar.addClassName("bottom_draggable");
this.topbar.addClassName("top_draggable");
}
if(this.options.resizable){
this.sizer=$(this.element.id+"_sizer");
Event.observe(this.sizer,"mousedown",this.eventMouseDown);
}
this.useLeft=null;
this.useTop=null;
if(arguments[1].left!=null){
this.element.setStyle({left:parseFloat(arguments[1].left)+"px"});
this.useLeft=true;
}
if(arguments[1].right!=null){
this.element.setStyle({right:parseFloat(arguments[1].right)+"px"});
this.useLeft=false;
}
if(this.useLeft==null){
this.element.setStyle({left:"0px"});
this.useLeft=true;
}
if(arguments[1].top!=null){
this.element.setStyle({top:parseFloat(arguments[1].top)+"px"});
this.useTop=true;
}
if(arguments[1].bottom!=null){
this.element.setStyle({bottom:parseFloat(arguments[1].bottom)+"px"});
this.useTop=false;
}
if(this.useTop==null){
this.element.setStyle({top:"0px"});
this.useTop=true;
}
this.storedLocation=null;
this.setOpacity(this.options.opacity);
if(arguments[1].zIndex){
this.setZIndex(arguments[1].zIndex);
}
this.destroyOnClose=false;
this._getWindowBorderSize();
this.setSize(this.options.width,this.options.height);
this.setTitle(this.options.title);
Windows.register(this);
},destroy:function(){
Windows.notify("onDestroy",this);
Event.stopObserving(this.topbar,"mousedown",this.eventMouseDown);
Event.stopObserving(this.bottombar,"mousedown",this.eventMouseDown);
Event.stopObserving(window,"load",this.eventOnLoad);
Event.stopObserving($(this.element.id+"_content"),"load",this.options.onload);
if(this.sizer){
Event.stopObserving(this.sizer,"mousedown",this.eventMouseDown);
}
if(this.iefix){
Element.remove(this.iefix);
}
Element.remove(this.element);
Windows.unregister(this);
},setDelegate:function(_671){
this.delegate=_671;
},getDelegate:function(){
return this.delegate;
},getContent:function(){
return $(this.element.id+"_content");
},setContent:function(id,_673,_674){
var d=null;
var p=null;
if(_673){
d=Element.getDimensions(id);
}
if(_674){
p=Position.cumulativeOffset($(id));
}
var _677=this.getContent();
_677.appendChild($(id));
$(id).show();
if(_673){
this.setSize(d.width,d.height);
}
if(_674){
this.setLocation(p[1]-this.heightN,p[0]-this.widthW);
}
},setCookie:function(name,_679,path,_67b,_67c){
name=name||this.element.id;
this.cookie=[name,_679,path,_67b,_67c];
var _67d=WindowUtilities.getCookie(name);
if(_67d){
var _67e=_67d.split(",");
var x=_67e[0].split(":");
var y=_67e[1].split(":");
var w=parseFloat(_67e[2]),h=parseFloat(_67e[3]);
var mini=_67e[4];
var maxi=_67e[5];
this.setSize(w,h);
if(mini=="true"){
this.doMinimize=true;
}else{
if(maxi=="true"){
this.doMaximize=true;
}
}
this.useLeft=x[0]=="l";
this.useTop=y[0]=="t";
this.element.setStyle(this.useLeft?{left:x[1]}:{right:x[1]});
this.element.setStyle(this.useTop?{top:y[1]}:{bottom:y[1]});
}
},getId:function(){
return this.element.id;
},setDestroyOnClose:function(){
Object.extend(this.options.hideEffectOptions,{afterFinish:this.destroy.bind(this)});
this.destroyOnClose=true;
},_initDrag:function(_685){
this.pointer=[Event.pointerX(_685),Event.pointerY(_685)];
if(Event.element(_685)==this.sizer){
this.doResize=true;
this.widthOrg=this.width;
this.heightOrg=this.height;
this.bottomOrg=parseFloat(this.element.getStyle("bottom"));
this.rightOrg=parseFloat(this.element.getStyle("right"));
Windows.notify("onStartResize",this);
}else{
this.doResize=false;
var _686=$(this.getId()+"_close");
if(_686&&Position.within(_686,this.pointer[0],this.pointer[1])){
return;
}
this.toFront();
if(!this.options.draggable){
return;
}
Windows.notify("onStartMove",this);
}
Event.observe(document,"mouseup",this.eventMouseUp,false);
Event.observe(document,"mousemove",this.eventMouseMove,false);
WindowUtilities.disableScreen("__invisible__","__invisible__",false);
document.body.ondrag=function(){
return false;
};
document.body.onselectstart=function(){
return false;
};
Event.stop(_685);
},_updateDrag:function(_687){
var _688=[Event.pointerX(_687),Event.pointerY(_687)];
var dx=_688[0]-this.pointer[0];
var dy=_688[1]-this.pointer[1];
if(this.doResize){
this.setSize(this.widthOrg+dx,this.heightOrg+dy);
dx=this.width-this.widthOrg;
dy=this.height-this.heightOrg;
if(!this.useLeft){
this.element.setStyle({right:(this.rightOrg-dx)+"px"});
}
if(!this.useTop){
this.element.setStyle({bottom:(this.bottomOrg-dy)+"px"});
}
}else{
this.pointer=_688;
if(this.useLeft){
this.element.setStyle({left:parseFloat(this.element.getStyle("left"))+dx+"px"});
}else{
this.element.setStyle({right:parseFloat(this.element.getStyle("right"))-dx+"px"});
}
if(this.useTop){
this.element.setStyle({top:parseFloat(this.element.getStyle("top"))+dy+"px"});
}else{
this.element.setStyle({bottom:parseFloat(this.element.getStyle("bottom"))-dy+"px"});
}
}
if(this.iefix){
this._fixIEOverlapping();
}
this._removeStoreLocation();
Event.stop(_687);
},_endDrag:function(_68b){
WindowUtilities.enableScreen("__invisible__");
if(this.doResize){
Windows.notify("onEndResize",this);
}else{
Windows.notify("onEndMove",this);
}
Event.stopObserving(document,"mouseup",this.eventMouseUp,false);
Event.stopObserving(document,"mousemove",this.eventMouseMove,false);
this._saveCookie();
Event.stop(_68b);
document.body.ondrag=null;
document.body.onselectstart=null;
},_keyPress:function(_68c){
},_createWindow:function(id){
var _68e=this.options.className;
win=document.createElement("div");
win.setAttribute("id",id);
win.className="dialog";
var _68f;
if(this.options.url){
_68f="<IFRAME name=\""+id+"_content\"  id=\""+id+"_content\" SRC=\""+this.options.url+"\"> </IFRAME>";
}else{
_68f="<DIV id=\""+id+"_content\" class=\""+_68e+"_content\"> </DIV>";
}
var _690=this.options.closable?"<div class='"+_68e+"_close' id='"+id+"_close' onclick='Windows.close(\""+id+"\")'> </div>":"";
var _691=this.options.minimizable?"<div class='"+_68e+"_minimize' id='"+id+"_minimize' onclick='Windows.minimize(\""+id+"\")'> </div>":"";
var _692=this.options.maximizable?"<div class='"+_68e+"_maximize' id='"+id+"_maximize' onclick='Windows.maximize(\""+id+"\")'> </div>":"";
var _693=this.options.resizable?"class='"+_68e+"_sizer' id='"+id+"_sizer'":"class='"+_68e+"_se'";
win.innerHTML=_690+_691+_692+"      <table id='"+id+"_row1' class=\"top table_window\">        <tr>          <td class='"+_68e+"_nw'>&nbsp;</td>          <td class='"+_68e+"_n'><div id='"+id+"_top' class='"+_68e+"_title title_window'>"+this.options.title+"</div></td>          <td class='"+_68e+"_ne'>&nbsp;</td>        </tr>      </table>      <table id='"+id+"_row2' class=\"mid table_window\">        <tr>          <td class='"+_68e+"_w'></td>            <td id='"+id+"_table_content' class='"+_68e+"_content' valign='top'>"+_68f+"</td>          <td class='"+_68e+"_e'></td>        </tr>      </table>        <table id='"+id+"_row3' class=\"bot table_window\">        <tr>          <td class='"+_68e+"_sw'>&nbsp;</td>            <td class='"+_68e+"_s'><div id='"+id+"_bottom' class='status_bar'>&nbsp;</div></td>            <td "+_693+">&nbsp;</td>        </tr>      </table>    ";
Element.hide(win);
this.options.parent.insertBefore(win,this.options.parent.firstChild);
Event.observe($(id+"_content"),"load",this.options.onload);
return win;
},setLocation:function(top,left){
if(top<0){
top=0;
}
if(left<0){
left=0;
}
this.element.setStyle({top:top+"px"});
this.element.setStyle({left:left+"px"});
this.useLeft=true;
this.useTop=true;
},getSize:function(){
return {width:width,height:height};
},setSize:function(_696,_697){
_696=parseFloat(_696);
_697=parseFloat(_697);
if(_696<this.options.minWidth){
_696=this.options.minWidth;
}
if(_697<this.options.minHeight){
_697=this.options.minHeight;
}
if(this.options.maxHeight&&_697>this.options.maxHeight){
_697=this.options.maxHeight;
}
if(this.options.maxWidth&&_696>this.options.maxWidth){
_696=this.options.maxWidth;
}
this.width=_696;
this.height=_697;
this.element.setStyle({width:_696+this.widthW+this.widthE+"px"});
this.element.setStyle({height:_697+this.heightN+this.heightS+"px"});
var _698=$(this.element.id+"_content");
_698.setStyle({height:_697+"px"});
_698.setStyle({width:_696+"px"});
},toFront:function(){
this.setZIndex(Windows.maxZIndex+20);
},show:function(_699){
if(_699){
WindowUtilities.disableScreen(this.options.className);
this.modal=true;
this.setZIndex(Windows.maxZIndex+20);
Windows.unsetOverflow(this);
Event.observe(document,"keypress",this.eventKeyPress);
}
if(this.oldStyle){
this.getContent().setStyle({overflow:this.oldStyle});
}
this.setSize(this.width,this.height);
if(this.options.showEffect!=Element.show&&this.options.showEffectOptions){
this.options.showEffect(this.element,this.options.showEffectOptions);
}else{
this.options.showEffect(this.element);
}
this._checkIEOverlapping();
},showCenter:function(_69a){
this.setSize(this.width,this.height);
this._center();
this.show(_69a);
},_center:function(){
var _69b=WindowUtilities.getWindowScroll();
var _69c=WindowUtilities.getPageSize();
this.setLocation(_69b.top+(_69c.windowHeight-(this.height+this.heightN+this.heightS))/2,_69b.left+(_69c.windowWidth-(this.width+this.widthW+this.widthE))/2);
this.toFront();
},hide:function(){
if(this.modal){
WindowUtilities.enableScreen();
Windows.resetOverflow();
Event.stopObserving(document,"keypress",this.eventKeyPress);
}
this.getContent().setStyle({overflow:"hidden"});
this.oldStyle=this.getContent().getStyle("overflow");
this.options.hideEffect(this.element,this.options.hideEffectOptions);
if(this.iefix){
this.iefix.hide();
}
},minimize:function(){
var r2=$(this.getId()+"_row2");
var dh=r2.getDimensions().height;
if(r2.visible()){
var h=this.element.getHeight()-dh;
r2.hide();
this.element.setStyle({height:h+"px"});
if(!this.useTop){
var _6a0=parseFloat(this.element.getStyle("bottom"));
this.element.setStyle({bottom:(_6a0+dh)+"px"});
}
}else{
var h=this.element.getHeight()+dh;
this.element.setStyle({height:h+"px"});
if(!this.useTop){
var _6a0=parseFloat(this.element.getStyle("bottom"));
this.element.setStyle({bottom:(_6a0-dh)+"px"});
}
r2.show();
this.toFront();
}
Windows.notify("onMinimize",this);
this._saveCookie();
},maximize:function(){
if(this.storedLocation!=null){
this._restoreLocation();
if(this.iefix){
this.iefix.hide();
}
}else{
this._storeLocation();
Windows.unsetOverflow(this);
var _6a1=WindowUtilities.getWindowScroll();
var _6a2=WindowUtilities.getPageSize();
this.element.setStyle(this.useLeft?{left:_6a1.left}:{right:_6a1.left});
this.element.setStyle(this.useTop?{top:_6a1.top}:{bottom:_6a1.top});
this.setSize(_6a2.windowWidth-this.widthW-this.widthE,_6a2.windowHeight-this.heightN-this.heightS);
this.toFront();
if(this.iefix){
this._fixIEOverlapping();
}
}
Windows.notify("onMaximize",this);
this._saveCookie();
},isMinimized:function(){
var r2=$(this.getId()+"_row2");
return !r2.visible();
},isMaximized:function(){
return (this.storedLocation!=null);
},setOpacity:function(_6a4){
if(Element.setOpacity){
Element.setOpacity(this.element,_6a4);
}
},setZIndex:function(_6a5){
this.element.setStyle({zIndex:_6a5});
Windows.updateZindex(_6a5,this);
},setTitle:function(_6a6){
if(!_6a6||_6a6==""){
_6a6="&nbsp;";
}
Element.update(this.element.id+"_top",_6a6);
},setStatusBar:function(_6a7){
var _6a8=$(this.getId()+"_bottom");
if(typeof (_6a7)=="object"){
if(this.bottombar.firstChild){
this.bottombar.replaceChild(_6a7,this.bottombar.firstChild);
}else{
this.bottombar.appendChild(_6a7);
}
}else{
this.bottombar.innerHTML=_6a7;
}
},_checkIEOverlapping:function(){
if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(this.element.getStyle("position")=="absolute")){
new Insertion.After(this.element.id,"<iframe id=\""+this.element.id+"_iefix\" "+"style=\"display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);\" "+"src=\"javascript:false;\" frameborder=\"0\" scrolling=\"no\"></iframe>");
this.iefix=$(this.element.id+"_iefix");
}
if(this.iefix){
setTimeout(this._fixIEOverlapping.bind(this),50);
}
},_fixIEOverlapping:function(){
Position.clone(this.element,this.iefix);
this.iefix.style.zIndex=this.element.style.zIndex-1;
this.iefix.show();
},_getWindowBorderSize:function(_6a9){
var div=this._createHiddenDiv(this.options.className+"_n");
this.heightN=Element.getDimensions(div).height;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_s");
this.heightS=Element.getDimensions(div).height;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_e");
this.widthE=Element.getDimensions(div).width;
div.parentNode.removeChild(div);
var div=this._createHiddenDiv(this.options.className+"_w");
this.widthW=Element.getDimensions(div).width;
div.parentNode.removeChild(div);
if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){
this.setSize(this.width,this.height);
}
if(this.doMaximize){
this.maximize();
}
if(this.doMinimize){
this.minimize();
}
},_createHiddenDiv:function(_6ab){
var _6ac=document.getElementsByTagName("body").item(0);
var win=document.createElement("div");
win.setAttribute("id",this.element.id+"_tmp");
win.className=_6ab;
win.style.display="none";
win.innerHTML="";
_6ac.insertBefore(win,_6ac.firstChild);
return win;
},_storeLocation:function(){
if(this.storedLocation==null){
this.storedLocation={useTop:this.useTop,useLeft:this.useLeft,top:this.element.getStyle("top"),bottom:this.element.getStyle("bottom"),left:this.element.getStyle("left"),right:this.element.getStyle("right"),width:this.width,height:this.height};
}
},_restoreLocation:function(){
if(this.storedLocation!=null){
this.useLeft=this.storedLocation.useLeft;
this.useTop=this.storedLocation.useTop;
this.element.setStyle(this.useLeft?{left:this.storedLocation.left}:{right:this.storedLocation.right});
this.element.setStyle(this.useTop?{top:this.storedLocation.top}:{bottom:this.storedLocation.bottom});
this.setSize(this.storedLocation.width,this.storedLocation.height);
Windows.resetOverflow();
this._removeStoreLocation();
}
},_removeStoreLocation:function(){
this.storedLocation=null;
},_saveCookie:function(){
if(this.cookie){
var _6ae="";
if(this.useLeft){
_6ae+="l:"+(this.storedLocation?this.storedLocation.left:this.element.getStyle("left"));
}else{
_6ae+="r:"+(this.storedLocation?this.storedLocation.right:this.element.getStyle("right"));
}
if(this.useTop){
_6ae+=",t:"+(this.storedLocation?this.storedLocation.top:this.element.getStyle("top"));
}else{
_6ae+=",b:"+(this.storedLocation?this.storedLocation.bottom:this.element.getStyle("bottom"));
}
_6ae+=","+(this.storedLocation?this.storedLocation.width:this.width);
_6ae+=","+(this.storedLocation?this.storedLocation.height:this.height);
_6ae+=","+this.isMinimized();
_6ae+=","+this.isMaximized();
WindowUtilities.setCookie(_6ae,this.cookie);
}
}};
var Windows={windows:[],observers:[],focusedWindow:null,maxZIndex:0,addObserver:function(_6af){
this.removeObserver(_6af);
this.observers.push(_6af);
},removeObserver:function(_6b0){
this.observers=this.observers.reject(function(o){
return o==_6b0;
});
},notify:function(_6b2,win){
this.observers.each(function(o){
if(o[_6b2]){
o[_6b2](_6b2,win);
}
});
},getWindow:function(id){
return this.windows.detect(function(d){
return d.getId()==id;
});
},register:function(win){
this.windows.push(win);
},unregister:function(win){
this.windows=this.windows.reject(function(d){
return d==win;
});
},close:function(id){
var win=this.getWindow(id);
if(win){
if(win.getDelegate()&&!win.getDelegate().canClose(win)){
return;
}
this.notify("onClose",win);
win.hide();
}
},closeAll:function(){
this.windows.each(function(w){
Windows.close(w.getId());
});
},minimize:function(id){
var win=this.getWindow(id);
if(win){
win.minimize();
}
},maximize:function(id){
var win=this.getWindow(id);
if(win){
win.maximize();
}
},unsetOverflow:function(_6c1){
this.windows.each(function(d){
d.oldOverflow=d.getContent().getStyle("overflow")||"auto";
d.getContent().setStyle({overflow:"hidden"});
});
if(_6c1&&_6c1.oldOverflow){
_6c1.getContent().setStyle({overflow:_6c1.oldOverflow});
}
},resetOverflow:function(){
this.windows.each(function(d){
if(d.oldOverflow){
d.getContent().setStyle({overflow:d.oldOverflow});
}
});
},updateZindex:function(_6c4,win){
if(_6c4>this.maxZIndex){
this.maxZIndex=_6c4;
}
this.focusedWindow=win;
}};
var Dialog={win:null,confirm:function(_6c6,_6c7){
_6c7=_6c7||{};
var _6c8=_6c7.okLabel?_6c7.okLabel:"Ok";
var _6c9=_6c7.cancelLabel?_6c7.cancelLabel:"Cancel";
var _6ca=_6c7.windowParameters||{};
_6ca.className=_6ca.className||"alert";
buttonClass=_6c7.buttonClass?"class="+_6c7.buttonClass:"";
var _6cb="\t\t\t<div class='"+_6ca.className+"_message'>"+_6c6+"</div>\t\t\t\t<div class='"+_6ca.className+"_buttons'>\t\t\t\t\t<input type='button' value='"+_6c8+"' onclick='Dialog.okCallback()'"+buttonClass+"/>\t\t\t\t\t<input type='button' value='"+_6c9+"' onclick='Dialog.cancelCallback()"+buttonClass+"'/>\t\t\t\t</div>\t\t";
this._openDialog(_6cb,_6c7);
return this.win;
},alert:function(_6cc,_6cd){
_6cd=_6cd||{};
var _6ce=_6cd.okLabel?_6cd.okLabel:"Ok";
var _6cf=_6cd.windowParameters||{};
_6cf.className=_6cf.className||"alert";
buttonClass=_6cd.buttonClass?"class="+_6cd.buttonClass:"";
var _6d0="\t\t\t<div class='"+_6cf.className+"_message'>"+_6cc+"</div>\t\t\t\t<div class='"+_6cf.className+"_buttons'>\t\t\t\t\t<input type='button' value='"+_6ce+"' onclick='Dialog.okCallback()"+buttonClass+"'/>\t\t\t\t</div>";
return this._openDialog(_6d0,_6cd);
},info:function(_6d1,_6d2){
_6d2=_6d2||{};
_6d2.windowParameters=_6d2.windowParameters||{};
var _6d3=_6d2.windowParameters.className||"alert";
var _6d4="<div id='modal_dialog_message' class='"+_6d3+"_message'>"+_6d1+"</div>";
if(_6d2.showProgress){
_6d4+="<div id='modal_dialog_progress' class='"+_6d3+"_progress'>\t</div>";
}
_6d2.windowParameters.ok=null;
_6d2.windowParameters.cancel=null;
_6d2.windowParameters.className=_6d3;
return this._openDialog(_6d4,_6d2);
},setInfoMessage:function(_6d5){
$("modal_dialog_message").update(_6d5);
},closeInfo:function(){
Windows.close("modal_dialog");
},_openDialog:function(_6d6,_6d7){
if(this.win){
this.win.destroy();
}
if(!_6d7.windowParameters.height&&!_6d7.windowParameters.width){
_6d7.windowParameters.width=WindowUtilities.getPageSize().pageWidth/2;
}
if(!_6d7.windowParameters.height||!_6d7.windowParameters.width){
var _6d8=document.getElementsByTagName("body").item(0);
var _6d9=document.createElement("div");
if(_6d7.windowParameters.height){
_6d9.style.height=_6d7.windowParameters.height+"px";
}else{
_6d9.style.width=_6d7.windowParameters.width+"px";
}
_6d9.style.position="absolute";
_6d9.style.top="0";
_6d9.style.left="0";
_6d9.style.display="none";
_6d9.setAttribute("id","_dummy_dialog_");
_6d9.innerHTML=_6d6;
_6d8.insertBefore(_6d9,_6d8.firstChild);
if(_6d7.windowParameters.height){
_6d7.windowParameters.width=$("_dummy_dialog_").getDimensions().width+5;
}else{
_6d7.windowParameters.height=$("_dummy_dialog_").getDimensions().height+5;
}
_6d8.removeChild(_6d9);
}
var _6da=_6d7&&_6d7.windowParameters?_6d7.windowParameters:{};
_6da.resizable=_6da.resizable||false;
_6da.effectOptions=_6da.effectOptions||{duration:1};
_6da.minimizable=false;
_6da.maximizable=false;
_6da.closable=false;
this.win=new Window("modal_dialog",_6da);
this.win.getContent().innerHTML=_6d6;
this.win.showCenter(true);
this.win.cancelCallback=_6d7.cancel;
this.win.okCallback=_6d7.ok;
if(!this.eventResize){
this.eventResize=this.recenter.bindAsEventListener(this);
}
Event.observe(window,"resize",this.eventResize);
Event.observe(window,"scroll",this.eventResize);
return this.win;
},okCallback:function(){
Event.stopObserving(window,"resize",this.eventResize);
Event.stopObserving(window,"scroll",this.eventResize);
if(!this.win.okCallback||this.win.okCallback(this.win)){
this.win.hide();
}
},cancelCallback:function(){
this.win.hide();
Event.stopObserving(window,"resize",this.eventResize);
Event.stopObserving(window,"scroll",this.eventResize);
if(this.win.cancelCallback){
this.win.cancelCallback(this.win);
}
},recenter:function(_6db){
var _6dc=WindowUtilities.getPageSize();
if($("overlay_modal")){
$("overlay_modal").style.height=(_6dc.pageHeight+"px");
}
this.win._center();
}};
var isIE=navigator.appVersion.match(/MSIE/)=="MSIE";
var WindowUtilities={getWindowScroll:function(){
var w=window;
var T,L,W,H;
with(w.document){
if(w.document.documentElement&&documentElement.scrollTop){
T=documentElement.scrollTop;
L=documentElement.scrollLeft;
}else{
if(w.document.body){
T=body.scrollTop;
L=body.scrollLeft;
}
}
if(w.innerWidth){
W=w.innerWidth;
H=w.innerHeight;
}else{
if(w.document.documentElement&&documentElement.clientWidth){
W=documentElement.clientWidth;
H=documentElement.clientHeight;
}else{
W=body.offsetWidth;
H=body.offsetHeight;
}
}
}
return {top:T,left:L,width:W,height:H};
},getPageSize:function(){
var _6e2,_6e3;
if(window.innerHeight&&window.scrollMaxY){
_6e2=document.body.scrollWidth;
_6e3=window.innerHeight+window.scrollMaxY;
}else{
if(document.body.scrollHeight>document.body.offsetHeight){
_6e2=document.body.scrollWidth;
_6e3=document.body.scrollHeight;
}else{
_6e2=document.body.offsetWidth;
_6e3=document.body.offsetHeight;
}
}
var _6e4,_6e5;
if(self.innerHeight){
_6e4=self.innerWidth;
_6e5=self.innerHeight;
}else{
if(document.documentElement&&document.documentElement.clientHeight){
_6e4=document.documentElement.clientWidth;
_6e5=document.documentElement.clientHeight;
}else{
if(document.body){
_6e4=document.body.clientWidth;
_6e5=document.body.clientHeight;
}
}
}
var _6e6,_6e7;
if(_6e3<_6e5){
_6e6=_6e5;
}else{
_6e6=_6e3;
}
if(_6e2<_6e4){
_6e7=_6e4;
}else{
_6e7=_6e2;
}
return {pageWidth:_6e7,pageHeight:_6e6,windowWidth:_6e4,windowHeight:_6e5};
},disableScreen:function(_6e8,id,_6ea){
id=id||"overlay_modal";
_6ea=_6ea||true;
WindowUtilities.initLightbox(id,_6e8);
var _6eb=document.getElementsByTagName("body").item(0);
var _6ec=$(id);
var _6ed=WindowUtilities.getPageSize();
if(_6ea&&isIE){
$$("select").each(function(_6ee){
_6ee.style.visibility="hidden";
});
$$("#"+id+" select").each(function(_6ef){
_6ef.style.visibility="visible";
});
}
_6ec.style.height=(_6ed.pageHeight+"px");
_6ec.style.display="block";
},enableScreen:function(id){
id=id||"overlay_modal";
var _6f1=$(id);
if(_6f1){
_6f1.style.display="none";
if(isIE){
$$("select").each(function(_6f2){
_6f2.style.visibility="visible";
});
}
_6f1.parentNode.removeChild(_6f1);
}
},initLightbox:function(id,_6f4){
if($(id)){
Element.setStyle(id,{zIndex:Windows.maxZIndex+10});
}else{
var _6f5=document.getElementsByTagName("body").item(0);
var _6f6=document.createElement("div");
_6f6.setAttribute("id",id);
_6f6.className="overlay_"+_6f4;
_6f6.style.display="none";
_6f6.style.position="absolute";
_6f6.style.top="0";
_6f6.style.left="0";
_6f6.style.zIndex=Windows.maxZIndex+10;
_6f6.style.width="100%";
_6f5.insertBefore(_6f6,_6f5.firstChild);
}
},setCookie:function(_6f7,_6f8){
document.cookie=_6f8[0]+"="+escape(_6f7)+((_6f8[1])?"; expires="+_6f8[1].toGMTString():"")+((_6f8[2])?"; path="+_6f8[2]:"")+((_6f8[3])?"; domain="+_6f8[3]:"")+((_6f8[4])?"; secure":"");
},getCookie:function(name){
var dc=document.cookie;
var _6fb=name+"=";
var _6fc=dc.indexOf("; "+_6fb);
if(_6fc==-1){
_6fc=dc.indexOf(_6fb);
if(_6fc!=0){
return null;
}
}else{
_6fc+=2;
}
var end=document.cookie.indexOf(";",_6fc);
if(end==-1){
end=dc.length;
}
return unescape(dc.substring(_6fc+_6fb.length,end));
}};

