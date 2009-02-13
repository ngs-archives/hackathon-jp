function init() {
    var params = {};
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.FEED;
    
    gadgets.io.makeRequest("http://booklog.jp/users/yshida/feed/RSS1", function(obj) {
	var booklog = obj.data;
	console.log(obj.data);
    }, params);
}

gadgets.util.registerOnLoadHandler(init);