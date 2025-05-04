import Conf from "conf";

const conf = new Conf();

export const mcpServers =
  conf.get("mcpServers") || {};
export const servers = Object.keys(mcpServers);
