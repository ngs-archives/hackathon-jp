var WIDGET = {};
WIDGET.CONFIG = {
    'ratings_url': "http://rating.local/",
};

function init() {
  get_movie("star_trek");
}

function get_movie(id) {
  var url = WIDGET.CONFIG["ratings_url"] + "movie_" + id + ".json";
  ratings_get_item(url, id, on_movie);
}

function on_movie(data) {
  movie = data.data;
  document.getElementById('title').innerHTML = movie.title;
  console.log(movie);
}