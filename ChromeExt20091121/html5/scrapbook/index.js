
// cashInfo: {
	//	"http://yahoo.com/index.html":{
//		title:"yahoo",
//		savedDateTime:"Nov 20 2009",
//		url:"test"
//	}
//}
var mainListId = "#mainList";

window.onload = function(){
	//alert('hello world');
	
	var mainList = $(mainListId);
	var cachedInfo = JSON.parse(window.localStorage.cacheInfo);

	for(var pageUrl in cachedInfo){
		var cachedInfoElement = cachedInfo[pageUrl];
		$('<li />')
		.append(
			$('<img/>')
			.attr('src', cachedInfoElement.capPict))
		.append(
			$('<a/>')
			.attr('href', cachedInfoElement.url)
			.text(cachedInfoElement.title))
		.appendTo(mainList);
	}
	/*
	for(var i = 0; i < 10; i++){
		$('<li />').append($('<a/>').attr('href', 'test').text('test')).appendTo(mainList);
	}
	*/
};
