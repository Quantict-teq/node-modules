import { getTime } from '../../utilities/timing';
import { hashKey } from '../../utilities/hash';
import { HelmetData as HeadData } from 'react-helmet-async';
import { RSC_PATHNAME } from '../../constants';
let reqCounter = 0; // For debugging
const generateId = typeof crypto !== 'undefined' &&
    // @ts-ignore
    !!crypto.randomUUID
    ? // @ts-ignore
        () => crypto.randomUUID()
    : () => `req${++reqCounter}`;
// Stores queries by url or '*'
const preloadCache = new Map();
const PRELOAD_ALL = '*';
/**
 * This augments the `Request` object from the Fetch API:
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 *
 * - Adds a `cookies` map for easy access
 * - Adds a static constructor to convert a Node.js `IncomingMessage` to a Request.
 */
export class ServerComponentRequest extends Request {
    constructor(input, init) {
        if (input instanceof Request) {
            super(input, init);
        }
        else {
            super(getUrlFromNodeRequest(input), getInitFromNodeRequest(input));
        }
        const referer = this.headers.get('referer');
        this.time = getTime();
        this.id = generateId();
        this.preloadURL =
            this.isRscRequest() && referer && referer !== '' ? referer : this.url;
        this.ctx = {
            cache: new Map(),
            head: new HeadData({}),
            router: {
                routeRendered: false,
                serverProps: {},
                routeParams: {},
            },
            queryCacheControl: [],
            queryTimings: [],
            analyticsData: {
                url: this.url,
                normalizedRscUrl: this.preloadURL,
            },
            preloadQueries: new Map(),
        };
        this.cookies = this.parseCookies();
    }
    parseCookies() {
        const cookieString = this.headers.get('cookie') || '';
        return new Map(cookieString
            .split(';')
            .map((chunk) => chunk.trim())
            .filter((chunk) => chunk !== '')
            .map((chunk) => chunk.split(/=(.+)/)));
    }
    isRscRequest() {
        const url = new URL(this.url);
        return url.pathname === RSC_PATHNAME;
    }
    savePreloadQuery(query) {
        if (typeof query.preload === 'string' && query.preload === PRELOAD_ALL) {
            saveToPreloadAllPreload(query);
        }
        else if (query.preload) {
            this.ctx.preloadQueries.set(hashKey(query.key), query);
        }
    }
    getPreloadQueries() {
        if (preloadCache.has(this.preloadURL)) {
            const combinedPreloadQueries = new Map();
            const urlPreloadCache = preloadCache.get(this.preloadURL);
            mergeMapEntries(combinedPreloadQueries, urlPreloadCache);
            mergeMapEntries(combinedPreloadQueries, preloadCache.get(PRELOAD_ALL));
            return combinedPreloadQueries;
        }
        else if (preloadCache.has(PRELOAD_ALL)) {
            return preloadCache.get(PRELOAD_ALL);
        }
    }
    savePreloadQueries() {
        preloadCache.set(this.preloadURL, this.ctx.preloadQueries);
    }
    /**
     * Buyer IP varies by hosting provider and runtime. The developer should provide this
     * as an argument to the `handleRequest` function for their runtime.
     * Defaults to `x-forwarded-for` header value.
     */
    getBuyerIp() {
        var _a;
        return this.headers.get((_a = this.ctx.buyerIpHeader) !== null && _a !== void 0 ? _a : 'x-forwarded-for');
    }
}
function mergeMapEntries(map1, map2) {
    map2 && map2.forEach((v, k) => map1.set(k, v));
}
function saveToPreloadAllPreload(query) {
    let setCache = preloadCache.get(PRELOAD_ALL);
    if (!setCache) {
        setCache = new Map();
    }
    setCache === null || setCache === void 0 ? void 0 : setCache.set(hashKey(query.key), query);
    preloadCache.set(PRELOAD_ALL, setCache);
}
/**
 * @see https://github.com/frandiox/vitedge/blob/17f3cd943e86d7c0c71a862985ddd6caa2899425/src/node/utils.js#L19-L24
 *
 * Note: Request can sometimes be an instance of Express request, where `originalUrl` is the true source of what the
 * URL pathname is. We want to use that if it's present, so we union type this to `any`.
 */
function getUrlFromNodeRequest(request) {
    var _a;
    const url = (_a = request.originalUrl) !== null && _a !== void 0 ? _a : request.url;
    if (url && !url.startsWith('/'))
        return url;
    // TODO: Find out how to determine https from `request` object without forwarded proto
    const secure = request.headers['x-forwarded-proto'] === 'https';
    return new URL(`${secure ? 'https' : 'http'}://${request.headers.host + url}`).toString();
}
function getInitFromNodeRequest(request) {
    const init = {
        headers: new Headers(request.headers),
        method: request.method,
        body: request.method !== 'GET' && request.method !== 'HEAD'
            ? request.body
            : undefined,
    };
    const remoteAddress = request.socket.remoteAddress;
    if (!init.headers.has('x-forwarded-for') && remoteAddress) {
        init.headers.set('x-forwarded-for', remoteAddress);
    }
    return init;
}
