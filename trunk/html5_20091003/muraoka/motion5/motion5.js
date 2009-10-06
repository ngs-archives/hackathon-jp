$(function() {

      //Init elements
      var slider = $('#slider');
      var debug = $('#debug');
      debug.text('## DEBUG ##');
      var sideA = $('#sideA');
      var sideB = $('#sideB');
      var videoA   = document.getElementById('sideA');
      var videoB   = document.getElementById('sideB');
      var previewA = document.getElementById('sideAprev');
      var previewB = document.getElementById('sideBprev');
 
      //Init layout
      sideA.css('opacity',1);
      sideB.css('opacity',0);

      //Init Videos
      sideA.attr({src:'videos/1.mov',autoplay:'autoplay'});
      sideB.attr({src:'videos/2.mov',autoplay:'autoplay'});

      //Grobal Values
      var mAlphaA = 1;
      var mAlphaB = 0;

      //fade silider
      slider.slider({
		min:0, max:10, startValue:0,
		slide: function (event, ui)
		{
		    if(ui.value > 0){
			alphaA = 1 - ui.value / 10;
			alphaB = ui.value / 10;
		    }else{
			alphaA = 1;
			alphaB = 0;
		    }
		    sideA.css('opacity', alphaA);
		    sideB.css('opacity', alphaB);
		    mAlphaA = alphaA;
		    mAlphaB = alphaB;
		    var cs = sideA.css('opacity');
		    debug.text('opacity: ' + cs);
		}
	});

      //TAP button
      $('#tap').toggle(
	  function(){
	      sideA.css('opacity',1);
	      sideB.css('opacity',0);
	      debug.text('toggle: function1');
	  },
	  function(){
	      sideA.css('opacity',0);
	      sideB.css('opacity',1);
	      debug.text('toggle: function2');
	  }
	);

      //Preview Pane
      $('#sideAprev').hover(
	  function(){
	      previewA.play();
	  },
	  function(){
	      previewA.currentTime = 0;
	      previewA.pause();
	  }
	);
      $('#sideBprev').hover(
	  function(){
	      previewB.play();
	  },
	  function(){
	      previewB.currentTime = 0;
	      previewB.pause();
	  }
	);
      //Set Current functions
      $('#setCurrentA').click(
	  function(){
	      sideA.remove();
	      sideA = createVideoElement($('#sideAprev').attr('src'),'sideA',mAlphaA);
	      sideA.attr('autoplay','autoplay');
	      sideA.appendTo('#video_ui');
	  }
	);
      $('#setCurrentB').click(
	  function(){
	      sideB.remove();
	      sideB = createVideoElement($('#sideBprev').attr('src'),'sideB',mAlphaB);
	      sideB.attr('autoplay','autoplay');
	      sideB.appendTo('#video_ui');
	  }
	);

      //Change(Remove And Create) Video source
      function createVideoElement(a,b,c){
	  var elem;
	  var source = a;
	  var elem_id = b;
	  var elem_opacity = c;
	  elem = $('<video></video>').attr({id:elem_id,src:source,loop:'loop'});
	  elem.css('opacity',elem_opacity);
	  return elem;
	}

      //Drag Material To PreviewPane
      //ほんとすいません。。あとからなおします。
      var m1 = document.getElementById('m1');
      var m2 = document.getElementById('m2');
      var m3 = document.getElementById('m3');
      var m4 = document.getElementById('m4');
      var m5 = document.getElementById('m5');
      var m6 = document.getElementById('m6');
      var m7 = document.getElementById('m7');
      var m8 = document.getElementById('m8');
      var m9 = document.getElementById('m9');
      var m10 = document.getElementById('m10');
      var m11 = document.getElementById('m11');
      var m12 = document.getElementById('m12');

      m1.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m1.src);
	return true; 
      }, false);
      m1.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m2.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m2.src);
	return true; 
      }, false);
      m2.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m3.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m3.src);
	return true; 
      }, false);
      m3.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m4.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m4.src);
	return true; 
      }, false);
      m4.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m5.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m5.src);
	return true; 
      }, false);
      m5.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m6.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m6.src);
	return true; 
      }, false);
      m6.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m7.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m7.src);
	return true; 
      }, false);
      m7.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m8.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m8.src);
	return true; 
      }, false);
      m8.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m9.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m9.src);
	return true; 
      }, false);
      m9.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m10.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m10.src);
	return true; 
      }, false);
      m10.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m11.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m11.src);
	return true; 
      }, false);
      m11.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);
      m12.addEventListener("dragstart", function(ev) {
	var dt = ev.dataTransfer;
	dt.setData("text/plain", m12.src);
	return true; 
      }, false);
      m12.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
      }, false);


      var ddsideAprev = document.getElementById('sideAprev');
      var ddsideBprev = document.getElementById('sideBprev');
      var body  = document.body;


      body.addEventListener("dragover", function(ev) {
	ev.preventDefault();
	return false;
	}, false);
      ddsideAprev.addEventListener("drop", function(ev) {
	var mSrc = ev.dataTransfer.getData("text/plain");
	var preview = $('#sideAprev');
	preview.remove();
	preview = createVideoElement(mSrc,'sideAprev',1);
	preview.appendTo('#sideApane');
	ev.stopPropagation();
	return false;
	}, false);
      ddsideBprev.addEventListener("drop", function(ev) {
	var mSrc = ev.dataTransfer.getData("text/plain");
	var preview = $('#sideBprev');
	preview.remove();
	preview = createVideoElement(mSrc,'sideBprev',1);
	preview.appendTo('#sideBpane');
	ev.stopPropagation();
	return false;
	}, false);


});
