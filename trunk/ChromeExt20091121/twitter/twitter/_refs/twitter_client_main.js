// Twitter_client for Yahoo! Widgets by arawas.
// - http://thinkpad.s30.xrea.com/
// Based on Twiggee - Twitter on Yahoo! Widgets (c) Nakatani Shuyo
// - http://labs.cybozu.co.jp/blog/nakatani/2007/05/twitter_twiggee.html

// **** 定数(っぽいもの) ****
var URL_TW_UPDATE = "http://twitter.com/statuses/update.json?";
var URL_TW_USER_TLINE = "http://twitter.com/statuses/user_timeline.json?count=1";
var URL_TW_FRIENDS_TLINE = "http://twitter.com/statuses/friends_timeline.json?";
// var URL_TW_REPLIES = "http://twitter.com/statuses/replies.json?";
var URL_TW_REPLIES = "http://twitter.com/statuses/mentions.json?";
var URL_TW_DM = "http://twitter.com/direct_messages.json?";
var URL_TW_FAV_CREATE = "http://twitter.com/favourings/create/";	// + msgid + "." + format
var URL_TW_FAV_DESTROY = "http://twitter.com/favourings/destroy/";	// + msgid + "." + format
var URL_TW_RATE_LIMIT_STATUS = "http://twitter.com/account/rate_limit_status.json?";

var URL_TINYURL_API = 'http://remysharp.com/tinyurlapi?callback=tinyurlCallback&url=';
// http://tinyurl.com/api-create.php?url=
//var URL_PROXY="http://www.giovedi.net/cgi-bin/proxy.rb?path=";

