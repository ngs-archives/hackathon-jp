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
		ToDoApp.data.stickies = d;
		if(!d.length) {
			return ToDoApp.ui.message.show(ToDoApp.Message.NO_STICKES);
		}
		$j("#stickies").html(ToDoApp.ui.list.getHTML(d));
		jQuery.gadgets.height("auto");
	},
	create : function() {
		ToDoApp.ui.message.hide();
		$j("#stickies").prepend(ToDoApp.ui.getSticky());
		jQuery.gadgets.height("auto");
	},
	remove : function(ele) {
		$j(ele).remove();
		ToDoApp.data.save();
	}
};

