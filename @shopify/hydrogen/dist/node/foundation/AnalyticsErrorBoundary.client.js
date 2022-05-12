"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
function AnalyticsErrorBoundary({ children, }) {
    // Analytics fail to load, most likely due to an ad blocker
    return (react_1.default.createElement(react_error_boundary_1.ErrorBoundary, { fallbackRender: () => {
            return null;
        } }, children));
}
exports.default = AnalyticsErrorBoundary;
