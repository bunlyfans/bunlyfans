export type Command = "major" | "minor" | "patch";

export function semver(version: string, command: Command): string {
  const versionParts = version.split(".").map(Number);
  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    throw new Error("Invalid version format");
  }

  switch (command) {
    case "major":
      versionParts[0]++;
      versionParts[1] = 0;
      versionParts[2] = 0;
      break;
    case "minor":
      versionParts[1]++;
      versionParts[2] = 0;
      break;
    case "patch":
      versionParts[2]++;
      break;
    default:
      throw new Error("Invalid command");
  }

  return versionParts.join(".");
}
