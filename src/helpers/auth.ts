import { CREDENTIALS_FILE } from "./constants";
import { load } from "./file";

export default async function getAuth() {
  let auth;

  try {
    auth = JSON.parse((await load(CREDENTIALS_FILE, true)) as string);
  } catch (e: any) {}

  return auth;
}
