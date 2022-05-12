import { settings, run, flush } from '@oclif/core';
import Bugsnag from '@bugsnag/js';
import { environment, error } from '@shopify/cli-kit';

function runCLI() {
  if (environment.local.isDebug()) {
    settings.debug = true;
  } else {
    Bugsnag.start({ apiKey: "9e1e6889176fd0c795d5c659225e0fae", logger: null });
  }
  run(void 0, import.meta.url).then(flush).catch((error$1) => {
    const bugsnagHandle = async (errorToReport) => {
      if (!settings.debug) {
        await new Promise((resolve, reject) => {
          Bugsnag.notify(errorToReport, void 0, resolve);
        });
      }
      return Promise.resolve(errorToReport);
    };
    const kitMapper = error.mapper;
    const kitHandle = error.handler;
    return kitMapper(error$1).then(bugsnagHandle).then((error2) => {
      kitHandle(error2);
    });
  });
}

export { runCLI as default };
//# sourceMappingURL=index.js.map
