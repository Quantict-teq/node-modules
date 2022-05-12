import require$$0 from 'readline';
import require$$2 from 'events';

function _mergeNamespaces(n, m) {
	m.forEach(function (e) {
		e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
			if (k !== 'default' && !(k in n)) {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	});
	return Object.freeze(n);
}

var prompts$4 = {};

const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

const $ = {
	enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0',

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (str.includes(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			this.has.includes(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

var kleur = $;

var action$3 = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;

  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }

  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J

  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage'; // TODO create home() in prompt types (e.g. TextPrompt)

  if (key.name === 'home') return 'home'; // TODO create end() in prompt types (e.g. TextPrompt)

  if (key.name === 'end') return 'end';
  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';
  return false;
};

var strip$5 = str => {
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'].join('|');
  const RGX = new RegExp(pattern, 'g');
  return typeof str === 'string' ? str.replace(RGX, '') : str;
};

const ESC = '\x1B';
const CSI = `${ESC}[`;
const beep$2 = '\u0007';

const cursor$m = {
  to(x, y) {
    if (!y) return `${CSI}${x + 1}G`;
    return `${CSI}${y + 1};${x + 1}H`;
  },
  move(x, y) {
    let ret = '';

    if (x < 0) ret += `${CSI}${-x}D`;
    else if (x > 0) ret += `${CSI}${x}C`;

    if (y < 0) ret += `${CSI}${-y}A`;
    else if (y > 0) ret += `${CSI}${y}B`;

    return ret;
  },
  up: (count = 1) => `${CSI}${count}A`,
  down: (count = 1) => `${CSI}${count}B`,
  forward: (count = 1) => `${CSI}${count}C`,
  backward: (count = 1) => `${CSI}${count}D`,
  nextLine: (count = 1) => `${CSI}E`.repeat(count),
  prevLine: (count = 1) => `${CSI}F`.repeat(count),
  left: `${CSI}G`,
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  save: `${ESC}7`,
  restore: `${ESC}8`
};

const scroll = {
  up: (count = 1) => `${CSI}S`.repeat(count),
  down: (count = 1) => `${CSI}T`.repeat(count)
};

const erase$e = {
  screen: `${CSI}2J`,
  up: (count = 1) => `${CSI}1J`.repeat(count),
  down: (count = 1) => `${CSI}J`.repeat(count),
  line: `${CSI}2K`,
  lineEnd: `${CSI}K`,
  lineStart: `${CSI}1K`,
  lines(count) {
    let clear = '';
    for (let i = 0; i < count; i++)
      clear += this.line + (i < count - 1 ? cursor$m.up() : '');
    if (count)
      clear += cursor$m.left;
    return clear;
  }
};

var src = { cursor: cursor$m, scroll, erase: erase$e, beep: beep$2 };

function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

const strip$4 = strip$5;

const _require$a = src,
      erase$d = _require$a.erase,
      cursor$l = _require$a.cursor;

const width$1 = str => [...strip$4(str)].length;
/**
 * @param {string} prompt
 * @param {number} perLine
 */


var clear$j = function (prompt, perLine) {
  if (!perLine) return erase$d.line + cursor$l.to(0);
  let rows = 0;
  const lines = prompt.split(/\r?\n/);

  var _iterator = _createForOfIteratorHelper$1(lines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      let line = _step.value;
      rows += 1 + Math.floor(Math.max(width$1(line) - 1, 0) / perLine);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return erase$d.lines(rows);
};

const main$1 = {
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  radioOn: '◉',
  radioOff: '◯',
  tick: '✔',
  cross: '✖',
  ellipsis: '…',
  pointerSmall: '›',
  line: '─',
  pointer: '❯'
};
const win$1 = {
  arrowUp: main$1.arrowUp,
  arrowDown: main$1.arrowDown,
  arrowLeft: main$1.arrowLeft,
  arrowRight: main$1.arrowRight,
  radioOn: '(*)',
  radioOff: '( )',
  tick: '√',
  cross: '×',
  ellipsis: '...',
  pointerSmall: '»',
  line: '─',
  pointer: '>'
};
const figures$h = process.platform === 'win32' ? win$1 : main$1;
var figures_1$1 = figures$h;

const c$1 = kleur;

const figures$g = figures_1$1; // rendering user input.


const styles$1 = Object.freeze({
  password: {
    scale: 1,
    render: input => '*'.repeat(input.length)
  },
  emoji: {
    scale: 2,
    render: input => '😃'.repeat(input.length)
  },
  invisible: {
    scale: 0,
    render: input => ''
  },
  default: {
    scale: 1,
    render: input => `${input}`
  }
});

const render$1 = type => styles$1[type] || styles$1.default; // icon to signalize a prompt.


const symbols$1 = Object.freeze({
  aborted: c$1.red(figures$g.cross),
  done: c$1.green(figures$g.tick),
  exited: c$1.yellow(figures$g.cross),
  default: c$1.cyan('?')
});

const symbol$1 = (done, aborted, exited) => aborted ? symbols$1.aborted : exited ? symbols$1.exited : done ? symbols$1.done : symbols$1.default; // between the question and the user's input.


const delimiter$1 = completing => c$1.gray(completing ? figures$g.ellipsis : figures$g.pointerSmall);

const item$1 = (expandable, expanded) => c$1.gray(expandable ? expanded ? figures$g.pointerSmall : '+' : figures$g.line);

var style$j = {
  styles: styles$1,
  render: render$1,
  symbols: symbols$1,
  symbol: symbol$1,
  delimiter: delimiter$1,
  item: item$1
};

const strip$3 = strip$5;
/**
 * @param {string} msg
 * @param {number} perLine
 */


var lines$5 = function (msg, perLine) {
  let lines = String(strip$3(msg) || '').split(/\r?\n/);
  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
};

/**
 * @param {string} msg The message to wrap
 * @param {object} opts
 * @param {number|string} [opts.margin] Left margin
 * @param {number} opts.width Maximum characters per line including the margin
 */

var wrap$7 = (msg, opts = {}) => {
  const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(' ').join('') : opts.margin || '';
  const width = opts.width;
  return (msg || '').split(/\r?\n/g).map(line => line.split(/\s+/g).reduce((arr, w) => {
    if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;else arr.push(`${tab}${w}`);
    return arr;
  }, [tab]).join('\n')).join('\n');
};

/**
 * Determine what entries should be displayed on the screen, based on the
 * currently selected index and the maximum visible. Used in list-based
 * prompts like `select` and `multiselect`.
 *
 * @param {number} cursor the currently selected entry
 * @param {number} total the total entries available to display
 * @param {number} [maxVisible] the number of entries that can be displayed
 */

var entriesToDisplay$7 = (cursor, total, maxVisible) => {
  maxVisible = maxVisible || total;
  let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
  if (startIndex < 0) startIndex = 0;
  let endIndex = Math.min(startIndex + maxVisible, total);
  return {
    startIndex,
    endIndex
  };
};

var util$1 = {
  action: action$3,
  clear: clear$j,
  style: style$j,
  strip: strip$5,
  figures: figures_1$1,
  lines: lines$5,
  wrap: wrap$7,
  entriesToDisplay: entriesToDisplay$7
};

const readline$1 = require$$0;

const _require$9 = util$1,
      action$2 = _require$9.action;

const EventEmitter$1 = require$$2;

const _require2$9 = src,
      beep$1 = _require2$9.beep,
      cursor$k = _require2$9.cursor;

const color$j = kleur;
/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class Prompt$h extends EventEmitter$1 {
  constructor(opts = {}) {
    super();
    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;

    this.onRender = (opts.onRender || (() => void 0)).bind(this);

    const rl = readline$1.createInterface({
      input: this.in,
      escapeCodeTimeout: 50
    });
    readline$1.emitKeypressEvents(this.in, rl);
    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = ['SelectPrompt', 'MultiselectPrompt'].indexOf(this.constructor.name) > -1;

    const keypress = (str, key) => {
      let a = action$2(key, isSelect);

      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor$k.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep$1);
  }

  render() {
    this.onRender(color$j);
    if (this.firstRender) this.firstRender = false;
  }

}

var prompt$3 = Prompt$h;

function asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator$4(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep$4(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color$i = kleur;

const Prompt$g = prompt$3;

const _require$8 = src,
      erase$c = _require$8.erase,
      cursor$j = _require$8.cursor;

const _require2$8 = util$1,
      style$i = _require2$8.style,
      clear$i = _require2$8.clear,
      lines$4 = _require2$8.lines,
      figures$f = _require2$8.figures;
/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */


class TextPrompt$1 extends Prompt$g {
  constructor(opts = {}) {
    super(opts);
    this.transform = style$i.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.initial = opts.initial || ``;

    this.validator = opts.validate || (() => true);

    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.clear = clear$i(``, this.out.columns);
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color$i.gray(this.transform.render(this.initial));
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }

    this._value = v;
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.value = ``;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator$4(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === `string`) {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator$4(function* () {
      _this2.value = _this2.value || _this2.initial;
      _this2.cursorOffset = 0;
      _this2.cursor = _this2.rendered.length;
      yield _this2.validate();

      if (_this2.error) {
        _this2.red = true;

        _this2.fire();

        _this2.render();

        return;
      }

      _this2.done = true;
      _this2.aborted = false;

      _this2.fire();

      _this2.render();

      _this2.out.write('\n');

      _this2.close();
    })();
  }

  next() {
    if (!this.placeholder) return this.bell();
    this.value = this.initial;
    this.cursor = this.rendered.length;
    this.fire();
    this.render();
  }

  moveCursor(n) {
    if (this.placeholder) return;
    this.cursor = this.cursor + n;
    this.cursorOffset += n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${c}${s2}`;
    this.red = false;
    this.cursor = this.placeholder ? 0 : s1.length + 1;
    this.render();
  }

  delete() {
    if (this.isCursorAtStart()) return this.bell();
    let s1 = this.value.slice(0, this.cursor - 1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.red = false;

    if (this.isCursorAtStart()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
      this.moveCursor(-1);
    }

    this.render();
  }

  deleteForward() {
    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor + 1);
    this.value = `${s1}${s2}`;
    this.red = false;

    if (this.isCursorAtEnd()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
    }

    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) return this.bell();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
    this.moveCursor(1);
    this.render();
  }

  isCursorAtStart() {
    return this.cursor === 0 || this.placeholder && this.cursor === 1;
  }

  isCursorAtEnd() {
    return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
  }

  render() {
    if (this.closed) return;

    if (!this.firstRender) {
      if (this.outputError) this.out.write(cursor$j.down(lines$4(this.outputError, this.out.columns) - 1) + clear$i(this.outputError, this.out.columns));
      this.out.write(clear$i(this.outputText, this.out.columns));
    }

    super.render();
    this.outputError = '';
    this.outputText = [style$i.symbol(this.done, this.aborted), color$i.bold(this.msg), style$i.delimiter(this.done), this.red ? color$i.red(this.rendered) : this.rendered].join(` `);

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ' ' : figures$f.pointerSmall} ${color$i.red().italic(l)}`, ``);
    }

    this.out.write(erase$c.line + cursor$j.to(0) + this.outputText + cursor$j.save + this.outputError + cursor$j.restore + cursor$j.move(this.cursorOffset, 0));
  }

}

var text$1 = TextPrompt$1;

const color$h = kleur;

const Prompt$f = prompt$3;

const _require$7 = util$1,
      style$h = _require$7.style,
      clear$h = _require$7.clear,
      figures$e = _require$7.figures,
      wrap$6 = _require$7.wrap,
      entriesToDisplay$6 = _require$7.entriesToDisplay;

const _require2$7 = src,
      cursor$i = _require2$7.cursor;
/**
 * SelectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 */


class SelectPrompt$1 extends Prompt$f {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
    this.warn = opts.warn || '- This option is disabled';
    this.cursor = opts.initial || 0;
    this.choices = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string') ch = {
        title: ch,
        value: idx
      };
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value === undefined ? idx : ch.value),
        description: ch && ch.description,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = (this.choices[this.cursor] || {}).value;
    this.clear = clear$h('', this.out.columns);
    this.render();
  }

  moveCursor(n) {
    this.cursor = n;
    this.value = this.choices[n].value;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    if (!this.selection.disabled) {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    } else this.bell();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.moveCursor(this.choices.length - 1);
    } else {
      this.moveCursor(this.cursor - 1);
    }

    this.render();
  }

  down() {
    if (this.cursor === this.choices.length - 1) {
      this.moveCursor(0);
    } else {
      this.moveCursor(this.cursor + 1);
    }

    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.choices.length);
    this.render();
  }

  _(c, key) {
    if (c === ' ') return this.submit();
  }

  get selection() {
    return this.choices[this.cursor];
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$i.hide);else this.out.write(clear$h(this.outputText, this.out.columns));
    super.render();

    let _entriesToDisplay = entriesToDisplay$6(this.cursor, this.choices.length, this.optionsPerPage),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex; // Print prompt


    this.outputText = [style$h.symbol(this.done, this.aborted), color$h.bold(this.msg), style$h.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color$h.yellow(this.warn) : color$h.gray(this.hint)].join(' '); // Print choices

    if (!this.done) {
      this.outputText += '\n';

      for (let i = startIndex; i < endIndex; i++) {
        let title,
            prefix,
            desc = '',
            v = this.choices[i]; // Determine whether to display "more choices" indicators

        if (i === startIndex && startIndex > 0) {
          prefix = figures$e.arrowUp;
        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
          prefix = figures$e.arrowDown;
        } else {
          prefix = ' ';
        }

        if (v.disabled) {
          title = this.cursor === i ? color$h.gray().underline(v.title) : color$h.strikethrough().gray(v.title);
          prefix = (this.cursor === i ? color$h.bold().gray(figures$e.pointer) + ' ' : '  ') + prefix;
        } else {
          title = this.cursor === i ? color$h.cyan().underline(v.title) : v.title;
          prefix = (this.cursor === i ? color$h.cyan(figures$e.pointer) + ' ' : '  ') + prefix;

          if (v.description && this.cursor === i) {
            desc = ` - ${v.description}`;

            if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
              desc = '\n' + wrap$6(v.description, {
                margin: 3,
                width: this.out.columns
              });
            }
          }
        }

        this.outputText += `${prefix} ${title}${color$h.gray(desc)}\n`;
      }
    }

    this.out.write(this.outputText);
  }

}

var select$1 = SelectPrompt$1;

const color$g = kleur;

const Prompt$e = prompt$3;

const _require$6 = util$1,
      style$g = _require$6.style,
      clear$g = _require$6.clear;

const _require2$6 = src,
      cursor$h = _require2$6.cursor,
      erase$b = _require2$6.erase;
/**
 * TogglePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial=false] Default value
 * @param {String} [opts.active='no'] Active label
 * @param {String} [opts.inactive='off'] Inactive label
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class TogglePrompt$1 extends Prompt$e {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.value = !!opts.initial;
    this.active = opts.active || 'on';
    this.inactive = opts.inactive || 'off';
    this.initialValue = this.value;
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  deactivate() {
    if (this.value === false) return this.bell();
    this.value = false;
    this.render();
  }

  activate() {
    if (this.value === true) return this.bell();
    this.value = true;
    this.render();
  }

  delete() {
    this.deactivate();
  }

  left() {
    this.deactivate();
  }

  right() {
    this.activate();
  }

  down() {
    this.deactivate();
  }

  up() {
    this.activate();
  }

  next() {
    this.value = !this.value;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.value = !this.value;
    } else if (c === '1') {
      this.value = true;
    } else if (c === '0') {
      this.value = false;
    } else return this.bell();

    this.render();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$h.hide);else this.out.write(clear$g(this.outputText, this.out.columns));
    super.render();
    this.outputText = [style$g.symbol(this.done, this.aborted), color$g.bold(this.msg), style$g.delimiter(this.done), this.value ? this.inactive : color$g.cyan().underline(this.inactive), color$g.gray('/'), this.value ? color$g.cyan().underline(this.active) : this.active].join(' ');
    this.out.write(erase$b.line + cursor$h.to(0) + this.outputText);
  }

}

var toggle$1 = TogglePrompt$1;

class DatePart$j {
  constructor({
    token,
    date,
    parts,
    locales
  }) {
    this.token = token;
    this.date = date || new Date();
    this.parts = parts || [this];
    this.locales = locales || {};
  }

  up() {}

  down() {}

  next() {
    const currentIdx = this.parts.indexOf(this);
    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$j);
  }

  setTo(val) {}

  prev() {
    let parts = [].concat(this.parts).reverse();
    const currentIdx = parts.indexOf(this);
    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$j);
  }

  toString() {
    return String(this.date);
  }

}

var datepart$1 = DatePart$j;

const DatePart$i = datepart$1;

class Meridiem$3 extends DatePart$i {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }

  down() {
    this.up();
  }

  toString() {
    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }

}

var meridiem$1 = Meridiem$3;

const DatePart$h = datepart$1;

const pos$1 = n => {
  n = n % 10;
  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
};

class Day$3 extends DatePart$h {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setDate(this.date.getDate() + 1);
  }

  down() {
    this.date.setDate(this.date.getDate() - 1);
  }

  setTo(val) {
    this.date.setDate(parseInt(val.substr(-2)));
  }

  toString() {
    let date = this.date.getDate();
    let day = this.date.getDay();
    return this.token === 'DD' ? String(date).padStart(2, '0') : this.token === 'Do' ? date + pos$1(date) : this.token === 'd' ? day + 1 : this.token === 'ddd' ? this.locales.weekdaysShort[day] : this.token === 'dddd' ? this.locales.weekdays[day] : date;
  }

}

var day$1 = Day$3;

const DatePart$g = datepart$1;

class Hours$3 extends DatePart$g {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setHours(this.date.getHours() + 1);
  }

  down() {
    this.date.setHours(this.date.getHours() - 1);
  }

  setTo(val) {
    this.date.setHours(parseInt(val.substr(-2)));
  }

  toString() {
    let hours = this.date.getHours();
    if (/h/.test(this.token)) hours = hours % 12 || 12;
    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
  }

}

var hours$1 = Hours$3;

const DatePart$f = datepart$1;

class Milliseconds$3 extends DatePart$f {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
  }

  down() {
    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
  }

  setTo(val) {
    this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
  }

  toString() {
    return String(this.date.getMilliseconds()).padStart(4, '0').substr(0, this.token.length);
  }

}

var milliseconds$1 = Milliseconds$3;

const DatePart$e = datepart$1;

class Minutes$3 extends DatePart$e {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMinutes(this.date.getMinutes() + 1);
  }

  down() {
    this.date.setMinutes(this.date.getMinutes() - 1);
  }

  setTo(val) {
    this.date.setMinutes(parseInt(val.substr(-2)));
  }

  toString() {
    let m = this.date.getMinutes();
    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
  }

}

var minutes$1 = Minutes$3;

const DatePart$d = datepart$1;

class Month$3 extends DatePart$d {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMonth(this.date.getMonth() + 1);
  }

  down() {
    this.date.setMonth(this.date.getMonth() - 1);
  }

  setTo(val) {
    val = parseInt(val.substr(-2)) - 1;
    this.date.setMonth(val < 0 ? 0 : val);
  }

  toString() {
    let month = this.date.getMonth();
    let tl = this.token.length;
    return tl === 2 ? String(month + 1).padStart(2, '0') : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
  }

}

var month$1 = Month$3;

const DatePart$c = datepart$1;

class Seconds$3 extends DatePart$c {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setSeconds(this.date.getSeconds() + 1);
  }

  down() {
    this.date.setSeconds(this.date.getSeconds() - 1);
  }

  setTo(val) {
    this.date.setSeconds(parseInt(val.substr(-2)));
  }

  toString() {
    let s = this.date.getSeconds();
    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
  }

}

var seconds$1 = Seconds$3;

const DatePart$b = datepart$1;

class Year$3 extends DatePart$b {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setFullYear(this.date.getFullYear() + 1);
  }

  down() {
    this.date.setFullYear(this.date.getFullYear() - 1);
  }

  setTo(val) {
    this.date.setFullYear(val.substr(-4));
  }

  toString() {
    let year = String(this.date.getFullYear()).padStart(4, '0');
    return this.token.length === 2 ? year.substr(-2) : year;
  }

}

var year$1 = Year$3;

var dateparts$1 = {
  DatePart: datepart$1,
  Meridiem: meridiem$1,
  Day: day$1,
  Hours: hours$1,
  Milliseconds: milliseconds$1,
  Minutes: minutes$1,
  Month: month$1,
  Seconds: seconds$1,
  Year: year$1
};

function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator$3(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color$f = kleur;

const Prompt$d = prompt$3;

const _require$5 = util$1,
      style$f = _require$5.style,
      clear$f = _require$5.clear,
      figures$d = _require$5.figures;

const _require2$5 = src,
      erase$a = _require2$5.erase,
      cursor$g = _require2$5.cursor;

const _require3 = dateparts$1,
      DatePart$a = _require3.DatePart,
      Meridiem$2 = _require3.Meridiem,
      Day$2 = _require3.Day,
      Hours$2 = _require3.Hours,
      Milliseconds$2 = _require3.Milliseconds,
      Minutes$2 = _require3.Minutes,
      Month$2 = _require3.Month,
      Seconds$2 = _require3.Seconds,
      Year$2 = _require3.Year;

const regex$1 = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
const regexGroups$1 = {
  1: ({
    token
  }) => token.replace(/\\(.)/g, '$1'),
  2: opts => new Day$2(opts),
  // Day // TODO
  3: opts => new Month$2(opts),
  // Month
  4: opts => new Year$2(opts),
  // Year
  5: opts => new Meridiem$2(opts),
  // AM/PM // TODO (special)
  6: opts => new Hours$2(opts),
  // Hours
  7: opts => new Minutes$2(opts),
  // Minutes
  8: opts => new Seconds$2(opts),
  // Seconds
  9: opts => new Milliseconds$2(opts) // Fractional seconds

};
const dfltLocales$1 = {
  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
};
/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {String} [opts.mask] The format mask
 * @param {object} [opts.locales] The date locales
 * @param {String} [opts.error] The error message shown on invalid value
 * @param {Function} [opts.validate] Function to validate the submitted value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */

class DatePrompt$1 extends Prompt$d {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = 0;
    this.typed = '';
    this.locales = Object.assign(dfltLocales$1, opts.locales);
    this._date = opts.initial || new Date();
    this.errorMsg = opts.error || 'Please Enter A Valid Value';

    this.validator = opts.validate || (() => true);

    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
    this.clear = clear$f('', this.out.columns);
    this.render();
  }

  get value() {
    return this.date;
  }

  get date() {
    return this._date;
  }

  set date(date) {
    if (date) this._date.setTime(date.getTime());
  }

  set mask(mask) {
    let result;
    this.parts = [];

    while (result = regex$1.exec(mask)) {
      let match = result.shift();
      let idx = result.findIndex(gr => gr != null);
      this.parts.push(idx in regexGroups$1 ? regexGroups$1[idx]({
        token: result[idx] || match,
        date: this.date,
        parts: this.parts,
        locales: this.locales
      }) : result[idx] || match);
    }

    let parts = this.parts.reduce((arr, i) => {
      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string') arr[arr.length - 1] += i;else arr.push(i);
      return arr;
    }, []);
    this.parts.splice(0);
    this.parts.push(...parts);
    this.reset();
  }

  moveCursor(n) {
    this.typed = '';
    this.cursor = n;
    this.fire();
  }

  reset() {
    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart$a));
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator$3(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === 'string') {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator$3(function* () {
      yield _this2.validate();

      if (_this2.error) {
        _this2.color = 'red';

        _this2.fire();

        _this2.render();

        return;
      }

      _this2.done = true;
      _this2.aborted = false;

      _this2.fire();

      _this2.render();

      _this2.out.write('\n');

      _this2.close();
    })();
  }

  up() {
    this.typed = '';
    this.parts[this.cursor].up();
    this.render();
  }

  down() {
    this.typed = '';
    this.parts[this.cursor].down();
    this.render();
  }

  left() {
    let prev = this.parts[this.cursor].prev();
    if (prev == null) return this.bell();
    this.moveCursor(this.parts.indexOf(prev));
    this.render();
  }

  right() {
    let next = this.parts[this.cursor].next();
    if (next == null) return this.bell();
    this.moveCursor(this.parts.indexOf(next));
    this.render();
  }

  next() {
    let next = this.parts[this.cursor].next();
    this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex(part => part instanceof DatePart$a));
    this.render();
  }

  _(c) {
    if (/\d/.test(c)) {
      this.typed += c;
      this.parts[this.cursor].setTo(this.typed);
      this.render();
    }
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$g.hide);else this.out.write(clear$f(this.outputText, this.out.columns));
    super.render(); // Print prompt

    this.outputText = [style$f.symbol(this.done, this.aborted), color$f.bold(this.msg), style$f.delimiter(false), this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color$f.cyan().underline(p.toString()) : p), []).join('')].join(' '); // Print error

    if (this.error) {
      this.outputText += this.errorMsg.split('\n').reduce((a, l, i) => a + `\n${i ? ` ` : figures$d.pointerSmall} ${color$f.red().italic(l)}`, ``);
    }

    this.out.write(erase$a.line + cursor$g.to(0) + this.outputText);
  }

}

var date$1 = DatePrompt$1;

function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator$2(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color$e = kleur;

const Prompt$c = prompt$3;

const _require$4 = src,
      cursor$f = _require$4.cursor,
      erase$9 = _require$4.erase;

const _require2$4 = util$1,
      style$e = _require2$4.style,
      figures$c = _require2$4.figures,
      clear$e = _require2$4.clear,
      lines$3 = _require2$4.lines;

const isNumber$1 = /[0-9]/;

const isDef$1 = any => any !== undefined;

const round$1 = (number, precision) => {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};
/**
 * NumberPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {Number} [opts.initial] Default value
 * @param {Number} [opts.max=+Infinity] Max value
 * @param {Number} [opts.min=-Infinity] Min value
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */


class NumberPrompt$1 extends Prompt$c {
  constructor(opts = {}) {
    super(opts);
    this.transform = style$e.render(opts.style);
    this.msg = opts.message;
    this.initial = isDef$1(opts.initial) ? opts.initial : '';
    this.float = !!opts.float;
    this.round = opts.round || 2;
    this.inc = opts.increment || 1;
    this.min = isDef$1(opts.min) ? opts.min : -Infinity;
    this.max = isDef$1(opts.max) ? opts.max : Infinity;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;

    this.validator = opts.validate || (() => true);

    this.color = `cyan`;
    this.value = ``;
    this.typed = ``;
    this.lastHit = 0;
    this.render();
  }

  set value(v) {
    if (!v && v !== 0) {
      this.placeholder = true;
      this.rendered = color$e.gray(this.transform.render(`${this.initial}`));
      this._value = ``;
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(`${round$1(v, this.round)}`);
      this._value = round$1(v, this.round);
    }

    this.fire();
  }

  get value() {
    return this._value;
  }

  parse(x) {
    return this.float ? parseFloat(x) : parseInt(x);
  }

  valid(c) {
    return c === `-` || c === `.` && this.float || isNumber$1.test(c);
  }

  reset() {
    this.typed = ``;
    this.value = ``;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator$2(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === `string`) {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator$2(function* () {
      yield _this2.validate();

      if (_this2.error) {
        _this2.color = `red`;

        _this2.fire();

        _this2.render();

        return;
      }

      let x = _this2.value;
      _this2.value = x !== `` ? x : _this2.initial;
      _this2.done = true;
      _this2.aborted = false;
      _this2.error = false;

      _this2.fire();

      _this2.render();

      _this2.out.write(`\n`);

      _this2.close();
    })();
  }

  up() {
    this.typed = ``;

    if (this.value === '') {
      this.value = this.min - this.inc;
    }

    if (this.value >= this.max) return this.bell();
    this.value += this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  down() {
    this.typed = ``;

    if (this.value === '') {
      this.value = this.min + this.inc;
    }

    if (this.value <= this.min) return this.bell();
    this.value -= this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  delete() {
    let val = this.value.toString();
    if (val.length === 0) return this.bell();
    this.value = this.parse(val = val.slice(0, -1)) || ``;

    if (this.value !== '' && this.value < this.min) {
      this.value = this.min;
    }

    this.color = `cyan`;
    this.fire();
    this.render();
  }

  next() {
    this.value = this.initial;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (!this.valid(c)) return this.bell();
    const now = Date.now();
    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed

    this.typed += c;
    this.lastHit = now;
    this.color = `cyan`;
    if (c === `.`) return this.fire();
    this.value = Math.min(this.parse(this.typed), this.max);
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
    this.fire();
    this.render();
  }

  render() {
    if (this.closed) return;

    if (!this.firstRender) {
      if (this.outputError) this.out.write(cursor$f.down(lines$3(this.outputError, this.out.columns) - 1) + clear$e(this.outputError, this.out.columns));
      this.out.write(clear$e(this.outputText, this.out.columns));
    }

    super.render();
    this.outputError = ''; // Print prompt

    this.outputText = [style$e.symbol(this.done, this.aborted), color$e.bold(this.msg), style$e.delimiter(this.done), !this.done || !this.done && !this.placeholder ? color$e[this.color]().underline(this.rendered) : this.rendered].join(` `); // Print error

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures$c.pointerSmall} ${color$e.red().italic(l)}`, ``);
    }

    this.out.write(erase$9.line + cursor$f.to(0) + this.outputText + cursor$f.save + this.outputError + cursor$f.restore);
  }

}

var number$1 = NumberPrompt$1;

const color$d = kleur;

const _require$3 = src,
      cursor$e = _require$3.cursor;

const Prompt$b = prompt$3;

const _require2$3 = util$1,
      clear$d = _require2$3.clear,
      figures$b = _require2$3.figures,
      style$d = _require2$3.style,
      wrap$5 = _require2$3.wrap,
      entriesToDisplay$5 = _require2$3.entriesToDisplay;
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class MultiselectPrompt$3 extends Prompt$b {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.minSelected = opts.min;
    this.showMinError = false;
    this.maxChoices = opts.max;
    this.instructions = opts.instructions;
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string') ch = {
        title: ch,
        value: idx
      };
      return {
        title: ch && (ch.title || ch.value || ch),
        description: ch && ch.description,
        value: ch && (ch.value === undefined ? idx : ch.value),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear$d('', this.out.columns);

    if (!opts.overrideRender) {
      this.render();
    }
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    const selected = this.value.filter(e => e.selected);

    if (this.minSelected && selected.length < this.minSelected) {
      this.showMinError = true;
      this.render();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }

  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.value.length - 1;
    } else {
      this.cursor--;
    }

    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }

    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  toggleAll() {
    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
      return this.bell();
    }

    const newSelected = !this.value[this.cursor].selected;
    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else if (c === 'a') {
      this.toggleAll();
    } else {
      return this.bell();
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }

      return '\nInstructions:\n' + `    ${figures$b.arrowUp}/${figures$b.arrowDown}: Highlight option\n` + `    ${figures$b.arrowLeft}/${figures$b.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : '') + `    enter/return: Complete answer`;
    }

    return '';
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const prefix = (v.selected ? color$d.green(figures$b.radioOn) : figures$b.radioOff) + ' ' + arrowIndicator + ' ';
    let title, desc;

    if (v.disabled) {
      title = cursor === i ? color$d.gray().underline(v.title) : color$d.strikethrough().gray(v.title);
    } else {
      title = cursor === i ? color$d.cyan().underline(v.title) : v.title;

      if (cursor === i && v.description) {
        desc = ` - ${v.description}`;

        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = '\n' + wrap$5(v.description, {
            margin: prefix.length,
            width: this.out.columns
          });
        }
      }
    }

    return prefix + title + color$d.gray(desc || '');
  } // shared with autocompleteMultiselect


  paginateOptions(options) {
    if (options.length === 0) {
      return color$d.red('No matches for this query.');
    }

    let _entriesToDisplay = entriesToDisplay$5(this.cursor, options.length, this.optionsPerPage),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex;

    let prefix,
        styledOptions = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (i === startIndex && startIndex > 0) {
        prefix = figures$b.arrowUp;
      } else if (i === endIndex - 1 && endIndex < options.length) {
        prefix = figures$b.arrowDown;
      } else {
        prefix = ' ';
      }

      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
    }

    return '\n' + styledOptions.join('\n');
  } // shared with autocomleteMultiselect


  renderOptions(options) {
    if (!this.done) {
      return this.paginateOptions(options);
    }

    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
    }

    const output = [color$d.gray(this.hint), this.renderInstructions()];

    if (this.value[this.cursor].disabled) {
      output.push(color$d.yellow(this.warn));
    }

    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$e.hide);
    super.render(); // print prompt

    let prompt = [style$d.symbol(this.done, this.aborted), color$d.bold(this.msg), style$d.delimiter(false), this.renderDoneOrInstructions()].join(' ');

    if (this.showMinError) {
      prompt += color$d.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }

    prompt += this.renderOptions(this.value);
    this.out.write(this.clear + prompt);
    this.clear = clear$d(prompt, this.out.columns);
  }

}

var multiselect$1 = MultiselectPrompt$3;

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator$1(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color$c = kleur;

const Prompt$a = prompt$3;

const _require$2 = src,
      erase$8 = _require$2.erase,
      cursor$d = _require$2.cursor;

const _require2$2 = util$1,
      style$c = _require2$2.style,
      clear$c = _require2$2.clear,
      figures$a = _require2$2.figures,
      wrap$4 = _require2$2.wrap,
      entriesToDisplay$4 = _require2$2.entriesToDisplay;

const getVal$1 = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);

const getTitle$1 = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);

const getIndex$1 = (arr, valOrTitle) => {
  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
  return index > -1 ? index : undefined;
};
/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of auto-complete choices objects
 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
 * @param {Number} [opts.limit=10] Max number of results to show
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.fallback] Fallback message - initial to default value
 * @param {String} [opts.initial] Index of the default value
 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.noMatches] The no matches found label
 */


class AutocompletePrompt$1 extends Prompt$a {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.suggest = opts.suggest;
    this.choices = opts.choices;
    this.initial = typeof opts.initial === 'number' ? opts.initial : getIndex$1(opts.choices, opts.initial);
    this.select = this.initial || opts.cursor || 0;
    this.i18n = {
      noMatches: opts.noMatches || 'no matches found'
    };
    this.fallback = opts.fallback || this.initial;
    this.clearFirst = opts.clearFirst || false;
    this.suggestions = [];
    this.input = '';
    this.limit = opts.limit || 10;
    this.cursor = 0;
    this.transform = style$c.render(opts.style);
    this.scale = this.transform.scale;
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = clear$c('', this.out.columns);
    this.complete(this.render);
    this.render();
  }

  set fallback(fb) {
    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
  }

  get fallback() {
    let choice;
    if (typeof this._fb === 'number') choice = this.choices[this._fb];else if (typeof this._fb === 'string') choice = {
      title: this._fb
    };
    return choice || this._fb || {
      title: this.i18n.noMatches
    };
  }

  moveSelect(i) {
    this.select = i;
    if (this.suggestions.length > 0) this.value = getVal$1(this.suggestions, i);else this.value = this.fallback.value;
    this.fire();
  }

  complete(cb) {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      const p = _this.completing = _this.suggest(_this.input, _this.choices);

      const suggestions = yield p;
      if (_this.completing !== p) return;
      _this.suggestions = suggestions.map((s, i, arr) => ({
        title: getTitle$1(arr, i),
        value: getVal$1(arr, i),
        description: s.description
      }));
      _this.completing = false;
      const l = Math.max(suggestions.length - 1, 0);

      _this.moveSelect(Math.min(l, _this.select));

      cb && cb();
    })();
  }

  reset() {
    this.input = '';
    this.complete(() => {
      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
      this.render();
    });
    this.render();
  }

  exit() {
    if (this.clearFirst && this.input.length > 0) {
      this.reset();
    } else {
      this.done = this.exited = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  abort() {
    this.done = this.aborted = true;
    this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${c}${s2}`;
    this.cursor = s1.length + 1;
    this.complete(this.render);
    this.render();
  }

  delete() {
    if (this.cursor === 0) return this.bell();
    let s1 = this.input.slice(0, this.cursor - 1);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.cursor = this.cursor - 1;
    this.render();
  }

  deleteForward() {
    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor + 1);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.render();
  }

  first() {
    this.moveSelect(0);
    this.render();
  }

  last() {
    this.moveSelect(this.suggestions.length - 1);
    this.render();
  }

  up() {
    if (this.select === 0) {
      this.moveSelect(this.suggestions.length - 1);
    } else {
      this.moveSelect(this.select - 1);
    }

    this.render();
  }

  down() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else {
      this.moveSelect(this.select + 1);
    }

    this.render();
  }

  next() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else this.moveSelect(this.select + 1);

    this.render();
  }

  nextPage() {
    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
    this.render();
  }

  prevPage() {
    this.moveSelect(Math.max(this.select - this.limit, 0));
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor = this.cursor - 1;
    this.render();
  }

  right() {
    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
    this.cursor = this.cursor + 1;
    this.render();
  }

  renderOption(v, hovered, isStart, isEnd) {
    let desc;
    let prefix = isStart ? figures$a.arrowUp : isEnd ? figures$a.arrowDown : ' ';
    let title = hovered ? color$c.cyan().underline(v.title) : v.title;
    prefix = (hovered ? color$c.cyan(figures$a.pointer) + ' ' : '  ') + prefix;

    if (v.description) {
      desc = ` - ${v.description}`;

      if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
        desc = '\n' + wrap$4(v.description, {
          margin: 3,
          width: this.out.columns
        });
      }
    }

    return prefix + ' ' + title + color$c.gray(desc || '');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$d.hide);else this.out.write(clear$c(this.outputText, this.out.columns));
    super.render();

    let _entriesToDisplay = entriesToDisplay$4(this.select, this.choices.length, this.limit),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex;

    this.outputText = [style$c.symbol(this.done, this.aborted, this.exited), color$c.bold(this.msg), style$c.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(' ');

    if (!this.done) {
      const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join('\n');
      this.outputText += `\n` + (suggestions || color$c.gray(this.fallback.title));
    }

    this.out.write(erase$8.line + cursor$d.to(0) + this.outputText);
  }

}

var autocomplete$1 = AutocompletePrompt$1;

const color$b = kleur;

const _require$1 = src,
      cursor$c = _require$1.cursor;

const MultiselectPrompt$2 = multiselect$1;

const _require2$1 = util$1,
      clear$b = _require2$1.clear,
      style$b = _require2$1.style,
      figures$9 = _require2$1.figures;
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class AutocompleteMultiselectPrompt$1 extends MultiselectPrompt$2 {
  constructor(opts = {}) {
    opts.overrideRender = true;
    super(opts);
    this.inputValue = '';
    this.clear = clear$b('', this.out.columns);
    this.filteredOptions = this.value;
    this.render();
  }

  last() {
    this.cursor = this.filteredOptions.length - 1;
    this.render();
  }

  next() {
    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.filteredOptions.length - 1;
    } else {
      this.cursor--;
    }

    this.render();
  }

  down() {
    if (this.cursor === this.filteredOptions.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }

    this.render();
  }

  left() {
    this.filteredOptions[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.filteredOptions[this.cursor].selected = true;
    this.render();
  }

  delete() {
    if (this.inputValue.length) {
      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
      this.updateFilteredOptions();
    }
  }

  updateFilteredOptions() {
    const currentHighlight = this.filteredOptions[this.cursor];
    this.filteredOptions = this.value.filter(v => {
      if (this.inputValue) {
        if (typeof v.title === 'string') {
          if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
            return true;
          }
        }

        if (typeof v.value === 'string') {
          if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
            return true;
          }
        }

        return false;
      }

      return true;
    });
    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight);
    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.filteredOptions[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  handleInputChange(c) {
    this.inputValue = this.inputValue + c;
    this.updateFilteredOptions();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else {
      this.handleInputChange(c);
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }

      return `
Instructions:
    ${figures$9.arrowUp}/${figures$9.arrowDown}: Highlight option
    ${figures$9.arrowLeft}/${figures$9.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
    }

    return '';
  }

  renderCurrentInput() {
    return `
Filtered results for: ${this.inputValue ? this.inputValue : color$b.gray('Enter something to filter')}\n`;
  }

  renderOption(cursor, v, i) {
    let title;
    if (v.disabled) title = cursor === i ? color$b.gray().underline(v.title) : color$b.strikethrough().gray(v.title);else title = cursor === i ? color$b.cyan().underline(v.title) : v.title;
    return (v.selected ? color$b.green(figures$9.radioOn) : figures$9.radioOff) + '  ' + title;
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
    }

    const output = [color$b.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
      output.push(color$b.yellow(this.warn));
    }

    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$c.hide);
    super.render(); // print prompt

    let prompt = [style$b.symbol(this.done, this.aborted), color$b.bold(this.msg), style$b.delimiter(false), this.renderDoneOrInstructions()].join(' ');

    if (this.showMinError) {
      prompt += color$b.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }

    prompt += this.renderOptions(this.filteredOptions);
    this.out.write(this.clear + prompt);
    this.clear = clear$b(prompt, this.out.columns);
  }

}

var autocompleteMultiselect$1 = AutocompleteMultiselectPrompt$1;

const color$a = kleur;

const Prompt$9 = prompt$3;

const _require = util$1,
      style$a = _require.style,
      clear$a = _require.clear;

const _require2 = src,
      erase$7 = _require2.erase,
      cursor$b = _require2.cursor;
/**
 * ConfirmPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial] Default value (true/false)
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.yes] The "Yes" label
 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
 * @param {String} [opts.no] The "No" label
 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
 */


class ConfirmPrompt$1 extends Prompt$9 {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.value = opts.initial;
    this.initialValue = !!opts.initial;
    this.yesMsg = opts.yes || 'yes';
    this.yesOption = opts.yesOption || '(Y/n)';
    this.noMsg = opts.no || 'no';
    this.noOption = opts.noOption || '(y/N)';
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || false;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }

    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }

    return this.bell();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$b.hide);else this.out.write(clear$a(this.outputText, this.out.columns));
    super.render();
    this.outputText = [style$a.symbol(this.done, this.aborted), color$a.bold(this.msg), style$a.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.noMsg : color$a.gray(this.initialValue ? this.yesOption : this.noOption)].join(' ');
    this.out.write(erase$7.line + cursor$b.to(0) + this.outputText);
  }

}

var confirm$1 = ConfirmPrompt$1;

var elements$1 = {
  TextPrompt: text$1,
  SelectPrompt: select$1,
  TogglePrompt: toggle$1,
  DatePrompt: date$1,
  NumberPrompt: number$1,
  MultiselectPrompt: multiselect$1,
  AutocompletePrompt: autocomplete$1,
  AutocompleteMultiselectPrompt: autocompleteMultiselect$1,
  ConfirmPrompt: confirm$1
};

(function (exports) {

const $ = exports;

const el = elements$1;

const noop = v => v;

function toPrompt(type, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    const onExit = opts.onExit || noop;
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('exit', x => res(onExit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}
/**
 * Text prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.text = args => toPrompt('TextPrompt', args);
/**
 * Password prompt with masked input
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.password = args => {
  args.style = 'password';
  return $.text(args);
};
/**
 * Prompt where input is invisible, like sudo
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.invisible = args => {
  args.style = 'invisible';
  return $.text(args);
};
/**
 * Number prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.number = args => toPrompt('NumberPrompt', args);
/**
 * Date prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.date = args => toPrompt('DatePrompt', args);
/**
 * Classic yes/no prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.confirm = args => toPrompt('ConfirmPrompt', args);
/**
 * List prompt, split intput string by `seperator`
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input, in form of an `Array`
 */


$.list = args => {
  const sep = args.separator || ',';
  return toPrompt('TextPrompt', args, {
    onSubmit: str => str.split(sep).map(s => s.trim())
  });
};
/**
 * Toggle/switch prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.toggle = args => toPrompt('TogglePrompt', args);
/**
 * Interactive select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [args.initial] Index of default value
 * @param {String} [args.hint] Hint to display
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.select = args => toPrompt('SelectPrompt', args);
/**
 * Interactive multi-select / autocompleteMultiselect prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.multiselect = args => {
  args.choices = [].concat(args.choices || []);

  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

  return toPrompt('MultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

$.autocompleteMultiselect = args => {
  args.choices = [].concat(args.choices || []);

  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

  return toPrompt('AutocompleteMultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

const byTitle = (input, choices) => Promise.resolve(choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
/**
 * Interactive auto-complete prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
 * @param {number} [args.limit=10] Max number of results to show
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {String} [args.initial] Index of the default value
 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {String} [args.fallback] Fallback message - defaults to initial value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.autocomplete = args => {
  args.suggest = args.suggest || byTitle;
  args.choices = [].concat(args.choices || []);
  return toPrompt('AutocompletePrompt', args);
};
}(prompts$4));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const prompts$3 = prompts$4;

const passOn$1 = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];

const noop$1 = () => {};
/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @param {Function} [onSubmit] Callback function called on prompt submit
 * @param {Function} [onCancel] Callback function called on cancel/abort
 * @returns {Object} Object with values from user input
 */


function prompt$2() {
  return _prompt.apply(this, arguments);
}

function _prompt() {
  _prompt = _asyncToGenerator(function* (questions = [], {
    onSubmit = noop$1,
    onCancel = noop$1
  } = {}) {
    const answers = {};
    const override = prompt$2._override || {};
    questions = [].concat(questions);
    let answer, question, quit, name, type, lastPrompt;

    const getFormattedAnswer = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
        if (!skipValidation && question.validate && question.validate(answer) !== true) {
          return;
        }

        return question.format ? yield question.format(answer, answers) : answer;
      });

      return function getFormattedAnswer(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    var _iterator = _createForOfIteratorHelper(questions),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        question = _step.value;
        var _question = question;
        name = _question.name;
        type = _question.type;

        // evaluate type first and skip if type is a falsy value
        if (typeof type === 'function') {
          type = yield type(answer, _objectSpread({}, answers), question);
          question['type'] = type;
        }

        if (!type) continue; // if property is a function, invoke it unless it's a special function

        for (let key in question) {
          if (passOn$1.includes(key)) continue;
          let value = question[key];
          question[key] = typeof value === 'function' ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
        }

        lastPrompt = question;

        if (typeof question.message !== 'string') {
          throw new Error('prompt message is required');
        } // update vars in case they changed


        var _question2 = question;
        name = _question2.name;
        type = _question2.type;

        if (prompts$3[type] === void 0) {
          throw new Error(`prompt type (${type}) is not defined`);
        }

        if (override[question.name] !== undefined) {
          answer = yield getFormattedAnswer(question, override[question.name]);

          if (answer !== undefined) {
            answers[name] = answer;
            continue;
          }
        }

        try {
          // Get the injected answer if there is one or prompt the user
          answer = prompt$2._injected ? getInjectedAnswer$1(prompt$2._injected, question.initial) : yield prompts$3[type](question);
          answers[name] = answer = yield getFormattedAnswer(question, answer, true);
          quit = yield onSubmit(question, answer, answers);
        } catch (err) {
          quit = !(yield onCancel(question, answers));
        }

        if (quit) return answers;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return answers;
  });
  return _prompt.apply(this, arguments);
}

function getInjectedAnswer$1(injected, deafultValue) {
  const answer = injected.shift();

  if (answer instanceof Error) {
    throw answer;
  }

  return answer === undefined ? deafultValue : answer;
}

function inject$1(answers) {
  prompt$2._injected = (prompt$2._injected || []).concat(answers);
}

function override$1(answers) {
  prompt$2._override = Object.assign({}, answers);
}

var dist = Object.assign(prompt$2, {
  prompt: prompt$2,
  prompts: prompts$3,
  inject: inject$1,
  override: override$1
});

var prompts$2 = {};

var action$1 = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;
  
  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }
  
  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J
  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage';
  // TODO create home() in prompt types (e.g. TextPrompt)
  if (key.name === 'home') return 'home';
  // TODO create end() in prompt types (e.g. TextPrompt)
  if (key.name === 'end') return 'end';

  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';

  return false;
};

var strip$2 = str => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
  ].join('|');

  const RGX = new RegExp(pattern, 'g');
  return typeof str === 'string' ? str.replace(RGX, '') : str;
};

const strip$1 = strip$2;
const { erase: erase$6, cursor: cursor$a } = src;

const width = str => [...strip$1(str)].length;

/**
 * @param {string} prompt
 * @param {number} perLine
 */
var clear$9 = function(prompt, perLine) {
  if (!perLine) return erase$6.line + cursor$a.to(0);

  let rows = 0;
  const lines = prompt.split(/\r?\n/);
  for (let line of lines) {
    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
  }

  return erase$6.lines(rows);
};

const main = {
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  radioOn: '◉',
  radioOff: '◯',
  tick: '✔',	
  cross: '✖',	
  ellipsis: '…',	
  pointerSmall: '›',	
  line: '─',	
  pointer: '❯'	
};	
const win = {
  arrowUp: main.arrowUp,
  arrowDown: main.arrowDown,
  arrowLeft: main.arrowLeft,
  arrowRight: main.arrowRight,
  radioOn: '(*)',
  radioOff: '( )',	
  tick: '√',	
  cross: '×',	
  ellipsis: '...',	
  pointerSmall: '»',	
  line: '─',	
  pointer: '>'	
};	
const figures$8 = process.platform === 'win32' ? win : main;	

 var figures_1 = figures$8;

const c = kleur;
const figures$7 = figures_1;

// rendering user input.
const styles = Object.freeze({
  password: { scale: 1, render: input => '*'.repeat(input.length) },
  emoji: { scale: 2, render: input => '😃'.repeat(input.length) },
  invisible: { scale: 0, render: input => '' },
  default: { scale: 1, render: input => `${input}` }
});
const render = type => styles[type] || styles.default;

// icon to signalize a prompt.
const symbols = Object.freeze({
  aborted: c.red(figures$7.cross),
  done: c.green(figures$7.tick),
  exited: c.yellow(figures$7.cross),
  default: c.cyan('?')
});

const symbol = (done, aborted, exited) =>
  aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;

// between the question and the user's input.
const delimiter = completing =>
  c.gray(completing ? figures$7.ellipsis : figures$7.pointerSmall);

const item = (expandable, expanded) =>
  c.gray(expandable ? (expanded ? figures$7.pointerSmall : '+') : figures$7.line);

var style$9 = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item
};

const strip = strip$2;

/**
 * @param {string} msg
 * @param {number} perLine
 */
var lines$2 = function (msg, perLine) {
  let lines = String(strip(msg) || '').split(/\r?\n/);

  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine))
      .reduce((a, b) => a + b);
};

/**
 * @param {string} msg The message to wrap
 * @param {object} opts
 * @param {number|string} [opts.margin] Left margin
 * @param {number} opts.width Maximum characters per line including the margin
 */
var wrap$3 = (msg, opts = {}) => {
  const tab = Number.isSafeInteger(parseInt(opts.margin))
    ? new Array(parseInt(opts.margin)).fill(' ').join('')
    : (opts.margin || '');

  const width = opts.width;

  return (msg || '').split(/\r?\n/g)
    .map(line => line
      .split(/\s+/g)
      .reduce((arr, w) => {
        if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
          arr[arr.length - 1] += ` ${w}`;
        else arr.push(`${tab}${w}`);
        return arr;
      }, [ tab ])
      .join('\n'))
    .join('\n');
};

/**
 * Determine what entries should be displayed on the screen, based on the
 * currently selected index and the maximum visible. Used in list-based
 * prompts like `select` and `multiselect`.
 *
 * @param {number} cursor the currently selected entry
 * @param {number} total the total entries available to display
 * @param {number} [maxVisible] the number of entries that can be displayed
 */
var entriesToDisplay$3 = (cursor, total, maxVisible)  => {
  maxVisible = maxVisible || total;

  let startIndex = Math.min(total- maxVisible, cursor - Math.floor(maxVisible / 2));
  if (startIndex < 0) startIndex = 0;

  let endIndex = Math.min(startIndex + maxVisible, total);

  return { startIndex, endIndex };
};

var util = {
  action: action$1,
  clear: clear$9,
  style: style$9,
  strip: strip$2,
  figures: figures_1,
  lines: lines$2,
  wrap: wrap$3,
  entriesToDisplay: entriesToDisplay$3
};

const readline = require$$0;
const { action } = util;
const EventEmitter = require$$2;
const { beep, cursor: cursor$9 } = src;
const color$9 = kleur;

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class Prompt$8 extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;
    this.onRender = (opts.onRender || (() => void 0)).bind(this);
    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      let a = action(key, isSelect);
      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor$9.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    this.onRender(color$9);
    if (this.firstRender) this.firstRender = false;
  }
}

var prompt$1 = Prompt$8;

const color$8 = kleur;
const Prompt$7 = prompt$1;
const { erase: erase$5, cursor: cursor$8 } = src;
const { style: style$8, clear: clear$8, lines: lines$1, figures: figures$6 } = util;

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class TextPrompt extends Prompt$7 {
  constructor(opts={}) {
    super(opts);
    this.transform = style$8.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.initial = opts.initial || ``;
    this.validator = opts.validate || (() => true);
    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.clear = clear$8(``, this.out.columns);
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color$8.gray(this.transform.render(this.initial));
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }
    this._value = v;
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.value = ``;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === `string`) {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    this.value = this.value || this.initial;
    this.cursorOffset = 0;
    this.cursor = this.rendered.length;
    await this.validate();
    if (this.error) {
      this.red = true;
      this.fire();
      this.render();
      return;
    }
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  next() {
    if (!this.placeholder) return this.bell();
    this.value = this.initial;
    this.cursor = this.rendered.length;
    this.fire();
    this.render();
  }

  moveCursor(n) {
    if (this.placeholder) return;
    this.cursor = this.cursor+n;
    this.cursorOffset += n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${c}${s2}`;
    this.red = false;
    this.cursor = this.placeholder ? 0 : s1.length+1;
    this.render();
  }

  delete() {
    if (this.isCursorAtStart()) return this.bell();
    let s1 = this.value.slice(0, this.cursor-1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.red = false;
    if (this.isCursorAtStart()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
      this.moveCursor(-1);
    }
    this.render();
  }

  deleteForward() {
    if(this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor+1);
    this.value = `${s1}${s2}`;
    this.red = false;
    if (this.isCursorAtEnd()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
    }
    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) return this.bell();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    this.moveCursor(1);
    this.render();
  }

  isCursorAtStart() {
    return this.cursor === 0 || (this.placeholder && this.cursor === 1);
  }

  isCursorAtEnd() {
    return this.cursor === this.rendered.length || (this.placeholder && this.cursor === this.rendered.length + 1)
  }

  render() {
    if (this.closed) return;
    if (!this.firstRender) {
      if (this.outputError)
        this.out.write(cursor$8.down(lines$1(this.outputError, this.out.columns) - 1) + clear$8(this.outputError, this.out.columns));
      this.out.write(clear$8(this.outputText, this.out.columns));
    }
    super.render();
    this.outputError = '';

    this.outputText = [
      style$8.symbol(this.done, this.aborted),
      color$8.bold(this.msg),
      style$8.delimiter(this.done),
      this.red ? color$8.red(this.rendered) : this.rendered
    ].join(` `);

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`)
          .reduce((a, l, i) => a + `\n${i ? ' ' : figures$6.pointerSmall} ${color$8.red().italic(l)}`, ``);
    }

    this.out.write(erase$5.line + cursor$8.to(0) + this.outputText + cursor$8.save + this.outputError + cursor$8.restore + cursor$8.move(this.cursorOffset, 0));
  }
}

var text = TextPrompt;

const color$7 = kleur;
const Prompt$6 = prompt$1;
const { style: style$7, clear: clear$7, figures: figures$5, wrap: wrap$2, entriesToDisplay: entriesToDisplay$2 } = util;
const { cursor: cursor$7 } = src;

/**
 * SelectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 */
class SelectPrompt extends Prompt$6 {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
    this.warn = opts.warn || '- This option is disabled';
    this.cursor = opts.initial || 0;
    this.choices = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value === undefined ? idx : ch.value),
        description: ch && ch.description,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = (this.choices[this.cursor] || {}).value;
    this.clear = clear$7('', this.out.columns);
    this.render();
  }

  moveCursor(n) {
    this.cursor = n;
    this.value = this.choices[n].value;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    if (!this.selection.disabled) {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    } else
      this.bell();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.moveCursor(this.choices.length - 1);
    } else {
      this.moveCursor(this.cursor - 1);
    }
    this.render();
  }

  down() {
    if (this.cursor === this.choices.length - 1) {
      this.moveCursor(0);
    } else {
      this.moveCursor(this.cursor + 1);
    }
    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.choices.length);
    this.render();
  }

  _(c, key) {
    if (c === ' ') return this.submit();
  }

  get selection() {
    return this.choices[this.cursor];
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$7.hide);
    else this.out.write(clear$7(this.outputText, this.out.columns));
    super.render();

    let { startIndex, endIndex } = entriesToDisplay$2(this.cursor, this.choices.length, this.optionsPerPage);

    // Print prompt
    this.outputText = [
      style$7.symbol(this.done, this.aborted),
      color$7.bold(this.msg),
      style$7.delimiter(false),
      this.done ? this.selection.title : this.selection.disabled
          ? color$7.yellow(this.warn) : color$7.gray(this.hint)
    ].join(' ');

    // Print choices
    if (!this.done) {
      this.outputText += '\n';
      for (let i = startIndex; i < endIndex; i++) {
        let title, prefix, desc = '', v = this.choices[i];

        // Determine whether to display "more choices" indicators
        if (i === startIndex && startIndex > 0) {
          prefix = figures$5.arrowUp;
        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
          prefix = figures$5.arrowDown;
        } else {
          prefix = ' ';
        }

        if (v.disabled) {
          title = this.cursor === i ? color$7.gray().underline(v.title) : color$7.strikethrough().gray(v.title);
          prefix = (this.cursor === i ? color$7.bold().gray(figures$5.pointer) + ' ' : '  ') + prefix;
        } else {
          title = this.cursor === i ? color$7.cyan().underline(v.title) : v.title;
          prefix = (this.cursor === i ? color$7.cyan(figures$5.pointer) + ' ' : '  ') + prefix;
          if (v.description && this.cursor === i) {
            desc = ` - ${v.description}`;
            if (prefix.length + title.length + desc.length >= this.out.columns
                || v.description.split(/\r?\n/).length > 1) {
              desc = '\n' + wrap$2(v.description, { margin: 3, width: this.out.columns });
            }
          }
        }

        this.outputText += `${prefix} ${title}${color$7.gray(desc)}\n`;
      }
    }

    this.out.write(this.outputText);
  }
}

var select = SelectPrompt;

const color$6 = kleur;
const Prompt$5 = prompt$1;
const { style: style$6, clear: clear$6 } = util;
const { cursor: cursor$6, erase: erase$4 } = src;

/**
 * TogglePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial=false] Default value
 * @param {String} [opts.active='no'] Active label
 * @param {String} [opts.inactive='off'] Inactive label
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class TogglePrompt extends Prompt$5 {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.value = !!opts.initial;
    this.active = opts.active || 'on';
    this.inactive = opts.inactive || 'off';
    this.initialValue = this.value;
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  deactivate() {
    if (this.value === false) return this.bell();
    this.value = false;
    this.render();
  }

  activate() {
    if (this.value === true) return this.bell();
    this.value = true;
    this.render();
  }

  delete() {
    this.deactivate();
  }
  left() {
    this.deactivate();
  }
  right() {
    this.activate();
  }
  down() {
    this.deactivate();
  }
  up() {
    this.activate();
  }

  next() {
    this.value = !this.value;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.value = !this.value;
    } else if (c === '1') {
      this.value = true;
    } else if (c === '0') {
      this.value = false;
    } else return this.bell();
    this.render();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$6.hide);
    else this.out.write(clear$6(this.outputText, this.out.columns));
    super.render();

    this.outputText = [
      style$6.symbol(this.done, this.aborted),
      color$6.bold(this.msg),
      style$6.delimiter(this.done),
      this.value ? this.inactive : color$6.cyan().underline(this.inactive),
      color$6.gray('/'),
      this.value ? color$6.cyan().underline(this.active) : this.active
    ].join(' ');

    this.out.write(erase$4.line + cursor$6.to(0) + this.outputText);
  }
}

var toggle = TogglePrompt;

class DatePart$9 {
  constructor({token, date, parts, locales}) {
    this.token = token;
    this.date = date || new Date();
    this.parts = parts || [this];
    this.locales = locales || {};
  }

  up() {}

  down() {}

  next() {
    const currentIdx = this.parts.indexOf(this);
    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$9);
  }

  setTo(val) {}

  prev() {
    let parts = [].concat(this.parts).reverse();
    const currentIdx = parts.indexOf(this);
    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart$9);
  }

  toString() {
    return String(this.date);
  }
}

var datepart = DatePart$9;

const DatePart$8 = datepart;

class Meridiem$1 extends DatePart$8 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }

  down() {
    this.up();
  }

  toString() {
    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }
}

var meridiem = Meridiem$1;

const DatePart$7 = datepart;

const pos = n => {
  n = n % 10;
  return n === 1 ? 'st'
       : n === 2 ? 'nd'
       : n === 3 ? 'rd'
       : 'th';
};

class Day$1 extends DatePart$7 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setDate(this.date.getDate() + 1);
  }

  down() {
    this.date.setDate(this.date.getDate() - 1);
  }

  setTo(val) {
    this.date.setDate(parseInt(val.substr(-2)));
  }

  toString() {
    let date = this.date.getDate();
    let day = this.date.getDay();
    return this.token === 'DD' ? String(date).padStart(2, '0')
         : this.token === 'Do' ? date + pos(date)
         : this.token === 'd' ? day + 1
         : this.token === 'ddd' ? this.locales.weekdaysShort[day]
         : this.token === 'dddd' ? this.locales.weekdays[day]
         : date;
  }
}

var day = Day$1;

const DatePart$6 = datepart;

class Hours$1 extends DatePart$6 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setHours(this.date.getHours() + 1);
  }

  down() {
    this.date.setHours(this.date.getHours() - 1);
  }

  setTo(val) {
    this.date.setHours(parseInt(val.substr(-2)));
  }

  toString() {
    let hours = this.date.getHours();
    if (/h/.test(this.token))
      hours = (hours % 12) || 12;
    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
  }
}

var hours = Hours$1;

const DatePart$5 = datepart;

class Milliseconds$1 extends DatePart$5 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
  }

  down() {
    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
  }

  setTo(val) {
    this.date.setMilliseconds(parseInt(val.substr(-(this.token.length))));
  }

  toString() {
    return String(this.date.getMilliseconds()).padStart(4, '0')
                                              .substr(0, this.token.length);
  }
}

var milliseconds = Milliseconds$1;

const DatePart$4 = datepart;

class Minutes$1 extends DatePart$4 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMinutes(this.date.getMinutes() + 1);
  }

  down() {
    this.date.setMinutes(this.date.getMinutes() - 1);
  }

  setTo(val) {
    this.date.setMinutes(parseInt(val.substr(-2)));
  }

  toString() {
    let m = this.date.getMinutes();
    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
  }
}

var minutes = Minutes$1;

const DatePart$3 = datepart;

class Month$1 extends DatePart$3 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMonth(this.date.getMonth() + 1);
  }

  down() {
    this.date.setMonth(this.date.getMonth() - 1);
  }

  setTo(val) {
    val = parseInt(val.substr(-2)) - 1;
    this.date.setMonth(val < 0 ? 0 : val);
  }

  toString() {
    let month = this.date.getMonth();
    let tl = this.token.length;
    return tl === 2 ? String(month + 1).padStart(2, '0')
           : tl === 3 ? this.locales.monthsShort[month]
             : tl === 4 ? this.locales.months[month]
               : String(month + 1);
  }
}

var month = Month$1;

const DatePart$2 = datepart;

class Seconds$1 extends DatePart$2 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setSeconds(this.date.getSeconds() + 1);
  }

  down() {
    this.date.setSeconds(this.date.getSeconds() - 1);
  }

  setTo(val) {
    this.date.setSeconds(parseInt(val.substr(-2)));
  }

  toString() {
    let s = this.date.getSeconds();
    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
  }
}

var seconds = Seconds$1;

const DatePart$1 = datepart;

class Year$1 extends DatePart$1 {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setFullYear(this.date.getFullYear() + 1);
  }

  down() {
    this.date.setFullYear(this.date.getFullYear() - 1);
  }

  setTo(val) {
    this.date.setFullYear(val.substr(-4));
  }

  toString() {
    let year = String(this.date.getFullYear()).padStart(4, '0');
    return this.token.length === 2 ? year.substr(-2) : year;
  }
}

var year = Year$1;

var dateparts = {
  DatePart: datepart,
  Meridiem: meridiem,
  Day: day,
  Hours: hours,
  Milliseconds: milliseconds,
  Minutes: minutes,
  Month: month,
  Seconds: seconds,
  Year: year,
};

const color$5 = kleur;
const Prompt$4 = prompt$1;
const { style: style$5, clear: clear$5, figures: figures$4 } = util;
const { erase: erase$3, cursor: cursor$5 } = src;
const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = dateparts;

const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
const regexGroups = {
  1: ({token}) => token.replace(/\\(.)/g, '$1'),
  2: (opts) => new Day(opts), // Day // TODO
  3: (opts) => new Month(opts), // Month
  4: (opts) => new Year(opts), // Year
  5: (opts) => new Meridiem(opts), // AM/PM // TODO (special)
  6: (opts) => new Hours(opts), // Hours
  7: (opts) => new Minutes(opts), // Minutes
  8: (opts) => new Seconds(opts), // Seconds
  9: (opts) => new Milliseconds(opts), // Fractional seconds
};

const dfltLocales = {
  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
};


/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {String} [opts.mask] The format mask
 * @param {object} [opts.locales] The date locales
 * @param {String} [opts.error] The error message shown on invalid value
 * @param {Function} [opts.validate] Function to validate the submitted value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class DatePrompt extends Prompt$4 {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = 0;
    this.typed = '';
    this.locales = Object.assign(dfltLocales, opts.locales);
    this._date = opts.initial || new Date();
    this.errorMsg = opts.error || 'Please Enter A Valid Value';
    this.validator = opts.validate || (() => true);
    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
    this.clear = clear$5('', this.out.columns);
    this.render();
  }

  get value() {
    return this.date
  }

  get date() {
    return this._date;
  }

  set date(date) {
    if (date) this._date.setTime(date.getTime());
  }

  set mask(mask) {
    let result;
    this.parts = [];
    while(result = regex.exec(mask)) {
      let match = result.shift();
      let idx = result.findIndex(gr => gr != null);
      this.parts.push(idx in regexGroups
        ? regexGroups[idx]({ token: result[idx] || match, date: this.date, parts: this.parts, locales: this.locales })
        : result[idx] || match);
    }

    let parts = this.parts.reduce((arr, i) => {
      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string')
        arr[arr.length - 1] += i;
      else arr.push(i);
      return arr;
    }, []);

    this.parts.splice(0);
    this.parts.push(...parts);
    this.reset();
  }

  moveCursor(n) {
    this.typed = '';
    this.cursor = n;
    this.fire();
  }

  reset() {
    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart));
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === 'string') {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    await this.validate();
    if (this.error) {
      this.color = 'red';
      this.fire();
      this.render();
      return;
    }
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  up() {
    this.typed = '';
    this.parts[this.cursor].up();
    this.render();
  }

  down() {
    this.typed = '';
    this.parts[this.cursor].down();
    this.render();
  }

  left() {
    let prev = this.parts[this.cursor].prev();
    if (prev == null) return this.bell();
    this.moveCursor(this.parts.indexOf(prev));
    this.render();
  }

  right() {
    let next = this.parts[this.cursor].next();
    if (next == null) return this.bell();
    this.moveCursor(this.parts.indexOf(next));
    this.render();
  }

  next() {
    let next = this.parts[this.cursor].next();
    this.moveCursor(next
      ? this.parts.indexOf(next)
      : this.parts.findIndex((part) => part instanceof DatePart));
    this.render();
  }

  _(c) {
    if (/\d/.test(c)) {
      this.typed += c;
      this.parts[this.cursor].setTo(this.typed);
      this.render();
    }
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$5.hide);
    else this.out.write(clear$5(this.outputText, this.out.columns));
    super.render();

    // Print prompt
    this.outputText = [
      style$5.symbol(this.done, this.aborted),
      color$5.bold(this.msg),
      style$5.delimiter(false),
      this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color$5.cyan().underline(p.toString()) : p), [])
          .join('')
    ].join(' ');

    // Print error
    if (this.error) {
      this.outputText += this.errorMsg.split('\n').reduce(
          (a, l, i) => a + `\n${i ? ` ` : figures$4.pointerSmall} ${color$5.red().italic(l)}`, ``);
    }

    this.out.write(erase$3.line + cursor$5.to(0) + this.outputText);
  }
}

var date = DatePrompt;

const color$4 = kleur;
const Prompt$3 = prompt$1;
const { cursor: cursor$4, erase: erase$2 } = src;
const { style: style$4, figures: figures$3, clear: clear$4, lines } = util;

const isNumber = /[0-9]/;
const isDef = any => any !== undefined;
const round = (number, precision) => {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

/**
 * NumberPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {Number} [opts.initial] Default value
 * @param {Number} [opts.max=+Infinity] Max value
 * @param {Number} [opts.min=-Infinity] Min value
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class NumberPrompt extends Prompt$3 {
  constructor(opts={}) {
    super(opts);
    this.transform = style$4.render(opts.style);
    this.msg = opts.message;
    this.initial = isDef(opts.initial) ? opts.initial : '';
    this.float = !!opts.float;
    this.round = opts.round || 2;
    this.inc = opts.increment || 1;
    this.min = isDef(opts.min) ? opts.min : -Infinity;
    this.max = isDef(opts.max) ? opts.max : Infinity;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.validator = opts.validate || (() => true);
    this.color = `cyan`;
    this.value = ``;
    this.typed = ``;
    this.lastHit = 0;
    this.render();
  }

  set value(v) {
    if (!v && v !== 0) {
      this.placeholder = true;
      this.rendered = color$4.gray(this.transform.render(`${this.initial}`));
      this._value = ``;
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(`${round(v, this.round)}`);
      this._value = round(v, this.round);
    }
    this.fire();
  }

  get value() {
    return this._value;
  }

  parse(x) {
    return this.float ? parseFloat(x) : parseInt(x);
  }

  valid(c) {
    return c === `-` || c === `.` && this.float || isNumber.test(c)
  }

  reset() {
    this.typed = ``;
    this.value = ``;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === `string`) {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    await this.validate();
    if (this.error) {
      this.color = `red`;
      this.fire();
      this.render();
      return;
    }
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = true;
    this.aborted = false;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  up() {
    this.typed = ``;
    if(this.value === '') {
      this.value = this.min - this.inc;
    }
    if (this.value >= this.max) return this.bell();
    this.value += this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  down() {
    this.typed = ``;
    if(this.value === '') {
      this.value = this.min + this.inc;
    }
    if (this.value <= this.min) return this.bell();
    this.value -= this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  delete() {
    let val = this.value.toString();
    if (val.length === 0) return this.bell();
    this.value = this.parse((val = val.slice(0, -1))) || ``;
    if (this.value !== '' && this.value < this.min) {
      this.value = this.min;
    }
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  next() {
    this.value = this.initial;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (!this.valid(c)) return this.bell();

    const now = Date.now();
    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed
    this.typed += c;
    this.lastHit = now;
    this.color = `cyan`;

    if (c === `.`) return this.fire();

    this.value = Math.min(this.parse(this.typed), this.max);
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
    this.fire();
    this.render();
  }

  render() {
    if (this.closed) return;
    if (!this.firstRender) {
      if (this.outputError)
        this.out.write(cursor$4.down(lines(this.outputError, this.out.columns) - 1) + clear$4(this.outputError, this.out.columns));
      this.out.write(clear$4(this.outputText, this.out.columns));
    }
    super.render();
    this.outputError = '';

    // Print prompt
    this.outputText = [
      style$4.symbol(this.done, this.aborted),
      color$4.bold(this.msg),
      style$4.delimiter(this.done),
      !this.done || (!this.done && !this.placeholder)
          ? color$4[this.color]().underline(this.rendered) : this.rendered
    ].join(` `);

    // Print error
    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`)
          .reduce((a, l, i) => a + `\n${i ? ` ` : figures$3.pointerSmall} ${color$4.red().italic(l)}`, ``);
    }

    this.out.write(erase$2.line + cursor$4.to(0) + this.outputText + cursor$4.save + this.outputError + cursor$4.restore);
  }
}

var number = NumberPrompt;

const color$3 = kleur;
const { cursor: cursor$3 } = src;
const Prompt$2 = prompt$1;
const { clear: clear$3, figures: figures$2, style: style$3, wrap: wrap$1, entriesToDisplay: entriesToDisplay$1 } = util;

/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class MultiselectPrompt$1 extends Prompt$2 {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.minSelected = opts.min;
    this.showMinError = false;
    this.maxChoices = opts.max;
    this.instructions = opts.instructions;
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        description: ch && ch.description,
        value: ch && (ch.value === undefined ? idx : ch.value),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear$3('', this.out.columns);
    if (!opts.overrideRender) {
      this.render();
    }
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    const selected = this.value
      .filter(e => e.selected);
    if (this.minSelected && selected.length < this.minSelected) {
      this.showMinError = true;
      this.render();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.value.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  toggleAll() {
    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
      return this.bell();
    }

    const newSelected = !this.value[this.cursor].selected;
    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else if (c === 'a') {
      this.toggleAll();
    } else {
      return this.bell();
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }
      return '\nInstructions:\n'
        + `    ${figures$2.arrowUp}/${figures$2.arrowDown}: Highlight option\n`
        + `    ${figures$2.arrowLeft}/${figures$2.arrowRight}/[space]: Toggle selection\n`
        + (this.maxChoices === undefined ? `    a: Toggle all\n` : '')
        + `    enter/return: Complete answer`;
    }
    return '';
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const prefix = (v.selected ? color$3.green(figures$2.radioOn) : figures$2.radioOff) + ' ' + arrowIndicator + ' ';
    let title, desc;

    if (v.disabled) {
      title = cursor === i ? color$3.gray().underline(v.title) : color$3.strikethrough().gray(v.title);
    } else {
      title = cursor === i ? color$3.cyan().underline(v.title) : v.title;
      if (cursor === i && v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns
          || v.description.split(/\r?\n/).length > 1) {
          desc = '\n' + wrap$1(v.description, { margin: prefix.length, width: this.out.columns });
        }
      }
    }

    return prefix + title + color$3.gray(desc || '');
  }

  // shared with autocompleteMultiselect
  paginateOptions(options) {
    if (options.length === 0) {
      return color$3.red('No matches for this query.');
    }

    let { startIndex, endIndex } = entriesToDisplay$1(this.cursor, options.length, this.optionsPerPage);
    let prefix, styledOptions = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (i === startIndex && startIndex > 0) {
        prefix = figures$2.arrowUp;
      } else if (i === endIndex - 1 && endIndex < options.length) {
        prefix = figures$2.arrowDown;
      } else {
        prefix = ' ';
      }
      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
    }

    return '\n' + styledOptions.join('\n');
  }

  // shared with autocomleteMultiselect
  renderOptions(options) {
    if (!this.done) {
      return this.paginateOptions(options);
    }
    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
    }

    const output = [color$3.gray(this.hint), this.renderInstructions()];

    if (this.value[this.cursor].disabled) {
      output.push(color$3.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$3.hide);
    super.render();

    // print prompt
    let prompt = [
      style$3.symbol(this.done, this.aborted),
      color$3.bold(this.msg),
      style$3.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');
    if (this.showMinError) {
      prompt += color$3.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }
    prompt += this.renderOptions(this.value);

    this.out.write(this.clear + prompt);
    this.clear = clear$3(prompt, this.out.columns);
  }
}

var multiselect = MultiselectPrompt$1;

const color$2 = kleur;
const Prompt$1 = prompt$1;
const { erase: erase$1, cursor: cursor$2 } = src;
const { style: style$2, clear: clear$2, figures: figures$1, wrap, entriesToDisplay } = util;

const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
const getIndex = (arr, valOrTitle) => {
  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
  return index > -1 ? index : undefined;
};

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of auto-complete choices objects
 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
 * @param {Number} [opts.limit=10] Max number of results to show
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.fallback] Fallback message - initial to default value
 * @param {String} [opts.initial] Index of the default value
 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.noMatches] The no matches found label
 */
class AutocompletePrompt extends Prompt$1 {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.suggest = opts.suggest;
    this.choices = opts.choices;
    this.initial = typeof opts.initial === 'number'
      ? opts.initial
      : getIndex(opts.choices, opts.initial);
    this.select = this.initial || opts.cursor || 0;
    this.i18n = { noMatches: opts.noMatches || 'no matches found' };
    this.fallback = opts.fallback || this.initial;
    this.clearFirst = opts.clearFirst || false;
    this.suggestions = [];
    this.input = '';
    this.limit = opts.limit || 10;
    this.cursor = 0;
    this.transform = style$2.render(opts.style);
    this.scale = this.transform.scale;
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = clear$2('', this.out.columns);
    this.complete(this.render);
    this.render();
  }

  set fallback(fb) {
    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
  }

  get fallback() {
    let choice;
    if (typeof this._fb === 'number')
      choice = this.choices[this._fb];
    else if (typeof this._fb === 'string')
      choice = { title: this._fb };
    return choice || this._fb || { title: this.i18n.noMatches };
  }

  moveSelect(i) {
    this.select = i;
    if (this.suggestions.length > 0)
      this.value = getVal(this.suggestions, i);
    else this.value = this.fallback.value;
    this.fire();
  }

  async complete(cb) {
    const p = (this.completing = this.suggest(this.input, this.choices));
    const suggestions = await p;

    if (this.completing !== p) return;
    this.suggestions = suggestions
      .map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
    this.completing = false;
    const l = Math.max(suggestions.length - 1, 0);
    this.moveSelect(Math.min(l, this.select));

    cb && cb();
  }

  reset() {
    this.input = '';
    this.complete(() => {
      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
      this.render();
    });
    this.render();
  }

  exit() {
    if (this.clearFirst && this.input.length > 0) {
      this.reset();
    } else {
      this.done = this.exited = true; 
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  abort() {
    this.done = this.aborted = true;
    this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${c}${s2}`;
    this.cursor = s1.length+1;
    this.complete(this.render);
    this.render();
  }

  delete() {
    if (this.cursor === 0) return this.bell();
    let s1 = this.input.slice(0, this.cursor-1);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.cursor = this.cursor-1;
    this.render();
  }

  deleteForward() {
    if(this.cursor*this.scale >= this.rendered.length) return this.bell();
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor+1);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.render();
  }

  first() {
    this.moveSelect(0);
    this.render();
  }

  last() {
    this.moveSelect(this.suggestions.length - 1);
    this.render();
  }

  up() {
    if (this.select === 0) {
      this.moveSelect(this.suggestions.length - 1);
    } else {
      this.moveSelect(this.select - 1);
    }
    this.render();
  }

  down() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else {
      this.moveSelect(this.select + 1);
    }
    this.render();
  }

  next() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else this.moveSelect(this.select + 1);
    this.render();
  }

  nextPage() {
    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
    this.render();
  }

  prevPage() {
    this.moveSelect(Math.max(this.select - this.limit, 0));
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor = this.cursor-1;
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length) return this.bell();
    this.cursor = this.cursor+1;
    this.render();
  }

  renderOption(v, hovered, isStart, isEnd) {
    let desc;
    let prefix = isStart ? figures$1.arrowUp : isEnd ? figures$1.arrowDown : ' ';
    let title = hovered ? color$2.cyan().underline(v.title) : v.title;
    prefix = (hovered ? color$2.cyan(figures$1.pointer) + ' ' : '  ') + prefix;
    if (v.description) {
      desc = ` - ${v.description}`;
      if (prefix.length + title.length + desc.length >= this.out.columns
        || v.description.split(/\r?\n/).length > 1) {
        desc = '\n' + wrap(v.description, { margin: 3, width: this.out.columns });
      }
    }
    return prefix + ' ' + title + color$2.gray(desc || '');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$2.hide);
    else this.out.write(clear$2(this.outputText, this.out.columns));
    super.render();

    let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);

    this.outputText = [
      style$2.symbol(this.done, this.aborted, this.exited),
      color$2.bold(this.msg),
      style$2.delimiter(this.completing),
      this.done && this.suggestions[this.select]
        ? this.suggestions[this.select].title
        : this.rendered = this.transform.render(this.input)
    ].join(' ');

    if (!this.done) {
      const suggestions = this.suggestions
        .slice(startIndex, endIndex)
        .map((item, i) =>  this.renderOption(item,
          this.select === i + startIndex,
          i === 0 && startIndex > 0,
          i + startIndex === endIndex - 1 && endIndex < this.choices.length))
        .join('\n');
      this.outputText += `\n` + (suggestions || color$2.gray(this.fallback.title));
    }

    this.out.write(erase$1.line + cursor$2.to(0) + this.outputText);
  }
}

var autocomplete = AutocompletePrompt;

const color$1 = kleur;
const { cursor: cursor$1 } = src;
const MultiselectPrompt = multiselect;
const { clear: clear$1, style: style$1, figures } = util;
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class AutocompleteMultiselectPrompt extends MultiselectPrompt {
  constructor(opts={}) {
    opts.overrideRender = true;
    super(opts);
    this.inputValue = '';
    this.clear = clear$1('', this.out.columns);
    this.filteredOptions = this.value;
    this.render();
  }

  last() {
    this.cursor = this.filteredOptions.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.filteredOptions.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.filteredOptions.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.filteredOptions[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.filteredOptions[this.cursor].selected = true;
    this.render();
  }

  delete() {
    if (this.inputValue.length) {
      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
      this.updateFilteredOptions();
    }
  }

  updateFilteredOptions() {
    const currentHighlight = this.filteredOptions[this.cursor];
    this.filteredOptions = this.value
      .filter(v => {
        if (this.inputValue) {
          if (typeof v.title === 'string') {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === 'string') {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight);
    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.filteredOptions[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  handleInputChange(c) {
    this.inputValue = this.inputValue + c;
    this.updateFilteredOptions();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else {
      this.handleInputChange(c);
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }
      return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
    }
    return '';
  }

  renderCurrentInput() {
    return `
Filtered results for: ${this.inputValue ? this.inputValue : color$1.gray('Enter something to filter')}\n`;
  }

  renderOption(cursor, v, i) {
    let title;
    if (v.disabled) title = cursor === i ? color$1.gray().underline(v.title) : color$1.strikethrough().gray(v.title);
    else title = cursor === i ? color$1.cyan().underline(v.title) : v.title;
    return (v.selected ? color$1.green(figures.radioOn) : figures.radioOff) + '  ' + title
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
    }

    const output = [color$1.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
      output.push(color$1.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor$1.hide);
    super.render();

    // print prompt

    let prompt = [
      style$1.symbol(this.done, this.aborted),
      color$1.bold(this.msg),
      style$1.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');

    if (this.showMinError) {
      prompt += color$1.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }
    prompt += this.renderOptions(this.filteredOptions);

    this.out.write(this.clear + prompt);
    this.clear = clear$1(prompt, this.out.columns);
  }
}

var autocompleteMultiselect = AutocompleteMultiselectPrompt;

const color = kleur;
const Prompt = prompt$1;
const { style, clear } = util;
const { erase, cursor } = src;

/**
 * ConfirmPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial] Default value (true/false)
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.yes] The "Yes" label
 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
 * @param {String} [opts.no] The "No" label
 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
 */
class ConfirmPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.value = opts.initial;
    this.initialValue = !!opts.initial;
    this.yesMsg = opts.yes || 'yes';
    this.yesOption = opts.yesOption || '(Y/n)';
    this.noMsg = opts.no || 'no';
    this.noOption = opts.noOption || '(y/N)';
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || false;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }
    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }
    return this.bell();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      this.done ? (this.value ? this.yesMsg : this.noMsg)
          : color.gray(this.initialValue ? this.yesOption : this.noOption)
    ].join(' ');

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

var confirm = ConfirmPrompt;

var elements = {
  TextPrompt: text,
  SelectPrompt: select,
  TogglePrompt: toggle,
  DatePrompt: date,
  NumberPrompt: number,
  MultiselectPrompt: multiselect,
  AutocompletePrompt: autocomplete,
  AutocompleteMultiselectPrompt: autocompleteMultiselect,
  ConfirmPrompt: confirm
};

(function (exports) {
const $ = exports;
const el = elements;
const noop = v => v;

function toPrompt(type, args, opts={}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    const onExit = opts.onExit || noop;
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('exit', x => res(onExit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}

/**
 * Text prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.text = args => toPrompt('TextPrompt', args);

/**
 * Password prompt with masked input
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.password = args => {
  args.style = 'password';
  return $.text(args);
};

/**
 * Prompt where input is invisible, like sudo
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.invisible = args => {
  args.style = 'invisible';
  return $.text(args);
};

/**
 * Number prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.number = args => toPrompt('NumberPrompt', args);

/**
 * Date prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.date = args => toPrompt('DatePrompt', args);

/**
 * Classic yes/no prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.confirm = args => toPrompt('ConfirmPrompt', args);

/**
 * List prompt, split intput string by `seperator`
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input, in form of an `Array`
 */
$.list = args => {
  const sep = args.separator || ',';
  return toPrompt('TextPrompt', args, {
    onSubmit: str => str.split(sep).map(s => s.trim())
  });
};

/**
 * Toggle/switch prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.toggle = args => toPrompt('TogglePrompt', args);

/**
 * Interactive select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [args.initial] Index of default value
 * @param {String} [args.hint] Hint to display
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.select = args => toPrompt('SelectPrompt', args);

/**
 * Interactive multi-select / autocompleteMultiselect prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.multiselect = args => {
  args.choices = [].concat(args.choices || []);
  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
  return toPrompt('MultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

$.autocompleteMultiselect = args => {
  args.choices = [].concat(args.choices || []);
  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
  return toPrompt('AutocompleteMultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

const byTitle = (input, choices) => Promise.resolve(
  choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase())
);

/**
 * Interactive auto-complete prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
 * @param {number} [args.limit=10] Max number of results to show
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {String} [args.initial] Index of the default value
 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {String} [args.fallback] Fallback message - defaults to initial value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.autocomplete = args => {
  args.suggest = args.suggest || byTitle;
  args.choices = [].concat(args.choices || []);
  return toPrompt('AutocompletePrompt', args);
};
}(prompts$2));

const prompts$1 = prompts$2;

const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];
const noop = () => {};

/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @param {Function} [onSubmit] Callback function called on prompt submit
 * @param {Function} [onCancel] Callback function called on cancel/abort
 * @returns {Object} Object with values from user input
 */
async function prompt(questions=[], { onSubmit=noop, onCancel=noop }={}) {
  const answers = {};
  const override = prompt._override || {};
  questions = [].concat(questions);
  let answer, question, quit, name, type, lastPrompt;

  const getFormattedAnswer = async (question, answer, skipValidation = false) => {
    if (!skipValidation && question.validate && question.validate(answer) !== true) {
      return;
    }
    return question.format ? await question.format(answer, answers) : answer
  };

  for (question of questions) {
    ({ name, type } = question);

    // evaluate type first and skip if type is a falsy value
    if (typeof type === 'function') {
      type = await type(answer, { ...answers }, question);
      question['type'] = type;
    }
    if (!type) continue;

    // if property is a function, invoke it unless it's a special function
    for (let key in question) {
      if (passOn.includes(key)) continue;
      let value = question[key];
      question[key] = typeof value === 'function' ? await value(answer, { ...answers }, lastPrompt) : value;
    }

    lastPrompt = question;

    if (typeof question.message !== 'string') {
      throw new Error('prompt message is required');
    }

    // update vars in case they changed
    ({ name, type } = question);

    if (prompts$1[type] === void 0) {
      throw new Error(`prompt type (${type}) is not defined`);
    }

    if (override[question.name] !== undefined) {
      answer = await getFormattedAnswer(question, override[question.name]);
      if (answer !== undefined) {
        answers[name] = answer;
        continue;
      }
    }

    try {
      // Get the injected answer if there is one or prompt the user
      answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts$1[type](question);
      answers[name] = answer = await getFormattedAnswer(question, answer, true);
      quit = await onSubmit(question, answer, answers);
    } catch (err) {
      quit = !(await onCancel(question, answers));
    }

    if (quit) return answers;
  }

  return answers;
}

function getInjectedAnswer(injected, deafultValue) {
  const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }

    return (answer === undefined) ? deafultValue : answer;
}

function inject(answers) {
  prompt._injected = (prompt._injected || []).concat(answers);
}

function override(answers) {
  prompt._override = Object.assign({}, answers);
}

var lib = Object.assign(prompt, { prompt, prompts: prompts$1, inject, override });

function isNodeLT(tar) {
  tar = (Array.isArray(tar) ? tar : tar.split('.')).map(Number);
  let i=0, src=process.versions.node.split('.').map(Number);
  for (; i < tar.length; i++) {
    if (src[i] > tar[i]) return false;
    if (tar[i] > src[i]) return true;
  }
  return false;
}

var prompts =
  isNodeLT('8.6.0')
    ? dist
    : lib;

var index = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	'default': prompts
}, [prompts]));

export { index as i, prompts as p };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLWluZGV4LjY2NWE2YmE0LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0va2xldXJAMy4wLjMvbm9kZV9tb2R1bGVzL2tsZXVyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC91dGlsL2FjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvdXRpbC9zdHJpcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zaXN0ZXJhbnNpQDEuMC41L25vZGVfbW9kdWxlcy9zaXN0ZXJhbnNpL3NyYy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvdXRpbC9jbGVhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvdXRpbC9maWd1cmVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC91dGlsL3N0eWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC91dGlsL2xpbmVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC91dGlsL3dyYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L3V0aWwvZW50cmllc1RvRGlzcGxheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvdXRpbC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZWxlbWVudHMvcHJvbXB0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9lbGVtZW50cy90ZXh0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9lbGVtZW50cy9zZWxlY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL3RvZ2dsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZGF0ZXBhcnRzL2RhdGVwYXJ0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9kYXRlcGFydHMvbWVyaWRpZW0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2RhdGVwYXJ0cy9kYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2RhdGVwYXJ0cy9ob3Vycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZGF0ZXBhcnRzL21pbGxpc2Vjb25kcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZGF0ZXBhcnRzL21pbnV0ZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2RhdGVwYXJ0cy9tb250aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZGF0ZXBhcnRzL3NlY29uZHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2RhdGVwYXJ0cy95ZWFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9kYXRlcGFydHMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL2RhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL251bWJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZWxlbWVudHMvbXVsdGlzZWxlY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL2F1dG9jb21wbGV0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2Rpc3QvZWxlbWVudHMvYXV0b2NvbXBsZXRlTXVsdGlzZWxlY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL2NvbmZpcm0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9kaXN0L2VsZW1lbnRzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9wcm9tcHRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvZGlzdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi91dGlsL2FjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi91dGlsL3N0cmlwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL3V0aWwvY2xlYXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvdXRpbC9maWd1cmVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL3V0aWwvc3R5bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvdXRpbC9saW5lcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi91dGlsL3dyYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvdXRpbC9lbnRyaWVzVG9EaXNwbGF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL3V0aWwvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZWxlbWVudHMvcHJvbXB0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2VsZW1lbnRzL3RleHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZWxlbWVudHMvc2VsZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2VsZW1lbnRzL3RvZ2dsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9kYXRlcGFydHMvZGF0ZXBhcnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZGF0ZXBhcnRzL21lcmlkaWVtLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2RhdGVwYXJ0cy9kYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZGF0ZXBhcnRzL2hvdXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2RhdGVwYXJ0cy9taWxsaXNlY29uZHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZGF0ZXBhcnRzL21pbnV0ZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZGF0ZXBhcnRzL21vbnRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2RhdGVwYXJ0cy9zZWNvbmRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2RhdGVwYXJ0cy95ZWFyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2RhdGVwYXJ0cy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9lbGVtZW50cy9kYXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2VsZW1lbnRzL251bWJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9lbGVtZW50cy9tdWx0aXNlbGVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9lbGVtZW50cy9hdXRvY29tcGxldGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZWxlbWVudHMvYXV0b2NvbXBsZXRlTXVsdGlzZWxlY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJvbXB0c0AyLjQuMi9ub2RlX21vZHVsZXMvcHJvbXB0cy9saWIvZWxlbWVudHMvY29uZmlybS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9lbGVtZW50cy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcm9tcHRzQDIuNC4yL25vZGVfbW9kdWxlcy9wcm9tcHRzL2xpYi9wcm9tcHRzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvbGliL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Byb21wdHNAMi40LjIvbm9kZV9tb2R1bGVzL3Byb21wdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IEZPUkNFX0NPTE9SLCBOT0RFX0RJU0FCTEVfQ09MT1JTLCBURVJNIH0gPSBwcm9jZXNzLmVudjtcblxuY29uc3QgJCA9IHtcblx0ZW5hYmxlZDogIU5PREVfRElTQUJMRV9DT0xPUlMgJiYgVEVSTSAhPT0gJ2R1bWInICYmIEZPUkNFX0NPTE9SICE9PSAnMCcsXG5cblx0Ly8gbW9kaWZpZXJzXG5cdHJlc2V0OiBpbml0KDAsIDApLFxuXHRib2xkOiBpbml0KDEsIDIyKSxcblx0ZGltOiBpbml0KDIsIDIyKSxcblx0aXRhbGljOiBpbml0KDMsIDIzKSxcblx0dW5kZXJsaW5lOiBpbml0KDQsIDI0KSxcblx0aW52ZXJzZTogaW5pdCg3LCAyNyksXG5cdGhpZGRlbjogaW5pdCg4LCAyOCksXG5cdHN0cmlrZXRocm91Z2g6IGluaXQoOSwgMjkpLFxuXG5cdC8vIGNvbG9yc1xuXHRibGFjazogaW5pdCgzMCwgMzkpLFxuXHRyZWQ6IGluaXQoMzEsIDM5KSxcblx0Z3JlZW46IGluaXQoMzIsIDM5KSxcblx0eWVsbG93OiBpbml0KDMzLCAzOSksXG5cdGJsdWU6IGluaXQoMzQsIDM5KSxcblx0bWFnZW50YTogaW5pdCgzNSwgMzkpLFxuXHRjeWFuOiBpbml0KDM2LCAzOSksXG5cdHdoaXRlOiBpbml0KDM3LCAzOSksXG5cdGdyYXk6IGluaXQoOTAsIDM5KSxcblx0Z3JleTogaW5pdCg5MCwgMzkpLFxuXG5cdC8vIGJhY2tncm91bmQgY29sb3JzXG5cdGJnQmxhY2s6IGluaXQoNDAsIDQ5KSxcblx0YmdSZWQ6IGluaXQoNDEsIDQ5KSxcblx0YmdHcmVlbjogaW5pdCg0MiwgNDkpLFxuXHRiZ1llbGxvdzogaW5pdCg0MywgNDkpLFxuXHRiZ0JsdWU6IGluaXQoNDQsIDQ5KSxcblx0YmdNYWdlbnRhOiBpbml0KDQ1LCA0OSksXG5cdGJnQ3lhbjogaW5pdCg0NiwgNDkpLFxuXHRiZ1doaXRlOiBpbml0KDQ3LCA0OSlcbn07XG5cbmZ1bmN0aW9uIHJ1bihhcnIsIHN0cikge1xuXHRsZXQgaT0wLCB0bXAsIGJlZz0nJywgZW5kPScnO1xuXHRmb3IgKDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuXHRcdHRtcCA9IGFycltpXTtcblx0XHRiZWcgKz0gdG1wLm9wZW47XG5cdFx0ZW5kICs9IHRtcC5jbG9zZTtcblx0XHRpZiAoc3RyLmluY2x1ZGVzKHRtcC5jbG9zZSkpIHtcblx0XHRcdHN0ciA9IHN0ci5yZXBsYWNlKHRtcC5yZ3gsIHRtcC5jbG9zZSArIHRtcC5vcGVuKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGJlZyArIHN0ciArIGVuZDtcbn1cblxuZnVuY3Rpb24gY2hhaW4oaGFzLCBrZXlzKSB7XG5cdGxldCBjdHggPSB7IGhhcywga2V5cyB9O1xuXG5cdGN0eC5yZXNldCA9ICQucmVzZXQuYmluZChjdHgpO1xuXHRjdHguYm9sZCA9ICQuYm9sZC5iaW5kKGN0eCk7XG5cdGN0eC5kaW0gPSAkLmRpbS5iaW5kKGN0eCk7XG5cdGN0eC5pdGFsaWMgPSAkLml0YWxpYy5iaW5kKGN0eCk7XG5cdGN0eC51bmRlcmxpbmUgPSAkLnVuZGVybGluZS5iaW5kKGN0eCk7XG5cdGN0eC5pbnZlcnNlID0gJC5pbnZlcnNlLmJpbmQoY3R4KTtcblx0Y3R4LmhpZGRlbiA9ICQuaGlkZGVuLmJpbmQoY3R4KTtcblx0Y3R4LnN0cmlrZXRocm91Z2ggPSAkLnN0cmlrZXRocm91Z2guYmluZChjdHgpO1xuXG5cdGN0eC5ibGFjayA9ICQuYmxhY2suYmluZChjdHgpO1xuXHRjdHgucmVkID0gJC5yZWQuYmluZChjdHgpO1xuXHRjdHguZ3JlZW4gPSAkLmdyZWVuLmJpbmQoY3R4KTtcblx0Y3R4LnllbGxvdyA9ICQueWVsbG93LmJpbmQoY3R4KTtcblx0Y3R4LmJsdWUgPSAkLmJsdWUuYmluZChjdHgpO1xuXHRjdHgubWFnZW50YSA9ICQubWFnZW50YS5iaW5kKGN0eCk7XG5cdGN0eC5jeWFuID0gJC5jeWFuLmJpbmQoY3R4KTtcblx0Y3R4LndoaXRlID0gJC53aGl0ZS5iaW5kKGN0eCk7XG5cdGN0eC5ncmF5ID0gJC5ncmF5LmJpbmQoY3R4KTtcblx0Y3R4LmdyZXkgPSAkLmdyZXkuYmluZChjdHgpO1xuXG5cdGN0eC5iZ0JsYWNrID0gJC5iZ0JsYWNrLmJpbmQoY3R4KTtcblx0Y3R4LmJnUmVkID0gJC5iZ1JlZC5iaW5kKGN0eCk7XG5cdGN0eC5iZ0dyZWVuID0gJC5iZ0dyZWVuLmJpbmQoY3R4KTtcblx0Y3R4LmJnWWVsbG93ID0gJC5iZ1llbGxvdy5iaW5kKGN0eCk7XG5cdGN0eC5iZ0JsdWUgPSAkLmJnQmx1ZS5iaW5kKGN0eCk7XG5cdGN0eC5iZ01hZ2VudGEgPSAkLmJnTWFnZW50YS5iaW5kKGN0eCk7XG5cdGN0eC5iZ0N5YW4gPSAkLmJnQ3lhbi5iaW5kKGN0eCk7XG5cdGN0eC5iZ1doaXRlID0gJC5iZ1doaXRlLmJpbmQoY3R4KTtcblxuXHRyZXR1cm4gY3R4O1xufVxuXG5mdW5jdGlvbiBpbml0KG9wZW4sIGNsb3NlKSB7XG5cdGxldCBibGsgPSB7XG5cdFx0b3BlbjogYFxceDFiWyR7b3Blbn1tYCxcblx0XHRjbG9zZTogYFxceDFiWyR7Y2xvc2V9bWAsXG5cdFx0cmd4OiBuZXcgUmVnRXhwKGBcXFxceDFiXFxcXFske2Nsb3NlfW1gLCAnZycpXG5cdH07XG5cdHJldHVybiBmdW5jdGlvbiAodHh0KSB7XG5cdFx0aWYgKHRoaXMgIT09IHZvaWQgMCAmJiB0aGlzLmhhcyAhPT0gdm9pZCAwKSB7XG5cdFx0XHR0aGlzLmhhcy5pbmNsdWRlcyhvcGVuKSB8fCAodGhpcy5oYXMucHVzaChvcGVuKSx0aGlzLmtleXMucHVzaChibGspKTtcblx0XHRcdHJldHVybiB0eHQgPT09IHZvaWQgMCA/IHRoaXMgOiAkLmVuYWJsZWQgPyBydW4odGhpcy5rZXlzLCB0eHQrJycpIDogdHh0KycnO1xuXHRcdH1cblx0XHRyZXR1cm4gdHh0ID09PSB2b2lkIDAgPyBjaGFpbihbb3Blbl0sIFtibGtdKSA6ICQuZW5hYmxlZCA/IHJ1bihbYmxrXSwgdHh0KycnKSA6IHR4dCsnJztcblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChrZXksIGlzU2VsZWN0KSA9PiB7XG4gIGlmIChrZXkubWV0YSAmJiBrZXkubmFtZSAhPT0gJ2VzY2FwZScpIHJldHVybjtcblxuICBpZiAoa2V5LmN0cmwpIHtcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdhJykgcmV0dXJuICdmaXJzdCc7XG4gICAgaWYgKGtleS5uYW1lID09PSAnYycpIHJldHVybiAnYWJvcnQnO1xuICAgIGlmIChrZXkubmFtZSA9PT0gJ2QnKSByZXR1cm4gJ2Fib3J0JztcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdlJykgcmV0dXJuICdsYXN0JztcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdnJykgcmV0dXJuICdyZXNldCc7XG4gIH1cblxuICBpZiAoaXNTZWxlY3QpIHtcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdqJykgcmV0dXJuICdkb3duJztcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdrJykgcmV0dXJuICd1cCc7XG4gIH1cblxuICBpZiAoa2V5Lm5hbWUgPT09ICdyZXR1cm4nKSByZXR1cm4gJ3N1Ym1pdCc7XG4gIGlmIChrZXkubmFtZSA9PT0gJ2VudGVyJykgcmV0dXJuICdzdWJtaXQnOyAvLyBjdHJsICsgSlxuXG4gIGlmIChrZXkubmFtZSA9PT0gJ2JhY2tzcGFjZScpIHJldHVybiAnZGVsZXRlJztcbiAgaWYgKGtleS5uYW1lID09PSAnZGVsZXRlJykgcmV0dXJuICdkZWxldGVGb3J3YXJkJztcbiAgaWYgKGtleS5uYW1lID09PSAnYWJvcnQnKSByZXR1cm4gJ2Fib3J0JztcbiAgaWYgKGtleS5uYW1lID09PSAnZXNjYXBlJykgcmV0dXJuICdleGl0JztcbiAgaWYgKGtleS5uYW1lID09PSAndGFiJykgcmV0dXJuICduZXh0JztcbiAgaWYgKGtleS5uYW1lID09PSAncGFnZWRvd24nKSByZXR1cm4gJ25leHRQYWdlJztcbiAgaWYgKGtleS5uYW1lID09PSAncGFnZXVwJykgcmV0dXJuICdwcmV2UGFnZSc7IC8vIFRPRE8gY3JlYXRlIGhvbWUoKSBpbiBwcm9tcHQgdHlwZXMgKGUuZy4gVGV4dFByb21wdClcblxuICBpZiAoa2V5Lm5hbWUgPT09ICdob21lJykgcmV0dXJuICdob21lJzsgLy8gVE9ETyBjcmVhdGUgZW5kKCkgaW4gcHJvbXB0IHR5cGVzIChlLmcuIFRleHRQcm9tcHQpXG5cbiAgaWYgKGtleS5uYW1lID09PSAnZW5kJykgcmV0dXJuICdlbmQnO1xuICBpZiAoa2V5Lm5hbWUgPT09ICd1cCcpIHJldHVybiAndXAnO1xuICBpZiAoa2V5Lm5hbWUgPT09ICdkb3duJykgcmV0dXJuICdkb3duJztcbiAgaWYgKGtleS5uYW1lID09PSAncmlnaHQnKSByZXR1cm4gJ3JpZ2h0JztcbiAgaWYgKGtleS5uYW1lID09PSAnbGVmdCcpIHJldHVybiAnbGVmdCc7XG4gIHJldHVybiBmYWxzZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0ciA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBbJ1tcXFxcdTAwMUJcXFxcdTAwOUJdW1tcXFxcXSgpIzs/XSooPzooPzooPzooPzo7Wy1hLXpBLVpcXFxcZFxcXFwvIyYuOj0/JUB+X10rKSp8W2EtekEtWlxcXFxkXSsoPzo7Wy1hLXpBLVpcXFxcZFxcXFwvIyYuOj0/JUB+X10qKSopP1xcXFx1MDAwNyknLCAnKD86KD86XFxcXGR7MSw0fSg/OjtcXFxcZHswLDR9KSopP1tcXFxcZEEtUFJaY2YtbnRxcnk9Pjx+XSkpJ10uam9pbignfCcpO1xuICBjb25zdCBSR1ggPSBuZXcgUmVnRXhwKHBhdHRlcm4sICdnJyk7XG4gIHJldHVybiB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyA/IHN0ci5yZXBsYWNlKFJHWCwgJycpIDogc3RyO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEVTQyA9ICdcXHgxQic7XG5jb25zdCBDU0kgPSBgJHtFU0N9W2A7XG5jb25zdCBiZWVwID0gJ1xcdTAwMDcnO1xuXG5jb25zdCBjdXJzb3IgPSB7XG4gIHRvKHgsIHkpIHtcbiAgICBpZiAoIXkpIHJldHVybiBgJHtDU0l9JHt4ICsgMX1HYDtcbiAgICByZXR1cm4gYCR7Q1NJfSR7eSArIDF9OyR7eCArIDF9SGA7XG4gIH0sXG4gIG1vdmUoeCwgeSkge1xuICAgIGxldCByZXQgPSAnJztcblxuICAgIGlmICh4IDwgMCkgcmV0ICs9IGAke0NTSX0key14fURgO1xuICAgIGVsc2UgaWYgKHggPiAwKSByZXQgKz0gYCR7Q1NJfSR7eH1DYDtcblxuICAgIGlmICh5IDwgMCkgcmV0ICs9IGAke0NTSX0key15fUFgO1xuICAgIGVsc2UgaWYgKHkgPiAwKSByZXQgKz0gYCR7Q1NJfSR7eX1CYDtcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIHVwOiAoY291bnQgPSAxKSA9PiBgJHtDU0l9JHtjb3VudH1BYCxcbiAgZG93bjogKGNvdW50ID0gMSkgPT4gYCR7Q1NJfSR7Y291bnR9QmAsXG4gIGZvcndhcmQ6IChjb3VudCA9IDEpID0+IGAke0NTSX0ke2NvdW50fUNgLFxuICBiYWNrd2FyZDogKGNvdW50ID0gMSkgPT4gYCR7Q1NJfSR7Y291bnR9RGAsXG4gIG5leHRMaW5lOiAoY291bnQgPSAxKSA9PiBgJHtDU0l9RWAucmVwZWF0KGNvdW50KSxcbiAgcHJldkxpbmU6IChjb3VudCA9IDEpID0+IGAke0NTSX1GYC5yZXBlYXQoY291bnQpLFxuICBsZWZ0OiBgJHtDU0l9R2AsXG4gIGhpZGU6IGAke0NTSX0/MjVsYCxcbiAgc2hvdzogYCR7Q1NJfT8yNWhgLFxuICBzYXZlOiBgJHtFU0N9N2AsXG4gIHJlc3RvcmU6IGAke0VTQ304YFxufVxuXG5jb25zdCBzY3JvbGwgPSB7XG4gIHVwOiAoY291bnQgPSAxKSA9PiBgJHtDU0l9U2AucmVwZWF0KGNvdW50KSxcbiAgZG93bjogKGNvdW50ID0gMSkgPT4gYCR7Q1NJfVRgLnJlcGVhdChjb3VudClcbn1cblxuY29uc3QgZXJhc2UgPSB7XG4gIHNjcmVlbjogYCR7Q1NJfTJKYCxcbiAgdXA6IChjb3VudCA9IDEpID0+IGAke0NTSX0xSmAucmVwZWF0KGNvdW50KSxcbiAgZG93bjogKGNvdW50ID0gMSkgPT4gYCR7Q1NJfUpgLnJlcGVhdChjb3VudCksXG4gIGxpbmU6IGAke0NTSX0yS2AsXG4gIGxpbmVFbmQ6IGAke0NTSX1LYCxcbiAgbGluZVN0YXJ0OiBgJHtDU0l9MUtgLFxuICBsaW5lcyhjb3VudCkge1xuICAgIGxldCBjbGVhciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKylcbiAgICAgIGNsZWFyICs9IHRoaXMubGluZSArIChpIDwgY291bnQgLSAxID8gY3Vyc29yLnVwKCkgOiAnJyk7XG4gICAgaWYgKGNvdW50KVxuICAgICAgY2xlYXIgKz0gY3Vyc29yLmxlZnQ7XG4gICAgcmV0dXJuIGNsZWFyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBjdXJzb3IsIHNjcm9sbCwgZXJhc2UsIGJlZXAgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIobywgYWxsb3dBcnJheUxpa2UpIHsgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07IGlmICghaXQpIHsgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgeyBpZiAoaXQpIG8gPSBpdDsgdmFyIGkgPSAwOyB2YXIgRiA9IGZ1bmN0aW9uIEYoKSB7fTsgcmV0dXJuIHsgczogRiwgbjogZnVuY3Rpb24gbigpIHsgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7IGRvbmU6IHRydWUgfTsgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvW2krK10gfTsgfSwgZTogZnVuY3Rpb24gZShfZSkgeyB0aHJvdyBfZTsgfSwgZjogRiB9OyB9IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gaXRlcmF0ZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfSB2YXIgbm9ybWFsQ29tcGxldGlvbiA9IHRydWUsIGRpZEVyciA9IGZhbHNlLCBlcnI7IHJldHVybiB7IHM6IGZ1bmN0aW9uIHMoKSB7IGl0ID0gaXQuY2FsbChvKTsgfSwgbjogZnVuY3Rpb24gbigpIHsgdmFyIHN0ZXAgPSBpdC5uZXh0KCk7IG5vcm1hbENvbXBsZXRpb24gPSBzdGVwLmRvbmU7IHJldHVybiBzdGVwOyB9LCBlOiBmdW5jdGlvbiBlKF9lMikgeyBkaWRFcnIgPSB0cnVlOyBlcnIgPSBfZTI7IH0sIGY6IGZ1bmN0aW9uIGYoKSB7IHRyeSB7IGlmICghbm9ybWFsQ29tcGxldGlvbiAmJiBpdC5yZXR1cm4gIT0gbnVsbCkgaXQucmV0dXJuKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9XG5cbmNvbnN0IHN0cmlwID0gcmVxdWlyZSgnLi9zdHJpcCcpO1xuXG5jb25zdCBfcmVxdWlyZSA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKSxcbiAgICAgIGVyYXNlID0gX3JlcXVpcmUuZXJhc2UsXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZS5jdXJzb3I7XG5cbmNvbnN0IHdpZHRoID0gc3RyID0+IFsuLi5zdHJpcChzdHIpXS5sZW5ndGg7XG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9tcHRcbiAqIEBwYXJhbSB7bnVtYmVyfSBwZXJMaW5lXG4gKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwcm9tcHQsIHBlckxpbmUpIHtcbiAgaWYgKCFwZXJMaW5lKSByZXR1cm4gZXJhc2UubGluZSArIGN1cnNvci50bygwKTtcbiAgbGV0IHJvd3MgPSAwO1xuICBjb25zdCBsaW5lcyA9IHByb21wdC5zcGxpdCgvXFxyP1xcbi8pO1xuXG4gIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihsaW5lcyksXG4gICAgICBfc3RlcDtcblxuICB0cnkge1xuICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICBsZXQgbGluZSA9IF9zdGVwLnZhbHVlO1xuICAgICAgcm93cyArPSAxICsgTWF0aC5mbG9vcihNYXRoLm1heCh3aWR0aChsaW5lKSAtIDEsIDApIC8gcGVyTGluZSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfaXRlcmF0b3IuZShlcnIpO1xuICB9IGZpbmFsbHkge1xuICAgIF9pdGVyYXRvci5mKCk7XG4gIH1cblxuICByZXR1cm4gZXJhc2UubGluZXMocm93cyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgbWFpbiA9IHtcbiAgYXJyb3dVcDogJ+KGkScsXG4gIGFycm93RG93bjogJ+KGkycsXG4gIGFycm93TGVmdDogJ+KGkCcsXG4gIGFycm93UmlnaHQ6ICfihpInLFxuICByYWRpb09uOiAn4peJJyxcbiAgcmFkaW9PZmY6ICfil68nLFxuICB0aWNrOiAn4pyUJyxcbiAgY3Jvc3M6ICfinJYnLFxuICBlbGxpcHNpczogJ+KApicsXG4gIHBvaW50ZXJTbWFsbDogJ+KAuicsXG4gIGxpbmU6ICfilIAnLFxuICBwb2ludGVyOiAn4p2vJ1xufTtcbmNvbnN0IHdpbiA9IHtcbiAgYXJyb3dVcDogbWFpbi5hcnJvd1VwLFxuICBhcnJvd0Rvd246IG1haW4uYXJyb3dEb3duLFxuICBhcnJvd0xlZnQ6IG1haW4uYXJyb3dMZWZ0LFxuICBhcnJvd1JpZ2h0OiBtYWluLmFycm93UmlnaHQsXG4gIHJhZGlvT246ICcoKiknLFxuICByYWRpb09mZjogJyggKScsXG4gIHRpY2s6ICfiiJonLFxuICBjcm9zczogJ8OXJyxcbiAgZWxsaXBzaXM6ICcuLi4nLFxuICBwb2ludGVyU21hbGw6ICfCuycsXG4gIGxpbmU6ICfilIAnLFxuICBwb2ludGVyOiAnPidcbn07XG5jb25zdCBmaWd1cmVzID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/IHdpbiA6IG1haW47XG5tb2R1bGUuZXhwb3J0cyA9IGZpZ3VyZXM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjID0gcmVxdWlyZSgna2xldXInKTtcblxuY29uc3QgZmlndXJlcyA9IHJlcXVpcmUoJy4vZmlndXJlcycpOyAvLyByZW5kZXJpbmcgdXNlciBpbnB1dC5cblxuXG5jb25zdCBzdHlsZXMgPSBPYmplY3QuZnJlZXplKHtcbiAgcGFzc3dvcmQ6IHtcbiAgICBzY2FsZTogMSxcbiAgICByZW5kZXI6IGlucHV0ID0+ICcqJy5yZXBlYXQoaW5wdXQubGVuZ3RoKVxuICB9LFxuICBlbW9qaToge1xuICAgIHNjYWxlOiAyLFxuICAgIHJlbmRlcjogaW5wdXQgPT4gJ/CfmIMnLnJlcGVhdChpbnB1dC5sZW5ndGgpXG4gIH0sXG4gIGludmlzaWJsZToge1xuICAgIHNjYWxlOiAwLFxuICAgIHJlbmRlcjogaW5wdXQgPT4gJydcbiAgfSxcbiAgZGVmYXVsdDoge1xuICAgIHNjYWxlOiAxLFxuICAgIHJlbmRlcjogaW5wdXQgPT4gYCR7aW5wdXR9YFxuICB9XG59KTtcblxuY29uc3QgcmVuZGVyID0gdHlwZSA9PiBzdHlsZXNbdHlwZV0gfHwgc3R5bGVzLmRlZmF1bHQ7IC8vIGljb24gdG8gc2lnbmFsaXplIGEgcHJvbXB0LlxuXG5cbmNvbnN0IHN5bWJvbHMgPSBPYmplY3QuZnJlZXplKHtcbiAgYWJvcnRlZDogYy5yZWQoZmlndXJlcy5jcm9zcyksXG4gIGRvbmU6IGMuZ3JlZW4oZmlndXJlcy50aWNrKSxcbiAgZXhpdGVkOiBjLnllbGxvdyhmaWd1cmVzLmNyb3NzKSxcbiAgZGVmYXVsdDogYy5jeWFuKCc/Jylcbn0pO1xuXG5jb25zdCBzeW1ib2wgPSAoZG9uZSwgYWJvcnRlZCwgZXhpdGVkKSA9PiBhYm9ydGVkID8gc3ltYm9scy5hYm9ydGVkIDogZXhpdGVkID8gc3ltYm9scy5leGl0ZWQgOiBkb25lID8gc3ltYm9scy5kb25lIDogc3ltYm9scy5kZWZhdWx0OyAvLyBiZXR3ZWVuIHRoZSBxdWVzdGlvbiBhbmQgdGhlIHVzZXIncyBpbnB1dC5cblxuXG5jb25zdCBkZWxpbWl0ZXIgPSBjb21wbGV0aW5nID0+IGMuZ3JheShjb21wbGV0aW5nID8gZmlndXJlcy5lbGxpcHNpcyA6IGZpZ3VyZXMucG9pbnRlclNtYWxsKTtcblxuY29uc3QgaXRlbSA9IChleHBhbmRhYmxlLCBleHBhbmRlZCkgPT4gYy5ncmF5KGV4cGFuZGFibGUgPyBleHBhbmRlZCA/IGZpZ3VyZXMucG9pbnRlclNtYWxsIDogJysnIDogZmlndXJlcy5saW5lKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0eWxlcyxcbiAgcmVuZGVyLFxuICBzeW1ib2xzLFxuICBzeW1ib2wsXG4gIGRlbGltaXRlcixcbiAgaXRlbVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmlwID0gcmVxdWlyZSgnLi9zdHJpcCcpO1xuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gKiBAcGFyYW0ge251bWJlcn0gcGVyTGluZVxuICovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobXNnLCBwZXJMaW5lKSB7XG4gIGxldCBsaW5lcyA9IFN0cmluZyhzdHJpcChtc2cpIHx8ICcnKS5zcGxpdCgvXFxyP1xcbi8pO1xuICBpZiAoIXBlckxpbmUpIHJldHVybiBsaW5lcy5sZW5ndGg7XG4gIHJldHVybiBsaW5lcy5tYXAobCA9PiBNYXRoLmNlaWwobC5sZW5ndGggLyBwZXJMaW5lKSkucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG1zZyBUaGUgbWVzc2FnZSB0byB3cmFwXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0c1xuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBbb3B0cy5tYXJnaW5dIExlZnQgbWFyZ2luXG4gKiBAcGFyYW0ge251bWJlcn0gb3B0cy53aWR0aCBNYXhpbXVtIGNoYXJhY3RlcnMgcGVyIGxpbmUgaW5jbHVkaW5nIHRoZSBtYXJnaW5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChtc2csIG9wdHMgPSB7fSkgPT4ge1xuICBjb25zdCB0YWIgPSBOdW1iZXIuaXNTYWZlSW50ZWdlcihwYXJzZUludChvcHRzLm1hcmdpbikpID8gbmV3IEFycmF5KHBhcnNlSW50KG9wdHMubWFyZ2luKSkuZmlsbCgnICcpLmpvaW4oJycpIDogb3B0cy5tYXJnaW4gfHwgJyc7XG4gIGNvbnN0IHdpZHRoID0gb3B0cy53aWR0aDtcbiAgcmV0dXJuIChtc2cgfHwgJycpLnNwbGl0KC9cXHI/XFxuL2cpLm1hcChsaW5lID0+IGxpbmUuc3BsaXQoL1xccysvZykucmVkdWNlKChhcnIsIHcpID0+IHtcbiAgICBpZiAody5sZW5ndGggKyB0YWIubGVuZ3RoID49IHdpZHRoIHx8IGFyclthcnIubGVuZ3RoIC0gMV0ubGVuZ3RoICsgdy5sZW5ndGggKyAxIDwgd2lkdGgpIGFyclthcnIubGVuZ3RoIC0gMV0gKz0gYCAke3d9YDtlbHNlIGFyci5wdXNoKGAke3RhYn0ke3d9YCk7XG4gICAgcmV0dXJuIGFycjtcbiAgfSwgW3RhYl0pLmpvaW4oJ1xcbicpKS5qb2luKCdcXG4nKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBEZXRlcm1pbmUgd2hhdCBlbnRyaWVzIHNob3VsZCBiZSBkaXNwbGF5ZWQgb24gdGhlIHNjcmVlbiwgYmFzZWQgb24gdGhlXG4gKiBjdXJyZW50bHkgc2VsZWN0ZWQgaW5kZXggYW5kIHRoZSBtYXhpbXVtIHZpc2libGUuIFVzZWQgaW4gbGlzdC1iYXNlZFxuICogcHJvbXB0cyBsaWtlIGBzZWxlY3RgIGFuZCBgbXVsdGlzZWxlY3RgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJzb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBlbnRyeVxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIHRoZSB0b3RhbCBlbnRyaWVzIGF2YWlsYWJsZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge251bWJlcn0gW21heFZpc2libGVdIHRoZSBudW1iZXIgb2YgZW50cmllcyB0aGF0IGNhbiBiZSBkaXNwbGF5ZWRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChjdXJzb3IsIHRvdGFsLCBtYXhWaXNpYmxlKSA9PiB7XG4gIG1heFZpc2libGUgPSBtYXhWaXNpYmxlIHx8IHRvdGFsO1xuICBsZXQgc3RhcnRJbmRleCA9IE1hdGgubWluKHRvdGFsIC0gbWF4VmlzaWJsZSwgY3Vyc29yIC0gTWF0aC5mbG9vcihtYXhWaXNpYmxlIC8gMikpO1xuICBpZiAoc3RhcnRJbmRleCA8IDApIHN0YXJ0SW5kZXggPSAwO1xuICBsZXQgZW5kSW5kZXggPSBNYXRoLm1pbihzdGFydEluZGV4ICsgbWF4VmlzaWJsZSwgdG90YWwpO1xuICByZXR1cm4ge1xuICAgIHN0YXJ0SW5kZXgsXG4gICAgZW5kSW5kZXhcbiAgfTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aW9uOiByZXF1aXJlKCcuL2FjdGlvbicpLFxuICBjbGVhcjogcmVxdWlyZSgnLi9jbGVhcicpLFxuICBzdHlsZTogcmVxdWlyZSgnLi9zdHlsZScpLFxuICBzdHJpcDogcmVxdWlyZSgnLi9zdHJpcCcpLFxuICBmaWd1cmVzOiByZXF1aXJlKCcuL2ZpZ3VyZXMnKSxcbiAgbGluZXM6IHJlcXVpcmUoJy4vbGluZXMnKSxcbiAgd3JhcDogcmVxdWlyZSgnLi93cmFwJyksXG4gIGVudHJpZXNUb0Rpc3BsYXk6IHJlcXVpcmUoJy4vZW50cmllc1RvRGlzcGxheScpXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgcmVhZGxpbmUgPSByZXF1aXJlKCdyZWFkbGluZScpO1xuXG5jb25zdCBfcmVxdWlyZSA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICAgIGFjdGlvbiA9IF9yZXF1aXJlLmFjdGlvbjtcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNvbnN0IF9yZXF1aXJlMiA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKSxcbiAgICAgIGJlZXAgPSBfcmVxdWlyZTIuYmVlcCxcbiAgICAgIGN1cnNvciA9IF9yZXF1aXJlMi5jdXJzb3I7XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcbi8qKlxuICogQmFzZSBwcm9tcHQgc2tlbGV0b25cbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICovXG5cblxuY2xhc3MgUHJvbXB0IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmZpcnN0UmVuZGVyID0gdHJ1ZTtcbiAgICB0aGlzLmluID0gb3B0cy5zdGRpbiB8fCBwcm9jZXNzLnN0ZGluO1xuICAgIHRoaXMub3V0ID0gb3B0cy5zdGRvdXQgfHwgcHJvY2Vzcy5zdGRvdXQ7XG5cbiAgICB0aGlzLm9uUmVuZGVyID0gKG9wdHMub25SZW5kZXIgfHwgKCgpID0+IHZvaWQgMCkpLmJpbmQodGhpcyk7XG5cbiAgICBjb25zdCBybCA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XG4gICAgICBpbnB1dDogdGhpcy5pbixcbiAgICAgIGVzY2FwZUNvZGVUaW1lb3V0OiA1MFxuICAgIH0pO1xuICAgIHJlYWRsaW5lLmVtaXRLZXlwcmVzc0V2ZW50cyh0aGlzLmluLCBybCk7XG4gICAgaWYgKHRoaXMuaW4uaXNUVFkpIHRoaXMuaW4uc2V0UmF3TW9kZSh0cnVlKTtcbiAgICBjb25zdCBpc1NlbGVjdCA9IFsnU2VsZWN0UHJvbXB0JywgJ011bHRpc2VsZWN0UHJvbXB0J10uaW5kZXhPZih0aGlzLmNvbnN0cnVjdG9yLm5hbWUpID4gLTE7XG5cbiAgICBjb25zdCBrZXlwcmVzcyA9IChzdHIsIGtleSkgPT4ge1xuICAgICAgbGV0IGEgPSBhY3Rpb24oa2V5LCBpc1NlbGVjdCk7XG5cbiAgICAgIGlmIChhID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl8gJiYgdGhpcy5fKHN0ciwga2V5KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXNbYV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1thXShrZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5iZWxsKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuY2xvc2UgPSAoKSA9PiB7XG4gICAgICB0aGlzLm91dC53cml0ZShjdXJzb3Iuc2hvdyk7XG4gICAgICB0aGlzLmluLnJlbW92ZUxpc3RlbmVyKCdrZXlwcmVzcycsIGtleXByZXNzKTtcbiAgICAgIGlmICh0aGlzLmluLmlzVFRZKSB0aGlzLmluLnNldFJhd01vZGUoZmFsc2UpO1xuICAgICAgcmwuY2xvc2UoKTtcbiAgICAgIHRoaXMuZW1pdCh0aGlzLmFib3J0ZWQgPyAnYWJvcnQnIDogdGhpcy5leGl0ZWQgPyAnZXhpdCcgOiAnc3VibWl0JywgdGhpcy52YWx1ZSk7XG4gICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMuaW4ub24oJ2tleXByZXNzJywga2V5cHJlc3MpO1xuICB9XG5cbiAgZmlyZSgpIHtcbiAgICB0aGlzLmVtaXQoJ3N0YXRlJywge1xuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXG4gICAgICBhYm9ydGVkOiAhIXRoaXMuYWJvcnRlZCxcbiAgICAgIGV4aXRlZDogISF0aGlzLmV4aXRlZFxuICAgIH0pO1xuICB9XG5cbiAgYmVsbCgpIHtcbiAgICB0aGlzLm91dC53cml0ZShiZWVwKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLm9uUmVuZGVyKGNvbG9yKTtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5maXJzdFJlbmRlciA9IGZhbHNlO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9tcHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHsgdHJ5IHsgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpOyB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlOyB9IGNhdGNoIChlcnJvcikgeyByZWplY3QoZXJyb3IpOyByZXR1cm47IH0gaWYgKGluZm8uZG9uZSkgeyByZXNvbHZlKHZhbHVlKTsgfSBlbHNlIHsgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpOyB9IH1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgdmFyIHNlbGYgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzOyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7IGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7IGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTsgfSBmdW5jdGlvbiBfdGhyb3coZXJyKSB7IGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpOyB9IF9uZXh0KHVuZGVmaW5lZCk7IH0pOyB9OyB9XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcblxuY29uc3QgUHJvbXB0ID0gcmVxdWlyZSgnLi9wcm9tcHQnKTtcblxuY29uc3QgX3JlcXVpcmUgPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyksXG4gICAgICBlcmFzZSA9IF9yZXF1aXJlLmVyYXNlLFxuICAgICAgY3Vyc29yID0gX3JlcXVpcmUuY3Vyc29yO1xuXG5jb25zdCBfcmVxdWlyZTIgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgICBzdHlsZSA9IF9yZXF1aXJlMi5zdHlsZSxcbiAgICAgIGNsZWFyID0gX3JlcXVpcmUyLmNsZWFyLFxuICAgICAgbGluZXMgPSBfcmVxdWlyZTIubGluZXMsXG4gICAgICBmaWd1cmVzID0gX3JlcXVpcmUyLmZpZ3VyZXM7XG4vKipcbiAqIFRleHRQcm9tcHQgQmFzZSBFbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5tZXNzYWdlIE1lc3NhZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5zdHlsZT0nZGVmYXVsdCddIFJlbmRlciBzdHlsZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmluaXRpYWxdIERlZmF1bHQgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZhbGlkYXRlXSBWYWxpZGF0ZSBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuZXJyb3JdIFRoZSBpbnZhbGlkIGVycm9yIGxhYmVsXG4gKi9cblxuXG5jbGFzcyBUZXh0UHJvbXB0IGV4dGVuZHMgUHJvbXB0IHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSBzdHlsZS5yZW5kZXIob3B0cy5zdHlsZSk7XG4gICAgdGhpcy5zY2FsZSA9IHRoaXMudHJhbnNmb3JtLnNjYWxlO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuaW5pdGlhbCA9IG9wdHMuaW5pdGlhbCB8fCBgYDtcblxuICAgIHRoaXMudmFsaWRhdG9yID0gb3B0cy52YWxpZGF0ZSB8fCAoKCkgPT4gdHJ1ZSk7XG5cbiAgICB0aGlzLnZhbHVlID0gYGA7XG4gICAgdGhpcy5lcnJvck1zZyA9IG9wdHMuZXJyb3IgfHwgYFBsZWFzZSBFbnRlciBBIFZhbGlkIFZhbHVlYDtcbiAgICB0aGlzLmN1cnNvciA9IE51bWJlcighIXRoaXMuaW5pdGlhbCk7XG4gICAgdGhpcy5jdXJzb3JPZmZzZXQgPSAwO1xuICAgIHRoaXMuY2xlYXIgPSBjbGVhcihgYCwgdGhpcy5vdXQuY29sdW1ucyk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2KSB7XG4gICAgaWYgKCF2ICYmIHRoaXMuaW5pdGlhbCkge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gY29sb3IuZ3JheSh0aGlzLnRyYW5zZm9ybS5yZW5kZXIodGhpcy5pbml0aWFsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSB0aGlzLnRyYW5zZm9ybS5yZW5kZXIodik7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSB2O1xuICAgIHRoaXMuZmlyZSgpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBgYDtcbiAgICB0aGlzLmN1cnNvciA9IE51bWJlcighIXRoaXMuaW5pdGlhbCk7XG4gICAgdGhpcy5jdXJzb3JPZmZzZXQgPSAwO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlIHx8IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICByZXR1cm4gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qICgpIHtcbiAgICAgIGxldCB2YWxpZCA9IHlpZWxkIF90aGlzLnZhbGlkYXRvcihfdGhpcy52YWx1ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsaWQgPT09IGBzdHJpbmdgKSB7XG4gICAgICAgIF90aGlzLmVycm9yTXNnID0gdmFsaWQ7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmVycm9yID0gIXZhbGlkO1xuICAgIH0pKCk7XG4gIH1cblxuICBzdWJtaXQoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICByZXR1cm4gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qICgpIHtcbiAgICAgIF90aGlzMi52YWx1ZSA9IF90aGlzMi52YWx1ZSB8fCBfdGhpczIuaW5pdGlhbDtcbiAgICAgIF90aGlzMi5jdXJzb3JPZmZzZXQgPSAwO1xuICAgICAgX3RoaXMyLmN1cnNvciA9IF90aGlzMi5yZW5kZXJlZC5sZW5ndGg7XG4gICAgICB5aWVsZCBfdGhpczIudmFsaWRhdGUoKTtcblxuICAgICAgaWYgKF90aGlzMi5lcnJvcikge1xuICAgICAgICBfdGhpczIucmVkID0gdHJ1ZTtcblxuICAgICAgICBfdGhpczIuZmlyZSgpO1xuXG4gICAgICAgIF90aGlzMi5yZW5kZXIoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzMi5kb25lID0gdHJ1ZTtcbiAgICAgIF90aGlzMi5hYm9ydGVkID0gZmFsc2U7XG5cbiAgICAgIF90aGlzMi5maXJlKCk7XG5cbiAgICAgIF90aGlzMi5yZW5kZXIoKTtcblxuICAgICAgX3RoaXMyLm91dC53cml0ZSgnXFxuJyk7XG5cbiAgICAgIF90aGlzMi5jbG9zZSgpO1xuICAgIH0pKCk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIGlmICghdGhpcy5wbGFjZWhvbGRlcikgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmluaXRpYWw7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLnJlbmRlcmVkLmxlbmd0aDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbW92ZUN1cnNvcihuKSB7XG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHJldHVybjtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yICsgbjtcbiAgICB0aGlzLmN1cnNvck9mZnNldCArPSBuO1xuICB9XG5cbiAgXyhjLCBrZXkpIHtcbiAgICBsZXQgczEgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIHRoaXMuY3Vyc29yKTtcbiAgICBsZXQgczIgPSB0aGlzLnZhbHVlLnNsaWNlKHRoaXMuY3Vyc29yKTtcbiAgICB0aGlzLnZhbHVlID0gYCR7czF9JHtjfSR7czJ9YDtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy5wbGFjZWhvbGRlciA/IDAgOiBzMS5sZW5ndGggKyAxO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgaWYgKHRoaXMuaXNDdXJzb3JBdFN0YXJ0KCkpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICBsZXQgczEgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIHRoaXMuY3Vyc29yIC0gMSk7XG4gICAgbGV0IHMyID0gdGhpcy52YWx1ZS5zbGljZSh0aGlzLmN1cnNvcik7XG4gICAgdGhpcy52YWx1ZSA9IGAke3MxfSR7czJ9YDtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuaXNDdXJzb3JBdFN0YXJ0KCkpIHtcbiAgICAgIHRoaXMuY3Vyc29yT2Zmc2V0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJzb3JPZmZzZXQrKztcbiAgICAgIHRoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZUZvcndhcmQoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yICogdGhpcy5zY2FsZSA+PSB0aGlzLnJlbmRlcmVkLmxlbmd0aCB8fCB0aGlzLnBsYWNlaG9sZGVyKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgbGV0IHMxID0gdGhpcy52YWx1ZS5zbGljZSgwLCB0aGlzLmN1cnNvcik7XG4gICAgbGV0IHMyID0gdGhpcy52YWx1ZS5zbGljZSh0aGlzLmN1cnNvciArIDEpO1xuICAgIHRoaXMudmFsdWUgPSBgJHtzMX0ke3MyfWA7XG4gICAgdGhpcy5yZWQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgdGhpcy5jdXJzb3JPZmZzZXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnNvck9mZnNldCsrO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLnZhbHVlLmxlbmd0aDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPD0gMCB8fCB0aGlzLnBsYWNlaG9sZGVyKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKC0xKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yICogdGhpcy5zY2FsZSA+PSB0aGlzLnJlbmRlcmVkLmxlbmd0aCB8fCB0aGlzLnBsYWNlaG9sZGVyKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKDEpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBpc0N1cnNvckF0U3RhcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3Vyc29yID09PSAwIHx8IHRoaXMucGxhY2Vob2xkZXIgJiYgdGhpcy5jdXJzb3IgPT09IDE7XG4gIH1cblxuICBpc0N1cnNvckF0RW5kKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnNvciA9PT0gdGhpcy5yZW5kZXJlZC5sZW5ndGggfHwgdGhpcy5wbGFjZWhvbGRlciAmJiB0aGlzLmN1cnNvciA9PT0gdGhpcy5yZW5kZXJlZC5sZW5ndGggKyAxO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuXG4gICAgaWYgKCF0aGlzLmZpcnN0UmVuZGVyKSB7XG4gICAgICBpZiAodGhpcy5vdXRwdXRFcnJvcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmRvd24obGluZXModGhpcy5vdXRwdXRFcnJvciwgdGhpcy5vdXQuY29sdW1ucykgLSAxKSArIGNsZWFyKHRoaXMub3V0cHV0RXJyb3IsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICAgIHRoaXMub3V0LndyaXRlKGNsZWFyKHRoaXMub3V0cHV0VGV4dCwgdGhpcy5vdXQuY29sdW1ucykpO1xuICAgIH1cblxuICAgIHN1cGVyLnJlbmRlcigpO1xuICAgIHRoaXMub3V0cHV0RXJyb3IgPSAnJztcbiAgICB0aGlzLm91dHB1dFRleHQgPSBbc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSwgY29sb3IuYm9sZCh0aGlzLm1zZyksIHN0eWxlLmRlbGltaXRlcih0aGlzLmRvbmUpLCB0aGlzLnJlZCA/IGNvbG9yLnJlZCh0aGlzLnJlbmRlcmVkKSA6IHRoaXMucmVuZGVyZWRdLmpvaW4oYCBgKTtcblxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICB0aGlzLm91dHB1dEVycm9yICs9IHRoaXMuZXJyb3JNc2cuc3BsaXQoYFxcbmApLnJlZHVjZSgoYSwgbCwgaSkgPT4gYSArIGBcXG4ke2kgPyAnICcgOiBmaWd1cmVzLnBvaW50ZXJTbWFsbH0gJHtjb2xvci5yZWQoKS5pdGFsaWMobCl9YCwgYGApO1xuICAgIH1cblxuICAgIHRoaXMub3V0LndyaXRlKGVyYXNlLmxpbmUgKyBjdXJzb3IudG8oMCkgKyB0aGlzLm91dHB1dFRleHQgKyBjdXJzb3Iuc2F2ZSArIHRoaXMub3V0cHV0RXJyb3IgKyBjdXJzb3IucmVzdG9yZSArIGN1cnNvci5tb3ZlKHRoaXMuY3Vyc29yT2Zmc2V0LCAwKSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRQcm9tcHQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5cbmNvbnN0IFByb21wdCA9IHJlcXVpcmUoJy4vcHJvbXB0Jyk7XG5cbmNvbnN0IF9yZXF1aXJlID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICAgICAgc3R5bGUgPSBfcmVxdWlyZS5zdHlsZSxcbiAgICAgIGNsZWFyID0gX3JlcXVpcmUuY2xlYXIsXG4gICAgICBmaWd1cmVzID0gX3JlcXVpcmUuZmlndXJlcyxcbiAgICAgIHdyYXAgPSBfcmVxdWlyZS53cmFwLFxuICAgICAgZW50cmllc1RvRGlzcGxheSA9IF9yZXF1aXJlLmVudHJpZXNUb0Rpc3BsYXk7XG5cbmNvbnN0IF9yZXF1aXJlMiA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKSxcbiAgICAgIGN1cnNvciA9IF9yZXF1aXJlMi5jdXJzb3I7XG4vKipcbiAqIFNlbGVjdFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZSBvYmplY3RzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMuaW5pdGlhbF0gSW5kZXggb2YgZGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMub3B0aW9uc1BlclBhZ2U9MTBdIE1heCBvcHRpb25zIHRvIGRpc3BsYXkgYXQgb25jZVxuICovXG5cblxuY2xhc3MgU2VsZWN0UHJvbXB0IGV4dGVuZHMgUHJvbXB0IHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5tc2cgPSBvcHRzLm1lc3NhZ2U7XG4gICAgdGhpcy5oaW50ID0gb3B0cy5oaW50IHx8ICctIFVzZSBhcnJvdy1rZXlzLiBSZXR1cm4gdG8gc3VibWl0Lic7XG4gICAgdGhpcy53YXJuID0gb3B0cy53YXJuIHx8ICctIFRoaXMgb3B0aW9uIGlzIGRpc2FibGVkJztcbiAgICB0aGlzLmN1cnNvciA9IG9wdHMuaW5pdGlhbCB8fCAwO1xuICAgIHRoaXMuY2hvaWNlcyA9IG9wdHMuY2hvaWNlcy5tYXAoKGNoLCBpZHgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY2ggPT09ICdzdHJpbmcnKSBjaCA9IHtcbiAgICAgICAgdGl0bGU6IGNoLFxuICAgICAgICB2YWx1ZTogaWR4XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6IGNoICYmIChjaC50aXRsZSB8fCBjaC52YWx1ZSB8fCBjaCksXG4gICAgICAgIHZhbHVlOiBjaCAmJiAoY2gudmFsdWUgPT09IHVuZGVmaW5lZCA/IGlkeCA6IGNoLnZhbHVlKSxcbiAgICAgICAgZGVzY3JpcHRpb246IGNoICYmIGNoLmRlc2NyaXB0aW9uLFxuICAgICAgICBzZWxlY3RlZDogY2ggJiYgY2guc2VsZWN0ZWQsXG4gICAgICAgIGRpc2FibGVkOiBjaCAmJiBjaC5kaXNhYmxlZFxuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLm9wdGlvbnNQZXJQYWdlID0gb3B0cy5vcHRpb25zUGVyUGFnZSB8fCAxMDtcbiAgICB0aGlzLnZhbHVlID0gKHRoaXMuY2hvaWNlc1t0aGlzLmN1cnNvcl0gfHwge30pLnZhbHVlO1xuICAgIHRoaXMuY2xlYXIgPSBjbGVhcignJywgdGhpcy5vdXQuY29sdW1ucyk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG1vdmVDdXJzb3Iobikge1xuICAgIHRoaXMuY3Vyc29yID0gbjtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5jaG9pY2VzW25dLnZhbHVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKDApO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIGlmICghdGhpcy5zZWxlY3Rpb24uZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2UgdGhpcy5iZWxsKCk7XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICB0aGlzLm1vdmVDdXJzb3IoMCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKHRoaXMuY2hvaWNlcy5sZW5ndGggLSAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IodGhpcy5jaG9pY2VzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IodGhpcy5jdXJzb3IgLSAxKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPT09IHRoaXMuY2hvaWNlcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW92ZUN1cnNvcih0aGlzLmN1cnNvciArIDEpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIHRoaXMubW92ZUN1cnNvcigodGhpcy5jdXJzb3IgKyAxKSAlIHRoaXMuY2hvaWNlcy5sZW5ndGgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjID09PSAnICcpIHJldHVybiB0aGlzLnN1Ym1pdCgpO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jaG9pY2VzW3RoaXMuY3Vyc29yXTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmhpZGUpO2Vsc2UgdGhpcy5vdXQud3JpdGUoY2xlYXIodGhpcy5vdXRwdXRUZXh0LCB0aGlzLm91dC5jb2x1bW5zKSk7XG4gICAgc3VwZXIucmVuZGVyKCk7XG5cbiAgICBsZXQgX2VudHJpZXNUb0Rpc3BsYXkgPSBlbnRyaWVzVG9EaXNwbGF5KHRoaXMuY3Vyc29yLCB0aGlzLmNob2ljZXMubGVuZ3RoLCB0aGlzLm9wdGlvbnNQZXJQYWdlKSxcbiAgICAgICAgc3RhcnRJbmRleCA9IF9lbnRyaWVzVG9EaXNwbGF5LnN0YXJ0SW5kZXgsXG4gICAgICAgIGVuZEluZGV4ID0gX2VudHJpZXNUb0Rpc3BsYXkuZW5kSW5kZXg7IC8vIFByaW50IHByb21wdFxuXG5cbiAgICB0aGlzLm91dHB1dFRleHQgPSBbc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSwgY29sb3IuYm9sZCh0aGlzLm1zZyksIHN0eWxlLmRlbGltaXRlcihmYWxzZSksIHRoaXMuZG9uZSA/IHRoaXMuc2VsZWN0aW9uLnRpdGxlIDogdGhpcy5zZWxlY3Rpb24uZGlzYWJsZWQgPyBjb2xvci55ZWxsb3codGhpcy53YXJuKSA6IGNvbG9yLmdyYXkodGhpcy5oaW50KV0uam9pbignICcpOyAvLyBQcmludCBjaG9pY2VzXG5cbiAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgdGhpcy5vdXRwdXRUZXh0ICs9ICdcXG4nO1xuXG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcbiAgICAgICAgbGV0IHRpdGxlLFxuICAgICAgICAgICAgcHJlZml4LFxuICAgICAgICAgICAgZGVzYyA9ICcnLFxuICAgICAgICAgICAgdiA9IHRoaXMuY2hvaWNlc1tpXTsgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdG8gZGlzcGxheSBcIm1vcmUgY2hvaWNlc1wiIGluZGljYXRvcnNcblxuICAgICAgICBpZiAoaSA9PT0gc3RhcnRJbmRleCAmJiBzdGFydEluZGV4ID4gMCkge1xuICAgICAgICAgIHByZWZpeCA9IGZpZ3VyZXMuYXJyb3dVcDtcbiAgICAgICAgfSBlbHNlIGlmIChpID09PSBlbmRJbmRleCAtIDEgJiYgZW5kSW5kZXggPCB0aGlzLmNob2ljZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcHJlZml4ID0gZmlndXJlcy5hcnJvd0Rvd247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJlZml4ID0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuZGlzYWJsZWQpIHtcbiAgICAgICAgICB0aXRsZSA9IHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuZ3JheSgpLnVuZGVybGluZSh2LnRpdGxlKSA6IGNvbG9yLnN0cmlrZXRocm91Z2goKS5ncmF5KHYudGl0bGUpO1xuICAgICAgICAgIHByZWZpeCA9ICh0aGlzLmN1cnNvciA9PT0gaSA/IGNvbG9yLmJvbGQoKS5ncmF5KGZpZ3VyZXMucG9pbnRlcikgKyAnICcgOiAnICAnKSArIHByZWZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aXRsZSA9IHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuY3lhbigpLnVuZGVybGluZSh2LnRpdGxlKSA6IHYudGl0bGU7XG4gICAgICAgICAgcHJlZml4ID0gKHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuY3lhbihmaWd1cmVzLnBvaW50ZXIpICsgJyAnIDogJyAgJykgKyBwcmVmaXg7XG5cbiAgICAgICAgICBpZiAodi5kZXNjcmlwdGlvbiAmJiB0aGlzLmN1cnNvciA9PT0gaSkge1xuICAgICAgICAgICAgZGVzYyA9IGAgLSAke3YuZGVzY3JpcHRpb259YDtcblxuICAgICAgICAgICAgaWYgKHByZWZpeC5sZW5ndGggKyB0aXRsZS5sZW5ndGggKyBkZXNjLmxlbmd0aCA+PSB0aGlzLm91dC5jb2x1bW5zIHx8IHYuZGVzY3JpcHRpb24uc3BsaXQoL1xccj9cXG4vKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgIGRlc2MgPSAnXFxuJyArIHdyYXAodi5kZXNjcmlwdGlvbiwge1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMyxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5vdXQuY29sdW1uc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm91dHB1dFRleHQgKz0gYCR7cHJlZml4fSAke3RpdGxlfSR7Y29sb3IuZ3JheShkZXNjKX1cXG5gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3V0LndyaXRlKHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdFByb21wdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgY29sb3IgPSByZXF1aXJlKCdrbGV1cicpO1xuXG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuXG5jb25zdCBfcmVxdWlyZSA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICAgIHN0eWxlID0gX3JlcXVpcmUuc3R5bGUsXG4gICAgICBjbGVhciA9IF9yZXF1aXJlLmNsZWFyO1xuXG5jb25zdCBfcmVxdWlyZTIgPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyksXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZTIuY3Vyc29yLFxuICAgICAgZXJhc2UgPSBfcmVxdWlyZTIuZXJhc2U7XG4vKipcbiAqIFRvZ2dsZVByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5pbml0aWFsPWZhbHNlXSBEZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuYWN0aXZlPSdubyddIEFjdGl2ZSBsYWJlbFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmluYWN0aXZlPSdvZmYnXSBJbmFjdGl2ZSBsYWJlbFxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cblxuXG5jbGFzcyBUb2dnbGVQcm9tcHQgZXh0ZW5kcyBQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLnZhbHVlID0gISFvcHRzLmluaXRpYWw7XG4gICAgdGhpcy5hY3RpdmUgPSBvcHRzLmFjdGl2ZSB8fCAnb24nO1xuICAgIHRoaXMuaW5hY3RpdmUgPSBvcHRzLmluYWN0aXZlIHx8ICdvZmYnO1xuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuaW5pdGlhbFZhbHVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gZmFsc2UpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnZhbHVlID09PSB0cnVlKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICB0aGlzLmFjdGl2YXRlKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnZhbHVlID0gIXRoaXMudmFsdWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF8oYywga2V5KSB7XG4gICAgaWYgKGMgPT09ICcgJykge1xuICAgICAgdGhpcy52YWx1ZSA9ICF0aGlzLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gJzEnKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGMgPT09ICcwJykge1xuICAgICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSByZXR1cm4gdGhpcy5iZWxsKCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZpcnN0UmVuZGVyKSB0aGlzLm91dC53cml0ZShjdXJzb3IuaGlkZSk7ZWxzZSB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICB0aGlzLm91dHB1dFRleHQgPSBbc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSwgY29sb3IuYm9sZCh0aGlzLm1zZyksIHN0eWxlLmRlbGltaXRlcih0aGlzLmRvbmUpLCB0aGlzLnZhbHVlID8gdGhpcy5pbmFjdGl2ZSA6IGNvbG9yLmN5YW4oKS51bmRlcmxpbmUodGhpcy5pbmFjdGl2ZSksIGNvbG9yLmdyYXkoJy8nKSwgdGhpcy52YWx1ZSA/IGNvbG9yLmN5YW4oKS51bmRlcmxpbmUodGhpcy5hY3RpdmUpIDogdGhpcy5hY3RpdmVdLmpvaW4oJyAnKTtcbiAgICB0aGlzLm91dC53cml0ZShlcmFzZS5saW5lICsgY3Vyc29yLnRvKDApICsgdGhpcy5vdXRwdXRUZXh0KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9nZ2xlUHJvbXB0OyIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgdG9rZW4sXG4gICAgZGF0ZSxcbiAgICBwYXJ0cyxcbiAgICBsb2NhbGVzXG4gIH0pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgdGhpcy5kYXRlID0gZGF0ZSB8fCBuZXcgRGF0ZSgpO1xuICAgIHRoaXMucGFydHMgPSBwYXJ0cyB8fCBbdGhpc107XG4gICAgdGhpcy5sb2NhbGVzID0gbG9jYWxlcyB8fCB7fTtcbiAgfVxuXG4gIHVwKCkge31cblxuICBkb3duKCkge31cblxuICBuZXh0KCkge1xuICAgIGNvbnN0IGN1cnJlbnRJZHggPSB0aGlzLnBhcnRzLmluZGV4T2YodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucGFydHMuZmluZCgocGFydCwgaWR4KSA9PiBpZHggPiBjdXJyZW50SWR4ICYmIHBhcnQgaW5zdGFuY2VvZiBEYXRlUGFydCk7XG4gIH1cblxuICBzZXRUbyh2YWwpIHt9XG5cbiAgcHJldigpIHtcbiAgICBsZXQgcGFydHMgPSBbXS5jb25jYXQodGhpcy5wYXJ0cykucmV2ZXJzZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRJZHggPSBwYXJ0cy5pbmRleE9mKHRoaXMpO1xuICAgIHJldHVybiBwYXJ0cy5maW5kKChwYXJ0LCBpZHgpID0+IGlkeCA+IGN1cnJlbnRJZHggJiYgcGFydCBpbnN0YW5jZW9mIERhdGVQYXJ0KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5kYXRlKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZVBhcnQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBEYXRlUGFydCA9IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKTtcblxuY2xhc3MgTWVyaWRpZW0gZXh0ZW5kcyBEYXRlUGFydCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldEhvdXJzKCh0aGlzLmRhdGUuZ2V0SG91cnMoKSArIDEyKSAlIDI0KTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy51cCgpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IG1lcmlkaWVtID0gdGhpcy5kYXRlLmdldEhvdXJzKCkgPiAxMiA/ICdwbScgOiAnYW0nO1xuICAgIHJldHVybiAvXFxBLy50ZXN0KHRoaXMudG9rZW4pID8gbWVyaWRpZW0udG9VcHBlckNhc2UoKSA6IG1lcmlkaWVtO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXJpZGllbTsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jb25zdCBwb3MgPSBuID0+IHtcbiAgbiA9IG4gJSAxMDtcbiAgcmV0dXJuIG4gPT09IDEgPyAnc3QnIDogbiA9PT0gMiA/ICduZCcgOiBuID09PSAzID8gJ3JkJyA6ICd0aCc7XG59O1xuXG5jbGFzcyBEYXkgZXh0ZW5kcyBEYXRlUGFydCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldERhdGUodGhpcy5kYXRlLmdldERhdGUoKSArIDEpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICB0aGlzLmRhdGUuc2V0RGF0ZSh0aGlzLmRhdGUuZ2V0RGF0ZSgpIC0gMSk7XG4gIH1cblxuICBzZXRUbyh2YWwpIHtcbiAgICB0aGlzLmRhdGUuc2V0RGF0ZShwYXJzZUludCh2YWwuc3Vic3RyKC0yKSkpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IGRhdGUgPSB0aGlzLmRhdGUuZ2V0RGF0ZSgpO1xuICAgIGxldCBkYXkgPSB0aGlzLmRhdGUuZ2V0RGF5KCk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4gPT09ICdERCcgPyBTdHJpbmcoZGF0ZSkucGFkU3RhcnQoMiwgJzAnKSA6IHRoaXMudG9rZW4gPT09ICdEbycgPyBkYXRlICsgcG9zKGRhdGUpIDogdGhpcy50b2tlbiA9PT0gJ2QnID8gZGF5ICsgMSA6IHRoaXMudG9rZW4gPT09ICdkZGQnID8gdGhpcy5sb2NhbGVzLndlZWtkYXlzU2hvcnRbZGF5XSA6IHRoaXMudG9rZW4gPT09ICdkZGRkJyA/IHRoaXMubG9jYWxlcy53ZWVrZGF5c1tkYXldIDogZGF0ZTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF5OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGF0ZVBhcnQgPSByZXF1aXJlKCcuL2RhdGVwYXJ0Jyk7XG5cbmNsYXNzIEhvdXJzIGV4dGVuZHMgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRIb3Vycyh0aGlzLmRhdGUuZ2V0SG91cnMoKSArIDEpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICB0aGlzLmRhdGUuc2V0SG91cnModGhpcy5kYXRlLmdldEhvdXJzKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXRIb3VycyhwYXJzZUludCh2YWwuc3Vic3RyKC0yKSkpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IGhvdXJzID0gdGhpcy5kYXRlLmdldEhvdXJzKCk7XG4gICAgaWYgKC9oLy50ZXN0KHRoaXMudG9rZW4pKSBob3VycyA9IGhvdXJzICUgMTIgfHwgMTI7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4ubGVuZ3RoID4gMSA/IFN0cmluZyhob3VycykucGFkU3RhcnQoMiwgJzAnKSA6IGhvdXJzO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIb3VyczsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBNaWxsaXNlY29uZHMgZXh0ZW5kcyBEYXRlUGFydCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyAxKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaWxsaXNlY29uZHMocGFyc2VJbnQodmFsLnN1YnN0cigtdGhpcy50b2tlbi5sZW5ndGgpKSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gU3RyaW5nKHRoaXMuZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSkucGFkU3RhcnQoNCwgJzAnKS5zdWJzdHIoMCwgdGhpcy50b2tlbi5sZW5ndGgpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNaWxsaXNlY29uZHM7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBEYXRlUGFydCA9IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKTtcblxuY2xhc3MgTWludXRlcyBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLmRhdGUuc2V0TWludXRlcyh0aGlzLmRhdGUuZ2V0TWludXRlcygpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaW51dGVzKHRoaXMuZGF0ZS5nZXRNaW51dGVzKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaW51dGVzKHBhcnNlSW50KHZhbC5zdWJzdHIoLTIpKSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgbSA9IHRoaXMuZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4ubGVuZ3RoID4gMSA/IFN0cmluZyhtKS5wYWRTdGFydCgyLCAnMCcpIDogbTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWludXRlczsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBNb250aCBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLmRhdGUuc2V0TW9udGgodGhpcy5kYXRlLmdldE1vbnRoKCkgKyAxKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy5kYXRlLnNldE1vbnRoKHRoaXMuZGF0ZS5nZXRNb250aCgpIC0gMSk7XG4gIH1cblxuICBzZXRUbyh2YWwpIHtcbiAgICB2YWwgPSBwYXJzZUludCh2YWwuc3Vic3RyKC0yKSkgLSAxO1xuICAgIHRoaXMuZGF0ZS5zZXRNb250aCh2YWwgPCAwID8gMCA6IHZhbCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgbW9udGggPSB0aGlzLmRhdGUuZ2V0TW9udGgoKTtcbiAgICBsZXQgdGwgPSB0aGlzLnRva2VuLmxlbmd0aDtcbiAgICByZXR1cm4gdGwgPT09IDIgPyBTdHJpbmcobW9udGggKyAxKS5wYWRTdGFydCgyLCAnMCcpIDogdGwgPT09IDMgPyB0aGlzLmxvY2FsZXMubW9udGhzU2hvcnRbbW9udGhdIDogdGwgPT09IDQgPyB0aGlzLmxvY2FsZXMubW9udGhzW21vbnRoXSA6IFN0cmluZyhtb250aCArIDEpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb250aDsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBTZWNvbmRzIGV4dGVuZHMgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRTZWNvbmRzKHRoaXMuZGF0ZS5nZXRTZWNvbmRzKCkgKyAxKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy5kYXRlLnNldFNlY29uZHModGhpcy5kYXRlLmdldFNlY29uZHMoKSAtIDEpO1xuICB9XG5cbiAgc2V0VG8odmFsKSB7XG4gICAgdGhpcy5kYXRlLnNldFNlY29uZHMocGFyc2VJbnQodmFsLnN1YnN0cigtMikpKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCBzID0gdGhpcy5kYXRlLmdldFNlY29uZHMoKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbi5sZW5ndGggPiAxID8gU3RyaW5nKHMpLnBhZFN0YXJ0KDIsICcwJykgOiBzO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWNvbmRzOyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGF0ZVBhcnQgPSByZXF1aXJlKCcuL2RhdGVwYXJ0Jyk7XG5cbmNsYXNzIFllYXIgZXh0ZW5kcyBEYXRlUGFydCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldEZ1bGxZZWFyKHRoaXMuZGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRGdWxsWWVhcih0aGlzLmRhdGUuZ2V0RnVsbFllYXIoKSAtIDEpO1xuICB9XG5cbiAgc2V0VG8odmFsKSB7XG4gICAgdGhpcy5kYXRlLnNldEZ1bGxZZWFyKHZhbC5zdWJzdHIoLTQpKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB5ZWFyID0gU3RyaW5nKHRoaXMuZGF0ZS5nZXRGdWxsWWVhcigpKS5wYWRTdGFydCg0LCAnMCcpO1xuICAgIHJldHVybiB0aGlzLnRva2VuLmxlbmd0aCA9PT0gMiA/IHllYXIuc3Vic3RyKC0yKSA6IHllYXI7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFllYXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRGF0ZVBhcnQ6IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKSxcbiAgTWVyaWRpZW06IHJlcXVpcmUoJy4vbWVyaWRpZW0nKSxcbiAgRGF5OiByZXF1aXJlKCcuL2RheScpLFxuICBIb3VyczogcmVxdWlyZSgnLi9ob3VycycpLFxuICBNaWxsaXNlY29uZHM6IHJlcXVpcmUoJy4vbWlsbGlzZWNvbmRzJyksXG4gIE1pbnV0ZXM6IHJlcXVpcmUoJy4vbWludXRlcycpLFxuICBNb250aDogcmVxdWlyZSgnLi9tb250aCcpLFxuICBTZWNvbmRzOiByZXF1aXJlKCcuL3NlY29uZHMnKSxcbiAgWWVhcjogcmVxdWlyZSgnLi95ZWFyJylcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7IHRyeSB7IHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTsgdmFyIHZhbHVlID0gaW5mby52YWx1ZTsgfSBjYXRjaCAoZXJyb3IpIHsgcmVqZWN0KGVycm9yKTsgcmV0dXJuOyB9IGlmIChpbmZvLmRvbmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0gZWxzZSB7IFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTsgfSB9XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7IHJldHVybiBmdW5jdGlvbiAoKSB7IHZhciBzZWxmID0gdGhpcywgYXJncyA9IGFyZ3VtZW50czsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpOyBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkgeyBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7IH0gZnVuY3Rpb24gX3Rocm93KGVycikgeyBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTsgfSBfbmV4dCh1bmRlZmluZWQpOyB9KTsgfTsgfVxuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5cbmNvbnN0IFByb21wdCA9IHJlcXVpcmUoJy4vcHJvbXB0Jyk7XG5cbmNvbnN0IF9yZXF1aXJlID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICAgICAgc3R5bGUgPSBfcmVxdWlyZS5zdHlsZSxcbiAgICAgIGNsZWFyID0gX3JlcXVpcmUuY2xlYXIsXG4gICAgICBmaWd1cmVzID0gX3JlcXVpcmUuZmlndXJlcztcblxuY29uc3QgX3JlcXVpcmUyID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpLFxuICAgICAgZXJhc2UgPSBfcmVxdWlyZTIuZXJhc2UsXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZTIuY3Vyc29yO1xuXG5jb25zdCBfcmVxdWlyZTMgPSByZXF1aXJlKCcuLi9kYXRlcGFydHMnKSxcbiAgICAgIERhdGVQYXJ0ID0gX3JlcXVpcmUzLkRhdGVQYXJ0LFxuICAgICAgTWVyaWRpZW0gPSBfcmVxdWlyZTMuTWVyaWRpZW0sXG4gICAgICBEYXkgPSBfcmVxdWlyZTMuRGF5LFxuICAgICAgSG91cnMgPSBfcmVxdWlyZTMuSG91cnMsXG4gICAgICBNaWxsaXNlY29uZHMgPSBfcmVxdWlyZTMuTWlsbGlzZWNvbmRzLFxuICAgICAgTWludXRlcyA9IF9yZXF1aXJlMy5NaW51dGVzLFxuICAgICAgTW9udGggPSBfcmVxdWlyZTMuTW9udGgsXG4gICAgICBTZWNvbmRzID0gX3JlcXVpcmUzLlNlY29uZHMsXG4gICAgICBZZWFyID0gX3JlcXVpcmUzLlllYXI7XG5cbmNvbnN0IHJlZ2V4ID0gL1xcXFwoLil8XCIoKD86XFxcXFtcIlxcXFxdfFteXCJdKSspXCJ8KERbRG9dP3xkezMsNH18ZCl8KE17MSw0fSl8KFlZKD86WVkpPyl8KFthQV0pfChbSGhdezEsMn0pfChtezEsMn0pfChzezEsMn0pfChTezEsNH0pfC4vZztcbmNvbnN0IHJlZ2V4R3JvdXBzID0ge1xuICAxOiAoe1xuICAgIHRva2VuXG4gIH0pID0+IHRva2VuLnJlcGxhY2UoL1xcXFwoLikvZywgJyQxJyksXG4gIDI6IG9wdHMgPT4gbmV3IERheShvcHRzKSxcbiAgLy8gRGF5IC8vIFRPRE9cbiAgMzogb3B0cyA9PiBuZXcgTW9udGgob3B0cyksXG4gIC8vIE1vbnRoXG4gIDQ6IG9wdHMgPT4gbmV3IFllYXIob3B0cyksXG4gIC8vIFllYXJcbiAgNTogb3B0cyA9PiBuZXcgTWVyaWRpZW0ob3B0cyksXG4gIC8vIEFNL1BNIC8vIFRPRE8gKHNwZWNpYWwpXG4gIDY6IG9wdHMgPT4gbmV3IEhvdXJzKG9wdHMpLFxuICAvLyBIb3Vyc1xuICA3OiBvcHRzID0+IG5ldyBNaW51dGVzKG9wdHMpLFxuICAvLyBNaW51dGVzXG4gIDg6IG9wdHMgPT4gbmV3IFNlY29uZHMob3B0cyksXG4gIC8vIFNlY29uZHNcbiAgOTogb3B0cyA9PiBuZXcgTWlsbGlzZWNvbmRzKG9wdHMpIC8vIEZyYWN0aW9uYWwgc2Vjb25kc1xuXG59O1xuY29uc3QgZGZsdExvY2FsZXMgPSB7XG4gIG1vbnRoczogJ0phbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXInLnNwbGl0KCcsJyksXG4gIG1vbnRoc1Nob3J0OiAnSmFuLEZlYixNYXIsQXByLE1heSxKdW4sSnVsLEF1ZyxTZXAsT2N0LE5vdixEZWMnLnNwbGl0KCcsJyksXG4gIHdlZWtkYXlzOiAnU3VuZGF5LE1vbmRheSxUdWVzZGF5LFdlZG5lc2RheSxUaHVyc2RheSxGcmlkYXksU2F0dXJkYXknLnNwbGl0KCcsJyksXG4gIHdlZWtkYXlzU2hvcnQ6ICdTdW4sTW9uLFR1ZSxXZWQsVGh1LEZyaSxTYXQnLnNwbGl0KCcsJylcbn07XG4vKipcbiAqIERhdGVQcm9tcHQgQmFzZSBFbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5tZXNzYWdlIE1lc3NhZ2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbml0aWFsXSBJbmRleCBvZiBkZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMubWFza10gVGhlIGZvcm1hdCBtYXNrXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdHMubG9jYWxlc10gVGhlIGRhdGUgbG9jYWxlc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmVycm9yXSBUaGUgZXJyb3IgbWVzc2FnZSBzaG93biBvbiBpbnZhbGlkIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdGhlIHN1Ym1pdHRlZCB2YWx1ZVxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cblxuY2xhc3MgRGF0ZVByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgICB0aGlzLnR5cGVkID0gJyc7XG4gICAgdGhpcy5sb2NhbGVzID0gT2JqZWN0LmFzc2lnbihkZmx0TG9jYWxlcywgb3B0cy5sb2NhbGVzKTtcbiAgICB0aGlzLl9kYXRlID0gb3B0cy5pbml0aWFsIHx8IG5ldyBEYXRlKCk7XG4gICAgdGhpcy5lcnJvck1zZyA9IG9wdHMuZXJyb3IgfHwgJ1BsZWFzZSBFbnRlciBBIFZhbGlkIFZhbHVlJztcblxuICAgIHRoaXMudmFsaWRhdG9yID0gb3B0cy52YWxpZGF0ZSB8fCAoKCkgPT4gdHJ1ZSk7XG5cbiAgICB0aGlzLm1hc2sgPSBvcHRzLm1hc2sgfHwgJ1lZWVktTU0tREQgSEg6bW06c3MnO1xuICAgIHRoaXMuY2xlYXIgPSBjbGVhcignJywgdGhpcy5vdXQuY29sdW1ucyk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRlO1xuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGU7XG4gIH1cblxuICBzZXQgZGF0ZShkYXRlKSB7XG4gICAgaWYgKGRhdGUpIHRoaXMuX2RhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSk7XG4gIH1cblxuICBzZXQgbWFzayhtYXNrKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICB0aGlzLnBhcnRzID0gW107XG5cbiAgICB3aGlsZSAocmVzdWx0ID0gcmVnZXguZXhlYyhtYXNrKSkge1xuICAgICAgbGV0IG1hdGNoID0gcmVzdWx0LnNoaWZ0KCk7XG4gICAgICBsZXQgaWR4ID0gcmVzdWx0LmZpbmRJbmRleChnciA9PiBnciAhPSBudWxsKTtcbiAgICAgIHRoaXMucGFydHMucHVzaChpZHggaW4gcmVnZXhHcm91cHMgPyByZWdleEdyb3Vwc1tpZHhdKHtcbiAgICAgICAgdG9rZW46IHJlc3VsdFtpZHhdIHx8IG1hdGNoLFxuICAgICAgICBkYXRlOiB0aGlzLmRhdGUsXG4gICAgICAgIHBhcnRzOiB0aGlzLnBhcnRzLFxuICAgICAgICBsb2NhbGVzOiB0aGlzLmxvY2FsZXNcbiAgICAgIH0pIDogcmVzdWx0W2lkeF0gfHwgbWF0Y2gpO1xuICAgIH1cblxuICAgIGxldCBwYXJ0cyA9IHRoaXMucGFydHMucmVkdWNlKChhcnIsIGkpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIGFyclthcnIubGVuZ3RoIC0gMV0gPT09ICdzdHJpbmcnKSBhcnJbYXJyLmxlbmd0aCAtIDFdICs9IGk7ZWxzZSBhcnIucHVzaChpKTtcbiAgICAgIHJldHVybiBhcnI7XG4gICAgfSwgW10pO1xuICAgIHRoaXMucGFydHMuc3BsaWNlKDApO1xuICAgIHRoaXMucGFydHMucHVzaCguLi5wYXJ0cyk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgbW92ZUN1cnNvcihuKSB7XG4gICAgdGhpcy50eXBlZCA9ICcnO1xuICAgIHRoaXMuY3Vyc29yID0gbjtcbiAgICB0aGlzLmZpcmUoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubW92ZUN1cnNvcih0aGlzLnBhcnRzLmZpbmRJbmRleChwID0+IHAgaW5zdGFuY2VvZiBEYXRlUGFydCkpO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5lcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHZhbGlkYXRlKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICByZXR1cm4gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qICgpIHtcbiAgICAgIGxldCB2YWxpZCA9IHlpZWxkIF90aGlzLnZhbGlkYXRvcihfdGhpcy52YWx1ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIF90aGlzLmVycm9yTXNnID0gdmFsaWQ7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLmVycm9yID0gIXZhbGlkO1xuICAgIH0pKCk7XG4gIH1cblxuICBzdWJtaXQoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICByZXR1cm4gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qICgpIHtcbiAgICAgIHlpZWxkIF90aGlzMi52YWxpZGF0ZSgpO1xuXG4gICAgICBpZiAoX3RoaXMyLmVycm9yKSB7XG4gICAgICAgIF90aGlzMi5jb2xvciA9ICdyZWQnO1xuXG4gICAgICAgIF90aGlzMi5maXJlKCk7XG5cbiAgICAgICAgX3RoaXMyLnJlbmRlcigpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMyLmRvbmUgPSB0cnVlO1xuICAgICAgX3RoaXMyLmFib3J0ZWQgPSBmYWxzZTtcblxuICAgICAgX3RoaXMyLmZpcmUoKTtcblxuICAgICAgX3RoaXMyLnJlbmRlcigpO1xuXG4gICAgICBfdGhpczIub3V0LndyaXRlKCdcXG4nKTtcblxuICAgICAgX3RoaXMyLmNsb3NlKCk7XG4gICAgfSkoKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIHRoaXMudHlwZWQgPSAnJztcbiAgICB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS51cCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMudHlwZWQgPSAnJztcbiAgICB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5kb3duKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgbGV0IHByZXYgPSB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5wcmV2KCk7XG4gICAgaWYgKHByZXYgPT0gbnVsbCkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMubW92ZUN1cnNvcih0aGlzLnBhcnRzLmluZGV4T2YocHJldikpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICBsZXQgbmV4dCA9IHRoaXMucGFydHNbdGhpcy5jdXJzb3JdLm5leHQoKTtcbiAgICBpZiAobmV4dCA9PSBudWxsKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKHRoaXMucGFydHMuaW5kZXhPZihuZXh0KSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgbGV0IG5leHQgPSB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5uZXh0KCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKG5leHQgPyB0aGlzLnBhcnRzLmluZGV4T2YobmV4dCkgOiB0aGlzLnBhcnRzLmZpbmRJbmRleChwYXJ0ID0+IHBhcnQgaW5zdGFuY2VvZiBEYXRlUGFydCkpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfKGMpIHtcbiAgICBpZiAoL1xcZC8udGVzdChjKSkge1xuICAgICAgdGhpcy50eXBlZCArPSBjO1xuICAgICAgdGhpcy5wYXJ0c1t0aGlzLmN1cnNvcl0uc2V0VG8odGhpcy50eXBlZCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmhpZGUpO2Vsc2UgdGhpcy5vdXQud3JpdGUoY2xlYXIodGhpcy5vdXRwdXRUZXh0LCB0aGlzLm91dC5jb2x1bW5zKSk7XG4gICAgc3VwZXIucmVuZGVyKCk7IC8vIFByaW50IHByb21wdFxuXG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW3N0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksIGNvbG9yLmJvbGQodGhpcy5tc2cpLCBzdHlsZS5kZWxpbWl0ZXIoZmFsc2UpLCB0aGlzLnBhcnRzLnJlZHVjZSgoYXJyLCBwLCBpZHgpID0+IGFyci5jb25jYXQoaWR4ID09PSB0aGlzLmN1cnNvciAmJiAhdGhpcy5kb25lID8gY29sb3IuY3lhbigpLnVuZGVybGluZShwLnRvU3RyaW5nKCkpIDogcCksIFtdKS5qb2luKCcnKV0uam9pbignICcpOyAvLyBQcmludCBlcnJvclxuXG4gICAgaWYgKHRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMub3V0cHV0VGV4dCArPSB0aGlzLmVycm9yTXNnLnNwbGl0KCdcXG4nKS5yZWR1Y2UoKGEsIGwsIGkpID0+IGEgKyBgXFxuJHtpID8gYCBgIDogZmlndXJlcy5wb2ludGVyU21hbGx9ICR7Y29sb3IucmVkKCkuaXRhbGljKGwpfWAsIGBgKTtcbiAgICB9XG5cbiAgICB0aGlzLm91dC53cml0ZShlcmFzZS5saW5lICsgY3Vyc29yLnRvKDApICsgdGhpcy5vdXRwdXRUZXh0KTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZVByb21wdDsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykgeyB0cnkgeyB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7IHZhciB2YWx1ZSA9IGluZm8udmFsdWU7IH0gY2F0Y2ggKGVycm9yKSB7IHJlamVjdChlcnJvcik7IHJldHVybjsgfSBpZiAoaW5mby5kb25lKSB7IHJlc29sdmUodmFsdWUpOyB9IGVsc2UgeyBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7IH0gfVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB2YXIgc2VsZiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTsgZnVuY3Rpb24gX25leHQodmFsdWUpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpOyB9IGZ1bmN0aW9uIF90aHJvdyhlcnIpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7IH0gX25leHQodW5kZWZpbmVkKTsgfSk7IH07IH1cblxuY29uc3QgY29sb3IgPSByZXF1aXJlKCdrbGV1cicpO1xuXG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuXG5jb25zdCBfcmVxdWlyZSA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKSxcbiAgICAgIGN1cnNvciA9IF9yZXF1aXJlLmN1cnNvcixcbiAgICAgIGVyYXNlID0gX3JlcXVpcmUuZXJhc2U7XG5cbmNvbnN0IF9yZXF1aXJlMiA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICAgIHN0eWxlID0gX3JlcXVpcmUyLnN0eWxlLFxuICAgICAgZmlndXJlcyA9IF9yZXF1aXJlMi5maWd1cmVzLFxuICAgICAgY2xlYXIgPSBfcmVxdWlyZTIuY2xlYXIsXG4gICAgICBsaW5lcyA9IF9yZXF1aXJlMi5saW5lcztcblxuY29uc3QgaXNOdW1iZXIgPSAvWzAtOV0vO1xuXG5jb25zdCBpc0RlZiA9IGFueSA9PiBhbnkgIT09IHVuZGVmaW5lZDtcblxuY29uc3Qgcm91bmQgPSAobnVtYmVyLCBwcmVjaXNpb24pID0+IHtcbiAgbGV0IGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiBmYWN0b3IpIC8gZmFjdG9yO1xufTtcbi8qKlxuICogTnVtYmVyUHJvbXB0IEJhc2UgRWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdHMubWVzc2FnZSBNZXNzYWdlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuc3R5bGU9J2RlZmF1bHQnXSBSZW5kZXIgc3R5bGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbml0aWFsXSBEZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMubWF4PStJbmZpbml0eV0gTWF4IHZhbHVlXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMubWluPS1JbmZpbml0eV0gTWluIHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRzLmZsb2F0PWZhbHNlXSBQYXJzZSBpbnB1dCBhcyBmbG9hdHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5yb3VuZD0yXSBSb3VuZCBmbG9hdHMgdG8geCBkZWNpbWFsc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLmluY3JlbWVudD0xXSBOdW1iZXIgdG8gaW5jcmVtZW50IGJ5IHdoZW4gdXNpbmcgYXJyb3cta2V5c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMudmFsaWRhdGVdIFZhbGlkYXRlIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5lcnJvcl0gVGhlIGludmFsaWQgZXJyb3IgbGFiZWxcbiAqL1xuXG5cbmNsYXNzIE51bWJlclByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMudHJhbnNmb3JtID0gc3R5bGUucmVuZGVyKG9wdHMuc3R5bGUpO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuaW5pdGlhbCA9IGlzRGVmKG9wdHMuaW5pdGlhbCkgPyBvcHRzLmluaXRpYWwgOiAnJztcbiAgICB0aGlzLmZsb2F0ID0gISFvcHRzLmZsb2F0O1xuICAgIHRoaXMucm91bmQgPSBvcHRzLnJvdW5kIHx8IDI7XG4gICAgdGhpcy5pbmMgPSBvcHRzLmluY3JlbWVudCB8fCAxO1xuICAgIHRoaXMubWluID0gaXNEZWYob3B0cy5taW4pID8gb3B0cy5taW4gOiAtSW5maW5pdHk7XG4gICAgdGhpcy5tYXggPSBpc0RlZihvcHRzLm1heCkgPyBvcHRzLm1heCA6IEluZmluaXR5O1xuICAgIHRoaXMuZXJyb3JNc2cgPSBvcHRzLmVycm9yIHx8IGBQbGVhc2UgRW50ZXIgQSBWYWxpZCBWYWx1ZWA7XG5cbiAgICB0aGlzLnZhbGlkYXRvciA9IG9wdHMudmFsaWRhdGUgfHwgKCgpID0+IHRydWUpO1xuXG4gICAgdGhpcy5jb2xvciA9IGBjeWFuYDtcbiAgICB0aGlzLnZhbHVlID0gYGA7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIHRoaXMubGFzdEhpdCA9IDA7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2KSB7XG4gICAgaWYgKCF2ICYmIHYgIT09IDApIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IGNvbG9yLmdyYXkodGhpcy50cmFuc2Zvcm0ucmVuZGVyKGAke3RoaXMuaW5pdGlhbH1gKSk7XG4gICAgICB0aGlzLl92YWx1ZSA9IGBgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy50cmFuc2Zvcm0ucmVuZGVyKGAke3JvdW5kKHYsIHRoaXMucm91bmQpfWApO1xuICAgICAgdGhpcy5fdmFsdWUgPSByb3VuZCh2LCB0aGlzLnJvdW5kKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpcmUoKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBwYXJzZSh4KSB7XG4gICAgcmV0dXJuIHRoaXMuZmxvYXQgPyBwYXJzZUZsb2F0KHgpIDogcGFyc2VJbnQoeCk7XG4gIH1cblxuICB2YWxpZChjKSB7XG4gICAgcmV0dXJuIGMgPT09IGAtYCB8fCBjID09PSBgLmAgJiYgdGhpcy5mbG9hdCB8fCBpc051bWJlci50ZXN0KGMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIHRoaXMudmFsdWUgPSBgYDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLmFib3J0KCk7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBsZXQgeCA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy52YWx1ZSA9IHggIT09IGBgID8geCA6IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKGBcXG5gKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIF9hc3luY1RvR2VuZXJhdG9yKGZ1bmN0aW9uKiAoKSB7XG4gICAgICBsZXQgdmFsaWQgPSB5aWVsZCBfdGhpcy52YWxpZGF0b3IoX3RoaXMudmFsdWUpO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbGlkID09PSBgc3RyaW5nYCkge1xuICAgICAgICBfdGhpcy5lcnJvck1zZyA9IHZhbGlkO1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5lcnJvciA9ICF2YWxpZDtcbiAgICB9KSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgcmV0dXJuIF9hc3luY1RvR2VuZXJhdG9yKGZ1bmN0aW9uKiAoKSB7XG4gICAgICB5aWVsZCBfdGhpczIudmFsaWRhdGUoKTtcblxuICAgICAgaWYgKF90aGlzMi5lcnJvcikge1xuICAgICAgICBfdGhpczIuY29sb3IgPSBgcmVkYDtcblxuICAgICAgICBfdGhpczIuZmlyZSgpO1xuXG4gICAgICAgIF90aGlzMi5yZW5kZXIoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCB4ID0gX3RoaXMyLnZhbHVlO1xuICAgICAgX3RoaXMyLnZhbHVlID0geCAhPT0gYGAgPyB4IDogX3RoaXMyLmluaXRpYWw7XG4gICAgICBfdGhpczIuZG9uZSA9IHRydWU7XG4gICAgICBfdGhpczIuYWJvcnRlZCA9IGZhbHNlO1xuICAgICAgX3RoaXMyLmVycm9yID0gZmFsc2U7XG5cbiAgICAgIF90aGlzMi5maXJlKCk7XG5cbiAgICAgIF90aGlzMi5yZW5kZXIoKTtcblxuICAgICAgX3RoaXMyLm91dC53cml0ZShgXFxuYCk7XG5cbiAgICAgIF90aGlzMi5jbG9zZSgpO1xuICAgIH0pKCk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLnR5cGVkID0gYGA7XG5cbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbiAtIHRoaXMuaW5jO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnZhbHVlID49IHRoaXMubWF4KSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy52YWx1ZSArPSB0aGlzLmluYztcbiAgICB0aGlzLmNvbG9yID0gYGN5YW5gO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMudHlwZWQgPSBgYDtcblxuICAgIGlmICh0aGlzLnZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluICsgdGhpcy5pbmM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5taW4pIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlIC09IHRoaXMuaW5jO1xuICAgIHRoaXMuY29sb3IgPSBgY3lhbmA7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBsZXQgdmFsID0gdGhpcy52YWx1ZS50b1N0cmluZygpO1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMucGFyc2UodmFsID0gdmFsLnNsaWNlKDAsIC0xKSkgfHwgYGA7XG5cbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gJycgJiYgdGhpcy52YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfVxuXG4gICAgdGhpcy5jb2xvciA9IGBjeWFuYDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5pbml0aWFsO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmICghdGhpcy52YWxpZChjKSkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKG5vdyAtIHRoaXMubGFzdEhpdCA+IDEwMDApIHRoaXMudHlwZWQgPSBgYDsgLy8gMXMgZWxhcHNlZFxuXG4gICAgdGhpcy50eXBlZCArPSBjO1xuICAgIHRoaXMubGFzdEhpdCA9IG5vdztcbiAgICB0aGlzLmNvbG9yID0gYGN5YW5gO1xuICAgIGlmIChjID09PSBgLmApIHJldHVybiB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5taW4odGhpcy5wYXJzZSh0aGlzLnR5cGVkKSwgdGhpcy5tYXgpO1xuICAgIGlmICh0aGlzLnZhbHVlID4gdGhpcy5tYXgpIHRoaXMudmFsdWUgPSB0aGlzLm1heDtcbiAgICBpZiAodGhpcy52YWx1ZSA8IHRoaXMubWluKSB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcblxuICAgIGlmICghdGhpcy5maXJzdFJlbmRlcikge1xuICAgICAgaWYgKHRoaXMub3V0cHV0RXJyb3IpIHRoaXMub3V0LndyaXRlKGN1cnNvci5kb3duKGxpbmVzKHRoaXMub3V0cHV0RXJyb3IsIHRoaXMub3V0LmNvbHVtbnMpIC0gMSkgKyBjbGVhcih0aGlzLm91dHB1dEVycm9yLCB0aGlzLm91dC5jb2x1bW5zKSk7XG4gICAgICB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICB9XG5cbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICB0aGlzLm91dHB1dEVycm9yID0gJyc7IC8vIFByaW50IHByb21wdFxuXG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW3N0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksIGNvbG9yLmJvbGQodGhpcy5tc2cpLCBzdHlsZS5kZWxpbWl0ZXIodGhpcy5kb25lKSwgIXRoaXMuZG9uZSB8fCAhdGhpcy5kb25lICYmICF0aGlzLnBsYWNlaG9sZGVyID8gY29sb3JbdGhpcy5jb2xvcl0oKS51bmRlcmxpbmUodGhpcy5yZW5kZXJlZCkgOiB0aGlzLnJlbmRlcmVkXS5qb2luKGAgYCk7IC8vIFByaW50IGVycm9yXG5cbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgdGhpcy5vdXRwdXRFcnJvciArPSB0aGlzLmVycm9yTXNnLnNwbGl0KGBcXG5gKS5yZWR1Y2UoKGEsIGwsIGkpID0+IGEgKyBgXFxuJHtpID8gYCBgIDogZmlndXJlcy5wb2ludGVyU21hbGx9ICR7Y29sb3IucmVkKCkuaXRhbGljKGwpfWAsIGBgKTtcbiAgICB9XG5cbiAgICB0aGlzLm91dC53cml0ZShlcmFzZS5saW5lICsgY3Vyc29yLnRvKDApICsgdGhpcy5vdXRwdXRUZXh0ICsgY3Vyc29yLnNhdmUgKyB0aGlzLm91dHB1dEVycm9yICsgY3Vyc29yLnJlc3RvcmUpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXJQcm9tcHQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5cbmNvbnN0IF9yZXF1aXJlID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpLFxuICAgICAgY3Vyc29yID0gX3JlcXVpcmUuY3Vyc29yO1xuXG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuXG5jb25zdCBfcmVxdWlyZTIgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgICBjbGVhciA9IF9yZXF1aXJlMi5jbGVhcixcbiAgICAgIGZpZ3VyZXMgPSBfcmVxdWlyZTIuZmlndXJlcyxcbiAgICAgIHN0eWxlID0gX3JlcXVpcmUyLnN0eWxlLFxuICAgICAgd3JhcCA9IF9yZXF1aXJlMi53cmFwLFxuICAgICAgZW50cmllc1RvRGlzcGxheSA9IF9yZXF1aXJlMi5lbnRyaWVzVG9EaXNwbGF5O1xuLyoqXG4gKiBNdWx0aXNlbGVjdFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZSBvYmplY3RzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMud2Fybl0gSGludCBzaG93biBmb3IgZGlzYWJsZWQgY2hvaWNlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1heF0gTWF4IGNob2ljZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMub3B0aW9uc1BlclBhZ2U9MTBdIE1heCBvcHRpb25zIHRvIGRpc3BsYXkgYXQgb25jZVxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cblxuXG5jbGFzcyBNdWx0aXNlbGVjdFByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0cy5jdXJzb3IgfHwgMDtcbiAgICB0aGlzLnNjcm9sbEluZGV4ID0gb3B0cy5jdXJzb3IgfHwgMDtcbiAgICB0aGlzLmhpbnQgPSBvcHRzLmhpbnQgfHwgJyc7XG4gICAgdGhpcy53YXJuID0gb3B0cy53YXJuIHx8ICctIFRoaXMgb3B0aW9uIGlzIGRpc2FibGVkIC0nO1xuICAgIHRoaXMubWluU2VsZWN0ZWQgPSBvcHRzLm1pbjtcbiAgICB0aGlzLnNob3dNaW5FcnJvciA9IGZhbHNlO1xuICAgIHRoaXMubWF4Q2hvaWNlcyA9IG9wdHMubWF4O1xuICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gb3B0cy5pbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5vcHRpb25zUGVyUGFnZSA9IG9wdHMub3B0aW9uc1BlclBhZ2UgfHwgMTA7XG4gICAgdGhpcy52YWx1ZSA9IG9wdHMuY2hvaWNlcy5tYXAoKGNoLCBpZHgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY2ggPT09ICdzdHJpbmcnKSBjaCA9IHtcbiAgICAgICAgdGl0bGU6IGNoLFxuICAgICAgICB2YWx1ZTogaWR4XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6IGNoICYmIChjaC50aXRsZSB8fCBjaC52YWx1ZSB8fCBjaCksXG4gICAgICAgIGRlc2NyaXB0aW9uOiBjaCAmJiBjaC5kZXNjcmlwdGlvbixcbiAgICAgICAgdmFsdWU6IGNoICYmIChjaC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gaWR4IDogY2gudmFsdWUpLFxuICAgICAgICBzZWxlY3RlZDogY2ggJiYgY2guc2VsZWN0ZWQsXG4gICAgICAgIGRpc2FibGVkOiBjaCAmJiBjaC5kaXNhYmxlZFxuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuXG4gICAgaWYgKCFvcHRzLm92ZXJyaWRlUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUubWFwKHYgPT4gIXYuc2VsZWN0ZWQpO1xuICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWUuZmlsdGVyKHYgPT4gdi5zZWxlY3RlZCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy52YWx1ZS5maWx0ZXIoZSA9PiBlLnNlbGVjdGVkKTtcblxuICAgIGlmICh0aGlzLm1pblNlbGVjdGVkICYmIHNlbGVjdGVkLmxlbmd0aCA8IHRoaXMubWluU2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2hvd01pbkVycm9yID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSAodGhpcy5jdXJzb3IgKyAxKSAlIHRoaXMudmFsdWUubGVuZ3RoO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICB1cCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPT09IDApIHtcbiAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnNvci0tO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIGlmICh0aGlzLmN1cnNvciA9PT0gdGhpcy52YWx1ZS5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3Vyc29yKys7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgdGhpcy52YWx1ZVt0aGlzLmN1cnNvcl0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgaWYgKHRoaXMudmFsdWUuZmlsdGVyKGUgPT4gZS5zZWxlY3RlZCkubGVuZ3RoID49IHRoaXMubWF4Q2hvaWNlcykgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMudmFsdWVbdGhpcy5jdXJzb3JdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgaGFuZGxlU3BhY2VUb2dnbGUoKSB7XG4gICAgY29uc3QgdiA9IHRoaXMudmFsdWVbdGhpcy5jdXJzb3JdO1xuXG4gICAgaWYgKHYuc2VsZWN0ZWQpIHtcbiAgICAgIHYuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIGlmICh2LmRpc2FibGVkIHx8IHRoaXMudmFsdWUuZmlsdGVyKGUgPT4gZS5zZWxlY3RlZCkubGVuZ3RoID49IHRoaXMubWF4Q2hvaWNlcykge1xuICAgICAgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlQWxsKCkge1xuICAgIGlmICh0aGlzLm1heENob2ljZXMgIT09IHVuZGVmaW5lZCB8fCB0aGlzLnZhbHVlW3RoaXMuY3Vyc29yXS5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1NlbGVjdGVkID0gIXRoaXMudmFsdWVbdGhpcy5jdXJzb3JdLnNlbGVjdGVkO1xuICAgIHRoaXMudmFsdWUuZmlsdGVyKHYgPT4gIXYuZGlzYWJsZWQpLmZvckVhY2godiA9PiB2LnNlbGVjdGVkID0gbmV3U2VsZWN0ZWQpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjID09PSAnICcpIHtcbiAgICAgIHRoaXMuaGFuZGxlU3BhY2VUb2dnbGUoKTtcbiAgICB9IGVsc2UgaWYgKGMgPT09ICdhJykge1xuICAgICAgdGhpcy50b2dnbGVBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckluc3RydWN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmluc3RydWN0aW9ucykge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmluc3RydWN0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdHJ1Y3Rpb25zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJ1xcbkluc3RydWN0aW9uczpcXG4nICsgYCAgICAke2ZpZ3VyZXMuYXJyb3dVcH0vJHtmaWd1cmVzLmFycm93RG93bn06IEhpZ2hsaWdodCBvcHRpb25cXG5gICsgYCAgICAke2ZpZ3VyZXMuYXJyb3dMZWZ0fS8ke2ZpZ3VyZXMuYXJyb3dSaWdodH0vW3NwYWNlXTogVG9nZ2xlIHNlbGVjdGlvblxcbmAgKyAodGhpcy5tYXhDaG9pY2VzID09PSB1bmRlZmluZWQgPyBgICAgIGE6IFRvZ2dsZSBhbGxcXG5gIDogJycpICsgYCAgICBlbnRlci9yZXR1cm46IENvbXBsZXRlIGFuc3dlcmA7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVuZGVyT3B0aW9uKGN1cnNvciwgdiwgaSwgYXJyb3dJbmRpY2F0b3IpIHtcbiAgICBjb25zdCBwcmVmaXggPSAodi5zZWxlY3RlZCA/IGNvbG9yLmdyZWVuKGZpZ3VyZXMucmFkaW9PbikgOiBmaWd1cmVzLnJhZGlvT2ZmKSArICcgJyArIGFycm93SW5kaWNhdG9yICsgJyAnO1xuICAgIGxldCB0aXRsZSwgZGVzYztcblxuICAgIGlmICh2LmRpc2FibGVkKSB7XG4gICAgICB0aXRsZSA9IGN1cnNvciA9PT0gaSA/IGNvbG9yLmdyYXkoKS51bmRlcmxpbmUodi50aXRsZSkgOiBjb2xvci5zdHJpa2V0aHJvdWdoKCkuZ3JheSh2LnRpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGUgPSBjdXJzb3IgPT09IGkgPyBjb2xvci5jeWFuKCkudW5kZXJsaW5lKHYudGl0bGUpIDogdi50aXRsZTtcblxuICAgICAgaWYgKGN1cnNvciA9PT0gaSAmJiB2LmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGRlc2MgPSBgIC0gJHt2LmRlc2NyaXB0aW9ufWA7XG5cbiAgICAgICAgaWYgKHByZWZpeC5sZW5ndGggKyB0aXRsZS5sZW5ndGggKyBkZXNjLmxlbmd0aCA+PSB0aGlzLm91dC5jb2x1bW5zIHx8IHYuZGVzY3JpcHRpb24uc3BsaXQoL1xccj9cXG4vKS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgZGVzYyA9ICdcXG4nICsgd3JhcCh2LmRlc2NyaXB0aW9uLCB7XG4gICAgICAgICAgICBtYXJnaW46IHByZWZpeC5sZW5ndGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5vdXQuY29sdW1uc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArIHRpdGxlICsgY29sb3IuZ3JheShkZXNjIHx8ICcnKTtcbiAgfSAvLyBzaGFyZWQgd2l0aCBhdXRvY29tcGxldGVNdWx0aXNlbGVjdFxuXG5cbiAgcGFnaW5hdGVPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjb2xvci5yZWQoJ05vIG1hdGNoZXMgZm9yIHRoaXMgcXVlcnkuJyk7XG4gICAgfVxuXG4gICAgbGV0IF9lbnRyaWVzVG9EaXNwbGF5ID0gZW50cmllc1RvRGlzcGxheSh0aGlzLmN1cnNvciwgb3B0aW9ucy5sZW5ndGgsIHRoaXMub3B0aW9uc1BlclBhZ2UpLFxuICAgICAgICBzdGFydEluZGV4ID0gX2VudHJpZXNUb0Rpc3BsYXkuc3RhcnRJbmRleCxcbiAgICAgICAgZW5kSW5kZXggPSBfZW50cmllc1RvRGlzcGxheS5lbmRJbmRleDtcblxuICAgIGxldCBwcmVmaXgsXG4gICAgICAgIHN0eWxlZE9wdGlvbnMgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgZW5kSW5kZXg7IGkrKykge1xuICAgICAgaWYgKGkgPT09IHN0YXJ0SW5kZXggJiYgc3RhcnRJbmRleCA+IDApIHtcbiAgICAgICAgcHJlZml4ID0gZmlndXJlcy5hcnJvd1VwO1xuICAgICAgfSBlbHNlIGlmIChpID09PSBlbmRJbmRleCAtIDEgJiYgZW5kSW5kZXggPCBvcHRpb25zLmxlbmd0aCkge1xuICAgICAgICBwcmVmaXggPSBmaWd1cmVzLmFycm93RG93bjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZWZpeCA9ICcgJztcbiAgICAgIH1cblxuICAgICAgc3R5bGVkT3B0aW9ucy5wdXNoKHRoaXMucmVuZGVyT3B0aW9uKHRoaXMuY3Vyc29yLCBvcHRpb25zW2ldLCBpLCBwcmVmaXgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1xcbicgKyBzdHlsZWRPcHRpb25zLmpvaW4oJ1xcbicpO1xuICB9IC8vIHNoYXJlZCB3aXRoIGF1dG9jb21sZXRlTXVsdGlzZWxlY3RcblxuXG4gIHJlbmRlck9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmICghdGhpcy5kb25lKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYWdpbmF0ZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVuZGVyRG9uZU9ySW5zdHJ1Y3Rpb25zKCkge1xuICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLm1hcCh2ID0+IHYudGl0bGUpLmpvaW4oJywgJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0ID0gW2NvbG9yLmdyYXkodGhpcy5oaW50KSwgdGhpcy5yZW5kZXJJbnN0cnVjdGlvbnMoKV07XG5cbiAgICBpZiAodGhpcy52YWx1ZVt0aGlzLmN1cnNvcl0uZGlzYWJsZWQpIHtcbiAgICAgIG91dHB1dC5wdXNoKGNvbG9yLnllbGxvdyh0aGlzLndhcm4pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0LmpvaW4oJyAnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmhpZGUpO1xuICAgIHN1cGVyLnJlbmRlcigpOyAvLyBwcmludCBwcm9tcHRcblxuICAgIGxldCBwcm9tcHQgPSBbc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSwgY29sb3IuYm9sZCh0aGlzLm1zZyksIHN0eWxlLmRlbGltaXRlcihmYWxzZSksIHRoaXMucmVuZGVyRG9uZU9ySW5zdHJ1Y3Rpb25zKCldLmpvaW4oJyAnKTtcblxuICAgIGlmICh0aGlzLnNob3dNaW5FcnJvcikge1xuICAgICAgcHJvbXB0ICs9IGNvbG9yLnJlZChgWW91IG11c3Qgc2VsZWN0IGEgbWluaW11bSBvZiAke3RoaXMubWluU2VsZWN0ZWR9IGNob2ljZXMuYCk7XG4gICAgICB0aGlzLnNob3dNaW5FcnJvciA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByb21wdCArPSB0aGlzLnJlbmRlck9wdGlvbnModGhpcy52YWx1ZSk7XG4gICAgdGhpcy5vdXQud3JpdGUodGhpcy5jbGVhciArIHByb21wdCk7XG4gICAgdGhpcy5jbGVhciA9IGNsZWFyKHByb21wdCwgdGhpcy5vdXQuY29sdW1ucyk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpc2VsZWN0UHJvbXB0OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykgeyB0cnkgeyB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7IHZhciB2YWx1ZSA9IGluZm8udmFsdWU7IH0gY2F0Y2ggKGVycm9yKSB7IHJlamVjdChlcnJvcik7IHJldHVybjsgfSBpZiAoaW5mby5kb25lKSB7IHJlc29sdmUodmFsdWUpOyB9IGVsc2UgeyBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7IH0gfVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB2YXIgc2VsZiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTsgZnVuY3Rpb24gX25leHQodmFsdWUpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpOyB9IGZ1bmN0aW9uIF90aHJvdyhlcnIpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7IH0gX25leHQodW5kZWZpbmVkKTsgfSk7IH07IH1cblxuY29uc3QgY29sb3IgPSByZXF1aXJlKCdrbGV1cicpO1xuXG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuXG5jb25zdCBfcmVxdWlyZSA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKSxcbiAgICAgIGVyYXNlID0gX3JlcXVpcmUuZXJhc2UsXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZS5jdXJzb3I7XG5cbmNvbnN0IF9yZXF1aXJlMiA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgICAgIHN0eWxlID0gX3JlcXVpcmUyLnN0eWxlLFxuICAgICAgY2xlYXIgPSBfcmVxdWlyZTIuY2xlYXIsXG4gICAgICBmaWd1cmVzID0gX3JlcXVpcmUyLmZpZ3VyZXMsXG4gICAgICB3cmFwID0gX3JlcXVpcmUyLndyYXAsXG4gICAgICBlbnRyaWVzVG9EaXNwbGF5ID0gX3JlcXVpcmUyLmVudHJpZXNUb0Rpc3BsYXk7XG5cbmNvbnN0IGdldFZhbCA9IChhcnIsIGkpID0+IGFycltpXSAmJiAoYXJyW2ldLnZhbHVlIHx8IGFycltpXS50aXRsZSB8fCBhcnJbaV0pO1xuXG5jb25zdCBnZXRUaXRsZSA9IChhcnIsIGkpID0+IGFycltpXSAmJiAoYXJyW2ldLnRpdGxlIHx8IGFycltpXS52YWx1ZSB8fCBhcnJbaV0pO1xuXG5jb25zdCBnZXRJbmRleCA9IChhcnIsIHZhbE9yVGl0bGUpID0+IHtcbiAgY29uc3QgaW5kZXggPSBhcnIuZmluZEluZGV4KGVsID0+IGVsLnZhbHVlID09PSB2YWxPclRpdGxlIHx8IGVsLnRpdGxlID09PSB2YWxPclRpdGxlKTtcbiAgcmV0dXJuIGluZGV4ID4gLTEgPyBpbmRleCA6IHVuZGVmaW5lZDtcbn07XG4vKipcbiAqIFRleHRQcm9tcHQgQmFzZSBFbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5tZXNzYWdlIE1lc3NhZ2VcbiAqIEBwYXJhbSB7QXJyYXl9IG9wdHMuY2hvaWNlcyBBcnJheSBvZiBhdXRvLWNvbXBsZXRlIGNob2ljZXMgb2JqZWN0c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuc3VnZ2VzdF0gRmlsdGVyIGZ1bmN0aW9uLiBEZWZhdWx0cyB0byBzb3J0IGJ5IHRpdGxlXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMubGltaXQ9MTBdIE1heCBudW1iZXIgb2YgcmVzdWx0cyB0byBzaG93XG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMuY3Vyc29yPTBdIEN1cnNvciBzdGFydCBwb3NpdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLnN0eWxlPSdkZWZhdWx0J10gUmVuZGVyIHN0eWxlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuZmFsbGJhY2tdIEZhbGxiYWNrIG1lc3NhZ2UgLSBpbml0aWFsIHRvIGRlZmF1bHQgdmFsdWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5pbml0aWFsXSBJbmRleCBvZiB0aGUgZGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5jbGVhckZpcnN0XSBUaGUgZmlyc3QgRVNDQVBFIGtleXByZXNzIHdpbGwgY2xlYXIgdGhlIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5ub01hdGNoZXNdIFRoZSBubyBtYXRjaGVzIGZvdW5kIGxhYmVsXG4gKi9cblxuXG5jbGFzcyBBdXRvY29tcGxldGVQcm9tcHQgZXh0ZW5kcyBQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLnN1Z2dlc3QgPSBvcHRzLnN1Z2dlc3Q7XG4gICAgdGhpcy5jaG9pY2VzID0gb3B0cy5jaG9pY2VzO1xuICAgIHRoaXMuaW5pdGlhbCA9IHR5cGVvZiBvcHRzLmluaXRpYWwgPT09ICdudW1iZXInID8gb3B0cy5pbml0aWFsIDogZ2V0SW5kZXgob3B0cy5jaG9pY2VzLCBvcHRzLmluaXRpYWwpO1xuICAgIHRoaXMuc2VsZWN0ID0gdGhpcy5pbml0aWFsIHx8IG9wdHMuY3Vyc29yIHx8IDA7XG4gICAgdGhpcy5pMThuID0ge1xuICAgICAgbm9NYXRjaGVzOiBvcHRzLm5vTWF0Y2hlcyB8fCAnbm8gbWF0Y2hlcyBmb3VuZCdcbiAgICB9O1xuICAgIHRoaXMuZmFsbGJhY2sgPSBvcHRzLmZhbGxiYWNrIHx8IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmNsZWFyRmlyc3QgPSBvcHRzLmNsZWFyRmlyc3QgfHwgZmFsc2U7XG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IFtdO1xuICAgIHRoaXMuaW5wdXQgPSAnJztcbiAgICB0aGlzLmxpbWl0ID0gb3B0cy5saW1pdCB8fCAxMDtcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSBzdHlsZS5yZW5kZXIob3B0cy5zdHlsZSk7XG4gICAgdGhpcy5zY2FsZSA9IHRoaXMudHJhbnNmb3JtLnNjYWxlO1xuICAgIHRoaXMucmVuZGVyID0gdGhpcy5yZW5kZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBsZXRlID0gdGhpcy5jb21wbGV0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY2xlYXIgPSBjbGVhcignJywgdGhpcy5vdXQuY29sdW1ucyk7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCBmYWxsYmFjayhmYikge1xuICAgIHRoaXMuX2ZiID0gTnVtYmVyLmlzU2FmZUludGVnZXIocGFyc2VJbnQoZmIpKSA/IHBhcnNlSW50KGZiKSA6IGZiO1xuICB9XG5cbiAgZ2V0IGZhbGxiYWNrKCkge1xuICAgIGxldCBjaG9pY2U7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9mYiA9PT0gJ251bWJlcicpIGNob2ljZSA9IHRoaXMuY2hvaWNlc1t0aGlzLl9mYl07ZWxzZSBpZiAodHlwZW9mIHRoaXMuX2ZiID09PSAnc3RyaW5nJykgY2hvaWNlID0ge1xuICAgICAgdGl0bGU6IHRoaXMuX2ZiXG4gICAgfTtcbiAgICByZXR1cm4gY2hvaWNlIHx8IHRoaXMuX2ZiIHx8IHtcbiAgICAgIHRpdGxlOiB0aGlzLmkxOG4ubm9NYXRjaGVzXG4gICAgfTtcbiAgfVxuXG4gIG1vdmVTZWxlY3QoaSkge1xuICAgIHRoaXMuc2VsZWN0ID0gaTtcbiAgICBpZiAodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggPiAwKSB0aGlzLnZhbHVlID0gZ2V0VmFsKHRoaXMuc3VnZ2VzdGlvbnMsIGkpO2Vsc2UgdGhpcy52YWx1ZSA9IHRoaXMuZmFsbGJhY2sudmFsdWU7XG4gICAgdGhpcy5maXJlKCk7XG4gIH1cblxuICBjb21wbGV0ZShjYikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICByZXR1cm4gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qICgpIHtcbiAgICAgIGNvbnN0IHAgPSBfdGhpcy5jb21wbGV0aW5nID0gX3RoaXMuc3VnZ2VzdChfdGhpcy5pbnB1dCwgX3RoaXMuY2hvaWNlcyk7XG5cbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0geWllbGQgcDtcbiAgICAgIGlmIChfdGhpcy5jb21wbGV0aW5nICE9PSBwKSByZXR1cm47XG4gICAgICBfdGhpcy5zdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zLm1hcCgocywgaSwgYXJyKSA9PiAoe1xuICAgICAgICB0aXRsZTogZ2V0VGl0bGUoYXJyLCBpKSxcbiAgICAgICAgdmFsdWU6IGdldFZhbChhcnIsIGkpLFxuICAgICAgICBkZXNjcmlwdGlvbjogcy5kZXNjcmlwdGlvblxuICAgICAgfSkpO1xuICAgICAgX3RoaXMuY29tcGxldGluZyA9IGZhbHNlO1xuICAgICAgY29uc3QgbCA9IE1hdGgubWF4KHN1Z2dlc3Rpb25zLmxlbmd0aCAtIDEsIDApO1xuXG4gICAgICBfdGhpcy5tb3ZlU2VsZWN0KE1hdGgubWluKGwsIF90aGlzLnNlbGVjdCkpO1xuXG4gICAgICBjYiAmJiBjYigpO1xuICAgIH0pKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmlucHV0ID0gJyc7XG4gICAgdGhpcy5jb21wbGV0ZSgoKSA9PiB7XG4gICAgICB0aGlzLm1vdmVTZWxlY3QodGhpcy5pbml0aWFsICE9PSB2b2lkIDAgPyB0aGlzLmluaXRpYWwgOiAwKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgaWYgKHRoaXMuY2xlYXJGaXJzdCAmJiB0aGlzLmlucHV0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lID0gdGhpcy5leGl0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmZpcmUoKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgdGhpcy5kb25lID0gdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLmV4aXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHN1Ym1pdCgpIHtcbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIHRoaXMuYWJvcnRlZCA9IHRoaXMuZXhpdGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgXyhjLCBrZXkpIHtcbiAgICBsZXQgczEgPSB0aGlzLmlucHV0LnNsaWNlKDAsIHRoaXMuY3Vyc29yKTtcbiAgICBsZXQgczIgPSB0aGlzLmlucHV0LnNsaWNlKHRoaXMuY3Vyc29yKTtcbiAgICB0aGlzLmlucHV0ID0gYCR7czF9JHtjfSR7czJ9YDtcbiAgICB0aGlzLmN1cnNvciA9IHMxLmxlbmd0aCArIDE7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPT09IDApIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICBsZXQgczEgPSB0aGlzLmlucHV0LnNsaWNlKDAsIHRoaXMuY3Vyc29yIC0gMSk7XG4gICAgbGV0IHMyID0gdGhpcy5pbnB1dC5zbGljZSh0aGlzLmN1cnNvcik7XG4gICAgdGhpcy5pbnB1dCA9IGAke3MxfSR7czJ9YDtcbiAgICB0aGlzLmNvbXBsZXRlKHRoaXMucmVuZGVyKTtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yIC0gMTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVsZXRlRm9yd2FyZCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgKiB0aGlzLnNjYWxlID49IHRoaXMucmVuZGVyZWQubGVuZ3RoKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgbGV0IHMxID0gdGhpcy5pbnB1dC5zbGljZSgwLCB0aGlzLmN1cnNvcik7XG4gICAgbGV0IHMyID0gdGhpcy5pbnB1dC5zbGljZSh0aGlzLmN1cnNvciArIDEpO1xuICAgIHRoaXMuaW5wdXQgPSBgJHtzMX0ke3MyfWA7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIHRoaXMubW92ZVNlbGVjdCgwKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICB0aGlzLm1vdmVTZWxlY3QodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVTZWxlY3QodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3ZlU2VsZWN0KHRoaXMuc2VsZWN0IC0gMSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ID09PSB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMubW92ZVNlbGVjdCgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3ZlU2VsZWN0KHRoaXMuc2VsZWN0ICsgMSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ID09PSB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMubW92ZVNlbGVjdCgwKTtcbiAgICB9IGVsc2UgdGhpcy5tb3ZlU2VsZWN0KHRoaXMuc2VsZWN0ICsgMSk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbmV4dFBhZ2UoKSB7XG4gICAgdGhpcy5tb3ZlU2VsZWN0KE1hdGgubWluKHRoaXMuc2VsZWN0ICsgdGhpcy5saW1pdCwgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByZXZQYWdlKCkge1xuICAgIHRoaXMubW92ZVNlbGVjdChNYXRoLm1heCh0aGlzLnNlbGVjdCAtIHRoaXMubGltaXQsIDApKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPD0gMCkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3IgLSAxO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgKiB0aGlzLnNjYWxlID49IHRoaXMucmVuZGVyZWQubGVuZ3RoKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvciArIDE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlck9wdGlvbih2LCBob3ZlcmVkLCBpc1N0YXJ0LCBpc0VuZCkge1xuICAgIGxldCBkZXNjO1xuICAgIGxldCBwcmVmaXggPSBpc1N0YXJ0ID8gZmlndXJlcy5hcnJvd1VwIDogaXNFbmQgPyBmaWd1cmVzLmFycm93RG93biA6ICcgJztcbiAgICBsZXQgdGl0bGUgPSBob3ZlcmVkID8gY29sb3IuY3lhbigpLnVuZGVybGluZSh2LnRpdGxlKSA6IHYudGl0bGU7XG4gICAgcHJlZml4ID0gKGhvdmVyZWQgPyBjb2xvci5jeWFuKGZpZ3VyZXMucG9pbnRlcikgKyAnICcgOiAnICAnKSArIHByZWZpeDtcblxuICAgIGlmICh2LmRlc2NyaXB0aW9uKSB7XG4gICAgICBkZXNjID0gYCAtICR7di5kZXNjcmlwdGlvbn1gO1xuXG4gICAgICBpZiAocHJlZml4Lmxlbmd0aCArIHRpdGxlLmxlbmd0aCArIGRlc2MubGVuZ3RoID49IHRoaXMub3V0LmNvbHVtbnMgfHwgdi5kZXNjcmlwdGlvbi5zcGxpdCgvXFxyP1xcbi8pLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZGVzYyA9ICdcXG4nICsgd3JhcCh2LmRlc2NyaXB0aW9uLCB7XG4gICAgICAgICAgbWFyZ2luOiAzLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLm91dC5jb2x1bW5zXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwcmVmaXggKyAnICcgKyB0aXRsZSArIGNvbG9yLmdyYXkoZGVzYyB8fCAnJyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMub3V0LndyaXRlKGN1cnNvci5oaWRlKTtlbHNlIHRoaXMub3V0LndyaXRlKGNsZWFyKHRoaXMub3V0cHV0VGV4dCwgdGhpcy5vdXQuY29sdW1ucykpO1xuICAgIHN1cGVyLnJlbmRlcigpO1xuXG4gICAgbGV0IF9lbnRyaWVzVG9EaXNwbGF5ID0gZW50cmllc1RvRGlzcGxheSh0aGlzLnNlbGVjdCwgdGhpcy5jaG9pY2VzLmxlbmd0aCwgdGhpcy5saW1pdCksXG4gICAgICAgIHN0YXJ0SW5kZXggPSBfZW50cmllc1RvRGlzcGxheS5zdGFydEluZGV4LFxuICAgICAgICBlbmRJbmRleCA9IF9lbnRyaWVzVG9EaXNwbGF5LmVuZEluZGV4O1xuXG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW3N0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCwgdGhpcy5leGl0ZWQpLCBjb2xvci5ib2xkKHRoaXMubXNnKSwgc3R5bGUuZGVsaW1pdGVyKHRoaXMuY29tcGxldGluZyksIHRoaXMuZG9uZSAmJiB0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuc2VsZWN0XSA/IHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zZWxlY3RdLnRpdGxlIDogdGhpcy5yZW5kZXJlZCA9IHRoaXMudHJhbnNmb3JtLnJlbmRlcih0aGlzLmlucHV0KV0uam9pbignICcpO1xuXG4gICAgaWYgKCF0aGlzLmRvbmUpIHtcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gdGhpcy5zdWdnZXN0aW9ucy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCkubWFwKChpdGVtLCBpKSA9PiB0aGlzLnJlbmRlck9wdGlvbihpdGVtLCB0aGlzLnNlbGVjdCA9PT0gaSArIHN0YXJ0SW5kZXgsIGkgPT09IDAgJiYgc3RhcnRJbmRleCA+IDAsIGkgKyBzdGFydEluZGV4ID09PSBlbmRJbmRleCAtIDEgJiYgZW5kSW5kZXggPCB0aGlzLmNob2ljZXMubGVuZ3RoKSkuam9pbignXFxuJyk7XG4gICAgICB0aGlzLm91dHB1dFRleHQgKz0gYFxcbmAgKyAoc3VnZ2VzdGlvbnMgfHwgY29sb3IuZ3JheSh0aGlzLmZhbGxiYWNrLnRpdGxlKSk7XG4gICAgfVxuXG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dG9jb21wbGV0ZVByb21wdDsiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcblxuY29uc3QgX3JlcXVpcmUgPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyksXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZS5jdXJzb3I7XG5cbmNvbnN0IE11bHRpc2VsZWN0UHJvbXB0ID0gcmVxdWlyZSgnLi9tdWx0aXNlbGVjdCcpO1xuXG5jb25zdCBfcmVxdWlyZTIgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgICBjbGVhciA9IF9yZXF1aXJlMi5jbGVhcixcbiAgICAgIHN0eWxlID0gX3JlcXVpcmUyLnN0eWxlLFxuICAgICAgZmlndXJlcyA9IF9yZXF1aXJlMi5maWd1cmVzO1xuLyoqXG4gKiBNdWx0aXNlbGVjdFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZSBvYmplY3RzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMud2Fybl0gSGludCBzaG93biBmb3IgZGlzYWJsZWQgY2hvaWNlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1heF0gTWF4IGNob2ljZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqL1xuXG5cbmNsYXNzIEF1dG9jb21wbGV0ZU11bHRpc2VsZWN0UHJvbXB0IGV4dGVuZHMgTXVsdGlzZWxlY3RQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBvcHRzLm92ZXJyaWRlUmVuZGVyID0gdHJ1ZTtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSAnJztcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuICAgIHRoaXMuZmlsdGVyZWRPcHRpb25zID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSAodGhpcy5jdXJzb3IgKyAxKSAlIHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yID09PSAwKSB7XG4gICAgICB0aGlzLmN1cnNvciA9IHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3Vyc29yLS07XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yID09PSB0aGlzLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3Vyc29yKys7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgdGhpcy5maWx0ZXJlZE9wdGlvbnNbdGhpcy5jdXJzb3JdLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIGlmICh0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLmxlbmd0aCA+PSB0aGlzLm1heENob2ljZXMpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLmZpbHRlcmVkT3B0aW9uc1t0aGlzLmN1cnNvcl0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZS5zdWJzdHIoMCwgdGhpcy5pbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgdGhpcy51cGRhdGVGaWx0ZXJlZE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVGaWx0ZXJlZE9wdGlvbnMoKSB7XG4gICAgY29uc3QgY3VycmVudEhpZ2hsaWdodCA9IHRoaXMuZmlsdGVyZWRPcHRpb25zW3RoaXMuY3Vyc29yXTtcbiAgICB0aGlzLmZpbHRlcmVkT3B0aW9ucyA9IHRoaXMudmFsdWUuZmlsdGVyKHYgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5wdXRWYWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHYudGl0bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWYgKHYudGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0aGlzLmlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygdi52YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAodi52YWx1ZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRoaXMuaW5wdXRWYWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBjb25zdCBuZXdIaWdobGlnaHRJbmRleCA9IHRoaXMuZmlsdGVyZWRPcHRpb25zLmZpbmRJbmRleCh2ID0+IHYgPT09IGN1cnJlbnRIaWdobGlnaHQpO1xuICAgIHRoaXMuY3Vyc29yID0gbmV3SGlnaGxpZ2h0SW5kZXggPCAwID8gMCA6IG5ld0hpZ2hsaWdodEluZGV4O1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBoYW5kbGVTcGFjZVRvZ2dsZSgpIHtcbiAgICBjb25zdCB2ID0gdGhpcy5maWx0ZXJlZE9wdGlvbnNbdGhpcy5jdXJzb3JdO1xuXG4gICAgaWYgKHYuc2VsZWN0ZWQpIHtcbiAgICAgIHYuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSBlbHNlIGlmICh2LmRpc2FibGVkIHx8IHRoaXMudmFsdWUuZmlsdGVyKGUgPT4gZS5zZWxlY3RlZCkubGVuZ3RoID49IHRoaXMubWF4Q2hvaWNlcykge1xuICAgICAgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UoYykge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZSArIGM7XG4gICAgdGhpcy51cGRhdGVGaWx0ZXJlZE9wdGlvbnMoKTtcbiAgfVxuXG4gIF8oYywga2V5KSB7XG4gICAgaWYgKGMgPT09ICcgJykge1xuICAgICAgdGhpcy5oYW5kbGVTcGFjZVRvZ2dsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlKGMpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckluc3RydWN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5pbnN0cnVjdGlvbnMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmluc3RydWN0aW9ucykge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmluc3RydWN0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdHJ1Y3Rpb25zO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYFxuSW5zdHJ1Y3Rpb25zOlxuICAgICR7ZmlndXJlcy5hcnJvd1VwfS8ke2ZpZ3VyZXMuYXJyb3dEb3dufTogSGlnaGxpZ2h0IG9wdGlvblxuICAgICR7ZmlndXJlcy5hcnJvd0xlZnR9LyR7ZmlndXJlcy5hcnJvd1JpZ2h0fS9bc3BhY2VdOiBUb2dnbGUgc2VsZWN0aW9uXG4gICAgW2EsYixjXS9kZWxldGU6IEZpbHRlciBjaG9pY2VzXG4gICAgZW50ZXIvcmV0dXJuOiBDb21wbGV0ZSBhbnN3ZXJcbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVuZGVyQ3VycmVudElucHV0KCkge1xuICAgIHJldHVybiBgXG5GaWx0ZXJlZCByZXN1bHRzIGZvcjogJHt0aGlzLmlucHV0VmFsdWUgPyB0aGlzLmlucHV0VmFsdWUgOiBjb2xvci5ncmF5KCdFbnRlciBzb21ldGhpbmcgdG8gZmlsdGVyJyl9XFxuYDtcbiAgfVxuXG4gIHJlbmRlck9wdGlvbihjdXJzb3IsIHYsIGkpIHtcbiAgICBsZXQgdGl0bGU7XG4gICAgaWYgKHYuZGlzYWJsZWQpIHRpdGxlID0gY3Vyc29yID09PSBpID8gY29sb3IuZ3JheSgpLnVuZGVybGluZSh2LnRpdGxlKSA6IGNvbG9yLnN0cmlrZXRocm91Z2goKS5ncmF5KHYudGl0bGUpO2Vsc2UgdGl0bGUgPSBjdXJzb3IgPT09IGkgPyBjb2xvci5jeWFuKCkudW5kZXJsaW5lKHYudGl0bGUpIDogdi50aXRsZTtcbiAgICByZXR1cm4gKHYuc2VsZWN0ZWQgPyBjb2xvci5ncmVlbihmaWd1cmVzLnJhZGlvT24pIDogZmlndXJlcy5yYWRpb09mZikgKyAnICAnICsgdGl0bGU7XG4gIH1cblxuICByZW5kZXJEb25lT3JJbnN0cnVjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUuZmlsdGVyKGUgPT4gZS5zZWxlY3RlZCkubWFwKHYgPT4gdi50aXRsZSkuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBbY29sb3IuZ3JheSh0aGlzLmhpbnQpLCB0aGlzLnJlbmRlckluc3RydWN0aW9ucygpLCB0aGlzLnJlbmRlckN1cnJlbnRJbnB1dCgpXTtcblxuICAgIGlmICh0aGlzLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggJiYgdGhpcy5maWx0ZXJlZE9wdGlvbnNbdGhpcy5jdXJzb3JdLmRpc2FibGVkKSB7XG4gICAgICBvdXRwdXQucHVzaChjb2xvci55ZWxsb3codGhpcy53YXJuKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dC5qb2luKCcgJyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMub3V0LndyaXRlKGN1cnNvci5oaWRlKTtcbiAgICBzdXBlci5yZW5kZXIoKTsgLy8gcHJpbnQgcHJvbXB0XG5cbiAgICBsZXQgcHJvbXB0ID0gW3N0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksIGNvbG9yLmJvbGQodGhpcy5tc2cpLCBzdHlsZS5kZWxpbWl0ZXIoZmFsc2UpLCB0aGlzLnJlbmRlckRvbmVPckluc3RydWN0aW9ucygpXS5qb2luKCcgJyk7XG5cbiAgICBpZiAodGhpcy5zaG93TWluRXJyb3IpIHtcbiAgICAgIHByb21wdCArPSBjb2xvci5yZWQoYFlvdSBtdXN0IHNlbGVjdCBhIG1pbmltdW0gb2YgJHt0aGlzLm1pblNlbGVjdGVkfSBjaG9pY2VzLmApO1xuICAgICAgdGhpcy5zaG93TWluRXJyb3IgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwcm9tcHQgKz0gdGhpcy5yZW5kZXJPcHRpb25zKHRoaXMuZmlsdGVyZWRPcHRpb25zKTtcbiAgICB0aGlzLm91dC53cml0ZSh0aGlzLmNsZWFyICsgcHJvbXB0KTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIocHJvbXB0LCB0aGlzLm91dC5jb2x1bW5zKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0b2NvbXBsZXRlTXVsdGlzZWxlY3RQcm9tcHQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcblxuY29uc3QgUHJvbXB0ID0gcmVxdWlyZSgnLi9wcm9tcHQnKTtcblxuY29uc3QgX3JlcXVpcmUgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gICAgICBzdHlsZSA9IF9yZXF1aXJlLnN0eWxlLFxuICAgICAgY2xlYXIgPSBfcmVxdWlyZS5jbGVhcjtcblxuY29uc3QgX3JlcXVpcmUyID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpLFxuICAgICAgZXJhc2UgPSBfcmVxdWlyZTIuZXJhc2UsXG4gICAgICBjdXJzb3IgPSBfcmVxdWlyZTIuY3Vyc29yO1xuLyoqXG4gKiBDb25maXJtUHJvbXB0IEJhc2UgRWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdHMubWVzc2FnZSBNZXNzYWdlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRzLmluaXRpYWxdIERlZmF1bHQgdmFsdWUgKHRydWUvZmFsc2UpXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy55ZXNdIFRoZSBcIlllc1wiIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMueWVzT3B0aW9uXSBUaGUgXCJZZXNcIiBvcHRpb24gd2hlbiBjaG9vc2luZyBiZXR3ZWVuIHllcy9ub1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLm5vXSBUaGUgXCJOb1wiIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMubm9PcHRpb25dIFRoZSBcIk5vXCIgb3B0aW9uIHdoZW4gY2hvb3NpbmcgYmV0d2VlbiB5ZXMvbm9cbiAqL1xuXG5cbmNsYXNzIENvbmZpcm1Qcm9tcHQgZXh0ZW5kcyBQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLnZhbHVlID0gb3B0cy5pbml0aWFsO1xuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gISFvcHRzLmluaXRpYWw7XG4gICAgdGhpcy55ZXNNc2cgPSBvcHRzLnllcyB8fCAneWVzJztcbiAgICB0aGlzLnllc09wdGlvbiA9IG9wdHMueWVzT3B0aW9uIHx8ICcoWS9uKSc7XG4gICAgdGhpcy5ub01zZyA9IG9wdHMubm8gfHwgJ25vJztcbiAgICB0aGlzLm5vT3B0aW9uID0gb3B0cy5ub09wdGlvbiB8fCAnKHkvTiknO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5pbml0aWFsVmFsdWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5hYm9ydCgpO1xuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgdGhpcy5kb25lID0gdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBzdWJtaXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUgfHwgZmFsc2U7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjLnRvTG93ZXJDYXNlKCkgPT09ICd5Jykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcy5zdWJtaXQoKTtcbiAgICB9XG5cbiAgICBpZiAoYy50b0xvd2VyQ2FzZSgpID09PSAnbicpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzLnN1Ym1pdCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmhpZGUpO2Vsc2UgdGhpcy5vdXQud3JpdGUoY2xlYXIodGhpcy5vdXRwdXRUZXh0LCB0aGlzLm91dC5jb2x1bW5zKSk7XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW3N0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksIGNvbG9yLmJvbGQodGhpcy5tc2cpLCBzdHlsZS5kZWxpbWl0ZXIodGhpcy5kb25lKSwgdGhpcy5kb25lID8gdGhpcy52YWx1ZSA/IHRoaXMueWVzTXNnIDogdGhpcy5ub01zZyA6IGNvbG9yLmdyYXkodGhpcy5pbml0aWFsVmFsdWUgPyB0aGlzLnllc09wdGlvbiA6IHRoaXMubm9PcHRpb24pXS5qb2luKCcgJyk7XG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpcm1Qcm9tcHQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVGV4dFByb21wdDogcmVxdWlyZSgnLi90ZXh0JyksXG4gIFNlbGVjdFByb21wdDogcmVxdWlyZSgnLi9zZWxlY3QnKSxcbiAgVG9nZ2xlUHJvbXB0OiByZXF1aXJlKCcuL3RvZ2dsZScpLFxuICBEYXRlUHJvbXB0OiByZXF1aXJlKCcuL2RhdGUnKSxcbiAgTnVtYmVyUHJvbXB0OiByZXF1aXJlKCcuL251bWJlcicpLFxuICBNdWx0aXNlbGVjdFByb21wdDogcmVxdWlyZSgnLi9tdWx0aXNlbGVjdCcpLFxuICBBdXRvY29tcGxldGVQcm9tcHQ6IHJlcXVpcmUoJy4vYXV0b2NvbXBsZXRlJyksXG4gIEF1dG9jb21wbGV0ZU11bHRpc2VsZWN0UHJvbXB0OiByZXF1aXJlKCcuL2F1dG9jb21wbGV0ZU11bHRpc2VsZWN0JyksXG4gIENvbmZpcm1Qcm9tcHQ6IHJlcXVpcmUoJy4vY29uZmlybScpXG59OyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgJCA9IGV4cG9ydHM7XG5cbmNvbnN0IGVsID0gcmVxdWlyZSgnLi9lbGVtZW50cycpO1xuXG5jb25zdCBub29wID0gdiA9PiB2O1xuXG5mdW5jdGlvbiB0b1Byb21wdCh0eXBlLCBhcmdzLCBvcHRzID0ge30pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgZWxbdHlwZV0oYXJncyk7XG4gICAgY29uc3Qgb25BYm9ydCA9IG9wdHMub25BYm9ydCB8fCBub29wO1xuICAgIGNvbnN0IG9uU3VibWl0ID0gb3B0cy5vblN1Ym1pdCB8fCBub29wO1xuICAgIGNvbnN0IG9uRXhpdCA9IG9wdHMub25FeGl0IHx8IG5vb3A7XG4gICAgcC5vbignc3RhdGUnLCBhcmdzLm9uU3RhdGUgfHwgbm9vcCk7XG4gICAgcC5vbignc3VibWl0JywgeCA9PiByZXMob25TdWJtaXQoeCkpKTtcbiAgICBwLm9uKCdleGl0JywgeCA9PiByZXMob25FeGl0KHgpKSk7XG4gICAgcC5vbignYWJvcnQnLCB4ID0+IHJlaihvbkFib3J0KHgpKSk7XG4gIH0pO1xufVxuLyoqXG4gKiBUZXh0IHByb21wdFxuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MubWVzc2FnZSBQcm9tcHQgbWVzc2FnZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuaW5pdGlhbF0gRGVmYXVsdCBzdHJpbmcgdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5zdHlsZT1cImRlZmF1bHRcIl0gUmVuZGVyIHN0eWxlICgnZGVmYXVsdCcsICdwYXNzd29yZCcsICdpbnZpc2libGUnKVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdXNlciBpbnB1dFxuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuXG5cbiQudGV4dCA9IGFyZ3MgPT4gdG9Qcm9tcHQoJ1RleHRQcm9tcHQnLCBhcmdzKTtcbi8qKlxuICogUGFzc3dvcmQgcHJvbXB0IHdpdGggbWFza2VkIGlucHV0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5pbml0aWFsXSBEZWZhdWx0IHN0cmluZyB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdXNlciBpbnB1dFxuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuXG5cbiQucGFzc3dvcmQgPSBhcmdzID0+IHtcbiAgYXJncy5zdHlsZSA9ICdwYXNzd29yZCc7XG4gIHJldHVybiAkLnRleHQoYXJncyk7XG59O1xuLyoqXG4gKiBQcm9tcHQgd2hlcmUgaW5wdXQgaXMgaW52aXNpYmxlLCBsaWtlIHN1ZG9cbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmluaXRpYWxdIERlZmF1bHQgc3RyaW5nIHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLnZhbGlkYXRlXSBGdW5jdGlvbiB0byB2YWxpZGF0ZSB1c2VyIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG5cblxuJC5pbnZpc2libGUgPSBhcmdzID0+IHtcbiAgYXJncy5zdHlsZSA9ICdpbnZpc2libGUnO1xuICByZXR1cm4gJC50ZXh0KGFyZ3MpO1xufTtcbi8qKlxuICogTnVtYmVyIHByb21wdFxuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MubWVzc2FnZSBQcm9tcHQgbWVzc2FnZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge251bWJlcn0gYXJncy5pbml0aWFsIERlZmF1bHQgbnVtYmVyIHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5tYXhdIE1heCB2YWx1ZVxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLm1pbl0gTWluIHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Muc3R5bGU9XCJkZWZhdWx0XCJdIFJlbmRlciBzdHlsZSAoJ2RlZmF1bHQnLCAncGFzc3dvcmQnLCAnaW52aXNpYmxlJylcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdHMuZmxvYXQ9ZmFsc2VdIFBhcnNlIGlucHV0IGFzIGZsb2F0c1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLnJvdW5kPTJdIFJvdW5kIGZsb2F0cyB0byB4IGRlY2ltYWxzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMuaW5jcmVtZW50PTFdIE51bWJlciB0byBpbmNyZW1lbnQgYnkgd2hlbiB1c2luZyBhcnJvdy1rZXlzXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdXNlciBpbnB1dFxuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuXG5cbiQubnVtYmVyID0gYXJncyA9PiB0b1Byb21wdCgnTnVtYmVyUHJvbXB0JywgYXJncyk7XG4vKipcbiAqIERhdGUgcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBhcmdzLmluaXRpYWwgRGVmYXVsdCBudW1iZXIgdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLm9uU3RhdGVdIE9uIHN0YXRlIGNoYW5nZSBjYWxsYmFja1xuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLm1heF0gTWF4IHZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubWluXSBNaW4gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5zdHlsZT1cImRlZmF1bHRcIl0gUmVuZGVyIHN0eWxlICgnZGVmYXVsdCcsICdwYXNzd29yZCcsICdpbnZpc2libGUnKVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5mbG9hdD1mYWxzZV0gUGFyc2UgaW5wdXQgYXMgZmxvYXRzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMucm91bmQ9Ml0gUm91bmQgZmxvYXRzIHRvIHggZGVjaW1hbHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbmNyZW1lbnQ9MV0gTnVtYmVyIHRvIGluY3JlbWVudCBieSB3aGVuIHVzaW5nIGFycm93LWtleXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLnZhbGlkYXRlXSBGdW5jdGlvbiB0byB2YWxpZGF0ZSB1c2VyIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG5cblxuJC5kYXRlID0gYXJncyA9PiB0b1Byb21wdCgnRGF0ZVByb21wdCcsIGFyZ3MpO1xuLyoqXG4gKiBDbGFzc2ljIHllcy9ubyBwcm9tcHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtib29sZWFufSBbYXJncy5pbml0aWFsPWZhbHNlXSBEZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB1c2VyIGlucHV0XG4gKi9cblxuXG4kLmNvbmZpcm0gPSBhcmdzID0+IHRvUHJvbXB0KCdDb25maXJtUHJvbXB0JywgYXJncyk7XG4vKipcbiAqIExpc3QgcHJvbXB0LCBzcGxpdCBpbnRwdXQgc3RyaW5nIGJ5IGBzZXBlcmF0b3JgXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5pbml0aWFsXSBEZWZhdWx0IHN0cmluZyB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLnN0eWxlPVwiZGVmYXVsdFwiXSBSZW5kZXIgc3R5bGUgKCdkZWZhdWx0JywgJ3Bhc3N3b3JkJywgJ2ludmlzaWJsZScpXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Muc2VwYXJhdG9yXSBTdHJpbmcgc2VwYXJhdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB1c2VyIGlucHV0LCBpbiBmb3JtIG9mIGFuIGBBcnJheWBcbiAqL1xuXG5cbiQubGlzdCA9IGFyZ3MgPT4ge1xuICBjb25zdCBzZXAgPSBhcmdzLnNlcGFyYXRvciB8fCAnLCc7XG4gIHJldHVybiB0b1Byb21wdCgnVGV4dFByb21wdCcsIGFyZ3MsIHtcbiAgICBvblN1Ym1pdDogc3RyID0+IHN0ci5zcGxpdChzZXApLm1hcChzID0+IHMudHJpbSgpKVxuICB9KTtcbn07XG4vKipcbiAqIFRvZ2dsZS9zd2l0Y2ggcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FyZ3MuaW5pdGlhbD1mYWxzZV0gRGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmFjdGl2ZT1cIm9uXCJdIFRleHQgZm9yIGBhY3RpdmVgIHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuaW5hY3RpdmU9XCJvZmZcIl0gVGV4dCBmb3IgYGluYWN0aXZlYCBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG5cblxuJC50b2dnbGUgPSBhcmdzID0+IHRvUHJvbXB0KCdUb2dnbGVQcm9tcHQnLCBhcmdzKTtcbi8qKlxuICogSW50ZXJhY3RpdmUgc2VsZWN0IHByb21wdFxuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MubWVzc2FnZSBQcm9tcHQgbWVzc2FnZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzLmNob2ljZXMgQXJyYXkgb2YgY2hvaWNlcyBvYmplY3RzIGBbeyB0aXRsZSwgdmFsdWUgfSwgLi4uXWBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5pbml0aWFsXSBJbmRleCBvZiBkZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gW2FyZ3MuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB1c2VyIGlucHV0XG4gKi9cblxuXG4kLnNlbGVjdCA9IGFyZ3MgPT4gdG9Qcm9tcHQoJ1NlbGVjdFByb21wdCcsIGFyZ3MpO1xuLyoqXG4gKiBJbnRlcmFjdGl2ZSBtdWx0aS1zZWxlY3QgLyBhdXRvY29tcGxldGVNdWx0aXNlbGVjdCBwcm9tcHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtBcnJheX0gYXJncy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZXMgb2JqZWN0cyBgW3sgdGl0bGUsIHZhbHVlLCBbc2VsZWN0ZWRdIH0sIC4uLl1gXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubWF4XSBNYXggc2VsZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuaGludF0gSGludCB0byBkaXNwbGF5IHVzZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBbYXJncy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB1c2VyIGlucHV0XG4gKi9cblxuXG4kLm11bHRpc2VsZWN0ID0gYXJncyA9PiB7XG4gIGFyZ3MuY2hvaWNlcyA9IFtdLmNvbmNhdChhcmdzLmNob2ljZXMgfHwgW10pO1xuXG4gIGNvbnN0IHRvU2VsZWN0ZWQgPSBpdGVtcyA9PiBpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnNlbGVjdGVkKS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcblxuICByZXR1cm4gdG9Qcm9tcHQoJ011bHRpc2VsZWN0UHJvbXB0JywgYXJncywge1xuICAgIG9uQWJvcnQ6IHRvU2VsZWN0ZWQsXG4gICAgb25TdWJtaXQ6IHRvU2VsZWN0ZWRcbiAgfSk7XG59O1xuXG4kLmF1dG9jb21wbGV0ZU11bHRpc2VsZWN0ID0gYXJncyA9PiB7XG4gIGFyZ3MuY2hvaWNlcyA9IFtdLmNvbmNhdChhcmdzLmNob2ljZXMgfHwgW10pO1xuXG4gIGNvbnN0IHRvU2VsZWN0ZWQgPSBpdGVtcyA9PiBpdGVtcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnNlbGVjdGVkKS5tYXAoaXRlbSA9PiBpdGVtLnZhbHVlKTtcblxuICByZXR1cm4gdG9Qcm9tcHQoJ0F1dG9jb21wbGV0ZU11bHRpc2VsZWN0UHJvbXB0JywgYXJncywge1xuICAgIG9uQWJvcnQ6IHRvU2VsZWN0ZWQsXG4gICAgb25TdWJtaXQ6IHRvU2VsZWN0ZWRcbiAgfSk7XG59O1xuXG5jb25zdCBieVRpdGxlID0gKGlucHV0LCBjaG9pY2VzKSA9PiBQcm9taXNlLnJlc29sdmUoY2hvaWNlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnRpdGxlLnNsaWNlKDAsIGlucHV0Lmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gaW5wdXQudG9Mb3dlckNhc2UoKSkpO1xuLyoqXG4gKiBJbnRlcmFjdGl2ZSBhdXRvLWNvbXBsZXRlIHByb21wdFxuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MubWVzc2FnZSBQcm9tcHQgbWVzc2FnZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzLmNob2ljZXMgQXJyYXkgb2YgYXV0by1jb21wbGV0ZSBjaG9pY2VzIG9iamVjdHMgYFt7IHRpdGxlLCB2YWx1ZSB9LCAuLi5dYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2FyZ3Muc3VnZ2VzdF0gRnVuY3Rpb24gdG8gZmlsdGVyIHJlc3VsdHMgYmFzZWQgb24gdXNlciBpbnB1dC4gRGVmYXVsdHMgdG8gc29ydCBieSBgdGl0bGVgXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubGltaXQ9MTBdIE1heCBudW1iZXIgb2YgcmVzdWx0cyB0byBzaG93XG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Muc3R5bGU9XCJkZWZhdWx0XCJdIFJlbmRlciBzdHlsZSAoJ2RlZmF1bHQnLCAncGFzc3dvcmQnLCAnaW52aXNpYmxlJylcbiAqIEBwYXJhbSB7U3RyaW5nfSBbYXJncy5pbml0aWFsXSBJbmRleCBvZiB0aGUgZGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5jbGVhckZpcnN0XSBUaGUgZmlyc3QgRVNDQVBFIGtleXByZXNzIHdpbGwgY2xlYXIgdGhlIGlucHV0XG4gKiBAcGFyYW0ge1N0cmluZ30gW2FyZ3MuZmFsbGJhY2tdIEZhbGxiYWNrIG1lc3NhZ2UgLSBkZWZhdWx0cyB0byBpbml0aWFsIHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbYXJncy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2Ugd2l0aCB1c2VyIGlucHV0XG4gKi9cblxuXG4kLmF1dG9jb21wbGV0ZSA9IGFyZ3MgPT4ge1xuICBhcmdzLnN1Z2dlc3QgPSBhcmdzLnN1Z2dlc3QgfHwgYnlUaXRsZTtcbiAgYXJncy5jaG9pY2VzID0gW10uY29uY2F0KGFyZ3MuY2hvaWNlcyB8fCBbXSk7XG4gIHJldHVybiB0b1Byb21wdCgnQXV0b2NvbXBsZXRlUHJvbXB0JywgYXJncyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgeyBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSk7IH0ga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpZiAoaSAlIDIpIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0LnJldHVybiAhPSBudWxsKSBpdC5yZXR1cm4oKTsgfSBmaW5hbGx5IHsgaWYgKGRpZEVycikgdGhyb3cgZXJyOyB9IH0gfTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTsgcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykgeyB0cnkgeyB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7IHZhciB2YWx1ZSA9IGluZm8udmFsdWU7IH0gY2F0Y2ggKGVycm9yKSB7IHJlamVjdChlcnJvcik7IHJldHVybjsgfSBpZiAoaW5mby5kb25lKSB7IHJlc29sdmUodmFsdWUpOyB9IGVsc2UgeyBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7IH0gfVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB2YXIgc2VsZiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTsgZnVuY3Rpb24gX25leHQodmFsdWUpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpOyB9IGZ1bmN0aW9uIF90aHJvdyhlcnIpIHsgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7IH0gX25leHQodW5kZWZpbmVkKTsgfSk7IH07IH1cblxuY29uc3QgcHJvbXB0cyA9IHJlcXVpcmUoJy4vcHJvbXB0cycpO1xuXG5jb25zdCBwYXNzT24gPSBbJ3N1Z2dlc3QnLCAnZm9ybWF0JywgJ29uU3RhdGUnLCAndmFsaWRhdGUnLCAnb25SZW5kZXInLCAndHlwZSddO1xuXG5jb25zdCBub29wID0gKCkgPT4ge307XG4vKipcbiAqIFByb21wdCBmb3IgYSBzZXJpZXMgb2YgcXVlc3Rpb25zXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gcXVlc3Rpb25zIFNpbmdsZSBxdWVzdGlvbiBvYmplY3Qgb3IgQXJyYXkgb2YgcXVlc3Rpb24gb2JqZWN0c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29uU3VibWl0XSBDYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgb24gcHJvbXB0IHN1Ym1pdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29uQ2FuY2VsXSBDYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgb24gY2FuY2VsL2Fib3J0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBPYmplY3Qgd2l0aCB2YWx1ZXMgZnJvbSB1c2VyIGlucHV0XG4gKi9cblxuXG5mdW5jdGlvbiBwcm9tcHQoKSB7XG4gIHJldHVybiBfcHJvbXB0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIF9wcm9tcHQoKSB7XG4gIF9wcm9tcHQgPSBfYXN5bmNUb0dlbmVyYXRvcihmdW5jdGlvbiogKHF1ZXN0aW9ucyA9IFtdLCB7XG4gICAgb25TdWJtaXQgPSBub29wLFxuICAgIG9uQ2FuY2VsID0gbm9vcFxuICB9ID0ge30pIHtcbiAgICBjb25zdCBhbnN3ZXJzID0ge307XG4gICAgY29uc3Qgb3ZlcnJpZGUgPSBwcm9tcHQuX292ZXJyaWRlIHx8IHt9O1xuICAgIHF1ZXN0aW9ucyA9IFtdLmNvbmNhdChxdWVzdGlvbnMpO1xuICAgIGxldCBhbnN3ZXIsIHF1ZXN0aW9uLCBxdWl0LCBuYW1lLCB0eXBlLCBsYXN0UHJvbXB0O1xuXG4gICAgY29uc3QgZ2V0Rm9ybWF0dGVkQW5zd2VyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfcmVmID0gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qIChxdWVzdGlvbiwgYW5zd2VyLCBza2lwVmFsaWRhdGlvbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghc2tpcFZhbGlkYXRpb24gJiYgcXVlc3Rpb24udmFsaWRhdGUgJiYgcXVlc3Rpb24udmFsaWRhdGUoYW5zd2VyKSAhPT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxdWVzdGlvbi5mb3JtYXQgPyB5aWVsZCBxdWVzdGlvbi5mb3JtYXQoYW5zd2VyLCBhbnN3ZXJzKSA6IGFuc3dlcjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkQW5zd2VyKF94LCBfeDIpIHtcbiAgICAgICAgcmV0dXJuIF9yZWYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgdmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHF1ZXN0aW9ucyksXG4gICAgICAgIF9zdGVwO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgIHF1ZXN0aW9uID0gX3N0ZXAudmFsdWU7XG4gICAgICAgIHZhciBfcXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICAgICAgbmFtZSA9IF9xdWVzdGlvbi5uYW1lO1xuICAgICAgICB0eXBlID0gX3F1ZXN0aW9uLnR5cGU7XG5cbiAgICAgICAgLy8gZXZhbHVhdGUgdHlwZSBmaXJzdCBhbmQgc2tpcCBpZiB0eXBlIGlzIGEgZmFsc3kgdmFsdWVcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdHlwZSA9IHlpZWxkIHR5cGUoYW5zd2VyLCBfb2JqZWN0U3ByZWFkKHt9LCBhbnN3ZXJzKSwgcXVlc3Rpb24pO1xuICAgICAgICAgIHF1ZXN0aW9uWyd0eXBlJ10gPSB0eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0eXBlKSBjb250aW51ZTsgLy8gaWYgcHJvcGVydHkgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IHVubGVzcyBpdCdzIGEgc3BlY2lhbCBmdW5jdGlvblxuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBxdWVzdGlvbikge1xuICAgICAgICAgIGlmIChwYXNzT24uaW5jbHVkZXMoa2V5KSkgY29udGludWU7XG4gICAgICAgICAgbGV0IHZhbHVlID0gcXVlc3Rpb25ba2V5XTtcbiAgICAgICAgICBxdWVzdGlvbltrZXldID0gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nID8geWllbGQgdmFsdWUoYW5zd2VyLCBfb2JqZWN0U3ByZWFkKHt9LCBhbnN3ZXJzKSwgbGFzdFByb21wdCkgOiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RQcm9tcHQgPSBxdWVzdGlvbjtcblxuICAgICAgICBpZiAodHlwZW9mIHF1ZXN0aW9uLm1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcm9tcHQgbWVzc2FnZSBpcyByZXF1aXJlZCcpO1xuICAgICAgICB9IC8vIHVwZGF0ZSB2YXJzIGluIGNhc2UgdGhleSBjaGFuZ2VkXG5cblxuICAgICAgICB2YXIgX3F1ZXN0aW9uMiA9IHF1ZXN0aW9uO1xuICAgICAgICBuYW1lID0gX3F1ZXN0aW9uMi5uYW1lO1xuICAgICAgICB0eXBlID0gX3F1ZXN0aW9uMi50eXBlO1xuXG4gICAgICAgIGlmIChwcm9tcHRzW3R5cGVdID09PSB2b2lkIDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHByb21wdCB0eXBlICgke3R5cGV9KSBpcyBub3QgZGVmaW5lZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG92ZXJyaWRlW3F1ZXN0aW9uLm5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBhbnN3ZXIgPSB5aWVsZCBnZXRGb3JtYXR0ZWRBbnN3ZXIocXVlc3Rpb24sIG92ZXJyaWRlW3F1ZXN0aW9uLm5hbWVdKTtcblxuICAgICAgICAgIGlmIChhbnN3ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYW5zd2Vyc1tuYW1lXSA9IGFuc3dlcjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gR2V0IHRoZSBpbmplY3RlZCBhbnN3ZXIgaWYgdGhlcmUgaXMgb25lIG9yIHByb21wdCB0aGUgdXNlclxuICAgICAgICAgIGFuc3dlciA9IHByb21wdC5faW5qZWN0ZWQgPyBnZXRJbmplY3RlZEFuc3dlcihwcm9tcHQuX2luamVjdGVkLCBxdWVzdGlvbi5pbml0aWFsKSA6IHlpZWxkIHByb21wdHNbdHlwZV0ocXVlc3Rpb24pO1xuICAgICAgICAgIGFuc3dlcnNbbmFtZV0gPSBhbnN3ZXIgPSB5aWVsZCBnZXRGb3JtYXR0ZWRBbnN3ZXIocXVlc3Rpb24sIGFuc3dlciwgdHJ1ZSk7XG4gICAgICAgICAgcXVpdCA9IHlpZWxkIG9uU3VibWl0KHF1ZXN0aW9uLCBhbnN3ZXIsIGFuc3dlcnMpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBxdWl0ID0gISh5aWVsZCBvbkNhbmNlbChxdWVzdGlvbiwgYW5zd2VycykpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHF1aXQpIHJldHVybiBhbnN3ZXJzO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2l0ZXJhdG9yLmUoZXJyKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5zd2VycztcbiAgfSk7XG4gIHJldHVybiBfcHJvbXB0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIGdldEluamVjdGVkQW5zd2VyKGluamVjdGVkLCBkZWFmdWx0VmFsdWUpIHtcbiAgY29uc3QgYW5zd2VyID0gaW5qZWN0ZWQuc2hpZnQoKTtcblxuICBpZiAoYW5zd2VyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICB0aHJvdyBhbnN3ZXI7XG4gIH1cblxuICByZXR1cm4gYW5zd2VyID09PSB1bmRlZmluZWQgPyBkZWFmdWx0VmFsdWUgOiBhbnN3ZXI7XG59XG5cbmZ1bmN0aW9uIGluamVjdChhbnN3ZXJzKSB7XG4gIHByb21wdC5faW5qZWN0ZWQgPSAocHJvbXB0Ll9pbmplY3RlZCB8fCBbXSkuY29uY2F0KGFuc3dlcnMpO1xufVxuXG5mdW5jdGlvbiBvdmVycmlkZShhbnN3ZXJzKSB7XG4gIHByb21wdC5fb3ZlcnJpZGUgPSBPYmplY3QuYXNzaWduKHt9LCBhbnN3ZXJzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKHByb21wdCwge1xuICBwcm9tcHQsXG4gIHByb21wdHMsXG4gIGluamVjdCxcbiAgb3ZlcnJpZGVcbn0pOyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoa2V5LCBpc1NlbGVjdCkgPT4ge1xuICBpZiAoa2V5Lm1ldGEgJiYga2V5Lm5hbWUgIT09ICdlc2NhcGUnKSByZXR1cm47XG4gIFxuICBpZiAoa2V5LmN0cmwpIHtcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdhJykgcmV0dXJuICdmaXJzdCc7XG4gICAgaWYgKGtleS5uYW1lID09PSAnYycpIHJldHVybiAnYWJvcnQnO1xuICAgIGlmIChrZXkubmFtZSA9PT0gJ2QnKSByZXR1cm4gJ2Fib3J0JztcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdlJykgcmV0dXJuICdsYXN0JztcbiAgICBpZiAoa2V5Lm5hbWUgPT09ICdnJykgcmV0dXJuICdyZXNldCc7XG4gIH1cbiAgXG4gIGlmIChpc1NlbGVjdCkge1xuICAgIGlmIChrZXkubmFtZSA9PT0gJ2onKSByZXR1cm4gJ2Rvd24nO1xuICAgIGlmIChrZXkubmFtZSA9PT0gJ2snKSByZXR1cm4gJ3VwJztcbiAgfVxuXG4gIGlmIChrZXkubmFtZSA9PT0gJ3JldHVybicpIHJldHVybiAnc3VibWl0JztcbiAgaWYgKGtleS5uYW1lID09PSAnZW50ZXInKSByZXR1cm4gJ3N1Ym1pdCc7IC8vIGN0cmwgKyBKXG4gIGlmIChrZXkubmFtZSA9PT0gJ2JhY2tzcGFjZScpIHJldHVybiAnZGVsZXRlJztcbiAgaWYgKGtleS5uYW1lID09PSAnZGVsZXRlJykgcmV0dXJuICdkZWxldGVGb3J3YXJkJztcbiAgaWYgKGtleS5uYW1lID09PSAnYWJvcnQnKSByZXR1cm4gJ2Fib3J0JztcbiAgaWYgKGtleS5uYW1lID09PSAnZXNjYXBlJykgcmV0dXJuICdleGl0JztcbiAgaWYgKGtleS5uYW1lID09PSAndGFiJykgcmV0dXJuICduZXh0JztcbiAgaWYgKGtleS5uYW1lID09PSAncGFnZWRvd24nKSByZXR1cm4gJ25leHRQYWdlJztcbiAgaWYgKGtleS5uYW1lID09PSAncGFnZXVwJykgcmV0dXJuICdwcmV2UGFnZSc7XG4gIC8vIFRPRE8gY3JlYXRlIGhvbWUoKSBpbiBwcm9tcHQgdHlwZXMgKGUuZy4gVGV4dFByb21wdClcbiAgaWYgKGtleS5uYW1lID09PSAnaG9tZScpIHJldHVybiAnaG9tZSc7XG4gIC8vIFRPRE8gY3JlYXRlIGVuZCgpIGluIHByb21wdCB0eXBlcyAoZS5nLiBUZXh0UHJvbXB0KVxuICBpZiAoa2V5Lm5hbWUgPT09ICdlbmQnKSByZXR1cm4gJ2VuZCc7XG5cbiAgaWYgKGtleS5uYW1lID09PSAndXAnKSByZXR1cm4gJ3VwJztcbiAgaWYgKGtleS5uYW1lID09PSAnZG93bicpIHJldHVybiAnZG93bic7XG4gIGlmIChrZXkubmFtZSA9PT0gJ3JpZ2h0JykgcmV0dXJuICdyaWdodCc7XG4gIGlmIChrZXkubmFtZSA9PT0gJ2xlZnQnKSByZXR1cm4gJ2xlZnQnO1xuXG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyID0+IHtcbiAgY29uc3QgcGF0dGVybiA9IFtcbiAgICAnW1xcXFx1MDAxQlxcXFx1MDA5Ql1bW1xcXFxdKCkjOz9dKig/Oig/Oig/Oig/OjtbLWEtekEtWlxcXFxkXFxcXC8jJi46PT8lQH5fXSspKnxbYS16QS1aXFxcXGRdKyg/OjtbLWEtekEtWlxcXFxkXFxcXC8jJi46PT8lQH5fXSopKik/XFxcXHUwMDA3KScsXG4gICAgJyg/Oig/OlxcXFxkezEsNH0oPzo7XFxcXGR7MCw0fSkqKT9bXFxcXGRBLVBSWmNmLW50cXJ5PT48fl0pKSdcbiAgXS5qb2luKCd8Jyk7XG5cbiAgY29uc3QgUkdYID0gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnZycpO1xuICByZXR1cm4gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBzdHIucmVwbGFjZShSR1gsICcnKSA6IHN0cjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmlwID0gcmVxdWlyZSgnLi9zdHJpcCcpO1xuY29uc3QgeyBlcmFzZSwgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5cbmNvbnN0IHdpZHRoID0gc3RyID0+IFsuLi5zdHJpcChzdHIpXS5sZW5ndGg7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHByb21wdFxuICogQHBhcmFtIHtudW1iZXJ9IHBlckxpbmVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcm9tcHQsIHBlckxpbmUpIHtcbiAgaWYgKCFwZXJMaW5lKSByZXR1cm4gZXJhc2UubGluZSArIGN1cnNvci50bygwKTtcblxuICBsZXQgcm93cyA9IDA7XG4gIGNvbnN0IGxpbmVzID0gcHJvbXB0LnNwbGl0KC9cXHI/XFxuLyk7XG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcbiAgICByb3dzICs9IDEgKyBNYXRoLmZsb29yKE1hdGgubWF4KHdpZHRoKGxpbmUpIC0gMSwgMCkgLyBwZXJMaW5lKTtcbiAgfVxuXG4gIHJldHVybiBlcmFzZS5saW5lcyhyb3dzKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XHRcblxuIGNvbnN0IG1haW4gPSB7XG4gIGFycm93VXA6ICfihpEnLFxuICBhcnJvd0Rvd246ICfihpMnLFxuICBhcnJvd0xlZnQ6ICfihpAnLFxuICBhcnJvd1JpZ2h0OiAn4oaSJyxcbiAgcmFkaW9PbjogJ+KXiScsXG4gIHJhZGlvT2ZmOiAn4pevJyxcbiAgdGljazogJ+KclCcsXHRcbiAgY3Jvc3M6ICfinJYnLFx0XG4gIGVsbGlwc2lzOiAn4oCmJyxcdFxuICBwb2ludGVyU21hbGw6ICfigLonLFx0XG4gIGxpbmU6ICfilIAnLFx0XG4gIHBvaW50ZXI6ICfina8nXHRcbn07XHRcbmNvbnN0IHdpbiA9IHtcbiAgYXJyb3dVcDogbWFpbi5hcnJvd1VwLFxuICBhcnJvd0Rvd246IG1haW4uYXJyb3dEb3duLFxuICBhcnJvd0xlZnQ6IG1haW4uYXJyb3dMZWZ0LFxuICBhcnJvd1JpZ2h0OiBtYWluLmFycm93UmlnaHQsXG4gIHJhZGlvT246ICcoKiknLFxuICByYWRpb09mZjogJyggKScsXHRcbiAgdGljazogJ+KImicsXHRcbiAgY3Jvc3M6ICfDlycsXHRcbiAgZWxsaXBzaXM6ICcuLi4nLFx0XG4gIHBvaW50ZXJTbWFsbDogJ8K7JyxcdFxuICBsaW5lOiAn4pSAJyxcdFxuICBwb2ludGVyOiAnPidcdFxufTtcdFxuY29uc3QgZmlndXJlcyA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyB3aW4gOiBtYWluO1x0XG5cbiBtb2R1bGUuZXhwb3J0cyA9IGZpZ3VyZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGMgPSByZXF1aXJlKCdrbGV1cicpO1xuY29uc3QgZmlndXJlcyA9IHJlcXVpcmUoJy4vZmlndXJlcycpO1xuXG4vLyByZW5kZXJpbmcgdXNlciBpbnB1dC5cbmNvbnN0IHN0eWxlcyA9IE9iamVjdC5mcmVlemUoe1xuICBwYXNzd29yZDogeyBzY2FsZTogMSwgcmVuZGVyOiBpbnB1dCA9PiAnKicucmVwZWF0KGlucHV0Lmxlbmd0aCkgfSxcbiAgZW1vamk6IHsgc2NhbGU6IDIsIHJlbmRlcjogaW5wdXQgPT4gJ/CfmIMnLnJlcGVhdChpbnB1dC5sZW5ndGgpIH0sXG4gIGludmlzaWJsZTogeyBzY2FsZTogMCwgcmVuZGVyOiBpbnB1dCA9PiAnJyB9LFxuICBkZWZhdWx0OiB7IHNjYWxlOiAxLCByZW5kZXI6IGlucHV0ID0+IGAke2lucHV0fWAgfVxufSk7XG5jb25zdCByZW5kZXIgPSB0eXBlID0+IHN0eWxlc1t0eXBlXSB8fCBzdHlsZXMuZGVmYXVsdDtcblxuLy8gaWNvbiB0byBzaWduYWxpemUgYSBwcm9tcHQuXG5jb25zdCBzeW1ib2xzID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGFib3J0ZWQ6IGMucmVkKGZpZ3VyZXMuY3Jvc3MpLFxuICBkb25lOiBjLmdyZWVuKGZpZ3VyZXMudGljayksXG4gIGV4aXRlZDogYy55ZWxsb3coZmlndXJlcy5jcm9zcyksXG4gIGRlZmF1bHQ6IGMuY3lhbignPycpXG59KTtcblxuY29uc3Qgc3ltYm9sID0gKGRvbmUsIGFib3J0ZWQsIGV4aXRlZCkgPT5cbiAgYWJvcnRlZCA/IHN5bWJvbHMuYWJvcnRlZCA6IGV4aXRlZCA/IHN5bWJvbHMuZXhpdGVkIDogZG9uZSA/IHN5bWJvbHMuZG9uZSA6IHN5bWJvbHMuZGVmYXVsdDtcblxuLy8gYmV0d2VlbiB0aGUgcXVlc3Rpb24gYW5kIHRoZSB1c2VyJ3MgaW5wdXQuXG5jb25zdCBkZWxpbWl0ZXIgPSBjb21wbGV0aW5nID0+XG4gIGMuZ3JheShjb21wbGV0aW5nID8gZmlndXJlcy5lbGxpcHNpcyA6IGZpZ3VyZXMucG9pbnRlclNtYWxsKTtcblxuY29uc3QgaXRlbSA9IChleHBhbmRhYmxlLCBleHBhbmRlZCkgPT5cbiAgYy5ncmF5KGV4cGFuZGFibGUgPyAoZXhwYW5kZWQgPyBmaWd1cmVzLnBvaW50ZXJTbWFsbCA6ICcrJykgOiBmaWd1cmVzLmxpbmUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3R5bGVzLFxuICByZW5kZXIsXG4gIHN5bWJvbHMsXG4gIHN5bWJvbCxcbiAgZGVsaW1pdGVyLFxuICBpdGVtXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBzdHJpcCA9IHJlcXVpcmUoJy4vc3RyaXAnKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gKiBAcGFyYW0ge251bWJlcn0gcGVyTGluZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtc2csIHBlckxpbmUpIHtcbiAgbGV0IGxpbmVzID0gU3RyaW5nKHN0cmlwKG1zZykgfHwgJycpLnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgaWYgKCFwZXJMaW5lKSByZXR1cm4gbGluZXMubGVuZ3RoO1xuICByZXR1cm4gbGluZXMubWFwKGwgPT4gTWF0aC5jZWlsKGwubGVuZ3RoIC8gcGVyTGluZSkpXG4gICAgICAucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgVGhlIG1lc3NhZ2UgdG8gd3JhcFxuICogQHBhcmFtIHtvYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gW29wdHMubWFyZ2luXSBMZWZ0IG1hcmdpblxuICogQHBhcmFtIHtudW1iZXJ9IG9wdHMud2lkdGggTWF4aW11bSBjaGFyYWN0ZXJzIHBlciBsaW5lIGluY2x1ZGluZyB0aGUgbWFyZ2luXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKG1zZywgb3B0cyA9IHt9KSA9PiB7XG4gIGNvbnN0IHRhYiA9IE51bWJlci5pc1NhZmVJbnRlZ2VyKHBhcnNlSW50KG9wdHMubWFyZ2luKSlcbiAgICA/IG5ldyBBcnJheShwYXJzZUludChvcHRzLm1hcmdpbikpLmZpbGwoJyAnKS5qb2luKCcnKVxuICAgIDogKG9wdHMubWFyZ2luIHx8ICcnKTtcblxuICBjb25zdCB3aWR0aCA9IG9wdHMud2lkdGg7XG5cbiAgcmV0dXJuIChtc2cgfHwgJycpLnNwbGl0KC9cXHI/XFxuL2cpXG4gICAgLm1hcChsaW5lID0+IGxpbmVcbiAgICAgIC5zcGxpdCgvXFxzKy9nKVxuICAgICAgLnJlZHVjZSgoYXJyLCB3KSA9PiB7XG4gICAgICAgIGlmICh3Lmxlbmd0aCArIHRhYi5sZW5ndGggPj0gd2lkdGggfHwgYXJyW2Fyci5sZW5ndGggLSAxXS5sZW5ndGggKyB3Lmxlbmd0aCArIDEgPCB3aWR0aClcbiAgICAgICAgICBhcnJbYXJyLmxlbmd0aCAtIDFdICs9IGAgJHt3fWA7XG4gICAgICAgIGVsc2UgYXJyLnB1c2goYCR7dGFifSR7d31gKTtcbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgIH0sIFsgdGFiIF0pXG4gICAgICAuam9pbignXFxuJykpXG4gICAgLmpvaW4oJ1xcbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hhdCBlbnRyaWVzIHNob3VsZCBiZSBkaXNwbGF5ZWQgb24gdGhlIHNjcmVlbiwgYmFzZWQgb24gdGhlXG4gKiBjdXJyZW50bHkgc2VsZWN0ZWQgaW5kZXggYW5kIHRoZSBtYXhpbXVtIHZpc2libGUuIFVzZWQgaW4gbGlzdC1iYXNlZFxuICogcHJvbXB0cyBsaWtlIGBzZWxlY3RgIGFuZCBgbXVsdGlzZWxlY3RgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJzb3IgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBlbnRyeVxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsIHRoZSB0b3RhbCBlbnRyaWVzIGF2YWlsYWJsZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge251bWJlcn0gW21heFZpc2libGVdIHRoZSBudW1iZXIgb2YgZW50cmllcyB0aGF0IGNhbiBiZSBkaXNwbGF5ZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoY3Vyc29yLCB0b3RhbCwgbWF4VmlzaWJsZSkgID0+IHtcbiAgbWF4VmlzaWJsZSA9IG1heFZpc2libGUgfHwgdG90YWw7XG5cbiAgbGV0IHN0YXJ0SW5kZXggPSBNYXRoLm1pbih0b3RhbC0gbWF4VmlzaWJsZSwgY3Vyc29yIC0gTWF0aC5mbG9vcihtYXhWaXNpYmxlIC8gMikpO1xuICBpZiAoc3RhcnRJbmRleCA8IDApIHN0YXJ0SW5kZXggPSAwO1xuXG4gIGxldCBlbmRJbmRleCA9IE1hdGgubWluKHN0YXJ0SW5kZXggKyBtYXhWaXNpYmxlLCB0b3RhbCk7XG5cbiAgcmV0dXJuIHsgc3RhcnRJbmRleCwgZW5kSW5kZXggfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhY3Rpb246IHJlcXVpcmUoJy4vYWN0aW9uJyksXG4gIGNsZWFyOiByZXF1aXJlKCcuL2NsZWFyJyksXG4gIHN0eWxlOiByZXF1aXJlKCcuL3N0eWxlJyksXG4gIHN0cmlwOiByZXF1aXJlKCcuL3N0cmlwJyksXG4gIGZpZ3VyZXM6IHJlcXVpcmUoJy4vZmlndXJlcycpLFxuICBsaW5lczogcmVxdWlyZSgnLi9saW5lcycpLFxuICB3cmFwOiByZXF1aXJlKCcuL3dyYXAnKSxcbiAgZW50cmllc1RvRGlzcGxheTogcmVxdWlyZSgnLi9lbnRyaWVzVG9EaXNwbGF5Jylcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHJlYWRsaW5lID0gcmVxdWlyZSgncmVhZGxpbmUnKTtcbmNvbnN0IHsgYWN0aW9uIH0gPSByZXF1aXJlKCcuLi91dGlsJyk7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IHsgYmVlcCwgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5cbi8qKlxuICogQmFzZSBwcm9tcHQgc2tlbGV0b25cbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICovXG5jbGFzcyBQcm9tcHQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlO1xuICAgIHRoaXMuaW4gPSBvcHRzLnN0ZGluIHx8IHByb2Nlc3Muc3RkaW47XG4gICAgdGhpcy5vdXQgPSBvcHRzLnN0ZG91dCB8fCBwcm9jZXNzLnN0ZG91dDtcbiAgICB0aGlzLm9uUmVuZGVyID0gKG9wdHMub25SZW5kZXIgfHwgKCgpID0+IHZvaWQgMCkpLmJpbmQodGhpcyk7XG4gICAgY29uc3QgcmwgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2UoeyBpbnB1dDp0aGlzLmluLCBlc2NhcGVDb2RlVGltZW91dDo1MCB9KTtcbiAgICByZWFkbGluZS5lbWl0S2V5cHJlc3NFdmVudHModGhpcy5pbiwgcmwpO1xuXG4gICAgaWYgKHRoaXMuaW4uaXNUVFkpIHRoaXMuaW4uc2V0UmF3TW9kZSh0cnVlKTtcbiAgICBjb25zdCBpc1NlbGVjdCA9IFsgJ1NlbGVjdFByb21wdCcsICdNdWx0aXNlbGVjdFByb21wdCcgXS5pbmRleE9mKHRoaXMuY29uc3RydWN0b3IubmFtZSkgPiAtMTtcbiAgICBjb25zdCBrZXlwcmVzcyA9IChzdHIsIGtleSkgPT4ge1xuICAgICAgbGV0IGEgPSBhY3Rpb24oa2V5LCBpc1NlbGVjdCk7XG4gICAgICBpZiAoYSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fICYmIHRoaXMuXyhzdHIsIGtleSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzW2FdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXNbYV0oa2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYmVsbCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmNsb3NlID0gKCkgPT4ge1xuICAgICAgdGhpcy5vdXQud3JpdGUoY3Vyc29yLnNob3cpO1xuICAgICAgdGhpcy5pbi5yZW1vdmVMaXN0ZW5lcigna2V5cHJlc3MnLCBrZXlwcmVzcyk7XG4gICAgICBpZiAodGhpcy5pbi5pc1RUWSkgdGhpcy5pbi5zZXRSYXdNb2RlKGZhbHNlKTtcbiAgICAgIHJsLmNsb3NlKCk7XG4gICAgICB0aGlzLmVtaXQodGhpcy5hYm9ydGVkID8gJ2Fib3J0JyA6IHRoaXMuZXhpdGVkID8gJ2V4aXQnIDogJ3N1Ym1pdCcsIHRoaXMudmFsdWUpO1xuICAgICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB0aGlzLmluLm9uKCdrZXlwcmVzcycsIGtleXByZXNzKTtcbiAgfVxuXG4gIGZpcmUoKSB7XG4gICAgdGhpcy5lbWl0KCdzdGF0ZScsIHtcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxuICAgICAgYWJvcnRlZDogISF0aGlzLmFib3J0ZWQsXG4gICAgICBleGl0ZWQ6ICEhdGhpcy5leGl0ZWRcbiAgICB9KTtcbiAgfVxuXG4gIGJlbGwoKSB7XG4gICAgdGhpcy5vdXQud3JpdGUoYmVlcCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5vblJlbmRlcihjb2xvcik7XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMuZmlyc3RSZW5kZXIgPSBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21wdDtcbiIsImNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcbmNvbnN0IFByb21wdCA9IHJlcXVpcmUoJy4vcHJvbXB0Jyk7XG5jb25zdCB7IGVyYXNlLCBjdXJzb3IgfSA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKTtcbmNvbnN0IHsgc3R5bGUsIGNsZWFyLCBsaW5lcywgZmlndXJlcyB9ID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG4vKipcbiAqIFRleHRQcm9tcHQgQmFzZSBFbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5tZXNzYWdlIE1lc3NhZ2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5zdHlsZT0nZGVmYXVsdCddIFJlbmRlciBzdHlsZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmluaXRpYWxdIERlZmF1bHQgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZhbGlkYXRlXSBWYWxpZGF0ZSBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuZXJyb3JdIFRoZSBpbnZhbGlkIGVycm9yIGxhYmVsXG4gKi9cbmNsYXNzIFRleHRQcm9tcHQgZXh0ZW5kcyBQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy50cmFuc2Zvcm0gPSBzdHlsZS5yZW5kZXIob3B0cy5zdHlsZSk7XG4gICAgdGhpcy5zY2FsZSA9IHRoaXMudHJhbnNmb3JtLnNjYWxlO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuaW5pdGlhbCA9IG9wdHMuaW5pdGlhbCB8fCBgYDtcbiAgICB0aGlzLnZhbGlkYXRvciA9IG9wdHMudmFsaWRhdGUgfHwgKCgpID0+IHRydWUpO1xuICAgIHRoaXMudmFsdWUgPSBgYDtcbiAgICB0aGlzLmVycm9yTXNnID0gb3B0cy5lcnJvciB8fCBgUGxlYXNlIEVudGVyIEEgVmFsaWQgVmFsdWVgO1xuICAgIHRoaXMuY3Vyc29yID0gTnVtYmVyKCEhdGhpcy5pbml0aWFsKTtcbiAgICB0aGlzLmN1cnNvck9mZnNldCA9IDA7XG4gICAgdGhpcy5jbGVhciA9IGNsZWFyKGBgLCB0aGlzLm91dC5jb2x1bW5zKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2V0IHZhbHVlKHYpIHtcbiAgICBpZiAoIXYgJiYgdGhpcy5pbml0aWFsKSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBjb2xvci5ncmF5KHRoaXMudHJhbnNmb3JtLnJlbmRlcih0aGlzLmluaXRpYWwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IGZhbHNlO1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IHRoaXMudHJhbnNmb3JtLnJlbmRlcih2KTtcbiAgICB9XG4gICAgdGhpcy5fdmFsdWUgPSB2O1xuICAgIHRoaXMuZmlyZSgpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBgYDtcbiAgICB0aGlzLmN1cnNvciA9IE51bWJlcighIXRoaXMuaW5pdGlhbCk7XG4gICAgdGhpcy5jdXJzb3JPZmZzZXQgPSAwO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlIHx8IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIGFzeW5jIHZhbGlkYXRlKCkge1xuICAgIGxldCB2YWxpZCA9IGF3YWl0IHRoaXMudmFsaWRhdG9yKHRoaXMudmFsdWUpO1xuICAgIGlmICh0eXBlb2YgdmFsaWQgPT09IGBzdHJpbmdgKSB7XG4gICAgICB0aGlzLmVycm9yTXNnID0gdmFsaWQ7XG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmVycm9yID0gIXZhbGlkO1xuICB9XG5cbiAgYXN5bmMgc3VibWl0KCkge1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlIHx8IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmN1cnNvck9mZnNldCA9IDA7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLnJlbmRlcmVkLmxlbmd0aDtcbiAgICBhd2FpdCB0aGlzLnZhbGlkYXRlKCk7XG4gICAgaWYgKHRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMucmVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIGlmICghdGhpcy5wbGFjZWhvbGRlcikgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmluaXRpYWw7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLnJlbmRlcmVkLmxlbmd0aDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbW92ZUN1cnNvcihuKSB7XG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHJldHVybjtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yK247XG4gICAgdGhpcy5jdXJzb3JPZmZzZXQgKz0gbjtcbiAgfVxuXG4gIF8oYywga2V5KSB7XG4gICAgbGV0IHMxID0gdGhpcy52YWx1ZS5zbGljZSgwLCB0aGlzLmN1cnNvcik7XG4gICAgbGV0IHMyID0gdGhpcy52YWx1ZS5zbGljZSh0aGlzLmN1cnNvcik7XG4gICAgdGhpcy52YWx1ZSA9IGAke3MxfSR7Y30ke3MyfWA7XG4gICAgdGhpcy5yZWQgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMucGxhY2Vob2xkZXIgPyAwIDogczEubGVuZ3RoKzE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5pc0N1cnNvckF0U3RhcnQoKSkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIGxldCBzMSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgdGhpcy5jdXJzb3ItMSk7XG4gICAgbGV0IHMyID0gdGhpcy52YWx1ZS5zbGljZSh0aGlzLmN1cnNvcik7XG4gICAgdGhpcy52YWx1ZSA9IGAke3MxfSR7czJ9YDtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmlzQ3Vyc29yQXRTdGFydCgpKSB7XG4gICAgICB0aGlzLmN1cnNvck9mZnNldCA9IDBcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJzb3JPZmZzZXQrKztcbiAgICAgIHRoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZWxldGVGb3J3YXJkKCkge1xuICAgIGlmKHRoaXMuY3Vyc29yKnRoaXMuc2NhbGUgPj0gdGhpcy5yZW5kZXJlZC5sZW5ndGggfHwgdGhpcy5wbGFjZWhvbGRlcikgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIGxldCBzMSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgdGhpcy5jdXJzb3IpO1xuICAgIGxldCBzMiA9IHRoaXMudmFsdWUuc2xpY2UodGhpcy5jdXJzb3IrMSk7XG4gICAgdGhpcy52YWx1ZSA9IGAke3MxfSR7czJ9YDtcbiAgICB0aGlzLnJlZCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmlzQ3Vyc29yQXRFbmQoKSkge1xuICAgICAgdGhpcy5jdXJzb3JPZmZzZXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnNvck9mZnNldCsrO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBsYXN0KCkge1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yIDw9IDAgfHwgdGhpcy5wbGFjZWhvbGRlcikgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIGlmICh0aGlzLmN1cnNvcip0aGlzLnNjYWxlID49IHRoaXMucmVuZGVyZWQubGVuZ3RoIHx8IHRoaXMucGxhY2Vob2xkZXIpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLm1vdmVDdXJzb3IoMSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGlzQ3Vyc29yQXRTdGFydCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJzb3IgPT09IDAgfHwgKHRoaXMucGxhY2Vob2xkZXIgJiYgdGhpcy5jdXJzb3IgPT09IDEpO1xuICB9XG5cbiAgaXNDdXJzb3JBdEVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJzb3IgPT09IHRoaXMucmVuZGVyZWQubGVuZ3RoIHx8ICh0aGlzLnBsYWNlaG9sZGVyICYmIHRoaXMuY3Vyc29yID09PSB0aGlzLnJlbmRlcmVkLmxlbmd0aCArIDEpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKCF0aGlzLmZpcnN0UmVuZGVyKSB7XG4gICAgICBpZiAodGhpcy5vdXRwdXRFcnJvcilcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmRvd24obGluZXModGhpcy5vdXRwdXRFcnJvciwgdGhpcy5vdXQuY29sdW1ucykgLSAxKSArIGNsZWFyKHRoaXMub3V0cHV0RXJyb3IsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICAgIHRoaXMub3V0LndyaXRlKGNsZWFyKHRoaXMub3V0cHV0VGV4dCwgdGhpcy5vdXQuY29sdW1ucykpO1xuICAgIH1cbiAgICBzdXBlci5yZW5kZXIoKTtcbiAgICB0aGlzLm91dHB1dEVycm9yID0gJyc7XG5cbiAgICB0aGlzLm91dHB1dFRleHQgPSBbXG4gICAgICBzdHlsZS5zeW1ib2wodGhpcy5kb25lLCB0aGlzLmFib3J0ZWQpLFxuICAgICAgY29sb3IuYm9sZCh0aGlzLm1zZyksXG4gICAgICBzdHlsZS5kZWxpbWl0ZXIodGhpcy5kb25lKSxcbiAgICAgIHRoaXMucmVkID8gY29sb3IucmVkKHRoaXMucmVuZGVyZWQpIDogdGhpcy5yZW5kZXJlZFxuICAgIF0uam9pbihgIGApO1xuXG4gICAgaWYgKHRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMub3V0cHV0RXJyb3IgKz0gdGhpcy5lcnJvck1zZy5zcGxpdChgXFxuYClcbiAgICAgICAgICAucmVkdWNlKChhLCBsLCBpKSA9PiBhICsgYFxcbiR7aSA/ICcgJyA6IGZpZ3VyZXMucG9pbnRlclNtYWxsfSAke2NvbG9yLnJlZCgpLml0YWxpYyhsKX1gLCBgYCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCArIGN1cnNvci5zYXZlICsgdGhpcy5vdXRwdXRFcnJvciArIGN1cnNvci5yZXN0b3JlICsgY3Vyc29yLm1vdmUodGhpcy5jdXJzb3JPZmZzZXQsIDApKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRQcm9tcHQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuY29uc3QgeyBzdHlsZSwgY2xlYXIsIGZpZ3VyZXMsIHdyYXAsIGVudHJpZXNUb0Rpc3BsYXkgfSA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbmNvbnN0IHsgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5cbi8qKlxuICogU2VsZWN0UHJvbXB0IEJhc2UgRWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdHMubWVzc2FnZSBNZXNzYWdlXG4gKiBAcGFyYW0ge0FycmF5fSBvcHRzLmNob2ljZXMgQXJyYXkgb2YgY2hvaWNlIG9iamVjdHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5oaW50XSBIaW50IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbml0aWFsXSBJbmRleCBvZiBkZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5vcHRpb25zUGVyUGFnZT0xMF0gTWF4IG9wdGlvbnMgdG8gZGlzcGxheSBhdCBvbmNlXG4gKi9cbmNsYXNzIFNlbGVjdFByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHM9e30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLmhpbnQgPSBvcHRzLmhpbnQgfHwgJy0gVXNlIGFycm93LWtleXMuIFJldHVybiB0byBzdWJtaXQuJztcbiAgICB0aGlzLndhcm4gPSBvcHRzLndhcm4gfHwgJy0gVGhpcyBvcHRpb24gaXMgZGlzYWJsZWQnO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0cy5pbml0aWFsIHx8IDA7XG4gICAgdGhpcy5jaG9pY2VzID0gb3B0cy5jaG9pY2VzLm1hcCgoY2gsIGlkeCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjaCA9PT0gJ3N0cmluZycpXG4gICAgICAgIGNoID0ge3RpdGxlOiBjaCwgdmFsdWU6IGlkeH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogY2ggJiYgKGNoLnRpdGxlIHx8IGNoLnZhbHVlIHx8IGNoKSxcbiAgICAgICAgdmFsdWU6IGNoICYmIChjaC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gaWR4IDogY2gudmFsdWUpLFxuICAgICAgICBkZXNjcmlwdGlvbjogY2ggJiYgY2guZGVzY3JpcHRpb24sXG4gICAgICAgIHNlbGVjdGVkOiBjaCAmJiBjaC5zZWxlY3RlZCxcbiAgICAgICAgZGlzYWJsZWQ6IGNoICYmIGNoLmRpc2FibGVkXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHRoaXMub3B0aW9uc1BlclBhZ2UgPSBvcHRzLm9wdGlvbnNQZXJQYWdlIHx8IDEwO1xuICAgIHRoaXMudmFsdWUgPSAodGhpcy5jaG9pY2VzW3RoaXMuY3Vyc29yXSB8fCB7fSkudmFsdWU7XG4gICAgdGhpcy5jbGVhciA9IGNsZWFyKCcnLCB0aGlzLm91dC5jb2x1bW5zKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbW92ZUN1cnNvcihuKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBuO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmNob2ljZXNbbl0udmFsdWU7XG4gICAgdGhpcy5maXJlKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLm1vdmVDdXJzb3IoMCk7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5hYm9ydCgpO1xuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgdGhpcy5kb25lID0gdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBzdWJtaXQoKSB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGlvbi5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWJvcnRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5maXJlKCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZVxuICAgICAgdGhpcy5iZWxsKCk7XG4gIH1cblxuICBmaXJzdCgpIHtcbiAgICB0aGlzLm1vdmVDdXJzb3IoMCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKHRoaXMuY2hvaWNlcy5sZW5ndGggLSAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IodGhpcy5jaG9pY2VzLmxlbmd0aCAtIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IodGhpcy5jdXJzb3IgLSAxKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yID09PSB0aGlzLmNob2ljZXMubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5tb3ZlQ3Vyc29yKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1vdmVDdXJzb3IodGhpcy5jdXJzb3IgKyAxKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKCh0aGlzLmN1cnNvciArIDEpICUgdGhpcy5jaG9pY2VzLmxlbmd0aCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIF8oYywga2V5KSB7XG4gICAgaWYgKGMgPT09ICcgJykgcmV0dXJuIHRoaXMuc3VibWl0KCk7XG4gIH1cblxuICBnZXQgc2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNob2ljZXNbdGhpcy5jdXJzb3JdO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZpcnN0UmVuZGVyKSB0aGlzLm91dC53cml0ZShjdXJzb3IuaGlkZSk7XG4gICAgZWxzZSB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICBzdXBlci5yZW5kZXIoKTtcblxuICAgIGxldCB7IHN0YXJ0SW5kZXgsIGVuZEluZGV4IH0gPSBlbnRyaWVzVG9EaXNwbGF5KHRoaXMuY3Vyc29yLCB0aGlzLmNob2ljZXMubGVuZ3RoLCB0aGlzLm9wdGlvbnNQZXJQYWdlKTtcblxuICAgIC8vIFByaW50IHByb21wdFxuICAgIHRoaXMub3V0cHV0VGV4dCA9IFtcbiAgICAgIHN0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksXG4gICAgICBjb2xvci5ib2xkKHRoaXMubXNnKSxcbiAgICAgIHN0eWxlLmRlbGltaXRlcihmYWxzZSksXG4gICAgICB0aGlzLmRvbmUgPyB0aGlzLnNlbGVjdGlvbi50aXRsZSA6IHRoaXMuc2VsZWN0aW9uLmRpc2FibGVkXG4gICAgICAgICAgPyBjb2xvci55ZWxsb3codGhpcy53YXJuKSA6IGNvbG9yLmdyYXkodGhpcy5oaW50KVxuICAgIF0uam9pbignICcpO1xuXG4gICAgLy8gUHJpbnQgY2hvaWNlc1xuICAgIGlmICghdGhpcy5kb25lKSB7XG4gICAgICB0aGlzLm91dHB1dFRleHQgKz0gJ1xcbic7XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcbiAgICAgICAgbGV0IHRpdGxlLCBwcmVmaXgsIGRlc2MgPSAnJywgdiA9IHRoaXMuY2hvaWNlc1tpXTtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0byBkaXNwbGF5IFwibW9yZSBjaG9pY2VzXCIgaW5kaWNhdG9yc1xuICAgICAgICBpZiAoaSA9PT0gc3RhcnRJbmRleCAmJiBzdGFydEluZGV4ID4gMCkge1xuICAgICAgICAgIHByZWZpeCA9IGZpZ3VyZXMuYXJyb3dVcDtcbiAgICAgICAgfSBlbHNlIGlmIChpID09PSBlbmRJbmRleCAtIDEgJiYgZW5kSW5kZXggPCB0aGlzLmNob2ljZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcHJlZml4ID0gZmlndXJlcy5hcnJvd0Rvd247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJlZml4ID0gJyAnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuZGlzYWJsZWQpIHtcbiAgICAgICAgICB0aXRsZSA9IHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuZ3JheSgpLnVuZGVybGluZSh2LnRpdGxlKSA6IGNvbG9yLnN0cmlrZXRocm91Z2goKS5ncmF5KHYudGl0bGUpO1xuICAgICAgICAgIHByZWZpeCA9ICh0aGlzLmN1cnNvciA9PT0gaSA/IGNvbG9yLmJvbGQoKS5ncmF5KGZpZ3VyZXMucG9pbnRlcikgKyAnICcgOiAnICAnKSArIHByZWZpeDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aXRsZSA9IHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuY3lhbigpLnVuZGVybGluZSh2LnRpdGxlKSA6IHYudGl0bGU7XG4gICAgICAgICAgcHJlZml4ID0gKHRoaXMuY3Vyc29yID09PSBpID8gY29sb3IuY3lhbihmaWd1cmVzLnBvaW50ZXIpICsgJyAnIDogJyAgJykgKyBwcmVmaXg7XG4gICAgICAgICAgaWYgKHYuZGVzY3JpcHRpb24gJiYgdGhpcy5jdXJzb3IgPT09IGkpIHtcbiAgICAgICAgICAgIGRlc2MgPSBgIC0gJHt2LmRlc2NyaXB0aW9ufWA7XG4gICAgICAgICAgICBpZiAocHJlZml4Lmxlbmd0aCArIHRpdGxlLmxlbmd0aCArIGRlc2MubGVuZ3RoID49IHRoaXMub3V0LmNvbHVtbnNcbiAgICAgICAgICAgICAgICB8fCB2LmRlc2NyaXB0aW9uLnNwbGl0KC9cXHI/XFxuLykubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICBkZXNjID0gJ1xcbicgKyB3cmFwKHYuZGVzY3JpcHRpb24sIHsgbWFyZ2luOiAzLCB3aWR0aDogdGhpcy5vdXQuY29sdW1ucyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm91dHB1dFRleHQgKz0gYCR7cHJlZml4fSAke3RpdGxlfSR7Y29sb3IuZ3JheShkZXNjKX1cXG5gO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3V0LndyaXRlKHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RQcm9tcHQ7XG4iLCJjb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuY29uc3QgeyBzdHlsZSwgY2xlYXIgfSA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbmNvbnN0IHsgY3Vyc29yLCBlcmFzZSB9ID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpO1xuXG4vKipcbiAqIFRvZ2dsZVByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5pbml0aWFsPWZhbHNlXSBEZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuYWN0aXZlPSdubyddIEFjdGl2ZSBsYWJlbFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmluYWN0aXZlPSdvZmYnXSBJbmFjdGl2ZSBsYWJlbFxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cbmNsYXNzIFRvZ2dsZVByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHM9e30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLnZhbHVlID0gISFvcHRzLmluaXRpYWw7XG4gICAgdGhpcy5hY3RpdmUgPSBvcHRzLmFjdGl2ZSB8fCAnb24nO1xuICAgIHRoaXMuaW5hY3RpdmUgPSBvcHRzLmluYWN0aXZlIHx8ICdvZmYnO1xuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuaW5pdGlhbFZhbHVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gZmFsc2UpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnZhbHVlID09PSB0cnVlKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgfVxuICBsZWZ0KCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG4gIHJpZ2h0KCkge1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfVxuICBkb3duKCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICB9XG4gIHVwKCkge1xuICAgIHRoaXMuYWN0aXZhdGUoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy52YWx1ZSA9ICF0aGlzLnZhbHVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjID09PSAnICcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSAhdGhpcy52YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGMgPT09ICcxJykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChjID09PSAnMCcpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgICB9IGVsc2UgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMub3V0LndyaXRlKGN1cnNvci5oaWRlKTtcbiAgICBlbHNlIHRoaXMub3V0LndyaXRlKGNsZWFyKHRoaXMub3V0cHV0VGV4dCwgdGhpcy5vdXQuY29sdW1ucykpO1xuICAgIHN1cGVyLnJlbmRlcigpO1xuXG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW1xuICAgICAgc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSxcbiAgICAgIGNvbG9yLmJvbGQodGhpcy5tc2cpLFxuICAgICAgc3R5bGUuZGVsaW1pdGVyKHRoaXMuZG9uZSksXG4gICAgICB0aGlzLnZhbHVlID8gdGhpcy5pbmFjdGl2ZSA6IGNvbG9yLmN5YW4oKS51bmRlcmxpbmUodGhpcy5pbmFjdGl2ZSksXG4gICAgICBjb2xvci5ncmF5KCcvJyksXG4gICAgICB0aGlzLnZhbHVlID8gY29sb3IuY3lhbigpLnVuZGVybGluZSh0aGlzLmFjdGl2ZSkgOiB0aGlzLmFjdGl2ZVxuICAgIF0uam9pbignICcpO1xuXG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb2dnbGVQcm9tcHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Ioe3Rva2VuLCBkYXRlLCBwYXJ0cywgbG9jYWxlc30pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgdGhpcy5kYXRlID0gZGF0ZSB8fCBuZXcgRGF0ZSgpO1xuICAgIHRoaXMucGFydHMgPSBwYXJ0cyB8fCBbdGhpc107XG4gICAgdGhpcy5sb2NhbGVzID0gbG9jYWxlcyB8fCB7fTtcbiAgfVxuXG4gIHVwKCkge31cblxuICBkb3duKCkge31cblxuICBuZXh0KCkge1xuICAgIGNvbnN0IGN1cnJlbnRJZHggPSB0aGlzLnBhcnRzLmluZGV4T2YodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMucGFydHMuZmluZCgocGFydCwgaWR4KSA9PiBpZHggPiBjdXJyZW50SWR4ICYmIHBhcnQgaW5zdGFuY2VvZiBEYXRlUGFydCk7XG4gIH1cblxuICBzZXRUbyh2YWwpIHt9XG5cbiAgcHJldigpIHtcbiAgICBsZXQgcGFydHMgPSBbXS5jb25jYXQodGhpcy5wYXJ0cykucmV2ZXJzZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRJZHggPSBwYXJ0cy5pbmRleE9mKHRoaXMpO1xuICAgIHJldHVybiBwYXJ0cy5maW5kKChwYXJ0LCBpZHgpID0+IGlkeCA+IGN1cnJlbnRJZHggJiYgcGFydCBpbnN0YW5jZW9mIERhdGVQYXJ0KTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5kYXRlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGVQYXJ0O1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGF0ZVBhcnQgPSByZXF1aXJlKCcuL2RhdGVwYXJ0Jyk7XG5cbmNsYXNzIE1lcmlkaWVtIGV4dGVuZHMgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLmRhdGUuc2V0SG91cnMoKHRoaXMuZGF0ZS5nZXRIb3VycygpICsgMTIpICUgMjQpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICB0aGlzLnVwKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgbWVyaWRpZW0gPSB0aGlzLmRhdGUuZ2V0SG91cnMoKSA+IDEyID8gJ3BtJyA6ICdhbSc7XG4gICAgcmV0dXJuIC9cXEEvLnRlc3QodGhpcy50b2tlbikgPyBtZXJpZGllbS50b1VwcGVyQ2FzZSgpIDogbWVyaWRpZW07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXJpZGllbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGF0ZVBhcnQgPSByZXF1aXJlKCcuL2RhdGVwYXJ0Jyk7XG5cbmNvbnN0IHBvcyA9IG4gPT4ge1xuICBuID0gbiAlIDEwO1xuICByZXR1cm4gbiA9PT0gMSA/ICdzdCdcbiAgICAgICA6IG4gPT09IDIgPyAnbmQnXG4gICAgICAgOiBuID09PSAzID8gJ3JkJ1xuICAgICAgIDogJ3RoJztcbn1cblxuY2xhc3MgRGF5IGV4dGVuZHMgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLmRhdGUuc2V0RGF0ZSh0aGlzLmRhdGUuZ2V0RGF0ZSgpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXREYXRlKHRoaXMuZGF0ZS5nZXREYXRlKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXREYXRlKHBhcnNlSW50KHZhbC5zdWJzdHIoLTIpKSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgZGF0ZSA9IHRoaXMuZGF0ZS5nZXREYXRlKCk7XG4gICAgbGV0IGRheSA9IHRoaXMuZGF0ZS5nZXREYXkoKTtcbiAgICByZXR1cm4gdGhpcy50b2tlbiA9PT0gJ0REJyA/IFN0cmluZyhkYXRlKS5wYWRTdGFydCgyLCAnMCcpXG4gICAgICAgICA6IHRoaXMudG9rZW4gPT09ICdEbycgPyBkYXRlICsgcG9zKGRhdGUpXG4gICAgICAgICA6IHRoaXMudG9rZW4gPT09ICdkJyA/IGRheSArIDFcbiAgICAgICAgIDogdGhpcy50b2tlbiA9PT0gJ2RkZCcgPyB0aGlzLmxvY2FsZXMud2Vla2RheXNTaG9ydFtkYXldXG4gICAgICAgICA6IHRoaXMudG9rZW4gPT09ICdkZGRkJyA/IHRoaXMubG9jYWxlcy53ZWVrZGF5c1tkYXldXG4gICAgICAgICA6IGRhdGU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEYXk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBIb3VycyBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldEhvdXJzKHRoaXMuZGF0ZS5nZXRIb3VycygpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRIb3Vycyh0aGlzLmRhdGUuZ2V0SG91cnMoKSAtIDEpO1xuICB9XG5cbiAgc2V0VG8odmFsKSB7XG4gICAgdGhpcy5kYXRlLnNldEhvdXJzKHBhcnNlSW50KHZhbC5zdWJzdHIoLTIpKSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgaG91cnMgPSB0aGlzLmRhdGUuZ2V0SG91cnMoKTtcbiAgICBpZiAoL2gvLnRlc3QodGhpcy50b2tlbikpXG4gICAgICBob3VycyA9IChob3VycyAlIDEyKSB8fCAxMjtcbiAgICByZXR1cm4gdGhpcy50b2tlbi5sZW5ndGggPiAxID8gU3RyaW5nKGhvdXJzKS5wYWRTdGFydCgyLCAnMCcpIDogaG91cnM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBIb3VycztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRGF0ZVBhcnQgPSByZXF1aXJlKCcuL2RhdGVwYXJ0Jyk7XG5cbmNsYXNzIE1pbGxpc2Vjb25kcyBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgKyAxKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy5kYXRlLnNldE1pbGxpc2Vjb25kcyh0aGlzLmRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaWxsaXNlY29uZHMocGFyc2VJbnQodmFsLnN1YnN0cigtKHRoaXMudG9rZW4ubGVuZ3RoKSkpKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBTdHJpbmcodGhpcy5kYXRlLmdldE1pbGxpc2Vjb25kcygpKS5wYWRTdGFydCg0LCAnMCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnN0cigwLCB0aGlzLnRva2VuLmxlbmd0aCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNaWxsaXNlY29uZHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBNaW51dGVzIGV4dGVuZHMgRGF0ZVBhcnQge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gIH1cblxuICB1cCgpIHtcbiAgICB0aGlzLmRhdGUuc2V0TWludXRlcyh0aGlzLmRhdGUuZ2V0TWludXRlcygpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaW51dGVzKHRoaXMuZGF0ZS5nZXRNaW51dGVzKCkgLSAxKTtcbiAgfVxuXG4gIHNldFRvKHZhbCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNaW51dGVzKHBhcnNlSW50KHZhbC5zdWJzdHIoLTIpKSk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgbSA9IHRoaXMuZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4ubGVuZ3RoID4gMSA/IFN0cmluZyhtKS5wYWRTdGFydCgyLCAnMCcpIDogbTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1pbnV0ZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERhdGVQYXJ0ID0gcmVxdWlyZSgnLi9kYXRlcGFydCcpO1xuXG5jbGFzcyBNb250aCBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldE1vbnRoKHRoaXMuZGF0ZS5nZXRNb250aCgpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRNb250aCh0aGlzLmRhdGUuZ2V0TW9udGgoKSAtIDEpO1xuICB9XG5cbiAgc2V0VG8odmFsKSB7XG4gICAgdmFsID0gcGFyc2VJbnQodmFsLnN1YnN0cigtMikpIC0gMTtcbiAgICB0aGlzLmRhdGUuc2V0TW9udGgodmFsIDwgMCA/IDAgOiB2YWwpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IG1vbnRoID0gdGhpcy5kYXRlLmdldE1vbnRoKCk7XG4gICAgbGV0IHRsID0gdGhpcy50b2tlbi5sZW5ndGg7XG4gICAgcmV0dXJuIHRsID09PSAyID8gU3RyaW5nKG1vbnRoICsgMSkucGFkU3RhcnQoMiwgJzAnKVxuICAgICAgICAgICA6IHRsID09PSAzID8gdGhpcy5sb2NhbGVzLm1vbnRoc1Nob3J0W21vbnRoXVxuICAgICAgICAgICAgIDogdGwgPT09IDQgPyB0aGlzLmxvY2FsZXMubW9udGhzW21vbnRoXVxuICAgICAgICAgICAgICAgOiBTdHJpbmcobW9udGggKyAxKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vbnRoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBEYXRlUGFydCA9IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKTtcblxuY2xhc3MgU2Vjb25kcyBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldFNlY29uZHModGhpcy5kYXRlLmdldFNlY29uZHMoKSArIDEpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICB0aGlzLmRhdGUuc2V0U2Vjb25kcyh0aGlzLmRhdGUuZ2V0U2Vjb25kcygpIC0gMSk7XG4gIH1cblxuICBzZXRUbyh2YWwpIHtcbiAgICB0aGlzLmRhdGUuc2V0U2Vjb25kcyhwYXJzZUludCh2YWwuc3Vic3RyKC0yKSkpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IHMgPSB0aGlzLmRhdGUuZ2V0U2Vjb25kcygpO1xuICAgIHJldHVybiB0aGlzLnRva2VuLmxlbmd0aCA+IDEgPyBTdHJpbmcocykucGFkU3RhcnQoMiwgJzAnKSA6IHM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZWNvbmRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBEYXRlUGFydCA9IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKTtcblxuY2xhc3MgWWVhciBleHRlbmRzIERhdGVQYXJ0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy5kYXRlLnNldEZ1bGxZZWFyKHRoaXMuZGF0ZS5nZXRGdWxsWWVhcigpICsgMSk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMuZGF0ZS5zZXRGdWxsWWVhcih0aGlzLmRhdGUuZ2V0RnVsbFllYXIoKSAtIDEpO1xuICB9XG5cbiAgc2V0VG8odmFsKSB7XG4gICAgdGhpcy5kYXRlLnNldEZ1bGxZZWFyKHZhbC5zdWJzdHIoLTQpKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGxldCB5ZWFyID0gU3RyaW5nKHRoaXMuZGF0ZS5nZXRGdWxsWWVhcigpKS5wYWRTdGFydCg0LCAnMCcpO1xuICAgIHJldHVybiB0aGlzLnRva2VuLmxlbmd0aCA9PT0gMiA/IHllYXIuc3Vic3RyKC0yKSA6IHllYXI7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBZZWFyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRGF0ZVBhcnQ6IHJlcXVpcmUoJy4vZGF0ZXBhcnQnKSxcbiAgTWVyaWRpZW06IHJlcXVpcmUoJy4vbWVyaWRpZW0nKSxcbiAgRGF5OiByZXF1aXJlKCcuL2RheScpLFxuICBIb3VyczogcmVxdWlyZSgnLi9ob3VycycpLFxuICBNaWxsaXNlY29uZHM6IHJlcXVpcmUoJy4vbWlsbGlzZWNvbmRzJyksXG4gIE1pbnV0ZXM6IHJlcXVpcmUoJy4vbWludXRlcycpLFxuICBNb250aDogcmVxdWlyZSgnLi9tb250aCcpLFxuICBTZWNvbmRzOiByZXF1aXJlKCcuL3NlY29uZHMnKSxcbiAgWWVhcjogcmVxdWlyZSgnLi95ZWFyJyksXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcbmNvbnN0IFByb21wdCA9IHJlcXVpcmUoJy4vcHJvbXB0Jyk7XG5jb25zdCB7IHN0eWxlLCBjbGVhciwgZmlndXJlcyB9ID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuY29uc3QgeyBlcmFzZSwgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5jb25zdCB7IERhdGVQYXJ0LCBNZXJpZGllbSwgRGF5LCBIb3VycywgTWlsbGlzZWNvbmRzLCBNaW51dGVzLCBNb250aCwgU2Vjb25kcywgWWVhciB9ID0gcmVxdWlyZSgnLi4vZGF0ZXBhcnRzJyk7XG5cbmNvbnN0IHJlZ2V4ID0gL1xcXFwoLil8XCIoKD86XFxcXFtcIlxcXFxdfFteXCJdKSspXCJ8KERbRG9dP3xkezMsNH18ZCl8KE17MSw0fSl8KFlZKD86WVkpPyl8KFthQV0pfChbSGhdezEsMn0pfChtezEsMn0pfChzezEsMn0pfChTezEsNH0pfC4vZztcbmNvbnN0IHJlZ2V4R3JvdXBzID0ge1xuICAxOiAoe3Rva2VufSkgPT4gdG9rZW4ucmVwbGFjZSgvXFxcXCguKS9nLCAnJDEnKSxcbiAgMjogKG9wdHMpID0+IG5ldyBEYXkob3B0cyksIC8vIERheSAvLyBUT0RPXG4gIDM6IChvcHRzKSA9PiBuZXcgTW9udGgob3B0cyksIC8vIE1vbnRoXG4gIDQ6IChvcHRzKSA9PiBuZXcgWWVhcihvcHRzKSwgLy8gWWVhclxuICA1OiAob3B0cykgPT4gbmV3IE1lcmlkaWVtKG9wdHMpLCAvLyBBTS9QTSAvLyBUT0RPIChzcGVjaWFsKVxuICA2OiAob3B0cykgPT4gbmV3IEhvdXJzKG9wdHMpLCAvLyBIb3Vyc1xuICA3OiAob3B0cykgPT4gbmV3IE1pbnV0ZXMob3B0cyksIC8vIE1pbnV0ZXNcbiAgODogKG9wdHMpID0+IG5ldyBTZWNvbmRzKG9wdHMpLCAvLyBTZWNvbmRzXG4gIDk6IChvcHRzKSA9PiBuZXcgTWlsbGlzZWNvbmRzKG9wdHMpLCAvLyBGcmFjdGlvbmFsIHNlY29uZHNcbn1cblxuY29uc3QgZGZsdExvY2FsZXMgPSB7XG4gIG1vbnRoczogJ0phbnVhcnksRmVicnVhcnksTWFyY2gsQXByaWwsTWF5LEp1bmUsSnVseSxBdWd1c3QsU2VwdGVtYmVyLE9jdG9iZXIsTm92ZW1iZXIsRGVjZW1iZXInLnNwbGl0KCcsJyksXG4gIG1vbnRoc1Nob3J0OiAnSmFuLEZlYixNYXIsQXByLE1heSxKdW4sSnVsLEF1ZyxTZXAsT2N0LE5vdixEZWMnLnNwbGl0KCcsJyksXG4gIHdlZWtkYXlzOiAnU3VuZGF5LE1vbmRheSxUdWVzZGF5LFdlZG5lc2RheSxUaHVyc2RheSxGcmlkYXksU2F0dXJkYXknLnNwbGl0KCcsJyksXG4gIHdlZWtkYXlzU2hvcnQ6ICdTdW4sTW9uLFR1ZSxXZWQsVGh1LEZyaSxTYXQnLnNwbGl0KCcsJylcbn1cblxuXG4vKipcbiAqIERhdGVQcm9tcHQgQmFzZSBFbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0cy5tZXNzYWdlIE1lc3NhZ2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbml0aWFsXSBJbmRleCBvZiBkZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMubWFza10gVGhlIGZvcm1hdCBtYXNrXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdHMubG9jYWxlc10gVGhlIGRhdGUgbG9jYWxlc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmVycm9yXSBUaGUgZXJyb3IgbWVzc2FnZSBzaG93biBvbiBpbnZhbGlkIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdGhlIHN1Ym1pdHRlZCB2YWx1ZVxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cbmNsYXNzIERhdGVQcm9tcHQgZXh0ZW5kcyBQcm9tcHQge1xuICBjb25zdHJ1Y3RvcihvcHRzPXt9KSB7XG4gICAgc3VwZXIob3B0cyk7XG4gICAgdGhpcy5tc2cgPSBvcHRzLm1lc3NhZ2U7XG4gICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgIHRoaXMudHlwZWQgPSAnJztcbiAgICB0aGlzLmxvY2FsZXMgPSBPYmplY3QuYXNzaWduKGRmbHRMb2NhbGVzLCBvcHRzLmxvY2FsZXMpO1xuICAgIHRoaXMuX2RhdGUgPSBvcHRzLmluaXRpYWwgfHwgbmV3IERhdGUoKTtcbiAgICB0aGlzLmVycm9yTXNnID0gb3B0cy5lcnJvciB8fCAnUGxlYXNlIEVudGVyIEEgVmFsaWQgVmFsdWUnO1xuICAgIHRoaXMudmFsaWRhdG9yID0gb3B0cy52YWxpZGF0ZSB8fCAoKCkgPT4gdHJ1ZSk7XG4gICAgdGhpcy5tYXNrID0gb3B0cy5tYXNrIHx8ICdZWVlZLU1NLUREIEhIOm1tOnNzJztcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZVxuICB9XG5cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGU7XG4gIH1cblxuICBzZXQgZGF0ZShkYXRlKSB7XG4gICAgaWYgKGRhdGUpIHRoaXMuX2RhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSk7XG4gIH1cblxuICBzZXQgbWFzayhtYXNrKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICB0aGlzLnBhcnRzID0gW107XG4gICAgd2hpbGUocmVzdWx0ID0gcmVnZXguZXhlYyhtYXNrKSkge1xuICAgICAgbGV0IG1hdGNoID0gcmVzdWx0LnNoaWZ0KCk7XG4gICAgICBsZXQgaWR4ID0gcmVzdWx0LmZpbmRJbmRleChnciA9PiBnciAhPSBudWxsKTtcbiAgICAgIHRoaXMucGFydHMucHVzaChpZHggaW4gcmVnZXhHcm91cHNcbiAgICAgICAgPyByZWdleEdyb3Vwc1tpZHhdKHsgdG9rZW46IHJlc3VsdFtpZHhdIHx8IG1hdGNoLCBkYXRlOiB0aGlzLmRhdGUsIHBhcnRzOiB0aGlzLnBhcnRzLCBsb2NhbGVzOiB0aGlzLmxvY2FsZXMgfSlcbiAgICAgICAgOiByZXN1bHRbaWR4XSB8fCBtYXRjaCk7XG4gICAgfVxuXG4gICAgbGV0IHBhcnRzID0gdGhpcy5wYXJ0cy5yZWR1Y2UoKGFyciwgaSkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBpID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgYXJyW2Fyci5sZW5ndGggLSAxXSA9PT0gJ3N0cmluZycpXG4gICAgICAgIGFyclthcnIubGVuZ3RoIC0gMV0gKz0gaTtcbiAgICAgIGVsc2UgYXJyLnB1c2goaSk7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0sIFtdKTtcblxuICAgIHRoaXMucGFydHMuc3BsaWNlKDApO1xuICAgIHRoaXMucGFydHMucHVzaCguLi5wYXJ0cyk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgbW92ZUN1cnNvcihuKSB7XG4gICAgdGhpcy50eXBlZCA9ICcnO1xuICAgIHRoaXMuY3Vyc29yID0gbjtcbiAgICB0aGlzLmZpcmUoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubW92ZUN1cnNvcih0aGlzLnBhcnRzLmZpbmRJbmRleChwID0+IHAgaW5zdGFuY2VvZiBEYXRlUGFydCkpO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuYWJvcnQoKTtcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy5lcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIGFzeW5jIHZhbGlkYXRlKCkge1xuICAgIGxldCB2YWxpZCA9IGF3YWl0IHRoaXMudmFsaWRhdG9yKHRoaXMudmFsdWUpO1xuICAgIGlmICh0eXBlb2YgdmFsaWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVycm9yTXNnID0gdmFsaWQ7XG4gICAgICB2YWxpZCA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmVycm9yID0gIXZhbGlkO1xuICB9XG5cbiAgYXN5bmMgc3VibWl0KCkge1xuICAgIGF3YWl0IHRoaXMudmFsaWRhdGUoKTtcbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgdGhpcy5jb2xvciA9ICdyZWQnO1xuICAgICAgdGhpcy5maXJlKCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgIHRoaXMuYWJvcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIHRoaXMudHlwZWQgPSAnJztcbiAgICB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS51cCgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIHRoaXMudHlwZWQgPSAnJztcbiAgICB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5kb3duKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgbGV0IHByZXYgPSB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5wcmV2KCk7XG4gICAgaWYgKHByZXYgPT0gbnVsbCkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMubW92ZUN1cnNvcih0aGlzLnBhcnRzLmluZGV4T2YocHJldikpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByaWdodCgpIHtcbiAgICBsZXQgbmV4dCA9IHRoaXMucGFydHNbdGhpcy5jdXJzb3JdLm5leHQoKTtcbiAgICBpZiAobmV4dCA9PSBudWxsKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKHRoaXMucGFydHMuaW5kZXhPZihuZXh0KSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgbGV0IG5leHQgPSB0aGlzLnBhcnRzW3RoaXMuY3Vyc29yXS5uZXh0KCk7XG4gICAgdGhpcy5tb3ZlQ3Vyc29yKG5leHRcbiAgICAgID8gdGhpcy5wYXJ0cy5pbmRleE9mKG5leHQpXG4gICAgICA6IHRoaXMucGFydHMuZmluZEluZGV4KChwYXJ0KSA9PiBwYXJ0IGluc3RhbmNlb2YgRGF0ZVBhcnQpKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgXyhjKSB7XG4gICAgaWYgKC9cXGQvLnRlc3QoYykpIHtcbiAgICAgIHRoaXMudHlwZWQgKz0gYztcbiAgICAgIHRoaXMucGFydHNbdGhpcy5jdXJzb3JdLnNldFRvKHRoaXMudHlwZWQpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMub3V0LndyaXRlKGN1cnNvci5oaWRlKTtcbiAgICBlbHNlIHRoaXMub3V0LndyaXRlKGNsZWFyKHRoaXMub3V0cHV0VGV4dCwgdGhpcy5vdXQuY29sdW1ucykpO1xuICAgIHN1cGVyLnJlbmRlcigpO1xuXG4gICAgLy8gUHJpbnQgcHJvbXB0XG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW1xuICAgICAgc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSxcbiAgICAgIGNvbG9yLmJvbGQodGhpcy5tc2cpLFxuICAgICAgc3R5bGUuZGVsaW1pdGVyKGZhbHNlKSxcbiAgICAgIHRoaXMucGFydHMucmVkdWNlKChhcnIsIHAsIGlkeCkgPT4gYXJyLmNvbmNhdChpZHggPT09IHRoaXMuY3Vyc29yICYmICF0aGlzLmRvbmUgPyBjb2xvci5jeWFuKCkudW5kZXJsaW5lKHAudG9TdHJpbmcoKSkgOiBwKSwgW10pXG4gICAgICAgICAgLmpvaW4oJycpXG4gICAgXS5qb2luKCcgJyk7XG5cbiAgICAvLyBQcmludCBlcnJvclxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICB0aGlzLm91dHB1dFRleHQgKz0gdGhpcy5lcnJvck1zZy5zcGxpdCgnXFxuJykucmVkdWNlKFxuICAgICAgICAgIChhLCBsLCBpKSA9PiBhICsgYFxcbiR7aSA/IGAgYCA6IGZpZ3VyZXMucG9pbnRlclNtYWxsfSAke2NvbG9yLnJlZCgpLml0YWxpYyhsKX1gLCBgYCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlUHJvbXB0O1xuIiwiY29uc3QgY29sb3IgPSByZXF1aXJlKCdrbGV1cicpO1xuY29uc3QgUHJvbXB0ID0gcmVxdWlyZSgnLi9wcm9tcHQnKTtcbmNvbnN0IHsgY3Vyc29yLCBlcmFzZSB9ID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpO1xuY29uc3QgeyBzdHlsZSwgZmlndXJlcywgY2xlYXIsIGxpbmVzIH0gPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbmNvbnN0IGlzTnVtYmVyID0gL1swLTldLztcbmNvbnN0IGlzRGVmID0gYW55ID0+IGFueSAhPT0gdW5kZWZpbmVkO1xuY29uc3Qgcm91bmQgPSAobnVtYmVyLCBwcmVjaXNpb24pID0+IHtcbiAgbGV0IGZhY3RvciA9IE1hdGgucG93KDEwLCBwcmVjaXNpb24pO1xuICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiBmYWN0b3IpIC8gZmFjdG9yO1xufVxuXG4vKipcbiAqIE51bWJlclByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLnN0eWxlPSdkZWZhdWx0J10gUmVuZGVyIHN0eWxlXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMuaW5pdGlhbF0gRGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1heD0rSW5maW5pdHldIE1heCB2YWx1ZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1pbj0tSW5maW5pdHldIE1pbiB2YWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5mbG9hdD1mYWxzZV0gUGFyc2UgaW5wdXQgYXMgZmxvYXRzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMucm91bmQ9Ml0gUm91bmQgZmxvYXRzIHRvIHggZGVjaW1hbHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbmNyZW1lbnQ9MV0gTnVtYmVyIHRvIGluY3JlbWVudCBieSB3aGVuIHVzaW5nIGFycm93LWtleXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZhbGlkYXRlXSBWYWxpZGF0ZSBmdW5jdGlvblxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuZXJyb3JdIFRoZSBpbnZhbGlkIGVycm9yIGxhYmVsXG4gKi9cbmNsYXNzIE51bWJlclByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHM9e30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLnRyYW5zZm9ybSA9IHN0eWxlLnJlbmRlcihvcHRzLnN0eWxlKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLmluaXRpYWwgPSBpc0RlZihvcHRzLmluaXRpYWwpID8gb3B0cy5pbml0aWFsIDogJyc7XG4gICAgdGhpcy5mbG9hdCA9ICEhb3B0cy5mbG9hdDtcbiAgICB0aGlzLnJvdW5kID0gb3B0cy5yb3VuZCB8fCAyO1xuICAgIHRoaXMuaW5jID0gb3B0cy5pbmNyZW1lbnQgfHwgMTtcbiAgICB0aGlzLm1pbiA9IGlzRGVmKG9wdHMubWluKSA/IG9wdHMubWluIDogLUluZmluaXR5O1xuICAgIHRoaXMubWF4ID0gaXNEZWYob3B0cy5tYXgpID8gb3B0cy5tYXggOiBJbmZpbml0eTtcbiAgICB0aGlzLmVycm9yTXNnID0gb3B0cy5lcnJvciB8fCBgUGxlYXNlIEVudGVyIEEgVmFsaWQgVmFsdWVgO1xuICAgIHRoaXMudmFsaWRhdG9yID0gb3B0cy52YWxpZGF0ZSB8fCAoKCkgPT4gdHJ1ZSk7XG4gICAgdGhpcy5jb2xvciA9IGBjeWFuYDtcbiAgICB0aGlzLnZhbHVlID0gYGA7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIHRoaXMubGFzdEhpdCA9IDA7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2KSB7XG4gICAgaWYgKCF2ICYmIHYgIT09IDApIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IGNvbG9yLmdyYXkodGhpcy50cmFuc2Zvcm0ucmVuZGVyKGAke3RoaXMuaW5pdGlhbH1gKSk7XG4gICAgICB0aGlzLl92YWx1ZSA9IGBgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcmVkID0gdGhpcy50cmFuc2Zvcm0ucmVuZGVyKGAke3JvdW5kKHYsIHRoaXMucm91bmQpfWApO1xuICAgICAgdGhpcy5fdmFsdWUgPSByb3VuZCh2LCB0aGlzLnJvdW5kKTtcbiAgICB9XG4gICAgdGhpcy5maXJlKCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgcGFyc2UoeCkge1xuICAgIHJldHVybiB0aGlzLmZsb2F0ID8gcGFyc2VGbG9hdCh4KSA6IHBhcnNlSW50KHgpO1xuICB9XG5cbiAgdmFsaWQoYykge1xuICAgIHJldHVybiBjID09PSBgLWAgfHwgYyA9PT0gYC5gICYmIHRoaXMuZmxvYXQgfHwgaXNOdW1iZXIudGVzdChjKVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIHRoaXMudmFsdWUgPSBgYDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLmFib3J0KCk7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBsZXQgeCA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy52YWx1ZSA9IHggIT09IGBgID8geCA6IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKGBcXG5gKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZSgpIHtcbiAgICBsZXQgdmFsaWQgPSBhd2FpdCB0aGlzLnZhbGlkYXRvcih0aGlzLnZhbHVlKTtcbiAgICBpZiAodHlwZW9mIHZhbGlkID09PSBgc3RyaW5nYCkge1xuICAgICAgdGhpcy5lcnJvck1zZyA9IHZhbGlkO1xuICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5lcnJvciA9ICF2YWxpZDtcbiAgfVxuXG4gIGFzeW5jIHN1Ym1pdCgpIHtcbiAgICBhd2FpdCB0aGlzLnZhbGlkYXRlKCk7XG4gICAgaWYgKHRoaXMuZXJyb3IpIHtcbiAgICAgIHRoaXMuY29sb3IgPSBgcmVkYDtcbiAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHggPSB0aGlzLnZhbHVlO1xuICAgIHRoaXMudmFsdWUgPSB4ICE9PSBgYCA/IHggOiB0aGlzLmluaXRpYWw7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmVycm9yID0gZmFsc2U7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZShgXFxuYCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIGlmKHRoaXMudmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW4gLSB0aGlzLmluYztcbiAgICB9XG4gICAgaWYgKHRoaXMudmFsdWUgPj0gdGhpcy5tYXgpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlICs9IHRoaXMuaW5jO1xuICAgIHRoaXMuY29sb3IgPSBgY3lhbmA7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRvd24oKSB7XG4gICAgdGhpcy50eXBlZCA9IGBgO1xuICAgIGlmKHRoaXMudmFsdWUgPT09ICcnKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW4gKyB0aGlzLmluYztcbiAgICB9XG4gICAgaWYgKHRoaXMudmFsdWUgPD0gdGhpcy5taW4pIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlIC09IHRoaXMuaW5jO1xuICAgIHRoaXMuY29sb3IgPSBgY3lhbmA7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBsZXQgdmFsID0gdGhpcy52YWx1ZS50b1N0cmluZygpO1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5iZWxsKCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMucGFyc2UoKHZhbCA9IHZhbC5zbGljZSgwLCAtMSkpKSB8fCBgYDtcbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gJycgJiYgdGhpcy52YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcy5taW47XG4gICAgfVxuICAgIHRoaXMuY29sb3IgPSBgY3lhbmA7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuaW5pdGlhbDtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgXyhjLCBrZXkpIHtcbiAgICBpZiAoIXRoaXMudmFsaWQoYykpIHJldHVybiB0aGlzLmJlbGwoKTtcblxuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKG5vdyAtIHRoaXMubGFzdEhpdCA+IDEwMDApIHRoaXMudHlwZWQgPSBgYDsgLy8gMXMgZWxhcHNlZFxuICAgIHRoaXMudHlwZWQgKz0gYztcbiAgICB0aGlzLmxhc3RIaXQgPSBub3c7XG4gICAgdGhpcy5jb2xvciA9IGBjeWFuYDtcblxuICAgIGlmIChjID09PSBgLmApIHJldHVybiB0aGlzLmZpcmUoKTtcblxuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLnBhcnNlKHRoaXMudHlwZWQpLCB0aGlzLm1heCk7XG4gICAgaWYgKHRoaXMudmFsdWUgPiB0aGlzLm1heCkgdGhpcy52YWx1ZSA9IHRoaXMubWF4O1xuICAgIGlmICh0aGlzLnZhbHVlIDwgdGhpcy5taW4pIHRoaXMudmFsdWUgPSB0aGlzLm1pbjtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5maXJzdFJlbmRlcikge1xuICAgICAgaWYgKHRoaXMub3V0cHV0RXJyb3IpXG4gICAgICAgIHRoaXMub3V0LndyaXRlKGN1cnNvci5kb3duKGxpbmVzKHRoaXMub3V0cHV0RXJyb3IsIHRoaXMub3V0LmNvbHVtbnMpIC0gMSkgKyBjbGVhcih0aGlzLm91dHB1dEVycm9yLCB0aGlzLm91dC5jb2x1bW5zKSk7XG4gICAgICB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICB9XG4gICAgc3VwZXIucmVuZGVyKCk7XG4gICAgdGhpcy5vdXRwdXRFcnJvciA9ICcnO1xuXG4gICAgLy8gUHJpbnQgcHJvbXB0XG4gICAgdGhpcy5vdXRwdXRUZXh0ID0gW1xuICAgICAgc3R5bGUuc3ltYm9sKHRoaXMuZG9uZSwgdGhpcy5hYm9ydGVkKSxcbiAgICAgIGNvbG9yLmJvbGQodGhpcy5tc2cpLFxuICAgICAgc3R5bGUuZGVsaW1pdGVyKHRoaXMuZG9uZSksXG4gICAgICAhdGhpcy5kb25lIHx8ICghdGhpcy5kb25lICYmICF0aGlzLnBsYWNlaG9sZGVyKVxuICAgICAgICAgID8gY29sb3JbdGhpcy5jb2xvcl0oKS51bmRlcmxpbmUodGhpcy5yZW5kZXJlZCkgOiB0aGlzLnJlbmRlcmVkXG4gICAgXS5qb2luKGAgYCk7XG5cbiAgICAvLyBQcmludCBlcnJvclxuICAgIGlmICh0aGlzLmVycm9yKSB7XG4gICAgICB0aGlzLm91dHB1dEVycm9yICs9IHRoaXMuZXJyb3JNc2cuc3BsaXQoYFxcbmApXG4gICAgICAgICAgLnJlZHVjZSgoYSwgbCwgaSkgPT4gYSArIGBcXG4ke2kgPyBgIGAgOiBmaWd1cmVzLnBvaW50ZXJTbWFsbH0gJHtjb2xvci5yZWQoKS5pdGFsaWMobCl9YCwgYGApO1xuICAgIH1cblxuICAgIHRoaXMub3V0LndyaXRlKGVyYXNlLmxpbmUgKyBjdXJzb3IudG8oMCkgKyB0aGlzLm91dHB1dFRleHQgKyBjdXJzb3Iuc2F2ZSArIHRoaXMub3V0cHV0RXJyb3IgKyBjdXJzb3IucmVzdG9yZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOdW1iZXJQcm9tcHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNvbG9yID0gcmVxdWlyZSgna2xldXInKTtcbmNvbnN0IHsgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuY29uc3QgeyBjbGVhciwgZmlndXJlcywgc3R5bGUsIHdyYXAsIGVudHJpZXNUb0Rpc3BsYXkgfSA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuLyoqXG4gKiBNdWx0aXNlbGVjdFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZSBvYmplY3RzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMud2Fybl0gSGludCBzaG93biBmb3IgZGlzYWJsZWQgY2hvaWNlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1heF0gTWF4IGNob2ljZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMub3B0aW9uc1BlclBhZ2U9MTBdIE1heCBvcHRpb25zIHRvIGRpc3BsYXkgYXQgb25jZVxuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFtvcHRzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKi9cbmNsYXNzIE11bHRpc2VsZWN0UHJvbXB0IGV4dGVuZHMgUHJvbXB0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuY3Vyc29yID0gb3B0cy5jdXJzb3IgfHwgMDtcbiAgICB0aGlzLnNjcm9sbEluZGV4ID0gb3B0cy5jdXJzb3IgfHwgMDtcbiAgICB0aGlzLmhpbnQgPSBvcHRzLmhpbnQgfHwgJyc7XG4gICAgdGhpcy53YXJuID0gb3B0cy53YXJuIHx8ICctIFRoaXMgb3B0aW9uIGlzIGRpc2FibGVkIC0nO1xuICAgIHRoaXMubWluU2VsZWN0ZWQgPSBvcHRzLm1pbjtcbiAgICB0aGlzLnNob3dNaW5FcnJvciA9IGZhbHNlO1xuICAgIHRoaXMubWF4Q2hvaWNlcyA9IG9wdHMubWF4O1xuICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gb3B0cy5pbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5vcHRpb25zUGVyUGFnZSA9IG9wdHMub3B0aW9uc1BlclBhZ2UgfHwgMTA7XG4gICAgdGhpcy52YWx1ZSA9IG9wdHMuY2hvaWNlcy5tYXAoKGNoLCBpZHgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY2ggPT09ICdzdHJpbmcnKVxuICAgICAgICBjaCA9IHt0aXRsZTogY2gsIHZhbHVlOiBpZHh9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGl0bGU6IGNoICYmIChjaC50aXRsZSB8fCBjaC52YWx1ZSB8fCBjaCksXG4gICAgICAgIGRlc2NyaXB0aW9uOiBjaCAmJiBjaC5kZXNjcmlwdGlvbixcbiAgICAgICAgdmFsdWU6IGNoICYmIChjaC52YWx1ZSA9PT0gdW5kZWZpbmVkID8gaWR4IDogY2gudmFsdWUpLFxuICAgICAgICBzZWxlY3RlZDogY2ggJiYgY2guc2VsZWN0ZWQsXG4gICAgICAgIGRpc2FibGVkOiBjaCAmJiBjaC5kaXNhYmxlZFxuICAgICAgfTtcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuICAgIGlmICghb3B0cy5vdmVycmlkZVJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlLm1hcCh2ID0+ICF2LnNlbGVjdGVkKTtcbiAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlLmZpbHRlcih2ID0+IHYuc2VsZWN0ZWQpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLmFib3J0KCk7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gICAgdGhpcy5vdXQud3JpdGUoJ1xcbicpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIHN1Ym1pdCgpIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMudmFsdWVcbiAgICAgIC5maWx0ZXIoZSA9PiBlLnNlbGVjdGVkKTtcbiAgICBpZiAodGhpcy5taW5TZWxlY3RlZCAmJiBzZWxlY3RlZC5sZW5ndGggPCB0aGlzLm1pblNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNob3dNaW5FcnJvciA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmZpcmUoKTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBsYXN0KCkge1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy52YWx1ZS5sZW5ndGggLSAxO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbiAgbmV4dCgpIHtcbiAgICB0aGlzLmN1cnNvciA9ICh0aGlzLmN1cnNvciArIDEpICUgdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIGlmICh0aGlzLmN1cnNvciA9PT0gMCkge1xuICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3Vyc29yLS07XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIGlmICh0aGlzLmN1cnNvciA9PT0gdGhpcy52YWx1ZS5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmN1cnNvciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3Vyc29yKys7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBsZWZ0KCkge1xuICAgIHRoaXMudmFsdWVbdGhpcy5jdXJzb3JdLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIGlmICh0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLmxlbmd0aCA+PSB0aGlzLm1heENob2ljZXMpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLnZhbHVlW3RoaXMuY3Vyc29yXS5zZWxlY3RlZCA9IHRydWU7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGhhbmRsZVNwYWNlVG9nZ2xlKCkge1xuICAgIGNvbnN0IHYgPSB0aGlzLnZhbHVlW3RoaXMuY3Vyc29yXTtcblxuICAgIGlmICh2LnNlbGVjdGVkKSB7XG4gICAgICB2LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSBpZiAodi5kaXNhYmxlZCB8fCB0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLmxlbmd0aCA+PSB0aGlzLm1heENob2ljZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZUFsbCgpIHtcbiAgICBpZiAodGhpcy5tYXhDaG9pY2VzICE9PSB1bmRlZmluZWQgfHwgdGhpcy52YWx1ZVt0aGlzLmN1cnNvcl0uZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdTZWxlY3RlZCA9ICF0aGlzLnZhbHVlW3RoaXMuY3Vyc29yXS5zZWxlY3RlZDtcbiAgICB0aGlzLnZhbHVlLmZpbHRlcih2ID0+ICF2LmRpc2FibGVkKS5mb3JFYWNoKHYgPT4gdi5zZWxlY3RlZCA9IG5ld1NlbGVjdGVkKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgXyhjLCBrZXkpIHtcbiAgICBpZiAoYyA9PT0gJyAnKSB7XG4gICAgICB0aGlzLmhhbmRsZVNwYWNlVG9nZ2xlKCk7XG4gICAgfSBlbHNlIGlmIChjID09PSAnYScpIHtcbiAgICAgIHRoaXMudG9nZ2xlQWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJJbnN0cnVjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zID09PSB1bmRlZmluZWQgfHwgdGhpcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnN0cnVjdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RydWN0aW9ucztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnXFxuSW5zdHJ1Y3Rpb25zOlxcbidcbiAgICAgICAgKyBgICAgICR7ZmlndXJlcy5hcnJvd1VwfS8ke2ZpZ3VyZXMuYXJyb3dEb3dufTogSGlnaGxpZ2h0IG9wdGlvblxcbmBcbiAgICAgICAgKyBgICAgICR7ZmlndXJlcy5hcnJvd0xlZnR9LyR7ZmlndXJlcy5hcnJvd1JpZ2h0fS9bc3BhY2VdOiBUb2dnbGUgc2VsZWN0aW9uXFxuYFxuICAgICAgICArICh0aGlzLm1heENob2ljZXMgPT09IHVuZGVmaW5lZCA/IGAgICAgYTogVG9nZ2xlIGFsbFxcbmAgOiAnJylcbiAgICAgICAgKyBgICAgIGVudGVyL3JldHVybjogQ29tcGxldGUgYW5zd2VyYDtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVuZGVyT3B0aW9uKGN1cnNvciwgdiwgaSwgYXJyb3dJbmRpY2F0b3IpIHtcbiAgICBjb25zdCBwcmVmaXggPSAodi5zZWxlY3RlZCA/IGNvbG9yLmdyZWVuKGZpZ3VyZXMucmFkaW9PbikgOiBmaWd1cmVzLnJhZGlvT2ZmKSArICcgJyArIGFycm93SW5kaWNhdG9yICsgJyAnO1xuICAgIGxldCB0aXRsZSwgZGVzYztcblxuICAgIGlmICh2LmRpc2FibGVkKSB7XG4gICAgICB0aXRsZSA9IGN1cnNvciA9PT0gaSA/IGNvbG9yLmdyYXkoKS51bmRlcmxpbmUodi50aXRsZSkgOiBjb2xvci5zdHJpa2V0aHJvdWdoKCkuZ3JheSh2LnRpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGl0bGUgPSBjdXJzb3IgPT09IGkgPyBjb2xvci5jeWFuKCkudW5kZXJsaW5lKHYudGl0bGUpIDogdi50aXRsZTtcbiAgICAgIGlmIChjdXJzb3IgPT09IGkgJiYgdi5kZXNjcmlwdGlvbikge1xuICAgICAgICBkZXNjID0gYCAtICR7di5kZXNjcmlwdGlvbn1gO1xuICAgICAgICBpZiAocHJlZml4Lmxlbmd0aCArIHRpdGxlLmxlbmd0aCArIGRlc2MubGVuZ3RoID49IHRoaXMub3V0LmNvbHVtbnNcbiAgICAgICAgICB8fCB2LmRlc2NyaXB0aW9uLnNwbGl0KC9cXHI/XFxuLykubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGRlc2MgPSAnXFxuJyArIHdyYXAodi5kZXNjcmlwdGlvbiwgeyBtYXJnaW46IHByZWZpeC5sZW5ndGgsIHdpZHRoOiB0aGlzLm91dC5jb2x1bW5zIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByZWZpeCArIHRpdGxlICsgY29sb3IuZ3JheShkZXNjIHx8ICcnKTtcbiAgfVxuXG4gIC8vIHNoYXJlZCB3aXRoIGF1dG9jb21wbGV0ZU11bHRpc2VsZWN0XG4gIHBhZ2luYXRlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sb3IucmVkKCdObyBtYXRjaGVzIGZvciB0aGlzIHF1ZXJ5LicpO1xuICAgIH1cblxuICAgIGxldCB7IHN0YXJ0SW5kZXgsIGVuZEluZGV4IH0gPSBlbnRyaWVzVG9EaXNwbGF5KHRoaXMuY3Vyc29yLCBvcHRpb25zLmxlbmd0aCwgdGhpcy5vcHRpb25zUGVyUGFnZSk7XG4gICAgbGV0IHByZWZpeCwgc3R5bGVkT3B0aW9ucyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPCBlbmRJbmRleDsgaSsrKSB7XG4gICAgICBpZiAoaSA9PT0gc3RhcnRJbmRleCAmJiBzdGFydEluZGV4ID4gMCkge1xuICAgICAgICBwcmVmaXggPSBmaWd1cmVzLmFycm93VXA7XG4gICAgICB9IGVsc2UgaWYgKGkgPT09IGVuZEluZGV4IC0gMSAmJiBlbmRJbmRleCA8IG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHByZWZpeCA9IGZpZ3VyZXMuYXJyb3dEb3duO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJlZml4ID0gJyAnO1xuICAgICAgfVxuICAgICAgc3R5bGVkT3B0aW9ucy5wdXNoKHRoaXMucmVuZGVyT3B0aW9uKHRoaXMuY3Vyc29yLCBvcHRpb25zW2ldLCBpLCBwcmVmaXgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ1xcbicgKyBzdHlsZWRPcHRpb25zLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgLy8gc2hhcmVkIHdpdGggYXV0b2NvbWxldGVNdWx0aXNlbGVjdFxuICByZW5kZXJPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFnaW5hdGVPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICByZW5kZXJEb25lT3JJbnN0cnVjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICAgICAgLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpXG4gICAgICAgIC5tYXAodiA9PiB2LnRpdGxlKVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXQgPSBbY29sb3IuZ3JheSh0aGlzLmhpbnQpLCB0aGlzLnJlbmRlckluc3RydWN0aW9ucygpXTtcblxuICAgIGlmICh0aGlzLnZhbHVlW3RoaXMuY3Vyc29yXS5kaXNhYmxlZCkge1xuICAgICAgb3V0cHV0LnB1c2goY29sb3IueWVsbG93KHRoaXMud2FybikpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0LmpvaW4oJyAnKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHJldHVybjtcbiAgICBpZiAodGhpcy5maXJzdFJlbmRlcikgdGhpcy5vdXQud3JpdGUoY3Vyc29yLmhpZGUpO1xuICAgIHN1cGVyLnJlbmRlcigpO1xuXG4gICAgLy8gcHJpbnQgcHJvbXB0XG4gICAgbGV0IHByb21wdCA9IFtcbiAgICAgIHN0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksXG4gICAgICBjb2xvci5ib2xkKHRoaXMubXNnKSxcbiAgICAgIHN0eWxlLmRlbGltaXRlcihmYWxzZSksXG4gICAgICB0aGlzLnJlbmRlckRvbmVPckluc3RydWN0aW9ucygpXG4gICAgXS5qb2luKCcgJyk7XG4gICAgaWYgKHRoaXMuc2hvd01pbkVycm9yKSB7XG4gICAgICBwcm9tcHQgKz0gY29sb3IucmVkKGBZb3UgbXVzdCBzZWxlY3QgYSBtaW5pbXVtIG9mICR7dGhpcy5taW5TZWxlY3RlZH0gY2hvaWNlcy5gKTtcbiAgICAgIHRoaXMuc2hvd01pbkVycm9yID0gZmFsc2U7XG4gICAgfVxuICAgIHByb21wdCArPSB0aGlzLnJlbmRlck9wdGlvbnModGhpcy52YWx1ZSk7XG5cbiAgICB0aGlzLm91dC53cml0ZSh0aGlzLmNsZWFyICsgcHJvbXB0KTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIocHJvbXB0LCB0aGlzLm91dC5jb2x1bW5zKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpc2VsZWN0UHJvbXB0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5jb25zdCBQcm9tcHQgPSByZXF1aXJlKCcuL3Byb21wdCcpO1xuY29uc3QgeyBlcmFzZSwgY3Vyc29yIH0gPSByZXF1aXJlKCdzaXN0ZXJhbnNpJyk7XG5jb25zdCB7IHN0eWxlLCBjbGVhciwgZmlndXJlcywgd3JhcCwgZW50cmllc1RvRGlzcGxheSB9ID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5jb25zdCBnZXRWYWwgPSAoYXJyLCBpKSA9PiBhcnJbaV0gJiYgKGFycltpXS52YWx1ZSB8fCBhcnJbaV0udGl0bGUgfHwgYXJyW2ldKTtcbmNvbnN0IGdldFRpdGxlID0gKGFyciwgaSkgPT4gYXJyW2ldICYmIChhcnJbaV0udGl0bGUgfHwgYXJyW2ldLnZhbHVlIHx8IGFycltpXSk7XG5jb25zdCBnZXRJbmRleCA9IChhcnIsIHZhbE9yVGl0bGUpID0+IHtcbiAgY29uc3QgaW5kZXggPSBhcnIuZmluZEluZGV4KGVsID0+IGVsLnZhbHVlID09PSB2YWxPclRpdGxlIHx8IGVsLnRpdGxlID09PSB2YWxPclRpdGxlKTtcbiAgcmV0dXJuIGluZGV4ID4gLTEgPyBpbmRleCA6IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogVGV4dFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGF1dG8tY29tcGxldGUgY2hvaWNlcyBvYmplY3RzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5zdWdnZXN0XSBGaWx0ZXIgZnVuY3Rpb24uIERlZmF1bHRzIHRvIHNvcnQgYnkgdGl0bGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5saW1pdD0xMF0gTWF4IG51bWJlciBvZiByZXN1bHRzIHRvIHNob3dcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuc3R5bGU9J2RlZmF1bHQnXSBSZW5kZXIgc3R5bGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy5mYWxsYmFja10gRmFsbGJhY2sgbWVzc2FnZSAtIGluaXRpYWwgdG8gZGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLmluaXRpYWxdIEluZGV4IG9mIHRoZSBkZWZhdWx0IHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRzLmNsZWFyRmlyc3RdIFRoZSBmaXJzdCBFU0NBUEUga2V5cHJlc3Mgd2lsbCBjbGVhciB0aGUgaW5wdXRcbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRpbl0gVGhlIFJlYWRhYmxlIHN0cmVhbSB0byBsaXN0ZW4gdG9cbiAqIEBwYXJhbSB7U3RyZWFtfSBbb3B0cy5zdGRvdXRdIFRoZSBXcml0YWJsZSBzdHJlYW0gdG8gd3JpdGUgcmVhZGxpbmUgZGF0YSB0b1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLm5vTWF0Y2hlc10gVGhlIG5vIG1hdGNoZXMgZm91bmQgbGFiZWxcbiAqL1xuY2xhc3MgQXV0b2NvbXBsZXRlUHJvbXB0IGV4dGVuZHMgUHJvbXB0IHtcbiAgY29uc3RydWN0b3Iob3B0cz17fSkge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHRoaXMubXNnID0gb3B0cy5tZXNzYWdlO1xuICAgIHRoaXMuc3VnZ2VzdCA9IG9wdHMuc3VnZ2VzdDtcbiAgICB0aGlzLmNob2ljZXMgPSBvcHRzLmNob2ljZXM7XG4gICAgdGhpcy5pbml0aWFsID0gdHlwZW9mIG9wdHMuaW5pdGlhbCA9PT0gJ251bWJlcidcbiAgICAgID8gb3B0cy5pbml0aWFsXG4gICAgICA6IGdldEluZGV4KG9wdHMuY2hvaWNlcywgb3B0cy5pbml0aWFsKTtcbiAgICB0aGlzLnNlbGVjdCA9IHRoaXMuaW5pdGlhbCB8fCBvcHRzLmN1cnNvciB8fCAwO1xuICAgIHRoaXMuaTE4biA9IHsgbm9NYXRjaGVzOiBvcHRzLm5vTWF0Y2hlcyB8fCAnbm8gbWF0Y2hlcyBmb3VuZCcgfTtcbiAgICB0aGlzLmZhbGxiYWNrID0gb3B0cy5mYWxsYmFjayB8fCB0aGlzLmluaXRpYWw7XG4gICAgdGhpcy5jbGVhckZpcnN0ID0gb3B0cy5jbGVhckZpcnN0IHx8IGZhbHNlO1xuICAgIHRoaXMuc3VnZ2VzdGlvbnMgPSBbXTtcbiAgICB0aGlzLmlucHV0ID0gJyc7XG4gICAgdGhpcy5saW1pdCA9IG9wdHMubGltaXQgfHwgMTA7XG4gICAgdGhpcy5jdXJzb3IgPSAwO1xuICAgIHRoaXMudHJhbnNmb3JtID0gc3R5bGUucmVuZGVyKG9wdHMuc3R5bGUpO1xuICAgIHRoaXMuc2NhbGUgPSB0aGlzLnRyYW5zZm9ybS5zY2FsZTtcbiAgICB0aGlzLnJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wbGV0ZSA9IHRoaXMuY29tcGxldGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuICAgIHRoaXMuY29tcGxldGUodGhpcy5yZW5kZXIpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBzZXQgZmFsbGJhY2soZmIpIHtcbiAgICB0aGlzLl9mYiA9IE51bWJlci5pc1NhZmVJbnRlZ2VyKHBhcnNlSW50KGZiKSkgPyBwYXJzZUludChmYikgOiBmYjtcbiAgfVxuXG4gIGdldCBmYWxsYmFjaygpIHtcbiAgICBsZXQgY2hvaWNlO1xuICAgIGlmICh0eXBlb2YgdGhpcy5fZmIgPT09ICdudW1iZXInKVxuICAgICAgY2hvaWNlID0gdGhpcy5jaG9pY2VzW3RoaXMuX2ZiXTtcbiAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5fZmIgPT09ICdzdHJpbmcnKVxuICAgICAgY2hvaWNlID0geyB0aXRsZTogdGhpcy5fZmIgfTtcbiAgICByZXR1cm4gY2hvaWNlIHx8IHRoaXMuX2ZiIHx8IHsgdGl0bGU6IHRoaXMuaTE4bi5ub01hdGNoZXMgfTtcbiAgfVxuXG4gIG1vdmVTZWxlY3QoaSkge1xuICAgIHRoaXMuc2VsZWN0ID0gaTtcbiAgICBpZiAodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggPiAwKVxuICAgICAgdGhpcy52YWx1ZSA9IGdldFZhbCh0aGlzLnN1Z2dlc3Rpb25zLCBpKTtcbiAgICBlbHNlIHRoaXMudmFsdWUgPSB0aGlzLmZhbGxiYWNrLnZhbHVlO1xuICAgIHRoaXMuZmlyZSgpO1xuICB9XG5cbiAgYXN5bmMgY29tcGxldGUoY2IpIHtcbiAgICBjb25zdCBwID0gKHRoaXMuY29tcGxldGluZyA9IHRoaXMuc3VnZ2VzdCh0aGlzLmlucHV0LCB0aGlzLmNob2ljZXMpKTtcbiAgICBjb25zdCBzdWdnZXN0aW9ucyA9IGF3YWl0IHA7XG5cbiAgICBpZiAodGhpcy5jb21wbGV0aW5nICE9PSBwKSByZXR1cm47XG4gICAgdGhpcy5zdWdnZXN0aW9ucyA9IHN1Z2dlc3Rpb25zXG4gICAgICAubWFwKChzLCBpLCBhcnIpID0+ICh7IHRpdGxlOiBnZXRUaXRsZShhcnIsIGkpLCB2YWx1ZTogZ2V0VmFsKGFyciwgaSksIGRlc2NyaXB0aW9uOiBzLmRlc2NyaXB0aW9uIH0pKTtcbiAgICB0aGlzLmNvbXBsZXRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBsID0gTWF0aC5tYXgoc3VnZ2VzdGlvbnMubGVuZ3RoIC0gMSwgMCk7XG4gICAgdGhpcy5tb3ZlU2VsZWN0KE1hdGgubWluKGwsIHRoaXMuc2VsZWN0KSk7XG5cbiAgICBjYiAmJiBjYigpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5pbnB1dCA9ICcnO1xuICAgIHRoaXMuY29tcGxldGUoKCkgPT4ge1xuICAgICAgdGhpcy5tb3ZlU2VsZWN0KHRoaXMuaW5pdGlhbCAhPT0gdm9pZCAwID8gdGhpcy5pbml0aWFsIDogMCk7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIGlmICh0aGlzLmNsZWFyRmlyc3QgJiYgdGhpcy5pbnB1dC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRoaXMuZXhpdGVkID0gdHJ1ZTsgXG4gICAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmRvbmUgPSB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMuZXhpdGVkID0gZmFsc2U7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLm91dC53cml0ZSgnXFxuJyk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgc3VibWl0KCkge1xuICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgdGhpcy5hYm9ydGVkID0gdGhpcy5leGl0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGxldCBzMSA9IHRoaXMuaW5wdXQuc2xpY2UoMCwgdGhpcy5jdXJzb3IpO1xuICAgIGxldCBzMiA9IHRoaXMuaW5wdXQuc2xpY2UodGhpcy5jdXJzb3IpO1xuICAgIHRoaXMuaW5wdXQgPSBgJHtzMX0ke2N9JHtzMn1gO1xuICAgIHRoaXMuY3Vyc29yID0gczEubGVuZ3RoKzE7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPT09IDApIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICBsZXQgczEgPSB0aGlzLmlucHV0LnNsaWNlKDAsIHRoaXMuY3Vyc29yLTEpO1xuICAgIGxldCBzMiA9IHRoaXMuaW5wdXQuc2xpY2UodGhpcy5jdXJzb3IpO1xuICAgIHRoaXMuaW5wdXQgPSBgJHtzMX0ke3MyfWA7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLmN1cnNvci0xO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZWxldGVGb3J3YXJkKCkge1xuICAgIGlmKHRoaXMuY3Vyc29yKnRoaXMuc2NhbGUgPj0gdGhpcy5yZW5kZXJlZC5sZW5ndGgpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICBsZXQgczEgPSB0aGlzLmlucHV0LnNsaWNlKDAsIHRoaXMuY3Vyc29yKTtcbiAgICBsZXQgczIgPSB0aGlzLmlucHV0LnNsaWNlKHRoaXMuY3Vyc29yKzEpO1xuICAgIHRoaXMuaW5wdXQgPSBgJHtzMX0ke3MyfWA7XG4gICAgdGhpcy5jb21wbGV0ZSh0aGlzLnJlbmRlcik7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGZpcnN0KCkge1xuICAgIHRoaXMubW92ZVNlbGVjdCgwKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICB0aGlzLm1vdmVTZWxlY3QodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgdXAoKSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0ID09PSAwKSB7XG4gICAgICB0aGlzLm1vdmVTZWxlY3QodGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb3ZlU2VsZWN0KHRoaXMuc2VsZWN0IC0gMSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkb3duKCkge1xuICAgIGlmICh0aGlzLnNlbGVjdCA9PT0gdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLm1vdmVTZWxlY3QoMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW92ZVNlbGVjdCh0aGlzLnNlbGVjdCArIDEpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICBpZiAodGhpcy5zZWxlY3QgPT09IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoIC0gMSkge1xuICAgICAgdGhpcy5tb3ZlU2VsZWN0KDApO1xuICAgIH0gZWxzZSB0aGlzLm1vdmVTZWxlY3QodGhpcy5zZWxlY3QgKyAxKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbmV4dFBhZ2UoKSB7XG4gICAgdGhpcy5tb3ZlU2VsZWN0KE1hdGgubWluKHRoaXMuc2VsZWN0ICsgdGhpcy5saW1pdCwgdGhpcy5zdWdnZXN0aW9ucy5sZW5ndGggLSAxKSk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHByZXZQYWdlKCkge1xuICAgIHRoaXMubW92ZVNlbGVjdChNYXRoLm1heCh0aGlzLnNlbGVjdCAtIHRoaXMubGltaXQsIDApKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGVmdCgpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPD0gMCkgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICAgIHRoaXMuY3Vyc29yID0gdGhpcy5jdXJzb3ItMTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgcmlnaHQoKSB7XG4gICAgaWYgKHRoaXMuY3Vyc29yKnRoaXMuc2NhbGUgPj0gdGhpcy5yZW5kZXJlZC5sZW5ndGgpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuY3Vyc29yKzE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlck9wdGlvbih2LCBob3ZlcmVkLCBpc1N0YXJ0LCBpc0VuZCkge1xuICAgIGxldCBkZXNjO1xuICAgIGxldCBwcmVmaXggPSBpc1N0YXJ0ID8gZmlndXJlcy5hcnJvd1VwIDogaXNFbmQgPyBmaWd1cmVzLmFycm93RG93biA6ICcgJztcbiAgICBsZXQgdGl0bGUgPSBob3ZlcmVkID8gY29sb3IuY3lhbigpLnVuZGVybGluZSh2LnRpdGxlKSA6IHYudGl0bGU7XG4gICAgcHJlZml4ID0gKGhvdmVyZWQgPyBjb2xvci5jeWFuKGZpZ3VyZXMucG9pbnRlcikgKyAnICcgOiAnICAnKSArIHByZWZpeDtcbiAgICBpZiAodi5kZXNjcmlwdGlvbikge1xuICAgICAgZGVzYyA9IGAgLSAke3YuZGVzY3JpcHRpb259YDtcbiAgICAgIGlmIChwcmVmaXgubGVuZ3RoICsgdGl0bGUubGVuZ3RoICsgZGVzYy5sZW5ndGggPj0gdGhpcy5vdXQuY29sdW1uc1xuICAgICAgICB8fCB2LmRlc2NyaXB0aW9uLnNwbGl0KC9cXHI/XFxuLykubGVuZ3RoID4gMSkge1xuICAgICAgICBkZXNjID0gJ1xcbicgKyB3cmFwKHYuZGVzY3JpcHRpb24sIHsgbWFyZ2luOiAzLCB3aWR0aDogdGhpcy5vdXQuY29sdW1ucyB9KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJlZml4ICsgJyAnICsgdGl0bGUgKyBjb2xvci5ncmF5KGRlc2MgfHwgJycpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZpcnN0UmVuZGVyKSB0aGlzLm91dC53cml0ZShjdXJzb3IuaGlkZSk7XG4gICAgZWxzZSB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICBzdXBlci5yZW5kZXIoKTtcblxuICAgIGxldCB7IHN0YXJ0SW5kZXgsIGVuZEluZGV4IH0gPSBlbnRyaWVzVG9EaXNwbGF5KHRoaXMuc2VsZWN0LCB0aGlzLmNob2ljZXMubGVuZ3RoLCB0aGlzLmxpbWl0KTtcblxuICAgIHRoaXMub3V0cHV0VGV4dCA9IFtcbiAgICAgIHN0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCwgdGhpcy5leGl0ZWQpLFxuICAgICAgY29sb3IuYm9sZCh0aGlzLm1zZyksXG4gICAgICBzdHlsZS5kZWxpbWl0ZXIodGhpcy5jb21wbGV0aW5nKSxcbiAgICAgIHRoaXMuZG9uZSAmJiB0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuc2VsZWN0XVxuICAgICAgICA/IHRoaXMuc3VnZ2VzdGlvbnNbdGhpcy5zZWxlY3RdLnRpdGxlXG4gICAgICAgIDogdGhpcy5yZW5kZXJlZCA9IHRoaXMudHJhbnNmb3JtLnJlbmRlcih0aGlzLmlucHV0KVxuICAgIF0uam9pbignICcpO1xuXG4gICAgaWYgKCF0aGlzLmRvbmUpIHtcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gdGhpcy5zdWdnZXN0aW9uc1xuICAgICAgICAuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpXG4gICAgICAgIC5tYXAoKGl0ZW0sIGkpID0+ICB0aGlzLnJlbmRlck9wdGlvbihpdGVtLFxuICAgICAgICAgIHRoaXMuc2VsZWN0ID09PSBpICsgc3RhcnRJbmRleCxcbiAgICAgICAgICBpID09PSAwICYmIHN0YXJ0SW5kZXggPiAwLFxuICAgICAgICAgIGkgKyBzdGFydEluZGV4ID09PSBlbmRJbmRleCAtIDEgJiYgZW5kSW5kZXggPCB0aGlzLmNob2ljZXMubGVuZ3RoKSlcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xuICAgICAgdGhpcy5vdXRwdXRUZXh0ICs9IGBcXG5gICsgKHN1Z2dlc3Rpb25zIHx8IGNvbG9yLmdyYXkodGhpcy5mYWxsYmFjay50aXRsZSkpO1xuICAgIH1cblxuICAgIHRoaXMub3V0LndyaXRlKGVyYXNlLmxpbmUgKyBjdXJzb3IudG8oMCkgKyB0aGlzLm91dHB1dFRleHQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0b2NvbXBsZXRlUHJvbXB0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjb2xvciA9IHJlcXVpcmUoJ2tsZXVyJyk7XG5jb25zdCB7IGN1cnNvciB9ID0gcmVxdWlyZSgnc2lzdGVyYW5zaScpO1xuY29uc3QgTXVsdGlzZWxlY3RQcm9tcHQgPSByZXF1aXJlKCcuL211bHRpc2VsZWN0Jyk7XG5jb25zdCB7IGNsZWFyLCBzdHlsZSwgZmlndXJlcyB9ID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuLyoqXG4gKiBNdWx0aXNlbGVjdFByb21wdCBCYXNlIEVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRzLm1lc3NhZ2UgTWVzc2FnZVxuICogQHBhcmFtIHtBcnJheX0gb3B0cy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZSBvYmplY3RzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMuaGludF0gSGludCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMud2Fybl0gSGludCBzaG93biBmb3IgZGlzYWJsZWQgY2hvaWNlc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRzLm1heF0gTWF4IGNob2ljZXNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5jdXJzb3I9MF0gQ3Vyc29yIHN0YXJ0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqL1xuY2xhc3MgQXV0b2NvbXBsZXRlTXVsdGlzZWxlY3RQcm9tcHQgZXh0ZW5kcyBNdWx0aXNlbGVjdFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHM9e30pIHtcbiAgICBvcHRzLm92ZXJyaWRlUmVuZGVyID0gdHJ1ZTtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSAnJztcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIoJycsIHRoaXMub3V0LmNvbHVtbnMpO1xuICAgIHRoaXMuZmlsdGVyZWRPcHRpb25zID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgbGFzdCgpIHtcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCAtIDE7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuICBuZXh0KCkge1xuICAgIHRoaXMuY3Vyc29yID0gKHRoaXMuY3Vyc29yICsgMSkgJSB0aGlzLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHVwKCkge1xuICAgIGlmICh0aGlzLmN1cnNvciA9PT0gMCkge1xuICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmZpbHRlcmVkT3B0aW9ucy5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnNvci0tO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZG93bigpIHtcbiAgICBpZiAodGhpcy5jdXJzb3IgPT09IHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJzb3IrKztcbiAgICB9XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGxlZnQoKSB7XG4gICAgdGhpcy5maWx0ZXJlZE9wdGlvbnNbdGhpcy5jdXJzb3JdLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJpZ2h0KCkge1xuICAgIGlmICh0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLmxlbmd0aCA+PSB0aGlzLm1heENob2ljZXMpIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB0aGlzLmZpbHRlcmVkT3B0aW9uc1t0aGlzLmN1cnNvcl0uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZWxldGUoKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZS5zdWJzdHIoMCwgdGhpcy5pbnB1dFZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgdGhpcy51cGRhdGVGaWx0ZXJlZE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVGaWx0ZXJlZE9wdGlvbnMoKSB7XG4gICAgY29uc3QgY3VycmVudEhpZ2hsaWdodCA9IHRoaXMuZmlsdGVyZWRPcHRpb25zW3RoaXMuY3Vyc29yXTtcbiAgICB0aGlzLmZpbHRlcmVkT3B0aW9ucyA9IHRoaXMudmFsdWVcbiAgICAgIC5maWx0ZXIodiA9PiB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0VmFsdWUpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHYudGl0bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAodi50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRoaXMuaW5wdXRWYWx1ZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiB2LnZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHYudmFsdWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0aGlzLmlucHV0VmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIGNvbnN0IG5ld0hpZ2hsaWdodEluZGV4ID0gdGhpcy5maWx0ZXJlZE9wdGlvbnMuZmluZEluZGV4KHYgPT4gdiA9PT0gY3VycmVudEhpZ2hsaWdodClcbiAgICB0aGlzLmN1cnNvciA9IG5ld0hpZ2hsaWdodEluZGV4IDwgMCA/IDAgOiBuZXdIaWdobGlnaHRJbmRleDtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgaGFuZGxlU3BhY2VUb2dnbGUoKSB7XG4gICAgY29uc3QgdiA9IHRoaXMuZmlsdGVyZWRPcHRpb25zW3RoaXMuY3Vyc29yXTtcblxuICAgIGlmICh2LnNlbGVjdGVkKSB7XG4gICAgICB2LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH0gZWxzZSBpZiAodi5kaXNhYmxlZCB8fCB0aGlzLnZhbHVlLmZpbHRlcihlID0+IGUuc2VsZWN0ZWQpLmxlbmd0aCA+PSB0aGlzLm1heENob2ljZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmJlbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUlucHV0Q2hhbmdlKGMpIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB0aGlzLmlucHV0VmFsdWUgKyBjO1xuICAgIHRoaXMudXBkYXRlRmlsdGVyZWRPcHRpb25zKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjID09PSAnICcpIHtcbiAgICAgIHRoaXMuaGFuZGxlU3BhY2VUb2dnbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYW5kbGVJbnB1dENoYW5nZShjKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJJbnN0cnVjdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMuaW5zdHJ1Y3Rpb25zID09PSB1bmRlZmluZWQgfHwgdGhpcy5pbnN0cnVjdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnN0cnVjdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RydWN0aW9ucztcbiAgICAgIH1cbiAgICAgIHJldHVybiBgXG5JbnN0cnVjdGlvbnM6XG4gICAgJHtmaWd1cmVzLmFycm93VXB9LyR7ZmlndXJlcy5hcnJvd0Rvd259OiBIaWdobGlnaHQgb3B0aW9uXG4gICAgJHtmaWd1cmVzLmFycm93TGVmdH0vJHtmaWd1cmVzLmFycm93UmlnaHR9L1tzcGFjZV06IFRvZ2dsZSBzZWxlY3Rpb25cbiAgICBbYSxiLGNdL2RlbGV0ZTogRmlsdGVyIGNob2ljZXNcbiAgICBlbnRlci9yZXR1cm46IENvbXBsZXRlIGFuc3dlclxuYDtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmVuZGVyQ3VycmVudElucHV0KCkge1xuICAgIHJldHVybiBgXG5GaWx0ZXJlZCByZXN1bHRzIGZvcjogJHt0aGlzLmlucHV0VmFsdWUgPyB0aGlzLmlucHV0VmFsdWUgOiBjb2xvci5ncmF5KCdFbnRlciBzb21ldGhpbmcgdG8gZmlsdGVyJyl9XFxuYDtcbiAgfVxuXG4gIHJlbmRlck9wdGlvbihjdXJzb3IsIHYsIGkpIHtcbiAgICBsZXQgdGl0bGU7XG4gICAgaWYgKHYuZGlzYWJsZWQpIHRpdGxlID0gY3Vyc29yID09PSBpID8gY29sb3IuZ3JheSgpLnVuZGVybGluZSh2LnRpdGxlKSA6IGNvbG9yLnN0cmlrZXRocm91Z2goKS5ncmF5KHYudGl0bGUpO1xuICAgIGVsc2UgdGl0bGUgPSBjdXJzb3IgPT09IGkgPyBjb2xvci5jeWFuKCkudW5kZXJsaW5lKHYudGl0bGUpIDogdi50aXRsZTtcbiAgICByZXR1cm4gKHYuc2VsZWN0ZWQgPyBjb2xvci5ncmVlbihmaWd1cmVzLnJhZGlvT24pIDogZmlndXJlcy5yYWRpb09mZikgKyAnICAnICsgdGl0bGVcbiAgfVxuXG4gIHJlbmRlckRvbmVPckluc3RydWN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgICAgICAuZmlsdGVyKGUgPT4gZS5zZWxlY3RlZClcbiAgICAgICAgLm1hcCh2ID0+IHYudGl0bGUpXG4gICAgICAgIC5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dCA9IFtjb2xvci5ncmF5KHRoaXMuaGludCksIHRoaXMucmVuZGVySW5zdHJ1Y3Rpb25zKCksIHRoaXMucmVuZGVyQ3VycmVudElucHV0KCldO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVyZWRPcHRpb25zLmxlbmd0aCAmJiB0aGlzLmZpbHRlcmVkT3B0aW9uc1t0aGlzLmN1cnNvcl0uZGlzYWJsZWQpIHtcbiAgICAgIG91dHB1dC5wdXNoKGNvbG9yLnllbGxvdyh0aGlzLndhcm4pKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dC5qb2luKCcgJyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSByZXR1cm47XG4gICAgaWYgKHRoaXMuZmlyc3RSZW5kZXIpIHRoaXMub3V0LndyaXRlKGN1cnNvci5oaWRlKTtcbiAgICBzdXBlci5yZW5kZXIoKTtcblxuICAgIC8vIHByaW50IHByb21wdFxuXG4gICAgbGV0IHByb21wdCA9IFtcbiAgICAgIHN0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksXG4gICAgICBjb2xvci5ib2xkKHRoaXMubXNnKSxcbiAgICAgIHN0eWxlLmRlbGltaXRlcihmYWxzZSksXG4gICAgICB0aGlzLnJlbmRlckRvbmVPckluc3RydWN0aW9ucygpXG4gICAgXS5qb2luKCcgJyk7XG5cbiAgICBpZiAodGhpcy5zaG93TWluRXJyb3IpIHtcbiAgICAgIHByb21wdCArPSBjb2xvci5yZWQoYFlvdSBtdXN0IHNlbGVjdCBhIG1pbmltdW0gb2YgJHt0aGlzLm1pblNlbGVjdGVkfSBjaG9pY2VzLmApO1xuICAgICAgdGhpcy5zaG93TWluRXJyb3IgPSBmYWxzZTtcbiAgICB9XG4gICAgcHJvbXB0ICs9IHRoaXMucmVuZGVyT3B0aW9ucyh0aGlzLmZpbHRlcmVkT3B0aW9ucyk7XG5cbiAgICB0aGlzLm91dC53cml0ZSh0aGlzLmNsZWFyICsgcHJvbXB0KTtcbiAgICB0aGlzLmNsZWFyID0gY2xlYXIocHJvbXB0LCB0aGlzLm91dC5jb2x1bW5zKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dG9jb21wbGV0ZU11bHRpc2VsZWN0UHJvbXB0O1xuIiwiY29uc3QgY29sb3IgPSByZXF1aXJlKCdrbGV1cicpO1xuY29uc3QgUHJvbXB0ID0gcmVxdWlyZSgnLi9wcm9tcHQnKTtcbmNvbnN0IHsgc3R5bGUsIGNsZWFyIH0gPSByZXF1aXJlKCcuLi91dGlsJyk7XG5jb25zdCB7IGVyYXNlLCBjdXJzb3IgfSA9IHJlcXVpcmUoJ3Npc3RlcmFuc2knKTtcblxuLyoqXG4gKiBDb25maXJtUHJvbXB0IEJhc2UgRWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdHMubWVzc2FnZSBNZXNzYWdlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRzLmluaXRpYWxdIERlZmF1bHQgdmFsdWUgKHRydWUvZmFsc2UpXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW29wdHMuc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0cy55ZXNdIFRoZSBcIlllc1wiIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMueWVzT3B0aW9uXSBUaGUgXCJZZXNcIiBvcHRpb24gd2hlbiBjaG9vc2luZyBiZXR3ZWVuIHllcy9ub1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRzLm5vXSBUaGUgXCJOb1wiIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdHMubm9PcHRpb25dIFRoZSBcIk5vXCIgb3B0aW9uIHdoZW4gY2hvb3NpbmcgYmV0d2VlbiB5ZXMvbm9cbiAqL1xuY2xhc3MgQ29uZmlybVByb21wdCBleHRlbmRzIFByb21wdCB7XG4gIGNvbnN0cnVjdG9yKG9wdHM9e30pIHtcbiAgICBzdXBlcihvcHRzKTtcbiAgICB0aGlzLm1zZyA9IG9wdHMubWVzc2FnZTtcbiAgICB0aGlzLnZhbHVlID0gb3B0cy5pbml0aWFsO1xuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gISFvcHRzLmluaXRpYWw7XG4gICAgdGhpcy55ZXNNc2cgPSBvcHRzLnllcyB8fCAneWVzJztcbiAgICB0aGlzLnllc09wdGlvbiA9IG9wdHMueWVzT3B0aW9uIHx8ICcoWS9uKSc7XG4gICAgdGhpcy5ub01zZyA9IG9wdHMubm8gfHwgJ25vJztcbiAgICB0aGlzLm5vT3B0aW9uID0gb3B0cy5ub09wdGlvbiB8fCAnKHkvTiknO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5pbml0aWFsVmFsdWU7XG4gICAgdGhpcy5maXJlKCk7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5hYm9ydCgpO1xuICB9XG5cbiAgYWJvcnQoKSB7XG4gICAgdGhpcy5kb25lID0gdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBzdWJtaXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUgfHwgZmFsc2U7XG4gICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMub3V0LndyaXRlKCdcXG4nKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gIH1cblxuICBfKGMsIGtleSkge1xuICAgIGlmIChjLnRvTG93ZXJDYXNlKCkgPT09ICd5Jykge1xuICAgICAgdGhpcy52YWx1ZSA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcy5zdWJtaXQoKTtcbiAgICB9XG4gICAgaWYgKGMudG9Mb3dlckNhc2UoKSA9PT0gJ24nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcy5zdWJtaXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYmVsbCgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkgcmV0dXJuO1xuICAgIGlmICh0aGlzLmZpcnN0UmVuZGVyKSB0aGlzLm91dC53cml0ZShjdXJzb3IuaGlkZSk7XG4gICAgZWxzZSB0aGlzLm91dC53cml0ZShjbGVhcih0aGlzLm91dHB1dFRleHQsIHRoaXMub3V0LmNvbHVtbnMpKTtcbiAgICBzdXBlci5yZW5kZXIoKTtcblxuICAgIHRoaXMub3V0cHV0VGV4dCA9IFtcbiAgICAgIHN0eWxlLnN5bWJvbCh0aGlzLmRvbmUsIHRoaXMuYWJvcnRlZCksXG4gICAgICBjb2xvci5ib2xkKHRoaXMubXNnKSxcbiAgICAgIHN0eWxlLmRlbGltaXRlcih0aGlzLmRvbmUpLFxuICAgICAgdGhpcy5kb25lID8gKHRoaXMudmFsdWUgPyB0aGlzLnllc01zZyA6IHRoaXMubm9Nc2cpXG4gICAgICAgICAgOiBjb2xvci5ncmF5KHRoaXMuaW5pdGlhbFZhbHVlID8gdGhpcy55ZXNPcHRpb24gOiB0aGlzLm5vT3B0aW9uKVxuICAgIF0uam9pbignICcpO1xuXG4gICAgdGhpcy5vdXQud3JpdGUoZXJhc2UubGluZSArIGN1cnNvci50bygwKSArIHRoaXMub3V0cHV0VGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25maXJtUHJvbXB0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVGV4dFByb21wdDogcmVxdWlyZSgnLi90ZXh0JyksXG4gIFNlbGVjdFByb21wdDogcmVxdWlyZSgnLi9zZWxlY3QnKSxcbiAgVG9nZ2xlUHJvbXB0OiByZXF1aXJlKCcuL3RvZ2dsZScpLFxuICBEYXRlUHJvbXB0OiByZXF1aXJlKCcuL2RhdGUnKSxcbiAgTnVtYmVyUHJvbXB0OiByZXF1aXJlKCcuL251bWJlcicpLFxuICBNdWx0aXNlbGVjdFByb21wdDogcmVxdWlyZSgnLi9tdWx0aXNlbGVjdCcpLFxuICBBdXRvY29tcGxldGVQcm9tcHQ6IHJlcXVpcmUoJy4vYXV0b2NvbXBsZXRlJyksXG4gIEF1dG9jb21wbGV0ZU11bHRpc2VsZWN0UHJvbXB0OiByZXF1aXJlKCcuL2F1dG9jb21wbGV0ZU11bHRpc2VsZWN0JyksXG4gIENvbmZpcm1Qcm9tcHQ6IHJlcXVpcmUoJy4vY29uZmlybScpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgJCA9IGV4cG9ydHM7XG5jb25zdCBlbCA9IHJlcXVpcmUoJy4vZWxlbWVudHMnKTtcbmNvbnN0IG5vb3AgPSB2ID0+IHY7XG5cbmZ1bmN0aW9uIHRvUHJvbXB0KHR5cGUsIGFyZ3MsIG9wdHM9e30pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgZWxbdHlwZV0oYXJncyk7XG4gICAgY29uc3Qgb25BYm9ydCA9IG9wdHMub25BYm9ydCB8fCBub29wO1xuICAgIGNvbnN0IG9uU3VibWl0ID0gb3B0cy5vblN1Ym1pdCB8fCBub29wO1xuICAgIGNvbnN0IG9uRXhpdCA9IG9wdHMub25FeGl0IHx8IG5vb3A7XG4gICAgcC5vbignc3RhdGUnLCBhcmdzLm9uU3RhdGUgfHwgbm9vcCk7XG4gICAgcC5vbignc3VibWl0JywgeCA9PiByZXMob25TdWJtaXQoeCkpKTtcbiAgICBwLm9uKCdleGl0JywgeCA9PiByZXMob25FeGl0KHgpKSk7XG4gICAgcC5vbignYWJvcnQnLCB4ID0+IHJlaihvbkFib3J0KHgpKSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRleHQgcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5pbml0aWFsXSBEZWZhdWx0IHN0cmluZyB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLnN0eWxlPVwiZGVmYXVsdFwiXSBSZW5kZXIgc3R5bGUgKCdkZWZhdWx0JywgJ3Bhc3N3b3JkJywgJ2ludmlzaWJsZScpXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy5vblN0YXRlXSBPbiBzdGF0ZSBjaGFuZ2UgY2FsbGJhY2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLnZhbGlkYXRlXSBGdW5jdGlvbiB0byB2YWxpZGF0ZSB1c2VyIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLnRleHQgPSBhcmdzID0+IHRvUHJvbXB0KCdUZXh0UHJvbXB0JywgYXJncyk7XG5cbi8qKlxuICogUGFzc3dvcmQgcHJvbXB0IHdpdGggbWFza2VkIGlucHV0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5pbml0aWFsXSBEZWZhdWx0IHN0cmluZyB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdXNlciBpbnB1dFxuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuJC5wYXNzd29yZCA9IGFyZ3MgPT4ge1xuICBhcmdzLnN0eWxlID0gJ3Bhc3N3b3JkJztcbiAgcmV0dXJuICQudGV4dChhcmdzKTtcbn07XG5cbi8qKlxuICogUHJvbXB0IHdoZXJlIGlucHV0IGlzIGludmlzaWJsZSwgbGlrZSBzdWRvXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5pbml0aWFsXSBEZWZhdWx0IHN0cmluZyB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXJncy52YWxpZGF0ZV0gRnVuY3Rpb24gdG8gdmFsaWRhdGUgdXNlciBpbnB1dFxuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuJC5pbnZpc2libGUgPSBhcmdzID0+IHtcbiAgYXJncy5zdHlsZSA9ICdpbnZpc2libGUnO1xuICByZXR1cm4gJC50ZXh0KGFyZ3MpO1xufTtcblxuLyoqXG4gKiBOdW1iZXIgcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBhcmdzLmluaXRpYWwgRGVmYXVsdCBudW1iZXIgdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLm9uU3RhdGVdIE9uIHN0YXRlIGNoYW5nZSBjYWxsYmFja1xuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLm1heF0gTWF4IHZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubWluXSBNaW4gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5zdHlsZT1cImRlZmF1bHRcIl0gUmVuZGVyIHN0eWxlICgnZGVmYXVsdCcsICdwYXNzd29yZCcsICdpbnZpc2libGUnKVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5mbG9hdD1mYWxzZV0gUGFyc2UgaW5wdXQgYXMgZmxvYXRzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMucm91bmQ9Ml0gUm91bmQgZmxvYXRzIHRvIHggZGVjaW1hbHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbmNyZW1lbnQ9MV0gTnVtYmVyIHRvIGluY3JlbWVudCBieSB3aGVuIHVzaW5nIGFycm93LWtleXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLnZhbGlkYXRlXSBGdW5jdGlvbiB0byB2YWxpZGF0ZSB1c2VyIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLm51bWJlciA9IGFyZ3MgPT4gdG9Qcm9tcHQoJ051bWJlclByb21wdCcsIGFyZ3MpO1xuXG4vKipcbiAqIERhdGUgcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBhcmdzLmluaXRpYWwgRGVmYXVsdCBudW1iZXIgdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLm9uU3RhdGVdIE9uIHN0YXRlIGNoYW5nZSBjYWxsYmFja1xuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLm1heF0gTWF4IHZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MubWluXSBNaW4gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5zdHlsZT1cImRlZmF1bHRcIl0gUmVuZGVyIHN0eWxlICgnZGVmYXVsdCcsICdwYXNzd29yZCcsICdpbnZpc2libGUnKVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0cy5mbG9hdD1mYWxzZV0gUGFyc2UgaW5wdXQgYXMgZmxvYXRzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdHMucm91bmQ9Ml0gUm91bmQgZmxvYXRzIHRvIHggZGVjaW1hbHNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0cy5pbmNyZW1lbnQ9MV0gTnVtYmVyIHRvIGluY3JlbWVudCBieSB3aGVuIHVzaW5nIGFycm93LWtleXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLnZhbGlkYXRlXSBGdW5jdGlvbiB0byB2YWxpZGF0ZSB1c2VyIGlucHV0XG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLmRhdGUgPSBhcmdzID0+IHRvUHJvbXB0KCdEYXRlUHJvbXB0JywgYXJncyk7XG5cbi8qKlxuICogQ2xhc3NpYyB5ZXMvbm8gcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FyZ3MuaW5pdGlhbD1mYWxzZV0gRGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLmNvbmZpcm0gPSBhcmdzID0+IHRvUHJvbXB0KCdDb25maXJtUHJvbXB0JywgYXJncyk7XG5cbi8qKlxuICogTGlzdCBwcm9tcHQsIHNwbGl0IGludHB1dCBzdHJpbmcgYnkgYHNlcGVyYXRvcmBcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmluaXRpYWxdIERlZmF1bHQgc3RyaW5nIHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Muc3R5bGU9XCJkZWZhdWx0XCJdIFJlbmRlciBzdHlsZSAoJ2RlZmF1bHQnLCAncGFzc3dvcmQnLCAnaW52aXNpYmxlJylcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5zZXBhcmF0b3JdIFN0cmluZyBzZXBhcmF0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLm9uU3RhdGVdIE9uIHN0YXRlIGNoYW5nZSBjYWxsYmFja1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXQsIGluIGZvcm0gb2YgYW4gYEFycmF5YFxuICovXG4kLmxpc3QgPSBhcmdzID0+IHtcbiAgY29uc3Qgc2VwID0gYXJncy5zZXBhcmF0b3IgfHwgJywnO1xuICByZXR1cm4gdG9Qcm9tcHQoJ1RleHRQcm9tcHQnLCBhcmdzLCB7XG4gICAgb25TdWJtaXQ6IHN0ciA9PiBzdHIuc3BsaXQoc2VwKS5tYXAocyA9PiBzLnRyaW0oKSlcbiAgfSk7XG59O1xuXG4vKipcbiAqIFRvZ2dsZS9zd2l0Y2ggcHJvbXB0XG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5tZXNzYWdlIFByb21wdCBtZXNzYWdlIHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FyZ3MuaW5pdGlhbD1mYWxzZV0gRGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLmFjdGl2ZT1cIm9uXCJdIFRleHQgZm9yIGBhY3RpdmVgIHN0YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuaW5hY3RpdmU9XCJvZmZcIl0gVGV4dCBmb3IgYGluYWN0aXZlYCBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLnRvZ2dsZSA9IGFyZ3MgPT4gdG9Qcm9tcHQoJ1RvZ2dsZVByb21wdCcsIGFyZ3MpO1xuXG4vKipcbiAqIEludGVyYWN0aXZlIHNlbGVjdCBwcm9tcHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtBcnJheX0gYXJncy5jaG9pY2VzIEFycmF5IG9mIGNob2ljZXMgb2JqZWN0cyBgW3sgdGl0bGUsIHZhbHVlIH0sIC4uLl1gXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MuaW5pdGlhbF0gSW5kZXggb2YgZGVmYXVsdCB2YWx1ZVxuICogQHBhcmFtIHtTdHJpbmd9IFthcmdzLmhpbnRdIEhpbnQgdG8gZGlzcGxheVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLnNlbGVjdCA9IGFyZ3MgPT4gdG9Qcm9tcHQoJ1NlbGVjdFByb21wdCcsIGFyZ3MpO1xuXG4vKipcbiAqIEludGVyYWN0aXZlIG11bHRpLXNlbGVjdCAvIGF1dG9jb21wbGV0ZU11bHRpc2VsZWN0IHByb21wdFxuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MubWVzc2FnZSBQcm9tcHQgbWVzc2FnZSB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzLmNob2ljZXMgQXJyYXkgb2YgY2hvaWNlcyBvYmplY3RzIGBbeyB0aXRsZSwgdmFsdWUsIFtzZWxlY3RlZF0gfSwgLi4uXWBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5tYXhdIE1heCBzZWxlY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5oaW50XSBIaW50IHRvIGRpc3BsYXkgdXNlclxuICogQHBhcmFtIHtOdW1iZXJ9IFthcmdzLmN1cnNvcj0wXSBDdXJzb3Igc3RhcnQgcG9zaXRpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFthcmdzLm9uU3RhdGVdIE9uIHN0YXRlIGNoYW5nZSBjYWxsYmFja1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZGluXSBUaGUgUmVhZGFibGUgc3RyZWFtIHRvIGxpc3RlbiB0b1xuICogQHBhcmFtIHtTdHJlYW19IFthcmdzLnN0ZG91dF0gVGhlIFdyaXRhYmxlIHN0cmVhbSB0byB3cml0ZSByZWFkbGluZSBkYXRhIHRvXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB3aXRoIHVzZXIgaW5wdXRcbiAqL1xuJC5tdWx0aXNlbGVjdCA9IGFyZ3MgPT4ge1xuICBhcmdzLmNob2ljZXMgPSBbXS5jb25jYXQoYXJncy5jaG9pY2VzIHx8IFtdKTtcbiAgY29uc3QgdG9TZWxlY3RlZCA9IGl0ZW1zID0+IGl0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uc2VsZWN0ZWQpLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpO1xuICByZXR1cm4gdG9Qcm9tcHQoJ011bHRpc2VsZWN0UHJvbXB0JywgYXJncywge1xuICAgIG9uQWJvcnQ6IHRvU2VsZWN0ZWQsXG4gICAgb25TdWJtaXQ6IHRvU2VsZWN0ZWRcbiAgfSk7XG59O1xuXG4kLmF1dG9jb21wbGV0ZU11bHRpc2VsZWN0ID0gYXJncyA9PiB7XG4gIGFyZ3MuY2hvaWNlcyA9IFtdLmNvbmNhdChhcmdzLmNob2ljZXMgfHwgW10pO1xuICBjb25zdCB0b1NlbGVjdGVkID0gaXRlbXMgPT4gaXRlbXMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5zZWxlY3RlZCkubWFwKGl0ZW0gPT4gaXRlbS52YWx1ZSk7XG4gIHJldHVybiB0b1Byb21wdCgnQXV0b2NvbXBsZXRlTXVsdGlzZWxlY3RQcm9tcHQnLCBhcmdzLCB7XG4gICAgb25BYm9ydDogdG9TZWxlY3RlZCxcbiAgICBvblN1Ym1pdDogdG9TZWxlY3RlZFxuICB9KTtcbn07XG5cbmNvbnN0IGJ5VGl0bGUgPSAoaW5wdXQsIGNob2ljZXMpID0+IFByb21pc2UucmVzb2x2ZShcbiAgY2hvaWNlcy5maWx0ZXIoaXRlbSA9PiBpdGVtLnRpdGxlLnNsaWNlKDAsIGlucHV0Lmxlbmd0aCkudG9Mb3dlckNhc2UoKSA9PT0gaW5wdXQudG9Mb3dlckNhc2UoKSlcbik7XG5cbi8qKlxuICogSW50ZXJhY3RpdmUgYXV0by1jb21wbGV0ZSBwcm9tcHRcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLm1lc3NhZ2UgUHJvbXB0IG1lc3NhZ2UgdG8gZGlzcGxheVxuICogQHBhcmFtIHtBcnJheX0gYXJncy5jaG9pY2VzIEFycmF5IG9mIGF1dG8tY29tcGxldGUgY2hvaWNlcyBvYmplY3RzIGBbeyB0aXRsZSwgdmFsdWUgfSwgLi4uXWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFthcmdzLnN1Z2dlc3RdIEZ1bmN0aW9uIHRvIGZpbHRlciByZXN1bHRzIGJhc2VkIG9uIHVzZXIgaW5wdXQuIERlZmF1bHRzIHRvIHNvcnQgYnkgYHRpdGxlYFxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdzLmxpbWl0PTEwXSBNYXggbnVtYmVyIG9mIHJlc3VsdHMgdG8gc2hvd1xuICogQHBhcmFtIHtzdHJpbmd9IFthcmdzLnN0eWxlPVwiZGVmYXVsdFwiXSBSZW5kZXIgc3R5bGUgKCdkZWZhdWx0JywgJ3Bhc3N3b3JkJywgJ2ludmlzaWJsZScpXG4gKiBAcGFyYW0ge1N0cmluZ30gW2FyZ3MuaW5pdGlhbF0gSW5kZXggb2YgdGhlIGRlZmF1bHQgdmFsdWVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuY2xlYXJGaXJzdF0gVGhlIGZpcnN0IEVTQ0FQRSBrZXlwcmVzcyB3aWxsIGNsZWFyIHRoZSBpbnB1dFxuICogQHBhcmFtIHtTdHJpbmd9IFthcmdzLmZhbGxiYWNrXSBGYWxsYmFjayBtZXNzYWdlIC0gZGVmYXVsdHMgdG8gaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2FyZ3Mub25TdGF0ZV0gT24gc3RhdGUgY2hhbmdlIGNhbGxiYWNrXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3RkaW5dIFRoZSBSZWFkYWJsZSBzdHJlYW0gdG8gbGlzdGVuIHRvXG4gKiBAcGFyYW0ge1N0cmVhbX0gW2FyZ3Muc3Rkb3V0XSBUaGUgV3JpdGFibGUgc3RyZWFtIHRvIHdyaXRlIHJlYWRsaW5lIGRhdGEgdG9cbiAqIEByZXR1cm5zIHtQcm9taXNlfSBQcm9taXNlIHdpdGggdXNlciBpbnB1dFxuICovXG4kLmF1dG9jb21wbGV0ZSA9IGFyZ3MgPT4ge1xuICBhcmdzLnN1Z2dlc3QgPSBhcmdzLnN1Z2dlc3QgfHwgYnlUaXRsZTtcbiAgYXJncy5jaG9pY2VzID0gW10uY29uY2F0KGFyZ3MuY2hvaWNlcyB8fCBbXSk7XG4gIHJldHVybiB0b1Byb21wdCgnQXV0b2NvbXBsZXRlUHJvbXB0JywgYXJncyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwcm9tcHRzID0gcmVxdWlyZSgnLi9wcm9tcHRzJyk7XG5cbmNvbnN0IHBhc3NPbiA9IFsnc3VnZ2VzdCcsICdmb3JtYXQnLCAnb25TdGF0ZScsICd2YWxpZGF0ZScsICdvblJlbmRlcicsICd0eXBlJ107XG5jb25zdCBub29wID0gKCkgPT4ge307XG5cbi8qKlxuICogUHJvbXB0IGZvciBhIHNlcmllcyBvZiBxdWVzdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBxdWVzdGlvbnMgU2luZ2xlIHF1ZXN0aW9uIG9iamVjdCBvciBBcnJheSBvZiBxdWVzdGlvbiBvYmplY3RzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25TdWJtaXRdIENhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCBvbiBwcm9tcHQgc3VibWl0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25DYW5jZWxdIENhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCBvbiBjYW5jZWwvYWJvcnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB3aXRoIHZhbHVlcyBmcm9tIHVzZXIgaW5wdXRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHJvbXB0KHF1ZXN0aW9ucz1bXSwgeyBvblN1Ym1pdD1ub29wLCBvbkNhbmNlbD1ub29wIH09e30pIHtcbiAgY29uc3QgYW5zd2VycyA9IHt9O1xuICBjb25zdCBvdmVycmlkZSA9IHByb21wdC5fb3ZlcnJpZGUgfHwge307XG4gIHF1ZXN0aW9ucyA9IFtdLmNvbmNhdChxdWVzdGlvbnMpO1xuICBsZXQgYW5zd2VyLCBxdWVzdGlvbiwgcXVpdCwgbmFtZSwgdHlwZSwgbGFzdFByb21wdDtcblxuICBjb25zdCBnZXRGb3JtYXR0ZWRBbnN3ZXIgPSBhc3luYyAocXVlc3Rpb24sIGFuc3dlciwgc2tpcFZhbGlkYXRpb24gPSBmYWxzZSkgPT4ge1xuICAgIGlmICghc2tpcFZhbGlkYXRpb24gJiYgcXVlc3Rpb24udmFsaWRhdGUgJiYgcXVlc3Rpb24udmFsaWRhdGUoYW5zd2VyKSAhPT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gcXVlc3Rpb24uZm9ybWF0ID8gYXdhaXQgcXVlc3Rpb24uZm9ybWF0KGFuc3dlciwgYW5zd2VycykgOiBhbnN3ZXJcbiAgfTtcblxuICBmb3IgKHF1ZXN0aW9uIG9mIHF1ZXN0aW9ucykge1xuICAgICh7IG5hbWUsIHR5cGUgfSA9IHF1ZXN0aW9uKTtcblxuICAgIC8vIGV2YWx1YXRlIHR5cGUgZmlyc3QgYW5kIHNraXAgaWYgdHlwZSBpcyBhIGZhbHN5IHZhbHVlXG4gICAgaWYgKHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0eXBlID0gYXdhaXQgdHlwZShhbnN3ZXIsIHsgLi4uYW5zd2VycyB9LCBxdWVzdGlvbilcbiAgICAgIHF1ZXN0aW9uWyd0eXBlJ10gPSB0eXBlXG4gICAgfVxuICAgIGlmICghdHlwZSkgY29udGludWU7XG5cbiAgICAvLyBpZiBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgdW5sZXNzIGl0J3MgYSBzcGVjaWFsIGZ1bmN0aW9uXG4gICAgZm9yIChsZXQga2V5IGluIHF1ZXN0aW9uKSB7XG4gICAgICBpZiAocGFzc09uLmluY2x1ZGVzKGtleSkpIGNvbnRpbnVlO1xuICAgICAgbGV0IHZhbHVlID0gcXVlc3Rpb25ba2V5XTtcbiAgICAgIHF1ZXN0aW9uW2tleV0gPSB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgPyBhd2FpdCB2YWx1ZShhbnN3ZXIsIHsgLi4uYW5zd2VycyB9LCBsYXN0UHJvbXB0KSA6IHZhbHVlO1xuICAgIH1cblxuICAgIGxhc3RQcm9tcHQgPSBxdWVzdGlvbjtcblxuICAgIGlmICh0eXBlb2YgcXVlc3Rpb24ubWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHJvbXB0IG1lc3NhZ2UgaXMgcmVxdWlyZWQnKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdmFycyBpbiBjYXNlIHRoZXkgY2hhbmdlZFxuICAgICh7IG5hbWUsIHR5cGUgfSA9IHF1ZXN0aW9uKTtcblxuICAgIGlmIChwcm9tcHRzW3R5cGVdID09PSB2b2lkIDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcHJvbXB0IHR5cGUgKCR7dHlwZX0pIGlzIG5vdCBkZWZpbmVkYCk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJyaWRlW3F1ZXN0aW9uLm5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFuc3dlciA9IGF3YWl0IGdldEZvcm1hdHRlZEFuc3dlcihxdWVzdGlvbiwgb3ZlcnJpZGVbcXVlc3Rpb24ubmFtZV0pO1xuICAgICAgaWYgKGFuc3dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGFuc3dlcnNbbmFtZV0gPSBhbnN3ZXI7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBHZXQgdGhlIGluamVjdGVkIGFuc3dlciBpZiB0aGVyZSBpcyBvbmUgb3IgcHJvbXB0IHRoZSB1c2VyXG4gICAgICBhbnN3ZXIgPSBwcm9tcHQuX2luamVjdGVkID8gZ2V0SW5qZWN0ZWRBbnN3ZXIocHJvbXB0Ll9pbmplY3RlZCwgcXVlc3Rpb24uaW5pdGlhbCkgOiBhd2FpdCBwcm9tcHRzW3R5cGVdKHF1ZXN0aW9uKTtcbiAgICAgIGFuc3dlcnNbbmFtZV0gPSBhbnN3ZXIgPSBhd2FpdCBnZXRGb3JtYXR0ZWRBbnN3ZXIocXVlc3Rpb24sIGFuc3dlciwgdHJ1ZSk7XG4gICAgICBxdWl0ID0gYXdhaXQgb25TdWJtaXQocXVlc3Rpb24sIGFuc3dlciwgYW5zd2Vycyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBxdWl0ID0gIShhd2FpdCBvbkNhbmNlbChxdWVzdGlvbiwgYW5zd2VycykpO1xuICAgIH1cblxuICAgIGlmIChxdWl0KSByZXR1cm4gYW5zd2VycztcbiAgfVxuXG4gIHJldHVybiBhbnN3ZXJzO1xufVxuXG5mdW5jdGlvbiBnZXRJbmplY3RlZEFuc3dlcihpbmplY3RlZCwgZGVhZnVsdFZhbHVlKSB7XG4gIGNvbnN0IGFuc3dlciA9IGluamVjdGVkLnNoaWZ0KCk7XG4gICAgaWYgKGFuc3dlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB0aHJvdyBhbnN3ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIChhbnN3ZXIgPT09IHVuZGVmaW5lZCkgPyBkZWFmdWx0VmFsdWUgOiBhbnN3ZXI7XG59XG5cbmZ1bmN0aW9uIGluamVjdChhbnN3ZXJzKSB7XG4gIHByb21wdC5faW5qZWN0ZWQgPSAocHJvbXB0Ll9pbmplY3RlZCB8fCBbXSkuY29uY2F0KGFuc3dlcnMpO1xufVxuXG5mdW5jdGlvbiBvdmVycmlkZShhbnN3ZXJzKSB7XG4gIHByb21wdC5fb3ZlcnJpZGUgPSBPYmplY3QuYXNzaWduKHt9LCBhbnN3ZXJzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduKHByb21wdCwgeyBwcm9tcHQsIHByb21wdHMsIGluamVjdCwgb3ZlcnJpZGUgfSk7XG4iLCJmdW5jdGlvbiBpc05vZGVMVCh0YXIpIHtcbiAgdGFyID0gKEFycmF5LmlzQXJyYXkodGFyKSA/IHRhciA6IHRhci5zcGxpdCgnLicpKS5tYXAoTnVtYmVyKTtcbiAgbGV0IGk9MCwgc3JjPXByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpLm1hcChOdW1iZXIpO1xuICBmb3IgKDsgaSA8IHRhci5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzcmNbaV0gPiB0YXJbaV0pIHJldHVybiBmYWxzZTtcbiAgICBpZiAodGFyW2ldID4gc3JjW2ldKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID1cbiAgaXNOb2RlTFQoJzguNi4wJylcbiAgICA/IHJlcXVpcmUoJy4vZGlzdC9pbmRleC5qcycpXG4gICAgOiByZXF1aXJlKCcuL2xpYi9pbmRleC5qcycpO1xuIl0sIm5hbWVzIjpbImFjdGlvbiIsInN0cmlwIiwiYmVlcCIsImN1cnNvciIsImVyYXNlIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkiLCJfYXJyYXlMaWtlVG9BcnJheSIsInJlcXVpcmUkJDAiLCJfcmVxdWlyZSIsInJlcXVpcmUkJDEiLCJ3aWR0aCIsImNsZWFyIiwibWFpbiIsIndpbiIsImZpZ3VyZXMiLCJmaWd1cmVzXzEiLCJjIiwic3R5bGVzIiwicmVuZGVyIiwic3ltYm9scyIsInN5bWJvbCIsImRlbGltaXRlciIsIml0ZW0iLCJzdHlsZSIsImxpbmVzIiwid3JhcCIsImVudHJpZXNUb0Rpc3BsYXkiLCJ1dGlsIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVhZGxpbmUiLCJFdmVudEVtaXR0ZXIiLCJfcmVxdWlyZTIiLCJjb2xvciIsIlByb21wdCIsInByb21wdCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiVGV4dFByb21wdCIsInRleHQiLCJTZWxlY3RQcm9tcHQiLCJzZWxlY3QiLCJUb2dnbGVQcm9tcHQiLCJ0b2dnbGUiLCJEYXRlUGFydCIsImRhdGVwYXJ0IiwiTWVyaWRpZW0iLCJtZXJpZGllbSIsInBvcyIsIkRheSIsImRheSIsIkhvdXJzIiwiaG91cnMiLCJNaWxsaXNlY29uZHMiLCJtaWxsaXNlY29uZHMiLCJNaW51dGVzIiwibWludXRlcyIsIk1vbnRoIiwibW9udGgiLCJTZWNvbmRzIiwic2Vjb25kcyIsIlllYXIiLCJ5ZWFyIiwiZGF0ZXBhcnRzIiwicmVxdWlyZSQkOCIsInJlZ2V4IiwicmVnZXhHcm91cHMiLCJkZmx0TG9jYWxlcyIsIkRhdGVQcm9tcHQiLCJkYXRlIiwiaXNOdW1iZXIiLCJpc0RlZiIsInJvdW5kIiwiTnVtYmVyUHJvbXB0IiwibnVtYmVyIiwiTXVsdGlzZWxlY3RQcm9tcHQiLCJtdWx0aXNlbGVjdCIsImdldFZhbCIsImdldFRpdGxlIiwiZ2V0SW5kZXgiLCJBdXRvY29tcGxldGVQcm9tcHQiLCJhdXRvY29tcGxldGUiLCJBdXRvY29tcGxldGVNdWx0aXNlbGVjdFByb21wdCIsImF1dG9jb21wbGV0ZU11bHRpc2VsZWN0IiwiQ29uZmlybVByb21wdCIsImNvbmZpcm0iLCJlbGVtZW50cyIsInByb21wdHMiLCJwYXNzT24iLCJub29wIiwiZ2V0SW5qZWN0ZWRBbnN3ZXIiLCJpbmplY3QiLCJvdmVycmlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDL0Q7QUFDQSxNQUFNLENBQUMsR0FBRztBQUNWLENBQUMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxXQUFXLEtBQUssR0FBRztBQUN4RTtBQUNBO0FBQ0EsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDakIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDcEIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdkIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDckIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDcEIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDM0I7QUFDQTtBQUNBLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3BCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ2xCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3BCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3JCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3RCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3BCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25CO0FBQ0E7QUFDQSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN0QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNwQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN0QixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN2QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNyQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN4QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUNyQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN0QixDQUFDLENBQUM7QUFDRjtBQUNBLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDdkIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUM5QixDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0IsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2YsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQztBQUNsQixFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ25CLEVBQUUsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxL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S0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDNUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNsRCxFQUFFLFFBQVEsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2xELEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3BCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3BCLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEVBQUM7QUFDRDtBQUNBLE1BQU0sTUFBTSxHQUFHO0FBQ2YsRUFBRSxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUM1QyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlDLEVBQUM7QUFDRDtBQUNBLE1BQU1DLE9BQUssR0FBRztBQUNkLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQ3BCLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDN0MsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUM5QyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNsQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQixFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUN2QixFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDZixJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNuQixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUdELFFBQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM5RCxJQUFJLElBQUksS0FBSztBQUNiLE1BQU0sS0FBSyxJQUFJQSxRQUFNLENBQUMsSUFBSSxDQUFDO0FBQzNCLElBQUksT0FBTyxLQUFLLENBQUM7QUFDakIsR0FBRztBQUNILEVBQUM7QUFDRDtJQUNBLEdBQWMsR0FBRyxVQUFFQSxRQUFNLEVBQUUsTUFBTSxTQUFFQyxPQUFLLFFBQUVGLE1BQUksRUFBRTs7QUN2RGhELFNBQVNHLDRCQUEwQixDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBR0MsNkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLHVJQUF1SSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ3QrQjtBQUNBLFNBQVNBLDZCQUEyQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRSxPQUFPQyxtQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssV0FBVyxJQUFJLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPQSxtQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUNoYTtBQUNBLFNBQVNBLG1CQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtBQUNuTDtBQUNBLE1BQU1OLE9BQUssR0FBR08sT0FBa0IsQ0FBQztBQUNqQztBQUNBLE1BQU1DLFVBQVEsR0FBR0MsR0FBcUI7QUFDdEMsTUFBTU4sT0FBSyxHQUFHSyxVQUFRLENBQUMsS0FBSztBQUM1QixNQUFNTixRQUFNLEdBQUdNLFVBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0I7QUFDQSxNQUFNRSxPQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBR1YsT0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNBVyxPQUFjLEdBQUcsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzVDLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPUixPQUFLLENBQUMsSUFBSSxHQUFHRCxRQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsRUFBRSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDO0FBQ0EsRUFBRSxJQUFJLFNBQVMsR0FBR0UsNEJBQTBCLENBQUMsS0FBSyxDQUFDO0FBQ25ELE1BQU0sS0FBSyxDQUFDO0FBQ1o7QUFDQSxFQUFFLElBQUk7QUFDTixJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRztBQUN4RCxNQUFNLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDN0IsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQ00sT0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUNyRSxLQUFLO0FBQ0wsR0FBRyxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ2hCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixHQUFHLFNBQVM7QUFDWixJQUFJLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE9BQU9QLE9BQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsQ0FBQzs7QUN2Q0QsTUFBTVMsTUFBSSxHQUFHO0FBQ2IsRUFBRSxPQUFPLEVBQUUsR0FBRztBQUNkLEVBQUUsU0FBUyxFQUFFLEdBQUc7QUFDaEIsRUFBRSxTQUFTLEVBQUUsR0FBRztBQUNoQixFQUFFLFVBQVUsRUFBRSxHQUFHO0FBQ2pCLEVBQUUsT0FBTyxFQUFFLEdBQUc7QUFDZCxFQUFFLFFBQVEsRUFBRSxHQUFHO0FBQ2YsRUFBRSxJQUFJLEVBQUUsR0FBRztBQUNYLEVBQUUsS0FBSyxFQUFFLEdBQUc7QUFDWixFQUFFLFFBQVEsRUFBRSxHQUFHO0FBQ2YsRUFBRSxZQUFZLEVBQUUsR0FBRztBQUNuQixFQUFFLElBQUksRUFBRSxHQUFHO0FBQ1gsRUFBRSxPQUFPLEVBQUUsR0FBRztBQUNkLENBQUMsQ0FBQztBQUNGLE1BQU1DLEtBQUcsR0FBRztBQUNaLEVBQUUsT0FBTyxFQUFFRCxNQUFJLENBQUMsT0FBTztBQUN2QixFQUFFLFNBQVMsRUFBRUEsTUFBSSxDQUFDLFNBQVM7QUFDM0IsRUFBRSxTQUFTLEVBQUVBLE1BQUksQ0FBQyxTQUFTO0FBQzNCLEVBQUUsVUFBVSxFQUFFQSxNQUFJLENBQUMsVUFBVTtBQUM3QixFQUFFLE9BQU8sRUFBRSxLQUFLO0FBQ2hCLEVBQUUsUUFBUSxFQUFFLEtBQUs7QUFDakIsRUFBRSxJQUFJLEVBQUUsR0FBRztBQUNYLEVBQUUsS0FBSyxFQUFFLEdBQUc7QUFDWixFQUFFLFFBQVEsRUFBRSxLQUFLO0FBQ2pCLEVBQUUsWUFBWSxFQUFFLEdBQUc7QUFDbkIsRUFBRSxJQUFJLEVBQUUsR0FBRztBQUNYLEVBQUUsT0FBTyxFQUFFLEdBQUc7QUFDZCxDQUFDLENBQUM7QUFDRixNQUFNRSxTQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUdELEtBQUcsR0FBR0QsTUFBSSxDQUFDO0lBQzFERyxXQUFjLEdBQUdELFNBQU87O0FDN0J4QixNQUFNRSxHQUFDLEdBQUdULEtBQWdCLENBQUM7QUFDM0I7QUFDQSxNQUFNTyxTQUFPLEdBQUdMLFdBQW9CLENBQUM7QUFDckM7QUFDQTtBQUNBLE1BQU1RLFFBQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzdCLEVBQUUsUUFBUSxFQUFFO0FBQ1osSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLEtBQUssSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDN0MsR0FBRztBQUNILEVBQUUsS0FBSyxFQUFFO0FBQ1QsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDOUMsR0FBRztBQUNILEVBQUUsU0FBUyxFQUFFO0FBQ2IsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUNaLElBQUksTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFO0FBQ3ZCLEdBQUc7QUFDSCxFQUFFLE9BQU8sRUFBRTtBQUNYLElBQUksS0FBSyxFQUFFLENBQUM7QUFDWixJQUFJLE1BQU0sRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9CLEdBQUc7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUNIO0FBQ0EsTUFBTUMsUUFBTSxHQUFHLElBQUksSUFBSUQsUUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJQSxRQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3REO0FBQ0E7QUFDQSxNQUFNRSxTQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM5QixFQUFFLE9BQU8sRUFBRUgsR0FBQyxDQUFDLEdBQUcsQ0FBQ0YsU0FBTyxDQUFDLEtBQUssQ0FBQztBQUMvQixFQUFFLElBQUksRUFBRUUsR0FBQyxDQUFDLEtBQUssQ0FBQ0YsU0FBTyxDQUFDLElBQUksQ0FBQztBQUM3QixFQUFFLE1BQU0sRUFBRUUsR0FBQyxDQUFDLE1BQU0sQ0FBQ0YsU0FBTyxDQUFDLEtBQUssQ0FBQztBQUNqQyxFQUFFLE9BQU8sRUFBRUUsR0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNBLE1BQU1JLFFBQU0sR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxLQUFLLE9BQU8sR0FBR0QsU0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLEdBQUdBLFNBQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHQSxTQUFPLENBQUMsSUFBSSxHQUFHQSxTQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3RJO0FBQ0E7QUFDQSxNQUFNRSxXQUFTLEdBQUcsVUFBVSxJQUFJTCxHQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBR0YsU0FBTyxDQUFDLFFBQVEsR0FBR0EsU0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdGO0FBQ0EsTUFBTVEsTUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsS0FBS04sR0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxHQUFHRixTQUFPLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBR0EsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pIO0lBQ0FTLE9BQWMsR0FBRztBQUNqQixVQUFFTixRQUFNO0FBQ1IsVUFBRUMsUUFBTTtBQUNSLFdBQUVDLFNBQU87QUFDVCxVQUFFQyxRQUFNO0FBQ1IsYUFBRUMsV0FBUztBQUNYLFFBQUVDLE1BQUk7QUFDTixDQUFDOztBQ2hERCxNQUFNdEIsT0FBSyxHQUFHTyxPQUFrQixDQUFDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNBaUIsT0FBYyxHQUFHLFVBQVUsR0FBRyxFQUFFLE9BQU8sRUFBRTtBQUN6QyxFQUFFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQ3hCLE9BQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdEQsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNwQyxFQUFFLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQzs7QUNaRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUNBeUIsTUFBYyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLEtBQUs7QUFDckMsRUFBRSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNwSSxFQUFFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0IsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUs7QUFDdkYsSUFBSSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hKLElBQUksT0FBTyxHQUFHLENBQUM7QUFDZixHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuQyxDQUFDOztBQ2REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBQ0FDLGtCQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsS0FBSztBQUNoRCxFQUFFLFVBQVUsR0FBRyxVQUFVLElBQUksS0FBSyxDQUFDO0FBQ25DLEVBQUUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsVUFBVSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLEVBQUUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDckMsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUQsRUFBRSxPQUFPO0FBQ1QsSUFBSSxVQUFVO0FBQ2QsSUFBSSxRQUFRO0FBQ1osR0FBRyxDQUFDO0FBQ0osQ0FBQzs7SUNsQkRDLE1BQWMsR0FBRztBQUNqQixFQUFFLE1BQU0sRUFBRXBCLFFBQW1CO0FBQzdCLEVBQUUsS0FBSyxFQUFFRSxPQUFrQjtBQUMzQixFQUFFLEtBQUssRUFBRW1CLE9BQWtCO0FBQzNCLEVBQUUsS0FBSyxFQUFFQyxPQUFrQjtBQUMzQixFQUFFLE9BQU8sRUFBRUMsV0FBb0I7QUFDL0IsRUFBRSxLQUFLLEVBQUVDLE9BQWtCO0FBQzNCLEVBQUUsSUFBSSxFQUFFQyxNQUFpQjtBQUN6QixFQUFFLGdCQUFnQixFQUFFQyxrQkFBNkI7QUFDakQsQ0FBQzs7QUNURCxNQUFNQyxVQUFRLEdBQUcsVUFBbUIsQ0FBQztBQUNyQztBQUNBLE1BQU0xQixVQUFRLEdBQUdDLE1BQWtCO0FBQ25DLE1BQU1WLFFBQU0sR0FBR1MsVUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQjtBQUNBLE1BQU0yQixjQUFZLEdBQUcsVUFBaUIsQ0FBQztBQUN2QztBQUNBLE1BQU1DLFdBQVMsR0FBR1AsR0FBcUI7QUFDdkMsTUFBTTVCLE1BQUksR0FBR21DLFdBQVMsQ0FBQyxJQUFJO0FBQzNCLE1BQU1sQyxRQUFNLEdBQUdrQyxXQUFTLENBQUMsTUFBTSxDQUFDO0FBQ2hDO0FBQ0EsTUFBTUMsT0FBSyxHQUFHUCxLQUFnQixDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTVEsUUFBTSxTQUFTSCxjQUFZLENBQUM7QUFDbEMsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUN6QixJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ1osSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDN0M7QUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakU7QUFDQSxJQUFJLE1BQU0sRUFBRSxHQUFHRCxVQUFRLENBQUMsZUFBZSxDQUFDO0FBQ3hDLE1BQU0sS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ3BCLE1BQU0saUJBQWlCLEVBQUUsRUFBRTtBQUMzQixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUlBLFVBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxJQUFJLE1BQU0sUUFBUSxHQUFHLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDL0Y7QUFDQSxJQUFJLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSztBQUNuQyxNQUFNLElBQUksQ0FBQyxHQUFHbkMsUUFBTSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNwQztBQUNBLE1BQU0sSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxPQUFPLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDaEQsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsT0FBTyxNQUFNO0FBQ2IsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsT0FBTztBQUNQLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU07QUFDdkIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQ0csUUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RixNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDckMsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLE1BQU0sS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ3ZCLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTztBQUM3QixNQUFNLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDM0IsS0FBSyxDQUFDLENBQUM7QUFDUCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNELE1BQUksQ0FBQyxDQUFDO0FBQ3pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDb0MsT0FBSyxDQUFDLENBQUM7QUFDekIsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDbkQsR0FBRztBQUNIO0FBQ0EsQ0FBQztBQUNEO0lBQ0FFLFFBQWMsR0FBR0QsUUFBTTs7QUMvRXZCLFNBQVNFLG9CQUFrQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3pRO0FBQ0EsU0FBU0MsbUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxZQUFZLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUVELG9CQUFrQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRUEsb0JBQWtCLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNyWTtBQUNBLE1BQU1ILE9BQUssR0FBRzlCLEtBQWdCLENBQUM7QUFDL0I7QUFDQSxNQUFNK0IsUUFBTSxHQUFHN0IsUUFBbUIsQ0FBQztBQUNuQztBQUNBLE1BQU1ELFVBQVEsR0FBR29CLEdBQXFCO0FBQ3RDLE1BQU16QixPQUFLLEdBQUdLLFVBQVEsQ0FBQyxLQUFLO0FBQzVCLE1BQU1OLFFBQU0sR0FBR00sVUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQjtBQUNBLE1BQU00QixXQUFTLEdBQUdQLE1BQWtCO0FBQ3BDLE1BQU1OLE9BQUssR0FBR2EsV0FBUyxDQUFDLEtBQUs7QUFDN0IsTUFBTXpCLE9BQUssR0FBR3lCLFdBQVMsQ0FBQyxLQUFLO0FBQzdCLE1BQU1aLE9BQUssR0FBR1ksV0FBUyxDQUFDLEtBQUs7QUFDN0IsTUFBTXRCLFNBQU8sR0FBR3NCLFdBQVMsQ0FBQyxPQUFPLENBQUM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNTSxZQUFVLFNBQVNKLFFBQU0sQ0FBQztBQUNoQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ3pCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBR2YsT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ3RDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzVCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RDO0FBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQztBQUNuRDtBQUNBLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDL0QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pDLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDMUIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHWixPQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNmLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzVCLE1BQU0sSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDOUIsTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHMEIsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN0RSxLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQy9CLE1BQU0sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUc7QUFDZCxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2QixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssR0FBRztBQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUMxQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM1QyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN2QixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxRQUFRLEdBQUc7QUFDYixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyQjtBQUNBLElBQUksT0FBT0ksbUJBQWlCLENBQUMsYUFBYTtBQUMxQyxNQUFNLElBQUksS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckQ7QUFDQSxNQUFNLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUNyQyxRQUFRLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQy9CLFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN0QixPQUFPO0FBQ1A7QUFDQSxNQUFNLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDM0IsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUNULEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDdEI7QUFDQSxJQUFJLE9BQU9BLG1CQUFpQixDQUFDLGFBQWE7QUFDMUMsTUFBTSxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNwRCxNQUFNLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzlCLE1BQU0sTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM3QyxNQUFNLE1BQU0sTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzlCO0FBQ0EsTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDeEIsUUFBUSxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUMxQjtBQUNBLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3RCO0FBQ0EsUUFBUSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDeEI7QUFDQSxRQUFRLE9BQU87QUFDZixPQUFPO0FBQ1A7QUFDQSxNQUFNLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE1BQU0sTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDN0I7QUFDQSxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNwQjtBQUNBLE1BQU0sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCO0FBQ0EsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QjtBQUNBLE1BQU0sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3JCLEtBQUssQ0FBQyxFQUFFLENBQUM7QUFDVCxHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ3ZDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRTtBQUNoQixJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPO0FBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNsQyxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO0FBQzNCLEdBQUc7QUFDSDtBQUNBLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDWixJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDckIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuRCxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xELElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ3JCO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtBQUNoQyxNQUFNLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsYUFBYSxHQUFHO0FBQ2xCLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9DLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ3JCO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtBQUM5QixNQUFNLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzFCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLGVBQWUsR0FBRztBQUNwQixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUN0RSxHQUFHO0FBQ0g7QUFDQSxFQUFFLGFBQWEsR0FBRztBQUNsQixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hILEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUM1QjtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDM0IsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUN2QyxRQUFNLENBQUMsSUFBSSxDQUFDc0IsT0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBR2IsT0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ25KLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNBLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMvRCxLQUFLO0FBQ0w7QUFDQSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDWSxPQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFYyxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRWQsT0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBR2MsT0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0s7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQixNQUFNLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHdkIsU0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUV1QixPQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hKLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNsQyxPQUFLLENBQUMsSUFBSSxHQUFHRCxRQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUdBLFFBQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBR0EsUUFBTSxDQUFDLE9BQU8sR0FBR0EsUUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEosR0FBRztBQUNIO0FBQ0EsQ0FBQztBQUNEO0lBQ0F5QyxNQUFjLEdBQUdELFlBQVU7O0FDbFAzQixNQUFNTCxPQUFLLEdBQUc5QixLQUFnQixDQUFDO0FBQy9CO0FBQ0EsTUFBTStCLFFBQU0sR0FBRzdCLFFBQW1CLENBQUM7QUFDbkM7QUFDQSxNQUFNRCxVQUFRLEdBQUdvQixNQUFrQjtBQUNuQyxNQUFNTCxPQUFLLEdBQUdmLFVBQVEsQ0FBQyxLQUFLO0FBQzVCLE1BQU1HLE9BQUssR0FBR0gsVUFBUSxDQUFDLEtBQUs7QUFDNUIsTUFBTU0sU0FBTyxHQUFHTixVQUFRLENBQUMsT0FBTztBQUNoQyxNQUFNaUIsTUFBSSxHQUFHakIsVUFBUSxDQUFDLElBQUk7QUFDMUIsTUFBTWtCLGtCQUFnQixHQUFHbEIsVUFBUSxDQUFDLGdCQUFnQixDQUFDO0FBQ25EO0FBQ0EsTUFBTTRCLFdBQVMsR0FBR1AsR0FBcUI7QUFDdkMsTUFBTTNCLFFBQU0sR0FBR2tDLFdBQVMsQ0FBQyxNQUFNLENBQUM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNUSxjQUFZLFNBQVNOLFFBQU0sQ0FBQztBQUNsQyxFQUFFLFdBQVcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ3pCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzVCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLHFDQUFxQyxDQUFDO0FBQ25FLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLDJCQUEyQixDQUFDO0FBQ3pELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLO0FBQ2pELE1BQU0sSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUUsRUFBRSxHQUFHO0FBQ3ZDLFFBQVEsS0FBSyxFQUFFLEVBQUU7QUFDakIsUUFBUSxLQUFLLEVBQUUsR0FBRztBQUNsQixPQUFPLENBQUM7QUFDUixNQUFNLE9BQU87QUFDYixRQUFRLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUNqRCxRQUFRLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssS0FBSyxTQUFTLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDOUQsUUFBUSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXO0FBQ3pDLFFBQVEsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUTtBQUNuQyxRQUFRLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVE7QUFDbkMsT0FBTyxDQUFDO0FBQ1IsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxFQUFFLENBQUM7QUFDcEQsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQztBQUN6RCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUczQixPQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0FBQ2xDLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDdkIsTUFBTSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUMzQixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ25CLEtBQUssTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkIsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxFQUFFLEdBQUc7QUFDUCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDM0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQy9DLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2pELE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtBQUNaLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3hDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxTQUFTLEdBQUc7QUFDbEIsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUM1QixJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQ1QsUUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNTLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwSCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQjtBQUNBLElBQUksSUFBSSxpQkFBaUIsR0FBR2Usa0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ25HLFFBQVEsVUFBVSxHQUFHLGlCQUFpQixDQUFDLFVBQVU7QUFDakQsUUFBUSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDO0FBQzlDO0FBQ0E7QUFDQSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQ0gsT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRWMsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUVkLE9BQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBR2MsT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUdBLE9BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BPO0FBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUNwQixNQUFNLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDO0FBQzlCO0FBQ0EsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2xELFFBQVEsSUFBSSxLQUFLO0FBQ2pCLFlBQVksTUFBTTtBQUNsQixZQUFZLElBQUksR0FBRyxFQUFFO0FBQ3JCLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEM7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLFVBQVUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQ2hELFVBQVUsTUFBTSxHQUFHdkIsU0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNuQyxTQUFTLE1BQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDekUsVUFBVSxNQUFNLEdBQUdBLFNBQU8sQ0FBQyxTQUFTLENBQUM7QUFDckMsU0FBUyxNQUFNO0FBQ2YsVUFBVSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ3ZCLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO0FBQ3hCLFVBQVUsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHdUIsT0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUdBLE9BQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVHLFVBQVUsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUdBLE9BQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUN2QixTQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUM7QUFDbEcsU0FBUyxNQUFNO0FBQ2YsVUFBVSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUd1QixPQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ2hGLFVBQVUsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUdBLE9BQUssQ0FBQyxJQUFJLENBQUN2QixTQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxNQUFNLENBQUM7QUFDM0Y7QUFDQSxVQUFVLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNsRCxZQUFZLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN6QztBQUNBLFlBQVksSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQzNILGNBQWMsSUFBSSxHQUFHLElBQUksR0FBR1csTUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDaEQsZ0JBQWdCLE1BQU0sRUFBRSxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPO0FBQ3ZDLGVBQWUsQ0FBQyxDQUFDO0FBQ2pCLGFBQWE7QUFDYixXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFWSxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxHQUFHO0FBQ0g7QUFDQSxDQUFDO0FBQ0Q7SUFDQVEsUUFBYyxHQUFHRCxjQUFZOztBQzNMN0IsTUFBTVAsT0FBSyxHQUFHOUIsS0FBZ0IsQ0FBQztBQUMvQjtBQUNBLE1BQU0rQixRQUFNLEdBQUc3QixRQUFtQixDQUFDO0FBQ25DO0FBQ0EsTUFBTUQsVUFBUSxHQUFHb0IsTUFBa0I7QUFDbkMsTUFBTUwsT0FBSyxHQUFHZixVQUFRLENBQUMsS0FBSztBQUM1QixNQUFNRyxPQUFLLEdBQUdILFVBQVEsQ0FBQyxLQUFLLENBQUM7QUFDN0I7QUFDQSxNQUFNNEIsV0FBUyxHQUFHUCxHQUFxQjtBQUN2QyxNQUFNM0IsUUFBTSxHQUFHa0MsV0FBUyxDQUFDLE1BQU07QUFDL0IsTUFBTWpDLE9BQUssR0FBR2lDLFdBQVMsQ0FBQyxLQUFLLENBQUM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTVUsY0FBWSxTQUFTUixRQUFNLENBQUM7QUFDbEMsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRTtBQUN6QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO0FBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssR0FBRztBQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ25DLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLEdBQUc7QUFDSDtBQUNBLEVBQUUsVUFBVSxHQUFHO0FBQ2YsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pELElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxRQUFRLEdBQUc7QUFDYixJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEQsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN0QixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNwQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsRUFBRSxHQUFHO0FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzdCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDWixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNuQixNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQy9CLEtBQUssTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDMUIsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN4QixLQUFLLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQzFCLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDekIsS0FBSyxNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCO0FBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPO0FBQzVCLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDcEMsUUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNTLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNwSCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQixJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQ1ksT0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRWMsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUVkLE9BQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBR2MsT0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUVBLE9BQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBR0EsT0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDbEMsT0FBSyxDQUFDLElBQUksR0FB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QUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUN2QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVELElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JELElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUM1QjtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDM0IsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUN2QyxRQUFNLENBQUMsSUFBSSxDQUFDc0IsT0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBR2IsT0FBSyxDQUFDLElBQUksQ0FBQyxX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Q0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRCxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxhQUFhLEdB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QUN6QyxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLO0FBQ25DLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsSUFBSSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUN6QyxJQUFJLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO0FBQzNDLElBQUksTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7QUFDdkMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQ3hDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLEdBQUcsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSTtBQUNyQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO0FBQzFCLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLENBQUMsQ0FBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJO0FBQ3RCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7QUFDM0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxRQUFRLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksSUFBSSxRQUFRLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUk7QUFDakIsRUFBRSxNQUFNLEdBQUcs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QUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1SUFBdUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGdCQUFnQixHQUFHLElBQUksRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUN0K0I7QUFDQSxTQUFTLDJCQUEyQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRSxPQUFPLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxXQUFXLElBQUksMENBQTBDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUU7QUFDaGE7QUFDQSxTQUFTLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtBQUNuTDtBQUNBLFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDelE7QUFDQSxTQUFTLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sWUFBWSxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FB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QUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdEIsTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztBQUN0QixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsTUFBTSxHQUFHO0FBQ1gsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUM1QixJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQ1QsUUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RELFNBQVMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNTLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNsRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQjtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHO0FBQ3RCLE1BQU1ZLE9BQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNDLE1BQU1jLE9BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixNQUFNZCxPQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUM1QixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUdjLE9BQUssQ0FB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SSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQzFCLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDdkMsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkQsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDcEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUQsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNwRCxNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM1QixLQUFLO0FBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM5QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFO0FBQ1osSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMzQztBQUNBLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQUksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuRCxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEI7QUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEM7QUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckQsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckQsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPO0FBQzVCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDM0IsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXO0FBQzFCLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNuQyxRQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUdTLE9BQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMvSCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDQSxPQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0QsS0FBSztBQUNMLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDMUI7QUFDQTtBQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRztBQUN0QixNQUFNWSxPQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQyxNQUFNYyxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDMUIsTUFBTWQsT0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDckQsWUFBWWMsT0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVE7QUFDeEUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEI7QUFDQTtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3BCLE1BQU0sSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25ELFdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHdkIsU0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUV1QixPQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZHLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNsQyxPQUFLLENBQUMsSUFBSSxHQUFHRCxRQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUdBLFFBQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBR0EsUUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xILEdBQUc7QUFDSCxDQUFDO0FBQ0Q7SUFDQSxNQUFjLEdBQUcsWUFBWTs7QUNsTjdCLE1BQU1tQyxPQUFLLEdBQUc5QixLQUFnQixDQUFDO0FBQy9CLE1BQU0sVUFBRUwsUUFBTSxFQUFFLEdBQUdPLEdBQXFCLENBQUM7QUFDekMsTUFBTTZCLFFBQU0sR0FBR1YsUUFBbUIsQ0FBQztBQUNuQyxNQUFNLFNBQUVqQixPQUFLLFdBQUVHLFNBQU8sU0FBRVMsT0FBSyxRQUFFRSxNQUFJLG9CQUFFQyxrQkFBZ0IsRUFBRSxHQUFHRyxJQUFrQixDQUFDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNa0QsbUJBQWlCLFNBQVN6QyxRQUFNLENBQUM7QUFDdkMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN2QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDbkMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQ3hDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUNoQyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSw2QkFBNkIsQ0FBQztBQUMzRCxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNoQyxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzlCLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQzFDLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQztBQUNwRCxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLO0FBQy9DLE1BQU0sSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRO0FBQ2hDLFFBQVEsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckMsTUFBTSxPQUFPO0FBQ2IsUUFBUSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDakQsUUFBUSxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXO0FBQ3pDLFFBQVEsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztBQUM5RCxRQUFRLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVE7QUFDbkMsUUFBUSxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRO0FBQ25DLE9BQU8sQ0FBQztBQUNSLEtBQUssQ0FBQyxDQUFDO0FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHM0IsT0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDOUIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLFFBQVEsR0FBRztBQUNiLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUs7QUFDL0IsT0FBTyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDaEUsTUFBTSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUMvQixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQixLQUFLLE1BQU07QUFDWCxNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLE1BQU0sSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFDM0IsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxLQUFLLEdBQUc7QUFDVixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0gsRUFBRSxJQUFJLEdBQUc7QUFDVCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN4RCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEVBQUUsR0FBRztBQUNQLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQixNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzFDLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMvQyxNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLEtBQUs7QUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLElBQUksR0FBRztBQUNULElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssR0FBRztBQUNWLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUM1QyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNsQixHQUFHO0FBQ0g7QUFDQSxFQUFFLGlCQUFpQixHQUFHO0FBQ3RCLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdEM7QUFDQSxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUNwQixNQUFNLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUMzRixNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pCLEtBQUssTUFBTTtBQUNYLE1BQU0sQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsU0FBUyxHQUFHO0FBQ2QsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUMzRSxNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pCLEtBQUs7QUFDTDtBQUNBLElBQUksTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDMUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQy9FLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDWixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtBQUNuQixNQUFNLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQy9CLEtBQUssTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDMUIsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDdkIsS0FBSyxNQUFNO0FBQ1gsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6QixLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0EsRUFBRSxrQkFBa0IsR0FBRztBQUN2QixJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUM5RCxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsWUFBWSxLQUFLLFFBQVEsRUFBRTtBQUNqRCxRQUFRLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztBQUNqQyxPQUFPO0FBQ1AsTUFBTSxPQUFPLG1CQUFtQjtBQUNoQyxVQUFVLENBQUMsSUFBSSxFQUFFRyxTQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRUEsU0FBTyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztBQUMzRSxVQUFVLENBQUMsSUFBSSxFQUFFQSxTQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRUEsU0FBTyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQztBQUN0RixXQUFXLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxHQUFHLENBQUMsbUJBQW1CLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEUsVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDOUMsS0FBSztBQUNMLElBQUksT0FBTyxFQUFFLENBQUM7QUFDZCxHQUFHO0FBQ0g7QUFDQSxFQUFFLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUU7QUFDN0MsSUFBSSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUd1QixPQUFLLENBQUMsS0FBSyxDQUFDdkIsU0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHQSxTQUFPLENBQUMsUUFBUSxJQUFJLEdBQUcsR0FBRyxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQy9HLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxDQUFDO0FBQ3BCO0FBQ0EsSUFBSSxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDcEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBR3VCLE9BQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHQSxPQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRyxLQUFLLE1BQU07QUFDWCxNQUFNLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHQSxPQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZFLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDekMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDckMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTztBQUMxRSxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEQsVUFBVSxJQUFJLEdBQUcsSUFBSSxHQUFHWixNQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDaEcsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxJQUFJLE9BQU8sTUFBTSxHQUFHLEtBQUssR0FBR1ksT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbkQsR0FBRztBQUNIO0FBQ0E7QUFDQSxFQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUU7QUFDM0IsSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzlCLE1BQU0sT0FBT0EsT0FBSyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3JELEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBR1gsa0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RyxJQUFJLElBQUksTUFBTSxFQUFFLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDbkM7QUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsTUFBTSxJQUFJLENBQUMsS0FBSyxVQUFVLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtBQUM5QyxRQUFRLE1BQU0sR0FBR1osU0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNqQyxPQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssUUFBUSxHQUFHLENBQUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsRSxRQUFRLE1BQU0sR0FBR0EsU0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNuQyxPQUFPLE1BQU07QUFDYixRQUFRLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDckIsT0FBTztBQUNQLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxHQUFHO0FBQ0g7QUFDQTtBQUNBLEVBQUUsYUFBYSxDQUFDLE9BQU8sRUFBRTtBQUN6QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3BCLE1BQU0sT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLEtBQUs7QUFDTCxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsR0FBRztBQUNIO0FBQ0EsRUFBRSx3QkFBd0IsR0FBRztBQUM3QixJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtBQUNuQixNQUFNLE9BQU8sSUFBSSxDQUFDLEtBQUs7QUFDdkIsU0FBUyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDaEMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDMUIsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsS0FBSztBQUNMO0FBQ0EsSUFBSSxNQUFNLE1BQU0sR0FBRyxDQUFDdUIsT0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztBQUN0RTtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDMUMsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDQSxPQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNDLEtBQUs7QUFDTCxJQUFJLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDNUIsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUNuQyxRQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEQsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkI7QUFDQTtBQUNBLElBQUksSUFBSSxNQUFNLEdBQUc7QUFDakIsTUFBTXFCLE9BQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNDLE1BQU1jLE9BQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixNQUFNZCxPQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUM1QixNQUFNLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQzNCLE1BQU0sTUFBTSxJQUFJYyxPQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLE1BQU0sSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDaEMsS0FBSztBQUNMLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRzFCLE9BQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRCxHQUFHO0FBQ0gsQ0FBQztBQUNEO0lBQ0EsV0FBYyxHQUFHb0UsbUJBQWlCOztBQzVRbEMsTUFBTTFDLE9BQUssR0FBRzlCLEtBQWdCLENBQUM7QUFDL0IsTUFBTStCLFFBQU0sR0FBRzdCLFFBQW1CLENBQUM7QUFDbkMsTUFBTSxTQUFFTixPQUFLLFVBQUVELFFBQU0sRUFBRSxHQUFHMEIsR0FBcUIsQ0FBQztBQUNoRCxNQUFNLFNBQUVMLE9BQUssU0FBRVosT0FBSyxXQUFFRyxTQUFPLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEdBQUdlLElBQWtCLENBQUM7QUFDN0U7QUFDQSxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RSxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRixNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUs7QUFDdEMsRUFBRSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLFVBQVUsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDO0FBQ3hGLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxrQkFBa0IsU0FBU1MsUUFBTSxDQUFDO0FBQ3hDLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdkIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRO0FBQ25ELFFBQVEsSUFBSSxDQUFDLE9BQU87QUFDcEIsUUFBUSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7QUFDbkQsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUNwRSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ2xELElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztBQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ2xDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHZixPQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDdEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUdaLE9BQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO0FBQ25CLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEUsR0FBRztBQUNIO0FBQ0EsRUFBRSxJQUFJLFFBQVEsR0FBRztBQUNqQixJQUFJLElBQUksTUFBTSxDQUFDO0FBQ2YsSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUTtBQUN6QyxNQUFNLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsSUFBSSxPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDaEUsR0FBRztBQUNIO0FBQ0EsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUM7QUFDbkMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9DLFNBQVMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMxQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNyQixJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3pFLElBQUksTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDaEM7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUUsT0FBTztBQUN0QyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVztBQUNsQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUcsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUM1QixJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzlDO0FBQ0EsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7QUFDZixHQUFHO0FBQ0g7QUFDQSxFQUFFLEtBQUssR0FBRztBQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07QUFDeEIsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsRSxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQixLQUFLLENBQUMsQ0FBQztBQUNQLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxHQUFHO0FBQ1QsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2xELE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ25CLEtBQUssTUFBTTtBQUNYLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNyQyxNQUFNLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQzNCLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2xCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0IsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbkIsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBLEVBQUUsS0FBSyxHQUFHO0FBQ1YsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQixHQUFHO0FBQ0g7QUFDQSxFQUFFLE1BQU0sR0FBRztBQUNYLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDckIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3ZDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0EsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtBQUNaLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzlCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0EsRUFBRSxNQUFNLEdBQUc7QUFDWCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxD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QUFJLENBQUM7QUFDM0MsSUFBSSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztBQUN2QyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUM7QUFDeEMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsR0FBRyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUk7QUFDckIsRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztBQUMxQixFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixDQUFDLENBQUM7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUk7QUFDdEIsRUFBRSxJQUFJLENBQUMs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
