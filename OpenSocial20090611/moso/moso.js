RESOURCE_URL_ROOT = 'http://files.getdropbox.com/u/536450/moso';

HOME_HTML_URL = RESOURCE_URL_ROOT + '/home.html';
PROFILE_HTML_URL = RESOURCE_URL_ROOT + '/profile.html';
CANVAS_HTML_URL = RESOURCE_URL_ROOT + '/canvas.html';

//外部ホストへフォームデータを送信する

$(function(){
	var userID = {};
	$("#sendBtn").click(function(){
	//フォーム各要素のデータを変数に格納
	var setX = $("#setX").val();
	var setY = $("#setY").val();
	alert(setX);
	var setPhoto = $("#setPhoto").val();
	var comment = $("#comment").val();
	var kinds = $("#kinds").val();

	//会員IDをリクエストする
/*	$.ajax({
    	url: '/people/@owner/@self',
    	data: {},
    	dataType: 'data',
    	success: function(people) {
      		var person = people[0];
//      		console.info(person.id);
//     		console.info(person.nickname);
			userID =person.getId();
    		},
    		error: function(xhr, status, e) {
  //    		console.info(xhr, status, e);
    		}
  	});*/

	//外部サーバーへajax通信をおこなう
	$.ajax({
		type: 'post',
		url: 'http://ec2-174-129-93-227.compute-1.amazonaws.com/locations',
		data: {
	//		"id":userID,
			"setX" : setX,
			"setY" : setY,
			"setPhoto" : setPhoto,
			"comment" : comment,
			"kinds" : kinds
		},
		dataType: 'json',
		cache: false,
		
		//データ取得に成功した場合の処理を定義
		success: function(data, status){
	//	console.log(data, status);
			
		},
		error: function(xhr, status, e){
			console.info(xhr, status, e);
		}
	});
	$("#regi").html("登録完了しました！");
})
})

var map = {
	
	setView : function(){
		var map = new GMap2(document.getElementById("map"));
		var point = new GLatLng(36.03, 139.15);
		
		map.addControl(new GLargeMapControl());	
		map.setCenter(point, 1);
		
		var marker = new GMarker(point, {draggable: true});
		
		map.addOverlay(marker);
		
		GEvent.addListener(marker, 'mouseout', function() {
			var pnt = marker.getPoint();
			var lng = pnt.lng();
			var lat = pnt.lat();
			
			document.getElementById("setX").value = lat;
			document.getElementById("setY").value = lng;
		});
	
	}
}

var view = {
		map : {},
		init : function() {
			view.buildMap();
			view.request(view.buildMarkers);
		},
		buildMap : function() {
			view.map = new GMap2(document.getElementById("viewMap"));
			var point = new GLatLng(36.03, 139.15);
			
			view.map.addControl(new GLargeMapControl());
			view.map.setCenter(point, 1);
		},
		buildMarkers : function(result) {
			$.each(result, function(key, value) {
				var location = value.location;
				var point = new GLatLng(location.setX, location.setY);
				var marker = new GMarker(point);
				var windowHtml = '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
				windowHtml += '<p class="txt12">' + location.comment + '</p>';
				
				if (location.kind == 1) {
					windowHtml += '<p class="memo">...っていうのは妄想だけど</p>';
				}

				GEvent.addListener(marker, 'click', function() {
					marker.openInfoWindowHtml(windowHtml);
				});		

				view.map.addOverlay(marker);
			});
		
		},
		request : function(callback) {
			var params = {};
			var url = 'http://ec2-174-129-93-227.compute-1.amazonaws.com/locations';
			
			params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
			params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
			params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
			params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
			
			gadgets.io.makeRequest(url, function(response) {
				var transport_errors = response.errors;
				if (transport_errors.length) {
					alert('Transport Error' + Object.toJSON(transport_errors));
					return;
				}
				
				var result = response.data;
				
				if (result.errors) {
					console.log('Application Error');
					console.log(result.errors);
				}
				
				callback(result);
			}, params);
		}
	};

var albumView = {

	requestAlbums : function() {
		var idspec_params = {};
		idspec_params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
		var idspec = opensocial.newIdSpec(idspec_params);
		var params = {};
		req = new opensocial.newDataRequest();
		req.add(req.newFetchAlbumsRequest(idspec, params), 'albums');
		req.send(albumView.onLoadAlbums);
	},
	onLoadAlbums : function(dataResponse){
		var albums = dataResponse.get('albums').getData();
		albums.each(function(album){
			albumView.listMediaItems(album.getField(opensocial.Album.Field.ID));
		});
	},
	listMediaItems : function(albumId) {
		var idspec_params = {};
		idspec_params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
		var idspec = opensocial.newIdSpec(idspec_params);
		var req = new opensocial.newDataRequest();
		var params = {};
		req.add(req.newFetchMediaItemsRequest(idspec, albumId, params), 'mediaitems');
		req.send(albumView.onLoadMediaItems);
	},
	onLoadMediaItems : function(dataResponse) {
		var data = '<ul class="photos clears">';
		var mediaitems = dataResponse.get('mediaitems').getData();
		
		mediaitems.each(function(mediaitem) {
			data += '<li>';
			data += '<img class="photo" src="' + mediaitem.getField(opensocial.MediaItem.Field.THUMBNAIL_URL) + '" /><br />'+mediaitem.getField(opensocial.MediaItem.Field.TITLE)+'</li>';
		});
		
		data += '</ul>';
		$("#photos").html(data);
		$(".photo").click(function(){
			$(".photo").css({ "border":"1px solid #EEE" });
			$(this).css({ "border":"2px solid #F00" });
			var path = $(this).attr("src").split("?");
			
			$("#setPhoto").val(path[0]);
		});
		map.setView();
	}
}

moso = {
	init : function(){
		tabs = new gadgets.TabSet(null,null,document.getElementById("tabs"));
		tabs.alignTabs("left",2);
		
		view.init();
		
		var tab1 = {
			contentContainer: document.getElementById("viewer"),
			callback: function(){
				view.init();
			}
		}
		tabs.addTab("表示",tab1);
		
		var tab2 = {
			contentContainer: document.getElementById("regi"),
			callback: function(){
				albumView.requestAlbums();
			}
		}
		tabs.addTab("登録",tab2);
		
		
		gadgets.window.adjustHeight(750);
	}
}

var htmlInit = function (url,initializer){
	return function(){
		$('#base').inc(url);
		if (initializer)
			initializer();
	}
}
moso.homeInit = htmlInit(HOME_HTML_URL);
moso.profileInit = htmlInit(PROFILE_HTML_URL);
moso.canvasInit = htmlInit(CANVAS_HTML_URL, moso.init);