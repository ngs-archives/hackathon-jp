var myswitch = new Object();

myswitch = function() {
}

myswitch.prototype = {

    owner:		null,
    switches: null
}


myswitch.initialize = function() {

	
	// リクエストを作る
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    var param = {};
	param[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
	var idSpec = opensocial.newIdSpec(param);
	req.add(req.newFetchPersonAppDataRequest(idSpec, "*"), "viewer_data");
	req.send( function(res) {
	    var viewer = res.get("viewer").getData();
	    var data = res.get("viewer_data").getData()[viewer.getId()];
	    var data3 = parseInt(data[1003]);
	    
	    
	    debugger;
	});

			
	myswitch.switches = [{'name':'飲み会', 'id':'1001', 'status':0 },{'name':'カラオケ', 'id':'1002', 'status':0 },{'name':'合コン', 'id':'3', 'status':0 },{'name':'釣り', 'id':'4', 'status':0 },{'name':'バーベキュー', 'id':'5', 'status':0 },{'name':'カフェ', 'id':'100', 'status':0 },{'name':'映画', 'id':'2', 'status':0 },{'name':'野球', 'id':'6', 'status':0 },{'name':'花火', 'id':'7', 'status':0 },{'name':'ドライブ', 'id':'1003', 'status':0 },{'name':'ゴルフ', 'id':'1004', 'status':0 },{'name':'ダーツ', 'id':'1005', 'status':0 },{'name':'婚活', 'id':'1006', 'status':0 },{'name':'サーフィン', 'id':'1007', 'status':0 },{'name':'サッカー', 'id':'1008', 'status':0 },{'name':'焼き肉', 'id':'1009', 'status':0 },{'name':'ビアガーデン', 'id':'1010', 'status':0 },{'name':'キャンプ', 'id':'1011', 'status':0 },{'name':'海', 'id':'1', 'status':0 },{'name':'旅行', 'id':'200', 'status':0 }];
	

	for (var i = 0; i < myswitch.switches.length; i ++) {
		var item = myswitch.switches[i];
		var req = opensocial.newDataRequest();		
	    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, item.id, "0"), "key"+i);
    	req.send(function(data) {
		if (data.hadError()) {
			}
		});
	}
	
    getMySwitch(switches[0]);
    var myswitch = myswitch.switches[0];

}

myswitch.setSwitch = function(item){


}

myswitch.renderTable = function()
{
	var html;
	html = '<h1>inoueさんのスイッチ</h1>';
	
	for (var i = 0; i < myswitch.switches.length; i ++) {
	    html += myswitch.renderSwitch(myswitch.switches[i]);
	}		
	$('#container').html(html);

}

myswitch.renderSwitch = function(item)
{
	var html;
	html = '<div class="switch">';
	html += '<img class="switchon" id="switchon'+item.id+'" src="http://sandboxofgooglecode.googlecode.com/svn/trunk/images/switch_on.png" alt="on" />';
    html += '<img class="switchoff hidden" id="switchoff'+item.id+'" src="http://sandboxofgooglecode.googlecode.com/svn/trunk/images/switch_off.png" alt="on" />';
    
	html += '<p class="title">'+item.name+'</p>';
	html += '</div>';
	return html;
}


myswitch.renderDump = function(data)
{
	var dumper = new JKL.Dumper();
	$('#container').html(dumper.dump(data));
}


/*
myswitch.loadOwner = function() {
			debugger;
	// オーナーについてリクエストを作る
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner");

	//コールバックを含め送信
    req.send(function(res) {
		if (res.hadError()) {

		}
		else
		{	
		    myswitch.owner = res.get("owner").getData();
		    myswitch.renderTable();
		}
			debugger;
    });
}
*/


gadgets.util.registerOnLoadHandler(function() {

    var view = gadgets.views.getCurrentView().getName();
    
    if ( view == 'home' )
	{

	}
	else if ( view == 'profile' )
	{
	}
	else if ( view == 'canvas' )
	{
/* 	    myswitch.renderTable(); */
	    myswitch.initialize();
	    
   	    myswitch.renderTable();
		myswitch.init();

	}
});

myswitch.init = function() {
    
    $(".hidden").hide();
 
    // case switch is ON
    $(".switchon").click(function(){
        $(this).addClass("hidden").hide();
        var id = $(this).attr("id").replace("switchon","");
        $("#switchoff" + id).removeClass("hidden").show();
    });
    // case switch is OFF
    $(".switchoff").click(function(){
        $(this).addClass("hidden").hide();
        var id = $(this).attr("id").replace("switchoff","");
        $("#switchon" + id).removeClass("hidden").show();
    });
}

/*
myswitch.init = function () {
 
    //getMySwitch(switches[0]);
    var myswitch = myswitch.switches[0];
    var html = renderSwitch(myswitch);
    $("#container").html(html);
 
    $(".hidden").hide();
 
    myswitches[myswitch.id] = myswitch;
 
    // case switch is ON
    $(".switchon").click(function(){
        $(this).addClass("hidden").hide();
        var id = $(this).attr("id").replace("switchon","");
        $("#switchoff" + id).removeClass("hidden").show();
        setMySwitch(id, 0);
    });
    // case switch is OFF
    $(".switchoff").click(function(){
        $(this).addClass("hidden").hide();
        var id = $(this).attr("id").replace("switchoff","");
        $("#switchon" + id).removeClass("hidden").show();
        setMySwitch(id, 1);
    });
}
*/
 
function setMySwitch(id, status){
    var switchInfo = myswitches[id];
    switchInfo["status"] = status;
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, id, gadgets.json.stringify(switchInfo) ), "response");
    req.send(function(data) {
        if (data.hadError()) {
            var msg = data.getErrorMessage();
            // do something...
        } else {
            var response = data.get("response");
            if (response.hadError()) {
                var code = response.getErrorCode();
                // do something...
            } else {
                // do something...
                alert("added");
                getMySwitch(id);
            }
        }
    });
}
 
function getMySwitch(id){
    // get sample data
    var getReq = opensocial.newDataRequest();
    getReq.add(getReq.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    var params = {};
    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
    var idSpec = opensocial.newIdSpec(params);
    var escapeParams = {};
    escapeParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = opensocial.EscapeType.NONE;
    getReq.add(getReq.newFetchPersonAppDataRequest(idSpec, [id], escapeParams), "result");
    getReq.send(function(data){
        var viewer = data.get("viewer").getData();
        var myswitchData = data.get("result").getData()[viewer.getId()];
        //alert(myswitchData[id]);
        if( myswitchData[id] )
        {
            var myswitch = gadgets.json.parse(myswitchData[id]);
            alert(myswitch["name"] + " " + myswitch["status"]);
            //switch["status"] = myswitch["status"];
            //switch["name"] = myswitch["name"];
        }
    });
}
 
function renderSwitch(item){
       var html;
       html = '<div class="switch">';
       html += '<img class="switchon" id="switchon'+item.id+'" src="http://sandboxofgooglecode.googlecode.com/svn/trunk/images/switch_on.png" alt="on" />';
       html += '<img class="switchoff hidden" id="switchoff'+item.id+'" src="http://sandboxofgooglecode.googlecode.com/svn/trunk/images/switch_off.png" alt="on" />';
 
       html += '<p class="title">'+item.name+'</p>';
       html += '</div>';
       return html;
}