import React from 'react';
import { useProduct } from '../ProductProvider';
/**
 * The `ProductTitle` component renders a `span` element (or the type of
 * HTML element specified by the `as` prop) with the product's [`title`](https://shopify.dev/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductTitle(props) {
    const product = useProduct();
    if (product == null) {
        throw new Error('Expected a ProductProvider context, but none was found');
    }
    const { as, ...passthroughProps } = props;
    const Wrapper = as ? as : 'span';
    return product.title ? (React.createElement(Wrapper, { ...passthroughProps }, product.title)) : null;
}
