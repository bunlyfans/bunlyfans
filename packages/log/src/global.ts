import { isBun } from "process";
import { Logger } from "./logger";

// TODO: add test when not in bun environment
if (!isBun) {
  throw new Error("That library can be used only within Bun environment!");
}

declare global {
  var log: Logger;
}

// TODO: Add support for global log configuration
global.log = new Logger();
