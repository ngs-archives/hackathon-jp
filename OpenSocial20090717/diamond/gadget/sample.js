var mobako = {};


mobako.properties = {
    'size': 120,
    'appServerUrl': 'http://mobako.codsworks.com/'
};


mobako.vars = {};

mobako.request = {};


mobako.status = {
    'mood': 'normal',
    'lock': false,
    'messageAddCount': 0
};


mobako.messages = {
    'invalidateNocontents':       'なにか文字を入れてね！',
    'invalidateContentsSizeOver': '文字が多すぎるわね...',
    'activitySaveComplete':       'コードをツクったわよ♪ モバコ',
    'saveComplete':               'コードを保存したわ♪',
    'removeComplete':             'コードをステたわ<br />またツクってね！',
    'locking':                    '...ちょっと待ってね！',
    'sendActivityError':          'でも、ちょっと失敗<br />みんなへのお知らせが<br />できなかったわ',
    'requestError':               'あれ...失敗？<br />うーんダメみたい<br />ゴメン！また後で',
    'dataError':                  'あれ...失敗？<br />うーんダメみたい<br />ゴメン！また後で',
    'messageAddLimit':            'もうっ！しつこい！',
    'badMood':                    '・・・',
    'betterMood':                 'さっきはゴメンね<br />もう大丈夫！',
    'callReply':                  'なに？'
};


mobako.actions = {};


mobako.actions.badMood = function() {
    clearTimeout(mobako.vars.badMoodTimeout);
    mobako.hideFlow();
    mobako.status.mood = 'bad';
    mobako.vars.badMoodTimeout = setTimeout(function() {
        mobako.status.mood = 'normal';
        mobako.showMessage('betterMood');
        mobako.showFlow();
    }, 15000);
};


mobako.actions.noproblem = function() {
    mobako.hideFlow();
    mobako.showMessageOne('そう...')
    setTimeout(function() {
        mobako.backFlow();
    }, 2000);
};


mobako.actions.interested = function() {
    mobako.status.action = 'interested';
    mobako.hideFlow('callMenu');
    mobako.showMessageOne('え！？ワタシ？', true);
    setTimeout(function() {mobako.showMessageOne('それじゃ少しだけ話そ!');
    setTimeout(function() {mobako.showMessageOne('今はあまり時間がなくて...');
    setTimeout(function() {mobako.showMessageOne('えーっと');
    setTimeout(function() {mobako.showMessageOne('えーっと.');
    setTimeout(function() {mobako.showMessageOne('えーっと..');
    setTimeout(function() {mobako.showMessageOne('えーっと...');
    setTimeout(function() {mobako.showMessageOne('あ！ゴメン！');
    setTimeout(function() {mobako.showMessageOne('忘れてた！');
    setTimeout(function() {mobako.showMessageOne('やることあったんだぁ...');
    setTimeout(function() {mobako.showMessageOne('また今度話そ！');
    setTimeout(function() {mobako.showMessageOne('ホントにゴメンね');
    setTimeout(function() {mobako.backFlow();
        mobako.status.action = null;
    }, 2000);
    }, 2000);
    }, 3000);
    }, 2000);
    }, 2000);
    }, 2000);
    }, 1000);
    }, 1000);
    }, 1000);
    }, 2000);
    }, 2000);
    }, 2000);
};


mobako.convertContents = function(contents) {
    contents = contents.replace(/\n/g, "\r\n");
    return contents;
};


mobako.encodeContents = function(contents) {
    contents = mobako.convertContents(contents);
    contents = encodeURIComponent(contents);
    return contents;
};


mobako.updateQrCodeImg = function(contents, selector, preview) {
    cods.debug('updateQrCodeImg');
    
    var size = mobako.properties.size;
    encodedContents = mobako.encodeContents(contents);
    var url = 'http://chart.apis.google.com/chart';
    var params = 'cht=qr&choe=Shift_JIS&chld=L|1&chs=' + size + 'x' + size + '&chl=' + encodedContents;
    var src = url + '?' + params;
    
    $(selector).attr('src', src).css('width', size).css('height', size);

    if (preview) {
        $(selector).attr('title', contents);
    }
};


