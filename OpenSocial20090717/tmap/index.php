<?php
  $command = $_GET['c'];

  if (!($cn = mysql_connect("FQDN", "USER", "PASSWORD"))) {
    die;
  }

  if (!(mysql_select_db("DBNAME"))) {
    die;
  }

  if ($command == "get") {
    $uid = intval($_GET['uid']);
    $tag = $_GET['tag'];
    if ($uid == "") {
      print "";
    } else {
      if ($tag == '') {
        $sql = "select id, uid, latlng from maplog where uid=" . $uid;
      } else {
        $sql = "select maplog.id, maplog.uid, maplog.latlng from maplog, tags where maplog.id=tags=mapid and uid=" . $uid . " and tags.tag='" . $tag . "'";
      }
      if (!($rs = mysql_query($sql))) {
        die;
      }
      $json = '{"datas":[';
      while ($record = mysql_fetch_row($rs)) {
        $json .= '{"id":' . $record[0] . ',"uid":' . $record[1] . ',"latlng":"' . $record[2] . '"},';
      }
      $json .= ']}';
      print $json;
    } 
  } else if ($command == "set") {
    $uid = intval($_GET['uid']);
    $latlng = $_GET['pos'];
    if ($uid == '' || $latlng == '') {
      print "-1";
    } else {
      $sql = "insert into maplog (uid, latlng) values($uid, '" . $latlng . "')";
      mysql_query($sql);
      print mysql_insert_id();
    }
  } else if ($command == "settag") {
    $mapid = intval($_GET['id']);
    $tag = $_GET['tag'];
    $sql = "insert into tags (mapid, tag) values($mapid, '" . $tag . "')";
    mysql_query($sql);
  } else {
    print $command;
  }

  mysql_close($cn);
?>

