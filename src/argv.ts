import { mcpServers } from './config.js';

const params = process.argv.slice(2);
const arg = params.length === 0 ? 'help' : params[0]; 
const servers = Object.keys(mcpServers);

const cmds = ['help', 'dir', 'servers'];
const isCmd = cmds.includes(arg);
const isServer = servers.includes(arg);

export const cmd = isCmd ? arg : !isServer ? 'help' : 'run';

export const server = isServer ? arg : null;
export const resource = isServer ? (params[1] || 'tools') : null;
export const name = isServer ? params[2] : null;
export const args = isServer ? params.slice(3) : null;

export const argv = { server, resource, name, args, cmd };