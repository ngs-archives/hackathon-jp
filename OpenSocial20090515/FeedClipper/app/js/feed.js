//API用のマスターURL
var MASTER_URL = "http://api-proxy.fushihara.net/";

/**
  *投稿を登録する
  *
  **/
function regist()
{
	//URLの値を取得する
	var url = $("#url").val();
	
	
	//URLの書式チェック
	var res = url.match(/(http|ftp|https):\/\/.+/);
	
	//nullチェック
	if(empty(url))
	{
	
	}
	//書式チェック
	else if(!res)
	{

	}
	//URLにエラーがない場合
	else
	{
		//テキストを取得する
		var txt = $("#content").val();
	
		var post_data = {"url" : url, "text" : txt};
	
		var params = {};
	    params[gadgets.io.RequestParameters.METHOD]       = gadgets.io.MethodType.POST;
   	 	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;					
		params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_data);
		params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
		
		gadgets.io.makeRequest(MASTER_URL, 
			function(response) 
			{
				var err = response.error;
				var data = response.data;
				
				if(!empty(err))
				{

				}
				else
				{
					
				var html = '<table border="1"><tr><td><table><tr><td>'+ user_data.nickname +'<td></tr><tr><td><img src="' + user_data.icon  + '" /><td></tr></table></td><td><table><tr><td>'+data.html+'</td></tr></table></td></tr></table>';
					
					var pre = $("#view").html();
					$("#view").html(html + pre);
					
					$("#content").val("");
					$("#url").val("");
				}
			}, params);
	}
}
