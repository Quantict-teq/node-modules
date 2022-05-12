import React, { useEffect, useCallback, useReducer, useMemo, useRef, } from 'react';
import { flattenConnection } from '../../utilities';
import { CartLineAdd, CartCreate, CartLineRemove, CartLineUpdate, CartNoteUpdate, CartBuyerIdentityUpdate, CartAttributesUpdate, CartDiscountCodesUpdate, CartQuery, } from './cart-queries';
import { useCartFetch } from './hooks';
import { CartContext } from './context';
import { CART_ID_STORAGE_KEY } from './constants';
import { useServerProps } from '../../foundation/useServerProps';
import { ClientAnalytics } from '../../foundation/Analytics';
function cartReducer(state, action) {
    switch (action.type) {
        case 'cartFetch': {
            if (state.status === 'uninitialized') {
                return {
                    status: 'fetching',
                };
            }
            break;
        }
        case 'cartCreate': {
            if (state.status === 'uninitialized') {
                return {
                    status: 'creating',
                };
            }
            break;
        }
        case 'resolve': {
            const resolvableStatuses = ['updating', 'fetching', 'creating'];
            if (resolvableStatuses.includes(state.status)) {
                return {
                    status: 'idle',
                    cart: action.cart,
                };
            }
            break;
        }
        case 'reject': {
            if (state.status === 'fetching' || state.status === 'creating') {
                return { status: 'uninitialized', error: action.error };
            }
            else if (state.status === 'updating') {
                return {
                    status: 'idle',
                    cart: state.lastValidCart,
                    error: action.error,
                };
            }
            break;
        }
        case 'resetCart': {
            if (state.status === 'fetching') {
                return { status: 'uninitialized' };
            }
            break;
        }
        case 'addLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'removeLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: {
                        ...state.cart,
                        lines: state.cart.lines.filter(({ id }) => !action.lines.includes(id)),
                    },
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'updateLineItem': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: {
                        ...state.cart,
                        lines: state.cart.lines.map((line) => {
                            const updatedLine = action.lines.find(({ id }) => id === line.id);
                            if (updatedLine && updatedLine.quantity) {
                                return {
                                    ...line,
                                    quantity: updatedLine.quantity,
                                };
                            }
                            return line;
                        }),
                    },
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'noteUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'buyerIdentityUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'cartAttributesUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
        case 'discountCodesUpdate': {
            if (state.status === 'idle') {
                return {
                    status: 'updating',
                    cart: state.cart,
                    lastValidCart: state.cart,
                };
            }
            break;
        }
    }
    throw new Error(`Cannot dispatch event (${action.type}) for current cart state (${state.status})`);
}
/**
 * The `CartProvider` component creates a context for using a cart. It creates a cart object and callbacks
 * that can be accessed by any descendent component using the `useCart` hook and related hooks. It also carries out
 * any callback props when a relevant action is performed. For example, if a `onLineAdd` callback is provided,
 * then the callback will be called when a new line item is successfully added to the cart.
 *
 * The `CartProvider` component must be a descendent of the `ShopifyProvider` component.
 * You must use this component if you want to use the `useCart` hook or related hooks, or if you would like to use the `AddToCartButton` component.
 */
