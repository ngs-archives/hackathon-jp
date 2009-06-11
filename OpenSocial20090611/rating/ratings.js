/*
 * ratings.js - An OpenSocial ratings library
 */

/* globals */
var RATINGS = {};
RATINGS.CONFIG = {

};

function ratings_get_movie(url, id, callback) {
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest(url, callback, params);  
}
