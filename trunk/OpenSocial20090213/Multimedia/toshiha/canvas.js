/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */
var prefs = new gadgets.Prefs();
var fsize = prefs.getInt("fontsize");


$(function () {
	var $os = $.opensocial_simple;
	vds = new VoiceDelivery((new VoiceDeliveryPlayer("vdsp")), "vds");
	$os.getPerson(function (person) {
		$os.get('http://profile.myspace.com/index.cfm', {
			'fuseaction' : 'user.viewProfile',
			'friendID' : person.OWNER.getId().replace(/\D/g, '')
		}, function (data) {
			var text = '';
			$(data).find('.latestBlogEntry:first .text').each(function () {
				text += $(this).html();
			});
			$('#textFrontBg').before('<div id="bigFontText" style="font-size:300px; color:#F30">'+text+'</div>');
			new Marquee('bigFontText', {delay:25});
			vds.speak(text);
		});
	});
});
