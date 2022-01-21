import fetch from "node-fetch";
import { SERVER_URL } from "./constants";
import semver from "semver";
import chalk from "chalk";
import logger, { Severity } from "./logger";

const updateCommand = chalk.bgWhite(
  chalk.black("npm install bonfire --global")
);

export default async function checkVersion() {
  const response = await (
    await fetch(`${SERVER_URL}/latestVersion.json`)
  ).json();

  const pkg = require("../../package.json");

  if (semver.lt(pkg.version, response.required)) {
    throw new Error(
      ` You need to update Fire CLI. Run ${updateCommand} to update.`
    );
  }

  if (semver.lt(pkg.version, response.latest)) {
    logger(
      `A new version of Fire CLI is available. Run ${updateCommand} to update.`,
      Severity.warning
    );
  }
}
