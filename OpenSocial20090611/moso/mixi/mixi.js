/*@cc_on _d=document;eval('var document=_d')@*/

function MM_preloadImages() {
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function get_mode() {
    var mode;
    if (window.opera){
        mode = 4;
    }
    else if (navigator.appName == 'Microsoft Internet Explorer') {
        if (navigator.platform == 'MacPPC') {
            mode = 4;
        }
        else {
            mode = 2;
        }
    }
    else if (navigator.userAgent.indexOf('Safari') != -1) {
            mode = 4;
    }
    else if (navigator.appName == 'Netscape') {
        if (navigator.platform == 'MacPPC') {
            mode = 4;
        }
        else {
            mode = 1;
        }
    }
    else if (navigator.userAgent.indexOf('Firefox') != -1) {
        mode = 1;
    }
    else if (navigator.userAgent.indexOf('Netscape') != -1) {
        mode = 1;
    }
    else if (navigator.userAgent.indexOf('Gecko') != -1) {
        mode = 1;
    }
    else {
        mode = 4;
    }
    return mode;
}

function make_tag(str, stag, etag) {
    var mode = get_mode();
    if (mode == 1 || mode == 4) {
        var bl1 = str.value.substring(0, str.selectionStart);
        var bl2 = str.value.substring(str.selectionStart, str.selectionEnd);
        var bl3 = str.value.substring(str.selectionEnd, str.value.length);
        str.value = bl1 + stag + bl2 + etag + bl3;
    }
    else if (mode == 2) {
        str.focus();
        var sel = document.selection.createRange();
        var rang = str.createTextRange();
        rang.moveToPoint(sel.offsetLeft,sel.offsetTop);
        rang.moveEnd("textedit");
        if(rang.text.replace(/\r/g,"").length != 0){
            var las = (str.value.match(/(\r\n)*$/),RegExp.lastMatch.length);
            str.selectionStart = str.value.length - (rang.text.length + las);
            str.selectionEnd = str.selectionStart + sel.text.length;
            str.selectionStart2 = str.value.replace(/\r/g,"").length - (rang.text.replace(/\r/g,"").length + las/2);
            var bl1 = str.value.substring(0, str.selectionStart);
            var bl2 = str.value.substring(str.selectionStart, str.selectionEnd);
            var bl3 = str.value.substring(str.selectionEnd, str.value.length);
            str.value = bl1 + stag + bl2 + etag + bl3;
            str.selectionEnd2 = (str.selectionStart2 + stag.length + bl2.length + etag.length) - str.value.replace(/\r/g,"").length;
            rang.moveStart("character",str.selectionStart2);
            rang.moveEnd("character",str.selectionEnd2);
        }else{
            rang.moveToPoint(sel.offsetLeft,sel.offsetTop);
            rang.text = stag + etag;
            rang.moveStart("character",-(stag.length + etag.length));
        }
        rang.select();
    }
    else if (mode == 3) {
        str.value = stag + str.value + etag;
    }
    else {
        str.value += stag + etag;
    }
    return;
}

function add_link(str) {
    var url = prompt('リンク先URLを記入してください。テキストをドラッグして選択すると、自動的にそのテキストに対してリンクされます。', 'http://');
    if (!url) {
        return;
    }
    else {
        var stag = '<a HREF="' + url + '" target="_blank">';
        var etag = '</a>';
        make_tag(str, stag, etag);
    }
}

function add_tag(str, tag) {
    var stag = '<'  + tag + '>';
    var etag = '</' + tag + '>';
    make_tag(str, stag, etag);
}

function resize_font(str, size) {
    var stag = '<span class="' + size + '">';
    var etag = '</span>';
    make_tag(str, stag, etag);
}

function change_font_color(str, color) {
    var stag = '<span style="color:' + color + '">';
    var etag = '</span>';
    make_tag(str, stag, etag);
}

function swImg(iName,str) {
        document.images[iName].src = str;
}

function swFormImg(name, url) {
    document.getElementById(name).src = url;
}

function is_macie() {
    return (navigator.appName == 'Microsoft Internet Explorer' && navigator.platform == 'MacPPC') ? 1 : 0 ;
}

function setEvent(element, name, func, capture) {
    if (element.addEventListener) { element.addEventListener(name, func, capture);
    } else if (element.attachEvent) { element.attachEvent('on' + name, func); }
}

function addScript(url,charset){
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  script.setAttribute('charset', charset);
  document.getElementsByTagName('head').item(0).appendChild(script);
}

function addNews(html){
  document.getElementById('member_news_box').innerHTML = html;
}

function setSubmitTrue(element) { window.setTimeout(function() { element.disabled = true; }, 1) }

function setSubmitFalse(element) { window.setTimeout(function() { element.disabled = false; }, 5000) }

function setDisable(elements) {
    var buttons = [];

    for (var i=0; i< elements.length; i++) {
        var element = elements[i];
        if (element.type == 'submit') {
            setSubmitTrue(element);
            setSubmitFalse(element);

            buttons.push(element);
        }
    }

    Event.observe(window, 'unload', function () {
        buttons.each(function (element) {
            element.disabled = false;
        });
    });
}

function disableSubmit(elements) {
    for (var i=0; i<document.forms.length; ++i) {
        if (document.forms[i].onsubmit) continue;
        document.forms[i].onsubmit = function() {
            setDisable(this.elements);
        }
    }
}

function fixThumbnailSize (obj, size) {
    obj.removeAttribute('width');
    obj.removeAttribute('height');
     var ox = obj.width;
     var oy = obj.height;
     var raito = ( ox > oy ) ? ox / size : oy / size;
     if (raito < 1) raito = 1;
     var x = Math.floor( ox / raito );
     var y = Math.floor( oy / raito );
     obj.width  = x;
     obj.height = y;
}



if (typeof(Mixi) == 'undefined') {
  var Mixi = new Object();
}

// js/mixi/util.js
Mixi.Util = {
  disableEvent: function(event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault)  event.preventDefault();
    event.cancelBubble = true;
    event.returnValue  = false;
  }
};

