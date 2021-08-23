import { homedir } from "os";
import path from "path";

export const PACKAGE_ROOT = path.join(__dirname, "..", "..");

export const APP_DIRECTORY = path.join(homedir(), ".roarn");

export const SERVER_URL = "http://localhost:3000";

export const CLI_TOKEN = "3Ex890cQLo1xN1S0gR6i";

export const CREDENTIALS_FILE = "credentials.roarn";
