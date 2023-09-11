import { Log } from "@bunlyfans/log/scoped";
import { Strategy, independentSemver, simultaneousSemver } from "./monorepo";
import { Reader } from "./reader";
import { Command } from "./semver";
import { Writer } from "./writer";
import { PackageModel } from "./model";

const log = Log({ scope: "" });

export class Manager {
  private root: PackageModel;
  private packages: PackageModel[];

  constructor(private reader: Reader, private writer: Writer) {
    this.root = new PackageModel("", "", null as any);
    this.packages = [];
  }

  async read(): Promise<void> {
    [this.root, this.packages] = await this.reader.read();
    if (this.root.workspaces) {
      log.i("Monorepo detected");
    }
  }

  async up(strategy: Strategy, command: Command): Promise<void> {
    if (strategy === Strategy.Independent) {
      independentSemver([this.root, ...this.packages], command);
    }
    if (strategy === Strategy.Simultaneous) {
      simultaneousSemver(this.root, this.packages, command);
    }
    await this.writer.write(this.root, ...this.packages);
  }

  async upOnly(name: string, command: Command): Promise<void> {
    const singlePackage = this.packages.find(i => i.name.endsWith(name));

    if (!singlePackage || !name) {
      log.e(`Package ${name} not found`);
      throw new Error(`Package ${name} not found`);
    }

    independentSemver([singlePackage], command);

    await this.writer.write(this.root, ...this.packages);
  }

  async prettyprint(): Promise<void> {
    log.l();
    const packages = [this.root, ...this.packages];
    const maxOldLength = Math.max(
      ...packages.map((i) => i.originalVersion.length)
    );
    const maxNewLength = Math.max(...packages.map((i) => i.version.length));

    const build = (o: string, n: string, p: string) => {
      return (
        "" +
        (o + " ".repeat(maxOldLength - o.length) + " | ") +
        (n + " ".repeat(maxNewLength - n.length) + " | ") +
        p
      );
    };

    log.l(build("Old", "New", "Package"));
    for (const item of packages) {
      log.l(build(item.originalVersion, item.version, item.name));
    }
    log.l();
  }
}
