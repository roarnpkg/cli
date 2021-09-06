import ts from "byots";
import express from "express";
import yargs from "yargs";
import { CLIENT_ID, CREDENTIALS_FILE, SERVER_URL } from "../helpers/constants";
import fetchAPI from "../helpers/fetchAPI";
import { load, save } from "../helpers/file";
import logger, { Severity } from "../helpers/logger";

const PORT = 3250;

const REDIRECT_URL = `http://localhost:${PORT}/register-token`;

const LOGIN_URL = `${SERVER_URL}/oauth2?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&state=`;

function startWebServer() {
  const app = express();
  const localstate = (Math.random() * 1000000).toString();

  app.get(
    "/register-token",
    async (req: express.Request, res: express.Response) => {
      try {
        const { code, state } = req.query;

        if (!code || state !== localstate.toString()) {
          res.status(500).send("There was an error");
          return;
        }
        const response = await fetchAPI("oauth/get-token", "POST", {
          code,
          clientId: CLIENT_ID,
          redirectUrl: REDIRECT_URL,
        });

        await save(CREDENTIALS_FILE, JSON.stringify(response), true);
        logger(`You are now logged in as ${response.username}`);
        res.send("You can now close this window");
      } catch (e: any) {
        logger(e.message, Severity.error);
        res.status(500).send(e.message);
      }
      process.exit();
    }
  );
  app.listen(PORT, () => {
    logger(
      `Click this link to login: ${LOGIN_URL}${localstate}`,
      Severity.warning
    );
  });
}

async function authenticate() {
  try {
    const file = (await load(CREDENTIALS_FILE, true)) as string;
    const json = JSON.parse(file);
    logger(
      "You are already logged in as " +
        json.username +
        ". Please use `roarn logout` to clear your credentials.",
      Severity.error
    );
  } catch (e) {
    startWebServer();
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "login",
  describe: "Login to the registry.",
  handler: () => authenticate(),
});
