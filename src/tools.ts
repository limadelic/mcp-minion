import { argv } from './argv.js';

export async function list(client) {
  (await client.listTools())
  .tools.forEach(({name, description, inputSchema}) => console.log(
    `${name}\n  ${description}\n  ${JSON.stringify(inputSchema?.properties)}\n`
  ));
}

export async function call(client, name = argv.name, args = argv.args) {
  (await client.callTool({ name, arguments: args }))
    .content.forEach(item => console.log(item.text));
}
