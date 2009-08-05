var diamond = {};


/** 最後に受信したサーバーデータ */
diamond.data;

/** １つ前に受信したサーバーデータ */
diamond.lastData;

/** 変数格納用 */
diamond.vars = {};


/**
* 設定値
*/
diamond.properties = {
    "appServerUrl": "http://codess.heteml.jp/diamond/server/",
    "roomIdPrefix": "mixi",
    "answerCountStart": 30
};


/**
* メッセージを表示する
*/
diamond.message = function(message) {
    // Autoクローズのタイムアウトをクリア
    clearTimeout(diamond.vars.messageTimeout);
    
    // メッセージをセットして表示
    $('#message').html(message).css('opacity', 0.9).fadeIn();
    
    // Autoクローズ
    diamond.vars.messageTimeout = setTimeout(function() {
        $('#message').fadeOut();
    }, 2000);
};


/**
* Owner,Viewerのプロフィール情報を取得して保持する
*/
diamond.initProfile = function() {
    cods.fetchOwnerProfile(
        function(data) {
            diamond.owner = {
                'id': data.getId(),
                'displayName': data.getDisplayName(),
                'thumbnailUrl': data.getField(opensocial.Person.Field.THUMBNAIL_URL)
            };
            cods.debug('owner id: ' + diamond.owner.id);
        }
    );
    cods.fetchViewerProfile(
        function(data) {
            diamond.viewer = {
                'id': data.getId(),
                'displayName': data.getDisplayName(),
                'thumbnailUrl': data.getField(opensocial.Person.Field.THUMBNAIL_URL)
            };
            cods.debug('viewer id: ' + diamond.viewer.id);
        }
    );
};


/**
* 変数初期化
*/
diamond.initVars = function() {
    diamond.data = null;
    diamond.lastData = null;
};


/**
* アプリケーション初期化
*/
diamond.init = function() {
    diamond.initVars();
    
    // 30分たったらリロードをかける
    setTimeout(function() {
        location.reload();
    }, 1800000);
    
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
* アプリケーションサーバへリクエストを送信する
*/
diamond.requestJson = function(url, callback) {
    cods.debug('requestJson <a href="' + url + '" target="_blank">' + url + '</a>');
    
    var params = {};
    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    $('#loading').css('opacity', 0.5).show();
    gadgets.io.makeRequest(url, function(response) {
        callback(response.data);
        $('#loading').fadeOut();
    }, params);
};


/**
* アプリケーションサーバへアクションを送信する
*/
diamond.requestAction = function(action, callback) {
    var url = diamond.properties.appServerUrl
            + '?room_id=' + diamond.properties.roomIdPrefix + diamond.owner.id
            + '&user_id=' + diamond.viewer.id
            + '&action=' + action;
    
    diamond.requestJson(url, callback);
};


/**
* アプリケーションサーバーからゲームデータを取得してセットする
*/
diamond.getGameData = function() {
    diamond.requestAction('', diamond.update);
};


/**
* ゲームに参加する
*/
diamond.join = function() {
    $('#waiting_player_entry_popup').hide();
    
    var url = diamond.properties.appServerUrl
            + '?room_id=' + diamond.properties.roomIdPrefix + diamond.owner.id
            + '&user_id=' + diamond.viewer.id
            + '&display_name=' + encodeURI(diamond.viewer.displayName)
            + '&thumbnail_url=' + encodeURI(diamond.viewer.thumbnailUrl)
            + '&action=join';

    diamond.requestJson(url, diamond.update);
};


/**
* 坑道を進む
*/
diamond.go = function() {
    diamond.stopCountDown();
    $('#action_buttons').hide();
    diamond.requestAction('go', diamond.update);
};


/**
* 坑道から帰る
*/
diamond.exit = function() {
    diamond.stopCountDown();
    $('#action_buttons').hide();    
    diamond.requestAction('exit', diamond.update);    
};


/**
* ゲームを始める
*/
diamond.start = function() {
    diamond.requestAction('start', diamond.update);        
};


/**
* ゲームデータを初期化する
*/
diamond.initGame = function() {
    diamond.requestAction('init', function() {
        location.reload();
    });
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

            if (diamond.isViewerPlayer()) {
                // Viewerが参加済み
                diamond.status = 'waitingOtherPlayer';
            } else {
                // Viewerが参加していない
                diamond.status = 'waitingJoin';
            }

        } else if (diamond.data.status == 'playing_game') {
            // ゲーム中
            
            if (diamond.isStatusChange()) {
                // プレイヤー待ちからゲーム中への遷移                
                diamond.status = 'waitingPlayerToPlayingGame';

            } else if (diamond.lastData) {
                // ゲーム中画面2回目以降の更新
                
                if (diamond.isChangeRoad()) {
                    // 坑道が変わった
                    diamond.status = 'playingGameChangeRoad';
                } else if (diamond.isDrawNewCard()) {
                    // 新しいカードを引いた
                    diamond.status = 'playingGameNewCard';
                } else {
                    // 回答待ち
                    diamond.status = 'playingGameWaitingAnswer';
                }
            } else {
                // ゲーム中画面最初の更新
                diamond.status = 'playingGame';
            }
        } else if (diamond.data.status == 'game_over') {
            // ゲーム終了

            if (diamond.isStatusChange()) {
                // ゲーム中からゲーム終了への遷移
                diamond.status = 'playingGameToGameOver';
            } else {
                // ゲーム終了画面の表示
                diamond.status = 'gameOver';
            }
        }
        
        if (diamond.status && diamond.updates[diamond.status]) {
            diamond.updates[diamond.status]();
        }
        
    } else {
        diamond.message('データの受信に失敗しました<br />少し時間をあけてからもう一度試してください');
    }
};