export function CartProvider({ children, numCartLines, onCreate, onLineAdd, onLineRemove, onLineUpdate, onNoteUpdate, onBuyerIdentityUpdate, onAttributesUpdate, onDiscountCodesUpdate, data: cart, }) {
    var _a;
    const { serverProps } = useServerProps();
    const countryCode = (_a = serverProps === null || serverProps === void 0 ? void 0 : serverProps.country) === null || _a === void 0 ? void 0 : _a.isoCode;
    const initialStatus = cart
        ? { status: 'idle', cart: cartFromGraphQL(cart) }
        : { status: 'uninitialized' };
    const [state, dispatch] = useReducer((state, dispatch) => cartReducer(state, dispatch), initialStatus);
    const fetchCart = useCartFetch();
    const cartFetch = useCallback(async (cartId) => {
        dispatch({ type: 'cartFetch' });
        const { data } = await fetchCart({
            query: CartQuery,
            variables: {
                id: cartId,
                numCartLines,
                country: countryCode,
            },
        });
        if (!(data === null || data === void 0 ? void 0 : data.cart)) {
            window.localStorage.removeItem(CART_ID_STORAGE_KEY);
            dispatch({ type: 'resetCart' });
            return;
        }
        dispatch({ type: 'resolve', cart: cartFromGraphQL(data.cart) });
    }, [fetchCart, numCartLines, countryCode]);
    const cartCreate = useCallback(async (cart) => {
        var _a, _b;
        dispatch({ type: 'cartCreate' });
        onCreate === null || onCreate === void 0 ? void 0 : onCreate();
        if (countryCode && !((_a = cart.buyerIdentity) === null || _a === void 0 ? void 0 : _a.countryCode)) {
            if (cart.buyerIdentity == null) {
                cart.buyerIdentity = {};
            }
            cart.buyerIdentity.countryCode = countryCode;
        }
        const { data, error } = await fetchCart({
            query: CartCreate,
            variables: {
                input: cart,
                numCartLines,
                country: countryCode,
            },
        });
        if (error) {
            dispatch({
                type: 'reject',
                error: error,
            });
        }
        if ((_b = data === null || data === void 0 ? void 0 : data.cartCreate) === null || _b === void 0 ? void 0 : _b.cart) {
            if (cart.lines) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
                    addedCartLines: cart.lines,
                    cart: data.cartCreate.cart,
                });
            }
            dispatch({
                type: 'resolve',
                cart: cartFromGraphQL(data.cartCreate.cart),
            });
            window.localStorage.setItem(CART_ID_STORAGE_KEY, data.cartCreate.cart.id);
        }
    }, [onCreate, fetchCart, numCartLines, countryCode]);
    const addLineItem = useCallback(async (lines, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'addLineItem' });
            onLineAdd === null || onLineAdd === void 0 ? void 0 : onLineAdd();
            const { data, error } = await fetchCart({
                query: CartLineAdd,
                variables: {
                    cartId: state.cart.id,
                    lines: lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartLinesAdd) === null || _a === void 0 ? void 0 : _a.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.ADD_TO_CART, true, {
                    addedCartLines: lines,
                    cart: data.cartLinesAdd.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesAdd.cart),
                });
            }
        }
    }, [fetchCart, numCartLines, onLineAdd, countryCode]);
    const removeLineItem = useCallback(async (lines, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'removeLineItem', lines });
            onLineRemove === null || onLineRemove === void 0 ? void 0 : onLineRemove();
            const { data, error } = await fetchCart({
                query: CartLineRemove,
                variables: {
                    cartId: state.cart.id,
                    lines: lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartLinesRemove) === null || _a === void 0 ? void 0 : _a.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.REMOVE_FROM_CART, true, {
                    removedCartLines: lines,
                    cart: data.cartLinesRemove.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesRemove.cart),
                });
            }
        }
    }, [fetchCart, onLineRemove, numCartLines, countryCode]);
    const updateLineItem = useCallback(async (lines, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'updateLineItem', lines });
            onLineUpdate === null || onLineUpdate === void 0 ? void 0 : onLineUpdate();
            const { data, error } = await fetchCart({
                query: CartLineUpdate,
                variables: {
                    cartId: state.cart.id,
                    lines: lines,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartLinesUpdate) === null || _a === void 0 ? void 0 : _a.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.UPDATE_CART, true, {
                    updatedCartLines: lines,
                    oldCart: state.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartLinesUpdate.cart),
                });
            }
        }
    }, [fetchCart, onLineUpdate, numCartLines, countryCode]);
    const noteUpdate = useCallback(async (note, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'noteUpdate' });
            onNoteUpdate === null || onNoteUpdate === void 0 ? void 0 : onNoteUpdate();
            const { data, error } = await fetchCart({
                query: CartNoteUpdate,
                variables: {
                    cartId: state.cart.id,
                    note: note,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartNoteUpdate) === null || _a === void 0 ? void 0 : _a.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartNoteUpdate.cart),
                });
            }
        }
    }, [fetchCart, onNoteUpdate, numCartLines, countryCode]);
    const buyerIdentityUpdate = useCallback(async (buyerIdentity, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'buyerIdentityUpdate' });
            onBuyerIdentityUpdate === null || onBuyerIdentityUpdate === void 0 ? void 0 : onBuyerIdentityUpdate();
            const { data, error } = await fetchCart({
                query: CartBuyerIdentityUpdate,
                variables: {
                    cartId: state.cart.id,
                    buyerIdentity,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartBuyerIdentityUpdate) === null || _a === void 0 ? void 0 : _a.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartBuyerIdentityUpdate.cart),
                });
            }
        }
    }, [fetchCart, onBuyerIdentityUpdate, numCartLines, countryCode]);
    const cartAttributesUpdate = useCallback(async (attributes, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'cartAttributesUpdate' });
            onAttributesUpdate === null || onAttributesUpdate === void 0 ? void 0 : onAttributesUpdate();
            const { data, error } = await fetchCart({
                query: CartAttributesUpdate,
                variables: {
                    cartId: state.cart.id,
                    attributes: attributes,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartAttributesUpdate) === null || _a === void 0 ? void 0 : _a.cart) {
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartAttributesUpdate.cart),
                });
            }
        }
    }, [fetchCart, onAttributesUpdate, numCartLines, countryCode]);
    const discountCodesUpdate = useCallback(async (discountCodes, state) => {
        var _a;
        if (state.status === 'idle') {
            dispatch({ type: 'discountCodesUpdate' });
            onDiscountCodesUpdate === null || onDiscountCodesUpdate === void 0 ? void 0 : onDiscountCodesUpdate();
            const { data, error } = await fetchCart({
                query: CartDiscountCodesUpdate,
                variables: {
                    cartId: state.cart.id,
                    discountCodes: discountCodes,
                    numCartLines,
                    country: countryCode,
                },
            });
            if (error) {
                dispatch({
                    type: 'reject',
                    error: error,
                });
            }
            if ((_a = data === null || data === void 0 ? void 0 : data.cartDiscountCodesUpdate) === null || _a === void 0 ? void 0 : _a.cart) {
                ClientAnalytics.publish(ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED, true, {
                    updatedDiscountCodes: discountCodes,
                    cart: data.cartDiscountCodesUpdate.cart,
                });
                dispatch({
                    type: 'resolve',
                    cart: cartFromGraphQL(data.cartDiscountCodesUpdate.cart),
                });
            }
        }
    }, [fetchCart, onDiscountCodesUpdate, numCartLines, countryCode]);
    const didFetchCart = useRef(false);
    useEffect(() => {
        if (localStorage.getItem(CART_ID_STORAGE_KEY) &&
            state.status === 'uninitialized' &&
            !didFetchCart.current) {
            didFetchCart.current = true;
            cartFetch(localStorage.getItem(CART_ID_STORAGE_KEY));
        }
    }, [cartFetch, state]);
    useEffect(() => {
        if (state.status !== 'idle') {
            return;
        }
        buyerIdentityUpdate({ countryCode }, state);
    }, [countryCode]);
    const cartContextValue = useMemo(() => {
        return {
            ...('cart' in state
                ? state.cart
                : {
                    lines: [],
                    attributes: [],
                    ...(cart ? cartFromGraphQL(cart) : {}),
                }),
            status: state.status,
            error: 'error' in state ? state.error : undefined,
            totalQuantity: 'cart' in state
                ? state.cart.lines.reduce((previous, current) => {
                    return previous + current.quantity;
                }, 0)
                : 0,
            cartCreate,
            linesAdd(lines) {
                if ('cart' in state && state.cart.id) {
                    addLineItem(lines, state);
                }
                else {
                    cartCreate({ lines });
                }
            },
            linesRemove(lines) {
                removeLineItem(lines, state);
            },
            linesUpdate(lines) {
                updateLineItem(lines, state);
            },
            noteUpdate(note) {
                noteUpdate(note, state);
            },
            buyerIdentityUpdate(buyerIdentity) {
                buyerIdentityUpdate(buyerIdentity, state);
            },
            cartAttributesUpdate(attributes) {
                cartAttributesUpdate(attributes, state);
            },
            discountCodesUpdate(discountCodes) {
                discountCodesUpdate(discountCodes, state);
            },
        };
    }, [
        state,
        cart,
        cartCreate,
        addLineItem,
        removeLineItem,
        updateLineItem,
        noteUpdate,
        buyerIdentityUpdate,
        cartAttributesUpdate,
        discountCodesUpdate,
    ]);
    return (React.createElement(CartContext.Provider, { value: cartContextValue }, children));
}
function cartFromGraphQL(cart) {
    var _a;
    return {
        ...cart,
        // @ts-expect-error While the cart still uses fragments, there will be a TS error here until we remove those fragments and get the type in-line
        lines: flattenConnection(cart.lines),
        note: (_a = cart.note) !== null && _a !== void 0 ? _a : undefined,
    };
}
