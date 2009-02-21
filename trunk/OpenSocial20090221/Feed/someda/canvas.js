/**
 * ugomemo-someda This JavaScript file is for Canvas view.
 */

function init() {
	var url = "http://ugomemo.hatena.ne.jp/ranking/daily/movie.json?mode=total";
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	gadgets.io.makeRequest(url, jsonCallback, params);
}

function jsonCallback(obj) {
	var json = obj.data;
	console.log(json);
	var ugomemo = json.items[2];
	var base = document.getElementById("input_result");
	var img = ugomemo.movie_thumbnail_path;
	// base.innerHTML = "<canvas id='client' style='border: 1px solid black;
	// width: 200px; height:200px; background-image: url(" + img + ")'>";
	base.innerHTML = "<div id='client' style='width:200px;height:200px;background-image: url("
			+ img + "); background-repeat : no-repeat;'></div>";

	var canvas = document.getElementById("client");
	// var ctx = canvas.getContext("2d");
	// ctx.globalCompositeOperation = 'source-over';

	var width = canvas.offsetWidth;
	var height = canvas.offsetHeight;

	// ctx.fillStyle = "rgb(255,0,0)";
	// ctx.fillRect (10, 10, 40, 40);
	// console.log(ctx);
	// ctx.beginPath();
	// ctx.clearRect(0,0,width,canvas.height);
	// ctx.closePath();

	var comment = document.createElement("div");
	comment.style.position = "absolute";
	comment.style.fontSize = "12px";
	comment.style.color = "yellow";
	// comment.type = "text";
	comment.innerHTML = "コメントが流れるよー";
	base.appendChild(comment);

	var position = [ 0, 0 ];

	var move = function() {
		position[0] += 10;
		position[1] += 5;
		// console.log(position[0] + "-" + position[1]);
		comment.style.left = position[0] + "px";
		comment.style.top = position[1] + "px";
		setTimeout( function() {
			move();
		}, 500);
	}
	move();

	// parent.innerHTML = "<img src='" + ugomemo.movie_thumbnail_path + "'/>";
}