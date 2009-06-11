var WIDGET = {};
WIDGET.CONFIG = {
    'data_url': "http://rating.local/",
    'ratings_url': "http://rating.local/",
};

function init() {
  get_movie("star_trek");
  get_ratings("star_trek");
}

function get_movie(id) {
  var url = WIDGET.CONFIG["data_url"] + "movie_" + id + ".json";
  ratings_get_item(url, id, on_movie);
}

function on_movie(data) {
  movie = data.data;
  document.getElementById('title').innerHTML = movie.title;
  console.log(movie);
}



function get_ratings(id) {
  var url = WIDGET.CONFIG["ratings_url"] + "ratings_" + id + ".json";
  ratings_get_rating(url, id, on_rating);
}

function on_rating(data) {
  rating = data.data;
  document.getElementById('average_rating').innerHTML = rating.average_rating;
  document.getElementById('total_ratings').innerHTML = rating.total_ratings;
}