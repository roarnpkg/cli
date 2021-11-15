import fs from "fs-extra";
import fetchAPI from "../helpers/fetchAPI";
import Downloader from "nodejs-file-downloader";
import { MODULES_DIRECTORY } from "../helpers/constants";
import { unarchiveZip } from "../helpers/archive";
import { touchDirectory } from "../helpers/directories";
import loadRoarnJson, {
  depsToArray,
  Package,
  saveRoarnJSON,
} from "../helpers/loadRoarnJson";
import logger, { Severity } from "./logger";
import { saveFile } from "./file";

export type DownloadedPackage = {
  name: string;
  version: string;
  url?: string;
  dependencies?: Record<string, string>;
};

function shouldInstall(p: Package) {
  const packageDir = `${MODULES_DIRECTORY}/${p.name}`;
  const jsonFile = `${packageDir}/roarn.json`;

  if (fs.existsSync(jsonFile)) {
    if (!p.version) {
      return false;
    }
    const pRoarnJson = require(jsonFile);
    return pRoarnJson.version !== p.version;
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

  const roarnJson = loadRoarnJson();

  const filteredPackages = packages.filter((p) => {
    if (!level && !roarnJson.dependencies[p.name]) {
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
    const packageDir = `${MODULES_DIRECTORY}/${p.name}`;

    const jsonFile = `${packageDir}/roarn.json`;

    logger(
      `${Array.from(Array(level).keys())
        .map((_, index) => (index === level - 1 ? "└─ " : " "))
        .join("")}Installing ${p.name}...`,
      Severity.neutral
    );
    touchDirectory(packageDir);

    fs.rmSync(packageDir, { recursive: true });
    const downloader = new Downloader({
      url: p.url,
      directory: packageDir,
    });
    await downloader.download();
    const zipfile = `${packageDir}/${p.version}.zip`;
    await unarchiveZip(zipfile);
    fs.unlinkSync(zipfile);

    delete p.url;

    await saveFile(jsonFile, JSON.stringify(p, null, "\t"));

    if (!level) {
      roarnJson.dependencies[p.name] = p.version;
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
    await saveRoarnJSON(roarnJson);
    logger(`${installed} new package(s) installed.`);
  }
}

export function uninstall(packages: Package[]) {
  if (!packages.length) {
    logger("Nothing to remove.", Severity.error);
    return;
  }

  const roarnJson = loadRoarnJson();

  packages.forEach((p) => {
    delete roarnJson.dependencies[p.name];
    const packageDir = `${MODULES_DIRECTORY}/${p.name}`;

    touchDirectory(packageDir);
    logger(`Removing ${p.name}...`, Severity.neutral);
    fs.rmSync(packageDir, { recursive: true });
  });

  saveRoarnJSON(roarnJson);
  logger("All packages have been removed!");
}
