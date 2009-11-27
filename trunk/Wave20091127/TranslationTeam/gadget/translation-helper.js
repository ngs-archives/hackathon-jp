function fireHoge() {
  window.alert("hoge");
  var state = wave.getState();
  delta = {};
  delta['hoge'] = $("#hoge").val();
  state.submitDelta(delta);
}
function renderState() {
  if (!wave.getState() || !wave.getViewer()) {
    return;
  }
  // update the field:
  var state = wave.getState();
  $("#hoge").val(state.get("hoge", ""));
}
function main() {
  $("#hogeButton").bind("click", fireHoge);
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);