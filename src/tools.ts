import { argv } from "./argv.js";
import yaml from "js-yaml";

export async function list(client) {
  (await client.listTools()).tools.forEach(tool =>
    console.log(
      yaml.dump({
        name: tool.name,
        description: tool.description,
      }),
    ),
  );
}

export async function call(client, name = argv.name, args = argv.args) {
  if (Object.keys(args).length === 0) {
    const tools = await client.listTools();
    const tool = tools.tools.find(t => t.name === name);
    if (tool) console.log(yaml.dump(tool));
    return;
  }
  (await client.callTool({ name, arguments: args })).content.forEach(item =>
    console.log(yaml.dump(item)),
  );
}
