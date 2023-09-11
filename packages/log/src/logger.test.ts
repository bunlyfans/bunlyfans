import {
  Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  spyOn,
  test,
} from "bun:test";
import { Config, Logger } from "./logger";

describe("Logger", () => {
  test("can create default instance", () => {
    const logger = new Logger();
    expect(logger).toBeDefined();
  });

  test("has aliases", () => {
    const logger = new Logger();
    expect(logger.s).toBe(logger.success);
    expect(logger.l).toBe(logger.log);
    expect(logger.i).toBe(logger.info);
    expect(logger.d).toBe(logger.debug);
    expect(logger.e).toBe(logger.error);
    expect(logger.w).toBe(logger.warn);
    expect(logger.ok).toBe(logger.success);
    expect(logger.o).toBe(logger.success);
  });

  // msg, supportColor, config
  describe.each(<[string, boolean, Config | undefined][]>[
    ["with color", true, undefined],
    ["with color and scope", true, <Config>{ scope: "My Scope" }],
    ["without color", false, undefined],
    ["without color but with scope", false, <Config>{ scope: "My Scope" }],
    ["with disabled color", true, <Config>{ disableColor: true }],
  ])("%s", (_msg, supportColor, config) => {
    // Usage of describe.each is a workaround until `mock.restoreAllMocks()` is implemented
    describe.each(<[keyof Logger, keyof Console][]>[
      ["s", "log"],
      ["l", "log"],
      ["i", "log"],
      ["d", "debug"],
      ["e", "error"],
      ["w", "warn"],
    ])(
      "logger.%s('test') should trigger console.%s",
      (callMethod, spyMethod) => {
        let spy: Mock<(typeof console)[keyof Console]>;
        let hasColors: Mock<any>;
        let logger: Logger;

        beforeEach(() => {
          spy = spyOn(global.console, spyMethod);
          hasColors = spyOn(process.stdout, "hasColors");
          hasColors.mockReturnValue(supportColor);
          logger = new Logger(config as Config | undefined);
        });

        afterEach(() => {
          spy.mockRestore();
          hasColors.mockRestore();
        });

        test.each<[string, any]>([
          ["string", "test"],
          ["number", 1],
          ["boolean", true],
          ["undefined", undefined],
          ["null", null],
          ["object", { a: 1, b: "2", c: true }],
          ["array", [1, "2", true]],
        ])("%s", (_type, value) => {
          logger[callMethod](value);
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy.mock.lastCall).toMatchSnapshot();
        });

        test("several items", () => {
          logger[callMethod](1, "2", true);
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy.mock.lastCall).toMatchSnapshot();
        });
      }
    );
  });
});
