"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerAnalyticsRoute = void 0;
const log_1 = require("../../utilities/log");
function ServerAnalyticsRoute(request, serverAnalyticsConnectors) {
    if (request.headers.get('Content-Length') === '0') {
        serverAnalyticsConnectors === null || serverAnalyticsConnectors === void 0 ? void 0 : serverAnalyticsConnectors.forEach((connector) => {
            connector.request(request);
        });
    }
    else if (request.headers.get('Content-Type') === 'application/json') {
        Promise.resolve(request.json())
            .then((data) => {
            serverAnalyticsConnectors === null || serverAnalyticsConnectors === void 0 ? void 0 : serverAnalyticsConnectors.forEach((connector) => {
                connector.request(request, data, 'json');
            });
        })
            .catch((error) => {
            log_1.log.warn('Fail to resolve server analytics: ', error);
        });
    }
    else {
        Promise.resolve(request.text())
            .then((data) => {
            serverAnalyticsConnectors === null || serverAnalyticsConnectors === void 0 ? void 0 : serverAnalyticsConnectors.forEach((connector) => {
                connector.request(request, data, 'text');
            });
        })
            .catch((error) => {
            log_1.log.warn('Fail to resolve server analytics: ', error);
        });
    }
    return new Response(null, {
        status: 200,
    });
}
exports.ServerAnalyticsRoute = ServerAnalyticsRoute;
