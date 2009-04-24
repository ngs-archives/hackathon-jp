/**
 * Twitter Gadget
 * This JavaScript file is for Canvas view.
 */
var twitter_feed;
var twitter_username = "canonical";

//XXX: given a twitter id, get the url from twitter instead of using this array!
var user_feed_map = new Array();
user_feed_map["canonical"] = "http://twitter.com/statuses/user_timeline/17401584.rss";
user_feed_map["john.doe"] = "http://twitter.com/statuses/user_timeline/17401584.rss";
user_feed_map["jane.doe"] = "http://twitter.com/statuses/user_timeline/17401584.rss";
user_feed_map["george.doe"] = "http://twitter.com/statuses/user_timeline/17401584.rss";

function init() {
    load_friends();
    get_rss_feed();
}

function get_rss_feed() {
  //XXX: given a twitter id, get the url from twitter
  var url = user_feed_map[twitter_username];
  
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.FEED;
  params[gadgets.io.RequestParameters.NUM_ENTRIES] = 5;
  gadgets.io.makeRequest(url, on_twitter_feed, params);  
}

function on_twitter_feed(data) {
  twitter_feed = data.data;
  console.log(twitter_feed);
  output = "";
  if (twitter_feed.Entry) {
    for (var i = 0; i < twitter_feed.Entry.length; i++) {    
     output += "<li>" + twitter_feed.Entry[i].Title + "</li>";
    }
  }
  console.log(output);
  document.getElementById('username').innerHTML = twitter_username;
  document.getElementById('tweets').innerHTML = output;
}


function load_friends() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest("VIEWER"), 'viewer');
	var viewerFriends = opensocial.newIdSpec({ "userId" : "VIEWER", "groupId" : "FRIENDS" });
	var opt_params = {};
	//limit to 100 in case they are too popular
	opt_params[opensocial.DataRequest.PeopleRequestFields.MAX] = 100;
  req.add(req.newFetchPeopleRequest(viewerFriends, opt_params), 'viewerFriends');
  var viewer = opensocial.newIdSpec({ "userId" : "VIEWER" });
  req.send(on_load_friends);
}

function on_load_friends(data) {
  var viewer = data.get('viewer').getData();
  var viewerFriends = data.get('viewerFriends').getData();
  
  html = new Array();
  html.push('<select id="person" onselect="on_friend_select(this.id);">');
  html.push('<option value="', viewer.getId(), '">', viewer.getDisplayName(), '</option>');
  viewerFriends.each(function(person) {
    if (person.getId()) {
      html.push('<option value="', person.getId(), '">', person.getDisplayName(), '</option>');
    }
  });
  html.push('</select>');
  html.push("<a href='javascript:change_friend();'>change</a>");
  document.getElementById('friends').innerHTML = html.join('');
}

function change_friend() {
  twitter_username = document.getElementById('person')[document.getElementById('person').selectedIndex].value;
  get_rss_feed();
}
