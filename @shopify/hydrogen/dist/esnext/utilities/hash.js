export function hashKey(key) {
    const rawKey = key instanceof Array ? key : [key];
    /**
     * TODO: Smarter hash
     */
    return rawKey.map((k) => JSON.stringify(k)).join('');
}
