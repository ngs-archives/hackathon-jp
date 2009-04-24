/*  */

var ToDoApp = {
	Message : {
		NO_STICKES : "no stickies"
	},
	init : function() {
		ToDoApp.data.getStickies(ToDoApp.onGetStickes);
	},
	onGetStickes : function(d) {
		d = d||[];
		console.log(d);
		ToDoApp.data.stickies = d;
		if(!d.length) {
			return ToDoApp.ui.message.show(ToDoApp.Message.NO_STICKES);
		}
		$j("#stickies").html(ToDoApp.ui.list.getHTML(d));
	},
	create : function() {
		ToDoApp.ui.message.hide();
		$j("#stickies").prepend(ToDoApp.ui.getSticky());
	},
	remove : function() {
		

	}
};

