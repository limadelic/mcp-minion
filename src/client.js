import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from "./config.js";
import * as tools from "./tools.js";
import { argv } from "./argv.js";

export async function run(
  server = argv.server,
  name = argv.name,
  args = argv.args,
) {
  const client = new Client(
    { name: "mcp-minion", version: "0.1.4" },
    { capabilities: {} },
  );

  const transport = new StdioClientTransport(
    mcpServers[server],
  );
  await client.connect(transport);
  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}
