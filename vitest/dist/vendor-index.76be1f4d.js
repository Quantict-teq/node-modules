import path from 'path';

function normalizeWindowsPath(input = "") {
  if (!input.includes("\\")) {
    return input;
  }
  return input.replace(/\\/g, "/");
}

const _UNC_REGEX = /^[/][/]/;
const _UNC_DRIVE_REGEX = /^[/][/]([.]{1,2}[/])?([a-zA-Z]):[/]/;
const _IS_ABSOLUTE_RE = /^\/|^\\|^[a-zA-Z]:[/\\]/;
const sep = "/";
const delimiter = ":";
const normalize = function(path2) {
  if (path2.length === 0) {
    return ".";
  }
  path2 = normalizeWindowsPath(path2);
  const isUNCPath = path2.match(_UNC_REGEX);
  const hasUNCDrive = isUNCPath && path2.match(_UNC_DRIVE_REGEX);
  const isPathAbsolute = isAbsolute(path2);
  const trailingSeparator = path2[path2.length - 1] === "/";
  path2 = normalizeString(path2, !isPathAbsolute);
  if (path2.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path2 += "/";
  }
  if (isUNCPath) {
    if (hasUNCDrive) {
      return `//./${path2}`;
    }
    return `//${path2}`;
  }
  return isPathAbsolute && !isAbsolute(path2) ? `/${path2}` : path2;
};
const join = function(...args) {
  if (args.length === 0) {
    return ".";
  }
  let joined;
  for (let i = 0; i < args.length; ++i) {
    const arg = args[i];
    if (arg.length > 0) {
      if (joined === void 0) {
        joined = arg;
      } else {
        joined += `/${arg}`;
      }
    }
  }
  if (joined === void 0) {
    return ".";
  }
  return normalize(joined);
};
const resolve = function(...args) {
  args = args.map((arg) => normalizeWindowsPath(arg));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    const path2 = i >= 0 ? args[i] : process.cwd();
    if (path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path2);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let i = 0; i <= path2.length; ++i) {
    if (i < path2.length) {
      char = path2[i];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === i - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length !== 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, i)}`;
        } else {
          res = path2.slice(lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const toNamespacedPath = function(p) {
  return normalizeWindowsPath(p);
};
const extname = function(p) {
  return path.posix.extname(normalizeWindowsPath(p));
};
const relative = function(from, to) {
  return path.posix.relative(normalizeWindowsPath(from), normalizeWindowsPath(to));
};
const dirname = function(p) {
  return path.posix.dirname(normalizeWindowsPath(p));
};
const format = function(p) {
  return normalizeWindowsPath(path.posix.format(p));
};
const basename = function(p, ext) {
  return path.posix.basename(normalizeWindowsPath(p), ext);
};
const parse = function(p) {
  return path.posix.parse(normalizeWindowsPath(p));
};

const _path = /*#__PURE__*/Object.freeze({
  __proto__: null,
  sep: sep,
  delimiter: delimiter,
  normalize: normalize,
  join: join,
  resolve: resolve,
  normalizeString: normalizeString,
  isAbsolute: isAbsolute,
  toNamespacedPath: toNamespacedPath,
  extname: extname,
  relative: relative,
  dirname: dirname,
  format: format,
  basename: basename,
  parse: parse
});

const index = {
  ..._path
};

export { resolve as a, basename as b, index as c, dirname as d, isAbsolute as i, relative as r };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLWluZGV4Ljc2YmUxZjRkLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcGF0aGVAMC4yLjAvbm9kZV9tb2R1bGVzL3BhdGhlL2Rpc3QvaW5kZXgubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBub3JtYWxpemVXaW5kb3dzUGF0aChpbnB1dCA9IFwiXCIpIHtcbiAgaWYgKCFpbnB1dC5pbmNsdWRlcyhcIlxcXFxcIikpIHtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xufVxuXG5jb25zdCBfVU5DX1JFR0VYID0gL15bL11bL10vO1xuY29uc3QgX1VOQ19EUklWRV9SRUdFWCA9IC9eWy9dWy9dKFsuXXsxLDJ9Wy9dKT8oW2EtekEtWl0pOlsvXS87XG5jb25zdCBfSVNfQUJTT0xVVEVfUkUgPSAvXlxcL3xeXFxcXHxeW2EtekEtWl06Wy9cXFxcXS87XG5jb25zdCBzZXAgPSBcIi9cIjtcbmNvbnN0IGRlbGltaXRlciA9IFwiOlwiO1xuY29uc3Qgbm9ybWFsaXplID0gZnVuY3Rpb24ocGF0aDIpIHtcbiAgaWYgKHBhdGgyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBcIi5cIjtcbiAgfVxuICBwYXRoMiA9IG5vcm1hbGl6ZVdpbmRvd3NQYXRoKHBhdGgyKTtcbiAgY29uc3QgaXNVTkNQYXRoID0gcGF0aDIubWF0Y2goX1VOQ19SRUdFWCk7XG4gIGNvbnN0IGhhc1VOQ0RyaXZlID0gaXNVTkNQYXRoICYmIHBhdGgyLm1hdGNoKF9VTkNfRFJJVkVfUkVHRVgpO1xuICBjb25zdCBpc1BhdGhBYnNvbHV0ZSA9IGlzQWJzb2x1dGUocGF0aDIpO1xuICBjb25zdCB0cmFpbGluZ1NlcGFyYXRvciA9IHBhdGgyW3BhdGgyLmxlbmd0aCAtIDFdID09PSBcIi9cIjtcbiAgcGF0aDIgPSBub3JtYWxpemVTdHJpbmcocGF0aDIsICFpc1BhdGhBYnNvbHV0ZSk7XG4gIGlmIChwYXRoMi5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNQYXRoQWJzb2x1dGUpIHtcbiAgICAgIHJldHVybiBcIi9cIjtcbiAgICB9XG4gICAgcmV0dXJuIHRyYWlsaW5nU2VwYXJhdG9yID8gXCIuL1wiIDogXCIuXCI7XG4gIH1cbiAgaWYgKHRyYWlsaW5nU2VwYXJhdG9yKSB7XG4gICAgcGF0aDIgKz0gXCIvXCI7XG4gIH1cbiAgaWYgKGlzVU5DUGF0aCkge1xuICAgIGlmIChoYXNVTkNEcml2ZSkge1xuICAgICAgcmV0dXJuIGAvLy4vJHtwYXRoMn1gO1xuICAgIH1cbiAgICByZXR1cm4gYC8vJHtwYXRoMn1gO1xuICB9XG4gIHJldHVybiBpc1BhdGhBYnNvbHV0ZSAmJiAhaXNBYnNvbHV0ZShwYXRoMikgPyBgLyR7cGF0aDJ9YCA6IHBhdGgyO1xufTtcbmNvbnN0IGpvaW4gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBcIi5cIjtcbiAgfVxuICBsZXQgam9pbmVkO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBhcmcgPSBhcmdzW2ldO1xuICAgIGlmIChhcmcubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKGpvaW5lZCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGpvaW5lZCA9IGFyZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpvaW5lZCArPSBgLyR7YXJnfWA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChqb2luZWQgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBcIi5cIjtcbiAgfVxuICByZXR1cm4gbm9ybWFsaXplKGpvaW5lZCk7XG59O1xuY29uc3QgcmVzb2x2ZSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgYXJncyA9IGFyZ3MubWFwKChhcmcpID0+IG5vcm1hbGl6ZVdpbmRvd3NQYXRoKGFyZykpO1xuICBsZXQgcmVzb2x2ZWRQYXRoID0gXCJcIjtcbiAgbGV0IHJlc29sdmVkQWJzb2x1dGUgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgY29uc3QgcGF0aDIgPSBpID49IDAgPyBhcmdzW2ldIDogcHJvY2Vzcy5jd2QoKTtcbiAgICBpZiAocGF0aDIubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmVzb2x2ZWRQYXRoID0gYCR7cGF0aDJ9LyR7cmVzb2x2ZWRQYXRofWA7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGlzQWJzb2x1dGUocGF0aDIpO1xuICB9XG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZVN0cmluZyhyZXNvbHZlZFBhdGgsICFyZXNvbHZlZEFic29sdXRlKTtcbiAgaWYgKHJlc29sdmVkQWJzb2x1dGUgJiYgIWlzQWJzb2x1dGUocmVzb2x2ZWRQYXRoKSkge1xuICAgIHJldHVybiBgLyR7cmVzb2x2ZWRQYXRofWA7XG4gIH1cbiAgcmV0dXJuIHJlc29sdmVkUGF0aC5sZW5ndGggPiAwID8gcmVzb2x2ZWRQYXRoIDogXCIuXCI7XG59O1xuZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5nKHBhdGgyLCBhbGxvd0Fib3ZlUm9vdCkge1xuICBsZXQgcmVzID0gXCJcIjtcbiAgbGV0IGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgbGV0IGxhc3RTbGFzaCA9IC0xO1xuICBsZXQgZG90cyA9IDA7XG4gIGxldCBjaGFyID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcGF0aDIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgyLmxlbmd0aCkge1xuICAgICAgY2hhciA9IHBhdGgyW2ldO1xuICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gXCIvXCIpIHtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGFyID0gXCIvXCI7XG4gICAgfVxuICAgIGlmIChjaGFyID09PSBcIi9cIikge1xuICAgICAgaWYgKGxhc3RTbGFzaCA9PT0gaSAtIDEgfHwgZG90cyA9PT0gMSkgOyBlbHNlIGlmIChkb3RzID09PSAyKSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoIDwgMiB8fCBsYXN0U2VnbWVudExlbmd0aCAhPT0gMiB8fCByZXNbcmVzLmxlbmd0aCAtIDFdICE9PSBcIi5cIiB8fCByZXNbcmVzLmxlbmd0aCAtIDJdICE9PSBcIi5cIikge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgY29uc3QgbGFzdFNsYXNoSW5kZXggPSByZXMubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICByZXMgPSBcIlwiO1xuICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXMgPSByZXMuc2xpY2UoMCwgbGFzdFNsYXNoSW5kZXgpO1xuICAgICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IHJlcy5sZW5ndGggLSAxIC0gcmVzLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgcmVzID0gXCJcIjtcbiAgICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICBkb3RzID0gMDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgICByZXMgKz0gcmVzLmxlbmd0aCA+IDAgPyBcIi8uLlwiIDogXCIuLlwiO1xuICAgICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gMjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzICs9IGAvJHtwYXRoMi5zbGljZShsYXN0U2xhc2ggKyAxLCBpKX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcyA9IHBhdGgyLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RTZWdtZW50TGVuZ3RoID0gaSAtIGxhc3RTbGFzaCAtIDE7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjaGFyID09PSBcIi5cIiAmJiBkb3RzICE9PSAtMSkge1xuICAgICAgKytkb3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb3RzID0gLTE7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5jb25zdCBpc0Fic29sdXRlID0gZnVuY3Rpb24ocCkge1xuICByZXR1cm4gX0lTX0FCU09MVVRFX1JFLnRlc3QocCk7XG59O1xuY29uc3QgdG9OYW1lc3BhY2VkUGF0aCA9IGZ1bmN0aW9uKHApIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZVdpbmRvd3NQYXRoKHApO1xufTtcbmNvbnN0IGV4dG5hbWUgPSBmdW5jdGlvbihwKSB7XG4gIHJldHVybiBwYXRoLnBvc2l4LmV4dG5hbWUobm9ybWFsaXplV2luZG93c1BhdGgocCkpO1xufTtcbmNvbnN0IHJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgcmV0dXJuIHBhdGgucG9zaXgucmVsYXRpdmUobm9ybWFsaXplV2luZG93c1BhdGgoZnJvbSksIG5vcm1hbGl6ZVdpbmRvd3NQYXRoKHRvKSk7XG59O1xuY29uc3QgZGlybmFtZSA9IGZ1bmN0aW9uKHApIHtcbiAgcmV0dXJuIHBhdGgucG9zaXguZGlybmFtZShub3JtYWxpemVXaW5kb3dzUGF0aChwKSk7XG59O1xuY29uc3QgZm9ybWF0ID0gZnVuY3Rpb24ocCkge1xuICByZXR1cm4gbm9ybWFsaXplV2luZG93c1BhdGgocGF0aC5wb3NpeC5mb3JtYXQocCkpO1xufTtcbmNvbnN0IGJhc2VuYW1lID0gZnVuY3Rpb24ocCwgZXh0KSB7XG4gIHJldHVybiBwYXRoLnBvc2l4LmJhc2VuYW1lKG5vcm1hbGl6ZVdpbmRvd3NQYXRoKHApLCBleHQpO1xufTtcbmNvbnN0IHBhcnNlID0gZnVuY3Rpb24ocCkge1xuICByZXR1cm4gcGF0aC5wb3NpeC5wYXJzZShub3JtYWxpemVXaW5kb3dzUGF0aChwKSk7XG59O1xuXG5jb25zdCBfcGF0aCA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgX19wcm90b19fOiBudWxsLFxuICBzZXA6IHNlcCxcbiAgZGVsaW1pdGVyOiBkZWxpbWl0ZXIsXG4gIG5vcm1hbGl6ZTogbm9ybWFsaXplLFxuICBqb2luOiBqb2luLFxuICByZXNvbHZlOiByZXNvbHZlLFxuICBub3JtYWxpemVTdHJpbmc6IG5vcm1hbGl6ZVN0cmluZyxcbiAgaXNBYnNvbHV0ZTogaXNBYnNvbHV0ZSxcbiAgdG9OYW1lc3BhY2VkUGF0aDogdG9OYW1lc3BhY2VkUGF0aCxcbiAgZXh0bmFtZTogZXh0bmFtZSxcbiAgcmVsYXRpdmU6IHJlbGF0aXZlLFxuICBkaXJuYW1lOiBkaXJuYW1lLFxuICBmb3JtYXQ6IGZvcm1hdCxcbiAgYmFzZW5hbWU6IGJhc2VuYW1lLFxuICBwYXJzZTogcGFyc2Vcbn0pO1xuXG5jb25zdCBpbmRleCA9IHtcbiAgLi4uX3BhdGhcbn07XG5cbmV4cG9ydCB7IGJhc2VuYW1lLCBpbmRleCBhcyBkZWZhdWx0LCBkZWxpbWl0ZXIsIGRpcm5hbWUsIGV4dG5hbWUsIGZvcm1hdCwgaXNBYnNvbHV0ZSwgam9pbiwgbm9ybWFsaXplLCBub3JtYWxpemVTdHJpbmcsIHBh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
