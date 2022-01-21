import path from "path";
import { archiveFolder, extract } from "zip-lib";

export function archiveDir(folder: string) {
  const tarName = `${path.basename(folder)}.zip`;
  const sourcePath = path.resolve(folder, "..");

  return archiveFolder(folder, path.join(sourcePath, tarName));
}

export function unarchiveZip(filePath: string) {
  return extract(filePath, path.resolve(filePath, ".."));
}
