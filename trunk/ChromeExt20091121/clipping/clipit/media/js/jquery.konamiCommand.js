/*
 * jQuery konamiCommand @VERSION
 *
 * Copyright (c) 2009 ryoff
 */
(function() {
    jQuery.fn.konamiCommand = function(config){
        config = jQuery.extend({
                callback: konamiFunc,
                type    : 0
            },config);
        var typeList = [",38,38,40,40,37,39,37,39,66,65",                  /*↑↑↓↓←→←→BA*/
                        ",38,38,40,40,37,39,37,39,88,79",                  /*↑↑↓↓←→←→XO*/
                        ",38,38,40,40,37,39,37,39(,101,103,99|,53,55,51)", /*↑↑↓↓←→←→573(konami)*/
                        ",38,38,40,40,76,82,76,82,66,65"                   /*↑↑↓↓LRLRBA*/
                        ];
        var press_code = "";
        re = new RegExp(typeList[config.type]);
        this.keydown(function(key) {
            var kCode = key.charCode || key.keyCode || 0;
            press_code += "," + kCode;
            if (press_code.match(re)) {
                press_code = "";
                config.callback();
            }
        });
    };
})(jQuery);