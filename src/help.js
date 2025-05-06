import fs from "fs";
import * as config from "./conf.js";
import { log } from "./log.js";

function read(file) {
  console.log(
    fs.readFileSync(
      new URL(file, import.meta.url),
      "utf8",
    ),
  );
}

export function help() {
  read("../README.md");
}

export function servers() {
  log(config.servers);
}
