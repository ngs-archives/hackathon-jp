/**
* アプリケーション初期化
*/
diamond.init = function() {
    diamond.initVars();
    
    diamond.initProfile();
    
    // プロフィール情報の準備を待つ
    diamond.vars.initProfileInterval = setInterval(function() {
        if (typeof diamond.owner == 'object' && typeof diamond.viewer == 'object') {
            clearInterval(diamond.vars.initProfileInterval);
            diamond.getGameData();
        }
    }, 100);

};


/**
* 表示更新
*/
diamond.update = function(data) {
    if (data) {
        diamond.lastData = diamond.data;
        diamond.data = data;
        
        // サーバーから取得したデータで、状況を判別する　
        if (diamond.data.status == 'waiting_player') {
            // プレイヤー待ち
            diamond.status = 'waitingPlayer';

        } else if (diamond.data.status == 'playing_game') {
            // ゲーム中
            diamond.status = 'playingGame';

        } else if (diamond.data.status == 'game_over') {
            // ゲーム終了
            diamond.status = 'gameOver';
        }
        
        if (diamond.status && diamond.updates[diamond.status]) {
            diamond.updates[diamond.status]();
        }
        
    } else {
        diamond.message('データの受信に失敗しました<br />少し時間をあけてからもう一度試してください');
    }
};


/**
* 画面更新ケース：プレイヤーの参加待ち
*/
diamond.updates.waitingPlayer = function() {
    $('#waiting_player').show();
};


/**
* 画面更新ケース：ゲーム中
*/
diamond.updates.playingGame = function() {
    $('#playing_game').show();
    $('#roadId').html(diamond.data.roadId);
    $('#cardId').html(diamond.data.road.cardId);
};


/**
* 画面更新ケース：ゲーム終了
*/
diamond.updates.gameOver = function() {
    $('#game_over').show();
};

