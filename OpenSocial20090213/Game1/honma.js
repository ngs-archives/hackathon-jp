var socialquest = new Object();

// ============================================================================
socialquest.parsonSearchParams = new Object();
socialquest.parsonSearchParams[
	opensocial.DataRequest.PeopleRequestFields
] = [
    opensocial.Person.Field.ID,
    opensocial.Person.Field.NAME,
    opensocial.Person.Field.THUMBNAIL_URL,
    opensocial.Person.Field.PROFILE_URL,
    opensocial.Person.Field.CURRENT_LOCATION,
    opensocial.Person.Field.ADDRESSES,
    opensocial.Person.Field.ABOUT_ME,
    opensocial.Person.Field.STATUS,
    opensocial.Person.Field.GENDER,
    opensocial.Person.Field.RELATIONSHIP_STATUS,
    opensocial.Person.Field.LIVING_ARRANGEMENT,
    opensocial.Person.Field.LANGUAGES_SPOKEN,
    opensocial.Person.Field.JOB_INTERESTS,
    opensocial.Person.Field.INTERESTS,
    opensocial.Person.Field.URLS,
    opensocial.Person.Field.MUSIC,
    opensocial.Person.Field.MOVIES,
    opensocial.Person.Field.TV_SHOWS,
    opensocial.Person.Field.BOOKS,
    opensocial.Person.Field.ACTIVITIES,
    opensocial.Person.Field.SPORTS,
    opensocial.Person.Field.FOOD,
    opensocial.Person.Field.TURN_ONS,
    opensocial.Person.Field.TURN_OFFS,
    opensocial.Person.Field.ROMANCE,
    opensocial.Person.Field.FASHION,
    opensocial.Person.Field.HUMOR,
    opensocial.Person.Field.LOOKING_FOR,
    opensocial.Person.Field.RELIGION,
    opensocial.Person.Field.POLITICAL_VIEWS
];


( function(){
socialquest.Player = function (name, hp, sp){
    this.name = name;
    this.hp   = hp;
    this.sp   = sp;
};
socialquest.Player.prototype = {
};

socialquest.CharacterMaker = function (){};
socialquest.CharacterMaker.prototype = {
    make: function (p) {
        
        
    }
};

socialquest.recievedViewerData = function (data){
    if(data.hadError()){
        // 例外送出
        throw data.getErrorMessage();
    }
    var p = data.get("viewer").getData();
    alert(p.getId() + p.getDisplayName());
}

})();
// ============================================================================

gadgets.util.registerOnLoadHandler(
    function () {
        var req = opensocial.newDataRequest();
        req.add(
            req.newFetchPersonRequest(
                "VIEWER", socialquest.parsonSearchParams
            ), "viewer"
        );
        req.send(socialquest.recievedViewerData);
    }
);

