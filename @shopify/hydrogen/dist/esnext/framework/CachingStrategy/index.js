const PUBLIC = 'public';
const PRIVATE = 'private';
const NO_STORE = 'no-store';
const optionMapping = {
    maxAge: 'max-age',
    staleWhileRevalidate: 'stale-while-revalidate',
    sMaxAge: 's-maxage',
    staleIfError: 'stale-if-error',
};
export function generateCacheControlHeader(cacheOptions) {
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
export function NoStore() {
    return {
        mode: NO_STORE,
    };
}
function guardExpirableModeType(overrideOptions) {
    if ((overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) &&
        (overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) !== PUBLIC &&
        (overrideOptions === null || overrideOptions === void 0 ? void 0 : overrideOptions.mode) !== PRIVATE) {
        throw Error("'mode' must be either 'public' or 'private'");
    }
}
// 10 seconds
export function CacheSeconds(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1,
        staleWhileRevalidate: 9,
        ...overrideOptions,
    };
}
// 30 minutes
export function CacheMinutes(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 900,
        staleWhileRevalidate: 900,
        ...overrideOptions,
    };
}
// 1 hour
export function CacheHours(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1800,
        staleWhileRevalidate: 1800,
        ...overrideOptions,
    };
}
// 1 day
export function CacheDays(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 3600,
        staleWhileRevalidate: 82800,
        ...overrideOptions,
    };
}
// 2 weeks
export function CacheWeeks(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 604800,
        staleWhileRevalidate: 604800,
        ...overrideOptions,
    };
}
// 1 month
export function CacheMonths(overrideOptions) {
    guardExpirableModeType(overrideOptions);
    return {
        mode: PUBLIC,
        maxAge: 1296000,
        staleWhileRevalidate: 1296000,
        ...overrideOptions,
    };
}
export function CacheCustom(overrideOptions) {
    return overrideOptions;
}
