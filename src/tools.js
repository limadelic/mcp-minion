import * as argv from "./argv.js";
import { log } from "./log.js";

export async function list(client) {
  const tools = (await client.listTools()).tools;
  log(tools, ["name", "description"]);
}

async function needsArg(client, name, args) {
  if (Object.keys(args).length > 0) return false;

  const tools = await client.listTools();
  const tool = tools?.tools.find(
    t => t.name === name,
  );
  if (!tool?.inputSchema?.required?.length)
    return false;

  log(tool);
  return true;
}

export async function call(
  client,
  name = argv.name,
  args = argv.args,
) {
  if (await needsArg(client, name, args)) return;

  const result = await client.callTool({
    name,
    arguments: args,
  });

  log(result.content);
}
