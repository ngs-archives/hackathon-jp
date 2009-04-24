/**
 * kamiya_gaget
 * This JavaScript file is for Canvas view.
 */

function init() {
    // TODO: Write the code for initializing.
}

// TODO: Write the code for Canvas view.



function shareData() {
  var content = document.getElementById('content2').value;
  var req = opensocial.newDataRequest();
  req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, 'content3', content));
  req.send(function(response) {
    if (response.hadError()) {
      document.getElementById('result_appdata').innerHTML = response.getErrorCode();
    } else {
      document.getElementById('result_appdata').innerHTML = 'Succeeded!';
    }
    gadgets.window.adjustHeight();
  });
}

function fetchFriendData() {
  var req = opensocial.newDataRequest();
  var params = {};
  params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
  params[opensocial.IdSpec.Field.GROUP_ID] = 'FRIENDS';
  var idSpec = opensocial.newIdSpec(params);
  req.add(req.newFetchPersonAppDataRequest(idSpec, ['content']), 'stored');
  req.send(function(data) {
    var stored = data.get('stored').getData();
    for(var id in stored) {
      var obj = stored[id];
      document.getElementById('contents').innerHTML
          += '<li>' + id + ': ' + obj['content'] + '</li>';
    }
    gadgets.window.adjustHeight();
  });
}
function fetchOwnerData() {
  var req = opensocial.newDataRequest();
  var params = {};
  params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
//  params[opensocial.IdSpec.Field.GROUP_ID] = 'FRIENDS';
  var idSpec = opensocial.newIdSpec(params);

  var keys = ["content","content2","content3"];
  req.add(req.newFetchPersonAppDataRequest(idSpec, keys), 'stored');
  req.send(function(data) {
    var stored = data.get('stored').getData();

    for(var id in stored) {
      var obj = stored[id];

//      alert(obj["content"]);
//      alert(obj["content2"]);

      for(var keyid in keys) {
        alert(keys[id]);
        document.getElementById('contents').innerHTML
            += '<li>' + obj[keys[keyid]] + '</li>';
      }
    }
    gadgets.window.adjustHeight();
  });
}
