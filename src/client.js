import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { mcpServers } from "./conf.js";
import * as tools from "./tools.js";
import * as argv from "./argv.js";
import pkg from "../package.json" with { type: "json" };

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
    ? await createHttpTransport(config)
    : new StdioClientTransport({
        ...config,
        env: process.env,
      });

  await client.connect(transport);
  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}

async function createHttpTransport(config) {
  const requestInit = {};
  if (config.headers) {
    requestInit.headers = config.headers;
  }

  try {
    return new StreamableHTTPClientTransport(config.url, {
      requestInit,
    });
  } catch {
    return new SSEClientTransport(config.url, {
      requestInit,
    });
  }
}
