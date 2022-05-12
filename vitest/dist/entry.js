import fs, { promises } from 'fs';
import { Console } from 'console';
import { Writable } from 'stream';
import { importModule } from 'local-pkg';
import chai$1, { expect, util } from 'chai';
import { a as commonjsRequire, c as commonjsGlobal } from './vendor-_commonjsHelpers.91d4f591.js';
import { c as index, r as relative } from './vendor-index.76be1f4d.js';
import { r as rpc } from './chunk-runtime-rpc.1832c38c.js';
import { i as isObject, k as getCallLastIndex, s as slash, p as getNames, c, t as toArray, q as partitionSuiteChildren, r as hasTests, h as hasFailed, g as getFullName } from './chunk-utils-base.68f100c1.js';
import { f as format_1, h as getSerializers, j as equals, k as iterableEquality, l as subsetEquality, p as plugins_1, b as getState, m as isA, J as JestChaiExpect, n as clearContext, o as defaultSuite, q as setHooks, r as getHooks, u as context, s as setState, x as getFn, e as vi } from './chunk-runtime-chain.2a787014.js';
import { g as getOriginalPos, a as posToNumber, n as numberToPos, l as lineSplitRE, p as parseStacktrace } from './chunk-utils-source-map.38ddd54e.js';
import { u as unifiedDiff, t as takeCoverage } from './chunk-defaults.366529f7.js';
import { performance as performance$1 } from 'perf_hooks';
import { createHash } from 'crypto';
import { format } from 'util';
import 'path';
import 'tty';
import './jest-mock.js';
import 'tinyspy';
import 'module';
import 'url';

var node = {
  name: "node",
  async setup() {
    return {
      teardown() {
      }
    };
  }
};

const LIVING_KEYS = [
  "DOMException",
  "URL",
  "URLSearchParams",
  "EventTarget",
  "NamedNodeMap",
  "Node",
  "Attr",
  "Element",
  "DocumentFragment",
  "DOMImplementation",
  "Document",
  "XMLDocument",
  "CharacterData",
  "Text",
  "CDATASection",
  "ProcessingInstruction",
  "Comment",
  "DocumentType",
  "NodeList",
  "HTMLCollection",
  "HTMLOptionsCollection",
  "DOMStringMap",
  "DOMTokenList",
  "StyleSheetList",
  "HTMLElement",
  "HTMLHeadElement",
  "HTMLTitleElement",
  "HTMLBaseElement",
  "HTMLLinkElement",
  "HTMLMetaElement",
  "HTMLStyleElement",
  "HTMLBodyElement",
  "HTMLHeadingElement",
  "HTMLParagraphElement",
  "HTMLHRElement",
  "HTMLPreElement",
  "HTMLUListElement",
  "HTMLOListElement",
  "HTMLLIElement",
  "HTMLMenuElement",
  "HTMLDListElement",
  "HTMLDivElement",
  "HTMLAnchorElement",
  "HTMLAreaElement",
  "HTMLBRElement",
  "HTMLButtonElement",
  "HTMLCanvasElement",
  "HTMLDataElement",
  "HTMLDataListElement",
  "HTMLDetailsElement",
  "HTMLDialogElement",
  "HTMLDirectoryElement",
  "HTMLFieldSetElement",
  "HTMLFontElement",
  "HTMLFormElement",
  "HTMLHtmlElement",
  "HTMLImageElement",
  "HTMLInputElement",
  "HTMLLabelElement",
  "HTMLLegendElement",
  "HTMLMapElement",
  "HTMLMarqueeElement",
  "HTMLMediaElement",
  "HTMLMeterElement",
  "HTMLModElement",
  "HTMLOptGroupElement",
  "HTMLOptionElement",
  "HTMLOutputElement",
  "HTMLPictureElement",
  "HTMLProgressElement",
  "HTMLQuoteElement",
  "HTMLScriptElement",
  "HTMLSelectElement",
  "HTMLSlotElement",
  "HTMLSourceElement",
  "HTMLSpanElement",
  "HTMLTableCaptionElement",
  "HTMLTableCellElement",
  "HTMLTableColElement",
  "HTMLTableElement",
  "HTMLTimeElement",
  "HTMLTableRowElement",
  "HTMLTableSectionElement",
  "HTMLTemplateElement",
  "HTMLTextAreaElement",
  "HTMLUnknownElement",
  "HTMLFrameElement",
  "HTMLFrameSetElement",
  "HTMLIFrameElement",
  "HTMLEmbedElement",
  "HTMLObjectElement",
  "HTMLParamElement",
  "HTMLVideoElement",
  "HTMLAudioElement",
  "HTMLTrackElement",
  "SVGElement",
  "SVGGraphicsElement",
  "SVGSVGElement",
  "SVGTitleElement",
  "SVGAnimatedString",
  "SVGNumber",
  "SVGStringList",
  "Event",
  "CloseEvent",
  "CustomEvent",
  "MessageEvent",
  "ErrorEvent",
  "HashChangeEvent",
  "PopStateEvent",
  "StorageEvent",
  "ProgressEvent",
  "PageTransitionEvent",
  "UIEvent",
  "FocusEvent",
  "InputEvent",
  "MouseEvent",
  "KeyboardEvent",
  "TouchEvent",
  "CompositionEvent",
  "WheelEvent",
  "BarProp",
  "External",
  "Location",
  "History",
  "Screen",
  "Performance",
  "Navigator",
  "PluginArray",
  "MimeTypeArray",
  "Plugin",
  "MimeType",
  "FileReader",
  "Blob",
  "File",
  "FileList",
  "ValidityState",
  "DOMParser",
  "XMLSerializer",
  "FormData",
  "XMLHttpRequestEventTarget",
  "XMLHttpRequestUpload",
  "XMLHttpRequest",
  "WebSocket",
  "NodeFilter",
  "NodeIterator",
  "TreeWalker",
  "AbstractRange",
  "Range",
  "StaticRange",
  "Selection",
  "Storage",
  "CustomElementRegistry",
  "ShadowRoot",
  "MutationObserver",
  "MutationRecord",
  "Headers",
  "AbortController",
  "AbortSignal",
  "Image"
];
const OTHER_KEYS = [
  "addEventListener",
  "alert",
  "atob",
  "blur",
  "btoa",
  "close",
  "confirm",
  "createPopup",
  "dispatchEvent",
  "document",
  "focus",
  "frames",
  "getComputedStyle",
  "history",
  "innerHeight",
  "innerWidth",
  "length",
  "location",
  "matchMedia",
  "moveBy",
  "moveTo",
  "name",
  "navigator",
  "open",
  "outerHeight",
  "outerWidth",
  "pageXOffset",
  "pageYOffset",
  "parent",
  "postMessage",
  "print",
  "prompt",
  "removeEventListener",
  "resizeBy",
  "resizeTo",
  "screen",
  "screenLeft",
  "screenTop",
  "screenX",
  "screenY",
  "scroll",
  "scrollBy",
  "scrollLeft",
  "scrollTo",
  "scrollTop",
  "scrollX",
  "scrollY",
  "self",
  "stop",
  "top",
  "window"
];
const KEYS = LIVING_KEYS.concat(OTHER_KEYS);

const allowRewrite = new Set([
  "Event"
]);
function getWindowKeys(global, win) {
  const keys = new Set(KEYS.concat(Object.getOwnPropertyNames(win)).filter((k) => {
    if (k.startsWith("_"))
      return false;
    if (k in global)
      return allowRewrite.has(k);
    return true;
  }));
  return keys;
}

var __defProp$4 = Object.defineProperty;
var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$4 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$4.call(b, prop))
      __defNormalProp$4(a, prop, b[prop]);
  if (__getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(b)) {
      if (__propIsEnum$4.call(b, prop))
        __defNormalProp$4(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$4)
    for (var prop of __getOwnPropSymbols$4(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var jsdom = {
  name: "jsdom",
  async setup(global, { jsdom = {} }) {
    const {
      CookieJar,
      JSDOM,
      ResourceLoader,
      VirtualConsole
    } = await importModule("jsdom");
    const _a = jsdom, {
      html = "<!DOCTYPE html>",
      userAgent,
      url = "http://localhost:3000",
      contentType = "text/html",
      pretendToBeVisual = true,
      includeNodeLocations = false,
      runScripts = "dangerously",
      resources,
      console = false,
      cookieJar = false
    } = _a, restOptions = __objRest(_a, [
      "html",
      "userAgent",
      "url",
      "contentType",
      "pretendToBeVisual",
      "includeNodeLocations",
      "runScripts",
      "resources",
      "console",
      "cookieJar"
    ]);
    const dom = new JSDOM(html, __spreadValues$4({
      pretendToBeVisual,
      resources: resources ?? (userAgent ? new ResourceLoader({ userAgent }) : void 0),
      runScripts,
      url,
      virtualConsole: console && global.console ? new VirtualConsole().sendTo(global.console) : void 0,
      cookieJar: cookieJar ? new CookieJar() : void 0,
      includeNodeLocations,
      contentType,
      userAgent
    }, restOptions));
    const keys = getWindowKeys(global, dom.window);
    const overrideObject = new Map();
    for (const key of keys) {
      Object.defineProperty(global, key, {
        get() {
          if (overrideObject.has(key))
            return overrideObject.get(key);
          return dom.window[key];
        },
        set(v) {
          overrideObject.set(key, v);
        },
        configurable: true
      });
    }
    return {
      teardown(global2) {
        keys.forEach((key) => delete global2[key]);
      }
    };
  }
};

var happy = {
  name: "happy-dom",
  async setup(global) {
    const { Window } = await importModule("happy-dom");
    const win = new Window();
    const keys = getWindowKeys(global, win);
    const overrideObject = new Map();
    for (const key of keys) {
      Object.defineProperty(global, key, {
        get() {
          if (overrideObject.has(key))
            return overrideObject.get(key);
          return win[key];
        },
        set(v) {
          overrideObject.set(key, v);
        },
        configurable: true
      });
    }
    return {
      teardown(global2) {
        win.happyDOM.cancelAsync();
        keys.forEach((key) => delete global2[key]);
      }
    };
  }
};

const environments = {
  node,
  jsdom,
  "happy-dom": happy
};

var chaiSubset = {exports: {}};

(function (module, exports) {
(function() {
	(function(chaiSubset) {
		if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
			return module.exports = chaiSubset;
		} else {
			return chai.use(chaiSubset);
		}
	})(function(chai, utils) {
		var Assertion = chai.Assertion;
		var assertionPrototype = Assertion.prototype;

		Assertion.addMethod('containSubset', function (expected) {
			var actual = utils.flag(this, 'object');
			var showDiff = chai.config.showDiff;

			assertionPrototype.assert.call(this,
				compare(expected, actual),
				'expected #{act} to contain subset #{exp}',
				'expected #{act} to not contain subset #{exp}',
				expected,
				actual,
				showDiff
			);
		});

		chai.assert.containSubset = function(val, exp, msg) {
			new chai.Assertion(val, msg).to.be.containSubset(exp);
		};

		function compare(expected, actual) {
			if (expected === actual) {
				return true;
			}
			if (typeof(actual) !== typeof(expected)) {
				return false;
			}
			if (typeof(expected) !== 'object' || expected === null) {
				return expected === actual;
			}
			if (!!expected && !actual) {
				return false;
			}

			if (Array.isArray(expected)) {
				if (typeof(actual.length) !== 'number') {
					return false;
				}
				var aa = Array.prototype.slice.call(actual);
				return expected.every(function (exp) {
					return aa.some(function (act) {
						return compare(exp, act);
					});
				});
			}

			if (expected instanceof Date) {
				if (actual instanceof Date) {
					return expected.getTime() === actual.getTime();
				} else {
					return false;
				}
			}

			return Object.keys(expected).every(function (key) {
				var eo = expected[key];
				var ao = actual[key];
				if (typeof(eo) === 'object' && eo !== null && ao !== null) {
					return compare(eo, ao);
				}
				if (typeof(eo) === 'function') {
					return eo(ao);
				}
				return ao === eo;
			});
		}
	});

}).call(commonjsGlobal);
}(chaiSubset));

var Subset = chaiSubset.exports;

var naturalCompare$2 = {exports: {}};

/*
 * @version    1.4.0
 * @date       2015-10-26
 * @stability  3 - Stable
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */


var naturalCompare = function(a, b) {
	var i, codeA
	, codeB = 1
	, posA = 0
	, posB = 0
	, alphabet = String.alphabet;

	function getCode(str, pos, code) {
		if (code) {
			for (i = pos; code = getCode(str, i), code < 76 && code > 65;) ++i;
			return +str.slice(pos - 1, i)
		}
		code = alphabet && alphabet.indexOf(str.charAt(pos));
		return code > -1 ? code + 76 : ((code = str.charCodeAt(pos) || 0), code < 45 || code > 127) ? code
			: code < 46 ? 65               // -
			: code < 48 ? code - 1
			: code < 58 ? code + 18        // 0-9
			: code < 65 ? code - 11
			: code < 91 ? code + 11        // A-Z
			: code < 97 ? code - 37
			: code < 123 ? code + 5        // a-z
			: code - 63
	}


	if ((a+="") != (b+="")) for (;codeB;) {
		codeA = getCode(a, posA++);
		codeB = getCode(b, posB++);

		if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
			codeA = getCode(a, posA, posA);
			codeB = getCode(b, posB, posA = i);
			posB = i;
		}

		if (codeA != codeB) return (codeA < codeB) ? -1 : 1
	}
	return 0
};

try {
	naturalCompare$2.exports = naturalCompare;
} catch (e) {
	String.naturalCompare = naturalCompare;
}

var naturalCompare$1 = naturalCompare$2.exports;

var __defProp$3 = Object.defineProperty;
var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$3 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$3.call(b, prop))
      __defNormalProp$3(a, prop, b[prop]);
  if (__getOwnPropSymbols$3)
    for (var prop of __getOwnPropSymbols$3(b)) {
      if (__propIsEnum$3.call(b, prop))
        __defNormalProp$3(a, prop, b[prop]);
    }
  return a;
};
const SNAPSHOT_VERSION = "1";
const writeSnapshotVersion = () => `// Vitest Snapshot v${SNAPSHOT_VERSION}`;
const testNameToKey = (testName, count) => `${testName} ${count}`;
const keyToTestName = (key) => {
  if (!/ \d+$/.test(key))
    throw new Error("Snapshot keys must end with a number.");
  return key.replace(/ \d+$/, "");
};
const getSnapshotData = (snapshotPath, update) => {
  const data = Object.create(null);
  let snapshotContents = "";
  let dirty = false;
  if (fs.existsSync(snapshotPath)) {
    try {
      snapshotContents = fs.readFileSync(snapshotPath, "utf8");
      const populate = new Function("exports", snapshotContents);
      populate(data);
    } catch {
    }
  }
  const isInvalid = snapshotContents;
  if ((update === "all" || update === "new") && isInvalid)
    dirty = true;
  return { data, dirty };
};
const addExtraLineBreaks = (string) => string.includes("\n") ? `
${string}
` : string;
const removeExtraLineBreaks = (string) => string.length > 2 && string.startsWith("\n") && string.endsWith("\n") ? string.slice(1, -1) : string;
const escapeRegex = true;
const printFunctionName = false;
function serialize(val, indent = 2, formatOverrides = {}) {
  return normalizeNewlines(format_1(val, __spreadValues$3({
    escapeRegex,
    indent,
    plugins: getSerializers(),
    printFunctionName
  }, formatOverrides)));
}
function escapeBacktickString(str) {
  return str.replace(/`|\\|\${/g, "\\$&");
}
function printBacktickString(str) {
  return `\`${escapeBacktickString(str)}\``;
}
function ensureDirectoryExists(filePath) {
  try {
    fs.mkdirSync(index.join(index.dirname(filePath)), { recursive: true });
  } catch {
  }
}
function normalizeNewlines(string) {
  return string.replace(/\r\n|\r/g, "\n");
}
async function saveSnapshotFile(snapshotData, snapshotPath) {
  const snapshots = Object.keys(snapshotData).sort(naturalCompare$1).map((key) => `exports[${printBacktickString(key)}] = ${printBacktickString(normalizeNewlines(snapshotData[key]))};`);
  ensureDirectoryExists(snapshotPath);
  await promises.writeFile(snapshotPath, `${writeSnapshotVersion()}

${snapshots.join("\n\n")}
`, "utf-8");
}
function prepareExpected(expected) {
  function findStartIndent() {
    var _a;
    const match = /^( +)}\s+$/m.exec(expected || "");
    return ((_a = match == null ? void 0 : match[1]) == null ? void 0 : _a.length) || 0;
  }
  const startIdent = findStartIndent();
  let expectedTrimmed = expected == null ? void 0 : expected.trim();
  if (startIdent) {
    expectedTrimmed = expectedTrimmed == null ? void 0 : expectedTrimmed.replace(new RegExp(`^${" ".repeat(startIdent)}`, "gm"), "").replace(/ +}$/, "}");
  }
  return expectedTrimmed;
}
function deepMergeArray(target = [], source = []) {
  const mergedOutput = Array.from(target);
  source.forEach((sourceElement, index) => {
    const targetElement = mergedOutput[index];
    if (Array.isArray(target[index])) {
      mergedOutput[index] = deepMergeArray(target[index], sourceElement);
    } else if (isObject(targetElement)) {
      mergedOutput[index] = deepMergeSnapshot(target[index], sourceElement);
    } else {
      mergedOutput[index] = sourceElement;
    }
  });
  return mergedOutput;
}
function deepMergeSnapshot(target, source) {
  if (isObject(target) && isObject(source)) {
    const mergedOutput = __spreadValues$3({}, target);
    Object.keys(source).forEach((key) => {
      if (isObject(source[key]) && !source[key].$$typeof) {
        if (!(key in target))
          Object.assign(mergedOutput, { [key]: source[key] });
        else
          mergedOutput[key] = deepMergeSnapshot(target[key], source[key]);
      } else if (Array.isArray(source[key])) {
        mergedOutput[key] = deepMergeArray(target[key], source[key]);
      } else {
        Object.assign(mergedOutput, { [key]: source[key] });
      }
    });
    return mergedOutput;
  } else if (Array.isArray(target) && Array.isArray(source)) {
    return deepMergeArray(target, source);
  }
  return target;
}

async function saveInlineSnapshots(snapshots) {
  const MagicString = (await import('./chunk-magic-string.6c8f4a10.js')).default;
  const files = new Set(snapshots.map((i) => i.file));
  await Promise.all(Array.from(files).map(async (file) => {
    const map = await rpc().getSourceMap(file);
    const snaps = snapshots.filter((i) => i.file === file);
    const code = await promises.readFile(file, "utf8");
    const s = new MagicString(code);
    for (const snap of snaps) {
      const pos = await getOriginalPos(map, snap);
      const index = posToNumber(code, pos);
      replaceInlineSnap(code, s, index, snap.snapshot);
    }
    const transformed = s.toString();
    if (transformed !== code)
      await promises.writeFile(file, transformed, "utf-8");
  }));
}
const startObjectRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*({)/m;
function replaceObjectSnap(code, s, index, newSnap) {
  code = code.slice(index);
  const startMatch = startObjectRegex.exec(code);
  if (!startMatch)
    return false;
  code = code.slice(startMatch.index);
  const charIndex = getCallLastIndex(code);
  if (charIndex === null)
    return false;
  s.appendLeft(index + startMatch.index + charIndex, `, ${prepareSnapString(newSnap, code, index)}`);
  return true;
}
function prepareSnapString(snap, source, index) {
  const lineIndex = numberToPos(source, index).line;
  const line = source.split(lineSplitRE)[lineIndex - 1];
  const indent = line.match(/^\s*/)[0] || "";
  const indentNext = indent.includes("	") ? `${indent}	` : `${indent}  `;
  const lines = snap.trim().replace(/\\/g, "\\\\").replace(/\$/g, "\\$").split(/\n/g).map((i) => i.trimEnd());
  const isOneline = lines.length <= 1;
  const quote = isOneline ? "'" : "`";
  return isOneline ? `'${lines.join("\n").replace(/'/g, "\\'")}'` : `${quote}
${lines.map((i) => indentNext + i).join("\n").replace(/`/g, "\\`")}
${indent}${quote}`;
}
const startRegex = /(?:toMatchInlineSnapshot|toThrowErrorMatchingInlineSnapshot)\s*\(\s*[\w_$]*(['"`\)])/m;
function replaceInlineSnap(code, s, index, newSnap) {
  const startMatch = startRegex.exec(code.slice(index));
  if (!startMatch)
    return replaceObjectSnap(code, s, index, newSnap);
  const quote = startMatch[1];
  const startIndex = index + startMatch.index + startMatch[0].length;
  const snapString = prepareSnapString(newSnap, code, index);
  if (quote === ")") {
    s.appendRight(startIndex - 1, snapString);
    return true;
  }
  const quoteEndRE = new RegExp(`(?:^|[^\\\\])${quote}`);
  const endMatch = quoteEndRE.exec(code.slice(startIndex));
  if (!endMatch)
    return false;
  const endIndex = startIndex + endMatch.index + endMatch[0].length;
  s.overwrite(startIndex - 1, endIndex, snapString);
  return true;
}
const INDENTATION_REGEX = /^([^\S\n]*)\S/m;
function stripSnapshotIndentation(inlineSnapshot) {
  const match = inlineSnapshot.match(INDENTATION_REGEX);
  if (!match || !match[1]) {
    return inlineSnapshot;
  }
  const indentation = match[1];
  const lines = inlineSnapshot.split(/\n/g);
  if (lines.length <= 2) {
    return inlineSnapshot;
  }
  if (lines[0].trim() !== "" || lines[lines.length - 1].trim() !== "") {
    return inlineSnapshot;
  }
  for (let i = 1; i < lines.length - 1; i++) {
    if (lines[i] !== "") {
      if (lines[i].indexOf(indentation) !== 0) {
        return inlineSnapshot;
      }
      lines[i] = lines[i].substring(indentation.length);
    }
  }
  lines[lines.length - 1] = "";
  inlineSnapshot = lines.join("\n");
  return inlineSnapshot;
}

var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
class SnapshotState {
  constructor(snapshotPath, options) {
    this._snapshotPath = snapshotPath;
    const { data, dirty } = getSnapshotData(this._snapshotPath, options.updateSnapshot);
    this._initialData = data;
    this._snapshotData = data;
    this._dirty = dirty;
    this._inlineSnapshots = [];
    this._uncheckedKeys = new Set(Object.keys(this._snapshotData));
    this._counters = new Map();
    this.expand = options.expand || false;
    this.added = 0;
    this.matched = 0;
    this.unmatched = 0;
    this._updateSnapshot = options.updateSnapshot;
    this.updated = 0;
    this._snapshotFormat = __spreadValues$2({
      printBasicPrototype: false
    }, options.snapshotFormat);
  }
  markSnapshotsAsCheckedForTest(testName) {
    this._uncheckedKeys.forEach((uncheckedKey) => {
      if (keyToTestName(uncheckedKey) === testName)
        this._uncheckedKeys.delete(uncheckedKey);
    });
  }
  _getInlineSnapshotStack(stacks) {
    const promiseIndex = stacks.findIndex((i) => i.method.match(/__VITEST_(RESOLVES|REJECTS)__/));
    if (promiseIndex !== -1)
      return stacks[promiseIndex + 3];
    const stackIndex = stacks.findIndex((i) => i.method.includes("__VITEST_INLINE_SNAPSHOT__"));
    return stackIndex !== -1 ? stacks[stackIndex + 2] : null;
  }
  _addSnapshot(key, receivedSerialized, options) {
    this._dirty = true;
    if (options.isInline) {
      const error = options.error || new Error("Unknown error");
      const stacks = parseStacktrace(error, true);
      stacks.forEach((i) => i.file = slash(i.file));
      const stack = this._getInlineSnapshotStack(stacks);
      if (!stack) {
        throw new Error(`Vitest: Couldn't infer stack frame for inline snapshot.
${JSON.stringify(stacks)}`);
      }
      this._inlineSnapshots.push(__spreadValues$2({
        snapshot: receivedSerialized
      }, stack));
    } else {
      this._snapshotData[key] = receivedSerialized;
    }
  }
  clear() {
    this._snapshotData = this._initialData;
    this._counters = new Map();
    this.added = 0;
    this.matched = 0;
    this.unmatched = 0;
    this.updated = 0;
  }
  async save() {
    const hasExternalSnapshots = Object.keys(this._snapshotData).length;
    const hasInlineSnapshots = this._inlineSnapshots.length;
    const isEmpty = !hasExternalSnapshots && !hasInlineSnapshots;
    const status = {
      deleted: false,
      saved: false
    };
    if ((this._dirty || this._uncheckedKeys.size) && !isEmpty) {
      if (hasExternalSnapshots)
        await saveSnapshotFile(this._snapshotData, this._snapshotPath);
      if (hasInlineSnapshots)
        await saveInlineSnapshots(this._inlineSnapshots);
      status.saved = true;
    } else if (!hasExternalSnapshots && fs.existsSync(this._snapshotPath)) {
      if (this._updateSnapshot === "all")
        fs.unlinkSync(this._snapshotPath);
      status.deleted = true;
    }
    return status;
  }
  getUncheckedCount() {
    return this._uncheckedKeys.size || 0;
  }
  getUncheckedKeys() {
    return Array.from(this._uncheckedKeys);
  }
  removeUncheckedKeys() {
    if (this._updateSnapshot === "all" && this._uncheckedKeys.size) {
      this._dirty = true;
      this._uncheckedKeys.forEach((key) => delete this._snapshotData[key]);
      this._uncheckedKeys.clear();
    }
  }
  match({
    testName,
    received,
    key,
    inlineSnapshot,
    isInline,
    error
  }) {
    this._counters.set(testName, (this._counters.get(testName) || 0) + 1);
    const count = Number(this._counters.get(testName));
    if (!key)
      key = testNameToKey(testName, count);
    if (!(isInline && this._snapshotData[key] !== void 0))
      this._uncheckedKeys.delete(key);
    const receivedSerialized = addExtraLineBreaks(serialize(received, void 0, this._snapshotFormat));
    const expected = isInline ? inlineSnapshot : this._snapshotData[key];
    const expectedTrimmed = prepareExpected(expected);
    const pass = expectedTrimmed === prepareExpected(receivedSerialized);
    const hasSnapshot = expected !== void 0;
    const snapshotIsPersisted = isInline || fs.existsSync(this._snapshotPath);
    if (pass && !isInline) {
      this._snapshotData[key] = receivedSerialized;
    }
    if (hasSnapshot && this._updateSnapshot === "all" || (!hasSnapshot || !snapshotIsPersisted) && (this._updateSnapshot === "new" || this._updateSnapshot === "all")) {
      if (this._updateSnapshot === "all") {
        if (!pass) {
          if (hasSnapshot)
            this.updated++;
          else
            this.added++;
          this._addSnapshot(key, receivedSerialized, { error, isInline });
        } else {
          this.matched++;
        }
      } else {
        this._addSnapshot(key, receivedSerialized, { error, isInline });
        this.added++;
      }
      return {
        actual: "",
        count,
        expected: "",
        key,
        pass: true
      };
    } else {
      if (!pass) {
        this.unmatched++;
        return {
          actual: removeExtraLineBreaks(receivedSerialized),
          count,
          expected: expectedTrimmed !== void 0 ? removeExtraLineBreaks(expectedTrimmed) : void 0,
          key,
          pass: false
        };
      } else {
        this.matched++;
        return {
          actual: "",
          count,
          expected: "",
          key,
          pass: true
        };
      }
    }
  }
}

const resolveSnapshotPath = (testPath) => index.join(index.join(index.dirname(testPath), "__snapshots__"), `${index.basename(testPath)}.snap`);
class SnapshotClient {
  constructor() {
    this.testFile = "";
  }
  setTest(test) {
    this.test = test;
    if (this.testFile !== this.test.file.filepath) {
      if (this.snapshotState)
        this.saveSnap();
      this.testFile = this.test.file.filepath;
      this.snapshotState = new SnapshotState(resolveSnapshotPath(this.testFile), __vitest_worker__.config.snapshotOptions);
    }
  }
  clearTest() {
    this.test = void 0;
  }
  assert(received, message, isInline = false, properties, inlineSnapshot, error) {
    if (!this.test)
      throw new Error("Snapshot cannot be used outside of test");
    if (typeof properties === "object") {
      if (typeof received !== "object" || !received)
        throw new Error("Received value must be an object when the matcher has properties");
      try {
        const pass2 = equals(received, properties, [iterableEquality, subsetEquality]);
        if (!pass2)
          expect(received).equals(properties);
        else
          received = deepMergeSnapshot(received, properties);
      } catch (err) {
        err.message = "Snapshot mismatched";
        throw err;
      }
    }
    const testName = [
      ...getNames(this.test).slice(1),
      ...message ? [message] : []
    ].join(" > ");
    const { actual, expected, key, pass } = this.snapshotState.match({
      testName,
      received,
      isInline,
      error,
      inlineSnapshot
    });
    if (!pass) {
      try {
        expect(actual.trim()).equals(expected ? expected.trim() : "");
      } catch (error2) {
        error2.message = `Snapshot \`${key || "unknown"}\` mismatched`;
        throw error2;
      }
    }
  }
  async saveSnap() {
    if (!this.testFile || !this.snapshotState)
      return;
    const result = await packSnapshotState(this.testFile, this.snapshotState);
    await rpc().snapshotSaved(result);
    this.testFile = "";
    this.snapshotState = void 0;
  }
}
async function packSnapshotState(filepath, state) {
  const snapshot = {
    filepath,
    added: 0,
    fileDeleted: false,
    matched: 0,
    unchecked: 0,
    uncheckedKeys: [],
    unmatched: 0,
    updated: 0
  };
  const uncheckedCount = state.getUncheckedCount();
  const uncheckedKeys = state.getUncheckedKeys();
  if (uncheckedCount)
    state.removeUncheckedKeys();
  const status = await state.save();
  snapshot.fileDeleted = status.deleted;
  snapshot.added = state.added;
  snapshot.matched = state.matched;
  snapshot.unmatched = state.unmatched;
  snapshot.updated = state.updated;
  snapshot.unchecked = !status.deleted ? uncheckedCount : 0;
  snapshot.uncheckedKeys = Array.from(uncheckedKeys);
  return snapshot;
}

