import { name, args, argv } from './argv.js';
import { client } from './client.js';

export async function list() {
  const result = await client.listTools();
  if (process.env.DEBUG) console.log(JSON.stringify(result, null, 2));
  
  for (const tool of result.tools) {
    console.log(`${tool.name}`);
    console.log(`  ${tool.description?.split('\n')[0] || ''}`);
    
    if (tool.inputSchema?.properties) {
      const required = tool.inputSchema.required || [];
      for (const [paramName, paramDetails] of Object.entries(tool.inputSchema.properties)) {
        const isRequired = required.includes(paramName) ? '*' : '';
        const paramType = 'any';
        console.log(`    ${paramName}${isRequired}: <${paramType}>`);
      }
    }
    console.log('');
  }
}

export async function call() {
  const toolArgs = args?.length > 0 ? JSON.parse(args[0]) : {};
  const result = await client.callTool({ name, arguments: toolArgs });
  
  const content = result?.content || [];
  for (const item of content) {
    if (item?.type === 'text' && item.text) {
      console.log(item.text);
    }
  }
}
