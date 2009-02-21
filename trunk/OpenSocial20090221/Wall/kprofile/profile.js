/**
 * 勝手にプロフィール
 * This JavaScript file is for Profile view.
 */

function init() {
	setup();
	loadingAnswer();
//	$("#profile_contents").html("TEST");
}

function setup() {
	var req = opensocial.newDataRequest();
//	var data = '{"1":"{"answer":"猫"}" ,"2":"{"answer":"アオレンジャー"}"}';
//	var data = '{"1":"猫" ,"2":"アオレンジャー"}';
//	var data = '{1:100 ,2:200}';
	var data = {"1":"猫" ,"2":"アオレンジャー"};
	var dataJson = $.toJSON(data);

	req.add(req.newUpdatePersonAppDataRequest("OWNER", "answer", dataJson));
	req.send();
}

function loadingAnswer() {
	var req = opensocial.newDataRequest();
	var fields = [ "answer" ];
	var p = {};

	p[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
	var idSpec = opensocial.newIdSpec(p);
	req.add(req.newFetchPersonAppDataRequest(idSpec, fields), "app_data");
	req.send(handleRequestAppData);
}

function handleRequestAppData(data) {
	var appData = data.get("app_data");
	if (appData.hadError()) {
		$("#profile_contents").html(data.getErrorMessage());
		return;
	}
	doSomethingWithAppData(appData.getData());
}

function doSomethingWithAppData(data) {
	var appData = data["canonical"];
	var answerListJson = appData["answer"];
//	var answerListJson = decodeURI(appData["answer"]);
//	var answerListJson = '{"1":"猫" ,"2":"アオレンジャー"}';
//	var answerList = eval(answerListJson);
//var i=0;a
	$("#profile_contents").html(appData["answer"]);
	
//     vamydata = data[me.getId()];
//     var div = document.getElementById('content_div');
//     htmlout += "My AppField1 data is: " + mydata["AppField1"] + "<br />";
//     htmlout += "My AppField2 data is: " + mydata["AppField2"] + "<br />";
//     htmlout += "My AppField3 data is: " + mydata["AppField3"] + "<br />";
//     div.innerHTML = htmlout;
}
