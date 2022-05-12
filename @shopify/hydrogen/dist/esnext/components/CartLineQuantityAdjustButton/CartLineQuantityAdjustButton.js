import React from 'react';
import { useCart } from '../CartProvider';
import { useCartLine } from '../CartLineProvider';
/**
 * The `CartLineQuantityAdjustButton` component renders a button that adjusts the cart line's quantity when pressed.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineQuantityAdjustButton(props) {
    const { status, linesRemove, linesUpdate } = useCart();
    const cartLine = useCartLine();
    const { children, adjust, ...passthroughProps } = props;
    return (React.createElement("button", { disabled: status !== 'idle', onClick: () => {
            if (adjust === 'remove') {
                linesRemove([cartLine.id]);
                return;
            }
            const quantity = adjust === 'decrease' ? cartLine.quantity - 1 : cartLine.quantity + 1;
            if (quantity <= 0) {
                linesRemove([cartLine.id]);
                return;
            }
            linesUpdate([{ id: cartLine.id, quantity }]);
        }, ...passthroughProps }, children));
}
