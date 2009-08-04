<?php
/**
* Diamont ゲームクラス
*/
class DiamontGame
{
    /** 強制的にゲームを開始するプレイヤー数 */
    const MAX_PLAYERS = 8;
    
    /** 1ゲームの坑道数 */
    const ROADS = 5;
    
    /** ゲーム状況 */
    var $status;
    
    /** プレイ中の坑道ID */
    var $roadId;
    
    /** プレイ中の坑道 */
    var $road;
    
    /** 参加プレイヤー */
    var $players;
    
    /** 坑道から除外するカード */
    var $excludeCards;
    
    
    /**
    * コンストラクタ
    */
    function __construct()
    {
        $this->status = 'waiting_player';
        $this->roadId = 0;
        $this->players = array();
        $this->excludeCards = array();
    }
    
    
    /**
    * ゲーム進行
    */
    function process()
    {
        if ($this->status == 'waiting_player') {
            // プレイヤー参加待ち
            
            if (count($this->players) >= self::MAX_PLAYERS) {
                // 最大プレイヤー数に達したので強制的にゲームを開始
                $this->status = 'playing_game';
                $this->newRoad();
            }
            
        } else if ($this->status == 'playing_game') {
            // ゲーム中（プレイヤー回答待ち）
            
            $players = array();
            foreach ($this->players as $userId => $player) {
                if (!$player->exit) {
                    $players[$userId] = $player;
                }
            }            
            
            $answered = true;

            foreach ($players as $player) {
                if (!$player->exit && $player->answer == null) {
                    $answered = false;
                    break;
                }
            }
            
            if ($answered) {
                // 全員回答済み
                
                $goPlayers = array();
                $exitPlayers = array();
                
                foreach ($players as $userId => $player) {
                    if ($player->answer == 'go') {
                        $goPlayers[$userId] = $player;
                    } else {
                        $exitPlayers[$userId] = $player;
                    }
                }
                
                // 帰り道のダイアを山分け
                if ($exitPlayers) {
                    $playerCount = count($exitPlayers);
                    foreach ($this->road->drawCards as $cardId => $drawCard) {
                        if ($drawCard['remainDias']) {
                            $playerDias = floor($drawCard['remainDias'] / $playerCount);
                            $remainDias = $drawCard['remainDias'] % $playerCount;
                            
                            foreach ($exitPlayers as $userId => $player) {
                                $this->players[$userId]->roadScore += $playerDias;
                            }
                            
                            $this->road->setRemainDias($remainDias, $cardId);
                        }
                    }
                }
                
                foreach ($this->players as $userId => $player) {
                    if ($player->answer == 'exit') {
                        $this->players[$userId]->exitRoad();
                    }
                    
                    // 直前の回答を保存してクリアする
                    $this->players[$userId]->lastAnswer = $this->players[$userId]->answer;
                    $this->players[$userId]->answer = null;
                }

                if ($goPlayers) {
                    $this->goRoad();
                } else {
                    $this->newRoad();
                }
            }
        }
    }
    
    
    /**
    * 新しい坑道を始める
    */
    function newRoad()
    {
        $this->roadId++;

        if ($this->roadId <= self::ROADS) {
            // 坑道が残っている
    
            $this->road = new DiamontRoad($this->excludeCards);
            
            foreach ($this->players as $userId => $player) {
                $player->enterRoad();
            }
    
            $this->goRoad();
            
        } else {
            // 坑道が残っていない（全ての坑道を終了）
            $this->status = 'game_over';
        }
    }
    
    
    /**
    * 坑道を進む
    */
    function goRoad()
    {
        if ($this->road->go()) {
            // 進んだ先がダイヤモンド
            
            $dias = $this->road->card;
            
            // 山分け
            $goPlayers = array();
            
            foreach ($this->players as $userId => $player) {
                if (!$player->exit) {
                    $goPlayers[$userId] = $player;
                }
            }
            
            $playerCount = count($goPlayers);
            
            $playerDias = floor($dias / $playerCount);
            $remainDias = $dias % $playerCount;
            
            foreach ($goPlayers as $userId => $player) {
                $this->players[$userId]->roadScore += $playerDias;
            }
            
            $this->road->setRemainDias($remainDias, $this->road->cardId);
            
        } else {
            // 進んだ先がアクシデント
            if ($this->road->over) {
                // ２回目のアクシデント
                $this->excludeCards[$this->roadId] = $this->road->card;
                $this->newRoad();
            }
        }
    }
        
}