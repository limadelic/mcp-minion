import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';

export async function connect(server: string, command: string, args: string[]) {
  try {

    const serverConfig = mcpServers[server];


    const client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
    const transport = new StdioClientTransport(serverConfig);
    await client.connect(transport);
    
    try {
      if (command === 'tools') {

        const result = await client.listTools();
        for (const tool of result.tools) {
          console.log(tool.name);
        }
      } else {
        const toolName = command;
        const toolArgs = args.length > 0 ? JSON.parse(args[0]) : {};
        
        const result = await client.callTool({ name: toolName, arguments: toolArgs });
        
        const content = result?.content as Array<any> || [];
        for (const item of content) {
          if (item?.type === 'text' && item.text) {
            console.log(item.text);
          }
        }
      }
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error(`Error: ${error.message || error}`);
    process.exit(1);
  }
}
