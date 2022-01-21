import ts from "byots";
import yargs from "yargs";
import { bumpVersion } from "../helpers/bumpVersion";
import logger, { Severity } from "../helpers/logger";

async function bump() {
  await bumpVersion();

  logger("Successfully bumped version.", Severity.success);
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "bump",
  describe: "Bump version.",
  handler: () => bump(),
});
