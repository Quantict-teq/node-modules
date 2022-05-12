"use strict";
// TODO should we move this file to src/foundation
// so it is considered ESM instead of CJS?
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRefresh = exports.useServerResponse = void 0;
// @ts-ignore
const react_1 = require("react");
const react_server_dom_vite_1 = require("@shopify/hydrogen/vendor/react-server-dom-vite");
const constants_1 = require("../../constants");
let rscReader;
if (globalThis.__flight && __flight.length > 0) {
    const contentLoaded = new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve));
    try {
        rscReader = new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                const write = (chunk) => {
                    controller.enqueue(encoder.encode(chunk));
                    return 0;
                };
                __flight.forEach(write);
                __flight.push = write;
                contentLoaded.then(() => controller.close());
            },
        });
    }
    catch (_) {
        // Old browser, will try a new hydration request later
    }
}
function createResponseCache() {
    return new Map();
}
/**
 * Much of this is borrowed from React's demo implementation:
 * @see https://github.com/reactjs/server-components-demo/blob/main/src/Cache.client.js
 *
 * Note that we'd want to add some other constraints and controls around caching here.
 */
function useServerResponse(state) {
    const key = JSON.stringify(state);
    const cache = (0, react_1.unstable_getCacheForType)(createResponseCache);
    let response = cache.get(key);
    if (response) {
        return response;
    }
    if (rscReader) {
        // The flight response was inlined during SSR, use it directly.
        response = (0, react_server_dom_vite_1.createFromReadableStream)(rscReader);
        rscReader = null;
    }
    else {
        if (
        /* @ts-ignore */
        window.BOOMR &&
            /* @ts-ignore */
            window.BOOMR.plugins &&
            /* @ts-ignore */
            window.BOOMR.plugins.Hydrogen) {
            /* @ts-ignore */
            window.BOOMR.plugins.Hydrogen.trackSubPageLoadPerformance();
        }
        // Request a new flight response.
        response = (0, react_server_dom_vite_1.createFromFetch)(fetch(`${constants_1.RSC_PATHNAME}?state=` + encodeURIComponent(key)));
    }
    cache.clear();
    cache.set(key, response);
    return response;
}
exports.useServerResponse = useServerResponse;
function useRefresh() {
    const refreshCache = (0, react_1.unstable_useCacheRefresh)();
    refreshCache();
}
exports.useRefresh = useRefresh;
