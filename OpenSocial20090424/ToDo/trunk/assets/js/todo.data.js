
ToDoApp.data = {
	stickies : [],
	PrefKey : {
		STICKIES : "stickies",
		VISIBLE_FRIENDS : "visible_friends"
	},
	getStickies : function(callback) {
		jQuery.opensocial.data.get(ToDoApp.data.PrefKey.STICKIES,"viewer",callback,false);
	},
	onChangeText : function() {
		ToDoApp.data.save();
	},
	remove : function(ele) {
		$j(ele).remove();
		ToDoApp.data.save();
	},
	save : function() {
		var ar = [];
		$j("#stickies .sticky textarea").each(function(d){
			ar.push($(this).val());
		});
		ToDoApp.data.stickies = ar;
		console.log(ar);
		jQuery.opensocial.data.set(ToDoApp.data.PrefKey.STICKIES,ToDoApp.data.stickies);
	},
	getFriends : function() {
		
	}
}