mobako.getMessage = function(key, overwrite) {
    var message = $('#mobakoMessage').html();
    
    if (mobako.status.mood == 'bad') {
        mobako.actions.badMood();
        message = mobako.messages.badMood;
        
    } else {
        var newMessage = key;
        if (mobako.messages[key]) {
            newMessage = mobako.messages[key];
        }
    
        if (message && !overwrite) {
            if (mobako.status.messageAddCount < 4) {
                mobako.status.messageAddCount++;
                message += '<br />' + newMessage;
            } else {
                message = mobako.messages.messageAddLimit;
                mobako.actions.badMood();
            }
        } else {
            message = newMessage;
        }
    }
    
    return message;
};


mobako.showMessageOne = function(key) {
    mobako.showMessage(key, true);
};


mobako.showMessage = function(key, overwrite) {
    cods.debug('showMessage');
    
    clearTimeout(mobako.vars.mobakoMessageTimeout);
    
    var message = mobako.getMessage(key, overwrite);
    
    $('#mobakoMessage').html(message);
    $('#mobakoMessage').css('opacity', 0.8);
    $('#mobakoMessage').fadeIn(200, function() {
        mobako.vars.mobakoMessageTimeout = setTimeout(function() {
            $('#mobakoMessage').fadeOut(200, function() {
                $('#mobakoMessage').html('');
                mobako.status.messageAddCount = 0;
            });
        }, 4000);
    });
};


mobako.create = function() {
    if (mobako.isOwner()) {
        mobako.showFlow('create');
        $('#contentsInput').focus();
    } else {
        mobako.showFlow('installInfo');
    }
};


mobako.validateContents = function() {
    cods.debug('validateContents');

    var contents = $('#contentsInput').val();
    var valid = true;
    
    if (contents == '') {
        mobako.showMessage('invalidateNocontents');
        valid = false;
    } else {
        var encodedContents = mobako.encodeContents(contents);
        cods.debug('length: ' + encodedContents.length);

        if (encodedContents.length > 1200) {
            mobako.showMessage('invalidateContentsSizeOver');
            valid = false;    
        }
    }
    
    if (!valid) {
        $('#contentsInput').focus();
    }
    
    return valid;
};


mobako.preview = function() {
    cods.debug('preview');
    
    if (mobako.validateContents()) {
        contents = $('#contentsInput').val();
        mobako.updateQrCodeImg(contents, '#qrCodeImgPreview', true);
        mobako.showFlow('preview');
    }
};


mobako.updateAppServerContents = function(contents) {
    var url = mobako.properties.appServerUrl + 'update.php';

    cods.debug('updateAppServerContents ' + url);
    
    var post_data = {
        'id': mobako.owner.id,
        'contents': mobako.convertContents(contents)
    };

    var params = {};
    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.POST;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.TEXT;
    params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_data);
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    gadgets.io.makeRequest(url, function(response) {
        cods.debug('response: ' + response.data);
    }, params);
};


mobako.saveActivity = function() {
    cods.createActivity(mobako.getMessage('activitySaveComplete'),
        function() {
        },
        function() {
            mobako.showMessage('sendActivityError');
        }
    );
}


mobako.load = function() {
    cods.fetchViewerData(['contents'],
        function(data) {
            var contents = null;
            for (var id in data) {
                contents = decodeURIComponent(data[id]['contents']);
            }
            
            if (contents) {
                $('#contentsInput').val(contents);
                
                if (mobako.isOwner()) {
                    mobako.updateQrCodeImg(contents, '#qrCodeImgForOwner', true);
                    mobako.showFlow('ownerMenu');
                } else {
                    mobako.updateQrCodeImg(contents, '#qrCodeImgForFriend', false);
                    mobako.showFlow('friendMenu');
                }
            } else {
                mobako.showFlow('nocontents');
            }
        },
        function() {
            mobako.showMessage('requestError');
        }
    );
};


mobako.loadOwnerData = function() {
    cods.fetchOwnerData(['contents'],
        function(data) {
            var contents = null;
            for (var id in data) {
                contents = decodeURIComponent(data[id]['contents']);
            }
            
            if (contents) {
                mobako.updateQrCodeImg(contents, '#qrCodeImg', false);
                mobako.showFlow('code');
            } else {
                mobako.showFlow('nocontents');
            }
        },
        function() {
            mobako.showMessage('requestError');
        }
    );
};


mobako.removeConfirm = function() {
    mobako.showFlow('removeConfirm');
};


