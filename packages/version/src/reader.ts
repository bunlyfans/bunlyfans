import { Log } from "@bunlyfans/log/local";
import { PackageModel } from "./model";
import * as fs from "fs/promises";
import * as path from "path";

const log = Log({ scope: "Reader" });

export class Reader {
  constructor(private rootPath: string) {}

  async read(): Promise<[PackageModel, PackageModel[]]> {
    const root = await this.readFile(path.join(this.rootPath, "package.json"));

    const packages: PackageModel[] = [];

    if (root.workspaces) {
      for (const workspace of root.workspaces) {
        const packagesInWorkspace = await this.findInWorkspace(workspace);
        packages.push(...packagesInWorkspace);
      }
    }

    return [root, packages];
  }

  private async readFile(filePath: string): Promise<PackageModel> {
    try {
      const file = Bun.file(filePath);
      const data = await file.json();
      return new PackageModel(data.name, data.version, file, data.workspaces);
    } catch (error) {
      log.e(`Error while reading ${filePath}`);
      throw error;
    }
  }

  private async findInWorkspace(workspace: string): Promise<PackageModel[]> {
    try {
      const packagesPath = path.join(
        this.rootPath,
        workspace.replace(/\*/g, "")
      );

      // read the packages directory
      const packageDirs = await fs.readdir(packagesPath);

      const packages = [];

      for (const dir of packageDirs) {
        const packageJsonPath = path.join(packagesPath, dir, "package.json");
        packages.push(await this.readFile(packageJsonPath));
      }

      return packages;
    } catch (error) {
      log.e(`Error while reading ${workspace}`);
      throw error;
    }
  }
}
