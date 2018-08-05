"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UUID = require("uuid/v4");
require("ts-polyfill/lib/es2015-collection");
var async_hooks_1 = require("./async-hooks");
var ExpressLoggingUtilityMiddleware = function (req, res, next) {
    var loggingId = UUID();
    async_hooks_1.default(loggingId, {
        loggingId: loggingId,
    });
    next();
};
exports.set = function (key, value) {
    return async_hooks_1.setSharedVariable(key, value);
};
exports.get = function (key) {
    return async_hooks_1.getSharedVariable(key);
};
exports.default = ExpressLoggingUtilityMiddleware;
//# sourceMappingURL=index.js.map