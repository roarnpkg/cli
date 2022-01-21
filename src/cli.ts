#!/usr/bin/env node

import semver from "semver";
import yargs from "yargs";
import { PACKAGE_ROOT } from "./helpers/constants";
import loadFireJson, { depsToArray } from "./helpers/loadFireJson";
import logger, { Severity } from "./helpers/logger";
import { install } from "./helpers/packages";

if (!semver.gte(process.version, "15.0.0")) {
  throw new Error("Bonfire requires Node.js 15 or later");
}

function installPackages() {
  try {
    const { dependencies } = loadFireJson();
    install(depsToArray(dependencies));
  } catch (e: any) {
    logger(e.message, Severity.error);
  }
}

yargs
  .scriptName("fire")
  .usage("$0 <cmd> [args]")
  .command(
    "$0",
    "Install all packages from fire.json",
    () => {},
    installPackages
  )
  .commandDir(`${PACKAGE_ROOT}/lib/commands/`)
  .help().argv;
