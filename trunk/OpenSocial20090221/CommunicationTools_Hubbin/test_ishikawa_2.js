
// Based on OpenSocialApps_2

//初期化
function init() {
	getFriends();
}

//メイン、リクエスト発行
function getFriends() {
	//var searchOpt = {};
	var req = opensocial.newDataRequest();
	// ソート順序の指定: NAME
	//searchOpt[SORT_ORDER] = opensocial.DataRequest.SortOrder.NAME;
	//req.add(req.newFetchPersonRequest('VIEWER',         searchOpt), 'viewer');
	//req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', searchOpt), 'viewerFriends');
	//req.add(req.newFetchPersonRequest('OWNER',          searchOpt), 'owner');
	//req.add(req.newFetchPeopleRequest('OWNER_FRIENDS',  searchOpt), 'ownerFriends');
	req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS'), 'viewerFriends');
	req.send(onLoadFriends);
}

//メイン、コールバック関数
function onLoadFriends(data) {
	//var viewer        = data.get('viewer'       ).getData();
	var viewerFriends = data.get('viewerFriends').getData();
	//var owner         = data.get('owner'        ).getData();
	//var ownerFriends  = data.get('ownerFriends' ).getData();
	html = new Array();
	//とりあえずviewerFriends
	html.push('<div class="person">');
	viewerFriends.each(function(person) {
		html.push('<h3>' + person.getDisplayName() + '</h3>');
		html.push('<ul>');
		for (var field in opensocial.Person.Field) {
			try {
				var fieldValue = person.getField(opensocial.Person.Field[field]);
				if(fieldValue !== null) {
					// field は fieldValue
					html.push('<li>' + field + ' : ' + fieldValue + '</li>');
				} else {
					// field は null
					html.push('<li>(' + field + 'はnullでした)</li>');
				}
			} catch (ex) {
				//field で例外発生
				html.push('<li>(' + field + 'で例外発生…)</li>');
			}
		}
		html.push('</ul>');
	});
	html.push('</div>');
	document.getElementById('peopleArea').innerHTML = html.join('');
}

