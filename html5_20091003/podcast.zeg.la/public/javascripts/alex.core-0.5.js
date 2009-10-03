var alex = this["alex"] ||
{};

alex.global = this;

(function(){
    // this code is copied from dojo-release-1.1.1. thanks!
    
    if (!this["console"]) {
        this.console = {
            log: function(){
            } // no-op
        };
    }
    
    var cn = ["assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd", "info", "profile", "profileEnd", "time", "timeEnd", "trace", "warn", "log"];
    var i = 0, tn;
    while ((tn = cn[i++])) {
        if (!console[tn]) {
            (function(){
                var tcn = tn + "";
                console[tcn] = function(){
                    var a = Array.apply({}, arguments);
                    a.unshift(tcn + ":");
                    console.log(a.join(" "));
                }
            })();
        }
    }
})();

alex.namespace = function(nm){
    var pkgs = nm.split(".");
    var pkg = alex.global;
    for (var i = 0; i < pkgs.length; i++) {
        var pkgName = pkgs[i];
        if (!pkg[pkgName]) {
            pkg[pkgName] = {};
        }
        pkg = pkg[pkgName];
    }
    return pkg;
};
alex.hitch = function(fn, thisObj){
    return function(){
        fn.apply(thisObj, alex.toArray(arguments));
    };
};
alex.extend = function(dst, src){
    for (var i in src) 
        dst[i] = src[i];
    return dst;
};
alex.clone = function(obj){
    var cloned = {};
    alex.extend(cloned, obj);
    return cloned;
};
alex.cloneArray = function(array){
    var cloned = [];
    for (var i = 0, n = array.length; i < n; i++) {
        cloned.push(array[i]);
    }
    return cloned;
};
alex.toArray = function(obj){
    if (obj === null || obj === undefined) {
        return obj
    }
    if (obj instanceof Array) {
        return obj;
    }
    if (typeof obj == "object" && obj.hasOwnProperty("length")) {
        return alex.cloneArray(obj);
    }
    return [obj];
};
alex.isEmpty = function(obj){
    return obj === null || obj === undefined ||
    (typeof(obj) == "string" && obj.length == 0) ||
    (obj instanceof Array && obj.length == 0);
};
alex.isNotEmpty = function(obj){
    return !alex.isEmpty(obj);
};

alex.Class = function(definition){
    var superClasses = definition["superClasses"] || [];
    var clazz = function(){
        this.initialize.apply(this, arguments);
    };
    // inheritance
    for (var i = 0, n = superClasses.length; i < n; i++) {
        for (var p in superClasses[i]) {
            if (p != "initialize" && p != "prototype") 
                clazz[p] = superClasses[i][p];
        }
        alex.extend(clazz.prototype, superClasses[i].prototype);
    }
    alex.extend(clazz.prototype, definition);
    delete clazz.prototype.superClasses;
    clazz.prototype.getSuperClasses = function(){
        return superClasses;
    };
    // call constructor of parents before initialize
    clazz.prototype.initialize = function(){
        for (var i = 0; i < superClasses.length; i++) {
            var superClass = superClasses[i];
            if (superClass.prototype.initialize) 
                superClass.prototype.initialize.apply(this, arguments);
        }
        if (definition.initialize) {
            definition.initialize.apply(this, arguments);
        }
    };
    
    // generate accessors
    var properties = definition["properties"] ||
    {};
    for (var propertyName in properties) {
        var property = properties[propertyName];
        var privatePropertyName = "_" + propertyName;
        if (property.initialValue !== undefined) {
            if (property.isArray && !(property.initialValue instanceof Array)) {
                throw new Error("when property type is array, initial value must be array");
            }
            clazz.prototype[privatePropertyName] = property.initialValue;
        }
        else 
            if (property.isArray) {
                this[privatePropertyName] = [];
            }
        if (typeof(property.get) == "function") {
            clazz.prototype[alex.beans.getterName(propertyName, property.isBoolProperty)] = property.get;
        }
        else {
            clazz.prototype[alex.beans.getterName(propertyName, property.isBoolProperty)] = (function(_propertyName){
                return function(){
                    return this[_propertyName];
                };
            })(privatePropertyName);
        }
        if (!property.readonly) {
            if (typeof(property.set) == "function") {
                clazz.prototype[alex.beans.setterName(propertyName)] = property.set;
            }
            else {
                clazz.prototype[alex.beans.setterName(propertyName)] = (function(_propertyName){
                    return function(val){
                        this[_propertyName] = val;
                    };
                })(privatePropertyName);
            }
        }
        if (property.isArray) {
            clazz.prototype[alex.beans.getByIndexMethodName(propertyName)] = (function(_propertyName){
                return function(index){
                    return this[_propertyName][index];
                };
            })(privatePropertyName);
            
            if (!property.readonly) {
                clazz.prototype[alex.beans.setByIndexMethodName(propertyName)] = (function(_propertyName){
                    return function(val, index){
                        this[_propertyName][index] = val;
                    };
                })(privatePropertyName);
                clazz.prototype[alex.beans.addMethodName(propertyName)] = (function(_propertyName){
                    return function(){
                        var args = (arguments[0] instanceof Array ? arguments[0] : arguments);
                        for (var i = 0, n = args.length; i < n; i++) {
                            this[_propertyName].push(args[i]);
                        }
                    };
                })(privatePropertyName);
            }
        }
    }
    return clazz;
};
alex.beans = {};
alex.beans.setterName = function(propertyName){
    return "set" + alex.beans.upFirstLetter(propertyName);
};

