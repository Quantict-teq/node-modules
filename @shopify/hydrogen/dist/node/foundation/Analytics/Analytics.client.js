"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const react_1 = require("react");
const index_1 = require("./index");
function Analytics({ analyticsDataFromServer, }) {
    (0, react_1.useEffect)(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('utm_source')) {
            index_1.ClientAnalytics.pushToPageAnalyticsData({
                id: urlParams.get('utm_id'),
                source: urlParams.get('utm_source'),
                campaign: urlParams.get('utm_campaign'),
                medium: urlParams.get('utm_medium'),
                content: urlParams.get('utm_content'),
                term: urlParams.get('utm_term'),
            }, 'utm');
        }
        index_1.ClientAnalytics.pushToPageAnalyticsData(analyticsDataFromServer);
        index_1.ClientAnalytics.publish(index_1.ClientAnalytics.eventNames.PAGE_VIEW, true);
        if (analyticsDataFromServer.publishEventsOnNavigate) {
            analyticsDataFromServer.publishEventsOnNavigate.forEach((eventName) => {
                index_1.ClientAnalytics.publish(eventName, true);
            });
        }
        return function cleanup() {
            index_1.ClientAnalytics.resetPageAnalyticsData();
        };
    }, [analyticsDataFromServer]);
    return null;
}
exports.Analytics = Analytics;