/**
* 画面更新処理をケースごとに格納するオブジェクト
*/
diamond.updates = {};


/**
* 画面更新ケース：Viewerの参加待ち
*/
diamond.updates.waitingJoin = function() {
    $('#waiting_player').show();
    $('#waiting_join').show();
    
    // プレイヤーリスト更新
    diamond.updateJoinPlayers();

    // 自動更新
    diamond.vars.updateTimeout = setTimeout(diamond.getGameData, 5000);
};


/**
* 画面更新ケース：他のプレイヤーの参加待ち
*/
diamond.updates.waitingOtherPlayer = function() {
    $('#waiting_player').show();
    $('#waiting_join').hide();
    $('#waiting_other_player').show();

    // プレイヤーリスト更新
    diamond.updateJoinPlayers();

    // 自動更新
    diamond.vars.updateTimeout = setTimeout(diamond.getGameData, 5000);
};


/**
* 画面更新ケース：ゲーム中画面への遷移（ゲーム開始）
*/
diamond.updates.waitingPlayerToPlayingGame = function() {
    // 自動更新中止
    clearTimeout(diamond.vars.updateTimeout);
    
    // メッセージを表示
    diamond.message('Road 1');
    
    // プレイヤー待ちをクローズ
    $('#waiting_player').fadeOut();
    
    // ゲーム中を表示
    $('#playing_game').fadeIn();
    
    // プレイヤー更新
    diamond.updatePlayers();

    // 坑道を更新
    diamond.updateRoads();
    
    // カードを更新
    diamond.updateCards();
    
    // カードを引く
    setTimeout(function() {
        diamond.animateDrawCard();
    }, 3000);
};


/**
* 画面更新ケース：新しいカード
*/
diamond.updates.playingGameNewCard = function() {
    // プレイヤーの回答を更新
    diamond.updatePlayersAnswer();

    // カードを更新
    diamond.updateCards();
    
    // カードを引く
    setTimeout(function() {
        diamond.animateDrawCard();
    }, 500);

    // Viewerが既に坑道を出ている場合は自動更新
    if (!diamond.isViewerGoing()) {
        setTimeout(diamond.getGameData, 5000);
    }
};


/**
* 画面更新ケース：次の坑道
*/
diamond.updates.playingGameChangeRoad = function() {
    // プレイヤーの回答を更新
    diamond.updatePlayersAnswer();
    
    if (diamond.data.excludeCards[diamond.lastData.roadId]) {
        // アクシデントで坑道終了
        
        // 最後のカードを引く
        setTimeout(function() {
            diamond.animateDrawLastCard();
        }, 500);
        
        // 坑道を変える
        setTimeout(function() {
            diamond.animateChangeRoad();
        }, 6000);
    } else {
        // 全員が坑道を出た

        setTimeout(function() {
            // プレイヤースコアをクリア
            diamond.clearPlayersScore();

            // 回答をクリア
            diamond.clearPlayersAnswer();

            // 坑道を変える
            diamond.animateChangeRoad();
        }, 1000);
    }
};


