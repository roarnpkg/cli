import ts from "byots";
import path from "path";
import { copy, existsSync, rmSync } from "fs-extra";
import yargs from "yargs";
import { encode } from "base-64";

import { BUILD_DIRECTORY, RUNNING_DIRECTORY } from "../helpers/constants";
import { touchDirectory } from "../helpers/directories";
import logger, { Severity } from "../helpers/logger";
import { archiveDir } from "../helpers/archive";
import { signIn, signOut, upload } from "../firebase";
import getAuth from "../helpers/auth";
import fetchAPI from "../helpers/fetchAPI";
import { loadFile } from "../helpers/file";
import loadRoarnJson from "../helpers/loadRoarnJson";
import { bumpVersion } from "../helpers/bumpVersion";
import checkVersion from "../helpers/versionCheck";

interface ArgsOptions {
  bump?: boolean;
}

async function publish(argv: yargs.Arguments<ArgsOptions>) {
  await checkVersion();
  if (argv.bump) {
    await bumpVersion();
  }
  touchDirectory(BUILD_DIRECTORY);
  try {
    const authenticated = await getAuth();

    if (!authenticated) {
      throw new Error("You are not authenticated");
    }

    const roarnJson = loadRoarnJson();

    let sourceDir = path.join(RUNNING_DIRECTORY, "src");

    if (roarnJson.path) {
      sourceDir = path.join(RUNNING_DIRECTORY, roarnJson.path);
    }

    if (!existsSync(sourceDir)) {
      throw new Error(
        "There is not a 'src' folder or the provided 'path' is not on this project."
      );
    }

    let readMe = "";

    const readmePath = path.join(RUNNING_DIRECTORY, "README.md");

    if (existsSync(readmePath)) {
      readMe = encode(
        encodeURIComponent((await loadFile(readmePath)).toString())
      );
    }

    logger(`Verifying Package...`, Severity.warning);

    const { token, id } = await fetchAPI("packages/start-upload/", "POST", {
      ...roarnJson,
      readMe,
    });

    logger(`Enveloping...`, Severity.warning);
    const destinationDir = path.join(BUILD_DIRECTORY, roarnJson.name);
    await copy(sourceDir, destinationDir);
    await archiveDir(destinationDir);

    logger(`Uploading...`, Severity.warning);
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

  rmSync(BUILD_DIRECTORY, { recursive: true });
  process.exit();
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "publish",
  describe: "Publish a module to the registry.",
  handler: (argv) => publish(argv),
  builder: () =>
    yargs.option("bump", {
      alias: "b",
      boolean: true,
      describe: "Bump package version when publishing.",
    }),
});
