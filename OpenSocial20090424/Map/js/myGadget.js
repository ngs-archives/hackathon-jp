//var id;
var childid = 0;
var children = [];	//追加した地点の情報
var viewerobj = {}; //viewerの情報
var friendobj = {}; //friendsの情報
var dropped = {};		//droppedしたfriendの情報
var carwingsobj = {};//carwingsの情報
var frienddata = []; //friendがくれたデータキーはid(friend)
var map;
var token;
var geocoder;
var geocode;
var tabs = null;
var maptabs = null;

//var friend_ = null;

function init() 
{
	var req = opensocial.newDataRequest();
	var params = {};
	params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = 
		[
			opensocial.Person.Field.AGE,
			opensocial.Person.Field.GENDER,
			opensocial.Person.Field.CURRENT_LOCATION
		];
	//req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER, params), 'viewer');
	req.add(req.newFetchPersonRequest("VIEWER", params), 'viewer');
	req.send(printProfileScreen);

	//tabs = new gadgets.TabSet(__MODULE_ID__, null, document.getElementById('tabs_div'));
	// __MODULE_ID__だとエラーになたt。undefined.
	tabs = new gadgets.TabSet(0, null, document.getElementById('tabs_div'));
	tabs.alignTabs("left", 3);

	// map, albumのタブ
	maptabs = new gadgets.TabSet(0, null, document.getElementById('maptabs_div'));
	maptabs.alignTabs("left", 3);

	mapinit();

	// jqueryの読み込み
	// ここで宣言しておけば$jでどこからでも呼び出せるらしい。
	$j = jQuery.noConflict(); //他のライブラリとの衝突を回避します

	$j(function($) {
		$('#myDrop').droppable({
			accept: '.friendImg',
			drop: function(e,ui) {

					var droppedidx = getDroppedidx(ui);

					if ( droppedidx != undefined )
					{
					/*
						var msg   = "<p>"+ friendobj[droppedidx].name
						+ " が "+this.id
						+ " へドロップされました</p>"
						$(this).append(msg);
						*/
						//要素の追加
						dropped[droppedidx] = droppedidx;
						showDropped();
					}
				}
			});
	});

	$j(function($) {
		$('#myDrop2').droppable({
			accept: '.friendName',
			drop: function(e,ui) {

//objectdump(e, document.getElementById('dumpArea'));
					var droppedidx = getDroppedidx(ui);

					if ( droppedidx != undefined )
					{
						//要素の削除
						delete dropped[droppedidx];
						showDropped();
						removeCheck(droppedidx);
					}
				}
			});
		});


	showAlbum();

	gadgets.window.adjustHeight();


	/*
	var searchControl = new GSearchControl();
	searchControl.addSearcher(new GimageSearch());
	searchControl.draw(document.getElementById("searchcontrol"));
	searchControl.execute("CodeZine");
	*/

	//setTimeout(_loadFromFriends, 10000);
};

function sendEmail()
{
	var url = "http://61.193.175.55/test-cgi/test/hackathon/cgi/regmail.cgi";
	var addr = document.getElementById('maddr').value;
	var param = 
	{
		uid : viewerobj.id,
		address : addr
	};

	param = gadgets.io.encodeValues(param);

	var params = {};
	params[gadgets.io.RequestParameters.POST_DATA]= param;
	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;  
	gadgets.io.makeRequest(url, callbackEmail, params);
}
function callbackEmail(obj)
{
console.log(obj);
console.log(obj.status);
	if ( obj.status != "OK" )
	{
		alert("ケータイアドレスが不正かもしれません？？");
	}
}

function getDroppedidx(ui)
{
	// e.originalTarget.idでドラッグされているオブジェクトがとれる。>firefox
	// e.srcElement.idでドラッグされたオブジェクトがとれる。>opera, safari
	/*
	if ( e.originalTarget != undefined )
	{
		var droppedid = e.originalTarget.id;
	}
	else if ( e.srcElement != undefined )
	{
		var droppedid = e.srcElement.id;
	}
	*/
	var droppedid = ui.draggable[0].id;
	return _getidx(droppedid);
}
function showDropped()
{
	//myDrop
	var el = document.getElementById('myDrop');
	el.innerHTML = "";
	for ( var key in dropped )
	{
		//ドロップされた奴らをappendchildする。
		/*
		var elm = document.createElement('div');
		elm.id = _getFriendDivId(key);
		elm.className = "friendName";
		elm.innerHTML = friendobj[key].name;
		*/
		var elm = document.createElement('img');
		elm.id = _getFriendDivId(key);
		elm.className = "friendName";
		elm.src = friendobj[key].thumbnail;
		//半分
		elm.width =  friendobj[key].w;
		elm.height = friendobj[key].h;
		//原寸
		//elm.width =  friendobj[key].ow;
		//elm.height = friendobj[key].oh;

		el.appendChild(elm);
		$j(function($) {
				$('#'+elm.id).draggable(
					{
						//grid     : [64,64], //移動量xy
						helper	 : 'clone',
						opacity  : 0.5,    //ドラッグ時の不透明度
						cursor   : 'move', //カーソル形状
						axis     : 'xy'     //ドラッグ方向
					});
		});

		addCheck(key);
	}
//objectdump(friendobj, document.getElementById('dumpArea'));
}


