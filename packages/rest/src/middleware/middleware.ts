export type ProcessContext = {
  // ... other context properties
};

export abstract class PreMiddleware {
  abstract preProcess(
    request: Request,
    context: ProcessContext
  ): void | Promise<void> | Request | Promise<Request>;
}

export abstract class PostMiddleware {
  abstract postProcess(
    request: Request,
    response: Response,
    context: ProcessContext
  ): void | Promise<void> | Response | Promise<Response>;
}

export abstract class ErrorHandler {
  abstract handle(
    request: Request,
    response: Response,
    context: ProcessContext
  ): void | Promise<void> | Response | Promise<Response>;
}

export type Middleware = PreMiddleware | PostMiddleware;
