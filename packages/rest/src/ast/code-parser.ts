import { SupportedInnerTypes, SupportedSource } from "./resolver";

/**
 * NOTE:
 *
 * The whole file is a temporarry workaround until Bun will provide API to parse AST.
 */

/**
 * Argument definition interface
 */
export interface Argument {
  name: string;
  type: string;
  source: SupportedSource;
  innerType: SupportedInnerTypes;
}

/**
 * Parses source code of controller/callback and returns array of params with types.
 */
export async function parseArgumentsFromFunction(
  path: string,
  callback: Function,
  method: string
): Promise<Argument[]> {
  if (typeof callback !== "function") {
    throw new Error(
      `${method} in ${path} is not a function, invalid implementation`
    );
  }

  // import code as string to parse AST
  const file = Bun.file(path);
  const sourceCode = await file.text();

  // extract args from callback which will be executed
  // when converted to str - first line contains all arguments
  const stringRepresentation = callback.toString().split("\n")[0];
  const isAsync = stringRepresentation.startsWith("async");
  const args = stringRepresentation
    .slice(stringRepresentation.indexOf("(") + 1, stringRepresentation.indexOf(")"))
    .split(", ");

  // extract args types from source code
  const lookupCode = `export ${isAsync ? "async " : ""}function ${method}`;
  const functionStart = sourceCode.indexOf(lookupCode);
  if (functionStart === -1) {
    throw new Error(`Function declaration for ${method} method not found, maybe you used arrow function?`);
  }

  const argsString = extractParamsString(sourceCode.slice(functionStart));
  if (!argsString) {
    throw new Error(
      "Not found args within () in function definition. How is it possible?"
    );
  }

  const argsDeclarations = parseParamsString(argsString.slice(1, -1));
  for (const param of argsDeclarations) {
    if (!param.source || !param.innerType) {
      throw new Error(
        `Invalid arg: ${param.name} with type \`${param.type}\`. Not able to parse source or innerType.`
      );
    }
  }

  for (const arg of args) {
    const parsedArg = argsDeclarations.find((param) => param.name === arg);
    if (!parsedArg) {
      throw new Error(
        `Argument (${arg}) was not parsed from (${argsString}) in ${path}`
      );
    }
  }

  return argsDeclarations as Argument[];
}

/**
 * Extracts string between first `()` from input string with zero depth.
 *
 * Input string is a code of function, so it can contain nested `()`.
 *
 * @example
 * ```
 * export function DELETE<T = ([{ a: number }])>(id: JSON<T>) {
 * ```
 */
function extractParamsString(func: string): string | undefined {
  let depth = 0;
  let start = -1;
  let end = -1;
  const openChars = "(<{[";
  const closeChars = ")>}]";

  for (let i = 0; i < func.length; i++) {
    const char = func[i];
    if (openChars.includes(char)) {
      if (depth === 0) {
        start = i;
      }
      depth++;
    } else if (closeChars.includes(char)) {
      depth--;
      if (depth === 0) {
        if (func[start] !== "(") {
          depth = 0;
          start = -1;
          end = -1;
          continue;
        }
        end = i;
        break;
      }
    }
  }

  if (start !== -1 && end !== -1) {
    return func.substring(start, end + 1);
  } else {
    return undefined;
  }
}

/**
 * Converts string like `id: JSON<number>, name: Param<string>` to array of objects like:
 *
 * ```
 * [
 *  { name: "id", type: "JSON<number>", source: "JSON", innerType: "<number>" },
 *  { name: "name", type: "Param<string>", source: "Param", innerType: "<string>" },
 * ]
 * ```
 */
function parseParamsString(params: string): Partial<Argument>[] {
  const paramsArray = [];
  let currentParam = "";
  let depth = 0;

  for (let i = 0; i < params.length; i++) {
    const char = params[i];

    if (char === "(" || char === "{" || char === "<") {
      depth++;
    } else if (char === ")" || char === "}" || char === ">") {
      depth--;
    }

    if (char === "," && depth === 0) {
      paramsArray.push(currentParam.trim());
      currentParam = "";
    } else {
      currentParam += char;
    }
  }

  if (currentParam.trim()) {
    paramsArray.push(currentParam.trim());
  }

  return paramsArray.map((param) => {
    const colonIndex = param.indexOf(":");
    const name = param.substring(0, colonIndex).trim();
    const type = param.substring(colonIndex + 1).trim();

    const sourceMatch = type.match(/\w+/);
    const innerType = type.match(/\<.+\>/);

    return <Argument>{
      name,
      type,
      source: sourceMatch ? sourceMatch[0] : undefined,
      innerType: innerType ? innerType[0] : undefined,
    };
  });
}
