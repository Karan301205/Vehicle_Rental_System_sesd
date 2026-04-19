import { Router } from "express";
import { BookingController } from "../controllers/BookingController.js";
import { bookingFilterSchema, bookingIdSchema, createBookingSchema } from "../dto/booking-schemas.js";
import { UserRole } from "../domain/enums/user-role.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/require-role.js";
import { validateRequest } from "../middleware/validate-request.js";
import { asyncHandler } from "../utils/async-handler.js";

export function createBookingRoutes(bookingService) {
  const router = Router();
  const controller = new BookingController(bookingService);

  router.post(
    "/",
    authenticate,
    requireRole(UserRole.CUSTOMER),
    validateRequest(createBookingSchema),
    asyncHandler(controller.create)
  );
  router.get("/me", authenticate, requireRole(UserRole.CUSTOMER), asyncHandler(controller.listMine));
  router.patch(
    "/:id/cancel",
    authenticate,
    requireRole(UserRole.CUSTOMER),
    validateRequest(bookingIdSchema),
    asyncHandler(controller.cancel)
  );

  return router;
}

