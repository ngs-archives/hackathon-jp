function hoge() {
  var state = wave.getState();
  delta = {};
  var elm = document.getElementById("hoge");
  delta['hoge'] = elm.value;
  state.submitDelta(delta);
}
function renderState() {
  if (!wave.getState() || !wave.getViewer()) {
    return;
  }
  // update the field:
  var state = wave.getState();
  var elm = document.getElementById("hoge");
  elm.value = state.get("hoge", "");
}
function main() {
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);