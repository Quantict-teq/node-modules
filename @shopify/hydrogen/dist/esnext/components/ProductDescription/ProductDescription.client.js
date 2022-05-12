import React from 'react';
import { useProduct } from '../ProductProvider';
/**
 * The `ProductDescription` component renders a `div` with
 * the product's [`descriptionHtml`](https://shopify.dev/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductDescription(props) {
    var _a;
    const product = useProduct();
    if (product == null) {
        throw new Error('Expected a ProductProvider context, but none was found');
    }
    const Wrapper = (_a = props.as) !== null && _a !== void 0 ? _a : 'div';
    return product.descriptionHtml ? (React.createElement(Wrapper, { dangerouslySetInnerHTML: { __html: product.descriptionHtml }, ...props })) : null;
}
