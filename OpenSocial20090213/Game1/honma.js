var socialquest = new Object();

// ============================================================================
( function(){

socialquest.parsonSearchParams = new Object();
socialquest.parsonSearchParams[
	opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS
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


function clone(obj) {
    var Class = new Function();
    Class.prototype = obj;
    return new Class();
}

socialquest.CharacterMaker = function (){};
socialquest.CharacterMaker.prototype = {
    _getJob: function (p){
        var loc = p.getField( opensocial.Person.Field.CURRENT_LOCATION );
        var latitude   = loc.getField( opensocial.Address.Field.LATITUDE );
        var longtitude = loc.getField( opensocial.Address.Field.LONGITUDE );
        if(latitude < 0 && longtitude < 0){
            return "南東";
        }else if(latitude > 0 && longtitude < 0){
            return "北東";
        }else if(latitude < 0 && longtitude > 0){
            return "南西";
        }else if(latitude > 0 && longtitude > 0){
            return "北西";
        }else{
            return "ど真ん中";
        }
    },

    make: function (p) {
        var person = clone(p);
        person.md5 = MD5_hash(p.getId());
        person.hp  = person.md5.charCodeAt(0);
        person.job = this._getJob(p);
        return person;
    }
};

socialquest.recievedViewerData = function (data){
    if(data.hadError()){
        // 例外送出
        throw data.getErrorMessage();
    }
    var viewer = data.get("viewer").getData();
    var maker = new socialquest.CharacterMaker();
    var p = maker.make(viewer);
    alert(p.getId() + p.getDisplayName());
//     alert(p.getField( opensocial.Person.Field.THUMBNAIL_URL ));
//     alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.LATITUDE ));
//     alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.LONGITUDE ));
//     alert(p.getField( opensocial.Person.Field.CURRENT_LOCATION )
//            .getField( opensocial.Address.Field.COUNTRY ));
    alert(p.hp);
    alert(p.job);
};

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
