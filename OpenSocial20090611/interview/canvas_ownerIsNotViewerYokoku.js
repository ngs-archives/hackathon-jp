function onOwnerIsNotViewer_yokoku(param){
    var owner = param.owner;
    var viewer = param.viewer;
    owner_name = owner.getDisplayName();
    
    var title = param.data["title"];
    var hint = param.data["hint"];
    var limit = param.data["limit"];

	var timer = setInterval(function() {
		var now = new Date().getTime();
		var interval = limit - now;
		if (interval <= 0) {
			clearInterval(timer);
			return;
		}
		var intervalSeconds = Math.floor(interval / 1000);
		var msg = "<span class='seconds'>" + (intervalSeconds % 60) + "秒</span>";
		if (intervalSeconds > 60) {
			var intervalMinutes = Math.floor(intervalSeconds / 60);
			if ((intervalMinutes % 60) != 0) {
				msg = "<span class='minutes'>" + (intervalMinutes % 60) + "分</span>" + msg;
			}
		}
		if (intervalMinutes > 60) {
			var intervalHours = Math.floor(intervalMinutes / 60);
			if ((intervalHours % 24) != 0) {
				msg = "<span class='hours'>" + (intervalHours % 24) + "時間</span>" + msg;
			}
		}
		if (intervalHours > 24) {
			var intervalDays = Math.floor(intervalHours / 24);
			msg = "<span class='days'>" + intervalDays + "日</span>" + msg;
		}
		$("#remainedTime").html(msg);
	}, 300);
	gadgets.window.adjustHeight();
}
