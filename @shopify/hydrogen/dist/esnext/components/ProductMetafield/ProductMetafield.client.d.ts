import { ElementType } from 'react';
import { Props } from '../types';
import { MetafieldProps } from '../Metafield/Metafield.client';
export interface ProductMetafieldProps<TTag> extends Omit<MetafieldProps<TTag>, 'metafield'> {
    /** A string corresponding to the [key](https://shopify.dev/api/storefront/reference/common-objects/metafield) of the product's
     * metafield.
     */
    keyName: string;
    /** A string corresponding to the [namespace](https://shopify.dev/api/storefront/reference/common-objects/metafield) of the
     * product's metafield.
     */
    namespace: string;
    /** The ID of the variant. If provided, then use the metafield corresponding to the variant ID instead of the product's metafield. */
    variantId?: string;
}
/**
 * The `ProductMetafield` component renders a
 * [`Metafield`](https://shopify.dev/api/hydrogen/components/primitive/metafield) component with the product metafield.
 * It must be a descendent of a `ProductProvider` component.
 */
export declare function ProductMetafield<TTag extends ElementType>(props: Props<TTag> & Omit<ProductMetafieldProps<TTag>, 'data'>): JSX.Element | null;
