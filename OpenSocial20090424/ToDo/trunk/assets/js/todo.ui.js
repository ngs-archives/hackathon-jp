//
ToDoApp.ui = {
    getFriendsHTML : function(friendIDs, friendNames) {
        var text = '';
        text += '<div id="afriendlist">';
        for(i=0; i<friendNames.length; i++){
            text += '<div id="afriend">' + friendNames[i] + ' <input class="checkbox" type="checkbox" id="friend_visible_' + friendIDs[i] + '"> Visible';
        }
        text += '</div">';
        return text;
    },
    testgetFriendsHTML : function() {
        var howManyFriends = 3;
        var friendIDs = new Array(howManyFriends);
        friendIDs[0] = 'person0id';
        friendIDs[1] = 'person1id';
        friendIDs[2] = 'person2id';
        var friendNames = new Array(howManyFriends);
        friendNames[0] = 'person0';
        friendNames[1] = 'person1';
        friendNames[2] = 'person2';
        return ToDoApp.getFriendsHTML(friendIDs, friendNames);
    },
	getHTML : function() {
		// canvas view
		if(jQuery.gadgets.view().getName()=="canvas")
			return [
				"<div id=\"todo-canvas\" class=\"wrapper\">",
					"<div id=\"message\" style=\"display:none\"><\/div>",
					"<div id=\"stickies\"><\/div>",
					"<div id=\"pagenates\"><\/div>",
				"<\/div>"
			].join("");
		// home view
			return [
				"<div id=\"todo-module\" class=\"wrapper\">",
					"<div id=\"message\" style=\"display:none\"><\/div>",
					"<div id=\"stickies\"><\/div>",
					"<form id=\"control-form\">",
						"<div id=\"buttons\">",
							"<ul>",
								"<li><input type=\"button\" value=\"Friend\" onclick=\"ToDoApp.ui.friendsControl.show();\" \/><\/li>",
								"<li><input type=\"button\" value=\"Add\" onclick=\"ToDoApp.create();\" \/><\/li>",
							"<\/ul>",
						"<\/div>",
						"<div id=\"friends\" style=\"display:none;\">",
							"<ul><\/ul>",
							"<p class=\"save\"><input type=\"button\" value=\"Save\" onclick=\"ToDoApp.ui.friendsControl.hide();\" \/><\/p>",
						"<\/div>",
					"<\/form>",
				"<\/div>"
			].join("");
	},
    getCanvasHTML : function( friendList ){
        var html = '';
        
        for( var i = 0; i < friendList.length; i++ ){
            var data = friendList[i];
            html += '<div style="width:100px;height:100px;background-color:lightgray;">';
            html += '<p>' + data.person.getDisplayName() + '</p>';
            for( var j = 0; j < data.stickies.length; j++ ){
                html += ToDoApp.ui.getSticky( j, data.stickies[j], false );
            }
            html += '</div>';   
        }
        return html;
    },
	friendsControl : {
		show : function() {
			$j("#friends").css("display","block");
		},
		hide : function() {
			$j("#friends").css("display","none");
		}
	},
	message : {
		show : function(msg) {
			$j("#message").css("display","block");
			$("message").innerHTML = msg;
		},
		hide : function() {
			$j("#message").css("display","none");
			$("message").innerHTML = "";
		}
	},
	list : {
		getHTML : function(d) {
			if(!d||!d.length) return "";
			var ht = [];
			for(var i=0;i<d.length;i++) {
				ht.push(ToDoApp.ui.getSticky(i,d[i],true));
			}
			return ht.join("");
		}
	},
	getSticky : function(id,text, edit) {
		text = text || "";
		ToDoApp.data.stickies = ToDoApp.data.stickies || [];
		if(isNaN(id)) id = ToDoApp.data.stickies.length;
		
        if( edit ){
            return [
			    "<div class=\"sticky\">",
				    "<textarea onchange=\"ToDoApp.data.save()\" rows=\"3\" cols=\"25\" style=\"background-color:#FFFF95;border:none;\">", text, "<\/textarea>",
				    "<span class=\"del\" onclick=\"ToDoApp.remove(this);\">X<\/span>",
			    "<\/div>"
		    ].join("");
        }else{
            return [
			    text,"</br>"
            ].join("");
        }
        
	}
}

