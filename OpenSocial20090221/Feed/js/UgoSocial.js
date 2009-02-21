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
UgoSocial.showComment = function() {
   for ( var p in displayData.comments ) {
       var data = displayData.comments[p];
       setTimeout(function(){
           $('#comment_area').append('<p>' + data.comment + '</p>');
        },data.time);
   }
}
UgoSocial.init = function() {
    $('#event_trigger').click(UgoSocial.showComment);
}
gadgets.util.registerOnLoadHandler(UgoSocial.init);
//$(UgoSocial.init);

