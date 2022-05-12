import React, { createContext, useContext } from 'react';
import { getTime } from '../../utilities/timing';
import { hashKey } from '../../utilities/hash';
import { collectQueryTimings } from '../../utilities/log';
// Context to inject current request in SSR
const RequestContextSSR = createContext(null);
// Cache to inject current request in RSC
function requestCacheRSC() {
    return new Map();
}
requestCacheRSC.key = Symbol.for('HYDROGEN_REQUEST');
export function ServerRequestProvider({ isRSC, request, children, }) {
    if (isRSC) {
        // Save the request object in a React cache that is
        // scoped to this current rendering.
        // @ts-ignore
        const requestCache = React.unstable_getCacheForType(requestCacheRSC);
        requestCache.set(requestCacheRSC.key, request);
        return children;
    }
    // Use a normal provider in SSR to make the request object
    // available in the current rendering.
    return (React.createElement(RequestContextSSR.Provider, { value: request }, children));
}
export function useServerRequest() {
    let request;
    try {
        // This cache only works during RSC rendering:
        // @ts-ignore
        const cache = React.unstable_getCacheForType(requestCacheRSC);
        request = cache ? cache.get(requestCacheRSC.key) : null;
    }
    catch (_a) {
        // If RSC cache failed it means this is not an RSC request.
        // Try getting SSR context instead:
        request = useContext(RequestContextSSR);
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
/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export function useRequestCacheData(key, fetcher) {
    const request = useServerRequest();
    const cache = request.ctx.cache;
    const cacheKey = hashKey(key);
    if (!cache.has(cacheKey)) {
        let result;
        let promise;
        cache.set(cacheKey, () => {
            if (result !== undefined) {
                collectQueryTimings(request, key, 'rendered');
                return result;
            }
            if (!promise) {
                const startApiTime = getTime();
                promise = fetcher().then((data) => {
                    result = { data };
                    collectQueryTimings(request, key, 'resolved', getTime() - startApiTime);
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
export function preloadRequestCacheData(request, preloadQueries) {
    const cache = request.ctx.cache;
    preloadQueries === null || preloadQueries === void 0 ? void 0 : preloadQueries.forEach((preloadQuery, cacheKey) => {
        collectQueryTimings(request, preloadQuery.key, 'preload');
        if (!cache.has(cacheKey)) {
            let result;
            let promise;
            cache.set(cacheKey, () => {
                if (result !== undefined) {
                    collectQueryTimings(request, preloadQuery.key, 'rendered');
                    return result;
                }
                if (!promise) {
                    const startApiTime = getTime();
                    promise = preloadQuery.fetcher().then((data) => {
                        result = { data };
                        collectQueryTimings(request, preloadQuery.key, 'resolved', getTime() - startApiTime);
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
