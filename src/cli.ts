#!/usr/bin/env node

import semver from "semver";
import yargs from "yargs";
import { PACKAGE_ROOT } from "./helpers/constants";
import loadRoarnJson, { depsToArray } from "./helpers/loadRoarnJson";
import logger, { Severity } from "./helpers/logger";
import { install } from "./helpers/packages";

if (!semver.gte(process.version, "15.0.0")) {
  throw new Error("Roarn requires Node.js 15 or later");
}

function installPackages() {
  try {
    const { dependencies } = loadRoarnJson();
    install(depsToArray(dependencies));
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

yargs
  .scriptName("roarn")
  .usage("$0 <cmd> [args]")
  .command(
    "$0",
    "Install all packages from roarn.json",
    () => {},
    installPackages
  )
  .commandDir(`${PACKAGE_ROOT}/lib/commands/`)
  .help().argv;
