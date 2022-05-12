import { ServerComponentRequest } from '../../framework/Hydration/ServerComponentRequest.server';
import { ServerComponentResponse } from '../../framework/Hydration/ServerComponentResponse.server';
import { QueryKey } from '../../types';
import type { RenderType } from './log';
export declare type QueryCacheControlHeaders = {
    name: string;
    header: string | null;
};
export declare function collectQueryCacheControlHeaders(request: ServerComponentRequest, queryKey: QueryKey, cacheControlHeader: string | null): void;
export declare function logCacheControlHeaders(type: RenderType, request: ServerComponentRequest, response?: ServerComponentResponse): void;
