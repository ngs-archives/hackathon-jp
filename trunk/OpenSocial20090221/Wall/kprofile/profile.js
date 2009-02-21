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
//	var data = {"1":{"answer":"猫", "star":2, "is_answer":false} ,"2":{"answer":"蛙", "star":4, "is_answer":false}};
	var data = {"1":{"answer":{"猫":["george"], "犬":["george","jane.doe"], "蛙":[]}}};
	var dataJson = gadgets.json.stringify(data);

	req.add(req.newUpdatePersonAppDataRequest("OWNER", "answer", dataJson));
	req.send();
}

function loadingAnswer() {
	var req = opensocial.newDataRequest();
	var fields = [ "answer" ];
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
//	var ownerData = data.get("owner");
//	owner = ownerData.getData();
 	var viewerData = data.get('viewer');
 	var viewer = viewerData.getData();
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
	var faqId = 1; //ダミーデータ
//	var appData = data[owner.getId()];
	var appData = data["canonical"];
	var answerListJson = appData["answer"];
	var answerObj = {};
	try {
		answerObj = gadgets.json.parse(gadgets.util.unescapeString(answerListJson));
	} catch (e) {
	}
	var html = '<div style="color:orange;">回答一覧</div><table>';
	var answerList = answerObj[faqId]["answer"];
	for (var answerValue in answerList) {
		html += '<tr style="cursor:pointer;" onmouseover="mouseOverStar(\'add_star_'+answerValue+'\');" onmouseout="mouseOutStar(\'add_star_'+answerValue+'\');" onclick="addStar(\'add_star_'+answerValue+'\');"><td>'+answerValue + "</td>";
		html += '<td>';
		for (var i=0; i<answerList[answerValue].length; i++) {
			html += '<img src="http://localhost:8080/kprofile/star.gif" alt="Star" />';
		}
		html += '<img id="add_star_'+answerValue+'" style="display:none" src="http://localhost:8080/kprofile/star.gif" alt="Star" /></td></tr>';
	}
	html += "</table>"

	$("#profile_contents").html(html);
}

function mouseOverStar(id) {
	if (!is_answer) {
		$("#"+id).show();
	}
}

function mouseOutStar(id) {
	if (!is_answer) {
		$("#"+id).hide();
	}
}

function addStar(id) {
	is_answer = true;
}
