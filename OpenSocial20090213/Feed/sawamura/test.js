
gadgets.util.registerOnLoadHandler(init);


function txt(dom,tag){
    retrun dom.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}

    
function show(oj){ 
    var html = new Array();
    html.push("<h1>");
    var dom = oj.data;
    html.push( txt(title) );
    html.push("</h1>");
    document.getElementById('friends').innerHTML += html.join('');
}

var params = {};
params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;

gadgets.io.makeRequest("http://booklog.jp/users/sawamur/feed/RSS1", show, params );
			  
function init() {
    loadFriends();
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
    document.getElementById('friends').innerHTML = html.join('');
}
