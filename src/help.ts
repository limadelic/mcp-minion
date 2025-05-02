import fs from 'fs';
import { mcpServers } from './config.js';
import { run } from './client.js';
import { argv } from './argv.js';

function read(file) {
  console.log(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
}

export function help() {
  read('../README.md');
}

export async function dir() {
  for (const server of Object.keys(mcpServers)) {
    argv.server = server;
    argv.resource = 'tools';
    argv.name = null;
    argv.args = [];
    await run();
  }
}
