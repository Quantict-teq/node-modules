/**
 * The `useProduct` hook returns the product object of the nearest `ProductProvider`. It must be a descendent of
 * a `ProductProvider` component.
 */
export declare function useProduct(): {
    description?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    __typename?: "Product" | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    availableForSale?: boolean | undefined;
    handle?: string | undefined;
    metafield?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Metafield> | null | undefined;
    onlineStoreUrl?: import("../../storefront-api-types").Maybe<string> | undefined;
    compareAtPriceRange?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductPriceRange> | undefined;
    descriptionHtml?: string | undefined;
    featuredImage?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Image> | null | undefined;
    priceRange?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductPriceRange> | undefined;
    productType?: string | undefined;
    publishedAt?: string | undefined;
    requiresSellingPlan?: boolean | undefined;
    seo?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Seo> | undefined;
    tags?: (string | undefined)[] | undefined;
    totalInventory?: import("../../storefront-api-types").Maybe<number> | undefined;
    variantBySelectedOptions?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductVariant> | null | undefined;
    vendor?: string | undefined;
    media?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Video> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ExternalVideo> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").Model3d> | import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").MediaImage> | undefined;
    mediaConnection?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").MediaConnection> | undefined;
    metafields?: (import("type-fest/source/partial-deep").PartialObjectDeep<import("../../types").ParsedMetafield> | undefined)[] | undefined;
    metafieldsConnection?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").MetafieldConnection> | undefined;
    images?: (import("type-fest/source/partial-deep").PartialObjectDeep<Partial<import("../../storefront-api-types").Image>> | undefined)[] | undefined;
    imagesConnection?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ImageConnection> | undefined;
    collections?: (import("type-fest/source/partial-deep").PartialObjectDeep<Partial<import("../../storefront-api-types").Collection>> | undefined)[] | undefined;
    collectionsConnection?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").CollectionConnection> | undefined;
    variants?: (import("type-fest/source/partial-deep").PartialObjectDeep<Partial<import("../../storefront-api-types").ProductVariant>> | undefined)[] | undefined;
    variantsConnection?: import("type-fest/source/partial-deep").PartialObjectDeep<import("../../storefront-api-types").ProductVariantConnection> | undefined;
    options?: import("../useProductOptions").OptionWithValues[] | undefined;
    selectedVariant?: import("../../storefront-api-types").ProductVariant | null | undefined;
    setSelectedVariant?: import("../useProductOptions").SelectVariantCallback | undefined;
    selectedOptions?: import("../useProductOptions").SelectedOptions | undefined;
    setSelectedOption?: import("../useProductOptions").SelectOptionCallback | undefined;
    setSelectedOptions?: import("../useProductOptions").SelectOptionsCallback | undefined;
    isOptionInStock?: import("../useProductOptions").OptionsInStockCallback | undefined;
    setSelectedSellingPlan?: import("../useProductOptions").SelectedSellingPlanCallback | undefined;
    selectedSellingPlan?: import("../../storefront-api-types").SellingPlan | undefined;
    selectedSellingPlanAllocation?: import("../../storefront-api-types").SellingPlanAllocation | undefined;
    sellingPlanGroups?: (Omit<import("../../storefront-api-types").SellingPlanGroup, "sellingPlans"> & {
        sellingPlans: import("../../storefront-api-types").SellingPlan[];
    })[] | undefined;
    sellingPlanGroupsConnection?: import("../../storefront-api-types").SellingPlanConnection | undefined;
};
