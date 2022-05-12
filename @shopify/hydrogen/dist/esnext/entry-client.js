import React, { Suspense, useState, StrictMode, Fragment, } from 'react';
// @ts-expect-error hydrateRoot isn't on the TS types yet, but we're using React 18 so it exists
import { hydrateRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { useServerResponse } from './framework/Hydration/rsc';
import { ServerPropsProvider } from './foundation/ServerPropsProvider';
const DevTools = React.lazy(() => import('./components/DevTools'));
const renderHydrogen = async (ClientWrapper, config) => {
    const root = document.getElementById('root');
    if (!root) {
        console.error(`Could not find a root element <div id="root"></div> to render.`);
        return;
    }
    if (import.meta.hot) {
        import.meta.hot.on('hydrogen', ({ type, data }) => {
            if (type === 'warn') {
                console.warn(data);
            }
        });
    }
    // default to StrictMode on, unless explicitly turned off
    const RootComponent = (config === null || config === void 0 ? void 0 : config.strictMode) !== false ? StrictMode : Fragment;
    let hasCaughtError = false;
    hydrateRoot(root, React.createElement(React.Fragment, null,
        React.createElement(RootComponent, null,
            React.createElement(ErrorBoundary, { FallbackComponent: Error },
                React.createElement(Suspense, { fallback: null },
                    React.createElement(Content, { clientWrapper: ClientWrapper })))),
        typeof DevTools !== 'undefined' && (config === null || config === void 0 ? void 0 : config.showDevTools) ? (React.createElement(DevTools, null)) : null), {
        onRecoverableError(e) {
            if (__DEV__ && !hasCaughtError) {
                hasCaughtError = true;
                console.log(`React encountered an error while attempting to hydrate the application. ` +
                    `This is likely due to a bug in React's Suspense behavior related to experimental server components, ` +
                    `and it is safe to ignore this error.\n` +
                    `Visit this issue to learn more: https://github.com/Shopify/hydrogen/issues/920.\n\n` +
                    `The original error is printed below:`);
                console.log(e);
            }
        },
    });
};
export default renderHydrogen;
function Content({ clientWrapper: ClientWrapper = ({ children }) => children, }) {
    const [serverProps, setServerProps] = useState({
        pathname: window.location.pathname,
        search: window.location.search,
    });
    const response = useServerResponse(serverProps);
    return (React.createElement(ServerPropsProvider, { initialServerProps: serverProps, setServerPropsForRsc: setServerProps },
        React.createElement(ClientWrapper, null, response.readRoot())));
}
function Error({ error }) {
    if (import.meta.env.DEV) {
        return (React.createElement("div", { style: { padding: '1em' } },
            React.createElement("h1", { style: { fontSize: '2em', marginBottom: '1em', fontWeight: 'bold' } }, "Error"),
            React.createElement("pre", { style: { whiteSpace: 'pre-wrap' } }, error.stack)));
    }
    return (React.createElement("div", { style: {
            padding: '2em',
            textAlign: 'center',
        } },
        React.createElement("h1", { style: { fontSize: '2em', marginBottom: '1em', fontWeight: 'bold' } }, "Something's wrong here..."),
        React.createElement("div", { style: { fontSize: '1.1em' } },
            React.createElement("p", null, "We found an error while loading this page."),
            React.createElement("p", null,
                "Please, refresh or go back to the",
                ' ',
                React.createElement("a", { href: "/", style: { textDecoration: 'underline' } }, "home page"),
                "."))));
}
