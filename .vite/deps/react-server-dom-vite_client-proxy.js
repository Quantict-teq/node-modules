import {
  __toESM,
  require_react
} from "./chunk-ZFTXHV63.js";

// node_modules/@shopify/hydrogen/vendor/react-server-dom-vite/esm/react-server-dom-vite-client-proxy.js
var import_react = __toESM(require_react(), 1);
globalThis.__COMPONENT_INDEX = {};
globalThis.__STRING_REFERENCE_INDEX = {};
var MODULE_TAG = Symbol.for("react.module.reference");
var STRING_SIZE_LIMIT = 64;
var FN_RSC_ERROR = "Functions exported from client components cannot be called or used as constructors from a server component.";
function isRsc() {
  try {
    (0, import_react.useState)();
    return false;
  } catch (error) {
    return error.message.endsWith("Server Components.");
  }
}
function createModuleReference(id, value, name, isDefault) {
  var moduleRef = /* @__PURE__ */ Object.create(null);
  moduleRef.$$typeof = MODULE_TAG;
  moduleRef.filepath = id;
  moduleRef.name = isDefault ? "default" : name;
  globalThis.__COMPONENT_INDEX[id] = Object.defineProperty(globalThis.__COMPONENT_INDEX[id] || /* @__PURE__ */ Object.create(null), moduleRef.name, {
    value,
    writable: true
  });
  return moduleRef;
}
function wrapInClientProxy(_ref) {
  var id = _ref.id, name = _ref.name, isDefault = _ref.isDefault, value = _ref.value;
  var type = typeof value;
  if (value === null || type !== "object" && type !== "function") {
    if (type === "string" && value.length >= STRING_SIZE_LIMIT) {
      var _moduleRef = createModuleReference(id, value, name, isDefault);
      globalThis.__STRING_REFERENCE_INDEX[value] = _moduleRef;
    }
    return value;
  }
  var moduleRef = createModuleReference(id, value, name, isDefault);
  var get = function(target, prop, receiver) {
    return Reflect.get(isRsc() ? moduleRef : target, prop, receiver);
  };
  return new Proxy(value, type === "object" ? {
    get
  } : {
    get,
    apply: function() {
      if (isRsc())
        throw new Error(FN_RSC_ERROR + (' Calling "' + name + '".'));
      return Reflect.apply.apply(Reflect, arguments);
    },
    construct: function() {
      if (isRsc())
        throw new Error(FN_RSC_ERROR + (' Instantiating "' + name + '".'));
      return Reflect.construct.apply(Reflect, arguments);
    }
  });
}
export {
  FN_RSC_ERROR,
  MODULE_TAG,
  STRING_SIZE_LIMIT,
  isRsc,
  wrapInClientProxy
};
/**
* @license React
 * react-server-dom-vite-client-proxy.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//# sourceMappingURL=react-server-dom-vite_client-proxy.js.map
