import { s as semver, c as cliHydrogenPackageJson, C as Command, H as HelpfulError, a as source } from '../../Command-a8d57e22.js';
import 'prettier';
import { output } from '@shopify/cli-kit';
import 'fs';
import 'constants';
import 'stream';
import 'util';
import 'assert';
import 'path';
import 'os';
import 'events';
import 'tty';
import 'readline';
import 'buffer';
import 'child_process';
import 'string_decoder';
import 'crypto';
import 'module';
import 'vm';
import 'url';
import 'v8';
import '@oclif/core';

async function addHydrogen() {
  this.package.install("@shopify/hydrogen");
}

const HYDROGEN_MIN_VERSION = cliHydrogenPackageJson.version;
async function checkHydrogenVersion() {
  const h2Version = await this.package.hasDependency("@shopify/hydrogen");
  const normalizedVersion = h2Version ? semver.coerce(h2Version)?.version : `@shopify/hydrogen not installed`;
  const latestHydrogen = typeof h2Version === "string" && typeof normalizedVersion === "string" && semver.gte(normalizedVersion, HYDROGEN_MIN_VERSION);
  const success = h2Version === "latest" || latestHydrogen;
  const description = `Has latest hydrogen version (latest: ${HYDROGEN_MIN_VERSION} / found ${normalizedVersion})`;
  return [
    {
      id: "hydrogen-latest",
      type: "Dependencies",
      description,
      success,
      fix: addHydrogen
    }
  ];
}

const NODE_MIN_VERSION = ">=12.0.0";
async function checkNodeVersion() {
  const nodeVersion = await this.package.nodeVersion();
  const normalizedVersion = semver.coerce(nodeVersion)?.version;
  return [
    {
      id: "node-version",
      type: "Dependencies",
      description: "Has min node version",
      success: !nodeVersion || normalizedVersion !== void 0 && semver.satisfies(normalizedVersion, NODE_MIN_VERSION),
      link: "https://shopify.dev/custom-storefronts/hydrogen/support"
    }
  ];
}

async function addEslint() {
  const { fs } = this;
  await fs.write(".eslintrc.js", (await import('../../eslintrc-js-6f6a13b8.js')).default());
  this.package.install("eslint", { dev: true, version: "^7.31.0" });
  this.package.install("eslint-plugin-hydrogen", {
    dev: true,
    version: "^0.6.2"
  });
}

async function checkEslintConfig() {
  const eslintConfig = await this.workspace.loadConfig("eslint");
  const hasEslintConfig = Boolean(eslintConfig);
  const hasHydrogenConfig = hasEslintConfig && Boolean(eslintConfig.config.extends?.filter((extended) => extended.includes("plugin:hydrogen")).length);
  const hasHydrogenEslintPackage = Boolean(await this.package.hasDependency("eslint-plugin-hydrogen"));
  return [
    {
      id: "eslint-config",
      type: "Setup",
      description: "Has eslint config",
      success: hasEslintConfig,
      link: "https://shopify.dev/custom-storefronts/hydrogen/lint",
      fix: addEslint
    },
    {
      id: "eslint-config-hydrogen",
      type: "Setup",
      description: "Has hydrogen eslint config",
      success: hasHydrogenConfig && hasHydrogenEslintPackage,
      link: "https://shopify.dev/custom-storefronts/hydrogen/lint",
      fix: addEslint
    }
  ];
}

class Check extends Command {
  async run() {
    this.interface.say("Running checks...");
    let results;
    try {
      results = [
        ...await checkNodeVersion.call(this),
        ...await checkHydrogenVersion.call(this),
        ...await checkEslintConfig.call(this)
      ];
    } catch (error) {
      throw new HelpfulError({ title: "Error running checks" });
    }
    displayCheckResults.call(this, results);
    const failedChecks = results.filter(({ success }) => !success);
    if (failedChecks.length) {
      this.interface.say(`${source.red.bold(`\u2022 ${failedChecks.length} errors `)}${source.dim(`found in ${results.length} checks`)}`);
    } else {
      this.interface.say(`${source.green.bold(`\u2022 No errors `)}${source.dim(`found in ${results.length} checks`)}`);
    }
    await fixChecks.call(this, results);
    output.newline();
  }
}
Check.description = "Check a hydrogen app for common problems.";
Check.examples = [`$ shopify hydrogen check`];
Check.flags = {
  ...Command.flags
};
Check.args = [];
function displayCheckResults(allCheckResults) {
  const indent = "          ";
  const checksBySection = allCheckResults.reduce((acc, { type, ...rest }) => {
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ type, ...rest });
    return acc;
  }, {});
  [...Object.entries(checksBySection)].forEach(([section, sectionResults]) => {
    const allChecksStatusEmoji = statusEmoji(sectionResults.every(({ success }) => success));
    output.newline();
    this.interface.say(`${allChecksStatusEmoji} ${source.cyan.bold.underline(section)}`);
    output.newline();
    sectionResults.forEach(({ description, link, success, fix, id }) => {
      const docsLink = link ? source.dim(`${indent}${link}
`) : "";
      const idText = id ? source.dim(id) : "";
      const fixedText = success ? "" : statusFixable(fix);
      const lines = [[statusEmoji(success), description, idText, fixedText].join(" "), docsLink];
      this.interface.say(lines.join("\n"));
    });
  });
  output.newline();
}
async function fixChecks(results) {
  let changedFiles = /* @__PURE__ */ new Map();
  const allFixableResults = results.filter(({ fix, success }) => !success && fix !== void 0 && typeof fix === "function");
  if (allFixableResults.length === 0) {
    this.interface.say(`No fixable checks`);
    return;
  }
  output.newline();
  output.newline();
  await this.interface.say(`${allFixableResults.length} failed checks might be automatically fixable.`);
  output.newline();
  const wantsFix = await this.interface.ask(`Do you want to apply automatic fixes to ${allFixableResults.length} failed checks?`, { boolean: true, name: "fix", default: false });
  if (!wantsFix) {
    return;
  }
  for await (const { description, files } of runFixers(allFixableResults, {
    fs: this.fs,
    package: this.package,
    interface: this.interface
  })) {
    this.interface.say([statusEmoji(true), description, source.green("fixed")].join(" "));
    changedFiles = new Map([...changedFiles, ...files]);
  }
  const cleanUpPromises = Array.from(changedFiles).map(async ([path, content]) => {
    const action = await this.fs.hasFile(path) ? source.red(`{red overwrote`) : source.green(`{green wrote}`);
    await this.fs.write(path, content);
    this.interface.say(`${action}${stripPath(path)}`);
  });
  await Promise.all(cleanUpPromises);
}
async function* runFixers(allFixableResults, context) {
  for (const { fix, description } of allFixableResults) {
    try {
      await fix(context);
    } finally {
      yield { description, files: [] };
    }
  }
}
function statusEmoji(success) {
  return success ? "\u2713" : `\u2715`;
}
function statusFixable(fix) {
  return typeof fix === "function" ? source.cyan(` (fixable) `) : " ";
}
function stripPath(path) {
  return path.replace(`${process.cwd()}`, "");
}

export { Check as default };
//# sourceMappingURL=check.js.map
