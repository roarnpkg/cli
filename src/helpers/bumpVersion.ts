import loadRoarnJson, { saveRoarnJSON } from "./loadRoarnJson";
import semver from "semver";

export async function bumpVersion() {
  const roarnJson = loadRoarnJson();

  roarnJson.version = semver.inc(roarnJson.version, "patch") as string;

  await saveRoarnJSON(roarnJson);
}
