import type { MoneyV2 } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
interface MoneyProps<TTag> {
    /** An HTML tag to be rendered as the base element wrapper. The default is `div`. */
    as?: TTag;
    /** An object with fields that correspond to the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2). */
    data: PartialDeep<MoneyV2>;
}
/**
 * The `Money` component renders a string of the Storefront API's
 * [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) according to the
 * `defaultLocale` in the `shopify.config.js` file.
 */
export declare function Money<TTag extends keyof JSX.IntrinsicElements = 'div'>(props: JSX.IntrinsicElements[TTag] & MoneyProps<TTag>): JSX.Element;
export {};
