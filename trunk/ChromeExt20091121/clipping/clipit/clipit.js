var UIHandler = function(con) {
  function scrape() {
    var selection = document.getSelection();
    if(selection.createRange) {
      var range = selection.createRange();
      var html = range.htmlText;
    } else {
      var range = selection.getRangeAt(selection.rangeCount - 1).cloneRange();
      var clonedSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(clonedSelection);
      var html = div.innerHTML;
    }
    return html;
  }
  return {
    showDialog: function () {
      var dialog_html =
	"<input type='button' value='Post' id='postButton'/>" +
	"<br />" +
	scrape() +
	"To: <select><option>emmy</option></select>" +
	"<br />" +
        "<a href='"+ location.href + "'>" + location.href + "</a>" +
	"<br />";
      $("#dialog").html(dialog_html);
      $("#dialog").css({"text-align": "left"});
      $("#postButton").bind(
	"click",
	function()
	{
	  $("#dialog").dialog("close");
	});
      $("#dialog").dialog("open");
    }
  };
};

$(document).ready(
  function(){
    var connection = chrome.extension.connect();
    connection.onMessage.addListener(
      function(info, con){
	console.log(info, con);
      }
    );
    var uiHandler = UIHandler(connection);
    $(document).bind('keydown', 'Shift+p', uiHandler.showDialog);
    $("body").append("<div id='dialog' style='display: none; text-align: left;'></div>");
    $("#dialog").dialog({width: 600,
			 bgiframe: true,
                         autoOpen: false,
                         resizable: false,
                         modal: true,
                         draggable: false,
                         overlay: {
                           opacity: 0.7,
                           background: '#7ec244'
                         }
			});
  }
);
