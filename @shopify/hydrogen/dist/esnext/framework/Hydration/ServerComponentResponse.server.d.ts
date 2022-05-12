import type { CachingStrategy } from '../../types';
import React from 'react';
export declare class ServerComponentResponse extends Response {
    private wait;
    private cacheOptions?;
    customStatus?: {
        code?: number;
        text?: string;
    };
    /**
     * Allow custom body to be a string or a Promise.
     */
    customBody: string | Promise<string>;
    /**
     * Buffer the current response until all queries have resolved,
     * and prevent it from streaming back early.
     */
    doNotStream(): void;
    canStream(): boolean;
    cache(options: CachingStrategy): void;
    get cacheControlHeader(): string;
    writeHead({ status, statusText, headers, }?: {
        status?: number;
        statusText?: string;
        headers?: Record<string, any>;
    }): void;
    redirect(location: string, status?: number): React.FunctionComponentElement<{
        to: string;
    }>;
    /**
     * Send the response from a Server Component. Renders React components to string,
     * and returns `null` to make React happy.
     */
    send(body: any): null;
}
