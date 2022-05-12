import { useMemo } from 'react';
import { useShop } from '../../foundation/useShop';
/**
 * The `useMoney` hook takes a [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2) and returns a
 * default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by
 * [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).
 */
export function useMoney(money) {
    const { locale } = useShop();
    const options = useMemo(() => ({
        style: 'currency',
        currency: money.currencyCode,
    }), [money.currencyCode]);
    const amount = parseFloat(money.amount);
    const value = useMemo(() => new Intl.NumberFormat(locale, options).format(amount), [amount, locale, options]);
    const baseParts = new Intl.NumberFormat(locale, options).formatToParts(amount);
    const nameParts = new Intl.NumberFormat(locale, {
        ...options,
        currencyDisplay: 'name',
    }).formatToParts(amount);
    const narrowParts = new Intl.NumberFormat(locale, {
        ...options,
        currencyDisplay: 'narrowSymbol',
    }).formatToParts(amount);
    const moneyValue = useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        return ({
            currencyCode: money.currencyCode,
            currencyName: (_b = (_a = nameParts.find((part) => part.type === 'currency')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : money.currencyCode,
            currencySymbol: (_d = (_c = baseParts.find((part) => part.type === 'currency')) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : money.currencyCode,
            currencyNarrowSymbol: (_f = (_e = narrowParts.find((part) => part.type === 'currency')) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : '',
            parts: baseParts,
            localizedString: value,
            amount: baseParts
                .filter((part) => ['decimal', 'fraction', 'group', 'integer', 'literal'].includes(part.type))
                .map((part) => part.value)
                .join(''),
            original: money,
        });
    }, [baseParts, money, nameParts, narrowParts, value]);
    return moneyValue;
}
