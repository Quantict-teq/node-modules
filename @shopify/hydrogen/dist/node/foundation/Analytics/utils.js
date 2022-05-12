"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamedspacedEventname = void 0;
const const_1 = require("./const");
const RESERVED_EVENT_NAMES = Object.values(const_1.eventNames);
function getNamedspacedEventname(eventname) {
    // Any event name that is not in the reserved space will be prefix with `c-`
    return RESERVED_EVENT_NAMES.indexOf(eventname) === -1
        ? `c-${eventname}`
        : eventname;
}
exports.getNamedspacedEventname = getNamedspacedEventname;
