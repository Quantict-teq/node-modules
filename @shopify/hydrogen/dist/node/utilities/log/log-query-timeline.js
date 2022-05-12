"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logQueryTimings = exports.collectQueryTimings = void 0;
const hash_1 = require("../hash");
const utils_1 = require("./utils");
const kolorist_1 = require("kolorist");
const log_1 = require("./log");
const timing_1 = require("../timing");
const color = kolorist_1.gray;
const TIMING_MAPPING = {
    requested: 'Requested',
    rendered: 'Rendered',
    resolved: 'Resolved',
    preload: 'Preload',
};
function collectQueryTimings(request, queryKey, timingType, duration) {
    request.ctx.queryTimings.push({
        name: (0, utils_1.findQueryName)((0, hash_1.hashKey)(queryKey)),
        timingType,
        timestamp: (0, timing_1.getTime)(),
        duration,
    });
}
exports.collectQueryTimings = collectQueryTimings;
function logQueryTimings(type, request) {
    const log = (0, log_1.getLoggerWithContext)(request);
    if (!log.options().showQueryTiming) {
        return;
    }
    log.debug(color(`┌── Query timings for ${(0, utils_1.parseUrl)(type, request.url)}`));
    const queryList = request.ctx.queryTimings;
    if (queryList.length > 0) {
        const requestStartTime = request.time;
        const detectSuspenseWaterfall = {};
        const detectMultipleDataLoad = {};
        let suspenseWaterfallDetectedCount = 0;
        queryList.forEach((query, index) => {
            if (query.timingType === 'requested' || query.timingType === 'preload') {
                detectSuspenseWaterfall[query.name] = true;
            }
            else if (query.timingType === 'rendered') {
                delete detectSuspenseWaterfall[query.name];
            }
            else if (query.timingType === 'resolved') {
                detectMultipleDataLoad[query.name] = detectMultipleDataLoad[query.name]
                    ? detectMultipleDataLoad[query.name] + 1
                    : 1;
            }
            const loadColor = query.timingType === 'preload' ? kolorist_1.green : color;
            const duration = query.duration;
            log.debug(color(`│ ${`${(query.timestamp - requestStartTime).toFixed(2)}ms`.padEnd(10)} ${loadColor(TIMING_MAPPING[query.timingType].padEnd(10))} ${query.name}${query.timingType === 'resolved'
                ? ` (Took ${duration === null || duration === void 0 ? void 0 : duration.toFixed(2)}ms)`
                : ''}`));
            // SSR + RSC render path generates 2 `load` and `render` for each query
            // We want to avoid falsely identifying a suspense waterfall near the end
            // of the query list
            //
            // The (index + 4) is detecting that near the end of list.
            // A complete set of events for a given query is 4 entries
            // │ (639.62ms)  Requested  Localization
            // │ (993.33ms)  Resolved   Localization (Took 353.66ms)
            // │ (993.96ms)  Requested  Localization      <-- second time React tries to load
            // │ (994.03ms)  Rendered   Localization
            //
            // so the end of list index range is 3 (one less from a set entry) + 1 (zero index)
            if (queryList.length >= index + 4 &&
                Object.keys(detectSuspenseWaterfall).length === 0) {
                suspenseWaterfallDetectedCount++;
                const warningColor = suspenseWaterfallDetectedCount === 1 ? kolorist_1.yellow : kolorist_1.red;
                log.debug(`${color(`│ `)}${warningColor(`Suspense waterfall detected`)}`);
            }
        });
        const unusedQueries = Object.keys(detectSuspenseWaterfall);
        if (unusedQueries.length > 0) {
            unusedQueries.forEach((queryName) => {
                log.debug(`${color(`│ `)}${(0, kolorist_1.yellow)(`Unused query detected: ${queryName}`)}`);
            });
        }
        Object.keys(detectMultipleDataLoad).forEach((queryName) => {
            const count = detectMultipleDataLoad[queryName];
            if (count > 1) {
                log.debug(`${color(`│ `)}${(0, kolorist_1.yellow)(`Multiple data loads detected: ${queryName}`)}`);
            }
        });
    }
    log.debug(color('└──'));
}
exports.logQueryTimings = logQueryTimings;
