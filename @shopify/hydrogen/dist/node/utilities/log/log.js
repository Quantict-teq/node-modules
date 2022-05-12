"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logServerResponse = exports.resetLogger = exports.setLoggerOptions = exports.setLogger = exports.getLoggerWithContext = exports.log = void 0;
const kolorist_1 = require("kolorist");
const timing_1 = require("../timing");
const utils_1 = require("./utils");
const defaultLogger = {
    trace(context, ...args) {
        // Re-enable following line to show trace debugging information
        // console.log(context.id, ...args);
    },
    debug(context, ...args) {
        console.log(...args);
    },
    warn(context, ...args) {
        console.warn((0, kolorist_1.yellow)('WARN: '), ...args);
    },
    error(context, ...args) {
        console.error((0, kolorist_1.red)('ERROR: '), ...args);
    },
    fatal(context, ...args) {
        console.error((0, kolorist_1.red)('FATAL: '), ...args);
    },
    options: () => ({}),
};
globalThis.__logger = defaultLogger;
function buildLogger() {
    return {
        trace: (...args) => globalThis.__logger.trace(this, ...args),
        debug: (...args) => globalThis.__logger.debug(this, ...args),
        warn: (...args) => globalThis.__logger.warn(this, ...args),
        error: (...args) => globalThis.__logger.error(this, ...args),
        fatal: (...args) => globalThis.__logger.fatal(this, ...args),
        options: () => globalThis.__logger.options(),
    };
}
exports.log = buildLogger.call({});
function getLoggerWithContext(context = {}) {
    return buildLogger.call(context);
}
exports.getLoggerWithContext = getLoggerWithContext;
function setLogger(newLogger) {
    globalThis.__logger = newLogger;
}
exports.setLogger = setLogger;
function setLoggerOptions(options) {
    globalThis.__logger.options = () => options;
}
exports.setLoggerOptions = setLoggerOptions;
function resetLogger() {
    globalThis.__logger = defaultLogger;
}
exports.resetLogger = resetLogger;
const SERVER_RESPONSE_MAP = {
    str: 'streaming SSR',
    rsc: 'Server Components',
    ssr: 'buffered SSR',
};
function logServerResponse(type, request, responseStatus) {
    const log = getLoggerWithContext(request);
    const coloredResponseStatus = responseStatus >= 500
        ? (0, kolorist_1.red)(responseStatus)
        : responseStatus >= 400
            ? (0, kolorist_1.yellow)(responseStatus)
            : responseStatus >= 300
                ? (0, kolorist_1.lightBlue)(responseStatus)
                : (0, kolorist_1.green)(responseStatus);
    const fullType = SERVER_RESPONSE_MAP[type] || type;
    const styledType = (0, kolorist_1.italic)(fullType.padEnd(17));
    const paddedTiming = (((0, timing_1.getTime)() - request.time).toFixed(2) + ' ms').padEnd(10);
    const url = (0, utils_1.parseUrl)(type, request.url);
    log.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`);
}
exports.logServerResponse = logServerResponse;
