import { createServer } from 'vite';
import { path } from '@shopify/cli-kit';
import { Flags, Command } from '@oclif/core';

async function dev({ directory, force }) {
  const server = await createServer({
    root: directory,
    server: {
      open: true,
      force
    }
  });
  await server.listen();
  server.printUrls();
}

const _Dev = class extends Command {
  async run() {
    const { flags } = await this.parse(_Dev);
    const directory = flags.path ? path.resolve(flags.path) : process.cwd();
    await dev({ directory, ...flags });
  }
};
let Dev = _Dev;
Dev.description = "Run a Hydrogen storefront locally for development";
Dev.flags = {
  path: Flags.string({
    hidden: true,
    description: "the path to your hydrogen storefront",
    env: "SHOPIFY_FLAG_PATH"
  }),
  force: Flags.boolean({
    description: "force dependency pre-bundling.",
    env: "SHOPIFY_FLAG_DEV_FORCE"
  })
};

export { Dev as default };
//# sourceMappingURL=dev.js.map
