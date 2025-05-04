import fs from "fs";

const configPath = new URL(
  "../mcp-config.json",
  import.meta.url,
);
const config = JSON.parse(
  fs.readFileSync(configPath, "utf8"),
);

export const mcpServers = config.mcpServers;
export const servers = Object.keys(mcpServers);
