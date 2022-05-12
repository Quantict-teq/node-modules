import React from 'react';
import { Money } from '../Money';
import { useProduct } from '../ProductProvider';
import { UnitPrice } from '../UnitPrice';
/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](https://shopify.dev/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range. It must be a descendent of the `ProductProvider` component.
 */
export function ProductPrice(props) {
    var _a, _b, _c, _d, _e, _f, _g;
    const product = useProduct();
    const { priceType = 'regular', variantId, valueType = 'min', ...passthroughProps } = props;
    if (product == null) {
        throw new Error('Expected a ProductProvider context, but none was found');
    }
    let price;
    let measurement;
    const variant = variantId
        ? (_a = product === null || product === void 0 ? void 0 : product.variants) === null || _a === void 0 ? void 0 : _a.find((variant) => (variant === null || variant === void 0 ? void 0 : variant.id) === variantId)
        : null;
    if (priceType === 'compareAt') {
        if (variantId && variant) {
            if (((_b = variant.compareAtPriceV2) === null || _b === void 0 ? void 0 : _b.amount) === ((_c = variant.priceV2) === null || _c === void 0 ? void 0 : _c.amount)) {
                return null;
            }
            price = variant.compareAtPriceV2;
        }
        else if (valueType === 'max') {
            price = (_d = product === null || product === void 0 ? void 0 : product.compareAtPriceRange) === null || _d === void 0 ? void 0 : _d.maxVariantPrice;
        }
        else {
            price = (_e = product === null || product === void 0 ? void 0 : product.compareAtPriceRange) === null || _e === void 0 ? void 0 : _e.minVariantPrice;
        }
    }
    else {
        if (variantId && variant) {
            price = variant.priceV2;
            if (valueType === 'unit') {
                price = variant.unitPrice;
                measurement = variant.unitPriceMeasurement;
            }
        }
        else if (valueType === 'max') {
            price = (_f = product.priceRange) === null || _f === void 0 ? void 0 : _f.maxVariantPrice;
        }
        else {
            price = (_g = product.priceRange) === null || _g === void 0 ? void 0 : _g.minVariantPrice;
        }
    }
    if (!price) {
        return null;
    }
    if (measurement) {
        return (React.createElement(UnitPrice, { ...passthroughProps, data: price, measurement: measurement }));
    }
    return React.createElement(Money, { ...passthroughProps, data: price });
}
