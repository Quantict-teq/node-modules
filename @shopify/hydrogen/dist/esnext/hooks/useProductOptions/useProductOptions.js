import { useCallback, useEffect, useMemo, useState } from 'react';
import { flattenConnection } from '../../utilities';
import { getOptions, getSelectedVariant } from './helpers';
/**
 * The `useProductOptions` hook returns an object that enables you to keep track of the
 * selected variant and/or selling plan state, as well as callbacks for modifying the state.
 */
export function useProductOptions({ variants: variantsConnection, sellingPlanGroups: sellingPlanGroupsConnection, initialVariantId: explicitVariantId, }) {
    // The flattened variants
    const variants = useMemo(() => (variantsConnection ? flattenConnection(variantsConnection) : []), [variantsConnection]);
    // All the options available for a product, based on all the variants
    const options = useMemo(() => getOptions(variants), [variants]);
    // TODO: we have some weird variable shadowing going on here that probably needs to be looked at. This variable is the same name as a prop
    const initialVariantId = explicitVariantId === null
        ? explicitVariantId
        : variants.find((variant) => variant.id === explicitVariantId) ||
            variants.find((variant) => variant.availableForSale) ||
            variants[0];
    /**
     * Track the selectedVariant within the hook. If `initialVariantId`
     * is passed, use that as an initial value.
     */
    const [selectedVariant, setSelectedVariant] = useState(initialVariantId);
    /**
     * Track the selectedOptions within the hook. If a `initialVariantId`
     * is passed, use that to select initial options.
     */
    const [selectedOptions, setSelectedOptions] = useState((selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.selectedOptions)
        ? selectedVariant.selectedOptions.reduce((memo, optionSet) => {
            var _a, _b;
            memo[(_a = optionSet === null || optionSet === void 0 ? void 0 : optionSet.name) !== null && _a !== void 0 ? _a : ''] = (_b = optionSet === null || optionSet === void 0 ? void 0 : optionSet.value) !== null && _b !== void 0 ? _b : '';
            return memo;
        }, {})
        : {});
    /**
     * When the initialVariantId changes, we need to make sure we
     * update the selected variant and selected options. If not,
     * then the selected variant and options will reference incorrect
     * values.
     */
    useEffect(() => {
        setSelectedVariant(initialVariantId);
        const selectedOptions = (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.selectedOptions)
            ? selectedVariant.selectedOptions.reduce((memo, optionSet) => {
                var _a, _b;
                memo[(_a = optionSet === null || optionSet === void 0 ? void 0 : optionSet.name) !== null && _a !== void 0 ? _a : ''] = (_b = optionSet === null || optionSet === void 0 ? void 0 : optionSet.value) !== null && _b !== void 0 ? _b : '';
                return memo;
            }, {})
            : {};
        setSelectedOptions(selectedOptions);
    }, [initialVariantId, variants]);
    /**
     * Allow the developer to select an option.
     */
    const setSelectedOption = useCallback((name, value) => {
        const newSelectedOptions = {
            ...selectedOptions,
            [name]: value,
        };
        setSelectedOptions(newSelectedOptions);
    }, [selectedOptions]);
    useEffect(() => {
        /**
         * When selected options change, select the correct variant.
         */
        const variant = getSelectedVariant(variants, selectedOptions);
        if (variant) {
            setSelectedVariant(variant);
        }
    }, [variants, selectedOptions]);
    const isOptionInStock = useCallback((option, value) => {
        var _a;
        const proposedVariant = getSelectedVariant(variants, {
            ...selectedOptions,
            ...{ [option]: value },
        });
        return (_a = proposedVariant === null || proposedVariant === void 0 ? void 0 : proposedVariant.availableForSale) !== null && _a !== void 0 ? _a : true;
    }, [selectedOptions, variants]);
    const sellingPlanGroups = useMemo(() => sellingPlanGroupsConnection
        ? flattenConnection(sellingPlanGroupsConnection).map((sellingPlanGroup) => ({
            ...sellingPlanGroup,
            sellingPlans: (sellingPlanGroup === null || sellingPlanGroup === void 0 ? void 0 : sellingPlanGroup.sellingPlans)
                ? flattenConnection(sellingPlanGroup.sellingPlans)
                : [],
        }))
        : [], [sellingPlanGroupsConnection]);
    /**
     * Track the selectedSellingPlan within the hook. If `initialSellingPlanId`
     * is passed, use that as an initial value. Look it up from the `selectedVariant`, since
     * that is also a requirement.
     */
    const [selectedSellingPlan, setSelectedSellingPlan] = useState(undefined);
    const selectedSellingPlanAllocation = useMemo(() => {
        if (!selectedVariant || !selectedSellingPlan) {
            return;
        }
        if (!selectedVariant.sellingPlanAllocations) {
            throw new Error(`You must include sellingPlanAllocations in your variants in order to calculate selectedSellingPlanAllocation`);
        }
        return flattenConnection(selectedVariant.sellingPlanAllocations).find(
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        (allocation) => allocation.sellingPlan.id === selectedSellingPlan.id);
    }, [selectedVariant, selectedSellingPlan]);
    return {
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        variants,
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        variantsConnection,
        options,
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        selectedVariant,
        setSelectedVariant,
        selectedOptions,
        setSelectedOption,
        setSelectedOptions,
        isOptionInStock,
        selectedSellingPlan,
        setSelectedSellingPlan,
        selectedSellingPlanAllocation,
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        sellingPlanGroups,
        // @ts-ignore The types here are broken on main, need to come back and fix them sometime
        sellingPlanGroupsConnection,
    };
}
