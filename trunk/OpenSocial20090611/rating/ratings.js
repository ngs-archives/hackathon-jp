/*
 * ratings.js - An OpenSocial ratings library
 */

/* globals */
var RATINGS = {};
RATINGS.CONFIG = {

};

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
