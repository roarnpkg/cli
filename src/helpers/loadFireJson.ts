import path from "path";
import { RUNNING_DIRECTORY } from "./constants";
import { saveFile } from "./file";
import { existsSync } from "fs-extra";

export const JSON_PATH = path.join(RUNNING_DIRECTORY, "fire.json");

export type FireJson = {
  name: string;
  version: string;
  description?: string;
  path?: string;
  dependencies: Record<string, string>;
};

export type Package = {
  name: string;
  version?: string;
};

export async function saveFireJson(fireJson: Record<string, any>) {
  return saveFile(JSON_PATH, JSON.stringify(fireJson, null, "\t"));
}

export function depsToArray(dependencies: Record<string, string>) {
  return Object.keys(dependencies).map((key) => ({
    name: key,
    version: dependencies[key],
  })) as Package[];
}

export default function loadFireJson() {
  if (!existsSync(JSON_PATH)) {
    throw new Error(
      "Cannot find a fire.json file. To init a project do 'fire init'"
    );
  }
  const json = require(JSON_PATH);
  json.dependencies = json.dependencies || {};
  return json as FireJson;
}
