import path$2 from 'path';
import fs$2 from 'fs';
import require$$0 from 'util';
import childProcess$1 from 'child_process';
import { p as pathKey, a as signalExit, m as mergeStream$1, b as getStream$1, d as crossSpawn$1, e as onetime$1 } from './vendor-index.91d2a0e5.js';
import require$$0$1 from 'os';
import './vendor-_commonjsHelpers.91d4f591.js';
import 'buffer';
import 'stream';
import 'assert';
import 'events';

var findUp$1 = {exports: {}};

var locatePath = {exports: {}};

class Node {
	/// value;
	/// next;

	constructor(value) {
		this.value = value;

		// TODO: Remove this when targeting Node.js 12.
		this.next = undefined;
	}
}

class Queue$1 {
	// TODO: Use private class fields when targeting Node.js 12.
	// #_head;
	// #_tail;
	// #_size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this._head) {
			this._tail.next = node;
			this._tail = node;
		} else {
			this._head = node;
			this._tail = node;
		}

		this._size++;
	}

	dequeue() {
		const current = this._head;
		if (!current) {
			return;
		}

		this._head = this._head.next;
		this._size--;
		return current.value;
	}

	clear() {
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
	}

	get size() {
		return this._size;
	}

	* [Symbol.iterator]() {
		let current = this._head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}
}

var yoctoQueue = Queue$1;

const Queue = yoctoQueue;

const pLimit$1 = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}

	const queue = new Queue();
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

	const run = async (fn, resolve, ...args) => {
		activeCount++;

		const result = (async () => fn(...args))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (fn, resolve, ...args) => {
		queue.enqueue(run.bind(null, fn, resolve, ...args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};

	const generator = (fn, ...args) => new Promise(resolve => {
		enqueue(fn, resolve, ...args);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.size
		},
		clearQueue: {
			value: () => {
				queue.clear();
			}
		}
	});

	return generator;
};

var pLimit_1 = pLimit$1;

const pLimit = pLimit_1;

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

const pLocate$1 = async (iterable, tester, options) => {
	options = {
		concurrency: Infinity,
		preserveOrder: true,
		...options
	};

	const limit = pLimit(options.concurrency);

	// Start all the promises concurrently with optional limit
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently
	const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
};

var pLocate_1 = pLocate$1;

const path$1 = path$2;
const fs$1 = fs$2;
const {promisify: promisify$1} = require$$0;
const pLocate = pLocate_1;

const fsStat = promisify$1(fs$1.stat);
const fsLStat = promisify$1(fs$1.lstat);

const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile'
};

function checkType({type}) {
	if (type in typeMappings) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => type === undefined || stat[typeMappings[type]]();

locatePath.exports = async (paths, options) => {
	options = {
		cwd: process.cwd(),
		type: 'file',
		allowSymlinks: true,
		...options
	};

	checkType(options);

	const statFn = options.allowSymlinks ? fsStat : fsLStat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFn(path$1.resolve(options.cwd, path_));
			return matchType(options.type, stat);
		} catch {
			return false;
		}
	}, options);
};

locatePath.exports.sync = (paths, options) => {
	options = {
		cwd: process.cwd(),
		allowSymlinks: true,
		type: 'file',
		...options
	};

	checkType(options);

	const statFn = options.allowSymlinks ? fs$1.statSync : fs$1.lstatSync;

	for (const path_ of paths) {
		try {
			const stat = statFn(path$1.resolve(options.cwd, path_));

			if (matchType(options.type, stat)) {
				return path_;
			}
		} catch {}
	}
};

var pathExists = {exports: {}};

const fs = fs$2;
const {promisify} = require$$0;

const pAccess = promisify(fs.access);

pathExists.exports = async path => {
	try {
		await pAccess(path);
		return true;
	} catch (_) {
		return false;
	}
};

pathExists.exports.sync = path => {
	try {
		fs.accessSync(path);
		return true;
	} catch (_) {
		return false;
	}
};

