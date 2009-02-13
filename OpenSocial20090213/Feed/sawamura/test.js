
gadgets.util.registerOnLoadHandler(init);

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
    var $base = $("#friends");
    $.each(items,function(){
	    var $div = $("<div style='margin:5px 0 0 5px;display:inline-block'></div>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    cdata.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    $div.html( txt(this,"title")
		       +
		       "<img src='" + img + "' width='80' />"
		       + "ASIN: " + asin		
		       );
	    $('<input type="radio">reading</input>').appendTo($div);
	    $('<input type="radio">read</input>').appendTo($div);
	    $('<input type="radio">want</input>').appendTo($div);
	    $base.append($div);
	});
}


function init(){
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest("http://booklog.jp/users/sawamur/feed/RSS1", show, params );
}


