//外部ホストへフォームデータを送信する

function testCreate(){
	var hostUserID={};
	//オーナーの会員IDをリクエストする
	var req=opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER),"owner");
	req.send(function(data){
		if(data.hadError()){
			var msg = data.getErrorMessage();
			console.error(msg);
		}else{
			var owner=data.get("owner").getData();
			hostUserID=owner.getId();
			//console.info(hostUserID);

			//フォーム各要素のデータを変数に格納
			var url = HOST_URL + '/locations';
			var post_params = {
					setX: 125,
					setY: 125,
					name: "テスト名前",
					address: "テスト住所",
					setPhoto: "http://tests",
					comment: "テストコメント",
					kinds: 0,
					rating_number: 3,
					rating_people: 1,
					mixi_id: hostUserID
			};

			var opt_params = {};
			//DBへアクセス
			opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
			opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
			opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
			opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
			opt_params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_params)

			gadgets.io.makeRequest(url, function(response){
			},opt_params);
		}
	});
}
var host ={

		init : function(){
			var hostUserID={};
			//オーナーの会員IDをリクエストする
			var req=opensocial.newDataRequest();
			req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER),"owner");
			req.send(function(data){
				if(data.hadError()){
					var msg = data.getErrorMessage();
					console.error(msg);
				}else{
					var owner=data.get("owner").getData();
					hostUserID=owner.getId();
					//console.info(hostUserID);

					//送信をクリックしたらデータをサーバーへ送信する
					$("#sendBtn").click(function(){
					//フォーム各要素のデータを変数に格納
					var url = HOST_URL + '/locations';
//					var post_params = {
//										lng: $("#setX").val(),
//										lat: $("#setY").val(),
//										name: $("#location_name").val(),
//										address: $("#address").val(),
//										setPhoto: $("#setPhoto").val(),
//										comment: "テストコメント",
//										kinds: $("#kinds").val(),
//										rating_number: $("#rating").val()};
					var post_params = {
							setX: 125,
							setY: 125,
							name: "テスト名前",
							address: "テスト住所",
							setPhoto: "http://tests",
							comment: "テストコメント",
							kinds: 0,
							rating_number: 3};

					var opt_params = {};
					//DBへアクセス
					opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
					opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
					opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
					opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
					opt_params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_params)

					gadgets.io.makeRequest(url, function(response){
						
					},opt_params);
						//外部サーバーへajax通信をおこなう
						$("#regi").html("登録完了しました！");
					});
				}
			});
	}
}
	

var listView = {

		map : {},
		//マップに自己登録リストを表示
		listResult : function (result){
		
			var point = new google.maps.LatLng(36.03, 139.15);
			var myOptions = {
      			zoom: 5,
		      	center: point,
		      	scaleControl: true,
      			mapTypeId: google.maps.MapTypeId.ROADMAP
    		};
    		listView.map = new google.maps.Map(document.getElementById("viewMap"), myOptions);
			google.maps.event.addListener(view.map, 'rightclick', function(event) {
				if (event) {
					x = event.latLng.lng();
					y = event.latLng.lat();
					
					var infoWindow = new google.maps.InfoWindow()
					infoWindow.set_position(event.latLng);
					var windowHtml = '<p><a href="javascript:void(0);" onclick="">このポイントに登録する</a></p>';
					infoWindow.set_content(windowHtml);
					infoWindow.open(view.map);
				}
			});
		
			$.each(result, function(key, value) {
			
				var location = value.location;
			
				var point = new google.maps.LatLng(location.setX, location.setY);
				var marker = new google.maps.Marker();
				marker.set_position(point);
				
				var windowHtml = '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
				windowHtml += '<p class="txt12">' + location.comment + '</p>';
				if (moso.isOwner) windowHtml += '<p class="txt12"><a href="javascript:void(0);" onclick="">このポイントに登録する</a></p>';
				listView.listRightPhoto(location, result);
				google.maps.event.addListener(marker, 'click', function() {
					var infoWindow = new google.maps.InfoWindow()
					infoWindow.set_position(point);
					infoWindow.set_content(windowHtml);
					infoWindow.open(listView.map);
				});		
				marker.set_clickable(true);
				marker.set_visible(true);
				marker.set_map(listView.map);
			});
		
		},
		
		listRightPhoto : function(location, result) {
			$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');
			$("#latestPhoto .comment").html('<div class="form_line">' + location.comment + '</div>');

			var data = '<ul class="photos clears"></ul>';
			$("#viewPhotoList").html(data);

			$.each(result, function(key, value) {
				var location = value.location;
				$("#viewPhotoList .photos").append($("<li></li>").html('<img class="photo" src="' + location.setPhoto + '" />').click(function(){
					$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');			
					$("#latestPhoto .comment").html('<div class="form_line">' + location.comment + '</div>');
				}));
				if (moso.isOwner) $("#viewRight .addButton").css({"display":"block"});
			});
		},
		
		//canvasで最初に表示された際の自己登録リスト取得関数
		listRequest : function (callback) {
				var userID={};
			//viewerがオーナーの場合は、オーナーの会員IDでリクエストする。
				if(moso.isOwner){
				var req=opensocial.newDataRequest();
				req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER),"owner");
				req.send(function(data){
					if(data.hadError()){
						var msg = data.getErrorMessage();
						console.error(msg);
					}else{
						var owner=data.get("owner").getData();
						userID=owner.getId();
						var opt_params = {};
						var url = HOST_URL + '/locations/'+userID;
				
						console.info(userID);
						//DBへアクセス
						opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
						opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
						opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
						opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;

						gadgets.io.makeRequest(url, function(response) {
						var transport_errors = response.errors;
						if (transport_errors.length) {
							alert('Transport Error' + Object.toJSON(transport_errors));
							return;
						}
					
						var result = response.data;
						console.info(result);
					
						if (result.errors) {
							console.log('Application Error');
							console.log(result.errors);
						}
					
						callback(result);
						},opt_params);
					}
				});
				}else{
							//DBへアクセス
							opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
							opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
							opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
							opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;

							gadgets.io.makeRequest(url, function(response) {
								var transport_errors = response.errors;
								if (transport_errors.length) {
									alert('Transport Error' + Object.toJSON(transport_errors));
									return;
								}
					
								var result = response.data;
								console.info(result);
					
								if (result.errors) {
									console.log('Application Error');
									console.log(result.errors);
								}
					
								callback(result);
							},opt_params);
				}
		}
	}	
