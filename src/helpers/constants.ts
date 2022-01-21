import { config as dotEnvConfig } from "dotenv";
import { homedir } from "os";
import path from "path";

dotEnvConfig();

export const PACKAGE_ROOT = path.join(__dirname, "..", "..");
export const APP_DIRECTORY = path.join(homedir(), ".bonfire");

export const RUNNING_DIRECTORY = process.cwd();

export const BUILD_DIRECTORY = path.join(RUNNING_DIRECTORY, "fire_build");

export const MODULES_DIRECTORY = path.join(RUNNING_DIRECTORY, "fire_modules");

const SERVER_URLS = {
  development: "http://localhost:3000",
  production: "https://bonfire.pm",
};

const ENV = (process.env.FIRE_ENV || "production") as keyof typeof SERVER_URLS;

export const SERVER_URL = SERVER_URLS[ENV];

export const CLIENT_ID = "3Ex890cQLo1xN1S0gR6i";

export const CREDENTIALS_FILE = "credentials.fire";
