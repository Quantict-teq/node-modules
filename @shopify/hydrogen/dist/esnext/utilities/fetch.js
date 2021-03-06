import { print } from 'graphql';
import { LIB_VERSION } from '../version';
const defaultHeaders = {
    'content-type': 'application/json',
    'user-agent': `Hydrogen ${LIB_VERSION}`,
};
export function fetchBuilder(url, options = {}) {
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
export function graphqlRequestBody(query, variables) {
    const queryString = typeof query === 'string' ? query : print(query);
    return JSON.stringify({
        query: queryString,
        variables,
    });
}
export function decodeShopifyId(id) {
    if (!id.startsWith('gid://')) {
        throw new Error('invalid Shopify ID');
    }
    return id;
}
