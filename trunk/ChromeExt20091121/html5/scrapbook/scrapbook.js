
function initEventListener () {
	document.addEventListener('ScrapBook.downloadComplete', function (ev) {
		notifyDownloadCompleted(
			document.location.href,
			document.title
		);
	}, false);
}

function init () {
	var connection = chrome.extension.connect();
	initEventListener();
}
function notifyDownloadCompleted(url, title) {
	connection.postMessage( {
		command: "onDownloadComplete",
		url: url, title: title
	} );
}

init();

