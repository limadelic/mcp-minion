import fs from "fs";
import * as config from "./conf.js";
import { log } from "./log.js";

const read = file =>
  fs.readFileSync(
    new URL(file, import.meta.url),
    "utf8",
  );

export const help = () =>
  log(read("../README.md"));

export const servers = () =>
  log(config.mcpServers);
