import { argv } from "./argv.js";
import yaml from "js-yaml";

export async function list(client) {
  (await client.listTools()).tools.forEach(({ name, description }) =>
    console.log(yaml.dump({ name, description })),
  );
}

async function needsArg(client, name, args) {
  if (Object.keys(args).length > 0) return false;

  const tools = await client.listTools();
  const tool = tools?.tools.find(t => t.name === name);
  if (tool?.inputSchema?.required?.length === 0) return false;

  console.log(yaml.dump(tool));
  return true;
}

export async function call(client, name = argv.name, args = argv.args) {
  (await needsArg(client, name, args)) ||
    (await client.callTool({ name, arguments: args })).content.forEach(item =>
      console.log(yaml.dump(item)),
    );
}
