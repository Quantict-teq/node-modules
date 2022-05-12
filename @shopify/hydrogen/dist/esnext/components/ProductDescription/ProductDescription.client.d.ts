import { ElementType } from 'react';
import { Props } from '../types';
/**
 * The `ProductDescription` component renders a `div` with
 * the product's [`descriptionHtml`](https://shopify.dev/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export declare function ProductDescription<TTag extends ElementType = 'div'>(props: Props<TTag> & {
    /** An HTML tag to wrap the description. If not specified, then the
     * description is wrapped in a `div` element.
     */
    as?: TTag;
}): JSX.Element | null;
