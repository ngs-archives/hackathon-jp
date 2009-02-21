
// Based on OpenSocialApps_2
// http://sandbox.orkut.com/Main#Application.aspx?appId=591740862440&nocache=1

function init() {
	getFriends();
}

function getFriends() {
	var params = {};
/*	params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = [
		opensocial.Person.Field.AGE,
		opensocial.Person.Field.DATE_OF_BIRTH,
		opensocial.Person.Field.GENDER,
		opensocial.Person.Field.CURRENT_LOCATION
	];*/
	params[opensocial.DataRequest.PeopleRequestFields] = [
		opensocial.Person.Field.AGE,
		opensocial.Person.Field.GENDER,
		opensocial.Person.Field.CURRENT_LOCATION
	];
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', params), 'viewerFriends');
	req.send(onLoadFriends);
}

function onLoadFriends(data) {
	var viewerFriends = data.get('viewerFriends').getData();
	html = new Array();
	viewerFriends.each(function(person) {
//		var age     = person.getField(opensocial.Person.Field.AGE);
		var gender  = person.getField(opensocial.Person.Field.GENDER);
		var gender_str = '';
		if (gender.getKey() === opensocial.Enum.Gender.MALE) {
			gender_str = 'Male';
		} else if (gender.getKey() === opensocial.Enum.Gender.FEMALE) {
			gender_str = 'Female';
		}
		var address = person.getField(opensocial.Person.Field.CURRENT_LOCATION);
		html.push('<div class="person">');
		html.push('<h3>' + person.getDisplayName() + '</h3>');
		html.push('<div>');
		html.push('<img src="'   + person.getField(opensocial.Person.Field.THUMBNAIL_URL    ) + '" align="left" />');
		html.push('<ul>');
//		html.push('<li>年齢: '   + age.toString() + '</li>');
		html.push('<li>性別: '   + gender_str + '</li>');
//		html.push('<li>所在地: ' + person.getField(opensocial.Person.Field.CURRENT_LOCATION ) + '</li>');
		html.push('</ul>');
		html.push('<br clear="all" />');
		html.push('</div>');
	});
	document.getElementById('peopleArea').innerHTML = html.join('');
}


