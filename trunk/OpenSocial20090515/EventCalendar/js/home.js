/**
 * Event Calendar
 * This JavaScript file is for Home view.
 */

function request() {
    var idspec = opensocial.newIdSpec({ "userId" : "OWNER", "groupId" : "FRIENDS" });
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "get_owner");
    req.add(req.newFetchPeopleRequest(idspec), "get_friends");
    req.send(response);
};


/**
 * レスポンス
 * 
 * @param {Object} dataResponse Friend information that was requested.
 */
function response(dataResponse) {
    var owner = dataResponse.get('get_owner').getData();
    var friends = dataResponse.get('get_friends').getData(); 

    var events = evtCal.dao.getEventsByOwerUserId("test");

    var html = 'イベント： ' + owner.getDisplayName();
    html += ':<br><ul>';

    alert(events[0].id+ events[0].title);

    jQuery.each(events, function(index, e) {
        html += '<li>' + e.id + ':' + e.title;
    });
    html += '</ul>';
    alert(html);

    $('#events').append(html);
};
