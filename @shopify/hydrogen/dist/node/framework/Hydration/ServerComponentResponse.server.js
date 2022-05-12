"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerComponentResponse = void 0;
const server_1 = require("react-dom/server");
const CachingStrategy_1 = require("../CachingStrategy");
const Redirect_client_1 = __importDefault(require("../../foundation/Redirect/Redirect.client"));
const react_1 = __importDefault(require("react"));
class ServerComponentResponse extends Response {
    constructor() {
        super(...arguments);
        this.wait = false;
        /**
         * Allow custom body to be a string or a Promise.
         */
        this.customBody = '';
    }
    /**
     * Buffer the current response until all queries have resolved,
     * and prevent it from streaming back early.
     */
    doNotStream() {
        this.wait = true;
    }
    canStream() {
        return !this.wait;
    }
    cache(options) {
        this.cacheOptions = options;
    }
    get cacheControlHeader() {
        return (0, CachingStrategy_1.generateCacheControlHeader)(this.cacheOptions || (0, CachingStrategy_1.CacheSeconds)());
    }
    writeHead({ status, statusText, headers, } = {}) {
        if (status || statusText) {
            this.customStatus = { code: status, text: statusText };
        }
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                this.headers.set(key, value);
            }
        }
    }
    redirect(location, status = 307) {
        // writeHead is used for SSR, so that the server responds with a redirect
        this.writeHead({ status, headers: { location } });
        // in the case of an RSC request, instead render a client component that will redirect
        return react_1.default.createElement(Redirect_client_1.default, { to: location });
    }
    /**
     * Send the response from a Server Component. Renders React components to string,
     * and returns `null` to make React happy.
     */
    send(body) {
        if (typeof body === 'object' &&
            body.$$typeof === Symbol.for('react.element')) {
            this.customBody = (0, server_1.renderToString)(body);
        }
        else {
            this.customBody = body;
        }
        return null;
    }
}
exports.ServerComponentResponse = ServerComponentResponse;
