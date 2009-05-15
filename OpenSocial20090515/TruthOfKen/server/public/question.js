function init() {
	loadQestion();
}

function loadQestion(){
    // ajax通信を行います
    $.getJSON("http://ec2-174-129-131-70.compute-1.amazonaws.com/questions?mixi_id=2000",function (data) {

        var question = data[0].question;
        var quest = question.quest;
        $('div#wrapper') 
            .html('<h3>' + quest + '</h3>') 
    });
}