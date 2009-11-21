
	var connection = chrome.extension.connect();
function notifyDownloadCompleted(url, title) {
	connection.postMessage( {
		command: "onDownloadComplete",
		url: url, title: title
	} );
}
/* for test
notifyDownloadCompleted(
		document.location.href,
		document.title
);
*/