function addCheck(key)
{
	// 元画像を薄くする。
	var img = document.getElementById(_getFriendImgId(key));
	img.style.opacity = 0.1;
	
	// 元画像にレ点を入れる。
	/*
	if ( document.getElementById("re_"+key) == undefined )
	{
		var re = document.createElement('img');
		re.src = "http://61.193.175.55/test-cgi/test/igoogle/reten.gif";
		re.style.position = "absolute";
		re.style.left = friendobj[key].left;
		re.style.top = friendobj[key].top;
		re.id = "re_"+key;
		document.getElementById('friend_div').appendChild(re);
	}
	*/
}

function removeCheck(key)
{
	//不透明に戻す。
	var img = document.getElementById(_getFriendImgId(key));
	img.style.opacity = 1;
	
	//レ点を消す
	/*
	var div = document.getElementById("friend_div");
	var re = document.getElementById("re_"+key);
	div.removeChild(re);
	*/
}

// funcはコールバック関数
function getFriends(func)
{
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
	params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
	params[opensocial.IdSpec.Field.NETWORK_DISTANCE] = 1;
	var idSpec = opensocial.newIdSpec(params);
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPeopleRequest(idSpec), "friends");
	req.send(function(data)
	{
		if ( data.hadError())
		{
			//error
		}
		else
		{
			var item = data.get("friends");
			if ( item.hadError())
			{
				//error
			}
			else
			{
				//友達全員に保存
				//var j = prepareData();
				//persist.save("cwkey_all", j);
				var f = item.getData();
				//friendobj = undefined;
				//friendobj = [];
				f.each(function(_f){
//objectdump(_f, document.getElementById('dumpArea'));
					var thumbnailUrl = _f.getField(opensocial.Person.Field.THUMBNAIL_URL);
					var name = _f.getDisplayName();
					var fid = _f.getId();
					// 友達配列
					friendobj[fid] = 
						{key:"friend_"+fid, id:fid, thumbnail:thumbnailUrl, name:name, flg:"friend"};
				});
				func();
//objectdump(friendobj, document.getElementById("dumpArea"));
			}
		}
	});
}
/*
*/

function showFriends()
{
	getFriends(_showFriends);
}
function setImgSize(img)
{
	img.width = img.width/2;
	//img.height = img.height/2;

//objectdump(friendobj, document.getElementById("dumpArea"));
}
function setImgProperty(key, o)
{
	friendobj[key].ow = o.width;
	friendobj[key].oh = o.height;
	friendobj[key].w = o.width/2;
	friendobj[key].h = o.height/2;
	friendobj[key].left = o.offsetLeft;
	friendobj[key].top = o.offsetTop;

//objectdump(friendobj, document.getElementById("dumpArea"));

}
function _showFriends()
{
	var params = 
	{
		contentContainer: document.getElementById('friend_div'),
		callback: function()
		{
			;
		}
	};
	tabs.addTab("Friends", params);
	for ( var key in friendobj )
	{
		if ( friendobj[key].flg != "friend" ) continue;
		var img = document.createElement('img');
		img.id = _getFriendImgId(key);
		img.src = friendobj[key].thumbnail;
		img.alt = friendobj[key].name;
		img.className = "friendImg";
		document.getElementById('friend_div').appendChild(img);
		img.setAttribute("onload", "setImgProperty('"+key+"',this)");
		//img.width = friendobj[key].w;
		//img.height = friendobj[key].h;

		$j(function($) {
				$('#'+img.id).draggable(
					{
						//grid     : [64,64], //移動量xy
						helper	 : 'clone',
						opacity  : 0.5,    //ドラッグ時の不透明度
						cursor   : 'move', //カーソル形状
						axis     : 'xy'     //ドラッグ方向
					});
		 });
	}
}

