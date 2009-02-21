/**
 * 勝手にプロフィール This JavaScript file is for Profile view.
 */

var questionId;
var questionType;
var questionDescription;

function init() {
	loadingQuestion();
}

function loadingQuestion() {
	// 質問数を取得
	jQuery.get("http://localhost:8080/kprofile/question/index.xml", "",
			onGetIndex)

	function onGetIndex(responseXML) {
		var elmIndex = responseXML.firstChild;
		var children = elmIndex.getElementsByTagName("question");

		var index = Math.floor(Math.random() * children.length);
		var question = children[index].textContent;

		// 質問を取得
		jQuery.get("http://localhost:8080/kprofile/question/" + question, "",
				onGetProfile)
	}

	function onGetProfile(responseXML) {
		var elmFaq = responseXML.firstChild;
		questionId = elmFaq.getElementsByTagName("id")[0].textContent;
		questionType = elmFaq.getElementsByTagName("type")[0].textContent
				.toLowerCase();
		questionDescription = elmFaq.getElementsByTagName("answer")[0].textContent;
		var formData = elmFaq.getElementsByTagName("form-data")[0].textContent;
		document.getElementById("div_form_data").innerHTML = formData;
	}
}

// 投稿
function onVote() {
	var req = opensocial.newDataRequest();
	var text;
	if ("text" == questionType) {
		text = document.getElementById("answer").value;
		if ("" == text) {
			alert("入力が不正です。");
			return false;
		}

	} else {
		var selected = $("input[checked]");
		if (selected.length == 0) {
			alert("入力が不正です。");
			return false;
		}
		var selected0 = selected[0];
		text = selected[0].nextSibling.textContent;
	}

	// 一覧を取得する
	var reqGetAnswerList = opensocial.newDataRequest();
	var fields = ["answer"];
	var p = {};
	p[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
	var idSpec = opensocial.newIdSpec(p);
	req.add(req.newFetchPersonAppDataRequest(idSpec, fields), "app_data");
	req.send(handleGetAnswerList);

	function handleGetAnswerList(data) {
		var appData = data.get("app_data").getData();
		appData = appData["canonical"];
		var answerAll = {};
		var answerAllJson = appData["answer"];
		try {
			answerAll = gadgets.json.parse(gadgets.util
					.unescapeString(answerAllJson));
		} catch (e) {
			return;
		}

		var answerOfQuestion = answerAll[questionId];
		var answerMapOfQuestion;
		if (answerOfQuestion == null) {
			answerOfQuestion = {};
			answerMapOfQuestion = {};
			answerOfQuestion["answer"] = answerMapOfQuestion;
			answerOfQuestion["description"] = questionDescription;
			answerAll[questionId] = answerOfQuestion;
		} else {
			answerMapOfQuestion = answerOfQuestion["answer"];
		}

		if (answerMapOfQuestion[text] == null) {
			var req = opensocial.newDataRequest();
			answerMapOfQuestion[text] = [];
			var answerAllJson = gadgets.json.stringify(answerAll);
			req.add(req.newUpdatePersonAppDataRequest("OWNER", "answer",
					answerAllJson));
			req.send();
		}

		loadingAnswer();
	}
}

// function setup() {
// var req = opensocial.newDataRequest();
// // var data = {"1":{"answer":"猫", "star":2, "is_answer":false}
// // ,"2":{"answer":"蛙", "star":4, "is_answer":false}};
// var data = {
// "1" : {
// "answer" : {
// "猫" : ["george"],
// "犬" : ["george", "jane.doe"],
// "蛙" : []
// }
// }
// };
// var dataJson = gadgets.json.stringify(data);
//
// req.add(req.newUpdatePersonAppDataRequest("OWNER", "answer", dataJson));
// req.send();
// }

function loadingAnswer() {
	var req = opensocial.newDataRequest();
	var fields = ["answer"];
	var pOwner = {};
	var pViwer = {};

	pOwner[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
	var idSpecOwner = opensocial.newIdSpec(pOwner);
	pViwer[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIWER;
	var idSpecViewer = opensocial.newIdSpec(pViwer);
	req.add(req.newFetchPersonRequest(idSpecOwner, "owner"));
	req.add(req.newFetchPersonRequest(idSpecViewer, 'viewer'));
//	req.add(req.newFetchPersonRequest("VIEWER"), 'viewer');
	req.add(req.newFetchPersonAppDataRequest(idSpecOwner, fields), "app_data");
	req.send(handleRequestAppData);
}

var owner;
function handleRequestAppData(data) {
	// var ownerData = data.get("owner");
	// owner = ownerData.getData();
 	//var viewerData = data.get('viewer');
// 	var viewer = viewerData.getData();
//	alert(viewer.getId());
	var appData = data.get("app_data");
	if (appData.hadError()) {
		$("#profile_contents").html(data.getErrorMessage());
		return;
	}
	doSomethingWithAppData(appData.getData());
}

var is_answer = false;
function doSomethingWithAppData(data) {
	// var appData = data[owner.getId()];
	var appData = data["canonical"];
	var answerListJson = appData["answer"];
	var answerObj = {};
	try {
		answerObj = gadgets.json.parse(gadgets.util
				.unescapeString(answerListJson));
	} catch (e) {
	}
	var html = '<div style="color:orange;">回答一覧</div><table>';
	var answerList = answerObj[questionId]["answer"];
	for (var answerValue in answerList) {
		html += '<tr style="cursor:pointer;" onmouseover="mouseOverStar(\'add_star_'
				+ answerValue
				+ '\');" onmouseout="mouseOutStar(\'add_star_'
				+ answerValue
				+ '\');" onclick="addStar(\'add_star_'
				+ answerValue + '\');"><td>' + answerValue + "</td>";
		html += '<td>';
		for (var i = 0; i < answerList[answerValue].length; i++) {
			html += '<img src="http://localhost:8080/kprofile/star.gif" alt="Star" />';
		}
		html += '<img id="add_star_'
				+ answerValue
				+ '" style="display:none" src="http://localhost:8080/kprofile/star.gif" alt="Star" /></td></tr>';
	}
	html += "</table>"

	$("#profile_contents").html(html);
}

function mouseOverStar(id) {
	if (!is_answer) {
		$("#" + id).show();
	}
}

function mouseOutStar(id) {
	if (!is_answer) {
		$("#" + id).hide();
	}
}

function addStar(id) {
	is_answer = true;
}
