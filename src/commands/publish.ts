import ts from "byots";
import path from "path";
import fs from "fs-extra";
// import shell from "shelljs";
// import prompts from "prompts";
import yargs from "yargs";
import { BUILD_DIRECTORY, RUNNING_DIRECTORY } from "../helpers/constants";
import { touchDirectory } from "../helpers/directories";
import logger, { Severity } from "../helpers/logger";
import { archiveDir } from "../helpers/archive";
import getAuth from "../helpers/auth";
import fetchAPI from "../helpers/fetchAPI";

async function publish() {
  try {
    const authenticated = await getAuth();

    if (!authenticated) {
      throw new Error("You are not authenticated");
    }

    const sourceDir = path.join(RUNNING_DIRECTORY, "src");

    if (!fs.existsSync(sourceDir)) {
      throw new Error("There is not a 'src' folder on this project.");
    }

    const roarnJson = require(path.join(RUNNING_DIRECTORY, "roarn.json"));
    const { available } = await fetchAPI(
      `packages/available/${roarnJson.name}`
    );

    if (!available) {
      throw new Error(`Package "${roarnJson.name}" is not available`);
    }

    touchDirectory(BUILD_DIRECTORY);
    const destinationDir = path.join(BUILD_DIRECTORY, roarnJson.name);
    await fs.copy(sourceDir, destinationDir);
    await archiveDir(destinationDir);

    // TODO: UPLOAD NEW PACKAGE TO THE REGISTRY

    fs.rmSync(BUILD_DIRECTORY, { recursive: true });
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "publish",
  describe: "Publish a module to the registry.",
  handler: () => publish(),
});
