var owner_name;
var title;
var hint;
var limit;


function onOwnerIsNotViewer(param) {

	var owner = param.owner;
	var viewer = param.viewer;

	owner_name = owner.getDisplayName();

	title = param.data["title"];
	hint = param.data["hint"];
	limit = param.data["limit"];

	var req = opensocial.newDataRequest();
	req.send(function(res) {
		gadgets.window.adjustHeight();
	});
}
