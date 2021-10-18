#!/usr/bin/env node

import yargs from "yargs";
import { PACKAGE_ROOT } from "./helpers/constants";
import loadRoarnJson, { depsToArray } from "./helpers/loadRoarnJson";
import { install } from "./helpers/packages";

function installPackages() {
  const { dependencies } = loadRoarnJson();

  install(depsToArray(dependencies));
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
