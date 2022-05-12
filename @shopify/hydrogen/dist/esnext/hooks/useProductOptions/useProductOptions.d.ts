import { ProductOptionsHookValue } from './types';
import type { ProductVariantConnection, SellingPlanGroupConnection, ProductVariant as ProductVariantType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
/**
 * The `useProductOptions` hook returns an object that enables you to keep track of the
 * selected variant and/or selling plan state, as well as callbacks for modifying the state.
 */
export declare function useProductOptions({ variants: variantsConnection, sellingPlanGroups: sellingPlanGroupsConnection, initialVariantId: explicitVariantId, }: {
    /** The product's `VariantConnection`. */
    variants?: PartialDeep<ProductVariantConnection>;
    /** The product's `SellingPlanGroups`. */
    sellingPlanGroups?: PartialDeep<SellingPlanGroupConnection>;
    /** The initially selected variant. */
    initialVariantId?: ProductVariantType['id'] | null;
}): ProductOptionsHookValue;
