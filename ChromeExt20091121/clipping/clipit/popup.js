var BackGround = chrome.extension.getBackgroundPage();
var ClipitUtils = BackGround.ClipitUtils;
function set_clip(clip) {
  document.getElementById("poster_name").innerHTML = clip.name;
  document.getElementById("content").innerHTML = clip.content;
  document.getElementById("url").innerHTML = "<a href='" + clip.url + "' target='_blank'>" +
    clip.url + "</a>";
  ClipitUtils.set_last_datetime(clip.created);
}
function init() {
  var clip = ClipitUtils.get_clip();
  BackGround.console.log(clip);
  if (clip !== null) {
    set_clip(clip);
  }
}
