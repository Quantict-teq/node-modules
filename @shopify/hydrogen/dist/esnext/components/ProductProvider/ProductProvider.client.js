import React, { useMemo } from 'react';
import { useParsedMetafields } from '../../hooks';
import { flattenConnection } from '../../utilities';
import { ProductContext } from './context';
import { ProductOptionsProvider } from './ProductOptionsProvider.client';
/**
 * The `ProductProvider` component sets up a context with product details. Descendents of
 * this component can use the `useProduct` hook.
 */
export function ProductProvider({ children, data: product, initialVariantId, }) {
    const metafields = useParsedMetafields(product.metafields || {});
    // @ts-expect-error The types here are broken on main, need to come back and fix them sometime
    const providerValue = useMemo(() => {
        return {
            ...product,
            metafields,
            metafieldsConnection: product.metafields,
            media: product.media ? flattenConnection(product.media) : undefined,
            mediaConnection: product.media,
            variants: product.variants
                ? flattenConnection(product.variants)
                : undefined,
            variantsConnection: product.variants,
            images: product.images ? flattenConnection(product.images) : undefined,
            imagesConnection: product.images,
            collections: product.collections
                ? flattenConnection(product.collections)
                : undefined,
            collectionsConnection: product.collections,
        };
    }, [metafields, product]);
    return (React.createElement(ProductContext.Provider, { value: providerValue },
        React.createElement(ProductOptionsProvider, { initialVariantId: initialVariantId }, children)));
}
