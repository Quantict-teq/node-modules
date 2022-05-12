import { ImportGlobEagerOutput, ShopifyConfig } from '../types';
import type { ServerComponentRequest } from '../framework/Hydration/ServerComponentRequest.server';
import type { ASTNode } from 'graphql';
import { SessionApi, SessionStorageAdapter } from '../foundation/session/session';
declare type RouteParams = Record<string, string>;
declare type RequestOptions = {
    params: RouteParams;
    queryShop: (args: QueryShopArgs) => Promise<any>;
    session: SessionApi | null;
};
declare type ResourceGetter = (request: Request, requestOptions: RequestOptions) => Promise<Response | Object | String>;
interface HydrogenApiRoute {
    path: string;
    resource: ResourceGetter;
    hasServerComponent: boolean;
}
export declare type ApiRouteMatch = {
    resource: ResourceGetter;
    hasServerComponent: boolean;
    params: RouteParams;
};
export declare function extractPathFromRoutesKey(routesKey: string, dirPrefix: string): string;
export declare function getApiRoutes(pages: ImportGlobEagerOutput | undefined, topLevelPath?: string): Array<HydrogenApiRoute>;
export declare function getApiRouteFromURL(url: URL, routes: Array<HydrogenApiRoute>): ApiRouteMatch | null;
/** The `queryShop` utility is a function that helps you query the Storefront API.
 * It's similar to the `useShopQuery` hook, which is available in server components.
 * To use `queryShop`, pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`.
 */
interface QueryShopArgs {
    /** A string of the GraphQL query.
     * If no query is provided, then the `useShopQuery` makes no calls to the Storefront API.
     */
    query: ASTNode | string;
    /** An object of the variables for the GraphQL query. */
    variables?: Record<string, any>;
}
export declare function renderApiRoute(request: ServerComponentRequest, route: ApiRouteMatch, shopifyConfig: ShopifyConfig, session?: SessionStorageAdapter): Promise<Response | Request>;
export {};
