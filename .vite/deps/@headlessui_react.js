import {
  require_react_dom
} from "./chunk-WRUK53JR.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues,
  __toESM,
  require_react
} from "./chunk-ZFTXHV63.js";

// node_modules/@headlessui/react/dist/components/combobox/combobox.js
var import_react14 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-disposables.js
var import_react = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/disposables.js
function o() {
  let a3 = [], i9 = [], n2 = { enqueue(e4) {
    i9.push(e4);
  }, addEventListener(e4, t10, r8, s9) {
    return e4.addEventListener(t10, r8, s9), n2.add(() => e4.removeEventListener(t10, r8, s9));
  }, requestAnimationFrame(...e4) {
    let t10 = requestAnimationFrame(...e4);
    return n2.add(() => cancelAnimationFrame(t10));
  }, nextFrame(...e4) {
    return n2.requestAnimationFrame(() => n2.requestAnimationFrame(...e4));
  }, setTimeout(...e4) {
    let t10 = setTimeout(...e4);
    return n2.add(() => clearTimeout(t10));
  }, add(e4) {
    return a3.push(e4), () => {
      let t10 = a3.indexOf(e4);
      if (t10 >= 0) {
        let [r8] = a3.splice(t10, 1);
        r8();
      }
    };
  }, dispose() {
    for (let e4 of a3.splice(0))
      e4();
  }, async workQueue() {
    for (let e4 of i9.splice(0))
      await e4();
  } };
  return n2;
}

// node_modules/@headlessui/react/dist/hooks/use-disposables.js
function p() {
  let [e4] = (0, import_react.useState)(o);
  return (0, import_react.useEffect)(() => () => e4.dispose(), [e4]), e4;
}

// node_modules/@headlessui/react/dist/hooks/use-id.js
var import_react4 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-iso-morphic-effect.js
var import_react2 = __toESM(require_react(), 1);
var t = typeof window != "undefined" ? import_react2.useLayoutEffect : import_react2.useEffect;

// node_modules/@headlessui/react/dist/hooks/use-server-handoff-complete.js
var import_react3 = __toESM(require_react(), 1);
var r = { serverHandoffComplete: false };
function a() {
  let [e4, f11] = (0, import_react3.useState)(r.serverHandoffComplete);
  return (0, import_react3.useEffect)(() => {
    e4 !== true && f11(true);
  }, [e4]), (0, import_react3.useEffect)(() => {
    r.serverHandoffComplete === false && (r.serverHandoffComplete = true);
  }, []), e4;
}

// node_modules/@headlessui/react/dist/hooks/use-id.js
var u;
var l = 0;
function r2() {
  return ++l;
}
var I = (u = import_react4.default.useId) != null ? u : function() {
  let n2 = a(), [e4, o9] = import_react4.default.useState(n2 ? r2 : null);
  return t(() => {
    e4 === null && o9(r2());
  }, [e4]), e4 != null ? "" + e4 : void 0;
};

// node_modules/@headlessui/react/dist/hooks/use-computed.js
var import_react6 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-latest-value.js
var import_react5 = __toESM(require_react(), 1);
function s2(e4) {
  let r8 = (0, import_react5.useRef)(e4);
  return t(() => {
    r8.current = e4;
  }, [e4]), r8;
}

// node_modules/@headlessui/react/dist/hooks/use-computed.js
function i(e4, o9) {
  let [u7, t10] = (0, import_react6.useState)(e4), r8 = s2(e4);
  return t(() => t10(r8.current), [r8, t10, ...o9]), u7;
}

// node_modules/@headlessui/react/dist/hooks/use-sync-refs.js
var import_react7 = __toESM(require_react(), 1);
var l2 = Symbol();
function p2(n2, t10 = true) {
  return Object.assign(n2, { [l2]: t10 });
}
function T(...n2) {
  let t10 = (0, import_react7.useRef)(n2);
  (0, import_react7.useEffect)(() => {
    t10.current = n2;
  }, [n2]);
  let c8 = (0, import_react7.useCallback)((e4) => {
    for (let u7 of t10.current)
      u7 != null && (typeof u7 == "function" ? u7(e4) : u7.current = e4);
  }, [t10]);
  return n2.every((e4) => e4 == null || (e4 == null ? void 0 : e4[l2])) ? void 0 : c8;
}

// node_modules/@headlessui/react/dist/utils/render.js
var import_react8 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/match.js
function u2(r8, n2, ...a3) {
  if (r8 in n2) {
    let e4 = n2[r8];
    return typeof e4 == "function" ? e4(...a3) : e4;
  }
  let t10 = new Error(`Tried to handle "${r8}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e4) => `"${e4}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t10, u2), t10;
}

// node_modules/@headlessui/react/dist/utils/render.js
var b = ((n2) => (n2[n2.None = 0] = "None", n2[n2.RenderStrategy = 1] = "RenderStrategy", n2[n2.Static = 2] = "Static", n2))(b || {});
var x = ((e4) => (e4[e4.Unmount = 0] = "Unmount", e4[e4.Hidden = 1] = "Hidden", e4))(x || {});
function A({ ourProps: r8, theirProps: t10, slot: e4, defaultTag: n2, features: o9, visible: a3 = true, name: l9 }) {
  let s9 = m(t10, r8);
  if (a3)
    return p3(s9, e4, n2, l9);
  let u7 = o9 != null ? o9 : 0;
  if (u7 & 2) {
    let _a = s9, { static: i9 = false } = _a, d7 = __objRest(_a, ["static"]);
    if (i9)
      return p3(d7, e4, n2, l9);
  }
  if (u7 & 1) {
    let _b = s9, { unmount: i9 = true } = _b, d7 = __objRest(_b, ["unmount"]);
    return u2(i9 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return p3(__spreadProps(__spreadValues({}, d7), { hidden: true, style: { display: "none" } }), e4, n2, l9);
    } });
  }
  return p3(s9, e4, n2, l9);
}
function p3(r8, t10 = {}, e4, n2) {
  let _a = f3(r8, ["unmount", "static"]), { as: o9 = e4, children: a3, refName: l9 = "ref" } = _a, s9 = __objRest(_a, ["as", "children", "refName"]), u7 = r8.ref !== void 0 ? { [l9]: r8.ref } : {}, i9 = typeof a3 == "function" ? a3(t10) : a3;
  if (s9.className && typeof s9.className == "function" && (s9.className = s9.className(t10)), o9 === import_react8.Fragment && Object.keys(y(s9)).length > 0) {
    if (!(0, import_react8.isValidElement)(i9) || Array.isArray(i9) && i9.length > 1)
      throw new Error(['Passing props on "Fragment"!', "", `The current component <${n2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(s9).map((d7) => `  - ${d7}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d7) => `  - ${d7}`).join(`
`)].join(`
`));
    return (0, import_react8.cloneElement)(i9, Object.assign({}, m(i9.props, y(f3(s9, ["ref"]))), u7));
  }
  return (0, import_react8.createElement)(o9, Object.assign({}, f3(s9, ["ref"]), o9 !== import_react8.Fragment && u7), i9);
}
function m(...r8) {
  var n2;
  if (r8.length === 0)
    return {};
  if (r8.length === 1)
    return r8[0];
  let t10 = {}, e4 = {};
  for (let o9 of r8)
    for (let a3 in o9)
      a3.startsWith("on") && typeof o9[a3] == "function" ? ((n2 = e4[a3]) != null || (e4[a3] = []), e4[a3].push(o9[a3])) : t10[a3] = o9[a3];
  if (t10.disabled || t10["aria-disabled"])
    return Object.assign(t10, Object.fromEntries(Object.keys(e4).map((o9) => [o9, void 0])));
  for (let o9 in e4)
    Object.assign(t10, { [o9](a3) {
      let l9 = e4[o9];
      for (let s9 of l9) {
        if (a3.defaultPrevented)
          return;
        s9(a3);
      }
    } });
  return t10;
}
function H(r8) {
  var t10;
  return Object.assign((0, import_react8.forwardRef)(r8), { displayName: (t10 = r8.displayName) != null ? t10 : r8.name });
}
function y(r8) {
  let t10 = Object.assign({}, r8);
  for (let e4 in t10)
    t10[e4] === void 0 && delete t10[e4];
  return t10;
}
function f3(r8, t10 = []) {
  let e4 = Object.assign({}, r8);
  for (let n2 of t10)
    n2 in e4 && delete e4[n2];
  return e4;
}

// node_modules/@headlessui/react/dist/components/keyboard.js
var o5 = ((r8) => (r8.Space = " ", r8.Enter = "Enter", r8.Escape = "Escape", r8.Backspace = "Backspace", r8.Delete = "Delete", r8.ArrowLeft = "ArrowLeft", r8.ArrowUp = "ArrowUp", r8.ArrowRight = "ArrowRight", r8.ArrowDown = "ArrowDown", r8.Home = "Home", r8.End = "End", r8.PageUp = "PageUp", r8.PageDown = "PageDown", r8.Tab = "Tab", r8))(o5 || {});

// node_modules/@headlessui/react/dist/utils/calculate-active-index.js
function f4(r8) {
  throw new Error("Unexpected object: " + r8);
}
var a2 = ((e4) => (e4[e4.First = 0] = "First", e4[e4.Previous = 1] = "Previous", e4[e4.Next = 2] = "Next", e4[e4.Last = 3] = "Last", e4[e4.Specific = 4] = "Specific", e4[e4.Nothing = 5] = "Nothing", e4))(a2 || {});
function x2(r8, n2) {
  let t10 = n2.resolveItems();
  if (t10.length <= 0)
    return null;
  let l9 = n2.resolveActiveIndex(), s9 = l9 != null ? l9 : -1, d7 = (() => {
    switch (r8.focus) {
      case 0:
        return t10.findIndex((e4) => !n2.resolveDisabled(e4));
      case 1: {
        let e4 = t10.slice().reverse().findIndex((i9, c8, u7) => s9 !== -1 && u7.length - c8 - 1 >= s9 ? false : !n2.resolveDisabled(i9));
        return e4 === -1 ? e4 : t10.length - 1 - e4;
      }
      case 2:
        return t10.findIndex((e4, i9) => i9 <= s9 ? false : !n2.resolveDisabled(e4));
      case 3: {
        let e4 = t10.slice().reverse().findIndex((i9) => !n2.resolveDisabled(i9));
        return e4 === -1 ? e4 : t10.length - 1 - e4;
      }
      case 4:
        return t10.findIndex((e4) => n2.resolveId(e4) === r8.id);
      case 5:
        return null;
      default:
        f4(r8);
    }
  })();
  return d7 === -1 ? l9 : d7;
}

// node_modules/@headlessui/react/dist/utils/bugs.js
function r3(n2) {
  let e4 = n2.parentElement, l9 = null;
  for (; e4 && !(e4 instanceof HTMLFieldSetElement); )
    e4 instanceof HTMLLegendElement && (l9 = e4), e4 = e4.parentElement;
  let t10 = (e4 == null ? void 0 : e4.getAttribute("disabled")) === "";
  return t10 && i3(l9) ? false : t10;
}
function i3(n2) {
  if (!n2)
    return false;
  let e4 = n2.previousElementSibling;
  for (; e4 !== null; ) {
    if (e4 instanceof HTMLLegendElement)
      return false;
    e4 = e4.previousElementSibling;
  }
  return true;
}

// node_modules/@headlessui/react/dist/hooks/use-outside-click.js
var import_react10 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/micro-task.js
function t5(e4) {
  typeof queueMicrotask == "function" ? queueMicrotask(e4) : Promise.resolve().then(e4).catch((o9) => setTimeout(() => {
    throw o9;
  }));
}

// node_modules/@headlessui/react/dist/hooks/use-window-event.js
var import_react9 = __toESM(require_react(), 1);
function s4(e4, r8, n2) {
  let o9 = s2(r8);
  (0, import_react9.useEffect)(() => {
    function t10(i9) {
      o9.current(i9);
    }
    return window.addEventListener(e4, t10, n2), () => window.removeEventListener(e4, t10, n2);
  }, [e4, n2]);
}

// node_modules/@headlessui/react/dist/hooks/use-outside-click.js
var C = ((r8) => (r8[r8.None = 1] = "None", r8[r8.IgnoreScrollbars = 2] = "IgnoreScrollbars", r8))(C || {});
function w(c8, a3, r8 = 1) {
  let i9 = (0, import_react10.useRef)(false), l9 = s2((n2) => {
    if (i9.current)
      return;
    i9.current = true, t5(() => {
      i9.current = false;
    });
    let f11 = function t10(e4) {
      return typeof e4 == "function" ? t10(e4()) : Array.isArray(e4) || e4 instanceof Set ? e4 : [e4];
    }(c8), o9 = n2.target;
    if (!!o9.ownerDocument.documentElement.contains(o9)) {
      if ((r8 & 2) === 2) {
        let t10 = 20, e4 = o9.ownerDocument.documentElement;
        if (n2.clientX > e4.clientWidth - t10 || n2.clientX < t10 || n2.clientY > e4.clientHeight - t10 || n2.clientY < t10)
          return;
      }
      for (let t10 of f11) {
        if (t10 === null)
          continue;
        let e4 = t10 instanceof HTMLElement ? t10 : t10.current;
        if (e4 != null && e4.contains(o9))
          return;
      }
      return a3(n2, o9);
    }
  });
  s4("pointerdown", (...n2) => l9.current(...n2)), s4("mousedown", (...n2) => l9.current(...n2));
}

// node_modules/@headlessui/react/dist/internal/open-closed.js
var import_react11 = __toESM(require_react(), 1);
var o6 = (0, import_react11.createContext)(null);
o6.displayName = "OpenClosedContext";
var p4 = ((e4) => (e4[e4.Open = 0] = "Open", e4[e4.Closed = 1] = "Closed", e4))(p4 || {});
function s5() {
  return (0, import_react11.useContext)(o6);
}
function C2({ value: t10, children: n2 }) {
  return import_react11.default.createElement(o6.Provider, { value: t10 }, n2);
}

// node_modules/@headlessui/react/dist/hooks/use-resolve-button-type.js
var import_react12 = __toESM(require_react(), 1);
function i4(t10) {
  var n2;
  if (t10.type)
    return t10.type;
  let e4 = (n2 = t10.as) != null ? n2 : "button";
  if (typeof e4 == "string" && e4.toLowerCase() === "button")
    return "button";
}
function s6(t10, e4) {
  let [n2, u7] = (0, import_react12.useState)(() => i4(t10));
  return t(() => {
    u7(i4(t10));
  }, [t10.type, t10.as]), t(() => {
    n2 || !e4.current || e4.current instanceof HTMLButtonElement && !e4.current.hasAttribute("type") && u7("button");
  }, [n2, e4]), n2;
}

// node_modules/@headlessui/react/dist/hooks/use-tree-walker.js
var import_react13 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/owner.js
function t6(n2) {
  return typeof window == "undefined" ? null : n2 instanceof Node ? n2.ownerDocument : n2 != null && n2.hasOwnProperty("current") && n2.current instanceof Node ? n2.current.ownerDocument : document;
}

// node_modules/@headlessui/react/dist/hooks/use-tree-walker.js
function F2({ container: e4, accept: t10, walk: r8, enabled: c8 = true }) {
  let o9 = (0, import_react13.useRef)(t10), l9 = (0, import_react13.useRef)(r8);
  (0, import_react13.useEffect)(() => {
    o9.current = t10, l9.current = r8;
  }, [t10, r8]), t(() => {
    if (!e4 || !c8)
      return;
    let n2 = t6(e4);
    if (!n2)
      return;
    let f11 = o9.current, p12 = l9.current, d7 = Object.assign((i9) => f11(i9), { acceptNode: f11 }), u7 = n2.createTreeWalker(e4, NodeFilter.SHOW_ELEMENT, d7, false);
    for (; u7.nextNode(); )
      p12(u7.currentNode);
  }, [e4, c8, o9, l9]);
}

