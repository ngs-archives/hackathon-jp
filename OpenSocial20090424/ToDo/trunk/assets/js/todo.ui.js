;
var me;
var ListData = [];
var draggables = [];

var ToDoApp = {
    getHTML : function() {
       return [
        "<div id=\"dropzone\" style=\"width:100px;height:100px;background-color:lightgray;color:white\">TrashArea</div>",
          "<div id=\"navi\">",
          "<input type=\"button\" value=\"click\" onClick=\"ToDoApp.showInputArea()\" \/>",
          "<input type=\"button\" value=\"reset\" onClick=\"ToDoApp.resetToDoAppData()\" />",
        "<\/div>",
        "<div id=\"todo_input_area\" style=\"display:none;\">",
          "<form id=\"input_form\">",
            "<table>",
              "<tr>",
                "<td align=\"right\">toDo:<\/td>",
                "<td><input type=\"text\" id=\"input_title\" \/><\/td>",
              "<\/tr>",
              "<tr>",
                "<td colspan=\"2\"><input type=\"button\" value=\"add\" onClick=\"ToDoApp.addToDo();\" \/><\/td>",
              "<\/tr>",
            "<\/table>",
          "<\/form>",
        "<\/div>",
        "<form id=\"input_friends_form\">",
          "<div id=\"existfriendlist\"><\/div>",
          "<div id=\"friendlist\"><\/div>",
        "<\/form>",
        "<div id=\"todo_list_area\"><\/div>"
       ].join("");
    },
    init : function(){
        var req = opensocial.newDataRequest();
        req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.VIEWER), 'viewer');
        req.send( function( resp ){
            me = resp.get('viewer').getData();
            ToDoApp.loadAppData();
        });
    },
    loadAppData : function(){
        var cb = function(data){
            var a = data.get("viewer_data");
            var b = a.getData();
            var c = b[me.getId()];
       
            if(typeof c == 'undefined'){ return; } 
            
            var listdata = gadgets.json.parse( gadgets.util.unescapeString( c['ToDoList'] ));
            if( typeof listdata != 'undefined' && listdata instanceof Array){
                ListData = listdata;
            }
            
            var el = $('todo_list_area');
 
           for( i = 0; i < ListData.length; i++ ){

                //easy handle
                var handle_element = document.createElement('div');
                var handle_element_name = "drag_handle_" + i;
                handle_element.setAttribute("id", handle_element_name );
                handle_element.style.background = '#b8860b';
                handle_element.style.width = "30px";
                handle_element.appendChild( document.createTextNode( "＋" ) );
 
                var div_element = document.createElement('div');
                var sticky_name = "sticky_id_" + i;
                div_element.setAttribute("id", sticky_name);
                div_element.className = sticky_name;
                div_element.appendChild( ToDoApp.createSticky( ListData[i].title,i ) );

                var delete_link = document.createElement('a');
                delete_link.setAttribute("href","#");
                delete_link.num = i;
                delete_link.onclick = function(){ ToDoApp.deleteToDo( this.num ); }
                delete_link.appendChild( document.createTextNode("del") ); 
                div_element.appendChild( delete_link );
                div_element.appendChild( handle_element );

                el.appendChild( div_element );
                
                // draggable element
                var dragdrop_option = {
                    handle : handle_element_name, 
                    revert : false,
                    starteffect : function(){},
                    endeffect : function(){},
                };
                dad = new Draggable(sticky_name, dragdrop_option);
                draggables.push( sticky_name );
            }
            var droppable_options = { 
                accept : draggables, 
                onDrop : function( draggableElement, droppableElement, event ){
                            var matches = draggableElement.id.match(/sticky_id_([0-9]{1,})/);
                            if( matches ){
                                ToDoApp.deleteToDo( matches[1] );
                            }
                         }
            };    
            Droppables.add("dropzone", droppable_options );
            _IG_AdjustIFrameHeight(); 
        };
        var req = opensocial.newDataRequest();
        req.add(req.newFetchPersonAppDataRequest("VIEWER", "ToDoList"), "viewer_data");
        req.send(cb);
    },
    createSticky : function( text, index ){
        var textarea_element = document.createElement("textarea");
        var attrs = $H({cols:"25",rows:"3",id:"text_title" + index,"style":"background-color:#FFFF95;border:none;"});
        attrs.each( function( pair ){
            textarea_element.setAttribute(pair.key,pair.value);
        });
        textarea_element.value = text;
        textarea_element.num = index;  
        textarea_element.onchange = function(){ ToDoApp.editToDo( this.num ); } 
        return textarea_element;
    },
    editToDo : function( index ){
        var req = opensocial.newDataRequest();
        var t = new Date();
        var title_el_name = 'text_title'+index;
        var param = {
            title : $F(title_el_name),
            time : t
        };
        ListData.splice( index, 1, param );  
        var json_param = gadgets.json.stringify( ListData );
        req.add( req.newUpdatePersonAppDataRequest("VIEWER", "ToDoList", json_param));
        req.send( function( d ){
            if( d.hadError()){
                alert( " editToDo Error [index]" );
            }
            new Effect.Highlight(title_el_name,
                    {startcolor:'#9999ff',
                    endcolor:'#FFFF95',
                    duration: 3,
                    fps: 10,
                    delay: 0,
                    afterFinishInternal:ToDoApp.refreshListArea });
        });
    },
    deleteToDo : function( index ){
        var req = opensocial.newDataRequest();
        ListData.splice( index, 1 );
        var json_param = gadgets.json.stringify( ListData );
        
        req.add( req.newUpdatePersonAppDataRequest("VIEWER", "ToDoList", json_param));
        req.send( function( d ){
            if( d.hadError()){
                alert( " deleteToDo Error" );
            }
            new Effect.Fade( 'text_title'+index , { afterFinishInternal : ToDoApp.refreshListArea } );
        }); 
    },
    addToDo : function(){
        var req = opensocial.newDataRequest();
        if( ListData instanceof Array ){
            var t = new Date(); 
            var params = {
                title : $F('input_title'),
                time : t 
            };
            ListData.push( params );
            var json_param = gadgets.json.stringify( ListData );
            req.add(req.newUpdatePersonAppDataRequest("VIEWER", "ToDoList", json_param));
            req.send(function(data){
                if( data.hadError() ){
                    alert( "had Error add");
                    return;
                }
                ToDoApp.refreshListArea();
            });
        }else{
            alert( "aaaa ");
        }
    },
    resetToDoAppData : function(){
        var req = opensocial.newDataRequest();
        var dm = [];
        req.add( req.newUpdatePersonAppDataRequest("VIEWER", "ToDoList", gadgets.json.stringify( dm )));
        req.send( function( d ){
            if( d.hadError()){
                alert( "d" );
            }
            ToDoApp.refreshListArea(); 
        });
    },
    refreshListArea : function(){
        while( $('todo_list_area').firstChild ) $('todo_list_area').removeChild($('todo_list_area').firstChild);
        ToDoApp.loadAppData();
       
    },
    showInputArea : function(){
        ( $('todo_input_area').style.display != 'none' ) ? 
                new Effect.Fade('todo_input_area') : new Effect.Appear('todo_input_area',{ afterFinishInternal: _IG_AdjustIFrameHeight });
    },
    loadShareFriends : function(){
        var req = opensocial.newDataRequest();
        req.add( req.newFetchPersonAppDataRequest("VIEWER", "ShareFriends"), "viewer_data");
        req.send( function( data ){
            var a = data.get("viewer_data");
            var b = a.getData();
            var c = b[me.getId()];
            if( typeof c == 'undefined'){ return; }
            
            var shareFriendList = gadgets.json.parse( gadgets.util.unescapeString( c['ShareFriends']));
            if( typeof shareFriendList != 'undefined' && shareFriendList instanceof Array){
                var existFriendArea = $('existFriendArea');
                for( var i = 0; shareFriendList.length; i++ ){
                    existfriendlist.appendChild( document.createTextNode( shareFriendList[i] ));
                    existfriendlist.appendChild( document.createElement( 'br' ) );
                }
            }
        }); 
    },
    shareFriends : function(){
        var friendlist = [];
        var req = opensocial.newDataRequest();
        req.add(req.newFetchPeopleRequest(opensocial.DataRequest.Group.VIEWER_FRIENDS), 'viewerFriends');
        
        req.send( function( data ){
            if( data.hadError() ){
                alert( " friend error had error" );
            }
            var viewerFriends = data.get('viewerFriends').getData();
            var div_element = $('friendlist');
            while( $('friendlist').firstChild ) $('friendlist').removeChild($('friendlist').firstChild);
            
            viewerFriends.each( function( person ){
                var li = document.createElement("li");
                var chk = document.createElement("input");
                chk.setAttribute("type","checkbox");
                chk.setAttribute("id","input_friends");
                chk.value = person.getId();
                li.appendChild( chk );
                li.appendChild( document.createTextNode( person.getDisplayName()));  
                div_element.appendChild( li );
            });
        });
        
    },
    saveFriends : function(){
        alert( "aaaaa");
        var req = opensocial.newDataRequest();
        
        var share_friend_ids = [];
        //friend
        if( $('input_friends') ){
            $A($('input_friends_form').input_friends).find( function(v){
                if( v.checked ) share_friend_ids.push( v.value );
            });
        }else{
            alert("none");
        }
        var json_param = gadgets.json.stringify( share_friend_ids );
        req.add( req.newUpdatePersonAppDataRequest("VIEWER", "ShareFriends", json_param ));
        req.send( function( d ){
            if( d.hadError() ){
                alert( " share_friends had Error ");
            }
        });
    }
};
gadgets.util.registerOnLoadHandler(ToDoApp.init);
 
