//外部ホストへフォームデータを送信する

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
					var setX = $("#setX").val();
					var setY = $("#setY").val();
					var setPhoto = $("#setPhoto").val();
					var comment = $("#comment").val();
					var kinds = $("#kinds").val();

						//外部サーバーへajax通信をおこなう
						$.ajax({
							type: 'post',
							url: 'http://ec2-174-129-93-227.compute-1.amazonaws.com/locations',
							data: {
									"id":hostUserID,
									"setX" : setX,
									"setY" : setY,
									"setPhoto" : setPhoto,
									"comment" : comment,
									"kinds" : kinds
							},
							dataType: 'json',
							cache: false,
		
							//データ取得に成功した場合、最新の自己登録リストを取得
							success: function(data, status){
							//	console.log(data, status);
			
							},
							error: function(xhr, status, e){
							// console.info(xhr, status, e);
							}
						});
						$("#regi").html("登録完了しました！");
					});
				}
			});
	}
}
	

var listView = {

		//canvasの自己登録リストに表示する。適当です。
		listResult : function (result){
			var canvasViewHtml = '<ul class="ownlistview">';
			
			$.each(result,function(key,value){
				var location = value.location;
					canvasViewHtml += '<li>';
				    canvasViewHtml += '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
					canvasViewHtml += '<p class="txt12">' + location.comment + '</p></li>';
			});
			
			canvasViewHtml += '</ul>';
			//自己登録リストタブを作成後、id=viewlistで指定
			$("#viewlist").html(canvasViewHtml);
		},

		//canvasで最初に表示された際の自己登録リスト取得関数
		listRequest : function (callback) {
				var userID={};
			//viewerがオーナーの場合は、オーナーの会員IDでリクエストする。mosoオブジェクトにまとめる際に、if(moso.isOwner)で取得。
				//if(moso.isOwner){
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
						var url = 'http://ec2-174-129-93-227.compute-1.amazonaws.com/locations/'+userID;
				
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
				/*}else{
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
				}*/
		}
	}	

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
			var deferred = $.deferred();
			deferred.next(function(){
							view.buildMap()
			}).next(function(){
				view.request(view.buildMarkers)
			});
			deferred.call();
		},
		buildMap : function() {
			view.map = new GMap2(document.getElementById("viewMap"));
			var point = new GLatLng(36.03, 139.15);  
			view.map.addControl(new GLargeMapControl());	
			view.map.setCenter(point, 1);

			if (!moso.isOwner) return true;

			GEvent.addListener(view.map, 'click', function(overlay, point) {
				if (point) {
					x = point.x;
					y = point.y;

					windowHtml = '<p><a href="javascript:void(0);" onclick="">このポイントに登録する</a></p>';
					view.map.openInfoWindowHtml(point, windowHtml);
				}
			});
		},
		buildMarkers : function(result) {
			$.each(result, function(key, value) {
				var location = value.location;
			
				var point = new GLatLng(location.setX, location.setY);
				var marker = new GMarker(point);
				
				var windowHtml = '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
				windowHtml += '<p class="txt12">' + location.comment + '</p>';
				if (moso.isOwner) windowHtml += '<p class="txt12"><a href="javascript:void(0);" onclick="">このポイントに登録する</a></p>';
				GEvent.addListener(marker, 'click', function() {
					marker.openInfoWindowHtml(windowHtml);
					view.listRightPhoto(location, result);
				});		
				view.map.addOverlay(marker);
			});
		
		},
		listRightPhoto : function(location, result) {					
			$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');			
			$("#latestPhoto .comment").html(location.comment);

			var data = '<ul class="photos clears"></ul>';
			$("#viewPhotoList").html(data);

			$.each(result, function(key, value) {
				var location = value.location;
				$("#viewPhotoList .photos").append($("<li></li>").html('<img class="photo" src="' + location.setPhoto + '" />').click(function(){
					$("#latestPhoto .photo").html('<img src="' + location.setPhoto + '" />');			
					$("#latestPhoto .comment").html(location.comment);
				}));
				if (moso.isOwner) $("#viewRight .addButton").css({"display":"block"});
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
		
		var i=1;
		mediaitems.each(function(mediaitem) {
			data += '<li class="photo'+i+'">';
			data += '<img class="photo" src="' + mediaitem.getField(opensocial.MediaItem.Field.THUMBNAIL_URL) + '" /><br />'+mediaitem.getField(opensocial.MediaItem.Field.TITLE)+'</li>';
			i++;
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

var moso = {
	init : function(){
		tabs = new gadgets.TabSet(null,null,document.getElementById("tabs"));
		tabs.alignTabs("left",2);
		
		moso.whois();
		view.init();
		host.init();
		listView.listRequest(listView.listResult);
		
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
	},
	whois : function(){
		var req = opensocial.newDataRequest(); 
			req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer"); 
			req.send(function(data){
				var viewer = data.get("viewer").getData();
				if(viewer.isOwner()){
					moso.isOwner=1;
					moso.isViewer=0;
					// console.info(moso.isOwner);
					// console.info(moso.isViewer);
				}else{
					moso.isOwner=0;
					moso.isViewer=1;
					// console.info(moso.isOwner);
					// console.info(moso.isViewer);
				}
			})
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