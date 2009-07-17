/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
 
/**
 * @fileoverview Open Gadget Container
 */
 
var gadgets = gadgets || {};
 
gadgets.error = {};
gadgets.error.SUBCLASS_RESPONSIBILITY = 'subclass responsibility';
gadgets.error.TO_BE_DONE = 'to be done';
 
gadgets.log = function(message) {
  if (window.console && console.log) {
    console.log(message);
  } else {
    var logEntry = document.createElement('div');
    logEntry.className = 'gadgets-log-entry';
    logEntry.innerHTML = message;
    document.body.appendChild(logEntry);
  }
};
 
/**
 * Calls an array of asynchronous functions and calls the continuation
 * function when all are done.
 * @param {Array} functions Array of asynchronous functions, each taking
 *     one argument that is the continuation function that handles the result
 *     That is, each function is something like the following:
 *     function(continuation) {
 *       // compute result asynchronously
 *       continuation(result);
 *     }
 * @param {Function} continuation Function to call when all results are in.  It
 *     is pass an array of all results of all functions
 * @param {Object} opt_this Optional object used as "this" when calling each
 *     function
 */
gadgets.callAsyncAndJoin = function(functions, continuation, opt_this) {
  var pending = functions.length;
  var results = [];
  for (var i = 0; i < functions.length; i++) {
    // we need a wrapper here because i changes and we need one index
    // variable per closure
    var wrapper = function(index) {
      functions[index].call(opt_this, function(result) {
        results[index] = result;
        if (--pending == 0) {
          continuation(results);
        }
      });
    };
    wrapper(i);
  }
};
 
 
// ----------
// Extensible
 
gadgets.Extensible = function() {
};
 
/**
 * Sets the dependencies.
 * @param {Object} dependencies Object whose properties are set on this
 *     container as dependencies
 */
gadgets.Extensible.prototype.setDependencies = function(dependencies) {
  for (var p in dependencies) {
    this[p] = dependencies[p];
  }
};
 
/**
 * Returns a dependency given its name.
 * @param {String} name Name of dependency
 * @return {Object} Dependency with that name or undefined if not found
 */
gadgets.Extensible.prototype.getDependencies = function(name) {
  return this[name];
};
 
 
 
// -------------
// UserPrefStore
 
/**
 * User preference store interface.
 * @constructor
 */
gadgets.UserPrefStore = function() {
};
 
/**
 * Gets all user preferences of a gadget.
 * @param {Object} gadget Gadget object
 * @return {Object} All user preference of given gadget
 */
gadgets.UserPrefStore.prototype.getPrefs = function(gadget) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
/**
 * Saves user preferences of a gadget in the store.
 * @param {Object} gadget Gadget object
 * @param {Object} prefs User preferences
 */
gadgets.UserPrefStore.prototype.savePrefs = function(gadget) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
 
// -------------
// DefaultUserPrefStore
 
/**
 * User preference store implementation.
 * TODO: Turn this into a real implementation that is production safe
 * @constructor
 */
gadgets.DefaultUserPrefStore = function() {
  gadgets.UserPrefStore.call(this);
};
gadgets.DefaultUserPrefStore.inherits(gadgets.UserPrefStore);
 
gadgets.DefaultUserPrefStore.prototype.getPrefs = function(gadget) { };
 
gadgets.DefaultUserPrefStore.prototype.savePrefs = function(gadget) { };
 
 
// -------------
// GadgetService
 
/**
 * Interface of service provided to gadgets for resizing gadgets,
 * setting title, etc.
 * @constructor
 */
gadgets.GadgetService = function() {
};
 
gadgets.GadgetService.prototype.setHeight = function(elementId, height) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
gadgets.GadgetService.prototype.setTitle = function(gadget, title) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
gadgets.GadgetService.prototype.setUserPref = function(id) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
 
// ----------------
// IfrGadgetService
 
/**
 * Base implementation of GadgetService.
 * @constructor
 */
gadgets.IfrGadgetService = function() {
  gadgets.GadgetService.call(this);
  gadgets.rpc.register('resize_iframe', this.setHeight);
  gadgets.rpc.register('set_pref', this.setUserPref);
  gadgets.rpc.register('set_title', this.setTitle);
  gadgets.rpc.register('requestNavigateTo', this.requestNavigateTo);
};
 
gadgets.IfrGadgetService.inherits(gadgets.GadgetService);
 
gadgets.IfrGadgetService.prototype.setHeight = function(height) {
  if (height > gadgets.container.maxheight_) {
    height = gadgets.container.maxheight_;
  }
 
  var element = document.getElementById(this.f);
  if (element) {
    element.style.height = height + 'px';
  }
};
 
gadgets.IfrGadgetService.prototype.setTitle = function(title) {
  var element = document.getElementById(this.f + '_title');
  if (element) {
    element.innerHTML = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }
};
 
/**
 * Sets one or more user preferences
 * @param {String} editToken
 * @param {String} name Name of user preference
 * @param {String} value Value of user preference
 * More names and values may follow
 */
gadgets.IfrGadgetService.prototype.setUserPref = function(editToken, name,
    value) {
  var id = gadgets.IfrGadgetService.prototype.getGadgetIdFromModuleId(this.f);
  var gadget = gadgets.container.getGadget(id);
  var prefs = gadget.getUserPrefs();
  for (var i = 1, j = arguments.length; i < j; i += 2) {
    prefs[arguments[i]] = arguments[i + 1];
  }
  gadget.setUserPrefs(prefs);
};
 
/**
 * Navigates the page to a new url based on a gadgets requested view and
 * parameters.
 */
gadgets.IfrGadgetService.prototype.requestNavigateTo = function(view,
    opt_params) {
  var id = gadgets.IfrGadgetService.prototype.getGadgetIdFromModuleId(this.f);
  var url = gadgets.IfrGadgetService.prototype.getUrlForView(view, id);
 
  if (!url) return;
  if (opt_params) {
    var paramStr = gadgets.json.stringify(opt_params);
    if (paramStr.length > 0) {
      var sp;
      if (url.match(/\?/)) {
          sp = '&';
      } else {
          sp = '?';
      }
      url += sp + 'appParams=' + encodeURIComponent(paramStr);
      //url += '#appli' + id;
    }
  }
 
  if (document.location.href.indexOf(url) == -1) {
    document.location.href = url;
  }
};
 
/**
 * This is a silly implementation that will need to be overriden by almost all
 * real containers.
 * TODO: Find a better default for this function
 *
 * @param view The view name to get the url for
 */
gadgets.IfrGadgetService.prototype.getUrlForView = function(
    view, id) {
  var params = {};
  var urls = { 'home': 'home.pl', 'profile': 'show_profile.pl', 'preview': 'view_appli.pl', 'canvas': 'run_appli.pl'};
  if (!urls[view]) return;
  var url = urls[view];
  var owner_id  = Mixi.User.getOwner().getId();
  var viewer_id = Mixi.User.getViewer().getId();
 
  if (view === 'canvas' || view === 'preview') {
    params['id'] = id;
  }
  if (view === 'canvas' && owner_id != viewer_id) {
    params['owner_id'] = owner_id;
  }
  if (view === 'home' || view === 'profile') {
    if (view === 'profile'){
      params['id'] = owner_id;
    }
    params['appli_id'] = id;
  }
  return url + '?' + $H(params).toQueryString();
}
 
gadgets.IfrGadgetService.prototype.getGadgetIdFromModuleId = function(
    moduleId) {
  // Quick hack to extract the gadget id from module id
  return parseInt(moduleId.match(/_([0-9]+)$/)[1], 10);
};
 
 
// -------------
// LayoutManager
 
/**
 * Layout manager interface.
 * @constructor
 */
gadgets.LayoutManager = function() {
};
 
/**
 * Gets the HTML element that is the chrome of a gadget into which the content
 * of the gadget can be rendered.
 * @param {Object} gadget Gadget instance
 * @return {Object} HTML element that is the chrome for the given gadget
 */
gadgets.LayoutManager.prototype.getGadgetChrome = function(gadget) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
// -------------------
// StaticLayoutManager
 
/**
 * Static layout manager where gadget ids have a 1:1 mapping to chrome ids.
 * @constructor
 */
gadgets.StaticLayoutManager = function() {
  gadgets.LayoutManager.call(this);
};
 
gadgets.StaticLayoutManager.inherits(gadgets.LayoutManager);
 
/**
 * Sets chrome ids, whose indexes are gadget instance ids (starting from 0).
 * @param {Array} gadgetIdToChromeIdMap Gadget id to chrome id map
 */
gadgets.StaticLayoutManager.prototype.setGadgetChromeIds =
    function(gadgetChromeIds) {
  this.gadgetChromeIds_ = gadgetChromeIds;
};
 
gadgets.StaticLayoutManager.prototype.getGadgetChrome = function(gadget) {
  var chromeId = this.gadgetChromeIds_[gadget.id];
  return chromeId ? document.getElementById(chromeId) : null;
};
 
 
// ----------------------
// FloatLeftLayoutManager
 
/**
 * FloatLeft layout manager where gadget ids have a 1:1 mapping to chrome ids.
 * @constructor
 * @param {String} layoutRootId Id of the element that is the parent of all
 *     gadgets.
 */
gadgets.FloatLeftLayoutManager = function(layoutRootId) {
  gadgets.LayoutManager.call(this);
  this.layoutRootId_ = layoutRootId;
};
 
gadgets.FloatLeftLayoutManager.inherits(gadgets.LayoutManager);
 
gadgets.FloatLeftLayoutManager.prototype.getGadgetChrome =
    function(gadget) {
  var layoutRoot = document.getElementById(this.layoutRootId_);
  if (layoutRoot) {
    var chrome = document.createElement('div');
    chrome.className = 'gadgets-gadget-chrome';
    chrome.style.cssFloat = 'left'
    layoutRoot.appendChild(chrome);
    return chrome;
  } else {
    return null;
  }
};
 
 
// ------
// Gadget
 
/**
 * Creates a new instance of gadget.  Optional parameters are set as instance
 * variables.
 * @constructor
 * @param {Object} params Parameters to set on gadget.  Common parameters:
 *    "specUrl": URL to gadget specification
 *    "private": Whether gadget spec is accessible only privately, which means
 *        browser can load it but not gadget server
 *    "spec": Gadget Specification in XML
 *    "viewParams": a javascript object containing attribute value pairs
 *        for this gadgets
 *    "secureToken": an encoded token that is passed on the URL hash
 *    "hashData": Query-string like data that will be added to the
 *        hash portion of the URL.
 *    "specVersion": a hash value used to add a v= param to allow for better caching
 *    "title": the default title to use for the title bar.
 *    "height": height of the gadget
 *    "width": width of the gadget
 *    "debug": send debug=1 to the gadget server, gets us uncompressed
 *        javascript
 */
gadgets.Gadget = function(params) {
  this.userPrefs_ = {};
 
  if (params) {
    for (var name in params)  if (params.hasOwnProperty(name)) {
      this[name] = params[name];
    }
  }
  if (!this.secureToken) {
    // Assume that the default security token implementation is
    // in use on the server.
    this.secureToken = 'john.doe:john.doe:appid:cont:url:0';
  }
};
 
gadgets.Gadget.prototype.getUserPrefs = function() {
  return this.userPrefs_;
};
 
gadgets.Gadget.prototype.setUserPrefs = function(userPrefs) {
  this.userPrefs_ = userPrefs;
  gadgets.container.userPrefStore.savePrefs(this);
};
 
gadgets.Gadget.prototype.getUserPref = function(name) {
  return this.userPrefs_[name];
};
 
gadgets.Gadget.prototype.setUserPref = function(name, value) {
  this.userPrefs_[name] = value;
  gadgets.container.userPrefStore.savePrefs(this);
};
 
gadgets.Gadget.prototype.render = function(chrome) {
  if (chrome) {
    this.getContent(function(content) {
      chrome.innerHTML = content;
    });
  }
};
 
gadgets.Gadget.prototype.getContent = function(continuation) {
  gadgets.callAsyncAndJoin([
      this.getTitleBarContent, this.getUserPrefsDialogContent,
      this.getMainContent], function(results) {
        continuation(results.join(''));
      }, this);
};
 
/**
 * Gets title bar content asynchronously or synchronously.
 * @param {Function} continutation Function that handles title bar content as
 *     the one and only argument
 */
gadgets.Gadget.prototype.getTitleBarContent = function(continuation) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
/**
 * Gets user preferences dialog content asynchronously or synchronously.
 * @param {Function} continutation Function that handles user preferences
 *     content as the one and only argument
 */
gadgets.Gadget.prototype.getUserPrefsDialogContent = function(continuation) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
/**
 * Gets gadget content asynchronously or synchronously.
 * @param {Function} continutation Function that handles gadget content as
 *     the one and only argument
 */
gadgets.Gadget.prototype.getMainContent = function(continuation) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
/*
 * Gets additional parameters to append to the iframe url
 * Override this method if you need any custom params.
 */
gadgets.Gadget.prototype.getAdditionalParams = function() {
  return '';
}
 
 
// ---------
// IfrGadget
 
gadgets.IfrGadget = function(opt_params) {
  gadgets.Gadget.call(this, opt_params);
  this.serverBase_ = '../../' // default gadget server
};
 
gadgets.IfrGadget.inherits(gadgets.Gadget);
 
gadgets.IfrGadget.prototype.GADGET_IFRAME_PREFIX_ = 'remote_iframe_';
 
gadgets.IfrGadget.prototype.CONTAINER = 'default';
 
gadgets.IfrGadget.prototype.cssClassGadget = 'gadgets-gadget';
gadgets.IfrGadget.prototype.cssClassTitleBar = 'gadgets-gadget-title-bar';
gadgets.IfrGadget.prototype.cssClassTitle = 'gadgets-gadget-title';
gadgets.IfrGadget.prototype.cssClassTitleButtonBar =
    'gadgets-gadget-title-button-bar';
gadgets.IfrGadget.prototype.cssClassGadgetUserPrefsDialog =
    'gadgets-gadget-user-prefs-dialog';
gadgets.IfrGadget.prototype.cssClassGadgetUserPrefsDialogActionBar =
    'gadgets-gadget-user-prefs-dialog-action-bar';
gadgets.IfrGadget.prototype.cssClassTitleButton = 'gadgets-gadget-title-button';
gadgets.IfrGadget.prototype.cssClassGadgetContent = 'gadgets-gadget-content';
gadgets.IfrGadget.prototype.rpcToken = (0x7FFFFFFF * Math.random()) | 0;
gadgets.IfrGadget.prototype.rpcRelay = '/static/js/platform/rpc_relay.html';
 
gadgets.IfrGadget.prototype.getTitleBarContent = function(continuation) {
  continuation('<div id="' + this.cssClassTitleBar + '-' + this.id +
      '" class="' + this.cssClassTitleBar + '"><span id="' +
      this.getIframeId() + '_title" class="' +
      this.cssClassTitle + '">' + (this.title ? this.title : 'Title') + '</span> | <span class="' +
      this.cssClassTitleButtonBar +
      '"><a href="#" onclick="gadgets.container.getGadget(' + this.id +
      ').handleOpenUserPrefsDialog();return false;" class="' + this.cssClassTitleButton +
      '">settings</a> <a href="#" onclick="gadgets.container.getGadget(' +
      this.id + ').handleToggle();return false;" class="' + this.cssClassTitleButton +
      '">toggle</a></span></div>');
};
 
gadgets.IfrGadget.prototype.getUserPrefsDialogContent = function(continuation) {
  continuation('<div id="' + this.getUserPrefsDialogId() + '" class="' +
      this.cssClassGadgetUserPrefsDialog + '"></div>');
};
 
gadgets.IfrGadget.prototype.setServerBase = function(url) {
  this.serverBase_ = url;
};
 
gadgets.IfrGadget.prototype.getServerBase = function() {
  return this.serverBase_;
};
 
gadgets.IfrGadget.prototype.getMainContent = function(continuation) {
  var iframeId = this.getIframeId();
  gadgets.rpc.setRelayUrl(iframeId, this.serverBase_ + this.rpcRelay);
  gadgets.rpc.setAuthToken(iframeId, this.rpcToken);
  continuation('<div class="' + this.cssClassGadgetContent + '"><iframe id="' +
      iframeId + '" name="' + iframeId + '" class="' + this.cssClassGadget +
      '" src="' + this.getIframeUrl() +
      '" frameborder="no" scrolling="no"' +
      (this.height ? ' height="' + this.height + '"' : '') +
      (this.width ? ' width="' + this.width + '"' : '') +
      '></iframe></div>');
};
 
gadgets.IfrGadget.prototype.getIframeId = function() {
  return this.GADGET_IFRAME_PREFIX_ + this.id;
};
 
gadgets.IfrGadget.prototype.getUserPrefsDialogId = function() {
  return this.getIframeId() + '_userPrefsDialog';
};
 
gadgets.IfrGadget.prototype.getIframeUrl = function() {
  return this.serverBase_ + 'ifr?' +
      'container=' + this.CONTAINER +
      '&mid=' +  this.id +
      '&nocache=' + gadgets.container.nocache_ +
      '&country=' + gadgets.container.country_ +
      '&lang=' + gadgets.container.language_ +
      '&view=' + gadgets.container.view_ +
      (this.specVersion ? '&v=' + this.specVersion : '') +
      (gadgets.container.parentUrl_ ? '&parent=' + encodeURIComponent(gadgets.container.parentUrl_) : '') +
      (this.debug ? '&debug=1' : '') +
      this.getAdditionalParams() +
      this.getUserPrefsParams() +
      (this.secureToken ? '&st=' + this.secureToken : '') +
      '&url=' + encodeURIComponent(this.specUrl) +
      '#rpctoken=' + this.rpcToken +
      (this.viewParams ?
          '&view-params=' +  encodeURIComponent(JSON.stringify(this.viewParams)) : '') +
      (this.hashData ? '&' + this.hashData : '');
};
 
