import { Log } from "@bunlyfans/log/scoped";
import { RequestContext } from "../..";
import { Argument } from "./code-parser";

export type Query<T> = T;
export type Param<T> = T;
export type JSON<T> = T;

// TODO: add support for other sources and add docs
export type SupportedSource = "JSON" | "Param" | "Query";

// TODO: add support for other types
export type SupportedInnerTypes = "<number>" | "<string>" | "<boolean>";

const log = Log({ scope: "ArgsResolver" });

export async function resolveArgumentFromContext(
  arg: Argument,
  context: RequestContext
): Promise<unknown> {
  const value = await resolveValue(arg, context);

  return parseValue(arg, value);
}

async function resolveValue(
  arg: Argument,
  context: RequestContext
): Promise<unknown> {
  switch (arg.source) {
    case "JSON":
      return context.request.json();
    case "Param":
      // TODO: throw if required and empty
      return context.route.params[arg.name];
    case "Query":
      // TODO: throw if required and empty
      return context.route.query[arg.name];
    default:
      log.e(`Unknown source: ${arg.source} for argument ${arg.name}, value will be undefined`);
      break;
  }
}

async function parseValue(arg: Argument, value: unknown): Promise<unknown> {
  switch (arg.innerType) {
    case "<number>":
      const result = Number(value);
      if (isNaN(result)) {
        throw new Error(
          `Failed to parse ${arg.name} with value ${value} as number`
        );
      }
      return result;
    case "<boolean>":
      return Boolean(value);
    default:
      return value;
  }
}
