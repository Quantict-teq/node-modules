declare global {
    var __flight: Array<string>;
}
/**
 * Much of this is borrowed from React's demo implementation:
 * @see https://github.com/reactjs/server-components-demo/blob/main/src/Cache.client.js
 *
 * Note that we'd want to add some other constraints and controls around caching here.
 */
export declare function useServerResponse(state: any): any;
export declare function useRefresh(): void;
