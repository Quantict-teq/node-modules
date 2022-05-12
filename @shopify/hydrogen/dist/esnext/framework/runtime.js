/**
 * Set a global runtime context for the current request.
 * This is used to encapsulate things like:
 * - `waitUntil()` to run promises after request has ended
 */
export function setContext(ctx) {
    globalThis.__ctx = ctx;
}
export function getContext() {
    return globalThis.__ctx;
}
export function setCache(cache) {
    globalThis.__cache = cache;
}
export function getCache() {
    return globalThis.__cache;
}
export function runDelayedFunction(fn) {
    const context = getContext();
    /**
     * Runtimes (Oxygen, Node.js) might not have this.
     */
    if (!(context === null || context === void 0 ? void 0 : context.waitUntil)) {
        return fn();
    }
    return context.waitUntil(fn());
}
