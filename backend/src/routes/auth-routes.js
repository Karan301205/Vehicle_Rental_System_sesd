import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { loginSchema, registerSchema } from "../dto/auth-schemas.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";

export function createAuthRoutes(authService) {
  const router = Router();
  const controller = new AuthController(authService);

  router.post("/register", validateRequest(registerSchema), asyncHandler(controller.register));
  router.post("/login", validateRequest(loginSchema), asyncHandler(controller.login));
  router.get("/me", authenticate, asyncHandler(controller.me));

  return router;
}

