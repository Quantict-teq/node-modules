import React from 'react';
import { useCart } from '../CartProvider';
import { Money } from '../Money';
/**
 * The `CartEstimatedCost` component renders a `Money` component with the
 * cost associated with the `amountType` prop. If no `amountType` prop is specified, then it defaults to `totalAmount`.
 * If `children` is a function, then it will pass down the render props provided by the parent component.
 */
export function CartEstimatedCost(props) {
    const { estimatedCost } = useCart();
    const { amountType = 'total', children, ...passthroughProps } = props;
    let amount;
    if (amountType == 'total') {
        amount = estimatedCost === null || estimatedCost === void 0 ? void 0 : estimatedCost.totalAmount;
    }
    else if (amountType == 'subtotal') {
        amount = estimatedCost === null || estimatedCost === void 0 ? void 0 : estimatedCost.subtotalAmount;
    }
    else if (amountType == 'tax') {
        amount = estimatedCost === null || estimatedCost === void 0 ? void 0 : estimatedCost.totalTaxAmount;
    }
    else if (amountType == 'duty') {
        amount = estimatedCost === null || estimatedCost === void 0 ? void 0 : estimatedCost.totalDutyAmount;
    }
    if (amount == null) {
        return null;
    }
    return (React.createElement(Money, { ...passthroughProps, data: amount }, children));
}
