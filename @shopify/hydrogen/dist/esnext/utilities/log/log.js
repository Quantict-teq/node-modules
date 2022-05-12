import { yellow, red, green, italic, lightBlue } from 'kolorist';
import { getTime } from '../timing';
import { parseUrl } from './utils';
const defaultLogger = {
    trace(context, ...args) {
        // Re-enable following line to show trace debugging information
        // console.log(context.id, ...args);
    },
    debug(context, ...args) {
        console.log(...args);
    },
    warn(context, ...args) {
        console.warn(yellow('WARN: '), ...args);
    },
    error(context, ...args) {
        console.error(red('ERROR: '), ...args);
    },
    fatal(context, ...args) {
        console.error(red('FATAL: '), ...args);
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
export const log = buildLogger.call({});
export function getLoggerWithContext(context = {}) {
    return buildLogger.call(context);
}
export function setLogger(newLogger) {
    globalThis.__logger = newLogger;
}
export function setLoggerOptions(options) {
    globalThis.__logger.options = () => options;
}
export function resetLogger() {
    globalThis.__logger = defaultLogger;
}
const SERVER_RESPONSE_MAP = {
    str: 'streaming SSR',
    rsc: 'Server Components',
    ssr: 'buffered SSR',
};
export function logServerResponse(type, request, responseStatus) {
    const log = getLoggerWithContext(request);
    const coloredResponseStatus = responseStatus >= 500
        ? red(responseStatus)
        : responseStatus >= 400
            ? yellow(responseStatus)
            : responseStatus >= 300
                ? lightBlue(responseStatus)
                : green(responseStatus);
    const fullType = SERVER_RESPONSE_MAP[type] || type;
    const styledType = italic(fullType.padEnd(17));
    const paddedTiming = ((getTime() - request.time).toFixed(2) + ' ms').padEnd(10);
    const url = parseUrl(type, request.url);
    log.debug(`${request.method} ${styledType} ${coloredResponseStatus} ${paddedTiming} ${url}`);
}
