import { mcpServers } from './config.js';

const args = process.argv.slice(2);
const arg = args.length === 0 ? 'help' : args[0];
const servers = Object.keys(mcpServers);

const cmds = ['help', 'dir', 'servers'];
const isCmd = cmds.includes(arg);
const isServer = servers.includes(arg);

// Global state object that can be shared and modified
const data = {
  server: isServer ? arg : null,
  resource: isServer ? (args[1] || 'tools') : null,
  name: isServer ? args[2] : null,
  cmdArgs: isServer ? args.slice(3) : null,
  client: null
};

// Figure out which handler to use
const cmd = isCmd ? arg : !isServer ? 'help' : 'run';

export { data, cmd };