// js/mixi/form.js
Mixi.Form = {
  focusedClassName: 'focus',
  bluredClassName:  'blur',
  initialize: function() {
    this.setupColorAction('input');
    this.setupColorAction('textarea');
    this.setupColorAction('select');
  },
  setupColorAction: function (tagName) {
    var elements = document.getElementsByTagName(tagName);
    $A(elements).each(function(element){
      Event.observe(element, 'blur',  Mixi.Form.createBlurCallback(element));
      Event.observe(element, 'focus', Mixi.Form.createFocusCallback(element));
    });
  },
  createBlurCallback: function(element) {
    return function() {
      Element.removeClassName(element, Mixi.Form.focusedClassName);
    };
  },
  createFocusCallback: function(element) {
    return function() {
      Element.addClassName(element, Mixi.Form.focusedClassName);
    };
  }
}
Event.observe(window, 'load', Mixi.Form.initialize.bind(Mixi.Form));

// js/mixi/searchbox.js
Mixi.SearchBox = Class.create();
Object.extend(Mixi.SearchBox.prototype, {
    initialize: function(listId, defaultPageName) {
        var tabs = $(listId).getElementsByTagName('li');
        this.anchors = $A(tabs).collect( function(tab) {
          return tab.getElementsByTagName('a')[0];
        } );
        if (typeof(this.currentName) == 'undefined') {
            this.currentName = defaultPageName;
        }
        this.anchors.each(this.setupAnchorEvent.bind(this));
    },
    setupAnchorEvent: function(anchor) {
        var self = this;
        var tmp = '';
        Event.observe(anchor, 'click', function(event) {
            Mixi.Util.disableEvent(event);
            self.anchors.each(function(element){
                var href = element.getAttribute('href');
                var pageName = href.substr(href.indexOf('#') + 1);
                if (self.currentName == pageName) {
                    var SearchMT      = self.getInputBox(pageName, 'MT');
                    var SearchKeyword = self.getInputBox(pageName, 'keyword');
                    if (typeof(SearchMT) != 'undefined') {
                        tmp = SearchMT.value;
                    } else if (typeof(SearchKeyword) != 'undefined') {
                        tmp = SearchKeyword.value;
                    }
                }
            }),
            self.anchors.each(function(element){
                var href = element.getAttribute('href');
                var pageName = href.substr(href.indexOf('#') + 1);
                var SearchMT      = self.getInputBox(pageName, 'MT');
                var SearchKeyword = self.getInputBox(pageName, 'keyword');
                if(typeof(SearchMT) != 'undefined') {
                    SearchMT.value = tmp;
                } else if (typeof(SearchKeyword) != 'undefined') {
                    SearchKeyword.value = tmp;
                }
                if (element == anchor) {
                    Element.addClassName(element, 'selected');
                    Element.show(pageName);
                    self.currentName = pageName;
                } else {
                    Element.removeClassName(element, 'selected');
                    Element.hide(pageName);
                }
            });
        });
    },
    getInputBox: function(pageName, inputName) {
        var self = this;
        var inputBoxes = $(pageName).getElementsByTagName('input');
        var count = 0;
        while (count < inputBoxes.length) {
            if (inputBoxes[count].name == inputName) {
                var inputBox = $(pageName).getElementsByTagName('input')[count];
            }
            count++;
        }
        return inputBox;
    }
});
Mixi.SearchBBSBox = Class.create();
Object.extend(Mixi.SearchBBSBox.prototype, {
    initialize: function(formId, listId) {
        this.formElement = $(formId);
        var tabs = $(listId).getElementsByTagName('li');
        this.anchors = $A(tabs).collect( function(tab) {
            return tab.getElementsByTagName('a')[0];
        } );
        this.anchors.each(this.setupAnchorEvent.bind(this));
    },
    setupAnchorEvent: function(anchor) {
        var self = this;
        Event.observe(anchor, 'click', function(event) {
            Mixi.Util.disableEvent(event);
            self.anchors.each(function(element){
                var href = element.getAttribute('href');
                var bbsNumber = href.substr(href.indexOf('#') + 1);
                if (element == anchor) {
                    Element.addClassName(element, 'selected');
                    self.formElement.bbs.value = bbsNumber;
                } else {
                    Element.removeClassName(element, 'selected');
                }
            }); 
        });
    }
});

