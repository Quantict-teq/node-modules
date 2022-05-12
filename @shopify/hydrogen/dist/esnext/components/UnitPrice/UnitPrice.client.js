import React from 'react';
import { Money } from '../Money';
/**
 * The `UnitPrice` component renders a string with a [UnitPrice](https://shopify.dev/themes/pricing-payments/unit-pricing) as the
 * Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) with a reference unit from the Storefront API's [UnitPriceMeasurement object](/api/storefront/reference/products/unitpricemeasurement).
 */
export function UnitPrice(props) {
    const { data, measurement, as, ...passthroughProps } = props;
    if (!data) {
        console.warn(`No "data" prop was passed to <UnitPrice/>`);
        return null;
    }
    if (!measurement) {
        console.warn(`No "measurement" prop was passed to <UnitPrice/>`);
        return null;
    }
    const Wrapper = as !== null && as !== void 0 ? as : 'div';
    return (React.createElement(Wrapper, { ...passthroughProps },
        React.createElement(Money, { data: data }),
        "/",
        measurement.referenceUnit));
}
