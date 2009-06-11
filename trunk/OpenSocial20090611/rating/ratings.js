/*
 * ratings.js - An OpenSocial ratings library
 */

/* globals */
var RATINGS = {};
RATINGS.CONFIG = {

};

RATINGS.item = null;
RATINGS.rating = null;

/*
 gets json for one item 
*/
function ratings_get_item(url, id, callback) {
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest(url, callback, params);  
}

function ratings_get_rating(url, id, callback) {
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest(url, callback, params);  
}

function ratings_rate(url, item, rating) {
  /* call remote server */ 
  var req = opensocial.newDataRequest();
  var viewer = req.add(req.newFetchPersonRequest("VIEWER"), 'viewer');
  RATINGS.item = item;
  RATINGS.rating = rating;
   req.send(on_get_viewer);
}

function on_get_viewer(data) {
  var viewer = data.get('viewer').getData();
  
  /* create the message */
  var message = "User " + viewer.getDisplayName() + " rated " + RATINGS.item.title + " as " + RATINGS.rating;

  /* send to activity stream */
  var params = {};
  params[opensocial.Activity.Field.TITLE] = message;
  var activity = opensocial.newActivity(params)
  opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.HIGH, function() {});  
}