// node_modules/@headlessui/react/dist/utils/focus-management.js
var f5 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e4) => `${e4}:not([tabindex='-1'])`).join(",");
var E2 = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(E2 || {});
var p5 = ((o9) => (o9[o9.Error = 0] = "Error", o9[o9.Overflow = 1] = "Overflow", o9[o9.Success = 2] = "Success", o9[o9.Underflow = 3] = "Underflow", o9))(p5 || {});
var L = ((t10) => (t10[t10.Previous = -1] = "Previous", t10[t10.Next = 1] = "Next", t10))(L || {});
function N(e4 = document.body) {
  return e4 == null ? [] : Array.from(e4.querySelectorAll(f5));
}
var T3 = ((t10) => (t10[t10.Strict = 0] = "Strict", t10[t10.Loose = 1] = "Loose", t10))(T3 || {});
function O(e4, r8 = 0) {
  var t10;
  return e4 === ((t10 = t6(e4)) == null ? void 0 : t10.body) ? false : u2(r8, { [0]() {
    return e4.matches(f5);
  }, [1]() {
    let l9 = e4;
    for (; l9 !== null; ) {
      if (l9.matches(f5))
        return true;
      l9 = l9.parentElement;
    }
    return false;
  } });
}
function S(e4) {
  e4 == null || e4.focus({ preventScroll: true });
}
var b2 = ["textarea", "input"].join(",");
function M(e4) {
  var r8, t10;
  return (t10 = (r8 = e4 == null ? void 0 : e4.matches) == null ? void 0 : r8.call(e4, b2)) != null ? t10 : false;
}
function h2(e4, r8 = (t10) => t10) {
  return e4.slice().sort((t10, l9) => {
    let o9 = r8(t10), a3 = r8(l9);
    if (o9 === null || a3 === null)
      return 0;
    let n2 = o9.compareDocumentPosition(a3);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function F3(e4, r8) {
  let t10 = Array.isArray(e4) ? e4.length > 0 ? e4[0].ownerDocument : document : e4.ownerDocument, l9 = Array.isArray(e4) ? h2(e4) : N(e4), o9 = t10.activeElement, a3 = (() => {
    if (r8 & 5)
      return 1;
    if (r8 & 10)
      return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), n2 = (() => {
    if (r8 & 1)
      return 0;
    if (r8 & 2)
      return Math.max(0, l9.indexOf(o9)) - 1;
    if (r8 & 4)
      return Math.max(0, l9.indexOf(o9)) + 1;
    if (r8 & 8)
      return l9.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), d7 = r8 & 32 ? { preventScroll: true } : {}, c8 = 0, i9 = l9.length, u7;
  do {
    if (c8 >= i9 || c8 + i9 <= 0)
      return 0;
    let s9 = n2 + c8;
    if (r8 & 16)
      s9 = (s9 + i9) % i9;
    else {
      if (s9 < 0)
        return 3;
      if (s9 >= i9)
        return 1;
    }
    u7 = l9[s9], u7 == null || u7.focus(d7), c8 += a3;
  } while (u7 !== t10.activeElement);
  return r8 & 6 && M(u7) && u7.select(), u7.hasAttribute("tabindex") || u7.setAttribute("tabindex", "0"), 2;
}

// node_modules/@headlessui/react/dist/internal/visually-hidden.js
var i5 = "div";
var h3 = H(function(e4, r8) {
  return A({ ourProps: { ref: r8, style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", display: "none" } }, theirProps: e4, slot: {}, defaultTag: i5, name: "VisuallyHidden" });
});

// node_modules/@headlessui/react/dist/utils/form.js
function e2(n2 = {}, r8 = null, t10 = []) {
  for (let [i9, o9] of Object.entries(n2))
    f6(t10, s7(r8, i9), o9);
  return t10;
}
function s7(n2, r8) {
  return n2 ? n2 + "[" + r8 + "]" : r8;
}
function f6(n2, r8, t10) {
  if (Array.isArray(t10))
    for (let [i9, o9] of t10.entries())
      f6(n2, s7(r8, i9.toString()), o9);
  else
    t10 instanceof Date ? n2.push([r8, t10.toISOString()]) : typeof t10 == "boolean" ? n2.push([r8, t10 ? "1" : "0"]) : typeof t10 == "string" ? n2.push([r8, t10]) : typeof t10 == "number" ? n2.push([r8, `${t10}`]) : t10 == null ? n2.push([r8, ""]) : e2(t10, r8, n2);
}
function p6(n2) {
  var t10;
  let r8 = (t10 = n2 == null ? void 0 : n2.form) != null ? t10 : n2.closest("form");
  if (!!r8) {
    for (let i9 of r8.elements)
      if (i9.tagName === "INPUT" && i9.type === "submit" || i9.tagName === "BUTTON" && i9.type === "submit" || i9.nodeName === "INPUT" && i9.type === "image") {
        i9.click();
        return;
      }
  }
}

// node_modules/@headlessui/react/dist/components/combobox/combobox.js
var ye = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(ye || {});
var Pe = ((n2) => (n2[n2.Single = 0] = "Single", n2[n2.Multi = 1] = "Multi", n2))(Pe || {});
var Se = ((n2) => (n2[n2.Pointer = 0] = "Pointer", n2[n2.Other = 1] = "Other", n2))(Se || {});
var Ae = ((i9) => (i9[i9.OpenCombobox = 0] = "OpenCombobox", i9[i9.CloseCombobox = 1] = "CloseCombobox", i9[i9.SetDisabled = 2] = "SetDisabled", i9[i9.GoToOption = 3] = "GoToOption", i9[i9.RegisterOption = 4] = "RegisterOption", i9[i9.UnregisterOption = 5] = "UnregisterOption", i9))(Ae || {});
function Q(o9, a3 = (n2) => n2) {
  let n2 = o9.activeOptionIndex !== null ? o9.options[o9.activeOptionIndex] : null, e4 = h2(a3(o9.options.slice()), (t10) => t10.dataRef.current.domRef.current), l9 = n2 ? e4.indexOf(n2) : null;
  return l9 === -1 && (l9 = null), { options: e4, activeOptionIndex: l9 };
}
var Ie = { [1](o9) {
  return o9.disabled || o9.comboboxState === 1 ? o9 : __spreadProps(__spreadValues({}, o9), { activeOptionIndex: null, comboboxState: 1 });
}, [0](o9) {
  if (o9.disabled || o9.comboboxState === 0)
    return o9;
  let a3 = o9.activeOptionIndex, { value: n2, mode: e4 } = o9.comboboxPropsRef.current, l9 = o9.options.findIndex((t10) => {
    let i9 = t10.dataRef.current.value;
    return u2(e4, { [1]: () => n2.includes(i9), [0]: () => n2 === i9 });
  });
  return l9 !== -1 && (a3 = l9), __spreadProps(__spreadValues({}, o9), { comboboxState: 0, activeOptionIndex: a3 });
}, [2](o9, a3) {
  return o9.disabled === a3.disabled ? o9 : __spreadProps(__spreadValues({}, o9), { disabled: a3.disabled });
}, [3](o9, a3) {
  var l9;
  if (o9.disabled || o9.optionsRef.current && !o9.optionsPropsRef.current.static && o9.comboboxState === 1)
    return o9;
  let n2 = Q(o9);
  if (n2.activeOptionIndex === null) {
    let t10 = n2.options.findIndex((i9) => !i9.dataRef.current.disabled);
    t10 !== -1 && (n2.activeOptionIndex = t10);
  }
  let e4 = x2(a3, { resolveItems: () => n2.options, resolveActiveIndex: () => n2.activeOptionIndex, resolveId: (t10) => t10.id, resolveDisabled: (t10) => t10.dataRef.current.disabled });
  return __spreadProps(__spreadValues(__spreadValues({}, o9), n2), { activeOptionIndex: e4, activationTrigger: (l9 = a3.trigger) != null ? l9 : 1 });
}, [4]: (o9, a3) => {
  let n2 = { id: a3.id, dataRef: a3.dataRef }, e4 = Q(o9, (t10) => [...t10, n2]);
  if (o9.activeOptionIndex === null) {
    let { value: t10, mode: i9 } = o9.comboboxPropsRef.current, r8 = a3.dataRef.current.value;
    u2(i9, { [1]: () => t10.includes(r8), [0]: () => t10 === r8 }) && (e4.activeOptionIndex = e4.options.indexOf(n2));
  }
  let l9 = __spreadProps(__spreadValues(__spreadValues({}, o9), e4), { activationTrigger: 1 });
  return o9.comboboxPropsRef.current.__demoMode && o9.comboboxPropsRef.current.value === void 0 && (l9.activeOptionIndex = 0), l9;
}, [5]: (o9, a3) => {
  let n2 = Q(o9, (e4) => {
    let l9 = e4.findIndex((t10) => t10.id === a3.id);
    return l9 !== -1 && e4.splice(l9, 1), e4;
  });
  return __spreadProps(__spreadValues(__spreadValues({}, o9), n2), { activationTrigger: 1 });
} };
var Y = (0, import_react14.createContext)(null);
Y.displayName = "ComboboxContext";
function U(o9) {
  let a3 = (0, import_react14.useContext)(Y);
  if (a3 === null) {
    let n2 = new Error(`<${o9} /> is missing a parent <Combobox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, U), n2;
  }
  return a3;
}
var Z = (0, import_react14.createContext)(null);
Z.displayName = "ComboboxActions";
function W() {
  let o9 = (0, import_react14.useContext)(Z);
  if (o9 === null) {
    let a3 = new Error("ComboboxActions is missing a parent <Combobox /> component.");
    throw Error.captureStackTrace && Error.captureStackTrace(a3, W), a3;
  }
  return o9;
}
var ee = (0, import_react14.createContext)(null);
ee.displayName = "ComboboxData";
function G() {
  let o9 = (0, import_react14.useContext)(ee);
  if (o9 === null) {
    let a3 = new Error("ComboboxData is missing a parent <Combobox /> component.");
    throw Error.captureStackTrace && Error.captureStackTrace(a3, G), a3;
  }
  return o9;
}
function Me(o9, a3) {
  return u2(a3.type, Ie, o9, a3);
}
var De = import_react14.Fragment;
var Ee = H(function(a3, n2) {
  let _a = a3, { name: e4, value: l9, onChange: t10, disabled: i9 = false, __demoMode: r8 = false, nullable: u7 = false, multiple: p12 = false } = _a, x7 = __objRest(_a, ["name", "value", "onChange", "disabled", "__demoMode", "nullable", "multiple"]), R5 = (0, import_react14.useRef)(false), c8 = (0, import_react14.useRef)({ value: l9, mode: p12 ? 1 : 0, onChange: t10, nullable: u7, __demoMode: r8 });
  c8.current.value = l9, c8.current.mode = p12 ? 1 : 0, c8.current.nullable = u7;
  let O10 = (0, import_react14.useRef)({ static: false, hold: false }), v7 = (0, import_react14.useRef)({ displayValue: void 0 }), S2 = (0, import_react14.useReducer)(Me, { comboboxState: r8 ? 0 : 1, comboboxPropsRef: c8, optionsPropsRef: O10, inputPropsRef: v7, labelRef: (0, import_react14.createRef)(), inputRef: (0, import_react14.createRef)(), buttonRef: (0, import_react14.createRef)(), optionsRef: (0, import_react14.createRef)(), disabled: i9, options: [], activeOptionIndex: null, activationTrigger: 1 }), [{ comboboxState: s9, options: b9, activeOptionIndex: M8, optionsRef: F9, inputRef: y4, buttonRef: _7 }, d7] = S2, f11 = (0, import_react14.useMemo)(() => ({ value: l9, mode: p12 ? 1 : 0, get activeOptionIndex() {
    if (R5.current && M8 === null && b9.length > 0) {
      let m12 = b9.findIndex((T7) => !T7.dataRef.current.disabled);
      if (m12 !== -1)
        return m12;
    }
    return M8;
  } }), [l9, M8, b9]), g6 = f11.activeOptionIndex;
  t(() => {
    c8.current.onChange = (m12) => u2(f11.mode, { [0]() {
      return t10(m12);
    }, [1]() {
      let T7 = f11.value.slice(), h7 = T7.indexOf(m12);
      return h7 === -1 ? T7.push(m12) : T7.splice(h7, 1), t10(T7);
    } });
  }, [f11, t10, c8, f11]), t(() => d7({ type: 2, disabled: i9 }), [i9]), w([_7, y4, F9], () => {
    s9 === 0 && d7({ type: 1 });
  });
  let H6 = g6 === null ? null : b9[g6].dataRef.current.value, ie4 = (0, import_react14.useMemo)(() => ({ open: s9 === 0, disabled: i9, activeIndex: g6, activeOption: H6 }), [s9, i9, b9, g6]), w7 = (0, import_react14.useCallback)(() => {
    var T7;
    if (!y4.current)
      return;
    let m12 = v7.current.displayValue;
    typeof m12 == "function" ? y4.current.value = (T7 = m12(l9)) != null ? T7 : "" : typeof l9 == "string" ? y4.current.value = l9 : y4.current.value = "";
  }, [l9, y4, v7]), oe5 = (0, import_react14.useCallback)((m12) => {
    let T7 = b9.find((ue5) => ue5.id === m12);
    if (!T7)
      return;
    let { dataRef: h7 } = T7;
    c8.current.onChange(h7.current.value), w7();
  }, [b9, c8, y4]), te2 = (0, import_react14.useCallback)(() => {
    if (g6 !== null) {
      let { dataRef: m12, id: T7 } = b9[g6];
      c8.current.onChange(m12.current.value), w7(), d7({ type: 3, focus: a2.Specific, id: T7 });
    }
  }, [g6, b9, c8, y4]), ae4 = (0, import_react14.useMemo)(() => ({ selectOption: oe5, selectActiveOption: te2, openCombobox() {
    d7({ type: 0 }), R5.current = true;
  }, closeCombobox() {
    d7({ type: 1 }), R5.current = false;
  }, goToOption(m12, T7, h7) {
    return R5.current = false, m12 === a2.Specific ? d7({ type: 3, focus: a2.Specific, id: T7, trigger: h7 }) : d7({ type: 3, focus: m12, trigger: h7 });
  }, registerOption(m12, T7) {
    return d7({ type: 4, id: m12, dataRef: T7 }), () => d7({ type: 5, id: m12 });
  } }), [oe5, te2, d7]);
  t(() => {
    s9 === 1 && w7();
  }, [w7, s9]), t(w7, [w7]);
  let le6 = n2 === null ? {} : { ref: n2 };
  return import_react14.default.createElement(Z.Provider, { value: ae4 }, import_react14.default.createElement(ee.Provider, { value: f11 }, import_react14.default.createElement(Y.Provider, { value: S2 }, import_react14.default.createElement(C2, { value: u2(s9, { [0]: p4.Open, [1]: p4.Closed }) }, e4 != null && l9 != null && e2({ [e4]: l9 }).map(([m12, T7]) => import_react14.default.createElement(h3, __spreadValues({}, y({ key: m12, as: "input", type: "hidden", hidden: true, readOnly: true, name: m12, value: T7 })))), A({ ourProps: le6, theirProps: x7, slot: ie4, defaultTag: De, name: "Combobox" })))));
});
var he = "input";
var Le = H(function(a3, n2) {
  var y4, _7;
  let _a = a3, { value: e4, onChange: l9, displayValue: t10 } = _a, i9 = __objRest(_a, ["value", "onChange", "displayValue"]), [r8] = U("Combobox.Input"), u7 = G(), p12 = W(), x7 = T(r8.inputRef, n2), R5 = r8.inputPropsRef, c8 = `headlessui-combobox-input-${I()}`, O10 = p(), v7 = s2(l9);
  t(() => {
    R5.current.displayValue = t10;
  }, [t10, R5]);
  let S2 = (0, import_react14.useCallback)((d7) => {
    switch (d7.key) {
      case o5.Backspace:
      case o5.Delete:
        if (u7.mode !== 0 || !r8.comboboxPropsRef.current.nullable)
          return;
        let f11 = d7.currentTarget;
        O10.requestAnimationFrame(() => {
          f11.value === "" && (r8.comboboxPropsRef.current.onChange(null), r8.optionsRef.current && (r8.optionsRef.current.scrollTop = 0), p12.goToOption(a2.Nothing));
        });
        break;
      case o5.Enter:
        if (r8.comboboxState !== 0)
          return;
        if (d7.preventDefault(), d7.stopPropagation(), u7.activeOptionIndex === null) {
          p12.closeCombobox();
          return;
        }
        p12.selectActiveOption(), u7.mode === 0 && p12.closeCombobox();
        break;
      case o5.ArrowDown:
        return d7.preventDefault(), d7.stopPropagation(), u2(r8.comboboxState, { [0]: () => {
          p12.goToOption(a2.Next);
        }, [1]: () => {
          p12.openCombobox(), O10.nextFrame(() => {
            u7.value || p12.goToOption(a2.Next);
          });
        } });
      case o5.ArrowUp:
        return d7.preventDefault(), d7.stopPropagation(), u2(r8.comboboxState, { [0]: () => {
          p12.goToOption(a2.Previous);
        }, [1]: () => {
          p12.openCombobox(), O10.nextFrame(() => {
            u7.value || p12.goToOption(a2.Last);
          });
        } });
      case o5.Home:
      case o5.PageUp:
        return d7.preventDefault(), d7.stopPropagation(), p12.goToOption(a2.First);
      case o5.End:
      case o5.PageDown:
        return d7.preventDefault(), d7.stopPropagation(), p12.goToOption(a2.Last);
      case o5.Escape:
        return d7.preventDefault(), r8.optionsRef.current && !r8.optionsPropsRef.current.static && d7.stopPropagation(), p12.closeCombobox();
      case o5.Tab:
        p12.selectActiveOption(), p12.closeCombobox();
        break;
    }
  }, [O10, r8, p12, u7]), s9 = (0, import_react14.useCallback)((d7) => {
    var f11;
    p12.openCombobox(), (f11 = v7.current) == null || f11.call(v7, d7);
  }, [p12, v7]), b9 = i(() => {
    if (!!r8.labelRef.current)
      return [r8.labelRef.current.id].join(" ");
  }, [r8.labelRef.current]), M8 = (0, import_react14.useMemo)(() => ({ open: r8.comboboxState === 0, disabled: r8.disabled }), [r8]), F9 = { ref: x7, id: c8, role: "combobox", type: "text", "aria-controls": (y4 = r8.optionsRef.current) == null ? void 0 : y4.id, "aria-expanded": r8.disabled ? void 0 : r8.comboboxState === 0, "aria-activedescendant": u7.activeOptionIndex === null || (_7 = r8.options[u7.activeOptionIndex]) == null ? void 0 : _7.id, "aria-multiselectable": u7.mode === 1 ? true : void 0, "aria-labelledby": b9, disabled: r8.disabled, onKeyDown: S2, onChange: s9 };
  return A({ ourProps: F9, theirProps: i9, slot: M8, defaultTag: he, name: "Combobox.Input" });
});
var Fe = "button";
var _e = H(function(a3, n2) {
  var S2;
  let [e4] = U("Combobox.Button"), l9 = G(), t10 = W(), i9 = T(e4.buttonRef, n2), r8 = `headlessui-combobox-button-${I()}`, u7 = p(), p12 = (0, import_react14.useCallback)((s9) => {
    switch (s9.key) {
      case o5.ArrowDown:
        return s9.preventDefault(), s9.stopPropagation(), e4.comboboxState === 1 && (t10.openCombobox(), u7.nextFrame(() => {
          l9.value || t10.goToOption(a2.First);
        })), u7.nextFrame(() => {
          var b9;
          return (b9 = e4.inputRef.current) == null ? void 0 : b9.focus({ preventScroll: true });
        });
      case o5.ArrowUp:
        return s9.preventDefault(), s9.stopPropagation(), e4.comboboxState === 1 && (t10.openCombobox(), u7.nextFrame(() => {
          l9.value || t10.goToOption(a2.Last);
        })), u7.nextFrame(() => {
          var b9;
          return (b9 = e4.inputRef.current) == null ? void 0 : b9.focus({ preventScroll: true });
        });
      case o5.Escape:
        return s9.preventDefault(), e4.optionsRef.current && !e4.optionsPropsRef.current.static && s9.stopPropagation(), t10.closeCombobox(), u7.nextFrame(() => {
          var b9;
          return (b9 = e4.inputRef.current) == null ? void 0 : b9.focus({ preventScroll: true });
        });
      default:
        return;
    }
  }, [u7, e4, t10, l9]), x7 = (0, import_react14.useCallback)((s9) => {
    if (r3(s9.currentTarget))
      return s9.preventDefault();
    e4.comboboxState === 0 ? t10.closeCombobox() : (s9.preventDefault(), t10.openCombobox()), u7.nextFrame(() => {
      var b9;
      return (b9 = e4.inputRef.current) == null ? void 0 : b9.focus({ preventScroll: true });
    });
  }, [t10, u7, e4]), R5 = i(() => {
    if (!!e4.labelRef.current)
      return [e4.labelRef.current.id, r8].join(" ");
  }, [e4.labelRef.current, r8]), c8 = (0, import_react14.useMemo)(() => ({ open: e4.comboboxState === 0, disabled: e4.disabled }), [e4]), O10 = a3, v7 = { ref: i9, id: r8, type: s6(a3, e4.buttonRef), tabIndex: -1, "aria-haspopup": true, "aria-controls": (S2 = e4.optionsRef.current) == null ? void 0 : S2.id, "aria-expanded": e4.disabled ? void 0 : e4.comboboxState === 0, "aria-labelledby": R5, disabled: e4.disabled, onClick: x7, onKeyDown: p12 };
  return A({ ourProps: v7, theirProps: O10, slot: c8, defaultTag: Fe, name: "Combobox.Button" });
});
var we = "label";
var ke = H(function(a3, n2) {
  let [e4] = U("Combobox.Label"), l9 = `headlessui-combobox-label-${I()}`, t10 = T(e4.labelRef, n2), i9 = (0, import_react14.useCallback)(() => {
    var x7;
    return (x7 = e4.inputRef.current) == null ? void 0 : x7.focus({ preventScroll: true });
  }, [e4.inputRef]), r8 = (0, import_react14.useMemo)(() => ({ open: e4.comboboxState === 0, disabled: e4.disabled }), [e4]);
  return A({ ourProps: { ref: t10, id: l9, onClick: i9 }, theirProps: a3, slot: r8, defaultTag: we, name: "Combobox.Label" });
});
var Ve = "ul";
var Ue = b.RenderStrategy | b.Static;
var Be = H(function(a3, n2) {
  var S2;
  let _a = a3, { hold: e4 = false } = _a, l9 = __objRest(_a, ["hold"]), [t10] = U("Combobox.Options"), i9 = G(), { optionsPropsRef: r8 } = t10, u7 = T(t10.optionsRef, n2), p12 = `headlessui-combobox-options-${I()}`, x7 = s5(), R5 = (() => x7 !== null ? x7 === p4.Open : t10.comboboxState === 0)();
  t(() => {
    var s9;
    r8.current.static = (s9 = a3.static) != null ? s9 : false;
  }, [r8, a3.static]), t(() => {
    r8.current.hold = e4;
  }, [e4, r8]), F2({ container: t10.optionsRef.current, enabled: t10.comboboxState === 0, accept(s9) {
    return s9.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : s9.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(s9) {
    s9.setAttribute("role", "none");
  } });
  let c8 = i(() => {
    var s9, b9, M8;
    return (M8 = (s9 = t10.labelRef.current) == null ? void 0 : s9.id) != null ? M8 : (b9 = t10.buttonRef.current) == null ? void 0 : b9.id;
  }, [t10.labelRef.current, t10.buttonRef.current]), O10 = (0, import_react14.useMemo)(() => ({ open: t10.comboboxState === 0 }), [t10]), v7 = { "aria-activedescendant": i9.activeOptionIndex === null || (S2 = t10.options[i9.activeOptionIndex]) == null ? void 0 : S2.id, "aria-labelledby": c8, role: "listbox", id: p12, ref: u7 };
  return A({ ourProps: v7, theirProps: l9, slot: O10, defaultTag: Ve, features: Ue, visible: R5, name: "Combobox.Options" });
});
var Ne = "li";
var je = H(function(a3, n2) {
  let _a = a3, { disabled: e4 = false, value: l9 } = _a, t10 = __objRest(_a, ["disabled", "value"]), [i9] = U("Combobox.Option"), r8 = G(), u7 = W(), p12 = `headlessui-combobox-option-${I()}`, x7 = r8.activeOptionIndex !== null ? i9.options[r8.activeOptionIndex].id === p12 : false, R5 = u2(r8.mode, { [1]: () => r8.value.includes(l9), [0]: () => r8.value === l9 }), c8 = (0, import_react14.useRef)(null), O10 = (0, import_react14.useRef)({ disabled: e4, value: l9, domRef: c8 }), v7 = T(n2, c8);
  t(() => {
    O10.current.disabled = e4;
  }, [O10, e4]), t(() => {
    O10.current.value = l9;
  }, [O10, l9]), t(() => {
    var f11, g6;
    O10.current.textValue = (g6 = (f11 = c8.current) == null ? void 0 : f11.textContent) == null ? void 0 : g6.toLowerCase();
  }, [O10, c8]);
  let S2 = (0, import_react14.useCallback)(() => u7.selectOption(p12), [u7, p12]);
  t(() => u7.registerOption(p12, O10), [O10, p12]);
  let s9 = (0, import_react14.useRef)(!i9.comboboxPropsRef.current.__demoMode);
  t(() => {
    if (!i9.comboboxPropsRef.current.__demoMode)
      return;
    let f11 = o();
    return f11.requestAnimationFrame(() => {
      s9.current = true;
    }), f11.dispose;
  }, []), t(() => {
    if (i9.comboboxState !== 0 || !x7 || !s9.current || i9.activationTrigger === 0)
      return;
    let f11 = o();
    return f11.requestAnimationFrame(() => {
      var g6, H6;
      (H6 = (g6 = c8.current) == null ? void 0 : g6.scrollIntoView) == null || H6.call(g6, { block: "nearest" });
    }), f11.dispose;
  }, [c8, x7, i9.comboboxState, i9.activationTrigger, r8.activeOptionIndex]);
  let b9 = (0, import_react14.useCallback)((f11) => {
    if (e4)
      return f11.preventDefault();
    S2(), r8.mode === 0 && (u7.closeCombobox(), o().nextFrame(() => {
      var g6;
      return (g6 = i9.inputRef.current) == null ? void 0 : g6.focus({ preventScroll: true });
    }));
  }, [u7, i9.inputRef, e4, S2]), M8 = (0, import_react14.useCallback)(() => {
    if (e4)
      return u7.goToOption(a2.Nothing);
    u7.goToOption(a2.Specific, p12);
  }, [e4, p12, u7]), F9 = (0, import_react14.useCallback)(() => {
    e4 || x7 || u7.goToOption(a2.Specific, p12, 0);
  }, [e4, x7, p12, u7]), y4 = (0, import_react14.useCallback)(() => {
    e4 || !x7 || i9.optionsPropsRef.current.hold || u7.goToOption(a2.Nothing);
  }, [e4, x7, u7, i9.comboboxState, i9.comboboxPropsRef]), _7 = (0, import_react14.useMemo)(() => ({ active: x7, selected: R5, disabled: e4 }), [x7, R5, e4]);
  return A({ ourProps: { id: p12, ref: v7, role: "option", tabIndex: e4 === true ? void 0 : -1, "aria-disabled": e4 === true ? true : void 0, "aria-selected": R5 === true ? true : void 0, disabled: void 0, onClick: b9, onFocus: M8, onPointerMove: F9, onMouseMove: F9, onPointerLeave: y4, onMouseLeave: y4 }, theirProps: t10, slot: _7, defaultTag: Ne, name: "Combobox.Option" });
});
var go = Object.assign(Ee, { Input: Le, Button: _e, Label: ke, Options: Be, Option: je });

// node_modules/@headlessui/react/dist/components/dialog/dialog.js
var import_react23 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-focus-trap.js
var import_react18 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-event-listener.js
var import_react15 = __toESM(require_react(), 1);
function E3(n2, e4, a3, t10) {
  let i9 = s2(a3);
  (0, import_react15.useEffect)(() => {
    n2 = n2 != null ? n2 : window;
    function r8(o9) {
      i9.current(o9);
    }
    return n2.addEventListener(e4, r8, t10), () => n2.removeEventListener(e4, r8, t10);
  }, [n2, e4, t10]);
}

// node_modules/@headlessui/react/dist/hooks/use-is-mounted.js
var import_react16 = __toESM(require_react(), 1);
function f7() {
  let e4 = (0, import_react16.useRef)(false);
  return t(() => (e4.current = true, () => {
    e4.current = false;
  }), []), e4;
}

// node_modules/@headlessui/react/dist/hooks/use-owner.js
var import_react17 = __toESM(require_react(), 1);
function n(...e4) {
  return (0, import_react17.useMemo)(() => t6(...e4), [...e4]);
}

// node_modules/@headlessui/react/dist/hooks/use-focus-trap.js
var j = ((r8) => (r8[r8.None = 1] = "None", r8[r8.InitialFocus = 2] = "InitialFocus", r8[r8.TabLock = 4] = "TabLock", r8[r8.FocusLock = 8] = "FocusLock", r8[r8.RestoreFocus = 16] = "RestoreFocus", r8[r8.All = 30] = "All", r8))(j || {});
function B2(u7, f11 = 30, { initialFocus: t10, containers: s9 } = {}) {
  let m12 = (0, import_react18.useRef)(null), c8 = (0, import_react18.useRef)(null), r8 = f7(), M8 = Boolean(f11 & 16), a3 = Boolean(f11 & 2), e4 = n(u7);
  return (0, import_react18.useEffect)(() => {
    !M8 || m12.current || (m12.current = e4 == null ? void 0 : e4.activeElement);
  }, [M8, e4]), (0, import_react18.useEffect)(() => {
    if (!!M8)
      return () => {
        S(m12.current), m12.current = null;
      };
  }, [M8]), (0, import_react18.useEffect)(() => {
    if (!a3)
      return;
    let l9 = u7.current;
    if (!l9)
      return;
    let n2 = e4 == null ? void 0 : e4.activeElement;
    if (t10 != null && t10.current) {
      if ((t10 == null ? void 0 : t10.current) === n2) {
        c8.current = n2;
        return;
      }
    } else if (l9.contains(n2)) {
      c8.current = n2;
      return;
    }
    t10 != null && t10.current ? S(t10.current) : F3(l9, E2.First) === p5.Error && console.warn("There are no focusable elements inside the <FocusTrap />"), c8.current = e4 == null ? void 0 : e4.activeElement;
  }, [u7, t10, a3, e4]), E3(e4 == null ? void 0 : e4.defaultView, "keydown", (l9) => {
    !(f11 & 4) || !u7.current || l9.key === o5.Tab && (l9.preventDefault(), F3(u7.current, (l9.shiftKey ? E2.Previous : E2.Next) | E2.WrapAround) === p5.Success && (c8.current = e4 == null ? void 0 : e4.activeElement));
  }), E3(e4 == null ? void 0 : e4.defaultView, "focus", (l9) => {
    if (!(f11 & 8))
      return;
    let n2 = new Set(s9 == null ? void 0 : s9.current);
    if (n2.add(u7), !n2.size)
      return;
    let p12 = c8.current;
    if (!p12 || !r8.current)
      return;
    let E5 = l9.target;
    E5 && E5 instanceof HTMLElement ? k(n2, E5) ? (c8.current = E5, S(E5)) : (l9.preventDefault(), l9.stopPropagation(), S(p12)) : S(c8.current);
  }, true), m12;
}
function k(u7, f11) {
  var t10;
  for (let s9 of u7)
    if ((t10 = s9.current) != null && t10.contains(f11))
      return true;
  return false;
}

// node_modules/@headlessui/react/dist/hooks/use-inert-others.js
var i6 = /* @__PURE__ */ new Set();
var r6 = /* @__PURE__ */ new Map();
function u3(t10) {
  t10.setAttribute("aria-hidden", "true"), t10.inert = true;
}
function l4(t10) {
  let n2 = r6.get(t10);
  !n2 || (n2["aria-hidden"] === null ? t10.removeAttribute("aria-hidden") : t10.setAttribute("aria-hidden", n2["aria-hidden"]), t10.inert = n2.inert);
}
function M2(t10, n2 = true) {
  t(() => {
    if (!n2 || !t10.current)
      return;
    let o9 = t10.current, a3 = t6(o9);
    if (!!a3) {
      i6.add(o9);
      for (let e4 of r6.keys())
        e4.contains(o9) && (l4(e4), r6.delete(e4));
      return a3.querySelectorAll("body > *").forEach((e4) => {
        if (e4 instanceof HTMLElement) {
          for (let f11 of i6)
            if (e4.contains(f11))
              return;
          i6.size === 1 && (r6.set(e4, { "aria-hidden": e4.getAttribute("aria-hidden"), inert: e4.inert }), u3(e4));
        }
      }), () => {
        if (i6.delete(o9), i6.size > 0)
          a3.querySelectorAll("body > *").forEach((e4) => {
            if (e4 instanceof HTMLElement && !r6.has(e4)) {
              for (let f11 of i6)
                if (e4.contains(f11))
                  return;
              r6.set(e4, { "aria-hidden": e4.getAttribute("aria-hidden"), inert: e4.inert }), u3(e4);
            }
          });
        else
          for (let e4 of r6.keys())
            l4(e4), r6.delete(e4);
      };
    }
  }, [n2]);
}

// node_modules/@headlessui/react/dist/components/portal/portal.js
var import_react20 = __toESM(require_react(), 1);
var import_react_dom = __toESM(require_react_dom(), 1);

// node_modules/@headlessui/react/dist/internal/portal-force-root.js
var import_react19 = __toESM(require_react(), 1);
var e3 = (0, import_react19.createContext)(false);
function l5() {
  return (0, import_react19.useContext)(e3);
}
function P(o9) {
  return import_react19.default.createElement(e3.Provider, { value: o9.force }, o9.children);
}

// node_modules/@headlessui/react/dist/components/portal/portal.js
function C3(i9) {
  let n2 = l5(), l9 = (0, import_react20.useContext)(g2), e4 = n(i9), [r8, a3] = (0, import_react20.useState)(() => {
    if (!n2 && l9 !== null || typeof window == "undefined")
      return null;
    let o9 = e4 == null ? void 0 : e4.getElementById("headlessui-portal-root");
    if (o9)
      return o9;
    if (e4 === null)
      return null;
    let t10 = e4.createElement("div");
    return t10.setAttribute("id", "headlessui-portal-root"), e4.body.appendChild(t10);
  });
  return (0, import_react20.useEffect)(() => {
    r8 !== null && (e4 != null && e4.body.contains(r8) || e4 == null || e4.body.appendChild(r8));
  }, [r8, e4]), (0, import_react20.useEffect)(() => {
    n2 || l9 !== null && a3(l9.current);
  }, [l9, a3, n2]), r8;
}
var O2 = import_react20.Fragment;
var H2 = H(function(n2, l9) {
  let e4 = n2, r8 = (0, import_react20.useRef)(null), a3 = T(p2((f11) => {
    r8.current = f11;
  }), l9), o9 = n(r8), t10 = C3(r8), [u7] = (0, import_react20.useState)(() => {
    var f11;
    return typeof window == "undefined" ? null : (f11 = o9 == null ? void 0 : o9.createElement("div")) != null ? f11 : null;
  }), E5 = a();
  return t(() => {
    if (!!t10 && !!u7)
      return t10.appendChild(u7), () => {
        var f11;
        !t10 || !u7 || (t10.removeChild(u7), t10.childNodes.length <= 0 && ((f11 = t10.parentElement) == null || f11.removeChild(t10)));
      };
  }, [t10, u7]), E5 ? !t10 || !u7 ? null : (0, import_react_dom.createPortal)(A({ ourProps: { ref: a3 }, theirProps: e4, defaultTag: O2, name: "Portal" }), u7) : null;
});
var x3 = import_react20.Fragment;
var g2 = (0, import_react20.createContext)(null);
var _ = H(function(n2, l9) {
  let _a = n2, { target: e4 } = _a, r8 = __objRest(_a, ["target"]), o9 = { ref: T(l9) };
  return import_react20.default.createElement(g2.Provider, { value: e4 }, A({ ourProps: o9, theirProps: r8, defaultTag: x3, name: "Popover.Group" }));
});
var K2 = Object.assign(H2, { Group: _ });

// node_modules/@headlessui/react/dist/components/description/description.js
var import_react21 = __toESM(require_react(), 1);
var d5 = (0, import_react21.createContext)(null);
function u4() {
  let r8 = (0, import_react21.useContext)(d5);
  if (r8 === null) {
    let t10 = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(t10, u4), t10;
  }
  return r8;
}
function M3() {
  let [r8, t10] = (0, import_react21.useState)([]);
  return [r8.length > 0 ? r8.join(" ") : void 0, (0, import_react21.useMemo)(() => function(e4) {
    let i9 = (0, import_react21.useCallback)((o9) => (t10((n2) => [...n2, o9]), () => t10((n2) => {
      let a3 = n2.slice(), l9 = a3.indexOf(o9);
      return l9 !== -1 && a3.splice(l9, 1), a3;
    })), []), s9 = (0, import_react21.useMemo)(() => ({ register: i9, slot: e4.slot, name: e4.name, props: e4.props }), [i9, e4.slot, e4.name, e4.props]);
    return import_react21.default.createElement(d5.Provider, { value: s9 }, e4.children);
  }, [t10])];
}
var v = "p";
var O3 = H(function(t10, c8) {
  let e4 = u4(), i9 = `headlessui-description-${I()}`, s9 = T(c8);
  t(() => e4.register(i9), [i9, e4.register]);
  let o9 = t10, n2 = __spreadProps(__spreadValues({ ref: s9 }, e4.props), { id: i9 });
  return A({ ourProps: n2, theirProps: o9, slot: e4.slot || {}, defaultTag: v, name: e4.name || "Description" });
});

// node_modules/@headlessui/react/dist/internal/stack-context.js
var import_react22 = __toESM(require_react(), 1);
var o8 = (0, import_react22.createContext)(() => {
});
o8.displayName = "StackContext";
var p9 = ((e4) => (e4[e4.Add = 0] = "Add", e4[e4.Remove = 1] = "Remove", e4))(p9 || {});
function x4() {
  return (0, import_react22.useContext)(o8);
}
function O4({ children: c8, onUpdate: t10, type: e4, element: n2 }) {
  let a3 = x4(), r8 = (0, import_react22.useCallback)((...l9) => {
    t10 == null || t10(...l9), a3(...l9);
  }, [a3, t10]);
  return t(() => (r8(0, e4, n2), () => r8(1, e4, n2)), [r8, e4, n2]), import_react22.default.createElement(o8.Provider, { value: r8 }, c8);
}

// node_modules/@headlessui/react/dist/components/dialog/dialog.js
var ve = ((t10) => (t10[t10.Open = 0] = "Open", t10[t10.Closed = 1] = "Closed", t10))(ve || {});
var Ae2 = ((e4) => (e4[e4.SetTitleId = 0] = "SetTitleId", e4))(Ae2 || {});
var Ee2 = { [0](a3, e4) {
  return a3.titleId === e4.id ? a3 : __spreadProps(__spreadValues({}, a3), { titleId: e4.id });
} };
var _2 = (0, import_react23.createContext)(null);
_2.displayName = "DialogContext";
function C4(a3) {
  let e4 = (0, import_react23.useContext)(_2);
  if (e4 === null) {
    let t10 = new Error(`<${a3} /> is missing a parent <Dialog /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t10, C4), t10;
  }
  return e4;
}
function be(a3, e4) {
  return u2(e4.type, Ee2, a3, e4);
}
var Ce = "div";
var Oe = b.RenderStrategy | b.Static;
var Se2 = H(function(e4, t10) {
  let _a = e4, { open: o9, onClose: l9, initialFocus: p12, __demoMode: f11 = false } = _a, g6 = __objRest(_a, ["open", "onClose", "initialFocus", "__demoMode"]), [m12, D6] = (0, import_react23.useState)(0), O10 = s5();
  o9 === void 0 && O10 !== null && (o9 = u2(O10, { [p4.Open]: true, [p4.Closed]: false }));
  let u7 = (0, import_react23.useRef)(/* @__PURE__ */ new Set()), d7 = (0, import_react23.useRef)(null), z4 = T(d7, t10), P3 = n(d7), x7 = e4.hasOwnProperty("open") || O10 !== null, G5 = e4.hasOwnProperty("onClose");
  if (!x7 && !G5)
    throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");
  if (!x7)
    throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
  if (!G5)
    throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
  if (typeof o9 != "boolean")
    throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${o9}`);
  if (typeof l9 != "function")
    throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${l9}`);
  let i9 = o9 ? 0 : 1, [y4, B6] = (0, import_react23.useReducer)(be, { titleId: null, descriptionId: null, panelRef: (0, import_react23.createRef)() }), R5 = (0, import_react23.useCallback)(() => l9(false), [l9]), H6 = (0, import_react23.useCallback)((r8) => B6({ type: 0, id: r8 }), [B6]), W6 = a() ? f11 ? false : i9 === 0 : false, S2 = m12 > 1, U7 = (0, import_react23.useContext)(_2) !== null, J2 = B2(d7, W6 ? u2(S2 ? "parent" : "leaf", { parent: j.RestoreFocus, leaf: j.All & ~j.FocusLock }) : j.None, { initialFocus: p12, containers: u7 });
  M2(d7, S2 ? W6 : false), w(() => {
    var n2, s9;
    return [...Array.from((n2 = P3 == null ? void 0 : P3.querySelectorAll("body > *")) != null ? n2 : []).filter((c8) => !(!(c8 instanceof HTMLElement) || c8.contains(J2.current) || y4.panelRef.current && c8.contains(y4.panelRef.current))), (s9 = y4.panelRef.current) != null ? s9 : d7.current];
  }, () => {
    i9 === 0 && (S2 || R5());
  }, C.IgnoreScrollbars), E3(P3 == null ? void 0 : P3.defaultView, "keydown", (r8) => {
    r8.key === o5.Escape && i9 === 0 && (S2 || (r8.preventDefault(), r8.stopPropagation(), R5()));
  }), (0, import_react23.useEffect)(() => {
    var Y5;
    if (i9 !== 0 || U7)
      return;
    let r8 = t6(d7);
    if (!r8)
      return;
    let n2 = r8.documentElement, s9 = (Y5 = r8.defaultView) != null ? Y5 : window, c8 = n2.style.overflow, oe5 = n2.style.paddingRight, re4 = s9.innerWidth - n2.clientWidth;
    return n2.style.overflow = "hidden", n2.style.paddingRight = `${re4}px`, () => {
      n2.style.overflow = c8, n2.style.paddingRight = oe5;
    };
  }, [i9, U7]), (0, import_react23.useEffect)(() => {
    if (i9 !== 0 || !d7.current)
      return;
    let r8 = new IntersectionObserver((n2) => {
      for (let s9 of n2)
        s9.boundingClientRect.x === 0 && s9.boundingClientRect.y === 0 && s9.boundingClientRect.width === 0 && s9.boundingClientRect.height === 0 && R5();
    });
    return r8.observe(d7.current), () => r8.disconnect();
  }, [i9, d7, R5]);
  let [Q7, X6] = M3(), Z5 = `headlessui-dialog-${I()}`, ee3 = (0, import_react23.useMemo)(() => [{ dialogState: i9, close: R5, setTitleId: H6 }, y4], [i9, y4, R5, H6]), $5 = (0, import_react23.useMemo)(() => ({ open: i9 === 0 }), [i9]), te2 = { ref: z4, id: Z5, role: "dialog", "aria-modal": i9 === 0 ? true : void 0, "aria-labelledby": y4.titleId, "aria-describedby": Q7, onClick(r8) {
    r8.stopPropagation();
  } };
  return import_react23.default.createElement(O4, { type: "Dialog", element: d7, onUpdate: (0, import_react23.useCallback)((r8, n2, s9) => {
    n2 === "Dialog" && u2(r8, { [p9.Add]() {
      u7.current.add(s9), D6((c8) => c8 + 1);
    }, [p9.Remove]() {
      u7.current.add(s9), D6((c8) => c8 - 1);
    } });
  }, []) }, import_react23.default.createElement(P, { force: true }, import_react23.default.createElement(K2, null, import_react23.default.createElement(_2.Provider, { value: ee3 }, import_react23.default.createElement(K2.Group, { target: d7 }, import_react23.default.createElement(P, { force: false }, import_react23.default.createElement(X6, { slot: $5, name: "Dialog.Description" }, A({ ourProps: te2, theirProps: g6, slot: $5, defaultTag: Ce, features: Oe, visible: i9 === 0, name: "Dialog" }))))))));
});
var we2 = "div";
var Fe2 = H(function(e4, t10) {
  let [{ dialogState: o9, close: l9 }] = C4("Dialog.Overlay"), p12 = T(t10), f11 = `headlessui-dialog-overlay-${I()}`, g6 = (0, import_react23.useCallback)((u7) => {
    if (u7.target === u7.currentTarget) {
      if (r3(u7.currentTarget))
        return u7.preventDefault();
      u7.preventDefault(), u7.stopPropagation(), l9();
    }
  }, [l9]), m12 = (0, import_react23.useMemo)(() => ({ open: o9 === 0 }), [o9]);
  return A({ ourProps: { ref: p12, id: f11, "aria-hidden": true, onClick: g6 }, theirProps: e4, slot: m12, defaultTag: we2, name: "Dialog.Overlay" });
});
var Le2 = "div";
var ke2 = H(function(e4, t10) {
  let [{ dialogState: o9 }, l9] = C4("Dialog.Backdrop"), p12 = T(t10), f11 = `headlessui-dialog-backdrop-${I()}`;
  (0, import_react23.useEffect)(() => {
    if (l9.panelRef.current === null)
      throw new Error("A <Dialog.Backdrop /> component is being used, but a <Dialog.Panel /> component is missing.");
  }, [l9.panelRef]);
  let g6 = (0, import_react23.useMemo)(() => ({ open: o9 === 0 }), [o9]);
  return import_react23.default.createElement(P, { force: true }, import_react23.default.createElement(K2, null, A({ ourProps: { ref: p12, id: f11, "aria-hidden": true }, theirProps: e4, slot: g6, defaultTag: Le2, name: "Dialog.Backdrop" })));
});
var _e2 = "div";
var Me2 = H(function(e4, t10) {
  let [{ dialogState: o9 }, l9] = C4("Dialog.Panel"), p12 = T(t10, l9.panelRef), f11 = `headlessui-dialog-panel-${I()}`, g6 = (0, import_react23.useMemo)(() => ({ open: o9 === 0 }), [o9]);
  return A({ ourProps: { ref: p12, id: f11 }, theirProps: e4, slot: g6, defaultTag: _e2, name: "Dialog.Panel" });
});
var Ie2 = "h2";
var xe = H(function(e4, t10) {
  let [{ dialogState: o9, setTitleId: l9 }] = C4("Dialog.Title"), p12 = `headlessui-dialog-title-${I()}`, f11 = T(t10);
  (0, import_react23.useEffect)(() => (l9(p12), () => l9(null)), [p12, l9]);
  let g6 = (0, import_react23.useMemo)(() => ({ open: o9 === 0 }), [o9]);
  return A({ ourProps: { ref: f11, id: p12 }, theirProps: e4, slot: g6, defaultTag: Ie2, name: "Dialog.Title" });
});
var ft = Object.assign(Se2, { Backdrop: ke2, Panel: Me2, Overlay: Fe2, Title: xe, Description: O3 });

// node_modules/@headlessui/react/dist/components/disclosure/disclosure.js
var import_react24 = __toESM(require_react(), 1);
var Q2 = ((o9) => (o9[o9.Open = 0] = "Open", o9[o9.Closed = 1] = "Closed", o9))(Q2 || {});
var V = ((l9) => (l9[l9.ToggleDisclosure = 0] = "ToggleDisclosure", l9[l9.CloseDisclosure = 1] = "CloseDisclosure", l9[l9.SetButtonId = 2] = "SetButtonId", l9[l9.SetPanelId = 3] = "SetPanelId", l9[l9.LinkPanel = 4] = "LinkPanel", l9[l9.UnlinkPanel = 5] = "UnlinkPanel", l9))(V || {});
var X = { [0]: (e4) => __spreadProps(__spreadValues({}, e4), { disclosureState: u2(e4.disclosureState, { [0]: 1, [1]: 0 }) }), [1]: (e4) => e4.disclosureState === 1 ? e4 : __spreadProps(__spreadValues({}, e4), { disclosureState: 1 }), [4](e4) {
  return e4.linkedPanel === true ? e4 : __spreadProps(__spreadValues({}, e4), { linkedPanel: true });
}, [5](e4) {
  return e4.linkedPanel === false ? e4 : __spreadProps(__spreadValues({}, e4), { linkedPanel: false });
}, [2](e4, t10) {
  return e4.buttonId === t10.buttonId ? e4 : __spreadProps(__spreadValues({}, e4), { buttonId: t10.buttonId });
}, [3](e4, t10) {
  return e4.panelId === t10.panelId ? e4 : __spreadProps(__spreadValues({}, e4), { panelId: t10.panelId });
} };
var h5 = (0, import_react24.createContext)(null);
h5.displayName = "DisclosureContext";
function H3(e4) {
  let t10 = (0, import_react24.useContext)(h5);
  if (t10 === null) {
    let o9 = new Error(`<${e4} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o9, H3), o9;
  }
  return t10;
}
var U2 = (0, import_react24.createContext)(null);
U2.displayName = "DisclosureAPIContext";
function K3(e4) {
  let t10 = (0, import_react24.useContext)(U2);
  if (t10 === null) {
    let o9 = new Error(`<${e4} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o9, K3), o9;
  }
  return t10;
}
var w3 = (0, import_react24.createContext)(null);
w3.displayName = "DisclosurePanelContext";
function Y2() {
  return (0, import_react24.useContext)(w3);
}
function Z2(e4, t10) {
  return u2(t10.type, X, e4, t10);
}
var ee2 = import_react24.Fragment;
var te = H(function(t10, o9) {
  let _a = t10, { defaultOpen: n2 = false } = _a, r8 = __objRest(_a, ["defaultOpen"]), u7 = `headlessui-disclosure-button-${I()}`, l9 = `headlessui-disclosure-panel-${I()}`, a3 = (0, import_react24.useRef)(null), D6 = T(o9, p2((f11) => {
    a3.current = f11;
  }, t10.as === void 0 || t10.as === import_react24.default.Fragment)), P3 = (0, import_react24.useRef)(null), y4 = (0, import_react24.useRef)(null), d7 = (0, import_react24.useReducer)(Z2, { disclosureState: n2 ? 0 : 1, linkedPanel: false, buttonRef: y4, panelRef: P3, buttonId: u7, panelId: l9 }), [{ disclosureState: c8 }, i9] = d7;
  (0, import_react24.useEffect)(() => i9({ type: 2, buttonId: u7 }), [u7, i9]), (0, import_react24.useEffect)(() => i9({ type: 3, panelId: l9 }), [l9, i9]);
  let T7 = (0, import_react24.useCallback)((f11) => {
    i9({ type: 1 });
    let A4 = t6(a3);
    if (!A4)
      return;
    let I3 = (() => f11 ? f11 instanceof HTMLElement ? f11 : f11.current instanceof HTMLElement ? f11.current : A4.getElementById(u7) : A4.getElementById(u7))();
    I3 == null || I3.focus();
  }, [i9, u7]), C9 = (0, import_react24.useMemo)(() => ({ close: T7 }), [T7]), s9 = (0, import_react24.useMemo)(() => ({ open: c8 === 0, close: T7 }), [c8, T7]), p12 = { ref: D6 };
  return import_react24.default.createElement(h5.Provider, { value: d7 }, import_react24.default.createElement(U2.Provider, { value: C9 }, import_react24.default.createElement(C2, { value: u2(c8, { [0]: p4.Open, [1]: p4.Closed }) }, A({ ourProps: p12, theirProps: r8, slot: s9, defaultTag: ee2, name: "Disclosure" }))));
});
var ne2 = "button";
var le2 = H(function(t10, o9) {
  let [n2, r8] = H3("Disclosure.Button"), u7 = Y2(), l9 = u7 === null ? false : u7 === n2.panelId, a3 = (0, import_react24.useRef)(null), D6 = T(a3, o9, l9 ? null : n2.buttonRef), P3 = (0, import_react24.useCallback)((s9) => {
    var p12;
    if (l9) {
      if (n2.disclosureState === 1)
        return;
      switch (s9.key) {
        case o5.Space:
        case o5.Enter:
          s9.preventDefault(), s9.stopPropagation(), r8({ type: 0 }), (p12 = n2.buttonRef.current) == null || p12.focus();
          break;
      }
    } else
      switch (s9.key) {
        case o5.Space:
        case o5.Enter:
          s9.preventDefault(), s9.stopPropagation(), r8({ type: 0 });
          break;
      }
  }, [r8, l9, n2.disclosureState, n2.buttonRef]), y4 = (0, import_react24.useCallback)((s9) => {
    switch (s9.key) {
      case o5.Space:
        s9.preventDefault();
        break;
    }
  }, []), d7 = (0, import_react24.useCallback)((s9) => {
    var p12;
    r3(s9.currentTarget) || t10.disabled || (l9 ? (r8({ type: 0 }), (p12 = n2.buttonRef.current) == null || p12.focus()) : r8({ type: 0 }));
  }, [r8, t10.disabled, n2.buttonRef, l9]), c8 = (0, import_react24.useMemo)(() => ({ open: n2.disclosureState === 0 }), [n2]), i9 = s6(t10, a3), T7 = t10, C9 = l9 ? { ref: D6, type: i9, onKeyDown: P3, onClick: d7 } : { ref: D6, id: n2.buttonId, type: i9, "aria-expanded": t10.disabled ? void 0 : n2.disclosureState === 0, "aria-controls": n2.linkedPanel ? n2.panelId : void 0, onKeyDown: P3, onKeyUp: y4, onClick: d7 };
  return A({ ourProps: C9, theirProps: T7, slot: c8, defaultTag: ne2, name: "Disclosure.Button" });
});
var oe = "div";
var re = b.RenderStrategy | b.Static;
var se2 = H(function(t10, o9) {
  let [n2, r8] = H3("Disclosure.Panel"), { close: u7 } = K3("Disclosure.Panel"), l9 = T(o9, n2.panelRef, () => {
    n2.linkedPanel || r8({ type: 4 });
  }), a3 = s5(), D6 = (() => a3 !== null ? a3 === p4.Open : n2.disclosureState === 0)();
  (0, import_react24.useEffect)(() => () => r8({ type: 5 }), [r8]), (0, import_react24.useEffect)(() => {
    var c8;
    n2.disclosureState === 1 && ((c8 = t10.unmount) != null ? c8 : true) && r8({ type: 5 });
  }, [n2.disclosureState, t10.unmount, r8]);
  let P3 = (0, import_react24.useMemo)(() => ({ open: n2.disclosureState === 0, close: u7 }), [n2, u7]), y4 = t10, d7 = { ref: l9, id: n2.panelId };
  return import_react24.default.createElement(w3.Provider, { value: n2.panelId }, A({ ourProps: d7, theirProps: y4, slot: P3, defaultTag: oe, features: re, visible: D6, name: "Disclosure.Panel" }));
});
var ke3 = Object.assign(te, { Button: le2, Panel: se2 });

// node_modules/@headlessui/react/dist/components/focus-trap/focus-trap.js
var import_react25 = __toESM(require_react(), 1);
var c4 = "div";
var O5 = H(function(t10, o9) {
  let e4 = (0, import_react25.useRef)(null), l9 = T(e4, o9), _a = t10, { initialFocus: s9 } = _a, u7 = __objRest(_a, ["initialFocus"]), a3 = a();
  return B2(e4, a3 ? j.All : j.None, { initialFocus: s9 }), A({ ourProps: { ref: l9 }, theirProps: u7, defaultTag: c4, name: "FocusTrap" });
});

// node_modules/@headlessui/react/dist/components/listbox/listbox.js
var import_react26 = __toESM(require_react(), 1);
var pe2 = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(pe2 || {});
var ue = ((n2) => (n2[n2.Single = 0] = "Single", n2[n2.Multi = 1] = "Multi", n2))(ue || {});
var de = ((n2) => (n2[n2.Pointer = 0] = "Pointer", n2[n2.Other = 1] = "Other", n2))(de || {});
var ce = ((a3) => (a3[a3.OpenListbox = 0] = "OpenListbox", a3[a3.CloseListbox = 1] = "CloseListbox", a3[a3.SetDisabled = 2] = "SetDisabled", a3[a3.SetOrientation = 3] = "SetOrientation", a3[a3.GoToOption = 4] = "GoToOption", a3[a3.Search = 5] = "Search", a3[a3.ClearSearch = 6] = "ClearSearch", a3[a3.RegisterOption = 7] = "RegisterOption", a3[a3.UnregisterOption = 8] = "UnregisterOption", a3))(ce || {});
function _3(t10, i9 = (n2) => n2) {
  let n2 = t10.activeOptionIndex !== null ? t10.options[t10.activeOptionIndex] : null, e4 = h2(i9(t10.options.slice()), (p12) => p12.dataRef.current.domRef.current), o9 = n2 ? e4.indexOf(n2) : null;
  return o9 === -1 && (o9 = null), { options: e4, activeOptionIndex: o9 };
}
var fe = { [1](t10) {
  return t10.disabled || t10.listboxState === 1 ? t10 : __spreadProps(__spreadValues({}, t10), { activeOptionIndex: null, listboxState: 1 });
}, [0](t10) {
  if (t10.disabled || t10.listboxState === 0)
    return t10;
  let i9 = t10.activeOptionIndex, { value: n2, mode: e4 } = t10.propsRef.current, o9 = t10.options.findIndex((p12) => {
    let r8 = p12.dataRef.current.value;
    return u2(e4, { [1]: () => n2.includes(r8), [0]: () => n2 === r8 });
  });
  return o9 !== -1 && (i9 = o9), __spreadProps(__spreadValues({}, t10), { listboxState: 0, activeOptionIndex: i9 });
}, [2](t10, i9) {
  return t10.disabled === i9.disabled ? t10 : __spreadProps(__spreadValues({}, t10), { disabled: i9.disabled });
}, [3](t10, i9) {
  return t10.orientation === i9.orientation ? t10 : __spreadProps(__spreadValues({}, t10), { orientation: i9.orientation });
}, [4](t10, i9) {
  var o9;
  if (t10.disabled || t10.listboxState === 1)
    return t10;
  let n2 = _3(t10), e4 = x2(i9, { resolveItems: () => n2.options, resolveActiveIndex: () => n2.activeOptionIndex, resolveId: (p12) => p12.id, resolveDisabled: (p12) => p12.dataRef.current.disabled });
  return __spreadProps(__spreadValues(__spreadValues({}, t10), n2), { searchQuery: "", activeOptionIndex: e4, activationTrigger: (o9 = i9.trigger) != null ? o9 : 1 });
}, [5]: (t10, i9) => {
  if (t10.disabled || t10.listboxState === 1)
    return t10;
  let e4 = t10.searchQuery !== "" ? 0 : 1, o9 = t10.searchQuery + i9.value.toLowerCase(), r8 = (t10.activeOptionIndex !== null ? t10.options.slice(t10.activeOptionIndex + e4).concat(t10.options.slice(0, t10.activeOptionIndex + e4)) : t10.options).find((u7) => {
    var a3;
    return !u7.dataRef.current.disabled && ((a3 = u7.dataRef.current.textValue) == null ? void 0 : a3.startsWith(o9));
  }), s9 = r8 ? t10.options.indexOf(r8) : -1;
  return s9 === -1 || s9 === t10.activeOptionIndex ? __spreadProps(__spreadValues({}, t10), { searchQuery: o9 }) : __spreadProps(__spreadValues({}, t10), { searchQuery: o9, activeOptionIndex: s9, activationTrigger: 1 });
}, [6](t10) {
  return t10.disabled || t10.listboxState === 1 || t10.searchQuery === "" ? t10 : __spreadProps(__spreadValues({}, t10), { searchQuery: "" });
}, [7]: (t10, i9) => {
  let n2 = { id: i9.id, dataRef: i9.dataRef }, e4 = _3(t10, (o9) => [...o9, n2]);
  if (t10.activeOptionIndex === null) {
    let { value: o9, mode: p12 } = t10.propsRef.current, r8 = i9.dataRef.current.value;
    u2(p12, { [1]: () => o9.includes(r8), [0]: () => o9 === r8 }) && (e4.activeOptionIndex = e4.options.indexOf(n2));
  }
  return __spreadValues(__spreadValues({}, t10), e4);
}, [8]: (t10, i9) => {
  let n2 = _3(t10, (e4) => {
    let o9 = e4.findIndex((p12) => p12.id === i9.id);
    return o9 !== -1 && e4.splice(o9, 1), e4;
  });
  return __spreadProps(__spreadValues(__spreadValues({}, t10), n2), { activationTrigger: 1 });
} };
var V2 = (0, import_react26.createContext)(null);
V2.displayName = "ListboxContext";
function I2(t10) {
  let i9 = (0, import_react26.useContext)(V2);
  if (i9 === null) {
    let n2 = new Error(`<${t10} /> is missing a parent <Listbox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, I2), n2;
  }
  return i9;
}
function be2(t10, i9) {
  return u2(i9.type, fe, t10, i9);
}
var Te = import_react26.Fragment;
var xe2 = H(function(i9, n2) {
  let _a = i9, { value: e4, name: o9, onChange: p12, disabled: r8 = false, horizontal: s9 = false, multiple: u7 = false } = _a, a3 = __objRest(_a, ["value", "name", "onChange", "disabled", "horizontal", "multiple"]);
  const y4 = s9 ? "horizontal" : "vertical";
  let g6 = T(n2), v7 = (0, import_react26.useReducer)(be2, { listboxState: 1, propsRef: { current: { value: e4, onChange: p12, mode: u7 ? 1 : 0 } }, labelRef: (0, import_react26.createRef)(), buttonRef: (0, import_react26.createRef)(), optionsRef: (0, import_react26.createRef)(), disabled: r8, orientation: y4, options: [], searchQuery: "", activeOptionIndex: null, activationTrigger: 1 }), [{ listboxState: f11, propsRef: O10, optionsRef: S2, buttonRef: d7 }, l9] = v7;
  O10.current.value = e4, O10.current.mode = u7 ? 1 : 0, t(() => {
    O10.current.onChange = (L8) => u2(O10.current.mode, { [0]() {
      return p12(L8);
    }, [1]() {
      let T7 = O10.current.value.slice(), x7 = T7.indexOf(L8);
      return x7 === -1 ? T7.push(L8) : T7.splice(x7, 1), p12(T7);
    } });
  }, [p12, O10]), t(() => l9({ type: 2, disabled: r8 }), [r8]), t(() => l9({ type: 3, orientation: y4 }), [y4]), w([d7, S2], (L8, T7) => {
    var x7;
    f11 === 0 && (l9({ type: 1 }), O(T7, T3.Loose) || (L8.preventDefault(), (x7 = d7.current) == null || x7.focus()));
  });
  let c8 = (0, import_react26.useMemo)(() => ({ open: f11 === 0, disabled: r8 }), [f11, r8]), P3 = { ref: g6 };
  return import_react26.default.createElement(V2.Provider, { value: v7 }, import_react26.default.createElement(C2, { value: u2(f11, { [0]: p4.Open, [1]: p4.Closed }) }, o9 != null && e4 != null && e2({ [o9]: e4 }).map(([L8, T7]) => import_react26.default.createElement(h3, __spreadValues({}, y({ key: L8, as: "input", type: "hidden", hidden: true, readOnly: true, name: L8, value: T7 })))), A({ ourProps: P3, theirProps: a3, slot: c8, defaultTag: Te, name: "Listbox" })));
});
var ye2 = "button";
var Oe2 = H(function(i9, n2) {
  var S2;
  let [e4, o9] = I2("Listbox.Button"), p12 = T(e4.buttonRef, n2), r8 = `headlessui-listbox-button-${I()}`, s9 = p(), u7 = (0, import_react26.useCallback)((d7) => {
    switch (d7.key) {
      case o5.Space:
      case o5.Enter:
      case o5.ArrowDown:
        d7.preventDefault(), o9({ type: 0 }), s9.nextFrame(() => {
          e4.propsRef.current.value || o9({ type: 4, focus: a2.First });
        });
        break;
      case o5.ArrowUp:
        d7.preventDefault(), o9({ type: 0 }), s9.nextFrame(() => {
          e4.propsRef.current.value || o9({ type: 4, focus: a2.Last });
        });
        break;
    }
  }, [o9, e4, s9]), a3 = (0, import_react26.useCallback)((d7) => {
    switch (d7.key) {
      case o5.Space:
        d7.preventDefault();
        break;
    }
  }, []), y4 = (0, import_react26.useCallback)((d7) => {
    if (r3(d7.currentTarget))
      return d7.preventDefault();
    e4.listboxState === 0 ? (o9({ type: 1 }), s9.nextFrame(() => {
      var l9;
      return (l9 = e4.buttonRef.current) == null ? void 0 : l9.focus({ preventScroll: true });
    })) : (d7.preventDefault(), o9({ type: 0 }));
  }, [o9, s9, e4]), g6 = i(() => {
    if (!!e4.labelRef.current)
      return [e4.labelRef.current.id, r8].join(" ");
  }, [e4.labelRef.current, r8]), v7 = (0, import_react26.useMemo)(() => ({ open: e4.listboxState === 0, disabled: e4.disabled }), [e4]), f11 = i9, O10 = { ref: p12, id: r8, type: s6(i9, e4.buttonRef), "aria-haspopup": true, "aria-controls": (S2 = e4.optionsRef.current) == null ? void 0 : S2.id, "aria-expanded": e4.disabled ? void 0 : e4.listboxState === 0, "aria-labelledby": g6, disabled: e4.disabled, onKeyDown: u7, onKeyUp: a3, onClick: y4 };
  return A({ ourProps: O10, theirProps: f11, slot: v7, defaultTag: ye2, name: "Listbox.Button" });
});
var ge = "label";
var Re = H(function(i9, n2) {
  let [e4] = I2("Listbox.Label"), o9 = `headlessui-listbox-label-${I()}`, p12 = T(e4.labelRef, n2), r8 = (0, import_react26.useCallback)(() => {
    var y4;
    return (y4 = e4.buttonRef.current) == null ? void 0 : y4.focus({ preventScroll: true });
  }, [e4.buttonRef]), s9 = (0, import_react26.useMemo)(() => ({ open: e4.listboxState === 0, disabled: e4.disabled }), [e4]);
  return A({ ourProps: { ref: p12, id: o9, onClick: r8 }, theirProps: i9, slot: s9, defaultTag: ge, name: "Listbox.Label" });
});
var me = "ul";
var Le3 = b.RenderStrategy | b.Static;
var ve2 = H(function(i9, n2) {
  var d7;
  let [e4, o9] = I2("Listbox.Options"), p12 = T(e4.optionsRef, n2), r8 = `headlessui-listbox-options-${I()}`, s9 = p(), u7 = p(), a3 = s5(), y4 = (() => a3 !== null ? a3 === p4.Open : e4.listboxState === 0)();
  (0, import_react26.useEffect)(() => {
    var c8;
    let l9 = e4.optionsRef.current;
    !l9 || e4.listboxState === 0 && l9 !== ((c8 = t6(l9)) == null ? void 0 : c8.activeElement) && l9.focus({ preventScroll: true });
  }, [e4.listboxState, e4.optionsRef]);
  let g6 = (0, import_react26.useCallback)((l9) => {
    switch (u7.dispose(), l9.key) {
      case o5.Space:
        if (e4.searchQuery !== "")
          return l9.preventDefault(), l9.stopPropagation(), o9({ type: 5, value: l9.key });
      case o5.Enter:
        if (l9.preventDefault(), l9.stopPropagation(), e4.activeOptionIndex !== null) {
          let { dataRef: c8 } = e4.options[e4.activeOptionIndex];
          e4.propsRef.current.onChange(c8.current.value);
        }
        e4.propsRef.current.mode === 0 && (o9({ type: 1 }), o().nextFrame(() => {
          var c8;
          return (c8 = e4.buttonRef.current) == null ? void 0 : c8.focus({ preventScroll: true });
        }));
        break;
      case u2(e4.orientation, { vertical: o5.ArrowDown, horizontal: o5.ArrowRight }):
        return l9.preventDefault(), l9.stopPropagation(), o9({ type: 4, focus: a2.Next });
      case u2(e4.orientation, { vertical: o5.ArrowUp, horizontal: o5.ArrowLeft }):
        return l9.preventDefault(), l9.stopPropagation(), o9({ type: 4, focus: a2.Previous });
      case o5.Home:
      case o5.PageUp:
        return l9.preventDefault(), l9.stopPropagation(), o9({ type: 4, focus: a2.First });
      case o5.End:
      case o5.PageDown:
        return l9.preventDefault(), l9.stopPropagation(), o9({ type: 4, focus: a2.Last });
      case o5.Escape:
        return l9.preventDefault(), l9.stopPropagation(), o9({ type: 1 }), s9.nextFrame(() => {
          var c8;
          return (c8 = e4.buttonRef.current) == null ? void 0 : c8.focus({ preventScroll: true });
        });
      case o5.Tab:
        l9.preventDefault(), l9.stopPropagation();
        break;
      default:
        l9.key.length === 1 && (o9({ type: 5, value: l9.key }), u7.setTimeout(() => o9({ type: 6 }), 350));
        break;
    }
  }, [s9, o9, u7, e4]), v7 = i(() => {
    var l9, c8, P3;
    return (P3 = (l9 = e4.labelRef.current) == null ? void 0 : l9.id) != null ? P3 : (c8 = e4.buttonRef.current) == null ? void 0 : c8.id;
  }, [e4.labelRef.current, e4.buttonRef.current]), f11 = (0, import_react26.useMemo)(() => ({ open: e4.listboxState === 0 }), [e4]), O10 = i9, S2 = { "aria-activedescendant": e4.activeOptionIndex === null || (d7 = e4.options[e4.activeOptionIndex]) == null ? void 0 : d7.id, "aria-multiselectable": e4.propsRef.current.mode === 1 ? true : void 0, "aria-labelledby": v7, "aria-orientation": e4.orientation, id: r8, onKeyDown: g6, role: "listbox", tabIndex: 0, ref: p12 };
  return A({ ourProps: S2, theirProps: O10, slot: f11, defaultTag: me, features: Le3, visible: y4, name: "Listbox.Options" });
});
var Se3 = "li";
var Ae3 = H(function(i9, n2) {
  let _a = i9, { disabled: e4 = false, value: o9 } = _a, p12 = __objRest(_a, ["disabled", "value"]), [r8, s9] = I2("Listbox.Option"), u7 = `headlessui-listbox-option-${I()}`, a3 = r8.activeOptionIndex !== null ? r8.options[r8.activeOptionIndex].id === u7 : false, y4 = u2(r8.propsRef.current.mode, { [1]: () => r8.propsRef.current.value.includes(o9), [0]: () => r8.propsRef.current.value === o9 }), g6 = (0, import_react26.useRef)(null), v7 = T(n2, g6);
  t(() => {
    if (r8.listboxState !== 0 || !a3 || r8.activationTrigger === 0)
      return;
    let T7 = o();
    return T7.requestAnimationFrame(() => {
      var x7, j8;
      (j8 = (x7 = g6.current) == null ? void 0 : x7.scrollIntoView) == null || j8.call(x7, { block: "nearest" });
    }), T7.dispose;
  }, [g6, a3, r8.listboxState, r8.activationTrigger, r8.activeOptionIndex]);
  let f11 = (0, import_react26.useRef)({ disabled: e4, value: o9, domRef: g6 });
  t(() => {
    f11.current.disabled = e4;
  }, [f11, e4]), t(() => {
    f11.current.value = o9;
  }, [f11, o9]), t(() => {
    var T7, x7;
    f11.current.textValue = (x7 = (T7 = g6.current) == null ? void 0 : T7.textContent) == null ? void 0 : x7.toLowerCase();
  }, [f11, g6]);
  let O10 = (0, import_react26.useCallback)(() => r8.propsRef.current.onChange(o9), [r8.propsRef, o9]);
  t(() => (s9({ type: 7, id: u7, dataRef: f11 }), () => s9({ type: 8, id: u7 })), [f11, u7]);
  let S2 = (0, import_react26.useCallback)((T7) => {
    if (e4)
      return T7.preventDefault();
    O10(), r8.propsRef.current.mode === 0 && (s9({ type: 1 }), o().nextFrame(() => {
      var x7;
      return (x7 = r8.buttonRef.current) == null ? void 0 : x7.focus({ preventScroll: true });
    }));
  }, [s9, r8.buttonRef, e4, O10]), d7 = (0, import_react26.useCallback)(() => {
    if (e4)
      return s9({ type: 4, focus: a2.Nothing });
    s9({ type: 4, focus: a2.Specific, id: u7 });
  }, [e4, u7, s9]), l9 = (0, import_react26.useCallback)(() => {
    e4 || a3 || s9({ type: 4, focus: a2.Specific, id: u7, trigger: 0 });
  }, [e4, a3, u7, s9]), c8 = (0, import_react26.useCallback)(() => {
    e4 || !a3 || s9({ type: 4, focus: a2.Nothing });
  }, [e4, a3, s9]), P3 = (0, import_react26.useMemo)(() => ({ active: a3, selected: y4, disabled: e4 }), [a3, y4, e4]);
  return A({ ourProps: { id: u7, ref: v7, role: "option", tabIndex: e4 === true ? void 0 : -1, "aria-disabled": e4 === true ? true : void 0, "aria-selected": y4 === true ? true : void 0, disabled: void 0, onClick: S2, onFocus: d7, onPointerMove: l9, onMouseMove: l9, onPointerLeave: c8, onMouseLeave: c8 }, theirProps: p12, slot: P3, defaultTag: Se3, name: "Listbox.Option" });
});
var et = Object.assign(xe2, { Button: Oe2, Label: Re, Options: ve2, Option: Ae3 });

// node_modules/@headlessui/react/dist/components/menu/menu.js
var import_react27 = __toESM(require_react(), 1);
var oe2 = ((a3) => (a3[a3.Open = 0] = "Open", a3[a3.Closed = 1] = "Closed", a3))(oe2 || {});
var ae2 = ((a3) => (a3[a3.Pointer = 0] = "Pointer", a3[a3.Other = 1] = "Other", a3))(ae2 || {});
var ie2 = ((o9) => (o9[o9.OpenMenu = 0] = "OpenMenu", o9[o9.CloseMenu = 1] = "CloseMenu", o9[o9.GoToItem = 2] = "GoToItem", o9[o9.Search = 3] = "Search", o9[o9.ClearSearch = 4] = "ClearSearch", o9[o9.RegisterItem = 5] = "RegisterItem", o9[o9.UnregisterItem = 6] = "UnregisterItem", o9))(ie2 || {});
function k4(t10, i9 = (a3) => a3) {
  let a3 = t10.activeItemIndex !== null ? t10.items[t10.activeItemIndex] : null, e4 = h2(i9(t10.items.slice()), (u7) => u7.dataRef.current.domRef.current), r8 = a3 ? e4.indexOf(a3) : null;
  return r8 === -1 && (r8 = null), { items: e4, activeItemIndex: r8 };
}
var ue2 = { [1](t10) {
  return t10.menuState === 1 ? t10 : __spreadProps(__spreadValues({}, t10), { activeItemIndex: null, menuState: 1 });
}, [0](t10) {
  return t10.menuState === 0 ? t10 : __spreadProps(__spreadValues({}, t10), { menuState: 0 });
}, [2]: (t10, i9) => {
  var r8;
  let a3 = k4(t10), e4 = x2(i9, { resolveItems: () => a3.items, resolveActiveIndex: () => a3.activeItemIndex, resolveId: (u7) => u7.id, resolveDisabled: (u7) => u7.dataRef.current.disabled });
  return __spreadProps(__spreadValues(__spreadValues({}, t10), a3), { searchQuery: "", activeItemIndex: e4, activationTrigger: (r8 = i9.trigger) != null ? r8 : 1 });
}, [3]: (t10, i9) => {
  let e4 = t10.searchQuery !== "" ? 0 : 1, r8 = t10.searchQuery + i9.value.toLowerCase(), s9 = (t10.activeItemIndex !== null ? t10.items.slice(t10.activeItemIndex + e4).concat(t10.items.slice(0, t10.activeItemIndex + e4)) : t10.items).find((l9) => {
    var p12;
    return ((p12 = l9.dataRef.current.textValue) == null ? void 0 : p12.startsWith(r8)) && !l9.dataRef.current.disabled;
  }), o9 = s9 ? t10.items.indexOf(s9) : -1;
  return o9 === -1 || o9 === t10.activeItemIndex ? __spreadProps(__spreadValues({}, t10), { searchQuery: r8 }) : __spreadProps(__spreadValues({}, t10), { searchQuery: r8, activeItemIndex: o9, activationTrigger: 1 });
}, [4](t10) {
  return t10.searchQuery === "" ? t10 : __spreadProps(__spreadValues({}, t10), { searchQuery: "", searchActiveItemIndex: null });
}, [5]: (t10, i9) => {
  let a3 = k4(t10, (e4) => [...e4, { id: i9.id, dataRef: i9.dataRef }]);
  return __spreadValues(__spreadValues({}, t10), a3);
}, [6]: (t10, i9) => {
  let a3 = k4(t10, (e4) => {
    let r8 = e4.findIndex((u7) => u7.id === i9.id);
    return r8 !== -1 && e4.splice(r8, 1), e4;
  });
  return __spreadProps(__spreadValues(__spreadValues({}, t10), a3), { activationTrigger: 1 });
} };
var w5 = (0, import_react27.createContext)(null);
w5.displayName = "MenuContext";
function C5(t10) {
  let i9 = (0, import_react27.useContext)(w5);
  if (i9 === null) {
    let a3 = new Error(`<${t10} /> is missing a parent <Menu /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(a3, C5), a3;
  }
  return i9;
}
function se3(t10, i9) {
  return u2(i9.type, ue2, t10, i9);
}
var le3 = import_react27.Fragment;
var ce2 = H(function(i9, a3) {
  let e4 = (0, import_react27.useReducer)(se3, { menuState: 1, buttonRef: (0, import_react27.createRef)(), itemsRef: (0, import_react27.createRef)(), items: [], searchQuery: "", activeItemIndex: null, activationTrigger: 1 }), [{ menuState: r8, itemsRef: u7, buttonRef: s9 }, o9] = e4, l9 = T(a3);
  w([s9, u7], (M8, R5) => {
    var T7;
    r8 === 0 && (o9({ type: 1 }), O(R5, T3.Loose) || (M8.preventDefault(), (T7 = s9.current) == null || T7.focus()));
  });
  let p12 = (0, import_react27.useMemo)(() => ({ open: r8 === 0 }), [r8]), g6 = i9, f11 = { ref: l9 };
  return import_react27.default.createElement(w5.Provider, { value: e4 }, import_react27.default.createElement(C2, { value: u2(r8, { [0]: p4.Open, [1]: p4.Closed }) }, A({ ourProps: f11, theirProps: g6, slot: p12, defaultTag: le3, name: "Menu" })));
});
var pe3 = "button";
var de2 = H(function(i9, a3) {
  var T7;
  let [e4, r8] = C5("Menu.Button"), u7 = T(e4.buttonRef, a3), s9 = `headlessui-menu-button-${I()}`, o9 = p(), l9 = (0, import_react27.useCallback)((c8) => {
    switch (c8.key) {
      case o5.Space:
      case o5.Enter:
      case o5.ArrowDown:
        c8.preventDefault(), c8.stopPropagation(), r8({ type: 0 }), o9.nextFrame(() => r8({ type: 2, focus: a2.First }));
        break;
      case o5.ArrowUp:
        c8.preventDefault(), c8.stopPropagation(), r8({ type: 0 }), o9.nextFrame(() => r8({ type: 2, focus: a2.Last }));
        break;
    }
  }, [r8, o9]), p12 = (0, import_react27.useCallback)((c8) => {
    switch (c8.key) {
      case o5.Space:
        c8.preventDefault();
        break;
    }
  }, []), g6 = (0, import_react27.useCallback)((c8) => {
    if (r3(c8.currentTarget))
      return c8.preventDefault();
    i9.disabled || (e4.menuState === 0 ? (r8({ type: 1 }), o9.nextFrame(() => {
      var b9;
      return (b9 = e4.buttonRef.current) == null ? void 0 : b9.focus({ preventScroll: true });
    })) : (c8.preventDefault(), c8.stopPropagation(), r8({ type: 0 })));
  }, [r8, o9, e4, i9.disabled]), f11 = (0, import_react27.useMemo)(() => ({ open: e4.menuState === 0 }), [e4]), M8 = i9, R5 = { ref: u7, id: s9, type: s6(i9, e4.buttonRef), "aria-haspopup": true, "aria-controls": (T7 = e4.itemsRef.current) == null ? void 0 : T7.id, "aria-expanded": i9.disabled ? void 0 : e4.menuState === 0, onKeyDown: l9, onKeyUp: p12, onClick: g6 };
  return A({ ourProps: R5, theirProps: M8, slot: f11, defaultTag: pe3, name: "Menu.Button" });
});
var me2 = "div";
var fe2 = b.RenderStrategy | b.Static;
var Te2 = H(function(i9, a3) {
  var b9, O10;
  let [e4, r8] = C5("Menu.Items"), u7 = T(e4.itemsRef, a3), s9 = n(e4.itemsRef), o9 = `headlessui-menu-items-${I()}`, l9 = p(), p12 = s5(), g6 = (() => p12 !== null ? p12 === p4.Open : e4.menuState === 0)();
  (0, import_react27.useEffect)(() => {
    let n2 = e4.itemsRef.current;
    !n2 || e4.menuState === 0 && n2 !== (s9 == null ? void 0 : s9.activeElement) && n2.focus({ preventScroll: true });
  }, [e4.menuState, e4.itemsRef, s9]), F2({ container: e4.itemsRef.current, enabled: e4.menuState === 0, accept(n2) {
    return n2.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : n2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(n2) {
    n2.setAttribute("role", "none");
  } });
  let f11 = (0, import_react27.useCallback)((n2) => {
    var m12, S2;
    switch (l9.dispose(), n2.key) {
      case o5.Space:
        if (e4.searchQuery !== "")
          return n2.preventDefault(), n2.stopPropagation(), r8({ type: 3, value: n2.key });
      case o5.Enter:
        if (n2.preventDefault(), n2.stopPropagation(), r8({ type: 1 }), e4.activeItemIndex !== null) {
          let { dataRef: A4 } = e4.items[e4.activeItemIndex];
          (S2 = (m12 = A4.current) == null ? void 0 : m12.domRef.current) == null || S2.click();
        }
        o().nextFrame(() => {
          var A4;
          return (A4 = e4.buttonRef.current) == null ? void 0 : A4.focus({ preventScroll: true });
        });
        break;
      case o5.ArrowDown:
        return n2.preventDefault(), n2.stopPropagation(), r8({ type: 2, focus: a2.Next });
      case o5.ArrowUp:
        return n2.preventDefault(), n2.stopPropagation(), r8({ type: 2, focus: a2.Previous });
      case o5.Home:
      case o5.PageUp:
        return n2.preventDefault(), n2.stopPropagation(), r8({ type: 2, focus: a2.First });
      case o5.End:
      case o5.PageDown:
        return n2.preventDefault(), n2.stopPropagation(), r8({ type: 2, focus: a2.Last });
      case o5.Escape:
        n2.preventDefault(), n2.stopPropagation(), r8({ type: 1 }), o().nextFrame(() => {
          var A4;
          return (A4 = e4.buttonRef.current) == null ? void 0 : A4.focus({ preventScroll: true });
        });
        break;
      case o5.Tab:
        n2.preventDefault(), n2.stopPropagation();
        break;
      default:
        n2.key.length === 1 && (r8({ type: 3, value: n2.key }), l9.setTimeout(() => r8({ type: 4 }), 350));
        break;
    }
  }, [r8, l9, e4, s9]), M8 = (0, import_react27.useCallback)((n2) => {
    switch (n2.key) {
      case o5.Space:
        n2.preventDefault();
        break;
    }
  }, []), R5 = (0, import_react27.useMemo)(() => ({ open: e4.menuState === 0 }), [e4]), T7 = i9, c8 = { "aria-activedescendant": e4.activeItemIndex === null || (b9 = e4.items[e4.activeItemIndex]) == null ? void 0 : b9.id, "aria-labelledby": (O10 = e4.buttonRef.current) == null ? void 0 : O10.id, id: o9, onKeyDown: f11, onKeyUp: M8, role: "menu", tabIndex: 0, ref: u7 };
  return A({ ourProps: c8, theirProps: T7, slot: R5, defaultTag: me2, features: fe2, visible: g6, name: "Menu.Items" });
});
var Ie3 = import_react27.Fragment;
var ye3 = H(function(i9, a3) {
  let _a = i9, { disabled: e4 = false } = _a, r8 = __objRest(_a, ["disabled"]), [u7, s9] = C5("Menu.Item"), o9 = `headlessui-menu-item-${I()}`, l9 = u7.activeItemIndex !== null ? u7.items[u7.activeItemIndex].id === o9 : false, p12 = (0, import_react27.useRef)(null), g6 = T(a3, p12);
  t(() => {
    if (u7.menuState !== 0 || !l9 || u7.activationTrigger === 0)
      return;
    let n2 = o();
    return n2.requestAnimationFrame(() => {
      var m12, S2;
      (S2 = (m12 = p12.current) == null ? void 0 : m12.scrollIntoView) == null || S2.call(m12, { block: "nearest" });
    }), n2.dispose;
  }, [p12, l9, u7.menuState, u7.activationTrigger, u7.activeItemIndex]);
  let f11 = (0, import_react27.useRef)({ disabled: e4, domRef: p12 });
  t(() => {
    f11.current.disabled = e4;
  }, [f11, e4]), t(() => {
    var n2, m12;
    f11.current.textValue = (m12 = (n2 = p12.current) == null ? void 0 : n2.textContent) == null ? void 0 : m12.toLowerCase();
  }, [f11, p12]), t(() => (s9({ type: 5, id: o9, dataRef: f11 }), () => s9({ type: 6, id: o9 })), [f11, o9]);
  let M8 = (0, import_react27.useCallback)((n2) => {
    if (e4)
      return n2.preventDefault();
    s9({ type: 1 }), o().nextFrame(() => {
      var m12;
      return (m12 = u7.buttonRef.current) == null ? void 0 : m12.focus({ preventScroll: true });
    });
  }, [s9, u7.buttonRef, e4]), R5 = (0, import_react27.useCallback)(() => {
    if (e4)
      return s9({ type: 2, focus: a2.Nothing });
    s9({ type: 2, focus: a2.Specific, id: o9 });
  }, [e4, o9, s9]), T7 = (0, import_react27.useCallback)(() => {
    e4 || l9 || s9({ type: 2, focus: a2.Specific, id: o9, trigger: 0 });
  }, [e4, l9, o9, s9]), c8 = (0, import_react27.useCallback)(() => {
    e4 || !l9 || s9({ type: 2, focus: a2.Nothing });
  }, [e4, l9, s9]), b9 = (0, import_react27.useMemo)(() => ({ active: l9, disabled: e4 }), [l9, e4]);
  return A({ ourProps: { id: o9, ref: g6, role: "menuitem", tabIndex: e4 === true ? void 0 : -1, "aria-disabled": e4 === true ? true : void 0, disabled: void 0, onClick: M8, onFocus: R5, onPointerMove: T7, onMouseMove: T7, onPointerLeave: c8, onMouseLeave: c8 }, theirProps: r8, slot: b9, defaultTag: Ie3, name: "Menu.Item" });
});
var Qe = Object.assign(ce2, { Button: de2, Items: Te2, Item: ye3 });

// node_modules/@headlessui/react/dist/components/popover/popover.js
var import_react28 = __toESM(require_react(), 1);
var ve3 = ((f11) => (f11[f11.Open = 0] = "Open", f11[f11.Closed = 1] = "Closed", f11))(ve3 || {});
var ce3 = ((l9) => (l9[l9.TogglePopover = 0] = "TogglePopover", l9[l9.ClosePopover = 1] = "ClosePopover", l9[l9.SetButton = 2] = "SetButton", l9[l9.SetButtonId = 3] = "SetButtonId", l9[l9.SetPanel = 4] = "SetPanel", l9[l9.SetPanelId = 5] = "SetPanelId", l9))(ce3 || {});
var de3 = { [0]: (a3) => __spreadProps(__spreadValues({}, a3), { popoverState: u2(a3.popoverState, { [0]: 1, [1]: 0 }) }), [1](a3) {
  return a3.popoverState === 1 ? a3 : __spreadProps(__spreadValues({}, a3), { popoverState: 1 });
}, [2](a3, o9) {
  return a3.button === o9.button ? a3 : __spreadProps(__spreadValues({}, a3), { button: o9.button });
}, [3](a3, o9) {
  return a3.buttonId === o9.buttonId ? a3 : __spreadProps(__spreadValues({}, a3), { buttonId: o9.buttonId });
}, [4](a3, o9) {
  return a3.panel === o9.panel ? a3 : __spreadProps(__spreadValues({}, a3), { panel: o9.panel });
}, [5](a3, o9) {
  return a3.panelId === o9.panelId ? a3 : __spreadProps(__spreadValues({}, a3), { panelId: o9.panelId });
} };
var z2 = (0, import_react28.createContext)(null);
z2.displayName = "PopoverContext";
function N4(a3) {
  let o9 = (0, import_react28.useContext)(z2);
  if (o9 === null) {
    let f11 = new Error(`<${a3} /> is missing a parent <Popover /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(f11, N4), f11;
  }
  return o9;
}
var J = (0, import_react28.createContext)(null);
J.displayName = "PopoverAPIContext";
function oe3(a3) {
  let o9 = (0, import_react28.useContext)(J);
  if (o9 === null) {
    let f11 = new Error(`<${a3} /> is missing a parent <Popover /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(f11, oe3), f11;
  }
  return o9;
}
var Q5 = (0, import_react28.createContext)(null);
Q5.displayName = "PopoverGroupContext";
function re2() {
  return (0, import_react28.useContext)(Q5);
}
var X3 = (0, import_react28.createContext)(null);
X3.displayName = "PopoverPanelContext";
function ye4() {
  return (0, import_react28.useContext)(X3);
}
function Te3(a3, o9) {
  return u2(o9.type, de3, a3, o9);
}
var Ee3 = "div";
var Se4 = H(function(o9, f11) {
  let e4 = `headlessui-popover-button-${I()}`, P3 = `headlessui-popover-panel-${I()}`, n2 = (0, import_react28.useRef)(null), l9 = T(f11, n2), i9 = n(n2), s9 = (0, import_react28.useReducer)(Te3, { popoverState: 1, button: null, buttonId: e4, panel: null, panelId: P3 }), [{ popoverState: v7, button: t10, panel: E5 }, u7] = s9;
  (0, import_react28.useEffect)(() => u7({ type: 3, buttonId: e4 }), [e4, u7]), (0, import_react28.useEffect)(() => u7({ type: 5, panelId: P3 }), [P3, u7]);
  let S2 = (0, import_react28.useMemo)(() => ({ buttonId: e4, panelId: P3, close: () => u7({ type: 1 }) }), [e4, P3, u7]), c8 = re2(), d7 = c8 == null ? void 0 : c8.registerPopover, p12 = (0, import_react28.useCallback)(() => {
    var r8;
    return (r8 = c8 == null ? void 0 : c8.isFocusWithinPopoverGroup()) != null ? r8 : (i9 == null ? void 0 : i9.activeElement) && ((t10 == null ? void 0 : t10.contains(i9.activeElement)) || (E5 == null ? void 0 : E5.contains(i9.activeElement)));
  }, [c8, t10, E5]);
  (0, import_react28.useEffect)(() => d7 == null ? void 0 : d7(S2), [d7, S2]), E3(i9 == null ? void 0 : i9.defaultView, "focus", () => {
    v7 === 0 && (p12() || !t10 || !E5 || u7({ type: 1 }));
  }, true), w([t10, E5], (r8, T7) => {
    v7 === 0 && (u7({ type: 1 }), O(T7, T3.Loose) || (r8.preventDefault(), t10 == null || t10.focus()));
  });
  let y4 = (0, import_react28.useCallback)((r8) => {
    u7({ type: 1 });
    let T7 = (() => r8 ? r8 instanceof HTMLElement ? r8 : r8.current instanceof HTMLElement ? r8.current : t10 : t10)();
    T7 == null || T7.focus();
  }, [u7, t10]), b9 = (0, import_react28.useMemo)(() => ({ close: y4 }), [y4]), g6 = (0, import_react28.useMemo)(() => ({ open: v7 === 0, close: y4 }), [v7, y4]), C9 = o9, h7 = { ref: l9 };
  return import_react28.default.createElement(z2.Provider, { value: s9 }, import_react28.default.createElement(J.Provider, { value: b9 }, import_react28.default.createElement(C2, { value: u2(v7, { [0]: p4.Open, [1]: p4.Closed }) }, A({ ourProps: h7, theirProps: C9, slot: g6, defaultTag: Ee3, name: "Popover" }))));
});
var be3 = "button";
var me3 = H(function(o9, f11) {
  let [e4, P3] = N4("Popover.Button"), n2 = (0, import_react28.useRef)(null), l9 = re2(), i9 = l9 == null ? void 0 : l9.closeOthers, s9 = ye4(), v7 = s9 === null ? false : s9 === e4.panelId, t10 = T(n2, f11, v7 ? null : (r8) => P3({ type: 2, button: r8 })), E5 = T(n2, f11), u7 = n(n2), S2 = (0, import_react28.useRef)(null), c8 = (0, import_react28.useRef)(null);
  E3(u7 == null ? void 0 : u7.defaultView, "focus", () => {
    c8.current = S2.current, S2.current = u7 == null ? void 0 : u7.activeElement;
  }, true);
  let d7 = (0, import_react28.useCallback)((r8) => {
    var T7, R5, k6, V6;
    if (v7) {
      if (e4.popoverState === 1)
        return;
      switch (r8.key) {
        case o5.Space:
        case o5.Enter:
          r8.preventDefault(), (R5 = (T7 = r8.target).click) == null || R5.call(T7), P3({ type: 1 }), (k6 = e4.button) == null || k6.focus();
          break;
      }
    } else
      switch (r8.key) {
        case o5.Space:
        case o5.Enter:
          r8.preventDefault(), r8.stopPropagation(), e4.popoverState === 1 && (i9 == null || i9(e4.buttonId)), P3({ type: 0 });
          break;
        case o5.Escape:
          if (e4.popoverState !== 0)
            return i9 == null ? void 0 : i9(e4.buttonId);
          if (!n2.current || (u7 == null ? void 0 : u7.activeElement) && !n2.current.contains(u7.activeElement))
            return;
          r8.preventDefault(), r8.stopPropagation(), P3({ type: 1 });
          break;
        case o5.Tab:
          if (e4.popoverState !== 0 || !e4.panel || !e4.button)
            return;
          if (r8.shiftKey) {
            if (!c8.current || (V6 = e4.button) != null && V6.contains(c8.current) || e4.panel.contains(c8.current))
              return;
            let Z5 = N(u7 == null ? void 0 : u7.body), ne4 = Z5.indexOf(c8.current);
            if (Z5.indexOf(e4.button) > ne4)
              return;
            r8.preventDefault(), r8.stopPropagation(), F3(e4.panel, E2.Last);
          } else
            r8.preventDefault(), r8.stopPropagation(), F3(e4.panel, E2.First);
          break;
      }
  }, [P3, e4.popoverState, e4.buttonId, e4.button, e4.panel, n2, i9, v7]), p12 = (0, import_react28.useCallback)((r8) => {
    var T7;
    if (!v7 && (r8.key === o5.Space && r8.preventDefault(), e4.popoverState === 0 && !!e4.panel && !!e4.button))
      switch (r8.key) {
        case o5.Tab:
          if (!c8.current || (T7 = e4.button) != null && T7.contains(c8.current) || e4.panel.contains(c8.current))
            return;
          let R5 = N(u7 == null ? void 0 : u7.body), k6 = R5.indexOf(c8.current);
          if (R5.indexOf(e4.button) > k6)
            return;
          r8.preventDefault(), r8.stopPropagation(), F3(e4.panel, E2.Last);
          break;
      }
  }, [e4.popoverState, e4.panel, e4.button, v7]), y4 = (0, import_react28.useCallback)((r8) => {
    var T7, R5;
    r3(r8.currentTarget) || o9.disabled || (v7 ? (P3({ type: 1 }), (T7 = e4.button) == null || T7.focus()) : (r8.preventDefault(), r8.stopPropagation(), e4.popoverState === 1 && (i9 == null || i9(e4.buttonId)), (R5 = e4.button) == null || R5.focus(), P3({ type: 0 })));
  }, [P3, e4.button, e4.popoverState, e4.buttonId, o9.disabled, i9, v7]), b9 = (0, import_react28.useMemo)(() => ({ open: e4.popoverState === 0 }), [e4]), g6 = s6(o9, n2), C9 = o9, h7 = v7 ? { ref: E5, type: g6, onKeyDown: d7, onClick: y4 } : { ref: t10, id: e4.buttonId, type: g6, "aria-expanded": o9.disabled ? void 0 : e4.popoverState === 0, "aria-controls": e4.panel ? e4.panelId : void 0, onKeyDown: d7, onKeyUp: p12, onClick: y4 };
  return A({ ourProps: h7, theirProps: C9, slot: b9, defaultTag: be3, name: "Popover.Button" });
});
var ge2 = "div";
var Ae4 = b.RenderStrategy | b.Static;
var Ce2 = H(function(o9, f11) {
  let [{ popoverState: e4 }, P3] = N4("Popover.Overlay"), n2 = T(f11), l9 = `headlessui-popover-overlay-${I()}`, i9 = s5(), s9 = (() => i9 !== null ? i9 === p4.Open : e4 === 0)(), v7 = (0, import_react28.useCallback)((S2) => {
    if (r3(S2.currentTarget))
      return S2.preventDefault();
    P3({ type: 1 });
  }, [P3]), t10 = (0, import_react28.useMemo)(() => ({ open: e4 === 0 }), [e4]);
  return A({ ourProps: { ref: n2, id: l9, "aria-hidden": true, onClick: v7 }, theirProps: o9, slot: t10, defaultTag: ge2, features: Ae4, visible: s9, name: "Popover.Overlay" });
});
var Re2 = "div";
var Oe3 = b.RenderStrategy | b.Static;
var Ie4 = H(function(o9, f11) {
  let _a = o9, { focus: e4 = false } = _a, P3 = __objRest(_a, ["focus"]), [n2, l9] = N4("Popover.Panel"), { close: i9 } = oe3("Popover.Panel"), s9 = (0, import_react28.useRef)(null), v7 = T(s9, f11, (p12) => {
    l9({ type: 4, panel: p12 });
  }), t10 = n(s9), E5 = s5(), u7 = (() => E5 !== null ? E5 === p4.Open : n2.popoverState === 0)(), S2 = (0, import_react28.useCallback)((p12) => {
    var y4;
    switch (p12.key) {
      case o5.Escape:
        if (n2.popoverState !== 0 || !s9.current || (t10 == null ? void 0 : t10.activeElement) && !s9.current.contains(t10.activeElement))
          return;
        p12.preventDefault(), p12.stopPropagation(), l9({ type: 1 }), (y4 = n2.button) == null || y4.focus();
        break;
    }
  }, [n2, s9, l9]);
  (0, import_react28.useEffect)(() => () => l9({ type: 4, panel: null }), [l9]), (0, import_react28.useEffect)(() => {
    var p12;
    o9.static || n2.popoverState === 1 && ((p12 = o9.unmount) != null ? p12 : true) && l9({ type: 4, panel: null });
  }, [n2.popoverState, o9.unmount, o9.static, l9]), (0, import_react28.useEffect)(() => {
    if (!e4 || n2.popoverState !== 0 || !s9.current)
      return;
    let p12 = t10 == null ? void 0 : t10.activeElement;
    s9.current.contains(p12) || F3(s9.current, E2.First);
  }, [e4, s9, n2.popoverState]), E3(t10 == null ? void 0 : t10.defaultView, "keydown", (p12) => {
    var b9;
    if (n2.popoverState !== 0 || !s9.current || p12.key !== o5.Tab || !(t10 != null && t10.activeElement) || !s9.current || !s9.current.contains(t10.activeElement))
      return;
    p12.preventDefault();
    let y4 = F3(s9.current, p12.shiftKey ? E2.Previous : E2.Next);
    if (y4 === p5.Underflow)
      return (b9 = n2.button) == null ? void 0 : b9.focus();
    if (y4 === p5.Overflow) {
      if (!n2.button)
        return;
      let g6 = N(t10.body), C9 = g6.indexOf(n2.button), h7 = g6.splice(C9 + 1).filter((r8) => {
        var T7;
        return !((T7 = s9.current) != null && T7.contains(r8));
      });
      F3(h7, E2.First) === p5.Error && F3(t10.body, E2.First);
    }
  }), E3(t10 == null ? void 0 : t10.defaultView, "focus", () => {
    var p12;
    !e4 || n2.popoverState === 0 && (!s9.current || (t10 == null ? void 0 : t10.activeElement) && ((p12 = s9.current) == null ? void 0 : p12.contains(t10.activeElement)) || l9({ type: 1 }));
  }, true);
  let c8 = (0, import_react28.useMemo)(() => ({ open: n2.popoverState === 0, close: i9 }), [n2, i9]), d7 = { ref: v7, id: n2.panelId, onKeyDown: S2 };
  return import_react28.default.createElement(X3.Provider, { value: n2.panelId }, A({ ourProps: d7, theirProps: P3, slot: c8, defaultTag: Re2, features: Oe3, visible: u7, name: "Popover.Panel" }));
});
var Le4 = "div";
var xe3 = H(function(o9, f11) {
  let e4 = (0, import_react28.useRef)(null), P3 = T(e4, f11), [n2, l9] = (0, import_react28.useState)([]), i9 = (0, import_react28.useCallback)((d7) => {
    l9((p12) => {
      let y4 = p12.indexOf(d7);
      if (y4 !== -1) {
        let b9 = p12.slice();
        return b9.splice(y4, 1), b9;
      }
      return p12;
    });
  }, [l9]), s9 = (0, import_react28.useCallback)((d7) => (l9((p12) => [...p12, d7]), () => i9(d7)), [l9, i9]), v7 = (0, import_react28.useCallback)(() => {
    var y4;
    let d7 = t6(e4);
    if (!d7)
      return false;
    let p12 = d7.activeElement;
    return (y4 = e4.current) != null && y4.contains(p12) ? true : n2.some((b9) => {
      var g6, C9;
      return ((g6 = d7.getElementById(b9.buttonId)) == null ? void 0 : g6.contains(p12)) || ((C9 = d7.getElementById(b9.panelId)) == null ? void 0 : C9.contains(p12));
    });
  }, [e4, n2]), t10 = (0, import_react28.useCallback)((d7) => {
    for (let p12 of n2)
      p12.buttonId !== d7 && p12.close();
  }, [n2]), E5 = (0, import_react28.useMemo)(() => ({ registerPopover: s9, unregisterPopover: i9, isFocusWithinPopoverGroup: v7, closeOthers: t10 }), [s9, i9, v7, t10]), u7 = (0, import_react28.useMemo)(() => ({}), []), S2 = o9, c8 = { ref: P3 };
  return import_react28.default.createElement(Q5.Provider, { value: E5 }, A({ ourProps: c8, theirProps: S2, slot: u7, defaultTag: Le4, name: "Popover.Group" }));
});
var tt = Object.assign(Se4, { Button: me3, Overlay: Ce2, Panel: Ie4, Group: xe3 });

// node_modules/@headlessui/react/dist/components/radio-group/radio-group.js
var import_react31 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/hooks/use-flags.js
var import_react29 = __toESM(require_react(), 1);
function b6(g6 = 0) {
  let [r8, l9] = (0, import_react29.useState)(g6), u7 = (0, import_react29.useCallback)((e4) => l9((a3) => a3 | e4), [l9]), n2 = (0, import_react29.useCallback)((e4) => Boolean(r8 & e4), [r8]), o9 = (0, import_react29.useCallback)((e4) => l9((a3) => a3 & ~e4), [l9]), s9 = (0, import_react29.useCallback)((e4) => l9((a3) => a3 ^ e4), [l9]);
  return { addFlag: u7, hasFlag: n2, removeFlag: o9, toggleFlag: s9 };
}

// node_modules/@headlessui/react/dist/components/label/label.js
var import_react30 = __toESM(require_react(), 1);
var c5 = (0, import_react30.createContext)(null);
function f10() {
  let l9 = (0, import_react30.useContext)(c5);
  if (l9 === null) {
    let t10 = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(t10, f10), t10;
  }
  return l9;
}
function B4() {
  let [l9, t10] = (0, import_react30.useState)([]);
  return [l9.length > 0 ? l9.join(" ") : void 0, (0, import_react30.useMemo)(() => function(e4) {
    let o9 = (0, import_react30.useCallback)((a3) => (t10((i9) => [...i9, a3]), () => t10((i9) => {
      let n2 = i9.slice(), d7 = n2.indexOf(a3);
      return d7 !== -1 && n2.splice(d7, 1), n2;
    })), []), r8 = (0, import_react30.useMemo)(() => ({ register: o9, slot: e4.slot, name: e4.name, props: e4.props }), [o9, e4.slot, e4.name, e4.props]);
    return import_react30.default.createElement(c5.Provider, { value: r8 }, e4.children);
  }, [t10])];
}
var v3 = "label";
var M5 = H(function(t10, s9) {
  let _a = t10, { passive: e4 = false } = _a, o9 = __objRest(_a, ["passive"]), r8 = f10(), a3 = `headlessui-label-${I()}`, i9 = T(s9);
  t(() => r8.register(a3), [a3, r8.register]);
  let n2 = __spreadProps(__spreadValues({ ref: i9 }, r8.props), { id: a3 });
  return e4 && ("onClick" in n2 && delete n2.onClick, "onClick" in o9 && delete o9.onClick), A({ ourProps: n2, theirProps: o9, slot: r8.slot || {}, defaultTag: v3, name: r8.name || "Label" });
});

// node_modules/@headlessui/react/dist/components/radio-group/radio-group.js
var de4 = ((t10) => (t10[t10.RegisterOption = 0] = "RegisterOption", t10[t10.UnregisterOption = 1] = "UnregisterOption", t10))(de4 || {});
var se4 = { [0](n2, o9) {
  let t10 = [...n2.options, { id: o9.id, element: o9.element, propsRef: o9.propsRef }];
  return __spreadProps(__spreadValues({}, n2), { options: h2(t10, (r8) => r8.element.current) });
}, [1](n2, o9) {
  let t10 = n2.options.slice(), r8 = n2.options.findIndex((m12) => m12.id === o9.id);
  return r8 === -1 ? n2 : (t10.splice(r8, 1), __spreadProps(__spreadValues({}, n2), { options: t10 }));
} };
var U4 = (0, import_react31.createContext)(null);
U4.displayName = "RadioGroupContext";
function z3(n2) {
  let o9 = (0, import_react31.useContext)(U4);
  if (o9 === null) {
    let t10 = new Error(`<${n2} /> is missing a parent <RadioGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t10, z3), t10;
  }
  return o9;
}
function ue3(n2, o9) {
  return u2(o9.type, se4, n2, o9);
}
var ce4 = "div";
var fe3 = H(function(o9, t10) {
  let _a = o9, { value: r8, name: m12, onChange: f11, disabled: R5 = false } = _a, I3 = __objRest(_a, ["value", "name", "onChange", "disabled"]), [{ options: a3 }, A4] = (0, import_react31.useReducer)(ue3, { options: [] }), [T7, C9] = B4(), [k6, c8] = M3(), y4 = `headlessui-radiogroup-${I()}`, g6 = (0, import_react31.useRef)(null), b9 = T(g6, t10), E5 = (0, import_react31.useMemo)(() => a3.find((e4) => !e4.propsRef.current.disabled), [a3]), D6 = (0, import_react31.useMemo)(() => a3.some((e4) => e4.propsRef.current.value === r8), [a3, r8]), s9 = (0, import_react31.useCallback)((e4) => {
    var i9;
    if (R5 || e4 === r8)
      return false;
    let d7 = (i9 = a3.find((p12) => p12.propsRef.current.value === e4)) == null ? void 0 : i9.propsRef.current;
    return d7 != null && d7.disabled ? false : (f11(e4), true);
  }, [f11, r8, R5, a3]);
  F2({ container: g6.current, accept(e4) {
    return e4.getAttribute("role") === "radio" ? NodeFilter.FILTER_REJECT : e4.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(e4) {
    e4.setAttribute("role", "none");
  } });
  let h7 = (0, import_react31.useCallback)((e4) => {
    let d7 = g6.current;
    if (!d7)
      return;
    let i9 = t6(d7), p12 = a3.filter((l9) => l9.propsRef.current.disabled === false).map((l9) => l9.element.current);
    switch (e4.key) {
      case o5.Enter:
        p6(e4.currentTarget);
        break;
      case o5.ArrowLeft:
      case o5.ArrowUp:
        if (e4.preventDefault(), e4.stopPropagation(), F3(p12, E2.Previous | E2.WrapAround) === p5.Success) {
          let u7 = a3.find((G5) => G5.element.current === (i9 == null ? void 0 : i9.activeElement));
          u7 && s9(u7.propsRef.current.value);
        }
        break;
      case o5.ArrowRight:
      case o5.ArrowDown:
        if (e4.preventDefault(), e4.stopPropagation(), F3(p12, E2.Next | E2.WrapAround) === p5.Success) {
          let u7 = a3.find((G5) => G5.element.current === (i9 == null ? void 0 : i9.activeElement));
          u7 && s9(u7.propsRef.current.value);
        }
        break;
      case o5.Space:
        {
          e4.preventDefault(), e4.stopPropagation();
          let l9 = a3.find((u7) => u7.element.current === (i9 == null ? void 0 : i9.activeElement));
          l9 && s9(l9.propsRef.current.value);
        }
        break;
    }
  }, [g6, a3, s9]), L8 = (0, import_react31.useCallback)((e4) => (A4(__spreadValues({ type: 0 }, e4)), () => A4({ type: 1, id: e4.id })), [A4]), S2 = (0, import_react31.useMemo)(() => ({ registerOption: L8, firstOption: E5, containsCheckedOption: D6, change: s9, disabled: R5, value: r8 }), [L8, E5, D6, s9, R5, r8]), _7 = { ref: b9, id: y4, role: "radiogroup", "aria-labelledby": T7, "aria-describedby": k6, onKeyDown: h7 };
  return import_react31.default.createElement(c8, { name: "RadioGroup.Description" }, import_react31.default.createElement(C9, { name: "RadioGroup.Label" }, import_react31.default.createElement(U4.Provider, { value: S2 }, m12 != null && r8 != null && e2({ [m12]: r8 }).map(([e4, d7]) => import_react31.default.createElement(h3, __spreadValues({}, y({ key: e4, as: "input", type: "radio", checked: d7 != null, hidden: true, readOnly: true, name: e4, value: d7 })))), A({ ourProps: _7, theirProps: I3, defaultTag: ce4, name: "RadioGroup" }))));
});
var be4 = ((t10) => (t10[t10.Empty = 1] = "Empty", t10[t10.Active = 2] = "Active", t10))(be4 || {});
var me4 = "div";
var Re3 = H(function(o9, t10) {
  let r8 = (0, import_react31.useRef)(null), m12 = T(r8, t10), f11 = `headlessui-radiogroup-option-${I()}`, [R5, I3] = B4(), [a3, A4] = M3(), { addFlag: T7, removeFlag: C9, hasFlag: k6 } = b6(1), _a = o9, { value: c8, disabled: y4 = false } = _a, g6 = __objRest(_a, ["value", "disabled"]), b9 = (0, import_react31.useRef)({ value: c8, disabled: y4 });
  t(() => {
    b9.current.value = c8;
  }, [c8, b9]), t(() => {
    b9.current.disabled = y4;
  }, [y4, b9]);
  let { registerOption: E5, disabled: D6, change: s9, firstOption: h7, containsCheckedOption: L8, value: S2 } = z3("RadioGroup.Option");
  t(() => E5({ id: f11, element: r8, propsRef: b9 }), [f11, E5, r8, o9]);
  let _7 = (0, import_react31.useCallback)(() => {
    var H6;
    !s9(c8) || (T7(2), (H6 = r8.current) == null || H6.focus());
  }, [T7, s9, c8]), e4 = (0, import_react31.useCallback)(() => T7(2), [T7]), d7 = (0, import_react31.useCallback)(() => C9(2), [C9]), i9 = (h7 == null ? void 0 : h7.id) === f11, p12 = D6 || y4, l9 = S2 === c8, u7 = { ref: m12, id: f11, role: "radio", "aria-checked": l9 ? "true" : "false", "aria-labelledby": R5, "aria-describedby": a3, "aria-disabled": p12 ? true : void 0, tabIndex: (() => p12 ? -1 : l9 || !L8 && i9 ? 0 : -1)(), onClick: p12 ? void 0 : _7, onFocus: p12 ? void 0 : e4, onBlur: p12 ? void 0 : d7 }, G5 = (0, import_react31.useMemo)(() => ({ checked: l9, disabled: p12, active: k6(2) }), [l9, p12, k6]);
  return import_react31.default.createElement(A4, { name: "RadioGroup.Description" }, import_react31.default.createElement(I3, { name: "RadioGroup.Label" }, A({ ourProps: u7, theirProps: g6, slot: G5, defaultTag: me4, name: "RadioGroup.Option" })));
});
var Ne2 = Object.assign(fe3, { Option: Re3, Label: M5, Description: O3 });

// node_modules/@headlessui/react/dist/components/switch/switch.js
var import_react32 = __toESM(require_react(), 1);
var m11 = (0, import_react32.createContext)(null);
m11.displayName = "GroupContext";
var O8 = import_react32.Fragment;
function j5(f11) {
  let [n2, i9] = (0, import_react32.useState)(null), [e4, a3] = B4(), [o9, d7] = M3(), u7 = (0, import_react32.useMemo)(() => ({ switch: n2, setSwitch: i9, labelledby: e4, describedby: o9 }), [n2, i9, e4, o9]), p12 = {}, t10 = f11;
  return import_react32.default.createElement(d7, { name: "Switch.Description" }, import_react32.default.createElement(a3, { name: "Switch.Label", props: { onClick() {
    !n2 || (n2.click(), n2.focus({ preventScroll: true }));
  } } }, import_react32.default.createElement(m11.Provider, { value: u7 }, A({ ourProps: p12, theirProps: t10, defaultTag: O8, name: "Switch.Group" }))));
}
var N5 = "button";
var V5 = H(function(n2, i9) {
  let _a = n2, { checked: e4, onChange: a3, name: o9, value: d7 } = _a, u7 = __objRest(_a, ["checked", "onChange", "name", "value"]), p12 = `headlessui-switch-${I()}`, t10 = (0, import_react32.useContext)(m11), h7 = (0, import_react32.useRef)(null), S2 = T(h7, i9, t10 === null ? null : t10.setSwitch), s9 = (0, import_react32.useCallback)(() => a3(!e4), [a3, e4]), w7 = (0, import_react32.useCallback)((r8) => {
    if (r3(r8.currentTarget))
      return r8.preventDefault();
    r8.preventDefault(), s9();
  }, [s9]), E5 = (0, import_react32.useCallback)((r8) => {
    r8.key === o5.Space ? (r8.preventDefault(), s9()) : r8.key === o5.Enter && p6(r8.currentTarget);
  }, [s9]), P3 = (0, import_react32.useCallback)((r8) => r8.preventDefault(), []), v7 = (0, import_react32.useMemo)(() => ({ checked: e4 }), [e4]), g6 = { id: p12, ref: S2, role: "switch", type: s6(n2, h7), tabIndex: 0, "aria-checked": e4, "aria-labelledby": t10 == null ? void 0 : t10.labelledby, "aria-describedby": t10 == null ? void 0 : t10.describedby, onClick: w7, onKeyUp: E5, onKeyPress: P3 };
  return import_react32.default.createElement(import_react32.default.Fragment, null, o9 != null && e4 && import_react32.default.createElement(h3, __spreadValues({}, y({ as: "input", type: "checkbox", hidden: true, readOnly: true, checked: e4, name: o9, value: d7 }))), A({ ourProps: g6, theirProps: u7, slot: v7, defaultTag: N5, name: "Switch" }));
});
var ce5 = Object.assign(V5, { Group: j5, Label: M5, Description: O3 });

// node_modules/@headlessui/react/dist/components/tabs/tabs.js
var import_react34 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/internal/focus-sentinel.js
var import_react33 = __toESM(require_react(), 1);
function F7({ onFocus: n2 }) {
  let [o9, r8] = (0, import_react33.useState)(true);
  return o9 ? import_react33.default.createElement(h3, { as: "button", type: "button", onFocus: (a3) => {
    a3.preventDefault();
    let e4, u7 = 50;
    function t10() {
      if (u7-- <= 0) {
        e4 && cancelAnimationFrame(e4);
        return;
      }
      if (n2()) {
        r8(false), cancelAnimationFrame(e4);
        return;
      }
      e4 = requestAnimationFrame(t10);
    }
    e4 = requestAnimationFrame(t10);
  } }) : null;
}

// node_modules/@headlessui/react/dist/components/tabs/tabs.js
var ne3 = ((r8) => (r8[r8.SetSelectedIndex = 0] = "SetSelectedIndex", r8[r8.SetOrientation = 1] = "SetOrientation", r8[r8.SetActivation = 2] = "SetActivation", r8[r8.RegisterTab = 3] = "RegisterTab", r8[r8.UnregisterTab = 4] = "UnregisterTab", r8[r8.RegisterPanel = 5] = "RegisterPanel", r8[r8.UnregisterPanel = 6] = "UnregisterPanel", r8[r8.ForceRerender = 7] = "ForceRerender", r8))(ne3 || {});
var re3 = { [0](e4, t10) {
  let n2 = e4.tabs.filter((u7) => {
    var l9;
    return !((l9 = u7.current) != null && l9.hasAttribute("disabled"));
  });
  if (t10.index < 0)
    return __spreadProps(__spreadValues({}, e4), { selectedIndex: e4.tabs.indexOf(n2[0]) });
  if (t10.index > e4.tabs.length)
    return __spreadProps(__spreadValues({}, e4), { selectedIndex: e4.tabs.indexOf(n2[n2.length - 1]) });
  let i9 = e4.tabs.slice(0, t10.index), s9 = [...e4.tabs.slice(t10.index), ...i9].find((u7) => n2.includes(u7));
  return s9 ? __spreadProps(__spreadValues({}, e4), { selectedIndex: e4.tabs.indexOf(s9) }) : e4;
}, [1](e4, t10) {
  return e4.orientation === t10.orientation ? e4 : __spreadProps(__spreadValues({}, e4), { orientation: t10.orientation });
}, [2](e4, t10) {
  return e4.activation === t10.activation ? e4 : __spreadProps(__spreadValues({}, e4), { activation: t10.activation });
}, [3](e4, t10) {
  return e4.tabs.includes(t10.tab) ? e4 : __spreadProps(__spreadValues({}, e4), { tabs: h2([...e4.tabs, t10.tab], (n2) => n2.current) });
}, [4](e4, t10) {
  return __spreadProps(__spreadValues({}, e4), { tabs: h2(e4.tabs.filter((n2) => n2 !== t10.tab), (n2) => n2.current) });
}, [5](e4, t10) {
  return e4.panels.includes(t10.panel) ? e4 : __spreadProps(__spreadValues({}, e4), { panels: [...e4.panels, t10.panel] });
}, [6](e4, t10) {
  return __spreadProps(__spreadValues({}, e4), { panels: e4.panels.filter((n2) => n2 !== t10.panel) });
}, [7](e4) {
  return __spreadValues({}, e4);
} };
var G3 = (0, import_react34.createContext)(null);
G3.displayName = "TabsContext";
var W4 = (0, import_react34.createContext)(null);
W4.displayName = "TabsSSRContext";
function j6(e4) {
  let t10 = (0, import_react34.useContext)(W4);
  if (t10 === null) {
    let n2 = new Error(`<${e4} /> is missing a parent <Tab.Group /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, j6), n2;
  }
  return t10;
}
function M7(e4) {
  let t10 = (0, import_react34.useContext)(G3);
  if (t10 === null) {
    let n2 = new Error(`<${e4} /> is missing a parent <Tab.Group /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(n2, M7), n2;
  }
  return t10;
}
function ae3(e4, t10) {
  return u2(t10.type, re3, e4, t10);
}
var oe4 = import_react34.Fragment;
var le5 = H(function(t10, n2) {
  let _a = t10, { defaultIndex: i9 = 0, vertical: T7 = false, manual: s9 = false, onChange: u7, selectedIndex: l9 = null } = _a, r8 = __objRest(_a, ["defaultIndex", "vertical", "manual", "onChange", "selectedIndex"]);
  const c8 = T7 ? "vertical" : "horizontal", b9 = s9 ? "manual" : "auto";
  let y4 = T(n2), [a3, p12] = (0, import_react34.useReducer)(ae3, { selectedIndex: l9 != null ? l9 : i9, tabs: [], panels: [], orientation: c8, activation: b9 }), A4 = (0, import_react34.useMemo)(() => ({ selectedIndex: a3.selectedIndex }), [a3.selectedIndex]), d7 = s2(u7 || (() => {
  })), x7 = s2(a3.tabs);
  (0, import_react34.useEffect)(() => {
    p12({ type: 1, orientation: c8 });
  }, [c8]), (0, import_react34.useEffect)(() => {
    p12({ type: 2, activation: b9 });
  }, [b9]), t(() => {
    let f11 = l9 != null ? l9 : i9;
    p12({ type: 0, index: f11 });
  }, [l9]);
  let R5 = (0, import_react34.useRef)(a3.selectedIndex);
  (0, import_react34.useEffect)(() => {
    R5.current = a3.selectedIndex;
  }, [a3.selectedIndex]);
  let g6 = (0, import_react34.useMemo)(() => [a3, { dispatch: p12, change(f11) {
    R5.current !== f11 && d7.current(f11), R5.current = f11, p12({ type: 0, index: f11 });
  } }], [a3, p12]), S2 = (0, import_react34.useRef)({ tabs: [], panels: [] }), _7 = { ref: y4 };
  return import_react34.default.createElement(W4.Provider, { value: S2 }, import_react34.default.createElement(G3.Provider, { value: g6 }, import_react34.default.createElement(F7, { onFocus: () => {
    var f11, F9;
    for (let C9 of x7.current)
      if (((f11 = C9.current) == null ? void 0 : f11.tabIndex) === 0)
        return (F9 = C9.current) == null || F9.focus(), true;
    return false;
  } }), A({ ourProps: _7, theirProps: r8, slot: A4, defaultTag: oe4, name: "Tabs" })));
});
var ie3 = "div";
var se5 = H(function(t10, n2) {
  let [{ selectedIndex: i9, orientation: T7 }] = M7("Tab.List"), s9 = T(n2);
  return A({ ourProps: { ref: s9, role: "tablist", "aria-orientation": T7 }, theirProps: t10, slot: { selectedIndex: i9 }, defaultTag: ie3, name: "Tabs.List" });
});
var ue4 = "button";
var ce6 = H(function(t10, n2) {
  var N7, B6;
  let i9 = `headlessui-tabs-tab-${I()}`, [{ selectedIndex: T7, tabs: s9, panels: u7, orientation: l9, activation: r8 }, { dispatch: c8, change: b9 }] = M7("Tab"), y4 = j6("Tab"), a3 = (0, import_react34.useRef)(null), p12 = T(a3, n2, (o9) => {
    !o9 || c8({ type: 7 });
  });
  t(() => (c8({ type: 3, tab: a3 }), () => c8({ type: 4, tab: a3 })), [c8, a3]);
  let A4 = y4.current.tabs.indexOf(i9);
  A4 === -1 && (A4 = y4.current.tabs.push(i9) - 1);
  let d7 = s9.indexOf(a3);
  d7 === -1 && (d7 = A4);
  let x7 = d7 === T7, R5 = (0, import_react34.useCallback)((o9) => {
    let E5 = s9.map((X6) => X6.current).filter(Boolean);
    if (o9.key === o5.Space || o9.key === o5.Enter) {
      o9.preventDefault(), o9.stopPropagation(), b9(d7);
      return;
    }
    switch (o9.key) {
      case o5.Home:
      case o5.PageUp:
        return o9.preventDefault(), o9.stopPropagation(), F3(E5, E2.First);
      case o5.End:
      case o5.PageDown:
        return o9.preventDefault(), o9.stopPropagation(), F3(E5, E2.Last);
    }
    return u2(l9, { vertical() {
      if (o9.key === o5.ArrowUp)
        return F3(E5, E2.Previous | E2.WrapAround);
      if (o9.key === o5.ArrowDown)
        return F3(E5, E2.Next | E2.WrapAround);
    }, horizontal() {
      if (o9.key === o5.ArrowLeft)
        return F3(E5, E2.Previous | E2.WrapAround);
      if (o9.key === o5.ArrowRight)
        return F3(E5, E2.Next | E2.WrapAround);
    } });
  }, [s9, l9, d7, b9]), g6 = (0, import_react34.useCallback)(() => {
    var o9;
    (o9 = a3.current) == null || o9.focus();
  }, [a3]), S2 = (0, import_react34.useCallback)(() => {
    var o9;
    (o9 = a3.current) == null || o9.focus(), b9(d7);
  }, [b9, d7, a3]), _7 = (0, import_react34.useCallback)((o9) => {
    o9.preventDefault();
  }, []), f11 = (0, import_react34.useMemo)(() => ({ selected: x7 }), [x7]), F9 = t10, C9 = { ref: p12, onKeyDown: R5, onFocus: r8 === "manual" ? g6 : S2, onMouseDown: _7, onClick: S2, id: i9, role: "tab", type: s6(t10, a3), "aria-controls": (B6 = (N7 = u7[d7]) == null ? void 0 : N7.current) == null ? void 0 : B6.id, "aria-selected": x7, tabIndex: x7 ? 0 : -1 };
  return A({ ourProps: C9, theirProps: F9, slot: f11, defaultTag: ue4, name: "Tabs.Tab" });
});
var pe5 = "div";
var de5 = H(function(t10, n2) {
  let [{ selectedIndex: i9 }] = M7("Tab.Panels"), T7 = T(n2), s9 = (0, import_react34.useMemo)(() => ({ selectedIndex: i9 }), [i9]);
  return A({ ourProps: { ref: T7 }, theirProps: t10, slot: s9, defaultTag: pe5, name: "Tabs.Panels" });
});
var fe4 = "div";
var Te4 = b.RenderStrategy | b.Static;
var be5 = H(function(t10, n2) {
  var R5, g6;
  let [{ selectedIndex: i9, tabs: T7, panels: s9 }, { dispatch: u7 }] = M7("Tab.Panel"), l9 = j6("Tab.Panel"), r8 = `headlessui-tabs-panel-${I()}`, c8 = (0, import_react34.useRef)(null), b9 = T(c8, n2, (S2) => {
    !S2 || u7({ type: 7 });
  });
  t(() => (u7({ type: 5, panel: c8 }), () => u7({ type: 6, panel: c8 })), [u7, c8]);
  let y4 = l9.current.panels.indexOf(r8);
  y4 === -1 && (y4 = l9.current.panels.push(r8) - 1);
  let a3 = s9.indexOf(c8);
  a3 === -1 && (a3 = y4);
  let p12 = a3 === i9, A4 = (0, import_react34.useMemo)(() => ({ selected: p12 }), [p12]), d7 = t10, x7 = { ref: b9, id: r8, role: "tabpanel", "aria-labelledby": (g6 = (R5 = T7[a3]) == null ? void 0 : R5.current) == null ? void 0 : g6.id, tabIndex: p12 ? 0 : -1 };
  return A({ ourProps: x7, theirProps: d7, slot: A4, defaultTag: fe4, features: Te4, visible: p12, name: "Tabs.Panel" });
});
var we3 = Object.assign(ce6, { Group: le5, List: se5, Panels: de5, Panel: be5 });

// node_modules/@headlessui/react/dist/components/transitions/transition.js
var import_react35 = __toESM(require_react(), 1);

// node_modules/@headlessui/react/dist/utils/once.js
function l7(r8) {
  let e4 = { called: false };
  return (...t10) => {
    if (!e4.called)
      return e4.called = true, r8(...t10);
  };
}

// node_modules/@headlessui/react/dist/components/transitions/utils/transition.js
function p11(t10, ...e4) {
  t10 && e4.length > 0 && t10.classList.add(...e4);
}
function v5(t10, ...e4) {
  t10 && e4.length > 0 && t10.classList.remove(...e4);
}
var g5 = ((n2) => (n2.Ended = "ended", n2.Cancelled = "cancelled", n2))(g5 || {});
function T6(t10, e4) {
  let n2 = o();
  if (!t10)
    return n2.dispose;
  let { transitionDuration: l9, transitionDelay: a3 } = getComputedStyle(t10), [d7, s9] = [l9, a3].map((i9) => {
    let [r8 = 0] = i9.split(",").filter(Boolean).map((o9) => o9.includes("ms") ? parseFloat(o9) : parseFloat(o9) * 1e3).sort((o9, E5) => E5 - o9);
    return r8;
  });
  if (d7 + s9 !== 0) {
    let i9 = [];
    i9.push(n2.addEventListener(t10, "transitionrun", () => {
      i9.splice(0).forEach((r8) => r8()), i9.push(n2.addEventListener(t10, "transitionend", () => {
        e4("ended"), i9.splice(0).forEach((r8) => r8());
      }, { once: true }), n2.addEventListener(t10, "transitioncancel", () => {
        e4("cancelled"), i9.splice(0).forEach((r8) => r8());
      }, { once: true }));
    }, { once: true }));
  } else
    e4("ended");
  return n2.add(() => e4("cancelled")), n2.dispose;
}
function C7(t10, e4, n2, l9) {
  let a3 = n2 ? "enter" : "leave", d7 = o(), s9 = l9 !== void 0 ? l7(l9) : () => {
  }, m12 = u2(a3, { enter: () => e4.enter, leave: () => e4.leave }), i9 = u2(a3, { enter: () => e4.enterTo, leave: () => e4.leaveTo }), r8 = u2(a3, { enter: () => e4.enterFrom, leave: () => e4.leaveFrom });
  return v5(t10, ...e4.enter, ...e4.enterTo, ...e4.enterFrom, ...e4.leave, ...e4.leaveFrom, ...e4.leaveTo, ...e4.entered), p11(t10, ...m12, ...r8), d7.nextFrame(() => {
    v5(t10, ...r8), p11(t10, ...i9), T6(t10, (o9) => (o9 === "ended" && (v5(t10, ...m12), p11(t10, ...e4.entered)), s9(o9)));
  }), d7.dispose;
}

// node_modules/@headlessui/react/dist/hooks/use-transition.js
function x6({ container: u7, direction: o9, classes: c8, events: t10, onStart: d7, onStop: l9 }) {
  let f11 = f7(), m12 = p(), e4 = s2(o9), b9 = s2(() => u2(e4.current, { enter: () => t10.current.beforeEnter(), leave: () => t10.current.beforeLeave(), idle: () => {
  } })), p12 = s2(() => u2(e4.current, { enter: () => t10.current.afterEnter(), leave: () => t10.current.afterLeave(), idle: () => {
  } }));
  t(() => {
    let r8 = o();
    m12.add(r8.dispose);
    let s9 = u7.current;
    if (!!s9 && e4.current !== "idle" && !!f11.current)
      return r8.dispose(), b9.current(), d7.current(e4.current), r8.add(C7(s9, c8.current, e4.current === "enter", (v7) => {
        r8.dispose(), u2(v7, { [g5.Ended]() {
          p12.current(), l9.current(e4.current);
        }, [g5.Cancelled]: () => {
        } });
      })), r8.dispose;
  }, [o9]);
}

// node_modules/@headlessui/react/dist/components/transitions/transition.js
function c7(e4 = "") {
  return e4.split(" ").filter((r8) => r8.trim().length > 1);
}
var N6 = (0, import_react35.createContext)(null);
N6.displayName = "TransitionContext";
var he2 = ((t10) => (t10.Visible = "visible", t10.Hidden = "hidden", t10))(he2 || {});
function ge3() {
  let e4 = (0, import_react35.useContext)(N6);
  if (e4 === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e4;
}
function ve4() {
  let e4 = (0, import_react35.useContext)(R4);
  if (e4 === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e4;
}
var R4 = (0, import_react35.createContext)(null);
R4.displayName = "NestingContext";
function F8(e4) {
  return "children" in e4 ? F8(e4.children) : e4.current.filter(({ state: r8 }) => r8 === "visible").length > 0;
}
function X5(e4) {
  let r8 = s2(e4), t10 = (0, import_react35.useRef)([]), n2 = f7(), u7 = s2((s9, o9 = x.Hidden) => {
    let i9 = t10.current.findIndex(({ id: d7 }) => d7 === s9);
    i9 !== -1 && (u2(o9, { [x.Unmount]() {
      t10.current.splice(i9, 1);
    }, [x.Hidden]() {
      t10.current[i9].state = "hidden";
    } }), t5(() => {
      var d7;
      !F8(t10) && n2.current && ((d7 = r8.current) == null || d7.call(r8));
    }));
  }), m12 = s2((s9) => {
    let o9 = t10.current.find(({ id: i9 }) => i9 === s9);
    return o9 ? o9.state !== "visible" && (o9.state = "visible") : t10.current.push({ id: s9, state: "visible" }), () => u7.current(s9, x.Unmount);
  });
  return (0, import_react35.useMemo)(() => ({ children: t10, register: m12, unregister: u7 }), [m12, u7, t10]);
}
function Ce3() {
}
var be6 = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
function Y4(e4) {
  var t10;
  let r8 = {};
  for (let n2 of be6)
    r8[n2] = (t10 = e4[n2]) != null ? t10 : Ce3;
  return r8;
}
function Se5(e4) {
  let r8 = (0, import_react35.useRef)(Y4(e4));
  return (0, import_react35.useEffect)(() => {
    r8.current = Y4(e4);
  }, [e4]), r8;
}
var xe4 = "div";
var Z4 = b.RenderStrategy;
var $4 = H(function(r8, t10) {
  let _a = r8, { beforeEnter: n2, afterEnter: u7, beforeLeave: m12, afterLeave: s9, enter: o9, enterFrom: i9, enterTo: d7, entered: S2, leave: x7, leaveFrom: E5, leaveTo: L8 } = _a, p12 = __objRest(_a, ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave", "enter", "enterFrom", "enterTo", "entered", "leave", "leaveFrom", "leaveTo"]), h7 = (0, import_react35.useRef)(null), y4 = T(h7, t10), [f11, A4] = (0, import_react35.useState)("visible"), D6 = p12.unmount ? x.Unmount : x.Hidden, { show: g6, appear: ee3, initial: te2 } = ge3(), { register: P3, unregister: H6 } = ve4(), O10 = (0, import_react35.useRef)(null), a3 = I(), re4 = (0, import_react35.useRef)(false), k6 = X5(() => {
    re4.current || (A4("hidden"), H6.current(a3));
  });
  (0, import_react35.useEffect)(() => {
    if (!!a3)
      return P3.current(a3);
  }, [P3, a3]), (0, import_react35.useEffect)(() => {
    if (D6 === x.Hidden && !!a3) {
      if (g6 && f11 !== "visible") {
        A4("visible");
        return;
      }
      u2(f11, { ["hidden"]: () => H6.current(a3), ["visible"]: () => P3.current(a3) });
    }
  }, [f11, a3, P3, H6, g6, D6]);
  let ne4 = s2({ enter: c7(o9), enterFrom: c7(i9), enterTo: c7(d7), entered: c7(S2), leave: c7(x7), leaveFrom: c7(E5), leaveTo: c7(L8) }), ie4 = Se5({ beforeEnter: n2, afterEnter: u7, beforeLeave: m12, afterLeave: s9 }), w7 = a();
  (0, import_react35.useEffect)(() => {
    if (w7 && f11 === "visible" && h7.current === null)
      throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [h7, f11, w7]);
  let M8 = te2 && !ee3, se6 = (() => !w7 || M8 || O10.current === g6 ? "idle" : g6 ? "enter" : "leave")();
  x6({ container: h7, classes: ne4, events: ie4, direction: se6, onStart: s2(() => {
  }), onStop: s2((le6) => {
    le6 === "leave" && !F8(k6) && (A4("hidden"), H6.current(a3));
  }) }), (0, import_react35.useEffect)(() => {
    !M8 || (D6 === x.Hidden ? O10.current = null : O10.current = g6);
  }, [g6, M8, f11]);
  let oe5 = p12, ae4 = { ref: y4 };
  return import_react35.default.createElement(R4.Provider, { value: k6 }, import_react35.default.createElement(C2, { value: u2(f11, { ["visible"]: p4.Open, ["hidden"]: p4.Closed }) }, A({ ourProps: ae4, theirProps: oe5, defaultTag: xe4, features: Z4, visible: f11 === "visible", name: "Transition.Child" })));
});
var j7 = H(function(r8, t10) {
  let _a = r8, { show: n2, appear: u7 = false, unmount: m12 } = _a, s9 = __objRest(_a, ["show", "appear", "unmount"]), o9 = T(t10);
  a();
  let i9 = s5();
  if (n2 === void 0 && i9 !== null && (n2 = u2(i9, { [p4.Open]: true, [p4.Closed]: false })), ![true, false].includes(n2))
    throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [d7, S2] = (0, import_react35.useState)(n2 ? "visible" : "hidden"), x7 = X5(() => {
    S2("hidden");
  }), [E5, L8] = (0, import_react35.useState)(true), p12 = (0, import_react35.useRef)([n2]);
  t(() => {
    E5 !== false && p12.current[p12.current.length - 1] !== n2 && (p12.current.push(n2), L8(false));
  }, [p12, n2]);
  let h7 = (0, import_react35.useMemo)(() => ({ show: n2, appear: u7, initial: E5 }), [n2, u7, E5]);
  (0, import_react35.useEffect)(() => {
    n2 ? S2("visible") : F8(x7) || S2("hidden");
  }, [n2, x7]);
  let y4 = { unmount: m12 };
  return import_react35.default.createElement(R4.Provider, { value: x7 }, import_react35.default.createElement(N6.Provider, { value: h7 }, A({ ourProps: __spreadProps(__spreadValues({}, y4), { as: import_react35.Fragment, children: import_react35.default.createElement($4, __spreadValues(__spreadValues({ ref: o9 }, y4), s9)) }), theirProps: {}, defaultTag: import_react35.Fragment, features: Z4, visible: d7 === "visible", name: "Transition" })));
});
function Ee4(e4) {
  let r8 = (0, import_react35.useContext)(N6) !== null, t10 = s5() !== null;
  return import_react35.default.createElement(import_react35.default.Fragment, null, !r8 && t10 ? import_react35.default.createElement(j7, __spreadValues({}, e4)) : import_react35.default.createElement($4, __spreadValues({}, e4)));
}
var Ge = Object.assign(j7, { Child: Ee4, Root: j7 });
export {
  go as Combobox,
  ft as Dialog,
  ke3 as Disclosure,
  O5 as FocusTrap,
  et as Listbox,
  Qe as Menu,
  tt as Popover,
  K2 as Portal,
  Ne2 as RadioGroup,
  ce5 as Switch,
  we3 as Tab,
  Ge as Transition
};
//# sourceMappingURL=@headlessui_react.js.map
