import ts from "byots";
import yargs from "yargs";
import { CREDENTIALS_FILE } from "../helpers/constants";
import fetchAPI from "../helpers/fetchAPI";
import { deleteFile } from "../helpers/file";
import logger, { Severity } from "../helpers/logger";

async function authenticate() {
  try {
    const response = await fetchAPI("oauth/revoke-token", "GET");
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
  } catch (e: any) {
    if (e.message === "Not authenticated") {
      deleteFile(CREDENTIALS_FILE);
    }
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
