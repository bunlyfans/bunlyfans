import { expect, test } from "bun:test";
import "./global";
import { Logger } from "./logger";

test("can create scopped logger", async () => {
  const { Log } = await import("./scoped");
  const logger = Log({ scope: "test" });
  expect(logger).toBeInstanceOf(Logger);
});
