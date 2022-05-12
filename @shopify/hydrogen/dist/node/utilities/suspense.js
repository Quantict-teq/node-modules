"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadFunction = exports.suspendFunction = exports.wrapPromise = void 0;
const hash_1 = require("./hash");
/**
 * Wrap the fetch promise in a way that React Suspense understands.
 * Essentially, keep throwing something until you have legit data.
 */
function wrapPromise(promise) {
    let status = 'pending';
    let response;
    const suspender = promise.then((res) => {
        status = 'success';
        response = res;
    }, (err) => {
        status = 'error';
        response = err;
    });
    const read = () => {
        switch (status) {
            case 'pending':
                throw suspender;
            case 'error':
                throw response;
            default:
                return response;
        }
    };
    return { read };
}
exports.wrapPromise = wrapPromise;
const browserCache = {};
/**
 * Perform an async function in a synchronous way for Suspense support.
 * To be used only in the client.
 * Inspired by https://github.com/pmndrs/suspend-react
 */
function query(key, fn, preload = false) {
    const stringKey = (0, hash_1.hashKey)(key);
    if (browserCache[stringKey]) {
        const entry = browserCache[stringKey];
        if (preload)
            return undefined;
        if (entry.error)
            throw entry.error;
        if (entry.response)
            return entry.response;
        if (!preload)
            throw entry.promise;
    }
    const entry = {
        promise: fn()
            .then((response) => (entry.response = response))
            .catch((error) => (entry.error = error)),
    };
    browserCache[stringKey] = entry;
    if (!preload)
        throw entry.promise;
    return undefined;
}
const suspendFunction = (key, fn) => query(key, fn);
exports.suspendFunction = suspendFunction;
const preloadFunction = (key, fn) => query(key, fn, true);
exports.preloadFunction = preloadFunction;
