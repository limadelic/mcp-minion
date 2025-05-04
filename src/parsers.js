import { mcpServers } from "./config.js";

export default {
  help: () => ({ cmd: "help" }),
  docs: () => ({ cmd: "docs" }),
  servers: () => ({ cmd: "servers" }),
  parse: args => {
    const isServer = Object.keys(
      mcpServers,
    ).includes(args[0]);
    return {
      cmd: "run",
      args: {
        server: isServer
          ? args[0]
          : Object.keys(mcpServers)[0],
        command: isServer ? args[1] : args[0],
        args: isServer
          ? args.slice(2)
          : args.slice(1),
      },
    };
  },
};
