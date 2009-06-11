key_name = "data";

gadgets.util.registerOnLoadHandler(function(){
    var req = opensocial.newDataRequest();
    
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'owner');
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');
    
    // get data
    var keys = [key_name];
    var idspec_params = {};
    idspec_params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
    var idspec = opensocial.newIdSpec(idspec_params);
    var esc_params = {};
    esc_params[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = opensocial.EscapeType.NONE;
    req.add(req.newFetchPersonAppDataRequest(idspec, keys, esc_params), key_name);
    
    var ajp = new AjaxPages();
    req.send(function(res){
        // check viewer is owner
        var owner = res.get('owner').getData();
        var viewer = res.get('viewer').getData();
        var stored_data = res.get(key_name).getData();
        
        console.dir(stored_data);
        
        var user_obj = stored_data[owner.getId()];
        var obj = gadgets.json.parse(user_obj[key_name]);
        
        var param = {
            owner: owner,
            viewer: viewer,
            data: obj
        };
        
        if (owner.getId() == viewer.getId()) {
            ajp.load("/interviews/canvas_ownerIsViewer.html");
            var processor = ajp.getProcessor();
            $("#container").html(processor(param));
        }
        else {
            var now = new Date().getTime();
            var limit = obj["limit"];
            console.log("now:" + now + " limit:" + limit);
            if (now < limit) {
                ajp.load("/interviews/canvas_ownerIsNotViewerYokoku.html");
                var processor = ajp.getProcessor();
                $("#container").html(processor(param));
            }
            else {
                ajp.load("/interviews/canvas_ownerIsNotViewerHonban.html");
                var processor = ajp.getProcessor();
                $("#container").html(processor(param));
            }
        }
        gadgets.window.adjustHeight();
    });
});
