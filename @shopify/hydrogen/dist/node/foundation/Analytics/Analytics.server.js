"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const React = __importStar(require("react"));
const hook_1 = require("./hook");
const Analytics_client_1 = require("./Analytics.client");
const ServerRequestProvider_1 = require("../ServerRequestProvider");
const AnalyticsErrorBoundary_client_1 = __importDefault(require("../AnalyticsErrorBoundary.client"));
const DELAY_KEY = 'analytics-delay';
function Analytics() {
    const cache = (0, ServerRequestProvider_1.useServerRequest)().ctx.cache;
    // If render cache is empty, create a 50 ms delay so that React doesn't resolve this
    // component too early and potentially cause a mismatch in hydration
    if (cache.size === 0 && !cache.has(DELAY_KEY)) {
        let result;
        let promise;
        cache.set(DELAY_KEY, () => {
            if (result !== undefined) {
                return result;
            }
            if (!promise) {
                promise = new Promise((resolve) => {
                    setTimeout(() => {
                        result = true;
                        resolve(true);
                    }, 50);
                });
            }
            throw promise;
        });
    }
    // Make sure all queries have returned before rendering the Analytics server component
    cache.forEach((cacheFn) => {
        if (cacheFn && typeof cacheFn === 'function') {
            const result = cacheFn.call();
            if (result instanceof Promise)
                throw result;
        }
    });
    const analyticsData = (0, hook_1.useServerAnalytics)();
    return (React.createElement(AnalyticsErrorBoundary_client_1.default, null,
        React.createElement(Analytics_client_1.Analytics, { analyticsDataFromServer: analyticsData })));
}
exports.Analytics = Analytics;