/**
* 画面更新ケース：プレイヤーの回答待ち
*/
diamond.updates.playingGameWaitingAnswer = function() {
    diamond.updatePlayersAnswer();

    // Viewerが回答済み、または既に坑道を出ている場合は自動更新
    if (diamond.isViewerAnswered() || !diamond.isViewerGoing()) {
        setTimeout(diamond.getGameData, 5000);
    }
};


/**
* 画面更新ケース：ゲーム中画面の表示
*/
diamond.updates.playingGame = function() {
    diamond.updatePlayers();
    diamond.updatePlayersScore();
    diamond.updateCards();
    diamond.updateRoads();
    if (diamond.isViewerPlayer() && diamond.isViewerGoing()) {
        $('#action_buttons').show();
        diamond.startCountDown(diamond.exit);
    }
    $('#playing_game').show();

    // Viewerが回答済み、または既に坑道を出ている場合は自動更新
    if (diamond.isViewerAnswered() || !diamond.isViewerGoing()) {
        setTimeout(diamond.getGameData, 5000);
    }
};


/**
* 画面更新ケース：ゲーム終了画面への遷移
*/
diamond.updates.playingGameToGameOver = function() {
    // プレイヤーの回答を更新
    diamond.updatePlayersAnswer();
    
    if (diamond.data.excludeCards[diamond.lastData.roadId]) {
        // アクシデントで坑道終了
        
        // 最後のカードを引く
        setTimeout(function() {
            diamond.animateDrawLastCard();
        }, 500);
        
        setTimeout(function() {
            diamond.message('Game Over');
            
            setTimeout(function() {
                $('#playing_game').fadeOut();
                $('#game_over').fadeIn();
                diamond.updateResultPlayers();
            }, 3000);
        }, 6000);
    } else {
        // 全員が坑道を出た

        setTimeout(function() {
            diamond.message('Game Over');

            // 回答をクリア
            diamond.clearPlayersAnswer();
            
            setTimeout(function() {
                $('#playing_game').fadeOut();
                $('#game_over').fadeIn();
                diamond.updateResultPlayers();
            }, 3000);
        }, 1000);
    }

};


/**
* 画面更新ケース：ゲーム終了画面の表示
*/
diamond.updates.gameOver = function() {
    $('#game_over').show();
    diamond.updateResultPlayers();
};


/**
* プレイヤー表示更新（ゲーム開始前）
*/
diamond.updateJoinPlayers = function() {
    var i = 0;
    for (id in diamond.data.players) {
        var elemId = 'join_player_' + id;
        
        if (!document.getElementById(elemId)) {
            var html = '<div class="player" id="' + elemId + '" style="display: none;">'
                     + $('#join_player_').html()
                     + '</div>';
            
            $('#join_players').append(html);
            $('#' + elemId).css('left', i * 90);            
            $('#' + elemId + ' .player_name').html(diamond.data.players[id].displayName);
            $('#' + elemId + ' .player_thumbnail_img').attr('src', diamond.data.players[id].thumbnailUrl);
            $('#' + elemId).fadeIn();
        }
        
        i++;
    }
};


/**
* プレイヤー表示更新
*/
diamond.updatePlayers = function() {
    var i = 0;
    for (id in diamond.data.players) {
        var elemId = 'player_' + id;
        
        if (!document.getElementById(elemId)) {
            var html = '<div class="player" id="' + elemId + '" style="display: none;">'
                     + $('#player_').html()
                     + '</div>';
            
            $('#players').append(html);
            $('#' + elemId).css('left', i * 90);
            if (diamond.data.players[id].exit) {
                $('#' + elemId).css('opacity', 0.5);
            }
            $('#' + elemId + ' .player_name').html(diamond.data.players[id].displayName);
            $('#' + elemId + ' .player_thumbnail_img').attr('src', diamond.data.players[id].thumbnailUrl);
            $('#' + elemId).show();
        }

        i++;
    }
};


