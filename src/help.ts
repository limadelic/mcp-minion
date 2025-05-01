import fs from 'fs';
import { mcpServers } from './config.js';
import { connect } from './client.js';

function read(file) {
  console.log(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
}

export function help() {
  read('../README.md');
}

export async function dir() {
  for (const server of Object.keys(mcpServers))
    await connect(server, 'tools', []);
}