gadgets.IfrGadget.prototype.getUserPrefsParams = function() {
  var params = '';
  if (this.getUserPrefs()) {
    for(var name in this.getUserPrefs()) {
      var value = this.getUserPref(name);
      params += '&up_' + encodeURIComponent(name) + '=' +
          encodeURIComponent(value);
    }
  }
  return params;
}
 
gadgets.IfrGadget.prototype.handleToggle = function() {
  var gadgetIframe = document.getElementById(this.getIframeId());
  if (gadgetIframe) {
    var gadgetContent = gadgetIframe.parentNode;
    var display = gadgetContent.style.display;
    gadgetContent.style.display = display ? '' : 'none';
  }
};
 
gadgets.IfrGadget.prototype.handleOpenUserPrefsDialog = function() {
  if (this.userPrefsDialogContentLoaded) {
    this.showUserPrefsDialog();
  } else {
    var gadget = this;
    var igCallbackName = 'ig_callback_' + this.id;
    window[igCallbackName] = function(userPrefsDialogContent) {
      gadget.userPrefsDialogContentLoaded = true;
      gadget.buildUserPrefsDialog(userPrefsDialogContent);
      gadget.showUserPrefsDialog();
    };
 
    var script = document.createElement('script');
    script.src = 'http://gmodules.com/ig/gadgetsettings?mid=' + this.id +
        '&output=js' + this.getUserPrefsParams() +  '&url=' + this.specUrl;
    document.body.appendChild(script);
  }
};
 
gadgets.IfrGadget.prototype.buildUserPrefsDialog = function(content) {
  var userPrefsDialog = document.getElementById(this.getUserPrefsDialogId());
  userPrefsDialog.innerHTML = content +
      '<div class="' + this.cssClassGadgetUserPrefsDialogActionBar +
      '"><input type="button" value="Save" onclick="gadgets.container.getGadget(' +
      this.id +').handleSaveUserPrefs()"> <input type="button" value="Cancel" onclick="gadgets.container.getGadget(' +
      this.id +').handleCancelUserPrefs()"></div>';
  userPrefsDialog.childNodes[0].style.display = '';
};
 
gadgets.IfrGadget.prototype.showUserPrefsDialog = function(opt_show) {
  var userPrefsDialog = document.getElementById(this.getUserPrefsDialogId());
  userPrefsDialog.style.display = (opt_show || opt_show == undefined)
      ? '' : 'none';
}
 
gadgets.IfrGadget.prototype.hideUserPrefsDialog = function() {
  this.showUserPrefsDialog(false);
};
 
gadgets.IfrGadget.prototype.handleSaveUserPrefs = function() {
  this.hideUserPrefsDialog();
 
  var prefs = {};
  var numFields = document.getElementById('m_' + this.id +
      '_numfields').value;
  for (var i = 0; i < numFields; i++) {
    var input = document.getElementById('m_' + this.id + '_' + i);
    if (input.type != 'hidden') {
      var userPrefNamePrefix = 'm_' + this.id + '_up_';
      var userPrefName = input.name.substring(userPrefNamePrefix.length);
      var userPrefValue = input.value;
      prefs[userPrefName] = userPrefValue;
    }
  }
 
  this.setUserPrefs(prefs);
  this.refresh();
};
 
gadgets.IfrGadget.prototype.handleCancelUserPrefs = function() {
  this.hideUserPrefsDialog();
};
 
gadgets.IfrGadget.prototype.refresh = function() {
  var iframeId = this.getIframeId();
  document.getElementById(iframeId).src = this.getIframeUrl();
};
 
 
// ---------
// Container
 
/**
 * Container interface.
 * @constructor
 */
gadgets.Container = function() {
  this.gadgets_ = {};
  this.parentUrl_ = 'http://' + document.location.host;
  this.country_ = 'ALL';
  this.language_ = 'ALL';
  this.view_ = 'default';
  this.nocache_ = 1;
 
  // signed max int
  this.maxheight_ = 2147483647;
};
 
gadgets.Container.inherits(gadgets.Extensible);
 
/**
 * Known dependencies:
 *     gadgetClass: constructor to create a new gadget instance
 *     userPrefStore: instance of a subclass of gadgets.UserPrefStore
 *     gadgetService: instance of a subclass of gadgets.GadgetService
 *     layoutManager: instance of a subclass of gadgets.LayoutManager
 */
 
gadgets.Container.prototype.gadgetClass = gadgets.Gadget;
 
gadgets.Container.prototype.userPrefStore = new gadgets.DefaultUserPrefStore();
 
gadgets.Container.prototype.gadgetService = new gadgets.GadgetService();
 
gadgets.Container.prototype.layoutManager =
    new gadgets.StaticLayoutManager();
 
gadgets.Container.prototype.setParentUrl = function(url) {
  this.parentUrl_ = url;
};
 
gadgets.Container.prototype.setCountry = function(country) {
  this.country_ = country;
};
 
gadgets.Container.prototype.setNoCache = function(nocache) {
  this.nocache_ = nocache;
};
 
gadgets.Container.prototype.setLanguage = function(language) {
  this.language_ = language;
};
 
gadgets.Container.prototype.setView = function(view) {
  this.view_ = view;
};
 
gadgets.Container.prototype.setMaxHeight = function(maxheight) {
  this.maxheight_ = maxheight;
};
 
gadgets.Container.prototype.getGadgetKey_ = function(instanceId) {
  return 'gadget_' + instanceId;
};
 
gadgets.Container.prototype.getGadget = function(instanceId) {
  return this.gadgets_[this.getGadgetKey_(instanceId)];
};
 
gadgets.Container.prototype.createGadget = function(opt_params) {
  return new this.gadgetClass(opt_params);
};
 
gadgets.Container.prototype.addGadget = function(gadget) {
  if (!gadget.id) {
    gadget.id = this.getNextGadgetInstanceId();
  }
  gadget.setUserPrefs(this.userPrefStore.getPrefs(gadget));
  this.gadgets_[this.getGadgetKey_(gadget.id)] = gadget;
};
 
gadgets.Container.prototype.addGadgets = function(gadgets) {
  for (var i = 0; i < gadgets.length; i++) {
    this.addGadget(gadgets[i]);
  }
};
 
/**
 * Renders all gadgets in the container.
 */
gadgets.Container.prototype.renderGadgets = function() {
  for (var key in this.gadgets_) {
    this.renderGadget(this.gadgets_[key]);
  }
};
 
/**
 * Renders a gadget.  Gadgets are rendered inside their chrome element.
 * @param {Object} gadget Gadget object
 */
gadgets.Container.prototype.renderGadget = function(gadget) {
  throw Error(gadgets.error.SUBCLASS_RESPONSIBILITY);
};
 
gadgets.Container.prototype.nextGadgetInstanceId_ = 0;
 
gadgets.Container.prototype.getNextGadgetInstanceId = function() {
  return this.nextGadgetInstanceId_++;
};
 
/**
 * Refresh all the gadgets in the container.
 */
gadgets.Container.prototype.refreshGadgets = function() {
  for (var key in this.gadgets_) {
    this.gadgets_[key].refresh();
  }
};
 
 
// ------------
// IfrContainer
 
/**
 * Container that renders gadget using ifr.
 * @constructor
 */
gadgets.IfrContainer = function() {
  gadgets.Container.call(this);
};
 
gadgets.IfrContainer.inherits(gadgets.Container);
 
gadgets.IfrContainer.prototype.gadgetClass = gadgets.IfrGadget;
 
gadgets.IfrContainer.prototype.gadgetService = new gadgets.IfrGadgetService();
 
