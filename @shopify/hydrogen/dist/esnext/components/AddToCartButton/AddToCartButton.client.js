import React, { useEffect, useState } from 'react';
import { useCart } from '../CartProvider';
import { useProduct } from '../ProductProvider';
/**
 * The `AddToCartButton` component renders a button that adds an item to the cart when pressed.
 * It must be a descendent of the `CartProvider` component.
 */
export function AddToCartButton(props) {
    var _a, _b;
    const [addingItem, setAddingItem] = useState(false);
    const { variantId: explicitVariantId, quantity = 1, attributes, children, accessibleAddingToCartLabel, ...passthroughProps } = props;
    const { status, linesAdd } = useCart();
    const product = useProduct();
    const variantId = (_b = explicitVariantId !== null && explicitVariantId !== void 0 ? explicitVariantId : (_a = product === null || product === void 0 ? void 0 : product.selectedVariant) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '';
    const disabled = explicitVariantId === null ||
        variantId === '' ||
        (product === null || product === void 0 ? void 0 : product.selectedVariant) === null ||
        addingItem ||
        passthroughProps.disabled;
    useEffect(() => {
        if (addingItem && status === 'idle') {
            setAddingItem(false);
        }
    }, [status, addingItem]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { ...passthroughProps, disabled: disabled, onClick: () => {
                setAddingItem(true);
                linesAdd([
                    {
                        quantity: quantity,
                        merchandiseId: variantId,
                        attributes: attributes,
                    },
                ]);
            } }, children),
        accessibleAddingToCartLabel ? (React.createElement("p", { style: {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
            }, role: "alert", "aria-live": "assertive" }, addingItem ? accessibleAddingToCartLabel : null)) : null));
}
