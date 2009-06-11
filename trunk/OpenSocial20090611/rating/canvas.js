var RATINGS = {};
RATINGS.CONFIG = {
    'url': "http://rating.local/",
};

function init() {
  get_movie("star_trek");
}

function get_movie(id) {
  var url = RATINGS.CONFIG["url"] + "movie_" + id + ".json";
  var params = {};
  params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
  gadgets.io.makeRequest(url, on_movie, params);  
}

function on_movie(data) {
  movie = data.data;
  document.getElementById('title').innerHTML = movie.title;  
}