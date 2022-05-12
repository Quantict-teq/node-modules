export function getAllOptionValues(variants, option) {
    return Array.from(new Set(variants.map((variant) => variant.selectedOptions.find((selection) => selection.name == option)
        .value)));
}
export function getSelectedVariant(variants, choices) {
    var _a, _b;
    /**
     * Ensure the user has selected all the required options, not just some.
     */
    if (!variants.length ||
        ((_b = (_a = variants === null || variants === void 0 ? void 0 : variants[0]) === null || _a === void 0 ? void 0 : _a.selectedOptions) === null || _b === void 0 ? void 0 : _b.length) !== Object.keys(choices).length) {
        return;
    }
    return variants === null || variants === void 0 ? void 0 : variants.find((variant) => {
        return Object.entries(choices).every(([name, value]) => {
            var _a;
            return (_a = variant === null || variant === void 0 ? void 0 : variant.selectedOptions) === null || _a === void 0 ? void 0 : _a.some((option) => (option === null || option === void 0 ? void 0 : option.name) === name && (option === null || option === void 0 ? void 0 : option.value) === value);
        });
    });
}
export function getOptions(variants) {
    const map = variants.reduce((memo, variant) => {
        var _a;
        if (!variant.selectedOptions) {
            throw new Error(`getOptions requires 'variant.selectedOptions`);
        }
        (_a = variant === null || variant === void 0 ? void 0 : variant.selectedOptions) === null || _a === void 0 ? void 0 : _a.forEach((opt) => {
            var _a, _b, _c, _d;
            memo[(_a = opt === null || opt === void 0 ? void 0 : opt.name) !== null && _a !== void 0 ? _a : ''] = memo[(_b = opt === null || opt === void 0 ? void 0 : opt.name) !== null && _b !== void 0 ? _b : ''] || new Set();
            memo[(_c = opt === null || opt === void 0 ? void 0 : opt.name) !== null && _c !== void 0 ? _c : ''].add((_d = opt === null || opt === void 0 ? void 0 : opt.value) !== null && _d !== void 0 ? _d : '');
        });
        return memo;
    }, {});
    return Object.keys(map).map((option) => {
        return {
            name: option,
            values: Array.from(map[option]),
        };
    });
}
