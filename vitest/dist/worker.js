import { d as dirname, b as basename, a as resolve } from './vendor-index.76be1f4d.js';
import { i as isNodeBuiltin, t as toFilePath, V as ViteNodeRunner, c as createBirpc } from './chunk-vite-node-utils.f2f4fe4b.js';
import { d as distDir } from './chunk-constants.a1a50d89.js';
import { existsSync, readdirSync } from 'fs';
import { m as isWindows, o as mergeSlashes } from './chunk-utils-base.68f100c1.js';
import { r as rpc } from './chunk-runtime-rpc.1832c38c.js';
import 'path';
import 'module';
import 'url';
import 'vm';
import 'assert';
import 'util';
import 'tty';
import 'local-pkg';

function normalizeId(id, base) {
  if (base && id.startsWith(base))
    id = `/${id.slice(base.length)}`;
  return id.replace(/^\/@id\/__x00__/, "\0").replace(/^\/@id\//, "").replace(/^__vite-browser-external:/, "").replace(/^node:/, "").replace(/[?&]v=\w+/, "?").replace(/\?$/, "");
}

var __defProp = Object.defineProperty;
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
function getObjectType(value) {
  return Object.prototype.toString.apply(value).slice(8, -1);
}
function mockPrototype(spyOn, proto) {
  if (!proto)
    return null;
  const newProto = {};
  const protoDescr = Object.getOwnPropertyDescriptors(proto);
  for (const d in protoDescr) {
    Object.defineProperty(newProto, d, protoDescr[d]);
    if (typeof protoDescr[d].value === "function")
      spyOn(newProto, d).mockImplementation(() => {
      });
  }
  return newProto;
}
const pendingIds = [];
class VitestMocker {
  constructor(options, moduleCache, request) {
    this.options = options;
    this.moduleCache = moduleCache;
    this.callbacks = {};
    this.root = this.options.root;
    this.request = request;
  }
  get mockMap() {
    return this.options.mockMap;
  }
  on(event, cb) {
    var _a;
    (_a = this.callbacks)[event] ?? (_a[event] = []);
    this.callbacks[event].push(cb);
  }
  emit(event, ...args) {
    (this.callbacks[event] ?? []).forEach((fn) => fn(...args));
  }
  getSuiteFilepath() {
    return (__vitest_worker__ == null ? void 0 : __vitest_worker__.filepath) || "global";
  }
  getMocks() {
    const suite = this.getSuiteFilepath();
    const suiteMocks = this.mockMap[suite];
    const globalMocks = this.mockMap.global;
    return __spreadValues(__spreadValues({}, globalMocks), suiteMocks);
  }
  async resolvePath(id, importer) {
    const path = await this.options.resolveId(id, importer);
    return {
      path: normalizeId((path == null ? void 0 : path.id) || id),
      external: (path == null ? void 0 : path.id.includes("/node_modules/")) ? id : null
    };
  }
  async resolveMocks() {
    await Promise.all(pendingIds.map(async (mock) => {
      const { path, external } = await this.resolvePath(mock.id, mock.importer);
      if (mock.type === "unmock")
        this.unmockPath(path);
      if (mock.type === "mock")
        this.mockPath(path, external, mock.factory);
    }));
    pendingIds.length = 0;
  }
  async callFunctionMock(dep, mock) {
    var _a;
    const cacheName = `${dep}__mock`;
    const cached = (_a = this.moduleCache.get(cacheName)) == null ? void 0 : _a.exports;
    if (cached)
      return cached;
    const exports = await mock();
    this.emit("mocked", cacheName, { exports });
    return exports;
  }
  getDependencyMock(dep) {
    return this.getMocks()[this.resolveDependency(dep)];
  }
  resolveDependency(dep) {
    return normalizeId(dep).replace(/^\/@fs\//, isWindows ? "" : "/");
  }
  normalizePath(path) {
    return normalizeId(path.replace(this.root, "")).replace(/^\/@fs\//, isWindows ? "" : "/");
  }
  getFsPath(path, external) {
    if (external)
      return mergeSlashes(`/@fs/${path}`);
    return normalizeId(path.replace(this.root, ""));
  }
  resolveMockPath(mockPath, external) {
    const path = normalizeId(external || mockPath);
    if (external || isNodeBuiltin(mockPath)) {
      const mockDirname = dirname(path);
      const baseFilename = basename(path);
      const mockFolder = resolve(this.root, "__mocks__", mockDirname);
      if (!existsSync(mockFolder))
        return null;
      const files = readdirSync(mockFolder);
      for (const file of files) {
        const [basename2] = file.split(".");
        if (basename2 === baseFilename)
          return resolve(mockFolder, file).replace(this.root, "");
      }
      return null;
    }
    const dir = dirname(path);
    const baseId = basename(path);
    const fullPath = resolve(dir, "__mocks__", baseId);
    return existsSync(fullPath) ? fullPath.replace(this.root, "") : null;
  }
  mockObject(obj) {
    if (!this.spy)
      throw new Error("Internal Vitest error: Spy function is not defined.");
    const type = getObjectType(obj);
    if (Array.isArray(obj))
      return [];
    else if (type !== "Object" && type !== "Module")
      return obj;
    const newObj = __spreadValues({}, obj);
    const proto = mockPrototype(this.spy.spyOn, Object.getPrototypeOf(obj));
    Object.setPrototypeOf(newObj, proto);
    for (const k in obj) {
      newObj[k] = this.mockObject(obj[k]);
      const type2 = getObjectType(obj[k]);
      if (type2.includes("Function") && !obj[k]._isMockFunction) {
        this.spy.spyOn(newObj, k).mockImplementation(() => {
        });
        Object.defineProperty(newObj[k], "length", { value: 0 });
      }
    }
    return newObj;
  }
  unmockPath(path) {
    var _a;
    const suitefile = this.getSuiteFilepath();
    const fsPath = this.normalizePath(path);
    if ((_a = this.mockMap[suitefile]) == null ? void 0 : _a[fsPath])
      delete this.mockMap[suitefile][fsPath];
  }
  mockPath(path, external, factory) {
    var _a;
    const suitefile = this.getSuiteFilepath();
    const fsPath = this.normalizePath(path);
    (_a = this.mockMap)[suitefile] ?? (_a[suitefile] = {});
    this.mockMap[suitefile][fsPath] = factory || this.resolveMockPath(path, external);
  }
  async importActual(id, importer) {
    const { path, external } = await this.resolvePath(id, importer);
    const fsPath = this.getFsPath(path, external);
    const result = await this.request(fsPath);
    return result;
  }
  async importMock(id, importer) {
    const { path, external } = await this.resolvePath(id, importer);
    let mock = this.getDependencyMock(path);
    if (mock === void 0)
      mock = this.resolveMockPath(path, external);
    if (mock === null) {
      await this.ensureSpy();
      const fsPath = this.getFsPath(path, external);
      const mod = await this.request(fsPath);
      return this.mockObject(mod);
    }
    if (typeof mock === "function")
      return this.callFunctionMock(path, mock);
    return this.requestWithMock(mock);
  }
  async ensureSpy() {
    if (this.spy)
      return;
    this.spy = await this.request(resolve(distDir, "jest-mock.js"));
  }
  async requestWithMock(dep) {
    var _a;
    await this.ensureSpy();
    await this.resolveMocks();
    const mock = this.getDependencyMock(dep);
    if (mock === null) {
      const cacheName = `${dep}__mock`;
      const cache = this.moduleCache.get(cacheName);
      if (cache == null ? void 0 : cache.exports)
        return cache.exports;
      const cacheKey = toFilePath(dep, this.root);
      const mod = ((_a = this.moduleCache.get(cacheKey)) == null ? void 0 : _a.exports) || await this.request(dep);
      const exports = this.mockObject(mod);
      this.emit("mocked", cacheName, { exports });
      return exports;
    }
    if (typeof mock === "function")
      return this.callFunctionMock(dep, mock);
    if (typeof mock === "string")
      dep = mock;
    return this.request(dep);
  }
  queueMock(id, importer, factory) {
    pendingIds.push({ type: "mock", id, importer, factory });
  }
  queueUnmock(id, importer) {
    pendingIds.push({ type: "unmock", id, importer });
  }
  withRequest(request) {
    return new VitestMocker(this.options, this.moduleCache, request);
  }
}

async function executeInViteNode(options) {
  const runner = new VitestRunner(options);
  await runner.executeId("/@vite/env");
  const result = [];
  for (const file of options.files)
    result.push(await runner.executeFile(file));
  return result;
}
class VitestRunner extends ViteNodeRunner {
  constructor(options) {
    super(options);
    this.options = options;
    this.mocker = new VitestMocker(options, this.moduleCache);
  }
  prepareContext(context) {
    const request = context.__vite_ssr_import__;
    const mocker = this.mocker.withRequest(request);
    mocker.on("mocked", (dep, module) => {
      this.setCache(dep, module);
    });
    return Object.assign(context, {
      __vite_ssr_import__: (dep) => mocker.requestWithMock(dep),
      __vite_ssr_dynamic_import__: (dep) => mocker.requestWithMock(dep),
      __vitest_mocker__: mocker
    });
  }
}

let _viteNode;
const moduleCache = new Map();
const mockMap = {};
async function startViteNode(ctx) {
  if (_viteNode)
    return _viteNode;
  const processExit = process.exit;
  process.on("beforeExit", (code) => {
    rpc().onWorkerExit(code);
  });
  process.exit = (code = process.exitCode || 0) => {
    rpc().onWorkerExit(code);
    return processExit(code);
  };
  const { config } = ctx;
  const { run: run2, collect: collect2 } = (await executeInViteNode({
    files: [
      resolve(distDir, "entry.js")
    ],
    fetchModule(id) {
      return rpc().fetch(id);
    },
    resolveId(id, importer) {
      return rpc().resolveId(id, importer);
    },
    moduleCache,
    mockMap,
    interopDefault: config.deps.interopDefault ?? true,
    root: config.root,
    base: config.base
  }))[0];
  _viteNode = { run: run2, collect: collect2 };
  return _viteNode;
}
function init(ctx) {
  process.stdout.write("\0");
  const { config, port, id } = ctx;
  process.env.VITEST_WORKER_ID = String(id);
  globalThis.__vitest_worker__ = {
    ctx,
    moduleCache,
    config,
    rpc: createBirpc({}, {
      eventNames: ["onUserConsoleLog", "onFinished", "onCollected", "onWorkerExit"],
      post(v) {
        port.postMessage(v);
      },
      on(fn) {
        port.addListener("message", fn);
      }
    })
  };
  if (ctx.invalidates)
    ctx.invalidates.forEach((i) => moduleCache.delete(i));
  ctx.files.forEach((i) => moduleCache.delete(i));
}
async function collect(ctx) {
  init(ctx);
  const { collect: collect2 } = await startViteNode(ctx);
  return collect2(ctx.files, ctx.config);
}
async function run(ctx) {
  init(ctx);
  const { run: run2 } = await startViteNode(ctx);
  return run2(ctx.files, ctx.config);
}

export { collect, run };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvcGF0aC50cyIsIi4uL3NyYy9ub2RlL21vY2tlci50cyIsIi4uL3NyYy9ub2RlL2V4ZWN1dGUudHMiLCIuLi9zcmMvcnVudGltZS93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUlkKGlkOiBzdHJpbmcsIGJhc2U/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYmFzZSAmJiBpZC5zdGFydHNXaXRoKGJhc2UpKVxuICAgIGlkID0gYC8ke2lkLnNsaWNlKGJhc2UubGVuZ3RoKX1gXG5cbiAgcmV0dXJuIGlkXG4gICAgLnJlcGxhY2UoL15cXC9AaWRcXC9fX3gwMF9fLywgJ1xcMCcpIC8vIHZpcnR1YWwgbW9kdWxlcyBzdGFydCB3aXRoIGBcXDBgXG4gICAgLnJlcGxhY2UoL15cXC9AaWRcXC8vLCAnJylcbiAgICAucmVwbGFjZSgvXl9fdml0ZS1icm93c2VyLWV4dGVybmFsOi8sICcnKVxuICAgIC5yZXBsYWNlKC9ebm9kZTovLCAnJylcbiAgICAucmVwbGFjZSgvWz8mXXY9XFx3Ky8sICc/JykgLy8gcmVtb3ZlID92PSBxdWVyeVxuICAgIC5yZXBsYWNlKC9cXD8kLywgJycpIC8vIHJlbW92ZSBlbmQgcXVlcnkgbWFya1xufVxuIiwiaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZGRpclN5bmMgfSBmcm9tICdmcydcbmltcG9ydCB7IGlzTm9kZUJ1aWx0aW4gfSBmcm9tICdtbGx5J1xuaW1wb3J0IHsgYmFzZW5hbWUsIGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tICdwYXRoZSdcbmltcG9ydCB0eXBlIHsgTW9kdWxlQ2FjaGUgfSBmcm9tICd2aXRlLW5vZGUnXG5pbXBvcnQgeyB0b0ZpbGVQYXRoIH0gZnJvbSAndml0ZS1ub2RlL3V0aWxzJ1xuaW1wb3J0IHsgaXNXaW5kb3dzLCBtZXJnZVNsYXNoZXMsIG5vcm1hbGl6ZUlkIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBkaXN0RGlyIH0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHR5cGUgeyBFeGVjdXRlT3B0aW9ucyB9IGZyb20gJy4vZXhlY3V0ZSdcblxuZXhwb3J0IHR5cGUgU3VpdGVNb2NrcyA9IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bGwgfCAoKCkgPT4gdW5rbm93bik+PlxuXG50eXBlIENhbGxiYWNrID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB1bmtub3duXG5cbmludGVyZmFjZSBQZW5kaW5nU3VpdGVNb2NrIHtcbiAgaWQ6IHN0cmluZ1xuICBpbXBvcnRlcjogc3RyaW5nXG4gIHR5cGU6ICdtb2NrJyB8ICd1bm1vY2snXG4gIGZhY3Rvcnk/OiAoKSA9PiB1bmtub3duXG59XG5cbmZ1bmN0aW9uIGdldE9iamVjdFR5cGUodmFsdWU6IHVua25vd24pOiBzdHJpbmcge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkuc2xpY2UoOCwgLTEpXG59XG5cbmZ1bmN0aW9uIG1vY2tQcm90b3R5cGUoc3B5T246IHR5cGVvZiBpbXBvcnQoJy4uL2ludGVncmF0aW9ucy9qZXN0LW1vY2snKVsnc3B5T24nXSwgcHJvdG86IGFueSkge1xuICBpZiAoIXByb3RvKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG5ld1Byb3RvOiBhbnkgPSB7fVxuXG4gIGNvbnN0IHByb3RvRGVzY3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90bylcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgZm9yIChjb25zdCBkIGluIHByb3RvRGVzY3IpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3UHJvdG8sIGQsIHByb3RvRGVzY3JbZF0pXG5cbiAgICBpZiAodHlwZW9mIHByb3RvRGVzY3JbZF0udmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICBzcHlPbihuZXdQcm90bywgZCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHt9KVxuICB9XG5cbiAgcmV0dXJuIG5ld1Byb3RvXG59XG5cbmNvbnN0IHBlbmRpbmdJZHM6IFBlbmRpbmdTdWl0ZU1vY2tbXSA9IFtdXG5cbmV4cG9ydCBjbGFzcyBWaXRlc3RNb2NrZXIge1xuICBwcml2YXRlIHJlcXVlc3QhOiAoZGVwOiBzdHJpbmcpID0+IHVua25vd25cblxuICBwcml2YXRlIHJvb3Q6IHN0cmluZ1xuXG4gIHByaXZhdGUgY2FsbGJhY2tzOiBSZWNvcmQ8c3RyaW5nLCAoKC4uLmFyZ3M6IGFueVtdKSA9PiB1bmtub3duKVtdPiA9IHt9XG4gIHByaXZhdGUgc3B5PzogdHlwZW9mIGltcG9ydCgnLi4vaW50ZWdyYXRpb25zL2plc3QtbW9jaycpXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG9wdGlvbnM6IEV4ZWN1dGVPcHRpb25zLFxuICAgIHByaXZhdGUgbW9kdWxlQ2FjaGU6IE1hcDxzdHJpbmcsIE1vZHVsZUNhY2hlPixcbiAgICByZXF1ZXN0PzogKGRlcDogc3RyaW5nKSA9PiB1bmtub3duLFxuICApIHtcbiAgICB0aGlzLnJvb3QgPSB0aGlzLm9wdGlvbnMucm9vdFxuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3QhXG4gIH1cblxuICBnZXQgbW9ja01hcCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLm1vY2tNYXBcbiAgfVxuXG4gIHB1YmxpYyBvbihldmVudDogc3RyaW5nLCBjYjogQ2FsbGJhY2spIHtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF0gPz89IFtdXG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdLnB1c2goY2IpXG4gIH1cblxuICBwcml2YXRlIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICAodGhpcy5jYWxsYmFja3NbZXZlbnRdID8/IFtdKS5mb3JFYWNoKGZuID0+IGZuKC4uLmFyZ3MpKVxuICB9XG5cbiAgcHVibGljIGdldFN1aXRlRmlsZXBhdGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gX192aXRlc3Rfd29ya2VyX18/LmZpbGVwYXRoIHx8ICdnbG9iYWwnXG4gIH1cblxuICBwdWJsaWMgZ2V0TW9ja3MoKSB7XG4gICAgY29uc3Qgc3VpdGUgPSB0aGlzLmdldFN1aXRlRmlsZXBhdGgoKVxuICAgIGNvbnN0IHN1aXRlTW9ja3MgPSB0aGlzLm1vY2tNYXBbc3VpdGVdXG4gICAgY29uc3QgZ2xvYmFsTW9ja3MgPSB0aGlzLm1vY2tNYXAuZ2xvYmFsXG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZ2xvYmFsTW9ja3MsXG4gICAgICAuLi5zdWl0ZU1vY2tzLFxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVzb2x2ZVBhdGgoaWQ6IHN0cmluZywgaW1wb3J0ZXI6IHN0cmluZykge1xuICAgIGNvbnN0IHBhdGggPSBhd2FpdCB0aGlzLm9wdGlvbnMucmVzb2x2ZUlkKGlkLCBpbXBvcnRlcilcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogbm9ybWFsaXplSWQocGF0aD8uaWQgfHwgaWQpLFxuICAgICAgZXh0ZXJuYWw6IHBhdGg/LmlkLmluY2x1ZGVzKCcvbm9kZV9tb2R1bGVzLycpID8gaWQgOiBudWxsLFxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcmVzb2x2ZU1vY2tzKCkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKHBlbmRpbmdJZHMubWFwKGFzeW5jKG1vY2spID0+IHtcbiAgICAgIGNvbnN0IHsgcGF0aCwgZXh0ZXJuYWwgfSA9IGF3YWl0IHRoaXMucmVzb2x2ZVBhdGgobW9jay5pZCwgbW9jay5pbXBvcnRlcilcbiAgICAgIGlmIChtb2NrLnR5cGUgPT09ICd1bm1vY2snKVxuICAgICAgICB0aGlzLnVubW9ja1BhdGgocGF0aClcbiAgICAgIGlmIChtb2NrLnR5cGUgPT09ICdtb2NrJylcbiAgICAgICAgdGhpcy5tb2NrUGF0aChwYXRoLCBleHRlcm5hbCwgbW9jay5mYWN0b3J5KVxuICAgIH0pKVxuXG4gICAgcGVuZGluZ0lkcy5sZW5ndGggPSAwXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNhbGxGdW5jdGlvbk1vY2soZGVwOiBzdHJpbmcsIG1vY2s6ICgpID0+IGFueSkge1xuICAgIGNvbnN0IGNhY2hlTmFtZSA9IGAke2RlcH1fX21vY2tgXG4gICAgY29uc3QgY2FjaGVkID0gdGhpcy5tb2R1bGVDYWNoZS5nZXQoY2FjaGVOYW1lKT8uZXhwb3J0c1xuICAgIGlmIChjYWNoZWQpXG4gICAgICByZXR1cm4gY2FjaGVkXG4gICAgY29uc3QgZXhwb3J0cyA9IGF3YWl0IG1vY2soKVxuICAgIHRoaXMuZW1pdCgnbW9ja2VkJywgY2FjaGVOYW1lLCB7IGV4cG9ydHMgfSlcbiAgICByZXR1cm4gZXhwb3J0c1xuICB9XG5cbiAgcHVibGljIGdldERlcGVuZGVuY3lNb2NrKGRlcDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TW9ja3MoKVt0aGlzLnJlc29sdmVEZXBlbmRlbmN5KGRlcCldXG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZURlcGVuZGVuY3koZGVwOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplSWQoZGVwKS5yZXBsYWNlKC9eXFwvQGZzXFwvLywgaXNXaW5kb3dzID8gJycgOiAnLycpXG4gIH1cblxuICBwdWJsaWMgbm9ybWFsaXplUGF0aChwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbm9ybWFsaXplSWQocGF0aC5yZXBsYWNlKHRoaXMucm9vdCwgJycpKS5yZXBsYWNlKC9eXFwvQGZzXFwvLywgaXNXaW5kb3dzID8gJycgOiAnLycpXG4gIH1cblxuICBwdWJsaWMgZ2V0RnNQYXRoKHBhdGg6IHN0cmluZywgZXh0ZXJuYWw6IHN0cmluZyB8IG51bGwpIHtcbiAgICBpZiAoZXh0ZXJuYWwpXG4gICAgICByZXR1cm4gbWVyZ2VTbGFzaGVzKGAvQGZzLyR7cGF0aH1gKVxuXG4gICAgcmV0dXJuIG5vcm1hbGl6ZUlkKHBhdGgucmVwbGFjZSh0aGlzLnJvb3QsICcnKSlcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlTW9ja1BhdGgobW9ja1BhdGg6IHN0cmluZywgZXh0ZXJuYWw6IHN0cmluZyB8IG51bGwpIHtcbiAgICBjb25zdCBwYXRoID0gbm9ybWFsaXplSWQoZXh0ZXJuYWwgfHwgbW9ja1BhdGgpXG5cbiAgICAvLyBpdCdzIGEgbm9kZV9tb2R1bGUgYWxpYXNcbiAgICAvLyBhbGwgbW9ja3Mgc2hvdWxkIGJlIGluc2lkZSA8cm9vdD4vX19tb2Nrc19fXG4gICAgaWYgKGV4dGVybmFsIHx8IGlzTm9kZUJ1aWx0aW4obW9ja1BhdGgpKSB7XG4gICAgICBjb25zdCBtb2NrRGlybmFtZSA9IGRpcm5hbWUocGF0aCkgLy8gZm9yIG5lc3RlZCBtb2NrczogQHZ1ZXVzZS9pbnRlZ3JhdGlvbi91c2VKd3RcbiAgICAgIGNvbnN0IGJhc2VGaWxlbmFtZSA9IGJhc2VuYW1lKHBhdGgpXG4gICAgICBjb25zdCBtb2NrRm9sZGVyID0gcmVzb2x2ZSh0aGlzLnJvb3QsICdfX21vY2tzX18nLCBtb2NrRGlybmFtZSlcblxuICAgICAgaWYgKCFleGlzdHNTeW5jKG1vY2tGb2xkZXIpKSByZXR1cm4gbnVsbFxuXG4gICAgICBjb25zdCBmaWxlcyA9IHJlYWRkaXJTeW5jKG1vY2tGb2xkZXIpXG5cbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBjb25zdCBbYmFzZW5hbWVdID0gZmlsZS5zcGxpdCgnLicpXG4gICAgICAgIGlmIChiYXNlbmFtZSA9PT0gYmFzZUZpbGVuYW1lKVxuICAgICAgICAgIHJldHVybiByZXNvbHZlKG1vY2tGb2xkZXIsIGZpbGUpLnJlcGxhY2UodGhpcy5yb290LCAnJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBkaXIgPSBkaXJuYW1lKHBhdGgpXG4gICAgY29uc3QgYmFzZUlkID0gYmFzZW5hbWUocGF0aClcbiAgICBjb25zdCBmdWxsUGF0aCA9IHJlc29sdmUoZGlyLCAnX19tb2Nrc19fJywgYmFzZUlkKVxuICAgIHJldHVybiBleGlzdHNTeW5jKGZ1bGxQYXRoKSA/IGZ1bGxQYXRoLnJlcGxhY2UodGhpcy5yb290LCAnJykgOiBudWxsXG4gIH1cblxuICBwdWJsaWMgbW9ja09iamVjdChvYmo6IGFueSkge1xuICAgIGlmICghdGhpcy5zcHkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIFZpdGVzdCBlcnJvcjogU3B5IGZ1bmN0aW9uIGlzIG5vdCBkZWZpbmVkLicpXG5cbiAgICBjb25zdCB0eXBlID0gZ2V0T2JqZWN0VHlwZShvYmopXG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKVxuICAgICAgcmV0dXJuIFtdXG4gICAgZWxzZSBpZiAodHlwZSAhPT0gJ09iamVjdCcgJiYgdHlwZSAhPT0gJ01vZHVsZScpXG4gICAgICByZXR1cm4gb2JqXG5cbiAgICBjb25zdCBuZXdPYmogPSB7IC4uLm9iaiB9XG5cbiAgICBjb25zdCBwcm90byA9IG1vY2tQcm90b3R5cGUodGhpcy5zcHkuc3B5T24sIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopKVxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihuZXdPYmosIHByb3RvKVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgZm9yIChjb25zdCBrIGluIG9iaikge1xuICAgICAgbmV3T2JqW2tdID0gdGhpcy5tb2NrT2JqZWN0KG9ialtrXSlcbiAgICAgIGNvbnN0IHR5cGUgPSBnZXRPYmplY3RUeXBlKG9ialtrXSlcblxuICAgICAgaWYgKHR5cGUuaW5jbHVkZXMoJ0Z1bmN0aW9uJykgJiYgIW9ialtrXS5faXNNb2NrRnVuY3Rpb24pIHtcbiAgICAgICAgdGhpcy5zcHkuc3B5T24obmV3T2JqLCBrKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge30pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuZXdPYmpba10sICdsZW5ndGgnLCB7IHZhbHVlOiAwIH0pIC8vIHRpbnlzcHkgcmV0YWlucyBsZW5ndGgsIGJ1dCBqZXN0IGRvZXNuJ3RcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09ialxuICB9XG5cbiAgcHVibGljIHVubW9ja1BhdGgocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgc3VpdGVmaWxlID0gdGhpcy5nZXRTdWl0ZUZpbGVwYXRoKClcblxuICAgIGNvbnN0IGZzUGF0aCA9IHRoaXMubm9ybWFsaXplUGF0aChwYXRoKVxuXG4gICAgaWYgKHRoaXMubW9ja01hcFtzdWl0ZWZpbGVdPy5bZnNQYXRoXSlcbiAgICAgIGRlbGV0ZSB0aGlzLm1vY2tNYXBbc3VpdGVmaWxlXVtmc1BhdGhdXG4gIH1cblxuICBwdWJsaWMgbW9ja1BhdGgocGF0aDogc3RyaW5nLCBleHRlcm5hbDogc3RyaW5nIHwgbnVsbCwgZmFjdG9yeT86ICgpID0+IGFueSkge1xuICAgIGNvbnN0IHN1aXRlZmlsZSA9IHRoaXMuZ2V0U3VpdGVGaWxlcGF0aCgpXG5cbiAgICBjb25zdCBmc1BhdGggPSB0aGlzLm5vcm1hbGl6ZVBhdGgocGF0aClcblxuICAgIHRoaXMubW9ja01hcFtzdWl0ZWZpbGVdID8/PSB7fVxuICAgIHRoaXMubW9ja01hcFtzdWl0ZWZpbGVdW2ZzUGF0aF0gPSBmYWN0b3J5IHx8IHRoaXMucmVzb2x2ZU1vY2tQYXRoKHBhdGgsIGV4dGVybmFsKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGltcG9ydEFjdHVhbDxUPihpZDogc3RyaW5nLCBpbXBvcnRlcjogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgeyBwYXRoLCBleHRlcm5hbCB9ID0gYXdhaXQgdGhpcy5yZXNvbHZlUGF0aChpZCwgaW1wb3J0ZXIpXG4gICAgY29uc3QgZnNQYXRoID0gdGhpcy5nZXRGc1BhdGgocGF0aCwgZXh0ZXJuYWwpXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5yZXF1ZXN0KGZzUGF0aClcbiAgICByZXR1cm4gcmVzdWx0IGFzIFRcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbXBvcnRNb2NrKGlkOiBzdHJpbmcsIGltcG9ydGVyOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHsgcGF0aCwgZXh0ZXJuYWwgfSA9IGF3YWl0IHRoaXMucmVzb2x2ZVBhdGgoaWQsIGltcG9ydGVyKVxuXG4gICAgbGV0IG1vY2sgPSB0aGlzLmdldERlcGVuZGVuY3lNb2NrKHBhdGgpXG5cbiAgICBpZiAobW9jayA9PT0gdW5kZWZpbmVkKVxuICAgICAgbW9jayA9IHRoaXMucmVzb2x2ZU1vY2tQYXRoKHBhdGgsIGV4dGVybmFsKVxuXG4gICAgaWYgKG1vY2sgPT09IG51bGwpIHtcbiAgICAgIGF3YWl0IHRoaXMuZW5zdXJlU3B5KClcbiAgICAgIGNvbnN0IGZzUGF0aCA9IHRoaXMuZ2V0RnNQYXRoKHBhdGgsIGV4dGVybmFsKVxuICAgICAgY29uc3QgbW9kID0gYXdhaXQgdGhpcy5yZXF1ZXN0KGZzUGF0aClcbiAgICAgIHJldHVybiB0aGlzLm1vY2tPYmplY3QobW9kKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIG1vY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5jYWxsRnVuY3Rpb25Nb2NrKHBhdGgsIG1vY2spXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdFdpdGhNb2NrKG1vY2spXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGVuc3VyZVNweSgpIHtcbiAgICBpZiAodGhpcy5zcHkpIHJldHVyblxuICAgIHRoaXMuc3B5ID0gYXdhaXQgdGhpcy5yZXF1ZXN0KHJlc29sdmUoZGlzdERpciwgJ2plc3QtbW9jay5qcycpKSBhcyB0eXBlb2YgaW1wb3J0KCcuLi9pbnRlZ3JhdGlvbnMvamVzdC1tb2NrJylcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXF1ZXN0V2l0aE1vY2soZGVwOiBzdHJpbmcpIHtcbiAgICBhd2FpdCB0aGlzLmVuc3VyZVNweSgpXG4gICAgYXdhaXQgdGhpcy5yZXNvbHZlTW9ja3MoKVxuXG4gICAgY29uc3QgbW9jayA9IHRoaXMuZ2V0RGVwZW5kZW5jeU1vY2soZGVwKVxuXG4gICAgaWYgKG1vY2sgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGNhY2hlTmFtZSA9IGAke2RlcH1fX21vY2tgXG4gICAgICBjb25zdCBjYWNoZSA9IHRoaXMubW9kdWxlQ2FjaGUuZ2V0KGNhY2hlTmFtZSlcbiAgICAgIGlmIChjYWNoZT8uZXhwb3J0cylcbiAgICAgICAgcmV0dXJuIGNhY2hlLmV4cG9ydHNcbiAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdG9GaWxlUGF0aChkZXAsIHRoaXMucm9vdClcbiAgICAgIGNvbnN0IG1vZCA9IHRoaXMubW9kdWxlQ2FjaGUuZ2V0KGNhY2hlS2V5KT8uZXhwb3J0cyB8fCBhd2FpdCB0aGlzLnJlcXVlc3QoZGVwKVxuICAgICAgY29uc3QgZXhwb3J0cyA9IHRoaXMubW9ja09iamVjdChtb2QpXG4gICAgICB0aGlzLmVtaXQoJ21vY2tlZCcsIGNhY2hlTmFtZSwgeyBleHBvcnRzIH0pXG4gICAgICByZXR1cm4gZXhwb3J0c1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG1vY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICByZXR1cm4gdGhpcy5jYWxsRnVuY3Rpb25Nb2NrKGRlcCwgbW9jaylcbiAgICBpZiAodHlwZW9mIG1vY2sgPT09ICdzdHJpbmcnKVxuICAgICAgZGVwID0gbW9ja1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZGVwKVxuICB9XG5cbiAgcHVibGljIHF1ZXVlTW9jayhpZDogc3RyaW5nLCBpbXBvcnRlcjogc3RyaW5nLCBmYWN0b3J5PzogKCkgPT4gdW5rbm93bikge1xuICAgIHBlbmRpbmdJZHMucHVzaCh7IHR5cGU6ICdtb2NrJywgaWQsIGltcG9ydGVyLCBmYWN0b3J5IH0pXG4gIH1cblxuICBwdWJsaWMgcXVldWVVbm1vY2soaWQ6IHN0cmluZywgaW1wb3J0ZXI6IHN0cmluZykge1xuICAgIHBlbmRpbmdJZHMucHVzaCh7IHR5cGU6ICd1bm1vY2snLCBpZCwgaW1wb3J0ZXIgfSlcbiAgfVxuXG4gIHB1YmxpYyB3aXRoUmVxdWVzdChyZXF1ZXN0OiAoZGVwOiBzdHJpbmcpID0+IHVua25vd24pIHtcbiAgICByZXR1cm4gbmV3IFZpdGVzdE1vY2tlcih0aGlzLm9wdGlvbnMsIHRoaXMubW9kdWxlQ2FjaGUsIHJlcXVlc3QpXG4gIH1cbn1cbiIsImltcG9ydCB7IFZpdGVOb2RlUnVubmVyIH0gZnJvbSAndml0ZS1ub2RlL2NsaWVudCdcbmltcG9ydCB0eXBlIHsgTW9kdWxlQ2FjaGUsIFZpdGVOb2RlUnVubmVyT3B0aW9ucyB9IGZyb20gJ3ZpdGUtbm9kZSdcbmltcG9ydCB0eXBlIHsgU3VpdGVNb2NrcyB9IGZyb20gJy4vbW9ja2VyJ1xuaW1wb3J0IHsgVml0ZXN0TW9ja2VyIH0gZnJvbSAnLi9tb2NrZXInXG5cbmV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0ZU9wdGlvbnMgZXh0ZW5kcyBWaXRlTm9kZVJ1bm5lck9wdGlvbnMge1xuICBmaWxlczogc3RyaW5nW11cbiAgbW9ja01hcDogU3VpdGVNb2Nrc1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUluVml0ZU5vZGUob3B0aW9uczogRXhlY3V0ZU9wdGlvbnMpIHtcbiAgY29uc3QgcnVubmVyID0gbmV3IFZpdGVzdFJ1bm5lcihvcHRpb25zKVxuXG4gIC8vIHByb3ZpZGUgdGhlIHZpdGUgZGVmaW5lIHZhcmlhYmxlIGluIHRoaXMgY29udGV4dFxuICBhd2FpdCBydW5uZXIuZXhlY3V0ZUlkKCcvQHZpdGUvZW52JylcblxuICBjb25zdCByZXN1bHQ6IGFueVtdID0gW11cbiAgZm9yIChjb25zdCBmaWxlIG9mIG9wdGlvbnMuZmlsZXMpXG4gICAgcmVzdWx0LnB1c2goYXdhaXQgcnVubmVyLmV4ZWN1dGVGaWxlKGZpbGUpKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNsYXNzIFZpdGVzdFJ1bm5lciBleHRlbmRzIFZpdGVOb2RlUnVubmVyIHtcbiAgbW9ja2VyOiBWaXRlc3RNb2NrZXJcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0aW9uczogRXhlY3V0ZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKVxuICAgIHRoaXMubW9ja2VyID0gbmV3IFZpdGVzdE1vY2tlcihvcHRpb25zLCB0aGlzLm1vZHVsZUNhY2hlKVxuICB9XG5cbiAgcHJlcGFyZUNvbnRleHQoY29udGV4dDogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBjb250ZXh0Ll9fdml0ZV9zc3JfaW1wb3J0X19cblxuICAgIGNvbnN0IG1vY2tlciA9IHRoaXMubW9ja2VyLndpdGhSZXF1ZXN0KHJlcXVlc3QpXG5cbiAgICBtb2NrZXIub24oJ21vY2tlZCcsIChkZXA6IHN0cmluZywgbW9kdWxlOiBQYXJ0aWFsPE1vZHVsZUNhY2hlPikgPT4ge1xuICAgICAgdGhpcy5zZXRDYWNoZShkZXAsIG1vZHVsZSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oY29udGV4dCwge1xuICAgICAgX192aXRlX3Nzcl9pbXBvcnRfXzogKGRlcDogc3RyaW5nKSA9PiBtb2NrZXIucmVxdWVzdFdpdGhNb2NrKGRlcCksXG4gICAgICBfX3ZpdGVfc3NyX2R5bmFtaWNfaW1wb3J0X186IChkZXA6IHN0cmluZykgPT4gbW9ja2VyLnJlcXVlc3RXaXRoTW9jayhkZXApLFxuXG4gICAgICBfX3ZpdGVzdF9tb2NrZXJfXzogbW9ja2VyLFxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoZSdcbmltcG9ydCB7IGNyZWF0ZUJpcnBjIH0gZnJvbSAnYmlycGMnXG5pbXBvcnQgdHlwZSB7IE1vZHVsZUNhY2hlLCBSZXNvbHZlZENvbmZpZywgV29ya2VyQ29udGV4dCwgV29ya2VyR2xvYmFsU3RhdGUsIFdvcmtlclJQQyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgZGlzdERpciB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IGV4ZWN1dGVJblZpdGVOb2RlIH0gZnJvbSAnLi4vbm9kZS9leGVjdXRlJ1xuaW1wb3J0IHsgcnBjIH0gZnJvbSAnLi9ycGMnXG5cbmxldCBfdml0ZU5vZGU6IHtcbiAgcnVuOiAoZmlsZXM6IHN0cmluZ1tdLCBjb25maWc6IFJlc29sdmVkQ29uZmlnKSA9PiBQcm9taXNlPHZvaWQ+XG4gIGNvbGxlY3Q6IChmaWxlczogc3RyaW5nW10sIGNvbmZpZzogUmVzb2x2ZWRDb25maWcpID0+IFByb21pc2U8dm9pZD5cbn1cbmxldCBfX3ZpdGVzdF93b3JrZXJfXzogV29ya2VyR2xvYmFsU3RhdGVcbmNvbnN0IG1vZHVsZUNhY2hlOiBNYXA8c3RyaW5nLCBNb2R1bGVDYWNoZT4gPSBuZXcgTWFwKClcbmNvbnN0IG1vY2tNYXAgPSB7fVxuXG5hc3luYyBmdW5jdGlvbiBzdGFydFZpdGVOb2RlKGN0eDogV29ya2VyQ29udGV4dCkge1xuICBpZiAoX3ZpdGVOb2RlKVxuICAgIHJldHVybiBfdml0ZU5vZGVcblxuICBjb25zdCBwcm9jZXNzRXhpdCA9IHByb2Nlc3MuZXhpdFxuXG4gIHByb2Nlc3Mub24oJ2JlZm9yZUV4aXQnLCAoY29kZSkgPT4ge1xuICAgIHJwYygpLm9uV29ya2VyRXhpdChjb2RlKVxuICB9KVxuXG4gIHByb2Nlc3MuZXhpdCA9IChjb2RlID0gcHJvY2Vzcy5leGl0Q29kZSB8fCAwKTogbmV2ZXIgPT4ge1xuICAgIHJwYygpLm9uV29ya2VyRXhpdChjb2RlKVxuICAgIHJldHVybiBwcm9jZXNzRXhpdChjb2RlKVxuICB9XG5cbiAgY29uc3QgeyBjb25maWcgfSA9IGN0eFxuXG4gIGNvbnN0IHsgcnVuLCBjb2xsZWN0IH0gPSAoYXdhaXQgZXhlY3V0ZUluVml0ZU5vZGUoe1xuICAgIGZpbGVzOiBbXG4gICAgICByZXNvbHZlKGRpc3REaXIsICdlbnRyeS5qcycpLFxuICAgIF0sXG4gICAgZmV0Y2hNb2R1bGUoaWQpIHtcbiAgICAgIHJldHVybiBycGMoKS5mZXRjaChpZClcbiAgICB9LFxuICAgIHJlc29sdmVJZChpZCwgaW1wb3J0ZXIpIHtcbiAgICAgIHJldHVybiBycGMoKS5yZXNvbHZlSWQoaWQsIGltcG9ydGVyKVxuICAgIH0sXG4gICAgbW9kdWxlQ2FjaGUsXG4gICAgbW9ja01hcCxcbiAgICBpbnRlcm9wRGVmYXVsdDogY29uZmlnLmRlcHMuaW50ZXJvcERlZmF1bHQgPz8gdHJ1ZSxcbiAgICByb290OiBjb25maWcucm9vdCxcbiAgICBiYXNlOiBjb25maWcuYmFzZSxcbiAgfSkpWzBdXG5cbiAgX3ZpdGVOb2RlID0geyBydW4sIGNvbGxlY3QgfVxuXG4gIHJldHVybiBfdml0ZU5vZGVcbn1cblxuZnVuY3Rpb24gaW5pdChjdHg6IFdvcmtlckNvbnRleHQpIHtcbiAgaWYgKF9fdml0ZXN0X3dvcmtlcl9fICYmIGN0eC5jb25maWcudGhyZWFkcyAmJiBjdHguY29uZmlnLmlzb2xhdGUpXG4gICAgdGhyb3cgbmV3IEVycm9yKGB3b3JrZXIgZm9yICR7Y3R4LmZpbGVzLmpvaW4oJywnKX0gYWxyZWFkeSBpbml0aWFsaXplZCBieSAke19fdml0ZXN0X3dvcmtlcl9fLmN0eC5maWxlcy5qb2luKCcsJyl9LiBUaGlzIGlzIHByb2JhYmx5IGFuIGludGVybmFsIGJ1ZyBvZiBWaXRlc3QuYClcblxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSgnXFwwJylcblxuICBjb25zdCB7IGNvbmZpZywgcG9ydCwgaWQgfSA9IGN0eFxuXG4gIHByb2Nlc3MuZW52LlZJVEVTVF9XT1JLRVJfSUQgPSBTdHJpbmcoaWQpXG5cbiAgLy8gQHRzLWV4cGVjdC1lcnJvciBJIGtub3cgd2hhdCBJIGFtIGRvaW5nIDpQXG4gIGdsb2JhbFRoaXMuX192aXRlc3Rfd29ya2VyX18gPSB7XG4gICAgY3R4LFxuICAgIG1vZHVsZUNhY2hlLFxuICAgIGNvbmZpZyxcbiAgICBycGM6IGNyZWF0ZUJpcnBjPFdvcmtlclJQQz4oXG4gICAgICB7fSxcbiAgICAgIHtcbiAgICAgICAgZXZlbnROYW1lczogWydvblVzZXJDb25zb2xlTG9nJywgJ29uRmluaXNoZWQnLCAnb25Db2xsZWN0ZWQnLCAnb25Xb3JrZXJFeGl0J10sXG4gICAgICAgIHBvc3QodikgeyBwb3J0LnBvc3RNZXNzYWdlKHYpIH0sXG4gICAgICAgIG9uKGZuKSB7IHBvcnQuYWRkTGlzdGVuZXIoJ21lc3NhZ2UnLCBmbikgfSxcbiAgICAgIH0sXG4gICAgKSxcbiAgfVxuXG4gIGlmIChjdHguaW52YWxpZGF0ZXMpXG4gICAgY3R4LmludmFsaWRhdGVzLmZvckVhY2goaSA9PiBtb2R1bGVDYWNoZS5kZWxldGUoaSkpXG4gIGN0eC5maWxlcy5mb3JFYWNoKGkgPT4gbW9kdWxlQ2FjaGUuZGVsZXRlKGkpKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29sbGVjdChjdHg6IFdvcmtlckNvbnRleHQpIHtcbiAgaW5pdChjdHgpXG4gIGNvbnN0IHsgY29sbGVjdCB9ID0gYXdhaXQgc3RhcnRWaXRlTm9kZShjdHgpXG4gIHJldHVybiBjb2xsZWN0KGN0eC5maWxlcywgY3R4LmNvbmZpZylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bihjdHg6IFdvcmtlckNvbnRleHQpIHtcbiAgaW5pdChjdHgpXG4gIGNvbnN0IHsgcnVuIH0gPSBhd2FpdCBzdGFydFZpdGVOb2RlKGN0eClcbiAgcmV0dXJuIHJ1bihjdHguZmlsZXMsIGN0eC5jb25maWcpXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgbGV0IF9fdml0ZXN0X3dvcmtlcl9fOiBpbXBvcnQoJ3ZpdGVzdCcpLldvcmtlckdsb2JhbFN0YXRlXG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUN0QyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ2pDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENB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
