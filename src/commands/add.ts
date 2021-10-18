import ts from "byots";
import yargs from "yargs";

import logger, { Severity } from "../helpers/logger";
import { install } from "../helpers/packages";

async function add(argv: yargs.Arguments<{}>) {
  try {
    argv._.shift();
    const packages = argv._ as string[];

    const packagesFormatted = packages.map((p: string) => {
      const splitted = p.split("@");
      return { name: splitted[0], version: splitted[1] };
    });

    await install(packagesFormatted);
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "add",
  aliases: "install",
  describe: "Add package.",
  handler: (argv) => add(argv),
});