/**
* プレイヤー表示更新（ゲームオーバー）
*/
diamond.updateResultPlayers = function() {
    var i = 0;
    var topScore = 0;
    var topPlayerId;
    for (id in diamond.data.players) {
        var elemId = 'result_player_' + id;
        
        if (!document.getElementById(elemId)) {
            var html = '<div class="player" id="' + elemId + '" style="display: none;">'
                     + $('#result_player_').html()
                     + '</div>';
            
            $('#result_players').append(html);
            $('#' + elemId).css('left', i * 90);
            $('#' + elemId + ' .player_name').html(diamond.data.players[id].displayName);
            $('#' + elemId + ' .player_thumbnail_img').attr('src', diamond.data.players[id].thumbnailUrl);
            diamond.countupPlayerTotalScore(id);
            $('#' + elemId).show();
        }
        
        if (diamond.data.players[id].totalScore > topScore) {
            topScore = diamond.data.players[id].totalScore;
            topPlayerId = id;
        }
        
        i++;
    }
    
    setTimeout(function() {
        $('#result_player_' + topPlayerId + ' .player_rank').html('Winner');
    }, 5000);
};


/**
* プレイヤー回答表示更新
*/
diamond.updatePlayersAnswer = function() {
    if (diamond.isDrawNewCard()) {
        for (id in diamond.data.players) {
            var elemId = 'player_' + id;
            if (diamond.data.players[id].lastAnswer == 'go') {
                $('#' + elemId + ' .player_answer').html('Go').css('backgroundColor', '#63be30').show();
                
            } else if (diamond.data.players[id].lastAnswer == 'exit') {
                $('#' + elemId + ' .player_answer').html('Exit').css('backgroundColor', '#ff6330').show();
            }
            
            if (diamond.data.players[id].exit) {
                $('#' + elemId).fadeTo('normal', 0.2);

                // スコア更新
                diamond.countupPlayerScore(id);
            }
        }
    }
};


/**
* プレイヤー回答表示クリア
*/
diamond.clearPlayersAnswer = function() {
    for (id in diamond.data.players) {
        var elemId = 'player_' + id;
        $('#' + elemId + ' .player_answer').fadeOut();
    }
};


/**
* プレイヤースコアをクリア
*/
diamond.clearPlayersScore = function() {
    for (id in diamond.data.players) {
        $('#player_' + id + ' .player_score').html(0);
    }
};


/**
* プレイヤースコア表示更新
*/
diamond.updatePlayersScore = function() {
    for (id in diamond.data.players) {
        $('#player_' + id + ' .player_score').html(diamond.data.players[id].roadScore);
    }
};


/**
* トータルスコアのカウントアップ
*/
diamond.countupPlayerTotalScore = function(id) {
    var score = $('#result_player_' + id + ' .total_score').html();
    
    if (score < diamond.data.players[id].totalScore) {
        score = score - 0 + 1;
        $('#result_player_' + id + ' .total_score').html(score).css('color', '#63be30');
        setTimeout(function() {
            diamond.countupPlayerTotalScore(id);
        }, 100);
    } else {
        $('#result_player_' + id + ' .total_score').css('color', '#ffffff');
    }
};


/**
* プレイヤースコアのカウントアップ
*/
diamond.countupPlayersScore = function() {
    for (id in diamond.data.players) {
        diamond.countupPlayerScore(id);
    }
};
diamond.countupPlayerScore = function(id) {
    var score = $('#player_' + id + ' .player_score').html();
    
    if (score < diamond.data.players[id].roadScore) {
        score = score - 0 + 1;
        $('#player_' + id + ' .player_score').html(score).css('color', '#63be30');
        setTimeout(function() {
            diamond.countupPlayerScore(id);
        }, 100);
    } else {
        $('#player_' + id + ' .player_score').css('color', '#ffffff');
    }
};


/**
* プレイヤースコアのカウントダウン
*/
diamond.countdownPlayerScore = function(id) {
    var score = $('#player_' + id + ' .player_score').html();
    
    if (score > 0) {
        score = score - 0 - 1;
        $('#player_' + id + ' .player_score').html(score).css('color', '#ff6633');
        
        var marginId = score % 4;
        if (marginId == 0) {
            $('#player_' + id).css('marginLeft', 0);
        } else if (marginId == 1) {
            $('#player_' + id).css('marginLeft', 2);
        } else if (marginId == 2) {
            $('#player_' + id).css('marginLeft', 0);
        } else {
            $('#player_' + id).css('marginLeft', -2);
        }
        
        setTimeout(function() {
            diamond.countdownPlayerScore(id);
        }, 50);
    } else {
        $('#player_' + id).css('marginLeft', 0);
        $('#player_' + id + ' .player_score').css('color', '#ffffff');
    }
};


