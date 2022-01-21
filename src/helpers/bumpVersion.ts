import loadFireJson, { saveFireJson } from "./loadFireJson";
import semver from "semver";

export async function bumpVersion() {
  const fireJson = loadFireJson();

  fireJson.version = semver.inc(fireJson.version, "patch") as string;

  await saveFireJson(fireJson);
}
