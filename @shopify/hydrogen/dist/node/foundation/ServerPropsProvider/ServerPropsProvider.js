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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPropsProvider = exports.ServerPropsContext = void 0;
const react_1 = __importStar(require("react"));
const PRIVATE_PROPS = ['request', 'response'];
exports.ServerPropsContext = (0, react_1.createContext)(null);
function ServerPropsProvider({ initialServerProps, setServerPropsForRsc, children, }) {
    const [locationServerProps, setLocationServerProps] = (0, react_1.useState)(initialServerProps);
    const [serverProps, setServerProps] = (0, react_1.useState)({});
    const [pending, startTransition] = (0, react_1.useTransition)();
    const setServerPropsCallback = (0, react_1.useCallback)((input, propValue) => {
        startTransition(() => {
            setServerProps((prev) => getNewValue(prev, input, propValue));
            setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
        });
    }, []);
    const setLocationServerPropsCallback = (0, react_1.useCallback)((input, propValue) => {
        // Flush the existing user server state when location changes, leaving only the persisted state
        startTransition(() => {
            setServerPropsForRsc((prev) => getNewValue(prev, input, propValue));
            setServerProps({});
            setLocationServerProps((prev) => getNewValue(prev, input, propValue));
        });
    }, []);
    const getProposedLocationServerPropsCallback = (0, react_1.useCallback)((input, propValue) => {
        return getNewValue(locationServerProps, input, propValue);
    }, [locationServerProps]);
    function getNewValue(prev, input, propValue) {
        let newValue;
        if (typeof input === 'function') {
            newValue = input(prev);
        }
        else if (typeof input === 'string') {
            newValue = { [input]: propValue };
        }
        else {
            newValue = input;
        }
        if (__DEV__) {
            const privateProp = PRIVATE_PROPS.find((prop) => prop in newValue);
            if (privateProp) {
                console.warn(`Custom "${privateProp}" property in server state is ignored. Use a different name.`);
            }
        }
        return {
            ...prev,
            ...newValue,
        };
    }
    const value = (0, react_1.useMemo)(() => ({
        pending,
        locationServerProps: locationServerProps,
        serverProps,
        setServerProps: setServerPropsCallback,
        setLocationServerProps: setLocationServerPropsCallback,
        getProposedLocationServerProps: getProposedLocationServerPropsCallback,
    }), [
        pending,
        locationServerProps,
        serverProps,
        setServerPropsCallback,
        setLocationServerPropsCallback,
        getProposedLocationServerPropsCallback,
    ]);
    return (react_1.default.createElement(exports.ServerPropsContext.Provider, { value: value }, children));
}
exports.ServerPropsProvider = ServerPropsProvider;
