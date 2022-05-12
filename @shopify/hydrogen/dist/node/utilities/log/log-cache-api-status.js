"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCacheApiStatus = void 0;
const utils_1 = require("./utils");
const kolorist_1 = require("kolorist");
const _1 = require(".");
function logCacheApiStatus(status, url) {
    if (!_1.log.options().showCacheApiStatus) {
        return;
    }
    _1.log.debug((0, kolorist_1.gray)(`[Cache] ${status === null || status === void 0 ? void 0 : status.padEnd(8)} query ${(0, utils_1.findQueryName)(url)}`));
}
exports.logCacheApiStatus = logCacheApiStatus;
