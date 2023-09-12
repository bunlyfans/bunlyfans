import { MatchedRoute } from "bun";
import { STATUS_CODES } from "http";

export enum STATUS_CODE {
  METHOD_NOT_ALLOWED = 405,
  NOT_FOUND = 404,
}

export type Route = (
  req: Request,
  route: MatchedRoute
) => void | Promise<void> | Response | Promise<Response>;

export class ErrorResponse extends Response {
  constructor(
    status: Response["status"] | STATUS_CODE,
    statusText = STATUS_CODES[status],
    body?: any
  ) {
    // TODO: Revert when status text will be supported
    // super(body || statusText, { status, statusText: "test" });

    super(JSON.stringify(body || statusText), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static methodNotAllowed() { return new ErrorResponse(STATUS_CODE.METHOD_NOT_ALLOWED); }

  static notFound() { return new ErrorResponse(STATUS_CODE.NOT_FOUND); }
}