alex.beans.getterName = function(propertyName, isBoolProperty){
    var prefix = isBoolProperty ? "is" : "get";
    return prefix + alex.beans.upFirstLetter(propertyName);
};
alex.beans.setByIndexMethodName = function(propertyName){
    return alex.beans.setterName(propertyName) + "At";
};
alex.beans.getByIndexMethodName = function(propertyName){
    return alex.beans.getterName(propertyName) + "At";
};
alex.beans.addMethodName = function(propertyName){
    return "add" + alex.beans.upFirstLetter(propertyName);
};

alex.beans.upFirstLetter = function(str){
    return str.charAt(0).toUpperCase() + str.substring(1);
};
alex.beans.addNestedPropertyChangeListener = function(obj, propertyName, fn, bind){
    var tokens = propertyName.split(".");
    for (var i = 0, tokenCount = tokens.length; i < tokenCount; i++) {
        if (i == tokenCount) {
            break;
        }
        alex.beans.addPropertyChangeListener(obj, tokens[i], fn, bind);
        obj = alex.beans.getProperty(obj, tokens[i]);
    }
};
alex.beans.addPropertyChangeListener = function(obj, propertyName, fn, bind){
    var getter = alex.beans.getGetter(obj, propertyName);
    var setter = alex.beans.getSetter(obj, propertyName);
    var wrappedSetter = setter;
    bind = bind || obj;
    if (!setter || !setter["_change_listeners"]) {
        wrappedSetter = function(newValue){
            var oldValue = getter.call(obj);
            setter.call(obj, newValue);
            for (var i = 0; i < wrappedSetter._change_listeners.length; i++) {
                wrappedSetter._change_listeners[i].apply(bind, [oldValue, newValue]);
            }
        };
        obj[alex.beans.setterName(propertyName)] = wrappedSetter;
        wrappedSetter._change_listeners = [];
    }
    wrappedSetter._change_listeners.push(fn);
};

alex.beans.setNestedProperty = function(obj, propertyName, value, force){
    var tokens = propertyName.split(".");
    for (var i = 0, tokenCount = tokens.length; i < tokenCount; i++) {
        if (i == tokenCount - 1) {
            alex.beans.setProperty(obj, tokens[i], value, force);
            return;
        }
        else {
            obj = alex.beans.getProperty(obj, tokens[i]);
        }
    }
};
alex.beans.getNestedProperty = function(obj, propertyName, force){
    var tokens = propertyName.split(".");
    for (var i = 0, tokenCount = tokens.length; i < tokenCount; i++) {
        if (i == tokenCount) {
            break;
        }
        obj = alex.beans.getProperty(obj, tokens[i], force);
    }
    return obj;
};

alex.beans.setProperty = function(obj, propertyName, value, force){
    var setter = alex.beans.getSetter(obj, propertyName);
    if (setter) {
        setter.call(obj, value);
    }
    else 
        if (!setter && force) {
            obj[propertyName] = value;
        }
};
alex.beans.setIndexedProperty = function(obj, propertyName, index, value){
    var setter = alex.beans.getSetter(obj, propertyName);
    if (!setter) {
        obj[propertyName][index] = value;
    }
    else {
        setter.call(obj, index, value);
    }
};
alex.beans.getProperty = function(obj, propertyName, force){
    var getter = alex.beans.getGetter(obj, propertyName);
    if (!getter) {
        return force ? obj[propertyName] : undefined;
    }
    return getter.call(obj);
};
alex.beans.getIndexedProperty = function(obj, propertyName, index){
    var getter = alex.beans.getGetter(obj, propertyName);
    if (!getter) {
        return obj[propertyName][index];
    }
    return getter.call(obj, index);
};
alex.beans.getSetter = function(obj, propertyName){
    return obj[alex.beans.setterName(propertyName)];
};
alex.beans.getGetter = function(obj, propertyName){
    var getter = obj[alex.beans.getterName(propertyName)];
    if (!getter) {
        getter = obj[alex.beans.getterName(propertyName, true)];
    }
    return getter;
};
alex.beans.populate = function(props, obj){
    for (var p in props) {
        var setter = alex.beans.getSetter(obj, p);
        if (setter) 
            setter.call(obj, props[p]);
    }
};
alex.beans.copyProperties = function(src, dest){
    for (var p in src) {
        // Getter
        if (p.indexOf("get") !== 0 && p.indexOf("is") !== 0) {
            continue;
        }
        if (typeof src[p] !== "function") {
            continue;
        }
        if (p.indexOf("get") === 0) {
            var prefixLen = 3;
        }
        // isXXX
        else {
            var prefixLen = 2;
        }
        var propertyName = p.substring(prefixLen);
        propertyName = propertyName.charAt(0).toLowerCase() + propertyName.substring(1);
        
        var propertyValue = alex.beans.getProperty(src, propertyName);
        alex.beans.setProperty(dest, propertyName, propertyValue);
    }
    return dest;
};

