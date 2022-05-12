"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadRequestCacheData = exports.useRequestCacheData = exports.useServerRequest = exports.ServerRequestProvider = void 0;
const react_1 = __importStar(require("react"));
const timing_1 = require("../../utilities/timing");
const hash_1 = require("../../utilities/hash");
const log_1 = require("../../utilities/log");
// Context to inject current request in SSR
const RequestContextSSR = (0, react_1.createContext)(null);
// Cache to inject current request in RSC
function requestCacheRSC() {
    return new Map();
}
requestCacheRSC.key = Symbol.for('HYDROGEN_REQUEST');
function ServerRequestProvider({ isRSC, request, children, }) {
    if (isRSC) {
        // Save the request object in a React cache that is
        // scoped to this current rendering.
        // @ts-ignore
        const requestCache = react_1.default.unstable_getCacheForType(requestCacheRSC);
        requestCache.set(requestCacheRSC.key, request);
        return children;
    }
    // Use a normal provider in SSR to make the request object
    // available in the current rendering.
    return (react_1.default.createElement(RequestContextSSR.Provider, { value: request }, children));
}
exports.ServerRequestProvider = ServerRequestProvider;
function useServerRequest() {
    let request;
    try {
        // This cache only works during RSC rendering:
        // @ts-ignore
        const cache = react_1.default.unstable_getCacheForType(requestCacheRSC);
        request = cache ? cache.get(requestCacheRSC.key) : null;
    }
    catch (_a) {
        // If RSC cache failed it means this is not an RSC request.
        // Try getting SSR context instead:
        request = (0, react_1.useContext)(RequestContextSSR);
    }
    if (!request) {
        // @ts-ignore
        if (__DEV__ && typeof jest !== 'undefined') {
            // Unit tests are not wrapped in ServerRequestProvider.
            // This mocks it, instead of providing it in every test.
            return { ctx: {} };
        }
        throw new Error('No ServerRequest Context found');
    }
    return request;
}
exports.useServerRequest = useServerRequest;
/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
function useRequestCacheData(key, fetcher) {
    const request = useServerRequest();
    const cache = request.ctx.cache;
    const cacheKey = (0, hash_1.hashKey)(key);
    if (!cache.has(cacheKey)) {
        let result;
        let promise;
        cache.set(cacheKey, () => {
            if (result !== undefined) {
                (0, log_1.collectQueryTimings)(request, key, 'rendered');
                return result;
            }
            if (!promise) {
                const startApiTime = (0, timing_1.getTime)();
                promise = fetcher().then((data) => {
                    result = { data };
                    (0, log_1.collectQueryTimings)(request, key, 'resolved', (0, timing_1.getTime)() - startApiTime);
                }, (error) => (result = { error }));
            }
            throw promise;
        });
    }
    // Making sure the promise has returned data because it can be initated by a preload request,
    // otherwise, we throw the promise
    const result = cache.get(cacheKey).call();
    if (result instanceof Promise)
        throw result;
    return result;
}
exports.useRequestCacheData = useRequestCacheData;
function preloadRequestCacheData(request, preloadQueries) {
    const cache = request.ctx.cache;
    preloadQueries === null || preloadQueries === void 0 ? void 0 : preloadQueries.forEach((preloadQuery, cacheKey) => {
        (0, log_1.collectQueryTimings)(request, preloadQuery.key, 'preload');
        if (!cache.has(cacheKey)) {
            let result;
            let promise;
            cache.set(cacheKey, () => {
                if (result !== undefined) {
                    (0, log_1.collectQueryTimings)(request, preloadQuery.key, 'rendered');
                    return result;
                }
                if (!promise) {
                    const startApiTime = (0, timing_1.getTime)();
                    promise = preloadQuery.fetcher().then((data) => {
                        result = { data };
                        (0, log_1.collectQueryTimings)(request, preloadQuery.key, 'resolved', (0, timing_1.getTime)() - startApiTime);
                    }, (error) => {
                        result = { error };
                    });
                }
                return promise;
            });
        }
        cache.get(cacheKey).call();
    });
}
exports.preloadRequestCacheData = preloadRequestCacheData;
