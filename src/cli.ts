#!/usr/bin/env node

import yargs from "yargs";
import { PACKAGE_ROOT } from "./helpers/constants";

console.log(PACKAGE_ROOT);

yargs
  .scriptName("roarn")
  .usage("$0 <cmd> [args]")
  .commandDir(`${PACKAGE_ROOT}/lib/commands/`)
  .help().argv;
