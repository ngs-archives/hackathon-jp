function fireHoge() {
  var state = wave.getState();
  delta = {};
  delta['hoge'] = $("#hoge").val();
  console.log("submitting", delta);
  state.submitDelta(delta);
}
function renderState() {
  console.log("renderState called");
  if (!wave.getState() || !wave.getViewer()) {
    return;
  }
  // update the field:
  var state = wave.getState();
  $("#hoge").val(state.get("hoge", ""));
}
function main() {
  console.log("main called");
  $("#hogeButton").bind("click", fireHoge);
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);