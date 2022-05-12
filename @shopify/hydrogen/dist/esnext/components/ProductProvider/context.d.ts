import { ProductOptionsHookValue } from '../../hooks';
import { ParsedMetafield } from '../../types';
import type { Collection, Image, Product as ProductType, ProductVariant as ProductVariantType, MediaEdge as MediaEdgeType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export declare const ProductContext: import("react").Context<import("type-fest/source/partial-deep").PartialObjectDeep<Omit<ProductType, "media" | "options" | "metafields" | "variants" | "sellingPlanGroups" | "collections" | "images"> & {
    media?: import("../../storefront-api-types").ExternalVideo | import("../../storefront-api-types").MediaImage | import("../../storefront-api-types").Model3d | import("../../storefront-api-types").Video | undefined;
    mediaConnection?: import("../../storefront-api-types").MediaConnection | undefined;
    metafields?: ParsedMetafield[] | undefined;
    metafieldsConnection?: import("../../storefront-api-types").MetafieldConnection | undefined;
    images?: Partial<Image>[] | undefined;
    imagesConnection?: import("../../storefront-api-types").ImageConnection | undefined;
    collections?: Partial<Collection>[] | undefined;
    collectionsConnection?: import("../../storefront-api-types").CollectionConnection | undefined;
    variants?: Partial<ProductVariantType>[] | undefined;
    variantsConnection?: import("../../storefront-api-types").ProductVariantConnection | undefined;
}> | null>;
export declare type ProductContextType = PartialDeep<Omit<ProductType, 'media' | 'metafields' | 'images' | 'collections' | 'variants' | 'sellingPlanGroups' | 'options'> & {
    media?: MediaEdgeType['node'];
    mediaConnection?: ProductType['media'];
    metafields?: ParsedMetafield[];
    metafieldsConnection?: ProductType['metafields'];
    images?: Partial<Image>[];
    imagesConnection?: ProductType['images'];
    collections?: Partial<Collection>[];
    collectionsConnection?: ProductType['collections'];
    variants?: Partial<ProductVariantType>[];
    variantsConnection?: ProductType['variants'];
}>;
export declare const ProductOptionsContext: import("react").Context<ProductOptionsHookValue | null>;
