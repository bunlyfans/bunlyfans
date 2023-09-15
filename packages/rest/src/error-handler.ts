import { Log } from "@bunlyfans/log/scoped";
import { res } from "..";

export async function errorHandler(
  log: ReturnType<typeof Log>,
  responseOrError: unknown
): Promise<Response> {
  const error = responseOrError;
  if (error instanceof Response) {
    // Clone the response to be able to read the body
    const clonned = error.clone();
    log.e(`${error.status}\t${await clonned.text()}`);

    return error;
  }

  log.e("Unexpected exception:");
  log.e(error);

  return res.internalServerError();
}
