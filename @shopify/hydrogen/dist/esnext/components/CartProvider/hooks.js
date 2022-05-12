import React, { useState } from 'react';
import { useShop } from '../../foundation';
import { flattenConnection } from '../../utilities';
import { CartCreate } from './cart-queries';
export function useCartFetch() {
    const { storeDomain, storefrontApiVersion, storefrontToken } = useShop();
    return React.useCallback(({ query, variables, }) => {
        return fetch(`https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SDK-Variant': 'hydrogen',
                'X-SDK-Version': storefrontApiVersion,
                'X-Shopify-Storefront-Access-Token': storefrontToken,
            },
            body: JSON.stringify({
                query: query.toString(),
                variables,
            }),
        })
            .then((res) => res.json())
            .catch((error) => {
            return {
                data: undefined,
                error: error.toString(),
            };
        });
    }, [storeDomain, storefrontApiVersion, storefrontToken]);
}
export function useInstantCheckout() {
    const [cart, updateCart] = useState();
    const [checkoutUrl, updateCheckoutUrl] = useState();
    const [error, updateError] = useState();
    const fetch = useCartFetch();
    const createInstantCheckout = React.useCallback(async (cartInput) => {
        var _a, _b;
        const { data, error } = await fetch({
            query: CartCreate,
            variables: {
                input: cartInput,
            },
        });
        if (error) {
            updateError(error);
            updateCart(undefined);
            updateCheckoutUrl(undefined);
        }
        if ((_a = data === null || data === void 0 ? void 0 : data.cartCreate) === null || _a === void 0 ? void 0 : _a.cart) {
            const dataCart = data.cartCreate.cart;
            updateCart({
                ...dataCart,
                // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
                lines: flattenConnection(dataCart.lines),
                note: (_b = dataCart.note) !== null && _b !== void 0 ? _b : undefined,
            });
            updateCheckoutUrl(dataCart.checkoutUrl);
        }
    }, [fetch]);
    return { cart, checkoutUrl, error, createInstantCheckout };
}