//地図が一つになったので
//一時的にコメントアウト
//var map = {
//	
//	setView : function(){
//		var map = new GMap2(document.getElementById("map"));
//		var point = new GLatLng(36.03, 139.15);
//		
//		map.addControl(new GLargeMapControl());	
//		map.setCenter(point, 1);
//		
//		var marker = new GMarker(point, {draggable: true});
//		
//		map.addOverlay(marker);
//		
//		GEvent.addListener(marker, 'mouseout', function() {
//			var pnt = marker.getPoint();
//			var lng = pnt.lng();
//			var lat = pnt.lat();
//			
//			document.getElementById("setX").value = lat;
//			document.getElementById("setY").value = lng;
//		});
//	
//	}
//}

var view = {
		map : {},
		infoWindow : null,
		init : function() {
//			var deferred = $.deferred();
//			deferred.next(function(){
//							view.buildMap()
//			}).next(function(){
//				view.request(view.buildMarkers)
//			});
//			deferred.call();
			
			view.buildMap()
			view.request(view.buildMarkers)
			
			gadgets.window.adjustHeight(700);
		},
		buildMap : function() {
			//view.map = new GMap2(document.getElementById("viewMap"));
			var point = new google.maps.LatLng(36.03, 139.15);
			var myOptions = {
      			zoom: 5,
		      	center: point,
		      	scaleControl: true,
      			mapTypeId: google.maps.MapTypeId.ROADMAP
    		};
    		view.map = new google.maps.Map(document.getElementById("viewMap"), myOptions);
			//view.map.addControl(new GLargeMapControl());	
			//view.map.setCenter(point, 1);

			//if (!moso.isOwner) return true;

			google.maps.event.addListener(view.map, 'rightclick', function(event) {
				if (event) {
					if (this.infoWindow) this.infoWindow.close();
				
					x = event.latLng.lng();
					y = event.latLng.lat();
					
					this.infoWindow = new google.maps.InfoWindow()
					this.infoWindow.set_position(event.latLng);
					var windowHtml = '<p><a href="javascript:void(0);" onclick="view.editPhoto(\''+ x +'\',\''+ y +'\');">このポイントに登録する</a></p>';
					windowHtml += '<p><a href="javascript:void(0);" onclick="listView.listRequest(listView.listResult);">自分の登録リストを表示する</a></p>';
					this.infoWindow.set_content(windowHtml);
					this.infoWindow.open(view.map);
				}
			});
		},
		buildMarkers : function(result) {
			$.each(result, function(key, value) {
				var location = value.location;
			
				var point = new google.maps.LatLng(location.setX, location.setY);
				var marker = new google.maps.Marker();
				marker.set_position(point);
				
				var windowHtml = '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
				windowHtml += '<p class="txt12">' + location.comment + '</p>';
				if (moso.isOwner) windowHtml += '<p class="txt12"><a href="javascript:void(0);" onclick="">このポイントに登録する</a></p>';
				google.maps.event.addListener(marker, 'click', function() {
					var infoWindow = new google.maps.InfoWindow()
					infoWindow.set_position(point);
					infoWindow.set_content(windowHtml);
					infoWindow.open(view.map);

					view.listRightPhoto(location, result);
				});		
				marker.set_clickable(true);
				marker.set_visible(true);
				marker.set_map(view.map);
			});
		
		},
		listRightPhoto : function(location, result) {					
			$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');			
			$("#latestPhoto .comment").html('<div class="form_line">' + location.comment + '</div>');

			var data = '<ul class="photos clears"></ul>';
			$("#viewPhotoList").html(data);

			$.each(result, function(key, value) {
				var location = value.location;
				$("#viewPhotoList .photos").append($("<li></li>").html('<img class="photo" src="' + location.setPhoto + '" />').click(function(){
					$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');			
					$("#latestPhoto .comment").html('<div class="form_line">' + location.comment + '</div>');
				}));
				if (moso.isOwner) $("#viewRight .addButton").css({"display":"block"});
			});
		},
		request : function(callback) {
			var params = {};
			var url = HOST_URL + '/locations';
			
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
		},
		
		editPhoto : function(x, y) {
			$("#editSection").css({ "display":"none" });			
			$("#viewSection").css({ "display":"block" });
			
			document.getElementById("setX").value = x;
			document.getElementById("setY").value = y;
			
			albumView.requestAlbums();
		}
	};

