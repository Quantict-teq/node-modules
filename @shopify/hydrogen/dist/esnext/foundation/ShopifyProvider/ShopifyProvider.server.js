import React, { useMemo } from 'react';
import { ShopifyProviderClient } from './ShopifyProvider.client';
import { DEFAULT_LOCALE } from '../constants';
import { useServerRequest } from '../ServerRequestProvider';
function makeShopifyContext(shopifyConfig) {
    var _a, _b;
    const locale = (_a = shopifyConfig.defaultLocale) !== null && _a !== void 0 ? _a : DEFAULT_LOCALE;
    const languageCode = locale.split(/[-_]/)[0];
    return {
        locale: locale.toUpperCase(),
        languageCode: languageCode.toUpperCase(),
        storeDomain: (_b = shopifyConfig === null || shopifyConfig === void 0 ? void 0 : shopifyConfig.storeDomain) === null || _b === void 0 ? void 0 : _b.replace(/^https?:\/\//, ''),
        storefrontToken: shopifyConfig.storefrontToken,
        storefrontApiVersion: shopifyConfig.storefrontApiVersion,
    };
}
export const SHOPIFY_PROVIDER_CONTEXT_KEY = Symbol.for('SHOPIFY_PROVIDER_RSC');
/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 * If you're using the Hydrogen framework, you don't need to add this provider
 * because it's automatically wrapped around your app in `renderHydrogen()`.
 */
export function ShopifyProvider({ shopifyConfig, children, }) {
    if (!shopifyConfig) {
        throw new Error('The `shopifyConfig` prop should be passed to `ShopifyProvider`');
    }
    const shopifyProviderValue = useMemo(() => makeShopifyContext(shopifyConfig), [shopifyConfig]);
    const request = useServerRequest();
    request.ctx.shopifyConfig = shopifyProviderValue;
    return (React.createElement(ShopifyProviderClient, { shopifyConfig: shopifyProviderValue }, children));
}
