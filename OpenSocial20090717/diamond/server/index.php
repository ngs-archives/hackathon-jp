<?php
/**
* Diamont ゲームサーバー
*/

mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
ini_set('error_log',  'error_log');
ini_set('session.use_cookies', false);
ini_set('session.use_only_cookies', false);

set_include_path(get_include_path() . PATH_SEPARATOR . '../../../lib');

require_once 'Zend/Json.php';
require_once 'component/diamont/diamont_game.php';
require_once 'component/diamont/diamont_road.php';
require_once 'component/diamont/diamont_player.php';

session_cache_expire(5);
session_name('room_id');
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
    $game->players[$userId] = new DiamontPlayer($_REQUEST['display_name'], $_REQUEST['thumbnail_url']);

} else if ($action == 'start') {
    // ゲーム開始
    $game->status = 'playing_game';
    $game->newRoad();

} else if ($action == 'go') {
    // 行く
    if (isset($game->players[$userId])) {
        $game->players[$userId]->answer = 'go';
    }
    
} else if ($action == 'exit') {
    // 帰る
    if (isset($game->players[$userId])) {
        $game->players[$userId]->answer = 'exit';
    }
    
}

// ゲーム進行
$game->process();

// セッションのゲームデータを更新する
$_SESSION['game'] = $game;

// 出力用のコピーを作成
$outputGame = clone $game;
if ($game->road) {
    $outputGame->road = clone $game->road;

    // カードセットの内容を削除する
    unset($outputGame->road->cards);
}

if (isset($_REQUEST['debug'])) {
    // デバッグ用出力
    header("Content-Type: text/plain; charset=utf-8"); 
    print_r($outputGame);
    
} else {
    // GameデータをJSONにして出力する
    header("Content-Type: text/javascript; charset=utf-8"); 
    $encode = Zend_Json::encode($outputGame); 
    echo $encode;
}
