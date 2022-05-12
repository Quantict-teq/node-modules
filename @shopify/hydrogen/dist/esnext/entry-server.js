import React, { Suspense } from 'react';
import { logServerResponse, logCacheControlHeaders, logQueryTimings, getLoggerWithContext, } from './utilities/log';
import { getErrorMarkup } from './utilities/error';
import { defer } from './utilities/defer';
import { Html, applyHtmlHead } from './framework/Hydration/Html';
import { ServerComponentResponse } from './framework/Hydration/ServerComponentResponse.server';
import { ServerComponentRequest } from './framework/Hydration/ServerComponentRequest.server';
import { preloadRequestCacheData, ServerRequestProvider, } from './foundation/ServerRequestProvider';
import { getApiRouteFromURL, renderApiRoute, getApiRoutes, } from './utilities/apiRoutes';
import { ServerPropsProvider } from './foundation/ServerPropsProvider';
import { isBotUA } from './utilities/bot-ua';
import { setContext, setCache } from './framework/runtime';
import { setConfig } from './framework/config';
import { ssrRenderToPipeableStream, ssrRenderToReadableStream, rscRenderToReadableStream, createFromReadableStream, isStreamingSupported, bufferReadableStream, } from './streaming.server';
import { RSC_PATHNAME, EVENT_PATHNAME, EVENT_PATHNAME_REGEX } from './constants';
import { stripScriptsFromTemplate } from './utilities/template';
import { Analytics } from './foundation/Analytics/Analytics.server';
import { ServerAnalyticsRoute } from './foundation/Analytics/ServerAnalyticsRoute.server';
import { getSyncSessionApi } from './foundation/session/session';
const DOCTYPE = '<!DOCTYPE html>';
const CONTENT_TYPE = 'Content-Type';
const HTML_CONTENT_TYPE = 'text/html; charset=UTF-8';
export const renderHydrogen = (App, { shopifyConfig, routes, serverAnalyticsConnectors, session, }) => {
    const handleRequest = async function (rawRequest, options) {
        const { indexTemplate, streamableResponse, dev, cache, context, nonce, buyerIpHeader, } = options;
        const request = new ServerComponentRequest(rawRequest);
        request.ctx.buyerIpHeader = buyerIpHeader;
        const url = new URL(request.url);
        const log = getLoggerWithContext(request);
        const sessionApi = session ? session(log) : undefined;
        const componentResponse = new ServerComponentResponse();
        request.ctx.session = getSyncSessionApi(request, componentResponse, log, sessionApi);
        /**
         * Inject the cache & context into the module loader so we can pull it out for subrequests.
         */
        setCache(cache);
        setContext(context);
        setConfig({ dev });
        if (url.pathname === EVENT_PATHNAME ||
            EVENT_PATHNAME_REGEX.test(url.pathname)) {
            return ServerAnalyticsRoute(request, serverAnalyticsConnectors);
        }
        const isReactHydrationRequest = url.pathname === RSC_PATHNAME;
        if (!isReactHydrationRequest && routes) {
            const apiRoute = getApiRoute(url, { routes });
            // The API Route might have a default export, making it also a server component
            // If it does, only render the API route if the request method is GET
            if (apiRoute &&
                (!apiRoute.hasServerComponent || request.method !== 'GET')) {
                const apiResponse = await renderApiRoute(request, apiRoute, shopifyConfig, sessionApi);
                return apiResponse instanceof Request
                    ? handleRequest(apiResponse, options)
                    : apiResponse;
            }
        }
        const isStreamable = !isBotUA(url, request.headers.get('user-agent')) &&
            (!!streamableResponse || (await isStreamingSupported()));
        let template = typeof indexTemplate === 'function'
            ? await indexTemplate(url.toString())
            : indexTemplate;
        if (template && typeof template !== 'string') {
            template = template.default;
        }
        const params = {
            App,
            log,
            dev,
            routes,
            nonce,
            request,
            template,
            isStreamable,
            componentResponse,
            response: streamableResponse,
        };
        if (isReactHydrationRequest) {
            return hydrate(url, params);
        }
        /**
         * Stream back real-user responses, but for bots/etc,
         * use `render` instead. This is because we need to inject <head>
         * things for SEO reasons.
         */
        if (isStreamable) {
            return stream(url, params);
        }
        return render(url, params);
    };
    return handleRequest;
};
function getApiRoute(url, { routes }) {
    const apiRoutes = getApiRoutes(routes);
    return getApiRouteFromURL(url, apiRoutes);
}
/**
 * The render function is responsible for turning the provided `App` into an HTML string,
 * and returning any initial state that needs to be hydrated into the client version of the app.
 * NOTE: This is currently only used for SEO bots or Worker runtime (where Stream is not yet supported).
 */
