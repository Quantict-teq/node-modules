import { getLoggerWithContext, collectQueryCacheControlHeaders, collectQueryTimings, logCacheApiStatus, } from '../../utilities/log';
import { deleteItemFromCache, generateSubRequestCacheControlHeader, getItemFromCache, isStale, setItemInCache, } from '../../framework/cache';
import { hashKey } from '../../utilities/hash';
import { runDelayedFunction } from '../../framework/runtime';
import { useRequestCacheData, useServerRequest } from '../ServerRequestProvider';
/**
 * The `useQuery` hook executes an asynchronous operation like `fetch` in a way that
 * supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this
 * hook to call any third-party APIs from a server component.
 *
 * \> Note:
 * \> If you're making a simple fetch call on the server, then we recommend using the [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync) hook instead.
 */
export function useQuery(
/** A string or array to uniquely identify the current query. */
key, 
/** An asynchronous query function like `fetch` which returns data. */
queryFn, 
/** The options to manage the cache behavior of the sub-request. */
queryOptions) {
    const request = useServerRequest();
    const withCacheIdKey = [
        '__QUERY_CACHE_ID__',
        ...(typeof key === 'string' ? [key] : key),
    ];
    const fetcher = cachedQueryFnBuilder(withCacheIdKey, queryFn, queryOptions);
    collectQueryTimings(request, withCacheIdKey, 'requested');
    if (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.preload) {
        request.savePreloadQuery({
            preload: queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.preload,
            key: withCacheIdKey,
            fetcher,
        });
    }
    return useRequestCacheData(withCacheIdKey, fetcher);
}
function cachedQueryFnBuilder(key, queryFn, queryOptions) {
    var _a;
    const resolvedQueryOptions = {
        ...(queryOptions !== null && queryOptions !== void 0 ? queryOptions : {}),
    };
    const shouldCacheResponse = (_a = queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.shouldCacheResponse) !== null && _a !== void 0 ? _a : (() => true);
    /**
     * Attempt to read the query from cache. If it doesn't exist or if it's stale, regenerate it.
     */
    async function cachedQueryFn() {
        // Call this hook before running any async stuff
        // to prevent losing the current React cycle.
        const request = useServerRequest();
        const log = getLoggerWithContext(request);
        const hashedKey = hashKey(key);
        const cacheResponse = await getItemFromCache(key);
        async function generateNewOutput() {
            return await queryFn();
        }
        if (cacheResponse) {
            const [output, response] = cacheResponse;
            collectQueryCacheControlHeaders(request, key, response.headers.get('cache-control'));
            /**
             * Important: Do this async
             */
            if (isStale(response, resolvedQueryOptions === null || resolvedQueryOptions === void 0 ? void 0 : resolvedQueryOptions.cache)) {
                logCacheApiStatus('STALE', hashedKey);
                const lockKey = `lock-${key}`;
                runDelayedFunction(async () => {
                    logCacheApiStatus('UPDATING', hashedKey);
                    const lockExists = await getItemFromCache(lockKey);
                    if (lockExists)
                        return;
                    await setItemInCache(lockKey, true);
                    try {
                        const output = await generateNewOutput();
                        if (shouldCacheResponse(output)) {
                            await setItemInCache(key, output, resolvedQueryOptions === null || resolvedQueryOptions === void 0 ? void 0 : resolvedQueryOptions.cache);
                        }
                    }
                    catch (e) {
                        log.error(`Error generating async response: ${e.message}`);
                    }
                    finally {
                        await deleteItemFromCache(lockKey);
                    }
                });
            }
            return output;
        }
        const newOutput = await generateNewOutput();
        /**
         * Important: Do this async
         */
        if (shouldCacheResponse(newOutput)) {
            runDelayedFunction(() => setItemInCache(key, newOutput, resolvedQueryOptions === null || resolvedQueryOptions === void 0 ? void 0 : resolvedQueryOptions.cache));
        }
        collectQueryCacheControlHeaders(request, key, generateSubRequestCacheControlHeader(resolvedQueryOptions === null || resolvedQueryOptions === void 0 ? void 0 : resolvedQueryOptions.cache));
        return newOutput;
    }
    return cachedQueryFn;
}
