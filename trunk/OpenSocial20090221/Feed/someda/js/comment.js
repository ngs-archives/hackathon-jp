if (typeof (Ugomemo) == 'undefined' || !Ugomemo) {
	var Ugomemo = {};
}

Ugomemo.Comment = function(memo_id, comment) {
	this.memo_id = memo_id;
	this.comment = comment;
}

Ugomemo.Comment.prototype = {
	updateRequest : function() {
		var req = opensocial.newDataRequest();
				
		var memoReq = req.newUpdatePersonAppDataRequest("VIEWER", "memo_id",
				this.memo_id);
		var commentReq = req.newUpdatePersonAppDataRequest("VIEWER", "comment",
				this.comment);
		var timeReq = req.newUpdatePersonAppDataRequest("VIEWER", "diff_time",
				this.diff_time);
		req.add(memoReq);
		req.add(commentReq);
		req.add(timeReq);
		return req;
	},
	setDiffTime : function(display_time){
		this.diff_time = (new Date()).getTime() - display_time;		
	}
}

Ugomemo.util = {
	register : function(memo_id, display_time, comment, callback) {
		var comObj = new Ugomemo.Comment(memo_id, comment);
		comObj.setDiffTime(display_time);
		comObj.updateRequest().send(callback);
	},
	show : function(memo_id, callback){
		var req = opensocial.newDataRequest();
		var fields =  [ "memo_id", "comment", "diff_time" ];
		var params ={};
		params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
		params[opensocial.IdSpec.Field.NETWORK_DISTANCE] = 1;
		
		var idSpec = opensocial.newIdSpec(params);
		req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");		
		req.add(req.newFetchPersonAppDataRequest(idSpec, fields), "comment_list");
		
		var selfp = {};
		selfp[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		var viewerIdSpec = opensocial.newIdSpec(selfp);
		req.add(req.newFetchPersonAppDataRequest(viewerIdSpec, fields), "viewer_list");		
		
		req.send(callback);		
	}
}
