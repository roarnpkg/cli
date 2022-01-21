import base64 from "base-64";
import fetch from "node-fetch";
import getAuth from "./auth";
import { CLIENT_ID, SERVER_URL } from "./constants";

export default async function fetchAPI(
  endpoint: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: Record<string, any>
) {
  const headers: Record<string, any> = {
    "Content-Type": "application/json",
  };

  const auth = await getAuth();
  if (auth) {
    headers.Authorization = `Basic ${base64.encode(
      `${CLIENT_ID}:${auth.token}`
    )}`;
  }
  const payload: Record<string, any> = {
    method: method,
    headers,
    mode: "cors",
  };
  if (body) {
    payload.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(`${SERVER_URL}/api/${endpoint}`, payload);

    const responseData = await res.json();
    if (responseData.ok) {
      return responseData.data;
    } else {
      throw new Error(responseData.error || "Error Fetching API");
    }
  } catch (e: any) {
    throw new Error(e.message || "Error Fetching API");
  }
}
