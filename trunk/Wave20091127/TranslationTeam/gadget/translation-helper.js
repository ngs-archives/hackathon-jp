function hoge() {
  var state = wave.getState();
  delta = {};
  delta['hoge'] = $("#hoge").attr("value");
  state.submitDelta(delta);
}
function renderState() {
  if (!wave.getState() || !wave.getViewer()) {
    return;
  }
  // update the field:
  var state = wave.getState();
  $("#hoge").attr("value", state.get("hoge", ""));
}
function main() {
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);