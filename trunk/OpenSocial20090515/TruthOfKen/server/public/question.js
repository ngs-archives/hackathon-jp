function init() {
	loadQestion();
}

function loadQestion(){
    // ajax通信を行います
    $.ajax({
        dataType: "jsonp",    // (3) データ形式はJSONPを指定します。
        data: {               // (4) リクエストパラメータを定義します。
            "mixi_id": "2000"
        },
        cache: true,          // (5) キャッシュを使用します。
        url: "http://ec2-174-129-131-70.compute-1.amazonaws.com/questions",
        success: function (data) {  // (6) データ取得に成功した場合の処理を定義します。

            $("#videos").empty();
            $.each(data.question, function(i,item){    // (7) entryの各要素へアクセスします。
                var quest = item.quest;

                $("<p/>")                                                         // (8) a要素を生成
                    .append(quest)  // (10) a要素の子要素にimg要素を追加 
                                                          // (11) a要素を表示領域の子要素に追加
            });
        }
    });
}