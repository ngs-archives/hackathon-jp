//( function() {
	var emoji_domain = "http://emojica.com";
	var img_dir = emoji_domain + Emojica.img_dir;
	document.getElementById('org_str').value = Emojica.sample;

	var test_str = '';
	for ( var i = 0; i < Emojica.dictionary.length; i++) {
		test_str += Emojica.dictionary[i].words.word + '<br>';
	}
	document.getElementById('test_str').innerHTML += test_str;
	
	/**
	 * 
	 * しりとりの文字列を出力する
	 */
	var capping_plus_emoji = function() {
		stringToEmoji = cappingValidation();
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

			if (image_bracket.length == 0) {
				image_bracket = "<img src=\"" + default_img + "\">";
			}

			returnTag = stringToEmoji + " " + image_bracket + " ";
			// alert(returnTag);// デバッグ
			document.getElementById('capping_phraze').innerHTML += returnTag;
		}
	}

	/**
	 * 
	 * しりとりになっていれば、文字列をそのまま返す なっていなければalertを出した上、false
	 */
	var cappingValidation = function() {
		var capping_check = document.getElementById('org_str').value;
		var next_char = '';

		if (typeof (document.getElementById('next_char').value) == "undefined") {
			// 初回時は何もない
		} else {
			if (document.getElementById('next_char').value != capping_check
					.charAt(0)) {
				alert('つぎは「' + document.getElementById('next_char').value + '」からです');
				return false;
			}
		}

		if (capping_check.slice(-1) == 'ん' || capping_check.slice(-1) == 'ン') {
			alert('「' + capping_check + '」あうとー');
			return false;
		}

		// つぎの入力のためのセットアップ
		next_char = capping_check.slice(-1);
		document.getElementById('org_str').value = next_char;
		document.getElementById('next_char').value = next_char;
		return capping_check;
	}

//})();
