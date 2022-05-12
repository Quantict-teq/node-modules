"use strict";
/**
 * This file is used for compatibility between browser and server environments.
 * The browser loads this file as is, without leaking server logic.
 * In the server, this file is transformed by Vite to inject server logic.
 * NOTE: Do not remove SSR-prefixed comments in this file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvContext = exports.META_ENV_SSR = void 0;
const react_1 = require("react");
//@SSR import {useServerRequest} from './ServerRequestProvider';
// This is replaced by Vite to import.meta.env.SSR
exports.META_ENV_SSR = false;
const reactContextType = Symbol.for('react.context');
/**
 * Isomorphic hook to access context data. It gives access to the current request
 * when running on the server, and returns the provided client fallback in the browser.
 * This can be used in server components (RSC) as a Context/Provider replacement. In client
 * components, it uses the server getter in SSR and the client fallback in the browser.
 * @param serverGetter - A function that gets the current server request and returns any
 * desired request property. It only runs in the server (both in RSC and SSR).
 * @param clientFallback - An optional raw value or a React.Context to be consumed that will be
 * returned if the current environment is not the server. Note that, if this is a React.Context,
 * there must be a React.Provider parent in the app tree.
 * @returns A value retrieved from the current server request or a fallback value in the client.
 * The returned type depends on what the server getter returns.
 * @example
 * ```js
 * import {MyClientContext} from './my-client-react-context-provider';
 * useEnvContext(req => req.ctx.myServerContext, MyClientContext)
 * ```
 */
function useEnvContext(serverGetter, clientFallback) {
    //@SSR if (META_ENV_SSR) return serverGetter(useServerRequest());
    return clientFallback && clientFallback.$$typeof === reactContextType
        ? (0, react_1.useContext)(clientFallback)
        : clientFallback;
}
exports.useEnvContext = useEnvContext;
