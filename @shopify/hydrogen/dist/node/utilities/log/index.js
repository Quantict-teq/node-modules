"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logQueryTimings = exports.collectQueryTimings = exports.logCacheApiStatus = exports.logCacheControlHeaders = exports.collectQueryCacheControlHeaders = exports.resetLogger = exports.logServerResponse = exports.getLoggerWithContext = exports.setLoggerOptions = exports.setLogger = exports.log = void 0;
var log_1 = require("./log");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return log_1.log; } });
Object.defineProperty(exports, "setLogger", { enumerable: true, get: function () { return log_1.setLogger; } });
Object.defineProperty(exports, "setLoggerOptions", { enumerable: true, get: function () { return log_1.setLoggerOptions; } });
Object.defineProperty(exports, "getLoggerWithContext", { enumerable: true, get: function () { return log_1.getLoggerWithContext; } });
Object.defineProperty(exports, "logServerResponse", { enumerable: true, get: function () { return log_1.logServerResponse; } });
Object.defineProperty(exports, "resetLogger", { enumerable: true, get: function () { return log_1.resetLogger; } });
var log_cache_header_1 = require("./log-cache-header");
Object.defineProperty(exports, "collectQueryCacheControlHeaders", { enumerable: true, get: function () { return log_cache_header_1.collectQueryCacheControlHeaders; } });
Object.defineProperty(exports, "logCacheControlHeaders", { enumerable: true, get: function () { return log_cache_header_1.logCacheControlHeaders; } });
var log_cache_api_status_1 = require("./log-cache-api-status");
Object.defineProperty(exports, "logCacheApiStatus", { enumerable: true, get: function () { return log_cache_api_status_1.logCacheApiStatus; } });
var log_query_timeline_1 = require("./log-query-timeline");
Object.defineProperty(exports, "collectQueryTimings", { enumerable: true, get: function () { return log_query_timeline_1.collectQueryTimings; } });
Object.defineProperty(exports, "logQueryTimings", { enumerable: true, get: function () { return log_query_timeline_1.logQueryTimings; } });