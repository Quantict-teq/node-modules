import React from 'react';
import { useCartLine } from '../CartLineProvider';
import { Money } from '../Money';
/**
 * The `CartLinePrice` component renders a `Money` component for the cart line merchandise's price or
 * compare at price. It must be a descendent of a `CartLineProvider` component.
 */
export function CartLinePrice(props) {
    const cartLine = useCartLine();
    const { priceType = 'regular', ...passthroughProps } = props;
    const price = priceType === 'regular'
        ? cartLine.merchandise.priceV2
        : cartLine.merchandise.compareAtPriceV2;
    if (price == null) {
        return null;
    }
    return (React.createElement(Money, { ...passthroughProps, data: {
            amount: `${parseFloat(price.amount) * cartLine.quantity}`,
            currencyCode: price.currencyCode,
        } }));
}
