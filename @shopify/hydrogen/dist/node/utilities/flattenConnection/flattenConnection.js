"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenConnection = void 0;
/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 */
function flattenConnection(connection) {
    return (connection.edges || []).map((edge) => {
        if (!(edge === null || edge === void 0 ? void 0 : edge.node)) {
            throw new Error('Connection edges must contain nodes');
        }
        return edge.node;
    });
}
exports.flattenConnection = flattenConnection;
