"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpFormatter = void 0;
const Chalk = require("chalk");
const indent = require("indent-string");
const stripAnsi = require("strip-ansi");
const screen_1 = require("../screen");
const util_1 = require("./util");
const width = require('string-width');
const widestLine = require('widest-line');
const wrap = require('wrap-ansi');
const { bold, } = Chalk;
class HelpFormatter {
    constructor(config, opts = {}) {
        this.indentSpacing = 2;
        this.config = config;
        this.opts = { maxWidth: screen_1.stdtermwidth, ...opts };
        this.render = (0, util_1.template)(this);
    }
    /**
     * Wrap text according to `opts.maxWidth` which is typically set to the terminal width. All text
     * will be rendered before bring wrapped, otherwise it could mess up the lengths.
     *
     * A terminal will automatically wrap text, so this method is primarily used for indented
     * text. For indented text, specify the indentation so it is taken into account during wrapping.
     *
     * Here is an example of wrapping with indentation.
     * ```
     * <------ terminal window width ------>
     * <---------- no indentation --------->
     * This is my text that will be wrapped
     * once it passes maxWidth.
     *
     * <- indent -><------ text space ----->
     *             This is my text that will
     *             be wrapped once it passes
     *             maxWidth.
     *
     * <-- indent not taken into account ->
     *             This is my text that will
     * be wrapped
     *             once it passes maxWidth.
     * ```
     * @param body the text to wrap
     * @param spacing the indentation size to subtract from the terminal width
     * @returns the formatted wrapped text
     */
    wrap(body, spacing = this.indentSpacing) {
        return wrap(this.render(body), this.opts.maxWidth - spacing, { hard: true });
    }
    /**
     * Indent by `this.indentSpacing`. The text should be wrap based on terminal width before indented.
     *
     * In order to call indent multiple times on the same set or text, the caller must wrap based on
     * the number of times the text has been indented. For example.
     *
     * ```javascript
     * const body = `main line\n${indent(wrap('indented example line', 4))}`
     * const header = 'SECTION'
     * console.log(`${header}\n${indent(wrap(body))}`
     * ```
     * will output
     * ```
     * SECTION
     *   main line
     *     indented example line
     * ```
     *
     * If the terminal width was 24 and the `4` was not provided in the first wrap, it would like like the following.
     * ```
     * SECTION
     *   main line
     *     indented example
     *   line
     * ```
     * @param body the text to indent
     * @param spacing the final number of spaces this text will be indented
     * @return the formatted indented text
     */
    indent(body, spacing = this.indentSpacing) {
        return indent(body, spacing);
    }
    renderList(input, opts) {
        if (input.length === 0) {
            return '';
        }
        const renderMultiline = () => {
            let output = '';
            for (let [left, right] of input) {
                if (!left && !right)
                    continue;
                if (left) {
                    if (opts.stripAnsi)
                        left = stripAnsi(left);
                    output += this.wrap(left.trim(), opts.indentation);
                }
                if (right) {
                    if (opts.stripAnsi)
                        right = stripAnsi(right);
                    output += '\n';
                    output += this.indent(this.wrap(right.trim(), opts.indentation + 2), 4);
                }
                output += '\n\n';
            }
            return output.trim();
        };
        if (opts.multiline)
            return renderMultiline();
        const maxLength = widestLine(input.map(i => i[0]).join('\n'));
        let output = '';
        let spacer = opts.spacer || '\n';
        let cur = '';
        for (const [left, r] of input) {
            let right = r;
            if (cur) {
                output += spacer;
                output += cur;
            }
            cur = left || '';
            if (opts.stripAnsi)
                cur = stripAnsi(cur);
            if (!right) {
                cur = cur.trim();
                continue;
            }
            if (opts.stripAnsi)
                right = stripAnsi(right);
            right = this.wrap(right.trim(), opts.indentation + maxLength + 2);
            const [first, ...lines] = right.split('\n').map(s => s.trim());
            cur += ' '.repeat(maxLength - width(cur) + 2);
            cur += first;
            if (lines.length === 0) {
                continue;
            }
            // if we start putting too many lines down, render in multiline format
            if (lines.length > 4)
                return renderMultiline();
            // if spacer is not defined, separate all rows with a newline
            if (!opts.spacer)
                spacer = '\n';
            cur += '\n';
            cur += this.indent(lines.join('\n'), maxLength + 2);
        }
        if (cur) {
            output += spacer;
            output += cur;
        }
        return output.trim();
    }
    section(header, body) {
        // Always render template strings with the provided render function before wrapping and indenting
        let newBody;
        if (typeof body === 'string') {
            newBody = this.render(body);
        }
        else if (Array.isArray(body)) {
            newBody = body.map(entry => {
                if ('name' in entry) {
                    const tableEntry = entry;
                    return ([this.render(tableEntry.name), this.render(tableEntry.description)]);
                }
                const [left, right] = entry;
                return ([this.render(left), right && this.render(right)]);
            });
        }
        else if ('header' in body) {
            return this.section(body.header, body.body);
        }
        else {
            newBody = body
                .map((entry) => ([entry.name, entry.description]))
                .map(([left, right]) => ([this.render(left), right && this.render(right)]));
        }
        const output = [
            bold(header),
            this.indent(Array.isArray(newBody) ? this.renderList(newBody, { stripAnsi: this.opts.stripAnsi, indentation: 2 }) : newBody),
        ].join('\n');
        return this.opts.stripAnsi ? stripAnsi(output) : output;
    }
}
exports.HelpFormatter = HelpFormatter;
