import { ReactNode } from 'react';
import { useProductOptions } from '../../hooks';
import type { Product as ProductType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export interface ProductProviderProps {
    /** A `ReactNode` element. */
    children: ReactNode;
    /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
    data: PartialDeep<ProductType>;
    /** The initially selected variant. If this is missing, then `selectedVariantId`
     * in the returned `object` from the `useProduct` hook uses the first available variant
     * or the first variant (if none are available).
     */
    initialVariantId?: Parameters<typeof useProductOptions>['0']['initialVariantId'];
}
/**
 * The `ProductProvider` component sets up a context with product details. Descendents of
 * this component can use the `useProduct` hook.
 */
export declare function ProductProvider({ children, data: product, initialVariantId, }: ProductProviderProps): JSX.Element;
