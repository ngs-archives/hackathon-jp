function onOwnerIsNotViewer(param) {
	var owner = param.owner;
	var viewer = param.viewer;
	var data = param.data.data;

	setTimeout(function() {
		$("#announcementRelease").html(data).fadeIn(5000);
	}, 3000);

	gadgets.window.adjustHeight();
}
