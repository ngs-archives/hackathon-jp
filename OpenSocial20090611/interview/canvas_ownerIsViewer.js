var DEFAULT_DATETIME_FORMAT = new DateFormat("yyyy/MM/dd HH:mm");

function onOwnerIsViewer(param){
    var owner = param.owner;
    var viewer = param.viewer;
	/*
    $("#limitDate").datepicker({
        formatDate: "yy/mm/dd",
		showOn: "both"
    });
    */
}

function registerMyAnnounce(){
    var title = $("#title").val();
    var hint = $("#hint").val();
    var limitDate = $("#limitDate").val();
    var limitTime = $("#limitTime").val();
    var data = $("#data").val();
    var limit = DEFAULT_DATETIME_FORMAT.parse(limitDate + " " + limitTime);
    
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest("OWNER", "data", {
        title: title,
        hint: hint,
        limit: limit.getTime(),
        data: data
    }), "response");
    req.send(function(data){
        if (data.hadError()) {
            showMessage("エラーが発生しました。");
            return;
        }
        alert("成功しました！");
    });
}