let _client;
function getSnapshotClient() {
  if (!_client)
    _client = new SnapshotClient();
  return _client;
}
const getErrorString = (expected) => {
  try {
    expected();
  } catch (e) {
    if (e instanceof Error)
      return e.message;
    return e;
  }
  throw new Error("snapshot function didn't threw");
};
const SnapshotPlugin = (chai, utils) => {
  for (const key of ["matchSnapshot", "toMatchSnapshot"]) {
    utils.addMethod(chai.Assertion.prototype, key, function(properties, message) {
      const expected = utils.flag(this, "object");
      if (typeof properties === "string" && typeof message === "undefined") {
        message = properties;
        properties = void 0;
      }
      getSnapshotClient().assert(expected, message, false, properties);
    });
  }
  utils.addMethod(chai.Assertion.prototype, "toMatchInlineSnapshot", function __VITEST_INLINE_SNAPSHOT__(properties, inlineSnapshot, message) {
    const expected = utils.flag(this, "object");
    const error = utils.flag(this, "error");
    if (typeof properties === "string") {
      message = inlineSnapshot;
      inlineSnapshot = properties;
      properties = void 0;
    }
    if (inlineSnapshot)
      inlineSnapshot = stripSnapshotIndentation(inlineSnapshot);
    getSnapshotClient().assert(expected, message, true, properties, inlineSnapshot, error);
  });
  utils.addMethod(chai.Assertion.prototype, "toThrowErrorMatchingSnapshot", function(message) {
    const expected = utils.flag(this, "object");
    getSnapshotClient().assert(getErrorString(expected), message);
  });
  utils.addMethod(chai.Assertion.prototype, "toThrowErrorMatchingInlineSnapshot", function __VITEST_INLINE_SNAPSHOT__(inlineSnapshot, message) {
    const expected = utils.flag(this, "object");
    const error = utils.flag(this, "error");
    getSnapshotClient().assert(getErrorString(expected), message, true, void 0, inlineSnapshot, error);
  });
};

const EXPECTED_COLOR = c.green;
const RECEIVED_COLOR = c.red;
const INVERTED_COLOR = c.inverse;
const BOLD_WEIGHT = c.bold;
const DIM_COLOR = c.dim;
const {
  AsymmetricMatcher: AsymmetricMatcher$1,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent
} = plugins_1;
const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher$1
];
function matcherHint(matcherName, received = "received", expected = "expected", options = {}) {
  const {
    comment = "",
    expectedColor = EXPECTED_COLOR,
    isDirectExpectCall = false,
    isNot = false,
    promise = "",
    receivedColor = RECEIVED_COLOR,
    secondArgument = "",
    secondArgumentColor = EXPECTED_COLOR
  } = options;
  let hint = "";
  let dimString = "expect";
  if (!isDirectExpectCall && received !== "") {
    hint += DIM_COLOR(`${dimString}(`) + receivedColor(received);
    dimString = ")";
  }
  if (promise !== "") {
    hint += DIM_COLOR(`${dimString}.`) + promise;
    dimString = "";
  }
  if (isNot) {
    hint += `${DIM_COLOR(`${dimString}.`)}not`;
    dimString = "";
  }
  if (matcherName.includes(".")) {
    dimString += matcherName;
  } else {
    hint += DIM_COLOR(`${dimString}.`) + matcherName;
    dimString = "";
  }
  if (expected === "") {
    dimString += "()";
  } else {
    hint += DIM_COLOR(`${dimString}(`) + expectedColor(expected);
    if (secondArgument)
      hint += DIM_COLOR(", ") + secondArgumentColor(secondArgument);
    dimString = ")";
  }
  if (comment !== "")
    dimString += ` // ${comment}`;
  if (dimString !== "")
    hint += DIM_COLOR(dimString);
  return hint;
}
const SPACE_SYMBOL = "\xB7";
const replaceTrailingSpaces = (text) => text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length));
const stringify = (object, maxDepth = 10) => {
  const MAX_LENGTH = 1e4;
  let result;
  try {
    result = format_1(object, {
      maxDepth,
      plugins: PLUGINS
    });
  } catch {
    result = format_1(object, {
      callToJSON: false,
      maxDepth,
      plugins: PLUGINS
    });
  }
  return result.length >= MAX_LENGTH && maxDepth > 1 ? stringify(object, Math.floor(maxDepth / 2)) : result;
};
const printReceived = (object) => RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)));
const printExpected = (value) => EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)));
function diff(a, b, options) {
  return unifiedDiff(stringify(a), stringify(b));
}

var matcherUtils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EXPECTED_COLOR: EXPECTED_COLOR,
  RECEIVED_COLOR: RECEIVED_COLOR,
  INVERTED_COLOR: INVERTED_COLOR,
  BOLD_WEIGHT: BOLD_WEIGHT,
  DIM_COLOR: DIM_COLOR,
  matcherHint: matcherHint,
  stringify: stringify,
  printReceived: printReceived,
  printExpected: printExpected,
  diff: diff
});

var __defProp$1 = Object.defineProperty;
var __defProps$1 = Object.defineProperties;
var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
const isAsyncFunction = (fn) => typeof fn === "function" && fn[Symbol.toStringTag] === "AsyncFunction";
const getMatcherState = (assertion) => {
  const obj = assertion._obj;
  const isNot = util.flag(assertion, "negate");
  const promise = util.flag(assertion, "promise") || "";
  const jestUtils = __spreadProps$1(__spreadValues$1({}, matcherUtils), {
    iterableEquality,
    subsetEquality
  });
  const matcherState = __spreadProps$1(__spreadValues$1({}, getState()), {
    isNot,
    utils: jestUtils,
    promise,
    equals,
    suppressedErrors: []
  });
  return {
    state: matcherState,
    isNot,
    obj
  };
};
class JestExtendError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.actual = actual;
    this.expected = expected;
  }
}
function JestExtendPlugin(expects) {
  return (c, utils) => {
    Object.entries(expects).forEach(([expectAssertionName, expectAssertion]) => {
      function expectSyncWrapper(...args) {
        const { state, isNot, obj } = getMatcherState(this);
        const { pass, message, actual, expected } = expectAssertion.call(state, obj, ...args);
        if (pass && isNot || !pass && !isNot)
          throw new JestExtendError(message(), actual, expected);
      }
      async function expectAsyncWrapper(...args) {
        const { state, isNot, obj } = getMatcherState(this);
        const { pass, message, actual, expected } = await expectAssertion.call(state, obj, ...args);
        if (pass && isNot || !pass && !isNot)
          throw new JestExtendError(message(), actual, expected);
      }
      const expectAssertionWrapper = isAsyncFunction(expectAssertion) ? expectAsyncWrapper : expectSyncWrapper;
      utils.addMethod(chai$1.Assertion.prototype, expectAssertionName, expectAssertionWrapper);
    });
  };
}
const JestExtend = (chai2, utils) => {
  utils.addMethod(chai2.expect, "extend", (expects) => {
    chai2.use(JestExtendPlugin(expects));
  });
};

class AsymmetricMatcher {
  constructor(sample, inverse = false) {
    this.sample = sample;
    this.inverse = inverse;
    this.$$typeof = Symbol.for("jest.asymmetricMatcher");
  }
  getMatcherContext() {
    return {
      equals,
      isNot: this.inverse,
      utils: matcherUtils
    };
  }
}
class StringContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    if (!isA("String", sample))
      throw new Error("Expected is not a string");
    super(sample, inverse);
  }
  asymmetricMatch(other) {
    const result = isA("String", other) && other.includes(this.sample);
    return this.inverse ? !result : result;
  }
  toString() {
    return `String${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "string";
  }
}
class Anything extends AsymmetricMatcher {
  asymmetricMatch(other) {
    return other != null;
  }
  toString() {
    return "Anything";
  }
  toAsymmetricMatcher() {
    return "Anything";
  }
}
class ObjectContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }
  getPrototype(obj) {
    if (Object.getPrototypeOf)
      return Object.getPrototypeOf(obj);
    if (obj.constructor.prototype === obj)
      return null;
    return obj.constructor.prototype;
  }
  hasProperty(obj, property) {
    if (!obj)
      return false;
    if (Object.prototype.hasOwnProperty.call(obj, property))
      return true;
    return this.hasProperty(this.getPrototype(obj), property);
  }
  asymmetricMatch(other) {
    if (typeof this.sample !== "object") {
      throw new TypeError(`You must provide an object to ${this.toString()}, not '${typeof this.sample}'.`);
    }
    let result = true;
    for (const property in this.sample) {
      if (!this.hasProperty(other, property) || !equals(this.sample[property], other[property])) {
        result = false;
        break;
      }
    }
    return this.inverse ? !result : result;
  }
  toString() {
    return `Object${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "object";
  }
}
class ArrayContaining extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    super(sample, inverse);
  }
  asymmetricMatch(other) {
    if (!Array.isArray(this.sample)) {
      throw new TypeError(`You must provide an array to ${this.toString()}, not '${typeof this.sample}'.`);
    }
    const result = this.sample.length === 0 || Array.isArray(other) && this.sample.every((item) => other.some((another) => equals(item, another)));
    return this.inverse ? !result : result;
  }
  toString() {
    return `Array${this.inverse ? "Not" : ""}Containing`;
  }
  getExpectedType() {
    return "array";
  }
}
class Any extends AsymmetricMatcher {
  constructor(sample) {
    if (typeof sample === "undefined") {
      throw new TypeError("any() expects to be passed a constructor function. Please pass one or use anything() to match any object.");
    }
    super(sample);
  }
  fnNameFor(func) {
    if (func.name)
      return func.name;
    const functionToString = Function.prototype.toString;
    const matches = functionToString.call(func).match(/^(?:async)?\s*function\s*\*?\s*([\w$]+)\s*\(/);
    return matches ? matches[1] : "<anonymous>";
  }
  asymmetricMatch(other) {
    if (this.sample === String)
      return typeof other == "string" || other instanceof String;
    if (this.sample === Number)
      return typeof other == "number" || other instanceof Number;
    if (this.sample === Function)
      return typeof other == "function" || other instanceof Function;
    if (this.sample === Boolean)
      return typeof other == "boolean" || other instanceof Boolean;
    if (this.sample === BigInt)
      return typeof other == "bigint" || other instanceof BigInt;
    if (this.sample === Symbol)
      return typeof other == "symbol" || other instanceof Symbol;
    if (this.sample === Object)
      return typeof other == "object";
    return other instanceof this.sample;
  }
  toString() {
    return "Any";
  }
  getExpectedType() {
    if (this.sample === String)
      return "string";
    if (this.sample === Number)
      return "number";
    if (this.sample === Function)
      return "function";
    if (this.sample === Object)
      return "object";
    if (this.sample === Boolean)
      return "boolean";
    return this.fnNameFor(this.sample);
  }
  toAsymmetricMatcher() {
    return `Any<${this.fnNameFor(this.sample)}>`;
  }
}
class StringMatching extends AsymmetricMatcher {
  constructor(sample, inverse = false) {
    if (!isA("String", sample) && !isA("RegExp", sample))
      throw new Error("Expected is not a String or a RegExp");
    super(new RegExp(sample), inverse);
  }
  asymmetricMatch(other) {
    const result = isA("String", other) && this.sample.test(other);
    return this.inverse ? !result : result;
  }
  toString() {
    return `String${this.inverse ? "Not" : ""}Matching`;
  }
  getExpectedType() {
    return "string";
  }
}
const JestAsymmetricMatchers = (chai, utils) => {
  utils.addMethod(chai.expect, "anything", () => new Anything());
  utils.addMethod(chai.expect, "any", (expected) => new Any(expected));
  utils.addMethod(chai.expect, "stringContaining", (expected) => new StringContaining(expected));
  utils.addMethod(chai.expect, "objectContaining", (expected) => new ObjectContaining(expected));
  utils.addMethod(chai.expect, "arrayContaining", (expected) => new ArrayContaining(expected));
  utils.addMethod(chai.expect, "stringMatching", (expected) => new StringMatching(expected));
  chai.expect.not = {
    stringContaining: (expected) => new StringContaining(expected, true),
    objectContaining: (expected) => new ObjectContaining(expected, true),
    arrayContaining: (expected) => new ArrayContaining(expected, true),
    stringMatching: (expected) => new StringMatching(expected, true)
  };
};

let installed = false;
async function setupChai() {
  if (installed)
    return;
  chai$1.use(JestExtend);
  chai$1.use(JestChaiExpect);
  chai$1.use(Subset);
  chai$1.use(SnapshotPlugin);
  chai$1.use(JestAsymmetricMatchers);
  installed = true;
}

let globalSetup = false;
async function setupGlobalEnv(config) {
  setupDefines(config.defines);
  if (globalSetup)
    return;
  globalSetup = true;
  setupConsoleLogSpy();
  await setupChai();
  if (config.globals)
    (await import('./chunk-integrations-globals.cf9f400d.js')).registerApiGlobally();
}
function setupDefines(defines) {
  for (const key in defines)
    globalThis[key] = defines[key];
}
function setupConsoleLogSpy() {
  const stdout = new Writable({
    write(data, encoding, callback) {
      var _a;
      rpc().onUserConsoleLog({
        type: "stdout",
        content: String(data),
        taskId: (_a = __vitest_worker__.current) == null ? void 0 : _a.id,
        time: Date.now()
      });
      callback();
    }
  });
  const stderr = new Writable({
    write(data, encoding, callback) {
      var _a;
      rpc().onUserConsoleLog({
        type: "stderr",
        content: String(data),
        taskId: (_a = __vitest_worker__.current) == null ? void 0 : _a.id,
        time: Date.now()
      });
      callback();
    }
  });
  globalThis.console = new Console({
    stdout,
    stderr,
    colorMode: true,
    groupIndentation: 2
  });
}
async function withEnv(name, options, fn) {
  const env = await environments[name].setup(globalThis, options);
  try {
    await fn();
  } finally {
    await env.teardown(globalThis);
  }
}
async function runSetupFiles(config) {
  const files = toArray(config.setupFiles);
  await Promise.all(files.map(async (file) => {
    __vitest_worker__.moduleCache.delete(file);
    await import(file);
  }));
}

const OBJECT_PROTO = Object.getPrototypeOf({});
function serializeError(val, seen = new WeakMap()) {
  if (!val || typeof val === "string")
    return val;
  if (typeof val === "function")
    return `Function<${val.name}>`;
  if (typeof val !== "object")
    return val;
  if (val instanceof Promise || "then" in val || val.constructor && val.constructor.prototype === "AsyncFunction")
    return "Promise";
  if (typeof Element !== "undefined" && val instanceof Element)
    return val.tagName;
  if (typeof val.asymmetricMatch === "function")
    return `${val.toString()} ${format(val.sample)}`;
  if (seen.has(val))
    return seen.get(val);
  if (Array.isArray(val)) {
    const clone = new Array(val.length);
    seen.set(val, clone);
    val.forEach((e, i) => {
      clone[i] = serializeError(e, seen);
    });
    return clone;
  } else {
    const clone = Object.create(null);
    seen.set(val, clone);
    let obj = val;
    while (obj && obj !== OBJECT_PROTO) {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (!(key in clone))
          clone[key] = serializeError(obj[key], seen);
      });
      obj = Object.getPrototypeOf(obj);
    }
    return clone;
  }
}
function processError(err) {
  if (!err)
    return err;
  if (err.stack)
    err.stackStr = String(err.stack);
  if (err.name)
    err.nameStr = String(err.name);
  if (typeof err.expected !== "string")
    err.expected = stringify(err.expected);
  if (typeof err.actual !== "string")
    err.actual = stringify(err.actual);
  try {
    return serializeError(err);
  } catch (e) {
    return serializeError(new Error(`Failed to fully serialize error: ${e == null ? void 0 : e.message}.
Inner error message: ${err == null ? void 0 : err.message}`));
  }
}

function hash(str, length = 10) {
  return createHash("md5").update(str).digest("hex").slice(0, length);
}
async function collectTests(paths, config) {
  const files = [];
  for (const filepath of paths) {
    const path = relative(config.root, filepath);
    const file = {
      id: hash(path),
      name: path,
      type: "suite",
      mode: "run",
      filepath,
      tasks: []
    };
    clearContext();
    try {
      await runSetupFiles(config);
      await import(filepath);
      const defaultTasks = await defaultSuite.collect(file);
      setHooks(file, getHooks(defaultTasks));
      for (const c of [...defaultTasks.tasks, ...context.tasks]) {
        if (c.type === "test") {
          file.tasks.push(c);
        } else if (c.type === "suite") {
          file.tasks.push(c);
        } else {
          const start = performance.now();
          const suite = await c.collect(file);
          file.collectDuration = performance.now() - start;
          if (suite.name || suite.tasks.length)
            file.tasks.push(suite);
        }
      }
    } catch (e) {
      file.result = {
        state: "fail",
        error: processError(e)
      };
      process.stdout.write("\0");
    }
    calculateHash(file);
    const hasOnlyTasks = someTasksAreOnly(file);
    interpretTaskModes(file, config.testNamePattern, hasOnlyTasks, false, config.allowOnly);
    files.push(file);
  }
  return files;
}
function interpretTaskModes(suite, namePattern, onlyMode, parentIsOnly, allowOnly) {
  const suiteIsOnly = parentIsOnly || suite.mode === "only";
  suite.tasks.forEach((t) => {
    const includeTask = suiteIsOnly || t.mode === "only";
    if (onlyMode) {
      if (t.type === "suite" && (includeTask || someTasksAreOnly(t))) {
        if (t.mode === "only") {
          checkAllowOnly(t, allowOnly);
          t.mode = "run";
        }
      } else if (t.mode === "run" && !includeTask) {
        t.mode = "skip";
      } else if (t.mode === "only") {
        checkAllowOnly(t, allowOnly);
        t.mode = "run";
      }
    }
    if (t.type === "test") {
      if (namePattern && !getTaskFullName(t).match(namePattern))
        t.mode = "skip";
    } else if (t.type === "suite") {
      if (t.mode === "skip")
        skipAllTasks(t);
      else
        interpretTaskModes(t, namePattern, onlyMode, includeTask, allowOnly);
    }
  });
  if (suite.mode === "run") {
    if (suite.tasks.length && suite.tasks.every((i) => i.mode !== "run"))
      suite.mode = "skip";
  }
}
function getTaskFullName(task) {
  return `${task.suite ? `${getTaskFullName(task.suite)} ` : ""}${task.name}`;
}
function someTasksAreOnly(suite) {
  return suite.tasks.some((t) => t.mode === "only" || t.type === "suite" && someTasksAreOnly(t));
}
function skipAllTasks(suite) {
  suite.tasks.forEach((t) => {
    if (t.mode === "run") {
      t.mode = "skip";
      if (t.type === "suite")
        skipAllTasks(t);
    }
  });
}
function checkAllowOnly(task, allowOnly) {
  if (allowOnly)
    return;
  task.result = {
    state: "fail",
    error: processError(new Error("[Vitest] Unexpected .only modifier. Remove it or pass --allowOnly argument to bypass this error"))
  };
}
function calculateHash(parent) {
  parent.tasks.forEach((t, idx) => {
    t.id = `${parent.id}_${idx}`;
    if (t.type === "suite")
      calculateHash(t);
  });
}

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
async function callSuiteHook(suite, name, args) {
  if (name === "beforeEach" && suite.suite)
    await callSuiteHook(suite.suite, name, args);
  await Promise.all(getHooks(suite)[name].map((fn) => fn(...args)));
  if (name === "afterEach" && suite.suite)
    await callSuiteHook(suite.suite, name, args);
}
const packs = new Map();
let updateTimer;
let previousUpdate;
function updateTask(task) {
  packs.set(task.id, task.result);
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    previousUpdate = sendTasksUpdate();
  }, 10);
}
async function sendTasksUpdate() {
  clearTimeout(updateTimer);
  await previousUpdate;
  if (packs.size) {
    const p = rpc().onTaskUpdate(Array.from(packs));
    packs.clear();
    return p;
  }
}
async function runTest(test) {
  var _a, _b;
  if (test.mode !== "run")
    return;
  if (((_a = test.result) == null ? void 0 : _a.state) === "fail") {
    updateTask(test);
    return;
  }
  const start = performance$1.now();
  test.result = {
    state: "run"
  };
  updateTask(test);
  clearModuleMocks();
  getSnapshotClient().setTest(test);
  __vitest_worker__.current = test;
  try {
    await callSuiteHook(test.suite, "beforeEach", [test, test.suite]);
    setState({
      assertionCalls: 0,
      isExpectingAssertions: false,
      isExpectingAssertionsError: null,
      expectedAssertionsNumber: null,
      expectedAssertionsNumberError: null,
      testPath: (_b = test.suite.file) == null ? void 0 : _b.filepath,
      currentTestName: getFullName(test)
    });
    await getFn(test)();
    const { assertionCalls, expectedAssertionsNumber, expectedAssertionsNumberError, isExpectingAssertions, isExpectingAssertionsError } = getState();
    if (expectedAssertionsNumber !== null && assertionCalls !== expectedAssertionsNumber)
      throw expectedAssertionsNumberError;
    if (isExpectingAssertions === true && assertionCalls === 0)
      throw isExpectingAssertionsError;
    test.result.state = "pass";
  } catch (e) {
    test.result.state = "fail";
    test.result.error = processError(e);
  }
  try {
    await callSuiteHook(test.suite, "afterEach", [test, test.suite]);
  } catch (e) {
    test.result.state = "fail";
    test.result.error = processError(e);
  }
  if (test.fails) {
    if (test.result.state === "pass") {
      test.result.state = "fail";
      test.result.error = processError(new Error("Expect test to fail"));
    } else {
      test.result.state = "pass";
      test.result.error = void 0;
    }
  }
  getSnapshotClient().clearTest();
  test.result.duration = performance$1.now() - start;
  __vitest_worker__.current = void 0;
  updateTask(test);
}
function markTasksAsSkipped(suite) {
  suite.tasks.forEach((t) => {
    t.mode = "skip";
    t.result = __spreadProps(__spreadValues({}, t.result), { state: "skip" });
    updateTask(t);
    if (t.type === "suite")
      markTasksAsSkipped(t);
  });
}
async function runSuite(suite) {
  var _a;
  if (((_a = suite.result) == null ? void 0 : _a.state) === "fail") {
    markTasksAsSkipped(suite);
    updateTask(suite);
    return;
  }
  const start = performance$1.now();
  suite.result = {
    state: "run"
  };
  updateTask(suite);
  if (suite.mode === "skip") {
    suite.result.state = "skip";
  } else if (suite.mode === "todo") {
    suite.result.state = "todo";
  } else {
    try {
      await callSuiteHook(suite, "beforeAll", [suite]);
      for (const tasksGroup of partitionSuiteChildren(suite)) {
        if (tasksGroup[0].concurrent === true) {
          await Promise.all(tasksGroup.map((c) => runSuiteChild(c)));
        } else {
          for (const c of tasksGroup)
            await runSuiteChild(c);
        }
      }
      await callSuiteHook(suite, "afterAll", [suite]);
    } catch (e) {
      suite.result.state = "fail";
      suite.result.error = processError(e);
    }
  }
  suite.result.duration = performance$1.now() - start;
  if (suite.mode === "run") {
    if (!hasTests(suite)) {
      suite.result.state = "fail";
      if (!suite.result.error)
        suite.result.error = new Error(`No test found in suite ${suite.name}`);
    } else if (hasFailed(suite)) {
      suite.result.state = "fail";
    } else {
      suite.result.state = "pass";
    }
  }
  updateTask(suite);
}
async function runSuiteChild(c) {
  return c.type === "test" ? runTest(c) : runSuite(c);
}
async function runFiles(files, config) {
  var _a;
  for (const file of files) {
    if (!file.tasks.length && !config.passWithNoTests) {
      if (!((_a = file.result) == null ? void 0 : _a.error)) {
        file.result = {
          state: "fail",
          error: new Error(`No test suite found in file ${file.filepath}`)
        };
      }
    }
    await runSuite(file);
  }
}
async function startTests(paths, config) {
  const files = await collectTests(paths, config);
  rpc().onCollected(files);
  await runFiles(files, config);
  takeCoverage();
  await getSnapshotClient().saveSnap();
  await sendTasksUpdate();
}
function clearModuleMocks() {
  const { clearMocks, mockReset, restoreMocks } = __vitest_worker__.config;
  if (restoreMocks)
    vi.restoreAllMocks();
  else if (mockReset)
    vi.resetAllMocks();
  else if (clearMocks)
    vi.clearAllMocks();
}

async function run(files, config) {
  var _a;
  await setupGlobalEnv(config);
  for (const file of files) {
    const code = await promises.readFile(file, "utf-8");
    const env = ((_a = code.match(/@(?:vitest|jest)-environment\s+?([\w-]+)\b/)) == null ? void 0 : _a[1]) || config.environment || "node";
    if (!["node", "jsdom", "happy-dom"].includes(env))
      throw new Error(`Unsupported environment: ${env}`);
    __vitest_worker__.filepath = file;
    await withEnv(env, config.environmentOptions || {}, async () => {
      await startTests([file], config);
    });
    __vitest_worker__.filepath = void 0;
  }
}

