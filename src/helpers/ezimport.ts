import { MODULES_DIRECTORY } from "./constants";
import { touchDirectory } from "./directories";
import fetchAPI from "./fetchAPI";
import { DownloadedPackage } from "./packages";
import { unarchiveZip } from "./archive";
import Downloader from "nodejs-file-downloader";
import { rmSync, unlinkSync } from "fs-extra";

export async function updateEzImport() {
  const packageData = (await fetchAPI("packages/install", "POST", {
    packages: [{ name: "Roarn", version: undefined }],
  })) as DownloadedPackage[];

  for (let i = 0; i < packageData.length; i++) {
    const p = packageData[i];
    const packageDir = `${MODULES_DIRECTORY}/${p.name}`;

    touchDirectory(packageDir);

    rmSync(packageDir, { recursive: true });
    const downloader = new Downloader({
      url: p.url,
      directory: packageDir,
    });
    await downloader.download();
    const zipfile = `${packageDir}/${p.version}.zip`;
    await unarchiveZip(zipfile);
    unlinkSync(zipfile);

    delete p.url;
  }
}
