import path from "path";
import fs from "fs-extra";
import { APP_DIRECTORY } from "./constants";
import base64 from "base-64";

function getFilePath(name: string): string {
  if (!fs.existsSync(APP_DIRECTORY)) {
    fs.mkdirSync(APP_DIRECTORY);
  }

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

export function load(name: string, encode?: boolean) {
  const filePath = getFilePath(name);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        reject(err);
      }

      if (encode) {
        if (data === undefined) {
          resolve(data);
          return;
        }
        const encodedData = base64.decode(data.toString());
        resolve(encodedData);
      }

      resolve(data);
    });
  });
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
