/**
 * Book Ringr
 * This JavaScript file is for Profile view.
 */
/*
 function txt(dom,tag){
 return dom.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
 }
 function init(){
 
 
 var params = {};
 params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
 params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
 gadgets.io.makeRequest("http://booklog.jp/users/msauccky/feed/RSS1", function(response){
 var html = new Array();
 html.push("<h1>");
 var dom = response.data;
 html.push(txt(dom, "title"));
 html.push("</h1>");
 var items = dom.getElementsByTagName("item");
 $.each(items, function(){
 html.push("<h2>" + txt(this, "title") + "</h2>");
 var cdata = txt(this, "description");
 cdata.match(/img src="(.+?)"/);
 var img = RegExp.$1;
 cdata.match(/asin\/(\w+)/);
 var asin = RegExp.$1;
 //html.push("<blockquote>" + cdata + "</blockquote>");
 html.push("<img src='" + img + "' width='80' />");
 html.push("ASIN: " + asin);
 });
 document.getElementById('friends').innerHTML += html.join('');
 }, params);
 
 var req = opensocial.newDataRequest();
 }
 */
var value;
var isOwner;

function init(){
    var req = opensocial.newDataRequest();
    var params = {};
    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    params[opensocial.IdSpec.Field.GROUP_ID] = "SELF";
    
    var idSpec = opensocial.newIdSpec(params);
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    req.send(function(response){
        var viewer = response.get("viewer").getData();
        if (viewer) {
            isOwner = viewer.isOwner();
            alert(isOwner);
        }
        else {
            alert("error");
        }
    });
    
    
    // if owner
    
    // if viewer
    
    
    req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    
    params = {};
    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    idSpec = opensocial.newIdSpec(params);
    
    req.add(req.newFetchPersonAppDataRequest(idSpec, "value"), "data");
    req.send(function(response){
        var viewer = response.get("viewer").getData();
        if (viewer) {
            var data = response.get("data").getData()[viewer.getId()];
            value = 0;
            if (data && data["value"]) {
                value = Number(data["value"]);
            }
        }
        else {
            //alert("no install");
        }
    });
    
}

function onClickSave(){
    alert($("#test").text);
    
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "value", ++value));
    req.send(function(response){
    
    });
}


// TODO: Write the code for Profile view.
