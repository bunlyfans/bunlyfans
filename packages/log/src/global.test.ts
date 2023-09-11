import { expect, test } from "bun:test";
import "./global";
import { Logger } from "./logger";

test("can use default logger", () => {
  expect(log).toBeInstanceOf(Logger);
});
