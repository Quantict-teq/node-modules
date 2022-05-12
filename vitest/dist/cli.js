import { EventEmitter } from 'events';
import { c } from './chunk-utils-base.68f100c1.js';
import { v as version, s as startVitest, d as divider } from './chunk-vite-node-externalize.328676bc.js';
import 'tty';
import 'local-pkg';
import 'buffer';
import 'path';
import 'child_process';
import 'process';
import './vendor-index.91d2a0e5.js';
import './vendor-_commonjsHelpers.91d4f591.js';
import 'fs';
import 'stream';
import 'util';
import 'assert';
import 'url';
import 'os';
import './vendor-index.76be1f4d.js';
import 'vite';
import './chunk-constants.a1a50d89.js';
import './chunk-vite-node-utils.f2f4fe4b.js';
import 'module';
import 'vm';
import './chunk-defaults.366529f7.js';
import 'perf_hooks';
import './chunk-utils-source-map.38ddd54e.js';
import 'worker_threads';
import 'tinypool';
import './chunk-magic-string.6c8f4a10.js';
import 'readline';
import './vendor-index.665a6ba4.js';

function toArr(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}

function toVal(out, key, val, opts) {
	var x, old=out[key], nxt=(
		!!~opts.string.indexOf(key) ? (val == null || val === true ? '' : String(val))
		: typeof val === 'boolean' ? val
		: !!~opts.boolean.indexOf(key) ? (val === 'false' ? false : val === 'true' || (out._.push((x = +val,x * 0 === 0) ? x : val),!!val))
		: (x = +val,x * 0 === 0) ? x : val
	);
	out[key] = old == null ? nxt : (Array.isArray(old) ? old.concat(nxt) : [old, nxt]);
}

