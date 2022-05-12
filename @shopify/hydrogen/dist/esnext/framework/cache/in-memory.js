import { logCacheApiStatus } from '../../utilities/log';
/**
 * This is an in-memory implementation of `Cache` that *barely*
 * works and is only meant to be used during development.
 */
export class InMemoryCache {
    constructor() {
        this.store = new Map();
    }
    put(request, response) {
        logCacheApiStatus('PUT-dev', request.url);
        this.store.set(request.url, {
            value: response,
            date: new Date(),
        });
    }
    match(request) {
        var _a, _b;
        const match = this.store.get(request.url);
        if (!match) {
            logCacheApiStatus('MISS-dev', request.url);
            return;
        }
        const { value, date } = match;
        const cacheControl = value.headers.get('cache-control') || '';
        const maxAge = parseInt(((_a = cacheControl.match(/max-age=(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '0', 10);
        const swr = parseInt(((_b = cacheControl.match(/stale-while-revalidate=(\d+)/)) === null || _b === void 0 ? void 0 : _b[1]) || '0', 10);
        const age = (new Date().valueOf() - date.valueOf()) / 1000;
        const isMiss = age > maxAge + swr;
        if (isMiss) {
            logCacheApiStatus('MISS-dev', request.url);
            this.store.delete(request.url);
            return;
        }
        const isStale = age > maxAge;
        const headers = new Headers(value.headers);
        headers.set('cache', isStale ? 'STALE' : 'HIT');
        headers.set('date', date.toUTCString());
        logCacheApiStatus(`${headers.get('cache')}-dev`, request.url);
        const response = new Response(value.body, {
            headers,
        });
        return response;
    }
    delete(request) {
        this.store.delete(request.url);
        logCacheApiStatus('DELETE-dev', request.url);
    }
    keys(request) {
        const cacheKeys = [];
        for (const url of this.store.keys()) {
            if (!request || request.url === url) {
                cacheKeys.push(new Request(url));
            }
        }
        return Promise.resolve(cacheKeys);
    }
}
