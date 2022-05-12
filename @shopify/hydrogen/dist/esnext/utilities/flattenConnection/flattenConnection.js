/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 */
export function flattenConnection(connection) {
    return (connection.edges || []).map((edge) => {
        if (!(edge === null || edge === void 0 ? void 0 : edge.node)) {
            throw new Error('Connection edges must contain nodes');
        }
        return edge.node;
    });
}
