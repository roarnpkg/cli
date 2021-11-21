import { existsSync, mkdirSync } from "fs-extra";
import path from "path";

export function touchDirectory(dir: string) {
  const subDirs = dir.split(path.sep);
  let last = "";
  subDirs.forEach((s) => {
    const current = last + s + path.sep;
    if (!existsSync(current)) {
      mkdirSync(current);
    }
    last = current;
  });
}
