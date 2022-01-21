// Little helper if you keep using Bonfire, and want to run your server ;)

import ts from "byots";
import yargs from "yargs";
import shell from "shelljs";
import logger, { Severity } from "../helpers/logger";

async function serve() {
  try {
    shell.exec("rojo serve");
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "serve",
  describe: "Rojo serve.",
  handler: () => serve(),
});
