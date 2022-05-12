import React from 'react';
import { ProductOptionsContext } from './context';
import { useProductOptions } from '../../hooks';
import { useProduct } from '../../hooks/useProduct';
export function ProductOptionsProvider({ children, initialVariantId, }) {
    const product = useProduct();
    const productOptions = useProductOptions({
        variants: product.variantsConnection,
        initialVariantId: initialVariantId,
    });
    return (React.createElement(ProductOptionsContext.Provider, { value: productOptions }, children));
}
