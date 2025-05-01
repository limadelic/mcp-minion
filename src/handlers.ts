import { help, dir } from './help.js';
import { mcpServers } from './config.js';
import { run } from './client.js';

export default {
  help,
  dir,
  servers: () => console.log(Object.keys(mcpServers).join('\n')),
  run: ({server, command, args}) => run(server, command, args)
};
