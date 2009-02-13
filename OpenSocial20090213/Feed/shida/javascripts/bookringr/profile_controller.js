var bookRingr = new Object();

/**
 * コンストラクタ
 */
bookRingr.ProfileController = function() {
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
    
    gadgets.io.makeRequest("http://booklog.jp/users/yshida/feed/RSS1", function(obj) {
	var xml = obj.data;
	bookRingr.controller.save(xml);
    }, params);
}

/**
 * インスタンスメソッド
 */
bookRingr.ProfileController.prototype = {
    save: function(xml) {
	console.log(xml);
	var items = xml.getElementsByTagName("item");
	$.each(items, function(){
	    var title       = bookRingr.controller.getNodeValueByTagName(this, "title");
	    var description = bookRingr.controller.getNodeValueByTagName(this, "description");
	    description.match(/img src="(.+?)"/);
	    var imgUrl = RegExp.$1;
	    description.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    book = new bookRingr.Book(title, imgUrl, asin);
	    console.log(book);
	});
    },
    getNodeValueByTagName: function(xml, tag){
	return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    }
}


gadgets.util.registerOnLoadHandler(function() {
    bookRingr.controller = new bookRingr.ProfileController();
});