/**
* 坑道表示更新
*/
diamond.updateRoads = function() {
    var i = 0;
    for (id=1; id<=5; id++) {
        var elemId = 'road_' + id;
        
        if (!document.getElementById(elemId)) {
            // 坑道が追加されていなければ追加する

            var html = '<div class="road" id="' + elemId + '">'
                     + $('#road_').html()
                     + '</div>';
            
            $('#roads').append(html);
            $('#' + elemId).css('left', i * 130);
            $('#' + elemId + ' .road_name').html('Road ' + id);
        }
        
        i++;
    }

    // 坑道で除外されたカードの情報を更新
    for (id in diamond.data.excludeCards) {
        $('#road_' + id + ' .exclude_card').html(diamond.data.excludeCards[id])
                                           .addClass('card_' + diamond.data.excludeCards[id])
                                           .fadeIn();
    }
    
    // 坑道が変わったら現在の坑道用クラスをクリア
    if (diamond.lastData && diamond.data.roadId != diamond.lastData.roadId) {
        $('#road_' + diamond.lastData.roadId).removeClass('current_road');
    }

    $('#road_' + diamond.data.roadId).addClass('current_road');
};


/**
* カード表示更新
*/
diamond.updateCards = function () {
    // 既に引いたカードの情報を更新
    for (id in diamond.data.road.drawCards) {
        var elemId = 'card_' + id;
        
        if (!document.getElementById(elemId)) {
            // カードが追加されていなければ追加する
            
            var card = diamond.data.road.drawCards[id].card

            var html = '<div class="card card_' + card
                     + '" id="' + elemId + '" style="display: none;">'
                     + $('#card_').html()
                     + '</div>';
            $('#cards').append(html);
            
            // カード名をセット
            $('#' + elemId + ' .card_name').html(card);
            
            // 最後に引いたカード以外を表示
            if (!diamond.lastData || id != diamond.data.road.cardId) {
                $('#' + elemId).show();
            }
        }

        // 残りダイヤ数を更新
        if (diamond.data.road.drawCards[id].remainDias) {
            $('#' + elemId + ' .remain_dias').html('(' + diamond.data.road.drawCards[id].remainDias + ')');
        } else {
            $('#' + elemId + ' .remain_dias').html('');
        }
    }
}


/**
* カードを引くアニメーション
*/
diamond.animateDrawCard = function() {
    // カード内容をセット
    $('#last_card').html(diamond.data.road.card)
                   .removeClass()
                   .addClass('card_' + diamond.data.road.card);
    
    // カードを引く
    $('#draw_card').css('top', 10)
                   .css('left', 730)
                   .css('opacity', 1)
                   .animate({top: 145, 
                             left: 370, 
                             opacity: 0}, 300);
    setTimeout(function() {
        $('#last_card').fadeIn();
    }, 150);
    
    setTimeout(function() {
        // カードを置く
        $('#last_card').fadeOut();
        $('#card_' + diamond.data.road.cardId).fadeIn();        

        // スコア更新
        diamond.countupPlayersScore();

        // 回答をクリア
        diamond.clearPlayersAnswer();

        // アクションボタン表示
        if (diamond.isViewerPlayer() && diamond.isViewerGoing()) {
            setTimeout(function() {
                $('#action_buttons').fadeIn();
                diamond.startCountDown(diamond.exit);
            }, 500);
        }
    }, 1500);
};


/**
* 最後のカードを引くアニメーション
*/
diamond.animateDrawLastCard = function() {
    // 最後に引いたカード
    var card = diamond.data.excludeCards[diamond.lastData.roadId];

    // カード内容をセット
    $('#last_card').html(card)
                   .removeClass()
                   .addClass('card_' + card);

    // カードを引く
    $('#draw_card').css('top', 10)
                   .css('left', 730)
                   .css('opacity', 1)
                   .animate({top: 145, 
                             left: 370, 
                             opacity: 0}, 300);
    setTimeout(function() {
        $('#last_card').fadeIn();
    }, 150);
    
    setTimeout(function() {
        $('#last_card').fadeOut(2000);
        
        // 強制期間
        diamond.animateForceReturn();

        // 回答をクリア
        diamond.clearPlayersAnswer();
    }, 2000);
};


