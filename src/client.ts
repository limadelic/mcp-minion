import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';
import * as tools from './tools.js';
import { data } from './argv.js';

export async function run() {
  const serverConfig = mcpServers[data.server];
  console.log(`\n${data.server}:\n`);
  
  const client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
  const transport = new StdioClientTransport(serverConfig);
  
  await client.connect(transport);
  
  data.client = client;

  if (data.resource === 'tools' && !data.name) {
    await tools.list();
  } else {
    await tools.call();
  }
  
  await client.close();
}
