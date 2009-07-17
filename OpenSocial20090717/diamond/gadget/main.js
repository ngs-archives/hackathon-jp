/**
* main.js
*/

//diamond
var diamond = {};


diamond.data = null;
diamond.lastData = null;

diamond.vars = {};


diamond.properties = {
    "ownerId": 3333,
    "appServerUrl": "http://codess.heteml.jp/diamond/server/"
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
            
            diamond.vars.updateInterval = setInterval(diamond.getStat, 3000);
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
        dui.startCountDown(diamond.exit);
    }
};


diamond.updatePlayers = function() {
    cods.debug('updatePlayers');

    $('#players').empty();
    
    for (i in diamond.data.players) {
        cods.debug('player ' + i);
        var html = '<div class="player" id="user_"' + i + '>'
                 + '<div class="thumb"><img class="thumbImg" src="' + diamond.data.players[i].thumbUrl + '" /></div>'
                 + '<div class="name">' + diamond.data.players[i].name + '</div>'
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
    
}