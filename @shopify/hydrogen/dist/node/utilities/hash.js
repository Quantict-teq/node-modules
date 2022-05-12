"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashKey = void 0;
function hashKey(key) {
    const rawKey = key instanceof Array ? key : [key];
    /**
     * TODO: Smarter hash
     */
    return rawKey.map((k) => JSON.stringify(k)).join('');
}
exports.hashKey = hashKey;
