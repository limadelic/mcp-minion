import fs from "fs";
import * as config from "./conf.js";

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
  console.log(config.servers.join("\n"));
}
