/**
 * Event Calendar
 * This JavaScript file is for Canvas view.
 */

function init() {
    // TODO: Write the code for initializing.
    
	var tabSet = new gadgets.TabSet();
	
	tabSet.addTab("List");
	
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(
              opensocial.IdSpec.PersonId.OWNER),
            "owner");
    req.send(handleRequestMe);
}

function handleRequestMe(data) {
	  var owner = data.get("owner");
	  if (owner.hadError()) {
	    //Handle error using viewer.getError()...
	    return;
	  }

	  var person = owner.getData();
	  var id = person.getId();
	  
	  var events = ec_data.dao.getEventsByOwerUserId(id);
	  
	  //No error. Do something with viewer.getData()...
	  
	  //table 
	  var tbl = "";
		  
	  tbl += "<table border=\"1\"><tbody>";
	  tbl += "<tr>";
	  tbl += "<td>id</td>";
	  tbl += "<td>title</td>";
	  tbl += "<td>creator</td>";
	  tbl += "<td>participants_count</td>";
	  tbl += "<td>status</td>";
	  tbl += "<td>entries_count</td>";
	  tbl += "</tr>";
		          
	  jQuery.each(events, function(idx, event) {
		  tbl += "<tr>";
		  tbl += "<td><a href=\"javascript:view_detail(" + event.id + ");\">" + event.id + "</a></td>";
		  tbl += "<td>" + event.title + "</td>";
		  tbl += "<td>" + event.creator.nickname + "</td>";
		  tbl += "<td>" + event.participants.length + "</td>";
		  tbl += "<td>" + ec_data.status.CREATING + "</td>";
		  tbl += "<td>" + event.entries.length + "</td>";
		  tbl += "</tr>";
	  });

	  tbl += "</tbody></table>";
	  
	  $("#main").append(tbl);
}

function view_detail(event_id) {

	  var event = ec_data.dao.getEventById(event_id);
	  
	  //table 
	  var tbl = "";
		  
	  tbl += "<table border=\"1\"><tbody>";
		          
	  tbl += "<tr><td>id</td><td>" + event.id + "</td></tr>";
	  tbl += "<tr><td>title</td><td>" + event.title + "</td></tr>";
	  tbl += "<tr><td>creater</td><td>" + event.creator.nickname + "</td></tr>";
	  tbl += "<tr><td>participants</td><td>" + event.participants.length + "</td></tr>";
	  tbl += "<tr><td>status</td><td>" + ec_data.status.CREATING + "</td></tr>";
	  
	  tbl += "</tbody></table>";

	  tbl += "<table border=\"1\"><tbody>";

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
	  
	  $("#detail").empty();
	  $("#detail").append(tbl);
}

// TODO: Write the code for Canvas view.