function mri2 (args, opts) {
	args = args || [];
	opts = opts || {};

	var k, arr, arg, name, val, out={ _:[] };
	var i=0, j=0, idx=0, len=args.length;

	const alibi = opts.alias !== void 0;
	const strict = opts.unknown !== void 0;
	const defaults = opts.default !== void 0;

	opts.alias = opts.alias || {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	if (alibi) {
		for (k in opts.alias) {
			arr = opts.alias[k] = toArr(opts.alias[k]);
			for (i=0; i < arr.length; i++) {
				(opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
			}
		}
	}

	for (i=opts.boolean.length; i-- > 0;) {
		arr = opts.alias[opts.boolean[i]] || [];
		for (j=arr.length; j-- > 0;) opts.boolean.push(arr[j]);
	}

	for (i=opts.string.length; i-- > 0;) {
		arr = opts.alias[opts.string[i]] || [];
		for (j=arr.length; j-- > 0;) opts.string.push(arr[j]);
	}

	if (defaults) {
		for (k in opts.default) {
			name = typeof opts.default[k];
			arr = opts.alias[k] = opts.alias[k] || [];
			if (opts[name] !== void 0) {
				opts[name].push(k);
				for (i=0; i < arr.length; i++) {
					opts[name].push(arr[i]);
				}
			}
		}
	}

	const keys = strict ? Object.keys(opts.alias) : [];

	for (i=0; i < len; i++) {
		arg = args[i];

		if (arg === '--') {
			out._ = out._.concat(args.slice(++i));
			break;
		}

		for (j=0; j < arg.length; j++) {
			if (arg.charCodeAt(j) !== 45) break; // "-"
		}

		if (j === 0) {
			out._.push(arg);
		} else if (arg.substring(j, j + 3) === 'no-') {
			name = arg.substring(j + 3);
			if (strict && !~keys.indexOf(name)) {
				return opts.unknown(arg);
			}
			out[name] = false;
		} else {
			for (idx=j+1; idx < arg.length; idx++) {
				if (arg.charCodeAt(idx) === 61) break; // "="
			}

			name = arg.substring(j, idx);
			val = arg.substring(++idx) || (i+1 === len || (''+args[i+1]).charCodeAt(0) === 45 || args[++i]);
			arr = (j === 2 ? [name] : name);

			for (idx=0; idx < arr.length; idx++) {
				name = arr[idx];
				if (strict && !~keys.indexOf(name)) return opts.unknown('-'.repeat(j) + name);
				toVal(out, name, (idx + 1 < arr.length) || val, opts);
			}
		}
	}

	if (defaults) {
		for (k in opts.default) {
			if (out[k] === void 0) {
				out[k] = opts.default[k];
			}
		}
	}

	if (alibi) {
		for (k in out) {
			arr = opts.alias[k] || [];
			while (arr.length > 0) {
				out[arr.shift()] = out[k];
			}
		}
	}

	return out;
}

const removeBrackets = (v) => v.replace(/[<[].+/, "").trim();
const findAllBrackets = (v) => {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g;
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)\]/g;
  const res = [];
  const parse = (match) => {
    let variadic = false;
    let value = match[1];
    if (value.startsWith("...")) {
      value = value.slice(3);
      variadic = true;
    }
    return {
      required: match[0].startsWith("<"),
      value,
      variadic
    };
  };
  let angledMatch;
  while (angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v)) {
    res.push(parse(angledMatch));
  }
  let squareMatch;
  while (squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v)) {
    res.push(parse(squareMatch));
  }
  return res;
};
const getMriOptions = (options) => {
  const result = {alias: {}, boolean: []};
  for (const [index, option] of options.entries()) {
    if (option.names.length > 1) {
      result.alias[option.names[0]] = option.names.slice(1);
    }
    if (option.isBoolean) {
      if (option.negated) {
        const hasStringTypeOption = options.some((o, i) => {
          return i !== index && o.names.some((name) => option.names.includes(name)) && typeof o.required === "boolean";
        });
        if (!hasStringTypeOption) {
          result.boolean.push(option.names[0]);
        }
      } else {
        result.boolean.push(option.names[0]);
      }
    }
  }
  return result;
};
const findLongest = (arr) => {
  return arr.sort((a, b) => {
    return a.length > b.length ? -1 : 1;
  })[0];
};
const padRight = (str, length) => {
  return str.length >= length ? str : `${str}${" ".repeat(length - str.length)}`;
};
const camelcase = (input) => {
  return input.replace(/([a-z])-([a-z])/g, (_, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
};
const setDotProp = (obj, keys, val) => {
  let i = 0;
  let length = keys.length;
  let t = obj;
  let x;
  for (; i < length; ++i) {
    x = t[keys[i]];
    t = t[keys[i]] = i === length - 1 ? val : x != null ? x : !!~keys[i + 1].indexOf(".") || !(+keys[i + 1] > -1) ? {} : [];
  }
};
const setByType = (obj, transforms) => {
  for (const key of Object.keys(transforms)) {
    const transform = transforms[key];
    if (transform.shouldTransform) {
      obj[key] = Array.prototype.concat.call([], obj[key]);
      if (typeof transform.transformFunction === "function") {
        obj[key] = obj[key].map(transform.transformFunction);
      }
    }
  }
};
const getFileName = (input) => {
  const m = /([^\\\/]+)$/.exec(input);
  return m ? m[1] : "";
};
const camelcaseOptionName = (name) => {
  return name.split(".").map((v, i) => {
    return i === 0 ? camelcase(v) : v;
  }).join(".");
};
class CACError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

class Option {
  constructor(rawName, description, config) {
    this.rawName = rawName;
    this.description = description;
    this.config = Object.assign({}, config);
    rawName = rawName.replace(/\.\*/g, "");
    this.negated = false;
    this.names = removeBrackets(rawName).split(",").map((v) => {
      let name = v.trim().replace(/^-{1,2}/, "");
      if (name.startsWith("no-")) {
        this.negated = true;
        name = name.replace(/^no-/, "");
      }
      return camelcaseOptionName(name);
    }).sort((a, b) => a.length > b.length ? 1 : -1);
    this.name = this.names[this.names.length - 1];
    if (this.negated && this.config.default == null) {
      this.config.default = true;
    }
    if (rawName.includes("<")) {
      this.required = true;
    } else if (rawName.includes("[")) {
      this.required = false;
    } else {
      this.isBoolean = true;
    }
  }
}

const processArgs = process.argv;
const platformInfo = `${process.platform}-${process.arch} node-${process.version}`;

class Command {
  constructor(rawName, description, config = {}, cli) {
    this.rawName = rawName;
    this.description = description;
    this.config = config;
    this.cli = cli;
    this.options = [];
    this.aliasNames = [];
    this.name = removeBrackets(rawName);
    this.args = findAllBrackets(rawName);
    this.examples = [];
  }
  usage(text) {
    this.usageText = text;
    return this;
  }
  allowUnknownOptions() {
    this.config.allowUnknownOptions = true;
    return this;
  }
  ignoreOptionDefaultValue() {
    this.config.ignoreOptionDefaultValue = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.versionNumber = version;
    this.option(customFlags, "Display version number");
    return this;
  }
  example(example) {
    this.examples.push(example);
    return this;
  }
  option(rawName, description, config) {
    const option = new Option(rawName, description, config);
    this.options.push(option);
    return this;
  }
  alias(name) {
    this.aliasNames.push(name);
    return this;
  }
  action(callback) {
    this.commandAction = callback;
    return this;
  }
  isMatched(name) {
    return this.name === name || this.aliasNames.includes(name);
  }
  get isDefaultCommand() {
    return this.name === "" || this.aliasNames.includes("!");
  }
  get isGlobalCommand() {
    return this instanceof GlobalCommand;
  }
  hasOption(name) {
    name = name.split(".")[0];
    return this.options.find((option) => {
      return option.names.includes(name);
    });
  }
  outputHelp() {
    const {name, commands} = this.cli;
    const {
      versionNumber,
      options: globalOptions,
      helpCallback
    } = this.cli.globalCommand;
    let sections = [
      {
        body: `${name}${versionNumber ? `/${versionNumber}` : ""}`
      }
    ];
    sections.push({
      title: "Usage",
      body: `  $ ${name} ${this.usageText || this.rawName}`
    });
    const showCommands = (this.isGlobalCommand || this.isDefaultCommand) && commands.length > 0;
    if (showCommands) {
      const longestCommandName = findLongest(commands.map((command) => command.rawName));
      sections.push({
        title: "Commands",
        body: commands.map((command) => {
          return `  ${padRight(command.rawName, longestCommandName.length)}  ${command.description}`;
        }).join("\n")
      });
      sections.push({
        title: `For more info, run any command with the \`--help\` flag`,
        body: commands.map((command) => `  $ ${name}${command.name === "" ? "" : ` ${command.name}`} --help`).join("\n")
      });
    }
    let options = this.isGlobalCommand ? globalOptions : [...this.options, ...globalOptions || []];
    if (!this.isGlobalCommand && !this.isDefaultCommand) {
      options = options.filter((option) => option.name !== "version");
    }
    if (options.length > 0) {
      const longestOptionName = findLongest(options.map((option) => option.rawName));
      sections.push({
        title: "Options",
        body: options.map((option) => {
          return `  ${padRight(option.rawName, longestOptionName.length)}  ${option.description} ${option.config.default === void 0 ? "" : `(default: ${option.config.default})`}`;
        }).join("\n")
      });
    }
    if (this.examples.length > 0) {
      sections.push({
        title: "Examples",
        body: this.examples.map((example) => {
          if (typeof example === "function") {
            return example(name);
          }
          return example;
        }).join("\n")
      });
    }
    if (helpCallback) {
      sections = helpCallback(sections) || sections;
    }
    console.log(sections.map((section) => {
      return section.title ? `${section.title}:
${section.body}` : section.body;
    }).join("\n\n"));
  }
  outputVersion() {
    const {name} = this.cli;
    const {versionNumber} = this.cli.globalCommand;
    if (versionNumber) {
      console.log(`${name}/${versionNumber} ${platformInfo}`);
    }
  }
  checkRequiredArgs() {
    const minimalArgsCount = this.args.filter((arg) => arg.required).length;
    if (this.cli.args.length < minimalArgsCount) {
      throw new CACError(`missing required args for command \`${this.rawName}\``);
    }
  }
  checkUnknownOptions() {
    const {options, globalCommand} = this.cli;
    if (!this.config.allowUnknownOptions) {
      for (const name of Object.keys(options)) {
        if (name !== "--" && !this.hasOption(name) && !globalCommand.hasOption(name)) {
          throw new CACError(`Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``);
        }
      }
    }
  }
  checkOptionValue() {
    const {options: parsedOptions, globalCommand} = this.cli;
    const options = [...globalCommand.options, ...this.options];
    for (const option of options) {
      const value = parsedOptions[option.name.split(".")[0]];
      if (option.required) {
        const hasNegated = options.some((o) => o.negated && o.names.includes(option.name));
        if (value === true || value === false && !hasNegated) {
          throw new CACError(`option \`${option.rawName}\` value is missing`);
        }
      }
    }
  }
}
class GlobalCommand extends Command {
  constructor(cli) {
    super("@@global@@", "", {}, cli);
  }
}

var __assign = Object.assign;
class CAC extends EventEmitter {
  constructor(name = "") {
    super();
    this.name = name;
    this.commands = [];
    this.rawArgs = [];
    this.args = [];
    this.options = {};
    this.globalCommand = new GlobalCommand(this);
    this.globalCommand.usage("<command> [options]");
  }
  usage(text) {
    this.globalCommand.usage(text);
    return this;
  }
  command(rawName, description, config) {
    const command = new Command(rawName, description || "", config, this);
    command.globalCommand = this.globalCommand;
    this.commands.push(command);
    return command;
  }
  option(rawName, description, config) {
    this.globalCommand.option(rawName, description, config);
    return this;
  }
  help(callback) {
    this.globalCommand.option("-h, --help", "Display this message");
    this.globalCommand.helpCallback = callback;
    this.showHelpOnExit = true;
    return this;
  }
  version(version, customFlags = "-v, --version") {
    this.globalCommand.version(version, customFlags);
    this.showVersionOnExit = true;
    return this;
  }
  example(example) {
    this.globalCommand.example(example);
    return this;
  }
  outputHelp() {
    if (this.matchedCommand) {
      this.matchedCommand.outputHelp();
    } else {
      this.globalCommand.outputHelp();
    }
  }
  outputVersion() {
    this.globalCommand.outputVersion();
  }
  setParsedInfo({args, options}, matchedCommand, matchedCommandName) {
    this.args = args;
    this.options = options;
    if (matchedCommand) {
      this.matchedCommand = matchedCommand;
    }
    if (matchedCommandName) {
      this.matchedCommandName = matchedCommandName;
    }
    return this;
  }
  unsetMatchedCommand() {
    this.matchedCommand = void 0;
    this.matchedCommandName = void 0;
  }
  parse(argv = processArgs, {
    run = true
  } = {}) {
    this.rawArgs = argv;
    if (!this.name) {
      this.name = argv[1] ? getFileName(argv[1]) : "cli";
    }
    let shouldParse = true;
    for (const command of this.commands) {
      const parsed = this.mri(argv.slice(2), command);
      const commandName = parsed.args[0];
      if (command.isMatched(commandName)) {
        shouldParse = false;
        const parsedInfo = __assign(__assign({}, parsed), {
          args: parsed.args.slice(1)
        });
        this.setParsedInfo(parsedInfo, command, commandName);
        this.emit(`command:${commandName}`, command);
      }
    }
    if (shouldParse) {
      for (const command of this.commands) {
        if (command.name === "") {
          shouldParse = false;
          const parsed = this.mri(argv.slice(2), command);
          this.setParsedInfo(parsed, command);
          this.emit(`command:!`, command);
        }
      }
    }
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2));
      this.setParsedInfo(parsed);
    }
    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp();
      run = false;
      this.unsetMatchedCommand();
    }
    if (this.options.version && this.showVersionOnExit && this.matchedCommandName == null) {
      this.outputVersion();
      run = false;
      this.unsetMatchedCommand();
    }
    const parsedArgv = {args: this.args, options: this.options};
    if (run) {
      this.runMatchedCommand();
    }
    if (!this.matchedCommand && this.args[0]) {
      this.emit("command:*");
    }
    return parsedArgv;
  }
  mri(argv, command) {
    const cliOptions = [
      ...this.globalCommand.options,
      ...command ? command.options : []
    ];
    const mriOptions = getMriOptions(cliOptions);
    let argsAfterDoubleDashes = [];
    const doubleDashesIndex = argv.indexOf("--");
    if (doubleDashesIndex > -1) {
      argsAfterDoubleDashes = argv.slice(doubleDashesIndex + 1);
      argv = argv.slice(0, doubleDashesIndex);
    }
    let parsed = mri2(argv, mriOptions);
    parsed = Object.keys(parsed).reduce((res, name) => {
      return __assign(__assign({}, res), {
        [camelcaseOptionName(name)]: parsed[name]
      });
    }, {_: []});
    const args = parsed._;
    const options = {
      "--": argsAfterDoubleDashes
    };
    const ignoreDefault = command && command.config.ignoreOptionDefaultValue ? command.config.ignoreOptionDefaultValue : this.globalCommand.config.ignoreOptionDefaultValue;
    let transforms = Object.create(null);
    for (const cliOption of cliOptions) {
      if (!ignoreDefault && cliOption.config.default !== void 0) {
        for (const name of cliOption.names) {
          options[name] = cliOption.config.default;
        }
      }
      if (Array.isArray(cliOption.config.type)) {
        if (transforms[cliOption.name] === void 0) {
          transforms[cliOption.name] = Object.create(null);
          transforms[cliOption.name]["shouldTransform"] = true;
          transforms[cliOption.name]["transformFunction"] = cliOption.config.type[0];
        }
      }
    }
    for (const key of Object.keys(parsed)) {
      if (key !== "_") {
        const keys = key.split(".");
        setDotProp(options, keys, parsed[key]);
        setByType(options, transforms);
      }
    }
    return {
      args,
      options
    };
  }
  runMatchedCommand() {
    const {args, options, matchedCommand: command} = this;
    if (!command || !command.commandAction)
      return;
    command.checkUnknownOptions();
    command.checkOptionValue();
    command.checkRequiredArgs();
    const actionArgs = [];
    command.args.forEach((arg, index) => {
      if (arg.variadic) {
        actionArgs.push(args.slice(index));
      } else {
        actionArgs.push(args[index]);
      }
    });
    actionArgs.push(options);
    return command.commandAction.apply(this, actionArgs);
  }
}

const cac = (name = "") => new CAC(name);

