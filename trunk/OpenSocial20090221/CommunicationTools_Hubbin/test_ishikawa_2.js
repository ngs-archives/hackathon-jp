
// Based on OpenSocialApps_2
// http://sandbox.orkut.com/Main#Application.aspx?appId=591740862440&nocache=1

//初期化
function init() {
	getFriends();
}

//メイン、リクエスト発行
function getFriends() {

	var params = {};

	// ソート順序の指定: NAME
	params[SORT_ORDER] = opensocial.DataRequest.SortOrder.NAME;

	//項目の追加
	params[PROFILE_DETAILS] = [ //プロパティとして列挙する…？
		opensocial.Person.Field.AGE,
		opensocial.Person.Field.DATE_OF_BIRTH,
		opensocial.Person.Field.GENDER,
		opensocial.Person.Field.CURRENT_LOCATION
	];

	var req = opensocial.newDataRequest();

	//req.add(req.newFetchPersonRequest('VIEWER',         searchOpt), 'viewer');
	//req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', searchOpt), 'viewerFriends');
	//req.add(req.newFetchPersonRequest('OWNER',          searchOpt), 'owner');
	//req.add(req.newFetchPeopleRequest('OWNER_FRIENDS',  searchOpt), 'ownerFriends');

	req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', params), 'viewerFriends');
	req.add(req.newFetchPeopleRequest('OWNER_FRIENDS',  params), 'ownerFriends');

	req.send(onLoadFriends);
}

//メイン、コールバック関数
function onLoadFriends(data) {

	if(data.hadError()){
		var msg = data.getErrorMessage();
	}

	//var viewer        = data.get('viewer'       ).getData();
	var viewerFriends = data.get('viewerFriends').getData();
	//var owner         = data.get('owner'        ).getData();
	var ownerFriends  = data.get('ownerFriends' ).getData();
	html = new Array();
	//とりあえずviewerFriends
	html.push('<div class="person">');
	viewerFriends.each(printPerson);
	ownerFriends.each(printPerson);
	html.push('</div>');
	if(msg !== ''){
		html.push('<div>' + msg + '</div>');
	}
	document.getElementById('peopleArea').innerHTML = html.join('');
}

function printPerson(person) {
		html.push('<h3>' + person.getDisplayName() + '</h3>');
		html.push('<div>');
		html.push('<img src="'   + person.getField(opensocial.Person.Field.THUMBNAIL_URL    ) + '" align="left" />');
		html.push('<ul>');
		html.push('<li>年齢: '   + person.getField(opensocial.Person.Field.AGE              ) + '</li>');
		html.push('<li>誕生日: ' + person.getField(opensocial.Person.Field.DATE_OF_BIRTH    ) + '</li>');
		html.push('<li>性別: '   + person.getField(opensocial.Person.Field.GENDER           ) + '</li>');
		html.push('<li>所在地: ' + person.getField(opensocial.Person.Field.CURRENT_LOCATION ) + '</li>');
		html.push('</ul>');
		html.push('<br clear="all" />');
		html.push('</div>');
}

