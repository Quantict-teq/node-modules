import { type Plugin } from 'vite';
declare const _default: () => Plugin;
/**
 * This dev server middleware prevents Vite from applying immutable cache control headers to client
 * components. These client components are part of the user's local source, but since they are
 * referenced via import globs in the `react-dom-server-vite` NPM package, Vite assumes they
 * are 3P deps that can be cached. This middleware responds to the requests early with `no-cache`.
 */
export default _default;
