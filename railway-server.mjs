import { createServer } from "node:http";

const port = parseInt(process.env.PORT || "3000", 10);

// Import the Workers-format server bundle
const app = await import("./dist/server/server.js");
const handler = app.default?.fetch ?? app.fetch;

if (typeof handler !== "function") {
  console.error("Could not find fetch handler in server bundle");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }

    const body = req.method !== "GET" && req.method !== "HEAD"
      ? await new Promise((resolve) => {
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks)));
        })
      : undefined;

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
      duplex: body ? "half" : undefined,
    });

    const response = await handler(request, {}, { waitUntil: () => {}, passThroughOnException: () => {} });

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Request error:", err);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
});
