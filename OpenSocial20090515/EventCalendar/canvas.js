/**
 * Event Calendar
 * This JavaScript file is for Canvas view.
 */

function init() {
    // TODO: Write the code for initializing.
    
	var tabSet = new gadgets.TabSet();
	
	tabSet.addTab("イベントを確認する", { contentContainer: document.getElementById("view") } );
	tabSet.addTab("新しいイベントを登録する", { contentContainer: document.getElementById("register") } );
	
	_set_register_form();
	
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(
              opensocial.IdSpec.PersonId.OWNER),
            "owner");
    req.send(handleRequestMe);
}

function _set_register_form() {

	var tbl = "";
	
	  tbl += "<form>";
	  tbl += "タイトル<br /><input id=\"register_title\" type=\"text\" name=\"title\" /><br />";
	  tbl += "コメント<br /><textarea id=\"register_comment\"  name=\"comment\"></textarea><br />";
	  tbl += "<input id=\"register_submit\" type=\"button\" name=\"submit\" value=\"投稿 />";
	  tbl += "</form>";

	  $("#register").append(tbl);

	  $("#register_submit").click( function() {
		$("#register_content").value;
		$("#register_comment").value;
		
		//createEntry
		//addEntry
		
	  });
}
function handleRequestMe(data) {
	  var owner = data.get("owner");
	  if (owner.hadError()) {
	    //Handle error using viewer.getError()...
	    return;
	  }

	  var person = owner.getData();
	  var id = person.getId();
	  
	  var events = evtCal.dao.getEventsByOwerUserId(id);
	  
	  //No error. Do something with viewer.getData()...
	  
	  //table 
	  var tbl = "";
		  
	  tbl += "<table class=\"tbl_event\">";
	  tbl += "<thead><tr>";
	  tbl += "<td>件名</td>";
	  tbl += "<td>作成者</td>";
	  tbl += "<td>現在の参加者数</td>";
	  tbl += "<td>状態</td>";
	  tbl += "<td>投稿数</td>";
	  tbl += "</tr></thead>";
		          
	  tbl += "<tbody>";
	  
	  jQuery.each(events, function(idx, event) {
		  tbl += "<tr>";
		  tbl += "<td><a href=\"javascript:view_detail(" + event.id + ");\">" + event.title + "</a></td>";
		  tbl += "<td>" + event.creator.nickname + "</td>";
		  tbl += "<td>" + event.participants.length + "</td>";
		  tbl += "<td>" + evtCal.status.CREATING + "</td>";
		  tbl += "<td>" + event.entries.length + "</td>";
		  tbl += "</tr>";
	  });

	  tbl += "</tbody></table>";

	  tbl += "<div id=\"detail\"></div>";

	  $("#view").append(tbl);
}

function view_detail(event_id) {

	  var event = evtCal.dao.getEventById(event_id);
	  
	  //table 
	  var tbl = "";
		  
	  tbl += "<table class=\"tbl_event\"><tbody>";
		          
	  tbl += "<tr><td>件名</td><td>" + event.title + "</td></tr>";
	  tbl += "<tr><td>作成者</td><td>" + event.creator.nickname + "</td></tr>";
	  tbl += "<tr><td>参加者</td><td>" + event.participants.join("、") + "</td></tr>";
	  tbl += "<tr><td>状態</td><td>" + evtCal.status.CREATING + "</td></tr>";
	  
	  tbl += "</tbody></table>";

	  tbl += "<table class=\"tbl_event\"><tbody>";

	  tbl += "<tr><td>投稿:" + event.entries.length + "件</td></tr>";
	  
	  jQuery.each(event.entries, function(idx, entry) {
		  tbl += "<tr>";
		  tbl += "<td>" + entry.type + "</td>";
		  tbl += "<td>" + entry.user.nickname + "</td>";
		  tbl += "<td>" + entry.postedAt + "</td>";
		  tbl += "<td>" + entry.content + "</td>";
		  tbl += "</tr>";
		  
		  tbl += "<tr colspan=\4\>";
		  tbl += "<td>" + entry.comment + "</td>";
		  tbl += "</tr>";
	  });

	  tbl += "</tbody></table>";

	  tbl += "<form>タイプ<br />";
	  tbl += "<input class=\"detail_type\" type=\"radio\" name=\"type\" value=\"what\"/>何を";
	  tbl += "<input class=\"detail_type\"   type=\"radio\" name=\"type\" value=\"when\"/>いつ";
	  tbl += "<input class=\"detail_type\"   type=\"radio\" name=\"type\" value=\"where\"/>どこで<br />";
	  tbl += "きめたこと<br /><input id=\"detail_content\" type=\"text\" name=\"content\" /><br />";
	  tbl += "コメント<br /><textarea id=\"detail_comment\"  name=\"comment\"></textarea><br />";
	  tbl += "<input id=\"detail_submit\" type=\"button\" name=\"submit\" value=\"投稿 />";
	  tbl += "</form>";

	  $("#detail").empty();
	  $("#detail").append(tbl);

	  $("#detail_submit").click( function() {
		$(".detail_type").value;
		$("#detail_content").value;
		$("#detail_comment").value;
		
		//createEntry
		//addEntry
		
	  });

	  gadgets.window.adjustHeight();
}

// TODO: Write the code for Canvas view.
