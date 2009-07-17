/**
* main.js
*/

//diamond
var diamond = {};


diamond.data = null;
diamond.lastData = null;

diamond.vars = {};


diamond.properties = {
    //"ownerId": 3333,
    "appServerUrl": "http://codess.heteml.jp/diamond/server/"
};


diamond.show_room_list = function() {
    var rooms = diamond.Room.findAll();
    console.log(rooms);

    room_html = '<ul>';
    $.each(rooms, function(index, room) {
	room_html += 
	    '<li>' + 
	    '<img  class="thumbnail_url" src="' + room.thumbnail_url + '" />' + 
            '<span class="nickname">'           + room.nickname + '</span>' + 
	    '<span>さん主催のゲーム</span>' + 
	    '<input type="button" value="参加" class="join_button" ' + 
                   'id="owner_' + room.owner_id + '" />' +
	    '</li>';
    });
    $('#room_list').html(room_html);
    $('.join_button').click(function() {
	var owner_id = this.id.match(/owner_([0-9]+)/)[1];
	diamond.join(owner_id);
    });
}

diamond.join = function(owner_id) {
    



    diamond.properties.ownerId = owner_id;
    cods.debug('game owner_id: ' + owner_id);
    
    
    
    diamond.owner_id = owner_id;
    cods.fetchViewerProfile(function(viewer) {
        diamond.viewer = viewer;
	console.log(viewer);
	var viewer_id     = viewer.getId();
	var nickname      = viewer.getDisplayName();
	var thumbnail_url = viewer.getField(
	    opensocial.Person.Field.THUMBNAIL_URL);
	var url = 'http://codess.heteml.jp/diamond/server/?' + 
            'owner_id='  + owner_id                 + '&' + 
	    'user_id='   + viewer_id                + '&' + 
            'name='      + encodeURI(nickname)      + '&' + 
            'thumb_url=' + encodeURI(thumbnail_url) + '&' + 
            'action=join';
	cods.makeRequest(url,
			 null,
			 function(game_status) {
			     diamond.show_waiting_room(game_status);
			 },
			 function() {
			 });
    });
}

diamond.show_waiting_room = function(game_status) {
    $('#room_list').hide();
    $('#waiting_room').show();
    console.log(game_status);

    if (game_status.gameStatus == 'waiting_answer') {
	$('#waiting_room').hide();
	$('#game_room').show();
        return diamond.init();
    }

    waiting_room_html = '<ul>';
    $.each(game_status.players, function(index, player) {
	waiting_room_html += 
	    '<li>' + 
	    '<img  class="thumbnail_url" src="' + player.thumbUrl + '" />' + 
            '<span class="nickname">'           + player.displayName + '</span>' + 
	    '</li>';
    });

    $('#waiting_room').html(waiting_room_html);

    setTimeout(diamond.refresh_waiting_room, 1000);
}

diamond.refresh_waiting_room = function() {
    console.log('refresh_waiting_room');
    var owner_id  = diamond.owner_id;
    var viewer_id = diamond.viewer.getId();
    var url = 'http://codess.heteml.jp/diamond/server/?' + 
        'owner_id=' + owner_id  + '&' + 
        'user_id='  + viewer_id + '&' + 
        'action=';
    cods.makeRequest(url,
                     null,
                     function(game_status) {
                         diamond.show_waiting_room(game_status);
                     },
                     function() {
                     });
};

diamond.initProfile = function() {
    cods.fetchOwnerProfile(
        function(data) {
            diamond.owner = {
                'id': data.getId(),
                'name': data.getDisplayName()
            };
            cods.debug('owner id: ' + diamond.owner.id);
        }
    );
    cods.fetchViewerProfile(
        function(data) {
            diamond.viewer = {
                'id': data.getId(),
                'name': data.getDisplayName()
            };
            cods.debug('viewer id: ' + diamond.viewer.id);
        }
    );
};



diamond.go = function() {
    cods.debug('go');
    
    dui.stopCountDown();

    var url = diamond.properties.appServerUrl
            + '?owner_id=' + diamond.properties.ownerId 
            + '&user_id=' + diamond.viewer.id
            + '&action=go';

    var params = {};
    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    gadgets.io.makeRequest(url, function(response) {
        diamond.lastData = diamond.data;
        diamond.data = response.data;
        diamond.update();
    }, params);
    
};


diamond.exit = function() {
    cods.debug('exit');

    dui.stopCountDown();
    
    var url = diamond.properties.appServerUrl
            + '?owner_id=' + diamond.properties.ownerId 
            + '&user_id=' + diamond.viewer.id
            + '&action=exit';

    var params = {};
    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    gadgets.io.makeRequest(url, function(response) {
        diamond.lastData = diamond.data;
        diamond.data = response.data;
        diamond.update();
    }, params);
    
};


diamond.init = function() {
    cods.debug('init');
    
    diamond.initProfile();
    
    diamond.vars.initProfileInterval = setInterval(function() {
        if (typeof diamond.owner == 'object' && typeof diamond.viewer == 'object') {
            clearInterval(diamond.vars.initProfileInterval);
            //$('.ownerName').html(diamond.owner.name);
            
            diamond.getStat();
            
            //diamond.vars.updateInterval = setInterval(diamond.getStat, 3000);
        }
    }, 100);

};


diamond.getStat = function() {
    var url = diamond.properties.appServerUrl + '?owner_id=' + diamond.properties.ownerId;

    cods.debug('getStat ' + url);
    
    var params = {};
    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    gadgets.io.makeRequest(url, function(response) {
        diamond.lastData = diamond.data;
        diamond.data = response.data;
        diamond.update();
    }, params);
};


diamond.update = function() {
    diamond.updatePlayers();
    diamond.updateCards();
    
    if (!diamond.lastData || diamond.data.road.cardNo != diamond.lastData.road.cardNo) {
        // 
        dui.startCountDown(diamond.exit);
    }
    
    if (diamond.lastData && diamond.data.roadNo != diamond.lastData.roadNo) {
        // 坑道が変わった
        cods.debug('change road');
        
        var html = '';
        if (typeof diamond.lastData.road.card == 'string') {
            // アクシデントで終わった
            html = diamond.lastData.road.card;
        }
        
        $('#road' + diamond.lastData.roadNo + ' .result').html(html)
        $('#road' + diamond.data.roadNo + ' .result').html('Now!');
    }
    
    if (!diamond.lastData) {
        $('#road1 .result').html('Now!');
    }
};


diamond.updatePlayers = function() {
    cods.debug('updatePlayers');

    $('#players').empty();
    
    for (i in diamond.data.players) {
        cods.debug('player ' + i);
        var html = '<div class="player" id="user_"' + i + '>'
                 + '<div class="thumb"><img class="thumbImg" src="' + diamond.data.players[i].thumbUrl + '" /></div>'
                 + '<div class="name">' + diamond.data.players[i].displayName + '</div>'
                 + '<div class="roadScore">' + diamond.data.players[i].roadScore + '</div>'
        $('#players').append(html)
    }
    
    $('#players').append('<br style="clear: both;" />');
};


diamond.updateCards = function () {
    cods.debug('updateCards');
    
    $('#cards').empty();
    
    for (i in diamond.data.road.drawCards) {
        cods.debug('card ' + i);
        $('#cards').append('<div id="card_"' + i + ' class="card">' + diamond.data.road.drawCards[i] + '</div>')

        if (typeof diamond.data.road.drawCards[i] == 'string') {
            $('#cards').append('<br style="clear: both;" />');
        }
    }
    
    
    if (diamond.data.road.card) {
        $('#card').html(diamond.data.road.card);
    }
    
}
