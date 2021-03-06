"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHelpFlagAdditions = exports.standardizeIDFromArgv = exports.toConfiguredId = exports.toStandardizedId = exports.template = exports.loadHelpClass = void 0;
const ejs = require("ejs");
const _1 = require(".");
const module_loader_1 = require("../module-loader");
const util_1 = require("../config/util");
function extractClass(exported) {
    return exported && exported.default ? exported.default : exported;
}
async function loadHelpClass(config) {
    const pjson = config.pjson;
    const configuredClass = pjson && pjson.oclif && pjson.oclif.helpClass;
    if (configuredClass) {
        try {
            const exported = await module_loader_1.default.load(config, configuredClass);
            return extractClass(exported);
        }
        catch (error) {
            throw new Error(`Unable to load configured help class "${configuredClass}", failed with message:\n${error.message}`);
        }
    }
    return _1.Help;
}
exports.loadHelpClass = loadHelpClass;
function template(context) {
    function render(t) {
        return ejs.render(t, context);
    }
    return render;
}
exports.template = template;
function collateSpacedCmdIDFromArgs(argv, config) {
    if (argv.length === 1)
        return argv;
    const ids = (0, util_1.collectUsableIds)(config.commandIDs);
    const findId = (argv) => {
        const final = [];
        const idPresent = (id) => ids.includes(id);
        const isFlag = (s) => s.startsWith('-');
        const isArgWithValue = (s) => s.includes('=');
        const finalizeId = (s) => s ? [...final, s].join(':') : final.join(':');
        const hasSubCommandsWithArgs = () => {
            const id = finalizeId();
            if (!id)
                return false;
            // Get a list of sub commands for the current command id. A command is returned as a subcommand if the `id` starts with the current command id.
            // e.g. `foo:bar` is a subcommand of `foo`
            const subCommands = config.commands.filter(c => (c.id).startsWith(id));
            return Boolean(subCommands.find(cmd => { var _a; return cmd.strict === false || ((_a = cmd.args) === null || _a === void 0 ? void 0 : _a.length) > 0; }));
        };
        for (const arg of argv) {
            if (idPresent(finalizeId(arg)))
                final.push(arg);
            // If the parent topic has a command that expects positional arguments, then we cannot
            // assume that any subsequent string could be part of the command name
            else if (isArgWithValue(arg) || isFlag(arg) || hasSubCommandsWithArgs())
                break;
            else
                final.push(arg);
        }
        return finalizeId();
    };
    const id = findId(argv);
    if (id) {
        const argvSlice = argv.slice(id.split(':').length);
        return [id, ...argvSlice];
    }
    return argv; // ID is argv[0]
}
function toStandardizedId(commandID, config) {
    return commandID.replace(new RegExp(config.topicSeparator, 'g'), ':');
}
exports.toStandardizedId = toStandardizedId;
function toConfiguredId(commandID, config) {
    const defaultTopicSeperator = ':';
    return commandID.replace(new RegExp(defaultTopicSeperator, 'g'), config.topicSeparator || defaultTopicSeperator);
}
exports.toConfiguredId = toConfiguredId;
function standardizeIDFromArgv(argv, config) {
    if (argv.length === 0)
        return argv;
    if (config.topicSeparator === ' ')
        argv = collateSpacedCmdIDFromArgs(argv, config);
    else if (config.topicSeparator !== ':')
        argv[0] = toStandardizedId(argv[0], config);
    return argv;
}
exports.standardizeIDFromArgv = standardizeIDFromArgv;
function getHelpFlagAdditions(config) {
    var _a;
    const helpFlags = ['--help'];
    const additionalHelpFlags = (_a = config.pjson.oclif.additionalHelpFlags) !== null && _a !== void 0 ? _a : [];
    return [...new Set([...helpFlags, ...additionalHelpFlags]).values()];
}
exports.getHelpFlagAdditions = getHelpFlagAdditions;
