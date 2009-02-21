function loadFriends() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest('VIEWER'), 'viewer');
  req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS'), 'viewerFriends');
  req.add(req.newFetchPeopleRequest('THUMBNAIL_URL'), 'viewerFace');
  req.send(onLoadFriends);
}

function onLoadFriends(data) {
  var viewer = data.get('viewer').getData();
  var viewerFriends = data.get('viewerFriends').getData();
  var viewerFace = data.get('viewerFace').getData();
  
  html = new Array();
  html.push('<ul>');
  viewerFace.each(function(person) {
    html.push('<li>' + person.getField() + "</li>");
  });


  html.push('</ul>');
  document.getElementById('friends').innerHTML = html.join('');
}

function init() {
  loadFriends();
}