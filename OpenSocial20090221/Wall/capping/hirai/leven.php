<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>EC Dragon Test</title>
</head>
<body>
<pre>
<?php
/**
 * マルチバイト文字列を１文字ずつ配列に分割
 * 参考:http://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1417635014#
 */
function mbStringToArray($sStr, $encoding = 'UTF-8') {
	$aRes = array();
	while ($iLen = mb_strlen($sStr, $encoding)) {
		array_push($aRes, mb_substr($sStr, 0, 1, $encoding));
		$sStr = mb_substr($sStr, 1, $iLen, $encoding);
	}
	return $aRes;
}

function LevenshteinDistance($str1, $str2, $encoding = 'UTF-8', $costReplace = 2) {
	//	$str1 = mb_convert_encoding($str1, 'EUC-JP', 'UTF-8');
	//	$str2 = mb_convert_encoding($str2, 'EUC-JP', 'UTF-8');
	//	return levenshtein($str1, $str2);
	/**
	 * EUCだとlevenshtein使えるという話もあったが使えない
	 * http://d.hatena.ne.jp/shimooka/20070128/1169916684
	 */

	$d = array();
	$mb_len1 = mb_strlen($str1, $encoding);
	$mb_len2 = mb_strlen($str2, $encoding);

	$mb_str1 = mbStringToArray($str1, $encoding);
	$mb_str2 = mbStringToArray($str2, $encoding);

	for ($i1 = 0; $i1 <= $mb_len1; $i1++) {
		$d[$i1] = array();
		$d[$i1][0] = $i1;
	}

	for ($i2 = 0; $i2 <= $mb_len2; $i2++) {
		$d[0][$i2] = $i2;
	}

	for ($i1 = 1; $i1 <= $mb_len1; $i1++) {
		for ($i2 = 1; $i2 <= $mb_len2; $i2++) {
			//			$cost = ($str1[$i1 - 1] == $str2[$i2 - 1]) ? 0 : 1;
			if ($mb_str1[$i1 - 1] === $mb_str2[$i2 - 1]) {
				$cost = 0;
			} else {
				$cost = $costReplace; //置換
				}
			$d[$i1][$i2] = min($d[$i1 - 1][$i2] + 1, //挿入
			$d[$i1][$i2 - 1] + 1, //削除
			$d[$i1 - 1][$i2 - 1] + $cost);
		}
	}

	return $d[$mb_len1][$mb_len2];
}

$test = array(
	array('abc', 'abc'), //0
	array('kitten', 'sitting'), //3
	array('おしり', 'めがね'), //5
	array('照明', '明'), //
	array('いじめ', 'いじり'), //
	array('もずくのかに', 'かに'), //
	array('火事', '花火'), //
	array('火事', '黒板'), //
	array('smei', 'mei'), //
	array('12345', '234'),
);
foreach ($test as $row) {
	echo $row[0].','.$row[1];
	echo ' | ';
	echo levenshtein($row[0], $row[1]);
	echo ' = ';
	echo LevenshteinDistance($row[0], $row[1]);
	echo '<br/>';
}

var_dump(mbStringToArray('smei'));
?>

</pre>
</body>
</html>