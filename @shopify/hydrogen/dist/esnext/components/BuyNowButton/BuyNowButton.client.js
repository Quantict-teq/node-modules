import React, { useEffect, useState, useCallback } from 'react';
import { useInstantCheckout } from '../CartProvider';
/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export function BuyNowButton(props) {
    const { createInstantCheckout, checkoutUrl } = useInstantCheckout();
    const [loading, setLoading] = useState(false);
    const { quantity, variantId, attributes, children, ...passthroughProps } = props;
    useEffect(() => {
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    }, [checkoutUrl]);
    const handleBuyNow = useCallback(() => {
        setLoading(true);
        createInstantCheckout({
            lines: [
                {
                    quantity: quantity !== null && quantity !== void 0 ? quantity : 1,
                    merchandiseId: variantId,
                    attributes,
                },
            ],
        });
    }, [setLoading, createInstantCheckout, quantity, variantId, attributes]);
    return (React.createElement("button", { disabled: loading !== null && loading !== void 0 ? loading : passthroughProps.disabled, ...passthroughProps, onClick: handleBuyNow }, children));
}
