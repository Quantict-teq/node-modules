import { useQuery } from '../../useQuery/hooks';
/**
 * The `fetchSync` hook makes third-party API requests and is the recommended way to make simple fetch calls on the server.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export function fetchSync(url, options) {
    const { cache, preload, shouldCacheResponse, ...requestInit } = options !== null && options !== void 0 ? options : {};
    const { data: useQueryResponse, error } = useQuery([url, requestInit], async () => {
        const response = await globalThis.fetch(url, requestInit);
        const text = await response.text();
        return [text, response];
    }, {
        cache,
        preload,
        shouldCacheResponse,
    });
    if (error) {
        throw error;
    }
    const [data, response] = useQueryResponse;
    return {
        response,
        json: () => JSON.parse(data),
        text: () => data,
    };
}
