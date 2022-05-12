"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDelayedFunction = exports.getCache = exports.setCache = exports.getContext = exports.setContext = void 0;
/**
 * Set a global runtime context for the current request.
 * This is used to encapsulate things like:
 * - `waitUntil()` to run promises after request has ended
 */
function setContext(ctx) {
    globalThis.__ctx = ctx;
}
exports.setContext = setContext;
function getContext() {
    return globalThis.__ctx;
}
exports.getContext = getContext;
function setCache(cache) {
    globalThis.__cache = cache;
}
exports.setCache = setCache;
function getCache() {
    return globalThis.__cache;
}
exports.getCache = getCache;
function runDelayedFunction(fn) {
    const context = getContext();
    /**
     * Runtimes (Oxygen, Node.js) might not have this.
     */
    if (!(context === null || context === void 0 ? void 0 : context.waitUntil)) {
        return fn();
    }
    return context.waitUntil(fn());
}
exports.runDelayedFunction = runDelayedFunction;