function triggerClick()
{
	var o = new GLatLng(geocode.lat, geocode.lng);
	GEvent.trigger(map, 'click', null, o)
}

function mapinit()
{
	var params = 
	{
		contentContainer: document.getElementById('map'),
		callback: function()
		{
			;
		}
	};
	maptabs.addTab("Map", params);
	var opts = {googleBarOptions:{onGenerateMarkerHtmlCallback : function(m,s,r)
		{
			var children = s.childNodes;
			for(var i=0;i<children.length;i++)
			{
				if(children[i].className == 'gs-directions-to-from')
				{
					geocode = r;
					children[i].innerHTML = 
						"<a href='#' onclick='triggerClick()'>ここをセット</a>";
					break;
				}
			}

			return s;
		},showOnLoad:true}};

	map = new GMap(document.getElementById("map"), opts);
	map.addControl(new GSmallMapControl());
	map.addControl(new GMapTypeControl());
	map.enableGoogleBar();
	//alert(prefs.getString("loc"));
	//map.centerAndZoom(new GPoint(prefs.getString("loc.long"), prefs.getString("loc.lat")), 10);
	// TODO: ダウンロードしたデータの位置に合わせる。
	map.centerAndZoom(new GLatLng(35.46159,139.6227), 5);

	geocoder = new GClientGeocoder();
}
function addEventMap()
{
	GEvent.addListener(map, 'click', function(overlay, point)
			{
			geocoder.getLocations(point, function(addr)
				{
				var name;
				var description;
				var phone;
				if (geocode)
				{
				name =  geocode.titleNoFormatting;
				if ( "phoneNumbers" in geocode) 
				{
					phone =  geocode.phoneNumbers[0].number;
				}
				description =  geocode.streetAddress;
				//alert(name + phone + description );
				geocode = undefined;
				}
				else if (addr.Status.code == G_GEO_SUCCESS)
				{
				var place = addr.Placemark[0];
				name =  place.address;
				}
				else
				{
				name = '地点'+childid;
				}

				var m = new GMarker(point);
				children[childid] = {
					'marker': m, 
					'point': point, 
					'visible': true, 
				};
				setValuesToDic(childid, {
						'name':name,
						'phone': phone,
						'description':description
						});
				map.addOverlay(m);

				addRow(childid);
				childid++;
				});
			});
}

