// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8 nobomb:
/**
 * function
 *
 * @author mingcheng<i.feelinglucky#gmail.com>
 * @date   2009-11-15
 * @link   http://www.gracecode.com/
 */

/**
 * 使用内置存储作为记录器
 */
// /*
var logger = (function () {
    if (typeof localStorage == 'undefined') {
        return console;
    }

    try {
        var consoleData = JSON.parse(localStorage['console_data']) || [];
    } catch (e) {
        console.warn('logger: initial consoleData');
        var consoleData = [];
    }

    var insert = function (message, type) {
        message = (new Date().toString()) + ":\n  " + message + '';
        consoleData.push({
            message: message, type: type
        });
        localStorage['console_data'] = JSON.stringify(consoleData);
    }

    return {
        log: function(message) {insert(message, 'log');},
        warn: function(message) {insert(message, 'warn');},
        info: function(message) {insert(message, 'info');},
        error: function(message) {insert(message, 'error');},
        clear: function() {
            localStorage['console_data'] = JSON.stringify([]);
        },
        getAll: function() {
            try {
                return JSON.parse(localStorage['console_data']) || [];
            } catch (e) {
                console.warn('logger: initial consoleData');
                return [];
            }
        }
    };
})();

// 获取配置信息
var getConf = function(options, def) {
    return localStorage[options] ? localStorage[options] : def;
}

var setConf = function(options, val) {
    localStorage[options] = val;
}

var setStatus = function(name, val) {
    localStorage[name] = val;
}

var getStatus = function(name) {
    return localStorage[name] ? localStorage[name] : '';
}

// 设置标签数字
var setBadgeText = function(text)  {
    if (chrome) {
        chrome.browserAction.setBadgeText({text: text + ''});
    }
}

// 返回相对时间
var relativeTime = function (inputTimestampStr) {
    var inputTimestamp = Date.parse(inputTimestampStr);
    var nowTimestamp = new Date().getTime();

    var diff = (nowTimestamp - inputTimestamp) / 1000;
    if(diff < 15) {
        return "Just now";
    } else if(diff < 60) {
        return "Less than 1 minute ago";
    } else if(diff < 60 * 60) {
        var minutes = parseInt(diff / 60);
        return minutes + " minute" + ((minutes > 1) ? "s" : "") + " ago";
    } else if(diff < 60 * 60 * 24) {
        var hours = parseInt(diff / (60 * 60));
        return "about " + hours + " hour" + ((hours > 1) ? "s" : "") + " ago";
    } else if(diff < 60 * 60 * 24 * 30) {
        var days = parseInt(diff / (60 * 60 * 24));
        return "about " + days + " day" + ((days > 1) ? "s" : "") + " ago";
    } else if(diff < 60 * 60 * 24 * 30 * 12) {
        var months = parseInt(diff / (60 * 60 * 24 * 30));
        return "about " + months + " month" + ((months > 1) ? "s" : "") + " ago";
    } else {
        return "years ago";
    }
}
