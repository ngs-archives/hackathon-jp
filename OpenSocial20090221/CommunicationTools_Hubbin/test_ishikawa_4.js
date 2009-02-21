
// Based on OpenSocialApps_2
// http://sandbox.orkut.com/Main#Application.aspx?appId=591740862440&nocache=1

var _peopleArea_html = [];

var _targetFields = [
	opensocial.Person.Field.BODY_TYPE,
	opensocial.Person.Field.DRINKER,
	opensocial.Person.Field.ETHNICITY,
	opensocial.Person.Field.RELIGION,
	opensocial.Person.Field.CHILDREN,
	opensocial.Person.Field.PETS,
	opensocial.Person.Field.SEXUAL_ORIENTATION,
	opensocial.Person.Field.SMOKER,
	opensocial.Person.Field.BODY_TYPE,
	opensocial.Person.Field.JOBS,
];

function init() {
	getFriends();
}

function getFriends() {
	var params = {};
	params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = _targetFields;
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPeopleRequest('VIEWER',         params), 'viewer');
	req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', params), 'viewerFriends');
	req.send(onLoadFriends);
}


function onLoadFriends(data) {
	var viewer        = data.get('viewer').getData();
	var viewerFriends = data.get('viewerFriends').getData();
	buildPersonHtml(viewer);
	viewerFriends.each(buildPersonHtml);
	document.getElementById('peopleArea').innerHTML = html.join('');
}

function buildPersonHtml(person) {
	html.push('<div class="person">');
	html.push('<h3>' + person.getDisplayName() + '</h3>');
	html.push('<div>');
	html.push('<img src="'   + person.getField(opensocial.Person.Field.THUMBNAIL_URL    ) + '" align="left" />');
	html.push('<ul>');
	for (var x in _targetFields) {
		html.push('<li>'   + person.getField(x) + '</li>');
	}
	html.push('</ul>');
	html.push('<br clear="all" />');
	html.push('</div>');
}
