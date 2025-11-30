import type { VercelRequest, VercelResponse } from "@vercel/node";
import { server } from "../src/server";
import { createContext } from "../src/context";
import { HeaderMap } from "@apollo/server";

let serverStarted = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure server is started (lazy initialization)
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const headers = new HeaderMap();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      body: req.body,
      headers,
      method: req.method || "POST",
      search: new URL(req.url || "", `http://${req.headers.host}`).search,
    },
    context: async () => createContext(),
  });

  for (const [key, value] of httpGraphQLResponse.headers) {
    res.setHeader(key, value);
  }

  res.status(httpGraphQLResponse.status || 200);

  if (httpGraphQLResponse.body.kind === "complete") {
    res.send(httpGraphQLResponse.body.string);
  } else {
    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
      res.write(chunk);
    }
    res.end();
  }
}
