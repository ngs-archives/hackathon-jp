/**
 * Book Ringr
 * This JavaScript file is for Preview view.
 */
var value;

function init(){
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    
    var params = {};
    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    var idSpec = opensocial.newIdSpec(params);
    
    req.add(req.newFetchPersonAppDataRequest(idSpec, "value"), "data");
    req.send(function(response){
        var viewer = response.get("viewer").getData();
        if (viewer) {
            var data = response.get("data").getData()[viewer.getId()];
            value = 0;
            if (data && data["value"]) {
                value = Number(data["value"]);
            }
			
            alert("value: " + value);
        }
        else {
            alert("no install");
        }
    });
    
}

function onClick(){
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "value", ++value));
    req.send(function(response){
        alert(value)
    });
}


// TODO: Write the code for Preview view.
