var displayData = {};
var UgomemoJson = "";
var MovieNum = "";
var MovieHatenaSyntax = "";
var OnloadDate = "";

var UgoSocial = {};
UgoSocial.setComments = function() {
	for ( var p in displayData.comments) {
		var data = displayData.comments[p];
		var func = "setTimeout(function(){UgoSocial.showComment('"
				+ data.comment + "')}," + data.time + ");";
		eval(func);
	}
}
UgoSocial.showComment = function(comment) {
	// $('#comment_area').append('<p>' + comment + '</p>');
	var topHeight = (Math.random() * 120) + 'px';
	var speed = 2000 + (Math.random() * 2000);
	var colorIndex = parseInt(Math.random() * 3);
	var color = "red,black,yellow,blue".split(",")[colorIndex];
	$('<p>' + comment + '</p>').css( {
		margin :'0px',
		color :color,
		position :'absolute',
		left :'200px',
		top :topHeight,
		zIndex :'1000'
	}).appendTo('#content_div').animate( {
		left :'-200px'
	}, speed);
}
UgoSocial.makeImage = function(date, src, syntax, total, now) {
	try {
		console.log(date);
		console.log(src);
		console.log(syntax);
		console.log(total);
		console.log(now);
	} catch (e) {
	}
	$("#on_load_date").html(date);
	$("#content_div").html('<img src="' + src + '">');
	$("#hatena").html(syntax);
	$("#movie_num").html(now + "/" + total);

	// gadgets.window.adjustHeight();
}
UgoSocial.jsonResponse = function(obj) {
	UgomemoJson = obj.data;
	MovieNum = 0;
	var imgSrc = UgomemoJson.items[0]["movie_animation_gif_path"];
	MovieHatenaSyntax = UgomemoJson.items[0]["movie_hatena_syntax"];

	var now = new Date();
	OnloadDate = +now.getTime();
	totalNumber = UgomemoJson.items.length;
	var nowNumber = MovieNum + 1;
	UgoSocial.makeImage(OnloadDate, imgSrc, MovieHatenaSyntax, totalNumber,
			nowNumber);

	UgoSocial.util.show(MovieHatenaSyntax, UgoSocial.util.displayComments);
};

UgoSocial.getJson = function() {
	var params = {};
	var url = "http://ugomemo.hatena.ne.jp/ranking/daily/movie.json?mode=total";

	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;

	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	gadgets.io.makeRequest(url, UgoSocial.jsonResponse, params);
};
UgoSocial.next = function() {
	UgoSocial.viewJson('next');
}
UgoSocial.prev = function() {
	UgoSocial.viewJson('prev');
}
UgoSocial.viewJson = function(vector) {

	if (vector == "next") {
		MovieNum++;
		if (UgomemoJson.items.length - 1 < MovieNum) {
			MovieNum = 0;
		}
	} else if (vector == "prev") {
		MovieNum--;
		if (MovieNum < 0) {
			MovieNum = UgomemoJson.items.length - 1;
		}
	} else {
		MovieNum = 0;
	}

	var imgSrc = UgomemoJson.items[MovieNum]["movie_animation_gif_path"];
	MovieHatenaSyntax = UgomemoJson.items[MovieNum]["movie_hatena_syntax"];

	var now = new Date();
	OnloadDate = +now.getTime();
	totalNumber = UgomemoJson.items.length;
	var nowNumber = MovieNum + 1;
	UgoSocial.makeImage(OnloadDate, imgSrc, MovieHatenaSyntax, totalNumber,
			nowNumber);

	UgoSocial.util.show(MovieHatenaSyntax, UgoSocial.util.displayComments);
	// UgoSocial.setComments();
}

UgoSocial.Comment = function(memo_id, comment) {
	this.memo_id = memo_id;
	this.comment = comment;
}

UgoSocial.Comment.prototype = {
	updateRequest : function() {
		var req = opensocial.newDataRequest();

		var jsonData = this.toDataJson();
		var strData = gadgets.json.stringify(jsonData);

		var field = UgoSocial.util.memoToKey(this.memo_id); // field に使える形に変換
		var storeReq = req.newUpdatePersonAppDataRequest("VIEWER", field,
				strData);
		req.add(storeReq);
		return req;
	},
	setDiffTime : function(display_time) {
		this.time = (new Date()).getTime() - display_time;
	},
	toDataJson : function() {
		return {
			"memo_id" :this.memo_id,
			"comment" :this.comment,
			"time" :this.time
		};

	}
}

UgoSocial.util = {
	register : function(memo_id, display_time, comment, callback) {
		var comObj = new UgoSocial.Comment(memo_id, comment);
		comObj.setDiffTime(display_time);
		comObj.updateRequest().send(callback);
	},
	show : function(memo_id, callback) {

		var req = opensocial.newDataRequest();
		var fields = [ UgoSocial.util.memoToKey(memo_id) ];
		console.log(fields);

		var friendParams = {};
		friendParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		friendParams[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
		friendParams[opensocial.IdSpec.Field.NETWORK_DISTANCE] = 1;

		var friendIdSpec = opensocial.newIdSpec(friendParams);
		// req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER),
		// "viewer");
		req.add(req.newFetchPersonAppDataRequest(friendIdSpec, fields),
				"friend_comment");

		var selfParams = {};
		selfParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		var selfIdSpec = opensocial.newIdSpec(selfParams);
		req.add(req.newFetchPersonAppDataRequest(selfIdSpec, fields),
				"viewer_comment");
		req.send(callback);
	},
	toComments : function(data) {
		var array = new Array();
		var appendFunc = function(obj) {
			if (obj) {
				for ( var id in obj) {
					var ret = obj[id];
					var commentObj = null;					
					for(var p in ret){
						if(p.indexOf("ugomemo") != -1){
							commentObj = gadgets.json.parse(gadgets.util.unescapeString(ret[p]));
							console.log(commentObj);
						}
					}						
					commentObj["user"] = id;
					array.push(commentObj);
				}
			}
		}
		var friends = data.get("friend_comment").getData();
		var viewer = data.get("viewer_comment").getData();
		appendFunc(friends);
		appendFunc(viewer);
		return array;
	},
	displayComments : function(data) {
		var array = UgoSocial.util.toComments(data);
		displayData.comments = array;
		UgoSocial.setComments();
	},
	memoToKey : function(memo_id){
		return memo_id.split(":").join("_");
	}
}

gadgets.util.registerOnLoadHandler( function() {
	$('#next').click(UgoSocial.next);
	$('#prev').click(UgoSocial.prev);
	gadgets.window.adjustHeight();
	UgoSocial.getJson();
	UgoSocial.setComments();
});
