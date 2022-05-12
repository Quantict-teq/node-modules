"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorefrontApiRequestHeaders = void 0;
const constants_1 = require("../constants");
function getStorefrontApiRequestHeaders({ buyerIp, storefrontToken, }) {
    var _a;
    const headers = {};
    const secretToken = typeof Oxygen !== 'undefined'
        ? (_a = Oxygen === null || Oxygen === void 0 ? void 0 : Oxygen.env) === null || _a === void 0 ? void 0 : _a[constants_1.OXYGEN_SECRET_TOKEN_ENVIRONMENT_VARIABLE]
        : null;
    /**
     * Only pass one type of storefront token at a time.
     */
    if (secretToken) {
        headers[constants_1.STOREFRONT_API_SECRET_TOKEN_HEADER] = secretToken;
    }
    else {
        headers[constants_1.STOREFRONT_API_PUBLIC_TOKEN_HEADER] = storefrontToken;
    }
    if (buyerIp) {
        headers[constants_1.STOREFRONT_API_BUYER_IP_HEADER] = buyerIp;
    }
    return headers;
}
exports.getStorefrontApiRequestHeaders = getStorefrontApiRequestHeaders;
