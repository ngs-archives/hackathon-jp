
ToDoApp.data = {
	stickies : [],
	PrefKey : {
		STICKIES : "stickies",
		VISIBLE_FRIENDS : "visible_friends"
	},
	getStickies : function(callback) {
		jQuery.opensocial.data.get(ToDoApp.data.PrefKey.STICKIES,"viewer",callback,false);
	},
	save : function() {
		var ar = [];
		$j("#stickies .sticky textarea").each(function(d){
			ar.push($j(this).val());
		});
		ToDoApp.data.stickies = ar;
		console.log(ar);
		jQuery.opensocial.data.set(ToDoApp.data.PrefKey.STICKIES,ToDoApp.data.stickies);
	},
	getFriends : function() {
		jQuery.opensocial.person("viewer",function(d){
			var prm = {};
			prm[opensocial.DataRequest.PeopleRequestFields.FILTER] = opensocial.DataRequest.FilterType.HAS_APP;
			prm[opensocial.DataRequest.PeopleRequestFields.MAX] = 4;
			jQuery.opensocial.getPeople(d.getId(),prm,function(p){
				ToDoApp.data.onGetFriends(p);
			});
		});
	},
	onGetFriends : function(p) {
		if(!p||!p.length) return ToDoApp.ui.message.show(ToDoApp.Message.NO_FRIENDS);
		var stickies = [{ stickies:ToDoApp.data.stickies,person:jQuery.opensocial.person("viewer") }];
		var cnt = 0;
		function ge() {
			if(cnt==p.length) ToDoApp.data.onGetAllStickes();
			var obj = { person:p[cnt] };
			jQuery.opensocial.data.get([ToDoApp.data.PrefKey.STICKIES,ToDoApp.data.PrefKey.VISIBLE_FRIENDS],p[cnt].getId(),function(d){
				var st = obj[ToDoApp.data.PrefKey.STICKIES];
				if(st) {
					obj.stickies = st;
				}
				ge();
			});
		}
	},
	onGetAllStickes : function(stickies) {
		console.log(stickies);
	}
}