function printProfileScreen(data) 
{
	var viewer = data.get("viewer").getData();
//console.log(viewer);
	var id = viewer.getId();
	var _name = viewer.getField(opensocial.Person.Field.NAME);
	var fname;
	var gname;
	var name;

	if ( typeof(_name) == "string" )
	{
		fname = "";
		gname = _name;
	}
	if ( typeof(_name) == "object" )
	{
		fname = _name.getField(opensocial.Name.Field.FAMILY_NAME);
		gname = _name.getField(opensocial.Name.Field.GIVEN_NAME);
	}
	if ( _name == undefined )
	{
		gname = viewer.getDisplayName();
	}

	if ( fname && gname )
	{
		name = fname+" "+gname;
	}
	else if ( fname )
	{
		name = fname;
	}
	else if ( gname )
	{
		name = gname;
	}



	var address;
	var _age = viewer.getField(opensocial.Person.Field.AGE);
	var _gender = viewer.getField(opensocial.Person.Field.GENDER);
	//console.log(typeof(_gender));
	var _curlocation = viewer.getField(opensocial.Person.Field.CURRENT_LOCATION);

	//性別
	var gender;
	if ( typeof(_gender) == "string" )
	{
		gender = _gender;
	}
	if ( typeof(_gender) == "object" )
	{
		gender = _gender.getDisplayValue();
	}

	//住所の取得
	if ( _curlocation != undefined )
	{
		var _countory = _curlocation.getField(opensocial.Address.Field.COUNTRY);
		var _region = _curlocation.getField(opensocial.Address.Field.REGION);
		var _locality = _curlocation.getField(opensocial.Address.Field.LOCALITY);
		var _st_address = _curlocation.getField(opensocial.Address.Field.STREET_ADDRESS);
		var _ext_address = _curlocation.getField(opensocial.Address.Field.EXTENDED_ADDRESS);
			_countory = (_countory) ? _countory : "";
			_region = 	(_region) ? _region : "";
			_locality = 	(_locality) ? _locality : "";
			_st_address =	(_st_address) ? _st_address : "";
			_ext_address = (_ext_address) ? _ext_address : "";
		address = _countory + _region + _locality + _st_address + _ext_address;
	}

	//console.log("address:"+address);

	viewerobj = {"name":name, "gender":gender, "id":id, "address": address};
	/*
	*/

	showProf();

	//getCarwings();

	// スピナーを止める
	document.getElementById('loading').style.display = 'none';

	//友達一覧を取得、表示
	//friend_ = new Friends(_showFriends);
	showFriends();

	// 地点一覧をロード（外部サーバ）
	loadData();

	// これはスクラッチ領域
	//persist.loadFromMe(viewerobj.id);


};
function showProf()
{
	var html;

	if ( viewerobj.name ) html = "ようこそ<b>"+ viewerobj.name + "</b>さん<br>";
	//if ( viewerobj.address ) html += viewerobj.address +"<br>";

	document.getElementById("prof").innerHTML = html;
}
// カーウィングスへのアカウントは友達と同列に扱う。
// 無ければないで問題ない。アカウントを連動させるのはユーザ任せ。
/*
function getCarwings()
{
	var date = new Date().getTime();
	// GIDについてガジェットサイトに登録があるか確認する
	var url = 
		"http://61.193.175.55/test-cgi/test/igoogle/auth.cgi" +
		"?id=" + viewerobj.id + "&cachebuster=" + date; 
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = 
		gadgets.io.ContentType.JSON;  

	params[gadgets.io.RequestParameters.METHOD] = 
		gadgets.io.MethodType.GET;

	gadgets.io.makeRequest(url, response, params);
}
*/
/*
function response(obj)
{
	var j = obj.data;
	// ガジェットサイトにGIDの登録があった。
	if ( j.token != undefined && j.token != "null" && j.token != null )
	{
		//alert("success:"+j.token);
		document.getElementById('loading').style.display = 'none';
		//html = "<b> success </b></ br>";
		//html += "your token is <b> "+ j.token + " </b>";
		html = "<font color=\"gray\"><b>CARWINGSにログインしています。</b></font>";

		// サービスプロバイダーのトークンを使っていろいろやる。
		// -> CWからのリクエスト一覧を取得したりする。

		// Carwingsを友達として追加する。
		var icon = "http://61.193.175.55/test-cgi/test/igoogle/icon.png";
		friendobj[viewerobj.id] = 
				{id:viewerobj.id, key:"cw_"+viewerobj.id, 
					thumbnail:icon, name:"MY CARWINGS", flg:"carwings"};

		// Carwingsを友達として追加しない　
		// carwingsobjとして別に扱う。
		//var icon = "http://61.193.175.55/test-cgi/test/igoogle/icon.png";
		//carwingsobj[viewerobj.id] = 
		//		{id:viewerobj.id, key:"cw_"+viewerobj.id, thumbnail:icon, name:"MY CARWINGS"};
		token = j.token;
	}
	else //ガジェットサイトにGIDの登録がない
	{
		document.getElementById('loading').style.display = 'none';
		//サービスプロバイダー側のログインページを開かせる。
		//技術的にはOPENIDのプロバイダ的なもの。
		//認証URLに対しガジェットサイトのコールバックURLを渡しておき、
		//認証結果としてサービスプロバイダーのトークンとGIDを返してもらう。(OK)

		var callbackURL  = j.callback;
		var authURL = j.authurl;

//		alert( "このURLで認証しに行く："+authURL + "?callback=" + callbackURL + "&id="+viewerobj.id);

		//document.getElementById('main').src = 
		//	authURL + "?callback=" + callbackURL + "&id="+viewerobj.id;
		// 認証のページはログインボタン押下で新しいウィンドウで開く。
		// URLをくくるシングルクオートの付け方に癖がある。シングルクオートが
		// ""の内部に複数有るとコンテナ側でパースがおかしくなる。ようだ。
		html = "<font color=\"gray\"><b>CARWINGSにログインしていません。</b></font>"+
		 "<a href=\"#\" onclick=\"window.open("+ 
			 "'"+authURL + "?callback=" + callbackURL + "&id="+viewerobj.id+"'"+
			 ");\">ログインする</a>";
	}
	persist.loadFromMe(viewerobj.id);
	document.getElementById('stat').innerHTML = html;

	//友達一覧を取得、表示
	//showFriends();
	friend_ = new Friends(_showFriends);
	friend_.showFriends();
	//Carwings一覧を表示
	showCarwings();
}
*/
/*
function showCarwings()
{
	var params = 
	{
		contentContainer: document.getElementById('carwings_div'),
		callback: function()
		{
		;
		}
	};
	tabs.addTab("CARWINGS", params);

	for ( var key in friendobj )
	{
		if ( friendobj[key].flg != "carwings" ) continue;
		var img = document.createElement('img');
		img.id = _getFriendImgId(key);
		img.src = friendobj[key].thumbnail;
		img.alt = friendobj[key].name;
		img.className = "friendImg";
		document.getElementById('carwings_div').appendChild(img);
		img.setAttribute("onload", "setImgProperty('"+key+"',this)");

		$j(function($) {
				$('#'+img.id).draggable(
					{
						//grid     : [64,64], //移動量xy
						helper	 : 'clone',
						opacity  : 0.5,    //ドラッグ時の不透明度
						cursor   : 'move', //カーソル形状
						axis     : 'xy'     //ドラッグ方向
					});
		 });
	}
}
*/
function addRow(idx)
{
	var tr = document.createElement('tr');
	var im = document.createElement('img');
	var td1 = document.createElement('td');
	var td2 = document.createElement('td');
	var td3 = document.createElement('td');
	var photo = document.createElement('img');
	var div = document.createElement('div');
	var o = getValuesFromDic(idx);

//objectdump(o, document.getElementById("dumpArea"));
	tr.id = _getTrId(idx);
	div.id = _getDivId(idx);
	div.innerHTML = o.name;
	div.setAttribute("onclick", "editdiv('"+idx+"')"); //編集フィールドにする
	td3.id = "photo_"+(idx);
	if ( o.img == "" || o.img == undefined || o.img == "undefined")
	{
		photo.src = 
				//"http://61.193.175.55/test-cgi/test/igoogle/small.png";
				"http://61.193.175.55/test-cgi/test/igoogle/noimg-1_1.gif";
	}
	else
	{
		photo.src = o.img;
	}
	photo.style.width = 40;
 

	var el = document.getElementById('tableview');
	im.src = "http://www.image-seed.com/data/button/standard/shut_01.gif";
	im.setAttribute ("onclick", "delRow('"+idx+"')");

	el.appendChild(tr).appendChild(td1).appendChild(im);
	el.appendChild(tr).appendChild(td3).appendChild(photo);
	el.appendChild(tr).appendChild(td2).appendChild(div);

	$j(function($) {
		$('#'+tr.id).droppable({
			accept: '.photo',
			drop: function(e,ui) {

					var droppedidx = getDroppedidx(ui);

					var src = $('#img_'+droppedidx)[0].src;

					var photid = "photo_"+_getidx(this.id);

					$('#'+photid+">img")[0].src = src;
					$('#'+photid+">img")[0].width = 40;
					//$('#'+photid+">img")[0].height = 40;
					var msg   = "<p>" 
					+ this.id
					+ " へドロップされました</p>"

					children[_getidx(this.id)].img = src;

//objectdump(children, document.getElementById("dumpArea"));
				}
			})
	});

}
function delRow(idx)
{
	// リストを消す
	var d = document.getElementById('tableview');
	var r = document.getElementById(_getTrId(idx));
	d.removeChild(r);

	// アイコンを消す
	if ( idx != undefined )
	{
		map.removeOverlay(children[idx].marker);
		// 無効にする
		children[idx].visible = false;
	}
}
function editdiv(idx)
{

	var div = document.getElementById(_getDivId(idx));
	var o = getValuesFromDic(idx);

	map.panTo(new GLatLng(o.lat, o.lon));

	var nameid  = _getNameId(idx); //name
	var descriptionid = _getDescriptionId(idx); // description
	var phoneid = _getPhoneId(idx); // phone

	div.innerHTML = 
		"<input id='"+ nameid +"' size=40 type=text />"+
		"<input id='"+ phoneid +"' size=15 type=text /><br />"+
		"<textarea id='"+ descriptionid +"' rows=4 cols=50 ></textarea><br />"+
		"<input value='たたむ' type=button onkeyup='foldingDiv(event,"+ idx +")' onmouseup='foldingDiv(event,"+ idx +")' />"+
		"<input value='更新' type=button onkeyup='editEndDiv (event,"+ idx +")' onmouseup='editEndDiv(event, "+ idx +")' />"+
		"<input value='更新してたたむ' type=button onkeyup='editEndDivFolding (event, "+ idx +")' onmouseup='editEndDivFolding(event, "+ idx +")' />";

	setValuesToDOM(idx, o);
	document.getElementById(nameid).focus(); //名前欄にフォーカス
	div.setAttribute("onclick", "");
}
function _getidx(elid)
{
	var idx = elid.split("_")[1];
	return idx;
}
function _getNameId(idx)
{
	return "name_"+idx;
}
function _getPhoneId(idx)
{
	return "phone_"+idx;
}
function _getDescriptionId(idx)
{
	return "description_"+idx;
}
function _getDivId(idx)
{
	return "div_"+idx;
}
function _getFriendDivId(idx)
{
	return "fdiv_"+idx;
}
function _getTrId(idx)
{
	return "tr_"+idx;
}
function _getFriendImgId(idx)
{
	return "fimg_"+idx;
}
function _getImgId(idx)
{
	return "img_"+idx;
}
function editEndDivFolding(event, idx)
{
	editEndDiv(event, idx);
	foldingDiv(event, idx);
}
function foldingDiv(event, idx)
{
	var type = event.type;
	if ( type == "keyup" && event.keyCode != 13 ) return;

	var div = document.getElementById(_getDivId(idx));
	var o = getValuesFromDOM(idx);
	div.innerHTML = o.name;
	div.setAttribute("onclick", "editdiv('"+idx+"')"); 
}
function editEndDiv(event, idx)
{
	var type = event.type;
	if ( type == "keyup" && event.keyCode != 13 ) return;

	var div = document.getElementById(_getDivId(idx));
	var o = getValuesFromDOM(idx);
	setValuesToDic(idx, o);
}
function setValuesToDic(id, o)
{
	if ( o.name == null ) o.name = "";
	if ( o.phone == null ) o.phone = "";
	if ( o.description == null ) o.description = "";
	if ( o.img == null ) o.img = "";

	children[id].name = o.name;
	children[id].phone = o.phone;
	children[id].description = o.description;
	children[id].img = o.img;
}
function setValuesToDOM(idx, o)
{
	var nameid  = _getNameId(idx); //name
	var descriptionid = _getDescriptionId(idx); // description
	var phoneid = _getPhoneId(idx); // phone

	document.getElementById(nameid).value = o.name;
	document.getElementById(descriptionid).value = o.description;
	document.getElementById(phoneid).value = o.phone;
}
function getValuesFromDic(id)
{
	var c = children[id];
	return {
			lat: c.point.lat(),
			lon: c.point.lng(),
			name: c.name,
			phone: c.phone,
			description: c.description,
			img: c.img
	};
}
function getValuesFromDOM(idx)
{
	var nameid  = _getNameId(idx); //name
	var descriptionid = _getDescriptionId(idx); // description
	var phoneid = _getPhoneId(idx); // phone

	var name = document.getElementById(nameid).value;
	var description = document.getElementById(descriptionid).value;
	var phone = document.getElementById(phoneid).value;
	var img = $j('#photo_'+idx+'>img')[0].src;

	return {name:name, description:description, phone:phone};//, img:img};
}
/*
	 地点一覧取得
*/
function loadData()
{
	var date = new Date().getTime();
	var url = 
	"http://61.193.175.55/test-cgi/test/hackathon/cgi/read.cgi"+
	"?cachebuster=" + date + "&id="+ viewerobj.id;

	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = 
	gadgets.io.ContentType.JSON;  

	params[gadgets.io.RequestParameters.METHOD] = 
	gadgets.io.MethodType.GET;

	gadgets.io.makeRequest(url, showData, params);
}

