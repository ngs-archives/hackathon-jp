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
		ToDoApp.data.stickes = d;
		if(!d.length) {
			return ToDoApp.ui.message.show(ToDoApp.Message.NO_STICKES);
		}
		$j("#stickes").html(ToDoApp.ui.list.getHTML(d));
	},
	create : function() {
		ToDoApp.ui.message.hide();
		$j("#stickies").prepend(ToDoApp.ui.getSticky());
	},
	remove : function() {
		

	}
};

