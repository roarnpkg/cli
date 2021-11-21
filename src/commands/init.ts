import ts from "byots";
import { copy } from "fs-extra";
import prompts from "prompts";
import yargs from "yargs";
import camelize from "camelize";

import { PACKAGE_ROOT, RUNNING_DIRECTORY } from "../helpers/constants";
import logger, { Severity } from "../helpers/logger";
import { RoarnJson } from "../helpers/loadRoarnJson";
import path from "path";
import { saveFile } from "../helpers/file";
import rojoProject from "../helpers/rojoProject";
import { updateEzImport } from "../helpers/ezimport";

const camelizedBasename = camelize(path.basename(RUNNING_DIRECTORY));

const questions = [
  {
    type: "text",
    name: "packageName",
    message: `Package Name: (${camelizedBasename})`,
  },
  {
    type: "text",
    name: "packageVersion",
    message: "Version: (1.0.0)",
  },
  {
    type: "text",
    name: "packageDescription",
    message: "Description: (none)",
  },
];

async function insert(roarnJson: RoarnJson) {
  try {
    await copy(
      `${PACKAGE_ROOT}/templates/game`,
      `./${roarnJson.name === camelizedBasename ? "" : roarnJson.name}/`
    );
    saveFile(
      `./${
        roarnJson.name === camelizedBasename ? "" : roarnJson.name
      }/roarn.json`,
      JSON.stringify(roarnJson, null, "\t")
    );
    saveFile(
      `./${
        roarnJson.name === camelizedBasename ? "" : roarnJson.name
      }/default.project.json`,
      JSON.stringify({ name: roarnJson.name, ...rojoProject }, null, "\t")
    );
    await updateEzImport();
  } catch (err: any) {
    logger(err.message, Severity.error, true);
  }
}

async function init() {
  try {
    const answers = await prompts(questions);
    const RoarnJson = {
      name: answers.packageName || camelizedBasename,
      version: answers.packageVersion || "1.0.0",
      description: answers.packageDescription,
      dependencies: {},
    };
    await insert(RoarnJson);
    logger("Successfully installed!");
  } catch (err: any) {
    logger(err.message, Severity.error, true);
  }
}

export = ts.identity<yargs.CommandModule>({
  command: "init",
  describe: "Create a project from a template",
  handler: () => init(),
});
