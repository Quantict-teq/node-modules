import React from 'react';
import { useCartLine } from '../CartLineProvider';
import { Image } from '../Image';
/**
 * The `CartLineImage` component renders an `Image` component for the cart line merchandise's image.
 * It must be a descendent of a `CartLineProvider` component.
 */
export function CartLineImage(props) {
    const cartLine = useCartLine();
    const { options, ...passthroughProps } = props;
    return cartLine.merchandise.image ? (React.createElement(Image, { ...passthroughProps, data: cartLine.merchandise.image, options: options })) : null;
}
