<?php
class EnemiesController extends AppController {

	var $name = 'Enemies';
	
	function index(){
	
		$enemies = $this->Enemy->findAll();
		$this->set("enemies",$enemies);	
	
	}
	
	function add(){
	
		if(!empty($this->data)){
			$this->Enemy->create();
			$this->Enemy->save($this->data['Enemy']);
			$this->flash("登録しました。",'/',1);		
		}
	
	}
	
	function edit($id = null){

		if($id != ""){
			if(!empty($this->data)){
				$this->Enemy->save($this->data['Enemy']);
				$this->flash("登録しました。",'/enemies/index/',1);		
			}else{
				$this->data = $this->Enemy->findById($id);
			}
		}
			
	}
	
}
?>
