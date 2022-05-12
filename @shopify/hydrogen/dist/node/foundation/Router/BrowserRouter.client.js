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
exports.useLocation = exports.useRouter = exports.BrowserRouter = exports.RouterContext = void 0;
const history_1 = require("history");
const react_1 = __importStar(require("react"));
const ssr_interop_1 = require("../ssr-interop");
const use_server_props_1 = require("../useServerProps/use-server-props");
exports.RouterContext = (0, react_1.createContext)({});
let isFirstLoad = true;
const positions = {};
const BrowserRouter = ({ history: pHistory, children, }) => {
    if (ssr_interop_1.META_ENV_SSR)
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    const history = (0, react_1.useMemo)(() => pHistory || (0, history_1.createBrowserHistory)(), [pHistory]);
    const [location, setLocation] = (0, react_1.useState)(history.location);
    const [locationChanged, setLocationChanged] = (0, react_1.useState)(false);
    const { pending, locationServerProps, setLocationServerProps } = (0, use_server_props_1.useInternalServerProps)();
    useScrollRestoration({
        location,
        pending,
        serverProps: locationServerProps,
        locationChanged,
        onFinishNavigating: () => setLocationChanged(false),
    });
    (0, react_1.useLayoutEffect)(() => {
        const unlisten = history.listen(({ location: newLocation }) => {
            positions[location.key] = window.scrollY;
            setLocationServerProps({
                pathname: newLocation.pathname,
                search: newLocation.search,
            });
            setLocation(newLocation);
            setLocationChanged(true);
        });
        return () => unlisten();
    }, [history, location, setLocationChanged]);
    return (react_1.default.createElement(exports.RouterContext.Provider, { value: {
            history,
            location,
        } }, children));
};
exports.BrowserRouter = BrowserRouter;
function useRouter() {
    const router = (0, react_1.useContext)(exports.RouterContext);
    if (!router && ssr_interop_1.META_ENV_SSR) {
        throw new Error('useRouter must be used within a <Router> component');
    }
    return router;
}
exports.useRouter = useRouter;
function useLocation() {
    return useRouter().location;
}
exports.useLocation = useLocation;
/**
 * Run a callback before browser unload.
 */
function useBeforeUnload(callback) {
    react_1.default.useEffect(() => {
        window.addEventListener('beforeunload', callback);
        return () => {
            window.removeEventListener('beforeunload', callback);
        };
    }, [callback]);
}
function useScrollRestoration({ location, pending, serverProps, locationChanged, onFinishNavigating, }) {
    /**
     * Browsers have an API for scroll restoration. We wait for the page to load first,
     * in case the browser is able to restore scroll position automatically, and then
     * set it to manual mode.
     */
    (0, react_1.useEffect)(() => {
        window.history.scrollRestoration = 'manual';
    }, []);
    /**
     * If the page is reloading, allow the browser to handle its own scroll restoration.
     */
    useBeforeUnload((0, react_1.useCallback)(() => {
        window.history.scrollRestoration = 'auto';
    }, []));
    (0, react_1.useLayoutEffect)(() => {
        // The app has just loaded
        if (isFirstLoad || !locationChanged) {
            isFirstLoad = false;
            return;
        }
        const position = positions[location.key];
        /**
         * When serverState gets updated, `pending` is true while the fetch is in progress.
         * When that resolves, the serverState is updated. We should wait until the internal
         * location pointer and serverState match, and pending is false, to do any scrolling.
         */
        const finishedNavigating = !pending &&
            location.pathname === serverProps.pathname &&
            location.search === serverProps.search;
        if (!finishedNavigating) {
            return;
        }
        // If there is a location hash, scroll to it
        if (location.hash) {
            const element = document.querySelector(location.hash);
            if (element) {
                element.scrollIntoView();
                onFinishNavigating();
                return;
            }
        }
        // If we have a matching position, scroll to it
        if (position) {
            window.scrollTo(0, position);
            onFinishNavigating();
            return;
        }
        // Scroll to the top of new pages
        window.scrollTo(0, 0);
        onFinishNavigating();
    }, [
        location.pathname,
        location.search,
        location.hash,
        pending,
        serverProps.pathname,
        serverProps.search,
        locationChanged,
        onFinishNavigating,
    ]);
}
