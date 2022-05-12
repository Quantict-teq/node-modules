import React from 'react';
import { Money } from '../Money';
import { UnitPrice } from '../UnitPrice';
export interface ProductPriceProps {
    /** The type of price. Valid values: `regular` (default) or `compareAt`. */
    priceType?: 'regular' | 'compareAt';
    /** The type of value. Valid values: `min` (default), `max` or `unit`. */
    valueType?: 'max' | 'min' | 'unit';
    /** The ID of the variant. */
    variantId?: string;
}
/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](https://shopify.dev/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range. It must be a descendent of the `ProductProvider` component.
 */
export declare function ProductPrice<TTag extends keyof JSX.IntrinsicElements>(props: (Omit<React.ComponentProps<typeof UnitPrice>, 'data' | 'measurement'> | Omit<React.ComponentProps<typeof Money>, 'data'>) & ProductPriceProps): JSX.Element | null;
