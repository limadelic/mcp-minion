import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from "./conf.js";
import * as tools from "./tools.js";
import * as argv from "./argv.js";
import pkg from "../package.json" assert { type: "json" };

export async function run(
  server = argv.server,
  name = argv.name,
  args = argv.args,
) {
  const client = new Client(
    { name: "mcp-minion", version: pkg.version },
    { capabilities: {} },
  );

  const transport = new StdioClientTransport({
    ...mcpServers[server],
    env: process.env,
  });
  await client.connect(transport);
  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}
