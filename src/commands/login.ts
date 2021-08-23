import ts from "byots";
import express from "express";
import yargs from "yargs";
import { CREDENTIALS_FILE, SERVER_URL } from "../helpers/constants";
import fetchAPI from "../helpers/fetchAPI";
import { load, save } from "../helpers/file";
import logger, { Severity } from "../helpers/logger";

const LOGIN_URL = `${SERVER_URL}/cli`;

const PORT = 3250;

function startWebServer() {
  const app = express();

  app.get(
    "/register-token",
    async (req: express.Request, res: express.Response) => {
      try {
        const { token, uid, username } = req.query;
        if (!token || !uid) {
          res.status(500).send("There was an error");
          return;
        }
        const response = await fetchAPI("validate-token", "POST", req.query);

        if (!response.valid) {
          res.status(500).send("There was an error");
          return;
        }

        await save(CREDENTIALS_FILE, JSON.stringify(req.query), true);
        logger(`You are now logged in as ${username}`);
        res.send("You can now close this window");
      } catch (e) {
        logger(e.message, Severity.error);
        res.status(500).send(e.message);
      }
      process.exit();
    }
  );

  app.get("/", (req: express.Request, res: express.Response) => {
    console.log(req.params);
    console.log("Test");
    res.send("ok");
  });
  app.listen(PORT);
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
    logger(`Click this link to login: ${LOGIN_URL}`, Severity.warning);
    startWebServer();
  }
}

export = ts.identity<yargs.CommandModule<{}>>({
  command: "login",
  describe: "Login to the registry.",
  handler: () => authenticate(),
});
