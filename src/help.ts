import fs from 'fs';
import { mcpServers } from './config.js';
import { run } from './client.js';
import { data } from './argv.js';

function read(file) {
  console.log(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
}

export function help() {
  read('../README.md');
}

export async function dir() {
  for (const server of Object.keys(mcpServers)) {
    data.server = server;
    data.resource = 'tools';
    data.name = null;
    data.cmdArgs = [];
    await run();
  }
}
