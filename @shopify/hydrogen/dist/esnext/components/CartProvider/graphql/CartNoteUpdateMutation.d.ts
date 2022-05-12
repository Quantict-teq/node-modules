/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
import * as Types from '../../../storefront-api-types';
export declare type CartNoteUpdateMutationVariables = Types.Exact<{
    cartId: Types.Scalars['ID'];
    note?: Types.InputMaybe<Types.Scalars['String']>;
    numCartLines?: Types.InputMaybe<Types.Scalars['Int']>;
    country?: Types.InputMaybe<Types.CountryCode>;
}>;
export declare type CartNoteUpdateMutation = {
    __typename?: 'Mutation';
} & {
    cartNoteUpdate?: Types.Maybe<{
        __typename?: 'CartNoteUpdatePayload';
    } & {
        cart?: Types.Maybe<{
            __typename?: 'Cart';
        } & Pick<Types.Cart, 'id' | 'checkoutUrl' | 'note'> & {
            buyerIdentity: {
                __typename?: 'CartBuyerIdentity';
            } & Pick<Types.CartBuyerIdentity, 'countryCode' | 'email' | 'phone'> & {
                customer?: Types.Maybe<{
                    __typename?: 'Customer';
                } & Pick<Types.Customer, 'id' | 'email' | 'firstName' | 'lastName' | 'displayName'>>;
            };
            lines: {
                __typename?: 'CartLineConnection';
            } & {
                edges: Array<{
                    __typename?: 'CartLineEdge';
                } & {
                    node: {
                        __typename?: 'CartLine';
                    } & Pick<Types.CartLine, 'id' | 'quantity'> & {
                        attributes: Array<{
                            __typename?: 'Attribute';
                        } & Pick<Types.Attribute, 'key' | 'value'>>;
                        merchandise: {
                            __typename?: 'ProductVariant';
                        } & Pick<Types.ProductVariant, 'id' | 'availableForSale' | 'requiresShipping' | 'title'> & {
                            compareAtPriceV2?: Types.Maybe<{
                                __typename?: 'MoneyV2';
                            } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>>;
                            priceV2: {
                                __typename?: 'MoneyV2';
                            } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>;
                            image?: Types.Maybe<{
                                __typename?: 'Image';
                            } & Pick<Types.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>>;
                            product: {
                                __typename?: 'Product';
                            } & Pick<Types.Product, 'handle' | 'title'>;
                            selectedOptions: Array<{
                                __typename?: 'SelectedOption';
                            } & Pick<Types.SelectedOption, 'name' | 'value'>>;
                        };
                    };
                }>;
            };
            estimatedCost: {
                __typename?: 'CartEstimatedCost';
            } & {
                subtotalAmount: {
                    __typename?: 'MoneyV2';
                } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>;
                totalAmount: {
                    __typename?: 'MoneyV2';
                } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>;
                totalDutyAmount?: Types.Maybe<{
                    __typename?: 'MoneyV2';
                } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>>;
                totalTaxAmount?: Types.Maybe<{
                    __typename?: 'MoneyV2';
                } & Pick<Types.MoneyV2, 'currencyCode' | 'amount'>>;
            };
            attributes: Array<{
                __typename?: 'Attribute';
            } & Pick<Types.Attribute, 'key' | 'value'>>;
            discountCodes: Array<{
                __typename?: 'CartDiscountCode';
            } & Pick<Types.CartDiscountCode, 'code' | 'applicable'>>;
        }>;
    }>;
};