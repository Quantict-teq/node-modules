import type { ReactNode } from 'react';
interface BuyNowButtonProps {
    /** The item quantity. Defaults to 1. */
    quantity?: number;
    /** The ID of the variant. */
    variantId: string;
    /** An array of cart line attributes that belong to the item being added to the cart. */
    attributes?: {
        key: string;
        value: string;
    }[];
    /** Any `ReactNode` elements. */
    children: ReactNode;
}
declare type PropsWeControl = 'onClick';
/** The `BuyNowButton` component renders a button that adds an item to the cart and redirects the customer to checkout. */
export declare function BuyNowButton(props: Omit<JSX.IntrinsicElements['button'], PropsWeControl> & BuyNowButtonProps): JSX.Element;
export {};
