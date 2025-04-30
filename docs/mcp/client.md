# MCP Client Implementation Guide

## What is MCP?

Model Context Protocol (MCP) is a standardized way for AI applications to connect to external tools, resources, and prompts. It follows a client-server architecture where AI applications (clients) can connect to multiple data sources and function providers (servers).

## Client Architecture Overview

A complete MCP client implementation consists of:

1. **Transport Layer**: Handles the raw communication (STDIO or SSE)
2. **Protocol Layer**: Manages message formatting, request/response matching, and timeouts
3. **Feature Support**: Implements specific MCP features (tools, resources, prompts, etc.)
4. **Error Handling**: Manages protocol errors, timeouts, and server failures

## Connection Methods

### STDIO Transport

Used for local process-to-process communication:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";

// Create transport for a child process
const childProcess = spawn("server-executable", ["--args"]);
const transport = new StdioClientTransport(childProcess);

// Initialize client
const client = new Client();
client.connect(transport);
```

### SSE Transport

Used for network communication:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client";
import { SseClientTransport } from "@modelcontextprotocol/sdk/client/sse";

// Create transport for HTTP endpoint
const transport = new SseClientTransport("http://localhost:3000/mcp");

// Optional auth header
transport.setHeader("Authorization", "Bearer token");

// Initialize client
const client = new Client();
client.connect(transport);
```

## Connection Lifecycle

### 1. Initialization

```typescript
// Connect to transport
const client = new Client();
await client.connect(transport);

// Initialize connection
const initResult = await client.initialize({
  protocolVersion: "0.9.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
});

// Send initialized notification
await client.sendInitialized();

// Now the connection is ready for use
```

### 2. Feature Discovery

```typescript
// Discover available tools
const toolsResult = await client.listTools();

// Discover available resources
const resourcesResult = await client.listResources();

// Discover available prompts
const promptsResult = await client.listPrompts();
```

### 3. Termination

```typescript
// Graceful shutdown
await client.shutdown();

// Or forced close
client.close();
```

## Core MCP Operations

### Tools

**List available tools:**
```typescript
const response = await client.request({
  method: "tools/list"
});

const tools = response.result.tools;
```

**Call a tool:**
```typescript
const response = await client.request({
  method: "tools/call",
  params: {
    name: "example_tool",
    arguments: {
      param1: "value1",
      param2: 42
    }
  }
});

const result = response.result.content;
```

### Resources

**List available resources:**
```typescript
const response = await client.request({
  method: "resources/list"
});

const resources = response.result.resources;
```

**Get a resource:**
```typescript
const response = await client.request({
  method: "resources/get",
  params: {
    id: "resource-id"
  }
});

const resource = response.result.resource;
```

### Prompts

**List available prompts:**
```typescript
const response = await client.request({
  method: "prompts/list"
});

const prompts = response.result.prompts;
```

**Get a prompt:**
```typescript
const response = await client.request({
  method: "prompts/get",
  params: {
    id: "prompt-id"
  }
});

const prompt = response.result.prompt;
```

### Sampling

**Create a message (generate text):**
```typescript
const response = await client.request({
  method: "sampling/createMessage",
  params: {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "What files are in the current directory?"
        }
      }
    ],
    systemPrompt: "You are a helpful assistant.",
    includeContext: "thisServer",
    temperature: 0.7,
    maxTokens: 500
  }
});

const message = response.result;
```

## Error Handling

### Standard Error Codes

```typescript
enum ErrorCode {
  ParseError = -32700,        // Invalid JSON
  InvalidRequest = -32600,    // Invalid request object
  MethodNotFound = -32601,    // Method doesn't exist
  InvalidParams = -32602,     // Invalid parameters
  InternalError = -32603,     // Internal server error
  ServerNotInitialized = -32002, // Server not initialized
  UnknownErrorCode = -32001   // Unknown error
}
```

### Error Response Example

```json
{
  "id": "call-123",
  "error": {
    "code": -32602,
    "message": "Invalid parameters",
    "data": {
      "details": "Parameter 'param1' is required"
    }
  }
}
```

### Client-side Error Handling

