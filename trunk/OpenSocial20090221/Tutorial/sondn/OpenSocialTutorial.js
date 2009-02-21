function onLoadFriends(data) {
  var viewer = data.get('viewer').getData();
  var viewerFriends = data.get('viewerFriends').getData();

  html = new Array();
  html.push('<select id="person">');
  viewerFriends.each(function(person) {
    if (person.getId()) {
      html.push('<option value="', person.getId(), '">', person.getDisplayName(), '</option>');
    }
  });
  html.push('</select>');
  document.getElementById('friends').innerHTML = html.join('');
}

var globalGivenGifts = {};

function giveGift() {
  var nut = document.getElementById('nut').value;
  var friend = document.getElementById('person').value;

  givenGifts[friend] = nut;
  var json = gadgets.json.stringify(givenGifts);

  var req = opensocial.newDataRequest();
  req.add(req.newUpdatePersonAppDataRequest("VIEWER", 'gifts', json));
  req.send();
}

var globalGiftList = ['a cashew nut', 'a peanut', 'a hazelnut', 'a red pistachio nut'];

function makeOptionsMenu() {
  var html = new Array();
  html.push('<select id="nut">');
  for (var i = 0; i < globalGiftList.length; i++) {
    html.push('<option value="', i, '">', globalGiftList[i], '</option>');
  }
  html.push('</select>');
  document.getElementById('gifts').innerHTML = html.join('');
}

function init() {
  loadFriends();
  makeOptionsMenu();
}
