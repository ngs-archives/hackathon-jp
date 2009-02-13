
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
	    var $div = $("<div class='bkrg'></div>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    cdata.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    $div.html( '<div class="br_title">' 
		       + "<img src='" + img + "'>"
		       +  txt(this,"title") + '</div>'
		       + "ASIN: " + asin		
		       + "<br />"
		       );
	    $('<input type="radio">want</input>').attr("name",asin).appendTo($div);
	    $('<input type="radio">reading</input>').attr("name",asin).appendTo($div);
	    $('<input type="radio">have read</input>').attr("name",asin).appendTo($div);
	    $base.append($div);
	});
}


function init(){
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest("http://booklog.jp/users/sawamur/feed/RSS1", show, params );
}


