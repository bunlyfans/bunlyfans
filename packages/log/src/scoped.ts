import { isBun } from "process";
import { Config, Logger } from "./logger";

// TODO: add test when not in bun environment
if (!isBun) {
  throw new Error("That library can be used only within Bun environment!");
}

type ScopedConfig = Omit<Config, "scope"> & Required<Pick<Config, "scope">>;

export function Log(config: ScopedConfig): Logger {
  return new Logger(config);
}
