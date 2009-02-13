
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
	    html.push("<h2>" + txt(this,"title") + "</h2>");
	    var cdata = txt(this,"description");
	    cdata.match(/img src="(.+?)"/);
	    var img = RegExp.$1;
	    cdata.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    //html.push("<blockquote>" + cdata + "</blockquote>");
	    html.push("<img src='" + img + "' width='80' />");
	    html.push("ASIN: " + asin );
	});
    document.getElementById('friends').innerHTML += html.join('');
}

var params = {};
params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;

function init(){
    gadgets.io.makeRequest("http://booklog.jp/users/sawamur/feed/RSS1", show, params );
}


