import { STATUS_CODES } from "http";

enum STATUS_CODE {
  METHOD_NOT_ALLOWED = 405,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Shorthand for creating a response with an error status code.
 */
export const res = {
  methodNotAllowed: errorFactory.bind(null, STATUS_CODE.METHOD_NOT_ALLOWED),
  notFound: errorFactory.bind(null, STATUS_CODE.NOT_FOUND),
  internalServerError: errorFactory.bind(
    null,
    STATUS_CODE.INTERNAL_SERVER_ERROR
  ),
  error: errorFactory,
};

function errorFactory(code: number, message?: string | Object) {
  if (typeof message === "object") {
    return Response.json(message, {
      status: code,
    });
  }
  const responseText = message || STATUS_CODES[code];
  return new Response(responseText, {
    status: code,
  });
}
