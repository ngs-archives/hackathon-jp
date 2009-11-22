function M(count){
  if (count >= 100000) {
    return String(count/1000).slice(0, 3) + "k";
  } else if (count >= 10000) {
    return String(count/1000).slice(0, 2) + "k";
  } else {
    return String(count);
  }
}

var ClipitConfig = {
  display_name: '',
  board: '',
  last_datetime: '',
  clips: []
};

var ClipitUtils = {
  get_board:function() {
    return ClipitConfig.board;
  },
  set_board:function(board) {
    ClipitConfig.board = localStorage.board = board;
    ClipitConfig.clips = localStorage.clips = [];
    ClipitConfig.last_datetime = localStorage.last_datetime = '';
  },
  get_display_name:function() {
    return ClipitConfig.display_name;
  },
  set_display_name:function(name) {
    ClipitConfig.display_name = localStorage.display_name = name;
  },
  get_last_datetime:function() {
    return ClipitConfig.last_datetime;
  },
  set_last_datetime:function(datetime) {
    ClipitConfig.last_datetime = localStorage.last_datetime = datetime;
  },
  get_clips:function() {
    return ClipitConfig.clips;
  },
  set_clips:function(clips) {
    ClipitConfig.clips = localStorage.clips = clips;
    chrome.browserAction.setBadgeText(
      {text: M(ClipitConfig.clips.length)}
    );
  },
  get_clip:function() {
    if (ClipitConfig.clips.length > 0) {
      ret = ClipitConfig.clips.shift();
      chrome.browserAction.setBadgeText(
	{text: M(ClipitConfig.clips.length)}
      );
      return ret;
    } else {
      return null;
    }
  }
};

if (window.localStorage) {
  if (!localStorage.display_name) {
    localStorage.display_name = ClipitConfig.display_name;
  } else {
    ClipitConfig.display_name = localStorage.display_name;
  }
  if (!localStorage.board) {
    localStorage.board = ClipitConfig.board;
  } else {
    ClipitConfig.board = localStorage.board;
  }
  if (!localStorage.last_datetime) {
    localStorage.last_datetime = ClipitConfig.last_datetime;
  } else {
    ClipitConfig.last_datetime = localStorage.last_datetime;
  }
  if (!localStorage.clips) {
    localStorage.clips = ClipitConfig.clips;
  } else {
    ClipitConfig.clips = localStorage.clips;
  }
}

chrome.self.onConnect.addListener(function(port,name) {
  port.onMessage.addListener(function(info,con){
    if (info.clip) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function(){
        if (req.readyState == 4 && req.status == 200) {
          console.log(req.responseText);
          data = JSON.parse(req.responseText);
          if (data.result == true) {
            con.postMessage(data);
          }
        }
      };
      var url = "http://clip-it.appspot.com/post_clip";
      req.open('POST', url);
      req.setRequestHeader('Content-Type',
                           'application/x-www-form-urlencoded');
      data = {name: ClipitConfig.display_name,
              board: ClipitConfig.board,
              clip: info.clip,
              url: info.url};
      req.send("data="+ encodeURIComponent(JSON.stringify(data)));
    }
  });
});

function fetch_clips() {
  console.log("fetch_clips called");
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if (req.readyState == 4 && req.status == 200) {
      console.log(req.responseText);
      ClipitUtils.set_clips(JSON.parse(req.responseText));
    }
  };
  var url = "http://clip-it.appspot.com/get_clips";
  req.open('POST', url);
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  data = {board: ClipitUtils.get_board(),
	  datetime: ClipitUtils.get_last_datetime()
	 };
  req.send("data="+ JSON.stringify(data));
  setTimeout(fetch_clips, 60000);
}

fetch_clips();