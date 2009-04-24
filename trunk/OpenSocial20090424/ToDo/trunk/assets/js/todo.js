/*  */

var ToDoApp = {
	Message : {
		NO_STICKES : "no stickies",
		NO_FRIENDS : "no friends has app"
	},
	init : function() {
		if(jQuery.gadgets.view().getName()=="canvas")
			ToDoApp.data.getFriends(ToDoApp.onGetFriends);
		else
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
	onGetFriends : function(d) {
		console.log(d);
        $j("#stickies").html(ToDoApp.ui.getCanvasHTML( d ) );
        jQuery.gadgets.height("auto");          
	},
	create : function() {
		ToDoApp.ui.message.hide();
		$j("#stickies").prepend(ToDoApp.ui.getSticky(null,null,true));
		jQuery.gadgets.height("auto");
	},
	remove : function(ele) {
		$j(ele).parent().remove();
		ToDoApp.data.save();
	}
};

