/**
 * The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
 * It must be a descendent of a `LocalizationProvider` component.
 */
export declare function useCountry(): (({
    __typename?: "Country" | undefined;
} & Pick<import("../../storefront-api-types").Country, "name" | "isoCode"> & {
    currency: {
        __typename?: "Currency" | undefined;
    } & Pick<import("../../storefront-api-types").Currency, "isoCode">;
}) | ((country: {
    __typename?: "Country" | undefined;
} & Pick<import("../../storefront-api-types").Country, "name" | "isoCode"> & {
    currency: {
        __typename?: "Currency" | undefined;
    } & Pick<import("../../storefront-api-types").Currency, "isoCode">;
}) => void) | undefined)[];