const cli = cac("vitest");
cli.version(version).option("-r, --root <path>", "root path").option("-c, --config <path>", "path to config file").option("-u, --update", "update snapshot").option("-w, --watch", "watch mode").option("-t, --testNamePattern <pattern>", "run tests with full names matching the specified pattern").option("--dir", "base directory to scan for the test files").option("--ui", "enable UI").option("--open", "open UI automatically (default: !process.env.CI))").option("--api [api]", "serve API, available options: --api.port <port>, --api.host [host] and --api.strictPort").option("--threads", "enabled threads (default: true)").option("--silent", "silent console output from tests").option("--isolate", "isolate environment for each test file (default: true)").option("--reporter <name>", "reporter").option("--outputFile <filename>", "write test results to a file when the --reporter=json option is also specified").option("--coverage", "use c8 for coverage").option("--run", "do not watch").option("--mode", "override Vite mode (default: test)").option("--globals", "inject apis globally").option("--global", "deprecated, use --globals").option("--dom", "mock browser api with happy-dom").option("--environment <env>", "runner environment (default: node)").option("--passWithNoTests", "pass when no tests found").option("--allowOnly", "Allow tests and suites that are marked as only (default: !process.env.CI)").help();
cli.command("run [...filters]").action(run);
cli.command("related [...filters]").action(runRelated);
cli.command("watch [...filters]").action(start);
cli.command("dev [...filters]").action(start);
cli.command("[...filters]").action(start);
cli.parse();
async function runRelated(relatedFiles, argv) {
  argv.related = relatedFiles;
  argv.passWithNoTests ?? (argv.passWithNoTests = true);
  await start([], argv);
}
async function run(cliFilters, options) {
  options.run = true;
  await start(cliFilters, options);
}
async function start(cliFilters, options) {
  try {
    if (await startVitest(cliFilters, options) === false)
      process.exit();
  } catch (e) {
    process.exitCode = 1;
    console.error(`
${c.red(divider(c.bold(c.inverse(" Unhandled Error "))))}`);
    console.error(e);
    console.error("\n\n");
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vY2FjQDYuNy4xMi9ub2RlX21vZHVsZXMvY2FjL2Rpc3QvaW5kZXgubWpzIiwiLi4vc3JjL25vZGUvY2xpLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmZ1bmN0aW9uIHRvQXJyKGFueSkge1xuXHRyZXR1cm4gYW55ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoYW55KSA/IGFueSA6IFthbnldO1xufVxuXG5mdW5jdGlvbiB0b1ZhbChvdXQsIGtleSwgdmFsLCBvcHRzKSB7XG5cdHZhciB4LCBvbGQ9b3V0W2tleV0sIG54dD0oXG5cdFx0ISF+b3B0cy5zdHJpbmcuaW5kZXhPZihrZXkpID8gKHZhbCA9PSBudWxsIHx8IHZhbCA9PT0gdHJ1ZSA/ICcnIDogU3RyaW5nKHZhbCkpXG5cdFx0OiB0eXBlb2YgdmFsID09PSAnYm9vbGVhbicgPyB2YWxcblx0XHQ6ICEhfm9wdHMuYm9vbGVhbi5pbmRleE9mKGtleSkgPyAodmFsID09PSAnZmFsc2UnID8gZmFsc2UgOiB2YWwgPT09ICd0cnVlJyB8fCAob3V0Ll8ucHVzaCgoeCA9ICt2YWwseCAqIDAgPT09IDApID8geCA6IHZhbCksISF2YWwpKVxuXHRcdDogKHggPSArdmFsLHggKiAwID09PSAwKSA/IHggOiB2YWxcblx0KTtcblx0b3V0W2tleV0gPSBvbGQgPT0gbnVsbCA/IG54dCA6IChBcnJheS5pc0FycmF5KG9sZCkgPyBvbGQuY29uY2F0KG54dCkgOiBbb2xkLCBueHRdKTtcbn1cblxuZnVuY3Rpb24gbXJpMiAoYXJncywgb3B0cykge1xuXHRhcmdzID0gYXJncyB8fCBbXTtcblx0b3B0cyA9IG9wdHMgfHwge307XG5cblx0dmFyIGssIGFyciwgYXJnLCBuYW1lLCB2YWwsIG91dD17IF86W10gfTtcblx0dmFyIGk9MCwgaj0wLCBpZHg9MCwgbGVuPWFyZ3MubGVuZ3RoO1xuXG5cdGNvbnN0IGFsaWJpID0gb3B0cy5hbGlhcyAhPT0gdm9pZCAwO1xuXHRjb25zdCBzdHJpY3QgPSBvcHRzLnVua25vd24gIT09IHZvaWQgMDtcblx0Y29uc3QgZGVmYXVsdHMgPSBvcHRzLmRlZmF1bHQgIT09IHZvaWQgMDtcblxuXHRvcHRzLmFsaWFzID0gb3B0cy5hbGlhcyB8fCB7fTtcblx0b3B0cy5zdHJpbmcgPSB0b0FycihvcHRzLnN0cmluZyk7XG5cdG9wdHMuYm9vbGVhbiA9IHRvQXJyKG9wdHMuYm9vbGVhbik7XG5cblx0aWYgKGFsaWJpKSB7XG5cdFx0Zm9yIChrIGluIG9wdHMuYWxpYXMpIHtcblx0XHRcdGFyciA9IG9wdHMuYWxpYXNba10gPSB0b0FycihvcHRzLmFsaWFzW2tdKTtcblx0XHRcdGZvciAoaT0wOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdChvcHRzLmFsaWFzW2FycltpXV0gPSBhcnIuY29uY2F0KGspKS5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Zm9yIChpPW9wdHMuYm9vbGVhbi5sZW5ndGg7IGktLSA+IDA7KSB7XG5cdFx0YXJyID0gb3B0cy5hbGlhc1tvcHRzLmJvb2xlYW5baV1dIHx8IFtdO1xuXHRcdGZvciAoaj1hcnIubGVuZ3RoOyBqLS0gPiAwOykgb3B0cy5ib29sZWFuLnB1c2goYXJyW2pdKTtcblx0fVxuXG5cdGZvciAoaT1vcHRzLnN0cmluZy5sZW5ndGg7IGktLSA+IDA7KSB7XG5cdFx0YXJyID0gb3B0cy5hbGlhc1tvcHRzLnN0cmluZ1tpXV0gfHwgW107XG5cdFx0Zm9yIChqPWFyci5sZW5ndGg7IGotLSA+IDA7KSBvcHRzLnN0cmluZy5wdXNoKGFycltqXSk7XG5cdH1cblxuXHRpZiAoZGVmYXVsdHMpIHtcblx0XHRmb3IgKGsgaW4gb3B0cy5kZWZhdWx0KSB7XG5cdFx0XHRuYW1lID0gdHlwZW9mIG9wdHMuZGVmYXVsdFtrXTtcblx0XHRcdGFyciA9IG9wdHMuYWxpYXNba10gPSBvcHRzLmFsaWFzW2tdIHx8IFtdO1xuXHRcdFx0aWYgKG9wdHNbbmFtZV0gIT09IHZvaWQgMCkge1xuXHRcdFx0XHRvcHRzW25hbWVdLnB1c2goayk7XG5cdFx0XHRcdGZvciAoaT0wOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0b3B0c1tuYW1lXS5wdXNoKGFycltpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjb25zdCBrZXlzID0gc3RyaWN0ID8gT2JqZWN0LmtleXMob3B0cy5hbGlhcykgOiBbXTtcblxuXHRmb3IgKGk9MDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0YXJnID0gYXJnc1tpXTtcblxuXHRcdGlmIChhcmcgPT09ICctLScpIHtcblx0XHRcdG91dC5fID0gb3V0Ll8uY29uY2F0KGFyZ3Muc2xpY2UoKytpKSk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRmb3IgKGo9MDsgaiA8IGFyZy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKGFyZy5jaGFyQ29kZUF0KGopICE9PSA0NSkgYnJlYWs7IC8vIFwiLVwiXG5cdFx0fVxuXG5cdFx0aWYgKGogPT09IDApIHtcblx0XHRcdG91dC5fLnB1c2goYXJnKTtcblx0XHR9IGVsc2UgaWYgKGFyZy5zdWJzdHJpbmcoaiwgaiArIDMpID09PSAnbm8tJykge1xuXHRcdFx0bmFtZSA9IGFyZy5zdWJzdHJpbmcoaiArIDMpO1xuXHRcdFx0aWYgKHN0cmljdCAmJiAhfmtleXMuaW5kZXhPZihuYW1lKSkge1xuXHRcdFx0XHRyZXR1cm4gb3B0cy51bmtub3duKGFyZyk7XG5cdFx0XHR9XG5cdFx0XHRvdXRbbmFtZV0gPSBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yIChpZHg9aisxOyBpZHggPCBhcmcubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0XHRpZiAoYXJnLmNoYXJDb2RlQXQoaWR4KSA9PT0gNjEpIGJyZWFrOyAvLyBcIj1cIlxuXHRcdFx0fVxuXG5cdFx0XHRuYW1lID0gYXJnLnN1YnN0cmluZyhqLCBpZHgpO1xuXHRcdFx0dmFsID0gYXJnLnN1YnN0cmluZygrK2lkeCkgfHwgKGkrMSA9PT0gbGVuIHx8ICgnJythcmdzW2krMV0pLmNoYXJDb2RlQXQoMCkgPT09IDQ1IHx8IGFyZ3NbKytpXSk7XG5cdFx0XHRhcnIgPSAoaiA9PT0gMiA/IFtuYW1lXSA6IG5hbWUpO1xuXG5cdFx0XHRmb3IgKGlkeD0wOyBpZHggPCBhcnIubGVuZ3RoOyBpZHgrKykge1xuXHRcdFx0XHRuYW1lID0gYXJyW2lkeF07XG5cdFx0XHRcdGlmIChzdHJpY3QgJiYgIX5rZXlzLmluZGV4T2YobmFtZSkpIHJldHVybiBvcHRzLnVua25vd24oJy0nLnJlcGVhdChqKSArIG5hbWUpO1xuXHRcdFx0XHR0b1ZhbChvdXQsIG5hbWUsIChpZHggKyAxIDwgYXJyLmxlbmd0aCkgfHwgdmFsLCBvcHRzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoZGVmYXVsdHMpIHtcblx0XHRmb3IgKGsgaW4gb3B0cy5kZWZhdWx0KSB7XG5cdFx0XHRpZiAob3V0W2tdID09PSB2b2lkIDApIHtcblx0XHRcdFx0b3V0W2tdID0gb3B0cy5kZWZhdWx0W2tdO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmIChhbGliaSkge1xuXHRcdGZvciAoayBpbiBvdXQpIHtcblx0XHRcdGFyciA9IG9wdHMuYWxpYXNba10gfHwgW107XG5cdFx0XHR3aGlsZSAoYXJyLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0b3V0W2Fyci5zaGlmdCgpXSA9IG91dFtrXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3V0O1xufVxuXG5jb25zdCByZW1vdmVCcmFja2V0cyA9ICh2KSA9PiB2LnJlcGxhY2UoL1s8W10uKy8sIFwiXCIpLnRyaW0oKTtcbmNvbnN0IGZpbmRBbGxCcmFja2V0cyA9ICh2KSA9PiB7XG4gIGNvbnN0IEFOR0xFRF9CUkFDS0VUX1JFX0dMT0JBTCA9IC88KFtePl0rKT4vZztcbiAgY29uc3QgU1FVQVJFX0JSQUNLRVRfUkVfR0xPQkFMID0gL1xcWyhbXlxcXV0rKVxcXS9nO1xuICBjb25zdCByZXMgPSBbXTtcbiAgY29uc3QgcGFyc2UgPSAobWF0Y2gpID0+IHtcbiAgICBsZXQgdmFyaWFkaWMgPSBmYWxzZTtcbiAgICBsZXQgdmFsdWUgPSBtYXRjaFsxXTtcbiAgICBpZiAodmFsdWUuc3RhcnRzV2l0aChcIi4uLlwiKSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgzKTtcbiAgICAgIHZhcmlhZGljID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVpcmVkOiBtYXRjaFswXS5zdGFydHNXaXRoKFwiPFwiKSxcbiAgICAgIHZhbHVlLFxuICAgICAgdmFyaWFkaWNcbiAgICB9O1xuICB9O1xuICBsZXQgYW5nbGVkTWF0Y2g7XG4gIHdoaWxlIChhbmdsZWRNYXRjaCA9IEFOR0xFRF9CUkFDS0VUX1JFX0dMT0JBTC5leGVjKHYpKSB7XG4gICAgcmVzLnB1c2gocGFyc2UoYW5nbGVkTWF0Y2gpKTtcbiAgfVxuICBsZXQgc3F1YXJlTWF0Y2g7XG4gIHdoaWxlIChzcXVhcmVNYXRjaCA9IFNRVUFSRV9CUkFDS0VUX1JFX0dMT0JBTC5leGVjKHYpKSB7XG4gICAgcmVzLnB1c2gocGFyc2Uoc3F1YXJlTWF0Y2gpKTtcbiAgfVxuICByZXR1cm4gcmVzO1xufTtcbmNvbnN0IGdldE1yaU9wdGlvbnMgPSAob3B0aW9ucykgPT4ge1xuICBjb25zdCByZXN1bHQgPSB7YWxpYXM6IHt9LCBib29sZWFuOiBbXX07XG4gIGZvciAoY29uc3QgW2luZGV4LCBvcHRpb25dIG9mIG9wdGlvbnMuZW50cmllcygpKSB7XG4gICAgaWYgKG9wdGlvbi5uYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICByZXN1bHQuYWxpYXNbb3B0aW9uLm5hbWVzWzBdXSA9IG9wdGlvbi5uYW1lcy5zbGljZSgxKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbi5pc0Jvb2xlYW4pIHtcbiAgICAgIGlmIChvcHRpb24ubmVnYXRlZCkge1xuICAgICAgICBjb25zdCBoYXNTdHJpbmdUeXBlT3B0aW9uID0gb3B0aW9ucy5zb21lKChvLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGkgIT09IGluZGV4ICYmIG8ubmFtZXMuc29tZSgobmFtZSkgPT4gb3B0aW9uLm5hbWVzLmluY2x1ZGVzKG5hbWUpKSAmJiB0eXBlb2Ygby5yZXF1aXJlZCA9PT0gXCJib29sZWFuXCI7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWhhc1N0cmluZ1R5cGVPcHRpb24pIHtcbiAgICAgICAgICByZXN1bHQuYm9vbGVhbi5wdXNoKG9wdGlvbi5uYW1lc1swXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5ib29sZWFuLnB1c2gob3B0aW9uLm5hbWVzWzBdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5jb25zdCBmaW5kTG9uZ2VzdCA9IChhcnIpID0+IHtcbiAgcmV0dXJuIGFyci5zb3J0KChhLCBiKSA9PiB7XG4gICAgcmV0dXJuIGEubGVuZ3RoID4gYi5sZW5ndGggPyAtMSA6IDE7XG4gIH0pWzBdO1xufTtcbmNvbnN0IHBhZFJpZ2h0ID0gKHN0ciwgbGVuZ3RoKSA9PiB7XG4gIHJldHVybiBzdHIubGVuZ3RoID49IGxlbmd0aCA/IHN0ciA6IGAke3N0cn0ke1wiIFwiLnJlcGVhdChsZW5ndGggLSBzdHIubGVuZ3RoKX1gO1xufTtcbmNvbnN0IGNhbWVsY2FzZSA9IChpbnB1dCkgPT4ge1xuICByZXR1cm4gaW5wdXQucmVwbGFjZSgvKFthLXpdKS0oW2Etel0pL2csIChfLCBwMSwgcDIpID0+IHtcbiAgICByZXR1cm4gcDEgKyBwMi50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn07XG5jb25zdCBzZXREb3RQcm9wID0gKG9iaiwga2V5cywgdmFsKSA9PiB7XG4gIGxldCBpID0gMDtcbiAgbGV0IGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICBsZXQgdCA9IG9iajtcbiAgbGV0IHg7XG4gIGZvciAoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB4ID0gdFtrZXlzW2ldXTtcbiAgICB0ID0gdFtrZXlzW2ldXSA9IGkgPT09IGxlbmd0aCAtIDEgPyB2YWwgOiB4ICE9IG51bGwgPyB4IDogISF+a2V5c1tpICsgMV0uaW5kZXhPZihcIi5cIikgfHwgISgra2V5c1tpICsgMV0gPiAtMSkgPyB7fSA6IFtdO1xuICB9XG59O1xuY29uc3Qgc2V0QnlUeXBlID0gKG9iaiwgdHJhbnNmb3JtcykgPT4ge1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0cmFuc2Zvcm1zKSkge1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IHRyYW5zZm9ybXNba2V5XTtcbiAgICBpZiAodHJhbnNmb3JtLnNob3VsZFRyYW5zZm9ybSkge1xuICAgICAgb2JqW2tleV0gPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmNhbGwoW10sIG9ialtrZXldKTtcbiAgICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtLnRyYW5zZm9ybUZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgb2JqW2tleV0gPSBvYmpba2V5XS5tYXAodHJhbnNmb3JtLnRyYW5zZm9ybUZ1bmN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5jb25zdCBnZXRGaWxlTmFtZSA9IChpbnB1dCkgPT4ge1xuICBjb25zdCBtID0gLyhbXlxcXFxcXC9dKykkLy5leGVjKGlucHV0KTtcbiAgcmV0dXJuIG0gPyBtWzFdIDogXCJcIjtcbn07XG5jb25zdCBjYW1lbGNhc2VPcHRpb25OYW1lID0gKG5hbWUpID0+IHtcbiAgcmV0dXJuIG5hbWUuc3BsaXQoXCIuXCIpLm1hcCgodiwgaSkgPT4ge1xuICAgIHJldHVybiBpID09PSAwID8gY2FtZWxjYXNlKHYpIDogdjtcbiAgfSkuam9pbihcIi5cIik7XG59O1xuY2xhc3MgQ0FDRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFjayA9IG5ldyBFcnJvcihtZXNzYWdlKS5zdGFjaztcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgT3B0aW9uIHtcbiAgY29uc3RydWN0b3IocmF3TmFtZSwgZGVzY3JpcHRpb24sIGNvbmZpZykge1xuICAgIHRoaXMucmF3TmFtZSA9IHJhd05hbWU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgY29uZmlnKTtcbiAgICByYXdOYW1lID0gcmF3TmFtZS5yZXBsYWNlKC9cXC5cXCovZywgXCJcIik7XG4gICAgdGhpcy5uZWdhdGVkID0gZmFsc2U7XG4gICAgdGhpcy5uYW1lcyA9IHJlbW92ZUJyYWNrZXRzKHJhd05hbWUpLnNwbGl0KFwiLFwiKS5tYXAoKHYpID0+IHtcbiAgICAgIGxldCBuYW1lID0gdi50cmltKCkucmVwbGFjZSgvXi17MSwyfS8sIFwiXCIpO1xuICAgICAgaWYgKG5hbWUuc3RhcnRzV2l0aChcIm5vLVwiKSkge1xuICAgICAgICB0aGlzLm5lZ2F0ZWQgPSB0cnVlO1xuICAgICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9ebm8tLywgXCJcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FtZWxjYXNlT3B0aW9uTmFtZShuYW1lKTtcbiAgICB9KS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoID8gMSA6IC0xKTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm5hbWVzW3RoaXMubmFtZXMubGVuZ3RoIC0gMV07XG4gICAgaWYgKHRoaXMubmVnYXRlZCAmJiB0aGlzLmNvbmZpZy5kZWZhdWx0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuY29uZmlnLmRlZmF1bHQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAocmF3TmFtZS5pbmNsdWRlcyhcIjxcIikpIHtcbiAgICAgIHRoaXMucmVxdWlyZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAocmF3TmFtZS5pbmNsdWRlcyhcIltcIikpIHtcbiAgICAgIHRoaXMucmVxdWlyZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pc0Jvb2xlYW4gPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBwcm9jZXNzQXJncyA9IHByb2Nlc3MuYXJndjtcbmNvbnN0IHBsYXRmb3JtSW5mbyA9IGAke3Byb2Nlc3MucGxhdGZvcm19LSR7cHJvY2Vzcy5hcmNofSBub2RlLSR7cHJvY2Vzcy52ZXJzaW9ufWA7XG5cbmNsYXNzIENvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihyYXdOYW1lLCBkZXNjcmlwdGlvbiwgY29uZmlnID0ge30sIGNsaSkge1xuICAgIHRoaXMucmF3TmFtZSA9IHJhd05hbWU7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY2xpID0gY2xpO1xuICAgIHRoaXMub3B0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWxpYXNOYW1lcyA9IFtdO1xuICAgIHRoaXMubmFtZSA9IHJlbW92ZUJyYWNrZXRzKHJhd05hbWUpO1xuICAgIHRoaXMuYXJncyA9IGZpbmRBbGxCcmFja2V0cyhyYXdOYW1lKTtcbiAgICB0aGlzLmV4YW1wbGVzID0gW107XG4gIH1cbiAgdXNhZ2UodGV4dCkge1xuICAgIHRoaXMudXNhZ2VUZXh0ID0gdGV4dDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBhbGxvd1Vua25vd25PcHRpb25zKCkge1xuICAgIHRoaXMuY29uZmlnLmFsbG93VW5rbm93bk9wdGlvbnMgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGlnbm9yZU9wdGlvbkRlZmF1bHRWYWx1ZSgpIHtcbiAgICB0aGlzLmNvbmZpZy5pZ25vcmVPcHRpb25EZWZhdWx0VmFsdWUgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZlcnNpb24odmVyc2lvbiwgY3VzdG9tRmxhZ3MgPSBcIi12LCAtLXZlcnNpb25cIikge1xuICAgIHRoaXMudmVyc2lvbk51bWJlciA9IHZlcnNpb247XG4gICAgdGhpcy5vcHRpb24oY3VzdG9tRmxhZ3MsIFwiRGlzcGxheSB2ZXJzaW9uIG51bWJlclwiKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBleGFtcGxlKGV4YW1wbGUpIHtcbiAgICB0aGlzLmV4YW1wbGVzLnB1c2goZXhhbXBsZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgb3B0aW9uKHJhd05hbWUsIGRlc2NyaXB0aW9uLCBjb25maWcpIHtcbiAgICBjb25zdCBvcHRpb24gPSBuZXcgT3B0aW9uKHJhd05hbWUsIGRlc2NyaXB0aW9uLCBjb25maWcpO1xuICAgIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgYWxpYXMobmFtZSkge1xuICAgIHRoaXMuYWxpYXNOYW1lcy5wdXNoKG5hbWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGFjdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMuY29tbWFuZEFjdGlvbiA9IGNhbGxiYWNrO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGlzTWF0Y2hlZChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9PT0gbmFtZSB8fCB0aGlzLmFsaWFzTmFtZXMuaW5jbHVkZXMobmFtZSk7XG4gIH1cbiAgZ2V0IGlzRGVmYXVsdENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZSA9PT0gXCJcIiB8fCB0aGlzLmFsaWFzTmFtZXMuaW5jbHVkZXMoXCIhXCIpO1xuICB9XG4gIGdldCBpc0dsb2JhbENvbW1hbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBHbG9iYWxDb21tYW5kO1xuICB9XG4gIGhhc09wdGlvbihuYW1lKSB7XG4gICAgbmFtZSA9IG5hbWUuc3BsaXQoXCIuXCIpWzBdO1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZCgob3B0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gb3B0aW9uLm5hbWVzLmluY2x1ZGVzKG5hbWUpO1xuICAgIH0pO1xuICB9XG4gIG91dHB1dEhlbHAoKSB7XG4gICAgY29uc3Qge25hbWUsIGNvbW1hbmRzfSA9IHRoaXMuY2xpO1xuICAgIGNvbnN0IHtcbiAgICAgIHZlcnNpb25OdW1iZXIsXG4gICAgICBvcHRpb25zOiBnbG9iYWxPcHRpb25zLFxuICAgICAgaGVscENhbGxiYWNrXG4gICAgfSA9IHRoaXMuY2xpLmdsb2JhbENvbW1hbmQ7XG4gICAgbGV0IHNlY3Rpb25zID0gW1xuICAgICAge1xuICAgICAgICBib2R5OiBgJHtuYW1lfSR7dmVyc2lvbk51bWJlciA/IGAvJHt2ZXJzaW9uTnVtYmVyfWAgOiBcIlwifWBcbiAgICAgIH1cbiAgICBdO1xuICAgIHNlY3Rpb25zLnB1c2goe1xuICAgICAgdGl0bGU6IFwiVXNhZ2VcIixcbiAgICAgIGJvZHk6IGAgICQgJHtuYW1lfSAke3RoaXMudXNhZ2VUZXh0IHx8IHRoaXMucmF3TmFtZX1gXG4gICAgfSk7XG4gICAgY29uc3Qgc2hvd0NvbW1hbmRzID0gKHRoaXMuaXNHbG9iYWxDb21tYW5kIHx8IHRoaXMuaXNEZWZhdWx0Q29tbWFuZCkgJiYgY29tbWFuZHMubGVuZ3RoID4gMDtcbiAgICBpZiAoc2hvd0NvbW1hbmRzKSB7XG4gICAgICBjb25zdCBsb25nZXN0Q29tbWFuZE5hbWUgPSBmaW5kTG9uZ2VzdChjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+IGNvbW1hbmQucmF3TmFtZSkpO1xuICAgICAgc2VjdGlvbnMucHVzaCh7XG4gICAgICAgIHRpdGxlOiBcIkNvbW1hbmRzXCIsXG4gICAgICAgIGJvZHk6IGNvbW1hbmRzLm1hcCgoY29tbWFuZCkgPT4ge1xuICAgICAgICAgIHJldHVybiBgICAke3BhZFJpZ2h0KGNvbW1hbmQucmF3TmFtZSwgbG9uZ2VzdENvbW1hbmROYW1lLmxlbmd0aCl9ICAke2NvbW1hbmQuZGVzY3JpcHRpb259YDtcbiAgICAgICAgfSkuam9pbihcIlxcblwiKVxuICAgICAgfSk7XG4gICAgICBzZWN0aW9ucy5wdXNoKHtcbiAgICAgICAgdGl0bGU6IGBGb3IgbW9yZSBpbmZvLCBydW4gYW55IGNvbW1hbmQgd2l0aCB0aGUgXFxgLS1oZWxwXFxgIGZsYWdgLFxuICAgICAgICBib2R5OiBjb21tYW5kcy5tYXAoKGNvbW1hbmQpID0+IGAgICQgJHtuYW1lfSR7Y29tbWFuZC5uYW1lID09PSBcIlwiID8gXCJcIiA6IGAgJHtjb21tYW5kLm5hbWV9YH0gLS1oZWxwYCkuam9pbihcIlxcblwiKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBvcHRpb25zID0gdGhpcy5pc0dsb2JhbENvbW1hbmQgPyBnbG9iYWxPcHRpb25zIDogWy4uLnRoaXMub3B0aW9ucywgLi4uZ2xvYmFsT3B0aW9ucyB8fCBbXV07XG4gICAgaWYgKCF0aGlzLmlzR2xvYmFsQ29tbWFuZCAmJiAhdGhpcy5pc0RlZmF1bHRDb21tYW5kKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucy5maWx0ZXIoKG9wdGlvbikgPT4gb3B0aW9uLm5hbWUgIT09IFwidmVyc2lvblwiKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbG9uZ2VzdE9wdGlvbk5hbWUgPSBmaW5kTG9uZ2VzdChvcHRpb25zLm1hcCgob3B0aW9uKSA9PiBvcHRpb24ucmF3TmFtZSkpO1xuICAgICAgc2VjdGlvbnMucHVzaCh7XG4gICAgICAgIHRpdGxlOiBcIk9wdGlvbnNcIixcbiAgICAgICAgYm9keTogb3B0aW9ucy5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiBgICAke3BhZFJpZ2h0KG9wdGlvbi5yYXdOYW1lLCBsb25nZXN0T3B0aW9uTmFtZS5sZW5ndGgpfSAgJHtvcHRpb24uZGVzY3JpcHRpb259ICR7b3B0aW9uLmNvbmZpZy5kZWZhdWx0ID09PSB2b2lkIDAgPyBcIlwiIDogYChkZWZhdWx0OiAke29wdGlvbi5jb25maWcuZGVmYXVsdH0pYH1gO1xuICAgICAgICB9KS5qb2luKFwiXFxuXCIpXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXhhbXBsZXMubGVuZ3RoID4gMCkge1xuICAgICAgc2VjdGlvbnMucHVzaCh7XG4gICAgICAgIHRpdGxlOiBcIkV4YW1wbGVzXCIsXG4gICAgICAgIGJvZHk6IHRoaXMuZXhhbXBsZXMubWFwKChleGFtcGxlKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleGFtcGxlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBleGFtcGxlKG5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXhhbXBsZTtcbiAgICAgICAgfSkuam9pbihcIlxcblwiKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChoZWxwQ2FsbGJhY2spIHtcbiAgICAgIHNlY3Rpb25zID0gaGVscENhbGxiYWNrKHNlY3Rpb25zKSB8fCBzZWN0aW9ucztcbiAgICB9XG4gICAgY29uc29sZS5sb2coc2VjdGlvbnMubWFwKChzZWN0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gc2VjdGlvbi50aXRsZSA/IGAke3NlY3Rpb24udGl0bGV9OlxuJHtzZWN0aW9uLmJvZHl9YCA6IHNlY3Rpb24uYm9keTtcbiAgICB9KS5qb2luKFwiXFxuXFxuXCIpKTtcbiAgfVxuICBvdXRwdXRWZXJzaW9uKCkge1xuICAgIGNvbnN0IHtuYW1lfSA9IHRoaXMuY2xpO1xuICAgIGNvbnN0IHt2ZXJzaW9uTnVtYmVyfSA9IHRoaXMuY2xpLmdsb2JhbENvbW1hbmQ7XG4gICAgaWYgKHZlcnNpb25OdW1iZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9LyR7dmVyc2lvbk51bWJlcn0gJHtwbGF0Zm9ybUluZm99YCk7XG4gICAgfVxuICB9XG4gIGNoZWNrUmVxdWlyZWRBcmdzKCkge1xuICAgIGNvbnN0IG1pbmltYWxBcmdzQ291bnQgPSB0aGlzLmFyZ3MuZmlsdGVyKChhcmcpID0+IGFyZy5yZXF1aXJlZCkubGVuZ3RoO1xuICAgIGlmICh0aGlzLmNsaS5hcmdzLmxlbmd0aCA8IG1pbmltYWxBcmdzQ291bnQpIHtcbiAgICAgIHRocm93IG5ldyBDQUNFcnJvcihgbWlzc2luZyByZXF1aXJlZCBhcmdzIGZvciBjb21tYW5kIFxcYCR7dGhpcy5yYXdOYW1lfVxcYGApO1xuICAgIH1cbiAgfVxuICBjaGVja1Vua25vd25PcHRpb25zKCkge1xuICAgIGNvbnN0IHtvcHRpb25zLCBnbG9iYWxDb21tYW5kfSA9IHRoaXMuY2xpO1xuICAgIGlmICghdGhpcy5jb25maWcuYWxsb3dVbmtub3duT3B0aW9ucykge1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5rZXlzKG9wdGlvbnMpKSB7XG4gICAgICAgIGlmIChuYW1lICE9PSBcIi0tXCIgJiYgIXRoaXMuaGFzT3B0aW9uKG5hbWUpICYmICFnbG9iYWxDb21tYW5kLmhhc09wdGlvbihuYW1lKSkge1xuICAgICAgICAgIHRocm93IG5ldyBDQUNFcnJvcihgVW5rbm93biBvcHRpb24gXFxgJHtuYW1lLmxlbmd0aCA+IDEgPyBgLS0ke25hbWV9YCA6IGAtJHtuYW1lfWB9XFxgYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY2hlY2tPcHRpb25WYWx1ZSgpIHtcbiAgICBjb25zdCB7b3B0aW9uczogcGFyc2VkT3B0aW9ucywgZ2xvYmFsQ29tbWFuZH0gPSB0aGlzLmNsaTtcbiAgICBjb25zdCBvcHRpb25zID0gWy4uLmdsb2JhbENvbW1hbmQub3B0aW9ucywgLi4udGhpcy5vcHRpb25zXTtcbiAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlZE9wdGlvbnNbb3B0aW9uLm5hbWUuc3BsaXQoXCIuXCIpWzBdXTtcbiAgICAgIGlmIChvcHRpb24ucmVxdWlyZWQpIHtcbiAgICAgICAgY29uc3QgaGFzTmVnYXRlZCA9IG9wdGlvbnMuc29tZSgobykgPT4gby5uZWdhdGVkICYmIG8ubmFtZXMuaW5jbHVkZXMob3B0aW9uLm5hbWUpKTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZSAmJiAhaGFzTmVnYXRlZCkge1xuICAgICAgICAgIHRocm93IG5ldyBDQUNFcnJvcihgb3B0aW9uIFxcYCR7b3B0aW9uLnJhd05hbWV9XFxgIHZhbHVlIGlzIG1pc3NpbmdgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuY2xhc3MgR2xvYmFsQ29tbWFuZCBleHRlbmRzIENvbW1hbmQge1xuICBjb25zdHJ1Y3RvcihjbGkpIHtcbiAgICBzdXBlcihcIkBAZ2xvYmFsQEBcIiwgXCJcIiwge30sIGNsaSk7XG4gIH1cbn1cblxudmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbmNsYXNzIENBQyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUgPSBcIlwiKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuY29tbWFuZHMgPSBbXTtcbiAgICB0aGlzLnJhd0FyZ3MgPSBbXTtcbiAgICB0aGlzLmFyZ3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmdsb2JhbENvbW1hbmQgPSBuZXcgR2xvYmFsQ29tbWFuZCh0aGlzKTtcbiAgICB0aGlzLmdsb2JhbENvbW1hbmQudXNhZ2UoXCI8Y29tbWFuZD4gW29wdGlvbnNdXCIpO1xuICB9XG4gIHVzYWdlKHRleHQpIHtcbiAgICB0aGlzLmdsb2JhbENvbW1hbmQudXNhZ2UodGV4dCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgY29tbWFuZChyYXdOYW1lLCBkZXNjcmlwdGlvbiwgY29uZmlnKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IG5ldyBDb21tYW5kKHJhd05hbWUsIGRlc2NyaXB0aW9uIHx8IFwiXCIsIGNvbmZpZywgdGhpcyk7XG4gICAgY29tbWFuZC5nbG9iYWxDb21tYW5kID0gdGhpcy5nbG9iYWxDb21tYW5kO1xuICAgIHRoaXMuY29tbWFuZHMucHVzaChjb21tYW5kKTtcbiAgICByZXR1cm4gY29tbWFuZDtcbiAgfVxuICBvcHRpb24ocmF3TmFtZSwgZGVzY3JpcHRpb24sIGNvbmZpZykge1xuICAgIHRoaXMuZ2xvYmFsQ29tbWFuZC5vcHRpb24ocmF3TmFtZSwgZGVzY3JpcHRpb24sIGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgaGVscChjYWxsYmFjaykge1xuICAgIHRoaXMuZ2xvYmFsQ29tbWFuZC5vcHRpb24oXCItaCwgLS1oZWxwXCIsIFwiRGlzcGxheSB0aGlzIG1lc3NhZ2VcIik7XG4gICAgdGhpcy5nbG9iYWxDb21tYW5kLmhlbHBDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuc2hvd0hlbHBPbkV4aXQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZlcnNpb24odmVyc2lvbiwgY3VzdG9tRmxhZ3MgPSBcIi12LCAtLXZlcnNpb25cIikge1xuICAgIHRoaXMuZ2xvYmFsQ29tbWFuZC52ZXJzaW9uKHZlcnNpb24sIGN1c3RvbUZsYWdzKTtcbiAgICB0aGlzLnNob3dWZXJzaW9uT25FeGl0ID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBleGFtcGxlKGV4YW1wbGUpIHtcbiAgICB0aGlzLmdsb2JhbENvbW1hbmQuZXhhbXBsZShleGFtcGxlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBvdXRwdXRIZWxwKCkge1xuICAgIGlmICh0aGlzLm1hdGNoZWRDb21tYW5kKSB7XG4gICAgICB0aGlzLm1hdGNoZWRDb21tYW5kLm91dHB1dEhlbHAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nbG9iYWxDb21tYW5kLm91dHB1dEhlbHAoKTtcbiAgICB9XG4gIH1cbiAgb3V0cHV0VmVyc2lvbigpIHtcbiAgICB0aGlzLmdsb2JhbENvbW1hbmQub3V0cHV0VmVyc2lvbigpO1xuICB9XG4gIHNldFBhcnNlZEluZm8oe2FyZ3MsIG9wdGlvbnN9LCBtYXRjaGVkQ29tbWFuZCwgbWF0Y2hlZENvbW1hbmROYW1lKSB7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGlmIChtYXRjaGVkQ29tbWFuZCkge1xuICAgICAgdGhpcy5tYXRjaGVkQ29tbWFuZCA9IG1hdGNoZWRDb21tYW5kO1xuICAgIH1cbiAgICBpZiAobWF0Y2hlZENvbW1hbmROYW1lKSB7XG4gICAgICB0aGlzLm1hdGNoZWRDb21tYW5kTmFtZSA9IG1hdGNoZWRDb21tYW5kTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdW5zZXRNYXRjaGVkQ29tbWFuZCgpIHtcbiAgICB0aGlzLm1hdGNoZWRDb21tYW5kID0gdm9pZCAwO1xuICAgIHRoaXMubWF0Y2hlZENvbW1hbmROYW1lID0gdm9pZCAwO1xuICB9XG4gIHBhcnNlKGFyZ3YgPSBwcm9jZXNzQXJncywge1xuICAgIHJ1biA9IHRydWVcbiAgfSA9IHt9KSB7XG4gICAgdGhpcy5yYXdBcmdzID0gYXJndjtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gYXJndlsxXSA/IGdldEZpbGVOYW1lKGFyZ3ZbMV0pIDogXCJjbGlcIjtcbiAgICB9XG4gICAgbGV0IHNob3VsZFBhcnNlID0gdHJ1ZTtcbiAgICBmb3IgKGNvbnN0IGNvbW1hbmQgb2YgdGhpcy5jb21tYW5kcykge1xuICAgICAgY29uc3QgcGFyc2VkID0gdGhpcy5tcmkoYXJndi5zbGljZSgyKSwgY29tbWFuZCk7XG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IHBhcnNlZC5hcmdzWzBdO1xuICAgICAgaWYgKGNvbW1hbmQuaXNNYXRjaGVkKGNvbW1hbmROYW1lKSkge1xuICAgICAgICBzaG91bGRQYXJzZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBwYXJzZWRJbmZvID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHBhcnNlZCksIHtcbiAgICAgICAgICBhcmdzOiBwYXJzZWQuYXJncy5zbGljZSgxKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXRQYXJzZWRJbmZvKHBhcnNlZEluZm8sIGNvbW1hbmQsIGNvbW1hbmROYW1lKTtcbiAgICAgICAgdGhpcy5lbWl0KGBjb21tYW5kOiR7Y29tbWFuZE5hbWV9YCwgY29tbWFuZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzaG91bGRQYXJzZSkge1xuICAgICAgZm9yIChjb25zdCBjb21tYW5kIG9mIHRoaXMuY29tbWFuZHMpIHtcbiAgICAgICAgaWYgKGNvbW1hbmQubmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHNob3VsZFBhcnNlID0gZmFsc2U7XG4gICAgICAgICAgY29uc3QgcGFyc2VkID0gdGhpcy5tcmkoYXJndi5zbGljZSgyKSwgY29tbWFuZCk7XG4gICAgICAgICAgdGhpcy5zZXRQYXJzZWRJbmZvKHBhcnNlZCwgY29tbWFuZCk7XG4gICAgICAgICAgdGhpcy5lbWl0KGBjb21tYW5kOiFgLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2hvdWxkUGFyc2UpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMubXJpKGFyZ3Yuc2xpY2UoMikpO1xuICAgICAgdGhpcy5zZXRQYXJzZWRJbmZvKHBhcnNlZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGVscCAmJiB0aGlzLnNob3dIZWxwT25FeGl0KSB7XG4gICAgICB0aGlzLm91dHB1dEhlbHAoKTtcbiAgICAgIHJ1biA9IGZhbHNlO1xuICAgICAgdGhpcy51bnNldE1hdGNoZWRDb21tYW5kKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMudmVyc2lvbiAmJiB0aGlzLnNob3dWZXJzaW9uT25FeGl0ICYmIHRoaXMubWF0Y2hlZENvbW1hbmROYW1lID09IG51bGwpIHtcbiAgICAgIHRoaXMub3V0cHV0VmVyc2lvbigpO1xuICAgICAgcnVuID0gZmFsc2U7XG4gICAgICB0aGlzLnVuc2V0TWF0Y2hlZENvbW1hbmQoKTtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VkQXJndiA9IHthcmdzOiB0aGlzLmFyZ3MsIG9wdGlvbnM6IHRoaXMub3B0aW9uc307XG4gICAgaWYgKHJ1bikge1xuICAgICAgdGhpcy5ydW5NYXRjaGVkQ29tbWFuZCgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWF0Y2hlZENvbW1hbmQgJiYgdGhpcy5hcmdzWzBdKSB7XG4gICAgICB0aGlzLmVtaXQoXCJjb21tYW5kOipcIik7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWRBcmd2O1xuICB9XG4gIG1yaShhcmd2LCBjb21tYW5kKSB7XG4gICAgY29uc3QgY2xpT3B0aW9ucyA9IFtcbiAgICAgIC4uLnRoaXMuZ2xvYmFsQ29tbWFuZC5vcHRpb25zLFxuICAgICAgLi4uY29tbWFuZCA/IGNvbW1hbmQub3B0aW9ucyA6IFtdXG4gICAgXTtcbiAgICBjb25zdCBtcmlPcHRpb25zID0gZ2V0TXJpT3B0aW9ucyhjbGlPcHRpb25zKTtcbiAgICBsZXQgYXJnc0FmdGVyRG91YmxlRGFzaGVzID0gW107XG4gICAgY29uc3QgZG91YmxlRGFzaGVzSW5kZXggPSBhcmd2LmluZGV4T2YoXCItLVwiKTtcbiAgICBpZiAoZG91YmxlRGFzaGVzSW5kZXggPiAtMSkge1xuICAgICAgYXJnc0FmdGVyRG91YmxlRGFzaGVzID0gYXJndi5zbGljZShkb3VibGVEYXNoZXNJbmRleCArIDEpO1xuICAgICAgYXJndiA9IGFyZ3Yuc2xpY2UoMCwgZG91YmxlRGFzaGVzSW5kZXgpO1xuICAgIH1cbiAgICBsZXQgcGFyc2VkID0gbXJpMihhcmd2LCBtcmlPcHRpb25zKTtcbiAgICBwYXJzZWQgPSBPYmplY3Qua2V5cyhwYXJzZWQpLnJlZHVjZSgocmVzLCBuYW1lKSA9PiB7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlcyksIHtcbiAgICAgICAgW2NhbWVsY2FzZU9wdGlvbk5hbWUobmFtZSldOiBwYXJzZWRbbmFtZV1cbiAgICAgIH0pO1xuICAgIH0sIHtfOiBbXX0pO1xuICAgIGNvbnN0IGFyZ3MgPSBwYXJzZWQuXztcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgXCItLVwiOiBhcmdzQWZ0ZXJEb3VibGVEYXNoZXNcbiAgICB9O1xuICAgIGNvbnN0IGlnbm9yZURlZmF1bHQgPSBjb21tYW5kICYmIGNvbW1hbmQuY29uZmlnLmlnbm9yZU9wdGlvbkRlZmF1bHRWYWx1ZSA/IGNvbW1hbmQuY29uZmlnLmlnbm9yZU9wdGlvbkRlZmF1bHRWYWx1ZSA6IHRoaXMuZ2xvYmFsQ29tbWFuZC5jb25maWcuaWdub3JlT3B0aW9uRGVmYXVsdFZhbHVlO1xuICAgIGxldCB0cmFuc2Zvcm1zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBmb3IgKGNvbnN0IGNsaU9wdGlvbiBvZiBjbGlPcHRpb25zKSB7XG4gICAgICBpZiAoIWlnbm9yZURlZmF1bHQgJiYgY2xpT3B0aW9uLmNvbmZpZy5kZWZhdWx0ICE9PSB2b2lkIDApIHtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIGNsaU9wdGlvbi5uYW1lcykge1xuICAgICAgICAgIG9wdGlvbnNbbmFtZV0gPSBjbGlPcHRpb24uY29uZmlnLmRlZmF1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNsaU9wdGlvbi5jb25maWcudHlwZSkpIHtcbiAgICAgICAgaWYgKHRyYW5zZm9ybXNbY2xpT3B0aW9uLm5hbWVdID09PSB2b2lkIDApIHtcbiAgICAgICAgICB0cmFuc2Zvcm1zW2NsaU9wdGlvbi5uYW1lXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdHJhbnNmb3Jtc1tjbGlPcHRpb24ubmFtZV1bXCJzaG91bGRUcmFuc2Zvcm1cIl0gPSB0cnVlO1xuICAgICAgICAgIHRyYW5zZm9ybXNbY2xpT3B0aW9uLm5hbWVdW1widHJhbnNmb3JtRnVuY3Rpb25cIl0gPSBjbGlPcHRpb24uY29uZmlnLnR5cGVbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocGFyc2VkKSkge1xuICAgICAgaWYgKGtleSAhPT0gXCJfXCIpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IGtleS5zcGxpdChcIi5cIik7XG4gICAgICAgIHNldERvdFByb3Aob3B0aW9ucywga2V5cywgcGFyc2VkW2tleV0pO1xuICAgICAgICBzZXRCeVR5cGUob3B0aW9ucywgdHJhbnNmb3Jtcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBhcmdzLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG4gIH1cbiAgcnVuTWF0Y2hlZENvbW1hbmQoKSB7XG4gICAgY29uc3Qge2FyZ3MsIG9wdGlvbnMsIG1hdGNoZWRDb21tYW5kOiBjb21tYW5kfSA9IHRoaXM7XG4gICAgaWYgKCFjb21tYW5kIHx8ICFjb21tYW5kLmNvbW1hbmRBY3Rpb24pXG4gICAgICByZXR1cm47XG4gICAgY29tbWFuZC5jaGVja1Vua25vd25PcHRpb25zKCk7XG4gICAgY29tbWFuZC5jaGVja09wdGlvblZhbHVlKCk7XG4gICAgY29tbWFuZC5jaGVja1JlcXVpcmVkQXJncygpO1xuICAgIGNvbnN0IGFjdGlvbkFyZ3MgPSBbXTtcbiAgICBjb21tYW5kLmFyZ3MuZm9yRWFjaCgoYXJnLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGFyZy52YXJpYWRpYykge1xuICAgICAgICBhY3Rpb25BcmdzLnB1c2goYXJncy5zbGljZShpbmRleCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9uQXJncy5wdXNoKGFyZ3NbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhY3Rpb25BcmdzLnB1c2gob3B0aW9ucyk7XG4gICAgcmV0dXJuIGNvbW1hbmQuY29tbWFuZEFjdGlvbi5hcHBseSh0aGlzLCBhY3Rpb25BcmdzKTtcbiAgfVxufVxuXG5jb25zdCBjYWMgPSAobmFtZSA9IFwiXCIpID0+IG5ldyBDQUMobmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNhYztcbmV4cG9ydCB7IENBQywgQ29tbWFuZCwgY2FjIH07XG4iLCJpbXBvcnQgY2FjIGZyb20gJ2NhYydcbmltcG9ydCBjIGZyb20gJ3BpY29jb2xvcnMnXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSAnLi4vLi4vcGFja2FnZS5qc29uJ1xuaW1wb3J0IHR5cGUgeyBDbGlPcHRpb25zIH0gZnJvbSAnLi9jbGktYXBpJ1xuaW1wb3J0IHsgc3RhcnRWaXRlc3QgfSBmcm9tICcuL2NsaS1hcGknXG5pbXBvcnQgeyBkaXZpZGVyIH0gZnJvbSAnLi9yZXBvcnRlcnMvcmVuZGVyZXJzL3V0aWxzJ1xuXG5jb25zdCBjbGkgPSBjYWMoJ3ZpdGVzdCcpXG5cbmNsaVxuICAudmVyc2lvbih2ZXJzaW9uKVxuICAub3B0aW9uKCctciwgLS1yb290IDxwYXRoPicsICdyb290IHBhdGgnKVxuICAub3B0aW9uKCctYywgLS1jb25maWcgPHBhdGg+JywgJ3BhdGggdG8gY29uZmlnIGZpbGUnKVxuICAub3B0aW9uKCctdSwgLS11cGRhdGUnLCAndXBkYXRlIHNuYXBzaG90JylcbiAgLm9wdGlvbignLXcsIC0td2F0Y2gnLCAnd2F0Y2ggbW9kZScpXG4gIC5vcHRpb24oJy10LCAtLXRlc3ROYW1lUGF0dGVybiA8cGF0dGVybj4nLCAncnVuIHRlc3RzIHdpdGggZnVsbCBuYW1lcyBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4nKVxuICAub3B0aW9uKCctLWRpcicsICdiYXNlIGRpcmVjdG9yeSB0byBzY2FuIGZvciB0aGUgdGVzdCBmaWxlcycpXG4gIC5vcHRpb24oJy0tdWknLCAnZW5hYmxlIFVJJylcbiAgLm9wdGlvbignLS1vcGVuJywgJ29wZW4gVUkgYXV0b21hdGljYWxseSAoZGVmYXVsdDogIXByb2Nlc3MuZW52LkNJKSknKVxuICAub3B0aW9uKCctLWFwaSBbYXBpXScsICdzZXJ2ZSBBUEksIGF2YWlsYWJsZSBvcHRpb25zOiAtLWFwaS5wb3J0IDxwb3J0PiwgLS1hcGkuaG9zdCBbaG9zdF0gYW5kIC0tYXBpLnN0cmljdFBvcnQnKVxuICAub3B0aW9uKCctLXRocmVhZHMnLCAnZW5hYmxlZCB0aHJlYWRzIChkZWZhdWx0OiB0cnVlKScpXG4gIC5vcHRpb24oJy0tc2lsZW50JywgJ3NpbGVudCBjb25zb2xlIG91dHB1dCBmcm9tIHRlc3RzJylcbiAgLm9wdGlvbignLS1pc29sYXRlJywgJ2lzb2xhdGUgZW52aXJvbm1lbnQgZm9yIGVhY2ggdGVzdCBmaWxlIChkZWZhdWx0OiB0cnVlKScpXG4gIC5vcHRpb24oJy0tcmVwb3J0ZXIgPG5hbWU+JywgJ3JlcG9ydGVyJylcbiAgLm9wdGlvbignLS1vdXRwdXRGaWxlIDxmaWxlbmFtZT4nLCAnd3JpdGUgdGVzdCByZXN1bHRzIHRvIGEgZmlsZSB3aGVuIHRoZSAtLXJlcG9ydGVyPWpzb24gb3B0aW9uIGlzIGFsc28gc3BlY2lmaWVkJylcbiAgLm9wdGlvbignLS1jb3ZlcmFnZScsICd1c2UgYzggZm9yIGNvdmVyYWdlJylcbiAgLm9wdGlvbignLS1ydW4nLCAnZG8gbm90IHdhdGNoJylcbiAgLm9wdGlvbignLS1tb2RlJywgJ292ZXJyaWRlIFZpdGUgbW9kZSAoZGVmYXVsdDogdGVzdCknKVxuICAub3B0aW9uKCctLWdsb2JhbHMnLCAnaW5qZWN0IGFwaXMgZ2xvYmFsbHknKVxuICAub3B0aW9uKCctLWdsb2JhbCcsICdkZXByZWNhdGVkLCB1c2UgLS1nbG9iYWxzJylcbiAgLm9wdGlvbignLS1kb20nLCAnbW9jayBicm93c2VyIGFwaSB3aXRoIGhhcHB5LWRvbScpXG4gIC5vcHRpb24oJy0tZW52aXJvbm1lbnQgPGVudj4nLCAncnVubmVyIGVudmlyb25tZW50IChkZWZhdWx0OiBub2RlKScpXG4gIC5vcHRpb24oJy0tcGFzc1dpdGhOb1Rlc3RzJywgJ3Bhc3Mgd2hlbiBubyB0ZXN0cyBmb3VuZCcpXG4gIC5vcHRpb24oJy0tYWxsb3dPbmx5JywgJ0FsbG93IHRlc3RzIGFuZCBzdWl0ZXMgdGhhdCBhcmUgbWFya2VkIGFzIG9ubHkgKGRlZmF1bHQ6ICFwcm9jZXNzLmVudi5DSSknKVxuICAuaGVscCgpXG5cbmNsaVxuICAuY29tbWFuZCgncnVuIFsuLi5maWx0ZXJzXScpXG4gIC5hY3Rpb24ocnVuKVxuXG5jbGlcbiAgLmNvbW1hbmQoJ3JlbGF0ZWQgWy4uLmZpbHRlcnNdJylcbiAgLmFjdGlvbihydW5SZWxhdGVkKVxuXG5jbGlcbiAgLmNvbW1hbmQoJ3dhdGNoIFsuLi5maWx0ZXJzXScpXG4gIC5hY3Rpb24oc3RhcnQpXG5cbmNsaVxuICAuY29tbWFuZCgnZGV2IFsuLi5maWx0ZXJzXScpXG4gIC5hY3Rpb24oc3RhcnQpXG5cbmNsaVxuICAuY29tbWFuZCgnWy4uLmZpbHRlcnNdJylcbiAgLmFjdGlvbihzdGFydClcblxuY2xpLnBhcnNlKClcblxuYXN5bmMgZnVuY3Rpb24gcnVuUmVsYXRlZChyZWxhdGVkRmlsZXM6IHN0cmluZ1tdIHwgc3RyaW5nLCBhcmd2OiBDbGlPcHRpb25zKSB7XG4gIGFyZ3YucmVsYXRlZCA9IHJlbGF0ZWRGaWxlc1xuICBhcmd2LnBhc3NXaXRoTm9UZXN0cyA/Pz0gdHJ1ZVxuICBhd2FpdCBzdGFydChbXSwgYXJndilcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuKGNsaUZpbHRlcnM6IHN0cmluZ1tdLCBvcHRpb25zOiBDbGlPcHRpb25zKSB7XG4gIG9wdGlvbnMucnVuID0gdHJ1ZVxuICBhd2FpdCBzdGFydChjbGlGaWx0ZXJzLCBvcHRpb25zKVxufVxuXG5hc3luYyBmdW5jdGlvbiBzdGFydChjbGlGaWx0ZXJzOiBzdHJpbmdbXSwgb3B0aW9uczogQ2xpT3B0aW9ucykge1xuICB0cnkge1xuICAgIGlmIChhd2FpdCBzdGFydFZpdGVzdChjbGlGaWx0ZXJzLCBvcHRpb25zKSA9PT0gZmFsc2UpXG4gICAgICBwcm9jZXNzLmV4aXQoKVxuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgcHJvY2Vzcy5leGl0Q29kZSA9IDFcbiAgICBjb25zb2xlLmVycm9yKGBcXG4ke2MucmVkKGRpdmlkZXIoYy5ib2xkKGMuaW52ZXJzZSgnIFVuaGFuZGxlZCBFcnJvciAnKSkpKX1gKVxuICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICBjb25zb2xlLmVycm9yKCdcXG5cXG4nKVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDcEIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDNUQsQ0FBQztBQUNEO0FBQ0EsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3BDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHO0FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQy9FLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxHQUFHLEdBQUc7QUFDbEMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssT0FBTyxHQUFHLEtBQUssR0FBRyxHQUFHLEtBQUssTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ3BJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUc7QUFDcEMsRUFBRSxDQUFDO0FBQ0gsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEYsQ0FBQztBQUNEO0FBQ0EsU0FBUyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtBQUMzQixDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ25CLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDbkI7QUFDQSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDMUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3RDO0FBQ0EsQ0FBQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDMUM7QUFDQSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDL0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEM7QUFDQSxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ1osRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3hCLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEQsSUFBSTtBQUNKLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRztBQUN2QyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMs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Q0FBQyxDQUFDO0FBQ1IsRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQzVILEdBQUc7QUFDSCxDQUFDLENBQUM7QUFDRixNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLEtBQUs7QUFDdkMsRUFBRSxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDN0MsSUFBSSxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxlQUFlLEVBQUU7QUFDbkMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRCxNQUFNLElBQUksT0FBTyxTQUFTLENBQUMsaUJBQWlCLEtBQUssVUFBVSxFQUFFO0FBQzdELFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENB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QUFPLEVBQUU7QUFDMUMsRUFBRSxJQUFJO0FBQ04sSUFBSSxJQUFJLE1BQU0sV0FBVyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxLQUFLO0FBQ3hELE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNkLElBQUksT0FBTyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFCLEdBQUc7QUFDSCJ9
