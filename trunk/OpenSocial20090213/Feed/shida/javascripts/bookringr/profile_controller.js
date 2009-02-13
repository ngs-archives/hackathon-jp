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
    books: null,
    loadAppData: function() {
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'owner')
	var keys = ['bookringr'];
	var idSpecParams = {};
	idSpecParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
	var idSpec = opensocial.newIdSpec(idSpecParams);
	req.add(req.newFetchPersonAppDataRequest(idSpec, keys), 'stored');
	req.send(this.onLoadAppData);
    },
    onLoadAppData: function(data) {
	if (data.hadError()) {
	    console.log(data.getErrorMessage());
	}
	else {
	    var owner  = data.get('owner').getData();
	    var stored = data.get('stored').getData();
	    var obj = stored[owner.getId()];
	    if (obj) {
		this.appData = obj['bookringr'];
		console.log(this.appData);
	    }
	    bookRingr.controller.loadXML();
	}
    },
    loadXML: function() {
	var params = {};
	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.DOM;
	
	gadgets.io.makeRequest('http://booklog.jp/users/yshida/feed/RSS1', 
			       this.onLoadXML,
			       params);
    },
    onLoadXML: function(obj) {
	var xml = obj.data;

	bookRingr.controller.books = new Array();
	var items = xml.getElementsByTagName('item');
	$.each(items, function(){
	    var title       = bookRingr.controller.getNodeValueByTagName(this, 'title');
	    var description = bookRingr.controller.getNodeValueByTagName(this, 'description');
	    description.match(/img src='(.+?)'/);
	    var imgUrl = RegExp.$1;
	    description.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    book = new bookRingr.Book(title, imgUrl, asin);
	    bookRingr.controller.books.push(book);
	});
	bookRingr.controller.updateAppData();
    },
    updateAppData: function() {
	var req = opensocial.newDataRequest();
	req.add(req.newUpdatePersonAppDataRequest(
	          opensocial.IdSpec.PersonId.VIEWER, 
	          'bookringr', 
	          this.books),
		"response")
	req.send(this.onUpdateAppData)
    },
    onUpdateAppData: function(data) {
	if (data.hadError()) {
	    console.log(data);
	}
	else {
	    console.log('no error!');
	}
    },
    getNodeValueByTagName: function(xml, tag){
	return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    }
}


gadgets.util.registerOnLoadHandler(function() {
    bookRingr.controller = new bookRingr.ProfileController();
});