import { mcpServers } from './config.js';

const args = process.argv.slice(2);
let command;

if (args.length === 0) {
  command = { cmd: 'help' };
} else if (args[0] === 'docs') {
  command = { cmd: 'docs' };
} else if (args[0] === 'servers') {
  command = { cmd: 'servers' };
} else {
  const isServer = Object.keys(mcpServers).includes(args[0]);
  command = { 
    cmd: 'run',
    args: {
      server: isServer ? args[0] : Object.keys(mcpServers)[0],
      command: isServer ? args[1] : args[0],
      args: isServer ? args.slice(2) : args.slice(1)
    }
  };
}

export default command;
