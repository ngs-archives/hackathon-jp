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
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'owner')
	var keys = ['bookringr'];
	var idSpecParams = {};
	var escapeParams = {};
	escapeParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = opensocial.EscapeType.NONE;
	idSpecParams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
	var idSpec = opensocial.newIdSpec(idSpecParams);
	req.add(req.newFetchPersonAppDataRequest(idSpec, keys, escapeParams), 
		'stored');
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
		this.appData = gadgets.json.parse(obj['bookringr']);
	    }

	    if (owner.isViewer()) {
		bookRingr.controller.loadXML();
	    }
	    else {
		bookRingr.controller.books = this.appData;
		bookRingr.controller.showBooks();
	    }
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
	var books = new Array();
	bookRingr.controller.books = new Array();
	var items = xml.getElementsByTagName('item');
	$.each(items, function(){
	    var title       = bookRingr.controller.getNodeValueByTagName(this, 'title');
	    var description = bookRingr.controller.getNodeValueByTagName(this, 'description');
	    description.match(/img src="(.+?)"/);
	    var imgUrl = RegExp.$1;
	    description.match(/asin\/(\w+)/);
	    var asin = RegExp.$1;
	    book = new bookRingr.Book(title, imgUrl, asin);
//	    books.push(book);
	    bookRingr.controller.books.push(book);
	});
/*	
	for (var count1 = 0;
	     count1 < books.length;
	     ++count1) {
	    var bookFromXML = books[count1];
	    var alreadyExist = false;
	    for (var count2 = 0;
		 count2 < bookRingr.controller.appData.length;
		 ++count2) {
		var bookFromAppData = bookRingr.controller.appData[count2];
		if (bookFromXML.asin == bookFromAppData.asin) {
		    var alreadyExist = true;
		}
	    }
	    if (! alreadyExist) {
		bookRingr.controller.books.push(bookFromXML);
	    }
	}
*/
	bookRingr.controller.updateAppData();
    },
    updateAppData: function() {
	var req = opensocial.newDataRequest();
	console.log(this.books);
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
	    console.log('updated!');
	    bookRingr.controller.showBooks();
	}
    },
    showBooks: function() {
	var template = $("#template").val();
	var data     = {books: bookRingr.controller.books}
	var result   = template.process(data);
	$('#contents').html(result);
	$('.status').click(this.onChangeStatus);
    },
    onChangeStatus: function(e) {
	var asin   = $(e.target).parent()[0].id;
	var status = $(this).val();

	for(var count = 0;count < bookRingr.controller.books.length; ++count) {
	    if (bookRingr.controller.books[count].asin == asin) {
		bookRingr.controller.books[count].status = status;
		activityString = 
		    bookRingr.controller.books[count].title + 
		    bookRingr.controller.books[count].status;
		bookRingr.controller.postActivity(activityString);
	    }
	}
	bookRingr.controller.updateAppData();
	
    },
    postActivity: function(text) {
	var params = {};  
	params[opensocial.Activity.Field.TITLE] = text;
	var activity = opensocial.newActivity(params); 
	opensocial.requestCreateActivity(activity, 
					 opensocial.CreateActivityPriority.LOW, 
					 this.onPostActivity);
    },
    onPostActivity: function(status) {
	if (status.hadError()){
	    alert("Error creating activity.");
	} else {
	    alert("Activity successfully created.");
	}
    },
    getNodeValueByTagName: function(xml, tag){
	return xml.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    }
}


gadgets.util.registerOnLoadHandler(function() {
    bookRingr.controller = new bookRingr.ProfileController();
});

