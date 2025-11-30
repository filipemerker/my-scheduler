import type { Handler } from "@netlify/functions";
import { server } from "../../src/server";
import { createContext } from "../../src/context";
import { HeaderMap } from "@apollo/server";

let serverStarted = false;

export const handler: Handler = async (event, context) => {
  // Ensure server is started (lazy initialization)
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "",
    };
  }

  const headers = new HeaderMap();
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (value) {
      headers.set(key.toLowerCase(), Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const body = event.body ? JSON.parse(event.body) : null;
  const queryString = event.queryStringParameters
    ? new URLSearchParams(event.queryStringParameters).toString()
    : "";

  const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      body,
      headers,
      method: event.httpMethod || "POST",
      search: queryString ? `?${queryString}` : "",
    },
    context: async () => createContext(),
  });

  const responseHeaders: Record<string, string> = {};
  for (const [key, value] of httpGraphQLResponse.headers) {
    responseHeaders[key] = value;
  }

  // Add CORS headers
  responseHeaders["Access-Control-Allow-Origin"] = "*";
  responseHeaders["Access-Control-Allow-Headers"] = "Content-Type";

  let bodyString = "";
  if (httpGraphQLResponse.body.kind === "complete") {
    bodyString = httpGraphQLResponse.body.string;
  } else {
    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
      bodyString += chunk;
    }
  }

  return {
    statusCode: httpGraphQLResponse.status || 200,
    headers: responseHeaders,
    body: bodyString,
  };
};

