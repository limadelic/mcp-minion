import * as argv from "./argv.js";
import { log } from "./log.js";
import _ from "lodash";

export async function list(client) {
  const tools = _.get(
    await client.listTools(),
    "tools",
    [],
  );
  log(tools, ["name", "description"]);
}

async function needsArg(client, name, args) {
  if (!_.isEmpty(args)) return false;

  const tools = await client.listTools();
  const tool = _.find(_.get(tools, "tools", []), {
    name,
  });

  if (
    _.isEmpty(_.get(tool, "inputSchema.required"))
  )
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

  const { content } = await client.callTool({
    name,
    arguments: args,
  });

  log(content);
}
