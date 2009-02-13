<?php

class ResultsController extends AppController {

	var $name = 'Results';
	var $uses = array('Result','Enemy');
	
	function printresult($eid = null){
	
		$enemy = $this->Enemy->findById($eid);
		$this->set('enemy',$enemy);
		
	}
	
	function iframe($eid = null){
	
		$enemy = $this->Enemy->findById($eid);
		$this->set('enemy',$enemy);
		
	}
	
	function save($ename = null, $partyname = null, $result = null){

		$this->data['Result']['ename'] = $ename;
		$this->data['Result']['teamname'] = $partyname;
		$this->data['Result']['result'] = $result;
		$this->Result->save($this->data['Result']);
		$this->redirect("/enemies/");
		
	}

	function getlastresult(){
	
		$this->layout = "d2";
		$lastresult = $this->Result->findAll(null,null,"id desc",1);
		$this->set('lastresult',$lastresult);
		
	}
	
}



?>
