import { homedir } from "os";
import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..", "..");

export const APP_DIRECTORY = path.join(homedir(), ".roarn");

export const RUNNING_DIRECTORY = process.cwd();

export const BUILD_DIRECTORY = path.join(RUNNING_DIRECTORY, "roarn_build");

export const MODULES_DIRECTORY = path.join(RUNNING_DIRECTORY, "roarn_modules");

const SERVER_URLS = {
  development: "http://localhost:3000",
  production: "https://roarn.space",
};

// const ENV = (process.env.ROARN_ENV || "production") as keyof typeof SERVER_URLS;
const ENV = "production";

export const SERVER_URL = SERVER_URLS[ENV];

export const CLIENT_ID = "3Ex890cQLo1xN1S0gR6i";

export const CREDENTIALS_FILE = "credentials.roarn";
