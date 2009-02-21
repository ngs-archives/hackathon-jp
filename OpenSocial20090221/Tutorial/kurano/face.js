function loadFriends() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest('VIEWER'), 'viewer');
  req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS'), 'viewerFriends');
  req.send(onLoadFriends);
}

function onLoadFriends(data) {
  var viewer = data.get('viewer').getData();
  var viewerFriends = data.get('viewerFriends').getData();
  
  html = new Array();
  html.push('<ul>');
  viewerFriends.each(function(person) {		
    	html.push('<img src="' + person.getField(opensocial.Person.Field.THUMBNAIL_URL) + '"><br />');
	html.push(person.getDisplayName() + "<br />")
  });


  html.push('</ul>')
  document.getElementById('friends').innerHTML = html.join('');
}

function init() {
  loadFriends();
}