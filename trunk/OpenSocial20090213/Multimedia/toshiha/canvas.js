/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */
var prefs = new gadgets.Prefs();
var fsize = prefs.getInt("fontsize");


$('body').css('')
var $os = $.opensocial_simple;
$os.getPerson(function (person) {
	$os.get('http://profile.myspace.com/index.cfm', {
		'fuseaction' : 'user.viewProfile',
		'friendID' : person.OWNER.getId().replace(/\D/g, '')
	}, function (data) {
		var text = '';
		$(data).find('.latestBlogEntry:first .text').each(function () {
			text += $(this).html();
		});
		$('#bigFontText').css({
			'font-size' : fsize + 'px',
			'color' : '#F30'
		}).html(text);
	});
});
