
// Based on OpenSocialApps_2
// http://sandbox.orkut.com/Main#Application.aspx?appId=591740862440&nocache=1

var os_people_field = [  
  {name:'ABOUT_ME',            key:opensocial.Person.Field.ABOUT_ME,            ja:'一般的な説明'}  
, {name:'ACTIVITIES',          key:opensocial.Person.Field.ACTIVITIES,          ja:'お気に入りのアクティビティ'}  
, {name:'ADDRESSES',           key:opensocial.Person.Field.ADDRESSES,           ja:'住所'}            //Address配列  
, {name:'AGE',                 key:opensocial.Person.Field.AGE,                 ja:'年齢'}  
, {name:'BODY_TYPE',           key:opensocial.Person.Field.BODY_TYPE,           ja:'身体的特徴'}  
, {name:'BOOKS',               key:opensocial.Person.Field.BOOKS,               ja:'お気に入りの本'}  
, {name:'CARS',                key:opensocial.Person.Field.CARS,                ja:'お気に入りの車'}  
, {name:'CHILDREN',            key:opensocial.Person.Field.CHILDREN,            ja:'子供の説明'}  
, {name:'CURRENT_LOCATION',    key:opensocial.Person.Field.CURRENT_LOCATION,    ja:'現住所'}            //Address配列  
, {name:'DATE_OF_BIRTH',       key:opensocial.Person.Field.DATE_OF_BIRTH,       ja:'生年月日'}          //Dateオブジェクト  
, {name:'DRINKER',             key:opensocial.Person.Field.DRINKER,             ja:'飲酒状況'}          //opensocial.Enum  
, {name:'EMAILS',              key:opensocial.Person.Field.EMAILS,              ja:'メール アドレス'}   //Email配列  
, {name:'ETHNICITY',           key:opensocial.Person.Field.ETHNICITY,           ja:'人種'}  
, {name:'FASHION',             key:opensocial.Person.Field.FASHION,             ja:'服装に関する考え'}  
, {name:'FOOD',                key:opensocial.Person.Field.FOOD,                ja:'お気に入りの食べ物'}  
, {name:'GENDER',              key:opensocial.Person.Field.GENDER,              ja:'性別'}            //opensocial.Enum  
, {name:'HAPPIEST_WHEN',       key:opensocial.Person.Field.HAPPIEST_WHEN,       ja:'最も幸せなときの説明'}  
, {name:'HAS_APP',             key:opensocial.Person.Field.HAS_APP,             ja:'アプリケーションを個人が使用したことがあるか'}  //Bool  
, {name:'HEROES',              key:opensocial.Person.Field.HEROES,              ja:'お気に入りのヒーロー'}  
, {name:'HUMOR',               key:opensocial.Person.Field.HUMOR,               ja:'ユーモアに関する考え'}  
, {name:'ID',                  key:opensocial.Person.Field.ID,                  ja:'個人に永久に関連付けることが可能な文字列 ID'}  
, {name:'INTERESTS',           key:opensocial.Person.Field.INTERESTS,           ja:'興味、趣味、夢中になっていることなど'}  
, {name:'JOB_INTERESTS',       key:opensocial.Person.Field.JOB_INTERESTS,       ja:'お気に入りの仕事、または仕事上の関心事や技能'}  
, {name:'JOBS',                key:opensocial.Person.Field.JOBS,                ja:'従事している仕事'}      //Organization配列  
, {name:'LANGUAGES_SPOKEN',    key:opensocial.Person.Field.LANGUAGES_SPOKEN,    ja:'話す言語のリスト'}      //ISO 639-1コード(配列)  
, {name:'LIVING_ARRANGEMENT',  key:opensocial.Person.Field.LIVING_ARRANGEMENT,  ja:'生活環境'}  
, {name:'LOOKING_FOR',         key:opensocial.Person.Field.LOOKING_FOR,         ja:'探している人物や物事、どのような目的で人に会いたいか'}  
, {name:'MOVIES',              key:opensocial.Person.Field.MOVIES,              ja:'お気に入りの映画'}  
, {name:'MUSIC',               key:opensocial.Person.Field.MUSIC,               ja:'お気に入りの音楽'}  
, {name:'NAME',                key:opensocial.Person.Field.NAME,                ja:'名前'}            //opensocial.Name オブジェクト  
, {name:'NETWORK_PRESENCE',    key:opensocial.Person.Field.NETWORK_PRESENCE,    ja:'ネットワークの状況'}  
, {name:'NICKNAME',            key:opensocial.Person.Field.NICKNAME,            ja:'ニックネーム'}  
, {name:'PETS',                key:opensocial.Person.Field.PETS,                ja:'ペットの説明'}  
, {name:'PHONE_NUMBERS',       key:opensocial.Person.Field.PHONE_NUMBERS,       ja:'電話番号'}              //Phone の配列  
, {name:'POLITICAL_VIEWS',     key:opensocial.Person.Field.POLITICAL_VIEWS,     ja:'政治的見解'}  
, {name:'PROFILE_SONG',        key:opensocial.Person.Field.PROFILE_SONG,        ja:'テーマソング'}         //opensocial.Url  
, {name:'PROFILE_URL',         key:opensocial.Person.Field.PROFILE_URL,         ja:'プロフィールのURL'}  
, {name:'PROFILE_VIDEO',       key:opensocial.Person.Field.PROFILE_VIDEO,       ja:'プロフィールビデオ'}   //opensocial.Url   
, {name:'QUOTES',              key:opensocial.Person.Field.QUOTES,              ja:'お気に入りの台詞'}      //配列  
, {name:'RELATIONSHIP_STATUS', key:opensocial.Person.Field.RELATIONSHIP_STATUS, ja:'人間関係の状況'}  
, {name:'RELIGION',            key:opensocial.Person.Field.RELIGION,            ja:'宗教または宗教観'}  
, {name:'ROMANCE',             key:opensocial.Person.Field.ROMANCE,             ja:'恋愛に関する意見'}  
, {name:'SCARED_OF',           key:opensocial.Person.Field.SCARED_OF,           ja:'苦手なもの'}  
, {name:'SCHOOLS',             key:opensocial.Person.Field.SCHOOLS,             ja:'出身校'}            //Organization の配列  
, {name:'SEXUAL_ORIENTATION',  key:opensocial.Person.Field.SEXUAL_ORIENTATION,  ja:'性指向'}  
, {name:'SMOKER',              key:opensocial.Person.Field.SMOKER,              ja:'喫煙状況'}          //opensocial.Enum  
, {name:'SPORTS',              key:opensocial.Person.Field.SPORTS,              ja:'お気に入りのスポーツ'}  
, {name:'STATUS',              key:opensocial.Person.Field.STATUS,              ja:'状況や特記事項'}  
, {name:'TAGS',                key:opensocial.Person.Field.TAGS,                ja:'任意のタグ'}          //配列  
, {name:'THUMBNAIL_URL',       key:opensocial.Person.Field.THUMBNAIL_URL,       ja:'個人の写真のサムネイル'}  
, {name:'TIME_ZONE',           key:opensocial.Person.Field.TIME_ZONE,           ja:'タイムゾーン'}  
, {name:'TURN_OFFS',           key:opensocial.Person.Field.TURN_OFFS,           ja:'うんざりすること'}  
, {name:'TV_SHOWS',            key:opensocial.Person.Field.TV_SHOWS,            ja:'お気に入りのテレビ番組'}  
, {name:'URLS' ,               key:opensocial.Person.Field.URLS,                ja:'ウェブページやフィードなど'}  
];  

