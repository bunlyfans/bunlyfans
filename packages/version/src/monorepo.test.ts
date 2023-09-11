import { BunFile } from "bun";
import { describe, expect, test } from "bun:test";
import { PackageModel } from "./model";
import { independentSemver, simultaneousSemver } from "./monorepo";
import { Command } from "./semver";

const fileMock: BunFile = null as any;

describe("monorepo", () => {
  describe("simultaneousSemver", () => {
    test("should update all package versions to the same new version", () => {
      const rootVersion = new PackageModel("", "1.2.3", fileMock);
      const packagesVersions = [
        new PackageModel("packageA", "1.2.3", fileMock),
        new PackageModel("packageB", "1.2.4", fileMock),
        new PackageModel("packageC", "1.3.0", fileMock),
      ];
      const command: Command = "minor";
      const expected = {
        packageA: "1.3.0",
        packageB: "1.3.0",
        packageC: "1.3.0",
      };
      simultaneousSemver(rootVersion, packagesVersions, command);
      expect(packagesVersions[0].version).toEqual(expected.packageA);
      expect(packagesVersions[1].version).toEqual(expected.packageB);
      expect(packagesVersions[2].version).toEqual(expected.packageC);
    });
  });

  describe("independentSemver", () => {
    test("should update each package version independently", () => {
      const packagesVersions = [
        new PackageModel("packageA", "1.2.3", fileMock),
        new PackageModel("packageB", "1.2.4", fileMock),
        new PackageModel("packageC", "1.3.0", fileMock),
      ];
      const command: Command = "minor";
      const expected = {
        packageA: "1.3.0",
        packageB: "1.3.0",
        packageC: "1.4.0",
      };
      independentSemver(packagesVersions, command);
      expect(packagesVersions[0].version).toEqual(expected.packageA);
      expect(packagesVersions[1].version).toEqual(expected.packageB);
      expect(packagesVersions[2].version).toEqual(expected.packageC);
    });
  });
});
