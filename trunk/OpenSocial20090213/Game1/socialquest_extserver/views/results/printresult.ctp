
<style type="text/css">
<!--
body{
	background-color:#000000;
	color:#FFFFFF;
	font-weight:bold;
}
a:link{
	color:#FFFFFF;
}
a:hover{
	color:#FFFFFF;
}
a:avtive{
	color:#FFFFFF;
}
a:visited{
	color:#FFFFFF;
}	
.style1{
	font-size:14px;
}
-->
</style>
<!-- soundapi.setup.begin -->
<script type="text/javascript" src="/js/swfobject.js"></script>
<script type="text/javascript" src="/js/soundapi.js"></script>
<!-- soundapi.setup.end -->

<script src="/js/Scripts/AC_RunActiveContent.js" type="text/javascript"></script>
<script type="text/javascript">
AC_FL_RunContent( 'codebase','http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0','width','1','height','1','src','/js/bgm','quality','high','pluginspage','http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash','movie','/js/bgm' ); //end AC code
</script><noscript><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="1" height="1">
  <param name="movie" value="/js/bgm.swf" />
  <param name="quality" value="high" />
  <embed src="/js/bgm.swf" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="1" height="1"></embed>
</object>
</noscript>

<?php

$clearflag = true;

//dummy
//Players
$party['name'] = "よせあつめチーム";
$party['hp'] = 2000;
$party['sp'] = 20;

//var_dump($enemy);

//Enemy
$thisenemy['ename'] = $enemy['Enemy']['ename'];
$ewaza = array($enemy['Enemy']['waza1'], $enemy['Enemy']['waza2'], $enemy['Enemy']['waza3']);
$thisenemy['hp'] = 2000;
$thisenemy['sp'] = 20;

$i = 0;
while($thisenemy['hp'] > 0 && $party['hp'] > 0){

$dmgarray = array(1,1.2,1.5,2,5);

?>


<a name="<?php echo "turn".$i; ?>"></a>
<table width="500" border="0" cellpadding="10" cellspacing="5">
  <tr>
    <td><p class="style1"><?php echo $thisenemy['ename']; ?>(HP <?php echo $thisenemy['hp']; ?>)が　あらわれた！</p>
      <!-- <p class="style1"><?php echo $i; ?>ターン</p> -->
      <?php
	  
      	//パーティーの攻撃
		shuffle($dmgarray);
		$damage = 100*$dmgarray[0];
		$thisenemy['hp'] = $thisenemy['hp'] - $damage;
	  
	  ?>
      <p class="style1"><?php echo $party['name']; ?>(HP <?php echo $party['hp']; ?>)は<?php echo $thisenemy['ename']; ?> に <?php echo $damage; ?>のダメージを与えた！</p>
      <?php //敵の攻撃の攻撃
	  
		shuffle($dmgarray);
		$damage = 100*$dmgarray[0];
		$party['hp'] = $party['hp'] - $damage;
		
		shuffle($ewaza);
	  ?>
      <p class="style1"><?php echo $thisenemy['ename']; ?>は <?php echo $ewaza[0]; ?> をはなった！</p>
      
      <p class="style1"><?php echo $thisenemy['ename']; ?>は<?php echo $party['name']; ?>に <?php echo $damage; ?>のダメージを与えた！</p>
      </td>
  </tr>
</table>

<?php
if($thisenemy['hp'] < 0 || $party['hp'] < 0){
?>
<p align="center"><a href="#turn<?php echo $i+1; ?>" onclick="javascript:soundapi.playFile('/js/bom.mp3');" >▼</a></p>
<?php
}else{
?>
<p align="center"><a href="#turn<?php echo $i+1; ?>" onclick="javascript:soundapi.playFile('/js/pi.mp3');" >▼</a></p>
<?php
}
	$i++;

}

?>
<br />
<br />
<a name="<?php echo "turn".$i; ?>"></a>

<?php

//結果表示
if($party['hp'] < 0){
	echo  $party['name']."はやられてしまった！";
	/*
	$this->Result['ename'] = $thisenemy['ename'];
	$this->Result['teamname'] = $party['name'];
	$this->Result['result'] = 0;
	$this->Result->save($this->Result);
	*/
	$result = 0;
}
if($thisenemy['hp'] < 0){
	echo  $thisenemy['ename']."をやっつけた！";
	/*
	$this->Result['ename'] = $thisenemy['ename'];
	$this->Result['teamname'] = $party['name'];
	$this->Result['result'] = 1;
	$this->Result->save($this->Result);
	*/
	$result = 1;
}

?>

<a href="http://sq.spicebox.jp/results/save/<?php echo $thisenemy['ename']; ?>/<?php echo $party['name']; ?>/<?php echo $result; ?>/" target="_parent">新たな敵とたたかう</a>　
<?php /*
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<a href="http://sq.spicebox.jp/results/printresult/<?php echo $enemy['Enemy']['id']; ?>" target="_self">再戦</a>　<a href="http://sq.spicebox.jp/enemies/" target="_parent">新たな敵とたたかう</a>　

*/
?>
