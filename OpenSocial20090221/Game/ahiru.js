var loadFriends = function() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest('VIEWER'), 'viewer');
  req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS'), 'viewerFriends');
  req.send(onLoadFriends);
}

var onLoadFriends = function(data) {
  var viewer = data.get('viewer').getData();
  var viewerFriends = data.get('viewerFriends').getData();

  html = new Array();
  html.push('<ul>');
  viewerFriends.each(function(person) {
    html.push('<li>' + person.getDisplayName() + "</li>");
  });
  html.push('</ul>');
  document.getElementById('friends').innerHTML = html.join('');
}

var init = function() {
  loadFriends();
}
