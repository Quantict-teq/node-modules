"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmbeddedVideoUrl = exports.addParametersToEmbeddedVideoUrl = void 0;
const react_1 = require("react");
function addParametersToEmbeddedVideoUrl(url, parameters) {
    if (parameters == null) {
        return url;
    }
    const params = Object.keys(parameters).reduce((accumulator, param) => {
        const value = parameters[param];
        if (value == null) {
            return accumulator;
        }
        return accumulator + `&${param}=${value}`;
    }, '');
    return `${url}?${params}`;
}
exports.addParametersToEmbeddedVideoUrl = addParametersToEmbeddedVideoUrl;
function useEmbeddedVideoUrl(url, parameters) {
    return (0, react_1.useMemo)(() => {
        if (!parameters) {
            return url;
        }
        return addParametersToEmbeddedVideoUrl(url, parameters);
    }, [url, parameters]);
}
exports.useEmbeddedVideoUrl = useEmbeddedVideoUrl;
