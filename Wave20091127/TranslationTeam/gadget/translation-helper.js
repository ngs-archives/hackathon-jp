function fireHoge() {
  var state = wave.getState();
  delta = {};
  var elm = document.getElementById("hoge");
  delta['hoge'] = elm.value;
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
  var elm = document.getElementById("hoge");
  elm.value = state.get("hoge", "");
}
function main() {
  console.log("main called");
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);