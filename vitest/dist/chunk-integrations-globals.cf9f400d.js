import { g as globalApis } from './chunk-constants.a1a50d89.js';
import { i as index } from './chunk-runtime-hooks.d42c0b7c.js';
import 'url';
import './vendor-index.76be1f4d.js';
import 'path';
import './chunk-runtime-chain.2a787014.js';
import 'util';
import './chunk-utils-base.68f100c1.js';
import 'tty';
import 'local-pkg';
import './jest-mock.js';
import 'chai';
import 'tinyspy';
import './chunk-utils-source-map.38ddd54e.js';
import './vendor-_commonjsHelpers.91d4f591.js';

function registerApiGlobally() {
  globalApis.forEach((api) => {
    globalThis[api] = index[api];
  });
}

export { registerApiGlobally };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmstaW50ZWdyYXRpb25zLWdsb2JhbHMuY2Y5ZjQwMGQuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnRlZ3JhdGlvbnMvZ2xvYmFscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnbG9iYWxBcGlzIH0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0ICogYXMgaW5kZXggZnJvbSAnLi4vaW5kZXgnXG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckFwaUdsb2JhbGx5KCkge1xuICBnbG9iYWxBcGlzLmZvckVhY2goKGFwaSkgPT4ge1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgSSBrbm93IHdoYXQgSSBhbSBkb2luZyA6UFxuICAgIGdsb2JhbFRoaXNbYXBpXSA9IGluZGV4W2FwaV1cbiAgfSlcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sU0FBUyxtQkFBbUIsR0FBRztBQUN0QyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDOUIsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7OyJ9
