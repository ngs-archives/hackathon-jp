
gadgets.util.registerOnLoadHandler(init);
    
function show(feed){ 
    var html = new Array();
    html.push("<h1>");
    html.push( feed.data.Title );
    html.push("</h1>");
    $.each(feed.data.Entry,function(data){
	    html.push("<h2>" + this.Link + "</h2>");
	    html.push("<p>" + this.Description + "</p>");
	    html.push("<p>" + this.Summary + "</p>");
	});
    document.getElementById('friends').innerHTML += html.join('');
}

var params = {};
params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.FEED;

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
