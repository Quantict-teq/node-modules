import type { IncomingMessage, NextFunction } from 'connect';
import type { ServerResponse } from 'http';
import type { ViteDevServer } from 'vite';
import type { ShopifyConfig } from '../types';
declare type HydrogenMiddlewareArgs = {
    dev?: boolean;
    shopifyConfig?: ShopifyConfig;
    indexTemplate: string | ((url: string) => Promise<string>);
    getServerEntrypoint: () => any;
    devServer?: ViteDevServer;
    cache?: Cache;
};
export declare function graphiqlMiddleware({ shopifyConfig, dev, }: {
    shopifyConfig: ShopifyConfig;
    dev: boolean;
}): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
/**
 * Provides middleware to Node.js Express-like servers. Used by the Hydrogen
 * Vite dev server plugin as well as production Node.js implementation.
 */
export declare function hydrogenMiddleware({ dev, cache, indexTemplate, getServerEntrypoint, devServer, }: HydrogenMiddlewareArgs): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
export {};
