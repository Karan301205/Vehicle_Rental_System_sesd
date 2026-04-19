import { AppError } from "../utils/app-error.js";

export function validateRequest(schema) {
  return (request, _response, next) => {
    const parsed = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query
    });

    if (!parsed.success) {
      return next(new AppError(parsed.error.issues[0]?.message ?? "Invalid request", 400));
    }

    request.validated = parsed.data;
    next();
  };
}

