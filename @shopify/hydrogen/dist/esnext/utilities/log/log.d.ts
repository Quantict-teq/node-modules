import { ServerComponentRequest } from '../../framework/Hydration/ServerComponentRequest.server';
export interface Logger {
    trace: (...args: Array<any>) => void;
    debug: (...args: Array<any>) => void;
    warn: (...args: Array<any>) => void;
    error: (...args: Array<any>) => void;
    fatal: (...args: Array<any>) => void;
    options: () => LoggerOptions;
}
export declare type LoggerOptions = {
    showCacheControlHeader?: boolean;
    showCacheApiStatus?: boolean;
    showQueryTiming?: boolean;
    showUnusedQueryProperties?: boolean;
};
export declare type RenderType = 'str' | 'rsc' | 'ssr' | 'api';
export declare const log: Logger;
export declare function getLoggerWithContext(context?: any): Logger;
export declare function setLogger(newLogger: Logger): void;
export declare function setLoggerOptions(options: LoggerOptions): void;
export declare function resetLogger(): void;
export declare function logServerResponse(type: RenderType, request: ServerComponentRequest, responseStatus: number): void;
