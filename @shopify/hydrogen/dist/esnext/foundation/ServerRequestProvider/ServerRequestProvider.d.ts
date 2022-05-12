import type { PreloadQueriesByURL, ServerComponentRequest } from '../../framework/Hydration/ServerComponentRequest.server';
import type { QueryKey } from '../../types';
declare type ServerRequestProviderProps = {
    isRSC: boolean;
    request: ServerComponentRequest;
    children: JSX.Element;
};
export declare function ServerRequestProvider({ isRSC, request, children, }: ServerRequestProviderProps): JSX.Element;
export declare function useServerRequest(): ServerComponentRequest;
declare type RequestCacheResult<T> = {
    data: T;
    error?: never;
} | {
    data?: never;
    error: Response;
};
/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export declare function useRequestCacheData<T>(key: QueryKey, fetcher: () => Promise<T>): RequestCacheResult<T>;
export declare function preloadRequestCacheData(request: ServerComponentRequest, preloadQueries?: PreloadQueriesByURL): void;
export {};