// js/mixi/navigation.js
/*
 * Mixi.Navigation
 *
 * Dependencies:
 *
 *   Prototype.js ver 1.4 or above.
 *
 * Usage:
 *
 *   <script type="text/javascript" src="/static/js/prototype.js"></script>
 *   <script type="text/javascript" src="/static/js/mixi/navigation.js"></script>
 *   <script type="text/javascript">
 *   <![CDATA[
 *     Mixi.Navigation.setupSubMenus('diary', 'photo', 'video', 'review');
 *   ]]>
 *   </script>
 */
Mixi.Navigation = {
  menus: new Array(),
  setupSubMenus: function() {
    this.menus = $A(arguments);
    var subMenus = this.menus.map(function(name){ return name + 'SubMenu'; });
    subMenus.each(function(element){ Element.hide(element); });
    Event.observe(document, 'click', function(event) {
      var caller = Event.element(event);
      if (caller.nodeName.toLowerCase() == "a") return;
      if (subMenus.any(function(element){ return Element.visible(element); })) {
        subMenus.each(function(element){ 
          element = $(element);
          Element.hide(element);
        });
        Mixi.Util.disableEvent(event);
      }
    });

    this.menus.each(function(name){
      this.setupNavigationSubMenu(name);
    }.bind(this));
  },
  setupNavigationSubMenu: function(targetName) {
    var triggerElementName = targetName + 'PullDownButton';
    Event.observe(triggerElementName, 'click', function(event) {
      Mixi.Util.disableEvent(event);
      this.menus.reject(function(name){
        return name == targetName;
      }).each(function(name){
        Element.hide(name + 'SubMenu');
      });

      var targetElement = $(targetName + 'SubMenu');
      Element.toggle(targetElement);
    }.bind(this));
  }
};

