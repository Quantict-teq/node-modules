import { useShop } from '../../foundation/useShop';
import { getLoggerWithContext } from '../../utilities/log';
import { graphqlRequestBody } from '../../utilities';
import { getConfig } from '../../framework/config';
import { useServerRequest } from '../../foundation/ServerRequestProvider';
import { injectGraphQLTracker } from '../../utilities/graphql-tracker';
import { sendMessageToClient } from '../../utilities/devtools';
import { fetchSync } from '../../foundation/fetchSync/server/fetchSync';
import { META_ENV_SSR } from '../../foundation/ssr-interop';
import { getStorefrontApiRequestHeaders } from '../../utilities/storefrontApi';
// Check if the response body has GraphQL errors
// https://spec.graphql.org/June2018/#sec-Response-Format
const shouldCacheResponse = ([body]) => { var _a; return !((_a = JSON.parse(body)) === null || _a === void 0 ? void 0 : _a.errors); };
/**
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShopQuery({ query, variables = {}, cache, preload = false, }) {
    var _a;
    /**
     * If no query is passed, we no-op here to allow developers to obey the Rules of Hooks.
     */
    if (!query) {
        return { data: undefined, errors: undefined };
    }
    if (!META_ENV_SSR) {
        throw new Error('Shopify Storefront API requests should only be made from the server.');
    }
    const serverRequest = useServerRequest();
    const log = getLoggerWithContext(serverRequest);
    const body = query ? graphqlRequestBody(query, variables) : '';
    const { url, requestInit } = useCreateShopRequest(body);
    let data;
    let useQueryError;
    try {
        data = fetchSync(url, {
            ...requestInit,
            cache,
            preload,
            shouldCacheResponse,
        }).json();
    }
    catch (error) {
        // Pass-through thrown promise for Suspense functionality
        if (error === null || error === void 0 ? void 0 : error.then) {
            throw error;
        }
        useQueryError = error;
    }
    /**
     * The fetch request itself failed, so we handle that differently than a GraphQL error
     */
    if (useQueryError) {
        const errorMessage = createErrorMessage(useQueryError);
        log.error(errorMessage);
        log.error(useQueryError);
        if (getConfig().dev) {
            throw new Error(errorMessage);
        }
        else {
            // in non-dev environments, we probably don't want super-detailed error messages for the user
            throw new Error(`The fetch attempt failed; there was an issue connecting to the data source.`);
        }
    }
    /**
     * GraphQL errors get printed to the console but ultimately
     * get returned to the consumer.
     */
    if (data === null || data === void 0 ? void 0 : data.errors) {
        const errors = Array.isArray(data.errors) ? data.errors : [data.errors];
        for (const error of errors) {
            if (getConfig().dev) {
                throw new Error(error.message);
            }
            else {
                log.error('GraphQL Error', error);
            }
        }
        log.error(`GraphQL errors: ${errors.length}`);
    }
    if (__DEV__ &&
        log.options().showUnusedQueryProperties &&
        query &&
        typeof query !== 'string' &&
        (data === null || data === void 0 ? void 0 : data.data)) {
        const fileLine = (_a = new Error('').stack) === null || _a === void 0 ? void 0 : _a.split('\n').find((line) => line.includes('.server.'));
        const [, functionName, fileName] = (fileLine === null || fileLine === void 0 ? void 0 : fileLine.match(/^\s*at (\w+) \(([^)]+)\)/)) || [];
        injectGraphQLTracker({
            query,
            data,
            onUnusedData: ({ queryName, properties }) => {
                const footer = `Examine the list of fields above to confirm that they are being used.\n`;
                const header = `Potentially overfetching fields in GraphQL query.\n`;
                let info = `Query \`${queryName}\``;
                if (fileName) {
                    info += ` in file \`${fileName}\` (function \`${functionName}\`)`;
                }
                const n = 6;
                const shouldTrim = properties.length > n + 1;
                const shownProperties = shouldTrim
                    ? properties.slice(0, n)
                    : properties;
                const hiddenInfo = shouldTrim
                    ? `  ...and ${properties.length - shownProperties.length} more\n`
                    : '';
                const warning = header +
                    info +
                    `:\n• ${shownProperties.join(`\n• `)}\n` +
                    hiddenInfo +
                    footer;
                log.warn(warning);
                sendMessageToClient({ type: 'warn', data: warning });
            },
        });
    }
    return data;
}
function useCreateShopRequest(body) {
    const { storeDomain, storefrontToken, storefrontApiVersion } = useShop();
    const request = useServerRequest();
    const buyerIp = request.getBuyerIp();
    const extraHeaders = getStorefrontApiRequestHeaders({
        buyerIp,
        storefrontToken,
    });
    return {
        key: [storeDomain, storefrontApiVersion, body],
        url: `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
        requestInit: {
            body,
            method: 'POST',
            headers: {
                'X-SDK-Variant': 'hydrogen',
                'X-SDK-Version': storefrontApiVersion,
                'content-type': 'application/json',
                ...extraHeaders,
            },
        },
    };
}
function createErrorMessage(fetchError) {
    if (fetchError instanceof Response) {
        return `An error occurred while fetching from the Storefront API. ${
        // 403s to the SF API (almost?) always mean that your Shopify credentials are bad/wrong
        fetchError.status === 403
            ? `You may have a bad value in 'shopify.config.js'`
            : `${fetchError.statusText}`}`;
    }
    else {
        return `Failed to connect to the Storefront API: ${fetchError.message}`;
    }
}
