import { PackageModel } from "./model";
import { Command, semver } from "./semver";

export enum Strategy {
  Simultaneous = "simultaneous",
  Independent = "independent",
}

/**
 * Update all packages versions to the same value
 */
export function simultaneousSemver(
  root: PackageModel,
  packages: PackageModel[],
  command: Command
): void {
  root.version = semver(root.version, command);

  for (const item of packages) {
    item.version = root.version;
  }
}

/**
 * Update all packages versions independently
 */
export function independentSemver(
  packages: PackageModel[],
  command: Command
): void {
  for (const item of packages) {
    item.version = semver(item.version, command);
  }
}
