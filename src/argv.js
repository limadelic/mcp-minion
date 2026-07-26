import { servers } from "./conf.js";

const argv = process.argv.slice(2);

export const cmd = [
  "servers",
  "add",
  "rm",
].includes(argv[0])
  ? argv[0]
  : servers.includes(argv[0])
    ? "run"
    : "help";

export const server = argv[cmd === "run" ? 0 : 1];

export const resource = "tools";

export const name = argv[cmd === "run" ? 1 : 2];

const isUrl = name?.match(/^https?:\/\//);

export const url = isUrl ? name : null;

export const headers =
  isUrl && cmd === "add"
    ? parseHeaders(argv.slice(3))
    : {};

export const args =
  cmd === "run"
    ? JSON.parse(argv[2] || "{}")
    : isUrl
      ? {}
      : argv.slice(3);

function parseHeaders(args) {
  const headers = {};
  for (let i = 0; i < args.length; i += 2) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (value) headers[key] = value;
    }
  }
  return headers;
}

export default {
  cmd,
  server,
  resource,
  name,
  url,
  headers,
  args,
};
