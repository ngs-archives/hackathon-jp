var dui = {};


dui.vars = {};


dui.startCountDown = function(callback) {
    dui.countDown(30, callback);
};


dui.stopCountDown = function() {
    $('#count').html('');
    clearInterval(dui.vars.countDownInterval);
};


dui.countDown = function(count, callback) {
    clearInterval(dui.vars.countDownInterval);

    dui.vars.count = count;
    
    dui.countAnimate();
    
    dui.vars.countDownInterval = setInterval(function() {
        dui.vars.count--;
        
        if (dui.vars.count <= 0) {
            $('#count').html('');
            clearInterval(dui.vars.countDownInterval);
            callback();
        } else {
            dui.countAnimate();
        }
    }, 1000);
};


dui.countAnimate = function() {
    $('#count').css('opacity', 1)
               .css('font-size', 120)
               .html(dui.vars.count)
               .animate({opacity: 0, fontSize: 100}, 700);
};