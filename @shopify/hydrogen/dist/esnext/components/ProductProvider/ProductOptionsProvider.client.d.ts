import React from 'react';
import type { ProductProviderProps } from './ProductProvider.client';
interface ProductOptionsProviderProps {
    children: React.ReactNode;
    initialVariantId: ProductProviderProps['initialVariantId'];
}
export declare function ProductOptionsProvider({ children, initialVariantId, }: ProductOptionsProviderProps): JSX.Element;
export {};
