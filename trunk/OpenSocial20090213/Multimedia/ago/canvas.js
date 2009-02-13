/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */
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
		new Marquee('marquee');
		$('#marquee').css({
			'font-size' : '1000%',
			'color' : '#FBEB8C'
		}).html(text);
	});
});
