import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';
import * as tools from './tools.js';

export async function run(server, command, args) {
  const serverConfig = mcpServers[server];
  console.log(`\n${server}:\n`);
  
  const client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
  const transport = new StdioClientTransport(serverConfig);
  
  await client.connect(transport);
  
  command === 'tools' 
    ? await tools.list(client) 
    : await tools.call(client, command, args);
  
  await client.close();
}
