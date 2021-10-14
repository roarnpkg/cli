import path from "path";
import { archiveFolder } from "zip-lib";

export function archiveDir(folder: string) {
  const folderArray = folder.split("\\").join("/").split("/");
  const tarName = `${folderArray.pop()}.zip`;
  const sourcePath = path.join(...folderArray);

  return archiveFolder(folder, path.join(sourcePath, tarName));
}