Mixi.Home = {};

Mixi.Home.GadgetObject = Class.create();
Mixi.Home.GadgetObject.cache = {};
Mixi.Home.GadgetObject.findOrCreate = function (element) {
    var result = Mixi.Home.GadgetObject.cache[element.id];
    if (! result) {
        result = new Mixi.Home.GadgetObject(element);
        Mixi.Home.GadgetObject.cache[element.id] = result;
    }
    return result;
};
Object.extend(Mixi.Home.GadgetObject.prototype, {
    initialize: function (element) {
        this.element = element;

        var body = element.getElementsByClassName('contentsBody01')[0];
        if (! body) {
            body = element.getElementsByClassName('contents')[0];
        }
        this.body = body;

        var header = element.getElementsByClassName('heading15')[0];
        if (! header) {
            header = element.getElementsByClassName('heading01')[0];
        }
        this.header = header;

        this.closeButton = header.getElementsByClassName('close')[0];
        this.openButton = header.getElementsByClassName('open')[0];
    },

    isOpened: function () {
        return Element.visible(this.body);
    },

    close: function () {
        if (this.body) {
            new Effect.BlindUp(this.body, {
                duration: 0.3, queue:'end'
            });
        }
        this.openButton.show();
        this.closeButton.hide();
    },

    open: function () {
        if (this.body) {
            new Effect.BlindDown(this.body, {
                duration: 0.3, queue:'end'
            });
        }
        this.closeButton.show();
        this.openButton.hide();

        this.adjustContents();
    },

    adjustContents: function () {
        ;
    }
});

Mixi.HomeGadget = Class.create();
Object.extend(Mixi.HomeGadget.prototype, {
    initialize: function() {
        Mixi.Gadget.animetion = false;
        Mixi.Gadget.links = [];
        Mixi.Gadget.order_num = [];
        Mixi.Gadget.container = [null, $('mymixiUpdate'), $('bodySub')];
        Mixi.Gadget.gadgets = [null,null,null];
        Mixi.Gadget.column_num = [];
        
        Mixi.Gadget.Anime = new Mixi.GadgetAnime;
        Mixi.Gadget.Anime.build_list();
        
        Mixi.Gadget.links.each(function(anchor) {
            Event.observe(anchor, 'click',this.buttonEvent.bind(this));
        }.bind(this));

        Mixi.ApplicationWrapper.createAll();
    },
    buttonEvent : function (event){

        Mixi.Util.disableEvent(event);
        if (Mixi.Gadget.animetion){
            return false;
        }
        Mixi.Gadget.animetion = true;
        var caller  = Event.element(event);
        var href    = caller.parentNode.getAttribute('href');
        var param_index   = href.indexOf('?');
        var param   = href.substr(param_index + 1);
        var url     = href.substr(0, param_index);
        var gadget_param = [];
        param.split(/&/).each(function (param) {
            var keyvalue = param.split(/=/);
            gadget_param[keyvalue[0]] = keyvalue[1];
        });
        var action  = gadget_param['action'];
        var name    = gadget_param['name'];
        var value   = gadget_param['value'];
        value = parseInt(value);
        var order = Mixi.Gadget.order_num[name];
        var column = Mixi.Gadget.column_num[name];
        var myAjax  = new Ajax.Request(
            url, {
                method: 'get',
                parameters: param, 
                onComplete: function () {}
            }
        );

        Mixi.ApplicationWrapper.closeMenus();

        var offset;
        switch(action){
        case "up": 
            offset = order-value;
            Mixi.Gadget.Anime.move(order, offset);
        break;
        case "down": 
            offset = order+value;
            Mixi.Gadget.Anime.move(order, offset);
        break;
        case "close": 
            Mixi.Gadget.Anime.close(column, order);
        break;
        case "open": 
            Mixi.Gadget.Anime.open(column, order);
        break;
        case "delete": 
            Mixi.Gadget.animetion = false;
        break;
        }
    }
});