function init() {
	getFriends();
}

function getFriends() {
	var params = {};

	var _fields = [];
	for (var i in os_people_field) {
		_fields.push(os_people_field[i]['key']);
	}
	params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = _fields;

	var req = opensocial.newDataRequest();
	req.add(req.newFetchPeopleRequest('VIEWER_FRIENDS', params), 'viewerFriends');
	req.send(onLoadFriends);
}

function onLoadFriends(data) {
	var viewerFriends = data.get('viewerFriends').getData();
	html = new Array();
	viewerFriends.each(function(person) {
		var age     = person.getField(opensocial.Person.Field.AGE);
/*
		var gender  = person.getField(opensocial.Person.Field.GENDER);
		var gender_str = '';
		if (gender.getKey() === opensocial.Enum.Gender.MALE) {
			gender_str = 'Male';
		} else if (gender.getKey() === opensocial.Enum.Gender.FEMALE) {
			gender_str = 'Female';
		}
*/
		var address = person.getField(opensocial.Person.Field.CURRENT_LOCATION);
		html.push('<div class="person">');
		html.push('<h3>' + person.getDisplayName() + '</h3>');
		html.push('<div>');
		html.push('<img src="'   + person.getField(opensocial.Person.Field.THUMBNAIL_URL    ) + '" align="left" />');
		html.push('<ul>');
		html.push('<li>年齢: '   + age + '</li>');
		html.push('<li>状態: '   + people.getField(opensocial.Person.Field.STATUS) + '</li>');
//		html.push('<li>性別: '   + gender_str + '</li>');
//		html.push('<li>所在地: ' + person.getField(opensocial.Person.Field.CURRENT_LOCATION ) + '</li>');
		html.push('</ul>');
		html.push('<br clear="all" />');
		html.push('</div>');
	});
	document.getElementById('peopleArea').innerHTML = html.join('');
}


