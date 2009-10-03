alex.namespace("alex.aop");

/*
 * var obj = { test: function() { } };
 * 
 * var obj = alex.aop.proxy(obj, function(fn, obj) { }, /^set.*$/);
 */

alex.aop.PROXIED_INSTANCE_KEY = "alex.aop.PROXIED_INSTANCE_KEY";

alex.aop.isProxy = function(obj) {
    return !!obj[alex.aop.PROXIED_INSTANCE_KEY];
};
alex.aop.getProxiedInstance = function(proxy) {
    if (!alex.aop.isProxy(proxy)) {
        throw new Error(0, "not proxy");
    }
    return proxy[alex.aop.PROXIED_INSTANCE_KEY];
};
alex.aop.proxy = function(instance, advice, pointcut) {
    var proxy = alex.clone(instance);
    proxy[alex.aop.PROXIED_INSTANCE_KEY] = instance;
    if (!pointcut) {
        pointcut = alex.aop.allPointCut;
    } else if (typeof (pointcut) == "string") {
        pointcut = alex.aop.equalsPointCut(new RegExp(pointcut));
    } else if (pointcut instanceof RegExp) {
        pointcut = alex.aop.regexpPointCut(pointcut);
    }
    for ( var p in instance) {
        if (typeof (instance[p]) != "function") {
            continue;
        }
        var fn = instance[p];
        if (!pointcut(fn, instance, p)) {
            continue;
        }
        proxy[p] = ( function(func, obj, fnName) {
            return function() {
                var args = alex.toArray(arguments);
                return advice.apply(obj, [{
                    fn :func,
                    args : args,
                    obj :obj,
                    fnName :fnName,
                    proceed : function() {
                        return func.apply(obj, args);
                    }
                }]);
            };
        })(fn, instance, p);
    }
    return proxy;
};
alex.aop.equalsPointCut = function(fnName) {
    return function(fn, obj, funcName) {
        return fnName == funcName;
    };
};

alex.aop.regexpPointCut = function(regexp) {
    return function(fn, obj, funcName) {
        return regexp.match(funcName);
    };
};
alex.aop.allPointCut = function() {
    return true;
};
