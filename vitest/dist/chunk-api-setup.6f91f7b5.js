import { promises } from 'fs';
import { c as createBirpc } from './chunk-vite-node-utils.f2f4fe4b.js';
import require$$0$1 from 'stream';
import require$$0 from 'zlib';
import require$$3 from 'net';
import require$$4 from 'tls';
import require$$5 from 'crypto';
import require$$2 from 'events';
import require$$1 from 'https';
import require$$2$1 from 'http';
import url from 'url';
import { A as API_PATH } from './chunk-constants.a1a50d89.js';
import { i as interpretSourcePos, p as parseStacktrace } from './chunk-utils-source-map.38ddd54e.js';
import 'module';
import 'vm';
import './vendor-index.76be1f4d.js';
import 'path';
import 'assert';
import 'util';
import './chunk-utils-base.68f100c1.js';
import 'tty';
import 'local-pkg';

/*! (c) 2020 Andrea Giammarchi */

const {parse: $parse, stringify: $stringify} = JSON;
const {keys} = Object;

const Primitive = String;   // it could be Number
const primitive = 'string'; // it could be 'number'

const ignore = {};
const object = 'object';

const noop = (_, value) => value;

const primitives = value => (
  value instanceof Primitive ? Primitive(value) : value
);

const Primitives = (_, value) => (
  typeof value === primitive ? new Primitive(value) : value
);

const revive = (input, parsed, output, $) => {
  const lazy = [];
  for (let ke = keys(output), {length} = ke, y = 0; y < length; y++) {
    const k = ke[y];
    const value = output[k];
    if (value instanceof Primitive) {
      const tmp = input[value];
      if (typeof tmp === object && !parsed.has(tmp)) {
        parsed.add(tmp);
        output[k] = ignore;
        lazy.push({k, a: [input, parsed, tmp, $]});
      }
      else
        output[k] = $.call(output, k, tmp);
    }
    else if (output[k] !== ignore)
      output[k] = $.call(output, k, value);
  }
  for (let {length} = lazy, i = 0; i < length; i++) {
    const {k, a} = lazy[i];
    output[k] = $.call(output, k, revive.apply(null, a));
  }
  return output;
};

const set = (known, input, value) => {
  const index = Primitive(input.push(value) - 1);
  known.set(value, index);
  return index;
};

const parse$3 = (text, reviver) => {
  const input = $parse(text, Primitives).map(primitives);
  const value = input[0];
  const $ = reviver || noop;
  const tmp = typeof value === object && value ?
              revive(input, new Set, value, $) :
              value;
  return $.call({'': tmp}, '', tmp);
};

const stringify = (value, replacer, space) => {
  const $ = replacer && typeof replacer === object ?
            (k, v) => (k === '' || -1 < replacer.indexOf(k) ? v : void 0) :
            (replacer || noop);
  const known = new Map;
  const input = [];
  const output = [];
  let i = +set(known, input, $.call({'': value}, '', value));
  let firstRun = !i;
  while (i < input.length) {
    firstRun = true;
    output[i] = $stringify(input[i++], replace, space);
  }
  return '[' + output.join(',') + ']';
  function replace(key, value) {
    if (firstRun) {
      firstRun = !firstRun;
      return value;
    }
    const after = $.call(this, key, value);
    switch (typeof after) {
      case object:
        if (after === null) return after;
      case primitive:
        return known.get(after) || set(known, input, after);
    }
    return after;
  }
};

var bufferUtil$1 = {exports: {}};

var constants = {
  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
  EMPTY_BUFFER: Buffer.alloc(0),
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
  kListener: Symbol('kListener'),
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  NOOP: () => {}
};

const { EMPTY_BUFFER: EMPTY_BUFFER$3 } = constants;

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
function concat$1(list, totalLength) {
  if (list.length === 0) return EMPTY_BUFFER$3;
  if (list.length === 1) return list[0];

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) return target.slice(0, offset);

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
function _mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
function _unmask(buffer, mask) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
function toArrayBuffer$1(buf) {
  if (buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
function toBuffer$2(data) {
  toBuffer$2.readOnly = true;

  if (Buffer.isBuffer(data)) return data;

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = Buffer.from(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  } else {
    buf = Buffer.from(data);
    toBuffer$2.readOnly = false;
  }

  return buf;
}

try {
  const bufferUtil = require('bufferutil');

  bufferUtil$1.exports = {
    concat: concat$1,
    mask(source, mask, output, offset, length) {
      if (length < 48) _mask(source, mask, output, offset, length);
      else bufferUtil.mask(source, mask, output, offset, length);
    },
    toArrayBuffer: toArrayBuffer$1,
    toBuffer: toBuffer$2,
    unmask(buffer, mask) {
      if (buffer.length < 32) _unmask(buffer, mask);
      else bufferUtil.unmask(buffer, mask);
    }
  };
} catch (e) /* istanbul ignore next */ {
  bufferUtil$1.exports = {
    concat: concat$1,
    mask: _mask,
    toArrayBuffer: toArrayBuffer$1,
    toBuffer: toBuffer$2,
    unmask: _unmask
  };
}

const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
 * A very simple job queue with adjustable concurrency. Adapted from
 * https://github.com/STRML/async-limiter
 */
class Limiter$1 {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
   *     to run concurrently
   */
  constructor(concurrency) {
    this[kDone] = () => {
      this.pending--;
      this[kRun]();
    };
    this.concurrency = concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
  }

  /**
   * Adds a job to the queue.
   *
   * @param {Function} job The job to run
   * @public
   */
  add(job) {
    this.jobs.push(job);
    this[kRun]();
  }

  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [kRun]() {
    if (this.pending === this.concurrency) return;

    if (this.jobs.length) {
      const job = this.jobs.shift();

      this.pending++;
      job(this[kDone]);
    }
  }
}

var limiter = Limiter$1;

const zlib = require$$0;

const bufferUtil = bufferUtil$1.exports;
const Limiter = limiter;
const { kStatusCode: kStatusCode$2 } = constants;

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError$1 = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate$4 {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} [options] Configuration options
   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
   *     for, or request, a custom client window size
   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
   *     acknowledge disabling of client context takeover
   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
   *     calls to zlib
   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
   *     use of a custom server window size
   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
   *     disabling of server context takeover
   * @param {Number} [options.threshold=1024] Size (in bytes) below which
   *     messages should not be compressed if context takeover is disabled
   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
   *     deflate
   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
   *     inflate
   * @param {Boolean} [isServer=false] Create the instance in either server or
   *     client mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold =
      this._options.threshold !== undefined ? this._options.threshold : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency =
        this._options.concurrencyLimit !== undefined
          ? this._options.concurrencyLimit
          : 10;
      zlibLimiter = new Limiter(concurrency);
    }
  }

  /**
   * @type {String}
   */
  static get extensionName() {
    return 'permessage-deflate';
  }

  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(configurations) {
    configurations = this.normalizeParams(configurations);

    this.params = this._isServer
      ? this.acceptAsServer(configurations)
      : this.acceptAsClient(configurations);

    return this.params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate) {
      this._inflate.close();
      this._inflate = null;
    }

    if (this._deflate) {
      const callback = this._deflate[kCallback];

      this._deflate.close();
      this._deflate = null;

      if (callback) {
        callback(
          new Error(
            'The deflate stream was closed while data was being processed'
          )
        );
      }
    }
  }

  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(offers) {
    const opts = this._options;
    const accepted = offers.find((params) => {
      if (
        (opts.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (params.server_max_window_bits &&
          (opts.serverMaxWindowBits === false ||
            (typeof opts.serverMaxWindowBits === 'number' &&
              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
        (typeof opts.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return false;
      }

      return true;
    });

    if (!accepted) {
      throw new Error('None of the extension offers can be accepted');
    }

    if (opts.serverNoContextTakeover) {
      accepted.server_no_context_takeover = true;
    }
    if (opts.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof opts.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = opts.serverMaxWindowBits;
    }
    if (typeof opts.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = opts.clientMaxWindowBits;
    } else if (
      accepted.client_max_window_bits === true ||
      opts.clientMaxWindowBits === false
    ) {
      delete accepted.client_max_window_bits;
    }

    return accepted;
  }

  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(response) {
    const params = response[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    }

    if (!params.client_max_window_bits) {
      if (typeof this._options.clientMaxWindowBits === 'number') {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      }
    } else if (
      this._options.clientMaxWindowBits === false ||
      (typeof this._options.clientMaxWindowBits === 'number' &&
        params.client_max_window_bits > this._options.clientMaxWindowBits)
    ) {
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    }

    return params;
  }

  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(configurations) {
    configurations.forEach((params) => {
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (value.length > 1) {
          throw new Error(`Parameter "${key}" must have only a single value`);
        }

        value = value[0];

        if (key === 'client_max_window_bits') {
          if (value !== true) {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (!this._isServer) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else if (key === 'server_max_window_bits') {
          const num = +value;
          if (!Number.isInteger(num) || num < 8 || num > 15) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
          value = num;
        } else if (
          key === 'client_no_context_takeover' ||
          key === 'server_no_context_takeover'
        ) {
          if (value !== true) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else {
          throw new Error(`Unknown parameter "${key}"`);
        }

        params[key] = value;
      });
    });

    return configurations;
  }

  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._inflate = zlib.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits
      });
      this._inflate[kPerMessageDeflate] = this;
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError$1];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (this._inflate._readableState.endEmitted) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];

        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
          this._inflate.reset();
        }
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(data, fin, callback) {
    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kCallback] = callback;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      if (!this._deflate) {
        //
        // The deflate stream was closed while data was being processed.
        //
        return;
      }

      let data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      //
      // Ensure that the callback will not be called again in
      // `PerMessageDeflate#cleanup()`.
      //
      this._deflate[kCallback] = null;

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._deflate.reset();
      }

      callback(null, data);
    });
  }
}

var permessageDeflate = PerMessageDeflate$4;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kPerMessageDeflate]._maxPayload < 1 ||
    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError$1] = new RangeError('Max payload size exceeded');
  this[kError$1].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
  this[kError$1][kStatusCode$2] = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError(err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kPerMessageDeflate]._inflate = null;
  err[kStatusCode$2] = 1007;
  this[kCallback](err);
}

var validation = {exports: {}};

//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars$2 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
function isValidStatusCode$2(code) {
  return (
    (code >= 1000 &&
      code <= 1014 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
}

/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
function _isValidUTF8(buf) {
  const len = buf.length;
  let i = 0;

  while (i < len) {
    if ((buf[i] & 0x80) === 0) {
      // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {
      // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0 // Overlong
      ) {
        return false;
      }

      i += 2;
    } else if ((buf[i] & 0xf0) === 0xe0) {
      // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      }

      i += 3;
    } else if ((buf[i] & 0xf8) === 0xf0) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
        buf[i] > 0xf4 // > U+10FFFF
      ) {
        return false;
      }

      i += 4;
    } else {
      return false;
    }
  }

  return true;
}

try {
  const isValidUTF8 = require('utf-8-validate');

  validation.exports = {
    isValidStatusCode: isValidStatusCode$2,
    isValidUTF8(buf) {
      return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
    },
    tokenChars: tokenChars$2
  };
} catch (e) /* istanbul ignore next */ {
  validation.exports = {
    isValidStatusCode: isValidStatusCode$2,
    isValidUTF8: _isValidUTF8,
    tokenChars: tokenChars$2
  };
}

const { Writable } = require$$0$1;

const PerMessageDeflate$3 = permessageDeflate;
const {
  BINARY_TYPES: BINARY_TYPES$1,
  EMPTY_BUFFER: EMPTY_BUFFER$2,
  kStatusCode: kStatusCode$1,
  kWebSocket: kWebSocket$2
} = constants;
const { concat, toArrayBuffer, unmask } = bufferUtil$1.exports;
const { isValidStatusCode: isValidStatusCode$1, isValidUTF8 } = validation.exports;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 *
 * @extends Writable
 */
class Receiver$1 extends Writable {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} [options] Options object
   * @param {String} [options.binaryType=nodebuffer] The type for binary data
   * @param {Object} [options.extensions] An object containing the negotiated
   *     extensions
   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
   *     client or server mode
   * @param {Number} [options.maxPayload=0] The maximum allowed message length
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   */
  constructor(options = {}) {
    super();

    this._binaryType = options.binaryType || BINARY_TYPES$1[0];
    this._extensions = options.extensions || {};
    this._isServer = !!options.isServer;
    this._maxPayload = options.maxPayload | 0;
    this._skipUTF8Validation = !!options.skipUTF8Validation;
    this[kWebSocket$2] = undefined;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._mask = undefined;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._state = GET_INFO;
    this._loop = false;
  }

  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   * @private
   */
  _write(chunk, encoding, cb) {
    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

    this._bufferedBytes += chunk.length;
    this._buffers.push(chunk);
    this.startLoop(cb);
  }

  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(n) {
    this._bufferedBytes -= n;

    if (n === this._buffers[0].length) return this._buffers.shift();

    if (n < this._buffers[0].length) {
      const buf = this._buffers[0];
      this._buffers[0] = buf.slice(n);
      return buf.slice(0, n);
    }

    const dst = Buffer.allocUnsafe(n);

    do {
      const buf = this._buffers[0];
      const offset = dst.length - n;

      if (n >= buf.length) {
        dst.set(this._buffers.shift(), offset);
      } else {
        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
        this._buffers[0] = buf.slice(n);
      }

      n -= buf.length;
    } while (n > 0);

    return dst;
  }

  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(cb) {
    let err;
    this._loop = true;

    do {
      switch (this._state) {
        case GET_INFO:
          err = this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          err = this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          err = this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          err = this.getData(cb);
          break;
        default:
          // `INFLATING`
          this._loop = false;
          return;
      }
    } while (this._loop);

    cb(err);
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getInfo() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    const buf = this.consume(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this._loop = false;
      return error(
        RangeError,
        'RSV2 and RSV3 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_2_3'
      );
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate$3.extensionName]) {
      this._loop = false;
      return error(
        RangeError,
        'RSV1 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_1'
      );
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this._loop = false;
        return error(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );
      }

      if (!this._fragmented) {
        this._loop = false;
        return error(
          RangeError,
          'invalid opcode 0',
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );
      }

      this._opcode = this._fragmented;
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this._loop = false;
        return error(
          RangeError,
          `invalid opcode ${this._opcode}`,
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this._loop = false;
        return error(
          RangeError,
          'FIN must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_FIN'
        );
      }

      if (compressed) {
        this._loop = false;
        return error(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );
      }

      if (this._payloadLength > 0x7d) {
        this._loop = false;
        return error(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          true,
          1002,
          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
        );
      }
    } else {
      this._loop = false;
      return error(
        RangeError,
        `invalid opcode ${this._opcode}`,
        true,
        1002,
        'WS_ERR_INVALID_OPCODE'
      );
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._isServer) {
      if (!this._masked) {
        this._loop = false;
        return error(
          RangeError,
          'MASK must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_MASK'
        );
      }
    } else if (this._masked) {
      this._loop = false;
      return error(
        RangeError,
        'MASK must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_MASK'
      );
    }

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else return this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength16() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    this._payloadLength = this.consume(2).readUInt16BE(0);
    return this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength64() {
    if (this._bufferedBytes < 8) {
      this._loop = false;
      return;
    }

    const buf = this.consume(8);
    const num = buf.readUInt32BE(0);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this._loop = false;
      return error(
        RangeError,
        'Unsupported WebSocket frame: payload length > 2^53 - 1',
        false,
        1009,
        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
      );
    }

    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
    return this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  haveLength() {
    if (this._payloadLength && this._opcode < 0x08) {
      this._totalPayloadLength += this._payloadLength;
      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
        this._loop = false;
        return error(
          RangeError,
          'Max payload size exceeded',
          false,
          1009,
          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
        );
      }
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = false;
      return;
    }

    this._mask = this.consume(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  getData(cb) {
    let data = EMPTY_BUFFER$2;

    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = false;
        return;
      }

      data = this.consume(this._payloadLength);

      if (
        this._masked &&
        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
      ) {
        unmask(data, this._mask);
      }
    }

    if (this._opcode > 0x07) return this.controlMessage(data);

    if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data, cb);
      return;
    }

    if (data.length) {
      //
      // This message is not compressed so its length is the sum of the payload
      // length of all fragments.
      //
      this._messageLength = this._totalPayloadLength;
      this._fragments.push(data);
    }

    return this.dataMessage();
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(data, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate$3.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) return cb(err);

      if (buf.length) {
        this._messageLength += buf.length;
        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
          return cb(
            error(
              RangeError,
              'Max payload size exceeded',
              false,
              1009,
              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
            )
          );
        }

        this._fragments.push(buf);
      }

      const er = this.dataMessage();
      if (er) return cb(er);

      this.startLoop(cb);
    });
  }

  /**
   * Handles a data message.
   *
   * @return {(Error|undefined)} A possible error
   * @private
   */
  dataMessage() {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        let data;

        if (this._binaryType === 'nodebuffer') {
          data = concat(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(concat(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.emit('message', data, true);
      } else {
        const buf = concat(fragments, messageLength);

        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
          this._loop = false;
          return error(
            Error,
            'invalid UTF-8 sequence',
            true,
            1007,
            'WS_ERR_INVALID_UTF8'
          );
        }

        this.emit('message', buf, false);
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(data) {
    if (this._opcode === 0x08) {
      this._loop = false;

      if (data.length === 0) {
        this.emit('conclude', 1005, EMPTY_BUFFER$2);
        this.end();
      } else if (data.length === 1) {
        return error(
          RangeError,
          'invalid payload length 1',
          true,
          1002,
          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
        );
      } else {
        const code = data.readUInt16BE(0);

        if (!isValidStatusCode$1(code)) {
          return error(
            RangeError,
            `invalid status code ${code}`,
            true,
            1002,
            'WS_ERR_INVALID_CLOSE_CODE'
          );
        }

        const buf = data.slice(2);

        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
          return error(
            Error,
            'invalid UTF-8 sequence',
            true,
            1007,
            'WS_ERR_INVALID_UTF8'
          );
        }

        this.emit('conclude', code, buf);
        this.end();
      }
    } else if (this._opcode === 0x09) {
      this.emit('ping', data);
    } else {
      this.emit('pong', data);
    }

    this._state = GET_INFO;
  }
}

var receiver = Receiver$1;

/**
 * Builds an error object.
 *
 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
 * @param {String} message The error message
 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
 *     `message`
 * @param {Number} statusCode The status code
 * @param {String} errorCode The exposed error code
 * @return {(Error|RangeError)} The error
 * @private
 */
function error(ErrorCtor, message, prefix, statusCode, errorCode) {
  const err = new ErrorCtor(
    prefix ? `Invalid WebSocket frame: ${message}` : message
  );

  Error.captureStackTrace(err, error);
  err.code = errorCode;
  err[kStatusCode$1] = statusCode;
  return err;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls$" }] */
const { randomFillSync } = require$$5;

const PerMessageDeflate$2 = permessageDeflate;
const { EMPTY_BUFFER: EMPTY_BUFFER$1 } = constants;
const { isValidStatusCode } = validation.exports;
const { mask: applyMask, toBuffer: toBuffer$1 } = bufferUtil$1.exports;

const kByteLength = Symbol('kByteLength');
const maskBuffer = Buffer.alloc(4);

/**
 * HyBi Sender implementation.
 */
class Sender$1 {
  /**
   * Creates a Sender instance.
   *
   * @param {(net.Socket|tls.Socket)} socket The connection socket
   * @param {Object} [extensions] An object containing the negotiated extensions
   * @param {Function} [generateMask] The function used to generate the masking
   *     key
   */
  constructor(socket, extensions, generateMask) {
    this._extensions = extensions || {};

    if (generateMask) {
      this._generateMask = generateMask;
      this._maskBuffer = Buffer.alloc(4);
    }

    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {(Buffer|String)} data The data to frame
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @return {(Buffer|String)[]} The framed data
   * @public
   */
  static frame(data, options) {
    let mask;
    let merge = false;
    let offset = 2;
    let skipMasking = false;

    if (options.mask) {
      mask = options.maskBuffer || maskBuffer;

      if (options.generateMask) {
        options.generateMask(mask);
      } else {
        randomFillSync(mask, 0, 4);
      }

      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
      offset = 6;
    }

    let dataLength;

    if (typeof data === 'string') {
      if (
        (!options.mask || skipMasking) &&
        options[kByteLength] !== undefined
      ) {
        dataLength = options[kByteLength];
      } else {
        data = Buffer.from(data);
        dataLength = data.length;
      }
    } else {
      dataLength = data.length;
      merge = options.mask && options.readOnly && !skipMasking;
    }

    let payloadLength = dataLength;

    if (dataLength >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (dataLength > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    target[1] = payloadLength;

    if (payloadLength === 126) {
      target.writeUInt16BE(dataLength, 2);
    } else if (payloadLength === 127) {
      target[2] = target[3] = 0;
      target.writeUIntBE(dataLength, 4, 6);
    }

    if (!options.mask) return [target, data];

    target[1] |= 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (skipMasking) return [target, data];

    if (merge) {
      applyMask(data, mask, target, offset, dataLength);
      return [target];
    }

    applyMask(data, mask, data, 0, dataLength);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {Number} [code] The status code component of the body
   * @param {(String|Buffer)} [data] The message component of the body
   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
   * @param {Function} [cb] Callback
   * @public
   */
  close(code, data, mask, cb) {
    let buf;

    if (code === undefined) {
      buf = EMPTY_BUFFER$1;
    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
      throw new TypeError('First argument must be a valid error code number');
    } else if (data === undefined || !data.length) {
      buf = Buffer.allocUnsafe(2);
      buf.writeUInt16BE(code, 0);
    } else {
      const length = Buffer.byteLength(data);

      if (length > 123) {
        throw new RangeError('The message must not be greater than 123 bytes');
      }

      buf = Buffer.allocUnsafe(2 + length);
      buf.writeUInt16BE(code, 0);

      if (typeof data === 'string') {
        buf.write(data, 2);
      } else {
        buf.set(data, 2);
      }
    }

    const options = {
      [kByteLength]: buf.length,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x08,
      readOnly: false,
      rsv1: false
    };

    if (this._deflating) {
      this.enqueue([this.dispatch, buf, false, options, cb]);
    } else {
      this.sendFrame(Sender$1.frame(buf, options), cb);
    }
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  ping(data, mask, cb) {
    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else {
      data = toBuffer$1(data);
      byteLength = data.length;
      readOnly = toBuffer$1.readOnly;
    }

    if (byteLength > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    const options = {
      [kByteLength]: byteLength,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x09,
      readOnly,
      rsv1: false
    };

    if (this._deflating) {
      this.enqueue([this.dispatch, data, false, options, cb]);
    } else {
      this.sendFrame(Sender$1.frame(data, options), cb);
    }
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  pong(data, mask, cb) {
    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else {
      data = toBuffer$1(data);
      byteLength = data.length;
      readOnly = toBuffer$1.readOnly;
    }

    if (byteLength > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    const options = {
      [kByteLength]: byteLength,
      fin: true,
      generateMask: this._generateMask,
      mask,
      maskBuffer: this._maskBuffer,
      opcode: 0x0a,
      readOnly,
      rsv1: false
    };

    if (this._deflating) {
      this.enqueue([this.dispatch, data, false, options, cb]);
    } else {
      this.sendFrame(Sender$1.frame(data, options), cb);
    }
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
   *     or text
   * @param {Boolean} [options.compress=false] Specifies whether or not to
   *     compress `data`
   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Function} [cb] Callback
   * @public
   */
  send(data, options, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];
    let opcode = options.binary ? 2 : 1;
    let rsv1 = options.compress;

    let byteLength;
    let readOnly;

    if (typeof data === 'string') {
      byteLength = Buffer.byteLength(data);
      readOnly = false;
    } else {
      data = toBuffer$1(data);
      byteLength = data.length;
      readOnly = toBuffer$1.readOnly;
    }

    if (this._firstFragment) {
      this._firstFragment = false;
      if (
        rsv1 &&
        perMessageDeflate &&
        perMessageDeflate.params[
          perMessageDeflate._isServer
            ? 'server_no_context_takeover'
            : 'client_no_context_takeover'
        ]
      ) {
        rsv1 = byteLength >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        [kByteLength]: byteLength,
        fin: options.fin,
        generateMask: this._generateMask,
        mask: options.mask,
        maskBuffer: this._maskBuffer,
        opcode,
        readOnly,
        rsv1
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(
        Sender$1.frame(data, {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1: false
        }),
        cb
      );
    }
  }

  /**
   * Dispatches a message.
   *
   * @param {(Buffer|String)} data The message to send
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     `data`
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  dispatch(data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender$1.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate$2.extensionName];

    this._bufferedBytes += options[kByteLength];
    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      if (this._socket.destroyed) {
        const err = new Error(
          'The socket was closed while data was being compressed'
        );

        if (typeof cb === 'function') cb(err);

        for (let i = 0; i < this._queue.length; i++) {
          const params = this._queue[i];
          const callback = params[params.length - 1];

          if (typeof callback === 'function') callback(err);
        }

        return;
      }

      this._bufferedBytes -= options[kByteLength];
      this._deflating = false;
      options.readOnly = false;
      this.sendFrame(Sender$1.frame(buf, options), cb);
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[3][kByteLength];
      Reflect.apply(params[0], this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(params) {
    this._bufferedBytes += params[3][kByteLength];
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} [cb] Callback
   * @private
   */
  sendFrame(list, cb) {
    if (list.length === 2) {
      this._socket.cork();
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
      this._socket.uncork();
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

var sender = Sender$1;

const { kForOnEventAttribute: kForOnEventAttribute$1, kListener: kListener$1 } = constants;

const kCode = Symbol('kCode');
const kData = Symbol('kData');
const kError = Symbol('kError');
const kMessage = Symbol('kMessage');
const kReason = Symbol('kReason');
const kTarget = Symbol('kTarget');
const kType = Symbol('kType');
const kWasClean = Symbol('kWasClean');

/**
 * Class representing an event.
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @throws {TypeError} If the `type` argument is not specified
   */
  constructor(type) {
    this[kTarget] = null;
    this[kType] = type;
  }

  /**
   * @type {*}
   */
  get target() {
    return this[kTarget];
  }

  /**
   * @type {String}
   */
  get type() {
    return this[kType];
  }
}

Object.defineProperty(Event.prototype, 'target', { enumerable: true });
Object.defineProperty(Event.prototype, 'type', { enumerable: true });

/**
 * Class representing a close event.
 *
 * @extends Event
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {Number} [options.code=0] The status code explaining why the
   *     connection was closed
   * @param {String} [options.reason=''] A human-readable string explaining why
   *     the connection was closed
   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
   *     connection was cleanly closed
   */
  constructor(type, options = {}) {
    super(type);

    this[kCode] = options.code === undefined ? 0 : options.code;
    this[kReason] = options.reason === undefined ? '' : options.reason;
    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
  }

  /**
   * @type {Number}
   */
  get code() {
    return this[kCode];
  }

  /**
   * @type {String}
   */
  get reason() {
    return this[kReason];
  }

  /**
   * @type {Boolean}
   */
  get wasClean() {
    return this[kWasClean];
  }
}

Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

/**
 * Class representing an error event.
 *
 * @extends Event
 */
class ErrorEvent extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.error=null] The error that generated this event
   * @param {String} [options.message=''] The error message
   */
  constructor(type, options = {}) {
    super(type);

    this[kError] = options.error === undefined ? null : options.error;
    this[kMessage] = options.message === undefined ? '' : options.message;
  }

  /**
   * @type {*}
   */
  get error() {
    return this[kError];
  }

  /**
   * @type {String}
   */
  get message() {
    return this[kMessage];
  }
}

Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

/**
 * Class representing a message event.
 *
 * @extends Event
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.data=null] The message content
   */
  constructor(type, options = {}) {
    super(type);

    this[kData] = options.data === undefined ? null : options.data;
  }

  /**
   * @type {*}
   */
  get data() {
    return this[kData];
  }
}

Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} type A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @param {Object} [options] An options object specifies characteristics about
   *     the event listener
   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
   *     listener should be invoked at most once after being added. If `true`,
   *     the listener would be automatically removed when invoked.
   * @public
   */
  addEventListener(type, listener, options = {}) {
    let wrapper;

    if (type === 'message') {
      wrapper = function onMessage(data, isBinary) {
        const event = new MessageEvent('message', {
          data: isBinary ? data : data.toString()
        });

        event[kTarget] = this;
        listener.call(this, event);
      };
    } else if (type === 'close') {
      wrapper = function onClose(code, message) {
        const event = new CloseEvent('close', {
          code,
          reason: message.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });

        event[kTarget] = this;
        listener.call(this, event);
      };
    } else if (type === 'error') {
      wrapper = function onError(error) {
        const event = new ErrorEvent('error', {
          error,
          message: error.message
        });

        event[kTarget] = this;
        listener.call(this, event);
      };
    } else if (type === 'open') {
      wrapper = function onOpen() {
        const event = new Event('open');

        event[kTarget] = this;
        listener.call(this, event);
      };
    } else {
      return;
    }

    wrapper[kForOnEventAttribute$1] = !!options[kForOnEventAttribute$1];
    wrapper[kListener$1] = listener;

    if (options.once) {
      this.once(type, wrapper);
    } else {
      this.on(type, wrapper);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} type A string representing the event type to remove
   * @param {Function} handler The listener to remove
   * @public
   */
  removeEventListener(type, handler) {
    for (const listener of this.listeners(type)) {
      if (listener[kListener$1] === handler && !listener[kForOnEventAttribute$1]) {
        this.removeListener(type, listener);
        break;
      }
    }
  }
};

var eventTarget = {
  CloseEvent,
  ErrorEvent,
  Event,
  EventTarget,
  MessageEvent
};

const { tokenChars: tokenChars$1 } = validation.exports;

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push(dest, name, elem) {
  if (dest[name] === undefined) dest[name] = [elem];
  else dest[name].push(elem);
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse$2(header) {
  const offers = Object.create(null);
  let params = Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let code = -1;
  let end = -1;
  let i = 0;

  for (; i < header.length; i++) {
    code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1) start = i;
      } else if (
        i !== 0 &&
        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
      ) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = Object.create(null);
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars$1[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars$1[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22 /* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c /* '\' */) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars$1[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
    throw new SyntaxError('Unexpected end of input');
  }

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, params);
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Builds the `Sec-WebSocket-Extensions` header field value.
 *
 * @param {Object} extensions The map of extensions and parameters to format
 * @return {String} A string representing the given object
 * @public
 */
function format$1(extensions) {
  return Object.keys(extensions)
    .map((extension) => {
      let configurations = extensions[extension];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations
        .map((params) => {
          return [extension]
            .concat(
              Object.keys(params).map((k) => {
                let values = params[k];
                if (!Array.isArray(values)) values = [values];
                return values
                  .map((v) => (v === true ? k : `${k}=${v}`))
                  .join('; ');
              })
            )
            .join('; ');
        })
        .join(', ');
    })
    .join(', ');
}

var extension$1 = { format: format$1, parse: parse$2 };

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Readable$" }] */

const EventEmitter$1 = require$$2;
const https = require$$1;
const http$1 = require$$2$1;
const net = require$$3;
const tls = require$$4;
const { randomBytes, createHash: createHash$1 } = require$$5;
const { URL: URL$1 } = url;

const PerMessageDeflate$1 = permessageDeflate;
const Receiver = receiver;
const Sender = sender;
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  GUID: GUID$1,
  kForOnEventAttribute,
  kListener,
  kStatusCode,
  kWebSocket: kWebSocket$1,
  NOOP
} = constants;
const {
  EventTarget: { addEventListener, removeEventListener }
} = eventTarget;
const { format, parse: parse$1 } = extension$1;
const { toBuffer } = bufferUtil$1.exports;

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000;

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket$1 extends EventEmitter$1 {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|URL)} address The URL to which to connect
   * @param {(String|String[])} [protocols] The subprotocols
   * @param {Object} [options] Connection options
   */
  constructor(address, protocols, options) {
    super();

    this._binaryType = BINARY_TYPES[0];
    this._closeCode = 1006;
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = EMPTY_BUFFER;
    this._closeTimer = null;
    this._extensions = {};
    this._paused = false;
    this._protocol = '';
    this._readyState = WebSocket$1.CONNECTING;
    this._receiver = null;
    this._sender = null;
    this._socket = null;

    if (address !== null) {
      this._bufferedAmount = 0;
      this._isServer = false;
      this._redirects = 0;

      if (protocols === undefined) {
        protocols = [];
      } else if (!Array.isArray(protocols)) {
        if (typeof protocols === 'object' && protocols !== null) {
          options = protocols;
          protocols = [];
        } else {
          protocols = [protocols];
        }
      }

      initAsClient(this, address, protocols, options);
    } else {
      this._isServer = true;
    }
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the
   * required default "blob" type (instead we define a custom "nodebuffer"
   * type).
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }

  set binaryType(type) {
    if (!BINARY_TYPES.includes(type)) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * @type {Number}
   */
  get bufferedAmount() {
    if (!this._socket) return this._bufferedAmount;

    return this._socket._writableState.length + this._sender._bufferedBytes;
  }

  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }

  /**
   * @type {Boolean}
   */
  get isPaused() {
    return this._paused;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onclose() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onerror() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onopen() {
    return null;
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onmessage() {
    return null;
  }

  /**
   * @type {String}
   */
  get protocol() {
    return this._protocol;
  }

  /**
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }

  /**
   * @type {String}
   */
  get url() {
    return this._url;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Object} options Options object
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Number} [options.maxPayload=0] The maximum allowed message size
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @private
   */
  setSocket(socket, head, options) {
    const receiver = new Receiver({
      binaryType: this.binaryType,
      extensions: this._extensions,
      isServer: this._isServer,
      maxPayload: options.maxPayload,
      skipUTF8Validation: options.skipUTF8Validation
    });

    this._sender = new Sender(socket, this._extensions, options.generateMask);
    this._receiver = receiver;
    this._socket = socket;

    receiver[kWebSocket$1] = this;
    socket[kWebSocket$1] = this;

    receiver.on('conclude', receiverOnConclude);
    receiver.on('drain', receiverOnDrain);
    receiver.on('error', receiverOnError);
    receiver.on('message', receiverOnMessage);
    receiver.on('ping', receiverOnPing);
    receiver.on('pong', receiverOnPong);

    socket.setTimeout(0);
    socket.setNoDelay();

    if (head.length > 0) socket.unshift(head);

    socket.on('close', socketOnClose);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('error', socketOnError$1);

    this._readyState = WebSocket$1.OPEN;
    this.emit('open');
  }

  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    if (!this._socket) {
      this._readyState = WebSocket$1.CLOSED;
      this.emit('close', this._closeCode, this._closeMessage);
      return;
    }

    if (this._extensions[PerMessageDeflate$1.extensionName]) {
      this._extensions[PerMessageDeflate$1.extensionName].cleanup();
    }

    this._receiver.removeAllListeners();
    this._readyState = WebSocket$1.CLOSED;
    this.emit('close', this._closeCode, this._closeMessage);
  }

  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} [code] Status code explaining why the connection is closing
   * @param {(String|Buffer)} [data] The reason why the connection is
   *     closing
   * @public
   */
  close(code, data) {
    if (this.readyState === WebSocket$1.CLOSED) return;
    if (this.readyState === WebSocket$1.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake$1(this, this._req, msg);
    }

    if (this.readyState === WebSocket$1.CLOSING) {
      if (
        this._closeFrameSent &&
        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
      ) {
        this._socket.end();
      }

      return;
    }

    this._readyState = WebSocket$1.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;

      if (
        this._closeFrameReceived ||
        this._receiver._writableState.errorEmitted
      ) {
        this._socket.end();
      }
    });

    //
    // Specify a timeout for the closing handshake to complete.
    //
    this._closeTimer = setTimeout(
      this._socket.destroy.bind(this._socket),
      closeTimeout
    );
  }

  /**
   * Pause the socket.
   *
   * @public
   */
  pause() {
    if (
      this.readyState === WebSocket$1.CONNECTING ||
      this.readyState === WebSocket$1.CLOSED
    ) {
      return;
    }

    this._paused = true;
    this._socket.pause();
  }

  /**
   * Send a ping.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the ping is sent
   * @public
   */
  ping(data, mask, cb) {
    if (this.readyState === WebSocket$1.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket$1.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a pong.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the pong is sent
   * @public
   */
  pong(data, mask, cb) {
    if (this.readyState === WebSocket$1.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket$1.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Resume the socket.
   *
   * @public
   */
  resume() {
    if (
      this.readyState === WebSocket$1.CONNECTING ||
      this.readyState === WebSocket$1.CLOSED
    ) {
      return;
    }

    this._paused = false;
    if (!this._receiver._writableState.needDrain) this._socket.resume();
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} [options] Options object
   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
   *     text
   * @param {Boolean} [options.compress] Specifies whether or not to compress
   *     `data`
   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when data is written out
   * @public
   */
  send(data, options, cb) {
    if (this.readyState === WebSocket$1.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket$1.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    const opts = {
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true,
      ...options
    };

    if (!this._extensions[PerMessageDeflate$1.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState === WebSocket$1.CLOSED) return;
    if (this.readyState === WebSocket$1.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake$1(this, this._req, msg);
    }

    if (this._socket) {
      this._readyState = WebSocket$1.CLOSING;
      this._socket.destroy();
    }
  }
}

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket$1, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket$1.prototype, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket$1, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket$1.prototype, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket$1, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket$1.prototype, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket$1, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket$1.prototype, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

[
  'binaryType',
  'bufferedAmount',
  'extensions',
  'isPaused',
  'protocol',
  'readyState',
  'url'
].forEach((property) => {
  Object.defineProperty(WebSocket$1.prototype, property, { enumerable: true });
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket$1.prototype, `on${method}`, {
    enumerable: true,
    get() {
      for (const listener of this.listeners(method)) {
        if (listener[kForOnEventAttribute]) return listener[kListener];
      }

      return null;
    },
    set(handler) {
      for (const listener of this.listeners(method)) {
        if (listener[kForOnEventAttribute]) {
          this.removeListener(method, listener);
          break;
        }
      }

      if (typeof handler !== 'function') return;

      this.addEventListener(method, handler, {
        [kForOnEventAttribute]: true
      });
    }
  });
});

WebSocket$1.prototype.addEventListener = addEventListener;
WebSocket$1.prototype.removeEventListener = removeEventListener;

var websocket = WebSocket$1;

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|URL)} address The URL to which to connect
 * @param {Array} protocols The subprotocols
 * @param {Object} [options] Connection options
 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
 *     redirects
 * @param {Function} [options.generateMask] The function used to generate the
 *     masking key
 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
 *     handshake request
 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
 *     size
 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
 *     allowed
 * @param {String} [options.origin] Value of the `Origin` or
 *     `Sec-WebSocket-Origin` header
 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
 *     permessage-deflate
 * @param {Number} [options.protocolVersion=13] Value of the
 *     `Sec-WebSocket-Version` header
 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
 *     not to skip UTF-8 validation for text and close messages
 * @private
 */
function initAsClient(websocket, address, protocols, options) {
  const opts = {
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    skipUTF8Validation: false,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    createConnection: undefined,
    socketPath: undefined,
    hostname: undefined,
    protocol: undefined,
    timeout: undefined,
    method: undefined,
    host: undefined,
    path: undefined,
    port: undefined
  };

  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} ` +
        `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  let parsedUrl;

  if (address instanceof URL$1) {
    parsedUrl = address;
    websocket._url = address.href;
  } else {
    try {
      parsedUrl = new URL$1(address);
    } catch (e) {
      throw new SyntaxError(`Invalid URL: ${address}`);
    }

    websocket._url = address;
  }

  const isSecure = parsedUrl.protocol === 'wss:';
  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';
  let invalidURLMessage;

  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isUnixSocket) {
    invalidURLMessage =
      'The URL\'s protocol must be one of "ws:", "wss:", or "ws+unix:"';
  } else if (isUnixSocket && !parsedUrl.pathname) {
    invalidURLMessage = "The URL's pathname is empty";
  } else if (parsedUrl.hash) {
    invalidURLMessage = 'The URL contains a fragment identifier';
  }

  if (invalidURLMessage) {
    const err = new SyntaxError(invalidURLMessage);

    if (websocket._redirects === 0) {
      throw err;
    } else {
      emitErrorAndClose(websocket, err);
      return;
    }
  }

  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString('base64');
  const get = isSecure ? https.get : http$1.get;
  const protocolSet = new Set();
  let perMessageDeflate;

  opts.createConnection = isSecure ? tlsConnect : netConnect;
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith('[')
    ? parsedUrl.hostname.slice(1, -1)
    : parsedUrl.hostname;
  opts.headers = {
    'Sec-WebSocket-Version': opts.protocolVersion,
    'Sec-WebSocket-Key': key,
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    ...opts.headers
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;

  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate$1(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers['Sec-WebSocket-Extensions'] = format({
      [PerMessageDeflate$1.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols.length) {
    for (const protocol of protocols) {
      if (
        typeof protocol !== 'string' ||
        !subprotocolRegex.test(protocol) ||
        protocolSet.has(protocol)
      ) {
        throw new SyntaxError(
          'An invalid or duplicated subprotocol was specified'
        );
      }

      protocolSet.add(protocol);
    }

    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }

  if (isUnixSocket) {
    const parts = opts.path.split(':');

    opts.socketPath = parts[0];
    opts.path = parts[1];
  }

  if (opts.followRedirects) {
    if (websocket._redirects === 0) {
      websocket._originalHost = parsedUrl.host;

      const headers = options && options.headers;

      //
      // Shallow copy the user provided options so that headers can be changed
      // without mutating the original object.
      //
      options = { ...options, headers: {} };

      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          options.headers[key.toLowerCase()] = value;
        }
      }
    } else if (parsedUrl.host !== websocket._originalHost) {
      //
      // Match curl 7.77.0 behavior and drop the following headers. These
      // headers are also dropped when following a redirect to a subdomain.
      //
      delete opts.headers.authorization;
      delete opts.headers.cookie;
      delete opts.headers.host;
      opts.auth = undefined;
    }

    //
    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
    // If the `Authorization` header is set, then there is nothing to do as it
    // will take precedence.
    //
    if (opts.auth && !options.headers.authorization) {
      options.headers.authorization =
        'Basic ' + Buffer.from(opts.auth).toString('base64');
    }
  }

  let req = (websocket._req = get(opts));

  if (opts.timeout) {
    req.on('timeout', () => {
      abortHandshake$1(websocket, req, 'Opening handshake has timed out');
    });
  }

  req.on('error', (err) => {
    if (req === null || req.aborted) return;

    req = websocket._req = null;
    emitErrorAndClose(websocket, err);
  });

  req.on('response', (res) => {
    const location = res.headers.location;
    const statusCode = res.statusCode;

    if (
      location &&
      opts.followRedirects &&
      statusCode >= 300 &&
      statusCode < 400
    ) {
      if (++websocket._redirects > opts.maxRedirects) {
        abortHandshake$1(websocket, req, 'Maximum redirects exceeded');
        return;
      }

      req.abort();

      let addr;

      try {
        addr = new URL$1(location, address);
      } catch (e) {
        const err = new SyntaxError(`Invalid URL: ${location}`);
        emitErrorAndClose(websocket, err);
        return;
      }

      initAsClient(websocket, addr, protocols, options);
    } else if (!websocket.emit('unexpected-response', req, res)) {
      abortHandshake$1(
        websocket,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });

  req.on('upgrade', (res, socket, head) => {
    websocket.emit('upgrade', res);

    //
    // The user may have closed the connection from a listener of the `upgrade`
    // event.
    //
    if (websocket.readyState !== WebSocket$1.CONNECTING) return;

    req = websocket._req = null;

    const digest = createHash$1('sha1')
      .update(key + GUID$1)
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      abortHandshake$1(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
      return;
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    let protError;

    if (serverProt !== undefined) {
      if (!protocolSet.size) {
        protError = 'Server sent a subprotocol but none was requested';
      } else if (!protocolSet.has(serverProt)) {
        protError = 'Server sent an invalid subprotocol';
      }
    } else if (protocolSet.size) {
      protError = 'Server sent no subprotocol';
    }

    if (protError) {
      abortHandshake$1(websocket, socket, protError);
      return;
    }

    if (serverProt) websocket._protocol = serverProt;

    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

    if (secWebSocketExtensions !== undefined) {
      if (!perMessageDeflate) {
        const message =
          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
          'was requested';
        abortHandshake$1(websocket, socket, message);
        return;
      }

      let extensions;

      try {
        extensions = parse$1(secWebSocketExtensions);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Extensions header';
        abortHandshake$1(websocket, socket, message);
        return;
      }

      const extensionNames = Object.keys(extensions);

      if (
        extensionNames.length !== 1 ||
        extensionNames[0] !== PerMessageDeflate$1.extensionName
      ) {
        const message = 'Server indicated an extension that was not requested';
        abortHandshake$1(websocket, socket, message);
        return;
      }

      try {
        perMessageDeflate.accept(extensions[PerMessageDeflate$1.extensionName]);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Extensions header';
        abortHandshake$1(websocket, socket, message);
        return;
      }

      websocket._extensions[PerMessageDeflate$1.extensionName] =
        perMessageDeflate;
    }

    websocket.setSocket(socket, head, {
      generateMask: opts.generateMask,
      maxPayload: opts.maxPayload,
      skipUTF8Validation: opts.skipUTF8Validation
    });
  });
}

/**
 * Emit the `'error'` and `'close'` event.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {Error} The error to emit
 * @private
 */
function emitErrorAndClose(websocket, err) {
  websocket._readyState = WebSocket$1.CLOSING;
  websocket.emit('error', err);
  websocket.emitClose();
}

/**
 * Create a `net.Socket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {net.Socket} The newly created socket used to start the connection
 * @private
 */
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}

/**
 * Create a `tls.TLSSocket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {tls.TLSSocket} The newly created socket used to start the connection
 * @private
 */
function tlsConnect(options) {
  options.path = undefined;

  if (!options.servername && options.servername !== '') {
    options.servername = net.isIP(options.host) ? '' : options.host;
  }

  return tls.connect(options);
}

/**
 * Abort the handshake and emit an error.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
 *     abort or the socket to destroy
 * @param {String} message The error message
 * @private
 */
function abortHandshake$1(websocket, stream, message) {
  websocket._readyState = WebSocket$1.CLOSING;

  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake$1);

  if (stream.setHeader) {
    stream.abort();

    if (stream.socket && !stream.socket.destroyed) {
      //
      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
      // called after the request completed. See
      // https://github.com/websockets/ws/issues/1869.
      //
      stream.socket.destroy();
    }

    stream.once('abort', websocket.emitClose.bind(websocket));
    websocket.emit('error', err);
  } else {
    stream.destroy(err);
    stream.once('error', websocket.emit.bind(websocket, 'error'));
    stream.once('close', websocket.emitClose.bind(websocket));
  }
}

/**
 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {*} [data] The data to send
 * @param {Function} [cb] Callback
 * @private
 */
function sendAfterClose(websocket, data, cb) {
  if (data) {
    const length = toBuffer(data).length;

    //
    // The `_bufferedAmount` property is used only when the peer is a client and
    // the opening handshake fails. Under these circumstances, in fact, the
    // `setSocket()` method is not called, so the `_socket` and `_sender`
    // properties are set to `null`.
    //
    if (websocket._socket) websocket._sender._bufferedBytes += length;
    else websocket._bufferedAmount += length;
  }

  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket.readyState} ` +
        `(${readyStates[websocket.readyState]})`
    );
    cb(err);
  }
}

/**
 * The listener of the `Receiver` `'conclude'` event.
 *
 * @param {Number} code The status code
 * @param {Buffer} reason The reason for closing
 * @private
 */
function receiverOnConclude(code, reason) {
  const websocket = this[kWebSocket$1];

  websocket._closeFrameReceived = true;
  websocket._closeMessage = reason;
  websocket._closeCode = code;

  if (websocket._socket[kWebSocket$1] === undefined) return;

  websocket._socket.removeListener('data', socketOnData);
  process.nextTick(resume, websocket._socket);

  if (code === 1005) websocket.close();
  else websocket.close(code, reason);
}

/**
 * The listener of the `Receiver` `'drain'` event.
 *
 * @private
 */
function receiverOnDrain() {
  const websocket = this[kWebSocket$1];

  if (!websocket.isPaused) websocket._socket.resume();
}

/**
 * The listener of the `Receiver` `'error'` event.
 *
 * @param {(RangeError|Error)} err The emitted error
 * @private
 */
function receiverOnError(err) {
  const websocket = this[kWebSocket$1];

  if (websocket._socket[kWebSocket$1] !== undefined) {
    websocket._socket.removeListener('data', socketOnData);

    //
    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
    // https://github.com/websockets/ws/issues/1940.
    //
    process.nextTick(resume, websocket._socket);

    websocket.close(err[kStatusCode]);
  }

  websocket.emit('error', err);
}

/**
 * The listener of the `Receiver` `'finish'` event.
 *
 * @private
 */
function receiverOnFinish() {
  this[kWebSocket$1].emitClose();
}

/**
 * The listener of the `Receiver` `'message'` event.
 *
 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
 * @param {Boolean} isBinary Specifies whether the message is binary or not
 * @private
 */
function receiverOnMessage(data, isBinary) {
  this[kWebSocket$1].emit('message', data, isBinary);
}

/**
 * The listener of the `Receiver` `'ping'` event.
 *
 * @param {Buffer} data The data included in the ping frame
 * @private
 */
function receiverOnPing(data) {
  const websocket = this[kWebSocket$1];

  websocket.pong(data, !websocket._isServer, NOOP);
  websocket.emit('ping', data);
}

/**
 * The listener of the `Receiver` `'pong'` event.
 *
 * @param {Buffer} data The data included in the pong frame
 * @private
 */
function receiverOnPong(data) {
  this[kWebSocket$1].emit('pong', data);
}

/**
 * Resume a readable stream
 *
 * @param {Readable} stream The readable stream
 * @private
 */
function resume(stream) {
  stream.resume();
}

/**
 * The listener of the `net.Socket` `'close'` event.
 *
 * @private
 */
function socketOnClose() {
  const websocket = this[kWebSocket$1];

  this.removeListener('close', socketOnClose);
  this.removeListener('data', socketOnData);
  this.removeListener('end', socketOnEnd);

  websocket._readyState = WebSocket$1.CLOSING;

  let chunk;

  //
  // The close frame might not have been received or the `'end'` event emitted,
  // for example, if the socket was destroyed due to an error. Ensure that the
  // `receiver` stream is closed after writing any remaining buffered data to
  // it. If the readable side of the socket is in flowing mode then there is no
  // buffered data as everything has been already written and `readable.read()`
  // will return `null`. If instead, the socket is paused, any possible buffered
  // data will be read as a single chunk.
  //
  if (
    !this._readableState.endEmitted &&
    !websocket._closeFrameReceived &&
    !websocket._receiver._writableState.errorEmitted &&
    (chunk = websocket._socket.read()) !== null
  ) {
    websocket._receiver.write(chunk);
  }

  websocket._receiver.end();

  this[kWebSocket$1] = undefined;

  clearTimeout(websocket._closeTimer);

  if (
    websocket._receiver._writableState.finished ||
    websocket._receiver._writableState.errorEmitted
  ) {
    websocket.emitClose();
  } else {
    websocket._receiver.on('error', receiverOnFinish);
    websocket._receiver.on('finish', receiverOnFinish);
  }
}

/**
 * The listener of the `net.Socket` `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function socketOnData(chunk) {
  if (!this[kWebSocket$1]._receiver.write(chunk)) {
    this.pause();
  }
}

/**
 * The listener of the `net.Socket` `'end'` event.
 *
 * @private
 */
function socketOnEnd() {
  const websocket = this[kWebSocket$1];

  websocket._readyState = WebSocket$1.CLOSING;
  websocket._receiver.end();
  this.end();
}

/**
 * The listener of the `net.Socket` `'error'` event.
 *
 * @private
 */
function socketOnError$1() {
  const websocket = this[kWebSocket$1];

  this.removeListener('error', socketOnError$1);
  this.on('error', NOOP);

  if (websocket) {
    websocket._readyState = WebSocket$1.CLOSING;
    this.destroy();
  }
}

const { tokenChars } = validation.exports;

/**
 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
 *
 * @param {String} header The field value of the header
 * @return {Set} The subprotocol names
 * @public
 */
function parse(header) {
  const protocols = new Set();
  let start = -1;
  let end = -1;
  let i = 0;

  for (i; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (end === -1 && tokenChars[code] === 1) {
      if (start === -1) start = i;
    } else if (
      i !== 0 &&
      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
    ) {
      if (end === -1 && start !== -1) end = i;
    } else if (code === 0x2c /* ',' */) {
      if (start === -1) {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }

      if (end === -1) end = i;

      const protocol = header.slice(start, end);

      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }

      protocols.add(protocol);
      start = end = -1;
    } else {
      throw new SyntaxError(`Unexpected character at index ${i}`);
    }
  }

  if (start === -1 || end !== -1) {
    throw new SyntaxError('Unexpected end of input');
  }

  const protocol = header.slice(start, i);

  if (protocols.has(protocol)) {
    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
  }

  protocols.add(protocol);
  return protocols;
}

var subprotocol$1 = { parse };

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls|https$" }] */

const EventEmitter = require$$2;
const http = require$$2$1;
const { createHash } = require$$5;

const extension = extension$1;
const PerMessageDeflate = permessageDeflate;
const subprotocol = subprotocol$1;
const WebSocket = websocket;
const { GUID, kWebSocket } = constants;

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

const RUNNING = 0;
const CLOSING = 1;
const CLOSED = 2;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Number} [options.backlog=511] The maximum length of the queue of
   *     pending connections
   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
   *     track clients
   * @param {Function} [options.handleProtocols] A hook to handle protocols
   * @param {String} [options.host] The hostname where to bind the server
   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
   *     size
   * @param {Boolean} [options.noServer=false] Enable no server mode
   * @param {String} [options.path] Accept only connections matching this path
   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
   *     permessage-deflate
   * @param {Number} [options.port] The port where to bind the server
   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
   *     server to use
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @param {Function} [options.verifyClient] A hook to reject connections
   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
   *     class to use. It must be the `WebSocket` class or class that extends it
   * @param {Function} [callback] A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      skipUTF8Validation: false,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      WebSocket,
      ...options
    };

    if (
      (options.port == null && !options.server && !options.noServer) ||
      (options.port != null && (options.server || options.noServer)) ||
      (options.server && options.noServer)
    ) {
      throw new TypeError(
        'One and only one of the "port", "server", or "noServer" options ' +
          'must be specified'
      );
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      const emitConnection = this.emit.bind(this, 'connection');

      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, emitConnection);
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) {
      this.clients = new Set();
      this._shouldEmitClose = false;
    }

    this.options = options;
    this._state = RUNNING;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Stop the server from accepting new connections and emit the `'close'` event
   * when all existing connections are closed.
   *
   * @param {Function} [cb] A one-time listener for the `'close'` event
   * @public
   */
  close(cb) {
    if (this._state === CLOSED) {
      if (cb) {
        this.once('close', () => {
          cb(new Error('The server is not running'));
        });
      }

      process.nextTick(emitClose, this);
      return;
    }

    if (cb) this.once('close', cb);

    if (this._state === CLOSING) return;
    this._state = CLOSING;

    if (this.options.noServer || this.options.server) {
      if (this._server) {
        this._removeListeners();
        this._removeListeners = this._server = null;
      }

      if (this.clients) {
        if (!this.clients.size) {
          process.nextTick(emitClose, this);
        } else {
          this._shouldEmitClose = true;
        }
      } else {
        process.nextTick(emitClose, this);
      }
    } else {
      const server = this._server;

      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // The HTTP/S server was created internally. Close it, and rely on its
      // `'close'` event.
      //
      server.close(() => {
        emitClose(this);
      });
    }
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key =
      req.headers['sec-websocket-key'] !== undefined
        ? req.headers['sec-websocket-key']
        : false;
    const version = +req.headers['sec-websocket-version'];

    if (
      req.method !== 'GET' ||
      req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !key ||
      !keyRegex.test(key) ||
      (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortHandshake(socket, 400);
    }

    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
    let protocols = new Set();

    if (secWebSocketProtocol !== undefined) {
      try {
        protocols = subprotocol.parse(secWebSocketProtocol);
      } catch (err) {
        return abortHandshake(socket, 400);
      }
    }

    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
    const extensions = {};

    if (
      this.options.perMessageDeflate &&
      secWebSocketExtensions !== undefined
    ) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = extension.parse(secWebSocketExtensions);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortHandshake(socket, 400);
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.socket.authorized || req.socket.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(
            extensions,
            key,
            protocols,
            req,
            socket,
            head,
            cb
          );
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {Object} extensions The accepted extensions
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Set} protocols The subprotocols
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @throws {Error} If called more than once with the same socket
   * @private
   */
  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    if (socket[kWebSocket]) {
      throw new Error(
        'server.handleUpgrade() was called more than once with the same ' +
          'socket, possibly due to a misconfiguration'
      );
    }

    if (this._state > RUNNING) return abortHandshake(socket, 503);

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new this.options.WebSocket(null);

    if (protocols.size) {
      //
      // Optionally call external protocol selection handler.
      //
      const protocol = this.options.handleProtocols
        ? this.options.handleProtocols(protocols, req)
        : protocols.values().next().value;

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws._protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = extension.format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, {
      maxPayload: this.options.maxPayload,
      skipUTF8Validation: this.options.skipUTF8Validation
    });

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => {
        this.clients.delete(ws);

        if (this._shouldEmitClose && !this.clients.size) {
          process.nextTick(emitClose, this);
        }
      });
    }

    cb(ws, req);
  }
}

var websocketServer = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when
 *     called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server._state = CLOSED;
  server.emit('close');
}

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    headers = {
      Connection: 'close',
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(message),
      ...headers
    };

    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
        Object.keys(headers)
          .map((h) => `${h}: ${headers[h]}`)
          .join('\r\n') +
        '\r\n\r\n' +
        message
    );
  }

  socket.removeListener('error', socketOnError);
  socket.destroy();
}

function setup(ctx) {
  var _a;
  const wss = new websocketServer({ noServer: true });
  const clients = new Map();
  (_a = ctx.server.httpServer) == null ? void 0 : _a.on("upgrade", (request, socket, head) => {
    if (!request.url)
      return;
    const { pathname } = new URL(request.url, "http://localhost");
    if (pathname !== API_PATH)
      return;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
      setupClient(ws);
    });
  });
  function setupClient(ws) {
    const rpc = createBirpc({
      getFiles() {
        return ctx.state.getFiles();
      },
      readFile(id) {
        return promises.readFile(id, "utf-8");
      },
      writeFile(id, content) {
        return promises.writeFile(id, content, "utf-8");
      },
      async rerun(files) {
        await ctx.rerunFiles(files);
      },
      getConfig() {
        return ctx.config;
      },
      async getTransformResult(id) {
        const result = await ctx.vitenode.transformRequest(id);
        if (result) {
          try {
            result.source = result.source || await promises.readFile(id, "utf-8");
          } catch {
          }
          return result;
        }
      },
      async getModuleGraph(id) {
        const graph = {};
        const externalized = new Set();
        const inlined = new Set();
        function clearId(id2) {
          return (id2 == null ? void 0 : id2.replace(/\?v=\w+$/, "")) || "";
        }
        async function get(mod, seen = new Map()) {
          if (!mod || !mod.id)
            return;
          if (seen.has(mod))
            return seen.get(mod);
          let id2 = clearId(mod.id);
          seen.set(mod, id2);
          const rewrote = await ctx.vitenode.shouldExternalize(id2);
          if (rewrote) {
            id2 = rewrote;
            externalized.add(id2);
            seen.set(mod, id2);
          } else {
            inlined.add(id2);
          }
          const mods = Array.from(mod.importedModules).filter((i) => i.id && !i.id.includes("/vitest/dist/"));
          graph[id2] = (await Promise.all(mods.map((m) => get(m, seen)))).filter(Boolean);
          return id2;
        }
        await get(ctx.server.moduleGraph.getModuleById(id));
        return {
          graph,
          externalized: Array.from(externalized),
          inlined: Array.from(inlined)
        };
      },
      updateSnapshot(file) {
        if (!file)
          return ctx.updateSnapshot();
        return ctx.updateSnapshot([file.filepath]);
      }
    }, {
      post: (msg) => ws.send(msg),
      on: (fn) => ws.on("message", fn),
      eventNames: ["onUserConsoleLog", "onFinished", "onCollected"],
      serialize: stringify,
      deserialize: parse$3
    });
    clients.set(ws, rpc);
    ws.on("close", () => {
      clients.delete(ws);
    });
  }
  ctx.reporters.push(new WebSocketReporter(ctx, wss, clients));
}
class WebSocketReporter {
  constructor(ctx, wss, clients) {
    this.ctx = ctx;
    this.wss = wss;
    this.clients = clients;
  }
  onCollected(files) {
    if (this.clients.size === 0)
      return;
    this.clients.forEach((client) => {
      var _a;
      (_a = client.onCollected) == null ? void 0 : _a.call(client, files);
    });
  }
  async onTaskUpdate(packs) {
    if (this.clients.size === 0)
      return;
    await Promise.all(packs.map(async (i) => {
      var _a;
      if ((_a = i[1]) == null ? void 0 : _a.error)
        await interpretSourcePos(parseStacktrace(i[1].error), this.ctx);
    }));
    this.clients.forEach((client) => {
      var _a;
      (_a = client.onTaskUpdate) == null ? void 0 : _a.call(client, packs);
    });
  }
  onFinished(files) {
    this.clients.forEach((client) => {
      var _a;
      (_a = client.onFinished) == null ? void 0 : _a.call(client, files);
    });
  }
  onUserConsoleLog(log) {
    this.clients.forEach((client) => {
      var _a;
      (_a = client.onUserConsoleLog) == null ? void 0 : _a.call(client, log);
    });
  }
}

export { setup };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmstYXBpLXNldHVwLjZmOTFmN2I1LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZmxhdHRlZEAzLjIuNS9ub2RlX21vZHVsZXMvZmxhdHRlZC9lc20vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9idWZmZXItdXRpbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93c0A4LjUuMC9ub2RlX21vZHVsZXMvd3MvbGliL2xpbWl0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9wZXJtZXNzYWdlLWRlZmxhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi92YWxpZGF0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3dzQDguNS4wL25vZGVfbW9kdWxlcy93cy9saWIvcmVjZWl2ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9zZW5kZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9ldmVudC10YXJnZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9leHRlbnNpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi93ZWJzb2NrZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3NAOC41LjAvbm9kZV9tb2R1bGVzL3dzL2xpYi9zdWJwcm90b2NvbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93c0A4LjUuMC9ub2RlX21vZHVsZXMvd3MvbGliL3dlYnNvY2tldC1zZXJ2ZXIuanMiLCIuLi9zcmMvYXBpL3NldHVwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAoYykgMjAyMCBBbmRyZWEgR2lhbW1hcmNoaSAqL1xuXG5jb25zdCB7cGFyc2U6ICRwYXJzZSwgc3RyaW5naWZ5OiAkc3RyaW5naWZ5fSA9IEpTT047XG5jb25zdCB7a2V5c30gPSBPYmplY3Q7XG5cbmNvbnN0IFByaW1pdGl2ZSA9IFN0cmluZzsgICAvLyBpdCBjb3VsZCBiZSBOdW1iZXJcbmNvbnN0IHByaW1pdGl2ZSA9ICdzdHJpbmcnOyAvLyBpdCBjb3VsZCBiZSAnbnVtYmVyJ1xuXG5jb25zdCBpZ25vcmUgPSB7fTtcbmNvbnN0IG9iamVjdCA9ICdvYmplY3QnO1xuXG5jb25zdCBub29wID0gKF8sIHZhbHVlKSA9PiB2YWx1ZTtcblxuY29uc3QgcHJpbWl0aXZlcyA9IHZhbHVlID0+IChcbiAgdmFsdWUgaW5zdGFuY2VvZiBQcmltaXRpdmUgPyBQcmltaXRpdmUodmFsdWUpIDogdmFsdWVcbik7XG5cbmNvbnN0IFByaW1pdGl2ZXMgPSAoXywgdmFsdWUpID0+IChcbiAgdHlwZW9mIHZhbHVlID09PSBwcmltaXRpdmUgPyBuZXcgUHJpbWl0aXZlKHZhbHVlKSA6IHZhbHVlXG4pO1xuXG5jb25zdCByZXZpdmUgPSAoaW5wdXQsIHBhcnNlZCwgb3V0cHV0LCAkKSA9PiB7XG4gIGNvbnN0IGxhenkgPSBbXTtcbiAgZm9yIChsZXQga2UgPSBrZXlzKG91dHB1dCksIHtsZW5ndGh9ID0ga2UsIHkgPSAwOyB5IDwgbGVuZ3RoOyB5KyspIHtcbiAgICBjb25zdCBrID0ga2VbeV07XG4gICAgY29uc3QgdmFsdWUgPSBvdXRwdXRba107XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJpbWl0aXZlKSB7XG4gICAgICBjb25zdCB0bXAgPSBpbnB1dFt2YWx1ZV07XG4gICAgICBpZiAodHlwZW9mIHRtcCA9PT0gb2JqZWN0ICYmICFwYXJzZWQuaGFzKHRtcCkpIHtcbiAgICAgICAgcGFyc2VkLmFkZCh0bXApO1xuICAgICAgICBvdXRwdXRba10gPSBpZ25vcmU7XG4gICAgICAgIGxhenkucHVzaCh7aywgYTogW2lucHV0LCBwYXJzZWQsIHRtcCwgJF19KTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgb3V0cHV0W2tdID0gJC5jYWxsKG91dHB1dCwgaywgdG1wKTtcbiAgICB9XG4gICAgZWxzZSBpZiAob3V0cHV0W2tdICE9PSBpZ25vcmUpXG4gICAgICBvdXRwdXRba10gPSAkLmNhbGwob3V0cHV0LCBrLCB2YWx1ZSk7XG4gIH1cbiAgZm9yIChsZXQge2xlbmd0aH0gPSBsYXp5LCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qge2ssIGF9ID0gbGF6eVtpXTtcbiAgICBvdXRwdXRba10gPSAkLmNhbGwob3V0cHV0LCBrLCByZXZpdmUuYXBwbHkobnVsbCwgYSkpO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59O1xuXG5jb25zdCBzZXQgPSAoa25vd24sIGlucHV0LCB2YWx1ZSkgPT4ge1xuICBjb25zdCBpbmRleCA9IFByaW1pdGl2ZShpbnB1dC5wdXNoKHZhbHVlKSAtIDEpO1xuICBrbm93bi5zZXQodmFsdWUsIGluZGV4KTtcbiAgcmV0dXJuIGluZGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlID0gKHRleHQsIHJldml2ZXIpID0+IHtcbiAgY29uc3QgaW5wdXQgPSAkcGFyc2UodGV4dCwgUHJpbWl0aXZlcykubWFwKHByaW1pdGl2ZXMpO1xuICBjb25zdCB2YWx1ZSA9IGlucHV0WzBdO1xuICBjb25zdCAkID0gcmV2aXZlciB8fCBub29wO1xuICBjb25zdCB0bXAgPSB0eXBlb2YgdmFsdWUgPT09IG9iamVjdCAmJiB2YWx1ZSA/XG4gICAgICAgICAgICAgIHJldml2ZShpbnB1dCwgbmV3IFNldCwgdmFsdWUsICQpIDpcbiAgICAgICAgICAgICAgdmFsdWU7XG4gIHJldHVybiAkLmNhbGwoeycnOiB0bXB9LCAnJywgdG1wKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdpZnkgPSAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkgPT4ge1xuICBjb25zdCAkID0gcmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyID09PSBvYmplY3QgP1xuICAgICAgICAgICAgKGssIHYpID0+IChrID09PSAnJyB8fCAtMSA8IHJlcGxhY2VyLmluZGV4T2YoaykgPyB2IDogdm9pZCAwKSA6XG4gICAgICAgICAgICAocmVwbGFjZXIgfHwgbm9vcCk7XG4gIGNvbnN0IGtub3duID0gbmV3IE1hcDtcbiAgY29uc3QgaW5wdXQgPSBbXTtcbiAgY29uc3Qgb3V0cHV0ID0gW107XG4gIGxldCBpID0gK3NldChrbm93biwgaW5wdXQsICQuY2FsbCh7Jyc6IHZhbHVlfSwgJycsIHZhbHVlKSk7XG4gIGxldCBmaXJzdFJ1biA9ICFpO1xuICB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCkge1xuICAgIGZpcnN0UnVuID0gdHJ1ZTtcbiAgICBvdXRwdXRbaV0gPSAkc3RyaW5naWZ5KGlucHV0W2krK10sIHJlcGxhY2UsIHNwYWNlKTtcbiAgfVxuICByZXR1cm4gJ1snICsgb3V0cHV0LmpvaW4oJywnKSArICddJztcbiAgZnVuY3Rpb24gcmVwbGFjZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKGZpcnN0UnVuKSB7XG4gICAgICBmaXJzdFJ1biA9ICFmaXJzdFJ1bjtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgYWZ0ZXIgPSAkLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlb2YgYWZ0ZXIpIHtcbiAgICAgIGNhc2Ugb2JqZWN0OlxuICAgICAgICBpZiAoYWZ0ZXIgPT09IG51bGwpIHJldHVybiBhZnRlcjtcbiAgICAgIGNhc2UgcHJpbWl0aXZlOlxuICAgICAgICByZXR1cm4ga25vd24uZ2V0KGFmdGVyKSB8fCBzZXQoa25vd24sIGlucHV0LCBhZnRlcik7XG4gICAgfVxuICAgIHJldHVybiBhZnRlcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHRvSlNPTiA9IGFueSA9PiAkcGFyc2Uoc3RyaW5naWZ5KGFueSkpO1xuZXhwb3J0IGNvbnN0IGZyb21KU09OID0gYW55ID0+IHBhcnNlKCRzdHJpbmdpZnkoYW55KSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBCSU5BUllfVFlQRVM6IFsnbm9kZWJ1ZmZlcicsICdhcnJheWJ1ZmZlcicsICdmcmFnbWVudHMnXSxcbiAgRU1QVFlfQlVGRkVSOiBCdWZmZXIuYWxsb2MoMCksXG4gIEdVSUQ6ICcyNThFQUZBNS1FOTE0LTQ3REEtOTVDQS1DNUFCMERDODVCMTEnLFxuICBrRm9yT25FdmVudEF0dHJpYnV0ZTogU3ltYm9sKCdrSXNGb3JPbkV2ZW50QXR0cmlidXRlJyksXG4gIGtMaXN0ZW5lcjogU3ltYm9sKCdrTGlzdGVuZXInKSxcbiAga1N0YXR1c0NvZGU6IFN5bWJvbCgnc3RhdHVzLWNvZGUnKSxcbiAga1dlYlNvY2tldDogU3ltYm9sKCd3ZWJzb2NrZXQnKSxcbiAgTk9PUDogKCkgPT4ge31cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsgRU1QVFlfQlVGRkVSIH0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG4vKipcbiAqIE1lcmdlcyBhbiBhcnJheSBvZiBidWZmZXJzIGludG8gYSBuZXcgYnVmZmVyLlxuICpcbiAqIEBwYXJhbSB7QnVmZmVyW119IGxpc3QgVGhlIGFycmF5IG9mIGJ1ZmZlcnMgdG8gY29uY2F0XG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxMZW5ndGggVGhlIHRvdGFsIGxlbmd0aCBvZiBidWZmZXJzIGluIHRoZSBsaXN0XG4gKiBAcmV0dXJuIHtCdWZmZXJ9IFRoZSByZXN1bHRpbmcgYnVmZmVyXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGNvbmNhdChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHJldHVybiBFTVBUWV9CVUZGRVI7XG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkgcmV0dXJuIGxpc3RbMF07XG5cbiAgY29uc3QgdGFyZ2V0ID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRvdGFsTGVuZ3RoKTtcbiAgbGV0IG9mZnNldCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYnVmID0gbGlzdFtpXTtcbiAgICB0YXJnZXQuc2V0KGJ1Ziwgb2Zmc2V0KTtcbiAgICBvZmZzZXQgKz0gYnVmLmxlbmd0aDtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPCB0b3RhbExlbmd0aCkgcmV0dXJuIHRhcmdldC5zbGljZSgwLCBvZmZzZXQpO1xuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbi8qKlxuICogTWFza3MgYSBidWZmZXIgdXNpbmcgdGhlIGdpdmVuIG1hc2suXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ9IHNvdXJjZSBUaGUgYnVmZmVyIHRvIG1hc2tcbiAqIEBwYXJhbSB7QnVmZmVyfSBtYXNrIFRoZSBtYXNrIHRvIHVzZVxuICogQHBhcmFtIHtCdWZmZXJ9IG91dHB1dCBUaGUgYnVmZmVyIHdoZXJlIHRvIHN0b3JlIHRoZSByZXN1bHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgVGhlIG9mZnNldCBhdCB3aGljaCB0byBzdGFydCB3cml0aW5nXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBudW1iZXIgb2YgYnl0ZXMgdG8gbWFzay5cbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gX21hc2soc291cmNlLCBtYXNrLCBvdXRwdXQsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBvdXRwdXRbb2Zmc2V0ICsgaV0gPSBzb3VyY2VbaV0gXiBtYXNrW2kgJiAzXTtcbiAgfVxufVxuXG4vKipcbiAqIFVubWFza3MgYSBidWZmZXIgdXNpbmcgdGhlIGdpdmVuIG1hc2suXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIHVubWFza1xuICogQHBhcmFtIHtCdWZmZXJ9IG1hc2sgVGhlIG1hc2sgdG8gdXNlXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIF91bm1hc2soYnVmZmVyLCBtYXNrKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgYnVmZmVyW2ldIF49IG1hc2tbaSAmIDNdO1xuICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBidWZmZXIgdG8gYW4gYEFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmIFRoZSBidWZmZXIgdG8gY29udmVydFxuICogQHJldHVybiB7QXJyYXlCdWZmZXJ9IENvbnZlcnRlZCBidWZmZXJcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gdG9BcnJheUJ1ZmZlcihidWYpIHtcbiAgaWYgKGJ1Zi5ieXRlTGVuZ3RoID09PSBidWYuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICByZXR1cm4gYnVmLmJ1ZmZlcjtcbiAgfVxuXG4gIHJldHVybiBidWYuYnVmZmVyLnNsaWNlKGJ1Zi5ieXRlT2Zmc2V0LCBidWYuYnl0ZU9mZnNldCArIGJ1Zi5ieXRlTGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgZGF0YWAgdG8gYSBgQnVmZmVyYC5cbiAqXG4gKiBAcGFyYW0geyp9IGRhdGEgVGhlIGRhdGEgdG8gY29udmVydFxuICogQHJldHVybiB7QnVmZmVyfSBUaGUgYnVmZmVyXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHRvQnVmZmVyKGRhdGEpIHtcbiAgdG9CdWZmZXIucmVhZE9ubHkgPSB0cnVlO1xuXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoZGF0YSkpIHJldHVybiBkYXRhO1xuXG4gIGxldCBidWY7XG5cbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIGJ1ZiA9IEJ1ZmZlci5mcm9tKGRhdGEpO1xuICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSkge1xuICAgIGJ1ZiA9IEJ1ZmZlci5mcm9tKGRhdGEuYnVmZmVyLCBkYXRhLmJ5dGVPZmZzZXQsIGRhdGEuYnl0ZUxlbmd0aCk7XG4gIH0gZWxzZSB7XG4gICAgYnVmID0gQnVmZmVyLmZyb20oZGF0YSk7XG4gICAgdG9CdWZmZXIucmVhZE9ubHkgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBidWY7XG59XG5cbnRyeSB7XG4gIGNvbnN0IGJ1ZmZlclV0aWwgPSByZXF1aXJlKCdidWZmZXJ1dGlsJyk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29uY2F0LFxuICAgIG1hc2soc291cmNlLCBtYXNrLCBvdXRwdXQsIG9mZnNldCwgbGVuZ3RoKSB7XG4gICAgICBpZiAobGVuZ3RoIDwgNDgpIF9tYXNrKHNvdXJjZSwgbWFzaywgb3V0cHV0LCBvZmZzZXQsIGxlbmd0aCk7XG4gICAgICBlbHNlIGJ1ZmZlclV0aWwubWFzayhzb3VyY2UsIG1hc2ssIG91dHB1dCwgb2Zmc2V0LCBsZW5ndGgpO1xuICAgIH0sXG4gICAgdG9BcnJheUJ1ZmZlcixcbiAgICB0b0J1ZmZlcixcbiAgICB1bm1hc2soYnVmZmVyLCBtYXNrKSB7XG4gICAgICBpZiAoYnVmZmVyLmxlbmd0aCA8IDMyKSBfdW5tYXNrKGJ1ZmZlciwgbWFzayk7XG4gICAgICBlbHNlIGJ1ZmZlclV0aWwudW5tYXNrKGJ1ZmZlciwgbWFzayk7XG4gICAgfVxuICB9O1xufSBjYXRjaCAoZSkgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8ge1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb25jYXQsXG4gICAgbWFzazogX21hc2ssXG4gICAgdG9BcnJheUJ1ZmZlcixcbiAgICB0b0J1ZmZlcixcbiAgICB1bm1hc2s6IF91bm1hc2tcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qga0RvbmUgPSBTeW1ib2woJ2tEb25lJyk7XG5jb25zdCBrUnVuID0gU3ltYm9sKCdrUnVuJyk7XG5cbi8qKlxuICogQSB2ZXJ5IHNpbXBsZSBqb2IgcXVldWUgd2l0aCBhZGp1c3RhYmxlIGNvbmN1cnJlbmN5LiBBZGFwdGVkIGZyb21cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9TVFJNTC9hc3luYy1saW1pdGVyXG4gKi9cbmNsYXNzIExpbWl0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgTGltaXRlcmAuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbY29uY3VycmVuY3k9SW5maW5pdHldIFRoZSBtYXhpbXVtIG51bWJlciBvZiBqb2JzIGFsbG93ZWRcbiAgICogICAgIHRvIHJ1biBjb25jdXJyZW50bHlcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmN1cnJlbmN5KSB7XG4gICAgdGhpc1trRG9uZV0gPSAoKSA9PiB7XG4gICAgICB0aGlzLnBlbmRpbmctLTtcbiAgICAgIHRoaXNba1J1bl0oKTtcbiAgICB9O1xuICAgIHRoaXMuY29uY3VycmVuY3kgPSBjb25jdXJyZW5jeSB8fCBJbmZpbml0eTtcbiAgICB0aGlzLmpvYnMgPSBbXTtcbiAgICB0aGlzLnBlbmRpbmcgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBqb2IgdG8gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBqb2IgVGhlIGpvYiB0byBydW5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgYWRkKGpvYikge1xuICAgIHRoaXMuam9icy5wdXNoKGpvYik7XG4gICAgdGhpc1trUnVuXSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBqb2IgZnJvbSB0aGUgcXVldWUgYW5kIHJ1bnMgaXQgaWYgcG9zc2libGUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBba1J1bl0oKSB7XG4gICAgaWYgKHRoaXMucGVuZGluZyA9PT0gdGhpcy5jb25jdXJyZW5jeSkgcmV0dXJuO1xuXG4gICAgaWYgKHRoaXMuam9icy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGpvYiA9IHRoaXMuam9icy5zaGlmdCgpO1xuXG4gICAgICB0aGlzLnBlbmRpbmcrKztcbiAgICAgIGpvYih0aGlzW2tEb25lXSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGltaXRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgemxpYiA9IHJlcXVpcmUoJ3psaWInKTtcblxuY29uc3QgYnVmZmVyVXRpbCA9IHJlcXVpcmUoJy4vYnVmZmVyLXV0aWwnKTtcbmNvbnN0IExpbWl0ZXIgPSByZXF1aXJlKCcuL2xpbWl0ZXInKTtcbmNvbnN0IHsga1N0YXR1c0NvZGUgfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmNvbnN0IFRSQUlMRVIgPSBCdWZmZXIuZnJvbShbMHgwMCwgMHgwMCwgMHhmZiwgMHhmZl0pO1xuY29uc3Qga1Blck1lc3NhZ2VEZWZsYXRlID0gU3ltYm9sKCdwZXJtZXNzYWdlLWRlZmxhdGUnKTtcbmNvbnN0IGtUb3RhbExlbmd0aCA9IFN5bWJvbCgndG90YWwtbGVuZ3RoJyk7XG5jb25zdCBrQ2FsbGJhY2sgPSBTeW1ib2woJ2NhbGxiYWNrJyk7XG5jb25zdCBrQnVmZmVycyA9IFN5bWJvbCgnYnVmZmVycycpO1xuY29uc3Qga0Vycm9yID0gU3ltYm9sKCdlcnJvcicpO1xuXG4vL1xuLy8gV2UgbGltaXQgemxpYiBjb25jdXJyZW5jeSwgd2hpY2ggcHJldmVudHMgc2V2ZXJlIG1lbW9yeSBmcmFnbWVudGF0aW9uXG4vLyBhcyBkb2N1bWVudGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9pc3N1ZXMvODg3MSNpc3N1ZWNvbW1lbnQtMjUwOTE1OTEzXG4vLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3dlYnNvY2tldHMvd3MvaXNzdWVzLzEyMDJcbi8vXG4vLyBJbnRlbnRpb25hbGx5IGdsb2JhbDsgaXQncyB0aGUgZ2xvYmFsIHRocmVhZCBwb29sIHRoYXQncyBhbiBpc3N1ZS5cbi8vXG5sZXQgemxpYkxpbWl0ZXI7XG5cbi8qKlxuICogcGVybWVzc2FnZS1kZWZsYXRlIGltcGxlbWVudGF0aW9uLlxuICovXG5jbGFzcyBQZXJNZXNzYWdlRGVmbGF0ZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgUGVyTWVzc2FnZURlZmxhdGUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQ29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEBwYXJhbSB7KEJvb2xlYW58TnVtYmVyKX0gW29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0c10gQWR2ZXJ0aXNlIHN1cHBvcnRcbiAgICogICAgIGZvciwgb3IgcmVxdWVzdCwgYSBjdXN0b20gY2xpZW50IHdpbmRvdyBzaXplXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2xpZW50Tm9Db250ZXh0VGFrZW92ZXI9ZmFsc2VdIEFkdmVydGlzZS9cbiAgICogICAgIGFja25vd2xlZGdlIGRpc2FibGluZyBvZiBjbGllbnQgY29udGV4dCB0YWtlb3ZlclxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY29uY3VycmVuY3lMaW1pdD0xMF0gVGhlIG51bWJlciBvZiBjb25jdXJyZW50XG4gICAqICAgICBjYWxscyB0byB6bGliXG4gICAqIEBwYXJhbSB7KEJvb2xlYW58TnVtYmVyKX0gW29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0c10gUmVxdWVzdC9jb25maXJtIHRoZVxuICAgKiAgICAgdXNlIG9mIGEgY3VzdG9tIHNlcnZlciB3aW5kb3cgc2l6ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnNlcnZlck5vQ29udGV4dFRha2VvdmVyPWZhbHNlXSBSZXF1ZXN0L2FjY2VwdFxuICAgKiAgICAgZGlzYWJsaW5nIG9mIHNlcnZlciBjb250ZXh0IHRha2VvdmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy50aHJlc2hvbGQ9MTAyNF0gU2l6ZSAoaW4gYnl0ZXMpIGJlbG93IHdoaWNoXG4gICAqICAgICBtZXNzYWdlcyBzaG91bGQgbm90IGJlIGNvbXByZXNzZWQgaWYgY29udGV4dCB0YWtlb3ZlciBpcyBkaXNhYmxlZFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuemxpYkRlZmxhdGVPcHRpb25zXSBPcHRpb25zIHRvIHBhc3MgdG8gemxpYiBvblxuICAgKiAgICAgZGVmbGF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuemxpYkluZmxhdGVPcHRpb25zXSBPcHRpb25zIHRvIHBhc3MgdG8gemxpYiBvblxuICAgKiAgICAgaW5mbGF0ZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1NlcnZlcj1mYWxzZV0gQ3JlYXRlIHRoZSBpbnN0YW5jZSBpbiBlaXRoZXIgc2VydmVyIG9yXG4gICAqICAgICBjbGllbnQgbW9kZVxuICAgKiBAcGFyYW0ge051bWJlcn0gW21heFBheWxvYWQ9MF0gVGhlIG1heGltdW0gYWxsb3dlZCBtZXNzYWdlIGxlbmd0aFxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucywgaXNTZXJ2ZXIsIG1heFBheWxvYWQpIHtcbiAgICB0aGlzLl9tYXhQYXlsb2FkID0gbWF4UGF5bG9hZCB8IDA7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5fdGhyZXNob2xkID1cbiAgICAgIHRoaXMuX29wdGlvbnMudGhyZXNob2xkICE9PSB1bmRlZmluZWQgPyB0aGlzLl9vcHRpb25zLnRocmVzaG9sZCA6IDEwMjQ7XG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhIWlzU2VydmVyO1xuICAgIHRoaXMuX2RlZmxhdGUgPSBudWxsO1xuICAgIHRoaXMuX2luZmxhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuXG4gICAgaWYgKCF6bGliTGltaXRlcikge1xuICAgICAgY29uc3QgY29uY3VycmVuY3kgPVxuICAgICAgICB0aGlzLl9vcHRpb25zLmNvbmN1cnJlbmN5TGltaXQgIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gdGhpcy5fb3B0aW9ucy5jb25jdXJyZW5jeUxpbWl0XG4gICAgICAgICAgOiAxMDtcbiAgICAgIHpsaWJMaW1pdGVyID0gbmV3IExpbWl0ZXIoY29uY3VycmVuY3kpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdldCBleHRlbnNpb25OYW1lKCkge1xuICAgIHJldHVybiAncGVybWVzc2FnZS1kZWZsYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gZXh0ZW5zaW9uIG5lZ290aWF0aW9uIG9mZmVyLlxuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEV4dGVuc2lvbiBwYXJhbWV0ZXJzXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIG9mZmVyKCkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHt9O1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuc2VydmVyTm9Db250ZXh0VGFrZW92ZXIpIHtcbiAgICAgIHBhcmFtcy5zZXJ2ZXJfbm9fY29udGV4dF90YWtlb3ZlciA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vcHRpb25zLmNsaWVudE5vQ29udGV4dFRha2VvdmVyKSB7XG4gICAgICBwYXJhbXMuY2xpZW50X25vX2NvbnRleHRfdGFrZW92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5zZXJ2ZXJNYXhXaW5kb3dCaXRzKSB7XG4gICAgICBwYXJhbXMuc2VydmVyX21heF93aW5kb3dfYml0cyA9IHRoaXMuX29wdGlvbnMuc2VydmVyTWF4V2luZG93Qml0cztcbiAgICB9XG4gICAgaWYgKHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cykge1xuICAgICAgcGFyYW1zLmNsaWVudF9tYXhfd2luZG93X2JpdHMgPSB0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHM7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHMgPT0gbnVsbCkge1xuICAgICAgcGFyYW1zLmNsaWVudF9tYXhfd2luZG93X2JpdHMgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0IGFuIGV4dGVuc2lvbiBuZWdvdGlhdGlvbiBvZmZlci9yZXNwb25zZS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gY29uZmlndXJhdGlvbnMgVGhlIGV4dGVuc2lvbiBuZWdvdGlhdGlvbiBvZmZlcnMvcmVwb25zZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFjY2VwdGVkIGNvbmZpZ3VyYXRpb25cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgYWNjZXB0KGNvbmZpZ3VyYXRpb25zKSB7XG4gICAgY29uZmlndXJhdGlvbnMgPSB0aGlzLm5vcm1hbGl6ZVBhcmFtcyhjb25maWd1cmF0aW9ucyk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHRoaXMuX2lzU2VydmVyXG4gICAgICA/IHRoaXMuYWNjZXB0QXNTZXJ2ZXIoY29uZmlndXJhdGlvbnMpXG4gICAgICA6IHRoaXMuYWNjZXB0QXNDbGllbnQoY29uZmlndXJhdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIGFsbCByZXNvdXJjZXMgdXNlZCBieSB0aGUgZXh0ZW5zaW9uLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhbnVwKCkge1xuICAgIGlmICh0aGlzLl9pbmZsYXRlKSB7XG4gICAgICB0aGlzLl9pbmZsYXRlLmNsb3NlKCk7XG4gICAgICB0aGlzLl9pbmZsYXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVmbGF0ZSkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLl9kZWZsYXRlW2tDYWxsYmFja107XG5cbiAgICAgIHRoaXMuX2RlZmxhdGUuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2RlZmxhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ1RoZSBkZWZsYXRlIHN0cmVhbSB3YXMgY2xvc2VkIHdoaWxlIGRhdGEgd2FzIGJlaW5nIHByb2Nlc3NlZCdcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqICBBY2NlcHQgYW4gZXh0ZW5zaW9uIG5lZ290aWF0aW9uIG9mZmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBvZmZlcnMgVGhlIGV4dGVuc2lvbiBuZWdvdGlhdGlvbiBvZmZlcnNcbiAgICogQHJldHVybiB7T2JqZWN0fSBBY2NlcHRlZCBjb25maWd1cmF0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhY2NlcHRBc1NlcnZlcihvZmZlcnMpIHtcbiAgICBjb25zdCBvcHRzID0gdGhpcy5fb3B0aW9ucztcbiAgICBjb25zdCBhY2NlcHRlZCA9IG9mZmVycy5maW5kKChwYXJhbXMpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgKG9wdHMuc2VydmVyTm9Db250ZXh0VGFrZW92ZXIgPT09IGZhbHNlICYmXG4gICAgICAgICAgcGFyYW1zLnNlcnZlcl9ub19jb250ZXh0X3Rha2VvdmVyKSB8fFxuICAgICAgICAocGFyYW1zLnNlcnZlcl9tYXhfd2luZG93X2JpdHMgJiZcbiAgICAgICAgICAob3B0cy5zZXJ2ZXJNYXhXaW5kb3dCaXRzID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgKHR5cGVvZiBvcHRzLnNlcnZlck1heFdpbmRvd0JpdHMgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgICAgIG9wdHMuc2VydmVyTWF4V2luZG93Qml0cyA+IHBhcmFtcy5zZXJ2ZXJfbWF4X3dpbmRvd19iaXRzKSkpIHx8XG4gICAgICAgICh0eXBlb2Ygb3B0cy5jbGllbnRNYXhXaW5kb3dCaXRzID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICFwYXJhbXMuY2xpZW50X21heF93aW5kb3dfYml0cylcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgaWYgKCFhY2NlcHRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb25lIG9mIHRoZSBleHRlbnNpb24gb2ZmZXJzIGNhbiBiZSBhY2NlcHRlZCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRzLnNlcnZlck5vQ29udGV4dFRha2VvdmVyKSB7XG4gICAgICBhY2NlcHRlZC5zZXJ2ZXJfbm9fY29udGV4dF90YWtlb3ZlciA9IHRydWU7XG4gICAgfVxuICAgIGlmIChvcHRzLmNsaWVudE5vQ29udGV4dFRha2VvdmVyKSB7XG4gICAgICBhY2NlcHRlZC5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlciA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0cy5zZXJ2ZXJNYXhXaW5kb3dCaXRzID09PSAnbnVtYmVyJykge1xuICAgICAgYWNjZXB0ZWQuc2VydmVyX21heF93aW5kb3dfYml0cyA9IG9wdHMuc2VydmVyTWF4V2luZG93Qml0cztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRzLmNsaWVudE1heFdpbmRvd0JpdHMgPT09ICdudW1iZXInKSB7XG4gICAgICBhY2NlcHRlZC5jbGllbnRfbWF4X3dpbmRvd19iaXRzID0gb3B0cy5jbGllbnRNYXhXaW5kb3dCaXRzO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBhY2NlcHRlZC5jbGllbnRfbWF4X3dpbmRvd19iaXRzID09PSB0cnVlIHx8XG4gICAgICBvcHRzLmNsaWVudE1heFdpbmRvd0JpdHMgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICBkZWxldGUgYWNjZXB0ZWQuY2xpZW50X21heF93aW5kb3dfYml0cztcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjZXB0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWNjZXB0IHRoZSBleHRlbnNpb24gbmVnb3RpYXRpb24gcmVzcG9uc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHJlc3BvbnNlIFRoZSBleHRlbnNpb24gbmVnb3RpYXRpb24gcmVzcG9uc2VcbiAgICogQHJldHVybiB7T2JqZWN0fSBBY2NlcHRlZCBjb25maWd1cmF0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhY2NlcHRBc0NsaWVudChyZXNwb25zZSkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHJlc3BvbnNlWzBdO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5fb3B0aW9ucy5jbGllbnROb0NvbnRleHRUYWtlb3ZlciA9PT0gZmFsc2UgJiZcbiAgICAgIHBhcmFtcy5jbGllbnRfbm9fY29udGV4dF90YWtlb3ZlclxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIHBhcmFtZXRlciBcImNsaWVudF9ub19jb250ZXh0X3Rha2VvdmVyXCInKTtcbiAgICB9XG5cbiAgICBpZiAoIXBhcmFtcy5jbGllbnRfbWF4X3dpbmRvd19iaXRzKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcGFyYW1zLmNsaWVudF9tYXhfd2luZG93X2JpdHMgPSB0aGlzLl9vcHRpb25zLmNsaWVudE1heFdpbmRvd0JpdHM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cyA9PT0gZmFsc2UgfHxcbiAgICAgICh0eXBlb2YgdGhpcy5fb3B0aW9ucy5jbGllbnRNYXhXaW5kb3dCaXRzID09PSAnbnVtYmVyJyAmJlxuICAgICAgICBwYXJhbXMuY2xpZW50X21heF93aW5kb3dfYml0cyA+IHRoaXMuX29wdGlvbnMuY2xpZW50TWF4V2luZG93Qml0cylcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1VuZXhwZWN0ZWQgb3IgaW52YWxpZCBwYXJhbWV0ZXIgXCJjbGllbnRfbWF4X3dpbmRvd19iaXRzXCInXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbXM7XG4gIH1cblxuICAvKipcbiAgICogTm9ybWFsaXplIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGNvbmZpZ3VyYXRpb25zIFRoZSBleHRlbnNpb24gbmVnb3RpYXRpb24gb2ZmZXJzL3JlcG9uc2VcbiAgICogQHJldHVybiB7QXJyYXl9IFRoZSBvZmZlcnMvcmVzcG9uc2Ugd2l0aCBub3JtYWxpemVkIHBhcmFtZXRlcnNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG5vcm1hbGl6ZVBhcmFtcyhjb25maWd1cmF0aW9ucykge1xuICAgIGNvbmZpZ3VyYXRpb25zLmZvckVhY2goKHBhcmFtcykgPT4ge1xuICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyYW1zW2tleV07XG5cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhcmFtZXRlciBcIiR7a2V5fVwiIG11c3QgaGF2ZSBvbmx5IGEgc2luZ2xlIHZhbHVlYCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHZhbHVlWzBdO1xuXG4gICAgICAgIGlmIChrZXkgPT09ICdjbGllbnRfbWF4X3dpbmRvd19iaXRzJykge1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gK3ZhbHVlO1xuICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG51bSkgfHwgbnVtIDwgOCB8fCBudW0gPiAxNSkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgIGBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgXCIke2tleX1cIjogJHt2YWx1ZX1gXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IG51bTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc1NlcnZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgYEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciBcIiR7a2V5fVwiOiAke3ZhbHVlfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3NlcnZlcl9tYXhfd2luZG93X2JpdHMnKSB7XG4gICAgICAgICAgY29uc3QgbnVtID0gK3ZhbHVlO1xuICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihudW0pIHx8IG51bSA8IDggfHwgbnVtID4gMTUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgIGBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgXCIke2tleX1cIjogJHt2YWx1ZX1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IG51bTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBrZXkgPT09ICdjbGllbnRfbm9fY29udGV4dF90YWtlb3ZlcicgfHxcbiAgICAgICAgICBrZXkgPT09ICdzZXJ2ZXJfbm9fY29udGV4dF90YWtlb3ZlcidcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICBgSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyIFwiJHtrZXl9XCI6ICR7dmFsdWV9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcmFtZXRlciBcIiR7a2V5fVwiYCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29uZmlndXJhdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogRGVjb21wcmVzcyBkYXRhLiBDb25jdXJyZW5jeSBsaW1pdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YSBDb21wcmVzc2VkIGRhdGFcbiAgICogQHBhcmFtIHtCb29sZWFufSBmaW4gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgdGhlIGxhc3QgZnJhZ21lbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2tcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZGVjb21wcmVzcyhkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgemxpYkxpbWl0ZXIuYWRkKChkb25lKSA9PiB7XG4gICAgICB0aGlzLl9kZWNvbXByZXNzKGRhdGEsIGZpbiwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHJlc3MgZGF0YS4gQ29uY3VycmVuY3kgbGltaXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHsoQnVmZmVyfFN0cmluZyl9IGRhdGEgRGF0YSB0byBjb21wcmVzc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZpbiBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdGhpcyBpcyB0aGUgbGFzdCBmcmFnbWVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBjb21wcmVzcyhkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgemxpYkxpbWl0ZXIuYWRkKChkb25lKSA9PiB7XG4gICAgICB0aGlzLl9jb21wcmVzcyhkYXRhLCBmaW4sIChlcnIsIHJlc3VsdCkgPT4ge1xuICAgICAgICBkb25lKCk7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY29tcHJlc3MgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgQ29tcHJlc3NlZCBkYXRhXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gZmluIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0aGlzIGlzIHRoZSBsYXN0IGZyYWdtZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVjb21wcmVzcyhkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9pc1NlcnZlciA/ICdjbGllbnQnIDogJ3NlcnZlcic7XG5cbiAgICBpZiAoIXRoaXMuX2luZmxhdGUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2VuZHBvaW50fV9tYXhfd2luZG93X2JpdHNgO1xuICAgICAgY29uc3Qgd2luZG93Qml0cyA9XG4gICAgICAgIHR5cGVvZiB0aGlzLnBhcmFtc1trZXldICE9PSAnbnVtYmVyJ1xuICAgICAgICAgID8gemxpYi5aX0RFRkFVTFRfV0lORE9XQklUU1xuICAgICAgICAgIDogdGhpcy5wYXJhbXNba2V5XTtcblxuICAgICAgdGhpcy5faW5mbGF0ZSA9IHpsaWIuY3JlYXRlSW5mbGF0ZVJhdyh7XG4gICAgICAgIC4uLnRoaXMuX29wdGlvbnMuemxpYkluZmxhdGVPcHRpb25zLFxuICAgICAgICB3aW5kb3dCaXRzXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2luZmxhdGVba1Blck1lc3NhZ2VEZWZsYXRlXSA9IHRoaXM7XG4gICAgICB0aGlzLl9pbmZsYXRlW2tUb3RhbExlbmd0aF0gPSAwO1xuICAgICAgdGhpcy5faW5mbGF0ZVtrQnVmZmVyc10gPSBbXTtcbiAgICAgIHRoaXMuX2luZmxhdGUub24oJ2Vycm9yJywgaW5mbGF0ZU9uRXJyb3IpO1xuICAgICAgdGhpcy5faW5mbGF0ZS5vbignZGF0YScsIGluZmxhdGVPbkRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuX2luZmxhdGVba0NhbGxiYWNrXSA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5faW5mbGF0ZS53cml0ZShkYXRhKTtcbiAgICBpZiAoZmluKSB0aGlzLl9pbmZsYXRlLndyaXRlKFRSQUlMRVIpO1xuXG4gICAgdGhpcy5faW5mbGF0ZS5mbHVzaCgoKSA9PiB7XG4gICAgICBjb25zdCBlcnIgPSB0aGlzLl9pbmZsYXRlW2tFcnJvcl07XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5faW5mbGF0ZS5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9pbmZsYXRlID0gbnVsbDtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkYXRhID0gYnVmZmVyVXRpbC5jb25jYXQoXG4gICAgICAgIHRoaXMuX2luZmxhdGVba0J1ZmZlcnNdLFxuICAgICAgICB0aGlzLl9pbmZsYXRlW2tUb3RhbExlbmd0aF1cbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLl9pbmZsYXRlLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQpIHtcbiAgICAgICAgdGhpcy5faW5mbGF0ZS5jbG9zZSgpO1xuICAgICAgICB0aGlzLl9pbmZsYXRlID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2luZmxhdGVba1RvdGFsTGVuZ3RoXSA9IDA7XG4gICAgICAgIHRoaXMuX2luZmxhdGVba0J1ZmZlcnNdID0gW107XG5cbiAgICAgICAgaWYgKGZpbiAmJiB0aGlzLnBhcmFtc1tgJHtlbmRwb2ludH1fbm9fY29udGV4dF90YWtlb3ZlcmBdKSB7XG4gICAgICAgICAgdGhpcy5faW5mbGF0ZS5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXByZXNzIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7KEJ1ZmZlcnxTdHJpbmcpfSBkYXRhIERhdGEgdG8gY29tcHJlc3NcbiAgICogQHBhcmFtIHtCb29sZWFufSBmaW4gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgdGhlIGxhc3QgZnJhZ21lbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2tcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jb21wcmVzcyhkYXRhLCBmaW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZW5kcG9pbnQgPSB0aGlzLl9pc1NlcnZlciA/ICdzZXJ2ZXInIDogJ2NsaWVudCc7XG5cbiAgICBpZiAoIXRoaXMuX2RlZmxhdGUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2VuZHBvaW50fV9tYXhfd2luZG93X2JpdHNgO1xuICAgICAgY29uc3Qgd2luZG93Qml0cyA9XG4gICAgICAgIHR5cGVvZiB0aGlzLnBhcmFtc1trZXldICE9PSAnbnVtYmVyJ1xuICAgICAgICAgID8gemxpYi5aX0RFRkFVTFRfV0lORE9XQklUU1xuICAgICAgICAgIDogdGhpcy5wYXJhbXNba2V5XTtcblxuICAgICAgdGhpcy5fZGVmbGF0ZSA9IHpsaWIuY3JlYXRlRGVmbGF0ZVJhdyh7XG4gICAgICAgIC4uLnRoaXMuX29wdGlvbnMuemxpYkRlZmxhdGVPcHRpb25zLFxuICAgICAgICB3aW5kb3dCaXRzXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fZGVmbGF0ZVtrVG90YWxMZW5ndGhdID0gMDtcbiAgICAgIHRoaXMuX2RlZmxhdGVba0J1ZmZlcnNdID0gW107XG5cbiAgICAgIHRoaXMuX2RlZmxhdGUub24oJ2RhdGEnLCBkZWZsYXRlT25EYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZWZsYXRlW2tDYWxsYmFja10gPSBjYWxsYmFjaztcblxuICAgIHRoaXMuX2RlZmxhdGUud3JpdGUoZGF0YSk7XG4gICAgdGhpcy5fZGVmbGF0ZS5mbHVzaCh6bGliLlpfU1lOQ19GTFVTSCwgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9kZWZsYXRlKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZSBkZWZsYXRlIHN0cmVhbSB3YXMgY2xvc2VkIHdoaWxlIGRhdGEgd2FzIGJlaW5nIHByb2Nlc3NlZC5cbiAgICAgICAgLy9cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YSA9IGJ1ZmZlclV0aWwuY29uY2F0KFxuICAgICAgICB0aGlzLl9kZWZsYXRlW2tCdWZmZXJzXSxcbiAgICAgICAgdGhpcy5fZGVmbGF0ZVtrVG90YWxMZW5ndGhdXG4gICAgICApO1xuXG4gICAgICBpZiAoZmluKSBkYXRhID0gZGF0YS5zbGljZSgwLCBkYXRhLmxlbmd0aCAtIDQpO1xuXG4gICAgICAvL1xuICAgICAgLy8gRW5zdXJlIHRoYXQgdGhlIGNhbGxiYWNrIHdpbGwgbm90IGJlIGNhbGxlZCBhZ2FpbiBpblxuICAgICAgLy8gYFBlck1lc3NhZ2VEZWZsYXRlI2NsZWFudXAoKWAuXG4gICAgICAvL1xuICAgICAgdGhpcy5fZGVmbGF0ZVtrQ2FsbGJhY2tdID0gbnVsbDtcblxuICAgICAgdGhpcy5fZGVmbGF0ZVtrVG90YWxMZW5ndGhdID0gMDtcbiAgICAgIHRoaXMuX2RlZmxhdGVba0J1ZmZlcnNdID0gW107XG5cbiAgICAgIGlmIChmaW4gJiYgdGhpcy5wYXJhbXNbYCR7ZW5kcG9pbnR9X25vX2NvbnRleHRfdGFrZW92ZXJgXSkge1xuICAgICAgICB0aGlzLl9kZWZsYXRlLnJlc2V0KCk7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGVyTWVzc2FnZURlZmxhdGU7XG5cbi8qKlxuICogVGhlIGxpc3RlbmVyIG9mIHRoZSBgemxpYi5EZWZsYXRlUmF3YCBzdHJlYW0gYCdkYXRhJ2AgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ9IGNodW5rIEEgY2h1bmsgb2YgZGF0YVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZGVmbGF0ZU9uRGF0YShjaHVuaykge1xuICB0aGlzW2tCdWZmZXJzXS5wdXNoKGNodW5rKTtcbiAgdGhpc1trVG90YWxMZW5ndGhdICs9IGNodW5rLmxlbmd0aDtcbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGB6bGliLkluZmxhdGVSYXdgIHN0cmVhbSBgJ2RhdGEnYCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gY2h1bmsgQSBjaHVuayBvZiBkYXRhXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpbmZsYXRlT25EYXRhKGNodW5rKSB7XG4gIHRoaXNba1RvdGFsTGVuZ3RoXSArPSBjaHVuay5sZW5ndGg7XG5cbiAgaWYgKFxuICAgIHRoaXNba1Blck1lc3NhZ2VEZWZsYXRlXS5fbWF4UGF5bG9hZCA8IDEgfHxcbiAgICB0aGlzW2tUb3RhbExlbmd0aF0gPD0gdGhpc1trUGVyTWVzc2FnZURlZmxhdGVdLl9tYXhQYXlsb2FkXG4gICkge1xuICAgIHRoaXNba0J1ZmZlcnNdLnB1c2goY2h1bmspO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXNba0Vycm9yXSA9IG5ldyBSYW5nZUVycm9yKCdNYXggcGF5bG9hZCBzaXplIGV4Y2VlZGVkJyk7XG4gIHRoaXNba0Vycm9yXS5jb2RlID0gJ1dTX0VSUl9VTlNVUFBPUlRFRF9NRVNTQUdFX0xFTkdUSCc7XG4gIHRoaXNba0Vycm9yXVtrU3RhdHVzQ29kZV0gPSAxMDA5O1xuICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgaW5mbGF0ZU9uRGF0YSk7XG4gIHRoaXMucmVzZXQoKTtcbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGB6bGliLkluZmxhdGVSYXdgIHN0cmVhbSBgJ2Vycm9yJ2AgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyIFRoZSBlbWl0dGVkIGVycm9yXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBpbmZsYXRlT25FcnJvcihlcnIpIHtcbiAgLy9cbiAgLy8gVGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGBabGliI2Nsb3NlKClgIGFzIHRoZSBoYW5kbGUgaXMgYXV0b21hdGljYWxseVxuICAvLyBjbG9zZWQgd2hlbiBhbiBlcnJvciBpcyBlbWl0dGVkLlxuICAvL1xuICB0aGlzW2tQZXJNZXNzYWdlRGVmbGF0ZV0uX2luZmxhdGUgPSBudWxsO1xuICBlcnJba1N0YXR1c0NvZGVdID0gMTAwNztcbiAgdGhpc1trQ2FsbGJhY2tdKGVycik7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vXG4vLyBBbGxvd2VkIHRva2VuIGNoYXJhY3RlcnM6XG4vL1xuLy8gJyEnLCAnIycsICckJywgJyUnLCAnJicsICcnJywgJyonLCAnKycsICctJyxcbi8vICcuJywgMC05LCBBLVosICdeJywgJ18nLCAnYCcsIGEteiwgJ3wnLCAnfidcbi8vXG4vLyB0b2tlbkNoYXJzWzMyXSA9PT0gMCAvLyAnICdcbi8vIHRva2VuQ2hhcnNbMzNdID09PSAxIC8vICchJ1xuLy8gdG9rZW5DaGFyc1szNF0gPT09IDAgLy8gJ1wiJ1xuLy8gLi4uXG4vL1xuLy8gcHJldHRpZXItaWdub3JlXG5jb25zdCB0b2tlbkNoYXJzID0gW1xuICAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAvLyAwIC0gMTVcbiAgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgLy8gMTYgLSAzMVxuICAwLCAxLCAwLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAxLCAxLCAwLCAxLCAxLCAwLCAvLyAzMiAtIDQ3XG4gIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIC8vIDQ4IC0gNjNcbiAgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgLy8gNjQgLSA3OVxuICAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAxLCAxLCAvLyA4MCAtIDk1XG4gIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIC8vIDk2IC0gMTExXG4gIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDEsIDAsIDEsIDAgLy8gMTEyIC0gMTI3XG5dO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YXR1cyBjb2RlIGlzIGFsbG93ZWQgaW4gYSBjbG9zZSBmcmFtZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gY29kZSBUaGUgc3RhdHVzIGNvZGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgc3RhdHVzIGNvZGUgaXMgdmFsaWQsIGVsc2UgYGZhbHNlYFxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBpc1ZhbGlkU3RhdHVzQ29kZShjb2RlKSB7XG4gIHJldHVybiAoXG4gICAgKGNvZGUgPj0gMTAwMCAmJlxuICAgICAgY29kZSA8PSAxMDE0ICYmXG4gICAgICBjb2RlICE9PSAxMDA0ICYmXG4gICAgICBjb2RlICE9PSAxMDA1ICYmXG4gICAgICBjb2RlICE9PSAxMDA2KSB8fFxuICAgIChjb2RlID49IDMwMDAgJiYgY29kZSA8PSA0OTk5KVxuICApO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGdpdmVuIGJ1ZmZlciBjb250YWlucyBvbmx5IGNvcnJlY3QgVVRGLTguXG4gKiBQb3J0ZWQgZnJvbSBodHRwczovL3d3dy5jbC5jYW0uYWMudWsvJTdFbWdrMjUvdWNzL3V0ZjhfY2hlY2suYyBieVxuICogTWFya3VzIEt1aG4uXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZiBUaGUgYnVmZmVyIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYGJ1ZmAgY29udGFpbnMgb25seSBjb3JyZWN0IFVURi04LCBlbHNlIGBmYWxzZWBcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gX2lzVmFsaWRVVEY4KGJ1Zikge1xuICBjb25zdCBsZW4gPSBidWYubGVuZ3RoO1xuICBsZXQgaSA9IDA7XG5cbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICBpZiAoKGJ1ZltpXSAmIDB4ODApID09PSAwKSB7XG4gICAgICAvLyAweHh4eHh4eFxuICAgICAgaSsrO1xuICAgIH0gZWxzZSBpZiAoKGJ1ZltpXSAmIDB4ZTApID09PSAweGMwKSB7XG4gICAgICAvLyAxMTB4eHh4eCAxMHh4eHh4eFxuICAgICAgaWYgKFxuICAgICAgICBpICsgMSA9PT0gbGVuIHx8XG4gICAgICAgIChidWZbaSArIDFdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgKGJ1ZltpXSAmIDB4ZmUpID09PSAweGMwIC8vIE92ZXJsb25nXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpICs9IDI7XG4gICAgfSBlbHNlIGlmICgoYnVmW2ldICYgMHhmMCkgPT09IDB4ZTApIHtcbiAgICAgIC8vIDExMTB4eHh4IDEweHh4eHh4IDEweHh4eHh4XG4gICAgICBpZiAoXG4gICAgICAgIGkgKyAyID49IGxlbiB8fFxuICAgICAgICAoYnVmW2kgKyAxXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIChidWZbaSArIDJdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgKGJ1ZltpXSA9PT0gMHhlMCAmJiAoYnVmW2kgKyAxXSAmIDB4ZTApID09PSAweDgwKSB8fCAvLyBPdmVybG9uZ1xuICAgICAgICAoYnVmW2ldID09PSAweGVkICYmIChidWZbaSArIDFdICYgMHhlMCkgPT09IDB4YTApIC8vIFN1cnJvZ2F0ZSAoVStEODAwIC0gVStERkZGKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaSArPSAzO1xuICAgIH0gZWxzZSBpZiAoKGJ1ZltpXSAmIDB4ZjgpID09PSAweGYwKSB7XG4gICAgICAvLyAxMTExMHh4eCAxMHh4eHh4eCAxMHh4eHh4eCAxMHh4eHh4eFxuICAgICAgaWYgKFxuICAgICAgICBpICsgMyA+PSBsZW4gfHxcbiAgICAgICAgKGJ1ZltpICsgMV0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICAoYnVmW2kgKyAyXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIChidWZbaSArIDNdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgKGJ1ZltpXSA9PT0gMHhmMCAmJiAoYnVmW2kgKyAxXSAmIDB4ZjApID09PSAweDgwKSB8fCAvLyBPdmVybG9uZ1xuICAgICAgICAoYnVmW2ldID09PSAweGY0ICYmIGJ1ZltpICsgMV0gPiAweDhmKSB8fFxuICAgICAgICBidWZbaV0gPiAweGY0IC8vID4gVSsxMEZGRkZcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGkgKz0gNDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG50cnkge1xuICBjb25zdCBpc1ZhbGlkVVRGOCA9IHJlcXVpcmUoJ3V0Zi04LXZhbGlkYXRlJyk7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNWYWxpZFN0YXR1c0NvZGUsXG4gICAgaXNWYWxpZFVURjgoYnVmKSB7XG4gICAgICByZXR1cm4gYnVmLmxlbmd0aCA8IDE1MCA/IF9pc1ZhbGlkVVRGOChidWYpIDogaXNWYWxpZFVURjgoYnVmKTtcbiAgICB9LFxuICAgIHRva2VuQ2hhcnNcbiAgfTtcbn0gY2F0Y2ggKGUpIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNWYWxpZFN0YXR1c0NvZGUsXG4gICAgaXNWYWxpZFVURjg6IF9pc1ZhbGlkVVRGOCxcbiAgICB0b2tlbkNoYXJzXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsgV3JpdGFibGUgfSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuXG5jb25zdCBQZXJNZXNzYWdlRGVmbGF0ZSA9IHJlcXVpcmUoJy4vcGVybWVzc2FnZS1kZWZsYXRlJyk7XG5jb25zdCB7XG4gIEJJTkFSWV9UWVBFUyxcbiAgRU1QVFlfQlVGRkVSLFxuICBrU3RhdHVzQ29kZSxcbiAga1dlYlNvY2tldFxufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5jb25zdCB7IGNvbmNhdCwgdG9BcnJheUJ1ZmZlciwgdW5tYXNrIH0gPSByZXF1aXJlKCcuL2J1ZmZlci11dGlsJyk7XG5jb25zdCB7IGlzVmFsaWRTdGF0dXNDb2RlLCBpc1ZhbGlkVVRGOCB9ID0gcmVxdWlyZSgnLi92YWxpZGF0aW9uJyk7XG5cbmNvbnN0IEdFVF9JTkZPID0gMDtcbmNvbnN0IEdFVF9QQVlMT0FEX0xFTkdUSF8xNiA9IDE7XG5jb25zdCBHRVRfUEFZTE9BRF9MRU5HVEhfNjQgPSAyO1xuY29uc3QgR0VUX01BU0sgPSAzO1xuY29uc3QgR0VUX0RBVEEgPSA0O1xuY29uc3QgSU5GTEFUSU5HID0gNTtcblxuLyoqXG4gKiBIeUJpIFJlY2VpdmVyIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBleHRlbmRzIFdyaXRhYmxlXG4gKi9cbmNsYXNzIFJlY2VpdmVyIGV4dGVuZHMgV3JpdGFibGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIFJlY2VpdmVyIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbnMgb2JqZWN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5iaW5hcnlUeXBlPW5vZGVidWZmZXJdIFRoZSB0eXBlIGZvciBiaW5hcnkgZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZXh0ZW5zaW9uc10gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5lZ290aWF0ZWRcbiAgICogICAgIGV4dGVuc2lvbnNcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pc1NlcnZlcj1mYWxzZV0gU3BlY2lmaWVzIHdoZXRoZXIgdG8gb3BlcmF0ZSBpblxuICAgKiAgICAgY2xpZW50IG9yIHNlcnZlciBtb2RlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhQYXlsb2FkPTBdIFRoZSBtYXhpbXVtIGFsbG93ZWQgbWVzc2FnZSBsZW5ndGhcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5za2lwVVRGOFZhbGlkYXRpb249ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yXG4gICAqICAgICBub3QgdG8gc2tpcCBVVEYtOCB2YWxpZGF0aW9uIGZvciB0ZXh0IGFuZCBjbG9zZSBtZXNzYWdlc1xuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2JpbmFyeVR5cGUgPSBvcHRpb25zLmJpbmFyeVR5cGUgfHwgQklOQVJZX1RZUEVTWzBdO1xuICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBvcHRpb25zLmV4dGVuc2lvbnMgfHwge307XG4gICAgdGhpcy5faXNTZXJ2ZXIgPSAhIW9wdGlvbnMuaXNTZXJ2ZXI7XG4gICAgdGhpcy5fbWF4UGF5bG9hZCA9IG9wdGlvbnMubWF4UGF5bG9hZCB8IDA7XG4gICAgdGhpcy5fc2tpcFVURjhWYWxpZGF0aW9uID0gISFvcHRpb25zLnNraXBVVEY4VmFsaWRhdGlvbjtcbiAgICB0aGlzW2tXZWJTb2NrZXRdID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5fYnVmZmVyZWRCeXRlcyA9IDA7XG4gICAgdGhpcy5fYnVmZmVycyA9IFtdO1xuXG4gICAgdGhpcy5fY29tcHJlc3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BheWxvYWRMZW5ndGggPSAwO1xuICAgIHRoaXMuX21hc2sgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZnJhZ21lbnRlZCA9IDA7XG4gICAgdGhpcy5fbWFza2VkID0gZmFsc2U7XG4gICAgdGhpcy5fZmluID0gZmFsc2U7XG4gICAgdGhpcy5fb3Bjb2RlID0gMDtcblxuICAgIHRoaXMuX3RvdGFsUGF5bG9hZExlbmd0aCA9IDA7XG4gICAgdGhpcy5fbWVzc2FnZUxlbmd0aCA9IDA7XG4gICAgdGhpcy5fZnJhZ21lbnRzID0gW107XG5cbiAgICB0aGlzLl9zdGF0ZSA9IEdFVF9JTkZPO1xuICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRzIGBXcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlKClgLlxuICAgKlxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gY2h1bmsgVGhlIGNodW5rIG9mIGRhdGEgdG8gd3JpdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVuY29kaW5nIFRoZSBjaGFyYWN0ZXIgZW5jb2Rpbmcgb2YgYGNodW5rYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3dyaXRlKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgICBpZiAodGhpcy5fb3Bjb2RlID09PSAweDA4ICYmIHRoaXMuX3N0YXRlID09IEdFVF9JTkZPKSByZXR1cm4gY2IoKTtcblxuICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZXMgKz0gY2h1bmsubGVuZ3RoO1xuICAgIHRoaXMuX2J1ZmZlcnMucHVzaChjaHVuayk7XG4gICAgdGhpcy5zdGFydExvb3AoY2IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN1bWVzIGBuYCBieXRlcyBmcm9tIHRoZSBidWZmZXJlZCBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGJ5dGVzIHRvIGNvbnN1bWVcbiAgICogQHJldHVybiB7QnVmZmVyfSBUaGUgY29uc3VtZWQgYnl0ZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN1bWUobikge1xuICAgIHRoaXMuX2J1ZmZlcmVkQnl0ZXMgLT0gbjtcblxuICAgIGlmIChuID09PSB0aGlzLl9idWZmZXJzWzBdLmxlbmd0aCkgcmV0dXJuIHRoaXMuX2J1ZmZlcnMuc2hpZnQoKTtcblxuICAgIGlmIChuIDwgdGhpcy5fYnVmZmVyc1swXS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGJ1ZiA9IHRoaXMuX2J1ZmZlcnNbMF07XG4gICAgICB0aGlzLl9idWZmZXJzWzBdID0gYnVmLnNsaWNlKG4pO1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwLCBuKTtcbiAgICB9XG5cbiAgICBjb25zdCBkc3QgPSBCdWZmZXIuYWxsb2NVbnNhZmUobik7XG5cbiAgICBkbyB7XG4gICAgICBjb25zdCBidWYgPSB0aGlzLl9idWZmZXJzWzBdO1xuICAgICAgY29uc3Qgb2Zmc2V0ID0gZHN0Lmxlbmd0aCAtIG47XG5cbiAgICAgIGlmIChuID49IGJ1Zi5sZW5ndGgpIHtcbiAgICAgICAgZHN0LnNldCh0aGlzLl9idWZmZXJzLnNoaWZ0KCksIG9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkc3Quc2V0KG5ldyBVaW50OEFycmF5KGJ1Zi5idWZmZXIsIGJ1Zi5ieXRlT2Zmc2V0LCBuKSwgb2Zmc2V0KTtcbiAgICAgICAgdGhpcy5fYnVmZmVyc1swXSA9IGJ1Zi5zbGljZShuKTtcbiAgICAgIH1cblxuICAgICAgbiAtPSBidWYubGVuZ3RoO1xuICAgIH0gd2hpbGUgKG4gPiAwKTtcblxuICAgIHJldHVybiBkc3Q7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBwYXJzaW5nIGxvb3AuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIENhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydExvb3AoY2IpIHtcbiAgICBsZXQgZXJyO1xuICAgIHRoaXMuX2xvb3AgPSB0cnVlO1xuXG4gICAgZG8ge1xuICAgICAgc3dpdGNoICh0aGlzLl9zdGF0ZSkge1xuICAgICAgICBjYXNlIEdFVF9JTkZPOlxuICAgICAgICAgIGVyciA9IHRoaXMuZ2V0SW5mbygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEdFVF9QQVlMT0FEX0xFTkdUSF8xNjpcbiAgICAgICAgICBlcnIgPSB0aGlzLmdldFBheWxvYWRMZW5ndGgxNigpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEdFVF9QQVlMT0FEX0xFTkdUSF82NDpcbiAgICAgICAgICBlcnIgPSB0aGlzLmdldFBheWxvYWRMZW5ndGg2NCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEdFVF9NQVNLOlxuICAgICAgICAgIHRoaXMuZ2V0TWFzaygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEdFVF9EQVRBOlxuICAgICAgICAgIGVyciA9IHRoaXMuZ2V0RGF0YShjYik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gYElORkxBVElOR2BcbiAgICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRoaXMuX2xvb3ApO1xuXG4gICAgY2IoZXJyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgZmlyc3QgdHdvIGJ5dGVzIG9mIGEgZnJhbWUuXG4gICAqXG4gICAqIEByZXR1cm4geyhSYW5nZUVycm9yfHVuZGVmaW5lZCl9IEEgcG9zc2libGUgZXJyb3JcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldEluZm8oKSB7XG4gICAgaWYgKHRoaXMuX2J1ZmZlcmVkQnl0ZXMgPCAyKSB7XG4gICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnVmID0gdGhpcy5jb25zdW1lKDIpO1xuXG4gICAgaWYgKChidWZbMF0gJiAweDMwKSAhPT0gMHgwMCkge1xuICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAnUlNWMiBhbmQgUlNWMyBtdXN0IGJlIGNsZWFyJyxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgMTAwMixcbiAgICAgICAgJ1dTX0VSUl9VTkVYUEVDVEVEX1JTVl8yXzMnXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXByZXNzZWQgPSAoYnVmWzBdICYgMHg0MCkgPT09IDB4NDA7XG5cbiAgICBpZiAoY29tcHJlc3NlZCAmJiAhdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXSkge1xuICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAnUlNWMSBtdXN0IGJlIGNsZWFyJyxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgMTAwMixcbiAgICAgICAgJ1dTX0VSUl9VTkVYUEVDVEVEX1JTVl8xJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9maW4gPSAoYnVmWzBdICYgMHg4MCkgPT09IDB4ODA7XG4gICAgdGhpcy5fb3Bjb2RlID0gYnVmWzBdICYgMHgwZjtcbiAgICB0aGlzLl9wYXlsb2FkTGVuZ3RoID0gYnVmWzFdICYgMHg3ZjtcblxuICAgIGlmICh0aGlzLl9vcGNvZGUgPT09IDB4MDApIHtcbiAgICAgIGlmIChjb21wcmVzc2VkKSB7XG4gICAgICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICAgJ1JTVjEgbXVzdCBiZSBjbGVhcicsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAxMDAyLFxuICAgICAgICAgICdXU19FUlJfVU5FWFBFQ1RFRF9SU1ZfMSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9mcmFnbWVudGVkKSB7XG4gICAgICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICAgJ2ludmFsaWQgb3Bjb2RlIDAnLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICAgMTAwMixcbiAgICAgICAgICAnV1NfRVJSX0lOVkFMSURfT1BDT0RFJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9vcGNvZGUgPSB0aGlzLl9mcmFnbWVudGVkO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fb3Bjb2RlID09PSAweDAxIHx8IHRoaXMuX29wY29kZSA9PT0gMHgwMikge1xuICAgICAgaWYgKHRoaXMuX2ZyYWdtZW50ZWQpIHtcbiAgICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgUmFuZ2VFcnJvcixcbiAgICAgICAgICBgaW52YWxpZCBvcGNvZGUgJHt0aGlzLl9vcGNvZGV9YCxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICAgIDEwMDIsXG4gICAgICAgICAgJ1dTX0VSUl9JTlZBTElEX09QQ09ERSdcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29tcHJlc3NlZCA9IGNvbXByZXNzZWQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9vcGNvZGUgPiAweDA3ICYmIHRoaXMuX29wY29kZSA8IDB4MGIpIHtcbiAgICAgIGlmICghdGhpcy5fZmluKSB7XG4gICAgICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICAgJ0ZJTiBtdXN0IGJlIHNldCcsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAxMDAyLFxuICAgICAgICAgICdXU19FUlJfRVhQRUNURURfRklOJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29tcHJlc3NlZCkge1xuICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAgICdSU1YxIG11c3QgYmUgY2xlYXInLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICAgMTAwMixcbiAgICAgICAgICAnV1NfRVJSX1VORVhQRUNURURfUlNWXzEnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wYXlsb2FkTGVuZ3RoID4gMHg3ZCkge1xuICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAgIGBpbnZhbGlkIHBheWxvYWQgbGVuZ3RoICR7dGhpcy5fcGF5bG9hZExlbmd0aH1gLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICAgMTAwMixcbiAgICAgICAgICAnV1NfRVJSX0lOVkFMSURfQ09OVFJPTF9QQVlMT0FEX0xFTkdUSCdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICBgaW52YWxpZCBvcGNvZGUgJHt0aGlzLl9vcGNvZGV9YCxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgMTAwMixcbiAgICAgICAgJ1dTX0VSUl9JTlZBTElEX09QQ09ERSdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9maW4gJiYgIXRoaXMuX2ZyYWdtZW50ZWQpIHRoaXMuX2ZyYWdtZW50ZWQgPSB0aGlzLl9vcGNvZGU7XG4gICAgdGhpcy5fbWFza2VkID0gKGJ1ZlsxXSAmIDB4ODApID09PSAweDgwO1xuXG4gICAgaWYgKHRoaXMuX2lzU2VydmVyKSB7XG4gICAgICBpZiAoIXRoaXMuX21hc2tlZCkge1xuICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAgICdNQVNLIG11c3QgYmUgc2V0JyxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICAgIDEwMDIsXG4gICAgICAgICAgJ1dTX0VSUl9FWFBFQ1RFRF9NQVNLJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fbWFza2VkKSB7XG4gICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICdNQVNLIG11c3QgYmUgY2xlYXInLFxuICAgICAgICB0cnVlLFxuICAgICAgICAxMDAyLFxuICAgICAgICAnV1NfRVJSX1VORVhQRUNURURfTUFTSydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BheWxvYWRMZW5ndGggPT09IDEyNikgdGhpcy5fc3RhdGUgPSBHRVRfUEFZTE9BRF9MRU5HVEhfMTY7XG4gICAgZWxzZSBpZiAodGhpcy5fcGF5bG9hZExlbmd0aCA9PT0gMTI3KSB0aGlzLl9zdGF0ZSA9IEdFVF9QQVlMT0FEX0xFTkdUSF82NDtcbiAgICBlbHNlIHJldHVybiB0aGlzLmhhdmVMZW5ndGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGV4dGVuZGVkIHBheWxvYWQgbGVuZ3RoICg3KzE2KS5cbiAgICpcbiAgICogQHJldHVybiB7KFJhbmdlRXJyb3J8dW5kZWZpbmVkKX0gQSBwb3NzaWJsZSBlcnJvclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0UGF5bG9hZExlbmd0aDE2KCkge1xuICAgIGlmICh0aGlzLl9idWZmZXJlZEJ5dGVzIDwgMikge1xuICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BheWxvYWRMZW5ndGggPSB0aGlzLmNvbnN1bWUoMikucmVhZFVJbnQxNkJFKDApO1xuICAgIHJldHVybiB0aGlzLmhhdmVMZW5ndGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGV4dGVuZGVkIHBheWxvYWQgbGVuZ3RoICg3KzY0KS5cbiAgICpcbiAgICogQHJldHVybiB7KFJhbmdlRXJyb3J8dW5kZWZpbmVkKX0gQSBwb3NzaWJsZSBlcnJvclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0UGF5bG9hZExlbmd0aDY0KCkge1xuICAgIGlmICh0aGlzLl9idWZmZXJlZEJ5dGVzIDwgOCkge1xuICAgICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZiA9IHRoaXMuY29uc3VtZSg4KTtcbiAgICBjb25zdCBudW0gPSBidWYucmVhZFVJbnQzMkJFKDApO1xuXG4gICAgLy9cbiAgICAvLyBUaGUgbWF4aW11bSBzYWZlIGludGVnZXIgaW4gSmF2YVNjcmlwdCBpcyAyXjUzIC0gMS4gQW4gZXJyb3IgaXMgcmV0dXJuZWRcbiAgICAvLyBpZiBwYXlsb2FkIGxlbmd0aCBpcyBncmVhdGVyIHRoYW4gdGhpcyBudW1iZXIuXG4gICAgLy9cbiAgICBpZiAobnVtID4gTWF0aC5wb3coMiwgNTMgLSAzMikgLSAxKSB7XG4gICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICdVbnN1cHBvcnRlZCBXZWJTb2NrZXQgZnJhbWU6IHBheWxvYWQgbGVuZ3RoID4gMl41MyAtIDEnLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgMTAwOSxcbiAgICAgICAgJ1dTX0VSUl9VTlNVUFBPUlRFRF9EQVRBX1BBWUxPQURfTEVOR1RIJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXlsb2FkTGVuZ3RoID0gbnVtICogTWF0aC5wb3coMiwgMzIpICsgYnVmLnJlYWRVSW50MzJCRSg0KTtcbiAgICByZXR1cm4gdGhpcy5oYXZlTGVuZ3RoKCk7XG4gIH1cblxuICAvKipcbiAgICogUGF5bG9hZCBsZW5ndGggaGFzIGJlZW4gcmVhZC5cbiAgICpcbiAgICogQHJldHVybiB7KFJhbmdlRXJyb3J8dW5kZWZpbmVkKX0gQSBwb3NzaWJsZSBlcnJvclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGF2ZUxlbmd0aCgpIHtcbiAgICBpZiAodGhpcy5fcGF5bG9hZExlbmd0aCAmJiB0aGlzLl9vcGNvZGUgPCAweDA4KSB7XG4gICAgICB0aGlzLl90b3RhbFBheWxvYWRMZW5ndGggKz0gdGhpcy5fcGF5bG9hZExlbmd0aDtcbiAgICAgIGlmICh0aGlzLl90b3RhbFBheWxvYWRMZW5ndGggPiB0aGlzLl9tYXhQYXlsb2FkICYmIHRoaXMuX21heFBheWxvYWQgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICAgJ01heCBwYXlsb2FkIHNpemUgZXhjZWVkZWQnLFxuICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgIDEwMDksXG4gICAgICAgICAgJ1dTX0VSUl9VTlNVUFBPUlRFRF9NRVNTQUdFX0xFTkdUSCdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbWFza2VkKSB0aGlzLl9zdGF0ZSA9IEdFVF9NQVNLO1xuICAgIGVsc2UgdGhpcy5fc3RhdGUgPSBHRVRfREFUQTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyBtYXNrIGJ5dGVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0TWFzaygpIHtcbiAgICBpZiAodGhpcy5fYnVmZmVyZWRCeXRlcyA8IDQpIHtcbiAgICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9tYXNrID0gdGhpcy5jb25zdW1lKDQpO1xuICAgIHRoaXMuX3N0YXRlID0gR0VUX0RBVEE7XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgZGF0YSBieXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgQ2FsbGJhY2tcbiAgICogQHJldHVybiB7KEVycm9yfFJhbmdlRXJyb3J8dW5kZWZpbmVkKX0gQSBwb3NzaWJsZSBlcnJvclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0RGF0YShjYikge1xuICAgIGxldCBkYXRhID0gRU1QVFlfQlVGRkVSO1xuXG4gICAgaWYgKHRoaXMuX3BheWxvYWRMZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLl9idWZmZXJlZEJ5dGVzIDwgdGhpcy5fcGF5bG9hZExlbmd0aCkge1xuICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGF0YSA9IHRoaXMuY29uc3VtZSh0aGlzLl9wYXlsb2FkTGVuZ3RoKTtcblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9tYXNrZWQgJiZcbiAgICAgICAgKHRoaXMuX21hc2tbMF0gfCB0aGlzLl9tYXNrWzFdIHwgdGhpcy5fbWFza1syXSB8IHRoaXMuX21hc2tbM10pICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgdW5tYXNrKGRhdGEsIHRoaXMuX21hc2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcGNvZGUgPiAweDA3KSByZXR1cm4gdGhpcy5jb250cm9sTWVzc2FnZShkYXRhKTtcblxuICAgIGlmICh0aGlzLl9jb21wcmVzc2VkKSB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IElORkxBVElORztcbiAgICAgIHRoaXMuZGVjb21wcmVzcyhkYXRhLCBjYik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubGVuZ3RoKSB7XG4gICAgICAvL1xuICAgICAgLy8gVGhpcyBtZXNzYWdlIGlzIG5vdCBjb21wcmVzc2VkIHNvIGl0cyBsZW5ndGggaXMgdGhlIHN1bSBvZiB0aGUgcGF5bG9hZFxuICAgICAgLy8gbGVuZ3RoIG9mIGFsbCBmcmFnbWVudHMuXG4gICAgICAvL1xuICAgICAgdGhpcy5fbWVzc2FnZUxlbmd0aCA9IHRoaXMuX3RvdGFsUGF5bG9hZExlbmd0aDtcbiAgICAgIHRoaXMuX2ZyYWdtZW50cy5wdXNoKGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRhdGFNZXNzYWdlKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVjb21wcmVzc2VzIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIENvbXByZXNzZWQgZGF0YVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjb21wcmVzcyhkYXRhLCBjYikge1xuICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXTtcblxuICAgIHBlck1lc3NhZ2VEZWZsYXRlLmRlY29tcHJlc3MoZGF0YSwgdGhpcy5fZmluLCAoZXJyLCBidWYpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICBpZiAoYnVmLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9tZXNzYWdlTGVuZ3RoICs9IGJ1Zi5sZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLl9tZXNzYWdlTGVuZ3RoID4gdGhpcy5fbWF4UGF5bG9hZCAmJiB0aGlzLl9tYXhQYXlsb2FkID4gMCkge1xuICAgICAgICAgIHJldHVybiBjYihcbiAgICAgICAgICAgIGVycm9yKFxuICAgICAgICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAgICAgICAnTWF4IHBheWxvYWQgc2l6ZSBleGNlZWRlZCcsXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAxMDA5LFxuICAgICAgICAgICAgICAnV1NfRVJSX1VOU1VQUE9SVEVEX01FU1NBR0VfTEVOR1RIJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mcmFnbWVudHMucHVzaChidWYpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlciA9IHRoaXMuZGF0YU1lc3NhZ2UoKTtcbiAgICAgIGlmIChlcikgcmV0dXJuIGNiKGVyKTtcblxuICAgICAgdGhpcy5zdGFydExvb3AoY2IpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBkYXRhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEByZXR1cm4geyhFcnJvcnx1bmRlZmluZWQpfSBBIHBvc3NpYmxlIGVycm9yXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkYXRhTWVzc2FnZSgpIHtcbiAgICBpZiAodGhpcy5fZmluKSB7XG4gICAgICBjb25zdCBtZXNzYWdlTGVuZ3RoID0gdGhpcy5fbWVzc2FnZUxlbmd0aDtcbiAgICAgIGNvbnN0IGZyYWdtZW50cyA9IHRoaXMuX2ZyYWdtZW50cztcblxuICAgICAgdGhpcy5fdG90YWxQYXlsb2FkTGVuZ3RoID0gMDtcbiAgICAgIHRoaXMuX21lc3NhZ2VMZW5ndGggPSAwO1xuICAgICAgdGhpcy5fZnJhZ21lbnRlZCA9IDA7XG4gICAgICB0aGlzLl9mcmFnbWVudHMgPSBbXTtcblxuICAgICAgaWYgKHRoaXMuX29wY29kZSA9PT0gMikge1xuICAgICAgICBsZXQgZGF0YTtcblxuICAgICAgICBpZiAodGhpcy5fYmluYXJ5VHlwZSA9PT0gJ25vZGVidWZmZXInKSB7XG4gICAgICAgICAgZGF0YSA9IGNvbmNhdChmcmFnbWVudHMsIG1lc3NhZ2VMZW5ndGgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JpbmFyeVR5cGUgPT09ICdhcnJheWJ1ZmZlcicpIHtcbiAgICAgICAgICBkYXRhID0gdG9BcnJheUJ1ZmZlcihjb25jYXQoZnJhZ21lbnRzLCBtZXNzYWdlTGVuZ3RoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGZyYWdtZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIGRhdGEsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgYnVmID0gY29uY2F0KGZyYWdtZW50cywgbWVzc2FnZUxlbmd0aCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9za2lwVVRGOFZhbGlkYXRpb24gJiYgIWlzVmFsaWRVVEY4KGJ1ZikpIHtcbiAgICAgICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgRXJyb3IsXG4gICAgICAgICAgICAnaW52YWxpZCBVVEYtOCBzZXF1ZW5jZScsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgMTAwNyxcbiAgICAgICAgICAgICdXU19FUlJfSU5WQUxJRF9VVEY4J1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBidWYsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zdGF0ZSA9IEdFVF9JTkZPO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgYSBjb250cm9sIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhIERhdGEgdG8gaGFuZGxlXG4gICAqIEByZXR1cm4geyhFcnJvcnxSYW5nZUVycm9yfHVuZGVmaW5lZCl9IEEgcG9zc2libGUgZXJyb3JcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnRyb2xNZXNzYWdlKGRhdGEpIHtcbiAgICBpZiAodGhpcy5fb3Bjb2RlID09PSAweDA4KSB7XG4gICAgICB0aGlzLl9sb29wID0gZmFsc2U7XG5cbiAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmVtaXQoJ2NvbmNsdWRlJywgMTAwNSwgRU1QVFlfQlVGRkVSKTtcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgIFJhbmdlRXJyb3IsXG4gICAgICAgICAgJ2ludmFsaWQgcGF5bG9hZCBsZW5ndGggMScsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAxMDAyLFxuICAgICAgICAgICdXU19FUlJfSU5WQUxJRF9DT05UUk9MX1BBWUxPQURfTEVOR1RIJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY29kZSA9IGRhdGEucmVhZFVJbnQxNkJFKDApO1xuXG4gICAgICAgIGlmICghaXNWYWxpZFN0YXR1c0NvZGUoY29kZSkpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICBSYW5nZUVycm9yLFxuICAgICAgICAgICAgYGludmFsaWQgc3RhdHVzIGNvZGUgJHtjb2RlfWAsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgMTAwMixcbiAgICAgICAgICAgICdXU19FUlJfSU5WQUxJRF9DTE9TRV9DT0RFJ1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBidWYgPSBkYXRhLnNsaWNlKDIpO1xuXG4gICAgICAgIGlmICghdGhpcy5fc2tpcFVURjhWYWxpZGF0aW9uICYmICFpc1ZhbGlkVVRGOChidWYpKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yKFxuICAgICAgICAgICAgRXJyb3IsXG4gICAgICAgICAgICAnaW52YWxpZCBVVEYtOCBzZXF1ZW5jZScsXG4gICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgMTAwNyxcbiAgICAgICAgICAgICdXU19FUlJfSU5WQUxJRF9VVEY4J1xuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoJ2NvbmNsdWRlJywgY29kZSwgYnVmKTtcbiAgICAgICAgdGhpcy5lbmQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX29wY29kZSA9PT0gMHgwOSkge1xuICAgICAgdGhpcy5lbWl0KCdwaW5nJywgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgncG9uZycsIGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0YXRlID0gR0VUX0lORk87XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZWNlaXZlcjtcblxuLyoqXG4gKiBCdWlsZHMgYW4gZXJyb3Igb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24obmV3OkVycm9yfFJhbmdlRXJyb3IpfSBFcnJvckN0b3IgVGhlIGVycm9yIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZVxuICogQHBhcmFtIHtCb29sZWFufSBwcmVmaXggU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIGFkZCBhIGRlZmF1bHQgcHJlZml4IHRvXG4gKiAgICAgYG1lc3NhZ2VgXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzQ29kZSBUaGUgc3RhdHVzIGNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvckNvZGUgVGhlIGV4cG9zZWQgZXJyb3IgY29kZVxuICogQHJldHVybiB7KEVycm9yfFJhbmdlRXJyb3IpfSBUaGUgZXJyb3JcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGVycm9yKEVycm9yQ3RvciwgbWVzc2FnZSwgcHJlZml4LCBzdGF0dXNDb2RlLCBlcnJvckNvZGUpIHtcbiAgY29uc3QgZXJyID0gbmV3IEVycm9yQ3RvcihcbiAgICBwcmVmaXggPyBgSW52YWxpZCBXZWJTb2NrZXQgZnJhbWU6ICR7bWVzc2FnZX1gIDogbWVzc2FnZVxuICApO1xuXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGVyciwgZXJyb3IpO1xuICBlcnIuY29kZSA9IGVycm9yQ29kZTtcbiAgZXJyW2tTdGF0dXNDb2RlXSA9IHN0YXR1c0NvZGU7XG4gIHJldHVybiBlcnI7XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFtcImVycm9yXCIsIHsgXCJ2YXJzSWdub3JlUGF0dGVyblwiOiBcIl5uZXR8dGxzJFwiIH1dICovXG5cbid1c2Ugc3RyaWN0JztcblxuY29uc3QgbmV0ID0gcmVxdWlyZSgnbmV0Jyk7XG5jb25zdCB0bHMgPSByZXF1aXJlKCd0bHMnKTtcbmNvbnN0IHsgcmFuZG9tRmlsbFN5bmMgfSA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5jb25zdCBQZXJNZXNzYWdlRGVmbGF0ZSA9IHJlcXVpcmUoJy4vcGVybWVzc2FnZS1kZWZsYXRlJyk7XG5jb25zdCB7IEVNUFRZX0JVRkZFUiB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbmNvbnN0IHsgaXNWYWxpZFN0YXR1c0NvZGUgfSA9IHJlcXVpcmUoJy4vdmFsaWRhdGlvbicpO1xuY29uc3QgeyBtYXNrOiBhcHBseU1hc2ssIHRvQnVmZmVyIH0gPSByZXF1aXJlKCcuL2J1ZmZlci11dGlsJyk7XG5cbmNvbnN0IGtCeXRlTGVuZ3RoID0gU3ltYm9sKCdrQnl0ZUxlbmd0aCcpO1xuY29uc3QgbWFza0J1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KTtcblxuLyoqXG4gKiBIeUJpIFNlbmRlciBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuY2xhc3MgU2VuZGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBTZW5kZXIgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7KG5ldC5Tb2NrZXR8dGxzLlNvY2tldCl9IHNvY2tldCBUaGUgY29ubmVjdGlvbiBzb2NrZXRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtleHRlbnNpb25zXSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgbmVnb3RpYXRlZCBleHRlbnNpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtnZW5lcmF0ZU1hc2tdIFRoZSBmdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIHRoZSBtYXNraW5nXG4gICAqICAgICBrZXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNvY2tldCwgZXh0ZW5zaW9ucywgZ2VuZXJhdGVNYXNrKSB7XG4gICAgdGhpcy5fZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnMgfHwge307XG5cbiAgICBpZiAoZ2VuZXJhdGVNYXNrKSB7XG4gICAgICB0aGlzLl9nZW5lcmF0ZU1hc2sgPSBnZW5lcmF0ZU1hc2s7XG4gICAgICB0aGlzLl9tYXNrQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpO1xuICAgIH1cblxuICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcblxuICAgIHRoaXMuX2ZpcnN0RnJhZ21lbnQgPSB0cnVlO1xuICAgIHRoaXMuX2NvbXByZXNzID0gZmFsc2U7XG5cbiAgICB0aGlzLl9idWZmZXJlZEJ5dGVzID0gMDtcbiAgICB0aGlzLl9kZWZsYXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEZyYW1lcyBhIHBpZWNlIG9mIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBIeUJpIFdlYlNvY2tldCBwcm90b2NvbC5cbiAgICpcbiAgICogQHBhcmFtIHsoQnVmZmVyfFN0cmluZyl9IGRhdGEgVGhlIGRhdGEgdG8gZnJhbWVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3RcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maW49ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBzZXQgdGhlXG4gICAqICAgICBGSU4gYml0XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmdlbmVyYXRlTWFza10gVGhlIGZ1bmN0aW9uIHVzZWQgdG8gZ2VuZXJhdGUgdGhlXG4gICAqICAgICBtYXNraW5nIGtleVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm1hc2s9ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrXG4gICAqICAgICBgZGF0YWBcbiAgICogQHBhcmFtIHtCdWZmZXJ9IFtvcHRpb25zLm1hc2tCdWZmZXJdIFRoZSBidWZmZXIgdXNlZCB0byBzdG9yZSB0aGUgbWFza2luZ1xuICAgKiAgICAga2V5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm9wY29kZSBUaGUgb3Bjb2RlXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVhZE9ubHk9ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIGBkYXRhYCBjYW4gYmVcbiAgICogICAgIG1vZGlmaWVkXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucnN2MT1mYWxzZV0gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvIHNldCB0aGVcbiAgICogICAgIFJTVjEgYml0XG4gICAqIEByZXR1cm4geyhCdWZmZXJ8U3RyaW5nKVtdfSBUaGUgZnJhbWVkIGRhdGFcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGZyYW1lKGRhdGEsIG9wdGlvbnMpIHtcbiAgICBsZXQgbWFzaztcbiAgICBsZXQgbWVyZ2UgPSBmYWxzZTtcbiAgICBsZXQgb2Zmc2V0ID0gMjtcbiAgICBsZXQgc2tpcE1hc2tpbmcgPSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zLm1hc2spIHtcbiAgICAgIG1hc2sgPSBvcHRpb25zLm1hc2tCdWZmZXIgfHwgbWFza0J1ZmZlcjtcblxuICAgICAgaWYgKG9wdGlvbnMuZ2VuZXJhdGVNYXNrKSB7XG4gICAgICAgIG9wdGlvbnMuZ2VuZXJhdGVNYXNrKG1hc2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmFuZG9tRmlsbFN5bmMobWFzaywgMCwgNCk7XG4gICAgICB9XG5cbiAgICAgIHNraXBNYXNraW5nID0gKG1hc2tbMF0gfCBtYXNrWzFdIHwgbWFza1syXSB8IG1hc2tbM10pID09PSAwO1xuICAgICAgb2Zmc2V0ID0gNjtcbiAgICB9XG5cbiAgICBsZXQgZGF0YUxlbmd0aDtcblxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKCFvcHRpb25zLm1hc2sgfHwgc2tpcE1hc2tpbmcpICYmXG4gICAgICAgIG9wdGlvbnNba0J5dGVMZW5ndGhdICE9PSB1bmRlZmluZWRcbiAgICAgICkge1xuICAgICAgICBkYXRhTGVuZ3RoID0gb3B0aW9uc1trQnl0ZUxlbmd0aF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXRhID0gQnVmZmVyLmZyb20oZGF0YSk7XG4gICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgbWVyZ2UgPSBvcHRpb25zLm1hc2sgJiYgb3B0aW9ucy5yZWFkT25seSAmJiAhc2tpcE1hc2tpbmc7XG4gICAgfVxuXG4gICAgbGV0IHBheWxvYWRMZW5ndGggPSBkYXRhTGVuZ3RoO1xuXG4gICAgaWYgKGRhdGFMZW5ndGggPj0gNjU1MzYpIHtcbiAgICAgIG9mZnNldCArPSA4O1xuICAgICAgcGF5bG9hZExlbmd0aCA9IDEyNztcbiAgICB9IGVsc2UgaWYgKGRhdGFMZW5ndGggPiAxMjUpIHtcbiAgICAgIG9mZnNldCArPSAyO1xuICAgICAgcGF5bG9hZExlbmd0aCA9IDEyNjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXQgPSBCdWZmZXIuYWxsb2NVbnNhZmUobWVyZ2UgPyBkYXRhTGVuZ3RoICsgb2Zmc2V0IDogb2Zmc2V0KTtcblxuICAgIHRhcmdldFswXSA9IG9wdGlvbnMuZmluID8gb3B0aW9ucy5vcGNvZGUgfCAweDgwIDogb3B0aW9ucy5vcGNvZGU7XG4gICAgaWYgKG9wdGlvbnMucnN2MSkgdGFyZ2V0WzBdIHw9IDB4NDA7XG5cbiAgICB0YXJnZXRbMV0gPSBwYXlsb2FkTGVuZ3RoO1xuXG4gICAgaWYgKHBheWxvYWRMZW5ndGggPT09IDEyNikge1xuICAgICAgdGFyZ2V0LndyaXRlVUludDE2QkUoZGF0YUxlbmd0aCwgMik7XG4gICAgfSBlbHNlIGlmIChwYXlsb2FkTGVuZ3RoID09PSAxMjcpIHtcbiAgICAgIHRhcmdldFsyXSA9IHRhcmdldFszXSA9IDA7XG4gICAgICB0YXJnZXQud3JpdGVVSW50QkUoZGF0YUxlbmd0aCwgNCwgNik7XG4gICAgfVxuXG4gICAgaWYgKCFvcHRpb25zLm1hc2spIHJldHVybiBbdGFyZ2V0LCBkYXRhXTtcblxuICAgIHRhcmdldFsxXSB8PSAweDgwO1xuICAgIHRhcmdldFtvZmZzZXQgLSA0XSA9IG1hc2tbMF07XG4gICAgdGFyZ2V0W29mZnNldCAtIDNdID0gbWFza1sxXTtcbiAgICB0YXJnZXRbb2Zmc2V0IC0gMl0gPSBtYXNrWzJdO1xuICAgIHRhcmdldFtvZmZzZXQgLSAxXSA9IG1hc2tbM107XG5cbiAgICBpZiAoc2tpcE1hc2tpbmcpIHJldHVybiBbdGFyZ2V0LCBkYXRhXTtcblxuICAgIGlmIChtZXJnZSkge1xuICAgICAgYXBwbHlNYXNrKGRhdGEsIG1hc2ssIHRhcmdldCwgb2Zmc2V0LCBkYXRhTGVuZ3RoKTtcbiAgICAgIHJldHVybiBbdGFyZ2V0XTtcbiAgICB9XG5cbiAgICBhcHBseU1hc2soZGF0YSwgbWFzaywgZGF0YSwgMCwgZGF0YUxlbmd0aCk7XG4gICAgcmV0dXJuIFt0YXJnZXQsIGRhdGFdO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgY2xvc2UgbWVzc2FnZSB0byB0aGUgb3RoZXIgcGVlci5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2RlXSBUaGUgc3RhdHVzIGNvZGUgY29tcG9uZW50IG9mIHRoZSBib2R5XG4gICAqIEBwYXJhbSB7KFN0cmluZ3xCdWZmZXIpfSBbZGF0YV0gVGhlIG1lc3NhZ2UgY29tcG9uZW50IG9mIHRoZSBib2R5XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW21hc2s9ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gQ2FsbGJhY2tcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xvc2UoY29kZSwgZGF0YSwgbWFzaywgY2IpIHtcbiAgICBsZXQgYnVmO1xuXG4gICAgaWYgKGNvZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYnVmID0gRU1QVFlfQlVGRkVSO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvZGUgIT09ICdudW1iZXInIHx8ICFpc1ZhbGlkU3RhdHVzQ29kZShjb2RlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHZhbGlkIGVycm9yIGNvZGUgbnVtYmVyJyk7XG4gICAgfSBlbHNlIGlmIChkYXRhID09PSB1bmRlZmluZWQgfHwgIWRhdGEubGVuZ3RoKSB7XG4gICAgICBidWYgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMik7XG4gICAgICBidWYud3JpdGVVSW50MTZCRShjb2RlLCAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSk7XG5cbiAgICAgIGlmIChsZW5ndGggPiAxMjMpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBtZXNzYWdlIG11c3Qgbm90IGJlIGdyZWF0ZXIgdGhhbiAxMjMgYnl0ZXMnKTtcbiAgICAgIH1cblxuICAgICAgYnVmID0gQnVmZmVyLmFsbG9jVW5zYWZlKDIgKyBsZW5ndGgpO1xuICAgICAgYnVmLndyaXRlVUludDE2QkUoY29kZSwgMCk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgYnVmLndyaXRlKGRhdGEsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnNldChkYXRhLCAyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgW2tCeXRlTGVuZ3RoXTogYnVmLmxlbmd0aCxcbiAgICAgIGZpbjogdHJ1ZSxcbiAgICAgIGdlbmVyYXRlTWFzazogdGhpcy5fZ2VuZXJhdGVNYXNrLFxuICAgICAgbWFzayxcbiAgICAgIG1hc2tCdWZmZXI6IHRoaXMuX21hc2tCdWZmZXIsXG4gICAgICBvcGNvZGU6IDB4MDgsXG4gICAgICByZWFkT25seTogZmFsc2UsXG4gICAgICByc3YxOiBmYWxzZVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5fZGVmbGF0aW5nKSB7XG4gICAgICB0aGlzLmVucXVldWUoW3RoaXMuZGlzcGF0Y2gsIGJ1ZiwgZmFsc2UsIG9wdGlvbnMsIGNiXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEZyYW1lKFNlbmRlci5mcmFtZShidWYsIG9wdGlvbnMpLCBjYik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgcGluZyBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFttYXNrPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwaW5nKGRhdGEsIG1hc2ssIGNiKSB7XG4gICAgbGV0IGJ5dGVMZW5ndGg7XG4gICAgbGV0IHJlYWRPbmx5O1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgYnl0ZUxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpO1xuICAgICAgcmVhZE9ubHkgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHRvQnVmZmVyKGRhdGEpO1xuICAgICAgYnl0ZUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgcmVhZE9ubHkgPSB0b0J1ZmZlci5yZWFkT25seTtcbiAgICB9XG5cbiAgICBpZiAoYnl0ZUxlbmd0aCA+IDEyNSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBkYXRhIHNpemUgbXVzdCBub3QgYmUgZ3JlYXRlciB0aGFuIDEyNSBieXRlcycpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBba0J5dGVMZW5ndGhdOiBieXRlTGVuZ3RoLFxuICAgICAgZmluOiB0cnVlLFxuICAgICAgZ2VuZXJhdGVNYXNrOiB0aGlzLl9nZW5lcmF0ZU1hc2ssXG4gICAgICBtYXNrLFxuICAgICAgbWFza0J1ZmZlcjogdGhpcy5fbWFza0J1ZmZlcixcbiAgICAgIG9wY29kZTogMHgwOSxcbiAgICAgIHJlYWRPbmx5LFxuICAgICAgcnN2MTogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2RlZmxhdGluZykge1xuICAgICAgdGhpcy5lbnF1ZXVlKFt0aGlzLmRpc3BhdGNoLCBkYXRhLCBmYWxzZSwgb3B0aW9ucywgY2JdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGRhdGEsIG9wdGlvbnMpLCBjYik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgcG9uZyBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFttYXNrPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFzayBgZGF0YWBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwb25nKGRhdGEsIG1hc2ssIGNiKSB7XG4gICAgbGV0IGJ5dGVMZW5ndGg7XG4gICAgbGV0IHJlYWRPbmx5O1xuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgYnl0ZUxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpO1xuICAgICAgcmVhZE9ubHkgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHRvQnVmZmVyKGRhdGEpO1xuICAgICAgYnl0ZUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgcmVhZE9ubHkgPSB0b0J1ZmZlci5yZWFkT25seTtcbiAgICB9XG5cbiAgICBpZiAoYnl0ZUxlbmd0aCA+IDEyNSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSBkYXRhIHNpemUgbXVzdCBub3QgYmUgZ3JlYXRlciB0aGFuIDEyNSBieXRlcycpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBba0J5dGVMZW5ndGhdOiBieXRlTGVuZ3RoLFxuICAgICAgZmluOiB0cnVlLFxuICAgICAgZ2VuZXJhdGVNYXNrOiB0aGlzLl9nZW5lcmF0ZU1hc2ssXG4gICAgICBtYXNrLFxuICAgICAgbWFza0J1ZmZlcjogdGhpcy5fbWFza0J1ZmZlcixcbiAgICAgIG9wY29kZTogMHgwYSxcbiAgICAgIHJlYWRPbmx5LFxuICAgICAgcnN2MTogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2RlZmxhdGluZykge1xuICAgICAgdGhpcy5lbnF1ZXVlKFt0aGlzLmRpc3BhdGNoLCBkYXRhLCBmYWxzZSwgb3B0aW9ucywgY2JdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGRhdGEsIG9wdGlvbnMpLCBjYik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgZGF0YSBtZXNzYWdlIHRvIHRoZSBvdGhlciBwZWVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGRhdGEgVGhlIG1lc3NhZ2UgdG8gc2VuZFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIG9iamVjdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJpbmFyeT1mYWxzZV0gU3BlY2lmaWVzIHdoZXRoZXIgYGRhdGFgIGlzIGJpbmFyeVxuICAgKiAgICAgb3IgdGV4dFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvbXByZXNzPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG9cbiAgICogICAgIGNvbXByZXNzIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZpbj1mYWxzZV0gU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGZyYWdtZW50IGlzIHRoZVxuICAgKiAgICAgbGFzdCBvbmVcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tYXNrPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFza1xuICAgKiAgICAgYGRhdGFgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gQ2FsbGJhY2tcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc2VuZChkYXRhLCBvcHRpb25zLCBjYikge1xuICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXTtcbiAgICBsZXQgb3Bjb2RlID0gb3B0aW9ucy5iaW5hcnkgPyAyIDogMTtcbiAgICBsZXQgcnN2MSA9IG9wdGlvbnMuY29tcHJlc3M7XG5cbiAgICBsZXQgYnl0ZUxlbmd0aDtcbiAgICBsZXQgcmVhZE9ubHk7XG5cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBieXRlTGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSk7XG4gICAgICByZWFkT25seSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gdG9CdWZmZXIoZGF0YSk7XG4gICAgICBieXRlTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgICByZWFkT25seSA9IHRvQnVmZmVyLnJlYWRPbmx5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9maXJzdEZyYWdtZW50KSB7XG4gICAgICB0aGlzLl9maXJzdEZyYWdtZW50ID0gZmFsc2U7XG4gICAgICBpZiAoXG4gICAgICAgIHJzdjEgJiZcbiAgICAgICAgcGVyTWVzc2FnZURlZmxhdGUgJiZcbiAgICAgICAgcGVyTWVzc2FnZURlZmxhdGUucGFyYW1zW1xuICAgICAgICAgIHBlck1lc3NhZ2VEZWZsYXRlLl9pc1NlcnZlclxuICAgICAgICAgICAgPyAnc2VydmVyX25vX2NvbnRleHRfdGFrZW92ZXInXG4gICAgICAgICAgICA6ICdjbGllbnRfbm9fY29udGV4dF90YWtlb3ZlcidcbiAgICAgICAgXVxuICAgICAgKSB7XG4gICAgICAgIHJzdjEgPSBieXRlTGVuZ3RoID49IHBlck1lc3NhZ2VEZWZsYXRlLl90aHJlc2hvbGQ7XG4gICAgICB9XG4gICAgICB0aGlzLl9jb21wcmVzcyA9IHJzdjE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJzdjEgPSBmYWxzZTtcbiAgICAgIG9wY29kZSA9IDA7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZmluKSB0aGlzLl9maXJzdEZyYWdtZW50ID0gdHJ1ZTtcblxuICAgIGlmIChwZXJNZXNzYWdlRGVmbGF0ZSkge1xuICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgW2tCeXRlTGVuZ3RoXTogYnl0ZUxlbmd0aCxcbiAgICAgICAgZmluOiBvcHRpb25zLmZpbixcbiAgICAgICAgZ2VuZXJhdGVNYXNrOiB0aGlzLl9nZW5lcmF0ZU1hc2ssXG4gICAgICAgIG1hc2s6IG9wdGlvbnMubWFzayxcbiAgICAgICAgbWFza0J1ZmZlcjogdGhpcy5fbWFza0J1ZmZlcixcbiAgICAgICAgb3Bjb2RlLFxuICAgICAgICByZWFkT25seSxcbiAgICAgICAgcnN2MVxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuX2RlZmxhdGluZykge1xuICAgICAgICB0aGlzLmVucXVldWUoW3RoaXMuZGlzcGF0Y2gsIGRhdGEsIHRoaXMuX2NvbXByZXNzLCBvcHRzLCBjYl0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaChkYXRhLCB0aGlzLl9jb21wcmVzcywgb3B0cywgY2IpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmRGcmFtZShcbiAgICAgICAgU2VuZGVyLmZyYW1lKGRhdGEsIHtcbiAgICAgICAgICBba0J5dGVMZW5ndGhdOiBieXRlTGVuZ3RoLFxuICAgICAgICAgIGZpbjogb3B0aW9ucy5maW4sXG4gICAgICAgICAgZ2VuZXJhdGVNYXNrOiB0aGlzLl9nZW5lcmF0ZU1hc2ssXG4gICAgICAgICAgbWFzazogb3B0aW9ucy5tYXNrLFxuICAgICAgICAgIG1hc2tCdWZmZXI6IHRoaXMuX21hc2tCdWZmZXIsXG4gICAgICAgICAgb3Bjb2RlLFxuICAgICAgICAgIHJlYWRPbmx5LFxuICAgICAgICAgIHJzdjE6IGZhbHNlXG4gICAgICAgIH0pLFxuICAgICAgICBjYlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7KEJ1ZmZlcnxTdHJpbmcpfSBkYXRhIFRoZSBtZXNzYWdlIHRvIHNlbmRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbY29tcHJlc3M9ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBjb21wcmVzc1xuICAgKiAgICAgYGRhdGFgXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZmluPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gc2V0IHRoZVxuICAgKiAgICAgRklOIGJpdFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5nZW5lcmF0ZU1hc2tdIFRoZSBmdW5jdGlvbiB1c2VkIHRvIGdlbmVyYXRlIHRoZVxuICAgKiAgICAgbWFza2luZyBrZXlcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tYXNrPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gbWFza1xuICAgKiAgICAgYGRhdGFgXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBbb3B0aW9ucy5tYXNrQnVmZmVyXSBUaGUgYnVmZmVyIHVzZWQgdG8gc3RvcmUgdGhlIG1hc2tpbmdcbiAgICogICAgIGtleVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5vcGNvZGUgVGhlIG9wY29kZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJlYWRPbmx5PWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBgZGF0YWAgY2FuIGJlXG4gICAqICAgICBtb2RpZmllZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJzdjE9ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBzZXQgdGhlXG4gICAqICAgICBSU1YxIGJpdFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIENhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNwYXRjaChkYXRhLCBjb21wcmVzcywgb3B0aW9ucywgY2IpIHtcbiAgICBpZiAoIWNvbXByZXNzKSB7XG4gICAgICB0aGlzLnNlbmRGcmFtZShTZW5kZXIuZnJhbWUoZGF0YSwgb3B0aW9ucyksIGNiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwZXJNZXNzYWdlRGVmbGF0ZSA9IHRoaXMuX2V4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV07XG5cbiAgICB0aGlzLl9idWZmZXJlZEJ5dGVzICs9IG9wdGlvbnNba0J5dGVMZW5ndGhdO1xuICAgIHRoaXMuX2RlZmxhdGluZyA9IHRydWU7XG4gICAgcGVyTWVzc2FnZURlZmxhdGUuY29tcHJlc3MoZGF0YSwgb3B0aW9ucy5maW4sIChfLCBidWYpID0+IHtcbiAgICAgIGlmICh0aGlzLl9zb2NrZXQuZGVzdHJveWVkKSB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAnVGhlIHNvY2tldCB3YXMgY2xvc2VkIHdoaWxlIGRhdGEgd2FzIGJlaW5nIGNvbXByZXNzZWQnXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoZXJyKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3F1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5fcXVldWVbaV07XG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBwYXJhbXNbcGFyYW1zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlcyAtPSBvcHRpb25zW2tCeXRlTGVuZ3RoXTtcbiAgICAgIHRoaXMuX2RlZmxhdGluZyA9IGZhbHNlO1xuICAgICAgb3B0aW9ucy5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgdGhpcy5zZW5kRnJhbWUoU2VuZGVyLmZyYW1lKGJ1Ziwgb3B0aW9ucyksIGNiKTtcbiAgICAgIHRoaXMuZGVxdWV1ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIHF1ZXVlZCBzZW5kIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZXF1ZXVlKCkge1xuICAgIHdoaWxlICghdGhpcy5fZGVmbGF0aW5nICYmIHRoaXMuX3F1ZXVlLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5fcXVldWUuc2hpZnQoKTtcblxuICAgICAgdGhpcy5fYnVmZmVyZWRCeXRlcyAtPSBwYXJhbXNbM11ba0J5dGVMZW5ndGhdO1xuICAgICAgUmVmbGVjdC5hcHBseShwYXJhbXNbMF0sIHRoaXMsIHBhcmFtcy5zbGljZSgxKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVucXVldWVzIGEgc2VuZCBvcGVyYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyBTZW5kIG9wZXJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW5xdWV1ZShwYXJhbXMpIHtcbiAgICB0aGlzLl9idWZmZXJlZEJ5dGVzICs9IHBhcmFtc1szXVtrQnl0ZUxlbmd0aF07XG4gICAgdGhpcy5fcXVldWUucHVzaChwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgZnJhbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyW119IGxpc3QgVGhlIGZyYW1lIHRvIHNlbmRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSBDYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VuZEZyYW1lKGxpc3QsIGNiKSB7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLl9zb2NrZXQuY29yaygpO1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMF0pO1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMV0sIGNiKTtcbiAgICAgIHRoaXMuX3NvY2tldC51bmNvcmsoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc29ja2V0LndyaXRlKGxpc3RbMF0sIGNiKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW5kZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsga0Zvck9uRXZlbnRBdHRyaWJ1dGUsIGtMaXN0ZW5lciB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3Qga0NvZGUgPSBTeW1ib2woJ2tDb2RlJyk7XG5jb25zdCBrRGF0YSA9IFN5bWJvbCgna0RhdGEnKTtcbmNvbnN0IGtFcnJvciA9IFN5bWJvbCgna0Vycm9yJyk7XG5jb25zdCBrTWVzc2FnZSA9IFN5bWJvbCgna01lc3NhZ2UnKTtcbmNvbnN0IGtSZWFzb24gPSBTeW1ib2woJ2tSZWFzb24nKTtcbmNvbnN0IGtUYXJnZXQgPSBTeW1ib2woJ2tUYXJnZXQnKTtcbmNvbnN0IGtUeXBlID0gU3ltYm9sKCdrVHlwZScpO1xuY29uc3Qga1dhc0NsZWFuID0gU3ltYm9sKCdrV2FzQ2xlYW4nKTtcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gZXZlbnQuXG4gKi9cbmNsYXNzIEV2ZW50IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBJZiB0aGUgYHR5cGVgIGFyZ3VtZW50IGlzIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHR5cGUpIHtcbiAgICB0aGlzW2tUYXJnZXRdID0gbnVsbDtcbiAgICB0aGlzW2tUeXBlXSA9IHR5cGU7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUgeyp9XG4gICAqL1xuICBnZXQgdGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzW2tUYXJnZXRdO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpc1trVHlwZV07XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50LnByb3RvdHlwZSwgJ3RhcmdldCcsIHsgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudC5wcm90b3R5cGUsICd0eXBlJywgeyBlbnVtZXJhYmxlOiB0cnVlIH0pO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIGNsb3NlIGV2ZW50LlxuICpcbiAqIEBleHRlbmRzIEV2ZW50XG4gKi9cbmNsYXNzIENsb3NlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYENsb3NlRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBIGRpY3Rpb25hcnkgb2JqZWN0IHRoYXQgYWxsb3dzIGZvciBzZXR0aW5nXG4gICAqICAgICBhdHRyaWJ1dGVzIHZpYSBvYmplY3QgbWVtYmVycyBvZiB0aGUgc2FtZSBuYW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jb2RlPTBdIFRoZSBzdGF0dXMgY29kZSBleHBsYWluaW5nIHdoeSB0aGVcbiAgICogICAgIGNvbm5lY3Rpb24gd2FzIGNsb3NlZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucmVhc29uPScnXSBBIGh1bWFuLXJlYWRhYmxlIHN0cmluZyBleHBsYWluaW5nIHdoeVxuICAgKiAgICAgdGhlIGNvbm5lY3Rpb24gd2FzIGNsb3NlZFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLndhc0NsZWFuPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdGhlXG4gICAqICAgICBjb25uZWN0aW9uIHdhcyBjbGVhbmx5IGNsb3NlZFxuICAgKi9cbiAgY29uc3RydWN0b3IodHlwZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIodHlwZSk7XG5cbiAgICB0aGlzW2tDb2RlXSA9IG9wdGlvbnMuY29kZSA9PT0gdW5kZWZpbmVkID8gMCA6IG9wdGlvbnMuY29kZTtcbiAgICB0aGlzW2tSZWFzb25dID0gb3B0aW9ucy5yZWFzb24gPT09IHVuZGVmaW5lZCA/ICcnIDogb3B0aW9ucy5yZWFzb247XG4gICAgdGhpc1trV2FzQ2xlYW5dID0gb3B0aW9ucy53YXNDbGVhbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBvcHRpb25zLndhc0NsZWFuO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY29kZSgpIHtcbiAgICByZXR1cm4gdGhpc1trQ29kZV07XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCByZWFzb24oKSB7XG4gICAgcmV0dXJuIHRoaXNba1JlYXNvbl07XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBnZXQgd2FzQ2xlYW4oKSB7XG4gICAgcmV0dXJuIHRoaXNba1dhc0NsZWFuXTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xvc2VFdmVudC5wcm90b3R5cGUsICdjb2RlJywgeyBlbnVtZXJhYmxlOiB0cnVlIH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KENsb3NlRXZlbnQucHJvdG90eXBlLCAncmVhc29uJywgeyBlbnVtZXJhYmxlOiB0cnVlIH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KENsb3NlRXZlbnQucHJvdG90eXBlLCAnd2FzQ2xlYW4nLCB7IGVudW1lcmFibGU6IHRydWUgfSk7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIGVycm9yIGV2ZW50LlxuICpcbiAqIEBleHRlbmRzIEV2ZW50XG4gKi9cbmNsYXNzIEVycm9yRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYEVycm9yRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBIGRpY3Rpb25hcnkgb2JqZWN0IHRoYXQgYWxsb3dzIGZvciBzZXR0aW5nXG4gICAqICAgICBhdHRyaWJ1dGVzIHZpYSBvYmplY3QgbWVtYmVycyBvZiB0aGUgc2FtZSBuYW1lXG4gICAqIEBwYXJhbSB7Kn0gW29wdGlvbnMuZXJyb3I9bnVsbF0gVGhlIGVycm9yIHRoYXQgZ2VuZXJhdGVkIHRoaXMgZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1lc3NhZ2U9JyddIFRoZSBlcnJvciBtZXNzYWdlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih0eXBlKTtcblxuICAgIHRoaXNba0Vycm9yXSA9IG9wdGlvbnMuZXJyb3IgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBvcHRpb25zLmVycm9yO1xuICAgIHRoaXNba01lc3NhZ2VdID0gb3B0aW9ucy5tZXNzYWdlID09PSB1bmRlZmluZWQgPyAnJyA6IG9wdGlvbnMubWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Kn1cbiAgICovXG4gIGdldCBlcnJvcigpIHtcbiAgICByZXR1cm4gdGhpc1trRXJyb3JdO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpc1trTWVzc2FnZV07XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEVycm9yRXZlbnQucHJvdG90eXBlLCAnZXJyb3InLCB7IGVudW1lcmFibGU6IHRydWUgfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXJyb3JFdmVudC5wcm90b3R5cGUsICdtZXNzYWdlJywgeyBlbnVtZXJhYmxlOiB0cnVlIH0pO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIG1lc3NhZ2UgZXZlbnQuXG4gKlxuICogQGV4dGVuZHMgRXZlbnRcbiAqL1xuY2xhc3MgTWVzc2FnZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBNZXNzYWdlRXZlbnRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBIGRpY3Rpb25hcnkgb2JqZWN0IHRoYXQgYWxsb3dzIGZvciBzZXR0aW5nXG4gICAqICAgICBhdHRyaWJ1dGVzIHZpYSBvYmplY3QgbWVtYmVycyBvZiB0aGUgc2FtZSBuYW1lXG4gICAqIEBwYXJhbSB7Kn0gW29wdGlvbnMuZGF0YT1udWxsXSBUaGUgbWVzc2FnZSBjb250ZW50XG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih0eXBlKTtcblxuICAgIHRoaXNba0RhdGFdID0gb3B0aW9ucy5kYXRhID09PSB1bmRlZmluZWQgPyBudWxsIDogb3B0aW9ucy5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHsqfVxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXNba0RhdGFdO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZXNzYWdlRXZlbnQucHJvdG90eXBlLCAnZGF0YScsIHsgZW51bWVyYWJsZTogdHJ1ZSB9KTtcblxuLyoqXG4gKiBUaGlzIHByb3ZpZGVzIG1ldGhvZHMgZm9yIGVtdWxhdGluZyB0aGUgYEV2ZW50VGFyZ2V0YCBpbnRlcmZhY2UuIEl0J3Mgbm90XG4gKiBtZWFudCB0byBiZSB1c2VkIGRpcmVjdGx5LlxuICpcbiAqIEBtaXhpblxuICovXG5jb25zdCBFdmVudFRhcmdldCA9IHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgdG8gYWRkXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQW4gb3B0aW9ucyBvYmplY3Qgc3BlY2lmaWVzIGNoYXJhY3RlcmlzdGljcyBhYm91dFxuICAgKiAgICAgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMub25jZT1mYWxzZV0gQSBgQm9vbGVhbmAgaW5kaWNhdGluZyB0aGF0IHRoZVxuICAgKiAgICAgbGlzdGVuZXIgc2hvdWxkIGJlIGludm9rZWQgYXQgbW9zdCBvbmNlIGFmdGVyIGJlaW5nIGFkZGVkLiBJZiBgdHJ1ZWAsXG4gICAqICAgICB0aGUgbGlzdGVuZXIgd291bGQgYmUgYXV0b21hdGljYWxseSByZW1vdmVkIHdoZW4gaW52b2tlZC5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHdyYXBwZXI7XG5cbiAgICBpZiAodHlwZSA9PT0gJ21lc3NhZ2UnKSB7XG4gICAgICB3cmFwcGVyID0gZnVuY3Rpb24gb25NZXNzYWdlKGRhdGEsIGlzQmluYXJ5KSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1lc3NhZ2VFdmVudCgnbWVzc2FnZScsIHtcbiAgICAgICAgICBkYXRhOiBpc0JpbmFyeSA/IGRhdGEgOiBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXZlbnRba1RhcmdldF0gPSB0aGlzO1xuICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnY2xvc2UnKSB7XG4gICAgICB3cmFwcGVyID0gZnVuY3Rpb24gb25DbG9zZShjb2RlLCBtZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IENsb3NlRXZlbnQoJ2Nsb3NlJywge1xuICAgICAgICAgIGNvZGUsXG4gICAgICAgICAgcmVhc29uOiBtZXNzYWdlLnRvU3RyaW5nKCksXG4gICAgICAgICAgd2FzQ2xlYW46IHRoaXMuX2Nsb3NlRnJhbWVSZWNlaXZlZCAmJiB0aGlzLl9jbG9zZUZyYW1lU2VudFxuICAgICAgICB9KTtcblxuICAgICAgICBldmVudFtrVGFyZ2V0XSA9IHRoaXM7XG4gICAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgIHdyYXBwZXIgPSBmdW5jdGlvbiBvbkVycm9yKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEVycm9yRXZlbnQoJ2Vycm9yJywge1xuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXZlbnRba1RhcmdldF0gPSB0aGlzO1xuICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb3BlbicpIHtcbiAgICAgIHdyYXBwZXIgPSBmdW5jdGlvbiBvbk9wZW4oKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdvcGVuJyk7XG5cbiAgICAgICAgZXZlbnRba1RhcmdldF0gPSB0aGlzO1xuICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB3cmFwcGVyW2tGb3JPbkV2ZW50QXR0cmlidXRlXSA9ICEhb3B0aW9uc1trRm9yT25FdmVudEF0dHJpYnV0ZV07XG4gICAgd3JhcHBlcltrTGlzdGVuZXJdID0gbGlzdGVuZXI7XG5cbiAgICBpZiAob3B0aW9ucy5vbmNlKSB7XG4gICAgICB0aGlzLm9uY2UodHlwZSwgd3JhcHBlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub24odHlwZSwgd3JhcHBlcik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byByZW1vdmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbGlzdGVuZXIgdG8gcmVtb3ZlXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlcikge1xuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnModHlwZSkpIHtcbiAgICAgIGlmIChsaXN0ZW5lcltrTGlzdGVuZXJdID09PSBoYW5kbGVyICYmICFsaXN0ZW5lcltrRm9yT25FdmVudEF0dHJpYnV0ZV0pIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIENsb3NlRXZlbnQsXG4gIEVycm9yRXZlbnQsXG4gIEV2ZW50LFxuICBFdmVudFRhcmdldCxcbiAgTWVzc2FnZUV2ZW50XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB7IHRva2VuQ2hhcnMgfSA9IHJlcXVpcmUoJy4vdmFsaWRhdGlvbicpO1xuXG4vKipcbiAqIEFkZHMgYW4gb2ZmZXIgdG8gdGhlIG1hcCBvZiBleHRlbnNpb24gb2ZmZXJzIG9yIGEgcGFyYW1ldGVyIHRvIHRoZSBtYXAgb2ZcbiAqIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlc3QgVGhlIG1hcCBvZiBleHRlbnNpb24gb2ZmZXJzIG9yIHBhcmFtZXRlcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBleHRlbnNpb24gb3IgcGFyYW1ldGVyIG5hbWVcbiAqIEBwYXJhbSB7KE9iamVjdHxCb29sZWFufFN0cmluZyl9IGVsZW0gVGhlIGV4dGVuc2lvbiBwYXJhbWV0ZXJzIG9yIHRoZVxuICogICAgIHBhcmFtZXRlciB2YWx1ZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcHVzaChkZXN0LCBuYW1lLCBlbGVtKSB7XG4gIGlmIChkZXN0W25hbWVdID09PSB1bmRlZmluZWQpIGRlc3RbbmFtZV0gPSBbZWxlbV07XG4gIGVsc2UgZGVzdFtuYW1lXS5wdXNoKGVsZW0pO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYFNlYy1XZWJTb2NrZXQtRXh0ZW5zaW9uc2AgaGVhZGVyIGludG8gYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBoZWFkZXIgVGhlIGZpZWxkIHZhbHVlIG9mIHRoZSBoZWFkZXJcbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIHBhcnNlZCBvYmplY3RcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcGFyc2UoaGVhZGVyKSB7XG4gIGNvbnN0IG9mZmVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGxldCBwYXJhbXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBsZXQgbXVzdFVuZXNjYXBlID0gZmFsc2U7XG4gIGxldCBpc0VzY2FwaW5nID0gZmFsc2U7XG4gIGxldCBpblF1b3RlcyA9IGZhbHNlO1xuICBsZXQgZXh0ZW5zaW9uTmFtZTtcbiAgbGV0IHBhcmFtTmFtZTtcbiAgbGV0IHN0YXJ0ID0gLTE7XG4gIGxldCBjb2RlID0gLTE7XG4gIGxldCBlbmQgPSAtMTtcbiAgbGV0IGkgPSAwO1xuXG4gIGZvciAoOyBpIDwgaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgY29kZSA9IGhlYWRlci5jaGFyQ29kZUF0KGkpO1xuXG4gICAgaWYgKGV4dGVuc2lvbk5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGVuZCA9PT0gLTEgJiYgdG9rZW5DaGFyc1tjb2RlXSA9PT0gMSkge1xuICAgICAgICBpZiAoc3RhcnQgPT09IC0xKSBzdGFydCA9IGk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBpICE9PSAwICYmXG4gICAgICAgIChjb2RlID09PSAweDIwIC8qICcgJyAqLyB8fCBjb2RlID09PSAweDA5KSAvKiAnXFx0JyAqL1xuICAgICAgKSB7XG4gICAgICAgIGlmIChlbmQgPT09IC0xICYmIHN0YXJ0ICE9PSAtMSkgZW5kID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gMHgzYiAvKiAnOycgKi8gfHwgY29kZSA9PT0gMHgyYyAvKiAnLCcgKi8pIHtcbiAgICAgICAgaWYgKHN0YXJ0ID09PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgYXQgaW5kZXggJHtpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IGk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBoZWFkZXIuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgIGlmIChjb2RlID09PSAweDJjKSB7XG4gICAgICAgICAgcHVzaChvZmZlcnMsIG5hbWUsIHBhcmFtcyk7XG4gICAgICAgICAgcGFyYW1zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleHRlbnNpb25OYW1lID0gbmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0ID0gZW5kID0gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIGF0IGluZGV4ICR7aX1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBhcmFtTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoZW5kID09PSAtMSAmJiB0b2tlbkNoYXJzW2NvZGVdID09PSAxKSB7XG4gICAgICAgIGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gMHgyMCB8fCBjb2RlID09PSAweDA5KSB7XG4gICAgICAgIGlmIChlbmQgPT09IC0xICYmIHN0YXJ0ICE9PSAtMSkgZW5kID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gMHgzYiB8fCBjb2RlID09PSAweDJjKSB7XG4gICAgICAgIGlmIChzdGFydCA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIGF0IGluZGV4ICR7aX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmQgPT09IC0xKSBlbmQgPSBpO1xuICAgICAgICBwdXNoKHBhcmFtcywgaGVhZGVyLnNsaWNlKHN0YXJ0LCBlbmQpLCB0cnVlKTtcbiAgICAgICAgaWYgKGNvZGUgPT09IDB4MmMpIHtcbiAgICAgICAgICBwdXNoKG9mZmVycywgZXh0ZW5zaW9uTmFtZSwgcGFyYW1zKTtcbiAgICAgICAgICBwYXJhbXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGV4dGVuc2lvbk5hbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydCA9IGVuZCA9IC0xO1xuICAgICAgfSBlbHNlIGlmIChjb2RlID09PSAweDNkIC8qICc9JyAqLyAmJiBzdGFydCAhPT0gLTEgJiYgZW5kID09PSAtMSkge1xuICAgICAgICBwYXJhbU5hbWUgPSBoZWFkZXIuc2xpY2Uoc3RhcnQsIGkpO1xuICAgICAgICBzdGFydCA9IGVuZCA9IC0xO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciBhdCBpbmRleCAke2l9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vXG4gICAgICAvLyBUaGUgdmFsdWUgb2YgYSBxdW90ZWQtc3RyaW5nIGFmdGVyIHVuZXNjYXBpbmcgbXVzdCBjb25mb3JtIHRvIHRoZVxuICAgICAgLy8gdG9rZW4gQUJORiwgc28gb25seSB0b2tlbiBjaGFyYWN0ZXJzIGFyZSB2YWxpZC5cbiAgICAgIC8vIFJlZjogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY0NTUjc2VjdGlvbi05LjFcbiAgICAgIC8vXG4gICAgICBpZiAoaXNFc2NhcGluZykge1xuICAgICAgICBpZiAodG9rZW5DaGFyc1tjb2RlXSAhPT0gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgYXQgaW5kZXggJHtpfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gaTtcbiAgICAgICAgZWxzZSBpZiAoIW11c3RVbmVzY2FwZSkgbXVzdFVuZXNjYXBlID0gdHJ1ZTtcbiAgICAgICAgaXNFc2NhcGluZyA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChpblF1b3Rlcykge1xuICAgICAgICBpZiAodG9rZW5DaGFyc1tjb2RlXSA9PT0gMSkge1xuICAgICAgICAgIGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gaTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlID09PSAweDIyIC8qICdcIicgKi8gJiYgc3RhcnQgIT09IC0xKSB7XG4gICAgICAgICAgaW5RdW90ZXMgPSBmYWxzZTtcbiAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDB4NWMgLyogJ1xcJyAqLykge1xuICAgICAgICAgIGlzRXNjYXBpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgYXQgaW5kZXggJHtpfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDB4MjIgJiYgaGVhZGVyLmNoYXJDb2RlQXQoaSAtIDEpID09PSAweDNkKSB7XG4gICAgICAgIGluUXVvdGVzID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZW5kID09PSAtMSAmJiB0b2tlbkNoYXJzW2NvZGVdID09PSAxKSB7XG4gICAgICAgIGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnQgIT09IC0xICYmIChjb2RlID09PSAweDIwIHx8IGNvZGUgPT09IDB4MDkpKSB7XG4gICAgICAgIGlmIChlbmQgPT09IC0xKSBlbmQgPSBpO1xuICAgICAgfSBlbHNlIGlmIChjb2RlID09PSAweDNiIHx8IGNvZGUgPT09IDB4MmMpIHtcbiAgICAgICAgaWYgKHN0YXJ0ID09PSAtMSkge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgYXQgaW5kZXggJHtpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IGk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGhlYWRlci5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgaWYgKG11c3RVbmVzY2FwZSkge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgICAgICAgbXVzdFVuZXNjYXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcHVzaChwYXJhbXMsIHBhcmFtTmFtZSwgdmFsdWUpO1xuICAgICAgICBpZiAoY29kZSA9PT0gMHgyYykge1xuICAgICAgICAgIHB1c2gob2ZmZXJzLCBleHRlbnNpb25OYW1lLCBwYXJhbXMpO1xuICAgICAgICAgIHBhcmFtcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgZXh0ZW5zaW9uTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmFtTmFtZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgc3RhcnQgPSBlbmQgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5leHBlY3RlZCBjaGFyYWN0ZXIgYXQgaW5kZXggJHtpfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gLTEgfHwgaW5RdW90ZXMgfHwgY29kZSA9PT0gMHgyMCB8fCBjb2RlID09PSAweDA5KSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKCdVbmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcpO1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IGk7XG4gIGNvbnN0IHRva2VuID0gaGVhZGVyLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICBpZiAoZXh0ZW5zaW9uTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcHVzaChvZmZlcnMsIHRva2VuLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIGlmIChwYXJhbU5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcHVzaChwYXJhbXMsIHRva2VuLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKG11c3RVbmVzY2FwZSkge1xuICAgICAgcHVzaChwYXJhbXMsIHBhcmFtTmFtZSwgdG9rZW4ucmVwbGFjZSgvXFxcXC9nLCAnJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoKHBhcmFtcywgcGFyYW1OYW1lLCB0b2tlbik7XG4gICAgfVxuICAgIHB1c2gob2ZmZXJzLCBleHRlbnNpb25OYW1lLCBwYXJhbXMpO1xuICB9XG5cbiAgcmV0dXJuIG9mZmVycztcbn1cblxuLyoqXG4gKiBCdWlsZHMgdGhlIGBTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnNgIGhlYWRlciBmaWVsZCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZXh0ZW5zaW9ucyBUaGUgbWFwIG9mIGV4dGVuc2lvbnMgYW5kIHBhcmFtZXRlcnMgdG8gZm9ybWF0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gb2JqZWN0XG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdChleHRlbnNpb25zKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhleHRlbnNpb25zKVxuICAgIC5tYXAoKGV4dGVuc2lvbikgPT4ge1xuICAgICAgbGV0IGNvbmZpZ3VyYXRpb25zID0gZXh0ZW5zaW9uc1tleHRlbnNpb25dO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbmZpZ3VyYXRpb25zKSkgY29uZmlndXJhdGlvbnMgPSBbY29uZmlndXJhdGlvbnNdO1xuICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb25zXG4gICAgICAgIC5tYXAoKHBhcmFtcykgPT4ge1xuICAgICAgICAgIHJldHVybiBbZXh0ZW5zaW9uXVxuICAgICAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoKGspID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gcGFyYW1zW2tdO1xuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB2YWx1ZXMgPSBbdmFsdWVzXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzXG4gICAgICAgICAgICAgICAgICAubWFwKCh2KSA9PiAodiA9PT0gdHJ1ZSA/IGsgOiBgJHtrfT0ke3Z9YCkpXG4gICAgICAgICAgICAgICAgICAuam9pbignOyAnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5qb2luKCc7ICcpO1xuICAgICAgICB9KVxuICAgICAgICAuam9pbignLCAnKTtcbiAgICB9KVxuICAgIC5qb2luKCcsICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgZm9ybWF0LCBwYXJzZSB9O1xuIiwiLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiBbXCJlcnJvclwiLCB7IFwidmFyc0lnbm9yZVBhdHRlcm5cIjogXCJeUmVhZGFibGUkXCIgfV0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbmNvbnN0IGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5jb25zdCBuZXQgPSByZXF1aXJlKCduZXQnKTtcbmNvbnN0IHRscyA9IHJlcXVpcmUoJ3RscycpO1xuY29uc3QgeyByYW5kb21CeXRlcywgY3JlYXRlSGFzaCB9ID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5jb25zdCB7IFJlYWRhYmxlIH0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbmNvbnN0IHsgVVJMIH0gPSByZXF1aXJlKCd1cmwnKTtcblxuY29uc3QgUGVyTWVzc2FnZURlZmxhdGUgPSByZXF1aXJlKCcuL3Blcm1lc3NhZ2UtZGVmbGF0ZScpO1xuY29uc3QgUmVjZWl2ZXIgPSByZXF1aXJlKCcuL3JlY2VpdmVyJyk7XG5jb25zdCBTZW5kZXIgPSByZXF1aXJlKCcuL3NlbmRlcicpO1xuY29uc3Qge1xuICBCSU5BUllfVFlQRVMsXG4gIEVNUFRZX0JVRkZFUixcbiAgR1VJRCxcbiAga0Zvck9uRXZlbnRBdHRyaWJ1dGUsXG4gIGtMaXN0ZW5lcixcbiAga1N0YXR1c0NvZGUsXG4gIGtXZWJTb2NrZXQsXG4gIE5PT1Bcbn0gPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuY29uc3Qge1xuICBFdmVudFRhcmdldDogeyBhZGRFdmVudExpc3RlbmVyLCByZW1vdmVFdmVudExpc3RlbmVyIH1cbn0gPSByZXF1aXJlKCcuL2V2ZW50LXRhcmdldCcpO1xuY29uc3QgeyBmb3JtYXQsIHBhcnNlIH0gPSByZXF1aXJlKCcuL2V4dGVuc2lvbicpO1xuY29uc3QgeyB0b0J1ZmZlciB9ID0gcmVxdWlyZSgnLi9idWZmZXItdXRpbCcpO1xuXG5jb25zdCByZWFkeVN0YXRlcyA9IFsnQ09OTkVDVElORycsICdPUEVOJywgJ0NMT1NJTkcnLCAnQ0xPU0VEJ107XG5jb25zdCBzdWJwcm90b2NvbFJlZ2V4ID0gL15bISMkJSYnKitcXC0uMC05QS1aXl9gfGEten5dKyQvO1xuY29uc3QgcHJvdG9jb2xWZXJzaW9ucyA9IFs4LCAxM107XG5jb25zdCBjbG9zZVRpbWVvdXQgPSAzMCAqIDEwMDA7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgV2ViU29ja2V0LlxuICpcbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICovXG5jbGFzcyBXZWJTb2NrZXQgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBXZWJTb2NrZXRgLlxuICAgKlxuICAgKiBAcGFyYW0geyhTdHJpbmd8VVJMKX0gYWRkcmVzcyBUaGUgVVJMIHRvIHdoaWNoIHRvIGNvbm5lY3RcbiAgICogQHBhcmFtIHsoU3RyaW5nfFN0cmluZ1tdKX0gW3Byb3RvY29sc10gVGhlIHN1YnByb3RvY29sc1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIENvbm5lY3Rpb24gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3IoYWRkcmVzcywgcHJvdG9jb2xzLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2JpbmFyeVR5cGUgPSBCSU5BUllfVFlQRVNbMF07XG4gICAgdGhpcy5fY2xvc2VDb2RlID0gMTAwNjtcbiAgICB0aGlzLl9jbG9zZUZyYW1lUmVjZWl2ZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9jbG9zZUZyYW1lU2VudCA9IGZhbHNlO1xuICAgIHRoaXMuX2Nsb3NlTWVzc2FnZSA9IEVNUFRZX0JVRkZFUjtcbiAgICB0aGlzLl9jbG9zZVRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9leHRlbnNpb25zID0ge307XG4gICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgdGhpcy5fcHJvdG9jb2wgPSAnJztcbiAgICB0aGlzLl9yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNPTk5FQ1RJTkc7XG4gICAgdGhpcy5fcmVjZWl2ZXIgPSBudWxsO1xuICAgIHRoaXMuX3NlbmRlciA9IG51bGw7XG4gICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcblxuICAgIGlmIChhZGRyZXNzICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9idWZmZXJlZEFtb3VudCA9IDA7XG4gICAgICB0aGlzLl9pc1NlcnZlciA9IGZhbHNlO1xuICAgICAgdGhpcy5fcmVkaXJlY3RzID0gMDtcblxuICAgICAgaWYgKHByb3RvY29scyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHByb3RvY29scyA9IFtdO1xuICAgICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShwcm90b2NvbHMpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvdG9jb2xzID09PSAnb2JqZWN0JyAmJiBwcm90b2NvbHMgIT09IG51bGwpIHtcbiAgICAgICAgICBvcHRpb25zID0gcHJvdG9jb2xzO1xuICAgICAgICAgIHByb3RvY29scyA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3RvY29scyA9IFtwcm90b2NvbHNdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGluaXRBc0NsaWVudCh0aGlzLCBhZGRyZXNzLCBwcm90b2NvbHMsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc1NlcnZlciA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZGV2aWF0ZXMgZnJvbSB0aGUgV0hBVFdHIGludGVyZmFjZSBzaW5jZSB3cyBkb2Vzbid0IHN1cHBvcnQgdGhlXG4gICAqIHJlcXVpcmVkIGRlZmF1bHQgXCJibG9iXCIgdHlwZSAoaW5zdGVhZCB3ZSBkZWZpbmUgYSBjdXN0b20gXCJub2RlYnVmZmVyXCJcbiAgICogdHlwZSkuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgYmluYXJ5VHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYmluYXJ5VHlwZTtcbiAgfVxuXG4gIHNldCBiaW5hcnlUeXBlKHR5cGUpIHtcbiAgICBpZiAoIUJJTkFSWV9UWVBFUy5pbmNsdWRlcyh0eXBlKSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fYmluYXJ5VHlwZSA9IHR5cGU7XG5cbiAgICAvL1xuICAgIC8vIEFsbG93IHRvIGNoYW5nZSBgYmluYXJ5VHlwZWAgb24gdGhlIGZseS5cbiAgICAvL1xuICAgIGlmICh0aGlzLl9yZWNlaXZlcikgdGhpcy5fcmVjZWl2ZXIuX2JpbmFyeVR5cGUgPSB0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgYnVmZmVyZWRBbW91bnQoKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHJldHVybiB0aGlzLl9idWZmZXJlZEFtb3VudDtcblxuICAgIHJldHVybiB0aGlzLl9zb2NrZXQuX3dyaXRhYmxlU3RhdGUubGVuZ3RoICsgdGhpcy5fc2VuZGVyLl9idWZmZXJlZEJ5dGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgZXh0ZW5zaW9ucygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5fZXh0ZW5zaW9ucykuam9pbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgZ2V0IGlzUGF1c2VkKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXVzZWQ7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0IG9uY2xvc2UoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0IG9uZXJyb3IoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZ2V0IG9ub3BlbigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBnZXQgb25tZXNzYWdlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgcHJvdG9jb2woKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3RvY29sO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgcmVhZHlTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZHlTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCB0aGUgc29ja2V0IGFuZCB0aGUgaW50ZXJuYWwgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAcGFyYW0geyhuZXQuU29ja2V0fHRscy5Tb2NrZXQpfSBzb2NrZXQgVGhlIG5ldHdvcmsgc29ja2V0IGJldHdlZW4gdGhlXG4gICAqICAgICBzZXJ2ZXIgYW5kIGNsaWVudFxuICAgKiBAcGFyYW0ge0J1ZmZlcn0gaGVhZCBUaGUgZmlyc3QgcGFja2V0IG9mIHRoZSB1cGdyYWRlZCBzdHJlYW1cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3RcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZ2VuZXJhdGVNYXNrXSBUaGUgZnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSB0aGVcbiAgICogICAgIG1hc2tpbmcga2V5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhQYXlsb2FkPTBdIFRoZSBtYXhpbXVtIGFsbG93ZWQgbWVzc2FnZSBzaXplXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2tpcFVURjhWYWxpZGF0aW9uPWZhbHNlXSBTcGVjaWZpZXMgd2hldGhlciBvclxuICAgKiAgICAgbm90IHRvIHNraXAgVVRGLTggdmFsaWRhdGlvbiBmb3IgdGV4dCBhbmQgY2xvc2UgbWVzc2FnZXNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldFNvY2tldChzb2NrZXQsIGhlYWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCByZWNlaXZlciA9IG5ldyBSZWNlaXZlcih7XG4gICAgICBiaW5hcnlUeXBlOiB0aGlzLmJpbmFyeVR5cGUsXG4gICAgICBleHRlbnNpb25zOiB0aGlzLl9leHRlbnNpb25zLFxuICAgICAgaXNTZXJ2ZXI6IHRoaXMuX2lzU2VydmVyLFxuICAgICAgbWF4UGF5bG9hZDogb3B0aW9ucy5tYXhQYXlsb2FkLFxuICAgICAgc2tpcFVURjhWYWxpZGF0aW9uOiBvcHRpb25zLnNraXBVVEY4VmFsaWRhdGlvblxuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VuZGVyID0gbmV3IFNlbmRlcihzb2NrZXQsIHRoaXMuX2V4dGVuc2lvbnMsIG9wdGlvbnMuZ2VuZXJhdGVNYXNrKTtcbiAgICB0aGlzLl9yZWNlaXZlciA9IHJlY2VpdmVyO1xuICAgIHRoaXMuX3NvY2tldCA9IHNvY2tldDtcblxuICAgIHJlY2VpdmVyW2tXZWJTb2NrZXRdID0gdGhpcztcbiAgICBzb2NrZXRba1dlYlNvY2tldF0gPSB0aGlzO1xuXG4gICAgcmVjZWl2ZXIub24oJ2NvbmNsdWRlJywgcmVjZWl2ZXJPbkNvbmNsdWRlKTtcbiAgICByZWNlaXZlci5vbignZHJhaW4nLCByZWNlaXZlck9uRHJhaW4pO1xuICAgIHJlY2VpdmVyLm9uKCdlcnJvcicsIHJlY2VpdmVyT25FcnJvcik7XG4gICAgcmVjZWl2ZXIub24oJ21lc3NhZ2UnLCByZWNlaXZlck9uTWVzc2FnZSk7XG4gICAgcmVjZWl2ZXIub24oJ3BpbmcnLCByZWNlaXZlck9uUGluZyk7XG4gICAgcmVjZWl2ZXIub24oJ3BvbmcnLCByZWNlaXZlck9uUG9uZyk7XG5cbiAgICBzb2NrZXQuc2V0VGltZW91dCgwKTtcbiAgICBzb2NrZXQuc2V0Tm9EZWxheSgpO1xuXG4gICAgaWYgKGhlYWQubGVuZ3RoID4gMCkgc29ja2V0LnVuc2hpZnQoaGVhZCk7XG5cbiAgICBzb2NrZXQub24oJ2Nsb3NlJywgc29ja2V0T25DbG9zZSk7XG4gICAgc29ja2V0Lm9uKCdkYXRhJywgc29ja2V0T25EYXRhKTtcbiAgICBzb2NrZXQub24oJ2VuZCcsIHNvY2tldE9uRW5kKTtcbiAgICBzb2NrZXQub24oJ2Vycm9yJywgc29ja2V0T25FcnJvcik7XG5cbiAgICB0aGlzLl9yZWFkeVN0YXRlID0gV2ViU29ja2V0Lk9QRU47XG4gICAgdGhpcy5lbWl0KCdvcGVuJyk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB0aGUgYCdjbG9zZSdgIGV2ZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdENsb3NlKCkge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSB7XG4gICAgICB0aGlzLl9yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNMT1NFRDtcbiAgICAgIHRoaXMuZW1pdCgnY2xvc2UnLCB0aGlzLl9jbG9zZUNvZGUsIHRoaXMuX2Nsb3NlTWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIHRoaXMuX2V4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0uY2xlYW51cCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3JlY2VpdmVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMuX3JlYWR5U3RhdGUgPSBXZWJTb2NrZXQuQ0xPU0VEO1xuICAgIHRoaXMuZW1pdCgnY2xvc2UnLCB0aGlzLl9jbG9zZUNvZGUsIHRoaXMuX2Nsb3NlTWVzc2FnZSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgYSBjbG9zaW5nIGhhbmRzaGFrZS5cbiAgICpcbiAgICogICAgICAgICAgKy0tLS0tLS0tLS0rICAgKy0tLS0tLS0tLS0tKyAgICstLS0tLS0tLS0tK1xuICAgKiAgICAgLSAtIC18d3MuY2xvc2UoKXwtLT58Y2xvc2UgZnJhbWV8LS0+fHdzLmNsb3NlKCl8LSAtIC1cbiAgICogICAgfCAgICAgKy0tLS0tLS0tLS0rICAgKy0tLS0tLS0tLS0tKyAgICstLS0tLS0tLS0tKyAgICAgfFxuICAgKiAgICAgICAgICArLS0tLS0tLS0tLSsgICArLS0tLS0tLS0tLS0rICAgICAgICAgfFxuICAgKiBDTE9TSU5HICB8d3MuY2xvc2UoKXw8LS18Y2xvc2UgZnJhbWV8PC0tKy0tLS0tKyAgICAgICBDTE9TSU5HXG4gICAqICAgICAgICAgICstLS0tLS0tLS0tKyAgICstLS0tLS0tLS0tLSsgICB8XG4gICAqICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICB8ICAgKy0tLSsgICAgICAgIHxcbiAgICogICAgICAgICAgICAgICAgKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLT58ZmlufCAtIC0gLSAtXG4gICAqICAgIHwgICAgICAgICArLS0tKyAgICAgICAgICAgICAgICAgICAgICB8ICAgKy0tLStcbiAgICogICAgIC0gLSAtIC0gLXxmaW58PC0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAgICogICAgICAgICAgICAgICstLS0rXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbY29kZV0gU3RhdHVzIGNvZGUgZXhwbGFpbmluZyB3aHkgdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2luZ1xuICAgKiBAcGFyYW0geyhTdHJpbmd8QnVmZmVyKX0gW2RhdGFdIFRoZSByZWFzb24gd2h5IHRoZSBjb25uZWN0aW9uIGlzXG4gICAqICAgICBjbG9zaW5nXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGNsb3NlKGNvZGUsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuQ0xPU0VEKSByZXR1cm47XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIGNvbnN0IG1zZyA9ICdXZWJTb2NrZXQgd2FzIGNsb3NlZCBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gd2FzIGVzdGFibGlzaGVkJztcbiAgICAgIHJldHVybiBhYm9ydEhhbmRzaGFrZSh0aGlzLCB0aGlzLl9yZXEsIG1zZyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNMT1NJTkcpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fY2xvc2VGcmFtZVNlbnQgJiZcbiAgICAgICAgKHRoaXMuX2Nsb3NlRnJhbWVSZWNlaXZlZCB8fCB0aGlzLl9yZWNlaXZlci5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVuZCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5DTE9TSU5HO1xuICAgIHRoaXMuX3NlbmRlci5jbG9zZShjb2RlLCBkYXRhLCAhdGhpcy5faXNTZXJ2ZXIsIChlcnIpID0+IHtcbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIGVycm9yIGlzIGhhbmRsZWQgYnkgdGhlIGAnZXJyb3InYCBsaXN0ZW5lciBvbiB0aGUgc29ja2V0LiBXZSBvbmx5XG4gICAgICAvLyB3YW50IHRvIGtub3cgaWYgdGhlIGNsb3NlIGZyYW1lIGhhcyBiZWVuIHNlbnQgaGVyZS5cbiAgICAgIC8vXG4gICAgICBpZiAoZXJyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX2Nsb3NlRnJhbWVTZW50ID0gdHJ1ZTtcblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9jbG9zZUZyYW1lUmVjZWl2ZWQgfHxcbiAgICAgICAgdGhpcy5fcmVjZWl2ZXIuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fc29ja2V0LmVuZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9cbiAgICAvLyBTcGVjaWZ5IGEgdGltZW91dCBmb3IgdGhlIGNsb3NpbmcgaGFuZHNoYWtlIHRvIGNvbXBsZXRlLlxuICAgIC8vXG4gICAgdGhpcy5fY2xvc2VUaW1lciA9IHNldFRpbWVvdXQoXG4gICAgICB0aGlzLl9zb2NrZXQuZGVzdHJveS5iaW5kKHRoaXMuX3NvY2tldCksXG4gICAgICBjbG9zZVRpbWVvdXRcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdXNlIHRoZSBzb2NrZXQuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHBhdXNlKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcgfHxcbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNMT1NFRFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BhdXNlZCA9IHRydWU7XG4gICAgdGhpcy5fc29ja2V0LnBhdXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIHBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gW2RhdGFdIFRoZSBkYXRhIHRvIHNlbmRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbbWFza10gSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIG1hc2sgYGRhdGFgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gQ2FsbGJhY2sgd2hpY2ggaXMgZXhlY3V0ZWQgd2hlbiB0aGUgcGluZyBpcyBzZW50XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHBpbmcoZGF0YSwgbWFzaywgY2IpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuQ09OTkVDVElORykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWJTb2NrZXQgaXMgbm90IG9wZW46IHJlYWR5U3RhdGUgMCAoQ09OTkVDVElORyknKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNiID0gZGF0YTtcbiAgICAgIGRhdGEgPSBtYXNrID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1hc2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNiID0gbWFzaztcbiAgICAgIG1hc2sgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJykgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcblxuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICBzZW5kQWZ0ZXJDbG9zZSh0aGlzLCBkYXRhLCBjYik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hc2sgPT09IHVuZGVmaW5lZCkgbWFzayA9ICF0aGlzLl9pc1NlcnZlcjtcbiAgICB0aGlzLl9zZW5kZXIucGluZyhkYXRhIHx8IEVNUFRZX0JVRkZFUiwgbWFzaywgY2IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBwb25nLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IFtkYXRhXSBUaGUgZGF0YSB0byBzZW5kXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW21hc2tdIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIENhbGxiYWNrIHdoaWNoIGlzIGV4ZWN1dGVkIHdoZW4gdGhlIHBvbmcgaXMgc2VudFxuICAgKiBAcHVibGljXG4gICAqL1xuICBwb25nKGRhdGEsIG1hc2ssIGNiKSB7XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2ViU29ja2V0IGlzIG5vdCBvcGVuOiByZWFkeVN0YXRlIDAgKENPTk5FQ1RJTkcpJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IGRhdGE7XG4gICAgICBkYXRhID0gbWFzayA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtYXNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IG1hc2s7XG4gICAgICBtYXNrID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicpIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgc2VuZEFmdGVyQ2xvc2UodGhpcywgZGF0YSwgY2IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtYXNrID09PSB1bmRlZmluZWQpIG1hc2sgPSAhdGhpcy5faXNTZXJ2ZXI7XG4gICAgdGhpcy5fc2VuZGVyLnBvbmcoZGF0YSB8fCBFTVBUWV9CVUZGRVIsIG1hc2ssIGNiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN1bWUgdGhlIHNvY2tldC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcmVzdW1lKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcgfHxcbiAgICAgIHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNMT1NFRFxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5fcmVjZWl2ZXIuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKSB0aGlzLl9zb2NrZXQucmVzdW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIGRhdGEgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBkYXRhIFRoZSBtZXNzYWdlIHRvIHNlbmRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBPcHRpb25zIG9iamVjdFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJpbmFyeV0gU3BlY2lmaWVzIHdoZXRoZXIgYGRhdGFgIGlzIGJpbmFyeSBvclxuICAgKiAgICAgdGV4dFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvbXByZXNzXSBTcGVjaWZpZXMgd2hldGhlciBvciBub3QgdG8gY29tcHJlc3NcbiAgICogICAgIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZpbj10cnVlXSBTcGVjaWZpZXMgd2hldGhlciB0aGUgZnJhZ21lbnQgaXMgdGhlXG4gICAqICAgICBsYXN0IG9uZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLm1hc2tdIFNwZWNpZmllcyB3aGV0aGVyIG9yIG5vdCB0byBtYXNrIGBkYXRhYFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIENhbGxiYWNrIHdoaWNoIGlzIGV4ZWN1dGVkIHdoZW4gZGF0YSBpcyB3cml0dGVuIG91dFxuICAgKiBAcHVibGljXG4gICAqL1xuICBzZW5kKGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2ViU29ja2V0IGlzIG5vdCBvcGVuOiByZWFkeVN0YXRlIDAgKENPTk5FQ1RJTkcpJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYiA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJykgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcblxuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSB7XG4gICAgICBzZW5kQWZ0ZXJDbG9zZSh0aGlzLCBkYXRhLCBjYik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIGJpbmFyeTogdHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnLFxuICAgICAgbWFzazogIXRoaXMuX2lzU2VydmVyLFxuICAgICAgY29tcHJlc3M6IHRydWUsXG4gICAgICBmaW46IHRydWUsXG4gICAgICAuLi5vcHRpb25zXG4gICAgfTtcblxuICAgIGlmICghdGhpcy5fZXh0ZW5zaW9uc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXSkge1xuICAgICAgb3B0cy5jb21wcmVzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX3NlbmRlci5zZW5kKGRhdGEgfHwgRU1QVFlfQlVGRkVSLCBvcHRzLCBjYik7XG4gIH1cblxuICAvKipcbiAgICogRm9yY2libHkgY2xvc2UgdGhlIGNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHRlcm1pbmF0ZSgpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuQ0xPU0VEKSByZXR1cm47XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpIHtcbiAgICAgIGNvbnN0IG1zZyA9ICdXZWJTb2NrZXQgd2FzIGNsb3NlZCBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gd2FzIGVzdGFibGlzaGVkJztcbiAgICAgIHJldHVybiBhYm9ydEhhbmRzaGFrZSh0aGlzLCB0aGlzLl9yZXEsIG1zZyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NvY2tldCkge1xuICAgICAgdGhpcy5fcmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5DTE9TSU5HO1xuICAgICAgdGhpcy5fc29ja2V0LmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAY29uc3RhbnQge051bWJlcn0gQ09OTkVDVElOR1xuICogQG1lbWJlcm9mIFdlYlNvY2tldFxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoV2ViU29ja2V0LCAnQ09OTkVDVElORycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgdmFsdWU6IHJlYWR5U3RhdGVzLmluZGV4T2YoJ0NPTk5FQ1RJTkcnKVxufSk7XG5cbi8qKlxuICogQGNvbnN0YW50IHtOdW1iZXJ9IENPTk5FQ1RJTkdcbiAqIEBtZW1iZXJvZiBXZWJTb2NrZXQucHJvdG90eXBlXG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXZWJTb2NrZXQucHJvdG90eXBlLCAnQ09OTkVDVElORycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgdmFsdWU6IHJlYWR5U3RhdGVzLmluZGV4T2YoJ0NPTk5FQ1RJTkcnKVxufSk7XG5cbi8qKlxuICogQGNvbnN0YW50IHtOdW1iZXJ9IE9QRU5cbiAqIEBtZW1iZXJvZiBXZWJTb2NrZXRcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdlYlNvY2tldCwgJ09QRU4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHZhbHVlOiByZWFkeVN0YXRlcy5pbmRleE9mKCdPUEVOJylcbn0pO1xuXG4vKipcbiAqIEBjb25zdGFudCB7TnVtYmVyfSBPUEVOXG4gKiBAbWVtYmVyb2YgV2ViU29ja2V0LnByb3RvdHlwZVxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoV2ViU29ja2V0LnByb3RvdHlwZSwgJ09QRU4nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHZhbHVlOiByZWFkeVN0YXRlcy5pbmRleE9mKCdPUEVOJylcbn0pO1xuXG4vKipcbiAqIEBjb25zdGFudCB7TnVtYmVyfSBDTE9TSU5HXG4gKiBAbWVtYmVyb2YgV2ViU29ja2V0XG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXZWJTb2NrZXQsICdDTE9TSU5HJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICB2YWx1ZTogcmVhZHlTdGF0ZXMuaW5kZXhPZignQ0xPU0lORycpXG59KTtcblxuLyoqXG4gKiBAY29uc3RhbnQge051bWJlcn0gQ0xPU0lOR1xuICogQG1lbWJlcm9mIFdlYlNvY2tldC5wcm90b3R5cGVcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdlYlNvY2tldC5wcm90b3R5cGUsICdDTE9TSU5HJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICB2YWx1ZTogcmVhZHlTdGF0ZXMuaW5kZXhPZignQ0xPU0lORycpXG59KTtcblxuLyoqXG4gKiBAY29uc3RhbnQge051bWJlcn0gQ0xPU0VEXG4gKiBAbWVtYmVyb2YgV2ViU29ja2V0XG4gKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShXZWJTb2NrZXQsICdDTE9TRUQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHZhbHVlOiByZWFkeVN0YXRlcy5pbmRleE9mKCdDTE9TRUQnKVxufSk7XG5cbi8qKlxuICogQGNvbnN0YW50IHtOdW1iZXJ9IENMT1NFRFxuICogQG1lbWJlcm9mIFdlYlNvY2tldC5wcm90b3R5cGVcbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFdlYlNvY2tldC5wcm90b3R5cGUsICdDTE9TRUQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIHZhbHVlOiByZWFkeVN0YXRlcy5pbmRleE9mKCdDTE9TRUQnKVxufSk7XG5cbltcbiAgJ2JpbmFyeVR5cGUnLFxuICAnYnVmZmVyZWRBbW91bnQnLFxuICAnZXh0ZW5zaW9ucycsXG4gICdpc1BhdXNlZCcsXG4gICdwcm90b2NvbCcsXG4gICdyZWFkeVN0YXRlJyxcbiAgJ3VybCdcbl0uZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdlYlNvY2tldC5wcm90b3R5cGUsIHByb3BlcnR5LCB7IGVudW1lcmFibGU6IHRydWUgfSk7XG59KTtcblxuLy9cbi8vIEFkZCB0aGUgYG9ub3BlbmAsIGBvbmVycm9yYCwgYG9uY2xvc2VgLCBhbmQgYG9ubWVzc2FnZWAgYXR0cmlidXRlcy5cbi8vIFNlZSBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9jb21tcy5odG1sI3RoZS13ZWJzb2NrZXQtaW50ZXJmYWNlXG4vL1xuWydvcGVuJywgJ2Vycm9yJywgJ2Nsb3NlJywgJ21lc3NhZ2UnXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdlYlNvY2tldC5wcm90b3R5cGUsIGBvbiR7bWV0aG9kfWAsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldCgpIHtcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMobWV0aG9kKSkge1xuICAgICAgICBpZiAobGlzdGVuZXJba0Zvck9uRXZlbnRBdHRyaWJ1dGVdKSByZXR1cm4gbGlzdGVuZXJba0xpc3RlbmVyXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBzZXQoaGFuZGxlcikge1xuICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycyhtZXRob2QpKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lcltrRm9yT25FdmVudEF0dHJpYnV0ZV0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKG1ldGhvZCwgbGlzdGVuZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIobWV0aG9kLCBoYW5kbGVyLCB7XG4gICAgICAgIFtrRm9yT25FdmVudEF0dHJpYnV0ZV06IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuV2ViU29ja2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gYWRkRXZlbnRMaXN0ZW5lcjtcbldlYlNvY2tldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHJlbW92ZUV2ZW50TGlzdGVuZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBXZWJTb2NrZXQgY2xpZW50LlxuICpcbiAqIEBwYXJhbSB7V2ViU29ja2V0fSB3ZWJzb2NrZXQgVGhlIGNsaWVudCB0byBpbml0aWFsaXplXG4gKiBAcGFyYW0geyhTdHJpbmd8VVJMKX0gYWRkcmVzcyBUaGUgVVJMIHRvIHdoaWNoIHRvIGNvbm5lY3RcbiAqIEBwYXJhbSB7QXJyYXl9IHByb3RvY29scyBUaGUgc3VicHJvdG9jb2xzXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIENvbm5lY3Rpb24gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5mb2xsb3dSZWRpcmVjdHM9ZmFsc2VdIFdoZXRoZXIgb3Igbm90IHRvIGZvbGxvd1xuICogICAgIHJlZGlyZWN0c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZ2VuZXJhdGVNYXNrXSBUaGUgZnVuY3Rpb24gdXNlZCB0byBnZW5lcmF0ZSB0aGVcbiAqICAgICBtYXNraW5nIGtleVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhhbmRzaGFrZVRpbWVvdXRdIFRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGVcbiAqICAgICBoYW5kc2hha2UgcmVxdWVzdFxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heFBheWxvYWQ9MTA0ODU3NjAwXSBUaGUgbWF4aW11bSBhbGxvd2VkIG1lc3NhZ2VcbiAqICAgICBzaXplXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4UmVkaXJlY3RzPTEwXSBUaGUgbWF4aW11bSBudW1iZXIgb2YgcmVkaXJlY3RzXG4gKiAgICAgYWxsb3dlZFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm9yaWdpbl0gVmFsdWUgb2YgdGhlIGBPcmlnaW5gIG9yXG4gKiAgICAgYFNlYy1XZWJTb2NrZXQtT3JpZ2luYCBoZWFkZXJcbiAqIEBwYXJhbSB7KEJvb2xlYW58T2JqZWN0KX0gW29wdGlvbnMucGVyTWVzc2FnZURlZmxhdGU9dHJ1ZV0gRW5hYmxlL2Rpc2FibGVcbiAqICAgICBwZXJtZXNzYWdlLWRlZmxhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5wcm90b2NvbFZlcnNpb249MTNdIFZhbHVlIG9mIHRoZVxuICogICAgIGBTZWMtV2ViU29ja2V0LVZlcnNpb25gIGhlYWRlclxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5za2lwVVRGOFZhbGlkYXRpb249ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yXG4gKiAgICAgbm90IHRvIHNraXAgVVRGLTggdmFsaWRhdGlvbiBmb3IgdGV4dCBhbmQgY2xvc2UgbWVzc2FnZXNcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGluaXRBc0NsaWVudCh3ZWJzb2NrZXQsIGFkZHJlc3MsIHByb3RvY29scywgb3B0aW9ucykge1xuICBjb25zdCBvcHRzID0ge1xuICAgIHByb3RvY29sVmVyc2lvbjogcHJvdG9jb2xWZXJzaW9uc1sxXSxcbiAgICBtYXhQYXlsb2FkOiAxMDAgKiAxMDI0ICogMTAyNCxcbiAgICBza2lwVVRGOFZhbGlkYXRpb246IGZhbHNlLFxuICAgIHBlck1lc3NhZ2VEZWZsYXRlOiB0cnVlLFxuICAgIGZvbGxvd1JlZGlyZWN0czogZmFsc2UsXG4gICAgbWF4UmVkaXJlY3RzOiAxMCxcbiAgICAuLi5vcHRpb25zLFxuICAgIGNyZWF0ZUNvbm5lY3Rpb246IHVuZGVmaW5lZCxcbiAgICBzb2NrZXRQYXRoOiB1bmRlZmluZWQsXG4gICAgaG9zdG5hbWU6IHVuZGVmaW5lZCxcbiAgICBwcm90b2NvbDogdW5kZWZpbmVkLFxuICAgIHRpbWVvdXQ6IHVuZGVmaW5lZCxcbiAgICBtZXRob2Q6IHVuZGVmaW5lZCxcbiAgICBob3N0OiB1bmRlZmluZWQsXG4gICAgcGF0aDogdW5kZWZpbmVkLFxuICAgIHBvcnQ6IHVuZGVmaW5lZFxuICB9O1xuXG4gIGlmICghcHJvdG9jb2xWZXJzaW9ucy5pbmNsdWRlcyhvcHRzLnByb3RvY29sVmVyc2lvbikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgIGBVbnN1cHBvcnRlZCBwcm90b2NvbCB2ZXJzaW9uOiAke29wdHMucHJvdG9jb2xWZXJzaW9ufSBgICtcbiAgICAgICAgYChzdXBwb3J0ZWQgdmVyc2lvbnM6ICR7cHJvdG9jb2xWZXJzaW9ucy5qb2luKCcsICcpfSlgXG4gICAgKTtcbiAgfVxuXG4gIGxldCBwYXJzZWRVcmw7XG5cbiAgaWYgKGFkZHJlc3MgaW5zdGFuY2VvZiBVUkwpIHtcbiAgICBwYXJzZWRVcmwgPSBhZGRyZXNzO1xuICAgIHdlYnNvY2tldC5fdXJsID0gYWRkcmVzcy5ocmVmO1xuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVcmwgPSBuZXcgVVJMKGFkZHJlc3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihgSW52YWxpZCBVUkw6ICR7YWRkcmVzc31gKTtcbiAgICB9XG5cbiAgICB3ZWJzb2NrZXQuX3VybCA9IGFkZHJlc3M7XG4gIH1cblxuICBjb25zdCBpc1NlY3VyZSA9IHBhcnNlZFVybC5wcm90b2NvbCA9PT0gJ3dzczonO1xuICBjb25zdCBpc1VuaXhTb2NrZXQgPSBwYXJzZWRVcmwucHJvdG9jb2wgPT09ICd3cyt1bml4Oic7XG4gIGxldCBpbnZhbGlkVVJMTWVzc2FnZTtcblxuICBpZiAocGFyc2VkVXJsLnByb3RvY29sICE9PSAnd3M6JyAmJiAhaXNTZWN1cmUgJiYgIWlzVW5peFNvY2tldCkge1xuICAgIGludmFsaWRVUkxNZXNzYWdlID1cbiAgICAgICdUaGUgVVJMXFwncyBwcm90b2NvbCBtdXN0IGJlIG9uZSBvZiBcIndzOlwiLCBcIndzczpcIiwgb3IgXCJ3cyt1bml4OlwiJztcbiAgfSBlbHNlIGlmIChpc1VuaXhTb2NrZXQgJiYgIXBhcnNlZFVybC5wYXRobmFtZSkge1xuICAgIGludmFsaWRVUkxNZXNzYWdlID0gXCJUaGUgVVJMJ3MgcGF0aG5hbWUgaXMgZW1wdHlcIjtcbiAgfSBlbHNlIGlmIChwYXJzZWRVcmwuaGFzaCkge1xuICAgIGludmFsaWRVUkxNZXNzYWdlID0gJ1RoZSBVUkwgY29udGFpbnMgYSBmcmFnbWVudCBpZGVudGlmaWVyJztcbiAgfVxuXG4gIGlmIChpbnZhbGlkVVJMTWVzc2FnZSkge1xuICAgIGNvbnN0IGVyciA9IG5ldyBTeW50YXhFcnJvcihpbnZhbGlkVVJMTWVzc2FnZSk7XG5cbiAgICBpZiAod2Vic29ja2V0Ll9yZWRpcmVjdHMgPT09IDApIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdEVycm9yQW5kQ2xvc2Uod2Vic29ja2V0LCBlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRlZmF1bHRQb3J0ID0gaXNTZWN1cmUgPyA0NDMgOiA4MDtcbiAgY29uc3Qga2V5ID0gcmFuZG9tQnl0ZXMoMTYpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgY29uc3QgZ2V0ID0gaXNTZWN1cmUgPyBodHRwcy5nZXQgOiBodHRwLmdldDtcbiAgY29uc3QgcHJvdG9jb2xTZXQgPSBuZXcgU2V0KCk7XG4gIGxldCBwZXJNZXNzYWdlRGVmbGF0ZTtcblxuICBvcHRzLmNyZWF0ZUNvbm5lY3Rpb24gPSBpc1NlY3VyZSA/IHRsc0Nvbm5lY3QgOiBuZXRDb25uZWN0O1xuICBvcHRzLmRlZmF1bHRQb3J0ID0gb3B0cy5kZWZhdWx0UG9ydCB8fCBkZWZhdWx0UG9ydDtcbiAgb3B0cy5wb3J0ID0gcGFyc2VkVXJsLnBvcnQgfHwgZGVmYXVsdFBvcnQ7XG4gIG9wdHMuaG9zdCA9IHBhcnNlZFVybC5ob3N0bmFtZS5zdGFydHNXaXRoKCdbJylcbiAgICA/IHBhcnNlZFVybC5ob3N0bmFtZS5zbGljZSgxLCAtMSlcbiAgICA6IHBhcnNlZFVybC5ob3N0bmFtZTtcbiAgb3B0cy5oZWFkZXJzID0ge1xuICAgICdTZWMtV2ViU29ja2V0LVZlcnNpb24nOiBvcHRzLnByb3RvY29sVmVyc2lvbixcbiAgICAnU2VjLVdlYlNvY2tldC1LZXknOiBrZXksXG4gICAgQ29ubmVjdGlvbjogJ1VwZ3JhZGUnLFxuICAgIFVwZ3JhZGU6ICd3ZWJzb2NrZXQnLFxuICAgIC4uLm9wdHMuaGVhZGVyc1xuICB9O1xuICBvcHRzLnBhdGggPSBwYXJzZWRVcmwucGF0aG5hbWUgKyBwYXJzZWRVcmwuc2VhcmNoO1xuICBvcHRzLnRpbWVvdXQgPSBvcHRzLmhhbmRzaGFrZVRpbWVvdXQ7XG5cbiAgaWYgKG9wdHMucGVyTWVzc2FnZURlZmxhdGUpIHtcbiAgICBwZXJNZXNzYWdlRGVmbGF0ZSA9IG5ldyBQZXJNZXNzYWdlRGVmbGF0ZShcbiAgICAgIG9wdHMucGVyTWVzc2FnZURlZmxhdGUgIT09IHRydWUgPyBvcHRzLnBlck1lc3NhZ2VEZWZsYXRlIDoge30sXG4gICAgICBmYWxzZSxcbiAgICAgIG9wdHMubWF4UGF5bG9hZFxuICAgICk7XG4gICAgb3B0cy5oZWFkZXJzWydTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnMnXSA9IGZvcm1hdCh7XG4gICAgICBbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV06IHBlck1lc3NhZ2VEZWZsYXRlLm9mZmVyKClcbiAgICB9KTtcbiAgfVxuICBpZiAocHJvdG9jb2xzLmxlbmd0aCkge1xuICAgIGZvciAoY29uc3QgcHJvdG9jb2wgb2YgcHJvdG9jb2xzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBwcm90b2NvbCAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgIXN1YnByb3RvY29sUmVnZXgudGVzdChwcm90b2NvbCkgfHxcbiAgICAgICAgcHJvdG9jb2xTZXQuaGFzKHByb3RvY29sKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcbiAgICAgICAgICAnQW4gaW52YWxpZCBvciBkdXBsaWNhdGVkIHN1YnByb3RvY29sIHdhcyBzcGVjaWZpZWQnXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHByb3RvY29sU2V0LmFkZChwcm90b2NvbCk7XG4gICAgfVxuXG4gICAgb3B0cy5oZWFkZXJzWydTZWMtV2ViU29ja2V0LVByb3RvY29sJ10gPSBwcm90b2NvbHMuam9pbignLCcpO1xuICB9XG4gIGlmIChvcHRzLm9yaWdpbikge1xuICAgIGlmIChvcHRzLnByb3RvY29sVmVyc2lvbiA8IDEzKSB7XG4gICAgICBvcHRzLmhlYWRlcnNbJ1NlYy1XZWJTb2NrZXQtT3JpZ2luJ10gPSBvcHRzLm9yaWdpbjtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0cy5oZWFkZXJzLk9yaWdpbiA9IG9wdHMub3JpZ2luO1xuICAgIH1cbiAgfVxuICBpZiAocGFyc2VkVXJsLnVzZXJuYW1lIHx8IHBhcnNlZFVybC5wYXNzd29yZCkge1xuICAgIG9wdHMuYXV0aCA9IGAke3BhcnNlZFVybC51c2VybmFtZX06JHtwYXJzZWRVcmwucGFzc3dvcmR9YDtcbiAgfVxuXG4gIGlmIChpc1VuaXhTb2NrZXQpIHtcbiAgICBjb25zdCBwYXJ0cyA9IG9wdHMucGF0aC5zcGxpdCgnOicpO1xuXG4gICAgb3B0cy5zb2NrZXRQYXRoID0gcGFydHNbMF07XG4gICAgb3B0cy5wYXRoID0gcGFydHNbMV07XG4gIH1cblxuICBpZiAob3B0cy5mb2xsb3dSZWRpcmVjdHMpIHtcbiAgICBpZiAod2Vic29ja2V0Ll9yZWRpcmVjdHMgPT09IDApIHtcbiAgICAgIHdlYnNvY2tldC5fb3JpZ2luYWxIb3N0ID0gcGFyc2VkVXJsLmhvc3Q7XG5cbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zICYmIG9wdGlvbnMuaGVhZGVycztcblxuICAgICAgLy9cbiAgICAgIC8vIFNoYWxsb3cgY29weSB0aGUgdXNlciBwcm92aWRlZCBvcHRpb25zIHNvIHRoYXQgaGVhZGVycyBjYW4gYmUgY2hhbmdlZFxuICAgICAgLy8gd2l0aG91dCBtdXRhdGluZyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgLy9cbiAgICAgIG9wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGhlYWRlcnM6IHt9IH07XG5cbiAgICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGhlYWRlcnMpKSB7XG4gICAgICAgICAgb3B0aW9ucy5oZWFkZXJzW2tleS50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwYXJzZWRVcmwuaG9zdCAhPT0gd2Vic29ja2V0Ll9vcmlnaW5hbEhvc3QpIHtcbiAgICAgIC8vXG4gICAgICAvLyBNYXRjaCBjdXJsIDcuNzcuMCBiZWhhdmlvciBhbmQgZHJvcCB0aGUgZm9sbG93aW5nIGhlYWRlcnMuIFRoZXNlXG4gICAgICAvLyBoZWFkZXJzIGFyZSBhbHNvIGRyb3BwZWQgd2hlbiBmb2xsb3dpbmcgYSByZWRpcmVjdCB0byBhIHN1YmRvbWFpbi5cbiAgICAgIC8vXG4gICAgICBkZWxldGUgb3B0cy5oZWFkZXJzLmF1dGhvcml6YXRpb247XG4gICAgICBkZWxldGUgb3B0cy5oZWFkZXJzLmNvb2tpZTtcbiAgICAgIGRlbGV0ZSBvcHRzLmhlYWRlcnMuaG9zdDtcbiAgICAgIG9wdHMuYXV0aCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIE1hdGNoIGN1cmwgNy43Ny4wIGJlaGF2aW9yIGFuZCBtYWtlIHRoZSBmaXJzdCBgQXV0aG9yaXphdGlvbmAgaGVhZGVyIHdpbi5cbiAgICAvLyBJZiB0aGUgYEF1dGhvcml6YXRpb25gIGhlYWRlciBpcyBzZXQsIHRoZW4gdGhlcmUgaXMgbm90aGluZyB0byBkbyBhcyBpdFxuICAgIC8vIHdpbGwgdGFrZSBwcmVjZWRlbmNlLlxuICAgIC8vXG4gICAgaWYgKG9wdHMuYXV0aCAmJiAhb3B0aW9ucy5oZWFkZXJzLmF1dGhvcml6YXRpb24pIHtcbiAgICAgIG9wdGlvbnMuaGVhZGVycy5hdXRob3JpemF0aW9uID1cbiAgICAgICAgJ0Jhc2ljICcgKyBCdWZmZXIuZnJvbShvcHRzLmF1dGgpLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICB9XG4gIH1cblxuICBsZXQgcmVxID0gKHdlYnNvY2tldC5fcmVxID0gZ2V0KG9wdHMpKTtcblxuICBpZiAob3B0cy50aW1lb3V0KSB7XG4gICAgcmVxLm9uKCd0aW1lb3V0JywgKCkgPT4ge1xuICAgICAgYWJvcnRIYW5kc2hha2Uod2Vic29ja2V0LCByZXEsICdPcGVuaW5nIGhhbmRzaGFrZSBoYXMgdGltZWQgb3V0Jyk7XG4gICAgfSk7XG4gIH1cblxuICByZXEub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgIGlmIChyZXEgPT09IG51bGwgfHwgcmVxLmFib3J0ZWQpIHJldHVybjtcblxuICAgIHJlcSA9IHdlYnNvY2tldC5fcmVxID0gbnVsbDtcbiAgICBlbWl0RXJyb3JBbmRDbG9zZSh3ZWJzb2NrZXQsIGVycik7XG4gIH0pO1xuXG4gIHJlcS5vbigncmVzcG9uc2UnLCAocmVzKSA9PiB7XG4gICAgY29uc3QgbG9jYXRpb24gPSByZXMuaGVhZGVycy5sb2NhdGlvbjtcbiAgICBjb25zdCBzdGF0dXNDb2RlID0gcmVzLnN0YXR1c0NvZGU7XG5cbiAgICBpZiAoXG4gICAgICBsb2NhdGlvbiAmJlxuICAgICAgb3B0cy5mb2xsb3dSZWRpcmVjdHMgJiZcbiAgICAgIHN0YXR1c0NvZGUgPj0gMzAwICYmXG4gICAgICBzdGF0dXNDb2RlIDwgNDAwXG4gICAgKSB7XG4gICAgICBpZiAoKyt3ZWJzb2NrZXQuX3JlZGlyZWN0cyA+IG9wdHMubWF4UmVkaXJlY3RzKSB7XG4gICAgICAgIGFib3J0SGFuZHNoYWtlKHdlYnNvY2tldCwgcmVxLCAnTWF4aW11bSByZWRpcmVjdHMgZXhjZWVkZWQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXEuYWJvcnQoKTtcblxuICAgICAgbGV0IGFkZHI7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGFkZHIgPSBuZXcgVVJMKGxvY2F0aW9uLCBhZGRyZXNzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IFN5bnRheEVycm9yKGBJbnZhbGlkIFVSTDogJHtsb2NhdGlvbn1gKTtcbiAgICAgICAgZW1pdEVycm9yQW5kQ2xvc2Uod2Vic29ja2V0LCBlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGluaXRBc0NsaWVudCh3ZWJzb2NrZXQsIGFkZHIsIHByb3RvY29scywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmICghd2Vic29ja2V0LmVtaXQoJ3VuZXhwZWN0ZWQtcmVzcG9uc2UnLCByZXEsIHJlcykpIHtcbiAgICAgIGFib3J0SGFuZHNoYWtlKFxuICAgICAgICB3ZWJzb2NrZXQsXG4gICAgICAgIHJlcSxcbiAgICAgICAgYFVuZXhwZWN0ZWQgc2VydmVyIHJlc3BvbnNlOiAke3Jlcy5zdGF0dXNDb2RlfWBcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICByZXEub24oJ3VwZ3JhZGUnLCAocmVzLCBzb2NrZXQsIGhlYWQpID0+IHtcbiAgICB3ZWJzb2NrZXQuZW1pdCgndXBncmFkZScsIHJlcyk7XG5cbiAgICAvL1xuICAgIC8vIFRoZSB1c2VyIG1heSBoYXZlIGNsb3NlZCB0aGUgY29ubmVjdGlvbiBmcm9tIGEgbGlzdGVuZXIgb2YgdGhlIGB1cGdyYWRlYFxuICAgIC8vIGV2ZW50LlxuICAgIC8vXG4gICAgaWYgKHdlYnNvY2tldC5yZWFkeVN0YXRlICE9PSBXZWJTb2NrZXQuQ09OTkVDVElORykgcmV0dXJuO1xuXG4gICAgcmVxID0gd2Vic29ja2V0Ll9yZXEgPSBudWxsO1xuXG4gICAgY29uc3QgZGlnZXN0ID0gY3JlYXRlSGFzaCgnc2hhMScpXG4gICAgICAudXBkYXRlKGtleSArIEdVSUQpXG4gICAgICAuZGlnZXN0KCdiYXNlNjQnKTtcblxuICAgIGlmIChyZXMuaGVhZGVyc1snc2VjLXdlYnNvY2tldC1hY2NlcHQnXSAhPT0gZGlnZXN0KSB7XG4gICAgICBhYm9ydEhhbmRzaGFrZSh3ZWJzb2NrZXQsIHNvY2tldCwgJ0ludmFsaWQgU2VjLVdlYlNvY2tldC1BY2NlcHQgaGVhZGVyJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VydmVyUHJvdCA9IHJlcy5oZWFkZXJzWydzZWMtd2Vic29ja2V0LXByb3RvY29sJ107XG4gICAgbGV0IHByb3RFcnJvcjtcblxuICAgIGlmIChzZXJ2ZXJQcm90ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghcHJvdG9jb2xTZXQuc2l6ZSkge1xuICAgICAgICBwcm90RXJyb3IgPSAnU2VydmVyIHNlbnQgYSBzdWJwcm90b2NvbCBidXQgbm9uZSB3YXMgcmVxdWVzdGVkJztcbiAgICAgIH0gZWxzZSBpZiAoIXByb3RvY29sU2V0LmhhcyhzZXJ2ZXJQcm90KSkge1xuICAgICAgICBwcm90RXJyb3IgPSAnU2VydmVyIHNlbnQgYW4gaW52YWxpZCBzdWJwcm90b2NvbCc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcm90b2NvbFNldC5zaXplKSB7XG4gICAgICBwcm90RXJyb3IgPSAnU2VydmVyIHNlbnQgbm8gc3VicHJvdG9jb2wnO1xuICAgIH1cblxuICAgIGlmIChwcm90RXJyb3IpIHtcbiAgICAgIGFib3J0SGFuZHNoYWtlKHdlYnNvY2tldCwgc29ja2V0LCBwcm90RXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzZXJ2ZXJQcm90KSB3ZWJzb2NrZXQuX3Byb3RvY29sID0gc2VydmVyUHJvdDtcblxuICAgIGNvbnN0IHNlY1dlYlNvY2tldEV4dGVuc2lvbnMgPSByZXMuaGVhZGVyc1snc2VjLXdlYnNvY2tldC1leHRlbnNpb25zJ107XG5cbiAgICBpZiAoc2VjV2ViU29ja2V0RXh0ZW5zaW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXBlck1lc3NhZ2VEZWZsYXRlKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPVxuICAgICAgICAgICdTZXJ2ZXIgc2VudCBhIFNlYy1XZWJTb2NrZXQtRXh0ZW5zaW9ucyBoZWFkZXIgYnV0IG5vIGV4dGVuc2lvbiAnICtcbiAgICAgICAgICAnd2FzIHJlcXVlc3RlZCc7XG4gICAgICAgIGFib3J0SGFuZHNoYWtlKHdlYnNvY2tldCwgc29ja2V0LCBtZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgZXh0ZW5zaW9ucztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZXh0ZW5zaW9ucyA9IHBhcnNlKHNlY1dlYlNvY2tldEV4dGVuc2lvbnMpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnSW52YWxpZCBTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnMgaGVhZGVyJztcbiAgICAgICAgYWJvcnRIYW5kc2hha2Uod2Vic29ja2V0LCBzb2NrZXQsIG1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGV4dGVuc2lvbk5hbWVzID0gT2JqZWN0LmtleXMoZXh0ZW5zaW9ucyk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgZXh0ZW5zaW9uTmFtZXMubGVuZ3RoICE9PSAxIHx8XG4gICAgICAgIGV4dGVuc2lvbk5hbWVzWzBdICE9PSBQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdTZXJ2ZXIgaW5kaWNhdGVkIGFuIGV4dGVuc2lvbiB0aGF0IHdhcyBub3QgcmVxdWVzdGVkJztcbiAgICAgICAgYWJvcnRIYW5kc2hha2Uod2Vic29ja2V0LCBzb2NrZXQsIG1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHBlck1lc3NhZ2VEZWZsYXRlLmFjY2VwdChleHRlbnNpb25zW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0ludmFsaWQgU2VjLVdlYlNvY2tldC1FeHRlbnNpb25zIGhlYWRlcic7XG4gICAgICAgIGFib3J0SGFuZHNoYWtlKHdlYnNvY2tldCwgc29ja2V0LCBtZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB3ZWJzb2NrZXQuX2V4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0gPVxuICAgICAgICBwZXJNZXNzYWdlRGVmbGF0ZTtcbiAgICB9XG5cbiAgICB3ZWJzb2NrZXQuc2V0U29ja2V0KHNvY2tldCwgaGVhZCwge1xuICAgICAgZ2VuZXJhdGVNYXNrOiBvcHRzLmdlbmVyYXRlTWFzayxcbiAgICAgIG1heFBheWxvYWQ6IG9wdHMubWF4UGF5bG9hZCxcbiAgICAgIHNraXBVVEY4VmFsaWRhdGlvbjogb3B0cy5za2lwVVRGOFZhbGlkYXRpb25cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogRW1pdCB0aGUgYCdlcnJvcidgIGFuZCBgJ2Nsb3NlJ2AgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtXZWJTb2NrZXR9IHdlYnNvY2tldCBUaGUgV2ViU29ja2V0IGluc3RhbmNlXG4gKiBAcGFyYW0ge0Vycm9yfSBUaGUgZXJyb3IgdG8gZW1pdFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZW1pdEVycm9yQW5kQ2xvc2Uod2Vic29ja2V0LCBlcnIpIHtcbiAgd2Vic29ja2V0Ll9yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNMT1NJTkc7XG4gIHdlYnNvY2tldC5lbWl0KCdlcnJvcicsIGVycik7XG4gIHdlYnNvY2tldC5lbWl0Q2xvc2UoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBgbmV0LlNvY2tldGAgYW5kIGluaXRpYXRlIGEgY29ubmVjdGlvbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBDb25uZWN0aW9uIG9wdGlvbnNcbiAqIEByZXR1cm4ge25ldC5Tb2NrZXR9IFRoZSBuZXdseSBjcmVhdGVkIHNvY2tldCB1c2VkIHRvIHN0YXJ0IHRoZSBjb25uZWN0aW9uXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBuZXRDb25uZWN0KG9wdGlvbnMpIHtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5zb2NrZXRQYXRoO1xuICByZXR1cm4gbmV0LmNvbm5lY3Qob3B0aW9ucyk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgYHRscy5UTFNTb2NrZXRgIGFuZCBpbml0aWF0ZSBhIGNvbm5lY3Rpb24uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ29ubmVjdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHt0bHMuVExTU29ja2V0fSBUaGUgbmV3bHkgY3JlYXRlZCBzb2NrZXQgdXNlZCB0byBzdGFydCB0aGUgY29ubmVjdGlvblxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gdGxzQ29ubmVjdChvcHRpb25zKSB7XG4gIG9wdGlvbnMucGF0aCA9IHVuZGVmaW5lZDtcblxuICBpZiAoIW9wdGlvbnMuc2VydmVybmFtZSAmJiBvcHRpb25zLnNlcnZlcm5hbWUgIT09ICcnKSB7XG4gICAgb3B0aW9ucy5zZXJ2ZXJuYW1lID0gbmV0LmlzSVAob3B0aW9ucy5ob3N0KSA/ICcnIDogb3B0aW9ucy5ob3N0O1xuICB9XG5cbiAgcmV0dXJuIHRscy5jb25uZWN0KG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEFib3J0IHRoZSBoYW5kc2hha2UgYW5kIGVtaXQgYW4gZXJyb3IuXG4gKlxuICogQHBhcmFtIHtXZWJTb2NrZXR9IHdlYnNvY2tldCBUaGUgV2ViU29ja2V0IGluc3RhbmNlXG4gKiBAcGFyYW0geyhodHRwLkNsaWVudFJlcXVlc3R8bmV0LlNvY2tldHx0bHMuU29ja2V0KX0gc3RyZWFtIFRoZSByZXF1ZXN0IHRvXG4gKiAgICAgYWJvcnQgb3IgdGhlIHNvY2tldCB0byBkZXN0cm95XG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgZXJyb3IgbWVzc2FnZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWJvcnRIYW5kc2hha2Uod2Vic29ja2V0LCBzdHJlYW0sIG1lc3NhZ2UpIHtcbiAgd2Vic29ja2V0Ll9yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNMT1NJTkc7XG5cbiAgY29uc3QgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZShlcnIsIGFib3J0SGFuZHNoYWtlKTtcblxuICBpZiAoc3RyZWFtLnNldEhlYWRlcikge1xuICAgIHN0cmVhbS5hYm9ydCgpO1xuXG4gICAgaWYgKHN0cmVhbS5zb2NrZXQgJiYgIXN0cmVhbS5zb2NrZXQuZGVzdHJveWVkKSB7XG4gICAgICAvL1xuICAgICAgLy8gT24gTm9kZS5qcyA+PSAxNC4zLjAgYHJlcXVlc3QuYWJvcnQoKWAgZG9lcyBub3QgZGVzdHJveSB0aGUgc29ja2V0IGlmXG4gICAgICAvLyBjYWxsZWQgYWZ0ZXIgdGhlIHJlcXVlc3QgY29tcGxldGVkLiBTZWVcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJzb2NrZXRzL3dzL2lzc3Vlcy8xODY5LlxuICAgICAgLy9cbiAgICAgIHN0cmVhbS5zb2NrZXQuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHN0cmVhbS5vbmNlKCdhYm9ydCcsIHdlYnNvY2tldC5lbWl0Q2xvc2UuYmluZCh3ZWJzb2NrZXQpKTtcbiAgICB3ZWJzb2NrZXQuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9IGVsc2Uge1xuICAgIHN0cmVhbS5kZXN0cm95KGVycik7XG4gICAgc3RyZWFtLm9uY2UoJ2Vycm9yJywgd2Vic29ja2V0LmVtaXQuYmluZCh3ZWJzb2NrZXQsICdlcnJvcicpKTtcbiAgICBzdHJlYW0ub25jZSgnY2xvc2UnLCB3ZWJzb2NrZXQuZW1pdENsb3NlLmJpbmQod2Vic29ja2V0KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYW5kbGUgY2FzZXMgd2hlcmUgdGhlIGBwaW5nKClgLCBgcG9uZygpYCwgb3IgYHNlbmQoKWAgbWV0aG9kcyBhcmUgY2FsbGVkXG4gKiB3aGVuIHRoZSBgcmVhZHlTdGF0ZWAgYXR0cmlidXRlIGlzIGBDTE9TSU5HYCBvciBgQ0xPU0VEYC5cbiAqXG4gKiBAcGFyYW0ge1dlYlNvY2tldH0gd2Vic29ja2V0IFRoZSBXZWJTb2NrZXQgaW5zdGFuY2VcbiAqIEBwYXJhbSB7Kn0gW2RhdGFdIFRoZSBkYXRhIHRvIHNlbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gQ2FsbGJhY2tcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNlbmRBZnRlckNsb3NlKHdlYnNvY2tldCwgZGF0YSwgY2IpIHtcbiAgaWYgKGRhdGEpIHtcbiAgICBjb25zdCBsZW5ndGggPSB0b0J1ZmZlcihkYXRhKS5sZW5ndGg7XG5cbiAgICAvL1xuICAgIC8vIFRoZSBgX2J1ZmZlcmVkQW1vdW50YCBwcm9wZXJ0eSBpcyB1c2VkIG9ubHkgd2hlbiB0aGUgcGVlciBpcyBhIGNsaWVudCBhbmRcbiAgICAvLyB0aGUgb3BlbmluZyBoYW5kc2hha2UgZmFpbHMuIFVuZGVyIHRoZXNlIGNpcmN1bXN0YW5jZXMsIGluIGZhY3QsIHRoZVxuICAgIC8vIGBzZXRTb2NrZXQoKWAgbWV0aG9kIGlzIG5vdCBjYWxsZWQsIHNvIHRoZSBgX3NvY2tldGAgYW5kIGBfc2VuZGVyYFxuICAgIC8vIHByb3BlcnRpZXMgYXJlIHNldCB0byBgbnVsbGAuXG4gICAgLy9cbiAgICBpZiAod2Vic29ja2V0Ll9zb2NrZXQpIHdlYnNvY2tldC5fc2VuZGVyLl9idWZmZXJlZEJ5dGVzICs9IGxlbmd0aDtcbiAgICBlbHNlIHdlYnNvY2tldC5fYnVmZmVyZWRBbW91bnQgKz0gbGVuZ3RoO1xuICB9XG5cbiAgaWYgKGNiKSB7XG4gICAgY29uc3QgZXJyID0gbmV3IEVycm9yKFxuICAgICAgYFdlYlNvY2tldCBpcyBub3Qgb3BlbjogcmVhZHlTdGF0ZSAke3dlYnNvY2tldC5yZWFkeVN0YXRlfSBgICtcbiAgICAgICAgYCgke3JlYWR5U3RhdGVzW3dlYnNvY2tldC5yZWFkeVN0YXRlXX0pYFxuICAgICk7XG4gICAgY2IoZXJyKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYFJlY2VpdmVyYCBgJ2NvbmNsdWRlJ2AgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgVGhlIHN0YXR1cyBjb2RlXG4gKiBAcGFyYW0ge0J1ZmZlcn0gcmVhc29uIFRoZSByZWFzb24gZm9yIGNsb3NpbmdcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlY2VpdmVyT25Db25jbHVkZShjb2RlLCByZWFzb24pIHtcbiAgY29uc3Qgd2Vic29ja2V0ID0gdGhpc1trV2ViU29ja2V0XTtcblxuICB3ZWJzb2NrZXQuX2Nsb3NlRnJhbWVSZWNlaXZlZCA9IHRydWU7XG4gIHdlYnNvY2tldC5fY2xvc2VNZXNzYWdlID0gcmVhc29uO1xuICB3ZWJzb2NrZXQuX2Nsb3NlQ29kZSA9IGNvZGU7XG5cbiAgaWYgKHdlYnNvY2tldC5fc29ja2V0W2tXZWJTb2NrZXRdID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICB3ZWJzb2NrZXQuX3NvY2tldC5yZW1vdmVMaXN0ZW5lcignZGF0YScsIHNvY2tldE9uRGF0YSk7XG4gIHByb2Nlc3MubmV4dFRpY2socmVzdW1lLCB3ZWJzb2NrZXQuX3NvY2tldCk7XG5cbiAgaWYgKGNvZGUgPT09IDEwMDUpIHdlYnNvY2tldC5jbG9zZSgpO1xuICBlbHNlIHdlYnNvY2tldC5jbG9zZShjb2RlLCByZWFzb24pO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYFJlY2VpdmVyYCBgJ2RyYWluJ2AgZXZlbnQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVjZWl2ZXJPbkRyYWluKCkge1xuICBjb25zdCB3ZWJzb2NrZXQgPSB0aGlzW2tXZWJTb2NrZXRdO1xuXG4gIGlmICghd2Vic29ja2V0LmlzUGF1c2VkKSB3ZWJzb2NrZXQuX3NvY2tldC5yZXN1bWUoKTtcbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGBSZWNlaXZlcmAgYCdlcnJvcidgIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFJhbmdlRXJyb3J8RXJyb3IpfSBlcnIgVGhlIGVtaXR0ZWQgZXJyb3JcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlY2VpdmVyT25FcnJvcihlcnIpIHtcbiAgY29uc3Qgd2Vic29ja2V0ID0gdGhpc1trV2ViU29ja2V0XTtcblxuICBpZiAod2Vic29ja2V0Ll9zb2NrZXRba1dlYlNvY2tldF0gIT09IHVuZGVmaW5lZCkge1xuICAgIHdlYnNvY2tldC5fc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdkYXRhJywgc29ja2V0T25EYXRhKTtcblxuICAgIC8vXG4gICAgLy8gT24gTm9kZS5qcyA8IDE0LjAuMCB0aGUgYCdlcnJvcidgIGV2ZW50IGlzIGVtaXR0ZWQgc3luY2hyb25vdXNseS4gU2VlXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnNvY2tldHMvd3MvaXNzdWVzLzE5NDAuXG4gICAgLy9cbiAgICBwcm9jZXNzLm5leHRUaWNrKHJlc3VtZSwgd2Vic29ja2V0Ll9zb2NrZXQpO1xuXG4gICAgd2Vic29ja2V0LmNsb3NlKGVycltrU3RhdHVzQ29kZV0pO1xuICB9XG5cbiAgd2Vic29ja2V0LmVtaXQoJ2Vycm9yJywgZXJyKTtcbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGBSZWNlaXZlcmAgYCdmaW5pc2gnYCBldmVudC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZWNlaXZlck9uRmluaXNoKCkge1xuICB0aGlzW2tXZWJTb2NrZXRdLmVtaXRDbG9zZSgpO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYFJlY2VpdmVyYCBgJ21lc3NhZ2UnYCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcnxBcnJheUJ1ZmZlcnxCdWZmZXJbXSl9IGRhdGEgVGhlIG1lc3NhZ2VcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNCaW5hcnkgU3BlY2lmaWVzIHdoZXRoZXIgdGhlIG1lc3NhZ2UgaXMgYmluYXJ5IG9yIG5vdFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVjZWl2ZXJPbk1lc3NhZ2UoZGF0YSwgaXNCaW5hcnkpIHtcbiAgdGhpc1trV2ViU29ja2V0XS5lbWl0KCdtZXNzYWdlJywgZGF0YSwgaXNCaW5hcnkpO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYFJlY2VpdmVyYCBgJ3BpbmcnYCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YSBUaGUgZGF0YSBpbmNsdWRlZCBpbiB0aGUgcGluZyBmcmFtZVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcmVjZWl2ZXJPblBpbmcoZGF0YSkge1xuICBjb25zdCB3ZWJzb2NrZXQgPSB0aGlzW2tXZWJTb2NrZXRdO1xuXG4gIHdlYnNvY2tldC5wb25nKGRhdGEsICF3ZWJzb2NrZXQuX2lzU2VydmVyLCBOT09QKTtcbiAgd2Vic29ja2V0LmVtaXQoJ3BpbmcnLCBkYXRhKTtcbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGBSZWNlaXZlcmAgYCdwb25nJ2AgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtCdWZmZXJ9IGRhdGEgVGhlIGRhdGEgaW5jbHVkZWQgaW4gdGhlIHBvbmcgZnJhbWVcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlY2VpdmVyT25Qb25nKGRhdGEpIHtcbiAgdGhpc1trV2ViU29ja2V0XS5lbWl0KCdwb25nJywgZGF0YSk7XG59XG5cbi8qKlxuICogUmVzdW1lIGEgcmVhZGFibGUgc3RyZWFtXG4gKlxuICogQHBhcmFtIHtSZWFkYWJsZX0gc3RyZWFtIFRoZSByZWFkYWJsZSBzdHJlYW1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHJlc3VtZShzdHJlYW0pIHtcbiAgc3RyZWFtLnJlc3VtZSgpO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYG5ldC5Tb2NrZXRgIGAnY2xvc2UnYCBldmVudC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb2NrZXRPbkNsb3NlKCkge1xuICBjb25zdCB3ZWJzb2NrZXQgPSB0aGlzW2tXZWJTb2NrZXRdO1xuXG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgc29ja2V0T25DbG9zZSk7XG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2RhdGEnLCBzb2NrZXRPbkRhdGEpO1xuICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdlbmQnLCBzb2NrZXRPbkVuZCk7XG5cbiAgd2Vic29ja2V0Ll9yZWFkeVN0YXRlID0gV2ViU29ja2V0LkNMT1NJTkc7XG5cbiAgbGV0IGNodW5rO1xuXG4gIC8vXG4gIC8vIFRoZSBjbG9zZSBmcmFtZSBtaWdodCBub3QgaGF2ZSBiZWVuIHJlY2VpdmVkIG9yIHRoZSBgJ2VuZCdgIGV2ZW50IGVtaXR0ZWQsXG4gIC8vIGZvciBleGFtcGxlLCBpZiB0aGUgc29ja2V0IHdhcyBkZXN0cm95ZWQgZHVlIHRvIGFuIGVycm9yLiBFbnN1cmUgdGhhdCB0aGVcbiAgLy8gYHJlY2VpdmVyYCBzdHJlYW0gaXMgY2xvc2VkIGFmdGVyIHdyaXRpbmcgYW55IHJlbWFpbmluZyBidWZmZXJlZCBkYXRhIHRvXG4gIC8vIGl0LiBJZiB0aGUgcmVhZGFibGUgc2lkZSBvZiB0aGUgc29ja2V0IGlzIGluIGZsb3dpbmcgbW9kZSB0aGVuIHRoZXJlIGlzIG5vXG4gIC8vIGJ1ZmZlcmVkIGRhdGEgYXMgZXZlcnl0aGluZyBoYXMgYmVlbiBhbHJlYWR5IHdyaXR0ZW4gYW5kIGByZWFkYWJsZS5yZWFkKClgXG4gIC8vIHdpbGwgcmV0dXJuIGBudWxsYC4gSWYgaW5zdGVhZCwgdGhlIHNvY2tldCBpcyBwYXVzZWQsIGFueSBwb3NzaWJsZSBidWZmZXJlZFxuICAvLyBkYXRhIHdpbGwgYmUgcmVhZCBhcyBhIHNpbmdsZSBjaHVuay5cbiAgLy9cbiAgaWYgKFxuICAgICF0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQgJiZcbiAgICAhd2Vic29ja2V0Ll9jbG9zZUZyYW1lUmVjZWl2ZWQgJiZcbiAgICAhd2Vic29ja2V0Ll9yZWNlaXZlci5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQgJiZcbiAgICAoY2h1bmsgPSB3ZWJzb2NrZXQuX3NvY2tldC5yZWFkKCkpICE9PSBudWxsXG4gICkge1xuICAgIHdlYnNvY2tldC5fcmVjZWl2ZXIud3JpdGUoY2h1bmspO1xuICB9XG5cbiAgd2Vic29ja2V0Ll9yZWNlaXZlci5lbmQoKTtcblxuICB0aGlzW2tXZWJTb2NrZXRdID0gdW5kZWZpbmVkO1xuXG4gIGNsZWFyVGltZW91dCh3ZWJzb2NrZXQuX2Nsb3NlVGltZXIpO1xuXG4gIGlmIChcbiAgICB3ZWJzb2NrZXQuX3JlY2VpdmVyLl93cml0YWJsZVN0YXRlLmZpbmlzaGVkIHx8XG4gICAgd2Vic29ja2V0Ll9yZWNlaXZlci5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWRcbiAgKSB7XG4gICAgd2Vic29ja2V0LmVtaXRDbG9zZSgpO1xuICB9IGVsc2Uge1xuICAgIHdlYnNvY2tldC5fcmVjZWl2ZXIub24oJ2Vycm9yJywgcmVjZWl2ZXJPbkZpbmlzaCk7XG4gICAgd2Vic29ja2V0Ll9yZWNlaXZlci5vbignZmluaXNoJywgcmVjZWl2ZXJPbkZpbmlzaCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGBuZXQuU29ja2V0YCBgJ2RhdGEnYCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gY2h1bmsgQSBjaHVuayBvZiBkYXRhXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb2NrZXRPbkRhdGEoY2h1bmspIHtcbiAgaWYgKCF0aGlzW2tXZWJTb2NrZXRdLl9yZWNlaXZlci53cml0ZShjaHVuaykpIHtcbiAgICB0aGlzLnBhdXNlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgbGlzdGVuZXIgb2YgdGhlIGBuZXQuU29ja2V0YCBgJ2VuZCdgIGV2ZW50LlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHNvY2tldE9uRW5kKCkge1xuICBjb25zdCB3ZWJzb2NrZXQgPSB0aGlzW2tXZWJTb2NrZXRdO1xuXG4gIHdlYnNvY2tldC5fcmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5DTE9TSU5HO1xuICB3ZWJzb2NrZXQuX3JlY2VpdmVyLmVuZCgpO1xuICB0aGlzLmVuZCgpO1xufVxuXG4vKipcbiAqIFRoZSBsaXN0ZW5lciBvZiB0aGUgYG5ldC5Tb2NrZXRgIGAnZXJyb3InYCBldmVudC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb2NrZXRPbkVycm9yKCkge1xuICBjb25zdCB3ZWJzb2NrZXQgPSB0aGlzW2tXZWJTb2NrZXRdO1xuXG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgc29ja2V0T25FcnJvcik7XG4gIHRoaXMub24oJ2Vycm9yJywgTk9PUCk7XG5cbiAgaWYgKHdlYnNvY2tldCkge1xuICAgIHdlYnNvY2tldC5fcmVhZHlTdGF0ZSA9IFdlYlNvY2tldC5DTE9TSU5HO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHsgdG9rZW5DaGFycyB9ID0gcmVxdWlyZSgnLi92YWxpZGF0aW9uJyk7XG5cbi8qKlxuICogUGFyc2VzIHRoZSBgU2VjLVdlYlNvY2tldC1Qcm90b2NvbGAgaGVhZGVyIGludG8gYSBzZXQgb2Ygc3VicHJvdG9jb2wgbmFtZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlciBUaGUgZmllbGQgdmFsdWUgb2YgdGhlIGhlYWRlclxuICogQHJldHVybiB7U2V0fSBUaGUgc3VicHJvdG9jb2wgbmFtZXNcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gcGFyc2UoaGVhZGVyKSB7XG4gIGNvbnN0IHByb3RvY29scyA9IG5ldyBTZXQoKTtcbiAgbGV0IHN0YXJ0ID0gLTE7XG4gIGxldCBlbmQgPSAtMTtcbiAgbGV0IGkgPSAwO1xuXG4gIGZvciAoaTsgaSA8IGhlYWRlci5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNvZGUgPSBoZWFkZXIuY2hhckNvZGVBdChpKTtcblxuICAgIGlmIChlbmQgPT09IC0xICYmIHRva2VuQ2hhcnNbY29kZV0gPT09IDEpIHtcbiAgICAgIGlmIChzdGFydCA9PT0gLTEpIHN0YXJ0ID0gaTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgaSAhPT0gMCAmJlxuICAgICAgKGNvZGUgPT09IDB4MjAgLyogJyAnICovIHx8IGNvZGUgPT09IDB4MDkpIC8qICdcXHQnICovXG4gICAgKSB7XG4gICAgICBpZiAoZW5kID09PSAtMSAmJiBzdGFydCAhPT0gLTEpIGVuZCA9IGk7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSAweDJjIC8qICcsJyAqLykge1xuICAgICAgaWYgKHN0YXJ0ID09PSAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIGF0IGluZGV4ICR7aX1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVuZCA9PT0gLTEpIGVuZCA9IGk7XG5cbiAgICAgIGNvbnN0IHByb3RvY29sID0gaGVhZGVyLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICBpZiAocHJvdG9jb2xzLmhhcyhwcm90b2NvbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBUaGUgXCIke3Byb3RvY29sfVwiIHN1YnByb3RvY29sIGlzIGR1cGxpY2F0ZWRgKTtcbiAgICAgIH1cblxuICAgICAgcHJvdG9jb2xzLmFkZChwcm90b2NvbCk7XG4gICAgICBzdGFydCA9IGVuZCA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuZXhwZWN0ZWQgY2hhcmFjdGVyIGF0IGluZGV4ICR7aX1gKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc3RhcnQgPT09IC0xIHx8IGVuZCAhPT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ1VuZXhwZWN0ZWQgZW5kIG9mIGlucHV0Jyk7XG4gIH1cblxuICBjb25zdCBwcm90b2NvbCA9IGhlYWRlci5zbGljZShzdGFydCwgaSk7XG5cbiAgaWYgKHByb3RvY29scy5oYXMocHJvdG9jb2wpKSB7XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKGBUaGUgXCIke3Byb3RvY29sfVwiIHN1YnByb3RvY29sIGlzIGR1cGxpY2F0ZWRgKTtcbiAgfVxuXG4gIHByb3RvY29scy5hZGQocHJvdG9jb2wpO1xuICByZXR1cm4gcHJvdG9jb2xzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgcGFyc2UgfTtcbiIsIi8qIGVzbGludCBuby11bnVzZWQtdmFyczogW1wiZXJyb3JcIiwgeyBcInZhcnNJZ25vcmVQYXR0ZXJuXCI6IFwiXm5ldHx0bHN8aHR0cHMkXCIgfV0gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbmNvbnN0IGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG5jb25zdCBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG5jb25zdCBuZXQgPSByZXF1aXJlKCduZXQnKTtcbmNvbnN0IHRscyA9IHJlcXVpcmUoJ3RscycpO1xuY29uc3QgeyBjcmVhdGVIYXNoIH0gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuY29uc3QgZXh0ZW5zaW9uID0gcmVxdWlyZSgnLi9leHRlbnNpb24nKTtcbmNvbnN0IFBlck1lc3NhZ2VEZWZsYXRlID0gcmVxdWlyZSgnLi9wZXJtZXNzYWdlLWRlZmxhdGUnKTtcbmNvbnN0IHN1YnByb3RvY29sID0gcmVxdWlyZSgnLi9zdWJwcm90b2NvbCcpO1xuY29uc3QgV2ViU29ja2V0ID0gcmVxdWlyZSgnLi93ZWJzb2NrZXQnKTtcbmNvbnN0IHsgR1VJRCwga1dlYlNvY2tldCB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY29uc3Qga2V5UmVnZXggPSAvXlsrLzAtOUEtWmEtel17MjJ9PT0kLztcblxuY29uc3QgUlVOTklORyA9IDA7XG5jb25zdCBDTE9TSU5HID0gMTtcbmNvbnN0IENMT1NFRCA9IDI7XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgV2ViU29ja2V0IHNlcnZlci5cbiAqXG4gKiBAZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAqL1xuY2xhc3MgV2ViU29ja2V0U2VydmVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIGBXZWJTb2NrZXRTZXJ2ZXJgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmJhY2tsb2c9NTExXSBUaGUgbWF4aW11bSBsZW5ndGggb2YgdGhlIHF1ZXVlIG9mXG4gICAqICAgICBwZW5kaW5nIGNvbm5lY3Rpb25zXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY2xpZW50VHJhY2tpbmc9dHJ1ZV0gU3BlY2lmaWVzIHdoZXRoZXIgb3Igbm90IHRvXG4gICAqICAgICB0cmFjayBjbGllbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmhhbmRsZVByb3RvY29sc10gQSBob29rIHRvIGhhbmRsZSBwcm90b2NvbHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmhvc3RdIFRoZSBob3N0bmFtZSB3aGVyZSB0byBiaW5kIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1heFBheWxvYWQ9MTA0ODU3NjAwXSBUaGUgbWF4aW11bSBhbGxvd2VkIG1lc3NhZ2VcbiAgICogICAgIHNpemVcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ub1NlcnZlcj1mYWxzZV0gRW5hYmxlIG5vIHNlcnZlciBtb2RlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wYXRoXSBBY2NlcHQgb25seSBjb25uZWN0aW9ucyBtYXRjaGluZyB0aGlzIHBhdGhcbiAgICogQHBhcmFtIHsoQm9vbGVhbnxPYmplY3QpfSBbb3B0aW9ucy5wZXJNZXNzYWdlRGVmbGF0ZT1mYWxzZV0gRW5hYmxlL2Rpc2FibGVcbiAgICogICAgIHBlcm1lc3NhZ2UtZGVmbGF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucG9ydF0gVGhlIHBvcnQgd2hlcmUgdG8gYmluZCB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB7KGh0dHAuU2VydmVyfGh0dHBzLlNlcnZlcil9IFtvcHRpb25zLnNlcnZlcl0gQSBwcmUtY3JlYXRlZCBIVFRQL1NcbiAgICogICAgIHNlcnZlciB0byB1c2VcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5za2lwVVRGOFZhbGlkYXRpb249ZmFsc2VdIFNwZWNpZmllcyB3aGV0aGVyIG9yXG4gICAqICAgICBub3QgdG8gc2tpcCBVVEYtOCB2YWxpZGF0aW9uIGZvciB0ZXh0IGFuZCBjbG9zZSBtZXNzYWdlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy52ZXJpZnlDbGllbnRdIEEgaG9vayB0byByZWplY3QgY29ubmVjdGlvbnNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuV2ViU29ja2V0PVdlYlNvY2tldF0gU3BlY2lmaWVzIHRoZSBgV2ViU29ja2V0YFxuICAgKiAgICAgY2xhc3MgdG8gdXNlLiBJdCBtdXN0IGJlIHRoZSBgV2ViU29ja2V0YCBjbGFzcyBvciBjbGFzcyB0aGF0IGV4dGVuZHMgaXRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBBIGxpc3RlbmVyIGZvciB0aGUgYGxpc3RlbmluZ2AgZXZlbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBtYXhQYXlsb2FkOiAxMDAgKiAxMDI0ICogMTAyNCxcbiAgICAgIHNraXBVVEY4VmFsaWRhdGlvbjogZmFsc2UsXG4gICAgICBwZXJNZXNzYWdlRGVmbGF0ZTogZmFsc2UsXG4gICAgICBoYW5kbGVQcm90b2NvbHM6IG51bGwsXG4gICAgICBjbGllbnRUcmFja2luZzogdHJ1ZSxcbiAgICAgIHZlcmlmeUNsaWVudDogbnVsbCxcbiAgICAgIG5vU2VydmVyOiBmYWxzZSxcbiAgICAgIGJhY2tsb2c6IG51bGwsIC8vIHVzZSBkZWZhdWx0ICg1MTEgYXMgaW1wbGVtZW50ZWQgaW4gbmV0LmpzKVxuICAgICAgc2VydmVyOiBudWxsLFxuICAgICAgaG9zdDogbnVsbCxcbiAgICAgIHBhdGg6IG51bGwsXG4gICAgICBwb3J0OiBudWxsLFxuICAgICAgV2ViU29ja2V0LFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH07XG5cbiAgICBpZiAoXG4gICAgICAob3B0aW9ucy5wb3J0ID09IG51bGwgJiYgIW9wdGlvbnMuc2VydmVyICYmICFvcHRpb25zLm5vU2VydmVyKSB8fFxuICAgICAgKG9wdGlvbnMucG9ydCAhPSBudWxsICYmIChvcHRpb25zLnNlcnZlciB8fCBvcHRpb25zLm5vU2VydmVyKSkgfHxcbiAgICAgIChvcHRpb25zLnNlcnZlciAmJiBvcHRpb25zLm5vU2VydmVyKVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ09uZSBhbmQgb25seSBvbmUgb2YgdGhlIFwicG9ydFwiLCBcInNlcnZlclwiLCBvciBcIm5vU2VydmVyXCIgb3B0aW9ucyAnICtcbiAgICAgICAgICAnbXVzdCBiZSBzcGVjaWZpZWQnXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnBvcnQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBodHRwLlNUQVRVU19DT0RFU1s0MjZdO1xuXG4gICAgICAgIHJlcy53cml0ZUhlYWQoNDI2LCB7XG4gICAgICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmVzLmVuZChib2R5KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc2VydmVyLmxpc3RlbihcbiAgICAgICAgb3B0aW9ucy5wb3J0LFxuICAgICAgICBvcHRpb25zLmhvc3QsXG4gICAgICAgIG9wdGlvbnMuYmFja2xvZyxcbiAgICAgICAgY2FsbGJhY2tcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnNlcnZlcikge1xuICAgICAgdGhpcy5fc2VydmVyID0gb3B0aW9ucy5zZXJ2ZXI7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NlcnZlcikge1xuICAgICAgY29uc3QgZW1pdENvbm5lY3Rpb24gPSB0aGlzLmVtaXQuYmluZCh0aGlzLCAnY29ubmVjdGlvbicpO1xuXG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnMgPSBhZGRMaXN0ZW5lcnModGhpcy5fc2VydmVyLCB7XG4gICAgICAgIGxpc3RlbmluZzogdGhpcy5lbWl0LmJpbmQodGhpcywgJ2xpc3RlbmluZycpLFxuICAgICAgICBlcnJvcjogdGhpcy5lbWl0LmJpbmQodGhpcywgJ2Vycm9yJyksXG4gICAgICAgIHVwZ3JhZGU6IChyZXEsIHNvY2tldCwgaGVhZCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVXBncmFkZShyZXEsIHNvY2tldCwgaGVhZCwgZW1pdENvbm5lY3Rpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wZXJNZXNzYWdlRGVmbGF0ZSA9PT0gdHJ1ZSkgb3B0aW9ucy5wZXJNZXNzYWdlRGVmbGF0ZSA9IHt9O1xuICAgIGlmIChvcHRpb25zLmNsaWVudFRyYWNraW5nKSB7XG4gICAgICB0aGlzLmNsaWVudHMgPSBuZXcgU2V0KCk7XG4gICAgICB0aGlzLl9zaG91bGRFbWl0Q2xvc2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuX3N0YXRlID0gUlVOTklORztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBib3VuZCBhZGRyZXNzLCB0aGUgYWRkcmVzcyBmYW1pbHkgbmFtZSwgYW5kIHBvcnQgb2YgdGhlIHNlcnZlclxuICAgKiBhcyByZXBvcnRlZCBieSB0aGUgb3BlcmF0aW5nIHN5c3RlbSBpZiBsaXN0ZW5pbmcgb24gYW4gSVAgc29ja2V0LlxuICAgKiBJZiB0aGUgc2VydmVyIGlzIGxpc3RlbmluZyBvbiBhIHBpcGUgb3IgVU5JWCBkb21haW4gc29ja2V0LCB0aGUgbmFtZSBpc1xuICAgKiByZXR1cm5lZCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybiB7KE9iamVjdHxTdHJpbmd8bnVsbCl9IFRoZSBhZGRyZXNzIG9mIHRoZSBzZXJ2ZXJcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgYWRkcmVzcygpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLm5vU2VydmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzZXJ2ZXIgaXMgb3BlcmF0aW5nIGluIFwibm9TZXJ2ZXJcIiBtb2RlJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9zZXJ2ZXIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXIuYWRkcmVzcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHNlcnZlciBmcm9tIGFjY2VwdGluZyBuZXcgY29ubmVjdGlvbnMgYW5kIGVtaXQgdGhlIGAnY2xvc2UnYCBldmVudFxuICAgKiB3aGVuIGFsbCBleGlzdGluZyBjb25uZWN0aW9ucyBhcmUgY2xvc2VkLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIEEgb25lLXRpbWUgbGlzdGVuZXIgZm9yIHRoZSBgJ2Nsb3NlJ2AgZXZlbnRcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY2xvc2UoY2IpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgPT09IENMT1NFRCkge1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIHRoaXMub25jZSgnY2xvc2UnLCAoKSA9PiB7XG4gICAgICAgICAgY2IobmV3IEVycm9yKCdUaGUgc2VydmVyIGlzIG5vdCBydW5uaW5nJykpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0Q2xvc2UsIHRoaXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjYikgdGhpcy5vbmNlKCdjbG9zZScsIGNiKTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gQ0xPU0lORykgcmV0dXJuO1xuICAgIHRoaXMuX3N0YXRlID0gQ0xPU0lORztcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubm9TZXJ2ZXIgfHwgdGhpcy5vcHRpb25zLnNlcnZlcikge1xuICAgICAgaWYgKHRoaXMuX3NlcnZlcikge1xuICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzID0gdGhpcy5fc2VydmVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2xpZW50cykge1xuICAgICAgICBpZiAoIXRoaXMuY2xpZW50cy5zaXplKSB7XG4gICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhlbWl0Q2xvc2UsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Nob3VsZEVtaXRDbG9zZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdENsb3NlLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VydmVyID0gdGhpcy5fc2VydmVyO1xuXG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVycyA9IHRoaXMuX3NlcnZlciA9IG51bGw7XG5cbiAgICAgIC8vXG4gICAgICAvLyBUaGUgSFRUUC9TIHNlcnZlciB3YXMgY3JlYXRlZCBpbnRlcm5hbGx5LiBDbG9zZSBpdCwgYW5kIHJlbHkgb24gaXRzXG4gICAgICAvLyBgJ2Nsb3NlJ2AgZXZlbnQuXG4gICAgICAvL1xuICAgICAgc2VydmVyLmNsb3NlKCgpID0+IHtcbiAgICAgICAgZW1pdENsb3NlKHRoaXMpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlZSBpZiBhIGdpdmVuIHJlcXVlc3Qgc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhpcyBzZXJ2ZXIgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7aHR0cC5JbmNvbWluZ01lc3NhZ2V9IHJlcSBSZXF1ZXN0IG9iamVjdCB0byBpbnNwZWN0XG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcmVxdWVzdCBpcyB2YWxpZCwgZWxzZSBgZmFsc2VgXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNob3VsZEhhbmRsZShyZXEpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnBhdGgpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gcmVxLnVybC5pbmRleE9mKCc/Jyk7XG4gICAgICBjb25zdCBwYXRobmFtZSA9IGluZGV4ICE9PSAtMSA/IHJlcS51cmwuc2xpY2UoMCwgaW5kZXgpIDogcmVxLnVybDtcblxuICAgICAgaWYgKHBhdGhuYW1lICE9PSB0aGlzLm9wdGlvbnMucGF0aCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZSBhIEhUVFAgVXBncmFkZSByZXF1ZXN0LlxuICAgKlxuICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXEgVGhlIHJlcXVlc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7KG5ldC5Tb2NrZXR8dGxzLlNvY2tldCl9IHNvY2tldCBUaGUgbmV0d29yayBzb2NrZXQgYmV0d2VlbiB0aGVcbiAgICogICAgIHNlcnZlciBhbmQgY2xpZW50XG4gICAqIEBwYXJhbSB7QnVmZmVyfSBoZWFkIFRoZSBmaXJzdCBwYWNrZXQgb2YgdGhlIHVwZ3JhZGVkIHN0cmVhbVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAcHVibGljXG4gICAqL1xuICBoYW5kbGVVcGdyYWRlKHJlcSwgc29ja2V0LCBoZWFkLCBjYikge1xuICAgIHNvY2tldC5vbignZXJyb3InLCBzb2NrZXRPbkVycm9yKTtcblxuICAgIGNvbnN0IGtleSA9XG4gICAgICByZXEuaGVhZGVyc1snc2VjLXdlYnNvY2tldC1rZXknXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gcmVxLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQta2V5J11cbiAgICAgICAgOiBmYWxzZTtcbiAgICBjb25zdCB2ZXJzaW9uID0gK3JlcS5oZWFkZXJzWydzZWMtd2Vic29ja2V0LXZlcnNpb24nXTtcblxuICAgIGlmIChcbiAgICAgIHJlcS5tZXRob2QgIT09ICdHRVQnIHx8XG4gICAgICByZXEuaGVhZGVycy51cGdyYWRlLnRvTG93ZXJDYXNlKCkgIT09ICd3ZWJzb2NrZXQnIHx8XG4gICAgICAha2V5IHx8XG4gICAgICAha2V5UmVnZXgudGVzdChrZXkpIHx8XG4gICAgICAodmVyc2lvbiAhPT0gOCAmJiB2ZXJzaW9uICE9PSAxMykgfHxcbiAgICAgICF0aGlzLnNob3VsZEhhbmRsZShyZXEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gYWJvcnRIYW5kc2hha2Uoc29ja2V0LCA0MDApO1xuICAgIH1cblxuICAgIGNvbnN0IHNlY1dlYlNvY2tldFByb3RvY29sID0gcmVxLmhlYWRlcnNbJ3NlYy13ZWJzb2NrZXQtcHJvdG9jb2wnXTtcbiAgICBsZXQgcHJvdG9jb2xzID0gbmV3IFNldCgpO1xuXG4gICAgaWYgKHNlY1dlYlNvY2tldFByb3RvY29sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHByb3RvY29scyA9IHN1YnByb3RvY29sLnBhcnNlKHNlY1dlYlNvY2tldFByb3RvY29sKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gYWJvcnRIYW5kc2hha2Uoc29ja2V0LCA0MDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNlY1dlYlNvY2tldEV4dGVuc2lvbnMgPSByZXEuaGVhZGVyc1snc2VjLXdlYnNvY2tldC1leHRlbnNpb25zJ107XG4gICAgY29uc3QgZXh0ZW5zaW9ucyA9IHt9O1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5vcHRpb25zLnBlck1lc3NhZ2VEZWZsYXRlICYmXG4gICAgICBzZWNXZWJTb2NrZXRFeHRlbnNpb25zICE9PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIGNvbnN0IHBlck1lc3NhZ2VEZWZsYXRlID0gbmV3IFBlck1lc3NhZ2VEZWZsYXRlKFxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyTWVzc2FnZURlZmxhdGUsXG4gICAgICAgIHRydWUsXG4gICAgICAgIHRoaXMub3B0aW9ucy5tYXhQYXlsb2FkXG4gICAgICApO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBvZmZlcnMgPSBleHRlbnNpb24ucGFyc2Uoc2VjV2ViU29ja2V0RXh0ZW5zaW9ucyk7XG5cbiAgICAgICAgaWYgKG9mZmVyc1tQZXJNZXNzYWdlRGVmbGF0ZS5leHRlbnNpb25OYW1lXSkge1xuICAgICAgICAgIHBlck1lc3NhZ2VEZWZsYXRlLmFjY2VwdChvZmZlcnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pO1xuICAgICAgICAgIGV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0gPSBwZXJNZXNzYWdlRGVmbGF0ZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBhYm9ydEhhbmRzaGFrZShzb2NrZXQsIDQwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBPcHRpb25hbGx5IGNhbGwgZXh0ZXJuYWwgY2xpZW50IHZlcmlmaWNhdGlvbiBoYW5kbGVyLlxuICAgIC8vXG4gICAgaWYgKHRoaXMub3B0aW9ucy52ZXJpZnlDbGllbnQpIHtcbiAgICAgIGNvbnN0IGluZm8gPSB7XG4gICAgICAgIG9yaWdpbjpcbiAgICAgICAgICByZXEuaGVhZGVyc1tgJHt2ZXJzaW9uID09PSA4ID8gJ3NlYy13ZWJzb2NrZXQtb3JpZ2luJyA6ICdvcmlnaW4nfWBdLFxuICAgICAgICBzZWN1cmU6ICEhKHJlcS5zb2NrZXQuYXV0aG9yaXplZCB8fCByZXEuc29ja2V0LmVuY3J5cHRlZCksXG4gICAgICAgIHJlcVxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy52ZXJpZnlDbGllbnQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy52ZXJpZnlDbGllbnQoaW5mbywgKHZlcmlmaWVkLCBjb2RlLCBtZXNzYWdlLCBoZWFkZXJzKSA9PiB7XG4gICAgICAgICAgaWYgKCF2ZXJpZmllZCkge1xuICAgICAgICAgICAgcmV0dXJuIGFib3J0SGFuZHNoYWtlKHNvY2tldCwgY29kZSB8fCA0MDEsIG1lc3NhZ2UsIGhlYWRlcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuY29tcGxldGVVcGdyYWRlKFxuICAgICAgICAgICAgZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIHByb3RvY29scyxcbiAgICAgICAgICAgIHJlcSxcbiAgICAgICAgICAgIHNvY2tldCxcbiAgICAgICAgICAgIGhlYWQsXG4gICAgICAgICAgICBjYlxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnZlcmlmeUNsaWVudChpbmZvKSkgcmV0dXJuIGFib3J0SGFuZHNoYWtlKHNvY2tldCwgNDAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbXBsZXRlVXBncmFkZShleHRlbnNpb25zLCBrZXksIHByb3RvY29scywgcmVxLCBzb2NrZXQsIGhlYWQsIGNiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGdyYWRlIHRoZSBjb25uZWN0aW9uIHRvIFdlYlNvY2tldC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGV4dGVuc2lvbnMgVGhlIGFjY2VwdGVkIGV4dGVuc2lvbnNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgdmFsdWUgb2YgdGhlIGBTZWMtV2ViU29ja2V0LUtleWAgaGVhZGVyXG4gICAqIEBwYXJhbSB7U2V0fSBwcm90b2NvbHMgVGhlIHN1YnByb3RvY29sc1xuICAgKiBAcGFyYW0ge2h0dHAuSW5jb21pbmdNZXNzYWdlfSByZXEgVGhlIHJlcXVlc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7KG5ldC5Tb2NrZXR8dGxzLlNvY2tldCl9IHNvY2tldCBUaGUgbmV0d29yayBzb2NrZXQgYmV0d2VlbiB0aGVcbiAgICogICAgIHNlcnZlciBhbmQgY2xpZW50XG4gICAqIEBwYXJhbSB7QnVmZmVyfSBoZWFkIFRoZSBmaXJzdCBwYWNrZXQgb2YgdGhlIHVwZ3JhZGVkIHN0cmVhbVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBDYWxsYmFja1xuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIHdpdGggdGhlIHNhbWUgc29ja2V0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb21wbGV0ZVVwZ3JhZGUoZXh0ZW5zaW9ucywga2V5LCBwcm90b2NvbHMsIHJlcSwgc29ja2V0LCBoZWFkLCBjYikge1xuICAgIC8vXG4gICAgLy8gRGVzdHJveSB0aGUgc29ja2V0IGlmIHRoZSBjbGllbnQgaGFzIGFscmVhZHkgc2VudCBhIEZJTiBwYWNrZXQuXG4gICAgLy9cbiAgICBpZiAoIXNvY2tldC5yZWFkYWJsZSB8fCAhc29ja2V0LndyaXRhYmxlKSByZXR1cm4gc29ja2V0LmRlc3Ryb3koKTtcblxuICAgIGlmIChzb2NrZXRba1dlYlNvY2tldF0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3NlcnZlci5oYW5kbGVVcGdyYWRlKCkgd2FzIGNhbGxlZCBtb3JlIHRoYW4gb25jZSB3aXRoIHRoZSBzYW1lICcgK1xuICAgICAgICAgICdzb2NrZXQsIHBvc3NpYmx5IGR1ZSB0byBhIG1pc2NvbmZpZ3VyYXRpb24nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zdGF0ZSA+IFJVTk5JTkcpIHJldHVybiBhYm9ydEhhbmRzaGFrZShzb2NrZXQsIDUwMyk7XG5cbiAgICBjb25zdCBkaWdlc3QgPSBjcmVhdGVIYXNoKCdzaGExJylcbiAgICAgIC51cGRhdGUoa2V5ICsgR1VJRClcbiAgICAgIC5kaWdlc3QoJ2Jhc2U2NCcpO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IFtcbiAgICAgICdIVFRQLzEuMSAxMDEgU3dpdGNoaW5nIFByb3RvY29scycsXG4gICAgICAnVXBncmFkZTogd2Vic29ja2V0JyxcbiAgICAgICdDb25uZWN0aW9uOiBVcGdyYWRlJyxcbiAgICAgIGBTZWMtV2ViU29ja2V0LUFjY2VwdDogJHtkaWdlc3R9YFxuICAgIF07XG5cbiAgICBjb25zdCB3cyA9IG5ldyB0aGlzLm9wdGlvbnMuV2ViU29ja2V0KG51bGwpO1xuXG4gICAgaWYgKHByb3RvY29scy5zaXplKSB7XG4gICAgICAvL1xuICAgICAgLy8gT3B0aW9uYWxseSBjYWxsIGV4dGVybmFsIHByb3RvY29sIHNlbGVjdGlvbiBoYW5kbGVyLlxuICAgICAgLy9cbiAgICAgIGNvbnN0IHByb3RvY29sID0gdGhpcy5vcHRpb25zLmhhbmRsZVByb3RvY29sc1xuICAgICAgICA/IHRoaXMub3B0aW9ucy5oYW5kbGVQcm90b2NvbHMocHJvdG9jb2xzLCByZXEpXG4gICAgICAgIDogcHJvdG9jb2xzLnZhbHVlcygpLm5leHQoKS52YWx1ZTtcblxuICAgICAgaWYgKHByb3RvY29sKSB7XG4gICAgICAgIGhlYWRlcnMucHVzaChgU2VjLVdlYlNvY2tldC1Qcm90b2NvbDogJHtwcm90b2NvbH1gKTtcbiAgICAgICAgd3MuX3Byb3RvY29sID0gcHJvdG9jb2w7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0pIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGV4dGVuc2lvbnNbUGVyTWVzc2FnZURlZmxhdGUuZXh0ZW5zaW9uTmFtZV0ucGFyYW1zO1xuICAgICAgY29uc3QgdmFsdWUgPSBleHRlbnNpb24uZm9ybWF0KHtcbiAgICAgICAgW1Blck1lc3NhZ2VEZWZsYXRlLmV4dGVuc2lvbk5hbWVdOiBbcGFyYW1zXVxuICAgICAgfSk7XG4gICAgICBoZWFkZXJzLnB1c2goYFNlYy1XZWJTb2NrZXQtRXh0ZW5zaW9uczogJHt2YWx1ZX1gKTtcbiAgICAgIHdzLl9leHRlbnNpb25zID0gZXh0ZW5zaW9ucztcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIEFsbG93IGV4dGVybmFsIG1vZGlmaWNhdGlvbi9pbnNwZWN0aW9uIG9mIGhhbmRzaGFrZSBoZWFkZXJzLlxuICAgIC8vXG4gICAgdGhpcy5lbWl0KCdoZWFkZXJzJywgaGVhZGVycywgcmVxKTtcblxuICAgIHNvY2tldC53cml0ZShoZWFkZXJzLmNvbmNhdCgnXFxyXFxuJykuam9pbignXFxyXFxuJykpO1xuICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBzb2NrZXRPbkVycm9yKTtcblxuICAgIHdzLnNldFNvY2tldChzb2NrZXQsIGhlYWQsIHtcbiAgICAgIG1heFBheWxvYWQ6IHRoaXMub3B0aW9ucy5tYXhQYXlsb2FkLFxuICAgICAgc2tpcFVURjhWYWxpZGF0aW9uOiB0aGlzLm9wdGlvbnMuc2tpcFVURjhWYWxpZGF0aW9uXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5jbGllbnRzKSB7XG4gICAgICB0aGlzLmNsaWVudHMuYWRkKHdzKTtcbiAgICAgIHdzLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5jbGllbnRzLmRlbGV0ZSh3cyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Nob3VsZEVtaXRDbG9zZSAmJiAhdGhpcy5jbGllbnRzLnNpemUpIHtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXRDbG9zZSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNiKHdzLCByZXEpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViU29ja2V0U2VydmVyO1xuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lcnMgb24gYW4gYEV2ZW50RW1pdHRlcmAgdXNpbmcgYSBtYXAgb2YgPGV2ZW50LCBsaXN0ZW5lcj5cbiAqIHBhaXJzLlxuICpcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBzZXJ2ZXIgVGhlIGV2ZW50IGVtaXR0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0LjxTdHJpbmcsIEZ1bmN0aW9uPn0gbWFwIFRoZSBsaXN0ZW5lcnMgdG8gYWRkXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBhZGRlZCBsaXN0ZW5lcnMgd2hlblxuICogICAgIGNhbGxlZFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWRkTGlzdGVuZXJzKHNlcnZlciwgbWFwKSB7XG4gIGZvciAoY29uc3QgZXZlbnQgb2YgT2JqZWN0LmtleXMobWFwKSkgc2VydmVyLm9uKGV2ZW50LCBtYXBbZXZlbnRdKTtcblxuICByZXR1cm4gZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCkge1xuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgT2JqZWN0LmtleXMobWFwKSkge1xuICAgICAgc2VydmVyLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBtYXBbZXZlbnRdKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogRW1pdCBhIGAnY2xvc2UnYCBldmVudCBvbiBhbiBgRXZlbnRFbWl0dGVyYC5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gc2VydmVyIFRoZSBldmVudCBlbWl0dGVyXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBlbWl0Q2xvc2Uoc2VydmVyKSB7XG4gIHNlcnZlci5fc3RhdGUgPSBDTE9TRUQ7XG4gIHNlcnZlci5lbWl0KCdjbG9zZScpO1xufVxuXG4vKipcbiAqIEhhbmRsZSBwcmVtYXR1cmUgc29ja2V0IGVycm9ycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBzb2NrZXRPbkVycm9yKCkge1xuICB0aGlzLmRlc3Ryb3koKTtcbn1cblxuLyoqXG4gKiBDbG9zZSB0aGUgY29ubmVjdGlvbiB3aGVuIHByZWNvbmRpdGlvbnMgYXJlIG5vdCBmdWxmaWxsZWQuXG4gKlxuICogQHBhcmFtIHsobmV0LlNvY2tldHx0bHMuU29ja2V0KX0gc29ja2V0IFRoZSBzb2NrZXQgb2YgdGhlIHVwZ3JhZGUgcmVxdWVzdFxuICogQHBhcmFtIHtOdW1iZXJ9IGNvZGUgVGhlIEhUVFAgcmVzcG9uc2Ugc3RhdHVzIGNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbWVzc2FnZV0gVGhlIEhUVFAgcmVzcG9uc2UgYm9keVxuICogQHBhcmFtIHtPYmplY3R9IFtoZWFkZXJzXSBBZGRpdGlvbmFsIEhUVFAgcmVzcG9uc2UgaGVhZGVyc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gYWJvcnRIYW5kc2hha2Uoc29ja2V0LCBjb2RlLCBtZXNzYWdlLCBoZWFkZXJzKSB7XG4gIGlmIChzb2NrZXQud3JpdGFibGUpIHtcbiAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCBodHRwLlNUQVRVU19DT0RFU1tjb2RlXTtcbiAgICBoZWFkZXJzID0ge1xuICAgICAgQ29ubmVjdGlvbjogJ2Nsb3NlJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAndGV4dC9odG1sJyxcbiAgICAgICdDb250ZW50LUxlbmd0aCc6IEJ1ZmZlci5ieXRlTGVuZ3RoKG1lc3NhZ2UpLFxuICAgICAgLi4uaGVhZGVyc1xuICAgIH07XG5cbiAgICBzb2NrZXQud3JpdGUoXG4gICAgICBgSFRUUC8xLjEgJHtjb2RlfSAke2h0dHAuU1RBVFVTX0NPREVTW2NvZGVdfVxcclxcbmAgK1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKVxuICAgICAgICAgIC5tYXAoKGgpID0+IGAke2h9OiAke2hlYWRlcnNbaF19YClcbiAgICAgICAgICAuam9pbignXFxyXFxuJykgK1xuICAgICAgICAnXFxyXFxuXFxyXFxuJyArXG4gICAgICAgIG1lc3NhZ2VcbiAgICApO1xuICB9XG5cbiAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIHNvY2tldE9uRXJyb3IpO1xuICBzb2NrZXQuZGVzdHJveSgpO1xufVxuIiwiaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcydcbmltcG9ydCB0eXBlIHsgQmlycGNSZXR1cm4gfSBmcm9tICdiaXJwYydcbmltcG9ydCB7IGNyZWF0ZUJpcnBjIH0gZnJvbSAnYmlycGMnXG5pbXBvcnQgeyBwYXJzZSwgc3RyaW5naWZ5IH0gZnJvbSAnZmxhdHRlZCdcbmltcG9ydCB0eXBlIHsgV2ViU29ja2V0IH0gZnJvbSAnd3MnXG5pbXBvcnQgeyBXZWJTb2NrZXRTZXJ2ZXIgfSBmcm9tICd3cydcbmltcG9ydCB0eXBlIHsgTW9kdWxlTm9kZSB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBBUElfUEFUSCB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB0eXBlIHsgVml0ZXN0IH0gZnJvbSAnLi4vbm9kZSdcbmltcG9ydCB0eXBlIHsgRmlsZSwgTW9kdWxlR3JhcGhEYXRhLCBSZXBvcnRlciwgVGFza1Jlc3VsdFBhY2ssIFVzZXJDb25zb2xlTG9nIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBpbnRlcnByZXRTb3VyY2VQb3MsIHBhcnNlU3RhY2t0cmFjZSB9IGZyb20gJy4uL3V0aWxzL3NvdXJjZS1tYXAnXG5pbXBvcnQgdHlwZSB7IFRyYW5zZm9ybVJlc3VsdFdpdGhTb3VyY2UsIFdlYlNvY2tldEV2ZW50cywgV2ViU29ja2V0SGFuZGxlcnMgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoY3R4OiBWaXRlc3QpIHtcbiAgY29uc3Qgd3NzID0gbmV3IFdlYlNvY2tldFNlcnZlcih7IG5vU2VydmVyOiB0cnVlIH0pXG5cbiAgY29uc3QgY2xpZW50cyA9IG5ldyBNYXA8V2ViU29ja2V0LCBCaXJwY1JldHVybjxXZWJTb2NrZXRFdmVudHM+PigpXG5cbiAgY3R4LnNlcnZlci5odHRwU2VydmVyPy5vbigndXBncmFkZScsIChyZXF1ZXN0LCBzb2NrZXQsIGhlYWQpID0+IHtcbiAgICBpZiAoIXJlcXVlc3QudXJsKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCB7IHBhdGhuYW1lIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsLCAnaHR0cDovL2xvY2FsaG9zdCcpXG4gICAgaWYgKHBhdGhuYW1lICE9PSBBUElfUEFUSClcbiAgICAgIHJldHVyblxuXG4gICAgd3NzLmhhbmRsZVVwZ3JhZGUocmVxdWVzdCwgc29ja2V0LCBoZWFkLCAod3MpID0+IHtcbiAgICAgIHdzcy5lbWl0KCdjb25uZWN0aW9uJywgd3MsIHJlcXVlc3QpXG4gICAgICBzZXR1cENsaWVudCh3cylcbiAgICB9KVxuICB9KVxuXG4gIGZ1bmN0aW9uIHNldHVwQ2xpZW50KHdzOiBXZWJTb2NrZXQpIHtcbiAgICBjb25zdCBycGMgPSBjcmVhdGVCaXJwYzxXZWJTb2NrZXRFdmVudHMsIFdlYlNvY2tldEhhbmRsZXJzPihcbiAgICAgIHtcbiAgICAgICAgZ2V0RmlsZXMoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0eC5zdGF0ZS5nZXRGaWxlcygpXG4gICAgICAgIH0sXG4gICAgICAgIHJlYWRGaWxlKGlkKSB7XG4gICAgICAgICAgcmV0dXJuIGZzLnJlYWRGaWxlKGlkLCAndXRmLTgnKVxuICAgICAgICB9LFxuICAgICAgICB3cml0ZUZpbGUoaWQsIGNvbnRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gZnMud3JpdGVGaWxlKGlkLCBjb250ZW50LCAndXRmLTgnKVxuICAgICAgICB9LFxuICAgICAgICBhc3luYyByZXJ1bihmaWxlcykge1xuICAgICAgICAgIGF3YWl0IGN0eC5yZXJ1bkZpbGVzKGZpbGVzKVxuICAgICAgICB9LFxuICAgICAgICBnZXRDb25maWcoKSB7XG4gICAgICAgICAgcmV0dXJuIGN0eC5jb25maWdcbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0VHJhbnNmb3JtUmVzdWx0KGlkKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0OiBUcmFuc2Zvcm1SZXN1bHRXaXRoU291cmNlIHwgbnVsbCB8IHVuZGVmaW5lZCA9IGF3YWl0IGN0eC52aXRlbm9kZS50cmFuc2Zvcm1SZXF1ZXN0KGlkKVxuICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc3VsdC5zb3VyY2UgPSByZXN1bHQuc291cmNlIHx8IChhd2FpdCBmcy5yZWFkRmlsZShpZCwgJ3V0Zi04JykpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7fVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgZ2V0TW9kdWxlR3JhcGgoaWQ6IHN0cmluZyk6IFByb21pc2U8TW9kdWxlR3JhcGhEYXRhPiB7XG4gICAgICAgICAgY29uc3QgZ3JhcGg6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPiA9IHt9XG4gICAgICAgICAgY29uc3QgZXh0ZXJuYWxpemVkID0gbmV3IFNldDxzdHJpbmc+KClcbiAgICAgICAgICBjb25zdCBpbmxpbmVkID0gbmV3IFNldDxzdHJpbmc+KClcblxuICAgICAgICAgIGZ1bmN0aW9uIGNsZWFySWQoaWQ/OiBzdHJpbmcgfCBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQ/LnJlcGxhY2UoL1xcP3Y9XFx3KyQvLCAnJykgfHwgJydcbiAgICAgICAgICB9XG4gICAgICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0KG1vZD86IE1vZHVsZU5vZGUsIHNlZW4gPSBuZXcgTWFwPE1vZHVsZU5vZGUsIHN0cmluZz4oKSkge1xuICAgICAgICAgICAgaWYgKCFtb2QgfHwgIW1vZC5pZClcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBpZiAoc2Vlbi5oYXMobW9kKSlcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4uZ2V0KG1vZClcbiAgICAgICAgICAgIGxldCBpZCA9IGNsZWFySWQobW9kLmlkKVxuICAgICAgICAgICAgc2Vlbi5zZXQobW9kLCBpZClcbiAgICAgICAgICAgIGNvbnN0IHJld3JvdGUgPSBhd2FpdCBjdHgudml0ZW5vZGUuc2hvdWxkRXh0ZXJuYWxpemUoaWQpXG4gICAgICAgICAgICBpZiAocmV3cm90ZSkge1xuICAgICAgICAgICAgICBpZCA9IHJld3JvdGVcbiAgICAgICAgICAgICAgZXh0ZXJuYWxpemVkLmFkZChpZClcbiAgICAgICAgICAgICAgc2Vlbi5zZXQobW9kLCBpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBpbmxpbmVkLmFkZChpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1vZHMgPSBBcnJheS5mcm9tKG1vZC5pbXBvcnRlZE1vZHVsZXMpLmZpbHRlcihpID0+IGkuaWQgJiYgIWkuaWQuaW5jbHVkZXMoJy92aXRlc3QvZGlzdC8nKSlcbiAgICAgICAgICAgIGdyYXBoW2lkXSA9IChhd2FpdCBQcm9taXNlLmFsbChtb2RzLm1hcChtID0+IGdldChtLCBzZWVuKSkpKS5maWx0ZXIoQm9vbGVhbikgYXMgc3RyaW5nW11cbiAgICAgICAgICAgIHJldHVybiBpZFxuICAgICAgICAgIH1cbiAgICAgICAgICBhd2FpdCBnZXQoY3R4LnNlcnZlci5tb2R1bGVHcmFwaC5nZXRNb2R1bGVCeUlkKGlkKSlcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ3JhcGgsXG4gICAgICAgICAgICBleHRlcm5hbGl6ZWQ6IEFycmF5LmZyb20oZXh0ZXJuYWxpemVkKSxcbiAgICAgICAgICAgIGlubGluZWQ6IEFycmF5LmZyb20oaW5saW5lZCksXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVTbmFwc2hvdChmaWxlPzogRmlsZSkge1xuICAgICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGN0eC51cGRhdGVTbmFwc2hvdCgpXG4gICAgICAgICAgcmV0dXJuIGN0eC51cGRhdGVTbmFwc2hvdChbZmlsZS5maWxlcGF0aF0pXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwb3N0OiBtc2cgPT4gd3Muc2VuZChtc2cpLFxuICAgICAgICBvbjogZm4gPT4gd3Mub24oJ21lc3NhZ2UnLCBmbiksXG4gICAgICAgIGV2ZW50TmFtZXM6IFsnb25Vc2VyQ29uc29sZUxvZycsICdvbkZpbmlzaGVkJywgJ29uQ29sbGVjdGVkJ10sXG4gICAgICAgIHNlcmlhbGl6ZTogc3RyaW5naWZ5LFxuICAgICAgICBkZXNlcmlhbGl6ZTogcGFyc2UsXG4gICAgICB9LFxuICAgIClcblxuICAgIGNsaWVudHMuc2V0KHdzLCBycGMpXG5cbiAgICB3cy5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgICBjbGllbnRzLmRlbGV0ZSh3cylcbiAgICB9KVxuICB9XG5cbiAgY3R4LnJlcG9ydGVycy5wdXNoKG5ldyBXZWJTb2NrZXRSZXBvcnRlcihjdHgsIHdzcywgY2xpZW50cykpXG59XG5cbmNsYXNzIFdlYlNvY2tldFJlcG9ydGVyIGltcGxlbWVudHMgUmVwb3J0ZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY3R4OiBWaXRlc3QsXG4gICAgcHVibGljIHdzczogV2ViU29ja2V0U2VydmVyLFxuICAgIHB1YmxpYyBjbGllbnRzOiBNYXA8V2ViU29ja2V0LCBCaXJwY1JldHVybjxXZWJTb2NrZXRFdmVudHM+PixcbiAgKSB7fVxuXG4gIG9uQ29sbGVjdGVkKGZpbGVzPzogRmlsZVtdKSB7XG4gICAgaWYgKHRoaXMuY2xpZW50cy5zaXplID09PSAwKVxuICAgICAgcmV0dXJuXG4gICAgdGhpcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uQ29sbGVjdGVkPy4oZmlsZXMpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIG9uVGFza1VwZGF0ZShwYWNrczogVGFza1Jlc3VsdFBhY2tbXSkge1xuICAgIGlmICh0aGlzLmNsaWVudHMuc2l6ZSA9PT0gMClcbiAgICAgIHJldHVyblxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocGFja3MubWFwKGFzeW5jKGkpID0+IHtcbiAgICAgIGlmIChpWzFdPy5lcnJvcilcbiAgICAgICAgYXdhaXQgaW50ZXJwcmV0U291cmNlUG9zKHBhcnNlU3RhY2t0cmFjZShpWzFdLmVycm9yIGFzIGFueSksIHRoaXMuY3R4KVxuICAgIH0pKVxuXG4gICAgdGhpcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uVGFza1VwZGF0ZT8uKHBhY2tzKVxuICAgIH0pXG4gIH1cblxuICBvbkZpbmlzaGVkKGZpbGVzPzogRmlsZVtdIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uRmluaXNoZWQ/LihmaWxlcylcbiAgICB9KVxuICB9XG5cbiAgb25Vc2VyQ29uc29sZUxvZyhsb2c6IFVzZXJDb25zb2xlTG9nKSB7XG4gICAgdGhpcy5jbGllbnRzLmZvckVhY2goKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uVXNlckNvbnNvbGVMb2c/Lihsb2cpXG4gICAgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbInBhcnNlIiwiRU1QVFlfQlVGRkVSIiwicmVxdWlyZSQkMCIsImNvbmNhdCIsInRvQXJyYXlCdWZmZXIiLCJ0b0J1ZmZlciIsImJ1ZmZlclV0aWxNb2R1bGUiLCJMaW1pdGVyIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiLCJrU3RhdHVzQ29kZSIsInJlcXVpcmUkJDMiLCJrRXJyb3IiLCJQZXJNZXNzYWdlRGVmbGF0ZSIsInRva2VuQ2hhcnMiLCJpc1ZhbGlkU3RhdHVzQ29kZSIsInZhbGlkYXRpb25Nb2R1bGUiLCJCSU5BUllfVFlQRVMiLCJrV2ViU29ja2V0IiwicmVxdWlyZSQkNCIsIlJlY2VpdmVyIiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJTZW5kZXIiLCJrRm9yT25FdmVudEF0dHJpYnV0ZSIsImtMaXN0ZW5lciIsImZvcm1hdCIsImV4dGVuc2lvbiIsIkV2ZW50RW1pdHRlciIsImh0dHAiLCJjcmVhdGVIYXNoIiwiVVJMIiwicmVxdWlyZSQkNyIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ5IiwicmVxdWlyZSQkMTAiLCJHVUlEIiwicmVxdWlyZSQkMTEiLCJyZXF1aXJlJCQxMiIsInJlcXVpcmUkJDEzIiwicmVxdWlyZSQkMTQiLCJXZWJTb2NrZXQiLCJzb2NrZXRPbkVycm9yIiwiYWJvcnRIYW5kc2hha2UiLCJzdWJwcm90b2NvbCIsIldlYlNvY2tldFNlcnZlciIsImZzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDdEI7QUFDQSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDekIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzNCO0FBQ0EsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN4QjtB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QztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTRyxlQUFhLENBQUMsR0FBRyxFQUFFO0FBQzVCLEVBQUUsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ2hELElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3RCLEdBQUc7QUFDSDtBQUNBLEVBQUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTQyxVQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3hCLEVBQUVBLFVBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNCO0FBQ0EsRUFBRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDekM7QUFDQSxFQUFFLElBQUksR0FBRyxDQUFDO0FBQ1Y7QUFDQSxFQUFFLElBQUksSUFBSSxZQUFZLFdBQVcsRUFBRTtBQUNuQyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLEdBQUcsTUFBTSxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDdkMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JFLEdBQUcsTUFBTTtBQUNULElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsSUFBSUEsVUFBUSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDOUIsR0FBRztBQUNIO0FBQ0EsRUFBRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFDRDtBQUNBLElBQUk7QUFDSixFQUFFLE1BQU0sVUFBVSxHQUFHLFFBQVEsWUFBWSxDQUFDLENBQUM7QUFDM0M7QUFDQSxFQUFFQyxvQkFBYyxHQUFHO0FBQ25CLFlBQUlILFFBQU07QUFDVixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9DLE1BQU0sSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkUsV0FBVyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqRSxLQUFLO0FBQ0wsbUJBQUlDLGVBQWE7QUFDakIsY0FBSUMsVUFBUTtBQUNaLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDekIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEQsV0FBVyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQyxLQUFLO0FBQ0wsR0FBRyxDQUFDO0FBQ0osQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2QkFBNkI7QUFDdkMsRUFBRUMsb0JBQWMsR0FBRztBQUNuQixZQUFJSCxRQUFNO0FBQ1YsSUFBSSxJQUFJLEVBQUUsS0FBSztBQUNmLG1CQUFJQyxlQUFhO0FBQ2pCLGNBQUlDLFVBQVE7QUFDWixJQUFJLE1BQU0sRUFBRSxPQUFPO0FBQ25CLEdBQUcsQ0FBQztBQUNKOztBQzNIQSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNRSxTQUFPLENBQUM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsQ0FBQyxXQUFXLEVBQUU7QUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTTtBQUN4QixNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ25CLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLElBQUksUUFBUSxDQUFDO0FBQy9DLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbkIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNyQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUU7QUFDWCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDakIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRztBQUNYLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUNsRDtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUMxQixNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDcEM7QUFDQSxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN2QixLQUFLO0FBQ0wsR0FBRztBQUNILENBQUM7QUFDRDtJQUNBLE9BQWMsR0FBR0EsU0FBTzs7QUNwRHhCLE1BQU0sSUFBSSxHQUFHLFVBQWUsQ0FBQztBQUM3QjtBQUNBLE1BQU0sVUFBVSxHQUFHQyxvQkFBd0IsQ0FBQztBQUM1QyxNQUFNLE9BQU8sR0FBR0MsT0FBb0IsQ0FBQztBQUNyQyxNQUFNLGVBQUVDLGFBQVcsRUFBRSxHQUFHQyxTQUFzQixDQUFDO0FBQy9DO0FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdEQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN4RCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxNQUFNQyxRQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFdBQVcsQ0FBQztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1DLG1CQUFpQixDQUFDO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO0FBQzdDLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ2xDLElBQUksSUFBSSxDQUFDLFVBQVU7QUFDbkIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsS0FBSyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQzdFLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ2hDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN6QjtBQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDdkI7QUFDQSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDdEIsTUFBTSxNQUFNLFdBQVc7QUFDdkIsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixLQUFLLFNBQVM7QUFDcEQsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQjtBQUMxQyxZQUFZLEVBQUUsQ0FBQztBQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsYUFBYSxHQUFHO0FBQzdCLElBQUksT0FBTyxvQkFBb0IsQ0FBQztBQUNoQyxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssR0FBRztBQUNWLElBQUksTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ3RCO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLEVBQUU7QUFDL0MsTUFBTSxNQUFNLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO0FBQy9DLEtBQUs7QUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtBQUMvQyxNQUFNLE1BQU0sQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUM7QUFDL0MsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0FBQzNDLE1BQU0sTUFBTSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7QUFDeEUsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0FBQzNDLE1BQU0sTUFBTSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUM7QUFDeEUsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLEVBQUU7QUFDMUQsTUFBTSxNQUFNLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBQzNDLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE1BQU0sQ0FBQyxjQUFjLEVBQUU7QUFDekIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMxRDtBQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUztBQUNoQyxRQUFRLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO0FBQzNDLFFBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QztBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3ZCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLE9BQU8sR0FBRztBQUNaLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3ZCLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNCLEtBQUs7QUFDTDtBQUNBLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3ZCLE1BQU0sTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRDtBQUNBLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzNCO0FBQ0EsTUFBTSxJQUFJLFFBQVEsRUFBRTtBQUNwQixRQUFRLFFBQVE7QUFDaEIsVUFBVSxJQUFJLEtBQUs7QUFDbkIsWUFBWSw4REFBOEQ7QUFDMUUsV0FBVztBQUNYLFNBQVMsQ0FBQztBQUNWLE9BQU87QUFDUCxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDekIsSUFBSSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQy9CLElBQUksTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSztBQUM3QyxNQUFNO0FBQ04sUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsS0FBSyxLQUFLO0FBQy9DLFVBQVUsTUFBTSxDQUFDLDBCQUEwQjtBQUMzQyxTQUFTLE1BQU0sQ0FBQyxzQkFBc0I7QUFDdEMsV0FBVyxJQUFJLENBQUMsbUJBQW1CLEtBQUssS0FBSztBQUM3QyxhQUFhLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixLQUFLLFFBQVE7QUFDekQsY0FBYyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztBQUN6RSxTQUFTLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixLQUFLLFFBQVE7QUFDckQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQztBQUN6QyxRQUFRO0FBQ1IsUUFBUSxPQUFPLEtBQUssQ0FBQztBQUNyQixPQUFPO0FBQ1A7QUFDQSxNQUFNLE9BQU8sSUFBSSxDQUFDO0FBQ2xCLEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbkIsTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7QUFDdEUsS0FBSztBQUNMO0FBQ0EsSUFBSSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtBQUN0QyxNQUFNLFFBQVEsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUM7QUFDakQsS0FBSztBQUNMLElBQUksSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7QUFDdEMsTUFBTSxRQUFRLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO0FBQ2pELEtBQUs7QUFDTCxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsbUJBQW1CLEtBQUssUUFBUSxFQUFFO0FBQ3RELE1BQU0sUUFBUSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztBQUNqRSxLQUFLO0FBQ0wsSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsRUFBRTtBQUN0RCxNQUFNLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDakUsS0FBSyxNQUFNO0FBQ1gsTUFBTSxRQUFRLENBQUMsc0JBQXNCLEtBQUssSUFBSTtBQUM5QyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxLQUFLO0FBQ3hDLE1BQU07QUFDTixNQUFNLE9BQU8sUUFBUSxDQUFDLHNCQUFzQixDQUFDO0FBQzdDLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxRQUFRLENBQUM7QUFDcEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGNBQWMsQ0FBQyxRQUFRLEVBQUU7QUFDM0IsSUFBSSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0I7QUFDQSxJQUFJO0FBQ0osTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixLQUFLLEtBQUs7QUFDckQsTUFBTSxNQUFNLENBQUMsMEJBQTBCO0FBQ3ZDLE1BQU07QUFDTixNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztBQUMzRSxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7QUFDeEMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsS0FBSyxRQUFRLEVBQUU7QUFDakUsUUFBUSxNQUFNLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztBQUMxRSxPQUFPO0FBQ1AsS0FBSyxNQUFNO0FBQ1gsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixLQUFLLEtBQUs7QUFDakQsT0FBTyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEtBQUssUUFBUTtBQUM1RCxRQUFRLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDO0FBQzFFLE1BQU07QUFDTixNQUFNLE1BQU0sSUFBSSxLQUFLO0FBQ3JCLFFBQVEsMERBQTBEO0FBQ2xFLE9BQU8sQ0FBQztBQUNSLEtBQUs7QUFDTDtBQUNBLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEIsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLGVBQWUsQ0FBQyxjQUFjLEVBQUU7QUFDbEMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLO0FBQ3ZDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDM0MsUUFBUSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEM7QUFDQSxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDOUIsVUFBVSxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUM7QUFDOUUsU0FBUztBQUNUO0FBQ0EsUUFBUSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCO0FBQ0EsUUFBUSxJQUFJLEdBQUcsS0FBSyx3QkFBd0IsRUFBRTtBQUM5QyxVQUFVLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtBQUM5QixZQUFZLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQy9CLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxFQUFFO0FBQy9ELGNBQWMsTUFBTSxJQUFJLFNBQVM7QUFDakMsZ0JBQWdCLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRSxlQUFlLENBQUM7QUFDaEIsYUFBYTtBQUNiLFlBQVksS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN4QixXQUFXLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDdEMsWUFBWSxNQUFNLElBQUksU0FBUztBQUMvQixjQUFjLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5RCxhQUFhLENBQUM7QUFDZCxXQUFXO0FBQ1gsU0FBUyxNQUFNLElBQUksR0FBRyxLQUFLLHdCQUF3QixFQUFFO0FBQ3JELFVBQVUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDN0IsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUU7QUFDN0QsWUFBWSxNQUFNLElBQUksU0FBUztBQUMvQixjQUFjLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM5RCxhQUFhLENBQUM7QUFDZCxXQUFXO0FBQ1gsVUFBVSxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLFNBQVMsTUFBTTtBQUNmLFVBQVUsR0FBRyxLQUFLLDRCQUE0QjtBQUM5QyxVQUFVLEdBQUcsS0FBSyw0QkFBNEI7QUFDOUMsVUFBVTtBQUNWLFVBQVUsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQzlCLFlBQVksTUFBTSxJQUFJLFNBQVM7QUFDL0IsY0FBYyxDQUFDLDZCQUE2QixFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDOUQsYUFBYSxDQUFDO0FBQ2QsV0FBVztBQUNYLFNBQVMsTUFBTTtBQUNmLFVBQVUsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFNBQVM7QUFDVDtBQUNBLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUM1QixPQUFPLENBQUMsQ0FBQztBQUNULEtBQUssQ0FBQyxDQUFDO0FBQ1A7QUFDQSxJQUFJLE9BQU8sY0FBYyxDQUFDO0FBQzFCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNsQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUs7QUFDOUIsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxLQUFLO0FBQ25ELFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDZixRQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUIsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNoQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUs7QUFDOUIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxLQUFLO0FBQ2pELFFBQVEsSUFBSSxFQUFFLENBQUM7QUFDZixRQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUIsT0FBTyxDQUFDLENBQUM7QUFDVCxLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNuQyxJQUFJLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUMxRDtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEQsTUFBTSxNQUFNLFVBQVU7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUTtBQUM1QyxZQUFZLElBQUksQ0FBQyxvQkFBb0I7QUFDckMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCO0FBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztBQUM1QyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0I7QUFDM0MsUUFBUSxVQUFVO0FBQ2xCLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQy9DLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNoRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3hDO0FBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixJQUFJLElBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFDO0FBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNO0FBQzlCLE1BQU0sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQ0QsUUFBTSxDQUFDLENBQUM7QUFDeEM7QUFDQSxNQUFNLElBQUksR0FBRyxFQUFFO0FBQ2YsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzlCLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDN0IsUUFBUSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsUUFBUSxPQUFPO0FBQ2YsT0FBTztBQUNQO0FBQ0EsTUFBTSxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTTtBQUNwQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQy9CLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7QUFDbkMsT0FBTyxDQUFDO0FBQ1I7QUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFO0FBQ25ELFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM5QixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQzdCLE9BQU8sTUFBTTtBQUNiLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQztBQUNBLFFBQVEsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRTtBQUNuRSxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEMsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQixLQUFLLENBQUMsQ0FBQztBQUNQLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxJQUFJLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUMxRDtBQUNBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEQsTUFBTSxNQUFNLFVBQVU7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUTtBQUM1QyxZQUFZLElBQUksQ0FBQyxvQkFBb0I7QUFDckMsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCO0FBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztBQUM1QyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0I7QUFDM0MsUUFBUSxVQUFVO0FBQ2xCLE9BQU8sQ0FBQyxDQUFDO0FBQ1Q7QUFDQSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkM7QUFDQSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM5QyxLQUFLO0FBQ0w7QUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDO0FBQ3hDO0FBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBTTtBQUNqRCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLFFBQVEsT0FBTztBQUNmLE9BQU87QUFDUDtBQUNBLE1BQU0sSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU07QUFDbEMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUMvQixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQ25DLE9BQU8sQ0FBQztBQUNSO0FBQ0EsTUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN0QztBQUNBLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQztBQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRTtBQUNqRSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUIsT0FBTztBQUNQO0FBQ0EsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNCLEtBQUssQ0FBQyxDQUFDO0FBQ1AsR0FBRztBQUNILENBQUM7QUFDRDtJQUNBLGlCQUFjLEdBQUdDLG1CQUFpQixDQUFDO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO0FBQzlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3JDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtBQUM5QixFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3JDO0FBQ0EsRUFBRTtBQUNGLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVyxHQUFHLENBQUM7QUFDNUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsV0FBVztBQUM5RCxJQUFJO0FBQ0osSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLElBQUksT0FBTztBQUNYLEdBQUc7QUFDSDtBQUNBLEVBQUUsSUFBSSxDQUFDRCxRQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzdELEVBQUUsSUFBSSxDQUFDQSxRQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsbUNBQW1DLENBQUM7QUFDMUQsRUFBRSxJQUFJLENBQUNBLFFBQU0sQ0FBQyxDQUFDRixhQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM3QyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUMzQyxFQUFFLEdBQUcsQ0FBQ0EsYUFBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCOzs7O0FDNWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1JLFlBQVUsR0FBRztBQUNuQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDaEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ2hELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNoRCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDaEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ2hELEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUs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