function showData(obj)
{
	var i = 0;
	var j = obj.data;
	for (var key in j )
	{
		//if ( key >= 0 && key < 10 )
		{
			var gp = new GPoint(j[key].lon, j[key].lat);
			var gl = new GLatLng(j[key].lat, j[key].lon);
			var m = new GMarker(gp);
			children[i] = {
				'marker': m, 
				'point': gl,
				'visible': true,
			};
			setValuesToDic(i++, {
					'name':j[key].name,
					'phone':j[key].phone,
					'description':j[key].description,
					'img':j[key].img
					});
			addRow(key);
			map.addOverlay(m);
		}
	}
	childid = i;
	//alert("end of getpoint childid:"+childid);
	addEventMap();
}
/*
	 チャンネルリスト取得
function getContents(token)
{
	document.getElementById('loading').style.display = 'block';
	var date = new Date().getTime();
	var url = 
		"http://61.193.175.55/test-cgi/test/igoogle/index.cgi";

	url = [ url, "?cachebuster=", date, "?token=", token ].join("");

	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = 
		gadgets.io.ContentType.JSON;  

	params[gadgets.io.RequestParameters.METHOD] = 
		gadgets.io.MethodType.GET;

		gadgets.io.makeRequest(url, 
		function(obj)
		{
			var j = obj.data;
			var buf = "";
			for (var key in j )
			{
				buf += j[key].chno + ":" + j[key].navi_title + "<br />";
			}
			document.getElementById('content_div').innerHTML = buf;
			document.getElementById('loading').style.display = 'none';
		}, 
		params);
}
*/

