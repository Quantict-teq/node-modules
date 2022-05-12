"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHookName = exports.isHook = exports.isClientComponent = exports.isServerComponent = void 0;
const path_1 = require("path");
const types_1 = require("@typescript-eslint/types");
var ReactComponentType;
(function (ReactComponentType) {
    ReactComponentType["Server"] = "server";
    ReactComponentType["Client"] = "client";
})(ReactComponentType || (ReactComponentType = {}));
function isServerComponent(filename) {
    const type = getReactComponentTypeFromFilename(filename);
    return type === ReactComponentType.Server;
}
exports.isServerComponent = isServerComponent;
function isClientComponent(filename) {
    const type = getReactComponentTypeFromFilename(filename);
    return type === ReactComponentType.Client;
}
exports.isClientComponent = isClientComponent;
function isHook(node) {
    if (node.callee.type === types_1.AST_NODE_TYPES.Identifier) {
        return isHookName(node.callee.name);
    }
    else if (node.callee.type === types_1.AST_NODE_TYPES.MemberExpression &&
        !node.callee.computed &&
        node.callee.property.type === types_1.AST_NODE_TYPES.Identifier &&
        isHookName(node.callee.property.name)) {
        const objectNode = node.callee.object;
        return (objectNode.type === types_1.AST_NODE_TYPES.Identifier &&
            objectNode.name === 'React');
    }
    else {
        return false;
    }
}
exports.isHook = isHook;
function getHookName(node) {
    if (node.callee.type === types_1.AST_NODE_TYPES.Identifier) {
        return node.callee.name;
    }
    if (node.callee.type === types_1.AST_NODE_TYPES.MemberExpression &&
        node.callee.property.type === types_1.AST_NODE_TYPES.Identifier) {
        return node.callee.property.name;
    }
    return '';
}
exports.getHookName = getHookName;
function getReactComponentTypeFromFilename(filename) {
    const ext = (0, path_1.extname)((0, path_1.basename)(filename, (0, path_1.extname)(filename)));
    return ext.slice(1);
}
function isHookName(str) {
    return /^use[A-Z0-9].*$/.test(str);
}
