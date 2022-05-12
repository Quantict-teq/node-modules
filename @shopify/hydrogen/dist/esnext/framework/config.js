export function setConfig(config) {
    globalThis.__config = config;
}
export function getConfig() {
    return globalThis.__config || {};
}
