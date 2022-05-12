import { build as build$1 } from 'vite';
import { ui, path } from '@shopify/cli-kit';
import { Flags, Command } from '@oclif/core';

async function build({ directory, targets, base }) {
  const commonConfig = { base, root: directory };
  const tasks = Object.entries(targets).filter(([_, value]) => value).map(([key, value]) => {
    return {
      title: `Building ${key} code`,
      task: async (_, task) => {
        process.env.WORKER = key === "worker" ? "true" : void 0;
        await build$1({
          ...commonConfig,
          build: {
            outDir: `dist/${key}`,
            ssr: typeof value === "string" ? value : void 0,
            manifest: key === "client"
          }
        });
        task.title = `Built ${key} code`;
      }
    };
  });
  const list = new ui.Listr(tasks);
  await list.run();
}

const PLATFORM_ENTRIES = {
  node: `@shopify/hydrogen/platforms/node`,
  worker: `@shopify/hydrogen/platforms/worker`
};
const _Build = class extends Command {
  async run() {
    const { flags } = await this.parse(_Build);
    const directory = flags.path ? path.resolve(flags.path) : process.cwd();
    const entry = flags.entry || PLATFORM_ENTRIES[flags.target];
    const targets = {
      client: flags.client,
      worker: flags.target === "worker" ? entry : false,
      node: flags.target === "node" ? entry : false
    };
    await build({ ...flags, directory, targets });
  }
};
let Build = _Build;
Build.description = "Builds a Hydrogen storefront for production";
Build.flags = {
  path: Flags.string({
    hidden: true,
    description: "the path to your hydrogen storefront",
    env: "SHOPIFY_FLAG_PATH"
  }),
  base: Flags.string({
    description: " the public path when served in production",
    env: "SHOPIFY_FLAG_BUILD_BASE"
  }),
  client: Flags.boolean({
    description: "build the client code",
    env: "SHOPIFY_FLAG_BUILD_CLIENT",
    allowNo: true,
    default: true
  }),
  target: Flags.string({
    char: "t",
    description: "the target platform to build for (worker or node)",
    options: ["node", "worker"],
    default: "worker",
    env: "SHOPIFY_FLAG_BUILD_TARGET"
  }),
  entry: Flags.string({
    description: "produce Server Side Rendering (SSR) build for node environments",
    env: "SHOPIFY_FLAG_BUILD_SSR_ENTRY"
  })
};

export { Build as default };
//# sourceMappingURL=build.js.map
