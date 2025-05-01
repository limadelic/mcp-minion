import { data } from './argv.js';

export async function list() {
  const result = await data.client.listTools();
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
  const toolArgs = data.cmdArgs?.length > 0 ? JSON.parse(data.cmdArgs[0]) : {};
  const result = await data.client.callTool({ name: data.name, arguments: toolArgs });
  
  const content = result?.content || [];
  for (const item of content) {
    if (item?.type === 'text' && item.text) {
      console.log(item.text);
    }
  }
}
