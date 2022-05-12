import React from 'react';
import { Money } from '../Money';
export interface CartEstimatedCostProps {
    /** A string type that defines the type of cost needed. Valid values: `total`, `subtotal`, `tax`, or `duty`. */
    amountType?: 'total' | 'subtotal' | 'tax' | 'duty';
    /** A function that takes an object return by the `useMoney` hook and returns a `ReactNode`. */
    children?: React.ReactNode;
}
/**
 * The `CartEstimatedCost` component renders a `Money` component with the
 * cost associated with the `amountType` prop. If no `amountType` prop is specified, then it defaults to `totalAmount`.
 * If `children` is a function, then it will pass down the render props provided by the parent component.
 */
export declare function CartEstimatedCost<TTag extends keyof JSX.IntrinsicElements>(props: Omit<React.ComponentProps<typeof Money>, 'data'> & CartEstimatedCostProps): JSX.Element | null;
