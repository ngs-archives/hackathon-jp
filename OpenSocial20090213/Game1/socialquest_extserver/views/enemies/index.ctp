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

-->
</style>
<table width="790" height="290">
<?php

	foreach($enemies as $enemy){
	
?>

<tr>
<th valign="top">
<img src="<?php echo $enemy['Enemy']['imgurl']; ?>" border="0" height="180"><br /></th>
<td>
<b><?php echo $enemy['Enemy']['ename']; ?></b><br />
<?php echo $enemy['Enemy']['desc']; ?><br />
<b>ひっさつわざ</b><br /><br />
<?php echo $enemy['Enemy']['waza1']; ?>・<?php echo $enemy['Enemy']['waza2']; ?>・<?php echo $enemy['Enemy']['waza3']; ?><br /><br /><a href="/results/iframe/<?php echo $enemy['Enemy']['id']; ?>">この敵とたたかう</a>
<br />
<br />
<br />
<br />
</td>
</tr>

<?php

}

?>
</table>

<?php

echo "<hr>";

?>

<h2>編集セクション</h2>

<?php

	foreach($enemies as $enemy){
	
		//var_dump($enemy);
	
		?><a href="/enemies/edit/<?php echo $enemy['Enemy']['id']; ?>">
        <img src="<?php echo $enemy['Enemy']['imgurl']; ?>" border="0"></a><br />
		<a href="/enemies/edit/<?php echo $enemy['Enemy']['id']; ?>">
		<?php echo $enemy['Enemy']['ename']; ?>
        </a><br />
        　→　<a href="/results/iframe/<?php echo $enemy['Enemy']['id']; ?>">この敵とたたかう</a><br>
        <?php echo $enemy['Enemy']['waza1']; ?><br />
        <?php echo $enemy['Enemy']['waza2']; ?><br />
        <?php echo $enemy['Enemy']['waza3']; ?><br />
		<?php
	
	}
    
?>


<p><a href="/enemies/add/">新しい敵の追加</a></p>
