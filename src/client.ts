import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mcpServers } from './config.js';

export async function connect(server: string, command: string, args: string[]) {
  try {
    const serverConfig = mcpServers[server];
    
    // For the dir command, only show server name as header
    if (command === 'tools' && process.argv[2] === 'dir') {
      console.log(`\n${server.toUpperCase()}`);
    }
    
    const client = new Client({ name: "mcp-minion", version: "0.1.4" }, { capabilities: {} });
    const transport = new StdioClientTransport(serverConfig);
    await client.connect(transport);
    
    try {
      if (command === 'tools') {

        const result = await client.listTools();
        if (process.env.DEBUG) {
          console.log(JSON.stringify(result, null, 2));
        }
        
        for (const tool of result.tools) {
          console.log(`${tool.name}`);
          console.log(`  ${tool.description?.split('\n')[0] || ''}`);
          
          if (tool.inputSchema?.properties) {
            const required = Array.isArray(tool.inputSchema.required) ? tool.inputSchema.required : [];
            for (const [paramName, paramDetails] of Object.entries(tool.inputSchema.properties)) {
              const isRequired = required.includes(paramName) ? '*' : '';
              const paramType = typeof paramDetails === 'object' && paramDetails !== null && 'type' in paramDetails 
                ? (paramDetails as { type?: string }).type || 'any' 
                : 'any';
              console.log(`    ${paramName}${isRequired}: <${paramType}>`);
            }
          }
          console.log('');
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
