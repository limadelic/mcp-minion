import { mcpServers } from './config.js';

const args = process.argv.slice(2);
const cmd = args.length === 0 ? 'help' : args[0];
const servers = Object.keys(mcpServers);

const cmds = ['help', 'docs', 'servers'];
const isServer = servers.includes(cmd);

const result = cmds.includes(cmd)
  ? { cmd }
  : {
      cmd: 'run',
      args: {
        server: isServer ? cmd : servers[0],
        command: isServer ? args[1] : cmd,
        args: isServer ? args.slice(2) : args.slice(1)
      }
    };

export default result;
