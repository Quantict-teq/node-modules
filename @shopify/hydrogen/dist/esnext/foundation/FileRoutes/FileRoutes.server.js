import React, { useMemo } from 'react';
import { matchPath } from '../../utilities/matchPath';
import { log } from '../../utilities/log';
import { extractPathFromRoutesKey } from '../../utilities/apiRoutes';
import { useServerRequest } from '../ServerRequestProvider';
import { RouteParamsProvider } from '../useRouteParams/RouteParamsProvider.client';
/**
 * The `FileRoutes` component builds a set of default Hydrogen routes based on the output provided by Vite's
 * [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple
 * instances of this component to source file routes from multiple locations.
 */
export function FileRoutes({ routes, basePath = '/', dirPrefix = './routes', }) {
    const request = useServerRequest();
    const { routeRendered, serverProps } = request.ctx.router;
    if (routeRendered)
        return null;
    const pageRoutes = useMemo(() => createPageRoutes(routes, basePath, dirPrefix), [routes, basePath]);
    let foundRoute, foundRouteDetails;
    for (let i = 0; i < pageRoutes.length; i++) {
        foundRouteDetails = matchPath(serverProps.pathname, pageRoutes[i]);
        if (foundRouteDetails) {
            foundRoute = pageRoutes[i];
            break;
        }
    }
    if (foundRoute) {
        request.ctx.router.routeRendered = true;
        request.ctx.router.routeParams = foundRouteDetails.params;
        return (React.createElement(RouteParamsProvider, { routeParams: foundRouteDetails.params },
            React.createElement(foundRoute.component, { params: foundRouteDetails.params, ...serverProps })));
    }
    return null;
}
export function createPageRoutes(pages, topLevelPath = '*', dirPrefix) {
    const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');
    const routes = Object.keys(pages)
        .map((key) => {
        const path = extractPathFromRoutesKey(key, dirPrefix);
        /**
         * Catch-all routes [...handle].jsx don't need an exact match
         * https://reactrouter.com/core/api/Route/exact-bool
         */
        const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);
        if (!pages[key].default && !pages[key].api) {
            log === null || log === void 0 ? void 0 : log.warn(`${key} doesn't export a default React component or an API function`);
        }
        return {
            path: topLevelPrefix + path,
            component: pages[key].default,
            exact,
        };
    })
        .filter((route) => route.component);
    /**
     * Place static paths BEFORE dynamic paths to grant priority.
     */
    return [
        ...routes.filter((route) => !route.path.includes(':')),
        ...routes.filter((route) => route.path.includes(':')),
    ];
}
