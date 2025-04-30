import fs from 'fs';

function read(file) {
  console.log(fs.readFileSync(new URL(file, import.meta.url), 'utf8'));
}

export function help() {
  read('../README.md');
}

export function docs() {
  read('../docs/mcp/client.md');
}
