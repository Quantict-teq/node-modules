import { Plugin } from 'vite';
import type { HydrogenVitePluginOptions, ShopifyConfig } from '../../types';
export declare const HYDROGEN_DEFAULT_SERVER_ENTRY = "/src/App.server";
declare const _default: (shopifyConfig: ShopifyConfig, pluginOptions: HydrogenVitePluginOptions) => Plugin;
export default _default;
declare global {
    var Oxygen: {
        env: any;
        [key: string]: any;
    };
}
