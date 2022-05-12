import { ElementType } from 'react';
import { Props } from '../types';
/**
 * The `ProductTitle` component renders a `span` element (or the type of
 * HTML element specified by the `as` prop) with the product's [`title`](https://shopify.dev/api/storefront/reference/products/product).
 * It must be a descendent of the `ProductProvider` component.
 */
export declare function ProductTitle<TTag extends ElementType = 'span'>(props: Props<TTag> & {
    /** An HTML tag to wrap the title. If not specified, then the
     * title is wrapped in a `span` element.
     */
    as?: TTag;
}): JSX.Element | null;
