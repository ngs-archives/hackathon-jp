//( function() {
var emoji_domain = "http://emojica.com";
var img_dir = emoji_domain + Emojica.img_dir;
document.getElementById('org_str').value = Emojica.sample;
/*
 * var test_str = ''; for ( var i = 0; i < Emojica.dictionary.length; i++) {
 * test_str += Emojica.dictionary[i].words.word + '<br>'; }
 * document.getElementById('test_str').innerHTML += test_str;
 */
/**
 * 
 * しりとりの文字列を出力する
 */
var capping_plus_emoji = function(objLastWord, objToCapping, objNextPlace) {

	stringToEmoji = cappingValidation(objLastWord, objToCapping);

	if (stringToEmoji !== false) {
		var default_img = emoji_domain + '/img/e_tp/leftright.gif';
		var image_bracket = '';

		for ( var i = 0; i < Emojica.dictionary.length; i++) {
			if (stringToEmoji.match(Emojica.dictionary[i].words.word) !== null) {
				image_bracket = "<img src=\"" + img_dir
						+ Emojica.dictionary[i].pc_files.file_name + "\">";
				// 最初の一つでクリア
				break;
			}
		}

		if (image_bracket.length === 0) {
			image_bracket = "<img src=\"" + default_img + "\">";
		}

		returnTag = stringToEmoji + " " + image_bracket + " ";
		// alert(returnTag);// デバッグ
		objNextPlace.innerHTML += returnTag;
	}
}

/**
 * 
 * しりとりになっていれば、文字列をそのまま返す なっていなければalertを出した上、false
 */
var cappingValidation = function(objLastWord, objToCapping) {

	var lastWord = objLastWord.value;
	var cappingPhraze = objToCapping.value;

	var next_char = '';

	if (typeof (lastWord) === "undefined") {
		// 初回時は何もない
	} else {
		if (lastWord !== cappingPhraze.charAt(0)) {
			alert('つぎは「' + lastWord + '」からです');
			return false;
		}
	}

	if (cappingPhraze.slice(-1) === 'ん' || cappingPhraze.slice(-1) === 'ン') {
		alert('「' + cappingPhraze + '」あうとー');
		return false;
	}

	// つぎの入力のためのセットアップ
	next_char = cappingPhraze.slice(-1);
	objLastWord.value = objToCapping.value = next_char;
	return cappingPhraze;// ここは配列などで返すか？
}

// })();
