var socialquest = new Object();

// ============================================================================
( function(){
socialquest.Player = function (name, hp, sp){
    this.name = name;
    this.hp   = hp;
    this.sp   = sp;
};
Player.prototype = {
};

socialquest.CharacterMaker = function (){};
CharacterMaker.prototype = {
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
                "VIEWER"
            ), "viewer"
        );
        req.send(socialquest.recievedViewerData);
    }
);

