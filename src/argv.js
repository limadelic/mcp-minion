import { servers } from "./conf.js";

const argv = process.argv.slice(2);

function getCmd() {
  return ["help", "servers", "add"].includes(
    argv[0],
  )
    ? argv[0]
    : servers.includes(argv[0])
      ? "run"
      : "help";
}

export const cmd = getCmd();

function getServer() {
  return cmd === "run" ? argv[0] : argv[1];
}

export const server = getServer();

export const resource = "tools";

function getName() {
  return cmd === "run" ? argv[1] : argv[2];
}

export const name = getName();

function getArgs() {
  return cmd === "run" ? argv[2] : argv[3];
}

export const args = getArgs();

export default {
  cmd,
  server,
  resource,
  name,
  args,
};
