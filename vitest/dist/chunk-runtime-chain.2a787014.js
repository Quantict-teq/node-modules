import require$$0, { format as format$1 } from 'util';
import { i as isObject, t as toArray, n as noop, a as assertTypes } from './chunk-utils-base.68f100c1.js';
import { isMockFunction, spyOn, fn, spies } from './jest-mock.js';
import { p as parseStacktrace } from './chunk-utils-source-map.38ddd54e.js';
import { c as commonjsGlobal, g as getDefaultExportFromCjs } from './vendor-_commonjsHelpers.91d4f591.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function createChainable(keys, fn) {
  function create(obj) {
    const chain2 = function(...args) {
      return fn.apply(obj, args);
    };
    for (const key of keys) {
      Object.defineProperty(chain2, key, {
        get() {
          return create(__spreadProps(__spreadValues({}, obj), { [key]: true }));
        }
      });
    }
    return chain2;
  }
  const chain = create({});
  chain.fn = fn;
  return chain;
}

const context = {
  tasks: [],
  currentSuite: null
};
function collectTask(task) {
  var _a;
  (_a = context.currentSuite) == null ? void 0 : _a.tasks.push(task);
}
async function runWithSuite(suite, fn) {
  const prev = context.currentSuite;
  context.currentSuite = suite;
  await fn();
  context.currentSuite = prev;
}
function getDefaultTestTimeout() {
  return __vitest_worker__.config.testTimeout;
}
function getDefaultHookTimeout() {
  return __vitest_worker__.config.hookTimeout;
}
function withTimeout(fn, timeout = getDefaultTestTimeout(), isHook = false) {
  if (timeout <= 0 || timeout === Infinity)
    return fn;
  return (...args) => {
    return Promise.race([fn(...args), new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error(makeTimeoutMsg(isHook, timeout)));
      }, timeout);
      timer.unref();
    })]);
  };
}
function makeTimeoutMsg(isHook, timeout) {
  return `${isHook ? "Hook" : "Test"} timed out in ${timeout}ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "${isHook ? "hookTimeout" : "testTimeout"}".`;
}
function ensureAsyncTest(fn) {
  if (!fn.length)
    return fn;
  return () => new Promise((resolve, reject) => {
    const done = (...args) => args[0] ? reject(args[0]) : resolve();
    fn(done);
  });
}
function normalizeTest(fn, timeout) {
  return withTimeout(ensureAsyncTest(fn), timeout);
}

const fnMap = new WeakMap();
const hooksMap = new WeakMap();
function setFn(key, fn) {
  fnMap.set(key, fn);
}
function getFn(key) {
  return fnMap.get(key);
}
function setHooks(key, hooks) {
  hooksMap.set(key, hooks);
}
function getHooks(key) {
  return hooksMap.get(key);
}

const suite = createSuite();
const test$7 = createTest(function(name, fn, timeout) {
  getCurrentSuite().test.fn.call(this, name, fn, timeout);
});
function formatTitle(template, items) {
  const count = template.split("%").length - 1;
  let formatted = format$1(template, ...items.slice(0, count));
  if (isObject(items[0])) {
    formatted = formatted.replace(/\$([$\w_]+)/g, (_, key) => {
      return items[0][key];
    });
  }
  return formatted;
}
const describe = suite;
const it = test$7;
const defaultSuite = suite("");
function clearContext() {
  context.tasks.length = 0;
  defaultSuite.clear();
  context.currentSuite = defaultSuite;
}
function getCurrentSuite() {
  return context.currentSuite || defaultSuite;
}
function createSuiteHooks() {
  return {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  };
}
function createSuiteCollector(name, factory = () => {
}, mode, concurrent) {
  const tasks = [];
  const factoryQueue = [];
  let suite2;
  initSuite();
  const test2 = createTest(function(name2, fn, timeout) {
    const mode2 = this.only ? "only" : this.skip ? "skip" : this.todo ? "todo" : "run";
    const test3 = {
      id: "",
      type: "test",
      name: name2,
      mode: mode2,
      suite: void 0,
      fails: this.fails
    };
    if (this.concurrent || concurrent)
      test3.concurrent = true;
    setFn(test3, normalizeTest(fn || noop, timeout));
    tasks.push(test3);
  });
  const collector = {
    type: "collector",
    name,
    mode,
    test: test2,
    tasks,
    collect,
    clear,
    on: addHook
  };
  function addHook(name2, ...fn) {
    getHooks(suite2)[name2].push(...fn);
  }
  function initSuite() {
    suite2 = {
      id: "",
      type: "suite",
      name,
      mode,
      tasks: []
    };
    setHooks(suite2, createSuiteHooks());
  }
  function clear() {
    tasks.length = 0;
    factoryQueue.length = 0;
    initSuite();
  }
  async function collect(file) {
    factoryQueue.length = 0;
    if (factory)
      await runWithSuite(collector, () => factory(test2));
    const allChildren = [];
    for (const i of [...factoryQueue, ...tasks])
      allChildren.push(i.type === "collector" ? await i.collect(file) : i);
    suite2.file = file;
    suite2.tasks = allChildren;
    allChildren.forEach((task) => {
      task.suite = suite2;
      if (file)
        task.file = file;
    });
    return suite2;
  }
  collectTask(collector);
  return collector;
}
function createSuite() {
  const suite2 = createChainable(["concurrent", "skip", "only", "todo"], function(name, factory) {
    const mode = this.only ? "only" : this.skip ? "skip" : this.todo ? "todo" : "run";
    return createSuiteCollector(name, factory, mode, this.concurrent);
  });
  suite2.each = (cases) => {
    return (name, fn) => {
      cases.forEach((i) => {
        const items = toArray(i);
        suite2(formatTitle(name, items), () => fn(...items));
      });
    };
  };
  return suite2;
}
function createTest(fn) {
  const test2 = createChainable(["concurrent", "skip", "only", "todo", "fails"], fn);
  test2.each = (cases) => {
    return (name, fn2) => {
      cases.forEach((i) => {
        const items = toArray(i);
        test2(formatTitle(name, items), () => fn2(...items));
      });
    };
  };
  return test2;
}

var build = {};

var ansiStyles = {exports: {}};

(function (module) {

const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			overline: [53, 55],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value: (red, green, blue) => {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16 +
					(36 * Math.round(red / 255 * 5)) +
					(6 * Math.round(green / 255 * 5)) +
					Math.round(blue / 255 * 5);
			},
			enumerable: false
		},
		hexToRgb: {
			value: hex => {
				const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let {colorString} = matches.groups;

				if (colorString.length === 3) {
					colorString = colorString.split('').map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF
				];
			},
			enumerable: false
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false
		}
	});

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});
}(ansiStyles));

var collections = {};

Object.defineProperty(collections, '__esModule', {
  value: true
});
collections.printIteratorEntries = printIteratorEntries;
collections.printIteratorValues = printIteratorValues;
collections.printListItems = printListItems;
collections.printObjectProperties = printObjectProperties;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const getKeysOfEnumerableProperties = (object, compareKeys) => {
  const keys = Object.keys(object).sort(compareKeys);

  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(object).forEach(symbol => {
      if (Object.getOwnPropertyDescriptor(object, symbol).enumerable) {
        keys.push(symbol);
      }
    });
  }

  return keys;
};
/**
 * Return entries (for example, of a map)
 * with spacing, indentation, and comma
 * without surrounding punctuation (for example, braces)
 */

function printIteratorEntries(
  iterator,
  config,
  indentation,
  depth,
  refs,
  printer, // Too bad, so sad that separator for ECMAScript Map has been ' => '
  // What a distracting diff if you change a data structure to/from
  // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
  separator = ': '
) {
  let result = '';
  let current = iterator.next();

  if (!current.done) {
    result += config.spacingOuter;
    const indentationNext = indentation + config.indent;

    while (!current.done) {
      const name = printer(
        current.value[0],
        config,
        indentationNext,
        depth,
        refs
      );
      const value = printer(
        current.value[1],
        config,
        indentationNext,
        depth,
        refs
      );
      result += indentationNext + name + separator + value;
      current = iterator.next();

      if (!current.done) {
        result += ',' + config.spacingInner;
      } else if (!config.min) {
        result += ',';
      }
    }

    result += config.spacingOuter + indentation;
  }

  return result;
}
/**
 * Return values (for example, of a set)
 * with spacing, indentation, and comma
 * without surrounding punctuation (braces or brackets)
 */

function printIteratorValues(
  iterator,
  config,
  indentation,
  depth,
  refs,
  printer
) {
  let result = '';
  let current = iterator.next();

  if (!current.done) {
    result += config.spacingOuter;
    const indentationNext = indentation + config.indent;

    while (!current.done) {
      result +=
        indentationNext +
        printer(current.value, config, indentationNext, depth, refs);
      current = iterator.next();

      if (!current.done) {
        result += ',' + config.spacingInner;
      } else if (!config.min) {
        result += ',';
      }
    }

    result += config.spacingOuter + indentation;
  }

  return result;
}
/**
 * Return items (for example, of an array)
 * with spacing, indentation, and comma
 * without surrounding punctuation (for example, brackets)
 **/

function printListItems(list, config, indentation, depth, refs, printer) {
  let result = '';

  if (list.length) {
    result += config.spacingOuter;
    const indentationNext = indentation + config.indent;

    for (let i = 0; i < list.length; i++) {
      result += indentationNext;

      if (i in list) {
        result += printer(list[i], config, indentationNext, depth, refs);
      }

      if (i < list.length - 1) {
        result += ',' + config.spacingInner;
      } else if (!config.min) {
        result += ',';
      }
    }

    result += config.spacingOuter + indentation;
  }

  return result;
}
/**
 * Return properties of an object
 * with spacing, indentation, and comma
 * without surrounding punctuation (for example, braces)
 */

function printObjectProperties(val, config, indentation, depth, refs, printer) {
  let result = '';
  const keys = getKeysOfEnumerableProperties(val, config.compareKeys);

  if (keys.length) {
    result += config.spacingOuter;
    const indentationNext = indentation + config.indent;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const name = printer(key, config, indentationNext, depth, refs);
      const value = printer(val[key], config, indentationNext, depth, refs);
      result += indentationNext + name + ': ' + value;

      if (i < keys.length - 1) {
        result += ',' + config.spacingInner;
      } else if (!config.min) {
        result += ',';
      }
    }

    result += config.spacingOuter + indentation;
  }

  return result;
}

var AsymmetricMatcher$1 = {};

Object.defineProperty(AsymmetricMatcher$1, '__esModule', {
  value: true
});
AsymmetricMatcher$1.test = AsymmetricMatcher$1.serialize = AsymmetricMatcher$1.default = void 0;

var _collections$3 = collections;

var global$3 = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global$3 !== 'undefined') {
    return global$3;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol$2 = global$3['jest-symbol-do-not-touch'] || global$3.Symbol;
const asymmetricMatcher =
  typeof Symbol$2 === 'function' && Symbol$2.for
    ? Symbol$2.for('jest.asymmetricMatcher')
    : 0x1357a5;
const SPACE$2 = ' ';

const serialize$6 = (val, config, indentation, depth, refs, printer) => {
  const stringedValue = val.toString();

  if (
    stringedValue === 'ArrayContaining' ||
    stringedValue === 'ArrayNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return '[' + stringedValue + ']';
    }

    return (
      stringedValue +
      SPACE$2 +
      '[' +
      (0, _collections$3.printListItems)(
        val.sample,
        config,
        indentation,
        depth,
        refs,
        printer
      ) +
      ']'
    );
  }

  if (
    stringedValue === 'ObjectContaining' ||
    stringedValue === 'ObjectNotContaining'
  ) {
    if (++depth > config.maxDepth) {
      return '[' + stringedValue + ']';
    }

    return (
      stringedValue +
      SPACE$2 +
      '{' +
      (0, _collections$3.printObjectProperties)(
        val.sample,
        config,
        indentation,
        depth,
        refs,
        printer
      ) +
      '}'
    );
  }

  if (
    stringedValue === 'StringMatching' ||
    stringedValue === 'StringNotMatching'
  ) {
    return (
      stringedValue +
      SPACE$2 +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  if (
    stringedValue === 'StringContaining' ||
    stringedValue === 'StringNotContaining'
  ) {
    return (
      stringedValue +
      SPACE$2 +
      printer(val.sample, config, indentation, depth, refs)
    );
  }

  return val.toAsymmetricMatcher();
};

AsymmetricMatcher$1.serialize = serialize$6;

const test$6 = val => val && val.$$typeof === asymmetricMatcher;

AsymmetricMatcher$1.test = test$6;
const plugin$6 = {
  serialize: serialize$6,
  test: test$6
};
var _default$7 = plugin$6;
AsymmetricMatcher$1.default = _default$7;

var ConvertAnsi = {};

var ansiRegex = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};

Object.defineProperty(ConvertAnsi, '__esModule', {
  value: true
});
ConvertAnsi.test = ConvertAnsi.serialize = ConvertAnsi.default = void 0;

var _ansiRegex = _interopRequireDefault$2(ansiRegex);

var _ansiStyles$1 = _interopRequireDefault$2(ansiStyles.exports);

function _interopRequireDefault$2(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const toHumanReadableAnsi = text =>
  text.replace((0, _ansiRegex.default)(), match => {
    switch (match) {
      case _ansiStyles$1.default.red.close:
      case _ansiStyles$1.default.green.close:
      case _ansiStyles$1.default.cyan.close:
      case _ansiStyles$1.default.gray.close:
      case _ansiStyles$1.default.white.close:
      case _ansiStyles$1.default.yellow.close:
      case _ansiStyles$1.default.bgRed.close:
      case _ansiStyles$1.default.bgGreen.close:
      case _ansiStyles$1.default.bgYellow.close:
      case _ansiStyles$1.default.inverse.close:
      case _ansiStyles$1.default.dim.close:
      case _ansiStyles$1.default.bold.close:
      case _ansiStyles$1.default.reset.open:
      case _ansiStyles$1.default.reset.close:
        return '</>';

      case _ansiStyles$1.default.red.open:
        return '<red>';

      case _ansiStyles$1.default.green.open:
        return '<green>';

      case _ansiStyles$1.default.cyan.open:
        return '<cyan>';

      case _ansiStyles$1.default.gray.open:
        return '<gray>';

      case _ansiStyles$1.default.white.open:
        return '<white>';

      case _ansiStyles$1.default.yellow.open:
        return '<yellow>';

      case _ansiStyles$1.default.bgRed.open:
        return '<bgRed>';

      case _ansiStyles$1.default.bgGreen.open:
        return '<bgGreen>';

      case _ansiStyles$1.default.bgYellow.open:
        return '<bgYellow>';

      case _ansiStyles$1.default.inverse.open:
        return '<inverse>';

      case _ansiStyles$1.default.dim.open:
        return '<dim>';

      case _ansiStyles$1.default.bold.open:
        return '<bold>';

      default:
        return '';
    }
  });

const test$5 = val =>
  typeof val === 'string' && !!val.match((0, _ansiRegex.default)());

ConvertAnsi.test = test$5;

const serialize$5 = (val, config, indentation, depth, refs, printer) =>
  printer(toHumanReadableAnsi(val), config, indentation, depth, refs);

ConvertAnsi.serialize = serialize$5;
const plugin$5 = {
  serialize: serialize$5,
  test: test$5
};
var _default$6 = plugin$5;
ConvertAnsi.default = _default$6;

var DOMCollection$1 = {};

Object.defineProperty(DOMCollection$1, '__esModule', {
  value: true
});
DOMCollection$1.test = DOMCollection$1.serialize = DOMCollection$1.default = void 0;

var _collections$2 = collections;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/ban-types-eventually */
const SPACE$1 = ' ';
const OBJECT_NAMES = ['DOMStringMap', 'NamedNodeMap'];
const ARRAY_REGEXP = /^(HTML\w*Collection|NodeList)$/;

const testName = name =>
  OBJECT_NAMES.indexOf(name) !== -1 || ARRAY_REGEXP.test(name);

const test$4 = val =>
  val &&
  val.constructor &&
  !!val.constructor.name &&
  testName(val.constructor.name);

DOMCollection$1.test = test$4;

const isNamedNodeMap = collection =>
  collection.constructor.name === 'NamedNodeMap';

const serialize$4 = (collection, config, indentation, depth, refs, printer) => {
  const name = collection.constructor.name;

  if (++depth > config.maxDepth) {
    return '[' + name + ']';
  }

  return (
    (config.min ? '' : name + SPACE$1) +
    (OBJECT_NAMES.indexOf(name) !== -1
      ? '{' +
        (0, _collections$2.printObjectProperties)(
          isNamedNodeMap(collection)
            ? Array.from(collection).reduce((props, attribute) => {
                props[attribute.name] = attribute.value;
                return props;
              }, {})
            : {...collection},
          config,
          indentation,
          depth,
          refs,
          printer
        ) +
        '}'
      : '[' +
        (0, _collections$2.printListItems)(
          Array.from(collection),
          config,
          indentation,
          depth,
          refs,
          printer
        ) +
        ']')
  );
};

DOMCollection$1.serialize = serialize$4;
const plugin$4 = {
  serialize: serialize$4,
  test: test$4
};
var _default$5 = plugin$4;
DOMCollection$1.default = _default$5;

var DOMElement$1 = {};

var markup = {};

var escapeHTML$1 = {};

Object.defineProperty(escapeHTML$1, '__esModule', {
  value: true
});
escapeHTML$1.default = escapeHTML;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function escapeHTML(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Object.defineProperty(markup, '__esModule', {
  value: true
});
markup.printText =
  markup.printProps =
  markup.printElementAsLeaf =
  markup.printElement =
  markup.printComment =
  markup.printChildren =
    void 0;

var _escapeHTML = _interopRequireDefault$1(escapeHTML$1);

function _interopRequireDefault$1(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Return empty string if keys is empty.
const printProps = (keys, props, config, indentation, depth, refs, printer) => {
  const indentationNext = indentation + config.indent;
  const colors = config.colors;
  return keys
    .map(key => {
      const value = props[key];
      let printed = printer(value, config, indentationNext, depth, refs);

      if (typeof value !== 'string') {
        if (printed.indexOf('\n') !== -1) {
          printed =
            config.spacingOuter +
            indentationNext +
            printed +
            config.spacingOuter +
            indentation;
        }

        printed = '{' + printed + '}';
      }

      return (
        config.spacingInner +
        indentation +
        colors.prop.open +
        key +
        colors.prop.close +
        '=' +
        colors.value.open +
        printed +
        colors.value.close
      );
    })
    .join('');
}; // Return empty string if children is empty.

markup.printProps = printProps;

const printChildren = (children, config, indentation, depth, refs, printer) =>
  children
    .map(
      child =>
        config.spacingOuter +
        indentation +
        (typeof child === 'string'
          ? printText(child, config)
          : printer(child, config, indentation, depth, refs))
    )
    .join('');

markup.printChildren = printChildren;

const printText = (text, config) => {
  const contentColor = config.colors.content;
  return (
    contentColor.open + (0, _escapeHTML.default)(text) + contentColor.close
  );
};

markup.printText = printText;

const printComment = (comment, config) => {
  const commentColor = config.colors.comment;
  return (
    commentColor.open +
    '<!--' +
    (0, _escapeHTML.default)(comment) +
    '-->' +
    commentColor.close
  );
}; // Separate the functions to format props, children, and element,
// so a plugin could override a particular function, if needed.
// Too bad, so sad: the traditional (but unnecessary) space
// in a self-closing tagColor requires a second test of printedProps.

markup.printComment = printComment;

const printElement = (
  type,
  printedProps,
  printedChildren,
  config,
  indentation
) => {
  const tagColor = config.colors.tag;
  return (
    tagColor.open +
    '<' +
    type +
    (printedProps &&
      tagColor.close +
        printedProps +
        config.spacingOuter +
        indentation +
        tagColor.open) +
    (printedChildren
      ? '>' +
        tagColor.close +
        printedChildren +
        config.spacingOuter +
        indentation +
        tagColor.open +
        '</' +
        type
      : (printedProps && !config.min ? '' : ' ') + '/') +
    '>' +
    tagColor.close
  );
};

markup.printElement = printElement;

const printElementAsLeaf = (type, config) => {
  const tagColor = config.colors.tag;
  return (
    tagColor.open +
    '<' +
    type +
    tagColor.close +
    ' ???' +
    tagColor.open +
    ' />' +
    tagColor.close
  );
};

markup.printElementAsLeaf = printElementAsLeaf;

Object.defineProperty(DOMElement$1, '__esModule', {
  value: true
});
DOMElement$1.test = DOMElement$1.serialize = DOMElement$1.default = void 0;

var _markup$2 = markup;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const FRAGMENT_NODE = 11;
const ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/;

const testHasAttribute = val => {
  try {
    return typeof val.hasAttribute === 'function' && val.hasAttribute('is');
  } catch {
    return false;
  }
};

const testNode = val => {
  const constructorName = val.constructor.name;
  const {nodeType, tagName} = val;
  const isCustomElement =
    (typeof tagName === 'string' && tagName.includes('-')) ||
    testHasAttribute(val);
  return (
    (nodeType === ELEMENT_NODE &&
      (ELEMENT_REGEXP.test(constructorName) || isCustomElement)) ||
    (nodeType === TEXT_NODE && constructorName === 'Text') ||
    (nodeType === COMMENT_NODE && constructorName === 'Comment') ||
    (nodeType === FRAGMENT_NODE && constructorName === 'DocumentFragment')
  );
};

const test$3 = val => {
  var _val$constructor;

  return (
    (val === null || val === void 0
      ? void 0
      : (_val$constructor = val.constructor) === null ||
        _val$constructor === void 0
      ? void 0
      : _val$constructor.name) && testNode(val)
  );
};

DOMElement$1.test = test$3;

function nodeIsText(node) {
  return node.nodeType === TEXT_NODE;
}

function nodeIsComment(node) {
  return node.nodeType === COMMENT_NODE;
}

function nodeIsFragment(node) {
  return node.nodeType === FRAGMENT_NODE;
}

const serialize$3 = (node, config, indentation, depth, refs, printer) => {
  if (nodeIsText(node)) {
    return (0, _markup$2.printText)(node.data, config);
  }

  if (nodeIsComment(node)) {
    return (0, _markup$2.printComment)(node.data, config);
  }

  const type = nodeIsFragment(node)
    ? 'DocumentFragment'
    : node.tagName.toLowerCase();

  if (++depth > config.maxDepth) {
    return (0, _markup$2.printElementAsLeaf)(type, config);
  }

  return (0, _markup$2.printElement)(
    type,
    (0, _markup$2.printProps)(
      nodeIsFragment(node)
        ? []
        : Array.from(node.attributes)
            .map(attr => attr.name)
            .sort(),
      nodeIsFragment(node)
        ? {}
        : Array.from(node.attributes).reduce((props, attribute) => {
            props[attribute.name] = attribute.value;
            return props;
          }, {}),
      config,
      indentation + config.indent,
      depth,
      refs,
      printer
    ),
    (0, _markup$2.printChildren)(
      Array.prototype.slice.call(node.childNodes || node.children),
      config,
      indentation + config.indent,
      depth,
      refs,
      printer
    ),
    config,
    indentation
  );
};

DOMElement$1.serialize = serialize$3;
const plugin$3 = {
  serialize: serialize$3,
  test: test$3
};
var _default$4 = plugin$3;
DOMElement$1.default = _default$4;

var Immutable$1 = {};

Object.defineProperty(Immutable$1, '__esModule', {
  value: true
});
Immutable$1.test = Immutable$1.serialize = Immutable$1.default = void 0;

var _collections$1 = collections;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// SENTINEL constants are from https://github.com/facebook/immutable-js
const IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
const IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
const IS_KEYED_SENTINEL$1 = '@@__IMMUTABLE_KEYED__@@';
const IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
const IS_ORDERED_SENTINEL$1 = '@@__IMMUTABLE_ORDERED__@@';
const IS_RECORD_SENTINEL = '@@__IMMUTABLE_RECORD__@@'; // immutable v4

const IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
const IS_SET_SENTINEL$1 = '@@__IMMUTABLE_SET__@@';
const IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

const getImmutableName = name => 'Immutable.' + name;

const printAsLeaf = name => '[' + name + ']';

const SPACE = ' ';
const LAZY = '???'; // Seq is lazy if it calls a method like filter

const printImmutableEntries = (
  val,
  config,
  indentation,
  depth,
  refs,
  printer,
  type
) =>
  ++depth > config.maxDepth
    ? printAsLeaf(getImmutableName(type))
    : getImmutableName(type) +
      SPACE +
      '{' +
      (0, _collections$1.printIteratorEntries)(
        val.entries(),
        config,
        indentation,
        depth,
        refs,
        printer
      ) +
      '}'; // Record has an entries method because it is a collection in immutable v3.
// Return an iterator for Immutable Record from version v3 or v4.

function getRecordEntries(val) {
  let i = 0;
  return {
    next() {
      if (i < val._keys.length) {
        const key = val._keys[i++];
        return {
          done: false,
          value: [key, val.get(key)]
        };
      }

      return {
        done: true,
        value: undefined
      };
    }
  };
}

const printImmutableRecord = (
  val,
  config,
  indentation,
  depth,
  refs,
  printer
) => {
  // _name property is defined only for an Immutable Record instance
  // which was constructed with a second optional descriptive name arg
  const name = getImmutableName(val._name || 'Record');
  return ++depth > config.maxDepth
    ? printAsLeaf(name)
    : name +
        SPACE +
        '{' +
        (0, _collections$1.printIteratorEntries)(
          getRecordEntries(val),
          config,
          indentation,
          depth,
          refs,
          printer
        ) +
        '}';
};

const printImmutableSeq = (val, config, indentation, depth, refs, printer) => {
  const name = getImmutableName('Seq');

  if (++depth > config.maxDepth) {
    return printAsLeaf(name);
  }

  if (val[IS_KEYED_SENTINEL$1]) {
    return (
      name +
      SPACE +
      '{' + // from Immutable collection of entries or from ECMAScript object
      (val._iter || val._object
        ? (0, _collections$1.printIteratorEntries)(
            val.entries(),
            config,
            indentation,
            depth,
            refs,
            printer
          )
        : LAZY) +
      '}'
    );
  }

  return (
    name +
    SPACE +
    '[' +
    (val._iter || // from Immutable collection of values
    val._array || // from ECMAScript array
    val._collection || // from ECMAScript collection in immutable v4
    val._iterable // from ECMAScript collection in immutable v3
      ? (0, _collections$1.printIteratorValues)(
          val.values(),
          config,
          indentation,
          depth,
          refs,
          printer
        )
      : LAZY) +
    ']'
  );
};

const printImmutableValues = (
  val,
  config,
  indentation,
  depth,
  refs,
  printer,
  type
) =>
  ++depth > config.maxDepth
    ? printAsLeaf(getImmutableName(type))
    : getImmutableName(type) +
      SPACE +
      '[' +
      (0, _collections$1.printIteratorValues)(
        val.values(),
        config,
        indentation,
        depth,
        refs,
        printer
      ) +
      ']';

const serialize$2 = (val, config, indentation, depth, refs, printer) => {
  if (val[IS_MAP_SENTINEL]) {
    return printImmutableEntries(
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      val[IS_ORDERED_SENTINEL$1] ? 'OrderedMap' : 'Map'
    );
  }

  if (val[IS_LIST_SENTINEL]) {
    return printImmutableValues(
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      'List'
    );
  }

  if (val[IS_SET_SENTINEL$1]) {
    return printImmutableValues(
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      val[IS_ORDERED_SENTINEL$1] ? 'OrderedSet' : 'Set'
    );
  }

  if (val[IS_STACK_SENTINEL]) {
    return printImmutableValues(
      val,
      config,
      indentation,
      depth,
      refs,
      printer,
      'Stack'
    );
  }

  if (val[IS_SEQ_SENTINEL]) {
    return printImmutableSeq(val, config, indentation, depth, refs, printer);
  } // For compatibility with immutable v3 and v4, let record be the default.

  return printImmutableRecord(val, config, indentation, depth, refs, printer);
}; // Explicitly comparing sentinel properties to true avoids false positive
// when mock identity-obj-proxy returns the key as the value for any key.

Immutable$1.serialize = serialize$2;

const test$2 = val =>
  val &&
  (val[IS_ITERABLE_SENTINEL] === true || val[IS_RECORD_SENTINEL] === true);

Immutable$1.test = test$2;
const plugin$2 = {
  serialize: serialize$2,
  test: test$2
};
var _default$3 = plugin$2;
Immutable$1.default = _default$3;

var ReactElement$1 = {};

var reactIs = {exports: {}};

var reactIs_production_min = {};

/** @license React v17.0.2
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b=60103,c=60106,d=60107,e=60108,f=60114,g=60109,h=60110,k=60112,l=60113,m=60120,n=60115,p=60116,q=60121,r=60122,u=60117,v=60129,w=60131;
if("function"===typeof Symbol&&Symbol.for){var x=Symbol.for;b=x("react.element");c=x("react.portal");d=x("react.fragment");e=x("react.strict_mode");f=x("react.profiler");g=x("react.provider");h=x("react.context");k=x("react.forward_ref");l=x("react.suspense");m=x("react.suspense_list");n=x("react.memo");p=x("react.lazy");q=x("react.block");r=x("react.server.block");u=x("react.fundamental");v=x("react.debug_trace_mode");w=x("react.legacy_hidden");}
function y(a){if("object"===typeof a&&null!==a){var t=a.$$typeof;switch(t){case b:switch(a=a.type,a){case d:case f:case e:case l:case m:return a;default:switch(a=a&&a.$$typeof,a){case h:case k:case p:case n:case g:return a;default:return t}}case c:return t}}}var z=g,A=b,B=k,C=d,D=p,E=n,F=c,G=f,H=e,I=l;reactIs_production_min.ContextConsumer=h;reactIs_production_min.ContextProvider=z;reactIs_production_min.Element=A;reactIs_production_min.ForwardRef=B;reactIs_production_min.Fragment=C;reactIs_production_min.Lazy=D;reactIs_production_min.Memo=E;reactIs_production_min.Portal=F;reactIs_production_min.Profiler=G;reactIs_production_min.StrictMode=H;
reactIs_production_min.Suspense=I;reactIs_production_min.isAsyncMode=function(){return !1};reactIs_production_min.isConcurrentMode=function(){return !1};reactIs_production_min.isContextConsumer=function(a){return y(a)===h};reactIs_production_min.isContextProvider=function(a){return y(a)===g};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===b};reactIs_production_min.isForwardRef=function(a){return y(a)===k};reactIs_production_min.isFragment=function(a){return y(a)===d};reactIs_production_min.isLazy=function(a){return y(a)===p};reactIs_production_min.isMemo=function(a){return y(a)===n};
reactIs_production_min.isPortal=function(a){return y(a)===c};reactIs_production_min.isProfiler=function(a){return y(a)===f};reactIs_production_min.isStrictMode=function(a){return y(a)===e};reactIs_production_min.isSuspense=function(a){return y(a)===l};reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===d||a===f||a===v||a===e||a===l||a===m||a===w||"object"===typeof a&&null!==a&&(a.$$typeof===p||a.$$typeof===n||a.$$typeof===g||a.$$typeof===h||a.$$typeof===k||a.$$typeof===u||a.$$typeof===q||a[0]===r)?!0:!1};
reactIs_production_min.typeOf=y;

var reactIs_development = {};

/** @license React v17.0.2
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== "production") {
  (function() {

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
var REACT_FRAGMENT_TYPE = 0xeacb;
var REACT_STRICT_MODE_TYPE = 0xeacc;
var REACT_PROFILER_TYPE = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
var REACT_SUSPENSE_TYPE = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_BLOCK_TYPE = 0xead9;
var REACT_SERVER_BLOCK_TYPE = 0xeada;
var REACT_FUNDAMENTAL_TYPE = 0xead5;
var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;

if (typeof Symbol === 'function' && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor('react.element');
  REACT_PORTAL_TYPE = symbolFor('react.portal');
  REACT_FRAGMENT_TYPE = symbolFor('react.fragment');
  REACT_STRICT_MODE_TYPE = symbolFor('react.strict_mode');
  REACT_PROFILER_TYPE = symbolFor('react.profiler');
  REACT_PROVIDER_TYPE = symbolFor('react.provider');
  REACT_CONTEXT_TYPE = symbolFor('react.context');
  REACT_FORWARD_REF_TYPE = symbolFor('react.forward_ref');
  REACT_SUSPENSE_TYPE = symbolFor('react.suspense');
  REACT_SUSPENSE_LIST_TYPE = symbolFor('react.suspense_list');
  REACT_MEMO_TYPE = symbolFor('react.memo');
  REACT_LAZY_TYPE = symbolFor('react.lazy');
  REACT_BLOCK_TYPE = symbolFor('react.block');
  REACT_SERVER_BLOCK_TYPE = symbolFor('react.server.block');
  REACT_FUNDAMENTAL_TYPE = symbolFor('react.fundamental');
  symbolFor('react.scope');
  symbolFor('react.opaque.id');
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor('react.debug_trace_mode');
  symbolFor('react.offscreen');
  REACT_LEGACY_HIDDEN_TYPE = symbolFor('react.legacy_hidden');
}

// Filter certain DOM attributes (e.g. src, href) if their values are empty strings.

var enableScopeAPI = false; // Experimental Create Event Handle API.

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_DEBUG_TRACING_MODE_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_LEGACY_HIDDEN_TYPE || enableScopeAPI ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_BLOCK_TYPE || type[0] === REACT_SERVER_BLOCK_TYPE) {
      return true;
    }
  }

  return false;
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false;
var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
    }
  }

  return false;
}
function isConcurrentMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
      hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isConcurrentMode() alias has been deprecated, ' + 'and will be removed in React 18+.');
    }
  }

  return false;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

reactIs_development.ContextConsumer = ContextConsumer;
reactIs_development.ContextProvider = ContextProvider;
reactIs_development.Element = Element;
reactIs_development.ForwardRef = ForwardRef;
reactIs_development.Fragment = Fragment;
reactIs_development.Lazy = Lazy;
reactIs_development.Memo = Memo;
reactIs_development.Portal = Portal;
reactIs_development.Profiler = Profiler;
reactIs_development.StrictMode = StrictMode;
reactIs_development.Suspense = Suspense;
reactIs_development.isAsyncMode = isAsyncMode;
reactIs_development.isConcurrentMode = isConcurrentMode;
reactIs_development.isContextConsumer = isContextConsumer;
reactIs_development.isContextProvider = isContextProvider;
reactIs_development.isElement = isElement;
reactIs_development.isForwardRef = isForwardRef;
reactIs_development.isFragment = isFragment;
reactIs_development.isLazy = isLazy;
reactIs_development.isMemo = isMemo;
reactIs_development.isPortal = isPortal;
reactIs_development.isProfiler = isProfiler;
reactIs_development.isStrictMode = isStrictMode;
reactIs_development.isSuspense = isSuspense;
reactIs_development.isValidElementType = isValidElementType;
reactIs_development.typeOf = typeOf;
  })();
}

if (process.env.NODE_ENV === 'production') {
  reactIs.exports = reactIs_production_min;
} else {
  reactIs.exports = reactIs_development;
}

Object.defineProperty(ReactElement$1, '__esModule', {
  value: true
});
ReactElement$1.test = ReactElement$1.serialize = ReactElement$1.default = void 0;

var ReactIs = _interopRequireWildcard(reactIs.exports);

var _markup$1 = markup;

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Given element.props.children, or subtree during recursive traversal,
// return flattened array of children.
const getChildren = (arg, children = []) => {
  if (Array.isArray(arg)) {
    arg.forEach(item => {
      getChildren(item, children);
    });
  } else if (arg != null && arg !== false) {
    children.push(arg);
  }

  return children;
};

const getType = element => {
  const type = element.type;

  if (typeof type === 'string') {
    return type;
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || 'Unknown';
  }

  if (ReactIs.isFragment(element)) {
    return 'React.Fragment';
  }

  if (ReactIs.isSuspense(element)) {
    return 'React.Suspense';
  }

  if (typeof type === 'object' && type !== null) {
    if (ReactIs.isContextProvider(element)) {
      return 'Context.Provider';
    }

    if (ReactIs.isContextConsumer(element)) {
      return 'Context.Consumer';
    }

    if (ReactIs.isForwardRef(element)) {
      if (type.displayName) {
        return type.displayName;
      }

      const functionName = type.render.displayName || type.render.name || '';
      return functionName !== ''
        ? 'ForwardRef(' + functionName + ')'
        : 'ForwardRef';
    }

    if (ReactIs.isMemo(element)) {
      const functionName =
        type.displayName || type.type.displayName || type.type.name || '';
      return functionName !== '' ? 'Memo(' + functionName + ')' : 'Memo';
    }
  }

  return 'UNDEFINED';
};

const getPropKeys$1 = element => {
  const {props} = element;
  return Object.keys(props)
    .filter(key => key !== 'children' && props[key] !== undefined)
    .sort();
};

const serialize$1 = (element, config, indentation, depth, refs, printer) =>
  ++depth > config.maxDepth
    ? (0, _markup$1.printElementAsLeaf)(getType(element), config)
    : (0, _markup$1.printElement)(
        getType(element),
        (0, _markup$1.printProps)(
          getPropKeys$1(element),
          element.props,
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        (0, _markup$1.printChildren)(
          getChildren(element.props.children),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer
        ),
        config,
        indentation
      );

ReactElement$1.serialize = serialize$1;

const test$1 = val => val != null && ReactIs.isElement(val);

ReactElement$1.test = test$1;
const plugin$1 = {
  serialize: serialize$1,
  test: test$1
};
var _default$2 = plugin$1;
ReactElement$1.default = _default$2;

var ReactTestComponent$1 = {};

Object.defineProperty(ReactTestComponent$1, '__esModule', {
  value: true
});
ReactTestComponent$1.test = ReactTestComponent$1.serialize = ReactTestComponent$1.default = void 0;

var _markup = markup;

var global$2 = (function () {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  } else if (typeof global$2 !== 'undefined') {
    return global$2;
  } else if (typeof self !== 'undefined') {
    return self;
  } else if (typeof window !== 'undefined') {
    return window;
  } else {
    return Function('return this')();
  }
})();

var Symbol$1 = global$2['jest-symbol-do-not-touch'] || global$2.Symbol;
const testSymbol =
  typeof Symbol$1 === 'function' && Symbol$1.for
    ? Symbol$1.for('react.test.json')
    : 0xea71357;

const getPropKeys = object => {
  const {props} = object;
  return props
    ? Object.keys(props)
        .filter(key => props[key] !== undefined)
        .sort()
    : [];
};

const serialize = (object, config, indentation, depth, refs, printer) =>
  ++depth > config.maxDepth
    ? (0, _markup.printElementAsLeaf)(object.type, config)
    : (0, _markup.printElement)(
        object.type,
        object.props
          ? (0, _markup.printProps)(
              getPropKeys(object),
              object.props,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer
            )
          : '',
        object.children
          ? (0, _markup.printChildren)(
              object.children,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer
            )
          : '',
        config,
        indentation
      );

ReactTestComponent$1.serialize = serialize;

const test = val => val && val.$$typeof === testSymbol;

ReactTestComponent$1.test = test;
const plugin = {
  serialize,
  test
};
var _default$1 = plugin;
ReactTestComponent$1.default = _default$1;

Object.defineProperty(build, '__esModule', {
  value: true
});
build.default = build.DEFAULT_OPTIONS = void 0;
var format_1 = build.format = format;
var plugins_1 = build.plugins = void 0;

var _ansiStyles = _interopRequireDefault(ansiStyles.exports);

var _collections = collections;

var _AsymmetricMatcher = _interopRequireDefault(
  AsymmetricMatcher$1
);

var _ConvertAnsi = _interopRequireDefault(ConvertAnsi);

var _DOMCollection = _interopRequireDefault(DOMCollection$1);

var _DOMElement = _interopRequireDefault(DOMElement$1);

var _Immutable = _interopRequireDefault(Immutable$1);

var _ReactElement = _interopRequireDefault(ReactElement$1);

var _ReactTestComponent = _interopRequireDefault(
  ReactTestComponent$1
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable local/ban-types-eventually */
const toString = Object.prototype.toString;
const toISOString = Date.prototype.toISOString;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
/**
 * Explicitly comparing typeof constructor to function avoids undefined as name
 * when mock identity-obj-proxy returns the key as the value for any key.
 */

const getConstructorName = val =>
  (typeof val.constructor === 'function' && val.constructor.name) || 'Object';
/* global window */

/** Is val is equal to global window object? Works even if it does not exist :) */

const isWindow = val => typeof window !== 'undefined' && val === window;

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
const NEWLINE_REGEXP = /\n/gi;

class PrettyFormatPluginError extends Error {
  constructor(message, stack) {
    super(message);
    this.stack = stack;
    this.name = this.constructor.name;
  }
}

function isToStringedArrayType(toStringed) {
  return (
    toStringed === '[object Array]' ||
    toStringed === '[object ArrayBuffer]' ||
    toStringed === '[object DataView]' ||
    toStringed === '[object Float32Array]' ||
    toStringed === '[object Float64Array]' ||
    toStringed === '[object Int8Array]' ||
    toStringed === '[object Int16Array]' ||
    toStringed === '[object Int32Array]' ||
    toStringed === '[object Uint8Array]' ||
    toStringed === '[object Uint8ClampedArray]' ||
    toStringed === '[object Uint16Array]' ||
    toStringed === '[object Uint32Array]'
  );
}

function printNumber(val) {
  return Object.is(val, -0) ? '-0' : String(val);
}

function printBigInt(val) {
  return String(`${val}n`);
}

function printFunction(val, printFunctionName) {
  if (!printFunctionName) {
    return '[Function]';
  }

  return '[Function ' + (val.name || 'anonymous') + ']';
}

function printSymbol(val) {
  return String(val).replace(SYMBOL_REGEXP, 'Symbol($1)');
}

function printError(val) {
  return '[' + errorToString.call(val) + ']';
}
/**
 * The first port of call for printing an object, handles most of the
 * data-types in JS.
 */

function printBasicValue(val, printFunctionName, escapeRegex, escapeString) {
  if (val === true || val === false) {
    return '' + val;
  }

  if (val === undefined) {
    return 'undefined';
  }

  if (val === null) {
    return 'null';
  }

  const typeOf = typeof val;

  if (typeOf === 'number') {
    return printNumber(val);
  }

  if (typeOf === 'bigint') {
    return printBigInt(val);
  }

  if (typeOf === 'string') {
    if (escapeString) {
      return '"' + val.replace(/"|\\/g, '\\$&') + '"';
    }

    return '"' + val + '"';
  }

  if (typeOf === 'function') {
    return printFunction(val, printFunctionName);
  }

  if (typeOf === 'symbol') {
    return printSymbol(val);
  }

  const toStringed = toString.call(val);

  if (toStringed === '[object WeakMap]') {
    return 'WeakMap {}';
  }

  if (toStringed === '[object WeakSet]') {
    return 'WeakSet {}';
  }

  if (
    toStringed === '[object Function]' ||
    toStringed === '[object GeneratorFunction]'
  ) {
    return printFunction(val, printFunctionName);
  }

  if (toStringed === '[object Symbol]') {
    return printSymbol(val);
  }

  if (toStringed === '[object Date]') {
    return isNaN(+val) ? 'Date { NaN }' : toISOString.call(val);
  }

  if (toStringed === '[object Error]') {
    return printError(val);
  }

  if (toStringed === '[object RegExp]') {
    if (escapeRegex) {
      // https://github.com/benjamingr/RegExp.escape/blob/main/polyfill.js
      return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    return regExpToString.call(val);
  }

  if (val instanceof Error) {
    return printError(val);
  }

  return null;
}
/**
 * Handles more complex objects ( such as objects with circular references.
 * maps and sets etc )
 */

function printComplexValue(
  val,
  config,
  indentation,
  depth,
  refs,
  hasCalledToJSON
) {
  if (refs.indexOf(val) !== -1) {
    return '[Circular]';
  }

  refs = refs.slice();
  refs.push(val);
  const hitMaxDepth = ++depth > config.maxDepth;
  const min = config.min;

  if (
    config.callToJSON &&
    !hitMaxDepth &&
    val.toJSON &&
    typeof val.toJSON === 'function' &&
    !hasCalledToJSON
  ) {
    return printer(val.toJSON(), config, indentation, depth, refs, true);
  }

  const toStringed = toString.call(val);

  if (toStringed === '[object Arguments]') {
    return hitMaxDepth
      ? '[Arguments]'
      : (min ? '' : 'Arguments ') +
          '[' +
          (0, _collections.printListItems)(
            val,
            config,
            indentation,
            depth,
            refs,
            printer
          ) +
          ']';
  }

  if (isToStringedArrayType(toStringed)) {
    return hitMaxDepth
      ? '[' + val.constructor.name + ']'
      : (min
          ? ''
          : !config.printBasicPrototype && val.constructor.name === 'Array'
          ? ''
          : val.constructor.name + ' ') +
          '[' +
          (0, _collections.printListItems)(
            val,
            config,
            indentation,
            depth,
            refs,
            printer
          ) +
          ']';
  }

  if (toStringed === '[object Map]') {
    return hitMaxDepth
      ? '[Map]'
      : 'Map {' +
          (0, _collections.printIteratorEntries)(
            val.entries(),
            config,
            indentation,
            depth,
            refs,
            printer,
            ' => '
          ) +
          '}';
  }

  if (toStringed === '[object Set]') {
    return hitMaxDepth
      ? '[Set]'
      : 'Set {' +
          (0, _collections.printIteratorValues)(
            val.values(),
            config,
            indentation,
            depth,
            refs,
            printer
          ) +
          '}';
  } // Avoid failure to serialize global window object in jsdom test environment.
  // For example, not even relevant if window is prop of React element.

  return hitMaxDepth || isWindow(val)
    ? '[' + getConstructorName(val) + ']'
    : (min
        ? ''
        : !config.printBasicPrototype && getConstructorName(val) === 'Object'
        ? ''
        : getConstructorName(val) + ' ') +
        '{' +
        (0, _collections.printObjectProperties)(
          val,
          config,
          indentation,
          depth,
          refs,
          printer
        ) +
        '}';
}

function isNewPlugin(plugin) {
  return plugin.serialize != null;
}

function printPlugin(plugin, val, config, indentation, depth, refs) {
  let printed;

  try {
    printed = isNewPlugin(plugin)
      ? plugin.serialize(val, config, indentation, depth, refs, printer)
      : plugin.print(
          val,
          valChild => printer(valChild, config, indentation, depth, refs),
          str => {
            const indentationNext = indentation + config.indent;
            return (
              indentationNext +
              str.replace(NEWLINE_REGEXP, '\n' + indentationNext)
            );
          },
          {
            edgeSpacing: config.spacingOuter,
            min: config.min,
            spacing: config.spacingInner
          },
          config.colors
        );
  } catch (error) {
    throw new PrettyFormatPluginError(error.message, error.stack);
  }

  if (typeof printed !== 'string') {
    throw new Error(
      `pretty-format: Plugin must return type "string" but instead returned "${typeof printed}".`
    );
  }

  return printed;
}

function findPlugin(plugins, val) {
  for (let p = 0; p < plugins.length; p++) {
    try {
      if (plugins[p].test(val)) {
        return plugins[p];
      }
    } catch (error) {
      throw new PrettyFormatPluginError(error.message, error.stack);
    }
  }

  return null;
}

function printer(val, config, indentation, depth, refs, hasCalledToJSON) {
  const plugin = findPlugin(config.plugins, val);

  if (plugin !== null) {
    return printPlugin(plugin, val, config, indentation, depth, refs);
  }

  const basicResult = printBasicValue(
    val,
    config.printFunctionName,
    config.escapeRegex,
    config.escapeString
  );

  if (basicResult !== null) {
    return basicResult;
  }

  return printComplexValue(
    val,
    config,
    indentation,
    depth,
    refs,
    hasCalledToJSON
  );
}

const DEFAULT_THEME = {
  comment: 'gray',
  content: 'reset',
  prop: 'yellow',
  tag: 'cyan',
  value: 'green'
};
const DEFAULT_THEME_KEYS = Object.keys(DEFAULT_THEME);
const DEFAULT_OPTIONS = {
  callToJSON: true,
  compareKeys: undefined,
  escapeRegex: false,
  escapeString: true,
  highlight: false,
  indent: 2,
  maxDepth: Infinity,
  min: false,
  plugins: [],
  printBasicPrototype: true,
  printFunctionName: true,
  theme: DEFAULT_THEME
};
build.DEFAULT_OPTIONS = DEFAULT_OPTIONS;

function validateOptions(options) {
  Object.keys(options).forEach(key => {
    if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
      throw new Error(`pretty-format: Unknown option "${key}".`);
    }
  });

  if (options.min && options.indent !== undefined && options.indent !== 0) {
    throw new Error(
      'pretty-format: Options "min" and "indent" cannot be used together.'
    );
  }

  if (options.theme !== undefined) {
    if (options.theme === null) {
      throw new Error('pretty-format: Option "theme" must not be null.');
    }

    if (typeof options.theme !== 'object') {
      throw new Error(
        `pretty-format: Option "theme" must be of type "object" but instead received "${typeof options.theme}".`
      );
    }
  }
}

const getColorsHighlight = options =>
  DEFAULT_THEME_KEYS.reduce((colors, key) => {
    const value =
      options.theme && options.theme[key] !== undefined
        ? options.theme[key]
        : DEFAULT_THEME[key];
    const color = value && _ansiStyles.default[value];

    if (
      color &&
      typeof color.close === 'string' &&
      typeof color.open === 'string'
    ) {
      colors[key] = color;
    } else {
      throw new Error(
        `pretty-format: Option "theme" has a key "${key}" whose value "${value}" is undefined in ansi-styles.`
      );
    }

    return colors;
  }, Object.create(null));

const getColorsEmpty = () =>
  DEFAULT_THEME_KEYS.reduce((colors, key) => {
    colors[key] = {
      close: '',
      open: ''
    };
    return colors;
  }, Object.create(null));

const getPrintFunctionName = options =>
  options && options.printFunctionName !== undefined
    ? options.printFunctionName
    : DEFAULT_OPTIONS.printFunctionName;

const getEscapeRegex = options =>
  options && options.escapeRegex !== undefined
    ? options.escapeRegex
    : DEFAULT_OPTIONS.escapeRegex;

const getEscapeString = options =>
  options && options.escapeString !== undefined
    ? options.escapeString
    : DEFAULT_OPTIONS.escapeString;

const getConfig = options => {
  var _options$printBasicPr;

  return {
    callToJSON:
      options && options.callToJSON !== undefined
        ? options.callToJSON
        : DEFAULT_OPTIONS.callToJSON,
    colors:
      options && options.highlight
        ? getColorsHighlight(options)
        : getColorsEmpty(),
    compareKeys:
      options && typeof options.compareKeys === 'function'
        ? options.compareKeys
        : DEFAULT_OPTIONS.compareKeys,
    escapeRegex: getEscapeRegex(options),
    escapeString: getEscapeString(options),
    indent:
      options && options.min
        ? ''
        : createIndent(
            options && options.indent !== undefined
              ? options.indent
              : DEFAULT_OPTIONS.indent
          ),
    maxDepth:
      options && options.maxDepth !== undefined
        ? options.maxDepth
        : DEFAULT_OPTIONS.maxDepth,
    min:
      options && options.min !== undefined ? options.min : DEFAULT_OPTIONS.min,
    plugins:
      options && options.plugins !== undefined
        ? options.plugins
        : DEFAULT_OPTIONS.plugins,
    printBasicPrototype:
      (_options$printBasicPr =
        options === null || options === void 0
          ? void 0
          : options.printBasicPrototype) !== null &&
      _options$printBasicPr !== void 0
        ? _options$printBasicPr
        : true,
    printFunctionName: getPrintFunctionName(options),
    spacingInner: options && options.min ? ' ' : '\n',
    spacingOuter: options && options.min ? '' : '\n'
  };
};

function createIndent(indent) {
  return new Array(indent + 1).join(' ');
}
/**
 * Returns a presentation string of your `val` object
 * @param val any potential JavaScript object
 * @param options Custom settings
 */

function format(val, options) {
  if (options) {
    validateOptions(options);

    if (options.plugins) {
      const plugin = findPlugin(options.plugins, val);

      if (plugin !== null) {
        return printPlugin(plugin, val, getConfig(options), '', 0, []);
      }
    }
  }

  const basicResult = printBasicValue(
    val,
    getPrintFunctionName(options),
    getEscapeRegex(options),
    getEscapeString(options)
  );

  if (basicResult !== null) {
    return basicResult;
  }

  return printComplexValue(val, getConfig(options), '', 0, []);
}

const plugins = {
  AsymmetricMatcher: _AsymmetricMatcher.default,
  ConvertAnsi: _ConvertAnsi.default,
  DOMCollection: _DOMCollection.default,
  DOMElement: _DOMElement.default,
  Immutable: _Immutable.default,
  ReactElement: _ReactElement.default,
  ReactTestComponent: _ReactTestComponent.default
};
plugins_1 = build.plugins = plugins;
var _default = format;
build.default = _default;

const {
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent,
  AsymmetricMatcher
} = plugins_1;
let PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher
];
const addSerializer = (plugin) => {
  PLUGINS = [plugin].concat(PLUGINS);
};
const getSerializers = () => PLUGINS;

function equals(a, b, customTesters, strictCheck) {
  customTesters = customTesters || [];
  return eq(a, b, [], [], customTesters, strictCheck ? hasKey : hasDefinedKey);
}
function isAsymmetric(obj) {
  return !!obj && isA("Function", obj.asymmetricMatch);
}
function asymmetricMatch(a, b) {
  const asymmetricA = isAsymmetric(a);
  const asymmetricB = isAsymmetric(b);
  if (asymmetricA && asymmetricB)
    return void 0;
  if (asymmetricA)
    return a.asymmetricMatch(b);
  if (asymmetricB)
    return b.asymmetricMatch(a);
}
function eq(a, b, aStack, bStack, customTesters, hasKey2) {
  let result = true;
  const asymmetricResult = asymmetricMatch(a, b);
  if (asymmetricResult !== void 0)
    return asymmetricResult;
  for (let i = 0; i < customTesters.length; i++) {
    const customTesterResult = customTesters[i](a, b);
    if (customTesterResult !== void 0)
      return customTesterResult;
  }
  if (a instanceof Error && b instanceof Error)
    return a.message === b.message;
  if (Object.is(a, b))
    return true;
  if (a === null || b === null)
    return a === b;
  const className = Object.prototype.toString.call(a);
  if (className !== Object.prototype.toString.call(b))
    return false;
  switch (className) {
    case "[object Boolean]":
    case "[object String]":
    case "[object Number]":
      if (typeof a !== typeof b) {
        return false;
      } else if (typeof a !== "object" && typeof b !== "object") {
        return Object.is(a, b);
      } else {
        return Object.is(a.valueOf(), b.valueOf());
      }
    case "[object Date]":
      return +a === +b;
    case "[object RegExp]":
      return a.source === b.source && a.flags === b.flags;
  }
  if (typeof a !== "object" || typeof b !== "object")
    return false;
  if (isDomNode(a) && isDomNode(b))
    return a.isEqualNode(b);
  let length = aStack.length;
  while (length--) {
    if (aStack[length] === a)
      return bStack[length] === b;
    else if (bStack[length] === b)
      return false;
  }
  aStack.push(a);
  bStack.push(b);
  if (className === "[object Array]" && a.length !== b.length)
    return false;
  const aKeys = keys(a, hasKey2);
  let key;
  let size = aKeys.length;
  if (keys(b, hasKey2).length !== size)
    return false;
  while (size--) {
    key = aKeys[size];
    result = hasKey2(b, key) && eq(a[key], b[key], aStack, bStack, customTesters, hasKey2);
    if (!result)
      return false;
  }
  aStack.pop();
  bStack.pop();
  return result;
}
function keys(obj, hasKey2) {
  const keys2 = [];
  for (const key in obj) {
    if (hasKey2(obj, key))
      keys2.push(key);
  }
  return keys2.concat(Object.getOwnPropertySymbols(obj).filter((symbol) => Object.getOwnPropertyDescriptor(obj, symbol).enumerable));
}
function hasDefinedKey(obj, key) {
  return hasKey(obj, key) && obj[key] !== void 0;
}
function hasKey(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function isA(typeName, value) {
  return Object.prototype.toString.apply(value) === `[object ${typeName}]`;
}
function isDomNode(obj) {
  return obj !== null && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string" && typeof obj.isEqualNode === "function";
}
const IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
const IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
const IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
function isImmutableUnorderedKeyed(maybeKeyed) {
  return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL] && !maybeKeyed[IS_ORDERED_SENTINEL]);
}
function isImmutableUnorderedSet(maybeSet) {
  return !!(maybeSet && maybeSet[IS_SET_SENTINEL] && !maybeSet[IS_ORDERED_SENTINEL]);
}
const IteratorSymbol = Symbol.iterator;
const hasIterator = (object) => !!(object != null && object[IteratorSymbol]);
const iterableEquality = (a, b, aStack = [], bStack = []) => {
  if (typeof a !== "object" || typeof b !== "object" || Array.isArray(a) || Array.isArray(b) || !hasIterator(a) || !hasIterator(b))
    return void 0;
  if (a.constructor !== b.constructor)
    return false;
  let length = aStack.length;
  while (length--) {
    if (aStack[length] === a)
      return bStack[length] === b;
  }
  aStack.push(a);
  bStack.push(b);
  const iterableEqualityWithStack = (a2, b2) => iterableEquality(a2, b2, [...aStack], [...bStack]);
  if (a.size !== void 0) {
    if (a.size !== b.size) {
      return false;
    } else if (isA("Set", a) || isImmutableUnorderedSet(a)) {
      let allFound = true;
      for (const aValue of a) {
        if (!b.has(aValue)) {
          let has = false;
          for (const bValue of b) {
            const isEqual = equals(aValue, bValue, [iterableEqualityWithStack]);
            if (isEqual === true)
              has = true;
          }
          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return allFound;
    } else if (isA("Map", a) || isImmutableUnorderedKeyed(a)) {
      let allFound = true;
      for (const aEntry of a) {
        if (!b.has(aEntry[0]) || !equals(aEntry[1], b.get(aEntry[0]), [iterableEqualityWithStack])) {
          let has = false;
          for (const bEntry of b) {
            const matchedKey = equals(aEntry[0], bEntry[0], [
              iterableEqualityWithStack
            ]);
            let matchedValue = false;
            if (matchedKey === true) {
              matchedValue = equals(aEntry[1], bEntry[1], [
                iterableEqualityWithStack
              ]);
            }
            if (matchedValue === true)
              has = true;
          }
          if (has === false) {
            allFound = false;
            break;
          }
        }
      }
      aStack.pop();
      bStack.pop();
      return allFound;
    }
  }
  const bIterator = b[IteratorSymbol]();
  for (const aValue of a) {
    const nextB = bIterator.next();
    if (nextB.done || !equals(aValue, nextB.value, [iterableEqualityWithStack]))
      return false;
  }
  if (!bIterator.next().done)
    return false;
  aStack.pop();
  bStack.pop();
  return true;
};
const hasPropertyInObject = (object, key) => {
  const shouldTerminate = !object || typeof object !== "object" || object === Object.prototype;
  if (shouldTerminate)
    return false;
  return Object.prototype.hasOwnProperty.call(object, key) || hasPropertyInObject(Object.getPrototypeOf(object), key);
};
const isObjectWithKeys = (a) => isObject(a) && !(a instanceof Error) && !(a instanceof Array) && !(a instanceof Date);
const subsetEquality = (object, subset) => {
  const subsetEqualityWithContext = (seenReferences = new WeakMap()) => (object2, subset2) => {
    if (!isObjectWithKeys(subset2))
      return void 0;
    return Object.keys(subset2).every((key) => {
      if (isObjectWithKeys(subset2[key])) {
        if (seenReferences.has(subset2[key]))
          return equals(object2[key], subset2[key], [iterableEquality]);
        seenReferences.set(subset2[key], true);
      }
      const result = object2 != null && hasPropertyInObject(object2, key) && equals(object2[key], subset2[key], [
        iterableEquality,
        subsetEqualityWithContext(seenReferences)
      ]);
      seenReferences.delete(subset2[key]);
      return result;
    });
  };
  return subsetEqualityWithContext()(object, subset);
};
const typeEquality = (a, b) => {
  if (a == null || b == null || a.constructor === b.constructor)
    return void 0;
  return false;
};
const arrayBufferEquality = (a, b) => {
  if (!(a instanceof ArrayBuffer) || !(b instanceof ArrayBuffer))
    return void 0;
  const dataViewA = new DataView(a);
  const dataViewB = new DataView(b);
  if (dataViewA.byteLength !== dataViewB.byteLength)
    return false;
  for (let i = 0; i < dataViewA.byteLength; i++) {
    if (dataViewA.getUint8(i) !== dataViewB.getUint8(i))
      return false;
  }
  return true;
};
const sparseArrayEquality = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b))
    return void 0;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  return equals(a, b, [iterableEquality, typeEquality], true) && equals(aKeys, bKeys);
};

const MATCHERS_OBJECT = Symbol.for("matchers-object");
if (!Object.prototype.hasOwnProperty.call(global, MATCHERS_OBJECT)) {
  const defaultState = {
    assertionCalls: 0,
    isExpectingAssertions: false,
    isExpectingAssertionsError: null,
    expectedAssertionsNumber: null,
    expectedAssertionsNumberError: null
  };
  Object.defineProperty(global, MATCHERS_OBJECT, {
    value: {
      state: defaultState
    }
  });
}
const getState = () => global[MATCHERS_OBJECT].state;
const setState = (state) => {
  Object.assign(global[MATCHERS_OBJECT].state, state);
};
const JestChaiExpect = (chai, utils) => {
  function def(name, fn) {
    const addMethod = (n) => {
      utils.addMethod(chai.Assertion.prototype, n, fn);
    };
    if (Array.isArray(name))
      name.forEach((n) => addMethod(n));
    else
      addMethod(name);
  }
  ["throw", "throws", "Throw"].forEach((m) => {
    utils.overwriteMethod(chai.Assertion.prototype, m, (_super) => {
      return function(...args) {
        const promise = utils.flag(this, "promise");
        const object = utils.flag(this, "object");
        if (promise === "rejects") {
          utils.flag(this, "object", () => {
            throw object;
          });
        }
        _super.apply(this, args);
      };
    });
  });
  def("toEqual", function(expected) {
    const actual = utils.flag(this, "object");
    const equal = equals(actual, expected, [iterableEquality]);
    return this.assert(equal, "expected #{this} to deeply equal #{exp}", "expected #{this} to not deeply equal #{exp}", expected, actual);
  });
  def("toStrictEqual", function(expected) {
    const obj = utils.flag(this, "object");
    const equal = equals(obj, expected, [
      iterableEquality,
      typeEquality,
      sparseArrayEquality,
      arrayBufferEquality
    ], true);
    return this.assert(equal, "expected #{this} to strictly equal #{exp}", "expected #{this} to not strictly equal #{exp}", expected, obj);
  });
  def("toBe", function(expected) {
    const actual = this._obj;
    return this.assert(Object.is(actual, expected), "expected #{this} to be #{exp} // Object.is equality", "expected #{this} not to be #{exp} // Object.is equality", expected, actual);
  });
  def("toMatchObject", function(expected) {
    const actual = this._obj;
    return this.assert(equals(actual, expected, [iterableEquality, subsetEquality]), "expected #{this} to match object #{exp}", "expected #{this} to not match object #{exp}", expected, actual);
  });
  def("toMatch", function(expected) {
    if (typeof expected === "string")
      return this.include(expected);
    else
      return this.match(expected);
  });
  def("toContain", function(item) {
    return this.contain(item);
  });
  def("toContainEqual", function(expected) {
    const obj = utils.flag(this, "object");
    const index = Array.from(obj).findIndex((item) => {
      return equals(item, expected);
    });
    this.assert(index !== -1, "expected #{this} to deep equally contain #{exp}", "expected #{this} to not deep equally contain #{exp}", expected);
  });
  def("toBeTruthy", function() {
    const obj = utils.flag(this, "object");
    this.assert(Boolean(obj), "expected #{this} to be truthy", "expected #{this} to not be truthy", obj);
  });
  def("toBeFalsy", function() {
    const obj = utils.flag(this, "object");
    this.assert(!obj, "expected #{this} to be falsy", "expected #{this} to not be falsy", obj);
  });
  def("toBeGreaterThan", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual > expected, `expected ${actual} to be greater than ${expected}`, `expected ${actual} to be not greater than ${expected}`, actual, expected);
  });
  def("toBeGreaterThanOrEqual", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual >= expected, `expected ${actual} to be greater than or equal to ${expected}`, `expected ${actual} to be not greater than or equal to ${expected}`, actual, expected);
  });
  def("toBeLessThan", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual < expected, `expected ${actual} to be less than ${expected}`, `expected ${actual} to be not less than ${expected}`, actual, expected);
  });
  def("toBeLessThanOrEqual", function(expected) {
    const actual = this._obj;
    assertTypes(actual, "actual", ["number", "bigint"]);
    assertTypes(expected, "expected", ["number", "bigint"]);
    return this.assert(actual <= expected, `expected ${actual} to be less than or equal to ${expected}`, `expected ${actual} to be not less than or equal to ${expected}`, actual, expected);
  });
  def("toBeNaN", function() {
    return this.be.NaN;
  });
  def("toBeUndefined", function() {
    return this.be.undefined;
  });
  def("toBeNull", function() {
    return this.be.null;
  });
  def("toBeDefined", function() {
    const negate = utils.flag(this, "negate");
    utils.flag(this, "negate", false);
    if (negate)
      return this.be.undefined;
    return this.not.be.undefined;
  });
  def("toBeTypeOf", function(expected) {
    const actual = typeof this._obj;
    const equal = expected === actual;
    return this.assert(equal, "expected #{this} to be type of #{exp}", "expected #{this} not to be type of #{exp}", expected, actual);
  });
  def("toBeInstanceOf", function(obj) {
    return this.instanceOf(obj);
  });
  def("toHaveLength", function(length) {
    return this.have.length(length);
  });
  def("toHaveProperty", function(...args) {
    return this.have.deep.nested.property(...args);
  });
  def("toBeCloseTo", function(received, precision = 2) {
    const expected = this._obj;
    let pass = false;
    let expectedDiff = 0;
    let receivedDiff = 0;
    if (received === Infinity && expected === Infinity) {
      pass = true;
    } else if (received === -Infinity && expected === -Infinity) {
      pass = true;
    } else {
      expectedDiff = Math.pow(10, -precision) / 2;
      receivedDiff = Math.abs(expected - received);
      pass = receivedDiff < expectedDiff;
    }
    return this.assert(pass, `expected #{this} to be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, `expected #{this} to not be close to #{exp}, received difference is ${receivedDiff}, but expected ${expectedDiff}`, received, expected);
  });
  const assertIsMock = (assertion) => {
    if (!isMockFunction(assertion._obj))
      throw new TypeError(`${utils.inspect(assertion._obj)} is not a spy or a call to a spy!`);
  };
  const getSpy = (assertion) => {
    assertIsMock(assertion);
    return assertion._obj;
  };
  def(["toHaveBeenCalledTimes", "toBeCalledTimes"], function(number) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const callCount = spy.mock.calls.length;
    return this.assert(callCount === number, `expected "${spyName}" to be called #{exp} times`, `expected "${spyName}" to not be called #{exp} times`, number, callCount);
  });
  def("toHaveBeenCalledOnce", function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const callCount = spy.mock.calls.length;
    return this.assert(callCount === 1, `expected "${spyName}" to be called once`, `expected "${spyName}" to not be called once`, 1, callCount);
  });
  def(["toHaveBeenCalled", "toBeCalled"], function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const called = spy.mock.calls.length > 0;
    return this.assert(called, `expected "${spyName}" to be called at least once`, `expected "${spyName}" to not be called at all`, true, called);
  });
  def(["toHaveBeenCalledWith", "toBeCalledWith"], function(...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const pass = spy.mock.calls.some((callArg) => equals(callArg, args, [iterableEquality]));
    return this.assert(pass, `expected "${spyName}" to be called with arguments: #{exp}`, `expected "${spyName}" to not be called with arguments: #{exp}`, args, spy.mock.calls);
  });
  const ordinalOf = (i) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11)
      return `${i}st`;
    if (j === 2 && k !== 12)
      return `${i}nd`;
    if (j === 3 && k !== 13)
      return `${i}rd`;
    return `${i}th`;
  };
  def(["toHaveBeenNthCalledWith", "nthCalledWith"], function(times, ...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const nthCall = spy.mock.calls[times - 1];
    this.assert(equals(nthCall, args, [iterableEquality]), `expected ${ordinalOf(times)} "${spyName}" call to have been called with #{exp}`, `expected ${ordinalOf(times)} "${spyName}" call to not have been called with #{exp}`, args, nthCall);
  });
  def(["toHaveBeenLastCalledWith", "lastCalledWith"], function(...args) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const lastCall = spy.mock.calls[spy.calls.length - 1];
    this.assert(equals(lastCall, args, [iterableEquality]), `expected last "${spyName}" call to have been called with #{exp}`, `expected last "${spyName}" call to not have been called with #{exp}`, args, lastCall);
  });
  def(["toThrow", "toThrowError"], function(expected) {
    const obj = this._obj;
    const promise = utils.flag(this, "promise");
    let thrown = null;
    if (promise) {
      thrown = obj;
    } else {
      try {
        obj();
      } catch (err) {
        thrown = err;
      }
    }
    if (typeof expected === "function") {
      const name = expected.name || expected.prototype.constructor.name;
      return this.assert(thrown && thrown instanceof expected, `expected error to be instance of ${name}`, `expected error not to be instance of ${name}`, expected, thrown);
    }
    if (expected && expected instanceof Error) {
      return this.assert(thrown && expected.message === thrown.message, `expected error to have message: ${expected.message}`, `expected error not to have message: ${expected.message}`, expected.message, thrown && thrown.message);
    }
    if (expected && typeof expected.asymmetricMatch === "function") {
      const matcher = expected;
      return this.assert(thrown && matcher.asymmetricMatch(thrown), "expected error to match asymmetric matcher", "expected error not to match asymmetric matcher", matcher.toString(), thrown);
    }
    return this.to.throws(expected);
  });
  def(["toHaveReturned", "toReturn"], function() {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const calledAndNotThrew = spy.mock.calls.length > 0 && !spy.mock.results.some(({ type }) => type === "throw");
    this.assert(calledAndNotThrew, `expected "${spyName}" to be successfully called at least once`, `expected "${spyName}" to not be successfully called`, calledAndNotThrew, !calledAndNotThrew);
  });
  def(["toHaveReturnedTimes", "toReturnTimes"], function(times) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const successfullReturns = spy.mock.results.reduce((success, { type }) => type === "throw" ? success : ++success, 0);
    this.assert(successfullReturns === times, `expected "${spyName}" to be successfully called ${times} times`, `expected "${spyName}" to not be successfully called ${times} times`, `expected number of returns: ${times}`, `received number of returns: ${successfullReturns}`);
  });
  def(["toHaveReturnedWith", "toReturnWith"], function(value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const pass = spy.mock.results.some(({ type, value: result }) => type === "return" && equals(value, result));
    this.assert(pass, `expected "${spyName}" to be successfully called with #{exp}`, `expected "${spyName}" to not be successfully called with #{exp}`, value);
  });
  def(["toHaveLastReturnedWith", "lastReturnedWith"], function(value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const { value: lastResult } = spy.mock.results[spy.returns.length - 1];
    const pass = equals(lastResult, value);
    this.assert(pass, `expected last "${spyName}" call to return #{exp}`, `expected last "${spyName}" call to not return #{exp}`, value, lastResult);
  });
  def(["toHaveNthReturnedWith", "nthReturnedWith"], function(nthCall, value) {
    const spy = getSpy(this);
    const spyName = spy.getMockName();
    const isNot = utils.flag(this, "negate");
    const { type: callType, value: callResult } = spy.mock.results[nthCall - 1];
    const ordinalCall = `${ordinalOf(nthCall)} call`;
    if (!isNot && callType === "throw")
      chai.assert.fail(`expected ${ordinalCall} to return #{exp}, but instead it threw an error`);
    const nthCallReturn = equals(callResult, value);
    this.assert(nthCallReturn, `expected ${ordinalCall} "${spyName}" call to return #{exp}`, `expected ${ordinalCall} "${spyName}" call to not return #{exp}`, value, callResult);
  });
  utils.addProperty(chai.Assertion.prototype, "resolves", function __VITEST_RESOLVES__() {
    utils.flag(this, "promise", "resolves");
    utils.flag(this, "error", new Error("resolves"));
    const obj = utils.flag(this, "object");
    const proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        const result = Reflect.get(target, key, receiver);
        if (typeof result !== "function")
          return result instanceof chai.Assertion ? proxy : result;
        return async (...args) => {
          return obj.then((value) => {
            utils.flag(this, "object", value);
            return result.call(this, ...args);
          }, (err) => {
            throw new Error(`promise rejected "${err}" instead of resolving`);
          });
        };
      }
    });
    return proxy;
  });
  utils.addProperty(chai.Assertion.prototype, "rejects", function __VITEST_REJECTS__() {
    utils.flag(this, "promise", "rejects");
    utils.flag(this, "error", new Error("rejects"));
    const obj = utils.flag(this, "object");
    const wrapper = typeof obj === "function" ? obj() : obj;
    const proxy = new Proxy(this, {
      get: (target, key, receiver) => {
        const result = Reflect.get(target, key, receiver);
        if (typeof result !== "function")
          return result instanceof chai.Assertion ? proxy : result;
        return async (...args) => {
          return wrapper.then((value) => {
            throw new Error(`promise resolved "${value}" instead of rejecting`);
          }, (err) => {
            utils.flag(this, "object", err);
            return result.call(this, ...args);
          });
        };
      }
    });
    return proxy;
  });
  utils.addMethod(chai.expect, "assertions", function assertions(expected) {
    const error = new Error(`expected number of assertions to be ${expected}, but got ${getState().assertionCalls}`);
    if (Error.captureStackTrace)
      Error.captureStackTrace(error, assertions);
    setState({
      expectedAssertionsNumber: expected,
      expectedAssertionsNumberError: error
    });
  });
  utils.addMethod(chai.expect, "hasAssertions", function hasAssertions() {
    const error = new Error("expected any number of assertion, but got none");
    if (Error.captureStackTrace)
      Error.captureStackTrace(error, hasAssertions);
    setState({
      isExpectingAssertions: true,
      isExpectingAssertionsError: error
    });
  });
  utils.addMethod(chai.expect, "addSnapshotSerializer", addSerializer);
};

/**
 * A reference to the global object
 *
 * @type {object} globalObject
 */
var globalObject$1;

/* istanbul ignore else */
if (typeof commonjsGlobal !== "undefined") {
    // Node
    globalObject$1 = commonjsGlobal;
} else if (typeof window !== "undefined") {
    // Browser
    globalObject$1 = window;
} else {
    // WebWorker
    globalObject$1 = self;
}

var global$1 = globalObject$1;

var call = Function.call;

var copyPrototype$6 = function copyPrototypeMethods(prototype) {
    // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
    return Object.getOwnPropertyNames(prototype).reduce(function(result, name) {
        // ignore size because it throws from Map
        if (
            name !== "size" &&
            name !== "caller" &&
            name !== "callee" &&
            name !== "arguments" &&
            typeof prototype[name] === "function"
        ) {
            result[name] = call.bind(prototype[name]);
        }

        return result;
    }, Object.create(null));
};

var copyPrototype$5 = copyPrototype$6;

var array = copyPrototype$5(Array.prototype);

var every$1 = array.every;

/**
 * @private
 */
function hasCallsLeft(callMap, spy) {
    if (callMap[spy.id] === undefined) {
        callMap[spy.id] = 0;
    }

    return callMap[spy.id] < spy.callCount;
}

/**
 * @private
 */
function checkAdjacentCalls(callMap, spy, index, spies) {
    var calledBeforeNext = true;

    if (index !== spies.length - 1) {
        calledBeforeNext = spy.calledBefore(spies[index + 1]);
    }

    if (hasCallsLeft(callMap, spy) && calledBeforeNext) {
        callMap[spy.id] += 1;
        return true;
    }

    return false;
}

/**
 * A Sinon proxy object (fake, spy, stub)
 *
 * @typedef {object} SinonProxy
 * @property {Function} calledBefore - A method that determines if this proxy was called before another one
 * @property {string} id - Some id
 * @property {number} callCount - Number of times this proxy has been called
 */

/**
 * Returns true when the spies have been called in the order they were supplied in
 *
 * @param  {SinonProxy[] | SinonProxy} spies An array of proxies, or several proxies as arguments
 * @returns {boolean} true when spies are called in order, false otherwise
 */
function calledInOrder(spies) {
    var callMap = {};
    // eslint-disable-next-line no-underscore-dangle
    var _spies = arguments.length > 1 ? arguments : spies;

    return every$1(_spies, checkAdjacentCalls.bind(null, callMap));
}

var calledInOrder_1 = calledInOrder;

/**
 * Returns a display name for a function
 *
 * @param  {Function} func
 * @returns {string}
 */
var functionName$1 = function functionName(func) {
    if (!func) {
        return "";
    }

    try {
        return (
            func.displayName ||
            func.name ||
            // Use function decomposition as a last resort to get function
            // name. Does not rely on function decomposition to work - if it
            // doesn't debugging will be slightly less informative
            // (i.e. toString will say 'spy' rather than 'myFunc').
            (String(func).match(/function ([^\s(]+)/) || [])[1]
        );
    } catch (e) {
        // Stringify may fail and we might get an exception, as a last-last
        // resort fall back to empty string.
        return "";
    }
};

var functionName = functionName$1;

/**
 * Returns a display name for a value from a constructor
 *
 * @param  {object} value A value to examine
 * @returns {(string|null)} A string or null
 */
function className(value) {
    return (
        (value.constructor && value.constructor.name) ||
        // The next branch is for IE11 support only:
        // Because the name property is not set on the prototype
        // of the Function object, we finally try to grab the
        // name from its definition. This will never be reached
        // in node, so we are not able to test this properly.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
        (typeof value.constructor === "function" &&
            /* istanbul ignore next */
            functionName(value.constructor)) ||
        null
    );
}

var className_1 = className;

var deprecated = {};

/* eslint-disable no-console */

(function (exports) {

/**
 * Returns a function that will invoke the supplied function and print a
 * deprecation warning to the console each time it is called.
 *
 * @param  {Function} func
 * @param  {string} msg
 * @returns {Function}
 */
exports.wrap = function(func, msg) {
    var wrapped = function() {
        exports.printWarning(msg);
        return func.apply(this, arguments);
    };
    if (func.prototype) {
        wrapped.prototype = func.prototype;
    }
    return wrapped;
};

/**
 * Returns a string which can be supplied to `wrap()` to notify the user that a
 * particular part of the sinon API has been deprecated.
 *
 * @param  {string} packageName
 * @param  {string} funcName
 * @returns {string}
 */
exports.defaultMsg = function(packageName, funcName) {
    return (
        packageName +
        "." +
        funcName +
        " is deprecated and will be removed from the public API in a future version of " +
        packageName +
        "."
    );
};

/**
 * Prints a warning on the console, when it exists
 *
 * @param  {string} msg
 * @returns {undefined}
 */
exports.printWarning = function(msg) {
    /* istanbul ignore next */
    if (typeof process === "object" && process.emitWarning) {
        // Emit Warnings in Node
        process.emitWarning(msg);
    } else if (console.info) {
        console.info(msg);
    } else {
        console.log(msg);
    }
};
}(deprecated));

/**
 * Returns true when fn returns true for all members of obj.
 * This is an every implementation that works for all iterables
 *
 * @param  {object}   obj
 * @param  {Function} fn
 * @returns {boolean}
 */
var every = function every(obj, fn) {
    var pass = true;

    try {
        // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
        obj.forEach(function() {
            if (!fn.apply(this, arguments)) {
                // Throwing an error is the only way to break `forEach`
                throw new Error();
            }
        });
    } catch (e) {
        pass = false;
    }

    return pass;
};

var sort = array.sort;
var slice = array.slice;

/**
 * @private
 */
function comparator(a, b) {
    // uuid, won't ever be equal
    var aCall = a.getCall(0);
    var bCall = b.getCall(0);
    var aId = (aCall && aCall.callId) || -1;
    var bId = (bCall && bCall.callId) || -1;

    return aId < bId ? -1 : 1;
}

/**
 * A Sinon proxy object (fake, spy, stub)
 *
 * @typedef {object} SinonProxy
 * @property {Function} getCall - A method that can return the first call
 */

/**
 * Sorts an array of SinonProxy instances (fake, spy, stub) by their first call
 *
 * @param  {SinonProxy[] | SinonProxy} spies
 * @returns {SinonProxy[]}
 */
function orderByFirstCall(spies) {
    return sort(slice(spies), comparator);
}

var orderByFirstCall_1 = orderByFirstCall;

var copyPrototype$4 = copyPrototype$6;

var _function = copyPrototype$4(Function.prototype);

var copyPrototype$3 = copyPrototype$6;

var map = copyPrototype$3(Map.prototype);

var copyPrototype$2 = copyPrototype$6;

var object = copyPrototype$2(Object.prototype);

var copyPrototype$1 = copyPrototype$6;

var set = copyPrototype$1(Set.prototype);

var copyPrototype = copyPrototype$6;

var string = copyPrototype(String.prototype);

var prototypes = {
    array: array,
    function: _function,
    map: map,
    object: object,
    set: set,
    string: string
};

var typeDetect = {exports: {}};

(function (module, exports) {
(function (global, factory) {
	module.exports = factory() ;
}(commonjsGlobal, (function () {
/* !
 * type-detect
 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var promiseExists = typeof Promise === 'function';

/* eslint-disable no-undef */
var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
/**
 * ### typeOf (obj)
 *
 * Uses `Object.prototype.toString` to determine the type of an object,
 * normalising behaviour across engine versions & well optimised.
 *
 * @param {Mixed} object
 * @return {String} object type
 * @api public
 */
function typeDetect(obj) {
  /* ! Speed optimisation
   * Pre:
   *   string literal     x 3,039,035 ops/sec ??1.62% (78 runs sampled)
   *   boolean literal    x 1,424,138 ops/sec ??4.54% (75 runs sampled)
   *   number literal     x 1,653,153 ops/sec ??1.91% (82 runs sampled)
   *   undefined          x 9,978,660 ops/sec ??1.92% (75 runs sampled)
   *   function           x 2,556,769 ops/sec ??1.73% (77 runs sampled)
   * Post:
   *   string literal     x 38,564,796 ops/sec ??1.15% (79 runs sampled)
   *   boolean literal    x 31,148,940 ops/sec ??1.10% (79 runs sampled)
   *   number literal     x 32,679,330 ops/sec ??1.90% (78 runs sampled)
   *   undefined          x 32,363,368 ops/sec ??1.07% (82 runs sampled)
   *   function           x 31,296,870 ops/sec ??0.96% (83 runs sampled)
   */
  var typeofObj = typeof obj;
  if (typeofObj !== 'object') {
    return typeofObj;
  }

  /* ! Speed optimisation
   * Pre:
   *   null               x 28,645,765 ops/sec ??1.17% (82 runs sampled)
   * Post:
   *   null               x 36,428,962 ops/sec ??1.37% (84 runs sampled)
   */
  if (obj === null) {
    return 'null';
  }

  /* ! Spec Conformance
   * Test: `Object.prototype.toString.call(window)``
   *  - Node === "[object global]"
   *  - Chrome === "[object global]"
   *  - Firefox === "[object Window]"
   *  - PhantomJS === "[object Window]"
   *  - Safari === "[object Window]"
   *  - IE 11 === "[object Window]"
   *  - IE Edge === "[object Window]"
   * Test: `Object.prototype.toString.call(this)``
   *  - Chrome Worker === "[object global]"
   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
   *  - IE 11 Worker === "[object WorkerGlobalScope]"
   *  - IE Edge Worker === "[object WorkerGlobalScope]"
   */
  if (obj === globalObject) {
    return 'global';
  }

  /* ! Speed optimisation
   * Pre:
   *   array literal      x 2,888,352 ops/sec ??0.67% (82 runs sampled)
   * Post:
   *   array literal      x 22,479,650 ops/sec ??0.96% (81 runs sampled)
   */
  if (
    Array.isArray(obj) &&
    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
  ) {
    return 'Array';
  }

  // Not caching existence of `window` and related properties due to potential
  // for `window` to be unset before tests in quasi-browser environments.
  if (typeof window === 'object' && window !== null) {
    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
     * WhatWG HTML$7.7.3 - The `Location` interface
     * Test: `Object.prototype.toString.call(window.location)``
     *  - IE <=11 === "[object Object]"
     *  - IE Edge <=13 === "[object Object]"
     */
    if (typeof window.location === 'object' && obj === window.location) {
      return 'Location';
    }

    /* ! Spec Conformance
     * (https://html.spec.whatwg.org/#document)
     * WhatWG HTML$3.1.1 - The `Document` object
     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
     *       which suggests that browsers should use HTMLTableCellElement for
     *       both TD and TH elements. WhatWG separates these.
     *       WhatWG HTML states:
     *         > For historical reasons, Window objects must also have a
     *         > writable, configurable, non-enumerable property named
     *         > HTMLDocument whose value is the Document interface object.
     * Test: `Object.prototype.toString.call(document)``
     *  - Chrome === "[object HTMLDocument]"
     *  - Firefox === "[object HTMLDocument]"
     *  - Safari === "[object HTMLDocument]"
     *  - IE <=10 === "[object Document]"
     *  - IE 11 === "[object HTMLDocument]"
     *  - IE Edge <=13 === "[object HTMLDocument]"
     */
    if (typeof window.document === 'object' && obj === window.document) {
      return 'Document';
    }

    if (typeof window.navigator === 'object') {
      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
       *  - IE <=10 === "[object MSMimeTypesCollection]"
       */
      if (typeof window.navigator.mimeTypes === 'object' &&
          obj === window.navigator.mimeTypes) {
        return 'MimeTypeArray';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
       * Test: `Object.prototype.toString.call(navigator.plugins)``
       *  - IE <=10 === "[object MSPluginsCollection]"
       */
      if (typeof window.navigator.plugins === 'object' &&
          obj === window.navigator.plugins) {
        return 'PluginArray';
      }
    }

    if ((typeof window.HTMLElement === 'function' ||
        typeof window.HTMLElement === 'object') &&
        obj instanceof window.HTMLElement) {
      /* ! Spec Conformance
      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
      *  - IE <=10 === "[object HTMLBlockElement]"
      */
      if (obj.tagName === 'BLOCKQUOTE') {
        return 'HTMLQuoteElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('td'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TD') {
        return 'HTMLTableDataCellElement';
      }

      /* ! Spec Conformance
       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
       *       which suggests that browsers should use HTMLTableCellElement for
       *       both TD and TH elements. WhatWG separates these.
       * Test: Object.prototype.toString.call(document.createElement('th'))
       *  - Chrome === "[object HTMLTableCellElement]"
       *  - Firefox === "[object HTMLTableCellElement]"
       *  - Safari === "[object HTMLTableCellElement]"
       */
      if (obj.tagName === 'TH') {
        return 'HTMLTableHeaderCellElement';
      }
    }
  }

  /* ! Speed optimisation
  * Pre:
  *   Float64Array       x 625,644 ops/sec ??1.58% (80 runs sampled)
  *   Float32Array       x 1,279,852 ops/sec ??2.91% (77 runs sampled)
  *   Uint32Array        x 1,178,185 ops/sec ??1.95% (83 runs sampled)
  *   Uint16Array        x 1,008,380 ops/sec ??2.25% (80 runs sampled)
  *   Uint8Array         x 1,128,040 ops/sec ??2.11% (81 runs sampled)
  *   Int32Array         x 1,170,119 ops/sec ??2.88% (80 runs sampled)
  *   Int16Array         x 1,176,348 ops/sec ??5.79% (86 runs sampled)
  *   Int8Array          x 1,058,707 ops/sec ??4.94% (77 runs sampled)
  *   Uint8ClampedArray  x 1,110,633 ops/sec ??4.20% (80 runs sampled)
  * Post:
  *   Float64Array       x 7,105,671 ops/sec ??13.47% (64 runs sampled)
  *   Float32Array       x 5,887,912 ops/sec ??1.46% (82 runs sampled)
  *   Uint32Array        x 6,491,661 ops/sec ??1.76% (79 runs sampled)
  *   Uint16Array        x 6,559,795 ops/sec ??1.67% (82 runs sampled)
  *   Uint8Array         x 6,463,966 ops/sec ??1.43% (85 runs sampled)
  *   Int32Array         x 5,641,841 ops/sec ??3.49% (81 runs sampled)
  *   Int16Array         x 6,583,511 ops/sec ??1.98% (80 runs sampled)
  *   Int8Array          x 6,606,078 ops/sec ??1.74% (81 runs sampled)
  *   Uint8ClampedArray  x 6,602,224 ops/sec ??1.77% (83 runs sampled)
  */
  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
  if (typeof stringTag === 'string') {
    return stringTag;
  }

  var objPrototype = Object.getPrototypeOf(obj);
  /* ! Speed optimisation
  * Pre:
  *   regex literal      x 1,772,385 ops/sec ??1.85% (77 runs sampled)
  *   regex constructor  x 2,143,634 ops/sec ??2.46% (78 runs sampled)
  * Post:
  *   regex literal      x 3,928,009 ops/sec ??0.65% (78 runs sampled)
  *   regex constructor  x 3,931,108 ops/sec ??0.58% (84 runs sampled)
  */
  if (objPrototype === RegExp.prototype) {
    return 'RegExp';
  }

  /* ! Speed optimisation
  * Pre:
  *   date               x 2,130,074 ops/sec ??4.42% (68 runs sampled)
  * Post:
  *   date               x 3,953,779 ops/sec ??1.35% (77 runs sampled)
  */
  if (objPrototype === Date.prototype) {
    return 'Date';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
   * Test: `Object.prototype.toString.call(Promise.resolve())``
   *  - Chrome <=47 === "[object Object]"
   *  - Edge <=20 === "[object Object]"
   *  - Firefox 29-Latest === "[object Promise]"
   *  - Safari 7.1-Latest === "[object Promise]"
   */
  if (promiseExists && objPrototype === Promise.prototype) {
    return 'Promise';
  }

  /* ! Speed optimisation
  * Pre:
  *   set                x 2,222,186 ops/sec ??1.31% (82 runs sampled)
  * Post:
  *   set                x 4,545,879 ops/sec ??1.13% (83 runs sampled)
  */
  if (setExists && objPrototype === Set.prototype) {
    return 'Set';
  }

  /* ! Speed optimisation
  * Pre:
  *   map                x 2,396,842 ops/sec ??1.59% (81 runs sampled)
  * Post:
  *   map                x 4,183,945 ops/sec ??6.59% (82 runs sampled)
  */
  if (mapExists && objPrototype === Map.prototype) {
    return 'Map';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakset            x 1,323,220 ops/sec ??2.17% (76 runs sampled)
  * Post:
  *   weakset            x 4,237,510 ops/sec ??2.01% (77 runs sampled)
  */
  if (weakSetExists && objPrototype === WeakSet.prototype) {
    return 'WeakSet';
  }

  /* ! Speed optimisation
  * Pre:
  *   weakmap            x 1,500,260 ops/sec ??2.02% (78 runs sampled)
  * Post:
  *   weakmap            x 3,881,384 ops/sec ??1.45% (82 runs sampled)
  */
  if (weakMapExists && objPrototype === WeakMap.prototype) {
    return 'WeakMap';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
   *  - Edge <=13 === "[object Object]"
   */
  if (dataViewExists && objPrototype === DataView.prototype) {
    return 'DataView';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
   * Test: `Object.prototype.toString.call(new Map().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (mapExists && objPrototype === mapIteratorPrototype) {
    return 'Map Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
   * Test: `Object.prototype.toString.call(new Set().entries())``
   *  - Edge <=13 === "[object Object]"
   */
  if (setExists && objPrototype === setIteratorPrototype) {
    return 'Set Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
    return 'Array Iterator';
  }

  /* ! Spec Conformance
   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
   *  - Edge <=13 === "[object Object]"
   */
  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
    return 'String Iterator';
  }

  /* ! Speed optimisation
  * Pre:
  *   object from null   x 2,424,320 ops/sec ??1.67% (76 runs sampled)
  * Post:
  *   object from null   x 5,838,000 ops/sec ??0.99% (84 runs sampled)
  */
  if (objPrototype === null) {
    return 'Object';
  }

  return Object
    .prototype
    .toString
    .call(obj)
    .slice(toStringLeftSliceLength, toStringRightSliceLength);
}

return typeDetect;

})));
}(typeDetect));

var type = typeDetect.exports;

/**
 * Returns the lower-case result of running type from type-detect on the value
 *
 * @param  {*} value
 * @returns {string}
 */
var typeOf = function typeOf(value) {
    return type(value).toLowerCase();
};

/**
 * Returns a string representation of the value
 *
 * @param  {*} value
 * @returns {string}
 */
function valueToString(value) {
    if (value && value.toString) {
        // eslint-disable-next-line @sinonjs/no-prototype-methods/no-prototype-methods
        return value.toString();
    }
    return String(value);
}

var valueToString_1 = valueToString;

var lib = {
    global: global$1,
    calledInOrder: calledInOrder_1,
    className: className_1,
    deprecated: deprecated,
    every: every,
    functionName: functionName$1,
    orderByFirstCall: orderByFirstCall_1,
    prototypes: prototypes,
    typeOf: typeOf,
    valueToString: valueToString_1
};

const globalObject = lib.global;

/**
 * @typedef {object} IdleDeadline
 * @property {boolean} didTimeout - whether or not the callback was called before reaching the optional timeout
 * @property {function():number} timeRemaining - a floating-point value providing an estimate of the number of milliseconds remaining in the current idle period
 */

/**
 * Queues a function to be called during a browser's idle periods
 *
 * @callback RequestIdleCallback
 * @param {function(IdleDeadline)} callback
 * @param {{timeout: number}} options - an options object
 * @returns {number} the id
 */

/**
 * @callback NextTick
 * @param {VoidVarArgsFunc} callback - the callback to run
 * @param {...*} arguments - optional arguments to call the callback with
 * @returns {void}
 */

/**
 * @callback SetImmediate
 * @param {VoidVarArgsFunc} callback - the callback to run
 * @param {...*} arguments - optional arguments to call the callback with
 * @returns {NodeImmediate}
 */

/**
 * @callback VoidVarArgsFunc
 * @param {...*} callback - the callback to run
 * @returns {void}
 */

/**
 * @typedef RequestAnimationFrame
 * @property {function(number):void} requestAnimationFrame
 * @returns {number} - the id
 */

/**
 * @typedef Performance
 * @property {function(): number} now
 */

/* eslint-disable jsdoc/require-property-description */
/**
 * @typedef {object} Clock
 * @property {number} now - the current time
 * @property {Date} Date - the Date constructor
 * @property {number} loopLimit - the maximum number of timers before assuming an infinite loop
 * @property {RequestIdleCallback} requestIdleCallback
 * @property {function(number):void} cancelIdleCallback
 * @property {setTimeout} setTimeout
 * @property {clearTimeout} clearTimeout
 * @property {NextTick} nextTick
 * @property {queueMicrotask} queueMicrotask
 * @property {setInterval} setInterval
 * @property {clearInterval} clearInterval
 * @property {SetImmediate} setImmediate
 * @property {function(NodeImmediate):void} clearImmediate
 * @property {function():number} countTimers
 * @property {RequestAnimationFrame} requestAnimationFrame
 * @property {function(number):void} cancelAnimationFrame
 * @property {function():void} runMicrotasks
 * @property {function(string | number): number} tick
 * @property {function(string | number): Promise<number>} tickAsync
 * @property {function(): number} next
 * @property {function(): Promise<number>} nextAsync
 * @property {function(): number} runAll
 * @property {function(): number} runToFrame
 * @property {function(): Promise<number>} runAllAsync
 * @property {function(): number} runToLast
 * @property {function(): Promise<number>} runToLastAsync
 * @property {function(): void} reset
 * @property {function(number | Date): void} setSystemTime
 * @property {Performance} performance
 * @property {function(number[]): number[]} hrtime - process.hrtime (legacy)
 * @property {function(): void} uninstall Uninstall the clock.
 * @property {Function[]} methods - the methods that are faked
 * @property {boolean} [shouldClearNativeTimers] inherited from config
 */
/* eslint-enable jsdoc/require-property-description */

/**
 * Configuration object for the `install` method.
 *
 * @typedef {object} Config
 * @property {number|Date} [now] a number (in milliseconds) or a Date object (default epoch)
 * @property {string[]} [toFake] names of the methods that should be faked.
 * @property {number} [loopLimit] the maximum number of timers that will be run when calling runAll()
 * @property {boolean} [shouldAdvanceTime] tells FakeTimers to increment mocked time automatically (default false)
 * @property {number} [advanceTimeDelta] increment mocked time every <<advanceTimeDelta>> ms (default: 20ms)
 * @property {boolean} [shouldClearNativeTimers] forwards clear timer calls to native functions if they are not fakes (default: false)
 */

/* eslint-disable jsdoc/require-property-description */
/**
 * The internal structure to describe a scheduled fake timer
 *
 * @typedef {object} Timer
 * @property {Function} func
 * @property {*[]} args
 * @property {number} delay
 * @property {number} callAt
 * @property {number} createdAt
 * @property {boolean} immediate
 * @property {number} id
 * @property {Error} [error]
 */

/**
 * A Node timer
 *
 * @typedef {object} NodeImmediate
 * @property {function(): boolean} hasRef
 * @property {function(): NodeImmediate} ref
 * @property {function(): NodeImmediate} unref
 */
/* eslint-enable jsdoc/require-property-description */

/* eslint-disable complexity */

/**
 * Mocks available features in the specified global namespace.
 *
 * @param {*} _global Namespace to mock (e.g. `window`)
 * @returns {FakeTimers}
 */
function withGlobal(_global) {
    const userAgent = _global.navigator && _global.navigator.userAgent;
    const isRunningInIE = userAgent && userAgent.indexOf("MSIE ") > -1;
    const maxTimeout = Math.pow(2, 31) - 1; //see https://heycam.github.io/webidl/#abstract-opdef-converttoint
    const idCounterStart = 1e12; // arbitrarily large number to avoid collisions with native timer IDs
    const NOOP = function () {
        return undefined;
    };
    const NOOP_ARRAY = function () {
        return [];
    };
    const timeoutResult = _global.setTimeout(NOOP, 0);
    const addTimerReturnsObject = typeof timeoutResult === "object";
    const hrtimePresent =
        _global.process && typeof _global.process.hrtime === "function";
    const hrtimeBigintPresent =
        hrtimePresent && typeof _global.process.hrtime.bigint === "function";
    const nextTickPresent =
        _global.process && typeof _global.process.nextTick === "function";
    const utilPromisify = _global.process && require$$0.promisify;
    const performancePresent =
        _global.performance && typeof _global.performance.now === "function";
    const hasPerformancePrototype =
        _global.Performance &&
        (typeof _global.Performance).match(/^(function|object)$/);
    const hasPerformanceConstructorPrototype =
        _global.performance &&
        _global.performance.constructor &&
        _global.performance.constructor.prototype;
    const queueMicrotaskPresent = _global.hasOwnProperty("queueMicrotask");
    const requestAnimationFramePresent =
        _global.requestAnimationFrame &&
        typeof _global.requestAnimationFrame === "function";
    const cancelAnimationFramePresent =
        _global.cancelAnimationFrame &&
        typeof _global.cancelAnimationFrame === "function";
    const requestIdleCallbackPresent =
        _global.requestIdleCallback &&
        typeof _global.requestIdleCallback === "function";
    const cancelIdleCallbackPresent =
        _global.cancelIdleCallback &&
        typeof _global.cancelIdleCallback === "function";
    const setImmediatePresent =
        _global.setImmediate && typeof _global.setImmediate === "function";

    // Make properties writable in IE, as per
    // https://www.adequatelygood.com/Replacing-setTimeout-Globally.html
    /* eslint-disable no-self-assign */
    if (isRunningInIE) {
        _global.setTimeout = _global.setTimeout;
        _global.clearTimeout = _global.clearTimeout;
        _global.setInterval = _global.setInterval;
        _global.clearInterval = _global.clearInterval;
        _global.Date = _global.Date;
    }

    // setImmediate is not a standard function
    // avoid adding the prop to the window object if not present
    if (setImmediatePresent) {
        _global.setImmediate = _global.setImmediate;
        _global.clearImmediate = _global.clearImmediate;
    }
    /* eslint-enable no-self-assign */

    _global.clearTimeout(timeoutResult);

    const NativeDate = _global.Date;
    let uniqueTimerId = idCounterStart;

    /**
     * @param {number} num
     * @returns {boolean}
     */
    function isNumberFinite(num) {
        if (Number.isFinite) {
            return Number.isFinite(num);
        }

        return isFinite(num);
    }

    let isNearInfiniteLimit = false;

    /**
     * @param {Clock} clock
     * @param {number} i
     */
    function checkIsNearInfiniteLimit(clock, i) {
        if (clock.loopLimit && i === clock.loopLimit - 1) {
            isNearInfiniteLimit = true;
        }
    }

    /**
     *
     */
    function resetIsNearInfiniteLimit() {
        isNearInfiniteLimit = false;
    }

    /**
     * Parse strings like "01:10:00" (meaning 1 hour, 10 minutes, 0 seconds) into
     * number of milliseconds. This is used to support human-readable strings passed
     * to clock.tick()
     *
     * @param {string} str
     * @returns {number}
     */
    function parseTime(str) {
        if (!str) {
            return 0;
        }

        const strings = str.split(":");
        const l = strings.length;
        let i = l;
        let ms = 0;
        let parsed;

        if (l > 3 || !/^(\d\d:){0,2}\d\d?$/.test(str)) {
            throw new Error(
                "tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits"
            );
        }

        while (i--) {
            parsed = parseInt(strings[i], 10);

            if (parsed >= 60) {
                throw new Error(`Invalid time ${str}`);
            }

            ms += parsed * Math.pow(60, l - i - 1);
        }

        return ms * 1000;
    }

    /**
     * Get the decimal part of the millisecond value as nanoseconds
     *
     * @param {number} msFloat the number of milliseconds
     * @returns {number} an integer number of nanoseconds in the range [0,1e6)
     *
     * Example: nanoRemainer(123.456789) -> 456789
     */
    function nanoRemainder(msFloat) {
        const modulo = 1e6;
        const remainder = (msFloat * 1e6) % modulo;
        const positiveRemainder =
            remainder < 0 ? remainder + modulo : remainder;

        return Math.floor(positiveRemainder);
    }

    /**
     * Used to grok the `now` parameter to createClock.
     *
     * @param {Date|number} epoch the system time
     * @returns {number}
     */
    function getEpoch(epoch) {
        if (!epoch) {
            return 0;
        }
        if (typeof epoch.getTime === "function") {
            return epoch.getTime();
        }
        if (typeof epoch === "number") {
            return epoch;
        }
        throw new TypeError("now should be milliseconds since UNIX epoch");
    }

    /**
     * @param {number} from
     * @param {number} to
     * @param {Timer} timer
     * @returns {boolean}
     */
    function inRange(from, to, timer) {
        return timer && timer.callAt >= from && timer.callAt <= to;
    }

    /**
     * @param {Clock} clock
     * @param {Timer} job
     */
    function getInfiniteLoopError(clock, job) {
        const infiniteLoopError = new Error(
            `Aborting after running ${clock.loopLimit} timers, assuming an infinite loop!`
        );

        if (!job.error) {
            return infiniteLoopError;
        }

        // pattern never matched in Node
        const computedTargetPattern = /target\.*[<|(|[].*?[>|\]|)]\s*/;
        let clockMethodPattern = new RegExp(
            String(Object.keys(clock).join("|"))
        );

        if (addTimerReturnsObject) {
            // node.js environment
            clockMethodPattern = new RegExp(
                `\\s+at (Object\\.)?(?:${Object.keys(clock).join("|")})\\s+`
            );
        }

        let matchedLineIndex = -1;
        job.error.stack.split("\n").some(function (line, i) {
            // If we've matched a computed target line (e.g. setTimeout) then we
            // don't need to look any further. Return true to stop iterating.
            const matchedComputedTarget = line.match(computedTargetPattern);
            /* istanbul ignore if */
            if (matchedComputedTarget) {
                matchedLineIndex = i;
                return true;
            }

            // If we've matched a clock method line, then there may still be
            // others further down the trace. Return false to keep iterating.
            const matchedClockMethod = line.match(clockMethodPattern);
            if (matchedClockMethod) {
                matchedLineIndex = i;
                return false;
            }

            // If we haven't matched anything on this line, but we matched
            // previously and set the matched line index, then we can stop.
            // If we haven't matched previously, then we should keep iterating.
            return matchedLineIndex >= 0;
        });

        const stack = `${infiniteLoopError}\n${job.type || "Microtask"} - ${
            job.func.name || "anonymous"
        }\n${job.error.stack
            .split("\n")
            .slice(matchedLineIndex + 1)
            .join("\n")}`;

        try {
            Object.defineProperty(infiniteLoopError, "stack", {
                value: stack,
            });
        } catch (e) {
            // noop
        }

        return infiniteLoopError;
    }

    /**
     * @param {Date} target
     * @param {Date} source
     * @returns {Date} the target after modifications
     */
    function mirrorDateProperties(target, source) {
        let prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }

        // set special now implementation
        if (source.now) {
            target.now = function now() {
                return target.clock.now;
            };
        } else {
            delete target.now;
        }

        // set special toSource implementation
        if (source.toSource) {
            target.toSource = function toSource() {
                return source.toSource();
            };
        } else {
            delete target.toSource;
        }

        // set special toString implementation
        target.toString = function toString() {
            return source.toString();
        };

        target.prototype = source.prototype;
        target.parse = source.parse;
        target.UTC = source.UTC;
        target.prototype.toUTCString = source.prototype.toUTCString;

        return target;
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function createDate() {
        /**
         * @param {number} year
         * @param {number} month
         * @param {number} date
         * @param {number} hour
         * @param {number} minute
         * @param {number} second
         * @param {number} ms
         *
         * @returns {Date}
         */
        function ClockDate(year, month, date, hour, minute, second, ms) {
            // the Date constructor called as a function, ref Ecma-262 Edition 5.1, section 15.9.2.
            // This remains so in the 10th edition of 2019 as well.
            if (!(this instanceof ClockDate)) {
                return new NativeDate(ClockDate.clock.now).toString();
            }

            // if Date is called as a constructor with 'new' keyword
            // Defensive and verbose to avoid potential harm in passing
            // explicit undefined when user does not pass argument
            switch (arguments.length) {
                case 0:
                    return new NativeDate(ClockDate.clock.now);
                case 1:
                    return new NativeDate(year);
                case 2:
                    return new NativeDate(year, month);
                case 3:
                    return new NativeDate(year, month, date);
                case 4:
                    return new NativeDate(year, month, date, hour);
                case 5:
                    return new NativeDate(year, month, date, hour, minute);
                case 6:
                    return new NativeDate(
                        year,
                        month,
                        date,
                        hour,
                        minute,
                        second
                    );
                default:
                    return new NativeDate(
                        year,
                        month,
                        date,
                        hour,
                        minute,
                        second,
                        ms
                    );
            }
        }

        return mirrorDateProperties(ClockDate, NativeDate);
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function enqueueJob(clock, job) {
        // enqueues a microtick-deferred task - ecma262/#sec-enqueuejob
        if (!clock.jobs) {
            clock.jobs = [];
        }
        clock.jobs.push(job);
    }

    //eslint-disable-next-line jsdoc/require-jsdoc
    function runJobs(clock) {
        // runs all microtick-deferred tasks - ecma262/#sec-runjobs
        if (!clock.jobs) {
            return;
        }
        for (let i = 0; i < clock.jobs.length; i++) {
            const job = clock.jobs[i];
            job.func.apply(null, job.args);

            checkIsNearInfiniteLimit(clock, i);
            if (clock.loopLimit && i > clock.loopLimit) {
                throw getInfiniteLoopError(clock, job);
            }
        }
        resetIsNearInfiniteLimit();
        clock.jobs = [];
    }

    /**
     * @param {Clock} clock
     * @param {Timer} timer
     * @returns {number} id of the created timer
     */
    function addTimer(clock, timer) {
        if (timer.func === undefined) {
            throw new Error("Callback must be provided to timer calls");
        }

        if (addTimerReturnsObject) {
            // Node.js environment
            if (typeof timer.func !== "function") {
                throw new TypeError(
                    `[ERR_INVALID_CALLBACK]: Callback must be a function. Received ${
                        timer.func
                    } of type ${typeof timer.func}`
                );
            }
        }

        if (isNearInfiniteLimit) {
            timer.error = new Error();
        }

        timer.type = timer.immediate ? "Immediate" : "Timeout";

        if (timer.hasOwnProperty("delay")) {
            if (typeof timer.delay !== "number") {
                timer.delay = parseInt(timer.delay, 10);
            }

            if (!isNumberFinite(timer.delay)) {
                timer.delay = 0;
            }
            timer.delay = timer.delay > maxTimeout ? 1 : timer.delay;
            timer.delay = Math.max(0, timer.delay);
        }

        if (timer.hasOwnProperty("interval")) {
            timer.type = "Interval";
            timer.interval = timer.interval > maxTimeout ? 1 : timer.interval;
        }

        if (timer.hasOwnProperty("animation")) {
            timer.type = "AnimationFrame";
            timer.animation = true;
        }

        if (timer.hasOwnProperty("idleCallback")) {
            timer.type = "IdleCallback";
            timer.idleCallback = true;
        }

        if (!clock.timers) {
            clock.timers = {};
        }

        timer.id = uniqueTimerId++;
        timer.createdAt = clock.now;
        timer.callAt =
            clock.now + (parseInt(timer.delay) || (clock.duringTick ? 1 : 0));

        clock.timers[timer.id] = timer;

        if (addTimerReturnsObject) {
            const res = {
                refed: true,
                ref: function () {
                    this.refed = true;
                    return res;
                },
                unref: function () {
                    this.refed = false;
                    return res;
                },
                hasRef: function () {
                    return this.refed;
                },
                refresh: function () {
                    clearTimeout(timer.id);
                    const args = [timer.func, timer.delay].concat(timer.args);
                    return setTimeout.apply(null, args);
                },
                [Symbol.toPrimitive]: function () {
                    return timer.id;
                },
            };
            return res;
        }

        return timer.id;
    }

    /* eslint consistent-return: "off" */
    /**
     * Timer comparitor
     *
     * @param {Timer} a
     * @param {Timer} b
     * @returns {number}
     */
    function compareTimers(a, b) {
        // Sort first by absolute timing
        if (a.callAt < b.callAt) {
            return -1;
        }
        if (a.callAt > b.callAt) {
            return 1;
        }

        // Sort next by immediate, immediate timers take precedence
        if (a.immediate && !b.immediate) {
            return -1;
        }
        if (!a.immediate && b.immediate) {
            return 1;
        }

        // Sort next by creation time, earlier-created timers take precedence
        if (a.createdAt < b.createdAt) {
            return -1;
        }
        if (a.createdAt > b.createdAt) {
            return 1;
        }

        // Sort next by id, lower-id timers take precedence
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }

        // As timer ids are unique, no fallback `0` is necessary
    }

    /**
     * @param {Clock} clock
     * @param {number} from
     * @param {number} to
     *
     * @returns {Timer}
     */
    function firstTimerInRange(clock, from, to) {
        const timers = clock.timers;
        let timer = null;
        let id, isInRange;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                isInRange = inRange(from, to, timers[id]);

                if (
                    isInRange &&
                    (!timer || compareTimers(timer, timers[id]) === 1)
                ) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @returns {Timer}
     */
    function firstTimer(clock) {
        const timers = clock.timers;
        let timer = null;
        let id;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                if (!timer || compareTimers(timer, timers[id]) === 1) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @returns {Timer}
     */
    function lastTimer(clock) {
        const timers = clock.timers;
        let timer = null;
        let id;

        for (id in timers) {
            if (timers.hasOwnProperty(id)) {
                if (!timer || compareTimers(timer, timers[id]) === -1) {
                    timer = timers[id];
                }
            }
        }

        return timer;
    }

    /**
     * @param {Clock} clock
     * @param {Timer} timer
     */
    function callTimer(clock, timer) {
        if (typeof timer.interval === "number") {
            clock.timers[timer.id].callAt += timer.interval;
        } else {
            delete clock.timers[timer.id];
        }

        if (typeof timer.func === "function") {
            timer.func.apply(null, timer.args);
        } else {
            /* eslint no-eval: "off" */
            const eval2 = eval;
            (function () {
                eval2(timer.func);
            })();
        }
    }

    /**
     * Gets clear handler name for a given timer type
     *
     * @param {string} ttype
     */
    function getClearHandler(ttype) {
        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
            return `cancel${ttype}`;
        }
        return `clear${ttype}`;
    }

    /**
     * Gets schedule handler name for a given timer type
     *
     * @param {string} ttype
     */
    function getScheduleHandler(ttype) {
        if (ttype === "IdleCallback" || ttype === "AnimationFrame") {
            return `request${ttype}`;
        }
        return `set${ttype}`;
    }

    /**
     * Creates an anonymous function to warn only once
     */
    function createWarnOnce() {
        let calls = 0;
        return function (msg) {
            // eslint-disable-next-line
            !calls++ && console.warn(msg);
        };
    }
    const warnOnce = createWarnOnce();

    /**
     * @param {Clock} clock
     * @param {number} timerId
     * @param {string} ttype
     */
    function clearTimer(clock, timerId, ttype) {
        if (!timerId) {
            // null appears to be allowed in most browsers, and appears to be
            // relied upon by some libraries, like Bootstrap carousel
            return;
        }

        if (!clock.timers) {
            clock.timers = {};
        }

        // in Node, the ID is stored as the primitive value for `Timeout` objects
        // for `Immediate` objects, no ID exists, so it gets coerced to NaN
        const id = Number(timerId);

        if (Number.isNaN(id) || id < idCounterStart) {
            const handlerName = getClearHandler(ttype);

            if (clock.shouldClearNativeTimers === true) {
                const nativeHandler = clock[`_${handlerName}`];
                return typeof nativeHandler === "function"
                    ? nativeHandler(timerId)
                    : undefined;
            }
            warnOnce(
                `FakeTimers: ${handlerName} was invoked to clear a native timer instead of one created by this library.` +
                    "\nTo automatically clean-up native timers, use `shouldClearNativeTimers`."
            );
        }

        if (clock.timers.hasOwnProperty(id)) {
            // check that the ID matches a timer of the correct type
            const timer = clock.timers[id];
            if (
                timer.type === ttype ||
                (timer.type === "Timeout" && ttype === "Interval") ||
                (timer.type === "Interval" && ttype === "Timeout")
            ) {
                delete clock.timers[id];
            } else {
                const clear = getClearHandler(ttype);
                const schedule = getScheduleHandler(timer.type);
                throw new Error(
                    `Cannot clear timer: timer created with ${schedule}() but cleared with ${clear}()`
                );
            }
        }
    }

    /**
     * @param {Clock} clock
     * @param {Config} config
     * @returns {Timer[]}
     */
    function uninstall(clock, config) {
        let method, i, l;
        const installedHrTime = "_hrtime";
        const installedNextTick = "_nextTick";

        for (i = 0, l = clock.methods.length; i < l; i++) {
            method = clock.methods[i];
            if (method === "hrtime" && _global.process) {
                _global.process.hrtime = clock[installedHrTime];
            } else if (method === "nextTick" && _global.process) {
                _global.process.nextTick = clock[installedNextTick];
            } else if (method === "performance") {
                const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
                    clock,
                    `_${method}`
                );
                if (
                    originalPerfDescriptor &&
                    originalPerfDescriptor.get &&
                    !originalPerfDescriptor.set
                ) {
                    Object.defineProperty(
                        _global,
                        method,
                        originalPerfDescriptor
                    );
                } else if (originalPerfDescriptor.configurable) {
                    _global[method] = clock[`_${method}`];
                }
            } else {
                if (_global[method] && _global[method].hadOwnProperty) {
                    _global[method] = clock[`_${method}`];
                } else {
                    try {
                        delete _global[method];
                    } catch (ignore) {
                        /* eslint no-empty: "off" */
                    }
                }
            }
        }

        if (config.shouldAdvanceTime === true) {
            _global.clearInterval(clock.attachedInterval);
        }

        // Prevent multiple executions which will completely remove these props
        clock.methods = [];

        // return pending timers, to enable checking what timers remained on uninstall
        if (!clock.timers) {
            return [];
        }
        return Object.keys(clock.timers).map(function mapper(key) {
            return clock.timers[key];
        });
    }

    /**
     * @param {object} target the target containing the method to replace
     * @param {string} method the keyname of the method on the target
     * @param {Clock} clock
     */
    function hijackMethod(target, method, clock) {
        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(
            target,
            method
        );
        clock[`_${method}`] = target[method];

        if (method === "Date") {
            const date = mirrorDateProperties(clock[method], target[method]);
            target[method] = date;
        } else if (method === "performance") {
            const originalPerfDescriptor = Object.getOwnPropertyDescriptor(
                target,
                method
            );
            // JSDOM has a read only performance field so we have to save/copy it differently
            if (
                originalPerfDescriptor &&
                originalPerfDescriptor.get &&
                !originalPerfDescriptor.set
            ) {
                Object.defineProperty(
                    clock,
                    `_${method}`,
                    originalPerfDescriptor
                );

                const perfDescriptor = Object.getOwnPropertyDescriptor(
                    clock,
                    method
                );
                Object.defineProperty(target, method, perfDescriptor);
            } else {
                target[method] = clock[method];
            }
        } else {
            target[method] = function () {
                return clock[method].apply(clock, arguments);
            };

            Object.defineProperties(
                target[method],
                Object.getOwnPropertyDescriptors(clock[method])
            );
        }

        target[method].clock = clock;
    }

    /**
     * @param {Clock} clock
     * @param {number} advanceTimeDelta
     */
    function doIntervalTick(clock, advanceTimeDelta) {
        clock.tick(advanceTimeDelta);
    }

    /**
     * @typedef {object} Timers
     * @property {setTimeout} setTimeout
     * @property {clearTimeout} clearTimeout
     * @property {setInterval} setInterval
     * @property {clearInterval} clearInterval
     * @property {Date} Date
     * @property {SetImmediate=} setImmediate
     * @property {function(NodeImmediate): void=} clearImmediate
     * @property {function(number[]):number[]=} hrtime
     * @property {NextTick=} nextTick
     * @property {Performance=} performance
     * @property {RequestAnimationFrame=} requestAnimationFrame
     * @property {boolean=} queueMicrotask
     * @property {function(number): void=} cancelAnimationFrame
     * @property {RequestIdleCallback=} requestIdleCallback
     * @property {function(number): void=} cancelIdleCallback
     */

    /** @type {Timers} */
    const timers = {
        setTimeout: _global.setTimeout,
        clearTimeout: _global.clearTimeout,
        setInterval: _global.setInterval,
        clearInterval: _global.clearInterval,
        Date: _global.Date,
    };

    if (setImmediatePresent) {
        timers.setImmediate = _global.setImmediate;
        timers.clearImmediate = _global.clearImmediate;
    }

    if (hrtimePresent) {
        timers.hrtime = _global.process.hrtime;
    }

    if (nextTickPresent) {
        timers.nextTick = _global.process.nextTick;
    }

    if (performancePresent) {
        timers.performance = _global.performance;
    }

    if (requestAnimationFramePresent) {
        timers.requestAnimationFrame = _global.requestAnimationFrame;
    }

    if (queueMicrotaskPresent) {
        timers.queueMicrotask = true;
    }

    if (cancelAnimationFramePresent) {
        timers.cancelAnimationFrame = _global.cancelAnimationFrame;
    }

    if (requestIdleCallbackPresent) {
        timers.requestIdleCallback = _global.requestIdleCallback;
    }

    if (cancelIdleCallbackPresent) {
        timers.cancelIdleCallback = _global.cancelIdleCallback;
    }

    const originalSetTimeout = _global.setImmediate || _global.setTimeout;

    /**
     * @param {Date|number} [start] the system time - non-integer values are floored
     * @param {number} [loopLimit] maximum number of timers that will be run when calling runAll()
     * @returns {Clock}
     */
    function createClock(start, loopLimit) {
        // eslint-disable-next-line no-param-reassign
        start = Math.floor(getEpoch(start));
        // eslint-disable-next-line no-param-reassign
        loopLimit = loopLimit || 1000;
        let nanos = 0;
        const adjustedSystemTime = [0, 0]; // [millis, nanoremainder]

        if (NativeDate === undefined) {
            throw new Error(
                "The global scope doesn't have a `Date` object" +
                    " (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)"
            );
        }

        const clock = {
            now: start,
            Date: createDate(),
            loopLimit: loopLimit,
        };

        clock.Date.clock = clock;

        //eslint-disable-next-line jsdoc/require-jsdoc
        function getTimeToNextFrame() {
            return 16 - ((clock.now - start) % 16);
        }

        //eslint-disable-next-line jsdoc/require-jsdoc
        function hrtime(prev) {
            const millisSinceStart = clock.now - adjustedSystemTime[0] - start;
            const secsSinceStart = Math.floor(millisSinceStart / 1000);
            const remainderInNanos =
                (millisSinceStart - secsSinceStart * 1e3) * 1e6 +
                nanos -
                adjustedSystemTime[1];

            if (Array.isArray(prev)) {
                if (prev[1] > 1e9) {
                    throw new TypeError(
                        "Number of nanoseconds can't exceed a billion"
                    );
                }

                const oldSecs = prev[0];
                let nanoDiff = remainderInNanos - prev[1];
                let secDiff = secsSinceStart - oldSecs;

                if (nanoDiff < 0) {
                    nanoDiff += 1e9;
                    secDiff -= 1;
                }

                return [secDiff, nanoDiff];
            }
            return [secsSinceStart, remainderInNanos];
        }

        if (hrtimeBigintPresent) {
            hrtime.bigint = function () {
                const parts = hrtime();
                return BigInt(parts[0]) * BigInt(1e9) + BigInt(parts[1]); // eslint-disable-line
            };
        }

        clock.requestIdleCallback = function requestIdleCallback(
            func,
            timeout
        ) {
            let timeToNextIdlePeriod = 0;

            if (clock.countTimers() > 0) {
                timeToNextIdlePeriod = 50; // const for now
            }

            const result = addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay:
                    typeof timeout === "undefined"
                        ? timeToNextIdlePeriod
                        : Math.min(timeout, timeToNextIdlePeriod),
                idleCallback: true,
            });

            return Number(result);
        };

        clock.cancelIdleCallback = function cancelIdleCallback(timerId) {
            return clearTimer(clock, timerId, "IdleCallback");
        };

        clock.setTimeout = function setTimeout(func, timeout) {
            return addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay: timeout,
            });
        };
        if (typeof _global.Promise !== "undefined" && utilPromisify) {
            clock.setTimeout[
                utilPromisify.custom
            ] = function promisifiedSetTimeout(timeout, arg) {
                return new _global.Promise(function setTimeoutExecutor(
                    resolve
                ) {
                    addTimer(clock, {
                        func: resolve,
                        args: [arg],
                        delay: timeout,
                    });
                });
            };
        }

        clock.clearTimeout = function clearTimeout(timerId) {
            return clearTimer(clock, timerId, "Timeout");
        };

        clock.nextTick = function nextTick(func) {
            return enqueueJob(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 1),
                error: isNearInfiniteLimit ? new Error() : null,
            });
        };

        clock.queueMicrotask = function queueMicrotask(func) {
            return clock.nextTick(func); // explicitly drop additional arguments
        };

        clock.setInterval = function setInterval(func, timeout) {
            // eslint-disable-next-line no-param-reassign
            timeout = parseInt(timeout, 10);
            return addTimer(clock, {
                func: func,
                args: Array.prototype.slice.call(arguments, 2),
                delay: timeout,
                interval: timeout,
            });
        };

        clock.clearInterval = function clearInterval(timerId) {
            return clearTimer(clock, timerId, "Interval");
        };

        if (setImmediatePresent) {
            clock.setImmediate = function setImmediate(func) {
                return addTimer(clock, {
                    func: func,
                    args: Array.prototype.slice.call(arguments, 1),
                    immediate: true,
                });
            };

            if (typeof _global.Promise !== "undefined" && utilPromisify) {
                clock.setImmediate[
                    utilPromisify.custom
                ] = function promisifiedSetImmediate(arg) {
                    return new _global.Promise(function setImmediateExecutor(
                        resolve
                    ) {
                        addTimer(clock, {
                            func: resolve,
                            args: [arg],
                            immediate: true,
                        });
                    });
                };
            }

            clock.clearImmediate = function clearImmediate(timerId) {
                return clearTimer(clock, timerId, "Immediate");
            };
        }

        clock.countTimers = function countTimers() {
            return (
                Object.keys(clock.timers || {}).length +
                (clock.jobs || []).length
            );
        };

        clock.requestAnimationFrame = function requestAnimationFrame(func) {
            const result = addTimer(clock, {
                func: func,
                delay: getTimeToNextFrame(),
                args: [clock.now + getTimeToNextFrame()],
                animation: true,
            });

            return Number(result);
        };

        clock.cancelAnimationFrame = function cancelAnimationFrame(timerId) {
            return clearTimer(clock, timerId, "AnimationFrame");
        };

        clock.runMicrotasks = function runMicrotasks() {
            runJobs(clock);
        };

        /**
         * @param {number|string} tickValue milliseconds or a string parseable by parseTime
         * @param {boolean} isAsync
         * @param {Function} resolve
         * @param {Function} reject
         * @returns {number|undefined} will return the new `now` value or nothing for async
         */
        function doTick(tickValue, isAsync, resolve, reject) {
            const msFloat =
                typeof tickValue === "number"
                    ? tickValue
                    : parseTime(tickValue);
            const ms = Math.floor(msFloat);
            const remainder = nanoRemainder(msFloat);
            let nanosTotal = nanos + remainder;
            let tickTo = clock.now + ms;

            if (msFloat < 0) {
                throw new TypeError("Negative ticks are not supported");
            }

            // adjust for positive overflow
            if (nanosTotal >= 1e6) {
                tickTo += 1;
                nanosTotal -= 1e6;
            }

            nanos = nanosTotal;
            let tickFrom = clock.now;
            let previous = clock.now;
            // ESLint fails to detect this correctly
            /* eslint-disable prefer-const */
            let timer,
                firstException,
                oldNow,
                nextPromiseTick,
                compensationCheck,
                postTimerCall;
            /* eslint-enable prefer-const */

            clock.duringTick = true;

            // perform microtasks
            oldNow = clock.now;
            runJobs(clock);
            if (oldNow !== clock.now) {
                // compensate for any setSystemTime() call during microtask callback
                tickFrom += clock.now - oldNow;
                tickTo += clock.now - oldNow;
            }

            //eslint-disable-next-line jsdoc/require-jsdoc
            function doTickInner() {
                // perform each timer in the requested range
                timer = firstTimerInRange(clock, tickFrom, tickTo);
                // eslint-disable-next-line no-unmodified-loop-condition
                while (timer && tickFrom <= tickTo) {
                    if (clock.timers[timer.id]) {
                        tickFrom = timer.callAt;
                        clock.now = timer.callAt;
                        oldNow = clock.now;
                        try {
                            runJobs(clock);
                            callTimer(clock, timer);
                        } catch (e) {
                            firstException = firstException || e;
                        }

                        if (isAsync) {
                            // finish up after native setImmediate callback to allow
                            // all native es6 promises to process their callbacks after
                            // each timer fires.
                            originalSetTimeout(nextPromiseTick);
                            return;
                        }

                        compensationCheck();
                    }

                    postTimerCall();
                }

                // perform process.nextTick()s again
                oldNow = clock.now;
                runJobs(clock);
                if (oldNow !== clock.now) {
                    // compensate for any setSystemTime() call during process.nextTick() callback
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                }
                clock.duringTick = false;

                // corner case: during runJobs new timers were scheduled which could be in the range [clock.now, tickTo]
                timer = firstTimerInRange(clock, tickFrom, tickTo);
                if (timer) {
                    try {
                        clock.tick(tickTo - clock.now); // do it all again - for the remainder of the requested range
                    } catch (e) {
                        firstException = firstException || e;
                    }
                } else {
                    // no timers remaining in the requested range: move the clock all the way to the end
                    clock.now = tickTo;

                    // update nanos
                    nanos = nanosTotal;
                }
                if (firstException) {
                    throw firstException;
                }

                if (isAsync) {
                    resolve(clock.now);
                } else {
                    return clock.now;
                }
            }

            nextPromiseTick =
                isAsync &&
                function () {
                    try {
                        compensationCheck();
                        postTimerCall();
                        doTickInner();
                    } catch (e) {
                        reject(e);
                    }
                };

            compensationCheck = function () {
                // compensate for any setSystemTime() call during timer callback
                if (oldNow !== clock.now) {
                    tickFrom += clock.now - oldNow;
                    tickTo += clock.now - oldNow;
                    previous += clock.now - oldNow;
                }
            };

            postTimerCall = function () {
                timer = firstTimerInRange(clock, previous, tickTo);
                previous = tickFrom;
            };

            return doTickInner();
        }

        /**
         * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
         * @returns {number} will return the new `now` value
         */
        clock.tick = function tick(tickValue) {
            return doTick(tickValue, false);
        };

        if (typeof _global.Promise !== "undefined") {
            /**
             * @param {string|number} tickValue number of milliseconds or a human-readable value like "01:11:15"
             * @returns {Promise}
             */
            clock.tickAsync = function tickAsync(tickValue) {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            doTick(tickValue, true, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.next = function next() {
            runJobs(clock);
            const timer = firstTimer(clock);
            if (!timer) {
                return clock.now;
            }

            clock.duringTick = true;
            try {
                clock.now = timer.callAt;
                callTimer(clock, timer);
                runJobs(clock);
                return clock.now;
            } finally {
                clock.duringTick = false;
            }
        };

        if (typeof _global.Promise !== "undefined") {
            clock.nextAsync = function nextAsync() {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            const timer = firstTimer(clock);
                            if (!timer) {
                                resolve(clock.now);
                                return;
                            }

                            let err;
                            clock.duringTick = true;
                            clock.now = timer.callAt;
                            try {
                                callTimer(clock, timer);
                            } catch (e) {
                                err = e;
                            }
                            clock.duringTick = false;

                            originalSetTimeout(function () {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(clock.now);
                                }
                            });
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.runAll = function runAll() {
            let numTimers, i;
            runJobs(clock);
            for (i = 0; i < clock.loopLimit; i++) {
                if (!clock.timers) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                }

                numTimers = Object.keys(clock.timers).length;
                if (numTimers === 0) {
                    resetIsNearInfiniteLimit();
                    return clock.now;
                }

                clock.next();
                checkIsNearInfiniteLimit(clock, i);
            }

            const excessJob = firstTimer(clock);
            throw getInfiniteLoopError(clock, excessJob);
        };

        clock.runToFrame = function runToFrame() {
            return clock.tick(getTimeToNextFrame());
        };

        if (typeof _global.Promise !== "undefined") {
            clock.runAllAsync = function runAllAsync() {
                return new _global.Promise(function (resolve, reject) {
                    let i = 0;
                    /**
                     *
                     */
                    function doRun() {
                        originalSetTimeout(function () {
                            try {
                                let numTimers;
                                if (i < clock.loopLimit) {
                                    if (!clock.timers) {
                                        resetIsNearInfiniteLimit();
                                        resolve(clock.now);
                                        return;
                                    }

                                    numTimers = Object.keys(clock.timers)
                                        .length;
                                    if (numTimers === 0) {
                                        resetIsNearInfiniteLimit();
                                        resolve(clock.now);
                                        return;
                                    }

                                    clock.next();

                                    i++;

                                    doRun();
                                    checkIsNearInfiniteLimit(clock, i);
                                    return;
                                }

                                const excessJob = firstTimer(clock);
                                reject(getInfiniteLoopError(clock, excessJob));
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                    doRun();
                });
            };
        }

        clock.runToLast = function runToLast() {
            const timer = lastTimer(clock);
            if (!timer) {
                runJobs(clock);
                return clock.now;
            }

            return clock.tick(timer.callAt - clock.now);
        };

        if (typeof _global.Promise !== "undefined") {
            clock.runToLastAsync = function runToLastAsync() {
                return new _global.Promise(function (resolve, reject) {
                    originalSetTimeout(function () {
                        try {
                            const timer = lastTimer(clock);
                            if (!timer) {
                                resolve(clock.now);
                            }

                            resolve(clock.tickAsync(timer.callAt));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            };
        }

        clock.reset = function reset() {
            nanos = 0;
            clock.timers = {};
            clock.jobs = [];
            clock.now = start;
        };

        clock.setSystemTime = function setSystemTime(systemTime) {
            // determine time difference
            const newNow = getEpoch(systemTime);
            const difference = newNow - clock.now;
            let id, timer;

            adjustedSystemTime[0] = adjustedSystemTime[0] + difference;
            adjustedSystemTime[1] = adjustedSystemTime[1] + nanos;
            // update 'system clock'
            clock.now = newNow;
            nanos = 0;

            // update timers and intervals to keep them stable
            for (id in clock.timers) {
                if (clock.timers.hasOwnProperty(id)) {
                    timer = clock.timers[id];
                    timer.createdAt += difference;
                    timer.callAt += difference;
                }
            }
        };

        if (performancePresent) {
            clock.performance = Object.create(null);
            clock.performance.now = function FakeTimersNow() {
                const hrt = hrtime();
                const millis = hrt[0] * 1000 + hrt[1] / 1e6;
                return millis;
            };
        }

        if (hrtimePresent) {
            clock.hrtime = hrtime;
        }

        return clock;
    }

    /* eslint-disable complexity */

    /**
     * @param {Config=} [config] Optional config
     * @returns {Clock}
     */
    function install(config) {
        if (
            arguments.length > 1 ||
            config instanceof Date ||
            Array.isArray(config) ||
            typeof config === "number"
        ) {
            throw new TypeError(
                `FakeTimers.install called with ${String(
                    config
                )} install requires an object parameter`
            );
        }

        // eslint-disable-next-line no-param-reassign
        config = typeof config !== "undefined" ? config : {};
        config.shouldAdvanceTime = config.shouldAdvanceTime || false;
        config.advanceTimeDelta = config.advanceTimeDelta || 20;
        config.shouldClearNativeTimers =
            config.shouldClearNativeTimers || false;

        if (config.target) {
            throw new TypeError(
                "config.target is no longer supported. Use `withGlobal(target)` instead."
            );
        }

        let i, l;
        const clock = createClock(config.now, config.loopLimit);
        clock.shouldClearNativeTimers = config.shouldClearNativeTimers;

        clock.uninstall = function () {
            return uninstall(clock, config);
        };

        clock.methods = config.toFake || [];

        if (clock.methods.length === 0) {
            // do not fake nextTick by default - GitHub#126
            clock.methods = Object.keys(timers).filter(function (key) {
                return key !== "nextTick" && key !== "queueMicrotask";
            });
        }

        if (config.shouldAdvanceTime === true) {
            const intervalTick = doIntervalTick.bind(
                null,
                clock,
                config.advanceTimeDelta
            );
            const intervalId = _global.setInterval(
                intervalTick,
                config.advanceTimeDelta
            );
            clock.attachedInterval = intervalId;
        }

        if (clock.methods.includes("performance")) {
            const proto = (() => {
                if (hasPerformancePrototype) {
                    return _global.Performance.prototype;
                }
                if (hasPerformanceConstructorPrototype) {
                    return _global.performance.constructor.prototype;
                }
            })();
            if (proto) {
                Object.getOwnPropertyNames(proto).forEach(function (name) {
                    if (name !== "now") {
                        clock.performance[name] =
                            name.indexOf("getEntries") === 0
                                ? NOOP_ARRAY
                                : NOOP;
                    }
                });
            } else if ((config.toFake || []).includes("performance")) {
                // user explicitly tried to fake performance when not present
                throw new ReferenceError(
                    "non-existent performance object cannot be faked"
                );
            }
        }

        for (i = 0, l = clock.methods.length; i < l; i++) {
            const nameOfMethodToReplace = clock.methods[i];
            if (nameOfMethodToReplace === "hrtime") {
                if (
                    _global.process &&
                    typeof _global.process.hrtime === "function"
                ) {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                }
            } else if (nameOfMethodToReplace === "nextTick") {
                if (
                    _global.process &&
                    typeof _global.process.nextTick === "function"
                ) {
                    hijackMethod(_global.process, nameOfMethodToReplace, clock);
                }
            } else {
                hijackMethod(_global, nameOfMethodToReplace, clock);
            }
        }

        return clock;
    }

    /* eslint-enable complexity */

    return {
        timers: timers,
        createClock: createClock,
        install: install,
        withGlobal: withGlobal,
    };
}

/**
 * @typedef {object} FakeTimers
 * @property {Timers} timers
 * @property {createClock} createClock
 * @property {Function} install
 * @property {withGlobal} withGlobal
 */

/* eslint-enable complexity */

/** @type {FakeTimers} */
withGlobal(globalObject);
var withGlobal_1 = withGlobal;

var mockdate = {exports: {}};

(function (module, exports) {
(function (global, factory) {
    factory(exports) ;
}(commonjsGlobal, (function (exports) {
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var RealDate = Date;
    var now = null;
    var MockDate = /** @class */ (function (_super) {
        __extends(Date, _super);
        function Date(y, m, d, h, M, s, ms) {
            _super.call(this) || this;
            var date;
            switch (arguments.length) {
                case 0:
                    if (now !== null) {
                        date = new RealDate(now.valueOf());
                    }
                    else {
                        date = new RealDate();
                    }
                    break;
                case 1:
                    date = new RealDate(y);
                    break;
                default:
                    d = typeof d === 'undefined' ? 1 : d;
                    h = h || 0;
                    M = M || 0;
                    s = s || 0;
                    ms = ms || 0;
                    date = new RealDate(y, m, d, h, M, s, ms);
                    break;
            }
            return date;
        }
        return Date;
    }(RealDate));
    MockDate.prototype = RealDate.prototype;
    MockDate.UTC = RealDate.UTC;
    MockDate.now = function () {
        return new MockDate().valueOf();
    };
    MockDate.parse = function (dateString) {
        return RealDate.parse(dateString);
    };
    MockDate.toString = function () {
        return RealDate.toString();
    };
    function set(date) {
        var dateObj = new Date(date.valueOf());
        if (isNaN(dateObj.getTime())) {
            throw new TypeError('mockdate: The time set is an invalid date: ' + date);
        }
        // @ts-ignore
        Date = MockDate;
        now = dateObj.valueOf();
    }
    function reset() {
        Date = RealDate;
    }
    var mockdate = {
        set: set,
        reset: reset,
    };

    exports.default = mockdate;
    exports.reset = reset;
    exports.set = set;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
}(mockdate, mockdate.exports));

var MockDate = /*@__PURE__*/getDefaultExportFromCjs(mockdate.exports);

class FakeTimers {
  constructor({
    global,
    maxLoops = 1e4
  }) {
    this._now = Date.now;
    this._maxLoops = maxLoops;
    this._fakingDate = false;
    this._fakingTime = false;
    this._fakeTimers = withGlobal_1(global);
  }
  clearAllTimers() {
    if (this._fakingTime)
      this._clock.reset();
  }
  dispose() {
    this.useRealTimers();
  }
  runAllTimers() {
    if (this._checkFakeTimers())
      this._clock.runAll();
  }
  runOnlyPendingTimers() {
    if (this._checkFakeTimers())
      this._clock.runToLast();
  }
  advanceTimersToNextTimer(steps = 1) {
    if (this._checkFakeTimers()) {
      for (let i = steps; i > 0; i--) {
        this._clock.next();
        this._clock.tick(0);
        if (this._clock.countTimers() === 0)
          break;
      }
    }
  }
  advanceTimersByTime(msToRun) {
    if (this._checkFakeTimers())
      this._clock.tick(msToRun);
  }
  runAllTicks() {
    if (this._checkFakeTimers()) {
      this._clock.runMicrotasks();
    }
  }
  useRealTimers() {
    if (this._fakingDate) {
      MockDate.reset();
      this._fakingDate = false;
    }
    if (this._fakingTime) {
      this._clock.uninstall();
      this._fakingTime = false;
    }
  }
  useFakeTimers() {
    if (this._fakingDate) {
      throw new Error('"setSystemTime" was called already and date was mocked. Reset timers using `vi.useRealTimers()` if you want to use fake timers again.');
    }
    if (!this._fakingTime) {
      const toFake = Object.keys(this._fakeTimers.timers);
      this._clock = this._fakeTimers.install({
        loopLimit: this._maxLoops,
        now: Date.now(),
        toFake,
        shouldClearNativeTimers: true
      });
      this._fakingTime = true;
    }
  }
  reset() {
    if (this._checkFakeTimers()) {
      const { now } = this._clock;
      this._clock.reset();
      this._clock.setSystemTime(now);
    }
  }
  setSystemTime(now) {
    if (this._fakingTime) {
      this._clock.setSystemTime(now);
    } else {
      MockDate.set(now ?? this.getRealSystemTime());
      this._fakingDate = true;
    }
  }
  getRealSystemTime() {
    return this._now();
  }
  getTimerCount() {
    if (this._checkFakeTimers())
      return this._clock.countTimers();
    return 0;
  }
  _checkFakeTimers() {
    if (!this._fakingTime) {
      throw new Error('Timers are not mocked. Try calling "vi.useFakeTimers()" first.');
    }
    return this._fakingTime;
  }
}

class VitestUtils {
  constructor() {
    this.spyOn = spyOn;
    this.fn = fn;
    this._timers = new FakeTimers({
      global: globalThis,
      maxLoops: 1e4
    });
    this._mocker = typeof __vitest_mocker__ !== "undefined" ? __vitest_mocker__ : null;
    this._mockedDate = null;
    if (!this._mocker)
      throw new Error("Vitest was initialized with native Node instead of Vite Node");
  }
  useFakeTimers() {
    this._timers.useFakeTimers();
    return this;
  }
  useRealTimers() {
    this._timers.useRealTimers();
    this._mockedDate = null;
    return this;
  }
  runOnlyPendingTimers() {
    this._timers.runOnlyPendingTimers();
    return this;
  }
  runAllTimers() {
    this._timers.runAllTimers();
    return this;
  }
  runAllTicks() {
    this._timers.runAllTicks();
    return this;
  }
  advanceTimersByTime(ms) {
    this._timers.advanceTimersByTime(ms);
    return this;
  }
  advanceTimersToNextTimer() {
    this._timers.advanceTimersToNextTimer();
    return this;
  }
  getTimerCount() {
    return this._timers.getTimerCount();
  }
  setSystemTime(time) {
    const date = time instanceof Date ? time : new Date(time);
    this._mockedDate = date;
    this._timers.setSystemTime(date);
    return this;
  }
  getMockedSystemTime() {
    return this._mockedDate;
  }
  getRealSystemTime() {
    return this._timers.getRealSystemTime();
  }
  clearAllTimers() {
    this._timers.clearAllTimers();
    return this;
  }
  getImporter() {
    const err = new Error("mock");
    const [, , importer] = parseStacktrace(err, true);
    return importer.file;
  }
  mock(path, factory) {
    this._mocker.queueMock(path, this.getImporter(), factory);
  }
  unmock(path) {
    this._mocker.queueUnmock(path, this.getImporter());
  }
  doMock(path, factory) {
    this._mocker.queueMock(path, this.getImporter(), factory);
  }
  doUnmock(path) {
    this._mocker.queueUnmock(path, this.getImporter());
  }
  async importActual(path) {
    return this._mocker.importActual(path, this.getImporter());
  }
  async importMock(path) {
    return this._mocker.importMock(path, this.getImporter());
  }
  mocked(item, _deep = false) {
    return item;
  }
  isMockFunction(fn2) {
    return isMockFunction(fn2);
  }
  clearAllMocks() {
    spies.forEach((spy) => spy.mockClear());
    return this;
  }
  resetAllMocks() {
    spies.forEach((spy) => spy.mockReset());
    return this;
  }
  restoreAllMocks() {
    spies.forEach((spy) => spy.mockRestore());
    return this;
  }
}
const vitest = new VitestUtils();
const vi = vitest;

export { JestChaiExpect as J, getDefaultHookTimeout as a, getState as b, suite as c, describe as d, vi as e, format_1 as f, getCurrentSuite as g, getSerializers as h, it as i, equals as j, iterableEquality as k, subsetEquality as l, isA as m, clearContext as n, defaultSuite as o, plugins_1 as p, setHooks as q, getHooks as r, setState as s, test$7 as t, context as u, vitest as v, withTimeout as w, getFn as x };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmstcnVudGltZS1jaGFpbi4yYTc4NzAxNC5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3J1bnRpbWUvY2hhaW4udHMiLCIuLi9zcmMvcnVudGltZS9jb250ZXh0LnRzIiwiLi4vc3JjL3J1bnRpbWUvbWFwLnRzIiwiLi4vc3JjL3J1bnRpbWUvc3VpdGUudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vYW5zaS1zdHlsZXNANS4yLjAvbm9kZV9tb2R1bGVzL2Fuc2ktc3R5bGVzL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3ByZXR0eS1mb3JtYXRAMjcuNS4xL25vZGVfbW9kdWxlcy9wcmV0dHktZm9ybWF0L2J1aWxkL2NvbGxlY3Rpb25zLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3ByZXR0eS1mb3JtYXRAMjcuNS4xL25vZGVfbW9kdWxlcy9wcmV0dHktZm9ybWF0L2J1aWxkL3BsdWdpbnMvQXN5bW1ldHJpY01hdGNoZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vYW5zaS1yZWdleEA1LjAuMS9ub2RlX21vZHVsZXMvYW5zaS1yZWdleC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9wbHVnaW5zL0NvbnZlcnRBbnNpLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3ByZXR0eS1mb3JtYXRAMjcuNS4xL25vZGVfbW9kdWxlcy9wcmV0dHktZm9ybWF0L2J1aWxkL3BsdWdpbnMvRE9NQ29sbGVjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9wbHVnaW5zL2xpYi9lc2NhcGVIVE1MLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3ByZXR0eS1mb3JtYXRAMjcuNS4xL25vZGVfbW9kdWxlcy9wcmV0dHktZm9ybWF0L2J1aWxkL3BsdWdpbnMvbGliL21hcmt1cC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9wbHVnaW5zL0RPTUVsZW1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHJldHR5LWZvcm1hdEAyNy41LjEvbm9kZV9tb2R1bGVzL3ByZXR0eS1mb3JtYXQvYnVpbGQvcGx1Z2lucy9JbW11dGFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtaXNAMTcuMC4yL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtaXNAMTcuMC4yL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMuZGV2ZWxvcG1lbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcmVhY3QtaXNAMTcuMC4yL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9wbHVnaW5zL1JlYWN0RWxlbWVudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9wbHVnaW5zL1JlYWN0VGVzdENvbXBvbmVudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wcmV0dHktZm9ybWF0QDI3LjUuMS9ub2RlX21vZHVsZXMvcHJldHR5LWZvcm1hdC9idWlsZC9pbmRleC5qcyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvc25hcHNob3QvcG9ydC9wbHVnaW5zLnRzIiwiLi4vc3JjL2ludGVncmF0aW9ucy9jaGFpL2plc3QtdXRpbHMudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL2NoYWkvamVzdC1leHBlY3QudHMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvZ2xvYmFsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvY29weS1wcm90b3R5cGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvcHJvdG90eXBlcy9hcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ac2lub25qcytjb21tb25zQDEuOC4zL25vZGVfbW9kdWxlcy9Ac2lub25qcy9jb21tb25zL2xpYi9jYWxsZWQtaW4tb3JkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvZnVuY3Rpb24tbmFtZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ac2lub25qcytjb21tb25zQDEuOC4zL25vZGVfbW9kdWxlcy9Ac2lub25qcy9jb21tb25zL2xpYi9jbGFzcy1uYW1lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL2RlcHJlY2F0ZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvZXZlcnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvb3JkZXItYnktZmlyc3QtY2FsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ac2lub25qcytjb21tb25zQDEuOC4zL25vZGVfbW9kdWxlcy9Ac2lub25qcy9jb21tb25zL2xpYi9wcm90b3R5cGVzL2Z1bmN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvbWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvb2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvc2V0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvc3RyaW5nLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3Byb3RvdHlwZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vdHlwZS1kZXRlY3RANC4wLjgvbm9kZV9tb2R1bGVzL3R5cGUtZGV0ZWN0L3R5cGUtZGV0ZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL3R5cGUtb2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHNpbm9uanMrY29tbW9uc0AxLjguMy9ub2RlX21vZHVsZXMvQHNpbm9uanMvY29tbW9ucy9saWIvdmFsdWUtdG8tc3RyaW5nLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2NvbW1vbnNAMS44LjMvbm9kZV9tb2R1bGVzL0BzaW5vbmpzL2NvbW1vbnMvbGliL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BzaW5vbmpzK2Zha2UtdGltZXJzQDkuMS4wL25vZGVfbW9kdWxlcy9Ac2lub25qcy9mYWtlLXRpbWVycy9zcmMvZmFrZS10aW1lcnMtc3JjLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL21vY2tkYXRlQDMuMC41L25vZGVfbW9kdWxlcy9tb2NrZGF0ZS9saWIvbW9ja2RhdGUuanMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL3RpbWVycy50cyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvdmkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgQ2hhaW5hYmxlRnVuY3Rpb248VCBleHRlbmRzIHN0cmluZywgQXJncyBleHRlbmRzIGFueVtdLCBSID0gYW55PiA9IHtcbiAgKC4uLmFyZ3M6IEFyZ3MpOiBSXG59ICYge1xuICBbeCBpbiBUXTogQ2hhaW5hYmxlRnVuY3Rpb248VCwgQXJncywgUj5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZTxUIGV4dGVuZHMgc3RyaW5nLCBBcmdzIGV4dGVuZHMgYW55W10sIFIgPSBhbnk+KFxuICBrZXlzOiBUW10sXG4gIGZuOiAodGhpczogUmVjb3JkPFQsIGJvb2xlYW4gfCB1bmRlZmluZWQ+LCAuLi5hcmdzOiBBcmdzKSA9PiBSLFxuKTogQ2hhaW5hYmxlRnVuY3Rpb248VCwgQXJncywgUj4ge1xuICBmdW5jdGlvbiBjcmVhdGUob2JqOiBSZWNvcmQ8VCwgYm9vbGVhbiB8IHVuZGVmaW5lZD4pIHtcbiAgICBjb25zdCBjaGFpbiA9IGZ1bmN0aW9uKHRoaXM6IGFueSwgLi4uYXJnczogQXJncykge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KG9iaiwgYXJncylcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNoYWluLCBrZXksIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBjcmVhdGUoeyAuLi5vYmosIFtrZXldOiB0cnVlIH0pXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gY2hhaW5cbiAgfVxuXG4gIGNvbnN0IGNoYWluID0gY3JlYXRlKHt9IGFzIGFueSkgYXMgYW55XG4gIGNoYWluLmZuID0gZm5cbiAgcmV0dXJuIGNoYWluXG59XG4iLCJpbXBvcnQgdHlwZSB7IEF3YWl0YWJsZSwgRG9uZUNhbGxiYWNrLCBSdW50aW1lQ29udGV4dCwgU3VpdGVDb2xsZWN0b3IsIFRlc3RGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgY29udGV4dDogUnVudGltZUNvbnRleHQgPSB7XG4gIHRhc2tzOiBbXSxcbiAgY3VycmVudFN1aXRlOiBudWxsLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdFRhc2sodGFzazogU3VpdGVDb2xsZWN0b3IpIHtcbiAgY29udGV4dC5jdXJyZW50U3VpdGU/LnRhc2tzLnB1c2godGFzaylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bldpdGhTdWl0ZShzdWl0ZTogU3VpdGVDb2xsZWN0b3IsIGZuOiAoKCkgPT4gQXdhaXRhYmxlPHZvaWQ+KSkge1xuICBjb25zdCBwcmV2ID0gY29udGV4dC5jdXJyZW50U3VpdGVcbiAgY29udGV4dC5jdXJyZW50U3VpdGUgPSBzdWl0ZVxuICBhd2FpdCBmbigpXG4gIGNvbnRleHQuY3VycmVudFN1aXRlID0gcHJldlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFRlc3RUaW1lb3V0KCkge1xuICByZXR1cm4gX192aXRlc3Rfd29ya2VyX18hLmNvbmZpZyEudGVzdFRpbWVvdXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRIb29rVGltZW91dCgpIHtcbiAgcmV0dXJuIF9fdml0ZXN0X3dvcmtlcl9fIS5jb25maWchLmhvb2tUaW1lb3V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoVGltZW91dDxUIGV4dGVuZHMoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpPihcbiAgZm46IFQsXG4gIHRpbWVvdXQgPSBnZXREZWZhdWx0VGVzdFRpbWVvdXQoKSxcbiAgaXNIb29rID0gZmFsc2UsXG4pOiBUIHtcbiAgaWYgKHRpbWVvdXQgPD0gMCB8fCB0aW1lb3V0ID09PSBJbmZpbml0eSlcbiAgICByZXR1cm4gZm5cblxuICByZXR1cm4gKCguLi5hcmdzOiAoVCBleHRlbmRzICgoLi4uYXJnczogaW5mZXIgQSkgPT4gYW55KSA/IEEgOiBuZXZlcikpID0+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtmbiguLi5hcmdzKSwgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgICByZWplY3QobmV3IEVycm9yKG1ha2VUaW1lb3V0TXNnKGlzSG9vaywgdGltZW91dCkpKVxuICAgICAgfSwgdGltZW91dClcbiAgICAgIHRpbWVyLnVucmVmKClcbiAgICB9KV0pIGFzIEF3YWl0YWJsZTx2b2lkPlxuICB9KSBhcyBUXG59XG5cbmZ1bmN0aW9uIG1ha2VUaW1lb3V0TXNnKGlzSG9vazogYm9vbGVhbiwgdGltZW91dDogbnVtYmVyKSB7XG4gIHJldHVybiBgJHtpc0hvb2sgPyAnSG9vaycgOiAnVGVzdCd9IHRpbWVkIG91dCBpbiAke3RpbWVvdXR9bXMuXFxuSWYgdGhpcyBpcyBhIGxvbmctcnVubmluZyB0ZXN0LCBwYXNzIGEgdGltZW91dCB2YWx1ZSBhcyB0aGUgbGFzdCBhcmd1bWVudCBvciBjb25maWd1cmUgaXQgZ2xvYmFsbHkgd2l0aCBcIiR7aXNIb29rID8gJ2hvb2tUaW1lb3V0JyA6ICd0ZXN0VGltZW91dCd9XCIuYFxufVxuXG5mdW5jdGlvbiBlbnN1cmVBc3luY1Rlc3QoZm46IFRlc3RGdW5jdGlvbik6ICgpID0+IEF3YWl0YWJsZTx2b2lkPiB7XG4gIGlmICghZm4ubGVuZ3RoKVxuICAgIHJldHVybiBmbiBhcyAoKSA9PiBBd2FpdGFibGU8dm9pZD5cblxuICByZXR1cm4gKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGRvbmU6IERvbmVDYWxsYmFjayA9ICguLi5hcmdzOiBhbnlbXSkgPT4gYXJnc1swXSAvLyByZWplY3Qgb24gdHJ1dGh5IHZhbHVlc1xuICAgICAgPyByZWplY3QoYXJnc1swXSlcbiAgICAgIDogcmVzb2x2ZSgpXG4gICAgZm4oZG9uZSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZVRlc3QoZm46IFRlc3RGdW5jdGlvbiwgdGltZW91dD86IG51bWJlcik6ICgpID0+IEF3YWl0YWJsZTx2b2lkPiB7XG4gIHJldHVybiB3aXRoVGltZW91dChlbnN1cmVBc3luY1Rlc3QoZm4pLCB0aW1lb3V0KVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBd2FpdGFibGUsIFN1aXRlLCBTdWl0ZUhvb2tzLCBUZXN0IH0gZnJvbSAnLi4vdHlwZXMnXG5cbi8vIHVzZSBXZWFrTWFwIGhlcmUgdG8gbWFrZSB0aGUgVGVzdCBhbmQgU3VpdGUgb2JqZWN0IHNlcmlhbGl6YWJsZVxuY29uc3QgZm5NYXAgPSBuZXcgV2Vha01hcCgpXG5jb25zdCBob29rc01hcCA9IG5ldyBXZWFrTWFwKClcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZuKGtleTogVGVzdCwgZm46ICgpID0+IEF3YWl0YWJsZTx2b2lkPikge1xuICBmbk1hcC5zZXQoa2V5LCBmbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZuKGtleTogVGVzdCk6ICgpID0+IEF3YWl0YWJsZTx2b2lkPiB7XG4gIHJldHVybiBmbk1hcC5nZXQoa2V5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SG9va3Moa2V5OiBTdWl0ZSwgaG9va3M6IFN1aXRlSG9va3MpIHtcbiAgaG9va3NNYXAuc2V0KGtleSwgaG9va3MpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb29rcyhrZXk6IFN1aXRlKTogU3VpdGVIb29rcyB7XG4gIHJldHVybiBob29rc01hcC5nZXQoa2V5KVxufVxuIiwiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCdcbmltcG9ydCB0eXBlIHsgRmlsZSwgUnVuTW9kZSwgU3VpdGUsIFN1aXRlQVBJLCBTdWl0ZUNvbGxlY3RvciwgU3VpdGVGYWN0b3J5LCBTdWl0ZUhvb2tzLCBUYXNrLCBUZXN0LCBUZXN0QVBJLCBUZXN0RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IGlzT2JqZWN0LCBub29wLCB0b0FycmF5IH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBjcmVhdGVDaGFpbmFibGUgfSBmcm9tICcuL2NoYWluJ1xuaW1wb3J0IHsgY29sbGVjdFRhc2ssIGNvbnRleHQsIG5vcm1hbGl6ZVRlc3QsIHJ1bldpdGhTdWl0ZSB9IGZyb20gJy4vY29udGV4dCdcbmltcG9ydCB7IGdldEhvb2tzLCBzZXRGbiwgc2V0SG9va3MgfSBmcm9tICcuL21hcCdcblxuLy8gYXBpc1xuZXhwb3J0IGNvbnN0IHN1aXRlID0gY3JlYXRlU3VpdGUoKVxuZXhwb3J0IGNvbnN0IHRlc3QgPSBjcmVhdGVUZXN0KFxuICBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIGZuPzogVGVzdEZ1bmN0aW9uLCB0aW1lb3V0PzogbnVtYmVyKSB7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB1bnR5cGVkIGludGVybmFsIHByb3BcbiAgICBnZXRDdXJyZW50U3VpdGUoKS50ZXN0LmZuLmNhbGwodGhpcywgbmFtZSwgZm4sIHRpbWVvdXQpXG4gIH0sXG4pXG5cbmZ1bmN0aW9uIGZvcm1hdFRpdGxlKHRlbXBsYXRlOiBzdHJpbmcsIGl0ZW1zOiBhbnlbXSkge1xuICBjb25zdCBjb3VudCA9IHRlbXBsYXRlLnNwbGl0KCclJykubGVuZ3RoIC0gMVxuICBsZXQgZm9ybWF0dGVkID0gZm9ybWF0KHRlbXBsYXRlLCAuLi5pdGVtcy5zbGljZSgwLCBjb3VudCkpXG4gIGlmIChpc09iamVjdChpdGVtc1swXSkpIHtcbiAgICBmb3JtYXR0ZWQgPSBmb3JtYXR0ZWQucmVwbGFjZSgvXFwkKFskXFx3X10rKS9nLCAoXywga2V5KSA9PiB7XG4gICAgICByZXR1cm4gaXRlbXNbMF1ba2V5XVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGZvcm1hdHRlZFxufVxuXG4vLyBhbGlhc1xuZXhwb3J0IGNvbnN0IGRlc2NyaWJlID0gc3VpdGVcbmV4cG9ydCBjb25zdCBpdCA9IHRlc3RcblxuLy8gaW1wbGVtZW50YXRpb25zXG5leHBvcnQgY29uc3QgZGVmYXVsdFN1aXRlID0gc3VpdGUoJycpXG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNvbnRleHQoKSB7XG4gIGNvbnRleHQudGFza3MubGVuZ3RoID0gMFxuICBkZWZhdWx0U3VpdGUuY2xlYXIoKVxuICBjb250ZXh0LmN1cnJlbnRTdWl0ZSA9IGRlZmF1bHRTdWl0ZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFN1aXRlKCkge1xuICByZXR1cm4gY29udGV4dC5jdXJyZW50U3VpdGUgfHwgZGVmYXVsdFN1aXRlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdWl0ZUhvb2tzKCkge1xuICByZXR1cm4ge1xuICAgIGJlZm9yZUFsbDogW10sXG4gICAgYWZ0ZXJBbGw6IFtdLFxuICAgIGJlZm9yZUVhY2g6IFtdLFxuICAgIGFmdGVyRWFjaDogW10sXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3VpdGVDb2xsZWN0b3IobmFtZTogc3RyaW5nLCBmYWN0b3J5OiBTdWl0ZUZhY3RvcnkgPSAoKSA9PiB7IH0sIG1vZGU6IFJ1bk1vZGUsIGNvbmN1cnJlbnQ/OiBib29sZWFuKSB7XG4gIGNvbnN0IHRhc2tzOiAoVGVzdCB8IFN1aXRlIHwgU3VpdGVDb2xsZWN0b3IpW10gPSBbXVxuICBjb25zdCBmYWN0b3J5UXVldWU6IChUZXN0IHwgU3VpdGUgfCBTdWl0ZUNvbGxlY3RvcilbXSA9IFtdXG5cbiAgbGV0IHN1aXRlOiBTdWl0ZVxuXG4gIGluaXRTdWl0ZSgpXG5cbiAgY29uc3QgdGVzdCA9IGNyZWF0ZVRlc3QoZnVuY3Rpb24obmFtZTogc3RyaW5nLCBmbj86IFRlc3RGdW5jdGlvbiwgdGltZW91dD86IG51bWJlcikge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLm9ubHkgPyAnb25seScgOiB0aGlzLnNraXAgPyAnc2tpcCcgOiB0aGlzLnRvZG8gPyAndG9kbycgOiAncnVuJ1xuXG4gICAgY29uc3QgdGVzdDogVGVzdCA9IHtcbiAgICAgIGlkOiAnJyxcbiAgICAgIHR5cGU6ICd0ZXN0JyxcbiAgICAgIG5hbWUsXG4gICAgICBtb2RlLFxuICAgICAgc3VpdGU6IHVuZGVmaW5lZCEsXG4gICAgICBmYWlsczogdGhpcy5mYWlscyxcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uY3VycmVudCB8fCBjb25jdXJyZW50KVxuICAgICAgdGVzdC5jb25jdXJyZW50ID0gdHJ1ZVxuICAgIHNldEZuKHRlc3QsIG5vcm1hbGl6ZVRlc3QoZm4gfHwgbm9vcCwgdGltZW91dCkpXG4gICAgdGFza3MucHVzaCh0ZXN0KVxuICB9KVxuXG4gIGNvbnN0IGNvbGxlY3RvcjogU3VpdGVDb2xsZWN0b3IgPSB7XG4gICAgdHlwZTogJ2NvbGxlY3RvcicsXG4gICAgbmFtZSxcbiAgICBtb2RlLFxuICAgIHRlc3QsXG4gICAgdGFza3MsXG4gICAgY29sbGVjdCxcbiAgICBjbGVhcixcbiAgICBvbjogYWRkSG9vayxcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEhvb2s8VCBleHRlbmRzIGtleW9mIFN1aXRlSG9va3M+KG5hbWU6IFQsIC4uLmZuOiBTdWl0ZUhvb2tzW1RdKSB7XG4gICAgZ2V0SG9va3Moc3VpdGUpW25hbWVdLnB1c2goLi4uZm4gYXMgYW55KVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFN1aXRlKCkge1xuICAgIHN1aXRlID0ge1xuICAgICAgaWQ6ICcnLFxuICAgICAgdHlwZTogJ3N1aXRlJyxcbiAgICAgIG5hbWUsXG4gICAgICBtb2RlLFxuICAgICAgdGFza3M6IFtdLFxuICAgIH1cbiAgICBzZXRIb29rcyhzdWl0ZSwgY3JlYXRlU3VpdGVIb29rcygpKVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGFza3MubGVuZ3RoID0gMFxuICAgIGZhY3RvcnlRdWV1ZS5sZW5ndGggPSAwXG4gICAgaW5pdFN1aXRlKClcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGNvbGxlY3QoZmlsZT86IEZpbGUpIHtcbiAgICBmYWN0b3J5UXVldWUubGVuZ3RoID0gMFxuICAgIGlmIChmYWN0b3J5KVxuICAgICAgYXdhaXQgcnVuV2l0aFN1aXRlKGNvbGxlY3RvciwgKCkgPT4gZmFjdG9yeSh0ZXN0KSlcblxuICAgIGNvbnN0IGFsbENoaWxkcmVuOiBUYXNrW10gPSBbXVxuXG4gICAgZm9yIChjb25zdCBpIG9mIFsuLi5mYWN0b3J5UXVldWUsIC4uLnRhc2tzXSlcbiAgICAgIGFsbENoaWxkcmVuLnB1c2goaS50eXBlID09PSAnY29sbGVjdG9yJyA/IGF3YWl0IGkuY29sbGVjdChmaWxlKSA6IGkpXG5cbiAgICBzdWl0ZS5maWxlID0gZmlsZVxuICAgIHN1aXRlLnRhc2tzID0gYWxsQ2hpbGRyZW5cblxuICAgIGFsbENoaWxkcmVuLmZvckVhY2goKHRhc2spID0+IHtcbiAgICAgIHRhc2suc3VpdGUgPSBzdWl0ZVxuICAgICAgaWYgKGZpbGUpXG4gICAgICAgIHRhc2suZmlsZSA9IGZpbGVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHN1aXRlXG4gIH1cblxuICBjb2xsZWN0VGFzayhjb2xsZWN0b3IpXG5cbiAgcmV0dXJuIGNvbGxlY3RvclxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdWl0ZSgpIHtcbiAgY29uc3Qgc3VpdGUgPSBjcmVhdGVDaGFpbmFibGUoXG4gICAgWydjb25jdXJyZW50JywgJ3NraXAnLCAnb25seScsICd0b2RvJ10sXG4gICAgZnVuY3Rpb24obmFtZTogc3RyaW5nLCBmYWN0b3J5PzogU3VpdGVGYWN0b3J5KSB7XG4gICAgICBjb25zdCBtb2RlID0gdGhpcy5vbmx5ID8gJ29ubHknIDogdGhpcy5za2lwID8gJ3NraXAnIDogdGhpcy50b2RvID8gJ3RvZG8nIDogJ3J1bidcbiAgICAgIHJldHVybiBjcmVhdGVTdWl0ZUNvbGxlY3RvcihuYW1lLCBmYWN0b3J5LCBtb2RlLCB0aGlzLmNvbmN1cnJlbnQpXG4gICAgfSxcbiAgKSBhcyBTdWl0ZUFQSVxuXG4gIHN1aXRlLmVhY2ggPSA8VD4oY2FzZXM6IFJlYWRvbmx5QXJyYXk8VD4pID0+IHtcbiAgICByZXR1cm4gKG5hbWU6IHN0cmluZywgZm46ICguLi5hcmdzOiBUW10pID0+IHZvaWQpID0+IHtcbiAgICAgIGNhc2VzLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0b0FycmF5KGkpIGFzIGFueVxuICAgICAgICBzdWl0ZShmb3JtYXRUaXRsZShuYW1lLCBpdGVtcyksICgpID0+IGZuKC4uLml0ZW1zKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN1aXRlIGFzIFN1aXRlQVBJXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlc3QoZm46ICgodGhpczogUmVjb3JkPCdjb25jdXJyZW50J3wgJ3NraXAnfCAnb25seSd8ICd0b2RvJ3wgJ2ZhaWxzJywgYm9vbGVhbiB8IHVuZGVmaW5lZD4sIHRpdGxlOiBzdHJpbmcsIGZuPzogVGVzdEZ1bmN0aW9uLCB0aW1lb3V0PzogbnVtYmVyKSA9PiB2b2lkKSkge1xuICBjb25zdCB0ZXN0ID0gY3JlYXRlQ2hhaW5hYmxlKFxuICAgIFsnY29uY3VycmVudCcsICdza2lwJywgJ29ubHknLCAndG9kbycsICdmYWlscyddLFxuICAgIGZuLFxuICApIGFzIFRlc3RBUElcblxuICB0ZXN0LmVhY2ggPSA8VD4oY2FzZXM6IFJlYWRvbmx5QXJyYXk8VD4pID0+IHtcbiAgICByZXR1cm4gKG5hbWU6IHN0cmluZywgZm46ICguLi5hcmdzOiBUW10pID0+IHZvaWQpID0+IHtcbiAgICAgIGNhc2VzLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0b0FycmF5KGkpIGFzIGFueVxuICAgICAgICB0ZXN0KGZvcm1hdFRpdGxlKG5hbWUsIGl0ZW1zKSwgKCkgPT4gZm4oLi4uaXRlbXMpKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGVzdCBhcyBUZXN0QVBJXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEFOU0lfQkFDS0dST1VORF9PRkZTRVQgPSAxMDtcblxuY29uc3Qgd3JhcEFuc2kyNTYgPSAob2Zmc2V0ID0gMCkgPT4gY29kZSA9PiBgXFx1MDAxQlskezM4ICsgb2Zmc2V0fTs1OyR7Y29kZX1tYDtcblxuY29uc3Qgd3JhcEFuc2kxNm0gPSAob2Zmc2V0ID0gMCkgPT4gKHJlZCwgZ3JlZW4sIGJsdWUpID0+IGBcXHUwMDFCWyR7MzggKyBvZmZzZXR9OzI7JHtyZWR9OyR7Z3JlZW59OyR7Ymx1ZX1tYDtcblxuZnVuY3Rpb24gYXNzZW1ibGVTdHlsZXMoKSB7XG5cdGNvbnN0IGNvZGVzID0gbmV3IE1hcCgpO1xuXHRjb25zdCBzdHlsZXMgPSB7XG5cdFx0bW9kaWZpZXI6IHtcblx0XHRcdHJlc2V0OiBbMCwgMF0sXG5cdFx0XHQvLyAyMSBpc24ndCB3aWRlbHkgc3VwcG9ydGVkIGFuZCAyMiBkb2VzIHRoZSBzYW1lIHRoaW5nXG5cdFx0XHRib2xkOiBbMSwgMjJdLFxuXHRcdFx0ZGltOiBbMiwgMjJdLFxuXHRcdFx0aXRhbGljOiBbMywgMjNdLFxuXHRcdFx0dW5kZXJsaW5lOiBbNCwgMjRdLFxuXHRcdFx0b3ZlcmxpbmU6IFs1MywgNTVdLFxuXHRcdFx0aW52ZXJzZTogWzcsIDI3XSxcblx0XHRcdGhpZGRlbjogWzgsIDI4XSxcblx0XHRcdHN0cmlrZXRocm91Z2g6IFs5LCAyOV1cblx0XHR9LFxuXHRcdGNvbG9yOiB7XG5cdFx0XHRibGFjazogWzMwLCAzOV0sXG5cdFx0XHRyZWQ6IFszMSwgMzldLFxuXHRcdFx0Z3JlZW46IFszMiwgMzldLFxuXHRcdFx0eWVsbG93OiBbMzMsIDM5XSxcblx0XHRcdGJsdWU6IFszNCwgMzldLFxuXHRcdFx0bWFnZW50YTogWzM1LCAzOV0sXG5cdFx0XHRjeWFuOiBbMzYsIDM5XSxcblx0XHRcdHdoaXRlOiBbMzcsIDM5XSxcblxuXHRcdFx0Ly8gQnJpZ2h0IGNvbG9yXG5cdFx0XHRibGFja0JyaWdodDogWzkwLCAzOV0sXG5cdFx0XHRyZWRCcmlnaHQ6IFs5MSwgMzldLFxuXHRcdFx0Z3JlZW5CcmlnaHQ6IFs5MiwgMzldLFxuXHRcdFx0eWVsbG93QnJpZ2h0OiBbOTMsIDM5XSxcblx0XHRcdGJsdWVCcmlnaHQ6IFs5NCwgMzldLFxuXHRcdFx0bWFnZW50YUJyaWdodDogWzk1LCAzOV0sXG5cdFx0XHRjeWFuQnJpZ2h0OiBbOTYsIDM5XSxcblx0XHRcdHdoaXRlQnJpZ2h0OiBbOTcsIDM5XVxuXHRcdH0sXG5cdFx0YmdDb2xvcjoge1xuXHRcdFx0YmdCbGFjazogWzQwLCA0OV0sXG5cdFx0XHRiZ1JlZDogWzQxLCA0OV0sXG5cdFx0XHRiZ0dyZWVuOiBbNDIsIDQ5XSxcblx0XHRcdGJnWWVsbG93OiBbNDMsIDQ5XSxcblx0XHRcdGJnQmx1ZTogWzQ0LCA0OV0sXG5cdFx0XHRiZ01hZ2VudGE6IFs0NSwgNDldLFxuXHRcdFx0YmdDeWFuOiBbNDYsIDQ5XSxcblx0XHRcdGJnV2hpdGU6IFs0NywgNDldLFxuXG5cdFx0XHQvLyBCcmlnaHQgY29sb3Jcblx0XHRcdGJnQmxhY2tCcmlnaHQ6IFsxMDAsIDQ5XSxcblx0XHRcdGJnUmVkQnJpZ2h0OiBbMTAxLCA0OV0sXG5cdFx0XHRiZ0dyZWVuQnJpZ2h0OiBbMTAyLCA0OV0sXG5cdFx0XHRiZ1llbGxvd0JyaWdodDogWzEwMywgNDldLFxuXHRcdFx0YmdCbHVlQnJpZ2h0OiBbMTA0LCA0OV0sXG5cdFx0XHRiZ01hZ2VudGFCcmlnaHQ6IFsxMDUsIDQ5XSxcblx0XHRcdGJnQ3lhbkJyaWdodDogWzEwNiwgNDldLFxuXHRcdFx0YmdXaGl0ZUJyaWdodDogWzEwNywgNDldXG5cdFx0fVxuXHR9O1xuXG5cdC8vIEFsaWFzIGJyaWdodCBibGFjayBhcyBncmF5IChhbmQgZ3JleSlcblx0c3R5bGVzLmNvbG9yLmdyYXkgPSBzdHlsZXMuY29sb3IuYmxhY2tCcmlnaHQ7XG5cdHN0eWxlcy5iZ0NvbG9yLmJnR3JheSA9IHN0eWxlcy5iZ0NvbG9yLmJnQmxhY2tCcmlnaHQ7XG5cdHN0eWxlcy5jb2xvci5ncmV5ID0gc3R5bGVzLmNvbG9yLmJsYWNrQnJpZ2h0O1xuXHRzdHlsZXMuYmdDb2xvci5iZ0dyZXkgPSBzdHlsZXMuYmdDb2xvci5iZ0JsYWNrQnJpZ2h0O1xuXG5cdGZvciAoY29uc3QgW2dyb3VwTmFtZSwgZ3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKHN0eWxlcykpIHtcblx0XHRmb3IgKGNvbnN0IFtzdHlsZU5hbWUsIHN0eWxlXSBvZiBPYmplY3QuZW50cmllcyhncm91cCkpIHtcblx0XHRcdHN0eWxlc1tzdHlsZU5hbWVdID0ge1xuXHRcdFx0XHRvcGVuOiBgXFx1MDAxQlske3N0eWxlWzBdfW1gLFxuXHRcdFx0XHRjbG9zZTogYFxcdTAwMUJbJHtzdHlsZVsxXX1tYFxuXHRcdFx0fTtcblxuXHRcdFx0Z3JvdXBbc3R5bGVOYW1lXSA9IHN0eWxlc1tzdHlsZU5hbWVdO1xuXG5cdFx0XHRjb2Rlcy5zZXQoc3R5bGVbMF0sIHN0eWxlWzFdKTtcblx0XHR9XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoc3R5bGVzLCBncm91cE5hbWUsIHtcblx0XHRcdHZhbHVlOiBncm91cCxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0fSk7XG5cdH1cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoc3R5bGVzLCAnY29kZXMnLCB7XG5cdFx0dmFsdWU6IGNvZGVzLFxuXHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdH0pO1xuXG5cdHN0eWxlcy5jb2xvci5jbG9zZSA9ICdcXHUwMDFCWzM5bSc7XG5cdHN0eWxlcy5iZ0NvbG9yLmNsb3NlID0gJ1xcdTAwMUJbNDltJztcblxuXHRzdHlsZXMuY29sb3IuYW5zaTI1NiA9IHdyYXBBbnNpMjU2KCk7XG5cdHN0eWxlcy5jb2xvci5hbnNpMTZtID0gd3JhcEFuc2kxNm0oKTtcblx0c3R5bGVzLmJnQ29sb3IuYW5zaTI1NiA9IHdyYXBBbnNpMjU2KEFOU0lfQkFDS0dST1VORF9PRkZTRVQpO1xuXHRzdHlsZXMuYmdDb2xvci5hbnNpMTZtID0gd3JhcEFuc2kxNm0oQU5TSV9CQUNLR1JPVU5EX09GRlNFVCk7XG5cblx0Ly8gRnJvbSBodHRwczovL2dpdGh1Yi5jb20vUWl4LS9jb2xvci1jb252ZXJ0L2Jsb2IvM2YwZTBkNGU5MmUyMzU3OTZjY2IxN2Y2ZTg1YzcyMDk0YTY1MWY0OS9jb252ZXJzaW9ucy5qc1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhzdHlsZXMsIHtcblx0XHRyZ2JUb0Fuc2kyNTY6IHtcblx0XHRcdHZhbHVlOiAocmVkLCBncmVlbiwgYmx1ZSkgPT4ge1xuXHRcdFx0XHQvLyBXZSB1c2UgdGhlIGV4dGVuZGVkIGdyZXlzY2FsZSBwYWxldHRlIGhlcmUsIHdpdGggdGhlIGV4Y2VwdGlvbiBvZlxuXHRcdFx0XHQvLyBibGFjayBhbmQgd2hpdGUuIG5vcm1hbCBwYWxldHRlIG9ubHkgaGFzIDQgZ3JleXNjYWxlIHNoYWRlcy5cblx0XHRcdFx0aWYgKHJlZCA9PT0gZ3JlZW4gJiYgZ3JlZW4gPT09IGJsdWUpIHtcblx0XHRcdFx0XHRpZiAocmVkIDwgOCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIDE2O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChyZWQgPiAyNDgpIHtcblx0XHRcdFx0XHRcdHJldHVybiAyMzE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIE1hdGgucm91bmQoKChyZWQgLSA4KSAvIDI0NykgKiAyNCkgKyAyMzI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gMTYgK1xuXHRcdFx0XHRcdCgzNiAqIE1hdGgucm91bmQocmVkIC8gMjU1ICogNSkpICtcblx0XHRcdFx0XHQoNiAqIE1hdGgucm91bmQoZ3JlZW4gLyAyNTUgKiA1KSkgK1xuXHRcdFx0XHRcdE1hdGgucm91bmQoYmx1ZSAvIDI1NSAqIDUpO1xuXHRcdFx0fSxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0fSxcblx0XHRoZXhUb1JnYjoge1xuXHRcdFx0dmFsdWU6IGhleCA9PiB7XG5cdFx0XHRcdGNvbnN0IG1hdGNoZXMgPSAvKD88Y29sb3JTdHJpbmc+W2EtZlxcZF17Nn18W2EtZlxcZF17M30pL2kuZXhlYyhoZXgudG9TdHJpbmcoMTYpKTtcblx0XHRcdFx0aWYgKCFtYXRjaGVzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFswLCAwLCAwXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCB7Y29sb3JTdHJpbmd9ID0gbWF0Y2hlcy5ncm91cHM7XG5cblx0XHRcdFx0aWYgKGNvbG9yU3RyaW5nLmxlbmd0aCA9PT0gMykge1xuXHRcdFx0XHRcdGNvbG9yU3RyaW5nID0gY29sb3JTdHJpbmcuc3BsaXQoJycpLm1hcChjaGFyYWN0ZXIgPT4gY2hhcmFjdGVyICsgY2hhcmFjdGVyKS5qb2luKCcnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGludGVnZXIgPSBOdW1iZXIucGFyc2VJbnQoY29sb3JTdHJpbmcsIDE2KTtcblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdChpbnRlZ2VyID4+IDE2KSAmIDB4RkYsXG5cdFx0XHRcdFx0KGludGVnZXIgPj4gOCkgJiAweEZGLFxuXHRcdFx0XHRcdGludGVnZXIgJiAweEZGXG5cdFx0XHRcdF07XG5cdFx0XHR9LFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0XHR9LFxuXHRcdGhleFRvQW5zaTI1Njoge1xuXHRcdFx0dmFsdWU6IGhleCA9PiBzdHlsZXMucmdiVG9BbnNpMjU2KC4uLnN0eWxlcy5oZXhUb1JnYihoZXgpKSxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG4vLyBNYWtlIHRoZSBleHBvcnQgaW1tdXRhYmxlXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0Z2V0OiBhc3NlbWJsZVN0eWxlc1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wcmludEl0ZXJhdG9yRW50cmllcyA9IHByaW50SXRlcmF0b3JFbnRyaWVzO1xuZXhwb3J0cy5wcmludEl0ZXJhdG9yVmFsdWVzID0gcHJpbnRJdGVyYXRvclZhbHVlcztcbmV4cG9ydHMucHJpbnRMaXN0SXRlbXMgPSBwcmludExpc3RJdGVtcztcbmV4cG9ydHMucHJpbnRPYmplY3RQcm9wZXJ0aWVzID0gcHJpbnRPYmplY3RQcm9wZXJ0aWVzO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuY29uc3QgZ2V0S2V5c09mRW51bWVyYWJsZVByb3BlcnRpZXMgPSAob2JqZWN0LCBjb21wYXJlS2V5cykgPT4ge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KS5zb3J0KGNvbXBhcmVLZXlzKTtcblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KS5mb3JFYWNoKHN5bWJvbCA9PiB7XG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bWJvbCkuZW51bWVyYWJsZSkge1xuICAgICAgICBrZXlzLnB1c2goc3ltYm9sKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBrZXlzO1xufTtcbi8qKlxuICogUmV0dXJuIGVudHJpZXMgKGZvciBleGFtcGxlLCBvZiBhIG1hcClcbiAqIHdpdGggc3BhY2luZywgaW5kZW50YXRpb24sIGFuZCBjb21tYVxuICogd2l0aG91dCBzdXJyb3VuZGluZyBwdW5jdHVhdGlvbiAoZm9yIGV4YW1wbGUsIGJyYWNlcylcbiAqL1xuXG5mdW5jdGlvbiBwcmludEl0ZXJhdG9yRW50cmllcyhcbiAgaXRlcmF0b3IsXG4gIGNvbmZpZyxcbiAgaW5kZW50YXRpb24sXG4gIGRlcHRoLFxuICByZWZzLFxuICBwcmludGVyLCAvLyBUb28gYmFkLCBzbyBzYWQgdGhhdCBzZXBhcmF0b3IgZm9yIEVDTUFTY3JpcHQgTWFwIGhhcyBiZWVuICcgPT4gJ1xuICAvLyBXaGF0IGEgZGlzdHJhY3RpbmcgZGlmZiBpZiB5b3UgY2hhbmdlIGEgZGF0YSBzdHJ1Y3R1cmUgdG8vZnJvbVxuICAvLyBFQ01BU2NyaXB0IE9iamVjdCBvciBJbW11dGFibGUuTWFwL09yZGVyZWRNYXAgd2hpY2ggdXNlIHRoZSBkZWZhdWx0LlxuICBzZXBhcmF0b3IgPSAnOiAnXG4pIHtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBsZXQgY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKTtcblxuICBpZiAoIWN1cnJlbnQuZG9uZSkge1xuICAgIHJlc3VsdCArPSBjb25maWcuc3BhY2luZ091dGVyO1xuICAgIGNvbnN0IGluZGVudGF0aW9uTmV4dCA9IGluZGVudGF0aW9uICsgY29uZmlnLmluZGVudDtcblxuICAgIHdoaWxlICghY3VycmVudC5kb25lKSB7XG4gICAgICBjb25zdCBuYW1lID0gcHJpbnRlcihcbiAgICAgICAgY3VycmVudC52YWx1ZVswXSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICBpbmRlbnRhdGlvbk5leHQsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICByZWZzXG4gICAgICApO1xuICAgICAgY29uc3QgdmFsdWUgPSBwcmludGVyKFxuICAgICAgICBjdXJyZW50LnZhbHVlWzFdLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGluZGVudGF0aW9uTmV4dCxcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIHJlZnNcbiAgICAgICk7XG4gICAgICByZXN1bHQgKz0gaW5kZW50YXRpb25OZXh0ICsgbmFtZSArIHNlcGFyYXRvciArIHZhbHVlO1xuICAgICAgY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKTtcblxuICAgICAgaWYgKCFjdXJyZW50LmRvbmUpIHtcbiAgICAgICAgcmVzdWx0ICs9ICcsJyArIGNvbmZpZy5zcGFjaW5nSW5uZXI7XG4gICAgICB9IGVsc2UgaWYgKCFjb25maWcubWluKSB7XG4gICAgICAgIHJlc3VsdCArPSAnLCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IGNvbmZpZy5zcGFjaW5nT3V0ZXIgKyBpbmRlbnRhdGlvbjtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIFJldHVybiB2YWx1ZXMgKGZvciBleGFtcGxlLCBvZiBhIHNldClcbiAqIHdpdGggc3BhY2luZywgaW5kZW50YXRpb24sIGFuZCBjb21tYVxuICogd2l0aG91dCBzdXJyb3VuZGluZyBwdW5jdHVhdGlvbiAoYnJhY2VzIG9yIGJyYWNrZXRzKVxuICovXG5cbmZ1bmN0aW9uIHByaW50SXRlcmF0b3JWYWx1ZXMoXG4gIGl0ZXJhdG9yLFxuICBjb25maWcsXG4gIGluZGVudGF0aW9uLFxuICBkZXB0aCxcbiAgcmVmcyxcbiAgcHJpbnRlclxuKSB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgbGV0IGN1cnJlbnQgPSBpdGVyYXRvci5uZXh0KCk7XG5cbiAgaWYgKCFjdXJyZW50LmRvbmUpIHtcbiAgICByZXN1bHQgKz0gY29uZmlnLnNwYWNpbmdPdXRlcjtcbiAgICBjb25zdCBpbmRlbnRhdGlvbk5leHQgPSBpbmRlbnRhdGlvbiArIGNvbmZpZy5pbmRlbnQ7XG5cbiAgICB3aGlsZSAoIWN1cnJlbnQuZG9uZSkge1xuICAgICAgcmVzdWx0ICs9XG4gICAgICAgIGluZGVudGF0aW9uTmV4dCArXG4gICAgICAgIHByaW50ZXIoY3VycmVudC52YWx1ZSwgY29uZmlnLCBpbmRlbnRhdGlvbk5leHQsIGRlcHRoLCByZWZzKTtcbiAgICAgIGN1cnJlbnQgPSBpdGVyYXRvci5uZXh0KCk7XG5cbiAgICAgIGlmICghY3VycmVudC5kb25lKSB7XG4gICAgICAgIHJlc3VsdCArPSAnLCcgKyBjb25maWcuc3BhY2luZ0lubmVyO1xuICAgICAgfSBlbHNlIGlmICghY29uZmlnLm1pbikge1xuICAgICAgICByZXN1bHQgKz0gJywnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCArPSBjb25maWcuc3BhY2luZ091dGVyICsgaW5kZW50YXRpb247XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBSZXR1cm4gaXRlbXMgKGZvciBleGFtcGxlLCBvZiBhbiBhcnJheSlcbiAqIHdpdGggc3BhY2luZywgaW5kZW50YXRpb24sIGFuZCBjb21tYVxuICogd2l0aG91dCBzdXJyb3VuZGluZyBwdW5jdHVhdGlvbiAoZm9yIGV4YW1wbGUsIGJyYWNrZXRzKVxuICoqL1xuXG5mdW5jdGlvbiBwcmludExpc3RJdGVtcyhsaXN0LCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcywgcHJpbnRlcikge1xuICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgaWYgKGxpc3QubGVuZ3RoKSB7XG4gICAgcmVzdWx0ICs9IGNvbmZpZy5zcGFjaW5nT3V0ZXI7XG4gICAgY29uc3QgaW5kZW50YXRpb25OZXh0ID0gaW5kZW50YXRpb24gKyBjb25maWcuaW5kZW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQgKz0gaW5kZW50YXRpb25OZXh0O1xuXG4gICAgICBpZiAoaSBpbiBsaXN0KSB7XG4gICAgICAgIHJlc3VsdCArPSBwcmludGVyKGxpc3RbaV0sIGNvbmZpZywgaW5kZW50YXRpb25OZXh0LCBkZXB0aCwgcmVmcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpIDwgbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJlc3VsdCArPSAnLCcgKyBjb25maWcuc3BhY2luZ0lubmVyO1xuICAgICAgfSBlbHNlIGlmICghY29uZmlnLm1pbikge1xuICAgICAgICByZXN1bHQgKz0gJywnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCArPSBjb25maWcuc3BhY2luZ091dGVyICsgaW5kZW50YXRpb247XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBSZXR1cm4gcHJvcGVydGllcyBvZiBhbiBvYmplY3RcbiAqIHdpdGggc3BhY2luZywgaW5kZW50YXRpb24sIGFuZCBjb21tYVxuICogd2l0aG91dCBzdXJyb3VuZGluZyBwdW5jdHVhdGlvbiAoZm9yIGV4YW1wbGUsIGJyYWNlcylcbiAqL1xuXG5mdW5jdGlvbiBwcmludE9iamVjdFByb3BlcnRpZXModmFsLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcywgcHJpbnRlcikge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGNvbnN0IGtleXMgPSBnZXRLZXlzT2ZFbnVtZXJhYmxlUHJvcGVydGllcyh2YWwsIGNvbmZpZy5jb21wYXJlS2V5cyk7XG5cbiAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgcmVzdWx0ICs9IGNvbmZpZy5zcGFjaW5nT3V0ZXI7XG4gICAgY29uc3QgaW5kZW50YXRpb25OZXh0ID0gaW5kZW50YXRpb24gKyBjb25maWcuaW5kZW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgY29uc3QgbmFtZSA9IHByaW50ZXIoa2V5LCBjb25maWcsIGluZGVudGF0aW9uTmV4dCwgZGVwdGgsIHJlZnMpO1xuICAgICAgY29uc3QgdmFsdWUgPSBwcmludGVyKHZhbFtrZXldLCBjb25maWcsIGluZGVudGF0aW9uTmV4dCwgZGVwdGgsIHJlZnMpO1xuICAgICAgcmVzdWx0ICs9IGluZGVudGF0aW9uTmV4dCArIG5hbWUgKyAnOiAnICsgdmFsdWU7XG5cbiAgICAgIGlmIChpIDwga2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHJlc3VsdCArPSAnLCcgKyBjb25maWcuc3BhY2luZ0lubmVyO1xuICAgICAgfSBlbHNlIGlmICghY29uZmlnLm1pbikge1xuICAgICAgICByZXN1bHQgKz0gJywnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCArPSBjb25maWcuc3BhY2luZ091dGVyICsgaW5kZW50YXRpb247XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudGVzdCA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2NvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMnKTtcblxudmFyIGdsb2JhbCA9IChmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICB9XG59KSgpO1xuXG52YXIgU3ltYm9sID0gZ2xvYmFsWydqZXN0LXN5bWJvbC1kby1ub3QtdG91Y2gnXSB8fCBnbG9iYWwuU3ltYm9sO1xuY29uc3QgYXN5bW1ldHJpY01hdGNoZXIgPVxuICB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3JcbiAgICA/IFN5bWJvbC5mb3IoJ2plc3QuYXN5bW1ldHJpY01hdGNoZXInKVxuICAgIDogMHgxMzU3YTU7XG5jb25zdCBTUEFDRSA9ICcgJztcblxuY29uc3Qgc2VyaWFsaXplID0gKHZhbCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMsIHByaW50ZXIpID0+IHtcbiAgY29uc3Qgc3RyaW5nZWRWYWx1ZSA9IHZhbC50b1N0cmluZygpO1xuXG4gIGlmIChcbiAgICBzdHJpbmdlZFZhbHVlID09PSAnQXJyYXlDb250YWluaW5nJyB8fFxuICAgIHN0cmluZ2VkVmFsdWUgPT09ICdBcnJheU5vdENvbnRhaW5pbmcnXG4gICkge1xuICAgIGlmICgrK2RlcHRoID4gY29uZmlnLm1heERlcHRoKSB7XG4gICAgICByZXR1cm4gJ1snICsgc3RyaW5nZWRWYWx1ZSArICddJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgc3RyaW5nZWRWYWx1ZSArXG4gICAgICBTUEFDRSArXG4gICAgICAnWycgK1xuICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludExpc3RJdGVtcykoXG4gICAgICAgIHZhbC5zYW1wbGUsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgIGRlcHRoLFxuICAgICAgICByZWZzLFxuICAgICAgICBwcmludGVyXG4gICAgICApICtcbiAgICAgICddJ1xuICAgICk7XG4gIH1cblxuICBpZiAoXG4gICAgc3RyaW5nZWRWYWx1ZSA9PT0gJ09iamVjdENvbnRhaW5pbmcnIHx8XG4gICAgc3RyaW5nZWRWYWx1ZSA9PT0gJ09iamVjdE5vdENvbnRhaW5pbmcnXG4gICkge1xuICAgIGlmICgrK2RlcHRoID4gY29uZmlnLm1heERlcHRoKSB7XG4gICAgICByZXR1cm4gJ1snICsgc3RyaW5nZWRWYWx1ZSArICddJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgc3RyaW5nZWRWYWx1ZSArXG4gICAgICBTUEFDRSArXG4gICAgICAneycgK1xuICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludE9iamVjdFByb3BlcnRpZXMpKFxuICAgICAgICB2YWwuc2FtcGxlLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGluZGVudGF0aW9uLFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgcmVmcyxcbiAgICAgICAgcHJpbnRlclxuICAgICAgKSArXG4gICAgICAnfSdcbiAgICApO1xuICB9XG5cbiAgaWYgKFxuICAgIHN0cmluZ2VkVmFsdWUgPT09ICdTdHJpbmdNYXRjaGluZycgfHxcbiAgICBzdHJpbmdlZFZhbHVlID09PSAnU3RyaW5nTm90TWF0Y2hpbmcnXG4gICkge1xuICAgIHJldHVybiAoXG4gICAgICBzdHJpbmdlZFZhbHVlICtcbiAgICAgIFNQQUNFICtcbiAgICAgIHByaW50ZXIodmFsLnNhbXBsZSwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMpXG4gICAgKTtcbiAgfVxuXG4gIGlmIChcbiAgICBzdHJpbmdlZFZhbHVlID09PSAnU3RyaW5nQ29udGFpbmluZycgfHxcbiAgICBzdHJpbmdlZFZhbHVlID09PSAnU3RyaW5nTm90Q29udGFpbmluZydcbiAgKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHN0cmluZ2VkVmFsdWUgK1xuICAgICAgU1BBQ0UgK1xuICAgICAgcHJpbnRlcih2YWwuc2FtcGxlLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcylcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHZhbC50b0FzeW1tZXRyaWNNYXRjaGVyKCk7XG59O1xuXG5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcblxuY29uc3QgdGVzdCA9IHZhbCA9PiB2YWwgJiYgdmFsLiQkdHlwZW9mID09PSBhc3ltbWV0cmljTWF0Y2hlcjtcblxuZXhwb3J0cy50ZXN0ID0gdGVzdDtcbmNvbnN0IHBsdWdpbiA9IHtcbiAgc2VyaWFsaXplLFxuICB0ZXN0XG59O1xudmFyIF9kZWZhdWx0ID0gcGx1Z2luO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKHtvbmx5Rmlyc3QgPSBmYWxzZX0gPSB7fSkgPT4ge1xuXHRjb25zdCBwYXR0ZXJuID0gW1xuXHRcdCdbXFxcXHUwMDFCXFxcXHUwMDlCXVtbXFxcXF0oKSM7P10qKD86KD86KD86KD86O1stYS16QS1aXFxcXGRcXFxcLyMmLjo9PyVAfl9dKykqfFthLXpBLVpcXFxcZF0rKD86O1stYS16QS1aXFxcXGRcXFxcLyMmLjo9PyVAfl9dKikqKT9cXFxcdTAwMDcpJyxcblx0XHQnKD86KD86XFxcXGR7MSw0fSg/OjtcXFxcZHswLDR9KSopP1tcXFxcZEEtUFItVFpjZi1udHFyeT0+PH5dKSknXG5cdF0uam9pbignfCcpO1xuXG5cdHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sIG9ubHlGaXJzdCA/IHVuZGVmaW5lZCA6ICdnJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudGVzdCA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2Fuc2lSZWdleCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZSgnYW5zaS1yZWdleCcpKTtcblxudmFyIF9hbnNpU3R5bGVzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKCdhbnNpLXN0eWxlcycpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtkZWZhdWx0OiBvYmp9O1xufVxuXG4vKipcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5jb25zdCB0b0h1bWFuUmVhZGFibGVBbnNpID0gdGV4dCA9PlxuICB0ZXh0LnJlcGxhY2UoKDAsIF9hbnNpUmVnZXguZGVmYXVsdCkoKSwgbWF0Y2ggPT4ge1xuICAgIHN3aXRjaCAobWF0Y2gpIHtcbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC5yZWQuY2xvc2U6XG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuZ3JlZW4uY2xvc2U6XG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuY3lhbi5jbG9zZTpcbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC5ncmF5LmNsb3NlOlxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LndoaXRlLmNsb3NlOlxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LnllbGxvdy5jbG9zZTpcbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC5iZ1JlZC5jbG9zZTpcbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC5iZ0dyZWVuLmNsb3NlOlxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmJnWWVsbG93LmNsb3NlOlxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmludmVyc2UuY2xvc2U6XG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuZGltLmNsb3NlOlxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmJvbGQuY2xvc2U6XG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQucmVzZXQub3BlbjpcbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC5yZXNldC5jbG9zZTpcbiAgICAgICAgcmV0dXJuICc8Lz4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQucmVkLm9wZW46XG4gICAgICAgIHJldHVybiAnPHJlZD4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuZ3JlZW4ub3BlbjpcbiAgICAgICAgcmV0dXJuICc8Z3JlZW4+JztcblxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmN5YW4ub3BlbjpcbiAgICAgICAgcmV0dXJuICc8Y3lhbj4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuZ3JheS5vcGVuOlxuICAgICAgICByZXR1cm4gJzxncmF5Pic7XG5cbiAgICAgIGNhc2UgX2Fuc2lTdHlsZXMuZGVmYXVsdC53aGl0ZS5vcGVuOlxuICAgICAgICByZXR1cm4gJzx3aGl0ZT4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQueWVsbG93Lm9wZW46XG4gICAgICAgIHJldHVybiAnPHllbGxvdz4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuYmdSZWQub3BlbjpcbiAgICAgICAgcmV0dXJuICc8YmdSZWQ+JztcblxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmJnR3JlZW4ub3BlbjpcbiAgICAgICAgcmV0dXJuICc8YmdHcmVlbj4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuYmdZZWxsb3cub3BlbjpcbiAgICAgICAgcmV0dXJuICc8YmdZZWxsb3c+JztcblxuICAgICAgY2FzZSBfYW5zaVN0eWxlcy5kZWZhdWx0LmludmVyc2Uub3BlbjpcbiAgICAgICAgcmV0dXJuICc8aW52ZXJzZT4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuZGltLm9wZW46XG4gICAgICAgIHJldHVybiAnPGRpbT4nO1xuXG4gICAgICBjYXNlIF9hbnNpU3R5bGVzLmRlZmF1bHQuYm9sZC5vcGVuOlxuICAgICAgICByZXR1cm4gJzxib2xkPic7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0pO1xuXG5jb25zdCB0ZXN0ID0gdmFsID0+XG4gIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmICEhdmFsLm1hdGNoKCgwLCBfYW5zaVJlZ2V4LmRlZmF1bHQpKCkpO1xuXG5leHBvcnRzLnRlc3QgPSB0ZXN0O1xuXG5jb25zdCBzZXJpYWxpemUgPSAodmFsLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcywgcHJpbnRlcikgPT5cbiAgcHJpbnRlcih0b0h1bWFuUmVhZGFibGVBbnNpKHZhbCksIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzKTtcblxuZXhwb3J0cy5zZXJpYWxpemUgPSBzZXJpYWxpemU7XG5jb25zdCBwbHVnaW4gPSB7XG4gIHNlcmlhbGl6ZSxcbiAgdGVzdFxufTtcbnZhciBfZGVmYXVsdCA9IHBsdWdpbjtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudGVzdCA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2NvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMnKTtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBsb2NhbC9iYW4tdHlwZXMtZXZlbnR1YWxseSAqL1xuY29uc3QgU1BBQ0UgPSAnICc7XG5jb25zdCBPQkpFQ1RfTkFNRVMgPSBbJ0RPTVN0cmluZ01hcCcsICdOYW1lZE5vZGVNYXAnXTtcbmNvbnN0IEFSUkFZX1JFR0VYUCA9IC9eKEhUTUxcXHcqQ29sbGVjdGlvbnxOb2RlTGlzdCkkLztcblxuY29uc3QgdGVzdE5hbWUgPSBuYW1lID0+XG4gIE9CSkVDVF9OQU1FUy5pbmRleE9mKG5hbWUpICE9PSAtMSB8fCBBUlJBWV9SRUdFWFAudGVzdChuYW1lKTtcblxuY29uc3QgdGVzdCA9IHZhbCA9PlxuICB2YWwgJiZcbiAgdmFsLmNvbnN0cnVjdG9yICYmXG4gICEhdmFsLmNvbnN0cnVjdG9yLm5hbWUgJiZcbiAgdGVzdE5hbWUodmFsLmNvbnN0cnVjdG9yLm5hbWUpO1xuXG5leHBvcnRzLnRlc3QgPSB0ZXN0O1xuXG5jb25zdCBpc05hbWVkTm9kZU1hcCA9IGNvbGxlY3Rpb24gPT5cbiAgY29sbGVjdGlvbi5jb25zdHJ1Y3Rvci5uYW1lID09PSAnTmFtZWROb2RlTWFwJztcblxuY29uc3Qgc2VyaWFsaXplID0gKGNvbGxlY3Rpb24sIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PiB7XG4gIGNvbnN0IG5hbWUgPSBjb2xsZWN0aW9uLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgaWYgKCsrZGVwdGggPiBjb25maWcubWF4RGVwdGgpIHtcbiAgICByZXR1cm4gJ1snICsgbmFtZSArICddJztcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgKGNvbmZpZy5taW4gPyAnJyA6IG5hbWUgKyBTUEFDRSkgK1xuICAgIChPQkpFQ1RfTkFNRVMuaW5kZXhPZihuYW1lKSAhPT0gLTFcbiAgICAgID8gJ3snICtcbiAgICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludE9iamVjdFByb3BlcnRpZXMpKFxuICAgICAgICAgIGlzTmFtZWROb2RlTWFwKGNvbGxlY3Rpb24pXG4gICAgICAgICAgICA/IEFycmF5LmZyb20oY29sbGVjdGlvbikucmVkdWNlKChwcm9wcywgYXR0cmlidXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgcHJvcHNbYXR0cmlidXRlLm5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgICAgICAgICAgfSwge30pXG4gICAgICAgICAgICA6IHsuLi5jb2xsZWN0aW9ufSxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgcmVmcyxcbiAgICAgICAgICBwcmludGVyXG4gICAgICAgICkgK1xuICAgICAgICAnfSdcbiAgICAgIDogJ1snICtcbiAgICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludExpc3RJdGVtcykoXG4gICAgICAgICAgQXJyYXkuZnJvbShjb2xsZWN0aW9uKSxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgcmVmcyxcbiAgICAgICAgICBwcmludGVyXG4gICAgICAgICkgK1xuICAgICAgICAnXScpXG4gICk7XG59O1xuXG5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcbmNvbnN0IHBsdWdpbiA9IHtcbiAgc2VyaWFsaXplLFxuICB0ZXN0XG59O1xudmFyIF9kZWZhdWx0ID0gcGx1Z2luO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZXNjYXBlSFRNTDtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlSFRNTChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucHJpbnRUZXh0ID1cbiAgZXhwb3J0cy5wcmludFByb3BzID1cbiAgZXhwb3J0cy5wcmludEVsZW1lbnRBc0xlYWYgPVxuICBleHBvcnRzLnByaW50RWxlbWVudCA9XG4gIGV4cG9ydHMucHJpbnRDb21tZW50ID1cbiAgZXhwb3J0cy5wcmludENoaWxkcmVuID1cbiAgICB2b2lkIDA7XG5cbnZhciBfZXNjYXBlSFRNTCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZSgnLi9lc2NhcGVIVE1MJykpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge2RlZmF1bHQ6IG9ian07XG59XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbi8vIFJldHVybiBlbXB0eSBzdHJpbmcgaWYga2V5cyBpcyBlbXB0eS5cbmNvbnN0IHByaW50UHJvcHMgPSAoa2V5cywgcHJvcHMsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PiB7XG4gIGNvbnN0IGluZGVudGF0aW9uTmV4dCA9IGluZGVudGF0aW9uICsgY29uZmlnLmluZGVudDtcbiAgY29uc3QgY29sb3JzID0gY29uZmlnLmNvbG9ycztcbiAgcmV0dXJuIGtleXNcbiAgICAubWFwKGtleSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHByb3BzW2tleV07XG4gICAgICBsZXQgcHJpbnRlZCA9IHByaW50ZXIodmFsdWUsIGNvbmZpZywgaW5kZW50YXRpb25OZXh0LCBkZXB0aCwgcmVmcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmIChwcmludGVkLmluZGV4T2YoJ1xcbicpICE9PSAtMSkge1xuICAgICAgICAgIHByaW50ZWQgPVxuICAgICAgICAgICAgY29uZmlnLnNwYWNpbmdPdXRlciArXG4gICAgICAgICAgICBpbmRlbnRhdGlvbk5leHQgK1xuICAgICAgICAgICAgcHJpbnRlZCArXG4gICAgICAgICAgICBjb25maWcuc3BhY2luZ091dGVyICtcbiAgICAgICAgICAgIGluZGVudGF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpbnRlZCA9ICd7JyArIHByaW50ZWQgKyAnfSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIGNvbmZpZy5zcGFjaW5nSW5uZXIgK1xuICAgICAgICBpbmRlbnRhdGlvbiArXG4gICAgICAgIGNvbG9ycy5wcm9wLm9wZW4gK1xuICAgICAgICBrZXkgK1xuICAgICAgICBjb2xvcnMucHJvcC5jbG9zZSArXG4gICAgICAgICc9JyArXG4gICAgICAgIGNvbG9ycy52YWx1ZS5vcGVuICtcbiAgICAgICAgcHJpbnRlZCArXG4gICAgICAgIGNvbG9ycy52YWx1ZS5jbG9zZVxuICAgICAgKTtcbiAgICB9KVxuICAgIC5qb2luKCcnKTtcbn07IC8vIFJldHVybiBlbXB0eSBzdHJpbmcgaWYgY2hpbGRyZW4gaXMgZW1wdHkuXG5cbmV4cG9ydHMucHJpbnRQcm9wcyA9IHByaW50UHJvcHM7XG5cbmNvbnN0IHByaW50Q2hpbGRyZW4gPSAoY2hpbGRyZW4sIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PlxuICBjaGlsZHJlblxuICAgIC5tYXAoXG4gICAgICBjaGlsZCA9PlxuICAgICAgICBjb25maWcuc3BhY2luZ091dGVyICtcbiAgICAgICAgaW5kZW50YXRpb24gK1xuICAgICAgICAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJ1xuICAgICAgICAgID8gcHJpbnRUZXh0KGNoaWxkLCBjb25maWcpXG4gICAgICAgICAgOiBwcmludGVyKGNoaWxkLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcykpXG4gICAgKVxuICAgIC5qb2luKCcnKTtcblxuZXhwb3J0cy5wcmludENoaWxkcmVuID0gcHJpbnRDaGlsZHJlbjtcblxuY29uc3QgcHJpbnRUZXh0ID0gKHRleHQsIGNvbmZpZykgPT4ge1xuICBjb25zdCBjb250ZW50Q29sb3IgPSBjb25maWcuY29sb3JzLmNvbnRlbnQ7XG4gIHJldHVybiAoXG4gICAgY29udGVudENvbG9yLm9wZW4gKyAoMCwgX2VzY2FwZUhUTUwuZGVmYXVsdCkodGV4dCkgKyBjb250ZW50Q29sb3IuY2xvc2VcbiAgKTtcbn07XG5cbmV4cG9ydHMucHJpbnRUZXh0ID0gcHJpbnRUZXh0O1xuXG5jb25zdCBwcmludENvbW1lbnQgPSAoY29tbWVudCwgY29uZmlnKSA9PiB7XG4gIGNvbnN0IGNvbW1lbnRDb2xvciA9IGNvbmZpZy5jb2xvcnMuY29tbWVudDtcbiAgcmV0dXJuIChcbiAgICBjb21tZW50Q29sb3Iub3BlbiArXG4gICAgJzwhLS0nICtcbiAgICAoMCwgX2VzY2FwZUhUTUwuZGVmYXVsdCkoY29tbWVudCkgK1xuICAgICctLT4nICtcbiAgICBjb21tZW50Q29sb3IuY2xvc2VcbiAgKTtcbn07IC8vIFNlcGFyYXRlIHRoZSBmdW5jdGlvbnMgdG8gZm9ybWF0IHByb3BzLCBjaGlsZHJlbiwgYW5kIGVsZW1lbnQsXG4vLyBzbyBhIHBsdWdpbiBjb3VsZCBvdmVycmlkZSBhIHBhcnRpY3VsYXIgZnVuY3Rpb24sIGlmIG5lZWRlZC5cbi8vIFRvbyBiYWQsIHNvIHNhZDogdGhlIHRyYWRpdGlvbmFsIChidXQgdW5uZWNlc3NhcnkpIHNwYWNlXG4vLyBpbiBhIHNlbGYtY2xvc2luZyB0YWdDb2xvciByZXF1aXJlcyBhIHNlY29uZCB0ZXN0IG9mIHByaW50ZWRQcm9wcy5cblxuZXhwb3J0cy5wcmludENvbW1lbnQgPSBwcmludENvbW1lbnQ7XG5cbmNvbnN0IHByaW50RWxlbWVudCA9IChcbiAgdHlwZSxcbiAgcHJpbnRlZFByb3BzLFxuICBwcmludGVkQ2hpbGRyZW4sXG4gIGNvbmZpZyxcbiAgaW5kZW50YXRpb25cbikgPT4ge1xuICBjb25zdCB0YWdDb2xvciA9IGNvbmZpZy5jb2xvcnMudGFnO1xuICByZXR1cm4gKFxuICAgIHRhZ0NvbG9yLm9wZW4gK1xuICAgICc8JyArXG4gICAgdHlwZSArXG4gICAgKHByaW50ZWRQcm9wcyAmJlxuICAgICAgdGFnQ29sb3IuY2xvc2UgK1xuICAgICAgICBwcmludGVkUHJvcHMgK1xuICAgICAgICBjb25maWcuc3BhY2luZ091dGVyICtcbiAgICAgICAgaW5kZW50YXRpb24gK1xuICAgICAgICB0YWdDb2xvci5vcGVuKSArXG4gICAgKHByaW50ZWRDaGlsZHJlblxuICAgICAgPyAnPicgK1xuICAgICAgICB0YWdDb2xvci5jbG9zZSArXG4gICAgICAgIHByaW50ZWRDaGlsZHJlbiArXG4gICAgICAgIGNvbmZpZy5zcGFjaW5nT3V0ZXIgK1xuICAgICAgICBpbmRlbnRhdGlvbiArXG4gICAgICAgIHRhZ0NvbG9yLm9wZW4gK1xuICAgICAgICAnPC8nICtcbiAgICAgICAgdHlwZVxuICAgICAgOiAocHJpbnRlZFByb3BzICYmICFjb25maWcubWluID8gJycgOiAnICcpICsgJy8nKSArXG4gICAgJz4nICtcbiAgICB0YWdDb2xvci5jbG9zZVxuICApO1xufTtcblxuZXhwb3J0cy5wcmludEVsZW1lbnQgPSBwcmludEVsZW1lbnQ7XG5cbmNvbnN0IHByaW50RWxlbWVudEFzTGVhZiA9ICh0eXBlLCBjb25maWcpID0+IHtcbiAgY29uc3QgdGFnQ29sb3IgPSBjb25maWcuY29sb3JzLnRhZztcbiAgcmV0dXJuIChcbiAgICB0YWdDb2xvci5vcGVuICtcbiAgICAnPCcgK1xuICAgIHR5cGUgK1xuICAgIHRhZ0NvbG9yLmNsb3NlICtcbiAgICAnIOKApicgK1xuICAgIHRhZ0NvbG9yLm9wZW4gK1xuICAgICcgLz4nICtcbiAgICB0YWdDb2xvci5jbG9zZVxuICApO1xufTtcblxuZXhwb3J0cy5wcmludEVsZW1lbnRBc0xlYWYgPSBwcmludEVsZW1lbnRBc0xlYWY7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy50ZXN0ID0gZXhwb3J0cy5zZXJpYWxpemUgPSBleHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG5cbnZhciBfbWFya3VwID0gcmVxdWlyZSgnLi9saWIvbWFya3VwJyk7XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbmNvbnN0IEVMRU1FTlRfTk9ERSA9IDE7XG5jb25zdCBURVhUX05PREUgPSAzO1xuY29uc3QgQ09NTUVOVF9OT0RFID0gODtcbmNvbnN0IEZSQUdNRU5UX05PREUgPSAxMTtcbmNvbnN0IEVMRU1FTlRfUkVHRVhQID0gL14oKEhUTUx8U1ZHKVxcdyopP0VsZW1lbnQkLztcblxuY29uc3QgdGVzdEhhc0F0dHJpYnV0ZSA9IHZhbCA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWwuaGFzQXR0cmlidXRlID09PSAnZnVuY3Rpb24nICYmIHZhbC5oYXNBdHRyaWJ1dGUoJ2lzJyk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuY29uc3QgdGVzdE5vZGUgPSB2YWwgPT4ge1xuICBjb25zdCBjb25zdHJ1Y3Rvck5hbWUgPSB2YWwuY29uc3RydWN0b3IubmFtZTtcbiAgY29uc3Qge25vZGVUeXBlLCB0YWdOYW1lfSA9IHZhbDtcbiAgY29uc3QgaXNDdXN0b21FbGVtZW50ID1cbiAgICAodHlwZW9mIHRhZ05hbWUgPT09ICdzdHJpbmcnICYmIHRhZ05hbWUuaW5jbHVkZXMoJy0nKSkgfHxcbiAgICB0ZXN0SGFzQXR0cmlidXRlKHZhbCk7XG4gIHJldHVybiAoXG4gICAgKG5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgJiZcbiAgICAgIChFTEVNRU5UX1JFR0VYUC50ZXN0KGNvbnN0cnVjdG9yTmFtZSkgfHwgaXNDdXN0b21FbGVtZW50KSkgfHxcbiAgICAobm9kZVR5cGUgPT09IFRFWFRfTk9ERSAmJiBjb25zdHJ1Y3Rvck5hbWUgPT09ICdUZXh0JykgfHxcbiAgICAobm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERSAmJiBjb25zdHJ1Y3Rvck5hbWUgPT09ICdDb21tZW50JykgfHxcbiAgICAobm9kZVR5cGUgPT09IEZSQUdNRU5UX05PREUgJiYgY29uc3RydWN0b3JOYW1lID09PSAnRG9jdW1lbnRGcmFnbWVudCcpXG4gICk7XG59O1xuXG5jb25zdCB0ZXN0ID0gdmFsID0+IHtcbiAgdmFyIF92YWwkY29uc3RydWN0b3I7XG5cbiAgcmV0dXJuIChcbiAgICAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdm9pZCAwXG4gICAgICA/IHZvaWQgMFxuICAgICAgOiAoX3ZhbCRjb25zdHJ1Y3RvciA9IHZhbC5jb25zdHJ1Y3RvcikgPT09IG51bGwgfHxcbiAgICAgICAgX3ZhbCRjb25zdHJ1Y3RvciA9PT0gdm9pZCAwXG4gICAgICA/IHZvaWQgMFxuICAgICAgOiBfdmFsJGNvbnN0cnVjdG9yLm5hbWUpICYmIHRlc3ROb2RlKHZhbClcbiAgKTtcbn07XG5cbmV4cG9ydHMudGVzdCA9IHRlc3Q7XG5cbmZ1bmN0aW9uIG5vZGVJc1RleHQobm9kZSkge1xuICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gVEVYVF9OT0RFO1xufVxuXG5mdW5jdGlvbiBub2RlSXNDb21tZW50KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERTtcbn1cblxuZnVuY3Rpb24gbm9kZUlzRnJhZ21lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PT0gRlJBR01FTlRfTk9ERTtcbn1cblxuY29uc3Qgc2VyaWFsaXplID0gKG5vZGUsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PiB7XG4gIGlmIChub2RlSXNUZXh0KG5vZGUpKSB7XG4gICAgcmV0dXJuICgwLCBfbWFya3VwLnByaW50VGV4dCkobm9kZS5kYXRhLCBjb25maWcpO1xuICB9XG5cbiAgaWYgKG5vZGVJc0NvbW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gKDAsIF9tYXJrdXAucHJpbnRDb21tZW50KShub2RlLmRhdGEsIGNvbmZpZyk7XG4gIH1cblxuICBjb25zdCB0eXBlID0gbm9kZUlzRnJhZ21lbnQobm9kZSlcbiAgICA/ICdEb2N1bWVudEZyYWdtZW50J1xuICAgIDogbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgaWYgKCsrZGVwdGggPiBjb25maWcubWF4RGVwdGgpIHtcbiAgICByZXR1cm4gKDAsIF9tYXJrdXAucHJpbnRFbGVtZW50QXNMZWFmKSh0eXBlLCBjb25maWcpO1xuICB9XG5cbiAgcmV0dXJuICgwLCBfbWFya3VwLnByaW50RWxlbWVudCkoXG4gICAgdHlwZSxcbiAgICAoMCwgX21hcmt1cC5wcmludFByb3BzKShcbiAgICAgIG5vZGVJc0ZyYWdtZW50KG5vZGUpXG4gICAgICAgID8gW11cbiAgICAgICAgOiBBcnJheS5mcm9tKG5vZGUuYXR0cmlidXRlcylcbiAgICAgICAgICAgIC5tYXAoYXR0ciA9PiBhdHRyLm5hbWUpXG4gICAgICAgICAgICAuc29ydCgpLFxuICAgICAgbm9kZUlzRnJhZ21lbnQobm9kZSlcbiAgICAgICAgPyB7fVxuICAgICAgICA6IEFycmF5LmZyb20obm9kZS5hdHRyaWJ1dGVzKS5yZWR1Y2UoKHByb3BzLCBhdHRyaWJ1dGUpID0+IHtcbiAgICAgICAgICAgIHByb3BzW2F0dHJpYnV0ZS5uYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgICAgICB9LCB7fSksXG4gICAgICBjb25maWcsXG4gICAgICBpbmRlbnRhdGlvbiArIGNvbmZpZy5pbmRlbnQsXG4gICAgICBkZXB0aCxcbiAgICAgIHJlZnMsXG4gICAgICBwcmludGVyXG4gICAgKSxcbiAgICAoMCwgX21hcmt1cC5wcmludENoaWxkcmVuKShcbiAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG5vZGUuY2hpbGROb2RlcyB8fCBub2RlLmNoaWxkcmVuKSxcbiAgICAgIGNvbmZpZyxcbiAgICAgIGluZGVudGF0aW9uICsgY29uZmlnLmluZGVudCxcbiAgICAgIGRlcHRoLFxuICAgICAgcmVmcyxcbiAgICAgIHByaW50ZXJcbiAgICApLFxuICAgIGNvbmZpZyxcbiAgICBpbmRlbnRhdGlvblxuICApO1xufTtcblxuZXhwb3J0cy5zZXJpYWxpemUgPSBzZXJpYWxpemU7XG5jb25zdCBwbHVnaW4gPSB7XG4gIHNlcmlhbGl6ZSxcbiAgdGVzdFxufTtcbnZhciBfZGVmYXVsdCA9IHBsdWdpbjtcbmV4cG9ydHMuZGVmYXVsdCA9IF9kZWZhdWx0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudGVzdCA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgX2NvbGxlY3Rpb25zID0gcmVxdWlyZSgnLi4vY29sbGVjdGlvbnMnKTtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuLy8gU0VOVElORUwgY29uc3RhbnRzIGFyZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9pbW11dGFibGUtanNcbmNvbnN0IElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcbmNvbnN0IElTX0xJU1RfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9MSVNUX19AQCc7XG5jb25zdCBJU19LRVlFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0tFWUVEX19AQCc7XG5jb25zdCBJU19NQVBfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9NQVBfX0BAJztcbmNvbnN0IElTX09SREVSRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5jb25zdCBJU19SRUNPUkRfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9SRUNPUkRfX0BAJzsgLy8gaW1tdXRhYmxlIHY0XG5cbmNvbnN0IElTX1NFUV9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NFUV9fQEAnO1xuY29uc3QgSVNfU0VUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VUX19AQCc7XG5jb25zdCBJU19TVEFDS19TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NUQUNLX19AQCc7XG5cbmNvbnN0IGdldEltbXV0YWJsZU5hbWUgPSBuYW1lID0+ICdJbW11dGFibGUuJyArIG5hbWU7XG5cbmNvbnN0IHByaW50QXNMZWFmID0gbmFtZSA9PiAnWycgKyBuYW1lICsgJ10nO1xuXG5jb25zdCBTUEFDRSA9ICcgJztcbmNvbnN0IExBWlkgPSAn4oCmJzsgLy8gU2VxIGlzIGxhenkgaWYgaXQgY2FsbHMgYSBtZXRob2QgbGlrZSBmaWx0ZXJcblxuY29uc3QgcHJpbnRJbW11dGFibGVFbnRyaWVzID0gKFxuICB2YWwsXG4gIGNvbmZpZyxcbiAgaW5kZW50YXRpb24sXG4gIGRlcHRoLFxuICByZWZzLFxuICBwcmludGVyLFxuICB0eXBlXG4pID0+XG4gICsrZGVwdGggPiBjb25maWcubWF4RGVwdGhcbiAgICA/IHByaW50QXNMZWFmKGdldEltbXV0YWJsZU5hbWUodHlwZSkpXG4gICAgOiBnZXRJbW11dGFibGVOYW1lKHR5cGUpICtcbiAgICAgIFNQQUNFICtcbiAgICAgICd7JyArXG4gICAgICAoMCwgX2NvbGxlY3Rpb25zLnByaW50SXRlcmF0b3JFbnRyaWVzKShcbiAgICAgICAgdmFsLmVudHJpZXMoKSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIHJlZnMsXG4gICAgICAgIHByaW50ZXJcbiAgICAgICkgK1xuICAgICAgJ30nOyAvLyBSZWNvcmQgaGFzIGFuIGVudHJpZXMgbWV0aG9kIGJlY2F1c2UgaXQgaXMgYSBjb2xsZWN0aW9uIGluIGltbXV0YWJsZSB2My5cbi8vIFJldHVybiBhbiBpdGVyYXRvciBmb3IgSW1tdXRhYmxlIFJlY29yZCBmcm9tIHZlcnNpb24gdjMgb3IgdjQuXG5cbmZ1bmN0aW9uIGdldFJlY29yZEVudHJpZXModmFsKSB7XG4gIGxldCBpID0gMDtcbiAgcmV0dXJuIHtcbiAgICBuZXh0KCkge1xuICAgICAgaWYgKGkgPCB2YWwuX2tleXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbC5fa2V5c1tpKytdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBba2V5LCB2YWwuZ2V0KGtleSldXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRvbmU6IHRydWUsXG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBwcmludEltbXV0YWJsZVJlY29yZCA9IChcbiAgdmFsLFxuICBjb25maWcsXG4gIGluZGVudGF0aW9uLFxuICBkZXB0aCxcbiAgcmVmcyxcbiAgcHJpbnRlclxuKSA9PiB7XG4gIC8vIF9uYW1lIHByb3BlcnR5IGlzIGRlZmluZWQgb25seSBmb3IgYW4gSW1tdXRhYmxlIFJlY29yZCBpbnN0YW5jZVxuICAvLyB3aGljaCB3YXMgY29uc3RydWN0ZWQgd2l0aCBhIHNlY29uZCBvcHRpb25hbCBkZXNjcmlwdGl2ZSBuYW1lIGFyZ1xuICBjb25zdCBuYW1lID0gZ2V0SW1tdXRhYmxlTmFtZSh2YWwuX25hbWUgfHwgJ1JlY29yZCcpO1xuICByZXR1cm4gKytkZXB0aCA+IGNvbmZpZy5tYXhEZXB0aFxuICAgID8gcHJpbnRBc0xlYWYobmFtZSlcbiAgICA6IG5hbWUgK1xuICAgICAgICBTUEFDRSArXG4gICAgICAgICd7JyArXG4gICAgICAgICgwLCBfY29sbGVjdGlvbnMucHJpbnRJdGVyYXRvckVudHJpZXMpKFxuICAgICAgICAgIGdldFJlY29yZEVudHJpZXModmFsKSxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgcmVmcyxcbiAgICAgICAgICBwcmludGVyXG4gICAgICAgICkgK1xuICAgICAgICAnfSc7XG59O1xuXG5jb25zdCBwcmludEltbXV0YWJsZVNlcSA9ICh2YWwsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PiB7XG4gIGNvbnN0IG5hbWUgPSBnZXRJbW11dGFibGVOYW1lKCdTZXEnKTtcblxuICBpZiAoKytkZXB0aCA+IGNvbmZpZy5tYXhEZXB0aCkge1xuICAgIHJldHVybiBwcmludEFzTGVhZihuYW1lKTtcbiAgfVxuXG4gIGlmICh2YWxbSVNfS0VZRURfU0VOVElORUxdKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIG5hbWUgK1xuICAgICAgU1BBQ0UgK1xuICAgICAgJ3snICsgLy8gZnJvbSBJbW11dGFibGUgY29sbGVjdGlvbiBvZiBlbnRyaWVzIG9yIGZyb20gRUNNQVNjcmlwdCBvYmplY3RcbiAgICAgICh2YWwuX2l0ZXIgfHwgdmFsLl9vYmplY3RcbiAgICAgICAgPyAoMCwgX2NvbGxlY3Rpb25zLnByaW50SXRlcmF0b3JFbnRyaWVzKShcbiAgICAgICAgICAgIHZhbC5lbnRyaWVzKCksXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgICAgcmVmcyxcbiAgICAgICAgICAgIHByaW50ZXJcbiAgICAgICAgICApXG4gICAgICAgIDogTEFaWSkgK1xuICAgICAgJ30nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgbmFtZSArXG4gICAgU1BBQ0UgK1xuICAgICdbJyArXG4gICAgKHZhbC5faXRlciB8fCAvLyBmcm9tIEltbXV0YWJsZSBjb2xsZWN0aW9uIG9mIHZhbHVlc1xuICAgIHZhbC5fYXJyYXkgfHwgLy8gZnJvbSBFQ01BU2NyaXB0IGFycmF5XG4gICAgdmFsLl9jb2xsZWN0aW9uIHx8IC8vIGZyb20gRUNNQVNjcmlwdCBjb2xsZWN0aW9uIGluIGltbXV0YWJsZSB2NFxuICAgIHZhbC5faXRlcmFibGUgLy8gZnJvbSBFQ01BU2NyaXB0IGNvbGxlY3Rpb24gaW4gaW1tdXRhYmxlIHYzXG4gICAgICA/ICgwLCBfY29sbGVjdGlvbnMucHJpbnRJdGVyYXRvclZhbHVlcykoXG4gICAgICAgICAgdmFsLnZhbHVlcygpLFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICByZWZzLFxuICAgICAgICAgIHByaW50ZXJcbiAgICAgICAgKVxuICAgICAgOiBMQVpZKSArXG4gICAgJ10nXG4gICk7XG59O1xuXG5jb25zdCBwcmludEltbXV0YWJsZVZhbHVlcyA9IChcbiAgdmFsLFxuICBjb25maWcsXG4gIGluZGVudGF0aW9uLFxuICBkZXB0aCxcbiAgcmVmcyxcbiAgcHJpbnRlcixcbiAgdHlwZVxuKSA9PlxuICArK2RlcHRoID4gY29uZmlnLm1heERlcHRoXG4gICAgPyBwcmludEFzTGVhZihnZXRJbW11dGFibGVOYW1lKHR5cGUpKVxuICAgIDogZ2V0SW1tdXRhYmxlTmFtZSh0eXBlKSArXG4gICAgICBTUEFDRSArXG4gICAgICAnWycgK1xuICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludEl0ZXJhdG9yVmFsdWVzKShcbiAgICAgICAgdmFsLnZhbHVlcygpLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGluZGVudGF0aW9uLFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgcmVmcyxcbiAgICAgICAgcHJpbnRlclxuICAgICAgKSArXG4gICAgICAnXSc7XG5cbmNvbnN0IHNlcmlhbGl6ZSA9ICh2YWwsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKSA9PiB7XG4gIGlmICh2YWxbSVNfTUFQX1NFTlRJTkVMXSkge1xuICAgIHJldHVybiBwcmludEltbXV0YWJsZUVudHJpZXMoXG4gICAgICB2YWwsXG4gICAgICBjb25maWcsXG4gICAgICBpbmRlbnRhdGlvbixcbiAgICAgIGRlcHRoLFxuICAgICAgcmVmcyxcbiAgICAgIHByaW50ZXIsXG4gICAgICB2YWxbSVNfT1JERVJFRF9TRU5USU5FTF0gPyAnT3JkZXJlZE1hcCcgOiAnTWFwJ1xuICAgICk7XG4gIH1cblxuICBpZiAodmFsW0lTX0xJU1RfU0VOVElORUxdKSB7XG4gICAgcmV0dXJuIHByaW50SW1tdXRhYmxlVmFsdWVzKFxuICAgICAgdmFsLFxuICAgICAgY29uZmlnLFxuICAgICAgaW5kZW50YXRpb24sXG4gICAgICBkZXB0aCxcbiAgICAgIHJlZnMsXG4gICAgICBwcmludGVyLFxuICAgICAgJ0xpc3QnXG4gICAgKTtcbiAgfVxuXG4gIGlmICh2YWxbSVNfU0VUX1NFTlRJTkVMXSkge1xuICAgIHJldHVybiBwcmludEltbXV0YWJsZVZhbHVlcyhcbiAgICAgIHZhbCxcbiAgICAgIGNvbmZpZyxcbiAgICAgIGluZGVudGF0aW9uLFxuICAgICAgZGVwdGgsXG4gICAgICByZWZzLFxuICAgICAgcHJpbnRlcixcbiAgICAgIHZhbFtJU19PUkRFUkVEX1NFTlRJTkVMXSA/ICdPcmRlcmVkU2V0JyA6ICdTZXQnXG4gICAgKTtcbiAgfVxuXG4gIGlmICh2YWxbSVNfU1RBQ0tfU0VOVElORUxdKSB7XG4gICAgcmV0dXJuIHByaW50SW1tdXRhYmxlVmFsdWVzKFxuICAgICAgdmFsLFxuICAgICAgY29uZmlnLFxuICAgICAgaW5kZW50YXRpb24sXG4gICAgICBkZXB0aCxcbiAgICAgIHJlZnMsXG4gICAgICBwcmludGVyLFxuICAgICAgJ1N0YWNrJ1xuICAgICk7XG4gIH1cblxuICBpZiAodmFsW0lTX1NFUV9TRU5USU5FTF0pIHtcbiAgICByZXR1cm4gcHJpbnRJbW11dGFibGVTZXEodmFsLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcywgcHJpbnRlcik7XG4gIH0gLy8gRm9yIGNvbXBhdGliaWxpdHkgd2l0aCBpbW11dGFibGUgdjMgYW5kIHY0LCBsZXQgcmVjb3JkIGJlIHRoZSBkZWZhdWx0LlxuXG4gIHJldHVybiBwcmludEltbXV0YWJsZVJlY29yZCh2YWwsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBwcmludGVyKTtcbn07IC8vIEV4cGxpY2l0bHkgY29tcGFyaW5nIHNlbnRpbmVsIHByb3BlcnRpZXMgdG8gdHJ1ZSBhdm9pZHMgZmFsc2UgcG9zaXRpdmVcbi8vIHdoZW4gbW9jayBpZGVudGl0eS1vYmotcHJveHkgcmV0dXJucyB0aGUga2V5IGFzIHRoZSB2YWx1ZSBmb3IgYW55IGtleS5cblxuZXhwb3J0cy5zZXJpYWxpemUgPSBzZXJpYWxpemU7XG5cbmNvbnN0IHRlc3QgPSB2YWwgPT5cbiAgdmFsICYmXG4gICh2YWxbSVNfSVRFUkFCTEVfU0VOVElORUxdID09PSB0cnVlIHx8IHZhbFtJU19SRUNPUkRfU0VOVElORUxdID09PSB0cnVlKTtcblxuZXhwb3J0cy50ZXN0ID0gdGVzdDtcbmNvbnN0IHBsdWdpbiA9IHtcbiAgc2VyaWFsaXplLFxuICB0ZXN0XG59O1xudmFyIF9kZWZhdWx0ID0gcGx1Z2luO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE3LjAuMlxuICogcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuJ3VzZSBzdHJpY3QnO3ZhciBiPTYwMTAzLGM9NjAxMDYsZD02MDEwNyxlPTYwMTA4LGY9NjAxMTQsZz02MDEwOSxoPTYwMTEwLGs9NjAxMTIsbD02MDExMyxtPTYwMTIwLG49NjAxMTUscD02MDExNixxPTYwMTIxLHI9NjAxMjIsdT02MDExNyx2PTYwMTI5LHc9NjAxMzE7XG5pZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yKXt2YXIgeD1TeW1ib2wuZm9yO2I9eChcInJlYWN0LmVsZW1lbnRcIik7Yz14KFwicmVhY3QucG9ydGFsXCIpO2Q9eChcInJlYWN0LmZyYWdtZW50XCIpO2U9eChcInJlYWN0LnN0cmljdF9tb2RlXCIpO2Y9eChcInJlYWN0LnByb2ZpbGVyXCIpO2c9eChcInJlYWN0LnByb3ZpZGVyXCIpO2g9eChcInJlYWN0LmNvbnRleHRcIik7az14KFwicmVhY3QuZm9yd2FyZF9yZWZcIik7bD14KFwicmVhY3Quc3VzcGVuc2VcIik7bT14KFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKTtuPXgoXCJyZWFjdC5tZW1vXCIpO3A9eChcInJlYWN0LmxhenlcIik7cT14KFwicmVhY3QuYmxvY2tcIik7cj14KFwicmVhY3Quc2VydmVyLmJsb2NrXCIpO3U9eChcInJlYWN0LmZ1bmRhbWVudGFsXCIpO3Y9eChcInJlYWN0LmRlYnVnX3RyYWNlX21vZGVcIik7dz14KFwicmVhY3QubGVnYWN5X2hpZGRlblwiKX1cbmZ1bmN0aW9uIHkoYSl7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSl7dmFyIHQ9YS4kJHR5cGVvZjtzd2l0Y2godCl7Y2FzZSBiOnN3aXRjaChhPWEudHlwZSxhKXtjYXNlIGQ6Y2FzZSBmOmNhc2UgZTpjYXNlIGw6Y2FzZSBtOnJldHVybiBhO2RlZmF1bHQ6c3dpdGNoKGE9YSYmYS4kJHR5cGVvZixhKXtjYXNlIGg6Y2FzZSBrOmNhc2UgcDpjYXNlIG46Y2FzZSBnOnJldHVybiBhO2RlZmF1bHQ6cmV0dXJuIHR9fWNhc2UgYzpyZXR1cm4gdH19fXZhciB6PWcsQT1iLEI9ayxDPWQsRD1wLEU9bixGPWMsRz1mLEg9ZSxJPWw7ZXhwb3J0cy5Db250ZXh0Q29uc3VtZXI9aDtleHBvcnRzLkNvbnRleHRQcm92aWRlcj16O2V4cG9ydHMuRWxlbWVudD1BO2V4cG9ydHMuRm9yd2FyZFJlZj1CO2V4cG9ydHMuRnJhZ21lbnQ9QztleHBvcnRzLkxhenk9RDtleHBvcnRzLk1lbW89RTtleHBvcnRzLlBvcnRhbD1GO2V4cG9ydHMuUHJvZmlsZXI9RztleHBvcnRzLlN0cmljdE1vZGU9SDtcbmV4cG9ydHMuU3VzcGVuc2U9STtleHBvcnRzLmlzQXN5bmNNb2RlPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2V4cG9ydHMuaXNDb25jdXJyZW50TW9kZT1mdW5jdGlvbigpe3JldHVybiExfTtleHBvcnRzLmlzQ29udGV4dENvbnN1bWVyPWZ1bmN0aW9uKGEpe3JldHVybiB5KGEpPT09aH07ZXhwb3J0cy5pc0NvbnRleHRQcm92aWRlcj1mdW5jdGlvbihhKXtyZXR1cm4geShhKT09PWd9O2V4cG9ydHMuaXNFbGVtZW50PWZ1bmN0aW9uKGEpe3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEmJmEuJCR0eXBlb2Y9PT1ifTtleHBvcnRzLmlzRm9yd2FyZFJlZj1mdW5jdGlvbihhKXtyZXR1cm4geShhKT09PWt9O2V4cG9ydHMuaXNGcmFnbWVudD1mdW5jdGlvbihhKXtyZXR1cm4geShhKT09PWR9O2V4cG9ydHMuaXNMYXp5PWZ1bmN0aW9uKGEpe3JldHVybiB5KGEpPT09cH07ZXhwb3J0cy5pc01lbW89ZnVuY3Rpb24oYSl7cmV0dXJuIHkoYSk9PT1ufTtcbmV4cG9ydHMuaXNQb3J0YWw9ZnVuY3Rpb24oYSl7cmV0dXJuIHkoYSk9PT1jfTtleHBvcnRzLmlzUHJvZmlsZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIHkoYSk9PT1mfTtleHBvcnRzLmlzU3RyaWN0TW9kZT1mdW5jdGlvbihhKXtyZXR1cm4geShhKT09PWV9O2V4cG9ydHMuaXNTdXNwZW5zZT1mdW5jdGlvbihhKXtyZXR1cm4geShhKT09PWx9O2V4cG9ydHMuaXNWYWxpZEVsZW1lbnRUeXBlPWZ1bmN0aW9uKGEpe3JldHVyblwic3RyaW5nXCI9PT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT09dHlwZW9mIGF8fGE9PT1kfHxhPT09Znx8YT09PXZ8fGE9PT1lfHxhPT09bHx8YT09PW18fGE9PT13fHxcIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hJiYoYS4kJHR5cGVvZj09PXB8fGEuJCR0eXBlb2Y9PT1ufHxhLiQkdHlwZW9mPT09Z3x8YS4kJHR5cGVvZj09PWh8fGEuJCR0eXBlb2Y9PT1rfHxhLiQkdHlwZW9mPT09dXx8YS4kJHR5cGVvZj09PXF8fGFbMF09PT1yKT8hMDohMX07XG5leHBvcnRzLnR5cGVPZj15O1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNy4wLjJcbiAqIHJlYWN0LWlzLmRldmVsb3BtZW50LmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gQVRURU5USU9OXG4vLyBXaGVuIGFkZGluZyBuZXcgc3ltYm9scyB0byB0aGlzIGZpbGUsXG4vLyBQbGVhc2UgY29uc2lkZXIgYWxzbyBhZGRpbmcgdG8gJ3JlYWN0LWRldnRvb2xzLXNoYXJlZC9zcmMvYmFja2VuZC9SZWFjdFN5bWJvbHMnXG4vLyBUaGUgU3ltYm9sIHVzZWQgdG8gdGFnIHRoZSBSZWFjdEVsZW1lbnQtbGlrZSB0eXBlcy4gSWYgdGhlcmUgaXMgbm8gbmF0aXZlIFN5bWJvbFxuLy8gbm9yIHBvbHlmaWxsLCB0aGVuIGEgcGxhaW4gbnVtYmVyIGlzIHVzZWQgZm9yIHBlcmZvcm1hbmNlLlxudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IDB4ZWFjNztcbnZhciBSRUFDVF9QT1JUQUxfVFlQRSA9IDB4ZWFjYTtcbnZhciBSRUFDVF9GUkFHTUVOVF9UWVBFID0gMHhlYWNiO1xudmFyIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSAweGVhY2M7XG52YXIgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IDB4ZWFkMjtcbnZhciBSRUFDVF9QUk9WSURFUl9UWVBFID0gMHhlYWNkO1xudmFyIFJFQUNUX0NPTlRFWFRfVFlQRSA9IDB4ZWFjZTtcbnZhciBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFID0gMHhlYWQwO1xudmFyIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSAweGVhZDE7XG52YXIgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gMHhlYWQ4O1xudmFyIFJFQUNUX01FTU9fVFlQRSA9IDB4ZWFkMztcbnZhciBSRUFDVF9MQVpZX1RZUEUgPSAweGVhZDQ7XG52YXIgUkVBQ1RfQkxPQ0tfVFlQRSA9IDB4ZWFkOTtcbnZhciBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSA9IDB4ZWFkYTtcbnZhciBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gMHhlYWQ1O1xudmFyIFJFQUNUX1NDT1BFX1RZUEUgPSAweGVhZDc7XG52YXIgUkVBQ1RfT1BBUVVFX0lEX1RZUEUgPSAweGVhZTA7XG52YXIgUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgPSAweGVhZTE7XG52YXIgUkVBQ1RfT0ZGU0NSRUVOX1RZUEUgPSAweGVhZTI7XG52YXIgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gMHhlYWUzO1xuXG5pZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yKSB7XG4gIHZhciBzeW1ib2xGb3IgPSBTeW1ib2wuZm9yO1xuICBSRUFDVF9FTEVNRU5UX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmVsZW1lbnQnKTtcbiAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnBvcnRhbCcpO1xuICBSRUFDVF9GUkFHTUVOVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mcmFnbWVudCcpO1xuICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdHJpY3RfbW9kZScpO1xuICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm9maWxlcicpO1xuICBSRUFDVF9QUk9WSURFUl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5wcm92aWRlcicpO1xuICBSRUFDVF9DT05URVhUX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmNvbnRleHQnKTtcbiAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuZm9yd2FyZF9yZWYnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Quc3VzcGVuc2UnKTtcbiAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zdXNwZW5zZV9saXN0Jyk7XG4gIFJFQUNUX01FTU9fVFlQRSA9IHN5bWJvbEZvcigncmVhY3QubWVtbycpO1xuICBSRUFDVF9MQVpZX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LmxhenknKTtcbiAgUkVBQ1RfQkxPQ0tfVFlQRSA9IHN5bWJvbEZvcigncmVhY3QuYmxvY2snKTtcbiAgUkVBQ1RfU0VSVkVSX0JMT0NLX1RZUEUgPSBzeW1ib2xGb3IoJ3JlYWN0LnNlcnZlci5ibG9jaycpO1xuICBSRUFDVF9GVU5EQU1FTlRBTF9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5mdW5kYW1lbnRhbCcpO1xuICBSRUFDVF9TQ09QRV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5zY29wZScpO1xuICBSRUFDVF9PUEFRVUVfSURfVFlQRSA9IHN5bWJvbEZvcigncmVhY3Qub3BhcXVlLmlkJyk7XG4gIFJFQUNUX0RFQlVHX1RSQUNJTkdfTU9ERV9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5kZWJ1Z190cmFjZV9tb2RlJyk7XG4gIFJFQUNUX09GRlNDUkVFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5vZmZzY3JlZW4nKTtcbiAgUkVBQ1RfTEVHQUNZX0hJRERFTl9UWVBFID0gc3ltYm9sRm9yKCdyZWFjdC5sZWdhY3lfaGlkZGVuJyk7XG59XG5cbi8vIEZpbHRlciBjZXJ0YWluIERPTSBhdHRyaWJ1dGVzIChlLmcuIHNyYywgaHJlZikgaWYgdGhlaXIgdmFsdWVzIGFyZSBlbXB0eSBzdHJpbmdzLlxuXG52YXIgZW5hYmxlU2NvcGVBUEkgPSBmYWxzZTsgLy8gRXhwZXJpbWVudGFsIENyZWF0ZSBFdmVudCBIYW5kbGUgQVBJLlxuXG5mdW5jdGlvbiBpc1ZhbGlkRWxlbWVudFR5cGUodHlwZSkge1xuICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gTm90ZTogdHlwZW9mIG1pZ2h0IGJlIG90aGVyIHRoYW4gJ3N5bWJvbCcgb3IgJ251bWJlcicgKGUuZy4gaWYgaXQncyBhIHBvbHlmaWxsKS5cblxuXG4gIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1BST0ZJTEVSX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfREVCVUdfVFJBQ0lOR19NT0RFX1RZUEUgfHwgdHlwZSA9PT0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFIHx8IHR5cGUgPT09IFJFQUNUX1NVU1BFTlNFX0xJU1RfVFlQRSB8fCB0eXBlID09PSBSRUFDVF9MRUdBQ1lfSElEREVOX1RZUEUgfHwgZW5hYmxlU2NvcGVBUEkgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAodHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9QUk9WSURFUl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NPTlRFWFRfVFlQRSB8fCB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFIHx8IHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0ZVTkRBTUVOVEFMX1RZUEUgfHwgdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQkxPQ0tfVFlQRSB8fCB0eXBlWzBdID09PSBSRUFDVF9TRVJWRVJfQkxPQ0tfVFlQRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB0eXBlT2Yob2JqZWN0KSB7XG4gIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiBvYmplY3QgIT09IG51bGwpIHtcbiAgICB2YXIgJCR0eXBlb2YgPSBvYmplY3QuJCR0eXBlb2Y7XG5cbiAgICBzd2l0Y2ggKCQkdHlwZW9mKSB7XG4gICAgICBjYXNlIFJFQUNUX0VMRU1FTlRfVFlQRTpcbiAgICAgICAgdmFyIHR5cGUgPSBvYmplY3QudHlwZTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZSQUdNRU5UX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9QUk9GSUxFUl9UWVBFOlxuICAgICAgICAgIGNhc2UgUkVBQ1RfU1RSSUNUX01PREVfVFlQRTpcbiAgICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgJCR0eXBlb2ZUeXBlID0gdHlwZSAmJiB0eXBlLiQkdHlwZW9mO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKCQkdHlwZW9mVHlwZSkge1xuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0NPTlRFWFRfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUFJPVklERVJfVFlQRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gJCR0eXBlb2ZUeXBlO1xuXG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgcmV0dXJuICQkdHlwZW9mO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG52YXIgQ29udGV4dENvbnN1bWVyID0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xudmFyIENvbnRleHRQcm92aWRlciA9IFJFQUNUX1BST1ZJREVSX1RZUEU7XG52YXIgRWxlbWVudCA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcbnZhciBGb3J3YXJkUmVmID0gUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRTtcbnZhciBGcmFnbWVudCA9IFJFQUNUX0ZSQUdNRU5UX1RZUEU7XG52YXIgTGF6eSA9IFJFQUNUX0xBWllfVFlQRTtcbnZhciBNZW1vID0gUkVBQ1RfTUVNT19UWVBFO1xudmFyIFBvcnRhbCA9IFJFQUNUX1BPUlRBTF9UWVBFO1xudmFyIFByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbnZhciBTdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbnZhciBTdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG52YXIgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUgPSBmYWxzZTtcbnZhciBoYXNXYXJuZWRBYm91dERlcHJlY2F0ZWRJc0NvbmN1cnJlbnRNb2RlID0gZmFsc2U7IC8vIEFzeW5jTW9kZSBzaG91bGQgYmUgZGVwcmVjYXRlZFxuXG5mdW5jdGlvbiBpc0FzeW5jTW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNBc3luY01vZGUpIHtcbiAgICAgIGhhc1dhcm5lZEFib3V0RGVwcmVjYXRlZElzQXN5bmNNb2RlID0gdHJ1ZTsgLy8gVXNpbmcgY29uc29sZVsnd2FybiddIHRvIGV2YWRlIEJhYmVsIGFuZCBFU0xpbnRcblxuICAgICAgY29uc29sZVsnd2FybiddKCdUaGUgUmVhY3RJcy5pc0FzeW5jTW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb25jdXJyZW50TW9kZShvYmplY3QpIHtcbiAge1xuICAgIGlmICghaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSkge1xuICAgICAgaGFzV2FybmVkQWJvdXREZXByZWNhdGVkSXNDb25jdXJyZW50TW9kZSA9IHRydWU7IC8vIFVzaW5nIGNvbnNvbGVbJ3dhcm4nXSB0byBldmFkZSBCYWJlbCBhbmQgRVNMaW50XG5cbiAgICAgIGNvbnNvbGVbJ3dhcm4nXSgnVGhlIFJlYWN0SXMuaXNDb25jdXJyZW50TW9kZSgpIGFsaWFzIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcgKyAnYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBSZWFjdCAxOCsuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0Q29uc3VtZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfQ09OVEVYVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNDb250ZXh0UHJvdmlkZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPVklERVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzRm9yd2FyZFJlZihvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFO1xufVxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gaXNMYXp5KG9iamVjdCkge1xuICByZXR1cm4gdHlwZU9mKG9iamVjdCkgPT09IFJFQUNUX0xBWllfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzTWVtbyhvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9NRU1PX1RZUEU7XG59XG5mdW5jdGlvbiBpc1BvcnRhbChvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9QT1JUQUxfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzUHJvZmlsZXIob2JqZWN0KSB7XG4gIHJldHVybiB0eXBlT2Yob2JqZWN0KSA9PT0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbn1cbmZ1bmN0aW9uIGlzU3RyaWN0TW9kZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFO1xufVxuZnVuY3Rpb24gaXNTdXNwZW5zZShvYmplY3QpIHtcbiAgcmV0dXJuIHR5cGVPZihvYmplY3QpID09PSBSRUFDVF9TVVNQRU5TRV9UWVBFO1xufVxuXG5leHBvcnRzLkNvbnRleHRDb25zdW1lciA9IENvbnRleHRDb25zdW1lcjtcbmV4cG9ydHMuQ29udGV4dFByb3ZpZGVyID0gQ29udGV4dFByb3ZpZGVyO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbmV4cG9ydHMuRm9yd2FyZFJlZiA9IEZvcndhcmRSZWY7XG5leHBvcnRzLkZyYWdtZW50ID0gRnJhZ21lbnQ7XG5leHBvcnRzLkxhenkgPSBMYXp5O1xuZXhwb3J0cy5NZW1vID0gTWVtbztcbmV4cG9ydHMuUG9ydGFsID0gUG9ydGFsO1xuZXhwb3J0cy5Qcm9maWxlciA9IFByb2ZpbGVyO1xuZXhwb3J0cy5TdHJpY3RNb2RlID0gU3RyaWN0TW9kZTtcbmV4cG9ydHMuU3VzcGVuc2UgPSBTdXNwZW5zZTtcbmV4cG9ydHMuaXNBc3luY01vZGUgPSBpc0FzeW5jTW9kZTtcbmV4cG9ydHMuaXNDb25jdXJyZW50TW9kZSA9IGlzQ29uY3VycmVudE1vZGU7XG5leHBvcnRzLmlzQ29udGV4dENvbnN1bWVyID0gaXNDb250ZXh0Q29uc3VtZXI7XG5leHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyID0gaXNDb250ZXh0UHJvdmlkZXI7XG5leHBvcnRzLmlzRWxlbWVudCA9IGlzRWxlbWVudDtcbmV4cG9ydHMuaXNGb3J3YXJkUmVmID0gaXNGb3J3YXJkUmVmO1xuZXhwb3J0cy5pc0ZyYWdtZW50ID0gaXNGcmFnbWVudDtcbmV4cG9ydHMuaXNMYXp5ID0gaXNMYXp5O1xuZXhwb3J0cy5pc01lbW8gPSBpc01lbW87XG5leHBvcnRzLmlzUG9ydGFsID0gaXNQb3J0YWw7XG5leHBvcnRzLmlzUHJvZmlsZXIgPSBpc1Byb2ZpbGVyO1xuZXhwb3J0cy5pc1N0cmljdE1vZGUgPSBpc1N0cmljdE1vZGU7XG5leHBvcnRzLmlzU3VzcGVuc2UgPSBpc1N1c3BlbnNlO1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGUgPSBpc1ZhbGlkRWxlbWVudFR5cGU7XG5leHBvcnRzLnR5cGVPZiA9IHR5cGVPZjtcbiAgfSkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMudGVzdCA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xuXG52YXIgUmVhY3RJcyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoJ3JlYWN0LWlzJykpO1xuXG52YXIgX21hcmt1cCA9IHJlcXVpcmUoJy4vbGliL21hcmt1cCcpO1xuXG5mdW5jdGlvbiBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUobm9kZUludGVyb3ApIHtcbiAgaWYgKHR5cGVvZiBXZWFrTWFwICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gbnVsbDtcbiAgdmFyIGNhY2hlQmFiZWxJbnRlcm9wID0gbmV3IFdlYWtNYXAoKTtcbiAgdmFyIGNhY2hlTm9kZUludGVyb3AgPSBuZXcgV2Vha01hcCgpO1xuICByZXR1cm4gKF9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSA9IGZ1bmN0aW9uIChub2RlSW50ZXJvcCkge1xuICAgIHJldHVybiBub2RlSW50ZXJvcCA/IGNhY2hlTm9kZUludGVyb3AgOiBjYWNoZUJhYmVsSW50ZXJvcDtcbiAgfSkobm9kZUludGVyb3ApO1xufVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmosIG5vZGVJbnRlcm9wKSB7XG4gIGlmICghbm9kZUludGVyb3AgJiYgb2JqICYmIG9iai5fX2VzTW9kdWxlKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBpZiAob2JqID09PSBudWxsIHx8ICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiB0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nKSkge1xuICAgIHJldHVybiB7ZGVmYXVsdDogb2JqfTtcbiAgfVxuICB2YXIgY2FjaGUgPSBfZ2V0UmVxdWlyZVdpbGRjYXJkQ2FjaGUobm9kZUludGVyb3ApO1xuICBpZiAoY2FjaGUgJiYgY2FjaGUuaGFzKG9iaikpIHtcbiAgICByZXR1cm4gY2FjaGUuZ2V0KG9iaik7XG4gIH1cbiAgdmFyIG5ld09iaiA9IHt9O1xuICB2YXIgaGFzUHJvcGVydHlEZXNjcmlwdG9yID1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChrZXkgIT09ICdkZWZhdWx0JyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICB2YXIgZGVzYyA9IGhhc1Byb3BlcnR5RGVzY3JpcHRvclxuICAgICAgICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpXG4gICAgICAgIDogbnVsbDtcbiAgICAgIGlmIChkZXNjICYmIChkZXNjLmdldCB8fCBkZXNjLnNldCkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld09ialtrZXldID0gb2JqW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIG5ld09iai5kZWZhdWx0ID0gb2JqO1xuICBpZiAoY2FjaGUpIHtcbiAgICBjYWNoZS5zZXQob2JqLCBuZXdPYmopO1xuICB9XG4gIHJldHVybiBuZXdPYmo7XG59XG5cbi8qKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cbi8vIEdpdmVuIGVsZW1lbnQucHJvcHMuY2hpbGRyZW4sIG9yIHN1YnRyZWUgZHVyaW5nIHJlY3Vyc2l2ZSB0cmF2ZXJzYWwsXG4vLyByZXR1cm4gZmxhdHRlbmVkIGFycmF5IG9mIGNoaWxkcmVuLlxuY29uc3QgZ2V0Q2hpbGRyZW4gPSAoYXJnLCBjaGlsZHJlbiA9IFtdKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICBhcmcuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGdldENoaWxkcmVuKGl0ZW0sIGNoaWxkcmVuKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChhcmcgIT0gbnVsbCAmJiBhcmcgIT09IGZhbHNlKSB7XG4gICAgY2hpbGRyZW4ucHVzaChhcmcpO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkcmVuO1xufTtcblxuY29uc3QgZ2V0VHlwZSA9IGVsZW1lbnQgPT4ge1xuICBjb25zdCB0eXBlID0gZWxlbWVudC50eXBlO1xuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCAnVW5rbm93bic7XG4gIH1cblxuICBpZiAoUmVhY3RJcy5pc0ZyYWdtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuICdSZWFjdC5GcmFnbWVudCc7XG4gIH1cblxuICBpZiAoUmVhY3RJcy5pc1N1c3BlbnNlKGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuICdSZWFjdC5TdXNwZW5zZSc7XG4gIH1cblxuICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnICYmIHR5cGUgIT09IG51bGwpIHtcbiAgICBpZiAoUmVhY3RJcy5pc0NvbnRleHRQcm92aWRlcihlbGVtZW50KSkge1xuICAgICAgcmV0dXJuICdDb250ZXh0LlByb3ZpZGVyJztcbiAgICB9XG5cbiAgICBpZiAoUmVhY3RJcy5pc0NvbnRleHRDb25zdW1lcihlbGVtZW50KSkge1xuICAgICAgcmV0dXJuICdDb250ZXh0LkNvbnN1bWVyJztcbiAgICB9XG5cbiAgICBpZiAoUmVhY3RJcy5pc0ZvcndhcmRSZWYoZWxlbWVudCkpIHtcbiAgICAgIGlmICh0eXBlLmRpc3BsYXlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0eXBlLmRpc3BsYXlOYW1lO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0eXBlLnJlbmRlci5kaXNwbGF5TmFtZSB8fCB0eXBlLnJlbmRlci5uYW1lIHx8ICcnO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uTmFtZSAhPT0gJydcbiAgICAgICAgPyAnRm9yd2FyZFJlZignICsgZnVuY3Rpb25OYW1lICsgJyknXG4gICAgICAgIDogJ0ZvcndhcmRSZWYnO1xuICAgIH1cblxuICAgIGlmIChSZWFjdElzLmlzTWVtbyhlbGVtZW50KSkge1xuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID1cbiAgICAgICAgdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLnR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS50eXBlLm5hbWUgfHwgJyc7XG4gICAgICByZXR1cm4gZnVuY3Rpb25OYW1lICE9PSAnJyA/ICdNZW1vKCcgKyBmdW5jdGlvbk5hbWUgKyAnKScgOiAnTWVtbyc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICdVTkRFRklORUQnO1xufTtcblxuY29uc3QgZ2V0UHJvcEtleXMgPSBlbGVtZW50ID0+IHtcbiAgY29uc3Qge3Byb3BzfSA9IGVsZW1lbnQ7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcylcbiAgICAuZmlsdGVyKGtleSA9PiBrZXkgIT09ICdjaGlsZHJlbicgJiYgcHJvcHNba2V5XSAhPT0gdW5kZWZpbmVkKVxuICAgIC5zb3J0KCk7XG59O1xuXG5jb25zdCBzZXJpYWxpemUgPSAoZWxlbWVudCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMsIHByaW50ZXIpID0+XG4gICsrZGVwdGggPiBjb25maWcubWF4RGVwdGhcbiAgICA/ICgwLCBfbWFya3VwLnByaW50RWxlbWVudEFzTGVhZikoZ2V0VHlwZShlbGVtZW50KSwgY29uZmlnKVxuICAgIDogKDAsIF9tYXJrdXAucHJpbnRFbGVtZW50KShcbiAgICAgICAgZ2V0VHlwZShlbGVtZW50KSxcbiAgICAgICAgKDAsIF9tYXJrdXAucHJpbnRQcm9wcykoXG4gICAgICAgICAgZ2V0UHJvcEtleXMoZWxlbWVudCksXG4gICAgICAgICAgZWxlbWVudC5wcm9wcyxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24gKyBjb25maWcuaW5kZW50LFxuICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgIHJlZnMsXG4gICAgICAgICAgcHJpbnRlclxuICAgICAgICApLFxuICAgICAgICAoMCwgX21hcmt1cC5wcmludENoaWxkcmVuKShcbiAgICAgICAgICBnZXRDaGlsZHJlbihlbGVtZW50LnByb3BzLmNoaWxkcmVuKSxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24gKyBjb25maWcuaW5kZW50LFxuICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgIHJlZnMsXG4gICAgICAgICAgcHJpbnRlclxuICAgICAgICApLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGluZGVudGF0aW9uXG4gICAgICApO1xuXG5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcblxuY29uc3QgdGVzdCA9IHZhbCA9PiB2YWwgIT0gbnVsbCAmJiBSZWFjdElzLmlzRWxlbWVudCh2YWwpO1xuXG5leHBvcnRzLnRlc3QgPSB0ZXN0O1xuY29uc3QgcGx1Z2luID0ge1xuICBzZXJpYWxpemUsXG4gIHRlc3Rcbn07XG52YXIgX2RlZmF1bHQgPSBwbHVnaW47XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnRlc3QgPSBleHBvcnRzLnNlcmlhbGl6ZSA9IGV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxudmFyIF9tYXJrdXAgPSByZXF1aXJlKCcuL2xpYi9tYXJrdXAnKTtcblxudmFyIGdsb2JhbCA9IChmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICB9XG59KSgpO1xuXG52YXIgU3ltYm9sID0gZ2xvYmFsWydqZXN0LXN5bWJvbC1kby1ub3QtdG91Y2gnXSB8fCBnbG9iYWwuU3ltYm9sO1xuY29uc3QgdGVzdFN5bWJvbCA9XG4gIHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvclxuICAgID8gU3ltYm9sLmZvcigncmVhY3QudGVzdC5qc29uJylcbiAgICA6IDB4ZWE3MTM1NztcblxuY29uc3QgZ2V0UHJvcEtleXMgPSBvYmplY3QgPT4ge1xuICBjb25zdCB7cHJvcHN9ID0gb2JqZWN0O1xuICByZXR1cm4gcHJvcHNcbiAgICA/IE9iamVjdC5rZXlzKHByb3BzKVxuICAgICAgICAuZmlsdGVyKGtleSA9PiBwcm9wc1trZXldICE9PSB1bmRlZmluZWQpXG4gICAgICAgIC5zb3J0KClcbiAgICA6IFtdO1xufTtcblxuY29uc3Qgc2VyaWFsaXplID0gKG9iamVjdCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMsIHByaW50ZXIpID0+XG4gICsrZGVwdGggPiBjb25maWcubWF4RGVwdGhcbiAgICA/ICgwLCBfbWFya3VwLnByaW50RWxlbWVudEFzTGVhZikob2JqZWN0LnR5cGUsIGNvbmZpZylcbiAgICA6ICgwLCBfbWFya3VwLnByaW50RWxlbWVudCkoXG4gICAgICAgIG9iamVjdC50eXBlLFxuICAgICAgICBvYmplY3QucHJvcHNcbiAgICAgICAgICA/ICgwLCBfbWFya3VwLnByaW50UHJvcHMpKFxuICAgICAgICAgICAgICBnZXRQcm9wS2V5cyhvYmplY3QpLFxuICAgICAgICAgICAgICBvYmplY3QucHJvcHMsXG4gICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgaW5kZW50YXRpb24gKyBjb25maWcuaW5kZW50LFxuICAgICAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICAgICAgcmVmcyxcbiAgICAgICAgICAgICAgcHJpbnRlclxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogJycsXG4gICAgICAgIG9iamVjdC5jaGlsZHJlblxuICAgICAgICAgID8gKDAsIF9tYXJrdXAucHJpbnRDaGlsZHJlbikoXG4gICAgICAgICAgICAgIG9iamVjdC5jaGlsZHJlbixcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICBpbmRlbnRhdGlvbiArIGNvbmZpZy5pbmRlbnQsXG4gICAgICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgICAgICByZWZzLFxuICAgICAgICAgICAgICBwcmludGVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAnJyxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICBpbmRlbnRhdGlvblxuICAgICAgKTtcblxuZXhwb3J0cy5zZXJpYWxpemUgPSBzZXJpYWxpemU7XG5cbmNvbnN0IHRlc3QgPSB2YWwgPT4gdmFsICYmIHZhbC4kJHR5cGVvZiA9PT0gdGVzdFN5bWJvbDtcblxuZXhwb3J0cy50ZXN0ID0gdGVzdDtcbmNvbnN0IHBsdWdpbiA9IHtcbiAgc2VyaWFsaXplLFxuICB0ZXN0XG59O1xudmFyIF9kZWZhdWx0ID0gcGx1Z2luO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZXhwb3J0cy5ERUZBVUxUX09QVElPTlMgPSB2b2lkIDA7XG5leHBvcnRzLmZvcm1hdCA9IGZvcm1hdDtcbmV4cG9ydHMucGx1Z2lucyA9IHZvaWQgMDtcblxudmFyIF9hbnNpU3R5bGVzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKCdhbnNpLXN0eWxlcycpKTtcblxudmFyIF9jb2xsZWN0aW9ucyA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbnMnKTtcblxudmFyIF9Bc3ltbWV0cmljTWF0Y2hlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoXG4gIHJlcXVpcmUoJy4vcGx1Z2lucy9Bc3ltbWV0cmljTWF0Y2hlcicpXG4pO1xuXG52YXIgX0NvbnZlcnRBbnNpID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKCcuL3BsdWdpbnMvQ29udmVydEFuc2knKSk7XG5cbnZhciBfRE9NQ29sbGVjdGlvbiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZSgnLi9wbHVnaW5zL0RPTUNvbGxlY3Rpb24nKSk7XG5cbnZhciBfRE9NRWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZSgnLi9wbHVnaW5zL0RPTUVsZW1lbnQnKSk7XG5cbnZhciBfSW1tdXRhYmxlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKCcuL3BsdWdpbnMvSW1tdXRhYmxlJykpO1xuXG52YXIgX1JlYWN0RWxlbWVudCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZSgnLi9wbHVnaW5zL1JlYWN0RWxlbWVudCcpKTtcblxudmFyIF9SZWFjdFRlc3RDb21wb25lbnQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KFxuICByZXF1aXJlKCcuL3BsdWdpbnMvUmVhY3RUZXN0Q29tcG9uZW50Jylcbik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ZGVmYXVsdDogb2JqfTtcbn1cblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBsb2NhbC9iYW4tdHlwZXMtZXZlbnR1YWxseSAqL1xuY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgdG9JU09TdHJpbmcgPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZztcbmNvbnN0IGVycm9yVG9TdHJpbmcgPSBFcnJvci5wcm90b3R5cGUudG9TdHJpbmc7XG5jb25zdCByZWdFeHBUb1N0cmluZyA9IFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmc7XG4vKipcbiAqIEV4cGxpY2l0bHkgY29tcGFyaW5nIHR5cGVvZiBjb25zdHJ1Y3RvciB0byBmdW5jdGlvbiBhdm9pZHMgdW5kZWZpbmVkIGFzIG5hbWVcbiAqIHdoZW4gbW9jayBpZGVudGl0eS1vYmotcHJveHkgcmV0dXJucyB0aGUga2V5IGFzIHRoZSB2YWx1ZSBmb3IgYW55IGtleS5cbiAqL1xuXG5jb25zdCBnZXRDb25zdHJ1Y3Rvck5hbWUgPSB2YWwgPT5cbiAgKHR5cGVvZiB2YWwuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgdmFsLmNvbnN0cnVjdG9yLm5hbWUpIHx8ICdPYmplY3QnO1xuLyogZ2xvYmFsIHdpbmRvdyAqL1xuXG4vKiogSXMgdmFsIGlzIGVxdWFsIHRvIGdsb2JhbCB3aW5kb3cgb2JqZWN0PyBXb3JrcyBldmVuIGlmIGl0IGRvZXMgbm90IGV4aXN0IDopICovXG5cbmNvbnN0IGlzV2luZG93ID0gdmFsID0+IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHZhbCA9PT0gd2luZG93O1xuXG5jb25zdCBTWU1CT0xfUkVHRVhQID0gL15TeW1ib2xcXCgoLiopXFwpKC4qKSQvO1xuY29uc3QgTkVXTElORV9SRUdFWFAgPSAvXFxuL2dpO1xuXG5jbGFzcyBQcmV0dHlGb3JtYXRQbHVnaW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSwgc3RhY2spIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLnN0YWNrID0gc3RhY2s7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzVG9TdHJpbmdlZEFycmF5VHlwZSh0b1N0cmluZ2VkKSB7XG4gIHJldHVybiAoXG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgQXJyYXldJyB8fFxuICAgIHRvU3RyaW5nZWQgPT09ICdbb2JqZWN0IEFycmF5QnVmZmVyXScgfHxcbiAgICB0b1N0cmluZ2VkID09PSAnW29iamVjdCBEYXRhVmlld10nIHx8XG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScgfHxcbiAgICB0b1N0cmluZ2VkID09PSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyB8fFxuICAgIHRvU3RyaW5nZWQgPT09ICdbb2JqZWN0IEludDhBcnJheV0nIHx8XG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgSW50MTZBcnJheV0nIHx8XG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgSW50MzJBcnJheV0nIHx8XG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgVWludDhBcnJheV0nIHx8XG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyB8fFxuICAgIHRvU3RyaW5nZWQgPT09ICdbb2JqZWN0IFVpbnQxNkFycmF5XScgfHxcbiAgICB0b1N0cmluZ2VkID09PSAnW29iamVjdCBVaW50MzJBcnJheV0nXG4gICk7XG59XG5cbmZ1bmN0aW9uIHByaW50TnVtYmVyKHZhbCkge1xuICByZXR1cm4gT2JqZWN0LmlzKHZhbCwgLTApID8gJy0wJyA6IFN0cmluZyh2YWwpO1xufVxuXG5mdW5jdGlvbiBwcmludEJpZ0ludCh2YWwpIHtcbiAgcmV0dXJuIFN0cmluZyhgJHt2YWx9bmApO1xufVxuXG5mdW5jdGlvbiBwcmludEZ1bmN0aW9uKHZhbCwgcHJpbnRGdW5jdGlvbk5hbWUpIHtcbiAgaWYgKCFwcmludEZ1bmN0aW9uTmFtZSkge1xuICAgIHJldHVybiAnW0Z1bmN0aW9uXSc7XG4gIH1cblxuICByZXR1cm4gJ1tGdW5jdGlvbiAnICsgKHZhbC5uYW1lIHx8ICdhbm9ueW1vdXMnKSArICddJztcbn1cblxuZnVuY3Rpb24gcHJpbnRTeW1ib2wodmFsKSB7XG4gIHJldHVybiBTdHJpbmcodmFsKS5yZXBsYWNlKFNZTUJPTF9SRUdFWFAsICdTeW1ib2woJDEpJyk7XG59XG5cbmZ1bmN0aW9uIHByaW50RXJyb3IodmFsKSB7XG4gIHJldHVybiAnWycgKyBlcnJvclRvU3RyaW5nLmNhbGwodmFsKSArICddJztcbn1cbi8qKlxuICogVGhlIGZpcnN0IHBvcnQgb2YgY2FsbCBmb3IgcHJpbnRpbmcgYW4gb2JqZWN0LCBoYW5kbGVzIG1vc3Qgb2YgdGhlXG4gKiBkYXRhLXR5cGVzIGluIEpTLlxuICovXG5cbmZ1bmN0aW9uIHByaW50QmFzaWNWYWx1ZSh2YWwsIHByaW50RnVuY3Rpb25OYW1lLCBlc2NhcGVSZWdleCwgZXNjYXBlU3RyaW5nKSB7XG4gIGlmICh2YWwgPT09IHRydWUgfHwgdmFsID09PSBmYWxzZSkge1xuICAgIHJldHVybiAnJyArIHZhbDtcbiAgfVxuXG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgfVxuXG4gIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG5cbiAgY29uc3QgdHlwZU9mID0gdHlwZW9mIHZhbDtcblxuICBpZiAodHlwZU9mID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBwcmludE51bWJlcih2YWwpO1xuICB9XG5cbiAgaWYgKHR5cGVPZiA9PT0gJ2JpZ2ludCcpIHtcbiAgICByZXR1cm4gcHJpbnRCaWdJbnQodmFsKTtcbiAgfVxuXG4gIGlmICh0eXBlT2YgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKGVzY2FwZVN0cmluZykge1xuICAgICAgcmV0dXJuICdcIicgKyB2YWwucmVwbGFjZSgvXCJ8XFxcXC9nLCAnXFxcXCQmJykgKyAnXCInO1xuICAgIH1cblxuICAgIHJldHVybiAnXCInICsgdmFsICsgJ1wiJztcbiAgfVxuXG4gIGlmICh0eXBlT2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gcHJpbnRGdW5jdGlvbih2YWwsIHByaW50RnVuY3Rpb25OYW1lKTtcbiAgfVxuXG4gIGlmICh0eXBlT2YgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIHByaW50U3ltYm9sKHZhbCk7XG4gIH1cblxuICBjb25zdCB0b1N0cmluZ2VkID0gdG9TdHJpbmcuY2FsbCh2YWwpO1xuXG4gIGlmICh0b1N0cmluZ2VkID09PSAnW29iamVjdCBXZWFrTWFwXScpIHtcbiAgICByZXR1cm4gJ1dlYWtNYXAge30nO1xuICB9XG5cbiAgaWYgKHRvU3RyaW5nZWQgPT09ICdbb2JqZWN0IFdlYWtTZXRdJykge1xuICAgIHJldHVybiAnV2Vha1NldCB7fSc7XG4gIH1cblxuICBpZiAoXG4gICAgdG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJyB8fFxuICAgIHRvU3RyaW5nZWQgPT09ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSdcbiAgKSB7XG4gICAgcmV0dXJuIHByaW50RnVuY3Rpb24odmFsLCBwcmludEZ1bmN0aW9uTmFtZSk7XG4gIH1cblxuICBpZiAodG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgU3ltYm9sXScpIHtcbiAgICByZXR1cm4gcHJpbnRTeW1ib2wodmFsKTtcbiAgfVxuXG4gIGlmICh0b1N0cmluZ2VkID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICByZXR1cm4gaXNOYU4oK3ZhbCkgPyAnRGF0ZSB7IE5hTiB9JyA6IHRvSVNPU3RyaW5nLmNhbGwodmFsKTtcbiAgfVxuXG4gIGlmICh0b1N0cmluZ2VkID09PSAnW29iamVjdCBFcnJvcl0nKSB7XG4gICAgcmV0dXJuIHByaW50RXJyb3IodmFsKTtcbiAgfVxuXG4gIGlmICh0b1N0cmluZ2VkID09PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIGlmIChlc2NhcGVSZWdleCkge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JlbmphbWluZ3IvUmVnRXhwLmVzY2FwZS9ibG9iL21haW4vcG9seWZpbGwuanNcbiAgICAgIHJldHVybiByZWdFeHBUb1N0cmluZy5jYWxsKHZhbCkucmVwbGFjZSgvW1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVnRXhwVG9TdHJpbmcuY2FsbCh2YWwpO1xuICB9XG5cbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIHByaW50RXJyb3IodmFsKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuLyoqXG4gKiBIYW5kbGVzIG1vcmUgY29tcGxleCBvYmplY3RzICggc3VjaCBhcyBvYmplY3RzIHdpdGggY2lyY3VsYXIgcmVmZXJlbmNlcy5cbiAqIG1hcHMgYW5kIHNldHMgZXRjIClcbiAqL1xuXG5mdW5jdGlvbiBwcmludENvbXBsZXhWYWx1ZShcbiAgdmFsLFxuICBjb25maWcsXG4gIGluZGVudGF0aW9uLFxuICBkZXB0aCxcbiAgcmVmcyxcbiAgaGFzQ2FsbGVkVG9KU09OXG4pIHtcbiAgaWYgKHJlZnMuaW5kZXhPZih2YWwpICE9PSAtMSkge1xuICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gIH1cblxuICByZWZzID0gcmVmcy5zbGljZSgpO1xuICByZWZzLnB1c2godmFsKTtcbiAgY29uc3QgaGl0TWF4RGVwdGggPSArK2RlcHRoID4gY29uZmlnLm1heERlcHRoO1xuICBjb25zdCBtaW4gPSBjb25maWcubWluO1xuXG4gIGlmIChcbiAgICBjb25maWcuY2FsbFRvSlNPTiAmJlxuICAgICFoaXRNYXhEZXB0aCAmJlxuICAgIHZhbC50b0pTT04gJiZcbiAgICB0eXBlb2YgdmFsLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICFoYXNDYWxsZWRUb0pTT05cbiAgKSB7XG4gICAgcmV0dXJuIHByaW50ZXIodmFsLnRvSlNPTigpLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcywgdHJ1ZSk7XG4gIH1cblxuICBjb25zdCB0b1N0cmluZ2VkID0gdG9TdHJpbmcuY2FsbCh2YWwpO1xuXG4gIGlmICh0b1N0cmluZ2VkID09PSAnW29iamVjdCBBcmd1bWVudHNdJykge1xuICAgIHJldHVybiBoaXRNYXhEZXB0aFxuICAgICAgPyAnW0FyZ3VtZW50c10nXG4gICAgICA6IChtaW4gPyAnJyA6ICdBcmd1bWVudHMgJykgK1xuICAgICAgICAgICdbJyArXG4gICAgICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludExpc3RJdGVtcykoXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgICAgcmVmcyxcbiAgICAgICAgICAgIHByaW50ZXJcbiAgICAgICAgICApICtcbiAgICAgICAgICAnXSc7XG4gIH1cblxuICBpZiAoaXNUb1N0cmluZ2VkQXJyYXlUeXBlKHRvU3RyaW5nZWQpKSB7XG4gICAgcmV0dXJuIGhpdE1heERlcHRoXG4gICAgICA/ICdbJyArIHZhbC5jb25zdHJ1Y3Rvci5uYW1lICsgJ10nXG4gICAgICA6IChtaW5cbiAgICAgICAgICA/ICcnXG4gICAgICAgICAgOiAhY29uZmlnLnByaW50QmFzaWNQcm90b3R5cGUgJiYgdmFsLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBcnJheSdcbiAgICAgICAgICA/ICcnXG4gICAgICAgICAgOiB2YWwuY29uc3RydWN0b3IubmFtZSArICcgJykgK1xuICAgICAgICAgICdbJyArXG4gICAgICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludExpc3RJdGVtcykoXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgICAgcmVmcyxcbiAgICAgICAgICAgIHByaW50ZXJcbiAgICAgICAgICApICtcbiAgICAgICAgICAnXSc7XG4gIH1cblxuICBpZiAodG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgTWFwXScpIHtcbiAgICByZXR1cm4gaGl0TWF4RGVwdGhcbiAgICAgID8gJ1tNYXBdJ1xuICAgICAgOiAnTWFwIHsnICtcbiAgICAgICAgICAoMCwgX2NvbGxlY3Rpb25zLnByaW50SXRlcmF0b3JFbnRyaWVzKShcbiAgICAgICAgICAgIHZhbC5lbnRyaWVzKCksXG4gICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICBpbmRlbnRhdGlvbixcbiAgICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgICAgcmVmcyxcbiAgICAgICAgICAgIHByaW50ZXIsXG4gICAgICAgICAgICAnID0+ICdcbiAgICAgICAgICApICtcbiAgICAgICAgICAnfSc7XG4gIH1cblxuICBpZiAodG9TdHJpbmdlZCA9PT0gJ1tvYmplY3QgU2V0XScpIHtcbiAgICByZXR1cm4gaGl0TWF4RGVwdGhcbiAgICAgID8gJ1tTZXRdJ1xuICAgICAgOiAnU2V0IHsnICtcbiAgICAgICAgICAoMCwgX2NvbGxlY3Rpb25zLnByaW50SXRlcmF0b3JWYWx1ZXMpKFxuICAgICAgICAgICAgdmFsLnZhbHVlcygpLFxuICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICAgIHJlZnMsXG4gICAgICAgICAgICBwcmludGVyXG4gICAgICAgICAgKSArXG4gICAgICAgICAgJ30nO1xuICB9IC8vIEF2b2lkIGZhaWx1cmUgdG8gc2VyaWFsaXplIGdsb2JhbCB3aW5kb3cgb2JqZWN0IGluIGpzZG9tIHRlc3QgZW52aXJvbm1lbnQuXG4gIC8vIEZvciBleGFtcGxlLCBub3QgZXZlbiByZWxldmFudCBpZiB3aW5kb3cgaXMgcHJvcCBvZiBSZWFjdCBlbGVtZW50LlxuXG4gIHJldHVybiBoaXRNYXhEZXB0aCB8fCBpc1dpbmRvdyh2YWwpXG4gICAgPyAnWycgKyBnZXRDb25zdHJ1Y3Rvck5hbWUodmFsKSArICddJ1xuICAgIDogKG1pblxuICAgICAgICA/ICcnXG4gICAgICAgIDogIWNvbmZpZy5wcmludEJhc2ljUHJvdG90eXBlICYmIGdldENvbnN0cnVjdG9yTmFtZSh2YWwpID09PSAnT2JqZWN0J1xuICAgICAgICA/ICcnXG4gICAgICAgIDogZ2V0Q29uc3RydWN0b3JOYW1lKHZhbCkgKyAnICcpICtcbiAgICAgICAgJ3snICtcbiAgICAgICAgKDAsIF9jb2xsZWN0aW9ucy5wcmludE9iamVjdFByb3BlcnRpZXMpKFxuICAgICAgICAgIHZhbCxcbiAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgaW5kZW50YXRpb24sXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgcmVmcyxcbiAgICAgICAgICBwcmludGVyXG4gICAgICAgICkgK1xuICAgICAgICAnfSc7XG59XG5cbmZ1bmN0aW9uIGlzTmV3UGx1Z2luKHBsdWdpbikge1xuICByZXR1cm4gcGx1Z2luLnNlcmlhbGl6ZSAhPSBudWxsO1xufVxuXG5mdW5jdGlvbiBwcmludFBsdWdpbihwbHVnaW4sIHZhbCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMpIHtcbiAgbGV0IHByaW50ZWQ7XG5cbiAgdHJ5IHtcbiAgICBwcmludGVkID0gaXNOZXdQbHVnaW4ocGx1Z2luKVxuICAgICAgPyBwbHVnaW4uc2VyaWFsaXplKHZhbCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMsIHByaW50ZXIpXG4gICAgICA6IHBsdWdpbi5wcmludChcbiAgICAgICAgICB2YWwsXG4gICAgICAgICAgdmFsQ2hpbGQgPT4gcHJpbnRlcih2YWxDaGlsZCwgY29uZmlnLCBpbmRlbnRhdGlvbiwgZGVwdGgsIHJlZnMpLFxuICAgICAgICAgIHN0ciA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRlbnRhdGlvbk5leHQgPSBpbmRlbnRhdGlvbiArIGNvbmZpZy5pbmRlbnQ7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBpbmRlbnRhdGlvbk5leHQgK1xuICAgICAgICAgICAgICBzdHIucmVwbGFjZShORVdMSU5FX1JFR0VYUCwgJ1xcbicgKyBpbmRlbnRhdGlvbk5leHQpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZWRnZVNwYWNpbmc6IGNvbmZpZy5zcGFjaW5nT3V0ZXIsXG4gICAgICAgICAgICBtaW46IGNvbmZpZy5taW4sXG4gICAgICAgICAgICBzcGFjaW5nOiBjb25maWcuc3BhY2luZ0lubmVyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maWcuY29sb3JzXG4gICAgICAgICk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IFByZXR0eUZvcm1hdFBsdWdpbkVycm9yKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcHJpbnRlZCAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgcHJldHR5LWZvcm1hdDogUGx1Z2luIG11c3QgcmV0dXJuIHR5cGUgXCJzdHJpbmdcIiBidXQgaW5zdGVhZCByZXR1cm5lZCBcIiR7dHlwZW9mIHByaW50ZWR9XCIuYFxuICAgICk7XG4gIH1cblxuICByZXR1cm4gcHJpbnRlZDtcbn1cblxuZnVuY3Rpb24gZmluZFBsdWdpbihwbHVnaW5zLCB2YWwpIHtcbiAgZm9yIChsZXQgcCA9IDA7IHAgPCBwbHVnaW5zLmxlbmd0aDsgcCsrKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwbHVnaW5zW3BdLnRlc3QodmFsKSkge1xuICAgICAgICByZXR1cm4gcGx1Z2luc1twXTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IFByZXR0eUZvcm1hdFBsdWdpbkVycm9yKGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gcHJpbnRlcih2YWwsIGNvbmZpZywgaW5kZW50YXRpb24sIGRlcHRoLCByZWZzLCBoYXNDYWxsZWRUb0pTT04pIHtcbiAgY29uc3QgcGx1Z2luID0gZmluZFBsdWdpbihjb25maWcucGx1Z2lucywgdmFsKTtcblxuICBpZiAocGx1Z2luICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHByaW50UGx1Z2luKHBsdWdpbiwgdmFsLCBjb25maWcsIGluZGVudGF0aW9uLCBkZXB0aCwgcmVmcyk7XG4gIH1cblxuICBjb25zdCBiYXNpY1Jlc3VsdCA9IHByaW50QmFzaWNWYWx1ZShcbiAgICB2YWwsXG4gICAgY29uZmlnLnByaW50RnVuY3Rpb25OYW1lLFxuICAgIGNvbmZpZy5lc2NhcGVSZWdleCxcbiAgICBjb25maWcuZXNjYXBlU3RyaW5nXG4gICk7XG5cbiAgaWYgKGJhc2ljUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGJhc2ljUmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIHByaW50Q29tcGxleFZhbHVlKFxuICAgIHZhbCxcbiAgICBjb25maWcsXG4gICAgaW5kZW50YXRpb24sXG4gICAgZGVwdGgsXG4gICAgcmVmcyxcbiAgICBoYXNDYWxsZWRUb0pTT05cbiAgKTtcbn1cblxuY29uc3QgREVGQVVMVF9USEVNRSA9IHtcbiAgY29tbWVudDogJ2dyYXknLFxuICBjb250ZW50OiAncmVzZXQnLFxuICBwcm9wOiAneWVsbG93JyxcbiAgdGFnOiAnY3lhbicsXG4gIHZhbHVlOiAnZ3JlZW4nXG59O1xuY29uc3QgREVGQVVMVF9USEVNRV9LRVlTID0gT2JqZWN0LmtleXMoREVGQVVMVF9USEVNRSk7XG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGNhbGxUb0pTT046IHRydWUsXG4gIGNvbXBhcmVLZXlzOiB1bmRlZmluZWQsXG4gIGVzY2FwZVJlZ2V4OiBmYWxzZSxcbiAgZXNjYXBlU3RyaW5nOiB0cnVlLFxuICBoaWdobGlnaHQ6IGZhbHNlLFxuICBpbmRlbnQ6IDIsXG4gIG1heERlcHRoOiBJbmZpbml0eSxcbiAgbWluOiBmYWxzZSxcbiAgcGx1Z2luczogW10sXG4gIHByaW50QmFzaWNQcm90b3R5cGU6IHRydWUsXG4gIHByaW50RnVuY3Rpb25OYW1lOiB0cnVlLFxuICB0aGVtZTogREVGQVVMVF9USEVNRVxufTtcbmV4cG9ydHMuREVGQVVMVF9PUFRJT05TID0gREVGQVVMVF9PUFRJT05TO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucykge1xuICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKCFERUZBVUxUX09QVElPTlMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBwcmV0dHktZm9ybWF0OiBVbmtub3duIG9wdGlvbiBcIiR7a2V5fVwiLmApO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG9wdGlvbnMubWluICYmIG9wdGlvbnMuaW5kZW50ICE9PSB1bmRlZmluZWQgJiYgb3B0aW9ucy5pbmRlbnQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAncHJldHR5LWZvcm1hdDogT3B0aW9ucyBcIm1pblwiIGFuZCBcImluZGVudFwiIGNhbm5vdCBiZSB1c2VkIHRvZ2V0aGVyLidcbiAgICApO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMudGhlbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChvcHRpb25zLnRoZW1lID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3ByZXR0eS1mb3JtYXQ6IE9wdGlvbiBcInRoZW1lXCIgbXVzdCBub3QgYmUgbnVsbC4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudGhlbWUgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBwcmV0dHktZm9ybWF0OiBPcHRpb24gXCJ0aGVtZVwiIG11c3QgYmUgb2YgdHlwZSBcIm9iamVjdFwiIGJ1dCBpbnN0ZWFkIHJlY2VpdmVkIFwiJHt0eXBlb2Ygb3B0aW9ucy50aGVtZX1cIi5gXG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBnZXRDb2xvcnNIaWdobGlnaHQgPSBvcHRpb25zID0+XG4gIERFRkFVTFRfVEhFTUVfS0VZUy5yZWR1Y2UoKGNvbG9ycywga2V5KSA9PiB7XG4gICAgY29uc3QgdmFsdWUgPVxuICAgICAgb3B0aW9ucy50aGVtZSAmJiBvcHRpb25zLnRoZW1lW2tleV0gIT09IHVuZGVmaW5lZFxuICAgICAgICA/IG9wdGlvbnMudGhlbWVba2V5XVxuICAgICAgICA6IERFRkFVTFRfVEhFTUVba2V5XTtcbiAgICBjb25zdCBjb2xvciA9IHZhbHVlICYmIF9hbnNpU3R5bGVzLmRlZmF1bHRbdmFsdWVdO1xuXG4gICAgaWYgKFxuICAgICAgY29sb3IgJiZcbiAgICAgIHR5cGVvZiBjb2xvci5jbG9zZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgIHR5cGVvZiBjb2xvci5vcGVuID09PSAnc3RyaW5nJ1xuICAgICkge1xuICAgICAgY29sb3JzW2tleV0gPSBjb2xvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgcHJldHR5LWZvcm1hdDogT3B0aW9uIFwidGhlbWVcIiBoYXMgYSBrZXkgXCIke2tleX1cIiB3aG9zZSB2YWx1ZSBcIiR7dmFsdWV9XCIgaXMgdW5kZWZpbmVkIGluIGFuc2ktc3R5bGVzLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbG9ycztcbiAgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG5cbmNvbnN0IGdldENvbG9yc0VtcHR5ID0gKCkgPT5cbiAgREVGQVVMVF9USEVNRV9LRVlTLnJlZHVjZSgoY29sb3JzLCBrZXkpID0+IHtcbiAgICBjb2xvcnNba2V5XSA9IHtcbiAgICAgIGNsb3NlOiAnJyxcbiAgICAgIG9wZW46ICcnXG4gICAgfTtcbiAgICByZXR1cm4gY29sb3JzO1xuICB9LCBPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuY29uc3QgZ2V0UHJpbnRGdW5jdGlvbk5hbWUgPSBvcHRpb25zID0+XG4gIG9wdGlvbnMgJiYgb3B0aW9ucy5wcmludEZ1bmN0aW9uTmFtZSAhPT0gdW5kZWZpbmVkXG4gICAgPyBvcHRpb25zLnByaW50RnVuY3Rpb25OYW1lXG4gICAgOiBERUZBVUxUX09QVElPTlMucHJpbnRGdW5jdGlvbk5hbWU7XG5cbmNvbnN0IGdldEVzY2FwZVJlZ2V4ID0gb3B0aW9ucyA9PlxuICBvcHRpb25zICYmIG9wdGlvbnMuZXNjYXBlUmVnZXggIT09IHVuZGVmaW5lZFxuICAgID8gb3B0aW9ucy5lc2NhcGVSZWdleFxuICAgIDogREVGQVVMVF9PUFRJT05TLmVzY2FwZVJlZ2V4O1xuXG5jb25zdCBnZXRFc2NhcGVTdHJpbmcgPSBvcHRpb25zID0+XG4gIG9wdGlvbnMgJiYgb3B0aW9ucy5lc2NhcGVTdHJpbmcgIT09IHVuZGVmaW5lZFxuICAgID8gb3B0aW9ucy5lc2NhcGVTdHJpbmdcbiAgICA6IERFRkFVTFRfT1BUSU9OUy5lc2NhcGVTdHJpbmc7XG5cbmNvbnN0IGdldENvbmZpZyA9IG9wdGlvbnMgPT4ge1xuICB2YXIgX29wdGlvbnMkcHJpbnRCYXNpY1ByO1xuXG4gIHJldHVybiB7XG4gICAgY2FsbFRvSlNPTjpcbiAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5jYWxsVG9KU09OICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRpb25zLmNhbGxUb0pTT05cbiAgICAgICAgOiBERUZBVUxUX09QVElPTlMuY2FsbFRvSlNPTixcbiAgICBjb2xvcnM6XG4gICAgICBvcHRpb25zICYmIG9wdGlvbnMuaGlnaGxpZ2h0XG4gICAgICAgID8gZ2V0Q29sb3JzSGlnaGxpZ2h0KG9wdGlvbnMpXG4gICAgICAgIDogZ2V0Q29sb3JzRW1wdHkoKSxcbiAgICBjb21wYXJlS2V5czpcbiAgICAgIG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuY29tcGFyZUtleXMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyBvcHRpb25zLmNvbXBhcmVLZXlzXG4gICAgICAgIDogREVGQVVMVF9PUFRJT05TLmNvbXBhcmVLZXlzLFxuICAgIGVzY2FwZVJlZ2V4OiBnZXRFc2NhcGVSZWdleChvcHRpb25zKSxcbiAgICBlc2NhcGVTdHJpbmc6IGdldEVzY2FwZVN0cmluZyhvcHRpb25zKSxcbiAgICBpbmRlbnQ6XG4gICAgICBvcHRpb25zICYmIG9wdGlvbnMubWluXG4gICAgICAgID8gJydcbiAgICAgICAgOiBjcmVhdGVJbmRlbnQoXG4gICAgICAgICAgICBvcHRpb25zICYmIG9wdGlvbnMuaW5kZW50ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgPyBvcHRpb25zLmluZGVudFxuICAgICAgICAgICAgICA6IERFRkFVTFRfT1BUSU9OUy5pbmRlbnRcbiAgICAgICAgICApLFxuICAgIG1heERlcHRoOlxuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLm1heERlcHRoICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRpb25zLm1heERlcHRoXG4gICAgICAgIDogREVGQVVMVF9PUFRJT05TLm1heERlcHRoLFxuICAgIG1pbjpcbiAgICAgIG9wdGlvbnMgJiYgb3B0aW9ucy5taW4gIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubWluIDogREVGQVVMVF9PUFRJT05TLm1pbixcbiAgICBwbHVnaW5zOlxuICAgICAgb3B0aW9ucyAmJiBvcHRpb25zLnBsdWdpbnMgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IG9wdGlvbnMucGx1Z2luc1xuICAgICAgICA6IERFRkFVTFRfT1BUSU9OUy5wbHVnaW5zLFxuICAgIHByaW50QmFzaWNQcm90b3R5cGU6XG4gICAgICAoX29wdGlvbnMkcHJpbnRCYXNpY1ByID1cbiAgICAgICAgb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDBcbiAgICAgICAgICA/IHZvaWQgMFxuICAgICAgICAgIDogb3B0aW9ucy5wcmludEJhc2ljUHJvdG90eXBlKSAhPT0gbnVsbCAmJlxuICAgICAgX29wdGlvbnMkcHJpbnRCYXNpY1ByICE9PSB2b2lkIDBcbiAgICAgICAgPyBfb3B0aW9ucyRwcmludEJhc2ljUHJcbiAgICAgICAgOiB0cnVlLFxuICAgIHByaW50RnVuY3Rpb25OYW1lOiBnZXRQcmludEZ1bmN0aW9uTmFtZShvcHRpb25zKSxcbiAgICBzcGFjaW5nSW5uZXI6IG9wdGlvbnMgJiYgb3B0aW9ucy5taW4gPyAnICcgOiAnXFxuJyxcbiAgICBzcGFjaW5nT3V0ZXI6IG9wdGlvbnMgJiYgb3B0aW9ucy5taW4gPyAnJyA6ICdcXG4nXG4gIH07XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVJbmRlbnQoaW5kZW50KSB7XG4gIHJldHVybiBuZXcgQXJyYXkoaW5kZW50ICsgMSkuam9pbignICcpO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgcHJlc2VudGF0aW9uIHN0cmluZyBvZiB5b3VyIGB2YWxgIG9iamVjdFxuICogQHBhcmFtIHZhbCBhbnkgcG90ZW50aWFsIEphdmFTY3JpcHQgb2JqZWN0XG4gKiBAcGFyYW0gb3B0aW9ucyBDdXN0b20gc2V0dGluZ3NcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXQodmFsLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zKSB7XG4gICAgdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucykge1xuICAgICAgY29uc3QgcGx1Z2luID0gZmluZFBsdWdpbihvcHRpb25zLnBsdWdpbnMsIHZhbCk7XG5cbiAgICAgIGlmIChwbHVnaW4gIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHByaW50UGx1Z2luKHBsdWdpbiwgdmFsLCBnZXRDb25maWcob3B0aW9ucyksICcnLCAwLCBbXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYmFzaWNSZXN1bHQgPSBwcmludEJhc2ljVmFsdWUoXG4gICAgdmFsLFxuICAgIGdldFByaW50RnVuY3Rpb25OYW1lKG9wdGlvbnMpLFxuICAgIGdldEVzY2FwZVJlZ2V4KG9wdGlvbnMpLFxuICAgIGdldEVzY2FwZVN0cmluZyhvcHRpb25zKVxuICApO1xuXG4gIGlmIChiYXNpY1Jlc3VsdCAhPT0gbnVsbCkge1xuICAgIHJldHVybiBiYXNpY1Jlc3VsdDtcbiAgfVxuXG4gIHJldHVybiBwcmludENvbXBsZXhWYWx1ZSh2YWwsIGdldENvbmZpZyhvcHRpb25zKSwgJycsIDAsIFtdKTtcbn1cblxuY29uc3QgcGx1Z2lucyA9IHtcbiAgQXN5bW1ldHJpY01hdGNoZXI6IF9Bc3ltbWV0cmljTWF0Y2hlci5kZWZhdWx0LFxuICBDb252ZXJ0QW5zaTogX0NvbnZlcnRBbnNpLmRlZmF1bHQsXG4gIERPTUNvbGxlY3Rpb246IF9ET01Db2xsZWN0aW9uLmRlZmF1bHQsXG4gIERPTUVsZW1lbnQ6IF9ET01FbGVtZW50LmRlZmF1bHQsXG4gIEltbXV0YWJsZTogX0ltbXV0YWJsZS5kZWZhdWx0LFxuICBSZWFjdEVsZW1lbnQ6IF9SZWFjdEVsZW1lbnQuZGVmYXVsdCxcbiAgUmVhY3RUZXN0Q29tcG9uZW50OiBfUmVhY3RUZXN0Q29tcG9uZW50LmRlZmF1bHRcbn07XG5leHBvcnRzLnBsdWdpbnMgPSBwbHVnaW5zO1xudmFyIF9kZWZhdWx0ID0gZm9ybWF0O1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgUGx1Z2luIGFzIFByZXR0eUZvcm1hdFBsdWdpbixcbiAgUGx1Z2lucyBhcyBQcmV0dHlGb3JtYXRQbHVnaW5zLFxufSBmcm9tICdwcmV0dHktZm9ybWF0J1xuaW1wb3J0IHtcbiAgcGx1Z2lucyBhcyBwcmV0dHlGb3JtYXRQbHVnaW5zLFxufSBmcm9tICdwcmV0dHktZm9ybWF0J1xuXG5jb25zdCB7XG4gIERPTUNvbGxlY3Rpb24sXG4gIERPTUVsZW1lbnQsXG4gIEltbXV0YWJsZSxcbiAgUmVhY3RFbGVtZW50LFxuICBSZWFjdFRlc3RDb21wb25lbnQsXG4gIEFzeW1tZXRyaWNNYXRjaGVyLFxufSA9IHByZXR0eUZvcm1hdFBsdWdpbnNcblxubGV0IFBMVUdJTlM6IFByZXR0eUZvcm1hdFBsdWdpbnMgPSBbXG4gIFJlYWN0VGVzdENvbXBvbmVudCxcbiAgUmVhY3RFbGVtZW50LFxuICBET01FbGVtZW50LFxuICBET01Db2xsZWN0aW9uLFxuICBJbW11dGFibGUsXG4gIEFzeW1tZXRyaWNNYXRjaGVyLFxuICAvLyBUT0RPOiB3cml0ZSBzaW5vbiBtb2NrIHNlcmlhbGl6ZXJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2plc3QvYmxvYi80ZWI0ZjZhNTliNmVhZTBlMDViOGU1MWRkOGNkM2ZkY2ExYzdhZmYxL3BhY2thZ2VzL2plc3Qtc25hcHNob3Qvc3JjL21vY2tTZXJpYWxpemVyLnRzI0w0XG5dXG5cbi8vIFRPRE86IGV4cG9zZSB0aGVzZSBhbmQgYWxsb3cgdXNlciB0byBhZGQgY3VzdG9tIHNlcmlhbGl6ZXJzXG4vLyBQcmVwZW5kIHRvIGxpc3Qgc28gdGhlIGxhc3QgYWRkZWQgaXMgdGhlIGZpcnN0IHRlc3RlZC5cbmV4cG9ydCBjb25zdCBhZGRTZXJpYWxpemVyID0gKHBsdWdpbjogUHJldHR5Rm9ybWF0UGx1Z2luKTogdm9pZCA9PiB7XG4gIFBMVUdJTlMgPSBbcGx1Z2luXS5jb25jYXQoUExVR0lOUylcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNlcmlhbGl6ZXJzID0gKCk6IFByZXR0eUZvcm1hdFBsdWdpbnMgPT4gUExVR0lOU1xuIiwiLypcbkNvcHlyaWdodCAoYykgMjAwOC0yMDE2IFBpdm90YWwgTGFic1xuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbmEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG53aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5kaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbnBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xudGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG5FWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbk1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG5OT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG5MSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG5PRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbldJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4qL1xuXG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuaW1wb3J0IHR5cGUgeyBUZXN0ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBFeHRyYWN0ZWQgb3V0IG9mIGphc21pbmUgMi41LjJcbmV4cG9ydCBmdW5jdGlvbiBlcXVhbHMoXG4gIGE6IHVua25vd24sXG4gIGI6IHVua25vd24sXG4gIGN1c3RvbVRlc3RlcnM/OiBBcnJheTxUZXN0ZXI+LFxuICBzdHJpY3RDaGVjaz86IGJvb2xlYW4sXG4pOiBib29sZWFuIHtcbiAgY3VzdG9tVGVzdGVycyA9IGN1c3RvbVRlc3RlcnMgfHwgW11cbiAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSwgY3VzdG9tVGVzdGVycywgc3RyaWN0Q2hlY2sgPyBoYXNLZXkgOiBoYXNEZWZpbmVkS2V5KVxufVxuXG5jb25zdCBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FzeW1tZXRyaWMob2JqOiBhbnkpIHtcbiAgcmV0dXJuICEhb2JqICYmIGlzQSgnRnVuY3Rpb24nLCBvYmouYXN5bW1ldHJpY01hdGNoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXN5bW1ldHJpYyhvYmo6IGFueSwgc2VlbiA9IG5ldyBTZXQoKSk6IGJvb2xlYW4ge1xuICBpZiAoc2Vlbi5oYXMob2JqKSlcbiAgICByZXR1cm4gZmFsc2VcbiAgc2Vlbi5hZGQob2JqKVxuICBpZiAoaXNBc3ltbWV0cmljKG9iaikpXG4gICAgcmV0dXJuIHRydWVcbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSlcbiAgICByZXR1cm4gb2JqLnNvbWUoaSA9PiBoYXNBc3ltbWV0cmljKGksIHNlZW4pKVxuICBpZiAob2JqIGluc3RhbmNlb2YgU2V0KVxuICAgIHJldHVybiBBcnJheS5mcm9tKG9iaikuc29tZShpID0+IGhhc0FzeW1tZXRyaWMoaSwgc2VlbikpXG4gIGlmIChpc09iamVjdChvYmopKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaikuc29tZSh2ID0+IGhhc0FzeW1tZXRyaWModiwgc2VlbikpXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBhc3ltbWV0cmljTWF0Y2goYTogYW55LCBiOiBhbnkpIHtcbiAgY29uc3QgYXN5bW1ldHJpY0EgPSBpc0FzeW1tZXRyaWMoYSlcbiAgY29uc3QgYXN5bW1ldHJpY0IgPSBpc0FzeW1tZXRyaWMoYilcblxuICBpZiAoYXN5bW1ldHJpY0EgJiYgYXN5bW1ldHJpY0IpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gIGlmIChhc3ltbWV0cmljQSlcbiAgICByZXR1cm4gYS5hc3ltbWV0cmljTWF0Y2goYilcblxuICBpZiAoYXN5bW1ldHJpY0IpXG4gICAgcmV0dXJuIGIuYXN5bW1ldHJpY01hdGNoKGEpXG59XG5cbi8vIEVxdWFsaXR5IGZ1bmN0aW9uIGxvdmluZ2x5IGFkYXB0ZWQgZnJvbSBpc0VxdWFsIGluXG4vLyAgIFtVbmRlcnNjb3JlXShodHRwOi8vdW5kZXJzY29yZWpzLm9yZylcbmZ1bmN0aW9uIGVxKFxuICBhOiBhbnksXG4gIGI6IGFueSxcbiAgYVN0YWNrOiBBcnJheTx1bmtub3duPixcbiAgYlN0YWNrOiBBcnJheTx1bmtub3duPixcbiAgY3VzdG9tVGVzdGVyczogQXJyYXk8VGVzdGVyPixcbiAgaGFzS2V5OiBhbnksXG4pOiBib29sZWFuIHtcbiAgbGV0IHJlc3VsdCA9IHRydWVcblxuICBjb25zdCBhc3ltbWV0cmljUmVzdWx0ID0gYXN5bW1ldHJpY01hdGNoKGEsIGIpXG4gIGlmIChhc3ltbWV0cmljUmVzdWx0ICE9PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGFzeW1tZXRyaWNSZXN1bHRcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3RvbVRlc3RlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXN0b21UZXN0ZXJSZXN1bHQgPSBjdXN0b21UZXN0ZXJzW2ldKGEsIGIpXG4gICAgaWYgKGN1c3RvbVRlc3RlclJlc3VsdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGN1c3RvbVRlc3RlclJlc3VsdFxuICB9XG5cbiAgaWYgKGEgaW5zdGFuY2VvZiBFcnJvciAmJiBiIGluc3RhbmNlb2YgRXJyb3IpXG4gICAgcmV0dXJuIGEubWVzc2FnZSA9PT0gYi5tZXNzYWdlXG5cbiAgaWYgKE9iamVjdC5pcyhhLCBiKSlcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbClcbiAgICByZXR1cm4gYSA9PT0gYlxuXG4gIGNvbnN0IGNsYXNzTmFtZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKVxuICBpZiAoY2xhc3NOYW1lICE9PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYikpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICBpZiAodHlwZW9mIGEgIT09IHR5cGVvZiBiKSB7XG4gICAgICAgIC8vIE9uZSBpcyBhIHByaW1pdGl2ZSwgb25lIGEgYG5ldyBQcmltaXRpdmUoKWBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgYSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIGJvdGggYXJlIHByb3BlciBwcmltaXRpdmVzXG4gICAgICAgIHJldHVybiBPYmplY3QuaXMoYSwgYilcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBib3RoIGFyZSBgbmV3IFByaW1pdGl2ZSgpYHNcbiAgICAgICAgcmV0dXJuIE9iamVjdC5pcyhhLnZhbHVlT2YoKSwgYi52YWx1ZU9mKCkpXG4gICAgICB9XG4gICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICAvLyBDb2VyY2UgZGF0ZXMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgIHJldHVybiArYSA9PT0gK2JcbiAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICByZXR1cm4gYS5zb3VyY2UgPT09IGIuc291cmNlICYmIGEuZmxhZ3MgPT09IGIuZmxhZ3NcbiAgfVxuICBpZiAodHlwZW9mIGEgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9PSAnb2JqZWN0JylcbiAgICByZXR1cm4gZmFsc2VcblxuICAvLyBVc2UgRE9NMyBtZXRob2QgaXNFcXVhbE5vZGUgKElFPj05KVxuICBpZiAoaXNEb21Ob2RlKGEpICYmIGlzRG9tTm9kZShiKSlcbiAgICByZXR1cm4gYS5pc0VxdWFsTm9kZShiKVxuXG4gIC8vIFVzZWQgdG8gZGV0ZWN0IGNpcmN1bGFyIHJlZmVyZW5jZXMuXG4gIGxldCBsZW5ndGggPSBhU3RhY2subGVuZ3RoXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAvLyBjaXJjdWxhciByZWZlcmVuY2VzIGF0IHNhbWUgZGVwdGggYXJlIGVxdWFsXG4gICAgLy8gY2lyY3VsYXIgcmVmZXJlbmNlIGlzIG5vdCBlcXVhbCB0byBub24tY2lyY3VsYXIgb25lXG4gICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKVxuICAgICAgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiXG5cbiAgICBlbHNlIGlmIChiU3RhY2tbbGVuZ3RoXSA9PT0gYilcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgYVN0YWNrLnB1c2goYSlcbiAgYlN0YWNrLnB1c2goYilcbiAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICBpZiAoY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nICYmIGEubGVuZ3RoICE9PSBiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2VcblxuICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgY29uc3QgYUtleXMgPSBrZXlzKGEsIGhhc0tleSlcbiAgbGV0IGtleVxuICBsZXQgc2l6ZSA9IGFLZXlzLmxlbmd0aFxuXG4gIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgaWYgKGtleXMoYiwgaGFzS2V5KS5sZW5ndGggIT09IHNpemUpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIGtleSA9IGFLZXlzW3NpemVdXG5cbiAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICByZXN1bHRcbiAgICAgID0gaGFzS2V5KGIsIGtleSlcbiAgICAgICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaywgY3VzdG9tVGVzdGVycywgaGFzS2V5KVxuXG4gICAgaWYgKCFyZXN1bHQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgYVN0YWNrLnBvcCgpXG4gIGJTdGFjay5wb3AoKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24ga2V5cyhvYmo6IG9iamVjdCwgaGFzS2V5OiAob2JqOiBvYmplY3QsIGtleTogc3RyaW5nKSA9PiBib29sZWFuKSB7XG4gIGNvbnN0IGtleXMgPSBbXVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc0tleShvYmosIGtleSkpXG4gICAgICBrZXlzLnB1c2goa2V5KVxuICB9XG4gIHJldHVybiBrZXlzLmNvbmNhdChcbiAgICAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmopIGFzIEFycmF5PGFueT4pLmZpbHRlcihcbiAgICAgIHN5bWJvbCA9PlxuICAgICAgICAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHN5bWJvbCkgYXMgUHJvcGVydHlEZXNjcmlwdG9yKVxuICAgICAgICAgIC5lbnVtZXJhYmxlLFxuICAgICksXG4gIClcbn1cblxuZnVuY3Rpb24gaGFzRGVmaW5lZEtleShvYmo6IGFueSwga2V5OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGhhc0tleShvYmosIGtleSkgJiYgb2JqW2tleV0gIT09IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBoYXNLZXkob2JqOiBhbnksIGtleTogc3RyaW5nKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0EodHlwZU5hbWU6IHN0cmluZywgdmFsdWU6IHVua25vd24pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSBgW29iamVjdCAke3R5cGVOYW1lfV1gXG59XG5cbmZ1bmN0aW9uIGlzRG9tTm9kZShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIG9iaiAhPT0gbnVsbFxuICAgICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIG9iai5ub2RlVHlwZSA9PT0gJ251bWJlcidcbiAgICAmJiB0eXBlb2Ygb2JqLm5vZGVOYW1lID09PSAnc3RyaW5nJ1xuICAgICYmIHR5cGVvZiBvYmouaXNFcXVhbE5vZGUgPT09ICdmdW5jdGlvbidcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm5OYW1lRm9yKGZ1bmM6IEZ1bmN0aW9uKSB7XG4gIGlmIChmdW5jLm5hbWUpXG4gICAgcmV0dXJuIGZ1bmMubmFtZVxuXG4gIGNvbnN0IG1hdGNoZXMgPSBmdW5jdGlvblRvU3RyaW5nXG4gICAgLmNhbGwoZnVuYylcbiAgICAubWF0Y2goL14oPzphc3luYyk/XFxzKmZ1bmN0aW9uXFxzKlxcKj9cXHMqKFtcXHckXSspXFxzKlxcKC8pXG4gIHJldHVybiBtYXRjaGVzID8gbWF0Y2hlc1sxXSA6ICc8YW5vbnltb3VzPidcbn1cblxuZnVuY3Rpb24gZ2V0UHJvdG90eXBlKG9iajogb2JqZWN0KSB7XG4gIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YpXG4gICAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopXG5cbiAgaWYgKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IG9iailcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiBvYmouY29uc3RydWN0b3IucHJvdG90eXBlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQcm9wZXJ0eShvYmo6IG9iamVjdCB8IG51bGwsIHByb3BlcnR5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKCFvYmopXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3BlcnR5KSlcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHJldHVybiBoYXNQcm9wZXJ0eShnZXRQcm90b3R5cGUob2JqKSwgcHJvcGVydHkpXG59XG5cbi8vIFNFTlRJTkVMIGNvbnN0YW50cyBhcmUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svaW1tdXRhYmxlLWpzXG5jb25zdCBJU19LRVlFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0tFWUVEX19AQCdcbmNvbnN0IElTX1NFVF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NFVF9fQEAnXG5jb25zdCBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnXG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ltbXV0YWJsZVVub3JkZXJlZEtleWVkKG1heWJlS2V5ZWQ6IGFueSkge1xuICByZXR1cm4gISEoXG4gICAgbWF5YmVLZXllZFxuICAgICYmIG1heWJlS2V5ZWRbSVNfS0VZRURfU0VOVElORUxdXG4gICAgJiYgIW1heWJlS2V5ZWRbSVNfT1JERVJFRF9TRU5USU5FTF1cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbW11dGFibGVVbm9yZGVyZWRTZXQobWF5YmVTZXQ6IGFueSkge1xuICByZXR1cm4gISEoXG4gICAgbWF5YmVTZXRcbiAgICAmJiBtYXliZVNldFtJU19TRVRfU0VOVElORUxdXG4gICAgJiYgIW1heWJlU2V0W0lTX09SREVSRURfU0VOVElORUxdXG4gIClcbn1cblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKi9cbmNvbnN0IEl0ZXJhdG9yU3ltYm9sID0gU3ltYm9sLml0ZXJhdG9yXG5cbmNvbnN0IGhhc0l0ZXJhdG9yID0gKG9iamVjdDogYW55KSA9PlxuICAhIShvYmplY3QgIT0gbnVsbCAmJiBvYmplY3RbSXRlcmF0b3JTeW1ib2xdKVxuXG5leHBvcnQgY29uc3QgaXRlcmFibGVFcXVhbGl0eSA9IChcbiAgYTogYW55LFxuICBiOiBhbnksXG4gIGFTdGFjazogQXJyYXk8YW55PiA9IFtdLFxuICBiU3RhY2s6IEFycmF5PGFueT4gPSBbXSxcbik6IGJvb2xlYW4gfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoXG4gICAgdHlwZW9mIGEgIT09ICdvYmplY3QnXG4gICAgfHwgdHlwZW9mIGIgIT09ICdvYmplY3QnXG4gICAgfHwgQXJyYXkuaXNBcnJheShhKVxuICAgIHx8IEFycmF5LmlzQXJyYXkoYilcbiAgICB8fCAhaGFzSXRlcmF0b3IoYSlcbiAgICB8fCAhaGFzSXRlcmF0b3IoYilcbiAgKVxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBpZiAoYS5jb25zdHJ1Y3RvciAhPT0gYi5jb25zdHJ1Y3RvcilcbiAgICByZXR1cm4gZmFsc2VcblxuICBsZXQgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aFxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgLy8gY2lyY3VsYXIgcmVmZXJlbmNlcyBhdCBzYW1lIGRlcHRoIGFyZSBlcXVhbFxuICAgIC8vIGNpcmN1bGFyIHJlZmVyZW5jZSBpcyBub3QgZXF1YWwgdG8gbm9uLWNpcmN1bGFyIG9uZVxuICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSlcbiAgICAgIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYlxuICB9XG4gIGFTdGFjay5wdXNoKGEpXG4gIGJTdGFjay5wdXNoKGIpXG5cbiAgY29uc3QgaXRlcmFibGVFcXVhbGl0eVdpdGhTdGFjayA9IChhOiBhbnksIGI6IGFueSkgPT5cbiAgICBpdGVyYWJsZUVxdWFsaXR5KGEsIGIsIFsuLi5hU3RhY2tdLCBbLi4uYlN0YWNrXSlcblxuICBpZiAoYS5zaXplICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoYS5zaXplICE9PSBiLnNpemUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBlbHNlIGlmIChpc0EoJ1NldCcsIGEpIHx8IGlzSW1tdXRhYmxlVW5vcmRlcmVkU2V0KGEpKSB7XG4gICAgICBsZXQgYWxsRm91bmQgPSB0cnVlXG4gICAgICBmb3IgKGNvbnN0IGFWYWx1ZSBvZiBhKSB7XG4gICAgICAgIGlmICghYi5oYXMoYVZhbHVlKSkge1xuICAgICAgICAgIGxldCBoYXMgPSBmYWxzZVxuICAgICAgICAgIGZvciAoY29uc3QgYlZhbHVlIG9mIGIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzRXF1YWwgPSBlcXVhbHMoYVZhbHVlLCBiVmFsdWUsIFtpdGVyYWJsZUVxdWFsaXR5V2l0aFN0YWNrXSlcbiAgICAgICAgICAgIGlmIChpc0VxdWFsID09PSB0cnVlKVxuICAgICAgICAgICAgICBoYXMgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFsbEZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IHZhbHVlIGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCB2YWx1ZXMuXG4gICAgICBhU3RhY2sucG9wKClcbiAgICAgIGJTdGFjay5wb3AoKVxuICAgICAgcmV0dXJuIGFsbEZvdW5kXG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQSgnTWFwJywgYSkgfHwgaXNJbW11dGFibGVVbm9yZGVyZWRLZXllZChhKSkge1xuICAgICAgbGV0IGFsbEZvdW5kID0gdHJ1ZVxuICAgICAgZm9yIChjb25zdCBhRW50cnkgb2YgYSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWIuaGFzKGFFbnRyeVswXSlcbiAgICAgICAgICB8fCAhZXF1YWxzKGFFbnRyeVsxXSwgYi5nZXQoYUVudHJ5WzBdKSwgW2l0ZXJhYmxlRXF1YWxpdHlXaXRoU3RhY2tdKVxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgaGFzID0gZmFsc2VcbiAgICAgICAgICBmb3IgKGNvbnN0IGJFbnRyeSBvZiBiKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVkS2V5ID0gZXF1YWxzKGFFbnRyeVswXSwgYkVudHJ5WzBdLCBbXG4gICAgICAgICAgICAgIGl0ZXJhYmxlRXF1YWxpdHlXaXRoU3RhY2ssXG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICBsZXQgbWF0Y2hlZFZhbHVlID0gZmFsc2VcbiAgICAgICAgICAgIGlmIChtYXRjaGVkS2V5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIG1hdGNoZWRWYWx1ZSA9IGVxdWFscyhhRW50cnlbMV0sIGJFbnRyeVsxXSwgW1xuICAgICAgICAgICAgICAgIGl0ZXJhYmxlRXF1YWxpdHlXaXRoU3RhY2ssXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hlZFZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgICBoYXMgPSB0cnVlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhhcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFsbEZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IHZhbHVlIGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCB2YWx1ZXMuXG4gICAgICBhU3RhY2sucG9wKClcbiAgICAgIGJTdGFjay5wb3AoKVxuICAgICAgcmV0dXJuIGFsbEZvdW5kXG4gICAgfVxuICB9XG5cbiAgY29uc3QgYkl0ZXJhdG9yID0gYltJdGVyYXRvclN5bWJvbF0oKVxuXG4gIGZvciAoY29uc3QgYVZhbHVlIG9mIGEpIHtcbiAgICBjb25zdCBuZXh0QiA9IGJJdGVyYXRvci5uZXh0KClcbiAgICBpZiAoXG4gICAgICBuZXh0Qi5kb25lXG4gICAgICB8fCAhZXF1YWxzKGFWYWx1ZSwgbmV4dEIudmFsdWUsIFtpdGVyYWJsZUVxdWFsaXR5V2l0aFN0YWNrXSlcbiAgICApXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAoIWJJdGVyYXRvci5uZXh0KCkuZG9uZSlcbiAgICByZXR1cm4gZmFsc2VcblxuICAvLyBSZW1vdmUgdGhlIGZpcnN0IHZhbHVlIGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCB2YWx1ZXMuXG4gIGFTdGFjay5wb3AoKVxuICBiU3RhY2sucG9wKClcbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGhhc093blByb3BlcnR5KG9iamVjdCwga2V5KWAgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgc3RvcHBpbmcgYXQgYE9iamVjdC5wcm90b3R5cGVgLlxuICovXG5jb25zdCBoYXNQcm9wZXJ0eUluT2JqZWN0ID0gKG9iamVjdDogb2JqZWN0LCBrZXk6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCBzaG91bGRUZXJtaW5hdGVcbiAgICA9ICFvYmplY3QgfHwgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgb2JqZWN0ID09PSBPYmplY3QucHJvdG90eXBlXG5cbiAgaWYgKHNob3VsZFRlcm1pbmF0ZSlcbiAgICByZXR1cm4gZmFsc2VcblxuICByZXR1cm4gKFxuICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSlcbiAgICB8fCBoYXNQcm9wZXJ0eUluT2JqZWN0KE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpLCBrZXkpXG4gIClcbn1cblxuY29uc3QgaXNPYmplY3RXaXRoS2V5cyA9IChhOiBhbnkpID0+XG4gIGlzT2JqZWN0KGEpXG4gICYmICEoYSBpbnN0YW5jZW9mIEVycm9yKVxuICAmJiAhKGEgaW5zdGFuY2VvZiBBcnJheSlcbiAgJiYgIShhIGluc3RhbmNlb2YgRGF0ZSlcblxuZXhwb3J0IGNvbnN0IHN1YnNldEVxdWFsaXR5ID0gKFxuICBvYmplY3Q6IHVua25vd24sXG4gIHN1YnNldDogdW5rbm93bixcbik6IGJvb2xlYW4gfCB1bmRlZmluZWQgPT4ge1xuICAvLyBzdWJzZXRFcXVhbGl0eSBuZWVkcyB0byBrZWVwIHRyYWNrIG9mIHRoZSByZWZlcmVuY2VzXG4gIC8vIGl0IGhhcyBhbHJlYWR5IHZpc2l0ZWQgdG8gYXZvaWQgaW5maW5pdGUgbG9vcHMgaW4gY2FzZVxuICAvLyB0aGVyZSBhcmUgY2lyY3VsYXIgcmVmZXJlbmNlcyBpbiB0aGUgc3Vic2V0IHBhc3NlZCB0byBpdC5cbiAgY29uc3Qgc3Vic2V0RXF1YWxpdHlXaXRoQ29udGV4dFxuICAgID0gKHNlZW5SZWZlcmVuY2VzOiBXZWFrTWFwPG9iamVjdCwgYm9vbGVhbj4gPSBuZXcgV2Vha01hcCgpKSA9PlxuICAgICAgKG9iamVjdDogYW55LCBzdWJzZXQ6IGFueSk6IGJvb2xlYW4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICBpZiAoIWlzT2JqZWN0V2l0aEtleXMoc3Vic2V0KSlcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHN1YnNldCkuZXZlcnkoKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChpc09iamVjdFdpdGhLZXlzKHN1YnNldFtrZXldKSkge1xuICAgICAgICAgICAgaWYgKHNlZW5SZWZlcmVuY2VzLmhhcyhzdWJzZXRba2V5XSkpXG4gICAgICAgICAgICAgIHJldHVybiBlcXVhbHMob2JqZWN0W2tleV0sIHN1YnNldFtrZXldLCBbaXRlcmFibGVFcXVhbGl0eV0pXG5cbiAgICAgICAgICAgIHNlZW5SZWZlcmVuY2VzLnNldChzdWJzZXRba2V5XSwgdHJ1ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcmVzdWx0XG4gICAgICAgICAgPSBvYmplY3QgIT0gbnVsbFxuICAgICAgICAgICYmIGhhc1Byb3BlcnR5SW5PYmplY3Qob2JqZWN0LCBrZXkpXG4gICAgICAgICAgJiYgZXF1YWxzKG9iamVjdFtrZXldLCBzdWJzZXRba2V5XSwgW1xuICAgICAgICAgICAgaXRlcmFibGVFcXVhbGl0eSxcbiAgICAgICAgICAgIHN1YnNldEVxdWFsaXR5V2l0aENvbnRleHQoc2VlblJlZmVyZW5jZXMpLFxuICAgICAgICAgIF0pXG4gICAgICAgICAgLy8gVGhlIG1haW4gZ29hbCBvZiB1c2luZyBzZWVuUmVmZXJlbmNlIGlzIHRvIGF2b2lkIGNpcmN1bGFyIG5vZGUgb24gdHJlZS5cbiAgICAgICAgICAvLyBJdCB3aWxsIG9ubHkgaGFwcGVuIHdpdGhpbiBhIHBhcmVudCBhbmQgaXRzIGNoaWxkLCBub3QgYSBub2RlIGFuZCBub2RlcyBuZXh0IHRvIGl0IChzYW1lIGxldmVsKVxuICAgICAgICAgIC8vIFdlIHNob3VsZCBrZWVwIHRoZSByZWZlcmVuY2UgZm9yIGEgcGFyZW50IGFuZCBpdHMgY2hpbGQgb25seVxuICAgICAgICAgIC8vIFRodXMgd2Ugc2hvdWxkIGRlbGV0ZSB0aGUgcmVmZXJlbmNlIGltbWVkaWF0ZWx5IHNvIHRoYXQgaXQgZG9lc24ndCBpbnRlcmZlcmVcbiAgICAgICAgICAvLyBvdGhlciBub2RlcyB3aXRoaW4gdGhlIHNhbWUgbGV2ZWwgb24gdHJlZS5cbiAgICAgICAgICBzZWVuUmVmZXJlbmNlcy5kZWxldGUoc3Vic2V0W2tleV0pXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gIHJldHVybiBzdWJzZXRFcXVhbGl0eVdpdGhDb250ZXh0KCkob2JqZWN0LCBzdWJzZXQpXG59XG5cbmV4cG9ydCBjb25zdCB0eXBlRXF1YWxpdHkgPSAoYTogYW55LCBiOiBhbnkpOiBib29sZWFuIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwgfHwgYS5jb25zdHJ1Y3RvciA9PT0gYi5jb25zdHJ1Y3RvcilcbiAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBjb25zdCBhcnJheUJ1ZmZlckVxdWFsaXR5ID0gKFxuICBhOiB1bmtub3duLFxuICBiOiB1bmtub3duLFxuKTogYm9vbGVhbiB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghKGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgIShiIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKVxuICAgIHJldHVybiB1bmRlZmluZWRcblxuICBjb25zdCBkYXRhVmlld0EgPSBuZXcgRGF0YVZpZXcoYSlcbiAgY29uc3QgZGF0YVZpZXdCID0gbmV3IERhdGFWaWV3KGIpXG5cbiAgLy8gQnVmZmVycyBhcmUgbm90IGVxdWFsIHdoZW4gdGhleSBkbyBub3QgaGF2ZSB0aGUgc2FtZSBieXRlIGxlbmd0aFxuICBpZiAoZGF0YVZpZXdBLmJ5dGVMZW5ndGggIT09IGRhdGFWaWV3Qi5ieXRlTGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIC8vIENoZWNrIGlmIGV2ZXJ5IGJ5dGUgdmFsdWUgaXMgZXF1YWwgdG8gZWFjaCBvdGhlclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFWaWV3QS5ieXRlTGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZGF0YVZpZXdBLmdldFVpbnQ4KGkpICE9PSBkYXRhVmlld0IuZ2V0VWludDgoaSkpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBjb25zdCBzcGFyc2VBcnJheUVxdWFsaXR5ID0gKFxuICBhOiB1bmtub3duLFxuICBiOiB1bmtub3duLFxuKTogYm9vbGVhbiB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhKSB8fCAhQXJyYXkuaXNBcnJheShiKSlcbiAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgLy8gQSBzcGFyc2UgYXJyYXkgWywgLCAxXSB3aWxsIGhhdmUga2V5cyBbXCIyXCJdIHdoZXJlYXMgW3VuZGVmaW5lZCwgdW5kZWZpbmVkLCAxXSB3aWxsIGhhdmUga2V5cyBbXCIwXCIsIFwiMVwiLCBcIjJcIl1cbiAgY29uc3QgYUtleXMgPSBPYmplY3Qua2V5cyhhKVxuICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpXG4gIHJldHVybiAoXG4gICAgZXF1YWxzKGEsIGIsIFtpdGVyYWJsZUVxdWFsaXR5LCB0eXBlRXF1YWxpdHldLCB0cnVlKSAmJiBlcXVhbHMoYUtleXMsIGJLZXlzKVxuICApXG59XG4iLCJpbXBvcnQgdHlwZSB7IEVuaGFuY2VkU3B5IH0gZnJvbSAnLi4vamVzdC1tb2NrJ1xuaW1wb3J0IHsgaXNNb2NrRnVuY3Rpb24gfSBmcm9tICcuLi9qZXN0LW1vY2snXG5pbXBvcnQgeyBhZGRTZXJpYWxpemVyIH0gZnJvbSAnLi4vc25hcHNob3QvcG9ydC9wbHVnaW5zJ1xuaW1wb3J0IHR5cGUgeyBDb25zdHJ1Y3RhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBhc3NlcnRUeXBlcyB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuaW1wb3J0IHR5cGUgeyBDaGFpUGx1Z2luLCBNYXRjaGVyU3RhdGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgYXJyYXlCdWZmZXJFcXVhbGl0eSwgaXRlcmFibGVFcXVhbGl0eSwgZXF1YWxzIGFzIGplc3RFcXVhbHMsIHNwYXJzZUFycmF5RXF1YWxpdHksIHN1YnNldEVxdWFsaXR5LCB0eXBlRXF1YWxpdHkgfSBmcm9tICcuL2plc3QtdXRpbHMnXG5pbXBvcnQgdHlwZSB7IEFzeW1tZXRyaWNNYXRjaGVyIH0gZnJvbSAnLi9qZXN0LWFzeW1tZXRyaWMtbWF0Y2hlcnMnXG5cbmNvbnN0IE1BVENIRVJTX09CSkVDVCA9IFN5bWJvbC5mb3IoJ21hdGNoZXJzLW9iamVjdCcpXG5cbmlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGdsb2JhbCwgTUFUQ0hFUlNfT0JKRUNUKSkge1xuICBjb25zdCBkZWZhdWx0U3RhdGU6IFBhcnRpYWw8TWF0Y2hlclN0YXRlPiA9IHtcbiAgICBhc3NlcnRpb25DYWxsczogMCxcbiAgICBpc0V4cGVjdGluZ0Fzc2VydGlvbnM6IGZhbHNlLFxuICAgIGlzRXhwZWN0aW5nQXNzZXJ0aW9uc0Vycm9yOiBudWxsLFxuICAgIGV4cGVjdGVkQXNzZXJ0aW9uc051bWJlcjogbnVsbCxcbiAgICBleHBlY3RlZEFzc2VydGlvbnNOdW1iZXJFcnJvcjogbnVsbCxcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ2xvYmFsLCBNQVRDSEVSU19PQkpFQ1QsIHtcbiAgICB2YWx1ZToge1xuICAgICAgc3RhdGU6IGRlZmF1bHRTdGF0ZSxcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U3RhdGUgPSA8U3RhdGUgZXh0ZW5kcyBNYXRjaGVyU3RhdGUgPSBNYXRjaGVyU3RhdGU+KCk6IFN0YXRlID0+XG4gIChnbG9iYWwgYXMgYW55KVtNQVRDSEVSU19PQkpFQ1RdLnN0YXRlXG5cbmV4cG9ydCBjb25zdCBzZXRTdGF0ZSA9IDxTdGF0ZSBleHRlbmRzIE1hdGNoZXJTdGF0ZSA9IE1hdGNoZXJTdGF0ZT4oXG4gIHN0YXRlOiBQYXJ0aWFsPFN0YXRlPixcbik6IHZvaWQgPT4ge1xuICBPYmplY3QuYXNzaWduKChnbG9iYWwgYXMgYW55KVtNQVRDSEVSU19PQkpFQ1RdLnN0YXRlLCBzdGF0ZSlcbn1cblxuLy8gSmVzdCBFeHBlY3QgQ29tcGFjdFxuZXhwb3J0IGNvbnN0IEplc3RDaGFpRXhwZWN0OiBDaGFpUGx1Z2luID0gKGNoYWksIHV0aWxzKSA9PiB7XG4gIGZ1bmN0aW9uIGRlZihuYW1lOiBrZXlvZiBWaS5Bc3NlcnRpb24gfCAoa2V5b2YgVmkuQXNzZXJ0aW9uKVtdLCBmbjogKCh0aGlzOiBDaGFpLkFzc2VydGlvblN0YXRpYyAmIFZpLkFzc2VydGlvbiwgLi4uYXJnczogYW55W10pID0+IGFueSkpIHtcbiAgICBjb25zdCBhZGRNZXRob2QgPSAobjoga2V5b2YgVmkuQXNzZXJ0aW9uKSA9PiB7XG4gICAgICB1dGlscy5hZGRNZXRob2QoY2hhaS5Bc3NlcnRpb24ucHJvdG90eXBlLCBuLCBmbilcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSlcbiAgICAgIG5hbWUuZm9yRWFjaChuID0+IGFkZE1ldGhvZChuKSlcblxuICAgIGVsc2VcbiAgICAgIGFkZE1ldGhvZChuYW1lKVxuICB9XG5cbiAgKFsndGhyb3cnLCAndGhyb3dzJywgJ1Rocm93J10gYXMgY29uc3QpLmZvckVhY2goKG0pID0+IHtcbiAgICB1dGlscy5vdmVyd3JpdGVNZXRob2QoY2hhaS5Bc3NlcnRpb24ucHJvdG90eXBlLCBtLCAoX3N1cGVyOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0aGlzOiBDaGFpLkFzc2VydGlvbiAmIENoYWkuQXNzZXJ0aW9uU3RhdGljLCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBwcm9taXNlID0gdXRpbHMuZmxhZyh0aGlzLCAncHJvbWlzZScpXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcpXG4gICAgICAgIGlmIChwcm9taXNlID09PSAncmVqZWN0cycpIHtcbiAgICAgICAgICB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBvYmplY3RcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmdzKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgZGVmKCd0b0VxdWFsJywgZnVuY3Rpb24oZXhwZWN0ZWQpIHtcbiAgICBjb25zdCBhY3R1YWwgPSB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnKVxuICAgIGNvbnN0IGVxdWFsID0gamVzdEVxdWFscyhcbiAgICAgIGFjdHVhbCxcbiAgICAgIGV4cGVjdGVkLFxuICAgICAgW2l0ZXJhYmxlRXF1YWxpdHldLFxuICAgIClcblxuICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgIGVxdWFsLFxuICAgICAgJ2V4cGVjdGVkICN7dGhpc30gdG8gZGVlcGx5IGVxdWFsICN7ZXhwfScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgZGVlcGx5IGVxdWFsICN7ZXhwfScsXG4gICAgICBleHBlY3RlZCxcbiAgICAgIGFjdHVhbCxcbiAgICApXG4gIH0pXG5cbiAgZGVmKCd0b1N0cmljdEVxdWFsJywgZnVuY3Rpb24oZXhwZWN0ZWQpIHtcbiAgICBjb25zdCBvYmogPSB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnKVxuICAgIGNvbnN0IGVxdWFsID0gamVzdEVxdWFscyhcbiAgICAgIG9iaixcbiAgICAgIGV4cGVjdGVkLFxuICAgICAgW1xuICAgICAgICBpdGVyYWJsZUVxdWFsaXR5LFxuICAgICAgICB0eXBlRXF1YWxpdHksXG4gICAgICAgIHNwYXJzZUFycmF5RXF1YWxpdHksXG4gICAgICAgIGFycmF5QnVmZmVyRXF1YWxpdHksXG4gICAgICBdLFxuICAgICAgdHJ1ZSxcbiAgICApXG5cbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBlcXVhbCxcbiAgICAgICdleHBlY3RlZCAje3RoaXN9IHRvIHN0cmljdGx5IGVxdWFsICN7ZXhwfScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3Qgc3RyaWN0bHkgZXF1YWwgI3tleHB9JyxcbiAgICAgIGV4cGVjdGVkLFxuICAgICAgb2JqLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b0JlJywgZnVuY3Rpb24oZXhwZWN0ZWQpIHtcbiAgICBjb25zdCBhY3R1YWwgPSB0aGlzLl9vYmpcbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBPYmplY3QuaXMoYWN0dWFsLCBleHBlY3RlZCksXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBiZSAje2V4cH0gLy8gT2JqZWN0LmlzIGVxdWFsaXR5JyxcbiAgICAgICdleHBlY3RlZCAje3RoaXN9IG5vdCB0byBiZSAje2V4cH0gLy8gT2JqZWN0LmlzIGVxdWFsaXR5JyxcbiAgICAgIGV4cGVjdGVkLFxuICAgICAgYWN0dWFsLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b01hdGNoT2JqZWN0JywgZnVuY3Rpb24oZXhwZWN0ZWQpIHtcbiAgICBjb25zdCBhY3R1YWwgPSB0aGlzLl9vYmpcbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBqZXN0RXF1YWxzKGFjdHVhbCwgZXhwZWN0ZWQsIFtpdGVyYWJsZUVxdWFsaXR5LCBzdWJzZXRFcXVhbGl0eV0pLFxuICAgICAgJ2V4cGVjdGVkICN7dGhpc30gdG8gbWF0Y2ggb2JqZWN0ICN7ZXhwfScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgbWF0Y2ggb2JqZWN0ICN7ZXhwfScsXG4gICAgICBleHBlY3RlZCxcbiAgICAgIGFjdHVhbCxcbiAgICApXG4gIH0pXG4gIGRlZigndG9NYXRjaCcsIGZ1bmN0aW9uKGV4cGVjdGVkOiBzdHJpbmcgfCBSZWdFeHApIHtcbiAgICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJylcbiAgICAgIHJldHVybiB0aGlzLmluY2x1ZGUoZXhwZWN0ZWQpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMubWF0Y2goZXhwZWN0ZWQpXG4gIH0pXG4gIGRlZigndG9Db250YWluJywgZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW4oaXRlbSlcbiAgfSlcbiAgZGVmKCd0b0NvbnRhaW5FcXVhbCcsIGZ1bmN0aW9uKGV4cGVjdGVkKSB7XG4gICAgY29uc3Qgb2JqID0gdXRpbHMuZmxhZyh0aGlzLCAnb2JqZWN0JylcbiAgICBjb25zdCBpbmRleCA9IEFycmF5LmZyb20ob2JqKS5maW5kSW5kZXgoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBqZXN0RXF1YWxzKGl0ZW0sIGV4cGVjdGVkKVxuICAgIH0pXG5cbiAgICB0aGlzLmFzc2VydChcbiAgICAgIGluZGV4ICE9PSAtMSxcbiAgICAgICdleHBlY3RlZCAje3RoaXN9IHRvIGRlZXAgZXF1YWxseSBjb250YWluICN7ZXhwfScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgZGVlcCBlcXVhbGx5IGNvbnRhaW4gI3tleHB9JyxcbiAgICAgIGV4cGVjdGVkLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b0JlVHJ1dGh5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb2JqID0gdXRpbHMuZmxhZyh0aGlzLCAnb2JqZWN0JylcbiAgICB0aGlzLmFzc2VydChcbiAgICAgIEJvb2xlYW4ob2JqKSxcbiAgICAgICdleHBlY3RlZCAje3RoaXN9IHRvIGJlIHRydXRoeScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgYmUgdHJ1dGh5JyxcbiAgICAgIG9iaixcbiAgICApXG4gIH0pXG4gIGRlZigndG9CZUZhbHN5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb2JqID0gdXRpbHMuZmxhZyh0aGlzLCAnb2JqZWN0JylcbiAgICB0aGlzLmFzc2VydChcbiAgICAgICFvYmosXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBiZSBmYWxzeScsXG4gICAgICAnZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgYmUgZmFsc3knLFxuICAgICAgb2JqLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b0JlR3JlYXRlclRoYW4nLCBmdW5jdGlvbihleHBlY3RlZDogbnVtYmVyIHwgYmlnaW50KSB7XG4gICAgY29uc3QgYWN0dWFsID0gdGhpcy5fb2JqXG4gICAgYXNzZXJ0VHlwZXMoYWN0dWFsLCAnYWN0dWFsJywgWydudW1iZXInLCAnYmlnaW50J10pXG4gICAgYXNzZXJ0VHlwZXMoZXhwZWN0ZWQsICdleHBlY3RlZCcsIFsnbnVtYmVyJywgJ2JpZ2ludCddKVxuICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgIGFjdHVhbCA+IGV4cGVjdGVkLFxuICAgICAgYGV4cGVjdGVkICR7YWN0dWFsfSB0byBiZSBncmVhdGVyIHRoYW4gJHtleHBlY3RlZH1gLFxuICAgICAgYGV4cGVjdGVkICR7YWN0dWFsfSB0byBiZSBub3QgZ3JlYXRlciB0aGFuICR7ZXhwZWN0ZWR9YCxcbiAgICAgIGFjdHVhbCxcbiAgICAgIGV4cGVjdGVkLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b0JlR3JlYXRlclRoYW5PckVxdWFsJywgZnVuY3Rpb24oZXhwZWN0ZWQ6IG51bWJlciB8IGJpZ2ludCkge1xuICAgIGNvbnN0IGFjdHVhbCA9IHRoaXMuX29ialxuICAgIGFzc2VydFR5cGVzKGFjdHVhbCwgJ2FjdHVhbCcsIFsnbnVtYmVyJywgJ2JpZ2ludCddKVxuICAgIGFzc2VydFR5cGVzKGV4cGVjdGVkLCAnZXhwZWN0ZWQnLCBbJ251bWJlcicsICdiaWdpbnQnXSlcbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBhY3R1YWwgPj0gZXhwZWN0ZWQsXG4gICAgICBgZXhwZWN0ZWQgJHthY3R1YWx9IHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke2V4cGVjdGVkfWAsXG4gICAgICBgZXhwZWN0ZWQgJHthY3R1YWx9IHRvIGJlIG5vdCBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtleHBlY3RlZH1gLFxuICAgICAgYWN0dWFsLFxuICAgICAgZXhwZWN0ZWQsXG4gICAgKVxuICB9KVxuICBkZWYoJ3RvQmVMZXNzVGhhbicsIGZ1bmN0aW9uKGV4cGVjdGVkOiBudW1iZXIgfCBiaWdpbnQpIHtcbiAgICBjb25zdCBhY3R1YWwgPSB0aGlzLl9vYmpcbiAgICBhc3NlcnRUeXBlcyhhY3R1YWwsICdhY3R1YWwnLCBbJ251bWJlcicsICdiaWdpbnQnXSlcbiAgICBhc3NlcnRUeXBlcyhleHBlY3RlZCwgJ2V4cGVjdGVkJywgWydudW1iZXInLCAnYmlnaW50J10pXG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KFxuICAgICAgYWN0dWFsIDwgZXhwZWN0ZWQsXG4gICAgICBgZXhwZWN0ZWQgJHthY3R1YWx9IHRvIGJlIGxlc3MgdGhhbiAke2V4cGVjdGVkfWAsXG4gICAgICBgZXhwZWN0ZWQgJHthY3R1YWx9IHRvIGJlIG5vdCBsZXNzIHRoYW4gJHtleHBlY3RlZH1gLFxuICAgICAgYWN0dWFsLFxuICAgICAgZXhwZWN0ZWQsXG4gICAgKVxuICB9KVxuICBkZWYoJ3RvQmVMZXNzVGhhbk9yRXF1YWwnLCBmdW5jdGlvbihleHBlY3RlZDogbnVtYmVyIHwgYmlnaW50KSB7XG4gICAgY29uc3QgYWN0dWFsID0gdGhpcy5fb2JqXG4gICAgYXNzZXJ0VHlwZXMoYWN0dWFsLCAnYWN0dWFsJywgWydudW1iZXInLCAnYmlnaW50J10pXG4gICAgYXNzZXJ0VHlwZXMoZXhwZWN0ZWQsICdleHBlY3RlZCcsIFsnbnVtYmVyJywgJ2JpZ2ludCddKVxuICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgIGFjdHVhbCA8PSBleHBlY3RlZCxcbiAgICAgIGBleHBlY3RlZCAke2FjdHVhbH0gdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvICR7ZXhwZWN0ZWR9YCxcbiAgICAgIGBleHBlY3RlZCAke2FjdHVhbH0gdG8gYmUgbm90IGxlc3MgdGhhbiBvciBlcXVhbCB0byAke2V4cGVjdGVkfWAsXG4gICAgICBhY3R1YWwsXG4gICAgICBleHBlY3RlZCxcbiAgICApXG4gIH0pXG4gIGRlZigndG9CZU5hTicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmJlLk5hTlxuICB9KVxuICBkZWYoJ3RvQmVVbmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5iZS51bmRlZmluZWRcbiAgfSlcbiAgZGVmKCd0b0JlTnVsbCcsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmJlLm51bGxcbiAgfSlcbiAgZGVmKCd0b0JlRGVmaW5lZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5lZ2F0ZSA9IHV0aWxzLmZsYWcodGhpcywgJ25lZ2F0ZScpXG4gICAgdXRpbHMuZmxhZyh0aGlzLCAnbmVnYXRlJywgZmFsc2UpXG5cbiAgICBpZiAobmVnYXRlKVxuICAgICAgcmV0dXJuIHRoaXMuYmUudW5kZWZpbmVkXG5cbiAgICByZXR1cm4gdGhpcy5ub3QuYmUudW5kZWZpbmVkXG4gIH0pXG4gIGRlZigndG9CZVR5cGVPZicsIGZ1bmN0aW9uKGV4cGVjdGVkOiAnYmlnaW50JyB8ICdib29sZWFuJyB8ICdmdW5jdGlvbicgfCAnbnVtYmVyJyB8ICdvYmplY3QnIHwgJ3N0cmluZycgfCAnc3ltYm9sJyB8ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgYWN0dWFsID0gdHlwZW9mIHRoaXMuX29ialxuICAgIGNvbnN0IGVxdWFsID0gZXhwZWN0ZWQgPT09IGFjdHVhbFxuICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgIGVxdWFsLFxuICAgICAgJ2V4cGVjdGVkICN7dGhpc30gdG8gYmUgdHlwZSBvZiAje2V4cH0nLFxuICAgICAgJ2V4cGVjdGVkICN7dGhpc30gbm90IHRvIGJlIHR5cGUgb2YgI3tleHB9JyxcbiAgICAgIGV4cGVjdGVkLFxuICAgICAgYWN0dWFsLFxuICAgIClcbiAgfSlcbiAgZGVmKCd0b0JlSW5zdGFuY2VPZicsIGZ1bmN0aW9uKG9iajogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VPZihvYmopXG4gIH0pXG4gIGRlZigndG9IYXZlTGVuZ3RoJywgZnVuY3Rpb24obGVuZ3RoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5oYXZlLmxlbmd0aChsZW5ndGgpXG4gIH0pXG4gIC8vIGRlc3RydWN0dXJpbmcsIGJlY2F1c2UgaXQgY2hlY2tzIGBhcmd1bWVudHNgIGluc2lkZSwgYW5kIHZhbHVlIGlzIHBhc3NpbmcgYXMgYHVuZGVmaW5lZGBcbiAgZGVmKCd0b0hhdmVQcm9wZXJ0eScsIGZ1bmN0aW9uKC4uLmFyZ3M6IFtwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT86IGFueV0pIHtcbiAgICByZXR1cm4gdGhpcy5oYXZlLmRlZXAubmVzdGVkLnByb3BlcnR5KC4uLmFyZ3MpXG4gIH0pXG4gIGRlZigndG9CZUNsb3NlVG8nLCBmdW5jdGlvbihyZWNlaXZlZDogbnVtYmVyLCBwcmVjaXNpb24gPSAyKSB7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLl9vYmpcbiAgICBsZXQgcGFzcyA9IGZhbHNlXG4gICAgbGV0IGV4cGVjdGVkRGlmZiA9IDBcbiAgICBsZXQgcmVjZWl2ZWREaWZmID0gMFxuXG4gICAgaWYgKHJlY2VpdmVkID09PSBJbmZpbml0eSAmJiBleHBlY3RlZCA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHBhc3MgPSB0cnVlXG4gICAgfVxuICAgIGVsc2UgaWYgKHJlY2VpdmVkID09PSAtSW5maW5pdHkgJiYgZXhwZWN0ZWQgPT09IC1JbmZpbml0eSkge1xuICAgICAgcGFzcyA9IHRydWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBleHBlY3RlZERpZmYgPSBNYXRoLnBvdygxMCwgLXByZWNpc2lvbikgLyAyXG4gICAgICByZWNlaXZlZERpZmYgPSBNYXRoLmFicyhleHBlY3RlZCAtIHJlY2VpdmVkKVxuICAgICAgcGFzcyA9IHJlY2VpdmVkRGlmZiA8IGV4cGVjdGVkRGlmZlxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBwYXNzLFxuICAgICAgYGV4cGVjdGVkICN7dGhpc30gdG8gYmUgY2xvc2UgdG8gI3tleHB9LCByZWNlaXZlZCBkaWZmZXJlbmNlIGlzICR7cmVjZWl2ZWREaWZmfSwgYnV0IGV4cGVjdGVkICR7ZXhwZWN0ZWREaWZmfWAsXG4gICAgICBgZXhwZWN0ZWQgI3t0aGlzfSB0byBub3QgYmUgY2xvc2UgdG8gI3tleHB9LCByZWNlaXZlZCBkaWZmZXJlbmNlIGlzICR7cmVjZWl2ZWREaWZmfSwgYnV0IGV4cGVjdGVkICR7ZXhwZWN0ZWREaWZmfWAsXG4gICAgICByZWNlaXZlZCxcbiAgICAgIGV4cGVjdGVkLFxuICAgIClcbiAgfSlcblxuICBjb25zdCBhc3NlcnRJc01vY2sgPSAoYXNzZXJ0aW9uOiBhbnkpID0+IHtcbiAgICBpZiAoIWlzTW9ja0Z1bmN0aW9uKGFzc2VydGlvbi5fb2JqKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7dXRpbHMuaW5zcGVjdChhc3NlcnRpb24uX29iail9IGlzIG5vdCBhIHNweSBvciBhIGNhbGwgdG8gYSBzcHkhYClcbiAgfVxuICBjb25zdCBnZXRTcHkgPSAoYXNzZXJ0aW9uOiBhbnkpID0+IHtcbiAgICBhc3NlcnRJc01vY2soYXNzZXJ0aW9uKVxuICAgIHJldHVybiBhc3NlcnRpb24uX29iaiBhcyBFbmhhbmNlZFNweVxuICB9XG4gIGRlZihbJ3RvSGF2ZUJlZW5DYWxsZWRUaW1lcycsICd0b0JlQ2FsbGVkVGltZXMnXSwgZnVuY3Rpb24obnVtYmVyOiBudW1iZXIpIHtcbiAgICBjb25zdCBzcHkgPSBnZXRTcHkodGhpcylcbiAgICBjb25zdCBzcHlOYW1lID0gc3B5LmdldE1vY2tOYW1lKClcbiAgICBjb25zdCBjYWxsQ291bnQgPSBzcHkubW9jay5jYWxscy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICBjYWxsQ291bnQgPT09IG51bWJlcixcbiAgICAgIGBleHBlY3RlZCBcIiR7c3B5TmFtZX1cIiB0byBiZSBjYWxsZWQgI3tleHB9IHRpbWVzYCxcbiAgICAgIGBleHBlY3RlZCBcIiR7c3B5TmFtZX1cIiB0byBub3QgYmUgY2FsbGVkICN7ZXhwfSB0aW1lc2AsXG4gICAgICBudW1iZXIsXG4gICAgICBjYWxsQ291bnQsXG4gICAgKVxuICB9KVxuICBkZWYoJ3RvSGF2ZUJlZW5DYWxsZWRPbmNlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3B5ID0gZ2V0U3B5KHRoaXMpXG4gICAgY29uc3Qgc3B5TmFtZSA9IHNweS5nZXRNb2NrTmFtZSgpXG4gICAgY29uc3QgY2FsbENvdW50ID0gc3B5Lm1vY2suY2FsbHMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KFxuICAgICAgY2FsbENvdW50ID09PSAxLFxuICAgICAgYGV4cGVjdGVkIFwiJHtzcHlOYW1lfVwiIHRvIGJlIGNhbGxlZCBvbmNlYCxcbiAgICAgIGBleHBlY3RlZCBcIiR7c3B5TmFtZX1cIiB0byBub3QgYmUgY2FsbGVkIG9uY2VgLFxuICAgICAgMSxcbiAgICAgIGNhbGxDb3VudCxcbiAgICApXG4gIH0pXG4gIGRlZihbJ3RvSGF2ZUJlZW5DYWxsZWQnLCAndG9CZUNhbGxlZCddLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcHkgPSBnZXRTcHkodGhpcylcbiAgICBjb25zdCBzcHlOYW1lID0gc3B5LmdldE1vY2tOYW1lKClcbiAgICBjb25zdCBjYWxsZWQgPSBzcHkubW9jay5jYWxscy5sZW5ndGggPiAwXG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KFxuICAgICAgY2FsbGVkLFxuICAgICAgYGV4cGVjdGVkIFwiJHtzcHlOYW1lfVwiIHRvIGJlIGNhbGxlZCBhdCBsZWFzdCBvbmNlYCxcbiAgICAgIGBleHBlY3RlZCBcIiR7c3B5TmFtZX1cIiB0byBub3QgYmUgY2FsbGVkIGF0IGFsbGAsXG4gICAgICB0cnVlLFxuICAgICAgY2FsbGVkLFxuICAgIClcbiAgfSlcbiAgZGVmKFsndG9IYXZlQmVlbkNhbGxlZFdpdGgnLCAndG9CZUNhbGxlZFdpdGgnXSwgZnVuY3Rpb24oLi4uYXJncykge1xuICAgIGNvbnN0IHNweSA9IGdldFNweSh0aGlzKVxuICAgIGNvbnN0IHNweU5hbWUgPSBzcHkuZ2V0TW9ja05hbWUoKVxuICAgIGNvbnN0IHBhc3MgPSBzcHkubW9jay5jYWxscy5zb21lKGNhbGxBcmcgPT4gamVzdEVxdWFscyhjYWxsQXJnLCBhcmdzLCBbaXRlcmFibGVFcXVhbGl0eV0pKVxuICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgIHBhc3MsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gYmUgY2FsbGVkIHdpdGggYXJndW1lbnRzOiAje2V4cH1gLFxuICAgICAgYGV4cGVjdGVkIFwiJHtzcHlOYW1lfVwiIHRvIG5vdCBiZSBjYWxsZWQgd2l0aCBhcmd1bWVudHM6ICN7ZXhwfWAsXG4gICAgICBhcmdzLFxuICAgICAgc3B5Lm1vY2suY2FsbHMsXG4gICAgKVxuICB9KVxuICBjb25zdCBvcmRpbmFsT2YgPSAoaTogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgaiA9IGkgJSAxMFxuICAgIGNvbnN0IGsgPSBpICUgMTAwXG5cbiAgICBpZiAoaiA9PT0gMSAmJiBrICE9PSAxMSlcbiAgICAgIHJldHVybiBgJHtpfXN0YFxuXG4gICAgaWYgKGogPT09IDIgJiYgayAhPT0gMTIpXG4gICAgICByZXR1cm4gYCR7aX1uZGBcblxuICAgIGlmIChqID09PSAzICYmIGsgIT09IDEzKVxuICAgICAgcmV0dXJuIGAke2l9cmRgXG5cbiAgICByZXR1cm4gYCR7aX10aGBcbiAgfVxuICBkZWYoWyd0b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCcsICdudGhDYWxsZWRXaXRoJ10sIGZ1bmN0aW9uKHRpbWVzOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3Qgc3B5ID0gZ2V0U3B5KHRoaXMpXG4gICAgY29uc3Qgc3B5TmFtZSA9IHNweS5nZXRNb2NrTmFtZSgpXG4gICAgY29uc3QgbnRoQ2FsbCA9IHNweS5tb2NrLmNhbGxzW3RpbWVzIC0gMV1cblxuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgamVzdEVxdWFscyhudGhDYWxsLCBhcmdzLCBbaXRlcmFibGVFcXVhbGl0eV0pLFxuICAgICAgYGV4cGVjdGVkICR7b3JkaW5hbE9mKHRpbWVzKX0gXCIke3NweU5hbWV9XCIgY2FsbCB0byBoYXZlIGJlZW4gY2FsbGVkIHdpdGggI3tleHB9YCxcbiAgICAgIGBleHBlY3RlZCAke29yZGluYWxPZih0aW1lcyl9IFwiJHtzcHlOYW1lfVwiIGNhbGwgdG8gbm90IGhhdmUgYmVlbiBjYWxsZWQgd2l0aCAje2V4cH1gLFxuICAgICAgYXJncyxcbiAgICAgIG50aENhbGwsXG4gICAgKVxuICB9KVxuICBkZWYoWyd0b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgnLCAnbGFzdENhbGxlZFdpdGgnXSwgZnVuY3Rpb24oLi4uYXJnczogYW55W10pIHtcbiAgICBjb25zdCBzcHkgPSBnZXRTcHkodGhpcylcbiAgICBjb25zdCBzcHlOYW1lID0gc3B5LmdldE1vY2tOYW1lKClcbiAgICBjb25zdCBsYXN0Q2FsbCA9IHNweS5tb2NrLmNhbGxzW3NweS5jYWxscy5sZW5ndGggLSAxXVxuXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICBqZXN0RXF1YWxzKGxhc3RDYWxsLCBhcmdzLCBbaXRlcmFibGVFcXVhbGl0eV0pLFxuICAgICAgYGV4cGVjdGVkIGxhc3QgXCIke3NweU5hbWV9XCIgY2FsbCB0byBoYXZlIGJlZW4gY2FsbGVkIHdpdGggI3tleHB9YCxcbiAgICAgIGBleHBlY3RlZCBsYXN0IFwiJHtzcHlOYW1lfVwiIGNhbGwgdG8gbm90IGhhdmUgYmVlbiBjYWxsZWQgd2l0aCAje2V4cH1gLFxuICAgICAgYXJncyxcbiAgICAgIGxhc3RDYWxsLFxuICAgIClcbiAgfSlcbiAgZGVmKFsndG9UaHJvdycsICd0b1Rocm93RXJyb3InXSwgZnVuY3Rpb24oZXhwZWN0ZWQ/OiBzdHJpbmcgfCBDb25zdHJ1Y3RhYmxlIHwgUmVnRXhwIHwgRXJyb3IpIHtcbiAgICBjb25zdCBvYmogPSB0aGlzLl9vYmpcbiAgICBjb25zdCBwcm9taXNlID0gdXRpbHMuZmxhZyh0aGlzLCAncHJvbWlzZScpXG4gICAgbGV0IHRocm93bjogYW55ID0gbnVsbFxuXG4gICAgaWYgKHByb21pc2UpIHtcbiAgICAgIHRocm93biA9IG9ialxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG9iaigpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93biA9IGVyclxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG5hbWUgPSBleHBlY3RlZC5uYW1lIHx8IGV4cGVjdGVkLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICAgIHRocm93biAmJiB0aHJvd24gaW5zdGFuY2VvZiBleHBlY3RlZCxcbiAgICAgICAgYGV4cGVjdGVkIGVycm9yIHRvIGJlIGluc3RhbmNlIG9mICR7bmFtZX1gLFxuICAgICAgICBgZXhwZWN0ZWQgZXJyb3Igbm90IHRvIGJlIGluc3RhbmNlIG9mICR7bmFtZX1gLFxuICAgICAgICBleHBlY3RlZCxcbiAgICAgICAgdGhyb3duLFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChleHBlY3RlZCAmJiBleHBlY3RlZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5hc3NlcnQoXG4gICAgICAgIHRocm93biAmJiBleHBlY3RlZC5tZXNzYWdlID09PSB0aHJvd24ubWVzc2FnZSxcbiAgICAgICAgYGV4cGVjdGVkIGVycm9yIHRvIGhhdmUgbWVzc2FnZTogJHtleHBlY3RlZC5tZXNzYWdlfWAsXG4gICAgICAgIGBleHBlY3RlZCBlcnJvciBub3QgdG8gaGF2ZSBtZXNzYWdlOiAke2V4cGVjdGVkLm1lc3NhZ2V9YCxcbiAgICAgICAgZXhwZWN0ZWQubWVzc2FnZSxcbiAgICAgICAgdGhyb3duICYmIHRocm93bi5tZXNzYWdlLFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChleHBlY3RlZCAmJiB0eXBlb2YgKGV4cGVjdGVkIGFzIGFueSkuYXN5bW1ldHJpY01hdGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBtYXRjaGVyID0gZXhwZWN0ZWQgYXMgYW55IGFzIEFzeW1tZXRyaWNNYXRjaGVyPGFueT5cbiAgICAgIHJldHVybiB0aGlzLmFzc2VydChcbiAgICAgICAgdGhyb3duICYmIG1hdGNoZXIuYXN5bW1ldHJpY01hdGNoKHRocm93biksXG4gICAgICAgICdleHBlY3RlZCBlcnJvciB0byBtYXRjaCBhc3ltbWV0cmljIG1hdGNoZXInLFxuICAgICAgICAnZXhwZWN0ZWQgZXJyb3Igbm90IHRvIG1hdGNoIGFzeW1tZXRyaWMgbWF0Y2hlcicsXG4gICAgICAgIG1hdGNoZXIudG9TdHJpbmcoKSxcbiAgICAgICAgdGhyb3duLFxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnRvLnRocm93cyhleHBlY3RlZClcbiAgfSlcbiAgZGVmKFsndG9IYXZlUmV0dXJuZWQnLCAndG9SZXR1cm4nXSwgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3B5ID0gZ2V0U3B5KHRoaXMpXG4gICAgY29uc3Qgc3B5TmFtZSA9IHNweS5nZXRNb2NrTmFtZSgpXG4gICAgY29uc3QgY2FsbGVkQW5kTm90VGhyZXcgPSBzcHkubW9jay5jYWxscy5sZW5ndGggPiAwICYmICFzcHkubW9jay5yZXN1bHRzLnNvbWUoKHsgdHlwZSB9KSA9PiB0eXBlID09PSAndGhyb3cnKVxuICAgIHRoaXMuYXNzZXJ0KFxuICAgICAgY2FsbGVkQW5kTm90VGhyZXcsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gYmUgc3VjY2Vzc2Z1bGx5IGNhbGxlZCBhdCBsZWFzdCBvbmNlYCxcbiAgICAgIGBleHBlY3RlZCBcIiR7c3B5TmFtZX1cIiB0byBub3QgYmUgc3VjY2Vzc2Z1bGx5IGNhbGxlZGAsXG4gICAgICBjYWxsZWRBbmROb3RUaHJldyxcbiAgICAgICFjYWxsZWRBbmROb3RUaHJldyxcbiAgICApXG4gIH0pXG4gIGRlZihbJ3RvSGF2ZVJldHVybmVkVGltZXMnLCAndG9SZXR1cm5UaW1lcyddLCBmdW5jdGlvbih0aW1lczogbnVtYmVyKSB7XG4gICAgY29uc3Qgc3B5ID0gZ2V0U3B5KHRoaXMpXG4gICAgY29uc3Qgc3B5TmFtZSA9IHNweS5nZXRNb2NrTmFtZSgpXG4gICAgY29uc3Qgc3VjY2Vzc2Z1bGxSZXR1cm5zID0gc3B5Lm1vY2sucmVzdWx0cy5yZWR1Y2UoKHN1Y2Nlc3MsIHsgdHlwZSB9KSA9PiB0eXBlID09PSAndGhyb3cnID8gc3VjY2VzcyA6ICsrc3VjY2VzcywgMClcbiAgICB0aGlzLmFzc2VydChcbiAgICAgIHN1Y2Nlc3NmdWxsUmV0dXJucyA9PT0gdGltZXMsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gYmUgc3VjY2Vzc2Z1bGx5IGNhbGxlZCAke3RpbWVzfSB0aW1lc2AsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gbm90IGJlIHN1Y2Nlc3NmdWxseSBjYWxsZWQgJHt0aW1lc30gdGltZXNgLFxuICAgICAgYGV4cGVjdGVkIG51bWJlciBvZiByZXR1cm5zOiAke3RpbWVzfWAsXG4gICAgICBgcmVjZWl2ZWQgbnVtYmVyIG9mIHJldHVybnM6ICR7c3VjY2Vzc2Z1bGxSZXR1cm5zfWAsXG4gICAgKVxuICB9KVxuICBkZWYoWyd0b0hhdmVSZXR1cm5lZFdpdGgnLCAndG9SZXR1cm5XaXRoJ10sIGZ1bmN0aW9uKHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBzcHkgPSBnZXRTcHkodGhpcylcbiAgICBjb25zdCBzcHlOYW1lID0gc3B5LmdldE1vY2tOYW1lKClcbiAgICBjb25zdCBwYXNzID0gc3B5Lm1vY2sucmVzdWx0cy5zb21lKCh7IHR5cGUsIHZhbHVlOiByZXN1bHQgfSkgPT4gdHlwZSA9PT0gJ3JldHVybicgJiYgamVzdEVxdWFscyh2YWx1ZSwgcmVzdWx0KSlcbiAgICB0aGlzLmFzc2VydChcbiAgICAgIHBhc3MsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gYmUgc3VjY2Vzc2Z1bGx5IGNhbGxlZCB3aXRoICN7ZXhwfWAsXG4gICAgICBgZXhwZWN0ZWQgXCIke3NweU5hbWV9XCIgdG8gbm90IGJlIHN1Y2Nlc3NmdWxseSBjYWxsZWQgd2l0aCAje2V4cH1gLFxuICAgICAgdmFsdWUsXG4gICAgKVxuICB9KVxuICBkZWYoWyd0b0hhdmVMYXN0UmV0dXJuZWRXaXRoJywgJ2xhc3RSZXR1cm5lZFdpdGgnXSwgZnVuY3Rpb24odmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHNweSA9IGdldFNweSh0aGlzKVxuICAgIGNvbnN0IHNweU5hbWUgPSBzcHkuZ2V0TW9ja05hbWUoKVxuICAgIGNvbnN0IHsgdmFsdWU6IGxhc3RSZXN1bHQgfSA9IHNweS5tb2NrLnJlc3VsdHNbc3B5LnJldHVybnMubGVuZ3RoIC0gMV1cbiAgICBjb25zdCBwYXNzID0gamVzdEVxdWFscyhsYXN0UmVzdWx0LCB2YWx1ZSlcbiAgICB0aGlzLmFzc2VydChcbiAgICAgIHBhc3MsXG4gICAgICBgZXhwZWN0ZWQgbGFzdCBcIiR7c3B5TmFtZX1cIiBjYWxsIHRvIHJldHVybiAje2V4cH1gLFxuICAgICAgYGV4cGVjdGVkIGxhc3QgXCIke3NweU5hbWV9XCIgY2FsbCB0byBub3QgcmV0dXJuICN7ZXhwfWAsXG4gICAgICB2YWx1ZSxcbiAgICAgIGxhc3RSZXN1bHQsXG4gICAgKVxuICB9KVxuICBkZWYoWyd0b0hhdmVOdGhSZXR1cm5lZFdpdGgnLCAnbnRoUmV0dXJuZWRXaXRoJ10sIGZ1bmN0aW9uKG50aENhbGw6IG51bWJlciwgdmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHNweSA9IGdldFNweSh0aGlzKVxuICAgIGNvbnN0IHNweU5hbWUgPSBzcHkuZ2V0TW9ja05hbWUoKVxuICAgIGNvbnN0IGlzTm90ID0gdXRpbHMuZmxhZyh0aGlzLCAnbmVnYXRlJykgYXMgYm9vbGVhblxuICAgIGNvbnN0IHsgdHlwZTogY2FsbFR5cGUsIHZhbHVlOiBjYWxsUmVzdWx0IH0gPSBzcHkubW9jay5yZXN1bHRzW250aENhbGwgLSAxXVxuICAgIGNvbnN0IG9yZGluYWxDYWxsID0gYCR7b3JkaW5hbE9mKG50aENhbGwpfSBjYWxsYFxuXG4gICAgaWYgKCFpc05vdCAmJiBjYWxsVHlwZSA9PT0gJ3Rocm93JylcbiAgICAgIGNoYWkuYXNzZXJ0LmZhaWwoYGV4cGVjdGVkICR7b3JkaW5hbENhbGx9IHRvIHJldHVybiAje2V4cH0sIGJ1dCBpbnN0ZWFkIGl0IHRocmV3IGFuIGVycm9yYClcblxuICAgIGNvbnN0IG50aENhbGxSZXR1cm4gPSBqZXN0RXF1YWxzKGNhbGxSZXN1bHQsIHZhbHVlKVxuXG4gICAgdGhpcy5hc3NlcnQoXG4gICAgICBudGhDYWxsUmV0dXJuLFxuICAgICAgYGV4cGVjdGVkICR7b3JkaW5hbENhbGx9IFwiJHtzcHlOYW1lfVwiIGNhbGwgdG8gcmV0dXJuICN7ZXhwfWAsXG4gICAgICBgZXhwZWN0ZWQgJHtvcmRpbmFsQ2FsbH0gXCIke3NweU5hbWV9XCIgY2FsbCB0byBub3QgcmV0dXJuICN7ZXhwfWAsXG4gICAgICB2YWx1ZSxcbiAgICAgIGNhbGxSZXN1bHQsXG4gICAgKVxuICB9KVxuXG4gIHV0aWxzLmFkZFByb3BlcnR5KGNoYWkuQXNzZXJ0aW9uLnByb3RvdHlwZSwgJ3Jlc29sdmVzJywgZnVuY3Rpb24gX19WSVRFU1RfUkVTT0xWRVNfXyh0aGlzOiBhbnkpIHtcbiAgICB1dGlscy5mbGFnKHRoaXMsICdwcm9taXNlJywgJ3Jlc29sdmVzJylcbiAgICB1dGlscy5mbGFnKHRoaXMsICdlcnJvcicsIG5ldyBFcnJvcigncmVzb2x2ZXMnKSlcbiAgICBjb25zdCBvYmogPSB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnKVxuICAgIGNvbnN0IHByb3h5OiBhbnkgPSBuZXcgUHJveHkodGhpcywge1xuICAgICAgZ2V0OiAodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcilcblxuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICByZXR1cm4gcmVzdWx0IGluc3RhbmNlb2YgY2hhaS5Bc3NlcnRpb24gPyBwcm94eSA6IHJlc3VsdFxuXG4gICAgICAgIHJldHVybiBhc3luYyguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgIHJldHVybiBvYmoudGhlbihcbiAgICAgICAgICAgICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcsIHZhbHVlKVxuICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgLi4uYXJncylcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBwcm9taXNlIHJlamVjdGVkIFwiJHtlcnJ9XCIgaW5zdGVhZCBvZiByZXNvbHZpbmdgKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSlcblxuICAgIHJldHVybiBwcm94eVxuICB9KVxuXG4gIHV0aWxzLmFkZFByb3BlcnR5KGNoYWkuQXNzZXJ0aW9uLnByb3RvdHlwZSwgJ3JlamVjdHMnLCBmdW5jdGlvbiBfX1ZJVEVTVF9SRUpFQ1RTX18odGhpczogYW55KSB7XG4gICAgdXRpbHMuZmxhZyh0aGlzLCAncHJvbWlzZScsICdyZWplY3RzJylcbiAgICB1dGlscy5mbGFnKHRoaXMsICdlcnJvcicsIG5ldyBFcnJvcigncmVqZWN0cycpKVxuICAgIGNvbnN0IG9iaiA9IHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcpXG4gICAgY29uc3Qgd3JhcHBlciA9IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicgPyBvYmooKSA6IG9iaiAvLyBmb3IgamVzdCBjb21wYXRcbiAgICBjb25zdCBwcm94eTogYW55ID0gbmV3IFByb3h5KHRoaXMsIHtcbiAgICAgIGdldDogKHRhcmdldCwga2V5LCByZWNlaXZlcikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdCBpbnN0YW5jZW9mIGNoYWkuQXNzZXJ0aW9uID8gcHJveHkgOiByZXN1bHRcblxuICAgICAgICByZXR1cm4gYXN5bmMoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICByZXR1cm4gd3JhcHBlci50aGVuKFxuICAgICAgICAgICAgKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBwcm9taXNlIHJlc29sdmVkIFwiJHt2YWx1ZX1cIiBpbnN0ZWFkIG9mIHJlamVjdGluZ2ApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycjogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcsIGVycilcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHByb3h5XG4gIH0pXG5cbiAgdXRpbHMuYWRkTWV0aG9kKFxuICAgIGNoYWkuZXhwZWN0LFxuICAgICdhc3NlcnRpb25zJyxcbiAgICBmdW5jdGlvbiBhc3NlcnRpb25zKGV4cGVjdGVkOiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBleHBlY3RlZCBudW1iZXIgb2YgYXNzZXJ0aW9ucyB0byBiZSAke2V4cGVjdGVkfSwgYnV0IGdvdCAke2dldFN0YXRlKCkuYXNzZXJ0aW9uQ2FsbHN9YClcbiAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoZXJyb3IsIGFzc2VydGlvbnMpXG5cbiAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgZXhwZWN0ZWRBc3NlcnRpb25zTnVtYmVyOiBleHBlY3RlZCxcbiAgICAgICAgZXhwZWN0ZWRBc3NlcnRpb25zTnVtYmVyRXJyb3I6IGVycm9yLFxuICAgICAgfSlcbiAgICB9LFxuICApXG5cbiAgdXRpbHMuYWRkTWV0aG9kKFxuICAgIGNoYWkuZXhwZWN0LFxuICAgICdoYXNBc3NlcnRpb25zJyxcbiAgICBmdW5jdGlvbiBoYXNBc3NlcnRpb25zKCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ2V4cGVjdGVkIGFueSBudW1iZXIgb2YgYXNzZXJ0aW9uLCBidXQgZ290IG5vbmUnKVxuICAgICAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKVxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShlcnJvciwgaGFzQXNzZXJ0aW9ucylcblxuICAgICAgc2V0U3RhdGUoe1xuICAgICAgICBpc0V4cGVjdGluZ0Fzc2VydGlvbnM6IHRydWUsXG4gICAgICAgIGlzRXhwZWN0aW5nQXNzZXJ0aW9uc0Vycm9yOiBlcnJvcixcbiAgICAgIH0pXG4gICAgfSxcbiAgKVxuXG4gIHV0aWxzLmFkZE1ldGhvZChcbiAgICBjaGFpLmV4cGVjdCxcbiAgICAnYWRkU25hcHNob3RTZXJpYWxpemVyJyxcbiAgICBhZGRTZXJpYWxpemVyLFxuICApXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdFxuICpcbiAqIEB0eXBlIHtvYmplY3R9IGdsb2JhbE9iamVjdFxuICovXG52YXIgZ2xvYmFsT2JqZWN0O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuaWYgKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAvLyBOb2RlXG4gICAgZ2xvYmFsT2JqZWN0ID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgLy8gQnJvd3NlclxuICAgIGdsb2JhbE9iamVjdCA9IHdpbmRvdztcbn0gZWxzZSB7XG4gICAgLy8gV2ViV29ya2VyXG4gICAgZ2xvYmFsT2JqZWN0ID0gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxPYmplY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNhbGwgPSBGdW5jdGlvbi5jYWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvcHlQcm90b3R5cGVNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc2lub25qcy9uby1wcm90b3R5cGUtbWV0aG9kcy9uby1wcm90b3R5cGUtbWV0aG9kc1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90b3R5cGUpLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIG5hbWUpIHtcbiAgICAgICAgLy8gaWdub3JlIHNpemUgYmVjYXVzZSBpdCB0aHJvd3MgZnJvbSBNYXBcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgbmFtZSAhPT0gXCJzaXplXCIgJiZcbiAgICAgICAgICAgIG5hbWUgIT09IFwiY2FsbGVyXCIgJiZcbiAgICAgICAgICAgIG5hbWUgIT09IFwiY2FsbGVlXCIgJiZcbiAgICAgICAgICAgIG5hbWUgIT09IFwiYXJndW1lbnRzXCIgJiZcbiAgICAgICAgICAgIHR5cGVvZiBwcm90b3R5cGVbbmFtZV0gPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNhbGwuYmluZChwcm90b3R5cGVbbmFtZV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCBPYmplY3QuY3JlYXRlKG51bGwpKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvcHlQcm90b3R5cGUgPSByZXF1aXJlKFwiLi9jb3B5LXByb3RvdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5UHJvdG90eXBlKEFycmF5LnByb3RvdHlwZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGV2ZXJ5ID0gcmVxdWlyZShcIi4vcHJvdG90eXBlcy9hcnJheVwiKS5ldmVyeTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBoYXNDYWxsc0xlZnQoY2FsbE1hcCwgc3B5KSB7XG4gICAgaWYgKGNhbGxNYXBbc3B5LmlkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNhbGxNYXBbc3B5LmlkXSA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGxNYXBbc3B5LmlkXSA8IHNweS5jYWxsQ291bnQ7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tBZGphY2VudENhbGxzKGNhbGxNYXAsIHNweSwgaW5kZXgsIHNwaWVzKSB7XG4gICAgdmFyIGNhbGxlZEJlZm9yZU5leHQgPSB0cnVlO1xuXG4gICAgaWYgKGluZGV4ICE9PSBzcGllcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNhbGxlZEJlZm9yZU5leHQgPSBzcHkuY2FsbGVkQmVmb3JlKHNwaWVzW2luZGV4ICsgMV0pO1xuICAgIH1cblxuICAgIGlmIChoYXNDYWxsc0xlZnQoY2FsbE1hcCwgc3B5KSAmJiBjYWxsZWRCZWZvcmVOZXh0KSB7XG4gICAgICAgIGNhbGxNYXBbc3B5LmlkXSArPSAxO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBTaW5vbiBwcm94eSBvYmplY3QgKGZha2UsIHNweSwgc3R1YilcbiAqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBTaW5vblByb3h5XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBjYWxsZWRCZWZvcmUgLSBBIG1ldGhvZCB0aGF0IGRldGVybWluZXMgaWYgdGhpcyBwcm94eSB3YXMgY2FsbGVkIGJlZm9yZSBhbm90aGVyIG9uZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIC0gU29tZSBpZFxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNhbGxDb3VudCAtIE51bWJlciBvZiB0aW1lcyB0aGlzIHByb3h5IGhhcyBiZWVuIGNhbGxlZFxuICovXG5cbi8qKlxuICogUmV0dXJucyB0cnVlIHdoZW4gdGhlIHNwaWVzIGhhdmUgYmVlbiBjYWxsZWQgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBzdXBwbGllZCBpblxuICpcbiAqIEBwYXJhbSAge1Npbm9uUHJveHlbXSB8IFNpbm9uUHJveHl9IHNwaWVzIEFuIGFycmF5IG9mIHByb3hpZXMsIG9yIHNldmVyYWwgcHJveGllcyBhcyBhcmd1bWVudHNcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIHdoZW4gc3BpZXMgYXJlIGNhbGxlZCBpbiBvcmRlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmZ1bmN0aW9uIGNhbGxlZEluT3JkZXIoc3BpZXMpIHtcbiAgICB2YXIgY2FsbE1hcCA9IHt9O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgIHZhciBfc3BpZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50cyA6IHNwaWVzO1xuXG4gICAgcmV0dXJuIGV2ZXJ5KF9zcGllcywgY2hlY2tBZGphY2VudENhbGxzLmJpbmQobnVsbCwgY2FsbE1hcCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbGxlZEluT3JkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZGlzcGxheSBuYW1lIGZvciBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IGZ1bmNcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZnVuY3Rpb25OYW1lKGZ1bmMpIHtcbiAgICBpZiAoIWZ1bmMpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGZ1bmMuZGlzcGxheU5hbWUgfHxcbiAgICAgICAgICAgIGZ1bmMubmFtZSB8fFxuICAgICAgICAgICAgLy8gVXNlIGZ1bmN0aW9uIGRlY29tcG9zaXRpb24gYXMgYSBsYXN0IHJlc29ydCB0byBnZXQgZnVuY3Rpb25cbiAgICAgICAgICAgIC8vIG5hbWUuIERvZXMgbm90IHJlbHkgb24gZnVuY3Rpb24gZGVjb21wb3NpdGlvbiB0byB3b3JrIC0gaWYgaXRcbiAgICAgICAgICAgIC8vIGRvZXNuJ3QgZGVidWdnaW5nIHdpbGwgYmUgc2xpZ2h0bHkgbGVzcyBpbmZvcm1hdGl2ZVxuICAgICAgICAgICAgLy8gKGkuZS4gdG9TdHJpbmcgd2lsbCBzYXkgJ3NweScgcmF0aGVyIHRoYW4gJ215RnVuYycpLlxuICAgICAgICAgICAgKFN0cmluZyhmdW5jKS5tYXRjaCgvZnVuY3Rpb24gKFteXFxzKF0rKS8pIHx8IFtdKVsxXVxuICAgICAgICApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU3RyaW5naWZ5IG1heSBmYWlsIGFuZCB3ZSBtaWdodCBnZXQgYW4gZXhjZXB0aW9uLCBhcyBhIGxhc3QtbGFzdFxuICAgICAgICAvLyByZXNvcnQgZmFsbCBiYWNrIHRvIGVtcHR5IHN0cmluZy5cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZnVuY3Rpb25OYW1lID0gcmVxdWlyZShcIi4vZnVuY3Rpb24tbmFtZVwiKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZGlzcGxheSBuYW1lIGZvciBhIHZhbHVlIGZyb20gYSBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdmFsdWUgQSB2YWx1ZSB0byBleGFtaW5lXG4gKiBAcmV0dXJucyB7KHN0cmluZ3xudWxsKX0gQSBzdHJpbmcgb3IgbnVsbFxuICovXG5mdW5jdGlvbiBjbGFzc05hbWUodmFsdWUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICAodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSkgfHxcbiAgICAgICAgLy8gVGhlIG5leHQgYnJhbmNoIGlzIGZvciBJRTExIHN1cHBvcnQgb25seTpcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgbmFtZSBwcm9wZXJ0eSBpcyBub3Qgc2V0IG9uIHRoZSBwcm90b3R5cGVcbiAgICAgICAgLy8gb2YgdGhlIEZ1bmN0aW9uIG9iamVjdCwgd2UgZmluYWxseSB0cnkgdG8gZ3JhYiB0aGVcbiAgICAgICAgLy8gbmFtZSBmcm9tIGl0cyBkZWZpbml0aW9uLiBUaGlzIHdpbGwgbmV2ZXIgYmUgcmVhY2hlZFxuICAgICAgICAvLyBpbiBub2RlLCBzbyB3ZSBhcmUgbm90IGFibGUgdG8gdGVzdCB0aGlzIHByb3Blcmx5LlxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9uYW1lXG4gICAgICAgICh0eXBlb2YgdmFsdWUuY29uc3RydWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZSh2YWx1ZS5jb25zdHJ1Y3RvcikpIHx8XG4gICAgICAgIG51bGxcbiAgICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgaW52b2tlIHRoZSBzdXBwbGllZCBmdW5jdGlvbiBhbmQgcHJpbnQgYVxuICogZGVwcmVjYXRpb24gd2FybmluZyB0byB0aGUgY29uc29sZSBlYWNoIHRpbWUgaXQgaXMgY2FsbGVkLlxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmdW5jXG4gKiBAcGFyYW0gIHtzdHJpbmd9IG1zZ1xuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5leHBvcnRzLndyYXAgPSBmdW5jdGlvbihmdW5jLCBtc2cpIHtcbiAgICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBleHBvcnRzLnByaW50V2FybmluZyhtc2cpO1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgaWYgKGZ1bmMucHJvdG90eXBlKSB7XG4gICAgICAgIHdyYXBwZWQucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVkO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHdoaWNoIGNhbiBiZSBzdXBwbGllZCB0byBgd3JhcCgpYCB0byBub3RpZnkgdGhlIHVzZXIgdGhhdCBhXG4gKiBwYXJ0aWN1bGFyIHBhcnQgb2YgdGhlIHNpbm9uIEFQSSBoYXMgYmVlbiBkZXByZWNhdGVkLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gcGFja2FnZU5hbWVcbiAqIEBwYXJhbSAge3N0cmluZ30gZnVuY05hbWVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdE1zZyA9IGZ1bmN0aW9uKHBhY2thZ2VOYW1lLCBmdW5jTmFtZSkge1xuICAgIHJldHVybiAoXG4gICAgICAgIHBhY2thZ2VOYW1lICtcbiAgICAgICAgXCIuXCIgK1xuICAgICAgICBmdW5jTmFtZSArXG4gICAgICAgIFwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBwdWJsaWMgQVBJIGluIGEgZnV0dXJlIHZlcnNpb24gb2YgXCIgK1xuICAgICAgICBwYWNrYWdlTmFtZSArXG4gICAgICAgIFwiLlwiXG4gICAgKTtcbn07XG5cbi8qKlxuICogUHJpbnRzIGEgd2FybmluZyBvbiB0aGUgY29uc29sZSwgd2hlbiBpdCBleGlzdHNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IG1zZ1xuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0cy5wcmludFdhcm5pbmcgPSBmdW5jdGlvbihtc2cpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLmVtaXRXYXJuaW5nKSB7XG4gICAgICAgIC8vIEVtaXQgV2FybmluZ3MgaW4gTm9kZVxuICAgICAgICBwcm9jZXNzLmVtaXRXYXJuaW5nKG1zZyk7XG4gICAgfSBlbHNlIGlmIChjb25zb2xlLmluZm8pIHtcbiAgICAgICAgY29uc29sZS5pbmZvKG1zZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIHdoZW4gZm4gcmV0dXJucyB0cnVlIGZvciBhbGwgbWVtYmVycyBvZiBvYmouXG4gKiBUaGlzIGlzIGFuIGV2ZXJ5IGltcGxlbWVudGF0aW9uIHRoYXQgd29ya3MgZm9yIGFsbCBpdGVyYWJsZXNcbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgb2JqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV2ZXJ5KG9iaiwgZm4pIHtcbiAgICB2YXIgcGFzcyA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHNpbm9uanMvbm8tcHJvdG90eXBlLW1ldGhvZHMvbm8tcHJvdG90eXBlLW1ldGhvZHNcbiAgICAgICAgb2JqLmZvckVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvd2luZyBhbiBlcnJvciBpcyB0aGUgb25seSB3YXkgdG8gYnJlYWsgYGZvckVhY2hgXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcGFzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBwYXNzO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc29ydCA9IHJlcXVpcmUoXCIuL3Byb3RvdHlwZXMvYXJyYXlcIikuc29ydDtcbnZhciBzbGljZSA9IHJlcXVpcmUoXCIuL3Byb3RvdHlwZXMvYXJyYXlcIikuc2xpY2U7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY29tcGFyYXRvcihhLCBiKSB7XG4gICAgLy8gdXVpZCwgd29uJ3QgZXZlciBiZSBlcXVhbFxuICAgIHZhciBhQ2FsbCA9IGEuZ2V0Q2FsbCgwKTtcbiAgICB2YXIgYkNhbGwgPSBiLmdldENhbGwoMCk7XG4gICAgdmFyIGFJZCA9IChhQ2FsbCAmJiBhQ2FsbC5jYWxsSWQpIHx8IC0xO1xuICAgIHZhciBiSWQgPSAoYkNhbGwgJiYgYkNhbGwuY2FsbElkKSB8fCAtMTtcblxuICAgIHJldHVybiBhSWQgPCBiSWQgPyAtMSA6IDE7XG59XG5cbi8qKlxuICogQSBTaW5vbiBwcm94eSBvYmplY3QgKGZha2UsIHNweSwgc3R1YilcbiAqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBTaW5vblByb3h5XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBnZXRDYWxsIC0gQSBtZXRob2QgdGhhdCBjYW4gcmV0dXJuIHRoZSBmaXJzdCBjYWxsXG4gKi9cblxuLyoqXG4gKiBTb3J0cyBhbiBhcnJheSBvZiBTaW5vblByb3h5IGluc3RhbmNlcyAoZmFrZSwgc3B5LCBzdHViKSBieSB0aGVpciBmaXJzdCBjYWxsXG4gKlxuICogQHBhcmFtICB7U2lub25Qcm94eVtdIHwgU2lub25Qcm94eX0gc3BpZXNcbiAqIEByZXR1cm5zIHtTaW5vblByb3h5W119XG4gKi9cbmZ1bmN0aW9uIG9yZGVyQnlGaXJzdENhbGwoc3BpZXMpIHtcbiAgICByZXR1cm4gc29ydChzbGljZShzcGllcyksIGNvbXBhcmF0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9yZGVyQnlGaXJzdENhbGw7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvcHlQcm90b3R5cGUgPSByZXF1aXJlKFwiLi9jb3B5LXByb3RvdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5UHJvdG90eXBlKEZ1bmN0aW9uLnByb3RvdHlwZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvcHlQcm90b3R5cGUgPSByZXF1aXJlKFwiLi9jb3B5LXByb3RvdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5UHJvdG90eXBlKE1hcC5wcm90b3R5cGUpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb3B5UHJvdG90eXBlID0gcmVxdWlyZShcIi4vY29weS1wcm90b3R5cGVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVByb3RvdHlwZShPYmplY3QucHJvdG90eXBlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29weVByb3RvdHlwZSA9IHJlcXVpcmUoXCIuL2NvcHktcHJvdG90eXBlXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlQcm90b3R5cGUoU2V0LnByb3RvdHlwZSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvcHlQcm90b3R5cGUgPSByZXF1aXJlKFwiLi9jb3B5LXByb3RvdHlwZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3B5UHJvdG90eXBlKFN0cmluZy5wcm90b3R5cGUpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFycmF5OiByZXF1aXJlKFwiLi9hcnJheVwiKSxcbiAgICBmdW5jdGlvbjogcmVxdWlyZShcIi4vZnVuY3Rpb25cIiksXG4gICAgbWFwOiByZXF1aXJlKFwiLi9tYXBcIiksXG4gICAgb2JqZWN0OiByZXF1aXJlKFwiLi9vYmplY3RcIiksXG4gICAgc2V0OiByZXF1aXJlKFwiLi9zZXRcIiksXG4gICAgc3RyaW5nOiByZXF1aXJlKFwiLi9zdHJpbmdcIilcbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwudHlwZURldGVjdCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLyogIVxuICogdHlwZS1kZXRlY3RcbiAqIENvcHlyaWdodChjKSAyMDEzIGpha2UgbHVlciA8amFrZUBhbG9naWNhbHBhcmFkb3guY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cbnZhciBwcm9taXNlRXhpc3RzID0gdHlwZW9mIFByb21pc2UgPT09ICdmdW5jdGlvbic7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG52YXIgZ2xvYmFsT2JqZWN0ID0gdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnID8gc2VsZiA6IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpZC1ibGFja2xpc3RcblxudmFyIHN5bWJvbEV4aXN0cyA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnO1xudmFyIG1hcEV4aXN0cyA9IHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnO1xudmFyIHNldEV4aXN0cyA9IHR5cGVvZiBTZXQgIT09ICd1bmRlZmluZWQnO1xudmFyIHdlYWtNYXBFeGlzdHMgPSB0eXBlb2YgV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCc7XG52YXIgd2Vha1NldEV4aXN0cyA9IHR5cGVvZiBXZWFrU2V0ICE9PSAndW5kZWZpbmVkJztcbnZhciBkYXRhVmlld0V4aXN0cyA9IHR5cGVvZiBEYXRhVmlldyAhPT0gJ3VuZGVmaW5lZCc7XG52YXIgc3ltYm9sSXRlcmF0b3JFeGlzdHMgPSBzeW1ib2xFeGlzdHMgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciAhPT0gJ3VuZGVmaW5lZCc7XG52YXIgc3ltYm9sVG9TdHJpbmdUYWdFeGlzdHMgPSBzeW1ib2xFeGlzdHMgJiYgdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyAhPT0gJ3VuZGVmaW5lZCc7XG52YXIgc2V0RW50cmllc0V4aXN0cyA9IHNldEV4aXN0cyAmJiB0eXBlb2YgU2V0LnByb3RvdHlwZS5lbnRyaWVzID09PSAnZnVuY3Rpb24nO1xudmFyIG1hcEVudHJpZXNFeGlzdHMgPSBtYXBFeGlzdHMgJiYgdHlwZW9mIE1hcC5wcm90b3R5cGUuZW50cmllcyA9PT0gJ2Z1bmN0aW9uJztcbnZhciBzZXRJdGVyYXRvclByb3RvdHlwZSA9IHNldEVudHJpZXNFeGlzdHMgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyBTZXQoKS5lbnRyaWVzKCkpO1xudmFyIG1hcEl0ZXJhdG9yUHJvdG90eXBlID0gbWFwRW50cmllc0V4aXN0cyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YobmV3IE1hcCgpLmVudHJpZXMoKSk7XG52YXIgYXJyYXlJdGVyYXRvckV4aXN0cyA9IHN5bWJvbEl0ZXJhdG9yRXhpc3RzICYmIHR5cGVvZiBBcnJheS5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbnZhciBhcnJheUl0ZXJhdG9yUHJvdG90eXBlID0gYXJyYXlJdGVyYXRvckV4aXN0cyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoW11bU3ltYm9sLml0ZXJhdG9yXSgpKTtcbnZhciBzdHJpbmdJdGVyYXRvckV4aXN0cyA9IHN5bWJvbEl0ZXJhdG9yRXhpc3RzICYmIHR5cGVvZiBTdHJpbmcucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG52YXIgc3RyaW5nSXRlcmF0b3JQcm90b3R5cGUgPSBzdHJpbmdJdGVyYXRvckV4aXN0cyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoJydbU3ltYm9sLml0ZXJhdG9yXSgpKTtcbnZhciB0b1N0cmluZ0xlZnRTbGljZUxlbmd0aCA9IDg7XG52YXIgdG9TdHJpbmdSaWdodFNsaWNlTGVuZ3RoID0gLTE7XG4vKipcbiAqICMjIyB0eXBlT2YgKG9iailcbiAqXG4gKiBVc2VzIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYCB0byBkZXRlcm1pbmUgdGhlIHR5cGUgb2YgYW4gb2JqZWN0LFxuICogbm9ybWFsaXNpbmcgYmVoYXZpb3VyIGFjcm9zcyBlbmdpbmUgdmVyc2lvbnMgJiB3ZWxsIG9wdGltaXNlZC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBvYmplY3RcbiAqIEByZXR1cm4ge1N0cmluZ30gb2JqZWN0IHR5cGVcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIHR5cGVEZXRlY3Qob2JqKSB7XG4gIC8qICEgU3BlZWQgb3B0aW1pc2F0aW9uXG4gICAqIFByZTpcbiAgICogICBzdHJpbmcgbGl0ZXJhbCAgICAgeCAzLDAzOSwwMzUgb3BzL3NlYyDCsTEuNjIlICg3OCBydW5zIHNhbXBsZWQpXG4gICAqICAgYm9vbGVhbiBsaXRlcmFsICAgIHggMSw0MjQsMTM4IG9wcy9zZWMgwrE0LjU0JSAoNzUgcnVucyBzYW1wbGVkKVxuICAgKiAgIG51bWJlciBsaXRlcmFsICAgICB4IDEsNjUzLDE1MyBvcHMvc2VjIMKxMS45MSUgKDgyIHJ1bnMgc2FtcGxlZClcbiAgICogICB1bmRlZmluZWQgICAgICAgICAgeCA5LDk3OCw2NjAgb3BzL3NlYyDCsTEuOTIlICg3NSBydW5zIHNhbXBsZWQpXG4gICAqICAgZnVuY3Rpb24gICAgICAgICAgIHggMiw1NTYsNzY5IG9wcy9zZWMgwrExLjczJSAoNzcgcnVucyBzYW1wbGVkKVxuICAgKiBQb3N0OlxuICAgKiAgIHN0cmluZyBsaXRlcmFsICAgICB4IDM4LDU2NCw3OTYgb3BzL3NlYyDCsTEuMTUlICg3OSBydW5zIHNhbXBsZWQpXG4gICAqICAgYm9vbGVhbiBsaXRlcmFsICAgIHggMzEsMTQ4LDk0MCBvcHMvc2VjIMKxMS4xMCUgKDc5IHJ1bnMgc2FtcGxlZClcbiAgICogICBudW1iZXIgbGl0ZXJhbCAgICAgeCAzMiw2NzksMzMwIG9wcy9zZWMgwrExLjkwJSAoNzggcnVucyBzYW1wbGVkKVxuICAgKiAgIHVuZGVmaW5lZCAgICAgICAgICB4IDMyLDM2MywzNjggb3BzL3NlYyDCsTEuMDclICg4MiBydW5zIHNhbXBsZWQpXG4gICAqICAgZnVuY3Rpb24gICAgICAgICAgIHggMzEsMjk2LDg3MCBvcHMvc2VjIMKxMC45NiUgKDgzIHJ1bnMgc2FtcGxlZClcbiAgICovXG4gIHZhciB0eXBlb2ZPYmogPSB0eXBlb2Ygb2JqO1xuICBpZiAodHlwZW9mT2JqICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiB0eXBlb2ZPYmo7XG4gIH1cblxuICAvKiAhIFNwZWVkIG9wdGltaXNhdGlvblxuICAgKiBQcmU6XG4gICAqICAgbnVsbCAgICAgICAgICAgICAgIHggMjgsNjQ1LDc2NSBvcHMvc2VjIMKxMS4xNyUgKDgyIHJ1bnMgc2FtcGxlZClcbiAgICogUG9zdDpcbiAgICogICBudWxsICAgICAgICAgICAgICAgeCAzNiw0MjgsOTYyIG9wcy9zZWMgwrExLjM3JSAoODQgcnVucyBzYW1wbGVkKVxuICAgKi9cbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH1cblxuICAvKiAhIFNwZWMgQ29uZm9ybWFuY2VcbiAgICogVGVzdDogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aW5kb3cpYGBcbiAgICogIC0gTm9kZSA9PT0gXCJbb2JqZWN0IGdsb2JhbF1cIlxuICAgKiAgLSBDaHJvbWUgPT09IFwiW29iamVjdCBnbG9iYWxdXCJcbiAgICogIC0gRmlyZWZveCA9PT0gXCJbb2JqZWN0IFdpbmRvd11cIlxuICAgKiAgLSBQaGFudG9tSlMgPT09IFwiW29iamVjdCBXaW5kb3ddXCJcbiAgICogIC0gU2FmYXJpID09PSBcIltvYmplY3QgV2luZG93XVwiXG4gICAqICAtIElFIDExID09PSBcIltvYmplY3QgV2luZG93XVwiXG4gICAqICAtIElFIEVkZ2UgPT09IFwiW29iamVjdCBXaW5kb3ddXCJcbiAgICogVGVzdDogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKWBgXG4gICAqICAtIENocm9tZSBXb3JrZXIgPT09IFwiW29iamVjdCBnbG9iYWxdXCJcbiAgICogIC0gRmlyZWZveCBXb3JrZXIgPT09IFwiW29iamVjdCBEZWRpY2F0ZWRXb3JrZXJHbG9iYWxTY29wZV1cIlxuICAgKiAgLSBTYWZhcmkgV29ya2VyID09PSBcIltvYmplY3QgRGVkaWNhdGVkV29ya2VyR2xvYmFsU2NvcGVdXCJcbiAgICogIC0gSUUgMTEgV29ya2VyID09PSBcIltvYmplY3QgV29ya2VyR2xvYmFsU2NvcGVdXCJcbiAgICogIC0gSUUgRWRnZSBXb3JrZXIgPT09IFwiW29iamVjdCBXb3JrZXJHbG9iYWxTY29wZV1cIlxuICAgKi9cbiAgaWYgKG9iaiA9PT0gZ2xvYmFsT2JqZWN0KSB7XG4gICAgcmV0dXJuICdnbG9iYWwnO1xuICB9XG5cbiAgLyogISBTcGVlZCBvcHRpbWlzYXRpb25cbiAgICogUHJlOlxuICAgKiAgIGFycmF5IGxpdGVyYWwgICAgICB4IDIsODg4LDM1MiBvcHMvc2VjIMKxMC42NyUgKDgyIHJ1bnMgc2FtcGxlZClcbiAgICogUG9zdDpcbiAgICogICBhcnJheSBsaXRlcmFsICAgICAgeCAyMiw0NzksNjUwIG9wcy9zZWMgwrEwLjk2JSAoODEgcnVucyBzYW1wbGVkKVxuICAgKi9cbiAgaWYgKFxuICAgIEFycmF5LmlzQXJyYXkob2JqKSAmJlxuICAgIChzeW1ib2xUb1N0cmluZ1RhZ0V4aXN0cyA9PT0gZmFsc2UgfHwgIShTeW1ib2wudG9TdHJpbmdUYWcgaW4gb2JqKSlcbiAgKSB7XG4gICAgcmV0dXJuICdBcnJheSc7XG4gIH1cblxuICAvLyBOb3QgY2FjaGluZyBleGlzdGVuY2Ugb2YgYHdpbmRvd2AgYW5kIHJlbGF0ZWQgcHJvcGVydGllcyBkdWUgdG8gcG90ZW50aWFsXG4gIC8vIGZvciBgd2luZG93YCB0byBiZSB1bnNldCBiZWZvcmUgdGVzdHMgaW4gcXVhc2ktYnJvd3NlciBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB3aW5kb3cgIT09IG51bGwpIHtcbiAgICAvKiAhIFNwZWMgQ29uZm9ybWFuY2VcbiAgICAgKiAoaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvYnJvd3NlcnMuaHRtbCNsb2NhdGlvbilcbiAgICAgKiBXaGF0V0cgSFRNTCQ3LjcuMyAtIFRoZSBgTG9jYXRpb25gIGludGVyZmFjZVxuICAgICAqIFRlc3Q6IGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwod2luZG93LmxvY2F0aW9uKWBgXG4gICAgICogIC0gSUUgPD0xMSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgICAqICAtIElFIEVkZ2UgPD0xMyA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgICAqL1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmxvY2F0aW9uID09PSAnb2JqZWN0JyAmJiBvYmogPT09IHdpbmRvdy5sb2NhdGlvbikge1xuICAgICAgcmV0dXJuICdMb2NhdGlvbic7XG4gICAgfVxuXG4gICAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAgICogKGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvI2RvY3VtZW50KVxuICAgICAqIFdoYXRXRyBIVE1MJDMuMS4xIC0gVGhlIGBEb2N1bWVudGAgb2JqZWN0XG4gICAgICogTm90ZTogTW9zdCBicm93c2VycyBjdXJyZW50bHkgYWRoZXIgdG8gdGhlIFczQyBET00gTGV2ZWwgMiBzcGVjXG4gICAgICogICAgICAgKGh0dHBzOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMi1IVE1ML2h0bWwuaHRtbCNJRC0yNjgwOTI2OClcbiAgICAgKiAgICAgICB3aGljaCBzdWdnZXN0cyB0aGF0IGJyb3dzZXJzIHNob3VsZCB1c2UgSFRNTFRhYmxlQ2VsbEVsZW1lbnQgZm9yXG4gICAgICogICAgICAgYm90aCBURCBhbmQgVEggZWxlbWVudHMuIFdoYXRXRyBzZXBhcmF0ZXMgdGhlc2UuXG4gICAgICogICAgICAgV2hhdFdHIEhUTUwgc3RhdGVzOlxuICAgICAqICAgICAgICAgPiBGb3IgaGlzdG9yaWNhbCByZWFzb25zLCBXaW5kb3cgb2JqZWN0cyBtdXN0IGFsc28gaGF2ZSBhXG4gICAgICogICAgICAgICA+IHdyaXRhYmxlLCBjb25maWd1cmFibGUsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkXG4gICAgICogICAgICAgICA+IEhUTUxEb2N1bWVudCB3aG9zZSB2YWx1ZSBpcyB0aGUgRG9jdW1lbnQgaW50ZXJmYWNlIG9iamVjdC5cbiAgICAgKiBUZXN0OiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGRvY3VtZW50KWBgXG4gICAgICogIC0gQ2hyb21lID09PSBcIltvYmplY3QgSFRNTERvY3VtZW50XVwiXG4gICAgICogIC0gRmlyZWZveCA9PT0gXCJbb2JqZWN0IEhUTUxEb2N1bWVudF1cIlxuICAgICAqICAtIFNhZmFyaSA9PT0gXCJbb2JqZWN0IEhUTUxEb2N1bWVudF1cIlxuICAgICAqICAtIElFIDw9MTAgPT09IFwiW29iamVjdCBEb2N1bWVudF1cIlxuICAgICAqICAtIElFIDExID09PSBcIltvYmplY3QgSFRNTERvY3VtZW50XVwiXG4gICAgICogIC0gSUUgRWRnZSA8PTEzID09PSBcIltvYmplY3QgSFRNTERvY3VtZW50XVwiXG4gICAgICovXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgPT09ICdvYmplY3QnICYmIG9iaiA9PT0gd2luZG93LmRvY3VtZW50KSB7XG4gICAgICByZXR1cm4gJ0RvY3VtZW50JztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAvKiAhIFNwZWMgQ29uZm9ybWFuY2VcbiAgICAgICAqIChodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS93ZWJhcHBhcGlzLmh0bWwjbWltZXR5cGVhcnJheSlcbiAgICAgICAqIFdoYXRXRyBIVE1MJDguNi4xLjUgLSBQbHVnaW5zIC0gSW50ZXJmYWNlIE1pbWVUeXBlQXJyYXlcbiAgICAgICAqIFRlc3Q6IGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmF2aWdhdG9yLm1pbWVUeXBlcylgYFxuICAgICAgICogIC0gSUUgPD0xMCA9PT0gXCJbb2JqZWN0IE1TTWltZVR5cGVzQ29sbGVjdGlvbl1cIlxuICAgICAgICovXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IubWltZVR5cGVzID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIG9iaiA9PT0gd2luZG93Lm5hdmlnYXRvci5taW1lVHlwZXMpIHtcbiAgICAgICAgcmV0dXJuICdNaW1lVHlwZUFycmF5JztcbiAgICAgIH1cblxuICAgICAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAgICAgKiAoaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvd2ViYXBwYXBpcy5odG1sI3BsdWdpbmFycmF5KVxuICAgICAgICogV2hhdFdHIEhUTUwkOC42LjEuNSAtIFBsdWdpbnMgLSBJbnRlcmZhY2UgUGx1Z2luQXJyYXlcbiAgICAgICAqIFRlc3Q6IGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmF2aWdhdG9yLnBsdWdpbnMpYGBcbiAgICAgICAqICAtIElFIDw9MTAgPT09IFwiW29iamVjdCBNU1BsdWdpbnNDb2xsZWN0aW9uXVwiXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvci5wbHVnaW5zID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIG9iaiA9PT0gd2luZG93Lm5hdmlnYXRvci5wbHVnaW5zKSB7XG4gICAgICAgIHJldHVybiAnUGx1Z2luQXJyYXknO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgodHlwZW9mIHdpbmRvdy5IVE1MRWxlbWVudCA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICB0eXBlb2Ygd2luZG93LkhUTUxFbGVtZW50ID09PSAnb2JqZWN0JykgJiZcbiAgICAgICAgb2JqIGluc3RhbmNlb2Ygd2luZG93LkhUTUxFbGVtZW50KSB7XG4gICAgICAvKiAhIFNwZWMgQ29uZm9ybWFuY2VcbiAgICAgICogKGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3dlYmFwcGFwaXMuaHRtbCNwbHVnaW5hcnJheSlcbiAgICAgICogV2hhdFdHIEhUTUwkNC40LjQgLSBUaGUgYGJsb2NrcXVvdGVgIGVsZW1lbnQgLSBJbnRlcmZhY2UgYEhUTUxRdW90ZUVsZW1lbnRgXG4gICAgICAqIFRlc3Q6IGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYmxvY2txdW90ZScpKWBgXG4gICAgICAqICAtIElFIDw9MTAgPT09IFwiW29iamVjdCBIVE1MQmxvY2tFbGVtZW50XVwiXG4gICAgICAqL1xuICAgICAgaWYgKG9iai50YWdOYW1lID09PSAnQkxPQ0tRVU9URScpIHtcbiAgICAgICAgcmV0dXJuICdIVE1MUXVvdGVFbGVtZW50JztcbiAgICAgIH1cblxuICAgICAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAgICAgKiAoaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jaHRtbHRhYmxlZGF0YWNlbGxlbGVtZW50KVxuICAgICAgICogV2hhdFdHIEhUTUwkNC45LjkgLSBUaGUgYHRkYCBlbGVtZW50IC0gSW50ZXJmYWNlIGBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnRgXG4gICAgICAgKiBOb3RlOiBNb3N0IGJyb3dzZXJzIGN1cnJlbnRseSBhZGhlciB0byB0aGUgVzNDIERPTSBMZXZlbCAyIHNwZWNcbiAgICAgICAqICAgICAgIChodHRwczovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTItSFRNTC9odG1sLmh0bWwjSUQtODI5MTUwNzUpXG4gICAgICAgKiAgICAgICB3aGljaCBzdWdnZXN0cyB0aGF0IGJyb3dzZXJzIHNob3VsZCB1c2UgSFRNTFRhYmxlQ2VsbEVsZW1lbnQgZm9yXG4gICAgICAgKiAgICAgICBib3RoIFREIGFuZCBUSCBlbGVtZW50cy4gV2hhdFdHIHNlcGFyYXRlcyB0aGVzZS5cbiAgICAgICAqIFRlc3Q6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpKVxuICAgICAgICogIC0gQ2hyb21lID09PSBcIltvYmplY3QgSFRNTFRhYmxlQ2VsbEVsZW1lbnRdXCJcbiAgICAgICAqICAtIEZpcmVmb3ggPT09IFwiW29iamVjdCBIVE1MVGFibGVDZWxsRWxlbWVudF1cIlxuICAgICAgICogIC0gU2FmYXJpID09PSBcIltvYmplY3QgSFRNTFRhYmxlQ2VsbEVsZW1lbnRdXCJcbiAgICAgICAqL1xuICAgICAgaWYgKG9iai50YWdOYW1lID09PSAnVEQnKSB7XG4gICAgICAgIHJldHVybiAnSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50JztcbiAgICAgIH1cblxuICAgICAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAgICAgKiAoaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jaHRtbHRhYmxlaGVhZGVyY2VsbGVsZW1lbnQpXG4gICAgICAgKiBXaGF0V0cgSFRNTCQ0LjkuOSAtIFRoZSBgdGRgIGVsZW1lbnQgLSBJbnRlcmZhY2UgYEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50YFxuICAgICAgICogTm90ZTogTW9zdCBicm93c2VycyBjdXJyZW50bHkgYWRoZXIgdG8gdGhlIFczQyBET00gTGV2ZWwgMiBzcGVjXG4gICAgICAgKiAgICAgICAoaHR0cHM6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0yLUhUTUwvaHRtbC5odG1sI0lELTgyOTE1MDc1KVxuICAgICAgICogICAgICAgd2hpY2ggc3VnZ2VzdHMgdGhhdCBicm93c2VycyBzaG91bGQgdXNlIEhUTUxUYWJsZUNlbGxFbGVtZW50IGZvclxuICAgICAgICogICAgICAgYm90aCBURCBhbmQgVEggZWxlbWVudHMuIFdoYXRXRyBzZXBhcmF0ZXMgdGhlc2UuXG4gICAgICAgKiBUZXN0OiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKSlcbiAgICAgICAqICAtIENocm9tZSA9PT0gXCJbb2JqZWN0IEhUTUxUYWJsZUNlbGxFbGVtZW50XVwiXG4gICAgICAgKiAgLSBGaXJlZm94ID09PSBcIltvYmplY3QgSFRNTFRhYmxlQ2VsbEVsZW1lbnRdXCJcbiAgICAgICAqICAtIFNhZmFyaSA9PT0gXCJbb2JqZWN0IEhUTUxUYWJsZUNlbGxFbGVtZW50XVwiXG4gICAgICAgKi9cbiAgICAgIGlmIChvYmoudGFnTmFtZSA9PT0gJ1RIJykge1xuICAgICAgICByZXR1cm4gJ0hUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50JztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiAhIFNwZWVkIG9wdGltaXNhdGlvblxuICAqIFByZTpcbiAgKiAgIEZsb2F0NjRBcnJheSAgICAgICB4IDYyNSw2NDQgb3BzL3NlYyDCsTEuNTglICg4MCBydW5zIHNhbXBsZWQpXG4gICogICBGbG9hdDMyQXJyYXkgICAgICAgeCAxLDI3OSw4NTIgb3BzL3NlYyDCsTIuOTElICg3NyBydW5zIHNhbXBsZWQpXG4gICogICBVaW50MzJBcnJheSAgICAgICAgeCAxLDE3OCwxODUgb3BzL3NlYyDCsTEuOTUlICg4MyBydW5zIHNhbXBsZWQpXG4gICogICBVaW50MTZBcnJheSAgICAgICAgeCAxLDAwOCwzODAgb3BzL3NlYyDCsTIuMjUlICg4MCBydW5zIHNhbXBsZWQpXG4gICogICBVaW50OEFycmF5ICAgICAgICAgeCAxLDEyOCwwNDAgb3BzL3NlYyDCsTIuMTElICg4MSBydW5zIHNhbXBsZWQpXG4gICogICBJbnQzMkFycmF5ICAgICAgICAgeCAxLDE3MCwxMTkgb3BzL3NlYyDCsTIuODglICg4MCBydW5zIHNhbXBsZWQpXG4gICogICBJbnQxNkFycmF5ICAgICAgICAgeCAxLDE3NiwzNDggb3BzL3NlYyDCsTUuNzklICg4NiBydW5zIHNhbXBsZWQpXG4gICogICBJbnQ4QXJyYXkgICAgICAgICAgeCAxLDA1OCw3MDcgb3BzL3NlYyDCsTQuOTQlICg3NyBydW5zIHNhbXBsZWQpXG4gICogICBVaW50OENsYW1wZWRBcnJheSAgeCAxLDExMCw2MzMgb3BzL3NlYyDCsTQuMjAlICg4MCBydW5zIHNhbXBsZWQpXG4gICogUG9zdDpcbiAgKiAgIEZsb2F0NjRBcnJheSAgICAgICB4IDcsMTA1LDY3MSBvcHMvc2VjIMKxMTMuNDclICg2NCBydW5zIHNhbXBsZWQpXG4gICogICBGbG9hdDMyQXJyYXkgICAgICAgeCA1LDg4Nyw5MTIgb3BzL3NlYyDCsTEuNDYlICg4MiBydW5zIHNhbXBsZWQpXG4gICogICBVaW50MzJBcnJheSAgICAgICAgeCA2LDQ5MSw2NjEgb3BzL3NlYyDCsTEuNzYlICg3OSBydW5zIHNhbXBsZWQpXG4gICogICBVaW50MTZBcnJheSAgICAgICAgeCA2LDU1OSw3OTUgb3BzL3NlYyDCsTEuNjclICg4MiBydW5zIHNhbXBsZWQpXG4gICogICBVaW50OEFycmF5ICAgICAgICAgeCA2LDQ2Myw5NjYgb3BzL3NlYyDCsTEuNDMlICg4NSBydW5zIHNhbXBsZWQpXG4gICogICBJbnQzMkFycmF5ICAgICAgICAgeCA1LDY0MSw4NDEgb3BzL3NlYyDCsTMuNDklICg4MSBydW5zIHNhbXBsZWQpXG4gICogICBJbnQxNkFycmF5ICAgICAgICAgeCA2LDU4Myw1MTEgb3BzL3NlYyDCsTEuOTglICg4MCBydW5zIHNhbXBsZWQpXG4gICogICBJbnQ4QXJyYXkgICAgICAgICAgeCA2LDYwNiwwNzggb3BzL3NlYyDCsTEuNzQlICg4MSBydW5zIHNhbXBsZWQpXG4gICogICBVaW50OENsYW1wZWRBcnJheSAgeCA2LDYwMiwyMjQgb3BzL3NlYyDCsTEuNzclICg4MyBydW5zIHNhbXBsZWQpXG4gICovXG4gIHZhciBzdHJpbmdUYWcgPSAoc3ltYm9sVG9TdHJpbmdUYWdFeGlzdHMgJiYgb2JqW1N5bWJvbC50b1N0cmluZ1RhZ10pO1xuICBpZiAodHlwZW9mIHN0cmluZ1RhZyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gc3RyaW5nVGFnO1xuICB9XG5cbiAgdmFyIG9ialByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAvKiAhIFNwZWVkIG9wdGltaXNhdGlvblxuICAqIFByZTpcbiAgKiAgIHJlZ2V4IGxpdGVyYWwgICAgICB4IDEsNzcyLDM4NSBvcHMvc2VjIMKxMS44NSUgKDc3IHJ1bnMgc2FtcGxlZClcbiAgKiAgIHJlZ2V4IGNvbnN0cnVjdG9yICB4IDIsMTQzLDYzNCBvcHMvc2VjIMKxMi40NiUgKDc4IHJ1bnMgc2FtcGxlZClcbiAgKiBQb3N0OlxuICAqICAgcmVnZXggbGl0ZXJhbCAgICAgIHggMyw5MjgsMDA5IG9wcy9zZWMgwrEwLjY1JSAoNzggcnVucyBzYW1wbGVkKVxuICAqICAgcmVnZXggY29uc3RydWN0b3IgIHggMyw5MzEsMTA4IG9wcy9zZWMgwrEwLjU4JSAoODQgcnVucyBzYW1wbGVkKVxuICAqL1xuICBpZiAob2JqUHJvdG90eXBlID09PSBSZWdFeHAucHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdSZWdFeHAnO1xuICB9XG5cbiAgLyogISBTcGVlZCBvcHRpbWlzYXRpb25cbiAgKiBQcmU6XG4gICogICBkYXRlICAgICAgICAgICAgICAgeCAyLDEzMCwwNzQgb3BzL3NlYyDCsTQuNDIlICg2OCBydW5zIHNhbXBsZWQpXG4gICogUG9zdDpcbiAgKiAgIGRhdGUgICAgICAgICAgICAgICB4IDMsOTUzLDc3OSBvcHMvc2VjIMKxMS4zNSUgKDc3IHJ1bnMgc2FtcGxlZClcbiAgKi9cbiAgaWYgKG9ialByb3RvdHlwZSA9PT0gRGF0ZS5wcm90b3R5cGUpIHtcbiAgICByZXR1cm4gJ0RhdGUnO1xuICB9XG5cbiAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAqIChodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wL2luZGV4Lmh0bWwjc2VjLXByb21pc2UucHJvdG90eXBlLUBAdG9zdHJpbmd0YWcpXG4gICAqIEVTNiQyNS40LjUuNCAtIFByb21pc2UucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddIHNob3VsZCBiZSBcIlByb21pc2VcIjpcbiAgICogVGVzdDogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQcm9taXNlLnJlc29sdmUoKSlgYFxuICAgKiAgLSBDaHJvbWUgPD00NyA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgKiAgLSBFZGdlIDw9MjAgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICogIC0gRmlyZWZveCAyOS1MYXRlc3QgPT09IFwiW29iamVjdCBQcm9taXNlXVwiXG4gICAqICAtIFNhZmFyaSA3LjEtTGF0ZXN0ID09PSBcIltvYmplY3QgUHJvbWlzZV1cIlxuICAgKi9cbiAgaWYgKHByb21pc2VFeGlzdHMgJiYgb2JqUHJvdG90eXBlID09PSBQcm9taXNlLnByb3RvdHlwZSkge1xuICAgIHJldHVybiAnUHJvbWlzZSc7XG4gIH1cblxuICAvKiAhIFNwZWVkIG9wdGltaXNhdGlvblxuICAqIFByZTpcbiAgKiAgIHNldCAgICAgICAgICAgICAgICB4IDIsMjIyLDE4NiBvcHMvc2VjIMKxMS4zMSUgKDgyIHJ1bnMgc2FtcGxlZClcbiAgKiBQb3N0OlxuICAqICAgc2V0ICAgICAgICAgICAgICAgIHggNCw1NDUsODc5IG9wcy9zZWMgwrExLjEzJSAoODMgcnVucyBzYW1wbGVkKVxuICAqL1xuICBpZiAoc2V0RXhpc3RzICYmIG9ialByb3RvdHlwZSA9PT0gU2V0LnByb3RvdHlwZSkge1xuICAgIHJldHVybiAnU2V0JztcbiAgfVxuXG4gIC8qICEgU3BlZWQgb3B0aW1pc2F0aW9uXG4gICogUHJlOlxuICAqICAgbWFwICAgICAgICAgICAgICAgIHggMiwzOTYsODQyIG9wcy9zZWMgwrExLjU5JSAoODEgcnVucyBzYW1wbGVkKVxuICAqIFBvc3Q6XG4gICogICBtYXAgICAgICAgICAgICAgICAgeCA0LDE4Myw5NDUgb3BzL3NlYyDCsTYuNTklICg4MiBydW5zIHNhbXBsZWQpXG4gICovXG4gIGlmIChtYXBFeGlzdHMgJiYgb2JqUHJvdG90eXBlID09PSBNYXAucHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdNYXAnO1xuICB9XG5cbiAgLyogISBTcGVlZCBvcHRpbWlzYXRpb25cbiAgKiBQcmU6XG4gICogICB3ZWFrc2V0ICAgICAgICAgICAgeCAxLDMyMywyMjAgb3BzL3NlYyDCsTIuMTclICg3NiBydW5zIHNhbXBsZWQpXG4gICogUG9zdDpcbiAgKiAgIHdlYWtzZXQgICAgICAgICAgICB4IDQsMjM3LDUxMCBvcHMvc2VjIMKxMi4wMSUgKDc3IHJ1bnMgc2FtcGxlZClcbiAgKi9cbiAgaWYgKHdlYWtTZXRFeGlzdHMgJiYgb2JqUHJvdG90eXBlID09PSBXZWFrU2V0LnByb3RvdHlwZSkge1xuICAgIHJldHVybiAnV2Vha1NldCc7XG4gIH1cblxuICAvKiAhIFNwZWVkIG9wdGltaXNhdGlvblxuICAqIFByZTpcbiAgKiAgIHdlYWttYXAgICAgICAgICAgICB4IDEsNTAwLDI2MCBvcHMvc2VjIMKxMi4wMiUgKDc4IHJ1bnMgc2FtcGxlZClcbiAgKiBQb3N0OlxuICAqICAgd2Vha21hcCAgICAgICAgICAgIHggMyw4ODEsMzg0IG9wcy9zZWMgwrExLjQ1JSAoODIgcnVucyBzYW1wbGVkKVxuICAqL1xuICBpZiAod2Vha01hcEV4aXN0cyAmJiBvYmpQcm90b3R5cGUgPT09IFdlYWtNYXAucHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdXZWFrTWFwJztcbiAgfVxuXG4gIC8qICEgU3BlYyBDb25mb3JtYW5jZVxuICAgKiAoaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC9pbmRleC5odG1sI3NlYy1kYXRhdmlldy5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZylcbiAgICogRVM2JDI0LjIuNC4yMSAtIERhdGFWaWV3LnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSBzaG91bGQgYmUgXCJEYXRhVmlld1wiOlxuICAgKiBUZXN0OiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKWBgXG4gICAqICAtIEVkZ2UgPD0xMyA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgKi9cbiAgaWYgKGRhdGFWaWV3RXhpc3RzICYmIG9ialByb3RvdHlwZSA9PT0gRGF0YVZpZXcucHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdEYXRhVmlldyc7XG4gIH1cblxuICAvKiAhIFNwZWMgQ29uZm9ybWFuY2VcbiAgICogKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvaW5kZXguaHRtbCNzZWMtJW1hcGl0ZXJhdG9ycHJvdG90eXBlJS1AQHRvc3RyaW5ndGFnKVxuICAgKiBFUzYkMjMuMS41LjIuMiAtICVNYXBJdGVyYXRvclByb3RvdHlwZSVbQEB0b1N0cmluZ1RhZ10gc2hvdWxkIGJlIFwiTWFwIEl0ZXJhdG9yXCI6XG4gICAqIFRlc3Q6IGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmV3IE1hcCgpLmVudHJpZXMoKSlgYFxuICAgKiAgLSBFZGdlIDw9MTMgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICovXG4gIGlmIChtYXBFeGlzdHMgJiYgb2JqUHJvdG90eXBlID09PSBtYXBJdGVyYXRvclByb3RvdHlwZSkge1xuICAgIHJldHVybiAnTWFwIEl0ZXJhdG9yJztcbiAgfVxuXG4gIC8qICEgU3BlYyBDb25mb3JtYW5jZVxuICAgKiAoaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC9pbmRleC5odG1sI3NlYy0lc2V0aXRlcmF0b3Jwcm90b3R5cGUlLUBAdG9zdHJpbmd0YWcpXG4gICAqIEVTNiQyMy4yLjUuMi4yIC0gJVNldEl0ZXJhdG9yUHJvdG90eXBlJVtAQHRvU3RyaW5nVGFnXSBzaG91bGQgYmUgXCJTZXQgSXRlcmF0b3JcIjpcbiAgICogVGVzdDogYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuZXcgU2V0KCkuZW50cmllcygpKWBgXG4gICAqICAtIEVkZ2UgPD0xMyA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIlxuICAgKi9cbiAgaWYgKHNldEV4aXN0cyAmJiBvYmpQcm90b3R5cGUgPT09IHNldEl0ZXJhdG9yUHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdTZXQgSXRlcmF0b3InO1xuICB9XG5cbiAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAqIChodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wL2luZGV4Lmh0bWwjc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS1AQHRvc3RyaW5ndGFnKVxuICAgKiBFUzYkMjIuMS41LjIuMiAtICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJVtAQHRvU3RyaW5nVGFnXSBzaG91bGQgYmUgXCJBcnJheSBJdGVyYXRvclwiOlxuICAgKiBUZXN0OiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKFtdW1N5bWJvbC5pdGVyYXRvcl0oKSlgYFxuICAgKiAgLSBFZGdlIDw9MTMgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICovXG4gIGlmIChhcnJheUl0ZXJhdG9yRXhpc3RzICYmIG9ialByb3RvdHlwZSA9PT0gYXJyYXlJdGVyYXRvclByb3RvdHlwZSkge1xuICAgIHJldHVybiAnQXJyYXkgSXRlcmF0b3InO1xuICB9XG5cbiAgLyogISBTcGVjIENvbmZvcm1hbmNlXG4gICAqIChodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wL2luZGV4Lmh0bWwjc2VjLSVzdHJpbmdpdGVyYXRvcnByb3RvdHlwZSUtQEB0b3N0cmluZ3RhZylcbiAgICogRVM2JDIxLjEuNS4yLjIgLSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlW0BAdG9TdHJpbmdUYWddIHNob3VsZCBiZSBcIlN0cmluZyBJdGVyYXRvclwiOlxuICAgKiBUZXN0OiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCcnW1N5bWJvbC5pdGVyYXRvcl0oKSlgYFxuICAgKiAgLSBFZGdlIDw9MTMgPT09IFwiW29iamVjdCBPYmplY3RdXCJcbiAgICovXG4gIGlmIChzdHJpbmdJdGVyYXRvckV4aXN0cyAmJiBvYmpQcm90b3R5cGUgPT09IHN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlKSB7XG4gICAgcmV0dXJuICdTdHJpbmcgSXRlcmF0b3InO1xuICB9XG5cbiAgLyogISBTcGVlZCBvcHRpbWlzYXRpb25cbiAgKiBQcmU6XG4gICogICBvYmplY3QgZnJvbSBudWxsICAgeCAyLDQyNCwzMjAgb3BzL3NlYyDCsTEuNjclICg3NiBydW5zIHNhbXBsZWQpXG4gICogUG9zdDpcbiAgKiAgIG9iamVjdCBmcm9tIG51bGwgICB4IDUsODM4LDAwMCBvcHMvc2VjIMKxMC45OSUgKDg0IHJ1bnMgc2FtcGxlZClcbiAgKi9cbiAgaWYgKG9ialByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnT2JqZWN0JztcbiAgfVxuXG4gIHJldHVybiBPYmplY3RcbiAgICAucHJvdG90eXBlXG4gICAgLnRvU3RyaW5nXG4gICAgLmNhbGwob2JqKVxuICAgIC5zbGljZSh0b1N0cmluZ0xlZnRTbGljZUxlbmd0aCwgdG9TdHJpbmdSaWdodFNsaWNlTGVuZ3RoKTtcbn1cblxucmV0dXJuIHR5cGVEZXRlY3Q7XG5cbn0pKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHR5cGUgPSByZXF1aXJlKFwidHlwZS1kZXRlY3RcIik7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbG93ZXItY2FzZSByZXN1bHQgb2YgcnVubmluZyB0eXBlIGZyb20gdHlwZS1kZXRlY3Qgb24gdGhlIHZhbHVlXG4gKlxuICogQHBhcmFtICB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHlwZU9mKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGUodmFsdWUpLnRvTG93ZXJDYXNlKCk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmFsdWVcbiAqXG4gKiBAcGFyYW0gIHsqfSB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdmFsdWVUb1N0cmluZyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50b1N0cmluZykge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHNpbm9uanMvbm8tcHJvdG90eXBlLW1ldGhvZHMvbm8tcHJvdG90eXBlLW1ldGhvZHNcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlVG9TdHJpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2xvYmFsOiByZXF1aXJlKFwiLi9nbG9iYWxcIiksXG4gICAgY2FsbGVkSW5PcmRlcjogcmVxdWlyZShcIi4vY2FsbGVkLWluLW9yZGVyXCIpLFxuICAgIGNsYXNzTmFtZTogcmVxdWlyZShcIi4vY2xhc3MtbmFtZVwiKSxcbiAgICBkZXByZWNhdGVkOiByZXF1aXJlKFwiLi9kZXByZWNhdGVkXCIpLFxuICAgIGV2ZXJ5OiByZXF1aXJlKFwiLi9ldmVyeVwiKSxcbiAgICBmdW5jdGlvbk5hbWU6IHJlcXVpcmUoXCIuL2Z1bmN0aW9uLW5hbWVcIiksXG4gICAgb3JkZXJCeUZpcnN0Q2FsbDogcmVxdWlyZShcIi4vb3JkZXItYnktZmlyc3QtY2FsbFwiKSxcbiAgICBwcm90b3R5cGVzOiByZXF1aXJlKFwiLi9wcm90b3R5cGVzXCIpLFxuICAgIHR5cGVPZjogcmVxdWlyZShcIi4vdHlwZS1vZlwiKSxcbiAgICB2YWx1ZVRvU3RyaW5nOiByZXF1aXJlKFwiLi92YWx1ZS10by1zdHJpbmdcIilcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgZ2xvYmFsT2JqZWN0ID0gcmVxdWlyZShcIkBzaW5vbmpzL2NvbW1vbnNcIikuZ2xvYmFsO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IElkbGVEZWFkbGluZVxuICogQHByb3BlcnR5IHtib29sZWFufSBkaWRUaW1lb3V0IC0gd2hldGhlciBvciBub3QgdGhlIGNhbGxiYWNrIHdhcyBjYWxsZWQgYmVmb3JlIHJlYWNoaW5nIHRoZSBvcHRpb25hbCB0aW1lb3V0XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6bnVtYmVyfSB0aW1lUmVtYWluaW5nIC0gYSBmbG9hdGluZy1wb2ludCB2YWx1ZSBwcm92aWRpbmcgYW4gZXN0aW1hdGUgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgcmVtYWluaW5nIGluIHRoZSBjdXJyZW50IGlkbGUgcGVyaW9kXG4gKi9cblxuLyoqXG4gKiBRdWV1ZXMgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgZHVyaW5nIGEgYnJvd3NlcidzIGlkbGUgcGVyaW9kc1xuICpcbiAqIEBjYWxsYmFjayBSZXF1ZXN0SWRsZUNhbGxiYWNrXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKElkbGVEZWFkbGluZSl9IGNhbGxiYWNrXG4gKiBAcGFyYW0ge3t0aW1lb3V0OiBudW1iZXJ9fSBvcHRpb25zIC0gYW4gb3B0aW9ucyBvYmplY3RcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBpZFxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIE5leHRUaWNrXG4gKiBAcGFyYW0ge1ZvaWRWYXJBcmdzRnVuY30gY2FsbGJhY2sgLSB0aGUgY2FsbGJhY2sgdG8gcnVuXG4gKiBAcGFyYW0gey4uLip9IGFyZ3VtZW50cyAtIG9wdGlvbmFsIGFyZ3VtZW50cyB0byBjYWxsIHRoZSBjYWxsYmFjayB3aXRoXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIEBjYWxsYmFjayBTZXRJbW1lZGlhdGVcbiAqIEBwYXJhbSB7Vm9pZFZhckFyZ3NGdW5jfSBjYWxsYmFjayAtIHRoZSBjYWxsYmFjayB0byBydW5cbiAqIEBwYXJhbSB7Li4uKn0gYXJndW1lbnRzIC0gb3B0aW9uYWwgYXJndW1lbnRzIHRvIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGhcbiAqIEByZXR1cm5zIHtOb2RlSW1tZWRpYXRlfVxuICovXG5cbi8qKlxuICogQGNhbGxiYWNrIFZvaWRWYXJBcmdzRnVuY1xuICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIHRoZSBjYWxsYmFjayB0byBydW5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKG51bWJlcik6dm9pZH0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIHRoZSBpZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYgUGVyZm9ybWFuY2VcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogbnVtYmVyfSBub3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBqc2RvYy9yZXF1aXJlLXByb3BlcnR5LWRlc2NyaXB0aW9uICovXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENsb2NrXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm93IC0gdGhlIGN1cnJlbnQgdGltZVxuICogQHByb3BlcnR5IHtEYXRlfSBEYXRlIC0gdGhlIERhdGUgY29uc3RydWN0b3JcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb29wTGltaXQgLSB0aGUgbWF4aW11bSBudW1iZXIgb2YgdGltZXJzIGJlZm9yZSBhc3N1bWluZyBhbiBpbmZpbml0ZSBsb29wXG4gKiBAcHJvcGVydHkge1JlcXVlc3RJZGxlQ2FsbGJhY2t9IHJlcXVlc3RJZGxlQ2FsbGJhY2tcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24obnVtYmVyKTp2b2lkfSBjYW5jZWxJZGxlQ2FsbGJhY2tcbiAqIEBwcm9wZXJ0eSB7c2V0VGltZW91dH0gc2V0VGltZW91dFxuICogQHByb3BlcnR5IHtjbGVhclRpbWVvdXR9IGNsZWFyVGltZW91dFxuICogQHByb3BlcnR5IHtOZXh0VGlja30gbmV4dFRpY2tcbiAqIEBwcm9wZXJ0eSB7cXVldWVNaWNyb3Rhc2t9IHF1ZXVlTWljcm90YXNrXG4gKiBAcHJvcGVydHkge3NldEludGVydmFsfSBzZXRJbnRlcnZhbFxuICogQHByb3BlcnR5IHtjbGVhckludGVydmFsfSBjbGVhckludGVydmFsXG4gKiBAcHJvcGVydHkge1NldEltbWVkaWF0ZX0gc2V0SW1tZWRpYXRlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKE5vZGVJbW1lZGlhdGUpOnZvaWR9IGNsZWFySW1tZWRpYXRlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6bnVtYmVyfSBjb3VudFRpbWVyc1xuICogQHByb3BlcnR5IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9IHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbihudW1iZXIpOnZvaWR9IGNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6dm9pZH0gcnVuTWljcm90YXNrc1xuICogQHByb3BlcnR5IHtmdW5jdGlvbihzdHJpbmcgfCBudW1iZXIpOiBudW1iZXJ9IHRpY2tcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oc3RyaW5nIHwgbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+fSB0aWNrQXN5bmNcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogbnVtYmVyfSBuZXh0XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IFByb21pc2U8bnVtYmVyPn0gbmV4dEFzeW5jXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IG51bWJlcn0gcnVuQWxsXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IG51bWJlcn0gcnVuVG9GcmFtZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbigpOiBQcm9taXNlPG51bWJlcj59IHJ1bkFsbEFzeW5jXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IG51bWJlcn0gcnVuVG9MYXN0XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IFByb21pc2U8bnVtYmVyPn0gcnVuVG9MYXN0QXN5bmNcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogdm9pZH0gcmVzZXRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24obnVtYmVyIHwgRGF0ZSk6IHZvaWR9IHNldFN5c3RlbVRpbWVcbiAqIEBwcm9wZXJ0eSB7UGVyZm9ybWFuY2V9IHBlcmZvcm1hbmNlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKG51bWJlcltdKTogbnVtYmVyW119IGhydGltZSAtIHByb2Nlc3MuaHJ0aW1lIChsZWdhY3kpXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IHZvaWR9IHVuaW5zdGFsbCBVbmluc3RhbGwgdGhlIGNsb2NrLlxuICogQHByb3BlcnR5IHtGdW5jdGlvbltdfSBtZXRob2RzIC0gdGhlIG1ldGhvZHMgdGhhdCBhcmUgZmFrZWRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3Nob3VsZENsZWFyTmF0aXZlVGltZXJzXSBpbmhlcml0ZWQgZnJvbSBjb25maWdcbiAqL1xuLyogZXNsaW50LWVuYWJsZSBqc2RvYy9yZXF1aXJlLXByb3BlcnR5LWRlc2NyaXB0aW9uICovXG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHRoZSBgaW5zdGFsbGAgbWV0aG9kLlxuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IENvbmZpZ1xuICogQHByb3BlcnR5IHtudW1iZXJ8RGF0ZX0gW25vd10gYSBudW1iZXIgKGluIG1pbGxpc2Vjb25kcykgb3IgYSBEYXRlIG9iamVjdCAoZGVmYXVsdCBlcG9jaClcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IFt0b0Zha2VdIG5hbWVzIG9mIHRoZSBtZXRob2RzIHRoYXQgc2hvdWxkIGJlIGZha2VkLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtsb29wTGltaXRdIHRoZSBtYXhpbXVtIG51bWJlciBvZiB0aW1lcnMgdGhhdCB3aWxsIGJlIHJ1biB3aGVuIGNhbGxpbmcgcnVuQWxsKClcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3Nob3VsZEFkdmFuY2VUaW1lXSB0ZWxscyBGYWtlVGltZXJzIHRvIGluY3JlbWVudCBtb2NrZWQgdGltZSBhdXRvbWF0aWNhbGx5IChkZWZhdWx0IGZhbHNlKVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFthZHZhbmNlVGltZURlbHRhXSBpbmNyZW1lbnQgbW9ja2VkIHRpbWUgZXZlcnkgPDxhZHZhbmNlVGltZURlbHRhPj4gbXMgKGRlZmF1bHQ6IDIwbXMpXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtzaG91bGRDbGVhck5hdGl2ZVRpbWVyc10gZm9yd2FyZHMgY2xlYXIgdGltZXIgY2FsbHMgdG8gbmF0aXZlIGZ1bmN0aW9ucyBpZiB0aGV5IGFyZSBub3QgZmFrZXMgKGRlZmF1bHQ6IGZhbHNlKVxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIGpzZG9jL3JlcXVpcmUtcHJvcGVydHktZGVzY3JpcHRpb24gKi9cbi8qKlxuICogVGhlIGludGVybmFsIHN0cnVjdHVyZSB0byBkZXNjcmliZSBhIHNjaGVkdWxlZCBmYWtlIHRpbWVyXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gVGltZXJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGZ1bmNcbiAqIEBwcm9wZXJ0eSB7KltdfSBhcmdzXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGVsYXlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjYWxsQXRcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjcmVhdGVkQXRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaW1tZWRpYXRlXG4gKiBAcHJvcGVydHkge251bWJlcn0gaWRcbiAqIEBwcm9wZXJ0eSB7RXJyb3J9IFtlcnJvcl1cbiAqL1xuXG4vKipcbiAqIEEgTm9kZSB0aW1lclxuICpcbiAqIEB0eXBlZGVmIHtvYmplY3R9IE5vZGVJbW1lZGlhdGVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogYm9vbGVhbn0gaGFzUmVmXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uKCk6IE5vZGVJbW1lZGlhdGV9IHJlZlxuICogQHByb3BlcnR5IHtmdW5jdGlvbigpOiBOb2RlSW1tZWRpYXRlfSB1bnJlZlxuICovXG4vKiBlc2xpbnQtZW5hYmxlIGpzZG9jL3JlcXVpcmUtcHJvcGVydHktZGVzY3JpcHRpb24gKi9cblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuXG4vKipcbiAqIE1vY2tzIGF2YWlsYWJsZSBmZWF0dXJlcyBpbiB0aGUgc3BlY2lmaWVkIGdsb2JhbCBuYW1lc3BhY2UuXG4gKlxuICogQHBhcmFtIHsqfSBfZ2xvYmFsIE5hbWVzcGFjZSB0byBtb2NrIChlLmcuIGB3aW5kb3dgKVxuICogQHJldHVybnMge0Zha2VUaW1lcnN9XG4gKi9cbmZ1bmN0aW9uIHdpdGhHbG9iYWwoX2dsb2JhbCkge1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IF9nbG9iYWwubmF2aWdhdG9yICYmIF9nbG9iYWwubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICBjb25zdCBpc1J1bm5pbmdJbklFID0gdXNlckFnZW50ICYmIHVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSBcIikgPiAtMTtcbiAgICBjb25zdCBtYXhUaW1lb3V0ID0gTWF0aC5wb3coMiwgMzEpIC0gMTsgLy9zZWUgaHR0cHM6Ly9oZXljYW0uZ2l0aHViLmlvL3dlYmlkbC8jYWJzdHJhY3Qtb3BkZWYtY29udmVydHRvaW50XG4gICAgY29uc3QgaWRDb3VudGVyU3RhcnQgPSAxZTEyOyAvLyBhcmJpdHJhcmlseSBsYXJnZSBudW1iZXIgdG8gYXZvaWQgY29sbGlzaW9ucyB3aXRoIG5hdGl2ZSB0aW1lciBJRHNcbiAgICBjb25zdCBOT09QID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgY29uc3QgTk9PUF9BUlJBWSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH07XG4gICAgY29uc3QgdGltZW91dFJlc3VsdCA9IF9nbG9iYWwuc2V0VGltZW91dChOT09QLCAwKTtcbiAgICBjb25zdCBhZGRUaW1lclJldHVybnNPYmplY3QgPSB0eXBlb2YgdGltZW91dFJlc3VsdCA9PT0gXCJvYmplY3RcIjtcbiAgICBjb25zdCBocnRpbWVQcmVzZW50ID1cbiAgICAgICAgX2dsb2JhbC5wcm9jZXNzICYmIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MuaHJ0aW1lID09PSBcImZ1bmN0aW9uXCI7XG4gICAgY29uc3QgaHJ0aW1lQmlnaW50UHJlc2VudCA9XG4gICAgICAgIGhydGltZVByZXNlbnQgJiYgdHlwZW9mIF9nbG9iYWwucHJvY2Vzcy5ocnRpbWUuYmlnaW50ID09PSBcImZ1bmN0aW9uXCI7XG4gICAgY29uc3QgbmV4dFRpY2tQcmVzZW50ID1cbiAgICAgICAgX2dsb2JhbC5wcm9jZXNzICYmIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MubmV4dFRpY2sgPT09IFwiZnVuY3Rpb25cIjtcbiAgICBjb25zdCB1dGlsUHJvbWlzaWZ5ID0gX2dsb2JhbC5wcm9jZXNzICYmIHJlcXVpcmUoXCJ1dGlsXCIpLnByb21pc2lmeTtcbiAgICBjb25zdCBwZXJmb3JtYW5jZVByZXNlbnQgPVxuICAgICAgICBfZ2xvYmFsLnBlcmZvcm1hbmNlICYmIHR5cGVvZiBfZ2xvYmFsLnBlcmZvcm1hbmNlLm5vdyA9PT0gXCJmdW5jdGlvblwiO1xuICAgIGNvbnN0IGhhc1BlcmZvcm1hbmNlUHJvdG90eXBlID1cbiAgICAgICAgX2dsb2JhbC5QZXJmb3JtYW5jZSAmJlxuICAgICAgICAodHlwZW9mIF9nbG9iYWwuUGVyZm9ybWFuY2UpLm1hdGNoKC9eKGZ1bmN0aW9ufG9iamVjdCkkLyk7XG4gICAgY29uc3QgaGFzUGVyZm9ybWFuY2VDb25zdHJ1Y3RvclByb3RvdHlwZSA9XG4gICAgICAgIF9nbG9iYWwucGVyZm9ybWFuY2UgJiZcbiAgICAgICAgX2dsb2JhbC5wZXJmb3JtYW5jZS5jb25zdHJ1Y3RvciAmJlxuICAgICAgICBfZ2xvYmFsLnBlcmZvcm1hbmNlLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICBjb25zdCBxdWV1ZU1pY3JvdGFza1ByZXNlbnQgPSBfZ2xvYmFsLmhhc093blByb3BlcnR5KFwicXVldWVNaWNyb3Rhc2tcIik7XG4gICAgY29uc3QgcmVxdWVzdEFuaW1hdGlvbkZyYW1lUHJlc2VudCA9XG4gICAgICAgIF9nbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmXG4gICAgICAgIHR5cGVvZiBfZ2xvYmFsLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiO1xuICAgIGNvbnN0IGNhbmNlbEFuaW1hdGlvbkZyYW1lUHJlc2VudCA9XG4gICAgICAgIF9nbG9iYWwuY2FuY2VsQW5pbWF0aW9uRnJhbWUgJiZcbiAgICAgICAgdHlwZW9mIF9nbG9iYWwuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIjtcbiAgICBjb25zdCByZXF1ZXN0SWRsZUNhbGxiYWNrUHJlc2VudCA9XG4gICAgICAgIF9nbG9iYWwucmVxdWVzdElkbGVDYWxsYmFjayAmJlxuICAgICAgICB0eXBlb2YgX2dsb2JhbC5yZXF1ZXN0SWRsZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCI7XG4gICAgY29uc3QgY2FuY2VsSWRsZUNhbGxiYWNrUHJlc2VudCA9XG4gICAgICAgIF9nbG9iYWwuY2FuY2VsSWRsZUNhbGxiYWNrICYmXG4gICAgICAgIHR5cGVvZiBfZ2xvYmFsLmNhbmNlbElkbGVDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiO1xuICAgIGNvbnN0IHNldEltbWVkaWF0ZVByZXNlbnQgPVxuICAgICAgICBfZ2xvYmFsLnNldEltbWVkaWF0ZSAmJiB0eXBlb2YgX2dsb2JhbC5zZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIjtcblxuICAgIC8vIE1ha2UgcHJvcGVydGllcyB3cml0YWJsZSBpbiBJRSwgYXMgcGVyXG4gICAgLy8gaHR0cHM6Ly93d3cuYWRlcXVhdGVseWdvb2QuY29tL1JlcGxhY2luZy1zZXRUaW1lb3V0LUdsb2JhbGx5Lmh0bWxcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1zZWxmLWFzc2lnbiAqL1xuICAgIGlmIChpc1J1bm5pbmdJbklFKSB7XG4gICAgICAgIF9nbG9iYWwuc2V0VGltZW91dCA9IF9nbG9iYWwuc2V0VGltZW91dDtcbiAgICAgICAgX2dsb2JhbC5jbGVhclRpbWVvdXQgPSBfZ2xvYmFsLmNsZWFyVGltZW91dDtcbiAgICAgICAgX2dsb2JhbC5zZXRJbnRlcnZhbCA9IF9nbG9iYWwuc2V0SW50ZXJ2YWw7XG4gICAgICAgIF9nbG9iYWwuY2xlYXJJbnRlcnZhbCA9IF9nbG9iYWwuY2xlYXJJbnRlcnZhbDtcbiAgICAgICAgX2dsb2JhbC5EYXRlID0gX2dsb2JhbC5EYXRlO1xuICAgIH1cblxuICAgIC8vIHNldEltbWVkaWF0ZSBpcyBub3QgYSBzdGFuZGFyZCBmdW5jdGlvblxuICAgIC8vIGF2b2lkIGFkZGluZyB0aGUgcHJvcCB0byB0aGUgd2luZG93IG9iamVjdCBpZiBub3QgcHJlc2VudFxuICAgIGlmIChzZXRJbW1lZGlhdGVQcmVzZW50KSB7XG4gICAgICAgIF9nbG9iYWwuc2V0SW1tZWRpYXRlID0gX2dsb2JhbC5zZXRJbW1lZGlhdGU7XG4gICAgICAgIF9nbG9iYWwuY2xlYXJJbW1lZGlhdGUgPSBfZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXNlbGYtYXNzaWduICovXG5cbiAgICBfZ2xvYmFsLmNsZWFyVGltZW91dCh0aW1lb3V0UmVzdWx0KTtcblxuICAgIGNvbnN0IE5hdGl2ZURhdGUgPSBfZ2xvYmFsLkRhdGU7XG4gICAgbGV0IHVuaXF1ZVRpbWVySWQgPSBpZENvdW50ZXJTdGFydDtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlckZpbml0ZShudW0pIHtcbiAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShudW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKG51bSk7XG4gICAgfVxuXG4gICAgbGV0IGlzTmVhckluZmluaXRlTGltaXQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGVja0lzTmVhckluZmluaXRlTGltaXQoY2xvY2ssIGkpIHtcbiAgICAgICAgaWYgKGNsb2NrLmxvb3BMaW1pdCAmJiBpID09PSBjbG9jay5sb29wTGltaXQgLSAxKSB7XG4gICAgICAgICAgICBpc05lYXJJbmZpbml0ZUxpbWl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzZXRJc05lYXJJbmZpbml0ZUxpbWl0KCkge1xuICAgICAgICBpc05lYXJJbmZpbml0ZUxpbWl0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2Ugc3RyaW5ncyBsaWtlIFwiMDE6MTA6MDBcIiAobWVhbmluZyAxIGhvdXIsIDEwIG1pbnV0ZXMsIDAgc2Vjb25kcykgaW50b1xuICAgICAqIG51bWJlciBvZiBtaWxsaXNlY29uZHMuIFRoaXMgaXMgdXNlZCB0byBzdXBwb3J0IGh1bWFuLXJlYWRhYmxlIHN0cmluZ3MgcGFzc2VkXG4gICAgICogdG8gY2xvY2sudGljaygpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZVRpbWUoc3RyKSB7XG4gICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0cmluZ3MgPSBzdHIuc3BsaXQoXCI6XCIpO1xuICAgICAgICBjb25zdCBsID0gc3RyaW5ncy5sZW5ndGg7XG4gICAgICAgIGxldCBpID0gbDtcbiAgICAgICAgbGV0IG1zID0gMDtcbiAgICAgICAgbGV0IHBhcnNlZDtcblxuICAgICAgICBpZiAobCA+IDMgfHwgIS9eKFxcZFxcZDopezAsMn1cXGRcXGQ/JC8udGVzdChzdHIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJ0aWNrIG9ubHkgdW5kZXJzdGFuZHMgbnVtYmVycywgJ206cycgYW5kICdoOm06cycuIEVhY2ggcGFydCBtdXN0IGJlIHR3byBkaWdpdHNcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZ3NbaV0sIDEwKTtcblxuICAgICAgICAgICAgaWYgKHBhcnNlZCA+PSA2MCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0aW1lICR7c3RyfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtcyArPSBwYXJzZWQgKiBNYXRoLnBvdyg2MCwgbCAtIGkgLSAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtcyAqIDEwMDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBkZWNpbWFsIHBhcnQgb2YgdGhlIG1pbGxpc2Vjb25kIHZhbHVlIGFzIG5hbm9zZWNvbmRzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbXNGbG9hdCB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kc1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGFuIGludGVnZXIgbnVtYmVyIG9mIG5hbm9zZWNvbmRzIGluIHRoZSByYW5nZSBbMCwxZTYpXG4gICAgICpcbiAgICAgKiBFeGFtcGxlOiBuYW5vUmVtYWluZXIoMTIzLjQ1Njc4OSkgLT4gNDU2Nzg5XG4gICAgICovXG4gICAgZnVuY3Rpb24gbmFub1JlbWFpbmRlcihtc0Zsb2F0KSB7XG4gICAgICAgIGNvbnN0IG1vZHVsbyA9IDFlNjtcbiAgICAgICAgY29uc3QgcmVtYWluZGVyID0gKG1zRmxvYXQgKiAxZTYpICUgbW9kdWxvO1xuICAgICAgICBjb25zdCBwb3NpdGl2ZVJlbWFpbmRlciA9XG4gICAgICAgICAgICByZW1haW5kZXIgPCAwID8gcmVtYWluZGVyICsgbW9kdWxvIDogcmVtYWluZGVyO1xuXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKHBvc2l0aXZlUmVtYWluZGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGdyb2sgdGhlIGBub3dgIHBhcmFtZXRlciB0byBjcmVhdGVDbG9jay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RGF0ZXxudW1iZXJ9IGVwb2NoIHRoZSBzeXN0ZW0gdGltZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0RXBvY2goZXBvY2gpIHtcbiAgICAgICAgaWYgKCFlcG9jaCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBlcG9jaC5nZXRUaW1lID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBlcG9jaC5nZXRUaW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBlcG9jaCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuIGVwb2NoO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJub3cgc2hvdWxkIGJlIG1pbGxpc2Vjb25kcyBzaW5jZSBVTklYIGVwb2NoXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvXG4gICAgICogQHBhcmFtIHtUaW1lcn0gdGltZXJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpblJhbmdlKGZyb20sIHRvLCB0aW1lcikge1xuICAgICAgICByZXR1cm4gdGltZXIgJiYgdGltZXIuY2FsbEF0ID49IGZyb20gJiYgdGltZXIuY2FsbEF0IDw9IHRvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHBhcmFtIHtUaW1lcn0gam9iXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SW5maW5pdGVMb29wRXJyb3IoY2xvY2ssIGpvYikge1xuICAgICAgICBjb25zdCBpbmZpbml0ZUxvb3BFcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBBYm9ydGluZyBhZnRlciBydW5uaW5nICR7Y2xvY2subG9vcExpbWl0fSB0aW1lcnMsIGFzc3VtaW5nIGFuIGluZmluaXRlIGxvb3AhYFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICgham9iLmVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5maW5pdGVMb29wRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwYXR0ZXJuIG5ldmVyIG1hdGNoZWQgaW4gTm9kZVxuICAgICAgICBjb25zdCBjb21wdXRlZFRhcmdldFBhdHRlcm4gPSAvdGFyZ2V0XFwuKls8fCh8W10uKj9bPnxcXF18KV1cXHMqLztcbiAgICAgICAgbGV0IGNsb2NrTWV0aG9kUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICBTdHJpbmcoT2JqZWN0LmtleXMoY2xvY2spLmpvaW4oXCJ8XCIpKVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChhZGRUaW1lclJldHVybnNPYmplY3QpIHtcbiAgICAgICAgICAgIC8vIG5vZGUuanMgZW52aXJvbm1lbnRcbiAgICAgICAgICAgIGNsb2NrTWV0aG9kUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAgICAgYFxcXFxzK2F0IChPYmplY3RcXFxcLik/KD86JHtPYmplY3Qua2V5cyhjbG9jaykuam9pbihcInxcIil9KVxcXFxzK2BcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2hlZExpbmVJbmRleCA9IC0xO1xuICAgICAgICBqb2IuZXJyb3Iuc3RhY2suc3BsaXQoXCJcXG5cIikuc29tZShmdW5jdGlvbiAobGluZSwgaSkge1xuICAgICAgICAgICAgLy8gSWYgd2UndmUgbWF0Y2hlZCBhIGNvbXB1dGVkIHRhcmdldCBsaW5lIChlLmcuIHNldFRpbWVvdXQpIHRoZW4gd2VcbiAgICAgICAgICAgIC8vIGRvbid0IG5lZWQgdG8gbG9vayBhbnkgZnVydGhlci4gUmV0dXJuIHRydWUgdG8gc3RvcCBpdGVyYXRpbmcuXG4gICAgICAgICAgICBjb25zdCBtYXRjaGVkQ29tcHV0ZWRUYXJnZXQgPSBsaW5lLm1hdGNoKGNvbXB1dGVkVGFyZ2V0UGF0dGVybik7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChtYXRjaGVkQ29tcHV0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkTGluZUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgd2UndmUgbWF0Y2hlZCBhIGNsb2NrIG1ldGhvZCBsaW5lLCB0aGVuIHRoZXJlIG1heSBzdGlsbCBiZVxuICAgICAgICAgICAgLy8gb3RoZXJzIGZ1cnRoZXIgZG93biB0aGUgdHJhY2UuIFJldHVybiBmYWxzZSB0byBrZWVwIGl0ZXJhdGluZy5cbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRDbG9ja01ldGhvZCA9IGxpbmUubWF0Y2goY2xvY2tNZXRob2RQYXR0ZXJuKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVkQ2xvY2tNZXRob2QpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkTGluZUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmVuJ3QgbWF0Y2hlZCBhbnl0aGluZyBvbiB0aGlzIGxpbmUsIGJ1dCB3ZSBtYXRjaGVkXG4gICAgICAgICAgICAvLyBwcmV2aW91c2x5IGFuZCBzZXQgdGhlIG1hdGNoZWQgbGluZSBpbmRleCwgdGhlbiB3ZSBjYW4gc3RvcC5cbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmVuJ3QgbWF0Y2hlZCBwcmV2aW91c2x5LCB0aGVuIHdlIHNob3VsZCBrZWVwIGl0ZXJhdGluZy5cbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkTGluZUluZGV4ID49IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHN0YWNrID0gYCR7aW5maW5pdGVMb29wRXJyb3J9XFxuJHtqb2IudHlwZSB8fCBcIk1pY3JvdGFza1wifSAtICR7XG4gICAgICAgICAgICBqb2IuZnVuYy5uYW1lIHx8IFwiYW5vbnltb3VzXCJcbiAgICAgICAgfVxcbiR7am9iLmVycm9yLnN0YWNrXG4gICAgICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgICAgIC5zbGljZShtYXRjaGVkTGluZUluZGV4ICsgMSlcbiAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpfWA7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbmZpbml0ZUxvb3BFcnJvciwgXCJzdGFja1wiLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHN0YWNrLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIG5vb3BcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmZpbml0ZUxvb3BFcnJvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0RhdGV9IHRhcmdldFxuICAgICAqIEBwYXJhbSB7RGF0ZX0gc291cmNlXG4gICAgICogQHJldHVybnMge0RhdGV9IHRoZSB0YXJnZXQgYWZ0ZXIgbW9kaWZpY2F0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pcnJvckRhdGVQcm9wZXJ0aWVzKHRhcmdldCwgc291cmNlKSB7XG4gICAgICAgIGxldCBwcm9wO1xuICAgICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IHNwZWNpYWwgbm93IGltcGxlbWVudGF0aW9uXG4gICAgICAgIGlmIChzb3VyY2Uubm93KSB7XG4gICAgICAgICAgICB0YXJnZXQubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuY2xvY2subm93O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXQubm93O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IHNwZWNpYWwgdG9Tb3VyY2UgaW1wbGVtZW50YXRpb25cbiAgICAgICAgaWYgKHNvdXJjZS50b1NvdXJjZSkge1xuICAgICAgICAgICAgdGFyZ2V0LnRvU291cmNlID0gZnVuY3Rpb24gdG9Tb3VyY2UoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS50b1NvdXJjZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXQudG9Tb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgc3BlY2lhbCB0b1N0cmluZyBpbXBsZW1lbnRhdGlvblxuICAgICAgICB0YXJnZXQudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UudG9TdHJpbmcoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXJnZXQucHJvdG90eXBlID0gc291cmNlLnByb3RvdHlwZTtcbiAgICAgICAgdGFyZ2V0LnBhcnNlID0gc291cmNlLnBhcnNlO1xuICAgICAgICB0YXJnZXQuVVRDID0gc291cmNlLlVUQztcbiAgICAgICAgdGFyZ2V0LnByb3RvdHlwZS50b1VUQ1N0cmluZyA9IHNvdXJjZS5wcm90b3R5cGUudG9VVENTdHJpbmc7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc2RvYy9yZXF1aXJlLWpzZG9jXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSgpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtb250aFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gZGF0ZVxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaG91clxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbWludXRlXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZWNvbmRcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG1zXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtEYXRlfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gQ2xvY2tEYXRlKHllYXIsIG1vbnRoLCBkYXRlLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbXMpIHtcbiAgICAgICAgICAgIC8vIHRoZSBEYXRlIGNvbnN0cnVjdG9yIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCByZWYgRWNtYS0yNjIgRWRpdGlvbiA1LjEsIHNlY3Rpb24gMTUuOS4yLlxuICAgICAgICAgICAgLy8gVGhpcyByZW1haW5zIHNvIGluIHRoZSAxMHRoIGVkaXRpb24gb2YgMjAxOSBhcyB3ZWxsLlxuICAgICAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIENsb2NrRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZURhdGUoQ2xvY2tEYXRlLmNsb2NrLm5vdykudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgRGF0ZSBpcyBjYWxsZWQgYXMgYSBjb25zdHJ1Y3RvciB3aXRoICduZXcnIGtleXdvcmRcbiAgICAgICAgICAgIC8vIERlZmVuc2l2ZSBhbmQgdmVyYm9zZSB0byBhdm9pZCBwb3RlbnRpYWwgaGFybSBpbiBwYXNzaW5nXG4gICAgICAgICAgICAvLyBleHBsaWNpdCB1bmRlZmluZWQgd2hlbiB1c2VyIGRvZXMgbm90IHBhc3MgYXJndW1lbnRcbiAgICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVEYXRlKENsb2NrRGF0ZS5jbG9jay5ub3cpO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVEYXRlKHllYXIpO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVEYXRlKHllYXIsIG1vbnRoKTtcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTmF0aXZlRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSk7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZURhdGUoeWVhciwgbW9udGgsIGRhdGUsIGhvdXIpO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVEYXRlKHllYXIsIG1vbnRoLCBkYXRlLCBob3VyLCBtaW51dGUpO1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW51dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWNvbmRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE5hdGl2ZURhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWlycm9yRGF0ZVByb3BlcnRpZXMoQ2xvY2tEYXRlLCBOYXRpdmVEYXRlKTtcbiAgICB9XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc2RvYy9yZXF1aXJlLWpzZG9jXG4gICAgZnVuY3Rpb24gZW5xdWV1ZUpvYihjbG9jaywgam9iKSB7XG4gICAgICAgIC8vIGVucXVldWVzIGEgbWljcm90aWNrLWRlZmVycmVkIHRhc2sgLSBlY21hMjYyLyNzZWMtZW5xdWV1ZWpvYlxuICAgICAgICBpZiAoIWNsb2NrLmpvYnMpIHtcbiAgICAgICAgICAgIGNsb2NrLmpvYnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjbG9jay5qb2JzLnB1c2goam9iKTtcbiAgICB9XG5cbiAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZSBqc2RvYy9yZXF1aXJlLWpzZG9jXG4gICAgZnVuY3Rpb24gcnVuSm9icyhjbG9jaykge1xuICAgICAgICAvLyBydW5zIGFsbCBtaWNyb3RpY2stZGVmZXJyZWQgdGFza3MgLSBlY21hMjYyLyNzZWMtcnVuam9ic1xuICAgICAgICBpZiAoIWNsb2NrLmpvYnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsb2NrLmpvYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGpvYiA9IGNsb2NrLmpvYnNbaV07XG4gICAgICAgICAgICBqb2IuZnVuYy5hcHBseShudWxsLCBqb2IuYXJncyk7XG5cbiAgICAgICAgICAgIGNoZWNrSXNOZWFySW5maW5pdGVMaW1pdChjbG9jaywgaSk7XG4gICAgICAgICAgICBpZiAoY2xvY2subG9vcExpbWl0ICYmIGkgPiBjbG9jay5sb29wTGltaXQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBnZXRJbmZpbml0ZUxvb3BFcnJvcihjbG9jaywgam9iKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXNldElzTmVhckluZmluaXRlTGltaXQoKTtcbiAgICAgICAgY2xvY2suam9icyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHBhcmFtIHtUaW1lcn0gdGltZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpZCBvZiB0aGUgY3JlYXRlZCB0aW1lclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZFRpbWVyKGNsb2NrLCB0aW1lcikge1xuICAgICAgICBpZiAodGltZXIuZnVuYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayBtdXN0IGJlIHByb3ZpZGVkIHRvIHRpbWVyIGNhbGxzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkZFRpbWVyUmV0dXJuc09iamVjdCkge1xuICAgICAgICAgICAgLy8gTm9kZS5qcyBlbnZpcm9ubWVudFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aW1lci5mdW5jICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgW0VSUl9JTlZBTElEX0NBTExCQUNLXTogQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uLiBSZWNlaXZlZCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIuZnVuY1xuICAgICAgICAgICAgICAgICAgICB9IG9mIHR5cGUgJHt0eXBlb2YgdGltZXIuZnVuY31gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05lYXJJbmZpbml0ZUxpbWl0KSB7XG4gICAgICAgICAgICB0aW1lci5lcnJvciA9IG5ldyBFcnJvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGltZXIudHlwZSA9IHRpbWVyLmltbWVkaWF0ZSA/IFwiSW1tZWRpYXRlXCIgOiBcIlRpbWVvdXRcIjtcblxuICAgICAgICBpZiAodGltZXIuaGFzT3duUHJvcGVydHkoXCJkZWxheVwiKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aW1lci5kZWxheSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRpbWVyLmRlbGF5ID0gcGFyc2VJbnQodGltZXIuZGVsYXksIDEwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc051bWJlckZpbml0ZSh0aW1lci5kZWxheSkpIHtcbiAgICAgICAgICAgICAgICB0aW1lci5kZWxheSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aW1lci5kZWxheSA9IHRpbWVyLmRlbGF5ID4gbWF4VGltZW91dCA/IDEgOiB0aW1lci5kZWxheTtcbiAgICAgICAgICAgIHRpbWVyLmRlbGF5ID0gTWF0aC5tYXgoMCwgdGltZXIuZGVsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbWVyLmhhc093blByb3BlcnR5KFwiaW50ZXJ2YWxcIikpIHtcbiAgICAgICAgICAgIHRpbWVyLnR5cGUgPSBcIkludGVydmFsXCI7XG4gICAgICAgICAgICB0aW1lci5pbnRlcnZhbCA9IHRpbWVyLmludGVydmFsID4gbWF4VGltZW91dCA/IDEgOiB0aW1lci5pbnRlcnZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aW1lci5oYXNPd25Qcm9wZXJ0eShcImFuaW1hdGlvblwiKSkge1xuICAgICAgICAgICAgdGltZXIudHlwZSA9IFwiQW5pbWF0aW9uRnJhbWVcIjtcbiAgICAgICAgICAgIHRpbWVyLmFuaW1hdGlvbiA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGltZXIuaGFzT3duUHJvcGVydHkoXCJpZGxlQ2FsbGJhY2tcIikpIHtcbiAgICAgICAgICAgIHRpbWVyLnR5cGUgPSBcIklkbGVDYWxsYmFja1wiO1xuICAgICAgICAgICAgdGltZXIuaWRsZUNhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2xvY2sudGltZXJzKSB7XG4gICAgICAgICAgICBjbG9jay50aW1lcnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVyLmlkID0gdW5pcXVlVGltZXJJZCsrO1xuICAgICAgICB0aW1lci5jcmVhdGVkQXQgPSBjbG9jay5ub3c7XG4gICAgICAgIHRpbWVyLmNhbGxBdCA9XG4gICAgICAgICAgICBjbG9jay5ub3cgKyAocGFyc2VJbnQodGltZXIuZGVsYXkpIHx8IChjbG9jay5kdXJpbmdUaWNrID8gMSA6IDApKTtcblxuICAgICAgICBjbG9jay50aW1lcnNbdGltZXIuaWRdID0gdGltZXI7XG5cbiAgICAgICAgaWYgKGFkZFRpbWVyUmV0dXJuc09iamVjdCkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0ge1xuICAgICAgICAgICAgICAgIHJlZmVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVucmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhhc1JlZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZlZDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IFt0aW1lci5mdW5jLCB0aW1lci5kZWxheV0uY29uY2F0KHRpbWVyLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dC5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtTeW1ib2wudG9QcmltaXRpdmVdOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aW1lci5pZDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGltZXIuaWQ7XG4gICAgfVxuXG4gICAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiBcIm9mZlwiICovXG4gICAgLyoqXG4gICAgICogVGltZXIgY29tcGFyaXRvclxuICAgICAqXG4gICAgICogQHBhcmFtIHtUaW1lcn0gYVxuICAgICAqIEBwYXJhbSB7VGltZXJ9IGJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBhcmVUaW1lcnMoYSwgYikge1xuICAgICAgICAvLyBTb3J0IGZpcnN0IGJ5IGFic29sdXRlIHRpbWluZ1xuICAgICAgICBpZiAoYS5jYWxsQXQgPCBiLmNhbGxBdCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhLmNhbGxBdCA+IGIuY2FsbEF0KSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvcnQgbmV4dCBieSBpbW1lZGlhdGUsIGltbWVkaWF0ZSB0aW1lcnMgdGFrZSBwcmVjZWRlbmNlXG4gICAgICAgIGlmIChhLmltbWVkaWF0ZSAmJiAhYi5pbW1lZGlhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWEuaW1tZWRpYXRlICYmIGIuaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvcnQgbmV4dCBieSBjcmVhdGlvbiB0aW1lLCBlYXJsaWVyLWNyZWF0ZWQgdGltZXJzIHRha2UgcHJlY2VkZW5jZVxuICAgICAgICBpZiAoYS5jcmVhdGVkQXQgPCBiLmNyZWF0ZWRBdCkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhLmNyZWF0ZWRBdCA+IGIuY3JlYXRlZEF0KSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNvcnQgbmV4dCBieSBpZCwgbG93ZXItaWQgdGltZXJzIHRha2UgcHJlY2VkZW5jZVxuICAgICAgICBpZiAoYS5pZCA8IGIuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYS5pZCA+IGIuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXMgdGltZXIgaWRzIGFyZSB1bmlxdWUsIG5vIGZhbGxiYWNrIGAwYCBpcyBuZWNlc3NhcnlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Nsb2NrfSBjbG9ja1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7VGltZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlyc3RUaW1lckluUmFuZ2UoY2xvY2ssIGZyb20sIHRvKSB7XG4gICAgICAgIGNvbnN0IHRpbWVycyA9IGNsb2NrLnRpbWVycztcbiAgICAgICAgbGV0IHRpbWVyID0gbnVsbDtcbiAgICAgICAgbGV0IGlkLCBpc0luUmFuZ2U7XG5cbiAgICAgICAgZm9yIChpZCBpbiB0aW1lcnMpIHtcbiAgICAgICAgICAgIGlmICh0aW1lcnMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICAgICAgaXNJblJhbmdlID0gaW5SYW5nZShmcm9tLCB0bywgdGltZXJzW2lkXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGlzSW5SYW5nZSAmJlxuICAgICAgICAgICAgICAgICAgICAoIXRpbWVyIHx8IGNvbXBhcmVUaW1lcnModGltZXIsIHRpbWVyc1tpZF0pID09PSAxKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IHRpbWVyc1tpZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHJldHVybnMge1RpbWVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpcnN0VGltZXIoY2xvY2spIHtcbiAgICAgICAgY29uc3QgdGltZXJzID0gY2xvY2sudGltZXJzO1xuICAgICAgICBsZXQgdGltZXIgPSBudWxsO1xuICAgICAgICBsZXQgaWQ7XG5cbiAgICAgICAgZm9yIChpZCBpbiB0aW1lcnMpIHtcbiAgICAgICAgICAgIGlmICh0aW1lcnMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lciB8fCBjb21wYXJlVGltZXJzKHRpbWVyLCB0aW1lcnNbaWRdKSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IHRpbWVyc1tpZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHJldHVybnMge1RpbWVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxhc3RUaW1lcihjbG9jaykge1xuICAgICAgICBjb25zdCB0aW1lcnMgPSBjbG9jay50aW1lcnM7XG4gICAgICAgIGxldCB0aW1lciA9IG51bGw7XG4gICAgICAgIGxldCBpZDtcblxuICAgICAgICBmb3IgKGlkIGluIHRpbWVycykge1xuICAgICAgICAgICAgaWYgKHRpbWVycy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVyIHx8IGNvbXBhcmVUaW1lcnModGltZXIsIHRpbWVyc1tpZF0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IHRpbWVyc1tpZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Q2xvY2t9IGNsb2NrXG4gICAgICogQHBhcmFtIHtUaW1lcn0gdGltZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYWxsVGltZXIoY2xvY2ssIHRpbWVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGltZXIuaW50ZXJ2YWwgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNsb2NrLnRpbWVyc1t0aW1lci5pZF0uY2FsbEF0ICs9IHRpbWVyLmludGVydmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNsb2NrLnRpbWVyc1t0aW1lci5pZF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRpbWVyLmZ1bmMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGltZXIuZnVuYy5hcHBseShudWxsLCB0aW1lci5hcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIGVzbGludCBuby1ldmFsOiBcIm9mZlwiICovXG4gICAgICAgICAgICBjb25zdCBldmFsMiA9IGV2YWw7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGV2YWwyKHRpbWVyLmZ1bmMpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgY2xlYXIgaGFuZGxlciBuYW1lIGZvciBhIGdpdmVuIHRpbWVyIHR5cGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0dHlwZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldENsZWFySGFuZGxlcih0dHlwZSkge1xuICAgICAgICBpZiAodHR5cGUgPT09IFwiSWRsZUNhbGxiYWNrXCIgfHwgdHR5cGUgPT09IFwiQW5pbWF0aW9uRnJhbWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIGBjYW5jZWwke3R0eXBlfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGBjbGVhciR7dHR5cGV9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHNjaGVkdWxlIGhhbmRsZXIgbmFtZSBmb3IgYSBnaXZlbiB0aW1lciB0eXBlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHR5cGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTY2hlZHVsZUhhbmRsZXIodHR5cGUpIHtcbiAgICAgICAgaWYgKHR0eXBlID09PSBcIklkbGVDYWxsYmFja1wiIHx8IHR0eXBlID09PSBcIkFuaW1hdGlvbkZyYW1lXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgcmVxdWVzdCR7dHR5cGV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYHNldCR7dHR5cGV9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFub255bW91cyBmdW5jdGlvbiB0byB3YXJuIG9ubHkgb25jZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZVdhcm5PbmNlKCkge1xuICAgICAgICBsZXQgY2FsbHMgPSAwO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgICAgICAhY2FsbHMrKyAmJiBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3Qgd2Fybk9uY2UgPSBjcmVhdGVXYXJuT25jZSgpO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtDbG9ja30gY2xvY2tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXJJZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0dHlwZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsZWFyVGltZXIoY2xvY2ssIHRpbWVySWQsIHR0eXBlKSB7XG4gICAgICAgIGlmICghdGltZXJJZCkge1xuICAgICAgICAgICAgLy8gbnVsbCBhcHBlYXJzIHRvIGJlIGFsbG93ZWQgaW4gbW9zdCBicm93c2VycywgYW5kIGFwcGVhcnMgdG8gYmVcbiAgICAgICAgICAgIC8vIHJlbGllZCB1cG9uIGJ5IHNvbWUgbGlicmFyaWVzLCBsaWtlIEJvb3RzdHJhcCBjYXJvdXNlbFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjbG9jay50aW1lcnMpIHtcbiAgICAgICAgICAgIGNsb2NrLnRpbWVycyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW4gTm9kZSwgdGhlIElEIGlzIHN0b3JlZCBhcyB0aGUgcHJpbWl0aXZlIHZhbHVlIGZvciBgVGltZW91dGAgb2JqZWN0c1xuICAgICAgICAvLyBmb3IgYEltbWVkaWF0ZWAgb2JqZWN0cywgbm8gSUQgZXhpc3RzLCBzbyBpdCBnZXRzIGNvZXJjZWQgdG8gTmFOXG4gICAgICAgIGNvbnN0IGlkID0gTnVtYmVyKHRpbWVySWQpO1xuXG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4oaWQpIHx8IGlkIDwgaWRDb3VudGVyU3RhcnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXJOYW1lID0gZ2V0Q2xlYXJIYW5kbGVyKHR0eXBlKTtcblxuICAgICAgICAgICAgaWYgKGNsb2NrLnNob3VsZENsZWFyTmF0aXZlVGltZXJzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmF0aXZlSGFuZGxlciA9IGNsb2NrW2BfJHtoYW5kbGVyTmFtZX1gXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIG5hdGl2ZUhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgICAgICA/IG5hdGl2ZUhhbmRsZXIodGltZXJJZClcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3YXJuT25jZShcbiAgICAgICAgICAgICAgICBgRmFrZVRpbWVyczogJHtoYW5kbGVyTmFtZX0gd2FzIGludm9rZWQgdG8gY2xlYXIgYSBuYXRpdmUgdGltZXIgaW5zdGVhZCBvZiBvbmUgY3JlYXRlZCBieSB0aGlzIGxpYnJhcnkuYCArXG4gICAgICAgICAgICAgICAgICAgIFwiXFxuVG8gYXV0b21hdGljYWxseSBjbGVhbi11cCBuYXRpdmUgdGltZXJzLCB1c2UgYHNob3VsZENsZWFyTmF0aXZlVGltZXJzYC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbG9jay50aW1lcnMuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSBJRCBtYXRjaGVzIGEgdGltZXIgb2YgdGhlIGNvcnJlY3QgdHlwZVxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBjbG9jay50aW1lcnNbaWRdO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRpbWVyLnR5cGUgPT09IHR0eXBlIHx8XG4gICAgICAgICAgICAgICAgKHRpbWVyLnR5cGUgPT09IFwiVGltZW91dFwiICYmIHR0eXBlID09PSBcIkludGVydmFsXCIpIHx8XG4gICAgICAgICAgICAgICAgKHRpbWVyLnR5cGUgPT09IFwiSW50ZXJ2YWxcIiAmJiB0dHlwZSA9PT0gXCJUaW1lb3V0XCIpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgY2xvY2sudGltZXJzW2lkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xlYXIgPSBnZXRDbGVhckhhbmRsZXIodHR5cGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjaGVkdWxlID0gZ2V0U2NoZWR1bGVIYW5kbGVyKHRpbWVyLnR5cGUpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYENhbm5vdCBjbGVhciB0aW1lcjogdGltZXIgY3JlYXRlZCB3aXRoICR7c2NoZWR1bGV9KCkgYnV0IGNsZWFyZWQgd2l0aCAke2NsZWFyfSgpYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Nsb2NrfSBjbG9ja1xuICAgICAqIEBwYXJhbSB7Q29uZmlnfSBjb25maWdcbiAgICAgKiBAcmV0dXJucyB7VGltZXJbXX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmluc3RhbGwoY2xvY2ssIGNvbmZpZykge1xuICAgICAgICBsZXQgbWV0aG9kLCBpLCBsO1xuICAgICAgICBjb25zdCBpbnN0YWxsZWRIclRpbWUgPSBcIl9ocnRpbWVcIjtcbiAgICAgICAgY29uc3QgaW5zdGFsbGVkTmV4dFRpY2sgPSBcIl9uZXh0VGlja1wiO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBjbG9jay5tZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbWV0aG9kID0gY2xvY2subWV0aG9kc1tpXTtcbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiaHJ0aW1lXCIgJiYgX2dsb2JhbC5wcm9jZXNzKSB7XG4gICAgICAgICAgICAgICAgX2dsb2JhbC5wcm9jZXNzLmhydGltZSA9IGNsb2NrW2luc3RhbGxlZEhyVGltZV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJuZXh0VGlja1wiICYmIF9nbG9iYWwucHJvY2Vzcykge1xuICAgICAgICAgICAgICAgIF9nbG9iYWwucHJvY2Vzcy5uZXh0VGljayA9IGNsb2NrW2luc3RhbGxlZE5leHRUaWNrXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInBlcmZvcm1hbmNlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFBlcmZEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgICAgICAgICAgY2xvY2ssXG4gICAgICAgICAgICAgICAgICAgIGBfJHttZXRob2R9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFBlcmZEZXNjcmlwdG9yICYmXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsUGVyZkRlc2NyaXB0b3IuZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgICFvcmlnaW5hbFBlcmZEZXNjcmlwdG9yLnNldFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICAgICBfZ2xvYmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxQZXJmRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3JpZ2luYWxQZXJmRGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgX2dsb2JhbFttZXRob2RdID0gY2xvY2tbYF8ke21ldGhvZH1gXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfZ2xvYmFsW21ldGhvZF0gJiYgX2dsb2JhbFttZXRob2RdLmhhZE93blByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIF9nbG9iYWxbbWV0aG9kXSA9IGNsb2NrW2BfJHttZXRob2R9YF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBfZ2xvYmFsW21ldGhvZF07XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50IG5vLWVtcHR5OiBcIm9mZlwiICovXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLnNob3VsZEFkdmFuY2VUaW1lID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfZ2xvYmFsLmNsZWFySW50ZXJ2YWwoY2xvY2suYXR0YWNoZWRJbnRlcnZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcmV2ZW50IG11bHRpcGxlIGV4ZWN1dGlvbnMgd2hpY2ggd2lsbCBjb21wbGV0ZWx5IHJlbW92ZSB0aGVzZSBwcm9wc1xuICAgICAgICBjbG9jay5tZXRob2RzID0gW107XG5cbiAgICAgICAgLy8gcmV0dXJuIHBlbmRpbmcgdGltZXJzLCB0byBlbmFibGUgY2hlY2tpbmcgd2hhdCB0aW1lcnMgcmVtYWluZWQgb24gdW5pbnN0YWxsXG4gICAgICAgIGlmICghY2xvY2sudGltZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGNsb2NrLnRpbWVycykubWFwKGZ1bmN0aW9uIG1hcHBlcihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjbG9jay50aW1lcnNba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldCB0aGUgdGFyZ2V0IGNvbnRhaW5pbmcgdGhlIG1ldGhvZCB0byByZXBsYWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCB0aGUga2V5bmFtZSBvZiB0aGUgbWV0aG9kIG9uIHRoZSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge0Nsb2NrfSBjbG9ja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhpamFja01ldGhvZCh0YXJnZXQsIG1ldGhvZCwgY2xvY2spIHtcbiAgICAgICAgY2xvY2tbbWV0aG9kXS5oYWRPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChcbiAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgIG1ldGhvZFxuICAgICAgICApO1xuICAgICAgICBjbG9ja1tgXyR7bWV0aG9kfWBdID0gdGFyZ2V0W21ldGhvZF07XG5cbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJEYXRlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBtaXJyb3JEYXRlUHJvcGVydGllcyhjbG9ja1ttZXRob2RdLCB0YXJnZXRbbWV0aG9kXSk7XG4gICAgICAgICAgICB0YXJnZXRbbWV0aG9kXSA9IGRhdGU7XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInBlcmZvcm1hbmNlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsUGVyZkRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgICAgICBtZXRob2RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBKU0RPTSBoYXMgYSByZWFkIG9ubHkgcGVyZm9ybWFuY2UgZmllbGQgc28gd2UgaGF2ZSB0byBzYXZlL2NvcHkgaXQgZGlmZmVyZW50bHlcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBlcmZEZXNjcmlwdG9yICYmXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQZXJmRGVzY3JpcHRvci5nZXQgJiZcbiAgICAgICAgICAgICAgICAhb3JpZ2luYWxQZXJmRGVzY3JpcHRvci5zZXRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgY2xvY2ssXG4gICAgICAgICAgICAgICAgICAgIGBfJHttZXRob2R9YCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxQZXJmRGVzY3JpcHRvclxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwZXJmRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICAgICAgICAgIGNsb2NrLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2RcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG1ldGhvZCwgcGVyZkRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbWV0aG9kXSA9IGNsb2NrW21ldGhvZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xvY2tbbWV0aG9kXS5hcHBseShjbG9jaywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgICAgIHRhcmdldFttZXRob2RdLFxuICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGNsb2NrW21ldGhvZF0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0W21ldGhvZF0uY2xvY2sgPSBjbG9jaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Nsb2NrfSBjbG9ja1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhZHZhbmNlVGltZURlbHRhXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9JbnRlcnZhbFRpY2soY2xvY2ssIGFkdmFuY2VUaW1lRGVsdGEpIHtcbiAgICAgICAgY2xvY2sudGljayhhZHZhbmNlVGltZURlbHRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZWRlZiB7b2JqZWN0fSBUaW1lcnNcbiAgICAgKiBAcHJvcGVydHkge3NldFRpbWVvdXR9IHNldFRpbWVvdXRcbiAgICAgKiBAcHJvcGVydHkge2NsZWFyVGltZW91dH0gY2xlYXJUaW1lb3V0XG4gICAgICogQHByb3BlcnR5IHtzZXRJbnRlcnZhbH0gc2V0SW50ZXJ2YWxcbiAgICAgKiBAcHJvcGVydHkge2NsZWFySW50ZXJ2YWx9IGNsZWFySW50ZXJ2YWxcbiAgICAgKiBAcHJvcGVydHkge0RhdGV9IERhdGVcbiAgICAgKiBAcHJvcGVydHkge1NldEltbWVkaWF0ZT19IHNldEltbWVkaWF0ZVxuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oTm9kZUltbWVkaWF0ZSk6IHZvaWQ9fSBjbGVhckltbWVkaWF0ZVxuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24obnVtYmVyW10pOm51bWJlcltdPX0gaHJ0aW1lXG4gICAgICogQHByb3BlcnR5IHtOZXh0VGljaz19IG5leHRUaWNrXG4gICAgICogQHByb3BlcnR5IHtQZXJmb3JtYW5jZT19IHBlcmZvcm1hbmNlXG4gICAgICogQHByb3BlcnR5IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWU9fSByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW49fSBxdWV1ZU1pY3JvdGFza1xuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24obnVtYmVyKTogdm9pZD19IGNhbmNlbEFuaW1hdGlvbkZyYW1lXG4gICAgICogQHByb3BlcnR5IHtSZXF1ZXN0SWRsZUNhbGxiYWNrPX0gcmVxdWVzdElkbGVDYWxsYmFja1xuICAgICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24obnVtYmVyKTogdm9pZD19IGNhbmNlbElkbGVDYWxsYmFja1xuICAgICAqL1xuXG4gICAgLyoqIEB0eXBlIHtUaW1lcnN9ICovXG4gICAgY29uc3QgdGltZXJzID0ge1xuICAgICAgICBzZXRUaW1lb3V0OiBfZ2xvYmFsLnNldFRpbWVvdXQsXG4gICAgICAgIGNsZWFyVGltZW91dDogX2dsb2JhbC5jbGVhclRpbWVvdXQsXG4gICAgICAgIHNldEludGVydmFsOiBfZ2xvYmFsLnNldEludGVydmFsLFxuICAgICAgICBjbGVhckludGVydmFsOiBfZ2xvYmFsLmNsZWFySW50ZXJ2YWwsXG4gICAgICAgIERhdGU6IF9nbG9iYWwuRGF0ZSxcbiAgICB9O1xuXG4gICAgaWYgKHNldEltbWVkaWF0ZVByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLnNldEltbWVkaWF0ZSA9IF9nbG9iYWwuc2V0SW1tZWRpYXRlO1xuICAgICAgICB0aW1lcnMuY2xlYXJJbW1lZGlhdGUgPSBfZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xuICAgIH1cblxuICAgIGlmIChocnRpbWVQcmVzZW50KSB7XG4gICAgICAgIHRpbWVycy5ocnRpbWUgPSBfZ2xvYmFsLnByb2Nlc3MuaHJ0aW1lO1xuICAgIH1cblxuICAgIGlmIChuZXh0VGlja1ByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLm5leHRUaWNrID0gX2dsb2JhbC5wcm9jZXNzLm5leHRUaWNrO1xuICAgIH1cblxuICAgIGlmIChwZXJmb3JtYW5jZVByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLnBlcmZvcm1hbmNlID0gX2dsb2JhbC5wZXJmb3JtYW5jZTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdEFuaW1hdGlvbkZyYW1lUHJlc2VudCkge1xuICAgICAgICB0aW1lcnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gX2dsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXVlTWljcm90YXNrUHJlc2VudCkge1xuICAgICAgICB0aW1lcnMucXVldWVNaWNyb3Rhc2sgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjYW5jZWxBbmltYXRpb25GcmFtZVByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gX2dsb2JhbC5jYW5jZWxBbmltYXRpb25GcmFtZTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdElkbGVDYWxsYmFja1ByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLnJlcXVlc3RJZGxlQ2FsbGJhY2sgPSBfZ2xvYmFsLnJlcXVlc3RJZGxlQ2FsbGJhY2s7XG4gICAgfVxuXG4gICAgaWYgKGNhbmNlbElkbGVDYWxsYmFja1ByZXNlbnQpIHtcbiAgICAgICAgdGltZXJzLmNhbmNlbElkbGVDYWxsYmFjayA9IF9nbG9iYWwuY2FuY2VsSWRsZUNhbGxiYWNrO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU2V0VGltZW91dCA9IF9nbG9iYWwuc2V0SW1tZWRpYXRlIHx8IF9nbG9iYWwuc2V0VGltZW91dDtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RGF0ZXxudW1iZXJ9IFtzdGFydF0gdGhlIHN5c3RlbSB0aW1lIC0gbm9uLWludGVnZXIgdmFsdWVzIGFyZSBmbG9vcmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtsb29wTGltaXRdIG1heGltdW0gbnVtYmVyIG9mIHRpbWVycyB0aGF0IHdpbGwgYmUgcnVuIHdoZW4gY2FsbGluZyBydW5BbGwoKVxuICAgICAqIEByZXR1cm5zIHtDbG9ja31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVDbG9jayhzdGFydCwgbG9vcExpbWl0KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICBzdGFydCA9IE1hdGguZmxvb3IoZ2V0RXBvY2goc3RhcnQpKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGxvb3BMaW1pdCA9IGxvb3BMaW1pdCB8fCAxMDAwO1xuICAgICAgICBsZXQgbmFub3MgPSAwO1xuICAgICAgICBjb25zdCBhZGp1c3RlZFN5c3RlbVRpbWUgPSBbMCwgMF07IC8vIFttaWxsaXMsIG5hbm9yZW1haW5kZXJdXG5cbiAgICAgICAgaWYgKE5hdGl2ZURhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIFwiVGhlIGdsb2JhbCBzY29wZSBkb2Vzbid0IGhhdmUgYSBgRGF0ZWAgb2JqZWN0XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5vbmpzL3Npbm9uL2lzc3Vlcy8xODUyI2lzc3VlY29tbWVudC00MTk2MjI3ODApXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbG9jayA9IHtcbiAgICAgICAgICAgIG5vdzogc3RhcnQsXG4gICAgICAgICAgICBEYXRlOiBjcmVhdGVEYXRlKCksXG4gICAgICAgICAgICBsb29wTGltaXQ6IGxvb3BMaW1pdCxcbiAgICAgICAgfTtcblxuICAgICAgICBjbG9jay5EYXRlLmNsb2NrID0gY2xvY2s7XG5cbiAgICAgICAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUganNkb2MvcmVxdWlyZS1qc2RvY1xuICAgICAgICBmdW5jdGlvbiBnZXRUaW1lVG9OZXh0RnJhbWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gMTYgLSAoKGNsb2NrLm5vdyAtIHN0YXJ0KSAlIDE2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzZG9jL3JlcXVpcmUtanNkb2NcbiAgICAgICAgZnVuY3Rpb24gaHJ0aW1lKHByZXYpIHtcbiAgICAgICAgICAgIGNvbnN0IG1pbGxpc1NpbmNlU3RhcnQgPSBjbG9jay5ub3cgLSBhZGp1c3RlZFN5c3RlbVRpbWVbMF0gLSBzdGFydDtcbiAgICAgICAgICAgIGNvbnN0IHNlY3NTaW5jZVN0YXJ0ID0gTWF0aC5mbG9vcihtaWxsaXNTaW5jZVN0YXJ0IC8gMTAwMCk7XG4gICAgICAgICAgICBjb25zdCByZW1haW5kZXJJbk5hbm9zID1cbiAgICAgICAgICAgICAgICAobWlsbGlzU2luY2VTdGFydCAtIHNlY3NTaW5jZVN0YXJ0ICogMWUzKSAqIDFlNiArXG4gICAgICAgICAgICAgICAgbmFub3MgLVxuICAgICAgICAgICAgICAgIGFkanVzdGVkU3lzdGVtVGltZVsxXTtcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJldikpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJldlsxXSA+IDFlOSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJOdW1iZXIgb2YgbmFub3NlY29uZHMgY2FuJ3QgZXhjZWVkIGEgYmlsbGlvblwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2xkU2VjcyA9IHByZXZbMF07XG4gICAgICAgICAgICAgICAgbGV0IG5hbm9EaWZmID0gcmVtYWluZGVySW5OYW5vcyAtIHByZXZbMV07XG4gICAgICAgICAgICAgICAgbGV0IHNlY0RpZmYgPSBzZWNzU2luY2VTdGFydCAtIG9sZFNlY3M7XG5cbiAgICAgICAgICAgICAgICBpZiAobmFub0RpZmYgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbm9EaWZmICs9IDFlOTtcbiAgICAgICAgICAgICAgICAgICAgc2VjRGlmZiAtPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBbc2VjRGlmZiwgbmFub0RpZmZdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtzZWNzU2luY2VTdGFydCwgcmVtYWluZGVySW5OYW5vc107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaHJ0aW1lQmlnaW50UHJlc2VudCkge1xuICAgICAgICAgICAgaHJ0aW1lLmJpZ2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGhydGltZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBCaWdJbnQocGFydHNbMF0pICogQmlnSW50KDFlOSkgKyBCaWdJbnQocGFydHNbMV0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvY2sucmVxdWVzdElkbGVDYWxsYmFjayA9IGZ1bmN0aW9uIHJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICAgICAgICBmdW5jLFxuICAgICAgICAgICAgdGltZW91dFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCB0aW1lVG9OZXh0SWRsZVBlcmlvZCA9IDA7XG5cbiAgICAgICAgICAgIGlmIChjbG9jay5jb3VudFRpbWVycygpID4gMCkge1xuICAgICAgICAgICAgICAgIHRpbWVUb05leHRJZGxlUGVyaW9kID0gNTA7IC8vIGNvbnN0IGZvciBub3dcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYWRkVGltZXIoY2xvY2ssIHtcbiAgICAgICAgICAgICAgICBmdW5jOiBmdW5jLFxuICAgICAgICAgICAgICAgIGFyZ3M6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICAgICAgICAgICAgZGVsYXk6XG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0aW1lb3V0ID09PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRpbWVUb05leHRJZGxlUGVyaW9kXG4gICAgICAgICAgICAgICAgICAgICAgICA6IE1hdGgubWluKHRpbWVvdXQsIHRpbWVUb05leHRJZGxlUGVyaW9kKSxcbiAgICAgICAgICAgICAgICBpZGxlQ2FsbGJhY2s6IHRydWUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihyZXN1bHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLmNhbmNlbElkbGVDYWxsYmFjayA9IGZ1bmN0aW9uIGNhbmNlbElkbGVDYWxsYmFjayh0aW1lcklkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xlYXJUaW1lcihjbG9jaywgdGltZXJJZCwgXCJJZGxlQ2FsbGJhY2tcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2xvY2suc2V0VGltZW91dCA9IGZ1bmN0aW9uIHNldFRpbWVvdXQoZnVuYywgdGltZW91dCkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZFRpbWVyKGNsb2NrLCB7XG4gICAgICAgICAgICAgICAgZnVuYzogZnVuYyxcbiAgICAgICAgICAgICAgICBhcmdzOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgICAgICAgICAgICAgIGRlbGF5OiB0aW1lb3V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2YgX2dsb2JhbC5Qcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmIHV0aWxQcm9taXNpZnkpIHtcbiAgICAgICAgICAgIGNsb2NrLnNldFRpbWVvdXRbXG4gICAgICAgICAgICAgICAgdXRpbFByb21pc2lmeS5jdXN0b21cbiAgICAgICAgICAgIF0gPSBmdW5jdGlvbiBwcm9taXNpZmllZFNldFRpbWVvdXQodGltZW91dCwgYXJnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBfZ2xvYmFsLlByb21pc2UoZnVuY3Rpb24gc2V0VGltZW91dEV4ZWN1dG9yKFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRpbWVyKGNsb2NrLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jOiByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogW2FyZ10sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxheTogdGltZW91dCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvY2suY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gY2xlYXJUaW1lb3V0KHRpbWVySWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGVhclRpbWVyKGNsb2NrLCB0aW1lcklkLCBcIlRpbWVvdXRcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2xvY2submV4dFRpY2sgPSBmdW5jdGlvbiBuZXh0VGljayhmdW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5xdWV1ZUpvYihjbG9jaywge1xuICAgICAgICAgICAgICAgIGZ1bmM6IGZ1bmMsXG4gICAgICAgICAgICAgICAgYXJnczogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgICAgICAgICBlcnJvcjogaXNOZWFySW5maW5pdGVMaW1pdCA/IG5ldyBFcnJvcigpIDogbnVsbCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLnF1ZXVlTWljcm90YXNrID0gZnVuY3Rpb24gcXVldWVNaWNyb3Rhc2soZnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIGNsb2NrLm5leHRUaWNrKGZ1bmMpOyAvLyBleHBsaWNpdGx5IGRyb3AgYWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICAgICAgfTtcblxuICAgICAgICBjbG9jay5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uIHNldEludGVydmFsKGZ1bmMsIHRpbWVvdXQpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgICAgdGltZW91dCA9IHBhcnNlSW50KHRpbWVvdXQsIDEwKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRUaW1lcihjbG9jaywge1xuICAgICAgICAgICAgICAgIGZ1bmM6IGZ1bmMsXG4gICAgICAgICAgICAgICAgYXJnczogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICAgICAgICBkZWxheTogdGltZW91dCxcbiAgICAgICAgICAgICAgICBpbnRlcnZhbDogdGltZW91dCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbiBjbGVhckludGVydmFsKHRpbWVySWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjbGVhclRpbWVyKGNsb2NrLCB0aW1lcklkLCBcIkludGVydmFsXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChzZXRJbW1lZGlhdGVQcmVzZW50KSB7XG4gICAgICAgICAgICBjbG9jay5zZXRJbW1lZGlhdGUgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZnVuYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhZGRUaW1lcihjbG9jaywge1xuICAgICAgICAgICAgICAgICAgICBmdW5jOiBmdW5jLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICAgICAgICAgICAgICBpbW1lZGlhdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9nbG9iYWwuUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB1dGlsUHJvbWlzaWZ5KSB7XG4gICAgICAgICAgICAgICAgY2xvY2suc2V0SW1tZWRpYXRlW1xuICAgICAgICAgICAgICAgICAgICB1dGlsUHJvbWlzaWZ5LmN1c3RvbVxuICAgICAgICAgICAgICAgIF0gPSBmdW5jdGlvbiBwcm9taXNpZmllZFNldEltbWVkaWF0ZShhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBfZ2xvYmFsLlByb21pc2UoZnVuY3Rpb24gc2V0SW1tZWRpYXRlRXhlY3V0b3IoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkVGltZXIoY2xvY2ssIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jOiByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IFthcmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbG9jay5jbGVhckltbWVkaWF0ZSA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKHRpbWVySWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xlYXJUaW1lcihjbG9jaywgdGltZXJJZCwgXCJJbW1lZGlhdGVcIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvY2suY291bnRUaW1lcnMgPSBmdW5jdGlvbiBjb3VudFRpbWVycygpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY2xvY2sudGltZXJzIHx8IHt9KS5sZW5ndGggK1xuICAgICAgICAgICAgICAgIChjbG9jay5qb2JzIHx8IFtdKS5sZW5ndGhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2xvY2sucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGFkZFRpbWVyKGNsb2NrLCB7XG4gICAgICAgICAgICAgICAgZnVuYzogZnVuYyxcbiAgICAgICAgICAgICAgICBkZWxheTogZ2V0VGltZVRvTmV4dEZyYW1lKCksXG4gICAgICAgICAgICAgICAgYXJnczogW2Nsb2NrLm5vdyArIGdldFRpbWVUb05leHRGcmFtZSgpXSxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihyZXN1bHQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsZWFyVGltZXIoY2xvY2ssIHRpbWVySWQsIFwiQW5pbWF0aW9uRnJhbWVcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY2xvY2sucnVuTWljcm90YXNrcyA9IGZ1bmN0aW9uIHJ1bk1pY3JvdGFza3MoKSB7XG4gICAgICAgICAgICBydW5Kb2JzKGNsb2NrKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSB0aWNrVmFsdWUgbWlsbGlzZWNvbmRzIG9yIGEgc3RyaW5nIHBhcnNlYWJsZSBieSBwYXJzZVRpbWVcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc0FzeW5jXG4gICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0XG4gICAgICAgICAqIEByZXR1cm5zIHtudW1iZXJ8dW5kZWZpbmVkfSB3aWxsIHJldHVybiB0aGUgbmV3IGBub3dgIHZhbHVlIG9yIG5vdGhpbmcgZm9yIGFzeW5jXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkb1RpY2sodGlja1ZhbHVlLCBpc0FzeW5jLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IG1zRmxvYXQgPVxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aWNrVmFsdWUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgPyB0aWNrVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgOiBwYXJzZVRpbWUodGlja1ZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IG1zID0gTWF0aC5mbG9vcihtc0Zsb2F0KTtcbiAgICAgICAgICAgIGNvbnN0IHJlbWFpbmRlciA9IG5hbm9SZW1haW5kZXIobXNGbG9hdCk7XG4gICAgICAgICAgICBsZXQgbmFub3NUb3RhbCA9IG5hbm9zICsgcmVtYWluZGVyO1xuICAgICAgICAgICAgbGV0IHRpY2tUbyA9IGNsb2NrLm5vdyArIG1zO1xuXG4gICAgICAgICAgICBpZiAobXNGbG9hdCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTmVnYXRpdmUgdGlja3MgYXJlIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFkanVzdCBmb3IgcG9zaXRpdmUgb3ZlcmZsb3dcbiAgICAgICAgICAgIGlmIChuYW5vc1RvdGFsID49IDFlNikge1xuICAgICAgICAgICAgICAgIHRpY2tUbyArPSAxO1xuICAgICAgICAgICAgICAgIG5hbm9zVG90YWwgLT0gMWU2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuYW5vcyA9IG5hbm9zVG90YWw7XG4gICAgICAgICAgICBsZXQgdGlja0Zyb20gPSBjbG9jay5ub3c7XG4gICAgICAgICAgICBsZXQgcHJldmlvdXMgPSBjbG9jay5ub3c7XG4gICAgICAgICAgICAvLyBFU0xpbnQgZmFpbHMgdG8gZGV0ZWN0IHRoaXMgY29ycmVjdGx5XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBwcmVmZXItY29uc3QgKi9cbiAgICAgICAgICAgIGxldCB0aW1lcixcbiAgICAgICAgICAgICAgICBmaXJzdEV4Y2VwdGlvbixcbiAgICAgICAgICAgICAgICBvbGROb3csXG4gICAgICAgICAgICAgICAgbmV4dFByb21pc2VUaWNrLFxuICAgICAgICAgICAgICAgIGNvbXBlbnNhdGlvbkNoZWNrLFxuICAgICAgICAgICAgICAgIHBvc3RUaW1lckNhbGw7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIHByZWZlci1jb25zdCAqL1xuXG4gICAgICAgICAgICBjbG9jay5kdXJpbmdUaWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gcGVyZm9ybSBtaWNyb3Rhc2tzXG4gICAgICAgICAgICBvbGROb3cgPSBjbG9jay5ub3c7XG4gICAgICAgICAgICBydW5Kb2JzKGNsb2NrKTtcbiAgICAgICAgICAgIGlmIChvbGROb3cgIT09IGNsb2NrLm5vdykge1xuICAgICAgICAgICAgICAgIC8vIGNvbXBlbnNhdGUgZm9yIGFueSBzZXRTeXN0ZW1UaW1lKCkgY2FsbCBkdXJpbmcgbWljcm90YXNrIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgdGlja0Zyb20gKz0gY2xvY2subm93IC0gb2xkTm93O1xuICAgICAgICAgICAgICAgIHRpY2tUbyArPSBjbG9jay5ub3cgLSBvbGROb3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGpzZG9jL3JlcXVpcmUtanNkb2NcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRvVGlja0lubmVyKCkge1xuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm0gZWFjaCB0aW1lciBpbiB0aGUgcmVxdWVzdGVkIHJhbmdlXG4gICAgICAgICAgICAgICAgdGltZXIgPSBmaXJzdFRpbWVySW5SYW5nZShjbG9jaywgdGlja0Zyb20sIHRpY2tUbyk7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVubW9kaWZpZWQtbG9vcC1jb25kaXRpb25cbiAgICAgICAgICAgICAgICB3aGlsZSAodGltZXIgJiYgdGlja0Zyb20gPD0gdGlja1RvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjbG9jay50aW1lcnNbdGltZXIuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrRnJvbSA9IHRpbWVyLmNhbGxBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2NrLm5vdyA9IHRpbWVyLmNhbGxBdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZE5vdyA9IGNsb2NrLm5vdztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVuSm9icyhjbG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFRpbWVyKGNsb2NrLCB0aW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RFeGNlcHRpb24gPSBmaXJzdEV4Y2VwdGlvbiB8fCBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNBc3luYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmlzaCB1cCBhZnRlciBuYXRpdmUgc2V0SW1tZWRpYXRlIGNhbGxiYWNrIHRvIGFsbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIG5hdGl2ZSBlczYgcHJvbWlzZXMgdG8gcHJvY2VzcyB0aGVpciBjYWxsYmFja3MgYWZ0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlYWNoIHRpbWVyIGZpcmVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2V0VGltZW91dChuZXh0UHJvbWlzZVRpY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGVuc2F0aW9uQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHBvc3RUaW1lckNhbGwoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHByb2Nlc3MubmV4dFRpY2soKXMgYWdhaW5cbiAgICAgICAgICAgICAgICBvbGROb3cgPSBjbG9jay5ub3c7XG4gICAgICAgICAgICAgICAgcnVuSm9icyhjbG9jayk7XG4gICAgICAgICAgICAgICAgaWYgKG9sZE5vdyAhPT0gY2xvY2subm93KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbXBlbnNhdGUgZm9yIGFueSBzZXRTeXN0ZW1UaW1lKCkgY2FsbCBkdXJpbmcgcHJvY2Vzcy5uZXh0VGljaygpIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgIHRpY2tGcm9tICs9IGNsb2NrLm5vdyAtIG9sZE5vdztcbiAgICAgICAgICAgICAgICAgICAgdGlja1RvICs9IGNsb2NrLm5vdyAtIG9sZE5vdztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xvY2suZHVyaW5nVGljayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gY29ybmVyIGNhc2U6IGR1cmluZyBydW5Kb2JzIG5ldyB0aW1lcnMgd2VyZSBzY2hlZHVsZWQgd2hpY2ggY291bGQgYmUgaW4gdGhlIHJhbmdlIFtjbG9jay5ub3csIHRpY2tUb11cbiAgICAgICAgICAgICAgICB0aW1lciA9IGZpcnN0VGltZXJJblJhbmdlKGNsb2NrLCB0aWNrRnJvbSwgdGlja1RvKTtcbiAgICAgICAgICAgICAgICBpZiAodGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2NrLnRpY2sodGlja1RvIC0gY2xvY2subm93KTsgLy8gZG8gaXQgYWxsIGFnYWluIC0gZm9yIHRoZSByZW1haW5kZXIgb2YgdGhlIHJlcXVlc3RlZCByYW5nZVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEV4Y2VwdGlvbiA9IGZpcnN0RXhjZXB0aW9uIHx8IGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyB0aW1lcnMgcmVtYWluaW5nIGluIHRoZSByZXF1ZXN0ZWQgcmFuZ2U6IG1vdmUgdGhlIGNsb2NrIGFsbCB0aGUgd2F5IHRvIHRoZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgY2xvY2subm93ID0gdGlja1RvO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBuYW5vc1xuICAgICAgICAgICAgICAgICAgICBuYW5vcyA9IG5hbm9zVG90YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaXJzdEV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBmaXJzdEV4Y2VwdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNBc3luYykge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNsb2NrLm5vdyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb2NrLm5vdztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5leHRQcm9taXNlVGljayA9XG4gICAgICAgICAgICAgICAgaXNBc3luYyAmJlxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBlbnNhdGlvbkNoZWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0VGltZXJDYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb1RpY2tJbm5lcigpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb21wZW5zYXRpb25DaGVjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wZW5zYXRlIGZvciBhbnkgc2V0U3lzdGVtVGltZSgpIGNhbGwgZHVyaW5nIHRpbWVyIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYgKG9sZE5vdyAhPT0gY2xvY2subm93KSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2tGcm9tICs9IGNsb2NrLm5vdyAtIG9sZE5vdztcbiAgICAgICAgICAgICAgICAgICAgdGlja1RvICs9IGNsb2NrLm5vdyAtIG9sZE5vdztcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMgKz0gY2xvY2subm93IC0gb2xkTm93O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHBvc3RUaW1lckNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGltZXIgPSBmaXJzdFRpbWVySW5SYW5nZShjbG9jaywgcHJldmlvdXMsIHRpY2tUbyk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSB0aWNrRnJvbTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBkb1RpY2tJbm5lcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gdGlja1ZhbHVlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgb3IgYSBodW1hbi1yZWFkYWJsZSB2YWx1ZSBsaWtlIFwiMDE6MTE6MTVcIlxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSB3aWxsIHJldHVybiB0aGUgbmV3IGBub3dgIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBjbG9jay50aWNrID0gZnVuY3Rpb24gdGljayh0aWNrVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBkb1RpY2sodGlja1ZhbHVlLCBmYWxzZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBfZ2xvYmFsLlByb21pc2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB0aWNrVmFsdWUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBvciBhIGh1bWFuLXJlYWRhYmxlIHZhbHVlIGxpa2UgXCIwMToxMToxNVwiXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY2xvY2sudGlja0FzeW5jID0gZnVuY3Rpb24gdGlja0FzeW5jKHRpY2tWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgX2dsb2JhbC5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9UaWNrKHRpY2tWYWx1ZSwgdHJ1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsb2NrLm5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgcnVuSm9icyhjbG9jayk7XG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IGZpcnN0VGltZXIoY2xvY2spO1xuICAgICAgICAgICAgaWYgKCF0aW1lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjbG9jay5ub3c7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsb2NrLmR1cmluZ1RpY2sgPSB0cnVlO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjbG9jay5ub3cgPSB0aW1lci5jYWxsQXQ7XG4gICAgICAgICAgICAgICAgY2FsbFRpbWVyKGNsb2NrLCB0aW1lcik7XG4gICAgICAgICAgICAgICAgcnVuSm9icyhjbG9jayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb2NrLm5vdztcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgY2xvY2suZHVyaW5nVGljayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0eXBlb2YgX2dsb2JhbC5Qcm9taXNlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjbG9jay5uZXh0QXN5bmMgPSBmdW5jdGlvbiBuZXh0QXN5bmMoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBfZ2xvYmFsLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lciA9IGZpcnN0VGltZXIoY2xvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGltZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjbG9jay5ub3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9jay5kdXJpbmdUaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9jay5ub3cgPSB0aW1lci5jYWxsQXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFRpbWVyKGNsb2NrLCB0aW1lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9jay5kdXJpbmdUaWNrID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2xvY2subm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvY2sucnVuQWxsID0gZnVuY3Rpb24gcnVuQWxsKCkge1xuICAgICAgICAgICAgbGV0IG51bVRpbWVycywgaTtcbiAgICAgICAgICAgIHJ1bkpvYnMoY2xvY2spO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNsb2NrLmxvb3BMaW1pdDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbG9jay50aW1lcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRJc05lYXJJbmZpbml0ZUxpbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjbG9jay5ub3c7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbnVtVGltZXJzID0gT2JqZWN0LmtleXMoY2xvY2sudGltZXJzKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKG51bVRpbWVycyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXNldElzTmVhckluZmluaXRlTGltaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsb2NrLm5vdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjbG9jay5uZXh0KCk7XG4gICAgICAgICAgICAgICAgY2hlY2tJc05lYXJJbmZpbml0ZUxpbWl0KGNsb2NrLCBpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZXhjZXNzSm9iID0gZmlyc3RUaW1lcihjbG9jayk7XG4gICAgICAgICAgICB0aHJvdyBnZXRJbmZpbml0ZUxvb3BFcnJvcihjbG9jaywgZXhjZXNzSm9iKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjbG9jay5ydW5Ub0ZyYW1lID0gZnVuY3Rpb24gcnVuVG9GcmFtZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBjbG9jay50aWNrKGdldFRpbWVUb05leHRGcmFtZSgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIF9nbG9iYWwuUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY2xvY2sucnVuQWxsQXN5bmMgPSBmdW5jdGlvbiBydW5BbGxBc3luYygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IF9nbG9iYWwuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkb1J1bigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG51bVRpbWVycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBjbG9jay5sb29wTGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2xvY2sudGltZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRJc05lYXJJbmZpbml0ZUxpbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjbG9jay5ub3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtVGltZXJzID0gT2JqZWN0LmtleXMoY2xvY2sudGltZXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtVGltZXJzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRJc05lYXJJbmZpbml0ZUxpbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjbG9jay5ub3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvY2submV4dCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvUnVuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja0lzTmVhckluZmluaXRlTGltaXQoY2xvY2ssIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhjZXNzSm9iID0gZmlyc3RUaW1lcihjbG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChnZXRJbmZpbml0ZUxvb3BFcnJvcihjbG9jaywgZXhjZXNzSm9iKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZG9SdW4oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjbG9jay5ydW5Ub0xhc3QgPSBmdW5jdGlvbiBydW5Ub0xhc3QoKSB7XG4gICAgICAgICAgICBjb25zdCB0aW1lciA9IGxhc3RUaW1lcihjbG9jayk7XG4gICAgICAgICAgICBpZiAoIXRpbWVyKSB7XG4gICAgICAgICAgICAgICAgcnVuSm9icyhjbG9jayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsb2NrLm5vdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNsb2NrLnRpY2sodGltZXIuY2FsbEF0IC0gY2xvY2subm93KTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHlwZW9mIF9nbG9iYWwuUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY2xvY2sucnVuVG9MYXN0QXN5bmMgPSBmdW5jdGlvbiBydW5Ub0xhc3RBc3luYygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IF9nbG9iYWwuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVyID0gbGFzdFRpbWVyKGNsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRpbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2xvY2subm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNsb2NrLnRpY2tBc3luYyh0aW1lci5jYWxsQXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsb2NrLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgICAgICBuYW5vcyA9IDA7XG4gICAgICAgICAgICBjbG9jay50aW1lcnMgPSB7fTtcbiAgICAgICAgICAgIGNsb2NrLmpvYnMgPSBbXTtcbiAgICAgICAgICAgIGNsb2NrLm5vdyA9IHN0YXJ0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLnNldFN5c3RlbVRpbWUgPSBmdW5jdGlvbiBzZXRTeXN0ZW1UaW1lKHN5c3RlbVRpbWUpIHtcbiAgICAgICAgICAgIC8vIGRldGVybWluZSB0aW1lIGRpZmZlcmVuY2VcbiAgICAgICAgICAgIGNvbnN0IG5ld05vdyA9IGdldEVwb2NoKHN5c3RlbVRpbWUpO1xuICAgICAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IG5ld05vdyAtIGNsb2NrLm5vdztcbiAgICAgICAgICAgIGxldCBpZCwgdGltZXI7XG5cbiAgICAgICAgICAgIGFkanVzdGVkU3lzdGVtVGltZVswXSA9IGFkanVzdGVkU3lzdGVtVGltZVswXSArIGRpZmZlcmVuY2U7XG4gICAgICAgICAgICBhZGp1c3RlZFN5c3RlbVRpbWVbMV0gPSBhZGp1c3RlZFN5c3RlbVRpbWVbMV0gKyBuYW5vcztcbiAgICAgICAgICAgIC8vIHVwZGF0ZSAnc3lzdGVtIGNsb2NrJ1xuICAgICAgICAgICAgY2xvY2subm93ID0gbmV3Tm93O1xuICAgICAgICAgICAgbmFub3MgPSAwO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdGltZXJzIGFuZCBpbnRlcnZhbHMgdG8ga2VlcCB0aGVtIHN0YWJsZVxuICAgICAgICAgICAgZm9yIChpZCBpbiBjbG9jay50aW1lcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2xvY2sudGltZXJzLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IGNsb2NrLnRpbWVyc1tpZF07XG4gICAgICAgICAgICAgICAgICAgIHRpbWVyLmNyZWF0ZWRBdCArPSBkaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgICAgICB0aW1lci5jYWxsQXQgKz0gZGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHBlcmZvcm1hbmNlUHJlc2VudCkge1xuICAgICAgICAgICAgY2xvY2sucGVyZm9ybWFuY2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgY2xvY2sucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gRmFrZVRpbWVyc05vdygpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBocnQgPSBocnRpbWUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtaWxsaXMgPSBocnRbMF0gKiAxMDAwICsgaHJ0WzFdIC8gMWU2O1xuICAgICAgICAgICAgICAgIHJldHVybiBtaWxsaXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhydGltZVByZXNlbnQpIHtcbiAgICAgICAgICAgIGNsb2NrLmhydGltZSA9IGhydGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbG9jaztcbiAgICB9XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0NvbmZpZz19IFtjb25maWddIE9wdGlvbmFsIGNvbmZpZ1xuICAgICAqIEByZXR1cm5zIHtDbG9ja31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnN0YWxsKGNvbmZpZykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBhcmd1bWVudHMubGVuZ3RoID4gMSB8fFxuICAgICAgICAgICAgY29uZmlnIGluc3RhbmNlb2YgRGF0ZSB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShjb25maWcpIHx8XG4gICAgICAgICAgICB0eXBlb2YgY29uZmlnID09PSBcIm51bWJlclwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICBgRmFrZVRpbWVycy5pbnN0YWxsIGNhbGxlZCB3aXRoICR7U3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICBjb25maWdcbiAgICAgICAgICAgICAgICApfSBpbnN0YWxsIHJlcXVpcmVzIGFuIG9iamVjdCBwYXJhbWV0ZXJgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGNvbmZpZyA9IHR5cGVvZiBjb25maWcgIT09IFwidW5kZWZpbmVkXCIgPyBjb25maWcgOiB7fTtcbiAgICAgICAgY29uZmlnLnNob3VsZEFkdmFuY2VUaW1lID0gY29uZmlnLnNob3VsZEFkdmFuY2VUaW1lIHx8IGZhbHNlO1xuICAgICAgICBjb25maWcuYWR2YW5jZVRpbWVEZWx0YSA9IGNvbmZpZy5hZHZhbmNlVGltZURlbHRhIHx8IDIwO1xuICAgICAgICBjb25maWcuc2hvdWxkQ2xlYXJOYXRpdmVUaW1lcnMgPVxuICAgICAgICAgICAgY29uZmlnLnNob3VsZENsZWFyTmF0aXZlVGltZXJzIHx8IGZhbHNlO1xuXG4gICAgICAgIGlmIChjb25maWcudGFyZ2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgIFwiY29uZmlnLnRhcmdldCBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBVc2UgYHdpdGhHbG9iYWwodGFyZ2V0KWAgaW5zdGVhZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpLCBsO1xuICAgICAgICBjb25zdCBjbG9jayA9IGNyZWF0ZUNsb2NrKGNvbmZpZy5ub3csIGNvbmZpZy5sb29wTGltaXQpO1xuICAgICAgICBjbG9jay5zaG91bGRDbGVhck5hdGl2ZVRpbWVycyA9IGNvbmZpZy5zaG91bGRDbGVhck5hdGl2ZVRpbWVycztcblxuICAgICAgICBjbG9jay51bmluc3RhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5pbnN0YWxsKGNsb2NrLCBjb25maWcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNsb2NrLm1ldGhvZHMgPSBjb25maWcudG9GYWtlIHx8IFtdO1xuXG4gICAgICAgIGlmIChjbG9jay5tZXRob2RzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gZG8gbm90IGZha2UgbmV4dFRpY2sgYnkgZGVmYXVsdCAtIEdpdEh1YiMxMjZcbiAgICAgICAgICAgIGNsb2NrLm1ldGhvZHMgPSBPYmplY3Qua2V5cyh0aW1lcnMpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSAhPT0gXCJuZXh0VGlja1wiICYmIGtleSAhPT0gXCJxdWV1ZU1pY3JvdGFza1wiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLnNob3VsZEFkdmFuY2VUaW1lID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbFRpY2sgPSBkb0ludGVydmFsVGljay5iaW5kKFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgY2xvY2ssXG4gICAgICAgICAgICAgICAgY29uZmlnLmFkdmFuY2VUaW1lRGVsdGFcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbElkID0gX2dsb2JhbC5zZXRJbnRlcnZhbChcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFRpY2ssXG4gICAgICAgICAgICAgICAgY29uZmlnLmFkdmFuY2VUaW1lRGVsdGFcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjbG9jay5hdHRhY2hlZEludGVydmFsID0gaW50ZXJ2YWxJZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbG9jay5tZXRob2RzLmluY2x1ZGVzKFwicGVyZm9ybWFuY2VcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3RvID0gKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzUGVyZm9ybWFuY2VQcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9nbG9iYWwuUGVyZm9ybWFuY2UucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaGFzUGVyZm9ybWFuY2VDb25zdHJ1Y3RvclByb3RvdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2dsb2JhbC5wZXJmb3JtYW5jZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIGlmIChwcm90bykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lICE9PSBcIm5vd1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9jay5wZXJmb3JtYW5jZVtuYW1lXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5pbmRleE9mKFwiZ2V0RW50cmllc1wiKSA9PT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IE5PT1BfQVJSQVlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBOT09QO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChjb25maWcudG9GYWtlIHx8IFtdKS5pbmNsdWRlcyhcInBlcmZvcm1hbmNlXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlciBleHBsaWNpdGx5IHRyaWVkIHRvIGZha2UgcGVyZm9ybWFuY2Ugd2hlbiBub3QgcHJlc2VudFxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJub24tZXhpc3RlbnQgcGVyZm9ybWFuY2Ugb2JqZWN0IGNhbm5vdCBiZSBmYWtlZFwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDAsIGwgPSBjbG9jay5tZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbmFtZU9mTWV0aG9kVG9SZXBsYWNlID0gY2xvY2subWV0aG9kc1tpXTtcbiAgICAgICAgICAgIGlmIChuYW1lT2ZNZXRob2RUb1JlcGxhY2UgPT09IFwiaHJ0aW1lXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF9nbG9iYWwucHJvY2VzcyAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgX2dsb2JhbC5wcm9jZXNzLmhydGltZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpamFja01ldGhvZChfZ2xvYmFsLnByb2Nlc3MsIG5hbWVPZk1ldGhvZFRvUmVwbGFjZSwgY2xvY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZU9mTWV0aG9kVG9SZXBsYWNlID09PSBcIm5leHRUaWNrXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIF9nbG9iYWwucHJvY2VzcyAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgX2dsb2JhbC5wcm9jZXNzLm5leHRUaWNrID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgaGlqYWNrTWV0aG9kKF9nbG9iYWwucHJvY2VzcywgbmFtZU9mTWV0aG9kVG9SZXBsYWNlLCBjbG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoaWphY2tNZXRob2QoX2dsb2JhbCwgbmFtZU9mTWV0aG9kVG9SZXBsYWNlLCBjbG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xvY2s7XG4gICAgfVxuXG4gICAgLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aW1lcnM6IHRpbWVycyxcbiAgICAgICAgY3JlYXRlQ2xvY2s6IGNyZWF0ZUNsb2NrLFxuICAgICAgICBpbnN0YWxsOiBpbnN0YWxsLFxuICAgICAgICB3aXRoR2xvYmFsOiB3aXRoR2xvYmFsLFxuICAgIH07XG59XG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gRmFrZVRpbWVyc1xuICogQHByb3BlcnR5IHtUaW1lcnN9IHRpbWVyc1xuICogQHByb3BlcnR5IHtjcmVhdGVDbG9ja30gY3JlYXRlQ2xvY2tcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGluc3RhbGxcbiAqIEBwcm9wZXJ0eSB7d2l0aEdsb2JhbH0gd2l0aEdsb2JhbFxuICovXG5cbi8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqL1xuXG4vKiogQHR5cGUge0Zha2VUaW1lcnN9ICovXG5jb25zdCBkZWZhdWx0SW1wbGVtZW50YXRpb24gPSB3aXRoR2xvYmFsKGdsb2JhbE9iamVjdCk7XG5cbmV4cG9ydHMudGltZXJzID0gZGVmYXVsdEltcGxlbWVudGF0aW9uLnRpbWVycztcbmV4cG9ydHMuY3JlYXRlQ2xvY2sgPSBkZWZhdWx0SW1wbGVtZW50YXRpb24uY3JlYXRlQ2xvY2s7XG5leHBvcnRzLmluc3RhbGwgPSBkZWZhdWx0SW1wbGVtZW50YXRpb24uaW5zdGFsbDtcbmV4cG9ydHMud2l0aEdsb2JhbCA9IHdpdGhHbG9iYWw7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGZhY3RvcnkoZ2xvYmFsLk1vY2tEYXRlID0ge30pKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIC8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG4gICAgUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbiAgICBwdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG4gICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG4gICAgUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbiAgICBBTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbiAgICBJTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuICAgIExPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbiAgICBPVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcbiAgICBQRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuICAgIC8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfVxuXG4gICAgdmFyIFJlYWxEYXRlID0gRGF0ZTtcclxuICAgIHZhciBub3cgPSBudWxsO1xyXG4gICAgdmFyIE1vY2tEYXRlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgIF9fZXh0ZW5kcyhEYXRlLCBfc3VwZXIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcclxuICAgICAgICAgICAgX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICAgICAgdmFyIGRhdGU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub3cgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBSZWFsRGF0ZShub3cudmFsdWVPZigpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgUmVhbERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBSZWFsRGF0ZSh5KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgZCA9IHR5cGVvZiBkID09PSAndW5kZWZpbmVkJyA/IDEgOiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBoIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgTSA9IE0gfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICBzID0gcyB8fCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIG1zID0gbXMgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlID0gbmV3IFJlYWxEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIERhdGU7XHJcbiAgICB9KFJlYWxEYXRlKSk7XHJcbiAgICBNb2NrRGF0ZS5wcm90b3R5cGUgPSBSZWFsRGF0ZS5wcm90b3R5cGU7XHJcbiAgICBNb2NrRGF0ZS5VVEMgPSBSZWFsRGF0ZS5VVEM7XHJcbiAgICBNb2NrRGF0ZS5ub3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNb2NrRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgIH07XHJcbiAgICBNb2NrRGF0ZS5wYXJzZSA9IGZ1bmN0aW9uIChkYXRlU3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlYWxEYXRlLnBhcnNlKGRhdGVTdHJpbmcpO1xyXG4gICAgfTtcclxuICAgIE1vY2tEYXRlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBSZWFsRGF0ZS50b1N0cmluZygpO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIHNldChkYXRlKSB7XHJcbiAgICAgICAgdmFyIGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlLnZhbHVlT2YoKSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKGRhdGVPYmouZ2V0VGltZSgpKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtb2NrZGF0ZTogVGhlIHRpbWUgc2V0IGlzIGFuIGludmFsaWQgZGF0ZTogJyArIGRhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgRGF0ZSA9IE1vY2tEYXRlO1xyXG4gICAgICAgIG5vdyA9IGRhdGVPYmoudmFsdWVPZigpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XHJcbiAgICAgICAgRGF0ZSA9IFJlYWxEYXRlO1xyXG4gICAgfVxyXG4gICAgdmFyIG1vY2tkYXRlID0ge1xyXG4gICAgICAgIHNldDogc2V0LFxyXG4gICAgICAgIHJlc2V0OiByZXNldCxcclxuICAgIH07XG5cbiAgICBleHBvcnRzLmRlZmF1bHQgPSBtb2NrZGF0ZTtcbiAgICBleHBvcnRzLnJlc2V0ID0gcmVzZXQ7XG4gICAgZXhwb3J0cy5zZXQgPSBzZXQ7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2plc3QuXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICBGYWtlVGltZXJXaXRoQ29udGV4dCxcbiAgSW5zdGFsbGVkQ2xvY2ssXG59IGZyb20gJ0BzaW5vbmpzL2Zha2UtdGltZXJzJ1xuaW1wb3J0IHtcbiAgd2l0aEdsb2JhbCxcbn0gZnJvbSAnQHNpbm9uanMvZmFrZS10aW1lcnMnXG5pbXBvcnQgTW9ja0RhdGUgZnJvbSAnbW9ja2RhdGUnXG5cbmV4cG9ydCBjbGFzcyBGYWtlVGltZXJzIHtcbiAgcHJpdmF0ZSBfY2xvY2shOiBJbnN0YWxsZWRDbG9ja1xuICBwcml2YXRlIF9mYWtpbmdUaW1lOiBib29sZWFuXG4gIHByaXZhdGUgX2Zha2luZ0RhdGU6IGJvb2xlYW5cbiAgcHJpdmF0ZSBfZmFrZVRpbWVyczogRmFrZVRpbWVyV2l0aENvbnRleHRcbiAgcHJpdmF0ZSBfbWF4TG9vcHM6IG51bWJlclxuICBwcml2YXRlIF9ub3cgPSBEYXRlLm5vd1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBnbG9iYWwsXG4gICAgbWF4TG9vcHMgPSAxMF8wMDAsXG4gIH06IHtcbiAgICBnbG9iYWw6IHR5cGVvZiBnbG9iYWxUaGlzXG4gICAgbWF4TG9vcHM/OiBudW1iZXJcbiAgfSkge1xuICAgIHRoaXMuX21heExvb3BzID0gbWF4TG9vcHNcblxuICAgIHRoaXMuX2Zha2luZ0RhdGUgPSBmYWxzZVxuXG4gICAgdGhpcy5fZmFraW5nVGltZSA9IGZhbHNlXG4gICAgdGhpcy5fZmFrZVRpbWVycyA9IHdpdGhHbG9iYWwoZ2xvYmFsKVxuICB9XG5cbiAgY2xlYXJBbGxUaW1lcnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Zha2luZ1RpbWUpXG4gICAgICB0aGlzLl9jbG9jay5yZXNldCgpXG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMudXNlUmVhbFRpbWVycygpXG4gIH1cblxuICBydW5BbGxUaW1lcnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoZWNrRmFrZVRpbWVycygpKVxuICAgICAgdGhpcy5fY2xvY2sucnVuQWxsKClcbiAgfVxuXG4gIHJ1bk9ubHlQZW5kaW5nVGltZXJzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jaGVja0Zha2VUaW1lcnMoKSlcbiAgICAgIHRoaXMuX2Nsb2NrLnJ1blRvTGFzdCgpXG4gIH1cblxuICBhZHZhbmNlVGltZXJzVG9OZXh0VGltZXIoc3RlcHMgPSAxKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoZWNrRmFrZVRpbWVycygpKSB7XG4gICAgICBmb3IgKGxldCBpID0gc3RlcHM7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgdGhpcy5fY2xvY2submV4dCgpXG4gICAgICAgIC8vIEZpcmUgYWxsIHRpbWVycyBhdCB0aGlzIHBvaW50OiBodHRwczovL2dpdGh1Yi5jb20vc2lub25qcy9mYWtlLXRpbWVycy9pc3N1ZXMvMjUwXG4gICAgICAgIHRoaXMuX2Nsb2NrLnRpY2soMClcblxuICAgICAgICBpZiAodGhpcy5fY2xvY2suY291bnRUaW1lcnMoKSA9PT0gMClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkdmFuY2VUaW1lcnNCeVRpbWUobXNUb1J1bjogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoZWNrRmFrZVRpbWVycygpKVxuICAgICAgdGhpcy5fY2xvY2sudGljayhtc1RvUnVuKVxuICB9XG5cbiAgcnVuQWxsVGlja3MoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NoZWNrRmFrZVRpbWVycygpKSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIG1ldGhvZCBub3QgZXhwb3NlZFxuICAgICAgdGhpcy5fY2xvY2sucnVuTWljcm90YXNrcygpXG4gICAgfVxuICB9XG5cbiAgdXNlUmVhbFRpbWVycygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZmFraW5nRGF0ZSkge1xuICAgICAgTW9ja0RhdGUucmVzZXQoKVxuICAgICAgdGhpcy5fZmFraW5nRGF0ZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2Zha2luZ1RpbWUpIHtcbiAgICAgIHRoaXMuX2Nsb2NrLnVuaW5zdGFsbCgpXG4gICAgICB0aGlzLl9mYWtpbmdUaW1lID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICB1c2VGYWtlVGltZXJzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mYWtpbmdEYXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdcInNldFN5c3RlbVRpbWVcIiB3YXMgY2FsbGVkIGFscmVhZHkgYW5kIGRhdGUgd2FzIG1vY2tlZC4gUmVzZXQgdGltZXJzIHVzaW5nIGB2aS51c2VSZWFsVGltZXJzKClgIGlmIHlvdSB3YW50IHRvIHVzZSBmYWtlIHRpbWVycyBhZ2Fpbi4nLFxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5fZmFraW5nVGltZSkge1xuICAgICAgY29uc3QgdG9GYWtlID0gT2JqZWN0LmtleXModGhpcy5fZmFrZVRpbWVycy50aW1lcnMpIGFzIEFycmF5PGtleW9mIEZha2VUaW1lcldpdGhDb250ZXh0Wyd0aW1lcnMnXT5cblxuICAgICAgdGhpcy5fY2xvY2sgPSB0aGlzLl9mYWtlVGltZXJzLmluc3RhbGwoe1xuICAgICAgICBsb29wTGltaXQ6IHRoaXMuX21heExvb3BzLFxuICAgICAgICBub3c6IERhdGUubm93KCksXG4gICAgICAgIHRvRmFrZSxcbiAgICAgICAgc2hvdWxkQ2xlYXJOYXRpdmVUaW1lcnM6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICB0aGlzLl9mYWtpbmdUaW1lID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jaGVja0Zha2VUaW1lcnMoKSkge1xuICAgICAgY29uc3QgeyBub3cgfSA9IHRoaXMuX2Nsb2NrXG4gICAgICB0aGlzLl9jbG9jay5yZXNldCgpXG4gICAgICB0aGlzLl9jbG9jay5zZXRTeXN0ZW1UaW1lKG5vdylcbiAgICB9XG4gIH1cblxuICBzZXRTeXN0ZW1UaW1lKG5vdz86IG51bWJlciB8IERhdGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZmFraW5nVGltZSkge1xuICAgICAgdGhpcy5fY2xvY2suc2V0U3lzdGVtVGltZShub3cpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgTW9ja0RhdGUuc2V0KG5vdyA/PyB0aGlzLmdldFJlYWxTeXN0ZW1UaW1lKCkpXG4gICAgICB0aGlzLl9mYWtpbmdEYXRlID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGdldFJlYWxTeXN0ZW1UaW1lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX25vdygpXG4gIH1cblxuICBnZXRUaW1lckNvdW50KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX2NoZWNrRmFrZVRpbWVycygpKVxuICAgICAgcmV0dXJuIHRoaXMuX2Nsb2NrLmNvdW50VGltZXJzKClcblxuICAgIHJldHVybiAwXG4gIH1cblxuICBwcml2YXRlIF9jaGVja0Zha2VUaW1lcnMoKSB7XG4gICAgaWYgKCF0aGlzLl9mYWtpbmdUaW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaW1lcnMgYXJlIG5vdCBtb2NrZWQuIFRyeSBjYWxsaW5nIFwidmkudXNlRmFrZVRpbWVycygpXCIgZmlyc3QuJyxcbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmFraW5nVGltZVxuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cblxuaW1wb3J0IHsgcGFyc2VTdGFja3RyYWNlIH0gZnJvbSAnLi4vdXRpbHMvc291cmNlLW1hcCdcbmltcG9ydCB0eXBlIHsgVml0ZXN0TW9ja2VyIH0gZnJvbSAnLi4vbm9kZS9tb2NrZXInXG5pbXBvcnQgeyBGYWtlVGltZXJzIH0gZnJvbSAnLi90aW1lcnMnXG5pbXBvcnQgdHlwZSB7IEVuaGFuY2VkU3B5LCBNYXliZU1vY2tlZCwgTWF5YmVNb2NrZWREZWVwIH0gZnJvbSAnLi9qZXN0LW1vY2snXG5pbXBvcnQgeyBmbiwgaXNNb2NrRnVuY3Rpb24sIHNwaWVzLCBzcHlPbiB9IGZyb20gJy4vamVzdC1tb2NrJ1xuXG5jbGFzcyBWaXRlc3RVdGlscyB7XG4gIHByaXZhdGUgX3RpbWVyczogRmFrZVRpbWVyc1xuICBwcml2YXRlIF9tb2NrZWREYXRlOiBzdHJpbmcgfCBudW1iZXIgfCBEYXRlIHwgbnVsbFxuICBwcml2YXRlIF9tb2NrZXI6IFZpdGVzdE1vY2tlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3RpbWVycyA9IG5ldyBGYWtlVGltZXJzKHtcbiAgICAgIGdsb2JhbDogZ2xvYmFsVGhpcyxcbiAgICAgIG1heExvb3BzOiAxMF8wMDAsXG4gICAgfSlcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGluamVjdGVkIGJ5IHZpdGUtbmlkZVxuICAgIHRoaXMuX21vY2tlciA9IHR5cGVvZiBfX3ZpdGVzdF9tb2NrZXJfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3ZpdGVzdF9tb2NrZXJfXyA6IG51bGxcbiAgICB0aGlzLl9tb2NrZWREYXRlID0gbnVsbFxuXG4gICAgaWYgKCF0aGlzLl9tb2NrZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpdGVzdCB3YXMgaW5pdGlhbGl6ZWQgd2l0aCBuYXRpdmUgTm9kZSBpbnN0ZWFkIG9mIFZpdGUgTm9kZScpXG4gIH1cblxuICAvLyB0aW1lcnNcblxuICBwdWJsaWMgdXNlRmFrZVRpbWVycygpIHtcbiAgICB0aGlzLl90aW1lcnMudXNlRmFrZVRpbWVycygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyB1c2VSZWFsVGltZXJzKCkge1xuICAgIHRoaXMuX3RpbWVycy51c2VSZWFsVGltZXJzKClcbiAgICB0aGlzLl9tb2NrZWREYXRlID0gbnVsbFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgcnVuT25seVBlbmRpbmdUaW1lcnMoKSB7XG4gICAgdGhpcy5fdGltZXJzLnJ1bk9ubHlQZW5kaW5nVGltZXJzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIHJ1bkFsbFRpbWVycygpIHtcbiAgICB0aGlzLl90aW1lcnMucnVuQWxsVGltZXJzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIHJ1bkFsbFRpY2tzKCkge1xuICAgIHRoaXMuX3RpbWVycy5ydW5BbGxUaWNrcygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBhZHZhbmNlVGltZXJzQnlUaW1lKG1zOiBudW1iZXIpIHtcbiAgICB0aGlzLl90aW1lcnMuYWR2YW5jZVRpbWVyc0J5VGltZShtcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGFkdmFuY2VUaW1lcnNUb05leHRUaW1lcigpIHtcbiAgICB0aGlzLl90aW1lcnMuYWR2YW5jZVRpbWVyc1RvTmV4dFRpbWVyKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGdldFRpbWVyQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVycy5nZXRUaW1lckNvdW50KClcbiAgfVxuXG4gIHB1YmxpYyBzZXRTeXN0ZW1UaW1lKHRpbWU6IG51bWJlciB8IHN0cmluZyB8IERhdGUpIHtcbiAgICBjb25zdCBkYXRlID0gdGltZSBpbnN0YW5jZW9mIERhdGUgPyB0aW1lIDogbmV3IERhdGUodGltZSlcbiAgICB0aGlzLl9tb2NrZWREYXRlID0gZGF0ZVxuICAgIHRoaXMuX3RpbWVycy5zZXRTeXN0ZW1UaW1lKGRhdGUpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBnZXRNb2NrZWRTeXN0ZW1UaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2NrZWREYXRlXG4gIH1cblxuICBwdWJsaWMgZ2V0UmVhbFN5c3RlbVRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpbWVycy5nZXRSZWFsU3lzdGVtVGltZSgpXG4gIH1cblxuICBwdWJsaWMgY2xlYXJBbGxUaW1lcnMoKSB7XG4gICAgdGhpcy5fdGltZXJzLmNsZWFyQWxsVGltZXJzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gbW9ja3NcblxuICBzcHlPbiA9IHNweU9uXG4gIGZuID0gZm5cblxuICBwcml2YXRlIGdldEltcG9ydGVyKCkge1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcignbW9jaycpXG4gICAgY29uc3QgWywsIGltcG9ydGVyXSA9IHBhcnNlU3RhY2t0cmFjZShlcnIsIHRydWUpXG4gICAgcmV0dXJuIGltcG9ydGVyLmZpbGVcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhbGwgYGltcG9ydHNgIHRvIHBhc3NlZCBtb2R1bGUgdG8gYmUgbW9ja2VkLlxuICAgKiAtIElmIHRoZXJlIGlzIGEgZmFjdG9yeSwgd2lsbCByZXR1cm4gaXQncyByZXN1bHQuIFRoZSBjYWxsIHRvIGB2aS5tb2NrYCBpcyBob2lzdGVkIHRvIHRoZSB0b3Agb2YgdGhlIGZpbGUsXG4gICAqIHNvIHlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB2YXJpYWJsZXMgZGVjbGFyZWQgaW4gdGhlIGdsb2JhbCBmaWxlIHNjb3BlLCBpZiB5b3UgZGlkbid0IHB1dCB0aGVtIGJlZm9yZSBpbXBvcnRzIVxuICAgKiAtIElmIGBfX21vY2tzX19gIGZvbGRlciB3aXRoIGZpbGUgb2YgdGhlIHNhbWUgbmFtZSBleGlzdCwgYWxsIGltcG9ydHMgd2lsbFxuICAgKiByZXR1cm4gaXQuXG4gICAqIC0gSWYgdGhlcmUgaXMgbm8gYF9fbW9ja3NfX2AgZm9sZGVyIG9yIGEgZmlsZSB3aXRoIHRoZSBzYW1lIG5hbWUgaW5zaWRlLCB3aWxsIGNhbGwgb3JpZ2luYWxcbiAgICogbW9kdWxlIGFuZCBtb2NrIGl0LlxuICAgKiBAcGFyYW0gcGF0aCBQYXRoIHRvIHRoZSBtb2R1bGUuIENhbiBiZSBhbGlhc2VkLCBpZiB5b3VyIGNvbmZpZyBzdXBwb3J0cyBpdFxuICAgKiBAcGFyYW0gZmFjdG9yeSBGYWN0b3J5IGZvciB0aGUgbW9ja2VkIG1vZHVsZS4gSGFzIHRoZSBoaWdoZXN0IHByaW9yaXR5LlxuICAgKi9cbiAgcHVibGljIG1vY2socGF0aDogc3RyaW5nLCBmYWN0b3J5PzogKCkgPT4gYW55KSB7XG4gICAgdGhpcy5fbW9ja2VyLnF1ZXVlTW9jayhwYXRoLCB0aGlzLmdldEltcG9ydGVyKCksIGZhY3RvcnkpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBtb2R1bGUgZnJvbSBtb2NrZWQgcmVnaXN0cnkuIEFsbCBzdWJzZXF1ZW50IGNhbGxzIHRvIGltcG9ydCB3aWxsXG4gICAqIHJldHVybiBvcmlnaW5hbCBtb2R1bGUgZXZlbiBpZiBpdCB3YXMgbW9ja2VkLlxuICAgKiBAcGFyYW0gcGF0aCBQYXRoIHRvIHRoZSBtb2R1bGUuIENhbiBiZSBhbGlhc2VkLCBpZiB5b3VyIGNvbmZpZyBzdXBwb3J0cyBpdFxuICAgKi9cbiAgcHVibGljIHVubW9jayhwYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tb2NrZXIucXVldWVVbm1vY2socGF0aCwgdGhpcy5nZXRJbXBvcnRlcigpKVxuICB9XG5cbiAgcHVibGljIGRvTW9jayhwYXRoOiBzdHJpbmcsIGZhY3Rvcnk/OiAoKSA9PiBhbnkpIHtcbiAgICB0aGlzLl9tb2NrZXIucXVldWVNb2NrKHBhdGgsIHRoaXMuZ2V0SW1wb3J0ZXIoKSwgZmFjdG9yeSlcbiAgfVxuXG4gIHB1YmxpYyBkb1VubW9jayhwYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tb2NrZXIucXVldWVVbm1vY2socGF0aCwgdGhpcy5nZXRJbXBvcnRlcigpKVxuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgbW9kdWxlLCBieXBhc3NpbmcgYWxsIGNoZWNrcyBpZiBpdCBzaG91bGQgYmUgbW9ja2VkLlxuICAgKiBDYW4gYmUgdXNlZnVsIGlmIHlvdSB3YW50IHRvIG1vY2sgbW9kdWxlIHBhcnRpYWxseS5cbiAgICogQGV4YW1wbGVcbiAgICogdmkubW9jaygnLi9leGFtcGxlJywgYXN5bmMgKCkgPT4ge1xuICAgKiAgY29uc3QgYXhpb3MgPSBhd2FpdCB2aS5pbXBvcnRBY3R1YWwoJy4vZXhhbXBsZScpXG4gICAqXG4gICAqICByZXR1cm4geyAuLi5heGlvcywgZ2V0OiB2aS5mbigpIH1cbiAgICogfSlcbiAgICogQHBhcmFtIHBhdGggUGF0aCB0byB0aGUgbW9kdWxlLiBDYW4gYmUgYWxpYXNlZCwgaWYgeW91ciBjb25maWcgc3VwcG9ydHMgaXRcbiAgICogQHJldHVybnMgQWN0dWFsIG1vZHVsZSB3aXRob3V0IHNwaWVzXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgaW1wb3J0QWN0dWFsPFQ+KHBhdGg6IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiB0aGlzLl9tb2NrZXIuaW1wb3J0QWN0dWFsPFQ+KHBhdGgsIHRoaXMuZ2V0SW1wb3J0ZXIoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGEgbW9kdWxlIHdpdGggYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIGFuZCBuZXN0ZWQgcHJvcGVydGllcyBtb2NrZWQuXG4gICAqIEZvciB0aGUgcnVsZXMgYXBwbGllZCwgc2VlIGRvY3MuXG4gICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gdGhlIG1vZHVsZS4gQ2FuIGJlIGFsaWFzZWQsIGlmIHlvdXIgY29uZmlnIHN1cHBvcnRzIGl0XG4gICAqIEByZXR1cm5zIEZ1bGx5IG1vY2tlZCBtb2R1bGVcbiAgICovXG4gIHB1YmxpYyBhc3luYyBpbXBvcnRNb2NrPFQ+KHBhdGg6IHN0cmluZyk6IFByb21pc2U8TWF5YmVNb2NrZWREZWVwPFQ+PiB7XG4gICAgcmV0dXJuIHRoaXMuX21vY2tlci5pbXBvcnRNb2NrKHBhdGgsIHRoaXMuZ2V0SW1wb3J0ZXIoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUeXBlIGhlbHBlcnMgZm9yIFR5cGVTY3JpcHQuIEluIHJlYWxpdHkganVzdCByZXR1cm5zIHRoZSBvYmplY3QgdGhhdCB3YXMgcGFzc2VkLlxuICAgKiBAZXhhbXBsZVxuICAgKiBpbXBvcnQgZXhhbXBsZSBmcm9tICcuL2V4YW1wbGUnXG4gICAqIHZpLm1vY2soJy4vZXhhbXBsZScpXG4gICAqXG4gICAqIHRlc3QoJzErMSBlcXVhbHMgMicgYXN5bmMgKCkgPT4ge1xuICAgKiAgdmkubW9ja2VkKGV4YW1wbGUuY2FsYykubW9ja1Jlc3RvcmUoKVxuICAgKlxuICAgKiAgY29uc3QgcmVzID0gZXhhbXBsZS5jYWxjKDEsICcrJywgMSlcbiAgICpcbiAgICogIGV4cGVjdChyZXMpLnRvQmUoMilcbiAgICogfSlcbiAgICogQHBhcmFtIGl0ZW0gQW55dGhpbmcgdGhhdCBjYW4gYmUgbW9ja2VkXG4gICAqIEBwYXJhbSBkZWVwIElmIHRoZSBvYmplY3QgaXMgZGVlcGx5IG1vY2tlZFxuICAgKi9cbiAgcHVibGljIG1vY2tlZDxUPihpdGVtOiBULCBkZWVwPzogZmFsc2UpOiBNYXliZU1vY2tlZDxUPlxuICBwdWJsaWMgbW9ja2VkPFQ+KGl0ZW06IFQsIGRlZXA6IHRydWUpOiBNYXliZU1vY2tlZERlZXA8VD5cbiAgcHVibGljIG1vY2tlZDxUPihpdGVtOiBULCBfZGVlcCA9IGZhbHNlKTogTWF5YmVNb2NrZWQ8VD4gfCBNYXliZU1vY2tlZERlZXA8VD4ge1xuICAgIHJldHVybiBpdGVtIGFzIGFueVxuICB9XG5cbiAgcHVibGljIGlzTW9ja0Z1bmN0aW9uKGZuOiBhbnkpOiBmbiBpcyBFbmhhbmNlZFNweSB7XG4gICAgcmV0dXJuIGlzTW9ja0Z1bmN0aW9uKGZuKVxuICB9XG5cbiAgcHVibGljIGNsZWFyQWxsTW9ja3MoKSB7XG4gICAgc3BpZXMuZm9yRWFjaChzcHkgPT4gc3B5Lm1vY2tDbGVhcigpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgcmVzZXRBbGxNb2NrcygpIHtcbiAgICBzcGllcy5mb3JFYWNoKHNweSA9PiBzcHkubW9ja1Jlc2V0KCkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyByZXN0b3JlQWxsTW9ja3MoKSB7XG4gICAgc3BpZXMuZm9yRWFjaChzcHkgPT4gc3B5Lm1vY2tSZXN0b3JlKCkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgdml0ZXN0ID0gbmV3IFZpdGVzdFV0aWxzKClcbmV4cG9ydCBjb25zdCB2aSA9IHZpdGVzdFxuIl0sIm5hbWVzIjpbInRlc3QiLCJmb3JtYXQiLCJBc3ltbWV0cmljTWF0Y2hlciIsIl9jb2xsZWN0aW9ucyIsInJlcXVpcmUkJDAiLCJnbG9iYWwiLCJTeW1ib2wiLCJTUEFDRSIsInNlcmlhbGl6ZSIsInBsdWdpbiIsIl9kZWZhdWx0IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9hbnNpU3R5bGVzIiwicmVxdWlyZSQkMSIsIkRPTUNvbGxlY3Rpb24iLCJlc2NhcGVIVE1MXzEiLCJET01FbGVtZW50IiwiX21hcmt1cCIsIkltbXV0YWJsZSIsIklTX0tFWUVEX1NFTlRJTkVMIiwiSVNfT1JERVJFRF9TRU5USU5FTCIsIklTX1NFVF9TRU5USU5FTCIsInJlYWN0SXNNb2R1bGUiLCJSZWFjdEVsZW1lbnQiLCJnZXRQcm9wS2V5cyIsIlJlYWN0VGVzdENvbXBvbmVudCIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwicmVxdWlyZSQkNCIsInJlcXVpcmUkJDUiLCJyZXF1aXJlJCQ2IiwicmVxdWlyZSQkNyIsInJlcXVpcmUkJDgiLCJwcmV0dHlGb3JtYXRQbHVnaW5zIiwiamVzdEVxdWFscyIsImdsb2JhbE9iamVjdCIsImNvcHlQcm90b3R5cGUiLCJldmVyeSIsImZ1bmN0aW9uTmFtZSIsInRoaXMiLCJyZXF1aXJlJCQ5Iiwid2l0aEdsb2JhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUN0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S0FBSyxJQUFJO0FBQ25ELElBQUksUUFBUSxLQUFLO0FBQ2pCLE1BQU0sS0FBS0MsYUFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3pDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzNDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzNDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzVDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQzNDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzdDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzlDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQzdDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3pDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzFDLE1BQU0sS0FBS0EsYUFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSztBQUMxQyxRQUFRLE9BQU8sS0FBSyxDQUFDO0FBQ3JCO0FBQ0EsTUFBTSxLQUFLQSxhQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FB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Q0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUNBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLCtCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQywrQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTsrQkFDcmQsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUNBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLHFDQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxtQ0FBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsMkNBQTRCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFH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
