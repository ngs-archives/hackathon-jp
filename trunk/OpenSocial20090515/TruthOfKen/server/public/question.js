function init() {
	loadQestion();
}

function loadQestion(){
    // ajax通信を行います
    var url = "http://ec2-174-129-131-70.compute-1.amazonaws.com/questions?" + 
    $.getJSON("http://ec2-174-129-131-70.compute-1.amazonaws.com/questions?mixi_id=200",function (data) {  // (6) データ取得に成功した場合の処理を定義します。

        var question = data[0].question;    // (7) entryの各要素へアクセスします。
                var quest = question.quest;

                $('div#wrapper')                                                         // (8) a要素を生成
                    .html('<h3>' + quest + '</h3>')  // (10) a要素の子要素にimg要素を追加 
                                                          // (11) a要素を表示領域の子要素に追加
          
    });
}