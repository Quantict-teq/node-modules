export const TIMEOUT_MS = 2000;
export function injectGraphQLTracker({ query, data, onUnusedData, }) {
    var _a;
    const info = convertQueryToResolveInfo(query);
    // E.g. ['shop.stuff.myString']
    const requestedFields = getFieldList(info.nodes, info.fragments);
    // Remove the last key of each path to avoid proxying primitive
    // values. Reverse order to avoid accessing already defined
    // proxies (i.e. handle child properties before parent properties)
    // E.g. `shop.stuff.myString` => `shop.stuff`
    const uniqueFieldPaths = [
        ...new Set(requestedFields.map((path) => path.split('.').slice(0, -1).join('.'))),
    ].reverse();
    const queryName = ((_a = findOperationDefinition(query).name) === null || _a === void 0 ? void 0 : _a.value) || '';
    // Record fields that are read in the proxy to compare later.
    const readFieldsMap = {};
    let isCheckedOnce = false;
    const checkFields = (check = onUnusedData) => {
        isCheckedOnce = true;
        const properties = requestedFields
            .filter((prop) => !readFieldsMap[prop] && !prop.endsWith('.__typename'))
            .map((prop) => prop.replace(/\.edges\./g, '.').replace(/\.node\./g, '.'));
        if (properties.length > 0) {
            return check({ queryName, properties });
        }
    };
    let readTimeout;
    uniqueFieldPaths.forEach((fieldPath) => deepTransform(data, 'data.' + fieldPath, (value) => {
        if (typeof value !== 'object' || value === null)
            return value;
        return new Proxy(value, {
            get(target, prop) {
                if (typeof prop === 'string') {
                    const fullPath = fieldPath + '.' + prop;
                    if (!readFieldsMap[fullPath]) {
                        readFieldsMap[fullPath] = true;
                        if (onUnusedData && !isCheckedOnce) {
                            clearTimeout(readTimeout);
                            readTimeout = setTimeout(checkFields, TIMEOUT_MS);
                        }
                    }
                }
                return target[prop];
            },
        });
    }));
    return checkFields;
}
function findOperationDefinition(query) {
    return query.definitions.find((def) => def.kind === 'OperationDefinition');
}
function convertQueryToResolveInfo(query) {
    var _a;
    return {
        // Root of the selection nodes
        nodes: (_a = findOperationDefinition(query)) === null || _a === void 0 ? void 0 : _a.selectionSet.selections,
        // Collection of all the fragments in this query
        fragments: query.definitions.reduce((acc, current) => {
            if (current.kind === 'FragmentDefinition') {
                acc[current.name.value] = current;
            }
            return acc;
        }, {}),
    };
}
/**
 * Extracts the selection fields from a query AST as a list of dot-separated paths.
 * @param selectionNodes - Selection nodes from the AST
 * @param fragments - Fragments from the AST
 * @param path - Accummulated path for recursion
 * @returns A plain JS array representing the selection fields
 */
function getFieldList(nodes, fragments = {}, path = '') {
    return nodes.reduce((acc, node) => {
        var _a, _b, _c, _d, _e;
        let nextPath = path;
        let nextNodes;
        if (node.kind === 'FragmentSpread') {
            nextNodes = fragments[node.name.value].selectionSet.selections;
        }
        else if (node.kind === 'InlineFragment') {
            nextNodes = (_a = node.selectionSet) === null || _a === void 0 ? void 0 : _a.selections;
        }
        else if (node.kind === 'Field') {
            nextNodes = (_b = node.selectionSet) === null || _b === void 0 ? void 0 : _b.selections;
            const name = (_d = (_c = node.alias) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : (_e = node.name) === null || _e === void 0 ? void 0 : _e.value;
            nextPath = path ? `${path}.${name}` : name;
            if (!nextNodes)
                acc.push(nextPath); // This is a leaf
        }
        if (nextNodes)
            acc.push(...getFieldList(nextNodes, fragments, nextPath));
        return acc;
    }, []);
}
/**
 * Transform a nested property in a given object (in place).
 * @param input - Object to transform
 * @param path - Dot-separated path to the nested property
 * @param valueTransform - Transformer function
 */
function deepTransform(input, path, valueTransform) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let obj = input;
    let key;
    for (let index = 0; !!obj && index < keys.length; index++) {
        key = keys[index];
        if (index === keys.length - 1) {
            // Last property, transform value
            obj[key] = valueTransform(obj[key]);
        }
        else if (Array.isArray(obj[key])) {
            // We've found an array in the middle, run this recursively
            const subKeys = keys.slice(index + 1);
            obj[key].forEach((v) => deepTransform(v, subKeys, valueTransform));
        }
        obj = obj[key];
    }
}
