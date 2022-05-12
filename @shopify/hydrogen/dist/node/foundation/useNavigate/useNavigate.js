"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigate = void 0;
const BrowserRouter_client_1 = require("../Router/BrowserRouter.client");
/**
 * The useNavigate hook imperatively navigates between routes.
 */
function useNavigate() {
    const router = (0, BrowserRouter_client_1.useRouter)();
    return (path, options = { replace: false, reloadDocument: false }) => {
        // @todo wait for RSC and then change focus for a11y?
        if (options === null || options === void 0 ? void 0 : options.replace)
            router.history.replace(path, (options === null || options === void 0 ? void 0 : options.clientState) || {});
        else
            router.history.push(path, (options === null || options === void 0 ? void 0 : options.clientState) || {});
    };
}
exports.useNavigate = useNavigate;
