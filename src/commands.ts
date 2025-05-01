import { mcpServers } from './config.js';

const args = process.argv.slice(2);
const cmd = args.length === 0 ? 'help' : args[0];
const servers = Object.keys(mcpServers);

const cmds = ['help', 'dir', 'servers'];
const isCmd = cmds.includes(cmd);
const isServer = servers.includes(cmd);

const result = isCmd
  ? { cmd }
  : !isServer 
    ? { cmd: 'help' }
    : {
        cmd: 'run',
        args: {
          server: cmd,
          command: args[1],
          args: args.slice(2)
        }
      };

export default result;
