"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheCustom = exports.CacheMonths = exports.CacheWeeks = exports.CacheDays = exports.CacheHours = exports.CacheMinutes = exports.CacheSeconds = exports.NoStore = exports.generateCacheControlHeader = void 0;
const PUBLIC = 'public';
const PRIVATE = 'private';
const NO_STORE = 'no-store';
const optionMapping = {
    maxAge: 'max-age',
    staleWhileRevalidate: 'stale-while-revalidate',
    sMaxAge: 's-maxage',
    staleIfError: 'stale-if-error',
};
function generateCacheControlHeader(cacheOptions) {
    const cacheControl = [];
    Object.keys(cacheOptions).forEach((key) => {
        if (key === 'mode') {
            cacheControl.push(cacheOptions[key]);
        }
        else if (optionMapping[key]) {
            cacheControl.push(`${optionMapping[key]}=${cacheOptions[key]}`);
        }
    });
    return cacheControl.join(', ');
}
exports.generateCacheControlHeader = generateCacheControlHeader;
function NoStore() {
    return {
        mode: NO_STORE,
    };
}
exports.NoStore = NoStore;
function guardExpirableModeType(overrideOptions) {
    if ((overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) &&
        (overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) !== PUBLIC &&
        (overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) !== PRIVATE) {
        throw Error("'mode' must be either 'public' or 'private'");
    }
}
// 10 seconds
function CacheSeconds(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1,
        staleWhileRevalidate: 9,
        ...overrideOptions,
    };
}
exports.CacheSeconds = CacheSeconds;
// 30 minutes
function CacheMinutes(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 900,
        staleWhileRevalidate: 900,
        ...overrideOptions,
    };
}
exports.CacheMinutes = CacheMinutes;
// 1 hour
function CacheHours(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1800,
        staleWhileRevalidate: 1800,
        ...overrideOptions,
    };
}
exports.CacheHours = CacheHours;
// 1 day
function CacheDays(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 3600,
        staleWhileRevalidate: 82800,
        ...overrideOptions,
    };
}
exports.CacheDays = CacheDays;
// 2 weeks
function CacheWeeks(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 604800,
        staleWhileRevalidate: 604800,
        ...overrideOptions,
    };
}
exports.CacheWeeks = CacheWeeks;
// 1 month
function CacheMonths(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1296000,
        staleWhileRevalidate: 1296000,
        ...overrideOptions,
    };
}
exports.CacheMonths = CacheMonths;
function CacheCustom(overrideOptions) {
    return overrideOptions;
}
exports.CacheCustom = CacheCustom;
