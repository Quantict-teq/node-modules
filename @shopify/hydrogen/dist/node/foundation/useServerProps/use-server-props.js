"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInternalServerProps = exports.useServerProps = void 0;
const react_1 = require("react");
const ServerPropsProvider_1 = require("../ServerPropsProvider/ServerPropsProvider");
/**
 * The `useServerProps` hook allows you to manage the [server props](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props) passed to your server components when using Hydrogen as a React Server Component framework. The server props get cleared when you navigate from one route to another.
 *
 * ## Return value
 *
 * The `useServerProps` hook returns an object with the following keys:
 *
 * | Key              | Description                                                                            |
 * | ---------------- | -------------------------------------------------------------------------------------- |
 * | `serverProps`    | The current server props.                                                              |
 * | `setServerProps` | A function used to modify server props.                                                |
 * | `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |
 *
 */
function useServerProps() {
    const internalServerPropsContext = (0, react_1.useContext)(ServerPropsProvider_1.ServerPropsContext);
    if (!internalServerPropsContext) {
        return {};
    }
    return {
        serverProps: internalServerPropsContext.serverProps,
        setServerProps: internalServerPropsContext.setServerProps,
        pending: internalServerPropsContext.pending,
    };
}
exports.useServerProps = useServerProps;
/**
 * Internal-only hook to manage server state, including to set location server state
 * @internal
 */
function useInternalServerProps() {
    var _a;
    return ((_a = (0, react_1.useContext)(ServerPropsProvider_1.ServerPropsContext)) !== null && _a !== void 0 ? _a : {});
}
exports.useInternalServerProps = useInternalServerProps;
