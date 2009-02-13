
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
    $.each(items,function(){
	    html.push("<div style='margin:5px 0 0 5px;display:inline-block'>");
	    html.push("<div>" + txt(this,"title") + "</div>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    cdata.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    //html.push("<blockquote>" + cdata + "</blockquote>");
	    html.push("<img src='" + img + "' width='80' />");
	    html.push("ASIN: " + asin );
	    html.push("</div>");
	});
    document.getElementById('friends').innerHTML += html.join('');
}


function init(){
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    gadgets.io.makeRequest("http://booklog.jp/users/sawamur/feed/RSS1", show, params );
}