alex.namespace("alex.errors");

alex.errors.define = function(spec){
    var errors = {};
    for (var i in spec) {
        var errInfo = spec[i];
        errors[i] = alex.extend(new Error(), errInfo);
        errors[i].name = i;
        errors[i].description = errors[i].description || "[" + i + "]";
        errors[i].getInstance = function(optionsOrDescription){
            if (!optionsOrDescription) 
                throw this;
            var err = alex.extend(new Error(), this);
            if (typeof optionsOrDescription == "string") {
                err.description = optionsOrDescription;
            }
            else {
                alex.extend(err, optionsOrDescription);
            }
            return err;
        };
        errors[i].raise = function(optionsOrDescription){
            throw this.getInstance(optionsOrDescription);
        };
    }
    return errors;
};


// JSON2.js
if (!JSON) {
    var JSON = JSON ||
    {};
    (function(){
        function f(n){
            return n < 10 ? '0' + n : n;
        }
        if (typeof Date.prototype.toJSON !== 'function') {
            Date.prototype.toJSON = function(key){
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
            };
            String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key){
                return this.valueOf();
            };
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        }, rep;
        function quote(string){
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' +
            string.replace(escapable, function(a){
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"' : '"' + string + '"';
        }
        function str(key, holder){
            var i, k, v, length, mind = gap, partial, value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    else {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }
        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function(value, replacer, space){
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                }
                else 
                    if (typeof space === 'string') {
                        indent = space;
                    }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }
                return str('', {
                    '': value
                });
            };
        }
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function(text, reviver){
                var j;
                function walk(holder, key){
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                }
                                else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function(a){
                        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ? walk({
                        '': j
                    }, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            };
        }
    }());
}

alex.namespace("alex.logging");

alex.logging.Level = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4
};
alex.logging.Logger = new alex.Class({
    initialize: function(category, level) {
        this.category = category;
        this.level = level || alex.logging.Level.OFF;
    },
    debug: function() {
        if (this.level >= alex.logging.Level.DEBUG)
            this._log(alex.logging.Level.DEBUG, this._args2Array(arguments));
    },
    info: function() {
        if (this.level >= alex.logging.Level.INFO)
            this._log(alex.logging.Level.INFO, this._args2Array(arguments));
    },
    warn: function() {
        if (this.level >= alex.logging.Level.WARN)
            this._log(alex.logging.Level.WARN, this._args2Array(arguments));
    },
    error: function() {
        if (this.level >= alex.logging.Level.ERROR)
            this._log(alex.logging.Level.ERROR, this._args2Array(arguments));
    },
    debugException: function(error) {
        if (this.level >= alex.logging.Level.DEBUG)
            this._logException(alex.logging.Level.DEBUG, e);
    },
    infoException: function(error) {
        if (this.level >= alex.logging.Level.INFO)
            this._logException(alex.logging.Level.INFO, e);
    },
    warnException: function(error) {
        if (this.level >= alex.logging.Level.WARN)
            this._logException(alex.logging.Level.WARN, e);
    },
    errorException: function(error) {
        if (this.level >= alex.logging.Level.ERROR)
            this._logException(alex.logging.Level.ERROR, e);
    },
    _log: function(level, args) {
    },
    _logException: function(level, e) {
    },
    _args2Array: function(args) {
        var results = [];
        for (var i = 0, n = args.length; i < n; i++) {
            results.push(args[i]);
        }
        return results;
    }
});

alex.logging.ConsoleLogger = new alex.Class({
    superClasses: [alex.logging.Logger],
    initialize: function(category) {
        this.category = category;
    },
    _log: function(level, args) {
        var Level = alex.logging.Level;
        if (this.category) {
            console.group(this.category);
        }
        switch (level) {
        case Level.OFF:
            break;
        case Level.DEBUG:
            console.debug.apply(console, args);
            break;
        case Level.INFO:
            console.info.apply(console, args);
            break;
        case Level.WARN:
            console.warn.apply(console, args);
            break;
        case Level.ERROR:
            console.error.apply(console, args);
            break;
        }
        if (this.category) {
            console.groupEnd();
        }
    },
    _logException: function(level, e) {
        var args = [e.description, e];
        var Level = alex.logging.Level;
        if (this.category) {
            console.group(this.category);
        }
        switch (level) {
        case Level.OFF:
            break;
        case Level.DEBUG:
            console.debug.apply(console, args);
            break;
        case Level.INFO:
            console.info.apply(console, args);
            break;
        case Level.WARN:
            console.warn.apply(console, args);
            break;
        case Level.ERROR:
            console.error.apply(console, args);
            break;
        }
        if (this.category) {
            console.groupEnd();
        }
    }
});
