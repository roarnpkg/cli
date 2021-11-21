import path from "path";
import { RUNNING_DIRECTORY } from "./constants";
import { saveFile } from "./file";
import { existsSync } from "fs-extra";

export const JSON_PATH = path.join(RUNNING_DIRECTORY, "roarn.json");

export type RoarnJson = {
  name: string;
  version: string;
  description?: string;
  dependencies: Record<string, string>;
};

export type Package = {
  name: string;
  version?: string;
};

export async function saveRoarnJSON(roarnJson: Record<string, any>) {
  return saveFile(JSON_PATH, JSON.stringify(roarnJson, null, "\t"));
}

export function depsToArray(dependencies: Record<string, string>) {
  return Object.keys(dependencies).map((key) => ({
    name: key,
    version: dependencies[key],
  })) as Package[];
}

export default function loadRoarnJson() {
  if (!existsSync(JSON_PATH)) {
    throw new Error(
      "Cannot find a roarn.json file. To init a project do 'roarn init'"
    );
  }
  const json = require(JSON_PATH);
  json.dependencies = json.dependencies || {};
  return json as RoarnJson;
}
