var displayData = {
    memoId : 'ugomemo:XXXXXXXXXXXXX:BBBBBBBBBBBBBBBB',
    comments : [
        {
            time    : 1000,
            user    : 'chris4403',//TODO fix to userid
            comment : 'ほげほげ'
        },
        {
            time    : 2000,
            user    : 'someda',//TODO fix to userid
            comment : 'もげもげー'
        },
        {
            time    : 3000,
            user    : 'nakazoe',//TODO fix to userid
            comment : 'うごうごー'
        }
    ]
}

var UgomemoJson = "";
var MovieNum = "";
var MovieHatenaSyntax = "";
var OnloadDate = "";

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
    $('<p>' + comment + '</p>').css({position:'relative',left:'200px',top: topHeight }).appendTo('#comment_area').animate({left:'-200px'},speed);
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

}

gadgets.util.registerOnLoadHandler(function(){
    $('#next').click(UgoSocial.next);
    $('#prev').click(UgoSocial.prev);
    UgoSocial.getJson();
});

