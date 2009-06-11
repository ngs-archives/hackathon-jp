function onOwnerIsNotViewer(param) {
	var owner = param.owner;
	var viewer = param.viewer;
	var data = param.data.data;

	$("#crstl").one("click", function() {
		$("#crstl").hide();
		$("#announcementRelease").html(data).show();
		$("#announcementArea").fadeIn(5000);
		gadgets.window.adjustHeight();
	});
	gadgets.window.adjustHeight();
}
