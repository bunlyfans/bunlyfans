import { Log } from "@bunlyfans/log/local";
import { PackageModel } from "./model";

const log = Log({ scope: "Writer" });

export class Writer {
  async write(...packages: PackageModel[]): Promise<void> {
    for (const item of packages) {
      try {
        const newContent = await item.file.json();
        newContent.version = item.version;
        await Bun.write(item.file, JSON.stringify(newContent, null, 2));
      } catch (error) {
        log.e(`Error while writing ${item.name}`);
        throw error;
      }
    }
  }
}
