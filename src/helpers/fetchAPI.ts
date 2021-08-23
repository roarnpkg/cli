import fetch from "node-fetch";
import { CLI_TOKEN, SERVER_URL } from "./constants";

export default async function fetchAPI(
  endpoint: string,
  method: "GET" | "POST" | "PUT",
  body?: Record<string, any>
) {
  const headers: Record<string, any> = {
    "Content-Type": "application/json",
  };

  headers.Authorization = `Bearer ${CLI_TOKEN}`;

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
  } catch (e) {
    throw new Error(e.message || "Error Fetching API");
  }
}
