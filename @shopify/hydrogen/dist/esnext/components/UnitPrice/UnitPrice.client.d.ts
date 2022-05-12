import type { UnitPriceMeasurement, MoneyV2 } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export interface UnitPriceProps<TTag> {
    /** An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). */
    data: PartialDeep<MoneyV2>;
    /** A [UnitPriceMeasurement object](https://shopify.dev/api/storefront/reference/products/unitpricemeasurement). */
    measurement: PartialDeep<UnitPriceMeasurement>;
    /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
    as?: TTag;
}
/**
 * The `UnitPrice` component renders a string with a [UnitPrice](https://shopify.dev/themes/pricing-payments/unit-pricing) as the
 * Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) with a reference unit from the Storefront API's [UnitPriceMeasurement object](/api/storefront/reference/products/unitpricemeasurement).
 */
export declare function UnitPrice<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: JSX.IntrinsicElements[TTag] & UnitPriceProps<TTag>): JSX.Element | null;
