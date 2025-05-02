import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';
import * as tools from './tools.js';
import { server, resource, name, argv } from './argv.js';

export let client = null;

export async function run() {
  if (!server) return;
  const serverConfig = mcpServers[server];
  console.log(`\n${server}:\n`);
  
  client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
  const transport = new StdioClientTransport(serverConfig);
  
  await client.connect(transport);
  


  if (resource === 'tools' && !name) {
    await tools.list();
  } else {
    await tools.call();
  }
  
  await client.close();
}