gadgets.IfrContainer.prototype.setParentUrl = function(url) {
  if (!url.match(/^http[s]?:\/\//)) {
    url = document.location.href.match(/^[^?#]+\//)[0] + url;
  }
 
  this.parentUrl_ = url;
};
 
/**
 * Renders a gadget using ifr.
 * @param {Object} gadget Gadget object
 */
gadgets.IfrContainer.prototype.renderGadget = function(gadget) {
  var chrome = this.layoutManager.getGadgetChrome(gadget);
  gadget.render(chrome);
};
 
/**
 * Default container.
 */
gadgets.container = new gadgets.IfrContainer();

var gadgets={};;
var gadgets=gadgets||{};
gadgets.config=function(){var A={};
return{register:function(D,C,B){if(A[D]){throw new Error('Component "'+D+'" is already registered.')
}A[D]={validators:C||{},callback:B}
},get:function(B){if(B){if(!A[B]){throw new Error('Component "'+B+'" not registered.')
}return configuration[B]||{}
}return configuration
},init:function(H,G){configuration=H;
for(var F in A){if(A.hasOwnProperty(F)){var E=A[F],D=H[F],B=E.validators;
if(!G){for(var C in B){if(B.hasOwnProperty(C)){if(!B[C](D[C])){throw new Error('Invalid config value "'+D[C]+'" for parameter "'+C+'" in component "'+F+'"')
}}}}if(E.callback){E.callback(H)
}}}},EnumValidator:function(E){var D=[];
if(arguments.length>1){for(var C=0,B;
B=arguments[C];
++C){D.push(B)
}}else{D=E
}return function(G){for(var F=0,H;
H=D[F];
++F){if(G===D[F]){return true
}}}
},RegExValidator:function(B){return function(C){return B.test(C)
}
},ExistsValidator:function(B){return typeof B!=="undefined"
},NonEmptyStringValidator:function(B){return typeof B==="string"&&B.length>0
},BooleanValidator:function(B){return typeof B==="boolean"
},LikeValidator:function(B){return function(D){for(var E in B){if(B.hasOwnProperty(E)){var C=B[E];
if(!C(D[E])){return false
}}}return true
}
}}
}();;
var html4={};html4 .eflags={'OPTIONAL_ENDTAG':1,'BREAKS_FLOW':2,'EMPTY':4,'NAVIGATES':8,'CDATA':16,'RCDATA':32,'UNSAFE':64};html4
.atype={'SCRIPT':1,'STYLE':2,'IDREF':3,'NAME':4,'NMTOKENS':5,'URI':6,'FRAME':7};html4
.ELEMENTS={'a':html4 .eflags.NAVIGATES,'abbr':0,'acronym':0,'address':0,'applet':html4
.eflags.UNSAFE,'area':html4 .eflags.EMPTY|html4 .eflags.NAVIGATES,'b':0,'base':html4
.eflags.UNSAFE|html4 .eflags.EMPTY,'basefont':html4 .eflags.UNSAFE|html4 .eflags.EMPTY,'bdo':0,'big':0,'blockquote':html4
.eflags.BREAKS_FLOW,'body':html4 .eflags.UNSAFE|html4 .eflags.OPTIONAL_ENDTAG,'br':html4
.eflags.EMPTY|html4 .eflags.BREAKS_FLOW,'button':0,'caption':0,'center':html4 .eflags.BREAKS_FLOW,'cite':0,'code':0,'col':html4
.eflags.EMPTY,'colgroup':html4 .eflags.OPTIONAL_ENDTAG,'dd':html4 .eflags.OPTIONAL_ENDTAG|html4
.eflags.BREAKS_FLOW,'del':0,'dfn':0,'dir':html4 .eflags.BREAKS_FLOW,'div':html4 .eflags.BREAKS_FLOW,'dl':html4
.eflags.BREAKS_FLOW,'dt':html4 .eflags.OPTIONAL_ENDTAG|html4 .eflags.BREAKS_FLOW,'em':0,'fieldset':0,'font':0,'form':html4
.eflags.BREAKS_FLOW|html4 .eflags.NAVIGATES,'frame':html4 .eflags.UNSAFE|html4 .eflags.EMPTY,'frameset':html4
.eflags.UNSAFE,'h1':html4 .eflags.BREAKS_FLOW,'h2':html4 .eflags.BREAKS_FLOW,'h3':html4
.eflags.BREAKS_FLOW,'h4':html4 .eflags.BREAKS_FLOW,'h5':html4 .eflags.BREAKS_FLOW,'h6':html4
.eflags.BREAKS_FLOW,'head':html4 .eflags.UNSAFE|html4 .eflags.OPTIONAL_ENDTAG|html4
.eflags.BREAKS_FLOW,'hr':html4 .eflags.EMPTY|html4 .eflags.BREAKS_FLOW,'html':html4
.eflags.UNSAFE|html4 .eflags.OPTIONAL_ENDTAG|html4 .eflags.BREAKS_FLOW,'i':0,'iframe':html4
.eflags.UNSAFE,'img':html4 .eflags.EMPTY,'input':html4 .eflags.EMPTY,'ins':0,'isindex':html4
.eflags.UNSAFE|html4 .eflags.EMPTY|html4 .eflags.BREAKS_FLOW|html4 .eflags.NAVIGATES,'kbd':0,'label':0,'legend':0,'li':html4
.eflags.OPTIONAL_ENDTAG|html4 .eflags.BREAKS_FLOW,'link':html4 .eflags.UNSAFE|html4
.eflags.EMPTY,'map':0,'menu':html4 .eflags.BREAKS_FLOW,'meta':html4 .eflags.UNSAFE|html4
.eflags.EMPTY,'noframes':html4 .eflags.UNSAFE|html4 .eflags.BREAKS_FLOW,'noscript':html4
.eflags.UNSAFE,'object':html4 .eflags.UNSAFE,'ol':html4 .eflags.BREAKS_FLOW,'optgroup':0,'option':html4
.eflags.OPTIONAL_ENDTAG,'p':html4 .eflags.OPTIONAL_ENDTAG|html4 .eflags.BREAKS_FLOW,'param':html4
.eflags.UNSAFE|html4 .eflags.EMPTY,'plaintext':html4 .eflags.OPTIONAL_ENDTAG|html4
.eflags.UNSAFE|html4 .eflags.CDATA,'pre':html4 .eflags.BREAKS_FLOW,'q':0,'s':0,'samp':0,'script':html4
.eflags.UNSAFE|html4 .eflags.CDATA,'select':0,'small':0,'span':0,'strike':0,'strong':0,'style':html4
.eflags.UNSAFE|html4 .eflags.CDATA,'sub':0,'sup':0,'table':html4 .eflags.BREAKS_FLOW,'tbody':html4
.eflags.OPTIONAL_ENDTAG,'td':html4 .eflags.OPTIONAL_ENDTAG|html4 .eflags.BREAKS_FLOW,'textarea':html4
.eflags.RCDATA,'tfoot':html4 .eflags.OPTIONAL_ENDTAG,'th':html4 .eflags.OPTIONAL_ENDTAG|html4
.eflags.BREAKS_FLOW,'thead':html4 .eflags.OPTIONAL_ENDTAG,'title':html4 .eflags.UNSAFE|html4
.eflags.BREAKS_FLOW|html4 .eflags.RCDATA,'tr':html4 .eflags.OPTIONAL_ENDTAG|html4
.eflags.BREAKS_FLOW,'tt':0,'u':0,'ul':html4 .eflags.BREAKS_FLOW,'var':0,'xmp':html4
.eflags.CDATA};html4 .ATTRIBS={'abbr':0,'accept':0,'accept-charset':0,'action':html4
.atype.URI,'align':0,'alink':0,'alt':0,'archive':html4 .atype.URI,'axis':0,'background':html4
.atype.URI,'bgcolor':0,'border':0,'cellpadding':0,'cellspacing':0,'char':0,'charoff':0,'charset':0,'checked':0,'cite':html4
.atype.URI,'class':html4 .atype.NMTOKENS,'classid':html4 .atype.URI,'clear':0,'code':0,'codebase':html4
.atype.URI,'codetype':0,'color':0,'cols':0,'colspan':0,'compact':0,'content':0,'coords':0,'data':html4
.atype.URI,'datetime':0,'declare':0,'defer':0,'dir':0,'disabled':0,'enctype':0,'face':0,'for':html4
.atype.IDREF,'frame':0,'frameborder':0,'headers':0,'height':0,'href':html4 .atype.URI,'hreflang':0,'hspace':0,'id':html4
.atype.IDREF,'ismap':0,'label':0,'lang':0,'language':0,'link':0,'longdesc':html4
.atype.URI,'marginheight':0,'marginwidth':0,'maxlength':0,'media':0,'method':0,'multiple':0,'name':html4
.atype.NAME,'nohref':0,'noresize':0,'noshade':0,'nowrap':0,'object':0,'onblur':html4
.atype.SCRIPT,'onchange':html4 .atype.SCRIPT,'onclick':html4 .atype.SCRIPT,'ondblclick':html4
.atype.SCRIPT,'onfocus':html4 .atype.SCRIPT,'onkeydown':html4 .atype.SCRIPT,'onkeypress':html4
.atype.SCRIPT,'onkeyup':html4 .atype.SCRIPT,'onload':html4 .atype.SCRIPT,'onmousedown':html4
.atype.SCRIPT,'onmousemove':html4 .atype.SCRIPT,'onmouseout':html4 .atype.SCRIPT,'onmouseover':html4
.atype.SCRIPT,'onmouseup':html4 .atype.SCRIPT,'onreset':html4 .atype.SCRIPT,'onselect':html4
.atype.SCRIPT,'onsubmit':html4 .atype.SCRIPT,'onunload':html4 .atype.SCRIPT,'profile':html4
.atype.URI,'prompt':0,'readonly':0,'rel':0,'rev':0,'rows':0,'rowspan':0,'rules':0,'scheme':0,'scope':0,'scrolling':0,'selected':0,'shape':0,'size':0,'span':0,'src':html4
.atype.URI,'standby':0,'start':0,'style':html4 .atype.STYLE,'summary':0,'tabindex':0,'target':html4
.atype.FRAME,'text':0,'title':0,'type':0,'usemap':html4 .atype.URI,'valign':0,'value':0,'valuetype':0,'version':0,'vlink':0,'vspace':0,'width':0};var
css={'properties':(function(){var c=[/^\s*inherit\s+$/i,/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|transparent|inherit)\s+$/i,/^\s*(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit)\s+$/i,/^\s*(?:thin|medium|thick|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i,/^\s*(?:none|inherit)\s+$/i,/^\s*(?:url\("[^\(\)\\\"\r\n]+"\)|none|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|auto|inherit)\s+$/i,/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|none|inherit)\s+$/i,/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,/^\s*(?:auto|always|avoid|left|right|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?m?s|0|(?:\d+(?:\.\d+)?)%|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?|inherit)\s+$/i,/^\s*(?:normal|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i];return{'azimuth':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:deg|g?rad)|leftwards|rightwards|inherit)\s+$/i,'background':c[0],'backgroundAttachment':/^\s*(?:scroll|fixed|inherit)\s+$/i,'backgroundColor':c[1],'backgroundImage':c[5],'backgroundPosition':/^\s*(?:(?:0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|left|center|right)\s+(?:(?:0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|top|center|bottom)\s+)?|inherit\s+)$/i,'backgroundRepeat':/^\s*(?:repeat|repeat-x|repeat-y|no-repeat|inherit)\s+$/i,'border':c[0],'borderBottom':c[0],'borderBottomColor':c[1],'borderBottomStyle':c[2],'borderBottomWidth':c[3],'borderCollapse':/^\s*(?:collapse|separate|inherit)\s+$/i,'borderColor':/^\s*(?:(?:(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|transparent)\s+){1,4}|inherit\s+)$/i,'borderLeft':c[0],'borderLeftColor':c[1],'borderLeftStyle':c[2],'borderLeftWidth':c[3],'borderRight':c[0],'borderRightColor':c[1],'borderRightStyle':c[2],'borderRightWidth':c[3],'borderSpacing':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+)?|inherit\s+)$/i,'borderStyle':/^\s*(?:(?:(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)\s+){1,4}|inherit\s+)$/i,'borderTop':c[0],'borderTopColor':c[1],'borderTopStyle':c[2],'borderTopWidth':c[3],'borderWidth':/^\s*(?:(?:(?:thin|medium|thick|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc))\s+){1,4}|inherit\s+)$/i,'bottom':c[6],'captionSide':/^\s*(?:top|bottom|inherit)\s+$/i,'clear':/^\s*(?:none|left|right|both|inherit)\s+$/i,'clip':/^\s*(?:auto|inherit)\s+$/i,'color':/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|inherit)\s+$/i,'counterIncrement':c[4],'counterReset':c[4],'cssFloat':/^\s*(?:left|right|none|inherit)\s+$/i,'cue':c[0],'cueAfter':c[5],'cueBefore':c[5],'cursor':/^\s*(?:(?:url\("[^\(\)\\\"\r\n]+"\)\s+,\s+)*(?:auto|crosshair|default|pointer|move|e-resize|ne-resize|nw-resize|n-resize|se-resize|sw-resize|s-resize|w-resize|text|wait|help|progress|all-scroll|col-resize|hand|no-drop|not-allowed|row-resize|vertical-text)|inherit)\s+$/i,'direction':/^\s*(?:ltr|rtl|inherit)\s+$/i,'display':/^\s*(?:inline|block|list-item|run-in|inline-block|table|inline-table|table-row-group|table-header-group|table-footer-group|table-row|table-column-group|table-column|table-cell|table-caption|none|inherit)\s+$/i,'elevation':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:deg|g?rad)|below|level|above|higher|lower|inherit)\s+$/i,'emptyCells':/^\s*(?:show|hide|inherit)\s+$/i,'font':/^\s*(?:caption|icon|menu|message-box|small-caption|status-bar|inherit)\s+$/i,'fontFamily':/^\s*(?:(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace)\s+(?:,\s+(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace)\s+)*|inherit\s+)$/i,'fontSize':/^\s*(?:xx-small|x-small|small|medium|large|x-large|xx-large|(?:small|larg)er|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,'fontStyle':/^\s*(?:normal|italic|oblique|inherit)\s+$/i,'fontVariant':/^\s*(?:normal|small-caps|inherit)\s+$/i,'fontWeight':/^\s*(?:normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)\s+$/i,'height':c[6],'left':c[6],'letterSpacing':c[12],'lineHeight':/^\s*(?:normal|0|(?:\d+(?:\.\d+)?)|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,'listStyle':c[0],'listStyleImage':c[5],'listStylePosition':/^\s*(?:inside|outside|inherit)\s+$/i,'listStyleType':/^\s*(?:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit)\s+$/i,'margin':/^\s*(?:(?:(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|auto)\s+){1,4}|inherit\s+)$/i,'marginBottom':c[6],'marginLeft':c[6],'marginRight':c[6],'marginTop':c[6],'maxHeight':c[7],'maxWidth':c[7],'minHeight':c[8],'minWidth':c[8],'outline':c[0],'outlineColor':/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|invert|inherit)\s+$/i,'outlineStyle':c[2],'outlineWidth':c[3],'overflow':/^\s*(?:visible|hidden|scroll|auto|inherit)\s+$/i,'padding':/^\s*(?:(?:(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%)\s+){1,4}|inherit\s+)$/i,'paddingBottom':c[8],'paddingLeft':c[8],'paddingRight':c[8],'paddingTop':c[8],'pageBreakAfter':c[9],'pageBreakBefore':c[9],'pageBreakInside':/^\s*(?:avoid|auto|inherit)\s+$/i,'pause':/^\s*(?:(?:(?:0|[+-]?\d+(?:\.\d+)?m?s|0|(?:\d+(?:\.\d+)?)%)\s+){1,2}|inherit\s+)$/i,'pauseAfter':c[10],'pauseBefore':c[10],'pitch':/^\s*(?:0|(?:\d+(?:\.\d+)?)k?Hz|x-low|low|medium|high|x-high|inherit)\s+$/i,'pitchRange':c[11],'playDuring':/^\s*(?:auto|none|inherit)\s+$/i,'position':/^\s*(?:static|relative|absolute|fixed|inherit)\s+$/i,'quotes':c[4],'richness':c[11],'right':c[6],'speak':/^\s*(?:normal|none|spell-out|inherit)\s+$/i,'speakHeader':/^\s*(?:once|always|inherit)\s+$/i,'speakNumeral':/^\s*(?:digits|continuous|inherit)\s+$/i,'speakPunctuation':/^\s*(?:code|none|inherit)\s+$/i,'speechRate':/^\s*(?:0|[+-]?\d+(?:\.\d+)?|x-slow|slow|medium|fast|x-fast|faster|slower|inherit)\s+$/i,'stress':c[11],'tableLayout':/^\s*(?:auto|fixed|inherit)\s+$/i,'textAlign':/^\s*(?:left|right|center|justify|inherit)\s+$/i,'textDecoration':c[4],'textIndent':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|inherit)\s+$/i,'textTransform':/^\s*(?:capitalize|uppercase|lowercase|none|inherit)\s+$/i,'top':c[6],'unicodeBidi':/^\s*(?:normal|embed|bidi-override|inherit)\s+$/i,'verticalAlign':/^\s*(?:baseline|sub|super|top|text-top|middle|bottom|text-bottom|0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i,'visibility':/^\s*(?:visible|hidden|collapse|inherit)\s+$/i,'voiceFamily':/^\s*(?:(?:(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|male|female|child)\s+,\s+)*(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|male|female|child)|inherit)\s+$/i,'volume':/^\s*(?:0|(?:\d+(?:\.\d+)?)|0|[+-]?\d+(?:\.\d+)?%|silent|x-soft|soft|medium|loud|x-loud|inherit)\s+$/i,'whiteSpace':/^\s*(?:normal|pre|nowrap|pre-wrap|pre-line|inherit)\s+$/i,'width':/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|auto|inherit)\s+$/i,'wordSpacing':c[12],'zIndex':/^\s*(?:auto|\d+|inherit)\s+$/i};})()};var
html=(function(){var ENTITIES={'LT':'<','GT':'>','AMP':'&','NBSP':'\xa0','QUOT':'\"','APOS':'\''};var
decimalEscapeRe=/^#(\d+)$/;var hexEscapeRe=/^#x([0-9A-F]+)$/;function lookupEntity(name){name=name.toUpperCase();if(ENTITIES.hasOwnProperty(name)){return ENTITIES[name];}var
m=name.match(decimalEscapeRe);if(m){return String.fromCharCode(parseInt(m[1],10));}else
if(!(!(m=name.match(hexEscapeRe)))){return String.fromCharCode(parseInt(m[1],16));}return'';}function
decodeOneEntity(_,name){return lookupEntity(name);}var entityRe=/&(#\d+|#x[\da-f]+|\w+);/g;function
unescapeEntities(s){return s.replace(entityRe,decodeOneEntity);}var ampRe=/&/g;var
looseAmpRe=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;var ltRe=/</g;var gtRe=/>/g;var
quotRe=/\"/g;function escapeAttrib(s){return s.replace(ampRe,'&amp;').replace(ltRe,'&lt;').replace(gtRe,'&gt;').replace(quotRe,'&quot;');}function
normalizeRCData(rcdata){return rcdata.replace(looseAmpRe,'&amp;$1').replace(ltRe,'&lt;').replace(gtRe,'&gt;');}var
INSIDE_TAG_TOKEN=new RegExp('^\\s*(?:'+('(?:'+'([a-z][a-z-]*)'+('(?:'+'\\s*=\\s*'+('(?:'+'\"([^\"]*)\"'+'|\'([^\']*)\''+'|([^>\"\'\\s]*)'+')')+')')+'?'+')')+'|(/?>)'+'|[^\\w\\s>]+)','i');var
OUTSIDE_TAG_TOKEN=new RegExp('^(?:'+'&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);'+'|<!--[\\s\\S]*?-->|<!w[^>]*>|<\\?[^>*]*>'+'|<(/)?([a-z][a-z0-9]*)'+'|([^<&]+)'+'|([<&]))','i');function
makeSaxParser(handler){return function parse(htmlText,param){htmlText=String(htmlText);var
htmlUpper=null;var inTag=false;var attribs=[];var tagName;var eflags;var openTag;handler.startDoc&&handler.startDoc(param);while(htmlText){var
m=htmlText.match(inTag?INSIDE_TAG_TOKEN:OUTSIDE_TAG_TOKEN);htmlText=htmlText.substring(m[0].length);if(inTag){if(m[1]){var
attribName=m[1].toLowerCase();var encodedValue=m[2]||m[3]||m[4];var decodedValue;if(encodedValue!=null){decodedValue=unescapeEntities(encodedValue);}else{decodedValue=attribName;}attribs.push(attribName,decodedValue);}else
if(m[5]){if(eflags!==undefined){if(openTag){handler.startTag&&handler.startTag(tagName,attribs,param);}else{handler.endTag&&handler.endTag(tagName,param);}}if(openTag&&eflags&(html4
.eflags.CDATA|html4 .eflags.RCDATA)){if(htmlUpper===null){htmlUpper=htmlText.toLowerCase();}else{htmlUpper=htmlUpper.substring(htmlUpper.length-htmlText.length);}var
dataEnd=htmlUpper.indexOf('</'+tagName);if(dataEnd<0){dataEnd=htmlText.length;}if(eflags&html4
.eflags.CDATA){handler.cdata&&handler.cdata(htmlText.substring(0,dataEnd),param);}else
if(handler.rcdata){handler.rcdata(normalizeRCData(htmlText.substring(0,dataEnd)),param);}htmlText=htmlText.substring(dataEnd);}tagName=eflags=openTag=undefined;attribs.length=0;inTag=false;}}else{if(m[1]){handler.pcdata&&handler.pcdata(m[0],param);}else
if(m[3]){openTag=!m[2];inTag=true;tagName=m[3].toLowerCase();eflags=html4 .ELEMENTS.hasOwnProperty(tagName)?html4
.ELEMENTS[tagName]:undefined;}else if(m[4]){handler.pcdata&&handler.pcdata(m[4],param);}else
if(m[5]){handler.pcdata&&handler.pcdata(m[5]==='&'?'&amp;':'&lt;',param);}}}handler.endDoc&&handler.endDoc(param);};}return{'normalizeRCData':normalizeRCData,'escapeAttrib':escapeAttrib,'unescapeEntities':unescapeEntities,'makeSaxParser':makeSaxParser};})();html.makeHtmlSanitizer=function(sanitizeAttributes){var
stack=[];var ignoring=false;return html.makeSaxParser({'startDoc':function(_){stack=[];ignoring=false;},'startTag':function(tagName,attribs,out){if(ignoring){return undefined;}if(!html4
.ELEMENTS.hasOwnProperty(tagName)){return undefined;}var eflags=html4 .ELEMENTS[tagName];if(eflags&html4
.eflags.UNSAFE){ignoring=!(eflags&html4 .eflags.EMPTY);return undefined;}attribs=sanitizeAttributes(tagName,attribs);if(attribs){if(!(eflags&html4
.eflags.EMPTY)){stack.push(tagName);}out.push('<',tagName);for(var i=0,n=attribs.length;i<n;i+=2){var
attribName=attribs[i],value=attribs[i+1];if(value!=null){out.push(' ',attribName,'=\"',html.escapeAttrib(value),'\"');}}out.push('>');}},'endTag':function(tagName,out){if(ignoring){ignoring=false;return undefined;}if(!html4
.ELEMENTS.hasOwnProperty(tagName)){return undefined;}var eflags=html4 .ELEMENTS[tagName];if(!(eflags&(html4
.eflags.UNSAFE|html4 .eflags.EMPTY))){var index;if(eflags&html4 .eflags.OPTIONAL_ENDTAG){for(index=stack.length;--index>=0;){var
stackEl=stack[index];if(stackEl===tagName){break;}if(!(html4 .ELEMENTS[stackEl]&html4
.eflags.OPTIONAL_ENDTAG)){return undefined;}}}else{for(index=stack.length;--index>=0;){if(stack[index]===tagName){break;}}}if(index<0){return undefined;}for(var
i=stack.length;--i>index;){var stackEl=stack[i];if(!(html4 .ELEMENTS[stackEl]&html4
.eflags.OPTIONAL_ENDTAG)){out.push('</',stackEl,'>');}}stack.length=index;out.push('</',tagName,'>');}},'pcdata':function(text,out){if(!ignoring){out.push(text);}},'rcdata':function(text,out){if(!ignoring){out.push(text);}},'cdata':function(text,out){if(!ignoring){out.push(text);}},'endDoc':function(out){for(var
i=stack.length;--i>=0;){out.push('</',stack[i],'>');}stack.length=0;}});};function
html_sanitize(htmlText,opt_urlPolicy,opt_nmTokenPolicy){var out=[];html.makeHtmlSanitizer(function
sanitizeAttribs(tagName,attribs){for(var i=0;i<attribs.length;i+=2){var attribName=attribs[i];var
value=attribs[i+1];if(html4 .ATTRIBS.hasOwnProperty(attribName)){switch(html4 .ATTRIBS[attribName]){case
html4 .atype.SCRIPT:;case html4 .atype.STYLE:value=null;case html4 .atype.IDREF:;case
html4 .atype.NAME:;case html4 .atype.NMTOKENS:{value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value;break;}case
html4 .atype.URI:{value=opt_urlPolicy&&opt_urlPolicy(value);break;}}}else{value=null;}attribs[i+1]=value;}return attribs;})(htmlText,out);return out.join('');};
var gadgets=gadgets||{};
gadgets.util=function(){function F(){var K;
var J=document.location.href;
var H=J.indexOf("?");
var I=J.indexOf("#");
if(I===-1){K=J.substr(H+1)
}else{K=[J.substr(H+1,I-H-1),"&",J.substr(I+1)].join("")
}return K.split("&")
}var D=null;
var C={};
var E=[];
var A={0:false,10:true,13:true,34:true,39:true,60:true,62:true,92:true,8232:true,8233:true};
function B(H,I){return String.fromCharCode(I)
}function G(H){C=H["core.util"]||{}
}if(gadgets.config){gadgets.config.register("core.util",null,G)
}return{getUrlParameters:function(){if(D!==null){return D
}D={};
var K=F();
var N=window.decodeURIComponent?decodeURIComponent:unescape;
for(var I=0,H=K.length;
I<H;
++I){var M=K[I].indexOf("=");
if(M===-1){continue
}var L=K[I].substring(0,M);
var J=K[I].substring(M+1);
J=J.replace(/\+/g," ");
D[L]=N(J)
}return D
},makeClosure:function(K,M,L){var J=[];
for(var I=2,H=arguments.length;
I<H;
++I){J.push(arguments[I])
}return function(){var N=J.slice();
for(var P=0,O=arguments.length;
P<O;
++P){N.push(arguments[P])
}return M.apply(K,N)
}
},makeEnum:function(I){var K={};
for(var J=0,H;
H=I[J];
++J){K[H]=H
}return K
},getFeatureParameters:function(H){return typeof C[H]==="undefined"?null:C[H]
},hasFeature:function(H){return typeof C[H]!=="undefined"
},registerOnLoadHandler:function(H){E.push(H)
},runOnLoadHandlers:function(){for(var I=0,H=E.length;
I<H;
++I){E[I]()
}},escape:function(H,L){if(!H){return H
}else{if(typeof H==="string"){return gadgets.util.escapeString(H)
}else{if(typeof H==="array"){for(var K=0,I=H.length;
K<I;
++K){H[K]=gadgets.util.escape(H[K])
}}else{if(typeof H==="object"&&L){var J={};
for(var M in H){if(H.hasOwnProperty(M)){J[gadgets.util.escapeString(M)]=gadgets.util.escape(H[M],true)
}}return J
}}}}return H
},escapeString:function(L){var I=[],K,M;
for(var J=0,H=L.length;
J<H;
++J){K=L.charCodeAt(J);
M=A[K];
if(M===true){I.push("&#",K,";")
}else{if(M!==false){I.push(L.charAt(J))
}}}return I.join("")
},unescapeString:function(H){return H.replace(/&#([0-9]+);/g,B)
}}
}();
gadgets.util.getUrlParameters();;
var shindig=shindig||{};
shindig.Auth=function(){var authToken=null;
var trusted=null;
function init(configuration){var urlParams=gadgets.util.getUrlParameters();
var config=configuration["shindig.auth"]||{};
if(config.authToken){authToken=config.authToken
}else{if(urlParams.st){authToken=urlParams.st
}}if(authToken!=null){addParamsToToken(urlParams)
}if(config.trustedJson){trusted=eval("("+config.trustedJson+")")
}}function addParamsToToken(urlParams){var args=authToken.split("&");
for(var i=0;
i<args.length;
i++){var nameAndValue=args[i].split("=");
if(nameAndValue.length==2){var name=nameAndValue[0];
var value=nameAndValue[1];
if(value==="$"){value=encodeURIComponent(urlParams[name]);
args[i]=name+"="+value
}}}authToken=args.join("&")
}gadgets.config.register("shindig.auth",null,init);
return{getSecurityToken:function(){return authToken
},updateSecurityToken:function(newToken){authToken=newToken
},getTrustedData:function(){return trusted
}}
};;
var shindig=shindig||{};
shindig.auth=new shindig.Auth();;
var gadgets=gadgets||{};
(function(){var B=null;
var C={};
var E={};
var G="en";
var F="US";
var D=0;
function A(){var I=gadgets.util.getUrlParameters();
for(var H in I){if(I.hasOwnProperty(H)){if(H.indexOf("up_")===0&&H.length>3){C[H.substr(3)]=String(I[H])
}else{if(H==="country"){F=I[H]
}else{if(H==="lang"){G=I[H]
}else{if(H==="mid"){D=I[H]
}}}}}}}gadgets.Prefs=function(){if(!B){A();
B=this
}return B
};
gadgets.Prefs.setInternal_=function(I,J){if(typeof I==="string"){C[I]=J
}else{for(var H in I){if(I.hasOwnProperty(H)){C[H]=I[H]
}}}};
gadgets.Prefs.setMessages_=function(H){msgs=H
};
gadgets.Prefs.prototype.getString=function(H){return C[H]?gadgets.util.escapeString(C[H]):""
};
gadgets.Prefs.prototype.getInt=function(H){var I=parseInt(C[H],10);
return isNaN(I)?0:I
};
gadgets.Prefs.prototype.getFloat=function(H){var I=parseFloat(C[H]);
return isNaN(I)?0:I
};
gadgets.Prefs.prototype.getBool=function(H){var I=C[H];
if(I){return I==="true"||I===true||!!parseInt(I,10)
}return false
};
gadgets.Prefs.prototype.set=function(H,I){throw new Error("setprefs feature required to make this call.")
};
gadgets.Prefs.prototype.getArray=function(L){var M=C[L];
if(M){var H=M.split("|");
var I=gadgets.util.escapeString;
for(var K=0,J=H.length;
K<J;
++K){H[K]=I(H[K].replace(/%7C/g,"|"))
}return H
}return[]
};
gadgets.Prefs.prototype.setArray=function(H,I){throw new Error("setprefs feature required to make this call.")
};
gadgets.Prefs.prototype.getMsg=function(H){return msgs[H]||""
};
gadgets.Prefs.prototype.getCountry=function(){return F
};
gadgets.Prefs.prototype.getLang=function(){return G
};
gadgets.Prefs.prototype.getModuleId=function(){return D
}
})();;
var gadgets=gadgets||{};
gadgets.json=function(){function f(n){return n<10?"0"+n:n
}Date.prototype.toJSON=function(){return[this.getUTCFullYear(),"-",f(this.getUTCMonth()+1),"-",f(this.getUTCDate()),"T",f(this.getUTCHours()),":",f(this.getUTCMinutes()),":",f(this.getUTCSeconds()),"Z"].join("")
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function stringify(value){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;
switch(typeof value){case"string":return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];
if(c){return c
}c=a.charCodeAt();
return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)
})+'"':'"'+value+'"';
case"number":return isFinite(value)?String(value):"null";
case"boolean":case"null":return String(value);
case"object":if(!value){return"null"
}a=[];
if(typeof value.length==="number"&&!(value.propertyIsEnumerable("length"))){l=value.length;
for(i=0;
i<l;
i+=1){a.push(stringify(value[i])||"null")
}return"["+a.join(",")+"]"
}for(k in value){if(value.hasOwnProperty(k)){if(typeof k==="string"){v=stringify(value[k]);
if(v){a.push(stringify(k)+":"+v)
}}}}return"{"+a.join(",")+"}"
}}return{stringify:stringify,parse:function(text){if(/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/b-u]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){return eval("("+text+")")
}return false
}}
}();;
var JSON=gadgets.json;
var _IG_Prefs=gadgets.Prefs;
_IG_Prefs._parseURL=gadgets.Prefs.parseUrl;
function _IG_Fetch_wrapper(B,A){B(A.data)
}function _IG_FetchContent(B,E,C){var D=C||{};
if(D.refreshInterval){D.REFRESH_INTERVAL=D.refreshInterval
}else{D.REFRESH_INTERVAL=3600
}var A=gadgets.util.makeClosure(null,_IG_Fetch_wrapper,E);
gadgets.io.makeRequest(B,A,D)
}function _IG_FetchXmlContent(B,E,C){var D=C||{};
if(D.refreshInterval){D.REFRESH_INTERVAL=D.refreshInterval
}else{D.REFRESH_INTERVAL=3600
}D.CONTENT_TYPE="DOM";
var A=gadgets.util.makeClosure(null,_IG_Fetch_wrapper,E);
gadgets.io.makeRequest(B,A,D)
}function _IG_FetchFeedAsJSON(B,F,C,A,D){var E=D||{};
E.CONTENT_TYPE="FEED";
E.NUM_ENTRIES=C;
E.GET_SUMMARIES=A;
gadgets.io.makeRequest(B,function(G){if(G.errors){G.data=G.data||{};
if(G.errors&&G.errors.length>0){G.data.ErrorMsg=G.errors[0]
}}F(G.data)
},E)
}function _IG_GetCachedUrl(A){return gadgets.io.getProxyUrl(A)
}function _IG_GetImageUrl(A){return gadgets.io.getProxyUrl(A)
}function _IG_RegisterOnloadHandler(A){gadgets.util.registerOnLoadHandler(A)
}function _IG_Callback(B,C){var A=arguments;
return function(){var D=Array.prototype.slice.call(arguments);
B.apply(null,D.concat(Array.prototype.slice.call(A,1)))
}
}var _args=gadgets.util.getUrlParameters;
function _gel(A){return document.getElementById?document.getElementById(A):null
}function _gelstn(A){if(A==="*"&&document.all){return document.all
}return document.getElementsByTagName?document.getElementsByTagName(A):[]
}function _gelsbyregex(D,F){var C=_gelstn(D);
var E=[];
for(var B=0,A=C.length;
B<A;
++B){if(F.test(C[B].id)){E.push(C[B])
}}return E
}function _esc(A){return window.encodeURIComponent?encodeURIComponent(A):escape(A)
}function _unesc(A){return window.decodeURIComponent?decodeURIComponent(A):unescape(A)
}function _hesc(A){return gadgets.util.escapeString(A)
}function _striptags(A){return A.replace(/<\/?[^>]+>/g,"")
}function _trim(A){return A.replace(/^\s+|\s+$/g,"")
}function _toggle(A){A=_gel(A);
if(A!==null){if(A.style.display.length===0||A.style.display==="block"){A.style.display="none"
}else{if(A.style.display==="none"){A.style.display="block"
}}}}var _global_legacy_uidCounter=0;
function _uid(){return _global_legacy_uidCounter++
}function _min(B,A){return(B<A?B:A)
}function _max(B,A){return(B>A?B:A)
}function _exportSymbols(A,B){var H={};
for(var I=0,F=B.length;
I<F;
I+=2){H[B[I]]=B[I+1]
}var E=A.split(".");
var J=window;
for(var D=0,C=E.length-1;
D<C;
++D){var G={};
J[E[D]]=G;
J=G
}J[E[E.length-1]]=H
};;
var gadgets=gadgets||{};
gadgets.io=function(){var config={};
var oauthState;
function makeXhr(){if(window.XMLHttpRequest){return new window.XMLHttpRequest()
}else{if(window.ActiveXObject){var x=new ActiveXObject("Msxml2.XMLHTTP");
if(!x){x=new ActiveXObject("Microsoft.XMLHTTP")
}return x
}}}function hadError(xobj,callback){if(xobj.readyState!==4){return true
}try{if(xobj.status<200||xobj.status>=300){callback({errors:["Error "+xobj.status]});
return true
}}catch(e){callback({errors:["Error not specified"]});
return true
}return false
}function processNonProxiedResponse(url,callback,params,xobj){if(hadError(xobj,callback)){return 
}var data={body:xobj.responseText};
callback(transformResponseData(params,data))
}var UNPARSEABLE_CRUFT="throw 1; < don't be evil' >";
function processResponse(url,callback,params,xobj){if(hadError(xobj,callback)){return 
}var txt=xobj.responseText;
txt=txt.substr(UNPARSEABLE_CRUFT.length);
var data=eval("("+txt+")");
if(data[url]){data=data[url]
}else{if(data[""]){data=data[""]
}}if(data.oauthState){oauthState=data.oauthState
}if(data.st){shindig.auth.updateSecurityToken(data.st)
}callback(transformResponseData(params,data))
}function transformResponseData(params,data){var resp={text:data.body,oauthApprovalUrl:data.oauthApprovalUrl,oauthError:data.oauthError,oauthErrorText:data.oauthErrorText,errors:[]};
if(resp.text){switch(params.CONTENT_TYPE){case"JSON":case"FEED":resp.data=gadgets.json.parse(resp.text);
if(!resp.data){resp.errors.push("failed to parse JSON");
resp.data=null
}break;
case"DOM":var dom;
if(window.ActiveXObject){dom=new ActiveXObject("Microsoft.XMLDOM");
dom.async=false;
dom.validateOnParse=false;
dom.resolveExternals=false;
if(!dom.loadXML(resp.text)){resp.errors.push("failed to parse XML")
}else{resp.data=dom
}}else{var parser=new DOMParser();
dom=parser.parseFromString(resp.text,"text/xml");
if("parsererror"===dom.documentElement.nodeName){resp.errors.push("failed to parse XML")
}else{resp.data=dom
}}break;
default:resp.data=resp.text;
break
}}return resp
}function makeXhrRequest(realUrl,proxyUrl,callback,paramData,method,params,processResponseFunction,opt_contentType){var xhr=makeXhr();
xhr.open(method,proxyUrl,true);
if(callback){xhr.onreadystatechange=gadgets.util.makeClosure(null,processResponseFunction,realUrl,callback,params,xhr)
}if(paramData!=null){xhr.setRequestHeader("Content-Type",opt_contentType||"application/x-www-form-urlencoded");
xhr.send(paramData)
}else{xhr.send(null)
}}function respondWithPreload(postData,params,callback){if(gadgets.io.preloaded_&&gadgets.io.preloaded_[postData.url]){var preload=gadgets.io.preloaded_[postData.url];
if(postData.httpMethod=="GET"){delete gadgets.io.preloaded_[postData.url];
if(preload.rc!==200){callback({errors:["Error "+preload.rc]})
}else{if(preload.oauthState){oauthState=preload.oauthState
}var resp={body:preload.body,oauthApprovalUrl:preload.oauthApprovalUrl,oauthError:preload.oauthError,oauthErrorText:preload.oauthErrorText,errors:[]};
callback(transformResponseData(params,resp))
}return true
}}return false
}function init(configuration){config=configuration["core.io"]
}var requiredConfig={proxyUrl:new gadgets.config.RegExValidator(/.*%(raw)?url%.*/),jsonProxyUrl:gadgets.config.NonEmptyStringValidator};
gadgets.config.register("core.io",requiredConfig,init);
return{makeRequest:function(url,callback,opt_params){var params=opt_params||{};
var httpMethod=params.METHOD||"GET";
var refreshInterval=params.REFRESH_INTERVAL;
var auth,st;
st=shindig.auth.getSecurityToken();
if(params.AUTHORIZATION&&params.AUTHORIZATION!=="NONE"){auth=params.AUTHORIZATION.toLowerCase()
}else{if(httpMethod==="GET"&&refreshInterval===undefined){refreshInterval=3600
}}var signOwner=true;
if(typeof params.OWNER_SIGNED!=="undefined"){signOwner=params.OWNER_SIGNED
}var signViewer=true;
if(typeof params.VIEWER_SIGNED!=="undefined"){signViewer=params.VIEWER_SIGNED
}var headers=params.HEADERS||{};
if(httpMethod==="POST"&&!headers["Content-Type"]){headers["Content-Type"]="application/x-www-form-urlencoded"
}var urlParams=gadgets.util.getUrlParameters();
var paramData={url:url,httpMethod:httpMethod,headers:gadgets.io.encodeValues(headers,false),postData:params.POST_DATA||"",authz:auth||"",st:st||"",contentType:params.CONTENT_TYPE||"TEXT",numEntries:params.NUM_ENTRIES||"3",getSummaries:!!params.GET_SUMMARIES,signOwner:signOwner,signViewer:signViewer,gadget:urlParams.url,container:urlParams.container||urlParams.synd||"default",bypassSpecCache:gadgets.util.getUrlParameters().nocache||""};
if(params.AUTHORIZATION==="OAUTH"){paramData.oauthState=oauthState||"";
for(opt in params){if(params.hasOwnProperty(opt)){if(opt.indexOf("OAUTH_")===0){paramData[opt]=params[opt]
}}}}if(!respondWithPreload(paramData,params,callback,processResponse)){if(httpMethod==="GET"&&refreshInterval>0){var extraparams="?refresh="+refreshInterval+"&"+gadgets.io.encodeValues(paramData);
makeXhrRequest(url,config.jsonProxyUrl+extraparams,callback,null,"GET",params,processResponse)
}else{makeXhrRequest(url,config.jsonProxyUrl,callback,gadgets.io.encodeValues(paramData),"POST",params,processResponse)
}}},makeNonProxiedRequest:function(relativeUrl,callback,opt_params,opt_contentType){var params=opt_params||{};
makeXhrRequest(relativeUrl,relativeUrl,callback,params.POST_DATA,params.METHOD,params,processNonProxiedResponse,opt_contentType)
},clearOAuthState:function(){oauthState=undefined
},encodeValues:function(fields,opt_noEscaping){var escape=!opt_noEscaping;
var buf=[];
var first=false;
for(var i in fields){if(fields.hasOwnProperty(i)){if(!first){first=true
}else{buf.push("&")
}buf.push(escape?encodeURIComponent(i):i);
buf.push("=");
buf.push(escape?encodeURIComponent(fields[i]):fields[i])
}}return buf.join("")
},getProxyUrl:function(url,opt_params){var params=opt_params||{};
var refresh=params.REFRESH_INTERVAL;
if(refresh===undefined){refresh="3600"
}var urlParams=gadgets.util.getUrlParameters();
return config.proxyUrl.replace("%url%",encodeURIComponent(url)).replace("%rawurl%",url).replace("%refresh%",encodeURIComponent(refresh)).replace("%gadget%",encodeURIComponent(urlParams.url)).replace("%container%",encodeURIComponent(urlParams.container||urlParams.synd))
}}
}();
gadgets.io.RequestParameters=gadgets.util.makeEnum(["METHOD","CONTENT_TYPE","POST_DATA","HEADERS","AUTHORIZATION","NUM_ENTRIES","GET_SUMMARIES","REFRESH_INTERVAL","OAUTH_SERVICE_NAME","OAUTH_TOKEN_NAME","OAUTH_REQUEST_TOKEN","OAUTH_REQUEST_TOKEN_SECRET"]);
gadgets.io.MethodType=gadgets.util.makeEnum(["GET","POST","PUT","DELETE","HEAD"]);
gadgets.io.ContentType=gadgets.util.makeEnum(["TEXT","DOM","JSON","FEED"]);
gadgets.io.AuthorizationType=gadgets.util.makeEnum(["NONE","SIGNED","OAUTH"]);;
var gadgets=gadgets||{};
gadgets.Tab=function(A){this.handle_=A;
this.td_=null;
this.contentContainer_=null;
this.callback_=null
};
gadgets.Tab.prototype.getName=function(){return this.td_.innerHTML
};
gadgets.Tab.prototype.getNameContainer=function(){return this.td_
};
gadgets.Tab.prototype.getContentContainer=function(){return this.contentContainer_
};
gadgets.Tab.prototype.getCallback=function(){return this.callback_
};
gadgets.Tab.prototype.getIndex=function(){var B=this.handle_.getTabs();
for(var A=0;
A<B.length;
++A){if(this===B[A]){return A
}}return -1
};
gadgets.TabSet=function(C,B,A){this.moduleId_=C||0;
this.domIdFilter_=new RegExp("^[A-Za-z]([0-9a-zA-Z_:.-]+)?$");
this.selectedTab_=null;
this.tabs_=[];
this.tabsAdded_=0;
this.defaultTabName_=B||"";
this.leftNavContainer_=null;
this.rightNavContainer_=null;
this.navTable_=null;
this.tabsContainer_=null;
this.rtl_=document.body.dir=="rtl";
this.mainContainer_=this.createMainContainer_(A);
this.tabTable_=this.createTabTable_();
this.displayTabs(false);
gadgets.TabSet.addCSS_([".tablib_table {","width: 100%;","border-collapse: separate;","border-spacing: 0px;","empty-cells: show;","font-size: 11px;","text-align: center;","}",".tablib_emptyTab {","border-bottom: 1px solid #676767;","padding: 0px 1px;","}",".tablib_spacerTab {","border-bottom: 1px solid #676767;","padding: 0px 1px;","width: 1px;","}",".tablib_selected {","padding: 2px;","background-color: #ffffff;","border: 1px solid #676767;","border-bottom-width: 0px;","color: #3366cc;","font-weight: bold;","width: 80px;","cursor: default;","}",".tablib_unselected {","padding: 2px;","background-color: #dddddd;","border: 1px solid #aaaaaa;","border-bottom-color: #676767;","color: #000000;","width: 80px;","cursor: pointer;","}",".tablib_navContainer {","width: 10px;","vertical-align: middle;","}",".tablib_navContainer a:link, ",".tablib_navContainer a:visited, ",".tablib_navContainer a:hover {","color: #3366aa;","text-decoration: none;","}"].join(""))
};
gadgets.TabSet.prototype.addTab=function(G,E){if(typeof E==="string"){E={contentContainer:document.getElementById(arguments[1]),callback:arguments[2]}
}var H=E||{};
var A=-1;
if(H.index>=0&&H.index<this.tabs_.length){A=H.index
}var C=this.createTab_(G,{contentContainer:H.contentContainer,callback:H.callback,tooltip:H.tooltip});
var F=this.tabTable_.rows[0];
if(this.tabs_.length>0){var B=document.createElement("td");
B.className=this.cascade_("tablib_spacerTab");
B.appendChild(document.createTextNode(" "));
var D=A<0?F.cells[F.cells.length-1]:this.tabs_[A].td_;
F.insertBefore(B,D);
F.insertBefore(C.td_,A<0?D:B)
}else{F.insertBefore(C.td_,F.cells[F.cells.length-1])
}if(A<0){A=this.tabs_.length;
this.tabs_.push(C)
}else{this.tabs_.splice(A,0,C)
}if(G==this.defaultTabName_||(!this.defaultTabName_&&A==0)){this.selectTab_(C)
}this.tabsAdded_++;
this.displayTabs(true);
this.adjustNavigation_();
return C.contentContainer_.id
};
gadgets.TabSet.prototype.removeTab=function(A){var C=this.tabs_[A];
if(C){if(C==this.selectedTab_){var B=this.tabs_.length-1;
if(B>0){this.selectTab_(A<B?this.tabs_[A+1]:this.tabs_[A-1])
}}var D=this.tabTable_.rows[0];
if(this.tabs_.length>1){D.removeChild(A?C.td_.previousSibling:C.td_.nextSibling)
}D.removeChild(C.td_);
this.mainContainer_.removeChild(C.contentContainer_);
this.tabs_.splice(A,1);
this.adjustNavigation_();
if(this.tabs_.length==0){this.displayTabs(false);
this.selectedTab_=null
}}};
gadgets.TabSet.prototype.getSelectedTab=function(){return this.selectedTab_
};
gadgets.TabSet.prototype.setSelectedTab=function(A){if(this.tabs_[A]){this.selectTab_(this.tabs_[A])
}};
gadgets.TabSet.prototype.swapTabs=function(D,B){var C=this.tabs_[D];
var A=this.tabs_[B];
if(C&&A){var E=C.td_.parentNode;
var F=C.td_.nextSibling;
E.insertBefore(C.td_,A.td_);
E.insertBefore(A.td_,F);
this.tabs_[D]=A;
this.tabs_[B]=C
}};
gadgets.TabSet.prototype.getTabs=function(){return this.tabs_
};
gadgets.TabSet.prototype.alignTabs=function(F,B){var C=this.tabTable_.rows[0];
var D=C.cells[0];
var A=C.cells[C.cells.length-1];
var E=isNaN(B)?"3px":B+"px";
D.style.width=F=="left"?E:"";
A.style.width=F=="right"?E:"";
this.tabTable_.style.display="none";
this.tabTable_.style.display=""
};
gadgets.TabSet.prototype.displayTabs=function(A){this.mainContainer_.style.display=A?"block":"none"
};
gadgets.TabSet.prototype.getHeaderContainer=function(){return this.tabTable_
};
gadgets.TabSet.prototype.createMainContainer_=function(C){var B="tl_"+this.moduleId_;
var A=C||document.getElementById(B);
if(!A){A=document.createElement("div");
A.id=B;
document.body.insertBefore(A,document.body.firstChild)
}A.className=this.cascade_("tablib_main_container")+" "+A.className;
return A
};
gadgets.TabSet.prototype.cascade_=function(A){return A+" "+A+this.moduleId_
};
gadgets.TabSet.prototype.createTabTable_=function(){var P=document.createElement("table");
P.id=this.mainContainer_.id+"_header";
P.className=this.cascade_("tablib_table");
P.cellSpacing="0";
P.cellPadding="0";
var E=document.createElement("tbody");
var I=document.createElement("tr");
E.appendChild(I);
P.appendChild(E);
var A=document.createElement("td");
A.className=this.cascade_("tablib_emptyTab");
A.appendChild(document.createTextNode(" "));
I.appendChild(A);
I.appendChild(A.cloneNode(true));
var J=document.createElement("table");
J.id=this.mainContainer_.id+"_navTable";
J.style.width="100%";
J.cellSpacing="0";
J.cellPadding="0";
J.style.tableLayout="fixed";
var C=document.createElement("tbody");
var F=document.createElement("tr");
C.appendChild(F);
J.appendChild(C);
var D=document.createElement("td");
D.className=this.cascade_("tablib_emptyTab")+" "+this.cascade_("tablib_navContainer");
D.style.textAlign="left";
D.style.display="";
var G=document.createElement("a");
G.href="javascript:void(0)";
G.innerHTML="&laquo;";
D.appendChild(G);
F.appendChild(D);
var L=document.createElement("td");
F.appendChild(L);
var B=document.createElement("div");
B.style.width="100%";
B.style.overflow="hidden";
B.appendChild(P);
L.appendChild(B);
var K=document.createElement("td");
K.className=this.cascade_("tablib_emptyTab")+" "+this.cascade_("tablib_navContainer");
K.style.textAlign="right";
K.style.display="";
var N=document.createElement("a");
N.href="javascript:void(0)";
N.innerHTML="&raquo;";
K.appendChild(N);
F.appendChild(K);
G.onclick=function(Q){this.smoothScroll_(B,-120)
};
N.onclick=function(Q){this.smoothScroll_(B,120)
};
if(this.rtl_){var M=G.onclick;
G.onclick=N.onclick;
N.onclick=M
}if(this.navTable_){this.mainContainer_.replaceChild(J,this.navTable_)
}else{this.mainContainer_.insertBefore(J,this.mainContainer_.firstChild);
var H=this;
var O=function(){H.adjustNavigation_()
};
if(window.addEventListener){window.addEventListener("resize",O,false)
}else{if(window.attachEvent){window.attachEvent("onresize",O)
}}}this.navTable_=J;
this.leftNavContainer_=D;
this.rightNavContainer_=K;
this.tabsContainer_=B;
return P
};
gadgets.TabSet.prototype.adjustNavigation_=function(){this.leftNavContainer_.style.display="none";
this.rightNavContainer_.style.display="none";
if(this.tabsContainer_.scrollWidth<=this.tabsContainer_.offsetWidth){this.tabsContainer_.scrollLeft=0;
return 
}this.leftNavContainer_.style.display="";
this.rightNavContainer_.style.display="";
if(this.tabsContainer_.scrollLeft+this.tabsContainer_.offsetWidth>this.tabsContainer_.scrollWidth){this.tabsContainer_.scrollLeft=this.tabsContainer_.scrollWidth-this.tabsContainer_.offsetWidth
}else{if(this.rtl_){this.tabsContainer_.scrollLeft=this.tabsContainer_.scrollWidth
}}};
gadgets.TabSet.prototype.smoothScroll_=function(A,F){var E=10;
if(!F){return 
}else{A.scrollLeft+=(F<0)?-E:E
}var C=Math.min(E,Math.abs(F));
var D=this;
var B=function(){D.smoothScroll_(A,(F<0)?F+C:F-C)
};
setTimeout(B,10)
};
gadgets.TabSet.addCSS_=function(C){var B=document.getElementsByTagName("head")[0];
if(B){var A=document.createElement("style");
A.type="text/css";
if(A.styleSheet){A.styleSheet.cssText=C
}else{A.appendChild(document.createTextNode(C))
}B.insertBefore(A,B.firstChild)
}};
gadgets.TabSet.prototype.createTab_=function(B,C){var A=new gadgets.Tab(this);
A.contentContainer_=C.contentContainer;
A.callback_=C.callback;
A.td_=document.createElement("td");
A.td_.title=C.tooltip||"";
A.td_.innerHTML=B;
A.td_.className=this.cascade_("tablib_unselected");
A.td_.onclick=this.setSelectedTabGenerator_(A);
if(!A.contentContainer_){A.contentContainer_=document.createElement("div");
A.contentContainer_.id=this.mainContainer_.id+"_"+this.tabsAdded_;
this.mainContainer_.appendChild(A.contentContainer_)
}else{if(A.contentContainer_.parentNode!==this.mainContainer_){this.mainContainer_.appendChild(A.contentContainer_)
}}A.contentContainer_.style.display="none";
A.contentContainer_.className=this.cascade_("tablib_content_container")+" "+A.contentContainer_.className;
return A
};
gadgets.TabSet.prototype.setSelectedTabGenerator_=function(A){return function(){A.handle_.selectTab_(A)
}
};
gadgets.TabSet.prototype.selectTab_=function(A){if(this.selectedTab_==A){return 
}if(this.selectedTab_){this.selectedTab_.td_.className=this.cascade_("tablib_unselected");
this.selectedTab_.td_.onclick=this.setSelectedTabGenerator_(this.selectedTab_);
this.selectedTab_.contentContainer_.style.display="none"
}A.td_.className=this.cascade_("tablib_selected");
A.td_.onclick=null;
A.contentContainer_.style.display="block";
this.selectedTab_=A;
if(typeof A.callback_=="function"){A.callback_(A.contentContainer_.id)
}};
var _IG_Tabs=gadgets.TabSet;
_IG_Tabs.prototype.moveTab=_IG_Tabs.prototype.swapTabs;
_IG_Tabs.prototype.addDynamicTab=function(A,B){return this.addTab(A,{callback:B})
};;
var opensocial=function(){};
opensocial.requestSendMessage=function(A,D,B,C){opensocial.Container.get().requestSendMessage(A,D,B,C)
};
opensocial.requestShareApp=function(A,D,B,C){opensocial.Container.get().requestShareApp(A,D,B,C)
};
opensocial.requestCreateActivity=function(C,B,A){if(!C||(!C.getField(opensocial.Activity.Field.TITLE)&&!C.getField(opensocial.Activity.Field.TITLE_ID))){if(A){A(new opensocial.ResponseItem(null,null,opensocial.ResponseItem.Error.BAD_REQUEST,"You must pass in an activity with a title or title id."))
}return 
}opensocial.Container.get().requestCreateActivity(C,B,A)
};
opensocial.CreateActivityPriority={HIGH:"HIGH",LOW:"LOW"};
opensocial.hasPermission=function(A){return opensocial.Container.get().hasPermission(A)
};
opensocial.requestPermission=function(B,C,A){opensocial.Container.get().requestPermission(B,C,A)
};
opensocial.Permission={VIEWER:"viewer"};
opensocial.getEnvironment=function(){return opensocial.Container.get().getEnvironment()
};
opensocial.newDataRequest=function(){return opensocial.Container.get().newDataRequest()
};
opensocial.newActivity=function(A){return opensocial.Container.get().newActivity(A)
};
opensocial.newMediaItem=function(C,A,B){return opensocial.Container.get().newMediaItem(C,A,B)
};
opensocial.newMessage=function(A,B){return opensocial.Container.get().newMessage(A,B)
};
opensocial.EscapeType={HTML_ESCAPE:"htmlEscape",NONE:"none"};
opensocial.newIdSpec=function(A){return opensocial.Container.get().newIdSpec(A)
};
opensocial.newNavigationParameters=function(A){return opensocial.Container.get().newNavigationParameters(A)
};
Function.prototype.inherits=function(A){function B(){}B.prototype=A.prototype;
this.superClass_=A.prototype;
this.prototype=new B();
this.prototype.constructor=this
};;
opensocial.Activity=function(A){this.fields_=A
};
opensocial.Activity.Field={TITLE_ID:"titleId",TITLE:"title",TEMPLATE_PARAMS:"templateParams",URL:"url",MEDIA_ITEMS:"mediaItems",BODY_ID:"bodyId",BODY:"body",EXTERNAL_ID:"externalId",STREAM_TITLE:"streamTitle",STREAM_URL:"streamUrl",STREAM_SOURCE_URL:"streamSourceUrl",STREAM_FAVICON_URL:"streamFaviconUrl",PRIORITY:"priority",ID:"id",USER_ID:"userId",APP_ID:"appId",POSTED_TIME:"postedTime"};
opensocial.Activity.prototype.getId=function(){return this.getField(opensocial.Activity.Field.ID)
};
opensocial.Activity.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.Activity.prototype.setField=function(A,B){return this.fields_[A]=B
};;
opensocial.Address=function(A){this.fields_=A||{}
};
opensocial.Address.Field={TYPE:"type",UNSTRUCTURED_ADDRESS:"unstructuredAddress",PO_BOX:"poBox",STREET_ADDRESS:"streetAddress",EXTENDED_ADDRESS:"extendedAddress",REGION:"region",LOCALITY:"locality",POSTAL_CODE:"postalCode",COUNTRY:"country",LATITUDE:"latitude",LONGITUDE:"longitude"};
opensocial.Address.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.BodyType=function(A){this.fields_=A||{}
};
opensocial.BodyType.Field={BUILD:"build",HEIGHT:"height",WEIGHT:"weight",EYE_COLOR:"eyeColor",HAIR_COLOR:"hairColor"};
opensocial.BodyType.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.Collection=function(C,B,A){this.array_=C||[];
this.offset_=B||0;
this.totalSize_=A||this.array_.length
};
opensocial.Collection.prototype.getById=function(C){for(var A=0;
A<this.size();
A++){var B=this.array_[A];
if(B.getId()==C){return B
}}return null
};
opensocial.Collection.prototype.size=function(){return this.array_.length
};
opensocial.Collection.prototype.each=function(B){for(var A=0;
A<this.size();
A++){B(this.array_[A])
}};
opensocial.Collection.prototype.asArray=function(){return this.array_
};
opensocial.Collection.prototype.getTotalSize=function(){return this.totalSize_
};
opensocial.Collection.prototype.getOffset=function(){return this.offset_
};;
opensocial.Container=function(){};
opensocial.Container.container_=null;
opensocial.Container.setContainer=function(A){opensocial.Container.container_=A
};
opensocial.Container.get=function(){return opensocial.Container.container_
};
opensocial.Container.prototype.getEnvironment=function(){};
opensocial.Container.prototype.requestSendMessage=function(A,D,B,C){if(B){B(new opensocial.ResponseItem(null,null,opensocial.ResponseItem.Error.NOT_IMPLEMENTED,null))
}};
opensocial.Container.prototype.requestShareApp=function(A,D,B,C){if(B){B(new opensocial.ResponseItem(null,null,opensocial.ResponseItem.Error.NOT_IMPLEMENTED,null))
}};
opensocial.Container.prototype.requestCreateActivity=function(C,B,A){if(A){A(new opensocial.ResponseItem(null,null,opensocial.ResponseItem.Error.NOT_IMPLEMENTED,null))
}};
opensocial.Container.prototype.hasPermission=function(A){return false
};
opensocial.Container.prototype.requestPermission=function(B,C,A){if(A){A(new opensocial.ResponseItem(null,null,opensocial.ResponseItem.Error.NOT_IMPLEMENTED,null))
}};
opensocial.Container.prototype.requestData=function(A,B){};
opensocial.Container.prototype.newFetchPersonRequest=function(B,A){};
opensocial.Container.prototype.newFetchPeopleRequest=function(A,B){};
opensocial.Container.prototype.newFetchPersonAppDataRequest=function(A,C,B){};
opensocial.Container.prototype.newUpdatePersonAppDataRequest=function(C,A,B){};
opensocial.Container.prototype.newRemovePersonAppDataRequest=function(B,A){};
opensocial.Container.prototype.newFetchActivitiesRequest=function(A,B){};
opensocial.Container.prototype.newCollection=function(C,B,A){return new opensocial.Collection(C,B,A)
};
opensocial.Container.prototype.newPerson=function(A,B,C){return new opensocial.Person(A,B,C)
};
opensocial.Container.prototype.newActivity=function(A){return new opensocial.Activity(A)
};
opensocial.Container.prototype.newMediaItem=function(C,A,B){return new opensocial.MediaItem(C,A,B)
};
opensocial.Container.prototype.newMessage=function(A,B){return new opensocial.Message(A,B)
};
opensocial.Container.prototype.newIdSpec=function(A){return new opensocial.IdSpec(A)
};
opensocial.Container.prototype.newNavigationParameters=function(A){return new opensocial.NavigationParameters(A)
};
opensocial.Container.prototype.newResponseItem=function(A,C,B,D){return new opensocial.ResponseItem(A,C,B,D)
};
opensocial.Container.prototype.newDataResponse=function(A,B){return new opensocial.DataResponse(A,B)
};
opensocial.Container.prototype.newDataRequest=function(){return new opensocial.DataRequest()
};
opensocial.Container.prototype.newEnvironment=function(B,A){return new opensocial.Environment(B,A)
};
opensocial.Container.isArray=function(A){return A instanceof Array
};
opensocial.Container.getField=function(A,B,C){var D=A[B];
return opensocial.Container.escape(D,C,false)
};
opensocial.Container.escape=function(C,B,A){if(B&&B.escapeType=="none"){return C
}else{return gadgets.util.escape(C,A)
}};
var caja;
var ___;
var attachDocumentStub;
var uriCallback={rewrite:function rewrite(B,A){B=String(B);
if(/^#/.test(B)){return"#"+encodeURIComponent(decodeURIComponent(B.substring(1)))
}else{if(/^\/(?:[^\/][^?#]*)?$/){return encodeURI(decodeURI(B))
}}return null
}};
opensocial.Container.prototype.enableCaja=function(){___=window.___;
caja=window.caja;
attachDocumentStub=window.attachDocumentStub;
var A=caja.copy(___.sharedImports);
___.getNewModuleHandler().setImports(A);
attachDocumentStub("-g___",uriCallback,A);
var D=document.createElement("div");
D.className="g___";
A.htmlEmitter___=new HtmlEmitter(D);
document.body.appendChild(D);
A.gadgets=gadgets;
A.opensocial=opensocial;
var C={c_gadgets:{c_MiniMessage:{m_createDismissibleMessage:0,m_createStaticMessage:0,m_createTimerMessage:0,m_dismissMessage:0},c_Prefs:{m_getArray:0,m_getBool:0,m_getCountry:0,m_getFloat:0,m_getInt:0,m_getLang:0,m_getMsg:0,m_getString:0,m_set:0,m_setArray:0},c_Tab:{m_getCallback:0,m_getContentContainer:0,m_getIndex:0,m_getName:0,m_getNameContainer:0},c_TabSet:{m_addTab:0,m_alignTabs:0,m_displayTabs:0,m_getHeaderContainer:0,m_getSelectedTab:0,m_getTabs:0,m_removeTab:0,m_setSelectedTab:0,m_swapTabs:0},c_flash:{s_embedCachedFlash:0,s_embedFlash:0,s_getMajorVersion:0},c_io:{c_AuthorizationType:{s_NONE:0,s_OAUTH:0,s_SIGNED:0},c_ContentType:{s_DOM:0,s_FEED:0,s_JSON:0,s_TEXT:0},c_MethodType:{s_DELETE:0,s_GET:0,s_HEAD:0,s_POST:0,s_PUT:0},c_ProxyUrlRequestParameters:{s_REFRESH_INTERVAL:0},c_RequestParameters:{s_AUTHORIZATION:0,s_CONTENT_TYPE:0,s_GET_SUMMARIES:0,s_HEADERS:0,s_METHOD:0,s_NUM_ENTRIES:0,s_POST_DATA:0},s_encodeValues:0,s_getProxyUrl:0,s_makeRequest:0},c_json:{s_parse:0,s_stringify:0},c_pubsub:{s_publish:0,s_subscribe:0,s_unsubscribe:0},c_rpc:{s_call:0,s_register:0,s_registerDefault:0,s_unregister:0,s_unregisterDefault:0},c_skins:{c_Property:{s_ANCHOR_COLOR:0,s_BG_COLOR:0,s_BG_IMAGE:0,s_FONT_COLOR:0},s_getProperty:0},c_util:{s_escapeString:0,s_getFeatureParameters:0,s_hasFeature:0,s_registerOnLoadHandler:0,s_unescapeString:0},c_views:{c_View:{m_bind:0,m_getUrlTemplate:0,m_isOnlyVisibleGadget:0},c_ViewType:{s_CANVAS:0,s_HOME:0,s_PREVIEW:0,s_PROFILE:0},s_bind:0,s_getCurrentView:0,s_getParams:0,s_requestNavigateTo:0},c_window:{s_adjustHeight:0,s_getViewportDimensions:0,s_setTitle:0}},c_opensocial:{c_Activity:{c_Field:{s_APP_ID:0,s_BODY:0,s_BODY_ID:0,s_EXTERNAL_ID:0,s_ID:0,s_MEDIA_ITEMS:0,s_POSTED_TIME:0,s_PRIORITY:0,s_STREAM_FAVICON_URL:0,s_STREAM_SOURCE_URL:0,s_STREAM_TITLE:0,s_STREAM_URL:0,s_TEMPLATE_PARAMS:0,s_TITLE:0,s_TITLE_ID:0,s_URL:0,s_USER_ID:0},m_getField:0,m_getId:0,m_setField:0},c_Address:{c_Field:{s_COUNTRY:0,s_EXTENDED_ADDRESS:0,s_LATITUDE:0,s_LOCALITY:0,s_LONGITUDE:0,s_POSTAL_CODE:0,s_PO_BOX:0,s_REGION:0,s_STREET_ADDRESS:0,s_TYPE:0,s_UNSTRUCTURED_ADDRESS:0},m_getField:0},c_BodyType:{c_Field:{s_BUILD:0,s_EYE_COLOR:0,s_HAIR_COLOR:0,s_HEIGHT:0,s_WEIGHT:0},m_getField:0},c_Collection:{m_asArray:0,m_each:0,m_getById:0,m_getOffset:0,m_getTotalSize:0,m_size:0},c_CreateActivityPriority:{s_HIGH:0,s_LOW:0},c_DataRequest:{c_DataRequestFields:{s_ESCAPE_TYPE:0},c_FilterType:{s_ALL:0,s_HAS_APP:0,s_TOP_FRIENDS:0},c_PeopleRequestFields:{s_FILTER:0,s_FILTER_OPTIONS:0,s_FIRST:0,s_MAX:0,s_PROFILE_DETAILS:0,s_SORT_ORDER:0},c_SortOrder:{s_NAME:0,s_TOP_FRIENDS:0},m_add:0,m_newFetchActivitiesRequest:0,m_newFetchPeopleRequest:0,m_newFetchPersonAppDataRequest:0,m_newFetchPersonRequest:0,m_newRemovePersonAppDataRequest:0,m_newUpdatePersonAppDataRequest:0,m_send:0},c_DataResponse:{m_get:0,m_getErrorMessage:0,m_hadError:0},c_Email:{c_Field:{s_ADDRESS:0,s_TYPE:0},m_getField:0},c_Enum:{c_Drinker:{s_HEAVILY:0,s_NO:0,s_OCCASIONALLY:0,s_QUIT:0,s_QUITTING:0,s_REGULARLY:0,s_SOCIALLY:0,s_YES:0},c_Gender:{s_FEMALE:0,s_MALE:0},c_LookingFor:{s_ACTIVITY_PARTNERS:0,s_DATING:0,s_FRIENDS:0,s_NETWORKING:0,s_RANDOM:0,s_RELATIONSHIP:0},c_Presence:{s_AWAY:0,s_CHAT:0,s_DND:0,s_OFFLINE:0,s_ONLINE:0,s_XA:0},c_Smoker:{s_HEAVILY:0,s_NO:0,s_OCCASIONALLY:0,s_QUIT:0,s_QUITTING:0,s_REGULARLY:0,s_SOCIALLY:0,s_YES:0},m_getDisplayValue:0,m_getKey:0},c_Environment:{c_ObjectType:{s_ACTIVITY:0,s_ACTIVITY_MEDIA_ITEM:0,s_ADDRESS:0,s_BODY_TYPE:0,s_EMAIL:0,s_FILTER_TYPE:0,s_MESSAGE:0,s_MESSAGE_TYPE:0,s_NAME:0,s_ORGANIZATION:0,s_PERSON:0,s_PHONE:0,s_SORT_ORDER:0,s_URL:0},m_getDomain:0,m_supportsField:0},c_EscapeType:{s_HTML_ESCAPE:0,s_NONE:0},c_IdSpec:{c_Field:{s_GROUP_ID:0,s_NETWORK_DISTANCE:0,s_USER_ID:0},c_PersonId:{s_OWNER:0,s_VIEWER:0},m_getField:0,m_setField:0},c_MediaItem:{c_Field:{s_MIME_TYPE:0,s_TYPE:0,s_URL:0},c_Type:{s_AUDIO:0,s_IMAGE:0,s_VIDEO:0},m_getField:0,m_setField:0},c_Message:{c_Field:{s_BODY:0,s_BODY_ID:0,s_TITLE:0,s_TITLE_ID:0,s_TYPE:0},c_Type:{s_EMAIL:0,s_NOTIFICATION:0,s_PRIVATE_MESSAGE:0,s_PUBLIC_MESSAGE:0},m_getField:0,m_setField:0},c_Name:{c_Field:{s_ADDITIONAL_NAME:0,s_FAMILY_NAME:0,s_GIVEN_NAME:0,s_HONORIFIC_PREFIX:0,s_HONORIFIC_SUFFIX:0,s_UNSTRUCTURED:0},m_getField:0},c_NavigationParameters:{c_DestinationType:{s_RECIPIENT_DESTINATION:0,s_VIEWER_DESTINATION:0},c_Field:{s_OWNER:0,s_PARAMETERS:0,s_VIEW:0},m_getField:0,m_setField:0},c_Organization:{c_Field:{s_ADDRESS:0,s_DESCRIPTION:0,s_END_DATE:0,s_FIELD:0,s_NAME:0,s_SALARY:0,s_START_DATE:0,s_SUB_FIELD:0,s_TITLE:0,s_WEBPAGE:0},m_getField:0},c_Permission:{s_VIEWER:0},c_Person:{c_Field:{s_ABOUT_ME:0,s_ACTIVITIES:0,s_ADDRESSES:0,s_AGE:0,s_BODY_TYPE:0,s_BOOKS:0,s_CARS:0,s_CHILDREN:0,s_CURRENT_LOCATION:0,s_DATE_OF_BIRTH:0,s_DRINKER:0,s_EMAILS:0,s_ETHNICITY:0,s_FASHION:0,s_FOOD:0,s_GENDER:0,s_HAPPIEST_WHEN:0,s_HAS_APP:0,s_HEROES:0,s_HUMOR:0,s_ID:0,s_INTERESTS:0,s_JOBS:0,s_JOB_INTERESTS:0,s_LANGUAGES_SPOKEN:0,s_LIVING_ARRANGEMENT:0,s_LOOKING_FOR:0,s_MOVIES:0,s_MUSIC:0,s_NAME:0,s_NETWORK_PRESENCE:0,s_NICKNAME:0,s_PETS:0,s_PHONE_NUMBERS:0,s_POLITICAL_VIEWS:0,s_PROFILE_SONG:0,s_PROFILE_URL:0,s_PROFILE_VIDEO:0,s_QUOTES:0,s_RELATIONSHIP_STATUS:0,s_RELIGION:0,s_ROMANCE:0,s_SCARED_OF:0,s_SCHOOLS:0,s_SEXUAL_ORIENTATION:0,s_SMOKER:0,s_SPORTS:0,s_STATUS:0,s_TAGS:0,s_THUMBNAIL_URL:0,s_TIME_ZONE:0,s_TURN_OFFS:0,s_TURN_ONS:0,s_TV_SHOWS:0,s_URLS:0},m_getDisplayName:0,m_getField:0,m_getId:0,m_isOwner:0,m_isViewer:0},c_Phone:{c_Field:{s_NUMBER:0,s_TYPE:0},m_getField:0},c_ResponseItem:{c_Error:{s_BAD_REQUEST:0,s_FORBIDDEN:0,s_INTERNAL_ERROR:0,s_LIMIT_EXCEEDED:0,s_NOT_IMPLEMENTED:0,s_UNAUTHORIZED:0},m_getData:0,m_getErrorCode:0,m_getErrorMessage:0,m_getOriginalDataRequest:0,m_hadError:0},c_Url:{c_Field:{s_ADDRESS:0,s_LINK_TEXT:0,s_TYPE:0},m_getField:0},s_getEnvironment:0,s_hasPermission:0,s_newActivity:0,s_newDataRequest:0,s_newIdSpec:0,s_newMediaItem:0,s_newMessage:0,s_newNavigationParameters:0,s_requestCreateActivity:0,s_requestPermission:0,s_requestSendMessage:0,s_requestShareApp:0}};
function B(I,J){if(!J){return 
}for(var F in I){if(I.hasOwnProperty(F)){var E=F.match(/^([mcs])_(\w+)$/);
var H=E[1],G=E[2];
switch(H){case"c":___.allowRead(J,G);
B(I[F],J[G]);
break;
case"m":___.allowCall(J.prototype,G);
break;
case"f":___.allowRead(J.prototype,G);
break;
case"s":if("function"===typeof J[G]){___.allowCall(J,G)
}else{___.allowRead(J,G)
}break
}}}}B(C,window)
};;
opensocial.DataRequest=function(){this.requestObjects_=[]
};
opensocial.DataRequest.prototype.requestObjects_=null;
opensocial.DataRequest.prototype.getRequestObjects=function(){return this.requestObjects_
};
opensocial.DataRequest.prototype.add=function(B,A){return this.requestObjects_.push({key:A,request:B})
};
opensocial.DataRequest.prototype.send=function(A){var B=A||function(){};
opensocial.Container.get().requestData(this,B)
};
opensocial.DataRequest.SortOrder={TOP_FRIENDS:"topFriends",NAME:"name"};
opensocial.DataRequest.FilterType={ALL:"all",HAS_APP:"hasApp",TOP_FRIENDS:"topFriends",IS_FRIENDS_WITH:"isFriendsWith"};
opensocial.DataRequest.PeopleRequestFields={PROFILE_DETAILS:"profileDetail",SORT_ORDER:"sortOrder",FILTER:"filter",FILTER_OPTIONS:"filterOptions",FIRST:"first",MAX:"max"};
opensocial.DataRequest.prototype.addDefaultParam=function(C,B,A){C[B]=C[B]||A
};
opensocial.DataRequest.prototype.addDefaultProfileFields=function(B){var A=opensocial.DataRequest.PeopleRequestFields;
var C=B[A.PROFILE_DETAILS]||[];
B[A.PROFILE_DETAILS]=C.concat([opensocial.Person.Field.ID,opensocial.Person.Field.NAME,opensocial.Person.Field.THUMBNAIL_URL])
};
opensocial.DataRequest.prototype.asArray=function(A){if(opensocial.Container.isArray(A)){return A
}else{return[A]
}};
opensocial.DataRequest.prototype.newFetchPersonRequest=function(B,A){A=A||{};
this.addDefaultProfileFields(A);
return opensocial.Container.get().newFetchPersonRequest(B,A)
};
opensocial.DataRequest.prototype.newFetchPeopleRequest=function(B,C){C=C||{};
var A=opensocial.DataRequest.PeopleRequestFields;
this.addDefaultProfileFields(C);
this.addDefaultParam(C,A.SORT_ORDER,opensocial.DataRequest.SortOrder.TOP_FRIENDS);
this.addDefaultParam(C,A.FILTER,opensocial.DataRequest.FilterType.ALL);
this.addDefaultParam(C,A.FIRST,0);
this.addDefaultParam(C,A.MAX,20);
return opensocial.Container.get().newFetchPeopleRequest(B,C)
};
opensocial.DataRequest.DataRequestFields={ESCAPE_TYPE:"escapeType"};
opensocial.DataRequest.prototype.newFetchPersonAppDataRequest=function(A,C,B){return opensocial.Container.get().newFetchPersonAppDataRequest(A,this.asArray(C),B)
};
opensocial.DataRequest.prototype.newUpdatePersonAppDataRequest=function(C,A,B){return opensocial.Container.get().newUpdatePersonAppDataRequest(C,A,B)
};
opensocial.DataRequest.prototype.newRemovePersonAppDataRequest=function(B,A){return opensocial.Container.get().newRemovePersonAppDataRequest(B,A)
};
opensocial.DataRequest.ActivityRequestFields={APP_ID:"appId"};
opensocial.DataRequest.prototype.newFetchActivitiesRequest=function(A,B){B=B||{};
return opensocial.Container.get().newFetchActivitiesRequest(A,B)
};
opensocial.DataRequest.AlbumRequestFields={ALBUM_ID:"albumId",FIRST:"first",MAX:"max"};
opensocial.DataRequest.prototype.newFetchAlbumsRequest=function(A,B){B=B||{};
return opensocial.Container.get().newFetchAlbumsRequest(A,B)
};
opensocial.DataRequest.prototype.newFetchMediaItemsRequest=function(A,B,C){C=C||{};
return opensocial.Container.get().newFetchMediaItemsRequest(A,B,C)
};;
opensocial.DataResponse=function(A,B,C){this.responseItems_=A;
this.globalError_=B;
this.errorMessage_=C
};
opensocial.DataResponse.prototype.hadError=function(){return !!this.globalError_
};
opensocial.DataResponse.prototype.getErrorMessage=function(){return this.errorMessage_
};
opensocial.DataResponse.prototype.get=function(A){return this.responseItems_[A]
};;
opensocial.Email=function(A){this.fields_=A||{}
};
opensocial.Email.Field={TYPE:"type",ADDRESS:"address"};
opensocial.Email.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.Enum=function(B,A){this.key=B;
this.displayValue=A
};
opensocial.Enum.prototype.getKey=function(){return gadgets.util.escape(this.key)
};
opensocial.Enum.prototype.getDisplayValue=function(){return gadgets.util.escape(this.displayValue)
};
opensocial.Enum.Smoker={NO:"NO",YES:"YES",SOCIALLY:"SOCIALLY",OCCASIONALLY:"OCCASIONALLY",REGULARLY:"REGULARLY",HEAVILY:"HEAVILY",QUITTING:"QUITTING",QUIT:"QUIT"};
opensocial.Enum.Drinker={NO:"NO",YES:"YES",SOCIALLY:"SOCIALLY",OCCASIONALLY:"OCCASIONALLY",REGULARLY:"REGULARLY",HEAVILY:"HEAVILY",QUITTING:"QUITTING",QUIT:"QUIT"};
opensocial.Enum.Gender={MALE:"MALE",FEMALE:"FEMALE"};
opensocial.Enum.LookingFor={DATING:"DATING",FRIENDS:"FRIENDS",RELATIONSHIP:"RELATIONSHIP",NETWORKING:"NETWORKING",ACTIVITY_PARTNERS:"ACTIVITY_PARTNERS",RANDOM:"RANDOM"};
opensocial.Enum.Presence={AWAY:"AWAY",CHAT:"CHAT",DND:"DND",OFFLINE:"OFFLINE",ONLINE:"ONLINE",XA:"XA"};;
opensocial.Environment=function(B,A){this.domain=B;
this.supportedFields=A
};
opensocial.Environment.prototype.getDomain=function(){return this.domain
};
opensocial.Environment.ObjectType={PERSON:"person",ADDRESS:"address",BODY_TYPE:"bodyType",EMAIL:"email",NAME:"name",ORGANIZATION:"organization",PHONE:"phone",URL:"url",ACTIVITY:"activity",MEDIA_ITEM:"mediaItem",MESSAGE:"message",MESSAGE_TYPE:"messageType",SORT_ORDER:"sortOrder",FILTER_TYPE:"filterType"};
opensocial.Environment.prototype.supportsField=function(A,C){var B=this.supportedFields[A]||[];
return !!B[C]
};;
opensocial.IdSpec=function(A){this.fields_=A||{}
};
opensocial.IdSpec.Field={USER_ID:"userId",GROUP_ID:"groupId",NETWORK_DISTANCE:"networkDistance"};
opensocial.IdSpec.PersonId={OWNER:"OWNER",VIEWER:"VIEWER"};
opensocial.IdSpec.GroupId={SELF:"SELF",FRIENDS:"FRIENDS",ALL:"ALL"};
opensocial.IdSpec.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.IdSpec.prototype.setField=function(A,B){return this.fields_[A]=B
};;
opensocial.MediaItem=function(C,A,B){this.fields_=B||{};
this.fields_[opensocial.MediaItem.Field.MIME_TYPE]=C;
this.fields_[opensocial.MediaItem.Field.URL]=A
};
opensocial.MediaItem.Type={IMAGE:"image",VIDEO:"video",AUDIO:"audio"};
opensocial.MediaItem.Field={TYPE:"type",MIME_TYPE:"mimeType",URL:"url",THUMBNAIL_URL:"thumbnailUrl",ALBUM_ID:"albumId",DESCRIPTION:"description"};
opensocial.MediaItem.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.MediaItem.prototype.setField=function(A,B){return this.fields_[A]=B
};;
opensocial.Message=function(A,B){this.fields_=B||{};
this.fields_[opensocial.Message.Field.BODY]=A
};
opensocial.Message.Field={TYPE:"type",TITLE:"title",BODY:"body",TITLE_ID:"titleId",BODY_ID:"bodyId"};
opensocial.Message.Type={EMAIL:"email",NOTIFICATION:"notification",PRIVATE_MESSAGE:"privateMessage",PUBLIC_MESSAGE:"publicMessage"};
opensocial.Message.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.Message.prototype.setField=function(A,B){return this.fields_[A]=B
};;
opensocial.Name=function(A){this.fields_=A||{}
};
opensocial.Name.Field={FAMILY_NAME:"familyName",GIVEN_NAME:"givenName",ADDITIONAL_NAME:"additionalName",HONORIFIC_PREFIX:"honorificPrefix",HONORIFIC_SUFFIX:"honorificSuffix",UNSTRUCTURED:"unstructured"};
opensocial.Name.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.NavigationParameters=function(A){this.fields_=A||{}
};
opensocial.NavigationParameters.Field={VIEW:"view",OWNER:"owner",PARAMETERS:"parameters"};
opensocial.NavigationParameters.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.NavigationParameters.prototype.setField=function(A,B){return this.fields_[A]=B
};
opensocial.NavigationParameters.DestinationType={VIEWER_DESTINATION:"viewerDestination",RECIPIENT_DESTINATION:"recipientDestination"};;
opensocial.Organization=function(A){this.fields_=A||{}
};
opensocial.Organization.Field={NAME:"name",TITLE:"title",DESCRIPTION:"description",FIELD:"field",SUB_FIELD:"subField",START_DATE:"startDate",END_DATE:"endDate",SALARY:"salary",ADDRESS:"address",WEBPAGE:"webpage"};
opensocial.Organization.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.Person=function(A,B,C){this.fields_=A||{};
this.isOwner_=B;
this.isViewer_=C
};
opensocial.Person.Field={ID:"id",NAME:"name",NICKNAME:"nickname",THUMBNAIL_URL:"thumbnailUrl",PROFILE_URL:"profileUrl",CURRENT_LOCATION:"currentLocation",ADDRESSES:"addresses",EMAILS:"emails",PHONE_NUMBERS:"phoneNumbers",ABOUT_ME:"aboutMe",STATUS:"status",PROFILE_SONG:"profileSong",PROFILE_VIDEO:"profileVideo",GENDER:"gender",SEXUAL_ORIENTATION:"sexualOrientation",RELATIONSHIP_STATUS:"relationshipStatus",AGE:"age",DATE_OF_BIRTH:"dateOfBirth",BODY_TYPE:"bodyType",ETHNICITY:"ethnicity",SMOKER:"smoker",DRINKER:"drinker",CHILDREN:"children",PETS:"pets",LIVING_ARRANGEMENT:"livingArrangement",TIME_ZONE:"timeZone",LANGUAGES_SPOKEN:"languagesSpoken",JOBS:"jobs",JOB_INTERESTS:"jobInterests",SCHOOLS:"schools",INTERESTS:"interests",URLS:"urls",MUSIC:"music",MOVIES:"movies",TV_SHOWS:"tvShows",BOOKS:"books",ACTIVITIES:"activities",SPORTS:"sports",HEROES:"heroes",QUOTES:"quotes",CARS:"cars",FOOD:"food",TURN_ONS:"turnOns",TURN_OFFS:"turnOffs",TAGS:"tags",ROMANCE:"romance",SCARED_OF:"scaredOf",HAPPIEST_WHEN:"happiestWhen",FASHION:"fashion",HUMOR:"humor",LOOKING_FOR:"lookingFor",RELIGION:"religion",POLITICAL_VIEWS:"politicalViews",HAS_APP:"hasApp",NETWORK_PRESENCE:"networkPresence"};
opensocial.Person.prototype.getId=function(){return this.getField(opensocial.Person.Field.ID)
};
var ORDERED_NAME_FIELDS_=[opensocial.Name.Field.HONORIFIC_PREFIX,opensocial.Name.Field.GIVEN_NAME,opensocial.Name.Field.FAMILY_NAME,opensocial.Name.Field.HONORIFIC_SUFFIX,opensocial.Name.Field.ADDITIONAL_NAME];
opensocial.Person.prototype.getDisplayName=function(){return this.getField(opensocial.Person.Field.NICKNAME)
};
opensocial.Person.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};
opensocial.Person.prototype.isViewer=function(){return !!this.isViewer_
};
opensocial.Person.prototype.isOwner=function(){return !!this.isOwner_
};;
opensocial.Phone=function(A){this.fields_=A||{}
};
opensocial.Phone.Field={TYPE:"type",NUMBER:"number"};
opensocial.Phone.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.ResponseItem=function(A,C,B,D){this.originalDataRequest_=A;
this.data_=C;
this.errorCode_=B;
this.errorMessage_=D
};
opensocial.ResponseItem.prototype.hadError=function(){return !!this.errorCode_
};
opensocial.ResponseItem.Error={NOT_IMPLEMENTED:"notImplemented",UNAUTHORIZED:"unauthorized",FORBIDDEN:"forbidden",BAD_REQUEST:"badRequest",INTERNAL_ERROR:"internalError",LIMIT_EXCEEDED:"limitExceeded"};
opensocial.ResponseItem.prototype.getErrorCode=function(){return this.errorCode_
};
opensocial.ResponseItem.prototype.getErrorMessage=function(){return this.errorMessage_
};
opensocial.ResponseItem.prototype.getOriginalDataRequest=function(){return this.originalDataRequest_
};
opensocial.ResponseItem.prototype.getData=function(){return this.data_
};;
opensocial.Url=function(A){this.fields_=A||{}
};
opensocial.Url.Field={TYPE:"type",LINK_TEXT:"linkText",ADDRESS:"address"};
opensocial.Url.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
opensocial.Album=function(A){this.fields_=A||{}
};
opensocial.Album.Field=(function(){function A(C){var B={};
var E;
var D=0;
for(D=0;
D<C.length;
D++){E=C[D].replace(/([A-Z])/g,"_$1").toUpperCase();
B[E]=C[D]
}return B
}return A("description id location mediaItemCount mediaMimeType ownerId thumbnailUrl title".split(/ /))
})();
opensocial.Album.prototype.getField=function(A,B){return opensocial.Container.getField(this.fields_,A,B)
};;
var JsonActivity=function(A,B){A=A||{};
if(!B){JsonActivity.constructArrayObject(A,"mediaItems",JsonMediaItem)
}opensocial.Activity.call(this,A)
};
JsonActivity.inherits(opensocial.Activity);
JsonActivity.prototype.toJsonObject=function(){var C=JsonActivity.copyFields(this.fields_);
var D=C.mediaItems||[];
var A=[];
for(var B=0;
B<D.length;
B++){A[B]=D[B].toJsonObject()
}C.mediaItems=A;
return C
};
var JsonMediaItem=function(A){opensocial.MediaItem.call(this,A.mimeType,A.url,A)
};
JsonMediaItem.inherits(opensocial.MediaItem);
JsonMediaItem.prototype.toJsonObject=function(){return JsonActivity.copyFields(this.fields_)
};
JsonActivity.constructArrayObject=function(D,E,B){var C=D[E];
if(C){for(var A=0;
A<C.length;
A++){C[A]=new B(C[A])
}}};
JsonActivity.copyFields=function(A){var B={};
for(var C in A){B[C]=A[C]
}return B
};;
var JsonPerson=function(A){A=A||{};
JsonPerson.constructObject(A,"bodyType",opensocial.BodyType);
JsonPerson.constructObject(A,"currentLocation",opensocial.Address);
JsonPerson.constructDate(A,"dateOfBirth");
JsonPerson.constructObject(A,"name",opensocial.Name);
JsonPerson.constructObject(A,"profileSong",opensocial.Url);
JsonPerson.constructObject(A,"profileVideo",opensocial.Url);
JsonPerson.constructArrayObject(A,"addresses",opensocial.Address);
JsonPerson.constructArrayObject(A,"emails",opensocial.Email);
JsonPerson.constructArrayObject(A,"jobs",opensocial.Organization);
JsonPerson.constructArrayObject(A,"phoneNumbers",opensocial.Phone);
JsonPerson.constructArrayObject(A,"schools",opensocial.Organization);
JsonPerson.constructArrayObject(A,"urls",opensocial.Url);
JsonPerson.constructEnum(A,"gender");
JsonPerson.constructEnum(A,"smoker");
JsonPerson.constructEnum(A,"drinker");
JsonPerson.constructEnum(A,"networkPresence");
JsonPerson.constructEnumArray(A,"lookingFor");
opensocial.Person.call(this,A,A.isOwner,A.isViewer)
};
JsonPerson.inherits(opensocial.Person);
JsonPerson.constructEnum=function(B,C){var A=B[C];
if(A){B[C]=new opensocial.Enum(A.key,A.displayValue)
}};
JsonPerson.constructEnumArray=function(C,D){var B=C[D];
if(B){for(var A=0;
A<B.length;
A++){B[A]=new opensocial.Enum(B[A].key,B[A].displayValue)
}}};
JsonPerson.constructObject=function(C,D,A){var B=C[D];
if(B){C[D]=new A(B)
}};
JsonPerson.constructArrayObject=function(D,E,B){var C=D[E];
if(C){for(var A=0;
A<C.length;
A++){C[A]=new B(C[A])
}}};
JsonPerson.constructDate=function(B,D){var C=function(L){var M,K,N,H,I,J;
var E=L.split(/T/);
var F=E[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
if(!F){return undefined
}M=new Number(F[1]);
K=new Number(F[2])-1;
N=new Number(F[3]);
if(!E[1]){return new Date(M,K,N)
}var G={};
F=E[1].match(/([-+])(\d{2}):(\d{2})$/);
if(F){G={sign:F[1]=="-"?+1:-1,hour:new Number(F[2]),min:new Number(F[3])}
}else{if(E[1].match(/Z$/)){G={sign:+1,hour:0,min:0}
}}F=E[1].match(/^(\d{2}):(\d{2}):(\d{2})/);
if(F){H=new Number(F[1]);
I=new Number(F[2]);
J=new Number(F[3]);
if(G){return new Date(Date.UTC(M,K,N,G.sign*G.hour+H,G.sign*G.min+I,J))
}return new Date(M,K,N,H,I,J)
}return undefined
};
var A=B[D];
if(A){B[D]=C(A)||new Date(A)
}};;
var RestfulContainer=function(E,G,F){opensocial.Container.call(this);
var D={};
for(var B in F){if(F.hasOwnProperty(B)){D[B]={};
for(var C=0;
C<F[B].length;
C++){var A=F[B][C];
D[B][A]=true
}}}this.environment_=new opensocial.Environment(G,D);
this.securityToken_=shindig.auth.getSecurityToken()
};
RestfulContainer.inherits(opensocial.Container);
RestfulContainer.prototype.getEnvironment=function(){return this.environment_
};
RestfulContainer.prototype.requestCreateActivity=function(D,B,A){A=A||function(){};
var C=opensocial.newDataRequest();
var E=new opensocial.IdSpec({userId:"VIEWER"});
C.add(this.newCreateActivityRequest(E,D),"key");
C.send(function(F){A(F.get("key"))
})
};
RestfulContainer.prototype.requestData=function(E,K){K=K||function(){};
var M=this;
var C=E.getRequestObjects();
var I=C.length;
var G={};
var J=0;
var F=null;
var B=null;
if(I==0){K(new opensocial.DataResponse({},true));
return 
}var L=function(X){if(J==I){var W={};
var O=false;
for(var P=0;
P<I;
P++){var R=C[P];
var Q=G[R.key];
var N=Q;
var U=Q.error;
var T="";
if(U){T=U.message
}var S=R.request.processResponse(R.request,N,U,T);
O=O||S.hadError();
W[R.key]=S
}var V=new opensocial.DataResponse(W,O);
clearInterval(B);
K(V)
}};
var A=function(N){if(N.errors.length!=0){RestfulContainer.generateErrorResponse(N,C,K);
return 
}N=N.data;
var O=N||{};
var P=C[J].key;
G[P]=O;
J++;
L()
};
var D=0;
var H=function(){if(J==I||J==F){return 
}else{F=J
}var N=C[J];
var O="/social/data"+N.request.url+"&st="+encodeURIComponent(shindig.auth.getSecurityToken());
var P={CONTENT_TYPE:"JSON",METHOD:N.request.method,AUTHORIZATION:"SIGNED",POST_DATA:gadgets.json.stringify(N.request.postData)};
gadgets.io.makeNonProxiedRequest(O,A,P,"application/json")
};
B=window.setInterval(H,1)
};
RestfulContainer.generateErrorResponse=function(A,E,G){var C=RestfulContainer.translateHttpError(A.errors[0])||opensocial.ResponseItem.Error.INTERNAL_ERROR;
var F={};
var B=E.length;
for(var D=0;
D<B;
D++){F[E[D].key]=new opensocial.ResponseItem(E[D].request,null,C)
}G(new opensocial.DataResponse(F,true))
};
RestfulContainer.translateHttpError=function(A){if(A=="Error 501"){return opensocial.ResponseItem.Error.NOT_IMPLEMENTED
}else{if(A=="Error 401"){return opensocial.ResponseItem.Error.UNAUTHORIZED
}else{if(A=="Error 403"){return opensocial.ResponseItem.Error.FORBIDDEN
}else{if(A=="Error 400"){return opensocial.ResponseItem.Error.BAD_REQUEST
}else{if(A=="Error 500"){return opensocial.ResponseItem.Error.INTERNAL_ERROR
}else{if(A=="Error 404"){return opensocial.ResponseItem.Error.BAD_REQUEST
}}}}}}};
RestfulContainer.prototype.makeIdSpec=function(D){var C=D.split("_");
var A=C[0];
var B="SELF";
if(C.length>0){B=C[1]
}return new opensocial.IdSpec({userId:A,groupId:B})
};
RestfulContainer.prototype.translateIdSpec=function(A){if(A instanceof String||typeof A=="string"){A=this.makeIdSpec(A)
}var D=A.getField("userId");
var C=A.getField("groupId");
if(D=="OWNER"){D="@owner"
}else{if(D=="VIEWER"){D="@viewer"
}else{if(opensocial.Container.isArray(A)){for(var B=0;
B<A.length;
B++){}}}}if(C=="FRIENDS"){C="@friends"
}else{if(C=="SELF"||!C){C="@self"
}}return D+"/"+C
};
RestfulContainer.prototype.getNetworkDistance=function(A){if(A instanceof String||typeof A=="string"){A=this.makeIdSpec(A)
}var B=A.getField("networkDistance")||"";
return"networkDistance="+B
};
RestfulContainer.prototype.newFetchPersonRequest=function(A,D){var B=this.newFetchPeopleRequest(A,D);
var C=this;
return new RestfulRequestItem(B.url,B.method,null,function(F){var E;
if(F.entry){E=F.entry
}else{E=F
}return C.createPersonFromJson(E)
})
};
RestfulContainer.prototype.newFetchPeopleRequest=function(A,D){var B="/people/"+this.translateIdSpec(A);
if(!D){D=[]
}if(!D.profileDetail){D.profileDetail=[]
}B+="?fields="+(D.profileDetail.join(","));
B+="&startIndex="+(D.first||0);
B+="&count="+(D.max||20);
B+="&orderBy="+(D.sortOrder||"topFriends");
B+="&filterBy="+(D.filter||"all");
B+="&"+this.getNetworkDistance(A);
var C=this;
return new RestfulRequestItem(B,"GET",null,function(H){var G;
if(H.entry){G=H.entry
}else{G=[H]
}var F=[];
for(var E=0;
E<G.length;
E++){F.push(C.createPersonFromJson(G[E]))
}return new opensocial.Collection(F,H.startIndex,H.totalResults)
})
};
RestfulContainer.prototype.createPersonFromJson=function(A){return new JsonPerson(A)
};
RestfulContainer.prototype.getFieldsList=function(A){if(this.hasNoKeys(A)||this.isWildcardKey(A[0])){return""
}else{return"fields="+A.join(",")
}};
RestfulContainer.prototype.hasNoKeys=function(A){return !A||A.length==0
};
RestfulContainer.prototype.isWildcardKey=function(A){return A=="*"
};
RestfulContainer.prototype.newFetchPersonAppDataRequest=function(A,D,C){var B="/appdata/"+this.translateIdSpec(A)+"/@app?"+this.getNetworkDistance(A)+"&"+this.getFieldsList(D);
return new RestfulRequestItem(B,"GET",null,function(E){var F;
if(E.entry){F=E.entry
}else{F=E
}return opensocial.Container.escape(F,C,true)
})
};
RestfulContainer.prototype.newUpdatePersonAppDataRequest=function(A,C,E){var B="/appdata/"+this.translateIdSpec(A)+"/@app?fields="+C;
var D={};
D[C]=E;
return new RestfulRequestItem(B,"POST",D)
};
RestfulContainer.prototype.newRemovePersonAppDataRequest=function(A,C){var B="/appdata/"+this.translateIdSpec(A)+"/@app?"+this.getFieldsList(C);
return new RestfulRequestItem(B,"DELETE")
};
RestfulContainer.prototype.newFetchActivitiesRequest=function(A,C){var B="/activities/"+this.translateIdSpec(A)+"?appId=@app&"+this.getNetworkDistance(A);
return new RestfulRequestItem(B,"GET",null,function(E){E=E.entry;
var F=[];
for(var D=0;
D<E.length;
D++){F.push(new JsonActivity(E[D]))
}return new opensocial.Collection(F)
})
};
RestfulContainer.prototype.newActivity=function(A){return new JsonActivity(A,true)
};
RestfulContainer.prototype.newMediaItem=function(C,A,B){B=B||{};
B.mimeType=C;
B.url=A;
return new JsonMediaItem(B)
};
RestfulContainer.prototype.newCreateActivityRequest=function(A,C){var B="/activities/"+this.translateIdSpec(A)+"/@app?"+this.getNetworkDistance(A);
return new RestfulRequestItem(B,"POST",C.toJsonObject())
};
RestfulContainer.prototype.newFetchCommunityRequest=function(A,C){var B="/social/data/groups/"+this.translateIdSpec(A)+"?format=json";
return new RestfulRequestItem(B,"GET",null,function(E){var F=E.entry;
var G=[];
for(var D=0;
D<F.length;
D++){G.push(new mixi.Community(E[D]))
}return new opensocial.Collection(G,E.startIndex,E.totalResults)
})
};
var RestfulRequestItem=function(C,D,A,B){this.url=C;
this.method=D;
this.postData=A;
this.processData=B||function(E){return E
};
this.processResponse=function(E,H,G,F){return new opensocial.ResponseItem(E,G?null:this.processData(H),G,F)
}
};
(function(){function A(C,D){var E=[];
var B;
for(B=0;
B<D.length;
B++){E.push(C(D[B]))
}return E
}RestfulContainer.prototype.newFetchAlbumsRequest=function(B,D){var C="/albums/"+this.translateIdSpec(B)+"/?"+this.getNetworkDistance(B);
var E=function(G){var F=A(function(H){return new opensocial.Album(H)
},G.entry);
return new opensocial.Collection(F)
};
return new RestfulRequestItem(C,"GET",null,E)
};
RestfulContainer.prototype.newFetchMediaItemsRequest=function(B,D,E){var C="/mediaitems/"+this.translateIdSpec(B)+"/"+D+"/?"+this.getNetworkDistance(B);
var F=function(H){var G=A(function(I){return new opensocial.MediaItem("image/jpeg",I.url,I)
},H.entry);
return new opensocial.Collection(G)
};
return new RestfulRequestItem(C,"GET",null,F)
}
})();;
var JsonRpcContainer=function(E,G,F){opensocial.Container.call(this);
var D={};
for(var B in F){if(F.hasOwnProperty(B)){D[B]={};
for(var C=0;
C<F[B].length;
C++){var A=F[B][C];
D[B][A]=true
}}}this.environment_=new opensocial.Environment(G,D);
this.baseUrl_=E;
this.securityToken_=shindig.auth.getSecurityToken()
};
JsonRpcContainer.inherits(opensocial.Container);
JsonRpcContainer.prototype.getEnvironment=function(){return this.environment_
};
JsonRpcContainer.prototype.requestCreateActivity=function(D,B,A){A=A||{};
var C=opensocial.newDataRequest();
var E=new opensocial.IdSpec({userId:"VIEWER"});
C.add(this.newCreateActivityRequest(E,D),"key");
C.send(function(F){A(F.get("key"))
})
};
JsonRpcContainer.prototype.requestData=function(D,H){H=H||{};
var B=D.getRequestObjects();
var F=B.length;
if(F==0){H(new opensocial.DataResponse({},true));
return 
}var I=new Array(F);
for(var C=0;
C<F;
C++){var G=B[C];
I[C]=G.request.rpc;
if(G.key){I[C].id=G.key
}}var A=function(U){if(U.errors[0]){JsonRpcContainer.generateErrorResponse(U,B,H);
return 
}U=U.data;
var K=false;
var T={};
for(var O=0;
O<U.length;
O++){U[U[O].id]=U[O]
}for(var L=0;
L<B.length;
L++){var N=B[L];
var M=U[L];
if(N.key&&M.id!=N.key){throw"Request key("+N.key+") and response id("+M.id+") do not match"
}var J=M.data;
var R=M.error;
var Q="";
if(R){Q=R.message
}var P=N.request.processResponse(N.request,J,R,Q);
K=K||P.hadError();
if(N.key){T[N.key]=P
}}var S=new opensocial.DataResponse(T,K);
H(S)
};
var E={CONTENT_TYPE:"JSON",METHOD:"POST",AUTHORIZATION:"SIGNED",POST_DATA:gadgets.json.stringify(I)};
gadgets.io.makeNonProxiedRequest(this.baseUrl_+"/rpc?st="+encodeURIComponent(shindig.auth.getSecurityToken()),A,E,"application/json")
};
JsonRpcContainer.generateErrorResponse=function(A,D,F){var B=JsonRpcContainer.translateHttpError(A.errors[0]||A.data.error)||opensocial.ResponseItem.Error.INTERNAL_ERROR;
var E={};
for(var C=0;
C<D.length;
C++){E[D[C].key]=new opensocial.ResponseItem(D[C].request,null,B)
}F(new opensocial.DataResponse(E,true))
};
JsonRpcContainer.translateHttpError=function(A){if(A=="Error 501"){return opensocial.ResponseItem.Error.NOT_IMPLEMENTED
}else{if(A=="Error 401"){return opensocial.ResponseItem.Error.UNAUTHORIZED
}else{if(A=="Error 403"){return opensocial.ResponseItem.Error.FORBIDDEN
}else{if(A=="Error 400"){return opensocial.ResponseItem.Error.BAD_REQUEST
}else{if(A=="Error 500"){return opensocial.ResponseItem.Error.INTERNAL_ERROR
}else{if(A=="Error 404"){return opensocial.ResponseItem.Error.BAD_REQUEST
}else{if(A=="Error 417"){return opensocial.ResponseItem.Error.LIMIT_EXCEEDED
}}}}}}}};
JsonRpcContainer.prototype.makeIdSpec=function(A){return new opensocial.IdSpec({userId:A})
};
JsonRpcContainer.prototype.translateIdSpec=function(A){var D=A.getField("userId");
var C=A.getField("groupId");
if(!opensocial.Container.isArray(D)){D=[D]
}for(var B=0;
B<D.length;
B++){if(D[B]=="OWNER"){D[B]="@owner"
}else{if(D[B]=="VIEWER"){D[B]="@viewer"
}}}if(C=="FRIENDS"){C="@friends"
}else{if(C=="SELF"||!C){C="@self"
}}return{userId:D,groupId:C}
};
JsonRpcContainer.prototype.newFetchPersonRequest=function(D,C){var A=this.newFetchPeopleRequest(this.makeIdSpec(D),C);
var B=this;
return new JsonRpcRequestItem(A.rpc,function(E){return B.createPersonFromJson(E)
})
};
JsonRpcContainer.prototype.newFetchPeopleRequest=function(A,C){var D={method:"people.get"};
D.params=this.translateIdSpec(A);
if(C.profileDetail){this.translateProfileDetails(C.profileDetail);
D.params.fields=C.profileDetail
}if(C.first){D.params.startIndex=C.first
}if(C.max){D.params.count=C.max
}if(C.sortOrder){D.params.sortBy=C.sortOrder
}if(C.filter){D.params.filterBy=C.filter
}if(A.getField("networkDistance")){D.params.networkDistance=A.getField("networkDistance")
}var B=this;
return new JsonRpcRequestItem(D,function(H){var G;
if(H.list){G=H.list
}else{G=[H]
}var F=[];
for(var E=0;
E<G.length;
E++){F.push(B.createPersonFromJson(G[E]))
}return new opensocial.Collection(F,H.startIndex,H.totalResults)
})
};
JsonRpcContainer.prototype.translateProfileDetails=function(A){for(var B=0;
B<A.length;
B++){if(A[B]=="dateOfBirth"){A[B]="birthday"
}else{if(A[B]=="timeZone"){A[B]="utcOffset"
}}}};
JsonRpcContainer.prototype.createPersonFromJson=function(A){if(A.emails){for(var E=0;
E<A.emails.length;
E++){A.emails[E].address=A.emails[E].value
}}if(A.phoneNumbers){for(var F=0;
F<A.phoneNumbers.length;
F++){A.phoneNumbers[F].number=A.phoneNumbers[F].value
}}if(A.birthday){A.dateOfBirth=A.birthday
}if(A.utcOffset){A.timeZone=A.utcOffset
}if(A.addresses){for(var C=0;
C<A.addresses.length;
C++){A.addresses[C].unstructuredAddress=A.addresses[C].formatted
}}if(A.gender){var D=A.gender=="male"?"MALE":"FEMALE";
A.gender={key:D,displayValue:A.gender}
}this.translateUrlJson(A.profileSong);
this.translateUrlJson(A.profileVideo);
if(A.urls){for(var B=0;
B<A.urls.length;
B++){this.translateUrlJson(A.urls[B])
}}this.translateEnumJson(A.drinker);
this.translateEnumJson(A.lookingFor);
this.translateEnumJson(A.networkPresence);
this.translateEnumJson(A.smoker);
if(A.organizations){A.jobs=[];
A.schools=[];
for(var G=0;
G<A.organizations.length;
G++){var H=A.organizations[G];
if(H.type=="job"){A.jobs.push(H)
}else{if(H.type=="school"){A.schools.push(H)
}}}}return new JsonPerson(A)
};
JsonRpcContainer.prototype.translateEnumJson=function(A){if(A){A.key=A.value
}};
JsonRpcContainer.prototype.translateUrlJson=function(A){if(A){A.address=A.value
}};
JsonRpcContainer.prototype.getFieldsList=function(A){if(this.hasNoKeys(A)||this.isWildcardKey(A[0])){return[]
}else{return A
}};
JsonRpcContainer.prototype.hasNoKeys=function(A){return !A||A.length==0
};
JsonRpcContainer.prototype.isWildcardKey=function(A){return A=="*"
};
JsonRpcContainer.prototype.newFetchPersonAppDataRequest=function(A,C,B){var D={method:"appdata.get"};
D.params=this.translateIdSpec(A);
D.params.appId="@app";
D.params.fields=this.getFieldsList(C);
if(A.getField("networkDistance")){D.params.networkDistance=A.getField("networkDistance")
}return new JsonRpcRequestItem(D,function(E){return opensocial.Container.escape(E,B,true)
})
};
JsonRpcContainer.prototype.newUpdatePersonAppDataRequest=function(D,A,B){var C={method:"appdata.update"};
C.params=this.translateIdSpec(this.makeIdSpec(D));
C.params.appId="@app";
C.params.data={};
C.params.data[A]=B;
C.params.fields=A;
return new JsonRpcRequestItem(C)
};
JsonRpcContainer.prototype.newRemovePersonAppDataRequest=function(C,A){var B={method:"appdata.delete"};
B.params=this.translateIdSpec(this.makeIdSpec(C));
B.params.appId="@app";
B.params.fields=this.getFieldsList(A);
return new JsonRpcRequestItem(B)
};
JsonRpcContainer.prototype.newFetchActivitiesRequest=function(A,B){var C={method:"activities.get"};
C.params=this.translateIdSpec(A);
C.params.appId="@app";
if(A.getField("networkDistance")){C.params.networkDistance=A.getField("networkDistance")
}return new JsonRpcRequestItem(C,function(E){E=E.list;
var F=[];
for(var D=0;
D<E.length;
D++){F.push(new JsonActivity(E[D]))
}return new opensocial.Collection(F)
})
};
JsonRpcContainer.prototype.newActivity=function(A){return new JsonActivity(A,true)
};
JsonRpcContainer.prototype.newMediaItem=function(C,A,B){B=B||{};
B.mimeType=C;
B.url=A;
return new JsonMediaItem(B)
};
JsonRpcContainer.prototype.newCreateActivityRequest=function(A,B){var C={method:"activities.create"};
C.params=this.translateIdSpec(A);
C.params.appId="@app";
if(A.getField("networkDistance")){C.params.networkDistance=A.getField("networkDistance")
}C.params.activity=B.toJsonObject();
return new JsonRpcRequestItem(C)
};
var JsonRpcRequestItem=function(B,A){this.rpc=B;
this.processData=A||function(C){return C
};
this.processResponse=function(C,F,E,D){var G=E?JsonRpcContainer.translateHttpError("Error "+E.code):null;
return new opensocial.ResponseItem(C,E?null:this.processData(F),G,D)
}
};;
if(typeof (mixi)=="undefined"){var mixi=function(){}
}mixi.newFetchCommunityRequest=function(A,B){return opensocial.Container.get().newFetchCommunityRequest(A,B)
};
mixi.Community=function(A){this.fields=A||{}
};
mixi.Community.prototype.getName=function(){var A=this.fields[mixi.Community.Field.TITLE];
if(A){return A
}return""
};
mixi.Community.prototype.getId=function(){var A=this.fields[mixi.Community.Field.ID];
if(A){return A
}return""
};
mixi.Community.prototype.getField=function(A){return this.fields[A]
};
mixi.Community.Field={ID:"id",TITLE:"title",THUMBNAIL_URL:"thumbnailUrl",URL:"url",UPDATED:"updated"};
mixi.PersonField={BLOOD_TYPE:"bloodType"};;
 
      var requiredConfig = {
        "impl": gadgets.config.NonEmptyStringValidator,
        "path": gadgets.config.NonEmptyStringValidator,
        "domain": gadgets.config.NonEmptyStringValidator,
        "enableCaja": gadgets.config.BooleanValidator,
        "supportedFields": gadgets.config.ExistsValidator
      };
 
      gadgets.config.register("opensocial-0.8", requiredConfig,
        function(config) {
          var configParams = config["opensocial-0.8"];
 
          if (configParams.impl == "rpc") {
            ShindigContainer = function() {
              JsonRpcContainer.call(this, configParams.path,
              configParams.domain, configParams.supportedFields);
            };
            ShindigContainer.inherits(JsonRpcContainer);
          } else {
            ShindigContainer = function() {
              RestfulContainer.call(this, configParams.path,
              configParams.domain, configParams.supportedFields);
            };
            ShindigContainer.inherits(RestfulContainer);
          }
 
          opensocial.Container.setContainer(new ShindigContainer());
 
          if (window['caja']) {
            opensocial.Container.get().enableCaja();
          }
      });
 
    ;
gadgets.config.init({"shindig.auth":{"authToken":"","trustedJson":""},"core.util":{"opensocial-0.8":{},"tabs":{}},"core.io":{"jsonProxyUrl":"makeRequest","proxyUrl":"proxy?refresh=%refresh%&url=%url%"},"opensocial-0.8":{"impl":"rest","domain":"app0.mixi-platform.com","path":"http://app0.mixi-platform.com/social","supportedFields":{"person":["id","nickname","thumbnailUrl","name","profileUrl","lastLogin","updated","age","dateOfBirth","gender","addresses","bloodType","hasApp"],"address":["unstructuredAddress"],"name":["unstructured"],"activity":["id","title"]},"enableCaja":false}});
gadgets.Prefs.setMessages_({});gadgets.io.preloaded_ = {};
