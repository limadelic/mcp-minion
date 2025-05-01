import { help, docs } from './help.js';
import { mcpServers } from './config.js';
import { connect } from './client.js';

export default {
  help,
  docs,
  servers: () => console.log(Object.keys(mcpServers).join('\n')),
  run: ({server, command, args}) => connect(server, command, args)
};
