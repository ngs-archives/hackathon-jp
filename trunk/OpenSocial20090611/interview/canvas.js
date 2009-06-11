
gadgets.util.registerOnLoadHandler(function() {
    var req = opensocial.newDataRequest();
    
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'owner');
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');
    
    var ajp = new AjaxPages();
    req.send(function(data){
        // check viewer is owner or friend or ...
        var owner = data.get('owner').getData();
        var viewer = data.get('viewer').getData();
        
        if (owner.getId() == viewer.getId()) {
            ajp.load("/interviews/canvas_ownerIsViewer.html");
            var processor = ajp.getProcessor();
            $("#container").html(processor());
        }
        else {
            ajp.load("/interviews/canvas_ownerIsNotViewer.html");
            var processor = ajp.getProcessor();
            $("#container").html(processor());
        }
        gadgets.window.adjustHeight();
    });
});
//
///**
// * kamiya_gaget
// * This JavaScript file is for Canvas view.
// */
//var thisMonth = 4;
//
//var thisTodoNum = 0;
//
//var thisTodoNumKey = "month" + thisMonth + "_num";
//
//var maxTodoNum = 100;
//
//function init(){
//
//    var req = opensocial.newDataRequest();
//    
//    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'owner');
//    
//    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');
//    
//    var fparams = {};
//    
//    fparams[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
//    
//    fparams[opensocial.IdSpec.Field.GROUP_ID] = 'FRIENDS';
//    
//    var fidSpec = opensocial.newIdSpec(fparams);
//    
//    req.add(req.newFetchPeopleRequest(fidSpec), 'friends');
//    
//    var params = {};
//    
//    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
//    
//    var idSpec = opensocial.newIdSpec(params);
//    
//    var keys = [thisTodoNumKey];
//    
//    req.add(req.newFetchPersonAppDataRequest(idSpec, keys), 'stored');
//    
//    // get this mounth todo nums
//    
//    var obj = {};
//    
//    req.send(function(data){
//    
//        var stored = data.get('stored').getData();
//        
//        for (var id in stored) {
//        
//            obj = stored[id];
//            
//        }
//        
//        if (obj[thisTodoNumKey] != null) {
//        
//            thisTodoNum = obj[thisTodoNumKey];
//            
//        }
//        
//        else {
//        
//            thisTodoNum = 0;
//            
//        }
//        
//        // check viewer is owner or friend or ...
//        
//        var owner = data.get('owner').getData();
//        
//        var viewer = data.get('viewer').getData();
//        
//        // get and show owner's nickname
//        
//        var nameParams = {};
//        
//        nameParams[opensocial.DataRequest.DataRequestFields.ESCAPE_TYPE] = opensocial.EscapeType.NONE;
//        
//        var nickname = owner.getField(opensocial.Person.Field.NICKNAME, params);
//        
//        document.getElementById('owner_name').innerHTML += 'these are ' + nickname + '\'s future.';
//        
//        if (owner.getId() == viewer.getId()) {
//        
//            hiddenHappyButton();
//            
//        }
//        
//        else {
//        
//            var friends = data.get('friends').getData();
//            
//            var isFriendFlag = false;
//            
//            friends.each(function(friend){
//            
//                if (friend.getId() == viewer.getId()) {
//                
//                    isFriendFlag = true;
//                    
//                }
//                
//            });
//            
//            if (isFriendFlag == false) {
//            
//                hiddenHappyButton();
//                
//            }
//            
//        }
//        
//        gadgets.window.adjustHeight();
//        
//    });
//    
//}
//
//function addTodo(){
//
//    var tm = thisMonth;
//    
//    var ttn = thisTodoNum;
//    
//    var req = opensocial.newDataRequest();
//    
//    // add toto content
//    
//    var content = document.getElementById('todo_content').value;
//    
//    var appDataKey = "content" + thisMonth + "_" + ttn;
//    
//    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, appDataKey, content));
//    
//    // add todo flag 0 or 1
//    
//    var todoFlag = 0;
//    
//    var todoFlagKey = "check" + thisMonth + "_" + ttn;
//    
//    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, todoFlagKey, todoFlag));
//    
//    // add month4_num ++
//    
//    if (thisTodoNum < maxTodoNum) {
//    
//        var newTodoNum = Number(thisTodoNum) + 1;
//        
//        req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, thisTodoNumKey, newTodoNum));
//        
//    }
//    
//    else {
//    
//        alert("もう無理！");
//        
//        return false;
//        
//    }
//    
//    req.send(function(response){
//    
//        if (response.hadError()) {
//        
//            document.getElementById('result_appdata').innerHTML = response.getErrorCode();
//            
//        }
//        else {
//        
//            document.getElementById('result_appdata').innerHTML = '';
//            
//            // show new todo
//            
//            clearShowTodo();
//            
//            showTodoList();
//            
//        }
//        
//        gadgets.window.adjustHeight();
//        
//        init();
//        
//    });
//    
//}
//
//function clearShowTodo(){
//
//    var parent = document.getElementById('contents');
//    
//    for (var i = parent.childNodes.length - 1; i >= 0; i--) {
//    
//        parent.removeChild(parent.childNodes[i]);
//        
//    }
//    
//}
//
//function hiddenHappyButton(){
//
//    var fv = document.getElementById('friend_view');
//    
//    fv.style.display = 'none';
//    
//}
//
//function showTodoList(){
//
//    var tm = thisMonth;
//    
//    var req = opensocial.newDataRequest();
//    
//    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'owner');
//    
//    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'viewer');
//    
//    var params = {};
//    
//    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
//    
//    var idSpec = opensocial.newIdSpec(params);
//    
//    var keys = [];
//    
//    for (var i = 0; i < maxTodoNum; i++) {
//    
//        keys[i * 2] = "check" + tm + "_" + i;
//        
//        keys[i * 2 + 1] = "content" + tm + "_" + i;
//        
//    }
//    
//    req.add(req.newFetchPersonAppDataRequest(idSpec, keys), 'stored');
//    
//    req.send(function(data){
//    
//        var owner = data.get('owner').getData();
//        
//        var viewer = data.get('viewer').getData();
//        
//        var isOwnerFlag = false;
//        
//        if (owner.getId() == viewer.getId()) {
//        
//            isOwnerFlag = true;
//            
//        }
//        
//        // show stored data
//        
//        var stored = data.get('stored').getData();
//        
//        var isDataExist = false;
//        
//        var isChecked = false;
//        
//        for (var id in stored) {
//        
//            var obj = stored[id];
//            
//            for (var keyid in keys) {
//            
//                if (obj[keys[keyid]] != null) {
//                
//                    isDataExist = true;
//                    
//                    if (isOwnerFlag == true) {
//                    
//                        if (keyid % 2 == 0) {
//                        
//                            if (obj[keys[keyid]] == 1) {
//                            
//                                isChecked = true;
//                                
//                            }
//                            
//                            else {
//                            
//                                isChecked = false;
//                                
//                            }
//                            
//                        }
//                        
//                        else {
//                        
//                            if (isChecked == true) {
//                            
//                                document.getElementById('contents').innerHTML += '<li><input type="checkbox" onclick="checkTodo(' + String(keys[keyid]) + '); checked><span id=deco_' + keys[keyid] + '>' + obj[keys[keyid]] + '</span></li>';
//                                
//                            }
//                            
//                            else {
//                            
//                                document.getElementById('contents').innerHTML += '<li><input type="checkbox" onclick="checkTodo(' + String(keys[keyid]) + ');><span id=deco_' + keys[keyid] + '>' + obj[keys[keyid]] + '</span></li>';
//                                
//                            }
//                            
//                        }
//                        
//                    }
//                    
//                    else {
//                    
//                        if (keyid % 2 == 1) {
//                        
//                            document.getElementById('contents').innerHTML += '<li><span id=deco_' + keys[keyid] + '>' + obj[keys[keyid]] + '</span></li>';
//                            
//                        }
//                        
//                    }
//                    
//                }
//                
//            }
//            
//        }
//        
//        if (isDataExist == false) {
//        
//            document.getElementById('contents').innerHTML += '<li>今のままでは<br>' + nickname + 'は幸せになれない･･･。</li>';
//            
//        }
//        
//        gadgets.window.adjustHeight();
//        
//    });
//    
//}
//
//function checkTodo(todoId){
//
//    var tId = String(todoId);
//    
//    if (thisMonth < 10) {
//    
//        tId = tId.slice(13);
//        
//    }
//    
//    else {
//    
//        tId = tId.slice(14);
//        
//    }
//    
//    var req = opensocial.newDataRequest();
//    
//    var params = {};
//    
//    params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
//    
//    var idSpec = opensocial.newIdSpec(params);
//    
//    var todoFlagKeyName = "check" + thisMonth + "_" + tId;
//    
//    var todoContentKeyName = "deco_content" + thisMonth + "_" + tId;
//    
//    var keys = [todoFlagKeyName];
//    
//    req.add(req.newFetchPersonAppDataRequest(idSpec, keys), 'stored');
//    
//    // get this mounth todo nums
//    
//    var obj = {};
//    
//    var targetTodoFlag = 0;
//    
//    req.send(function(data){
//    
//        var stored = data.get('stored').getData();
//        
//        for (var id in stored) {
//        
//            obj = stored[id];
//            
//        }
//        
//        targetTodoFlag = obj[keys];
//        
//        if (targetTodoFlag == 0) {
//        
//            saveTodoFlag(todoId, 1);
//            
//            document.getElementById(todoContentKeyName).style.textDecoration = 'line-through';
//            
//            document.getElementById(todoContentKeyName).style.color = '#aaaaaa';
//            
//        }
//        
//        else {
//        
//            saveTodoFlag(todoId, 0);
//            
//            document.getElementById(todoContentKeyName).style.textDecoration = 'none';
//            
//            document.getElementById(todoContentKeyName).style.color = '#000000';
//            
//        }
//        
//        // 達成度の更新
//    
//    });
//    
//}
//
//function saveTodoFlag(todoId, value){
//
//    var tId = todoId;
//    
//    var val = value;
//    
//    var req = opensocial.newDataRequest();
//    
//    // add todo flag 0 or 1
//    
//    var todoFlagKey = "check" + thisMonth + "_" + tId;
//    
//    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, todoFlagKey, value));
//    
//    req.send(function(response){
//    
//        if (response.hadError()) {
//        
//            document.getElementById('result_appdata').innerHTML = response.getErrorCode();
//            
//        }
//        else {
//        
//            document.getElementById('result_appdata').innerHTML = '';
//            
//        }
//        
//        gadgets.window.adjustHeight();
//        
//    });
//    
//}
//
