import type { MetafieldConnection } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
/**
 * The `useParsedMetafields` hook transforms a [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection)
 * in an array of metafields whose `values` have been parsed according to the metafield `type`.
 */
export declare function useParsedMetafields(
/** A [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection). */
metafields?: PartialDeep<MetafieldConnection>): {
    value: any;
    id?: string | undefined;
    __typename?: "Metafield" | undefined;
    createdAt?: string | undefined;
    description?: import("../../storefront-api-types").Maybe<string> | undefined;
    key?: string | undefined;
    namespace?: string | undefined;
    parentResource?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductVariant> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Product> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Blog> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Article> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Customer> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Order> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Collection> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Page> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Shop> | undefined;
    reference?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Video> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").MediaImage> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductVariant> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Product> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Page> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").GenericFile> | null | undefined;
    type?: string | undefined;
    updatedAt?: string | undefined;
}[];
