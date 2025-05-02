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
  (await client.callTool({ name, arguments: args })).content.forEach(item =>
    console.log(yaml.dump(item)),
  );
}
