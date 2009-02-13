<?php

	//header("Content-Type: text/plain");
	
	//echo toJson($lastresult);
	
	require_once("/var/www/html/sq/app/webroot/JSON.php");
	
	$json = new Services_JSON;
	$encode = $json->encode($lastresult[0]['Result']);
	header("Content-Type: text/javascript; charset=utf-8");
	echo $encode; 
	
	/*
	echo toJson($lastresult[0]['Result']);

    function toJson($data)
    {   
        $json = array();
        foreach ($data as $string => $value) {
            $key = (is_numeric($string) ? "" : "$string:");
            
            if (is_array($value)) {
                $json[] = sprintf("%s [%s]", $key, toJson($value));
            } else {
                $json[] = sprintf("%s '%s'", $key, addslashes($value));
            }
        }
        return implode(", ", $json);
    }
	*/


?>