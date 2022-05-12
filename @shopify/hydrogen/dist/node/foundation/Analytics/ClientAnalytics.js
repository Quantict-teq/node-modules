"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAnalytics = void 0;
const utils_1 = require("./utils");
const utilities_1 = require("../../utilities");
const const_1 = require("./const");
const constants_1 = require("../../constants");
const subscribers = {};
let pageAnalyticsData = {};
const guardDupEvents = {};
const USAGE_ERROR = 'ClientAnalytics should only be used within the useEffect callback or event handlers';
function isInvokedFromServer() {
    if ((0, utilities_1.isServer)()) {
        console.warn(USAGE_ERROR);
        return true;
    }
    return false;
}
function pushToPageAnalyticsData(data, namespace) {
    if (isInvokedFromServer())
        return;
    if (namespace) {
        pageAnalyticsData[namespace] = Object.assign({}, pageAnalyticsData[namespace] || {}, data);
    }
    else {
        pageAnalyticsData = Object.assign({}, pageAnalyticsData, data);
    }
}
function getPageAnalyticsData() {
    if (isInvokedFromServer())
        return;
    return pageAnalyticsData;
}
function resetPageAnalyticsData() {
    if (isInvokedFromServer())
        return;
    pageAnalyticsData = {};
}
function publish(eventname, guardDup = false, payload) {
    if (isInvokedFromServer())
        return;
    const namedspacedEventname = (0, utils_1.getNamedspacedEventname)(eventname);
    const subs = subscribers[namedspacedEventname];
    const combinedPayload = Object.assign({}, pageAnalyticsData, payload);
    // De-dup events due to re-renders
    if (guardDup) {
        const eventGuardTimeout = guardDupEvents[namedspacedEventname];
        if (eventGuardTimeout) {
            clearTimeout(eventGuardTimeout);
        }
        const namespacedTimeout = setTimeout(() => {
            publishEvent(subs, combinedPayload);
        }, 100);
        guardDupEvents[namedspacedEventname] = namespacedTimeout;
    }
    else {
        publishEvent(subs, combinedPayload);
    }
}
function publishEvent(subs, payload) {
    if (subs) {
        Object.keys(subs).forEach((key) => {
            subs[key](payload);
        });
    }
}
function subscribe(eventname, callbackFunction) {
    if (isInvokedFromServer())
        return { unsubscribe: () => { } };
    const namedspacedEventname = (0, utils_1.getNamedspacedEventname)(eventname);
    const subs = subscribers[namedspacedEventname];
    if (!subs) {
        subscribers[namedspacedEventname] = {};
    }
    const subscriberId = Date.now().toString();
    subscribers[namedspacedEventname][subscriberId] = callbackFunction;
    return {
        unsubscribe: () => {
            delete subscribers[namedspacedEventname][subscriberId];
        },
    };
}
function pushToServer(init, searchParam) {
    return fetch(`${constants_1.EVENT_PATHNAME}${searchParam ? `?${searchParam}` : ''}`, Object.assign({
        method: 'post',
        headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
        },
    }, init));
}
exports.ClientAnalytics = {
    pushToPageAnalyticsData,
    getPageAnalyticsData,
    resetPageAnalyticsData,
    publish,
    subscribe,
    pushToServer,
    eventNames: const_1.eventNames,
};
