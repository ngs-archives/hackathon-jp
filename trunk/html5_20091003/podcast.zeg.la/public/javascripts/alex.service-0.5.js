var alex = this["alex"] ||
{};

alex.service = (function(_global){
    var repository = {};
    function enumProperties(obj){
        var result = [];
        for (var p in obj) {
            result.push(p + ":" + obj[p]);
        }
        return result;
    }
    function args2Array(args){
        var results = [];
        for (var i = 0, n = args.length; i < n; i++) {
            results.push(args[i]);
        }
        return results;
    }
    var requestIdSeq = 0;
    var requestTable = {        /*
         requestId1: {message: message, callback: callback},
         requestId2: callback
         */
    };
    function requestToWorker(messageType, data, callback, target){
        requestIdSeq++;
        var message = {};
        message.alex_service_messageType = messageType;
        message.requestId = requestIdSeq;
        for (var i in data) {
            message[i] = data[i];
        }
        requestTable[requestIdSeq] = {
            message: message,
            callback: callback
        };
        target.postMessage(JSON.stringify(message));
    }
    function methodProxyMaker(serviceName, methodName, target){
        return function(){
            var args = args2Array(arguments);
            var callback = null;
            if (args.length > 0) {
                var maybeCallback = args.pop();
                // register callback
                if (typeof maybeCallback == "function") {
                    callback = maybeCallback
                }
                else {
                    // push back
                    args.push(maybeCallback);
                }
            }
            requestToWorker("callRequest", {
                service: serviceName,
                method: methodName,
                args: args
            }, callback, target);
        };
    }
    function onInitializeResponse(message, requestInfo, worker){
        var services = message.services;
        if (!services) {
            return;
        }
        var proxies = {};
        for (var serviceName in services) {
            var serviceInterface = services[serviceName];
            var proxy = proxies[serviceName] = {};
            var methods = serviceInterface.methods;
            for (var i = 0; i < methods.length; i++) {
                var method = methods[i];
                proxy[method] = methodProxyMaker(serviceName, method, worker);
            }
        }
        var callback = requestInfo.callback;
        if (!callback) {
            return;
        }
        callback(proxies);
    };
    function onCallResponse(message, requestInfo, worker){
        var result = message.result;
        var error = message.error;
        var callback = requestInfo.callback;
        if (!callback) {
            return;
        }
        callback(result, error);
    };
    function makeMessageHandler(worker){
        return function(event){
            var message = JSON.parse(event.data);
            // verify message
            var type = message["alex_service_messageType"];
            if (!type) {
                throw new Error("missing message type. ignored:{" + enumProperties(message).join(",") + "}");
                return;
            }
            var requestId = message["requestId"];
            if (!requestId) {
                throw new Error("missing requestId. ignored:{" + enumProperties(message).join(",") + "}");
                return;
            }
            if (type.match("^.+Response$")) {
                var requestInfo = requestTable[requestId];
                if (!requestInfo) {
                    throw new Error("missing requestInfo. ignored:{" + enumProperties(message).join(",") + "}");
                    return;
                }
                delete requestTable[requestId];
            }
            switch (type) {
                case "initializeResponse":
                    onInitializeResponse(message, requestInfo, worker);
                    break;
                case "callResponse":
                    onCallResponse(message, requestInfo, worker);
                    break;
                case "initializeRequest":
                    onInitialize(message, worker);
                    break;
                case "callRequest":
                    onCall(message, worker);
                    break;
                case "error":
                    throw new Error(message);
                    break;
            }
        };
    }
    
    _global.onmessage = makeMessageHandler(_global);
    
    function responseToWorker(messageType, requestId, data, target){
        var message = {};
        message.alex_service_messageType = messageType;
        message.requestId = requestId;
        for (var i in data) {
            message[i] = data[i];
        }
        target.postMessage(JSON.stringify(message));
    }
    function getServiceInterfaces(includes){
        if (includes) {
            var includesMap = {}; // for performance
            for (var i = 0; i < includes.length; i++) {
                includesMap[includes[i]] = null;
            }
        }
        var services = {};
        for (var serviceName in repository) {
            if (includesMap && !(serviceName in includesMap)) {
                continue;
            }
            var serviceInterface = services[serviceName] = {
                methods: []
            };
            var service = repository[serviceName];
            for (var memberName in service) {
                var member = service[memberName];
                if (typeof member != "function") {
                    continue;
                }
                var methodName = memberName;
                if (methodName.charAt(0) == "_") {
                    continue;
                }
                if (methodName.match(/^async_(.+)/)) {
                    methodName = RegExp.$1;
                }
                serviceInterface.methods.push(methodName);
            }
        }
        return services;
    }
    function onInitialize(message, worker){
        var parentServices = message.services;
        alex.service.parent = {};
        for (var serviceName in parentServices) {
            var service = parentServices[serviceName];
            var proxy = alex.service.parent[serviceName] = {};
            for (var i = 0; i < service.methods.length; i++) {
                var methodName = service.methods[i];
                proxy[methodName] = methodProxyMaker(serviceName, methodName, _global);
            }
        }
        var services = getServiceInterfaces();
        responseToWorker("initializeResponse", message.requestId, {
            services: services
        }, worker);
    }
    function onCall(message, worker){
        var result, error;
        try {
            var serviceName = message.service;
            var methodName = message.method;
            var args = message.args;
            var service = repository[serviceName];
            if (!service) {
                throw new Error("service[" + serviceName + "] is not found");
            }
            var method = service[methodName];
            if (method) {
                result = method.apply(service, args);
            }
            else {
                method = service["async_" + methodName];
                // async method
                if (method) {
                    var callback = function(r, e){
                        responseToWorker("callResponse", message.requestId, {
                            result: r,
                            error: e
                        }, worker);
                    }
                    method.apply(service, [callback].concat(args));
                    return;
                }
            }
            
        } 
        catch (e) {
            error = e;
        }
        
        responseToWorker("callResponse", message.requestId, {
            result: result,
            error: error
        }, worker);
    };
    
    return {
        get: function(serviceName){
            return repository[serviceName];
        },
        serviceNames: function(){
            var results = [];
            for (var serviceName in repository) {
                results.push(serviceName);
            }
            return results;
        },
        load: function(url, callback, exportServiceNames){
            if (typeof url != "string") {
                throw new Error("url must be string:" + url);
            }
            if (typeof callback != "function") {
                throw new Error("callback must be function");
            }
            if (exportServiceNames && !(exportServiceNames instanceof Array)) {
                throw new Error("when specified, exportServiceNames must be Array");
            }
            var self = this;
            var worker = new Worker(url);
            worker.onmessage = makeMessageHandler(worker);
            if (!exportServiceNames) {
                exportServiceNames = [];
            }
            requestToWorker("initializeRequest", {
                services: getServiceInterfaces(exportServiceNames)
            }, callback, worker);
        },
        Service: function(serviceName, spec){
            if (typeof serviceName != "string") {
                throw new Error("serviceName must be  type of string");
            }
            if (!spec || typeof spec != "object") {
                throw new Error("invalid spec");
            }
            // duplicated service name
            if (repository[serviceName] != undefined) {
                throw new Error("service" + serviceName + "is already defined.");
            }
            for (var i in spec) {
                this[i] = spec[i];
            }
            repository[serviceName] = this;
        }
    }
})(this);
