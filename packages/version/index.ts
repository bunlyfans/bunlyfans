import { Log } from "@bunlyfans/log/scoped";
import { Manager } from "./src/manager";
import { Reader } from "./src/reader";
import { Writer } from "./src/writer";
import { Strategy } from "./src/monorepo";

// TODO: cover with tests

const log = Log({ scope: "" });

const args = process.argv.slice(2);

const [command, ...options] = args;

async function cli(command: string, options: string[]) {
  switch (command) {
    case "major":
      log.i("Incrementing major version...");
      break;
    case "minor":
      log.i("Incrementing minor version...");
      break;
    case "patch":
      log.i("Incrementing patch version...");
      break;
    default:
      log.e('Invalid command. Use "major", "minor", or "patch".');
      process.exit(1);
  }

  const manager = new Manager(new Reader(process.cwd()), new Writer());

  await manager.read();

  if (options.includes("--independent") || options.includes("-i")) {
    log.i("Independent strategy selected");
    await manager.up(Strategy.Independent, command);
  } else if (options.includes("--simultaneous") || options.includes("-s")) {
    log.i("Simultaneous strategy selected");
    await manager.up(Strategy.Simultaneous, command);
  } else {
    log.i("Trying to update package [" + options[0] + "] only");
    await manager.upOnly(options[0], command);
  }

  await manager.prettyprint();

  log.o("Done!");
}

await cli(command, options);
