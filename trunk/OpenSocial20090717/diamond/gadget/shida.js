var diamond = {};

diamond.page = 'start';


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
    
    cods.fetchViewerProfile(function(viewer) {
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
			     diamond.show_room(game_status);
			 },
			 function() {
			 });
    });
}

diamond.show_room = function(game_status) {
    

}