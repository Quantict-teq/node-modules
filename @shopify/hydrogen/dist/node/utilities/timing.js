"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTime = void 0;
/**
 * Not all environments have access to Performance.now(). This is to prevent
 * timing side channel attacks.
 *
 * See: https://community.cloudflare.com/t/cloudflare-workers-how-do-i-measure-execution-time-of-my-method/69672
 */
function getTime() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    else {
        return Date.now();
    }
}
exports.getTime = getTime;
