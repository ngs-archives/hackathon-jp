var displayData = {};
var UgomemoJson = "";
var MovieNum = "";
var MovieHatenaSyntax = "";
var OnloadDate = "";

var ThumbData = {};

var UgoSocial = {};
UgoSocial.setComments = function() {
   for ( var p in displayData.comments ) {
       var data = displayData.comments[p];
       var func ="setTimeout(function(){UgoSocial.showComment('" + data.comment + "')},"+ data.time +");";
       eval(func);
   }
}
UgoSocial.showComment = function(comment) {
//    $('#comment_area').append('<p>' + comment + '</p>');
    var topHeight = (Math.random() * 120) + 'px';
    var speed = 2000 + (Math.random() * 2000);
    var colorIndex = parseInt(Math.random() * 3);
    var color = "red,black,yellow,blue".split(",")[colorIndex];
    $('<p>' + comment + '</p>').css({margin:'0px',color: color,position:'absolute',left:'200px',top: topHeight,zIndex:'1000' }).appendTo('#content_div').animate({left:'-200px'},speed);
}
UgoSocial.getAllFriendThumbURL = function(){
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.Group.VIEWER_FRIENDS), "viewer_friends");
	req.send(function(resp) {
			var viewer = resp.get("viewer").getData();
            var taraget = ($('#profile_img_' + userId)) ? $('#profile_img_' + userId) : $('<p id="profile_img"'+ userId + '"></p>');
            target.html("<img src='"+viewer.getField(opensocial.Person.Field.THUMBNAIL_URL)+"'>").appendTo('body');
			var viewer_friends = resp.get("viewer_friends").getData();
            viewer_friends.each(function(person){
                ThumbData[person.getId()] = {
                    thumbnailUrl : person.getField(opensocial.Person.Field.THUMBNAIL_URL),
                    name : person.getDisplayName()
                    };
            });
            try{console.log(ThumbData);}catch(e){};
	});
}
UgoSocial.makeImage = function(date, src, syntax ,total , now) {
    try{
    console.log(date);
    console.log(src);
    console.log(syntax);
    console.log(total);
    console.log(now);
    } catch(e){}
    $("#on_load_date").html(date);
    $("#content_div").html('<img src="'+src+'">');
    $("#hatena").html(syntax);
    $("#movie_num").html(now + "/" + total);
    
//    gadgets.window.adjustHeight();    
}
UgoSocial.jsonResponse = function(obj) {
	UgomemoJson = obj.data;
	MovieNum = 0;
	var imgSrc = UgomemoJson.items[0]["movie_animation_gif_path"];
	MovieHatenaSyntax = UgomemoJson.items[0]["movie_hatena_syntax"];

	var now = new Date();
	OnloadDate  = +now.getTime();
    totalNumber = UgomemoJson.items.length;
    var nowNumber = MovieNum + 1;
    UgoSocial.makeImage(OnloadDate, imgSrc , MovieHatenaSyntax , totalNumber , nowNumber);
    
    UgoSocial.util.show(MovieHatenaSyntax, function(data){    
        var array = UgoSocial.util.toComments(data);    
        displayData.comments = array;
        console.log(array);
        UgoSocial.setComments();
    });    
};

UgoSocial.getJson = function(){
	var params = {};
	var url = "http://ugomemo.hatena.ne.jp/ranking/daily/movie.json?mode=total";

	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;

	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	gadgets.io.makeRequest(url, UgoSocial.jsonResponse, params);
};
UgoSocial.next = function(){
    UgoSocial.viewJson('next');
}
UgoSocial.prev = function(){
    UgoSocial.viewJson('prev');
}
UgoSocial.viewJson = function(vector){

	if(vector == "next"){
		MovieNum++;
		if(UgomemoJson.items.length-1 < MovieNum){
			MovieNum = 0;
		}
	}else if(vector == "prev"){
		MovieNum--;
		if(MovieNum < 0){
			MovieNum = UgomemoJson.items.length-1;
		}
	}else{
		MovieNum = 0;
	}
	
	var imgSrc = UgomemoJson.items[MovieNum]["movie_animation_gif_path"];
	MovieHatenaSyntax = UgomemoJson.items[MovieNum]["movie_hatena_syntax"];
	
	var now = new Date();
	OnloadDate  = +now.getTime();
    totalNumber = UgomemoJson.items.length;
    var nowNumber = MovieNum + 1;
    UgoSocial.makeImage(OnloadDate, imgSrc , MovieHatenaSyntax , totalNumber , nowNumber);

    UgoSocial.util.show(MovieHatenaSyntax, function(data){    
        var array = UgoSocial.util.toComments(data);
        console.log(array);
        displayData.comments = array;
        UgoSocial.setComments();
    });    
//    UgoSocial.setComments();
}

UgoSocial.Comment = function(memo_id, comment) {
	this.memo_id = memo_id;
	this.comment = comment;
}

UgoSocial.Comment.prototype = {
	updateRequest : function() {
		var req = opensocial.newDataRequest();
		var memoReq = req.newUpdatePersonAppDataRequest("VIEWER", "memo_id",
				this.memo_id);
		var commentReq = req.newUpdatePersonAppDataRequest("VIEWER", "comment",
				this.comment);
		var timeReq = req.newUpdatePersonAppDataRequest("VIEWER", "time",
				this.time);
		req.add(memoReq);
		req.add(commentReq);
		req.add(timeReq);
		return req;
	},
	setDiffTime : function(display_time) {
		this.diff = (new Date()).getTime() - display_time;
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
		var fields = [ "memo_id", "comment", "time" ];

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
	toComments : function(data){
	    var array = new Array();   
	    var appendFunc = function(obj){
	      if(obj){
	        for(var id in obj){
	          var commentObj = obj[id];
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
	}
}


gadgets.util.registerOnLoadHandler(function(){
    $('#next').click(UgoSocial.next);
    $('#prev').click(UgoSocial.prev);
    gadgets.window.adjustHeight();        
    UgoSocial.getJson();
    
    
    UgoSocial.setComments();
    UgoSocial.getAllFriendThumbURL();
});

