function initEvent() {
	var ev = document.createEvent('Event');
	ev.initEvent('ScrapBook.downloadComplete', true, true);
	document.dispatchEvent(ev);
}
