
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
			jQuery.opensocial.getPeople(d.getId(),function(p){
				console.log(p);
			});
		});
	}
}
