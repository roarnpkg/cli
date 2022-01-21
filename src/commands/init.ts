import ts from "byots";
import { copy } from "fs-extra";
import prompts from "prompts";
import yargs from "yargs";
import camelize from "camelize";

import { PACKAGE_ROOT, RUNNING_DIRECTORY } from "../helpers/constants";
import logger, { Severity } from "../helpers/logger";
import { FireJson } from "../helpers/loadFireJson";
import path from "path";
import { saveFile } from "../helpers/file";
import rojoProject from "../helpers/rojoProject";
import { install } from "../helpers/packages";
import chalk from "chalk";

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

async function insert(fireJson: FireJson) {
  try {
    await copy(
      `${PACKAGE_ROOT}/templates/game`,
      `./${fireJson.name === camelizedBasename ? "" : fireJson.name}/`
    );
    await saveFile(
      `./${fireJson.name === camelizedBasename ? "" : fireJson.name}/fire.json`,
      JSON.stringify(fireJson, null, "\t")
    );
    await saveFile(
      `./${
        fireJson.name === camelizedBasename ? "" : fireJson.name
      }/default.project.json`,
      JSON.stringify({ name: fireJson.name, ...rojoProject }, null, "\t")
    );
    await install([{ name: "bonfire_tools" }]);
  } catch (err: any) {
    logger(err.message, Severity.error, true);
  }
}

async function init() {
  try {
    const answers = await prompts(questions);
    const loadFireJson = {
      name: answers.packageName || camelizedBasename,
      version: answers.packageVersion || "1.0.0",
      description: answers.packageDescription,
      dependencies: {},
    };
    await insert(loadFireJson);
    logger("Successfully initialized!");
    logger(
      `Access ${chalk.blue(
        "https://docs.bonfire.pm"
      )} to learn more on how to install packages and use Bonfire in it's full potential.\n\n`,
      Severity.neutral
    );
  } catch (err: any) {
    logger(err.message, Severity.error, true);
  }
}

export = ts.identity<yargs.CommandModule>({
  command: "init",
  describe: "Create a project from a template",
  handler: () => init(),
});
