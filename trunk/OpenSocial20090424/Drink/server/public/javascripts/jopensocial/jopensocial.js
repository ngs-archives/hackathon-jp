/**
 * @fileoverview A jQuery plugin for OpenSocial Compatibiblity
 * @author Atushi Nagase
 * @copyright Copyright (C) Atsushi Nagase
 * @license The Apache License, version 2
 * @see <a href="http://code.google.com/p/jopensocial/">Google Code</a>
 */
 
/** @class
 * @name jQuery */
/** @namespace
 * @name jQuery.opensocial */
/** @namespace
 * @name jQuery.opensocial.data */
/** @namespace
 * @name jQuery.opensocial.activity */
/** @namespace
 * @name jQuery.gadgets */

;(function(){
try {
	var $ = jQuery; $();
	var domain = opensocial.getEnvironment().getDomain();
} catch(e) { return; }

// _____________private_____________

/**
 * @private
 */
function _request( map, callback ) {
	var req = opensocial.newDataRequest();
	$.each(map,function( i ){
		if(typeof(this)=="function")
			req.add( this.call(req), i );
	});
	req.send(function( res ) {
		var obj = {};
		$.each(map,function(i){
			var item = res.get(i);
			obj[i] = item.hadError() ? { error:1 } : item.getData();
		});
		if(typeof(callback)=="function") callback(obj);
	});
}

var
	_cachedPeople = {}, 
	_cachedData = {},
	_ownerId, 
	_viewerId;

// _____________public_____________


/**
 * Contianer information
 * @name jQuery.opensocial.container
 * @field
 */
var container = {
	myspace	: /myspace\.com/.test(domain),
	google	: /google\.com/.test(domain),
	orkut	: /orkut\.com/.test(domain),
	mixi	: /mixi/.test(domain),
	partuza	: /partuza\.nl/.test(domain)
}

/**
 * Alias for gadgets.util.registerOnLoadHandler
 * @name jQuery.gadgets.ready
 * @function
 * @see <a href="http://code.google.com/apis/opensocial/docs/0.8/reference/gadgets/#gadgets.util.registerOnLoadHandler">gadgets.util.registerOnLoadHandler</a>
 */
function ready(callback) {
	if(!callback) return;
	try {
		gadgets.util.registerOnLoadHandler(callback);
	} catch(e) {
		$(callback);
	}
}

/**
 * Navigate to view by view name as string.<br />
 * Returns next view.<br />
 * If view is not set, returns current view.
 * @name jQuery.gadgets.view
 * @function
 * @param view
 * @param opt_params
 * @param no_navigate Boolean
 * @returns gadgets.views.View
 */

function view(view,opt_params,no_navigate) {
	if(!view) return gadgets.views.getCurrentView();
	var obj = _getViewObject(view);
	if(!obj) return;
	if(!no_navigate) gadgets.views.requestNavigateTo(obj,opt_params);
	return obj;
}

/**
 * @private */

function _getViewObject(view) {
	if(!gadgets||!gadgets.views||!gadgets.views.getSupportedViews||!view) return;
	var rtn;
	$.each(gadgets.views.getSupportedViews(), function(){
		if(view == this.getName()) {
			rtn = this;
			return false;
		}
	});
	if(rtn) return rtn;
}

/**
 * Alias for gadgets.views.getParams()
 * @name jQuery.gadgets.viewParam
 * @function
 * @see <a href="http://code.google.com/apis/opensocial/docs/0.8/reference/gadgets/#gadgets.views.getParams">gadgets.views.getParams</a>
 */

/**
 * Get and set gadget height
 * @name jQuery.gadgets.height
 * @function
 * @param opt_height auto:String/height:uint
 * @returns gadget height
 */

function gadgetHeight(opt_height) {
	if(opt_height) gadgets.window.adjustHeight(opt_height=="auto"?null:opt_height);
	return gadgets.window.getViewportDimensions().height;
}

/**
 * Get gadget width
 * @name jQuery.gadgets.width
 * @function
 * @returns gadget width
 */

function gadgetWidth() {
	return gadgets.window.getViewportDimensions().width;
}

/**
 * @private */
function _makeRequest(url,data,callback,is_json,is_post) {
	if(!url) return;
	if(typeof(data)=="function"&&!callback) {
		is_post = is_json;
		is_json = callback;
		callback = data;
		data = {};
	}
	data = data || "";
	if(typeof(data)!="string") data = $.param(data);
	var param = {};
	if(is_post) {
		param[gadgets.io.RequestParameters.POST_DATA] = data;
	} else {
		if(url.search(/\?/)==-1) url += "?";
		if(!url.match(/.*&$/)) url+="&";
		url += data;
	}
	param[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType[is_json?"JSON":"DOM"];
	param[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType[is_post?"POST":"GET"];
	param[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.NONE;
	//Authorization not supported.
	gadgets.io.makeRequest(url,function(res){
		if(!res||!res.data) return callback(null);
		if(is_json) return callback(res.data);
		callback($(res.data)); 
	}, param);
	
}
/**
 * Get JSON content
 * @name jQuery.gadgets.getJSON
 * @function
 * @param url
 * @param data
 * @param callback
 * @example $.gadgets.getJSON(
 *   "http://domain.tld/path/to/json",
 *   { entry_id:"123" }, // GET parameters
 *   function(d) { console.log(d); });
 */
function getJSON(url,data,callback) {
	_makeRequest(url,data,callback,true,false);
}


/**
 * Get XML content as jQuery object
 * @name jQuery.gadgets.ajax
 * @function
 * @param url
 * @param data
 * @param callback
 * @example $.gadgets.ajax(
 *   "http://jopensocial.googlecode.com/svn/trunk/tests/test.xml",
 *   { entry_id:"123" }, // GET parameters
 *   function(d) { alert($("Require",d).attr("feature")); });
 */
function getXML(url,data,callback) { 
	_makeRequest(url,data,callback,false,false);
}

/**
 * Post content and get content with callback 
 * @name jQuery.gadgets.post
 * @function
 * @param url
 * @param data
 * @param callback
 * @param type ContentType(XML,JSON)
 * @example $.gadgets.post(
 *   "http://domain.tld/path/to/json",
 *   { entry_id:"123" }, // POST data
 *   function(d) { console.log(d); },
 *   "JSON");
 */
function postData(url,data,callback,type) { 
	_makeRequest(url,data,callback,(type||"").toUpperCase()=="JSON",true);
}

/**
 * Fetch UserAppData
 * @name jQuery.opensocial.data.get
 * @function
 * @param key
 * @param userId
 * @param callback
 * @param useCache
 * @example $.opensocial.data.get(
 *   "viewer",
 *   "sampledata",
 *   function(d) { console.log(d); },
 *   false);
 */
function fetchAppData( key, userId, callback, useCache ) {
	callback = callback || function() { return false; }
	userId = userId || opensocial.IdSpec.PersonId.VIEWER;
	if( !key ) {
		callback(null);
		return;
	}
	person(userId,function(psn){
		if(!psn) return callback(null);
		var id = psn.getId();
		if(useCache && _cachedData[id] && _cachedData[id][key]!=undefined)
			return callback( _cachedData[id][key] );
		var obj = {
			userData : function() { return this.newFetchPersonAppDataRequest(opensocial.newIdSpec({userId:id}),[key]); }
		}
		_request(obj, function(res) {
			if(!res.userData||!res.userData[id]) return callback(null);
			var val = res.userData[id][key];
			var rtn;
			try {
				rtn = gadgets.json.parse(gadgets.util.unescapeString(val));
			} catch(e) {
				rtn = val;
			}
			_cachedData[id] = _cachedData[id] || {};
			_cachedData[id][key] = rtn;
			callback(rtn);
		});
	});
}

/**
 * Update UserAppData; VIEWER Only.
 * @name jQuery.opensocial.data.set
 * @function
 * @param key
 * @param value
 * @param callback
 */
function updateAppData( key, value, callback ) { // VIEWER only
	callback = callback || function() { return false; }
	if(!key) callback( {  } );
	var obj = {
		userData : function() {
			return this.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, key, gadgets.json.stringify(value));
		}
	};
	_request(obj, function(res) {
		callback(true);
	});
	
}
/**
 * Remove UserAppData; VIEWER Only.
 * @name jQuery.opensocial.data.remove
 * @function
 * @param key
 * @param callback
 */
function removeAppData( key, callback ) { 
	callback = callback || function() { return false; }
	if(!key) callback( {  } );
	var obj = {
		userData : function() {
			return this.newRemovePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, key );
		}
	}
	_request(obj, function(res) {
		callback(true);
	});
}

/**
 * Returns cached person; Get person with callback
 * @name jQuery.opensocial.person
 * @function
 * @param id
 * @param callback
 * @returns Cached person or null
 * @see <a href="http://code.google.com/apis/opensocial/docs/0.8/reference/#opensocial.Person_method_summary">Class opensocial.Person</a>
 */
function person(id,callback) {
	if(!id) {
		callback(null);
		return null;
	}
	if(typeof(callback)!="function") callback = function(){};
	var um = id.match(/^OWNER$|^VIEWER$/i);
	if(um) {
		id = um[0].toUpperCase();
		switch(id) {
			case "VIEWER": id = _viewerId||id; break;
			case "OWNER" : id = _ownerId||id; break;
		}
	}
	if(_cachedPeople[id]) {
		callback(_cachedPeople[id]);
		return _cachedPeople[id];
	}
	var obj = {
		userId : function() {
			return this.newFetchPersonRequest(id);
		}
	}
	_request(obj,function(res) {
		if(res&&res["userId"]) {
			var user = res["userId"];
			var id = user.getId();
			if(res.userId.isViewer()) _viewerId = id;
			if(res.userId.isOwner()) _ownerId = id;
			_cachedPeople[id] = user;
			callback(user);
		} else callback(null);
	});
	return null;
}

/**
 * Get cached people
 * @name jQuery.opensocial.people
 * @function
 * @returns Map.&lt;id,person&gt;
 */
function getCachedPeople() {
	return _cachedPeople;
}

/**
 * Get friends as array with callback<br />
 * The people will be cached.
 * @name jQuery.opensocial.getPeople
 * @function
 * @param userId default VIEWER
 * @param opt_params
 * @param callback
 */
function getPeople(userId,opt_params,callback) {
	userId = userId || "VIEWER";
	callback = callback || function(){ return false; }
	opt_params = opt_params || {};
	var idspec = opensocial.newIdSpec({ userId:userId, groupId:"FRIENDS" });
	var f;
	f = opensocial.DataRequest.PeopleRequestFields.FILTER;
	opt_params[f] = opt_params[f] || opensocial.DataRequest.FilterType.ALL;
	f = opensocial.DataRequest.PeopleRequestFields.MAX;
	opt_params[f] = opt_params[f] || 1000;
	_request({
		people : function() {
			return this.newFetchPeopleRequest(idspec,opt_params)
		}
	},function(res){
		if(!res||!res.people) {
			callback(null);
			return false;
		}
		var ar = [];
		res.people.each(function(p){
			ar.push(p);
			_cachedPeople[p.getId()] = p;
		});
		callback(ar);
	});
}


/**
 * Send Activity
 * @name jQuery.opensocial.activity.send
 * @function
 * @param title String
 * @param body String
 * @param hi_priority Boolean
 * @param opt_params Map&gt;opensocial.Activity.Field,value&lt;
 * @param callback Function
 */ 
function sendActivity(title,body,hi_priority,opt_params,callback) {
	opt_params = opt_params || {};
	var prm = {};
	prm[opensocial.Activity.Field.TITLE] = title || "";
	prm[opensocial.Activity.Field.BODY] = body || "";
	var a = opensocial.newActivity($.extend(opt_params,prm));
	var pri = opensocial.CreateActivityPriority[hi_priority?"HI":"LOW"];
	opensocial.requestCreateActivity(a,pri,function(e){
		if(typeof(callback)=="function") callback(e&&!e.hadError());
		return false;
	})
}

$.extend({
	opensocial : {
		container : container,
		data : {
			get : fetchAppData,
			set : updateAppData
		},
		activity : {
			send : sendActivity
		},
		person : person,
		people : getCachedPeople,
		getPeople : getPeople
	},
	gadgets : {
		ready : ready,
		view : view,
		viewParams : gadgets.views.getParams,
		height : gadgetHeight,
		width : gadgetWidth,
		getJSON : getJSON,
		ajax : getXML,
		post : postData
	}
});

})();
