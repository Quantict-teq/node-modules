"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagUsages = exports.flagUsage = void 0;
const deps_1 = require("./deps");
// eslint-disable-next-line new-cap
const m = (0, deps_1.default)()
    .add('chalk', () => require('chalk'))
    // eslint-disable-next-line node/no-missing-require
    .add('util', () => require('./util'));
function flagUsage(flag, options = {}) {
    const label = [];
    if (flag.helpLabel) {
        label.push(flag.helpLabel);
    }
    else {
        if (flag.char)
            label.push(`-${flag.char}`);
        if (flag.name)
            label.push(` --${flag.name}`);
    }
    const usage = flag.type === 'option' ? ` ${flag.name.toUpperCase()}` : '';
    let description = flag.summary || flag.description || '';
    if (options.displayRequired && flag.required)
        description = `(required) ${description}`;
    description = description ? m.chalk.dim(description) : undefined;
    return [` ${label.join(',').trim()}${usage}`, description];
}
exports.flagUsage = flagUsage;
function flagUsages(flags, options = {}) {
    if (flags.length === 0)
        return [];
    const { sortBy } = m.util;
    return sortBy(flags, f => [f.char ? -1 : 1, f.char, f.name])
        .map(f => flagUsage(f, options));
}
exports.flagUsages = flagUsages;
