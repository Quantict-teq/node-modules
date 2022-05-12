"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_plugin_hydrogen_config_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-config"));
const vite_plugin_hydrogen_middleware_1 = __importStar(require("./plugins/vite-plugin-hydrogen-middleware"));
const vite_plugin_hydrogen_client_middleware_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-client-middleware"));
const vite_plugin_platform_entry_1 = __importDefault(require("./plugins/vite-plugin-platform-entry"));
// @ts-ignore
const plugin_1 = __importDefault(require("@shopify/hydrogen/vendor/react-server-dom-vite/plugin"));
const vite_plugin_ssr_interop_1 = __importDefault(require("./plugins/vite-plugin-ssr-interop"));
const vite_plugin_purge_query_cache_1 = __importDefault(require("./plugins/vite-plugin-purge-query-cache"));
const vite_plugin_hydration_auto_import_1 = __importDefault(require("./plugins/vite-plugin-hydration-auto-import"));
const vite_plugin_inspect_1 = __importDefault(require("vite-plugin-inspect"));
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
const vite_plugin_css_modules_rsc_1 = __importDefault(require("./plugins/vite-plugin-css-modules-rsc"));
exports.default = (shopifyConfig, pluginOptions = {}) => {
    let hydrogenUiPath;
    try {
        hydrogenUiPath = path_1.default.join(
        // eslint-disable-next-line node/no-missing-require
        path_1.default.dirname(require.resolve('@shopify/hydrogen-ui/client')));
    }
    catch (error) {
        // hydrogen-ui isn't installed, so don't worry about it
    }
    return [
        process.env.VITE_INSPECT && (0, vite_plugin_inspect_1.default)(),
        (0, vite_plugin_hydrogen_config_1.default)(),
        (0, vite_plugin_hydrogen_client_middleware_1.default)(),
        (0, vite_plugin_hydrogen_middleware_1.default)(shopifyConfig, pluginOptions),
        (0, plugin_react_1.default)(),
        (0, vite_plugin_hydration_auto_import_1.default)(),
        (0, vite_plugin_ssr_interop_1.default)(),
        (0, vite_plugin_css_modules_rsc_1.default)(),
        (0, plugin_1.default)({
            clientComponentPaths: [
                path_1.default.join(path_1.default.dirname(require.resolve('@shopify/hydrogen/package.json'))),
                ...[hydrogenUiPath].filter(Boolean),
            ],
            isServerComponentImporterAllowed(importer, source) {
                // Always allow the entry server (e.g. App.server.jsx) to be imported
                // in other files such as worker.js or server.js.
                const entryServer = process.env.HYDROGEN_SERVER_ENTRY || vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY;
                return (source.includes(entryServer) ||
                    // TODO update this after handleEvent is replaced with handleRequest
                    /(handle-worker-event|index|entry-server)\.js/.test(importer) ||
                    // Support importing server components for testing
                    // TODO: revisit this when RSC splits into two bundles
                    /\.test\.[tj]sx?$/.test(importer));
            },
        }),
        (0, vite_plugin_platform_entry_1.default)(),
        pluginOptions.purgeQueryCacheOnBuild && (0, vite_plugin_purge_query_cache_1.default)(),
    ];
};
