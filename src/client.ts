import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';
import * as tools from './tools.js';
import { server, resource, name, args } from './argv.js';

export let client = null;

export async function run(serverName = server, resourceType = resource, resourceName = name, resourceArgs = args) {
  if (!serverName) return;
  const serverConfig = mcpServers[serverName];
  console.log(`\n${serverName}:\n`);
  
  client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
  const transport = new StdioClientTransport(serverConfig);
  
  await client.connect(transport);
  


  if (resourceType === 'tools' && !resourceName) {
    await tools.list();
  } else {
    await tools.call(resourceName, resourceArgs);
  }
  
  await client.close();
}
