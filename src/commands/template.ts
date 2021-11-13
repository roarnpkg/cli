import ts from "byots";
import fs from "fs-extra";
import shell from "shelljs";
import prompts from "prompts";
import yargs from "yargs";
import { PACKAGE_ROOT } from "../helpers/constants";
import logger, { Severity } from "../helpers/logger";

interface InitOptions {
  yes?: boolean;
  git?: boolean;
}

const questions = [
  {
    type: "toggle",
    name: "checkIfSure",
    message:
      "The following prompts will setup Rojo and Roarn. Would you like to continue?",
    active: "yes",
    inactive: "no",
  },
  {
    type: "multiselect",
    name: "template",
    message: "What template would you like to use?",
    min: 1,
    max: 1,
    choices: [
      { title: "game", value: "game" },
      { title: "package", value: "package" },
      { title: "plugin", value: "plugin" },
    ],
  },
];

async function insert(type: string) {
  if (type === "game") {
    try {
      await fs.copy(`${PACKAGE_ROOT}/templates/game`, "./");
    } catch (err: any) {
      logger(err.message, Severity.error, true);
    }
  }
}

async function template(argv: yargs.Arguments<InitOptions>) {
  try {
    const {
      git = argv.git ?? argv.yes ?? false,
    }: {
      git: boolean;
    } = await prompts([
      {
        type: "toggle",
        name: "useGit",
        message: "Would you like to setup Git with Roarn?",
        active: "yes",
        inactive: "no",
      },
    ]);
    const answers = await prompts(questions);

    if (!answers.checkIfSure || !answers.template) {
      logger("Cancelled prompt.", Severity.error, true);
    }
    if (git) {
      shell.exec("git init");
    }
    if (answers.template[0] === "game") {
      await insert("game");
      logger("Successfully installed!");
    }
    if (answers.template[0] === "package") {
      // await insertRojo();
      logger("Successfully installed!");
    }
    if (answers.template[0] === "plugin") {
      // await insertRojo();
      logger("Successfully installed!");
    }
  } catch (err: any) {
    logger(err.message, Severity.error, true);
  }
}

export = ts.identity<yargs.CommandModule<{}, InitOptions>>({
  command: "template",
  describe: "Create a project from a template",
  builder: () =>
    yargs
      .option("yes", {
        alias: "y",
        boolean: true,
        describe: "recommended options",
      })
      .option("git", {
        boolean: true,
        describe: "Configure Git",
      }),
  handler: (argv) => template(argv),
});