async function render(url, { App, routes, request, componentResponse, log, template, nonce, dev, }) {
    const state = { pathname: url.pathname, search: url.search };
    const { AppSSR, rscReadable } = buildAppSSR({
        App,
        state,
        request,
        response: componentResponse,
        routes,
        log,
    }, { template });
    function onErrorShell(error) {
        log.error(error);
        componentResponse.writeHead({ status: 500 });
        return template;
    }
    let [html, flight] = await Promise.all([
        renderToBufferedString(AppSSR, { log, nonce }).catch(onErrorShell),
        bufferReadableStream(rscReadable.getReader()).catch(() => null),
    ]);
    const { headers, status, statusText } = getResponseOptions(componentResponse);
    /**
     * TODO: Also add `Vary` headers for `accept-language` and any other keys
     * we want to shard our full-page cache for all Hydrogen storefronts.
     */
    headers.set('cache-control', componentResponse.cacheControlHeader);
    if (componentResponse.customBody) {
        // This can be used to return sitemap.xml or any other custom response.
        postRequestTasks('ssr', status, request, componentResponse);
        return new Response(await componentResponse.customBody, {
            status,
            statusText,
            headers,
        });
    }
    headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);
    html = applyHtmlHead(html, request.ctx.head, template);
    if (flight) {
        html = html.replace('</body>', () => `${flightContainer({
            init: true,
            nonce,
            chunk: flight,
        })}</body>`);
    }
    postRequestTasks('ssr', status, request, componentResponse);
    return new Response(html, {
        status,
        statusText,
        headers,
    });
}
/**
 * Stream a response to the client. NOTE: This omits custom `<head>`
 * information, so this method should not be used by crawlers.
 */
