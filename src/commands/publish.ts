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
import { signIn, signOut, upload } from "../firebase";
import { loadFile } from "../helpers/file";

async function publish() {
  touchDirectory(BUILD_DIRECTORY);
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

    logger("Verifying Package...", Severity.warning);
    const { token, id } = await fetchAPI(
      "packages/start-upload/",
      "POST",
      roarnJson
    );

    logger("Enveloping...", Severity.warning);
    const destinationDir = path.join(BUILD_DIRECTORY, roarnJson.name);
    await fs.copy(sourceDir, destinationDir);
    await archiveDir(destinationDir);

    logger("Uploading...", Severity.warning);
    await signIn(token);
    const zipFile = await loadFile(`${destinationDir}.zip`);

    await upload(
      `packages/${roarnJson.name}/${roarnJson.version}.zip`,
      zipFile
    );

    await fetchAPI("packages/confirm-upload/", "POST", {
      name: roarnJson.name,
      version: roarnJson.version,
      id,
    });
    await signOut();
    logger("Package successfully published!", Severity.success);
  } catch (e: any) {
    logger(e.message, Severity.error);
  }

  fs.rmSync(BUILD_DIRECTORY, { recursive: true });
  process.exit();
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "publish",
  describe: "Publish a module to the registry.",
  handler: () => publish(),
});
