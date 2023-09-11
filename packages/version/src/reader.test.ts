import { describe, expect, test } from "bun:test";
import { Reader } from "./reader";

describe("reader", () => {
  test("read current repo", async () => {
    const rootVersion = new Reader("./src/mocks");
    const [root, packages] = await rootVersion.read();

    // to not local path to snapshot
    root.file = null as any;
    packages.forEach((i) => (i.file = null as any));

    expect(root).toMatchSnapshot();
    expect(packages).toMatchSnapshot();
  });
});
