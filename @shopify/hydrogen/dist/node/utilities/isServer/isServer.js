"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isServer = void 0;
const isClient_1 = require("../isClient");
/** The `isServer` utility is a function that returns a `boolean` indicating
 * if the code was run on the server.
 */
function isServer() {
    return !(0, isClient_1.isClient)();
}
exports.isServer = isServer;
