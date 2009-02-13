/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */
var prefs = new gadgets.Prefs();
var fsize = prefs.getInt("fontsize");


/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */

var vdsp;
var vds;

$(function () {
	vdsp = new VoiceDeliveryPlayer("vdsp");
	vds = new VoiceDelivery(vdsp, "vds");
	var $os = $.opensocial_simple;
	var text = '死ぬ前にカツカレーをたべて死にたい。';
	$('#textFrontBg').before('<div id="bigFontText" style="font-size:300px; color:#F30">'+text+'</div>');
			new Marquee('bigFontText', {amount:30});
			vds.speak(text);
	
	
});

