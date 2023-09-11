import { describe, expect, mock, test } from "bun:test";
import { Manager } from "./manager";
import { PackageModel } from "./model";
import { Strategy } from "./monorepo";

// TODO: fix types/mocks when will be implemented

const readerMock = mock(() => ({
  read: () =>
    Promise.resolve([
      new PackageModel("root", "1.2.3", null as any),
      [new PackageModel("dep", "1.1.0", null as any)],
    ]),
})) as any;

const writerMock = mock((callback) => ({
  write: (...packages: PackageModel[]) => {
    callback(packages);
  },
})) as any;

describe("manager", () => {
  test("should update according to Simultaneous strategy", async (done) => {
    const manager = new Manager(
      readerMock(),
      writerMock((packages: PackageModel[]) => {
        expect(packages[0].version).toEqual("1.3.0");
        expect(packages[1].version).toEqual("1.3.0");
        done();
      })
    );
    await manager.read();
    await manager.up(Strategy.Simultaneous, "minor");
  });

  test("should update according to Independent strategy", async (done) => {
    const manager = new Manager(
      readerMock(),
      writerMock((packages: PackageModel[]) => {
        expect(packages[0].version).toEqual("1.3.0");
        expect(packages[1].version).toEqual("1.2.0");
        done();
      })
    );
    await manager.read();
    await manager.up(Strategy.Independent, "minor");
  });
});
