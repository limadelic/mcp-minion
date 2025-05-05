import * as argv from "./argv.js";
import { log } from "./log.js";
import _ from "lodash";

async function tools(client) {
  return _.get(
    await client.listTools(),
    "tools",
    [],
  );
}

export async function list(client) {
  log(await tools(client), [
    "name",
    "description",
  ]);
}

async function needsArg(client, name, args) {
  if (!_.isEmpty(args)) return;

  const tool = _.find(await tools(client), {
    name,
  });

  if (!tool?.inputSchema?.required?.length)
    return;

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