async function stream(url, { App, routes, request, response, componentResponse, log, template, nonce, dev, }) {
    var _a;
    const state = { pathname: url.pathname, search: url.search };
    log.trace('start stream');
    const { noScriptTemplate, bootstrapScripts, bootstrapModules } = stripScriptsFromTemplate(template);
    const { AppSSR, rscReadable } = buildAppSSR({
        App,
        state,
        request,
        response: componentResponse,
        log,
        routes,
    }, { template: noScriptTemplate });
    const rscToScriptTagReadable = new ReadableStream({
        start(controller) {
            log.trace('rsc start chunks');
            let init = true;
            const encoder = new TextEncoder();
            bufferReadableStream(rscReadable.getReader(), (chunk) => {
                const scriptTag = flightContainer({ init, chunk, nonce });
                controller.enqueue(encoder.encode(scriptTag));
                init = false;
            }).then(() => {
                log.trace('rsc finish chunks');
                return controller.close();
            });
        },
    });
    let didError;
    if (__WORKER__) {
        const onCompleteAll = defer();
        const encoder = new TextEncoder();
        const transform = new TransformStream();
        const writable = transform.writable.getWriter();
        const responseOptions = {};
        let ssrReadable;
        try {
            ssrReadable = await ssrRenderToReadableStream(AppSSR, {
                nonce,
                bootstrapScripts,
                bootstrapModules,
                onError(error) {
                    didError = error;
                    if (dev && !writable.closed && !!responseOptions.status) {
                        writable.write(getErrorMarkup(error));
                    }
                    log.error(error);
                },
            });
        }
        catch (error) {
            log.error(error);
            return new Response(template + (dev ? getErrorMarkup(error) : ''), {
                status: 500,
                headers: { [CONTENT_TYPE]: HTML_CONTENT_TYPE },
            });
        }
        log.trace('worker ready to stream');
        ssrReadable.allReady.then(() => {
            log.trace('worker complete stream');
            onCompleteAll.resolve(true);
        });
        async function prepareForStreaming(flush) {
            Object.assign(responseOptions, getResponseOptions(componentResponse, didError));
            /**
             * TODO: This assumes `response.cache()` has been called _before_ any
             * queries which might be caught behind Suspense. Clarify this or add
             * additional checks downstream?
             */
            responseOptions.headers.set('cache-control', componentResponse.cacheControlHeader);
            if (isRedirect(responseOptions)) {
                return false;
            }
            if (flush) {
                if (componentResponse.customBody) {
                    writable.write(encoder.encode(await componentResponse.customBody));
                    return false;
                }
                responseOptions.headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);
                writable.write(encoder.encode(DOCTYPE));
                if (didError) {
                    // This error was delayed until the headers were properly sent.
                    writable.write(encoder.encode(getErrorMarkup(didError)));
                }
                return true;
            }
        }
        const shouldReturnApp = (_a = (await prepareForStreaming(componentResponse.canStream()))) !== null && _a !== void 0 ? _a : (await onCompleteAll.promise.then(prepareForStreaming));
        if (shouldReturnApp) {
            let bufferedSsr = '';
            let isPendingSsrWrite = false;
            const writingSSR = bufferReadableStream(ssrReadable.getReader(), (chunk) => {
                bufferedSsr += chunk;
                if (!isPendingSsrWrite) {
                    isPendingSsrWrite = true;
                    setTimeout(() => {
                        isPendingSsrWrite = false;
                        // React can write fractional chunks synchronously.
                        // This timeout ensures we only write full HTML tags
                        // in order to allow RSC writing concurrently.
                        if (bufferedSsr) {
                            writable.write(encoder.encode(bufferedSsr));
                            bufferedSsr = '';
                        }
                    }, 0);
                }
            });
            const writingRSC = bufferReadableStream(rscToScriptTagReadable.getReader(), (scriptTag) => writable.write(encoder.encode(scriptTag)));
            Promise.all([writingSSR, writingRSC]).then(() => {
                // Last SSR write might be pending, delay closing the writable one tick
                setTimeout(() => writable.close(), 0);
                postRequestTasks('str', responseOptions.status, request, componentResponse);
            });
        }
        else {
            writable.close();
            postRequestTasks('str', responseOptions.status, request, componentResponse);
        }
        if (await isStreamingSupported()) {
            return new Response(transform.readable, responseOptions);
        }
        const bufferedBody = await bufferReadableStream(transform.readable.getReader());
        return new Response(bufferedBody, responseOptions);
    }
    else if (response) {
        const { pipe } = ssrRenderToPipeableStream(AppSSR, {
            nonce,
            bootstrapScripts,
            bootstrapModules,
            onShellReady() {
                log.trace('node ready to stream');
                /**
                 * TODO: This assumes `response.cache()` has been called _before_ any
                 * queries which might be caught behind Suspense. Clarify this or add
                 * additional checks downstream?
                 */
                response.setHeader('cache-control', componentResponse.cacheControlHeader);
                writeHeadToServerResponse(response, componentResponse, log, didError);
                if (isRedirect(response)) {
                    // Return redirects early without further rendering/streaming
                    return response.end();
                }
                if (!componentResponse.canStream())
                    return;
                startWritingHtmlToServerResponse(response, dev ? didError : undefined);
                setTimeout(() => {
                    log.trace('node pipe response');
                    pipe(response);
                }, 0);
                bufferReadableStream(rscToScriptTagReadable.getReader(), (chunk) => {
                    log.trace('rsc chunk');
                    return response.write(chunk);
                });
            },
            async onAllReady() {
                log.trace('node complete stream');
                if (componentResponse.canStream() || response.writableEnded) {
                    postRequestTasks('str', response.statusCode, request, componentResponse);
                    return;
                }
                writeHeadToServerResponse(response, componentResponse, log, didError);
                postRequestTasks('str', response.statusCode, request, componentResponse);
                if (isRedirect(response)) {
                    // Redirects found after any async code
                    return response.end();
                }
                if (componentResponse.customBody) {
                    return response.end(await componentResponse.customBody);
                }
                startWritingHtmlToServerResponse(response, dev ? didError : undefined);
                bufferReadableStream(rscToScriptTagReadable.getReader()).then((scriptTags) => {
                    // Piping ends the response so script tags
                    // must be written before that.
                    response.write(scriptTags);
                    pipe(response);
                });
            },
            onShellError(error) {
                log.error(error);
                if (!response.writableEnded) {
                    writeHeadToServerResponse(response, componentResponse, log, error);
                    startWritingHtmlToServerResponse(response, dev ? error : undefined);
                    response.write(template);
                    response.end();
                }
            },
            onError(error) {
                didError = error;
                if (dev && response.headersSent) {
                    // Calling write would flush headers automatically.
                    // Delay this error until headers are properly sent.
                    response.write(getErrorMarkup(error));
                }
                log.error(error);
            },
        });
    }
}
/**
 * Stream a hydration response to the client.
 */
