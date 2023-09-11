import { Color, colors } from "./colors";

export interface Config {
  scope?: string;
  disableColor?: boolean;
}

export class Logger {
  readonly warn: typeof console.log;
  readonly success: typeof console.log;
  readonly info: typeof console.log;
  readonly debug: typeof console.log;
  readonly error: typeof console.log;
  readonly log: typeof console.log;

  // Aliases
  readonly s: typeof console.log;
  readonly l: typeof console.log;
  readonly i: typeof console.log;
  readonly d: typeof console.log;
  readonly e: typeof console.log;
  readonly w: typeof console.log;
  readonly ok: typeof console.log;
  readonly o: typeof console.log;

  private readonly colorsDisabled: boolean;

  constructor(private config?: Config) {
    // TODO: add support to disable color via env variable
    this.colorsDisabled =
      config?.disableColor || !process.stdout.hasColors(256);

    this.warn = this.add("warn", console.warn, colors.yellow);
    this.success = this.add("ok", console.log, colors.green);
    this.info = this.add("info", console.log, colors.blue);
    this.debug = this.add("debug", console.debug, colors.grey);
    this.error = this.add("error", console.error); // in Bum it is red by default
    this.log = this.add("log", console.log);

    // Aliases
    this.s = this.success;
    this.l = this.log;
    this.i = this.info;
    this.d = this.debug;
    this.e = this.error;
    this.w = this.warn;
    this.ok = this.success;
    this.o = this.success;
  }

  private add<T>(
    type: string,
    method: typeof console.log,
    color?: Color
  ): typeof console.log {
    let typePrefix: string | undefined;
    let scopePrefix: string | undefined;

    if (this.colorsDisabled) {
      color = undefined;

      // By default always display prefix when colors are not supported
      typePrefix = asPrefix(type.toUpperCase());
    }

    if (this.config?.scope) {
      scopePrefix = asPrefix(this.config.scope);
    }

    const prefix = [typePrefix, scopePrefix].filter(Boolean).join("");

    return (...data: any[]) => {
      // Primitive be colored by terminal or Bun
      // But we want to apply color to it anyway, so it is converted to string
      const primitive = asPrimitive(data);

      // If it is not a primitive type, we should just call original method for it
      // in that way Bun (or terminal) will apply color to type and format it @see Bun.inspect
      if (primitive) {
        const coloredMessage = tryWithColor(prefix + primitive, color);
        method(coloredMessage);
      } else {
        method(...data);
      }
    };
  }
}

/**
 * If color is not passed or not supported - just return message
 */
function tryWithColor(message: string, color?: Color) {
  return color ? color.wrap(message) : message;
}

function asPrefix(label: string): string {
  return `[${label}]\t`;
}

/**
 * Non string primitives also should be converted to string, so color will be applied to them
 */
function asPrimitive(data: any[]): string | undefined {
  if (data.length === 1) {
    const item = data[0];
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
    ) {
      return item.toString();
    }
    if (item === undefined) {
      return "undefined";
    }
    if (item === null) {
      return "null";
    }
  }
  return undefined;
}
