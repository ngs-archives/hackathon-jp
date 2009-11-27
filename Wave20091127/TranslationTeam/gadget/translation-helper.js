function fireHoge() {
  var state = wave.getState();
  delta = {};
  var elm = document.getElementById("hoge");
  delta['path'] = elm.value;
  delta['requestType'] = 'REQUEST_PO';
  delta['language'] = 'ja';
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
  var data = JSON.parse(state.get("data"));
  console.log("data"+ data);
  console.log("status"+ state.get("status"));
  console.log("responseType"+ state.get("responseType"));
  elm.value = state.get("hoge", "");
}
function main() {
  console.log("main called");
  if (wave && wave.isInWaveContainer()) {
    wave.setStateCallback(renderState);
  }
}
gadgets.util.registerOnLoadHandler(main);