<?php
/**
* Diamont ゲームクラス
*/
class DiamontGame
{
    /** ゲーム進行状況 */
    var $status;
    
    /** プレイ中の坑道 */
    var $road;
    
    /** プレイ中の坑道No */
    var $roadNo;
    
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
        $this->players = array();
        $this->excludeCards = array();
        $this->roadNo = 0;
    }
    
    
    /**
    * ゲーム進行
    */
    function process()
    {
        if ($this->status == 'waiting_player') {
            // プレイヤー参加待ち
            
            if (count($this->players) >= 3) {
                // 3人で開始
                $this->newRoad();                
            }
            
        } else if ($this->status == 'waiting_answer') {
            // プレイヤー回答待ち
            
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
                    foreach ($this->road->drawCards as $index => $card) {
                        if (is_numeric($card)) {
                            $dias = $card;
                            $playerDias = floor($dias / $playerCount);
                            $remainDias = $dias % $playerCount;
                            
                            foreach ($exitPlayers as $userId => $player) {
                                $this->players[$userId]->roadScore += $playerDias;
                            }
                            
                            $this->road->setRemainDias($remainDias, $index);
                        }
                    }
                }
                
                foreach ($this->players as $userId => $player) {
                    if ($player->answer == 'exit') {
                        $this->players[$userId]->exitRoad();
                    }
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
        if ($this->roadNo < 5) {
            $this->status = 'waiting_answer';
            $this->roadNo++;
    
            $this->road = new DiamontRoad($this->excludeCards);
            
            foreach ($this->players as $userId => $player) {
                $player->enterRoad();
            }
    
            $this->goRoad();
        } else {
            $this->status = 'game_over';
        }
    }
    
    
    /**
    * 坑道を進む
    */
    function goRoad()
    {
        if ($this->road->go()) {
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
            
            $this->road->setRemainDias($remainDias, count($this->road->drawCards)-1);
            
        } else {
            if ($this->road->over) {
                $this->excludeCards[] = $this->road->card;
                $this->newRoad();
            }
        }
    }
        
}