function prepareData()
{
	var arr = [];
	var n = 0;
	for (i in children)
	{
		if ( children[i].visible == true )
		{
			arr.push(getValuesFromDic(i));
		}
	}

	// jsonに変換
	var j = gadgets.json.stringify(arr);

	return j;
}

function saveData()
{
	var j = prepareData();
	//
	//ナニをキーに登録するか。
	//友達に送付が目的なら友達のidを含めたキーにする。
	//友達アプリはそのキーを探しに来る。で、届いたような感じに見える。
	//自分用のデータなら何でもいいけど自分のＩＤを含めたキーにすればいいか。
	//
	//すべてのデータは自分の永続領域に保存する。
	
/*
	var dataKey = viewerobj.id;
	persist.save(dataKey, j);

	// ドロップしている友達どもにセーブする。(CW含む)
	for ( var v in dropped )
	{
		persist.save(friendobj[v].key, j);
	}

*/

	//以下は同様なデータをサーバに保存する場合。
	j = encodeURI(j);
	var date = new Date().getTime();

	var url = "http://61.193.175.55/test-cgi/test/hackathon/cgi/save.cgi";
	for ( var v in dropped )
	{
		var param = 
		{
		json : j,
		cachebuster : date,
		uid : viewerobj.id,
		toid : v
		};


		param = gadgets.io.encodeValues(param);

		//alert(url);
		var params = {};
		params[gadgets.io.RequestParameters.POST_DATA]= param;
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
		gadgets.io.makeRequest(url, saveRes, params);
	}
/*
*/

}
function saveRes(obj)
{
}

