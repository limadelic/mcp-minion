import { help, docs } from './help.js';
import { mcpServers } from './config.js';
import { connect } from './client.js';

export const handlers = {
  help: { run: args => help() },
  docs: { run: args => docs() },
  servers: { run: args => console.log(Object.keys(mcpServers).join('\n')) },
  run: { run: args => connect(args.server, args.command, args.args) }
};
