import { 
// @ts-ignore
renderToPipeableStream as _ssrRenderToPipeableStream, // Only available in Node context
// @ts-ignore
renderToReadableStream as _ssrRenderToReadableStream, // Only available in Browser/Worker context
 } from 'react-dom/server';
// @ts-ignore
import { renderToReadableStream as _rscRenderToReadableStream } from '@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server';
// @ts-ignore
import { createFromReadableStream as _createFromReadableStream } from '@shopify/hydrogen/vendor/react-server-dom-vite';
export const rscRenderToReadableStream = _rscRenderToReadableStream;
export const createFromReadableStream = _createFromReadableStream;
export const ssrRenderToPipeableStream = _ssrRenderToPipeableStream;
export const ssrRenderToReadableStream = _ssrRenderToReadableStream;
export async function isStreamingSupported() {
    var _a, _b;
    return Boolean((_b = (_a = globalThis.Oxygen) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.HYDROGEN_ENABLE_WORKER_STREAMING);
}
export async function bufferReadableStream(reader, cb) {
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        const stringValue = typeof value === 'string' ? value : decoder.decode(value);
        result += stringValue;
        if (cb) {
            cb(stringValue);
        }
    }
    return result;
}
