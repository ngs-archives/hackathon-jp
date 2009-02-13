socialquest.recievedHenseiData = function (data){
    if(data.hadError()){
        // 例外送出
        throw data.getErrorMessage();
    }
    var viewer = data.get("viewer").getData();
    var maker = new socialquest.CharacterMaker();
    var p = maker.make(viewer);

    var thumb = p.getField( opensocial.Person.Field.THUMBNAIL_URL );
    $("#hp"  ).html(p.hp);
    $("#job" ).html(p.job);
    $("#name").html(p.getDisplayName());
    $("#photo").html('<img src="' + thumb + '">');

//    alert(p.getId() + p.getDisplayName());
//    alert(p.getField( opensocial.Person.Field.THUMBNAIL_URL ));
//    alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.LATITUDE ));
//    alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.LONGITUDE ));
//    alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.COUNTRY ));
//    alert(p.hp);
//    alert(p.job);
};

})();

gadgets.util.registerOnLoadHandler(
    function () {
		var params = {};
		params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
		params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
		params[opensocial.IdSpec.Field.NECTWORK_DISTANCE] = 1;
		var idSpec = opensocial.newIdSpec(params);

		var req = opensocial.newDataRequest();
        req.add(
            req.newFetchPeopleRequest(
                idSpec, socialquest.parsonSearchParams
            ), "viewer"
        );
        req.send(socialquest.recievedHenseiData);
    }
);
