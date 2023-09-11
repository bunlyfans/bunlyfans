import { BunFile } from "bun";

export class PackageModel {
  public originalVersion: string;

  constructor(
    public name: string,
    public version: string,
    public file: BunFile,
    public workspaces?: string[]
  ) {
    this.originalVersion = version;
  }
}
