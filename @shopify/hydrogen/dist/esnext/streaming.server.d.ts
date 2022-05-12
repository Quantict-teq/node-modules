import type { Writable } from 'stream';
export declare const rscRenderToReadableStream: (App: JSX.Element) => ReadableStream<Uint8Array>;
export declare const createFromReadableStream: (rs: ReadableStream<Uint8Array>) => {
    readRoot: () => JSX.Element;
};
declare type StreamOptions = {
    nonce?: string;
    bootstrapScripts?: string[];
    bootstrapModules?: string[];
    onError?: (error: Error) => void;
};
export declare const ssrRenderToPipeableStream: (App: JSX.Element, options: StreamOptions & {
    onAllReady?: (() => void) | undefined;
    onShellReady?: (() => void) | undefined;
    onShellError?: ((error: Error) => void) | undefined;
}) => {
    pipe: Writable['pipe'];
};
export declare const ssrRenderToReadableStream: (App: JSX.Element, options: StreamOptions) => Promise<ReadableStream<Uint8Array> & {
    allReady: Promise<void>;
}>;
export declare function isStreamingSupported(): Promise<boolean>;
export declare function bufferReadableStream(reader: ReadableStreamDefaultReader, cb?: (chunk: string) => void): Promise<string>;
export {};
