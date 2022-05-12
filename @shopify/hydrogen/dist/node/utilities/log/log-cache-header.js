"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCacheControlHeaders = exports.collectQueryCacheControlHeaders = void 0;
const hash_1 = require("../hash");
const utils_1 = require("./utils");
const kolorist_1 = require("kolorist");
const log_1 = require("./log");
const color = kolorist_1.gray;
function collectQueryCacheControlHeaders(request, queryKey, cacheControlHeader) {
    request.ctx.queryCacheControl.push({
        name: (0, utils_1.findQueryName)((0, hash_1.hashKey)(queryKey)),
        header: cacheControlHeader,
    });
}
exports.collectQueryCacheControlHeaders = collectQueryCacheControlHeaders;
function logCacheControlHeaders(type, request, response) {
    const log = (0, log_1.getLoggerWithContext)(request);
    if (!log.options().showCacheControlHeader) {
        return;
    }
    log.debug(color(`┌── Cache control header for ${(0, utils_1.parseUrl)(type, request.url)}`));
    if (response) {
        log.debug(color(`│ ${response.cacheControlHeader}`));
    }
    const queryList = request.ctx.queryCacheControl;
    const longestQueryNameLength = queryList.reduce((max, query) => Math.max(max, query.name.length), 0);
    if (queryList.length > 0) {
        log.debug(color('│'));
        queryList.forEach((query) => {
            log.debug(color(`│ query ${query.name.padEnd(longestQueryNameLength + 1)}${query.header}`));
        });
    }
    log.debug(color('└──'));
}
exports.logCacheControlHeaders = logCacheControlHeaders;
