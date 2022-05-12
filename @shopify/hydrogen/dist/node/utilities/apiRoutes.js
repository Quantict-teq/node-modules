"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderApiRoute = exports.getApiRouteFromURL = exports.getApiRoutes = exports.extractPathFromRoutesKey = void 0;
const matchPath_1 = require("./matchPath");
const log_1 = require("../utilities/log/");
const fetch_1 = require("./fetch");
const storefrontApi_1 = require("./storefrontApi");
const session_1 = require("../foundation/session/session");
let memoizedRoutes = [];
let memoizedPages = {};
function extractPathFromRoutesKey(routesKey, dirPrefix) {
    let path = routesKey
        .replace(dirPrefix, '')
        .replace(/\.server\.(t|j)sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);
    if (path.endsWith('/') && path !== '/') {
        path = path.substring(0, path.length - 1);
    }
    return path;
}
exports.extractPathFromRoutesKey = extractPathFromRoutesKey;
function getApiRoutes(pages, topLevelPath = '*') {
    if (!pages || memoizedPages === pages)
        return memoizedRoutes;
    const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');
    const routes = Object.keys(pages)
        .filter((key) => pages[key].api)
        .map((key) => {
        const path = extractPathFromRoutesKey(key, './routes');
        /**
         * Catch-all routes [...handle].jsx don't need an exact match
         * https://reactrouter.com/core/api/Route/exact-bool
         */
        const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
        return {
            path: topLevelPrefix + path,
            resource: pages[key].api,
            hasServerComponent: !!pages[key].default,
            exact,
        };
    });
    memoizedRoutes = [
        ...routes.filter((route) => !route.path.includes(':')),
        ...routes.filter((route) => route.path.includes(':')),
    ];
    memoizedPages = pages;
    return memoizedRoutes;
}
exports.getApiRoutes = getApiRoutes;
function getApiRouteFromURL(url, routes) {
    let foundRoute, foundRouteDetails;
    for (let i = 0; i < routes.length; i++) {
        foundRouteDetails = (0, matchPath_1.matchPath)(url.pathname, routes[i]);
        if (foundRouteDetails) {
            foundRoute = routes[i];
            break;
        }
    }
    if (!foundRoute)
        return null;
    return {
        resource: foundRoute.resource,
        params: foundRouteDetails.params,
        hasServerComponent: foundRoute.hasServerComponent,
    };
}
exports.getApiRouteFromURL = getApiRouteFromURL;
function queryShopBuilder(shopifyConfig, request) {
    return async function queryShop({ query, variables, }) {
        const { storeDomain, storefrontApiVersion, storefrontToken } = shopifyConfig;
        const buyerIp = request.getBuyerIp();
        const extraHeaders = (0, storefrontApi_1.getStorefrontApiRequestHeaders)({
            buyerIp,
            storefrontToken,
        });
        const fetcher = (0, fetch_1.fetchBuilder)(`https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`, {
            method: 'POST',
            body: (0, fetch_1.graphqlRequestBody)(query, variables),
            headers: {
                'Content-Type': 'application/json',
                ...extraHeaders,
            },
        });
        return await fetcher();
    };
}
async function renderApiRoute(request, route, shopifyConfig, session) {
    var _a;
    let response;
    const log = (0, log_1.getLoggerWithContext)(request);
    let cookieToSet = '';
    try {
        response = await route.resource(request, {
            params: route.params,
            queryShop: queryShopBuilder(shopifyConfig, request),
            session: session
                ? {
                    async get() {
                        return session.get(request);
                    },
                    async set(key, value) {
                        const data = await session.get(request);
                        data[key] = value;
                        cookieToSet = await session.set(request, data);
                    },
                    async destroy() {
                        cookieToSet = await session.destroy(request);
                    },
                }
                : (0, session_1.emptySessionImplementation)(log),
        });
        if (!(response instanceof Response || response instanceof Request)) {
            if (typeof response === 'string' || response instanceof String) {
                response = new Response(response);
            }
            else if (typeof response === 'object') {
                response = new Response(JSON.stringify(response), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
        }
        if (!response) {
            response = new Response(null);
        }
        if (cookieToSet) {
            response.headers.set('Set-Cookie', cookieToSet);
        }
    }
    catch (e) {
        log.error(e);
        response = new Response('Error processing: ' + request.url, { status: 500 });
    }
    (0, log_1.logServerResponse)('api', request, (_a = response.status) !== null && _a !== void 0 ? _a : 200);
    return response;
}
exports.renderApiRoute = renderApiRoute;
