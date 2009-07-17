<?php
/**
* Diamont プレイヤークラス
*/
class DiamontPlayer
{
    /** 安全に持ち帰ったダイアの数の合計 */
    var $totalScore;
    
    /** １つの坑道で手に入れたダイアの数（持ち帰る前）*/
    var $roadScore;
    
    /** プレイヤーが帰ったかどうか */
    var $exit;
    
    /** プレイヤーが先に進むかどうか */
    var $answer;
    
    /** 表示名 */
    var $displayName;
    
    /** サムネイルURL */
    var $thumbUrl;
    
    
    /**
    * コンストラクタ
    */
    function __construct($displayName, $thumbUrl)
    {
        $this->totalScore = 0;
        $this->displayName = $displayName;
        $this->thumbUrl = $thumbUrl;
    }
    
    
    /**
    * 坑道に入る
    */
    function enterRoad()
    {
        $this->roadScore = 0;
        $this->exit = false;
        $this->answer = null;
    }
    

    /**
    * 坑道を出る
    */
    function exitRoad()
    {
        $this->totalScore += $this->roadScore;
        $this->exit = true;
    }
        
}