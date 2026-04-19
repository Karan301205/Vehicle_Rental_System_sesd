import { Router } from "express";
import { BookingController } from "../controllers/BookingController.js";
import { bookingFilterSchema, bookingIdSchema } from "../dto/booking-schemas.js";
import { UserRole } from "../domain/enums/user-role.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/require-role.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";

export function createAdminRoutes(bookingService) {
  const router = Router();
  const controller = new BookingController(bookingService);

  router.use(authenticate, requireRole(UserRole.ADMIN));
  router.get("/bookings", validateRequest(bookingFilterSchema), asyncHandler(controller.listAll));
  router.patch("/bookings/:id/approve", validateRequest(bookingIdSchema), asyncHandler(controller.approve));

  return router;
}