/**
* 坑道を変えるアニメーション
*/
diamond.animateChangeRoad = function() {
    diamond.message('Road ' + diamond.data.roadId);
    
    $('.card').fadeOut();

    // 坑道更新
    diamond.updateRoads();
    
    // プレイヤークリア
    for (id in diamond.data.players) {
        $('#player_' + id).css('opacity', 1);
        $('#player_' + id + ' .player_score').html(0);
    }
    
    setTimeout(function() {
        // カードをクリア
        $('#cards').empty();

        // カードを更新
        diamond.updateCards();
    }, 1000);

    // カードを引く
    setTimeout(function() {
        diamond.animateDrawCard();
    }, 3000);
};


/**
* 強制帰還（アクシデントで終了）アニメーション
*/
diamond.animateForceReturn = function() {
    for (id in diamond.data.players) {
        if (!diamond.data.players[id].exit) {
            diamond.countdownPlayerScore(id);
        }
    }    
};


/**
* 坑道が変わったかどうかを返す
*/
diamond.isChangeRoad = function() {
    if (diamond.lastData && 
        diamond.data.roadId != diamond.lastData.roadId) {
        return true;
    }
    return false;
};


/**
* 新しいカードを引いたかどうかを返す
*/
diamond.isDrawNewCard = function() {
    if (diamond.data &&
        diamond.data.road &&
        !document.getElementById('card_' + diamond.data.road.cardId)) {
        return true;
    }
    if (diamond.data &&
        diamond.lastData &&
        diamond.data.roadId != diamond.lastData.roadId) {
        return true;
    }
    return false;
};


/**
* ゲームの状況が変わったかどうかを返す
*/
diamond.isStatusChange = function() {
    if (diamond.lastData &&
        diamond.data.status != diamond.lastData.status) {
        return true;
    }
    return false;
};


/**
* ViewerがPlayerかどうかを返す
*/
diamond.isViewerPlayer = function() {
    if (diamond.data && 
        diamond.data.players && 
        diamond.data.players[diamond.viewer.id]) {
        return true;
    }
    return false;
};


/**
* Viewerが坑道を進んでいるかどうかを返す
*/
diamond.isViewerGoing = function() {
    if (diamond.isViewerPlayer() &&
        !diamond.data.players[diamond.viewer.id].exit) {
        return true;
    }
    return false;
};


/**
* Viewerが回答済みかどうかを返す
*/
diamond.isViewerAnswered = function() {
    if (diamond.isViewerPlayer() &&
        diamond.data.players[diamond.viewer.id].answer != null) {
        return true;
    }
    return false;
};


/**
* 時間制限カウントダウンを開始
*/
diamond.startCountDown = function(callback) {
    if (diamond.properties.answerCountStart) {
        diamond.countDown(diamond.properties.answerCountStart, callback);
    }
};


/**
* 時間制限カウントダウンを停止
*/
diamond.stopCountDown = function() {
    $('#count').html('');
    clearInterval(diamond.vars.countDownInterval);
};


/**
* 時間制限カウントダウン
*/
diamond.countDown = function(count, callback) {
    clearInterval(diamond.vars.countDownInterval);

    diamond.vars.count = count;
    
    diamond.countAnimate();
    
    diamond.vars.countDownInterval = setInterval(function() {
        diamond.vars.count--;
        
        if (diamond.vars.count <= 0) {
            $('#count').html('');
            clearInterval(diamond.vars.countDownInterval);
            callback();
        } else {
            diamond.countAnimate();
        }
    }, 1000);
};


/**
* 時間制限カウントアニメーション
*/
diamond.countAnimate = function() {
    if (diamond.vars.count <= 5) {
        $('#count').css('color', '#ff9900');
    } else {
        $('#count').css('color', '#231815');
    }
    
    $('#count').html(diamond.vars.count)
               .css('opacity', 1)
               .css('font-size', 40)
               .animate({opacity: 0, fontSize: 30}, 800);
};