(function (module) {
const path = path$2;
const locatePath$1 = locatePath.exports;
const pathExists$1 = pathExists.exports;

const stop = Symbol('findUp.stop');

module.exports = async (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath$1(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath$1([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.sync = (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = locateOptions => {
		if (typeof name !== 'function') {
			return locatePath$1.sync(paths, locateOptions);
		}

		const foundPath = name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath$1.sync([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const foundPath = runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.exists = pathExists$1;

module.exports.sync.exists = pathExists$1.sync;

module.exports.stop = stop;
}(findUp$1));

var findUp = findUp$1.exports;

var execa$2 = {exports: {}};

var stripFinalNewline$1 = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};

var npmRunPath$1 = {exports: {}};

(function (module) {
const path = path$2;
const pathKey$1 = pathKey.exports;

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey$1()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path.resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path.delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey$1({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};
}(npmRunPath$1));

var main = {};

var signals = {};

var core = {};

Object.defineProperty(core,"__esModule",{value:true});core.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];core.SIGNALS=SIGNALS;

var realtime = {};

Object.defineProperty(realtime,"__esModule",{value:true});realtime.SIGRTMAX=realtime.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};realtime.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return {
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;realtime.SIGRTMAX=SIGRTMAX;

Object.defineProperty(signals,"__esModule",{value:true});signals.getSignals=void 0;var _os$1=require$$0$1;

var _core=core;
var _realtime$1=realtime;



const getSignals=function(){
const realtimeSignals=(0, _realtime$1.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};signals.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os$1.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return {name,number,description,supported,action,forced,standard};
};

Object.defineProperty(main,"__esModule",{value:true});main.signalsByNumber=main.signalsByName=void 0;var _os=require$$0$1;

var _signals=signals;
var _realtime=realtime;



const getSignalsByName=function(){
const signals=(0, _signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return {
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName$1=getSignalsByName();main.signalsByName=signalsByName$1;




const getSignalsByNumber=function(){
const signals=(0, _signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return {};
}

const{name,description,supported,action,forced,standard}=signal;
return {
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();main.signalsByNumber=signalsByNumber;

const {signalsByName} = main;

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError$1 = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

var error = makeError$1;

var stdio = {exports: {}};

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio$1 = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

stdio.exports = normalizeStdio$1;

// `ipc` is pushed unless it is already present
stdio.exports.node = options => {
	const stdio = normalizeStdio$1(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};

const os = require$$0$1;
const onExit = signalExit.exports;

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill$1 = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel$1 = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout$1 = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout$1 = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler$1 = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

var kill = {
	spawnedKill: spawnedKill$1,
	spawnedCancel: spawnedCancel$1,
	setupTimeout: setupTimeout$1,
	validateTimeout: validateTimeout$1,
	setExitHandler: setExitHandler$1
};

const isStream$1 = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream$1.writable = stream =>
	isStream$1(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream$1.readable = stream =>
	isStream$1(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream$1.duplex = stream =>
	isStream$1.writable(stream) &&
	isStream$1.readable(stream);

isStream$1.transform = stream =>
	isStream$1.duplex(stream) &&
	typeof stream._transform === 'function';

var isStream_1 = isStream$1;

const isStream = isStream_1;
const getStream = getStream$1.exports;
const mergeStream = mergeStream$1;

// `input` option
const handleInput$1 = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream$1 = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult$1 = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync$1 = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

var stream = {
	handleInput: handleInput$1,
	makeAllStream: makeAllStream$1,
	getSpawnedResult: getSpawnedResult$1,
	validateInputSync: validateInputSync$1
};

const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise$1 = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise$1 = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

var promise = {
	mergePromise: mergePromise$1,
	getSpawnedPromise: getSpawnedPromise$1
};

const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

const joinCommand$1 = (file, args) => {
	return normalizeArgs(file, args).join(' ');
};

const getEscapedCommand$1 = (file, args) => {
	return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');
};

const SPACES_REGEXP = / +/g;

// Handle `execa.command()`
const parseCommand$1 = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

var command = {
	joinCommand: joinCommand$1,
	getEscapedCommand: getEscapedCommand$1,
	parseCommand: parseCommand$1
};

const path = path$2;
const childProcess = childProcess$1;
const crossSpawn = crossSpawn$1.exports;
const stripFinalNewline = stripFinalNewline$1;
const npmRunPath = npmRunPath$1.exports;
const onetime = onetime$1.exports;
const makeError = error;
const normalizeStdio = stdio.exports;
const {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} = kill;
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = stream;
const {mergePromise, getSpawnedPromise} = promise;
const {joinCommand, parseCommand, getEscapedCommand} = command;

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

execa$2.exports = execa;

execa$2.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

execa$2.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

execa$2.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

execa$2.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};

var execa$1 = execa$2.exports;

// src/detect.ts
var LOCKS = {
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm"
};
async function detectPackageManager(cwd = process.cwd()) {
  const result = await findUp(Object.keys(LOCKS), { cwd });
  const agent = result ? LOCKS[path$2.basename(result)] : null;
  return agent;
}
async function installPackage(names, options = {}) {
  const agent = options.packageManager || await detectPackageManager(options.cwd) || "npm";
  if (!Array.isArray(names))
    names = [names];
  const args = options.additionalArgs || [];
  if (options.preferOffline)
    args.unshift("--prefer-offline");
  return execa$1(agent, [
    agent === "yarn" ? "add" : "install",
    options.dev ? "-D" : "",
    ...args,
    ...names
  ].filter(Boolean), {
    stdio: options.silent ? "ignore" : "inherit",
    cwd: options.cwd
  });
}

export { detectPackageManager, installPackage };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmstaW5zdGFsbC1wa2cuYzJmMzg2ZDEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS95b2N0by1xdWV1ZUAwLjEuMC9ub2RlX21vZHVsZXMveW9jdG8tcXVldWUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcC1saW1pdEAzLjEuMC9ub2RlX21vZHVsZXMvcC1saW1pdC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wLWxvY2F0ZUA1LjAuMC9ub2RlX21vZHVsZXMvcC1sb2NhdGUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbG9jYXRlLXBhdGhANi4wLjAvbm9kZV9tb2R1bGVzL2xvY2F0ZS1wYXRoL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3BhdGgtZXhpc3RzQDQuMC4wL25vZGVfbW9kdWxlcy9wYXRoLWV4aXN0cy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9maW5kLXVwQDUuMC4wL25vZGVfbW9kdWxlcy9maW5kLXVwL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0cmlwLWZpbmFsLW5ld2xpbmVAMi4wLjAvbm9kZV9tb2R1bGVzL3N0cmlwLWZpbmFsLW5ld2xpbmUvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbnBtLXJ1bi1wYXRoQDQuMC4xL25vZGVfbW9kdWxlcy9ucG0tcnVuLXBhdGgvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vaHVtYW4tc2lnbmFsc0AyLjEuMC9ub2RlX21vZHVsZXMvaHVtYW4tc2lnbmFscy9idWlsZC9zcmMvY29yZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9odW1hbi1zaWduYWxzQDIuMS4wL25vZGVfbW9kdWxlcy9odW1hbi1zaWduYWxzL2J1aWxkL3NyYy9yZWFsdGltZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9odW1hbi1zaWduYWxzQDIuMS4wL25vZGVfbW9kdWxlcy9odW1hbi1zaWduYWxzL2J1aWxkL3NyYy9zaWduYWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2h1bWFuLXNpZ25hbHNAMi4xLjAvbm9kZV9tb2R1bGVzL2h1bWFuLXNpZ25hbHMvYnVpbGQvc3JjL21haW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZXhlY2FANS4xLjEvbm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9lcnJvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9leGVjYUA1LjEuMS9ub2RlX21vZHVsZXMvZXhlY2EvbGliL3N0ZGlvLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2V4ZWNhQDUuMS4xL25vZGVfbW9kdWxlcy9leGVjYS9saWIva2lsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9pcy1zdHJlYW1AMi4wLjEvbm9kZV9tb2R1bGVzL2lzLXN0cmVhbS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9leGVjYUA1LjEuMS9ub2RlX21vZHVsZXMvZXhlY2EvbGliL3N0cmVhbS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9leGVjYUA1LjEuMS9ub2RlX21vZHVsZXMvZXhlY2EvbGliL3Byb21pc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZXhlY2FANS4xLjEvbm9kZV9tb2R1bGVzL2V4ZWNhL2xpYi9jb21tYW5kLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2V4ZWNhQDUuMS4xL25vZGVfbW9kdWxlcy9leGVjYS9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AYW50ZnUraW5zdGFsbC1wa2dAMC4xLjAvbm9kZV9tb2R1bGVzL0BhbnRmdS9pbnN0YWxsLXBrZy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBOb2RlIHtcblx0Ly8vIHZhbHVlO1xuXHQvLy8gbmV4dDtcblxuXHRjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuXHRcdC8vIFRPRE86IFJlbW92ZSB0aGlzIHdoZW4gdGFyZ2V0aW5nIE5vZGUuanMgMTIuXG5cdFx0dGhpcy5uZXh0ID0gdW5kZWZpbmVkO1xuXHR9XG59XG5cbmNsYXNzIFF1ZXVlIHtcblx0Ly8gVE9ETzogVXNlIHByaXZhdGUgY2xhc3MgZmllbGRzIHdoZW4gdGFyZ2V0aW5nIE5vZGUuanMgMTIuXG5cdC8vICNfaGVhZDtcblx0Ly8gI190YWlsO1xuXHQvLyAjX3NpemU7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5jbGVhcigpO1xuXHR9XG5cblx0ZW5xdWV1ZSh2YWx1ZSkge1xuXHRcdGNvbnN0IG5vZGUgPSBuZXcgTm9kZSh2YWx1ZSk7XG5cblx0XHRpZiAodGhpcy5faGVhZCkge1xuXHRcdFx0dGhpcy5fdGFpbC5uZXh0ID0gbm9kZTtcblx0XHRcdHRoaXMuX3RhaWwgPSBub2RlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9oZWFkID0gbm9kZTtcblx0XHRcdHRoaXMuX3RhaWwgPSBub2RlO1xuXHRcdH1cblxuXHRcdHRoaXMuX3NpemUrKztcblx0fVxuXG5cdGRlcXVldWUoKSB7XG5cdFx0Y29uc3QgY3VycmVudCA9IHRoaXMuX2hlYWQ7XG5cdFx0aWYgKCFjdXJyZW50KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5faGVhZCA9IHRoaXMuX2hlYWQubmV4dDtcblx0XHR0aGlzLl9zaXplLS07XG5cdFx0cmV0dXJuIGN1cnJlbnQudmFsdWU7XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHR0aGlzLl9oZWFkID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuX3RhaWwgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5fc2l6ZSA9IDA7XG5cdH1cblxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fc2l6ZTtcblx0fVxuXG5cdCogW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG5cdFx0bGV0IGN1cnJlbnQgPSB0aGlzLl9oZWFkO1xuXG5cdFx0d2hpbGUgKGN1cnJlbnQpIHtcblx0XHRcdHlpZWxkIGN1cnJlbnQudmFsdWU7XG5cdFx0XHRjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgUXVldWUgPSByZXF1aXJlKCd5b2N0by1xdWV1ZScpO1xuXG5jb25zdCBwTGltaXQgPSBjb25jdXJyZW5jeSA9PiB7XG5cdGlmICghKChOdW1iZXIuaXNJbnRlZ2VyKGNvbmN1cnJlbmN5KSB8fCBjb25jdXJyZW5jeSA9PT0gSW5maW5pdHkpICYmIGNvbmN1cnJlbmN5ID4gMCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBgY29uY3VycmVuY3lgIHRvIGJlIGEgbnVtYmVyIGZyb20gMSBhbmQgdXAnKTtcblx0fVxuXG5cdGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKCk7XG5cdGxldCBhY3RpdmVDb3VudCA9IDA7XG5cblx0Y29uc3QgbmV4dCA9ICgpID0+IHtcblx0XHRhY3RpdmVDb3VudC0tO1xuXG5cdFx0aWYgKHF1ZXVlLnNpemUgPiAwKSB7XG5cdFx0XHRxdWV1ZS5kZXF1ZXVlKCkoKTtcblx0XHR9XG5cdH07XG5cblx0Y29uc3QgcnVuID0gYXN5bmMgKGZuLCByZXNvbHZlLCAuLi5hcmdzKSA9PiB7XG5cdFx0YWN0aXZlQ291bnQrKztcblxuXHRcdGNvbnN0IHJlc3VsdCA9IChhc3luYyAoKSA9PiBmbiguLi5hcmdzKSkoKTtcblxuXHRcdHJlc29sdmUocmVzdWx0KTtcblxuXHRcdHRyeSB7XG5cdFx0XHRhd2FpdCByZXN1bHQ7XG5cdFx0fSBjYXRjaCB7fVxuXG5cdFx0bmV4dCgpO1xuXHR9O1xuXG5cdGNvbnN0IGVucXVldWUgPSAoZm4sIHJlc29sdmUsIC4uLmFyZ3MpID0+IHtcblx0XHRxdWV1ZS5lbnF1ZXVlKHJ1bi5iaW5kKG51bGwsIGZuLCByZXNvbHZlLCAuLi5hcmdzKSk7XG5cblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0Ly8gVGhpcyBmdW5jdGlvbiBuZWVkcyB0byB3YWl0IHVudGlsIHRoZSBuZXh0IG1pY3JvdGFzayBiZWZvcmUgY29tcGFyaW5nXG5cdFx0XHQvLyBgYWN0aXZlQ291bnRgIHRvIGBjb25jdXJyZW5jeWAsIGJlY2F1c2UgYGFjdGl2ZUNvdW50YCBpcyB1cGRhdGVkIGFzeW5jaHJvbm91c2x5XG5cdFx0XHQvLyB3aGVuIHRoZSBydW4gZnVuY3Rpb24gaXMgZGVxdWV1ZWQgYW5kIGNhbGxlZC4gVGhlIGNvbXBhcmlzb24gaW4gdGhlIGlmLXN0YXRlbWVudFxuXHRcdFx0Ly8gbmVlZHMgdG8gaGFwcGVuIGFzeW5jaHJvbm91c2x5IGFzIHdlbGwgdG8gZ2V0IGFuIHVwLXRvLWRhdGUgdmFsdWUgZm9yIGBhY3RpdmVDb3VudGAuXG5cdFx0XHRhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcblxuXHRcdFx0aWYgKGFjdGl2ZUNvdW50IDwgY29uY3VycmVuY3kgJiYgcXVldWUuc2l6ZSA+IDApIHtcblx0XHRcdFx0cXVldWUuZGVxdWV1ZSgpKCk7XG5cdFx0XHR9XG5cdFx0fSkoKTtcblx0fTtcblxuXHRjb25zdCBnZW5lcmF0b3IgPSAoZm4sIC4uLmFyZ3MpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuXHRcdGVucXVldWUoZm4sIHJlc29sdmUsIC4uLmFyZ3MpO1xuXHR9KTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnZW5lcmF0b3IsIHtcblx0XHRhY3RpdmVDb3VudDoge1xuXHRcdFx0Z2V0OiAoKSA9PiBhY3RpdmVDb3VudFxuXHRcdH0sXG5cdFx0cGVuZGluZ0NvdW50OiB7XG5cdFx0XHRnZXQ6ICgpID0+IHF1ZXVlLnNpemVcblx0XHR9LFxuXHRcdGNsZWFyUXVldWU6IHtcblx0XHRcdHZhbHVlOiAoKSA9PiB7XG5cdFx0XHRcdHF1ZXVlLmNsZWFyKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZ2VuZXJhdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwTGltaXQ7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBwTGltaXQgPSByZXF1aXJlKCdwLWxpbWl0Jyk7XG5cbmNsYXNzIEVuZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy52YWx1ZSA9IHZhbHVlO1xuXHR9XG59XG5cbi8vIFRoZSBpbnB1dCBjYW4gYWxzbyBiZSBhIHByb21pc2UsIHNvIHdlIGF3YWl0IGl0XG5jb25zdCB0ZXN0RWxlbWVudCA9IGFzeW5jIChlbGVtZW50LCB0ZXN0ZXIpID0+IHRlc3Rlcihhd2FpdCBlbGVtZW50KTtcblxuLy8gVGhlIGlucHV0IGNhbiBhbHNvIGJlIGEgcHJvbWlzZSwgc28gd2UgYFByb21pc2UuYWxsKClgIHRoZW0gYm90aFxuY29uc3QgZmluZGVyID0gYXN5bmMgZWxlbWVudCA9PiB7XG5cdGNvbnN0IHZhbHVlcyA9IGF3YWl0IFByb21pc2UuYWxsKGVsZW1lbnQpO1xuXHRpZiAodmFsdWVzWzFdID09PSB0cnVlKSB7XG5cdFx0dGhyb3cgbmV3IEVuZEVycm9yKHZhbHVlc1swXSk7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBwTG9jYXRlID0gYXN5bmMgKGl0ZXJhYmxlLCB0ZXN0ZXIsIG9wdGlvbnMpID0+IHtcblx0b3B0aW9ucyA9IHtcblx0XHRjb25jdXJyZW5jeTogSW5maW5pdHksXG5cdFx0cHJlc2VydmVPcmRlcjogdHJ1ZSxcblx0XHQuLi5vcHRpb25zXG5cdH07XG5cblx0Y29uc3QgbGltaXQgPSBwTGltaXQob3B0aW9ucy5jb25jdXJyZW5jeSk7XG5cblx0Ly8gU3RhcnQgYWxsIHRoZSBwcm9taXNlcyBjb25jdXJyZW50bHkgd2l0aCBvcHRpb25hbCBsaW1pdFxuXHRjb25zdCBpdGVtcyA9IFsuLi5pdGVyYWJsZV0ubWFwKGVsZW1lbnQgPT4gW2VsZW1lbnQsIGxpbWl0KHRlc3RFbGVtZW50LCBlbGVtZW50LCB0ZXN0ZXIpXSk7XG5cblx0Ly8gQ2hlY2sgdGhlIHByb21pc2VzIGVpdGhlciBzZXJpYWxseSBvciBjb25jdXJyZW50bHlcblx0Y29uc3QgY2hlY2tMaW1pdCA9IHBMaW1pdChvcHRpb25zLnByZXNlcnZlT3JkZXIgPyAxIDogSW5maW5pdHkpO1xuXG5cdHRyeSB7XG5cdFx0YXdhaXQgUHJvbWlzZS5hbGwoaXRlbXMubWFwKGVsZW1lbnQgPT4gY2hlY2tMaW1pdChmaW5kZXIsIGVsZW1lbnQpKSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0aWYgKGVycm9yIGluc3RhbmNlb2YgRW5kRXJyb3IpIHtcblx0XHRcdHJldHVybiBlcnJvci52YWx1ZTtcblx0XHR9XG5cblx0XHR0aHJvdyBlcnJvcjtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwTG9jYXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHtwcm9taXNpZnl9ID0gcmVxdWlyZSgndXRpbCcpO1xuY29uc3QgcExvY2F0ZSA9IHJlcXVpcmUoJ3AtbG9jYXRlJyk7XG5cbmNvbnN0IGZzU3RhdCA9IHByb21pc2lmeShmcy5zdGF0KTtcbmNvbnN0IGZzTFN0YXQgPSBwcm9taXNpZnkoZnMubHN0YXQpO1xuXG5jb25zdCB0eXBlTWFwcGluZ3MgPSB7XG5cdGRpcmVjdG9yeTogJ2lzRGlyZWN0b3J5Jyxcblx0ZmlsZTogJ2lzRmlsZSdcbn07XG5cbmZ1bmN0aW9uIGNoZWNrVHlwZSh7dHlwZX0pIHtcblx0aWYgKHR5cGUgaW4gdHlwZU1hcHBpbmdzKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHR5cGUgc3BlY2lmaWVkOiAke3R5cGV9YCk7XG59XG5cbmNvbnN0IG1hdGNoVHlwZSA9ICh0eXBlLCBzdGF0KSA9PiB0eXBlID09PSB1bmRlZmluZWQgfHwgc3RhdFt0eXBlTWFwcGluZ3NbdHlwZV1dKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgKHBhdGhzLCBvcHRpb25zKSA9PiB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxuXHRcdHR5cGU6ICdmaWxlJyxcblx0XHRhbGxvd1N5bWxpbmtzOiB0cnVlLFxuXHRcdC4uLm9wdGlvbnNcblx0fTtcblxuXHRjaGVja1R5cGUob3B0aW9ucyk7XG5cblx0Y29uc3Qgc3RhdEZuID0gb3B0aW9ucy5hbGxvd1N5bWxpbmtzID8gZnNTdGF0IDogZnNMU3RhdDtcblxuXHRyZXR1cm4gcExvY2F0ZShwYXRocywgYXN5bmMgcGF0aF8gPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzdGF0ID0gYXdhaXQgc3RhdEZuKHBhdGgucmVzb2x2ZShvcHRpb25zLmN3ZCwgcGF0aF8pKTtcblx0XHRcdHJldHVybiBtYXRjaFR5cGUob3B0aW9ucy50eXBlLCBzdGF0KTtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0sIG9wdGlvbnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuc3luYyA9IChwYXRocywgb3B0aW9ucykgPT4ge1xuXHRvcHRpb25zID0ge1xuXHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcblx0XHRhbGxvd1N5bWxpbmtzOiB0cnVlLFxuXHRcdHR5cGU6ICdmaWxlJyxcblx0XHQuLi5vcHRpb25zXG5cdH07XG5cblx0Y2hlY2tUeXBlKG9wdGlvbnMpO1xuXG5cdGNvbnN0IHN0YXRGbiA9IG9wdGlvbnMuYWxsb3dTeW1saW5rcyA/IGZzLnN0YXRTeW5jIDogZnMubHN0YXRTeW5jO1xuXG5cdGZvciAoY29uc3QgcGF0aF8gb2YgcGF0aHMpIHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc3RhdCA9IHN0YXRGbihwYXRoLnJlc29sdmUob3B0aW9ucy5jd2QsIHBhdGhfKSk7XG5cblx0XHRcdGlmIChtYXRjaFR5cGUob3B0aW9ucy50eXBlLCBzdGF0KSkge1xuXHRcdFx0XHRyZXR1cm4gcGF0aF87XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCB7fVxuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3Qge3Byb21pc2lmeX0gPSByZXF1aXJlKCd1dGlsJyk7XG5cbmNvbnN0IHBBY2Nlc3MgPSBwcm9taXNpZnkoZnMuYWNjZXNzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBwYXRoID0+IHtcblx0dHJ5IHtcblx0XHRhd2FpdCBwQWNjZXNzKHBhdGgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5zeW5jID0gcGF0aCA9PiB7XG5cdHRyeSB7XG5cdFx0ZnMuYWNjZXNzU3luYyhwYXRoKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoXykge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBsb2NhdGVQYXRoID0gcmVxdWlyZSgnbG9jYXRlLXBhdGgnKTtcbmNvbnN0IHBhdGhFeGlzdHMgPSByZXF1aXJlKCdwYXRoLWV4aXN0cycpO1xuXG5jb25zdCBzdG9wID0gU3ltYm9sKCdmaW5kVXAuc3RvcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIChuYW1lLCBvcHRpb25zID0ge30pID0+IHtcblx0bGV0IGRpcmVjdG9yeSA9IHBhdGgucmVzb2x2ZShvcHRpb25zLmN3ZCB8fCAnJyk7XG5cdGNvbnN0IHtyb290fSA9IHBhdGgucGFyc2UoZGlyZWN0b3J5KTtcblx0Y29uc3QgcGF0aHMgPSBbXS5jb25jYXQobmFtZSk7XG5cblx0Y29uc3QgcnVuTWF0Y2hlciA9IGFzeW5jIGxvY2F0ZU9wdGlvbnMgPT4ge1xuXHRcdGlmICh0eXBlb2YgbmFtZSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0cmV0dXJuIGxvY2F0ZVBhdGgocGF0aHMsIGxvY2F0ZU9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvdW5kUGF0aCA9IGF3YWl0IG5hbWUobG9jYXRlT3B0aW9ucy5jd2QpO1xuXHRcdGlmICh0eXBlb2YgZm91bmRQYXRoID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGxvY2F0ZVBhdGgoW2ZvdW5kUGF0aF0sIGxvY2F0ZU9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmb3VuZFBhdGg7XG5cdH07XG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuXHR3aGlsZSAodHJ1ZSkge1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG5cdFx0Y29uc3QgZm91bmRQYXRoID0gYXdhaXQgcnVuTWF0Y2hlcih7Li4ub3B0aW9ucywgY3dkOiBkaXJlY3Rvcnl9KTtcblxuXHRcdGlmIChmb3VuZFBhdGggPT09IHN0b3ApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZm91bmRQYXRoKSB7XG5cdFx0XHRyZXR1cm4gcGF0aC5yZXNvbHZlKGRpcmVjdG9yeSwgZm91bmRQYXRoKTtcblx0XHR9XG5cblx0XHRpZiAoZGlyZWN0b3J5ID09PSByb290KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGRpcmVjdG9yeSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLnN5bmMgPSAobmFtZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGxldCBkaXJlY3RvcnkgPSBwYXRoLnJlc29sdmUob3B0aW9ucy5jd2QgfHwgJycpO1xuXHRjb25zdCB7cm9vdH0gPSBwYXRoLnBhcnNlKGRpcmVjdG9yeSk7XG5cdGNvbnN0IHBhdGhzID0gW10uY29uY2F0KG5hbWUpO1xuXG5cdGNvbnN0IHJ1bk1hdGNoZXIgPSBsb2NhdGVPcHRpb25zID0+IHtcblx0XHRpZiAodHlwZW9mIG5hbWUgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJldHVybiBsb2NhdGVQYXRoLnN5bmMocGF0aHMsIGxvY2F0ZU9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZvdW5kUGF0aCA9IG5hbWUobG9jYXRlT3B0aW9ucy5jd2QpO1xuXHRcdGlmICh0eXBlb2YgZm91bmRQYXRoID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIGxvY2F0ZVBhdGguc3luYyhbZm91bmRQYXRoXSwgbG9jYXRlT3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZvdW5kUGF0aDtcblx0fTtcblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG5cdHdoaWxlICh0cnVlKSB7XG5cdFx0Y29uc3QgZm91bmRQYXRoID0gcnVuTWF0Y2hlcih7Li4ub3B0aW9ucywgY3dkOiBkaXJlY3Rvcnl9KTtcblxuXHRcdGlmIChmb3VuZFBhdGggPT09IHN0b3ApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoZm91bmRQYXRoKSB7XG5cdFx0XHRyZXR1cm4gcGF0aC5yZXNvbHZlKGRpcmVjdG9yeSwgZm91bmRQYXRoKTtcblx0XHR9XG5cblx0XHRpZiAoZGlyZWN0b3J5ID09PSByb290KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGRpcmVjdG9yeSk7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmV4aXN0cyA9IHBhdGhFeGlzdHM7XG5cbm1vZHVsZS5leHBvcnRzLnN5bmMuZXhpc3RzID0gcGF0aEV4aXN0cy5zeW5jO1xuXG5tb2R1bGUuZXhwb3J0cy5zdG9wID0gc3RvcDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCA9PiB7XG5cdGNvbnN0IExGID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/ICdcXG4nIDogJ1xcbicuY2hhckNvZGVBdCgpO1xuXHRjb25zdCBDUiA9IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyAnXFxyJyA6ICdcXHInLmNoYXJDb2RlQXQoKTtcblxuXHRpZiAoaW5wdXRbaW5wdXQubGVuZ3RoIC0gMV0gPT09IExGKSB7XG5cdFx0aW5wdXQgPSBpbnB1dC5zbGljZSgwLCBpbnB1dC5sZW5ndGggLSAxKTtcblx0fVxuXG5cdGlmIChpbnB1dFtpbnB1dC5sZW5ndGggLSAxXSA9PT0gQ1IpIHtcblx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIGlucHV0Lmxlbmd0aCAtIDEpO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBwYXRoS2V5ID0gcmVxdWlyZSgncGF0aC1rZXknKTtcblxuY29uc3QgbnBtUnVuUGF0aCA9IG9wdGlvbnMgPT4ge1xuXHRvcHRpb25zID0ge1xuXHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcblx0XHRwYXRoOiBwcm9jZXNzLmVudltwYXRoS2V5KCldLFxuXHRcdGV4ZWNQYXRoOiBwcm9jZXNzLmV4ZWNQYXRoLFxuXHRcdC4uLm9wdGlvbnNcblx0fTtcblxuXHRsZXQgcHJldmlvdXM7XG5cdGxldCBjd2RQYXRoID0gcGF0aC5yZXNvbHZlKG9wdGlvbnMuY3dkKTtcblx0Y29uc3QgcmVzdWx0ID0gW107XG5cblx0d2hpbGUgKHByZXZpb3VzICE9PSBjd2RQYXRoKSB7XG5cdFx0cmVzdWx0LnB1c2gocGF0aC5qb2luKGN3ZFBhdGgsICdub2RlX21vZHVsZXMvLmJpbicpKTtcblx0XHRwcmV2aW91cyA9IGN3ZFBhdGg7XG5cdFx0Y3dkUGF0aCA9IHBhdGgucmVzb2x2ZShjd2RQYXRoLCAnLi4nKTtcblx0fVxuXG5cdC8vIEVuc3VyZSB0aGUgcnVubmluZyBgbm9kZWAgYmluYXJ5IGlzIHVzZWRcblx0Y29uc3QgZXhlY1BhdGhEaXIgPSBwYXRoLnJlc29sdmUob3B0aW9ucy5jd2QsIG9wdGlvbnMuZXhlY1BhdGgsICcuLicpO1xuXHRyZXN1bHQucHVzaChleGVjUGF0aERpcik7XG5cblx0cmV0dXJuIHJlc3VsdC5jb25jYXQob3B0aW9ucy5wYXRoKS5qb2luKHBhdGguZGVsaW1pdGVyKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbnBtUnVuUGF0aDtcbi8vIFRPRE86IFJlbW92ZSB0aGlzIGZvciB0aGUgbmV4dCBtYWpvciByZWxlYXNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gbnBtUnVuUGF0aDtcblxubW9kdWxlLmV4cG9ydHMuZW52ID0gb3B0aW9ucyA9PiB7XG5cdG9wdGlvbnMgPSB7XG5cdFx0ZW52OiBwcm9jZXNzLmVudixcblx0XHQuLi5vcHRpb25zXG5cdH07XG5cblx0Y29uc3QgZW52ID0gey4uLm9wdGlvbnMuZW52fTtcblx0Y29uc3QgcGF0aCA9IHBhdGhLZXkoe2Vudn0pO1xuXG5cdG9wdGlvbnMucGF0aCA9IGVudltwYXRoXTtcblx0ZW52W3BhdGhdID0gbW9kdWxlLmV4cG9ydHMob3B0aW9ucyk7XG5cblx0cmV0dXJuIGVudjtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuU0lHTkFMUz12b2lkIDA7XG5cbmNvbnN0IFNJR05BTFM9W1xue1xubmFtZTpcIlNJR0hVUFwiLFxubnVtYmVyOjEsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiVGVybWluYWwgY2xvc2VkXCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHSU5UXCIsXG5udW1iZXI6MixcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJVc2VyIGludGVycnVwdGlvbiB3aXRoIENUUkwtQ1wiLFxuc3RhbmRhcmQ6XCJhbnNpXCJ9LFxuXG57XG5uYW1lOlwiU0lHUVVJVFwiLFxubnVtYmVyOjMsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIlVzZXIgaW50ZXJydXB0aW9uIHdpdGggQ1RSTC1cXFxcXCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHSUxMXCIsXG5udW1iZXI6NCxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiSW52YWxpZCBtYWNoaW5lIGluc3RydWN0aW9uXCIsXG5zdGFuZGFyZDpcImFuc2lcIn0sXG5cbntcbm5hbWU6XCJTSUdUUkFQXCIsXG5udW1iZXI6NSxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiRGVidWdnZXIgYnJlYWtwb2ludFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwifSxcblxue1xubmFtZTpcIlNJR0FCUlRcIixcbm51bWJlcjo2LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJBYm9ydGVkXCIsXG5zdGFuZGFyZDpcImFuc2lcIn0sXG5cbntcbm5hbWU6XCJTSUdJT1RcIixcbm51bWJlcjo2LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJBYm9ydGVkXCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR0JVU1wiLFxubnVtYmVyOjcsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcblwiQnVzIGVycm9yIGR1ZSB0byBtaXNhbGlnbmVkLCBub24tZXhpc3RpbmcgYWRkcmVzcyBvciBwYWdpbmcgZXJyb3JcIixcbnN0YW5kYXJkOlwiYnNkXCJ9LFxuXG57XG5uYW1lOlwiU0lHRU1UXCIsXG5udW1iZXI6NyxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJDb21tYW5kIHNob3VsZCBiZSBlbXVsYXRlZCBidXQgaXMgbm90IGltcGxlbWVudGVkXCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHRlBFXCIsXG5udW1iZXI6OCxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiRmxvYXRpbmcgcG9pbnQgYXJpdGhtZXRpYyBlcnJvclwiLFxuc3RhbmRhcmQ6XCJhbnNpXCJ9LFxuXG57XG5uYW1lOlwiU0lHS0lMTFwiLFxubnVtYmVyOjksXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiRm9yY2VkIHRlcm1pbmF0aW9uXCIsXG5zdGFuZGFyZDpcInBvc2l4XCIsXG5mb3JjZWQ6dHJ1ZX0sXG5cbntcbm5hbWU6XCJTSUdVU1IxXCIsXG5udW1iZXI6MTAsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiQXBwbGljYXRpb24tc3BlY2lmaWMgc2lnbmFsXCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHU0VHVlwiLFxubnVtYmVyOjExLFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJTZWdtZW50YXRpb24gZmF1bHRcIixcbnN0YW5kYXJkOlwiYW5zaVwifSxcblxue1xubmFtZTpcIlNJR1VTUjJcIixcbm51bWJlcjoxMixcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJBcHBsaWNhdGlvbi1zcGVjaWZpYyBzaWduYWxcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdQSVBFXCIsXG5udW1iZXI6MTMsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiQnJva2VuIHBpcGUgb3Igc29ja2V0XCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHQUxSTVwiLFxubnVtYmVyOjE0LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlRpbWVvdXQgb3IgdGltZXJcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdURVJNXCIsXG5udW1iZXI6MTUsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiVGVybWluYXRpb25cIixcbnN0YW5kYXJkOlwiYW5zaVwifSxcblxue1xubmFtZTpcIlNJR1NUS0ZMVFwiLFxubnVtYmVyOjE2LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlN0YWNrIGlzIGVtcHR5IG9yIG92ZXJmbG93ZWRcIixcbnN0YW5kYXJkOlwib3RoZXJcIn0sXG5cbntcbm5hbWU6XCJTSUdDSExEXCIsXG5udW1iZXI6MTcsXG5hY3Rpb246XCJpZ25vcmVcIixcbmRlc2NyaXB0aW9uOlwiQ2hpbGQgcHJvY2VzcyB0ZXJtaW5hdGVkLCBwYXVzZWQgb3IgdW5wYXVzZWRcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdDTERcIixcbm51bWJlcjoxNyxcbmFjdGlvbjpcImlnbm9yZVwiLFxuZGVzY3JpcHRpb246XCJDaGlsZCBwcm9jZXNzIHRlcm1pbmF0ZWQsIHBhdXNlZCBvciB1bnBhdXNlZFwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR0NPTlRcIixcbm51bWJlcjoxOCxcbmFjdGlvbjpcInVucGF1c2VcIixcbmRlc2NyaXB0aW9uOlwiVW5wYXVzZWRcIixcbnN0YW5kYXJkOlwicG9zaXhcIixcbmZvcmNlZDp0cnVlfSxcblxue1xubmFtZTpcIlNJR1NUT1BcIixcbm51bWJlcjoxOSxcbmFjdGlvbjpcInBhdXNlXCIsXG5kZXNjcmlwdGlvbjpcIlBhdXNlZFwiLFxuc3RhbmRhcmQ6XCJwb3NpeFwiLFxuZm9yY2VkOnRydWV9LFxuXG57XG5uYW1lOlwiU0lHVFNUUFwiLFxubnVtYmVyOjIwLFxuYWN0aW9uOlwicGF1c2VcIixcbmRlc2NyaXB0aW9uOlwiUGF1c2VkIHVzaW5nIENUUkwtWiBvciBcXFwic3VzcGVuZFxcXCJcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdUVElOXCIsXG5udW1iZXI6MjEsXG5hY3Rpb246XCJwYXVzZVwiLFxuZGVzY3JpcHRpb246XCJCYWNrZ3JvdW5kIHByb2Nlc3MgY2Fubm90IHJlYWQgdGVybWluYWwgaW5wdXRcIixcbnN0YW5kYXJkOlwicG9zaXhcIn0sXG5cbntcbm5hbWU6XCJTSUdCUkVBS1wiLFxubnVtYmVyOjIxLFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIlVzZXIgaW50ZXJydXB0aW9uIHdpdGggQ1RSTC1CUkVBS1wiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR1RUT1VcIixcbm51bWJlcjoyMixcbmFjdGlvbjpcInBhdXNlXCIsXG5kZXNjcmlwdGlvbjpcIkJhY2tncm91bmQgcHJvY2VzcyBjYW5ub3Qgd3JpdGUgdG8gdGVybWluYWwgb3V0cHV0XCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9LFxuXG57XG5uYW1lOlwiU0lHVVJHXCIsXG5udW1iZXI6MjMsXG5hY3Rpb246XCJpZ25vcmVcIixcbmRlc2NyaXB0aW9uOlwiU29ja2V0IHJlY2VpdmVkIG91dC1vZi1iYW5kIGRhdGFcIixcbnN0YW5kYXJkOlwiYnNkXCJ9LFxuXG57XG5uYW1lOlwiU0lHWENQVVwiLFxubnVtYmVyOjI0LFxuYWN0aW9uOlwiY29yZVwiLFxuZGVzY3JpcHRpb246XCJQcm9jZXNzIHRpbWVkIG91dFwiLFxuc3RhbmRhcmQ6XCJic2RcIn0sXG5cbntcbm5hbWU6XCJTSUdYRlNaXCIsXG5udW1iZXI6MjUsXG5hY3Rpb246XCJjb3JlXCIsXG5kZXNjcmlwdGlvbjpcIkZpbGUgdG9vIGJpZ1wiLFxuc3RhbmRhcmQ6XCJic2RcIn0sXG5cbntcbm5hbWU6XCJTSUdWVEFMUk1cIixcbm51bWJlcjoyNixcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJUaW1lb3V0IG9yIHRpbWVyXCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR1BST0ZcIixcbm51bWJlcjoyNyxcbmFjdGlvbjpcInRlcm1pbmF0ZVwiLFxuZGVzY3JpcHRpb246XCJUaW1lb3V0IG9yIHRpbWVyXCIsXG5zdGFuZGFyZDpcImJzZFwifSxcblxue1xubmFtZTpcIlNJR1dJTkNIXCIsXG5udW1iZXI6MjgsXG5hY3Rpb246XCJpZ25vcmVcIixcbmRlc2NyaXB0aW9uOlwiVGVybWluYWwgd2luZG93IHNpemUgY2hhbmdlZFwiLFxuc3RhbmRhcmQ6XCJic2RcIn0sXG5cbntcbm5hbWU6XCJTSUdJT1wiLFxubnVtYmVyOjI5LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIkkvTyBpcyBhdmFpbGFibGVcIixcbnN0YW5kYXJkOlwib3RoZXJcIn0sXG5cbntcbm5hbWU6XCJTSUdQT0xMXCIsXG5udW1iZXI6MjksXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiV2F0Y2hlZCBldmVudFwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR0lORk9cIixcbm51bWJlcjoyOSxcbmFjdGlvbjpcImlnbm9yZVwiLFxuZGVzY3JpcHRpb246XCJSZXF1ZXN0IGZvciBwcm9jZXNzIGluZm9ybWF0aW9uXCIsXG5zdGFuZGFyZDpcIm90aGVyXCJ9LFxuXG57XG5uYW1lOlwiU0lHUFdSXCIsXG5udW1iZXI6MzAsXG5hY3Rpb246XCJ0ZXJtaW5hdGVcIixcbmRlc2NyaXB0aW9uOlwiRGV2aWNlIHJ1bm5pbmcgb3V0IG9mIHBvd2VyXCIsXG5zdGFuZGFyZDpcInN5c3RlbXZcIn0sXG5cbntcbm5hbWU6XCJTSUdTWVNcIixcbm51bWJlcjozMSxcbmFjdGlvbjpcImNvcmVcIixcbmRlc2NyaXB0aW9uOlwiSW52YWxpZCBzeXN0ZW0gY2FsbFwiLFxuc3RhbmRhcmQ6XCJvdGhlclwifSxcblxue1xubmFtZTpcIlNJR1VOVVNFRFwiLFxubnVtYmVyOjMxLFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIkludmFsaWQgc3lzdGVtIGNhbGxcIixcbnN0YW5kYXJkOlwib3RoZXJcIn1dO2V4cG9ydHMuU0lHTkFMUz1TSUdOQUxTO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29yZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuU0lHUlRNQVg9ZXhwb3J0cy5nZXRSZWFsdGltZVNpZ25hbHM9dm9pZCAwO1xuY29uc3QgZ2V0UmVhbHRpbWVTaWduYWxzPWZ1bmN0aW9uKCl7XG5jb25zdCBsZW5ndGg9U0lHUlRNQVgtU0lHUlRNSU4rMTtcbnJldHVybiBBcnJheS5mcm9tKHtsZW5ndGh9LGdldFJlYWx0aW1lU2lnbmFsKTtcbn07ZXhwb3J0cy5nZXRSZWFsdGltZVNpZ25hbHM9Z2V0UmVhbHRpbWVTaWduYWxzO1xuXG5jb25zdCBnZXRSZWFsdGltZVNpZ25hbD1mdW5jdGlvbih2YWx1ZSxpbmRleCl7XG5yZXR1cm57XG5uYW1lOmBTSUdSVCR7aW5kZXgrMX1gLFxubnVtYmVyOlNJR1JUTUlOK2luZGV4LFxuYWN0aW9uOlwidGVybWluYXRlXCIsXG5kZXNjcmlwdGlvbjpcIkFwcGxpY2F0aW9uLXNwZWNpZmljIHNpZ25hbCAocmVhbHRpbWUpXCIsXG5zdGFuZGFyZDpcInBvc2l4XCJ9O1xuXG59O1xuXG5jb25zdCBTSUdSVE1JTj0zNDtcbmNvbnN0IFNJR1JUTUFYPTY0O2V4cG9ydHMuU0lHUlRNQVg9U0lHUlRNQVg7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWFsdGltZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuZ2V0U2lnbmFscz12b2lkIDA7dmFyIF9vcz1yZXF1aXJlKFwib3NcIik7XG5cbnZhciBfY29yZT1yZXF1aXJlKFwiLi9jb3JlLmpzXCIpO1xudmFyIF9yZWFsdGltZT1yZXF1aXJlKFwiLi9yZWFsdGltZS5qc1wiKTtcblxuXG5cbmNvbnN0IGdldFNpZ25hbHM9ZnVuY3Rpb24oKXtcbmNvbnN0IHJlYWx0aW1lU2lnbmFscz0oMCxfcmVhbHRpbWUuZ2V0UmVhbHRpbWVTaWduYWxzKSgpO1xuY29uc3Qgc2lnbmFscz1bLi4uX2NvcmUuU0lHTkFMUywuLi5yZWFsdGltZVNpZ25hbHNdLm1hcChub3JtYWxpemVTaWduYWwpO1xucmV0dXJuIHNpZ25hbHM7XG59O2V4cG9ydHMuZ2V0U2lnbmFscz1nZXRTaWduYWxzO1xuXG5cblxuXG5cblxuXG5jb25zdCBub3JtYWxpemVTaWduYWw9ZnVuY3Rpb24oe1xubmFtZSxcbm51bWJlcjpkZWZhdWx0TnVtYmVyLFxuZGVzY3JpcHRpb24sXG5hY3Rpb24sXG5mb3JjZWQ9ZmFsc2UsXG5zdGFuZGFyZH0pXG57XG5jb25zdHtcbnNpZ25hbHM6e1tuYW1lXTpjb25zdGFudFNpZ25hbH19PVxuX29zLmNvbnN0YW50cztcbmNvbnN0IHN1cHBvcnRlZD1jb25zdGFudFNpZ25hbCE9PXVuZGVmaW5lZDtcbmNvbnN0IG51bWJlcj1zdXBwb3J0ZWQ/Y29uc3RhbnRTaWduYWw6ZGVmYXVsdE51bWJlcjtcbnJldHVybntuYW1lLG51bWJlcixkZXNjcmlwdGlvbixzdXBwb3J0ZWQsYWN0aW9uLGZvcmNlZCxzdGFuZGFyZH07XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2lnbmFscy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuc2lnbmFsc0J5TnVtYmVyPWV4cG9ydHMuc2lnbmFsc0J5TmFtZT12b2lkIDA7dmFyIF9vcz1yZXF1aXJlKFwib3NcIik7XG5cbnZhciBfc2lnbmFscz1yZXF1aXJlKFwiLi9zaWduYWxzLmpzXCIpO1xudmFyIF9yZWFsdGltZT1yZXF1aXJlKFwiLi9yZWFsdGltZS5qc1wiKTtcblxuXG5cbmNvbnN0IGdldFNpZ25hbHNCeU5hbWU9ZnVuY3Rpb24oKXtcbmNvbnN0IHNpZ25hbHM9KDAsX3NpZ25hbHMuZ2V0U2lnbmFscykoKTtcbnJldHVybiBzaWduYWxzLnJlZHVjZShnZXRTaWduYWxCeU5hbWUse30pO1xufTtcblxuY29uc3QgZ2V0U2lnbmFsQnlOYW1lPWZ1bmN0aW9uKFxuc2lnbmFsQnlOYW1lTWVtbyxcbntuYW1lLG51bWJlcixkZXNjcmlwdGlvbixzdXBwb3J0ZWQsYWN0aW9uLGZvcmNlZCxzdGFuZGFyZH0pXG57XG5yZXR1cm57XG4uLi5zaWduYWxCeU5hbWVNZW1vLFxuW25hbWVdOntuYW1lLG51bWJlcixkZXNjcmlwdGlvbixzdXBwb3J0ZWQsYWN0aW9uLGZvcmNlZCxzdGFuZGFyZH19O1xuXG59O1xuXG5jb25zdCBzaWduYWxzQnlOYW1lPWdldFNpZ25hbHNCeU5hbWUoKTtleHBvcnRzLnNpZ25hbHNCeU5hbWU9c2lnbmFsc0J5TmFtZTtcblxuXG5cblxuY29uc3QgZ2V0U2lnbmFsc0J5TnVtYmVyPWZ1bmN0aW9uKCl7XG5jb25zdCBzaWduYWxzPSgwLF9zaWduYWxzLmdldFNpZ25hbHMpKCk7XG5jb25zdCBsZW5ndGg9X3JlYWx0aW1lLlNJR1JUTUFYKzE7XG5jb25zdCBzaWduYWxzQT1BcnJheS5mcm9tKHtsZW5ndGh9LCh2YWx1ZSxudW1iZXIpPT5cbmdldFNpZ25hbEJ5TnVtYmVyKG51bWJlcixzaWduYWxzKSk7XG5cbnJldHVybiBPYmplY3QuYXNzaWduKHt9LC4uLnNpZ25hbHNBKTtcbn07XG5cbmNvbnN0IGdldFNpZ25hbEJ5TnVtYmVyPWZ1bmN0aW9uKG51bWJlcixzaWduYWxzKXtcbmNvbnN0IHNpZ25hbD1maW5kU2lnbmFsQnlOdW1iZXIobnVtYmVyLHNpZ25hbHMpO1xuXG5pZihzaWduYWw9PT11bmRlZmluZWQpe1xucmV0dXJue307XG59XG5cbmNvbnN0e25hbWUsZGVzY3JpcHRpb24sc3VwcG9ydGVkLGFjdGlvbixmb3JjZWQsc3RhbmRhcmR9PXNpZ25hbDtcbnJldHVybntcbltudW1iZXJdOntcbm5hbWUsXG5udW1iZXIsXG5kZXNjcmlwdGlvbixcbnN1cHBvcnRlZCxcbmFjdGlvbixcbmZvcmNlZCxcbnN0YW5kYXJkfX07XG5cblxufTtcblxuXG5cbmNvbnN0IGZpbmRTaWduYWxCeU51bWJlcj1mdW5jdGlvbihudW1iZXIsc2lnbmFscyl7XG5jb25zdCBzaWduYWw9c2lnbmFscy5maW5kKCh7bmFtZX0pPT5fb3MuY29uc3RhbnRzLnNpZ25hbHNbbmFtZV09PT1udW1iZXIpO1xuXG5pZihzaWduYWwhPT11bmRlZmluZWQpe1xucmV0dXJuIHNpZ25hbDtcbn1cblxucmV0dXJuIHNpZ25hbHMuZmluZChzaWduYWxBPT5zaWduYWxBLm51bWJlcj09PW51bWJlcik7XG59O1xuXG5jb25zdCBzaWduYWxzQnlOdW1iZXI9Z2V0U2lnbmFsc0J5TnVtYmVyKCk7ZXhwb3J0cy5zaWduYWxzQnlOdW1iZXI9c2lnbmFsc0J5TnVtYmVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi5qcy5tYXAiLCIndXNlIHN0cmljdCc7XG5jb25zdCB7c2lnbmFsc0J5TmFtZX0gPSByZXF1aXJlKCdodW1hbi1zaWduYWxzJyk7XG5cbmNvbnN0IGdldEVycm9yUHJlZml4ID0gKHt0aW1lZE91dCwgdGltZW91dCwgZXJyb3JDb2RlLCBzaWduYWwsIHNpZ25hbERlc2NyaXB0aW9uLCBleGl0Q29kZSwgaXNDYW5jZWxlZH0pID0+IHtcblx0aWYgKHRpbWVkT3V0KSB7XG5cdFx0cmV0dXJuIGB0aW1lZCBvdXQgYWZ0ZXIgJHt0aW1lb3V0fSBtaWxsaXNlY29uZHNgO1xuXHR9XG5cblx0aWYgKGlzQ2FuY2VsZWQpIHtcblx0XHRyZXR1cm4gJ3dhcyBjYW5jZWxlZCc7XG5cdH1cblxuXHRpZiAoZXJyb3JDb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gYGZhaWxlZCB3aXRoICR7ZXJyb3JDb2RlfWA7XG5cdH1cblxuXHRpZiAoc2lnbmFsICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gYHdhcyBraWxsZWQgd2l0aCAke3NpZ25hbH0gKCR7c2lnbmFsRGVzY3JpcHRpb259KWA7XG5cdH1cblxuXHRpZiAoZXhpdENvZGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBgZmFpbGVkIHdpdGggZXhpdCBjb2RlICR7ZXhpdENvZGV9YDtcblx0fVxuXG5cdHJldHVybiAnZmFpbGVkJztcbn07XG5cbmNvbnN0IG1ha2VFcnJvciA9ICh7XG5cdHN0ZG91dCxcblx0c3RkZXJyLFxuXHRhbGwsXG5cdGVycm9yLFxuXHRzaWduYWwsXG5cdGV4aXRDb2RlLFxuXHRjb21tYW5kLFxuXHRlc2NhcGVkQ29tbWFuZCxcblx0dGltZWRPdXQsXG5cdGlzQ2FuY2VsZWQsXG5cdGtpbGxlZCxcblx0cGFyc2VkOiB7b3B0aW9uczoge3RpbWVvdXR9fVxufSkgPT4ge1xuXHQvLyBgc2lnbmFsYCBhbmQgYGV4aXRDb2RlYCBlbWl0dGVkIG9uIGBzcGF3bmVkLm9uKCdleGl0JylgIGV2ZW50IGNhbiBiZSBgbnVsbGAuXG5cdC8vIFdlIG5vcm1hbGl6ZSB0aGVtIHRvIGB1bmRlZmluZWRgXG5cdGV4aXRDb2RlID0gZXhpdENvZGUgPT09IG51bGwgPyB1bmRlZmluZWQgOiBleGl0Q29kZTtcblx0c2lnbmFsID0gc2lnbmFsID09PSBudWxsID8gdW5kZWZpbmVkIDogc2lnbmFsO1xuXHRjb25zdCBzaWduYWxEZXNjcmlwdGlvbiA9IHNpZ25hbCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2lnbmFsc0J5TmFtZVtzaWduYWxdLmRlc2NyaXB0aW9uO1xuXG5cdGNvbnN0IGVycm9yQ29kZSA9IGVycm9yICYmIGVycm9yLmNvZGU7XG5cblx0Y29uc3QgcHJlZml4ID0gZ2V0RXJyb3JQcmVmaXgoe3RpbWVkT3V0LCB0aW1lb3V0LCBlcnJvckNvZGUsIHNpZ25hbCwgc2lnbmFsRGVzY3JpcHRpb24sIGV4aXRDb2RlLCBpc0NhbmNlbGVkfSk7XG5cdGNvbnN0IGV4ZWNhTWVzc2FnZSA9IGBDb21tYW5kICR7cHJlZml4fTogJHtjb21tYW5kfWA7XG5cdGNvbnN0IGlzRXJyb3IgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXJyb3IpID09PSAnW29iamVjdCBFcnJvcl0nO1xuXHRjb25zdCBzaG9ydE1lc3NhZ2UgPSBpc0Vycm9yID8gYCR7ZXhlY2FNZXNzYWdlfVxcbiR7ZXJyb3IubWVzc2FnZX1gIDogZXhlY2FNZXNzYWdlO1xuXHRjb25zdCBtZXNzYWdlID0gW3Nob3J0TWVzc2FnZSwgc3RkZXJyLCBzdGRvdXRdLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblxuXHRpZiAoaXNFcnJvcikge1xuXHRcdGVycm9yLm9yaWdpbmFsTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG5cdFx0ZXJyb3IubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH0gZWxzZSB7XG5cdFx0ZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG5cdH1cblxuXHRlcnJvci5zaG9ydE1lc3NhZ2UgPSBzaG9ydE1lc3NhZ2U7XG5cdGVycm9yLmNvbW1hbmQgPSBjb21tYW5kO1xuXHRlcnJvci5lc2NhcGVkQ29tbWFuZCA9IGVzY2FwZWRDb21tYW5kO1xuXHRlcnJvci5leGl0Q29kZSA9IGV4aXRDb2RlO1xuXHRlcnJvci5zaWduYWwgPSBzaWduYWw7XG5cdGVycm9yLnNpZ25hbERlc2NyaXB0aW9uID0gc2lnbmFsRGVzY3JpcHRpb247XG5cdGVycm9yLnN0ZG91dCA9IHN0ZG91dDtcblx0ZXJyb3Iuc3RkZXJyID0gc3RkZXJyO1xuXG5cdGlmIChhbGwgIT09IHVuZGVmaW5lZCkge1xuXHRcdGVycm9yLmFsbCA9IGFsbDtcblx0fVxuXG5cdGlmICgnYnVmZmVyZWREYXRhJyBpbiBlcnJvcikge1xuXHRcdGRlbGV0ZSBlcnJvci5idWZmZXJlZERhdGE7XG5cdH1cblxuXHRlcnJvci5mYWlsZWQgPSB0cnVlO1xuXHRlcnJvci50aW1lZE91dCA9IEJvb2xlYW4odGltZWRPdXQpO1xuXHRlcnJvci5pc0NhbmNlbGVkID0gaXNDYW5jZWxlZDtcblx0ZXJyb3Iua2lsbGVkID0ga2lsbGVkICYmICF0aW1lZE91dDtcblxuXHRyZXR1cm4gZXJyb3I7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGFsaWFzZXMgPSBbJ3N0ZGluJywgJ3N0ZG91dCcsICdzdGRlcnInXTtcblxuY29uc3QgaGFzQWxpYXMgPSBvcHRpb25zID0+IGFsaWFzZXMuc29tZShhbGlhcyA9PiBvcHRpb25zW2FsaWFzXSAhPT0gdW5kZWZpbmVkKTtcblxuY29uc3Qgbm9ybWFsaXplU3RkaW8gPSBvcHRpb25zID0+IHtcblx0aWYgKCFvcHRpb25zKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3Qge3N0ZGlvfSA9IG9wdGlvbnM7XG5cblx0aWYgKHN0ZGlvID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gYWxpYXNlcy5tYXAoYWxpYXMgPT4gb3B0aW9uc1thbGlhc10pO1xuXHR9XG5cblx0aWYgKGhhc0FsaWFzKG9wdGlvbnMpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBJdCdzIG5vdCBwb3NzaWJsZSB0byBwcm92aWRlIFxcYHN0ZGlvXFxgIGluIGNvbWJpbmF0aW9uIHdpdGggb25lIG9mICR7YWxpYXNlcy5tYXAoYWxpYXMgPT4gYFxcYCR7YWxpYXN9XFxgYCkuam9pbignLCAnKX1gKTtcblx0fVxuXG5cdGlmICh0eXBlb2Ygc3RkaW8gPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHN0ZGlvO1xuXHR9XG5cblx0aWYgKCFBcnJheS5pc0FycmF5KHN0ZGlvKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIFxcYHN0ZGlvXFxgIHRvIGJlIG9mIHR5cGUgXFxgc3RyaW5nXFxgIG9yIFxcYEFycmF5XFxgLCBnb3QgXFxgJHt0eXBlb2Ygc3RkaW99XFxgYCk7XG5cdH1cblxuXHRjb25zdCBsZW5ndGggPSBNYXRoLm1heChzdGRpby5sZW5ndGgsIGFsaWFzZXMubGVuZ3RoKTtcblx0cmV0dXJuIEFycmF5LmZyb20oe2xlbmd0aH0sICh2YWx1ZSwgaW5kZXgpID0+IHN0ZGlvW2luZGV4XSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vcm1hbGl6ZVN0ZGlvO1xuXG4vLyBgaXBjYCBpcyBwdXNoZWQgdW5sZXNzIGl0IGlzIGFscmVhZHkgcHJlc2VudFxubW9kdWxlLmV4cG9ydHMubm9kZSA9IG9wdGlvbnMgPT4ge1xuXHRjb25zdCBzdGRpbyA9IG5vcm1hbGl6ZVN0ZGlvKG9wdGlvbnMpO1xuXG5cdGlmIChzdGRpbyA9PT0gJ2lwYycpIHtcblx0XHRyZXR1cm4gJ2lwYyc7XG5cdH1cblxuXHRpZiAoc3RkaW8gPT09IHVuZGVmaW5lZCB8fCB0eXBlb2Ygc3RkaW8gPT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIFtzdGRpbywgc3RkaW8sIHN0ZGlvLCAnaXBjJ107XG5cdH1cblxuXHRpZiAoc3RkaW8uaW5jbHVkZXMoJ2lwYycpKSB7XG5cdFx0cmV0dXJuIHN0ZGlvO1xuXHR9XG5cblx0cmV0dXJuIFsuLi5zdGRpbywgJ2lwYyddO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmNvbnN0IG9uRXhpdCA9IHJlcXVpcmUoJ3NpZ25hbC1leGl0Jyk7XG5cbmNvbnN0IERFRkFVTFRfRk9SQ0VfS0lMTF9USU1FT1VUID0gMTAwMCAqIDU7XG5cbi8vIE1vbmtleS1wYXRjaGVzIGBjaGlsZFByb2Nlc3Mua2lsbCgpYCB0byBhZGQgYGZvcmNlS2lsbEFmdGVyVGltZW91dGAgYmVoYXZpb3JcbmNvbnN0IHNwYXduZWRLaWxsID0gKGtpbGwsIHNpZ25hbCA9ICdTSUdURVJNJywgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGNvbnN0IGtpbGxSZXN1bHQgPSBraWxsKHNpZ25hbCk7XG5cdHNldEtpbGxUaW1lb3V0KGtpbGwsIHNpZ25hbCwgb3B0aW9ucywga2lsbFJlc3VsdCk7XG5cdHJldHVybiBraWxsUmVzdWx0O1xufTtcblxuY29uc3Qgc2V0S2lsbFRpbWVvdXQgPSAoa2lsbCwgc2lnbmFsLCBvcHRpb25zLCBraWxsUmVzdWx0KSA9PiB7XG5cdGlmICghc2hvdWxkRm9yY2VLaWxsKHNpZ25hbCwgb3B0aW9ucywga2lsbFJlc3VsdCkpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCB0aW1lb3V0ID0gZ2V0Rm9yY2VLaWxsQWZ0ZXJUaW1lb3V0KG9wdGlvbnMpO1xuXHRjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0a2lsbCgnU0lHS0lMTCcpO1xuXHR9LCB0aW1lb3V0KTtcblxuXHQvLyBHdWFyZGVkIGJlY2F1c2UgdGhlcmUncyBubyBgLnVucmVmKClgIHdoZW4gYGV4ZWNhYCBpcyB1c2VkIGluIHRoZSByZW5kZXJlclxuXHQvLyBwcm9jZXNzIGluIEVsZWN0cm9uLiBUaGlzIGNhbm5vdCBiZSB0ZXN0ZWQgc2luY2Ugd2UgZG9uJ3QgcnVuIHRlc3RzIGluXG5cdC8vIEVsZWN0cm9uLlxuXHQvLyBpc3RhbmJ1bCBpZ25vcmUgZWxzZVxuXHRpZiAodC51bnJlZikge1xuXHRcdHQudW5yZWYoKTtcblx0fVxufTtcblxuY29uc3Qgc2hvdWxkRm9yY2VLaWxsID0gKHNpZ25hbCwge2ZvcmNlS2lsbEFmdGVyVGltZW91dH0sIGtpbGxSZXN1bHQpID0+IHtcblx0cmV0dXJuIGlzU2lndGVybShzaWduYWwpICYmIGZvcmNlS2lsbEFmdGVyVGltZW91dCAhPT0gZmFsc2UgJiYga2lsbFJlc3VsdDtcbn07XG5cbmNvbnN0IGlzU2lndGVybSA9IHNpZ25hbCA9PiB7XG5cdHJldHVybiBzaWduYWwgPT09IG9zLmNvbnN0YW50cy5zaWduYWxzLlNJR1RFUk0gfHxcblx0XHQodHlwZW9mIHNpZ25hbCA9PT0gJ3N0cmluZycgJiYgc2lnbmFsLnRvVXBwZXJDYXNlKCkgPT09ICdTSUdURVJNJyk7XG59O1xuXG5jb25zdCBnZXRGb3JjZUtpbGxBZnRlclRpbWVvdXQgPSAoe2ZvcmNlS2lsbEFmdGVyVGltZW91dCA9IHRydWV9KSA9PiB7XG5cdGlmIChmb3JjZUtpbGxBZnRlclRpbWVvdXQgPT09IHRydWUpIHtcblx0XHRyZXR1cm4gREVGQVVMVF9GT1JDRV9LSUxMX1RJTUVPVVQ7XG5cdH1cblxuXHRpZiAoIU51bWJlci5pc0Zpbml0ZShmb3JjZUtpbGxBZnRlclRpbWVvdXQpIHx8IGZvcmNlS2lsbEFmdGVyVGltZW91dCA8IDApIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCB0aGUgXFxgZm9yY2VLaWxsQWZ0ZXJUaW1lb3V0XFxgIG9wdGlvbiB0byBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLCBnb3QgXFxgJHtmb3JjZUtpbGxBZnRlclRpbWVvdXR9XFxgICgke3R5cGVvZiBmb3JjZUtpbGxBZnRlclRpbWVvdXR9KWApO1xuXHR9XG5cblx0cmV0dXJuIGZvcmNlS2lsbEFmdGVyVGltZW91dDtcbn07XG5cbi8vIGBjaGlsZFByb2Nlc3MuY2FuY2VsKClgXG5jb25zdCBzcGF3bmVkQ2FuY2VsID0gKHNwYXduZWQsIGNvbnRleHQpID0+IHtcblx0Y29uc3Qga2lsbFJlc3VsdCA9IHNwYXduZWQua2lsbCgpO1xuXG5cdGlmIChraWxsUmVzdWx0KSB7XG5cdFx0Y29udGV4dC5pc0NhbmNlbGVkID0gdHJ1ZTtcblx0fVxufTtcblxuY29uc3QgdGltZW91dEtpbGwgPSAoc3Bhd25lZCwgc2lnbmFsLCByZWplY3QpID0+IHtcblx0c3Bhd25lZC5raWxsKHNpZ25hbCk7XG5cdHJlamVjdChPYmplY3QuYXNzaWduKG5ldyBFcnJvcignVGltZWQgb3V0JyksIHt0aW1lZE91dDogdHJ1ZSwgc2lnbmFsfSkpO1xufTtcblxuLy8gYHRpbWVvdXRgIG9wdGlvbiBoYW5kbGluZ1xuY29uc3Qgc2V0dXBUaW1lb3V0ID0gKHNwYXduZWQsIHt0aW1lb3V0LCBraWxsU2lnbmFsID0gJ1NJR1RFUk0nfSwgc3Bhd25lZFByb21pc2UpID0+IHtcblx0aWYgKHRpbWVvdXQgPT09IDAgfHwgdGltZW91dCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIHNwYXduZWRQcm9taXNlO1xuXHR9XG5cblx0bGV0IHRpbWVvdXRJZDtcblx0Y29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0dGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHR0aW1lb3V0S2lsbChzcGF3bmVkLCBraWxsU2lnbmFsLCByZWplY3QpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHR9KTtcblxuXHRjb25zdCBzYWZlU3Bhd25lZFByb21pc2UgPSBzcGF3bmVkUHJvbWlzZS5maW5hbGx5KCgpID0+IHtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dElkKTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2UucmFjZShbdGltZW91dFByb21pc2UsIHNhZmVTcGF3bmVkUHJvbWlzZV0pO1xufTtcblxuY29uc3QgdmFsaWRhdGVUaW1lb3V0ID0gKHt0aW1lb3V0fSkgPT4ge1xuXHRpZiAodGltZW91dCAhPT0gdW5kZWZpbmVkICYmICghTnVtYmVyLmlzRmluaXRlKHRpbWVvdXQpIHx8IHRpbWVvdXQgPCAwKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIHRoZSBcXGB0aW1lb3V0XFxgIG9wdGlvbiB0byBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLCBnb3QgXFxgJHt0aW1lb3V0fVxcYCAoJHt0eXBlb2YgdGltZW91dH0pYCk7XG5cdH1cbn07XG5cbi8vIGBjbGVhbnVwYCBvcHRpb24gaGFuZGxpbmdcbmNvbnN0IHNldEV4aXRIYW5kbGVyID0gYXN5bmMgKHNwYXduZWQsIHtjbGVhbnVwLCBkZXRhY2hlZH0sIHRpbWVkUHJvbWlzZSkgPT4ge1xuXHRpZiAoIWNsZWFudXAgfHwgZGV0YWNoZWQpIHtcblx0XHRyZXR1cm4gdGltZWRQcm9taXNlO1xuXHR9XG5cblx0Y29uc3QgcmVtb3ZlRXhpdEhhbmRsZXIgPSBvbkV4aXQoKCkgPT4ge1xuXHRcdHNwYXduZWQua2lsbCgpO1xuXHR9KTtcblxuXHRyZXR1cm4gdGltZWRQcm9taXNlLmZpbmFsbHkoKCkgPT4ge1xuXHRcdHJlbW92ZUV4aXRIYW5kbGVyKCk7XG5cdH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNwYXduZWRLaWxsLFxuXHRzcGF3bmVkQ2FuY2VsLFxuXHRzZXR1cFRpbWVvdXQsXG5cdHZhbGlkYXRlVGltZW91dCxcblx0c2V0RXhpdEhhbmRsZXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzU3RyZWFtID0gc3RyZWFtID0+XG5cdHN0cmVhbSAhPT0gbnVsbCAmJlxuXHR0eXBlb2Ygc3RyZWFtID09PSAnb2JqZWN0JyAmJlxuXHR0eXBlb2Ygc3RyZWFtLnBpcGUgPT09ICdmdW5jdGlvbic7XG5cbmlzU3RyZWFtLndyaXRhYmxlID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtKHN0cmVhbSkgJiZcblx0c3RyZWFtLndyaXRhYmxlICE9PSBmYWxzZSAmJlxuXHR0eXBlb2Ygc3RyZWFtLl93cml0ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHR0eXBlb2Ygc3RyZWFtLl93cml0YWJsZVN0YXRlID09PSAnb2JqZWN0JztcblxuaXNTdHJlYW0ucmVhZGFibGUgPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0oc3RyZWFtKSAmJlxuXHRzdHJlYW0ucmVhZGFibGUgIT09IGZhbHNlICYmXG5cdHR5cGVvZiBzdHJlYW0uX3JlYWQgPT09ICdmdW5jdGlvbicgJiZcblx0dHlwZW9mIHN0cmVhbS5fcmVhZGFibGVTdGF0ZSA9PT0gJ29iamVjdCc7XG5cbmlzU3RyZWFtLmR1cGxleCA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbS53cml0YWJsZShzdHJlYW0pICYmXG5cdGlzU3RyZWFtLnJlYWRhYmxlKHN0cmVhbSk7XG5cbmlzU3RyZWFtLnRyYW5zZm9ybSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbS5kdXBsZXgoc3RyZWFtKSAmJlxuXHR0eXBlb2Ygc3RyZWFtLl90cmFuc2Zvcm0gPT09ICdmdW5jdGlvbic7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJlYW07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBpc1N0cmVhbSA9IHJlcXVpcmUoJ2lzLXN0cmVhbScpO1xuY29uc3QgZ2V0U3RyZWFtID0gcmVxdWlyZSgnZ2V0LXN0cmVhbScpO1xuY29uc3QgbWVyZ2VTdHJlYW0gPSByZXF1aXJlKCdtZXJnZS1zdHJlYW0nKTtcblxuLy8gYGlucHV0YCBvcHRpb25cbmNvbnN0IGhhbmRsZUlucHV0ID0gKHNwYXduZWQsIGlucHV0KSA9PiB7XG5cdC8vIENoZWNraW5nIGZvciBzdGRpbiBpcyB3b3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzI2ODUyXG5cdC8vIEB0b2RvIHJlbW92ZSBgfHwgc3Bhd25lZC5zdGRpbiA9PT0gdW5kZWZpbmVkYCBvbmNlIHdlIGRyb3Agc3VwcG9ydCBmb3IgTm9kZS5qcyA8PTEyLjIuMFxuXHRpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCB8fCBzcGF3bmVkLnN0ZGluID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAoaXNTdHJlYW0oaW5wdXQpKSB7XG5cdFx0aW5wdXQucGlwZShzcGF3bmVkLnN0ZGluKTtcblx0fSBlbHNlIHtcblx0XHRzcGF3bmVkLnN0ZGluLmVuZChpbnB1dCk7XG5cdH1cbn07XG5cbi8vIGBhbGxgIGludGVybGVhdmVzIGBzdGRvdXRgIGFuZCBgc3RkZXJyYFxuY29uc3QgbWFrZUFsbFN0cmVhbSA9IChzcGF3bmVkLCB7YWxsfSkgPT4ge1xuXHRpZiAoIWFsbCB8fCAoIXNwYXduZWQuc3Rkb3V0ICYmICFzcGF3bmVkLnN0ZGVycikpIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBtaXhlZCA9IG1lcmdlU3RyZWFtKCk7XG5cblx0aWYgKHNwYXduZWQuc3Rkb3V0KSB7XG5cdFx0bWl4ZWQuYWRkKHNwYXduZWQuc3Rkb3V0KTtcblx0fVxuXG5cdGlmIChzcGF3bmVkLnN0ZGVycikge1xuXHRcdG1peGVkLmFkZChzcGF3bmVkLnN0ZGVycik7XG5cdH1cblxuXHRyZXR1cm4gbWl4ZWQ7XG59O1xuXG4vLyBPbiBmYWlsdXJlLCBgcmVzdWx0LnN0ZG91dHxzdGRlcnJ8YWxsYCBzaG91bGQgY29udGFpbiB0aGUgY3VycmVudGx5IGJ1ZmZlcmVkIHN0cmVhbVxuY29uc3QgZ2V0QnVmZmVyZWREYXRhID0gYXN5bmMgKHN0cmVhbSwgc3RyZWFtUHJvbWlzZSkgPT4ge1xuXHRpZiAoIXN0cmVhbSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHN0cmVhbS5kZXN0cm95KCk7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gYXdhaXQgc3RyZWFtUHJvbWlzZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gZXJyb3IuYnVmZmVyZWREYXRhO1xuXHR9XG59O1xuXG5jb25zdCBnZXRTdHJlYW1Qcm9taXNlID0gKHN0cmVhbSwge2VuY29kaW5nLCBidWZmZXIsIG1heEJ1ZmZlcn0pID0+IHtcblx0aWYgKCFzdHJlYW0gfHwgIWJ1ZmZlcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChlbmNvZGluZykge1xuXHRcdHJldHVybiBnZXRTdHJlYW0oc3RyZWFtLCB7ZW5jb2RpbmcsIG1heEJ1ZmZlcn0pO1xuXHR9XG5cblx0cmV0dXJuIGdldFN0cmVhbS5idWZmZXIoc3RyZWFtLCB7bWF4QnVmZmVyfSk7XG59O1xuXG4vLyBSZXRyaWV2ZSByZXN1bHQgb2YgY2hpbGQgcHJvY2VzczogZXhpdCBjb2RlLCBzaWduYWwsIGVycm9yLCBzdHJlYW1zIChzdGRvdXQvc3RkZXJyL2FsbClcbmNvbnN0IGdldFNwYXduZWRSZXN1bHQgPSBhc3luYyAoe3N0ZG91dCwgc3RkZXJyLCBhbGx9LCB7ZW5jb2RpbmcsIGJ1ZmZlciwgbWF4QnVmZmVyfSwgcHJvY2Vzc0RvbmUpID0+IHtcblx0Y29uc3Qgc3Rkb3V0UHJvbWlzZSA9IGdldFN0cmVhbVByb21pc2Uoc3Rkb3V0LCB7ZW5jb2RpbmcsIGJ1ZmZlciwgbWF4QnVmZmVyfSk7XG5cdGNvbnN0IHN0ZGVyclByb21pc2UgPSBnZXRTdHJlYW1Qcm9taXNlKHN0ZGVyciwge2VuY29kaW5nLCBidWZmZXIsIG1heEJ1ZmZlcn0pO1xuXHRjb25zdCBhbGxQcm9taXNlID0gZ2V0U3RyZWFtUHJvbWlzZShhbGwsIHtlbmNvZGluZywgYnVmZmVyLCBtYXhCdWZmZXI6IG1heEJ1ZmZlciAqIDJ9KTtcblxuXHR0cnkge1xuXHRcdHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChbcHJvY2Vzc0RvbmUsIHN0ZG91dFByb21pc2UsIHN0ZGVyclByb21pc2UsIGFsbFByb21pc2VdKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW1xuXHRcdFx0e2Vycm9yLCBzaWduYWw6IGVycm9yLnNpZ25hbCwgdGltZWRPdXQ6IGVycm9yLnRpbWVkT3V0fSxcblx0XHRcdGdldEJ1ZmZlcmVkRGF0YShzdGRvdXQsIHN0ZG91dFByb21pc2UpLFxuXHRcdFx0Z2V0QnVmZmVyZWREYXRhKHN0ZGVyciwgc3RkZXJyUHJvbWlzZSksXG5cdFx0XHRnZXRCdWZmZXJlZERhdGEoYWxsLCBhbGxQcm9taXNlKVxuXHRcdF0pO1xuXHR9XG59O1xuXG5jb25zdCB2YWxpZGF0ZUlucHV0U3luYyA9ICh7aW5wdXR9KSA9PiB7XG5cdGlmIChpc1N0cmVhbShpbnB1dCkpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgYGlucHV0YCBvcHRpb24gY2Fubm90IGJlIGEgc3RyZWFtIGluIHN5bmMgbW9kZScpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aGFuZGxlSW5wdXQsXG5cdG1ha2VBbGxTdHJlYW0sXG5cdGdldFNwYXduZWRSZXN1bHQsXG5cdHZhbGlkYXRlSW5wdXRTeW5jXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5hdGl2ZVByb21pc2VQcm90b3R5cGUgPSAoYXN5bmMgKCkgPT4ge30pKCkuY29uc3RydWN0b3IucHJvdG90eXBlO1xuY29uc3QgZGVzY3JpcHRvcnMgPSBbJ3RoZW4nLCAnY2F0Y2gnLCAnZmluYWxseSddLm1hcChwcm9wZXJ0eSA9PiBbXG5cdHByb3BlcnR5LFxuXHRSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuYXRpdmVQcm9taXNlUHJvdG90eXBlLCBwcm9wZXJ0eSlcbl0pO1xuXG4vLyBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgbWl4aW4gb2YgYGNoaWxkUHJvY2Vzc2AgYW5kIGBQcm9taXNlYFxuY29uc3QgbWVyZ2VQcm9taXNlID0gKHNwYXduZWQsIHByb21pc2UpID0+IHtcblx0Zm9yIChjb25zdCBbcHJvcGVydHksIGRlc2NyaXB0b3JdIG9mIGRlc2NyaXB0b3JzKSB7XG5cdFx0Ly8gU3RhcnRpbmcgdGhlIG1haW4gYHByb21pc2VgIGlzIGRlZmVycmVkIHRvIGF2b2lkIGNvbnN1bWluZyBzdHJlYW1zXG5cdFx0Y29uc3QgdmFsdWUgPSB0eXBlb2YgcHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJyA/XG5cdFx0XHQoLi4uYXJncykgPT4gUmVmbGVjdC5hcHBseShkZXNjcmlwdG9yLnZhbHVlLCBwcm9taXNlKCksIGFyZ3MpIDpcblx0XHRcdGRlc2NyaXB0b3IudmFsdWUuYmluZChwcm9taXNlKTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoc3Bhd25lZCwgcHJvcGVydHksIHsuLi5kZXNjcmlwdG9yLCB2YWx1ZX0pO1xuXHR9XG5cblx0cmV0dXJuIHNwYXduZWQ7XG59O1xuXG4vLyBVc2UgcHJvbWlzZXMgaW5zdGVhZCBvZiBgY2hpbGRfcHJvY2Vzc2AgZXZlbnRzXG5jb25zdCBnZXRTcGF3bmVkUHJvbWlzZSA9IHNwYXduZWQgPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdHNwYXduZWQub24oJ2V4aXQnLCAoZXhpdENvZGUsIHNpZ25hbCkgPT4ge1xuXHRcdFx0cmVzb2x2ZSh7ZXhpdENvZGUsIHNpZ25hbH0pO1xuXHRcdH0pO1xuXG5cdFx0c3Bhd25lZC5vbignZXJyb3InLCBlcnJvciA9PiB7XG5cdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHNwYXduZWQuc3RkaW4pIHtcblx0XHRcdHNwYXduZWQuc3RkaW4ub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuXHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRtZXJnZVByb21pc2UsXG5cdGdldFNwYXduZWRQcm9taXNlXG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBub3JtYWxpemVBcmdzID0gKGZpbGUsIGFyZ3MgPSBbXSkgPT4ge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkoYXJncykpIHtcblx0XHRyZXR1cm4gW2ZpbGVdO1xuXHR9XG5cblx0cmV0dXJuIFtmaWxlLCAuLi5hcmdzXTtcbn07XG5cbmNvbnN0IE5PX0VTQ0FQRV9SRUdFWFAgPSAvXltcXHcuLV0rJC87XG5jb25zdCBET1VCTEVfUVVPVEVTX1JFR0VYUCA9IC9cIi9nO1xuXG5jb25zdCBlc2NhcGVBcmcgPSBhcmcgPT4ge1xuXHRpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycgfHwgTk9fRVNDQVBFX1JFR0VYUC50ZXN0KGFyZykpIHtcblx0XHRyZXR1cm4gYXJnO1xuXHR9XG5cblx0cmV0dXJuIGBcIiR7YXJnLnJlcGxhY2UoRE9VQkxFX1FVT1RFU19SRUdFWFAsICdcXFxcXCInKX1cImA7XG59O1xuXG5jb25zdCBqb2luQ29tbWFuZCA9IChmaWxlLCBhcmdzKSA9PiB7XG5cdHJldHVybiBub3JtYWxpemVBcmdzKGZpbGUsIGFyZ3MpLmpvaW4oJyAnKTtcbn07XG5cbmNvbnN0IGdldEVzY2FwZWRDb21tYW5kID0gKGZpbGUsIGFyZ3MpID0+IHtcblx0cmV0dXJuIG5vcm1hbGl6ZUFyZ3MoZmlsZSwgYXJncykubWFwKGFyZyA9PiBlc2NhcGVBcmcoYXJnKSkuam9pbignICcpO1xufTtcblxuY29uc3QgU1BBQ0VTX1JFR0VYUCA9IC8gKy9nO1xuXG4vLyBIYW5kbGUgYGV4ZWNhLmNvbW1hbmQoKWBcbmNvbnN0IHBhcnNlQ29tbWFuZCA9IGNvbW1hbmQgPT4ge1xuXHRjb25zdCB0b2tlbnMgPSBbXTtcblx0Zm9yIChjb25zdCB0b2tlbiBvZiBjb21tYW5kLnRyaW0oKS5zcGxpdChTUEFDRVNfUkVHRVhQKSkge1xuXHRcdC8vIEFsbG93IHNwYWNlcyB0byBiZSBlc2NhcGVkIGJ5IGEgYmFja3NsYXNoIGlmIG5vdCBtZWFudCBhcyBhIGRlbGltaXRlclxuXHRcdGNvbnN0IHByZXZpb3VzVG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXHRcdGlmIChwcmV2aW91c1Rva2VuICYmIHByZXZpb3VzVG9rZW4uZW5kc1dpdGgoJ1xcXFwnKSkge1xuXHRcdFx0Ly8gTWVyZ2UgcHJldmlvdXMgdG9rZW4gd2l0aCBjdXJyZW50IG9uZVxuXHRcdFx0dG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXSA9IGAke3ByZXZpb3VzVG9rZW4uc2xpY2UoMCwgLTEpfSAke3Rva2VufWA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRva2Vucy5wdXNoKHRva2VuKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG9rZW5zO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGpvaW5Db21tYW5kLFxuXHRnZXRFc2NhcGVkQ29tbWFuZCxcblx0cGFyc2VDb21tYW5kXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IGNyb3NzU3Bhd24gPSByZXF1aXJlKCdjcm9zcy1zcGF3bicpO1xuY29uc3Qgc3RyaXBGaW5hbE5ld2xpbmUgPSByZXF1aXJlKCdzdHJpcC1maW5hbC1uZXdsaW5lJyk7XG5jb25zdCBucG1SdW5QYXRoID0gcmVxdWlyZSgnbnBtLXJ1bi1wYXRoJyk7XG5jb25zdCBvbmV0aW1lID0gcmVxdWlyZSgnb25ldGltZScpO1xuY29uc3QgbWFrZUVycm9yID0gcmVxdWlyZSgnLi9saWIvZXJyb3InKTtcbmNvbnN0IG5vcm1hbGl6ZVN0ZGlvID0gcmVxdWlyZSgnLi9saWIvc3RkaW8nKTtcbmNvbnN0IHtzcGF3bmVkS2lsbCwgc3Bhd25lZENhbmNlbCwgc2V0dXBUaW1lb3V0LCB2YWxpZGF0ZVRpbWVvdXQsIHNldEV4aXRIYW5kbGVyfSA9IHJlcXVpcmUoJy4vbGliL2tpbGwnKTtcbmNvbnN0IHtoYW5kbGVJbnB1dCwgZ2V0U3Bhd25lZFJlc3VsdCwgbWFrZUFsbFN0cmVhbSwgdmFsaWRhdGVJbnB1dFN5bmN9ID0gcmVxdWlyZSgnLi9saWIvc3RyZWFtJyk7XG5jb25zdCB7bWVyZ2VQcm9taXNlLCBnZXRTcGF3bmVkUHJvbWlzZX0gPSByZXF1aXJlKCcuL2xpYi9wcm9taXNlJyk7XG5jb25zdCB7am9pbkNvbW1hbmQsIHBhcnNlQ29tbWFuZCwgZ2V0RXNjYXBlZENvbW1hbmR9ID0gcmVxdWlyZSgnLi9saWIvY29tbWFuZCcpO1xuXG5jb25zdCBERUZBVUxUX01BWF9CVUZGRVIgPSAxMDAwICogMTAwMCAqIDEwMDtcblxuY29uc3QgZ2V0RW52ID0gKHtlbnY6IGVudk9wdGlvbiwgZXh0ZW5kRW52LCBwcmVmZXJMb2NhbCwgbG9jYWxEaXIsIGV4ZWNQYXRofSkgPT4ge1xuXHRjb25zdCBlbnYgPSBleHRlbmRFbnYgPyB7Li4ucHJvY2Vzcy5lbnYsIC4uLmVudk9wdGlvbn0gOiBlbnZPcHRpb247XG5cblx0aWYgKHByZWZlckxvY2FsKSB7XG5cdFx0cmV0dXJuIG5wbVJ1blBhdGguZW52KHtlbnYsIGN3ZDogbG9jYWxEaXIsIGV4ZWNQYXRofSk7XG5cdH1cblxuXHRyZXR1cm4gZW52O1xufTtcblxuY29uc3QgaGFuZGxlQXJndW1lbnRzID0gKGZpbGUsIGFyZ3MsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRjb25zdCBwYXJzZWQgPSBjcm9zc1NwYXduLl9wYXJzZShmaWxlLCBhcmdzLCBvcHRpb25zKTtcblx0ZmlsZSA9IHBhcnNlZC5jb21tYW5kO1xuXHRhcmdzID0gcGFyc2VkLmFyZ3M7XG5cdG9wdGlvbnMgPSBwYXJzZWQub3B0aW9ucztcblxuXHRvcHRpb25zID0ge1xuXHRcdG1heEJ1ZmZlcjogREVGQVVMVF9NQVhfQlVGRkVSLFxuXHRcdGJ1ZmZlcjogdHJ1ZSxcblx0XHRzdHJpcEZpbmFsTmV3bGluZTogdHJ1ZSxcblx0XHRleHRlbmRFbnY6IHRydWUsXG5cdFx0cHJlZmVyTG9jYWw6IGZhbHNlLFxuXHRcdGxvY2FsRGlyOiBvcHRpb25zLmN3ZCB8fCBwcm9jZXNzLmN3ZCgpLFxuXHRcdGV4ZWNQYXRoOiBwcm9jZXNzLmV4ZWNQYXRoLFxuXHRcdGVuY29kaW5nOiAndXRmOCcsXG5cdFx0cmVqZWN0OiB0cnVlLFxuXHRcdGNsZWFudXA6IHRydWUsXG5cdFx0YWxsOiBmYWxzZSxcblx0XHR3aW5kb3dzSGlkZTogdHJ1ZSxcblx0XHQuLi5vcHRpb25zXG5cdH07XG5cblx0b3B0aW9ucy5lbnYgPSBnZXRFbnYob3B0aW9ucyk7XG5cblx0b3B0aW9ucy5zdGRpbyA9IG5vcm1hbGl6ZVN0ZGlvKG9wdGlvbnMpO1xuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInICYmIHBhdGguYmFzZW5hbWUoZmlsZSwgJy5leGUnKSA9PT0gJ2NtZCcpIHtcblx0XHQvLyAjMTE2XG5cdFx0YXJncy51bnNoaWZ0KCcvcScpO1xuXHR9XG5cblx0cmV0dXJuIHtmaWxlLCBhcmdzLCBvcHRpb25zLCBwYXJzZWR9O1xufTtcblxuY29uc3QgaGFuZGxlT3V0cHV0ID0gKG9wdGlvbnMsIHZhbHVlLCBlcnJvcikgPT4ge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzQnVmZmVyKHZhbHVlKSkge1xuXHRcdC8vIFdoZW4gYGV4ZWNhLnN5bmMoKWAgZXJyb3JzLCB3ZSBub3JtYWxpemUgaXQgdG8gJycgdG8gbWltaWMgYGV4ZWNhKClgXG5cdFx0cmV0dXJuIGVycm9yID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiAnJztcblx0fVxuXG5cdGlmIChvcHRpb25zLnN0cmlwRmluYWxOZXdsaW5lKSB7XG5cdFx0cmV0dXJuIHN0cmlwRmluYWxOZXdsaW5lKHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn07XG5cbmNvbnN0IGV4ZWNhID0gKGZpbGUsIGFyZ3MsIG9wdGlvbnMpID0+IHtcblx0Y29uc3QgcGFyc2VkID0gaGFuZGxlQXJndW1lbnRzKGZpbGUsIGFyZ3MsIG9wdGlvbnMpO1xuXHRjb25zdCBjb21tYW5kID0gam9pbkNvbW1hbmQoZmlsZSwgYXJncyk7XG5cdGNvbnN0IGVzY2FwZWRDb21tYW5kID0gZ2V0RXNjYXBlZENvbW1hbmQoZmlsZSwgYXJncyk7XG5cblx0dmFsaWRhdGVUaW1lb3V0KHBhcnNlZC5vcHRpb25zKTtcblxuXHRsZXQgc3Bhd25lZDtcblx0dHJ5IHtcblx0XHRzcGF3bmVkID0gY2hpbGRQcm9jZXNzLnNwYXduKHBhcnNlZC5maWxlLCBwYXJzZWQuYXJncywgcGFyc2VkLm9wdGlvbnMpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIEVuc3VyZSB0aGUgcmV0dXJuZWQgZXJyb3IgaXMgYWx3YXlzIGJvdGggYSBwcm9taXNlIGFuZCBhIGNoaWxkIHByb2Nlc3Ncblx0XHRjb25zdCBkdW1teVNwYXduZWQgPSBuZXcgY2hpbGRQcm9jZXNzLkNoaWxkUHJvY2VzcygpO1xuXHRcdGNvbnN0IGVycm9yUHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG1ha2VFcnJvcih7XG5cdFx0XHRlcnJvcixcblx0XHRcdHN0ZG91dDogJycsXG5cdFx0XHRzdGRlcnI6ICcnLFxuXHRcdFx0YWxsOiAnJyxcblx0XHRcdGNvbW1hbmQsXG5cdFx0XHRlc2NhcGVkQ29tbWFuZCxcblx0XHRcdHBhcnNlZCxcblx0XHRcdHRpbWVkT3V0OiBmYWxzZSxcblx0XHRcdGlzQ2FuY2VsZWQ6IGZhbHNlLFxuXHRcdFx0a2lsbGVkOiBmYWxzZVxuXHRcdH0pKTtcblx0XHRyZXR1cm4gbWVyZ2VQcm9taXNlKGR1bW15U3Bhd25lZCwgZXJyb3JQcm9taXNlKTtcblx0fVxuXG5cdGNvbnN0IHNwYXduZWRQcm9taXNlID0gZ2V0U3Bhd25lZFByb21pc2Uoc3Bhd25lZCk7XG5cdGNvbnN0IHRpbWVkUHJvbWlzZSA9IHNldHVwVGltZW91dChzcGF3bmVkLCBwYXJzZWQub3B0aW9ucywgc3Bhd25lZFByb21pc2UpO1xuXHRjb25zdCBwcm9jZXNzRG9uZSA9IHNldEV4aXRIYW5kbGVyKHNwYXduZWQsIHBhcnNlZC5vcHRpb25zLCB0aW1lZFByb21pc2UpO1xuXG5cdGNvbnN0IGNvbnRleHQgPSB7aXNDYW5jZWxlZDogZmFsc2V9O1xuXG5cdHNwYXduZWQua2lsbCA9IHNwYXduZWRLaWxsLmJpbmQobnVsbCwgc3Bhd25lZC5raWxsLmJpbmQoc3Bhd25lZCkpO1xuXHRzcGF3bmVkLmNhbmNlbCA9IHNwYXduZWRDYW5jZWwuYmluZChudWxsLCBzcGF3bmVkLCBjb250ZXh0KTtcblxuXHRjb25zdCBoYW5kbGVQcm9taXNlID0gYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IFt7ZXJyb3IsIGV4aXRDb2RlLCBzaWduYWwsIHRpbWVkT3V0fSwgc3Rkb3V0UmVzdWx0LCBzdGRlcnJSZXN1bHQsIGFsbFJlc3VsdF0gPSBhd2FpdCBnZXRTcGF3bmVkUmVzdWx0KHNwYXduZWQsIHBhcnNlZC5vcHRpb25zLCBwcm9jZXNzRG9uZSk7XG5cdFx0Y29uc3Qgc3Rkb3V0ID0gaGFuZGxlT3V0cHV0KHBhcnNlZC5vcHRpb25zLCBzdGRvdXRSZXN1bHQpO1xuXHRcdGNvbnN0IHN0ZGVyciA9IGhhbmRsZU91dHB1dChwYXJzZWQub3B0aW9ucywgc3RkZXJyUmVzdWx0KTtcblx0XHRjb25zdCBhbGwgPSBoYW5kbGVPdXRwdXQocGFyc2VkLm9wdGlvbnMsIGFsbFJlc3VsdCk7XG5cblx0XHRpZiAoZXJyb3IgfHwgZXhpdENvZGUgIT09IDAgfHwgc2lnbmFsICE9PSBudWxsKSB7XG5cdFx0XHRjb25zdCByZXR1cm5lZEVycm9yID0gbWFrZUVycm9yKHtcblx0XHRcdFx0ZXJyb3IsXG5cdFx0XHRcdGV4aXRDb2RlLFxuXHRcdFx0XHRzaWduYWwsXG5cdFx0XHRcdHN0ZG91dCxcblx0XHRcdFx0c3RkZXJyLFxuXHRcdFx0XHRhbGwsXG5cdFx0XHRcdGNvbW1hbmQsXG5cdFx0XHRcdGVzY2FwZWRDb21tYW5kLFxuXHRcdFx0XHRwYXJzZWQsXG5cdFx0XHRcdHRpbWVkT3V0LFxuXHRcdFx0XHRpc0NhbmNlbGVkOiBjb250ZXh0LmlzQ2FuY2VsZWQsXG5cdFx0XHRcdGtpbGxlZDogc3Bhd25lZC5raWxsZWRcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIXBhcnNlZC5vcHRpb25zLnJlamVjdCkge1xuXHRcdFx0XHRyZXR1cm4gcmV0dXJuZWRFcnJvcjtcblx0XHRcdH1cblxuXHRcdFx0dGhyb3cgcmV0dXJuZWRFcnJvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Y29tbWFuZCxcblx0XHRcdGVzY2FwZWRDb21tYW5kLFxuXHRcdFx0ZXhpdENvZGU6IDAsXG5cdFx0XHRzdGRvdXQsXG5cdFx0XHRzdGRlcnIsXG5cdFx0XHRhbGwsXG5cdFx0XHRmYWlsZWQ6IGZhbHNlLFxuXHRcdFx0dGltZWRPdXQ6IGZhbHNlLFxuXHRcdFx0aXNDYW5jZWxlZDogZmFsc2UsXG5cdFx0XHRraWxsZWQ6IGZhbHNlXG5cdFx0fTtcblx0fTtcblxuXHRjb25zdCBoYW5kbGVQcm9taXNlT25jZSA9IG9uZXRpbWUoaGFuZGxlUHJvbWlzZSk7XG5cblx0aGFuZGxlSW5wdXQoc3Bhd25lZCwgcGFyc2VkLm9wdGlvbnMuaW5wdXQpO1xuXG5cdHNwYXduZWQuYWxsID0gbWFrZUFsbFN0cmVhbShzcGF3bmVkLCBwYXJzZWQub3B0aW9ucyk7XG5cblx0cmV0dXJuIG1lcmdlUHJvbWlzZShzcGF3bmVkLCBoYW5kbGVQcm9taXNlT25jZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4ZWNhO1xuXG5tb2R1bGUuZXhwb3J0cy5zeW5jID0gKGZpbGUsIGFyZ3MsIG9wdGlvbnMpID0+IHtcblx0Y29uc3QgcGFyc2VkID0gaGFuZGxlQXJndW1lbnRzKGZpbGUsIGFyZ3MsIG9wdGlvbnMpO1xuXHRjb25zdCBjb21tYW5kID0gam9pbkNvbW1hbmQoZmlsZSwgYXJncyk7XG5cdGNvbnN0IGVzY2FwZWRDb21tYW5kID0gZ2V0RXNjYXBlZENvbW1hbmQoZmlsZSwgYXJncyk7XG5cblx0dmFsaWRhdGVJbnB1dFN5bmMocGFyc2VkLm9wdGlvbnMpO1xuXG5cdGxldCByZXN1bHQ7XG5cdHRyeSB7XG5cdFx0cmVzdWx0ID0gY2hpbGRQcm9jZXNzLnNwYXduU3luYyhwYXJzZWQuZmlsZSwgcGFyc2VkLmFyZ3MsIHBhcnNlZC5vcHRpb25zKTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHR0aHJvdyBtYWtlRXJyb3Ioe1xuXHRcdFx0ZXJyb3IsXG5cdFx0XHRzdGRvdXQ6ICcnLFxuXHRcdFx0c3RkZXJyOiAnJyxcblx0XHRcdGFsbDogJycsXG5cdFx0XHRjb21tYW5kLFxuXHRcdFx0ZXNjYXBlZENvbW1hbmQsXG5cdFx0XHRwYXJzZWQsXG5cdFx0XHR0aW1lZE91dDogZmFsc2UsXG5cdFx0XHRpc0NhbmNlbGVkOiBmYWxzZSxcblx0XHRcdGtpbGxlZDogZmFsc2Vcblx0XHR9KTtcblx0fVxuXG5cdGNvbnN0IHN0ZG91dCA9IGhhbmRsZU91dHB1dChwYXJzZWQub3B0aW9ucywgcmVzdWx0LnN0ZG91dCwgcmVzdWx0LmVycm9yKTtcblx0Y29uc3Qgc3RkZXJyID0gaGFuZGxlT3V0cHV0KHBhcnNlZC5vcHRpb25zLCByZXN1bHQuc3RkZXJyLCByZXN1bHQuZXJyb3IpO1xuXG5cdGlmIChyZXN1bHQuZXJyb3IgfHwgcmVzdWx0LnN0YXR1cyAhPT0gMCB8fCByZXN1bHQuc2lnbmFsICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgZXJyb3IgPSBtYWtlRXJyb3Ioe1xuXHRcdFx0c3Rkb3V0LFxuXHRcdFx0c3RkZXJyLFxuXHRcdFx0ZXJyb3I6IHJlc3VsdC5lcnJvcixcblx0XHRcdHNpZ25hbDogcmVzdWx0LnNpZ25hbCxcblx0XHRcdGV4aXRDb2RlOiByZXN1bHQuc3RhdHVzLFxuXHRcdFx0Y29tbWFuZCxcblx0XHRcdGVzY2FwZWRDb21tYW5kLFxuXHRcdFx0cGFyc2VkLFxuXHRcdFx0dGltZWRPdXQ6IHJlc3VsdC5lcnJvciAmJiByZXN1bHQuZXJyb3IuY29kZSA9PT0gJ0VUSU1FRE9VVCcsXG5cdFx0XHRpc0NhbmNlbGVkOiBmYWxzZSxcblx0XHRcdGtpbGxlZDogcmVzdWx0LnNpZ25hbCAhPT0gbnVsbFxuXHRcdH0pO1xuXG5cdFx0aWYgKCFwYXJzZWQub3B0aW9ucy5yZWplY3QpIHtcblx0XHRcdHJldHVybiBlcnJvcjtcblx0XHR9XG5cblx0XHR0aHJvdyBlcnJvcjtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0Y29tbWFuZCxcblx0XHRlc2NhcGVkQ29tbWFuZCxcblx0XHRleGl0Q29kZTogMCxcblx0XHRzdGRvdXQsXG5cdFx0c3RkZXJyLFxuXHRcdGZhaWxlZDogZmFsc2UsXG5cdFx0dGltZWRPdXQ6IGZhbHNlLFxuXHRcdGlzQ2FuY2VsZWQ6IGZhbHNlLFxuXHRcdGtpbGxlZDogZmFsc2Vcblx0fTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNvbW1hbmQgPSAoY29tbWFuZCwgb3B0aW9ucykgPT4ge1xuXHRjb25zdCBbZmlsZSwgLi4uYXJnc10gPSBwYXJzZUNvbW1hbmQoY29tbWFuZCk7XG5cdHJldHVybiBleGVjYShmaWxlLCBhcmdzLCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmNvbW1hbmRTeW5jID0gKGNvbW1hbmQsIG9wdGlvbnMpID0+IHtcblx0Y29uc3QgW2ZpbGUsIC4uLmFyZ3NdID0gcGFyc2VDb21tYW5kKGNvbW1hbmQpO1xuXHRyZXR1cm4gZXhlY2Euc3luYyhmaWxlLCBhcmdzLCBvcHRpb25zKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLm5vZGUgPSAoc2NyaXB0UGF0aCwgYXJncywgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGlmIChhcmdzICYmICFBcnJheS5pc0FycmF5KGFyZ3MpICYmIHR5cGVvZiBhcmdzID09PSAnb2JqZWN0Jykge1xuXHRcdG9wdGlvbnMgPSBhcmdzO1xuXHRcdGFyZ3MgPSBbXTtcblx0fVxuXG5cdGNvbnN0IHN0ZGlvID0gbm9ybWFsaXplU3RkaW8ubm9kZShvcHRpb25zKTtcblx0Y29uc3QgZGVmYXVsdEV4ZWNBcmd2ID0gcHJvY2Vzcy5leGVjQXJndi5maWx0ZXIoYXJnID0+ICFhcmcuc3RhcnRzV2l0aCgnLS1pbnNwZWN0JykpO1xuXG5cdGNvbnN0IHtcblx0XHRub2RlUGF0aCA9IHByb2Nlc3MuZXhlY1BhdGgsXG5cdFx0bm9kZU9wdGlvbnMgPSBkZWZhdWx0RXhlY0FyZ3Zcblx0fSA9IG9wdGlvbnM7XG5cblx0cmV0dXJuIGV4ZWNhKFxuXHRcdG5vZGVQYXRoLFxuXHRcdFtcblx0XHRcdC4uLm5vZGVPcHRpb25zLFxuXHRcdFx0c2NyaXB0UGF0aCxcblx0XHRcdC4uLihBcnJheS5pc0FycmF5KGFyZ3MpID8gYXJncyA6IFtdKVxuXHRcdF0sXG5cdFx0e1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHN0ZGluOiB1bmRlZmluZWQsXG5cdFx0XHRzdGRvdXQ6IHVuZGVmaW5lZCxcblx0XHRcdHN0ZGVycjogdW5kZWZpbmVkLFxuXHRcdFx0c3RkaW8sXG5cdFx0XHRzaGVsbDogZmFsc2Vcblx0XHR9XG5cdCk7XG59O1xuIiwiLy8gc3JjL2RldGVjdC50c1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBmaW5kVXAgZnJvbSBcImZpbmQtdXBcIjtcbnZhciBMT0NLUyA9IHtcbiAgXCJwbnBtLWxvY2sueWFtbFwiOiBcInBucG1cIixcbiAgXCJ5YXJuLmxvY2tcIjogXCJ5YXJuXCIsXG4gIFwicGFja2FnZS1sb2NrLmpzb25cIjogXCJucG1cIlxufTtcbmFzeW5jIGZ1bmN0aW9uIGRldGVjdFBhY2thZ2VNYW5hZ2VyKGN3ZCA9IHByb2Nlc3MuY3dkKCkpIHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZmluZFVwKE9iamVjdC5rZXlzKExPQ0tTKSwgeyBjd2QgfSk7XG4gIGNvbnN0IGFnZW50ID0gcmVzdWx0ID8gTE9DS1NbcGF0aC5iYXNlbmFtZShyZXN1bHQpXSA6IG51bGw7XG4gIHJldHVybiBhZ2VudDtcbn1cblxuLy8gc3JjL2luc3RhbGwudHNcbmltcG9ydCBleGVjYSBmcm9tIFwiZXhlY2FcIjtcbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlKG5hbWVzLCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgYWdlbnQgPSBvcHRpb25zLnBhY2thZ2VNYW5hZ2VyIHx8IGF3YWl0IGRldGVjdFBhY2thZ2VNYW5hZ2VyKG9wdGlvbnMuY3dkKSB8fCBcIm5wbVwiO1xuICBpZiAoIUFycmF5LmlzQXJyYXkobmFtZXMpKVxuICAgIG5hbWVzID0gW25hbWVzXTtcbiAgY29uc3QgYXJncyA9IG9wdGlvbnMuYWRkaXRpb25hbEFyZ3MgfHwgW107XG4gIGlmIChvcHRpb25zLnByZWZlck9mZmxpbmUpXG4gICAgYXJncy51bnNoaWZ0KFwiLS1wcmVmZXItb2ZmbGluZVwiKTtcbiAgcmV0dXJuIGV4ZWNhKGFnZW50LCBbXG4gICAgYWdlbnQgPT09IFwieWFyblwiID8gXCJhZGRcIiA6IFwiaW5zdGFsbFwiLFxuICAgIG9wdGlvbnMuZGV2ID8gXCItRFwiIDogXCJcIixcbiAgICAuLi5hcmdzLFxuICAgIC4uLm5hbWVzXG4gIF0uZmlsdGVyKEJvb2xlYW4pLCB7XG4gICAgc3RkaW86IG9wdGlvbnMuc2lsZW50ID8gXCJpZ25vcmVcIiA6IFwiaW5oZXJpdFwiLFxuICAgIGN3ZDogb3B0aW9ucy5jd2RcbiAgfSk7XG59XG5leHBvcnQge1xuICBkZXRlY3RQYWNrYWdlTWFuYWdlcixcbiAgaW5zdGFsbFBhY2thZ2Vcbn07XG4iXSwibmFtZXMiOlsiUXVldWUiLCJyZXF1aXJlJCQwIiwicExpbWl0IiwicExvY2F0ZSIsInBhdGgiLCJmcyIsInJlcXVpcmUkJDEiLCJwcm9taXNpZnkiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsImxvY2F0ZVBhdGhNb2R1bGUiLCJwYXRoRXhpc3RzTW9kdWxlIiwibG9jYXRlUGF0aCIsInBhdGhFeGlzdHMiLCJzdHJpcEZpbmFsTmV3bGluZSIsInBhdGhLZXkiLCJfb3MiLCJfcmVhbHRpbWUiLCJzaWduYWxzQnlOYW1lIiwibWFrZUVycm9yIiwibm9ybWFsaXplU3RkaW8iLCJzdGRpb01vZHVsZSIsInNwYXduZWRLaWxsIiwic3Bhd25lZENhbmNlbCIsInNldHVwVGltZW91dCIsInZhbGlkYXRlVGltZW91dCIsInNldEV4aXRIYW5kbGVyIiwiaXNTdHJlYW0iLCJoYW5kbGVJbnB1dCIsIm1ha2VBbGxTdHJlYW0iLCJnZXRTcGF3bmVkUmVzdWx0IiwidmFsaWRhdGVJbnB1dFN5bmMiLCJtZXJnZVByb21pc2UiLCJnZXRTcGF3bmVkUHJvbWlzZSIsImpvaW5Db21tYW5kIiwiZ2V0RXNjYXBlZENvbW1hbmQiLCJwYXJzZUNvbW1hbmQiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwiZXhlY2FNb2R1bGUiLCJleGVjYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sSUFBSSxDQUFDO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFO0FBQ3BCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDckI7QUFDQTtBQUNBLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDeEIsRUFBRTtBQUNGLENBQUM7QUFDRDtBQUNBLE1BQU1BLE9BQUssQ0FBQztBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLFdBQVcsR0FBRztBQUNmLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2YsRUFBRTtBQUNGO0FBQ0EsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2hCLEVBQUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0I7QUFDQSxFQUFFLElB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
