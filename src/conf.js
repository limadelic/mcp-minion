import Conf from "conf";
import {
  server,
  name,
  args,
  envs,
} from "./argv.js";

const conf = new Conf({
  projectName: "mcp-minion",
});

export const mcpServers =
  conf.get("mcpServers") || {};

export const servers = Object.keys(mcpServers);

export function add() {
  mcpServers[server] = {
    command: name,
    args,
    env: envs,
  };
  conf.set("mcpServers", mcpServers);
}

export function rm() {
  delete mcpServers[server];
  conf.set("mcpServers", mcpServers);
}
