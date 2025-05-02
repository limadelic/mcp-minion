import fs from "fs";
import * as config from "./config.js";
import { run } from "./client.js";

function read(file) {
  console.log(fs.readFileSync(new URL(file, import.meta.url), "utf8"));
}

export function help() {
  read("../README.md");
}

export async function dir() {
  for (const server of config.servers) {
    console.log(`\n${server}:\n`);
    await run(server);
  }
}

export function servers() {
  console.log(config.servers.join("\n"));
}
