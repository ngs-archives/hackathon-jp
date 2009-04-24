
ToDoApp.data = {
	stickies : [],
	PrefKey : {
		STICKIES : "stickies",
		VISIBLE_FRIENDS : "visible_friends"
	},
	getStickies : function(callback) {
		jQuery.opensocial.data.get(ToDoApp.data.PrefKey.STICKIES,"OWNER",callback,false);
	},
	save : function() {
		var ar = [];
		$j("#stickies .sticky textarea").each(function(d){
			ar.push($j(this).val());
		});
		ToDoApp.data.stickies = ar;
		jQuery.opensocial.data.set(ToDoApp.data.PrefKey.STICKIES,ToDoApp.data.stickies);
	},
	getFriends : function(callback) {
		jQuery.opensocial.person("OWNER",function(d){
			jQuery.opensocial.data.get(ToDoApp.data.PrefKey.STICKIES,d.getId(),function(s){
				ToDoApp.data.stickies = s||[];
				var prm = {};
				prm[opensocial.DataRequest.PeopleRequestFields.FILTER] = opensocial.DataRequest.FilterType.HAS_APP;
				prm[opensocial.DataRequest.PeopleRequestFields.MAX] = 4;
				jQuery.opensocial.getPeople(d.getId(),prm,function(p){
					ToDoApp.data.onGetFriends(p,callback);
				});
			})
		});
	},
	onGetFriends : function(p,callback) {
		if(!p||!p.length) return ToDoApp.ui.message.show(ToDoApp.Message.NO_FRIENDS);
		var stickies = [{ stickies:ToDoApp.data.stickies,person:jQuery.opensocial.person("OWNER") }];
		var cnt = 0;
		function ge() {
			if(!p[cnt]) return ToDoApp.data.onGetAllStickes(stickies,callback);
			var obj = { person:p[cnt] };
			jQuery.opensocial.data.get([ToDoApp.data.PrefKey.STICKIES,ToDoApp.data.PrefKey.VISIBLE_FRIENDS],p[cnt].getId(),function(d){
				if(!d||!d[ToDoApp.data.PrefKey.STICKIES]) return ge(); 
				var st = d[ToDoApp.data.PrefKey.STICKIES];
				if(st) {
					obj.stickies = st;
					stickies.push(obj);
				}
				ge();
			});
			cnt++;
		}
		ge();
	},
	onGetAllStickes : function(stickies,callback) {
		if(typeof(callback)=="function") callback(stickies);
	}
}
