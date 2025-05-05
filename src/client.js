import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from "./conf.js";
import * as tools from "./tools.js";
import * as argv from "./argv.js";

export async function run(
  server = argv.server,
  name = argv.name,
  args = argv.args,
) {
  const client = new Client(
    { name: "mcp-minion", version: "0.1.4" },
    { capabilities: {} },
  );

  // Create a config with environment variables passed through
  const serverConfig = mcpServers[server];
  const configWithEnv = {
    ...serverConfig,
    env: process.env, // Pass all environment variables to child process
  };

  const transport = new StdioClientTransport(
    configWithEnv,
  );
  await client.connect(transport);
  await ((name &&
    tools.call(client, name, args)) ||
    tools.list(client));
  await client.close();
}