async function hydrate(url, { App, routes, request, response, componentResponse, isStreamable, log, }) {
    const state = JSON.parse(url.searchParams.get('state') || '{}');
    const { AppRSC } = buildAppRSC({
        App,
        state,
        request,
        response: componentResponse,
        log,
        routes,
    });
    if (__WORKER__) {
        const rscReadable = rscRenderToReadableStream(AppRSC);
        if (isStreamable && (await isStreamingSupported())) {
            postRequestTasks('rsc', 200, request, componentResponse);
            return new Response(rscReadable);
        }
        // Note: CFW does not support reader.piteTo nor iterable syntax
        const bufferedBody = await bufferReadableStream(rscReadable.getReader());
        postRequestTasks('rsc', 200, request, componentResponse);
        return new Response(bufferedBody, {
            headers: {
                'cache-control': componentResponse.cacheControlHeader,
            },
        });
    }
    else if (response) {
        const rscWriter = await import(
        // @ts-ignore
        '@shopify/hydrogen/vendor/react-server-dom-vite/writer.node.server');
        const streamer = rscWriter.renderToPipeableStream(AppRSC);
        response.writeHead(200, 'ok', {
            'cache-control': componentResponse.cacheControlHeader,
        });
        const stream = streamer.pipe(response);
        stream.on('finish', function () {
            postRequestTasks('rsc', response.statusCode, request, componentResponse);
        });
    }
}
function buildAppRSC({ App, state, request, response, log, routes, }) {
    const hydrogenServerProps = { request, response, log };
    const serverProps = { ...state, ...hydrogenServerProps, routes };
    request.ctx.router.serverProps = serverProps;
    const AppRSC = (React.createElement(ServerRequestProvider, { request: request, isRSC: true },
        React.createElement(PreloadQueries, { request: request },
            React.createElement(App, { ...serverProps }),
            React.createElement(Suspense, { fallback: null },
                React.createElement(Analytics, null)))));
    return { AppRSC };
}
function buildAppSSR({ App, state, request, response, log, routes }, htmlOptions) {
    const { AppRSC } = buildAppRSC({
        App,
        state,
        request,
        response,
        log,
        routes,
    });
    const [rscReadableForFizz, rscReadableForFlight] = rscRenderToReadableStream(AppRSC).tee();
    const rscResponse = createFromReadableStream(rscReadableForFizz);
    const RscConsumer = () => rscResponse.readRoot();
    const AppSSR = (React.createElement(Html, { ...htmlOptions },
        React.createElement(ServerRequestProvider, { request: request, isRSC: false },
            React.createElement(ServerPropsProvider, { initialServerProps: state, setServerPropsForRsc: () => { } },
                React.createElement(PreloadQueries, { request: request },
                    React.createElement(Suspense, { fallback: null },
                        React.createElement(RscConsumer, null)),
                    React.createElement(Suspense, { fallback: null },
                        React.createElement(Analytics, null)))))));
    return { AppSSR, rscReadable: rscReadableForFlight };
}
function PreloadQueries({ request, children, }) {
    const preloadQueries = request.getPreloadQueries();
    preloadRequestCacheData(request, preloadQueries);
    return React.createElement(React.Fragment, null, children);
}
async function renderToBufferedString(ReactApp, { log, nonce }) {
    return new Promise(async (resolve, reject) => {
        if (__WORKER__) {
            try {
                const ssrReadable = await ssrRenderToReadableStream(ReactApp, {
                    nonce,
                    onError: (error) => log.error(error),
                });
                /**
                 * We want to wait until `allReady` resolves before fetching the
                 * stream body. Otherwise, React 18's streaming JS script/template tags
                 * will be included in the output and cause issues when loading
                 * the Client Components in the browser.
                 */
                await ssrReadable.allReady;
                resolve(bufferReadableStream(ssrReadable.getReader()));
            }
            catch (error) {
                reject(error);
            }
        }
        else {
            const writer = await createNodeWriter();
            const { pipe } = ssrRenderToPipeableStream(ReactApp, {
                nonce,
                /**
                 * When hydrating, we have to wait until `onCompleteAll` to avoid having
                 * `template` and `script` tags inserted and rendered as part of the hydration response.
                 */
                onAllReady() {
                    let data = '';
                    writer.on('data', (chunk) => (data += chunk.toString()));
                    writer.once('error', reject);
                    writer.once('end', () => resolve(data));
                    // Tell React to start writing to the writer
                    pipe(writer);
                },
                onShellError: reject,
                onError: (error) => log.error(error),
            });
        }
    });
}
export default renderHydrogen;
function startWritingHtmlToServerResponse(response, error) {
    if (!response.headersSent) {
        response.setHeader(CONTENT_TYPE, HTML_CONTENT_TYPE);
        response.write(DOCTYPE);
    }
    if (error) {
        // This error was delayed until the headers were properly sent.
        response.write(getErrorMarkup(error));
    }
}
function getResponseOptions({ headers, status, customStatus }, error) {
    var _a, _b;
    const responseInit = {};
    responseInit.headers = headers;
    if (error) {
        responseInit.status = 500;
    }
    else {
        responseInit.status = (_b = (_a = customStatus === null || customStatus === void 0 ? void 0 : customStatus.code) !== null && _a !== void 0 ? _a : status) !== null && _b !== void 0 ? _b : 200;
        if (customStatus === null || customStatus === void 0 ? void 0 : customStatus.text) {
            responseInit.statusText = customStatus.text;
        }
    }
    return responseInit;
}
function writeHeadToServerResponse(response, serverComponentResponse, log, error) {
    if (response.headersSent)
        return;
    log.trace('writeHeadToServerResponse');
    const { headers, status, statusText } = getResponseOptions(serverComponentResponse, error);
    response.statusCode = status;
    if (statusText) {
        response.statusMessage = statusText;
    }
    Object.entries(headers.raw()).forEach(([key, value]) => response.setHeader(key, value));
}
function isRedirect(response) {
    var _a, _b;
    const status = (_b = (_a = response.status) !== null && _a !== void 0 ? _a : response.statusCode) !== null && _b !== void 0 ? _b : 0;
    return status >= 300 && status < 400;
}
async function createNodeWriter() {
    // Importing 'stream' directly breaks Vite resolve
    // when building for workers, even though this code
    // does not run in a worker. Looks like tree-shaking
    // kicks in after the import analysis/bundle.
    const streamImport = __WORKER__ ? '' : 'stream';
    const { PassThrough } = await import(streamImport);
    return new PassThrough();
}
function flightContainer({ init, chunk, nonce, }) {
    let script = `<script${nonce ? ` nonce="${nonce}"` : ''}>`;
    if (init) {
        script += 'var __flight=[];';
    }
    if (chunk) {
        const normalizedChunk = chunk
            // 1. Duplicate the escape char (\) for already escaped characters (e.g. \n or \").
            .replace(/\\/g, String.raw `\\`)
            // 2. Escape existing backticks to allow wrapping the whole thing in `...`.
            .replace(/`/g, String.raw `\``);
        script += `__flight.push(\`${normalizedChunk}\`)`;
    }
    return script + '</script>';
}
function postRequestTasks(type, status, request, componentResponse) {
    logServerResponse(type, request, status);
    logCacheControlHeaders(type, request, componentResponse);
    logQueryTimings(type, request);
    request.savePreloadQueries();
}