Mixi.Gadget = Class.create();
Object.extend(Mixi.Gadget.prototype, {
    order: [],
    order_num: [],
    column_num: [],
    Anime: false,
    links: [],
    gadgets: [],
    container: [],
    animetion: false
});

Mixi.GadgetAnime = Class.create();
Object.extend(Mixi.GadgetAnime.prototype, {
    initialize: function() {
    },
    build_list : function (){
        for (j=0;j<Mixi.Gadget.container.length;j++) {
            if (!Mixi.Gadget.container[j]) continue;
            Mixi.Gadget.gadgets[j] = [];
            var order_num = 0;
            $A(Mixi.Gadget.container[j].getElementsByClassName("utility02")).each(function (node) {
                var buttons = $A(node.getElementsByTagName('a'));
                //set gadget number
                if (buttons[1].getAttribute('href').match(/name=([^&]*)&/)) { 
                    Mixi.Gadget.order_num[RegExp.$1] = order_num;
                    Mixi.Gadget.column_num[RegExp.$1] = j;
                    Mixi.Gadget.gadgets[j].push(node.parentNode.parentNode);
                    order_num++;
                }
                buttons.each(function (button) {
                    if (button.getAttribute('href').match(/ajax_edit_home_setting\.pl/)) {
                        Mixi.Gadget.links = Mixi.Gadget.links.concat(button);
                    }
                });
            });
        }
        Mixi.Gadget.animetion = false;
    },
    move : function (from, to) {
        if( to >= 0 && to < Mixi.Gadget.gadgets[1].length ){
            new Effect.Parallel([
                new Effect.BlindUp(Mixi.Gadget.gadgets[1][to], { sync: true})
            ], {
             duration: 0.3, queue: 'end', 
             afterFinish: this.change.bind(this, from, to)
            });
            new Effect.Parallel([
                new Effect.BlindDown(Mixi.Gadget.gadgets[1][to], { sync: true})
            ], {
                duration: 0.3,  queue: 'end', 
                afterFinish: this.build_list
            });
        }
        else {
            Mixi.Gadget.animetion = false;
        }
    },
    getOneGadget: function (column, order) {
        var element = $(Mixi.Gadget.gadgets[column][order]);
        return new Mixi.Home.GadgetObject.findOrCreate(element);
    },
    close : function (column, order) {
        var gadget = this.getOneGadget(column, order);
        gadget.close();
        Mixi.Gadget.animetion = false;
    },
    open : function (column, order) {
        var gadget = this.getOneGadget(column, order);
        gadget.open();
        Mixi.Gadget.animetion = false;
    },
    change : function (from, to) {
        var from_node = Mixi.Gadget.gadgets[1][from];
        var to_node = Mixi.Gadget.gadgets[1][to];
        if( from < to){
            this.insertAfter(from_node, to_node);
        }else{
            $('mymixiUpdate').insertBefore(from_node, to_node);
        }
    },
    insertAfter : function (from_node,to_node) {
        var parent=to_node.parentNode;
        var lastChild = Mixi.Gadget.gadgets[1][Mixi.Gadget.gadgets[1].length-1];
        if (to_node == lastChild){
            return parent.appendChild(from_node);
        }
        else{
            return parent.insertBefore(from_node,to_node.nextSibling);
        }
    }
});

