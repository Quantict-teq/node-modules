"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClient = void 0;
/** The `isClient` utility is a function that returns a boolean indicating
 * if the code was run on the client.
 */
function isClient() {
    return typeof window !== 'undefined';
}
exports.isClient = isClient;
