"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = exports.findQueryName = void 0;
function findQueryName(key) {
    const decodeKey = decodeURIComponent(key);
    if (key.length < 100) {
        return key.replace('"__QUERY_CACHE_ID__"', '').replace(/"/g, '');
    }
    const match = decodeKey.match(/query ([^\s\()]*)\s?(|\(\{)/);
    if (match && match.length > 1) {
        return match[1];
    }
    return '<unknown>';
}
exports.findQueryName = findQueryName;
function parseUrl(type, url) {
    return type === 'rsc'
        ? decodeURIComponent(url.substring(url.indexOf('=') + 1))
        : url;
}
exports.parseUrl = parseUrl;
