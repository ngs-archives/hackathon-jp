/**
 * Tutorial
 * This JavaScript file is for Canvas view.
 */

var tabs = null;

function init() {
    // TODO: Write the code for initializing.
    tabs = new gadgets.TabSet("tutorial_tab");

	/*
	 * Hello World!
	 */
	var helloWorldId = tabs.addTab("Hello World");
	init_hello_world(helloWorldId);
	
	/*
	 * Listing friends
	 */
	var listingFriendId = tabs.addTab("Listing Friends");
	init_listing_friend(listingFriendId);
	
}

// TODO: Write the code for Canvas view.
