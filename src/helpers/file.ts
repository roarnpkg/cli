import path from "path";
import fs from "fs-extra";
import base64 from "base-64";
import { APP_DIRECTORY } from "./constants";
import { touchDirectory } from "./directories";

function getFilePath(name: string): string {
  touchDirectory(APP_DIRECTORY);

  return path.join(APP_DIRECTORY, name);
}

export function save(name: string, content: string, encode?: boolean) {
  const filePath = getFilePath(name);

  const encodedData = base64.encode(content);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, encode ? encodedData : content, function (err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}

export function saveFile(name: string, content: string): Promise<Boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, content, function (err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
export function loadFile(name: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(name, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function load(name: string, encode?: boolean) {
  const filePath = getFilePath(name);
  const data = await loadFile(filePath);
  if (encode) {
    if (data === undefined) {
      return data;
    }
    const encodedData = base64.decode(data.toString());
    return encodedData;
  }

  return data;
}

export function deleteFile(name: string) {
  const filePath = getFilePath(name);

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, function (err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
}