```typescript
try {
  const response = await client.request({
    method: "tools/call",
    params: {
      name: "example_tool",
      arguments: { /* ... */ }
    }
  });
  
  // Process successful response
  processResult(response.result);
  
} catch (error) {
  if (error instanceof ProtocolError) {
    // Handle protocol-level errors
    console.error(`Protocol error ${error.code}: ${error.message}`);
    if (error.data) {
      console.error("Details:", error.data);
    }
  } else if (error instanceof TimeoutError) {
    // Handle timeout errors
    console.error(`Request timed out after ${error.timeoutMs}ms`);
  } else {
    // Handle other errors (transport failures, etc.)
    console.error("Unexpected error:", error);
  }
}
```

## Advanced Client Features

### Request Timeouts

```typescript
const response = await client.request(
  { method: "tools/call", /* ... */ },
  { timeoutMs: 5000 } // 5 second timeout
);
```

### Notification Handling

```typescript
// Set up notification handler
client.onNotification("notifications/resources/changed", (params) => {
  console.log("Resource changed:", params.id);
  // Update client state accordingly
});

// Set up handler for all notifications
client.onAnyNotification((method, params) => {
  console.log(`Received notification: ${method}`);
});
```

### Progress Reporting

```typescript
// Set up progress handler for long-running operations
await client.request(
  { method: "tools/call", /* ... */ },
  {
    onProgress: (progress) => {
      updateProgressBar(progress.percentage);
      showMessage(progress.message);
    }
  }
);
```

## Implementing a Complete Client

```typescript
import { Client } from "@modelcontextprotocol/sdk/client";
import { SseClientTransport } from "@modelcontextprotocol/sdk/client/sse";

export class McpClient {
  private client: Client;
  private connected = false;
  
  constructor() {
    this.client = new Client();
    
    // Set up global error handler
    this.client.onError((error) => {
      console.error("MCP error:", error);
    });
    
    // Set up disconnect handler
    this.client.onDisconnect(() => {
      this.connected = false;
      console.log("Disconnected from server");
    });
  }
  
  async connect(serverUrl: string, authToken?: string): Promise<void> {
    try {
      // Create transport
      const transport = new SseClientTransport(serverUrl);
      
      // Set auth if provided
      if (authToken) {
        transport.setHeader("Authorization", `Bearer ${authToken}`);
      }
      
      // Connect to transport
      await this.client.connect(transport);
      
      // Initialize connection
      await this.client.initialize({
        protocolVersion: "0.9.0",
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
          sampling: {}
        }
      });
      
      // Send initialized notification
      await this.client.sendInitialized();
      
      this.connected = true;
      console.log("Connected to MCP server");
      
    } catch (error) {
      console.error("Failed to connect:", error);
      throw error;
    }
  }
  
  async listTools(): Promise<Tool[]> {
    this.ensureConnected();
    const response = await this.client.request({ method: "tools/list" });
    return response.result.tools;
  }
  
  async callTool(name: string, args: any): Promise<any> {
    this.ensureConnected();
    const response = await this.client.request({
      method: "tools/call",
      params: {
        name,
        arguments: args
      }
    });
    return response.result.content;
  }
  
  // Add methods for resources, prompts, sampling, etc.
  
  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.shutdown();
      this.connected = false;
      console.log("Disconnected from server");
    }
  }
  
  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error("Not connected to MCP server");
    }
  }
}
```

## Security Best Practices

1. **Validate server responses** against expected schemas
2. **Sanitize data** before displaying or processing
3. **Use HTTPS** for SSE connections
4. **Implement timeouts** for all requests
5. **Validate server certificates** for SSE connections
6. **Handle connection errors** gracefully
7. **Implement rate limiting** for requests
8. **Secure authentication tokens**
9. **Validate transport security** (e.g., only connect to localhost for sensitive operations)
10. **Log security events** for monitoring

## Debugging Tips

1. Enable verbose logging in the transport layer
2. Log all requests and responses during development
3. Use a network monitor to inspect SSE traffic
4. Implement connection health checks
5. Test with deliberately malformed messages to ensure error handling
