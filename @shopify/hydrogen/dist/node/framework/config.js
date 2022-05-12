"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.setConfig = void 0;
function setConfig(config) {
    globalThis.__config = config;
}
exports.setConfig = setConfig;
function getConfig() {
    return globalThis.__config || {};
}
exports.getConfig = getConfig;
