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
    closeDialog: function () {
      $("#clipit_dialog").dialog("close");
    },
    showDialog: function () {
      var scraped = scrape();
      var dialog_html =
	"<input type='button' value='Post' id='postButton'/>" +
	"<br />" +
	scraped +
        "<a href='"+ location.href + "'>" + location.href + "</a>" +
	"<br />";
      $("#clipit_dialog").html(dialog_html);
      $("#clipit_dialog").css({"text-align": "left"});
      $("#postButton").bind(
	"click",
	function()
	{
	  con.postMessage({clip: scraped, url: location.href});
	  $("#clipit_dialog").dialog("close");
	});
      $("#clipit_dialog").dialog("open");
    }
  };
};

$(document).ready(
  function(){
    $("body").append("<div id='clipit_dialog' style='display: none; text-align: left;'></div>");
    $("#clipit_dialog").dialog(
      {width: 600,
       bgiframe: true,
       autoOpen: false,
       resizable: false,
       modal: true,
       draggable: false,
       overlay: {
         opacity: 0.7,
         background: '#7ec244'
       }
      }
    );
    var connection = chrome.extension.connect();
    connection.onMessage.addListener(
      function(info, con){
	if (info.result === true) {
	  window.alert("succeeded");
	  $("#clipit_dialog").dialog("close");
        }
      }
    );
    var uiHandler = UIHandler(connection);
    $(document).bind('keydown', {combi:'Shift+p', disableInInput: true},
		     uiHandler.showDialog);
  }
);
