<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>EC Dragon Test</title>
</head>
<body>

<?php
/**
 * マルチバイト文字列を１文字ずつ配列に分割
 * 参考:http://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q1417635014#
 */
function mbStringToArray($sStr, $sEnc = 'UTF-8') {
	$aRes = array();
	while ($iLen = mb_strlen($sStr, $sEnc)) {
		array_push($aRes, mb_substr($sStr, 0, 1, $sEnc));
		$sStr = mb_substr($sStr, 1, $iLen, $sEnc);
	}
	return $aRes;
}

function LevenshteinDistance($str1, $str2) {
	$d = array();
	//	$len1 = strlen($str1);
	//	$len2 = strlen($str2);
	$len1 = mb_strlen($str1);
	$len2 = mb_strlen($str2);

	for ($i1 = 0; $i1 <= $len1; $i1++) {
		$d[$i1] = array();
		$d[$i1][0] = $i1;
	}

	for ($i2 = 0; $i2 <= $len2; $i2++) {
		$d[0][$i2] = $i2;
	}

	$mb_str1 = mbStringToArray($str1);
	$mb_str2 = mbStringToArray($str2);

	for ($i1 = 1; $i1 <= $len1; $i1++) {
		for ($i2 = 1; $i2 <= $len2; $i2++) {
			//			$cost = ($str1[$i1 - 1] == $str2[$i2 - 1]) ? 0 : 1;
			$cost = ($mb_str1[$i1 - 1] == $$mb_str2[$i2 - 1]) ? 0 : 1;
			$d[$i1][$i2] = min($d[$i1 - 1][$i2] + 1, //挿入
			$d[$i1][$i2 - 1] + 1, //削除
			$d[$i1 - 1][$i2 - 1] + $cost //置換
			);
		}
	}
	return $d[$len1][$len2];
}
$test = array(
	array('abc', 'abc'), //0
	array('kitten', 'sitting'), //3
	array('おしり', 'めがね'), //5
	array('照明', '明'), //
	array('smei', 'mei'), //
	array('12345', '234'),
);
foreach ($test as $row) {
	echo $row[0], $row[1];
	echo levenshtein($row[0], $row[1]);
	echo ' = ';
	echo LevenshteinDistance($row[0], $row[1]);
	echo '<br/>';
}
echo levenshtein('おしり', 'めがね');
?>

</body>
</html>