var albumView = {

	AlbumsTitle : [],
	conf		: 0,
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
		var i = 1;
		albums.each(function(album){
			albumView.listMediaItems(album.getField(opensocial.Album.Field.ID));
			albumView.AlbumsTitle.push([album.getField(opensocial.Album.Field.ID),album.getField(opensocial.Album.Field.TITLE),(album.getField(opensocial.Album.Field.THUMBNAIL_URL)) ? album.getField(opensocial.Album.Field.THUMBNAIL_URL) : null]);
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
		var mediaitems = dataResponse.get('mediaitems').getData();
		var topflg = 0;
		var caption = "";
		
		var albumTop = albumView.getAlbumData(mediaitems);
		var data = '<ul id="album_'+albumTop[0]+'" class="photos clears">\n';
		data += '<li><span class="top"><img class="photo" src="'+((albumTop[2]) ? albumTop[2] : "http://img.mixi.jp/img/basic/common/noimage_photo240.gif")+'" /><br />'+albumTop[1]+'</span>\n';
		data += '<ul class="pics">';
		data += '<li class="back"><img src="http://mizoochi.com/apps/moso/images/return.png" alt="アルバム一覧へ戻る" title="アルバム一覧へ戻る" /></li>';
		
		mediaitems.each(function(mediaitem){
			data += '<li class="pic">';
			data += '<img class="photo" src="' + mediaitem.getField(opensocial.MediaItem.Field.THUMBNAIL_URL) + '" /><br />'+mediaitem.getField(opensocial.MediaItem.Field.DESCRIPTION)+'</li>\n';
		});
		
		data += '</ul>\n</li></ul>\n';
		$("#viewPhotoList").append(data);
		$(".photo").click(function(){
			if(!albumView.conf){
				var setID = $(this).parents()[2].id;
				$("#viewPhotoList ul li span.top").fadeOut(function(){
					$("ul#"+setID+" li span.back").fadeIn();
					$("ul#"+setID+" li ul.pics li:hidden").show("normal");
				});
				albumView.conf = 1;
			}
			$(".photo").css({ "border":"1px solid #EEE" });
			$(this).css({ "border":"2px solid #F00" });
		});
		$(".photo").hover(function(){
			if($(this).css("border")!="2px solid rgb(255, 0, 0)") $(this).css({ "border":"1px solid #E30" });
		},
		function(){
			if($(this).css("border")!="2px solid rgb(255, 0, 0)") $(this).css({ "border":"1px solid #EEE" });
		});
		$(".back").click(function(){
			if(albumView.conf){
				var setID = $(this).parents()[1].id;
				$("ul#"+setID+" li ul.pics li:visible").hide(function(){
					$("#viewPhotoList ul li span.top").fadeIn();
				});
				albumView.conf = 0;
			}
		});
	},
	getAlbumData : function(mediaitems){
		var albumID = "";
		mediaitems.each(function(mediaitem){
			var url = mediaitem.getField(opensocial.MediaItem.Field.URL);
			var path = url.split("/")[7];
			albumID = path.split("_")[0];
		});
		for(var i=0;i<albumView.AlbumsTitle.length;i++){
			if(albumView.AlbumsTitle[i][0]==albumID){
				var data = [albumID,albumView.AlbumsTitle[i][1],albumView.AlbumsTitle[i][2]];
				break;
			}
		}
		return (data) ? data : null;
	}
}
var moso = {
	init : function(){
		moso.whois();
		view.init();
	},
	whois : function(){
		var req = opensocial.newDataRequest(); 
			req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer"); 
			req.send(function(data){
				var viewer = data.get("viewer").getData();
				if(viewer.isOwner()){
					moso.isOwner=1;
					moso.isViewer=0;
				}else{
					moso.isOwner=0;
					moso.isViewer=1;
				}
			});
	}
}

var htmlInit = function (url,initializer){
	return function(){
			initializer();
	}
}
moso.homeInit = htmlInit(HOME_HTML_URL);
moso.profileInit = htmlInit(PROFILE_HTML_URL);
moso.canvasInit = htmlInit(CANVAS_HTML_URL, moso.init);