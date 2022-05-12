import { error, file, path, system } from '@shopify/cli-kit';
import { fileURLToPath } from 'url';
import { Flags, Command } from '@oclif/core';

async function preview({ directory, port }) {
  const config = {
    port,
    workerFile: "dist/worker/index.js",
    assetsDir: "dist/client",
    buildCommand: "yarn build",
    modules: true,
    watch: true,
    buildWatchPaths: ["./src"],
    autoReload: true
  };
  await file.write(path.resolve(directory, "mini-oxygen.config.json"), JSON.stringify(config, null, 2));
  function cleanUp(options) {
    if (options.exit) {
      file.remove(path.resolve(directory, "mini-oxygen.config.json"));
    }
  }
  process.on("SIGINT", cleanUp.bind(null, { exit: true }));
  const executable = await oxygenPreviewExecutable();
  await system.exec(executable, [], {
    env: { NODE_OPTIONS: "--experimental-vm-modules" },
    cwd: directory,
    stdout: process.stdout
  });
}
const OxygenPreviewExecutableNotFound = new error.Abort("Could not locate the executable file to run Oxygen locally.");
async function oxygenPreviewExecutable() {
  const cwd = path.dirname(fileURLToPath(import.meta.url));
  const executablePath = await path.findUp("node_modules/.bin/oxygen-preview", { type: "file", cwd });
  if (!executablePath) {
    throw OxygenPreviewExecutableNotFound;
  }
  return executablePath;
}

const _Preview = class extends Command {
  async run() {
    const { flags } = await this.parse(_Preview);
    const directory = flags.path ? path.resolve(flags.path) : process.cwd();
    const port = parseInt(flags.port, 10);
    await preview({ directory, port });
  }
};
let Preview = _Preview;
Preview.description = "Run a Hydrogen storefront locally in a worker environment";
Preview.flags = {
  path: Flags.string({
    hidden: true,
    description: "the path to your hydrogen storefront",
    env: "SHOPIFY_FLAG_PATH"
  }),
  port: Flags.string({
    char: "p",
    hidden: true,
    description: "the port to run the preview server on",
    default: "3000",
    env: "SHOPIFY_FLAG_PORT"
  })
};

export { Preview as default };
//# sourceMappingURL=preview.js.map