function _loadFromFriends()
{
	var key = "friend_"+viewerobj.id;
	persist.loadFromFriends(key);
}

function showAlbum()
{
	var params = 
	{
		contentContainer: document.getElementById('album'),
		callback: function()
		{
			;
		}
	};
	maptabs.addTab("Album", params);
	getAlbum();
}

function getAlbum()
{
	var req = opensocial.newDataRequest();
	var idspec = opensocial.newIdSpec({'userId':'VIEWER', 'groupId':'SELF'});

	req.add(req.newFetchAlbumsRequest(idspec), 'viewerAlbums');
	req.send(fetchAlbumsHandler);
}
function fetchAlbumsHandler(resp)
{
	// use the key passed with the request to "get" the appropriate data
	var viewerAlbumsResp = resp.get('viewerAlbums'); 

	if (!viewerAlbumsResp.hadError()) 
	{
		var viewerAlbums = viewerAlbumsResp.getData();

		// the 'each' method is used to iterate through every object in collection
		viewerAlbums.each( 
			// do something with each album
			function(album) 
			{
				//objectdump(album, document.getElementById("dumpArea"));
				createAlbumRow(album);
			}
		);
	}
	else
	{
		objectdump(viewerAlbumsResp, document.getElementById("dumpArea"));
	}

}

function createAlbumRow(album) 
{
	var table = document.createElement('table');
	var row = document.createElement('tr');
	var thumbnailCell = document.createElement('td');
	var descriptionCell = document.createElement('td');
	var pictrow = document.createElement('tr');
	pictrow.id = "pict_"+album.getId();

	thumbnailCell.innerHTML =
		'<img id="albm_'+ album.getId()+'" src="' + album.getThumbnailUrl() +
		'" onclick="fetchPhotos(\'' + album.getId() + '\')"/>';

	descriptionCell.innerHTML =
		'<b>' + gadgets.util.escapeString(album.getTitle()) + '</b>';
		//'<b>' + album.getTitle() + '</b>';

	descriptionCell.innerHTML +=
		'<p>' + gadgets.util.escapeString(album.getDescription()) + '</p>';
		//'<p>' + album.getDescription() + '</p>';

	table.appendChild(row);
	row.appendChild(thumbnailCell);
	row.appendChild(descriptionCell);
	table.appendChild(pictrow);


	document.getElementById('album').appendChild(table);
};

// Fetches all photos from the album with the passed ID
function fetchPhotos(albumId) 
{
	var req = opensocial.newDataRequest();
	var idspec = opensocial.newIdSpec({'userId':'VIEWER', 'groupId':'SELF'});

	req.add(req.newFetchMediaItemsRequest(idspec, albumId), 'albumPhotos');
	// コールバック関数に独自に引数を増やすやり方。
	req.send(function(resp){fetchPhotosHandler(resp, albumId)});
};

