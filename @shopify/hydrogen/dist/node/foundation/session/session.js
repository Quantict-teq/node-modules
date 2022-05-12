"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptySyncSessionImplementation = exports.emptySessionImplementation = exports.getSyncSessionApi = void 0;
const suspense_1 = require("../../utilities/suspense");
function getSyncSessionApi(request, componentResponse, log, session) {
    const sessionPromises = {};
    return session
        ? {
            get() {
                if (!sessionPromises.getPromise) {
                    sessionPromises.getPromise = (0, suspense_1.wrapPromise)(session.get(request));
                }
                return sessionPromises.getPromise.read();
            },
        }
        : (0, exports.emptySyncSessionImplementation)(log);
}
exports.getSyncSessionApi = getSyncSessionApi;
const emptySessionImplementation = function (log) {
    return {
        async get() {
            log.warn('No session adapter has been configured!');
            return {};
        },
        async set(key, value) {
            log.warn('No session adapter has been configured!');
        },
        async destroy() {
            log.warn('No session adapter has been configured!');
            return;
        },
    };
};
exports.emptySessionImplementation = emptySessionImplementation;
const emptySyncSessionImplementation = function (log) {
    return {
        get() {
            log.warn('No session adapter has been configured!');
            return {};
        },
    };
};
exports.emptySyncSessionImplementation = emptySyncSessionImplementation;
