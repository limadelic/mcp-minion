import Conf from "conf";
import {
  server,
  name,
  args,
  url,
  headers,
} from "./argv.js";

const conf = new Conf({
  projectName: "mcp-minion",
});

export const mcpServers =
  conf.get("mcpServers") || {};

export const servers = Object.keys(mcpServers);

export function add() {
  if (url) {
    mcpServers[server] = {
      url,
      ...(Object.keys(headers).length > 0 && {
        headers,
      }),
    };
  } else {
    mcpServers[server] = {
      command: name,
      args,
    };
  }
  conf.set("mcpServers", mcpServers);
}

export function rm() {
  delete mcpServers[server];
  conf.set("mcpServers", mcpServers);
}
