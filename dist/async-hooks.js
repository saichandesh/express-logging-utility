"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var async_hooks_1 = require("async_hooks");
var contexts = new Map();
var activeContextRef = null;
var initHandler = function (asyncId, type, triggerId, resource) {
    var contextId = async_hooks_1.executionAsyncId();
    if (activeContextRef) {
        contexts.set(asyncId, activeContextRef);
    }
    else if (contextId === 0) {
        contexts.set(asyncId, contexts.get(async_hooks_1.triggerAsyncId()));
    }
};
var beforeHandler = function (asyncId) {
    activeContextRef = contexts.get(asyncId);
};
var afterHandler = function (asyncId) {
    activeContextRef = contexts.get(asyncId);
};
var destroyHandler = function (asyncId) {
    contexts.delete(asyncId);
};
var enableAsyncHook = function () {
    var asyncHook = async_hooks_1.createHook({
        init: initHandler,
        before: beforeHandler,
        after: afterHandler,
        destroy: destroyHandler,
    });
    asyncHook.enable();
};
exports.setSharedVariable = function (key, value) {
    var _a;
    if (activeContextRef) {
        activeContextRef.sharedVariables = __assign({}, activeContextRef.sharedVariables, (_a = {}, _a[key] = value, _a));
        contexts.set(activeContextRef.id, activeContextRef);
    }
};
exports.getSharedVariable = function (key) {
    if (activeContextRef) {
        return activeContextRef.sharedVariables[key];
    }
    return;
};
var Context = (function () {
    function Context(uuid, sharedVariable) {
        this.id = null;
        this.sharedVariables = null;
        this.id = uuid;
        this.sharedVariables = sharedVariable;
    }
    return Context;
}());
var AsyncHook = function (uuid, loggingId) {
    var context = new Context(uuid, loggingId);
    if (!activeContextRef) {
        enableAsyncHook();
    }
    contexts.set(uuid, context);
    activeContextRef = context;
};
exports.default = AsyncHook;
//# sourceMappingURL=async-hooks.js.map