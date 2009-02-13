
function txt(dom,tag){
    return dom.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}
    
function show(oj){ 
    var html = new Array();
    html.push("<h1>");
    var dom = oj.data;
    html.push( txt(dom,"title") );
    html.push("</h1>");
    var items = dom.getElementsByTagName("item");
    var $base = $("#photolist");
    $.each(items,function(){
	    var $div = $("<div class='bkrg'></div>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    $div.html( '<div>'
		       + "<img src='" + img + "'>"
		       + '</div>'
		       + '<div>'
		       +  txt(this,"title") + '<br />'
		       + '<br />'
		       + '</div>'
		       );
	    $base.append($div);
	});
}


function init(){
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    var url = "http://photomemo.jp/sawamura/rss.xml";
    gadgets.io.makeRequest(url, show, params );
    //postActivity("ok!");
}

function postActivity(text) {  
    var params = {};  
    params[opensocial.Activity.Field.TITLE] = text;
    var activity = opensocial.newActivity(params); 
    opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.HIGH, callback);
    //div.innerHTML = "Activity title is: " + activity.getField(opensocial.Activity.Field.TITLE);
}        

function callback(status) {
    if (status.hadError()){
	alert("Error creating activity.");
    } else {
	alert("Activity successfully created.");
    }
}
  

gadgets.util.registerOnLoadHandler(init);