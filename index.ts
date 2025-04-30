#!/usr/bin/env node

// Flexible MCP client that can run any tool
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Display help if no arguments or help requested
if (command === 'help' || args.length === 0) {
  console.log('MCP Minion - Flexible client for MCP servers');
  console.log('\nUsage: mcp-minion <command> [args]');
  console.log('\nCommands:');
  console.log('  list                 - List available tools on the server');
  console.log('  call <tool> [args]   - Call a specific tool with JSON arguments');
  console.log('  help                 - Show this help message');
  console.log('\nExamples:');
  console.log('  mcp-minion list');
  console.log('  mcp-minion call list_directory "{\"path\":\"/path/to/dir\"}"');
  console.log('  mcp-minion call tcr "{\"comment\":\"Add new feature\"}"');
  process.exit(0);
}

async function main() {
  try {
    // Create the client
    const client = new Client(
      { name: "mcp-minion", version: "0.1.0" },
      { capabilities: {} }
    );
    
    // Create the transport
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()]
    });
    
    // Connect to server
    console.log('Connecting to MCP server...');
    await client.connect(transport);
    console.log('Connected!');
    
    try {
      // Process commands
      if (command === 'list') {
        // List available tools
        const toolsResult = await client.listTools();
        console.log('\nAvailable tools:');
        for (const tool of toolsResult.tools) {
          console.log(`- ${tool.name}${tool.description ? ': ' + tool.description : ''}`);
        }
      } 
      else if (command === 'call' && args.length >= 2) {
        const toolName = args[1];
        let toolArgs = {};
        
        // Parse tool arguments if provided
        if (args.length >= 3) {
          try {
            toolArgs = JSON.parse(args[2]);
          } catch (e) {
            console.error(`Error parsing arguments JSON: ${e.message}`);
            console.error('Arguments must be valid JSON');
            process.exit(1);
          }
        }
        
        console.log(`\nCalling tool: ${toolName}`);
        console.log(`Arguments: ${JSON.stringify(toolArgs)}`);
        
        // Call the requested tool
        const result = await client.callTool({
          name: toolName,
          arguments: toolArgs
        });
        
        // Display result
        console.log('\nResult:');
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item && typeof item === 'object' && 'type' in item && item.type === 'text' && 'text' in item) {
              console.log(item.text);
            } else {
              console.log('Non-text content:', item);
            }
          }
        } else {
          console.log(result);
        }
      }
      else {
        console.error(`Unknown command: ${command}`);
        console.log('Use "mcp-minion help" to see available commands');
      }
    } finally {
      // Always properly close connection
      console.log('\nDisconnecting...');
      await client.close();
      console.log('Done!');
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
