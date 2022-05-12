"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeShopifyId = exports.graphqlRequestBody = exports.fetchBuilder = void 0;
const graphql_1 = require("graphql");
const version_1 = require("../version");
const defaultHeaders = {
    'content-type': 'application/json',
    'user-agent': `Hydrogen ${version_1.LIB_VERSION}`,
};
function fetchBuilder(url, options = {}) {
    const requestInit = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };
    return async () => {
        const response = await fetch(url, requestInit);
        if (!response.ok) {
            throw response;
        }
        const data = await response.json();
        return data;
    };
}
exports.fetchBuilder = fetchBuilder;
function graphqlRequestBody(query, variables) {
    const queryString = typeof query === 'string' ? query : (0, graphql_1.print)(query);
    return JSON.stringify({
        query: queryString,
        variables,
    });
}
exports.graphqlRequestBody = graphqlRequestBody;
function decodeShopifyId(id) {
    if (!id.startsWith('gid://')) {
        throw new Error('invalid Shopify ID');
    }
    return id;
}
exports.decodeShopifyId = decodeShopifyId;
