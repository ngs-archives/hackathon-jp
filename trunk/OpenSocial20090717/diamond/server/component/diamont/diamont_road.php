<?php
/**
* Diamont 坑道クラス
*/
class DiamontRoad
{
    /** 坑道カード一式（ダイアモンド） */
    static $diaCards = array(
        2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
    );
    
    /** 坑道カード一式（アクシデント） */
    static $dangerCards = array(
        'Sneak', 'Sneak', 'Sneak',
        'Explosion', 'Explosion', 'Explosion',
        'Gas', 'Gas', 'Gas',
        'Scorpion', 'Scorpion', 'Scorpion',
        'Rock', 'Rock', 'Rock',
    );
    
    
    /** 最後にめくったカードNo. */
    var $cardNo;
    
    /** 最後にめくったカード */
    var $card;
    
    /** 引いたカード */
    var $drawCards;
    
    /** ゲームで使われるカード一式 */
    var $cards;
    
    /** 坑道がおわったかどうか */
    var $over;
    
    
    /**
    * コンストラクタ
    * @param 坑道から除外するアクシデントを配列で指定
    */
    function __construct($excludeCards = array())
    {
        $this->cardNo = 0;
        $this->drawCards = array();
        $this->over = false;
        
        $this->cards = array_merge(self::$diaCards, self::$dangerCards);
        
        // アクシデント除外
        foreach ($excludeCards as $excludeCard) {
            foreach ($this->cards as $index => $card) {
                if ($card == $excludeCard) {
                    array_splice($this->cards, $index, 1);
                    break;
                }
            }
        }
        
        // カードをシャッフル
        shuffle($this->cards);
    }
    
    
    /**
    * 進む
    * @return 進んだ先がダイアモンドだったかどうか
    */
    function go()
    {
        $this->card = $this->cards[$this->cardNo];
        $this->cardNo++;
        
        $isDiamond = true;

        if (!is_numeric($this->card)) {
            // アクシデント
            $isDiamond = false;
            
            // アクシデントが２回目かどうかチェック
            foreach ($this->drawCards as $index => $card) {
                if ($this->card === $card) {
                    // ２回目
                    $this->over = true;
                }
            }
        }
        
        $this->drawCards[] = $this->card;

        return $isDiamond;
    }
    
    
    /**
    * 山分けで残ったダイヤをセット
    * @param $remainDias 残ったダイア数
    * @param $index カードのインデックス番号
    */
    function setRemainDias($remainDias, $index)
    {
        $this->drawCards[$index] = $remainDias;
    }
    
}