Mixi.ApplicationWrapper = Class.create();
Object.extend(Mixi.ApplicationWrapper, {
    Z_INDEX: 50,
    createAll: function () {
        this.instances = [];

        var container = $('mixiAppliArea');
        if (! container)
            return;

        var wrappers = container.select('div').findAll(
            function(n) {
                return n.hasClassName('application');
            }
        ).collect(
            function (div) {
                var m = div.id.match(/^appli(\d+)$/);
                return m ? new Mixi.ApplicationWrapper(m[1]) : null;
            }
        );

        if (wrappers.length == 0) {
            return;
        }

        // Mixi.Navigation
        var obj = {
            menus: wrappers.collect(function (wrapper) { return wrapper.menu }),

            setupNavigationSubMenu: function (name) {
                Mixi.Navigation.setupNavigationSubMenu.apply(this, [name]);
            }
        };

        Mixi.Navigation.setupSubMenus.apply(obj, wrappers.collect(
            function (wrapper) {
                return 'application' + wrapper.id;
            }
        ));
        this.instances = wrappers;
    },

    closeMenus: function () {
        this.instances.each(function (wrapper) {
                                wrapper.closeMenu();
                            });
    }
});
Mixi.ApplicationWrapper.prototype = {
    initialize: function (id) {
        this.id = id;
        this.menu = $('application' + id + 'SubMenu');
        this.menu.style.zIndex = Mixi.ApplicationWrapper.Z_INDEX;
        this.button = $('application' + this.id + 'PullDownButton');
        var self = this;
        Event.observe(this.button, 'click', function(event) { self.move(); });
        $A(this.menu.getElementsByTagName('a')).each(
            function (a) {
                a.onclick = self.anchorClicked.bindAsEventListener(self);
            }
        );
    },

    anchorClicked: function (event) {
        Mixi.Util.disableEvent(event);

        var anchor = Event.element(event);

        var self = this;
        var req = new Ajax.Request(anchor.href, {
                                       method: 'get',
                                       onComplete: function (resp) {
                                           var obj = eval('(' + resp.responseText + ')');
                                           var img = $('application' + self.id + 'PublicityLevel').innerHTML = obj.image;
                                           self.menu.hide();
                                       }
                                   });
        return false;
    },

    move: function () {
        var element = $('appli'+this.id);
        var gadget  = Mixi.Home.GadgetObject.findOrCreate(element);
        var utility = gadget.body.select('div.utility').first();
        var origin  = utility.cumulativeOffset();
        var size    = utility.getDimensions();

        this.menu.style.left = (origin[0] + size.width -
                                this.menu.getDimensions().width + 'px');
        this.menu.style.top = origin[1] + size.height + 'px';
    },

    closeMenu: function() {
        this.menu.hide();
    }
};

Mixi.Home.NewUpdatesAdjuster = Class.create();
Mixi.Home.NewUpdatesAdjuster.MAX = 42;
Object.extend(Mixi.Home.NewUpdatesAdjuster.prototype, {
    initialize: function (element) {
        if (! element) {
            return;
        }
        this.gadget = Mixi.Home.GadgetObject.findOrCreate(element);

        var instance = this;
        if (Prototype.Browser.IE && ! this.gadget.isOpened()) {
            this.removeSize();
            this.gadget.adjustContents = function () {
                instance.adjust();
                instance.gadget.adjustContents = Prototype.emptyFunction;
            };
        } else {
            this.adjust();
        }
    },

    getItems: function () {
        if (! this.gadget) {
            return [];
        }
        return $A(this.gadget.body.getElementsByTagName('li'));
    },

    removeSize: function () {
        this.getItems().each(function (item) {
            var image = item.getElementsByTagName('img')[0];
            image.removeAttribute('width');
            image.removeAttribute('height');
        });
    },

    adjust: function () {
        var instance = this;
        this.getItems().each(function (item) {
            var image = item.getElementsByTagName('img')[0];

            image.onload = function () {
                image.removeAttribute('width');
                image.removeAttribute('height');

                if (this.width != 1) {
                    instance.resize(image, Mixi.Home.NewUpdatesAdjuster.MAX);
                } else {
                    // Amazon で画像がない
                    instance.setNoImage(image, item.className);
                }
            };

            image.onerror = function () {
                // HTTP 的なエラー (タイムアウトとか)
                instance.setNoImage(image, item.className);
            };

            image.src = image.src;
        }.bind(this));
    },

    resize: function (image, size) {
        if (image.width > image.height) {
            image.width = Mixi.Home.NewUpdatesAdjuster.MAX;
        } else {
            image.height = Mixi.Home.NewUpdatesAdjuster.MAX;
        }
    },

    setNoImage: function (image, key) {
        image.onload = Prototype.emptyFunction;
        image.width = Mixi.Home.NewUpdatesAdjuster.MAX;
        image.removeAttribute('height');
        image.src = this.noImageOf(key);
    },

    noImageOf: function (key) {
        var path = 'http://img.mixi.jp/img/basic/common/';
        return path + {
            music: 'noimage_music75.gif',
            photo: 'noimage_photo76.gif',
            video: 'noimage_video76.gif',
            review: 'noimage_review76.gif'
        }[key];
    }
});

