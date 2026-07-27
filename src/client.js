import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { mcpServers } from "./conf.js";
import * as tools from "./tools.js";
import * as argv from "./argv.js";
import pkg from "../package.json" with { type: "json" };

function expandEnv(value) {
  if (typeof value !== "string") return value;
  return value.replace(
    /\$\{([^}]+)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g,
    (match, braced, unbraced) => {
      const varName = braced || unbraced;
      return process.env[varName] || "";
    },
  );
}

export async function run(
  server = argv.server,
  name = argv.name,
  args = argv.args,
) {
  const client = new Client(
    { name: "mcp-minion", version: pkg.version },
    { capabilities: {} },
  );

  const config = mcpServers[server];
  const transport = config.url
    ? await createHttpTransport(config, client)
    : new StdioClientTransport({
        command: config.command,
        args: config.args?.map(expandEnv) || [],
        env: process.env,
      });

  if (config.url === undefined) {
    await client.connect(transport);
  }
  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}

async function createHttpTransport(
  config,
  client,
) {
  const requestInit = {};
  if (config.headers) {
    requestInit.headers = Object.fromEntries(
      Object.entries(config.headers).map(
        ([key, value]) => [key, expandEnv(value)],
      ),
    );
  }

  const url = new URL(expandEnv(config.url));
  const streamableTransport =
    new StreamableHTTPClientTransport(url, {
      requestInit,
    });

  try {
    await client.connect(streamableTransport);
    return streamableTransport;
  } catch {
    const sseTransport = new SSEClientTransport(
      url,
      {
        requestInit,
      },
    );
    await client.connect(sseTransport);
    return sseTransport;
  }
}
