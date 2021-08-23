import ts from "byots";
import yargs from "yargs";
import { CREDENTIALS_FILE } from "../helpers/constants";
import fetchAPI from "../helpers/fetchAPI";
import { load, deleteFile } from "../helpers/file";
import logger, { Severity } from "../helpers/logger";

async function authenticate() {
  try {
    const file = (await load(CREDENTIALS_FILE, true)) as string;
    const json = JSON.parse(file);
    const response = await fetchAPI("delete-token", "POST", {
      uid: json.uid,
      token: json.token,
    });
    if (!response.deleted) {
      logger(
        "An unexpected error occurred when logging out.",
        Severity.error,
        true
      );
      return;
    }
    logger("Successfully logged out.");

    await deleteFile(CREDENTIALS_FILE);
  } catch (e) {
    logger(
      "You are not loggged in. Please do `roarn login` to create your credentials.",
      Severity.error
    );
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "logout",
  describe: "Logout of the registry.",
  handler: () => authenticate(),
});
