import type { Metafield } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
/**
 * The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.
 */
export declare function parseMetafieldValue(metafield: PartialDeep<Metafield>): any;