mobako.save = function() {
    if (mobako.lock()) {
        var contents = $('#contentsInput').val();
        cods.updateViewerData('contents', contents,
            function() {
                mobako.saveActivity();
                mobako.showMessage('saveComplete');
                mobako.hideFlow('preview');
                mobako.updateQrCodeImg(contents, '#qrCodeImgForOwner', true);
                mobako.updateAppServerContents(contents);
                setTimeout(function() {
                    mobako.showFlow('ownerMenu');
                    mobako.unlock();
                }, 1600);
            },
            function() {
                mobako.showMessage('requestError');
                mobako.unlock();
            }
        );
    }
};


mobako.remove = function() {
    if (mobako.lock()) {
        cods.removeViewerData(['contents'],
            function() {
                mobako.showMessage('removeComplete');
                mobako.hideFlow('removeConfirm');
                $('#contentsInput').val('');
                mobako.updateAppServerContents('');
                setTimeout(function() {
                    mobako.showFlow('nocontents');
                    mobako.unlock();
                }, 1600);
            },
            function() {
                mobako.showMessage('requestError');
                mobako.unlock();
            }
        );
    }
};


mobako.lock = function() {
    if (mobako.status.lock) {
        mobako.showMessage('locking');
        return false;
    } else {
        mobako.status.lock = true;
        return true;
    }
};


mobako.unlock = function() {
    mobako.status.lock = false;
};


mobako.hideFlow = function(id) {
    if (!id) {
        id = mobako.status.currentFlowId;
    }
    
    if (id) {
        $('#' + id).fadeOut(300);
    }
};


mobako.showFlow = function(id) {
    if (!id) {
        id = mobako.status.currentFlowId;
    }
    
    cods.debug('showFlow ' + id);
    
    if (mobako.status.currentFlowId) {
        if (id != mobako.status.currentFlowId) {
            mobako.status.lastFlowId = mobako.status.currentFlowId;
        }
        $('#' + mobako.status.currentFlowId).hide();
    }

    mobako.status.currentFlowId = id;

    $('#' + id).fadeIn(300);
};


mobako.backFlow = function() {
    if (mobako.status.lastFlowId) {
        mobako.showFlow(mobako.status.lastFlowId);
    }
};


mobako.call = function() {
    if (!mobako.status.action) {
        mobako.showMessage('callReply');
        if (mobako.status.mood != 'bad') {
            mobako.showFlow('callMenu');
        }
    }
};


mobako.initProfile = function() {
    cods.fetchOwnerProfile(
        function(data) {
            mobako.owner = {
                'id': data.getId(),
                'name': data.getDisplayName()
            };
            cods.debug('owner id: ' + mobako.owner.id);
        }
    );
    cods.fetchViewerProfile(
        function(data) {
            mobako.viewer = {
                'id': data.getId(),
                'name': data.getDisplayName()
            };
            cods.debug('viewer id: ' + mobako.viewer.id);
        }
    );
};


mobako.isOwner = function() {
    if (mobako.owner.name == mobako.viewer.name) {
        return true;
    }
    return false;
};


mobako.setAppTopLink = function() {
    var referrer = document.referrer;
    var runAppTop = referrer.replace(/&.*/, '');
    var viewAppTop = runAppTop.replace('run_appli', 'view_appli');
    cods.debug(viewAppTop);
    
    $('#appTopLink').attr('href', viewAppTop);
};


mobako.initCanvas = function() {
    $('#mobako').click(mobako.call);
    $('#qrCodeInfo').css('opacity', 0.8);
    
    mobako.setAppTopLink();
    mobako.initProfile();
    
    mobako.vars.initProfileInterval = setInterval(function() {
        if (typeof mobako.owner == 'object' && typeof mobako.viewer == 'object') {
            clearInterval(mobako.vars.initProfileInterval);
            $('.ownerName').html(mobako.owner.name);
            
            
            var contents = "ツクったコードは下のページからも見れる様にしといたわ\n\n";
            contents    += "友達に見せたりいろんな使い方をしてみて！\n\n";
            contents    += mobako.properties.appServerUrl + '?id=' + mobako.owner.id;
            contents    += "\n\nモバコ♪";
            mobako.updateQrCodeImg(contents, '#qrCodeImgForInfo');

            mobako.load();
        }
    }, 100);
};
