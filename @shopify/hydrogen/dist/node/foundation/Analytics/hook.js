"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useServerAnalytics = void 0;
const ServerRequestProvider_1 = require("../ServerRequestProvider");
function useServerAnalytics(data) {
    const request = (0, ServerRequestProvider_1.useServerRequest)();
    if (data)
        request.ctx.analyticsData = Object.assign({}, request.ctx.analyticsData, data);
    return request.ctx.analyticsData;
}
exports.useServerAnalytics = useServerAnalytics;