export { run };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnRlZ3JhdGlvbnMvZW52L25vZGUudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL2Vudi9qc2RvbS1rZXlzLnRzIiwiLi4vc3JjL2ludGVncmF0aW9ucy9lbnYvdXRpbHMudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL2Vudi9qc2RvbS50cyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvZW52L2hhcHB5LWRvbS50cyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvZW52L2luZGV4LnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2NoYWktc3Vic2V0QDEuNi4wL25vZGVfbW9kdWxlcy9jaGFpLXN1YnNldC9saWIvY2hhaS1zdWJzZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbmF0dXJhbC1jb21wYXJlQDEuNC4wL25vZGVfbW9kdWxlcy9uYXR1cmFsLWNvbXBhcmUvaW5kZXguanMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL3NuYXBzaG90L3BvcnQvdXRpbHMudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL3NuYXBzaG90L3BvcnQvaW5saW5lU25hcHNob3QudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL3NuYXBzaG90L3BvcnQvc3RhdGUudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL3NuYXBzaG90L2NsaWVudC50cyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvc25hcHNob3QvY2hhaS50cyIsIi4uL3NyYy9pbnRlZ3JhdGlvbnMvY2hhaS9qZXN0LW1hdGNoZXItdXRpbHMudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL2NoYWkvamVzdC1leHRlbmQudHMiLCIuLi9zcmMvaW50ZWdyYXRpb25zL2NoYWkvamVzdC1hc3ltbWV0cmljLW1hdGNoZXJzLnRzIiwiLi4vc3JjL2ludGVncmF0aW9ucy9jaGFpL3NldHVwLnRzIiwiLi4vc3JjL3J1bnRpbWUvc2V0dXAudHMiLCIuLi9zcmMvcnVudGltZS9lcnJvci50cyIsIi4uL3NyYy9ydW50aW1lL2NvbGxlY3QudHMiLCIuLi9zcmMvcnVudGltZS9ydW4udHMiLCIuLi9zcmMvcnVudGltZS9lbnRyeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVudmlyb25tZW50IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IDxFbnZpcm9ubWVudD4oe1xuICBuYW1lOiAnbm9kZScsXG4gIGFzeW5jIHNldHVwKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZWFyZG93bigpIHtcbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiIsIi8vIFNFRSBodHRwczovL2dpdGh1Yi5jb20vanNkb20vanNkb20vYmxvYi9tYXN0ZXIvbGliL2pzZG9tL2xpdmluZy9pbnRlcmZhY2VzLmpzXG5cbmNvbnN0IExJVklOR19LRVlTID0gW1xuICAnRE9NRXhjZXB0aW9uJyxcbiAgJ1VSTCcsXG4gICdVUkxTZWFyY2hQYXJhbXMnLFxuICAnRXZlbnRUYXJnZXQnLFxuICAnTmFtZWROb2RlTWFwJyxcbiAgJ05vZGUnLFxuICAnQXR0cicsXG4gICdFbGVtZW50JyxcbiAgJ0RvY3VtZW50RnJhZ21lbnQnLFxuICAnRE9NSW1wbGVtZW50YXRpb24nLFxuICAnRG9jdW1lbnQnLFxuICAnWE1MRG9jdW1lbnQnLFxuICAnQ2hhcmFjdGVyRGF0YScsXG4gICdUZXh0JyxcbiAgJ0NEQVRBU2VjdGlvbicsXG4gICdQcm9jZXNzaW5nSW5zdHJ1Y3Rpb24nLFxuICAnQ29tbWVudCcsXG4gICdEb2N1bWVudFR5cGUnLFxuICAnTm9kZUxpc3QnLFxuICAnSFRNTENvbGxlY3Rpb24nLFxuICAnSFRNTE9wdGlvbnNDb2xsZWN0aW9uJyxcbiAgJ0RPTVN0cmluZ01hcCcsXG4gICdET01Ub2tlbkxpc3QnLFxuICAnU3R5bGVTaGVldExpc3QnLFxuICAnSFRNTEVsZW1lbnQnLFxuICAnSFRNTEhlYWRFbGVtZW50JyxcbiAgJ0hUTUxUaXRsZUVsZW1lbnQnLFxuICAnSFRNTEJhc2VFbGVtZW50JyxcbiAgJ0hUTUxMaW5rRWxlbWVudCcsXG4gICdIVE1MTWV0YUVsZW1lbnQnLFxuICAnSFRNTFN0eWxlRWxlbWVudCcsXG4gICdIVE1MQm9keUVsZW1lbnQnLFxuICAnSFRNTEhlYWRpbmdFbGVtZW50JyxcbiAgJ0hUTUxQYXJhZ3JhcGhFbGVtZW50JyxcbiAgJ0hUTUxIUkVsZW1lbnQnLFxuICAnSFRNTFByZUVsZW1lbnQnLFxuICAnSFRNTFVMaXN0RWxlbWVudCcsXG4gICdIVE1MT0xpc3RFbGVtZW50JyxcbiAgJ0hUTUxMSUVsZW1lbnQnLFxuICAnSFRNTE1lbnVFbGVtZW50JyxcbiAgJ0hUTUxETGlzdEVsZW1lbnQnLFxuICAnSFRNTERpdkVsZW1lbnQnLFxuICAnSFRNTEFuY2hvckVsZW1lbnQnLFxuICAnSFRNTEFyZWFFbGVtZW50JyxcbiAgJ0hUTUxCUkVsZW1lbnQnLFxuICAnSFRNTEJ1dHRvbkVsZW1lbnQnLFxuICAnSFRNTENhbnZhc0VsZW1lbnQnLFxuICAnSFRNTERhdGFFbGVtZW50JyxcbiAgJ0hUTUxEYXRhTGlzdEVsZW1lbnQnLFxuICAnSFRNTERldGFpbHNFbGVtZW50JyxcbiAgJ0hUTUxEaWFsb2dFbGVtZW50JyxcbiAgJ0hUTUxEaXJlY3RvcnlFbGVtZW50JyxcbiAgJ0hUTUxGaWVsZFNldEVsZW1lbnQnLFxuICAnSFRNTEZvbnRFbGVtZW50JyxcbiAgJ0hUTUxGb3JtRWxlbWVudCcsXG4gICdIVE1MSHRtbEVsZW1lbnQnLFxuICAnSFRNTEltYWdlRWxlbWVudCcsXG4gICdIVE1MSW5wdXRFbGVtZW50JyxcbiAgJ0hUTUxMYWJlbEVsZW1lbnQnLFxuICAnSFRNTExlZ2VuZEVsZW1lbnQnLFxuICAnSFRNTE1hcEVsZW1lbnQnLFxuICAnSFRNTE1hcnF1ZWVFbGVtZW50JyxcbiAgJ0hUTUxNZWRpYUVsZW1lbnQnLFxuICAnSFRNTE1ldGVyRWxlbWVudCcsXG4gICdIVE1MTW9kRWxlbWVudCcsXG4gICdIVE1MT3B0R3JvdXBFbGVtZW50JyxcbiAgJ0hUTUxPcHRpb25FbGVtZW50JyxcbiAgJ0hUTUxPdXRwdXRFbGVtZW50JyxcbiAgJ0hUTUxQaWN0dXJlRWxlbWVudCcsXG4gICdIVE1MUHJvZ3Jlc3NFbGVtZW50JyxcbiAgJ0hUTUxRdW90ZUVsZW1lbnQnLFxuICAnSFRNTFNjcmlwdEVsZW1lbnQnLFxuICAnSFRNTFNlbGVjdEVsZW1lbnQnLFxuICAnSFRNTFNsb3RFbGVtZW50JyxcbiAgJ0hUTUxTb3VyY2VFbGVtZW50JyxcbiAgJ0hUTUxTcGFuRWxlbWVudCcsXG4gICdIVE1MVGFibGVDYXB0aW9uRWxlbWVudCcsXG4gICdIVE1MVGFibGVDZWxsRWxlbWVudCcsXG4gICdIVE1MVGFibGVDb2xFbGVtZW50JyxcbiAgJ0hUTUxUYWJsZUVsZW1lbnQnLFxuICAnSFRNTFRpbWVFbGVtZW50JyxcbiAgJ0hUTUxUYWJsZVJvd0VsZW1lbnQnLFxuICAnSFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQnLFxuICAnSFRNTFRlbXBsYXRlRWxlbWVudCcsXG4gICdIVE1MVGV4dEFyZWFFbGVtZW50JyxcbiAgJ0hUTUxVbmtub3duRWxlbWVudCcsXG4gICdIVE1MRnJhbWVFbGVtZW50JyxcbiAgJ0hUTUxGcmFtZVNldEVsZW1lbnQnLFxuICAnSFRNTElGcmFtZUVsZW1lbnQnLFxuICAnSFRNTEVtYmVkRWxlbWVudCcsXG4gICdIVE1MT2JqZWN0RWxlbWVudCcsXG4gICdIVE1MUGFyYW1FbGVtZW50JyxcbiAgJ0hUTUxWaWRlb0VsZW1lbnQnLFxuICAnSFRNTEF1ZGlvRWxlbWVudCcsXG4gICdIVE1MVHJhY2tFbGVtZW50JyxcbiAgJ1NWR0VsZW1lbnQnLFxuICAnU1ZHR3JhcGhpY3NFbGVtZW50JyxcbiAgJ1NWR1NWR0VsZW1lbnQnLFxuICAnU1ZHVGl0bGVFbGVtZW50JyxcbiAgJ1NWR0FuaW1hdGVkU3RyaW5nJyxcbiAgJ1NWR051bWJlcicsXG4gICdTVkdTdHJpbmdMaXN0JyxcbiAgJ0V2ZW50JyxcbiAgJ0Nsb3NlRXZlbnQnLFxuICAnQ3VzdG9tRXZlbnQnLFxuICAnTWVzc2FnZUV2ZW50JyxcbiAgJ0Vycm9yRXZlbnQnLFxuICAnSGFzaENoYW5nZUV2ZW50JyxcbiAgJ1BvcFN0YXRlRXZlbnQnLFxuICAnU3RvcmFnZUV2ZW50JyxcbiAgJ1Byb2dyZXNzRXZlbnQnLFxuICAnUGFnZVRyYW5zaXRpb25FdmVudCcsXG4gICdVSUV2ZW50JyxcbiAgJ0ZvY3VzRXZlbnQnLFxuICAnSW5wdXRFdmVudCcsXG4gICdNb3VzZUV2ZW50JyxcbiAgJ0tleWJvYXJkRXZlbnQnLFxuICAnVG91Y2hFdmVudCcsXG4gICdDb21wb3NpdGlvbkV2ZW50JyxcbiAgJ1doZWVsRXZlbnQnLFxuICAnQmFyUHJvcCcsXG4gICdFeHRlcm5hbCcsXG4gICdMb2NhdGlvbicsXG4gICdIaXN0b3J5JyxcbiAgJ1NjcmVlbicsXG4gICdQZXJmb3JtYW5jZScsXG4gICdOYXZpZ2F0b3InLFxuICAnUGx1Z2luQXJyYXknLFxuICAnTWltZVR5cGVBcnJheScsXG4gICdQbHVnaW4nLFxuICAnTWltZVR5cGUnLFxuICAnRmlsZVJlYWRlcicsXG4gICdCbG9iJyxcbiAgJ0ZpbGUnLFxuICAnRmlsZUxpc3QnLFxuICAnVmFsaWRpdHlTdGF0ZScsXG4gICdET01QYXJzZXInLFxuICAnWE1MU2VyaWFsaXplcicsXG4gICdGb3JtRGF0YScsXG4gICdYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0JyxcbiAgJ1hNTEh0dHBSZXF1ZXN0VXBsb2FkJyxcbiAgJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgJ1dlYlNvY2tldCcsXG4gICdOb2RlRmlsdGVyJyxcbiAgJ05vZGVJdGVyYXRvcicsXG4gICdUcmVlV2Fsa2VyJyxcbiAgJ0Fic3RyYWN0UmFuZ2UnLFxuICAnUmFuZ2UnLFxuICAnU3RhdGljUmFuZ2UnLFxuICAnU2VsZWN0aW9uJyxcbiAgJ1N0b3JhZ2UnLFxuICAnQ3VzdG9tRWxlbWVudFJlZ2lzdHJ5JyxcbiAgJ1NoYWRvd1Jvb3QnLFxuICAnTXV0YXRpb25PYnNlcnZlcicsXG4gICdNdXRhdGlvblJlY29yZCcsXG4gICdIZWFkZXJzJyxcbiAgJ0Fib3J0Q29udHJvbGxlcicsXG4gICdBYm9ydFNpZ25hbCcsXG5cbiAgLy8gbm90IHNwZWNpZmllZCBpbiBkb2NzLCBidXQgaXMgYXZhaWxhYmxlXG4gICdJbWFnZScsXG5dXG5cbmNvbnN0IE9USEVSX0tFWVMgPSBbXG4gICdhZGRFdmVudExpc3RlbmVyJyxcbiAgJ2FsZXJ0JyxcbiAgJ2F0b2InLFxuICAnYmx1cicsXG4gICdidG9hJyxcbiAgLyogJ2NsZWFySW50ZXJ2YWwnLCAqL1xuICAvKiAnY2xlYXJUaW1lb3V0JywgKi9cbiAgJ2Nsb3NlJyxcbiAgJ2NvbmZpcm0nLFxuICAvKiAnY29uc29sZScsICovXG4gICdjcmVhdGVQb3B1cCcsXG4gICdkaXNwYXRjaEV2ZW50JyxcbiAgJ2RvY3VtZW50JyxcbiAgJ2ZvY3VzJyxcbiAgJ2ZyYW1lcycsXG4gICdnZXRDb21wdXRlZFN0eWxlJyxcbiAgJ2hpc3RvcnknLFxuICAnaW5uZXJIZWlnaHQnLFxuICAnaW5uZXJXaWR0aCcsXG4gICdsZW5ndGgnLFxuICAnbG9jYXRpb24nLFxuICAnbWF0Y2hNZWRpYScsXG4gICdtb3ZlQnknLFxuICAnbW92ZVRvJyxcbiAgJ25hbWUnLFxuICAnbmF2aWdhdG9yJyxcbiAgJ29wZW4nLFxuICAnb3V0ZXJIZWlnaHQnLFxuICAnb3V0ZXJXaWR0aCcsXG4gICdwYWdlWE9mZnNldCcsXG4gICdwYWdlWU9mZnNldCcsXG4gICdwYXJlbnQnLFxuICAncG9zdE1lc3NhZ2UnLFxuICAncHJpbnQnLFxuICAncHJvbXB0JyxcbiAgJ3JlbW92ZUV2ZW50TGlzdGVuZXInLFxuICAncmVzaXplQnknLFxuICAncmVzaXplVG8nLFxuICAnc2NyZWVuJyxcbiAgJ3NjcmVlbkxlZnQnLFxuICAnc2NyZWVuVG9wJyxcbiAgJ3NjcmVlblgnLFxuICAnc2NyZWVuWScsXG4gICdzY3JvbGwnLFxuICAnc2Nyb2xsQnknLFxuICAnc2Nyb2xsTGVmdCcsXG4gICdzY3JvbGxUbycsXG4gICdzY3JvbGxUb3AnLFxuICAnc2Nyb2xsWCcsXG4gICdzY3JvbGxZJyxcbiAgJ3NlbGYnLFxuICAvKiAnc2V0SW50ZXJ2YWwnLCAqL1xuICAvKiAnc2V0VGltZW91dCcsICovXG4gICdzdG9wJyxcbiAgLyogJ3RvU3RyaW5nJywgKi9cbiAgJ3RvcCcsXG4gICd3aW5kb3cnLFxuXVxuXG5leHBvcnQgY29uc3QgS0VZUyA9IExJVklOR19LRVlTLmNvbmNhdChPVEhFUl9LRVlTKVxuIiwiaW1wb3J0IHsgS0VZUyB9IGZyb20gJy4vanNkb20ta2V5cydcblxuY29uc3QgYWxsb3dSZXdyaXRlID0gbmV3IFNldChbXG4gICdFdmVudCcsXG5dKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2luZG93S2V5cyhnbG9iYWw6IGFueSwgd2luOiBhbnkpIHtcbiAgY29uc3Qga2V5cyA9IG5ldyBTZXQoS0VZUy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luKSlcbiAgICAuZmlsdGVyKChrKSA9PiB7XG4gICAgICBpZiAoay5zdGFydHNXaXRoKCdfJykpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKGsgaW4gZ2xvYmFsKVxuICAgICAgICByZXR1cm4gYWxsb3dSZXdyaXRlLmhhcyhrKVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pKVxuXG4gIHJldHVybiBrZXlzXG59XG4iLCJpbXBvcnQgeyBpbXBvcnRNb2R1bGUgfSBmcm9tICdsb2NhbC1wa2cnXG5pbXBvcnQgdHlwZSB7IEVudmlyb25tZW50LCBKU0RPTU9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGdldFdpbmRvd0tleXMgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCA8RW52aXJvbm1lbnQ+KHtcbiAgbmFtZTogJ2pzZG9tJyxcbiAgYXN5bmMgc2V0dXAoZ2xvYmFsLCB7IGpzZG9tID0ge30gfSkge1xuICAgIGNvbnN0IHtcbiAgICAgIENvb2tpZUphcixcbiAgICAgIEpTRE9NLFxuICAgICAgUmVzb3VyY2VMb2FkZXIsXG4gICAgICBWaXJ0dWFsQ29uc29sZSxcbiAgICB9ID0gYXdhaXQgaW1wb3J0TW9kdWxlKCdqc2RvbScpIGFzIHR5cGVvZiBpbXBvcnQoJ2pzZG9tJylcbiAgICBjb25zdCB7XG4gICAgICBodG1sID0gJzwhRE9DVFlQRSBodG1sPicsXG4gICAgICB1c2VyQWdlbnQsXG4gICAgICB1cmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgIGNvbnRlbnRUeXBlID0gJ3RleHQvaHRtbCcsXG4gICAgICBwcmV0ZW5kVG9CZVZpc3VhbCA9IHRydWUsXG4gICAgICBpbmNsdWRlTm9kZUxvY2F0aW9ucyA9IGZhbHNlLFxuICAgICAgcnVuU2NyaXB0cyA9ICdkYW5nZXJvdXNseScsXG4gICAgICByZXNvdXJjZXMsXG4gICAgICBjb25zb2xlID0gZmFsc2UsXG4gICAgICBjb29raWVKYXIgPSBmYWxzZSxcbiAgICAgIC4uLnJlc3RPcHRpb25zXG4gICAgfSA9IGpzZG9tIGFzIEpTRE9NT3B0aW9uc1xuICAgIGNvbnN0IGRvbSA9IG5ldyBKU0RPTShcbiAgICAgIGh0bWwsXG4gICAgICB7XG4gICAgICAgIHByZXRlbmRUb0JlVmlzdWFsLFxuICAgICAgICByZXNvdXJjZXM6IHJlc291cmNlcyA/PyAodXNlckFnZW50ID8gbmV3IFJlc291cmNlTG9hZGVyKHsgdXNlckFnZW50IH0pIDogdW5kZWZpbmVkKSxcbiAgICAgICAgcnVuU2NyaXB0cyxcbiAgICAgICAgdXJsLFxuICAgICAgICB2aXJ0dWFsQ29uc29sZTogY29uc29sZSAmJiBnbG9iYWwuY29uc29sZSA/IG5ldyBWaXJ0dWFsQ29uc29sZSgpLnNlbmRUbyhnbG9iYWwuY29uc29sZSkgOiB1bmRlZmluZWQsXG4gICAgICAgIGNvb2tpZUphcjogY29va2llSmFyID8gbmV3IENvb2tpZUphcigpIDogdW5kZWZpbmVkLFxuICAgICAgICBpbmNsdWRlTm9kZUxvY2F0aW9ucyxcbiAgICAgICAgY29udGVudFR5cGUsXG4gICAgICAgIHVzZXJBZ2VudCxcbiAgICAgICAgLi4ucmVzdE9wdGlvbnMsXG4gICAgICB9LFxuICAgIClcblxuICAgIGNvbnN0IGtleXMgPSBnZXRXaW5kb3dLZXlzKGdsb2JhbCwgZG9tLndpbmRvdylcblxuICAgIGNvbnN0IG92ZXJyaWRlT2JqZWN0ID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKVxuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGtleSwge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgaWYgKG92ZXJyaWRlT2JqZWN0LmhhcyhrZXkpKVxuICAgICAgICAgICAgcmV0dXJuIG92ZXJyaWRlT2JqZWN0LmdldChrZXkpXG4gICAgICAgICAgcmV0dXJuIGRvbS53aW5kb3dba2V5XVxuICAgICAgICB9LFxuICAgICAgICBzZXQodikge1xuICAgICAgICAgIG92ZXJyaWRlT2JqZWN0LnNldChrZXksIHYpXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRlYXJkb3duKGdsb2JhbCkge1xuICAgICAgICBrZXlzLmZvckVhY2goa2V5ID0+IGRlbGV0ZSBnbG9iYWxba2V5XSlcbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSlcbiIsImltcG9ydCB7IGltcG9ydE1vZHVsZSB9IGZyb20gJ2xvY2FsLXBrZydcbmltcG9ydCB0eXBlIHsgRW52aXJvbm1lbnQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGdldFdpbmRvd0tleXMgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgZGVmYXVsdCA8RW52aXJvbm1lbnQ+KHtcbiAgbmFtZTogJ2hhcHB5LWRvbScsXG4gIGFzeW5jIHNldHVwKGdsb2JhbCkge1xuICAgIGNvbnN0IHsgV2luZG93IH0gPSBhd2FpdCBpbXBvcnRNb2R1bGUoJ2hhcHB5LWRvbScpIGFzIHR5cGVvZiBpbXBvcnQoJ2hhcHB5LWRvbScpXG4gICAgY29uc3Qgd2luOiBhbnkgPSBuZXcgV2luZG93KClcblxuICAgIGNvbnN0IGtleXMgPSBnZXRXaW5kb3dLZXlzKGdsb2JhbCwgd2luKVxuXG4gICAgY29uc3Qgb3ZlcnJpZGVPYmplY3QgPSBuZXcgTWFwPHN0cmluZywgYW55PigpXG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwga2V5LCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBpZiAob3ZlcnJpZGVPYmplY3QuaGFzKGtleSkpXG4gICAgICAgICAgICByZXR1cm4gb3ZlcnJpZGVPYmplY3QuZ2V0KGtleSlcbiAgICAgICAgICByZXR1cm4gd2luW2tleV1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHYpIHtcbiAgICAgICAgICBvdmVycmlkZU9iamVjdC5zZXQoa2V5LCB2KVxuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0ZWFyZG93bihnbG9iYWwpIHtcbiAgICAgICAgd2luLmhhcHB5RE9NLmNhbmNlbEFzeW5jKClcbiAgICAgICAga2V5cy5mb3JFYWNoKGtleSA9PiBkZWxldGUgZ2xvYmFsW2tleV0pXG4gICAgICB9LFxuICAgIH1cbiAgfSxcbn0pXG4iLCJpbXBvcnQgbm9kZSBmcm9tICcuL25vZGUnXG5pbXBvcnQganNkb20gZnJvbSAnLi9qc2RvbSdcbmltcG9ydCBoYXBweSBmcm9tICcuL2hhcHB5LWRvbSdcblxuZXhwb3J0IGNvbnN0IGVudmlyb25tZW50cyA9IHtcbiAgbm9kZSxcbiAganNkb20sXG4gICdoYXBweS1kb20nOiBoYXBweSxcbn1cbiIsIihmdW5jdGlvbigpIHtcblx0KGZ1bmN0aW9uKGNoYWlTdWJzZXQpIHtcblx0XHRpZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHMgPSBjaGFpU3Vic2V0O1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0XHRyZXR1cm4gZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gY2hhaVN1YnNldDtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gY2hhaS51c2UoY2hhaVN1YnNldCk7XG5cdFx0fVxuXHR9KShmdW5jdGlvbihjaGFpLCB1dGlscykge1xuXHRcdHZhciBBc3NlcnRpb24gPSBjaGFpLkFzc2VydGlvbjtcblx0XHR2YXIgYXNzZXJ0aW9uUHJvdG90eXBlID0gQXNzZXJ0aW9uLnByb3RvdHlwZTtcblxuXHRcdEFzc2VydGlvbi5hZGRNZXRob2QoJ2NvbnRhaW5TdWJzZXQnLCBmdW5jdGlvbiAoZXhwZWN0ZWQpIHtcblx0XHRcdHZhciBhY3R1YWwgPSB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnKTtcblx0XHRcdHZhciBzaG93RGlmZiA9IGNoYWkuY29uZmlnLnNob3dEaWZmO1xuXG5cdFx0XHRhc3NlcnRpb25Qcm90b3R5cGUuYXNzZXJ0LmNhbGwodGhpcyxcblx0XHRcdFx0Y29tcGFyZShleHBlY3RlZCwgYWN0dWFsKSxcblx0XHRcdFx0J2V4cGVjdGVkICN7YWN0fSB0byBjb250YWluIHN1YnNldCAje2V4cH0nLFxuXHRcdFx0XHQnZXhwZWN0ZWQgI3thY3R9IHRvIG5vdCBjb250YWluIHN1YnNldCAje2V4cH0nLFxuXHRcdFx0XHRleHBlY3RlZCxcblx0XHRcdFx0YWN0dWFsLFxuXHRcdFx0XHRzaG93RGlmZlxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdGNoYWkuYXNzZXJ0LmNvbnRhaW5TdWJzZXQgPSBmdW5jdGlvbih2YWwsIGV4cCwgbXNnKSB7XG5cdFx0XHRuZXcgY2hhaS5Bc3NlcnRpb24odmFsLCBtc2cpLnRvLmJlLmNvbnRhaW5TdWJzZXQoZXhwKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gY29tcGFyZShleHBlY3RlZCwgYWN0dWFsKSB7XG5cdFx0XHRpZiAoZXhwZWN0ZWQgPT09IGFjdHVhbCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2YoYWN0dWFsKSAhPT0gdHlwZW9mKGV4cGVjdGVkKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mKGV4cGVjdGVkKSAhPT0gJ29iamVjdCcgfHwgZXhwZWN0ZWQgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIGV4cGVjdGVkID09PSBhY3R1YWw7XG5cdFx0XHR9XG5cdFx0XHRpZiAoISFleHBlY3RlZCAmJiAhYWN0dWFsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZXhwZWN0ZWQpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YoYWN0dWFsLmxlbmd0aCkgIT09ICdudW1iZXInKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBhYSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFjdHVhbCk7XG5cdFx0XHRcdHJldHVybiBleHBlY3RlZC5ldmVyeShmdW5jdGlvbiAoZXhwKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGFhLnNvbWUoZnVuY3Rpb24gKGFjdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbXBhcmUoZXhwLCBhY3QpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGV4cGVjdGVkIGluc3RhbmNlb2YgRGF0ZSkge1xuXHRcdFx0XHRpZiAoYWN0dWFsIGluc3RhbmNlb2YgRGF0ZSkge1xuXHRcdFx0XHRcdHJldHVybiBleHBlY3RlZC5nZXRUaW1lKCkgPT09IGFjdHVhbC5nZXRUaW1lKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhleHBlY3RlZCkuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHR2YXIgZW8gPSBleHBlY3RlZFtrZXldO1xuXHRcdFx0XHR2YXIgYW8gPSBhY3R1YWxba2V5XTtcblx0XHRcdFx0aWYgKHR5cGVvZihlbykgPT09ICdvYmplY3QnICYmIGVvICE9PSBudWxsICYmIGFvICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbXBhcmUoZW8sIGFvKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mKGVvKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHJldHVybiBlbyhhbyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGFvID09PSBlbztcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG5cbn0pLmNhbGwodGhpcyk7XG5cbiIsIlxuXG5cbi8qXG4gKiBAdmVyc2lvbiAgICAxLjQuMFxuICogQGRhdGUgICAgICAgMjAxNS0xMC0yNlxuICogQHN0YWJpbGl0eSAgMyAtIFN0YWJsZVxuICogQGF1dGhvciAgICAgTGF1cmkgUm9vZGVuIChodHRwczovL2dpdGh1Yi5jb20vbGl0ZWpzL25hdHVyYWwtY29tcGFyZS1saXRlKVxuICogQGxpY2Vuc2UgICAgTUlUIExpY2Vuc2VcbiAqL1xuXG5cbnZhciBuYXR1cmFsQ29tcGFyZSA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0dmFyIGksIGNvZGVBXG5cdCwgY29kZUIgPSAxXG5cdCwgcG9zQSA9IDBcblx0LCBwb3NCID0gMFxuXHQsIGFscGhhYmV0ID0gU3RyaW5nLmFscGhhYmV0XG5cblx0ZnVuY3Rpb24gZ2V0Q29kZShzdHIsIHBvcywgY29kZSkge1xuXHRcdGlmIChjb2RlKSB7XG5cdFx0XHRmb3IgKGkgPSBwb3M7IGNvZGUgPSBnZXRDb2RlKHN0ciwgaSksIGNvZGUgPCA3NiAmJiBjb2RlID4gNjU7KSArK2k7XG5cdFx0XHRyZXR1cm4gK3N0ci5zbGljZShwb3MgLSAxLCBpKVxuXHRcdH1cblx0XHRjb2RlID0gYWxwaGFiZXQgJiYgYWxwaGFiZXQuaW5kZXhPZihzdHIuY2hhckF0KHBvcykpXG5cdFx0cmV0dXJuIGNvZGUgPiAtMSA/IGNvZGUgKyA3NiA6ICgoY29kZSA9IHN0ci5jaGFyQ29kZUF0KHBvcykgfHwgMCksIGNvZGUgPCA0NSB8fCBjb2RlID4gMTI3KSA/IGNvZGVcblx0XHRcdDogY29kZSA8IDQ2ID8gNjUgICAgICAgICAgICAgICAvLyAtXG5cdFx0XHQ6IGNvZGUgPCA0OCA/IGNvZGUgLSAxXG5cdFx0XHQ6IGNvZGUgPCA1OCA/IGNvZGUgKyAxOCAgICAgICAgLy8gMC05XG5cdFx0XHQ6IGNvZGUgPCA2NSA/IGNvZGUgLSAxMVxuXHRcdFx0OiBjb2RlIDwgOTEgPyBjb2RlICsgMTEgICAgICAgIC8vIEEtWlxuXHRcdFx0OiBjb2RlIDwgOTcgPyBjb2RlIC0gMzdcblx0XHRcdDogY29kZSA8IDEyMyA/IGNvZGUgKyA1ICAgICAgICAvLyBhLXpcblx0XHRcdDogY29kZSAtIDYzXG5cdH1cblxuXG5cdGlmICgoYSs9XCJcIikgIT0gKGIrPVwiXCIpKSBmb3IgKDtjb2RlQjspIHtcblx0XHRjb2RlQSA9IGdldENvZGUoYSwgcG9zQSsrKVxuXHRcdGNvZGVCID0gZ2V0Q29kZShiLCBwb3NCKyspXG5cblx0XHRpZiAoY29kZUEgPCA3NiAmJiBjb2RlQiA8IDc2ICYmIGNvZGVBID4gNjYgJiYgY29kZUIgPiA2Nikge1xuXHRcdFx0Y29kZUEgPSBnZXRDb2RlKGEsIHBvc0EsIHBvc0EpXG5cdFx0XHRjb2RlQiA9IGdldENvZGUoYiwgcG9zQiwgcG9zQSA9IGkpXG5cdFx0XHRwb3NCID0gaVxuXHRcdH1cblxuXHRcdGlmIChjb2RlQSAhPSBjb2RlQikgcmV0dXJuIChjb2RlQSA8IGNvZGVCKSA/IC0xIDogMVxuXHR9XG5cdHJldHVybiAwXG59XG5cbnRyeSB7XG5cdG1vZHVsZS5leHBvcnRzID0gbmF0dXJhbENvbXBhcmU7XG59IGNhdGNoIChlKSB7XG5cdFN0cmluZy5uYXR1cmFsQ29tcGFyZSA9IG5hdHVyYWxDb21wYXJlO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgZnMsIHsgcHJvbWlzZXMgYXMgZnNwIH0gZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoZSdcbmltcG9ydCBuYXR1cmFsQ29tcGFyZSBmcm9tICduYXR1cmFsLWNvbXBhcmUnXG5pbXBvcnQgdHlwZSB7IE9wdGlvbnNSZWNlaXZlZCBhcyBQcmV0dHlGb3JtYXRPcHRpb25zIH0gZnJvbSAncHJldHR5LWZvcm1hdCdcbmltcG9ydCB7XG4gIGZvcm1hdCBhcyBwcmV0dHlGb3JtYXQsXG59IGZyb20gJ3ByZXR0eS1mb3JtYXQnXG5pbXBvcnQgdHlwZSB7IFNuYXBzaG90RGF0YSwgU25hcHNob3RVcGRhdGVTdGF0ZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuLi8uLi8uLi91dGlscydcbmltcG9ydCB7IGdldFNlcmlhbGl6ZXJzIH0gZnJvbSAnLi9wbHVnaW5zJ1xuXG4vLyBUT0RPOiByZXdyaXRlIGFuZCBjbGVhbiB1cFxuXG5leHBvcnQgY29uc3QgU05BUFNIT1RfVkVSU0lPTiA9ICcxJ1xuXG5jb25zdCB3cml0ZVNuYXBzaG90VmVyc2lvbiA9ICgpID0+IGAvLyBWaXRlc3QgU25hcHNob3QgdiR7U05BUFNIT1RfVkVSU0lPTn1gXG5cbmV4cG9ydCBjb25zdCB0ZXN0TmFtZVRvS2V5ID0gKHRlc3ROYW1lOiBzdHJpbmcsIGNvdW50OiBudW1iZXIpOiBzdHJpbmcgPT5cbiAgYCR7dGVzdE5hbWV9ICR7Y291bnR9YFxuXG5leHBvcnQgY29uc3Qga2V5VG9UZXN0TmFtZSA9IChrZXk6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIGlmICghLyBcXGQrJC8udGVzdChrZXkpKVxuICAgIHRocm93IG5ldyBFcnJvcignU25hcHNob3Qga2V5cyBtdXN0IGVuZCB3aXRoIGEgbnVtYmVyLicpXG5cbiAgcmV0dXJuIGtleS5yZXBsYWNlKC8gXFxkKyQvLCAnJylcbn1cblxuZXhwb3J0IGNvbnN0IGdldFNuYXBzaG90RGF0YSA9IChcbiAgc25hcHNob3RQYXRoOiBzdHJpbmcsXG4gIHVwZGF0ZTogU25hcHNob3RVcGRhdGVTdGF0ZSxcbik6IHtcbiAgZGF0YTogU25hcHNob3REYXRhXG4gIGRpcnR5OiBib29sZWFuXG59ID0+IHtcbiAgY29uc3QgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgbGV0IHNuYXBzaG90Q29udGVudHMgPSAnJ1xuICBsZXQgZGlydHkgPSBmYWxzZVxuXG4gIGlmIChmcy5leGlzdHNTeW5jKHNuYXBzaG90UGF0aCkpIHtcbiAgICB0cnkge1xuICAgICAgc25hcHNob3RDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhzbmFwc2hvdFBhdGgsICd1dGY4JylcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgY29uc3QgcG9wdWxhdGUgPSBuZXcgRnVuY3Rpb24oJ2V4cG9ydHMnLCBzbmFwc2hvdENvbnRlbnRzKVxuICAgICAgcG9wdWxhdGUoZGF0YSlcbiAgICB9XG4gICAgY2F0Y2gge31cbiAgfVxuXG4gIC8vIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSB2YWxpZGF0ZVNuYXBzaG90VmVyc2lvbihzbmFwc2hvdENvbnRlbnRzKVxuICBjb25zdCBpc0ludmFsaWQgPSBzbmFwc2hvdENvbnRlbnRzIC8vICYmIHZhbGlkYXRpb25SZXN1bHRcblxuICAvLyBpZiAodXBkYXRlID09PSAnbm9uZScgJiYgaXNJbnZhbGlkKVxuICAvLyAgIHRocm93IHZhbGlkYXRpb25SZXN1bHRcblxuICBpZiAoKHVwZGF0ZSA9PT0gJ2FsbCcgfHwgdXBkYXRlID09PSAnbmV3JykgJiYgaXNJbnZhbGlkKVxuICAgIGRpcnR5ID0gdHJ1ZVxuXG4gIHJldHVybiB7IGRhdGEsIGRpcnR5IH1cbn1cblxuLy8gQWRkIGV4dHJhIGxpbmUgYnJlYWtzIGF0IGJlZ2lubmluZyBhbmQgZW5kIG9mIG11bHRpbGluZSBzbmFwc2hvdFxuLy8gdG8gbWFrZSB0aGUgY29udGVudCBlYXNpZXIgdG8gcmVhZC5cbmV4cG9ydCBjb25zdCBhZGRFeHRyYUxpbmVCcmVha3MgPSAoc3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgc3RyaW5nLmluY2x1ZGVzKCdcXG4nKSA/IGBcXG4ke3N0cmluZ31cXG5gIDogc3RyaW5nXG5cbi8vIFJlbW92ZSBleHRyYSBsaW5lIGJyZWFrcyBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiBtdWx0aWxpbmUgc25hcHNob3QuXG4vLyBJbnN0ZWFkIG9mIHRyaW0sIHdoaWNoIGNhbiByZW1vdmUgYWRkaXRpb25hbCBuZXdsaW5lcyBvciBzcGFjZXNcbi8vIGF0IGJlZ2lubmluZyBvciBlbmQgb2YgdGhlIGNvbnRlbnQgZnJvbSBhIGN1c3RvbSBzZXJpYWxpemVyLlxuZXhwb3J0IGNvbnN0IHJlbW92ZUV4dHJhTGluZUJyZWFrcyA9IChzdHJpbmc6IHN0cmluZyk6IHN0cmluZyA9PlxuICBzdHJpbmcubGVuZ3RoID4gMiAmJiBzdHJpbmcuc3RhcnRzV2l0aCgnXFxuJykgJiYgc3RyaW5nLmVuZHNXaXRoKCdcXG4nKVxuICAgID8gc3RyaW5nLnNsaWNlKDEsIC0xKVxuICAgIDogc3RyaW5nXG5cbi8vIGV4cG9ydCBjb25zdCByZW1vdmVMaW5lc0JlZm9yZUV4dGVybmFsTWF0Y2hlclRyYXAgPSAoc3RhY2s6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4vLyAgIGNvbnN0IGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpXG5cbi8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuLy8gICAgIC8vIEl0J3MgYSBmdW5jdGlvbiBuYW1lIHNwZWNpZmllZCBpbiBgcGFja2FnZXMvZXhwZWN0L3NyYy9pbmRleC50c2Bcbi8vICAgICAvLyBmb3IgZXh0ZXJuYWwgY3VzdG9tIG1hdGNoZXJzLlxuLy8gICAgIGlmIChsaW5lc1tpXS5pbmNsdWRlcygnX19FWFRFUk5BTF9NQVRDSEVSX1RSQVBfXycpKVxuLy8gICAgICAgcmV0dXJuIGxpbmVzLnNsaWNlKGkgKyAxKS5qb2luKCdcXG4nKVxuLy8gICB9XG5cbi8vICAgcmV0dXJuIHN0YWNrXG4vLyB9XG5cbmNvbnN0IGVzY2FwZVJlZ2V4ID0gdHJ1ZVxuY29uc3QgcHJpbnRGdW5jdGlvbk5hbWUgPSBmYWxzZVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKHZhbDogdW5rbm93bixcbiAgaW5kZW50ID0gMixcbiAgZm9ybWF0T3ZlcnJpZGVzOiBQcmV0dHlGb3JtYXRPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICByZXR1cm4gbm9ybWFsaXplTmV3bGluZXMoXG4gICAgcHJldHR5Rm9ybWF0KHZhbCwge1xuICAgICAgZXNjYXBlUmVnZXgsXG4gICAgICBpbmRlbnQsXG4gICAgICBwbHVnaW5zOiBnZXRTZXJpYWxpemVycygpLFxuICAgICAgcHJpbnRGdW5jdGlvbk5hbWUsXG4gICAgICAuLi5mb3JtYXRPdmVycmlkZXMsXG4gICAgfSksXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pbmlmeSh2YWw6IHVua25vd24pOiBzdHJpbmcge1xuICByZXR1cm4gcHJldHR5Rm9ybWF0KHZhbCwge1xuICAgIGVzY2FwZVJlZ2V4LFxuICAgIG1pbjogdHJ1ZSxcbiAgICBwbHVnaW5zOiBnZXRTZXJpYWxpemVycygpLFxuICAgIHByaW50RnVuY3Rpb25OYW1lLFxuICB9KVxufVxuXG4vLyBSZW1vdmUgZG91YmxlIHF1b3RlIG1hcmtzIGFuZCB1bmVzY2FwZSBkb3VibGUgcXVvdGVzIGFuZCBiYWNrc2xhc2hlcy5cbmV4cG9ydCBmdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cmluZyhzdHJpbmdpZmllZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0cmluZ2lmaWVkLnNsaWNlKDEsIC0xKS5yZXBsYWNlKC9cXFxcKFwifFxcXFwpL2csICckMScpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVCYWNrdGlja1N0cmluZyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvYHxcXFxcfFxcJHsvZywgJ1xcXFwkJicpXG59XG5cbmZ1bmN0aW9uIHByaW50QmFja3RpY2tTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYFxcYCR7ZXNjYXBlQmFja3RpY2tTdHJpbmcoc3RyKX1cXGBgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVEaXJlY3RvcnlFeGlzdHMoZmlsZVBhdGg6IHN0cmluZyk6IHZvaWQge1xuICB0cnkge1xuICAgIGZzLm1rZGlyU3luYyhwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gIH1cbiAgY2F0Y2ggeyB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5ld2xpbmVzKHN0cmluZzogc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFxyXFxufFxcci9nLCAnXFxuJylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVTbmFwc2hvdEZpbGUoXG4gIHNuYXBzaG90RGF0YTogU25hcHNob3REYXRhLFxuICBzbmFwc2hvdFBhdGg6IHN0cmluZyxcbikge1xuICBjb25zdCBzbmFwc2hvdHMgPSBPYmplY3Qua2V5cyhzbmFwc2hvdERhdGEpXG4gICAgLnNvcnQobmF0dXJhbENvbXBhcmUpXG4gICAgLm1hcChcbiAgICAgIGtleSA9PiBgZXhwb3J0c1ske3ByaW50QmFja3RpY2tTdHJpbmcoa2V5KX1dID0gJHtwcmludEJhY2t0aWNrU3RyaW5nKG5vcm1hbGl6ZU5ld2xpbmVzKHNuYXBzaG90RGF0YVtrZXldKSl9O2AsXG4gICAgKVxuXG4gIGVuc3VyZURpcmVjdG9yeUV4aXN0cyhzbmFwc2hvdFBhdGgpXG4gIGF3YWl0IGZzcC53cml0ZUZpbGUoXG4gICAgc25hcHNob3RQYXRoLFxuICAgIGAke3dyaXRlU25hcHNob3RWZXJzaW9uKCl9XFxuXFxuJHtzbmFwc2hvdHMuam9pbignXFxuXFxuJyl9XFxuYCxcbiAgICAndXRmLTgnLFxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlRXhwZWN0ZWQoZXhwZWN0ZWQ/OiBzdHJpbmcpIHtcbiAgZnVuY3Rpb24gZmluZFN0YXJ0SW5kZW50KCkge1xuICAgIGNvbnN0IG1hdGNoID0gL14oICspfVxccyskL20uZXhlYyhleHBlY3RlZCB8fCAnJylcbiAgICByZXR1cm4gbWF0Y2g/LlsxXT8ubGVuZ3RoIHx8IDBcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0SWRlbnQgPSBmaW5kU3RhcnRJbmRlbnQoKVxuXG4gIGxldCBleHBlY3RlZFRyaW1tZWQgPSBleHBlY3RlZD8udHJpbSgpXG5cbiAgaWYgKHN0YXJ0SWRlbnQpIHtcbiAgICBleHBlY3RlZFRyaW1tZWQgPSBleHBlY3RlZFRyaW1tZWRcbiAgICAgID8ucmVwbGFjZShuZXcgUmVnRXhwKGBeJHsnICcucmVwZWF0KHN0YXJ0SWRlbnQpfWAsICdnbScpLCAnJykucmVwbGFjZSgvICt9JC8sICd9JylcbiAgfVxuXG4gIHJldHVybiBleHBlY3RlZFRyaW1tZWRcbn1cblxuZnVuY3Rpb24gZGVlcE1lcmdlQXJyYXkodGFyZ2V0OiBhbnlbXSA9IFtdLCBzb3VyY2U6IGFueVtdID0gW10pIHtcbiAgY29uc3QgbWVyZ2VkT3V0cHV0ID0gQXJyYXkuZnJvbSh0YXJnZXQpXG5cbiAgc291cmNlLmZvckVhY2goKHNvdXJjZUVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IG1lcmdlZE91dHB1dFtpbmRleF1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFtpbmRleF0pKSB7XG4gICAgICBtZXJnZWRPdXRwdXRbaW5kZXhdID0gZGVlcE1lcmdlQXJyYXkodGFyZ2V0W2luZGV4XSwgc291cmNlRWxlbWVudClcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNPYmplY3QodGFyZ2V0RWxlbWVudCkpIHtcbiAgICAgIG1lcmdlZE91dHB1dFtpbmRleF0gPSBkZWVwTWVyZ2VTbmFwc2hvdCh0YXJnZXRbaW5kZXhdLCBzb3VyY2VFbGVtZW50KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFNvdXJjZSBkb2VzIG5vdCBleGlzdCBpbiB0YXJnZXQgb3IgdGFyZ2V0IGlzIHByaW1pdGl2ZSBhbmQgY2Fubm90IGJlIGRlZXAgbWVyZ2VkXG4gICAgICBtZXJnZWRPdXRwdXRbaW5kZXhdID0gc291cmNlRWxlbWVudFxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gbWVyZ2VkT3V0cHV0XG59XG5cbi8qKlxuICogRGVlcCBtZXJnZSwgYnV0IGNvbnNpZGVycyBhc3ltbWV0cmljIG1hdGNoZXJzLiBVbmxpa2UgYmFzZSB1dGlsJ3MgZGVlcCBtZXJnZSxcbiAqIHdpbGwgbWVyZ2UgYW55IG9iamVjdC1saWtlIGluc3RhbmNlLlxuICogQ29tcGF0aWJsZSB3aXRoIEplc3QncyBzbmFwc2hvdCBtYXRjaGVyLiBTaG91bGQgbm90IGJlIHVzZWQgb3V0c2lkZSBvZiBzbmFwc2hvdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgdHNcbiAqIHRvTWF0Y2hTbmFwc2hvdCh7XG4gKiAgIG5hbWU6IGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCd0ZXh0JylcbiAqIH0pXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBNZXJnZVNuYXBzaG90KHRhcmdldDogYW55LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gIGlmIChpc09iamVjdCh0YXJnZXQpICYmIGlzT2JqZWN0KHNvdXJjZSkpIHtcbiAgICBjb25zdCBtZXJnZWRPdXRwdXQgPSB7IC4uLnRhcmdldCB9XG4gICAgT2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChpc09iamVjdChzb3VyY2Vba2V5XSkgJiYgIXNvdXJjZVtrZXldLiQkdHlwZW9mKSB7XG4gICAgICAgIGlmICghKGtleSBpbiB0YXJnZXQpKSBPYmplY3QuYXNzaWduKG1lcmdlZE91dHB1dCwgeyBba2V5XTogc291cmNlW2tleV0gfSlcbiAgICAgICAgZWxzZSBtZXJnZWRPdXRwdXRba2V5XSA9IGRlZXBNZXJnZVNuYXBzaG90KHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlW2tleV0pKSB7XG4gICAgICAgIG1lcmdlZE91dHB1dFtrZXldID0gZGVlcE1lcmdlQXJyYXkodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24obWVyZ2VkT3V0cHV0LCB7IFtrZXldOiBzb3VyY2Vba2V5XSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbWVyZ2VkT3V0cHV0XG4gIH1cbiAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXQpICYmIEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgIHJldHVybiBkZWVwTWVyZ2VBcnJheSh0YXJnZXQsIHNvdXJjZSlcbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4iLCJpbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHR5cGUgTWFnaWNTdHJpbmcgZnJvbSAnbWFnaWMtc3RyaW5nJ1xuaW1wb3J0IHsgcnBjIH0gZnJvbSAnLi4vLi4vLi4vcnVudGltZS9ycGMnXG5pbXBvcnQgeyBnZXRPcmlnaW5hbFBvcywgbGluZVNwbGl0UkUsIG51bWJlclRvUG9zLCBwb3NUb051bWJlciB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3NvdXJjZS1tYXAnXG5pbXBvcnQgeyBnZXRDYWxsTGFzdEluZGV4IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5saW5lU25hcHNob3Qge1xuICBzbmFwc2hvdDogc3RyaW5nXG4gIGZpbGU6IHN0cmluZ1xuICBsaW5lOiBudW1iZXJcbiAgY29sdW1uOiBudW1iZXJcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVJbmxpbmVTbmFwc2hvdHMoXG4gIHNuYXBzaG90czogQXJyYXk8SW5saW5lU25hcHNob3Q+LFxuKSB7XG4gIGNvbnN0IE1hZ2ljU3RyaW5nID0gKGF3YWl0IGltcG9ydCgnbWFnaWMtc3RyaW5nJykpLmRlZmF1bHRcbiAgY29uc3QgZmlsZXMgPSBuZXcgU2V0KHNuYXBzaG90cy5tYXAoaSA9PiBpLmZpbGUpKVxuICBhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKGZpbGVzKS5tYXAoYXN5bmMoZmlsZSkgPT4ge1xuICAgIGNvbnN0IG1hcCA9IGF3YWl0IHJwYygpLmdldFNvdXJjZU1hcChmaWxlKVxuICAgIGNvbnN0IHNuYXBzID0gc25hcHNob3RzLmZpbHRlcihpID0+IGkuZmlsZSA9PT0gZmlsZSlcbiAgICBjb25zdCBjb2RlID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgJ3V0ZjgnKVxuICAgIGNvbnN0IHMgPSBuZXcgTWFnaWNTdHJpbmcoY29kZSlcblxuICAgIGZvciAoY29uc3Qgc25hcCBvZiBzbmFwcykge1xuICAgICAgY29uc3QgcG9zID0gYXdhaXQgZ2V0T3JpZ2luYWxQb3MobWFwLCBzbmFwKVxuICAgICAgY29uc3QgaW5kZXggPSBwb3NUb051bWJlcihjb2RlLCBwb3MhKVxuICAgICAgcmVwbGFjZUlubGluZVNuYXAoY29kZSwgcywgaW5kZXgsIHNuYXAuc25hcHNob3QpXG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNmb3JtZWQgPSBzLnRvU3RyaW5nKClcbiAgICBpZiAodHJhbnNmb3JtZWQgIT09IGNvZGUpXG4gICAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZSwgdHJhbnNmb3JtZWQsICd1dGYtOCcpXG4gIH0pKVxufVxuXG5jb25zdCBzdGFydE9iamVjdFJlZ2V4ID0gLyg/OnRvTWF0Y2hJbmxpbmVTbmFwc2hvdHx0b1Rocm93RXJyb3JNYXRjaGluZ0lubGluZVNuYXBzaG90KVxccypcXChcXHMqKHspL21cblxuZnVuY3Rpb24gcmVwbGFjZU9iamVjdFNuYXAoY29kZTogc3RyaW5nLCBzOiBNYWdpY1N0cmluZywgaW5kZXg6IG51bWJlciwgbmV3U25hcDogc3RyaW5nKSB7XG4gIGNvZGUgPSBjb2RlLnNsaWNlKGluZGV4KVxuICBjb25zdCBzdGFydE1hdGNoID0gc3RhcnRPYmplY3RSZWdleC5leGVjKGNvZGUpXG4gIGlmICghc3RhcnRNYXRjaClcbiAgICByZXR1cm4gZmFsc2VcblxuICBjb2RlID0gY29kZS5zbGljZShzdGFydE1hdGNoLmluZGV4KVxuICBjb25zdCBjaGFySW5kZXggPSBnZXRDYWxsTGFzdEluZGV4KGNvZGUpXG4gIGlmIChjaGFySW5kZXggPT09IG51bGwpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgcy5hcHBlbmRMZWZ0KGluZGV4ICsgc3RhcnRNYXRjaC5pbmRleCArIGNoYXJJbmRleCwgYCwgJHtwcmVwYXJlU25hcFN0cmluZyhuZXdTbmFwLCBjb2RlLCBpbmRleCl9YClcblxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBwcmVwYXJlU25hcFN0cmluZyhzbmFwOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSB7XG4gIGNvbnN0IGxpbmVJbmRleCA9IG51bWJlclRvUG9zKHNvdXJjZSwgaW5kZXgpLmxpbmVcbiAgY29uc3QgbGluZSA9IHNvdXJjZS5zcGxpdChsaW5lU3BsaXRSRSlbbGluZUluZGV4IC0gMV1cbiAgY29uc3QgaW5kZW50ID0gbGluZS5tYXRjaCgvXlxccyovKSFbMF0gfHwgJydcbiAgY29uc3QgaW5kZW50TmV4dCA9IGluZGVudC5pbmNsdWRlcygnXFx0JykgPyBgJHtpbmRlbnR9XFx0YCA6IGAke2luZGVudH0gIGBcblxuICBjb25zdCBsaW5lcyA9IHNuYXBcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJylcbiAgICAucmVwbGFjZSgvXFwkL2csICdcXFxcJCcpXG4gICAgLnNwbGl0KC9cXG4vZylcbiAgICAubWFwKGkgPT4gaS50cmltRW5kKCkpXG5cbiAgY29uc3QgaXNPbmVsaW5lID0gbGluZXMubGVuZ3RoIDw9IDFcbiAgY29uc3QgcXVvdGUgPSBpc09uZWxpbmUgPyAnXFwnJyA6ICdgJ1xuICByZXR1cm4gaXNPbmVsaW5lXG4gICAgPyBgJyR7bGluZXMuam9pbignXFxuJykucmVwbGFjZSgvJy9nLCAnXFxcXFxcJycpfSdgXG4gICAgOiBgJHtxdW90ZX1cXG4ke2xpbmVzLm1hcChpID0+IGluZGVudE5leHQgKyBpKS5qb2luKCdcXG4nKS5yZXBsYWNlKC9gL2csICdcXFxcYCcpfVxcbiR7aW5kZW50fSR7cXVvdGV9YFxufVxuXG5jb25zdCBzdGFydFJlZ2V4ID0gLyg/OnRvTWF0Y2hJbmxpbmVTbmFwc2hvdHx0b1Rocm93RXJyb3JNYXRjaGluZ0lubGluZVNuYXBzaG90KVxccypcXChcXHMqW1xcd18kXSooWydcImBcXCldKS9tXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZUlubGluZVNuYXAoY29kZTogc3RyaW5nLCBzOiBNYWdpY1N0cmluZywgaW5kZXg6IG51bWJlciwgbmV3U25hcDogc3RyaW5nKSB7XG4gIGNvbnN0IHN0YXJ0TWF0Y2ggPSBzdGFydFJlZ2V4LmV4ZWMoY29kZS5zbGljZShpbmRleCkpXG4gIGlmICghc3RhcnRNYXRjaClcbiAgICByZXR1cm4gcmVwbGFjZU9iamVjdFNuYXAoY29kZSwgcywgaW5kZXgsIG5ld1NuYXApXG5cbiAgY29uc3QgcXVvdGUgPSBzdGFydE1hdGNoWzFdXG4gIGNvbnN0IHN0YXJ0SW5kZXggPSBpbmRleCArIHN0YXJ0TWF0Y2guaW5kZXghICsgc3RhcnRNYXRjaFswXS5sZW5ndGhcbiAgY29uc3Qgc25hcFN0cmluZyA9IHByZXBhcmVTbmFwU3RyaW5nKG5ld1NuYXAsIGNvZGUsIGluZGV4KVxuXG4gIGlmIChxdW90ZSA9PT0gJyknKSB7XG4gICAgcy5hcHBlbmRSaWdodChzdGFydEluZGV4IC0gMSwgc25hcFN0cmluZylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgY29uc3QgcXVvdGVFbmRSRSA9IG5ldyBSZWdFeHAoYCg/Ol58W15cXFxcXFxcXF0pJHtxdW90ZX1gKVxuICBjb25zdCBlbmRNYXRjaCA9IHF1b3RlRW5kUkUuZXhlYyhjb2RlLnNsaWNlKHN0YXJ0SW5kZXgpKVxuICBpZiAoIWVuZE1hdGNoKVxuICAgIHJldHVybiBmYWxzZVxuICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyBlbmRNYXRjaC5pbmRleCEgKyBlbmRNYXRjaFswXS5sZW5ndGhcbiAgcy5vdmVyd3JpdGUoc3RhcnRJbmRleCAtIDEsIGVuZEluZGV4LCBzbmFwU3RyaW5nKVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmNvbnN0IElOREVOVEFUSU9OX1JFR0VYID0gL14oW15cXFNcXG5dKilcXFMvbVxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwU25hcHNob3RJbmRlbnRhdGlvbihpbmxpbmVTbmFwc2hvdDogc3RyaW5nKSB7XG4gIC8vIEZpbmQgaW5kZW50YXRpb24gaWYgZXhpc3RzLlxuICBjb25zdCBtYXRjaCA9IGlubGluZVNuYXBzaG90Lm1hdGNoKElOREVOVEFUSU9OX1JFR0VYKVxuICBpZiAoIW1hdGNoIHx8ICFtYXRjaFsxXSkge1xuICAgIC8vIE5vIGluZGVudGF0aW9uLlxuICAgIHJldHVybiBpbmxpbmVTbmFwc2hvdFxuICB9XG5cbiAgY29uc3QgaW5kZW50YXRpb24gPSBtYXRjaFsxXVxuICBjb25zdCBsaW5lcyA9IGlubGluZVNuYXBzaG90LnNwbGl0KC9cXG4vZylcbiAgaWYgKGxpbmVzLmxlbmd0aCA8PSAyKSB7XG4gICAgLy8gTXVzdCBiZSBhdCBsZWFzdCAzIGxpbmVzLlxuICAgIHJldHVybiBpbmxpbmVTbmFwc2hvdFxuICB9XG5cbiAgaWYgKGxpbmVzWzBdLnRyaW0oKSAhPT0gJycgfHwgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0udHJpbSgpICE9PSAnJykge1xuICAgIC8vIElmIG5vdCBibGFuayBmaXJzdCBhbmQgbGFzdCBsaW5lcywgYWJvcnQuXG4gICAgcmV0dXJuIGlubGluZVNuYXBzaG90XG4gIH1cblxuICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChsaW5lc1tpXSAhPT0gJycpIHtcbiAgICAgIGlmIChsaW5lc1tpXS5pbmRleE9mKGluZGVudGF0aW9uKSAhPT0gMCkge1xuICAgICAgICAvLyBBbGwgbGluZXMgZXhjZXB0IGZpcnN0IGFuZCBsYXN0IHNob3VsZCBlaXRoZXIgYmUgYmxhbmsgb3IgaGF2ZSB0aGUgc2FtZVxuICAgICAgICAvLyBpbmRlbnQgYXMgdGhlIGZpcnN0IGxpbmUgKG9yIG1vcmUpLiBJZiB0aGlzIGlzbid0IHRoZSBjYXNlIHdlIGRvbid0XG4gICAgICAgIC8vIHdhbnQgdG8gdG91Y2ggdGhlIHNuYXBzaG90IGF0IGFsbC5cbiAgICAgICAgcmV0dXJuIGlubGluZVNuYXBzaG90XG4gICAgICB9XG5cbiAgICAgIGxpbmVzW2ldID0gbGluZXNbaV0uc3Vic3RyaW5nKGluZGVudGF0aW9uLmxlbmd0aClcbiAgICB9XG4gIH1cblxuICAvLyBMYXN0IGxpbmUgaXMgYSBzcGVjaWFsIGNhc2UgYmVjYXVzZSBpdCB3b24ndCBoYXZlIHRoZSBzYW1lIGluZGVudCBhcyBvdGhlcnNcbiAgLy8gYnV0IG1heSBzdGlsbCBoYXZlIGJlZW4gZ2l2ZW4gc29tZSBpbmRlbnQgdG8gbGluZSB1cC5cbiAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0gPSAnJ1xuXG4gIC8vIFJldHVybiBpbmxpbmUgc25hcHNob3QsIG5vdyBhdCBpbmRlbnQgMC5cbiAgaW5saW5lU25hcHNob3QgPSBsaW5lcy5qb2luKCdcXG4nKVxuICByZXR1cm4gaW5saW5lU25hcHNob3Rcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHR5cGUgeyBDb25maWcgfSBmcm9tICdAamVzdC90eXBlcydcbi8vIGltcG9ydCB7IGdldFN0YWNrVHJhY2VMaW5lcywgZ2V0VG9wRnJhbWUgfSBmcm9tICdqZXN0LW1lc3NhZ2UtdXRpbCdcbmltcG9ydCB0eXBlIHsgT3B0aW9uc1JlY2VpdmVkIGFzIFByZXR0eUZvcm1hdE9wdGlvbnMgfSBmcm9tICdwcmV0dHktZm9ybWF0J1xuaW1wb3J0IHR5cGUgeyBQYXJzZWRTdGFjaywgU25hcHNob3REYXRhLCBTbmFwc2hvdE1hdGNoT3B0aW9ucywgU25hcHNob3RTdGF0ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCB7IHNsYXNoIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnXG5pbXBvcnQgeyBwYXJzZVN0YWNrdHJhY2UgfSBmcm9tICcuLi8uLi8uLi91dGlscy9zb3VyY2UtbWFwJ1xuaW1wb3J0IHR5cGUgeyBJbmxpbmVTbmFwc2hvdCB9IGZyb20gJy4vaW5saW5lU25hcHNob3QnXG5pbXBvcnQgeyBzYXZlSW5saW5lU25hcHNob3RzIH0gZnJvbSAnLi9pbmxpbmVTbmFwc2hvdCdcblxuaW1wb3J0IHtcbiAgYWRkRXh0cmFMaW5lQnJlYWtzLFxuICBnZXRTbmFwc2hvdERhdGEsXG4gIGtleVRvVGVzdE5hbWUsXG4gIHByZXBhcmVFeHBlY3RlZCxcbiAgcmVtb3ZlRXh0cmFMaW5lQnJlYWtzLFxuICBzYXZlU25hcHNob3RGaWxlLFxuICBzZXJpYWxpemUsXG4gIHRlc3ROYW1lVG9LZXksXG59IGZyb20gJy4vdXRpbHMnXG5cbmludGVyZmFjZSBTbmFwc2hvdFJldHVybk9wdGlvbnMge1xuICBhY3R1YWw6IHN0cmluZ1xuICBjb3VudDogbnVtYmVyXG4gIGV4cGVjdGVkPzogc3RyaW5nXG4gIGtleTogc3RyaW5nXG4gIHBhc3M6IGJvb2xlYW5cbn1cblxuaW50ZXJmYWNlIFNhdmVTdGF0dXMge1xuICBkZWxldGVkOiBib29sZWFuXG4gIHNhdmVkOiBib29sZWFuXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNuYXBzaG90U3RhdGUge1xuICBwcml2YXRlIF9jb3VudGVyczogTWFwPHN0cmluZywgbnVtYmVyPlxuICBwcml2YXRlIF9kaXJ0eTogYm9vbGVhblxuICBwcml2YXRlIF91cGRhdGVTbmFwc2hvdDogQ29uZmlnLlNuYXBzaG90VXBkYXRlU3RhdGVcbiAgcHJpdmF0ZSBfc25hcHNob3REYXRhOiBTbmFwc2hvdERhdGFcbiAgcHJpdmF0ZSBfaW5pdGlhbERhdGE6IFNuYXBzaG90RGF0YVxuICBwcml2YXRlIF9zbmFwc2hvdFBhdGg6IHN0cmluZ1xuICBwcml2YXRlIF9pbmxpbmVTbmFwc2hvdHM6IEFycmF5PElubGluZVNuYXBzaG90PlxuICBwcml2YXRlIF91bmNoZWNrZWRLZXlzOiBTZXQ8c3RyaW5nPlxuICBwcml2YXRlIF9zbmFwc2hvdEZvcm1hdDogUHJldHR5Rm9ybWF0T3B0aW9uc1xuXG4gIGFkZGVkOiBudW1iZXJcbiAgZXhwYW5kOiBib29sZWFuXG4gIG1hdGNoZWQ6IG51bWJlclxuICB1bm1hdGNoZWQ6IG51bWJlclxuICB1cGRhdGVkOiBudW1iZXJcblxuICBjb25zdHJ1Y3RvcihzbmFwc2hvdFBhdGg6IHN0cmluZywgb3B0aW9uczogU25hcHNob3RTdGF0ZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9zbmFwc2hvdFBhdGggPSBzbmFwc2hvdFBhdGhcbiAgICBjb25zdCB7IGRhdGEsIGRpcnR5IH0gPSBnZXRTbmFwc2hvdERhdGEoXG4gICAgICB0aGlzLl9zbmFwc2hvdFBhdGgsXG4gICAgICBvcHRpb25zLnVwZGF0ZVNuYXBzaG90LFxuICAgIClcbiAgICB0aGlzLl9pbml0aWFsRGF0YSA9IGRhdGFcbiAgICB0aGlzLl9zbmFwc2hvdERhdGEgPSBkYXRhXG4gICAgdGhpcy5fZGlydHkgPSBkaXJ0eVxuICAgIHRoaXMuX2lubGluZVNuYXBzaG90cyA9IFtdXG4gICAgdGhpcy5fdW5jaGVja2VkS2V5cyA9IG5ldyBTZXQoT2JqZWN0LmtleXModGhpcy5fc25hcHNob3REYXRhKSlcbiAgICB0aGlzLl9jb3VudGVycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZXhwYW5kID0gb3B0aW9ucy5leHBhbmQgfHwgZmFsc2VcbiAgICB0aGlzLmFkZGVkID0gMFxuICAgIHRoaXMubWF0Y2hlZCA9IDBcbiAgICB0aGlzLnVubWF0Y2hlZCA9IDBcbiAgICB0aGlzLl91cGRhdGVTbmFwc2hvdCA9IG9wdGlvbnMudXBkYXRlU25hcHNob3RcbiAgICB0aGlzLnVwZGF0ZWQgPSAwXG4gICAgdGhpcy5fc25hcHNob3RGb3JtYXQgPSB7XG4gICAgICBwcmludEJhc2ljUHJvdG90eXBlOiBmYWxzZSxcbiAgICAgIC4uLm9wdGlvbnMuc25hcHNob3RGb3JtYXQsXG4gICAgfVxuICB9XG5cbiAgbWFya1NuYXBzaG90c0FzQ2hlY2tlZEZvclRlc3QodGVzdE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VuY2hlY2tlZEtleXMuZm9yRWFjaCgodW5jaGVja2VkS2V5KSA9PiB7XG4gICAgICBpZiAoa2V5VG9UZXN0TmFtZSh1bmNoZWNrZWRLZXkpID09PSB0ZXN0TmFtZSlcbiAgICAgICAgdGhpcy5fdW5jaGVja2VkS2V5cy5kZWxldGUodW5jaGVja2VkS2V5KVxuICAgIH0pXG4gIH1cblxuICBwcml2YXRlIF9nZXRJbmxpbmVTbmFwc2hvdFN0YWNrKHN0YWNrczogUGFyc2VkU3RhY2tbXSkge1xuICAgIC8vIGlmIGNhbGxlZCBpbnNpZGUgcmVzb2x2ZXMvcmVqZWN0cywgc3RhY2t0cmFjZSBpcyBkaWZmZXJlbnRcbiAgICBjb25zdCBwcm9taXNlSW5kZXggPSBzdGFja3MuZmluZEluZGV4KGkgPT4gaS5tZXRob2QubWF0Y2goL19fVklURVNUXyhSRVNPTFZFU3xSRUpFQ1RTKV9fLykpXG4gICAgaWYgKHByb21pc2VJbmRleCAhPT0gLTEpXG4gICAgICByZXR1cm4gc3RhY2tzW3Byb21pc2VJbmRleCArIDNdXG5cbiAgICAvLyBpbmxpbmUgc25hcHNob3QgZnVuY3Rpb24gaXMgY2FsbGVkIF9fVklURVNUX0lOTElORV9TTkFQU0hPVF9fXG4gICAgLy8gaW4gaW50ZWdyYXRpb25zL3NuYXBzaG90L2NoYWkudHNcbiAgICBjb25zdCBzdGFja0luZGV4ID0gc3RhY2tzLmZpbmRJbmRleChpID0+IGkubWV0aG9kLmluY2x1ZGVzKCdfX1ZJVEVTVF9JTkxJTkVfU05BUFNIT1RfXycpKVxuICAgIHJldHVybiBzdGFja0luZGV4ICE9PSAtMSA/IHN0YWNrc1tzdGFja0luZGV4ICsgMl0gOiBudWxsXG4gIH1cblxuICBwcml2YXRlIF9hZGRTbmFwc2hvdChcbiAgICBrZXk6IHN0cmluZyxcbiAgICByZWNlaXZlZFNlcmlhbGl6ZWQ6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IGlzSW5saW5lOiBib29sZWFuOyBlcnJvcj86IEVycm9yIH0sXG4gICk6IHZvaWQge1xuICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZVxuICAgIGlmIChvcHRpb25zLmlzSW5saW5lKSB7XG4gICAgICBjb25zdCBlcnJvciA9IG9wdGlvbnMuZXJyb3IgfHwgbmV3IEVycm9yKCdVbmtub3duIGVycm9yJylcbiAgICAgIGNvbnN0IHN0YWNrcyA9IHBhcnNlU3RhY2t0cmFjZShlcnJvciwgdHJ1ZSlcbiAgICAgIHN0YWNrcy5mb3JFYWNoKGkgPT4gaS5maWxlID0gc2xhc2goaS5maWxlKSlcbiAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5fZ2V0SW5saW5lU25hcHNob3RTdGFjayhzdGFja3MpXG4gICAgICBpZiAoIXN0YWNrKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgVml0ZXN0OiBDb3VsZG4ndCBpbmZlciBzdGFjayBmcmFtZSBmb3IgaW5saW5lIHNuYXBzaG90LlxcbiR7SlNPTi5zdHJpbmdpZnkoc3RhY2tzKX1gLFxuICAgICAgICApXG4gICAgICB9XG4gICAgICB0aGlzLl9pbmxpbmVTbmFwc2hvdHMucHVzaCh7XG4gICAgICAgIHNuYXBzaG90OiByZWNlaXZlZFNlcmlhbGl6ZWQsXG4gICAgICAgIC4uLnN0YWNrLFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9zbmFwc2hvdERhdGFba2V5XSA9IHJlY2VpdmVkU2VyaWFsaXplZFxuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX3NuYXBzaG90RGF0YSA9IHRoaXMuX2luaXRpYWxEYXRhXG4gICAgLy8gdGhpcy5faW5saW5lU25hcHNob3RzID0gW11cbiAgICB0aGlzLl9jb3VudGVycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuYWRkZWQgPSAwXG4gICAgdGhpcy5tYXRjaGVkID0gMFxuICAgIHRoaXMudW5tYXRjaGVkID0gMFxuICAgIHRoaXMudXBkYXRlZCA9IDBcbiAgfVxuXG4gIGFzeW5jIHNhdmUoKTogUHJvbWlzZTxTYXZlU3RhdHVzPiB7XG4gICAgY29uc3QgaGFzRXh0ZXJuYWxTbmFwc2hvdHMgPSBPYmplY3Qua2V5cyh0aGlzLl9zbmFwc2hvdERhdGEpLmxlbmd0aFxuICAgIGNvbnN0IGhhc0lubGluZVNuYXBzaG90cyA9IHRoaXMuX2lubGluZVNuYXBzaG90cy5sZW5ndGhcbiAgICBjb25zdCBpc0VtcHR5ID0gIWhhc0V4dGVybmFsU25hcHNob3RzICYmICFoYXNJbmxpbmVTbmFwc2hvdHNcblxuICAgIGNvbnN0IHN0YXR1czogU2F2ZVN0YXR1cyA9IHtcbiAgICAgIGRlbGV0ZWQ6IGZhbHNlLFxuICAgICAgc2F2ZWQ6IGZhbHNlLFxuICAgIH1cblxuICAgIGlmICgodGhpcy5fZGlydHkgfHwgdGhpcy5fdW5jaGVja2VkS2V5cy5zaXplKSAmJiAhaXNFbXB0eSkge1xuICAgICAgaWYgKGhhc0V4dGVybmFsU25hcHNob3RzKVxuICAgICAgICBhd2FpdCBzYXZlU25hcHNob3RGaWxlKHRoaXMuX3NuYXBzaG90RGF0YSwgdGhpcy5fc25hcHNob3RQYXRoKVxuICAgICAgaWYgKGhhc0lubGluZVNuYXBzaG90cylcbiAgICAgICAgYXdhaXQgc2F2ZUlubGluZVNuYXBzaG90cyh0aGlzLl9pbmxpbmVTbmFwc2hvdHMpXG5cbiAgICAgIHN0YXR1cy5zYXZlZCA9IHRydWVcbiAgICB9XG4gICAgZWxzZSBpZiAoIWhhc0V4dGVybmFsU25hcHNob3RzICYmIGZzLmV4aXN0c1N5bmModGhpcy5fc25hcHNob3RQYXRoKSkge1xuICAgICAgaWYgKHRoaXMuX3VwZGF0ZVNuYXBzaG90ID09PSAnYWxsJylcbiAgICAgICAgZnMudW5saW5rU3luYyh0aGlzLl9zbmFwc2hvdFBhdGgpXG5cbiAgICAgIHN0YXR1cy5kZWxldGVkID0gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0dXNcbiAgfVxuXG4gIGdldFVuY2hlY2tlZENvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3VuY2hlY2tlZEtleXMuc2l6ZSB8fCAwXG4gIH1cblxuICBnZXRVbmNoZWNrZWRLZXlzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3VuY2hlY2tlZEtleXMpXG4gIH1cblxuICByZW1vdmVVbmNoZWNrZWRLZXlzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl91cGRhdGVTbmFwc2hvdCA9PT0gJ2FsbCcgJiYgdGhpcy5fdW5jaGVja2VkS2V5cy5zaXplKSB7XG4gICAgICB0aGlzLl9kaXJ0eSA9IHRydWVcbiAgICAgIHRoaXMuX3VuY2hlY2tlZEtleXMuZm9yRWFjaChrZXkgPT4gZGVsZXRlIHRoaXMuX3NuYXBzaG90RGF0YVtrZXldKVxuICAgICAgdGhpcy5fdW5jaGVja2VkS2V5cy5jbGVhcigpXG4gICAgfVxuICB9XG5cbiAgbWF0Y2goe1xuICAgIHRlc3ROYW1lLFxuICAgIHJlY2VpdmVkLFxuICAgIGtleSxcbiAgICBpbmxpbmVTbmFwc2hvdCxcbiAgICBpc0lubGluZSxcbiAgICBlcnJvcixcbiAgfTogU25hcHNob3RNYXRjaE9wdGlvbnMpOiBTbmFwc2hvdFJldHVybk9wdGlvbnMge1xuICAgIHRoaXMuX2NvdW50ZXJzLnNldCh0ZXN0TmFtZSwgKHRoaXMuX2NvdW50ZXJzLmdldCh0ZXN0TmFtZSkgfHwgMCkgKyAxKVxuICAgIGNvbnN0IGNvdW50ID0gTnVtYmVyKHRoaXMuX2NvdW50ZXJzLmdldCh0ZXN0TmFtZSkpXG5cbiAgICBpZiAoIWtleSlcbiAgICAgIGtleSA9IHRlc3ROYW1lVG9LZXkodGVzdE5hbWUsIGNvdW50KVxuXG4gICAgLy8gRG8gbm90IG1hcmsgdGhlIHNuYXBzaG90IGFzIFwiY2hlY2tlZFwiIGlmIHRoZSBzbmFwc2hvdCBpcyBpbmxpbmUgYW5kXG4gICAgLy8gdGhlcmUncyBhbiBleHRlcm5hbCBzbmFwc2hvdC4gVGhpcyB3YXkgdGhlIGV4dGVybmFsIHNuYXBzaG90IGNhbiBiZVxuICAgIC8vIHJlbW92ZWQgd2l0aCBgLS11cGRhdGVTbmFwc2hvdGAuXG4gICAgaWYgKCEoaXNJbmxpbmUgJiYgdGhpcy5fc25hcHNob3REYXRhW2tleV0gIT09IHVuZGVmaW5lZCkpXG4gICAgICB0aGlzLl91bmNoZWNrZWRLZXlzLmRlbGV0ZShrZXkpXG5cbiAgICBjb25zdCByZWNlaXZlZFNlcmlhbGl6ZWQgPSBhZGRFeHRyYUxpbmVCcmVha3Moc2VyaWFsaXplKHJlY2VpdmVkLCB1bmRlZmluZWQsIHRoaXMuX3NuYXBzaG90Rm9ybWF0KSlcbiAgICBjb25zdCBleHBlY3RlZCA9IGlzSW5saW5lID8gaW5saW5lU25hcHNob3QgOiB0aGlzLl9zbmFwc2hvdERhdGFba2V5XVxuICAgIGNvbnN0IGV4cGVjdGVkVHJpbW1lZCA9IHByZXBhcmVFeHBlY3RlZChleHBlY3RlZClcbiAgICBjb25zdCBwYXNzID0gZXhwZWN0ZWRUcmltbWVkID09PSBwcmVwYXJlRXhwZWN0ZWQocmVjZWl2ZWRTZXJpYWxpemVkKVxuICAgIGNvbnN0IGhhc1NuYXBzaG90ID0gZXhwZWN0ZWQgIT09IHVuZGVmaW5lZFxuICAgIGNvbnN0IHNuYXBzaG90SXNQZXJzaXN0ZWQgPSBpc0lubGluZSB8fCBmcy5leGlzdHNTeW5jKHRoaXMuX3NuYXBzaG90UGF0aClcblxuICAgIGlmIChwYXNzICYmICFpc0lubGluZSkge1xuICAgICAgLy8gRXhlY3V0aW5nIGEgc25hcHNob3QgZmlsZSBhcyBKYXZhU2NyaXB0IGFuZCB3cml0aW5nIHRoZSBzdHJpbmdzIGJhY2tcbiAgICAgIC8vIHdoZW4gb3RoZXIgc25hcHNob3RzIGhhdmUgY2hhbmdlZCBsb3NlcyB0aGUgcHJvcGVyIGVzY2FwaW5nIGZvciBzb21lXG4gICAgICAvLyBjaGFyYWN0ZXJzLiBTaW5jZSB3ZSBjaGVjayBldmVyeSBzbmFwc2hvdCBpbiBldmVyeSB0ZXN0LCB1c2UgdGhlIG5ld2x5XG4gICAgICAvLyBnZW5lcmF0ZWQgZm9ybWF0dGVkIHN0cmluZy5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIGlzIG9ubHkgcmVsZXZhbnQgd2hlbiBhIHNuYXBzaG90IGlzIGFkZGVkIGFuZCB0aGUgZGlydHlcbiAgICAgIC8vIGZsYWcgaXMgc2V0LlxuICAgICAgdGhpcy5fc25hcHNob3REYXRhW2tleV0gPSByZWNlaXZlZFNlcmlhbGl6ZWRcbiAgICB9XG5cbiAgICAvLyBUaGVzZSBhcmUgdGhlIGNvbmRpdGlvbnMgb24gd2hlbiB0byB3cml0ZSBzbmFwc2hvdHM6XG4gICAgLy8gICogVGhlcmUncyBubyBzbmFwc2hvdCBmaWxlIGluIGEgbm9uLUNJIGVudmlyb25tZW50LlxuICAgIC8vICAqIFRoZXJlIGlzIGEgc25hcHNob3QgZmlsZSBhbmQgd2UgZGVjaWRlZCB0byB1cGRhdGUgdGhlIHNuYXBzaG90LlxuICAgIC8vICAqIFRoZXJlIGlzIGEgc25hcHNob3QgZmlsZSwgYnV0IGl0IGRvZXNuJ3QgaGF2ZSB0aGlzIHNuYXBzaG90LlxuICAgIC8vIFRoZXNlIGFyZSB0aGUgY29uZGl0aW9ucyBvbiB3aGVuIG5vdCB0byB3cml0ZSBzbmFwc2hvdHM6XG4gICAgLy8gICogVGhlIHVwZGF0ZSBmbGFnIGlzIHNldCB0byAnbm9uZScuXG4gICAgLy8gICogVGhlcmUncyBubyBzbmFwc2hvdCBmaWxlIG9yIGEgZmlsZSB3aXRob3V0IHRoaXMgc25hcHNob3Qgb24gYSBDSSBlbnZpcm9ubWVudC5cbiAgICBpZiAoXG4gICAgICAoaGFzU25hcHNob3QgJiYgdGhpcy5fdXBkYXRlU25hcHNob3QgPT09ICdhbGwnKVxuICAgICAgIHx8ICgoIWhhc1NuYXBzaG90IHx8ICFzbmFwc2hvdElzUGVyc2lzdGVkKVxuICAgICAgICAgJiYgKHRoaXMuX3VwZGF0ZVNuYXBzaG90ID09PSAnbmV3JyB8fCB0aGlzLl91cGRhdGVTbmFwc2hvdCA9PT0gJ2FsbCcpKVxuICAgICkge1xuICAgICAgaWYgKHRoaXMuX3VwZGF0ZVNuYXBzaG90ID09PSAnYWxsJykge1xuICAgICAgICBpZiAoIXBhc3MpIHtcbiAgICAgICAgICBpZiAoaGFzU25hcHNob3QpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZWQrK1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuYWRkZWQrK1xuXG4gICAgICAgICAgdGhpcy5fYWRkU25hcHNob3Qoa2V5LCByZWNlaXZlZFNlcmlhbGl6ZWQsIHsgZXJyb3IsIGlzSW5saW5lIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5tYXRjaGVkKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX2FkZFNuYXBzaG90KGtleSwgcmVjZWl2ZWRTZXJpYWxpemVkLCB7IGVycm9yLCBpc0lubGluZSB9KVxuICAgICAgICB0aGlzLmFkZGVkKytcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWN0dWFsOiAnJyxcbiAgICAgICAgY291bnQsXG4gICAgICAgIGV4cGVjdGVkOiAnJyxcbiAgICAgICAga2V5LFxuICAgICAgICBwYXNzOiB0cnVlLFxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGlmICghcGFzcykge1xuICAgICAgICB0aGlzLnVubWF0Y2hlZCsrXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYWN0dWFsOiByZW1vdmVFeHRyYUxpbmVCcmVha3MocmVjZWl2ZWRTZXJpYWxpemVkKSxcbiAgICAgICAgICBjb3VudCxcbiAgICAgICAgICBleHBlY3RlZDpcbiAgICAgICAgICBleHBlY3RlZFRyaW1tZWQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyByZW1vdmVFeHRyYUxpbmVCcmVha3MoZXhwZWN0ZWRUcmltbWVkKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIHBhc3M6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXRjaGVkKytcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhY3R1YWw6ICcnLFxuICAgICAgICAgIGNvdW50LFxuICAgICAgICAgIGV4cGVjdGVkOiAnJyxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgcGFzczogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aGUnXG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJ1xuaW1wb3J0IHR5cGUgeyBTbmFwc2hvdFJlc3VsdCwgVGVzdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgcnBjIH0gZnJvbSAnLi4vLi4vcnVudGltZS9ycGMnXG5pbXBvcnQgeyBnZXROYW1lcyB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuaW1wb3J0IHsgZXF1YWxzLCBpdGVyYWJsZUVxdWFsaXR5LCBzdWJzZXRFcXVhbGl0eSB9IGZyb20gJy4uL2NoYWkvamVzdC11dGlscydcbmltcG9ydCB7IGRlZXBNZXJnZVNuYXBzaG90IH0gZnJvbSAnLi9wb3J0L3V0aWxzJ1xuaW1wb3J0IFNuYXBzaG90U3RhdGUgZnJvbSAnLi9wb3J0L3N0YXRlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQge1xuICBmaWxlOiBzdHJpbmdcbiAgdGl0bGU/OiBzdHJpbmdcbiAgZnVsbFRpdGxlPzogc3RyaW5nXG59XG5cbmNvbnN0IHJlc29sdmVTbmFwc2hvdFBhdGggPSAodGVzdFBhdGg6IHN0cmluZykgPT5cbiAgcGF0aC5qb2luKFxuICAgIHBhdGguam9pbihwYXRoLmRpcm5hbWUodGVzdFBhdGgpLCAnX19zbmFwc2hvdHNfXycpLFxuICAgIGAke3BhdGguYmFzZW5hbWUodGVzdFBhdGgpfS5zbmFwYCxcbiAgKVxuXG5leHBvcnQgY2xhc3MgU25hcHNob3RDbGllbnQge1xuICB0ZXN0OiBUZXN0IHwgdW5kZWZpbmVkXG4gIHRlc3RGaWxlID0gJydcbiAgc25hcHNob3RTdGF0ZTogU25hcHNob3RTdGF0ZSB8IHVuZGVmaW5lZFxuXG4gIHNldFRlc3QodGVzdDogVGVzdCkge1xuICAgIHRoaXMudGVzdCA9IHRlc3RcblxuICAgIGlmICh0aGlzLnRlc3RGaWxlICE9PSB0aGlzLnRlc3QuZmlsZSEuZmlsZXBhdGgpIHtcbiAgICAgIGlmICh0aGlzLnNuYXBzaG90U3RhdGUpXG4gICAgICAgIHRoaXMuc2F2ZVNuYXAoKVxuXG4gICAgICB0aGlzLnRlc3RGaWxlID0gdGhpcy50ZXN0IS5maWxlIS5maWxlcGF0aFxuICAgICAgdGhpcy5zbmFwc2hvdFN0YXRlID0gbmV3IFNuYXBzaG90U3RhdGUoXG4gICAgICAgIHJlc29sdmVTbmFwc2hvdFBhdGgodGhpcy50ZXN0RmlsZSksXG4gICAgICAgIF9fdml0ZXN0X3dvcmtlcl9fIS5jb25maWcuc25hcHNob3RPcHRpb25zLFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyVGVzdCgpIHtcbiAgICB0aGlzLnRlc3QgPSB1bmRlZmluZWRcbiAgfVxuXG4gIGFzc2VydChyZWNlaXZlZDogdW5rbm93biwgbWVzc2FnZT86IHN0cmluZywgaXNJbmxpbmUgPSBmYWxzZSwgcHJvcGVydGllcz86IG9iamVjdCwgaW5saW5lU25hcHNob3Q/OiBzdHJpbmcsIGVycm9yPzogRXJyb3IpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudGVzdClcbiAgICAgIHRocm93IG5ldyBFcnJvcignU25hcHNob3QgY2Fubm90IGJlIHVzZWQgb3V0c2lkZSBvZiB0ZXN0JylcblxuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgcmVjZWl2ZWQgIT09ICdvYmplY3QnIHx8ICFyZWNlaXZlZClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWNlaXZlZCB2YWx1ZSBtdXN0IGJlIGFuIG9iamVjdCB3aGVuIHRoZSBtYXRjaGVyIGhhcyBwcm9wZXJ0aWVzJylcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFzcyA9IGVxdWFscyhyZWNlaXZlZCwgcHJvcGVydGllcywgW2l0ZXJhYmxlRXF1YWxpdHksIHN1YnNldEVxdWFsaXR5XSlcbiAgICAgICAgaWYgKCFwYXNzKVxuICAgICAgICAgIGV4cGVjdChyZWNlaXZlZCkuZXF1YWxzKHByb3BlcnRpZXMpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWNlaXZlZCA9IGRlZXBNZXJnZVNuYXBzaG90KHJlY2VpdmVkLCBwcm9wZXJ0aWVzKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGVyci5tZXNzYWdlID0gJ1NuYXBzaG90IG1pc21hdGNoZWQnXG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRlc3ROYW1lID0gW1xuICAgICAgLi4uZ2V0TmFtZXModGhpcy50ZXN0KS5zbGljZSgxKSxcbiAgICAgIC4uLihtZXNzYWdlID8gW21lc3NhZ2VdIDogW10pLFxuICAgIF0uam9pbignID4gJylcblxuICAgIGNvbnN0IHsgYWN0dWFsLCBleHBlY3RlZCwga2V5LCBwYXNzIH0gPSB0aGlzLnNuYXBzaG90U3RhdGUhLm1hdGNoKHtcbiAgICAgIHRlc3ROYW1lLFxuICAgICAgcmVjZWl2ZWQsXG4gICAgICBpc0lubGluZSxcbiAgICAgIGVycm9yLFxuICAgICAgaW5saW5lU25hcHNob3QsXG4gICAgfSlcblxuICAgIGlmICghcGFzcykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXhwZWN0KGFjdHVhbC50cmltKCkpLmVxdWFscyhleHBlY3RlZCA/IGV4cGVjdGVkLnRyaW0oKSA6ICcnKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGBTbmFwc2hvdCBcXGAke2tleSB8fCAndW5rbm93bid9XFxgIG1pc21hdGNoZWRgXG4gICAgICAgIHRocm93IGVycm9yXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc2F2ZVNuYXAoKSB7XG4gICAgaWYgKCF0aGlzLnRlc3RGaWxlIHx8ICF0aGlzLnNuYXBzaG90U3RhdGUpIHJldHVyblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBhY2tTbmFwc2hvdFN0YXRlKHRoaXMudGVzdEZpbGUsIHRoaXMuc25hcHNob3RTdGF0ZSlcbiAgICBhd2FpdCBycGMoKS5zbmFwc2hvdFNhdmVkKHJlc3VsdClcblxuICAgIHRoaXMudGVzdEZpbGUgPSAnJ1xuICAgIHRoaXMuc25hcHNob3RTdGF0ZSA9IHVuZGVmaW5lZFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYWNrU25hcHNob3RTdGF0ZShmaWxlcGF0aDogc3RyaW5nLCBzdGF0ZTogU25hcHNob3RTdGF0ZSk6IFByb21pc2U8U25hcHNob3RSZXN1bHQ+IHtcbiAgY29uc3Qgc25hcHNob3Q6IFNuYXBzaG90UmVzdWx0ID0ge1xuICAgIGZpbGVwYXRoLFxuICAgIGFkZGVkOiAwLFxuICAgIGZpbGVEZWxldGVkOiBmYWxzZSxcbiAgICBtYXRjaGVkOiAwLFxuICAgIHVuY2hlY2tlZDogMCxcbiAgICB1bmNoZWNrZWRLZXlzOiBbXSxcbiAgICB1bm1hdGNoZWQ6IDAsXG4gICAgdXBkYXRlZDogMCxcbiAgfVxuICBjb25zdCB1bmNoZWNrZWRDb3VudCA9IHN0YXRlLmdldFVuY2hlY2tlZENvdW50KClcbiAgY29uc3QgdW5jaGVja2VkS2V5cyA9IHN0YXRlLmdldFVuY2hlY2tlZEtleXMoKVxuICBpZiAodW5jaGVja2VkQ291bnQpXG4gICAgc3RhdGUucmVtb3ZlVW5jaGVja2VkS2V5cygpXG5cbiAgY29uc3Qgc3RhdHVzID0gYXdhaXQgc3RhdGUuc2F2ZSgpXG4gIHNuYXBzaG90LmZpbGVEZWxldGVkID0gc3RhdHVzLmRlbGV0ZWRcbiAgc25hcHNob3QuYWRkZWQgPSBzdGF0ZS5hZGRlZFxuICBzbmFwc2hvdC5tYXRjaGVkID0gc3RhdGUubWF0Y2hlZFxuICBzbmFwc2hvdC51bm1hdGNoZWQgPSBzdGF0ZS51bm1hdGNoZWRcbiAgc25hcHNob3QudXBkYXRlZCA9IHN0YXRlLnVwZGF0ZWRcbiAgc25hcHNob3QudW5jaGVja2VkID0gIXN0YXR1cy5kZWxldGVkID8gdW5jaGVja2VkQ291bnQgOiAwXG4gIHNuYXBzaG90LnVuY2hlY2tlZEtleXMgPSBBcnJheS5mcm9tKHVuY2hlY2tlZEtleXMpXG5cbiAgcmV0dXJuIHNuYXBzaG90XG59XG4iLCJpbXBvcnQgdHlwZSB7IENoYWlQbHVnaW4gfSBmcm9tICcuLi9jaGFpL3R5cGVzJ1xuaW1wb3J0IHsgU25hcHNob3RDbGllbnQgfSBmcm9tICcuL2NsaWVudCdcbmltcG9ydCB7IHN0cmlwU25hcHNob3RJbmRlbnRhdGlvbiB9IGZyb20gJy4vcG9ydC9pbmxpbmVTbmFwc2hvdCdcblxubGV0IF9jbGllbnQ6IFNuYXBzaG90Q2xpZW50XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTbmFwc2hvdENsaWVudCgpOiBTbmFwc2hvdENsaWVudCB7XG4gIGlmICghX2NsaWVudClcbiAgICBfY2xpZW50ID0gbmV3IFNuYXBzaG90Q2xpZW50KClcbiAgcmV0dXJuIF9jbGllbnRcbn1cblxuY29uc3QgZ2V0RXJyb3JTdHJpbmcgPSAoZXhwZWN0ZWQ6ICgpID0+IHZvaWQpID0+IHtcbiAgdHJ5IHtcbiAgICBleHBlY3RlZCgpXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgcmV0dXJuIGUubWVzc2FnZVxuXG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcignc25hcHNob3QgZnVuY3Rpb24gZGlkblxcJ3QgdGhyZXcnKVxufVxuXG5leHBvcnQgY29uc3QgU25hcHNob3RQbHVnaW46IENoYWlQbHVnaW4gPSAoY2hhaSwgdXRpbHMpID0+IHtcbiAgZm9yIChjb25zdCBrZXkgb2YgWydtYXRjaFNuYXBzaG90JywgJ3RvTWF0Y2hTbmFwc2hvdCddKSB7XG4gICAgdXRpbHMuYWRkTWV0aG9kKFxuICAgICAgY2hhaS5Bc3NlcnRpb24ucHJvdG90eXBlLFxuICAgICAga2V5LFxuICAgICAgZnVuY3Rpb24odGhpczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHByb3BlcnRpZXM/OiBvYmplY3QsIG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSB1dGlscy5mbGFnKHRoaXMsICdvYmplY3QnKVxuICAgICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBtZXNzYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG1lc3NhZ2UgPSBwcm9wZXJ0aWVzXG4gICAgICAgICAgcHJvcGVydGllcyA9IHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIGdldFNuYXBzaG90Q2xpZW50KCkuYXNzZXJ0KGV4cGVjdGVkLCBtZXNzYWdlLCBmYWxzZSwgcHJvcGVydGllcylcbiAgICAgIH0sXG4gICAgKVxuICB9XG4gIHV0aWxzLmFkZE1ldGhvZChcbiAgICBjaGFpLkFzc2VydGlvbi5wcm90b3R5cGUsXG4gICAgJ3RvTWF0Y2hJbmxpbmVTbmFwc2hvdCcsXG4gICAgZnVuY3Rpb24gX19WSVRFU1RfSU5MSU5FX1NOQVBTSE9UX18odGhpczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHByb3BlcnRpZXM/OiBvYmplY3QsIGlubGluZVNuYXBzaG90Pzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcpXG4gICAgICBjb25zdCBlcnJvciA9IHV0aWxzLmZsYWcodGhpcywgJ2Vycm9yJylcbiAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbWVzc2FnZSA9IGlubGluZVNuYXBzaG90XG4gICAgICAgIGlubGluZVNuYXBzaG90ID0gcHJvcGVydGllc1xuICAgICAgICBwcm9wZXJ0aWVzID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgICBpZiAoaW5saW5lU25hcHNob3QpXG4gICAgICAgIGlubGluZVNuYXBzaG90ID0gc3RyaXBTbmFwc2hvdEluZGVudGF0aW9uKGlubGluZVNuYXBzaG90KVxuICAgICAgZ2V0U25hcHNob3RDbGllbnQoKS5hc3NlcnQoZXhwZWN0ZWQsIG1lc3NhZ2UsIHRydWUsIHByb3BlcnRpZXMsIGlubGluZVNuYXBzaG90LCBlcnJvcilcbiAgICB9LFxuICApXG4gIHV0aWxzLmFkZE1ldGhvZChcbiAgICBjaGFpLkFzc2VydGlvbi5wcm90b3R5cGUsXG4gICAgJ3RvVGhyb3dFcnJvck1hdGNoaW5nU25hcHNob3QnLFxuICAgIGZ1bmN0aW9uKHRoaXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcpXG4gICAgICBnZXRTbmFwc2hvdENsaWVudCgpLmFzc2VydChnZXRFcnJvclN0cmluZyhleHBlY3RlZCksIG1lc3NhZ2UpXG4gICAgfSxcbiAgKVxuICB1dGlscy5hZGRNZXRob2QoXG4gICAgY2hhaS5Bc3NlcnRpb24ucHJvdG90eXBlLFxuICAgICd0b1Rocm93RXJyb3JNYXRjaGluZ0lubGluZVNuYXBzaG90JyxcbiAgICBmdW5jdGlvbiBfX1ZJVEVTVF9JTkxJTkVfU05BUFNIT1RfXyh0aGlzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaW5saW5lU25hcHNob3Q6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IHV0aWxzLmZsYWcodGhpcywgJ29iamVjdCcpXG4gICAgICBjb25zdCBlcnJvciA9IHV0aWxzLmZsYWcodGhpcywgJ2Vycm9yJylcbiAgICAgIGdldFNuYXBzaG90Q2xpZW50KCkuYXNzZXJ0KGdldEVycm9yU3RyaW5nKGV4cGVjdGVkKSwgbWVzc2FnZSwgdHJ1ZSwgdW5kZWZpbmVkLCBpbmxpbmVTbmFwc2hvdCwgZXJyb3IpXG4gICAgfSxcbiAgKVxufVxuIiwiLy8gd2UgYXJlIHVzaW5nIG9ubHkgdGhlIG9uZXMgbmVlZGVkIGJ5IEB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb21cbi8vIGlmIHlvdSBuZWVkIG1vcmUsIGp1c3QgYXNrXG5cbmltcG9ydCBjIGZyb20gJ3BpY29jb2xvcnMnXG5pbXBvcnQgdHlwZSB7IEZvcm1hdHRlciB9IGZyb20gJ3BpY29jb2xvcnMvdHlwZXMnXG5pbXBvcnQgeyBmb3JtYXQgYXMgcHJldHR5Rm9ybWF0LCBwbHVnaW5zIGFzIHByZXR0eUZvcm1hdFBsdWdpbnMgfSBmcm9tICdwcmV0dHktZm9ybWF0J1xuaW1wb3J0IHsgdW5pZmllZERpZmYgfSBmcm9tICcuLi8uLi9ub2RlL2RpZmYnXG5cbmV4cG9ydCBjb25zdCBFWFBFQ1RFRF9DT0xPUiA9IGMuZ3JlZW5cbmV4cG9ydCBjb25zdCBSRUNFSVZFRF9DT0xPUiA9IGMucmVkXG5leHBvcnQgY29uc3QgSU5WRVJURURfQ09MT1IgPSBjLmludmVyc2VcbmV4cG9ydCBjb25zdCBCT0xEX1dFSUdIVCA9IGMuYm9sZFxuZXhwb3J0IGNvbnN0IERJTV9DT0xPUiA9IGMuZGltXG5cbmNvbnN0IHtcbiAgQXN5bW1ldHJpY01hdGNoZXIsXG4gIERPTUNvbGxlY3Rpb24sXG4gIERPTUVsZW1lbnQsXG4gIEltbXV0YWJsZSxcbiAgUmVhY3RFbGVtZW50LFxuICBSZWFjdFRlc3RDb21wb25lbnQsXG59ID0gcHJldHR5Rm9ybWF0UGx1Z2luc1xuXG5jb25zdCBQTFVHSU5TID0gW1xuICBSZWFjdFRlc3RDb21wb25lbnQsXG4gIFJlYWN0RWxlbWVudCxcbiAgRE9NRWxlbWVudCxcbiAgRE9NQ29sbGVjdGlvbixcbiAgSW1tdXRhYmxlLFxuICBBc3ltbWV0cmljTWF0Y2hlcixcbl1cblxuZXhwb3J0IGludGVyZmFjZSBNYXRjaGVySGludE9wdGlvbnMge1xuICBjb21tZW50Pzogc3RyaW5nXG4gIGV4cGVjdGVkQ29sb3I/OiBGb3JtYXR0ZXJcbiAgaXNEaXJlY3RFeHBlY3RDYWxsPzogYm9vbGVhblxuICBpc05vdD86IGJvb2xlYW5cbiAgcHJvbWlzZT86IHN0cmluZ1xuICByZWNlaXZlZENvbG9yPzogRm9ybWF0dGVyXG4gIHNlY29uZEFyZ3VtZW50Pzogc3RyaW5nXG4gIHNlY29uZEFyZ3VtZW50Q29sb3I/OiBGb3JtYXR0ZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hdGNoZXJIaW50KFxuICBtYXRjaGVyTmFtZTogc3RyaW5nLFxuICByZWNlaXZlZCA9ICdyZWNlaXZlZCcsXG4gIGV4cGVjdGVkID0gJ2V4cGVjdGVkJyxcbiAgb3B0aW9uczogTWF0Y2hlckhpbnRPcHRpb25zID0ge30sXG4pIHtcbiAgY29uc3Qge1xuICAgIGNvbW1lbnQgPSAnJyxcbiAgICBleHBlY3RlZENvbG9yID0gRVhQRUNURURfQ09MT1IsXG4gICAgaXNEaXJlY3RFeHBlY3RDYWxsID0gZmFsc2UsIC8vIHNlZW1zIHJlZHVuZGFudCB3aXRoIHJlY2VpdmVkID09PSAnJ1xuICAgIGlzTm90ID0gZmFsc2UsXG4gICAgcHJvbWlzZSA9ICcnLFxuICAgIHJlY2VpdmVkQ29sb3IgPSBSRUNFSVZFRF9DT0xPUixcbiAgICBzZWNvbmRBcmd1bWVudCA9ICcnLFxuICAgIHNlY29uZEFyZ3VtZW50Q29sb3IgPSBFWFBFQ1RFRF9DT0xPUixcbiAgfSA9IG9wdGlvbnNcbiAgbGV0IGhpbnQgPSAnJ1xuICBsZXQgZGltU3RyaW5nID0gJ2V4cGVjdCcgLy8gY29uY2F0ZW5hdGUgYWRqYWNlbnQgZGltIHN1YnN0cmluZ3NcblxuICBpZiAoIWlzRGlyZWN0RXhwZWN0Q2FsbCAmJiByZWNlaXZlZCAhPT0gJycpIHtcbiAgICBoaW50ICs9IERJTV9DT0xPUihgJHtkaW1TdHJpbmd9KGApICsgcmVjZWl2ZWRDb2xvcihyZWNlaXZlZClcbiAgICBkaW1TdHJpbmcgPSAnKSdcbiAgfVxuXG4gIGlmIChwcm9taXNlICE9PSAnJykge1xuICAgIGhpbnQgKz0gRElNX0NPTE9SKGAke2RpbVN0cmluZ30uYCkgKyBwcm9taXNlXG4gICAgZGltU3RyaW5nID0gJydcbiAgfVxuXG4gIGlmIChpc05vdCkge1xuICAgIGhpbnQgKz0gYCR7RElNX0NPTE9SKGAke2RpbVN0cmluZ30uYCl9bm90YFxuICAgIGRpbVN0cmluZyA9ICcnXG4gIH1cblxuICBpZiAobWF0Y2hlck5hbWUuaW5jbHVkZXMoJy4nKSkge1xuICAgIC8vIE9sZCBmb3JtYXQ6IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LFxuICAgIC8vIGVzcGVjaWFsbHkgd2l0aG91dCBwcm9taXNlIG9yIGlzTm90IG9wdGlvbnNcbiAgICBkaW1TdHJpbmcgKz0gbWF0Y2hlck5hbWVcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBOZXcgZm9ybWF0OiBvbWl0IHBlcmlvZCBmcm9tIG1hdGNoZXJOYW1lIGFyZ1xuICAgIGhpbnQgKz0gRElNX0NPTE9SKGAke2RpbVN0cmluZ30uYCkgKyBtYXRjaGVyTmFtZVxuICAgIGRpbVN0cmluZyA9ICcnXG4gIH1cblxuICBpZiAoZXhwZWN0ZWQgPT09ICcnKSB7XG4gICAgZGltU3RyaW5nICs9ICcoKSdcbiAgfVxuICBlbHNlIHtcbiAgICBoaW50ICs9IERJTV9DT0xPUihgJHtkaW1TdHJpbmd9KGApICsgZXhwZWN0ZWRDb2xvcihleHBlY3RlZClcbiAgICBpZiAoc2Vjb25kQXJndW1lbnQpXG4gICAgICBoaW50ICs9IERJTV9DT0xPUignLCAnKSArIHNlY29uZEFyZ3VtZW50Q29sb3Ioc2Vjb25kQXJndW1lbnQpXG4gICAgZGltU3RyaW5nID0gJyknXG4gIH1cblxuICBpZiAoY29tbWVudCAhPT0gJycpXG4gICAgZGltU3RyaW5nICs9IGAgLy8gJHtjb21tZW50fWBcblxuICBpZiAoZGltU3RyaW5nICE9PSAnJylcbiAgICBoaW50ICs9IERJTV9DT0xPUihkaW1TdHJpbmcpXG5cbiAgcmV0dXJuIGhpbnRcbn1cblxuY29uc3QgU1BBQ0VfU1lNQk9MID0gJ1xcdXswMEI3fScgLy8gbWlkZGxlIGRvdFxuXG4vLyBJbnN0ZWFkIG9mIGludmVyc2UgaGlnaGxpZ2h0IHdoaWNoIG5vdyBpbXBsaWVzIGEgY2hhbmdlLFxuLy8gcmVwbGFjZSBjb21tb24gc3BhY2VzIHdpdGggbWlkZGxlIGRvdCBhdCB0aGUgZW5kIG9mIGFueSBsaW5lLlxuY29uc3QgcmVwbGFjZVRyYWlsaW5nU3BhY2VzID0gKHRleHQ6IHN0cmluZyk6IHN0cmluZyA9PlxuICB0ZXh0LnJlcGxhY2UoL1xccyskL2dtLCBzcGFjZXMgPT4gU1BBQ0VfU1lNQk9MLnJlcGVhdChzcGFjZXMubGVuZ3RoKSlcblxuZXhwb3J0IGNvbnN0IHN0cmluZ2lmeSA9IChvYmplY3Q6IHVua25vd24sIG1heERlcHRoID0gMTApOiBzdHJpbmcgPT4ge1xuICBjb25zdCBNQVhfTEVOR1RIID0gMTAwMDBcbiAgbGV0IHJlc3VsdFxuXG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gcHJldHR5Rm9ybWF0KG9iamVjdCwge1xuICAgICAgbWF4RGVwdGgsXG4gICAgICAvLyBtaW46IHRydWUsXG4gICAgICBwbHVnaW5zOiBQTFVHSU5TLFxuICAgIH0pXG4gIH1cbiAgY2F0Y2gge1xuICAgIHJlc3VsdCA9IHByZXR0eUZvcm1hdChvYmplY3QsIHtcbiAgICAgIGNhbGxUb0pTT046IGZhbHNlLFxuICAgICAgbWF4RGVwdGgsXG4gICAgICAvLyBtaW46IHRydWUsXG4gICAgICBwbHVnaW5zOiBQTFVHSU5TLFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+PSBNQVhfTEVOR1RIICYmIG1heERlcHRoID4gMVxuICAgID8gc3RyaW5naWZ5KG9iamVjdCwgTWF0aC5mbG9vcihtYXhEZXB0aCAvIDIpKVxuICAgIDogcmVzdWx0XG59XG5cbmV4cG9ydCBjb25zdCBwcmludFJlY2VpdmVkID0gKG9iamVjdDogdW5rbm93bik6IHN0cmluZyA9PlxuICBSRUNFSVZFRF9DT0xPUihyZXBsYWNlVHJhaWxpbmdTcGFjZXMoc3RyaW5naWZ5KG9iamVjdCkpKVxuZXhwb3J0IGNvbnN0IHByaW50RXhwZWN0ZWQgPSAodmFsdWU6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgRVhQRUNURURfQ09MT1IocmVwbGFjZVRyYWlsaW5nU3BhY2VzKHN0cmluZ2lmeSh2YWx1ZSkpKVxuXG5leHBvcnQgaW50ZXJmYWNlIERpZmZPcHRpb25zIHtcbiAgYUFubm90YXRpb24/OiBzdHJpbmdcbiAgYUNvbG9yPzogRm9ybWF0dGVyXG4gIGFJbmRpY2F0b3I/OiBzdHJpbmdcbiAgYkFubm90YXRpb24/OiBzdHJpbmdcbiAgYkNvbG9yPzogRm9ybWF0dGVyXG4gIGJJbmRpY2F0b3I/OiBzdHJpbmdcbiAgY2hhbmdlQ29sb3I/OiBGb3JtYXR0ZXJcbiAgY2hhbmdlTGluZVRyYWlsaW5nU3BhY2VDb2xvcj86IEZvcm1hdHRlclxuICBjb21tb25Db2xvcj86IEZvcm1hdHRlclxuICBjb21tb25JbmRpY2F0b3I/OiBzdHJpbmdcbiAgY29tbW9uTGluZVRyYWlsaW5nU3BhY2VDb2xvcj86IEZvcm1hdHRlclxuICBjb250ZXh0TGluZXM/OiBudW1iZXJcbiAgZW1wdHlGaXJzdE9yTGFzdExpbmVQbGFjZWhvbGRlcj86IHN0cmluZ1xuICBleHBhbmQ/OiBib29sZWFuXG4gIGluY2x1ZGVDaGFuZ2VDb3VudHM/OiBib29sZWFuXG4gIG9taXRBbm5vdGF0aW9uTGluZXM/OiBib29sZWFuXG4gIHBhdGNoQ29sb3I/OiBGb3JtYXR0ZXJcbiAgLy8gcHJldHR5LWZvcm1hdCB0eXBlXG4gIGNvbXBhcmVLZXlzPzogYW55XG59XG5cbi8vIFRPRE86IGRvIHNvbWV0aGluZyB3aXRoIG9wdGlvbnNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbmV4cG9ydCBmdW5jdGlvbiBkaWZmKGE6IGFueSwgYjogYW55LCBvcHRpb25zPzogRGlmZk9wdGlvbnMpIHtcbiAgcmV0dXJuIHVuaWZpZWREaWZmKHN0cmluZ2lmeShhKSwgc3RyaW5naWZ5KGIpKVxufVxuIiwiaW1wb3J0IGNoYWksIHsgdXRpbCB9IGZyb20gJ2NoYWknXG5pbXBvcnQgeyBnZXRTdGF0ZSB9IGZyb20gJy4vamVzdC1leHBlY3QnXG5cbmltcG9ydCAqIGFzIG1hdGNoZXJVdGlscyBmcm9tICcuL2plc3QtbWF0Y2hlci11dGlscydcblxuaW1wb3J0IHtcbiAgZXF1YWxzLFxuICBpdGVyYWJsZUVxdWFsaXR5LFxuICBzdWJzZXRFcXVhbGl0eSxcbn0gZnJvbSAnLi9qZXN0LXV0aWxzJ1xuaW1wb3J0IHR5cGUge1xuICBDaGFpUGx1Z2luLFxuICBNYXRjaGVyU3RhdGUsXG4gIE1hdGNoZXJzT2JqZWN0LFxuICBTeW5jRXhwZWN0YXRpb25SZXN1bHQsXG59IGZyb20gJy4vdHlwZXMnXG5cbmNvbnN0IGlzQXN5bmNGdW5jdGlvbiA9IChmbjogdW5rbm93bikgPT5cbiAgdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIChmbiBhcyBhbnkpW1N5bWJvbC50b1N0cmluZ1RhZ10gPT09ICdBc3luY0Z1bmN0aW9uJ1xuXG5jb25zdCBnZXRNYXRjaGVyU3RhdGUgPSAoYXNzZXJ0aW9uOiBDaGFpLkFzc2VydGlvblN0YXRpYyAmIENoYWkuQXNzZXJ0aW9uKSA9PiB7XG4gIGNvbnN0IG9iaiA9IGFzc2VydGlvbi5fb2JqXG4gIGNvbnN0IGlzTm90ID0gdXRpbC5mbGFnKGFzc2VydGlvbiwgJ25lZ2F0ZScpIGFzIGJvb2xlYW5cbiAgY29uc3QgcHJvbWlzZSA9IHV0aWwuZmxhZyhhc3NlcnRpb24sICdwcm9taXNlJykgfHwgJydcbiAgY29uc3QgamVzdFV0aWxzID0ge1xuICAgIC4uLm1hdGNoZXJVdGlscyxcbiAgICBpdGVyYWJsZUVxdWFsaXR5LFxuICAgIHN1YnNldEVxdWFsaXR5LFxuICB9XG5cbiAgY29uc3QgbWF0Y2hlclN0YXRlOiBNYXRjaGVyU3RhdGUgPSB7XG4gICAgLi4uZ2V0U3RhdGUoKSxcbiAgICBpc05vdCxcbiAgICB1dGlsczogamVzdFV0aWxzLFxuICAgIHByb21pc2UsXG4gICAgZXF1YWxzLFxuICAgIC8vIG5lZWRlZCBmb3IgYnVpbHQtaW4gamVzdC1zbmFwc2hvdHMsIGJ1dCB3ZSBkb24ndCB1c2UgaXRcbiAgICBzdXBwcmVzc2VkRXJyb3JzOiBbXSxcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc3RhdGU6IG1hdGNoZXJTdGF0ZSxcbiAgICBpc05vdCxcbiAgICBvYmosXG4gIH1cbn1cblxuY2xhc3MgSmVzdEV4dGVuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHB1YmxpYyBhY3R1YWw/OiBhbnksIHB1YmxpYyBleHBlY3RlZD86IGFueSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gSmVzdEV4dGVuZFBsdWdpbihleHBlY3RzOiBNYXRjaGVyc09iamVjdCk6IENoYWlQbHVnaW4ge1xuICByZXR1cm4gKGMsIHV0aWxzKSA9PiB7XG4gICAgT2JqZWN0LmVudHJpZXMoZXhwZWN0cykuZm9yRWFjaCgoW2V4cGVjdEFzc2VydGlvbk5hbWUsIGV4cGVjdEFzc2VydGlvbl0pID0+IHtcbiAgICAgIGZ1bmN0aW9uIGV4cGVjdFN5bmNXcmFwcGVyKHRoaXM6IENoYWkuQXNzZXJ0aW9uU3RhdGljICYgQ2hhaS5Bc3NlcnRpb24sIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdGUsIGlzTm90LCBvYmogfSA9IGdldE1hdGNoZXJTdGF0ZSh0aGlzKVxuXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgYXJncyB3YW50aW5nIHR1cGxlXG4gICAgICAgIGNvbnN0IHsgcGFzcywgbWVzc2FnZSwgYWN0dWFsLCBleHBlY3RlZCB9ID0gZXhwZWN0QXNzZXJ0aW9uLmNhbGwoc3RhdGUsIG9iaiwgLi4uYXJncykgYXMgU3luY0V4cGVjdGF0aW9uUmVzdWx0XG5cbiAgICAgICAgaWYgKChwYXNzICYmIGlzTm90KSB8fCAoIXBhc3MgJiYgIWlzTm90KSlcbiAgICAgICAgICB0aHJvdyBuZXcgSmVzdEV4dGVuZEVycm9yKG1lc3NhZ2UoKSwgYWN0dWFsLCBleHBlY3RlZClcbiAgICAgIH1cblxuICAgICAgYXN5bmMgZnVuY3Rpb24gZXhwZWN0QXN5bmNXcmFwcGVyKHRoaXM6IENoYWkuQXNzZXJ0aW9uU3RhdGljICYgQ2hhaS5Bc3NlcnRpb24sIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdGUsIGlzTm90LCBvYmogfSA9IGdldE1hdGNoZXJTdGF0ZSh0aGlzKVxuXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgYXJncyB3YW50aW5nIHR1cGxlXG4gICAgICAgIGNvbnN0IHsgcGFzcywgbWVzc2FnZSwgYWN0dWFsLCBleHBlY3RlZCB9ID0gYXdhaXQgZXhwZWN0QXNzZXJ0aW9uLmNhbGwoc3RhdGUsIG9iaiwgLi4uYXJncykgYXMgU3luY0V4cGVjdGF0aW9uUmVzdWx0XG5cbiAgICAgICAgaWYgKChwYXNzICYmIGlzTm90KSB8fCAoIXBhc3MgJiYgIWlzTm90KSlcbiAgICAgICAgICB0aHJvdyBuZXcgSmVzdEV4dGVuZEVycm9yKG1lc3NhZ2UoKSwgYWN0dWFsLCBleHBlY3RlZClcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwZWN0QXNzZXJ0aW9uV3JhcHBlciA9IGlzQXN5bmNGdW5jdGlvbihleHBlY3RBc3NlcnRpb24pID8gZXhwZWN0QXN5bmNXcmFwcGVyIDogZXhwZWN0U3luY1dyYXBwZXJcblxuICAgICAgdXRpbHMuYWRkTWV0aG9kKGNoYWkuQXNzZXJ0aW9uLnByb3RvdHlwZSwgZXhwZWN0QXNzZXJ0aW9uTmFtZSwgZXhwZWN0QXNzZXJ0aW9uV3JhcHBlcilcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBKZXN0RXh0ZW5kOiBDaGFpUGx1Z2luID0gKGNoYWksIHV0aWxzKSA9PiB7XG4gIHV0aWxzLmFkZE1ldGhvZChjaGFpLmV4cGVjdCwgJ2V4dGVuZCcsIChleHBlY3RzOiBNYXRjaGVyc09iamVjdCkgPT4ge1xuICAgIGNoYWkudXNlKEplc3RFeHRlbmRQbHVnaW4oZXhwZWN0cykpXG4gIH0pXG59XG4iLCJpbXBvcnQgKiBhcyBtYXRjaGVyVXRpbHMgZnJvbSAnLi9qZXN0LW1hdGNoZXItdXRpbHMnXG5cbmltcG9ydCB7IGVxdWFscywgaXNBIH0gZnJvbSAnLi9qZXN0LXV0aWxzJ1xuaW1wb3J0IHR5cGUgeyBDaGFpUGx1Z2luLCBNYXRjaGVyU3RhdGUgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEFzeW1tZXRyaWNNYXRjaGVySW50ZXJmYWNlIHtcbiAgYXN5bW1ldHJpY01hdGNoKG90aGVyOiB1bmtub3duKTogYm9vbGVhblxuICB0b1N0cmluZygpOiBzdHJpbmdcbiAgZ2V0RXhwZWN0ZWRUeXBlPygpOiBzdHJpbmdcbiAgdG9Bc3ltbWV0cmljTWF0Y2hlcj8oKTogc3RyaW5nXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBc3ltbWV0cmljTWF0Y2hlcjxcbiAgVCxcbiAgU3RhdGUgZXh0ZW5kcyBNYXRjaGVyU3RhdGUgPSBNYXRjaGVyU3RhdGUsXG4+IGltcGxlbWVudHMgQXN5bW1ldHJpY01hdGNoZXJJbnRlcmZhY2Uge1xuICAkJHR5cGVvZiA9IFN5bWJvbC5mb3IoJ2plc3QuYXN5bW1ldHJpY01hdGNoZXInKVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzYW1wbGU6IFQsIHByb3RlY3RlZCBpbnZlcnNlID0gZmFsc2UpIHt9XG5cbiAgcHJvdGVjdGVkIGdldE1hdGNoZXJDb250ZXh0KCk6IFN0YXRlIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXF1YWxzLFxuICAgICAgaXNOb3Q6IHRoaXMuaW52ZXJzZSxcbiAgICAgIHV0aWxzOiBtYXRjaGVyVXRpbHMsXG4gICAgfSBhcyBhbnlcbiAgfVxuXG4gIGFic3RyYWN0IGFzeW1tZXRyaWNNYXRjaChvdGhlcjogdW5rbm93bik6IGJvb2xlYW5cbiAgYWJzdHJhY3QgdG9TdHJpbmcoKTogc3RyaW5nXG4gIGdldEV4cGVjdGVkVHlwZT8oKTogc3RyaW5nXG4gIHRvQXN5bW1ldHJpY01hdGNoZXI/KCk6IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nQ29udGFpbmluZyBleHRlbmRzIEFzeW1tZXRyaWNNYXRjaGVyPHN0cmluZz4ge1xuICBjb25zdHJ1Y3RvcihzYW1wbGU6IHN0cmluZywgaW52ZXJzZSA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0EoJ1N0cmluZycsIHNhbXBsZSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGlzIG5vdCBhIHN0cmluZycpXG5cbiAgICBzdXBlcihzYW1wbGUsIGludmVyc2UpXG4gIH1cblxuICBhc3ltbWV0cmljTWF0Y2gob3RoZXI6IHN0cmluZykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGlzQSgnU3RyaW5nJywgb3RoZXIpICYmIG90aGVyLmluY2x1ZGVzKHRoaXMuc2FtcGxlKVxuXG4gICAgcmV0dXJuIHRoaXMuaW52ZXJzZSA/ICFyZXN1bHQgOiByZXN1bHRcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU3RyaW5nJHt0aGlzLmludmVyc2UgPyAnTm90JyA6ICcnfUNvbnRhaW5pbmdgXG4gIH1cblxuICBnZXRFeHBlY3RlZFR5cGUoKSB7XG4gICAgcmV0dXJuICdzdHJpbmcnXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFueXRoaW5nIGV4dGVuZHMgQXN5bW1ldHJpY01hdGNoZXI8dm9pZD4ge1xuICBhc3ltbWV0cmljTWF0Y2gob3RoZXI6IHVua25vd24pIHtcbiAgICByZXR1cm4gb3RoZXIgIT0gbnVsbFxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdBbnl0aGluZydcbiAgfVxuXG4gIHRvQXN5bW1ldHJpY01hdGNoZXIoKSB7XG4gICAgcmV0dXJuICdBbnl0aGluZydcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgT2JqZWN0Q29udGFpbmluZyBleHRlbmRzIEFzeW1tZXRyaWNNYXRjaGVyPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB7XG4gIGNvbnN0cnVjdG9yKHNhbXBsZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGludmVyc2UgPSBmYWxzZSkge1xuICAgIHN1cGVyKHNhbXBsZSwgaW52ZXJzZSlcbiAgfVxuXG4gIGdldFByb3RvdHlwZShvYmo6IG9iamVjdCkge1xuICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YpXG4gICAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iailcblxuICAgIGlmIChvYmouY29uc3RydWN0b3IucHJvdG90eXBlID09PSBvYmopXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcbiAgfVxuXG4gIGhhc1Byb3BlcnR5KG9iajogb2JqZWN0IHwgbnVsbCwgcHJvcGVydHk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghb2JqKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcGVydHkpKVxuICAgICAgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiB0aGlzLmhhc1Byb3BlcnR5KHRoaXMuZ2V0UHJvdG90eXBlKG9iaiksIHByb3BlcnR5KVxuICB9XG5cbiAgYXN5bW1ldHJpY01hdGNoKG90aGVyOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc2FtcGxlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYFlvdSBtdXN0IHByb3ZpZGUgYW4gb2JqZWN0IHRvICR7dGhpcy50b1N0cmluZygpfSwgbm90ICcke1xuICAgICAgICAgIHR5cGVvZiB0aGlzLnNhbXBsZVxuICAgICAgICB9Jy5gLFxuICAgICAgKVxuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB0cnVlXG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIHRoaXMuc2FtcGxlKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzUHJvcGVydHkob3RoZXIsIHByb3BlcnR5KSB8fCAhZXF1YWxzKHRoaXMuc2FtcGxlW3Byb3BlcnR5XSwgb3RoZXJbcHJvcGVydHldKSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmludmVyc2UgPyAhcmVzdWx0IDogcmVzdWx0XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYE9iamVjdCR7dGhpcy5pbnZlcnNlID8gJ05vdCcgOiAnJ31Db250YWluaW5nYFxuICB9XG5cbiAgZ2V0RXhwZWN0ZWRUeXBlKCkge1xuICAgIHJldHVybiAnb2JqZWN0J1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheUNvbnRhaW5pbmcgZXh0ZW5kcyBBc3ltbWV0cmljTWF0Y2hlcjxBcnJheTx1bmtub3duPj4ge1xuICBjb25zdHJ1Y3RvcihzYW1wbGU6IEFycmF5PHVua25vd24+LCBpbnZlcnNlID0gZmFsc2UpIHtcbiAgICBzdXBlcihzYW1wbGUsIGludmVyc2UpXG4gIH1cblxuICBhc3ltbWV0cmljTWF0Y2gob3RoZXI6IEFycmF5PHVua25vd24+KSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc2FtcGxlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYFlvdSBtdXN0IHByb3ZpZGUgYW4gYXJyYXkgdG8gJHt0aGlzLnRvU3RyaW5nKCl9LCBub3QgJyR7XG4gICAgICAgICAgdHlwZW9mIHRoaXMuc2FtcGxlXG4gICAgICAgIH0nLmAsXG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0XG4gICAgICA9IHRoaXMuc2FtcGxlLmxlbmd0aCA9PT0gMFxuICAgICAgfHwgKEFycmF5LmlzQXJyYXkob3RoZXIpXG4gICAgICAgICYmIHRoaXMuc2FtcGxlLmV2ZXJ5KGl0ZW0gPT5cbiAgICAgICAgICBvdGhlci5zb21lKGFub3RoZXIgPT4gZXF1YWxzKGl0ZW0sIGFub3RoZXIpKSxcbiAgICAgICAgKSlcblxuICAgIHJldHVybiB0aGlzLmludmVyc2UgPyAhcmVzdWx0IDogcmVzdWx0XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEFycmF5JHt0aGlzLmludmVyc2UgPyAnTm90JyA6ICcnfUNvbnRhaW5pbmdgXG4gIH1cblxuICBnZXRFeHBlY3RlZFR5cGUoKSB7XG4gICAgcmV0dXJuICdhcnJheSdcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQW55IGV4dGVuZHMgQXN5bW1ldHJpY01hdGNoZXI8YW55PiB7XG4gIGNvbnN0cnVjdG9yKHNhbXBsZTogdW5rbm93bikge1xuICAgIGlmICh0eXBlb2Ygc2FtcGxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ2FueSgpIGV4cGVjdHMgdG8gYmUgcGFzc2VkIGEgY29uc3RydWN0b3IgZnVuY3Rpb24uICdcbiAgICAgICAgICArICdQbGVhc2UgcGFzcyBvbmUgb3IgdXNlIGFueXRoaW5nKCkgdG8gbWF0Y2ggYW55IG9iamVjdC4nLFxuICAgICAgKVxuICAgIH1cbiAgICBzdXBlcihzYW1wbGUpXG4gIH1cblxuICBmbk5hbWVGb3IoZnVuYzogRnVuY3Rpb24pIHtcbiAgICBpZiAoZnVuYy5uYW1lKVxuICAgICAgcmV0dXJuIGZ1bmMubmFtZVxuXG4gICAgY29uc3QgZnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IGZ1bmN0aW9uVG9TdHJpbmdcbiAgICAgIC5jYWxsKGZ1bmMpXG4gICAgICAubWF0Y2goL14oPzphc3luYyk/XFxzKmZ1bmN0aW9uXFxzKlxcKj9cXHMqKFtcXHckXSspXFxzKlxcKC8pXG4gICAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogJzxhbm9ueW1vdXM+J1xuICB9XG5cbiAgYXN5bW1ldHJpY01hdGNoKG90aGVyOiB1bmtub3duKSB7XG4gICAgaWYgKHRoaXMuc2FtcGxlID09PSBTdHJpbmcpXG4gICAgICByZXR1cm4gdHlwZW9mIG90aGVyID09ICdzdHJpbmcnIHx8IG90aGVyIGluc3RhbmNlb2YgU3RyaW5nXG5cbiAgICBpZiAodGhpcy5zYW1wbGUgPT09IE51bWJlcilcbiAgICAgIHJldHVybiB0eXBlb2Ygb3RoZXIgPT0gJ251bWJlcicgfHwgb3RoZXIgaW5zdGFuY2VvZiBOdW1iZXJcblxuICAgIGlmICh0aGlzLnNhbXBsZSA9PT0gRnVuY3Rpb24pXG4gICAgICByZXR1cm4gdHlwZW9mIG90aGVyID09ICdmdW5jdGlvbicgfHwgb3RoZXIgaW5zdGFuY2VvZiBGdW5jdGlvblxuXG4gICAgaWYgKHRoaXMuc2FtcGxlID09PSBCb29sZWFuKVxuICAgICAgcmV0dXJuIHR5cGVvZiBvdGhlciA9PSAnYm9vbGVhbicgfHwgb3RoZXIgaW5zdGFuY2VvZiBCb29sZWFuXG5cbiAgICBpZiAodGhpcy5zYW1wbGUgPT09IEJpZ0ludClcbiAgICAgIHJldHVybiB0eXBlb2Ygb3RoZXIgPT0gJ2JpZ2ludCcgfHwgb3RoZXIgaW5zdGFuY2VvZiBCaWdJbnRcblxuICAgIGlmICh0aGlzLnNhbXBsZSA9PT0gU3ltYm9sKVxuICAgICAgcmV0dXJuIHR5cGVvZiBvdGhlciA9PSAnc3ltYm9sJyB8fCBvdGhlciBpbnN0YW5jZW9mIFN5bWJvbFxuXG4gICAgaWYgKHRoaXMuc2FtcGxlID09PSBPYmplY3QpXG4gICAgICByZXR1cm4gdHlwZW9mIG90aGVyID09ICdvYmplY3QnXG5cbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiB0aGlzLnNhbXBsZVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdBbnknXG4gIH1cblxuICBnZXRFeHBlY3RlZFR5cGUoKSB7XG4gICAgaWYgKHRoaXMuc2FtcGxlID09PSBTdHJpbmcpXG4gICAgICByZXR1cm4gJ3N0cmluZydcblxuICAgIGlmICh0aGlzLnNhbXBsZSA9PT0gTnVtYmVyKVxuICAgICAgcmV0dXJuICdudW1iZXInXG5cbiAgICBpZiAodGhpcy5zYW1wbGUgPT09IEZ1bmN0aW9uKVxuICAgICAgcmV0dXJuICdmdW5jdGlvbidcblxuICAgIGlmICh0aGlzLnNhbXBsZSA9PT0gT2JqZWN0KVxuICAgICAgcmV0dXJuICdvYmplY3QnXG5cbiAgICBpZiAodGhpcy5zYW1wbGUgPT09IEJvb2xlYW4pXG4gICAgICByZXR1cm4gJ2Jvb2xlYW4nXG5cbiAgICByZXR1cm4gdGhpcy5mbk5hbWVGb3IodGhpcy5zYW1wbGUpXG4gIH1cblxuICB0b0FzeW1tZXRyaWNNYXRjaGVyKCkge1xuICAgIHJldHVybiBgQW55PCR7dGhpcy5mbk5hbWVGb3IodGhpcy5zYW1wbGUpfT5gXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ01hdGNoaW5nIGV4dGVuZHMgQXN5bW1ldHJpY01hdGNoZXI8UmVnRXhwPiB7XG4gIGNvbnN0cnVjdG9yKHNhbXBsZTogc3RyaW5nIHwgUmVnRXhwLCBpbnZlcnNlID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzQSgnU3RyaW5nJywgc2FtcGxlKSAmJiAhaXNBKCdSZWdFeHAnLCBzYW1wbGUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBpcyBub3QgYSBTdHJpbmcgb3IgYSBSZWdFeHAnKVxuXG4gICAgc3VwZXIobmV3IFJlZ0V4cChzYW1wbGUpLCBpbnZlcnNlKVxuICB9XG5cbiAgYXN5bW1ldHJpY01hdGNoKG90aGVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXN1bHQgPSBpc0EoJ1N0cmluZycsIG90aGVyKSAmJiB0aGlzLnNhbXBsZS50ZXN0KG90aGVyKVxuXG4gICAgcmV0dXJuIHRoaXMuaW52ZXJzZSA/ICFyZXN1bHQgOiByZXN1bHRcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgU3RyaW5nJHt0aGlzLmludmVyc2UgPyAnTm90JyA6ICcnfU1hdGNoaW5nYFxuICB9XG5cbiAgZ2V0RXhwZWN0ZWRUeXBlKCkge1xuICAgIHJldHVybiAnc3RyaW5nJ1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBKZXN0QXN5bW1ldHJpY01hdGNoZXJzOiBDaGFpUGx1Z2luID0gKGNoYWksIHV0aWxzKSA9PiB7XG4gIHV0aWxzLmFkZE1ldGhvZChcbiAgICBjaGFpLmV4cGVjdCxcbiAgICAnYW55dGhpbmcnLFxuICAgICgpID0+IG5ldyBBbnl0aGluZygpLFxuICApXG5cbiAgdXRpbHMuYWRkTWV0aG9kKFxuICAgIGNoYWkuZXhwZWN0LFxuICAgICdhbnknLFxuICAgIChleHBlY3RlZDogdW5rbm93bikgPT4gbmV3IEFueShleHBlY3RlZCksXG4gIClcblxuICB1dGlscy5hZGRNZXRob2QoXG4gICAgY2hhaS5leHBlY3QsXG4gICAgJ3N0cmluZ0NvbnRhaW5pbmcnLFxuICAgIChleHBlY3RlZDogc3RyaW5nKSA9PiBuZXcgU3RyaW5nQ29udGFpbmluZyhleHBlY3RlZCksXG4gIClcblxuICB1dGlscy5hZGRNZXRob2QoXG4gICAgY2hhaS5leHBlY3QsXG4gICAgJ29iamVjdENvbnRhaW5pbmcnLFxuICAgIChleHBlY3RlZDogYW55KSA9PiBuZXcgT2JqZWN0Q29udGFpbmluZyhleHBlY3RlZCksXG4gIClcblxuICB1dGlscy5hZGRNZXRob2QoXG4gICAgY2hhaS5leHBlY3QsXG4gICAgJ2FycmF5Q29udGFpbmluZycsXG4gICAgKGV4cGVjdGVkOiBhbnkpID0+IG5ldyBBcnJheUNvbnRhaW5pbmcoZXhwZWN0ZWQpLFxuICApXG5cbiAgdXRpbHMuYWRkTWV0aG9kKFxuICAgIGNoYWkuZXhwZWN0LFxuICAgICdzdHJpbmdNYXRjaGluZycsXG4gICAgKGV4cGVjdGVkOiBhbnkpID0+IG5ldyBTdHJpbmdNYXRjaGluZyhleHBlY3RlZCksXG4gIClcblxuICAvLyBkZWZpbmVQcm9wZXJ0eSBkb2VzIG5vdCB3b3JrXG4gIDsoY2hhaS5leHBlY3QgYXMgYW55KS5ub3QgPSB7XG4gICAgc3RyaW5nQ29udGFpbmluZzogKGV4cGVjdGVkOiBzdHJpbmcpID0+IG5ldyBTdHJpbmdDb250YWluaW5nKGV4cGVjdGVkLCB0cnVlKSxcbiAgICBvYmplY3RDb250YWluaW5nOiAoZXhwZWN0ZWQ6IGFueSkgPT4gbmV3IE9iamVjdENvbnRhaW5pbmcoZXhwZWN0ZWQsIHRydWUpLFxuICAgIGFycmF5Q29udGFpbmluZzogKGV4cGVjdGVkOiB1bmtub3duW10pID0+IG5ldyBBcnJheUNvbnRhaW5pbmcoZXhwZWN0ZWQsIHRydWUpLFxuICAgIHN0cmluZ01hdGNoaW5nOiAoZXhwZWN0ZWQ6IHN0cmluZyB8IFJlZ0V4cCkgPT4gbmV3IFN0cmluZ01hdGNoaW5nKGV4cGVjdGVkLCB0cnVlKSxcbiAgfVxufVxuIiwiaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSdcbmltcG9ydCBTdWJzZXQgZnJvbSAnY2hhaS1zdWJzZXQnXG5pbXBvcnQgeyBTbmFwc2hvdFBsdWdpbiB9IGZyb20gJy4uL3NuYXBzaG90L2NoYWknXG5pbXBvcnQgeyBKZXN0RXh0ZW5kIH0gZnJvbSAnLi9qZXN0LWV4dGVuZCdcbmltcG9ydCB7IEplc3RDaGFpRXhwZWN0IH0gZnJvbSAnLi9qZXN0LWV4cGVjdCdcbmltcG9ydCB7IEplc3RBc3ltbWV0cmljTWF0Y2hlcnMgfSBmcm9tICcuL2plc3QtYXN5bW1ldHJpYy1tYXRjaGVycydcblxubGV0IGluc3RhbGxlZCA9IGZhbHNlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0dXBDaGFpKCkge1xuICBpZiAoaW5zdGFsbGVkKVxuICAgIHJldHVyblxuXG4gIGNoYWkudXNlKEplc3RFeHRlbmQpXG4gIGNoYWkudXNlKEplc3RDaGFpRXhwZWN0KVxuICBjaGFpLnVzZShTdWJzZXQpXG4gIGNoYWkudXNlKFNuYXBzaG90UGx1Z2luKVxuICBjaGFpLnVzZShKZXN0QXN5bW1ldHJpY01hdGNoZXJzKVxuICBpbnN0YWxsZWQgPSB0cnVlXG59XG4iLCJpbXBvcnQgeyBDb25zb2xlIH0gZnJvbSAnY29uc29sZSdcbmltcG9ydCB7IFdyaXRhYmxlIH0gZnJvbSAnc3RyZWFtJ1xuaW1wb3J0IHsgZW52aXJvbm1lbnRzIH0gZnJvbSAnLi4vaW50ZWdyYXRpb25zL2VudidcbmltcG9ydCB7IHNldHVwQ2hhaSB9IGZyb20gJy4uL2ludGVncmF0aW9ucy9jaGFpL3NldHVwJ1xuaW1wb3J0IHR5cGUgeyBSZXNvbHZlZENvbmZpZyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgdG9BcnJheSB9IGZyb20gJy4uL3V0aWxzJ1xuaW1wb3J0IHsgcnBjIH0gZnJvbSAnLi9ycGMnXG5cbmxldCBnbG9iYWxTZXR1cCA9IGZhbHNlXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0dXBHbG9iYWxFbnYoY29uZmlnOiBSZXNvbHZlZENvbmZpZykge1xuICAvLyBzaG91bGQgYmUgcmVkZWNsYXJlZCBmb3IgZWFjaCB0ZXN0XG4gIC8vIGlmIHJ1biB3aXRoIFwidGhyZWFkczogZmFsc2VcIlxuICBzZXR1cERlZmluZXMoY29uZmlnLmRlZmluZXMpXG5cbiAgaWYgKGdsb2JhbFNldHVwKVxuICAgIHJldHVyblxuXG4gIGdsb2JhbFNldHVwID0gdHJ1ZVxuXG4gIHNldHVwQ29uc29sZUxvZ1NweSgpXG4gIGF3YWl0IHNldHVwQ2hhaSgpXG5cbiAgaWYgKGNvbmZpZy5nbG9iYWxzKVxuICAgIChhd2FpdCBpbXBvcnQoJy4uL2ludGVncmF0aW9ucy9nbG9iYWxzJykpLnJlZ2lzdGVyQXBpR2xvYmFsbHkoKVxufVxuXG5mdW5jdGlvbiBzZXR1cERlZmluZXMoZGVmaW5lczogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICBmb3IgKGNvbnN0IGtleSBpbiBkZWZpbmVzKVxuICAgIChnbG9iYWxUaGlzIGFzIGFueSlba2V5XSA9IGRlZmluZXNba2V5XVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBDb25zb2xlTG9nU3B5KCkge1xuICBjb25zdCBzdGRvdXQgPSBuZXcgV3JpdGFibGUoe1xuICAgIHdyaXRlKGRhdGEsIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICAgICAgcnBjKCkub25Vc2VyQ29uc29sZUxvZyh7XG4gICAgICAgIHR5cGU6ICdzdGRvdXQnLFxuICAgICAgICBjb250ZW50OiBTdHJpbmcoZGF0YSksXG4gICAgICAgIHRhc2tJZDogX192aXRlc3Rfd29ya2VyX18uY3VycmVudD8uaWQsXG4gICAgICAgIHRpbWU6IERhdGUubm93KCksXG4gICAgICB9KVxuICAgICAgY2FsbGJhY2soKVxuICAgIH0sXG4gIH0pXG4gIGNvbnN0IHN0ZGVyciA9IG5ldyBXcml0YWJsZSh7XG4gICAgd3JpdGUoZGF0YSwgZW5jb2RpbmcsIGNhbGxiYWNrKSB7XG4gICAgICBycGMoKS5vblVzZXJDb25zb2xlTG9nKHtcbiAgICAgICAgdHlwZTogJ3N0ZGVycicsXG4gICAgICAgIGNvbnRlbnQ6IFN0cmluZyhkYXRhKSxcbiAgICAgICAgdGFza0lkOiBfX3ZpdGVzdF93b3JrZXJfXy5jdXJyZW50Py5pZCxcbiAgICAgICAgdGltZTogRGF0ZS5ub3coKSxcbiAgICAgIH0pXG4gICAgICBjYWxsYmFjaygpXG4gICAgfSxcbiAgfSlcbiAgZ2xvYmFsVGhpcy5jb25zb2xlID0gbmV3IENvbnNvbGUoe1xuICAgIHN0ZG91dCxcbiAgICBzdGRlcnIsXG4gICAgY29sb3JNb2RlOiB0cnVlLFxuICAgIGdyb3VwSW5kZW50YXRpb246IDIsXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3aXRoRW52KFxuICBuYW1lOiBSZXNvbHZlZENvbmZpZ1snZW52aXJvbm1lbnQnXSxcbiAgb3B0aW9uczogUmVzb2x2ZWRDb25maWdbJ2Vudmlyb25tZW50T3B0aW9ucyddLFxuICBmbjogKCkgPT4gUHJvbWlzZTx2b2lkPixcbikge1xuICBjb25zdCBlbnYgPSBhd2FpdCBlbnZpcm9ubWVudHNbbmFtZV0uc2V0dXAoZ2xvYmFsVGhpcywgb3B0aW9ucylcbiAgdHJ5IHtcbiAgICBhd2FpdCBmbigpXG4gIH1cbiAgZmluYWxseSB7XG4gICAgYXdhaXQgZW52LnRlYXJkb3duKGdsb2JhbFRoaXMpXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blNldHVwRmlsZXMoY29uZmlnOiBSZXNvbHZlZENvbmZpZykge1xuICBjb25zdCBmaWxlcyA9IHRvQXJyYXkoY29uZmlnLnNldHVwRmlsZXMpXG4gIGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGZpbGVzLm1hcChhc3luYyhmaWxlKSA9PiB7XG4gICAgICBfX3ZpdGVzdF93b3JrZXJfXy5tb2R1bGVDYWNoZS5kZWxldGUoZmlsZSlcbiAgICAgIGF3YWl0IGltcG9ydChmaWxlKVxuICAgIH0pLFxuICApXG59XG4iLCJpbXBvcnQgeyBmb3JtYXQgfSBmcm9tICd1dGlsJ1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi4vaW50ZWdyYXRpb25zL2NoYWkvamVzdC1tYXRjaGVyLXV0aWxzJ1xuXG5jb25zdCBPQkpFQ1RfUFJPVE8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoe30pXG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfV29ya2Vyc19BUEkvU3RydWN0dXJlZF9jbG9uZV9hbGdvcml0aG1cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVFcnJvcih2YWw6IGFueSwgc2VlbiA9IG5ldyBXZWFrTWFwKCkpOiBhbnkge1xuICBpZiAoIXZhbCB8fCB0eXBlb2YgdmFsID09PSAnc3RyaW5nJylcbiAgICByZXR1cm4gdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiBgRnVuY3Rpb248JHt2YWwubmFtZX0+YFxuICBpZiAodHlwZW9mIHZhbCAhPT0gJ29iamVjdCcpXG4gICAgcmV0dXJuIHZhbFxuICBpZiAodmFsIGluc3RhbmNlb2YgUHJvbWlzZSB8fCAndGhlbicgaW4gdmFsIHx8ICh2YWwuY29uc3RydWN0b3IgJiYgdmFsLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gJ0FzeW5jRnVuY3Rpb24nKSlcbiAgICByZXR1cm4gJ1Byb21pc2UnXG4gIGlmICh0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsIGluc3RhbmNlb2YgRWxlbWVudClcbiAgICByZXR1cm4gdmFsLnRhZ05hbWVcbiAgaWYgKHR5cGVvZiB2YWwuYXN5bW1ldHJpY01hdGNoID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiBgJHt2YWwudG9TdHJpbmcoKX0gJHtmb3JtYXQodmFsLnNhbXBsZSl9YFxuXG4gIGlmIChzZWVuLmhhcyh2YWwpKVxuICAgIHJldHVybiBzZWVuLmdldCh2YWwpXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIGNvbnN0IGNsb25lOiBhbnlbXSA9IG5ldyBBcnJheSh2YWwubGVuZ3RoKVxuICAgIHNlZW4uc2V0KHZhbCwgY2xvbmUpXG4gICAgdmFsLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgIGNsb25lW2ldID0gc2VyaWFsaXplRXJyb3IoZSwgc2VlbilcbiAgICB9KVxuICAgIHJldHVybiBjbG9uZVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE9iamVjdHMgd2l0aCBgRXJyb3JgIGNvbnN0cnVjdG9ycyBhcHBlYXIgdG8gY2F1c2UgcHJvYmxlbXMgZHVyaW5nIHdvcmtlciBjb21tdW5pY2F0aW9uXG4gICAgLy8gdXNpbmcgYE1lc3NhZ2VQb3J0YCwgc28gdGhlIHNlcmlhbGl6ZWQgZXJyb3Igb2JqZWN0IGlzIGJlaW5nIHJlY3JlYXRlZCBhcyBwbGFpbiBvYmplY3QuXG4gICAgY29uc3QgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgc2Vlbi5zZXQodmFsLCBjbG9uZSlcblxuICAgIGxldCBvYmogPSB2YWxcbiAgICB3aGlsZSAob2JqICYmIG9iaiAhPT0gT0JKRUNUX1BST1RPKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoIShrZXkgaW4gY2xvbmUpKVxuICAgICAgICAgIGNsb25lW2tleV0gPSBzZXJpYWxpemVFcnJvcihvYmpba2V5XSwgc2VlbilcbiAgICAgIH0pXG4gICAgICBvYmogPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKVxuICAgIH1cbiAgICByZXR1cm4gY2xvbmVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0Vycm9yKGVycjogYW55KSB7XG4gIGlmICghZXJyKVxuICAgIHJldHVybiBlcnJcbiAgLy8gc3RhY2sgaXMgbm90IHNlcmlhbGl6ZWQgaW4gd29ya2VyIGNvbW11bmljYXRpb25cbiAgLy8gd2Ugc3RyaW5naWZ5IGl0IGZpcnN0XG4gIGlmIChlcnIuc3RhY2spXG4gICAgZXJyLnN0YWNrU3RyID0gU3RyaW5nKGVyci5zdGFjaylcbiAgaWYgKGVyci5uYW1lKVxuICAgIGVyci5uYW1lU3RyID0gU3RyaW5nKGVyci5uYW1lKVxuXG4gIGlmICh0eXBlb2YgZXJyLmV4cGVjdGVkICE9PSAnc3RyaW5nJylcbiAgICBlcnIuZXhwZWN0ZWQgPSBzdHJpbmdpZnkoZXJyLmV4cGVjdGVkKVxuICBpZiAodHlwZW9mIGVyci5hY3R1YWwgIT09ICdzdHJpbmcnKVxuICAgIGVyci5hY3R1YWwgPSBzdHJpbmdpZnkoZXJyLmFjdHVhbClcblxuICB0cnkge1xuICAgIHJldHVybiBzZXJpYWxpemVFcnJvcihlcnIpXG4gIH1cbiAgY2F0Y2ggKGU6IGFueSkge1xuICAgIHJldHVybiBzZXJpYWxpemVFcnJvcihuZXcgRXJyb3IoYEZhaWxlZCB0byBmdWxseSBzZXJpYWxpemUgZXJyb3I6ICR7ZT8ubWVzc2FnZX0uXFxuSW5uZXIgZXJyb3IgbWVzc2FnZTogJHtlcnI/Lm1lc3NhZ2V9YCkpXG4gIH1cbn1cbiIsImltcG9ydCB7IGNyZWF0ZUhhc2ggfSBmcm9tICdjcnlwdG8nXG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gJ3BhdGhlJ1xuaW1wb3J0IHR5cGUgeyBGaWxlLCBSZXNvbHZlZENvbmZpZywgU3VpdGUsIFRhc2tCYXNlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBjbGVhckNvbnRleHQsIGRlZmF1bHRTdWl0ZSB9IGZyb20gJy4vc3VpdGUnXG5pbXBvcnQgeyBnZXRIb29rcywgc2V0SG9va3MgfSBmcm9tICcuL21hcCdcbmltcG9ydCB7IHByb2Nlc3NFcnJvciB9IGZyb20gJy4vZXJyb3InXG5pbXBvcnQgeyBjb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0J1xuaW1wb3J0IHsgcnVuU2V0dXBGaWxlcyB9IGZyb20gJy4vc2V0dXAnXG5cbmZ1bmN0aW9uIGhhc2goc3RyOiBzdHJpbmcsIGxlbmd0aCA9IDEwKSB7XG4gIHJldHVybiBjcmVhdGVIYXNoKCdtZDUnKVxuICAgIC51cGRhdGUoc3RyKVxuICAgIC5kaWdlc3QoJ2hleCcpXG4gICAgLnNsaWNlKDAsIGxlbmd0aClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbGxlY3RUZXN0cyhwYXRoczogc3RyaW5nW10sIGNvbmZpZzogUmVzb2x2ZWRDb25maWcpIHtcbiAgY29uc3QgZmlsZXM6IEZpbGVbXSA9IFtdXG5cbiAgZm9yIChjb25zdCBmaWxlcGF0aCBvZiBwYXRocykge1xuICAgIGNvbnN0IHBhdGggPSByZWxhdGl2ZShjb25maWcucm9vdCwgZmlsZXBhdGgpXG4gICAgY29uc3QgZmlsZTogRmlsZSA9IHtcbiAgICAgIGlkOiBoYXNoKHBhdGgpLFxuICAgICAgbmFtZTogcGF0aCxcbiAgICAgIHR5cGU6ICdzdWl0ZScsXG4gICAgICBtb2RlOiAncnVuJyxcbiAgICAgIGZpbGVwYXRoLFxuICAgICAgdGFza3M6IFtdLFxuICAgIH1cblxuICAgIGNsZWFyQ29udGV4dCgpXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHJ1blNldHVwRmlsZXMoY29uZmlnKVxuICAgICAgYXdhaXQgaW1wb3J0KGZpbGVwYXRoKVxuXG4gICAgICBjb25zdCBkZWZhdWx0VGFza3MgPSBhd2FpdCBkZWZhdWx0U3VpdGUuY29sbGVjdChmaWxlKVxuXG4gICAgICBzZXRIb29rcyhmaWxlLCBnZXRIb29rcyhkZWZhdWx0VGFza3MpKVxuXG4gICAgICBmb3IgKGNvbnN0IGMgb2YgWy4uLmRlZmF1bHRUYXNrcy50YXNrcywgLi4uY29udGV4dC50YXNrc10pIHtcbiAgICAgICAgaWYgKGMudHlwZSA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgZmlsZS50YXNrcy5wdXNoKGMpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYy50eXBlID09PSAnc3VpdGUnKSB7XG4gICAgICAgICAgZmlsZS50YXNrcy5wdXNoKGMpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgICAgICAgIGNvbnN0IHN1aXRlID0gYXdhaXQgYy5jb2xsZWN0KGZpbGUpXG4gICAgICAgICAgZmlsZS5jb2xsZWN0RHVyYXRpb24gPSBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG4gICAgICAgICAgaWYgKHN1aXRlLm5hbWUgfHwgc3VpdGUudGFza3MubGVuZ3RoKVxuICAgICAgICAgICAgZmlsZS50YXNrcy5wdXNoKHN1aXRlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBmaWxlLnJlc3VsdCA9IHtcbiAgICAgICAgc3RhdGU6ICdmYWlsJyxcbiAgICAgICAgZXJyb3I6IHByb2Nlc3NFcnJvcihlKSxcbiAgICAgIH1cbiAgICAgIC8vIG5vdCBzdXJlIHRoeSwgdGhpcyB0aGlzIGxpbmUgaXMgbmVlZGVkIHRvIHRyaWdnZXIgdGhlIGVycm9yXG4gICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFwwJylcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVIYXNoKGZpbGUpXG5cbiAgICBjb25zdCBoYXNPbmx5VGFza3MgPSBzb21lVGFza3NBcmVPbmx5KGZpbGUpXG4gICAgaW50ZXJwcmV0VGFza01vZGVzKGZpbGUsIGNvbmZpZy50ZXN0TmFtZVBhdHRlcm4sIGhhc09ubHlUYXNrcywgZmFsc2UsIGNvbmZpZy5hbGxvd09ubHkpXG5cbiAgICBmaWxlcy5wdXNoKGZpbGUpXG4gIH1cblxuICByZXR1cm4gZmlsZXNcbn1cblxuLyoqXG4gKiBJZiBhbnkgdGFza3MgYmVlbiBtYXJrZWQgYXMgYG9ubHlgLCBtYXJrIGFsbCBvdGhlciB0YXNrcyBhcyBgc2tpcGAuXG4gKi9cbmZ1bmN0aW9uIGludGVycHJldFRhc2tNb2RlcyhzdWl0ZTogU3VpdGUsIG5hbWVQYXR0ZXJuPzogc3RyaW5nIHwgUmVnRXhwLCBvbmx5TW9kZT86IGJvb2xlYW4sIHBhcmVudElzT25seT86IGJvb2xlYW4sIGFsbG93T25seT86IGJvb2xlYW4pIHtcbiAgY29uc3Qgc3VpdGVJc09ubHkgPSBwYXJlbnRJc09ubHkgfHwgc3VpdGUubW9kZSA9PT0gJ29ubHknXG5cbiAgc3VpdGUudGFza3MuZm9yRWFjaCgodCkgPT4ge1xuICAgIC8vIENoZWNrIGlmIGVpdGhlciB0aGUgcGFyZW50IHN1aXRlIG9yIHRoZSB0YXNrIGl0c2VsZiBhcmUgbWFya2VkIGFzIGluY2x1ZGVkXG4gICAgY29uc3QgaW5jbHVkZVRhc2sgPSBzdWl0ZUlzT25seSB8fCB0Lm1vZGUgPT09ICdvbmx5J1xuICAgIGlmIChvbmx5TW9kZSkge1xuICAgICAgaWYgKHQudHlwZSA9PT0gJ3N1aXRlJyAmJiAoaW5jbHVkZVRhc2sgfHwgc29tZVRhc2tzQXJlT25seSh0KSkpIHtcbiAgICAgICAgLy8gRG9uJ3Qgc2tpcCB0aGlzIHN1aXRlXG4gICAgICAgIGlmICh0Lm1vZGUgPT09ICdvbmx5Jykge1xuICAgICAgICAgIGNoZWNrQWxsb3dPbmx5KHQsIGFsbG93T25seSlcbiAgICAgICAgICB0Lm1vZGUgPSAncnVuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0Lm1vZGUgPT09ICdydW4nICYmICFpbmNsdWRlVGFzaykgeyB0Lm1vZGUgPSAnc2tpcCcgfVxuICAgICAgZWxzZSBpZiAodC5tb2RlID09PSAnb25seScpIHtcbiAgICAgICAgY2hlY2tBbGxvd09ubHkodCwgYWxsb3dPbmx5KVxuICAgICAgICB0Lm1vZGUgPSAncnVuJ1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodC50eXBlID09PSAndGVzdCcpIHtcbiAgICAgIGlmIChuYW1lUGF0dGVybiAmJiAhZ2V0VGFza0Z1bGxOYW1lKHQpLm1hdGNoKG5hbWVQYXR0ZXJuKSlcbiAgICAgICAgdC5tb2RlID0gJ3NraXAnXG4gICAgfVxuICAgIGVsc2UgaWYgKHQudHlwZSA9PT0gJ3N1aXRlJykge1xuICAgICAgaWYgKHQubW9kZSA9PT0gJ3NraXAnKVxuICAgICAgICBza2lwQWxsVGFza3ModClcbiAgICAgIGVsc2VcbiAgICAgICAgaW50ZXJwcmV0VGFza01vZGVzKHQsIG5hbWVQYXR0ZXJuLCBvbmx5TW9kZSwgaW5jbHVkZVRhc2ssIGFsbG93T25seSlcbiAgICB9XG4gIH0pXG5cbiAgLy8gaWYgYWxsIHN1YnRhc2tzIGFyZSBza2lwcGVkLCBtYXJrIGFzIHNraXBcbiAgaWYgKHN1aXRlLm1vZGUgPT09ICdydW4nKSB7XG4gICAgaWYgKHN1aXRlLnRhc2tzLmxlbmd0aCAmJiBzdWl0ZS50YXNrcy5ldmVyeShpID0+IGkubW9kZSAhPT0gJ3J1bicpKVxuICAgICAgc3VpdGUubW9kZSA9ICdza2lwJ1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRhc2tGdWxsTmFtZSh0YXNrOiBUYXNrQmFzZSk6IHN0cmluZyB7XG4gIHJldHVybiBgJHt0YXNrLnN1aXRlID8gYCR7Z2V0VGFza0Z1bGxOYW1lKHRhc2suc3VpdGUpfSBgIDogJyd9JHt0YXNrLm5hbWV9YFxufVxuXG5mdW5jdGlvbiBzb21lVGFza3NBcmVPbmx5KHN1aXRlOiBTdWl0ZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3VpdGUudGFza3Muc29tZSh0ID0+IHQubW9kZSA9PT0gJ29ubHknIHx8ICh0LnR5cGUgPT09ICdzdWl0ZScgJiYgc29tZVRhc2tzQXJlT25seSh0KSkpXG59XG5cbmZ1bmN0aW9uIHNraXBBbGxUYXNrcyhzdWl0ZTogU3VpdGUpIHtcbiAgc3VpdGUudGFza3MuZm9yRWFjaCgodCkgPT4ge1xuICAgIGlmICh0Lm1vZGUgPT09ICdydW4nKSB7XG4gICAgICB0Lm1vZGUgPSAnc2tpcCdcbiAgICAgIGlmICh0LnR5cGUgPT09ICdzdWl0ZScpXG4gICAgICAgIHNraXBBbGxUYXNrcyh0KVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gY2hlY2tBbGxvd09ubHkodGFzazogVGFza0Jhc2UsIGFsbG93T25seT86IGJvb2xlYW4pIHtcbiAgaWYgKGFsbG93T25seSkgcmV0dXJuXG4gIHRhc2sucmVzdWx0ID0ge1xuICAgIHN0YXRlOiAnZmFpbCcsXG4gICAgZXJyb3I6IHByb2Nlc3NFcnJvcihuZXcgRXJyb3IoJ1tWaXRlc3RdIFVuZXhwZWN0ZWQgLm9ubHkgbW9kaWZpZXIuIFJlbW92ZSBpdCBvciBwYXNzIC0tYWxsb3dPbmx5IGFyZ3VtZW50IHRvIGJ5cGFzcyB0aGlzIGVycm9yJykpLFxuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUhhc2gocGFyZW50OiBTdWl0ZSkge1xuICBwYXJlbnQudGFza3MuZm9yRWFjaCgodCwgaWR4KSA9PiB7XG4gICAgdC5pZCA9IGAke3BhcmVudC5pZH1fJHtpZHh9YFxuICAgIGlmICh0LnR5cGUgPT09ICdzdWl0ZScpXG4gICAgICBjYWxjdWxhdGVIYXNoKHQpXG4gIH0pXG59XG4iLCJpbXBvcnQgeyBwZXJmb3JtYW5jZSB9IGZyb20gJ3BlcmZfaG9va3MnXG5pbXBvcnQgdHlwZSB7IEZpbGUsIEhvb2tMaXN0ZW5lciwgUmVzb2x2ZWRDb25maWcsIFN1aXRlLCBTdWl0ZUhvb2tzLCBUYXNrLCBUYXNrUmVzdWx0LCBUZXN0IH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyB2aSB9IGZyb20gJy4uL2ludGVncmF0aW9ucy92aSdcbmltcG9ydCB7IGdldFNuYXBzaG90Q2xpZW50IH0gZnJvbSAnLi4vaW50ZWdyYXRpb25zL3NuYXBzaG90L2NoYWknXG5pbXBvcnQgeyBnZXRGdWxsTmFtZSwgaGFzRmFpbGVkLCBoYXNUZXN0cywgcGFydGl0aW9uU3VpdGVDaGlsZHJlbiB9IGZyb20gJy4uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0U3RhdGUsIHNldFN0YXRlIH0gZnJvbSAnLi4vaW50ZWdyYXRpb25zL2NoYWkvamVzdC1leHBlY3QnXG5pbXBvcnQgeyB0YWtlQ292ZXJhZ2UgfSBmcm9tICcuLi9pbnRlZ3JhdGlvbnMvY292ZXJhZ2UnXG5pbXBvcnQgeyBnZXRGbiwgZ2V0SG9va3MgfSBmcm9tICcuL21hcCdcbmltcG9ydCB7IHJwYyB9IGZyb20gJy4vcnBjJ1xuaW1wb3J0IHsgY29sbGVjdFRlc3RzIH0gZnJvbSAnLi9jb2xsZWN0J1xuaW1wb3J0IHsgcHJvY2Vzc0Vycm9yIH0gZnJvbSAnLi9lcnJvcidcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbGxTdWl0ZUhvb2s8VCBleHRlbmRzIGtleW9mIFN1aXRlSG9va3M+KHN1aXRlOiBTdWl0ZSwgbmFtZTogVCwgYXJnczogU3VpdGVIb29rc1tUXVswXSBleHRlbmRzIEhvb2tMaXN0ZW5lcjxpbmZlciBBPiA/IEEgOiBuZXZlcikge1xuICBpZiAobmFtZSA9PT0gJ2JlZm9yZUVhY2gnICYmIHN1aXRlLnN1aXRlKVxuICAgIGF3YWl0IGNhbGxTdWl0ZUhvb2soc3VpdGUuc3VpdGUsIG5hbWUsIGFyZ3MpXG5cbiAgYXdhaXQgUHJvbWlzZS5hbGwoZ2V0SG9va3Moc3VpdGUpW25hbWVdLm1hcChmbiA9PiBmbiguLi4oYXJncyBhcyBhbnkpKSkpXG5cbiAgaWYgKG5hbWUgPT09ICdhZnRlckVhY2gnICYmIHN1aXRlLnN1aXRlKVxuICAgIGF3YWl0IGNhbGxTdWl0ZUhvb2soc3VpdGUuc3VpdGUsIG5hbWUsIGFyZ3MpXG59XG5cbmNvbnN0IHBhY2tzID0gbmV3IE1hcDxzdHJpbmcsIFRhc2tSZXN1bHR8dW5kZWZpbmVkPigpXG5sZXQgdXBkYXRlVGltZXI6IGFueVxubGV0IHByZXZpb3VzVXBkYXRlOiBQcm9taXNlPHZvaWQ+fHVuZGVmaW5lZFxuXG5mdW5jdGlvbiB1cGRhdGVUYXNrKHRhc2s6IFRhc2spIHtcbiAgcGFja3Muc2V0KHRhc2suaWQsIHRhc2sucmVzdWx0KVxuXG4gIGNsZWFyVGltZW91dCh1cGRhdGVUaW1lcilcbiAgdXBkYXRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBwcmV2aW91c1VwZGF0ZSA9IHNlbmRUYXNrc1VwZGF0ZSgpXG4gIH0sIDEwKVxufVxuXG5hc3luYyBmdW5jdGlvbiBzZW5kVGFza3NVcGRhdGUoKSB7XG4gIGNsZWFyVGltZW91dCh1cGRhdGVUaW1lcilcbiAgYXdhaXQgcHJldmlvdXNVcGRhdGVcblxuICBpZiAocGFja3Muc2l6ZSkge1xuICAgIGNvbnN0IHAgPSBycGMoKS5vblRhc2tVcGRhdGUoQXJyYXkuZnJvbShwYWNrcykpXG4gICAgcGFja3MuY2xlYXIoKVxuICAgIHJldHVybiBwXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blRlc3QodGVzdDogVGVzdCkge1xuICBpZiAodGVzdC5tb2RlICE9PSAncnVuJylcbiAgICByZXR1cm5cblxuICBpZiAodGVzdC5yZXN1bHQ/LnN0YXRlID09PSAnZmFpbCcpIHtcbiAgICB1cGRhdGVUYXNrKHRlc3QpXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgdGVzdC5yZXN1bHQgPSB7XG4gICAgc3RhdGU6ICdydW4nLFxuICB9XG4gIHVwZGF0ZVRhc2sodGVzdClcblxuICBjbGVhck1vZHVsZU1vY2tzKClcblxuICBnZXRTbmFwc2hvdENsaWVudCgpLnNldFRlc3QodGVzdClcblxuICBfX3ZpdGVzdF93b3JrZXJfXy5jdXJyZW50ID0gdGVzdFxuXG4gIHRyeSB7XG4gICAgYXdhaXQgY2FsbFN1aXRlSG9vayh0ZXN0LnN1aXRlLCAnYmVmb3JlRWFjaCcsIFt0ZXN0LCB0ZXN0LnN1aXRlXSlcbiAgICBzZXRTdGF0ZSh7XG4gICAgICBhc3NlcnRpb25DYWxsczogMCxcbiAgICAgIGlzRXhwZWN0aW5nQXNzZXJ0aW9uczogZmFsc2UsXG4gICAgICBpc0V4cGVjdGluZ0Fzc2VydGlvbnNFcnJvcjogbnVsbCxcbiAgICAgIGV4cGVjdGVkQXNzZXJ0aW9uc051bWJlcjogbnVsbCxcbiAgICAgIGV4cGVjdGVkQXNzZXJ0aW9uc051bWJlckVycm9yOiBudWxsLFxuICAgICAgdGVzdFBhdGg6IHRlc3Quc3VpdGUuZmlsZT8uZmlsZXBhdGgsXG4gICAgICBjdXJyZW50VGVzdE5hbWU6IGdldEZ1bGxOYW1lKHRlc3QpLFxuICAgIH0pXG4gICAgYXdhaXQgZ2V0Rm4odGVzdCkoKVxuICAgIGNvbnN0IHsgYXNzZXJ0aW9uQ2FsbHMsIGV4cGVjdGVkQXNzZXJ0aW9uc051bWJlciwgZXhwZWN0ZWRBc3NlcnRpb25zTnVtYmVyRXJyb3IsIGlzRXhwZWN0aW5nQXNzZXJ0aW9ucywgaXNFeHBlY3RpbmdBc3NlcnRpb25zRXJyb3IgfSA9IGdldFN0YXRlKClcbiAgICBpZiAoZXhwZWN0ZWRBc3NlcnRpb25zTnVtYmVyICE9PSBudWxsICYmIGFzc2VydGlvbkNhbGxzICE9PSBleHBlY3RlZEFzc2VydGlvbnNOdW1iZXIpXG4gICAgICB0aHJvdyBleHBlY3RlZEFzc2VydGlvbnNOdW1iZXJFcnJvclxuICAgIGlmIChpc0V4cGVjdGluZ0Fzc2VydGlvbnMgPT09IHRydWUgJiYgYXNzZXJ0aW9uQ2FsbHMgPT09IDApXG4gICAgICB0aHJvdyBpc0V4cGVjdGluZ0Fzc2VydGlvbnNFcnJvclxuXG4gICAgdGVzdC5yZXN1bHQuc3RhdGUgPSAncGFzcydcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIHRlc3QucmVzdWx0LnN0YXRlID0gJ2ZhaWwnXG4gICAgdGVzdC5yZXN1bHQuZXJyb3IgPSBwcm9jZXNzRXJyb3IoZSlcbiAgfVxuXG4gIHRyeSB7XG4gICAgYXdhaXQgY2FsbFN1aXRlSG9vayh0ZXN0LnN1aXRlLCAnYWZ0ZXJFYWNoJywgW3Rlc3QsIHRlc3Quc3VpdGVdKVxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgdGVzdC5yZXN1bHQuc3RhdGUgPSAnZmFpbCdcbiAgICB0ZXN0LnJlc3VsdC5lcnJvciA9IHByb2Nlc3NFcnJvcihlKVxuICB9XG5cbiAgLy8gaWYgdGVzdCBpcyBtYXJrZWQgdG8gYmUgZmFpbGVkLCBmbGlwIHRoZSByZXN1bHRcbiAgaWYgKHRlc3QuZmFpbHMpIHtcbiAgICBpZiAodGVzdC5yZXN1bHQuc3RhdGUgPT09ICdwYXNzJykge1xuICAgICAgdGVzdC5yZXN1bHQuc3RhdGUgPSAnZmFpbCdcbiAgICAgIHRlc3QucmVzdWx0LmVycm9yID0gcHJvY2Vzc0Vycm9yKG5ldyBFcnJvcignRXhwZWN0IHRlc3QgdG8gZmFpbCcpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRlc3QucmVzdWx0LnN0YXRlID0gJ3Bhc3MnXG4gICAgICB0ZXN0LnJlc3VsdC5lcnJvciA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIGdldFNuYXBzaG90Q2xpZW50KCkuY2xlYXJUZXN0KClcblxuICB0ZXN0LnJlc3VsdC5kdXJhdGlvbiA9IHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRcblxuICBfX3ZpdGVzdF93b3JrZXJfXy5jdXJyZW50ID0gdW5kZWZpbmVkXG5cbiAgdXBkYXRlVGFzayh0ZXN0KVxufVxuXG5mdW5jdGlvbiBtYXJrVGFza3NBc1NraXBwZWQoc3VpdGU6IFN1aXRlKSB7XG4gIHN1aXRlLnRhc2tzLmZvckVhY2goKHQpID0+IHtcbiAgICB0Lm1vZGUgPSAnc2tpcCdcbiAgICB0LnJlc3VsdCA9IHsgLi4udC5yZXN1bHQsIHN0YXRlOiAnc2tpcCcgfVxuICAgIHVwZGF0ZVRhc2sodClcbiAgICBpZiAodC50eXBlID09PSAnc3VpdGUnKSBtYXJrVGFza3NBc1NraXBwZWQodClcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1blN1aXRlKHN1aXRlOiBTdWl0ZSkge1xuICBpZiAoc3VpdGUucmVzdWx0Py5zdGF0ZSA9PT0gJ2ZhaWwnKSB7XG4gICAgbWFya1Rhc2tzQXNTa2lwcGVkKHN1aXRlKVxuICAgIHVwZGF0ZVRhc2soc3VpdGUpXG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBzdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgc3VpdGUucmVzdWx0ID0ge1xuICAgIHN0YXRlOiAncnVuJyxcbiAgfVxuXG4gIHVwZGF0ZVRhc2soc3VpdGUpXG5cbiAgaWYgKHN1aXRlLm1vZGUgPT09ICdza2lwJykge1xuICAgIHN1aXRlLnJlc3VsdC5zdGF0ZSA9ICdza2lwJ1xuICB9XG4gIGVsc2UgaWYgKHN1aXRlLm1vZGUgPT09ICd0b2RvJykge1xuICAgIHN1aXRlLnJlc3VsdC5zdGF0ZSA9ICd0b2RvJ1xuICB9XG4gIGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBjYWxsU3VpdGVIb29rKHN1aXRlLCAnYmVmb3JlQWxsJywgW3N1aXRlXSlcblxuICAgICAgZm9yIChjb25zdCB0YXNrc0dyb3VwIG9mIHBhcnRpdGlvblN1aXRlQ2hpbGRyZW4oc3VpdGUpKSB7XG4gICAgICAgIGlmICh0YXNrc0dyb3VwWzBdLmNvbmN1cnJlbnQgPT09IHRydWUpIHtcbiAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbCh0YXNrc0dyb3VwLm1hcChjID0+IHJ1blN1aXRlQ2hpbGQoYykpKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGZvciAoY29uc3QgYyBvZiB0YXNrc0dyb3VwKVxuICAgICAgICAgICAgYXdhaXQgcnVuU3VpdGVDaGlsZChjKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGNhbGxTdWl0ZUhvb2soc3VpdGUsICdhZnRlckFsbCcsIFtzdWl0ZV0pXG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBzdWl0ZS5yZXN1bHQuc3RhdGUgPSAnZmFpbCdcbiAgICAgIHN1aXRlLnJlc3VsdC5lcnJvciA9IHByb2Nlc3NFcnJvcihlKVxuICAgIH1cbiAgfVxuICBzdWl0ZS5yZXN1bHQuZHVyYXRpb24gPSBwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0XG5cbiAgaWYgKHN1aXRlLm1vZGUgPT09ICdydW4nKSB7XG4gICAgaWYgKCFoYXNUZXN0cyhzdWl0ZSkpIHtcbiAgICAgIHN1aXRlLnJlc3VsdC5zdGF0ZSA9ICdmYWlsJ1xuICAgICAgaWYgKCFzdWl0ZS5yZXN1bHQuZXJyb3IpXG4gICAgICAgIHN1aXRlLnJlc3VsdC5lcnJvciA9IG5ldyBFcnJvcihgTm8gdGVzdCBmb3VuZCBpbiBzdWl0ZSAke3N1aXRlLm5hbWV9YClcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzRmFpbGVkKHN1aXRlKSkge1xuICAgICAgc3VpdGUucmVzdWx0LnN0YXRlID0gJ2ZhaWwnXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgc3VpdGUucmVzdWx0LnN0YXRlID0gJ3Bhc3MnXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlVGFzayhzdWl0ZSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuU3VpdGVDaGlsZChjOiBUYXNrKSB7XG4gIHJldHVybiBjLnR5cGUgPT09ICd0ZXN0J1xuICAgID8gcnVuVGVzdChjKVxuICAgIDogcnVuU3VpdGUoYylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bkZpbGVzKGZpbGVzOiBGaWxlW10sIGNvbmZpZzogUmVzb2x2ZWRDb25maWcpIHtcbiAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgaWYgKCFmaWxlLnRhc2tzLmxlbmd0aCAmJiAhY29uZmlnLnBhc3NXaXRoTm9UZXN0cykge1xuICAgICAgaWYgKCFmaWxlLnJlc3VsdD8uZXJyb3IpIHtcbiAgICAgICAgZmlsZS5yZXN1bHQgPSB7XG4gICAgICAgICAgc3RhdGU6ICdmYWlsJyxcbiAgICAgICAgICBlcnJvcjogbmV3IEVycm9yKGBObyB0ZXN0IHN1aXRlIGZvdW5kIGluIGZpbGUgJHtmaWxlLmZpbGVwYXRofWApLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgcnVuU3VpdGUoZmlsZSlcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRUZXN0cyhwYXRoczogc3RyaW5nW10sIGNvbmZpZzogUmVzb2x2ZWRDb25maWcpIHtcbiAgY29uc3QgZmlsZXMgPSBhd2FpdCBjb2xsZWN0VGVzdHMocGF0aHMsIGNvbmZpZylcblxuICBycGMoKS5vbkNvbGxlY3RlZChmaWxlcylcblxuICBhd2FpdCBydW5GaWxlcyhmaWxlcywgY29uZmlnKVxuXG4gIHRha2VDb3ZlcmFnZSgpXG5cbiAgYXdhaXQgZ2V0U25hcHNob3RDbGllbnQoKS5zYXZlU25hcCgpXG5cbiAgYXdhaXQgc2VuZFRhc2tzVXBkYXRlKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTW9kdWxlTW9ja3MoKSB7XG4gIGNvbnN0IHsgY2xlYXJNb2NrcywgbW9ja1Jlc2V0LCByZXN0b3JlTW9ja3MgfSA9IF9fdml0ZXN0X3dvcmtlcl9fLmNvbmZpZ1xuXG4gIC8vIHNpbmNlIGVhY2ggZnVuY3Rpb24gY2FsbHMgYW5vdGhlciwgd2UgY2FuIGp1c3QgY2FsbCBvbmVcbiAgaWYgKHJlc3RvcmVNb2NrcylcbiAgICB2aS5yZXN0b3JlQWxsTW9ja3MoKVxuICBlbHNlIGlmIChtb2NrUmVzZXQpXG4gICAgdmkucmVzZXRBbGxNb2NrcygpXG4gIGVsc2UgaWYgKGNsZWFyTW9ja3MpXG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG59XG4iLCJpbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHR5cGUgeyBCdWlsdGluRW52aXJvbm1lbnQsIFJlc29sdmVkQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBzZXR1cEdsb2JhbEVudiwgd2l0aEVudiB9IGZyb20gJy4vc2V0dXAnXG5pbXBvcnQgeyBzdGFydFRlc3RzIH0gZnJvbSAnLi9ydW4nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW4oZmlsZXM6IHN0cmluZ1tdLCBjb25maWc6IFJlc29sdmVkQ29uZmlnKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IHNldHVwR2xvYmFsRW52KGNvbmZpZylcblxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICBjb25zdCBjb2RlID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgJ3V0Zi04JylcblxuICAgIGNvbnN0IGVudiA9IGNvZGUubWF0Y2goL0AoPzp2aXRlc3R8amVzdCktZW52aXJvbm1lbnRcXHMrPyhbXFx3LV0rKVxcYi8pPy5bMV0gfHwgY29uZmlnLmVudmlyb25tZW50IHx8ICdub2RlJ1xuXG4gICAgaWYgKCFbJ25vZGUnLCAnanNkb20nLCAnaGFwcHktZG9tJ10uaW5jbHVkZXMoZW52KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZW52aXJvbm1lbnQ6ICR7ZW52fWApXG5cbiAgICBfX3ZpdGVzdF93b3JrZXJfXy5maWxlcGF0aCA9IGZpbGVcblxuICAgIGF3YWl0IHdpdGhFbnYoZW52IGFzIEJ1aWx0aW5FbnZpcm9ubWVudCwgY29uZmlnLmVudmlyb25tZW50T3B0aW9ucyB8fCB7fSwgYXN5bmMoKSA9PiB7XG4gICAgICBhd2FpdCBzdGFydFRlc3RzKFtmaWxlXSwgY29uZmlnKVxuICAgIH0pXG5cbiAgICBfX3ZpdGVzdF93b3JrZXJfXy5maWxlcGF0aCA9IHVuZGVmaW5lZFxuICB9XG59XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwicmVxdWlyZSIsInRoaXMiLCJuYXR1cmFsQ29tcGFyZU1vZHVsZSIsInByZXR0eUZvcm1hdCIsInBhdGgiLCJuYXR1cmFsQ29tcGFyZSIsImZzcCIsImZzIiwiQXN5bW1ldHJpY01hdGNoZXIiLCJwcmV0dHlGb3JtYXRQbHVnaW5zIiwiX19kZWZQcm9wcyIsIl9fZ2V0T3duUHJvcERlc2NzIiwiX19zcHJlYWRQcm9wcyIsImNoYWkiLCJwZXJmb3JtYW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLFdBQWU7QUFDZixFQUFFLElBQUksRUFBRSxNQUFNO0FBQ2QsRUFBRSxNQUFNLEtBQUssR0FBRztBQUNoQixJQUFJLE9BQU87QUFDWCxNQUFNLFFBQVEsR0FBRztBQUNqQixPQUFPO0FBQ1AsS0FBSyxDQUFDO0FBQ04sR0FBRztBQUNILENBQUM7O0FDUkQsTUFBTSxXQUFXLEdBQUc7QUFDcEIsRUFBRSxjQUFjO0FBQ2hCLEVBQUUsS0FBSztBQUNQLEVBQUUsaUJBQWlCO0FBQ25CLEVBQUUsYUFBYTtBQUNmLEVBQUUsY0FBYztBQUNoQixFQUFFLE1BQU07QUFDUixFQUFFLE1BQU07QUFDUixFQUFFLFNBQVM7QUFDWCxFQUFFLGtCQUFrQjtBQUNwQixFQUFFLG1CQUFtQjtBQUNyQixFQUFF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QUFJLENBQUM7QUFDcEQsRUFBRSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RCxFQUFFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdDLEVBQUUsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDekUsRUFBRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDOUcsRUFBRSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztBQUN0QyxFQUFFLE1BQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3RDLEVBQUUsT0FBTyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUM7QUFDN0UsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FB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
