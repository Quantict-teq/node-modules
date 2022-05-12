"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferReadableStream = exports.isStreamingSupported = exports.ssrRenderToReadableStream = exports.ssrRenderToPipeableStream = exports.createFromReadableStream = exports.rscRenderToReadableStream = void 0;
const server_1 = require("react-dom/server");
// @ts-ignore
const writer_browser_server_1 = require("@shopify/hydrogen/vendor/react-server-dom-vite/writer.browser.server");
// @ts-ignore
const react_server_dom_vite_1 = require("@shopify/hydrogen/vendor/react-server-dom-vite");
exports.rscRenderToReadableStream = writer_browser_server_1.renderToReadableStream;
exports.createFromReadableStream = react_server_dom_vite_1.createFromReadableStream;
exports.ssrRenderToPipeableStream = server_1.renderToPipeableStream;
exports.ssrRenderToReadableStream = server_1.renderToReadableStream;
async function isStreamingSupported() {
    var _a, _b;
    return Boolean((_b = (_a = globalThis.Oxygen) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.HYDROGEN_ENABLE_WORKER_STREAMING);
}
exports.isStreamingSupported = isStreamingSupported;
async function bufferReadableStream(reader, cb) {
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
exports.bufferReadableStream = bufferReadableStream;
