"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStale = exports.deleteItemFromCache = exports.setItemInCache = exports.getItemFromCache = exports.generateSubRequestCacheControlHeader = void 0;
const runtime_1 = require("./runtime");
const CachingStrategy_1 = require("../framework/CachingStrategy");
const hash_1 = require("../utilities/hash");
const log_1 = require("../utilities/log");
function getCacheControlSetting(userCacheOptions, options) {
    if (userCacheOptions && options) {
        return {
            ...userCacheOptions,
            ...options,
        };
    }
    else {
        return userCacheOptions || (0, CachingStrategy_1.CacheSeconds)();
    }
}
function generateSubRequestCacheControlHeader(userCacheOptions) {
    return (0, CachingStrategy_1.generateCacheControlHeader)(getCacheControlSetting(userCacheOptions));
}
exports.generateSubRequestCacheControlHeader = generateSubRequestCacheControlHeader;
/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key) {
    return `https://shopify.dev/?${key}`;
}
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
async function getItemFromCache(key) {
    const cache = (0, runtime_1.getCache)();
    if (!cache) {
        return;
    }
    const url = getKeyUrl((0, hash_1.hashKey)(key));
    const request = new Request(url);
    const response = await cache.match(request);
    if (!response) {
        (0, log_1.logCacheApiStatus)('MISS', url);
        return;
    }
    (0, log_1.logCacheApiStatus)('HIT', url);
    return [await response.json(), response];
}
exports.getItemFromCache = getItemFromCache;
/**
 * Put an item into the cache.
 */
async function setItemInCache(key, value, userCacheOptions) {
    const cache = (0, runtime_1.getCache)();
    if (!cache) {
        return;
    }
    const url = getKeyUrl((0, hash_1.hashKey)(key));
    const request = new Request(url);
    /**
     * We are manually managing staled request by adding this workaround.
     * Why? cache control header support is dependent on hosting platform
     *
     * For example:
     *
     * Cloudflare's Cache API does not support `stale-while-revalidate`.
     * Cloudflare cache control header has a very odd behaviour.
     * Say we have the following cache control header on a request:
     *
     *   public, max-age=15, stale-while-revalidate=30
     *
     * When there is a cache.match HIT, the cache control header would become
     *
     *   public, max-age=14400, stale-while-revalidate=30
     *
     * == `stale-while-revalidate` workaround ==
     * Update response max-age so that:
     *
     *   max-age = max-age + stale-while-revalidate
     *
     * For example:
     *
     *   public, max-age=1, stale-while-revalidate=9
     *                    |
     *                    V
     *   public, max-age=10, stale-while-revalidate=9
     *
     * Store the following information in the response header:
     *
     *   cache-put-date   - UTC time string of when this request is PUT into cache
     *
     * Note on `cache-put-date`: The `response.headers.get('date')` isn't static. I am
     * not positive what date this is returning but it is never over 500 ms
     * after subtracting from the current timestamp.
     *
     * `isStale` function will use the above information to test for stale-ness of a cached response
     */
    const cacheControl = getCacheControlSetting(userCacheOptions);
    const headers = new Headers({
        'cache-control': generateSubRequestCacheControlHeader(getCacheControlSetting(cacheControl, {
            maxAge: (cacheControl.maxAge || 0) + (cacheControl.staleWhileRevalidate || 0),
        })),
        'cache-put-date': new Date().toUTCString(),
    });
    const response = new Response(JSON.stringify(value), { headers });
    (0, log_1.logCacheApiStatus)('PUT', url);
    await cache.put(request, response);
}
exports.setItemInCache = setItemInCache;
async function deleteItemFromCache(key) {
    const cache = (0, runtime_1.getCache)();
    if (!cache)
        return;
    const url = getKeyUrl((0, hash_1.hashKey)(key));
    const request = new Request(url);
    (0, log_1.logCacheApiStatus)('DELETE', url);
    await cache.delete(request);
}
exports.deleteItemFromCache = deleteItemFromCache;
/**
 * Manually check the response to see if it's stale.
 */
function isStale(response, userCacheOptions) {
    const responseMaxAge = getCacheControlSetting(userCacheOptions).maxAge || 0;
    const responseDate = response.headers.get('cache-put-date');
    if (!responseDate)
        return false;
    const ageInMs = new Date().valueOf() - new Date(responseDate).valueOf();
    const age = ageInMs / 1000;
    return age > responseMaxAge;
}
exports.isStale = isStale;
