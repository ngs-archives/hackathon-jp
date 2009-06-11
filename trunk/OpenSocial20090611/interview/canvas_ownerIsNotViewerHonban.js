function onOwnerIsNotViewer(param) {
	var owner = param.owner;
	var viewer = param.viewer;
	var data = param.data.data;

	$("#announcementRelease").html(data).fadeIn(3000);

	gadgets.window.adjustHeight();
}
