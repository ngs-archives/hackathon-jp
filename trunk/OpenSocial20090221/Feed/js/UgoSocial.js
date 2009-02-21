var displayData = {
    memoId : 'ugomemo:XXXXXXXXXXXXX:BBBBBBBBBBBBBBBB',
    comments : [
        {
            time    : 1000,
            user    : 'chris4403',//TODO fix to userid
            comment : 'ほげほげ'
        },
        {
            time    : 2000,
            user    : 'someda',//TODO fix to userid
            comment : 'もげもげー'
        },
        {
            time    : 3000,
            user    : 'nakazoe',//TODO fix to userid
            comment : 'うごうごー'
        }
    ]
}

var UgoSocial = {};
UgoSocial.setComments = function() {
   for ( var p in displayData.comments ) {
       var data = displayData.comments[p];
       var func ="setTimeout(function(){UgoSocial.showComment('" + data.comment + "')},"+ data.time +");";
       eval(func);
   }
}
UgoSocial.showComment = function(comment) {
//    $('#comment_area').append('<p>' + comment + '</p>');
    $('<p>' + comment + '</p>').css({position:'relative',left:'200px'}).appendTo('#comment_area').animate({left:'-200px'},2000);
}
UgoSocial.init = function() {
    $('#event_trigger').click(UgoSocial.setComments);
}
gadgets.util.registerOnLoadHandler(UgoSocial.init);

