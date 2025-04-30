# Model Context Protocol (MCP) Specification

## What is MCP?

MCP is a standardized protocol that enables AI applications to connect to external tools, resources, and services. Think of it like USB-C for AI - a universal adapter that connects AI models to different data sources and tools.

## Core Architecture

At its core, MCP follows a client-server architecture:
```
Host with MCP Client (AI tools, IDEs) <--> MCP Protocol <--> MCP Servers <--> Data Sources/APIs
```

## Transport Layer

MCP supports two primary transport mechanisms:

1. **STDIO** (Standard Input/Output)
   - Uses standard input/output for communication
   - Ideal for local processes

2. **SSE** (Server-Sent Events) with HTTP
   - Uses Server-Sent Events for server-to-client messages
   - HTTP POST for client-to-client messages
   - Better for network-based communication

All transports use JSON-RPC 2.0 message format.

## Message Types

1. **Requests**: Expect a response
```json
{
  "id": "unique-id",
  "method": "category/operation",
  "params": { ... }
}
```

2. **Results**: Successful responses
```json
{
  "id": "matching-request-id",
  "result": { ... }
}
```

3. **Errors**: Failed requests
```json
{
  "id": "matching-request-id",
  "error": {
    "code": -32000,
    "message": "Error description"
  }
}
```

4. **Notifications**: One-way messages (no response)
```json
{
  "method": "notifications/category/event",
  "params": { ... }
}
```

## Connection Lifecycle

1. **Initialization**
   - Client sends `initialize` request with protocol version
   - Server responds with capabilities
   - Client sends `initialized` notification

2. **Message Exchange**
   - Request-Response pattern
   - One-way notifications

3. **Termination**
   - Clean shutdown via `close()`
   - Transport disconnection

## Core Features

### Tools

Tools are executable functions that servers expose to clients. They're designed to be model-controlled, allowing AI to take actions.

**Tool Definition:**
```typescript
{
  name: string;          // Unique identifier
  description?: string;  // Human-readable description
  inputSchema: {         // JSON Schema for parameters
    type: "object",
    properties: { ... }
  },
  annotations?: {        // Optional behavior hints
    title?: string;      
    readOnlyHint?: boolean;    // Doesn't modify environment
    destructiveHint?: boolean; // May perform destructive updates
    idempotentHint?: boolean;  // Repeated calls have no additional effect
    openWorldHint?: boolean;   // Interacts with external entities
  }
}
```

**Key Endpoints:**
- `tools/list`: Get available tools
- `tools/call`: Execute a tool with arguments

**Example Tool Implementation:**
```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "calculate_sum",
      description: "Add two numbers together",
      inputSchema: {
        type: "object",
        properties: {
          a: { type: "number" },
          b: { type: "number" }
        },
        required: ["a", "b"]
      }
    }]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "calculate_sum") {
    const { a, b } = request.params.arguments;
    return {
      content: [
        {
          type: "text",
          text: String(a + b)
        }
      ]
    };
  }
  throw new Error("Tool not found");
});
```

### Resources

Resources are data entities provided by MCP servers that clients can access and use.

**Resource Operations:**
- `resources/list`: List available resources
- `resources/get`: Retrieve a specific resource

**Example Resource Implementation:**
```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        id: "sample-data",
        title: "Sample Data",
        description: "Example dataset for demonstration"
      }
    ]
  };
});

server.setRequestHandler(GetResourceRequestSchema, async (request) => {
  if (request.params.id === "sample-data") {
    return {
      resource: {
        id: "sample-data",
        content: [
          {
            type: "text",
            text: "This is sample data content"
          }
        ]
      }
    };
  }
  throw new Error("Resource not found");
});
```

### Prompts

Prompts are reusable templates for generating AI responses.

**Prompt Operations:**
- `prompts/list`: List available prompt templates
- `prompts/get`: Retrieve a specific prompt template

### Sampling

Sampling allows servers to request that clients generate text using an LLM.

**Sampling Operations:**
- `sampling/createMessage`: Generate AI responses

**Request Example:**
```json
{
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "What files are in the current directory?"
        }
      }
    ],
    "systemPrompt": "You are a helpful assistant.",
    "includeContext": "thisServer"
  }
}
```

## Error Handling

MCP defines standard error codes:

```typescript
enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}
```

When returning tool errors:
1. Set `isError` to `true` in the result
2. Include error details in the `content` array

## Security Best Practices

- Validate all inputs
- Sanitize file paths and commands
- Implement proper authentication
- For local servers, bind only to localhost (127.0.0.1)
- Validate Origin headers for SSE transports
- Implement timeouts
- Rate limit requests

## Implementation Example

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "example-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Define your tools here

const transport = new StdioServerTransport();
server.listen(transport);
```

## Common Patterns

### Command Line Tool

```javascript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new Server({ name: "my-tool", version: "1.0.0" });

// Define tools that expose your CLI functionality

const transport = new StdioServerTransport();
server.listen(transport);
```

### Local Web Server

```javascript
import { Server } from "@modelcontextprotocol/sdk/server";
import { SseServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import express from "express";

const app = express();
const server = new Server({ name: "web-service", version: "1.0.0" });

// Define your tools

app.use("/mcp", SseServerTransport.createExpressMiddleware(server));
app.listen(3000, "127.0.0.1");
```

### Key Features

- **Tools**: Functions that can be called by AI systems
- **Resources**: Files, data, or context that can be accessed by AI systems
- **Prompts**: Reusable templates for generating AI responses
- **Sampling**: Controls for adjusting AI response generation
- **Roots**: Dynamic discovery of available servers and capabilities

### Transport Protocols

MCP supports two primary transport mechanisms:

1. **STDIO** (Standard Input/Output): For local process-to-process communication
2. **SSE** (Server-Sent Events): For network-based communication

## Message Format

All MCP messages use a JSON-based format:

### Request Format
```json
{
  "id": "unique-request-id",
  "method": "category/operation",
  "params": { ... }
}
```

### Response Format
```json
{
  "id": "matching-request-id",
  "result": { ... }
}
```

### Notification Format
```json
{
  "method": "notifications/category/event",
  "params": { ... }
}
```

## Core Operations

### Tool Operations

- `tools/list`: Get available tools from a server
- `tools/call`: Execute a tool with arguments

### Resource Operations

- `resources/list`: List available resources
- `resources/get`: Retrieve a specific resource

### Prompt Operations

- `prompts/list`: List available prompt templates
- `prompts/get`: Retrieve a specific prompt template

## Security Considerations

- MCP servers should validate all inputs
- Local STDIO servers should only bind to localhost (127.0.0.1)
- For SSE transports, validate Origin headers
- Implement proper authentication when needed

## Implementation Best Practices

- Handle errors gracefully with appropriate status codes
- Provide clear descriptions for tools and resources
- Use meaningful IDs for requests and resources
- Support incremental updates when possible
- Implement proper logging

## Client-Server Interaction Flow

1. Client connects to server via chosen transport
2. Client requests available tools/resources/prompts
3. Client uses these capabilities as needed
4. Server processes requests and returns results
5. Server may send notifications for state changes

## Error Handling

Errors should be returned with:
1. `isError` flag set to `true`
2. Error details in the `content` array

## Lifecycle Management

- Servers should send notifications when available tools or resources change
- Clients should handle connection interruptions gracefully
- Both should implement proper shutdown procedures