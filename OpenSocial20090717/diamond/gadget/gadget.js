var cods = {};


cods.properties = {
    'debug': true
};


cods.debug = function(message) {
    if (cods.properties.debug) {
        if (!document.getElementById('debug')) {
            $('body').append('<div id="debug"></div>');
        }
        
        var contents = $('#debug').html();
        if (contents) {
            message = '<br />' + message;
        }
        contents += message;
        $('#debug').html(contents);
    }
};


cods.dump = function(obj) {
    jQuery.each(obj, function(key, value){
        if (typeof value == 'object') {
            cods.debug('>>> ' + key);
            cods.dump(value);
            cods.debug('<<< ' + key);
        } else {
            cods.debug(key + ': ' + value);
        }
    });
};


cods.getRequestParams = function() {
	var data = {};
	if (location.search.length > 1) {
		var params = location.search.substr(1).split("&");
        var length = params.length;
		for (i=0; i<length; i++) {
			var param = params[i].split("=");
			var key = param[0];
			var value = param[1];
			data[key] = value;
		}
	}
	return data;
};


cods.defaultRequestErrorCallback = function() {};
cods.defaultRequestCallback = function() {};


cods.fetchOwnerProfile = function(callback, errorCallback) {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), 'person');
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('fetchOwnerProfile Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            var item = res.get('person');
            if (item.hadError()) {
                cods.debug('fetchOwnerProfile Error ' + item.getErrorMessage());
                if (typeof errorCallback == 'function') {
                    errorCallback();
                } else {
                    cods.defaultRequestErrorCallback();
                }
            } else {
                var data = item.getData();
                cods.debug('fetchOwnerProfile Complete');
                if (typeof callback == 'function') {
                    callback(data);
                } else {
                    cods.defaultRequestCallback(data);
                }
            }
        }
    });
};


cods.fetchViewerProfile = function(callback, errorCallback) {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), 'person');
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('fetchViewerProfile Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            var item = res.get('person');
            if (item.hadError()) {
                cods.debug('fetchViewerProfile Error ' + item.getErrorMessage());
                if (typeof errorCallback == 'function') {
                    errorCallback();
                } else {
                    cods.defaultRequestErrorCallback();
                }
            } else {
                var data = item.getData();
                cods.debug('fetchViewerProfile Complete');
                if (typeof callback == 'function') {
                    callback(data);
                } else {
                    cods.defaultRequestCallback(data);
                }
            }
        }
    });
};


cods.fetchOwnerData = function(names, callback, errorCallback) {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonAppDataRequest(opensocial.IdSpec.PersonId.OWNER, names), 'owner');
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('fetchOwnerData Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            var item = res.get('owner');
            
            if (item.hadError()) {
                cods.debug('fetchOwnerData Error ' + res.getErrorMessage());
                if (typeof errorCallback == 'function') {
                    errorCallback();
                } else {
                    cods.defaultRequestErrorCallback();
                }
            } else {
                var data = item.getData();
                cods.debug('fetchOwnerData Complete');
                if (typeof callback == 'function') {
                    callback(data);
                } else {
                    cods.defaultRequestCallback(data);
                }
            }            
        }
    });
};


cods.fetchViewerData = function(names, callback, errorCallback) {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, names), 'viewer');
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('fetchViewerData Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            var item = res.get('viewer');
            
            if (item.hadError()) {
                cods.debug('fetchViewerData Error ' + res.getErrorMessage());
                if (typeof errorCallback == 'function') {
                    errorCallback();
                } else {
                    cods.defaultRequestErrorCallback();
                }
            } else {
                var data = item.getData();
                cods.debug('fetchViewerData Complete');
                if (typeof callback == 'function') {
                    callback(data);
                } else {
                    cods.defaultRequestCallback(data);
                }
            }            
        }
    });
};


cods.updateViewerData = function(name, value, callback, errorCallback) {
    value = encodeURIComponent(value);
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, name, value));
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('updateViewerData Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            cods.debug('updateViewerData Complete');
            if (typeof callback == 'function') {
                callback();
            } else {
                cods.defaultRequestCallback();
            }
        }
    });
};


cods.removeViewerData = function(names, callback, errorCallback) {
    var req = opensocial.newDataRequest();
    req.add(req.newRemovePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, names));
    req.send(function(res) {
        if (res.hadError()) {
            cods.debug('removeViewerData Error ' + res.getErrorMessage());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            cods.debug('removeViewerData Complete');
            if (typeof callback == 'function') {
                callback();
            } else {
                cods.defaultRequestCallback();
            }
        }            
    });
};


cods.createActivity = function(message, callback, errorCallback) {
    var params = {};
    params[opensocial.Activity.Field.TITLE] = message;
    var activity = opensocial.newActivity(params);

    opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority.HIGH, function(res) {
        if (res.hadError()) {
            cods.debug('createActivity Error ' + response.getErrorCode());
            if (typeof errorCallback == 'function') {
                errorCallback();
            } else {
                cods.defaultRequestErrorCallback();
            }
        } else {
            cods.debug('createActivity Complete');
            if (typeof callback == 'function') {
                callback();
            } else {
                cods.defaultRequestCallback();
            }
        }
    });
};

cods.makeRequest = function(url, post_data, callback, errorCallback) {

    var params = {};

    params[gadgets.io.RequestParameters.METHOD]        = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.CONTENT_TYPE]  = gadgets.io.ContentType.JSON;
    params[gadgets.io.RequestParameters.POST_DATA]     = gadgets.io.encodeValues(post_data);
    params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
    
    gadgets.io.makeRequest(url, function(response) {
	callback(response.data);
    }, params);
};