// URL周りの正規表現
var REG_URL = /https?:\/\/[-_.!~*'\(\)a-zA-Z0-9;\/?:\@&=+\$,%]+/;
var REG_URL2 = /https?:\/\/[-_.!~*'\(\)a-zA-Z0-9;\/?:\@&=+\$,%#]+/;
var REG_URL3 = /ttps?:\/\/[-_.!~*'\(\)a-zA-Z0-9;\/?:\@&=+\$,%#]+/;

// 文字列定数
var STR_ERR_HTTP_0 = "Twitter API is down? Retrying... [HTTP:0]";
var STR_ERR_HTTP_400 = "You'll be in access restriction by Twitter API... [HTTP:400]";
var STR_ERR_HTTP_502 = "You'll be in temporality access restriction by Twitter API...? [HTTP:502]";
var STR_ERROR = 'An error was occured...';
var STR_WAIT_RETRY = "Cannot refresh data at this time, retry later.";
var STR_LOADING = 'Loading data...';
var STR_LOAD_COMPLETE = 'Load Complete...';
var STR_UPDATE_COMPLETE = 'Update completed, waiting for refresh...';
var STR_VAR_FAVORITE = '#FAVORITE#';
var STR_ADD_FAVORITE = 'Do you wish add to Favorites?' + ":\n\n" + STR_VAR_FAVORITE;
var STR_ADD_FAVORITE_COMPLETE = 'Add to Favorites completed.';
var STR_WELCOME = 'Welcome.';
var STR_LOGIN = 'Login...';
var STR_RETRY_LOGIN = 'Do you want retry login sequence?';
var STR_SET_IDPW = 'Set your ID and password...';
var STR_VAR_DATA = '#DATA#';
var STR_CONFIRM_POST = 'Do you wish to post doing? [' + STR_VAR_DATA + ']';
var STR_VAR_VERSION = '#VERSION#';
var STR_ALERT_NEW_VERSION = 'A newer version [v.' + STR_VAR_VERSION + '] is now available. Would you like to see more information?';
var STR_ALERT_SET_IDPW = 'Please set your user ID and password before using this widget.';
var STR_ALERT_MAC_KEY = 'Mac OSの日本語環境下で投稿の確認を「ダイアログ」にすると、漢字変換をReturnキーで確定したときにダイアログが表示されてしまう場合があります。この設定を「Control+Returnキー」に変更しますか?';	// ※日本語環境でしか表示しない
var STR_ALERT_POST_METHOD = 'Now, Twitter cannot use POST method for getting timeline data(s) since 9th April 2009. Do you wish change this setting to use GET method?';
var STR_ALERT_INIT_FRAME = 'Do you wish to clear past log?';
var STR_TICK_ENABLED = 'Timeline reflesing is enabled.';
var STR_TICK_DISABLED = 'Timeline reflesing is disabled.';
var STR_OK = 'OK';
var STR_YES = 'Yes';
var STR_NO = 'No';

// Growl向け定数
var STR_GROWL_NOTIFY = 'Notify';
var STR_GROWL_REPLIES = 'Replies/DM';

// 状態定数
var TW_MODE_TIMELINE = 0;
var TW_MODE_REPLIES = 1;
var TW_MODE_DM = 2;
var TW_GET_COUNT = 20;
var TW_MODE = TW_MODE_TIMELINE;
var TW_REFRESH_MODE = TW_MODE_TIMELINE;

// **** 環境依存関数 ****
if (system.platform.match(/^mac/)) {
	include('mac.js');
} else {
	include('win.js');
}

/*
if (preferences.countGet.value == '') {
	preferences.countGet.value = TW_GET_COUNT;
}
*/

/*
if (preferences.useGetMethod.value == 1) {
	var METHOD = 'GET';
} else {
	var METHOD = 'POST';
}
*/

var MOBILE = '';
// var MOBILE = '&source=mobile';


// ウィジェット関係の定数
var versionXml = 'http://thinkpad.s30.xrea.com/tmp/widget.xml';
var vitalityDoc = XMLDOM.parse(filesystem.readFile('vitality.xml'));
var widgetDoc = XMLDOM.parse(filesystem.readFile('widget.xml'));
var widgetXml = 'http://thinkpad.s30.xrea.com/data/Twitter_client.xml';
var widgetName = widgetDoc.evaluate('string(/metadata/name)');
var widgetHome = 'http://twitter.g.hatena.ne.jp/arawas/00000001';
var widgetVersion = widgetDoc.evaluate('string(/metadata/version)');


// **** 変数: 状態遷移保存用 ****
var METHOD = 'GET';
var getReq = new XMLHttpRequest();	// タイムライン取得用
var postReq = new XMLHttpRequest();	// タイムライン投稿用
var my_status = '';
var pre_status = '';
var pre_created = new Array(TW_MODE_DM);
var offset = new Array(TW_MODE_DM);

var data_frame = new Array(TW_MODE_DM);
var timeline_frame = new Array(TW_MODE_DM);
var timeline_bar = new Array(TW_MODE_DM);
// var userIcons = new Array();

var tabChanged = true;

// フレーム生成
for (var i=0; i<=TW_MODE_DM; i++) {
	if (i == 0) {
		visible = true;
	} else {
		visible = false;
	}
	data_frame[i] = new Frame();
	data_frame[i].hOffset = 5;
	data_frame[i].vOffset = 55;
	data_frame[i].width = 230;
	data_frame[i].height = 260;
	data_frame[i].visible = visible;

	timeline_bar[i] = new ScrollBar();
	timeline_frame[i] = new Frame();
	timeline_frame[i].hOffset = 0;
	timeline_frame[i].vOffset = 0;
	timeline_frame[i].width = 228;
	timeline_frame[i].height = 260;
	timeline_frame[i].vLineSize = 26;
	timeline_frame[i].vScrollBar = timeline_bar[i];
	timeline_frame[i].visible = true;
	timeline_bar[i].hOffset = 215;
	timeline_bar[i].vOffset = 3;
	timeline_bar[i].height = 256;
	timeline_bar[i].onValueChanged = 'setAutoScroll();';
	timeline_bar[i].visible = true;

	data_frame[i].appendChild(timeline_frame[i]);
	data_frame[i].appendChild(timeline_bar[i]);

	mainWindow.appendChild(data_frame[i]);

	pre_created[i] = '';
	offset[i] = 0;
}


// MAIN ///////////////////////////////////////////////////////////
// login();
init();

// Language //////////////////////////////////////////////////////////

function lang() {
	if (!system.languages[0].match(/^ja/)) return;

	// 環境設定
	preferenceGroups.account.title = "アカウント";
	preferenceGroups.views.title = "表示";
	preferenceGroups.options.title = "オプション";
	preferenceGroups.colors.title = "配色とフォント";
	preferences.userAccount.title = "ID: ";
	preferences.userAccount.description = "TwitterのIDを入力してください。";
	preferences.userPassword.title = "パスワード: ";
	preferences.userPassword.description = "Twitterのパスワードを入力してください。";
	preferences.useGetMethod.title = "GETメソッドを使用する";
	preferences.useGetMethod.description = "タイムラインの取得にGETメソッドを使用します。Twitterサーバーの仕様変更のため、2009年04月09日以降はこのオプションの使用を *強く推奨* します。";
	preferences.postScript.title = "接尾辞: ";
	preferences.postScript.description = "この項目が入力されている場合、発言の末尾に [] で括って付加します。";
	preferences.showImage.title = "ユーザーのアイコンを表示";
	preferences.showImage.description = "タイムラインにユーザーのアイコンを表示します。";
	preferences.refreshInterval.title = "更新間隔: ";
	preferences.refreshInterval.description = "タイムラインの更新を行う間隔を分単位で指定します。";
/*
	preferences.useAutoScroll.title = "自動スクロールする";
	preferences.useAutoScroll.description = "タイムラインの発言が長い場合、自動スクロールします。";
*/
	preferences.confirmPost.title = "投稿の確認: ";
	preferences.confirmPost.description = "投稿の確認方法を「ダイアログ」「Ctrl+Enter (Mac: Control+Return) キー」または「確認なし」から選択します。";
	preferences.countGet.title = "取得件数: ";
	preferences.countGet.description = "一度の取得で取得するタイムラインの件数を指定します。";
	preferences.refreshAfterUpdate.title = "投稿後にタイムラインを更新";
	preferences.refreshAfterUpdate.description = "発言の投稿後、更新間隔を無視してタイムラインを更新するかどうかを選択します(※選択すると、それだけAPI制限を受けやすくなります)。";
	preferences.useWrap.title = "自動的に折り返す";
	preferences.useWrap.description = "タイムラインの発言が長い場合、自動的に内容を折り返します。";
	// preferences.useTinyUrl.title = "TinyURLを使う";
	// preferences.useTinyUrl.description = "ステータスにURLが含まれていた場合、TinyURLを使って変換します。";
	preferences.useGetMethod.title = "GETメソッドを使う";
	preferences.useGetMethod.description = "タイムラインの取得にGETメソッドを使用します (必要な場合のみこの項目をチェックしてください)。";
	preferences.backgroundColor.title = "背景色: ";
	preferences.backgroundColor.description = "ウィジェットの背景色を指定します。";
	preferences.focusColor.title = "フォーカス色: ";
	preferences.focusColor.description = "フォーカスのある項目の背景色を指定します。";
	preferences.foregroundColor.title = "文字色: ";
	preferences.foregroundColor.description = "ウィジェットの文字色を指定します。";
	preferences.noticeColor.title = "注目色: ";
	preferences.noticeColor.description = "注目文字列の色を指定します。";
	preferences.selfColor.title = "自発言色: ";
	preferences.selfColor.description = "自分の発言の色を指定します。";
	preferences.fontSize.title = "フォント サイズ: ";
	preferences.fontSize.description = "基本となるフォントサイズを指定します。";

	// 文字列リソース
	STR_ERR_HTTP_0 = "Twitter APIがダウンしているかも知れません... [HTTP:0]";
	STR_ERR_HTTP_400 = "アカウントがAPI制限を受けています。 [HTTP:400]";
	STR_ERR_HTTP_502 = "アカウントがAPI制限を受けているかも知れません... [HTTP:502]";
	STR_ERROR = 'エラーが発生しました。';
	STR_LOADING = '読み込み中...';
	STR_LOAD_COMPLETE = '読み込みが完了しました。';
	STR_WAIT_RETRY = 'データを読み込めません。しばらく経ってから再試行してください。';
	STR_UPDATE_COMPLETE = '投稿が完了しました。更新を待機中...';
	STR_ADD_FAVORITE = 'この発言を Favorites に追加しますか?' + ":\n\n" + STR_VAR_FAVORITE;
	STR_ADD_FAVORITE_COMPLETE = 'Favoritesへの追加が完了しました。';
	STR_LOGIN = 'ログイン中...';
	STR_RETRY_LOGIN = 'ログイン処理をやり直しますか?';
	STR_SET_IDPW = 'IDとパスワードを設定してください。';
	STR_CONFIRM_POST = '発言をこの内容で投稿しますか? [' + STR_VAR_DATA + ']';
	STR_ALERT_NEW_VERSION = '新しいバージョン [v.' + STR_VAR_VERSION + '] がリリースされています。詳しい情報を表示しますか?';
	STR_ALERT_SET_IDPW = 'ウィジェットを使用するために、TwitterのIDとパスワードを設定してください。';
	STR_ALERT_POST_METHOD = '2009年04月09日以降、Twitterはタイムラインのデータ取得にPOSTメソッドを使用することができなくなりました。この設定をGETメソッドに変更しますか?';
	STR_ALERT_INIT_FRAME = '過去のログを消去してもよろしいですか?';
	STR_TICK_ENABLED = 'タイムラインの自動更新が有効になりました。';
	STR_TICK_DISABLED = 'タイムラインの自動更新を無効にしました。';
	STR_YES = 'はい';
	STR_NO = 'いいえ';
}

// Twiggee ///////////////////////////////////////////////////////////

// **** 動作の初期化 ****
function init() {
	lang();
	growlInit();

	ticker.interval = preferences.refreshInterval.value;
	repliesTicker.ticking = false;
	dmTicker.ticking = false;

	myimage.src = 'Images/no_picture.png';
	myimage.width = 32;
	myimage.height = 32;
	myname.data = STR_WELCOME;
	mystatus.data = mystatus.tooltip = pre_status = my_status = '';

	apilimit.color = preferences.foregroundColor.value;


	changeMyStatus(STR_LOGIN, true);

	for(var i=0; i<=TW_MODE_DM; i++) {
		initFrame(i);

		pre_created[i] = '';
		offset[i] = 0;
	}
	TW_MODE = TW_MODE_TIMELINE;
	pre_created[TW_MODE_TIMELINE] = preferences.pre_created.value;

	// 色の設定
	changeColor();
	myname.color = preferences.foregroundColor.value;
	mystatus.color = preferences.foregroundColor.value;

	onChangePreferences();	// 念のため環境設定を確認してからログイン実行

	return true;
}
function changeColor() {
	overlay.colorize = preferences.backgroundColor.value;
	tabBg.colorize = preferences.backgroundColor.value;
	tabTL.colorize = preferences.backgroundColor.value;
	tabRep.colorize = preferences.backgroundColor.value;
	tabDM.colorize = preferences.backgroundColor.value;
}
function changeRefresh() {
	if (ticker.ticking == false) {
		ticker.ticking == true;
		alert(STR_TICK_ENABLED, STR_OK);
	} else {
		ticker.ticking == false;
		alert(STR_TICK_DISABLED, STR_OK);
	}
	ticker.reset();
}

// ログイン処理
function login() {
	// init();
	refreshTimeline(TW_MODE_TIMELINE);
	// 更新の確認
	checkUpdateWidget();
	print("login();COMPLETE");
}

// アンロード時処理
function onUnload () {
	preferences.pre_created.value = pre_created[TW_MODE_TIMELINE];
}

// BASIC認証鍵を生成する
function makeBasicAuthKey() {
	var user = trim(preferences.userAccount.value);
	var pass = trim(preferences.userPassword.value);
	if (user != '' && pass != '') {
		basic = base64encode(user + ':' + pass);
		return "Basic " + basic;
	} else {
		showWidgetPreferences();
	}
}

// 自ステータスの取得+表示更新
function refreshStatus() {
	var method = METHOD;

	var auth = makeBasicAuthKey();
	if (auth) {
		if (canXmlHttpRequest(postReq) != true) {
			abortXmlHttpRequest(postReq);
		}
		postReq.onreadystatechange = userHandler;
		postReq.open(method, URL_TW_USER_TLINE, true);
		postReq.setRequestHeader("Authorization", auth);
		postReq.send();
	}
}
function userHandler() {
	var data;

	if (this.readyState == 4 && this.status == 200) {
		setRefresh(false);
		data = eval("(" + this.responseText + ")");
		if (data.length > 0) {
			data[0].user.name = unhtmlentities(data[0].user.name);
			data[0].user.screen_name = unhtmlentities(data[0].user.screen_name);
			data[0].text = unhtmlentities(data[0].text);

			// myimage.src = data[0].user.profile_image_url;
			myimage.src = getUserIconFile(data[0].user.screen_name, encodeURI(data[0].user.profile_image_url));
			myimage.width = 32;
			myimage.height = 32;
			myname.data = data[0].user.screen_name;
			changeMyStatus(data[0].text, false);
		}
		expandView(true);
		setRefresh(true);
	}
}


// Update User Status ////////////////////////////////////////////////

// 自ステータスの発言+更新
function onInputStatus() {
	var data = trim(statusEntry.data);
	if (trim(data) != "" && (system.event.keyString == "Return" || system.event.keyString == "Enter")) {
		answer = 0;
		// 投稿確認の方法
		if (preferences.confirmPost.value == 'popup') {
			answer = alert(STR_CONFIRM_POST.replace(RegExp(STR_VAR_DATA, 'g'), data), STR_YES, STR_NO);
		} else if (preferences.confirmPost.value == 'key' && (system.event.ctrlKey == true || system.event.modifiers == 'command')) {
			answer = 1;
		} else if (preferences.confirmPost.value == 'none') {
			answer = 1;
		}
		if (answer == 1) {
			// 投稿
			if (trim(preferences.postScript.value) != '') {
				// 接尾辞の重複チェック
				if (!data.match("\\[" + trim(preferences.postScript.value) + "\\]$", 'g')) {
					print('onInputStatus();Postscript');
					data = data + ' [' + trim(preferences.postScript.value) + ']';
				}
			}
			// URLのチェック
/*
			var url = data.match(REG_URL2);
			if (url && preferences.useTinyUrl.value == 1) {
				// TinyURL処理して更新
				pre_status = data;
				tinyurlPost(url);
			} else {
				// 更新
				updateStatus(data);
			}
*/
			// 更新
			updateStatus(data);
			statusEntry.data = '';
		}
		statusEntry.rejectKeyPress();
	} else if (trim(data) == "" && (system.event.keyString == "Return" || system.event.keyString == "Enter" || system.event.keyString == "Escape")) {
		changeEditable(false);
	}
}
function updateStatus(status) {
	var postdata = "status=" + encodeURIComponent(status) + MOBILE;
	// print(postdata)

	var auth = makeBasicAuthKey();
	if (auth) {
		setRefresh(false);
		if (canXmlHttpRequest(postReq) != true) {
			abortXmlHttpRequest(postReq);
		}
		postReq.onreadystatechange = updateHandler;
		// postReq.open(METHOD, URL_TW_UPDATE, true);
		postReq.open("POST", URL_TW_UPDATE, true);
		postReq.setRequestHeader("Authorization", auth);
		postReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		postReq.setRequestHeader("X-Twitter-Client", widgetName);
		postReq.setRequestHeader("X-Twitter-Client-Version", widgetVersion);
/*
		postReq.setRequestHeader("X-Twitter-Client-URL", widgetXml);
*/
		postReq.send(postdata);
		setRefresh(true);
	}
	changeEditable(false);
}
function updateHandler() {
	if (this.readyState == 4 && this.status == 200) {
		changeMyStatus(STR_UPDATE_COMPLETE, true);
		if (preferences.refreshAfterUpdate.value == 1) {
			refreshStatus();
		}
	} else {
/*
		if (this.readyState == 4) {
			changeMyStatus(STR_ERROR + " [HTTP:" + this.status + "]", true);
		}
*/
		alert(STR_ERROR + " [HTTP:" + this.status + "]", STR_OK);
		changeEditable(true);
		statusEntry.data = status;
	}
}
// ステータス行の変更
// str: 文字列, status: ステータスか発言か(true=ステータス,false=発言)
function changeMyStatus(str, status) {
	if (status != false) {
		mystatus.data = trim(str);
		mystatus.color = preferences.selfColor.value;
	} else {
		if (TW_MODE == TW_MODE_TIMELINE) {
			mystatus.color = preferences.foregroundColor.value;
			mystatus.data = trim(str);
		}
		mystatus.tooltip = pre_status = my_status = trim(str);
	}
}

// TinyURL ///////////////////////////////////////////////////////////

// URLをTinyURL APIで短縮+置換
function tinyurlPost(url) {
	if (canXmlHttpRequest(postReq) != true) {
		abortXmlHttpRequest(postReq);
	}
	postReq.onreadystatechange = tinyurlHandler;
	postReq.open("GET", URL_TINYURL_API + url, true);
	postReq.send();
}
function tinyurlHandler() {
	if (this.readyState == 4 && this.status == 200) {
		eval(this.responseText);
	}
}
function tinyurlCallback(url) {
	updateStatus(pre_status.replace(REG_URL2, url));
}


// Refresh Friends Timeline //////////////////////////////////////////

// タイムラインの表示更新
function refreshTimelines() {
/*
	// API制限予防のため、現行コードでは全部は取得しない
	for (var i=0; i<=TW_MODE_DM; i++) {
		refreshTimeline(i);
	}
*/
	refreshTimeline(TW_MODE_TIMELINE);
}
// タイムラインの表示更新
// mode: 取得する対象 (0=タイムライン,1=Replies,2=DM)
function refreshTimeline(mode) {
	// print('refreshTimeline();"+mode+':'+(new Date()));
	var method = METHOD;
	var auth = makeBasicAuthKey();
	if (auth) {
		if (mode == TW_MODE_DM) {
			if (dmTicker.ticking == true) {
				print('refreshTimeline();'+mode+':ABORT_DM');
				changeMyStatus(STR_WAIT_RETRY, true);
				return false;
			}
			method = 'GET';
			var url = URL_TW_DM + pre_created[TW_MODE_DM];
		} else if (mode == TW_MODE_REPLIES) {
			if (repliesTicker.ticking == true && preferences.useGetMethod.value == 1) {
				print('refreshTimeline();'+mode+':ABORT_REPLIES');
				changeMyStatus(STR_WAIT_RETRY, true);
				return false;
			}
			var url = URL_TW_REPLIES + pre_created[TW_MODE_REPLIES];
		} else {
			var url = URL_TW_FRIENDS_TLINE + pre_created[TW_MODE_TIMELINE];
			url = url + '&count=' + preferences.countGet.value;
		}
		// url = url + '&count=' + preferences.countGet.value;
		changeMyStatus(STR_LOADING, true);
		print('refreshTimeline();'+mode+':'+method+' '+url);
		TW_REFRESH_MODE = mode;
		if (canXmlHttpRequest(getReq) != true) {
			abortXmlHttpRequest(getReq);
		}
		getReq.onreadystatechange = timelineHandler;
		// getReq.autoRedirect = false;
		getReq.open(method, url, true);
		getReq.setRequestHeader("Authorization", auth);
		getReq.send();

		return true;
	} else {
		return false;
	}
}
function timelineHandler() {
	tabChanged = false;
	mode = TW_REFRESH_MODE;

	ticker.ticking = false;

	if (this.readyState == 4 && this.status == 200) {
		print('timelineHandler();'+mode+';READY');
		changeMyStatus(STR_LOAD_COMPLETE, true);
		// print(this.responseText);
		if (this.responseText.length > 0) {
			try {
				var data = eval('(' + this.responseText + ')');
			} catch (e) {
				var data = '';
				print('timelineHandler();INVALID');
				print(this.responseText);
			}
			if (data.length > 0) {
				var smax = timeline_bar[mode].max;
				var sval = timeline_bar[mode].value;

				timeline_bar[mode].onValueChanged = '';
				// pre_created[mode] = '&since=' + encodeURIComponent(data[0].created_at)+'&since_id=' + encodeURIComponent(data[0].id);
				pre_created[mode] = '&since_id=' + encodeURIComponent(data[0].id);
				setRefresh(false);
				print('timelineHandler();'+mode+';DATA:'+data.length);
				growlNofity('New message(s)', data.length + ' new message(s).', STR_GROWL_NOTIFY, '');	// Growl
				for(var i=data.length-1; i>=0; i--) {
					addNewStatus(data[i], mode);
				}
				// print("Timeline added.");

				// エラー復帰処理
				if (mode == TW_MODE_TIMELINE) {
					if (myname.data == STR_WELCOME && (mystatus.data == STR_LOGIN || trim(my_status) == '')) {
						// 自ステータスの更新を試みる
						refreshStatus();
					} else if (mystatus.data != my_status) {
					// if (mystatus.data.match(RegExp('HTTP:0', 'g')) || mystatus.data.match(RegExp('HTTP:400', 'g')) || mystatus.data.match(RegExp('HTTP:502', 'g'))) {
						// 直前の発言に変更
						changeMyStatus(my_status, false);
					}

					// 初回取得対策
					if (timeline_frame[mode].subviews != null) {
						if (timeline_frame[mode].subviews.length == preferences.countGet.value) {
							expandView(true);
						}
					}
					preferences.pre_created.value = pre_created[TW_MODE_TIMELINE];
				} else {
					//
				}

				setRefresh(true);

				// リストをスクロールするか否かチェック
				if (smax != sval) {
					// print('timelineHandler();'+mode+';NO_SCROLL:'+sval+'/'+smax);
					timeline_bar[mode].value = sval;	// - offset[mode];
				} else {
					// print('timelineHandler();'+mode+';SCROLL:'+timeline_bar[mode].max);
					timeline_bar[mode].value = timeline_bar[mode].max;
				}
				// setAutoScroll();
			}
		}
	} else {
		// エラー発生時
		// print('timelineHandler();'+mode+';STATE:'+this.readyState);
		if (this.readyState == 4) {
			print('timelineHandler();'+mode+';FAULT_STATUS:'+this.status);
			if (this.status == 0) {
				changeMyStatus(STR_ERR_HTTP_0, true);
			} else if (this.status == 400) {
				// API制限
				changeMyStatus(STR_ERR_HTTP_400, true);
			} else if (this.status == 502) {
				// 一時的なAPI制限?
				changeMyStatus(STR_ERR_HTTP_502, true);
			} else {
				changeMyStatus(my_status, false);
			}
		}
	}

	// API制限予防; RepliesとDMの過剰取得を制限する
	if (this.readyState == 4) {
		if (mode == TW_MODE_DM) {
			print('timelineHandler();'+mode+';RESTRICT_DM:START');
			dmTicker.ticking = true;
		} else if (mode == TW_MODE_REPLIES) {
			print('timelineHandler();'+mode+';RESTRICT_REPLIES:START');
			repliesTicker.ticking = true;
		}
	}

	ticker.ticking = true;

	tabChanged = true;
}

// タイムラインのフレームに発言を新規追加する
// item: 内容を格納した配列
// mode: 追加する対象
function addNewStatus(item, mode) {
	var imageSize = 24;
	var d = new Date(item.created_at);
	date = d.getFullYear()+'/'+d2(d.getMonth()+1)+'/'+d2(d.getDate())+' '+d2(d.getHours())+':'+d2(d.getMinutes())+':'+d2(d.getSeconds());

	if (mode == TW_MODE_DM) {
		var user = item.sender;
	} else {
		var user = item.user;
	}
	user.name = unhtmlentities(user.name);
	item.text = unhtmlentities(item.text);

	var id = 0;
	if (timeline_frame[mode].subviews != null) {
		id = timeline_frame[mode].subviews.length;
	}
	// ベースフレーム
	var fbase = new Frame();
	fbase.hOffset = 0;
	fbase.vOffset = offset[mode]+2;
	fbase.width = timeline_frame[mode].width - 16;
	fbase.height = imageSize;
	fbase.name = 'frame';
	fbase.id = 'f' + mode + 'b' + id;
	fbase.onMouseEnter = "widget.getElementById('f" + mode + 'b' + id + "').style.background = preferences.focusColor.value; widget.getElementById('f" + mode + 's' + id + "').scrolling = 'autoLeft';";
	fbase.onMouseExit = "widget.getElementById('f" + mode + 'b' + id + "').style.background = 'transparent'; widget.getElementById('f" + mode + 's' + id + "').scrolling = 'off';";

	// var menu = "var items = new Array(); items[0] = new MenuItem(); items[0].title = 'DM to " + user.screen_name + "'; items[0].onSelect = if (true) { statusEntry.data = '" + edit + " ' + statusEntry.data; changeEditable(true); } items[1] = new MenuItem(); items[1].title = 'Open " + user.screen_name + "\' page'; items[1].onSelect = openWebPage('" + url + "'); fimage.contextMenuItems = items;";
	// fimage.onContextMenu = menu;

	// アイコン
/*
	// 表示切り替え: アイコンを完全に表示しない版 (TODO: 非表示でのアイコンアクション制限、ユーザーアイコンが遅い)
	if (preferences.showImage.value == 1) {
		var fimage = new Image();
		fimage.hOffset = 0;
		fimage.vOffset = 0;
		fimage.width = imageSize;
		fimage.height = imageSize;
		fimage.name = 'icon';
		fimage.id = 'f' + mode + 'i' + id;
		// fimage.tooltip = item.user.screen_name;
		fimage.tooltip = user.name;
		fimage.src = encodeURI(user.profile_image_url);
		var url = "http://twitter.com/" + user.screen_name;
		if (mode == TW_MODE_DM) {
			var edit = "d " + user.screen_name;
		} else {
			var edit = "@" + user.screen_name;
		}
		fimage.onMultiClick = "if (system.event.ctrlKey == true) { statusEntry.data = '" + edit + " ' + statusEntry.data; changeEditable(true); } else { if (system.event.clickCount == 2) { openWebPage('" + url + "'); } }";
		fbase.appendChild(fimage);
	} else {
		imageSize = 0;
	}
*/
/*
	// 表示切り替え: デフォルトアイコンを表示する版 (TODO: ユーザーアイコンが遅い)
	var fimage = new Image();
	fimage.hOffset = 0;
	fimage.vOffset = 0;
	fimage.width = imageSize;
	fimage.height = imageSize;
	fimage.name = 'icon';
	fimage.id = 'f' + mode + 'i' + id;
	// fimage.tooltip = item.user.screen_name;
	fimage.tooltip = user.name;
	if (preferences.showImage.value == 1) {
		fimage.src = encodeURI(user.profile_image_url);
	} else {
		fimage.src = 'Images/no_picture.png';
	}
	var url = "http://twitter.com/" + user.screen_name;
	if (mode == TW_MODE_DM) {
		var edit = "d " + user.screen_name;
	} else {
		var edit = "@" + user.screen_name;
	}
	fimage.onMultiClick = "if (system.event.ctrlKey == true) { statusEntry.data = '" + edit + " ' + statusEntry.data; changeEditable(true); } else { if (system.event.clickCount == 2) { openWebPage('" + url + "'); } }";
	fbase.appendChild(fimage);
*/
/*
	// 表示切り替え: Canvas版 (TODO: Canvasのコピーがうまく行かない)
	if (preferences.showImage.value == 1) {
		var fimage = new Canvas();
		fimage = getUserIconObject(user.screen_name, encodeURI(user.profile_image_url));
	} else {
		var fimage = new Image();
		fimage.loadingSrc = 'Images/no_picture.png';
		fimage.missingSrc = 'Images/no_picture.png';
		fimage.src = 'Images/no_picture.png';
	}
	fimage.hOffset = 0;
	fimage.vOffset = 0;
	fimage.width = imageSize;
	fimage.height = imageSize;
	fimage.name = 'icon';
	fimage.id = 'f' + mode + 'i' + id;
	// fimage.tooltip = item.user.screen_name;
	fimage.tooltip = user.name;

	var url = "http://twitter.com/" + user.screen_name;
	if (mode == TW_MODE_DM) {
		var edit = "d " + user.screen_name;
	} else {
		var edit = "@" + user.screen_name;
	}
	fimage.onMultiClick = "if (system.event.ctrlKey == true) { statusEntry.data = '" + edit + " ' + statusEntry.data; changeEditable(true); } else { if (system.event.clickCount == 2) { openWebPage('" + url + "'); } }";
	fbase.appendChild(fimage);
*/
	// 表示切り替え: Image版
	var fimage = new Image();
	fimage.hOffset = 0;
	fimage.vOffset = 0;
	fimage.width = imageSize;
	fimage.height = imageSize;
	fimage.name = 'icon';
	fimage.id = 'f' + mode + 'i' + id;
	// fimage.tooltip = item.user.screen_name;
	fimage.tooltip = user.name + ' [' + remove_html_tags(item.source) + ']';
	fimage.loadingSrc = fimage.missingSrc = fimage.src = 'Images/no_picture.png';
	if (preferences.showImage.value == 1) {
		fimage.src = getUserIconFile(user.screen_name, encodeURI(user.profile_image_url));
	}

	var url = "http://twitter.com/" + user.screen_name;
	if (mode == TW_MODE_DM) {
		var edit = "d " + user.screen_name;
	} else {
		var edit = "@" + user.screen_name;
	}
	fimage.onMultiClick = "if (system.event.ctrlKey == true) { statusEntry.data = '" + edit + " ' + statusEntry.data; changeEditable(true); } else { if (system.event.clickCount == 2) { openWebPage('" + url + "'); } }";
	fbase.appendChild(fimage);

	var str = '';
	if (user.protected != false) {
		// protected
		str = str + 'X';
	}
	if (user.following != true) {
		// not friend
		str = str + 'R';
	}
	if (str != '') {
		str = ' ' + str + ' ';
	}

	// 名前と日時
	var fnamedate = new Text();
	fnamedate.hOffset = imageSize + 4;
	fnamedate.vOffset = preferences.fontSize.value - 1;
	fnamedate.name = 'namedate';
	fnamedate.id = 'f' + mode + 'n' + id;
	fnamedate.size = (preferences.fontSize.value - 1);
	fnamedate.color = preferences.foregroundColor.value;
	fnamedate.data = '[' + user.screen_name + '] ' + date + str;
	if (mode != TW_MODE_DM) {
		fnamedate.onMultiClick = "if (system.event.clickCount == 2) { if (system.event.ctrlKey == true) { addFavorites(" + item.id + ", " + id + ") } else { openWebPage('http://twitter.com/" + user.screen_name + "/statuses/" + item.id + "'); } }";
	}
	fbase.appendChild(fnamedate);

	// ステータス
	var fstatus = new Text();
	fstatus.hOffset = imageSize + 4;
	if (preferences.useWrap.value != 1) {
		// fstatus.vOffset = 20 + (preferences.fontSize.value / 3);
		fstatus.vOffset = fnamedate.vOffset + fnamedate.height + 3;	// +15
		fstatus.wrap = false;
	} else {
		// fstatus.vOffset = 12 + (preferences.fontSize.value / 3);
		fstatus.vOffset = fnamedate.height + 3;
		fstatus.wrap = true;
	}
	fstatus.width = 208 - imageSize;
	fstatus.name = 'status';
	fstatus.id = 'f' + mode + 's' + id;
	fstatus.size = preferences.fontSize.value;
	fstatus.color = preferences.foregroundColor.value;
	fstatus.data = item.text;
	fstatus.tooltip = item.text;
	// リンク付与
	var url = item.text.match(REG_URL2);
	if (url) {
		fstatus.onMultiClick = "if (system.event.clickCount == 2) { openWebPage('" + url + "'); }";
	} else {
		url = item.text.match(REG_URL3);	// "ttp: 対応"
		if (url) {
			fstatus.onMultiClick = "if (system.event.clickCount == 2) { openWebPage('h" + url + "'); }";
		}
	}
	// 発言の着色
	if (mode == TW_MODE_TIMELINE) {
		// if (item.text.match("\@" + myname.data)) {
		// if (item.text.match("\@" + preferences.userAccount.value)) {
		if (item.text.match("\@" + preferences.userAccount.value) && !item.text.match("RT[: ]")) {
			// 自分宛
			fnamedate.color = preferences.noticeColor.value;
			fstatus.color = preferences.noticeColor.value;
			growlNofity(user.screen_name, item.text, STR_GROWL_REPLIES, fimage.src);	// Growl
		}
		// if (user.screen_name == myname.data) {
		if (user.screen_name == preferences.userAccount.value) {
			fnamedate.color = preferences.selfColor.value;
			fstatus.color = preferences.selfColor.value;
			// 自発言なら、自ステータスも書き換え
			// myimage.src = user.profile_image_url;
			myimage.src = getUserIconFile(user.screen_name, encodeURI(user.profile_image_url));
			myimage.width = 32;
			myimage.height = 32;
			myname.data = user.screen_name;
			changeMyStatus(item.text, false);
		}
	}
	fbase.appendChild(fstatus);

	if (preferences.useWrap.value != 1) {
		height = fnamedate.vOffset + 3 + fstatus.height;
	} else {
		height = fstatus.vOffset + fstatus.height;
	}
	if (fbase.height < height) {
		fbase.height = height;
	}

	// タイムラインフレームへ追加
	timeline_frame[mode].appendChild(fbase);
	// Dockアイテムを設定
	// addDockItem(fimage.src);

	offset[mode] += (fbase.height + 2);
	// sleep(1);
}
function d2(v) {return (v<10)?'0'+v:v}

/*
// ユーザーアイコン用Canvasオブジェクトを返す
function getUserIconObject(id, url) {
	// RegExp("^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$", 'i');
	var c = String(url).match(RegExp("^(https?|ftp):\/\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)$", 'i'));
	var uid = id + '_' + c[5] + '-' + c[6];

	var tmp = new Image();
	tmp.width = tmp.height = 24;
	tmp.loadingSrc = tmp.missingSrc = tmp.src = 'Images/no_picture.png';

	if (!widget.getElementById(uid)) {
		// 該当のユニークIDが存在しない
		// print('getUserIconObject();NOT_EXIST:'+url);
		var cache = system.widgetDataFolder + '/' + uid;
		// キャッシュの存在チェック
		if (filesystem.itemExists(cache)) {
			// キャッシュが存在する
			tmp.src = cache;
		} else {
			// キャッシュが存在しない; URLから取得
			var src = new URL();
			// src.outputFile = system.widgetDataFolder + '/tw_icons/' + uid;
			src.outputFile = system.widgetDataFolder + '/' + uid;
			src.location = url;
			if (src.fetch() != 'Could not load URL') {
				if (src.response == 200) {
					tmp.src = src.outputFile;
				} else {
					//
					print('getUserIconObject();FETCH_FAULT:'+src.response);
				}
			}
		}
		userIcons[uid] = new Canvas();
		userIcons[uid].id = uid;
		userIcons[uid].width = userIcons[uid].height = 24;
		var context = widget.getElementById(uid).getContext('2d');
		context.drawImage(tmp, 0, 0, 24, 24);
		context.save();
	} else {
		// 既にユニークIDが存在する
		// print('getUserIconObject();EXIST:'+uid);
		// var context = widget.getElementById(uid).getContext('2d');
	}

	return widget.getElementById(uid);
}
*/

// ユーザーアイコンのファイル名を返す
function getUserIconFile(id, url) {
	try {
		// RegExp("^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$", 'i');
/*
		var c = String(url).match(RegExp("^(https?|ftp):\/\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)$", 'i'));
		var uid = id + '_' + c[5] + '-' + c[6];	// 2009.08? twimg.comへの移行で使用できなくなった
*/
		var c = String(url).match(RegExp("^(https?|ftp):\/\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)\/([-_.!~*\'()a-zA-Z0-9;?:\@&=+\$,%#]+)$", 'i'));
		var uid = id + '_' + c[4] + '-' + c[5];	// TODO: 正規表現決め打ちロジックをなんとかする
	} catch (e) {
		var uid = id + '_';
		print('getUserIconFile('+id+','+url+');ERROR:' + e);
	}
	var cache = system.widgetDataFolder + '/' + uid;
	// var fs = new Filesystem();
	if (filesystem.itemExists(cache)) {
		// キャッシュが存在する
	} else {
		// キャッシュが存在しない; URLから取得
		var src = new URL();
		// src.outputFile = system.widgetDataFolder + '/tw_icons/' + uid;
		src.outputFile = system.widgetDataFolder + '/' + uid;
		src.location = url;
		if (src.fetch() != 'Could not load URL') {
			if (src.response == 200) {
				//
			} else {
				print('getUserIconObject();FETCH_FAULT:'+src.response);
			}
		}
	}
	// 画像の正当性を検証
	try {
		// 不正な画像はXMLデータで返ってくるので、パースしてみる
		var err = XMLDOM.parse(filesystem.readFile(cache)).evaluate('string(/Error/Code)');
		if (err != '') {
			// XMLを評価してエラーコードがある場合、画像ではない
			print('getUserIconFile();INVALID:'+uid);
			cache = 'Images/no_picture.png';
		}
	} catch (e) {
		// 例外を吐いた(= XMLではない)場合、画像は正当と見なす
		// throw e;
		// print('getUserIconFile();VALID');
	}

	return cache;
}

// API制限のチェック
function checkApiLimit() {
	// print('checkApiLimit();"+(new Date()));
	var method = METHOD;
	var url = URL_TW_RATE_LIMIT_STATUS;
	var auth = makeBasicAuthKey();

	if (auth) {
		if (canXmlHttpRequest(getReq) != true) {
			abortXmlHttpRequest(getReq);
		}
		getReq.onreadystatechange = checkApiLimitHandler;
		// getReq.autoRedirect = false;
		getReq.open(method, url, true);
		getReq.setRequestHeader("Authorization", auth);
		getReq.send();

		return true;
	} else {
		return false;
	}
}
function checkApiLimitHandler() {
	if (this.readyState == 4 && this.status == 200) {
		print('checkApiLimitHandler();'+';READY');
		if (this.responseText.length > 0) {
			try {
				var data = eval('(' + this.responseText + ')');
			} catch (e) {
				var data = '';
				print('checkApiLimitHandler();INVALID');
				print(this.responseText);
			}
			if (!!data) {
				if ('remaining_hits' in data && 'hourly_limit' in data) {
					apilimit.data = 'API:' + data.remaining_hits + '/' + data.hourly_limit;
				}
				if ('reset_time_in_seconds' in data) {
					apilimit.tooltip = 'Reset at: ' + epoch2date(data.reset_time_in_seconds);
				}
/*
				if ('length' in data) {
					print('LEN:'+data.length);
				}
				if ('remaining_hits' in data) {
					print('RH:'+data.remaining_hits);
				}
				if ('hourly_limit' in data) {
					print('HL:'+data.hourly_limit);
				}
				if ('reset_time' in data) {
					print('RT:'+data.reset_time);
				}
				if ('reset_time_in_seconds' in data) {
					print('RTI:'+data.reset_time_in_seconds);
					print('-CONV:'+epoch2date(data.reset_time_in_seconds));
				}
*/
			}
		}
	} else {
		// エラー発生時
		// print('checkApiLimitHandler();'+';STATE:'+this.readyState);
	}
}


// Dockアイテムを設定する
function addDockItem(src) {
	if (trim(src) != '' && widget.dockOpen) {
		var dock = vitalityDoc;

/*
		var dockBase = dock.getElementById("base");
*/
		for (var i = 0; i <= 8; i++) {
			dockCurrItem = dock.getElementById('img'+i);
			dockNextItem = dock.getElementById('img'+(i+1));

			if (i < 8) {
				if (dockCurrItem != null && dockNextItem != null) {
					currImage = dockCurrItem.getAttribute('src');
					nextImage = dockNextItem.getAttribute('src');
					print("LOOP"+i+":"+currImage+"/"+nextImage);
					if (trim(nextImage) != '') {
						dockCurrItem.setAttribute("src", nextImage);
					} else {
						dockCurrItem.removeAttribute("src");
					}
				}
			} else {
				if (dockCurrItem != null) {
					print("LOOP"+i+":"+src);
					dockCurrItem.setAttribute("src", src);
					print("->SRC:"+dockCurrItem.src);
				}
			}
		}
/*
		var dockText = dock.getElementById("text");
		dockText.setAttribute("data", text);
*/

		// widget.setDockItem(dock, "fade");
		widget.setDockItem(dock);
	}
}


// Handle Favorites ////////////////////////////////////////////////

// Favoritesへの追加
function addFavorites(id, data) {
	print('addFavorites();'+data);

	name = widget.getElementById('f' + TW_MODE + 'n' + data).data.match(/\[.*\]/);
	status = widget.getElementById('f' + TW_MODE + 's' + data).data;
	var str = name + ' ' + status;

	var url = URL_TW_FAV_CREATE + id;
	answer = alert(STR_ADD_FAVORITE.replace(RegExp(STR_VAR_FAVORITE, 'g'), str), STR_YES, STR_NO);
	if (answer == 1) {
		var auth = makeBasicAuthKey();
		if (auth) {
			setRefresh(false);
			if (canXmlHttpRequest(postReq) != true) {
				abortXmlHttpRequest(postReq);
			}
			postReq.onreadystatechange = favoritesHandler;
			postReq.open("POST", url, true);
			postReq.setRequestHeader("Authorization", auth);
			postReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			postReq.setRequestHeader("X-Twitter-Client", widgetName);
			postReq.setRequestHeader("X-Twitter-Client-Version", widgetVersion);
/*
			postReq.setRequestHeader("X-Twitter-Client-URL", widgetXml);
*/
			postReq.send();
		}
	}
}
function favoritesHandler() {
	if (this.readyState == 4 && this.status == 200) {
		my_status.data = STR_ADD_FAVORITE_COMPLETE;
	}
}


// Update Screen Features ////////////////////////////////////////////

// **** 画面サイズの変更 ****
// expand: 拡張するか否か (true/false)
function expandView(expand) {
	if (expand == true) {
		var anim0 = new ResizeAnimation(mainWindow, 240, 320, 350, animator.kEaseOut);
		animator.start(anim0);
		showFrame(TW_MODE, true);
		expandView_change(expand);
		changeTab(TW_MODE);
		showTab(true);
	} else {
		changeEditable(false);
		changeTab(TW_MODE);
		showFrame(TW_MODE, false);
		showTab(false);
		var anim0 = new ResizeAnimation(mainWindow, 240, 48, 350, animator.kEaseInOut, expandView_change(expand));
		animator.start(anim0);
	}
	sleep(5);
}
function expandView_change(expand) {
	sleep(350);
	if (expand == true) {
		myimage.vOffset = 1;
		mystatus.vOffset = 30;
		mainWindow.height = overlay.height =base.height = 320;
		// base.style.background = 'url(Images/back.png) no-repeat';
		overlay.src = 'Images/back.png';
		myimage.tooltip = "On click, reduce window.";
		// showFrame(TW_MODE, true);
	} else {
		myimage.vOffset = 2;
		mystatus.vOffset = 31;
		mainWindow.height = overlay.height = base.height = 48;
		// base.style.background = 'url(Images/back_s.png) no-repeat';
		overlay.src = 'Images/back_s.png';
		myimage.tooltip = "On click, expand window.";
		// showFrame(TW_MODE, false);
	}
}

// **** 発言の編集状態の変更 ****
// editable: テキストボックスを表示するか否か (true/false)
function changeEditable(editable) {
	// statusEntry.data = "";
	if (editable == true) {
		myname.vOffset = 15;
		mystatus.opacity = 255;
		var anim0 = new FadeAnimation(mystatus, 0, 350, animator.kEaseIn);
		animator.start(anim0);
		mystatus.visible = false;
		input.opacity = 0;
		input.visible = true;
		var anim1 = new FadeAnimation(input, 255, 350, animator.kEaseOut);
		animator.start(anim1);
		statusEntry.focus();
	} else {
		mystatus.opacity = 0;
		mystatus.visible = true;
		var anim0 = new FadeAnimation(mystatus, 255, 350, animator.kEaseOut);
		animator.start(anim0);
		var anim1 = new FadeAnimation(input, 0, 350, animator.kEaseIn);
		animator.start(anim1);
		input.visible = false;
		statusEntry.loseFocus();
		myname.vOffset = 17;
	}
	showTab(!editable);
	sleep(5);
}
function changeEditable_change(editable) {
	if (editable == true) {
		//
	} else {
		//
	}
}
// タブの表示と非表示
function showTab(visible) {
	if (visible != true) {
		var anim1 = new FadeAnimation(tab, 0, 350, animator.kEaseIn);
		animator.start(anim1);
		// tab.visible = false;
	} else {
		if (mainWindow.height != 48) {
			tab.opacity = 0;
			tab.visible = true;
			var anim1 = new FadeAnimation(tab, 255, 350, animator.kEaseOut);
			animator.start(anim1);
		}
	}
}
// タブの変更
function changeTab(mode) {
/*
	if (TW_MODE != mode) {
	}
*/
	if (tabChanged == false) {
		print('changeTab();FALSE');
		return false;
	} else {
		if (mainWindow.height != 48) {
			tabChanged = false;
			setRefresh(false);
			TW_MODE = mode;
			if (mode == TW_MODE_DM) {
				print('changeTab();DM');
				tabTL.src = 'Images/tab_timeline_b.png';
				tabRep.src = 'Images/tab_replies_b.png';
				tabDM.src = 'Images/tab_dm.png';
				tabTL.onClick = 'changeTab(TW_MODE_TIMELINE);';
				tabRep.onClick = 'changeTab(TW_MODE_REPLIES);';
				tabDM.onClick = '';
				refreshTimeline(TW_MODE_DM);
			} else if (mode == TW_MODE_REPLIES) {
				print('changeTab();REPLIES');
				tabTL.src = 'Images/tab_timeline_b.png';
				tabRep.src = 'Images/tab_replies.png';
				tabDM.src = 'Images/tab_dm_b.png';
				tabTL.onClick = 'changeTab(TW_MODE_TIMELINE);';
				tabRep.onClick = '';
				tabDM.onClick = 'changeTab(TW_MODE_DM);';
				refreshTimeline(TW_MODE_REPLIES);
			} else {
				print('changeTab();TIMELINE');
				mode = TW_MODE_TIMELINE;
				tabTL.src = 'Images/tab_timeline.png';
				tabRep.src = 'Images/tab_replies_b.png';
				tabDM.src = 'Images/tab_dm_b.png';
				tabTL.onClick = '';
				tabRep.onClick = 'changeTab(TW_MODE_REPLIES);';
				tabDM.onClick = 'changeTab(TW_MODE_DM);';
				// ステータスの変更
				changeMyStatus(my_status, false);
			}
			tabChanged = true;
			// フレームの変更
			changeFrame(mode);
			setRefresh(true);
		}
	}
}
// フレームの表示
function showFrame(mode, visible) {
	if (mainWindow.height != 48) {
		if (visible == true) {
			data_frame[mode].opacity = 0;
			data_frame[mode].visible = true;
			var anim1 = new FadeAnimation(data_frame[mode], 255, 350, animator.kEaseOut);
/*
			timeline_bar[TW_MODE].opacity = 0;
			timeline_bar[TW_MODE].visible = true;
			var anim2 = new FadeAnimation(timeline_bar[TW_MODE], 255, 350, animator.kEaseOut);
*/
			// animator.start(new Array(anim1, anim2));
			animator.start(anim1);
		} else {
			var anim1 = new FadeAnimation(data_frame[mode], 0, 350, animator.kEaseIn);
			animator.start(anim1);
		}
	} else {
		// print('showFrame(): minimized.');
	}
}
// 表示するフレームの変更
function changeFrame(mode) {
	if (tabChanged == false) {
		print("changeFrame();"+"FALSE");
		return false;
	} else {
		if (mainWindow.height != 48) {
			for(var i=0; i<=TW_MODE_DM; i++) {
				if (i == mode) {
					showFrame(i, true);
					// data_frame[i].visible = true;
				} else {
					showFrame(i, false);
					// data_frame[i].visible = false;
				}
			}
		} else {
			// print('changeFrame(): minimized.');
			for(var i=0; i<=TW_MODE_DM; i++) {
				showFrame(i, false);
				// data_frame[i].visible = false;
			}
		}
	}
}
// フレーム内容の消去
function clearFrame(mode) {
	answer = alert(STR_ALERT_INIT_FRAME, STR_YES, STR_NO);
	if (answer == 1) {
		initFrame(mode);
	}
}
function initFrame(mode) {
	var list = timeline_frame[mode].firstChild;
	while (list != null) {
		next = list.nextSibling;
		timeline_frame[mode].removeChild(list);
		list = next;
	}
	offset[mode] = 0;
	timeline_bar[mode].value = 0;
	timeline_bar[mode].max = 0;
}

// タイムラインのスクロールを表示範囲のみに切り替える (※負荷低減用)
function setAutoScroll() {
	if (preferences.useAutoScroll.value == 1) {

		var list = timeline_frame[TW_MODE].subviews;
		var range1 = timeline_bar[TW_MODE].value;
		var range2 = range1 + timeline_bar[TW_MODE].height;
		if (list) {
			setRefresh(false);
			for(var i = 0; i < list.length; i++) {
				var y = list[i].vOffset;
				if (y>=range1 && y<=range2) {
					list[i].getElementById('status' + i).scrolling = 'autoLeft';
				} else {
					list[i].getElementById('status' + i).scrolling = 'off';
				}
			}
			setRefresh(true);
		}
		timeline_bar[TW_MODE].onValueChanged = 'setAutoScroll();';
	}
}


// **** XmlHttpRequestの処理 ****

// XmlHttpRequestが使用可能かどうか
function canXmlHttpRequest(req) {
	if (req.readyState != 0 && req.readyState != 4) {
		print('canXmlHttpRequest();FALSE');
		return false;
	} else {
		print('canXmlHttpRequest();TRUE:'+req.readyState);
		return true;
	}
}
// 現在進行形のXmlHttpRequestの中止
function abortXmlHttpRequest(req) {
	if (req.readyState != 0 && req.readyState != 4) {
		req.abort();
		print('abortXmlHttpRequest();ABORT:'+req.readyState);
	} else {
		print('abortXmlHttpRequest();'+req.readyState);
	}
}


// Misc. functions ///////////////////////////////////////////////////

// キー入力に関する処理
function onKeyDown() {
	print('onKeyDown(); KEY:[ctrl]' + system.event.ctrlKey + '/[alt]' + system.event.altKey + '/[shift]' + system.event.shiftKey + '/[meta]' + system.event.metaKey + '-' + system.event.keyIdentifier + '[' + system.event.key + '/' + + system.event.keyCode + '] (OLD_KEY:' + system.event.modifiers + '-' + system.event.keyString + ')/STAT:' + mainWindow.height + ',' + input.visible);
	if (mainWindow.height != 48) {
		// ウィンドウ縮小されていない
		if (input.visible == false) {
			// 編集状態ではない
			if (system.event.keyString == "Escape") {
				expandView(false);
			} else if (system.event.keyString == "Return" || system.event.keyString == "Enter") {
				changeEditable(true);
			} else if (system.event.keyString == "Tab" || system.event.keyString == "0xdd" || system.event.keyString == "0xdb") {
				if ((system.event.ctrlKey == true || system.event.modifiers == 'command') && (system.event.keyString == "Tab" || system.event.keyString == "0xdd")) {
					var i = TW_MODE + 1;
					if (i > TW_MODE_DM) {
						i = TW_MODE_TIMELINE;
					}
				} else if ((system.event.ctrlKey == true || system.event.modifiers == 'command') && ((system.event.shiftKey == true && system.event.keyString == "Tab") || system.event.keyString == "0xdb")) {
					var i = TW_MODE - 1;
					if (i < TW_MODE_TIMELINE) {
						i = TW_MODE_DM;
					}
				}
				changeTab(i);
			} else if (system.event.keyString == "UpArrow") {
				timeline_frame[TW_MODE].lineUp();
			} else if (system.event.keyString == "DownArrow") {
				timeline_frame[TW_MODE].lineDown();
			} else if (system.event.keyString == "PageUp" || (system.event.shiftKey == true && system.event.keyString == "Space")) {
				timeline_frame[TW_MODE].pageUp();
			} else if (system.event.keyString == "PageDown" || system.event.keyString == "Space") {
				timeline_frame[TW_MODE].pageDown();
			} else if (system.event.keyString == "Home") {
				timeline_frame[TW_MODE].home();
			} else if (system.event.keyString == "End") {
				timeline_frame[TW_MODE].end();
			} else if ((system.event.ctrlKey == true || system.event.modifiers == 'command') && system.event.keyString == "0x43") {
				clearFrame(TW_MODE);
			} else if (system.event.keyString == "F5" || ((system.event.ctrlKey == true || system.event.modifiers == 'command') && system.event.keyString == "0x52")) {
				refreshTimeline(TW_MODE);
/*
			} else {
				alert(system.event.keyString);
*/
			}
		} else {
			if (system.event.keyString == "Escape") {
				if (trim(statusEntry.data) == '') {
					changeEditable(false);
				}
			}
		}
	} else {
		if (system.event.keyString == "Escape") {
			expandView(true);
		}
	}
}

// 設定が変更された場合
function onChangePreferences() {
	if (trim(preferences.userAccount.value) == '' || trim(preferences.userPassword.value) == '') {
		answer = alert(STR_ALERT_SET_IDPW, STR_OK);
		if (answer == 1) {
			showWidgetPreferences();
		}
	} else {
		if (preferences.backgroundColor.value == '#9BB9DC') {
			// 初期のころの値
			preferences.backgroundColor.value = '#778FA9';
		}
		changeColor();
		if (system.languages[0].match(/^ja/) && system.platform.match(/^mac/)) {
			if (preferences.confirmPost.value == 'popup') {
				answer = alert(STR_ALERT_MAC_KEY, STR_YES, STR_NO);
				if (answer == 1) {
					preferences.confirmPost.value = 'key';
				}
			}
		}
		if (preferences.useGetMethod.value == 1) {
			var METHOD = 'GET';
		} else {
			answer = alert(STR_ALERT_POST_METHOD, STR_YES, STR_NO);
			if (answer == 1) {
				preferences.useGetMethod.value = 1;
				var METHOD = 'GET';
			} else {
				var METHOD = 'POST';
			}
		}
		if (timeline_frame[TW_MODE_TIMELINE].subviews != null) {
			answer = alert(STR_RETRY_LOGIN, STR_YES, STR_NO);
			if (answer == 1) {
				login();
			}
		} else {
			login();
		}
	}
}

// URLを開く
function openWebPage(str) {
	// URLの正当性チェック
	var url = str.match(REG_URL2);
	if (url) {
		openURL(url);
	}
}

// 画面更新の抑制と再開
function setRefresh(flag) {
	if (flag != true) {
		hourglass.visible = true;
		checkApiLimit();
		resumeUpdates();	// 表示更新の再開
		updateNow();	// 画面表示の更新
	} else {
		hourglass.visible = false;
		suppressUpdates();	// 表示更新の一時停止
	}
}

// タイムラインにデバッグメッセージを追加する
function addDebugMessage(title, str) {
	var debug = { "created_at":"", "user":{ "name":"", "screen_name":"", "profile_image_url":"" }, "text":"" };
	var d = new Date();

	debug.created_at = d.getFullYear()+'/'+d2(d.getMonth()+1)+'/'+d2(d.getDate())+' '+d2(d.getHours())+':'+d2(d.getMinutes())+':'+d2(d.getSeconds());
	debug.user.name = 'DEBUG';
	debug.user.screen_name = title;
	debug.user.profile_image_url = 'Images/no_picture.png';
	debug.text = str;
	addNewStatus(debug, TW_MODE);
}

// ウィジェットの更新を確認
function checkUpdateWidget() {
	var url = new URL();

	url.location = versionXml;
	url.timeout = 30;
	url.fetchAsync(checkHandler);
}
function checkHandler(url) {
	if (url.response == 200) {
		var xmlDoc = XMLDOM.parse(url.result);
		var xmlVersion = xmlDoc.evaluate('string(/metadata/version)');

		if (widgetVersion != xmlVersion) {
			update = alert(STR_ALERT_NEW_VERSION.replace(RegExp(STR_VAR_VERSION, 'g'), xmlVersion), STR_YES, STR_NO);
			if (update == 1) {
				openWebPage(widgetHome);
			} else {
				// 24時間後にもう一度チェック
				updateCheck.interval = (60*60)*24;
			}
		}
	}
}

// HTMLエンティティ表記を元に戻す(不完全)
function unhtmlentities(str) {
	str = str.replace(/&amp;|&#38;|&#x26;/g, '&');
	str = str.replace(/&lt;|&#60;|&#x3C;/g, '<');
	str = str.replace(/&gt;|&#62;|&#x3E;/g, '>');
	str = str.replace(/&quot;|&#34;|&#x22;/g, '"');

	return str;
}


// Latin1 -> utf8 (patch for Yahoo! Widgets Bug) ///////////////////
// thanks for id:nazoking (http://d.hatena.ne.jp/nazoking/20060807#1154937052)

// Latin1 -> utf8 変換表; 0 の部分があるけど大丈夫かな…
Latin1_ary = [8364,0,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,0,381,0,0,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,0,382,376]
latin1 = String.fromCharCode.apply(String, Latin1_ary);

// 問題のあるところだけ取り出す正規表現
Latin1_reg = []; for (var i=0; i<Latin1_ary.length; i++) { if (Latin1_ary[i] != 0) Latin1_reg.push(Latin1_ary[i]) }; Latin1_reg = new RegExp("["+String.fromCharCode.apply(String,Latin1_reg)+"]", "g");
// 変換の必要のあるところだけ変換
function unLatin1(str) {
	return str.replace(Latin1_reg,function(m) {
		var i=latin1.indexOf(m[0]);
		if (i!=-1) c=i+128;
		return String.fromCharCode(c);
	} );
}

// UTF-8 な文字を取り出す正規表現
Utf8_reg = /[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf3][\x80-\xbf][\x80-\xbf][\x80-\xbf]|\xf4[\x80-\x8f][\x80-\xbf][\x80-\xbf]/g
// UTF-8 から文字列に変換
function Utf8ToString(str) {
	return str.replace(Utf8_reg, function(s) {
		var c = s.charCodeAt(0);
		if((c > 191) && (c < 224)) {
			return String.fromCharCode(((c & 31) << 6) | (s.charCodeAt(1) & 63));
		} else {
			return String.fromCharCode(((c & 15) << 12) | ((s.charCodeAt(1) & 63) << 6) | (s.charCodeAt(2) & 63));
		}
	} );
}
function Latin1toUtf8(str) { return Utf8ToString(unLatin1(str)) }




// **** 文字列の処理関数 ****

function trim(str) {
	return String(str).replace(/^[ 　\r\n]*/gim, "").replace(/[ 　\r\n]*$/gim, "");
}

function ltrim(str){
	return String(str).replace(/^[ 　\r\n]*/gim, "");
}

function rtrim(str){
	return String(str).replace(/[ 　\r\n]*$/gim, "");
}

function remove_html_tags (str) {
/*
	var re0 = new RegExp(/\n/g);
	str = str.replace(re0, "");
	re1 = new RegExp(/>(.*?)</g);
	str = str.replace(re1, ">\n$1\n<");
	re2 = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
	
	return str.replace(re2, "");
*/
	regexp = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);	
	return str.replace(regexp, "");
}

function epoch2date (epoch) {
	var date = new Date(epoch * 1000);
	return date.toString().replace(
		/\D*(\d+)\s*(\d+)\s*(\d+:\d+:\d+).*/,
		'$2/' + ('0' + (date.getMonth() + 1)).substr(-2) + '/$1 $3');
}

