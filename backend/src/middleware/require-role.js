import { AppError } from "../utils/app-error.js";

export function requireRole(...roles) {
  return (request, _response, next) => {
    if (!request.user) {
      return next(new AppError("Authentication is required", 401));
    }

    if (!roles.includes(request.user.role)) {
      return next(new AppError("You do not have access to this resource", 403));
    }

    next();
  };
}

