import { existsSync, rmSync, unlinkSync } from "fs-extra";
import fetchAPI from "../helpers/fetchAPI";
import Downloader from "nodejs-file-downloader";
import { MODULES_DIRECTORY } from "../helpers/constants";
import { unarchiveZip } from "../helpers/archive";
import { touchDirectory } from "../helpers/directories";
import loadFireJson, {
  depsToArray,
  Package,
  saveFireJson,
} from "./loadFireJson";
import logger, { Severity } from "./logger";
import { saveFile } from "./file";
import path from "path";

export type DownloadedPackage = {
  name: string;
  version: string;
  url?: string;
  dependencies?: Record<string, string>;
};

function shouldInstall(p: Package) {
  const packageDir = path.join(MODULES_DIRECTORY, p.name);

  const jsonFile = path.join(packageDir, "fire.json");

  if (existsSync(jsonFile)) {
    if (!p.version) {
      return false;
    }
    const pFireJson = require(jsonFile);
    return pFireJson.version !== p.version;
  }

  return true;
}

export async function install(
  packages: Package[],
  level: number = 0,
  bumpInstalled?: () => number
) {
  if (!packages.length) {
    logger("No package(s)", Severity.error);
    return;
  }

  const fireJson = loadFireJson();

  const filteredPackages = packages.filter((p) => {
    if (!level && !fireJson.dependencies[p.name]) {
      return true;
    }
    return shouldInstall(p);
  });

  if (!level && !filteredPackages.length) {
    logger("Already up to date.");
    return;
  }

  touchDirectory(MODULES_DIRECTORY);

  const packageData = (await fetchAPI("packages/install", "POST", {
    packages: filteredPackages,
  })) as DownloadedPackage[];

  let installed = 0;

  const bumpInstalledFunction = level ? bumpInstalled : () => installed++;

  for (let i = 0; i < packageData.length; i++) {
    const p = packageData[i];
    const packageDir = path.join(MODULES_DIRECTORY, p.name);

    const jsonFile = path.join(packageDir, "fire.json");

    logger(
      `${Array.from(Array(level).keys())
        .map((_, index) => (index === level - 1 ? "└─ " : " "))
        .join("")}Installing ${p.name}...`,
      Severity.neutral
    );
    touchDirectory(packageDir);

    rmSync(packageDir, { recursive: true });
    const downloader = new Downloader({
      url: p.url,
      directory: packageDir,
    });
    await downloader.download();
    const zipfile = path.join(packageDir, `${p.version}.zip`);
    await unarchiveZip(zipfile);
    unlinkSync(zipfile);

    delete p.url;

    await saveFile(jsonFile, JSON.stringify(p, null, "\t"));

    if (!level) {
      fireJson.dependencies[p.name] = p.version;
    }
    bumpInstalledFunction?.();
    if (p.dependencies) {
      const subPkgs = depsToArray(p.dependencies);
      if (subPkgs.length) {
        await install(subPkgs, level + 1, bumpInstalledFunction);
      }
    }
  }

  if (!level) {
    await saveFireJson(fireJson);
    logger(`${installed} new package(s) installed.`);
  }
}

export function uninstall(packages: Package[]) {
  if (!packages.length) {
    logger("Nothing to remove.", Severity.error);
    return;
  }

  const fireJson = loadFireJson();

  packages.forEach((p) => {
    delete fireJson.dependencies[p.name];
    const packageDir = `${MODULES_DIRECTORY}/${p.name}`;

    touchDirectory(packageDir);
    logger(`Removing ${p.name}...`, Severity.neutral);
    rmSync(packageDir, { recursive: true });
  });

  saveFireJson(fireJson);
  logger("All packages have been removed!");
}
