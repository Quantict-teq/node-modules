import { useMemo } from 'react';
import { flattenConnection, parseMetafieldValue } from '../../utilities';
/**
 * The `useParsedMetafields` hook transforms a [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection)
 * in an array of metafields whose `values` have been parsed according to the metafield `type`.
 */
export function useParsedMetafields(
/** A [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection). */
metafields) {
    return useMemo(() => {
        if (!metafields) {
            throw new Error(`'useParsedMetafields' needs metafields`);
        }
        return flattenConnection(metafields).map((metafield) => {
            return {
                ...metafield,
                value: parseMetafieldValue(metafield),
            };
        });
    }, [metafields]);
}
