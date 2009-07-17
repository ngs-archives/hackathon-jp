<?php
/**
* diamont サーバー
*/

mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
ini_set('error_log',  'log/server_log');
ini_set('session.use_cookies', false);
ini_set('session.use_only_cookies', false);

set_include_path(get_include_path() . PATH_SEPARATOR . '../../../lib');

require_once 'Zend/Json.php';
require_once 'component/diamont/diamont_game.php';
require_once 'component/diamont/diamont_road.php';
require_once 'component/diamont/diamont_player.php';

session_cache_expire(30);
session_name('owner_id');
session_start();

if (isset($_SESSION['game'])) {
    $game = $_SESSION['game'];
} else {
    $game = new DiamontGame();
}

$action = null;
$userId = null;

if ($_REQUEST['action'] && $_REQUEST['user_id']) {
    $action = $_REQUEST['action'];
    $userId = $_REQUEST['user_id'];
}

if ($action == 'init') {
    // ゲーム初期化
    $game = new DiamontGame();

} else if ($action == 'join') {
    // ゲームに参加
    $game->players[$userId] = new DiamontPlayer();

} else if ($action == 'go') {
    // 行く
    $game->players[$userId]->answer = 'go';
    
} else if ($action == 'exit') {
    // 帰る
    $game->players[$userId]->answer = 'exit';
    
}

// ゲーム進行
$game->process();

$_SESSION['game'] = $game;


$encode = Zend_Json::encode($game); 
header("Content-Type: text/javascript; charset=utf-8"); 
echo $encode; 

echo "\n\n/*\n";
print_r($game);
echo "*/";