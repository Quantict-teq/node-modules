import { useRouter } from '../Router/BrowserRouter.client';
/**
 * The useNavigate hook imperatively navigates between routes.
 */
export function useNavigate() {
    const router = useRouter();
    return (path, options = { replace: false, reloadDocument: false }) => {
        // @todo wait for RSC and then change focus for a11y?
        if (options === null || options === void 0 ? void 0 : options.replace)
            router.history.replace(path, (options === null || options === void 0 ? void 0 : options.clientState) || {});
        else
            router.history.push(path, (options === null || options === void 0 ? void 0 : options.clientState) || {});
    };
}
