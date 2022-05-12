/// <reference types="node" />
import type { ServerHandlerConfig } from './types';
import type { ServerResponse, IncomingMessage } from 'http';
import { RuntimeContext } from './framework/runtime';
declare global {
    var __WORKER__: boolean;
}
interface RequestHandlerOptions {
    indexTemplate: string | ((url: string) => Promise<string | {
        default: string;
    }>);
    cache?: Cache;
    streamableResponse?: ServerResponse;
    dev?: boolean;
    context?: RuntimeContext;
    nonce?: string;
    buyerIpHeader?: string;
}
export interface RequestHandler {
    (request: Request | IncomingMessage, options: RequestHandlerOptions): Promise<Response | undefined>;
}
export declare const renderHydrogen: (App: any, { shopifyConfig, routes, serverAnalyticsConnectors, session, }: ServerHandlerConfig) => RequestHandler;
export default renderHydrogen;
