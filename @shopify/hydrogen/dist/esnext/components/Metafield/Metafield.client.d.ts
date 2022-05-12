import { ElementType } from 'react';
import { Props } from '../types';
import { ParsedMetafield } from '../../types';
export interface MetafieldProps<TTag> {
    /** An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). */
    data: ParsedMetafield;
    /** An HTML tag to be rendered as the base element wrapper. The default value varies depending on [metafield.type](https://shopify.dev/apps/metafields/types). */
    as?: TTag;
}
/**
 * The `Metafield` component renders the value of a Storefront
 * API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).
 *
 * When a render function is provided, it passes the Metafield object with a value
 * that was parsed according to the Metafield's `type` field. For more information,
 * refer to the [Render props](#render-props) section.
 *
 * When no render function is provided, it renders a smart default of the
 * Metafield's `value`. For more information, refer to the [Default output](#default-output) section.
 */
export declare function Metafield<TTag extends ElementType>(props: Props<TTag> & MetafieldProps<TTag>): JSX.Element | null;
