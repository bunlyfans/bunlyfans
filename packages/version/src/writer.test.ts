import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Reader } from "./reader";
import { Writer } from "./writer";
import { PackageModel } from "./model";

describe("writer", () => {
  const rootPath = "./src/mocks";
  let originalRoot: PackageModel;
  let originalPackages: PackageModel[];

  beforeEach(async () => {
    [originalRoot, originalPackages] = await new Reader(rootPath).read();
  });

  afterEach(async () => {
    await new Writer().write(originalRoot, ...originalPackages);
  });

  test("read current repo", async () => {
    const [root, packages] = await new Reader(rootPath).read();
    root.version = "0.0.0";
    packages.forEach((i) => (i.version = "0.0.0"));

    await new Writer().write(root, ...packages);

    const [updatedRoot, updatedPackages] = await new Reader(rootPath).read();

    expect(updatedRoot.version).toBe("0.0.0");
    expect(updatedPackages.map((i) => i.version)).toMatchObject([
      "0.0.0",
      "0.0.0",
    ]);
  });
});
