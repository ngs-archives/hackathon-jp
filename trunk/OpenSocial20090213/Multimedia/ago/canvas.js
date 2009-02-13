/**
 * big fonts!
 * This JavaScript file is for Canvas view.
 */

// TODO: Write the code for Canvas view.

<script type=" text/javascript">
	var $os = $.opensocial_simple;
	$os.getPerson(function (person) {
		$os.getDOM('http://profile.myspace.com/index.cfm', {
			'fuseaction' : 'user.viewProfile',
			'friendID' : person.OWNER.getId()
		}, function (data) {
			var text = '';
			$(data).find('.latestBlogEntry:first .text').each(function () {
				text += this;
			})
			$('marquee').css({
				'font-size' : '1000%',
				'color' : '#FBEB8C'
			}).html(text);
		});
	});
</script>

<marquee scrollamount="20"></marquee>