Mixi.User = Class.create();
Object.extend(Mixi.User, {
    getViewer: function (){
        return this.viewer;
    },
    getOwner: function (){
        return this.owner;
    },
    setViewer: function (viewer){
        this.viewer = new Mixi.User(viewer);
    },
    setOwner: function (owner){
        this.owner = new Mixi.User(owner);
    }
});
Object.extend(Mixi.User.prototype, {
    initialize: function (params){
        if (!params) return;
        for( key in params) {
            this[key] = params[key];
        }
    },
    getId: function (){
        return this.id;
    },
    setId: function (id){
        this.id = id;
    }
});


Mixi.Header = {};
Mixi.Header.Search = Class.create();
Mixi.Header.Search.IN_MIXI = 'mixi全体から探す';
Mixi.Header.Search.IN_WEB  = 'web全体から探す';
Object.extend(Mixi.Header.Search.prototype, {
    initialize: function (select, input) {
        input.style.color = '#999';
        input.value = Mixi.Header.Search.IN_MIXI;

        input.onfocus = function () {
            if (input.value == this.placeholder()) {
                input.style.color = "#000";
                input.value = "";
            }
        }.bind(this);

        input.onblur = function () {
            if (input.value == "") {
                input.style.color = "#999";
                input.value = this.placeholder();
            }
        }.bind(this);

        select.onchange = function () {
            if ($F(select) == 'web') {
                if (input.value == Mixi.Header.Search.IN_MIXI) {
                    input.value = Mixi.Header.Search.IN_WEB;
                }
            } else {
                if (input.value == Mixi.Header.Search.IN_WEB) {
                    input.value = Mixi.Header.Search.IN_MIXI;
                }
            }
        };

        this.select = select;

        var form = this.select.parentNode;
        form.onsubmit = function () {
            if (input.value == this.placeholder()) {
                input.value = '';
            }
            return true;
        }.bind(this);
    },

    placeholder: function () {
        if ($F(this.select) == 'web') {
            return Mixi.Header.Search.IN_WEB;
        } else {
            return Mixi.Header.Search.IN_MIXI;
        }
    }
});

/*
 * Mixi.Style
 *
 * Dependencies:
 *
 * Usage:
 *
 */

if ( Mixi.Style == undefined ) Mixi.Style = {};
Mixi.Style.writeMacHack = function() {
    if ( navigator.platform.toUpperCase().indexOf('MAC') == -1 ) return;

    var heads   = document.getElementsByTagName('head');
    var csspath = '/static/css/basic/macfix.css';

    if ( /^https/.test(location.protocol) ) {
        csspath = csspath.replace(/static\/css/,'static/ssl/css');
    }
    if ( heads && heads[0] ) {
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = csspath;
        link.type = 'text/css';
        heads[0].appendChild(link);
    }
    else {
        document.write('<link rel="stylesheet" href="'+csspath+'" type="text/css" />');
    }
};

setEvent(window,'load', disableSubmit, 0);
