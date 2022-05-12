export interface RuntimeContext {
    waitUntil: (fn: Promise<any>) => void;
}
/**
 * Set a global runtime context for the current request.
 * This is used to encapsulate things like:
 * - `waitUntil()` to run promises after request has ended
 */
export declare function setContext(ctx?: RuntimeContext): void;
export declare function getContext(): RuntimeContext | undefined;
export declare function setCache(cache?: Cache): void;
export declare function getCache(): Cache | undefined;
export declare function runDelayedFunction(fn: () => Promise<any>): void | Promise<any>;
