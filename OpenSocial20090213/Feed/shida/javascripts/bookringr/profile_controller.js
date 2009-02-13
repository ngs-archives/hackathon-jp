var bookRingr = new Object();

/**
 * コンストラクタ
 */
bookRingr.ProfileController = function() {
    this.loadAppData();
}

/**
 * インスタンスメソッド
 */
bookRingr.ProfileController.prototype = {
    appData: null,
    loadAppData: function() {
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "owner")
	var keys = ["bookringr"];
	var idSpecParams = {};
	idSpecParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersionId.OWNER;
	var idSpec = opensocial.newIdSpec(idSpecParams);
	req.add(req.newFetchPersonAppDataRequest(idSpec, keys), "stored");
	req.send(bookRingr.controller.onLoad);
    },
    onLoadAppData: function(data) {
	var owner  = data.get("owner").getData();
	var stored = data.get("stored").getData();
	var obj = stored[owner.getId()];
	this.appData = obj["bookringr"];
	bookRingr.controller.loadXML();
    },
    loadXML: function() {
	var params = {};
	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
	
	gadgets.io.makeRequest("http://booklog.jp/users/yshida/feed/RSS1", 
			       bookRingr.controller.onLoadXML,
			       params);
    },
    onLoadXML: function(obj) {
	var xml = obj.data;
	bookRingr.controller.updateAppData(xml);
    }
    updateAppData: function(xml) {
	var books = new Array();
	var items = xml.getElementsByTagName("item");
	$.each(items, function(){
	    var title       = bookRingr.controller.getNodeValueByTagName(this, "title");
	    var description = bookRingr.controller.getNodeValueByTagName(this, "description");
	    description.match(/img src="(.+?)"/);
	    var imgUrl = RegExp.$1;
	    description.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    book = new bookRingr.Book(title, imgUrl, asin);
	    books.push(book);
	});
	
	
    },
    onUpdateAppData: function() {
	
    },
    getNodeValueByTagName: function(xml, tag){
	return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    }
}


gadgets.util.registerOnLoadHandler(function() {
    bookRingr.controller = new bookRingr.ProfileController();
});