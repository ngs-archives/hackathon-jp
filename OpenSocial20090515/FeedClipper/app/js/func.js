/**
 *対象の値が空かチェックする("", null, undefind)
 *
 * @param val チェック対象の値
 *
 * @return 空ならtrue 空では無ければfalse
 **/
function empty(val)
{
    var flag = false;
	if(val == "" || val == undefined || val == null)
    {
		flag = true;
    }
	return flag;
}


//ユーザデータを取得する
function getUserData()
{
	var user_data = {};
	
	var request = opensocial.newDataRequest();
    request.add(request.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer_data");
	request.send(function (response) 
			     {
                     var item = response.get("viewer_data");
                     
					 //エラー時
					 if (item.hadError()) 
					 {
	
            			// エラー処理。item.getError() で詳細情報を取得
            			return;
        			 }

					// 実行ユーザのプロフィールを参照
        			var person = item.getData();
        			user_data.nickname = person.getDisplayName();
        			user_data.icon     = person.getField(opensocial.Person.Field.THUMBNAIL_URL);
        			user_data.url      = person.getField(opensocial.Person.Field.PROFILE_URL);
    });
	return user_data;
}

//マイミクを取得する
function getMyFriends()
{
	var arrFriends = new Array();
	
	var param = {};
	param[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
	param[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
	var idSpec = opensocial.newIdSpec(param);
	
	var request = opensocial.newDataRequest();
	request.add(request.newFetchPeopleRequest(idSpec), "friends_data");
	request.send(function (response) 
	             {
				 	 var item = response.get("friends_data");
					 
					 //エラー時
					 if (item.hadError()) 
					 {

            			// エラー処理。item.getError() で詳細情報を取得
            			return;
        			 }
					 
					 //マイミクのコレクションを返す
        			 var people = item.getData();
					 
					 //マイミクがいたらパースする
					 if(people.size() > 0)
					 {
						 people.each(function (person) 
						 {
							    var f = {};
							 
                				//IDの取得
                				f.id = person.getId();
                				//ニックネームの取得
                				f.nickname = person.getDisplayName();
                				//プロフィールURLの取得
                				f.prourl = person.getField(opensocial.Person.Field.PROFILE_URL);
                				//サムネイルURLの取得
                				f.thumurl = person.getField(opensocial.Person.Field.THUMBNAIL_URL);
		
								//取得後配列に格納
								arrFriends[arrFriends.length - 1] = f;
					 	});
					 }
				 });
	return arrFriends;
}