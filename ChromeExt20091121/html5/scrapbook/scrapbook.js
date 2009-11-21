
function initEventListener () {
	document.addEventListener('ScrapBook.downloadComplete', function (ev) {
		notifyDownloadCompleted(
			document.location.href,
			document.title
		);
	}, false);
}

var ScrapBook = function () {}

function init () {
	ScrapBook.connection = chrome.extension.connect();
	initEventListener();
}
function notifyDownloadCompleted(url, title) {
	ScrapBook.connection.postMessage( {
		command: "onDownloadComplete",
		url: url, title: title
	} );
}

init();

