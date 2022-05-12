import React from 'react';
import { Metafield } from '../Metafield';
import { useProduct } from '../../hooks/useProduct/useProduct';
import { flattenConnection } from '../../utilities';
/**
 * The `ProductMetafield` component renders a
 * [`Metafield`](https://shopify.dev/api/hydrogen/components/primitive/metafield) component with the product metafield.
 * It must be a descendent of a `ProductProvider` component.
 */
export function ProductMetafield(props) {
    var _a, _b, _c;
    const product = useProduct();
    if (product == null) {
        throw new Error('Expected a ProductProvider context, but none was found');
    }
    if (product.metafields == null) {
        console.warn('No metafields available for product');
        return null;
    }
    const { namespace, keyName, variantId, ...passthroughProps } = props;
    const metafields = (variantId
        ? flattenConnection((_c = (_b = (_a = product.variants) === null || _a === void 0 ? void 0 : _a.find((variant) => (variant === null || variant === void 0 ? void 0 : variant.id) === variantId)) === null || _b === void 0 ? void 0 : _b.metafields) !== null && _c !== void 0 ? _c : {})
        : product.metafields); // TODO: fix the typing here and ensure it's correct
    const field = metafields === null || metafields === void 0 ? void 0 : metafields.find((metafield) => metafield.namespace === namespace && metafield.key === keyName);
    if (field === null || field === undefined) {
        const message = 'does not have a value for metafield.';
        const productOrVariant = variantId ? `Variant` : 'Product';
        const logItems = {
            variantId: variantId,
            ProductId: product.id,
            namespace,
            keyName,
        };
        console.warn([
            productOrVariant,
            message,
            ...Object.entries(logItems).map(([key, val]) => `${key}: ${val}`),
        ].join(' '));
        return null;
    }
    return React.createElement(Metafield, { data: field, ...passthroughProps });
}
