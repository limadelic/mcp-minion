import Conf from "conf";

const conf = new Conf({
  projectName: "mcp-minion",
});

export const mcpServers =
  conf.get("mcpServers") || {};
export const servers = Object.keys(mcpServers);
