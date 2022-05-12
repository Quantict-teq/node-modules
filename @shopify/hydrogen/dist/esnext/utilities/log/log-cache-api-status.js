import { findQueryName } from './utils';
import { gray } from 'kolorist';
import { log } from '.';
export function logCacheApiStatus(status, url) {
    if (!log.options().showCacheApiStatus) {
        return;
    }
    log.debug(gray(`[Cache] ${status === null || status === void 0 ? void 0 : status.padEnd(8)} query ${findQueryName(url)}`));
}
