import { describe, expect, test } from "bun:test";
import { Command, semver } from "./semver";

describe("semver", () => {
  test.each([
    ["1.2.3", "major", "2.0.0"],
    ["1.2.3", "minor", "1.3.0"],
    ["1.2.3", "patch", "1.2.4"],
  ])("should increment %s version to %s", (version, command, expected) => {
    expect(semver(version, command as Command)).toBe(expected);
  });

  test.each([
    ["1.2", "patch", "Invalid version format"],
    ["1.2.3", "invalid", "Invalid command"],
  ])("should throw error for %s", (version, command, expected) => {
    expect(() => semver(version, command as Command)).toThrow(expected);
  });
});
