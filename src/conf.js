import Conf from "conf";
import { server, name, args } from "./argv.js";

const conf = new Conf({
  projectName: "mcp-minion",
});

export const mcpServers =
  conf.get("mcpServers") || {};

export const servers = Object.keys(mcpServers);

export function add() {
  mcpServers[server] = { command: name, args };
  conf.set("mcpServers", mcpServers);
}

export function rm() {
  delete mcpServers[server];
  conf.set("mcpServers", mcpServers);
}
