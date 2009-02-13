
gadgets.util.registerOnLoadHandler(init);
    
function show(feed){ 
    var html= "";
    //Access the fields in the feed
    html.push("<h1>");
    html.push( feed.Title );
    html.push("</h1>");
}

gadgets.io.makeRequest("http://opensocialapis.blogspot.com/atom.xml",
		       show,
		       {'method' : 'GET', 'contentType' : 'feed', 'numEntries' : '5', 'getSummaries' : 'true'}
		       );
			  
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
