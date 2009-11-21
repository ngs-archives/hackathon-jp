var clicktime = new Date();

function jikoku() {
    document.F1.T1.value = clicktime.toLocaleString();
    window.setTimeout("jikoku()", 300);
}

chrome.tabs.onUpdated.addListener( function(tabid , changeinfo, tab){
   clicktime.getDate();
});
