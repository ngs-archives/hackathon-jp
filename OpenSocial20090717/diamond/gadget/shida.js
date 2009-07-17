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
    });
};

diamond.join = function() {
    cods.makeRequest('http://codess.heteml.jp/diamond/server/?owner_id=1111&user_id=2222&action=',
		     null,
		     function(data) {
			 console.log(data);
		     },
		     function() {
		     });
}