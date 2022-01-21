import ts from "byots";
import yargs from "yargs";

import logger, { Severity } from "../helpers/logger";
import { uninstall } from "../helpers/packages";
import checkVersion from "../helpers/versionCheck";

async function remove(argv: yargs.Arguments<{}>) {
  try {
    await checkVersion();
    argv._.shift();
    const packages = argv._ as string[];

    const packagesFormatted = packages.map((p: string) => {
      const splitted = p.split("@");
      return { name: splitted[0], version: splitted[1] };
    });

    await uninstall(packagesFormatted);
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "remove",
  aliases: "uninstall",
  describe: "Remove package.",
  handler: (argv) => remove(argv),
});
