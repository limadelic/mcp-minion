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

function buildStdioTransport(config) {
  return new StdioClientTransport({
    command: config.command,
    args: config.args?.map(expandEnv) || [],
    env: process.env,
  });
}

function buildHttpTransport(config, type) {
  const requestInit = {};
  if (config.headers) {
    requestInit.headers = Object.fromEntries(
      Object.entries(config.headers).map(
        ([key, value]) => [key, expandEnv(value)],
      ),
    );
  }

  const url = new URL(expandEnv(config.url));

  if (type === "sse") {
    return new SSEClientTransport(url, { requestInit });
  }

  return new StreamableHTTPClientTransport(url, { requestInit });
}

export async function run(
  server = argv.server,
  name = argv.name,
  args = argv.args,
) {
  const config = mcpServers[server];
  if (!config) {
    console.error(`unknown server: ${server}`);
    const available = Object.keys(mcpServers);
    if (available.length > 0) {
      console.error(`available: ${available.join(", ")}`);
    }
    process.exit(1);
  }

  let client = new Client(
    { name: "mcp-minion", version: pkg.version },
    { capabilities: {} },
  );

  const type = config.type || (config.url ? "http" : "stdio");
  let transport = type === "stdio"
    ? buildStdioTransport(config)
    : buildHttpTransport(config, type);

  try {
    await client.connect(transport);
  } catch (e) {
    if (type === "http") {
      await transport.close?.();
      client = new Client(
        { name: "mcp-minion", version: pkg.version },
        { capabilities: {} },
      );
      transport = buildHttpTransport(config, "sse");
      await client.connect(transport);
    } else {
      throw e;
    }
  }

  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}
