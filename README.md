# MCP Minion

A minimal, standards-compliant MCP client that follows the official Model Context Protocol specification exactly.

## Features

- Connects to MCP servers using STDIO transport
- Lists available tools on any MCP server
- Calls any tool with JSON arguments
- Returns nicely formatted results
- No configuration needed - just works

## Installation

```bash
npm install -g mcp-minion
```

## Usage

### List available tools

```bash
mcp-minion list
```

### Call a tool

```bash
mcp-minion call list_directory '{"path":"/path/to/directory"}'
```

### Get help

```bash
mcp-minion help
```

## Examples

List directory contents:

```bash
mcp-minion call list_directory '{"path":"."}'
```

Read a file:

```bash
mcp-minion call read_file '{"path":"./package.json"}'
```

## License

MIT