function fetchPhotosHandler(resp, albumId)
{
	var albumPhotosResp = resp.get('albumPhotos');

	if (!albumPhotosResp.hadError()) {
		var albumPhotos = albumPhotosResp.getData();

		// Add each photo's thumbnail to the photo grid
		albumPhotos.each(
				function(photo) {

				// URLの取得方法
//alert(photo.getField(opensocial.MediaItem.Field.URL));
//objectdump(photo, document.getElementById("dumpArea"));
					var row = document.getElementById('pict_'+albumId);
					var img = document.createElement('img');
					var photoid = photo.getId();
					img.id = "img_"+photoid;
					img.src = photo.getThumbnailUrl();
					img.setAttribute("onload", "setImgSize(this)");
					img.className = "photo";
					row.appendChild(img);
					$j(function($) {
							$('#'+img.id).draggable(
								{
									//grid     : [64,64], //移動量xy
									helper	 : 'clone',
									opacity  : 0.5,    //ドラッグ時の不透明度
									cursor   : 'move', //カーソル形状
									axis     : 'xy'     //ドラッグ方向
								});
					});
//alert(photo.getId());
//objectdump(photo, document.getElementById("dumpArea"));
				});
	}
	else
	{
//objectdump(viewerAlbumsResp, document.getElementById("dumpArea"));
	}

}



var persist =
{
	save: 
	function(key, data)
	{
		alert(key+data);
		var req = opensocial.newDataRequest();
		//req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, key, data));
		req.add(req.newUpdatePersonAppDataRequest("VIEWER", key, data));
		req.send(function(data)
				{
					if ( data.hadError())
					{
						// error
						var msg = data.getErrorMessage();
						alert(msg);
					}
					else
					{
						// success
						//console.log(data);
					}
				});
	},

	loadFromMe:
	function(key)
	{
		var req = opensocial.newDataRequest();
		req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER),"viewer");
		var idSpecParams = {};
		idSpecParams[opensocial.IdSpec.Field.USER_ID] = 
			opensocial.IdSpec.PersonId.VIEWER;
		var escapeParams = {};
		escapeParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = 
			opensocial.EscapeType.NONE;
		var idSpec = opensocial.newIdSpec(idSpecParams);
		req.add(req.newFetchPersonAppDataRequest(
					idSpec, [key], escapeParams), "stored");

		req.send(
				function(data)
				{
					if ( data.hadError())
					{
						// error
						var msg = data.getErrorMessage();
objectdump(data, document.getElementById("dumpArea"));
					}
					else
					{
						// success
						//console.log("success");
						var viewer = data.get("viewer").getData();
						var stored = data.get("stored").getData();
						var obj = stored[viewer.getId()];
						//初期状態。
						if ( obj == undefined )
						{
							obj = {}
							obj[key] = "";
							var jsobj = undefined;
						}
						else
						{
							var jsdata = obj[key];
							var jsobj = gadgets.json.parse(jsdata);
						}
						showData({data:jsobj});
					}
				});
	},

	loadFromFriends:
	function(key) // friends_xxをエクスペ区と
	{
		var req = opensocial.newDataRequest();

		var idSpecParams = {};
		idSpecParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		idSpecParams[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
		idSpecParams[opensocial.IdSpec.Field.NETWORK_DISTANCE] = 1;
		var escapeParams = {};
		escapeParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = 
			opensocial.EscapeType.NONE;
		var idSpec = opensocial.newIdSpec(idSpecParams);
		req.add(req.newFetchPersonAppDataRequest(
					idSpec, [key], escapeParams), "stored");

		req.send(
				function(data)
				{
					if ( data.hadError())
					{
						// error
						var msg = data.getErrorMessage();

objectdump(data, document.getElementById("dumpArea"));
					}
					else
					{
						// success
						//console.log("success");
						var stored = data.get("stored").getData();
						var jsdata;
						// 複数の友達からの場合は複数回呼ばれる感じ。
						for ( var i in stored )
						{
							friendobj[i].data = stored[i];
						}
//objectdump(friendobj, document.getElementById("dumpArea"));
//						var jsdata = stored[key];
//						var jsobj = gadgets.json.parse(jsdata);
//objectdump(jsdata, document.getElementById("dumpArea"));
//console.log(showData);
//						showData({data:jsobj});
					}
				});
		//setTimeout(_loadFromFriends, 10000);
	}
}

