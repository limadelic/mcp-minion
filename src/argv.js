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

export const args =
  cmd === "run"
    ? JSON.parse(argv[2] || "{}")
    : argv.slice(3);

export default {
  cmd,
  server,
  resource,
  name,
  args,
};
