#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import fs from 'fs';
import path from 'path';
import { docs } from './help.js';

const args = process.argv.slice(2);
let server, command, rest;

if (args.length === 0) process.exit(0);

const configPath = process.env.MCP_CONFIG || path.join(process.cwd(), 'mcp-config.json');
let mcpServers = {};

if (fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    mcpServers = config.mcpServers || {};
  } catch (e) { /* use default */ }
}

// Handle command parsing
if (args[0] === 'docs') {
  docs();
  process.exit(0);
} else if (args[0] === 'servers') {
  // List available servers
  const serverNames = Object.keys(mcpServers);
  if (serverNames.length) {
    console.log(serverNames.join('\n'));
  }
  process.exit(0);
} else if (Object.keys(mcpServers).includes(args[0])) {
  // First arg is a server name
  server = args[0];
  command = args[1];
  rest = args.slice(2);
} else {
  // First arg is a command, use first server in config or fail
  const serverNames = Object.keys(mcpServers);
  if (serverNames.length === 0) {
    console.error('No MCP servers configured. Create a mcp-config.json file.');
    process.exit(1);
  }
  server = serverNames[0];
  command = args[0];
  rest = args.slice(1);
}

async function main() {
  try {
    // Get server config
    const serverConfig = mcpServers[server];

    // Connect to server
    const client = new Client({ name: "mcp-minion", version: "0.1.0" }, { capabilities: {} });
    const transport = new StdioClientTransport(serverConfig);
    await client.connect(transport);
    
    try {
      if (command === 'tools') {
        // List tools
        const result = await client.listTools();
        for (const tool of result.tools) {
          console.log(tool.name);
        }
      } else if (command === 'call' && rest.length > 0) {
        // Call tool
        const toolName = rest[0];
        const toolArgs = rest.length > 1 ? JSON.parse(rest[1]) : {};
        
        const result = await client.callTool({ name: toolName, arguments: toolArgs });
        
        // Output results
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

main();
