社会の敵の編集

<?php 

	echo $form->create('Enemy');
	echo $form->input('ename');
	echo $form->textarea('desc');
	echo $form->input('imgurl');
	echo $form->input('hp');
	echo $form->input('sp');
	echo $form->input('waza1');
	echo $form->input('waza1p');
	echo $form->input('waza2');
	echo $form->input('waza2p');
	echo $form->input('waza3');
	echo $form->input('waza3p');
	echo $form->end('登録する');
	
?>
