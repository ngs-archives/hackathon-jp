
gadgets.util.registerOnLoadHandler(init);


function txt(dom,tag){
    return dom.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}

    
function show(oj){ 
    var html = new Array();
    html.push("<h1>");
    var dom = oj.data;
    html.push( txt(dom,"title") );
    html.push("</h1>");
    var items = dom.getElementsByTagName("item");
    $.each(items,function(){
	    html.push("<h2>" + txt(this,"title") + "</h2>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    cdata.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    //html.push("<blockquote>" + cdata + "</blockquote>");
	    html.push("<img src='" + img + "' width='80' />");
	    html.push("ASIN: " + asin );
	});
    document.getElementById('friends').innerHTML += html.join('');
}

var params = {};
params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;

gadgets.io.makeRequest("http://booklog.jp/users/amaya/feed/RSS1", show, params );
			  
function init() {
    loadFriends();
    loadData();
}

function loadFriends() {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');
    
    var viewerFriends = opensocial.newIdSpec({ "userId" : "VIEWER", "groupId" : "FRIENDS" });
    var opt_params = {};
    opt_params[opensocial.DataRequest.PeopleRequestFields.MAX] = 100;
    req.add(req.newFetchPeopleRequest(viewerFriends, opt_params), 'viewerFriends');
    
    req.send(onLoadFriends);
}

function onLoadFriends(data) {
    var viewer = data.get('viewer').getData();
    var viewerFriends = data.get('viewerFriends').getData();
    
    html = new Array();
    html.push('<ul>');
    viewerFriends.each(function(person) {
	    if (person.getId()) {
		html.push('<li>: ' + person.getDisplayName() + "</li>");
	    }
	});
    html.push('</ul>');
    //document.getElementById('friends').innerHTML = html.join('');
}

function loadData() {
    var params = {};
    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    var escapeParams = {};
    escapeParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = opensocial.EscapeType.NONE;

    var req = opensocial.neDataRequest();
    var idSpec = opensocial.newIdSpec(params);
    req.add(req.newFetchPeopleRequest);

}
