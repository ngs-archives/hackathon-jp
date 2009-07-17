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

function postRating(photoId, point) {
    var url = HOST_URL + '/photos/rating_update';
    var params = {};
    params.photo_id = photoId;
    params.rating_number = point;
    
    params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
	params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(params);    

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
        
        $("#photoRating .finished").css({'display':'block'});
    }, params);
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
						if(location_id){
							//フォーム各要素のデータを変数に格納
							var url = HOST_URL + '/locations';
							var post_params = {
										lng: $("#setX").val(),
										lat: $("#setY").val(),
										name: $(".place").val(),
										address: $(".address").val(),
										URL: $("#setPhoto").val(),
										comment: $("#comment").val(),
										kinds: $("#kinds").val(),
										mixi_id: hostUserID,
										rating_number: $("#rating").val(),
										rating_people : 1};

//							var post_params = {
//										setX: 125,
//										setY: 125,
//										name: "テスト名前",
//										address: "テスト住所",
//										setPhoto: "http://tests",
//										comment: "テストコメント",
//										kinds: 0,
//										rating_number: 3};

							var opt_params = {};
							//DBへアクセス
							opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
							opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
							opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
							opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
							opt_params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_params)

							gadgets.io.makeRequest(url, function(response){
					
							},opt_params);
						} else {
						
							var url = HOST_URL + '/photos';
							var post_params = {
										location_id: location_id,
										url: $("#setPhoto").val(),
										comment: $("#comment").val(),
										mixi_id: hostUserID,
										rating_number: $("rating").val(),
										rating_people : 2}
						
							var opt_params = {};
							//DBへアクセス
							opt_params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
							opt_params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
							opt_params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = 0;
							opt_params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
							opt_params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_params)

							gadgets.io.makeRequest(url, function(response){
					
							},opt_params);
						
						}
						//外部サーバーへajax通信をおこなう
						$("#regi").html("登録完了しました！");
					});
				}
			});
	}
}

var view = {
		map : {},
		userId : null,
		infoWindow : null,
		init : function() {
			view.buildMap()
			view.request();
			
			gadgets.window.adjustHeight(700);
		},
		buildMap : function() {
			var point = new google.maps.LatLng(36.03, 139.15);
			var myOptions = {
      			zoom: 5,
		      	center: point,
		      	scaleControl: true,
      			mapTypeId: google.maps.MapTypeId.ROADMAP
    		};
    		view.map = new google.maps.Map(document.getElementById("viewMap"), myOptions);

            //if (!moso.isOwner) return;
            
			//google.maps.event.addListener(view.map, 'rightclick', function(event) {
			google.maps.event.addListener(view.map, 'click', function(event) {
				if (event) {
					if (view.infoWindow) view.infoWindow.close();
				
					x = event.latLng.lng();
					y = event.latLng.lat();
					
					view.infoWindow = new google.maps.InfoWindow()
					view.infoWindow.set_position(event.latLng);
					var windowHtml = '<p><a href="javascript:void(0);" onclick="view.editPhoto(\''+ x +'\',\''+ y +'\');">このポイントに登録する</a></p>';
					view.infoWindow.set_content(windowHtml);
					view.infoWindow.open(view.map);
				}
			});
		},
		buildMarkers : function(result) {
		    if (view.infoWindow) view.infoWindow.close();
			$.each(result, function(key, value) {
				var location = value.location;
			
				var point = new google.maps.LatLng(location.setX, location.setY);
				var marker = new google.maps.Marker();
				marker.set_position(point);
				
				var windowHtml = '<h2 class="mtb0"><img src="' + location.setPhoto + '" /></h2>';
				if (moso.isOwner) windowHtml += '<p class="txt12"><a href="javascript:void(0);" onclick="view.editPhoto(\''+ location.setX +'\',\''+ location.setY +'\');">このポイントに登録する</a></p>';
				google.maps.event.addListener(marker, 'click', function() {
				    view.viewPhoto();
				    
				    $("#photoRating .star1").rating({callback: function(value,link){
				        var photoId = $("#ratingPhotoId").val();
				        if (!photoId) return;
				        postRating(photoId, value)
				    }});
				    
					var infoWindow = new google.maps.InfoWindow()
					infoWindow.set_position(point);
					infoWindow.set_content(windowHtml);
					infoWindow.open(view.map);

					view.listRightPhoto(location);
				});		
				marker.set_clickable(true);
				marker.set_visible(true);
				marker.set_map(view.map);
			});
		
		},
		listRightPhoto : function(location) {
console.log(location);		
            var photos = location.photos;

			$("#latestPhoto .photo").html('<img src="' + location.photos[0].setPhoto + '" />');			
			$("#latestPhoto .comment").html('<div class="form_line">' + location.photos[0].comment + '</div>');
			document.getElementById("ratingPhotoId").value = location.photos[0].id;			
			
			$("#latestPhoto .area_name .place").html(location.name);
			$("#latestPhoto .area_name .address").html(location.address);

			var data = '<ul class="photos clears"></ul>';
			$("#viewPhotoList").html(data);

			$.each(photos, function(key, photo) {
				$("#viewPhotoList .photos").append($("<li></li>").html('<img class="photo" src="' + photo.url + '" />').click(function(){
					document.getElementById("ratingPhotoId").value = photo.id;
					$("#latestPhoto .photo").html('<img src="' + photo.url + '" />');			
					if (photo.comment) $("#latestPhoto .comment").html('<div class="form_line">' + photo.comment + '</div>');
				}));
				if (moso.isOwner) $("#viewRight .addButton").css({"display":"block"});
			});
			
			$("#rightViewEditButton").click(function(){ view.editPhoto(location.setX,location.setY); });
		},
		request : function(url) {
			var url = HOST_URL + '/locations';
			var params = {};
			
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
				
				view.buildMarkers(result);
			}, params);
		},	
		editPhoto : function(x, y) {
			$("#editSection").css({ "display":"none" });			
			$("#viewSection").css({ "display":"block" });
			
			document.getElementById("setX").value = x;
			document.getElementById("setY").value = y;
			
			albumView.requestAlbums();
		},
		viewPhoto : function() {
			$("#firstSection").css({ "display":"none" });			
			$("#editSection").css({ "display":"block" });			
			$("#viewSection").css({ "display":"none" });
			
			document.getElementById("setX").value = '';
			document.getElementById("setY").value = '';
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
			req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner"); 
			req.send(function(data){
				moso.viewer = data.get("viewer").getData();
				moso.owner = data.get("owner").getData();
				//if(moso.viewer.isOwner()){
				if(moso.viewer.getId() == moso.owner.getId()){
					moso.isOwner=1;
					moso.isViewer=0;
				}else{
					moso.isOwner=0;
					moso.isViewer=1;
				}
			});
	},
	profileInit : function(){
		
	},
	homeInit : function(){
		
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