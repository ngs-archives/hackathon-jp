var DEFAULT_DATETIME_FORMAT = new DateFormat("yyyy/MM/dd HH:mm");

function onOwnerIsViewer(param){
    var owner = param.owner;
    var viewer = param.viewer;
}

function registerMyAnnounce(){
    var title = $("#title").val();
    var hint = $("#hint").val();
    var limit = $("#limit").val();
    var data = $("#data").val();
    var limitDate = DEFAULT_DATETIME_FORMAT.parse(limit);
    
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest("OWNER", "data", {
        title: title,
        hint: hint,
        limit: limitDate.getTime(),
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
